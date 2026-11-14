#!/usr/bin/env python3
"""Rechenmappe für die Konzepte: Kopie der VOFI-Mappe v3 mit neuen Blättern.

Lädt eine Kopie von vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx, hängt drei neue Blätter an und speichert
PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx in diesem Ordner. Bestehende Blätter, Zellen und Formeln bleiben
unverändert; neue Rechnungen stehen nur auf den neuen Blättern, alle als Formel. Einzige neue Annahme:
DSCR-Ziel der Bank, frei finanziert = 1,2 (Annahme der PGN), Blatt „Konzepte“, Zelle D6.

Neue Blätter
  Konzepte            N1 Annahme DSCR 1,2 | N2 Miete frei finanziert für DSCR 1,2 | N3 Miete A, B, C für DSCR 1,2 |
                      N4 Objektrendite | N5 Kennzahlen je Variante | K Prüfungen der neuen Blöcke
  Frei DSCR 1,2       Kopie des Blatts „Frei finanziert“ (gleiche Spalten und Formeln), Miete Jahr 1 = H183 (DSCR-Ziel
                      der Bank aus Konzepte!D6); Restwert aus der Marktmiete (Hilfsspalte AD)
  Konzepte Zeitreihe  Jahr 0 bis 42 je Variante: Miete, Überschuss vor Kapitaldienst, Kapitaldienst,
                      Zahlungsüberschuss, kumuliert, DSCR, Restschuld, Projektkonto, Eigenkapital erreicht

Ablauf (ohne Option alles):
  1. bauen               Kopie laden, neue Blätter anhängen, speichern
  2. neu berechnen        recalc.py (LibreOffice), danach build_vofi.py --nachbearbeiten (nur XML-Einstellungen)
  3. vergleichen          Original gegen Kopie, alle bestehenden Blätter: Formeln/Konstanten und Werte
  4. Szenario-Läufe       Kopien der Konzepte-Mappe, je eine Eingabe geändert, neu berechnet (Ordner laeufe/)
  5. Ausgabe              werte_konzepte.json, ANNAHMEN.md

Aufruf:
  python build_konzepte.py [--recalc PFAD] [--ohne-laeufe] [--parallel 3]

LibreOffice läuft mit HOME=<dieser Ordner>/.lohome (eigenes Profil, parallel zu anderen Arbeiten).
"""
import argparse
import concurrent.futures as cf
import hashlib
import json
import math
import os
import re
import shutil
import subprocess
import sys
from copy import copy
from pathlib import Path

import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter, column_index_from_string

HIER = Path(__file__).resolve().parent
NBANK = HIER.parent.parent
VOFI = NBANK / "vofi"
ORIGINAL = VOFI / "PGN_VOFI_Mietwohnraum_2026_v3.xlsx"
GENERATOR = VOFI / "build_vofi.py"
ZIEL = HIER / "PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx"
LAUF_DIR = HIER / "laeufe"
JSON_ZIEL = HIER / "werte_konzepte.json"
ANNAHMEN_ZIEL = HIER / "ANNAHMEN.md"
LOHOME = HIER / ".lohome"

ALTE_BLAETTER = ["Übersicht", "Eingaben", "Gefördert A", "Gefördert B", "Gefördert C", "Frei finanziert", "NBank",
                 "Tabellen", "Hinweise"]
K = "Konzepte"
FD = "Frei DSCR 1,2"
ZR = "Konzepte Zeitreihe"
NEUE_BLAETTER = [K, FD, ZR]
DSCR_ZIEL_BANK = 1.2          # N1: einzige neue Annahme (PGN)
DSCR_ZELLE = "$D$6"           # Konzepte!D6

# Varianten: Schlüssel, Spalte auf „Konzepte“, Blatt, Art, Name
VARIANTEN = [
    ("A", "D", "Gefördert A", "gef", "Gruppe A, Höchstmiete"),
    ("B", "E", "Gefördert B", "gef", "Gruppe B, Höchstmiete"),
    ("C", "F", "Gefördert C", "gef", "Gruppe C, Höchstmiete"),
    ("frei_markt", "G", "Frei finanziert", "frei", "frei finanziert, Marktmiete 15,42 € (Eingabe 10.1)"),
    ("frei_dscr", "H", FD, "frei", "frei finanziert, Miete für DSCR 1,2 der Bank"),
]
# Spalten der Zeitreihe je Blattart (Zeile 6 = Jahr 0, Zeile 7 bis 48 = Jahr 1 bis 42)
SP = {
    "gef": dict(miete="F", uevk="K", kd="Q", zue="R", kum="W", dscr="S", rs=("T", "U"), konto="V",
                vw="I", ih="J"),
    "frei": dict(miete="D", uevk="I", kd="L", zue="M", kum="Q", dscr="N", rs=("O",), konto="P",
                 vw="G", ih="H"),
}

# ------------------------------------------------------------------------------------------------------------
# Gestaltung (Farben und Formate wie build_vofi.py)
# ------------------------------------------------------------------------------------------------------------
ROT, GRUPPE, ANTHRAZIT = "8B2939", "F4F3F2", "3C3C3B"
BLAU, GELB, GRUEN, SCHWARZ, LINIE, WEISS = "0000FF", "FFF2CC", "008000", "000000", "D9D9D9", "FFFFFF"
F_EUR = '#,##0;[Red]-#,##0;"–"'
F_EUR2 = '#,##0.00;[Red]-#,##0.00;"–"'
F_PCT = '0.00 %;[Red]-0.00 %;"–"'
F_PCT1 = '0.0 %;[Red]-0.0 %;"–"'
F_FAKTOR = '0.00;[Red]-0.00;"–"'
F_FAKTOR3 = '0.000;[Red]-0.000;"–"'
F_JAHR = '0'
F_ANZ = '#,##0;[Red]-#,##0;"0"'
DUENN = Side(style="thin", color=LINIE)


def font(farbe=ANTHRAZIT, fett=False, groesse=10):
    return Font(name="Arial", size=groesse, bold=fett, color=farbe)


def fill(farbe):
    return PatternFill("solid", fgColor=farbe)


def setze(ws, ref, wert, art="text", fmt=None, fett=False, umbruch=False, h=None):
    c = ws[ref]
    c.value = wert
    if art == "text":
        c.font = font(ANTHRAZIT, fett)
    elif art == "formel":
        verweis = isinstance(wert, str) and re.fullmatch(r"=(?:'[^']+'|[A-Za-zÄÖÜäöü_]+)!\$?[A-Z]{1,3}\$?\d+", wert)
        c.font = font(GRUEN if verweis else SCHWARZ, fett)
    elif art == "eingabe":
        c.font = font(BLAU, True)
        c.fill = fill(GELB)
        c.border = Border(left=DUENN, right=DUENN, top=DUENN, bottom=DUENN)
    elif art == "kopf":
        c.font = font(WEISS, True)
        c.fill = fill(ROT)
        umbruch = True
    elif art == "gruppe":
        c.font = font(ANTHRAZIT, True)
        c.fill = fill(GRUPPE)
    elif art == "titel":
        c.font = font(ANTHRAZIT, True, 14)
    if fmt:
        c.number_format = fmt
    if umbruch or h:
        c.alignment = Alignment(horizontal=h, vertical="center" if art == "kopf" else "top", wrap_text=umbruch or None)
    return c


def q(blatt):
    return f"'{blatt}'"


def druck_wie(ws, src):
    """Druck wie die Blätter der Mappe: A4 quer, eine Seite breit, Ränder und Fußzeile wie das Vorbild."""
    ws.page_setup.orientation = "landscape"
    ws.page_setup.paperSize = 9
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.page_margins = copy(src.page_margins)
    ws.oddFooter.left.text = src.oddFooter.left.text
    ws.oddFooter.right.text = src.oddFooter.right.text
    for teil in ("left", "right"):
        a, b = getattr(src.oddFooter, teil), getattr(ws.oddFooter, teil)
        b.size, b.font, b.color = a.size, a.font, a.color


# ------------------------------------------------------------------------------------------------------------
# Blatt „Frei DSCR 1,2“: Kopie von „Frei finanziert“
# ------------------------------------------------------------------------------------------------------------
def blatt_frei_dscr(wb):
    src = wb["Frei finanziert"]
    ws = wb.copy_worksheet(src)
    ws.title = FD
    ws.freeze_panes = src.freeze_panes
    ws.sheet_properties.outlinePr = copy(src.sheet_properties.outlinePr)
    ws.sheet_properties.pageSetUpPr = copy(src.sheet_properties.pageSetUpPr)
    druck_wie(ws, src)
    ws.print_title_rows = "2:3"
    ws.print_area = "A1:Q48,A88:Q186"
    # Sprungmarken in Zeile 2 auf das neue Blatt
    for c in ws[2]:
        if c.hyperlink and c.hyperlink.location and c.hyperlink.location.startswith("'Frei finanziert'!"):
            c.hyperlink.location = c.hyperlink.location.replace("'Frei finanziert'!", f"'{FD}'!")
    # Änderungen gegenüber dem Original (nur diese Zellen; alles andere ist die Kopie)
    setze(ws, "A1", "Frei finanziert mit Miete für DSCR 1,2 der Bank: Zeitreihe und Ergebnisse", "titel")
    setze(ws, "A87", "Wie Frei finanziert, aber Miete Jahr 1 = H183 (DSCR-Ziel Konzepte D6), Restwert aus der "
                     "Marktmiete (Spalte AD).")
    setze(ws, "A109", "Miete Jahr 1 = nötige Miete für das DSCR-Ziel der Bank (H183)")
    setze(ws, "H109", "=H183", "formel", F_EUR2)
    setze(ws, "A181", "DSCR-Ziel der Bank, frei finanziert (Konzepte D6, Annahme der PGN)")
    setze(ws, "H181", f"={q(K)}!{DSCR_ZELLE}", "formel", F_FAKTOR)
    setze(ws, "A122", "Ertragswert zur Marktmiete (Spalte AD; Restwert wie Blatt Frei finanziert)")
    for sp in "HIJ":
        f = ws[f"{sp}122"].value
        assert "$I$7:$I$86" in f, f
        ws[f"{sp}122"].value = f.replace("$I$7:$I$86", "$AD$7:$AD$86")
    # Hilfsspalte AD: Überschuss vor Kapitaldienst zur Marktmiete (nur für den Restwert)
    setze(ws, "AD4", "Restwert", "kopf")
    setze(ws, "AD5", "Überschuss\nvor Kapital-\ndienst zur\nMarktmiete", "kopf")
    ws.column_dimensions["AD"].width = 14
    for r in range(7, 87):
        setze(ws, f"AD{r}", f"=C{r}*Wohnflaeche*12-Mietausfall*C{r}*Wohnflaeche*12+G{r}+H{r}", "formel", F_EUR)
    return ws


# ------------------------------------------------------------------------------------------------------------
# Blatt „Konzepte Zeitreihe“
# ------------------------------------------------------------------------------------------------------------
ZR_GROESSEN = [
    ("miete", "Miete je m²", F_EUR2),
    ("uevk", "Überschuss vor Kapital-dienst", F_EUR),
    ("kd", "Kapital-dienst", F_EUR),
    ("zue", "Zahlungs-überschuss", F_EUR),
    ("kum", "Zahlungs-überschuss kumuliert", F_EUR),
    ("dscr", "DSCR", F_FAKTOR),
    ("rs", "Restschuld", F_EUR),
    ("konto", "Projekt-konto (VOFI)", F_EUR),
    ("ek", "Eigen-kapital erreicht", F_JAHR),
]
ZR_ERSTE = 3   # Spalte C


def zr_spalte(v_index, groesse):
    g = [x[0] for x in ZR_GROESSEN].index(groesse)
    return get_column_letter(ZR_ERSTE + v_index * len(ZR_GROESSEN) + g)


def blatt_zeitreihe(wb):
    ws = wb.create_sheet(ZR)
    setze(ws, "A1", "Konzepte: Zeitreihe je Variante, Jahr 0 bis 42", "titel")
    setze(ws, "A2", "Verweise auf die Blätter der Varianten, gleiche Zeile = gleiches Jahr; € p. a., Miete €/m² Monat, "
                    "Auszahlungen negativ.")
    setze(ws, "A3", "Restschuld gefördert = NBank + Bank. Eigenkapital erreicht: Jahr, ab dem der kumulierte "
                    "Zahlungsüberschuss H106 deckt.")
    setze(ws, "A4", "Zeit", "kopf")
    setze(ws, "B4", None, "kopf")
    setze(ws, "A5", "t", "kopf")
    setze(ws, "B5", "Jahr", "kopf")
    ws.column_dimensions["A"].width = 5
    ws.column_dimensions["B"].width = 7
    for vi, (key, _ksp, blatt, art, name) in enumerate(VARIANTEN):
        s = SP[art]
        c0 = zr_spalte(vi, "miete")
        c1 = zr_spalte(vi, "ek")
        setze(ws, f"{c0}4", name, "kopf")
        for ci in range(column_index_from_string(c0) + 1, column_index_from_string(c1) + 1):
            setze(ws, f"{get_column_letter(ci)}4", None, "kopf")
        ws[f"{c0}4"].alignment = Alignment(horizontal="left", vertical="center", wrap_text=False)
        for g, text, fmt in ZR_GROESSEN:
            c = zr_spalte(vi, g)
            setze(ws, f"{c}5", text.replace("-", "\n", 1) if "-" in text else text, "kopf")
            ws.column_dimensions[c].width = 8 if g in ("dscr", "ek") else 11
            for r in range(6, 49):
                t0 = r == 6
                if g == "miete":
                    f = None if t0 else f"={q(blatt)}!{s['miete']}{r}"
                elif g == "uevk":
                    f = None if t0 else f"={q(blatt)}!{s['uevk']}{r}"
                elif g == "kd":
                    f = None if t0 else f"={q(blatt)}!{s['kd']}{r}"
                elif g == "zue":
                    f = None if t0 else f"={q(blatt)}!{s['zue']}{r}"
                elif g == "kum":
                    f = f"={q(blatt)}!{s['kum']}{r}"
                elif g == "dscr":
                    f = None if t0 else f'=IF(ISNUMBER({q(blatt)}!{s["dscr"]}{r}),{q(blatt)}!{s["dscr"]}{r},"")'
                elif g == "rs":
                    f = "=" + "+".join(f"{q(blatt)}!{x}{r}" for x in s["rs"])
                elif g == "konto":
                    f = f"={q(blatt)}!{s['konto']}{r}"
                elif g == "ek":
                    kum = zr_spalte(vi, "kum")
                    f = None if t0 else f'=IF({kum}{r}>={q(blatt)}!$H$106,$A{r},"")'
                if f:
                    setze(ws, f"{c}{r}", f, "formel", fmt)
    for r in range(6, 49):
        setze(ws, f"A{r}", f"={q('Gefördert A')}!A{r}", "formel", F_JAHR)
        setze(ws, f"B{r}", f"={q('Gefördert A')}!B{r}", "formel", F_JAHR)
    ws.freeze_panes = "C6"
    ws.row_dimensions[5].height = 54
    ws.print_title_rows = "4:5"
    ws.print_area = f"A1:{zr_spalte(len(VARIANTEN) - 1, 'ek')}48"
    druck_wie(ws, wb["Frei finanziert"])
    return ws


# ------------------------------------------------------------------------------------------------------------
# Blatt „Konzepte“
# ------------------------------------------------------------------------------------------------------------
KZ = {}          # Schlüssel -> Zeile auf „Konzepte“ (für JSON und Prüfung)


def miete_fuer_dscr(blatt, art, ziel=DSCR_ZELLE):
    """Gleiche Logik wie H183 der Blätter Gefördert/Frei: (Ziel × Kapitaldienst Jahr 1 − Objektverwaltung −
    Instandhaltung) ÷ ((1 − Mietausfall) × Wohnfläche × 12); Objektverwaltung und Instandhaltung im Blatt negativ."""
    s = SP[art]
    return (f"=({ziel}*{q(blatt)}!$H$182-{q(blatt)}!${s['vw']}$7-{q(blatt)}!${s['ih']}$7)"
            f"/((1-Mietausfall)*Wohnflaeche*12)")


def n5_zeilen():
    """N5: (Schlüssel, Nr., Text, Einheit, Format, Formel je Variante oder None, Herkunft)."""
    def je(fn):
        return {key: fn(blatt, art, key, ksp) for key, ksp, blatt, art, _ in VARIANTEN}

    def zr(key, groesse):
        vi = [v[0] for v in VARIANTEN].index(key)
        return zr_spalte(vi, groesse)

    def bis35(blatt, sp):
        return f"{q(blatt)}!${sp}$7:INDEX({q(blatt)}!${sp}$7:${sp}$48,Bindung)"

    def ab36(blatt, sp):
        return (f"INDEX({q(blatt)}!${sp}$7:${sp}$48,Bindung+1):INDEX({q(blatt)}!${sp}$7:${sp}$48,Laufzeit_max)")

    def num(x):
        return f'=IF(ISNUMBER({x}),{x},"–")'

    z = []
    z.append(("gruppe", "Miete und Finanzierung bei Bezug"))
    z.append(("miete_jahr1", "N5.1", "Miete Jahr 1", "€/m² Monat", F_EUR2, je(lambda b, a, k, s: f"={q(b)}!$H$109"),
              "H109 des Blatts; gefördert Höchstmiete, frei laut Eingabe 10.1 bzw. H183"))
    z.append(("miete_dscr_ziel", "N5.2", "Miete Jahr 1 für DSCR 1,2", "€/m² Monat", F_EUR2,
              {"A": "=$D$22", "B": "=$E$22", "C": "=$F$22",
               "frei_markt": miete_fuer_dscr("Frei finanziert", "frei"), "frei_dscr": "=$D$12"},
              "N3 (A, B, C) bzw. N2; Logik wie H183"))
    z.append(("marktmiete_jahr1", "N5.3", "Marktmiete Jahr 1", "€/m² Monat", F_EUR2,
              je(lambda b, a, k, s: f"={q(b)}!$D$7" if a == "gef" else f"={q(b)}!$C$7"),
              "Eingabe 4.4 (Spalte Marktmiete des Blatts)"))
    z.append(("gesamtkosten", "N5.4", "Gesamtkosten", "€", F_EUR, je(lambda b, a, k, s: f"={q(b)}!$H$93"), "H93"))
    z.append(("zuschuss", "N5.5", "Zuschuss", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$H$100" if a == "gef" else None), "H100; frei: kein Zuschuss"))
    z.append(("darlehen_nbank", "N5.6", "NBank-Darlehen", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$H$99" if a == "gef" else None), "H99"))
    z.append(("bankdarlehen", "N5.7", "Bankdarlehen", "€", F_EUR, je(lambda b, a, k, s: f"={q(b)}!$H$103"),
              "H103; gefördert nur Restfinanzierung"))
    z.append(("eigenkapital", "N5.8", "Eingesetztes Eigenkapital (Grundstück + bar)", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$H$106"), "H106; gefördert mit Bearbeitungsentgelten"))
    z.append(("bearbeitungsentgelte", "N5.9", "davon Bearbeitungsentgelte", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$H$101" if a == "gef" else None), "H101"))
    z.append(("gruppe", "Jahr 1"))
    z.append(("uevk_jahr1", "N5.10", "Überschuss vor Kapitaldienst Jahr 1", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!${SP[a]['uevk']}$7"), "K7 (gefördert) bzw. I7 (frei)"))
    z.append(("kapitaldienst_jahr1", "N5.11", "Kapitaldienst Jahr 1", "€", F_EUR,
              je(lambda b, a, k, s: f"=-{q(b)}!${SP[a]['kd']}$7"),
              "−Q7 bzw. −L7; gefördert: Verwaltungskostenbeitrag + Zins + Tilgung NBank (+ Bank)"))
    z.append(("zue_jahr1", "N5.12", "Zahlungsüberschuss Jahr 1", "€", F_EUR, je(lambda b, a, k, s: f"={q(b)}!$H$155"),
              "H155"))
    z.append(("dscr_jahr1", "N5.13", "DSCR Jahr 1", "Faktor", F_FAKTOR, je(lambda b, a, k, s: f"={q(b)}!$H$156"),
              "H156 = Überschuss vor Kapitaldienst ÷ Kapitaldienst"))
    z.append(("gruppe", "Jahr 1 bis 35 (Bindung)"))
    z.append(("zue_jahr35", "N5.14", "Zahlungsüberschuss Jahr 35", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$H$166"), "H166"))
    z.append(("zue_min_1_35", "N5.15", "Zahlungsüberschuss Minimum, Jahr 1–35", "€", F_EUR,
              je(lambda b, a, k, s: f"=MIN({bis35(b, SP[a]['zue'])})"), "Minimum R bzw. M, Zeile 7 bis 41"))
    z.append(("kum_jahr35", "N5.16", "Zahlungsüberschuss kumuliert, Ende Jahr 35", "€", F_EUR,
              je(lambda b, a, k, s: f"=INDEX({q(b)}!${SP[a]['kum']}$7:${SP[a]['kum']}$48,Bindung)"),
              "W41 bzw. Q41, unverzinst"))
    z.append(("jahr_ek_erreicht", "N5.17", "Jahr, in dem der kumulierte Zahlungsüberschuss das Eigenkapital erreicht",
              "Jahr", F_JAHR,
              je(lambda b, a, k, s: f'=IF(COUNT({q(ZR)}!${zr(k, "ek")}$7:${zr(k, "ek")}$48)=0,"n. v.",'
                                    f'MIN({q(ZR)}!${zr(k, "ek")}$7:${zr(k, "ek")}$48))'),
              "Konzepte Zeitreihe, Spalte Eigenkapital erreicht; n. v. = nicht bis Jahr 42"))
    z.append(("jahre_fehlbetrag_1_35", "N5.18", "Jahre mit Fehlbetrag, Jahr 1–35", "Jahre", F_ANZ,
              je(lambda b, a, k, s: f"={q(b)}!$H$158"), "H158"))
    z.append(("groesster_kum_fehlbetrag", "N5.19", "Größter kumulierter Fehlbetrag, Jahr 1–42", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$H$159"), "H159, unverzinst"))
    z.append(("projektkonto_tiefststand", "N5.20", "Tiefster Stand Projektkonto (VOFI), Jahr 0–42", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$H$169"), "H169; Sollzins Eingabe 7.3, Guthabenzins 7.2"))
    z.append(("dscr_min_1_35", "N5.21", "DSCR Minimum, Jahr 1–35", "Faktor", F_FAKTOR,
              je(lambda b, a, k, s: f"={q(b)}!$H$157"), "H157"))
    z.append(("dscr_jahr35", "N5.22", "DSCR Jahr 35", "Faktor", F_FAKTOR,
              je(lambda b, a, k, s: num(f"INDEX({q(b)}!${SP[a]['dscr']}$7:${SP[a]['dscr']}$48,Bindung)")),
              "S41 bzw. N41; „–“: kein Kapitaldienst mehr"))
    z.append(("jahre_dscr_unter_ziel", "N5.23", "Jahre mit DSCR unter 1,2, Jahr 1–35", "Jahre", F_ANZ,
              je(lambda b, a, k, s: f'=COUNTIF({bis35(b, SP[a]["dscr"])},"<"&{DSCR_ZELLE})'),
              "Zählung S bzw. N, Zeile 7 bis 41"))
    z.append(("gruppe", "Ende Jahr 35"))
    z.append(("restschuld_jahr35", "N5.24", "Restschuld Ende Jahr 35", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$I$151"), "I151; gefördert NBank + Bank"))
    z.append(("restwert_jahr35", "N5.25", "Restwert Ende Jahr 35 (Ertragswert)", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$I$126"), "I126; frei beide aus der Marktmiete"))
    z.append(("projektkonto_jahr35", "N5.26", "Projektkonto (VOFI) Ende Jahr 35", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$I$150"), "I150"))
    z.append(("vermoegen_jahr35", "N5.27", "Vermögen Ende Jahr 35 = Restwert − Restschuld + Projektkonto", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$I$146"), "I146 (Endvermögen VOFI, mit Restwert)"))
    z.append(("vermoegen_jahr35_ohne_restwert", "N5.28", "Vermögen Ende Jahr 35 ohne Restwert", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$I$148"), "I148 = Projektkonto − Restschuld"))
    z.append(("gruppe", "Eigenkapitalrendite vor Steuern, Horizont Jahr 35"))
    z.append(("ek_vofi_mit_restwert", "N5.29", "VOFI-EK-Rendite, mit Restwert", "Anteil", F_PCT,
              je(lambda b, a, k, s: f"={q(b)}!$I$143"), "I143"))
    z.append(("ek_vofi_ohne_restwert", "N5.30", "VOFI-EK-Rendite, ohne Restwert", "Anteil", F_PCT,
              je(lambda b, a, k, s: f"={q(b)}!$I$145"), "I145 (Modellhaus: gleich „nur Bodenwert“)"))
    z.append(("restwertanteil", "N5.31", "Restwertanteil am Endvermögen", "Anteil", F_PCT1,
              je(lambda b, a, k, s: f"={q(b)}!$I$149"), "I149"))
    z.append(("ek_irr_mit_restwert", "N5.32", "EK-IRR, mit Restwert", "Anteil", F_PCT,
              je(lambda b, a, k, s: f"={q(b)}!$I$140"), "I140"))
    z.append(("ek_irr_ohne_restwert", "N5.33", "EK-IRR, ohne Restwert", "Anteil", F_PCT,
              je(lambda b, a, k, s: f"={q(b)}!$I$142"), "I142 (Mappe: nicht eindeutig, Hinweis 11)"))
    z.append(("gruppe", "Objektrendite Jahr 1 (N4)"))
    z.append(("objektrendite", "N5.34", "Objektrendite = Überschuss vor Kapitaldienst ÷ Gesamtkosten", "Anteil", F_PCT,
              je(lambda b, a, k, s: f"=${s}$41"), "N4.6 = Zeile 40 ÷ Zeile 37"))
    z.append(("objektrendite_nach_zuschuss", "N5.35", "Objektrendite, Nenner Gesamtkosten − Zuschuss", "Anteil",
              F_PCT, je(lambda b, a, k, s: f"=${s}$42"), "N4.7 = Zeile 40 ÷ (37 − 38)"))
    z.append(("gruppe", "Jahr 36 bis 42 (nach der Bindung)"))
    z.append(("zue_jahr42", "N5.36", "Zahlungsüberschuss Jahr 42", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$H$167"), "H167"))
    z.append(("zue_summe_36_42", "N5.37", "Zahlungsüberschuss Summe Jahr 36–42", "€", F_EUR,
              je(lambda b, a, k, s: f"=INDEX({q(b)}!${SP[a]['kum']}$7:${SP[a]['kum']}$48,Laufzeit_max)"
                                    f"-INDEX({q(b)}!${SP[a]['kum']}$7:${SP[a]['kum']}$48,Bindung)"),
              "W48 − W41 bzw. Q48 − Q41"))
    z.append(("jahre_fehlbetrag_36_42", "N5.38", "Jahre mit Fehlbetrag, Jahr 36–42", "Jahre", F_ANZ,
              je(lambda b, a, k, s: f'=COUNTIF({ab36(b, SP[a]["zue"])},"<0")'), "Zählung R bzw. M, Zeile 42 bis 48"))
    z.append(("restschuld_jahr42", "N5.39", "Restschuld Ende Jahr 42", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$J$151"), "J151"))
    z.append(("vermoegen_jahr42", "N5.40", "Vermögen Ende Jahr 42 = Restwert − Restschuld + Projektkonto", "€", F_EUR,
              je(lambda b, a, k, s: f"={q(b)}!$J$146"), "J146"))
    z.append(("ek_vofi_mit_restwert_jahr42", "N5.41", "VOFI-EK-Rendite, mit Restwert, Horizont Jahr 42", "Anteil",
              F_PCT, je(lambda b, a, k, s: f"={q(b)}!$J$143"), "J143"))
    z.append(("ek_vofi_ohne_restwert_jahr42", "N5.42", "VOFI-EK-Rendite, ohne Restwert, Horizont Jahr 42", "Anteil",
              F_PCT, je(lambda b, a, k, s: f"={q(b)}!$J$145"), "J145"))
    return z


def blatt_konzepte(wb):
    ws = wb.create_sheet(K)
    breiten = {"A": 7, "B": 50, "C": 12, "D": 13, "E": 13, "F": 13, "G": 13, "H": 13, "I": 62}
    for c, b in breiten.items():
        ws.column_dimensions[c].width = b
    setze(ws, "A1", "Konzepte: DSCR 1,2, Kennzahlen je Variante, Modellhaus (Projekt 2)", "titel")
    setze(ws, "A2", "Neue Blöcke für die Konzepte; die bestehenden Blätter sind unverändert. Einzige neue Annahme: D6.")
    setze(ws, "B3", "Prüfungen Konzepte (Block K)", "text", fett=True)
    # ---- N1
    r = 5
    for c, t in zip("ABCDI", ("Nr.", "N1 Annahme", "Einheit", "Wert", "Herkunft")):
        setze(ws, f"{c}{r}", t, "kopf")
    setze(ws, "A6", "N1.1")
    setze(ws, "B6", "DSCR-Ziel der Bank, frei finanziert")
    setze(ws, "C6", "Faktor")
    setze(ws, "D6", DSCR_ZIEL_BANK, "eingabe", "0.00")
    setze(ws, "I6", "Annahme der PGN (neu): Bank verlangt DSCR ≥ 1,2 (Überschuss vor Kapitaldienst ÷ Kapitaldienst "
                    "Bank)", umbruch=True)
    setze(ws, "A7", "N1.2")
    setze(ws, "B7", "Aktives Projekt (2 = Modellhaus)")
    setze(ws, "C7", "Nummer")
    setze(ws, "D7", "=Projekt_Nr", "formel", F_JAHR)
    ws["D7"].font = font(GRUEN)                # reiner Verweis auf einen Namen im Blatt Eingaben
    setze(ws, "I7", "Eingaben D3; die Mappe wird mit Projekt 2 ausgeliefert, die Kopie ändert D3 nicht")
    # ---- N2
    r = 9
    for c, t in zip("ABCDI", ("Nr.", "N2 Frei finanziert: Miete für DSCR 1,2 in Jahr 1", "Einheit", "Wert",
                              "Herkunft")):
        setze(ws, f"{c}{r}", t, "kopf")
    n2 = [
        ("N2.1", "Kapitaldienst Bankdarlehen Jahr 1", "€", F_EUR, f"={q(FD)}!$H$182", "Frei DSCR 1,2 H182 = −L7 (Annuität, Eingabe 6.1, 6.4)"),
        ("N2.2", "Objektverwaltung + Instandhaltung Jahr 1", "€", F_EUR, f"=-{q(FD)}!$G$7-{q(FD)}!$H$7", "Frei DSCR 1,2 −G7 − H7 (Eingabe 5.2, 5.3)"),
        ("N2.3", "Miete Jahr 1 für DSCR 1,2", "€/m² Monat", F_EUR2, f"={q(FD)}!$H$183",
         "Frei DSCR 1,2 H183 = (D6 × N2.1 + N2.2) ÷ ((1 − Mietausfall) × Wohnfläche × 12)"),
        ("N2.4", "Marktmiete Jahr 1", "€/m² Monat", F_EUR2, f"={q(FD)}!$H$184", "Eingabe 4.4 (Frei DSCR 1,2 H184)"),
        ("N2.5", "Aufschlag gegenüber der Marktmiete", "Anteil", F_PCT1, f"={q(FD)}!$H$185", "Frei DSCR 1,2 H185"),
        ("N2.6", "DSCR Jahr 1 mit dieser Miete (Gegenprobe)", "Faktor", F_FAKTOR3, f"={q(FD)}!$H$156", "Frei DSCR 1,2 H156 = I7 ÷ −L7"),
        ("N2.7", "Zahlungsüberschuss Jahr 1 mit dieser Miete", "€", F_EUR, f"={q(FD)}!$H$155", "Frei DSCR 1,2 H155"),
    ]
    for i, (nr, text, einh, fmt, f, herk) in enumerate(n2):
        rr = 10 + i
        setze(ws, f"A{rr}", nr)
        setze(ws, f"B{rr}", text)
        setze(ws, f"C{rr}", einh)
        setze(ws, f"D{rr}", f, "formel", fmt)
        setze(ws, f"I{rr}", herk)
    # ---- N3 (Zeilen 18 bis 26)
    r = 18
    for c, t in zip("ABCDEFI", ("Nr.", "N3 Gefördert: Miete für DSCR 1,2 (Kapitaldienst NBank-Darlehen)", "Einheit",
                                "A", "B", "C", "Herkunft")):
        setze(ws, f"{c}{r}", t, "kopf")
    n3 = [
        ("N3.1", "Höchstmiete Jahr 1", "€/m² Monat", F_EUR2, lambda b: f"={q(b)}!$H$109", "H109 (Tabellen T8, Mietenstufe VI)"),
        ("N3.2", "Kapitaldienst Jahr 1 mit Regeltilgung", "€", F_EUR, lambda b: f"={q(b)}!$H$182",
         "H182 = −Q7: Verwaltungskostenbeitrag + Zins (0 %) + Tilgung NBank-Darlehen; Bankdarlehen 0"),
        ("N3.3", "DSCR Jahr 1 zur Höchstmiete", "Faktor", F_FAKTOR3, lambda b: f"={q(b)}!$H$156", "H156 = K7 ÷ −Q7"),
        ("N3.4", "Miete Jahr 1 für DSCR 1,2", "€/m² Monat", F_EUR2, lambda b: miete_fuer_dscr(b, "gef"),
         "Logik wie H183: (D6 × H182 − I7 − J7) ÷ ((1 − Mietausfall) × Wohnfläche × 12)"),
        ("N3.5", "Höchstmiete minus Miete für DSCR 1,2", "€/m² Monat", F_EUR2, None, "N3.1 − N3.4; negativ: DSCR 1,2 nicht erreicht"),
        ("N3.6", "DSCR 1,2 in Jahr 1 zur Höchstmiete erreicht", "ja/nein", None, None, "N3.3 ≥ D6"),
        ("N3.7", "DSCR Minimum, Jahr 1–35", "Faktor", F_FAKTOR3, lambda b: f"={q(b)}!$H$157", "H157"),
        ("N3.8", "Jahre mit DSCR unter 1,2, Jahr 1–35", "Jahre", F_ANZ, None, "Zählung S7 bis S41"),
        ("N3.9", "DSCR Jahr 1 zur Miete für DSCR 1,2 (Gegenprobe)", "Faktor", F_FAKTOR3, None,
         "((1 − Mietausfall) × N3.4 × Wohnfläche × 12 + I7 + J7) ÷ H182"),
    ]
    for i, (nr, text, einh, fmt, fn, herk) in enumerate(n3):
        rr = 19 + i
        setze(ws, f"A{rr}", nr)
        setze(ws, f"B{rr}", text)
        setze(ws, f"C{rr}", einh)
        setze(ws, f"I{rr}", herk)
        for key, ksp, blatt, art, _ in VARIANTEN[:3]:
            if nr == "N3.5":
                f = f"={ksp}19-{ksp}22"
            elif nr == "N3.6":
                f = f'=IF(ISNUMBER({ksp}21),IF({ksp}21>={DSCR_ZELLE},"ja","nein"),"–")'
            elif nr == "N3.8":
                f = f'=COUNTIF({q(blatt)}!$S$7:INDEX({q(blatt)}!$S$7:$S$48,Bindung),"<"&{DSCR_ZELLE})'
            elif nr == "N3.9":
                f = (f"=IF({q(blatt)}!$H$182>0,((1-Mietausfall)*{ksp}22*Wohnflaeche*12+{q(blatt)}!$I$7"
                     f"+{q(blatt)}!$J$7)/{q(blatt)}!$H$182,\"–\")")
            else:
                f = fn(blatt)
            setze(ws, f"{ksp}{rr}", f, "formel", fmt, h="right" if nr == "N3.6" else None)
    # ---- N4 (Zeilen 35 bis 44)
    r = 35
    kopf = ("Nr.", "N4 Objektrendite Jahr 1 (unabhängig von der Finanzierung)", "Einheit", "A", "B", "C",
            "Frei, Markt", "Frei, DSCR", "Herkunft")
    for c, t in zip("ABCDEFGHI", kopf):
        setze(ws, f"{c}{r}", t, "kopf")
    n4 = [
        ("N4.1", "Herstellungskosten KG 200–700", "€", F_EUR, lambda b, a: f"={q(b)}!$H$90", "H90"),
        ("N4.2", "Gesamtkosten (Herstellung + KG 800 + Grundstück)", "€", F_EUR, lambda b, a: f"={q(b)}!$H$93", "H93"),
        ("N4.3", "Zuschuss", "€", F_EUR, lambda b, a: f"={q(b)}!$H$100" if a == "gef" else None,
         "H100; frei kein Zuschuss („–“, zählt als 0)"),
        ("N4.4", "Objektinvestition ohne KG 800 (Nenner der Mappe, Zeile 139)", "€", F_EUR,
         lambda b, a: f"={q(b)}!$H$94", "H94 = H90 + H92"),
        ("N4.5", "Überschuss vor Kapitaldienst Jahr 1", "€", F_EUR, lambda b, a: f"={q(b)}!${SP[a]['uevk']}$7",
         "K7 bzw. I7"),
        ("N4.6", "Objektrendite = N4.5 ÷ N4.2", "Anteil", F_PCT, None, "Überschuss vor Kapitaldienst ÷ Gesamtkosten"),
        ("N4.7", "Objektrendite, Nenner ohne Zuschuss = N4.5 ÷ (N4.2 − N4.3)", "Anteil", F_PCT, None,
         "Gesamtkosten abzüglich Zuschuss"),
        ("N4.8", "Nettoanfangsrendite der Mappe (Zeile 139)", "Anteil", F_PCT, lambda b, a: f"={q(b)}!$H$139",
         "H139 = K7 ÷ H94 (gefördert „n. v.“ bei Überfinanzierung) bzw. I7 ÷ H94"),
        ("N4.9", "Abweichung N4.6 − N4.8", "Anteil", F_PCT, None, "0, solange KG 800 = 0 (Eingabe 2.2)"),
    ]
    for i, (nr, text, einh, fmt, fn, herk) in enumerate(n4):
        rr = 36 + i
        setze(ws, f"A{rr}", nr)
        setze(ws, f"B{rr}", text)
        setze(ws, f"C{rr}", einh)
        setze(ws, f"I{rr}", herk)
        for key, ksp, blatt, art, _ in VARIANTEN:
            if nr == "N4.6":
                f = f"={ksp}40/{ksp}37"
            elif nr == "N4.7":
                f = f"={ksp}40/({ksp}37-N({ksp}38))"
            elif nr == "N4.9":
                f = f'=IF(ISNUMBER({ksp}43),{ksp}41-{ksp}43,"–")'
            else:
                f = fn(blatt, art)
            if f is None:
                setze(ws, f"{ksp}{rr}", "–", "text", h="right")
            else:
                setze(ws, f"{ksp}{rr}", f, "formel", fmt)
    # ---- N5 ab Zeile 47
    r = 47
    kopf = ("Nr.", "N5 Kennzahlen je Variante", "Einheit", "A", "B", "C", "Frei, Markt", "Frei, DSCR", "Herkunft (Zelle im Blatt der Variante)")
    for c, t in zip("ABCDEFGHI", kopf):
        setze(ws, f"{c}{r}", t, "kopf")
    rr = r + 1
    for z in n5_zeilen():
        if z[0] == "gruppe":
            setze(ws, f"B{rr}", z[1], "gruppe")
            for c in "ACDEFGHI":
                ws[f"{c}{rr}"].fill = fill(GRUPPE)
            rr += 1
            continue
        key, nr, text, einh, fmt, formeln, herk = z
        KZ[key] = rr
        setze(ws, f"A{rr}", nr)
        setze(ws, f"B{rr}", text, umbruch=len(text) > 55)
        setze(ws, f"C{rr}", einh)
        setze(ws, f"I{rr}", herk)
        for vkey, ksp, blatt, art, _ in VARIANTEN:
            f = formeln[vkey]
            if f is None:
                setze(ws, f"{ksp}{rr}", "–", "text", h="right")
            else:
                setze(ws, f"{ksp}{rr}", f, "formel", fmt, h="right" if key == "jahr_ek_erreicht" else None)
        rr += 1
    n5_ende = rr - 1
    # ---- K Prüfungen
    rr += 1
    kz = rr
    for c, t in zip("ABCDI", ("Nr.", "K Prüfungen der neuen Blöcke", "Status", "", "Bemerkung")):
        setze(ws, f"{c}{kz}", t, "kopf")
    tol = "0.0001"
    pr = [
        ("K1", "Frei DSCR 1,2: DSCR Jahr 1 = DSCR-Ziel (D6)",
         f"=IF(ISNUMBER({q(FD)}!$H$156),ABS({q(FD)}!$H$156-{DSCR_ZELLE})<{tol},{q(FD)}!$H$182<1)",
         "Gegenprobe N2; ohne Bankdarlehen kein DSCR"),
        ("K2", "Gefördert A, B, C: DSCR zur Miete N3.4 = DSCR-Ziel",
         "=AND(" + ",".join(f"IF(ISNUMBER({c}27),ABS({c}27-{DSCR_ZELLE})<{tol},TRUE)" for c in "DEF") + ")",
         "N3.9; ohne Kapitaldienst kein DSCR"),
        ("K3", "Frei finanziert (Blatt Frei finanziert) rechnet zur Marktmiete",
         f"={q('Frei finanziert')}!$H$109={q('Frei finanziert')}!$C$7", "Eingabe 10.1 = Marktmiete"),
        ("K4", "Restwert Jahr 35 und 42 frei: beide Blätter aus der Marktmiete, gleich",
         f"=AND(ABS({q(FD)}!$I$126-{q('Frei finanziert')}!$I$126)<1,ABS({q(FD)}!$J$126-{q('Frei finanziert')}!$J$126)<1)",
         "gilt, solange Eingabe 10.1 = Marktmiete"),
        ("K5", "Frei: gleiche Kosten, gleiches Eigenkapital, gleiches Bankdarlehen",
         f"=AND({q(FD)}!$H$93={q('Frei finanziert')}!$H$93,{q(FD)}!$H$106={q('Frei finanziert')}!$H$106,"
         f"{q(FD)}!$H$103={q('Frei finanziert')}!$H$103)", "H93, H106, H103"),
        ("K6", "Gleiche Gesamtkosten in allen Varianten",
         "=AND(D37=E37,D37=F37,D37=G37,D37=H37)", "N4.2"),
        ("K7", "Prüfungen der Mappe (Übersicht D3)", f"={q('Übersicht')}!$D$3=\"OK\"", "unverändert OK"),
        ("K8", "Aktives Projekt = 2 (Modellhaus)", "=Projekt_Nr=2", "Eingaben D3"),
    ]
    for i, (nr, text, f, bem) in enumerate(pr):
        r2 = kz + 1 + i
        setze(ws, f"A{r2}", nr)
        setze(ws, f"B{r2}", text)
        setze(ws, f"C{r2}", f'=IF({f[1:]},"OK","prüfen")', "formel", h="center")
        setze(ws, f"I{r2}", bem)
    k_von, k_bis = kz + 1, kz + len(pr)
    setze(ws, "D3", f'=IF(COUNTIF(C{k_von}:C{k_bis},"OK")=ROWS(C{k_von}:C{k_bis}),"OK","prüfen")', "formel",
          fett=True, h="center")
    KZ["_n5_ende"] = n5_ende
    KZ["_k"] = (k_von, k_bis)
    ws.freeze_panes = "D5"
    ws.print_area = f"A1:I{k_bis}"
    druck_wie(ws, wb["Übersicht"])
    for rrr in (5, 9, 18, 35, 47, kz):
        ws.row_dimensions[rrr].height = 30
    ws.row_dimensions[6].height = 26
    return ws


# ------------------------------------------------------------------------------------------------------------
# Bauen, neu berechnen, vergleichen
# ------------------------------------------------------------------------------------------------------------
def env_lo():
    LOHOME.mkdir(parents=True, exist_ok=True)
    e = dict(os.environ)
    e["HOME"] = str(LOHOME)
    e["PYTHONDONTWRITEBYTECODE"] = "1"
    return e


def finde_recalc(arg):
    if arg:
        return Path(arg)
    if os.environ.get("VOFI_RECALC"):
        return Path(os.environ["VOFI_RECALC"])
    for t in sorted(Path("/root").glob(".*/skills/**/xlsx/scripts/recalc.py")):
        return t
    sys.exit("recalc.py nicht gefunden (--recalc PFAD)")


def neu_berechnen(datei, recalc, timeout=180):
    p = subprocess.run([sys.executable, str(recalc), str(datei), str(timeout)], capture_output=True, text=True,
                       env=env_lo(), timeout=timeout + 300)
    txt = p.stdout.strip()
    try:
        res = json.loads(txt[txt.index("{"):])
    except ValueError:
        sys.exit(f"recalc ohne Ergebnis für {datei}: {txt[:400]} {p.stderr[:400]}")
    # Einstellungen, die LibreOffice nicht zurückschreibt (Gliederung, fullCalcOnLoad); Werte bleiben
    subprocess.run([sys.executable, "-B", str(GENERATOR), "--nachbearbeiten", str(datei)], check=True,
                   capture_output=True, env=env_lo(), cwd=str(HIER))
    return res


def bauen():
    shutil.copy(ORIGINAL, ZIEL)
    wb = openpyxl.load_workbook(ZIEL)
    assert wb.sheetnames == ALTE_BLAETTER, wb.sheetnames
    assert wb["Eingaben"]["D3"].value == 2, "Mappe nicht mit Projekt 2 ausgeliefert"
    blatt_konzepte(wb)
    blatt_frei_dscr(wb)
    blatt_zeitreihe(wb)
    wb._sheets = [wb[n] for n in ALTE_BLAETTER + NEUE_BLAETTER]
    wb.active = 0
    for ws in wb.worksheets:
        ws.sheet_view.tabSelected = ws.title == ALTE_BLAETTER[0]
    wb.save(ZIEL)
    return wb


def gleich(a, b, tol=1e-9):
    if isinstance(a, (int, float)) and isinstance(b, (int, float)) and not isinstance(a, bool):
        return abs(a - b) <= tol * max(1.0, abs(a), abs(b))
    return a == b


def vergleiche_original(original=ORIGINAL, kopie=ZIEL):
    """Alle bestehenden Blätter: Formeln/Konstanten identisch, berechnete Werte gleich (relativ 1e-9)."""
    erg = dict(zellen=0, formeln=0, abweichungen=[])
    for data_only in (False, True):
        wo = openpyxl.load_workbook(original, data_only=data_only)
        wk = openpyxl.load_workbook(kopie, data_only=data_only)
        for name in ALTE_BLAETTER:
            so, sk = wo[name], wk[name]
            mr = max(so.max_row, sk.max_row)
            mc = max(so.max_column, sk.max_column)
            for row in range(1, mr + 1):
                for col in range(1, mc + 1):
                    a = so.cell(row, col).value
                    b = sk.cell(row, col).value
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


# ------------------------------------------------------------------------------------------------------------
# Lesen und Ausgabe
# ------------------------------------------------------------------------------------------------------------
def roh(v):
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
        return None
    return v


def werte_n(wb, lauf):
    """Alle Werte der neuen Blöcke N1 bis N5 (Blatt Konzepte) als Einträge."""
    ws = wb[K]
    out = []

    def add(schl, zelle, einheit, bedeutung, blatt=K, herkunft=None, wert=None):
        w = wb[blatt][zelle].value if wert is None else wert
        e = dict(schluessel=schl, wert=roh(w), einheit=einheit, blatt=blatt, zelle=zelle, bedeutung=bedeutung,
                 lauf=lauf)
        if herkunft:
            e["herkunft"] = herkunft
        out.append(e)

    add("n1.dscr_ziel_bank_frei", "D6", "Faktor",
        "N1 DSCR-Ziel der Bank, frei finanziert (Annahme der PGN, neu): DSCR = Überschuss vor Kapitaldienst ÷ "
        "Kapitaldienst Bankdarlehen", herkunft="Annahme der PGN")
    add("n1.projekt_nr", "D7", "Nummer", "Aktives Projekt (2 = Modellhaus)", herkunft="Eingaben!D3")
    n2 = [("kapitaldienst_bank_jahr1", "€ p. a.", "Kapitaldienst Bankdarlehen Jahr 1", f"{FD}!H182"),
          ("bewirtschaftung_jahr1", "€ p. a.", "Objektverwaltung + Instandhaltung Jahr 1", f"{FD}!G7, H7"),
          ("miete_dscr", "€/m² Monat", "Anfangsmiete frei finanziert für DSCR 1,2 in Jahr 1 (Formel wie Mappe Zeile 183)", f"{FD}!H183"),
          ("marktmiete_jahr1", "€/m² Monat", "Marktmiete Jahr 1 (Eingabe 4.4)", f"{FD}!H184"),
          ("aufschlag_marktmiete", "Anteil", "Aufschlag der Miete für DSCR 1,2 auf die Marktmiete", f"{FD}!H185"),
          ("dscr_jahr1", "Faktor", "DSCR Jahr 1 zur Miete für DSCR 1,2 (Gegenprobe)", f"{FD}!H156"),
          ("zue_jahr1", "€ p. a.", "Zahlungsüberschuss Jahr 1 zur Miete für DSCR 1,2", f"{FD}!H155")]
    for i, (k, einh, bed, herk) in enumerate(n2):
        add(f"n2.{k}", f"D{10 + i}", einh, "N2 " + bed, herkunft=herk)
    n3 = [("hoechstmiete", "€/m² Monat", "Höchstmiete Jahr 1", "H109"),
          ("kapitaldienst_jahr1", "€ p. a.", "Kapitaldienst NBank-Darlehen Jahr 1 mit Regeltilgung (Verwaltungskostenbeitrag + Zins + Tilgung)", "H182"),
          ("dscr_jahr1", "Faktor", "DSCR Jahr 1 zur Höchstmiete", "H156"),
          ("miete_dscr", "€/m² Monat", "Miete Jahr 1 für DSCR 1,2 (Vergleichszahl zur Höchstmiete)", "H182, I7, J7"),
          ("abstand_hoechstmiete", "€/m² Monat", "Höchstmiete minus Miete für DSCR 1,2 (negativ: DSCR 1,2 nicht erreicht)", None),
          ("dscr_ziel_erreicht", "Text", "DSCR 1,2 in Jahr 1 zur Höchstmiete erreicht (ja/nein)", None),
          ("dscr_min_1_35", "Faktor", "DSCR Minimum Jahr 1–35", "H157"),
          ("jahre_dscr_unter_ziel", "Jahre", "Jahre mit DSCR unter 1,2, Jahr 1–35", "S7:S41"),
          ("dscr_gegenprobe", "Faktor", "DSCR Jahr 1 zur Miete für DSCR 1,2 (Gegenprobe)", None)]
    for i, (k, einh, bed, herk) in enumerate(n3):
        for key, ksp, blatt, art, name in VARIANTEN[:3]:
            add(f"n3.{k}.{key}", f"{ksp}{19 + i}", einh, f"N3 {bed}; {name}",
                herkunft=f"{blatt}!{herk}" if herk else None)
    n4 = [("herstellungskosten", "€", "Herstellungskosten KG 200–700", "H90"),
          ("gesamtkosten", "€", "Gesamtkosten", "H93"), ("zuschuss", "€", "Zuschuss", "H100"),
          ("objektinvestition", "€", "Objektinvestition ohne KG 800 (Nenner Mappe Zeile 139)", "H94"),
          ("uevk_jahr1", "€ p. a.", "Überschuss vor Kapitaldienst Jahr 1", "K7/I7"),
          ("objektrendite", "Anteil", "Objektrendite Jahr 1 = Überschuss vor Kapitaldienst ÷ Gesamtkosten", None),
          ("objektrendite_nach_zuschuss", "Anteil", "Objektrendite Jahr 1, Nenner Gesamtkosten − Zuschuss", None),
          ("nettoanfangsrendite_mappe", "Anteil", "Nettoanfangsrendite der Mappe (Zeile 139) = Überschuss ÷ Objektinvestition", "H139"),
          ("abweichung", "Anteil", "Objektrendite minus Nettoanfangsrendite der Mappe", None)]
    for i, (k, einh, bed, herk) in enumerate(n4):
        for key, ksp, blatt, art, name in VARIANTEN:
            add(f"n4.{k}.{key}", f"{ksp}{36 + i}", einh, f"N4 {bed}; {name}",
                herkunft=f"{blatt}!{herk}" if herk else None)
    einheiten = {}
    for z in n5_zeilen():
        if z[0] == "gruppe":
            continue
        key, nr, text, einh, fmt, formeln, herk = z
        einheiten[key] = (nr, text, "€ p. a." if einh == "€" and key.startswith(("zue_", "uevk", "kapitaldienst")) else einh, herk)
    for key, (nr, text, einh, herk) in einheiten.items():
        for vkey, ksp, blatt, art, name in VARIANTEN:
            add(f"n5.{key}.{vkey}", f"{ksp}{KZ[key]}", einh, f"{nr} {text}; {name}", herkunft=f"{blatt}: {herk}")
    k_von, k_bis = KZ["_k"]
    add("k.status", "D3", "Text", "Gesamtstatus der Prüfungen K1 bis K8 (Blatt Konzepte)")
    add("k.mappe_status", "D3", "Text", "Gesamtstatus der Prüfungen der Mappe (Übersicht D3)", blatt="Übersicht")
    return out


def werte_zeitreihe(wb, lauf):
    ws = wb[ZR]
    out = [dict(schluessel="zr.jahr", wert=[ws[f"A{r}"].value for r in range(7, 49)], einheit="Jahr", blatt=ZR,
                zelle="A7:A48", bedeutung="Jahr der Rechnung 1 bis 42 (T0 = Bezugsfertigkeit)", lauf=lauf),
           dict(schluessel="zr.kalenderjahr", wert=[ws[f"B{r}"].value for r in range(7, 49)], einheit="Jahr",
                blatt=ZR, zelle="B7:B48", bedeutung="Kalenderjahr zu Jahr 1 bis 42", lauf=lauf)]
    einh = {"miete": "€/m² Monat", "uevk": "€ p. a.", "kd": "€ p. a.", "zue": "€ p. a.", "kum": "€", "dscr": "Faktor",
            "rs": "€", "konto": "€", "ek": "Jahr"}
    bed = {"miete": "Miete je m² und Monat", "uevk": "Überschuss vor Kapitaldienst",
           "kd": "Kapitaldienst (negativ: Auszahlung)", "zue": "Zahlungsüberschuss",
           "kum": "Zahlungsüberschuss kumuliert, unverzinst", "dscr": "DSCR = Überschuss vor Kapitaldienst ÷ Kapitaldienst; null ohne Kapitaldienst",
           "rs": "Restschuld am Jahresende (gefördert NBank + Bank)", "konto": "Projektkonto (VOFI) am Jahresende",
           "ek": "Jahr, wenn der kumulierte Zahlungsüberschuss das Eigenkapital erreicht hat, sonst null"}
    for vi, (key, ksp, blatt, art, name) in enumerate(VARIANTEN):
        for g, _t, _f in ZR_GROESSEN:
            c = zr_spalte(vi, g)
            vals = [roh(ws[f"{c}{r}"].value) for r in range(7, 49)]
            vals = [None if v == "" else v for v in vals]
            out.append(dict(schluessel=f"zr.{g}.{key}", wert=vals, einheit=einh[g], blatt=ZR, zelle=f"{c}7:{c}48",
                            bedeutung=f"{bed[g]}; Jahr 1 bis 42; {name}", lauf=lauf,
                            herkunft=(f"{blatt}, Spalte " + ("+".join(SP[art]["rs"]) if g == "rs" else SP[art][g]))
                            if g != "ek" else f"{ZR}, aus Spalte kumuliert und {blatt}!H106"))
            if g in ("kum", "rs", "konto"):
                out.append(dict(schluessel=f"zr.{g}_jahr0.{key}", wert=roh(ws[f"{c}6"].value), einheit=einh[g], blatt=ZR,
                                zelle=f"{c}6", bedeutung=f"{bed[g]}; Jahr 0 (Bezug); {name}", lauf=lauf))
    return out


# Annahmen: (Schlüssel, Blatt, Zelle, Einheit, Text, Art der Herkunft, Herkunft)
ANNAHMEN = [
    ("projekt_nr", "Eingaben", "D3", "Nummer", "Aktives Projekt (Modellhaus = Projekt 2)", "Projekt", "Entscheidung des Auftraggebers vom 11.11.2026"),
    ("bezugsjahr", "Eingaben", "F7", "Jahr", "Eingabe 1.1 Bezugsjahr", "PGN-Annahme", None),
    ("wohnflaeche", "Eingaben", "F8", "m²", "Eingabe 1.2 Wohnfläche", "Projektdaten PGN", None),
    ("wohnungen", "Eingaben", "F9", "Anzahl", "Eingabe 1.3 Wohnungen", "Projektdaten PGN", None),
    ("herstellungskosten_qm", "Eingaben", "F11", "€/m²", "Eingabe 2.1 Herstellungskosten KG 200–700 je m² Wohnfläche", "Projektdaten PGN", None),
    ("finanzierungskosten_kg800", "Eingaben", "F12", "€", "Eingabe 2.2 Finanzierungskosten KG 800", "PGN-Annahme", None),
    ("grundstueck", "Eingaben", "F13", "€", "Eingabe 2.3 Grundstück, Ansatz (Grundstück im Bestand)", "Projektdaten PGN", None),
    ("tilgung_nbank", "Eingaben", "F17", "Anteil", "Eingabe 3.1 Tilgung NBank-Darlehen, linear p. a.", "PGN-Annahme", None),
    ("tilgungsaufschub", "Eingaben", "F18", "Jahre", "Eingabe 3.2 Tilgungsaufschub", "PGN-Annahme", None),
    ("zins_nbank_ab_jahr36", "Eingaben", "F19", "Anteil", "Eingabe 3.3 Zins NBank-Darlehen ab Jahr 36 p. a.", "PGN-Annahme", None),
    ("mietenstufe", "Eingaben", "F22", "Text", "Eingabe 4.1 Mietenstufe", "Projektdaten PGN", None),
    ("eh40", "Eingaben", "F23", "Text", "Eingabe 4.2 Effizienzhaus 40 erreicht", "Projektdaten PGN", None),
    ("vergleichsmiete_jahr1", "Eingaben", "F24", "€/m² Monat", "Eingabe 4.3 Ortsübliche Vergleichsmiete Jahr 1", "Quelle", None),
    ("marktmiete_jahr1", "Eingaben", "F25", "€/m² Monat", "Eingabe 4.4 Marktmiete Neuvermietung Jahr 1", "Quelle",
     "Gutachterausschuss Lüneburg, Mietübersicht Landkreis Harburg, Hamburger Umland, Baualter ab 2023, 40–60 m², Stand 01.01.2026"),
    ("mietsteigerung", "Eingaben", "F26", "Anteil", "Eingabe 4.5 Steigerung Markt- und Vergleichsmiete p. a. (Mietanpassung frei finanziert)", "PGN-Annahme", None),
    ("kappungsgrenze", "Eingaben", "F27", "Anteil", "Eingabe 4.6 Kappungsgrenze nach Bindungsende, in 3 Jahren", "Gesetz", None),
    ("mietausfall", "Eingaben", "F29", "Anteil", "Eingabe 5.1 Mietausfall/Leerstand, Anteil der Sollmiete", "PGN-Annahme", None),
    ("objektverwaltung_je_wohnung", "Eingaben", "F30", "€ p. a.", "Eingabe 5.2 Objektverwaltung je Wohnung", "PGN-Annahme", None),
    ("instandhaltung_je_qm", "Eingaben", "F31", "€/m² p. a.", "Eingabe 5.3 Instandhaltung je m² Wohnfläche", "PGN-Annahme", None),
    ("kostensteigerung", "Eingaben", "F32", "Anteil", "Eingabe 5.4 Kostensteigerung ab Jahr 2 p. a.", "PGN-Annahme", None),
    ("kostenstand_fortschreibung", "Eingaben", "F33", "Jahre", "Eingabe 5.5 Kostensätze 2026 fortschreiben um", "PGN-Annahme", None),
    ("zins_bank", "Eingaben", "F35", "Anteil", "Eingabe 6.1 Zins Bankdarlehen p. a.", "Quelle", None),
    ("zinsbindung", "Eingaben", "F36", "Jahre", "Eingabe 6.2 Zinsbindung Bankdarlehen", "PGN-Annahme", None),
    ("anschlusszins", "Eingaben", "F37", "Anteil", "Eingabe 6.3 Anschlusszins Bankdarlehen nach Jahr 10 p. a.", "PGN-Annahme", None),
    ("laufzeit_bank", "Eingaben", "F38", "Jahre", "Eingabe 6.4 Laufzeit Bankdarlehen (jährliche Annuität über 30 Jahre)", "PGN-Annahme", None),
    ("eigenkapital_zusatz", "Eingaben", "F40", "€", "Eingabe 7.1 Zusätzliches Eigenkapital bar", "PGN-Annahme", None),
    ("guthabenzins", "Eingaben", "F41", "Anteil", "Eingabe 7.2 Guthabenzins Projektkonto (VOFI) p. a.", "PGN-Annahme", None),
    ("sollzins", "Eingaben", "F42", "Anteil", "Eingabe 7.3 Sollzins Projektkonto (VOFI) p. a.", "PGN-Annahme", None),
    ("bodenwertsteigerung", "Eingaben", "F44", "Anteil", "Eingabe 8.1 Bodenwertsteigerung p. a.", "PGN-Annahme", None),
    ("zielmiete", "Eingaben", "F45", "Text", "Eingabe 8.2 Zielmiete nach Jahr 42 (Restwert)", "PGN-Annahme", None),
    ("veraeusserungskosten", "Eingaben", "F46", "Anteil", "Eingabe 8.3 Veräußerungskosten, Anteil des Restwerts", "PGN-Annahme", None),
    ("stress_kg", "Eingaben", "F48", "Faktor", "Eingabe 9.1 Faktor Herstellungskosten (neutral 1)", "PGN-Annahme", None),
    ("stress_miete", "Eingaben", "F49", "Faktor", "Eingabe 9.2 Faktor Markt- und Vergleichsmiete (neutral 1)", "PGN-Annahme", None),
    ("stress_lz", "Eingaben", "F50", "Prozentpunkte", "Eingabe 9.3 Zuschlag Liegenschaftszins (neutral 0)", "PGN-Annahme", None),
    ("stress_gebrw", "Eingaben", "F51", "Faktor", "Eingabe 9.4 Faktor Gebäude-Restwert (neutral 1)", "PGN-Annahme", None),
    ("miete_frei", "Eingaben", "F53", "Text", "Eingabe 10.1 Miete frei finanziert (Blatt Frei finanziert)", "PGN-Annahme", None),
    ("dscr_ziel_mappe", "Eingaben", "F54", "Faktor", "Eingabe 10.2 DSCR-Ziel der Mappe (Übersicht Block 8; nicht die neue Annahme)", "PGN-Annahme", None),
    ("quote_darlehen.A", "Tabellen", "D5", "Anteil", "T1 Darlehen, höchstens, Gruppe A", "Richtlinie", "RL Nr. 5.3.3.1"),
    ("quote_darlehen.B", "Tabellen", "E5", "Anteil", "T1 Darlehen, höchstens, Gruppe B", "Richtlinie", "RL Nr. 5.3.3.1"),
    ("quote_darlehen.C", "Tabellen", "F5", "Anteil", "T1 Darlehen, höchstens, Gruppe C", "Richtlinie", "RL Nr. 5.3.3.1"),
    ("quote_zuschuss.A", "Tabellen", "D6", "Anteil", "T2 Zuschuss, höchstens, Gruppe A", "Richtlinie", "RL Nr. 5.3.3.2"),
    ("quote_zuschuss.B", "Tabellen", "E6", "Anteil", "T2 Zuschuss, höchstens, Gruppe B", "Richtlinie", "RL Nr. 5.3.3.2"),
    ("quote_zuschuss.C", "Tabellen", "F6", "Anteil", "T2 Zuschuss, höchstens, Gruppe C", "Richtlinie", "RL Nr. 5.3.3.2"),
    ("bemessungsgrenze_VI", "Tabellen", "C14", "€/m²", "T8 Bemessungsgrenze Herstellungskosten, Mietenstufe VI (Stand 01.10.2026)", "Richtlinie", "RL Nr. 5.3.2.2; NBank-Produktinformation, Stand 05.11.2026"),
    ("hoechstmiete_VI.A", "Tabellen", "D14", "€/m² Monat", "T8 Höchstmiete nettokalt, Mietenstufe VI, Gruppe A", "Richtlinie", "RL Nr. 5.4.4"),
    ("hoechstmiete_VI.B", "Tabellen", "E14", "€/m² Monat", "T8 Höchstmiete nettokalt, Mietenstufe VI, Gruppe B", "Richtlinie", "RL Nr. 5.4.4"),
    ("hoechstmiete_VI.C", "Tabellen", "F14", "€/m² Monat", "T8 Höchstmiete nettokalt, Mietenstufe VI, Gruppe C", "Richtlinie", "RL Nr. 5.4.4"),
    ("eigenmittel_mindestens", "Tabellen", "D18", "Anteil", "T10 Eigenmittel, mindestens, Anteil der zuwendungsfähigen Kosten", "Richtlinie", None),
    ("zins_nbank_bis_jahr35", "Tabellen", "D19", "Anteil", "T11 Zins NBank-Darlehen bis Ende Jahr 35", "Richtlinie", None),
    ("zinsfreie_jahre", "Tabellen", "D20", "Jahre", "T12 Zinsfreie Jahre", "Richtlinie", None),
    ("laufzeit_hoechstens", "Tabellen", "D21", "Jahre", "T13 Höchstlaufzeit NBank-Darlehen, Betrachtungsende", "Richtlinie", None),
    ("tilgungsaufschub_hoechstens", "Tabellen", "D22", "Jahre", "T14 Tilgungsaufschub, höchstens", "Richtlinie", None),
    ("verwaltungskostenbeitrag", "Tabellen", "D23", "Anteil", "T15 Verwaltungskostenbeitrag p. a. vom Restkapital", "Richtlinie", None),
    ("bearbeitungsentgelt_darlehen", "Tabellen", "D24", "Anteil", "T16 Bearbeitungsentgelt Darlehen, einmalig", "Richtlinie", None),
    ("bearbeitungsentgelt_zuschuss", "Tabellen", "D25", "Anteil", "T17 Bearbeitungsentgelt Zuschuss, einmalig", "Richtlinie", None),
    ("bindung", "Tabellen", "D26", "Jahre", "T18 Belegungs- und Mietbindung", "Richtlinie", None),
    ("jahre_ohne_mieterhoehung", "Tabellen", "D27", "Jahre", "T19 Jahre ohne Mieterhöhung", "Richtlinie", None),
    ("mieterhoehung_in_der_bindung", "Tabellen", "D28", "Anteil", "T20 Mieterhöhung in der Bindung, höchstens, in 3 Jahren (Mietanpassung gefördert)", "Richtlinie", None),
    ("abstand_mieterhoehungen", "Tabellen", "D29", "Jahre", "T21 Abstand der Mieterhöhungen", "PGN-Annahme", None),
    ("zuschlag_hoechstmiete_eh40", "Tabellen", "D30", "€/m² Monat", "T22 Zuschlag auf die Höchstmiete ab Effizienzhaus 40", "Richtlinie", None),
    ("tilgung_bank_mindestens", "Tabellen", "D31", "Anteil", "T23 Tilgung Bankdarlehen, mindestens p. a.", "Richtlinie", None),
    ("gesamtnutzungsdauer", "Tabellen", "D33", "Jahre", "T25 Gesamtnutzungsdauer Mehrfamilienhaus (Restwert)", "Quelle", None),
    ("liegenschaftszins_rnd30", "Tabellen", "F36", "Anteil", "T26 Liegenschaftszins, Restnutzungsdauer 30 Jahre, Projekt 2", "Quelle", None),
    ("liegenschaftszins_rnd38", "Tabellen", "F37", "Anteil", "T27 Liegenschaftszins, Restnutzungsdauer 38 Jahre, Projekt 2", "Quelle", None),
    ("liegenschaftszins_rnd40", "Tabellen", "F38", "Anteil", "T28 Liegenschaftszins, Restnutzungsdauer 40 Jahre, Projekt 2", "Quelle", None),
    ("liegenschaftszins_rnd50", "Tabellen", "F39", "Anteil", "T29 Liegenschaftszins, Restnutzungsdauer 50 Jahre, Projekt 2", "Quelle", None),
    ("liegenschaftszins_rnd60", "Tabellen", "F40", "Anteil", "T30 Liegenschaftszins, Restnutzungsdauer 60 Jahre, Projekt 2", "Quelle", None),
    ("liegenschaftszins_rnd70", "Tabellen", "F41", "Anteil", "T31 Liegenschaftszins, Restnutzungsdauer 70 Jahre, Projekt 2", "Quelle", None),
    ("dscr_ziel_bank_frei", K, "D6", "Faktor", "N1 DSCR-Ziel der Bank, frei finanziert (neu)", "PGN-Annahme",
     "Annahme der PGN (neu): Die Bank verlangt DSCR ≥ 1,2; DSCR = Überschuss vor Kapitaldienst ÷ Kapitaldienst Bankdarlehen"),
]


def quelle_text(wb, blatt, zelle):
    """Quelle laut Mappe: Eingaben Spalte G (Teil von Projekt 2), Tabellen Spalte G (auch aus der Kopfzeile)."""
    r = int(re.sub(r"[A-Z]", "", zelle))
    if blatt == "Eingaben":
        t = wb["Eingaben"][f"G{r}"].value or ""
        if " / " in t:
            t = t.split(" / ", 1)[1]
        return t
    if blatt == "Tabellen":
        ws = wb["Tabellen"]
        t = ws[f"G{r}"].value
        rr = r
        while not t and rr > 4:
            rr -= 1
            t = ws[f"G{rr}"].value
            if t == "Quelle":
                t = None
                break
        return t or ""
    return ""


def werte_annahmen(wb, lauf):
    out = []
    for schl, blatt, zelle, einh, text, art, herk in ANNAHMEN:
        qt = quelle_text(wb, blatt, zelle)
        out.append(dict(schluessel=f"annahme.{schl}", wert=roh(wb[blatt][zelle].value), einheit=einh, blatt=blatt,
                        zelle=zelle, bedeutung=text, lauf=lauf, herkunft_art=art,
                        herkunft=herk or qt, quelle_mappe=qt))
    return out


def werte_kern(wb, lauf):
    """Kernwerte der bestehenden Rechnung (Übersicht), je Variante."""
    u = lambda k, z, einh, b: dict(schluessel=k, wert=roh(wb["Übersicht"][z].value), einheit=einh, blatt="Übersicht",
                                   zelle=z, bedeutung=b, lauf=lauf)
    out = []
    zeilen = [(9, "gesamtkosten", "€", "1.1 Gesamtkosten", "DEFG"), (10, "zuwendungsfaehige_kosten", "€", "1.2 Zuwendungsfähige Kosten", "DEF"),
              (13, "darlehen_nbank", "€", "1.5 NBank-Darlehen", "DEF"), (14, "zuschuss", "€", "1.6 Zuschuss", "DEF"),
              (15, "foerderung", "€", "1.7 Förderung gesamt", "DEF"), (18, "bankdarlehen", "€", "1.10 Bankdarlehen", "DEFG"),
              (19, "eigenmittel", "€", "1.11 Eigenmittel ohne Entgelte", "DEFG"), (21, "bearbeitungsentgelte", "€", "1.13 Bearbeitungsentgelte", "DEF"),
              (22, "eigenkapital", "€", "1.14 Eigenkapital (Grundstück + bar)", "DEFG"), (26, "miete_jahr1", "€/m² Monat", "1.18 Miete Jahr 1", "DEFG"),
              (29, "sollmiete", "€ p. a.", "Jahresrechnung Zeile 1 Sollmiete", "DEFG"), (30, "mietausfall", "€ p. a.", "Mietausfall/Leerstand (Abzug)", "DEFG"),
              (31, "objektverwaltung", "€ p. a.", "Zeile 2 Objektverwaltung (Abzug)", "DEFG"), (32, "instandhaltung", "€ p. a.", "Zeile 3 Instandhaltung (Abzug)", "DEFG"),
              (33, "ueberschuss_vor_kapitaldienst", "€ p. a.", "Zeile 4 Überschuss vor Kapitaldienst", "DEFG"),
              (34, "verwaltungskostenbeitrag", "€ p. a.", "Zeile 5 Verwaltungskostenbeitrag (Abzug)", "DEF"),
              (35, "zins_nbank", "€ p. a.", "Zeile 6 Zins NBank-Darlehen", "DEF"), (36, "tilgung_nbank", "€ p. a.", "Zeile 7 Tilgung NBank-Darlehen (Abzug)", "DEF"),
              (37, "kapitaldienst_bank", "€ p. a.", "Kapitaldienst Bankdarlehen", "DEFG"), (38, "zahlungsueberschuss", "€ p. a.", "Zeile 8 Zahlungsüberschuss Jahr 1", "DEFG"),
              (45, "dscr_jahr1", "Faktor", "3.4 DSCR Jahr 1", "DEFG"), (49, "tragbare_tilgung", "Anteil", "3.8 Tragbare Tilgung Jahr 1", "DEF"),
              (50, "restschuld_nbank_jahr35", "€", "3.9 Restschuld NBank Ende Jahr 35", "DEF"),
              (106, "liegenschaftszins_jahr35", "Anteil", "7.7 Liegenschaftszins Restwert Jahr 35", "DEFG")]
    nm = {"D": "A", "E": "B", "F": "C", "G": "frei_markt"}
    for z, k, einh, b, spalten in zeilen:
        for s in spalten:
            out.append(u(f"kern.{k}.{nm[s]}", f"{s}{z}", einh, f"Übersicht {b}; {nm[s]}"))
    return out


# ------------------------------------------------------------------------------------------------------------
# N6 Szenario-Läufe
# ------------------------------------------------------------------------------------------------------------
LAEUFE = [
    ("tilgung_2_90", "Tilgung NBank-Darlehen 2,90 % p. a. (Übersicht 3.8: tragbare Tilgung Gruppe C, gerundet)",
     [("Eingaben", "E17", 0.029)]),
    ("tilgung_3_65", "Tilgung NBank-Darlehen 3,65 % p. a. (Übersicht 3.8: tragbare Tilgung Gruppe A, gerundet)",
     [("Eingaben", "E17", 0.0365)]),
    ("kosten_4631", "Herstellungskosten 4.631 €/m² (ARGE-Median, wie Lauf modellhaus_kosten_4631 der Präsentation)",
     [("Eingaben", "E11", 4631)]),
    ("kosten_5460", "Herstellungskosten 5.460 €/m² (Bemessungsgrenze Mietenstufe IV bis VII, wie Lauf modellhaus_kosten_5460)",
     [("Eingaben", "E11", 5460)]),
    ("mietanpassung_gefoerdert_0", "Keine Mieterhöhung in der Bindung (Tabellen T20 = 0; wirkt nur gefördert)",
     [("Tabellen", "D28", 0)]),
    ("mietsteigerung_0", "Keine Steigerung von Markt- und Vergleichsmiete (Eingabe 4.5 = 0; Mietanpassung frei finanziert, "
                         "dazu Vergleichsmiete gefördert nach Jahr 35 und Restwert)",
     [("Eingaben", "E26", 0)]),
    ("anschlusszins_plus_1", "Anschlusszins Bankdarlehen nach Jahr 10 + 1 Prozentpunkt (4,86 %; Eingabe 6.3, "
                             "Vorgängermappe ± 1 Punkt)", [("Eingaben", "E37", 0.0486)]),
    ("anschlusszins_minus_1", "Anschlusszins Bankdarlehen nach Jahr 10 − 1 Prozentpunkt (2,86 %; Eingabe 6.3, "
                              "Vorgängermappe ± 1 Punkt)", [("Eingaben", "E37", 0.0286)]),
]
LAUF_GROESSEN = ["miete_jahr1", "miete_dscr_ziel", "zue_jahr1", "zue_min_1_35", "jahre_fehlbetrag_1_35",
                 "zue_jahr35", "dscr_jahr1", "dscr_min_1_35", "jahre_dscr_unter_ziel", "ek_vofi_mit_restwert",
                 "ek_vofi_ohne_restwert", "ek_irr_mit_restwert", "ek_irr_ohne_restwert", "projektkonto_tiefststand",
                 "vermoegen_jahr35"]


def lauf_rechnen(name, aend, recalc):
    LAUF_DIR.mkdir(exist_ok=True)
    datei = LAUF_DIR / f"{name}.xlsx"
    shutil.copy(ZIEL, datei)
    wb = openpyxl.load_workbook(datei)
    alt = []
    for blatt, zelle, neu in aend:
        alt.append(wb[blatt][zelle].value)
        wb[blatt][zelle].value = neu
    wb.save(datei)
    res = neu_berechnen(datei, recalc)
    return name, datei, res, alt


def lauf_werte(name, datei, beschreibung, aend, alt, res):
    wb = openpyxl.load_workbook(datei, data_only=True)
    out = []
    for key in LAUF_GROESSEN:
        for vkey, ksp, blatt, art, vname in VARIANTEN:
            zelle = f"{ksp}{KZ[key]}"
            out.append(dict(schluessel=f"n6.{name}.{key}.{vkey}", wert=roh(wb[K][zelle].value),
                            einheit=EINHEIT_N5[key], blatt=K, zelle=zelle,
                            bedeutung=f"N6 {beschreibung}: {TEXT_N5[key]}; {vname}", lauf=name))
    for key, ksp, blatt, art, vname in VARIANTEN[:3]:
        out.append(dict(schluessel=f"n6.{name}.miete_dscr_gefoerdert.{key}", wert=roh(wb[K][f"{ksp}22"].value),
                        einheit="€/m² Monat", blatt=K, zelle=f"{ksp}22",
                        bedeutung=f"N6 {beschreibung}: N3.4 Miete Jahr 1 für DSCR 1,2; {vname}", lauf=name))
    status = dict(konzepte=wb[K]["D3"].value, mappe=wb["Übersicht"]["D3"].value,
                  recalc=res.get("status"), formelfehler=res.get("total_errors"))
    lauf = dict(beschreibung=beschreibung,
                aenderungen=[dict(blatt=b, zelle=z, alt=a, neu=n) for (b, z, n), a in zip(aend, alt)],
                datei=f"laeufe/{datei.name}", pruefungen=status, anzahl_werte=len(out), werte={e["schluessel"]: e for e in out})
    return lauf


EINHEIT_N5, TEXT_N5 = {}, {}


def json_text(daten):
    text = json.dumps(daten, ensure_ascii=False, indent=1)
    kurz = re.compile(r'-?\d+(\.\d+)?([eE][+-]?\d+)?|"[^"]{0,3}"|null')

    def einzeilig(m):
        teile = [t.strip() for t in m.group(1).split(",\n")]
        if all(kurz.fullmatch(t) for t in teile):
            return "[" + ", ".join(teile) + "]"
        return m.group(0)

    return re.sub(r"\[\n\s*([^\[\]{}]*?)\n\s*\]", einzeilig, text) + "\n"


def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def annahmen_md(eintraege):
    zeilen = ["# Annahmen der Modellrechnung (Modellhaus, Projekt 2)", "",
              "Erzeugt von `build_konzepte.py` aus `PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx`. Werte roh aus der Mappe; "
              "Anteile als Prozent. Herkunft: **Richtlinie** (RL Mietwohnraum 2026), **Gesetz**, **Quelle** (externe "
              "Datenquelle), **Projektdaten PGN**, **PGN-Annahme**. Die einzige neue Annahme ist N1 (DSCR 1,2).", "",
              "| Annahme | Wert | Einheit | Herkunft | Fundstelle laut Mappe | Blatt!Zelle |",
              "|---|---|---|---|---|---|"]
    for e in eintraege:
        w = e["wert"]
        if e["einheit"] == "Anteil" and isinstance(w, (int, float)):
            ws = f"{w * 100:.4g} %".replace(".", ",")
        elif isinstance(w, float):
            ws = f"{w:,.4f}".rstrip("0").rstrip(".").replace(",", "X").replace(".", ",").replace("X", ".")
        elif isinstance(w, int):
            ws = str(w) if e["einheit"] == "Jahr" else f"{w:,}".replace(",", ".")
        else:
            ws = str(w)
        einh = "" if e["einheit"] == "Anteil" else e["einheit"]
        herk = e["herkunft_art"]
        fund = e["herkunft"] or ""
        zeilen.append(f"| {e['bedeutung']} | {ws} | {einh} | {herk} | {fund} | {e['blatt']}!{e['zelle']} |")
    zeilen += ["", "Hinweise", "",
               "- Eingaben: Spalte F (verwendet) zeigt Projekt 2; die Quelle steht in Spalte G (Teil hinter „/“ = Projekt 2).",
               "- Mietanpassung gefördert: Tabellen D27 bis D29 (3 Jahre keine Erhöhung, dann alle 3 Jahre höchstens "
               "+6,15 %), ab Jahr 36 Kappungsgrenze (Eingabe 4.6) bis zur Vergleichsmiete. Mietanpassung frei "
               "finanziert: Eingabe 4.5 (2 % p. a.).",
               "- Restwert: Ertragswert in Jahr 35 und 42 aus der Marktmiete (frei) bzw. dem Mietpfad der Gruppe "
               "(gefördert), Liegenschaftszins Tabellen F36:F41, Gesamtnutzungsdauer T25; Grundstück nicht angesetzt "
               "(Bodenwert 0).",
               "- N1 steht auf dem neuen Blatt Konzepte; die übrigen Annahmen stehen unverändert auf Eingaben und Tabellen."]
    return "\n".join(zeilen) + "\n"


def main():
    ap = argparse.ArgumentParser(description="Konzepte-Mappe bauen, rechnen, prüfen, ausgeben")
    ap.add_argument("--recalc", default=None)
    ap.add_argument("--ohne-laeufe", action="store_true")
    ap.add_argument("--parallel", type=int, default=3)
    ap.add_argument("--ohne-bauen", action="store_true",
                    help="vorhandene Konzepte-Mappe verwenden (nicht neu bauen und nicht neu berechnen)")
    a = ap.parse_args()
    recalc = finde_recalc(a.recalc)
    sha_vorher = sha256(ORIGINAL)

    if a.ohne_bauen:
        print("1. bauen: übersprungen (Zeilen der Blöcke aus einem Probelauf im Speicher)", flush=True)
        wb_probe = openpyxl.load_workbook(ORIGINAL)
        blatt_konzepte(wb_probe)
    else:
        print("1. bauen", flush=True)
        bauen()
    for z in n5_zeilen():
        if z[0] != "gruppe":
            EINHEIT_N5[z[0]] = "€ p. a." if z[3] == "€" and z[0].startswith(("zue_", "uevk", "kapitaldienst")) else z[3]
            TEXT_N5[z[0]] = f"{z[1]} {z[2]}"
    if a.ohne_bauen:
        res = dict(status="success", total_errors=0, hinweis="Mappe vorhanden, nicht neu berechnet")
    else:
        print("2. neu berechnen", flush=True)
        res = neu_berechnen(ZIEL, recalc)
    print("   recalc:", {k: res.get(k) for k in ("status", "total_errors", "total_formulas")}, flush=True)
    if res.get("status") != "success" or res.get("total_errors"):
        sys.exit(f"recalc mit Fehlern: {res}")
    print("3. vergleichen (Original gegen Kopie, bestehende Blätter)", flush=True)
    vg = vergleiche_original()
    print(f"   {vg['zellen']} Zellen, davon {vg['formeln']} Formeln; Abweichungen: {len(vg['abweichungen'])}", flush=True)
    for x in vg["abweichungen"][:20]:
        print("   ", x)
    wb = openpyxl.load_workbook(ZIEL, data_only=True)
    print("   Status Konzepte:", wb[K]["D3"].value, "| Mappe:", wb["Übersicht"]["D3"].value, flush=True)

    laeufe = {}
    lauf0 = "konzepte"
    werte = werte_annahmen(wb, lauf0) + werte_kern(wb, lauf0) + werte_n(wb, lauf0) + werte_zeitreihe(wb, lauf0)
    laeufe[lauf0] = dict(beschreibung="Konzepte-Mappe im Auslieferungsstand: Modellhaus (Projekt 2), Eingaben "
                                      "unverändert, DSCR-Ziel der Bank 1,2 (Konzepte D6)",
                         aenderungen=[], datei=ZIEL.name,
                         pruefungen=dict(konzepte=wb[K]["D3"].value, mappe=wb["Übersicht"]["D3"].value,
                                         recalc=res.get("status"), formelfehler=res.get("total_errors"),
                                         vergleich_original=dict(zellen=vg["zellen"], formeln=vg["formeln"],
                                                                 abweichungen=len(vg["abweichungen"]))),
                         anzahl_werte=len(werte), werte={e["schluessel"]: e for e in werte})
    if not a.ohne_laeufe:
        print("4. Szenario-Läufe", flush=True)
        with cf.ThreadPoolExecutor(max_workers=a.parallel) as ex:
            futs = {ex.submit(lauf_rechnen, n, aend, recalc): (n, b, aend) for n, b, aend in LAEUFE}
            fertig = {}
            for f in cf.as_completed(futs):
                n, b, aend = futs[f]
                name, datei, r, alt = f.result()
                print(f"   {name}: {r.get('status')} Fehler {r.get('total_errors')}", flush=True)
                fertig[name] = (datei, b, aend, alt, r)
        for n, b, aend in LAEUFE:
            datei, b, aend, alt, r = fertig[n]
            laeufe[n] = lauf_werte(n, datei, b, aend, alt, r)
    assert sha256(ORIGINAL) == sha_vorher, "Original verändert!"
    daten = dict(
        meta=dict(
            titel="Werte der Konzepte-Mappe (Modellrechnung, Fazit) für das Modellhaus",
            mappe=ZIEL.name, mappe_sha256=sha256(ZIEL), original=str(ORIGINAL.relative_to(NBANK)),
            original_sha256=sha_vorher, erzeugt_mit="konzepte/mappe/build_konzepte.py",
            neuberechnung="recalc.py (LibreOffice)",
            aufbau="laeufe.<lauf>.werte.<schluessel> = {schluessel, wert, einheit, blatt, zelle, bedeutung, lauf[, herkunft]}",
            neue_annahme="Konzepte!D6 DSCR-Ziel der Bank, frei finanziert = 1,2 (Annahme der PGN)",
            varianten={v[0]: f"{v[4]} (Blatt {v[2]}, Spalte {v[1]} auf Konzepte)" for v in VARIANTEN},
            hinweise=["Alle Werte roh und ungerundet; Anteile als Dezimalbruch (0,025 = 2,5 %).",
                      "Zahlen der Blätter Konzepte und Konzepte Zeitreihe sind Formeln auf die Blätter der Varianten; "
                      "„herkunft“ nennt die Zelle im Blatt der Variante.",
                      "Läufe n6.*: Kopien der Konzepte-Mappe, je eine Eingabe geändert, neu berechnet; die Werte "
                      "stehen in der Kopie laeufe/<lauf>.xlsx in der genannten Zelle.",
                      "Frei DSCR 1,2: die Miete wird je Lauf neu gelöst (Bank bemisst beim Abschluss); sie ändert sich "
                      "nur, wenn Kosten oder Kapitaldienst in Jahr 1 sich ändern (Läufe kosten_*).",
                      "Vor Steuern, nominal, T0 = Bezugsfertigkeit; Modellrechnung, keine Förderzusage."]),
        laeufe=laeufe)
    JSON_ZIEL.write_text(json_text(daten), encoding="utf-8")
    ANNAHMEN_ZIEL.write_text(annahmen_md(werte_annahmen(wb, lauf0)), encoding="utf-8")
    print(f"5. {JSON_ZIEL.name}: {sum(l['anzahl_werte'] for l in laeufe.values())} Werte in {len(laeufe)} Läufen; "
          f"{ANNAHMEN_ZIEL.name}", flush=True)
    if vg["abweichungen"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
