#!/usr/bin/env python3
"""Schreibt ZAHLEN.md: jede Zahl des Konzepts von Team 1 mit Wert, Rundung, Blatt!Zelle und Lauf.

Quellen: konzepte/mappe/werte_konzepte.json (Läufe konzepte und n6.*) und konzepte/team-1/mappe/werte_team.json
(Block T1 und weitere Zellen der Konzepte-Mappe). Keine Zahl wird hier gesetzt; das Skript liest und formatiert nur.
Aufruf: python zahlen.py
"""
import json
from pathlib import Path

HIER = Path(__file__).resolve().parent
WK = json.loads((HIER.parent / "mappe" / "werte_konzepte.json").read_text(encoding="utf-8"))
WT = json.loads((HIER / "mappe" / "werte_team.json").read_text(encoding="utf-8"))["werte"]
BASIS = WK["laeufe"]["konzepte"]["werte"]

V4 = ["A", "B", "C", "frei_dscr"]
VN = {"A": "A", "B": "B", "C": "C", "frei_markt": "frei, Marktmiete", "frei_dscr": "frei (18,36 €)"}
MINUS = "−"


def de(x, nk):
    s = f"{abs(x):,.{nk}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return (MINUS if x < 0 and round(abs(x), nk) != 0 else "") + s


FMT = {
    "eur": lambda x: de(x, 0) + " €",
    "eurabs": lambda x: de(abs(x), 0) + " €",
    "mio1": lambda x: de(x / 1e6, 1) + " Mio. €",
    "mio2": lambda x: de(x / 1e6, 2) + " Mio. €",
    "mio2abs": lambda x: de(abs(x) / 1e6, 2) + " Mio. €",
    "qm": lambda x: de(x, 2) + " €",
    "eurqm0": lambda x: de(x, 0) + " €",
    "rund10": lambda x: "rund " + de((x // 10) * 10, 0) + " €",
    "pct0": lambda x: de(x * 100, 0) + " %",
    "pct1": lambda x: de(x * 100, 1) + " %",
    "pct2": lambda x: de(x * 100, 2) + " %",
    "x2": lambda x: de(x, 2),
    "n": lambda x: de(x, 0),
    "roh": lambda x: str(x),
    "jahr": lambda x: str(int(x)),
}
RUNDUNG = {"eur": "ganze €", "eurabs": "ganze €, Betrag (Abzug)", "mio1": "0,1 Mio. €", "mio2": "0,01 Mio. €",
           "mio2abs": "0,01 Mio. €, Betrag", "qm": "0,01 €", "eurqm0": "ganze €", "rund10": "auf 10 € abgerundet",
           "pct0": "ganze %", "pct1": "0,1 %", "pct2": "0,01 %", "x2": "0,01", "n": "ganze Zahl", "roh": "wie Mappe", "jahr": "Jahr"}

zeilen = []


def eintrag(e, ort, was, fmt, lauf="konzepte", datei="Konzepte-Mappe", idx=None):
    w = e["wert"]
    zelle = f"{e['blatt']}!{e['zelle']}"
    if idx is not None:
        w = w[idx]
        # Zelle in der Reihe: erste Zelle + idx
        sp, rest = e["zelle"].split(":")[0], None
        col = "".join(ch for ch in sp if ch.isalpha())
        row = int("".join(ch for ch in sp if ch.isdigit())) + idx
        zelle = f"{e['blatt']}!{col}{row}"
    if isinstance(w, (int, float)) and not isinstance(w, bool):
        anz, roh = FMT[fmt](w), (f"{w:.6g}" if isinstance(w, float) else str(w))
    else:
        anz, roh = str(w), str(w)
    zeilen.append((ort, was, anz, RUNDUNG[fmt], roh, zelle, lauf if lauf != "konzepte" else datei))


def K(k, ort, was, fmt, idx=None):
    eintrag(BASIS[k], ort, was, fmt, idx=idx)


def T(k, ort, was, fmt, idx=None):
    e = WT[k]
    datei = "Team-1-Mappe" if e["blatt"] == "Konzepte" else "Konzepte-Mappe (über werte_team.json)"
    if e["lauf"] not in ("team1",):
        eintrag(e, ort, was, fmt, lauf=f"Lauf {e['lauf']}", idx=idx)
    else:
        eintrag(e, ort, was, fmt, datei=datei, idx=idx)


def L(lauf, k, ort, was, fmt):
    e = WK["laeufe"][lauf]["werte"][f"n6.{lauf}.{k}"]
    eintrag(e, ort, was, fmt, lauf=f"Lauf {lauf} (laeufe/{lauf}.xlsx)")


def KV(k, ort, was, fmt, var=V4):
    for v in var:
        K(f"{k}.{v}", ort, f"{was}, {VN[v]}", fmt)


def TV(k, ort, was, fmt, var=V4):
    for v in var:
        T(f"{k}.{v}", ort, f"{was}, {VN[v]}", fmt)


def mietmarke(ort):
    K("n5.miete_jahr1.frei_dscr", ort, "Mietmarke: Miete frei finanziert für DSCR 1,2", "qm")
    K("annahme.marktmiete_jahr1", ort, "Mietmarke: Marktmiete Jahr 1", "qm")


# ---------------------------------------------------------------------------------------------------------------
o = "F13 Trenner"
K("annahme.wohnungen", o, "Wohnungen (Titel)", "n")
K("annahme.wohnflaeche", o, "Wohnfläche (Lead)", "n")

o = "F14 Finanzierung"
K("annahme.wohnungen", o, "Wohnungen", "n")
K("annahme.wohnflaeche", o, "Wohnfläche in m²", "n")
K("annahme.herstellungskosten_qm", o, "Herstellungskosten je m²", "eurqm0")
KV("n5.gesamtkosten", o, "Gesamtkosten (Titel, Balkenlänge)", "mio1")
K("n5.gesamtkosten.A", o, "Gesamtkosten in € (Stichpunkt)", "eur")
KV("n5.zuschuss", o, "Zuschuss", "mio1", ["A", "B", "C"])
KV("n5.darlehen_nbank", o, "NBank-Darlehen", "mio1", ["A", "B", "C"])
K("n5.bankdarlehen.frei_dscr", o, "Bankdarlehen, frei", "mio1")
K("n5.bankdarlehen.frei_dscr", o, "Bankdarlehen, frei, in €", "eur")
for v, sp in (("A", "D"), ("B", "E"), ("C", "F")):
    K(f"annahme.quote_zuschuss.{v}", o, f"Zuschussquote {v}", "pct0")
    K(f"annahme.quote_darlehen.{v}", o, f"Darlehensquote {v}", "pct0")
K("kern.eigenmittel.A", o, "Eigenmittel, alle Varianten (Titel 0,6 Mio. €)", "mio1")
K("kern.eigenmittel.A", o, "Eigenmittel in €", "eur")
K("annahme.eigenmittel_mindestens", o, "Eigenmittel mindestens", "pct0")
KV("n5.bearbeitungsentgelte", o, "Bearbeitungsentgelte einmalig", "eur", ["A", "B", "C"])
K("annahme.grundstueck", o, "Grundstück, Ansatz", "eur")
mietmarke(o)

o = "F15 Annahmen"
for k, e in BASIS.items():
    if k.startswith("annahme.") and k not in ("annahme.projekt_nr",):
        w = e["wert"]
        if isinstance(w, str):
            fmt = "roh"
        elif e["einheit"] == "Anteil":
            fmt = ("pct0" if abs(w * 100 - round(w * 100)) < 1e-9 else
                   "pct1" if abs(w * 100 - round(w * 100, 1)) < 1e-9 else "pct2")
        elif e["einheit"] == "Jahr":
            fmt = "roh"
        elif e["einheit"] in ("€/m² Monat",):
            fmt = "qm"
        elif e["einheit"] in ("€/m² p. a.",):
            fmt = "qm"
        elif e["einheit"] in ("€", "€/m²", "€ p. a."):
            fmt = "eurqm0"
        else:
            fmt = "x2" if isinstance(w, float) and w != int(w) else "n"
        K(k, o, e["bedeutung"], fmt)

o = "F16 Jahresrechnung Jahr 1"
TV("t1.miete_jahr1", o, "Miete je m² und Monat (Kopfzeile)", "qm")
TV("t1.sollmiete_jahr1", o, "Zeile 1 Sollmiete", "eur")
TV("t1.mietausfall_jahr1", o, "Zeile 2 Mietausfall/Leerstand", "eurabs")
TV("t1.objektverwaltung_jahr1", o, "Zeile 3 Objektverwaltung", "eurabs")
TV("t1.instandhaltung_jahr1", o, "Zeile 4 Instandhaltung", "eurabs")
TV("t1.uevk_jahr1", o, "Zeile 5 Überschuss vor Kapitaldienst", "eur")
TV("t1.vkb_jahr1", o, "Zeile 6 Verwaltungskostenbeitrag", "eurabs")
TV("t1.zins_jahr1", o, "Zeile 7 Zins", "eurabs")
TV("t1.tilgung_jahr1", o, "Zeile 8 Tilgung", "eurabs")
TV("t1.zue_jahr1", o, "Zeile 9 Zahlungsüberschuss (Titel A)", "eur")
KV("n5.dscr_jahr1", o, "DSCR Jahr 1 (Zeile unter der Tabelle)", "x2")
KV("n5.bearbeitungsentgelte", o, "Hinweiskasten: Bearbeitungsentgelte einmalig", "eur", ["A", "B", "C"])
K("annahme.tilgung_nbank", o, "Tilgung NBank-Darlehen p. a.", "pct2")
K("annahme.zins_bank", o, "Zins Bankdarlehen", "pct2")
K("annahme.laufzeit_bank", o, "Laufzeit Bankdarlehen (jährliche Annuität über 30 Jahre)", "n")
K("n2.aufschlag_marktmiete", o, "Hinweiskasten: Miete für DSCR 1,2 über der Marktmiete", "pct1")
mietmarke(o)

o = "F17 Geldfluss Jahr 1 und 35 Jahre"
TV("t1.sollmiete_jahr1", o, "Jahr 1: Sollmiete (Beschriftung am Balken)", "eur")
for k, t in (("bewirtschaftung", "Bewirtschaftung"), ("vkb", "Verwaltungskostenbeitrag"), ("zins", "Zins"),
             ("tilgung", "Tilgung"), ("zue", "Zahlungsüberschuss")):
    TV(f"t1.anteil_{k}_jahr1", o, f"Jahr 1: Anteil {t}", "pct1")
TV("t1s.sollmiete", o, "Jahr 1–35: Sollmiete, Summe (Beschriftung am Balken)", "mio2")
for k, t in (("bewirtschaftung", "Bewirtschaftung"), ("vkb", "Verwaltungskostenbeitrag"), ("zins", "Zins"),
             ("tilgung", "Tilgung"), ("zue", "Zahlungsüberschuss")):
    TV(f"t1s.anteil_{k}", o, f"Jahr 1–35: Anteil {t}", "pct1")
TV("t1s.zins", o, "Jahr 1–35: Zins, Summe (Titel frei 1,67 Mio. €, gefördert 0 €)", "mio2abs")
TV("t1s.tilgung", o, "Jahr 1–35: Tilgung, Summe (Stichpunkt)", "mio2abs")
TV("t1s.zue", o, "Jahr 1–35: Zahlungsüberschuss, Summe (Stichpunkt)", "mio2")
TV("t1s.vkb", o, "Jahr 1–35: Verwaltungskostenbeitrag, Summe (Stichpunkt)", "mio2abs", ["A", "B", "C"])
K("annahme.bindung", o, "Betrachtung 35 Jahre (Bindung)", "n")
mietmarke(o)

o = "F18 Mieten Jahr 1"
TV("t1.kostendeckende_anfangsmiete", o, "Kostendeckende Anfangsmiete (Zahlungsüberschuss null)", "qm")
KV("n5.miete_dscr_ziel", o, "Miete für DSCR 1,2", "qm")
KV("n5.miete_jahr1", o, "Angesetzte Miete (Höchstmiete bzw. Miete für DSCR 1,2)", "qm")
K("n2.marktmiete_jahr1", o, "Marktmiete (Marke)", "qm")
T("t1.abstand_dscr_miete_marktmiete.frei_dscr", o, "Titel: Miete für DSCR 1,2 über der Marktmiete", "qm")
K("n2.aufschlag_marktmiete", o, "Miete für DSCR 1,2 über der Marktmiete, in %", "pct1")
KV("n3.abstand_hoechstmiete", o, "Höchstmiete minus Miete für DSCR 1,2", "qm", ["A", "B", "C"])
KV("n5.dscr_jahr1", o, "DSCR Jahr 1 zur angesetzten Miete", "x2")
K("n1.dscr_ziel_bank_frei", o, "DSCR-Ziel der Bank (neue Annahme)", "x2")
K("n5.bankdarlehen.frei_dscr", o, "Hinweiskasten: Bankdarlehen, für das die 1,2 gilt", "mio2")
K("annahme.eigenmittel_mindestens", o, "Hinweiskasten: Eigenmittel mindestens (NBank prüft)", "pct0")
K("annahme.bemessungsgrenze_VI", o, "Hinweiskasten: Bemessungsgrenze (NBank prüft)", "eurqm0")

o = "F19 DSCR Jahr 1 bis 35"
for v in V4:
    for j in (1, 4, 10, 20, 30, 35):
        e = BASIS[f"zr.dscr.{v}"]
        if e["wert"][j - 1] is None:
            continue
        K(f"zr.dscr.{v}", o, f"DSCR Jahr {j}, {VN[v]} (Reihe Jahr 1–35 im Diagramm)", "x2", idx=j - 1)
KV("n5.dscr_min_1_35", o, "DSCR Minimum Jahr 1–35", "x2")
KV("n5.dscr_jahr35", o, "DSCR Jahr 35", "x2", ["A", "B", "C"])
KV("n5.jahre_dscr_unter_ziel", o, "Jahre mit DSCR unter 1,2", "n")
TV("t1.letztes_jahr_dscr_unter_ziel", o, "Letztes Jahr mit DSCR unter 1,2 (0 = keins)", "n")
TV("t1.letztes_jahr_kapitaldienst", o, "Letztes Jahr mit Kapitaldienst (Darlehen getilgt)", "n")
K("n1.dscr_ziel_bank_frei", o, "Linie DSCR 1,2", "x2")
mietmarke(o)

o = "F20 Zahlungsüberschuss je Jahr"
for v in V4:
    for j in (1, 4, 10, 20, 30, 31, 35):
        K(f"zr.zue.{v}", o, f"Zahlungsüberschuss Jahr {j}, {VN[v]} (Reihe Jahr 1–35 im Diagramm)", "eur", idx=j - 1)
KV("n5.zue_min_1_35", o, "Zahlungsüberschuss Minimum Jahr 1–35", "eur")
KV("n5.jahre_fehlbetrag_1_35", o, "Jahre mit Fehlbetrag Jahr 1–35", "n")
KV("n5.projektkonto_tiefststand", o, "Tiefster Stand Projektkonto", "eur")
KV("n5.kum_jahr35", o, "Zahlungsüberschuss kumuliert Ende Jahr 35", "mio2")
K("annahme.mieterhoehung_in_der_bindung", o, "Stichpunkt: Mieterhöhung gefördert alle 3 Jahre", "pct2")
K("annahme.mietsteigerung", o, "Stichpunkt: Mietanpassung frei p. a.", "pct0")
K("annahme.kostensteigerung", o, "Stichpunkt: Kostensteigerung ab Jahr 2 p. a.", "pct0")
mietmarke(o)

o = "F21 Eigenkapital-Rückfluss"
for v in V4:
    for j in (0, 5, 10, 13, 20, 22, 23, 35):
        T(f"t1.rueckfluss.{v}", o, f"Kumuliert minus Eigenkapital, Jahr {j}, {VN[v]} (Reihe Jahr 0–35)", "eur", idx=j)
for v in V4:
    T(f"t1.rueckfluss.{v}", o, f"Ende Jahr 35 über dem Eigenkapital, {VN[v]} (Tabelle, in Mio. €)", "mio2", idx=35)
KV("n5.eigenkapital", o, "Eigenkapital bei Bezug (Startpunkt)", "eur")
KV("n5.jahr_ek_erreicht", o, "Jahr, in dem das Eigenkapital zurück ist (Titel)", "n")
KV("n5.kum_jahr35", o, "Zahlungsüberschuss kumuliert Ende Jahr 35", "mio2")
mietmarke(o)

o = "F22 Objektrendite"
KV("n5.uevk_jahr1", o, "Überschuss vor Kapitaldienst Jahr 1 (Zähler)", "eur")
KV("n5.gesamtkosten", o, "Gesamtkosten (Nenner)", "eur")
KV("n5.zuschuss", o, "Zuschuss (Abzug im zweiten Nenner)", "eur", ["A", "B", "C"])
KV("n5.objektrendite", o, "Objektrendite Jahr 1, Nenner Gesamtkosten (Titel gefördert)", "pct2")
KV("n5.objektrendite_nach_zuschuss", o, "Objektrendite Jahr 1, Nenner Gesamtkosten minus Zuschuss", "pct2")
KV("n4.nettoanfangsrendite_mappe", o, "Probe: Nettoanfangsrendite der Mappe (Zeile 139), gleich", "pct2")
K("annahme.finanzierungskosten_kg800", o, "Grund der Gleichheit: KG 800 = 0", "eur")
mietmarke(o)

o = "F23 Eigenkapitalrendite und Vermögen Ende Jahr 35"
KV("n5.restwert_jahr35", o, "Restwert Ende Jahr 35", "mio2")
KV("n5.projektkonto_jahr35", o, "Projektkonto Ende Jahr 35", "mio2")
KV("n5.restschuld_jahr35", o, "Restschuld Ende Jahr 35", "mio2")
KV("n5.restschuld_jahr35", o, "Restschuld Ende Jahr 35, in €", "eur", ["A", "B", "C"])
KV("n5.vermoegen_jahr35", o, "Vermögen Ende Jahr 35", "mio2")
KV("n5.eigenkapital", o, "Eigenkapital bei Bezug", "eur")
KV("n5.ek_vofi_mit_restwert", o, "Eigenkapitalrendite mit Restwert (Titel)", "pct2")
KV("n5.ek_vofi_ohne_restwert", o, "Eigenkapitalrendite ohne Restwert (Titel)", "pct2")
KV("n5.restwertanteil", o, "Anteil des Restwerts am Vermögen", "pct0")
K("kern.liegenschaftszins_jahr35.A", o, "Liegenschaftszins Restwert Jahr 35", "pct2")
K("annahme.marktmiete_jahr1", o, "Restwert aus Marktmiete (alle Varianten frei)", "qm")
mietmarke(o)

o = "F24 Risiken"
for v in V4:
    K(f"n5.jahre_fehlbetrag_1_35.{v}", o, f"Heute: Jahre mit Fehlbetrag, {VN[v]}", "n")
    K(f"n5.ek_vofi_mit_restwert.{v}", o, f"Heute: Eigenkapitalrendite mit Restwert, {VN[v]}", "pct2")
LAEUFE = [("tilgung_2_90", "Tilgung 2,90 %"), ("tilgung_3_65", "Tilgung 3,65 %"),
          ("kosten_4631", "Herstellungskosten 4.631 €"), ("kosten_5460", "Herstellungskosten 5.460 €"),
          ("mietanpassung_gefoerdert_0", "keine Mieterhöhung gefördert"), ("mietsteigerung_0", "keine Mietsteigerung frei"),
          ("anschlusszins_plus_1", "Anschlusszins 4,86 %"), ("anschlusszins_minus_1", "Anschlusszins 2,86 %")]
for lauf, name in LAEUFE:
    ae = WK["laeufe"][lauf]["aenderungen"][0]
    zeilen.append((o, f"{name}: geänderte Eingabe", (de(ae["neu"] * 100, 2) + " %") if ae["neu"] < 1 else de(ae["neu"], 0),
                   "wie Eingabe", str(ae["neu"]), f"{ae['blatt']}!{ae['zelle']}", f"Lauf {lauf} (Eingabe der Laufkopie)"))
    for v in V4:
        L(lauf, f"jahre_fehlbetrag_1_35.{v}", o, f"{name}: Jahre mit Fehlbetrag, {VN[v]}", "n")
        L(lauf, f"ek_vofi_mit_restwert.{v}", o, f"{name}: Eigenkapitalrendite mit Restwert, {VN[v]}", "pct2")
    L(lauf, "miete_jahr1.frei_dscr", o, f"{name}: Miete frei für DSCR 1,2 (neu gelöst)", "qm")
for k, t, f in (("jahre_fehlbetrag_1_35", "Jahre mit Fehlbetrag", "n"), ("ek_vofi_mit_restwert", "Eigenkapitalrendite mit Restwert", "pct2"),
                ("dscr_jahr1", "DSCR Jahr 1", "x2"), ("jahre_dscr_unter_ziel", "Jahre DSCR unter 1,2", "n"),
                ("zue_jahr1", "Zahlungsüberschuss Jahr 1", "eur"), ("projektkonto_tiefststand", "tiefster Stand Projektkonto", "eur")):
    K(f"n5.{k}.frei_markt", o, f"Risikozeile Marktmiete: {t}, frei zur Marktmiete 15,42 € (Blatt Frei finanziert)", f)
L("mietsteigerung_0", "jahre_dscr_unter_ziel.frei_dscr", o, "Hinweiskasten: ohne Mietsteigerung Jahre DSCR unter 1,2, frei", "n")
L("mietsteigerung_0", "dscr_min_1_35.frei_dscr", o, "Hinweiskasten: ohne Mietsteigerung DSCR Minimum, frei", "x2")
mietmarke(o)

o = "F28 Fazit"
K("n2.kapitaldienst_bank_jahr1", o, "1 Ausgangslage: Kapitaldienst Bankdarlehen Jahr 1", "eur")
K("annahme.zins_bank", o, "1 Ausgangslage: Zins Bankdarlehen", "pct2")
K("n5.miete_dscr_ziel.frei_dscr", o, "1 Ausgangslage: Miete für DSCR 1,2", "qm")
K("annahme.marktmiete_jahr1", o, "1 Ausgangslage: Marktmiete", "qm")
K("n2.aufschlag_marktmiete", o, "1 Ausgangslage: Aufschlag auf die Marktmiete", "pct0")
K("kern.foerderung.A", o, "2 Programmteil 2.1: Förderung (Darlehen + Zuschuss)", "mio1")
K("annahme.quote_zuschuss.A", o, "2 Programmteil 2.1: Zuschuss bis", "pct0")
K("annahme.zinsfreie_jahre", o, "2 Programmteil 2.1: zinsfreie Jahre", "n")
KV("annahme.hoechstmiete_VI", o, "2 Programmteil 2.1: Höchstmiete Mietenstufe VI", "qm", ["A", "B", "C"])
K("n5.kapitaldienst_jahr1.A", o, "3 Modellrechnung: Kapitaldienst Jahr 1, A", "eur")
K("n5.kapitaldienst_jahr1.frei_dscr", o, "3 Modellrechnung: Kapitaldienst Jahr 1, frei", "eur")
KV("n5.zue_jahr1", o, "3 Modellrechnung: Zahlungsüberschuss Jahr 1", "eur", ["A", "B", "C"])
KV("n5.jahre_fehlbetrag_1_35", o, "3 Modellrechnung: Jahre mit Fehlbetrag", "n", ["A", "B", "C"])
KV("n5.jahr_ek_erreicht", o, "3 Modellrechnung: Eigenkapital zurück in Jahr", "n", ["A", "B", "C"])
KV("n5.ek_vofi_mit_restwert", o, "3 Modellrechnung: Eigenkapitalrendite mit Restwert", "pct2", ["A", "C"])
KV("n5.ek_vofi_ohne_restwert", o, "3 Modellrechnung: Eigenkapitalrendite ohne Restwert", "pct2", ["A", "C"])
K("kern.eigenmittel.A", o, "4 Umsetzung: Eigenmittel mindestens", "eur")
K("n5.bearbeitungsentgelte.A", o, "4 Umsetzung: Bearbeitungsentgelte A einmalig", "eur")
K("annahme.bemessungsgrenze_VI", o, "4 Umsetzung: Bemessungsgrenze", "eurqm0")
KV("n5.ek_vofi_mit_restwert", o, "Ergebniszeile: Eigenkapitalrendite mit Restwert, frei", "pct2", ["frei_dscr"])
L("mietsteigerung_0", "ek_vofi_mit_restwert.frei_dscr", o, "Ergebniszeile: frei ohne Mietsteigerung, Eigenkapitalrendite", "pct2")
T("t1.kostenschwelle_zue0.A", o, "4 Umsetzung: Herstellungskosten, bis zu denen A sich trägt", "rund10")
K("annahme.herstellungskosten_qm", o, "4 Umsetzung: Herstellungskosten Modellhaus", "eurqm0")
mietmarke(o)

o = "A6 Rechenweg Miete für DSCR 1,2"
K("n1.dscr_ziel_bank_frei", o, "DSCR-Ziel", "x2")
KV("n5.kapitaldienst_jahr1", o, "Kapitaldienst Jahr 1", "eur")
K("n2.bewirtschaftung_jahr1", o, "Objektverwaltung + Instandhaltung Jahr 1 (alle Varianten gleich)", "eur")
K("annahme.mietausfall", o, "Mietausfall", "pct0")
K("annahme.wohnflaeche", o, "Wohnfläche", "n")
KV("n5.miete_dscr_ziel", o, "Ergebnis: Miete für DSCR 1,2", "qm")
KV("n3.dscr_gegenprobe", o, "Gegenprobe DSCR zur Miete für DSCR 1,2", "x2", ["A", "B", "C"])
K("n2.dscr_jahr1", o, "Gegenprobe DSCR frei", "x2")
mietmarke(o)

o = "A7 Risiken im Einzelnen"
for lauf, name in LAEUFE:
    for v in V4:
        for k, t, f in (("zue_jahr1", "Zahlungsüberschuss Jahr 1", "eur"), ("dscr_min_1_35", "DSCR Minimum", "x2"),
                        ("projektkonto_tiefststand", "tiefster Stand Projektkonto", "eur"),
                        ("ek_vofi_ohne_restwert", "Eigenkapitalrendite ohne Restwert", "pct2"),
                        ("jahre_dscr_unter_ziel", "Jahre DSCR unter 1,2", "n")):
            L(lauf, f"{k}.{v}", o, f"{name}: {t}, {VN[v]}", f)
mietmarke(o)

o = "A8 Tilgungssatz"
for r in range(55, 63):
    T(f"ue.tilgungsraster.r{r}.satz", o, f"Tilgungssatz Stützpunkt Zeile {r}", "pct2")
    for v in ("A", "B", "C"):
        T(f"ue.tilgungsraster.r{r}.{v}", o, f"Zahlungsüberschuss Jahr 1 bei Satz Zeile {r}, {v}", "eur")
KV("kern.tragbare_tilgung", o, "Tilgungssatz, bei dem der Zahlungsüberschuss null ist", "pct2", ["A", "B", "C"])
T("ue.tilgungsschwelle.C_gegen_A", o, "Schwelle C gegenüber A", "pct2")

o = "A9 Tilgungsschwelle (heute A7)"
T("ue.tilgungsschwelle.B_gegen_A", o, "Schwelle B gegenüber A, 3.579 €", "pct2")
T("ue.tilgungsschwelle.C_gegen_A", o, "Schwelle C gegenüber A, 3.579 €", "pct2")
for lauf in ("kosten_4631", "kosten_5460"):
    T(f"lauf.{lauf}.tilgungsschwelle.B_gegen_A", o, f"Schwelle B gegenüber A, {lauf}", "pct2")
    T(f"lauf.{lauf}.tilgungsschwelle.C_gegen_A", o, f"Schwelle C gegenüber A, {lauf}", "pct2")

o = "A11 Nach der Bindung"
K("annahme.zins_nbank_ab_jahr36", o, "Zins NBank-Darlehen ab Jahr 36", "pct2")
K("annahme.kappungsgrenze", o, "Kappungsgrenze nach Bindungsende", "pct0")
KV("n5.restschuld_jahr35", o, "Restschuld Ende Jahr 35", "eur")
for v in V4:
    for j in (35, 36, 37, 42):
        K(f"zr.zue.{v}", o, f"Zahlungsüberschuss Jahr {j}, {VN[v]}", "eur", idx=j - 1)
KV("n5.zue_summe_36_42", o, "Zahlungsüberschuss Summe Jahr 36–42", "eur")
KV("n5.jahre_fehlbetrag_36_42", o, "Jahre mit Fehlbetrag Jahr 36–42", "n")
KV("n5.restschuld_jahr42", o, "Restschuld Ende Jahr 42", "eur")
KV("n5.vermoegen_jahr42", o, "Vermögen Ende Jahr 42", "mio2")
KV("n5.ek_vofi_mit_restwert_jahr42", o, "Eigenkapitalrendite mit Restwert, Horizont Jahr 42", "pct2")
KV("n5.ek_vofi_ohne_restwert_jahr42", o, "Eigenkapitalrendite ohne Restwert, Horizont Jahr 42", "pct2")
mietmarke(o)

o = "Broschüre Blatt 9 bis 11"
zeilen.append((o, "alle Zahlen der Skizze", "wie Folien 14 bis 24", "wie dort", "", "siehe Folien", "–"))

# ---------------------------------------------------------------------------------------------------------------
kopf = """# Zahlen des Konzepts von Team 1 (Geldfluss)

Jede Zahl, die in den Folien, der Broschürenskizze und im Fazit vorkommen soll. Erzeugt von `zahlen.py` aus
`konzepte/mappe/werte_konzepte.json` und `konzepte/team-1/mappe/werte_team.json`; keine Zahl ist von Hand gesetzt.

- **Wert** wie auf der Folie (gerundet, deutsches Format, Abzüge als Betrag), **Roh** wie in der Mappe.
- **Quelle**: „Konzepte-Mappe“ = `konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx`;
  „Team-1-Mappe“ = `konzepte/team-1/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team1.xlsx` (Block T1, Blatt Konzepte
  ab Zeile 108; alle übrigen Zellen gleich der Konzepte-Mappe); „Lauf …“ = Laufkopie `konzepte/mappe/laeufe/<lauf>.xlsx`.
- Reihen (Diagramme über Jahre) stehen mit Stützjahren; die ganze Reihe steht in der genannten Spalte (Jahr 1 = Zeile 7
  auf Konzepte Zeitreihe, Jahr 0 = Zeile 161 auf Konzepte der Team-1-Mappe).
- „frei (18,36 €)“ = frei finanziert mit der Miete für DSCR 1,2 (Spalte H auf Konzepte, Blatt Frei DSCR 1,2).
  In den Läufen kosten_4631 und kosten_5460 rechnet diese Spalte mit der dort neu gelösten Miete (23,24 € bzw. 27,09 €,
  je Lauf Konzepte!H49).
- Folie A10 (Herstellungskosten der PGN, heute Folie 22) bleibt unverändert; ihre Zahlen kommen wie heute aus
  `praesentation/daten/markt.json` (ARGE und PGN) und stehen nicht in der Mappe. Nur 3.579 € ist Eingaben!F11.

| Nr. | Ort | Größe | Wert | Rundung | Roh | Blatt!Zelle | Quelle |
|---|---|---|---|---|---|---|---|
"""
out = [kopf]
for i, (ort, was, anz, rund, roh, zelle, quelle) in enumerate(zeilen, 1):
    out.append(f"| {i} | {ort} | {was} | {anz} | {rund} | {roh} | {zelle} | {quelle} |\n")
(HIER / "ZAHLEN.md").write_text("".join(out), encoding="utf-8")
print(len(zeilen), "Zeilen")
