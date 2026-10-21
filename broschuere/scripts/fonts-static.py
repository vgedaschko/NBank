#!/usr/bin/env python3
"""Erzeugt statische Instanzen der variablen Schriften (Fraunces, Inter) für das PDF.

Hintergrund: Chromium/Skia bettet variable Fonts (woff2-variations) immer als Type 3 ein – ohne Hinting, mit
„Bad bounding box“-Meldungen in Poppler und im Druckerei-Preflight oft abgelehnt. Statische Instanzen werden als
CID-TrueType (Identity-H) eingebettet.

Ablauf:
  1. scripts/render.cjs ermittelt alle im Satz verwendeten Kombinationen (Familie, Stil, wght, opsz, SOFT, WONK)
     und schreibt fehlende nach src/fonts/static/needed.json.
  2. Dieses Skript instanziiert jede Kombination aus den Fontsource-Dateien in src/fonts/files/ (latin, latin-ext,
     Pfeil-/Symbol-Teilmenge) und schreibt src/fonts/static/*.woff2 sowie instances.json (Zuordnung + @font-face-CSS).
  Jede Datei bekommt eigene Namen (nameID 1/4/6, z. B. PostScript „Inter-in-w650-o14-latin“, „Inter-arrows-w400-o14“),
  damit im PDF jeder BaseFont-Name genau einem Fontprogramm entspricht. Vorhandene Dateien werden übersprungen –
  nach Änderungen an der Namensgebung src/fonts/static/*.woff2 löschen und das Skript neu laufen lassen.
  3. render.cjs ordnet beim nächsten Lauf jeder Textstelle ihre Instanz zu (Familie „FI …“, feste Gewichte, ohne
     font-variation-settings). Der Satz bleibt identisch; render.cjs meldet die Layout-Abweichung.

Voraussetzung: pip install fonttools brotli
Nutzung (aus broschuere/): python3 scripts/fonts-static.py
"""
import json, os, re, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = os.path.join(ROOT, 'src', 'fonts', 'files')
OUT = os.path.join(ROOT, 'src', 'fonts', 'static')
FONTS_CSS = os.path.join(ROOT, 'src', 'fonts', 'fonts.css')

SOURCES = {
    ('Fraunces', 'normal'): ['fraunces-latin-full-normal.woff2', 'fraunces-latin-ext-full-normal.woff2'],
    ('Fraunces', 'italic'): ['fraunces-latin-full-italic.woff2', 'fraunces-latin-ext-full-italic.woff2'],
    ('Inter', 'normal'): ['inter-latin-opsz-normal.woff2', 'inter-latin-ext-opsz-normal.woff2'],
    ('Inter', 'italic'): ['inter-latin-opsz-italic.woff2', 'inter-latin-ext-opsz-italic.woff2'],
}
ARROWS = 'inter-arrows-symbols-wght-normal.woff2'   # Pfeile/Symbole für Inter und Fraunces (aufrecht und kursiv)


def unicode_ranges():
    css = open(FONTS_CSS, encoding='utf8').read()
    ranges = {}
    for block in re.findall(r'@font-face\s*{([^}]*)}', css):
        src = re.search(r'files/([\w.-]+\.woff2)', block)
        ur = re.search(r'unicode-range:\s*([^;]+);', block)
        if src and ur:
            ranges[src.group(1)] = ur.group(1).strip()
    return ranges


def fmt(v):
    return ('%g' % v).replace('.', '_')


def set_names(font, family, style, ps):
    """Eindeutige Namen je Instanz und Unicode-Teilmenge. Ohne das hießen alle Inter-Schnitte „Inter-Regular“ und alle
    Fraunces-Schnitte „Fraunces-9ptBlack“ (Standardinstanz der Variable-Font): Im PDF stünden dann verschiedene
    Fontprogramme unter demselben BaseFont-Namen – Preflight („gleicher Fontname, unterschiedlicher Inhalt“) schlägt an,
    RIPs mit Namens-Cache können Schnitte vertauschen. PostScript-Name (nameID 6) = BaseFont im PDF."""
    sub = 'Italic' if style == 'italic' else 'Regular'
    name = font['name']
    for nid in (1, 2, 3, 4, 6, 16, 17, 21, 22, 25):
        name.removeNames(nameID=nid)
    name.setName(family, 1, 3, 1, 0x409)
    name.setName(sub, 2, 3, 1, 0x409)
    name.setName(f'{ps};static', 3, 3, 1, 0x409)
    name.setName(family if sub == 'Regular' else f'{family} {sub}', 4, 3, 1, 0x409)
    name.setName(ps, 6, 3, 1, 0x409)
    if 'CFF ' in font:                                   # (Inter/Fraunces sind glyf-Fonts; nur zur Sicherheit)
        font['CFF '].cff.fontNames = [ps]


def instance(src_name, axes, out_name, family, style, ps):
    out_path = os.path.join(OUT, out_name)
    if os.path.exists(out_path):
        return
    font = TTFont(os.path.join(FILES, src_name))
    limits = {}
    for a in font['fvar'].axes:
        v = axes.get(a.axisTag, a.defaultValue)
        limits[a.axisTag] = max(a.minValue, min(a.maxValue, v))
    static = instantiateVariableFont(font, limits, inplace=False, updateFontNames=False)
    set_names(static, family, style, ps)
    static.flavor = 'woff2'
    static.save(out_path)


def main():
    needed_file = os.path.join(OUT, 'needed.json')
    inst_file = os.path.join(OUT, 'instances.json')
    needed = json.load(open(needed_file, encoding='utf8')) if os.path.exists(needed_file) else []
    old = json.load(open(inst_file, encoding='utf8')) if os.path.exists(inst_file) else {'faces': []}
    tuples = {f['key']: f for f in old.get('tuples', [])}
    tuples.update({t['key']: t for t in needed})
    if not tuples:
        sys.exit('Keine Schrift-Kombinationen gefunden – zuerst scripts/render.cjs ausführen (schreibt needed.json).')
    ur = unicode_ranges()
    os.makedirs(OUT, exist_ok=True)
    faces, css = [], ['/* Statische Instanzen (scripts/fonts-static.py) – von render.cjs fürs PDF zugeordnet. SIL OFL 1.1 */']
    for key in sorted(tuples):
        t = tuples[key]
        fam, style, wght, opsz = t['fam'], t['style'], t['wght'], t['opsz']
        axes = {'wght': wght, 'opsz': opsz}
        tag = f"{fam[0].lower()}{'i' if style == 'italic' else 'n'}-w{wght}-o{fmt(opsz)}"
        if fam == 'Fraunces':
            axes.update({'SOFT': t.get('SOFT', 0), 'WONK': t.get('WONK', 1)})
            tag += f"-s{fmt(axes['SOFT'])}-k{fmt(axes['WONK'])}"
        family = f'FI {tag}'
        srcs = [(n, ur[n]) for n in SOURCES[(fam, style)]] + [(ARROWS, ur[ARROWS])]
        for src_name, rng in srcs:
            subset = 'arrows' if src_name == ARROWS else ('latin-ext' if 'latin-ext' in src_name else 'latin')
            # Pfeil-Teilmenge ist Inter (opsz 14–32): Chromium wendet dort dieselben Achswerte an (opsz geklemmt)
            src_axes = {'wght': wght, 'opsz': max(14, min(32, opsz))} if src_name == ARROWS else axes
            if src_name == ARROWS:
                # Pfeil-Teilmenge: eine Datei je wght/opsz, von Inter und Fraunces gemeinsam genutzt (immer aufrecht)
                atag = f"w{wght}-o{fmt(src_axes['opsz'])}"
                out_name = f"arrows-{atag}.woff2"
                ps, fam_name, fstyle = f"Inter-arrows-{atag}", f"Inter arrows {atag}", 'normal'
            else:
                out_name = f"{tag}-{subset}.woff2"
                ps, fam_name, fstyle = f"{fam}-{tag}-{subset}", f"{fam} {tag} {subset}", style
            ps = ps.replace('_', 'p')                  # opsz 10.5 → „o10_5“ → „o10p5“ (PostScript-Namen: nur [A-Za-z0-9-])
            instance(src_name, src_axes, out_name, fam_name.replace('_', 'p'), fstyle, ps)
            css.append(f"@font-face{{font-family:'{family}';font-style:{style};font-weight:{wght};font-display:block;"
                       f"src:url(./{out_name}) format('woff2');unicode-range:{rng};}}")
        faces.append({'key': key, 'family': family})
        print(f'{key:40s} -> {family}')
    json.dump({'faces': faces, 'tuples': sorted(tuples.values(), key=lambda t: t['key']), 'css': '\n'.join(css)},
              open(inst_file, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    if os.path.exists(needed_file):
        os.remove(needed_file)
    print(f'{len(faces)} Instanzen, {len([f for f in os.listdir(OUT) if f.endswith(".woff2")])} Dateien in {OUT}')


if __name__ == '__main__':
    main()
