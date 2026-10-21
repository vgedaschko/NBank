#!/usr/bin/env python3
"""PGN-Bildaufbereitung: Duplex-Fotos und Vektor-Punktraster aus den Website-Bildern (src/assets/pgn/ref/*.jpg).

Die Website-Bilder sind höchstens 1800 × 740 px groß (MANIFEST.md). Deshalb gilt im Satz:
  - Fotos nur als Duplex (Tinte → Papier) bis 120 mm Breite (≥ 380 ppi) bzw. als Banner bis 180 mm (≥ 254 ppi),
  - großformatig nur als Vektor-Punktraster (sig-raster-*.svg): Punkte in PGN-Rot, Größe nach Helligkeit –
    druckt ohne Moiré, weil die Punkte Vektoren sind und keine vorgerasterten Pixel.

Ausgabe (src/assets/pgn/img/):
  <name>-duplex.jpg        Graustufen-Duplex #202020 → #F4F3F2 (warm), leicht angehobener Kontrast
  <name>-duplex-rot.jpg    Dreiton #2A0910 → #B71E3F → #F7ECEE (für Kapitelauftakte, sparsam)
  sig-raster-<name>.svg    Vektor-Punktraster (currentColor), viewBox in mm

Nutzung (aus broschuere/): python3 scripts/pgn-images.py      (benötigt Pillow)
"""
import os
from PIL import Image, ImageOps, ImageEnhance, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src', 'assets', 'pgn', 'ref')
OUT = os.path.join(ROOT, 'src', 'assets', 'pgn', 'img')

# Datei, Kurzname, Ausschnitt (links, oben, rechts, unten in px) für das Punktraster (None = kein Raster)
IMAGES = [
    ('ref-01-brauerstrasse-rotenburg.jpg', 'brauerstrasse', (300, 110, 1760, 660)),
    ('ref-07-porstweg-rotenburg.jpg', 'porstweg', None),
    ('ref-04-dehnenweg-hohenhameln.jpg', 'dehnenweg', None),
    ('ref-03-burgsiedlung-stade.jpg', 'burgsiedlung', None),
    ('ref-02-bahnhofstrasse-neu-wulmstorf.jpg', 'bahnhofstrasse', None),
]


def hexrgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def ramp(stops):
    """Lookup-Tabelle 0..255 aus Farbstopps [(pos 0..1, '#hex'), …]"""
    lut = []
    for v in range(256):
        x = v / 255
        for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
            if p0 <= x <= p1:
                t = (x - p0) / (p1 - p0) if p1 > p0 else 0
                a, b = hexrgb(c0), hexrgb(c1)
                lut.append(tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3)))
                break
    return lut


def toned(gray, stops):
    lut = ramp(stops)
    r = gray.point([c[0] for c in lut]); g = gray.point([c[1] for c in lut]); b = gray.point([c[2] for c in lut])
    return Image.merge('RGB', (r, g, b))


def gray_of(img):
    g = ImageOps.grayscale(img)
    g = ImageOps.autocontrast(g, cutoff=(0.6, 0.4))
    return ImageEnhance.Contrast(g).enhance(1.08)


def raster_svg(gray, crop, out_path, width_mm=180.0, pitch_mm=0.9):
    """Vektor-Punktraster: ein Punkt je Rasterzelle, Durchmesser ~ Dunkelheit (Fläche linear), 45°-Raster versetzt.
    Radien in 8 Stufen, je Stufe ein Pfad aus Null-Strecken mit runden Enden (kompakt, druckt als Vektor)."""
    img = gray.crop(crop)
    w_px, h_px = img.size
    height_mm = width_mm * h_px / w_px
    cols = int(width_mm / pitch_mm)
    rows = int(height_mm / (pitch_mm * 0.866))
    small = img.resize((cols, rows), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    px = small.load()
    levels = 8
    paths = {k: [] for k in range(1, levels + 1)}
    for j in range(rows):
        y = (j + 0.5) * pitch_mm * 0.866
        off = (pitch_mm / 2) if j % 2 else 0
        for i in range(cols):
            x = (i + 0.5) * pitch_mm + off
            if x > width_mm:
                continue
            dark = 1 - px[i, j] / 255
            dark = max(0.0, (dark - 0.14) / 0.86) ** 1.25          # Himmel/Lichter bleiben frei, Mitteltöne offen
            k = round(dark * levels)
            if k >= 1:
                paths[k].append(f'M{x:.2f} {y:.2f}h0')
    dmax = pitch_mm * 0.96                                   # größter Punkt berührt die Nachbarn knapp
    body = []
    for k in range(1, levels + 1):
        if not paths[k]:
            continue
        d = dmax * (k / levels) ** 0.5                       # Fläche ~ Tonwert
        body.append(f'<path stroke-width="{d:.3f}" d="{"".join(paths[k])}"/>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width_mm:.1f} {height_mm:.1f}" '
           f'width="{width_mm:.1f}mm" height="{height_mm:.1f}mm" class="sig-raster" aria-hidden="true">'
           f'<g fill="none" stroke="currentColor" stroke-linecap="round">{"".join(body)}</g></svg>\n')
    open(out_path, 'w', encoding='utf8').write(svg)
    return os.path.getsize(out_path), cols * rows


def main():
    os.makedirs(OUT, exist_ok=True)
    for fn, name, crop in IMAGES:
        img = Image.open(os.path.join(SRC, fn)).convert('RGB')
        g = gray_of(img)
        toned(g, [(0, '#202020'), (0.55, '#8C8884'), (1, '#F4F3F2')]).save(
            os.path.join(OUT, f'{name}-duplex.jpg'), quality=90, subsampling=0, optimize=True)
        toned(g, [(0, '#2A0910'), (0.5, '#9E1F3A'), (0.78, '#D98A9B'), (1, '#F7ECEE')]).save(
            os.path.join(OUT, f'{name}-duplex-rot.jpg'), quality=90, subsampling=0, optimize=True)
        msg = ''
        if crop:
            size, n = raster_svg(g, crop, os.path.join(ROOT, 'src', 'assets', 'pgn', f'sig-raster-{name}.svg'))
            msg = f', Raster {n} Zellen, {size // 1024} KB'
        print(f'{name}: Duplex + Duplex rot{msg}')


if __name__ == '__main__':
    main()
