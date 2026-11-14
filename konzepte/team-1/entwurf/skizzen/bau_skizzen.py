#!/usr/bin/env python3
"""Skizzen Team 1 „Geldfluss“: übrige Folien von Kapitel 3 und Anhang (16:9) sowie Broschüre Blatt 9 bis 11 (A4 hoch).

Jede Zahl kommt aus konzepte/mappe/werte_konzepte.json (Lauf „konzepte“ und Laufkopien) oder konzepte/team-1/mappe/werte_team.json;
keine Zahl steht von Hand im Skript (Achsgrenzen und Maße ausgenommen). Die Skizzen zeigen Raster, Titel, Lage der Elemente und die echten
Zahlen; sie sind keine fertigen Folien (die fertigen Entwürfe baut entwurf.cjs).

Aufruf:  python bau_skizzen.py            schreibt folie-*.png hierher und ../broschuere/blatt-*.png
"""
import json
import os
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import Rectangle, Circle

HIER = Path(__file__).resolve().parent
TEAM = HIER.parent.parent
KONZEPTE = TEAM.parent
for f in Path(os.path.expanduser("~/.fonts")).rglob("*.ttf"):
    font_manager.fontManager.addfont(str(f))
MONT, WORK = "Montserrat", "Work Sans"

# ---- Farben des Vortrags ----------------------------------------------------------------------------------------------
TINTE, ROT, REF, GRAU3, LICHT, PAPIER, FL3, LINIE, HELL = "#202020", "#B71E3F", "#77716B", "#B4B0AB", "#D8D4CF", "#F4F3F2", "#E9E7E4", "#CFCCC8", "#626160"
FARBE = {"A": TINTE, "B": TINTE, "C": REF, "frei_dscr": GRAU3}
STRICH = {"A": "-", "B": "--", "C": "-", "frei_dscr": ":"}
NAME = {"A": "A", "B": "B", "C": "C", "frei_dscr": "frei"}
V = ["A", "B", "C", "frei_dscr"]
G = ["A", "B", "C"]

# ---- Zahlen ------------------------------------------------------------------------------------------------------------
_K = json.loads((KONZEPTE / "mappe" / "werte_konzepte.json").read_text(encoding="utf8"))
_T = json.loads((TEAM / "mappe" / "werte_team.json").read_text(encoding="utf8"))["werte"]
BELEGE = []


def K(schluessel, lauf="konzepte"):
    w = _K["laeufe"][lauf]["werte"]
    e = w[schluessel] if lauf == "konzepte" else w[f"n6.{lauf}.{schluessel}"]
    BELEGE.append((lauf, schluessel, e["blatt"], e["zelle"]))
    return e["wert"]


def T(schluessel):
    e = _T[schluessel]
    BELEGE.append(("team1", schluessel, e["blatt"], e["zelle"]))
    return e["wert"]


def de(v, nk=0):
    s = f"{abs(v):,.{nk}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return ("−" if v < 0 and round(abs(v), nk) != 0 else "") + s


def eur(v, nk=0):
    return de(v, nk) + " €"


def proz(v, nk=0):
    return de(v * 100, nk) + " %"


def mio(v, nk=1):
    return de(v / 1e6, nk) + " Mio. €"


# ---- Folie 16:9 ----------------------------------------------------------------------------------------------------------
W, H = 13.333, 7.5
X0, CW = 0.667, 12.0


def colX(k):
    return X0 + (k - 1) * 1.02


def span(n):
    return n * 1.02 - 0.24


class Folie:
    def __init__(self, nr, abschnitt, zeichen, titel, akzent, rubrik, papier=True, anhang=False):
        self.fig = plt.figure(figsize=(W, H), dpi=100)
        self.ax = self.fig.add_axes([0, 0, 1, 1])
        ax = self.ax
        ax.set_xlim(0, W); ax.set_ylim(H, 0); ax.axis("off")
        grund = PAPIER if papier else "#FFFFFF"
        self.fig.patch.set_facecolor(grund)
        ax.add_patch(Rectangle((0.30, 0.30), W - 0.60, H - 0.60, fill=False, lw=1.2, ec=TINTE))
        # Raster: zwölf Spalten, Inhaltszone
        y0 = 1.50 if anhang else 2.10
        for k in range(1, 13):
            ax.add_patch(Rectangle((colX(k), y0), 0.78, 6.50 - y0, fc="#B71E3F", alpha=0.035, lw=0))
        ax.plot([X0, X0 + CW], [6.50, 6.50], color=ROT, lw=0.4, ls=(0, (2, 3)), alpha=0.5)
        # Kopf
        ax.add_patch(Circle((X0 + 0.15, 0.59), 0.15, fill=False, ec=TINTE, lw=1))
        ax.text(X0 + 0.15, 0.60, zeichen, ha="center", va="center", fontsize=10, family=MONT, weight="bold", color=TINTE)
        ax.text(X0 + 0.42, 0.60, abschnitt.upper(), va="center", fontsize=11, family=MONT, weight="bold", color=TINTE)
        # Titel (Versalien, Signaturwort rot)
        if anhang:
            ax.text(X0, 1.05, titel[0].upper(), fontsize=20, family=MONT, weight="black", color=TINTE, va="center")
        else:
            ax.plot([0.52, 0.52], [0.92, 1.95], color=ROT, lw=3)
            for i, z in enumerate(titel):
                self._titelzeile(X0, 1.15 + i * 0.52, z.upper(), akzent.upper())
        # Schriftfeld
        ax.plot([0.30, W - 0.30], [6.72, 6.72], color=TINTE, lw=1)
        ax.text(0.55, 6.96, "PGN", fontsize=22, family=MONT, color=ROT, va="center")
        ax.text(2.40, 6.86, "Mietwohnraumförderung Niedersachsen 2026", fontsize=9, family=WORK, color=HELL, va="center")
        ax.text(2.40, 7.04, rubrik.upper(), fontsize=9, family=MONT, weight="bold", color=TINTE, va="center")
        ax.text(12.85, 6.86, "Blatt", fontsize=9, family=WORK, color=HELL, va="center", ha="right")
        ax.text(12.85, 7.04, nr, fontsize=13, family=MONT, weight="black", color=TINTE, va="center", ha="right")
        ax.text(7.2, 6.96, "SKIZZE · Team 1 Geldfluss", fontsize=9, family=MONT, weight="bold", color=ROT, va="center", ha="center")
        if not anhang:
            ax.add_patch(Rectangle((W - 0.42, 2.10), 0.42, 0.62, fc=ROT, lw=0))
            ax.text(W - 0.21, 2.41, "2.1", fontsize=9, family=MONT, weight="bold", color="white", ha="center", va="center")

    def _titelzeile(self, x, y, zeile, akzent):
        teile = zeile.split(akzent) if akzent and akzent in zeile else [zeile]
        r = self.fig.canvas.get_renderer()
        for i, t in enumerate(teile):
            for txt, farbe, stil in ([(t, TINTE, "normal")] + ([(akzent, ROT, "italic")] if i < len(teile) - 1 else [])):
                if not txt:
                    continue
                h = self.ax.text(x, y, txt, fontsize=27, family=MONT, weight="black", color=farbe, style=stil, va="center")
                bb = h.get_window_extent(renderer=r)
                x += bb.width / self.fig.dpi

    # ---- Bausteine -----------------------------------------------------------------------------------------------------
    def modulkopf(self, x, y, w, titel, sub=None):
        self.ax.plot([x, x + w], [y, y], color=TINTE, lw=1.6)
        self.ax.text(x, y + 0.23, titel, fontsize=14, family=MONT, weight="bold", color=TINTE, va="center")
        if sub:
            self.ax.text(x, y + 0.55, sub, fontsize=11, family=WORK, color=HELL, va="center")
            return y + 0.78
        return y + 0.46

    def hinweis(self, x, y_unten, w, text, zeilen=2):
        h = 0.18 + 0.22 * zeilen
        self.ax.add_patch(Rectangle((x, y_unten - h), w, h, fc=FL3, lw=0))
        self.ax.add_patch(Circle((x + 0.24, y_unten - h + 0.2), 0.09, fill=False, ec=TINTE, lw=0.8))
        self.ax.text(x + 0.24, y_unten - h + 0.2, "i", fontsize=8, ha="center", va="center", family=WORK)
        self.ax.text(x + 0.48, y_unten - h + 0.09, text, fontsize=10.5, family=WORK, weight="light", color=TINTE, va="top", wrap=True)
        return y_unten - h

    def stichpunkte(self, x, y, w, gruppen):
        self.ax.plot([x, x + w], [y, y], color=TINTE, lw=1.6)
        yy = y + 0.25
        for titel, punkte in gruppen:
            self.ax.text(x, yy, titel, fontsize=14, family=MONT, weight="bold", color=TINTE, va="center")
            yy += 0.36
            for p in punkte:
                self.ax.add_patch(Rectangle((x, yy - 0.05), 0.09, 0.09, fc=TINTE, lw=0))
                n = p.count("\n") + 1
                self.ax.text(x + 0.22, yy - 0.11, p, fontsize=12, family=WORK, color=TINTE, va="top", linespacing=1.3)
                yy += 0.30 + (n - 1) * 0.25
            yy += 0.15
        return yy

    def tabelle(self, x, y, breiten, kopf, zeilen, pt=10.5, zh=0.27, ergebnis=None, hervor=None):
        xs = [x]
        for b in breiten:
            xs.append(xs[-1] + b)
        self.ax.plot([x, xs[-1]], [y + zh, y + zh], color=TINTE, lw=0.8)
        for j, k in enumerate(kopf):
            ha = "left" if j == 0 else "right"
            self.ax.text(xs[j] + 0.05 if j == 0 else xs[j + 1] - 0.05, y + zh / 2, k.upper(), fontsize=pt - 1.5, family=MONT, weight="bold", color=HELL, ha=ha, va="center")
        yy = y + zh
        for i, z in enumerate(zeilen):
            erg = ergebnis is not None and i == ergebnis
            if erg:
                self.ax.add_patch(Rectangle((x, yy), xs[-1] - x, zh, fc=ROT, lw=0))
            for j, c in enumerate(z):
                ha = "left" if j == 0 else "right"
                self.ax.text(xs[j] + 0.05 if j == 0 else xs[j + 1] - 0.05, yy + zh / 2, c, fontsize=pt, family=MONT if j else WORK,
                             weight="bold" if (j or erg) else "normal", color="white" if erg else TINTE, ha=ha, va="center")
            yy += zh
            self.ax.plot([x, xs[-1]], [yy, yy], color=LINIE, lw=0.5)
        return yy

    def gruppenkopf(self, x, y, breiten, gruppen, pt=9):
        """Kopf über mehreren Tabellenspalten: gruppen = [(text, erste Spalte, letzte Spalte)]."""
        xs = [x]
        for b in breiten:
            xs.append(xs[-1] + b)
        for text, a, b in gruppen:
            self.ax.text((xs[a] + xs[b + 1]) / 2, y, text, fontsize=pt, family=MONT, weight="bold", color=TINTE, ha="center", va="center")
            self.ax.plot([xs[a] + 0.08, xs[b + 1] - 0.08], [y + 0.13, y + 0.13], color=TINTE, lw=0.6)

    def diagramm(self, x, y, w, h):
        a = self.fig.add_axes([x / W, 1 - (y + h) / H, w / W, h / H])
        a.set_facecolor("none")
        for s in ("top", "right"):
            a.spines[s].set_visible(False)
        a.tick_params(labelsize=9, colors=HELL)
        for lab in a.get_xticklabels() + a.get_yticklabels():
            lab.set_family(WORK)
        a.grid(axis="y", color=LINIE, lw=0.5)
        return a

    def speichern(self, name):
        self.fig.savefig(HIER / name, dpi=100, facecolor=self.fig.get_facecolor())
        plt.close(self.fig)


def legende(ax, x, y, eintraege, pt=10):
    for text, farbe, art in eintraege:
        if art == "linie":
            ax.plot([x, x + 0.3], [y, y], color=farbe[0], lw=2.2, ls=farbe[1])
        else:
            ax.add_patch(Rectangle((x, y - 0.08), 0.28, 0.16, fc=farbe, lw=0, hatch="////" if art == "schraffur" else None, ec=HELL if art == "schraffur" else None))
        t = ax.text(x + 0.38, y, text, fontsize=pt, family=WORK, color=TINTE, va="center")
        x += 0.38 + len(text) * pt * 0.0078 + 0.25
    return x


def linien(a, reihen, jahre, achse, fmt):
    for v in V:
        if v in reihen:
            a.plot(jahre[: len(reihen[v])], reihen[v], color=FARBE[v], ls=STRICH[v], lw=2.2 if v != "C" else 1.8)
    a.set_ylim(*achse)
    a.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, p: fmt(v)))


# =========================================================================================================================
#  Folien
# =========================================================================================================================
def folie13():
    wohnungen, flaeche = K("annahme.wohnungen"), K("annahme.wohnflaeche")
    f = plt.figure(figsize=(W, H), dpi=100); ax = f.add_axes([0, 0, 1, 1]); ax.set_xlim(0, W); ax.set_ylim(H, 0); ax.axis("off")
    f.patch.set_facecolor(ROT)
    ax.add_patch(Circle((1.6, 3.2), 0.7, fill=False, ec="white", lw=2)); ax.text(1.6, 3.2, "3", color="white", fontsize=48, family=MONT, weight="black", ha="center", va="center")
    for i, z in enumerate(["MODELLRECHNUNG:", "ANNAHMEN, GELDFLUSS,", "RENDITE, RISIKEN"]):
        ax.text(2.8, 2.6 + i * 0.62, z, color="white", fontsize=34, family=MONT, weight="black", style="italic" if i else "normal", va="center")
    ax.text(2.8, 4.9, f"Ein PGN-Projekt in Neu Wulmstorf mit {wohnungen} Wohnungen und {de(flaeche)} m²,\ngefördert in drei Gruppen und frei finanziert.",
            color="white", fontsize=16, family=WORK, va="top", linespacing=1.4)
    ax.text(7.2, 6.96, "SKIZZE · Team 1 Geldfluss · Trenner (PGN_ABSCHNITT_ROT) · Eingaben!F9, F8", fontsize=9, family=MONT, weight="bold", color="white", ha="center")
    f.savefig(HIER / "folie-13-trenner.png", dpi=100, facecolor=ROT); plt.close(f)


def folie14():
    gk = K("n5.gesamtkosten.A"); em = K("kern.eigenmittel.A")
    s = Folie("14", "Modellrechnung", "3", ["Ein Haus, vier Finanzierungen:", f"{de(gk / 1e6, 1)} Mio. €, je {de(em / 1e6, 1)} Mio. € Eigenmittel"], "vier Finanzierungen", "Finanzierung")
    y = s.modulkopf(colX(1), 2.10, span(8), "Finanzierung je Variante, in Mio. €", "gleiche Gesamtkosten, gleiche Eigenmittel")
    legende(s.ax, colX(1), y + 0.05, [("Zuschuss", ROT, "f"), ("NBank-Darlehen", TINTE, "f"), ("Bankdarlehen", REF, "f"), ("Eigenmittel", "#DCD8D3", "schraffur")])
    hy = s.hinweis(colX(1), 6.50, span(8), f"Grundstück im Bestand, nicht angesetzt. Gefördert einmalig Bearbeitungsentgelte {' | '.join(de(K(f'n5.bearbeitungsentgelte.{g}')) for g in G)} €.\nFrei finanziert: Miete {eur(K('n5.miete_jahr1.frei_dscr'), 2)} für DSCR 1,2 · Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)}.")
    a = s.diagramm(colX(1) + 0.6, y + 0.35, span(8) - 0.8, hy - y - 0.75)
    zus = [K(f"n5.zuschuss.{g}") for g in G] + [0]; nb = [K(f"n5.darlehen_nbank.{g}") for g in G] + [0]
    bank = [0, 0, 0, K("n5.bankdarlehen.frei_dscr")]; emv = [K(f"kern.eigenmittel.{g}") for g in G] + [K("kern.eigenmittel.frei_markt")]
    lab = [NAME[v] for v in V]
    links = [0] * 4
    for werte, farbe, h in ((zus, ROT, None), (nb, TINTE, None), (bank, REF, None), (emv, "#DCD8D3", "////")):
        a.barh(lab, [v / 1e6 for v in werte], left=links, color=farbe, hatch=h, edgecolor=PAPIER if not h else HELL, height=0.55)
        for i, v in enumerate(werte):
            if v > 0:
                a.text(links[i] + v / 2e6, i, de(v / 1e6, 1), color="white" if farbe != "#DCD8D3" else TINTE, ha="center", va="center", fontsize=10, family=MONT, weight="bold")
        links = [l + v / 1e6 for l, v in zip(links, werte)]
    a.invert_yaxis(); a.set_xlim(0, 3.2); a.grid(False)
    s.stichpunkte(colX(9), 2.10, span(4), [("Gleich in allen vier", [f"{K('annahme.wohnungen')} Wohnungen, {de(K('annahme.wohnflaeche'))} m²", f"Herstellungskosten {eur(K('annahme.herstellungskosten_qm'))} je m²,\n{eur(gk)}", f"Eigenmittel {eur(em)}, {proz(K('annahme.eigenmittel_mindestens'))}"]),
                                           ("Verschieden", [f"gefördert {proz(K('kern.foerderung.A') / gk)} aus Zuschuss\nund NBank-Darlehen", f"frei Bankdarlehen {eur(K('n5.bankdarlehen.frei_dscr'))},\n{proz(K('annahme.zins_bank'), 2)}, jährliche Annuität\nüber {K('annahme.laufzeit_bank')} Jahre"])])
    s.speichern("folie-14-finanzierung.png")


def annahmen():
    """Alle Annahmen in drei Gruppen (Folie 15 und Broschüre Blatt 9): Annahme, Wert, Herkunft. DSCR 1,2 steht in Gruppe 3 an Stelle DSCR_ZEILE."""
    t1 = [("Mietenstufe, Effizienzhaus", f"{K('annahme.mietenstufe')}, EH 55", "Projekt"), ("Wohnungen, Wohnfläche", f"{K('annahme.wohnungen')}, {de(K('annahme.wohnflaeche'))} m²", "Projekt"),
          ("Herstellungskosten je m²", eur(K("annahme.herstellungskosten_qm")), "Projekt"), ("Finanzierungskosten KG 800", eur(K("annahme.finanzierungskosten_kg800")), "Annahme"),
          ("Grundstück (Bestand)", eur(K("annahme.grundstueck")), "Projekt"), ("Bezug", str(K("annahme.bezugsjahr")), "Annahme"), ("Mietausfall", proz(K("annahme.mietausfall")), "Annahme"),
          ("Objektverwaltung je Wohnung", eur(K("annahme.objektverwaltung_je_wohnung")), "Annahme"), ("Instandhaltung je m²", eur(K("annahme.instandhaltung_je_qm"), 2), "Annahme"),
          ("Kostensteigerung ab Jahr 2", proz(K("annahme.kostensteigerung")), "Annahme"), ("Zusätzliches Eigenkapital", eur(K("annahme.eigenkapital_zusatz")), "Annahme")]
    t2 = [("Darlehen höchstens", " | ".join(proz(K(f"annahme.quote_darlehen.{g}")) for g in G), "RL 5.3.3.1"), ("Zuschuss höchstens", " | ".join(proz(K(f"annahme.quote_zuschuss.{g}")) for g in G), "RL 5.3.3.2"),
          ("Eigenmittel mindestens", proz(K("annahme.eigenmittel_mindestens")), "RL 5.2.6"), ("Bemessungsgrenze je m²", eur(K("annahme.bemessungsgrenze_VI")), "RL 5.3.2.2"),
          ("Zins bis Jahr 35, danach", f"{proz(K('annahme.zins_nbank_bis_jahr35'))}, {proz(K('annahme.zins_nbank_ab_jahr36'), 2)}", "RL / Annahme"),
          ("Tilgung p. a., linear", proz(K("annahme.tilgung_nbank"), 2), "Annahme"), ("Tilgungsaufschub", f"{K('annahme.tilgungsaufschub')} Jahre", "Annahme"),
          ("Laufzeit NBank-Darlehen", f"{K('annahme.laufzeit_hoechstens')} Jahre", "RL 5.3.5"), ("Verwaltungskostenbeitrag", proz(K("annahme.verwaltungskostenbeitrag"), 1), "RL 12.7.1"),
          ("Bearbeitungsentgelte", f"{proz(K('annahme.bearbeitungsentgelt_darlehen'))} | {proz(K('annahme.bearbeitungsentgelt_zuschuss'), 2)}", "RL 12.7.2/3"),
          ("Höchstmiete A | B | C", " | ".join(de(K(f"annahme.hoechstmiete_VI.{g}"), 2) for g in G), "RL 5.4.4"),
          ("Erste Mieterhöhung nach", f"{K('annahme.jahre_ohne_mieterhoehung')} Jahren", "RL 5.4.5"),
          (f"Mieterhöhung alle {K('annahme.abstand_mieterhoehungen')} Jahre", proz(K("annahme.mieterhoehung_in_der_bindung"), 2), "RL 5.4.5"), ("Bindung", f"{K('annahme.bindung')} Jahre", "RL 5.4.1")]
    t3 = [("Zins Bankdarlehen", proz(K("annahme.zins_bank"), 2), "Quelle"), ("Zinsbindung", f"{K('annahme.zinsbindung')} Jahre", "Annahme"), ("Anschlusszins", proz(K("annahme.anschlusszins"), 2), "Annahme"),
          ("Jährliche Annuität über", f"{K('annahme.laufzeit_bank')} Jahre", "Annahme"), ("DSCR der Bank mindestens", de(K("annahme.dscr_ziel_bank_frei"), 1), "Annahme, neu"),
          ("Marktmiete", eur(K("annahme.marktmiete_jahr1"), 2), "Quelle"), ("Vergleichsmiete", eur(K("annahme.vergleichsmiete_jahr1"), 2), "Quelle"),
          ("Mietanpassung frei", proz(K("annahme.mietsteigerung")), "Annahme"), ("Projektkonto Haben | Soll", f"{proz(K('annahme.guthabenzins'))} | {proz(K('annahme.sollzins'))}", "Annahme"),
          ("Nutzungsdauer", f"{K('annahme.gesamtnutzungsdauer')} Jahre", "ImmoWertV"), ("Liegenschaftszins Jahr 35", proz(K("kern.liegenschaftszins_jahr35.A"), 2), "Quelle"),
          ("Kappungsgrenze in 3 Jahren", proz(K("annahme.kappungsgrenze")), "§ 558 BGB"), ("Miete nach Jahr 42", str(K("annahme.zielmiete")), "Annahme"),
          ("Veräußerungskosten", proz(K("annahme.veraeusserungskosten")), "Annahme")]
    return t1, t2, t3


DSCR_ZEILE = 4


def folie15():
    s = Folie("15", "Modellrechnung", "3", ["Alle Annahmen auf einem Blatt,", "neu ist nur DSCR 1,2 der Bank"], "DSCR 1,2", "Annahmen")
    t1, t2, t3 = annahmen()
    assert t3[DSCR_ZEILE][0].startswith("DSCR")
    for k, (titel, rows) in zip((1, 5, 9), (("Haus und Betrieb", t1), ("Förderung, Programmteil 2.1", t2), ("Bank, Markt, Restwert", t3))):
        y = s.modulkopf(colX(k), 2.10, span(4), titel)
        yy = s.tabelle(colX(k), y - 0.05, [1.80, 1.04, 1.00], ["Annahme", "Wert", "Herkunft"], [list(r) for r in rows], pt=8.5, zh=0.22)
        if k == 9:
            s.ax.add_patch(Circle((colX(9) - 0.12, y - 0.05 + 0.22 * (DSCR_ZEILE + 1.5)), 0.09, fc=ROT, lw=0))
    s.hinweis(colX(1), 6.50, span(12), f"Projekt: Daten des PGN-Projekts. Annahme: Setzung der PGN ohne Vorgabe. RL: Nummer der Förderrichtlinie. Gerechnet vor Steuern, ab Bezug, nominal.\n"
              f"Aus DSCR 1,2 folgt die Miete frei finanziert: {eur(K('n5.miete_jahr1.frei_dscr'), 2)} je m² · Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)}. Alle Werte stehen in der Rechenmappe.")
    s.speichern("folie-15-annahmen.png")


def folie18():
    s = Folie("18", "Modellrechnung", "3", ["Gefördert reicht die Höchstmiete in A und B,", f"frei finanziert {eur(T('t1.abstand_dscr_miete_marktmiete.frei_dscr'), 2)} über der Marktmiete"],
              eur(T("t1.abstand_dscr_miete_marktmiete.frei_dscr"), 2), "Mieten", True)
    y = s.modulkopf(colX(1), 2.10, span(7), "Miete Jahr 1 je Variante", "in € je m² und Monat")
    legende(s.ax, colX(1), y + 0.05, [("kostendeckend (Zeile 9 = 0)", LICHT, "f"), ("für DSCR 1,2", TINTE, "f"), ("angesetzt", REF, "f")])
    txt = ("Die Bank verlangt DSCR 1,2 für das Bankdarlehen frei finanziert. Gefördert gibt es\nim Modellhaus kein Bankdarlehen: 1,2 ist dort nur Vergleichszahl. Die NBank prüft\n"
           "Eigenmittel, Bemessungsgrenze, Höchstmiete und angemessenen Gewinn.")
    hy = s.hinweis(colX(1), 6.50, span(7), txt, 3)
    a = s.diagramm(colX(1) + 0.45, y + 0.45, span(7) - 0.6, hy - y - 0.85)
    kd = [T(f"t1.kostendeckende_anfangsmiete.{v}") for v in V]; d12 = [K(f"n5.miete_dscr_ziel.{v}") for v in V]; an = [K(f"n5.miete_jahr1.{v}") for v in V]
    import numpy as np
    yy = np.arange(4)
    for j, (werte, farbe) in enumerate(((kd, LICHT), (d12, TINTE), (an, REF))):
        a.barh(yy + (j - 1) * 0.26, werte, height=0.24, color=farbe)
        for i, v in enumerate(werte):
            a.text(v + 0.2, i + (j - 1) * 0.26, de(v, 2), va="center", fontsize=8.5, family=MONT, weight="bold", color=TINTE)
    mm = K("annahme.marktmiete_jahr1")
    a.axvline(mm, color=REF, ls="--", lw=1); a.text(mm + 0.1, -0.6, f"Marktmiete {eur(mm, 2)}", fontsize=9, family=WORK, color=REF)
    a.set_yticks(yy); a.set_yticklabels([NAME[v] for v in V]); a.invert_yaxis(); a.set_xlim(0, 22); a.grid(axis="x", color=LINIE, lw=0.5); a.grid(axis="y", visible=False)
    yt = s.modulkopf(colX(8), 2.10, span(5), "DSCR Jahr 1, angesetzte Miete")
    yt = s.tabelle(colX(8), yt - 0.05, [1.4, 0.86, 0.86, 0.86, 0.86], ["", "A", "B", "C", "frei"], [["DSCR"] + [de(K(f"n5.dscr_jahr1.{v}"), 2) for v in V]], pt=10)
    s.stichpunkte(colX(8), yt + 0.25, span(5), [("Ergebnis", ["A und B über 1,2", f"C {de(K('n5.dscr_jahr1.C'), 2)}: {eur(K('n5.miete_dscr_ziel.C'), 2)} wären nötig,\nerlaubt {eur(K('n5.miete_jahr1.C'), 2)}",
                                                           f"frei {eur(K('n5.miete_jahr1.frei_dscr'), 2)}, {proz(K('n2.aufschlag_marktmiete'), 1)} über\nder Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)}"]),
                                               ("Einordnung C", [f"trägt sich: {eur(K('n5.zue_jahr1.C'))} in Jahr 1", f"ab Jahr {K('n5.jahre_dscr_unter_ziel.C') + 1} über 1,2"])])
    s.speichern("folie-18-mieten.png")


def reihe(k, bis=35):
    return [v for v in K(k)[:bis]]


def folie19():
    s = Folie("19", "Modellrechnung", "3", [f"Ab Jahr {K('n5.jahre_dscr_unter_ziel.C') + 1} liegen alle vier über DSCR 1,2,", f"C bis Jahr {K('n5.jahre_dscr_unter_ziel.C')} knapp darunter"], f"Jahr {K('n5.jahre_dscr_unter_ziel.C') + 1}", "DSCR")
    y = s.modulkopf(colX(1), 2.10, span(7), "DSCR je Jahr", "Überschuss vor Kapitaldienst ÷ Kapitaldienst")
    legende(s.ax, colX(1), y + 0.05, [(NAME[v], (FARBE[v], STRICH[v]), "linie") for v in V])
    hy = s.hinweis(colX(1), 6.50, span(7), f"Gefördert: DSCR auf den Kapitaldienst des NBank-Darlehens, Vergleichszahl. Frei finanziert:\nMiete {eur(K('n5.miete_jahr1.frei_dscr'), 2)} für DSCR 1,2 · Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)}.")
    a = s.diagramm(colX(1) + 0.55, y + 0.35, span(7) - 0.7, hy - y - 0.75)
    jahre = list(range(1, 36))
    r = {v: [x for x in reihe(f"zr.dscr.{v}") if x is not None] for v in V}
    linien(a, r, jahre, (0.5, 3.5), lambda v: de(v, 1))
    a.axhline(K("annahme.dscr_ziel_bank_frei"), color=REF, ls="--", lw=1); a.text(34.5, 1.05, "DSCR 1,2 der Bank, gilt nur frei finanziert", fontsize=8.5, family=WORK, color=REF, ha="right")
    a.set_xlim(1, 35); a.set_xticks([1, 5, 10, 15, 20, 25, 30, 35])
    j30 = len(r["frei_dscr"]); a.plot([j30], [r["frei_dscr"][-1]], "o", color=GRAU3); a.text(j30 + 0.4, r["frei_dscr"][-1] - 0.32, "Bankdarlehen getilgt", fontsize=8.5, family=WORK, ha="center")
    s.stichpunkte(colX(8), 2.10, span(5), [("Ergebnis", [f"Jahre unter 1,2: {' | '.join(str(K(f'n5.jahre_dscr_unter_ziel.{v}')) for v in V)}",
                                                         f"C: {de(K('n5.dscr_jahr1.C'), 2)} in Jahr 1 bis {K('n5.jahre_dscr_unter_ziel.C')}, {de(K('zr.dscr.C')[3], 2)} ab Jahr 4",
                                                         f"tiefster Wert: {' | '.join(de(K(f'n5.dscr_min_1_35.{v}'), 2) for v in V)}",
                                                         f"frei ab Jahr {T('t1.letztes_jahr_kapitaldienst.frei_dscr') + 1} ohne Kapitaldienst,\ngefördert bis Jahr {T('t1.letztes_jahr_kapitaldienst.A')}"])])
    s.speichern("folie-19-dscr-verlauf.png")


def folie20():
    s = Folie("20", "Modellrechnung", "3", ["Kein Jahr mit Fehlbetrag: In A wächst der", f"Zahlungsüberschuss auf {eur(K('n5.zue_jahr35.A'))}"], eur(K("n5.zue_jahr35.A")), "Liquidität")
    y = s.modulkopf(colX(1), 2.10, span(7), "Zahlungsüberschuss je Jahr", "in Tsd. € p. a., Jahr 1 bis 35")
    legende(s.ax, colX(1), y + 0.05, [(NAME[v], (FARBE[v], STRICH[v]), "linie") for v in V])
    hy = s.hinweis(colX(1), 6.50, span(7), f"Frei finanziert: Miete {eur(K('n5.miete_jahr1.frei_dscr'), 2)} für DSCR 1,2 · Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)}; vorn nur mit dieser\nMiete und {proz(K('annahme.mietsteigerung'))} Mietanpassung p. a. Ohne Mietanpassung siehe Folie 24.")
    a = s.diagramm(colX(1) + 0.55, y + 0.35, span(7) - 0.7, hy - y - 0.75)
    r = {v: [x / 1e3 for x in reihe(f"zr.zue.{v}")] for v in V}
    linien(a, r, list(range(1, 36)), (0, 350), lambda v: de(v))
    a.set_xlim(1, 35); a.set_xticks([1, 5, 10, 15, 20, 25, 30, 35])
    a.annotate("Bankdarlehen getilgt", (31, r["frei_dscr"][30]), (24, 300), fontsize=8.5, family=WORK, arrowprops=dict(arrowstyle="-", color=REF, lw=0.5))
    yt = s.modulkopf(colX(8), 2.10, span(5), "Liquidität Jahr 1 bis 35")
    rows = [["Jahre mit Fehlbetrag"] + [str(K(f"n5.jahre_fehlbetrag_1_35.{v}")) for v in V], ["tiefster Stand Projektkonto"] + [de(K(f"n5.projektkonto_tiefststand.{v}")) for v in V],
            ["kleinster Zahlungsüberschuss"] + [de(K(f"n5.zue_min_1_35.{v}")) for v in V], ["kumuliert Ende Jahr 35, Mio."] + [de(K(f"n5.kum_jahr35.{v}") / 1e6, 2) for v in V]]
    yt = s.tabelle(colX(8), yt - 0.05, [2.14, 0.68, 0.68, 0.68, 0.68], ["in €", "A", "B", "C", "frei"], rows, pt=9.5)
    s.stichpunkte(colX(8), yt + 0.25, span(5), [("Annahmen", [f"gefördert alle 3 Jahre +{proz(K('annahme.mieterhoehung_in_der_bindung'), 2)}", f"frei +{proz(K('annahme.mietsteigerung'))} p. a.",
                                                            f"Bewirtschaftung ab Jahr 2 +{proz(K('annahme.kostensteigerung'))} p. a."])])
    s.speichern("folie-20-liquiditaet.png")


def folie21():
    jz = {v: K(f"n5.jahr_ek_erreicht.{v}") for v in V}
    s = Folie("21", "Modellrechnung", "3", ["Gefördert ist das Eigenkapital nach", f"{min(jz[g] for g in G)} bis {max(jz[g] for g in G)} Jahren zurück, frei nach {jz['frei_dscr']}"],
              f"{min(jz[g] for g in G)} bis {max(jz[g] for g in G)} Jahren", "Rückfluss")
    y = s.modulkopf(colX(1), 2.10, span(7), "Rückfluss des Eigenkapitals", "kumulierter Zahlungsüberschuss minus Eigenkapital, in Tsd. €")
    legende(s.ax, colX(1), y + 0.05, [(NAME[v], (FARBE[v], STRICH[v]), "linie") for v in V])
    hy = s.hinweis(colX(1), 6.50, span(7), f"Unverzinst. Eigenkapital = Eigenmittel {eur(K('kern.eigenmittel.A'))} plus Bearbeitungsentgelte.\nFrei finanziert: Miete {eur(K('n5.miete_jahr1.frei_dscr'), 2)} für DSCR 1,2 · Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)};\nschneller zurück nur mit dieser Miete.", 3)
    a = s.diagramm(colX(1) + 0.55, y + 0.35, span(7) - 0.7, hy - y - 0.75)
    r = {v: [T(f"t1.rueckfluss.j{j:02d}.{v}") / 1e3 for j in range(36)] for v in V}
    for v in V:
        a.plot(range(36), r[v], color=FARBE[v], ls=STRICH[v], lw=2)
        a.plot([jz[v]], [r[v][jz[v]]], "o", color=FARBE[v], ms=4)
    a.axhline(0, color=TINTE, lw=1.4); a.text(0.5, 60, "Eigenkapital zurück", fontsize=8.5, family=WORK)
    a.set_xlim(0, 35); a.set_ylim(-800, 3600); a.set_xticks([0, 5, 10, 15, 20, 25, 30, 35])
    a.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, p: de(v)))
    yt = s.modulkopf(colX(8), 2.10, span(5), "Gebundenes Eigenkapital")
    rows = [["bei Bezug, Tsd. €"] + [de(K(f"n5.eigenkapital.{v}") / 1e3) for v in V], ["zurück in Jahr"] + [str(jz[v]) for v in V],
            ["Ende Jahr 35 darüber, Mio."] + [de(T(f"t1.rueckfluss.j35.{v}") / 1e6, 2) for v in V]]
    yt = s.tabelle(colX(8), yt - 0.05, [1.66, 0.8, 0.8, 0.8, 0.8], ["", "A", "B", "C", "frei"], rows, pt=9.5)
    s.stichpunkte(colX(8), yt + 0.25, span(5), [("Ergebnis", ["gefördert binden alle drei\nGruppen rund gleich lang", "C ein Jahr früher zurück:\nHöchstmiete höher"])])
    s.speichern("folie-21-rueckfluss.png")


def folie22():
    ob = [K(f"n5.objektrendite.{v}") for v in V]; oz = [K(f"n5.objektrendite_nach_zuschuss.{v}") for v in V]
    s = Folie("22", "Modellrechnung", "3", [f"Das Haus wirft gefördert {de(min(ob[:3]) * 100, 2)} bis {proz(max(ob[:3]), 2)} ab,", f"nach Abzug des Zuschusses {de(min(oz[:3]) * 100, 2)} bis {proz(max(oz[:3]), 2)}"],
              f"{de(min(oz[:3]) * 100, 2)} bis {proz(max(oz[:3]), 2)}", "Objektrendite")
    y = s.modulkopf(colX(1), 2.10, span(7), "Objektrendite = Zeile 5 ÷ Gesamtkosten, Jahr 1", "in %")
    legende(s.ax, colX(1), y + 0.05, [("÷ Gesamtkosten", TINTE, "f"), ("÷ Gesamtkosten minus Zuschuss", REF, "f")])
    hy = s.hinweis(colX(1), 6.50, span(7), f"Unabhängig von der Finanzierung; die Mappe nennt sie Nettoanfangsrendite.\nFrei finanziert: Miete {eur(K('n5.miete_jahr1.frei_dscr'), 2)} für DSCR 1,2 · Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)};\ndie Objektrendite frei hängt an dieser Miete.", 3)
    a = s.diagramm(colX(1) + 0.55, y + 0.35, span(7) - 0.7, hy - y - 0.75)
    import numpy as np
    x = np.arange(4)
    a.bar(x - 0.18, [v * 100 for v in ob], 0.34, color=TINTE); a.bar(x + 0.18, [v * 100 for v in oz], 0.34, color=REF)
    for i in range(4):
        a.text(i - 0.18, ob[i] * 100 + 0.1, de(ob[i] * 100, 2), ha="center", fontsize=8.5, family=MONT, weight="bold")
        a.text(i + 0.18, oz[i] * 100 + 0.1, de(oz[i] * 100, 2), ha="center", fontsize=8.5, family=MONT, weight="bold")
    a.set_xticks(x); a.set_xticklabels([NAME[v] for v in V]); a.set_ylim(0, 6)
    yt = s.modulkopf(colX(8), 2.10, span(5), "Rechenweg, in €")
    rows = [["Zeile 5 Jahr 1"] + [de(K(f"n5.uevk_jahr1.{v}")) for v in V], ["Gesamtkosten, Tsd."] + [de(K(f"n5.gesamtkosten.{v}") / 1e3) for v in V],
            ["Zuschuss, Tsd."] + [de(K(f"n5.zuschuss.{g}") / 1e3) for g in G] + ["0"]]
    yt = s.tabelle(colX(8), yt - 0.05, [1.5, 0.84, 0.84, 0.84, 0.84], ["", "A", "B", "C", "frei"], rows, pt=9.5)
    s.stichpunkte(colX(8), yt + 0.25, span(5), [("Fair lesen", ["ohne Zuschuss im Nenner liegt A\nunten, mit Zuschuss vorn", f"der Unterschied zu frei ist die Miete:\n{de(K('n5.miete_jahr1.A'), 2)} bis {eur(K('n5.miete_jahr1.C'), 2)} gegen {eur(K('n5.miete_jahr1.frei_dscr'), 2)}"])])
    s.speichern("folie-22-objektrendite.png")


def folie23():
    em = [K(f"n5.ek_vofi_mit_restwert.{v}") for v in V]; eo = [K(f"n5.ek_vofi_ohne_restwert.{v}") for v in V]
    s = Folie("23", "Modellrechnung", "3", [f"Eigenkapitalrendite gefördert {de(min(em[:3]) * 100, 2)} bis {proz(max(em[:3]), 2)},", f"ohne Restwert {de(min(eo[:3]) * 100, 2)} bis {proz(max(eo[:3]), 2)}"],
              f"{de(min(em[:3]) * 100, 2)} bis {proz(max(em[:3]), 2)}", "Eigenkapitalrendite")
    y = s.modulkopf(colX(1), 2.10, span(7), "Vermögen Ende Jahr 35", "in Mio. €")
    legende(s.ax, colX(1), y + 0.05, [("Restwert", TINTE, "f"), ("Projektkonto", REF, "f"), ("Restschuld", "#DCD8D3", "schraffur")])
    hy = s.hinweis(colX(1), 6.50, span(7), f"Restwert: Ertragswert Ende Jahr 35, Liegenschaftszins {proz(K('kern.liegenschaftszins_jahr35.A'), 2)}; frei aus der Marktmiete,\ngefördert aus der Miete der Gruppe bis zur Marktmiete. Frei finanziert: Miete {eur(K('n5.miete_jahr1.frei_dscr'), 2)} für\nDSCR 1,2 · Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)}; ohne Mietanpassung {proz(K('ek_vofi_mit_restwert.frei_dscr', 'mietsteigerung_0'), 2)} (Folie 24).", 3)
    a = s.diagramm(colX(1) + 0.55, y + 0.35, span(7) - 0.7, hy - y - 0.75)
    rw = [K(f"n5.restwert_jahr35.{v}") / 1e6 for v in V]; pk = [K(f"n5.projektkonto_jahr35.{v}") / 1e6 for v in V]; rs = [-K(f"n5.restschuld_jahr35.{v}") / 1e6 for v in V]
    lab = [NAME[v] for v in V]
    a.bar(lab, rw, 0.5, color=TINTE); a.bar(lab, pk, 0.5, bottom=rw, color=REF); a.bar(lab, rs, 0.5, color="#DCD8D3", hatch="////", edgecolor=HELL)
    for i, v in enumerate(V):
        a.text(i, rw[i] + pk[i] + 0.2, de(K(f"n5.vermoegen_jahr35.{v}") / 1e6, 2), ha="center", fontsize=9, family=MONT, weight="bold")
    a.axhline(0, color=TINTE, lw=1.2); a.set_ylim(-1, 13)
    yt = s.modulkopf(colX(8), 2.10, span(5), "Rechenblatt")
    rows = [["1 Eigenkapital, Tsd. €"] + [de(K(f"n5.eigenkapital.{v}") / 1e3) for v in V], ["2 Vermögen Ende Jahr 35, Mio."] + [de(K(f"n5.vermoegen_jahr35.{v}") / 1e6, 2) for v in V],
            ["3 Eigenkapitalrendite mit Restwert"] + [proz(x, 2) for x in em], ["4 ohne Restwert"] + [proz(x, 2) for x in eo], ["5 Anteil Restwert am Vermögen"] + [proz(K(f"n5.restwertanteil.{v}")) for v in V]]
    s.tabelle(colX(8), yt - 0.05, [2.30, 0.64, 0.64, 0.64, 0.64], ["", "A", "B", "C", "frei"], rows, pt=9, ergebnis=2)
    s.speichern("folie-23-eigenkapitalrendite.png")


LAEUFE = [("heute", "konzepte"), ("Tilgung 2,90 %", "tilgung_2_90"), ("Tilgung 3,65 %", "tilgung_3_65"), ("Herstellungskosten 4.631 €", "kosten_4631"),
          ("Herstellungskosten 5.460 €", "kosten_5460"), ("keine Mieterhöhung gefördert", "mietanpassung_gefoerdert_0"), ("keine Mietanpassung frei", "mietsteigerung_0"),
          ("Anschlusszins 4,86 %", "anschlusszins_plus_1"), ("Anschlusszins 2,86 %", "anschlusszins_minus_1")]


def KL(k, lauf):
    return K(f"n5.{k}" if lauf == "konzepte" else k, lauf)


def folie24():
    s = Folie("24", "Modellrechnung", "3", ["Gefördert drücken Tilgung und Kosten,", "frei finanziert hängt alles an der Miete"], "an der Miete", "Risiken")
    y = s.modulkopf(colX(1), 2.10, span(12), "Was passiert, wenn eine Annahme kippt?", "Jahre mit Fehlbetrag Jahr 1 bis 35 · Eigenkapitalrendite mit Restwert · Miete frei für DSCR 1,2")
    rows = []
    for name, lauf in LAEUFE:
        rows.append([name] + [str(KL(f"jahre_fehlbetrag_1_35.{v}", lauf)) for v in V] + [proz(KL(f"ek_vofi_mit_restwert.{v}", lauf), 2) for v in V] + [eur(KL("miete_jahr1.frei_dscr", lauf), 2)])
    rows.append(["frei nur zur Marktmiete"] + ["–"] * 3 + [str(K("n5.jahre_fehlbetrag_1_35.frei_markt"))] + ["–"] * 3 + [proz(K("n5.ek_vofi_mit_restwert.frei_markt"), 2), eur(K("annahme.marktmiete_jahr1"), 2)])
    br = [3.0, 0.75, 0.75, 0.75, 0.75, 1.0, 1.0, 1.0, 1.0, 1.0]
    s.gruppenkopf(colX(1), y + 0.02, br, [("Jahre mit Fehlbetrag", 1, 4), ("Eigenkapitalrendite mit Restwert", 5, 8), ("frei finanziert", 9, 9)])
    s.tabelle(colX(1), y + 0.17, br, ["Lauf", "A", "B", "C", "frei", "A", "B", "C", "frei", "Miete"], rows, pt=9.5, zh=0.245)
    s.hinweis(colX(1), 6.50, span(12), f"Frei finanziert bemisst die Bank die Miete neu: bei höheren Kosten {eur(K('miete_jahr1.frei_dscr', 'kosten_4631'), 2)} bzw. {eur(K('miete_jahr1.frei_dscr', 'kosten_5460'), 2)}. Ohne Mietanpassung liegt die DSCR frei in {K('jahre_dscr_unter_ziel.frei_dscr', 'mietsteigerung_0')} Jahren unter 1,2,\ntiefster Wert {de(K('dscr_min_1_35.frei_dscr', 'mietsteigerung_0'), 2)}. Zur Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)} DSCR {de(K('n5.dscr_jahr1.frei_markt'), 2)} in Jahr 1: Die Bank gäbe das Darlehen so nicht.")
    s.speichern("folie-24-risiken.png")


def anhangA6():
    s = Folie("A6", "Anhang", "A", ["So rechnet die Mappe die Miete für DSCR 1,2"], "", "Miete für DSCR 1,2", papier=False, anhang=True)
    y = s.modulkopf(colX(1), 1.50, span(8), "Miete Jahr 1 für DSCR 1,2, in € je m² und Monat", "(1,2 × Kapitaldienst + Objektverwaltung + Instandhaltung) ÷ ((1 − Mietausfall) × Wohnfläche × 12)")
    bew = K("n2.bewirtschaftung_jahr1")
    rows = [["Kapitaldienst Jahr 1, €"] + [de(K(f"n5.kapitaldienst_jahr1.{v}")) for v in V], ["× DSCR-Ziel"] + [de(K("annahme.dscr_ziel_bank_frei"), 1)] * 4,
            ["+ Objektverwaltung + Instandhaltung, €"] + [de(bew)] * 4, [f"÷ (1 − {proz(K('annahme.mietausfall'))}) × {de(K('annahme.wohnflaeche'))} m² × 12"] + [""] * 4,
            ["= Miete für DSCR 1,2"] + [de(K(f"n5.miete_dscr_ziel.{v}"), 2) for v in V], ["Gegenprobe DSCR"] + [de(K(f"n3.dscr_gegenprobe.{g}"), 2) for g in G] + [de(K("n2.dscr_jahr1"), 2)]]
    s.tabelle(colX(1), y, [3.6, 1.08, 1.08, 1.08, 1.08], ["Position", "A", "B", "C", "frei"], rows, pt=11, zh=0.36, ergebnis=4)
    s.stichpunkte(colX(9), 1.50, span(4), [("So gerechnet", ["Formel, keine Zielwertsuche", "Logik wie Übersicht 8.3", f"Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)}: frei\n{proz(K('n2.aufschlag_marktmiete'), 1)} darüber"])])
    s.speichern("folie-A6-miete-dscr.png")


def anhangA7():
    s = Folie("A7", "Anhang", "A", ["Risiken im Einzelnen"], "", "Risiken im Einzelnen", papier=False, anhang=True)
    y = s.modulkopf(colX(1), 1.50, span(12), "Kennzahlen je Lauf", "Zahlungsüberschuss Jahr 1 in Tsd. € · DSCR Minimum Jahr 1 bis 35 · Jahre mit DSCR unter 1,2")
    rows = []
    for name, lauf in LAEUFE:
        rows.append([name] + [de(KL(f"zue_jahr1.{v}", lauf) / 1e3, 1) for v in V] + [de(KL(f"dscr_min_1_35.{v}", lauf), 2) for v in V] + [str(KL(f"jahre_dscr_unter_ziel.{v}", lauf)) for v in V])
    br = [2.9] + [0.758] * 12
    s.gruppenkopf(colX(1), y + 0.02, br, [("Zahlungsüberschuss Jahr 1, Tsd. €", 1, 4), ("DSCR, tiefster Wert", 5, 8), ("Jahre mit DSCR unter 1,2", 9, 12)])
    s.tabelle(colX(1), y + 0.17, br, ["Lauf", "A", "B", "C", "frei", "A", "B", "C", "frei", "A", "B", "C", "frei"], rows, pt=8.5, zh=0.29)
    s.hinweis(colX(1), 6.50, span(12), f"Frei finanziert: Miete {eur(K('n5.miete_jahr1.frei_dscr'), 2)} für DSCR 1,2 · Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)}; in den Kostenläufen löst die Mappe die Miete neu "
              f"({eur(K('miete_jahr1.frei_dscr', 'kosten_4631'), 2)} bzw. {eur(K('miete_jahr1.frei_dscr', 'kosten_5460'), 2)}).\nIm Bau kommen je Lauf dazu: tiefster Stand Projektkonto und Eigenkapitalrendite ohne Restwert.")
    s.speichern("folie-A7-risiken-einzeln.png")


def anhangA11():
    s = Folie("A11", "Anhang", "A", ["Nach der Bindung: Zins ab Jahr 36, Darlehen in Jahr 42 getilgt"], "", "Nach der Bindung", papier=False, anhang=True)
    y = s.modulkopf(colX(1), 1.50, span(7), "Zahlungsüberschuss Jahr 30 bis 42", "in Tsd. € p. a.")
    legende(s.ax, colX(1), y + 0.05, [(NAME[v], (FARBE[v], STRICH[v]), "linie") for v in V])
    hy = s.hinweis(colX(1), 6.50, span(7), f"Frei finanziert: Miete {eur(K('n5.miete_jahr1.frei_dscr'), 2)} für DSCR 1,2 · Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)};\nBankdarlehen nach {K('annahme.laufzeit_bank')} Jahren getilgt, daher der Sprung in Jahr 31.")
    a = s.diagramm(colX(1) + 0.55, y + 0.35, span(7) - 0.7, hy - y - 0.75)
    jahre = list(range(30, 43))
    for v in V:
        a.plot(jahre, [x / 1e3 for x in K(f"zr.zue.{v}")[29:42]], color=FARBE[v], ls=STRICH[v], lw=2)
    a.axvline(35.5, color=REF, ls="--", lw=1); a.text(35.6, 360, "Ende der Bindung", fontsize=8.5, family=WORK, color=REF)
    a.set_xlim(30, 42); a.set_ylim(0, 400)
    yt = s.modulkopf(colX(8), 1.50, span(5), "Bindung zu Ende")
    rows = [["Restschuld Ende Jahr 35, Tsd. €"] + [de(K(f"n5.restschuld_jahr35.{v}") / 1e3) for v in V], ["Zahlungsüberschuss Jahr 42, Tsd. €"] + [de(K(f"n5.zue_jahr42.{v}") / 1e3) for v in V],
            ["Summe Jahr 36 bis 42, Mio. €"] + [de(K(f"n5.zue_summe_36_42.{v}") / 1e6, 2) for v in V], ["Jahre mit Fehlbetrag"] + [str(K(f"n5.jahre_fehlbetrag_36_42.{v}")) for v in V],
            ["Vermögen Ende Jahr 42, Mio. €"] + [de(K(f"n5.vermoegen_jahr42.{v}") / 1e6, 2) for v in V], ["Eigenkapitalrendite Jahr 42"] + [proz(K(f"n5.ek_vofi_mit_restwert_jahr42.{v}"), 2) for v in V],
            ["ohne Restwert"] + [proz(K(f"n5.ek_vofi_ohne_restwert_jahr42.{v}"), 2) for v in V]]
    yt = s.tabelle(colX(8), yt - 0.05, [2.38, 0.62, 0.62, 0.62, 0.62], ["", "A", "B", "C", "frei"], rows, pt=9)
    s.stichpunkte(colX(8), yt + 0.25, span(5), [("Annahmen", [f"ab Jahr 36 Zins {proz(K('annahme.zins_nbank_ab_jahr36'), 2)}\nauf die Restschuld", f"Miete bis zur Kappungsgrenze\n{proz(K('annahme.kappungsgrenze'))} in 3 Jahren"])])
    s.speichern("folie-A11-nach-der-bindung.png")


# =========================================================================================================================
#  Broschüre A4 hoch, Satzspiegel 180 × 259 mm, zwölf Spalten
# =========================================================================================================================
BW, BH = 210, 297
BX0, BY0, BSW, BSH, STEG = 15, 20, 180, 259, 4
BSP = (BSW - 11 * STEG) / 12


def bx(k):
    return BX0 + (k - 1) * (BSP + STEG)


def bspan(n):
    return n * BSP + (n - 1) * STEG


class Seite:
    def __init__(self, blatt, bogen, titel1, titel2, akzent):
        self.fig = plt.figure(figsize=(BW / 25.4, BH / 25.4), dpi=150)
        self.ax = self.fig.add_axes([0, 0, 1, 1]); ax = self.ax
        ax.set_xlim(0, BW); ax.set_ylim(BH, 0); ax.axis("off")
        for k in range(1, 13):
            ax.add_patch(Rectangle((bx(k), BY0), BSP, BSH, fc=ROT, alpha=0.035, lw=0))
        ax.add_patch(Rectangle((BX0, BY0), BSW, BSH, fill=False, ec=ROT, lw=0.4, ls=(0, (2, 2)), alpha=0.6))
        ax.text(BX0, 14, "MODELLRECHNUNG", fontsize=6.5, family=MONT, weight="bold", color=TINTE)
        ax.text(BX0 + BSW, 14, "Programmteil 2.1", fontsize=6, family=WORK, color=HELL, ha="right")
        ax.add_patch(Rectangle((BW - 9, 40), 9, 14, fc=ROT, lw=0)); ax.text(BW - 4.5, 47, "2.1", fontsize=6, color="white", family=MONT, weight="bold", ha="center", va="center")
        ax.text(BX0, 27, titel1.upper(), fontsize=13, family=MONT, weight="light", color=TINTE)
        self._zeile(BX0, 36, titel2.upper(), akzent.upper())
        ax.plot([BX0, BX0 + BSW], [282, 282], color=TINTE, lw=0.6)
        ax.text(BX0, 287, f"Blatt {blatt}", fontsize=6.5, family=MONT, weight="bold"); ax.text(BX0 + 20, 287, "Mietwohnraumförderung Niedersachsen 2026 · MODELLRECHNUNG", fontsize=6, family=WORK, color=HELL)
        ax.text(BX0 + BSW, 287, f"SKIZZE · Bogenseite {bogen} · Team 1", fontsize=6.5, family=MONT, weight="bold", color=ROT, ha="right")

    def _zeile(self, x, y, zeile, akzent):
        r = self.fig.canvas.get_renderer()
        teile = zeile.split(akzent) if akzent in zeile else [zeile]
        for i, t in enumerate(teile):
            for txt, farbe, stil in ([(t, TINTE, "normal")] + ([(akzent, ROT, "italic")] if i < len(teile) - 1 else [])):
                if txt:
                    h = self.ax.text(x, y, txt, fontsize=17, family=MONT, weight="black", color=farbe, style=stil, va="center")
                    x += h.get_window_extent(renderer=r).width / self.fig.dpi * 25.4

    def modul(self, k, n, y, titel, sub=None):
        x, w = bx(k), bspan(n)
        self.ax.plot([x, x + w], [y, y], color=TINTE, lw=1.0)
        self.ax.text(x, y + 4, titel, fontsize=8.5, family=MONT, weight="bold", color=TINTE, va="center")
        if sub:
            self.ax.text(x, y + 8.5, sub, fontsize=6, family=WORK, color=HELL, va="center")
            return y + 12
        return y + 8

    def tabelle(self, x, y, breiten, kopf, zeilen, pt=6, zh=4.6, ergebnis=None, nr=False):
        xs = [x]
        for b in breiten:
            xs.append(xs[-1] + b)
        for j, k in enumerate(kopf):
            self.ax.text(xs[j] + 0.8 if j == 0 else xs[j + 1] - 0.8, y + zh / 2, k.upper(), fontsize=pt - 1, family=MONT, weight="bold", color=HELL, ha="left" if j == 0 else "right", va="center")
        yy = y + zh; self.ax.plot([x, xs[-1]], [yy, yy], color=TINTE, lw=0.5)
        for i, z in enumerate(zeilen):
            erg = ergebnis is not None and i == ergebnis
            if erg:
                self.ax.add_patch(Rectangle((x, yy), xs[-1] - x, zh, fc=ROT, lw=0))
            for j, c in enumerate(z):
                self.ax.text(xs[j] + 0.8 if j == 0 else xs[j + 1] - 0.8, yy + zh / 2, c, fontsize=pt, family=WORK if j == 0 else MONT, weight="bold" if (j or erg) else "normal",
                             color="white" if erg else TINTE, ha="left" if j == 0 else "right", va="center")
            yy += zh; self.ax.plot([x, xs[-1]], [yy, yy], color=LINIE, lw=0.3)
        return yy

    def legende(self, x, y, eintraege):
        r = self.fig.canvas.get_renderer()
        for text, farbe, art in eintraege:
            if art == "linie":
                self.ax.plot([x, x + 5], [y, y], color=farbe[0], lw=1.3, ls=farbe[1])
            else:
                self.ax.add_patch(Rectangle((x, y - 1.3), 5, 2.6, fc=farbe, lw=0.3 if art == "schraffur" else 0, ec=HELL, hatch="/////" if art == "schraffur" else None))
            h = self.ax.text(x + 6.5, y, text, fontsize=5.5, family=WORK, color=TINTE, va="center")
            x += 6.5 + h.get_window_extent(renderer=r).width / self.fig.dpi * 25.4 + 4

    def kasten(self, x, y, w, h, titel, text, farbe=FL3):
        self.ax.add_patch(Rectangle((x, y), w, h, fc=farbe, lw=0))
        self.ax.text(x + 3, y + 4, titel, fontsize=7, family=MONT, weight="bold", color=TINTE, va="center")
        self.ax.text(x + 3, y + 8, text, fontsize=6, family=WORK, color=TINTE, va="top", linespacing=1.45)

    def diagramm(self, x, y, w, h):
        a = self.fig.add_axes([x / BW, 1 - (y + h) / BH, w / BW, h / BH]); a.set_facecolor("none")
        for sp in ("top", "right"):
            a.spines[sp].set_visible(False)
        a.tick_params(labelsize=5.5, colors=HELL, length=2)
        a.grid(axis="y", color=LINIE, lw=0.3)
        return a

    def speichern(self, name):
        ziel = HIER.parent / "broschuere"
        ziel.mkdir(exist_ok=True)
        self.fig.savefig(ziel / name, dpi=150, facecolor="white"); plt.close(self.fig)


def stapel_balken(a, werte_reihen, farben, schraff, labels_fmt, kat):
    import numpy as np
    links = np.zeros(len(kat))
    for werte, farbe, h in zip(werte_reihen, farben, schraff):
        a.barh(kat, werte, left=links, color=farbe, hatch=h, edgecolor="white" if not h else HELL, height=0.6, lw=0.6)
        for i, v in enumerate(werte):
            if labels_fmt and v >= 9:
                a.text(links[i] + v / 2, i, labels_fmt(v), ha="center", va="center", fontsize=5, family=MONT, weight="bold", color="white" if farbe in (TINTE, REF, ROT) else TINTE)
        links += np.array(werte)
    a.invert_yaxis()


def blatt9():
    gk, em = K("n5.gesamtkosten.A"), K("kern.eigenmittel.A")
    p = Seite(9, 10, "Ein Haus, vier Finanzierungen", f"{de(gk / 1e6, 1)} Mio. €, je {de(em / 1e6, 1)} Mio. € Eigenmittel", f"{de(em / 1e6, 1)} Mio. €")
    y = p.modul(1, 7, 46, "Finanzierung je Variante", "in Mio. €, gleiche Gesamtkosten")
    p.legende(bx(1), y + 1, [("Zuschuss", ROT, "f"), ("NBank-Darlehen", TINTE, "f"), ("Bankdarlehen", REF, "f"), ("Eigenmittel", "#DCD8D3", "schraffur")])
    a = p.diagramm(bx(1) + 8, y + 6, bspan(7) - 10, 52)
    zus = [K(f"n5.zuschuss.{g}") / 1e6 for g in G] + [0]; nb = [K(f"n5.darlehen_nbank.{g}") / 1e6 for g in G] + [0]
    bank = [0, 0, 0, K("n5.bankdarlehen.frei_dscr") / 1e6]; emv = [em / 1e6] * 4
    import numpy as np
    links = np.zeros(4)
    for werte, farbe, h in ((zus, ROT, None), (nb, TINTE, None), (bank, REF, None), (emv, "#DCD8D3", "////")):
        a.barh([NAME[v] for v in V], werte, left=links, color=farbe, hatch=h, edgecolor="white" if not h else HELL, height=0.6, lw=0.6)
        for i, v in enumerate(werte):
            if v > 0:
                a.text(links[i] + v / 2, i, de(v, 1), ha="center", va="center", fontsize=5.5, family=MONT, weight="bold", color="white" if farbe != "#DCD8D3" else TINTE)
        links += np.array(werte)
    a.invert_yaxis(); a.set_xlim(0, 3.2); a.grid(False)
    y2 = p.modul(9, 4, 46, "Das Modellhaus")
    for i, t in enumerate([f"Wohnungen: {K('annahme.wohnungen')}", f"Wohnfläche: {de(K('annahme.wohnflaeche'))} m²", f"Mietenstufe {K('annahme.mietenstufe')}, EH 55",
                           f"Herstellungskosten:\n{eur(K('annahme.herstellungskosten_qm'))} je m²", f"Bemessungsgrenze:\n{eur(K('annahme.bemessungsgrenze_VI'))} je m²", "Grundstück: im Bestand"]):
        p.ax.text(bx(9), y2 + 3 + i * 9, t, fontsize=6, family=WORK, va="top", linespacing=1.4)
    y = p.modul(1, 12, 132, "Annahmen mit Wert und Herkunft", "Richtlinie (RL), Quelle, Projekt PGN oder Annahme PGN; rot: neue Annahme")
    spalten = annahmen()
    for k, rows in zip((1, 5, 9), spalten):
        p.tabelle(bx(k), y, [bspan(4) * 0.47, bspan(4) * 0.22, bspan(4) * 0.31], ["Annahme", "Wert", "Herkunft"], [list(r) for r in rows], pt=5.3, zh=5.6)
    p.ax.add_patch(Circle((bx(9) - 1.5, y + 5.6 * (DSCR_ZEILE + 1.5)), 1.0, fc=ROT, lw=0))
    p.kasten(bx(1), 240, bspan(12), 28, "Neu: DSCR 1,2 der Bank",
             f"Die Bank verlangt DSCR 1,2 für das Bankdarlehen frei finanziert ({mio(K('n5.bankdarlehen.frei_dscr'), 2)}). DSCR = Überschuss vor Kapitaldienst ÷ Kapitaldienst.\n"
             f"Daraus folgt die Miete frei finanziert: {eur(K('n5.miete_jahr1.frei_dscr'), 2)} je m² statt Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)}.\n"
             "Gefördert gibt es im Modellhaus kein Bankdarlehen; dort ist die DSCR nur Vergleichszahl.\n"
             f"Die NBank prüft stattdessen Eigenmittel (mindestens {proz(K('annahme.eigenmittel_mindestens'))}), Bemessungsgrenze ({eur(K('annahme.bemessungsgrenze_VI'))} je m²), Höchstmiete und angemessenen Gewinn.")
    p.speichern("blatt-09-bogen-10.png")


def blatt10():
    p = Seite(10, 11, "Jahr 1: Was hereinkommt,", "was hinausgeht, was bleibt", "was bleibt")
    y = p.modul(1, 12, 46, "Jahresrechnung Jahr 1, in € p. a.", "gefördert zur Höchstmiete, frei finanziert zur Miete für DSCR 1,2")
    z = lambda k: [T(f"t1.{k}_jahr1.{v}") for v in V]
    rows = [["Miete in € je m² und Monat"] + [de(x, 2) for x in z("miete")], ["1  Sollmiete"] + [de(x) for x in z("sollmiete")],
            ["2  − Mietausfall/Leerstand"] + [de(abs(x)) for x in z("mietausfall")], ["3  − Objektverwaltung"] + [de(abs(x)) for x in z("objektverwaltung")],
            ["4  − Instandhaltung"] + [de(abs(x)) for x in z("instandhaltung")], ["5  = Überschuss vor Kapitaldienst"] + [de(x) for x in z("uevk")],
            ["6  − Verwaltungskostenbeitrag"] + [de(abs(x)) for x in z("vkb")], ["7  − Zins"] + [de(abs(x)) for x in z("zins")], ["8  − Tilgung"] + [de(abs(x)) for x in z("tilgung")],
            ["9  = Zahlungsüberschuss"] + [de(x) for x in z("zue")], ["DSCR = 5 ÷ (6 + 7 + 8)"] + [de(K(f"n5.dscr_jahr1.{v}"), 2) for v in V]]
    yy = p.tabelle(bx(1), y, [bspan(12) - 4 * 26, 26, 26, 26, 26], ["Position", "A", "B", "C", "frei"], rows, pt=6.5, zh=5.6, ergebnis=9)
    y = p.modul(1, 7, yy + 10, "Wohin die Sollmiete in Jahr 1 geht", "Anteil an der Sollmiete in %")
    p.legende(bx(1), y + 1, [("Bewirtschaftung, Zeilen 2 bis 4", LICHT, "f"), ("Verwaltungskostenbeitrag, 6", GRAU3, "f"), ("Zins, 7", REF, "f"), ("Tilgung, 8", "#DCD8D3", "schraffur"), ("Zahlungsüberschuss, 9", TINTE, "f")][:3])
    p.legende(bx(1), y + 5, [("Bewirtschaftung, Zeilen 2 bis 4", LICHT, "f"), ("Verwaltungskostenbeitrag, 6", GRAU3, "f"), ("Zins, 7", REF, "f"), ("Tilgung, 8", "#DCD8D3", "schraffur"), ("Zahlungsüberschuss, 9", TINTE, "f")][3:])
    a = p.diagramm(bx(1) + 6, y + 9, bspan(7) - 8, 52)
    reihen = ["bewirtschaftung", "vkb", "zins", "tilgung", "zue"]
    an = [[abs(T(f"t1.anteil_{r}_jahr1.{v}")) * 100 for v in V] for r in reihen]
    stapel_balken(a, an, [LICHT, GRAU3, REF, "#DCD8D3", TINTE], [None, None, None, "////", None], lambda v: de(v) + " %", [NAME[v] for v in V])
    a.set_xlim(0, 100); a.grid(False)
    y2 = p.modul(9, 4, yy + 10, "Mieten im Vergleich", "in € je m² und Monat")
    rows = [["kostendeckend"] + [de(T(f"t1.kostendeckende_anfangsmiete.{v}"), 2) for v in V], ["für DSCR 1,2"] + [de(K(f"n5.miete_dscr_ziel.{v}"), 2) for v in V],
            ["angesetzt"] + [de(K(f"n5.miete_jahr1.{v}"), 2) for v in V], ["Marktmiete"] + [de(K("annahme.marktmiete_jahr1"), 2)] * 4]
    yy2 = p.tabelle(bx(9), y2, [bspan(4) - 4 * 8.4, 8.4, 8.4, 8.4, 8.4], ["", "A", "B", "C", "frei"], rows, pt=5.5, zh=6.0)
    p.kasten(bx(9), yy2 + 4, bspan(4), 25, "Gruppe C unter DSCR 1,2",
             f"DSCR {de(K('n5.dscr_jahr1.C'), 2)} in Jahr 1: Für 1,2 wären\n{eur(K('n5.miete_dscr_ziel.C'), 2)} nötig, erlaubt sind {eur(K('n5.miete_jahr1.C'), 2)}.\nC trägt sich trotzdem: {eur(K('n5.zue_jahr1.C'))}\nZahlungsüberschuss in Jahr 1.")
    p.kasten(bx(1), 226, bspan(12), 17, "Annahmen",
             f"Tilgung NBank {proz(K('annahme.tilgung_nbank'), 2)} p. a., Zins 0 % bis Jahr 35. Bank {proz(K('annahme.zins_bank'), 2)}, jährliche Annuität über {K('annahme.laufzeit_bank')} Jahre.\n"
             f"Frei finanziert: Miete {eur(K('n5.miete_jahr1.frei_dscr'), 2)} für DSCR 1,2 · Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)}; zur Marktmiete Fehlbetrag {eur(abs(K('n5.zue_jahr1.frei_markt')))} in Jahr 1.")
    p.speichern("blatt-10-bogen-11.png")


def blatt11():
    p = Seite(11, 12, "35 Jahre: Liquidität, Eigenkapital,", "Rendite, Risiko", "Risiko")
    y = p.modul(1, 7, 46, "Zahlungsüberschuss je Jahr", f"in Tsd. € p. a., Jahr 1 bis 35 · Jahre mit Fehlbetrag A | B | C | frei: {' | '.join(str(K(f'n5.jahre_fehlbetrag_1_35.{v}')) for v in V)}")
    p.legende(bx(1), y + 1, [(NAME[v], (FARBE[v], STRICH[v]), "linie") for v in V])
    a = p.diagramm(bx(1) + 8, y + 6, bspan(7) - 10, 54)
    for v in V:
        a.plot(range(1, 36), [x / 1e3 for x in K(f"zr.zue.{v}")[:35]], color=FARBE[v], ls=STRICH[v], lw=1.2)
    a.set_xlim(1, 35); a.set_ylim(0, 350)
    y2 = p.modul(8, 5, 46, "Wohin die Sollmiete in 35 Jahren geht", "Anteil in % · Zins frei " + mio(T("t1s.zins.frei_dscr") * -1, 2) + ", gefördert 0 €")
    p.legende(bx(8), y2 + 1, [("Bewirtschaftung, Zeilen 2 bis 4", LICHT, "f"), ("Verwaltungskostenbeitrag, 6", GRAU3, "f"), ("Zins, 7", REF, "f"), ("Tilgung, 8", "#DCD8D3", "schraffur"), ("Zahlungsüberschuss, 9", TINTE, "f")][:1])
    p.legende(bx(8), y2 + 5, [("Bewirtschaftung, Zeilen 2 bis 4", LICHT, "f"), ("Verwaltungskostenbeitrag, 6", GRAU3, "f"), ("Zins, 7", REF, "f"), ("Tilgung, 8", "#DCD8D3", "schraffur"), ("Zahlungsüberschuss, 9", TINTE, "f")][1:3])
    p.legende(bx(8), y2 + 9, [("Bewirtschaftung, Zeilen 2 bis 4", LICHT, "f"), ("Verwaltungskostenbeitrag, 6", GRAU3, "f"), ("Zins, 7", REF, "f"), ("Tilgung, 8", "#DCD8D3", "schraffur"), ("Zahlungsüberschuss, 9", TINTE, "f")][3:])
    a = p.diagramm(bx(8) + 6, y2 + 13, bspan(5) - 7, 46)
    reihen = ["bewirtschaftung", "vkb", "zins", "tilgung", "zue"]
    an = [[abs(T(f"t1s.anteil_{r}.{v}")) * 100 for v in V] for r in reihen]
    stapel_balken(a, an, [LICHT, GRAU3, REF, "#DCD8D3", TINTE], [None, None, None, "////", None], lambda v: de(v), [NAME[v] for v in V])
    a.set_xlim(0, 100); a.grid(False)
    y = p.modul(1, 7, 132, "Was das Eigenkapital bringt", "Jahr 35, gefördert zur Höchstmiete, frei zur Miete für DSCR 1,2")
    rows = [["Eigenkapital zurück in Jahr"] + [str(K(f"n5.jahr_ek_erreicht.{v}")) for v in V], ["Objektrendite ÷ Gesamtkosten"] + [proz(K(f"n5.objektrendite.{v}"), 2) for v in V],
            ["… ÷ Gesamtkosten minus Zuschuss"] + [proz(K(f"n5.objektrendite_nach_zuschuss.{v}"), 2) for v in V], ["Vermögen Ende Jahr 35, Mio. €"] + [de(K(f"n5.vermoegen_jahr35.{v}") / 1e6, 2) for v in V],
            ["Eigenkapitalrendite mit Restwert"] + [proz(K(f"n5.ek_vofi_mit_restwert.{v}"), 2) for v in V], ["… ohne Restwert"] + [proz(K(f"n5.ek_vofi_ohne_restwert.{v}"), 2) for v in V]]
    p.tabelle(bx(1), y, [bspan(7) - 4 * 13, 13, 13, 13, 13], ["", "A", "B", "C", "frei"], rows, pt=6, zh=6.0, ergebnis=4)
    y2 = p.modul(8, 5, 132, "Risiko kompakt", "Eigenkapitalrendite mit Restwert · Jahre mit Fehlbetrag")
    sel = [("Tilgung 3,65 %", "tilgung_3_65"), ("Herstellungskosten 5.460 €", "kosten_5460"), ("keine Mieterhöhung gefördert", "mietanpassung_gefoerdert_0"), ("keine Mietanpassung frei", "mietsteigerung_0")]
    rows = [[n, f"{proz(K('ek_vofi_mit_restwert.A', l), 2)} | {K('jahre_fehlbetrag_1_35.A', l)}", f"{proz(K('ek_vofi_mit_restwert.frei_dscr', l), 2)} | {K('jahre_fehlbetrag_1_35.frei_dscr', l)}"] for n, l in sel]
    rows.append(["frei nur zur Marktmiete", "–", f"{proz(K('n5.ek_vofi_mit_restwert.frei_markt'), 2)} | {K('n5.jahre_fehlbetrag_1_35.frei_markt')}"])
    p.tabelle(bx(8), y2, [bspan(5) - 2 * 17, 17, 17], ["Lauf", "A", "frei"], rows, pt=5.3, zh=6.0)
    p.kasten(bx(1), 196, bspan(12), 22, "Frei finanziert vorn: unter welchen Annahmen?",
             f"Frei finanziert liegt bei Zahlungsüberschuss und Rendite vorn, aber nur mit {eur(K('n5.miete_jahr1.frei_dscr'), 2)} Miete ({proz(K('n2.aufschlag_marktmiete'), 1)} über der Marktmiete {eur(K('annahme.marktmiete_jahr1'), 2)})\n"
             f"und {proz(K('annahme.mietsteigerung'))} Mietanpassung p. a. Ohne Mietanpassung sinkt die Eigenkapitalrendite frei auf {proz(K('ek_vofi_mit_restwert.frei_dscr', 'mietsteigerung_0'), 2)},\n"
             f"die DSCR liegt dann in {K('jahre_dscr_unter_ziel.frei_dscr', 'mietsteigerung_0')} Jahren unter 1,2.")
    p.kasten(bx(1), 224, bspan(12), 13, "Tilgungssatz",
             f"Über {proz(T('ue.tilgungsschwelle.C_gegen_A'), 2)} Tilgung liegt Gruppe A beim Zahlungsüberschuss vorn, darunter C.")
    p.speichern("blatt-11-bogen-12.png")


if __name__ == "__main__":
    for f in (folie13, folie14, folie15, folie18, folie19, folie20, folie21, folie22, folie23, folie24, anhangA6, anhangA7, anhangA11, blatt9, blatt10, blatt11):
        f()
    belege = sorted(set(BELEGE))
    (HIER / "skizzen.belege.tsv").write_text("lauf\tschluessel\tblatt\tzelle\n" + "\n".join("\t".join(map(str, b)) for b in belege) + "\n", encoding="utf8")
    print(len(belege), "Zahlen mit Blatt und Zelle")
