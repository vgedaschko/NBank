#!/usr/bin/env python3
"""Skizzen der übrigen Folien des Kapitels 3 (Team 3 „Vergleich“) und der Broschürenblätter 9 bis 11.

Jede Skizze zeigt Raster (zwölf Spalten, Inhaltszone 2,10 bis 6,50 Zoll), Kopf, Titel, Lage der Elemente und die echten Zahlen.
Zahlen nur aus konzepte/mappe/werte_konzepte.json (Lauf „konzepte“ und Läufe N6) und team-3/mappe/werte_team.json (Block T3).
Die Fußzeile jeder Skizze nennt Blatt und Zellen. Aufruf: python skizzen.py (schreibt PNG in diesen Ordner und ../broschuere/).
"""
import json
import os
import textwrap

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import Rectangle, Circle

HIER = os.path.dirname(os.path.abspath(__file__))
TEAM3 = os.path.normpath(os.path.join(HIER, "..", ".."))
KONZEPTE = os.path.normpath(os.path.join(TEAM3, ".."))
NBANK = os.path.normpath(os.path.join(KONZEPTE, ".."))
BROSCH = os.path.join(TEAM3, "entwurf", "broschuere")

for f in os.listdir(os.path.join(NBANK, "praesentation", "fonts")):
    if f.endswith(".ttf"):
        font_manager.fontManager.addfont(os.path.join(NBANK, "praesentation", "fonts", f))

# ---- Zahlen -------------------------------------------------------------------------------------------------------------
_K = json.load(open(os.path.join(KONZEPTE, "mappe", "werte_konzepte.json"), encoding="utf-8"))["laeufe"]
_T = json.load(open(os.path.join(TEAM3, "mappe", "werte_team.json"), encoding="utf-8"))["werte"]
V = ["A", "B", "C", "frei_dscr", "frei_markt"]
G3 = ["A", "B", "C"]


def K(k):
    return _K["konzepte"]["werte"][k]["wert"]


def KZ(k):
    e = _K["konzepte"]["werte"][k]
    return f"{e['blatt']}!{e['zelle']}"


def R(lauf, k):
    return _K[lauf]["werte"][f"n6.{lauf}.{k}"]["wert"]


def T(k):
    return _T[k]["wert"]


def k5(p):
    return [K(f"{p}.{v}") for v in V]


def t5(p):
    return [T(f"{p}.{v}") for v in V]


def r5(lauf, p):
    return [R(lauf, f"{p}.{v}") for v in V]


# ---- Formate (deutsch, Minus U+2212) -------------------------------------------------------------------------------------
def zahl(v, nk=0):
    if not isinstance(v, (int, float)):
        return str(v)
    s = f"{abs(v):,.{nk}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return ("−" if v < 0 and round(abs(v), nk) != 0 else "") + s


def eur(v, nk=0):
    return zahl(v, nk) + " €"


def pz(a, nk=0):
    return zahl(a * 100, nk) + " %" if isinstance(a, (int, float)) else str(a)


def mio(v, nk=2):
    return zahl(v / 1e6, nk) + " Mio. €"


def bar(werte, f):
    return " | ".join(f(w) for w in werte)


MIETE_D, MIETE_M = K("n2.miete_dscr"), K("n2.marktmiete_jahr1")
NAME = {"A": "Gruppe A", "B": "Gruppe B", "C": "Gruppe C", "frei_dscr": f"Frei {zahl(MIETE_D, 2)} €",
        "frei_markt": f"Frei {zahl(MIETE_M, 2)} €"}
KURZ = {"A": "A", "B": "B", "C": "C", "frei_dscr": f"Frei {zahl(MIETE_D, 2)}", "frei_markt": f"Frei {zahl(MIETE_M, 2)}"}

# ---- Farben und Linien wie im Vortrag -----------------------------------------------------------------------------------
TINTE, REF, GRAU, BISHER, HELL, PAPIER, ROT, LINIE, HAUCH = "#202020", "#77716B", "#626160", "#B4B0AB", "#D8D4CF", "#F4F3F2", "#B71E3F", "#CFCCC8", "#E9E7E4"
LS = {"A": (TINTE, "-"), "B": (TINTE, (0, (5, 3))), "C": (TINTE, (0, (1.5, 1.5))), "frei_dscr": (REF, "-"), "frei_markt": (REF, (0, (5, 3)))}
SAEULE = {"A": TINTE, "B": "#4A4642", "C": "#77716B", "frei_dscr": BISHER, "frei_markt": HELL}

W, H = 13.333, 7.5
X0 = 0.667


def colX(k):
    return X0 + (k - 1) * 1.02


def span(n):
    return n * 1.02 - 0.24


# ---- Folienrahmen --------------------------------------------------------------------------------------------------------
class Folie:
    def __init__(self, nr, zeichen, abschnitt, titel, akzent, rubrik, papier=True, quelle="", anhang=False, trenner=False):
        self.fig = plt.figure(figsize=(W, H), dpi=120)
        self.ax = self.fig.add_axes([0, 0, 1, 1])
        self.ax.set_xlim(0, W)
        self.ax.set_ylim(H, 0)
        self.ax.axis("off")
        grund = ROT if trenner else (PAPIER if papier else "#FFFFFF")
        self.fig.patch.set_facecolor(grund)
        self.trenner = trenner
        a = self.ax
        if trenner:
            a.add_patch(Circle((1.6, 3.2), 0.7, fill=False, ec="white", lw=3))
            a.text(1.6, 3.2, zeichen, color="white", fontsize=54, family="Montserrat", weight="black", ha="center", va="center")
            y = 2.75
            for z in titel:
                a.text(2.8, y, z.upper(), color="white", fontsize=40, family="Montserrat", weight="black", va="top")
                y += 0.62
            return
        # Planrahmen, Raster, Inhaltszone
        a.add_patch(Rectangle((0.30, 0.30), W - 0.60, H - 0.60, fill=False, ec=TINTE, lw=1.2))
        for k in range(1, 13):
            a.add_patch(Rectangle((colX(k), 1.5 if anhang else 2.10), 1.02 - 0.24, (6.50 - (1.5 if anhang else 2.10)), fc="#7FA7D9", alpha=0.07, lw=0))
        a.plot([0.5, W - 0.5], [6.50, 6.50], color="#7FA7D9", lw=0.6, ls=":")
        a.plot([0.5, W - 0.5], [1.5 if anhang else 2.10] * 2, color="#7FA7D9", lw=0.6, ls=":")
        # Kopf
        a.add_patch(Circle((X0 + 0.15, 0.59), 0.15, fill=False, ec=TINTE, lw=1))
        a.text(X0 + 0.15, 0.59, zeichen, fontsize=10, family="Work Sans", ha="center", va="center", color=TINTE)
        a.text(X0 + 0.42, 0.59, abschnitt.upper(), fontsize=12, family="Montserrat", weight="bold", va="center", color=TINTE)
        a.text(W - 0.667, 0.59, "SKIZZE", fontsize=10, family="Montserrat", weight="bold", va="center", ha="right", color="#7FA7D9")
        # Titel
        if anhang:
            self._titelzeile(titel[0], akzent, 1.02, 22)
        else:
            a.plot([0.46, 0.46], [0.94, 1.78], color=ROT, lw=3)
            for i, z in enumerate(titel):
                self._titelzeile(z, akzent, 1.12 + i * 0.51, 32)
        # Schriftfeld
        a.add_patch(Rectangle((0.30, 6.72), W - 0.60, 0.48, fill=False, ec=TINTE, lw=0.8))
        a.text(0.55, 6.96, "PGN", fontsize=20, family="Montserrat", color=ROT, va="center")
        a.text(2.40, 6.86, "Mietwohnraumförderung Niedersachsen 2026", fontsize=10, family="Work Sans", va="center", color=GRAU)
        a.text(2.40, 7.04, rubrik.upper(), fontsize=10, family="Montserrat", weight="bold", va="center", color=TINTE)
        a.text(12.80, 6.86, "Blatt", fontsize=10, family="Work Sans", va="center", ha="right", color=GRAU)
        a.text(12.80, 7.05, nr, fontsize=16, family="Work Sans", va="center", ha="right", color=TINTE)
        if quelle:
            for i, z in enumerate(textwrap.wrap(quelle, 95)[:2]):
                a.text(11.8, 6.86 + i * 0.17, z, fontsize=8, family="Work Sans", va="center", ha="right", color=GRAU)

    def _titelzeile(self, z, akzent, y, pt):
        a, x = self.ax, X0
        teile = [z]
        if akzent and akzent in z:
            i = z.index(akzent)
            teile = [z[:i], akzent, z[i + len(akzent):]]
        r = self.fig.canvas.get_renderer()
        for j, t in enumerate(teile):
            if not t:
                continue
            rot = len(teile) == 3 and j == 1
            tt = a.text(x, y, t.upper(), fontsize=pt, family="Montserrat", weight="black", style="italic" if rot else "normal",
                        color=ROT if rot else TINTE, va="center")
            x += tt.get_window_extent(r).width / 120

    # ---- Bausteine ----
    def text(self, x, y, s, pt=14, fam="Work Sans", w="normal", c=TINTE, ha="left", va="top", **kw):
        return self.ax.text(x, y, s, fontsize=pt, family=fam, weight=w, color=c, ha=ha, va=va, **kw)

    def modulkopf(self, x, y, w, titel, sub=None):
        self.ax.plot([x, x + w], [y, y], color=TINTE, lw=1.5)
        self.text(x, y + 0.10, titel, 16, "Montserrat", "bold")
        if sub:
            self.text(x, y + 0.44, sub, 12, c=GRAU)
        return y + (0.78 if sub else 0.48)

    def stichpunkte(self, x, y, w, gruppen, linie=True):
        if linie:
            self.ax.plot([x, x + w], [y, y], color=TINTE, lw=1.5)
        y += 0.10
        n = max(10, int(w / 0.098))
        for g, (titel, punkte) in enumerate(gruppen):
            if g:
                y += 0.14
            self.text(x, y, titel, 16, "Montserrat", "bold")
            y += 0.36
            for p in punkte:
                zeilen = textwrap.wrap(p, n)
                self.ax.add_patch(Rectangle((x, y + 0.07), 0.09, 0.09, fc=TINTE, lw=0))
                for z in zeilen:
                    self.text(x + 0.22, y, z, 14)
                    y += 0.25
                y += 0.04
        return y

    def hinweis(self, x, unten, w, s):
        n = int((w - 0.5) / 0.083)
        zeilen = textwrap.wrap(s, n)
        h = 0.16 + 0.21 * len(zeilen)
        self.ax.add_patch(Rectangle((x, unten - h), w, h, fc=HAUCH, lw=0))
        self.ax.add_patch(Circle((x + 0.20, unten - h + 0.19), 0.08, fill=False, ec=TINTE, lw=0.8))
        self.text(x + 0.20, unten - h + 0.19, "i", 8, ha="center", va="center")
        for i, z in enumerate(zeilen):
            self.text(x + 0.40, unten - h + 0.09 + i * 0.21, z, 12, w="light")
        return unten - h

    def tabelle(self, x, y, breiten, kopf, zeilen, pt=12, zh=0.27, fett_erste=True, rot_zeile=None, grau=None):
        a = self.ax
        xs = [x]
        for b in breiten:
            xs.append(xs[-1] + b)
        for j, t in enumerate(kopf):
            self.text(xs[j] + (breiten[j] - 0.06 if j else 0.06), y + 0.06, t.upper(), 10, "Work Sans", "medium", GRAU, ha="right" if j else "left")
        y += 0.30
        a.plot([x, xs[-1]], [y, y], color=TINTE, lw=0.8)
        for i, z in enumerate(zeilen):
            if rot_zeile == i:
                a.add_patch(Rectangle((x, y), xs[-1] - x, zh, fc=ROT, lw=0))
            for j, t in enumerate(z):
                c = "white" if rot_zeile == i else TINTE
                if grau and grau(i, j):
                    a.add_patch(Rectangle((xs[j], y), breiten[j], zh, fc=HAUCH, lw=0))
                self.text(xs[j] + (breiten[j] - 0.06 if j else 0.06), y + zh / 2, t, pt, "Montserrat" if j else "Work Sans",
                          "bold" if (j or (fett_erste and False)) else "normal", c, ha="right" if j else "left", va="center")
            y += zh
            a.plot([x, xs[-1]], [y, y], color=LINIE, lw=0.5)
        return y

    def achse(self, x, y, w, h):
        ax = self.fig.add_axes([x / W, 1 - (y + h) / H, w / W, h / H])
        ax.set_facecolor("none")
        for s in ["top", "right", "left"]:
            ax.spines[s].set_visible(False)
        ax.spines["bottom"].set_color(TINTE)
        ax.tick_params(labelsize=11, colors=GRAU, length=0)
        for l in ax.get_xticklabels() + ax.get_yticklabels():
            l.set_family("Work Sans")
        ax.grid(axis="y", color=LINIE, lw=0.5)
        ax.set_axisbelow(True)
        return ax

    def legende(self, x, y, eintraege):
        for t, art in eintraege:
            if art in LS:
                c, ls = LS[art]
                self.ax.plot([x, x + 0.28], [y + 0.09, y + 0.09], color=c, ls=ls, lw=2.25)
            else:
                self.ax.add_patch(Rectangle((x, y), 0.28, 0.17, fc="white" if art == "hatch" else art, lw=0.5 if art == "hatch" else 0, hatch="////" if art == "hatch" else None,
                                            ec=BISHER if art == "hatch" else None))
            tt = self.text(x + 0.36, y + 0.09, t, 11, va="center", c=TINTE)
            x += 0.36 + tt.get_window_extent(self.fig.canvas.get_renderer()).width / 120 + 0.22

    def speichere(self, name, ziel=HIER):
        self.fig.savefig(os.path.join(ziel, name), facecolor=self.fig.get_facecolor())
        plt.close(self.fig)


def fmt_ax(ax, fmt):
    from matplotlib.ticker import FuncFormatter
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: fmt(v)))
    for l in ax.get_yticklabels():
        l.set_family("Work Sans")


# ==========================================================================================================================
def folie13():
    f = Folie("13", "3", "", ["Modellrechnung:", "14 Wohnungen, gefördert", "und frei finanziert"], None, "", trenner=True)
    f.text(2.8, 5.0, f"Dasselbe Haus in vier Varianten: gefördert in den Gruppen A, B und C und frei finanziert. "
           f"Jede Folie zeigt alle vier nebeneinander. {zahl(K('annahme.wohnungen'))} Wohnungen, {zahl(K('annahme.wohnflaeche'))} m².",
           18, c="white", wrap=True)
    f.text(10.5, 7.1, "SKIZZE · Eingaben!F8, F9", 9, c="white")
    f.speichere("13-trenner.png")


def folie14():
    gk = K("n5.gesamtkosten.A")
    f = Folie("14", "3", "Modellrechnung", ["Jede Variante kostet 3,0 Mio. € und", "bindet rund 0,6 Mio. € Eigenkapital"], "0,6 Mio. €",
              "Varianten", quelle="Konzepte D49:H57, Übersicht D19:G19, Konzepte D13")
    yk = f.modulkopf(colX(1), 2.10, span(8), "Finanzierung je Variante", "in Mio. €, gleiche Herstellungskosten")
    f.legende(colX(1), yk - 0.05, [("Eigenmittel", "hatch"), ("Zuschuss", ROT), ("NBank-Darlehen", TINTE), ("Bankdarlehen", REF)])
    ax = f.achse(colX(1) + 0.3, yk + 0.30, span(8) - 0.4, 1.75)
    vv = ["A", "B", "C", "frei_dscr"]
    em = [K(f"kern.eigenmittel.{v}") if v != "frei_dscr" else K("kern.eigenmittel.frei_markt") for v in vv]
    zu = [K(f"n5.zuschuss.{v}") if v in G3 else 0 for v in vv]
    dn = [K(f"n5.darlehen_nbank.{v}") if v in G3 else 0 for v in vv]
    bd = [K(f"n5.bankdarlehen.{v}") for v in vv]
    xs = range(4)
    b = [0] * 4
    for werte, c, h in [(em, "white", "////"), (zu, ROT, None), (dn, TINTE, None), (bd, REF, None)]:
        ax.bar(xs, [w / 1e6 for w in werte], 0.5, bottom=b, color=c, hatch=h, edgecolor=BISHER if h else c, lw=0.5)
        for i, w in enumerate(werte):
            if w:
                ax.text(i, b[i] + w / 2e6, zahl(w / 1e6, 2), ha="center", va="center", fontsize=11, family="Montserrat", weight="bold",
                        color=TINTE if c == "white" else "white")
        b = [b[i] + werte[i] / 1e6 for i in range(4)]
    ax.set_xticks(list(xs), ["Gruppe A", "Gruppe B", "Gruppe C", "Frei finanziert"], family="Work Sans")
    ax.set_ylim(0, 3.2)
    for i in xs:
        ax.text(i, b[i] + 0.06, zahl(gk / 1e6, 2), ha="center", fontsize=11, family="Montserrat", weight="bold")
    miete = [K(f"n5.miete_jahr1.{v}") for v in vv]
    ek = [K(f"n5.eigenkapital.{v}") for v in vv]
    y = f.tabelle(colX(1), 5.22, [2.4, 1.38, 1.38, 1.38, 1.38], ["", "A", "B", "C", "Frei"],
                  [["Miete Jahr 1 je m²"] + [zahl(m, 2) + " €" for m in miete],
                   ["Herkunft der Miete", "Höchstmiete", "Höchstmiete", "Höchstmiete", "DSCR 1,2"],
                   ["Eingesetztes Eigenkapital"] + [zahl(e) for e in ek]], zh=0.26)
    f.stichpunkte(colX(9), 2.10, span(4), [("Gleich in allen", ["Haus, Herstellungskosten", "Grundstück im Bestand", "Bewirtschaftung"]),
                                          ("Verschieden", ["Finanzierung", "Miete", f"Marktmiete {zahl(MIETE_M, 2)} € (frei)"])])
    f.speichere("14-varianten.png")


def folie15():
    f = Folie("15", "3", "Modellrechnung", ["Alle Varianten haben gleiche Annahmen,", "neu ist nur die DSCR 1,2 der Bank"], "DSCR 1,2",
              "Annahmen", quelle="Eingaben F7:F45, Tabellen C14:D33, Übersicht D106, Konzepte D6:D13; Herkunft: konzepte/mappe/ANNAHMEN.md")
    taf = {
        "Haus": [("Wohnungen, Fläche", f"{zahl(K('annahme.wohnungen'))}, {zahl(K('annahme.wohnflaeche'))} m²", "P"),
                 ("Herstellungskosten", f"{zahl(K('annahme.herstellungskosten_qm'))} €/m²", "P"),
                 ("Bemessungsgrenze", f"{zahl(K('annahme.bemessungsgrenze_VI'))} €/m²", "R"),
                 ("Grundstück", "im Bestand, 0 €", "P"), ("Mietenstufe", str(K('annahme.mietenstufe')), "P"),
                 ("Bezug", f"{K('annahme.bezugsjahr')}", "A")],
        "Förderung": [("Darlehen A|B|C", bar([K(f'annahme.quote_darlehen.{g}') for g in G3], pz), "R"),
                      ("Zuschuss A|B|C", bar([K(f'annahme.quote_zuschuss.{g}') for g in G3], pz), "R"),
                      ("Höchstmiete", bar([K(f'annahme.hoechstmiete_VI.{g}') for g in G3], lambda v: zahl(v, 2)), "R"),
                      ("Mieterhöhung", f"alle {K('annahme.abstand_mieterhoehungen')} J. +{pz(K('annahme.mieterhoehung_in_der_bindung'), 2)}", "R, A"),
                      ("Zins bis Jahr 35", pz(K('annahme.zins_nbank_bis_jahr35')), "R"), ("Zins ab Jahr 36", pz(K('annahme.zins_nbank_ab_jahr36'), 2), "A"),
                      ("Tilgung", pz(K('annahme.tilgung_nbank'), 2), "A"),
                      ("Verwaltungskostenbeitrag", pz(K('annahme.verwaltungskostenbeitrag'), 1), "R"),
                      ("Bearbeitungsentgelte", f"{pz(K('annahme.bearbeitungsentgelt_darlehen'))} | {pz(K('annahme.bearbeitungsentgelt_zuschuss'), 2)}", "R"),
                      ("Eigenmittel", f"mind. {pz(K('annahme.eigenmittel_mindestens'))}", "R"),
                      ("Bindung", f"{K('annahme.bindung')} Jahre", "R")],
        "Frei finanziert": [("Zins, Bindung", f"{pz(K('annahme.zins_bank'), 2)}, {K('annahme.zinsbindung')} J.", "Q, A"),
                            ("Anschlusszins", pz(K('annahme.anschlusszins'), 2), "A"), ("Tilgung", f"Annuität {K('annahme.laufzeit_bank')} J.", "A"),
                            ("DSCR der Bank", f"{zahl(K('n1.dscr_ziel_bank_frei'), 1)} → {zahl(MIETE_D, 2)} €", "N"),
                            ("Marktmiete", f"{zahl(MIETE_M, 2)} €/m²", "Q"), ("Mietsteigerung", f"+{pz(K('annahme.mietsteigerung'))} p. a.", "A")],
        "Betrieb, Restwert": [("Mietausfall", pz(K('annahme.mietausfall')), "A"), ("Verwaltung", f"{zahl(K('annahme.objektverwaltung_je_wohnung'))} €/WE", "A"),
                            ("Instandhaltung", f"{zahl(K('annahme.instandhaltung_je_qm'), 2)} €/m²", "A"),
                            ("Kostensteigerung", f"+{pz(K('annahme.kostensteigerung'))} p. a.", "A"),
                            ("Projektkonto", f"{pz(K('annahme.guthabenzins'))} | {pz(K('annahme.sollzins'))}", "A"),
                            ("Restwert", "Ertragswert J. 35", "A"), ("Liegenschaftszins", pz(K('kern.liegenschaftszins_jahr35.A'), 1), "Q"),
                            ("Nutzungsdauer", f"{K('annahme.gesamtnutzungsdauer')} J.", "Q"),
                            ("Vergleichsmiete", f"{zahl(K('annahme.vergleichsmiete_jahr1'), 2)} €/m²", "Q"),
                            ("Kappungsgrenze", f"{pz(K('annahme.kappungsgrenze'))} in 3 J.", "G")],
    }
    for i, (name, zeilen) in enumerate(taf.items()):
        x = colX(1 + 3 * i)
        y = f.modulkopf(x, 2.10, span(3), name)
        f.tabelle(x, y - 0.08, [1.36, 1.08, 0.38], ["Annahme", "Wert", ""], [[a, b, c] for a, b, c in zeilen], pt=10, zh=0.25,
                  grau=lambda r, c, z=zeilen: z[r][2] == "N")
    f.hinweis(colX(1), 6.50, span(12), "R Richtlinie · G Gesetz · Q Quelle · P Projektdaten PGN · A Annahme der PGN · N neue Annahme der PGN. "
              "Ohne Ansatz: Finanzierungskosten, Bodenwert, Steuern, Bauphase.")
    f.speichere("15-annahmen.png")


def folie17():
    f = Folie("17", "3", "Modellrechnung", ["In A und B reicht die Höchstmiete für", f"DSCR 1,2, frei finanziert erst {zahl(MIETE_D, 2)} €"],
              f"{zahl(MIETE_D, 2)} €", "Miete und DSCR", quelle="Team 3 Vergleich D36:G41, Konzepte D62:H62, D14, H55")
    y = f.modulkopf(colX(1), 2.10, span(7), "Drei Mieten je Variante", "in € je m² und Monat, Jahr 1")
    f.legende(colX(1), y - 0.05, [("kostendeckende Anfangsmiete", BISHER), ("für DSCR 1,2", TINTE), ("Höchst- bzw. Marktmiete", "hatch")])
    ax = f.achse(colX(1) + 0.25, y + 0.30, span(7) - 0.3, 1.5)
    vv = ["A", "B", "C", "frei_dscr"]
    kd = [T(f"t3.miete.kostendeckend.{v}") for v in vv]
    md = [T(f"t3.miete.miete_dscr.{v}") for v in vv]
    mm = [T(f"t3.miete.miete_modell.{v}") for v in G3] + [MIETE_M]
    for j, (w, c, h) in enumerate([(kd, BISHER, None), (md, TINTE, None), (mm, "white", "////")]):
        xs = [i + (j - 1) * 0.26 for i in range(4)]
        ax.bar(xs, w, 0.24, color=c, hatch=h, edgecolor=BISHER if h else c, lw=0.5)
        for xx, ww in zip(xs, w):
            ax.text(xx, ww + 0.3, zahl(ww, 2), ha="center", fontsize=8.5, family="Montserrat", weight="bold", rotation=90, va="bottom")
    ax.set_xticks(range(4), ["Gruppe A", "Gruppe B", "Gruppe C", "Frei finanziert"])
    ax.set_ylim(0, 24)
    ax.set_yticks([0, 5, 10, 15, 20])
    dscr = [K(f"n5.dscr_jahr1.{v}") for v in ["A", "B", "C", "frei_markt"]]
    ab = [T(f"t3.miete.abstand_dscr.{v}") for v in ["A", "B", "C", "frei_markt"]]
    f.tabelle(colX(1), 4.95, [2.5, 1.1, 1.1, 1.1, 1.1], ["", "A", "B", "C", "Frei"],
              [["DSCR Jahr 1 (Höchst-/Marktmiete)"] + [zahl(d, 2) for d in dscr],
               ["Abstand zur Miete für DSCR 1,2"] + [("+" if a > 0 else "") + zahl(a, 2) + " €" for a in ab]], zh=0.26)
    f.hinweis(colX(1), 6.50, span(7), f"Gruppe C liegt in Jahr 1 bis 3 bei {zahl(dscr[2], 2)}. Ab Jahr 4 liegt sie bei "
              f"{zahl(K('zr.dscr.C')[3], 2)}. Ein Zahlungsüberschuss von {eur(K('n5.zue_jahr1.C'))} bleibt auch in Jahr 1.")
    f.stichpunkte(colX(8), 2.10, span(5), [
        ("Für welches Darlehen gilt 1,2", [f"Frei: Bankdarlehen {mio(K('n5.bankdarlehen.frei_dscr'))}, Annahme der PGN",
                                           "Gefördert kein Bankdarlehen: DSCR misst das NBank-Darlehen, 1,2 nur Vergleich"]),
        ("Was die NBank prüft", [f"Eigenmittel mindestens {pz(K('annahme.eigenmittel_mindestens'))}", "keine Überkompensation",
                                 f"Tilgung eines Bankdarlehens mindestens {pz(K('annahme.tilgung_bank_mindestens'))}"])])
    f.speichere("17-miete-dscr.png")


def linien(f, x, y, w, h, reihe, ymin, ymax, bis=35, fmt=lambda v: zahl(v), marke=None):
    ax = f.achse(x, y, w, h)
    for v in V:
        werte = [r for r in reihe(v)[:bis]]
        js = [j + 1 for j, r in enumerate(werte) if r is not None]
        c, ls = LS[v]
        ax.plot(js, [r for r in werte if r is not None], color=c, ls=ls, lw=2)
    ax.set_xlim(0.5, bis + 0.5)
    ax.set_ylim(ymin, ymax)
    ax.set_xticks([1, 5, 10, 15, 20, 25, 30, 35])
    fmt_ax(ax, fmt)
    if marke is not None:
        ax.axhline(marke, color=REF, ls=(0, (4, 3)), lw=1)
    return ax


def folie18():
    f = Folie("18", "3", "Modellrechnung", ["Ab Jahr 4 liegt die DSCR von A bis C", "über 1,2, frei zur Marktmiete ab Jahr 11"], "Jahr 4",
              "DSCR", quelle="Konzepte Zeitreihe H, Q, Z, AR, AI 7:41; Konzepte D71:H73")
    y = f.modulkopf(colX(1), 2.10, span(7), "DSCR je Jahr, Jahr 1 bis 35", "Überschuss vor Kapitaldienst ÷ Kapitaldienst")
    f.legende(colX(1), y - 0.05, [(KURZ[v], v) for v in V])
    ax = linien(f, colX(1) + 0.35, y + 0.30, span(7) - 0.4, 2.35, lambda v: K(f"zr.dscr.{v}"), 0.8, 3.5, fmt=lambda v: zahl(v, 1), marke=1.2)
    ax.axvline(30, color=REF, ls=":", lw=1)
    ax.text(14, 1.13, "1,2: DSCR-Ziel der Bank (frei, Annahme der PGN)", va="top", fontsize=9, family="Work Sans", color=GRAU)
    ax.text(29.5, 3.3, "Jahr 30: Bankdarlehen getilgt", fontsize=9, family="Work Sans", color=GRAU, ha="right")
    unter, mn = k5("n5.jahre_dscr_unter_ziel"), k5("n5.dscr_min_1_35")
    o = [R("mietanpassung_gefoerdert_0", f"dscr_min_1_35.{g}") for g in G3]
    f.hinweis(colX(1), 6.50, span(7), f"Ohne Mieterhöhung in der Bindung fällt die DSCR gefördert bis auf {bar(o, lambda v: zahl(v, 2))}; "
              f"unter 1,2 dann {bar([R('mietanpassung_gefoerdert_0', f'jahre_dscr_unter_ziel.{g}') for g in G3], zahl)} Jahre.")
    f.stichpunkte(colX(8), 2.10, span(5), [
        ("Ergebnis", [f"Jahre unter 1,2: {bar(unter, zahl)}", f"Minimum: {bar(mn, lambda v: zahl(v, 2))}"]),
        ("Annahmen", [f"Gefördert alle 3 Jahre +{pz(K('annahme.mieterhoehung_in_der_bindung'), 2)}", f"Frei +{pz(K('annahme.mietsteigerung'))} p. a.",
                      "Frei ab Jahr 31 ohne Kapitaldienst"])])
    f.speichere("18-dscr-verlauf.png")


def folie19():
    f = Folie("19", "3", "Modellrechnung", ["Kein Jahr mit Fehlbetrag in A, B und C,", f"frei zur Marktmiete fehlen {zahl(-K('n5.zue_jahr1.frei_markt'))} €"],
              "Kein Jahr mit Fehlbetrag", "Liquidität", quelle="Konzepte Zeitreihe F, O, X, AP, AG 7:41; Konzepte D61:H70")
    y = f.modulkopf(colX(1), 2.10, span(7), "Zahlungsüberschuss je Jahr, Jahr 1 bis 35", "in Tsd. € p. a., nach Kapitaldienst, vor Steuern")
    f.legende(colX(1), y - 0.05, [(KURZ[v], v) for v in V])
    ax = linien(f, colX(1) + 0.35, y + 0.30, span(7) - 0.4, 2.35, lambda v: [z / 1000 for z in K(f"zr.zue.{v}")], -25, 325, fmt=lambda v: zahl(v), marke=0)
    ax.axvline(30.5, color=REF, ls=":", lw=1)
    ax.text(30, 300, "ab Jahr 31 frei\nohne Kapitaldienst", fontsize=9, family="Work Sans", color=GRAU, ha="right", va="top")
    fb, kt = k5("n5.jahre_fehlbetrag_1_35"), k5("n5.projektkonto_tiefststand")
    f.hinweis(colX(1), 6.50, span(7), f"Frei liegt nur zur Miete {zahl(MIETE_D, 2)} € klar vorn, {pz(K('n2.aufschlag_marktmiete'), 1)} über der Marktmiete. "
              f"Ohne Mietsteigerung hätte frei zur Marktmiete {zahl(R('mietsteigerung_0', 'jahre_fehlbetrag_1_35.frei_markt'))} Jahre mit Fehlbetrag.")
    f.stichpunkte(colX(8), 2.10, span(5), [
        ("Ergebnis", [f"Jahre mit Fehlbetrag: {bar(fb, zahl)}", f"Tiefster Stand Projektkonto: {bar(kt, zahl)} €",
                      f"Jahr 1: {bar(k5('n5.zue_jahr1'), zahl)} €"]),
        ("Annahmen", [f"Gefördert alle 3 Jahre +{pz(K('annahme.mieterhoehung_in_der_bindung'), 2)}", f"Frei +{pz(K('annahme.mietsteigerung'))} p. a.",
                      f"Kosten +{pz(K('annahme.kostensteigerung'))} p. a."])])
    f.speichere("19-liquiditaet.png")


def gruppen(f, x, y, w, h, a, b, la, lb, ymax, fmt, schritt):
    ax = f.achse(x, y, w, h)
    for j, (werte, c, hh) in enumerate([(a, TINTE, None), (b, "white", "////")]):
        xs = [i + (j - 0.5) * 0.34 for i in range(5)]
        ax.bar(xs, werte, 0.32, color=c, hatch=hh, edgecolor=BISHER if hh else c, lw=0.5)
        for xx, ww in zip(xs, werte):
            ax.text(xx, ww + ymax * 0.015, fmt(ww), ha="center", fontsize=9, family="Montserrat", weight="bold")
    ax.set_xticks(range(5), [KURZ[v] for v in V])
    ax.set_ylim(0, ymax)
    ax.set_yticks([i * schritt for i in range(int(ymax / schritt) + 1)])
    fmt_ax(ax, lambda v: zahl(v))
    return ax


def folie21():
    f = Folie("21", "3", "Modellrechnung", ["Das Haus bringt gefördert 1,7 bis 2,8 %,", "frei finanziert 4,5 bis 5,5 % in Jahr 1"], "1,7 bis 2,8 %",
              "Objektrendite", quelle="Konzepte D87:H88, D59:H59, D43:H44; Team 3 Vergleich D44:F44, D52:H52")
    y = f.modulkopf(colX(1), 2.10, span(7), "Objektrendite Jahr 1", "Überschuss vor Kapitaldienst ÷ Gesamtkosten, in %")
    f.legende(colX(1), y - 0.05, [("Nenner Gesamtkosten", TINTE), ("Nenner ohne Zuschuss", "hatch")])
    o1, o2 = k5("n5.objektrendite"), k5("n5.objektrendite_nach_zuschuss")
    gruppen(f, colX(1) + 0.3, y + 0.30, span(7) - 0.35, 1.5, [v * 100 for v in o1], [v * 100 for v in o2], "", "", 6.5, lambda v: zahl(v, 1), 1)
    f.tabelle(colX(1), 4.95, [2.0, 0.98, 0.98, 0.98, 0.98, 0.98], ["", "A", "B", "C", "Frei 18,36", "Frei 15,42"],
              [["Objektrendite Jahr 35"] + [pz(v, 1) for v in t5("t3.rueckfluss.objektrendite_jahr35")]], zh=0.26)
    am = [T(f"t3.miete.anteil_markt.{g}") for g in G3]
    f.hinweis(colX(1), 6.50, span(7), f"Die Höchstmiete liegt bei {bar(am, pz)} der Marktmiete. Das begrenzt die Objektrendite gefördert. "
              f"Frei {pz(o1[3], 1)} nur zur Miete {zahl(MIETE_D, 2)} €, zur Marktmiete {pz(o1[4], 1)}.")
    f.stichpunkte(colX(8), 2.10, span(5), [
        ("Rechnung", ["Überschuss vor Kapitaldienst ÷ Gesamtkosten, unabhängig von der Finanzierung",
                      f"Jahr 1: {bar(k5('n5.uevk_jahr1'), lambda v: zahl(v / 1000))} Tsd. €"]),
        ("Lesart", [f"Ohne Zuschuss im Nenner steigt A von {pz(o1[0], 1)} auf {pz(o2[0], 1)}", "Frei hängt die Objektrendite nur an der Miete"])])
    f.speichere("21-objektrendite.png")


def folie22():
    f = Folie("22", "3", "Modellrechnung", ["Mit Restwert bringt das Eigenkapital", "gefördert 7,05 bis 7,40 %, frei bis 8,93 %"], "7,05 bis 7,40 %",
              "Eigenkapitalrendite", quelle="Konzepte D76:H83, D14; Läufe mietsteigerung_0, anschlusszins_plus_1 (Konzepte D81:H81)")
    y = f.modulkopf(colX(1), 2.10, span(7), "Eigenkapitalrendite über 35 Jahre", "VOFI, vor Steuern, in %")
    f.legende(colX(1), y - 0.05, [("mit Restwert", TINTE), ("ohne Restwert", "hatch")])
    m, o = k5("n5.ek_vofi_mit_restwert"), k5("n5.ek_vofi_ohne_restwert")
    gruppen(f, colX(1) + 0.3, y + 0.30, span(7) - 0.35, 1.35, [v * 100 for v in m], [v * 100 for v in o], "", "", 10, lambda v: zahl(v, 2), 2)
    f.tabelle(colX(1), 4.80, [2.0, 0.98, 0.98, 0.98, 0.98, 0.98], ["", "A", "B", "C", "Frei 18,36", "Frei 15,42"],
              [["Anteil Restwert"] + [pz(v) for v in k5("n5.restwertanteil")],
               ["Restwert J. 35, Mio. €"] + [zahl(v / 1e6, 2) for v in k5("n5.restwert_jahr35")]], zh=0.25)
    ms = r5("mietsteigerung_0", "ek_vofi_mit_restwert")
    f.hinweis(colX(1), 6.50, span(7), f"Ohne Steigerung der Marktmiete (wirkt auch auf den Restwert): frei {pz(ms[3], 2)} bzw. {pz(ms[4], 2)}, gefördert {bar(ms[:3], lambda v: pz(v, 2))}. "
              f"Anschlusszins +1 Punkt: frei {pz(R('anschlusszins_plus_1', 'ek_vofi_mit_restwert.frei_dscr'), 2)} bzw. "
              f"{pz(R('anschlusszins_plus_1', 'ek_vofi_mit_restwert.frei_markt'), 2)}.")
    f.stichpunkte(colX(8), 2.10, span(5), [
        ("Rechnung", ["VOFI über 35 Jahre, vor Steuern", "Restwert: Ertragswert aus der Marktmiete, gefördert mit Abschlag"]),
        ("Frei vorn, weil", [f"Miete {zahl(MIETE_D, 2)} € liegt {pz(K('n2.aufschlag_marktmiete'), 1)} über dem Markt",
                             f"Mieten steigen um {pz(K('annahme.mietsteigerung'))} im Jahr"])])
    f.speichere("22-ek-rendite.png")


def folie24():
    f = Folie("24", "3", "Modellrechnung", ["Gefördert hängt das Ergebnis an Tilgung", "und Kosten, frei finanziert an der Miete"], "an der Miete",
              "Risiken", quelle="Konzepte D68:H73 je Lauf (laeufe/<lauf>.xlsx), Konzepte H49")
    laeufe = [("Basis", None), ("Tilgung 2,90 %", "tilgung_2_90"), ("Tilgung 3,65 %", "tilgung_3_65"), ("Kosten 4.631 €/m²", "kosten_4631"),
              ("Kosten 5.460 €/m²", "kosten_5460"), ("keine Mieterhöhung gef.", "mietanpassung_gefoerdert_0"),
              ("keine Mietsteigerung frei", "mietsteigerung_0"), ("Anschlusszins +1 Punkt", "anschlusszins_plus_1")]
    zeilen = []
    for name, l in laeufe:
        fb = k5("n5.jahre_fehlbetrag_1_35") if l is None else r5(l, "jahre_fehlbetrag_1_35")
        md = K("n5.miete_dscr_ziel.frei_dscr") if l is None else R(l, "miete_dscr_ziel.frei_dscr")
        du = K("n5.jahre_dscr_unter_ziel.frei_dscr") if l is None else R(l, "jahre_dscr_unter_ziel.frei_dscr")
        zeilen.append([name, zahl(fb[0]), zahl(fb[1]), zahl(fb[2]), zahl(fb[4]), zahl(md, 2) + " €", zahl(du)])
    y = f.modulkopf(colX(1), 2.10, span(8), "Jahre mit Fehlbetrag, Jahr 1 bis 35", "je Lauf eine Annahme geändert")
    f.tabelle(colX(1), y - 0.06, [2.2, 0.7, 0.7, 0.7, 1.05, 1.45, 1.12], ["Lauf", "A", "B", "C", "Frei 15,42", "Frei 18,36: Miete", "Jahre < 1,2"], zeilen, zh=0.30,
              grau=lambda r, c, z=zeilen: 1 <= c <= 4 and z[r][c] != "0")
    ma = [R("mietanpassung_gefoerdert_0", f"ek_vofi_mit_restwert.{g}") for g in G3]
    f.hinweis(colX(1), 6.50, span(8), f"Ohne Mieterhöhung in der Bindung sinkt die Eigenkapitalrendite mit Restwert gefördert auf {bar(ma, lambda v: pz(v, 2))}. Alle Läufe in A9 und A10.")
    f.stichpunkte(colX(9), 2.10, span(4), [
        ("Gefördert", ["Tilgung und Kosten verschieben die Liquidität", "ohne Mieterhöhung jedes Jahr ein Überschuss"]),
        ("Frei finanziert", [f"Kosten heben die Miete für DSCR 1,2 auf {zahl(R('kosten_4631', 'miete_dscr_ziel.frei_dscr'), 2)} bzw. "
                             f"{zahl(R('kosten_5460', 'miete_dscr_ziel.frei_dscr'), 2)} €",
                             f"ohne Mietsteigerung {zahl(R('mietsteigerung_0', 'jahre_fehlbetrag_1_35.frei_markt'))} Jahre Fehlbetrag zur Marktmiete"])])
    f.speichere("24-risiken.png")


def anhangA6():
    f = Folie("A6", "A", "Anhang", [f"Jahr 1: in A bleiben {zahl(T('t3.jr1.zue.A'))} €, frei finanziert {zahl(T('t3.jr1.zue.frei_dscr'))} €"], None,
              "Jahresrechnung", papier=False, anhang=True, quelle="Team 3 Vergleich D6:H18, Konzepte D57:F57")
    pos = [("Sollmiete", "sollmiete"), ("− Mietausfall", "mietausfall"), ("− Objektverwaltung", "objektverwaltung"), ("− Instandhaltung", "instandhaltung"),
           ("= Überschuss vor Kapitaldienst", "uevk"), ("− Verwaltungskostenbeitrag", "vkb"), ("− Zins NBank-Darlehen bzw. Bankdarlehen", "zins"),
           ("− Tilgung", "tilgung"), ("= Zahlungsüberschuss", "zue"), ("Kapitaldienst", "kapitaldienst"), ("DSCR", "dscr")]
    zeilen = [[n] + [zahl(T(f"t3.jr1.{k}.{v}"), 2 if k == "dscr" else 0) for v in V] for n, k in pos]
    f.tabelle(colX(1), 1.62, [4.6, 1.48, 1.48, 1.48, 1.48, 1.48], ["Position, € p. a."] + [f"{KURZ[v]}" for v in V], zeilen, zh=0.33, rot_zeile=8)
    f.hinweis(colX(1), 6.50, span(12), f"Einmalig, außerhalb von Jahr 1: Bearbeitungsentgelte {bar([K(f'n5.bearbeitungsentgelte.{g}') for g in G3], zahl)} €.")
    f.speichere("A6-jahresrechnung.png")


def anhangA7():
    f = Folie("A7", "A", "Anhang", [f"Ende Jahr 35: gefördert bis {zahl(max(K(f'n5.restschuld_jahr35.{g}') for g in G3) / 1e6, 2)} Mio. € Restschuld, frei keine"], None,
              "Ende der Bindung", papier=False, anhang=True, quelle="Konzepte D75:H96, Konzepte Zeitreihe H42, Q42, Z42")
    y = f.modulkopf(colX(1), 1.50, span(7), "Vermögen Ende Jahr 35", "in Mio. €: Restwert + Projektkonto − Restschuld")
    ax = f.achse(colX(1) + 0.3, y + 0.15, span(7) - 0.35, 2.75)
    rw, rs, vm = k5("n5.restwert_jahr35"), k5("n5.restschuld_jahr35"), k5("n5.vermoegen_jahr35")
    konto = k5("n5.projektkonto_jahr35")  # Konzepte D77:H77; Vermögen = Restwert + Projektkonto − Restschuld (Zeile 78)
    ax.bar(range(5), [r / 1e6 for r in rw], 0.5, color=REF)
    ax.bar(range(5), [k / 1e6 for k in konto], 0.5, bottom=[r / 1e6 for r in rw], color=TINTE)
    ax.bar(range(5), [-r / 1e6 for r in rs], 0.5, color=BISHER)
    for i in range(5):
        ax.text(i, (rw[i] + konto[i]) / 1e6 + 0.2, zahl(vm[i] / 1e6, 1), ha="center", fontsize=10, family="Montserrat", weight="bold")
    ax.axhline(0, color=TINTE, lw=1)
    ax.set_xticks(range(5), [KURZ[v] for v in V])
    ax.set_ylim(-1, 13)
    f.legende(colX(1), 5.42, [("Restwert", REF), ("Projektkonto", TINTE), ("Restschuld", BISHER)])
    d36 = [K(f"zr.dscr.{g}")[35] for g in G3]
    f.tabelle(colX(8), 1.50, [2.85, 0.67, 0.67, 0.67], ["Jahr 36 bis 42", "A", "B", "C"],
              [["Zins NBank ab Jahr 36", pz(K("annahme.zins_nbank_ab_jahr36"), 2), "", ""],
               ["DSCR Jahr 36"] + [zahl(v, 2) for v in d36],
               ["Zahlungsüberschuss, Tsd. €"] + [zahl(K(f"n5.zue_summe_36_42.{g}") / 1000) for g in G3],
               ["Restschuld Jahr 42"] + [zahl(K(f"n5.restschuld_jahr42.{g}")) for g in G3],
               ["Vermögen Jahr 42, Mio. €"] + [zahl(K(f"n5.vermoegen_jahr42.{g}") / 1e6, 2) for g in G3],
               ["Eigenkapitalrendite, 42 Jahre"] + [pz(K(f"n5.ek_vofi_mit_restwert_jahr42.{g}"), 2) for g in G3]], zh=0.30)
    f.hinweis(colX(1), 6.50, span(12), "Frei finanziert ist das Bankdarlehen nach Jahr 30 getilgt (jährliche Annuität über 30 Jahre). Gefördert läuft das NBank-Darlehen bis Jahr 42.")
    f.speichere("A7-ende-bindung.png")


def anhangA8():
    f = Folie("A8", "A", "Anhang", [f"Objekt-IRR nach Förderbarwert: A {pz(T('t3.irr.irr_nach_foerderbarwert_mit_restwert.A'), 2)}, frei "
                                    f"{pz(T('t3.irr.irr_nach_foerderbarwert_mit_restwert.frei_markt'), 2)} bis {pz(T('t3.irr.irr_nach_foerderbarwert_mit_restwert.frei_dscr'), 2)}"],
              None, "Rendite", papier=False, anhang=True, quelle="Team 3 Vergleich D121:H125, Konzepte D81:H88")
    zeilen = [["Objekt-IRR ohne Zuschuss, mit Restwert"] + [pz(v, 2) for v in t5("t3.irr.irr_ohne_zuschuss_mit_restwert")],
              ["Objekt-IRR nach Zuschuss, mit Restwert"] + [pz(v, 2) for v in t5("t3.irr.irr_nach_zuschuss_mit_restwert")],
              ["Objekt-IRR nach Förderbarwert, mit Restwert"] + [pz(v, 2) for v in t5("t3.irr.irr_nach_foerderbarwert_mit_restwert")],
              ["Objekt-IRR ohne Zuschuss, ohne Restwert"] + [pz(v, 2) for v in t5("t3.irr.irr_ohne_zuschuss_ohne_restwert")],
              ["Objekt-IRR nach Zuschuss, ohne Restwert"] + [pz(v, 2) for v in t5("t3.irr.irr_nach_zuschuss_ohne_restwert")],
              ["Eigenkapitalrendite (VOFI) mit Restwert"] + [pz(v, 2) for v in k5("n5.ek_vofi_mit_restwert")],
              ["Eigenkapitalrendite (VOFI) ohne Restwert"] + [pz(v, 2) for v in k5("n5.ek_vofi_ohne_restwert")],
              ["Objektrendite Jahr 1 (Folie 21)"] + [pz(v, 1) for v in k5("n5.objektrendite")]]
    f.tabelle(colX(1), 1.62, [4.6, 1.48, 1.48, 1.48, 1.48, 1.48], ["Lesart"] + [KURZ[v] for v in V], zeilen, zh=0.36)
    f.hinweis(colX(1), 6.50, span(12), "Die Mappe nennt ihre Objektrendite einen Objekt-IRR über 35 Jahre (Übersicht 5.1 bis 5.9). Folie 21 rechnet die statische Größe des Auftrags.")
    f.speichere("A8-rendite-lesarten.png")


LAEUFE = [("Basis", None), ("Tilgung 2,90 %", "tilgung_2_90"), ("Tilgung 3,65 %", "tilgung_3_65"), ("Kosten 4.631 €/m²", "kosten_4631"),
          ("Kosten 5.460 €/m²", "kosten_5460"), ("ohne Mieterhöhung gef.", "mietanpassung_gefoerdert_0"), ("ohne Mietsteigerung", "mietsteigerung_0"),
          ("Anschlusszins +1", "anschlusszins_plus_1"), ("Anschlusszins −1", "anschlusszins_minus_1")]


def lw(l, p, nk=0, f=zahl):
    werte = k5(f"n5.{p}") if l is None else r5(l, p)
    return [f(v, nk) if isinstance(v, (int, float)) else str(v) for v in werte]


def anhangA9():
    f = Folie("A9", "A", "Anhang", [f"Bei 5.460 € je m² hat A {zahl(R('kosten_5460', 'jahre_fehlbetrag_1_35.A'))} Jahre mit Fehlbetrag, frei "
                                    f"{zahl(R('kosten_5460', 'jahre_fehlbetrag_1_35.frei_markt'))}"], None, "Risiken Liquidität", papier=False, anhang=True,
              quelle="Konzepte D61:H73 je Lauf (laeufe/<lauf>.xlsx)")
    zeilen = []
    for name, l in LAEUFE:
        fb = lw(l, "jahre_fehlbetrag_1_35")
        du = lw(l, "jahre_dscr_unter_ziel")
        zeilen.append([name] + [f"{fb[i]} / {du[i]}" for i in range(5)] + [zahl(K('n5.miete_dscr_ziel.frei_dscr') if l is None else R(l, 'miete_dscr_ziel.frei_dscr'), 2)])
    f.tabelle(colX(1), 1.62, [3.0, 1.4, 1.4, 1.4, 1.6, 1.6, 1.6], ["Lauf", "A", "B", "C", "Frei 18,36", "Frei 15,42", "Miete DSCR 1,2"], zeilen, zh=0.34)
    f.hinweis(colX(1), 6.50, span(12), "Je Zelle: Jahre mit Fehlbetrag / Jahre mit DSCR unter 1,2, Jahr 1 bis 35. Die letzte Spalte nennt die Miete für DSCR 1,2 frei finanziert; die Bank bemisst sie je Lauf neu.")
    f.speichere("A9-risiken-liquiditaet.png")


def anhangA10():
    f = Folie("A10", "A", "Anhang", [f"Ohne Mieterhöhung sinkt die Rendite in A auf {pz(R('mietanpassung_gefoerdert_0', 'ek_vofi_mit_restwert.A'), 2)}"], None,
              "Risiken Rendite", papier=False, anhang=True, quelle="Konzepte D78:H82 je Lauf (laeufe/<lauf>.xlsx)")
    zeilen = []
    for name, l in LAEUFE:
        m = lw(l, "ek_vofi_mit_restwert", 2, lambda v, nk: pz(v, nk))
        zeilen.append([name] + m + [zahl((K("n5.vermoegen_jahr35.A") if l is None else R(l, "vermoegen_jahr35.A")) / 1e6, 2)])
    f.tabelle(colX(1), 1.62, [3.0, 1.4, 1.4, 1.4, 1.6, 1.6, 1.6], ["Lauf", "A", "B", "C", "Frei 18,36", "Frei 15,42", "Vermögen A, Mio. €"], zeilen, zh=0.34)
    f.hinweis(colX(1), 6.50, span(12), f"Eigenkapitalrendite mit Restwert, 35 Jahre, vor Steuern. In den Kostenläufen steigt frei 18,36 € die Rendite, weil die Bank eine höhere Miete ansetzt "
              f"({zahl(R('kosten_4631', 'miete_dscr_ziel.frei_dscr'), 2)} bzw. {zahl(R('kosten_5460', 'miete_dscr_ziel.frei_dscr'), 2)} €). Das ist eine Bedingung, kein Vorteil.")
    f.speichere("A10-risiken-rendite.png")


# ==========================================================================================================================
# Broschüre: A4 hoch, Satzspiegel 180 × 259 mm, zwölf Spalten
MM = 1 / 25.4


class Seite:
    BW, BH = 210 * MM, 297 * MM
    RAND_L, RAND_O, SW, SH = 15 * MM, 19 * MM, 180 * MM, 259 * MM
    STEG = 4 * MM

    def __init__(self, blatt, bogen, kolumne, titel):
        self.fig = plt.figure(figsize=(self.BW, self.BH), dpi=150)
        self.fig.patch.set_facecolor("white")
        self.ax = self.fig.add_axes([0, 0, 1, 1])
        self.ax.set_xlim(0, self.BW)
        self.ax.set_ylim(self.BH, 0)
        self.ax.axis("off")
        a = self.ax
        self.cw = (self.SW - 11 * self.STEG) / 12
        for k in range(12):
            a.add_patch(Rectangle((self.sx(k + 1), self.RAND_O), self.cw, self.SH, fc="#7FA7D9", alpha=0.07, lw=0))
        a.add_patch(Rectangle((self.RAND_L, self.RAND_O), self.SW, self.SH, fill=False, ec="#7FA7D9", lw=0.5, ls=":"))
        self.t(self.RAND_L, self.RAND_O - 0.30, kolumne.upper(), 7, "Montserrat", "bold", GRAU)
        self.t(self.RAND_L + self.SW, self.RAND_O - 0.30, f"SKIZZE · Blatt {blatt} · Bogenseite {bogen}", 7, "Montserrat", "bold", "#7FA7D9", ha="right")
        a.plot([self.RAND_L, self.RAND_L + 0.4], [self.RAND_O + 0.02, self.RAND_O + 0.02], color=ROT, lw=2)
        self.t(self.RAND_L, self.RAND_O + 0.10, titel, 17, "Montserrat", "black", TINTE)
        self.t(self.RAND_L + self.SW, self.RAND_O + self.SH + 0.20, str(bogen), 8, ha="right", c=GRAU)

    def sx(self, k):
        return self.RAND_L + (k - 1) * (self.cw + self.STEG)

    def sw(self, n):
        return n * self.cw + (n - 1) * self.STEG

    def t(self, x, y, s, pt=8.5, fam="Work Sans", w="normal", c=TINTE, ha="left", va="top"):
        return self.ax.text(x, y, s, fontsize=pt, family=fam, weight=w, color=c, ha=ha, va=va)

    def modul(self, x, y, w, titel, sub=None):
        self.ax.plot([x, x + w], [y, y], color=TINTE, lw=1)
        self.t(x, y + 0.05, titel, 10, "Montserrat", "bold")
        if sub:
            self.t(x, y + 0.24, sub, 7.5, c=GRAU)
        return y + (0.42 if sub else 0.26)

    def tabelle(self, x, y, breiten, kopf, zeilen, pt=7.5, zh=0.17, rot=None):
        xs = [x]
        for b in breiten:
            xs.append(xs[-1] + b)
        for j, k in enumerate(kopf):
            self.t(xs[j + 1] - 0.04 if j else xs[0], y, k.upper(), 6.5, "Work Sans", "medium", GRAU, ha="right" if j else "left")
        y += 0.17
        self.ax.plot([x, xs[-1]], [y, y], color=TINTE, lw=0.6)
        for i, z in enumerate(zeilen):
            if rot == i:
                self.ax.add_patch(Rectangle((x, y), xs[-1] - x, zh, fc=ROT, lw=0))
            for j, s in enumerate(z):
                self.t(xs[j + 1] - 0.04 if j else xs[0] + 0.03, y + zh / 2, s, pt, "Montserrat" if j else "Work Sans", "bold" if j else "normal",
                       "white" if rot == i else TINTE, ha="right" if j else "left", va="center")
            y += zh
            self.ax.plot([x, xs[-1]], [y, y], color=LINIE, lw=0.4)
        return y

    def kasten(self, x, y, w, titel, zeilen, h=None):
        n = int(w / 0.058)
        tz = sum(len(textwrap.wrap(z, n)) for z in zeilen)
        h = h or 0.30 + 0.15 * tz
        self.ax.add_patch(Rectangle((x, y), w, h, fc=PAPIER, lw=0))
        self.t(x + 0.10, y + 0.08, titel, 9, "Montserrat", "bold")
        yy = y + 0.30
        for z in zeilen:
            for zz in textwrap.wrap(z, n):
                self.t(x + 0.10, yy, zz, 7.5)
                yy += 0.15
        return y + h

    def achse(self, x, y, w, h):
        ax = self.fig.add_axes([x / self.BW, 1 - (y + h) / self.BH, w / self.BW, h / self.BH])
        ax.set_facecolor("none")
        for s in ["top", "right", "left"]:
            ax.spines[s].set_visible(False)
        ax.tick_params(labelsize=6.5, colors=GRAU, length=0)
        ax.grid(axis="y", color=LINIE, lw=0.4)
        ax.set_axisbelow(True)
        return ax

    def legende(self, x, y, eintraege, pt=7):
        r = self.fig.canvas.get_renderer()
        for t, art in eintraege:
            if art in LS:
                c, ls = LS[art]
                self.ax.plot([x, x + 0.22], [y + 0.05, y + 0.05], color=c, ls=ls, lw=1.4)
            else:
                self.ax.add_patch(Rectangle((x, y), 0.18, 0.10, fc="white" if art == "hatch" else art, lw=0.4 if art == "hatch" else 0,
                                            hatch="////" if art == "hatch" else None, ec=BISHER if art == "hatch" else None))
            tt = self.t(x + 0.26, y + 0.05, t, pt, va="center")
            x += 0.26 + tt.get_window_extent(r).width / 150 + 0.14

    def speichere(self, name):
        self.fig.savefig(os.path.join(BROSCH, name), facecolor="white")
        plt.close(self.fig)


def blatt9():
    s = Seite(9, 10, "Modellrechnung · Varianten und Annahmen", "3,0 Mio. €, vier Varianten,\nrund 0,6 Mio. € Eigenkapital in jeder")
    y0 = s.RAND_O + 0.95
    y = s.modul(s.sx(1), y0, s.sw(6), "Finanzierung je Variante", "in Mio. €")
    ax = s.achse(s.sx(1) + 0.15, y + 0.05, s.sw(6) - 0.2, 3.0)
    vv = ["A", "B", "C", "frei_dscr"]
    b = [0] * 4
    for werte, c, h in [([K("kern.eigenmittel.frei_markt")] * 4, "white", "////"), ([K(f"n5.zuschuss.{v}") if v in G3 else 0 for v in vv], ROT, None),
                        ([K(f"n5.darlehen_nbank.{v}") if v in G3 else 0 for v in vv], TINTE, None), ([K(f"n5.bankdarlehen.{v}") for v in vv], REF, None)]:
        ax.bar(range(4), [w / 1e6 for w in werte], 0.55, bottom=b, color=c, hatch=h, edgecolor=BISHER if h else c, lw=0.4)
        for i, w in enumerate(werte):
            if w:
                ax.text(i, b[i] + w / 2e6, zahl(w / 1e6, 2), ha="center", va="center", fontsize=6.5, family="Montserrat", weight="bold", color=TINTE if c == "white" else "white")
        b = [b[i] + werte[i] / 1e6 for i in range(4)]
    ax.set_xticks(range(4), ["A", "B", "C", "Frei"])
    ax.set_ylim(0, 3.2)
    s.kasten(s.sx(7), y0, s.sw(6), "Das Modellhaus",
             [f"{zahl(K('annahme.wohnungen'))} Wohnungen, {zahl(K('annahme.wohnflaeche'))} m², Neu Wulmstorf, Mietenstufe VI",
              f"Herstellungskosten {zahl(K('annahme.herstellungskosten_qm'))} € je m², Gesamtkosten {mio(K('n5.gesamtkosten.A'))}",
              f"Zuschuss je Wohnung {bar([K(f'n5.zuschuss.{g}') / K('annahme.wohnungen') for g in G3], zahl)} €",
              f"Eigenmittel je Wohnung {zahl(K('kern.eigenmittel.A') / K('annahme.wohnungen'))} €",
              f"Eingesetztes Eigenkapital {bar(k5('n5.eigenkapital')[:4], zahl)} €"], h=3.45)
    y = s.modul(s.sx(1), y0 + 3.85, s.sw(12), "Annahmen mit Wert und Herkunft", "R Richtlinie · G Gesetz · Q Quelle · P Projektdaten · A Annahme der PGN · N neue Annahme der PGN")
    taf = [("Haus", [("Herstellungskosten", f"{zahl(K('annahme.herstellungskosten_qm'))} €/m²", "P"), ("Bemessungsgrenze", f"{zahl(K('annahme.bemessungsgrenze_VI'))} €/m²", "R"),
                     ("Grundstück", "0 €", "P"), ("Bezug", str(K('annahme.bezugsjahr')), "A")]),
           ("Förderung", [("Darlehen", bar([K(f'annahme.quote_darlehen.{g}') for g in G3], pz), "R"), ("Zuschuss", bar([K(f'annahme.quote_zuschuss.{g}') for g in G3], pz), "R"),
                          ("Höchstmiete", bar([K(f'annahme.hoechstmiete_VI.{g}') for g in G3], lambda v: zahl(v, 2)), "R"),
                          ("Mieterhöhung", f"+{pz(K('annahme.mieterhoehung_in_der_bindung'), 2)}/{K('annahme.abstand_mieterhoehungen')} J.", "R, A"),
                          ("Zins bis Jahr 35", pz(K('annahme.zins_nbank_bis_jahr35')), "R"), ("Zins ab Jahr 36", pz(K('annahme.zins_nbank_ab_jahr36'), 2), "A"),
                          ("Tilgung", pz(K('annahme.tilgung_nbank'), 2), "A"),
                          ("Verwaltungskostenbeitrag", pz(K('annahme.verwaltungskostenbeitrag'), 1), "R"),
                          ("Eigenmittel", f"mind. {pz(K('annahme.eigenmittel_mindestens'))}", "R"), ("Bindung", f"{K('annahme.bindung')} Jahre", "R")]),
           ("Frei finanziert", [("Zins", pz(K('annahme.zins_bank'), 2), "Q"), ("Zinsbindung", f"{K('annahme.zinsbindung')} Jahre", "A"),
                                ("Anschlusszins", pz(K('annahme.anschlusszins'), 2), "A"),
                                ("Tilgung", f"Annuität {K('annahme.laufzeit_bank')} J.", "A"),
                                ("Mietsteigerung", f"+{pz(K('annahme.mietsteigerung'))} p. a.", "A"),
                                ("DSCR der Bank", f"{zahl(K('n1.dscr_ziel_bank_frei'), 1)}", "N"), ("Miete DSCR 1,2", f"{zahl(MIETE_D, 2)} €", "N"),
                                ("Marktmiete", f"{zahl(MIETE_M, 2)} €", "Q")]),
           ("Betrieb, Restwert", [("Mietausfall", pz(K('annahme.mietausfall')), "A"), ("Verwaltung", f"{zahl(K('annahme.objektverwaltung_je_wohnung'))} €/WE", "A"),
                                ("Instandhaltung", f"{zahl(K('annahme.instandhaltung_je_qm'), 2)} €/m²", "A"), ("Kosten", f"+{pz(K('annahme.kostensteigerung'))} p. a.", "A"),
                                ("Projektkonto", f"{pz(K('annahme.guthabenzins'))} | {pz(K('annahme.sollzins'))}", "A"),
                                ("Restwert", "Ertragswert J. 35", "A"), ("Liegenschaftszins", pz(K('kern.liegenschaftszins_jahr35.A'), 1), "Q"),
                                ("Vergleichsmiete", f"{zahl(K('annahme.vergleichsmiete_jahr1'), 2)} €", "Q")])]
    for i, (n, z) in enumerate(taf):
        x, yy = s.sx(1 + 6 * (i % 2)), y + (i // 2) * 2.2
        s.t(x, yy, n, 8.5, "Montserrat", "bold")
        s.tabelle(x, yy + 0.20, [s.sw(6) * 0.50, s.sw(6) * 0.38, s.sw(6) * 0.12], ["Annahme", "Wert", ""], [[a, b, c] for a, b, c in z], pt=7.5)
    s.t(s.RAND_L, s.RAND_O + s.SH - 0.15, "Zellen: Konzepte D52:H57, D6:D13; Übersicht D19:G19, D24:F25, D106; Eingaben; Tabellen", 6, c=GRAU)
    s.speichere("blatt-09.png")


def blatt10():
    s = Seite(10, 11, "Modellrechnung · Jahr 1", "Gefördert kein Euro Zins,\nfrei finanziert 9,21 € je m²")
    y0 = s.RAND_O + 0.95
    y = s.modul(s.sx(1), y0, s.sw(7), "Jahr 1 je m² und Monat", "herein, hinaus, was bleibt")
    s.legende(s.sx(1), y, [("Bewirtschaftung", HELL), ("Verwaltungskostenbeitrag", BISHER), ("Zins", REF), ("Tilgung", TINTE), ("Zahlungsüberschuss", "hatch")], pt=6.5)
    y += 0.20
    ax = s.achse(s.sx(1) + 0.55, y + 0.05, s.sw(7) - 0.6, 2.4)
    ax.grid(axis="x", color=LINIE, lw=0.4)
    ax.grid(axis="y", visible=False)
    seg = [("bewirtschaftung", HELL), ("vkb", BISHER), ("zins", REF), ("tilgung", TINTE), ("zue", "white")]
    for i, v in enumerate(V):
        x0 = 0
        for k, c in seg:
            w = max(0, T(f"t3.qm.{k}.{v}"))
            ax.barh(4 - i, w, 0.6, left=x0, color=c, hatch="////" if k == "zue" else None, edgecolor=BISHER if k == "zue" else c, lw=0.4)
            if w > 1.6 and k != "zue":
                ax.text(x0 + w / 2, 4 - i, zahl(w, 2), ha="center", va="center", fontsize=6, family="Montserrat", weight="bold", color="white" if c in (REF, TINTE) else TINTE)
            x0 += w
        z = T(f"t3.qm.zue.{v}")
        ax.text(x0 + 0.2, 4 - i, ("bleibt " if z >= 0 else "fehlen ") + zahl(abs(z), 2), va="center", fontsize=6, family="Montserrat", weight="bold")
    ax.axvline(MIETE_M, color=REF, ls=(0, (3, 2)), lw=0.8)
    ax.text(MIETE_M - 0.25, 4.55, f"Marktmiete {zahl(MIETE_M, 2)} €", ha="right", va="bottom", fontsize=6.5, family="Work Sans", color=GRAU)
    ax.set_ylim(-0.5, 4.9)
    ax.set_xlabel("Miete je m² und Monat in €", fontsize=6.5, family="Work Sans", color=GRAU)
    ax.set_yticks(range(5), [f"{KURZ[v]}" for v in reversed(V)], fontsize=6.5)
    ax.set_xlim(0, 22)
    y = s.modul(s.sx(8), y0, s.sw(5), "Mieten im Vergleich", "€ je m², Jahr 1")
    s.tabelle(s.sx(8), y, [s.sw(5) * 0.52] + [s.sw(5) * 0.12] * 4, ["", "A", "B", "C", "Frei"],
              [["kostendeckende Anfangsmiete"] + [zahl(T(f"t3.miete.kostendeckend.{v}"), 2) for v in V[:4]],
               ["für DSCR 1,2"] + [zahl(T(f"t3.miete.miete_dscr.{v}"), 2) for v in V[:4]],
               ["Höchst-/Marktmiete"] + [zahl(T(f"t3.miete.miete_modell.{g}"), 2) for g in G3] + [zahl(MIETE_M, 2)],
               ["DSCR Jahr 1"] + [zahl(K(f"n5.dscr_jahr1.{v}"), 2) for v in ["A", "B", "C", "frei_markt"]]], pt=7)
    y = s.modul(s.sx(1), y0 + 3.45, s.sw(12), "Jahresrechnung Jahr 1", "in € p. a.")
    pos = [("Sollmiete", "sollmiete"), ("− Mietausfall", "mietausfall"), ("− Objektverwaltung", "objektverwaltung"), ("− Instandhaltung", "instandhaltung"),
           ("= Überschuss vor Kapitaldienst", "uevk"), ("− Verwaltungskostenbeitrag", "vkb"), ("− Zins", "zins"), ("− Tilgung", "tilgung"),
           ("= Zahlungsüberschuss", "zue"), ("Kapitaldienst", "kapitaldienst"), ("DSCR", "dscr")]
    yt = s.tabelle(s.sx(1), y, [s.sw(12) * 0.35] + [s.sw(12) * 0.13] * 5, ["Position"] + [KURZ[v] for v in V],
                   [[n] + [zahl(T(f"t3.jr1.{k}.{v}"), 2 if k == "dscr" else 0) for v in V] for n, k in pos], rot=8)
    s.kasten(s.sx(1), yt + 0.25, s.sw(12), "DSCR 1,2: für welches Darlehen?",
             [f"Frei finanziert: für das Bankdarlehen {mio(K('n5.bankdarlehen.frei_dscr'))}, Annahme der PGN. Daraus die Miete {zahl(MIETE_D, 2)} €.",
              "Gefördert gibt es kein Bankdarlehen. Die NBank prüft Eigenmittel, angemessenen Gewinn und keine Überkompensation.",
              f"Gruppe C liegt in Jahr 1 bis 3 bei {zahl(K('n5.dscr_jahr1.C'), 2)}, ein Zahlungsüberschuss bleibt."])
    s.t(s.RAND_L, s.RAND_O + s.SH - 0.15, "Zellen: Team 3 Vergleich D6:H41; Konzepte D50:H62, D12:D14, H55", 6, c=GRAU)
    s.speichere("blatt-10.png")


def blatt11():
    s = Seite(11, 12, "Modellrechnung · Zeitverlauf und Risiken", "Gefördert ist das Eigenkapital nach\n22 bis 23 Jahren zurück")
    y0 = s.RAND_O + 0.95
    s.legende(s.sx(1), y0 - 0.22, [(NAME[v], v) for v in V])
    for (kspalte, titel, sub, reihe, lo, hi) in [(1, "Zahlungsüberschuss je Jahr", "in Tsd. € p. a.", lambda v: [z / 1000 for z in K(f"zr.zue.{v}")[:35]], -25, 325),
                                                 (7, "Eigenkapital zurück", "kumuliert in % des Eigenkapitals", lambda v: [q * 100 for q in T(f"t3.zr.rueckfluss.{v}")[1:36]], 0, 700)]:
        y = s.modul(s.sx(kspalte), y0, s.sw(6), titel, sub)
        ax = s.achse(s.sx(kspalte) + 0.25, y + 0.05, s.sw(6) - 0.3, 2.4)
        for v in V:
            c, ls = LS[v]
            ax.plot(range(1, 36), reihe(v), color=c, ls=ls, lw=1.2)
        ax.set_ylim(lo, hi)
        ax.set_xticks([1, 10, 20, 30, 35])
        if kspalte == 7:
            ax.axhline(100, color=REF, lw=0.8)
            ax.text(1.5, 108, "Eigenkapital zurück", fontsize=6, family="Work Sans", color=GRAU, va="bottom")
        else:
            ax.axhline(0, color=REF, lw=0.6, ls=(0, (3, 2)))
    y = s.modul(s.sx(1), y0 + 3.15, s.sw(12), "Kennzahlen im Vergleich", f"Jahr 1 bis 35 · Frei {zahl(MIETE_D, 2)} €: Miete für DSCR {zahl(K('n1.dscr_ziel_bank_frei'), 1)} (Annahme der PGN) · Frei {zahl(MIETE_M, 2)} €: Marktmiete")
    z = [["Jahre mit Fehlbetrag"] + [zahl(v) for v in k5("n5.jahre_fehlbetrag_1_35")],
         ["Tiefster Stand Projektkonto, €"] + [zahl(v) for v in k5("n5.projektkonto_tiefststand")],
         ["DSCR Minimum"] + [zahl(v, 2) for v in k5("n5.dscr_min_1_35")],
         ["Jahre DSCR unter 1,2"] + [zahl(v) for v in k5("n5.jahre_dscr_unter_ziel")],
         ["Eigenkapital zurück in Jahr"] + [zahl(v) for v in k5("n5.jahr_ek_erreicht")],
         ["Objektrendite Jahr 1"] + [pz(v, 1) for v in k5("n5.objektrendite")],
         ["Objektrendite ohne Zuschuss"] + [pz(v, 1) for v in k5("n5.objektrendite_nach_zuschuss")],
         ["Eigenkapitalrendite mit Restwert"] + [pz(v, 2) for v in k5("n5.ek_vofi_mit_restwert")],
         ["Eigenkapitalrendite ohne Restwert"] + [pz(v, 2) for v in k5("n5.ek_vofi_ohne_restwert")],
         ["Restschuld Ende Jahr 35, €"] + [zahl(v) for v in k5("n5.restschuld_jahr35")],
         ["Vermögen Ende Jahr 35, Mio. €"] + [zahl(v / 1e6, 2) for v in k5("n5.vermoegen_jahr35")]]
    yt = s.tabelle(s.sx(1), y, [s.sw(12) * 0.35] + [s.sw(12) * 0.13] * 5, ["Kennzahl"] + [KURZ[v] for v in V], z)
    y = s.modul(s.sx(1), yt + 0.25, s.sw(12), "Risiken kompakt", "Jahre mit Fehlbetrag; frei 18,36 €: Miete für DSCR 1,2")
    rz = []
    for n, l in [("Kosten 4.631 €/m²", "kosten_4631"), ("Kosten 5.460 €/m²", "kosten_5460"), ("Tilgung 3,65 %", "tilgung_3_65"), ("ohne Mietsteigerung", "mietsteigerung_0")]:
        fb = r5(l, "jahre_fehlbetrag_1_35")
        rz.append([n, zahl(fb[0]), zahl(fb[1]), zahl(fb[2]), zahl(R(l, "miete_dscr_ziel.frei_dscr"), 2), zahl(fb[4])])
    s.tabelle(s.sx(1), y, [s.sw(12) * 0.35] + [s.sw(12) * 0.13] * 5, ["Lauf", "A", "B", "C", "Frei 18,36: Miete", "Frei 15,42"], rz)
    s.t(s.RAND_L, s.RAND_O + s.SH - 0.15, "Zellen: Konzepte D61:H88, Konzepte Zeitreihe; Team 3 Vergleich D66:H101; Läufe N6 Konzepte D49:H73", 6, c=GRAU)
    s.speichere("blatt-11.png")


if __name__ == "__main__":
    os.makedirs(BROSCH, exist_ok=True)
    for fn in [folie13, folie14, folie15, folie17, folie18, folie19, folie21, folie22, folie24, anhangA6, anhangA7, anhangA8, anhangA9, anhangA10,
               blatt9, blatt10, blatt11]:
        fn()
        print("ok", fn.__name__)
