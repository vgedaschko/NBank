#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Referenzrechnung Kennzahlen vor Steuern: Broschüren-Modellprojekt (S. 10 bis 12)
================================================================================

Internes Werkzeug der Prüfung des PGN-VOFI-Modells v2-1. Nicht zur Weitergabe.
Methodik und Begriffe: kennzahlen-konzept.md im selben Ordner.

Was die Rechnung macht
  1. Rechnet das Modellhaus der Broschüre (20 WE, 1.400 m², 7,0 Mio. € zuwendungsfähig, Mietenstufe IV bis VII,
     Grundstück 0,7 Mio. € als Sacheinlage) für die Einkommensgruppen A, B und C Jahr für Jahr bis T42.
  2. Bildet daraus die Zahlungsreihen des Kennzahlenkonzepts (Objekt- und EK-Zahlungsreihe, Restwert getrennt
     nach Boden und Gebäude) und berechnet für die Horizonte T35 (Bindungsende) und T42 (Darlehensende):
       Objekt-IRR (brutto und nach Zuschuss), EK-IRR, VOFI-EK-Rendite,
       jeweils mit Restwert, ohne Gebäude-Restwert (Boden bleibt) und ohne Restwert.
  3. Liefert die Jahresrechnung Jahr 1 bis 3 im Schema der Broschüren-S. 11, Liquiditätskennzahlen
     (Zahlungsüberschuss, DSCR, Break-even-Tilgung), die Überkompensationskennzahl der NBank getrennt davon und
     Sensitivitäten (Tilgungssatz, Restwert, EK-Vorlauf, Kostenstand).
  4. Abgleich mit dem VOFI-Modell: In der "Modellkonvention" bildet die Rechnung die Mechanik der Mappe nach.
     Sie wird gegen die Excel-Cache-Werte des Referenzprojekts und gegen eine LibreOffice-Neuberechnung einer
     Kopie der Mappe mit den Broschüreneingaben geprüft (Werte unten in VOFI_*). Danach wird Schritt für
     Schritt von der VOFI-Kennzahl zur sauberen Kennzahl übergeleitet.

Aufruf
  python3 referenzrechnung.py                       # annahmen.json neben dem Skript -> referenzrechnung-ergebnis.md
  python3 referenzrechnung.py --annahmen X.json --out Y.md
Nur Python-Standardbibliothek (getestet mit Python 3.13). Laufzeit wenige Sekunden.

Abkürzungen
  T0  Bezugsfertigkeit; Jahr t = 1 ... 42 Bewirtschaftungsjahre. Alle Beträge nominal in €, vor Steuern.
  RE  Reinertrag = Sollmiete - Mietausfall - Verwaltung - Instandhaltung      (= Broschüre S. 11, Zeile 4)
  KD  Kapitaldienst = Verwaltungskostenbeitrag (VKB) + Zins + Tilgung (+ Bankdarlehen, falls vorhanden)
  ZÜ  Zahlungsüberschuss = RE - KD                                           (= Broschüre S. 11, Zeile 8)
  RW  Restwert am Horizont H: "mit" = Boden + Gebäude, "oG" = ohne Gebäude-Restwert (nur Boden), "0" = ohne Restwert
  PH  Platzhalter-Annahme: im PGN-Modell nicht für das Broschürenprojekt belegt, siehe Tabelle QUELLEN
"""
import argparse
import hashlib
import json
import math
import os
import sys
from datetime import date

HIER = os.path.dirname(os.path.abspath(__file__))

# =====================================================================================================
# 0. Vergleichswerte aus dem VOFI-Modell (fest eingetragen, damit das Skript ohne Excel/LibreOffice läuft)
# =====================================================================================================
# a) Referenzprojekt Tarutinoer Straße 4 (14 WE, 828 m²), Szenario Basis, Excel-Cache der Originaldatei
#    (gelesen mit openpyxl data_only aus einer Kopie; SHA-256 der Datei 11d558b3...5e28b).
VOFI_CACHE_REFERENZPROJEKT = {
    "A": {"K1": ("Dashboard!C43", 0.016586388932757237), "K3": ("Dashboard!C55", 0.06376040006971606),
          "K5": ("Dashboard!C57", 0.033449900252379816), "K6": ("Dashboard!C58", 0.07924044134668584),
          "DSCR_T1": ("Dashboard!C20", 1.3384615814052014), "K3_T35": ("Bewertung!N25", 0.06792794145796544),
          "K5_T35": ("Bewertung!O25", 0.023700085015488925), "VW_T42": ("Bewertung!L30", 6713517.690581756),
          "ZUE_T1": ("Gefoerdert_A!Q7", 12429.319431106502)},
    "B": {"K1": ("Dashboard!D43", 0.0211865565773507), "K3": ("Dashboard!D55", 0.06440016641558666),
          "K5": ("Dashboard!D57", 0.035626590717585005), "K6": ("Dashboard!D58", 0.07929571901378352),
          "DSCR_T1": ("Dashboard!D20", 1.1501844342612806), "K3_T35": ("Bewertung!N26", 0.0688010620945334),
          "K5_T35": ("Bewertung!O26", 0.023851829095857813), "VW_T42": ("Bewertung!L31", 6713517.690581756),
          "ZUE_T1": ("Gefoerdert_B!Q7", 8198.036533328399)},
    "C": {"K1": ("Dashboard!E43", 0.023815223802832682), "K3": ("Dashboard!E55", 0.06494359598436006),
          "K5": ("Dashboard!E57", 0.03737120365590729), "K6": ("Dashboard!E58", 0.08020684959627888),
          "DSCR_T1": ("Dashboard!E20", 1.1110882145130718), "K3_T35": ("Bewertung!N27", 0.06954134663779965),
          "K5_T35": ("Bewertung!O27", 0.025146680734498217), "VW_T42": ("Bewertung!L32", 6713517.690581756),
          "ZUE_T1": ("Gefoerdert_C!Q7", 7056.123084439343)},
}
# b) Broschüren-Modellprojekt durch die Mechanik der Mappe: LibreOffice-24.2-Neuberechnung einer KOPIE, Szenario
#    Basis, geänderte Eingaben Eingabe!C12=1400, C13=20, C14=1362, C15=700000, C20=600 (Bodenrichtwert-Deckel
#    greift nicht), C21=600, C36="IV", Szenarien!H6=6300000; sonst unverändert. Drei Läufe:
#      FR03  Eingabe!C88 unverändert (=0.2*Zuwendungsfaehig): bares EK 1,4 Mio. € ZUSÄTZLICH zum Grundstück (FR-03)
#      EK    Eingabe!C88 = 0.2*Zuwendungsfaehig-KG_Grundstueck (bares EK 0,7 Mio. €), Entgelte über Bankdarlehen
#      EKVL0 wie EK, Vorlaufzeit Eingabe!C107 = 0
#    Zellen: K1 Dashboard!C43:E43, K2 C44:E44, K3 C55:E55, K5 C57:E57, K6 C58:E58, DSCR_T1 C20:E20,
#    VW_T42 C47:E47, Konto_T42 C48:E48, K3_T35/K5_T35/VW_T35 Bewertung!N25:N27/O25:O27/L25:L27,
#    ZUE_T1..T3 Gefoerdert_*!Q7:Q9, EK Dashboard!C11:E11, Bank Dashboard!C10:E10, Konto_T0 Gefoerdert_*!Y6.
#    Skript der Neuberechnung (nicht Teil dieses Werkzeugs): scratchpad/vofi-work/referenz/lo_vofi_brosch.py.
VOFI_LO_BROSCHUERE = {
    "FR03": {
        "A": {"EK": 2100000.0, "Bank": 0.0, "Konto_T0": 651000.0, "K1": 0.012065028571428571, "K2": -0.10390855080071304,
              "K3": 0.04748497015375697, "K5": 0.018025392834998488, "K6": 0.061131403224098234,
              "DSCR_T1": 1.0054190476190477, "VW_T42": 11899676.658173246, "Konto_T42": 4650262.588888014,
              "K3_T35": 0.04861707614428834, "K5_T35": 0.006485633842539418, "VW_T35": 9779187.188534264,
              "ZUE_T1": 455.2, "ZUE_T2": 255.2, "ZUE_T3": 44.2},
        "B": {"EK": 2100000.0, "Bank": 0.0, "Konto_T0": 647500.0, "K1": 0.015357828571428568, "K2": -0.10390855080071304,
              "K3": 0.04708489434254992, "K5": 0.01661112651062724, "K6": 0.05835801998716466,
              "DSCR_T1": 0.8532126984126982, "VW_T42": 11899676.658173246, "Konto_T42": 4371298.896257708,
              "K3_T35": 0.04806576266288376, "K5_T35": -0.0002598082781394284, "VW_T35": 10132434.213494362,
              "ZUE_T1": -18495.2, "ZUE_T2": -18520.2, "ZUE_T3": -18556.2},
        "C": {"EK": 2100000.0, "Bank": 0.0, "Konto_T0": 645750.0, "K1": 0.017239428571428572, "K2": -0.10390855080071304,
              "K3": 0.047110860866157234, "K5": 0.016704829451187342, "K6": 0.05765983823516604,
              "DSCR_T1": 0.8209251700680272, "VW_T42": 11899676.658173246, "Konto_T42": 4389264.4160227785,
              "K3_T35": 0.04809921813690998, "K5_T35": -0.0027718077255405316, "VW_T35": 10334289.656328706,
              "ZUE_T1": -26324.0, "ZUE_T2": -26261.5, "ZUE_T3": -26210.0},
    },
    "EK": {
        "A": {"EK": 1400000.0, "Bank": 49000.0, "Konto_T0": 0.0, "K1": 0.012065028571428571, "K2": -0.10390855080071304,
              "K3": 0.054600004245489275, "K5": 0.017367402165732626, "K6": 0.061367839391453044,
              "DSCR_T1": 0.9736041574137115, "VW_T42": 11899676.658173246, "Konto_T42": 3012249.511271604,
              "K3_T35": 0.05658523409001859, "K5_T35": -0.0030150149185219632, "VW_T35": 9779187.188534264,
              "ZUE_T1": -2289.7048536803195, "ZUE_T2": -2489.704853680305, "ZUE_T3": -2700.7048536803195},
        "B": {"EK": 1400000.0, "Bank": 52500.0, "Konto_T0": 0.0, "K1": 0.015357828571428568, "K2": -0.10390855080071304,
              "K3": 0.05395094597540595, "K5": 0.014089263380533845, "K6": 0.05856476445055753,
              "DSCR_T1": 0.8337520683183692, "VW_T42": 11899676.658173246, "Konto_T42": 2609265.388519491,
              "K3_T35": 0.05567387641552535, "K5_T35": -0.024812154849801704, "VW_T35": 10132434.213494362,
              "ZUE_T1": -21436.169486086073, "ZUE_T2": -21461.16948608606, "ZUE_T3": -21497.169486086073},
        "C": {"EK": 1400000.0, "Bank": 54250.0, "Konto_T0": 0.0, "K1": 0.017239428571428572, "K2": -0.10390855080071304,
              "K3": 0.053791089105399204, "K5": 0.013220825028257277, "K6": 0.05786050591433621,
              "DSCR_T1": 0.8042975396425159, "VW_T42": 11899676.658173246, "Konto_T42": 2511659.800491996,
              "K3_T35": 0.05544629711037796, "K5_T35": -0.04411433788075081, "VW_T35": 10334289.656328706,
              "ZUE_T1": -29363.001802288927, "ZUE_T2": -29300.501802288898, "ZUE_T3": -29249.001802288898},
    },
    "EKVL0": {
        "A": {"K3": 0.057942442987862774, "K5": 0.01841063607937765, "K6": 0.061367839391453044,
              "K3_T35": 0.06074746855476065, "K5_T35": -0.0032300249582161156},
        "B": {"K3": 0.057252583369476584, "K5": 0.014934142170514031, "K6": 0.05856476445055753,
              "K3_T35": 0.059767197536198635, "K5_T35": -0.026560710736945214},
        "C": {"K3": 0.05708268139642825, "K5": 0.014013267938204788, "K6": 0.05786050591433621,
              "K3_T35": 0.05952241899358879, "K5_T35": -0.04718985585747193},
    },
}

GRUPPEN = ("A", "B", "C")


# =====================================================================================================
# 1. Annahmen laden
# =====================================================================================================
class Annahmen:
    """Liest annahmen.json. w(name) liefert den Wert einer Eingabe aus 'alle_eingaben' (Szenario Basis),
    ref(name) die Fundstelle Blatt!Zelle."""

    def __init__(self, pfad):
        raw = open(pfad, "rb").read()
        self.pfad = pfad
        self.sha = hashlib.sha256(raw).hexdigest()
        self.d = json.loads(raw.decode("utf-8"))
        self.e = {x["name"]: x for x in self.d["alle_eingaben"]}
        self.tab = self.d["nachschlagetabellen"]

    def w(self, name):
        return self.e[name]["value"]

    def ref(self, name):
        return self.e[name]["ref"]


def gemeinsame_annahmen(A):
    """Annahmesätze, die für das Referenzprojekt und das Broschürenprojekt gleich sind (PGN-Werte, Szenario Basis)."""
    w = A.w
    band = {b["band"]: b for b in A.tab["mietenstufen"]}
    P = dict(
        fj=w("Fertigstellungsjahr"),
        monate=w("Monate_Jahr"),
        n=int(w("Hoechstlaufzeit_NBank")),                       # Rechenhorizont = Höchstlaufzeit 42 J. = Jahre_n
        quote_d={"A": w("Quote_D_A"), "B": w("Quote_D_B"), "C": w("Quote_D_C")},
        quote_z={"A": w("Quote_Z_A"), "B": w("Quote_Z_B"), "C": w("Quote_Z_C")},
        hoechstmiete={g: {b: band[b][f"miete_{g}"] for b in band} for g in GRUPPEN},
        bemessungsgrenze={b: band[b]["bemessungsgrenze_eur_m2"] for b in band},
        mietenstufen_band={b: band[b]["mietenstufen"] for b in band},
        zuschlag_eh40=w("Zuschlag_EH40"),
        bindung=int(w("Bindung")),
        zinsfrei=int(w("Zinsfrei_Jahre")),
        zins_1_35=w("Zins_NBank_1_35"),
        zins_ab36=w("Zins_NBank_ab36"),
        vkb=w("VKB_Satz"),
        be_d=w("BE_Darlehen"),
        be_z=w("BE_Zuschuss"),
        laufzeit_nbank=w("Laufzeit_NBank"),
        tilgungsfrei=int(w("Tilgungsfrei_NBank")),
        karenz=int(w("Karenz_Jahre")),
        rhythmus=int(w("Anpassung_Rhythmus")),
        kappung=w("Kappung"),
        marktlage=w("Marktlage"),
        kapp_ang=w("Kappung_angespannt"),
        kapp_norm=w("Kappung_normal"),
        marktlage_bis=w("Marktlage_bis"),
        verwaltung_we=w("Verwaltung_WE"),
        instandhaltung_qm=w("Instandhaltung_qm"),
        mietausfall=w("Mietausfall"),
        mietausfall_frei=w("Mietausfall_Frei"),
        kosten_wachstum=w("Kosten_Wachstum"),
        miet_wachstum=w("OVM_Wachstum"),
        gnd=int(w("GND")),
        lz_tab=sorted((r["rnd"], r["lz"]) for r in A.tab["liegenschaftszins"]),
        lz_zuschlag=w("LZ_Zuschlag"),
        bodenwert_wachstum=w("Bodenwert_Wachstum"),
        haben=w("Haben"),
        soll=w("Soll"),
        vorlauf=w("Vorlaufzeit_Jahre"),
        swap=w("Swapsatz_30J"),
        dawi_aufschlag=w("DAWI_Aufschlag"),
        zins_bank=w("Zins_Bank"),
        zinsbindung=int(w("Zinsbindung")),
        zins_anschluss=w("Zins_Anschluss"),
        prolongation=int(w("Prolongation")),
        tilgung_anschluss=w("Tilgung_Anschluss"),
        eigenmittel_quote=w("Eigenmittel_Soll"),
        eigenmittel_hart=w("Eigenmittel_hart_Soll"),
    )
    # Ortsübliche Vergleichsmiete und Marktmiete in T1 wie Basisdaten!C46:C49:
    # Anker auf T1 = Fertigstellungsjahr + 1 fortgeschrieben; Marktmiete = Mittel der Anker (+ Zuschlag Standard).
    mf, g = w("Miet_Faktor"), w("OVM_Wachstum")
    au = w("Vertragsmiete_Basis") * mf * (1 + g) ** (P["fj"] + 1 - w("Anker_unten_Jahr"))
    ao = w("Angebotsmiete_Basis") * mf * (1 + g) ** (P["fj"] + 1 - w("Anker_oben_Jahr"))
    ansatz = w("Miete_Ansatz")
    P["markt_start"] = {"unterer Anker": au, "oberer Anker": ao}.get(ansatz, (au + ao) / 2) + w("Zuschlag_Standard")
    P["ovm_start"] = au
    return P


def parameter_referenzprojekt(A):
    """PGN-Referenzprojekt Tarutinoer Straße 4 (Eingaben der Mappe, Szenario Basis): nur für den Abgleich."""
    w = A.w
    P = gemeinsame_annahmen(A)
    P.update(
        name="PGN-Referenzprojekt (Tarutinoer Str. 4, 14 WE, 828 m²)",
        we=w("Wohneinheiten"), wfl=w("Wohnflaeche"), gfl=w("Grundstuecksflaeche"),
        grundstueck=w("KG_Grundstueck_VW"), grundstueck_nk=w("KG_Grundstueck_NK"),
        herstellung=w("KG_Herstellung"), kg800=w("KG_Finanzierung"),
        brw=w("Bodenrichtwert_qm"), mietenstufe=w("Mietenstufe"), effizienz=w("Effizienzstandard"),
    )
    return finalisiere(P)


def parameter_broschuere(A):
    """Broschüren-Modellhaus S. 10 mit den PGN-Annahmesätzen. Quellenliste: QUELLEN (unten)."""
    P = gemeinsame_annahmen(A)
    P.update(
        name="Broschüren-Modellhaus (S. 10: 20 WE, 1.400 m², 7,0 Mio. €)",
        we=20, wfl=1400.0, gfl=None,                 # Grundstücksfläche nicht angegeben; Broschüre: Grundstück unter BRW x Fläche
        grundstueck=700000.0,                        # Broschüre S. 10, Rechenweg Zeile 2 (Sacheinlage, lastenfrei)
        grundstueck_nk=0.0,                          # PH: eingebrachtes Grundstück, keine Erwerbsnebenkosten
        herstellung=1400.0 * 4500.0,                 # Broschüre S. 10, Rechenweg Zeile 1 (KG 200 bis 700)
        kg800=0.0,                                   # PH: Bauzeitzinsen/KG 800 nicht angesetzt (wie Modell, Eingabe!C19)
        brw=None, mietenstufe="IV", effizienz="EH 55",
    )
    P = finalisiere(P)
    assert abs(P["zuwendungsfaehig"] - 7000000.0) < 0.5, P["zuwendungsfaehig"]   # Broschüre S. 10, Zeile 3
    return P


def finalisiere(P):
    """Abgeleitete Größen wie Basisdaten!C23:C33 und C37:C43."""
    band = 1 if P["mietenstufe"] in ("I", "II", "III") else 2
    P["band"] = band
    grund_zuw = P["grundstueck"] if P["brw"] is None else min(P["grundstueck"], P["brw"] * P["gfl"])
    P["zuwendungsfaehig"] = grund_zuw + min(P["herstellung"], P["bemessungsgrenze"][band] * P["wfl"])
    P["gesamtkosten"] = P["grundstueck"] + P["grundstueck_nk"] + P["herstellung"] + P["kg800"]   # Basisdaten!C33
    zu = P["zuschlag_eh40"] if P["effizienz"] in ("EH 40", "EH 40 QNG") else 0.0
    P["startmiete"] = {g: P["hoechstmiete"][g][band] + zu for g in GRUPPEN}
    P["bwk_fix"] = P["verwaltung_we"] * P["we"] + P["instandhaltung_qm"] * P["wfl"]
    return P


# =====================================================================================================
# 2. Finanzmathematik
# =====================================================================================================
def npv(r, cf):
    """Barwert einer datierten Zahlungsreihe cf = [(t, betrag), ...] zum Zins r (t in Jahren, auch negativ)."""
    return sum(c * (1.0 + r) ** (-t) for t, c in cf)


def irr_wurzeln(cf, lo=-0.9, hi=1.0, schritte=380):
    """Alle Nullstellen des Barwerts in [lo, hi] (Rasterscan + Bisektion) als Liste (r, fallend). fallend = True,
    wenn der Barwert dort von + nach - wechselt (Normalfall einer Investition). Mehrere Vorzeichenwechsel in der
    Zahlungsreihe können mehrere Nullstellen erzeugen (z. B. EK ohne Restwert mit Restschuld-Abzug in T35)."""
    xs = [lo + (hi - lo) * i / schritte for i in range(schritte + 1)]
    fs = [npv(x, cf) for x in xs]
    roots = []
    for i in range(schritte):
        a, b, fa, fb = xs[i], xs[i + 1], fs[i], fs[i + 1]
        if fa == 0.0:
            roots.append((a, (fs[i - 1] if i else fb) > 0))
        elif fa * fb < 0:
            fallend = fa > 0
            for _ in range(90):
                m = (a + b) / 2
                fm = npv(m, cf)
                if fa * fm <= 0:
                    b, fb = m, fm
                else:
                    a, fa = m, fm
            roots.append(((a + b) / 2, fallend))
    return roots


class Rendite:
    """Ergebnis einer IRR-Rechnung. Eindeutig: eine Nullstelle. Mehrdeutig: mehrere Nullstellen; dann gilt als
    Wert die größte Nullstelle mit fallendem Barwert (die Lösung, die Excel-IRR mit positivem Startwert findet),
    gekennzeichnet mit *, und maßgeblich ist die VOFI-Rendite (kennzahlen-konzept.md Abschnitt 3.3)."""

    def __init__(self, roots):
        self.roots = [r for r, _ in roots]
        fall = [r for r, f in roots if f]
        self.mehrdeutig = len(self.roots) > 1
        if len(self.roots) == 1:
            self.wert = self.roots[0]
        elif fall:
            self.wert = max(fall)
        else:
            self.wert = None

    def text(self, nk=2):
        if self.wert is None:
            return "keine Nullst." if not self.roots else "n. v.*"
        return pct(self.wert, nk) + ("*" if self.mehrdeutig else "")


def irr(cf):
    return Rendite(irr_wurzeln(cf))


FN_STERN = ("\\* mehrere Nullstellen (Vorzeichenwechsel durch Restschuld oder Schlussrate am Horizont); angegeben ist die "
            "größte Nullstelle mit fallendem Barwert. In diesen Fällen ist die VOFI-EK-Rendite maßgeblich.")


def rbf(p, n):
    """Rentenbarwertfaktor (Vervielfältiger) wie Gefoerdert_*!AB."""
    if n <= 0:
        return 0.0
    if p == 0:
        return float(n)
    return ((1 + p) ** n - 1) / ((1 + p) ** n * p)


def lz_satz(rnd, P, delta=0.0):
    """Liegenschaftszinssatz nach Restnutzungsdauer wie Gefoerdert_*!AA: lineare Interpolation in Eingabe!B124:C129,
    an den Rändern gekappt, plus LZ_Zuschlag (Eingabe!C103) und optional delta (Sensitivität)."""
    tab = P["lz_tab"]
    if rnd <= tab[0][0]:
        v = tab[0][1]
    elif rnd >= tab[-1][0]:
        v = tab[-1][1]
    else:
        k = max(j for j in range(len(tab)) if tab[j][0] <= rnd)
        (r0, s0), (r1, s1) = tab[k], tab[k + 1]
        v = s0 + (rnd - r0) / (r1 - r0) * (s1 - s0)
    return P["lz_zuschlag"] + v + delta


# =====================================================================================================
# 3. Rechenkern: ein Lauf je Gruppe
# =====================================================================================================
# Konventionen der sauberen Referenzrechnung (Kennzahlenkonzept) ...
SAUBER = dict(
    tilgungssatz=None,      # None: 1/Laufzeit_NBank = 2,50 % (Basisdaten!C62); sonst Satz in % des Ursprungsdarlehens
    tilgungsfrei=None,      # None: PGN-Wert 0 Jahre (Eingabe!C26)
    ek_modell=False,        # True: bares EK = 20 % der zuw. Kosten ZUSÄTZLICH zum Grundstück (Eingabe!C88, Befund FR-03)
    be_bank=False,          # True: Bearbeitungsentgelte über ein Bankdarlehen (Basisdaten!C78); False: aus EK in T0
    ek_vorlauf=0.0,         # Jahre, die das EK vor T0 abfließt (datierte Zahlung, wirkt in IRR und VOFI gleich)
    vorlauf_exponent=0.0,   # Modell: Vorlaufzeit NUR im Exponenten der VOFI-Rendite (Bewertung!N5, Eingabe!C107)
    restwert="bestand",     # "bestand": Ertragswert mit fortgeführtem Bindungsabschlag auf einheitlichem Preisstand
                            # "modell":  wie Gefoerdert_*!AC/AD (Marktmiete, Abschlag nur bis BoG_Grenze = 42)
                            # "sachwert": Plausibilisierung, Herstellungskosten indexiert x RND/GND + Boden
    zielmiete="markt",      # Mietniveau, auf das die Bestandsmiete nach dem Horizont steigen kann: "markt" | "ovm"
    rw_faktor=1.0,          # Faktor auf den Gebäude-Restwert (Sensitivität)
    lz_delta=0.0,           # Zu-/Abschlag auf den Liegenschaftszins (Sensitivität)
    vk=0.0,                 # Veräußerungskosten in % des Restwerts (PH; Modell: keine)
    kosten_offset=0,        # Jahre Kostenfortschreibung vor Jahr 1 (0 = Kostenstand 2026 in Jahr 1 wie Modell/Broschüre)
    schlussrate=True,       # Restschuld NBank spätestens in Jahr 42 voll tilgen (RL Nr. 5.3.5: Laufzeit max. 42 J.)
)
# ... und die Mechanik der PGN-Mappe (nur für den Abgleich):
MODELL = dict(SAUBER, ek_modell=True, be_bank=True, vorlauf_exponent=None, restwert="modell", schlussrate=False)


class Lauf:
    """Jahresrechnung T0..T42 einer Gruppe ("A", "B", "C" gefördert; "M" frei finanziert zur Marktmiete, nur
    Objektsicht). Spaltenlogik wie Gefoerdert_*!C:Y, siehe kennzahlen-konzept.md Abschnitt 2."""

    def __init__(self, P, g, **opt):
        self.P, self.g = P, g
        self.K = K = dict(SAUBER)
        K.update(opt)
        if K["vorlauf_exponent"] is None:
            K["vorlauf_exponent"] = P["vorlauf"]
        self.gef = gef = g in GRUPPEN
        n, wfl, mon = P["n"], P["wfl"], P["monate"]
        self.ma = P["mietausfall"] if gef else P["mietausfall_frei"]

        # ---------------- T0: Investition und Finanzierung -------------------------------------------
        Z = P["zuwendungsfaehig"]
        self.D = P["quote_d"][g] * Z if gef else 0.0              # NBank-Darlehen (Basisdaten!C61)
        self.Zu = P["quote_z"][g] * Z if gef else 0.0             # Zuschuss (Basisdaten!C63)
        self.BE_D, self.BE_Z = self.D * P["be_d"], self.Zu * P["be_z"]
        self.BE = self.BE_D + self.BE_Z                           # Bearbeitungsentgelte (Basisdaten!C64)
        self.invest_obj = P["grundstueck"] + P["grundstueck_nk"] + P["herstellung"] + P["kg800"]  # Objektinvestition
        barbedarf = P["herstellung"] + P["kg800"] + P["grundstueck_nk"]                           # Basisdaten!C32
        if K["ek_modell"]:
            ek_bar = P["eigenmittel_quote"] * Z                   # Eingabe!C88 = 0.2*Zuwendungsfaehig
            self.bank0 = max(0.0, barbedarf - self.D - self.Zu + self.BE - ek_bar)   # Basisdaten!C78
        else:
            self.bank0 = self.BE if K["be_bank"] else 0.0
            ek_bar = max(0.0, barbedarf + self.BE - self.D - self.Zu - self.bank0)   # Restgröße
        self.ek_bar = ek_bar
        self.EK = P["grundstueck"] + ek_bar                       # Sacheinlage Grundstück + bares EK (Basisdaten!C126)
        self.kasse0 = self.D + self.Zu + self.bank0 + ek_bar - (barbedarf + self.BE) if gef else 0.0  # Gefoerdert_*!Y6
        # Eigenmittelprüfung RL Nr. 5.2.6 (ohne Bearbeitungsentgelte, die keine Baukosten sind)
        em = P["grundstueck"] + (ek_bar - (self.BE if not (K["be_bank"] or K["ek_modell"]) else 0.0))
        self.eigenmittel = em
        self.eigenmittel_quote = em / Z if Z else 0.0

        # ---------------- NBank-Tilgung ---------------------------------------------------------------
        self.tilgungsfrei = P["tilgungsfrei"] if K["tilgungsfrei"] is None else K["tilgungsfrei"]
        if K["tilgungssatz"] is None:
            self.rate = self.D / max(1, P["laufzeit_nbank"] - self.tilgungsfrei)   # Basisdaten!C62
        else:
            self.rate = K["tilgungssatz"] * self.D
        self.tilgungssatz = self.rate / self.D if self.D else 0.0

        # ---------------- Bankdarlehen (nur Modellkonvention bzw. be_bank) ---------------------------
        i_b = P["zins_bank"]
        tilg_b = (1 / 30) if i_b == 0 else i_b / ((1 + i_b) ** 30 - 1)              # Eingabe!C54
        ann = self.bank0 * (i_b + tilg_b)
        lfz = math.log((i_b + tilg_b) / tilg_b) / math.log(1 + i_b) if i_b > 0 else 30.0
        w_ = self.bank0
        for _ in range(P["zinsbindung"]):
            w_ = w_ * (1 + i_b) - ann
        rest_zb, rlz, z_a = w_, max(0.0, lfz - P["zinsbindung"]), P["zins_anschluss"]
        if P["prolongation"] == 0:
            annP = ann
        elif P["prolongation"] == 1:
            annP = max(0.0, rest_zb) * (z_a + P["tilgung_anschluss"])
        else:
            af = (1 / rlz) if z_a == 0 else z_a * (1 + z_a) ** rlz / ((1 + z_a) ** rlz - 1)
            annP = max(0.0, rest_zb) if rlz <= 0 else max(0.0, rest_zb) * af

        # ---------------- Jahre 1..n ----------------------------------------------------------------
        L = self.L = {k: [0.0] * (n + 1) for k in
                      ("C", "S", "MA", "VW", "IH", "RE", "ZINS", "TILG", "VKB", "BZINS", "BTILG", "KD", "ZUE",
                       "R", "W", "KONTO")}
        L["R"][0], L["W"][0], L["KONTO"][0] = self.D, self.bank0, self.kasse0
        c_prev = 0.0
        gk, off = P["kosten_wachstum"], K["kosten_offset"]
        for t in range(1, n + 1):
            c = self._miete(t, c_prev, cap=self.ovm(t))
            S = c * wfl * mon
            MA = self.ma * S
            VW = P["verwaltung_we"] * P["we"] * (1 + gk) ** (t - 1 + off)
            IH = P["instandhaltung_qm"] * wfl * (1 + gk) ** (t - 1 + off)
            RE = S - MA - VW - IH
            Rp, Wp = L["R"][t - 1], L["W"][t - 1]
            zins = Rp * (P["zins_1_35"] if t <= P["zinsfrei"] else P["zins_ab36"]) if gef else 0.0
            tilg = 0.0 if (not gef or t <= self.tilgungsfrei) else min(self.rate, Rp)
            if gef and K["schlussrate"] and t == n:
                tilg = Rp                                          # Volltilgung spätestens im Jahr 42
            vkb = Rp * P["vkb"] if gef else 0.0
            bz = Wp * (i_b if t <= P["zinsbindung"] else z_a)
            bt = max(0.0, min((annP if t > P["zinsbindung"] else ann) - bz, Wp))
            KD = zins + tilg + vkb + bz + bt
            ZUE = RE - KD
            k_prev = L["KONTO"][t - 1]
            konto = k_prev * (1 + (P["haben"] if k_prev >= 0 else P["soll"])) + ZUE
            for k, v in (("C", c), ("S", S), ("MA", MA), ("VW", VW), ("IH", IH), ("RE", RE), ("ZINS", zins),
                         ("TILG", tilg), ("VKB", vkb), ("BZINS", bz), ("BTILG", bt), ("KD", KD), ("ZUE", ZUE),
                         ("R", max(0.0, Rp - tilg)), ("W", max(0.0, Wp - bt)), ("KONTO", konto)):
                L[k][t] = v
            c_prev = c

    # ---------------- Mieten --------------------------------------------------------------------------
    def markt(self, t):
        return self.P["markt_start"] * (1 + self.P["miet_wachstum"]) ** (t - 1)

    def ovm(self, t):
        return self.P["ovm_start"] * (1 + self.P["miet_wachstum"]) ** (t - 1)

    def _miete(self, t, c_prev, cap):
        """Gebundene Miete wie Gefoerdert_*!C: Jahr 1-3 Höchstmiete, danach alle 3 Jahre +6,15 % (Bindung) bzw.
        Kappung 15/20 % (nach Bindung), jeweils höchstens bis zur Obergrenze cap; frei: Marktmiete."""
        P = self.P
        if not self.gef:
            return self.markt(t)
        if t == 1:
            return P["startmiete"][self.g]
        if t > P["karenz"] and (t - 1 - P["karenz"]) % P["rhythmus"] == 0:
            if t <= P["bindung"]:
                k = P["kappung"]
            else:
                ang = P["marktlage"] == "angespannt" and (P["marktlage_bis"] == 0 or P["fj"] + t <= P["marktlage_bis"])
                k = P["kapp_ang"] if ang else P["kapp_norm"]
            return max(c_prev, min(c_prev * (1 + k), cap))
        return c_prev

    # ---------------- Restwert ------------------------------------------------------------------------
    def restwert(self, H):
        """Restwert am Horizont H, zerlegt in Boden und Gebäude (kennzahlen-konzept.md Abschnitt 4).
        "modell":  Gefoerdert_*!AC - AD: Ertragswert aus der Marktmiete des Folgejahres (konstant) zum LZ(RND),
                   Abschlag für die gebundene Miete nur für die Jahre bis BoG_Grenze = Jahre_n = 42.
        "bestand": periodischer Ertragswert über die Restnutzungsdauer auf Preisstand H+1: Bestandsmiete nach H
                   fortgeschrieben (Kappung je 3 Jahre bis zur Zielmiete), mit der Mietsteigerung deflationiert,
                   Bewirtschaftung auf Preisstand H+1, abgezinst zum LZ(RND); Boden abgezinst über RND.
                   Bei Miete = Zielmiete von Anfang an identisch mit dem allgemeinen Ertragswertverfahren."""
        P, K = self.P, self.K
        wfl, mon, gm = P["wfl"], P["monate"], P["miet_wachstum"]
        boden = P["grundstueck"] * (1 + P["bodenwert_wachstum"]) ** H
        rnd = P["gnd"] - H
        p = lz_satz(rnd, P, K["lz_delta"])
        if K["restwert"] == "modell":
            vv = rbf(p, rnd)
            z = self.markt(H + 1) * wfl * mon * (1 - P["mietausfall"]) - P["bwk_fix"] * (1 + P["kosten_wachstum"]) ** H
            ac = boden + max(0.0, z - boden * p) * vv
            ad = 0.0
            if self.gef:
                mref = self.markt(H + 1) if H + 1 <= P["n"] else 0.0
                for s in range(H + 1, P["n"] + 1):
                    diff = mref - self.L["C"][s]
                    if diff > 0:
                        ad += diff * wfl * mon * (1 - P["mietausfall"]) / (1 + p) ** (s - H)
            voll, abschlag = ac - ad, ad
        elif K["restwert"] == "sachwert":
            # Plausibilisierung: Herstellungskosten mit der Kostensteigerung fortgeschrieben, lineare Alterswertminderung
            geb_sw = P["herstellung"] * (1 + P["kosten_wachstum"]) ** H * max(0, rnd) / P["gnd"]
            voll, abschlag, ac = boden + geb_sw, 0.0, boden + geb_sw
        else:
            c = self.L["C"][H] if H > 0 else 0.0
            ew = 0.0
            ew_markt = 0.0                                          # Vergleich: gleiche Rechnung zur Zielmiete
            for k in range(1, rnd + 1):
                s = H + k
                ziel = self.markt(s) if K["zielmiete"] == "markt" else self.ovm(s)
                if s <= P["n"]:
                    c = self.L["C"][s] if s <= H else self._miete(s, c, cap=ziel)
                else:
                    c = self._miete(s, c, cap=ziel)
                if not self.gef:
                    ziel = c = self.markt(s)
                bwk = P["bwk_fix"] * (1 + P["kosten_wachstum"]) ** (s - 1 + K["kosten_offset"])
                defl = (1 + gm) ** (s - (H + 1))
                ew += (c * wfl * mon * (1 - self.ma) - bwk) / defl / (1 + p) ** k
                ew_markt += (ziel * wfl * mon * (1 - self.ma) - bwk) / defl / (1 + p) ** k
            ew += boden / (1 + p) ** rnd
            ew_markt += boden / (1 + p) ** rnd
            voll, abschlag, ac = ew, ew_markt - ew, ew_markt
        geb = voll - boden
        f, vk = K["rw_faktor"], K["vk"]
        return dict(boden=boden, gebaeude=geb, voll=voll, ertragswert_vor_abschlag=ac, abschlag=abschlag, lz=p,
                    rnd=rnd, mit=(boden + f * geb) * (1 - vk), oG=boden * (1 - vk), null=0.0)

    # ---------------- Kennzahlen am Horizont H --------------------------------------------------------
    def kennzahlen(self, H):
        P, K, L = self.P, self.K, self.L
        rw = self.restwert(H)
        out = {"rw": rw}
        # Objekt-Zahlungsreihe (unlevered): -Investition in T0, Reinertrag T1..TH, Restwert in TH
        for art, i0 in (("brutto", self.invest_obj), ("nZ", self.invest_obj - (self.Zu - self.BE_Z))):
            for v in ("mit", "oG", "null"):
                cf = [(0, -i0)] + [(t, L["RE"][t]) for t in range(1, H + 1)]
                cf[-1] = (H, cf[-1][1] + rw[v])
                out[f"obj_{art}_{v}"] = irr(cf)
        if not self.gef:
            return out
        # EK-Zahlungsreihe (levered): -EK (ggf. vor T0), Kasse T0 (nur Modellkonvention), ZÜ T1..TH,
        # in TH zusätzlich Restwert - Restschuld (NBank + Bank, Nennwert)
        rest = L["R"][H] + L["W"][H]
        out["restschuld"] = rest
        vl = K["ek_vorlauf"]
        expo = H + vl + K["vorlauf_exponent"]
        for v in ("mit", "oG", "null"):
            cf = [(-vl, -self.EK), (0, self.kasse0)] + [(t, L["ZUE"][t]) for t in range(1, H + 1)]
            cf[-1] = (H, cf[-1][1] + rw[v] - rest)
            out[f"ek_irr_{v}"] = irr(cf)
            ev = L["KONTO"][H] + rw[v] - rest                    # VOFI-Endvermögen (Bewertung!M bzw. D-E)
            out[f"ek_ev_{v}"] = ev
            out[f"ek_vofi_{v}"] = (ev / self.EK) ** (1 / expo) - 1 if ev > 0 else None
        return out

    # ---------------- Liquidität ----------------------------------------------------------------------
    def dscr(self, t):
        kd = self.L["KD"][t]
        return self.L["RE"][t] / kd if kd > 1e-9 else None

    def liquiditaet(self, H):
        L = self.L
        zue = L["ZUE"][1:H + 1]
        kum, kum_min = 0.0, 0.0
        for z in zue:
            kum += z
            kum_min = min(kum_min, kum)
        ds = [self.dscr(t) for t in range(1, H + 1) if self.dscr(t) is not None]
        neg = [t for t in range(1, H + 1) if L["ZUE"][t] < 0]
        return dict(zue_min=min(zue), zue_summe=sum(zue), kum_min=kum_min, dscr_min=min(ds) if ds else None,
                    jahre_neg=len(neg), letztes_neg=max(neg) if neg else None)

    def foerderbarwert(self, i_kalk):
        """Barwert der Förderung zum Kalkulationszins i_kalk: Zuschuss netto + (Darlehen - Barwert des NBank-
        Kapitaldienstes) - Bearbeitungsentgelt Darlehen. Nur Information (kennzahlen-konzept.md Abschnitt 3.2)."""
        L, n = self.L, self.P["n"]
        bw_kd = sum((L["ZINS"][t] + L["TILG"][t] + L["VKB"][t]) / (1 + i_kalk) ** t for t in range(1, n + 1))
        return dict(zuschuss=self.Zu - self.BE_Z, darlehen=self.D - bw_kd - self.BE_D,
                    gesamt=self.Zu - self.BE_Z + self.D - bw_kd - self.BE_D)


# =====================================================================================================
# 4. Formatierung (deutsch)
# =====================================================================================================
def _de(s):
    return s.replace(",", "X").replace(".", ",").replace("X", ".")


def eur(x, vz=False):
    if x is None:
        return "n. v."
    s = _de(f"{x:,.0f}")
    if s in ("-0",):
        s = "0"
    s = s.replace("-", "−")
    return ("+" + s) if (vz and x > 0.5) else s


def mio(x, nk=2):
    return "n. v." if x is None else _de(f"{x / 1e6:,.{nk}f}").replace("-", "−")


def pct(x, nk=2):
    if x is None:
        return "n. v."
    if isinstance(x, Rendite):
        return x.text(nk)
    return _de(f"{x * 100:,.{nk}f}").replace("-", "−") + " %"


def pp(x, nk=2):
    if x is None:
        return "n. v."
    s = _de(f"{x * 100:+,.{nk}f}").replace("-", "−")
    return s + " Pp"


def num(x, nk=2):
    return "n. v." if x is None else _de(f"{x:,.{nk}f}").replace("-", "−")


def tabelle(kopf, zeilen, ausr=None):
    ausr = ausr or (["l"] + ["r"] * (len(kopf) - 1))
    sep = ["---:" if a == "r" else "---" for a in ausr]
    out = ["| " + " | ".join(kopf) + " |", "| " + " | ".join(sep) + " |"]
    out += ["| " + " | ".join(str(c) for c in z) + " |" for z in zeilen]
    return "\n".join(out)


def tabelle_fn(kopf, zeilen, ausr=None):
    """Tabelle; hängt die Fußnote zu mehrdeutigen IRR an, wenn ein Wert mit * vorkommt."""
    t = tabelle(kopf, zeilen, ausr)
    return t + ("\n\n" + FN_STERN if "%*" in t else "")


def rv(r):
    """Rendite-Objekt oder float -> float (None, wenn nicht eindeutig)."""
    return r.wert if isinstance(r, Rendite) else r


# =====================================================================================================
# 5. Auswertung und Bericht
# =====================================================================================================
QUELLEN_TEXT = None  # wird in bericht() gefüllt


def quellen(A, P):
    """Annahmentabelle: (Größe, Wert, Fundstelle, Status). Status: PGN = Wert aus dem PGN-Modell,
    BR = Broschüre, RL = Richtlinie, PH = Platzhalter (für das Broschürenprojekt nicht belegt)."""
    r = A.ref
    q = [
        ("Wohnungen / Wohnfläche", "20 WE / 1.400 m²", "Broschüre S. 10", "BR"),
        ("Herstellungskosten KG 200 bis 700", "6.300.000 € (4.500 €/m²)", "Broschüre S. 10, Rechenweg Z. 1", "BR"),
        ("Grundstück (Sacheinlage, lastenfrei)", "700.000 €, unter Bodenrichtwert × Fläche", "Broschüre S. 10, Z. 2", "BR"),
        ("Grundstücksnebenkosten KG 120", "0 €", "eingebrachtes Grundstück; Modell Eingabe!C90 = 0", "PH"),
        ("KG 800 / Bauzeitzinsen", "0 €", "wie Modell Eingabe!C19 = 0 (Bauzeitrechnung C91:C95 nur informativ)", "PH"),
        ("Zuwendungsfähige Kosten", "7.000.000 €", "Broschüre S. 10, Z. 3; Formel wie Basisdaten!C27", "BR"),
        ("Darlehen/Zuschuss A, B, C", "40/40, 60/20, 70/10 %", f"{r('Quote_D_A')}:{r('Quote_D_C').split('!')[1]}, {r('Quote_Z_C')}; RL Nr. 5.3.3", "RL"),
        ("Höchstmiete Jahr 1 bis 3", "6,80 / 8,20 / 9,00 €/m²", "Eingabe!E119:G119; RL Nr. 5.4.4", "RL"),
        ("Mietausfall", pct(P["mietausfall"], 1) + " der Sollmiete", r("Mietausfall"), "PGN"),
        ("Nicht umlagefähige Bewirtschaftung", f"{eur(P['verwaltung_we'])} € je WE p. a. (Verwaltung); Betriebskosten voll umgelegt", r("Verwaltung_WE"), "PGN"),
        ("Instandhaltung", f"{num(P['instandhaltung_qm'])} € je m² p. a.", r("Instandhaltung_qm"), "PGN"),
        ("Kostensteigerung", pct(P["kosten_wachstum"], 1) + " p. a. ab Jahr 2; Jahr 1 = Kostenstand 2026", f"{r('Kosten_Wachstum')}; Gefoerdert_A!G7", "PGN"),
        ("Tilgung NBank", f"{pct(1 / P['laufzeit_nbank'])} p. a. linear (1/{P['laufzeit_nbank']:.0f}), ab Jahr 1", "Basisdaten!C62, Eingabe!C25/C26", "PGN"),
        ("Zins NBank", f"0 % bis Jahr {P['zinsfrei']}, danach {pct(P['zins_ab36'])} auf die Restschuld", f"{r('Zins_NBank_ab36')} (Vorbehalt im Modell); RL Nr. 5.3.4", "PGN/RL"),
        ("Verwaltungskostenbeitrag", "0,5 % p. a. des Restkapitals zu Jahresbeginn", f"{r('VKB_Satz')}; RL Nr. 12.7.1", "RL"),
        ("Bearbeitungsentgelte", "1 % Darlehen + 0,75 % Zuschuss, einmalig in T0, aus Eigenkapital", "RL Nr. 12.7.2/12.7.3; Modell: Bankdarlehen (Basisdaten!C78)", "RL/PH"),
        ("Bares Eigenkapital", "Restgröße: Herstellung − Darlehen − Zuschuss + Entgelte", "Kennzahlenkonzept Abschn. 2.1 (statt Eingabe!C88, Befund FR-03)", "PH"),
        ("Mieterhöhung", "ab Jahr 4 alle 3 Jahre +6,15 % (Ausschöpfung), nach Bindung 20 % je 3 Jahre, max. Vergleichsmiete",
         "Eingabe!C73:C79; Gefoerdert_A!C7", "PGN"),
        ("Vergleichsmiete / Marktmiete Jahr 1", f"{num(P['ovm_start'])} / {num(P['markt_start'])} €/m², +2 % p. a.",
         "Basisdaten!C46:C49 (Standort Neu Wulmstorf, Mietenstufe VI)", "PH"),
        ("Restwert", "Ertragswert, GND 80 J., LZ-Kurve 2,5 bis 3,1 %, Bindungsabschlag bis zur Zielmiete fortgeführt", "Eingabe!C105, B124:C129; Konzept Abschn. 4", "PGN/PH"),
        ("Bodenwert", "700.000 € + 1,5 % p. a.", f"{r('Bodenwert_Wachstum')}", "PGN"),
        ("Veräußerungskosten", "0 % (Sensitivität 5 %)", "Modell: keine", "PH"),
        ("Wiederanlage VOFI-Konto", "Haben 2 %, Soll 5 %", f"{r('Haben')}, {r('Soll')}", "PGN"),
        ("Horizonte", "T35 (Bindungsende) und T42 (Darlehensende); T0 = Bezugsfertigkeit, EK in T0", "Konzept Abschn. 2.4", "PH"),
        ("Grenzwert Überkompensation", f"Swap 30 J. {pct(P['swap'])} + 100 Bp = {pct(P['swap'] + P['dawi_aufschlag'])}",
         "Ueberkompensation!C5:C7 (Stand 19.08.2026; Faktbasis G3-25: 3,43 % am 19.10.2026)", "PGN/PH"),
    ]
    return q


def berechne(A):
    Pb = parameter_broschuere(A)
    Pr = parameter_referenzprojekt(A)
    R = {}
    R["P"], R["Pref"] = Pb, Pr
    R["lauf"] = {g: Lauf(Pb, g) for g in GRUPPEN + ("M",)}
    R["kz"] = {(g, H): R["lauf"][g].kennzahlen(H) for g in GRUPPEN + ("M",) for H in (35, 42)}
    return R


def bericht(A, R):
    P = R["P"]
    lauf, kz = R["lauf"], R["kz"]
    o = []
    w = o.append
    heute = date.today().strftime("%d.%m.%Y")
    w("# Referenzrechnung: Kennzahlen vor Steuern für das Broschüren-Modellprojekt")
    w("")
    w(f"**Stand:** {heute}. **Internes Werkzeug, nicht zur Weitergabe.** Erzeugt von `referenzrechnung.py` "
      f"aus `annahmen.json` (SHA-256 `{A.sha[:12]}…`). Begriffe, Zahlungsreihen und Darstellungsregeln: "
      "`kennzahlen-konzept.md`. Die Broschüre selbst zeigt keine Renditen, nur den Zahlungsüberschuss p. a. (Abschnitt 2).")
    w("")
    w("Modellprojekt: Broschüre S. 10 (20 WE, 1.400 m², Herstellung 6,3 Mio. €, Grundstück 0,7 Mio. € als Sacheinlage, "
      "zuwendungsfähig 7,0 Mio. €, Mietenstufe IV bis VII), Gruppen A, B, C jeweils zu 100 %. Annahmesätze aus dem "
      "PGN-VOFI-Modell v2-1 (Szenario Basis); wo das Modell für dieses Projekt nichts hergibt, gelten die als **PH** "
      "markierten Platzhalter (Abschnitt 1). Alle Werte nominal, vor Steuern, T0 = Bezugsfertigkeit.")
    w("")

    # ------------------------------------------------------------------ 0. Kernergebnisse
    w("## 0. Kernergebnisse")
    w("")
    w("**Vier Renditekennzahlen je Gruppe** (IRR, Horizont T42 = Darlehensende; in Klammern T35 = Bindungsende). "
      "„mit RW“ = Boden + Gebäude, „ohne Geb.-RW“ = nur Bodenwert, „ohne RW“ = Restwert null.")
    w("")
    rows = []
    defs = [("Objektrendite nach Zuschuss, mit RW", "obj_nZ_mit"), ("Objektrendite nach Zuschuss, ohne Geb.-RW", "obj_nZ_oG"),
            ("EK-Rendite (EK-IRR), mit RW", "ek_irr_mit"), ("EK-Rendite (EK-IRR), ohne Geb.-RW", "ek_irr_oG")]
    for lab, key in defs:
        rows.append([lab] + [f"{pct(kz[(g, 42)][key])} ({pct(kz[(g, 35)][key])})" for g in GRUPPEN])
    w(tabelle_fn(["Kennzahl", "A", "B", "C"], rows))
    w("")
    w("Nachrichtlich (T42): Objektrendite brutto vor Förderung mit RW " +
      ", ".join(f"{g} {pct(kz[(g, 42)]['obj_brutto_mit'])}" for g in GRUPPEN) +
      f"; frei finanziert zur Marktmiete {pct(kz[('M', 42)]['obj_brutto_mit'])}. Ohne jeden Restwert: Objekt nach Zuschuss " +
      ", ".join(f"{g} {pct(kz[(g, 42)]['obj_nZ_null'])}" for g in GRUPPEN) + "; EK-IRR " +
      ", ".join(f"{g} {pct(kz[(g, 42)]['ek_irr_null'])}" for g in GRUPPEN) + ". VOFI-EK-Rendite mit RW " +
      ", ".join(f"{g} {pct(kz[(g, 42)]['ek_vofi_mit'])}" for g in GRUPPEN) + ".")
    w("")
    j1 = {g: lauf[g] for g in GRUPPEN}
    w("**Jahresrechnung Jahr 1 (Broschüre S. 11, Zeile 8):** Zahlungsüberschuss " +
      ", ".join(f"{g} {eur(j1[g].L['ZUE'][1])} €" for g in GRUPPEN) +
      f" bei {pct(lauf['A'].tilgungssatz)} Tilgung. Die vier Annahmen für die Broschüre: Mietausfall "
      f"{pct(P['mietausfall'], 1)} der Sollmiete; nicht umlagefähige Bewirtschaftungskosten {eur(P['verwaltung_we'])} € je Wohnung "
      f"p. a. (Verwaltung, Betriebskosten voll umgelegt); Instandhaltung {num(P['instandhaltung_qm'])} € je m² p. a.; Tilgung "
      f"{pct(1 / P['laufzeit_nbank'])} p. a. linear (PGN-Annahme, die RL nennt keinen Satz).")
    w("")

    # ------------------------------------------------------------------ 1. Annahmen
    w("## 1. Annahmen und Quellen")
    w("")
    w("Status: **PGN** Wert aus dem PGN-Modell (Fundstelle), **BR** Broschüre, **RL** Richtlinie Mietwohnraum 2026, "
      "**PH** Platzhalter, für das Broschürenprojekt nicht belegt, vor externer Verwendung durch PGN zu bestätigen.")
    w("")
    w(tabelle(["Größe", "Ansatz", "Fundstelle", "Status"], quellen(A, P), ["l", "l", "l", "l"]))
    w("")
    a = lauf["A"]
    w(f"Finanzierung T0 (sauber, je Gruppe gleiches EK-Prinzip): Grundstück {eur(P['grundstueck'])} € als Sacheinlage + bares EK "
      f"(A {eur(lauf['A'].ek_bar)} €, B {eur(lauf['B'].ek_bar)} €, C {eur(lauf['C'].ek_bar)} €, jeweils 700.000 € + Bearbeitungsentgelte). "
      f"Eingesetztes EK: A {eur(lauf['A'].EK)} €, B {eur(lauf['B'].EK)} €, C {eur(lauf['C'].EK)} €. "
      f"Eigenmittel ohne Entgelte {eur(a.eigenmittel)} € = {pct(a.eigenmittel_quote, 1)} der zuwendungsfähigen Kosten, "
      "vollständig in harter Form (Geld oder lastenfreies Grundstück, RL Nr. 5.2.6). Kein Bankdarlehen.")
    w("")

    # ------------------------------------------------------------------ 2. Jahresrechnung
    w("## 2. Jahresrechnung Jahr 1 bis 3 im Schema der Broschüren-S. 11 (€ p. a.)")
    w("")
    for t in (1, 2, 3):
        L = {g: lauf[g].L for g in GRUPPEN}
        z = []
        z.append(["1", f"Sollmiete (1.400 m² × 6,80 / 8,20 / 9,00 € × 12)"] + [eur(L[g]["S"][t]) for g in GRUPPEN])
        z.append(["", f"− Mietausfall/Leerstand {pct(P['mietausfall'], 1)}"] + [eur(-L[g]["MA"][t]) for g in GRUPPEN])
        z.append(["2", f"− nicht umlagefähige Bewirtschaftungskosten ({eur(P['verwaltung_we'] * (1 + P['kosten_wachstum']) ** (t - 1))} € je Wohnung)"] +
                 [eur(-L[g]["VW"][t]) for g in GRUPPEN])
        z.append(["3", f"− Instandhaltung ({num(P['instandhaltung_qm'] * (1 + P['kosten_wachstum']) ** (t - 1))} € je m²)"] +
                 [eur(-L[g]["IH"][t]) for g in GRUPPEN])
        z.append(["4", "= Überschuss vor Kapitaldienst"] + [eur(L[g]["RE"][t]) for g in GRUPPEN])
        z.append(["5", "− Verwaltungskostenbeitrag, 0,5 % des Restkapitals"] + [eur(-L[g]["VKB"][t]) for g in GRUPPEN])
        z.append(["6", "− Zins NBank-Darlehen, 0 %"] + [eur(-L[g]["ZINS"][t]) for g in GRUPPEN])
        z.append(["7", f"− Tilgung {pct(lauf['A'].tilgungssatz)} auf 2,8 / 4,2 / 4,9 Mio. €"] + [eur(-L[g]["TILG"][t]) for g in GRUPPEN])
        z.append(["8", "**= Zahlungsüberschuss p. a.**"] + [f"**{eur(L[g]['ZUE'][t])}**" for g in GRUPPEN])
        w(f"**Jahr {t}**" + (" (Broschürenwerte)" if t == 1 else " (Kosten +2 % p. a., VKB auf das gesunkene Restkapital)"))
        w("")
        w(tabelle(["", "Position", "A", "B", "C"], z, ["l", "l", "r", "r", "r"]))
        w("")
    w(f"Einmalig in T0, außerhalb der Jahresrechnung: Bearbeitungsentgelte A {eur(lauf['A'].BE)} €, B {eur(lauf['B'].BE)} €, "
      f"C {eur(lauf['C'].BE)} €. Rundung auf ganze Euro je Zeile; die Summenzeilen sind aus ungerundeten Werten gebildet "
      "und stimmen mit den gerundeten Zeilen überein.")
    w("")
    dA, dB, dC = (lauf[g] for g in GRUPPEN)
    sB = ((dB.L["S"][1] - dB.L["MA"][1]) - (dA.L["S"][1] - dA.L["MA"][1]) - (dB.L["VKB"][1] - dA.L["VKB"][1])) / (dB.D - dA.D)
    sC = ((dC.L["S"][1] - dC.L["MA"][1]) - (dA.L["S"][1] - dA.L["MA"][1]) - (dC.L["VKB"][1] - dA.L["VKB"][1])) / (dC.D - dA.D)
    w(f"Folgen für S. 11/12: Mit {pct(P['mietausfall'], 1)} Mietausfall sinken die Tilgungsschwellen „B bzw. C gegenüber A“ auf "
      f"**B {pct(sB)}** und **C {pct(sC)}** (bisher im Text 1,18 / 1,26 % ohne Mietausfall). Break-even-Tilgung Jahr 1 "
      f"(Zahlungsüberschuss = 0): A {pct((dA.L['RE'][1] - dA.L['VKB'][1]) / dA.D)}, B {pct((dB.L['RE'][1] - dB.L['VKB'][1]) / dB.D)}, "
      f"C {pct((dC.L['RE'][1] - dC.L['VKB'][1]) / dC.D)}.")
    w("")

    # ------------------------------------------------------------------ 3. Liquidität
    w("## 3. Liquiditätskennzahlen")
    w("")
    w("DSCR = Überschuss vor Kapitaldienst ÷ Kapitaldienst (VKB + Zins + Tilgung). Kumulierter Fehlbetrag = tiefster Stand "
      "der aufsummierten Zahlungsüberschüsse ohne Zinsen, also der Liquiditätsbedarf, den das EK zusätzlich vorhalten muss.")
    w("")
    z = []
    for lab, f in (("Zahlungsüberschuss Jahr 1", lambda l: eur(l.L["ZUE"][1])),
                   ("DSCR Jahr 1", lambda l: num(l.dscr(1))),
                   ("DSCR Minimum T1 bis T35", lambda l: num(l.liquiditaet(35)["dscr_min"])),
                   ("Zahlungsüberschuss Minimum T1 bis T35", lambda l: eur(l.liquiditaet(35)["zue_min"])),
                   ("Jahre mit negativem Überschuss (T1 bis T35)", lambda l: str(l.liquiditaet(35)["jahre_neg"]) +
                    (f" (zuletzt Jahr {l.liquiditaet(35)['letztes_neg']})" if l.liquiditaet(35)["letztes_neg"] else "")),
                   ("Größter kumulierter Fehlbetrag", lambda l: eur(l.liquiditaet(42)["kum_min"])),
                   ("Summe Zahlungsüberschuss T1 bis T35", lambda l: eur(l.liquiditaet(35)["zue_summe"])),
                   ("Summe Zahlungsüberschuss T1 bis T42", lambda l: eur(l.liquiditaet(42)["zue_summe"])),
                   ("Restschuld NBank Ende T35", lambda l: f"{eur(l.L['R'][35])} ({pct(l.L['R'][35] / l.D, 1)})"),
                   ("Kapitaldienst T36 (VKB + 3,74 % Zins + Tilgung)", lambda l: eur(l.L["KD"][36])),
                   ):
        z.append([lab] + [f(lauf[g]) for g in GRUPPEN])
    w(tabelle(["Kennzahl", "A", "B", "C"], z))
    w("")
    fb = {g: lauf[g].foerderbarwert(P["zins_bank"]) for g in GRUPPEN}
    w(f"Förderbarwert zum Kalkulationszins {pct(P['zins_bank'])} (Bankzins Eingabe!C51, nur Information): Zuschuss netto + "
      "Barwertvorteil des Darlehens = " + "; ".join(f"{g} {mio(fb[g]['zuschuss'])} + {mio(fb[g]['darlehen'])} = "
                                                   f"**{mio(fb[g]['gesamt'])} Mio. €**" for g in GRUPPEN) +
      ". Der Darlehensvorteil steckt nicht in der Objektrendite nach Zuschuss, nur in der EK-Rendite.")
    w("")

    # ------------------------------------------------------------------ 4. Renditen
    w("## 4. Renditekennzahlen (Matrix)")
    w("")
    w("Zahlungsreihen nach `kennzahlen-konzept.md` Abschnitt 2: **Objekt brutto** −(Grundstück + Herstellung) in T0, "
      "Reinertrag T1…TH, Restwert in TH. **Objekt nach Zuschuss** wie brutto, Investition um den Zuschuss abzüglich "
      "Bearbeitungsentgelt Zuschuss gemindert. **EK-IRR** −EK in T0, Zahlungsüberschuss T1…TH, in TH Restwert − Restschuld. "
      "**VOFI-EK** (Endvermögen ÷ EK)^(1/H) − 1, Konto mit 2 % Haben / 5 % Soll, gleiche Zeitbasis wie der IRR.")
    w("")
    for H in (42, 35):
        z = []
        for lab, key in (("Objekt brutto (vor Förderung)", "obj_brutto"), ("Objekt nach Zuschuss", "obj_nZ"),
                         ("EK-IRR", "ek_irr"), ("VOFI-EK-Rendite", "ek_vofi")):
            for v, vl in (("mit", "mit RW"), ("oG", "ohne Geb.-RW"), ("null", "ohne RW")):
                cells = [pct(kz[(g, H)][f"{key}_{v}"]) for g in GRUPPEN]
                m = pct(kz[("M", H)][f"{key}_{v}"]) if key.startswith("obj") else "–"
                z.append([f"{lab}, {vl}"] + cells + [m])
        w(f"**Horizont T{H}**" + (" (Darlehensende, wie Modell-Horizont)" if H == 42 else " (Bindungsende = Betrauungszeitraum)"))
        w("")
        w(tabelle_fn(["Kennzahl", "A", "B", "C", "Frei, Marktmiete"], z))
        w("")
        rw = {g: kz[(g, H)]["rw"] for g in GRUPPEN + ("M",)}
        w(f"Restwert T{H} (Mio. €): " + "; ".join(f"{g if g != 'M' else 'Frei'} {mio(rw[g]['voll'])} = Boden {mio(rw[g]['boden'])} "
                                              f"+ Gebäude {mio(rw[g]['gebaeude'])}" for g in GRUPPEN + ("M",)) +
          f". Bindungsabschlag gegenüber Marktmietniveau: " + ", ".join(f"{g} {mio(rw[g]['abschlag'])}" for g in GRUPPEN) +
          f" Mio. €. LZ {pct(rw['A']['lz'])} bei RND {rw['A']['rnd']} J.; Restschuld NBank T{H}: " +
          ", ".join(f"{g} {mio(kz[(g, H)]['restschuld'])}" for g in GRUPPEN) + " Mio. €.")
        w("")
    w("Lesart: Brutto liegt A < B < C (höhere Miete), nach Zuschuss kehrt sich die Folge um (A hat den größten Zuschuss). "
      "Die EK-Sicht enthält zusätzlich den Zinsvorteil des Darlehens und die Hebelwirkung. „Ohne Geb.-RW“ ist die "
      "vorsichtige Lesart für Investoren (Boden bleibt); „ohne RW“ unterstellt, dass auch der Boden wertlos ist, und dient "
      "nur als Untergrenze. Frei finanziert: nur Objektsicht (keine Finanzierungsannahme im Broschürenprojekt).")
    w("")

    # ------------------------------------------------------------------ 5. Überkompensation
    w("## 5. Überkompensationskennzahl der NBank (getrennt von den Investorenkennzahlen)")
    w("")
    gw = P["swap"] + P["dawi_aufschlag"]
    w(f"RL Nr. 11.10 Abs. 3/4: EK-Rendite aus einem VOFI, bezogen auf das einzusetzende EK, Grenzwert Swap 30 J. + 100 Bp = "
      f"**{pct(gw)}** (Swapsatz {pct(P['swap'])} vom 19.08.2026, PH: vor Verwendung aktualisieren). Methode, Horizont und "
      "Restwert sind in der RL nicht festgelegt; DAWI-Beschluss Art. 6 Abs. 1: IRR über den Betrauungszeitraum. "
      "Primärgröße hier: VOFI-EK-Rendite mit Restwert; Gegenrechnung: EK-IRR mit Restwert; beide für T35 und T42 auf derselben "
      "Zeitbasis. Varianten ohne Restwert nur nachrichtlich.")
    w("")
    z = []
    for lab, key, H in (("VOFI-EK mit RW, T35", "ek_vofi_mit", 35), ("VOFI-EK mit RW, T42", "ek_vofi_mit", 42),
                        ("EK-IRR mit RW, T35", "ek_irr_mit", 35), ("EK-IRR mit RW, T42", "ek_irr_mit", 42),
                        ("nachr.: VOFI-EK ohne Geb.-RW, T35", "ek_vofi_oG", 35), ("nachr.: EK-IRR ohne Geb.-RW, T35", "ek_irr_oG", 35),
                        ("nachr.: VOFI-EK ohne RW, T35", "ek_vofi_null", 35), ("nachr.: EK-IRR ohne RW, T35", "ek_irr_null", 35)):
        cells = []
        for g in GRUPPEN:
            v = rv(kz[(g, H)][key])
            cells.append(f"{pct(kz[(g, H)][key])} ({pp(v - gw) if v is not None else 'n. v.'})")
        z.append([lab] + cells)
    w(tabelle_fn(["Größe (Abstand zum Grenzwert)", "A", "B", "C"], z))
    w("")
    befund = {}
    for g in GRUPPEN:
        mit = [rv(kz[(g, H)][k]) for H in (35, 42) for k in ("ek_vofi_mit", "ek_irr_mit")]
        befund[g] = "nicht erfüllt (ergänzende Prüfung Art. 6 Abs. 4)" if any(v is not None and v > gw for v in mit) else "erfüllt"
    w("Befund nach der konservativen Regel des Konzepts (nicht erfüllt, sobald eine Variante mit Restwert über dem Grenzwert "
      "liegt): " + "; ".join(f"{g}: {befund[g]}" for g in GRUPPEN) + ". Das ist keine Aussage der NBank, nur die "
      "Orientierungsrechnung; die maßgebliche Größe ist mit der NBank abzustimmen.")
    w("")

    # ------------------------------------------------------------------ 6. Sensitivität Tilgung
    w("## 6. Sensitivität Tilgungssatz")
    w("")
    w("Linear in % des Ursprungsdarlehens ab Jahr 1 (Ausnahme: Aufschub). Liegt der Satz unter 1/42, wird die Restschuld "
      "im Jahr 42 als Schlussrate getilgt (RL Nr. 5.3.5: Laufzeit höchstens 42 Jahre); die Spalte nennt deren Höhe.")
    w("")
    tilg = [("0,00 % (nur VKB)", 0.0, 0), ("1,00 %", 0.01, 0), ("1,25 % (WFB 2024, Jahr 1 bis 35)", 0.0125, 0),
            ("1,50 %", 0.015, 0), ("2,00 %", 0.02, 0), ("2,38 % (1/42, Volltilgung in 42 J.)", 1 / 42, 0),
            ("2,50 % (PGN, 1/40)", 0.025, 0), ("2,70 % nach 5 J. Aufschub (1/37)", 1 / 37, 5),
            ("3,03 % (PGN Worst, 1/33)", 1 / 33, 0)]
    z1, z2 = [], []
    for lab, ts, tf in tilg:
        ls = {g: Lauf(P, g, tilgungssatz=ts, tilgungsfrei=tf) for g in GRUPPEN}
        k42 = {g: ls[g].kennzahlen(42) for g in GRUPPEN}
        schluss = max(0.0, 1 - ts * (P["n"] - tf))
        z1.append([lab] + [eur(ls[g].L["ZUE"][1]) for g in GRUPPEN] + [num(ls[g].dscr(1)) if ls[g].dscr(1) else "–" for g in GRUPPEN]
                  + [eur(ls[g].liquiditaet(42)["kum_min"]) for g in GRUPPEN] + [pct(schluss, 0)])
        z2.append([lab] + [pct(k42[g]["ek_irr_mit"]) for g in GRUPPEN] + [pct(k42[g]["ek_irr_oG"]) for g in GRUPPEN]
                  + [pct(k42[g]["ek_vofi_mit"]) for g in GRUPPEN])
    w("**Liquidität**")
    w("")
    w(tabelle(["Tilgung", "ZÜ J1 A", "ZÜ J1 B", "ZÜ J1 C", "DSCR J1 A", "DSCR J1 B", "DSCR J1 C",
               "kum. Fehlbetrag A", "kum. Fehlbetrag B", "kum. Fehlbetrag C", "Schlussrate T42"], z1))
    w("")
    w("**Renditen T42**")
    w("")
    w(tabelle_fn(["Tilgung", "EK-IRR mit RW A", "B", "C", "EK-IRR ohne Geb.-RW A", "B", "C", "VOFI-EK mit RW A", "B", "C"], z2))
    w("")
    w("Lesart: Bei 0 % Zins ist eine niedrigere Tilgung für den Eigentümer ein zinsloser Aufschub: Liquidität und EK-Rendite "
      "steigen, die Objektrendite bleibt gleich (sie ist finanzierungsunabhängig). Der Tilgungssatz verschiebt deshalb die "
      "EK-Renditen und vor allem die Rangfolge der Gruppen im Zahlungsüberschuss (S. 12), nicht die Objektrendite.")
    w("")

    # ------------------------------------------------------------------ 7. Sensitivität Restwert
    w("## 7. Sensitivität Restwert")
    w("")
    var = [("Basis: Ertragswert, Bindungsabschlag bis Zielmiete Marktmiete, einheitlicher Preisstand", {}),
           ("Zielmiete ortsübliche Vergleichsmiete (Kappung § 558 BGB ohne Mieterwechsel)", dict(zielmiete="ovm")),
           ("wie VOFI: Marktmiete, kein Abschlag am Horizont (`Gefoerdert_*!AC/AD`)", dict(restwert="modell")),
           ("Liegenschaftszins −0,5 Pp", dict(lz_delta=-0.005)), ("Liegenschaftszins +0,5 Pp", dict(lz_delta=0.005)),
           ("Veräußerungskosten 5 %", dict(vk=0.05)),
           ("Sachwert-Plausibilisierung: Herstellung +2 % p. a., linear über GND 80 J. abgeschrieben", dict(restwert="sachwert")),
           ("Gebäude-Restwert 50 %", dict(rw_faktor=0.5)),
           ("ohne Gebäude-Restwert (nur Boden)", dict(rw_faktor=0.0)), ("ohne Restwert", "null")]
    z1, z2 = [], []
    for lab, opt in var:
        k = {}
        for g in GRUPPEN:
            l = Lauf(P, g, **opt) if isinstance(opt, dict) else lauf[g]
            k[(g, 35)], k[(g, 42)] = l.kennzahlen(35), l.kennzahlen(42)
        sel = "null" if opt == "null" else "mit"
        z1.append([lab] + [mio(k[(g, H)]["rw"][sel] if sel == "mit" else 0.0) for H in (35, 42) for g in GRUPPEN])
        z2.append([lab] + [pct(k[(g, H)][f"ek_irr_{sel}"]) for H in (35, 42) for g in GRUPPEN]
                  + [pct(k[(g, 42)][f"obj_nZ_{sel}"]) for g in GRUPPEN])
    w("**Restwert in Mio. €**")
    w("")
    w(tabelle(["Variante", "T35 A", "T35 B", "T35 C", "T42 A", "T42 B", "T42 C"], z1))
    w("")
    w("**EK-IRR und Objektrendite nach Zuschuss**")
    w("")
    w(tabelle_fn(["Variante", "EK-IRR T35 A", "B", "C", "EK-IRR T42 A", "B", "C", "Objekt n. Z. T42 A", "B", "C"], z2))
    w("")
    gk = P["gesamtkosten"]
    w(f"Einordnung: Gesamtkosten {mio(gk)} Mio. €. Der Restwert T42 (Basis, A) beträgt das "
      f"{num(kz[('A', 42)]['rw']['voll'] / gk, 2)}-Fache der Gesamtkosten nominal bzw. das "
      f"{num(kz[('A', 42)]['rw']['voll'] / (1 + P['miet_wachstum']) ** 42 / gk, 2)}-Fache real (2 % p. a. deflationiert). "
      f"Anteil des Restwerts am Endvermögen VOFI T42 (A): {pct(kz[('A', 42)]['rw']['mit'] / kz[('A', 42)]['ek_ev_mit'], 0)}.")
    w("")

    # ------------------------------------------------------------------ 8. weitere Sensitivitäten
    w("## 8. Weitere Sensitivitäten")
    w("")
    z = []
    for lab, opt in (("Basis (EK in T0)", {}), ("EK 1,0 Jahr vor T0 gebunden (Bauzeit 12 Monate, EK zuerst)", dict(ek_vorlauf=1.0)),
                     ("EK 2,5 Jahre vor T0 gebunden (Vorlaufzeit des Modells, Eingabe!C107)", dict(ek_vorlauf=2.5)),
                     ("Kostenstand auf T1 fortgeschrieben (+2 Jahre × 2 %)", dict(kosten_offset=2))):
        k = {g: Lauf(P, g, **opt).kennzahlen(42) for g in GRUPPEN}
        z.append([lab] + [pct(k[g]["ek_irr_mit"]) for g in GRUPPEN] + [pct(k[g]["ek_vofi_mit"]) for g in GRUPPEN]
                 + [pct(k[g]["obj_nZ_mit"]) for g in GRUPPEN])
    w(tabelle(["Variante (T42, mit RW)", "EK-IRR A", "B", "C", "VOFI-EK A", "B", "C", "Objekt n. Z. A", "B", "C"], z))
    w("")
    w("Die Vorlaufzeit wirkt hier als datierte EK-Zahlung in IRR und VOFI gleich (Befund R5/R4 Rechentechnik: im Modell "
      "nur im VOFI-Exponenten). Eine Bauphase mit Teilauszahlungen und VKB ab Auszahlung ist nicht modelliert (PH).")
    w("")

    # ------------------------------------------------------------------ 9. Abgleich mit dem VOFI
    w("## 9. Abgleich mit dem VOFI-Modell")
    w("")
    w("### 9.1 Replikation des PGN-Referenzprojekts (Modellkonvention gegen Excel-Cache)")
    w("")
    w("Die Rechnung in Modellkonvention (bares EK = 20 % der zuwendungsfähigen Kosten, Entgelte über Bankdarlehen, "
      "Vorlaufzeit 2,5 J. im VOFI-Exponenten, Restwert wie `Gefoerdert_*!AC/AD`) mit den Eingaben der Mappe:")
    w("")
    Pr = R["Pref"]
    z, maxabw = [], 0.0
    for g in GRUPPEN:
        l = Lauf(Pr, g, **MODELL)
        k42, k35 = l.kennzahlen(42), l.kennzahlen(35)
        mine = {"K1": l.L["RE"][1] / Pr["gesamtkosten"], "K3": k42["ek_vofi_mit"], "K5": k42["ek_vofi_null"],
                "K6": rv(k42["ek_irr_mit"]), "DSCR_T1": l.dscr(1), "K3_T35": k35["ek_vofi_mit"],
                "K5_T35": k35["ek_vofi_null"], "VW_T42": k42["rw"]["voll"], "ZUE_T1": l.L["ZUE"][1]}
        for key, (zelle, soll) in VOFI_CACHE_REFERENZPROJEKT[g].items():
            ist = mine[key]
            d = abs(ist - soll) / (abs(soll) if abs(soll) > 1 else 1)
            maxabw = max(maxabw, d)
            f = (lambda x: eur(x)) if key in ("VW_T42", "ZUE_T1") else (lambda x: num(x, 4)) if key == "DSCR_T1" else (lambda x: pct(x, 3))
            z.append([f"{g}: {key}", zelle, f(soll), f(ist), _de(f"{d:.1e}")])
    w(tabelle(["Kennzahl", "Zelle", "VOFI (Cache)", "Referenzrechnung", "Abw. (rel.)"], z))
    w("")
    w(f"Größte Abweichung {_de(f'{maxabw:.1e}')}: Die Rechnung bildet die Mappe in Modellkonvention exakt nach. Unterschiede in den "
      "folgenden Abschnitten sind deshalb Konventionsunterschiede, keine Rechenfehler.")
    w("")
    R["maxabw_ref"] = maxabw

    w("### 9.2 Broschürenprojekt im VOFI (LibreOffice-Neuberechnung einer Kopie) gegen Modellkonvention")
    w("")
    z, maxabw2 = [], 0.0
    laeufe = {"FR03": dict(MODELL), "EK": dict(MODELL, ek_modell=False), "EKVL0": dict(MODELL, ek_modell=False, vorlauf_exponent=0.0)}
    for vk_, opt in laeufe.items():
        for g in GRUPPEN:
            l = Lauf(P, g, **opt)
            k42, k35 = l.kennzahlen(42), l.kennzahlen(35)
            mine = {"EK": l.EK, "Bank": l.bank0, "Konto_T0": l.kasse0, "K1": l.L["RE"][1] / P["gesamtkosten"],
                    "K3": k42["ek_vofi_mit"], "K5": k42["ek_vofi_null"], "K6": rv(k42["ek_irr_mit"]), "DSCR_T1": l.dscr(1),
                    "VW_T42": k42["rw"]["voll"], "Konto_T42": l.L["KONTO"][42], "K3_T35": k35["ek_vofi_mit"],
                    "K5_T35": k35["ek_vofi_null"], "VW_T35": k35["rw"]["voll"], "ZUE_T1": l.L["ZUE"][1],
                    "ZUE_T2": l.L["ZUE"][2], "ZUE_T3": l.L["ZUE"][3],
                    "K2": l.restwert(0)["ertragswert_vor_abschlag"] / P["gesamtkosten"] - 1}
            for key, soll in VOFI_LO_BROSCHUERE[vk_][g].items():
                ist = mine[key]
                d = abs(ist - soll) / (abs(soll) if abs(soll) > 1 else 1)
                maxabw2 = max(maxabw2, d)
    w(f"Alle {sum(len(v[g]) for v in VOFI_LO_BROSCHUERE.values() for g in GRUPPEN)} Vergleichswerte der drei LibreOffice-Läufe "
      f"(FR03, EK, EKVL0; Definition in `VOFI_LO_BROSCHUERE`) werden in Modellkonvention mit einer größten relativen Abweichung "
      f"von {_de(f'{maxabw2:.1e}')} getroffen. Ausgewählte Werte des Laufs FR03 (Mappe, wie geliefert, nur Projektdaten geändert):")
    w("")
    R["maxabw_lo"] = maxabw2
    v = VOFI_LO_BROSCHUERE["FR03"]
    z = [["Eigenkapital (Dashboard!C11:E11)"] + [eur(v[g]["EK"]) for g in GRUPPEN],
         ["Kasse T0 (`Gefoerdert_*!Y6`)"] + [eur(v[g]["Konto_T0"]) for g in GRUPPEN],
         ["K1 Nettoanfangsrendite (C43)"] + [pct(v[g]["K1"]) for g in GRUPPEN],
         ["K2 Wertüberschuss T0 vor boG (C44)"] + [pct(v[g]["K2"], 1) for g in GRUPPEN],
         ["K3 VOFI-EK mit RW, 44,5 J. (C55)"] + [pct(v[g]["K3"]) for g in GRUPPEN],
         ["K5 VOFI-EK ohne RW, 44,5 J. (C57)"] + [pct(v[g]["K5"]) for g in GRUPPEN],
         ["K6 EK-IRR mit RW, 42 J. (C58)"] + [pct(v[g]["K6"]) for g in GRUPPEN],
         ["K3 T35 (Bewertung!N25:N27)"] + [pct(v[g]["K3_T35"]) for g in GRUPPEN],
         ["Verkehrswert T42 (C47)"] + [eur(v[g]["VW_T42"]) for g in GRUPPEN],
         ["Cashflow T1 (`Gefoerdert_*!Q7`)"] + [eur(v[g]["ZUE_T1"]) for g in GRUPPEN],
         ["DSCR T1 (C20)"] + [num(v[g]["DSCR_T1"]) for g in GRUPPEN]]
    w(tabelle(["VOFI, Broschüreneingaben", "A", "B", "C"], z))
    w("")

    w("### 9.3 Überleitung von der VOFI-Kennzahl zur sauberen Kennzahl (Horizont T42, mit Restwert)")
    w("")
    schritte = [
        ("0 Mappe wie geliefert (FR-03 aktiv: EK 2,1 Mio. €, Kasse T0 0,65 Mio. €)", dict(MODELL)),
        ("1 EK ohne Doppelzählung des Grundstücks (EK 1,4 Mio. €, Entgelte über Bank)", dict(MODELL, ek_modell=False)),
        ("2 Vorlaufzeit nicht im Exponenten (gleiche Zeitbasis wie der IRR)", dict(MODELL, ek_modell=False, vorlauf_exponent=0.0)),
        ("3 Bearbeitungsentgelte aus EK statt Bankdarlehen", dict(MODELL, ek_modell=False, vorlauf_exponent=0.0, be_bank=False)),
        ("4 Restwert mit fortgeführtem Bindungsabschlag, einheitlicher Preisstand (= Basis)",
         dict(MODELL, ek_modell=False, vorlauf_exponent=0.0, be_bank=False, restwert="bestand", schlussrate=True)),
        ("5 nachr.: Zielmiete Vergleichsmiete statt Marktmiete", dict(SAUBER, zielmiete="ovm")),
    ]
    z, ks = [], []
    for lab, opt in schritte:
        k = {g: Lauf(P, g, **opt).kennzahlen(42) for g in GRUPPEN}
        ks.append(k)
        z.append([lab] + [pct(k[g]["ek_vofi_mit"]) for g in GRUPPEN] + [pct(k[g]["ek_irr_mit"]) for g in GRUPPEN]
                 + [pct(k[g]["ek_vofi_null"]) for g in GRUPPEN])
    w(tabelle_fn(["Schritt", "VOFI-EK A", "B", "C", "EK-IRR A", "B", "C", "VOFI ohne RW A", "B", "C"], z))
    w("")
    w("Schritt 0 bis 2 sind mit den LibreOffice-Läufen FR03, EK und EKVL0 belegt (Abschnitt 9.2).")
    w("")

    def d(i, key, g="A"):
        a_, b_ = rv(ks[i - 1][g][key]), rv(ks[i][g][key])
        return pp(b_ - a_) if (a_ is not None and b_ is not None) else "n. v."

    vfr, vek = VOFI_LO_BROSCHUERE["FR03"], VOFI_LO_BROSCHUERE["EK"]
    lb = {g: Lauf(P, g, **dict(MODELL, ek_modell=False)) for g in GRUPPEN}
    bank_kd = {g: lb[g].L["BZINS"][1] + lb[g].L["BTILG"][1] for g in GRUPPEN}
    rwb, rwm = ks[4]["A"]["rw"], ks[3]["A"]["rw"]
    w("**Erklärung der Abweichungen (Werte für A, T42):**")
    w("")
    w(f"- **Schritt 1, Eigenkapital (Befund FR-03):** Die Mappe setzt das bare EK fest auf 20 % der zuwendungsfähigen Kosten "
      f"(Eingabe!C88 `=0.2*Zuwendungsfaehig`) und zählt das Grundstück zusätzlich (Basisdaten!C126 `=KG_Grundstueck+EK_bar`). "
      f"Im Broschürenprojekt wird das EK so {eur(vfr['A']['EK'])} € statt {eur(vek['A']['EK'])} €; der Überschuss von "
      f"{eur(vfr['A']['Konto_T0'])} € liegt als Kasse T0 im VOFI-Konto (Gefoerdert_A!Y6) und verzinst sich zu 2 %. Das vergrößert "
      f"den Nenner und drückt K3; ohne Doppelzählung ändert sich K3 um {d(1, 'ek_vofi_mit')}. Der IRR ändert sich kaum "
      f"({d(1, 'ek_irr_mit')}), weil die Kasse in "
      "T0 mit dem EK verrechnet wird (`Gefoerdert_*!AJ6` `=T6-Eigenkapital`). Die Mappe meldet das selbst "
      "(Dashboard!C67: „übersteigt die Gesamtkosten um 651,000 €“).")
    w(f"- **Schritt 2, Vorlaufzeit (Befund R5):** 2,5 Jahre nur im Exponenten von K3/K5 (Bewertung!N30 "
      f"`(M30/Eigenkapital)^(1/($B30+Vorlaufzeit_Jahre))-1`), nicht im IRR. Ohne diesen Zuschlag: VOFI {d(2, 'ek_vofi_mit')}. Als datierte "
      f"EK-Zahlung gerechnet, kostet dieselbe Vorlaufzeit VOFI und IRR gleichermaßen (Abschnitt 8).")
    w(f"- **Schritt 3, Bearbeitungsentgelte:** In der Mappe über ein Bankdarlehen zu 3,74 % (Basisdaten!C78), hier aus EK. "
      f"VOFI {d(3, 'ek_vofi_mit')}, IRR {d(3, 'ek_irr_mit')}. Das Bankdarlehen erklärt auch den Cashflow T1 des Laufs EK "
      f"(Gefoerdert_A!Q7 {eur(vek['A']['ZUE_T1'])} € statt {eur(vfr['A']['ZUE_T1'])} €): Kapitaldienst Bank "
      + ", ".join(f"{g} {eur(bank_kd[g])} €" for g in GRUPPEN) + ". Ohne Bankdarlehen gleicht die Jahresrechnung der "
      "Broschüre dem Cashflow der Mappe (Lauf FR03, Q7:Q9) auf den Euro.")
    w(f"- **Schritt 4, Restwert (Befunde R2/R3/R4):** Die Mappe kapitalisiert in T42 die volle Marktmiete; der Abschlag "
      f"für die gebundene Bestandsmiete ist dort konstruktionsbedingt 0 (`Gefoerdert_*!AD48`, Summe nur bis BoG_Grenze = 42). "
      f"Die Referenzrechnung führt den Abschlag fort, bis die Bestandsmiete über die Kappung (20 % je 3 Jahre) die Marktmiete "
      f"erreicht, auf einheitlichem Preisstand: Restwert A {mio(rwm['voll'])} → {mio(rwb['voll'])} Mio. € "
      f"(Abschlag {mio(rwb['abschlag'])} Mio. €; B {mio(ks[4]['B']['rw']['abschlag'])}, C {mio(ks[4]['C']['rw']['abschlag'])}). "
      f"VOFI {d(4, 'ek_vofi_mit')}, IRR {d(4, 'ek_irr_mit')}; je höher der Abschlag, desto stärker trifft es A.")
    a4 = ks[4]["A"]
    w(f"- **Verbleibende Methodendifferenz VOFI gegen IRR (Befund R2 Rendite):** {pct(rv(a4['ek_irr_mit']))} gegen "
      f"{pct(a4['ek_vofi_mit'])} = {pp(rv(a4['ek_irr_mit']) - a4['ek_vofi_mit'])}. Der VOFI legt Überschüsse zu 2 % an bzw. "
      "finanziert Fehlbeträge zu 5 %, der IRR unterstellt Wiederanlage zum IRR. Beide Größen sind richtig, aber nicht "
      "gegeneinander als „mit/ohne“ lesbar.")
    w(f"- **Objektebene:** Die Mappe hat nur K1 = Reinertrag T1 ÷ Gesamtkosten (Dashboard!C43 "
      f"`=INDEX(SA_Reinertrag,MATCH(1,SA_t,0))/Gesamtkosten`), im Broschürenprojekt {pct(vfr['A']['K1'])} / "
      f"{pct(vfr['B']['K1'])} / {pct(vfr['C']['K1'])}. Das ist der statische Jahr-1-Wert der Reihe „Objekt brutto“; "
      "eine dynamische Objektrendite (Abschnitt 4) gibt es in der Mappe nicht (Befund R1).")
    w("")

    w("### 9.4 Saubere Kennzahlen für das PGN-Referenzprojekt (nachrichtlich)")
    w("")
    z = []
    kref = {(g, H): Lauf(Pr, g).kennzahlen(H) for g in GRUPPEN for H in (35, 42)}
    for lab, key in (("Objekt brutto, mit RW", "obj_brutto_mit"), ("Objekt nach Zuschuss, mit RW", "obj_nZ_mit"),
                     ("Objekt nach Zuschuss, ohne RW", "obj_nZ_null"), ("EK-IRR mit RW", "ek_irr_mit"),
                     ("EK-IRR ohne RW", "ek_irr_null"), ("VOFI-EK mit RW", "ek_vofi_mit"), ("VOFI-EK ohne RW", "ek_vofi_null")):
        z.append([lab] + [pct(kref[(g, 42)][key]) for g in GRUPPEN] + [pct(kref[(g, 35)][key]) for g in GRUPPEN])
    w(tabelle_fn(["Kennzahl (Referenzprojekt, sauber)", "T42 A", "T42 B", "T42 C", "T35 A", "T35 B", "T35 C"], z))
    w("")
    w("Vergleich mit der Mappe (T42, A): K3 " + pct(VOFI_CACHE_REFERENZPROJEKT["A"]["K3"][1]) + ", K6 " +
      pct(VOFI_CACHE_REFERENZPROJEKT["A"]["K6"][1]) + ", K5 " + pct(VOFI_CACHE_REFERENZPROJEKT["A"]["K5"][1]) +
      ". Im Referenzprojekt ist das Grundstück 0 €, FR-03 wirkt dort nicht; die Abweichung kommt aus Vorlaufzeit, "
      "Entgeltfinanzierung und Restwert (Bindungsabschlag nach T42).")
    w("")

    # ------------------------------------------------------------------ 10. Grenzen
    w("## 10. Grenzen der Rechnung")
    w("")
    w("- Vor Steuern; keine AfA, keine Sonderabschreibung, keine Ertragsteuer (wie das Modell, Dashboard!A2).")
    w("- Keine Bauphase mit Teilauszahlungen, keine Bauzeitzinsen (KG 800 = 0), VKB erst ab Jahr 1; Auszahlung in vier "
      "Raten (RL Nr. 5.5.3) nicht abgebildet.")
    w("- Mieterhöhungen werden voll ausgeschöpft; keine Leerstands-Betriebskosten, keine Modernisierung, keine Instandhaltungszyklen.")
    w("- Marktmiete und Vergleichsmiete stammen vom Standort des PGN-Referenzprojekts (Mietenstufe VI); für ein Modellhaus "
      "„Mietenstufe IV bis VII“ sind sie nur Platzhalter. Sie bestimmen den Restwert und damit alle Renditen mit Restwert.")
    w("- Zins nach Jahr 35: 3,74 % (Modell, Marktobergrenze), nicht aus Basiszinssatz + 3 Pp hergeleitet.")
    w("- Ein Szenario (Basis). Best/Worst des Modells sind über die Parameter nachrechenbar, aber nicht ausgegeben.")
    w("")
    return "\n".join(o)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    ap.add_argument("--annahmen", default=os.path.join(HIER, "annahmen.json"))
    ap.add_argument("--out", default=os.path.join(HIER, "referenzrechnung-ergebnis.md"))
    a = ap.parse_args()
    A = Annahmen(a.annahmen)
    R = berechne(A)
    md = bericht(A, R)
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(md + "\n")
    kz = R["kz"]
    print(f"geschrieben: {a.out}")
    print(f"Abgleich Referenzprojekt (Excel-Cache): max. Abw. {R['maxabw_ref']:.1e}; Broschüre (LibreOffice): {R['maxabw_lo']:.1e}")
    print("T42           Obj n.Z. mit | Obj n.Z. oG | EK-IRR mit | EK-IRR oG | VOFI mit")
    for g in GRUPPEN:
        k = kz[(g, 42)]
        print(f"  {g}: " + " | ".join(pct(k[x]).rjust(10) for x in ("obj_nZ_mit", "obj_nZ_oG", "ek_irr_mit", "ek_irr_oG", "ek_vofi_mit")))
    ok = R["maxabw_ref"] < 1e-6 and R["maxabw_lo"] < 1e-6
    if not ok:
        print("WARNUNG: Abgleich mit dem VOFI über der Toleranz 1e-6", file=sys.stderr)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
