#!/usr/bin/env python3
"""Desktop-Schriften für das IDML-Paket („Document Fonts/“) planen und erzeugen.

Aufruf (von scripts/export-idml.cjs): make-fonts.py IN.json OUT.json
  IN.json  = { "sources": { "<CSS-Familie>": { "normal": [Dateien…], "italic": [Dateien…] } },
               "requests": [ { "id", "family", "italic", "weight", "axes": {"opsz": …, "SOFT": …}, "chars" } ],
               "outDir": "…/Document Fonts" | null,  "minShare": 0.01 }
  OUT.json = { "faces": [ { "family", "style", "ps", "file", "axes", "cssFamily", "italic", "weightClass" } ],
               "map": { "<id>": <Index in faces> }, "warnings": [ … ] }

Regeln (generisch, siehe LIESMICH):
  * Familienname = CSS-Familie ohne „ Variable“. Hat die Schrift eine opsz-Achse, wird die optische Größe
    gebündelt (Werte mit wenig Text wandern zum nächsten Bündel); weicht ein Bündel vom Achsen-Standard ab,
    heißt die Familie „<Familie> <opsz>pt“ (wie die statischen Fraunces-Familien „Fraunces 144pt“).
  * Stilname = benannter Schnitt des gerundeten Gewichts (100 Thin … 900 Black; Gleichstand nach der
    CSS-Gewichtsauswahl), kursiv mit „ Italic“. Die Instanz liegt genau auf dem benannten Gewicht.
  * Übrige Achsen (SOFT, WONK, wdth …): je Schnitt der am häufigsten verwendete Wert.
  * Teilmengen (latin, latin-ext, Symbole) werden zu einer Desktop-Datei zusammengeführt.
"""
import json
import math
import os
import sys
from collections import defaultdict

from fontTools.ttLib import TTFont

WEIGHT_NAMES = {100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium',
                600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black'}


def base_family(css):
    for suf in (' Variable', ' VF', ' var'):
        if css.endswith(suf):
            return css[: -len(suf)]
    return css


def round_weight(w, lo=100, hi=900):
    """Nächster benannter Schnitt; Gleichstand wie CSS-Gewichtsauswahl (<400 abwärts, >500 aufwärts, sonst 500)."""
    cands = [v for v in WEIGHT_NAMES if lo - 50 <= v <= hi + 50] or list(WEIGHT_NAMES)
    best = min(cands, key=lambda v: (abs(v - w), 0 if (w < 400 and v < w) or (w > 500 and v > w) or (400 <= w <= 500 and v > w) else 1))
    return best


def style_name(weight, italic):
    n = WEIGHT_NAMES[weight]
    if italic:
        return 'Italic' if n == 'Regular' else n + ' Italic'
    return n


def fvar_axes(path):
    f = TTFont(path, lazy=True)
    if 'fvar' not in f:
        return {}
    return {a.axisTag: (a.minValue, a.defaultValue, a.maxValue) for a in f['fvar'].axes}


def covers_basic_latin(path):
    f = TTFont(path, lazy=True)
    cmap = f.getBestCmap() or {}
    return 0x41 in cmap and 0x61 in cmap


def plan(inp):
    warnings = []
    sources = inp['sources']
    requests = [r for r in inp['requests'] if r.get('chars', 0) > 0]
    min_share = inp.get('minShare', 0.01)
    axes_info = {}
    for fam, by_style in sources.items():
        for st, files in by_style.items():
            if files:
                main = sorted(files, key=lambda p: (not covers_basic_latin(p), files.index(p)))
                by_style[st] = main
                axes_info.setdefault(fam, fvar_axes(main[0]))
    # opsz-Bündel je CSS-Familie
    buckets = {}
    for fam in {r['family'] for r in requests}:
        ax = axes_info.get(fam, {})
        if 'opsz' not in ax:
            continue
        lo, dflt, hi = ax['opsz']
        use = defaultdict(int)
        for r in requests:
            if r['family'] != fam:
                continue
            v = r['axes'].get('opsz')
            v = dflt if v is None else min(hi, max(lo, v))
            use[round(v)] += r['chars']
        total = sum(use.values()) or 1
        keep = {v for v, n in use.items() if n >= max(30, min_share * total)} or {max(use, key=use.get)}

        def snap(v, keep=keep):
            return min(keep, key=lambda k: (abs(math.log(max(v, 0.1) / max(k, 0.1))), -k))
        buckets[fam] = (snap, dflt, lo, hi)

    faces, face_idx, mapping = [], {}, {}
    votes = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
    for r in requests:
        fam = r['family']
        ax = axes_info.get(fam, {})
        base = base_family(fam)
        family = base
        axes = {}
        if fam in buckets:
            snap, dflt, lo, hi = buckets[fam]
            v = r['axes'].get('opsz')
            v = dflt if v is None else min(hi, max(lo, v))
            b = snap(round(v))
            axes['opsz'] = b
            if abs(b - dflt) > 0.01:
                family = '%s %spt' % (base, ('%g' % b))
        wlo, whi = (ax['wght'][0], ax['wght'][2]) if 'wght' in ax else (100, 900)
        w = round_weight(r['weight'], wlo, whi)
        if 'wght' in ax:
            axes['wght'] = min(whi, max(wlo, w))
        italic = bool(r['italic'])
        if italic and not sources.get(fam, {}).get('italic'):
            warnings.append('Keine kursive Quelle für %s – aufrechte Instanz verwendet' % fam)
        style = style_name(w, italic)
        key = (family, style)
        if key not in face_idx:
            face_idx[key] = len(faces)
            faces.append({'family': family, 'style': style, 'cssFamily': fam, 'italic': italic, 'weightClass': w,
                          'ps': ('%s-%s' % (family.replace(' ', ''), style.replace(' ', ''))),
                          'axes': axes, 'file': None, 'chars': 0})
        fi = face_idx[key]
        faces[fi]['chars'] += r['chars']
        for tag, v in r['axes'].items():
            if tag not in ('opsz', 'wght') and tag in ax:
                votes[fi][tag][v] += r['chars']
        mapping[str(r['id'])] = fi
    for fi, f in enumerate(faces):
        ax = axes_info.get(f['cssFamily'], {})
        for tag, (lo, dflt, hi) in ax.items():
            if tag in f['axes']:
                continue
            if tag in votes[fi]:
                f['axes'][tag] = max(votes[fi][tag].items(), key=lambda kv: kv[1])[0]
            elif tag == 'ital':
                f['axes'][tag] = 1 if f['italic'] else 0
    return faces, mapping, warnings, sources


def ranges(cps):
    """[1,2,3,7] → [[1,3],[7,7]]"""
    out = []
    for c in cps:
        if out and c == out[-1][1] + 1:
            out[-1][1] = c
        else:
            out.append([c, c])
    return out


def set_names(font, family, style, ps, weight, italic):
    name = font['name']
    ribbi = style in ('Regular', 'Italic', 'Bold', 'Bold Italic')
    for nid in (1, 2, 3, 4, 6, 16, 17, 21, 22, 25):
        name.removeNames(nameID=nid)
    if ribbi:
        legacy_fam, legacy_sub = family, style
    else:
        legacy_fam = ('%s %s' % (family, style.replace(' Italic', '').replace('Italic', ''))).strip()
        legacy_sub = 'Italic' if italic else 'Regular'
    full = '%s %s' % (family, style)
    for plat in ((3, 1, 0x409), (1, 0, 0)):
        name.setName(legacy_fam, 1, *plat)
        name.setName(legacy_sub, 2, *plat)
        name.setName('%s;IDML-Export' % ps, 3, *plat)
        name.setName(full, 4, *plat)
        name.setName(ps, 6, *plat)
        name.setName(family, 16, *plat)
        name.setName(style, 17, *plat)
    os2 = font['OS/2']
    os2.usWeightClass = weight
    sel = os2.fsSelection & ~((1 << 0) | (1 << 5) | (1 << 6))   # ITALIC, BOLD, REGULAR neu setzen
    if italic:
        sel |= 1 << 0
    if style in ('Bold', 'Bold Italic'):
        sel |= 1 << 5
    if style == 'Regular':
        sel |= 1 << 6
    os2.fsSelection = sel
    font['head'].macStyle = (1 if style in ('Bold', 'Bold Italic') else 0) | (2 if italic else 0)
    if 'CFF ' in font:
        font['CFF '].cff.fontNames = [ps]


def build_face(face, sources, out_dir):
    from fontTools.varLib.instancer import instantiateVariableFont
    from fontTools.merge import Merger
    files = sources.get(face['cssFamily'], {}).get('italic' if face['italic'] else 'normal') \
        or sources.get(face['cssFamily'], {}).get('normal') or []
    if not files:
        return None, 'keine Quelldatei für %s' % face['cssFamily']
    tmp = []
    upem = None
    for i, path in enumerate(files):
        f = TTFont(path)
        if 'fvar' in f:
            limits = {}
            for a in f['fvar'].axes:
                v = face['axes'].get(a.axisTag, a.defaultValue)
                limits[a.axisTag] = max(a.minValue, min(a.maxValue, v))
            f = instantiateVariableFont(f, limits, inplace=False, updateFontNames=False)
        for t in ('STAT', 'MVAR', 'HVAR', 'VVAR', 'avar', 'cvar', 'DSIG'):
            if t in f:
                del f[t]
        if upem is None:
            upem = f['head'].unitsPerEm
        elif f['head'].unitsPerEm != upem:
            from fontTools.ttLib.scaleUpem import scale_upem
            scale_upem(f, upem)
        f.flavor = None
        p = os.path.join(out_dir, '.tmp-%s-%d.ttf' % (face['ps'], i))
        f.save(p)
        tmp.append(p)
    try:
        if len(tmp) > 1:
            merged = Merger().merge(tmp)
        else:
            merged = TTFont(tmp[0])
    except Exception as e:  # noqa: BLE001 – Zusammenführen gescheitert: nur Hauptteilmenge verwenden
        merged = TTFont(tmp[0])
        err = 'Teilmengen von %s nicht zusammengeführt (%s) – nur %s' % (face['ps'], e, os.path.basename(files[0]))
    else:
        err = None
    set_names(merged, face['family'], face['style'], face['ps'], face['weightClass'], face['italic'])
    # reproduzierbar: Zeitstempel der Quellschrift übernehmen (sonst „geänderte“ Schrift bei jeder Nachlieferung)
    src_head = TTFont(files[0], lazy=True)['head']
    merged['head'].created = src_head.created
    merged['head'].modified = src_head.modified
    merged.recalcTimestamp = False
    out = os.path.join(out_dir, face['ps'] + '.ttf')
    merged.save(out)
    for p in tmp:
        os.remove(p)
    return out, err


def main():
    inp = json.load(open(sys.argv[1], encoding='utf8'))
    faces, mapping, warnings, sources = plan(inp)
    out_dir = inp.get('outDir')
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
        for f in faces:
            path, err = build_face(f, sources, out_dir)
            if err:
                warnings.append(err)
            if path:
                f['file'] = os.path.basename(path)
                g = TTFont(path, lazy=True)
                f['glyphs'] = len(g.getGlyphOrder())
                f['fontType'] = 'OpenTypeCFF' if 'CFF ' in g else 'TrueType'
                f['version'] = g['name'].getDebugName(5) or ''
                # Glyphenabdeckung (für die Prüfung je Textlauf) und Breite des Leerzeichens (em)
                cmap = g.getBestCmap() or {}
                f['cmap'] = ranges(sorted(cmap))
                upem = g['head'].unitsPerEm
                sp = cmap.get(0xA0) or cmap.get(0x20)
                f['spaceEm'] = round(g['hmtx'][sp][0] / upem, 4) if sp else 0.25
    json.dump({'faces': faces, 'map': mapping, 'warnings': warnings}, open(sys.argv[2], 'w', encoding='utf8'),
              ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
