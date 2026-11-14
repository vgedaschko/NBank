#!/usr/bin/env python3
"""Team 3 (Vergleich): eigene Kopie der Konzepte-Mappe mit einem neuen Blatt „Team 3 Vergleich“ (Block T3).

Ablauf
  1. Kopie von konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx anlegen, Blatt „Team 3 Vergleich“ anhängen.
     Alle Zellen des neuen Blatts sind Formeln auf bestehende Zellen; es gibt keine neue Annahme.
  2. Neu berechnen (recalc.py, LibreOffice mit eigenem HOME), danach vofi/build_vofi.py --nachbearbeiten
     (nur XML-Einstellungen, wie in konzepte/mappe/build_konzepte.py).
  3. Gegenprobe: alle zwölf bestehenden Blätter der Kopie gleich der Konzepte-Mappe (Formeln, Konstanten, Werte).
     Status Übersicht D3, Konzepte D3 und Team 3 Vergleich D3 = OK.
  4. Werte mit Blatt und Zelle nach werte_team.json.

Aufruf
  HOME=<team>/.lohome python build_team3.py --recalc PFAD/recalc.py
"""
import argparse
import json
import math
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

HIER = Path(__file__).resolve().parent
TEAM = HIER.parent
NBANK = TEAM.parent.parent
QUELLE = NBANK / "konzepte" / "mappe" / "PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx"
GENERATOR = NBANK / "vofi" / "build_vofi.py"
ZIEL = HIER / "PGN_VOFI_Mietwohnraum_2026_v3_Team3.xlsx"
JSON_ZIEL = HIER / "werte_team.json"
LOHOME = TEAM / ".lohome"

T = "Team 3 Vergleich"
K = "Konzepte"
ZR = "Konzepte Zeitreihe"
FM = "Frei finanziert"
FD = "Frei DSCR 1,2"

# Varianten: Schlüssel, Spalte auf T3 (wie auf „Konzepte“), Blatt, Art, Name, Spalten auf „Konzepte Zeitreihe“
VARIANTEN = [
    ("A", "D", "Gefördert A", "gef", "Gruppe A, Höchstmiete", dict(uevk="D", kum="G")),
    ("B", "E", "Gefördert B", "gef", "Gruppe B, Höchstmiete", dict(uevk="M", kum="P")),
    ("C", "F", "Gefördert C", "gef", "Gruppe C, Höchstmiete", dict(uevk="V", kum="Y")),
    ("frei_markt", "G", FM, "frei", "frei finanziert, Marktmiete 15,42 €", dict(uevk="AE", kum="AH")),
    ("frei_dscr", "H", FD, "frei", "frei finanziert, Miete für DSCR 1,2 der Bank", dict(uevk="AN", kum="AQ")),
]

ROT, GRUPPE, ANTHRAZIT, GRUEN, SCHWARZ, WEISS = "8B2939", "F4F3F2", "3C3C3B", "008000", "000000", "FFFFFF"
F_EUR = '#,##0;[Red]-#,##0;"–"'
F_EUR2 = '#,##0.00;[Red]-#,##0.00;"–"'
F_PCT = '0.00 %;[Red]-0.00 %;"–"'
F_PCT1 = '0.0 %;[Red]-0.0 %;"–"'
F_FAKTOR = '0.00;[Red]-0.00;"–"'
F_JAHR = '0'


def q(blatt):
    return f"'{blatt}'"


def setze(ws, ref, wert, art="text", fmt=None, fett=False):
    c = ws[ref]
    c.value = wert
    farbe = {"text": ANTHRAZIT, "formel": SCHWARZ, "kopf": WEISS, "gruppe": ANTHRAZIT, "titel": ANTHRAZIT}[art]
    c.font = Font(name="Arial", size=14 if art == "titel" else 10, bold=fett or art in ("kopf", "gruppe", "titel"),
                  color=farbe)
    if art == "formel" and isinstance(wert, str) and re.fullmatch(r"=(?:'[^']+'|[A-Za-zÄÖÜäöü_]+)!\$?[A-Z]{1,3}\$?\d+",
                                                                   wert):
        c.font = Font(name="Arial", size=10, color=GRUEN)
    if art == "kopf":
        c.fill = PatternFill("solid", fgColor=ROT)
        c.alignment = Alignment(vertical="center", wrap_text=True)
    if art == "gruppe":
        c.fill = PatternFill("solid", fgColor=GRUPPE)
    if fmt:
        c.number_format = fmt
    return c


# Jede Zeile: (Nr., Text, Einheit, Format, Formel je Variante als Funktion, Schlüssel, Herkunft)
def zeilen_t31():
    def gef(sp_g, sp_f, vz=""):
        def f(v):
            key, col, blatt, art, *_ = v
            return f"={vz}{q(blatt)}!{sp_g if art == 'gef' else sp_f}7" if (sp_g if art == "gef" else sp_f) else "=0"
        return f

    def gef2(g1, g2, sp_f):
        def f(v):
            key, col, blatt, art, *_ = v
            return f"=-({q(blatt)}!{g1}7+{q(blatt)}!{g2}7)" if art == "gef" else f"=-{q(blatt)}!{sp_f}7"
        return f
    return [
        ("T3.1.1", "Miete Jahr 1", "€/m² Monat", F_EUR2, lambda v: f"={K}!{v[1]}49", "miete", "Konzepte Zeile 49"),
        ("T3.1.2", "Sollmiete", "€", F_EUR, gef("G", "E"), "sollmiete", "Gefördert G7 | Frei E7"),
        ("T3.1.3", "Mietausfall/Leerstand", "€", F_EUR, gef("H", "F", "-"), "mietausfall", "Gefördert −H7 | Frei −F7"),
        ("T3.1.4", "Objektverwaltung", "€", F_EUR, gef("I", "G", "-"), "objektverwaltung", "Gefördert −I7 | Frei −G7"),
        ("T3.1.5", "Instandhaltung", "€", F_EUR, gef("J", "H", "-"), "instandhaltung", "Gefördert −J7 | Frei −H7"),
        ("T3.1.6", "Bewirtschaftung = T3.1.3 + T3.1.4 + T3.1.5", "€", F_EUR, lambda v: f"=SUM({v[1]}8:{v[1]}10)",
         "bewirtschaftung", "Summe"),
        ("T3.1.7", "Überschuss vor Kapitaldienst", "€", F_EUR, gef("K", "I"), "uevk", "Gefördert K7 | Frei I7"),
        ("T3.1.8", "Verwaltungskostenbeitrag", "€", F_EUR, gef("L", None, "-"), "vkb", "Gefördert −L7 | Frei 0"),
        ("T3.1.9", "Zins (NBank-Darlehen bzw. Bankdarlehen)", "€", F_EUR, gef2("M", "O", "J"), "zins",
         "Gefördert −(M7 + O7) | Frei −J7"),
        ("T3.1.10", "Tilgung (NBank-Darlehen bzw. Bankdarlehen)", "€", F_EUR, gef2("N", "P", "K"), "tilgung",
         "Gefördert −(N7 + P7) | Frei −K7"),
        ("T3.1.11", "Kapitaldienst", "€", F_EUR, gef("Q", "L", "-"), "kapitaldienst", "Gefördert −Q7 | Frei −L7"),
        ("T3.1.12", "Zahlungsüberschuss", "€", F_EUR, gef("R", "M"), "zue", "Gefördert R7 | Frei M7"),
        ("T3.1.13", "DSCR Jahr 1", "Faktor", F_FAKTOR, gef("S", "N"), "dscr", "Gefördert S7 | Frei N7"),
    ]


# T3.2 je m² Wohnfläche und Monat: Zeile aus T3.1 ÷ (Wohnfläche × 12)
T32 = [
    ("T3.2.1", "Sollmiete je m² und Monat (= Miete Jahr 1)", 7, "sollmiete"),
    ("T3.2.2", "Mietausfall/Leerstand je m² und Monat", 8, "mietausfall"),
    ("T3.2.3", "Objektverwaltung je m² und Monat", 9, "objektverwaltung"),
    ("T3.2.4", "Instandhaltung je m² und Monat", 10, "instandhaltung"),
    ("T3.2.5", "Bewirtschaftung je m² und Monat", 11, "bewirtschaftung"),
    ("T3.2.6", "Verwaltungskostenbeitrag je m² und Monat", 13, "vkb"),
    ("T3.2.7", "Zins je m² und Monat", 14, "zins"),
    ("T3.2.8", "Tilgung je m² und Monat", 15, "tilgung"),
    ("T3.2.9", "Kapitaldienst je m² und Monat", 16, "kapitaldienst"),
    ("T3.2.10", "Zahlungsüberschuss je m² und Monat", 17, "zue"),
]


def baue_blatt(wb):
    ws = wb.create_sheet(T)
    for c, b in {"A": 8, "B": 58, "C": 12, "D": 13, "E": 13, "F": 13, "G": 15, "H": 15, "I": 46}.items():
        ws.column_dimensions[c].width = b
    setze(ws, "A1", "Team 3 Vergleich: dasselbe Haus in vier Varianten, Modellhaus (Projekt 2)", "titel")
    setze(ws, "A2", "Neuer Block T3 nur mit Formeln auf bestehende Zellen; keine neue Annahme. "
                    "Spalten wie auf „Konzepte“: D bis F Gruppe A bis C, G frei zur Marktmiete, H frei zur Miete für DSCR 1,2.")
    setze(ws, "B3", "Prüfungen Team 3 (Block T3K)", fett=True)
    eintraege = []   # (schluessel, zelle, einheit, bedeutung, herkunft)

    def kopf(r, titel, spalten=("A", "B", "C", "D", "E", "F", "G", "H", "I"),
             texte=("Nr.", None, "Einheit", "A", "B", "C", "Frei, Marktmiete", "Frei, DSCR 1,2", "Herkunft")):
        for c, t in zip(spalten, texte):
            setze(ws, f"{c}{r}", titel if t is None else t, "kopf")

    # ---- T3.1 Jahresrechnung Jahr 1 je Variante, € p. a. (Zeilen 6 bis 18)
    kopf(5, "T3.1 Jahresrechnung Jahr 1 je Variante, € p. a. (Auszahlungen positiv)")
    r = 6
    for nr, text, einh, fmt, fn, schl, herk in zeilen_t31():
        setze(ws, f"A{r}", nr)
        setze(ws, f"B{r}", text)
        setze(ws, f"C{r}", einh)
        for v in VARIANTEN:
            setze(ws, f"{v[1]}{r}", fn(v), "formel", fmt)
            eintraege.append((f"t3.jr1.{schl}.{v[0]}", f"{v[1]}{r}", einh, f"{nr} {text}; {v[4]}", herk))
        setze(ws, f"I{r}", herk)
        r += 1
    assert r == 19, r

    # ---- T3.2 je m² und Monat (Zeilen 21 bis 32)
    kopf(20, "T3.2 Jahresrechnung Jahr 1 je m² Wohnfläche und Monat (T3.1 ÷ Wohnfläche ÷ 12)")
    r = 21
    for nr, text, quelle_r, schl in T32:
        setze(ws, f"A{r}", nr)
        setze(ws, f"B{r}", text)
        setze(ws, f"C{r}", "€/m² Monat")
        for v in VARIANTEN:
            setze(ws, f"{v[1]}{r}", f"={v[1]}{quelle_r}/(Wohnflaeche*12)", "formel", F_EUR2)
            eintraege.append((f"t3.qm.{schl}.{v[0]}", f"{v[1]}{r}", "€/m² Monat", f"{nr} {text}; {v[4]}",
                              f"T3.1 Zeile {quelle_r} ÷ (Eingaben F8 × 12)"))
        setze(ws, f"I{r}", f"Zeile {quelle_r} ÷ (Wohnfläche Eingaben F8 × 12)")
        r += 1
    anteile = [("T3.2.11", "Anteil Zins an der Sollmiete", 14, "anteil_zins"),
               ("T3.2.12", "Anteil Tilgung an der Sollmiete", 15, "anteil_tilgung"),
               ("T3.2.13", "Anteil Zahlungsüberschuss an der Sollmiete", 17, "anteil_zue")]
    for nr, text, zr_, schl in anteile:
        setze(ws, f"A{r}", nr)
        setze(ws, f"B{r}", text)
        setze(ws, f"C{r}", "Anteil")
        for v in VARIANTEN:
            setze(ws, f"{v[1]}{r}", f"={v[1]}{zr_}/{v[1]}7", "formel", F_PCT1)
            eintraege.append((f"t3.qm.{schl}.{v[0]}", f"{v[1]}{r}", "Anteil", f"{nr} {text}; {v[4]}",
                              f"T3.1 Zeile {zr_} ÷ Zeile 7"))
        setze(ws, f"I{r}", f"Zeile {zr_} ÷ Zeile 7")
        r += 1
    assert r == 34, r

    # ---- T3.3 Mieten im Vergleich, € je m² und Monat (Zeilen 36 bis 44)
    kopf(35, "T3.3 Mieten im Vergleich, Jahr 1")
    t33 = [
        ("T3.3.1", "Kostendeckende Anfangsmiete (Zahlungsüberschuss Jahr 1 = 0, DSCR 1,0)", "€/m² Monat", F_EUR2,
         lambda v: "='Übersicht'!" + ({"D": "D", "E": "E", "F": "F"}.get(v[1], "G")) + "112", "kostendeckend",
         "Übersicht D112:G112 (Block 8, DSCR-Ziel der Mappe 1,0); frei beide Spalten G112"),
        ("T3.3.2", "Miete für DSCR 1,2", "€/m² Monat", F_EUR2, lambda v: f"={K}!{v[1]}50", "miete_dscr",
         "Konzepte Zeile 50 (N5.2)"),
        ("T3.3.3", "Miete Jahr 1 im Modell (Höchstmiete bzw. Marktmiete bzw. Miete für DSCR 1,2)", "€/m² Monat",
         F_EUR2, lambda v: f"={K}!{v[1]}49", "miete_modell", "Konzepte Zeile 49 (N5.1)"),
        ("T3.3.4", "Marktmiete Jahr 1", "€/m² Monat", F_EUR2, lambda v: f"={K}!{v[1]}51", "marktmiete",
         "Konzepte Zeile 51 (Eingabe 4.4)"),
        ("T3.3.5", "Miete im Modell minus kostendeckende Anfangsmiete", "€/m² Monat", F_EUR2,
         lambda v: f"={v[1]}38-{v[1]}36", "abstand_kostendeckend", "T3.3.3 − T3.3.1"),
        ("T3.3.6", "Miete im Modell minus Miete für DSCR 1,2", "€/m² Monat", F_EUR2,
         lambda v: f"={v[1]}38-{v[1]}37", "abstand_dscr", "T3.3.3 − T3.3.2"),
        ("T3.3.7", "Miete für DSCR 1,2 minus Marktmiete", "€/m² Monat", F_EUR2,
         lambda v: f"={v[1]}37-{v[1]}39", "dscr_minus_markt", "T3.3.2 − T3.3.4"),
        ("T3.3.8", "Kostendeckende Anfangsmiete minus Marktmiete", "€/m² Monat", F_EUR2,
         lambda v: f"={v[1]}36-{v[1]}39", "kostendeckend_minus_markt", "T3.3.1 − T3.3.4"),
        ("T3.3.9", "Miete im Modell in % der Marktmiete", "Anteil", F_PCT1,
         lambda v: f"={v[1]}38/{v[1]}39", "anteil_markt", "T3.3.3 ÷ T3.3.4"),
    ]
    r = 36
    for nr, text, einh, fmt, fn, schl, herk in t33:
        setze(ws, f"A{r}", nr)
        setze(ws, f"B{r}", text)
        setze(ws, f"C{r}", einh)
        for v in VARIANTEN:
            setze(ws, f"{v[1]}{r}", fn(v), "formel", fmt)
            eintraege.append((f"t3.miete.{schl}.{v[0]}", f"{v[1]}{r}", einh, f"{nr} {text}; {v[4]}", herk))
        setze(ws, f"I{r}", herk)
        r += 1
    assert r == 45, r

    # ---- T3.4 Rückfluss des Eigenkapitals (Zeilen 47 bis 52)
    kopf(46, "T3.4 Rückfluss des Eigenkapitals (kumulierter Zahlungsüberschuss, unverzinst, ÷ Eigenkapital)")
    t34 = [
        ("T3.4.1", "Eingesetztes Eigenkapital", "€", F_EUR, lambda v: f"={K}!{v[1]}56", "eigenkapital",
         "Konzepte Zeile 56 (N5.8)"),
        ("T3.4.2", "Rückflussquote Ende Jahr 10", "Anteil", F_PCT1, lambda v: f"={v[1]}76", "quote_jahr10",
         "Zeitreihe T3.6, Jahr 10"),
        ("T3.4.3", "Rückflussquote Ende Jahr 20", "Anteil", F_PCT1, lambda v: f"={v[1]}86", "quote_jahr20",
         "Zeitreihe T3.6, Jahr 20"),
        ("T3.4.4", "Rückflussquote Ende Jahr 35", "Anteil", F_PCT1, lambda v: f"={v[1]}101", "quote_jahr35",
         "Zeitreihe T3.6, Jahr 35"),
        ("T3.4.5", "Erstes Jahr mit Rückflussquote ≥ 100 % (Gegenprobe zu Konzepte Zeile 67)", "Jahr", F_JAHR,
         lambda v: f"=COUNTIF({v[1]}67:{v[1]}108,\"<1\")+1", "jahr_100", "Anzahl Jahre unter 100 % + 1"),
        ("T3.4.6", "Objektrendite Jahr 35 = Überschuss vor Kapitaldienst Jahr 35 ÷ Gesamtkosten", "Anteil", F_PCT,
         lambda v: f"=J{101 - 0}" if False else None, "objektrendite_jahr35", "Zeitreihe T3.6, Jahr 35"),
    ]
    r = 47
    for nr, text, einh, fmt, fn, schl, herk in t34:
        setze(ws, f"A{r}", nr)
        setze(ws, f"B{r}", text)
        setze(ws, f"C{r}", einh)
        for i, v in enumerate(VARIANTEN):
            f = fn(v) if schl != "objektrendite_jahr35" else f"={get_column_letter(10 + i)}101"
            setze(ws, f"{v[1]}{r}", f, "formel", fmt)
            eintraege.append((f"t3.rueckfluss.{schl}.{v[0]}", f"{v[1]}{r}", einh, f"{nr} {text}; {v[4]}", herk))
        setze(ws, f"I{r}", herk)
        r += 1
    assert r == 53, r

    # ---- T3.5 Ausgangslage und Programmteil 2.1 für die Fazit-Folie (Zeilen 55 bis 62), nur Spalte D
    for c, t in zip("ABCDI", ("Nr.", "T3.5 Ausgangslage und Förderung (Fazit-Folie)", "Einheit", "Wert", "Herkunft")):
        setze(ws, f"{c}54", t, "kopf")
    t35 = [
        ("T3.5.1", "Herstellungskosten ARGE-Median, Q1 2020", "€/m²", F_EUR, "=Tabellen!D47", "hk_2020",
         "Tabellen D47 (T32)"),
        ("T3.5.2", "Herstellungskosten ARGE-Median, heute (Q4 2025)", "€/m²", F_EUR, "=Tabellen!E47", "hk_heute",
         "Tabellen E47 (T32)"),
        ("T3.5.3", "Anstieg der Herstellungskosten", "Anteil", F_PCT1, "=D56/D55-1", "hk_anstieg", "T3.5.2 ÷ T3.5.1 − 1"),
        ("T3.5.4", "Sollzins 10 Jahre Zinsbindung, Q1 2020", "Anteil", F_PCT, "=Tabellen!D49", "zins_2020",
         "Tabellen D49 (T34)"),
        ("T3.5.5", "Sollzins 10 Jahre Zinsbindung, heute", "Anteil", F_PCT, "=Tabellen!E49", "zins_heute",
         "Tabellen E49 (T34) = Eingabe 6.1"),
        ("T3.5.6", "Kapitaldienst je m² und Monat, Q1 2020", "€/m² Monat", F_EUR2, "=Tabellen!D53", "kd_qm_2020",
         "Tabellen D53 (T38)"),
        ("T3.5.7", "Kapitaldienst je m² und Monat, heute", "€/m² Monat", F_EUR2, "=Tabellen!E53", "kd_qm_heute",
         "Tabellen E53 (T38)"),
        ("T3.5.8", "Förderquote auf die Gesamtkosten, Modellhaus", "Anteil", F_PCT1, "='Übersicht'!D16",
         "foerderquote", "Übersicht D16 (1.8)"),
    ]
    r = 55
    for nr, text, einh, fmt, f, schl, herk in t35:
        setze(ws, f"A{r}", nr)
        setze(ws, f"B{r}", text)
        setze(ws, f"C{r}", einh)
        setze(ws, f"D{r}", f, "formel", fmt)
        setze(ws, f"I{r}", herk)
        eintraege.append((f"t3.fazit.{schl}", f"D{r}", einh, f"{nr} {text}", herk))
        r += 1
    assert r == 63, r

    # ---- T3.6 Zeitreihe Jahr 0 bis 42 (Kopf Zeile 65, Jahr 0 = Zeile 66, Jahr 42 = Zeile 108)
    setze(ws, "A64", "T3.6 Zeitreihe: Rückflussquote (D bis H) und Objektrendite (J bis N; P bis R nach Zuschuss)",
          "gruppe")
    for c, t in zip(["A", "B", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R"],
                    ["Jahr", "Kalenderjahr", "Rückfluss A", "Rückfluss B", "Rückfluss C", "Rückfluss frei, Markt",
                     "Rückfluss frei, DSCR 1,2", "Objektrendite A", "Objektrendite B", "Objektrendite C",
                     "Objektrendite frei, Markt", "Objektrendite frei, DSCR 1,2", "Objektrendite A nach Zuschuss",
                     "Objektrendite B nach Zuschuss", "Objektrendite C nach Zuschuss"]):
        setze(ws, f"{c}65", t, "kopf")
    for c in "JKLMNPQR":
        ws.column_dimensions[c].width = 13
    for j in range(0, 43):
        rr = 66 + j
        zr_row = 6 + j
        setze(ws, f"A{rr}", f"='{ZR}'!A{zr_row}", "formel", F_JAHR)
        setze(ws, f"B{rr}", f"='{ZR}'!B{zr_row}", "formel", F_JAHR)
        for i, v in enumerate(VARIANTEN):
            col = v[1]
            kum = f"'{ZR}'!{v[5]['kum']}{zr_row}"
            setze(ws, f"{col}{rr}", f"={kum}/{K}!{v[1]}56", "formel", F_PCT1)
            oc = get_column_letter(10 + i)
            if j == 0:
                setze(ws, f"{oc}{rr}", "", "text")
            else:
                setze(ws, f"{oc}{rr}", f"='{ZR}'!{v[5]['uevk']}{zr_row}/{K}!{v[1]}52", "formel", F_PCT)
            if v[3] == "gef":
                pc = get_column_letter(16 + i)
                if j > 0:
                    setze(ws, f"{pc}{rr}", f"='{ZR}'!{v[5]['uevk']}{zr_row}/({K}!{v[1]}52-{K}!{v[1]}53)",
                          "formel", F_PCT)
    for i, v in enumerate(VARIANTEN):
        eintraege.append((f"t3.zr.rueckfluss.{v[0]}", f"{v[1]}66:{v[1]}108", "Anteil",
                          f"T3.6 Rückflussquote = kumulierter Zahlungsüberschuss ÷ Eigenkapital; Jahr 0 bis 42; {v[4]}",
                          f"Konzepte Zeitreihe {v[5]['kum']}6:{v[5]['kum']}48 ÷ Konzepte {v[1]}56"))
        oc = get_column_letter(10 + i)
        eintraege.append((f"t3.zr.objektrendite.{v[0]}", f"{oc}67:{oc}108", "Anteil",
                          f"T3.6 Objektrendite = Überschuss vor Kapitaldienst ÷ Gesamtkosten; Jahr 1 bis 42; {v[4]}",
                          f"Konzepte Zeitreihe {v[5]['uevk']}7:{v[5]['uevk']}48 ÷ Konzepte {v[1]}52"))
        if v[3] == "gef":
            pc = get_column_letter(16 + i)
            eintraege.append((f"t3.zr.objektrendite_nach_zuschuss.{v[0]}", f"{pc}67:{pc}108", "Anteil",
                              f"T3.6 Objektrendite, Nenner Gesamtkosten − Zuschuss; Jahr 1 bis 42; {v[4]}",
                              f"Konzepte Zeitreihe {v[5]['uevk']}7:{v[5]['uevk']}48 ÷ (Konzepte {v[1]}52 − {v[1]}53)"))
    eintraege.append(("t3.zr.jahr", "A67:A108", "Jahr", "T3.6 Jahr 1 bis 42", "Konzepte Zeitreihe A7:A48"))

    # ---- T3K Prüfungen (Zeilen 111 bis 117), Status D3
    for c, t in zip("ABCD", ("Nr.", "T3K Prüfungen des Blocks T3", "", "Status")):
        setze(ws, f"{c}110", t, "kopf")
    pr = [
        ("T3K1", "Sollmiete − Bewirtschaftung = Überschuss vor Kapitaldienst (je Variante)",
         'IF(AND(' + ",".join(f"ABS({c}7-{c}11-{c}12)<0.01" for c in "DEFGH") + '),"OK","prüfen")'),
        ("T3K2", "Überschuss vor Kapitaldienst − Kapitaldienst = Zahlungsüberschuss (je Variante, Rundung 2 Stellen)",
         'IF(AND(' + ",".join(f"ABS({c}12-{c}16-{c}17)<0.02" for c in "DEFGH") + '),"OK","prüfen")'),
        ("T3K3", "Zins + Tilgung + Verwaltungskostenbeitrag = Kapitaldienst (je Variante)",
         'IF(AND(' + ",".join(f"ABS({c}13+{c}14+{c}15-{c}16)<0.01" for c in "DEFGH") + '),"OK","prüfen")'),
        ("T3K4", "Je m²: Bewirtschaftung + Kapitaldienst + Zahlungsüberschuss = Miete Jahr 1",
         'IF(AND(' + ",".join(f"ABS({c}25+{c}29+{c}30-{c}6)<0.0001" for c in "DEFGH") + '),"OK","prüfen")'),
        ("T3K5", "Erstes Jahr mit Rückflussquote ≥ 100 % = Konzepte Zeile 67 (N5.17)",
         'IF(AND(' + ",".join(f"{c}51={K}!{c}67" for c in "DEFGH") + '),"OK","prüfen")'),
        ("T3K6", "Prüfungen der Mappe (Übersicht D3) und der Konzepte (Konzepte D3)",
         f'IF(AND(\'Übersicht\'!$D$3="OK",{K}!$D$3="OK"),"OK","prüfen")'),
        ("T3K7", "Aktives Projekt = 2 (Modellhaus)", 'IF(Projekt_Nr=2,"OK","prüfen")'),
    ]
    r = 111
    for nr, text, f in pr:
        setze(ws, f"A{r}", nr)
        setze(ws, f"B{r}", text)
        setze(ws, f"D{r}", "=" + f, "formel")
        eintraege.append((f"t3.pruefung.{nr.lower()}", f"D{r}", "Text", f"{nr} {text}", "Prüfung"))
        r += 1
    setze(ws, "D3", f'=IF(COUNTIF(D111:D{r - 1},"OK")={r - 111},"OK","prüfen")', "formel", fett=True)

    # ---- T3.7 Objekt-IRR der Mappe in drei Lesarten, Horizont Jahr 35 (Zeilen 121 bis 125)
    kopf(120, "T3.7 Objekt-IRR der Mappe, Jahr 35 (Übersicht 5.1 bis 5.9; frei DSCR 1,2: Blatt Frei DSCR 1,2)")
    t37 = [
        ("T3.7.1", "Objekt-IRR ohne Zuschuss, mit Restwert", "79", "I136", "irr_ohne_zuschuss_mit_restwert"),
        ("T3.7.2", "Objekt-IRR nach Zuschuss, mit Restwert", "78", "I136", "irr_nach_zuschuss_mit_restwert"),
        ("T3.7.3", "Objekt-IRR nach Förderbarwert, mit Restwert", "76", "I136", "irr_nach_foerderbarwert_mit_restwert"),
        ("T3.7.4", "Objekt-IRR ohne Zuschuss, ohne Restwert", "84", "I138", "irr_ohne_zuschuss_ohne_restwert"),
        ("T3.7.5", "Objekt-IRR nach Zuschuss, ohne Restwert", "82", "I138", "irr_nach_zuschuss_ohne_restwert"),
    ]
    r = 121
    for nr, text, ue_zeile, fd_zelle, schl in t37:
        setze(ws, f"A{r}", nr)
        setze(ws, f"B{r}", text)
        setze(ws, f"C{r}", "Anteil")
        for v in VARIANTEN:
            if v[0] == "frei_dscr":
                f, herk = f"={q(FD)}!{fd_zelle}", f"Frei DSCR 1,2 {fd_zelle}"
            else:
                sp = {"A": "D", "B": "E", "C": "F", "frei_markt": "G"}[v[0]]
                f, herk = f"='Übersicht'!{sp}{ue_zeile}", f"Übersicht {sp}{ue_zeile}"
            setze(ws, f"{v[1]}{r}", f, "formel", F_PCT)
            eintraege.append((f"t3.irr.{schl}.{v[0]}", f"{v[1]}{r}", "Anteil", f"{nr} {text}; {v[4]}", herk))
        setze(ws, f"I{r}", f"Übersicht Zeile {ue_zeile}; frei DSCR 1,2: {fd_zelle} (frei ohne Zuschuss)")
        r += 1
    eintraege.append(("t3.status", "D3", "Text", "Status der Prüfungen T3K1 bis T3K7", "Prüfung"))
    ws.freeze_panes = "D5"
    return eintraege


def env_lo():
    LOHOME.mkdir(parents=True, exist_ok=True)
    e = dict(os.environ)
    e["HOME"] = str(LOHOME)
    e["PYTHONDONTWRITEBYTECODE"] = "1"
    return e


def neu_berechnen(datei, recalc, timeout=240):
    p = subprocess.run([sys.executable, str(recalc), str(datei), str(timeout)], capture_output=True, text=True,
                       env=env_lo(), timeout=timeout + 300)
    txt = p.stdout.strip()
    try:
        res = json.loads(txt[txt.index("{"):])
    except ValueError:
        sys.exit(f"recalc ohne Ergebnis: {txt[:400]} {p.stderr[:400]}")
    subprocess.run([sys.executable, "-B", str(GENERATOR), "--nachbearbeiten", str(datei)], check=True,
                   capture_output=True, env=env_lo(), cwd=str(HIER))
    return res


def gleich(a, b, tol=1e-9):
    if isinstance(a, (int, float)) and isinstance(b, (int, float)) and not isinstance(a, bool):
        return abs(a - b) <= tol * max(1.0, abs(a), abs(b))
    return a == b


def vergleiche(blaetter):
    erg = dict(zellen=0, formeln=0, abweichungen=[])
    for data_only in (False, True):
        wo = openpyxl.load_workbook(QUELLE, data_only=data_only)
        wk = openpyxl.load_workbook(ZIEL, data_only=data_only)
        for name in blaetter:
            so, sk = wo[name], wk[name]
            for row in range(1, max(so.max_row, sk.max_row) + 1):
                for col in range(1, max(so.max_column, sk.max_column) + 1):
                    a, b = so.cell(row, col).value, sk.cell(row, col).value
                    if a is None and b is None:
                        continue
                    if not data_only:
                        erg["zellen"] += 1
                        if isinstance(a, str) and a.startswith("="):
                            erg["formeln"] += 1
                    if not gleich(a, b):
                        erg["abweichungen"].append((("Wert " if data_only else "Formel ") + name,
                                                    f"{get_column_letter(col)}{row}", a, b))
    return erg


def roh(v):
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
        return None
    return v


def lese(ws, ref):
    if ":" in ref:
        return [roh(c[0].value) for c in ws[ref]] if ref.split(":")[0][0] == ref.split(":")[1][0] or True else None
    return roh(ws[ref].value)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--recalc", required=True)
    a = ap.parse_args()
    shutil.copy(QUELLE, ZIEL)
    wb = openpyxl.load_workbook(ZIEL)
    alte = list(wb.sheetnames)
    eintraege = baue_blatt(wb)
    wb.active = 0
    for ws in wb.worksheets:
        ws.sheet_view.tabSelected = ws.title == alte[0]
    wb.save(ZIEL)
    res = neu_berechnen(ZIEL, a.recalc)
    print("recalc:", {k: res.get(k) for k in ("status", "total_errors", "total_formulas")})
    if res.get("status") != "success" or res.get("total_errors"):
        sys.exit(f"recalc mit Fehlern: {res}")
    v = vergleiche(alte)
    print("Vergleich bestehende Blätter:", v["zellen"], "Zellen,", v["formeln"], "Formeln,",
          len(v["abweichungen"]), "Abweichungen")
    if v["abweichungen"]:
        print(v["abweichungen"][:10])
        sys.exit(1)
    wv = openpyxl.load_workbook(ZIEL, data_only=True)
    ws = wv[T]
    status = dict(team3=ws["D3"].value, konzepte=wv[K]["D3"].value, mappe=wv["Übersicht"]["D3"].value)
    print("Status:", status)
    werte = {}
    for schl, zelle, einh, bed, herk in eintraege:
        if ":" in zelle:
            wert = [roh(c[0].value) for c in ws[zelle]]
        else:
            wert = roh(ws[zelle].value)
        werte[schl] = dict(schluessel=schl, wert=wert, einheit=einh, blatt=T, zelle=zelle, bedeutung=bed,
                           herkunft=herk, lauf="team3")
    daten = dict(
        meta=dict(titel="Werte des Blocks T3 (Team 3 Vergleich) für das Modellhaus",
                  mappe=ZIEL.name, quelle="konzepte/mappe/" + QUELLE.name,
                  aufbau="werte.<schluessel> = {schluessel, wert, einheit, blatt, zelle, bedeutung, herkunft, lauf}",
                  neuberechnung="recalc.py (LibreOffice)",
                  pruefungen=dict(status, recalc=res.get("status"), formelfehler=res.get("total_errors"),
                                  vergleich_bestehende_blaetter=dict(zellen=v["zellen"], formeln=v["formeln"],
                                                                     abweichungen=len(v["abweichungen"]))),
                  hinweise=["Alle Werte roh und ungerundet; Anteile als Dezimalbruch.",
                            "Jede Zelle des Blocks T3 ist eine Formel auf bestehende Zellen; keine neue Annahme.",
                            "Werte der gemeinsamen Blöcke N1 bis N6 stehen in konzepte/mappe/werte_konzepte.json."]),
        werte=werte)
    JSON_ZIEL.write_text(json.dumps(daten, ensure_ascii=False, indent=1), encoding="utf-8")
    print("geschrieben:", JSON_ZIEL, len(werte), "Schlüssel")
    if any(x != "OK" for x in status.values()):
        sys.exit("Status nicht OK")


if __name__ == "__main__":
    main()
