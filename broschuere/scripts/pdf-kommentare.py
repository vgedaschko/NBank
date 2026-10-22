#!/usr/bin/env python3
"""Liest Kommentare (Annotationen) aus einem kommentierten Korrektur-PDF der Broschüre.

Für jeden Kommentar: Seite, Typ (Notiz, Markierung, Durchstreichung, Ersetzen, Einfügen, Textfeld, Freihand …),
Autor, Datum, Kommentartext, Antworten, Position in mm (von links oben) und – wo möglich – der markierte bzw.
umgebende Text. Dazu je Kommentar ein Bildausschnitt mit roter Markierung, damit klar ist, worauf er sich bezieht.

Nutzung (aus broschuere/):
  python3 scripts/pdf-kommentare.py KORREKTUR.pdf [--out dist/korrektur] [--dpi 110]

Ergebnis in --out: kommentare.md (lesbarer Bericht, gruppiert nach Seite, mit Verweis auf content/pages/NN-*.json),
kommentare.json (maschinenlesbar) und ausschnitt-SS-NN.png je Kommentar.
Voraussetzung: pip install pymupdf
"""
import argparse, glob, json, os, sys

import pymupdf

PT_TO_MM = 25.4 / 72

TYPEN = {
    'Text': 'Notiz', 'Highlight': 'Markierung', 'Underline': 'Unterstreichung', 'StrikeOut': 'Durchstreichung',
    'Squiggly': 'Wellenlinie', 'Caret': 'Einfügen', 'FreeText': 'Textfeld', 'Ink': 'Freihand', 'Square': 'Rechteck',
    'Circle': 'Kreis', 'Line': 'Linie', 'Polygon': 'Polygon', 'PolyLine': 'Linienzug', 'Stamp': 'Stempel',
    'FileAttachment': 'Dateianhang',
}
MARKUP = {'Highlight', 'Underline', 'StrikeOut', 'Squiggly'}


def mm(r):
    return {'x': round(r.x0 * PT_TO_MM, 1), 'y': round(r.y0 * PT_TO_MM, 1),
            'b': round(r.width * PT_TO_MM, 1), 'h': round(r.height * PT_TO_MM, 1)}


def clean(t):
    return ' '.join((t or '').replace('­', '').split())


def markierter_text(page, annot):
    """Text unter Markierungen: je Quad-Viereck die Wörter, die mindestens zur Hälfte darin liegen."""
    verts = annot.vertices or []
    quads = [pymupdf.Quad(verts[i:i + 4]).rect for i in range(0, len(verts), 4)] or [annot.rect]
    words = page.get_text('words')
    out = []
    for q in quads:
        q = pymupdf.Rect(q.x0 - 1, q.y0 - 2, q.x1 + 1, q.y1 + 2)
        hit = []
        for w in words:
            wr = pymupdf.Rect(w[:4])
            if wr.is_empty:
                continue
            if (wr & q).get_area() >= 0.5 * wr.get_area():
                hit.append(w)
        out.append(' '.join(w[4] for w in sorted(hit, key=lambda w: (round(w[1]), w[0]))))
    text = clean(' '.join(out))
    return text or clean(page.get_textbox(annot.rect))


def zeilen_kontext(page, annot):
    """Die vollständigen Textzeilen, in denen eine Markierung liegt – Kontext, um die Stelle im Text wiederzufinden."""
    verts = annot.vertices or []
    quads = [pymupdf.Quad(verts[i:i + 4]).rect for i in range(0, len(verts), 4)] or [annot.rect]
    treffer = []
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            lr = pymupdf.Rect(line['bbox'])
            mitte_y = (lr.y0 + lr.y1) / 2
            if any(q.y0 - 2 <= mitte_y <= q.y1 + 2 and lr.x0 < q.x1 and lr.x1 > q.x0 for q in quads):
                t = clean(''.join(span['text'] for span in line['spans']))
                if t and t not in treffer:
                    treffer.append(t)
    return ' / '.join(treffer)


def umgebung(page, rect, eigener_text=''):
    """Text rund um einen Punkt- oder Flächenkommentar: der Absatz (Textblock), der den Kommentar berührt,
    sonst der nächstgelegene Block. Eigener Kommentartext (z. B. bei Textfeldern) wird herausgenommen."""
    blocks = [b for b in page.get_text('blocks') if b[6] == 0 and clean(b[4])]
    if not blocks:
        return ''
    mitte = pymupdf.Point((rect.x0 + rect.x1) / 2, (rect.y0 + rect.y1) / 2)

    def abstand(b):
        r = pymupdf.Rect(b[:4])
        if r.intersects(rect):
            return 0
        dx = max(r.x0 - mitte.x, 0, mitte.x - r.x1)
        dy = max(r.y0 - mitte.y, 0, mitte.y - r.y1)
        return (dx * dx + dy * dy) ** 0.5

    b = min(blocks, key=abstand)
    text = clean(b[4])
    if eigener_text:
        text = clean(text.replace(clean(eigener_text), ''))
    return text


def json_datei(root, seite):
    treffer = glob.glob(os.path.join(root, 'content', 'pages', f'{seite:02d}-*.json'))
    return os.path.relpath(treffer[0], root) if treffer else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf')
    ap.add_argument('--out', default='dist/korrektur')
    ap.add_argument('--dpi', type=int, default=110)
    a = ap.parse_args()
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.makedirs(a.out, exist_ok=True)
    doc = pymupdf.open(a.pdf)

    alle, nach_xref = [], {}
    for page in doc:
        for annot in page.annots() or []:
            typ = annot.type[1]
            if typ in ('Popup', 'Link', 'Widget'):
                continue
            info = annot.info
            e = {
                'seite': page.number + 1, 'typ': TYPEN.get(typ, typ), 'pdf_typ': typ,
                'autor': info.get('title') or '', 'datum': info.get('modDate') or info.get('creationDate') or '',
                'kommentar': clean(info.get('content')), 'position_mm': mm(annot.rect),
                'xref': annot.xref, 'antwort_auf': None, 'antworten': [],
            }
            irt = annot.irt_xref if hasattr(annot, 'irt_xref') else 0
            if irt:
                e['antwort_auf'] = irt
            if typ in MARKUP:
                e['text'] = markierter_text(page, annot)
                e["zeile"] = zeilen_kontext(page, annot)
            else:
                e['text_in_der_naehe'] = umgebung(page, annot.rect, info.get('content') if typ == 'FreeText' else '')
            alle.append(e)
            nach_xref[annot.xref] = e

    # Antworten und „Text ersetzen“ (Acrobat: Durchstreichung + Einfügen, über IRT verbunden) zusammenführen
    haupt = []
    for e in alle:
        ziel = nach_xref.get(e['antwort_auf'])
        if ziel is not None and ziel is not e:
            if {e['pdf_typ'], ziel['pdf_typ']} == {'StrikeOut', 'Caret'}:
                ziel['typ'] = 'Ersetzen'
                ziel['ersetzen_durch'] = e['kommentar'] or ziel.get('kommentar')
            else:
                ziel['antworten'].append({'autor': e['autor'], 'kommentar': e['kommentar']})
        else:
            haupt.append(e)

    # Bildausschnitte mit Markierung
    for i, e in enumerate(haupt, 1):
        page = doc[e['seite'] - 1]
        p = e['position_mm']
        r = pymupdf.Rect(p['x'] / PT_TO_MM, p['y'] / PT_TO_MM, (p['x'] + p['b']) / PT_TO_MM, (p['y'] + p['h']) / PT_TO_MM)
        clip = pymupdf.Rect(r.x0 - 70, r.y0 - 45, r.x1 + 70, r.y1 + 45) & page.rect
        pix = page.get_pixmap(dpi=a.dpi, clip=clip, annots=True)
        name = f"ausschnitt-S{e['seite']:02d}-{i:02d}.png"
        pix.save(os.path.join(a.out, name))
        e['bild'] = name
        e['json'] = json_datei(root, e['seite'])
        del e['xref']; del e['antwort_auf']

    with open(os.path.join(a.out, 'kommentare.json'), 'w', encoding='utf-8') as f:
        json.dump(haupt, f, ensure_ascii=False, indent=1)

    zeilen = [f'# Korrekturkommentare aus {os.path.basename(a.pdf)}', '', f'{len(haupt)} Kommentare auf '
              f'{len({e["seite"] for e in haupt})} Seiten. Position in mm von links oben.', '']
    for seite in sorted({e['seite'] for e in haupt}):
        es = [e for e in haupt if e['seite'] == seite]
        zeilen += [f'## Seite {seite}' + (f' – `{es[0]["json"]}`' if es[0].get('json') else ''), '']
        for e in es:
            p = e['position_mm']
            kopf = f'- **{e["typ"]}** bei x {p["x"]} / y {p["y"]} mm'
            if e['autor']:
                kopf += f' ({e["autor"]})'
            zeilen.append(kopf)
            if e.get('text'):
                zeilen.append(f'  - Betrifft: „{e["text"]}“')
            if e.get('zeile'):
                zeilen.append(f'  - In der Zeile: „{e["zeile"]}“')
            if e.get('ersetzen_durch'):
                zeilen.append(f'  - Ersetzen durch: „{e["ersetzen_durch"]}“')
            if e['kommentar'] and not e.get('ersetzen_durch'):
                zeilen.append(f'  - Kommentar: {e["kommentar"]}')
            if e.get('text_in_der_naehe'):
                zeilen.append(f'  - Text in der Nähe: „{e["text_in_der_naehe"][:220]}“')
            for an in e['antworten']:
                zeilen.append(f'  - Antwort {an["autor"]}: {an["kommentar"]}')
            zeilen.append(f'  - Ausschnitt: `{e["bild"]}`')
        zeilen.append('')
    with open(os.path.join(a.out, 'kommentare.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(zeilen) + '\n')
    print(f'{len(haupt)} Kommentare → {os.path.join(a.out, "kommentare.md")}')


if __name__ == '__main__':
    sys.exit(main())
