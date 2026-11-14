#!/usr/bin/env python3
"""Erzeugt konzepte/team-2/ZAHLEN.md aus werte_konzepte.json (gemeinsame Mappe) und werte_team.json (Team 2).

Jede Zahl des Konzepts steht hier einmal mit Wert, Rundung, Rohwert und Fundstelle (Datei · Blatt!Zelle, Lauf).
Fehlt ein Schlüssel, bricht das Skript ab. Gerechnete Größen nennen ihre Formel und die Zellen der Teile.
Aufruf: python erzeuge_zahlen.py
"""
import json, re
from pathlib import Path

HIER = Path(__file__).resolve().parent
TEAM = HIER.parent
K = json.loads((TEAM.parent / "mappe" / "werte_konzepte.json").read_text(encoding="utf-8"))
T = json.loads((TEAM / "mappe" / "werte_team.json").read_text(encoding="utf-8"))
MAPPE = "Konzepte-Mappe"
KOPIE = "Team-2-Kopie"


def quelle(ref):
    """ref: K:key · K:key[i] · N6:lauf:key · T:key · T:key[i] · R1:key → (rohwert, fundstelle)"""
    m = re.match(r"^(K|T|R1|N6:[a-z0-9_]+):([^\[]+)(?:\[(\d+)\])?$", ref)
    if not m:
        raise SystemExit(f"Ref unklar: {ref}")
    art, key, idx = m.group(1), m.group(2), m.group(3)
    if art == "K":
        e = K["laeufe"]["konzepte"]["werte"][key]; datei = MAPPE; lauf = "konzepte"
    elif art == "T":
        e = T["werte"][key]; datei = KOPIE if e["datei"].endswith("Team2.xlsx") else MAPPE; lauf = "team2"
    elif art == "R1":
        L = "liegenschaftszins_plus_0_60"
        e = T["laeufe"][L]["werte"][f"r1.{L}.{key}"]; datei = f"team-2/mappe/laeufe/{L}.xlsx"; lauf = L
    else:
        L = art.split(":")[1]
        e = K["laeufe"][L]["werte"][f"n6.{L}.{key}"]; datei = f"mappe/laeufe/{L}.xlsx"; lauf = L
    wert, zelle = e["wert"], e["zelle"]
    if idx is not None:
        i = int(idx)
        sp, r0 = re.match(r"([A-Z]+)(\d+):", zelle).groups()
        wert = wert[i]
        zelle = f"{sp}{int(r0) + i}"
    return wert, f"{datei} · {e['blatt']}!{zelle}" + ("" if lauf in ("konzepte", "team2") else f" · Lauf {lauf}")


def de(x, nk):
    s = f"{x:,.{nk}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return s.replace("-", "−")


FMT = {
    "eur": (lambda v: de(v, 0) + " €", "ganze €"),
    "eurabs": (lambda v: de(abs(v), 0) + " €", "ganze €, Betrag ohne Vorzeichen"),
    "eur2": (lambda v: de(v, 2) + " €", "2 Nachkommastellen"),
    "eurabs2": (lambda v: de(abs(v), 2) + " €", "2 Nachkommastellen, Betrag ohne Vorzeichen"),
    "mio2": (lambda v: de(v / 1e6, 2) + " Mio. €", "0,01 Mio. €"),
    "mio1": (lambda v: de(v / 1e6, 1) + " Mio. €", "0,1 Mio. €"),
    "tsd": (lambda v: de(v / 1e3, 0) + " Tsd. €", "ganze Tsd. €"),
    "pct0": (lambda v: de(v * 100, 0) + " %", "ganze %"),
    "pct1": (lambda v: de(v * 100, 1) + " %", "0,1 %"),
    "pct2": (lambda v: de(v * 100, 2) + " %", "0,01 %"),
    "pct2ab": (lambda v: de(int(v * 10000) / 100, 2) + " %", "0,01 %, abgerundet"),
    "dez2": (lambda v: de(v, 2), "2 Nachkommastellen"),
    "int": (lambda v: de(v, 0), "ganzzahlig"),
    "roh": (lambda v: str(v), "wie Mappe"),
}

ZEILEN = []  # (wo, groesse, wert, rundung, roh, fundstelle)


def z(wo, groesse, ref, fmt):
    v, f = quelle(ref)
    if isinstance(v, str) or v is None:
        txt, rund = (v if v is not None else "leer"), "Text"
    else:
        txt, rund = FMT[fmt][0](v), FMT[fmt][1]
    roh = v if isinstance(v, str) or v is None else (f"{v:.6g}" if isinstance(v, float) else str(v))
    ZEILEN.append((wo, groesse, txt, rund, roh, f))


def g(wo, groesse, refs, formel, fn, fmt):
    """gerechnete Größe: fn(*werte); formel als Text mit den Teilen"""
    vals, fund = [], []
    for r in refs:
        v, f = quelle(r); vals.append(v); fund.append(f)
    v = fn(*vals)
    ZEILEN.append((wo, groesse, FMT[fmt][0](v), FMT[fmt][1] + "; gerechnet", f"{v:.6g}", f"{formel}; Teile: " + " | ".join(fund)))


V4 = [("A", "A"), ("B", "B"), ("C", "C"), ("frei", "frei_dscr")]
V3 = V4[:3]
ZR = {"A": 0, "B": 1, "C": 2, "frei": 3}


def je(wo, groesse, muster, fmt, var=V4):
    for n, k in var:
        z(wo, f"{groesse}, {n}", muster.format(v=k), fmt)


# ---------------------------------------------------------------- F13 Trenner
z("F13", "Wohnungen", "K:annahme.wohnungen", "int")
z("F13", "Wohnfläche m²", "K:annahme.wohnflaeche", "int")

# ---------------------------------------------------------------- F14 Annahmen
W = "F14, Blatt 9"
for key, txt, fmt in [
    ("annahme.wohnungen", "Wohnungen", "int"), ("annahme.wohnflaeche", "Wohnfläche m²", "int"),
    ("annahme.bezugsjahr", "Bezugsjahr", "roh"), ("annahme.mietenstufe", "Mietenstufe", "roh"),
    ("annahme.eh40", "Effizienzhaus 40 erreicht (nein: EH 55, kein Zuschlag)", "roh"),
    ("annahme.herstellungskosten_qm", "Herstellungskosten je m²", "eur"),
    ("annahme.grundstueck", "Grundstück, Ansatz", "eur"), ("annahme.finanzierungskosten_kg800", "KG 800", "eur"),
    ("annahme.bodenwertsteigerung", "Bodenwertsteigerung (ohne Wirkung, Grundstück 0 €)", "pct1"),
    ("annahme.hoechstmiete_VI.A", "Höchstmiete A je m²", "eur2"), ("annahme.hoechstmiete_VI.B", "Höchstmiete B je m²", "eur2"),
    ("annahme.hoechstmiete_VI.C", "Höchstmiete C je m²", "eur2"),
    ("annahme.jahre_ohne_mieterhoehung", "Jahre ohne Mieterhöhung", "int"),
    ("annahme.mieterhoehung_in_der_bindung", "Mieterhöhung in der Bindung je 3 Jahre", "pct2"),
    ("annahme.abstand_mieterhoehungen", "Abstand der Mieterhöhungen, Jahre", "int"),
    ("annahme.bindung", "Belegungs- und Mietbindung, Jahre", "int"),
    ("annahme.kappungsgrenze", "Kappungsgrenze nach der Bindung, in 3 Jahren", "pct0"),
    ("annahme.vergleichsmiete_jahr1", "Ortsübliche Vergleichsmiete Jahr 1 je m²", "eur2"),
    ("annahme.marktmiete_jahr1", "Marktmiete Jahr 1 je m²", "eur2"),
    ("n2.miete_dscr", "Miete frei finanziert Jahr 1 = Miete für DSCR 1,2", "eur2"),
    ("annahme.mietsteigerung", "Mietanpassung frei finanziert, Markt- und Vergleichsmiete p. a.", "pct0"),
    ("annahme.mietausfall", "Mietausfall/Leerstand", "pct0"),
    ("annahme.objektverwaltung_je_wohnung", "Objektverwaltung je Wohnung p. a.", "eur"),
    ("annahme.instandhaltung_je_qm", "Instandhaltung je m² p. a.", "eur2"),
    ("annahme.kostensteigerung", "Kostensteigerung ab Jahr 2 p. a.", "pct0"),
    ("annahme.kostenstand_fortschreibung", "Kostensätze fortschreiben um Jahre (0: Kostenstand 2026)", "int"),
    ("annahme.quote_zuschuss.A", "Zuschuss A", "pct0"), ("annahme.quote_zuschuss.B", "Zuschuss B", "pct0"),
    ("annahme.quote_zuschuss.C", "Zuschuss C", "pct0"), ("annahme.quote_darlehen.A", "NBank-Darlehen A", "pct0"),
    ("annahme.quote_darlehen.B", "NBank-Darlehen B", "pct0"), ("annahme.quote_darlehen.C", "NBank-Darlehen C", "pct0"),
    ("annahme.eigenmittel_mindestens", "Eigenmittel mindestens", "pct0"),
    ("annahme.eigenkapital_zusatz", "zusätzliches Eigenkapital bar", "eur"),
    ("annahme.bemessungsgrenze_VI", "Bemessungsgrenze je m²", "eur"),
    ("annahme.zins_nbank_bis_jahr35", "Zins NBank-Darlehen bis Jahr 35", "pct0"),
    ("annahme.zinsfreie_jahre", "zinsfreie Jahre", "int"),
    ("annahme.zins_nbank_ab_jahr36", "Zins NBank-Darlehen ab Jahr 36", "pct2"),
    ("annahme.tilgung_nbank", "Tilgung NBank-Darlehen p. a.", "pct2"),
    ("annahme.laufzeit_hoechstens", "Höchstlaufzeit NBank-Darlehen, Jahre", "int"),
    ("annahme.tilgungsaufschub", "Tilgungsaufschub, Jahre", "int"),
    ("annahme.verwaltungskostenbeitrag", "Verwaltungskostenbeitrag p. a.", "pct1"),
    ("annahme.bearbeitungsentgelt_darlehen", "Bearbeitungsentgelt Darlehen", "pct0"),
    ("annahme.bearbeitungsentgelt_zuschuss", "Bearbeitungsentgelt Zuschuss", "pct2"),
    ("annahme.zins_bank", "Zins Bankdarlehen", "pct2"), ("annahme.zinsbindung", "Zinsbindung, Jahre", "int"),
    ("annahme.anschlusszins", "Anschlusszins", "pct2"),
    ("annahme.laufzeit_bank", "jährliche Annuität über Jahre", "int"),
    ("annahme.dscr_ziel_bank_frei", "DSCR, die die Bank verlangt (neu)", "dez2"),
    ("annahme.dscr_ziel_mappe", "DSCR-Ziel der Mappe für die kostendeckende Anfangsmiete", "dez2"),
    ("annahme.guthabenzins", "Guthabenzins Projektkonto", "pct0"), ("annahme.sollzins", "Sollzins Projektkonto", "pct0"),
    ("annahme.gesamtnutzungsdauer", "Gesamtnutzungsdauer, Jahre", "int"),
    ("annahme.zielmiete", "Zielmiete Restwert", "roh"), ("annahme.veraeusserungskosten", "Veräußerungskosten", "pct0"),
    ("annahme.stress_kg", "Faktor Herstellungskosten (neutral)", "dez2"),
    ("annahme.stress_miete", "Faktor Markt- und Vergleichsmiete (neutral)", "dez2"),
    ("annahme.stress_lz", "Zuschlag Liegenschaftszins (neutral)", "dez2"),
    ("annahme.stress_gebrw", "Faktor Gebäude-Restwert (neutral)", "dez2")]:
    z(W, txt, "K:" + key, fmt)
z(W, "Gesamtkosten = Herstellungskosten", "K:n5.gesamtkosten.A", "eur")
z(W, "Bankdarlehen frei finanziert", "K:n5.bankdarlehen.frei_dscr", "eur")
z(W, "Liegenschaftszins Restwert Jahr 35", "K:kern.liegenschaftszins_jahr35.A", "pct2")

# ---------------------------------------------------------------- F15 Einsatz
W = "F15, Blatt 9"
z(W, "Gesamtkosten (alle Varianten gleich)", "K:n5.gesamtkosten.A", "mio2")
je(W, "Zuschuss", "K:n5.zuschuss.{v}", "eur", V3)
je(W, "NBank-Darlehen", "K:n5.darlehen_nbank.{v}", "eur", V3)
z(W, "Bankdarlehen, frei", "K:n5.bankdarlehen.frei_dscr", "eur")
je(W, "Eigenmittel", "K:kern.eigenmittel.{v}", "eur", [("A", "A"), ("B", "B"), ("C", "C"), ("frei", "frei_markt")])
je(W, "Bearbeitungsentgelte", "K:n5.bearbeitungsentgelte.{v}", "eur", V3)
je(W, "Eigenkapital bei Bezug", "K:n5.eigenkapital.{v}", "eur")
je(W, "Eigenkapital (Titel: rund 0,6 Mio. €)", "K:n5.eigenkapital.{v}", "mio1")
je(W, "Miete Jahr 1 je m² (Kategorietext)", "K:n5.miete_jahr1.{v}", "eur2")
z(W, "Marktmiete je m² (Kategorietext frei)", "K:n2.marktmiete_jahr1", "eur2")

# ---------------------------------------------------------------- F16 Bankmaßstab
W = "F16, Blatt 10"
for n, k in [("A", "kdam.A"), ("B", "kdam.B"), ("C", "kdam.C"), ("frei", "kdam.frei_markt")]:
    z(W, f"kostendeckende Anfangsmiete (DSCR 1,0), {n}", "T:" + k, "eur2")
je(W, "Miete für DSCR 1,2", "K:n5.miete_dscr_ziel.{v}", "eur2")
je(W, "Höchstmiete (Marke)", "K:n3.hoechstmiete.{v}", "eur2", V3)
z(W, "Marktmiete (Marke frei)", "K:n2.marktmiete_jahr1", "eur2")
z(W, "Rechenweg 1: Kapitaldienst Bankdarlehen Jahr 1", "K:n2.kapitaldienst_bank_jahr1", "eur")
z(W, "Rechenweg 2: DSCR, die die Bank verlangt", "K:n1.dscr_ziel_bank_frei", "dez2")
z(W, "Rechenweg 2: Überschuss vor Kapitaldienst für DSCR 1,2", "K:n5.uevk_jahr1.frei_dscr", "eur")
z(W, "Rechenweg 3: Objektverwaltung + Instandhaltung", "K:n2.bewirtschaftung_jahr1", "eur")
z(W, "Rechenweg 4: Mietausfall", "K:annahme.mietausfall", "pct0")
z(W, "Rechenweg 4: Sollmiete Jahr 1 frei", "T:jr1.frei_dscr.sollmiete", "eur")
z(W, "Rechenweg 5: Wohnfläche", "K:annahme.wohnflaeche", "int")
z(W, "Rechenweg 5: Miete für DSCR 1,2 frei", "K:n2.miete_dscr", "eur2")
z(W, "Aufschlag auf die Marktmiete", "K:n2.aufschlag_marktmiete", "pct1")
je(W, "DSCR Jahr 1 zur Höchstmiete", "K:n3.dscr_jahr1.{v}", "dez2", V3)
je(W, "DSCR 1,2 erreicht", "K:n3.dscr_ziel_erreicht.{v}", "roh", V3)
z(W, "Abstand Höchstmiete zu Miete für DSCR 1,2, C (Betrag)", "K:n3.abstand_hoechstmiete.C", "eurabs2")
z(W, "Jahre unter DSCR 1,2, C", "K:n3.jahre_dscr_unter_ziel.C", "int")

# ---------------------------------------------------------------- F17 Jahr 1
W = "F17, Blatt 10"
je(W, "1 Sollmiete", "K:kern.sollmiete.{v}", "eur", V3); z(W, "1 Sollmiete, frei", "T:jr1.frei_dscr.sollmiete", "eur")
je(W, "2 Mietausfall/Leerstand", "K:kern.mietausfall.{v}", "eur", V3); z(W, "2 Mietausfall/Leerstand, frei", "T:jr1.frei_dscr.mietausfall", "eurabs")
je(W, "3 Objektverwaltung", "K:kern.objektverwaltung.{v}", "eur", V3); z(W, "3 Objektverwaltung, frei", "T:jr1.frei_dscr.objektverwaltung", "eurabs")
je(W, "4 Instandhaltung", "K:kern.instandhaltung.{v}", "eur", V3); z(W, "4 Instandhaltung, frei", "T:jr1.frei_dscr.instandhaltung", "eurabs")
je(W, "5 Überschuss vor Kapitaldienst", "K:n5.uevk_jahr1.{v}", "eur")
je(W, "6 Verwaltungskostenbeitrag", "K:kern.verwaltungskostenbeitrag.{v}", "eur", V3)
je(W, "7 Zins NBank-Darlehen", "K:kern.zins_nbank.{v}", "eur", V3); z(W, "7 Zins Bankdarlehen, frei", "T:jr1.frei_dscr.zins", "eurabs")
je(W, "8 Tilgung NBank-Darlehen", "K:kern.tilgung_nbank.{v}", "eur", V3); z(W, "8 Tilgung Bankdarlehen, frei", "T:jr1.frei_dscr.tilgung", "eurabs")
je(W, "9 Zahlungsüberschuss", "K:n5.zue_jahr1.{v}", "eur")
je(W, "Kapitaldienst (Zeilen 6 bis 8)", "K:n5.kapitaldienst_jahr1.{v}", "eur")
je(W, "DSCR (Zeile 5 ÷ Kapitaldienst)", "K:n5.dscr_jahr1.{v}", "dez2")
je(W, "Bearbeitungsentgelte einmalig (Hinweis)", "K:n5.bearbeitungsentgelte.{v}", "eur", V3)
je(W, "Miete Jahr 1 je m² (Zeile 1)", "K:n5.miete_jahr1.{v}", "eur2")
z(W, "Marktmiete (Hinweis)", "K:n2.marktmiete_jahr1", "eur2")
je(W, "NBank-Darlehen (Zeile 8)", "K:n5.darlehen_nbank.{v}", "mio1", V3)

# ---------------------------------------------------------------- F18 Zahlungsüberschuss je Jahr
W = "F18, Blatt 11"
for jahr in (1, 10, 20, 30, 35, 36, 42):
    je(W, f"Zahlungsüberschuss Jahr {jahr}", "K:zr.zue.{v}[" + str(jahr - 1) + "]", "eur")
je(W, "Zahlungsüberschuss kumuliert bis Jahr 35", "K:n5.kum_jahr35.{v}", "eur")
je(W, "Zahlungsüberschuss kumuliert bis Jahr 35 (Mio.)", "K:n5.kum_jahr35.{v}", "mio2")
je(W, "Jahre mit Fehlbetrag 1 bis 35", "K:n5.jahre_fehlbetrag_1_35.{v}", "int")
je(W, "Jahre mit Fehlbetrag 36 bis 42", "K:n5.jahre_fehlbetrag_36_42.{v}", "int")
je(W, "Tiefster Stand Projektkonto", "K:n5.projektkonto_tiefststand.{v}", "eur")
z(W, "Marke: Bankdarlehen getilgt nach Jahren", "K:annahme.laufzeit_bank", "int")
z(W, "Marke: Ende der Bindung, Jahr", "K:annahme.bindung", "int")

# ---------------------------------------------------------------- F19 Rückfluss
W = "F19, Blatt 11"
je(W, "Eigenkapital bei Bezug = gebunden Jahr 0", "T:t2.gebunden.{v}[0]", "eur")
for jahr in (5, 10, 13, 20, 22, 23):
    je(W, f"noch gebundenes Eigenkapital Jahr {jahr}", "T:t2.gebunden.{v}[" + str(jahr) + "]", "eur")
je(W, "Eigenkapital zurück in Jahr", "T:t2.jahr_frei.{v}", "int")
je(W, "Gegenprobe Konzepte Zeile 67", "K:n5.jahr_ek_erreicht.{v}", "int")
je(W, "Höchststand gebundenes Eigenkapital", "T:t2.hoechststand.{v}", "eur")

# ---------------------------------------------------------------- F20 DSCR Verlauf
W = "F20, Blatt 11"
je(W, "DSCR Jahr 1", "K:n5.dscr_jahr1.{v}", "dez2")
je(W, "DSCR Minimum Jahr 1 bis 35", "K:n5.dscr_min_1_35.{v}", "dez2")
je(W, "DSCR Jahr 30", "K:zr.dscr.{v}[29]", "dez2")
je(W, "DSCR Jahr 35", "K:n5.dscr_jahr35.{v}", "dez2", V3)
z(W, "DSCR Jahr 35, frei (kein Kapitaldienst)", "K:n5.dscr_jahr35.frei_dscr", "roh")
je(W, "Jahre mit DSCR unter 1,2", "K:n5.jahre_dscr_unter_ziel.{v}", "int")
z(W, "DSCR C Jahr 4 (nach der ersten Mieterhöhung)", "K:zr.dscr.C[3]", "dez2")
z(W, "DSCR frei Jahr 2", "K:zr.dscr.frei_dscr[1]", "dez2")
z(W, "Lauf Tilgung 2,90 %: Jahre unter 1,2, B", "N6:tilgung_2_90:jahre_dscr_unter_ziel.B", "int")
z(W, "Lauf Tilgung 2,90 %: Jahre unter 1,2, C", "N6:tilgung_2_90:jahre_dscr_unter_ziel.C", "int")

# ---------------------------------------------------------------- F21 Objektrendite
W = "F21, Blatt 11"
je(W, "Objektrendite auf Gesamtkosten", "K:n5.objektrendite.{v}", "pct2")
je(W, "Objektrendite auf Gesamtkosten nach Zuschuss", "K:n5.objektrendite_nach_zuschuss.{v}", "pct2", V3)
je(W, "Nettoanfangsrendite der Mappe (Zeile 139), gleich", "K:n4.nettoanfangsrendite_mappe.{v}", "pct2")
je(W, "Abweichung Objektrendite − Nettoanfangsrendite", "K:n4.abweichung.{v}", "pct2")
je(W, "Überschuss vor Kapitaldienst Jahr 1", "K:n5.uevk_jahr1.{v}", "eur")
z(W, "Gesamtkosten", "K:n4.gesamtkosten.A", "eur")
je(W, "Zuschuss", "K:n4.zuschuss.{v}", "eur", V3)
for n, k in V3:
    g(W, f"Gesamtkosten nach Zuschuss, {n}", [f"K:n4.gesamtkosten.{k}", f"K:n4.zuschuss.{k}"],
      "Gesamtkosten − Zuschuss (Nenner von Konzepte Zeile 42)", lambda a, b: a - b, "eur")
je(W, "Miete Jahr 1 je m²", "K:n5.miete_jahr1.{v}", "eur2")
z(W, "KG 800", "K:annahme.finanzierungskosten_kg800", "eur")

# ---------------------------------------------------------------- F22 Eigenkapitalrendite
W = "F22, Blatt 11"
je(W, "Eigenkapitalrendite (VOFI) mit Restwert", "K:n5.ek_vofi_mit_restwert.{v}", "pct2")
je(W, "Eigenkapitalrendite (VOFI) ohne Restwert", "K:n5.ek_vofi_ohne_restwert.{v}", "pct2")
je(W, "Restwertanteil am Endvermögen", "K:n5.restwertanteil.{v}", "pct0")
je(W, "Eigenkapital bei Bezug", "K:n5.eigenkapital.{v}", "eur")
je(W, "Vermögen Ende Jahr 35", "K:n5.vermoegen_jahr35.{v}", "mio2")
z(W, "Lauf ohne Mietsteigerung: Eigenkapitalrendite mit Restwert, frei", "N6:mietsteigerung_0:ek_vofi_mit_restwert.frei_dscr", "pct2")

# ---------------------------------------------------------------- F23 Vermögen
W = "F23, Blatt 11"
je(W, "Restwert Ende Jahr 35", "K:n5.restwert_jahr35.{v}", "mio2")
je(W, "Projektkonto Ende Jahr 35", "K:n5.projektkonto_jahr35.{v}", "mio2")
je(W, "Restschuld Ende Jahr 35", "K:n5.restschuld_jahr35.{v}", "mio2")
je(W, "Vermögen Ende Jahr 35", "K:n5.vermoegen_jahr35.{v}", "mio2")
je(W, "Vermögen Ende Jahr 35 ohne Restwert", "K:n5.vermoegen_jahr35_ohne_restwert.{v}", "mio2")
je(W, "Restwertanteil am Vermögen", "K:n5.restwertanteil.{v}", "pct0")
je(W, "Vermögen Ende Jahr 42", "K:n5.vermoegen_jahr42.{v}", "mio2")
je(W, "Restschuld Ende Jahr 42", "K:n5.restschuld_jahr42.{v}", "eur")
for g_ in "ABC":
    z(W, f"Ertragswert zur Marktmiete Ende Jahr 35, {g_}", f"T:rw.ertragswert_zielmiete_35.{g_}", "mio2")
    z(W, f"Abschlag, weil die Miete erst nach der Bindung zur Marktmiete steigt, {g_}", f"T:rw.abschlag_bindung_35.{g_}", "mio2")
z(W, "Liegenschaftszins Restwert Jahr 35", "T:rw.liegenschaftszins_35.A", "pct2")

# ---------------------------------------------------------------- F25 Risiko
W = "F25, Blatt 11"
LAEUFE = [("Basis", None), ("Tilgung 2,90 %", "tilgung_2_90"), ("Tilgung 3,65 %", "tilgung_3_65"),
          ("Herstellungskosten 4.631 €", "kosten_4631"), ("Herstellungskosten 5.460 €", "kosten_5460"),
          ("keine Mieterhöhung in der Bindung", "mietanpassung_gefoerdert_0"), ("keine Mietsteigerung, Markt", "mietsteigerung_0"),
          ("Anschlusszins 4,86 %", "anschlusszins_plus_1"), ("Anschlusszins 2,86 %", "anschlusszins_minus_1")]
for name, L in LAEUFE:
    for n, k in V4:
        if L:
            z(W, f"{name}: Jahre mit Fehlbetrag, {n}", f"N6:{L}:jahre_fehlbetrag_1_35.{k}", "int")
            z(W, f"{name}: Eigenkapitalrendite mit Restwert, {n}", f"N6:{L}:ek_vofi_mit_restwert.{k}", "pct2")
        else:
            z(W, f"{name}: Jahre mit Fehlbetrag, {n}", f"K:n5.jahre_fehlbetrag_1_35.{k}", "int")
            z(W, f"{name}: Eigenkapitalrendite mit Restwert, {n}", f"K:n5.ek_vofi_mit_restwert.{k}", "pct2")
for n, k in V4:
    z(W, f"Liegenschaftszins 3,40 %: Jahre mit Fehlbetrag, {n}", f"R1:jahre_fehlbetrag_1_35.{k}", "int")
    z(W, f"Liegenschaftszins 3,40 %: Eigenkapitalrendite mit Restwert, {n}", f"R1:ek_vofi_mit_restwert.{k}", "pct2")
z(W, "Liegenschaftszins im Lauf R1, Jahr 35", "R1:liegenschaftszins_35.A", "pct2")
z(W, "Marktmiete statt 18,36 €: Jahre mit Fehlbetrag, frei", "K:n5.jahre_fehlbetrag_1_35.frei_markt", "int")
z(W, "Marktmiete statt 18,36 €: Eigenkapitalrendite mit Restwert, frei", "K:n5.ek_vofi_mit_restwert.frei_markt", "pct2")
z(W, "Marktmiete statt 18,36 €: DSCR Jahr 1, frei", "K:n5.dscr_jahr1.frei_markt", "dez2")
z(W, "Marktmiete statt 18,36 €: tiefster Stand Projektkonto, frei", "K:n5.projektkonto_tiefststand.frei_markt", "eur")
z(W, "Kostenlauf 4.631 €: Miete frei für DSCR 1,2", "N6:kosten_4631:miete_jahr1.frei_dscr", "eur2")
z(W, "Kostenlauf 5.460 €: Miete frei für DSCR 1,2", "N6:kosten_5460:miete_jahr1.frei_dscr", "eur2")
z(W, "Lauf ohne Mietsteigerung: Jahre DSCR unter 1,2, frei", "N6:mietsteigerung_0:jahre_dscr_unter_ziel.frei_dscr", "int")
z(W, "Lauf ohne Mietsteigerung: DSCR Minimum, frei", "N6:mietsteigerung_0:dscr_min_1_35.frei_dscr", "dez2")
z(W, "Marktmiete: höchstes Bankdarlehen bei DSCR 1,2", "T:t2.markt_dscr.darlehen_max", "mio2")
z(W, "Marktmiete: Bankdarlehen in % der Gesamtkosten", "T:t2.markt_dscr.darlehen_anteil", "pct0")
z(W, "Marktmiete: Mehr-Eigenkapital", "T:t2.markt_dscr.mehr_ek", "mio2")
z(W, "Marktmiete: nötiges Eigenkapital", "T:t2.markt_dscr.ek_noetig", "mio2")
z(W, "Lauf Tilgung 3,65 %: tiefster Stand Projektkonto, C", "N6:tilgung_3_65:projektkonto_tiefststand.C", "eur")
z(W, "Lauf Kosten 5.460 €: tiefster Stand Projektkonto, C", "N6:kosten_5460:projektkonto_tiefststand.C", "eur")

# ---------------------------------------------------------------- F29 Fazit
W = "F29 Fazit"
z(W, "Zins Bankdarlehen, 10 Jahre fest", "K:annahme.zins_bank", "pct2")
z(W, "kostendeckende Anfangsmiete frei finanziert", "T:kdam.frei_markt", "eur2")
z(W, "Marktmiete", "K:annahme.marktmiete_jahr1", "eur2")
z(W, "Zuschuss A", "K:annahme.quote_zuschuss.A", "pct0")
z(W, "NBank-Darlehen A", "K:annahme.quote_darlehen.A", "pct0")
z(W, "Zins NBank-Darlehen", "K:annahme.zins_nbank_bis_jahr35", "pct0")
z(W, "zinsfreie Jahre", "K:annahme.zinsfreie_jahre", "int")
z(W, "Höchstmiete A", "K:annahme.hoechstmiete_VI.A", "eur2")
z(W, "Eigenkapital A", "K:n5.eigenkapital.A", "mio1")
z(W, "Zahlungsüberschuss Jahr 1, A", "K:n5.zue_jahr1.A", "eur")
z(W, "Jahre mit Fehlbetrag A", "K:n5.jahre_fehlbetrag_1_35.A", "int")
z(W, "Eigenkapital zurück in Jahr, A", "T:t2.jahr_frei.A", "int")
z(W, "Eigenkapitalrendite mit Restwert, A", "K:n5.ek_vofi_mit_restwert.A", "pct2")
z(W, "Eigenkapitalrendite ohne Restwert, A", "K:n5.ek_vofi_ohne_restwert.A", "pct2")
z(W, "Miete frei für DSCR 1,2", "K:n2.miete_dscr", "eur2")
z(W, "Aufschlag auf die Marktmiete", "K:n2.aufschlag_marktmiete", "pct1")
z(W, "Eigenkapitalrendite mit Restwert, frei", "K:n5.ek_vofi_mit_restwert.frei_dscr", "pct2")
z(W, "Zahlungsüberschuss Jahr 1, frei", "K:n5.zue_jahr1.frei_dscr", "eur")
z(W, "Eigenkapital zurück in Jahr, frei", "T:t2.jahr_frei.frei_dscr", "int")
for n_, k_ in [("A", "A"), ("B", "B"), ("C", "C")]:
    z(W, f"Jahre mit Fehlbetrag 1 bis 35, {n_}", f"K:n5.jahre_fehlbetrag_1_35.{k_}", "int")
z(W, "tragbare Tilgung A (Zahlungsüberschuss Jahr 1 = 0)", "K:kern.tragbare_tilgung.A", "pct2ab")
z(W, "Tilgung der Rechnung", "K:annahme.tilgung_nbank", "pct2")
z(W, "Bearbeitungsentgelte A, einmalig", "K:n5.bearbeitungsentgelte.A", "eur")
z(W, "Marktmiete: Mehr-Eigenkapital", "T:t2.markt_dscr.mehr_ek", "mio2")

# ---------------------------------------------------------------- Anhang
W = "A6 Kennzahlen"
for key, txt, fmt in [("miete_jahr1", "Miete Jahr 1", "eur2"), ("miete_dscr_ziel", "Miete für DSCR 1,2", "eur2"),
                      ("eigenkapital", "Eigenkapital", "eur"), ("zue_jahr1", "Zahlungsüberschuss Jahr 1", "eur"),
                      ("dscr_jahr1", "DSCR Jahr 1", "dez2"), ("zue_jahr35", "Zahlungsüberschuss Jahr 35", "eur"),
                      ("kum_jahr35", "kumuliert bis Jahr 35", "eur"), ("jahr_ek_erreicht", "Eigenkapital zurück, Jahr", "int"),
                      ("jahre_fehlbetrag_1_35", "Jahre mit Fehlbetrag", "int"), ("projektkonto_tiefststand", "tiefster Stand Projektkonto", "eur"),
                      ("dscr_min_1_35", "DSCR Minimum", "dez2"), ("jahre_dscr_unter_ziel", "Jahre DSCR unter 1,2", "int"),
                      ("objektrendite", "Objektrendite", "pct2"), ("objektrendite_nach_zuschuss", "Objektrendite nach Zuschuss", "pct2"),
                      ("ek_vofi_mit_restwert", "EK-Rendite mit Restwert", "pct2"), ("ek_vofi_ohne_restwert", "EK-Rendite ohne Restwert", "pct2"),
                      ("ek_irr_mit_restwert", "EK-IRR mit Restwert", "pct2"), ("ek_irr_ohne_restwert", "EK-IRR ohne Restwert", "pct2"),
                      ("restschuld_jahr35", "Restschuld Jahr 35", "eur"), ("restwert_jahr35", "Restwert Jahr 35", "eur"),
                      ("vermoegen_jahr35", "Vermögen Jahr 35", "eur")]:
    je(W, txt, "K:n5." + key + ".{v}", fmt)
W = "A7 Nach der Bindung"
for key, txt, fmt in [("zue_jahr42", "Zahlungsüberschuss Jahr 42", "eur"), ("zue_summe_36_42", "Zahlungsüberschuss Summe Jahr 36 bis 42", "eur"),
                      ("jahre_fehlbetrag_36_42", "Jahre mit Fehlbetrag 36 bis 42", "int"), ("restschuld_jahr42", "Restschuld Jahr 42", "eur"),
                      ("vermoegen_jahr42", "Vermögen Jahr 42", "eur"), ("ek_vofi_mit_restwert_jahr42", "EK-Rendite mit Restwert, Horizont 42", "pct2"),
                      ("ek_vofi_ohne_restwert_jahr42", "EK-Rendite ohne Restwert, Horizont 42", "pct2")]:
    je(W, txt, "K:n5." + key + ".{v}", fmt)
for jahr in (35, 36, 37, 40):
    je(W, f"Miete je m² Jahr {jahr}", "K:zr.miete.{v}[" + str(jahr - 1) + "]", "eur2")
je(W, "Restschuld Jahr 35", "K:n5.restschuld_jahr35.{v}", "eur", V3)
W = "A8 Risikoläufe"
for name, L in LAEUFE[1:]:
    for n, k in V4:
        z(W, f"{name}: tiefster Stand Projektkonto, {n}", f"N6:{L}:projektkonto_tiefststand.{k}", "eur")
        z(W, f"{name}: DSCR Minimum, {n}", f"N6:{L}:dscr_min_1_35.{k}", "dez2")
        z(W, f"{name}: Eigenkapitalrendite ohne Restwert, {n}", f"N6:{L}:ek_vofi_ohne_restwert.{k}", "pct2")
        z(W, f"{name}: Vermögen Jahr 35, {n}", f"N6:{L}:vermoegen_jahr35.{k}", "mio2")
for n, k in V4:
    z(W, f"Liegenschaftszins 3,40 %: tiefster Stand Projektkonto, {n}", f"R1:projektkonto_tiefststand.{k}", "eur")
    z(W, f"Liegenschaftszins 3,40 %: Eigenkapitalrendite ohne Restwert, {n}", f"R1:ek_vofi_ohne_restwert.{k}", "pct2")
    z(W, f"Liegenschaftszins 3,40 %: Vermögen Jahr 35, {n}", f"R1:vermoegen_jahr35.{k}", "mio2")
W = "A10 Fluss frei"
for k, txt in [("sollmiete", "Sollmiete"), ("mietausfall", "Mietausfall"), ("objektverwaltung", "Objektverwaltung"),
               ("instandhaltung", "Instandhaltung"), ("uevk", "Überschuss vor Kapitaldienst"), ("zins", "Zins"),
               ("tilgung", "Tilgung"), ("kapitaldienst", "Kapitaldienst"), ("zue", "Zahlungsüberschuss")]:
    z(W, txt, f"T:jr1.frei_dscr.{k}", "eurabs")
for k, txt in [("zins", "Zins"), ("tilgung", "Tilgung"), ("zue", "Zahlungsüberschuss"), ("instandhaltung", "Instandhaltung"),
               ("objektverwaltung", "Objektverwaltung"), ("mietausfall", "Mietausfall")]:
    g(W, f"Anteil {txt} an der Sollmiete", [f"T:jr1.frei_dscr.{k}", "T:jr1.frei_dscr.sollmiete"],
      f"Betrag {txt} ÷ Sollmiete", lambda a, b: abs(a) / b, "pct1")
W = "A11, A12 (Tilgung, unverändert); Blatt 11"
z(W, "Tilgungsschwelle B gegenüber A", "T:tilgungsschwelle.B", "pct2")
z(W, "Tilgungsschwelle C gegenüber A", "T:tilgungsschwelle.C", "pct2")
je(W, "tragbare Tilgung (Zahlungsüberschuss Jahr 1 = 0)", "K:kern.tragbare_tilgung.{v}", "pct2ab", V3)


def main():
    out = ["# Zahlen des Konzepts Team 2", "",
           "Erzeugt mit `zahlen/erzeuge_zahlen.py` aus `konzepte/mappe/werte_konzepte.json` (Konzepte-Mappe, Lauf „konzepte“ und Läufe N6) "
           "und `konzepte/team-2/mappe/werte_team.json` (Team-2-Kopie mit Block T2, Lauf R1). Wert = so, wie er auf Folie oder Blatt steht; "
           "Rohwert = Mappe ungerundet. Fundstelle: Datei · Blatt!Zelle · Lauf.", "",
           "Dateien: **Konzepte-Mappe** = `konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx`; **Team-2-Kopie** = "
           "`konzepte/team-2/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team2.xlsx` (alle Blätter der Konzepte-Mappe unverändert, dazu Blatt „Team 2“); "
           "`mappe/laeufe/<lauf>.xlsx` = Läufe N6; `team-2/mappe/laeufe/liegenschaftszins_plus_0_60.xlsx` = Lauf R1. "
           "Zellen der Zeitreihen: Zeile = 6 + Jahr.", "",
           "Nicht aufgeführt: Folie 24 (heute 22, Herstellungskosten der PGN) und die Anhangfolien A9 (heute 17), A11 (heute 20) und A12 (heute A7) "
           "bleiben unverändert; ihre Zahlen kommen wie heute aus `praesentation/daten/werte.json` und `markt.json`. Ausnahme: Die Schwellen der A12 und die "
           "tragbaren Tilgungen stehen unten, weil Blatt 11 der Broschüre sie nennt.", "",
           f"Zahl der Einträge: {len(ZEILEN)}.", ""]
    wo = None
    for row in ZEILEN:
        if row[0] != wo:
            wo = row[0]
            out += ["", f"## {wo}", "", "| Größe | Wert | Rundung | Rohwert | Fundstelle |", "|---|---|---|---|---|"]
        out.append("| " + " | ".join(str(x).replace("|", "¦") for x in row[1:]) + " |")
    (TEAM / "ZAHLEN.md").write_text("\n".join(out) + "\n", encoding="utf-8")
    print("ZAHLEN.md:", len(ZEILEN), "Einträge")


if __name__ == "__main__":
    main()
