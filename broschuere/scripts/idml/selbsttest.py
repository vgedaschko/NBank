#!/usr/bin/env python3
"""Selbsttest des Prüfnetzes: erzeugt aus einem fertigen Paket gezielt beschädigte Kopien (Mutationen) und prüft,
dass validate.py und check.cjs jede davon als FEHLER melden – und das unveränderte Paket nicht.

Aufruf (aus broschuere/, Python mit lxml/fontTools/pypdf):
  python -I scripts/idml/selbsttest.py [dist/indesign/Mietwohnraumfoerderung-2026.idml] [--keep DIR] [--node node]

Die Mutationen decken die Fehlerklassen ab, an denen InDesign beim Öffnen scheitert oder sichtbar abweicht:
ZIP-Aufbau, Verweise, Self-IDs, Schriften, Koordinaten, Tabellen, Vokabular (unbekannte Attribute, ungültige
Aufzählungswerte), Formatketten (Zyklus, falsche Art), Absatztrenner im Text, Musterseiten (Fußzeile auf einer
Seite ohne Standard-Fuß), Silbentrennung (Trennbereich, Trennungen in Folge, Wörterbuchtrennung), Zellbreiten.
Exit-Code 1, wenn eine Mutation unentdeckt bleibt oder das Original beanstandet wird.
"""
import argparse
import concurrent.futures
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))


def load(path):
    z = zipfile.ZipFile(path)
    return {i.filename: z.read(i.filename) for i in z.infolist()}, [i.filename for i in z.infolist()]


def write(d, files, order, src_dir, store_mimetype=True):
    os.makedirs(d, exist_ok=True)
    for sub in ('Links', 'Document Fonts'):
        s, t = os.path.join(src_dir, sub), os.path.join(d, sub)
        if os.path.isdir(s) and not os.path.exists(t):
            try:
                os.symlink(s, t)
            except OSError:
                shutil.copytree(s, t)
    p = os.path.join(d, 'Paket.idml')
    with zipfile.ZipFile(p, 'w') as zo:
        for n in order:
            if n in files:
                zo.writestr(zipfile.ZipInfo(n, (2026, 1, 1, 0, 0, 0)), files[n],
                            compress_type=zipfile.ZIP_STORED if (n == 'mimetype' and store_mimetype) else zipfile.ZIP_DEFLATED)
    return p


class Mut:
    def __init__(self, orig, order):
        self.orig, self.order = orig, order
        self.cases = {}

    def text(self, f):
        return self.orig[f].decode('utf-8')

    def first(self, prefix, needle):
        for n in self.order:
            if n.startswith(prefix) and needle in self.text(n):
                return n
        raise LookupError(f'{prefix} mit {needle!r} nicht gefunden')

    def sub(self, key, f, pattern, repl, count=1, regex=False):
        files = dict(self.orig)
        s = self.text(f)
        s2 = re.sub(pattern, repl, s, count=count) if regex else s.replace(pattern, repl, count or -1)   # count=0: alle
        if s2 == s:
            raise LookupError(f'{key}: Muster nicht gefunden in {f}: {pattern!r}')
        files[f] = s2.encode('utf-8')
        self.cases[key] = (files, self.order, True)


def build(orig, order):
    m = Mut(orig, order)
    st = 'Resources/Styles.xml'
    stories = [n for n in order if n.startswith('Stories/')]
    spreads = [n for n in order if n.startswith('Spreads/')]
    story = next(n for n in stories if '<Table' not in m.text(n) and 'AppliedParagraphStyle="ParagraphStyle/' in m.text(n) and '<Content>' in m.text(n))
    sp = next(n for n in spreads if 'PageCount="2"' in m.text(n) and 'GraphicLine' in m.text(n) and 'FillColor="Color/' in m.text(n)
              and re.search(r'<Rectangle [^>]*ItemTransform="1 0 0 1 -[\d.]+ ', m.text(n)))
    sp_link = m.first('Spreads/', 'LinkResourceURI="file:Links/')
    table = m.first('Stories/', '<Table ')

    files = dict(orig)
    del files[story]
    m.cases['story_fehlt'] = (files, order, True)
    selfs = re.findall(r'<(?:TextFrame|Rectangle|GraphicLine) Self="([^"]+)"', m.text(sp))
    m.sub('self_doppelt', sp, f'Self="{selfs[1]}"', f'Self="{selfs[0]}"')
    m.sub('parentstory_kaputt', sp, 'ParentStory="u', 'ParentStory="x')
    fam = re.search(r'<AppliedFont type="string">([^<]+)</AppliedFont>', m.text(st)).group(1)
    m.sub('schriftfamilie_falsch', st, f'<AppliedFont type="string">{fam}</AppliedFont>', '<AppliedFont type="string">Schrift ohne Datei</AppliedFont>', count=0)
    m.sub('schriftschnitt_falsch', story, 'AppliedCharacterStyle="CharacterStyle/$ID/[No character style]"', 'AppliedCharacterStyle="CharacterStyle/$ID/[No character style]" FontStyle="Thin"')
    m.sub('objekt_ausserhalb', sp, r'(<GraphicLine [^>]*ItemTransform="1 0 0 1 [-\d.]+ )([-\d.]+)"', lambda x: f'{x.group(1)}{float(x.group(2)) - 2000:g}"', regex=True)
    m.sub('ueber_den_bund', sp, r'(<Rectangle [^>]*ItemTransform="1 0 0 1 )(-[\d.]+)( [-\d.]+")', lambda x: f'{x.group(1)}-5{x.group(3)}', regex=True)
    m.sub('bodyrowcount', table, r'BodyRowCount="(\d+)"', lambda x: f'BodyRowCount="{int(x.group(1)) + 1}"', regex=True)
    m.sub('zellname', table, 'Name="0:0"', 'Name="0:99"')
    m.sub('verknuepfung_fehlt', sp_link, 'LinkResourceURI="file:Links/', 'LinkResourceURI="file:Links/fehlt-')
    m.sub('farbe_fehlt', sp, r'FillColor="Color/[^"]+"', 'FillColor="Color/Gibt es nicht"', regex=True)
    m.sub('format_fehlt', story, 'AppliedParagraphStyle="ParagraphStyle/', 'AppliedParagraphStyle="ParagraphStyle/X')
    pname = re.search(r'<ParagraphStyle Self="ParagraphStyle/([^"$]+)"', m.text(st)).group(1)
    m.sub('doppelpunkt_im_self', st, f'Self="ParagraphStyle/{pname}"', f'Self="ParagraphStyle/{pname}:x"')
    m.sub('domversion', sp, 'DOMVersion="15.0"', 'DOMVersion="16.0"')
    m.sub('storylist', 'designmap.xml', r'StoryList="(\S+) ', 'StoryList="', regex=True)
    # Vokabular (früher nur mit --refs und nur als Warnung)
    m.sub('aufzaehlung_ungueltig', st, 'Justification="LeftAlign"', 'Justification="Links"')
    m.sub('attribut_tippfehler', sp, 'FillColor="', 'FillColour="')
    m.sub('element_unbekannt', story, '</Content>', '</Content><Umbruch/>')
    # Formatketten
    base = re.search(r'<ParagraphStyle Self="(ParagraphStyle/Basis [^"]+)"', m.text(st))
    child = re.search(r'<ParagraphStyle Self="(ParagraphStyle/[^"$]+)"[^>]*><Properties><BasedOn type="object">' + re.escape(base.group(1)), m.text(st))
    s = m.text(st)
    i = s.find(f'Self="{base.group(1)}"')
    j = s.find('<BasedOn', i)
    k = s.find('</BasedOn>', j) + len('</BasedOn>')
    files = dict(orig)
    files[st] = (s[:j] + f'<BasedOn type="object">{child.group(1)}</BasedOn>' + s[k:]).encode('utf-8')
    m.cases['formatkette_zyklus'] = (files, order, True)
    files = dict(orig)
    files[st] = (s[:j] + '<BasedOn type="object">CharacterStyle/$ID/[No character style]</BasedOn>' + s[k:]).encode('utf-8')
    m.cases['formatkette_falsche_art'] = (files, order, True)
    # Absatztrenner im Text
    m.sub('u2029_im_text', story, '</Content>', ' </Content>')
    m.sub('trennwert_ausserhalb', st, r'HyphenateWordsLongerThan="\d+"', 'HyphenateWordsLongerThan="1"', regex=True)
    # Silbentrennung (Runde 2): Trennbereich, Trennungen in Folge, Wörterbuchtrennung
    m.sub('trennbereich_36', st, 'HyphenationZone="0"', 'HyphenationZone="36"', count=0)
    m.sub('trennungen_in_folge_2', st, 'HyphenateLadderLimit="0"', 'HyphenateLadderLimit="2"', count=0)
    prot = next(n for n in stories if re.search('[ >]­[^\\W\\d_]{8,}', m.text(n)))
    m.sub('wort_ungeschuetzt', prot, '([ >])­([^\\W\\d_]{8,})', r'\1\2', regex=True)
    # Musterseiten (Runde 2): eine Seite ohne Standard-Fuß bekommt die Musterseite mit Fußzeile
    ms = {re.search(r'<MasterSpread Self="([^"]+)"', m.text(n)).group(1): ('<GraphicLine' in m.text(n) or '<TextFrame' in m.text(n))
          for n in order if n.startswith('MasterSpreads/')}
    with_items = next(k for k, v in ms.items() if v)
    without = [k for k, v in ms.items() if not v]
    target = next((n for n in spreads for w in without if f'AppliedMaster="{w}"' in m.text(n) and 'ShowMasterItems="true"' in m.text(n)), None)
    if target:
        w = next(w for w in without if f'AppliedMaster="{w}"' in m.text(target))
        m.sub('musterseite_auf_seite_ohne_fuss', target, f'AppliedMaster="{w}"', f'AppliedMaster="{with_items}"')
    # Zellbreite: erste Spalte der ersten Tabelle auf 30 %
    m.sub('spalte_zu_schmal', table, r'(<Column [^>]*SingleColumnWidth=")([\d.]+)"', lambda x: f'{x.group(1)}{float(x.group(2)) * 0.3:.4f}"', regex=True)
    # ZIP
    m.cases['mimetype_komprimiert'] = (dict(orig), order, False)
    m.cases['mimetype_nicht_zuerst'] = (dict(orig), [n for n in order if n != 'mimetype'] + ['mimetype'], True)
    return m.cases


def expectation(orig, order):
    """Erwartung aus dem unveränderten Paket: Seiten, die Musterobjekte zeigen (wie export-idml.cjs sie liefert)."""
    sys.path.insert(0, HERE)
    import validate as V   # noqa: E402
    rep = V.Report()
    trees = {n: V.parse_xml(d, n, rep) for n, d in orig.items() if n.endswith('.xml')}
    shown = []
    masters = {}
    for n in order:
        if n.startswith('MasterSpreads/'):
            msr = trees[n].find('MasterSpread')
            masters[msr.get('Self')] = V._items_with_bbox(msr)
    for n in order:
        if not n.startswith('Spreads/'):
            continue
        sp = trees[n].find('Spread')
        show = sp.get('ShowMasterItems', 'true') != 'false'
        for pg in sp.findall('Page'):
            left = V.nums(pg.get('ItemTransform'))[4] < -0.01
            items = [i for i in masters.get(pg.get('AppliedMaster'), []) if ((i[1][0] + i[1][2]) / 2 < 0) == left]
            if show and items and pg.get('Name').isdigit():
                shown.append(int(pg.get('Name')))
    return {'footPages': shown, 'masterPages': shown}


def run_one(key, path, expect_file, py, node):
    v = subprocess.run([py, '-I', os.path.join(HERE, 'validate.py'), path, '--no-ink', '--no-simpleidml', '--expect', expect_file, '--max', '3'],
                       capture_output=True, text=True)
    c = subprocess.run([node, os.path.join(HERE, 'check.cjs'), path, '--no-xmllint', '--expect', expect_file], capture_output=True, text=True)
    vm = [ln.strip() for ln in v.stdout.splitlines() if ln.startswith('FEHLER')]
    cm = [ln.strip() for ln in c.stdout.splitlines() if ln.startswith('FEHLER')]
    return key, v.returncode, c.returncode, vm[:2], cm[:1]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('idml', nargs='?', default=os.path.join(HERE, '..', '..', 'dist', 'indesign', 'Mietwohnraumfoerderung-2026.idml'))
    ap.add_argument('--keep', help='Mutationen hier ablegen (sonst temporär)')
    ap.add_argument('--node', default='node')
    a = ap.parse_args()
    src = os.path.abspath(a.idml)
    src_dir = os.path.dirname(src)
    orig, order = load(src)
    work = a.keep or tempfile.mkdtemp(prefix='idml-selbsttest-')
    os.makedirs(work, exist_ok=True)
    exp = os.path.join(work, 'erwartung.json')
    with open(exp, 'w', encoding='utf-8') as f:
        json.dump(expectation(orig, order), f)
    cases = {'_original': (dict(orig), order, True)}
    cases.update(build(orig, order))
    jobs = {k: write(os.path.join(work, k), files, od, src_dir, store) for k, (files, od, store) in cases.items()}
    res = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as ex:
        for key, vr, cr, vm, cm in ex.map(lambda kv: run_one(kv[0], kv[1], exp, sys.executable, a.node), jobs.items()):
            res[key] = (vr, cr, vm, cm)
    bad = 0
    print(f'{"Mutation":34} validate.py  check.cjs   erste Meldung')
    for key in jobs:
        vr, cr, vm, cm = res[key]
        if key == '_original':
            ok = vr == 0 and cr == 0
            print(f'{"(unverändert)":34} {"sauber" if vr == 0 else "FEHLER":11}  {"sauber" if cr == 0 else "FEHLER":10}  {"" if ok else (vm + cm)[:1]}')
        else:
            ok = vr != 0
            msg = (vm or cm or ['–'])[0][:110]
            print(f'{key:34} {"erkannt" if vr else "ÜBERSEHEN":11}  {"erkannt" if cr else "–":10}  {msg}')
        bad += 0 if ok else 1
    print(f'Ergebnis: {len(jobs) - 1} Mutationen, {bad} Probleme')
    if not a.keep:
        shutil.rmtree(work, ignore_errors=True)
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
