#!/usr/bin/env python3
"""Skizzen der übrigen Folien von Kapitel 3, des Anhangs Modellrechnung und der Broschüre Blatt 9 bis 11 (Team 2).

Jede Skizze zeigt Raster, Kopf, Titel, Platz der Elemente und die echten Zahlen. Zahlen kommen nur aus folien/werte.json
(Kopie von konzepte/mappe/werte_konzepte.json und konzepte/team-2/mappe/werte_team.json, siehe werte_zusammen.py); gerechnete
Größen (Summe, Differenz) stehen mit Formel im Code. Jede gelesene Zahl landet mit Blatt und Zelle in skizzen/belege_skizzen.json.

Aufruf: python skizzen_bauen.py   (braucht Pillow; Schriften Montserrat und Work Sans aus ~/.fonts/pgn)
Ausgabe: skizzen/folie-NN-<id>.png, broschuere/blatt-NN.png, skizzen/belege_skizzen.json
"""
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HIER = Path(__file__).resolve().parent
WERTE = json.loads((HIER / 'folien' / 'werte.json').read_text(encoding='utf-8'))
AUS_F = HIER / 'skizzen'
AUS_B = HIER / 'broschuere'
AUS_F.mkdir(exist_ok=True)
AUS_B.mkdir(exist_ok=True)
FONTS = Path.home() / '.fonts' / 'pgn'
if not FONTS.exists():
    FONTS = Path('/root/.fonts/pgn')

# ---------------------------------------------------------------------------------------------------------------------------------
# Zahlen
BELEGE = {}
_aktuell = ['']


def W(schluessel):
    """Wert aus folien/werte.json, Schreibweise „lauf:schluessel“ (ohne Lauf: Lauf „konzepte“)."""
    lauf, _, k = schluessel.partition(':') if ':' in schluessel else ('konzepte', '', schluessel)
    e = WERTE['laeufe'][lauf]['werte'][k]
    BELEGE.setdefault(_aktuell[0], {})[schluessel] = {'blatt': e.get('blatt'), 'zelle': e.get('zelle'), 'datei': e.get('datei', '')}
    return e['wert']


V = ['A', 'B', 'C', 'frei_dscr']
VN = {'A': 'A', 'B': 'B', 'C': 'C', 'frei_dscr': 'frei finanziert'}


def de(x, nk=0):
    if isinstance(x, str):          # Texte der Mappe („n. v.“, „–“) unverändert
        return x
    s = f'{abs(x):,.{nk}f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
    return ('−' if x < 0 and round(abs(x), nk) != 0 else '') + s


def eur(x, nk=0):
    return de(x, nk) + '\u00a0€'


def pz(a, nk=2):
    return a if isinstance(a, str) else de(a * 100, nk) + '\u00a0%'


def mio(x, nk=2):
    return x if isinstance(x, str) else de(x / 1e6, nk) + '\u00a0Mio.\u00a0€'


# ---------------------------------------------------------------------------------------------------------------------------------
# Zeichnen: Folie 13,333 × 7,5 Zoll bei 120 px je Zoll
TINTE, ANTH, PAPIER, ROT, REF, G300, FL3, LINIE, GRAU, WEISS = (
    '#202020', '#3C3C3B', '#F4F3F2', '#B71E3F', '#77716B', '#B4B0AB', '#E9E7E4', '#CFCCC8', '#626160', '#FFFFFF')
RASTER = '#D9C9CD'


def font(name, pt, s):
    return ImageFont.truetype(str(FONTS / name), max(6, int(round(pt / 72 * s))))


class Blatt:
    def __init__(self, breite, hoehe, s, grund, u=1.0):
        self.s, self.u = s, u          # s: px je Einheit; u: Einheiten je Zoll (Folie 1, Broschüre in mm 25,4)
        self.im = Image.new('RGB', (int(breite * s), int(hoehe * s)), grund)
        self.d = ImageDraw.Draw(self.im)
        self.grund = grund

    def p(self, x):
        return int(round(x * self.s))

    def F(self, art, pt):
        return font({'titel': 'Montserrat-Bold.ttf', 'titelk': 'Montserrat-BoldItalic.ttf', 'bold': 'Montserrat-Bold.ttf', 'xbold': 'Montserrat-ExtraBold.ttf',
                     'black': 'Montserrat-Black.ttf', 'text': 'WorkSans-Regular.ttf', 'semi': 'WorkSans-SemiBold.ttf', 'light': 'WorkSans-Light.ttf',
                     'mlight': 'Montserrat-Light.ttf'}[art], pt, self.s * self.u)

    def rect(self, x, y, w, h, fill=None, outline=None, width=1):
        self.d.rectangle([self.p(x), self.p(y), self.p(x + w), self.p(y + h)], fill=fill, outline=outline, width=width)

    def line(self, x0, y0, x1, y1, color=TINTE, width=1.0, dash=None):
        wpx = max(1, int(round(width / 72 * self.u * self.s)))
        if not dash:
            self.d.line([self.p(x0), self.p(y0), self.p(x1), self.p(y1)], fill=color, width=wpx)
            return
        L = math.hypot(x1 - x0, y1 - y0)
        if L == 0:
            return
        an, aus = dash
        t = 0.0
        while t < L:
            e = min(L, t + an)
            self.d.line([self.p(x0 + (x1 - x0) * t / L), self.p(y0 + (y1 - y0) * t / L), self.p(x0 + (x1 - x0) * e / L), self.p(y0 + (y1 - y0) * e / L)], fill=color, width=wpx)
            t = e + aus

    def poly(self, pts, color, width, dash=None):
        for (a, b), (c, d_) in zip(pts, pts[1:]):
            self.line(a, b, c, d_, color, width, dash)

    def text(self, x, y, t, art='text', pt=14, color=ANTH, anchor='la', w=None):
        f = self.F(art, pt)
        if w is None:
            self.d.text((self.p(x), self.p(y)), t, font=f, fill=color, anchor=anchor)
            return y + pt / 72 * self.u * 1.25
        zeilen = self.umbruch(t, f, w)
        lh = pt / 72 * self.u * 1.22
        for i, z in enumerate(zeilen):
            self.d.text((self.p(x), self.p(y + i * lh)), z, font=f, fill=color, anchor=anchor)
        return y + len(zeilen) * lh

    def breite(self, t, art, pt):
        return self.F(art, pt).getlength(t) / self.s

    def umbruch(self, t, f, w):
        aus = []
        for absatz in t.split('\n'):
            z = ''
            for wort in absatz.split(' '):
                probe = (z + ' ' + wort).strip()
                if f.getlength(probe) / self.s <= w or not z:
                    z = probe
                else:
                    aus.append(z)
                    z = wort
            aus.append(z)
        return aus

    def kreis(self, cx, cy, d, text, art='bold', pt=12, fill=WEISS, ring=TINTE, color=TINTE, width=1.0):
        r = d / 2
        self.d.ellipse([self.p(cx - r), self.p(cy - r), self.p(cx + r), self.p(cy + r)], fill=fill, outline=ring, width=max(1, int(width / 72 * self.u * self.s)))
        self.d.text((self.p(cx), self.p(cy)), text, font=self.F(art, pt), fill=color, anchor='mm')

    def save(self, pfad):
        self.im.save(pfad)


# ---- Folienrahmen in der Gestaltung des Vortrags (vereinfacht) ---------------------------------------------------------------------
def colX(k):
    return 0.667 + (k - 1) * 1.02


def span(n):
    return n * 1.02 - 0.24


class Folie(Blatt):
    def __init__(self, nr, zeichen, abschnitt, titel, akzent, rubrik, grund='papier', anhang=False, trenner=False):
        super().__init__(13.333, 7.5, 120, PAPIER if grund == 'papier' else (ROT if trenner else WEISS))
        self.nr, self.anhang = nr, anhang
        if trenner:
            return
        self.rect(0.30, 0.30, 12.733, 6.90, outline=TINTE, width=1)
        # Raster: zwölf Spalten in der Inhaltszone
        y0 = 1.50 if anhang else 2.10
        for k in range(1, 13):
            self.rect(colX(k), y0, span(1), 6.50 - y0, outline=RASTER, width=1)
        self.kreis(0.82, 0.59, 0.30, zeichen, 'bold', 10)
        self.text(1.09, 0.59, abschnitt.upper(), 'bold', 12, TINTE, anchor='lm')
        self.text(12.667, 0.59, 'SKIZZE', 'bold', 11, ROT, anchor='rm')
        if anhang:
            self.text(0.667, 0.95, titel[0].upper(), 'titel', 22, TINTE)
        else:
            self.rect(0.45, 0.93, 0.04, 0.86, fill=ROT)
            for i, z in enumerate(titel):
                x = 0.667
                if akzent and akzent in z:
                    vor, nach = z.split(akzent, 1)
                    for teil, art, col in ((vor, 'titel', TINTE), (akzent, 'titelk', ROT), (nach, 'titel', TINTE)):
                        if teil:
                            self.text(x, 0.88 + i * 0.514, teil.upper(), art, 32, col)
                            x += self.breite(teil.upper(), art, 32)
                else:
                    self.text(x, 0.88 + i * 0.514, z.upper(), 'titel', 32, TINTE)
        # Schriftfeld
        self.rect(0.30, 6.72, 12.733, 0.48, outline=TINTE)
        self.text(0.50, 6.96, 'PGN', 'xbold', 22, ROT, anchor='lm')
        self.text(2.40, 6.86, 'Mietwohnraumförderung Niedersachsen 2026', 'text', 10, ANTH, anchor='lm')
        self.text(2.40, 7.05, rubrik.upper(), 'bold', 10, TINTE, anchor='lm')
        self.text(12.85, 6.83, 'Blatt', 'text', 9, ANTH, anchor='rm')
        self.text(12.85, 7.03, str(nr), 'xbold', 14, TINTE, anchor='rm')

    def modulkopf(self, x, y, w, titel, sub=None):
        self.line(x, y, x + w, y, TINTE, 1.5)
        self.text(x, y + 0.10, titel, 'bold', 16, TINTE)
        if sub:
            self.text(x, y + 0.44, sub, 'text', 12, GRAU)
            return y + 0.76
        return y + 0.46

    def hinweis(self, x, yu, w, t):
        f = self.F('light', 12)
        n = len(self.umbruch(t, f, w - 0.55))
        h = n * 12 / 72 * 1.22 + 0.24
        self.rect(x, yu - h, w, h, fill=FL3)
        self.kreis(x + 0.24, yu - h + 0.22, 0.20, 'i', 'semi', 10, fill=FL3)
        self.text(x + 0.45, yu - h + 0.11, t, 'light', 12, ANTH, w=w - 0.55)
        return yu - h

    def stichpunkte(self, x, y, w, gruppen, linie=True):
        if linie:
            self.line(x, y, x + w, y, TINTE, 1.5)
        y += 0.08
        for titel, punkte in gruppen:
            if titel:
                self.text(x, y, titel, 'bold', 16, TINTE)
                y += 0.36
            for pnkt in punkte:
                self.rect(x, y + 0.06, 0.09, 0.09, fill=TINTE)
                y = self.text(x + 0.22, y, pnkt, 'text', 14, ANTH, w=w - 0.22) + 0.04
            y += 0.06
        return y

    def tabelle(self, x, y, breiten, kopf, zeilen, pt=12, zh=0.27, ergebnis=(), summe=(), hell=(), farben=None, kopf2=None):
        """breiten: Spaltenbreiten (erste Spalte Text, übrige Zahlen rechtsbündig); zeilen: Listen von Texten; kopf2: Mietzeile unter dem Kopf."""
        w = sum(breiten)
        if kopf:
            xx = x
            for i, (k, b) in enumerate(zip(kopf, breiten)):
                if i == 0:
                    self.text(xx + 0.06, y + 0.06, k.upper(), 'bold', 11, GRAU)
                else:
                    self.text(xx + b - 0.06, y + 0.06, k.upper(), 'bold', 11, GRAU, anchor='ra')
                xx += b
            y += 0.30
            if kopf2:
                xx = x
                for i, (k, b) in enumerate(zip(kopf2, breiten)):
                    if k:
                        self.text(xx + b - 0.06, y - 0.02, k, 'text', 10, GRAU, anchor='ra')
                    xx += b
                y += 0.18
            self.line(x, y, x + w, y, TINTE, 0.75)
        for zi, z in enumerate(zeilen):
            erg = zi in ergebnis
            if erg:
                self.rect(x, y, w, zh, fill=ROT)
            elif zi in hell:
                self.rect(x, y, w, zh, fill=WEISS)
            xx = x
            for i, (c, b) in enumerate(zip(z, breiten)):
                if farben and (zi, i) in farben:
                    self.rect(xx, y, b, zh, fill=farben[(zi, i)])
                col = WEISS if erg else (TINTE if i else ANTH)
                art = 'bold' if (i or erg or zi in summe) else 'text'
                if i == 0:
                    self.text(xx + 0.06, y + zh / 2, str(c), 'semi' if (erg or zi in summe) else 'text', pt, col, anchor='lm')
                else:
                    self.text(xx + b - 0.06, y + zh / 2, str(c), art, pt, col, anchor='rm')
                xx += b
            y += zh
            self.line(x, y, x + w, y, TINTE if zi in summe or erg else LINIE, 0.5)
        return y

    def legende(self, x, y, eintraege):
        for t, farbe, strich in eintraege:
            if strich:
                self.line(x, y + 0.08, x + 0.36, y + 0.08, farbe, 2.25, strich if strich != 'solid' else None)
            else:
                self.rect(x, y, 0.28, 0.17, fill=farbe)
            x += 0.44
            self.text(x, y + 0.085, t, 'text', 11, ANTH, anchor='lm')
            x += self.breite(t, 'text', 11) + 0.25
        return x


# ---- Diagramme -----------------------------------------------------------------------------------------------------------------------
def achse_y(b, plot, lo, hi, schritt, fmt, titel=None):
    x, y, w, h = plot
    v = lo
    while v <= hi + 1e-9:
        yy = y + h - (v - lo) / (hi - lo) * h
        b.line(x, yy, x + w, yy, LINIE if abs(v) > 1e-12 else TINTE, 0.5 if abs(v) > 1e-12 else 1.0)
        b.text(x - 0.08, yy, fmt(v), 'text', 11, GRAU, anchor='rm')
        v += schritt
    if titel:
        f = b.F('text', 11)
        tw = int(f.getlength(titel)) + 4
        im = Image.new('RGBA', (tw, int(f.size * 1.4)), (0, 0, 0, 0))
        ImageDraw.Draw(im).text((0, 0), titel, font=f, fill=GRAU)
        im = im.rotate(90, expand=True)
        b.im.paste(im, (b.p(x) - int(0.95 * b.s) - im.width // 2, b.p(y + h / 2) - im.height // 2), im)


def yv(plot, lo, hi, v):
    x, y, w, h = plot
    return y + h - (v - lo) / (hi - lo) * h


STRICH = {'A': None, 'B': (0.10, 0.06), 'C': (0.025, 0.04), 'frei_dscr': None}
LFARBE = {'A': TINTE, 'B': TINTE, 'C': TINTE, 'frei_dscr': REF}


def linien(b, plot, reihen, jahre, lo, hi, schritt, fmt, titel, marken=(), xlabels=(1, 5, 10, 15, 20, 25, 30, 35, 40)):
    x, y, w, h = plot
    achse_y(b, plot, lo, hi, schritt, fmt, titel)
    j0, j1 = jahre[0], jahre[-1]
    xj = lambda j: x + (j - j0) / (j1 - j0) * w
    for j in xlabels:
        if j0 <= j <= j1:
            b.text(xj(j), y + h + 0.08, str(j), 'text', 11, GRAU, anchor='ma')
    b.text(x + w / 2, y + h + 0.30, 'Jahr', 'text', 11, GRAU, anchor='ma')
    for k, (j, t) in enumerate(marken):
        b.line(xj(j), y, xj(j), y + h, REF, 0.75, (0.06, 0.05))
        if k == 0 and len(marken) > 1:      # erste Marke links der Linie, zweite rechts: beide oben, frei von den Linien
            b.text(xj(j) - 0.05, y + 0.02, t, 'text', 10, GRAU, anchor='ra')
        else:
            b.text(xj(j) + 0.05, y + 0.02, t, 'text', 10, GRAU)
    for v, werte in reihen:
        pts = [(xj(j), yv(plot, lo, hi, max(lo, min(hi, wv)))) for j, wv in zip(jahre, werte) if wv is not None]
        b.poly(pts, LFARBE[v], 2.25, STRICH[v])
    return xj


def kat_kreis(b, cx, cy, v):
    if v == 'frei_dscr':
        b.text(cx, cy, 'frei', 'xbold', 11, REF, anchor='mm')
    else:
        b.kreis(cx, cy, 0.30, VN[v], 'xbold', 11)


# =====================================================================================================================================
# Folien
def folie13():
    f = Folie(13, '3', 'Modellrechnung', [], None, '', grund='rot', trenner=True)
    f.kreis(1.55, 2.95, 1.40, '3', 'black', 54, fill=WEISS, ring=WEISS, color=ROT)
    for i, z in enumerate(['MODELLRECHNUNG:', 'EINSATZ, ÜBERSCHUSS,', 'VERMÖGEN, RISIKO']):
        f.text(2.70, 2.25 + i * 0.62, z, 'titelk' if i else 'titel', 40, WEISS)
    lead = (f'Ein PGN-Projekt in Neu Wulmstorf, {W("annahme.wohnungen")} Wohnungen, {de(W("annahme.wohnflaeche"))} m². Gefördert in A, B und C und frei '
            'finanziert: was Sie einsetzen, was bleibt, was Ihnen gehört, was schiefgehen kann.')
    f.text(2.70, 4.40, lead, 'text', 18, WEISS, w=8.0)
    for k in range(4):
        f.kreis(4.6 + k * 1.2, 0.30, 0.40, str(k + 1), 'bold', 12, fill=WEISS if k == 2 else ROT, ring=WEISS, color=ROT if k == 2 else WEISS)
    f.text(12.5, 0.6, 'SKIZZE', 'bold', 11, WEISS, anchor='rm')
    return f, 'trenner', 'Trenner: Achskreis XL 3, Titel nach den Fragen des Investors, Lead mit 14 Wohnungen und 828 m².'


def annahmen():
    """Die 28 Zeilen Annahme · Wert · Herkunft (Folie 14 und Broschüre Blatt 9)."""
    hm = [W(f'annahme.hoechstmiete_VI.{g}') for g in 'ABC']
    links = [
        ['Modellhaus', f'{W("annahme.wohnungen")} Whg., {de(W("annahme.wohnflaeche"))} m², Stufe {W("annahme.mietenstufe")}, EH 55, Bezug {W("annahme.bezugsjahr")}', 'Projekt'],
        ['Herstellungskosten', f'{eur(W("annahme.herstellungskosten_qm"))} je m², {eur(W("n4.herstellungskosten.A"))}', 'Projekt'],
        ['Grundstück, KG 800', f'je {eur(W("annahme.grundstueck"))}; Bodenwert +{pz(W("annahme.bodenwertsteigerung"), 1)} ohne Wirkung', 'Projekt, PGN'],
        ['Höchstmiete A | B | C', ' | '.join(de(m, 2) for m in hm) + ' € je m²', 'RL 5.4.4'],
        ['Mietanpassung gefördert', f'{W("annahme.jahre_ohne_mieterhoehung")} Jahre fest, dann alle {W("annahme.abstand_mieterhoehungen")} Jahre +{pz(W("annahme.mieterhoehung_in_der_bindung"))}', 'RL 5.4.5'],
        ['Belegungs- und Mietbindung', f'{W("annahme.bindung")} Jahre', 'RL 5.4.1'],
        ['Nach der Bindung', f'+{pz(W("annahme.kappungsgrenze"), 0)}, Vergleichsmiete {eur(W("annahme.vergleichsmiete_jahr1"), 2)}', 'Gesetz, Quelle'],
        ['Marktmiete Jahr 1', f'{eur(W("annahme.marktmiete_jahr1"), 2)} je m²', 'Quelle'],
        ['Miete frei finanziert Jahr 1', f'{eur(W("n2.miete_dscr"), 2)} je m², für DSCR 1,2', 'Formel'],
        ['Mietanpassung frei finanziert', f'+{pz(W("annahme.mietsteigerung"), 0)} p. a.', 'PGN'],
        ['Mietausfall, Leerstand', pz(W('annahme.mietausfall'), 0), 'PGN'],
        ['Objektverwaltung', f'{eur(W("annahme.objektverwaltung_je_wohnung"))} je Wohnung p. a.', 'PGN'],
        ['Instandhaltung', f'{eur(W("annahme.instandhaltung_je_qm"), 2)} je m² p. a.', 'PGN'],
        ['Kostensteigerung ab Jahr 2', f'{pz(W("annahme.kostensteigerung"), 0)} p. a., Kostenstand 2026', 'PGN'],
    ]
    q = lambda g: f'{g} {de(W(f"annahme.quote_zuschuss.{g}") * 100)} | {de(W(f"annahme.quote_darlehen.{g}") * 100)}'
    rechts = [
        ['Zuschuss | Darlehen, %', ', '.join(q(g) for g in 'ABC'), 'RL 5.3.3'],
        ['Eigenmittel', f'mind. {pz(W("annahme.eigenmittel_mindestens"), 0)}, kein Zusatz', 'RL 5.2.6'],
        ['Bemessungsgrenze', f'{eur(W("annahme.bemessungsgrenze_VI"))} je m², eingehalten', 'RL 5.3.2.2'],
        ['Zins NBank-Darlehen', f'{pz(W("annahme.zins_nbank_bis_jahr35"), 0)} bis Jahr {W("annahme.zinsfreie_jahre")}, dann {pz(W("annahme.zins_nbank_ab_jahr36"))}', 'RL 5.3.4, PGN'],
        ['Tilgung NBank-Darlehen', f'{pz(W("annahme.tilgung_nbank"))} über {W("annahme.laufzeit_hoechstens")} Jahre, kein Aufschub', 'PGN, RL 5.3.5'],
        ['Verwaltungskostenbeitrag', f'{pz(W("annahme.verwaltungskostenbeitrag"), 1)} des Restkapitals', 'RL 12.7.1'],
        ['Bearbeitungsentgelt', f'{pz(W("annahme.bearbeitungsentgelt_darlehen"), 0)} Darlehen, {pz(W("annahme.bearbeitungsentgelt_zuschuss"))} Zuschuss', 'RL 12.7.2'],
        ['Bankdarlehen frei finanziert', eur(W('n5.bankdarlehen.frei_dscr')), 'Formel'],
        ['Zins Bankdarlehen', f'{pz(W("annahme.zins_bank"))}, {W("annahme.zinsbindung")} J. fest, dann {pz(W("annahme.anschlusszins"))}', 'Quelle, PGN'],
        ['Tilgung Bankdarlehen', f'jährliche Annuität über {W("annahme.laufzeit_bank")} Jahre', 'PGN, RL 5.3.6'],
        ['DSCR, die die Bank verlangt', f'{de(W("n1.dscr_ziel_bank_frei"), 1)}; kostendeckend {de(W("annahme.dscr_ziel_mappe"), 1)}', 'PGN, neu'],
        ['Projektkonto', f'Guthaben {pz(W("annahme.guthabenzins"), 0)}, Soll {pz(W("annahme.sollzins"), 0)}', 'PGN'],
        ['Restwert Jahr 35', f'Marktmiete, {pz(W("kern.liegenschaftszins_jahr35.A"))}, {W("annahme.gesamtnutzungsdauer")} Jahre, Verkauf {pz(W("annahme.veraeusserungskosten"), 0)}', 'Quelle, PGN'],
        ['Rechnung', 'vor Steuern, ab Bezug, Szenarien neutral', 'PGN'],
    ]
    return links, rechts


def folie14():
    f = Folie(14, '3', 'Modellrechnung', ['Alle vier Varianten rechnen mit', 'demselben Haus und denselben Kosten'], 'demselben Haus', 'Annahmen')
    links, rechts = annahmen()
    for x, titel, zeilen in ((colX(1), 'Haus, Miete, Bewirtschaftung', links), (colX(7), 'Finanzierung und Rechnung', rechts)):
        y = f.modulkopf(x, 2.10, span(6), titel, 'Herkunft: RL Richtlinie, Projekt PGN, Quelle, PGN Annahme, Formel')
        f.tabelle(x, y, [1.84, 2.88, 1.16], ['Annahme', 'Wert', 'Herkunft'], zeilen, pt=10, zh=0.235,
                  hell=(10,) if zeilen is rechts else ())
    return f, 'annahmen', 'Zwei native Tabellen 6 + 6, je 14 Zeilen Annahme · Wert · Herkunft; DSCR 1,2 als einzige neue Annahme weiß hervorgehoben.'


def folie15():
    f = Folie(15, '3', 'Modellrechnung', ['Sie setzen in allen vier Varianten', f'rund {de(W("n5.eigenkapital.A") / 1e6, 1)} Mio. € Eigenkapital ein'],
              f'{de(W("n5.eigenkapital.A") / 1e6, 1)} Mio. €', 'Einsatz')
    y = f.modulkopf(colX(1), 2.10, span(7), 'Finanzierung je Variante', 'in Mio. €, Gesamtkosten in allen Varianten gleich')
    f.legende(colX(1), 2.84, [('Zuschuss', ROT, None), ('NBank-Darlehen', TINTE, None), ('Bankdarlehen', REF, None), ('Eigenmittel', '#D8D4CF', None), ('Entgelte', G300, None)])
    plot = (colX(1) + 1.75, 3.30, span(7) - 1.95, 2.75)
    x, yy, w, h = plot
    xs = lambda v: x + v / 3.2e6 * w
    for k in range(0, 7):
        v = k * 0.5e6
        f.line(xs(v), yy, xs(v), yy + h, LINIE, 0.5)
        f.text(xs(v), yy + h + 0.06, de(v / 1e6, 1), 'text', 11, GRAU, anchor='ma')
    kh = h / 4
    for i, v in enumerate(V):
        segs = [(W(f'n5.zuschuss.{v}') if v != 'frei_dscr' else 0, ROT), (W(f'n5.darlehen_nbank.{v}') if v != 'frei_dscr' else 0, TINTE),
                (W('n5.bankdarlehen.frei_dscr') if v == 'frei_dscr' else 0, REF), (W(f'kern.eigenmittel.{"frei_markt" if v == "frei_dscr" else v}'), '#D8D4CF'),
                (W(f'n5.bearbeitungsentgelte.{v}') if v != 'frei_dscr' else 0, G300)]
        x0 = 0
        cy = yy + kh * (i + 0.5)
        for wert_, farbe in segs:
            if wert_:
                f.rect(xs(x0), cy - 0.2, xs(x0 + wert_) - xs(x0), 0.40, fill=farbe)
                if wert_ > 2e5:
                    f.text((xs(x0) + xs(x0 + wert_)) / 2, cy, de(wert_ / 1e6, 2), 'bold', 11, WEISS if farbe in (ROT, TINTE, REF) else TINTE, anchor='mm')
                x0 += wert_
        lab = VN[v] if v != 'frei_dscr' else 'frei finanziert'
        f.text(x - 0.10, cy - 0.09, lab, 'semi', 12, TINTE, anchor='rm')
        f.text(x - 0.10, cy + 0.12, f'{eur(W(f"n5.miete_jahr1.{v}"), 2)} je m²', 'text', 10, GRAU, anchor='rm')
        if v == 'frei_dscr':
            f.text(x - 0.10, cy + 0.30, f'Markt {eur(W("n2.marktmiete_jahr1"), 2)}', 'text', 10, GRAU, anchor='rm')
    gk = W('n5.gesamtkosten.A')
    f.line(xs(gk), yy - 0.1, xs(gk), yy + h, ANTH, 0.75, (0.05, 0.04))
    f.text(xs(gk) - 0.05, yy - 0.12, f'Gesamtkosten {mio(gk)}', 'text', 10, GRAU, anchor='rb')
    y = f.modulkopf(colX(8), 2.10, span(5), 'Eigenkapital bei Bezug', 'in €')
    em = W('kern.eigenmittel.A')
    yy = f.tabelle(colX(8), y, [1.54, 0.83, 0.83, 0.83, 0.83], ['', 'A', 'B', 'C', 'frei'],
                   [['Eigenmittel'] + [de(W(f'kern.eigenmittel.{"frei_markt" if v == "frei_dscr" else v}')) for v in V],
                    ['+ Entgelte'] + [de(W(f'n5.bearbeitungsentgelte.{v}')) if v != 'frei_dscr' else '–' for v in V],
                    ['= Eigenkapital'] + [de(W(f'n5.eigenkapital.{v}')) for v in V]], pt=11, ergebnis=(2,))
    f.stichpunkte(colX(8), yy + 0.3, span(5), [('Was die Regeln verlangen', [f'Eigenmittel mindestens {pz(W("annahme.eigenmittel_mindestens"), 0)} der Kosten',
                                                                             'gefördert kommen einmalig die Bearbeitungsentgelte dazu',
                                                                             'frei finanziert ersetzt das Bankdarlehen Zuschuss und NBank-Darlehen'])])
    return f, 'einsatz', f'Gestapelte Balken je Variante (Zuschuss, NBank-Darlehen, Bankdarlehen, Eigenmittel, Entgelte), rechts Eigenkapital {eur(W("n5.eigenkapital.A"))} bis {eur(W("n5.eigenkapital.frei_dscr"))}.'


def folie17():
    zue = [W(f'n5.zue_jahr1.{v}') for v in V]
    f = Folie(17, '3', 'Modellrechnung', ['In Jahr 1 bleibt in allen vier Varianten', f'ein Zahlungsüberschuss, in A {eur(zue[0])}'], eur(zue[0]), 'Jahr 1')
    y = f.modulkopf(colX(1), 2.10, span(8), 'Jahresrechnung Jahr 1', 'in € p. a.; frei finanziert mit 18,36 € je m², Marktmiete 15,42 €')
    K = lambda k, g: W(f'kern.{k}.{g}')
    J = lambda k: abs(W(f'team2:jr1.frei_dscr.{k}'))
    zeilen = [
        ['1 Sollmiete'] + [de(K('sollmiete', g)) for g in 'ABC'] + [de(J('sollmiete'))],
        ['2 − Mietausfall, 2 %'] + [de(K('mietausfall', g)) for g in 'ABC'] + [de(J('mietausfall'))],
        ['3 − Objektverwaltung'] + [de(K('objektverwaltung', g)) for g in 'ABC'] + [de(J('objektverwaltung'))],
        ['4 − Instandhaltung'] + [de(K('instandhaltung', g)) for g in 'ABC'] + [de(J('instandhaltung'))],
        ['5 = Überschuss vor Kapitaldienst'] + [de(W(f'n5.uevk_jahr1.{v}')) for v in V],
        ['6 − Verwaltungskostenbeitrag'] + [de(K('verwaltungskostenbeitrag', g)) for g in 'ABC'] + ['–'],
        ['7 − Zins'] + [de(K('zins_nbank', g)) for g in 'ABC'] + [de(J('zins'))],
        ['8 − Tilgung'] + [de(K('tilgung_nbank', g)) for g in 'ABC'] + [de(J('tilgung'))],
        ['9 = Zahlungsüberschuss'] + [de(z) for z in zue],
        ['Kapitaldienst, Zeilen 6 bis 8'] + [de(W(f'n5.kapitaldienst_jahr1.{v}')) for v in V],
        ['DSCR, Zeile 5 ÷ Kapitaldienst'] + [de(W(f'n5.dscr_jahr1.{v}'), 2) for v in V],
    ]
    yy = f.tabelle(colX(1), y, [3.52, 1.10, 1.10, 1.10, 1.10], ['Position', 'A', 'B', 'C', 'frei'], zeilen, pt=12, zh=0.245, ergebnis=(8,), summe=(4,))
    f.hinweis(colX(1), 6.50, span(8), f'Einmalig, außerhalb der Jahresrechnung: Bearbeitungsentgelte {" | ".join(de(W(f"n5.bearbeitungsentgelte.{g}")) for g in "ABC")} €.')
    f.stichpunkte(colX(9), 2.10, span(4), [('Was hereinkommt', ['gefördert die Höchstmiete, frei finanziert 18,36 €']),
                                          ('Was hinausgeht', ['Bewirtschaftung gleich in allen vier Varianten', f'frei finanziert {eur(J("zins"))} Zins']),
                                          ('Was bleibt', ['frei finanziert am meisten, aber nur mit 18,36 € Miete'])])
    return f, 'jahr1', f'Rechenblatt Jahr 1 mit vier Spalten, Zeilen 1 bis 9, Kapitaldienst und DSCR; Zahlungsüberschuss {" | ".join(de(z) for z in zue)} €.'


def zeitreihe(k, v, von=1, bis=42):
    r = W(f'zr.{k}.{v}')
    return r[von - 1:bis]


def folie18():
    zue35 = W('n5.zue_jahr35.A')
    f = Folie(18, '3', 'Modellrechnung', ['Kein Jahr mit Fehlbetrag, in A wächst', f'der Zahlungsüberschuss auf {eur(zue35)}'], eur(zue35), 'Zahlungsüberschuss')
    f.modulkopf(colX(1), 2.10, span(7), 'Zahlungsüberschuss je Jahr', 'in Tsd. € p. a., Jahr 1 bis 42')
    f.legende(colX(1), 2.84, [('A', TINTE, 'solid'), ('B', TINTE, (0.10, 0.06)), ('C', TINTE, (0.025, 0.04)), ('frei finanziert', REF, 'solid')])
    yh = f.hinweis(colX(1), 6.50, span(7), 'Frei finanziert: Miete 18,36 € je m² für DSCR 1,2, Marktmiete 15,42 €, beide +2 % p. a.; ab Jahr 31 kein Kapitaldienst. '
                                          'Gefördert: ab Jahr 36 Zins 3,86 % auf die Restschuld.')
    plot = (colX(1) + 1.0, 3.25, span(7) - 1.2, yh - 0.55 - 3.25)
    linien(f, plot, [(v, [x / 1000 for x in zeitreihe('zue', v)]) for v in V], list(range(1, 43)), 0, 400, 50, lambda v: de(v), 'Tsd. € p. a.',
           marken=[(W('annahme.laufzeit_bank'), 'Bankdarlehen getilgt'), (W('annahme.bindung'), 'Ende der Bindung')])
    y = f.modulkopf(colX(8), 2.10, span(5), 'Zahlungsüberschuss', 'in € p. a.; Fehlbetrag und Konto: Jahr 1 bis 42')
    zeilen = [[f'Jahr {j}'] + [de(zeitreihe('zue', v)[j - 1]) for v in V] for j in (1, 10, 20, 30, 35, 42)]
    zeilen.append(['kumuliert bis Jahr 35, Mio. €'] + [de(W(f'n5.kum_jahr35.{v}') / 1e6, 2) for v in V])
    zeilen.append(['Jahre mit Fehlbetrag'] + [str(W(f'n5.jahre_fehlbetrag_1_35.{v}') + W(f'n5.jahre_fehlbetrag_36_42.{v}')) for v in V])
    zeilen.append(['tiefster Stand Projektkonto'] + [de(W(f'n5.projektkonto_tiefststand.{v}')) for v in V])
    f.tabelle(colX(8), y, [1.98, 0.72, 0.72, 0.72, 0.72], ['', 'A', 'B', 'C', 'frei'], zeilen, pt=10, zh=0.30, summe=(6,))
    return f, 'zahlungsueberschuss', 'Liniendiagramm Jahr 1 bis 42, vier Varianten, Marken Jahr 30 und 35; Tabelle Jahr 1, 10, 20, 30, 35, 42, kumuliert, Fehlbetrag, Kontostand.'


def folie19():
    j = [W(f'team2:t2.jahr_frei.{v}') for v in V]
    f = Folie(19, '3', 'Modellrechnung', ['Gefördert ist Ihr Eigenkapital zurück', f'in {min(j[:3])} bis {max(j[:3])} Jahren, frei finanziert in {j[3]}'],
              f'{min(j[:3])} bis {max(j[:3])} Jahren', 'Rückfluss')
    f.modulkopf(colX(1), 2.10, span(7), 'Noch gebundenes Eigenkapital', 'in Tsd. €, Ende Jahr 0 bis 35')
    f.legende(colX(1), 2.84, [('A', TINTE, 'solid'), ('B', TINTE, (0.10, 0.06)), ('C', TINTE, (0.025, 0.04)), ('frei finanziert', REF, 'solid')])
    yh = f.hinweis(colX(1), 6.50, span(7), 'Gebunden ist das Eigenkapital, das der Zahlungsüberschuss noch nicht zurückgezahlt hat, ohne Zinsen. '
                                          'Frei finanziert: Miete 18,36 € je m², Marktmiete 15,42 €.')
    plot = (colX(1) + 1.0, 3.25, span(7) - 1.2, yh - 0.55 - 3.25)
    xj = linien(f, plot, [(v, [x / 1000 for x in W(f'team2:t2.gebunden.{v}')[:36]]) for v in V], list(range(0, 36)), 0, 700, 100, lambda v: de(v),
                'Tsd. €', xlabels=(0, 5, 10, 15, 20, 25, 30, 35))
    for k, jj in enumerate(sorted(set(j))):
        vs = [v for v, x in zip(V, j) if x == jj]
        cx, cy = xj(jj), yv(plot, 0, 700, 0)
        f.d.ellipse([f.p(cx - 0.05), f.p(cy - 0.05), f.p(cx + 0.05), f.p(cy + 0.05)], fill=LFARBE[vs[0]])
        f.text(cx + (0.10 if k == 1 else 0.06), cy - (0.42 if k == 1 else 0.10), f'{", ".join("frei" if v == "frei_dscr" else v for v in vs)}: {jj}', 'bold', 11, LFARBE[vs[0]], anchor='lb')
    y = f.modulkopf(colX(8), 2.10, span(5), 'Rückfluss des Eigenkapitals', 'in €')
    zeilen = [['Eigenkapital bei Bezug'] + [de(W(f'n5.eigenkapital.{v}')) for v in V],
              ['gebunden nach 10 Jahren'] + [de(W(f'team2:t2.gebunden.{v}')[10]) for v in V],
              ['zurück in Jahr'] + [str(x) for x in j],
              ['Überschuss bis Jahr 35, Mio. €'] + [de(W(f'n5.kum_jahr35.{v}') / 1e6, 2) for v in V]]
    yy = f.tabelle(colX(8), y, [2.06, 0.70, 0.70, 0.70, 0.70], ['', 'A', 'B', 'C', 'frei'], zeilen, pt=11, zh=0.32, ergebnis=(2,))
    f.stichpunkte(colX(8), yy + 0.3, span(5), [(None, ['gefördert bindet der Kapitaldienst des NBank-Darlehens den Überschuss der ersten Jahre',
                                                       'frei finanziert schneller, weil die Miete 18,36 € beträgt'])])
    return f, 'rueckfluss', f'Neu: Liniendiagramm gebundenes Eigenkapital Jahr 0 bis 35 (Block T2), Punkt bei Rückfluss {", ".join(map(str, j))}; Tabelle rechts.'


def folie20():
    f = Folie(20, '3', 'Modellrechnung', ['Nur Gruppe C liegt in Jahr 1 bis 3 unter', 'DSCR 1,2, danach steigt sie überall'], 'Jahr 1 bis 3', 'DSCR im Verlauf')
    f.modulkopf(colX(1), 2.10, span(7), 'DSCR je Jahr', 'Überschuss vor Kapitaldienst ÷ Kapitaldienst, Jahr 1 bis 35')
    f.legende(colX(1), 2.84, [('A', TINTE, 'solid'), ('B', TINTE, (0.10, 0.06)), ('C', TINTE, (0.025, 0.04)), ('frei finanziert', REF, 'solid')])
    yh = f.hinweis(colX(1), 6.50, span(7), 'Gefördert ist es der Kapitaldienst des NBank-Darlehens, frei finanziert der des Bankdarlehens. Frei finanziert: Miete 18,36 € je m², Marktmiete 15,42 €.')
    plot = (colX(1) + 0.8, 3.25, span(7) - 1.0, yh - 0.55 - 3.25)
    reihen = [(v, zeitreihe('dscr', v, 1, 35) if v != 'frei_dscr' else zeitreihe('dscr', v, 1, 30) + [None] * 5) for v in V]
    xj = linien(f, plot, reihen, list(range(1, 36)), 0.8, 3.4, 0.4, lambda v: de(v, 1), 'DSCR', xlabels=(1, 5, 10, 15, 20, 25, 30, 35))
    yr = yv(plot, 0.8, 3.4, W('n1.dscr_ziel_bank_frei'))
    f.line(plot[0], yr, plot[0] + plot[2], yr, ANTH, 0.75, (0.06, 0.05))
    f.text(plot[0] + plot[2], yr - 0.04, '1,2: Annahme der Bank, frei finanziert', 'text', 10, GRAU, anchor='rb')
    y = f.modulkopf(colX(8), 2.10, span(5), 'DSCR je Variante', None)
    zeilen = [['Jahr 1'] + [de(W(f'n5.dscr_jahr1.{v}'), 2) for v in V],
              ['Minimum Jahr 1 bis 35'] + [de(W(f'n5.dscr_min_1_35.{v}'), 2) for v in V],
              ['Jahre unter 1,2'] + [str(W(f'n5.jahre_dscr_unter_ziel.{v}')) for v in V],
              ['Jahr 30'] + [de(zeitreihe('dscr', v)[29], 2) for v in V],
              ['Jahr 35'] + [de(W(f'n5.dscr_jahr35.{v}'), 2) if v != 'frei_dscr' else '–' for v in V]]
    yy = f.tabelle(colX(8), y, [1.62, 0.81, 0.81, 0.81, 0.81], ['', 'A', 'B', 'C', 'frei'], zeilen, pt=11, zh=0.27)
    f.stichpunkte(colX(8), yy + 0.2, span(5), [('Wofür die 1,2 gilt', ['frei finanziert verlangt sie die Bank (Annahme der PGN)',
                                                                         'gefördert ist sie ein Vergleich, die NBank gibt keine vor',
                                                                         f'Tilgung {pz(W("tilgung_2_90:tilgung_2_90.eingabe"))}: B {W("tilgung_2_90:n6.tilgung_2_90.jahre_dscr_unter_ziel.B")}, C {W("tilgung_2_90:n6.tilgung_2_90.jahre_dscr_unter_ziel.C")} Jahre unter 1,2'])])
    return f, 'dscr', 'Liniendiagramm DSCR Jahr 1 bis 35 mit Bezugslinie 1,2; Tabelle Jahr 1, Minimum, Jahre unter 1,2, Jahr 30, Jahr 35.'


def saeulen_gruppiert(f, plot, reihen, lo, hi, schritt, fmtv, titel, fmt_label, kat):
    x, y, w, h = plot
    achse_y(f, plot, lo, hi, schritt, fmtv, titel)
    n, m = len(kat), len(reihen)
    kb = w / n
    sb = kb / (m + 0.9)
    for i, k in enumerate(kat):
        for j, (name, farbe_je, werte) in enumerate(reihen):
            v = werte[i]
            if v is None:
                continue
            x0 = x + kb * i + (kb - m * sb) / 2 + j * sb
            y0 = yv(plot, lo, hi, v)
            f.rect(x0, y0, sb * 0.92, yv(plot, lo, hi, 0) - y0, fill=farbe_je[i])
            f.text(x0 + sb * 0.46, y0 - 0.03, fmt_label(v), 'bold', 11, TINTE, anchor='mb')
        kat_kreis(f, x + kb * (i + 0.5), y + h + 0.24, k)


def folie21():
    o = [W(f'n5.objektrendite.{v}') for v in V]
    oz = [W(f'n5.objektrendite_nach_zuschuss.{v}') for v in V[:3]]
    f = Folie(21, '3', 'Modellrechnung', [f'Gefördert bringt das Haus {de(min(o[:3]) * 100, 2)} bis {pz(max(o[:3]))},', f'nach Abzug des Zuschusses bis {pz(max(oz))}'],
              f'bis {pz(max(oz))}', 'Objektrendite')
    f.modulkopf(colX(1), 2.10, span(7), 'Objektrendite Jahr 1', 'Überschuss vor Kapitaldienst ÷ Gesamtkosten, in %')
    f.legende(colX(1), 2.84, [('auf die Gesamtkosten', TINTE, None), ('nach Abzug des Zuschusses', G300, None)])
    plot = (colX(1) + 2.25, 3.25, span(7) - 2.25, 1.55)
    saeulen_gruppiert(f, plot, [('Gesamtkosten', [TINTE, TINTE, TINTE, REF], o), ('nach Zuschuss', [G300] * 4, oz + [None])], 0, 0.06, 0.01,
                      lambda v: de(v * 100), '%', lambda v: de(v * 100, 2), V)
    gk = W('n5.gesamtkosten.A')
    zeilen = [['Miete Jahr 1 je m²'] + [de(W(f'n5.miete_jahr1.{v}'), 2) for v in V],
              ['Überschuss vor Kapitaldienst'] + [de(W(f'n5.uevk_jahr1.{v}')) for v in V],
              ['Gesamtkosten nach Zuschuss'] + [de(gk - W(f'n5.zuschuss.{v}')) for v in V[:3]] + [de(gk)]]
    w4 = (span(7) - 2.25) / 4
    f.tabelle(colX(1), 5.35, [2.25] + [w4] * 4, None, zeilen, pt=10, zh=0.33)
    f.stichpunkte(colX(8), 2.10, span(5), [('Was die Zahl misst', ['Überschuss vor Kapitaldienst Jahr 1 ÷ Gesamtkosten, ohne Finanzierung',
                                                                   f'die Mappe nennt sie Nettoanfangsrendite; Abweichung {de(W("n4.abweichung.A"))}']),
                                          ('Fair gerechnet', ['der Zuschuss senkt die Kosten, die Sie tragen: helle Säule',
                                                              f'frei finanziert {pz(o[3])}, weil die Miete 18,36 € statt 6,80 bis 9,00 € beträgt; der Markt zahlt 15,42 €'])])
    return f, 'objektrendite', 'Gruppierte Säulen Objektrendite auf Gesamtkosten und nach Zuschuss, darunter Tabelle Miete, Überschuss, Kosten nach Zuschuss.'


def folie22():
    oh = [W(f'n5.ek_vofi_ohne_restwert.{v}') for v in V]
    mi = [W(f'n5.ek_vofi_mit_restwert.{v}') for v in V]
    f = Folie(22, '3', 'Modellrechnung', ['Ohne Restwert bringt Ihr Eigenkapital', f'gefördert {de(min(oh[:3]) * 100, 2)} bis {pz(max(oh[:3]))} im Jahr'],
              f'{de(min(oh[:3]) * 100, 2)} bis {pz(max(oh[:3]))}', 'Eigenkapitalrendite')
    f.modulkopf(colX(1), 2.10, span(7), 'Eigenkapitalrendite über 35 Jahre', 'in % p. a.')
    f.legende(colX(1), 2.84, [('ohne Restwert', G300, None), ('mit Restwert', TINTE, None)])
    yh = f.hinweis(colX(1), 6.50, span(7), 'Zinssatz, zu dem das Eigenkapital bei Bezug in 35 Jahren auf das Vermögen Ende Jahr 35 wächst. Überschüsse liegen zu 2 % auf dem Projektkonto.')
    plot = (colX(1) + 1.45, 3.25, span(7) - 1.75, yh - 0.55 - 3.25)
    x, y, w, h = plot
    xs = lambda v: x + v / 0.10 * w
    for k in range(0, 6):
        f.line(xs(k * 0.02), y, xs(k * 0.02), y + h, LINIE, 0.5)
        f.text(xs(k * 0.02), y + h + 0.06, str(k * 2), 'text', 11, GRAU, anchor='ma')
    kh = h / 4
    for i, v in enumerate(V):
        for j, (val, farbe) in enumerate(((oh[i], G300), (mi[i], REF if v == 'frei_dscr' else TINTE))):
            yy = y + kh * i + 0.12 + j * 0.25
            f.rect(x, yy, xs(val) - x, 0.22, fill=farbe)
            f.text(xs(val) + 0.05, yy + 0.11, pz(val), 'bold', 11, TINTE, anchor='lm')
        f.text(x - 0.08, y + kh * i + 0.37, 'frei finanziert' if v == 'frei_dscr' else VN[v], 'semi', 12, TINTE, anchor='rm')
    y0 = f.modulkopf(colX(8), 2.10, span(5), 'Woraus die Rendite kommt', None)
    zeilen = [['Eigenkapital bei Bezug'] + [de(W(f'n5.eigenkapital.{v}')) for v in V],
              ['Vermögen Jahr 35, Mio. €'] + [de(W(f'n5.vermoegen_jahr35.{v}') / 1e6, 2) for v in V],
              ['Restwertanteil'] + [pz(W(f'n5.restwertanteil.{v}'), 0) for v in V]]
    yy = f.tabelle(colX(8), y0, [1.62, 0.81, 0.81, 0.81, 0.81], ['', 'A', 'B', 'C', 'frei'], zeilen, pt=11, zh=0.30)
    f.stichpunkte(colX(8), yy + 0.3, span(5), [(None, ['gefördert stammen gut drei Viertel des Ergebnisses aus dem Restwert',
                                                       f'frei finanziert {pz(oh[3])} ohne, {pz(mi[3])} mit Restwert, nur mit 18,36 € Miete (Markt 15,42 €)',
                                                       f'ohne Mietsteigerung {pz(W("mietsteigerung_0:n6.mietsteigerung_0.ek_vofi_mit_restwert.frei_dscr"))} mit Restwert'])])
    return f, 'eigenkapitalrendite', 'Gruppierte Balken Eigenkapitalrendite ohne und mit Restwert; Tabelle Eigenkapital, Vermögen, Restwertanteil.'


def folie23():
    vm = [W(f'n5.vermoegen_jahr35.{v}') for v in V]
    f = Folie(23, '3', 'Modellrechnung', ['Nach 35 Jahren gehören Ihnen in A', f'{mio(vm[0])}, davon {pz(W("n5.restwertanteil.A"), 0)} Restwert'], mio(vm[0]), 'Vermögen')
    f.modulkopf(colX(1), 2.10, span(7), 'Vermögen Ende Jahr 35', 'in Mio. €')
    f.legende(colX(1), 2.84, [('Restwert', TINTE, None), ('Projektkonto', G300, None), ('Restschuld', '#D8D4CF', None)])
    plot = (colX(1) + 2.1, 3.20, span(7) - 2.1, 1.30)
    x, y, w, h = plot
    lo, hi = -1e6, 13e6
    achse_y(f, plot, lo, hi, 2e6, lambda v: de(v / 1e6), None)
    kb = w / 4
    for i, v in enumerate(V):
        rw, kt, rs = W(f'n5.restwert_jahr35.{v}'), W(f'n5.projektkonto_jahr35.{v}'), W(f'n5.restschuld_jahr35.{v}')
        x0 = x + kb * i + kb * 0.3
        sb = kb * 0.4
        f.rect(x0, yv(plot, lo, hi, rw), sb, yv(plot, lo, hi, 0) - yv(plot, lo, hi, rw), fill=REF if v == 'frei_dscr' else TINTE)
        f.rect(x0, yv(plot, lo, hi, rw + kt), sb, yv(plot, lo, hi, rw) - yv(plot, lo, hi, rw + kt), fill=G300)
        if rs:
            f.rect(x0, yv(plot, lo, hi, 0), sb, yv(plot, lo, hi, -rs) - yv(plot, lo, hi, 0), fill='#D8D4CF')
        f.text(x0 + sb / 2, yv(plot, lo, hi, rw + kt) - 0.03, de(vm[i] / 1e6, 2), 'bold', 11, TINTE, anchor='mb')
        kat_kreis(f, x0 + sb / 2, y + h + 0.24, v)
    zeilen = [['Restwert'] + [de(W(f'n5.restwert_jahr35.{v}') / 1e6, 2) for v in V],
              ['+ Projektkonto'] + [de(W(f'n5.projektkonto_jahr35.{v}') / 1e6, 2) for v in V],
              ['− Restschuld'] + [de(W(f'n5.restschuld_jahr35.{v}') / 1e6, 2) for v in V],
              ['= Vermögen Ende Jahr 35'] + [de(x_ / 1e6, 2) for x_ in vm],
              ['ohne Restwert'] + [de(W(f'n5.vermoegen_jahr35_ohne_restwert.{v}') / 1e6, 2) for v in V],
              ['Vermögen Ende Jahr 42'] + [de(W(f'n5.vermoegen_jahr42.{v}') / 1e6, 2) for v in V]]
    w4 = (span(7) - 2.1) / 4
    f.tabelle(colX(1), 4.96, [2.1] + [w4] * 4, None, zeilen, pt=11, zh=0.255, ergebnis=(3,))
    f.stichpunkte(colX(8), 2.10, span(5), [('Restwert', [f'Ertragswert Ende Jahr 35, Liegenschaftszins {pz(W("kern.liegenschaftszins_jahr35.A"))}',
                                                         f'gefördert in A {mio(W("team2:rw.abschlag_bindung_35.A"))} unter dem Ertragswert zur Marktmiete von {mio(W("team2:rw.ertragswert_zielmiete_35.A"))}']),
                                          ('Restschuld', ['NBank-Darlehen bis Jahr 42 getilgt, Bankdarlehen bis Jahr 30',
                                                          'frei finanziert liegt vorn, mit 18,36 € Miete (Markt 15,42 €)'])])
    return f, 'vermoegen', 'Gestapelte Säulen Restwert, Projektkonto, Restschuld je Variante; Tabelle mit Ergebniszeile Vermögen Ende Jahr 35.'


def folie24():
    f = Folie(24, '3', 'Modellrechnung', ['Herstellungskosten der PGN liegen', '22,7 % unter dem ARGE-Median'], '22,7 %', 'Herstellungskosten')
    quelle = None
    for p in sorted((HIER / 'heute').glob('f22*.png')):
        quelle = p
    if quelle is None:
        import subprocess
        pdf = HIER.parents[2] / 'praesentation' / 'dist' / 'PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pdf'
        subprocess.run(['pdftoppm', '-f', '22', '-l', '22', '-r', '60', '-png', str(pdf), str(HIER / 'heute' / 'f22')], check=True)
        quelle = sorted((HIER / 'heute').glob('f22*.png'))[0]
    im = Image.open(quelle).convert('RGB')
    im = im.resize((f.p(span(8)), int(f.p(span(8)) * im.height / im.width)))
    f.im.paste(im, (f.p(colX(1)), f.p(2.10)))
    f.stichpunkte(colX(9), 2.10, span(4), [('Bleibt wie heute', ['heute Folie 22, Zahlen wie bisher',
                                                                 'neu ist nur die Stellung: Sie leitet die Frage „Was kann schiefgehen?“ ein',
                                                                 'Folie 25 rechnet mit 4.631 € und 5.460 € je m²'])])
    return f, 'herstellungskosten', 'Unverändert (heute Folie 22); Bild der heutigen Folie, neu nur vor der Risikofolie.'


# ---- Anhang -------------------------------------------------------------------------------------------------------------------------
def anhangA6():
    f = Folie('A6', 'A', 'Anhang', ['Kennzahlen je Variante von Jahr 1 bis Jahr 42'], None, 'Kennzahlen', grund='weiss', anhang=True)
    gruppen = [
        ('Jahr 1', [('Miete je m²', 'n5.miete_jahr1', 2, ''), ('kostendeckende Anfangsmiete, DSCR 1,0', 'kdam', 2, ''), ('Miete für DSCR 1,2', 'n5.miete_dscr_ziel', 2, ''),
                    ('Eigenkapital bei Bezug', 'n5.eigenkapital', 0, ''),
                    ('Zahlungsüberschuss', 'n5.zue_jahr1', 0, ''), ('DSCR', 'n5.dscr_jahr1', 2, ''), ('Objektrendite', 'n5.objektrendite', 2, '%'),
                    ('Objektrendite nach Zuschuss', 'n5.objektrendite_nach_zuschuss', 2, '%')]),
        ('35 Jahre', [('Zahlungsüberschuss Jahr 35', 'n5.zue_jahr35', 0, ''), ('kumuliert Jahr 1 bis 35', 'n5.kum_jahr35', 0, ''), ('Eigenkapital zurück in Jahr', 'n5.jahr_ek_erreicht', 0, ''),
                      ('Jahre mit Fehlbetrag', 'n5.jahre_fehlbetrag_1_35', 0, ''), ('tiefster Stand Projektkonto', 'n5.projektkonto_tiefststand', 0, ''),
                      ('DSCR Minimum', 'n5.dscr_min_1_35', 2, ''), ('Jahre unter DSCR 1,2', 'n5.jahre_dscr_unter_ziel', 0, ''), ('Restschuld Ende Jahr 35', 'n5.restschuld_jahr35', 0, ''),
                      ('Restwert Ende Jahr 35', 'n5.restwert_jahr35', 0, ''), ('Vermögen Ende Jahr 35', 'n5.vermoegen_jahr35', 0, ''),
                      ('Eigenkapitalrendite mit Restwert', 'n5.ek_vofi_mit_restwert', 2, '%'), ('Eigenkapitalrendite ohne Restwert', 'n5.ek_vofi_ohne_restwert', 2, '%'),
                      ('EK-IRR mit Restwert', 'n5.ek_irr_mit_restwert', 2, '%')])]
    zeilen, erg = [], []
    for g, rs in gruppen:
        zeilen.append([g.upper(), '', '', '', ''])
        for t, k, nk, e in rs:
            zeile = [t]
            for v in V:
                if k == 'kdam':        # Übersicht!D112:G112; frei finanziert gilt für beide Mieten (gleicher Kapitaldienst)
                    x = W(f'team2:kdam.{"frei_markt" if v == "frei_dscr" else v}')
                elif k == 'n5.objektrendite_nach_zuschuss' and v == 'frei_dscr':
                    zeile.append('–')  # frei finanziert gibt es keinen Zuschuss
                    continue
                else:
                    x = W(f'{k}.{v}')
                zeile.append(pz(x, nk) if e == '%' else de(x, nk))
            zeilen.append(zeile)
    kopf2 = [''] + [f'{eur(W(f"n5.miete_jahr1.{g}"), 2)} je m²' for g in 'ABC'] + [f'{eur(W("n2.miete_dscr"), 2)}, Markt {eur(W("n2.marktmiete_jahr1"), 2)}']
    f.tabelle(colX(1), 1.50, [5.2, 1.7, 1.7, 1.7, 1.7], ['Kennzahl', 'A', 'B', 'C', 'frei finanziert'], zeilen, pt=10, zh=0.19, summe=(0, 9), kopf2=kopf2)
    return f, 'kennzahlen', 'Tabelle über zwölf Spalten, drei Gruppen (Jahr 1, 35 Jahre), alle Kennzahlen der Konzepte-Mappe Zeilen 49 bis 85.'


def anhangA7():
    f = Folie('A7', 'A', 'Anhang', ['Jahr 36 bis 42: in keiner Variante ein Fehlbetrag'], None, 'Nach der Bindung', grund='weiss', anhang=True)
    f.modulkopf(colX(1), 1.50, span(7), 'Miete je m² nach der Bindung', 'in € je m² und Monat, Jahr 30 bis 42')
    f.legende(colX(1), 2.24, [('A', TINTE, 'solid'), ('B', TINTE, (0.10, 0.06)), ('C', TINTE, (0.025, 0.04)),
                              (f'frei finanziert, {eur(W("n2.miete_dscr"), 2)} (Markt {eur(W("n2.marktmiete_jahr1"), 2)})', REF, 'solid')])
    plot = (colX(1) + 0.9, 2.65, span(7) - 1.1, 2.5)
    linien(f, plot, [(v, zeitreihe('miete', v, 30, 42)) for v in V], list(range(30, 43)), 0, 45, 5, lambda v: de(v), '€ je m²', xlabels=(30, 33, 35, 37, 40, 42))
    f.hinweis(colX(1), 6.50, span(7), 'Ab Jahr 36 trägt das NBank-Darlehen 3,86 % Zins; die Restschuld ist bis Jahr 42 getilgt. Die Miete steigt nach der Bindung um höchstens 20 % in drei Jahren bis zur Vergleichsmiete.')
    y = f.modulkopf(colX(8), 1.50, span(5), 'Jahr 36 bis 42', 'in €')
    zeilen = [['Restschuld Ende Jahr 35'] + [de(W(f'n5.restschuld_jahr35.{v}')) for v in V],
              ['Überschuss Jahr 36'] + [de(zeitreihe('zue', v)[35]) for v in V],
              ['Überschuss Jahr 42'] + [de(W(f'n5.zue_jahr42.{v}')) for v in V],
              ['Summe Jahr 36 bis 42'] + [de(W(f'n5.zue_summe_36_42.{v}')) for v in V],
              ['Jahre mit Fehlbetrag'] + [str(W(f'n5.jahre_fehlbetrag_36_42.{v}')) for v in V],
              ['Restschuld Ende Jahr 42'] + [de(W(f'n5.restschuld_jahr42.{v}')) for v in V],
              ['Vermögen Jahr 42, Mio. €'] + [de(W(f'n5.vermoegen_jahr42.{v}') / 1e6, 2) for v in V],
              ['Eigenkapitalrendite bis Jahr 42', '', '', '', ''],
              ['mit Restwert'] + [pz(W(f'n5.ek_vofi_mit_restwert_jahr42.{v}')) for v in V],
              ['ohne Restwert'] + [pz(W(f'n5.ek_vofi_ohne_restwert_jahr42.{v}')) for v in V]]
    f.tabelle(colX(8), y, [1.62, 0.81, 0.81, 0.81, 0.81], ['', 'A', 'B', 'C', 'frei'], zeilen, pt=10, zh=0.30, summe=(7,))
    return f, 'nach-der-bindung', 'Liniendiagramm Miete Jahr 30 bis 42 (Kappungsgrenze), Tabelle Jahr 36 bis 42 mit Restschuld, Überschuss, Vermögen, Rendite.'


LAEUFE = [('Tilgung NBank-Darlehen 2,90 %', 'tilgung_2_90'), ('Tilgung NBank-Darlehen 3,65 %', 'tilgung_3_65'), ('Herstellungskosten 4.631 € je m²', 'kosten_4631'),
          ('Herstellungskosten 5.460 € je m²', 'kosten_5460'),
          ('keine Mieterhöhung in der Bindung', 'mietanpassung_gefoerdert_0'), ('keine Mietsteigerung am Markt', 'mietsteigerung_0'),
          ('Anschlusszins Bankdarlehen 4,86 %', 'anschlusszins_plus_1'), ('Anschlusszins Bankdarlehen 2,86 %', 'anschlusszins_minus_1'),
          ('Liegenschaftszins 3,40 % statt 2,80 %', 'r1')]


def lw(l, k, v):
    if l == 'r1':
        # Lauf R1 führt nur Restwert, Vermögen, Rendite, Fehlbetrag, Kontostand, DSCR Jahr 1 und Miete; sonst „–“ (nicht geschätzt)
        if f'r1.liegenschaftszins_plus_0_60.{k}.{v}' not in WERTE['laeufe']['liegenschaftszins_plus_0_60']['werte']:
            return None
        return W(f'liegenschaftszins_plus_0_60:r1.liegenschaftszins_plus_0_60.{k}.{v}')
    return W(f'{l}:n6.{l}.{k}.{v}')


def anhangA8():
    f = Folie('A8', 'A', 'Anhang', ['Risikoläufe: tiefster Kontostand, DSCR, Rendite, Vermögen'], None, 'Risikoläufe', grund='weiss', anhang=True)
    y_next = 1.50
    for bi, (titel, kennz) in enumerate([('Tiefster Stand Projektkonto, € | DSCR Minimum', [('projektkonto_tiefststand', lambda x: de(x)), ('dscr_min_1_35', lambda x: de(x, 2))]),
                                         ('Eigenkapitalrendite ohne Restwert | Vermögen Jahr 35, Mio. €', [('ek_vofi_ohne_restwert', lambda x: pz(x)), ('vermoegen_jahr35', lambda x: de(x if isinstance(x, str) else x / 1e6, 2))])]):
        sub = None
        if bi == 0:
            sub = (f'je Lauf eine Annahme; frei finanziert {eur(W("n2.miete_dscr"), 2)} je m² (Markt {eur(W("n2.marktmiete_jahr1"), 2)}), in den Kostenläufen '
                   f'{eur(W("kosten_4631:n6.kosten_4631.miete_jahr1.frei_dscr"), 2)} und {eur(W("kosten_5460:n6.kosten_5460.miete_jahr1.frei_dscr"), 2)} für DSCR 1,2')
        y = f.modulkopf(colX(1), y_next if bi else 1.50, span(12), titel, sub)
        zeilen = []
        for t, l in LAEUFE:
            z = [t]
            for k, fm in kennz:
                for v in V:
                    x = lw(l, k, v)
                    z.append('–' if x is None else fm(x))
            zeilen.append(z)
        y_next = f.tabelle(colX(1), y, [3.2] + [1.1] * 8, ['Lauf', 'A', 'B', 'C', 'frei', 'A', 'B', 'C', 'frei'], zeilen, pt=10, zh=0.175) + 0.08
    return f, 'risikolaeufe', 'Zwei Tabellen über zwölf Spalten, neun Läufe, je Variante tiefster Kontostand, DSCR Minimum, Rendite ohne Restwert, Vermögen.'


def anhangA10():
    f = Folie('A10', 'A', 'Anhang', [f'Frei finanziert fließen {pz(abs(W("team2:jr1.frei_dscr.zins")) / W("team2:jr1.frei_dscr.sollmiete"), 1)} der Miete in den Zins'], None,
              'Zahlungsfluss frei', grund='weiss', anhang=True)
    soll = W('team2:jr1.frei_dscr.sollmiete')
    ziele = [('Zins', 'zins', REF), ('Tilgung', 'tilgung', TINTE), ('Zahlungsüberschuss', 'zue', G300), ('Instandhaltung', 'instandhaltung', FL3),
             ('Objektverwaltung', 'objektverwaltung', FL3), ('Mietausfall', 'mietausfall', FL3)]
    f.modulkopf(colX(1), 1.50, span(12), 'Sollmiete Jahr 1 frei finanziert und wohin sie fließt', 'in € p. a.; Miete 18,36 € je m² für DSCR 1,2, Marktmiete 15,42 €')
    h_ges = 3.30
    y0 = 2.45
    luecke = (6.40 - y0 - h_ges) / (len(ziele) - 1)
    f.rect(1.85, y0, 0.15, h_ges, fill=REF)
    f.text(1.75, y0 + h_ges / 2 - 0.11, 'Sollmiete', 'semi', 12, TINTE, anchor='rm')
    f.text(1.75, y0 + h_ges / 2 + 0.11, eur(soll), 'semi', 12, TINTE, anchor='rm')
    y, yz = y0, y0
    for i, (t, k, farbe) in enumerate(ziele):
        b = abs(W(f'team2:jr1.frei_dscr.{k}'))
        hh = max(b / soll * h_ges, 0.02)
        f.d.polygon([(f.p(2.0), f.p(y)), (f.p(7.0), f.p(yz)), (f.p(7.0), f.p(yz + hh)), (f.p(2.0), f.p(y + hh))], fill=farbe)
        f.rect(7.0, yz, 0.12, hh, fill=TINTE)
        f.text(7.25, yz + hh / 2, f'{t}: {eur(b)} ({pz(b / soll, 1)})', 'semi', 12, TINTE, anchor='lm')
        y += hh
        yz += hh + luecke
    return f, 'fluss-frei', 'Flussdiagramm mit der Miete für DSCR 1,2: Sollmiete zu Zins, Tilgung, Zahlungsüberschuss, Bewirtschaftung, Mietausfall.'


FOLIEN = [folie13, folie14, folie15, folie17, folie18, folie19, folie20, folie21, folie22, folie23, folie24, anhangA6, anhangA7, anhangA8, anhangA10]


# =====================================================================================================================================
# Broschüre: A4 hoch 210 × 297 mm, Satzspiegel 180 × 259 mm (Rand links und rechts 15 mm, oben 18 mm, unten 20 mm), zwölf Spalten
MM = 6  # px je mm
SP_X0, SP_Y0, SP_W, SP_H, GUT = 15, 18, 180, 259, 4
SPW = (SP_W - 11 * GUT) / 12


def bx(k):
    return SP_X0 + (k - 1) * (SPW + GUT)


def bw(n):
    return n * SPW + (n - 1) * GUT


class Seite(Blatt):
    def __init__(self, blatt, bogen, kolumne, titel):
        super().__init__(210, 297, MM, WEISS, u=25.4)
        self.rect(0, 0, 210, 297, outline=LINIE)
        for k in range(1, 13):
            self.rect(bx(k), SP_Y0, SPW, SP_H, outline=RASTER)
        self.text(SP_X0, 10, kolumne.upper(), 'bold', 8, TINTE)
        self.text(SP_X0 + SP_W, 10, f'SKIZZE · BLATT {blatt} · BOGENSEITE {bogen}', 'bold', 8, ROT, anchor='ra')
        self.rect(SP_X0, SP_Y0, 1.2, 16, fill=ROT)
        y = SP_Y0
        for z in titel:
            self.text(SP_X0 + 4, y, z.upper(), 'titel', 17, TINTE)
            y += 8
        self.y = y + 6
        self.text(SP_X0, 297 - 12, 'Mietwohnraumförderung Niedersachsen 2026', 'text', 7, GRAU)
        self.text(SP_X0 + SP_W, 297 - 12, str(bogen), 'bold', 9, TINTE, anchor='ra')

    def modul(self, nr, x, y, w, titel, sub=None):
        self.line(x, y, x + w, y, TINTE, 1.5)
        self.text(x, y + 1.6, f'{nr}  {titel}', 'bold', 9, TINTE)
        if sub:
            self.text(x, y + 6.0, sub, 'text', 7, GRAU)
            return y + 10.5
        return y + 6.5

    def tab(self, x, y, breiten, kopf, zeilen, pt=7, zh=4.6, ergebnis=(), hell=(), farben=None):
        w = sum(breiten)
        if kopf:
            xx = x
            for i, (k, b) in enumerate(zip(kopf, breiten)):
                self.text(xx + (0.8 if i == 0 else b - 0.8), y + 0.6, k.upper(), 'bold', 6, GRAU, anchor='la' if i == 0 else 'ra')
                xx += b
            y += 4.2
            self.line(x, y, x + w, y, TINTE, 0.6)
        for zi, z in enumerate(zeilen):
            if zi in ergebnis:
                self.rect(x, y, w, zh, fill=ROT)
            elif zi in hell:
                self.rect(x, y, w, zh, fill=FL3)
            xx = x
            for i, (c, b) in enumerate(zip(z, breiten)):
                if farben and (zi, i) in farben:
                    self.rect(xx, y, b, zh, fill=farben[(zi, i)])
                col = WEISS if zi in ergebnis else (TINTE if i else ANTH)
                self.text(xx + (0.8 if i == 0 else b - 0.8), y + zh / 2, str(c), 'bold' if i else 'text', pt, col, anchor='lm' if i == 0 else 'rm')
                xx += b
            y += zh
            self.line(x, y, x + w, y, LINIE, 0.4)
        return y

    def kasten(self, x, y, w, t, titel=None, pt=7.5):
        f = self.F('text', pt)
        n = len(self.umbruch(t, f, w - 6))
        h = n * pt / 72 * 25.4 * 1.25 + (9 if titel else 5)
        self.rect(x, y, w, h, fill=FL3)
        yy = y + 2
        if titel:
            self.text(x + 3, yy, titel, 'bold', 8, TINTE)
            yy += 5
        self.text(x + 3, yy, t, 'text', pt, ANTH, w=w - 6)
        return y + h


def bschrift(s, x, y, t, pt=7.5, w=None, art='text', color=ANTH):
    return s.text(x, y, t, art, pt, color, w=w)


def mini_linien(s, plot, reihen, jahre, lo, hi, schritt, fmt, titel, marken=()):
    x, y, w, h = plot
    v = lo
    while v <= hi + 1e-9:
        yy = y + h - (v - lo) / (hi - lo) * h
        s.line(x, yy, x + w, yy, LINIE if v else TINTE, 0.5)
        s.text(x - 1, yy, fmt(v), 'text', 6, GRAU, anchor='rm')
        v += schritt
    j0, j1 = jahre[0], jahre[-1]
    xj = lambda j: x + (j - j0) / (j1 - j0) * w
    for j in [jj for jj in ((0, 10, 20, 30, 35) if j0 == 0 else (1, 10, 20, 30, 35, 42)) if j0 <= jj <= j1]:
        s.text(xj(j), y + h + 1, str(j), 'text', 6, GRAU, anchor='ma')
    for j, t in marken:
        s.line(xj(j), y, xj(j), y + h, REF, 0.5, (1.2, 1))
        s.text(xj(j) + 0.8, y + 0.5, t, 'text', 5.5, GRAU)
    for vv, werte in reihen:
        pts = [(xj(j), y + h - (max(lo, min(hi, wv)) - lo) / (hi - lo) * h) for j, wv in zip(jahre, werte) if wv is not None]
        dash = {'A': None, 'B': (2.0, 1.2), 'C': (0.6, 0.9), 'frei_dscr': None}[vv]
        s.poly(pts, LFARBE[vv], 1.6, dash)
    s.text(x, y - 3.2, titel, 'text', 6, GRAU)
    return xj


def blatt9():
    ek = W('n5.eigenkapital.A')
    s = Seite(9, 10, 'Modellrechnung · Annahmen und Einsatz', ['Ein Haus, vier Finanzierungen,', f'rund {de(ek / 1e6, 1)} Mio. € Eigenkapital'])
    # 9.1 Steckbrief rechts neben der Überschrift (Spalten 9 bis 12)
    y = s.modul('9.1', bx(9), SP_Y0, bw(4), 'Steckbrief Modellhaus')
    for t in [f'Neu Wulmstorf, {W("annahme.wohnungen")} Wohnungen', f'{de(W("annahme.wohnflaeche"))} m², Effizienzhaus 55', f'Mietenstufe {W("annahme.mietenstufe")}, Bezug {W("annahme.bezugsjahr")}',
              f'Herstellungskosten {eur(W("annahme.herstellungskosten_qm"))} je m²', f'Bemessungsgrenze {eur(W("annahme.bemessungsgrenze_VI"))} eingehalten', 'Grundstück im Bestand, 0 € angesetzt']:
        y = bschrift(s, bx(9), y, t, 7.5, bw(4)) + 0.4
    y0 = max(s.y, y) + 4
    # 9.2 Annahmen über zwölf Spalten, zwei Tabellen 6 + 6 mit Annahme, Wert, Herkunft
    y = s.modul('9.2', bx(1), y0, bw(12), 'Annahmen der Rechnung', 'Wert und Herkunft (RL Richtlinie, Projekt PGN, Quelle, PGN Annahme, Formel); DSCR 1,2 ist die einzige neue Annahme')
    links, rechts = annahmen()
    for x, zz in ((bx(1), links), (bx(7), rechts)):
        s.tab(x, y, [bw(6) * 0.33, bw(6) * 0.48, bw(6) * 0.19], ['Annahme', 'Wert', 'Herkunft'], zz, pt=5.6, zh=4.2, hell=(10,) if zz is rechts else ())
    y = y + 4.2 + 14 * 4.2 + 8
    # 9.3 Finanzierung je Variante
    y3 = s.modul('9.3', bx(1), y, bw(12), 'Finanzierung je Variante', f'in Mio. €; Gesamtkosten {mio(W("n5.gesamtkosten.A"))} in allen Varianten')
    xl = bx(1)
    for t, farbe in (('Zuschuss', ROT), ('NBank-Darlehen', TINTE), ('Bankdarlehen', REF), ('Eigenmittel', '#D8D4CF'), ('Bearbeitungsentgelte', G300)):
        s.rect(xl, y3, 4, 2.6, fill=farbe)
        s.text(xl + 5, y3 + 1.3, t, 'text', 6.5, ANTH, anchor='lm')
        xl += 7 + s.breite(t, 'text', 6.5) + 4
    y3 += 6
    x0, w0 = bx(1) + 24, bw(12) - 26
    for i, v in enumerate(V):
        segs = [(W(f'n5.zuschuss.{v}') if v != 'frei_dscr' else 0, ROT), (W(f'n5.darlehen_nbank.{v}') if v != 'frei_dscr' else 0, TINTE),
                (W('n5.bankdarlehen.frei_dscr') if v == 'frei_dscr' else 0, REF), (W(f'kern.eigenmittel.{"frei_markt" if v == "frei_dscr" else v}'), '#D8D4CF'),
                (W(f'n5.bearbeitungsentgelte.{v}') if v != 'frei_dscr' else 0, G300)]
        yy = y3 + i * 9
        s.text(x0 - 2, yy + 1.8, 'frei finanziert' if v == 'frei_dscr' else f'Gruppe {v}', 'semi', 7, TINTE, anchor='rm')
        s.text(x0 - 2, yy + 4.6, f'{eur(W(f"n5.miete_jahr1.{v}"), 2)} je m²', 'text', 5.5, GRAU, anchor='rm')
        if v == 'frei_dscr':
            s.text(x0 - 2, yy + 7.0, f'Markt {eur(W("n2.marktmiete_jahr1"), 2)}', 'text', 5.5, GRAU, anchor='rm')
        a = 0
        for wert_, farbe in segs:
            if wert_:
                s.rect(x0 + a / 3.1e6 * w0, yy, wert_ / 3.1e6 * w0, 6, fill=farbe)
                if wert_ > 2e5:
                    s.text(x0 + (a + wert_ / 2) / 3.1e6 * w0, yy + 3, de(wert_ / 1e6, 2), 'bold', 6.5, WEISS if farbe in (ROT, TINTE, REF) else TINTE, anchor='mm')
                a += wert_
    y = y3 + 4 * 9 + 6
    # 9.4 Rechenweg Eigenkapital
    y4 = s.modul('9.4', bx(1), y, bw(12), 'Rechenweg Eigenkapital', 'in €')
    s.tab(bx(1), y4, [bw(12) - 4 * 26] + [26] * 4, ['', 'A', 'B', 'C', 'frei'],
          [[f'{de(W("annahme.wohnflaeche"))} m² × {eur(W("annahme.herstellungskosten_qm"))} = Gesamtkosten'] + [de(W(f'n5.gesamtkosten.{v}')) for v in V],
           [f'davon Eigenmittel {pz(W("annahme.eigenmittel_mindestens"), 0)}'] + [de(W(f'kern.eigenmittel.{"frei_markt" if v == "frei_dscr" else v}')) for v in V],
           ['+ Bearbeitungsentgelte, einmalig'] + [de(W(f'n5.bearbeitungsentgelte.{v}')) if v != 'frei_dscr' else '–' for v in V],
           ['= Eigenkapital bei Bezug'] + [de(W(f'n5.eigenkapital.{v}')) for v in V]], ergebnis=(3,))
    return s, 'Blatt 9: Überschrift mit Steckbrief rechts, Annahmen 6 + 6 mit Wert und Herkunft (28 Zeilen, DSCR 1,2 hervorgehoben), Finanzierungsbalken, Rechenweg Eigenkapital.'


def blatt10():
    zue = [W(f'n5.zue_jahr1.{v}') for v in V]
    s = Seite(10, 11, 'Modellrechnung · Jahr 1 und Bank', ['In Jahr 1 bleibt in allen vier', 'Varianten ein Zahlungsüberschuss'])
    y = s.modul('10.1', bx(1), s.y, bw(12), 'Jahresrechnung Jahr 1', 'in € p. a.; frei finanziert mit 18,36 € je m² für DSCR 1,2, Marktmiete 15,42 €')
    K = lambda k, g: W(f'kern.{k}.{g}')
    J = lambda k: abs(W(f'team2:jr1.frei_dscr.{k}'))
    zeilen = [['1 Sollmiete'] + [de(K('sollmiete', g)) for g in 'ABC'] + [de(J('sollmiete'))],
              ['2 − Mietausfall'] + [de(K('mietausfall', g)) for g in 'ABC'] + [de(J('mietausfall'))],
              ['3 − Objektverwaltung'] + [de(K('objektverwaltung', g)) for g in 'ABC'] + [de(J('objektverwaltung'))],
              ['4 − Instandhaltung'] + [de(K('instandhaltung', g)) for g in 'ABC'] + [de(J('instandhaltung'))],
              ['5 = Überschuss vor Kapitaldienst'] + [de(W(f'n5.uevk_jahr1.{v}')) for v in V],
              ['6 − Verwaltungskostenbeitrag'] + [de(K('verwaltungskostenbeitrag', g)) for g in 'ABC'] + ['–'],
              ['7 − Zins'] + [de(K('zins_nbank', g)) for g in 'ABC'] + [de(J('zins'))],
              ['8 − Tilgung'] + [de(K('tilgung_nbank', g)) for g in 'ABC'] + [de(J('tilgung'))],
              ['9 = Zahlungsüberschuss'] + [de(z) for z in zue],
              ['Kapitaldienst'] + [de(W(f'n5.kapitaldienst_jahr1.{v}')) for v in V],
              ['DSCR'] + [de(W(f'n5.dscr_jahr1.{v}'), 2) for v in V],
              ['Bearbeitungsentgelte, einmalig'] + [de(W(f'n5.bearbeitungsentgelte.{g}')) for g in 'ABC'] + ['–']]
    y = s.tab(bx(1), y, [bw(12) - 4 * 26] + [26] * 4, ['Position', 'A', 'B', 'C', 'frei'], zeilen, ergebnis=(8,)) + 8
    # 10.2 Miete für DSCR 1,2
    y2 = s.modul('10.2', bx(1), y, bw(7), 'Miete für DSCR 1,2', 'in € je m² und Monat')
    noetig = [W(f'n5.miete_dscr_ziel.{v}') for v in V]
    grenze = [W(f'n3.hoechstmiete.{g}') for g in 'ABC'] + [W('n2.marktmiete_jahr1')]
    x0, w0 = bx(1) + 22, bw(7) - 30
    for i, v in enumerate(V):
        yy = y2 + i * 11
        s.text(x0 - 2, yy + 4, 'frei finanziert' if v == 'frei_dscr' else f'Gruppe {v}', 'semi', 7, TINTE, anchor='rm')
        s.rect(x0, yy, noetig[i] / 21 * w0, 3.6, fill=TINTE)
        s.text(x0 + noetig[i] / 21 * w0 + 1, yy + 1.8, de(noetig[i], 2), 'bold', 6.5, TINTE, anchor='lm')
        s.rect(x0, yy + 4.0, grenze[i] / 21 * w0, 3.6, fill=G300)
        s.text(x0 + grenze[i] / 21 * w0 + 1, yy + 5.8, de(grenze[i], 2), 'bold', 6.5, TINTE, anchor='lm')
    s.text(x0, y2 + 46, 'schwarz: Miete für DSCR 1,2 · grau: Höchstmiete, frei finanziert Marktmiete', 'text', 6.5, GRAU)
    y3 = s.modul('', bx(8), y, bw(5), 'Rechenweg frei finanziert')
    kd, bew, aus = W('n2.kapitaldienst_bank_jahr1'), W('n2.bewirtschaftung_jahr1'), W('annahme.mietausfall')
    s.tab(bx(8), y3, [bw(5) - 34, 17, 17], ['', 'DSCR 1,0', 'DSCR 1,2'],
          [['Kapitaldienst'] + [de(kd)] * 2, ['× DSCR: Überschuss vor Kapitaldienst', de(kd * W('annahme.dscr_ziel_mappe')), de(W('n5.uevk_jahr1.frei_dscr'))],
           ['+ Bewirtschaftung', de(bew), de(bew)], [f'÷ {pz(1 - aus, 0)} = Sollmiete', de((kd + bew) / (1 - aus)), de(W('team2:jr1.frei_dscr.sollmiete'))],
           [f'÷ {de(W("annahme.wohnflaeche"))} m² ÷ 12', de(W('team2:kdam.frei_markt'), 2), de(W('n2.miete_dscr'), 2)]], ergebnis=(4,), pt=6.5)
    y = y2 + 52
    s.kasten(bx(1), y, bw(12), f'Frei finanziert verlangt die Bank für das Bankdarlehen eine DSCR von 1,2 (Annahme der PGN). Gefördert gibt es kein Bankdarlehen; die NBank prüft '
                             f'Eigenmittel (RL 5.2.6), Tilgungssatz und angemessenen Gewinn (RL 11.10). C liegt in Jahr 1 bis {W("n3.jahre_dscr_unter_ziel.C")} bei '
                             f'{de(W("n3.dscr_jahr1.C"), 2)}, ab Jahr 4 bei {de(zeitreihe("dscr", "C")[3], 2)}.', titel='10.3  Welche DSCR gilt wofür?')
    return s, 'Blatt 10: Jahresrechnung Jahr 1 mit vier Spalten, Miete für DSCR 1,2 mit Rechenweg, Kasten „Welche DSCR gilt wofür?“.'


def blatt11():
    j = [W(f'team2:t2.jahr_frei.{v}') for v in V]
    s = Seite(11, 12, 'Modellrechnung · 35 Jahre und Risiko', [f'Gefördert ist Ihr Eigenkapital', f'in {min(j[:3])} bis {max(j[:3])} Jahren zurück'])
    y = s.y
    y1 = s.modul('11.1', bx(1), y, bw(6), 'Zahlungsüberschuss', 'in Tsd. € p. a., Jahr 1 bis 42')
    mini_linien(s, (bx(1) + 9, y1 + 4, bw(6) - 11, 38), [(v, [x / 1000 for x in zeitreihe('zue', v)]) for v in V], list(range(1, 43)), 0, 400, 100, lambda v: de(v), '',
                marken=[(30, 'Jahr 30'), (35, 'Jahr 35')])
    y2 = s.modul('11.2', bx(7), y, bw(6), 'Noch gebundenes Eigenkapital', 'in Tsd. €, Jahr 0 bis 35')
    plot2 = (bx(7) + 9, y2 + 4, bw(6) - 11, 38)
    xj2 = mini_linien(s, plot2, [(v, [x / 1000 for x in W(f'team2:t2.gebunden.{v}')[:36]]) for v in V], list(range(0, 36)), 0, 700, 100, lambda v: de(v), '')
    for k, jj in enumerate(sorted(set(j))):
        vs = [v for v, x in zip(V, j) if x == jj]
        cx, cy = xj2(jj), plot2[1] + plot2[3]
        s.d.ellipse([s.p(cx - 0.9), s.p(cy - 0.9), s.p(cx + 0.9), s.p(cy + 0.9)], fill=LFARBE[vs[0]])
        s.text(cx + 1.2, cy - (7.0 if k == 1 else 2.0), f'{", ".join("frei" if v == "frei_dscr" else v for v in vs)}: {jj}', 'bold', 6.5,
               LFARBE[vs[0]], anchor='lb')
    s.text(bx(1), y1 + 48, 'A durchgezogen, B gestrichelt, C gepunktet (Tinte); frei finanziert grau, Miete 18,36 € (Markt 15,42 €)', 'text', 6.5, GRAU)
    y = y1 + 54
    y3 = s.modul('11.3', bx(1), y, bw(12), 'Kennzahlen je Variante')
    zeilen = [['DSCR Jahr 1 | Minimum'] + [f'{de(W(f"n5.dscr_jahr1.{v}"), 2)} | {de(W(f"n5.dscr_min_1_35.{v}"), 2)}' for v in V],
              ['Jahre unter DSCR 1,2'] + [str(W(f'n5.jahre_dscr_unter_ziel.{v}')) for v in V],
              ['Objektrendite | nach Zuschuss'] + [f'{pz(W(f"n5.objektrendite.{v}"))} | {pz(W(f"n5.objektrendite_nach_zuschuss.{v}"))}' if v != 'frei_dscr' else pz(W('n5.objektrendite.frei_dscr')) for v in V],
              ['Eigenkapitalrendite ohne | mit Restwert'] + [f'{pz(W(f"n5.ek_vofi_ohne_restwert.{v}"))} | {pz(W(f"n5.ek_vofi_mit_restwert.{v}"))}' for v in V],
              ['Restschuld | Restwert Jahr 35, Mio. €'] + [f'{de(W(f"n5.restschuld_jahr35.{v}") / 1e6, 2)} | {de(W(f"n5.restwert_jahr35.{v}") / 1e6, 2)}' for v in V],
              ['Vermögen Jahr 35, Mio. € | Restwertanteil'] + [f'{de(W(f"n5.vermoegen_jahr35.{v}") / 1e6, 2)} | {pz(W(f"n5.restwertanteil.{v}"), 0)}' for v in V]]
    y = s.tab(bx(1), y3, [bw(12) - 4 * 30] + [30] * 4, ['', 'A', 'B', 'C', 'frei'], zeilen, pt=6.5) + 7
    y4 = s.modul('11.4', bx(1), y, bw(12), 'Was schiefgehen kann', 'Jahre mit Fehlbetrag (Jahr 1 bis 35) | Eigenkapitalrendite mit Restwert; je Lauf eine Annahme')
    zeilen, farben = [], {}
    basis_rd = [W(f'n5.ek_vofi_mit_restwert.{v}') for v in V]
    k46, k54 = W('kosten_4631:n6.kosten_4631.miete_jahr1.frei_dscr'), W('kosten_5460:n6.kosten_5460.miete_jahr1.frei_dscr')
    ms_j = W('mietsteigerung_0:n6.mietsteigerung_0.jahre_dscr_unter_ziel.frei_dscr')
    namen25 = {'tilgung_2_90': 'Tilgung NBank-Darlehen 2,90 %', 'tilgung_3_65': 'Tilgung NBank-Darlehen 3,65 %',
               'kosten_4631': f'Herstellungskosten 4.631 € je m² (frei: Miete {eur(k46, 2)})',
               'kosten_5460': f'Herstellungskosten 5.460 € je m² (frei: Miete {eur(k54, 2)})',
               'mietsteigerung_0': f'keine Mietsteigerung am Markt (frei: {ms_j} Jahre unter DSCR 1,2)',
               'anschlusszins_plus_1': 'Anschlusszins Bankdarlehen 4,86 %', 'r1': 'Liegenschaftszins 3,40 % statt 2,80 %'}
    reihen = ([('Basis: Modellhaus', None)] + [(namen25.get(l, t), l) for t, l in LAEUFE if l != 'anschlusszins_minus_1']
              + [('Markt zahlt nur 15,42 € statt 18,36 €', 'markt')])
    for zi, (t, l) in enumerate(reihen):
        if l is None:
            fb, rd = [W(f'n5.jahre_fehlbetrag_1_35.{v}') for v in V], basis_rd
        elif l == 'markt':
            fb, rd = [None] * 3 + [W('n5.jahre_fehlbetrag_1_35.frei_markt')], [None] * 3 + [W('n5.ek_vofi_mit_restwert.frei_markt')]
        else:
            fb, rd = [lw(l, 'jahre_fehlbetrag_1_35', v) for v in V], [lw(l, 'ek_vofi_mit_restwert', v) for v in V]
        zeilen.append([t] + ['–' if x is None else str(x) for x in fb] + ['–' if x is None else pz(x) for x in rd])
        for i, x in enumerate(fb):
            if x:
                farben[(zi, 1 + i)] = G300 if x >= 6 else FL3
        for i, x in enumerate(rd):
            if x is not None and round(x, 4) < round(basis_rd[i], 4):
                farben[(zi, 5 + i)] = G300 if (basis_rd[i] - x) * 100 > 1 else FL3
    y = s.tab(bx(1), y4, [bw(12) - 8 * 13.5] + [13.5] * 8, ['Lauf', 'A', 'B', 'C', 'frei', 'A', 'B', 'C', 'frei'], zeilen, pt=6.5, zh=4.2, farben=farben) + 3
    y = s.kasten(bx(1), y, bw(12), f'Zahlt der Markt nur 15,42 €, liegt die DSCR bei {de(W("n5.dscr_jahr1.frei_markt"), 2)}: Die Bank leiht dann nur {mio(W("team2:t2.markt_dscr.darlehen_max"))}, '
                                   f'Sie setzen {mio(W("team2:t2.markt_dscr.mehr_ek"))} mehr Eigenkapital ein.', pt=7) + 3
    s.kasten(bx(1), y, bw(12), f'B liegt nie vorn. Unter {pz(W("team2:tilgungsschwelle.C"))} Tilgung hat C den höchsten Zahlungsüberschuss, darüber A.', titel='11.5  Welcher Mix?', pt=7)
    return s, 'Blatt 11: zwei Liniendiagramme (Überschuss, gebundenes Eigenkapital), Kennzahlentabelle, Risikotabelle mit grauen Stufen, Markt-Satz, Mix-Zeile.'


# =====================================================================================================================================
def main():
    zeilen_md = []
    for fn in FOLIEN:
        _aktuell[0] = fn.__name__
        f, kennung, satz = fn()
        name = f'folie-{str(f.nr).zfill(2)}-{kennung}.png'
        f.save(AUS_F / name)
        zeilen_md.append((str(f.nr), name, satz))
    for fn in (blatt9, blatt10, blatt11):
        _aktuell[0] = fn.__name__
        s, satz = fn()
        name = f'{fn.__name__}.png'
        s.save(AUS_B / name)
        zeilen_md.append((fn.__name__, name, satz))
    (AUS_F / 'belege_skizzen.json').write_text(json.dumps(BELEGE, ensure_ascii=False, indent=1), encoding='utf-8')
    print('\n'.join(f'{a}: {b}' for a, b, _ in zeilen_md))


if __name__ == '__main__':
    main()
