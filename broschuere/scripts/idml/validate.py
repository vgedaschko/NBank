#!/usr/bin/env python3
"""Unabhängige Strukturprüfung eines IDML-Pakets (ohne InDesign), ergänzend zu check.cjs.

Aufruf (Python mit lxml, fontTools, pypdf; SimpleIDML optional):
  python -I scripts/idml/validate.py dist/indesign/Datei.idml
        [--refs DIR]          Referenz-IDMLs (echte InDesign-Exporte): Vokabular, DOMVersion, Namensräume, Werte
        [--compare DIR2]      zweiter Exportordner: Reproduzierbarkeit (IDML-Teile, Links/, Document Fonts/)
        [--json OUT.json]     Ergebnis maschinenlesbar
        [--max N]             je Prüfpunkt höchstens N Einzelmeldungen ausgeben (Standard 12)

Prüft: ZIP-Aufbau (mimetype zuerst/STORED/ohne Extra-Feld, CRC, Namen), container.xml, XML-Deklaration und
Wohlgeformtheit, Wurzelelemente/Namensräume/DOMVersion, designmap ↔ Paketdateien (vollständig, Reihenfolge,
StoryList, Section), Self-IDs eindeutig, alle Verweise (Stories, Formate inkl. BasedOn, Farbfelder, Linienarten,
Ebenen, Musterseiten, Sprachen, Rahmenketten, Farbgruppe), Schriften (Fonts.xml ↔ AppliedFont/FontStyle ↔
TTF-Namen in „Document Fonts“, Glyphenabdeckung des tatsächlich gesetzten Texts), Koordinaten (jedes Objekt auf
seiner Seite + Beschnitt, nicht über den Bund), platzierte PDFs (Datei, gültiges PDF, Größe = GraphicBounds,
Schriften eingebettet, Inhalt über den Rahmen hinaus), Beschnittzugabe randabfallender Flächen, Tabellen (Zähler, Zellnamen „Spalte:Zeile“, Abdeckung bei Spans, Maße), Wertebereiche
und Aufzählungswerte, SimpleIDML-Ladetest.
Exit-Code 1 bei Fehlern.
"""
import argparse
import collections
import glob
import hashlib
import io
import json
import math
import os
import re
import struct
import subprocess
import sys
import unicodedata
import zipfile

from lxml import etree

PKG_NS = 'http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging'
CONTAINER_NS = 'urn:oasis:names:tc:opendocument:xmlns:container'
MIMETYPE = b'application/vnd.adobe.indesign-idml-package'
XML_DECL = b'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
PAGE_ITEMS = {'Rectangle', 'Oval', 'Polygon', 'GraphicLine', 'TextFrame', 'Group', 'Button', 'TextPath', 'EPSText', 'MultiStateObject'}
EPS = 0.05


class Report:
    def __init__(self, maxn=12):
        self.items = collections.OrderedDict()   # (level, key) -> [messages]
        self.info = collections.OrderedDict()
        self.maxn = maxn

    def add(self, level, key, msg):
        self.items.setdefault((level, key), []).append(msg)

    def err(self, key, msg):
        self.add('FEHLER', key, msg)

    def warn(self, key, msg):
        self.add('WARNUNG', key, msg)

    def note(self, key, val):
        self.info[key] = val

    def count(self, level):
        return sum(len(v) for (lv, _), v in self.items.items() if lv == level)

    def print(self):
        for k, v in self.info.items():
            print(f'INFO  {k}: {v}')
        for (lv, key), msgs in self.items.items():
            print(f'{lv} [{key}] {len(msgs)}×')
            for m in msgs[: self.maxn]:
                print(f'    - {m}')
            if len(msgs) > self.maxn:
                print(f'    … {len(msgs) - self.maxn} weitere')
        print(f'Ergebnis: {self.count("FEHLER")} Fehler, {self.count("WARNUNG")} Warnungen')

    def as_json(self):
        return {'info': self.info, 'findings': [{'level': lv, 'key': k, 'count': len(v), 'messages': v} for (lv, k), v in self.items.items()]}


# ----------------------------------------------------------------------------------------------------------------
# Hilfen
# ----------------------------------------------------------------------------------------------------------------
def local(tag):
    return tag.split('}', 1)[1] if isinstance(tag, str) and '}' in tag else tag


def nums(s):
    return [float(x) for x in s.split()]


def mat_mul(m, n):
    """m ∘ n (erst n, dann m); Matrizen als (a b c d tx ty) wie IDML/CSS."""
    a, b, c, d, e, f = m
    A, B, C, D, E, F = n
    return (a * A + c * B, b * A + d * B, a * C + c * D, b * C + d * D, a * E + c * F + e, b * E + d * F + f)


def apply(m, x, y):
    a, b, c, d, e, f = m
    return a * x + c * y + e, b * x + d * y + f


def parse_xml(data, name, rep):
    parser = etree.XMLParser(resolve_entities=False, no_network=True, huge_tree=True, remove_blank_text=False)
    try:
        return etree.fromstring(data, parser)
    except etree.XMLSyntaxError as e:
        rep.err('xml', f'{name}: nicht wohlgeformt: {e}')
        return None


# ----------------------------------------------------------------------------------------------------------------
# 1. ZIP
# ----------------------------------------------------------------------------------------------------------------
def check_zip(path, rep):
    buf = open(path, 'rb').read()
    rep.note('Paketgröße', f'{len(buf)} Byte')
    sig, ver, flag, method, mtime, mdate, crc, csize, usize, nlen, xlen = struct.unpack('<IHHHHHIIIHH', buf[:30])
    name = buf[30:30 + nlen]
    if sig != 0x04034B50:
        rep.err('zip', 'erste Signatur ist kein lokaler ZIP-Header')
    if name != b'mimetype':
        rep.err('zip', f'erster Eintrag ist {name!r}, nicht mimetype')
    if method != 0:
        rep.err('zip', f'mimetype ist komprimiert (Methode {method})')
    if xlen != 0:
        rep.err('zip', f'mimetype hat ein Extra-Feld ({xlen} Byte)')
    if flag & 0x08:
        rep.err('zip', 'mimetype nutzt Data Descriptor (Bit 3)')
    if flag & 0x01:
        rep.err('zip', 'mimetype verschlüsselt')
    data_off = 30 + nlen + xlen
    if data_off != 38:
        rep.err('zip', f'Inhalt von mimetype beginnt bei Byte {data_off} statt 38')
    if buf[data_off:data_off + usize] != MIMETYPE or usize != len(MIMETYPE) or csize != usize:
        rep.err('zip', f'mimetype-Inhalt falsch: {buf[data_off:data_off + usize]!r}')
    try:
        zf = zipfile.ZipFile(io.BytesIO(buf))
    except zipfile.BadZipFile as e:
        rep.err('zip', f'ZIP nicht lesbar: {e}')
        return None, {}
    infos = zf.infolist()
    bad = zf.testzip()
    if bad:
        rep.err('zip', f'CRC-Fehler in {bad}')
    if infos[0].filename != 'mimetype':
        rep.err('zip', 'zentrales Verzeichnis: mimetype nicht zuerst')
    if infos[0].extra:
        rep.err('zip', 'zentrales Verzeichnis: mimetype mit Extra-Feld')
    names = [i.filename for i in infos]
    dup = [n for n, c in collections.Counter(names).items() if c > 1]
    if dup:
        rep.err('zip', f'doppelte Einträge: {dup[:5]}')
    for i in infos:
        if i.flag_bits & 0x01:
            rep.err('zip', f'{i.filename}: verschlüsselt')
        if i.compress_type not in (0, 8):
            rep.err('zip', f'{i.filename}: Kompressionsmethode {i.compress_type}')
        if i.filename.startswith('/') or '..' in i.filename.split('/') or '\\' in i.filename:
            rep.err('zip', f'unzulässiger Name {i.filename}')
        if i.filename.endswith('/'):
            rep.warn('zip', f'Verzeichniseintrag {i.filename}')
        if re.search(r'[^\x20-\x7e]', i.filename):
            rep.warn('zip', f'Nicht-ASCII-Name {i.filename!r}')
    files = {i.filename: zf.read(i.filename) for i in infos}
    rep.note('ZIP-Einträge', len(infos))
    return zf, files


# ----------------------------------------------------------------------------------------------------------------
# 2. XML-Dateien, Wurzeln, Namensräume, DOMVersion
# ----------------------------------------------------------------------------------------------------------------
EXPECTED_ROOT = [
    (r'^Resources/Graphic\.xml$', 'Graphic'), (r'^Resources/Fonts\.xml$', 'Fonts'), (r'^Resources/Styles\.xml$', 'Styles'),
    (r'^Resources/Preferences\.xml$', 'Preferences'), (r'^MasterSpreads/.+\.xml$', 'MasterSpread'), (r'^Spreads/.+\.xml$', 'Spread'),
    (r'^Stories/.+\.xml$', 'Story'), (r'^XML/BackingStory\.xml$', 'BackingStory'), (r'^XML/Tags\.xml$', 'Tags'), (r'^XML/Mapping\.xml$', 'Mapping'),
]


def check_xml(files, rep):
    trees = {}
    domv = collections.Counter()
    for name, data in files.items():
        if not name.endswith('.xml'):
            continue
        if not data.startswith(XML_DECL):
            rep.err('xml', f'{name}: XML-Deklaration fehlt/abweichend: {data[:60]!r}')
        if data.startswith(b'\xef\xbb\xbf'):
            rep.err('xml', f'{name}: UTF-8-BOM')
        try:
            text = data.decode('utf-8')
        except UnicodeDecodeError as e:
            rep.err('xml', f'{name}: kein gültiges UTF-8: {e}')
            continue
        bad = re.search('[\ufffe\uffff\ud800-\udfff]', text)
        if bad:
            rep.err('xml', f'{name}: unzulässiges Zeichen U+{ord(bad.group()):04X}')
        root = parse_xml(data, name, rep)
        if root is None:
            continue
        trees[name] = root
        if name == 'META-INF/container.xml':
            continue
        if name == 'META-INF/metadata.xml':
            continue
        if name == 'designmap.xml':
            if root.tag != 'Document':
                rep.err('xml', f'designmap.xml: Wurzel {root.tag}')
            if root.nsmap.get('idPkg') != PKG_NS:
                rep.err('ns', 'designmap.xml: xmlns:idPkg fehlt/falsch')
            domv[root.get('DOMVersion')] += 1
            continue
        exp = next((t for rx, t in EXPECTED_ROOT if re.match(rx, name)), None)
        if exp is None:
            rep.warn('xml', f'{name}: unbekannte Paketdatei')
            continue
        if root.tag != f'{{{PKG_NS}}}{exp}':
            rep.err('ns', f'{name}: Wurzel {root.tag}, erwartet idPkg:{exp}')
        if root.prefix != 'idPkg':
            rep.err('ns', f'{name}: Präfix {root.prefix!r} statt idPkg')
        if set(root.nsmap) - {'idPkg'}:
            rep.warn('ns', f'{name}: weitere Namensräume {dict(root.nsmap)}')
        domv[root.get('DOMVersion')] += 1
    if len(domv) != 1:
        rep.err('ns', f'DOMVersion uneinheitlich: {dict(domv)}')
    rep.note('DOMVersion', dict(domv))
    # container.xml
    c = trees.get('META-INF/container.xml')
    if c is None:
        rep.err('container', 'META-INF/container.xml fehlt')
    else:
        rf = c.findall(f'.//{{{CONTAINER_NS}}}rootfile')
        if c.tag != f'{{{CONTAINER_NS}}}container' or len(rf) != 1 or rf[0].get('full-path') != 'designmap.xml' or rf[0].get('media-type') != 'text/xml':
            rep.err('container', f'container.xml abweichend: {etree.tostring(c)[:200]!r}')
    if 'META-INF/metadata.xml' in files and 'META-INF/metadata.xml' not in trees:
        rep.err('xml', 'metadata.xml nicht wohlgeformt')
    return trees


# ----------------------------------------------------------------------------------------------------------------
# 3. designmap ↔ Dateien
# ----------------------------------------------------------------------------------------------------------------
DM_ORDER = ['Properties', 'Language', 'idPkg:Graphic', 'idPkg:Fonts', 'KinsokuTable', 'MojikumiTable', 'idPkg:Styles', 'NumberingList', 'NamedGrid',
            'idPkg:Preferences', '*prefs', 'idPkg:Tags', 'Layer', 'idPkg:MasterSpread', 'idPkg:Spread', 'Section', '*after-section', 'idPkg:BackingStory',
            'idPkg:Story', 'idPkg:Mapping', '*tail']


def dm_name(el):
    t = el.tag
    if isinstance(t, str) and t.startswith('{' + PKG_NS):
        return 'idPkg:' + local(t)
    return t


def check_designmap(files, trees, rep):
    dm = trees.get('designmap.xml')
    if dm is None:
        rep.err('designmap', 'designmap.xml fehlt/unlesbar')
        return None
    raw = files['designmap.xml'].decode('utf-8')
    m = re.match(r'<\?xml[^>]*\?>\s*<\?aid ([^?]*)\?>\s*<Document', raw)
    if not m:
        rep.err('designmap', '<?aid …?> fehlt direkt vor <Document>')
    else:
        pi = dict(re.findall(r'(\w+)="([^"]*)"', m.group(1)))
        if pi.get('type') != 'document' or pi.get('style') != '50':
            rep.err('designmap', f'aid-PI abweichend: {pi}')
        prod = pi.get('product', '')
        if not prod.startswith((dm.get('DOMVersion') or '?') + '('):
            rep.warn('designmap', f'aid product={prod} passt nicht zu DOMVersion={dm.get("DOMVersion")}')
        rep.note('aid', pi)
    srcs = []
    for el in dm:
        if not isinstance(el.tag, str):
            continue
        s = el.get('src')
        if s is not None:
            srcs.append((dm_name(el), s))
    pkg_files = [n for n in files if n not in ('mimetype', 'designmap.xml') and not n.startswith('META-INF/')]
    src_set = [s for _, s in srcs]
    for k, s in srcs:
        if s not in files:
            rep.err('designmap', f'{k} src={s}: Datei fehlt im Paket')
    for f in pkg_files:
        if f not in src_set:
            rep.err('designmap', f'Paketdatei nicht in designmap: {f}')
    for s, c in collections.Counter(src_set).items():
        if c > 1:
            rep.err('designmap', f'{s} {c}× verwiesen')
    for k, s in srcs:
        exp = {'idPkg:Spread': 'Spreads/', 'idPkg:Story': 'Stories/', 'idPkg:MasterSpread': 'MasterSpreads/'}.get(k)
        if exp and not s.startswith(exp):
            rep.err('designmap', f'{k} verweist auf {s}')
    # Reihenfolge der Kindelemente
    known = {k for k in DM_ORDER if not k.startswith('*')}
    seq = []
    for el in dm:
        if not isinstance(el.tag, str):
            continue
        n = dm_name(el)
        if n in known and n not in ('Properties', 'NumberingList', 'NamedGrid', 'KinsokuTable', 'MojikumiTable', 'Section'):
            seq.append(DM_ORDER.index(n))
    for i in range(1, len(seq)):
        if seq[i] < seq[i - 1]:
            rep.warn('designmap', f'Reihenfolge: {DM_ORDER[seq[i]]} nach {DM_ORDER[seq[i - 1]]}')
            break
    return dm


# ----------------------------------------------------------------------------------------------------------------
# 4. Self-IDs und Verweise
# ----------------------------------------------------------------------------------------------------------------
REF_PREFIX = re.compile(r'^(Color|Swatch|Gradient|Tint|MixedInk|MixedInkGroup|ParagraphStyle|CharacterStyle|ObjectStyle|TableStyle|CellStyle|StrokeStyle|'
                        r'TrapPreset|Language|XMLTag|NumberingList|TOCStyle|ColorGroup|Ink|Condition|ConditionSet|NamedGrid|CompositeFont|'
                        r'KinsokuTable|MojikumiTable|AutoCorrectList|DashedStrokeStyle|DottedStrokeStyle|StripedStrokeStyle|ArrowHead)/')
ID_ATTRS = {'ParentStory', 'ItemLayer', 'AppliedMaster', 'NextTextFrame', 'PreviousTextFrame', 'PageStart', 'ActiveLayer', 'SwatchItemRef',
            'StoryList', 'XMLContent', 'MarkupTag', 'AppliedTOCStyle', 'AppliedNamedGrid', 'PrimaryTextFrame', 'NextStyle'}
NOT_REFS = {'Self', 'Name', 'Content', 'src', 'LinkResourceURI', 'AssetURL', 'AssetID', 'FullName', 'FullNameNative', 'FontStyleName', 'FontStyleNameNative',
            'PostScriptName', 'FontFamily', 'PlatformName', 'TypekitID', 'Version', 'KeyboardShortcut', 'ImageTypeName', 'LinkResourceFormat',
            'StoryTitle', 'AppliedLanguage', 'PrimaryLanguageName', 'SublanguageName', 'KerningMethod', 'Composer', 'AlternateColorValue'}


def index_selfs(trees, rep):
    selfs = {}
    for name, root in trees.items():
        for el in root.iter():
            if not isinstance(el.tag, str):
                continue
            s = el.get('Self')
            if s is None or local(el.tag) in ('XMLElement', 'XMLAttribute'):   # XMLElement-IDs stehen in echten Exporten mehrfach
                continue
            if s in selfs:
                rep.err('self', f'Self doppelt: {s} ({local(el.tag)} in {name} und {local(selfs[s][0].tag)} in {selfs[s][1]})')
            else:
                selfs[s] = (el, name)
            if re.search(r'\s', s) and local(el.tag) in PAGE_ITEMS | {'Story', 'Spread', 'Page', 'Layer', 'MasterSpread', 'Table', 'Cell'}:
                rep.warn('self', f'Self mit Leerraum: {s!r}')
    rep.note('Self-IDs', len(selfs))
    return selfs


def check_refs(trees, selfs, rep, implicit=frozenset()):
    names_by_kind = collections.defaultdict(set)
    for s, (el, _) in selfs.items():
        if el.get('Name') is not None:
            names_by_kind[local(el.tag)].add(el.get('Name'))
    langs = {el.get('Name') for s, (el, _) in selfs.items() if local(el.tag) == 'Language'}
    unresolved = collections.Counter()
    for name, root in trees.items():
        if name.startswith('META-INF/'):
            continue
        for el in root.iter():
            if not isinstance(el.tag, str):
                continue
            tag = local(el.tag)
            for k, v in el.attrib.items():
                if k in NOT_REFS or k.startswith('{'):
                    if k == 'AppliedLanguage' and v not in langs and v not in implicit:
                        unresolved[(k, v)] += 1
                        rep.err('verweis', f'{name}: <{tag} {k}="{v}"> – Sprache nicht in designmap')
                    continue
                vals = []
                if k in ('StoryList',):
                    vals = v.split()
                elif k in ID_ATTRS:
                    vals = [v] if v not in ('n', '') else []
                elif REF_PREFIX.match(v):
                    vals = [v]
                for x in vals:
                    if x in selfs or x in implicit:
                        continue
                    unresolved[(k, x)] += 1
                    rep.err('verweis', f'{name}: <{tag} {k}="{x}"> ungelöst')
            # Properties-Verweise: BasedOn, type="object"
            if tag == 'Properties':
                for p in el:
                    if not isinstance(p.tag, str):
                        continue
                    t = p.get('type')
                    txt = (p.text or '')
                    if t == 'object' and txt and txt != 'n' and txt not in selfs and txt not in implicit:
                        rep.err('verweis', f'{name}: <{local(p.tag)} type=object>{txt}</…> ungelöst')
                    if local(p.tag) == 'BasedOn' and t == 'string':
                        owner = local(el.getparent().tag)
                        if txt not in names_by_kind.get(owner, set()):
                            rep.err('verweis', f'{name}: {owner} BasedOn „{txt}“ – kein {owner} mit diesem Namen')
    return unresolved


# ----------------------------------------------------------------------------------------------------------------
# 5. Formate, Farbfelder, Ebenen, Musterseiten
# ----------------------------------------------------------------------------------------------------------------
def check_resources(trees, selfs, dm, rep):
    styles = trees.get('Resources/Styles.xml')
    graphic = trees.get('Resources/Graphic.xml')
    for kind in ('ParagraphStyle', 'CharacterStyle', 'ObjectStyle', 'TableStyle', 'CellStyle'):
        els = [e for e in styles.iter(kind)] if styles is not None else []
        names = collections.Counter(e.get('Name') for e in els)
        for n, c in names.items():
            if c > 1:
                rep.err('format', f'{kind}: Name „{n}“ {c}×')
        low = collections.Counter(n.lower() for n in names)
        for n, c in low.items():
            if c > 1:
                rep.warn('format', f'{kind}: Namen unterscheiden sich nur in Groß/Kleinschreibung: {n}')
        for e in els:
            s, n = e.get('Self'), e.get('Name')
            if s != f'{kind}/' + n.replace(':', '%3a'):
                rep.err('format', f'{kind}: Self „{s}“ passt nicht zu Name „{n}“')
            if re.search(r'[:/\\%\[\]]', n) and not n.startswith('$ID/'):
                rep.warn('format', f'{kind}: Sonderzeichen im Namen „{n}“')
        for need in {'ParagraphStyle': ['ParagraphStyle/$ID/[No paragraph style]', 'ParagraphStyle/$ID/NormalParagraphStyle'],
                     'CharacterStyle': ['CharacterStyle/$ID/[No character style]'], 'ObjectStyle': ['ObjectStyle/$ID/[None]'],
                     'TableStyle': ['TableStyle/$ID/[No table style]'], 'CellStyle': ['CellStyle/$ID/[None]']}[kind]:
            if need not in selfs:
                rep.err('format', f'Pflichtformat fehlt: {need}')
        rep.note(f'{kind}s', len(els))
    if styles is not None:
        order = [local(e.tag) for e in styles if isinstance(e.tag, str)]
        exp = ['RootCharacterStyleGroup', 'RootParagraphStyleGroup', 'TOCStyle', 'RootCellStyleGroup', 'RootTableStyleGroup', 'RootObjectStyleGroup', 'TrapPreset']
        idx = [exp.index(o) for o in order if o in exp]
        if idx != sorted(idx):
            rep.warn('format', f'Styles.xml Reihenfolge {order}')
    # Farbfelder
    if graphic is not None:
        colors = [e for e in graphic if local(e.tag) in ('Color', 'Swatch', 'Gradient', 'Tint', 'MixedInk')]
        for need in ('Color/Black', 'Color/Paper', 'Color/Registration', 'Swatch/None'):
            if need not in selfs:
                rep.err('farbe', f'Pflichtfarbfeld fehlt: {need}')
        for ink in ('Ink/$ID/Process Cyan', 'Ink/$ID/Process Magenta', 'Ink/$ID/Process Yellow', 'Ink/$ID/Process Black'):
            if ink not in selfs:
                rep.err('farbe', f'Druckfarbe fehlt: {ink}')
        nm = collections.Counter(e.get('Name') for e in colors if e.get('Name') not in ('$ID/', ''))
        for n, c in nm.items():
            if c > 1:
                rep.err('farbe', f'Farbfeldname „{n}“ {c}×')
        reserved = {'black', 'paper', 'registration', 'none'}
        lowmap = collections.defaultdict(list)
        for e in colors:
            if e.get('Name') not in ('$ID/', '', None):
                lowmap[e.get('Name').lower()].append(e.get('Name'))
        for k, v in lowmap.items():
            if len(v) > 1:
                rep.warn('farbe', f'Farbfeldnamen nur in Groß/Kleinschreibung verschieden: {v}' + (' (reservierter InDesign-Name)' if k in reserved else ''))
        for e in colors:
            if local(e.tag) != 'Color':
                continue
            sp, cv = e.get('Space'), e.get('ColorValue', '')
            try:
                v = nums(cv)
            except ValueError:
                rep.err('farbe', f'{e.get("Self")}: ColorValue „{cv}“')
                continue
            if sp == 'RGB' and (len(v) != 3 or any(x < 0 or x > 255 for x in v)):
                rep.err('farbe', f'{e.get("Self")}: RGB-Wert {cv}')
            if sp == 'CMYK' and (len(v) != 4 or any(x < 0 or x > 100 for x in v)):
                rep.err('farbe', f'{e.get("Self")}: CMYK-Wert {cv}')
            if e.get('Model') == 'Spot':
                rep.warn('farbe', f'{e.get("Self")}: Sonderfarbe')
        # Farbgruppe
        grp = [e for e in dm.iter('ColorGroup')] if dm is not None else []
        if not grp:
            rep.warn('farbe', 'keine ColorGroup in designmap (ab CC 2015 üblich)')
        else:
            refs = [c.get('SwatchItemRef') for g in grp for c in g.iter('ColorGroupSwatch')]
            vis = [e.get('Self') for e in colors if e.get('Visible', 'true') == 'true' and local(e.tag) in ('Color', 'Swatch', 'Gradient', 'Tint', 'MixedInk')]
            miss = [s for s in vis if s not in refs]
            if miss:
                rep.warn('farbe', f'{len(miss)} sichtbare Farbfelder nicht in der Farbgruppe: {miss[:6]}')
            dup = [s for s, c in collections.Counter(refs).items() if c > 1]
            if dup:
                rep.err('farbe', f'Farbgruppe nennt doppelt: {dup[:5]}')
        rep.note('Farbfelder', len([e for e in colors if local(e.tag) == 'Color']))
    # Ebenen
    if dm is not None:
        layers = [e for e in dm.iter('Layer')]
        ln = collections.Counter(e.get('Name') for e in layers)
        for n, c in ln.items():
            if c > 1:
                rep.err('ebene', f'Ebenenname „{n}“ {c}×')
        rep.note('Ebenen (oben→unten)', [e.get('Name') for e in layers])


# ----------------------------------------------------------------------------------------------------------------
# 6. Wertebereiche und Aufzählungswerte
# ----------------------------------------------------------------------------------------------------------------
RANGES = {
    'PointSize': (0.1, 1296), 'Tracking': (-1000, 10000), 'BaselineShift': (-5000, 5000), 'HorizontalScale': (1, 1000), 'VerticalScale': (1, 1000),
    'SpaceBefore': (0, 8640), 'SpaceAfter': (0, 8640), 'LeftIndent': (-8640, 8640), 'RightIndent': (-8640, 8640), 'FirstLineIndent': (-8640, 8640),
    'HyphenateWordsLongerThan': (3, 25), 'HyphenateAfterFirst': (1, 15), 'HyphenateBeforeLast': (1, 15), 'HyphenateLadderLimit': (0, 25),
    'HyphenationZone': (0, 8640), 'DropCapLines': (0, 25), 'DropCapCharacters': (0, 150), 'KeepFirstLines': (1, 50), 'KeepLastLines': (1, 50),
    'StrokeWeight': (0, 1000), 'FillTint': (-1, 100), 'StrokeTint': (-1, 100), 'Opacity': (0, 100), 'MinimumFirstBaselineOffset': (0, 8640),
    'TextColumnCount': (1, 40), 'TextColumnGutter': (0, 1440), 'TopInset': (0, 8640), 'BottomInset': (0, 8640), 'LeftInset': (0, 8640), 'RightInset': (0, 8640),
    'SingleRowHeight': (0, 8640), 'MinimumHeight': (0, 8640), 'SingleColumnWidth': (0, 8640), 'ColumnCount': (1, 216), 'ColumnGutter': (0, 1440),
    'TopLeftCornerRadius': (0, 8640), 'TopRightCornerRadius': (0, 8640), 'BottomLeftCornerRadius': (0, 8640), 'BottomRightCornerRadius': (0, 8640),
    'PageNumberStart': (1, 999999),
}
LEADING_RANGE = (0, 5000)


def check_values(trees, rep):
    for name, root in trees.items():
        if name.startswith('META-INF/'):
            continue
        for el in root.iter():
            if not isinstance(el.tag, str):
                continue
            tag = local(el.tag)
            for k, v in el.attrib.items():
                if k in RANGES and not (k in ('SpaceBefore', 'SpaceAfter') and tag not in ('ParagraphStyle', 'ParagraphStyleRange', 'CharacterStyleRange')):
                    try:
                        x = float(v)
                    except ValueError:
                        continue
                    lo, hi = RANGES[k]
                    if not (lo <= x <= hi) or math.isnan(x):
                        rep.err('wert', f'{name}: <{tag} {k}="{v}"> außerhalb {lo}…{hi}')
                if k in ('ItemTransform', 'MasterPageTransform'):
                    try:
                        m = nums(v)
                        if len(m) != 6 or any(math.isnan(x) or math.isinf(x) for x in m):
                            raise ValueError
                    except ValueError:
                        rep.err('wert', f'{name}: <{tag} {k}="{v}">')
            if tag == 'Leading' and el.get('type') == 'unit':
                x = float(el.text)
                if not (LEADING_RANGE[0] <= x <= LEADING_RANGE[1]):
                    rep.err('wert', f'{name}: Leading {x}')
            if tag in ('ParagraphStyle', 'ParagraphStyleRange', 'CharacterStyleRange'):
                li, fi = el.get('LeftIndent'), el.get('FirstLineIndent')
                if li is not None and fi is not None and float(li) + float(fi) < -0.01:
                    rep.warn('wert', f'{name}: <{tag}> LeftIndent {li} + FirstLineIndent {fi} < 0')


def collect_vocab(trees):
    voc = collections.defaultdict(lambda: collections.defaultdict(collections.Counter))
    kids = collections.defaultdict(set)
    for name, root in trees.items():
        if name.startswith('META-INF/'):
            continue
        for el in root.iter():
            if not isinstance(el.tag, str):
                continue
            tag = local(el.tag)
            for k, v in el.attrib.items():
                voc[tag][k][v] += 1
            if tag == 'Properties' or local(el.getparent().tag if el.getparent() is not None else '') == 'Properties':
                pass
            par = el.getparent()
            if par is not None and isinstance(par.tag, str):
                kids[local(par.tag)].add(tag)
    return voc, kids


ENUM_RX = re.compile(r'^(\$ID/)?[A-Za-z][A-Za-z0-9 ]*$')
ID_RX = re.compile(r'^(u|di)[0-9a-f]+$')
# Attribute/Elemente, die in den Referenz-IDMLs nicht vorkommen, aber gültige InDesign-DOM-Eigenschaften sind
# (Scripting-DOM CC 2020: TextStyleRange/Paragraph/Table/Cell/PDF/PDFAttribute/PageItem). Alles andere → Warnung.
VETTED = {
    '*': {'StoryTitle', 'FillColor', 'FillTint', 'StrokeColor', 'StrokeTint', 'StrokeType', 'StrokeWeight', 'StrokeAlignment', 'EndCap',
          'AppliedLanguage', 'NoBreak', 'OTFFigureStyle', 'FirstLineIndent', 'LeftIndent', 'RightIndent', 'KeepAllLinesTogether',
          'KeepLinesTogether', 'StartParagraph', 'SpaceBefore', 'SpaceAfter', 'Justification', 'Hyphenation', 'Tracking', 'BaselineShift',
          'PointSize', 'FontStyle', 'Capitalization', 'Underline', 'StrikeThru', 'DropCapLines', 'DropCapCharacters', 'Position',
          'TopLeftCornerOption', 'TopRightCornerOption', 'BottomLeftCornerOption', 'BottomRightCornerOption',
          'TopLeftCornerRadius', 'TopRightCornerRadius', 'BottomLeftCornerRadius', 'BottomRightCornerRadius'},
    'Table': {'Self', 'HeaderRowCount', 'FooterRowCount', 'BodyRowCount', 'ColumnCount', 'AppliedTableStyle', 'TableDirection',
              'TopBorderStrokeWeight', 'BottomBorderStrokeWeight', 'LeftBorderStrokeWeight', 'RightBorderStrokeWeight', 'TopBorderStrokeColor',
              'BottomBorderStrokeColor', 'LeftBorderStrokeColor', 'RightBorderStrokeColor', 'StartRowStrokeCount', 'StartRowStrokeWeight',
              'StartRowStrokeColor', 'StartColumnStrokeCount', 'StartColumnStrokeWeight', 'StartColumnStrokeColor'},
    'Row': {'Self', 'Name', 'SingleRowHeight', 'MinimumHeight', 'AutoGrow'},
    'Column': {'Self', 'Name', 'SingleColumnWidth'},
    'Cell': {'Self', 'Name', 'RowSpan', 'ColumnSpan', 'AppliedCellStyle', 'AppliedCellStylePriority', 'TopInset', 'LeftInset', 'BottomInset',
             'RightInset', 'VerticalJustification', 'FirstBaselineOffset', 'MinimumFirstBaselineOffset',
             *[f'{e}EdgeStroke{a}' for e in ('Top', 'Bottom', 'Left', 'Right') for a in ('Weight', 'Color', 'Type', 'Tint')]},
    'PDF': {'Self', 'ImageTypeName', 'AppliedObjectStyle', 'ItemTransform', 'Visible', 'Name'},
    'PDFAttribute': {'PageNumber', 'PDFCrop', 'TransparentBackground'},
    'TextFramePreference': {'VerticalBalanceColumns'},   # „Spalten ausgleichen“ (InDesign CS5.5+, DOM ≥ 7.5)
}
# gültige Aufzählungswerte (InDesign-DOM), die in den Referenzen nur zufällig nicht vorkommen
ENUMS = {
    'Justification': {'LeftAlign', 'CenterAlign', 'RightAlign', 'LeftJustified', 'RightJustified', 'CenterJustified', 'FullyJustified', 'ToBindingSide', 'AwayFromBindingSide'},
    'OTFFigureStyle': {'Default', 'TabularLining', 'ProportionalLining', 'ProportionalOldstyle', 'TabularOldstyle'},
    'Capitalization': {'Normal', 'AllCaps', 'SmallCaps', 'CapToSmallCap'},
    'Position': {'Normal', 'Superscript', 'Subscript', 'OTSuperscript', 'OTSubscript', 'OTNumerator', 'OTDenominator'},
    'StartParagraph': {'Anywhere', 'NextColumn', 'NextFrame', 'NextPage', 'NextOddPage', 'NextEvenPage'},
    'FirstBaselineOffset': {'AscentOffset', 'CapHeight', 'LeadingOffset', 'EmboxHeight', 'XHeight', 'FixedHeight'},
    'VerticalJustification': {'TopAlign', 'CenterAlign', 'BottomAlign', 'JustifyAlign'},
    'AutoSizingReferencePoint': {'TopLeftPoint', 'TopCenterPoint', 'TopRightPoint', 'LeftCenterPoint', 'CenterPoint', 'RightCenterPoint',
                                 'BottomLeftPoint', 'BottomCenterPoint', 'BottomRightPoint'},
    'BlendingSpace': {'RGB', 'CMYK'},
    'PDFCrop': {'CropPDF', 'CropArt', 'CropTrim', 'CropBleed', 'CropMedia', 'CropContentAllLayers', 'CropContentVisibleLayers'},
    'StrokeAlignment': {'CenterAlignment', 'InsideAlignment', 'OutsideAlignment'},
    'EndCap': {'ButtEndCap', 'RoundEndCap', 'ProjectingEndCap'},
    'Composer': {'HL Composer', 'HL Single', 'HL Composer Optyca', 'HL Single Optyca'},   # Absatz-/Ein-Zeilen-Setzer (+ World-Ready)
    'type': {'string', 'object', 'unit', 'enumeration', 'list', 'boolean', 'double', 'long', 'record', 'ref'},   # Properties-Typen (BasedOn type="object" = eigenes Basisformat)
}
BOOL_ATTRS = {'Underline', 'StrikeThru', 'KeepLinesTogether', 'KeepAllLinesTogether', 'NoBreak', 'AutoGrow', 'TransparentBackground', 'Hyphenation',
              'ShowMasterItems', 'VerticalBalanceColumns'}


def compare_vocab(ours, refs, rep):
    voc, kids = ours
    rvoc, rkids = refs
    unk_el, unk_at, odd_val = [], [], []
    for tag, attrs in voc.items():
        if tag not in rvoc and tag not in rkids.get('Properties', set()) and not any(tag in s for s in rkids.values()):
            unk_el.append(tag)
            for a, vals in attrs.items():
                if a not in VETTED['*'] and a not in VETTED.get(tag, set()):
                    rep.warn('attribut', f'{tag}@{a}="{next(iter(vals))}" (Element ohne Referenz) nicht geprüft')
                for v in vals:
                    if a in ENUMS and v not in ENUMS[a]:
                        odd_val.append(f'{tag}@{a}="{v}" ungültig')
                    if a in BOOL_ATTRS and v not in ('true', 'false'):
                        odd_val.append(f'{tag}@{a}="{v}" kein Wahrheitswert')
            continue
        for a, vals in attrs.items():
            if a not in rvoc.get(tag, {}):
                if a in VETTED['*'] or a in VETTED.get(tag, set()):
                    unk_at.append(f'{tag}@{a}')
                else:
                    rep.warn('attribut', f'{tag}@{a}="{next(iter(vals))}" weder in den Referenzen noch als InDesign-Eigenschaft bekannt')
                continue
            rv = rvoc[tag][a]
            if not rv or not all(ENUM_RX.match(x) for x in rv):
                continue
            if any(REF_PREFIX.match(x) for x in rv) or a in ('Name', 'Self', 'FontStyle', 'Content', 'FontStyleName', 'AppliedFont', 'FontFamily'):
                continue
            if len(rv) > 40:
                continue
            if a in ID_ATTRS or all(ID_RX.match(x) for x in rv):
                continue
            if a in ('BaseName', 'NamePrefix'):
                continue
            for v in vals:
                if v in ENUMS.get(a, ()) or (a in BOOL_ATTRS and v in ('true', 'false')):
                    continue
                if ENUM_RX.match(v) and v not in rv and not re.match(r'^-?\d', v) and not ID_RX.match(v):
                    odd_val.append(f'{tag}@{a}="{v}" (Referenzen: {sorted(rv)[:8]})')
    if unk_el:
        rep.warn('vokabular', f'Elemente ohne Beleg in den Referenzen: {sorted(unk_el)}')
    if unk_at:
        rep.note('Attribute ohne Beleg in den Referenzen (geprüfte DOM-Eigenschaften)', sorted(unk_at))
    for o in odd_val:
        rep.warn('aufzählung', o)


# ----------------------------------------------------------------------------------------------------------------
# 7. Schriften
# ----------------------------------------------------------------------------------------------------------------
SPACE_LIKE = set('\t\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\u200b\u200c\u200d\u2060\ufeff\u00ad')


def style_chain(selfs, start, kind):
    out = []
    cur = start
    seen = set()
    while cur and cur not in seen:
        seen.add(cur)
        hit = selfs.get(cur)
        if not hit:
            break
        el = hit[0]
        out.append(el)
        b = el.find('Properties/BasedOn')
        if b is None:
            break
        txt = b.text or ''
        if b.get('type') == 'object':
            cur = txt
        else:
            cur = f'{kind}/' + txt.replace(':', '%3a')
    return out


def font_of(el):
    fam = None
    p = el.find('Properties/AppliedFont')
    if p is not None:
        fam = p.text
    return fam, el.get('FontStyle')


def resolve(chain_els):
    fam = st = None
    for el in chain_els:
        f, s = font_of(el)
        if fam is None and f:
            fam = f
        if st is None and s:
            st = s
    return fam, st


def check_fonts(trees, selfs, fonts_dir, rep):
    fx = trees.get('Resources/Fonts.xml')
    declared = {}
    fams = set()
    if fx is not None:
        for ff in fx.iter('FontFamily'):
            fams.add(ff.get('Name'))
            for f in ff.iter('Font'):
                if f.get('FontFamily') != ff.get('Name'):
                    rep.err('schrift', f'Font {f.get("Self")}: FontFamily ≠ FontFamily/@Name')
                key = (f.get('FontFamily'), f.get('FontStyleName'))
                if key in declared:
                    rep.err('schrift', f'Fonts.xml doppelt: {key}')
                declared[key] = f
    # TTFs lesen
    ttf = {}
    if fonts_dir and os.path.isdir(fonts_dir):
        from fontTools.ttLib import TTFont
        for p in sorted(glob.glob(os.path.join(fonts_dir, '*'))):
            if p.lower().endswith('.txt'):
                continue   # Lizenztexte (OFL verlangt sie bei der Weitergabe)
            if not p.lower().endswith(('.ttf', '.otf')):
                rep.warn('schrift', f'Document Fonts: unerwartete Datei {os.path.basename(p)}')
                continue
            try:
                t = TTFont(p)
            except Exception as e:  # noqa: BLE001
                rep.err('schrift', f'{os.path.basename(p)}: nicht lesbar: {e}')
                continue
            nm = t['name']

            def g(i, nm=nm):
                r = nm.getName(i, 3, 1, 0x409) or nm.getName(i, 1, 0, 0)
                return str(r) if r else None
            names = {i: g(i) for i in (1, 2, 4, 6, 16, 17)}
            fam = names[16] or names[1]
            sty = names[17] or names[2]
            os2 = t['OS/2']
            info = {'file': os.path.basename(p), 'names': names, 'family': fam, 'style': sty, 'weight': os2.usWeightClass, 'fsSelection': os2.fsSelection,
                    'fsType': os2.fsType, 'macStyle': t['head'].macStyle, 'italicAngle': t['post'].italicAngle, 'cmap': set(t.getBestCmap() or {}),
                    'glyf': 'glyf' in t, 'fvar': 'fvar' in t, 'mac_names': bool(nm.getName(1, 1, 0, 0)), 'modified': t['head'].modified}
            if (fam, sty) in ttf:
                rep.err('schrift', f'Document Fonts: {fam} {sty} doppelt ({ttf[(fam, sty)]["file"]}, {info["file"]})')
            ttf[(fam, sty)] = info
            italic = 'Italic' in (sty or '')
            if bool(os2.fsSelection & 1) != italic:
                rep.err('schrift', f'{info["file"]}: fsSelection ITALIC={bool(os2.fsSelection & 1)} passt nicht zu Stil „{sty}“')
            if bool(t['head'].macStyle & 2) != italic:
                rep.warn('schrift', f'{info["file"]}: head.macStyle Italic-Bit passt nicht zu „{sty}“')
            if italic and abs(t['post'].italicAngle) < 0.01:
                rep.warn('schrift', f'{info["file"]}: kursiver Stil ohne post.italicAngle')
            if os2.fsType & 0x000E and not os2.fsType & 0x0008:
                rep.warn('schrift', f'{info["file"]}: fsType={os2.fsType} schränkt Einbettung ein')
            if names[6] and (len(names[6]) > 63 or re.search(r'[^\x21-\x7e]|[\[\](){}<>/%]', names[6])):
                rep.err('schrift', f'{info["file"]}: PostScript-Name „{names[6]}“ ungültig')
            # Legacy-Namen (Windows-Stilverknüpfung): Nicht-RIBBI braucht 16/17
            if sty not in ('Regular', 'Italic', 'Bold', 'Bold Italic') and not (names[16] and names[17]):
                rep.err('schrift', f'{info["file"]}: Stil „{sty}“ ohne typografische Namen (nameID 16/17)')
            if names[2] not in ('Regular', 'Italic', 'Bold', 'Bold Italic'):
                rep.warn('schrift', f'{info["file"]}: nameID 2 „{names[2]}“ ist kein RIBBI-Stil (Windows-Stilverknüpfung)')
            if 'fvar' in t:
                rep.warn('schrift', f'{info["file"]}: ist noch variabel (fvar)')
        # Legacy-Paare eindeutig
        leg = collections.Counter((v['names'][1], v['names'][2]) for v in ttf.values())
        for k, c in leg.items():
            if c > 1:
                rep.err('schrift', f'Legacy-Name (nameID 1/2) {k} {c}× – Windows/GDI fasst diese Schnitte zusammen')
        ps = collections.Counter(v['names'][6] for v in ttf.values())
        for k, c in ps.items():
            if c > 1:
                rep.err('schrift', f'PostScript-Name {k} {c}×')
        rep.note('Document Fonts', sorted(f'{k[0]} {k[1]} ({v["file"]}, wght {v["weight"]}, nameID1/2={v["names"][1]}/{v["names"][2]})' for k, v in ttf.items()))
    elif fonts_dir:
        rep.warn('schrift', f'Ordner fehlt: {fonts_dir}')
    # Fonts.xml ↔ TTF
    for key, f in declared.items():
        info = ttf.get(key)
        if f.get('Status') == 'Installed' and ttf and not info:
            rep.err('schrift', f'Fonts.xml {key}: keine passende TTF in Document Fonts (Familie/Stil nach nameID 16/17 bzw. 1/2)')
            continue
        if info:
            if info['names'][6] != f.get('PostScriptName'):
                rep.err('schrift', f'Fonts.xml {key}: PostScriptName {f.get("PostScriptName")} ≠ nameID 6 {info["names"][6]}')
            if info['names'][4] != f.get('FullName'):
                rep.warn('schrift', f'Fonts.xml {key}: FullName „{f.get("FullName")}“ ≠ nameID 4 „{info["names"][4]}“')
            ft = f.get('FontType')
            if info['glyf'] and ft not in ('TrueType', 'OpenTypeTT'):
                rep.warn('schrift', f'Fonts.xml {key}: FontType {ft} bei TrueType-Konturen')
    for key, info in ttf.items():
        if key not in declared:
            rep.warn('schrift', f'Document Fonts {info["file"]} ({key}) nicht in Fonts.xml')
    # effektive Schriften je Textlauf + Glyphenabdeckung
    used = collections.Counter()
    missing_glyphs = collections.defaultdict(collections.Counter)
    where = {}
    for name, root in trees.items():
        if not name.startswith('Stories/'):
            continue
        for csr in root.iter('CharacterStyleRange'):
            psr = csr.getparent()
            while psr is not None and local(psr.tag) != 'ParagraphStyleRange':
                psr = psr.getparent()
            pchain = style_chain(selfs, psr.get('AppliedParagraphStyle') if psr is not None else 'ParagraphStyle/$ID/[No paragraph style]', 'ParagraphStyle')
            cchain = style_chain(selfs, csr.get('AppliedCharacterStyle'), 'CharacterStyle')
            fam, st = resolve([csr] + cchain + ([psr] if psr is not None else []) + pchain)
            text = ''.join(c.text or '' for c in csr if local(c.tag) == 'Content')
            if not text:
                continue
            key = (fam, st)
            used[key] += len(text)
            where.setdefault(key, f'{name}')
            if key not in declared:
                continue
            info = ttf.get(key)
            if not info:
                continue
            for ch in text:
                if ch in SPACE_LIKE or ord(ch) < 0x20:
                    continue
                if ch == '\u2011':   # geschützter Bindestrich: InDesign setzt die Glyphe von „-“
                    if 0x2D not in info['cmap']:
                        missing_glyphs[key][ch] += 1
                    continue
                if ord(ch) not in info['cmap']:
                    missing_glyphs[key][ch] += 1
    for key, n in used.items():
        if key not in declared:
            rep.err('schrift', f'Text in {key[0]} / {key[1]} ({n} Zeichen, z. B. {where[key]}) – Kombination nicht in Fonts.xml')
        elif ttf and key not in ttf:
            rep.err('schrift', f'Text in {key[0]} / {key[1]} – keine Datei in Document Fonts')
    for key, cnt in missing_glyphs.items():
        rep.err('glyphen', f'{key[0]} {key[1]}: fehlende Glyphen ' + ', '.join(f'U+{ord(c):04X} {unicodedata.name(c, "?")} ({n}×)' for c, n in cnt.most_common(12)))
    # Formate: Kombinationen
    styles = trees.get('Resources/Styles.xml')
    if styles is not None:
        for kind in ('ParagraphStyle',):
            for e in styles.iter(kind):
                fam, st = resolve(style_chain(selfs, e.get('Self'), kind))
                if fam and st and (fam, st) not in declared:
                    rep.err('schrift', f'{e.get("Self")}: {fam} {st} nicht in Fonts.xml')
        for e in styles.iter('CharacterStyle'):
            fam, st = font_of(e)
            if fam and fam not in fams:
                rep.err('schrift', f'{e.get("Self")}: Familie {fam} nicht in Fonts.xml')
    rep.note('Schriften im Text', {f'{k[0]} {k[1]}': v for k, v in used.most_common()})
    return ttf


# ----------------------------------------------------------------------------------------------------------------
# 8. Geometrie, Grafiken, Tabellen
# ----------------------------------------------------------------------------------------------------------------
def path_points(el):
    pts = []
    for pp in el.findall('Properties/PathGeometry/GeometryPathType/PathPointArray/PathPointType'):
        for a in ('Anchor', 'LeftDirection', 'RightDirection'):
            v = pp.get(a)
            if v:
                pts.append(tuple(nums(v)))
    return pts


def bbox(points):
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    return min(xs), min(ys), max(xs), max(ys)


def pdf_info(path):
    from pypdf import PdfReader
    r = PdfReader(path, strict=True)
    p = r.pages[0]
    mb = [float(x) for x in p.mediabox]
    return {'pages': len(r.pages), 'w': mb[2] - mb[0], 'h': mb[3] - mb[1], 'mediabox': mb,
            'cropbox': [float(x) for x in p.cropbox], 'rotate': p.get('/Rotate', 0) or 0}


def check_geometry(trees, files, selfs, idml_dir, rep):
    prefs = trees.get('Resources/Preferences.xml')
    dp = prefs.find('DocumentPreference') if prefs is not None else None
    bleed = {k: float(dp.get(f'DocumentBleed{k}Offset', 0)) for k in ('Top', 'Bottom', 'InsideOrLeft', 'OutsideOrRight')} if dp is not None else {}
    W = float(dp.get('PageWidth')) if dp is not None else None
    H = float(dp.get('PageHeight')) if dp is not None else None
    rep.note('Seitenformat', f'{W} × {H} pt = {W / 72 * 25.4:.3f} × {H / 72 * 25.4:.3f} mm, Beschnitt {bleed}')
    if W and (abs(W - 595.2756) > 0.005 or abs(H - 841.8898) > 0.005):
        rep.warn('seite', f'Seitenformat {W} × {H} pt ({W / 72 * 25.4:.3f} × {H / 72 * 25.4:.3f} mm) ist nicht exakt A4 (595.2756 × 841.8898)')
    dm = trees['designmap.xml']
    spread_files = [el.get('src') for el in dm if dm_name(el) == 'idPkg:Spread']
    master_files = [el.get('src') for el in dm if dm_name(el) == 'idPkg:MasterSpread']   # Musterobjekte (Fußzeile) mitprüfen
    page_names = []
    link_files = set()
    pdf_cache = {}
    tables = 0
    stats = collections.Counter()
    story_frames = collections.defaultdict(list)
    out_of_page = []
    for sf in spread_files + master_files:
        root = trees.get(sf)
        if root is None:
            continue
        is_master = sf in master_files
        sp = root.find('MasterSpread' if is_master else 'Spread')
        if sp is None or (('MasterSpreads/MasterSpread_' if is_master else 'Spreads/Spread_') + sp.get('Self') + '.xml') != sf:
            rep.warn('struktur', f'{sf}: Dateiname ≠ Spread Self')
        sm = tuple(nums(sp.get('ItemTransform', '1 0 0 1 0 0')))
        pages = []
        for pg in sp.findall('Page'):
            gb = nums(pg.get('GeometricBounds'))
            m = tuple(nums(pg.get('ItemTransform')))
            x0, y0 = apply(m, gb[1], gb[0])
            x1, y1 = apply(m, gb[3], gb[2])
            pages.append({'el': pg, 'name': pg.get('Name'), 'x0': min(x0, x1), 'y0': min(y0, y1), 'x1': max(x0, x1), 'y1': max(y0, y1)})
            if not is_master:
                page_names.append(pg.get('Name'))
            if pg.get('AppliedMaster') not in ('n', None) and pg.get('AppliedMaster') not in selfs:
                rep.err('verweis', f'Seite {pg.get("Name")}: AppliedMaster ungelöst')
            if W and (abs((gb[3] - gb[1]) - W) > 0.01 or abs((gb[2] - gb[0]) - H) > 0.01):
                rep.err('seite', f'Seite {pg.get("Name")}: GeometricBounds {gb} ≠ Dokumentformat')
        if int(sp.get('PageCount', len(pages))) != len(pages):
            rep.err('seite', f'{sf}: PageCount {sp.get("PageCount")} ≠ {len(pages)} Seiten')
        # Bund
        if len(pages) == 2 and abs(pages[0]['x1'] - pages[1]['x0']) > 0.01:
            rep.err('seite', f'{sf}: Seiten nicht bündig am Bund')
        bl = int(sp.get('BindingLocation', 0))
        if len(pages) == 1:
            exp_bl = 0 if pages[0]['x0'] >= -0.01 else 1
            if bl != exp_bl:
                rep.err('seite', f'{sf}: BindingLocation {bl}, erwartet {exp_bl}')

        def walk(el, M, depth=0):
            for ch in el:
                if not isinstance(ch.tag, str):
                    continue
                t = local(ch.tag)
                if t not in PAGE_ITEMS:
                    continue
                m = mat_mul(M, tuple(nums(ch.get('ItemTransform', '1 0 0 1 0 0'))))
                stats[t] += 1
                if t == 'Group':
                    walk(ch, m, depth + 1)
                    continue
                pts = path_points(ch)
                if not pts:
                    rep.err('geometrie', f'{sf}: {t} {ch.get("Self")} ohne PathGeometry')
                    continue
                spts = [apply(m, x, y) for x, y in pts]
                bx0, by0, bx1, by1 = bbox(spts)
                sw = float(ch.get('StrokeWeight', 0) or 0) if ch.get('StrokeColor', 'Swatch/None') != 'Swatch/None' else 0
                al = ch.get('StrokeAlignment', 'CenterAlignment')
                grow = 0 if t == 'TextFrame' else (sw / 2 if t == 'GraphicLine' or al == 'CenterAlignment' else sw if al == 'OutsideAlignment' else 0)
                bx0, by0, bx1, by1 = bx0 - grow, by0 - grow, bx1 + grow, by1 + grow
                if bx1 - bx0 < 0.01 and by1 - by0 < 0.01:
                    rep.warn('geometrie', f'{sf}: {t} {ch.get("Self")} ohne Ausdehnung')
                # zugehörige Seite: größte Überlappung, sonst nächste
                def ov(p):
                    return max(0, min(bx1, p['x1']) - max(bx0, p['x0'])) * max(0, min(by1, p['y1']) - max(by0, p['y0']))
                best = max(pages, key=lambda p: (ov(p), -abs((bx0 + bx1) / 2 - (p['x0'] + p['x1']) / 2)))
                is_left = best['x1'] <= 0.01 and len(pages) >= 1 and best['x0'] < -1
                ins = 0  # zum Bund hin kein Beschnitt
                lim = {'x0': best['x0'] - (bleed.get('OutsideOrRight', 0) if is_left else ins),
                       'x1': best['x1'] + (ins if is_left else bleed.get('OutsideOrRight', 0)),
                       'y0': best['y0'] - bleed.get('Top', 0), 'y1': best['y1'] + bleed.get('Bottom', 0)}
                if t == 'TextFrame':
                    trim = {'x0': best['x0'], 'x1': best['x1'], 'y0': best['y0'], 'y1': best['y1']}
                    if bx0 < trim['x0'] - 0.05 or bx1 > trim['x1'] + 0.05 or by0 < trim['y0'] - 0.05 or by1 > trim['y1'] + 0.05:
                        rep.warn('geometrie', f'S. {best["name"]}: TextFrame {ch.get("Self")} reicht über das Endformat in den Beschnitt')
                # randabfallend ohne Beschnitt: gefüllte Fläche/Grafik endet an einer Außenkante (≤ 0,8 mm davor)
                filled = (ch.get('FillColor', 'Swatch/None') != 'Swatch/None') or ch.find('PDF') is not None or ch.find('Image') is not None
                if filled and t != 'TextFrame':
                    miss = []
                    near = 2.27
                    if best['y0'] - 0.05 <= by0 <= best['y0'] + near and by0 > lim['y0'] + 0.05:
                        miss.append('oben')
                    if best['y1'] - near <= by1 <= best['y1'] + 0.05 and by1 < lim['y1'] - 0.05:
                        miss.append('unten')
                    if is_left and best['x0'] - 0.05 <= bx0 <= best['x0'] + near and bx0 > lim['x0'] + 0.05:
                        miss.append('außen')
                    if not is_left and best['x1'] - near <= bx1 <= best['x1'] + 0.05 and bx1 < lim['x1'] - 0.05:
                        miss.append('außen')
                    if miss:
                        rep.err('beschnitt', f'S. {best["name"]}: {t} {ch.get("Self")} „{ch.get("Name")}“ endet an der Seitenkante ({", ".join(miss)}) ohne Beschnittzugabe')
                tol = 0.05
                over = []
                if bx0 < lim['x0'] - tol:
                    over.append(f'links {lim["x0"] - bx0:.2f}')
                if bx1 > lim['x1'] + tol:
                    over.append(f'rechts {bx1 - lim["x1"]:.2f}')
                if by0 < lim['y0'] - tol:
                    over.append(f'oben {lim["y0"] - by0:.2f}')
                if by1 > lim['y1'] + tol:
                    over.append(f'unten {by1 - lim["y1"]:.2f}')
                if ov(best) <= 0:
                    rep.err('geometrie', f'S. {best["name"]}: {t} {ch.get("Self")} „{ch.get("Name")}“ liegt ganz auf der Montagefläche')
                elif over:
                    out_of_page.append((best['name'], t, ch.get('Self'), ch.get('Name'), ', '.join(over), grow))
                if t == 'TextFrame':
                    story_frames[ch.get('ParentStory')].append((ch, best['name'], (bx0, by0, bx1, by1), m))
                    tfp = ch.find('TextFramePreference')
                    if tfp is not None:
                        il = tfp.findall('Properties/InsetSpacing/ListItem')
                        if il and len(il) != 4:
                            rep.err('geometrie', f'{ch.get("Self")}: InsetSpacing mit {len(il)} Werten')
                # platzierte Grafik
                for gtag in ('PDF', 'Image', 'EPS', 'ImportedPage', 'PICT', 'WMF'):
                    for g in ch.findall(gtag):
                        stats['Grafik:' + gtag] += 1
                        link = g.find('Link')
                        if link is None:
                            rep.err('grafik', f'{ch.get("Self")}: {gtag} ohne Link')
                            continue
                        uri = link.get('LinkResourceURI', '')
                        if not uri.startswith('file:'):
                            rep.err('grafik', f'{ch.get("Self")}: LinkResourceURI {uri}')
                            continue
                        from urllib.parse import unquote
                        rel = unquote(uri[5:])
                        if rel.startswith('/') or re.match(r'^[A-Za-z]:', rel):
                            rep.warn('grafik', f'{ch.get("Self")}: absoluter Pfad {rel}')
                        if re.search(r'[^A-Za-z0-9._/\-]', uri[5:]):
                            rep.warn('grafik', f'{ch.get("Self")}: Sonderzeichen in URI {uri}')
                        fp = os.path.join(idml_dir, rel)
                        link_files.add(os.path.normpath(fp))
                        if not os.path.isfile(fp):
                            rep.err('grafik', f'{ch.get("Self")}: Datei fehlt {rel}')
                            continue
                        if gtag == 'PDF':
                            if fp not in pdf_cache:
                                try:
                                    pdf_cache[fp] = pdf_info(fp)
                                except Exception as e:  # noqa: BLE001
                                    pdf_cache[fp] = None
                                    rep.err('grafik', f'{rel}: kein gültiges PDF ({e})')
                            pi = pdf_cache[fp]
                            if not pi:
                                continue
                            gbx = g.find('Properties/GraphicBounds')
                            gw = float(gbx.get('Right')) - float(gbx.get('Left'))
                            gh = float(gbx.get('Bottom')) - float(gbx.get('Top'))
                            if abs(gw - pi['w']) > 0.02 or abs(gh - pi['h']) > 0.02:
                                rep.err('grafik', f'{rel}: GraphicBounds {gw:.3f}×{gh:.3f} ≠ MediaBox {pi["w"]:.3f}×{pi["h"]:.3f}')
                            if pi['mediabox'] != pi['cropbox']:
                                rep.warn('grafik', f'{rel}: CropBox ≠ MediaBox')
                            if pi['rotate']:
                                rep.warn('grafik', f'{rel}: /Rotate {pi["rotate"]}')
                            pa = g.find('PDFAttribute')
                            if pa is None or pa.get('PDFCrop') != 'CropMedia':
                                rep.warn('grafik', f'{ch.get("Self")}: PDFCrop {pa.get("PDFCrop") if pa is not None else "-"}')
                            if pa is not None and int(pa.get('PageNumber', 1)) > pi['pages']:
                                rep.err('grafik', f'{rel}: PageNumber {pa.get("PageNumber")} > {pi["pages"]} Seiten')
                            # Inhalt deckt Rahmen ab?
                            gm = tuple(nums(g.get('ItemTransform', '1 0 0 1 0 0')))
                            if abs(gm[0] - 1) > 1e-6 or abs(gm[3] - 1) > 1e-6 or gm[1] or gm[2]:
                                rep.warn('grafik', f'{rel}: Inhalt skaliert/gedreht {gm}')
                            cx0, cy0 = gm[4] + float(gbx.get('Left')), gm[5] + float(gbx.get('Top'))
                            cx1, cy1 = cx0 + gw, cy0 + gh
                            fx0, fy0, fx1, fy1 = bbox(pts)
                            if fx0 < cx0 - 0.05 or fy0 < cy0 - 0.05 or fx1 > cx1 + 0.05 or fy1 > cy1 + 0.05:
                                rep.warn('grafik', f'{rel}: Rahmen größer als Inhalt (Rahmen {fx0:.2f},{fy0:.2f}–{fx1:.2f},{fy1:.2f}, Inhalt {cx0:.2f},{cy0:.2f}–{cx1:.2f},{cy1:.2f})')
        walk(sp, (1, 0, 0, 1, 0, 0))
        for p in pages:
            p['el'] = None
    for pg, t, s, n, o, g in out_of_page:
        rep.err('geometrie', f'S. {pg}: {t} {s} „{n}“ ragt über Seite+Beschnitt hinaus ({o} pt{", inkl. Kontur" if g else ""})')
    rep.note('Seitenobjekte', dict(stats))
    rep.note('Seitenfolge', ' '.join(page_names))
    exp_names = [str(i) for i in range(1, len(page_names) + 1)]
    if page_names != exp_names:
        rep.err('seite', f'Seitenfolge {page_names[:10]}… ≠ 1…n')
    # Links-Ordner: verwaiste Dateien
    ldir = os.path.join(idml_dir, 'Links')
    if os.path.isdir(ldir):
        all_links = {os.path.normpath(p) for p in glob.glob(os.path.join(ldir, '*')) if os.path.isfile(p)}
        orphan = sorted(os.path.basename(p) for p in all_links - link_files)
        if orphan:
            rep.warn('grafik', f'{len(orphan)} Dateien in Links/ ohne Verweis: {orphan[:5]}')
        hidden = [os.path.basename(p) for p in glob.glob(os.path.join(ldir, '.*'))]
        if hidden:
            rep.warn('grafik', f'versteckte Dateien in Links/: {hidden}')
        rep.note('Links/', f'{len(all_links)} Dateien, {len(link_files)} verknüpft')
    # PDF-Schriften (pdffonts): eingebettet, kein Type 3
    t3, notemb = [], []
    for fp in sorted(pdf_cache):
        try:
            out = subprocess.run(['pdffonts', fp], capture_output=True, text=True, timeout=30).stdout.splitlines()[2:]
        except (OSError, subprocess.TimeoutExpired):
            break
        for line in out:
            cols = line.split()
            if len(cols) < 5:
                continue
            if 'Type 3' in line:
                t3.append(os.path.basename(fp))
            m = re.search(r'\s(yes|no)\s+(yes|no)\s+(yes|no)\s+\d+\s+\d+\s*$', line)
            if m and m.group(1) == 'no':
                notemb.append(f'{os.path.basename(fp)}: {cols[0]}')
    if t3:
        rep.warn('grafik', f'Type-3-Schriften in {sorted(set(t3))[:6]}')
    if notemb:
        rep.err('grafik', f'nicht eingebettete Schriften: {notemb[:6]}')
    return story_frames


def check_ink(idml_dir, rep, margin=60.0, dpi=72):
    """Grafik-PDFs: Inhalt, der über die Seite (= Rahmen) hinausragt und daher in InDesign abgeschnitten ist.
    Form-XObject-BBox aufweiten, mit Alpha rastern, Deckung außerhalb messen. Nur rechts/unten aussagekräftig."""
    import shutil
    import tempfile
    if not shutil.which('pdftocairo'):
        rep.note('Tinten-Prüfung', 'pdftocairo fehlt – übersprungen')
        return
    from pypdf import PdfReader, PdfWriter
    from pypdf.generic import ArrayObject, FloatObject, NameObject, RectangleObject
    from PIL import Image
    n = 0
    for f in sorted(glob.glob(os.path.join(idml_dir, 'Links', '*.pdf'))):
        try:
            w = PdfWriter()
            w.append(PdfReader(f))
            pg = w.pages[0]
            mb = [float(x) for x in pg.mediabox]
            W, H = mb[2] - mb[0], mb[3] - mb[1]
            xo = pg['/Resources'].get('/XObject', {})
            for k in xo:
                o = xo[k].get_object()
                if o.get('/Subtype') == '/Form':
                    o[NameObject('/BBox')] = ArrayObject([FloatObject(-5000), FloatObject(-5000), FloatObject(5000), FloatObject(5000)])
            pg.mediabox = RectangleObject([mb[0] - margin, mb[1] - margin, mb[2] + margin, mb[3] + margin])
            pg.cropbox = pg.mediabox
            with tempfile.TemporaryDirectory() as td:
                p = os.path.join(td, 'x.pdf')
                w.write(p)
                subprocess.run(['pdftocairo', '-png', '-transp', '-r', str(dpi), '-singlefile', p, os.path.join(td, 'x')], check=True, capture_output=True, timeout=60)
                bb = Image.open(os.path.join(td, 'x.png')).convert('RGBA').split()[3].point(lambda v: 255 if v > 24 else 0).getbbox()
        except Exception as e:  # noqa: BLE001
            rep.warn('grafik', f'{os.path.basename(f)}: Tinten-Prüfung nicht möglich ({e})')
            continue
        n += 1
        if not bb:
            continue
        s = dpi / 72.0
        over = {'rechts': bb[2] / s - (margin + W), 'unten': bb[3] / s - (margin + H)}
        big = {k: round(v, 1) for k, v in over.items() if v > 1.5}
        if big:
            rep.warn('grafik-beschnitten', f'{os.path.basename(f)}: Grafikinhalt ragt über den Rahmen und wird abgeschnitten ({big} pt) – mit Referenz vergleichen (Elternelement kann im HTML ebenfalls beschneiden)')
    rep.note('Tinten-Prüfung', f'{n} Grafik-PDFs')


def check_stories(trees, selfs, story_frames, rep):
    dm = trees['designmap.xml']
    story_list = (dm.get('StoryList') or '').split()
    story_selfs = []
    paras = 0
    for name, root in trees.items():
        if not name.startswith('Stories/'):
            continue
        st = root.findall('Story')
        if len(st) != 1:
            rep.err('story', f'{name}: {len(st)} Story-Elemente')
            continue
        s = st[0].get('Self')
        story_selfs.append(s)
        if name != f'Stories/Story_{s}.xml':
            rep.warn('story', f'{name}: Dateiname ≠ Self {s}')
        fr = story_frames.get(s, [])
        if not fr:
            rep.err('story', f'Story {s} ohne Textrahmen (Inhalt unsichtbar)')
        elif len(fr) > 1:
            chain_ok = all(f[0].get('NextTextFrame') not in (None, 'n') or i == len(fr) - 1 for i, f in enumerate(fr))
            if not chain_ok:
                rep.err('story', f'Story {s} in {len(fr)} Rahmen ohne Verkettung')
        # Absätze, Br, Inhalt
        psrs = st[0].findall('ParagraphStyleRange')
        brs = sum(1 for _ in st[0].iter('Br'))
        cells = list(st[0].iter('Cell'))
        if cells:   # Tabellenanker zählt nicht, jede Zelle mit Text bildet mindestens einen Absatz
            paras += brs + sum(1 for c in cells if any((x.text or '') for x in c.iter('Content')))
        else:
            paras += brs + 1
        last = list(st[0].iter('Br'))
        allc = [e for e in st[0].iter() if isinstance(e.tag, str) and local(e.tag) in ('Content', 'Br', 'Table')]
        if allc and local(allc[-1].tag) == 'Br':
            rep.warn('story', f'Story {s}: endet mit <Br/> (leerer Absatz am Ende)')
        for psr in psrs:
            kids = [local(k.tag) for k in psr if isinstance(k.tag, str)]
            if 'Properties' in kids and kids.index('Properties') != 0:
                rep.err('story', f'Story {s}: Properties nicht zuerst in ParagraphStyleRange')
            for csr in psr.iter('CharacterStyleRange'):
                ck = [local(k.tag) for k in csr if isinstance(k.tag, str)]
                if 'Properties' in ck and ck.index('Properties') != 0:
                    rep.err('story', f'Story {s}: Properties nicht zuerst in CharacterStyleRange')
                for c in csr.findall('Content'):
                    if c.text is None:
                        if not any(isinstance(k, etree._ProcessingInstruction) for k in c):   # <?ACE 18?> = Seitenzahl
                            rep.warn('story', f'Story {s}: leeres <Content/>')
                    elif re.search('[\u0000-\u0008\u000b\u000c\u000e-\u001f]', c.text):
                        rep.err('story', f'Story {s}: Steuerzeichen im Text')
                    elif re.search('[\n\r\u0085\u2029]', c.text):
                        ch_ = re.search('[\n\r\u0085\u2029]', c.text).group()
                        rep.err('story', f'Story {s}: Absatztrenner U+{ord(ch_):04X} im <Content> – Absätze trennt in IDML nur <Br/>')
                    elif '\ufeff' in c.text:
                        rep.err('story', f'Story {s}: U+FEFF im Text')
        # Tabellen
        for tb in st[0].iter('Table'):
            check_table(tb, s, story_frames, rep)
    sl = set(story_list)
    xs = [e.get('Self') for e in trees.get('XML/BackingStory.xml', etree.Element('x')).iter('XmlStory')]
    for s in story_selfs + xs:
        if s not in sl:
            rep.err('story', f'StoryList ohne {s}')
    for s in story_list:
        if s not in story_selfs and s not in xs:
            rep.err('story', f'StoryList nennt unbekannte Story {s}')
    for s in story_frames:
        if s not in story_selfs:
            rep.err('story', f'TextFrame verweist auf fehlende Story {s}')
    rep.note('Stories', f'{len(story_selfs)} (+{len(xs)} XmlStory), Absätze inkl. Tabellenzellen ≈ {paras}')


def check_table(tb, story, story_frames, rep):
    s = tb.get('Self')
    hr, br, fr, cc = (int(tb.get(k, 0)) for k in ('HeaderRowCount', 'BodyRowCount', 'FooterRowCount', 'ColumnCount'))
    rows = tb.findall('Row')
    cols = tb.findall('Column')
    nrow = hr + br + fr
    if len(rows) != nrow:
        rep.err('tabelle', f'{s}: {len(rows)} Row ≠ Header {hr} + Body {br} + Footer {fr}')
    if len(cols) != cc:
        rep.err('tabelle', f'{s}: {len(cols)} Column ≠ ColumnCount {cc}')
    if br < 1:
        rep.err('tabelle', f'{s}: BodyRowCount {br} (InDesign braucht mindestens eine Körperzeile)')
    for i, r in enumerate(rows):
        if r.get('Name') != str(i) or r.get('Self') != f'{s}Row{i}':
            rep.warn('tabelle', f'{s}: Row {i} Name/Self {r.get("Name")}/{r.get("Self")}')
    for i, c in enumerate(cols):
        if c.get('Name') != str(i) or c.get('Self') != f'{s}Column{i}':
            rep.warn('tabelle', f'{s}: Column {i} Name/Self {c.get("Name")}/{c.get("Self")}')
    rh = [float(r.get('SingleRowHeight', 0)) for r in rows]
    cw = [float(c.get('SingleColumnWidth', 0)) for c in cols]
    grid = {}
    for cell in tb.findall('Cell'):
        nm = cell.get('Name', '')
        m = re.match(r'^(\d+):(\d+)$', nm)
        if not m:
            rep.err('tabelle', f'{s}: Zellname „{nm}“')
            continue
        c, r = int(m.group(1)), int(m.group(2))
        rs, cs = int(cell.get('RowSpan', 1)), int(cell.get('ColumnSpan', 1))
        if c >= cc or r >= nrow or c + cs > cc or r + rs > nrow or rs < 1 or cs < 1:
            rep.err('tabelle', f'{s}: Zelle {nm} (Span {cs}×{rs}) außerhalb {cc}×{nrow}')
            continue
        if cell.get('Self') != f'{s}i{c}_{r}':
            rep.warn('tabelle', f'{s}: Zelle {nm} Self {cell.get("Self")}')
        for dr in range(rs):
            for dc in range(cs):
                k = (c + dc, r + dr)
                if k in grid:
                    rep.err('tabelle', f'{s}: Position {k[0]}:{k[1]} doppelt belegt ({grid[k]}, {nm})')
                grid[k] = nm
        if rs > 1 and (r < hr) != (r + rs - 1 < hr):
            rep.err('tabelle', f'{s}: Zelle {nm} spannt über Kopf/Körper-Grenze')
        w = sum(cw[c:c + cs])
        h = sum(rh[r:r + rs])
        li, ri = float(cell.get('LeftInset', 0)), float(cell.get('RightInset', 0))
        ti, bi = float(cell.get('TopInset', 0)), float(cell.get('BottomInset', 0))
        if li + ri >= w - 0.01 and w > 0:
            rep.warn('tabelle', f'{s}: Zelle {nm} Einzüge {li}+{ri} ≥ Breite {w:.2f}')
        if ti + bi > h + 0.01:
            rep.warn('tabelle', f'{s}: Zelle {nm} Einzüge {ti}+{bi} > Höhe {h:.2f}')
        mfo = cell.get('MinimumFirstBaselineOffset')
        if mfo is not None and float(mfo) + ti > h + 0.01:
            rep.warn('tabelle', f'{s}: Zelle {nm} erste Grundlinie {mfo}+{ti} unter Zellhöhe {h:.2f}')
    missing = [(c, r) for c in range(cc) for r in range(nrow) if (c, r) not in grid]
    if missing:
        rep.err('tabelle', f'{s}: {len(missing)} Positionen ohne Zelle, z. B. {missing[:4]}')
    # Rahmen
    fr_ = story_frames.get(story, [])
    if fr_:
        ch, pg, (x0, y0, x1, y1), m = fr_[0]
        tw, th = sum(cw), sum(rh)
        if tw > (x1 - x0) + 0.05:
            rep.err('tabelle', f'S. {pg}: Tabelle {s} {tw:.2f} pt breiter als Rahmen {x1 - x0:.2f} pt')
        if th > (y1 - y0) + 0.05:
            rep.err('tabelle', f'S. {pg}: Tabelle {s} {th:.2f} pt höher als Rahmen {y1 - y0:.2f} pt (Übersatz)')
        rep.note(f'Tabelle {s} (S. {pg})', f'{cc} Sp × {nrow} Z (Kopf {hr}), {tw:.1f}×{th:.1f} pt in Rahmen {x1 - x0:.1f}×{y1 - y0:.1f} pt, '
                 f'min. Spalte {min(cw):.2f}, min. Zeile {min(rh):.2f}')


# ----------------------------------------------------------------------------------------------------------------
# 9. SimpleIDML
# ----------------------------------------------------------------------------------------------------------------
def check_simpleidml(path, rep):
    import warnings
    warnings.simplefilter('ignore')
    try:
        from simple_idml.idml import IDMLPackage
    except ImportError:
        rep.note('SimpleIDML', 'nicht installiert')
        return
    try:
        with IDMLPackage(path) as p:
            sp = p.spreads
            pages = sum(len(s.pages) for s in p.spreads_objects)
            st = p.stories
            ff = [f.get('Name') for f in p.font_families]
            xml = p.export_xml()
            rep.note('SimpleIDML', f'geladen: {len(sp)} Spreads, {pages} Seiten, {len(st)} Stories, Familien {ff}, export_xml {len(xml)} Byte')
    except Exception as e:  # noqa: BLE001
        rep.err('simpleidml', f'{type(e).__name__}: {e}')


# ----------------------------------------------------------------------------------------------------------------
# 10. Reproduzierbarkeit
# ----------------------------------------------------------------------------------------------------------------
def _ttf_core(data):
    """TrueType-Daten ohne Zeitstempel (head.created/modified/checkSumAdjustment) → Vergleichsschlüssel."""
    from fontTools.ttLib import TTFont
    f = TTFont(io.BytesIO(data), lazy=True)
    parts = []
    for tag in sorted(f.reader.keys()):
        d = f.reader[tag]
        if tag == 'head':
            d = d[:8] + b'\0' * 4 + d[12:20] + b'\0' * 16 + d[36:]
        parts.append(tag.encode() + hashlib.sha1(d).digest())
    return b''.join(parts)


def _pdf_canon(path):
    """PDF-Objekte kanonisch (Streams dekodiert, eingebettete TrueType-Schriften ohne Zeitstempel)."""
    from pypdf import PdfReader
    from pypdf.generic import DictionaryObject, ArrayObject, IndirectObject, StreamObject

    def canon(o):
        if isinstance(o, IndirectObject):
            return ('R', o.idnum, o.generation)
        if isinstance(o, DictionaryObject):
            return tuple(sorted((str(k), canon(v)) for k, v in o.items()))
        if isinstance(o, ArrayObject):
            return tuple(canon(v) for v in o)
        return repr(o)
    r = PdfReader(path)
    out = []
    for i in range(1, int(r.trailer['/Size'])):
        try:
            o = r.get_object(i)
        except Exception:  # noqa: BLE001
            continue
        if isinstance(o, StreamObject):
            d = o.get_data()
            if d[:4] in (b'\x00\x01\x00\x00', b'true'):
                try:
                    d = _ttf_core(d)
                except Exception:  # noqa: BLE001
                    pass
            hdr = {k: v for k, v in o.items() if k not in ('/Length', '/Filter', '/DecodeParms')}
            out.append((i, canon(DictionaryObject(hdr)), hashlib.sha1(d).hexdigest()))
        else:
            out.append((i, canon(o)))
    return out


def compare_runs(dir1, dir2, idml_name, rep):
    p1, p2 = os.path.join(dir1, idml_name), os.path.join(dir2, idml_name)
    z1, z2 = zipfile.ZipFile(p1), zipfile.ZipFile(p2)
    n1, n2 = z1.namelist(), z2.namelist()
    if n1 != n2:
        rep.err('repro', f'ZIP-Einträge/Reihenfolge verschieden: {len(n1)} vs {len(n2)}; nur in 1: {sorted(set(n1) - set(n2))[:5]}, nur in 2: {sorted(set(n2) - set(n1))[:5]}')
    diff = []
    for n in sorted(set(n1) & set(n2)):
        a, b = z1.read(n), z2.read(n)
        if a == b:
            continue
        if n == 'META-INF/metadata.xml':
            strip = lambda x: re.sub(rb'\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ', b'T', x)  # noqa: E731
            if strip(a) == strip(b):
                continue
        diff.append(n)
    if diff:
        rep.err('repro', f'{len(diff)} Paketdateien inhaltlich verschieden: {diff[:8]}')
    t1 = {i.filename: i.date_time for i in z1.infolist()}
    t2 = {i.filename: i.date_time for i in z2.infolist()}
    if t1 != t2:
        rep.note('repro ZIP-Zeitstempel', 'verschieden (erwartet: Exportzeit)')
    raw_same = open(p1, 'rb').read() == open(p2, 'rb').read()
    rep.note('repro IDML bytegleich', raw_same)
    for sub in ('Links', 'Document Fonts'):
        a = {os.path.basename(p): hashlib.sha1(open(p, 'rb').read()).hexdigest() for p in glob.glob(os.path.join(dir1, sub, '*'))}
        b = {os.path.basename(p): hashlib.sha1(open(p, 'rb').read()).hexdigest() for p in glob.glob(os.path.join(dir2, sub, '*'))}
        if set(a) != set(b):
            rep.err('repro', f'{sub}/: Dateimengen verschieden (nur 1: {sorted(set(a) - set(b))[:4]}, nur 2: {sorted(set(b) - set(a))[:4]})')
        d = sorted(k for k in set(a) & set(b) if a[k] != b[k])
        real = []
        for k in d:
            f1, f2 = os.path.join(dir1, sub, k), os.path.join(dir2, sub, k)
            try:
                same = (_ttf_core(open(f1, 'rb').read()) == _ttf_core(open(f2, 'rb').read())) if k.lower().endswith(('.ttf', '.otf')) \
                    else (_pdf_canon(f1) == _pdf_canon(f2)) if k.lower().endswith('.pdf') else False
            except Exception:  # noqa: BLE001
                same = False
            if not same:
                real.append(k)
        if real:
            rep.err('repro', f'{sub}/: {len(real)} Dateien inhaltlich verschieden: {real[:6]}')
        if len(d) > len(real):
            rep.warn('repro', f'{sub}/: {len(d) - len(real)} Dateien nur durch Zeitstempel verschieden (Schrift head.created/modified), z. B. {sorted(set(d) - set(real))[:3]}')
        rep.note(f'repro {sub}/', f'{len(a)} Dateien, {len(d)} bytegleich verschieden, {len(real)} inhaltlich verschieden')
    l1, l2 = os.path.join(dir1, 'LIESMICH.txt'), os.path.join(dir2, 'LIESMICH.txt')
    if os.path.exists(l1) and os.path.exists(l2):
        a = re.sub(r'\d{4}-\d\d-\d\d', 'D', open(l1, encoding='utf-8').read())
        b = re.sub(r'\d{4}-\d\d-\d\d', 'D', open(l2, encoding='utf-8').read())
        if a != b:
            rep.err('repro', 'LIESMICH.txt verschieden (über das Datum hinaus)')


# ----------------------------------------------------------------------------------------------------------------
# 10. Vokabular ohne Referenzen (scripts/idml/vokabular.json): Elemente, Attribute, Aufzählungswerte
# ----------------------------------------------------------------------------------------------------------------
VOCAB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'vokabular.json')
# frei belegbare Attribute (Namen, Texte, Versionen) – nie als Aufzählung behandeln
FREE_ATTRS = {'Name', 'Self', 'FontStyle', 'Content', 'FontStyleName', 'AppliedFont', 'FontFamily', 'BaseName', 'NamePrefix', 'FullName',
              'FullNameNative', 'FontStyleNameNative', 'PostScriptName', 'Version', 'PlatformName', 'TypekitID', 'KeyboardShortcut', 'StoryTitle',
              'src', 'LinkResourceURI', 'AssetURL', 'AssetID', 'ImageTypeName', 'LinkResourceFormat', 'Marker', 'SectionPrefix', 'Title',
              'OverrideList', 'TabOrder', 'OverriddenPageItemProps', 'AlternateColorValue', 'ColorValue', 'SingleQuotes', 'DoubleQuotes',
              'PrimaryLanguageName', 'SublanguageName', 'AppliedLanguage', 'Label', 'MarkupTag'}
# gültige Aufzählungswerte, die in den Referenzen nicht vorkommen (InDesign-DOM CC 2020)
ENUMS.update({
    'TableDirection': {'LeftToRightDirection', 'RightToLeftDirection'},
    'ImportPolicy': {'NoAutoImport', 'ImportStyles'},
    'ExportPolicy': {'NoAutoExport', 'ExportStyles'},
    'StoredState': {'Normal', 'Embedded', 'LinkEmbedded', 'Missing'},
})
# Texte von Properties-Kindern mit type="enumeration", die in den Referenzen nicht vorkommen
ENUM_TEXTS = {
    'LayerColor': {'LightBlue', 'Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Cyan', 'Gray', 'Black', 'Orange', 'DarkGreen', 'Teal', 'Tan', 'Brown',
                   'Violet', 'Gold', 'DarkBlue', 'Pink', 'Lavender', 'BrickRed', 'OliveGreen', 'Peach', 'Burgundy', 'GrassGreen', 'Ochre',
                   'Purple', 'LightGray', 'Charcoal', 'GridBlue', 'GridOrange', 'Fiesta', 'LightOlive', 'Lipstick', 'Cute Teal', 'Sulphur',
                   'GridGreen', 'White'},
    'Leading': {'Auto'},
    'PreviewColor': {'Nothing'},
    'PageColor': {'UseMasterColor', 'Nothing'},
    'PageNumberStyle': {'Arabic', 'UpperRoman', 'LowerRoman', 'UpperLetters', 'LowerLetters'},
    'TagColor': {'LightBlue'},
}


def collect_enum_texts(trees):
    out = collections.defaultdict(set)
    for name, root in trees.items():
        for el in root.iter():
            if isinstance(el.tag, str) and el.get('type') == 'enumeration' and el.text:
                out[local(el.tag)].add(el.text)
    return out


def build_vocab(ref_dir):
    """Vokabular aus den Referenz-IDMLs plus den geprüften DOM-Eigenschaften (VETTED/ENUMS) – Grundlage für die
    Prüfung ohne --refs. Aufruf: validate.py --refs DIR --write-vocab scripts/idml/vokabular.json"""
    (rvoc, rkids), implicit, n = ref_vocab(ref_dir)
    texts = collections.defaultdict(set)
    for p in sorted(glob.glob(os.path.join(ref_dir, '*.idml'))):
        files, trees = load_package(p, Report())
        if trees:
            for k, v in collect_enum_texts(trees).items():
                texts[k] |= v
    tags = set(rvoc) | {c for s in rkids.values() for c in s} | set(rkids) | {t for t in VETTED if t != '*'}
    elements = {}
    for tag in sorted(tags):
        attrs = {}
        names = set(rvoc.get(tag, {})) | VETTED.get(tag, set())
        for a in sorted(names):
            vals = set(rvoc.get(tag, {}).get(a, {}))
            attrs[a] = enum_of(a, vals)
        elements[tag] = attrs
    for k, v in ENUM_TEXTS.items():
        texts[k] |= v
    return {'_hinweis': 'Erzeugt mit validate.py --refs DIR --write-vocab; Grundlage der Vokabularprüfung ohne Referenzen. '
                        'null = beliebiger Wert, Liste = erlaubte Aufzählungswerte.',
            'referenzen': n, 'implizit': sorted(implicit), 'global': {a: enum_of(a, set()) for a in sorted(VETTED['*'])},
            'elemente': elements, 'aufzaehlung_texte': {k: sorted(v) for k, v in sorted(texts.items())}}


def enum_of(a, vals):
    if a in BOOL_ATTRS or (vals and vals <= {'true', 'false'}):
        return ['false', 'true']
    if a in ENUMS:
        return sorted(set(ENUMS[a]) | {v for v in vals if ENUM_RX.match(v)})
    if not vals or a in FREE_ATTRS or a in ID_ATTRS or a.startswith('{'):
        return None
    if not all(ENUM_RX.match(v) for v in vals) or any(REF_PREFIX.match(v) for v in vals) or all(ID_RX.match(v) for v in vals):
        return None
    if len(vals) > 40:
        return None
    return sorted(vals)


def check_vocab(trees, vocab, rep):
    E, G, T = vocab['elemente'], vocab.get('global', {}), {k: set(v) for k, v in vocab.get('aufzaehlung_texte', {}).items()}
    seen = set()
    n = 0
    for name, root in trees.items():
        if name.startswith('META-INF/'):
            continue
        for el in root.iter():
            if not isinstance(el.tag, str):
                continue
            tag = local(el.tag)
            n += 1
            spec = E.get(tag)
            if spec is None:
                if ('el', tag) not in seen:
                    seen.add(('el', tag))
                    rep.err('vokabular', f'{name}: Element <{tag}> ist InDesign unbekannt (weder in den Referenzen noch geprüfte DOM-Eigenschaft)')
                continue
            for a, v in el.attrib.items():
                if a.startswith('{'):
                    continue
                if a in spec:
                    allowed = spec[a]
                elif a in G:
                    allowed = G[a]
                else:
                    if ('at', tag, a) not in seen:
                        seen.add(('at', tag, a))
                        rep.err('vokabular', f'{name}: Attribut {tag}@{a}="{v}" ist InDesign unbekannt (Tippfehler?)')
                    continue
                if allowed is not None and v not in allowed and ('val', tag, a, v) not in seen:
                    seen.add(('val', tag, a, v))
                    rep.err('aufzählung', f'{name}: {tag}@{a}="{v}" ist kein gültiger Wert (erlaubt: {", ".join(allowed[:8])}{" …" if len(allowed) > 8 else ""})')
            if el.get('type') == 'enumeration' and tag in T and (el.text or '') not in T[tag] and ('txt', tag, el.text) not in seen:
                seen.add(('txt', tag, el.text))
                rep.err('aufzählung', f'{name}: <{tag} type="enumeration">{el.text}</{tag}> ist kein gültiger Wert')
    rep.note('Vokabular', f'{n} Elemente gegen {len(E)} bekannte Elementtypen geprüft ({os.path.basename(VOCAB_FILE)}, {vocab.get("referenzen", "?")} Referenz-IDMLs)')


# ----------------------------------------------------------------------------------------------------------------
# 11. Formatketten (BasedOn): Zyklen, Art des Ziels, NextStyle
# ----------------------------------------------------------------------------------------------------------------
STYLE_KINDS = ('ParagraphStyle', 'CharacterStyle', 'ObjectStyle', 'TableStyle', 'CellStyle')


def check_style_chains(trees, selfs, rep):
    styles = trees.get('Resources/Styles.xml')
    if styles is None:
        return
    n = 0
    cycles = set()
    for kind in STYLE_KINDS:
        for el in styles.iter(kind):
            n += 1
            seen = [el.get('Self')]
            cur = el
            while True:
                b = cur.find('Properties/BasedOn')
                if b is None:
                    break
                txt = b.text or ''
                tgt = txt if b.get('type') == 'object' else f'{kind}/' + txt.replace(':', '%3a')
                hit = selfs.get(tgt)
                if hit is None:
                    break   # ungelöst: meldet check_refs
                tel = hit[0]
                if local(tel.tag) != kind:
                    rep.err('formatkette', f'{kind} „{el.get("Name")}“: BasedOn verweist auf {local(tel.tag)} {tgt}')
                    break
                if tgt in seen:
                    ring = frozenset(seen[seen.index(tgt):])
                    if ring not in cycles:
                        cycles.add(ring)
                        rep.err('formatkette', f'{kind}: Zyklus über BasedOn: {" → ".join(seen[seen.index(tgt):] + [tgt])} (betrifft auch alle darauf basierenden Formate)')
                    break
                seen.append(tgt)
                cur = tel
            ns = el.get('NextStyle')
            if kind == 'ParagraphStyle' and ns and ns in selfs and local(selfs[ns][0].tag) != 'ParagraphStyle':
                rep.err('formatkette', f'ParagraphStyle „{el.get("Name")}“: NextStyle verweist auf {local(selfs[ns][0].tag)}')
    rep.note('Formatketten', f'{n} Formate ohne Zyklus geprüft')


# ----------------------------------------------------------------------------------------------------------------
# 12. Musterseiten: Musterobjekte nur dort, wo die Seite eine Standard-Fußzeile hat; keine doppelten Objekte
# ----------------------------------------------------------------------------------------------------------------
def _items_with_bbox(container):
    out = []

    def walk(el, M):
        for ch in el:
            if not isinstance(ch.tag, str) or local(ch.tag) not in PAGE_ITEMS:
                continue
            m = mat_mul(M, tuple(nums(ch.get('ItemTransform', '1 0 0 1 0 0'))))
            if local(ch.tag) == 'Group':
                walk(ch, m)
                continue
            pts = path_points(ch)
            if pts:
                out.append((local(ch.tag), bbox([apply(m, x, y) for x, y in pts]), ch))
    walk(container, (1, 0, 0, 1, 0, 0))
    return out


def check_masters(trees, selfs, expect, rep):
    dm = trees['designmap.xml']
    masters = {}
    for el in dm:
        if dm_name(el) != 'idPkg:MasterSpread':
            continue
        root = trees.get(el.get('src'))
        ms = root.find('MasterSpread') if root is not None else None
        if ms is None:
            continue
        items = _items_with_bbox(ms)
        masters[ms.get('Self')] = {'name': ms.get('Name'), 'left': [i for i in items if (i[1][0] + i[1][2]) / 2 < 0],
                                   'right': [i for i in items if (i[1][0] + i[1][2]) / 2 >= 0]}
    foot = set(expect.get('footPages', [])) if expect else None
    mpages = set(expect.get('masterPages', [])) if expect else None
    assign = collections.defaultdict(list)
    dups = 0
    for el in dm:
        if dm_name(el) != 'idPkg:Spread':
            continue
        root = trees.get(el.get('src'))
        sp = root.find('Spread') if root is not None else None
        if sp is None:
            continue
        show = sp.get('ShowMasterItems', 'true') != 'false'
        items = _items_with_bbox(sp)
        for pg in sp.findall('Page'):
            side = 'left' if nums(pg.get('ItemTransform'))[4] < -0.01 else 'right'
            am = pg.get('AppliedMaster')
            m = masters.get(am)
            mitems = m[side] if m else []
            visible = show and bool(mitems)
            name = pg.get('Name')
            assign[m['name'] if m else '–'].append(name)
            if visible:
                own = [i for i in items if ((i[1][0] + i[1][2]) / 2 < 0) == (side == 'left')]
                for t, bb, ch in own:
                    for mt, mbb, mch in mitems:
                        if t == mt and all(abs(a - b) < 0.5 for a, b in zip(bb, mbb)):
                            dups += 1
                            rep.err('musterseite', f'S. {name}: {t} „{ch.get("Name")}“ liegt doppelt – auf der Seite und auf der Musterseite „{m["name"]}“ '
                                    f'(„{mch.get("Name")}“) an derselben Stelle')
            if expect and name.isdigit():
                n = int(name)
                if visible and n not in foot:
                    rep.err('musterseite', f'S. {name}: zeigt die Objekte der Musterseite „{m["name"]}“ (Fußzeile), hat im HTML aber keine Standard-Fußzeile')
                elif visible and n not in mpages:
                    rep.err('musterseite', f'S. {name}: zeigt Musterobjekte, ihr Fuß ist aber nicht auf die Musterseite gewandert (doppelte Fußzeile)')
                if n in mpages and not visible:
                    rep.err('musterseite', f'S. {name}: Fuß liegt auf der Musterseite, die Musterobjekte sind auf der Seite aber nicht sichtbar (Fußzeile fehlt)')
    rep.note('Musterseiten', {k: ','.join(v) for k, v in assign.items()})


# ----------------------------------------------------------------------------------------------------------------
# 13. Silbentrennung: Trennbereich beim Ein-Zeilen-Setzer, Wörterbuchtrennung nur wo Chromium trennt
# ----------------------------------------------------------------------------------------------------------------
PARA_DEFAULTS = {'Composer': 'HL Composer', 'HyphenationZone': '36', 'HyphenateLadderLimit': '3', 'Hyphenation': 'true', 'HyphenateWordsLongerThan': '5',
                 'NoBreak': 'false'}


def _eff(els, attr):
    for e in els:
        if e is None:
            continue
        v = e.get(attr)
        if v is not None:
            return v
    return PARA_DEFAULTS.get(attr)


def _pchain(selfs, s):
    ch = style_chain(selfs, s, 'ParagraphStyle')
    root = selfs.get('ParagraphStyle/$ID/[No paragraph style]')
    if root is not None and (not ch or ch[-1] is not root[0]):
        ch.append(root[0])
    return ch


def _cchain(selfs, s):
    return style_chain(selfs, s, 'CharacterStyle') if s and not s.endswith('[No character style]') else []


def _is_letter(ch):
    return unicodedata.category(ch)[0] in 'LM'


def _paragraph_texts(psr, selfs, pch):
    """Absätze eines ParagraphStyleRange als Listen von (Zeichen, NoBreak, CharacterStyleRange)."""
    paras = [[]]
    for csr in psr.findall('CharacterStyleRange'):
        cch = [csr] + _cchain(selfs, csr.get('AppliedCharacterStyle'))
        nob = _eff(cch + [psr] + pch, 'NoBreak') == 'true'
        for k in csr:
            if not isinstance(k.tag, str):
                continue
            t = local(k.tag)
            if t == 'Content':
                for c in (k.text or ''):
                    paras[-1].append((c, nob, csr))
            elif t == 'Br':
                paras.append([])
    return [p for p in paras if p]


def check_hyphenation(trees, selfs, rep):
    styles = trees.get('Resources/Styles.xml')
    if styles is None:
        return
    single = ('HL Single', 'HL Single Optyca')
    zone, ladder = [], []
    for st in styles.iter('ParagraphStyle'):
        ch = _pchain(selfs, st.get('Self'))
        if _eff(ch, 'Composer') in single:
            z, ll = float(_eff(ch, 'HyphenationZone')), int(float(_eff(ch, 'HyphenateLadderLimit')))
            if z != 0:
                zone.append(f'{st.get("Name")} ({z:g} pt)')
            if ll != 0:
                ladder.append(f'{st.get("Name")} ({ll})')
    bad = len(zone) + len(ladder)
    if zone:
        rep.err('silbentrennung', f'{len(zone)} Absatzformate mit Ein-Zeilen-Setzer und Trennbereich ≠ 0 – InDesign schiebt Wörter in die nächste Zeile, statt wie '
                f'Chromium zu trennen (HyphenationZone="0"): {", ".join(zone[:6])}{" …" if len(zone) > 6 else ""}')
    if ladder:
        rep.err('silbentrennung', f'{len(ladder)} Absatzformate mit begrenzten Trennungen in Folge – Chromium kennt keine Grenze (HyphenateLadderLimit="0"): '
                f'{", ".join(ladder[:6])}{" …" if len(ladder) > 6 else ""}')
    unprot = []
    nprot = 0
    for name, root in trees.items():
        if not name.startswith('Stories/'):
            continue
        for psr in root.iter('ParagraphStyleRange'):
            pch = _pchain(selfs, psr.get('AppliedParagraphStyle'))
            chain = [psr] + pch
            if any(psr.get(k) is not None for k in ('Composer', 'HyphenationZone', 'HyphenateLadderLimit')) and _eff(chain, 'Composer') in single:
                if float(_eff(chain, 'HyphenationZone')) != 0 or int(float(_eff(chain, 'HyphenateLadderLimit'))) != 0:
                    rep.err('silbentrennung', f'{name}: lokale Abweichung setzt Trennbereich/Trennungen in Folge ≠ 0')
            if _eff(chain, 'Hyphenation') != 'true':
                continue
            minlen = int(float(_eff(chain, 'HyphenateWordsLongerThan'))) + 1
            for para in _paragraph_texts(psr, selfs, pch):
                i = 0
                while i < len(para):
                    if not (_is_letter(para[i][0]) or para[i][0] == '­'):
                        i += 1
                        continue
                    j = i
                    while j < len(para) and (_is_letter(para[j][0]) or para[j][0] == '­'):
                        j += 1
                    word = para[i:j]
                    letters = sum(1 for c, _, _ in word if c != '­')
                    if letters >= minlen:
                        if word[0][0] == '­' and '­' not in ''.join(c for c, _, _ in word[1:]):
                            nprot += 1
                        elif not any(c == '­' for c, _, _ in word) and not all(nb for _, nb, _ in word):
                            unprot.append(f'{name}: „{"".join(c for c, _, _ in word)}“')
                    i = j
    if unprot:
        rep.err('silbentrennung', f'{len(unprot)} Wörter ab 8 Buchstaben ohne Trennstelle in Absätzen mit Silbentrennung – InDesign trennt sie nach Wörterbuch, '
                f'Chromium nicht (bedingten Trennstrich vor das Wort setzen): {", ".join(unprot[:8])}{" …" if len(unprot) > 8 else ""}')
    rep.note('Silbentrennung', f'Ein-Zeilen-Setzer-Formate mit Trennbereich ≠ 0: {bad}; geschützte Wörter (bedingter Trennstrich davor): {nprot}; ungeschützt: {len(unprot)}')


# ----------------------------------------------------------------------------------------------------------------
# 14. Tabellenzellen: Satzbreite (fontTools) – unteilbare Wörter, Zeilenzahl gegen Zeilenhöhe
# ----------------------------------------------------------------------------------------------------------------
class Metrics:
    def __init__(self, fonts_dir):
        from fontTools.ttLib import TTFont
        self.f = {}
        for p in sorted(glob.glob(os.path.join(fonts_dir, '*.[ot]tf'))):
            t = TTFont(p)
            nm = t['name']
            fam = str(nm.getName(16, 3, 1, 0x409) or nm.getName(1, 3, 1, 0x409))
            sty = str(nm.getName(17, 3, 1, 0x409) or nm.getName(2, 3, 1, 0x409))
            upm = t['head'].unitsPerEm
            hh = t['hhea']
            self.f[(fam, sty)] = {'cmap': t.getBestCmap(), 'hmtx': t['hmtx'], 'upm': upm, 'kern': self._kern(t),
                                  'asc': hh.ascent / upm, 'desc': -hh.descent / upm}

    @staticmethod
    def _kern(t):
        pairs, classes = {}, []
        try:
            gpos = t['GPOS'].table
        except KeyError:
            return pairs, classes
        for fr in gpos.FeatureList.FeatureRecord:
            if fr.FeatureTag != 'kern':
                continue
            for idx in fr.Feature.LookupListIndex:
                lk = gpos.LookupList.Lookup[idx]
                for s in lk.SubTable:
                    if lk.LookupType == 9:
                        s = s.ExtSubTable
                    if getattr(s, 'LookupType', lk.LookupType) != 2 or not hasattr(s, 'Format'):
                        continue
                    if s.Format == 1:
                        cov = s.Coverage.glyphs
                        for i, ps in enumerate(s.PairSet):
                            for pvr in ps.PairValueRecord:
                                v = getattr(pvr.Value1, 'XAdvance', 0) if pvr.Value1 is not None else 0
                                if v:
                                    pairs.setdefault((cov[i], pvr.SecondGlyph), v)
                    elif s.Format == 2:
                        classes.append((set(s.Coverage.glyphs), s.ClassDef1.classDefs, s.ClassDef2.classDefs, s.Class1Record))
        return pairs, classes

    def kern(self, f, a, b):
        pairs, classes = f['kern']
        v = pairs.get((a, b))
        if v is not None:
            return v
        for cov, c1, c2, recs in classes:
            if a in cov:
                try:
                    r = recs[c1.get(a, 0)].Class2Record[c2.get(b, 0)].Value1
                    return getattr(r, 'XAdvance', 0) if r is not None else 0
                except IndexError:
                    return 0
        return 0

    def width(self, glyphs):
        """glyphs: Liste von (Zeichen, (Familie, Stil), Größe, Laufweite) → Breite in pt (Laufweite je Zeichen, Paarkerning)."""
        w, prev = 0.0, None
        for c, face, size, tr in glyphs:
            f = self.f.get(face)
            if f is None or c in '­﻿​':
                continue
            g = f['cmap'].get(ord(c)) or f['cmap'].get(0x20)
            if g is None:
                continue
            k = self.kern(f, prev[0], g) if prev and prev[1] == face else 0
            w += (f['hmtx'][g][0] + k) / f['upm'] * size + tr / 1000 * size
            prev = (g, face)
        return w


def check_cells(trees, selfs, fonts_dir, rep):
    if not fonts_dir or not os.path.isdir(fonts_dir):
        rep.note('Zellbreiten', 'übersprungen (keine Schriften)')
        return
    M = Metrics(fonts_dir)
    ncell = nseg = 0
    BREAK_AFTER = set('-‐–—/')
    for name, root in trees.items():
        if not name.startswith('Stories/'):
            continue
        for tb in root.iter('Table'):
            cw = [float(c.get('SingleColumnWidth', 0)) for c in tb.findall('Column')]
            rh = [float(r.get('SingleRowHeight', 0)) for r in tb.findall('Row')]
            for cell in tb.findall('Cell'):
                c0, r0 = map(int, cell.get('Name').split(':'))
                cs, rs = int(cell.get('ColumnSpan', 1)), int(cell.get('RowSpan', 1))
                inner = sum(cw[c0:c0 + cs]) - float(cell.get('LeftInset', 0)) - float(cell.get('RightInset', 0))
                height = sum(rh[r0:r0 + rs])
                ncell += 1
                y = float(cell.get('TopInset', 0))
                first_line = True
                last_desc = 0
                fixed = cell.get('FirstBaselineOffset') == 'FixedHeight'
                for psr in cell.findall('ParagraphStyleRange'):
                    pch = _pchain(selfs, psr.get('AppliedParagraphStyle'))
                    chain = [psr] + pch
                    hy = _eff(chain, 'Hyphenation') == 'true'
                    li, ri, fi = (float(_eff(chain, k) or 0) for k in ('LeftIndent', 'RightIndent', 'FirstLineIndent'))
                    sb = float(_eff(chain, 'SpaceBefore') or 0)
                    for pi, para in enumerate(_paragraph_texts(psr, selfs, pch)):
                        # Zeichen mit wirksamer Schrift; Umbruchstellen: Leerzeichen, nach Strichen, weicher Trennstrich (bei Trennung),
                        # erzwungener Zeilenumbruch U+2028; NoBreak unterdrückt alles innerhalb
                        gl, lead, size0, face0 = [], None, None, None
                        for c, nob, csr in para:
                            cch = [csr] + _cchain(selfs, csr.get('AppliedCharacterStyle'))
                            seq = cch + chain

                            def ev(a, seq=seq):
                                for e in seq:
                                    v = e.get(a)
                                    if v is None:
                                        p = e.find('Properties/' + a)
                                        v = p.text if p is not None else None
                                    if v is not None:
                                        return v
                                return None
                            face = (ev('AppliedFont'), ev('FontStyle'))
                            size = float(ev('PointSize') or 12)
                            tr = float(ev('Tracking') or 0)
                            if ev('Capitalization') == 'AllCaps':
                                c = c.upper()
                            gl.append((c, face, size, tr, nob))
                            if lead is None:
                                lv = ev('Leading')
                                lead = float(lv) if lv not in (None, 'Auto') else 1.2 * size
                                size0, face0 = size, face
                        # Segmente
                        segs, cur, kinds = [], [], []
                        for k, (c, face, size, tr, nob) in enumerate(gl):
                            if c == ' ':
                                segs.append(cur); kinds.append('force'); cur = []
                                continue
                            if c == ' ' and not nob:
                                segs.append(cur); kinds.append('space'); cur = []
                                continue
                            if c == '­':
                                if hy and not nob:
                                    segs.append(cur); kinds.append('shy'); cur = []
                                continue
                            cur.append((c, face, size, tr))
                            if c in BREAK_AFTER and not nob:
                                segs.append(cur); kinds.append('after'); cur = []
                        segs.append(cur); kinds.append('end')
                        sp_w = M.width([(' ', face0, size0, 0)]) if face0 else 0
                        hy_w = M.width([('-', face0, size0, 0)]) if face0 else 0
                        lines = 1
                        x = 0.0
                        line_start = True
                        avail = inner - li - ri - (fi if True else 0)
                        for si, seg in enumerate(segs):
                            w = M.width(seg)
                            nseg += 1
                            avail_line = inner - li - ri - (fi if lines == 1 else 0)
                            avail_any = inner - li - ri - min(0, fi) if si else avail
                            txt = ''.join(g[0] for g in seg)
                            if txt.strip() and w > avail_any + 0.01:
                                rep.err('zellbreite', f'{name}: Tabelle {tb.get("Self")}, Zelle {cell.get("Name")}: unteilbares „{txt[:30]}“ ist {w:.2f} pt breit, '
                                        f'die Zelle bietet {avail_any:.2f} pt – InDesign bricht mitten im Wort um oder setzt Übersatz')
                            elif txt.strip() and w > avail_any - 0.5:
                                rep.warn('zellbreite', f'{name}: Tabelle {tb.get("Self")}, Zelle {cell.get("Name")}: „{txt[:30]}“ passt knapp ({w:.2f} von {avail_any:.2f} pt)')
                            # gieriger Umbruch
                            need = w + (0 if line_start else 0)
                            extra_hy = hy_w if si + 1 < len(kinds) and kinds[si] == 'shy' else 0
                            if not line_start and x + need > avail_line + 0.01:
                                lines += 1
                                x = 0.0
                                avail_line = inner - li - ri
                            x += w
                            k = kinds[si]
                            if k == 'force':
                                lines += 1
                                x = 0.0
                                line_start = True
                                continue
                            line_start = False
                            if k == 'space':
                                x += sp_w
                        # Höhe: erste Grundlinie (fest oder Oberlänge), weitere Zeilen im Zeilenabstand
                        if lead is None:
                            continue
                        f = M.f.get(face0) or {'asc': 0.8, 'desc': 0.2}
                        if first_line:
                            y += float(cell.get('MinimumFirstBaselineOffset', 0)) if fixed else f['asc'] * size0
                            y += (lines - 1) * lead
                            first_line = False
                        else:
                            y += sb + lines * lead if pi == 0 else lines * lead
                        last_desc = f['desc'] * size0
                if not first_line:
                    total = y + last_desc + float(cell.get('BottomInset', 0))
                    grow = total - height
                    if grow > 4.0:
                        rep.err('zellbreite', f'{name}: Tabelle {tb.get("Self")}, Zelle {cell.get("Name")}: Inhalt braucht im gierigen Umbruch etwa {grow:.1f} pt mehr '
                                f'als die Zeilenhöhe {height:.1f} pt (zusätzliche Zeile → Tabelle wächst, Übersatz)')
    rep.note('Zellbreiten', f'{ncell} Zellen, {nseg} unteilbare Abschnitte gegen die Spaltenbreite geprüft (fontTools, Laufweite, Paarkerning)')


# ----------------------------------------------------------------------------------------------------------------
def load_package(path, rep):
    zf, files = check_zip(path, rep)
    if zf is None:
        return None, None
    trees = check_xml(files, rep)
    return files, trees


def ref_vocab(ref_dir):
    voc = (collections.defaultdict(lambda: collections.defaultdict(collections.Counter)), collections.defaultdict(set))
    implicit = set()
    paths = sorted(glob.glob(os.path.join(ref_dir, '*.idml')))
    for p in paths:
        r = Report()
        files, trees = load_package(p, r)
        if trees is None:
            continue
        v, k = collect_vocab(trees)
        for t, attrs in v.items():
            for a, vals in attrs.items():
                voc[0][t][a].update(vals)
        for t, s in k.items():
            voc[1][t] |= s
        selfs = index_selfs(trees, Report())
        un = check_refs(trees, selfs, Report())
        implicit |= {x for (_, x) in un}
    return voc, implicit, len(paths)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('idml')
    ap.add_argument('--refs')
    ap.add_argument('--compare')
    ap.add_argument('--fonts')
    ap.add_argument('--json')
    ap.add_argument('--max', type=int, default=12)
    ap.add_argument('--no-simpleidml', action='store_true')
    ap.add_argument('--no-ink', action='store_true', help='Tinten-Prüfung der Grafik-PDFs überspringen')
    ap.add_argument('--expect', help='Erwartungen aus dem DOM (export-idml.cjs): Seiten mit Standard-Fußzeile, Musterseiten-Seiten')
    ap.add_argument('--vocab', default=VOCAB_FILE, help='Vokabular (Standard: scripts/idml/vokabular.json)')
    ap.add_argument('--write-vocab', help='mit --refs: Vokabular aus den Referenzen erzeugen und hierhin schreiben, dann Ende')
    a = ap.parse_args()
    if a.write_vocab:
        if not a.refs:
            ap.error('--write-vocab braucht --refs DIR')
        v = build_vocab(a.refs)
        with open(a.write_vocab, 'w', encoding='utf-8') as f:
            json.dump(v, f, ensure_ascii=False, indent=1, sort_keys=True)
            f.write('\n')
        print(f'Vokabular: {len(v["elemente"])} Elemente aus {v["referenzen"]} Referenz-IDMLs → {a.write_vocab}')
        sys.exit(0)
    rep = Report(a.max)
    path = os.path.abspath(a.idml)
    idml_dir = os.path.dirname(path)
    files, trees = load_package(path, rep)
    if trees is None:
        rep.print()
        sys.exit(1)
    dm = check_designmap(files, trees, rep)
    selfs = index_selfs(trees, rep)
    implicit = set()
    if a.refs:
        rvoc, implicit, n = ref_vocab(a.refs)
        rep.note('Referenzen', f'{n} IDML; implizite Verweise in echten Exporten: {sorted(implicit)[:12]}')
        compare_vocab(collect_vocab(trees), rvoc, rep)
    if os.path.exists(a.vocab):
        with open(a.vocab, encoding='utf-8') as f:
            check_vocab(trees, json.load(f), rep)
    else:
        rep.err('vokabular', f'Vokabular fehlt: {a.vocab} (validate.py --refs DIR --write-vocab {a.vocab})')
    expect = None
    if a.expect:
        with open(a.expect, encoding='utf-8') as f:
            expect = json.load(f)
    check_refs(trees, selfs, rep)
    check_style_chains(trees, selfs, rep)
    check_resources(trees, selfs, dm, rep)
    check_values(trees, rep)
    fonts_dir = a.fonts or os.path.join(idml_dir, 'Document Fonts')
    check_fonts(trees, selfs, fonts_dir, rep)
    frames = check_geometry(trees, files, selfs, idml_dir, rep)
    check_stories(trees, selfs, frames, rep)
    check_masters(trees, selfs, expect, rep)
    check_hyphenation(trees, selfs, rep)
    check_cells(trees, selfs, fonts_dir, rep)
    if not a.no_ink:
        check_ink(idml_dir, rep)
    if not a.no_simpleidml:
        check_simpleidml(path, rep)
    if a.compare:
        compare_runs(idml_dir, os.path.abspath(a.compare), os.path.basename(path), rep)
    rep.print()
    if a.json:
        with open(a.json, 'w', encoding='utf-8') as f:
            json.dump(rep.as_json(), f, ensure_ascii=False, indent=1, default=str)
    sys.exit(1 if rep.count('FEHLER') else 0)


if __name__ == '__main__':
    main()
