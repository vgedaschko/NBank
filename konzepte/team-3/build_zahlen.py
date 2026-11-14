#!/usr/bin/env python3
"""Erzeugt ZAHLEN.md für das Konzept von Team 3 (Vergleich).

Jede Zahl, die in Folien, Broschürenskizze und Fazit vorkommt, mit Wert (roh), gezeigtem Wert, Rundung und Blatt!Zelle.
Quellen:
  k:<schluessel>          konzepte/mappe/werte_konzepte.json, Lauf „konzepte“ (Konzepte-Mappe)
  k:<schluessel>@<jahr>   dieselbe Datei, Zeitreihe, Wert in Jahr <jahr> (Zelle aus dem Bereich berechnet)
  r:<lauf>:<schluessel>   werte_konzepte.json, Szenario-Lauf (Datei laeufe/<lauf>.xlsx, Blatt Konzepte)
  t:<schluessel>          team-3/mappe/werte_team.json (Blatt „Team 3 Vergleich“ der Team-Mappe)
  t:<schluessel>@<jahr>   dieselbe Datei, Zeitreihe
  z:<Blatt>!<Zelle>       Zelle der Team-Mappe direkt (bestehende Zelle, gleich der Konzepte-Mappe)
Aufruf: python build_zahlen.py
"""
import json
import re
from pathlib import Path

import openpyxl

HIER = Path(__file__).resolve().parent
KJ = json.loads((HIER.parent / "mappe" / "werte_konzepte.json").read_text(encoding="utf-8"))
TJ = json.loads((HIER / "mappe" / "werte_team.json").read_text(encoding="utf-8"))
WB = openpyxl.load_workbook(HIER / "mappe" / "PGN_VOFI_Mietwohnraum_2026_v3_Team3.xlsx", data_only=True)

V4 = ["A", "B", "C", "frei_dscr"]
V5 = ["A", "B", "C", "frei_dscr", "frei_markt"]
VN = {"A": "A", "B": "B", "C": "C", "frei_dscr": "Frei 18,36 €", "frei_markt": "Frei 15,42 €"}
LAEUFE = ["tilgung_2_90", "tilgung_3_65", "kosten_4631", "kosten_5460", "mietanpassung_gefoerdert_0",
          "mietsteigerung_0", "anschlusszins_plus_1", "anschlusszins_minus_1"]


def zelle_in_bereich(bereich, index):
    a, b = bereich.split(":")
    sp, z0 = re.match(r"([A-Z]+)(\d+)", a).groups()
    return f"{sp}{int(z0) + index}"


def hole(q):
    """-> (wert, blatt, zelle, lauf)"""
    if q is None:
        return "–", "–", "–", "–"
    if q.startswith("z:"):
        blatt, zelle = q[2:].rsplit("!", 1)
        return WB[blatt][zelle].value, blatt, zelle, "team3 (bestehende Zelle)"
    jahr = None
    if "@" in q:
        q, jahr = q.split("@")
        jahr = int(jahr)
    if q.startswith("k:"):
        e = KJ["laeufe"]["konzepte"]["werte"][q[2:]]
        lauf = "konzepte"
    elif q.startswith("r:"):
        _, lauf, key = q.split(":", 2)
        e = KJ["laeufe"][lauf]["werte"][f"n6.{lauf}.{key}"]
        lauf = f"{lauf} (laeufe/{lauf}.xlsx)"
    elif q.startswith("t:"):
        e = TJ["werte"][q[2:]]
        lauf = "team3"
    else:
        raise ValueError(q)
    if jahr is None:
        return e["wert"], e["blatt"], e["zelle"], lauf
    bereich = e["zelle"]
    erst = int(re.match(r"[A-Z]+(\d+)", bereich.split(":")[0]).group(1))
    # Bereiche ab Jahr 1 (Zeile 7 bzw. 67) oder ab Jahr 0 (Zeile 66 auf T3)
    start_jahr = 0 if (e["blatt"] == "Team 3 Vergleich" and erst == 66) else 1
    i = jahr - start_jahr
    return e["wert"][i], e["blatt"], zelle_in_bereich(bereich, i), lauf


def de(x, nk):
    s = f"{abs(x):,.{nk}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return ("−" if x < 0 and round(abs(x), nk) != 0 else "") + s


FMT = {
    "eur": (lambda x: de(x, 0) + " €", "€, ganze Euro"),
    "eur2": (lambda x: de(x, 2) + " €", "€, 2 Stellen"),
    "mio1": (lambda x: de(x / 1e6, 1) + " Mio. €", "Mio. €, 1 Stelle"),
    "mio2": (lambda x: de(x / 1e6, 2) + " Mio. €", "Mio. €, 2 Stellen"),
    "pct0": (lambda x: de(x * 100, 0) + " %", "%, ganze Zahl"),
    "pct1": (lambda x: de(x * 100, 1) + " %", "%, 1 Stelle"),
    "pct2": (lambda x: de(x * 100, 2) + " %", "%, 2 Stellen"),
    "pp2": (lambda x: de(x, 2) + " %", "Prozent wie in der Mappe, 2 Stellen"),
    "f2": (lambda x: de(x, 2), "Faktor, 2 Stellen"),
    "int": (lambda x: de(x, 0), "ganze Zahl"),
    "qm": (lambda x: de(x, 0) + " m²", "m²"),
    "eurqm": (lambda x: de(x, 0) + " € je m²", "€ je m², ganze Euro"),
    "eurqm2": (lambda x: de(x, 2) + " € je m²", "€ je m², 2 Stellen"),
    "jahr": (lambda x: str(int(x)), "Jahr"),
    "text": (lambda x: str(x), "Text"),
}

ORTE = []          # (ort, [(groesse, variante, quelle, fmt)])


def ort(name, zeilen):
    ORTE.append((name, zeilen))


def je(groesse, muster, fmt, varianten=V5):
    return [(groesse, VN[v], muster.format(v=v), fmt) for v in varianten]


def einzeln(groesse, quelle, fmt, variante="–"):
    return [(groesse, variante, quelle, fmt)]


# ---------------- Vortrag Hauptteil ----------------
ort("Folie 13 · Trenner Modellrechnung (Vorspann)",
    einzeln("Wohnungen", "k:annahme.wohnungen", "int") + einzeln("Wohnfläche", "k:annahme.wohnflaeche", "qm"))

ort("Folie 14 · Vier Varianten: Finanzierung",
    je("Gesamtkosten (Titel 3,0 Mio. €; Säulenhöhe)", "k:n5.gesamtkosten.{v}", "mio2", V4)
    + einzeln("Gesamtkosten, Titel", "k:n5.gesamtkosten.A", "mio1")
    + je("Zuschuss", "k:n5.zuschuss.{v}", "mio2", ["A", "B", "C"])
    + je("NBank-Darlehen", "k:n5.darlehen_nbank.{v}", "mio2", ["A", "B", "C"])
    + einzeln("Bankdarlehen", "k:n5.bankdarlehen.frei_dscr", "mio2", "Frei")
    + je("Eigenmittel (Säulensegment, RL Nr. 5.2.6)", "k:kern.eigenmittel.{v}", "mio2", ["A", "B", "C"])
    + einzeln("Eigenmittel (Säulensegment)", "k:kern.eigenmittel.frei_markt", "mio2", "Frei")
    + je("Eingesetztes Eigenkapital (Tabellenzeile; Titel „rund 0,6 Mio. €“)", "k:n5.eigenkapital.{v}", "eur", V4)
    + je("davon Bearbeitungsentgelte", "k:n5.bearbeitungsentgelte.{v}", "eur", ["A", "B", "C"])
    + je("Miete Jahr 1 je m² (Tabellenzeile)", "k:n5.miete_jahr1.{v}", "eur2", V4)
    + einzeln("Marktmiete Jahr 1 (neben 18,36 €)", "k:n2.marktmiete_jahr1", "eur2", "Frei")
    + einzeln("Förderquote auf die Gesamtkosten", "t:t3.fazit.foerderquote", "pct0", "A, B, C"))

ann = [
    ("Wohnfläche", "k:annahme.wohnflaeche", "qm"), ("Wohnungen", "k:annahme.wohnungen", "int"),
    ("Herstellungskosten KG 200–700 je m²", "k:annahme.herstellungskosten_qm", "eurqm"),
    ("Bemessungsgrenze Mietenstufe VI", "k:annahme.bemessungsgrenze_VI", "eurqm"),
    ("Grundstück, Ansatz", "k:annahme.grundstueck", "eur"),
    ("Finanzierungskosten KG 800", "k:annahme.finanzierungskosten_kg800", "eur"),
    ("Bezugsjahr", "k:annahme.bezugsjahr", "jahr"), ("Mietenstufe", "k:annahme.mietenstufe", "text"),
    ("Darlehen höchstens, A", "k:annahme.quote_darlehen.A", "pct0"),
    ("Darlehen höchstens, B", "k:annahme.quote_darlehen.B", "pct0"),
    ("Darlehen höchstens, C", "k:annahme.quote_darlehen.C", "pct0"),
    ("Zuschuss höchstens, A", "k:annahme.quote_zuschuss.A", "pct0"),
    ("Zuschuss höchstens, B", "k:annahme.quote_zuschuss.B", "pct0"),
    ("Zuschuss höchstens, C", "k:annahme.quote_zuschuss.C", "pct0"),
    ("Eigenmittel mindestens", "k:annahme.eigenmittel_mindestens", "pct0"),
    ("Höchstmiete A", "k:annahme.hoechstmiete_VI.A", "eur2"),
    ("Höchstmiete B", "k:annahme.hoechstmiete_VI.B", "eur2"),
    ("Höchstmiete C", "k:annahme.hoechstmiete_VI.C", "eur2"),
    ("Jahre ohne Mieterhöhung", "k:annahme.jahre_ohne_mieterhoehung", "int"),
    ("Mieterhöhung in der Bindung, höchstens, in 3 Jahren", "k:annahme.mieterhoehung_in_der_bindung", "pct2"),
    ("Abstand der Mieterhöhungen (Jahre)", "k:annahme.abstand_mieterhoehungen", "int"),
    ("Zins NBank-Darlehen bis Jahr 35", "k:annahme.zins_nbank_bis_jahr35", "pct0"),
    ("Zinsfreie Jahre", "k:annahme.zinsfreie_jahre", "int"),
    ("Zins NBank-Darlehen ab Jahr 36", "k:annahme.zins_nbank_ab_jahr36", "pct2"),
    ("Tilgung NBank-Darlehen p. a.", "k:annahme.tilgung_nbank", "pct2"),
    ("Höchstlaufzeit NBank-Darlehen (Jahre)", "k:annahme.laufzeit_hoechstens", "int"),
    ("Tilgungsaufschub", "k:annahme.tilgungsaufschub", "int"),
    ("Verwaltungskostenbeitrag", "k:annahme.verwaltungskostenbeitrag", "pct1"),
    ("Bearbeitungsentgelt Darlehen", "k:annahme.bearbeitungsentgelt_darlehen", "pct0"),
    ("Bearbeitungsentgelt Zuschuss", "k:annahme.bearbeitungsentgelt_zuschuss", "pct2"),
    ("Belegungs- und Mietbindung (Jahre)", "k:annahme.bindung", "int"),
    ("Kappungsgrenze nach Bindungsende, in 3 Jahren", "k:annahme.kappungsgrenze", "pct0"),
    ("Ortsübliche Vergleichsmiete Jahr 1", "k:annahme.vergleichsmiete_jahr1", "eur2"),
    ("Bankdarlehen frei finanziert", "k:n5.bankdarlehen.frei_dscr", "mio2"),
    ("Zins Bankdarlehen", "k:annahme.zins_bank", "pct2"),
    ("Zinsbindung (Jahre)", "k:annahme.zinsbindung", "int"),
    ("Anschlusszins nach Jahr 10", "k:annahme.anschlusszins", "pct2"),
    ("Laufzeit Bankdarlehen, jährliche Annuität (Jahre)", "k:annahme.laufzeit_bank", "int"),
    ("DSCR-Ziel der Bank (neu)", "k:n1.dscr_ziel_bank_frei", "f2"),
    ("Miete für DSCR 1,2 (Ergebnis der neuen Annahme)", "k:n2.miete_dscr", "eur2"),
    ("Marktmiete Jahr 1", "k:annahme.marktmiete_jahr1", "eur2"),
    ("Mietanpassung frei finanziert p. a.", "k:annahme.mietsteigerung", "pct0"),
    ("Mietausfall/Leerstand", "k:annahme.mietausfall", "pct0"),
    ("Objektverwaltung je Wohnung p. a.", "k:annahme.objektverwaltung_je_wohnung", "eur"),
    ("Instandhaltung je m² p. a.", "k:annahme.instandhaltung_je_qm", "eur2"),
    ("Kostensteigerung ab Jahr 2 p. a.", "k:annahme.kostensteigerung", "pct0"),
    ("Guthabenzins Projektkonto", "k:annahme.guthabenzins", "pct0"),
    ("Sollzins Projektkonto", "k:annahme.sollzins", "pct0"),
    ("Liegenschaftszins Restwert Jahr 35", "k:kern.liegenschaftszins_jahr35.A", "pct1"),
    ("Gesamtnutzungsdauer (Jahre)", "k:annahme.gesamtnutzungsdauer", "int"),
    ("Veräußerungskosten", "k:annahme.veraeusserungskosten", "pct0"),
]
ort("Folie 15 · Annahmen (je Annahme Wert und Herkunft; Herkunft siehe KONZEPT.md und mappe/ANNAHMEN.md)",
    [(g, "–", q, f) for g, q, f in ann])

ort("Folie 16 · Jahr 1: was herein kommt, was hinaus geht, was bleibt (je m² und Monat)",
    je("Miete Jahr 1 = Säulenhöhe", "t:t3.qm.sollmiete.{v}", "eur2")
    + je("Bewirtschaftung (Mietausfall, Objektverwaltung, Instandhaltung)", "t:t3.qm.bewirtschaftung.{v}", "eur2")
    + je("Verwaltungskostenbeitrag", "t:t3.qm.vkb.{v}", "eur2")
    + je("Zins (Titel: 9,21 € frei, 0 € gefördert)", "t:t3.qm.zins.{v}", "eur2")
    + je("Tilgung", "t:t3.qm.tilgung.{v}", "eur2")
    + je("Kapitaldienst", "t:t3.qm.kapitaldienst.{v}", "eur2")
    + je("Zahlungsüberschuss", "t:t3.qm.zue.{v}", "eur2")
    + je("Zahlungsüberschuss Jahr 1 in € p. a. (Hinweiskasten)", "t:t3.jr1.zue.{v}", "eur")
    + einzeln("Marktmiete (Marke an der Säule Frei)", "t:t3.miete.marktmiete.frei_dscr", "eur2", "Frei"))

ort("Folie 17 · Miete für DSCR 1,2 gegen Höchstmiete und Marktmiete",
    je("Kostendeckende Anfangsmiete (Zahlungsüberschuss Jahr 1 = 0)", "t:t3.miete.kostendeckend.{v}", "eur2", V4)
    + je("Miete für DSCR 1,2", "t:t3.miete.miete_dscr.{v}", "eur2", V4)
    + je("Höchstmiete bzw. Marktmiete (dritte Säule)", "t:t3.miete.miete_modell.{v}", "eur2", ["A", "B", "C", "frei_markt"])
    + je("Abstand Höchstmiete bzw. Marktmiete zur Miete für DSCR 1,2", "t:t3.miete.abstand_dscr.{v}", "eur2",
         ["A", "B", "C", "frei_markt"])
    + je("DSCR Jahr 1 zur Höchstmiete bzw. Marktmiete", "k:n5.dscr_jahr1.{v}", "f2", ["A", "B", "C", "frei_markt"])
    + einzeln("DSCR Jahr 1 zur Miete 18,36 €", "k:n5.dscr_jahr1.frei_dscr", "f2", "Frei 18,36 €")
    + einzeln("Aufschlag Miete für DSCR 1,2 auf die Marktmiete", "k:n2.aufschlag_marktmiete", "pct1", "Frei")
    + einzeln("Bankdarlehen, für das die 1,2 gilt", "k:n5.bankdarlehen.frei_dscr", "mio2", "Frei")
    + einzeln("Eigenmittel mindestens (NBank prüft)", "k:annahme.eigenmittel_mindestens", "pct0")
    + einzeln("Tilgung Bankdarlehen mindestens (NBank prüft)", "k:annahme.tilgung_bank_mindestens", "pct0")
    + einzeln("DSCR C ab Jahr 4", "k:zr.dscr.C@4", "f2", "C"))

ort("Folie 18 · DSCR im Zeitverlauf, Jahr 1 bis 35",
    je("Linie DSCR Jahr 1 bis 35 (Bereich)", "k:zr.dscr.{v}@1", "f2")
    + je("DSCR Jahr 35 (Linienende)", "k:n5.dscr_jahr35.{v}", "f2", ["A", "B", "C"])
    + je("DSCR Jahr 30 (letztes Jahr mit Kapitaldienst frei)", "k:zr.dscr.{v}@30", "f2", ["frei_dscr", "frei_markt"])
    + je("DSCR Minimum Jahr 1–35", "k:n5.dscr_min_1_35.{v}", "f2")
    + je("Jahre mit DSCR unter 1,2, Jahr 1–35", "k:n5.jahre_dscr_unter_ziel.{v}", "int")
    + einzeln("DSCR C Jahr 4", "k:zr.dscr.C@4", "f2", "C")
    + einzeln("DSCR frei 15,42 € Jahr 11", "k:zr.dscr.frei_markt@11", "f2", "Frei 15,42 €")
    + je("Ohne Mieterhöhung gefördert: DSCR Minimum", "r:mietanpassung_gefoerdert_0:dscr_min_1_35.{v}", "f2",
         ["A", "B", "C"])
    + je("Ohne Mieterhöhung gefördert: Jahre unter 1,2", "r:mietanpassung_gefoerdert_0:jahre_dscr_unter_ziel.{v}",
         "int", ["A", "B", "C"])
    + einzeln("DSCR-Ziel der Bank (Marke)", "k:n1.dscr_ziel_bank_frei", "f2", "Frei"))

ort("Folie 19 · Zahlungsüberschuss je Jahr (Liquidität)",
    je("Zahlungsüberschuss Jahr 1", "k:n5.zue_jahr1.{v}", "eur")
    + je("Zahlungsüberschuss Jahr 10", "k:zr.zue.{v}@10", "eur")
    + je("Zahlungsüberschuss Jahr 11 (frei 15,42 € erstmals über A)", "k:zr.zue.{v}@11", "eur", ["A", "frei_markt"])
    + je("Zahlungsüberschuss Jahr 20", "k:zr.zue.{v}@20", "eur")
    + je("Zahlungsüberschuss Jahr 30", "k:zr.zue.{v}@30", "eur")
    + je("Zahlungsüberschuss Jahr 31 (frei: Bankdarlehen getilgt)", "k:zr.zue.{v}@31", "eur", ["frei_dscr", "frei_markt"])
    + je("Zahlungsüberschuss Jahr 35", "k:n5.zue_jahr35.{v}", "eur")
    + je("Zahlungsüberschuss Minimum Jahr 1–35", "k:n5.zue_min_1_35.{v}", "eur")
    + je("Jahre mit Fehlbetrag, Jahr 1–35", "k:n5.jahre_fehlbetrag_1_35.{v}", "int")
    + je("Tiefster Stand Projektkonto", "k:n5.projektkonto_tiefststand.{v}", "eur")
    + je("Linie Zahlungsüberschuss Jahr 1 bis 35 (Bereich, Startzelle)", "k:zr.zue.{v}@1", "eur"))

ort("Folie 20 · Rückfluss des Eigenkapitals",
    je("Rückflussquote Ende Jahr 17 (A noch vor frei 15,42 €)", "t:t3.zr.rueckfluss.{v}@17", "pct0", ["A", "frei_markt"])
    + je("Rückflussquote Ende Jahr 18 (frei 15,42 € vor A)", "t:t3.zr.rueckfluss.{v}@18", "pct0", ["A", "frei_markt"])
    + je("Eingesetztes Eigenkapital", "t:t3.rueckfluss.eigenkapital.{v}", "eur")
    + je("Jahr, in dem das Eigenkapital zurück ist (Titel 22 bis 23, 13 bis 21)", "k:n5.jahr_ek_erreicht.{v}", "jahr")
    + je("Rückflussquote Ende Jahr 10", "t:t3.rueckfluss.quote_jahr10.{v}", "pct0")
    + je("Rückflussquote Ende Jahr 20", "t:t3.rueckfluss.quote_jahr20.{v}", "pct0")
    + je("Rückflussquote Ende Jahr 35", "t:t3.rueckfluss.quote_jahr35.{v}", "pct0")
    + je("Zahlungsüberschuss kumuliert Ende Jahr 35", "k:n5.kum_jahr35.{v}", "mio2")
    + je("Linie Rückflussquote Jahr 0 bis 35 (Bereich, Startzelle Jahr 0)", "t:t3.zr.rueckfluss.{v}@0", "pct0"))

ort("Folie 21 · Objektrendite",
    je("Objektrendite Jahr 1, Nenner Gesamtkosten", "k:n5.objektrendite.{v}", "pct1")
    + je("Objektrendite Jahr 1, Nenner Gesamtkosten ohne Zuschuss", "k:n5.objektrendite_nach_zuschuss.{v}", "pct1")
    + je("Überschuss vor Kapitaldienst Jahr 1", "k:n5.uevk_jahr1.{v}", "eur")
    + je("Objektrendite Jahr 35 (Tabellenzeile)", "t:t3.rueckfluss.objektrendite_jahr35.{v}", "pct1")
    + je("Nettoanfangsrendite der Mappe (Gegenprobe, gleich)", "k:n4.nettoanfangsrendite_mappe.{v}", "pct2")
    + je("Höchstmiete in % der Marktmiete", "t:t3.miete.anteil_markt.{v}", "pct0", ["A", "B", "C"])
    + je("Gesamtkosten (Nenner)", "k:n5.gesamtkosten.{v}", "mio2", ["A"])
    + je("Zuschuss (abgezogen)", "k:n5.zuschuss.{v}", "mio2", ["A", "B", "C"]))

ort("Folie 22 · Eigenkapitalrendite über 35 Jahre",
    je("VOFI-EK-Rendite mit Restwert", "k:n5.ek_vofi_mit_restwert.{v}", "pct2")
    + je("VOFI-EK-Rendite ohne Restwert", "k:n5.ek_vofi_ohne_restwert.{v}", "pct2")
    + je("Restwertanteil am Endvermögen", "k:n5.restwertanteil.{v}", "pct0")
    + je("Restwert Ende Jahr 35", "k:n5.restwert_jahr35.{v}", "mio2")
    + je("Eigenkapital", "k:n5.eigenkapital.{v}", "eur")
    + je("Ohne Mietsteigerung (Eingabe 4.5 = 0): mit Restwert", "r:mietsteigerung_0:ek_vofi_mit_restwert.{v}", "pct2")
    + je("Anschlusszins +1 Punkt: mit Restwert", "r:anschlusszins_plus_1:ek_vofi_mit_restwert.{v}", "pct2",
         ["frei_dscr", "frei_markt"])
    + einzeln("Aufschlag 18,36 € auf die Marktmiete", "k:n2.aufschlag_marktmiete", "pct1", "Frei"))

risk = [("Basis", None)] + [(l, l) for l in LAEUFE]
zeilen24 = []
for name, lauf in risk:
    for v in ["A", "B", "C", "frei_markt", "frei_dscr"]:
        q = f"k:n5.jahre_fehlbetrag_1_35.{v}" if lauf is None else f"r:{lauf}:jahre_fehlbetrag_1_35.{v}"
        zeilen24.append((f"Jahre mit Fehlbetrag 1–35, {name}", VN[v], q, "int"))
    q = "k:n5.miete_jahr1.frei_dscr" if lauf is None else f"r:{lauf}:miete_jahr1.frei_dscr"
    zeilen24.append((f"Miete für DSCR 1,2, {name}", "Frei", q, "eur2"))
    q = "k:n5.jahre_dscr_unter_ziel.frei_dscr" if lauf is None else f"r:{lauf}:jahre_dscr_unter_ziel.frei_dscr"
    zeilen24.append((f"Jahre mit DSCR unter 1,2 zur Miete für DSCR 1,2, {name}", "Frei 18,36 €", q, "int"))
zeilen24 += je("Hinweis: ohne Mieterhöhung gefördert, EK-Rendite mit Restwert",
               "r:mietanpassung_gefoerdert_0:ek_vofi_mit_restwert.{v}", "pct2", ["A", "B", "C"])
zeilen24 += einzeln("Kosten Lauf 4.631", "r:kosten_4631:miete_jahr1.A", "eur2", "Probe: Höchstmiete A unverändert")
ort("Folie 24 · Risiken: was das Ergebnis verschiebt (Tabelle)", zeilen24)

ort("Folie 28 · Fazit (vor der Schlussfolie)",
    einzeln("Herstellungskosten ARGE-Median Q1 2020", "t:t3.fazit.hk_2020", "eurqm")
    + einzeln("Herstellungskosten ARGE-Median heute", "t:t3.fazit.hk_heute", "eurqm")
    + einzeln("Anstieg Herstellungskosten", "t:t3.fazit.hk_anstieg", "pct1")
    + einzeln("Sollzins Q1 2020", "t:t3.fazit.zins_2020", "pct2")
    + einzeln("Sollzins heute", "t:t3.fazit.zins_heute", "pct2")
    + einzeln("Kapitaldienst je m² und Monat Q1 2020", "t:t3.fazit.kd_qm_2020", "eur2")
    + einzeln("Kapitaldienst je m² und Monat heute", "t:t3.fazit.kd_qm_heute", "eur2")
    + einzeln("Förderquote", "t:t3.fazit.foerderquote", "pct0")
    + einzeln("Zuschuss höchstens (A)", "k:annahme.quote_zuschuss.A", "pct0")
    + einzeln("Zinsfreie Jahre", "k:annahme.zinsfreie_jahre", "int")
    + je("Höchstmiete Mietenstufe VI", "k:annahme.hoechstmiete_VI.{v}", "eur2", ["A", "B", "C"])
    + einzeln("Gesamtkosten", "k:n5.gesamtkosten.A", "mio1")
    + je("Zahlungsüberschuss Jahr 1", "k:n5.zue_jahr1.{v}", "eur", ["A", "B", "C"])
    + je("Jahre mit Fehlbetrag", "k:n5.jahre_fehlbetrag_1_35.{v}", "int", ["A", "B", "C"])
    + einzeln("Miete für DSCR 1,2", "k:n2.miete_dscr", "eur2", "Frei")
    + einzeln("Marktmiete", "k:n2.marktmiete_jahr1", "eur2", "Frei")
    + einzeln("Aufschlag auf die Marktmiete", "k:n2.aufschlag_marktmiete", "pct1", "Frei")
    + je("EK zurück in Jahr", "k:n5.jahr_ek_erreicht.{v}", "jahr")
    + je("EK-Rendite mit Restwert", "k:n5.ek_vofi_mit_restwert.{v}", "pct2")
    + einzeln("Tilgung (Bedingung)", "k:annahme.tilgung_nbank", "pct2")
    + einzeln("Herstellungskosten (Bedingung)", "k:annahme.herstellungskosten_qm", "eurqm")
    + einzeln("Mieterhöhung in 3 Jahren (Bedingung)", "k:annahme.mieterhoehung_in_der_bindung", "pct2"))

# ---------------- Anhang ----------------
jr = [("1 Sollmiete", "sollmiete"), ("2 Mietausfall/Leerstand", "mietausfall"), ("3 Objektverwaltung", "objektverwaltung"),
      ("4 Instandhaltung", "instandhaltung"), ("5 Überschuss vor Kapitaldienst", "uevk"),
      ("6 Verwaltungskostenbeitrag", "vkb"), ("7 Zins", "zins"), ("8 Tilgung", "tilgung"),
      ("9 Zahlungsüberschuss", "zue"), ("Kapitaldienst (Summe 6 bis 8)", "kapitaldienst"), ("DSCR Jahr 1", "dscr")]
zA6 = []
for g, s in jr:
    zA6 += je(g, f"t:t3.jr1.{s}.{{v}}", "f2" if s == "dscr" else "eur")
zA6 += je("Einmalig: Bearbeitungsentgelte", "k:n5.bearbeitungsentgelte.{v}", "eur", ["A", "B", "C"])
zA6 += je("Miete Jahr 1 (Spaltenkopf)", "t:t3.jr1.miete.{v}", "eur2")
ort("Anhang A6 · Jahresrechnung Jahr 1, alle Varianten", zA6)

ort("Anhang A7 · Ende der Bindung und danach",
    je("Restwert Ende Jahr 35", "k:n5.restwert_jahr35.{v}", "mio2")
    + je("Projektkonto Ende Jahr 35", "k:n5.projektkonto_jahr35.{v}", "mio2")
    + je("Restschuld Ende Jahr 35", "k:n5.restschuld_jahr35.{v}", "mio2")
    + je("Vermögen Ende Jahr 35", "k:n5.vermoegen_jahr35.{v}", "mio1")
    + je("Vermögen Ende Jahr 35 ohne Restwert", "k:n5.vermoegen_jahr35_ohne_restwert.{v}", "mio2")
    + je("Restschuld Ende Jahr 30 (frei getilgt)", "k:zr.rs.{v}@30", "eur", ["frei_dscr"])
    + je("Zahlungsüberschuss Jahr 36", "k:zr.zue.{v}@36", "eur", ["A", "B", "C"])
    + je("DSCR Jahr 36 (Zins NBank ab Jahr 36)", "k:zr.dscr.{v}@36", "f2", ["A", "B", "C"])
    + je("Zahlungsüberschuss Summe Jahr 36–42", "k:n5.zue_summe_36_42.{v}", "mio2")
    + je("Zahlungsüberschuss Jahr 42", "k:n5.zue_jahr42.{v}", "eur")
    + je("Jahre mit Fehlbetrag Jahr 36–42", "k:n5.jahre_fehlbetrag_36_42.{v}", "int")
    + je("Restschuld Ende Jahr 42", "k:n5.restschuld_jahr42.{v}", "eur")
    + je("Vermögen Ende Jahr 42", "k:n5.vermoegen_jahr42.{v}", "mio1")
    + je("VOFI-EK-Rendite mit Restwert, Horizont 42", "k:n5.ek_vofi_mit_restwert_jahr42.{v}", "pct2")
    + je("VOFI-EK-Rendite ohne Restwert, Horizont 42", "k:n5.ek_vofi_ohne_restwert_jahr42.{v}", "pct2")
    + einzeln("Zins NBank-Darlehen ab Jahr 36", "k:annahme.zins_nbank_ab_jahr36", "pct2")
    + einzeln("Kappungsgrenze in 3 Jahren", "k:annahme.kappungsgrenze", "pct0"))

ort("Anhang A8 · Rendite in allen Lesarten der Mappe",
    je("Objekt-IRR ohne Zuschuss, mit Restwert", "t:t3.irr.irr_ohne_zuschuss_mit_restwert.{v}", "pct2")
    + je("Objekt-IRR nach Zuschuss, mit Restwert", "t:t3.irr.irr_nach_zuschuss_mit_restwert.{v}", "pct2")
    + je("Objekt-IRR nach Förderbarwert, mit Restwert", "t:t3.irr.irr_nach_foerderbarwert_mit_restwert.{v}", "pct2")
    + je("Objekt-IRR ohne Zuschuss, ohne Restwert", "t:t3.irr.irr_ohne_zuschuss_ohne_restwert.{v}", "pct2")
    + je("Objekt-IRR nach Zuschuss, ohne Restwert", "t:t3.irr.irr_nach_zuschuss_ohne_restwert.{v}", "pct2")
    + je("EK-IRR mit Restwert", "k:n5.ek_irr_mit_restwert.{v}", "pct2")
    + je("EK-IRR ohne Restwert", "k:n5.ek_irr_ohne_restwert.{v}", "pct2")
    + je("Objektrendite Jahr 1 (statisch, Folie 21)", "k:n5.objektrendite.{v}", "pct2"))

for titel, metr, fmt in [("Anhang A9 · Risiken: Liquidität", ["zue_jahr1", "jahre_fehlbetrag_1_35",
                                                                "projektkonto_tiefststand", "dscr_min_1_35",
                                                                "jahre_dscr_unter_ziel", "miete_jahr1"], None),
                         ("Anhang A10 · Risiken: Rendite und Vermögen", ["ek_vofi_mit_restwert",
                                                                         "ek_vofi_ohne_restwert",
                                                                         "vermoegen_jahr35"], None)]:
    zz = []
    for lauf in [None] + LAEUFE:
        for m in metr:
            f = {"zue_jahr1": "eur", "jahre_fehlbetrag_1_35": "int", "projektkonto_tiefststand": "eur",
                 "dscr_min_1_35": "f2", "jahre_dscr_unter_ziel": "int", "miete_jahr1": "eur2",
                 "ek_vofi_mit_restwert": "pct2", "ek_vofi_ohne_restwert": "pct2", "vermoegen_jahr35": "mio1"}[m]
            vs = ["frei_dscr"] if m == "miete_jahr1" else V5
            for v in vs:
                q = f"k:n5.{m}.{v}" if lauf is None else f"r:{lauf}:{m}.{v}"
                zz.append((f"{m}, {'Basis' if lauf is None else lauf}", VN[v], q, f))
    ort(titel, zz)

ort("Anhang A11 · Tilgungssatz (heute Folie 20, unverändert)",
    [(f"Zahlungsüberschuss Jahr 1 bei Tilgung {t}", g, f"z:Übersicht!{c}{r}", "eur")
     for r, t in ((55, "0 %"), (56, "1,0 %"), (57, "1,5 %"), (58, "2,0 %"), (59, "2,38 % (1/42)"), (60, "2,5 %"),
                  (61, "3,0 %")) for g, c in (("A", "D"), ("B", "E"), ("C", "F"))]
    + [("Tilgungsschwelle B gegenüber A", "B", "z:Übersicht!E63", "pct2"),
       ("Tilgungsschwelle C gegenüber A", "C", "z:Übersicht!F64", "pct2")]
    + je("Tragbare Tilgung (Zahlungsüberschuss null)", "k:kern.tragbare_tilgung.{v}", "pct2", ["A", "B", "C"]))

# ---------------- Broschüre ----------------
ort("Broschüre Blatt 9 (Bogenseite 10) · Ein Haus, vier Varianten",
    [("wie Folien 14 und 15 (Finanzierung, Annahmen mit Herkunft)", "–", None, "text")]
    + [("Zuschuss je Wohnung (Kennzahl, bleibt)", g, f"z:Übersicht!{c}24", "eur")
       for g, c in (("A", "D"), ("B", "E"), ("C", "F"))]
    + [("Eigenmittel je Wohnung (Kennzahl, bleibt)", "A, B, C", "z:Übersicht!D25", "eur")])
ort("Broschüre Blatt 10 (Bogenseite 11) · Jahr 1 im Vergleich",
    [("wie Anhang A6 (Jahresrechnung Zeilen 1 bis 9, DSCR) und Folie 17 (Mieten)", "–", None, "text")]
    + je("Zahlungsüberschuss je m² und Monat (Mietzerlegung)", "t:t3.qm.zue.{v}", "eur2"))
ort("Broschüre Blatt 11 (Bogenseite 12) · 35 Jahre im Vergleich",
    [("wie Folien 19 bis 22 und 24 (Kennzahlentabelle, zwei Zeitreihen, Risiken)", "–", None, "text")]
    + je("Vermögen Ende Jahr 35 (Kennzahlentabelle)", "k:n5.vermoegen_jahr35.{v}", "mio1"))


def main():
    zeilen = ["# Zahlen des Konzepts Team 3 (Vergleich)", "",
              "Erzeugt mit `build_zahlen.py` aus `konzepte/mappe/werte_konzepte.json` (Lauf „konzepte“ und Szenario-Läufe N6) "
              "und `team-3/mappe/werte_team.json` (Block T3 auf dem Blatt „Team 3 Vergleich“ der Team-Mappe "
              "`team-3/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Team3.xlsx`). Spalte „Wert roh“ ungerundet, „gezeigt“ so, wie die "
              "Zahl auf Folie oder Seite steht. Lauf „konzepte“: Konzepte-Mappe; Lauf „team3“: Team-Mappe, Blatt "
              "„Team 3 Vergleich“; Läufe N6: Kopie `konzepte/mappe/laeufe/<lauf>.xlsx`, Blatt Konzepte. Bestehende Zellen sind "
              "in Konzepte-Mappe und Team-Mappe gleich (Vergleich 16.541 Zellen, 0 Abweichungen).", "",
              "Varianten: A, B, C = Gruppe A, B, C zur Höchstmiete. Frei 18,36 € = frei finanziert zur Miete für DSCR 1,2 "
              "(Blatt Frei DSCR 1,2). Frei 15,42 € = frei finanziert zur Marktmiete (Blatt Frei finanziert).", "",
              "Zeitreihen: Die Zeile nennt die Zelle des genannten Jahres; die ganze Reihe steht im Bereich derselben Spalte "
              "(Konzepte Zeitreihe Zeile 7 bis 48 = Jahr 1 bis 42; Team 3 Vergleich Zeile 66 bis 108 = Jahr 0 bis 42).", ""]
    n = 0
    for name, zz in ORTE:
        zeilen += [f"## {name}", "", "| Größe | Variante | Wert roh | gezeigt | Rundung | Blatt!Zelle | Lauf |",
                   "|---|---|---|---|---|---|---|"]
        for g, v, q, f in zz:
            wert, blatt, zelle, lauf = hole(q)
            fn, rund = FMT[f]
            if isinstance(wert, (int, float)) and not isinstance(wert, bool):
                gez = fn(wert)
                roh = f"{wert:.10g}"
            else:
                gez, roh = str(wert), str(wert)
            if q is None:
                zeilen.append(f"| {g} | – | – | – | – | – | – |")
                continue
            zeilen.append(f"| {g} | {v} | {roh} | {gez} | {rund} | {blatt}!{zelle} | {lauf} |")
            n += 1
        zeilen.append("")
    zeilen.insert(2, f"{n} Einträge.")
    (HIER / "ZAHLEN.md").write_text("\n".join(zeilen) + "\n", encoding="utf-8")
    print("ZAHLEN.md:", n, "Einträge")


if __name__ == "__main__":
    main()
