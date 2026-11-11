#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_vofi.py: erzeugt PGN_VOFI_Mietwohnraum_2026_v3.xlsx nach KONZEPT-v3.md (verbindliche Bauvorlage,
Fassung 6 mit Nacharbeit Runde 1 bis 3, Abschnitte K bis M, Erweiterung „Frei finanziert“, Abschnitt N mit
Nacharbeit N.7 und N.8, und Abschnitt Q: Bewertungsansätze des Modellhauses für Rotenburg (Wümme), Liegenschaftszins
je Projekt, Lektorat der Texte).

Aufruf
    python build_vofi.py                       # bauen, speichern, mit recalc.py neu berechnen, nachbearbeiten
    python build_vofi.py --ohne-recalc         # nur bauen und speichern
    python build_vofi.py --probe               # Probelauf: Zeitreihen nur t = 0 ... 2 (Formelkontrolle)
    python build_vofi.py --ziel X.xlsx         # anderer Zielpfad (Prüfläufe)
    python build_vofi.py --nachbearbeiten X.xlsx
                                               # nur Nachbearbeitung einer mit recalc.py berechneten Datei

Neuberechnung
    LibreOffice (recalc.py) entfernt beim Speichern Angaben, die das Konzept verlangt: die Lage der
    Gliederungsschalter (summaryBelow = 0 auf Eingaben, Übersicht und den Zeitreihenblättern), die Kennung
    zugeklappter Gruppen (collapsed) und fullCalcOnLoad; beim ersten Speichern sortiert es außerdem mehrteilige
    Druckbereiche um und schreibt die Druckwiederholungen doppelt, und es setzt Autor und Sprache neu. Der
    Standardaufruf stellt alles nach recalc.py wieder her (nachbearbeiten). Wer recalc.py danach erneut auf die
    Datei anwendet, ruft anschließend "build_vofi.py --nachbearbeiten DATEI" auf; Zellwerte und Formeln bleiben
    dabei unverändert.

Aufbau des Skripts
    0. Pfade
    1. Gestaltung: Farben, Zahlenformate, zentrale Stil-Helfer (Vorgabe 9, Konzept G)
    2. Daten: EINGABEN (einzige Quelle der Eingabewerte, Konzept B.2) und FESTWERTE (Konzept C)
    3. Blätter: je Blatt eine Funktion; Gefördert A/B/C aus einer Funktion mit Parameter Gruppe.
       Eingaben (B), Tabellen (C), Gefördert A/B/C (D.3), Frei finanziert (D.4), Übersicht (D.5), NBank (D.6),
       Hinweise (D.7)
    4. Namen, Druck, Speichern, Neuberechnung, Nachbearbeitung

Alle Ergebnisse sind Excel-Formeln. Adressen (Zeilen, Spalten) sind die des Konzepts und verbindlich.
"""
import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.hyperlink import Hyperlink
from openpyxl.worksheet.pagebreak import Break

# =====================================================================================================
# 0. Pfade
# =====================================================================================================
HIER = Path(__file__).resolve().parent
ZIEL = HIER / "PGN_VOFI_Mietwohnraum_2026_v3.xlsx"


def finde_recalc():
    """recalc.py des xlsx-Skills: Umgebungsvariable VOFI_RECALC, sonst Suche unter dem Benutzerordner."""
    if os.environ.get("VOFI_RECALC"):
        return os.environ["VOFI_RECALC"]
    for treffer in sorted(Path.home().glob(".*/skills/**/xlsx/scripts/recalc.py")):
        return str(treffer)
    return "recalc.py"


PYTHON = os.environ.get("VOFI_PYTHON", sys.executable)
RECALC = finde_recalc()

# =====================================================================================================
# 1. Gestaltung
# =====================================================================================================
ROT, GRUPPE, ANTHRAZIT = "8B2939", "F4F3F2", "3C3C3B"
BLAU, GELB, GRUEN, SCHWARZ, GRAU_F, LINIE, WEISS = "0000FF", "FFF2CC", "008000", "000000", "EDEDED", "D9D9D9", "FFFFFF"

F_EUR = '#,##0;[Red]-#,##0;"–"'            # Euro
F_EUR_KOST = '#,##0;-#,##0;"–"'            # Euro, Kostenzeilen Jahresrechnung (Übersicht, Baustufe 2)
F_EUR2 = '#,##0.00;[Red]-#,##0.00;"–"'     # Euro mit Cent, €/m² Monat
F_PCT = '0.00 %;[Red]-0.00 %;"–"'          # Prozent
F_PCT1 = '0.0 %;[Red]-0.0 %;"–"'           # Prozent, eine Stelle
F_PCT0 = '0.00 %'                          # Prozent ohne Strich bei 0
F_PP = '+0.00 %;[Red]-0.00 %;"–"'          # Prozentpunkte (Eingabe 9.3)
F_FAKTOR = '0.00;[Red]-0.00;"–"'           # Faktor, DSCR
F_JAHR = '0'                               # t, Jahr, Jahre
F_ANZ = '#,##0;[Red]-#,##0;"–"'            # Anzahl, m²
F_TEXT = '@'                               # Text, Liste (nur Eingabezellen)
F_TILG = '"Tilgung "0.00 %'                # Rasterzeilen Übersicht Block 4 (Zahl in Spalte B)
F_TILG_E = '"Tilgung "0.00 %" laut Eingabe 3.1"'
F_SATZ_VW = '#,##0" € je Wohnung"'          # Satz Objektverwaltung, Übersicht Jahresrechnung
F_SATZ_IH = '0.00" €/m²"'                  # Satz Instandhaltung, Übersicht Jahresrechnung
# Aufschlag der gerechneten Frei-Miete auf die Marktmiete: Zahl mit Text im Format, immer in Spalte L (Breite 38; eine
# Zahl läuft nicht in Nachbarzellen über). Übersicht Seite 1 in L26 (1.18), L38 (Jahresrechnung) und L42 (Liquidität),
# Seite 2 in L74, L87, L98 (Renditen, Restwert); auf dem Blatt Frei finanziert Bezeichnung I131 und Zahl J131 (keine
# verbundenen Zellen). Vierter Abschnitt: Text „–“ bei Marktmiete 0 (Aufschlag nicht bestimmt).
F_AUFSCHLAG = ('"Frei: Miete "0.0 %" über Marktmiete";"Frei: Miete "0.0 %" unter Marktmiete";"Frei: Miete = Marktmiete";'
               '"Frei: Marktmiete 0, Aufschlag "@')
F_AUFSCHLAG_FREI = '+0.0 %;[Red]-0.0 %;"0,0 %"'
# Eingabespalten D–F (Eingaben): ohne Nullabschnitt, eine 0 bleibt als 0 sichtbar (Runde 2, V8)
F_EIN = {F_EUR: '#,##0', F_EUR2: '#,##0.00', F_PCT: '0.00 %', F_PP: '+0.00 %;-0.00 %;0.00 %', F_FAKTOR: '0.00',
         F_JAHR: '0', F_ANZ: '#,##0', F_TEXT: '@'}

DUENN = Side(style="thin", color=LINIE)
HAAR = Side(style="hair", color=LINIE)
MITTEL = Side(style="medium", color=ANTHRAZIT)
ERGEBNIS_LINIE = Side(style="thin", color=ANTHRAZIT)

# Registrierte Namen: Name -> (Blatt, Bezug). Wird beim Bau gefüllt; dient auch der Farbwahl der Formeln.
NAMEN = {}



def schrift(farbe=ANTHRAZIT, fett=False, groesse=10, unterstrichen=None):
    return Font(name="Arial", size=groesse, bold=fett, color=farbe, underline=unterstrichen)


def fuellung(farbe):
    return PatternFill("solid", fgColor=farbe)


_VERWEIS_BLATT = re.compile(r"^=(?:'([^']+)'|([A-Za-zÄÖÜäöüß_][\w.]*))!\$?[A-Z]{1,3}\$?\d+$")
_VERWEIS_NAME = re.compile(r"^=([A-Za-z_][A-Za-z0-9_]*)$")


def ist_verweis(ws, formel):
    """True, wenn die Formel nur aus einem Bezug oder Namen auf ein anderes Blatt besteht (grün)."""
    m = _VERWEIS_BLATT.match(formel)
    if m:
        return (m.group(1) or m.group(2)) != ws.title
    m = _VERWEIS_NAME.match(formel)
    if m and m.group(1) in NAMEN:
        return NAMEN[m.group(1)][0] != ws.title
    return False


def zelle(ws, ref, wert, art="text", fmt=None, fett=False, umbruch=None, h=None, v=None, einzug=0):
    """Schreibt eine Zelle mit Stil. art: text | wert | fest | formel | eingabe | verwendet | kopf | gruppe | titel |
    link. 'fest' = feste Hilfszahl außerhalb der Eingaben (schwarz, keine Eingabeoptik).
    Bei art='formel' wird automatisch grün gewählt, wenn die Formel ein reiner Verweis auf ein anderes Blatt ist."""
    c = ws[ref]
    c.value = wert
    if art not in ("formel", "verwendet") and isinstance(wert, str) and wert.startswith("="):
        c.data_type = "s"                    # Text mit „=“ am Anfang (Jahresrechnung), keine Formel
        c.quotePrefix = True
    if art == "formel" and isinstance(wert, str) and ist_verweis(ws, wert):
        art = "verweis"
    if art == "text" or art == "wert":
        c.font = schrift(ANTHRAZIT, fett)
    elif art in ("formel", "fest"):
        c.font = schrift(SCHWARZ, fett)
    elif art == "verweis":
        c.font = schrift(GRUEN, fett)
    elif art == "eingabe":
        c.font = schrift(BLAU, fett)
        c.fill = fuellung(GELB)
        c.border = Border(left=DUENN, right=DUENN, top=DUENN, bottom=DUENN)
    elif art == "verwendet":
        c.font = schrift(SCHWARZ, fett)
        c.fill = fuellung(GRAU_F)
    elif art == "kopf":
        c.font = schrift(WEISS, True)
        c.fill = fuellung(ROT)
        umbruch, v = (True if umbruch is None else umbruch), v or "center"
    elif art == "gruppe":
        c.font = schrift(ANTHRAZIT, True)
        c.fill = fuellung(GRUPPE)
    elif art == "titel":
        c.font = schrift(ANTHRAZIT, True, 14)
    elif art == "link":
        c.font = schrift(ROT, fett, unterstrichen="single")
    else:
        raise ValueError(art)
    if fmt:
        c.number_format = fmt
    if einzug and not h:
        h = "left"                           # Einzug wirkt nur bei linksbündiger Ausrichtung
    if umbruch or h or v or einzug:
        c.alignment = Alignment(horizontal=h, vertical=v, wrap_text=umbruch or None, indent=einzug)
    return c


def link(ws, ref, text, ziel):
    """Zellhyperlink mit Sprungziel (keine HYPERLINK-Formel), Text als Konstante."""
    c = zelle(ws, ref, text, "link")
    c.hyperlink = Hyperlink(ref=ref, location=ziel, display=text)
    return c


def titel(ws, text, bis_spalte):
    zelle(ws, "A1", text, "titel")
    ws.merge_cells(f"A1:{bis_spalte}1")
    ws.row_dimensions[1].height = 24


def kopfzeile(ws, zeile, texte, von="A", bis=None, hoehe=30, umbruch=True, einzug=None, rechts=(), mitte=()):
    """Kopfzeile einer Tabelle: texte = {Spalte: Text}; Füllung von 'von' bis 'bis'. Ohne Umbruch läuft der Text
    in leere Nachbarzellen (Beschriftung in schmaler Spalte A). einzug = {Spalte: Einzug}; rechts = Spalten mit
    rechtsbündigem Kopf (über Zahlen), mitte = Spalten mit zentriertem Kopf (über Statuswörtern)."""
    a = ord_spalte(von)
    b = ord_spalte(bis) if bis else max(ord_spalte(s) for s in texte)
    for i in range(a, b + 1):
        s = get_column_letter(i)
        zelle(ws, f"{s}{zeile}", texte.get(s), "kopf", umbruch=umbruch, einzug=(einzug or {}).get(s, 0),
              h="right" if s in rechts else "center" if s in mitte else None)
    ws.row_dimensions[zeile].height = hoehe


def gruppenzeile(ws, zeile, text, von="A", bis="G", text_spalte=None):
    a, b = ord_spalte(von), ord_spalte(bis)
    for i in range(a, b + 1):
        s = get_column_letter(i)
        zelle(ws, f"{s}{zeile}", text if s == (text_spalte or von) else None, "gruppe")


def ord_spalte(s):
    n = 0
    for ch in s:
        n = n * 26 + ord(ch) - 64
    return n


def breiten(ws, spec):
    """spec: {'A': 6, 'C:F': 10, ...}"""
    for k, w in spec.items():
        if ":" in k:
            a, b = k.split(":")
            for i in range(ord_spalte(a), ord_spalte(b) + 1):
                ws.column_dimensions[get_column_letter(i)].width = w
        else:
            ws.column_dimensions[k].width = w


def rahmen_unten(ws, zeile, von, bis, seite):
    for i in range(ord_spalte(von), ord_spalte(bis) + 1):
        c = ws.cell(zeile, i)
        b = c.border
        c.border = Border(left=b.left, right=b.right, top=b.top, bottom=seite)


def rahmen_oben(ws, zeile, von, bis, seite):
    for i in range(ord_spalte(von), ord_spalte(bis) + 1):
        c = ws.cell(zeile, i)
        b = c.border
        c.border = Border(left=b.left, right=b.right, top=seite, bottom=b.bottom)


def druck(ws, titelzeilen=None, bereich=None, umbrueche=(), hoehe=0, titelspalten=None):
    """A4 quer, an Seitenbreite angepasst (hoehe = Seiten untereinander, 0 = beliebig), Ränder 1,5 cm, Fußzeile
    Blattname / Seite x von y (Konzept G.4)."""
    ws.page_setup.orientation = "landscape"
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = hoehe
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    rand = 1.5 / 2.54
    ws.page_margins.left = ws.page_margins.right = rand
    ws.page_margins.top = ws.page_margins.bottom = rand
    ws.page_margins.header = ws.page_margins.footer = 0.8 / 2.54
    ws.oddFooter.left.text = "&A"
    ws.oddFooter.left.font = "Arial,Regular"
    ws.oddFooter.left.size = 8
    ws.oddFooter.right.text = "Seite &P von &N"
    ws.oddFooter.right.font = "Arial,Regular"
    ws.oddFooter.right.size = 8
    if titelzeilen:
        ws.print_title_rows = titelzeilen
    if titelspalten:
        ws.print_title_cols = titelspalten
    if bereich:
        ws.print_area = bereich
    for z in umbrueche:                       # Seitenumbruch nach Zeile z (Blockgrenzen)
        ws.row_breaks.append(Break(id=z))


def name(wb, nm, blatt, bezug):
    """Benannter Bereich, arbeitsmappenweit."""
    NAMEN[nm] = (blatt, bezug)
    wb.defined_names[nm] = DefinedName(nm, attr_text=f"'{blatt}'!{bezug}")


# =====================================================================================================
# 2. Daten
# =====================================================================================================
# Gültigkeit: ("ganz", min, max) | ("dez", min, max) | ("liste", formel)
# Felder: Nr., Zeile, Eingabe (Excel), Name, Einheit, Format, Modellhaus, Tarutinoer, Quelle (Excel), Gültigkeit
BLOECKE = [
    (6, "1 Projekt"),
    (10, "2 Kosten und Grundstück"),
    (16, "3 Förderung NBank"),
    (21, "4 Miete"),
    (28, "5 Bewirtschaftung"),
    (34, "6 Bankdarlehen und Vergleichszins"),
    (39, "7 Eigenkapital und Projektkonto (VOFI)"),
    (43, "8 Restwert"),
    (47, "9 Stresstest (neutral: Faktor 1, Zuschlag 0)"),
    (52, "10 Miete frei finanziert und DSCR-Ziel"),
]

# Quellen: Sachquelle mit Stand; „Vorgängermappe“ = PGN-VOFI-Modell v2-1 (Fundstellen: KONZEPT-v3.md, B.2)
_VG = "PGN-Annahme; Vorgängermappe"
EINGABEN = [
    # Block 1 Projekt
    ("1.1", 7, "Bezugsjahr (ändert nur Jahresangaben)", "Bezugsjahr", "Jahr", F_JAHR, 2027, 2027,
     "PGN-Annahme, Planungsstand 2026", ("ganz", 2020, 2060)),
    ("1.2", 8, "Wohnfläche", "Wohnflaeche", "m²", F_ANZ, 1400, 828,
     "Broschüre S. 10 / Projektdaten PGN", ("dez", 1, 100000)),
    ("1.3", 9, "Wohnungen", "Wohneinheiten", "Anzahl", F_ANZ, 20, 14,
     "Broschüre S. 10 / Projektdaten PGN", ("ganz", 1, 1000)),
    # Block 2 Kosten und Grundstück
    ("2.1", 11, "Herstellungskosten KG 200–700", "Herstellungskosten_qm", "€/m² Wohnfläche", F_EUR, 4500, 3579,
     "Broschüre S. 10 / Kostenansatz PGN", ("dez", 0, 20000)),
    ("2.2", 12, "Finanzierungskosten KG 800", "KG_800", "€", F_EUR, 0, 0,
     "PGN-Annahme (Ansatz 0)", ("dez", 0, 100000000)),
    ("2.3", 13, "Grundstück, Verkehrswert (Sacheinlage)", "Grundstueck", "€", F_EUR, 700000, 0,
     "Broschüre S. 10 / Ansatz 0 € (Verkehrswert 731.325 €)", ("dez", 0, 1000000000)),
    ("2.4", 14, "Bodenrichtwert (0 = kein Deckel)", "Bodenrichtwert", "€/m²", F_EUR, 0, 260,
     "Broschüre S. 10: Deckel greift nicht / Projektdaten PGN", ("dez", 0, 10000)),
    ("2.5", 15, "Grundstücksfläche (0 = kein Deckel)", "Grundstuecksflaeche", "m²", F_ANZ, 0, 1362,
     "Broschüre S. 10: Deckel greift nicht / Projektdaten PGN", ("dez", 0, 1000000)),
    # Block 3 Förderung NBank
    ("3.1", 17, "Tilgung NBank-Darlehen, linear", "Tilgung_NBank", "% p. a.", F_PCT, 1 / 42, 1 / 42,
     "PGN-Annahme: linear über die Höchstlaufzeit von 42 Jahren", ("dez", 0, 0.10)),
    ("3.2", 18, "Tilgungsaufschub", "Tilgungsaufschub", "Jahre", F_JAHR, 0, 0,
     "PGN-Annahme (Rahmen RL Nr. 5.3.5)", ("ganz", 0, "Aufschub_max")),
    ("3.3", 19, "Zins NBank-Darlehen ab Jahr 36", "Zins_NBank_ab36", "% p. a.", F_PCT, 0.0374, 0.0374,
     "PGN-Annahme (Rahmen RL Nr. 5.3.4)", ("dez", 0, 0.10)),
    ("3.4", 20, "Swapsatz 30 Jahre", "Swapsatz_30J", "% p. a.", F_PCT, 0.0339, 0.0339,
     "EUR-Swapsatz 30 Jahre, Stand 19.08.2026", ("dez", 0, 0.10)),
    # Block 4 Miete
    ("4.1", 22, "Mietenstufe", "Mietenstufe", "Liste", F_TEXT, "IV", "VI",
     "Broschüre S. 10 / Projektdaten PGN", ("liste", "Mietenstufen")),
    ("4.2", 23, "Effizienzhaus 40 erreicht", "Effizienz_EH40", "ja/nein", F_TEXT, "nein", "nein",
     "Broschüre S. 11 (ohne EH-40-Zuschlag) / Planung PGN (EH 55)", ("liste", '"ja,nein"')),
    ("4.3", 24, "Ortsübliche Vergleichsmiete, Jahr 1", "Vergleichsmiete_1", "€/m² Monat", F_EUR2,
     11.87, 12.91774539744, "PGN-Annahme / PGN-Mietband Neu Wulmstorf, fortgeschrieben", ("dez", 0, 50)),
    ("4.4", 25, "Marktmiete Neuvermietung, Jahr 1", "Marktmiete_1", "€/m² Monat", F_EUR2,
     13.30, 14.48035669872, "Mietübersicht Landkreis Rotenburg 2026 / wie Eingabe 4.3", ("dez", 0, 50)),
    ("4.5", 26, "Steigerung Markt- und Vergleichsmiete", "Mietsteigerung", "% p. a.", F_PCT, 0.02, 0.02,
     "PGN-Annahme", ("dez", -0.05, 0.10)),
    ("4.6", 27, "Kappungsgrenze nach Bindungsende", "Kappungsgrenze", "% in 3 Jahren", F_PCT, 0.20, 0.20,
     "§ 558 Abs. 3 BGB", ("dez", 0, 0.20)),
    # Block 5 Bewirtschaftung
    ("5.1", 29, "Mietausfall/Leerstand", "Mietausfall", "% der Sollmiete", F_PCT, 0.02, 0.02,
     "PGN-Annahme (Broschüre S. 11)", ("dez", 0, 0.20)),
    ("5.2", 30, "Objektverwaltung je Wohnung", "Verwaltung_WE", "€ p. a.", F_EUR, 367, 367,
     "PGN-Annahme (Broschüre S. 11); ImmoWertV fortgeschrieben", ("dez", 0, 2000)),
    ("5.3", 31, "Instandhaltung je m² Wohnfläche", "Instandhaltung_qm", "€ p. a.", F_EUR2, 14.40, 14.40,
     "PGN-Annahme (Broschüre S. 11); ImmoWertV fortgeschrieben", ("dez", 0, 100)),
    ("5.4", 32, "Kostensteigerung ab Jahr 2", "Kostensteigerung", "% p. a.", F_PCT, 0.02, 0.02,
     _VG + " Best 1,5 %, Worst 2,5 %", ("dez", -0.05, 0.10)),
    ("5.5", 33, "Kostensätze 2026 fortschreiben um", "Kosten_Vorlauf", "Jahre", F_JAHR, 0, 0,
     "Broschüre S. 11 (Kostenstand 2026)", ("ganz", 0, 10)),
    # Block 6 Bankdarlehen und Vergleichszins
    ("6.1", 35, "Zins Bank; Vergleichszins Förderbarwert", "Zins_Bank", "% p. a.", F_PCT, 0.0374, 0.0374,
     "PGN-Annahme (Bundesbank-Statistik, Vorgängermappe)", ("dez", 0, 0.15)),
    ("6.2", 36, "Zinsbindung", "Zinsbindung", "Jahre", F_JAHR, 10, 10,
     "PGN-Annahme (Vorgängermappe)", ("ganz", 1, 42)),
    ("6.3", 37, "Anschlusszins", "Zins_Anschluss", "% p. a.", F_PCT, 0.0374, 0.0374,
     _VG + " Best 2,74 %, Worst 4,74 %", ("dez", 0, 0.15)),
    ("6.4", 38, "Laufzeit Bankdarlehen (Annuität)", "Laufzeit_Bank", "Jahre", F_JAHR, 30, 30,
     "PGN-Annahme (Vorgängermappe)", ("ganz", 1, 60)),
    # Block 7 Eigenkapital und Projektkonto (VOFI)
    ("7.1", 40, "Zusätzliches Eigenkapital bar, mindert Bank", "EK_Zusatz", "€", F_EUR, 0, 0,
     "PGN-Annahme", ("dez", 0, 1000000000)),
    ("7.2", 41, "Guthabenzins Projektkonto (VOFI)", "Habenzins", "% p. a.", F_PCT, 0.02, 0.02,
     "PGN-Annahme (Vorgängermappe)", ("dez", 0, 0.10)),
    ("7.3", 42, "Sollzins Projektkonto (VOFI)", "Sollzins", "% p. a.", F_PCT, 0.05, 0.05,
     "PGN-Annahme (Vorgängermappe)", ("dez", 0, 0.20)),
    # Block 8 Restwert
    ("8.1", 44, "Bodenwertsteigerung", "Bodenwertsteigerung", "% p. a.", F_PCT, 0.015, 0.015,
     "PGN-Annahme (Vorgängermappe)", ("dez", -0.05, 0.10)),
    ("8.2", 45, "Zielmiete nach Jahr 42", "Zielmiete", "Liste", F_TEXT, "Marktmiete", "Marktmiete",
     "PGN-Annahme", ("liste", '"Marktmiete,Vergleichsmiete"')),
    ("8.3", 46, "Veräußerungskosten", "Veraeusserungskosten", "% des Restwerts", F_PCT, 0.0, 0.0,
     "PGN-Annahme", ("dez", 0, 0.20)),
    # Block 9 Stresstest
    ("9.1", 48, "Faktor Herstellungskosten", "Stress_KG", "Faktor", F_FAKTOR, 1.0, 1.0,
     _VG + " Best 0,95, Worst 1,15", ("dez", 0.5, 2)),
    ("9.2", 49, "Faktor Markt- und Vergleichsmiete", "Stress_Miete", "Faktor", F_FAKTOR, 1.0, 1.0,
     _VG + " Best 1,05, Worst 0,95", ("dez", 0.5, 2)),
    ("9.3", 50, "Zuschlag Liegenschaftszins (Standort)", "Stress_LZ", "Prozentpunkte", F_PP, 0.0, 0.0,
     "Vorgängermappe: Best −0,30, Worst +0,60 Prozentpunkte", ("dez", -0.02, 0.02)),
    ("9.4", 51, "Faktor Gebäude-Restwert", "Stress_GebRW", "Faktor", F_FAKTOR, 1.0, 1.0,
     "PGN-Annahme", ("dez", 0, 1.5)),
    # Block 10 Miete frei finanziert und DSCR-Ziel (Konzept N)
    ("10.1", 53, "Miete frei finanziert", "Miete_Frei", "Liste", F_TEXT, "Marktmiete", "Marktmiete",
     "PGN-Annahme", ("liste", '"Marktmiete,Miete für DSCR-Ziel"')),
    ("10.2", 54, "DSCR-Ziel für die nötige Miete", "DSCR_Ziel", "Faktor", F_FAKTOR, 1.0, 1.0,
     "PGN-Annahme", ("dez", 0.5, 3)),
]
PROJEKTE = ("Modellhaus Broschüre", "Tarutinoer Str. 4, Neu Wulmstorf")
EINGABE_ERSTE, EINGABE_LETZTE = 7, 54


def _zahl_de(x, fmt):
    """Grenzwert der Datenüberprüfung in deutscher Schreibweise passend zum Zahlenformat."""
    if fmt in (F_PCT, F_PP):
        s = f"{x * 100:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".") + " %"
        return ("+" + s if fmt == F_PP and x > 0 else s).replace("-", "−")
    if fmt in (F_EUR2, F_FAKTOR):
        s = f"{x:,.2f}"
    elif fmt == F_JAHR:
        s = f"{x:.0f}"                           # Jahre, Jahreszahlen ohne Tausenderpunkt
    else:
        s = f"{x:,.0f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ".").replace("-", "−")


def dv_meldung(nr, einheit, fmt, gueltig):
    """Fehlermeldung der Datenüberprüfung mit zulässigem Bereich (Konzept B.2)."""
    art = gueltig[0]
    if art == "liste":
        return {"4.1": "Zulässig: Mietenstufe I bis VII.", "4.2": "Zulässig: ja oder nein.",
                "8.2": "Zulässig: Marktmiete oder Vergleichsmiete.",
                "10.1": "Zulässig: Marktmiete oder Miete für DSCR-Ziel."}[nr]
    if gueltig[2] == "Aufschub_max":
        hoechst = next(w for nr_, _z, _t, _e, w, *_r in FESTWERTE if nr_ == "T14")
        return f"Zulässig: ganze Zahl 0 bis {hoechst} (RL Nr. 5.3.5)."
    lo, hi = _zahl_de(gueltig[1], fmt), _zahl_de(gueltig[2], fmt)
    if art == "ganz":                            # nur ganze Zahlen: Die Meldung sagt es (Lektorat Nr. 27)
        return f"Zulässig: ganze Zahl {lo} bis {hi}."
    zusatz = "" if fmt in (F_PCT, F_PP) or einheit in ("Faktor", "Anzahl", "Jahr") else f" {einheit}"
    text = f"Zulässig: {lo} bis {hi}{zusatz}"
    return text if text.endswith(".") else text + "."


def dv_hinweis(fmt):
    """Eingabehinweis bei Prozent-Eingaben (Konzept B.2)."""
    if fmt == F_PCT:
        return "Wert mit %-Zeichen eingeben."
    if fmt == F_PP:
        return "In Prozentpunkten mit %-Zeichen eingeben, z. B. 0,5 %."
    return None

# Tabellen-Blatt (Konzept C). Tabelle 3: Nr., Zeile, Festwert, Einheit, Wert, Format, Quelle, Name
QUOTEN = [  # Tabelle 1, Zeilen 5-6: Nr., Zeile, Festwert, Einheit, A, B, C, Quelle, Name
    ("T1", 5, "Darlehen, höchstens", "% der zuw. Kosten", 0.40, 0.60, 0.70, "RL Nr. 5.3.3.1",
     "Quote_Darlehen"),
    ("T2", 6, "Zuschuss, höchstens", "% der zuw. Kosten", 0.40, 0.20, 0.10, "RL Nr. 5.3.3.2",
     "Quote_Zuschuss"),
]
MIETENSTUFEN = [  # Tabelle 2, Zeilen 9-15: Nr., Mietenstufe, Bemessungsgrenze, Höchstmiete A, B, C
    ("T3", "I", 4800, 6.50, 7.90, 8.70), ("T4", "II", 4800, 6.50, 7.90, 8.70),
    ("T5", "III", 4800, 6.50, 7.90, 8.70), ("T6", "IV", 5000, 6.80, 8.20, 9.00),
    ("T7", "V", 5000, 6.80, 8.20, 9.00), ("T8", "VI", 5000, 6.80, 8.20, 9.00),
    ("T9", "VII", 5000, 6.80, 8.20, 9.00),
]
QUELLE_MIETENSTUFEN = "RL Nr. 5.3.2.2 (Ausgangswert 01.07.2026), 5.4.4"
FESTWERTE = [
    ("T10", 18, "Eigenmittel, mindestens", "% der zuw. Kosten", 0.20, F_PCT1, "RL Nr. 5.2.6", "Eigenmittelquote"),
    ("T11", 19, "Zins NBank bis Ende Jahr 35", "% p. a.", 0.0, F_PCT0, "RL Nr. 5.3.4", "Zins_NBank_1_35"),
    ("T12", 20, "Zinsfreie Jahre", "Jahre", 35, F_JAHR, "RL Nr. 5.3.4", "Zinsfreie_Jahre"),
    ("T13", 21, "Höchstlaufzeit, Betrachtungsende", "Jahre", 42, F_JAHR, "RL Nr. 5.3.5", "Laufzeit_max"),
    ("T14", 22, "Tilgungsaufschub, höchstens", "Jahre", 5, F_JAHR, "RL Nr. 5.3.5", "Aufschub_max"),
    ("T15", 23, "Verwaltungskostenbeitrag", "% p. a. Restkapital", 0.005, F_PCT, "RL Nr. 12.7.1",
     "VKB_Satz"),
    ("T16", 24, "Bearbeitungsentgelt Darlehen", "% einmalig", 0.01, F_PCT, "RL Nr. 12.7.2", "BE_Darlehen"),
    ("T17", 25, "Bearbeitungsentgelt Zuschuss", "% einmalig", 0.0075, F_PCT, "RL Nr. 12.7.3", "BE_Zuschuss"),
    ("T18", 26, "Belegungs- und Mietbindung", "Jahre", 35, F_JAHR, "RL Nr. 5.4.1, 5.4.2", "Bindung"),
    ("T19", 27, "Jahre ohne Mieterhöhung", "Jahre", 3, F_JAHR, "RL Nr. 5.4.4, 5.4.5", "Mietruhe_Jahre"),
    ("T20", 28, "Mieterhöhung in der Bindung, höchstens", "% in 3 Jahren", 0.0615, F_PCT, "RL Nr. 5.4.5",
     "Mietanpassung_Bindung"),
    ("T21", 29, "Abstand der Mieterhöhungen", "Jahre", 3, F_JAHR, "PGN-Konvention (Rahmen RL Nr. 5.4.5)",
     "Erhoehung_Rhythmus"),
    ("T22", 30, "Zuschlag Höchstmiete ab EH 40", "€/m² Monat", 0.30, F_EUR2, "RL Nr. 5.4.4 Satz 2",
     "Zuschlag_EH40"),
    ("T23", 31, "Tilgung Bankdarlehen, mindestens", "% p. a.", 0.01, F_PCT, "RL Nr. 5.3.6", "Tilgung_Bank_min"),
    ("T24", 32, "Aufschlag auf Swapsatz", "Prozentpunkte", 0.01, F_PP, "RL Nr. 11.10 Abs. 4", "Aufschlag_Swap"),
    ("T25", 33, "Gesamtnutzungsdauer Mehrfamilienhaus", "Jahre", 80, F_JAHR, "ImmoWertV Anlage 1", "GND"),
]
# Tabelle 4 Liegenschaftszins je Projekt (Konzept C, Q): Nr., Restnutzungsdauer, Projekt 1 (Rotenburg (Wümme), mittlerer
# Bodenrichtwert 185 €/m²), Projekt 2 (Neu Wulmstorf, 600 €/m²). Gerechnet wird die Spalte „verwendet“ (F).
LIEGENSCHAFTSZINS = [("T26", 30, 0.033, 0.025), ("T27", 38, 0.034, 0.027), ("T28", 40, 0.034, 0.027),
                     ("T29", 50, 0.035, 0.029), ("T30", 60, 0.035, 0.030), ("T31", 70, 0.035, 0.031)]
QUELLE_LZ = "Gutachterausschuss Nds., Landesmodell MFH 01.01.2026"
LZ_FUSSNOTEN = [
    ("A42", "Projekt 1: Rotenburg (Wümme), Bodenrichtwert 185 €/m². Projekt 2: Neu Wulmstorf, 600 €/m² "
            "(Tarutinoer: 260 €/m²)."),
    ("A43", "Streubreite laut Quelle für Projekt 1: ±1,2 Prozentpunkte. Anpassung an den Standort: Eingabe 9.3."),
]

# Zeitachse der Blätter Gefördert/Frei (Konzept D.3): Zeile 6 = t 0, Zeile 48 = t 42, Zeile 86 = t 80
Z0, Z42, Z80 = 6, 48, 86
# Mehrteilige Druckbereiche (Konzept G.4) in der gewollten Reihenfolge; LibreOffice sortiert sie beim Speichern um,
# nachbearbeiten() stellt die Reihenfolge wieder her (sie bestimmt die Seitenfolge in Excel)
DRUCK_GEF = f"A1:J{Z42},K2:X{Z42},A88:J183"
# Frei: Zeitreihe A–Q in einem Bereich; Blöcke (A–J) im gleich breiten Bereich A–Q, damit Excel (ein Maßstab je Blatt)
# und LibreOffice (ein Maßstab je Bereich) dieselben drei Seiten drucken
DRUCK_FREI = f"A1:Q{Z42},A88:Q186"
# Seitenumbrüche nach Zeile (Blockgrenzen): Gefördert Finanzierung | Restwert, Renditen | Liquidität, Förderbarwert,
# DSCR-Ziel; Frei Finanzierung, Restwert | Renditen, Liquidität, DSCR-Ziel
UMBRUCH_GEF, UMBRUCH_FREI = (115, 152), (129,)
DRUCKBEREICHE = {**{f"Gefördert {g}": DRUCK_GEF for g in "ABC"}, "Frei finanziert": DRUCK_FREI}

# =====================================================================================================
# 3. Blätter
# =====================================================================================================


def blatt_eingaben(wb, ws):
    """Konzept B: Auswahl Aktives Projekt, 39 Eingaben in 10 Blöcken, Spalte 'verwendet', Namen, Gültigkeit."""
    titel(ws, "Eingaben", "G")
    zelle(ws, "A2", "Blaue Werte auf Gelb ändern, auch die Projektnamen in Zeile 4. Gerechnet wird nur die "
                    "Spalte „verwendet“.")
    # Projektwahl über die Position (1 = Spalte D, 2 = Spalte E); Projektnamen sind Eingaben (Zeile 4)
    zelle(ws, "B3", "Aktives Projekt", fett=True)
    zelle(ws, "C3", "1 oder 2")
    zelle(ws, "D3", 1, "eingabe", F_JAHR, h="right", einzug=1)
    link(ws, "G3", "Übersicht", "'Übersicht'!A1")
    zelle(ws, "B4", "Projektname")
    zelle(ws, "C4", "Text")
    zelle(ws, "D4", PROJEKTE[0], "eingabe", F_TEXT, umbruch=True, v="center")
    zelle(ws, "E4", PROJEKTE[1], "eingabe", F_TEXT, umbruch=True, v="center")
    zelle(ws, "F4", "=INDEX(Projektliste,Projekt_Nr)", "verwendet", F_TEXT, umbruch=True, v="center")
    ws.row_dimensions[3].height = 18
    ws.row_dimensions[4].height = 27

    kopfzeile(ws, 5, {"A": "Nr.", "B": "Eingabe", "C": "Einheit", "D": "Projekt 1", "E": "Projekt 2",
                      "F": "verwendet", "G": "Quelle Projekt 1 / Projekt 2"}, "A", "G", einzug={"G": 1})
    name(wb, "Projektliste", "Eingaben", "$D$4:$E$4")
    name(wb, "Aktives_Projekt", "Eingaben", "$F$4")
    name(wb, "Projekt_Nr", "Eingaben", "$D$3")

    for zeile, text in BLOECKE:
        gruppenzeile(ws, zeile, text, "A", "G", text_spalte="B")

    dv_projekt = DataValidation(type="list", formula1='"1,2"', allow_blank=False, showErrorMessage=True,
                                error="Zulässig: 1 (Spalte D) oder 2 (Spalte E).", errorTitle="Eingabe")
    dv_projekt.add("D3")
    ws.add_data_validation(dv_projekt)
    # Spalte des nicht aktiven Projekts abgesetzt: Kopf grau, Werte grau (bedingte Formatierung)
    grau_kopf = PatternFill(start_color="A6A6A6", end_color="A6A6A6", fill_type="solid")
    for s, nr in (("D", 1), ("E", 2)):
        ws.conditional_formatting.add(f"{s}5", FormulaRule(formula=[f"Projekt_Nr<>{nr}"], fill=grau_kopf))
        ws.conditional_formatting.add(f"{s}{EINGABE_ERSTE}:{s}{EINGABE_LETZTE}",
                                      FormulaRule(formula=[f"Projekt_Nr<>{nr}"], font=Font(color="8C8C8C")))

    for nr, z, text, nm, einheit, fmt, w_mh, w_ta, quelle, gueltig in EINGABEN:
        zelle(ws, f"A{z}", nr, h="left")
        zelle(ws, f"B{z}", text)
        zelle(ws, f"C{z}", einheit)
        zelle(ws, f"D{z}", w_mh, "eingabe", F_EIN[fmt], h="right", einzug=1)
        zelle(ws, f"E{z}", w_ta, "eingabe", F_EIN[fmt], h="right", einzug=1)
        zelle(ws, f"F{z}", f"=INDEX($D{z}:$E{z},Projekt_Nr)", "verwendet", F_EIN[fmt], h="right", einzug=1)
        zelle(ws, f"G{z}", quelle, einzug=1)
        rahmen_unten(ws, z, "A", "C", HAAR)
        rahmen_unten(ws, z, "G", "G", HAAR)
        name(wb, nm, "Eingaben", f"$F${z}")
        art = gueltig[0]
        if art == "liste":
            dv = DataValidation(type="list", formula1=gueltig[1], allow_blank=False)
        else:
            dv = DataValidation(type="whole" if art == "ganz" else "decimal", operator="between",
                                formula1=str(gueltig[1]), formula2=str(gueltig[2]), allow_blank=False)
        dv.showErrorMessage = True
        dv.error = dv_meldung(nr, einheit, fmt, gueltig)
        dv.errorTitle = "Eingabe"
        if dv_hinweis(fmt):
            dv.showInputMessage = True
            dv.promptTitle = "Eingabe"
            dv.prompt = dv_hinweis(fmt)
        dv.add(f"D{z}:E{z}")
        ws.add_data_validation(dv)

    # Zeilengliederung: Eingabezeilen Ebene 1, Gruppenzeile darüber, aufgeklappt
    ws.sheet_properties.outlinePr.summaryBelow = False
    starts = [z for z, _ in BLOECKE] + [EINGABE_LETZTE + 1]
    for a, b in zip(starts, starts[1:]):
        ws.row_dimensions.group(a + 1, b - 1, outline_level=1, hidden=False)

    breiten(ws, {"A": 6, "B": 44, "C": 16, "D": 22, "E": 22, "F": 20, "G": 58})
    ws.freeze_panes = "D6"
    ws.sheet_properties.tabColor = GELB
    druck(ws, titelzeilen="4:5", bereich=f"A1:G{EINGABE_LETZTE}", umbrueche=[33])


def blatt_tabellen(wb, ws):
    """Konzept C: RL-2026-Festwerte, Nutzungsdauer; abgesetzt Liegenschaftszins je Projekt (Tabelle 4, Konzept Q)."""
    titel(ws, "Tabellen", "F")
    link(ws, "G1", "Übersicht", "'Übersicht'!A1").alignment = Alignment(horizontal="right")
    zelle(ws, "A2", "Festwerte RL Mietwohnraum 2026 und Bewertung. Bemessungsgrenzen: Ausgangswerte 01.07.2026; "
                    "aktuell auf nbank.de.")

    # Tabelle 1 Förderquoten
    gruppenzeile(ws, 3, "1 Förderquoten", "A", "G", text_spalte="B")
    kopfzeile(ws, 4, {"A": "Nr.", "B": "Festwert", "C": "Einheit", "D": "A", "E": "B", "F": "C", "G": "Quelle"},
              "A", "G", einzug={"G": 2}, rechts=("D", "E", "F"))
    name(wb, "Gruppen", "Tabellen", "$D$4:$F$4")
    for nr, z, text, einheit, a, b, c, quelle, nm in QUOTEN:
        zeile_tabelle(ws, z, nr, text, einheit, [a, b, c], F_PCT1, quelle)
        name(wb, nm, "Tabellen", f"$D${z}:$F${z}")

    # Tabelle 2 Mietenstufen (Quelle einmal, in der ersten Zeile: sie gilt für alle Zeilen)
    gruppenzeile(ws, 7, "2 Mietenstufen, Höchstmiete in €/m² Monat", "A", "G", text_spalte="B")
    kopfzeile(ws, 8, {"A": "Nr.", "B": "Mietenstufe", "C": "Bemessungsgrenze €/m²", "D": "Höchstmiete\nA",
                      "E": "Höchstmiete\nB", "F": "Höchstmiete\nC", "G": "Quelle"}, "A", "G", einzug={"G": 2},
              rechts=("C", "D", "E", "F"))
    for i, (nr, stufe, grenze, ma, mb, mc) in enumerate(MIETENSTUFEN):
        z = 9 + i
        zelle(ws, f"A{z}", nr)
        zelle(ws, f"B{z}", stufe, "wert")
        zelle(ws, f"C{z}", grenze, "wert", F_EUR)
        for s, wv in zip("DEF", (ma, mb, mc)):
            zelle(ws, f"{s}{z}", wv, "wert", F_EUR2)
        zelle(ws, f"G{z}", QUELLE_MIETENSTUFEN if i == 0 else None, einzug=2)
        rahmen_unten(ws, z, "A", "G", HAAR)
    name(wb, "Mietenstufen", "Tabellen", "$B$9:$B$15")
    name(wb, "Bemessungsgrenzen", "Tabellen", "$C$9:$C$15")
    name(wb, "Hoechstmieten", "Tabellen", "$D$9:$F$15")

    # Tabelle 3 Festwerte
    gruppenzeile(ws, 16, "3 Festwerte RL 2026 und ImmoWertV", "A", "G", text_spalte="B")
    kopfzeile(ws, 17, {"A": "Nr.", "B": "Festwert", "C": "Einheit", "D": "Wert", "G": "Quelle"}, "A", "G",
              einzug={"G": 2}, rechts=("D",))
    for nr, z, text, einheit, wv, fmt, quelle, nm in FESTWERTE:
        zeile_tabelle(ws, z, nr, text, einheit, [wv], fmt, quelle)
        name(wb, nm, "Tabellen", f"$D${z}")

    # Tabelle 4 Bewertung, Liegenschaftszins je Projekt (abgesetzt durch mittleren Rahmen): D Projekt 1, E Projekt 2,
    # F „verwendet“ = Spalte des aktiven Projekts (wie auf „Eingaben“); gerechnet wird nur F (Name LZ_Satz).
    # Quelle einmal, in der ersten Zeile: dasselbe Landesmodell für beide Projekte; Standort und Bodenrichtwert in A42.
    gruppenzeile(ws, 34, "4 Bewertung, Liegenschaftszins je Projekt", "A", "G", text_spalte="B")
    rahmen_oben(ws, 34, "A", "G", MITTEL)
    kopfzeile(ws, 35, {"A": "Nr.", "B": "Restnutzungsdauer", "C": "Einheit", "D": "Projekt 1", "E": "Projekt 2",
                       "F": "verwendet", "G": "Quelle"}, "A", "G", einzug={"G": 2}, rechts=("B", "D", "E", "F"))
    for i, (nr, rnd, lz1, lz2) in enumerate(LIEGENSCHAFTSZINS):
        z = 36 + i
        zelle(ws, f"A{z}", nr)
        zelle(ws, f"B{z}", rnd, "wert", F_JAHR, h="right")
        zelle(ws, f"C{z}", "Jahre")
        zelle(ws, f"D{z}", lz1, "wert", F_PCT)
        zelle(ws, f"E{z}", lz2, "wert", F_PCT)
        zelle(ws, f"F{z}", f"=INDEX($D{z}:$E{z},Projekt_Nr)", "verwendet", F_PCT)
        zelle(ws, f"G{z}", QUELLE_LZ if i == 0 else None, einzug=2)
        rahmen_unten(ws, z, "A", "G", HAAR)
    z0, z1 = 36, 35 + len(LIEGENSCHAFTSZINS)
    name(wb, "LZ_RND", "Tabellen", f"$B${z0}:$B${z1}")
    name(wb, "LZ_Satz", "Tabellen", f"$F${z0}:$F${z1}")
    # Spalte des nicht aktiven Projekts abgesetzt wie auf „Eingaben“: Kopf grau, Werte in grauer Schrift
    grau_kopf = PatternFill(start_color="A6A6A6", end_color="A6A6A6", fill_type="solid")
    for sp, nr in (("D", 1), ("E", 2)):
        ws.conditional_formatting.add(f"{sp}35", FormulaRule(formula=[f"Projekt_Nr<>{nr}"], fill=grau_kopf))
        ws.conditional_formatting.add(f"{sp}{z0}:{sp}{z1}",
                                      FormulaRule(formula=[f"Projekt_Nr<>{nr}"], font=Font(color="8C8C8C")))
    for ref, text in LZ_FUSSNOTEN:
        zelle(ws, ref, text)

    # D:F 13: der Kopf „Höchstmiete“ (fett) passt nicht in 12 (Lektorat Nr. 06)
    breiten(ws, {"A": 6, "B": 44, "C": 19, "D:F": 13, "G": 56})
    ws.freeze_panes = "A3"
    druck(ws, bereich="A1:G43", umbrueche=[33])


def zeile_tabelle(ws, z, nr, text, einheit, werte, fmt, quelle):
    zelle(ws, f"A{z}", nr)
    zelle(ws, f"B{z}", text)
    zelle(ws, f"C{z}", einheit)
    for s, wv in zip("DEF", werte):
        zelle(ws, f"{s}{z}", wv, "wert", fmt)
    zelle(ws, f"G{z}", quelle, einzug=2)
    rahmen_unten(ws, z, "A", "G", HAAR)


# ---------------------------------------------------------------------------------------------------
# Gefördert A/B/C (Konzept D.3): zellgleich, die Gruppe steht nur in B2
# ---------------------------------------------------------------------------------------------------
# Zeitreihe: Spalte -> (Kopf Zeile 5, Formel Zeile 6 (t = 0) oder None, Formel ab Zeile 7 mit {r}/{p}, Format,
#                       letzte Zeile)
ZEITREIHE_GEF = [
    ("A", "t", "0", "=A{p}+1", F_JAHR, Z80),
    ("B", "Jahr", "=Bezugsjahr+A6", "=Bezugsjahr+A{r}", F_JAHR, Z80),
    ("C", "Vergleichs-\nmiete", None, "=Vergleichsmiete_1*Stress_Miete*(1+Mietsteigerung)^(A{r}-1)", F_EUR2, Z80),
    ("D", "Marktmiete", None, "=Marktmiete_1*Stress_Miete*(1+Mietsteigerung)^(A{r}-1)", F_EUR2, Z80),
    ("E", "Zielmiete", None, '=IF(Zielmiete="Marktmiete",D{r},C{r})', F_EUR2, Z80),
    ("F", "Miete\ngerechnet", None,
     "=IF(A{r}=1,$H$109,IF(AND(A{r}>Mietruhe_Jahre,MOD(A{r}-1-Mietruhe_Jahre,Erhoehung_Rhythmus)=0),"
     "MAX(F{p},MIN(F{p}*(1+IF(A{r}<=Bindung,Mietanpassung_Bindung,Kappungsgrenze)),"
     "IF(A{r}<=Laufzeit_max,C{r},E{r}))),F{p}))", F_EUR2, Z80),
    ("G", "Sollmiete", None, "=F{r}*Wohnflaeche*12", F_EUR, Z80),
    ("H", "Mietausfall/\nLeerstand", None, "=-Mietausfall*G{r}", F_EUR, Z80),
    ("I", "Objekt-\nverwaltung", None, "=-Verwaltung_WE*Wohneinheiten*(1+Kostensteigerung)^(A{r}-1+Kosten_Vorlauf)",
     F_EUR, Z80),
    ("J", "Instand-\nhaltung", None, "=-Instandhaltung_qm*Wohnflaeche*(1+Kostensteigerung)^(A{r}-1+Kosten_Vorlauf)",
     F_EUR, Z80),
    ("K", "Überschuss\nvor Kapital-\ndienst", None, "=SUM(G{r}:J{r})", F_EUR, Z80),
    ("L", "Verwaltungs-\nkostenbeitrag", None, "=-VKB_Satz*T{p}", F_EUR, Z42),
    ("M", "Zins NBank", None, "=-T{p}*IF(A{r}<=Zinsfreie_Jahre,Zins_NBank_1_35,Zins_NBank_ab36)", F_EUR, Z42),
    ("N", "Tilgung NBank", None, "=-IF(A{r}=Laufzeit_max,T{p},IF(A{r}<=Tilgungsaufschub,0,MIN($H$110,T{p})))",
     F_EUR, Z42),
    ("O", "Zins Bank", None, "=-U{p}*IF(A{r}<=Zinsbindung,Zins_Bank,Zins_Anschluss)", F_EUR, Z42),
    ("P", "Tilgung Bank", None, "=-MAX(0,MIN(IF(A{r}<=Zinsbindung,$H$111,$H$114)+O{r},U{p}))", F_EUR, Z42),
    ("Q", "Kapitaldienst", None, "=SUM(L{r}:P{r})", F_EUR, Z42),
    ("R", "Zahlungs-\nüberschuss", None, "=K{r}+Q{r}", F_EUR, Z42),
    ("S", "DSCR", None, '=IF(-Q{r}>1,K{r}/-Q{r},"")', F_FAKTOR, Z42),
    ("T", "Restschuld NBank", "=$H$99", "=MAX(0,ROUND(T{p}+N{r},2))", F_EUR, Z42),
    ("U", "Restschuld Bank", "=$H$103", "=MAX(0,ROUND(U{p}+P{r},2))", F_EUR, Z42),
    ("V", "Projekt-\nkonto (VOFI)", "=$H$105", "=V{p}*(1+IF(V{p}>=0,Habenzins,Sollzins))+R{r}", F_EUR, Z42),
    ("W", "Zahlungs-\nüberschuss\nkumuliert", "0", "=W{p}+R{r}", F_EUR, Z42),
    ("X", "Überschuss\nzur Zielmiete", None, "=E{r}*Wohnflaeche*12*(1-Mietausfall)+I{r}+J{r}", F_EUR,
     Z80),
]
FETT_SPALTEN_GEF = ("K", "R")          # Ergebnisspalten Überschuss vor Kapitaldienst, Zahlungsüberschuss
GRUPPEN_ZEILE4_GEF = {"A": "Zeit", "C": "Miete", "G": "Ertrag und Bewirtschaftung", "L": "Kapitaldienst",
                      "R": "Ergebnis", "T": "Bestände Jahresende", "X": "Restwert", "Y": "Zahlungsreihen für IRR"}

# Zahlungsreihen für IRR (Konzept D.3), Zeilen 6-48, eine Formel je Spalte auch für t = 0.
# $I$118 = 35 (Bindung), $J$118 = 42 (Laufzeit_max); "" nach dem Stichjahr.
_OBJ_RW = '=IF($A{{r}}>${h}$118,"",${b}{{r}}+IF($A{{r}}=${h}$118,${h}${z},0))'
IRR_GEF = [
    ("Y", "Objekt ohne Zuschuss, ohne Restwert", "=IF($A{r}=0,-$H$94,$K{r})"),
    ("Z", "Objekt ohne Zuschuss, mit Restwert, Jahr 35", _OBJ_RW.format(h="I", b="Y", z=126)),
    ("AA", "Objekt ohne Zuschuss, nur Bodenwert, Jahr 35", _OBJ_RW.format(h="I", b="Y", z=127)),
    ("AB", "Objekt ohne Zuschuss, mit Restwert, Jahr 42", _OBJ_RW.format(h="J", b="Y", z=126)),
    ("AC", "Objekt ohne Zuschuss, nur Bodenwert, Jahr 42", _OBJ_RW.format(h="J", b="Y", z=127)),
    ("AD", "Objekt nach Zuschuss, ohne Restwert", "=IF($A{r}=0,-($H$94-$H$108),$K{r})"),
    ("AE", "Objekt nach Zuschuss, mit Restwert, Jahr 35", _OBJ_RW.format(h="I", b="AD", z=126)),
    ("AF", "Objekt nach Zuschuss, nur Bodenwert, Jahr 35", _OBJ_RW.format(h="I", b="AD", z=127)),
    ("AG", "Objekt nach Zuschuss, mit Restwert, Jahr 42", _OBJ_RW.format(h="J", b="AD", z=126)),
    ("AH", "Objekt nach Zuschuss, nur Bodenwert, Jahr 42", _OBJ_RW.format(h="J", b="AD", z=127)),
    ("AI", "Eigenkapital, ohne Restwert, Jahr 42",
     "=IF($A{r}=0,-$H$106+$H$105,$R{r}-IF($A{r}=$J$118,$T{r}+$U{r},0))"),
    ("AJ", "Eigenkapital, ohne Restwert, Jahr 35",
     '=IF($A{r}>$I$118,"",IF($A{r}=0,$AI{r},$R{r}-IF($A{r}=$I$118,$T{r}+$U{r},0)))'),
    ("AK", "Eigenkapital, mit Restwert, Jahr 35", '=IF($A{r}>$I$118,"",$AJ{r}+IF($A{r}=$I$118,$I$126,0))'),
    ("AL", "Eigenkapital, nur Bodenwert, Jahr 35", '=IF($A{r}>$I$118,"",$AJ{r}+IF($A{r}=$I$118,$I$127,0))'),
    ("AM", "Eigenkapital, mit Restwert, Jahr 42", "=$AI{r}+IF($A{r}=$J$118,$J$126,0)"),
    ("AN", "Eigenkapital, nur Bodenwert, Jahr 42", "=$AI{r}+IF($A{r}=$J$118,$J$127,0)"),
    # Runde 2 (F1): Objekt nach Förderbarwert = Investition abzüglich Zuschuss netto und Barwertvorteil Darlehen
    ("AO", "Objekt, Förderbarwert, ohne Restwert", "=IF($A{r}=0,-($H$94-$H$174),$K{r})"),
    ("AP", "Objekt, Förderbarwert, mit Restwert, Jahr 35", _OBJ_RW.format(h="I", b="AO", z=126)),
    ("AQ", "Objekt, Förderbarwert, nur Bodenwert, Jahr 35", _OBJ_RW.format(h="I", b="AO", z=127)),
    ("AR", "Objekt, Förderbarwert, mit Restwert, Jahr 42", _OBJ_RW.format(h="J", b="AO", z=126)),
    ("AS", "Objekt, Förderbarwert, nur Bodenwert, Jahr 42", _OBJ_RW.format(h="J", b="AO", z=127)),
]
IRR_LETZTE_GEF, IRR_SCHALTER_GEF = "AS", "AT"      # Spaltengliederung Y–AS, Schalter über AT (Spalte 46)

# Block Restwert (Konzept D.3): H = Bezug, I = Jahr 35, J = Jahr 42; {c} = Spalte, Formel je Spalte gleich.
_LZ = ("=IF({c}119<=INDEX(LZ_RND,1),INDEX(LZ_Satz,1),IF({c}119>=INDEX(LZ_RND,COUNT(LZ_RND)),"
       "INDEX(LZ_Satz,COUNT(LZ_RND)),INDEX(LZ_Satz,MATCH({c}119,LZ_RND,1))+({c}119-INDEX(LZ_RND,MATCH({c}119,LZ_RND,1)))"
       "/(INDEX(LZ_RND,MATCH({c}119,LZ_RND,1)+1)-INDEX(LZ_RND,MATCH({c}119,LZ_RND,1)))"
       "*(INDEX(LZ_Satz,MATCH({c}119,LZ_RND,1)+1)-INDEX(LZ_Satz,MATCH({c}119,LZ_RND,1)))))+Stress_LZ")
_EW = ("=SUMPRODUCT(($A$7:$A$86>{{c}}118)*($A$7:$A$86<=GND)*${s}$7:${s}$86"
       "/((1+Mietsteigerung)^($A$7:$A$86-{{c}}118-1)*(1+{{c}}120)^($A$7:$A$86-{{c}}118)))+{{c}}121/(1+{{c}}120)^{{c}}119")
HIJ, IJ, H_ = ("H", "I", "J"), ("I", "J"), ("H",)
RESTWERT_GEF = [  # Zeile, Größe, Einheit, Spalten, Formel mit {c}, Format
    (118, "Stichjahr", "Jahr", HIJ, {"H": 0, "I": "=Bindung", "J": "=Laufzeit_max"}, F_JAHR),
    (119, "Restnutzungsdauer", "Jahre", HIJ, "=GND-{c}118", F_JAHR),
    (120, "Liegenschaftszins", "%", HIJ, _LZ, F_PCT),
    (121, "Bodenwert", "€", HIJ, "=Grundstueck*(1+Bodenwertsteigerung)^{c}118", F_EUR),
    (122, "Ertragswert zur Zielmiete", "€", HIJ, _EW.format(s="X"), F_EUR),
    (123, "Ertragswert zur Bestandsmiete", "€", HIJ, _EW.format(s="K"), F_EUR),
    (124, "Abschlag Bestandsmiete unter Zielmiete", "€", HIJ, "={c}122-{c}123", F_EUR),
    (125, "Gebäudeanteil", "€", HIJ, "={c}123-{c}121", F_EUR),
    (126, "Restwert (Boden + Gebäude)", "€", IJ, "=({c}121+Stress_GebRW*{c}125)*(1-Veraeusserungskosten)", F_EUR),
    (127, "Restwert nur Bodenwert", "€", IJ, "={c}121*(1-Veraeusserungskosten)", F_EUR),
    (128, "Ertragswert Bestand gegenüber Gesamtkosten", "%", H_, "=IF($H$93>0,{c}123/$H$93-1,0)", F_PCT),
    (129, "Ertragswert Zielmiete gegenüber Gesamtkosten", "%", H_, "=IF($H$93>0,{c}122/$H$93-1,0)", F_PCT),
]
FETT_RESTWERT = (126,)

# Block Renditen (Konzept D.3): I = Jahr 35, J = Jahr 42. Sperre E14 vor allen Renditen (Zeilen 133-145, 149, 175-177).
_SPERRE = '=IF($H$105>=1,"n. v.",{f})'
# IRR nach Konvention „größte Nullstelle mit fallendem Barwert“ (Konzept E10, Runde 2 R2):
#   erster Treffer = Startwert-Kaskade (3 % bzw. VOFI, dann −10/−30/−50/−60/−70 %, nur Treffer über −100 %),
#   zweiter Versuch = IRR ab erstem Treffer + 5 Prozentpunkte; beide stehen als Hilfswerte in den gegliederten
#   Spalten der Zahlungsreihen (Gefördert Y–AB, Frei R–U) neben der Kennzahl.
#   Kennzahl = größerer Treffer, wenn der Barwert dort fällt (Barwert bei +0,01 Prozentpunkten < 0), sonst „n. v.“.
IRR_STARTS = ("-0.1", "-0.3", "-0.5", "-0.6", "-0.7")
IRR_SCHRITT, IRR_FALL = "0.05", "0.0001"
HILFE_GEF = {"I": ("Y", "Z"), "J": ("AA", "AB")}          # Hilfswerte je Horizont: erster Treffer, zweiter Versuch


def irr_kaskade(bereich, start0):
    """IFERROR(Versuch(start0), IFERROR(Versuch(-0,1), … "n. v.")); Versuch(s) = IRR, wenn > −100 %, sonst NA()."""
    def versuch(s):
        return f"IF(IRR({bereich},{s})>-1,IRR({bereich},{s}),NA())"
    f = '"n. v."'
    for s in reversed((start0,) + IRR_STARTS):
        f = f"IFERROR({versuch(s)},{f})"
    return f


def _bereich(s, c):
    """IRR-Bereich t = 0 … Stichjahr der Spalte c (I = Jahr 35, J = Jahr 42)."""
    return f"${s}$6:INDEX(${s}$6:${s}$48,{c}$118+1)"


def irr_hilfe(s, c, start0, z, hilfe):
    """Hilfswerte (erster Treffer, zweiter Versuch) für Reihe s, Horizont c, Zeile z."""
    h1, h2 = hilfe[c]
    return {h1: "=" + irr_kaskade(_bereich(s, c), start0),
            h2: f'=IFERROR(IRR({_bereich(s, c)},{h1}{z}+{IRR_SCHRITT}),"n. v.")'}


def irr_kennzahl(s, c, z, hilfe, sperre=True):
    """Kennzahl: größerer Treffer, wenn der Barwert dort fällt; sonst „n. v.“."""
    h1, h2 = hilfe[c]
    paar = f"${h1}{z}:${h2}{z}"
    rest = f"${s}$7:INDEX(${s}$6:${s}$48,{c}$118+1)"
    f = (f'IF(COUNT({paar})=0,"n. v.",IF(${s}$6+NPV(MAX({paar})+{IRR_FALL},{rest})<0,MAX({paar}),"n. v."))')
    return _SPERRE.format(f=f) if sperre else "=" + f


# IRR-Kennzahlen Gefördert: Zeile -> (Reihe Jahr 35, Reihe Jahr 42, Startwert: "obj" = 3 % oder Zeile der VOFI-Rendite)
IRR_ZEILEN_GEF = {133: ("AE", "AG", "obj"), 134: ("AF", "AH", "obj"), 135: ("AD", "AD", "obj"),
                  136: ("Z", "AB", "obj"), 137: ("AA", "AC", "obj"), 138: ("Y", "Y", "obj"),
                  140: ("AK", "AM", 143), 141: ("AL", "AN", 144), 142: ("AJ", "AI", 145),
                  175: ("AP", "AR", "obj"), 176: ("AQ", "AS", "obj"), 177: ("AO", "AO", "obj")}


def _start(c, art):
    return "0.03" if art == "obj" else f"IF(ISNUMBER({c}{art}),{c}{art},0)"


def _irr(z, zeilen=None, hilfe=HILFE_GEF, sperre=True):
    s35, s42, _art = (zeilen or IRR_ZEILEN_GEF)[z]
    return {"I": irr_kennzahl(s35, "I", z, hilfe, sperre), "J": irr_kennzahl(s42, "J", z, hilfe, sperre)}


_VOFI = _SPERRE.format(f='IF(AND({{c}}{z}>0,$H$106>0),({{c}}{z}/$H$106)^(1/{{c}}$118)-1,"n. v.")')
_ENDE = "INDEX(${s}$6:${s}$48,{{c}}$118+1)"
RENDITEN_GEF = [  # Zeile, Kennzahl, Einheit, Spalten, Formel(n) mit {c}, Format
    (133, "Objekt-IRR nach Zuschuss, mit Restwert", "%", IJ, _irr(133), F_PCT),
    (134, "Objekt-IRR nach Zuschuss, nur Bodenwert", "%", IJ, _irr(134), F_PCT),
    (135, "Objekt-IRR nach Zuschuss, ohne Restwert", "%", IJ, _irr(135), F_PCT),
    (136, "Objekt-IRR ohne Zuschuss, mit Restwert", "%", IJ, _irr(136), F_PCT),
    (137, "Objekt-IRR ohne Zuschuss, nur Bodenwert", "%", IJ, _irr(137), F_PCT),
    (138, "Objekt-IRR ohne Zuschuss, ohne Restwert", "%", IJ, _irr(138), F_PCT),
    (139, "Hilfsgröße: Nettoanfangsrendite, statisch", "%", H_, _SPERRE.format(f="IF($H$94>0,K7/$H$94,0)"),
     F_PCT),
    (140, "EK-IRR, mit Restwert", "%", IJ, _irr(140), F_PCT),
    (141, "EK-IRR, nur Bodenwert", "%", IJ, _irr(141), F_PCT),
    (142, "EK-IRR, ohne Restwert", "%", IJ, _irr(142), F_PCT),
    (143, "VOFI-EK-Rendite, mit Restwert", "%", IJ, _VOFI.format(z=146), F_PCT),
    (144, "VOFI-EK-Rendite, nur Bodenwert", "%", IJ, _VOFI.format(z=147), F_PCT),
    (145, "VOFI-EK-Rendite, ohne Restwert", "%", IJ, _VOFI.format(z=148), F_PCT),
    (146, "Endvermögen VOFI, mit Restwert", "€", IJ,
     "=" + _ENDE.format(s="V") + "+{c}126-" + _ENDE.format(s="T") + "-" + _ENDE.format(s="U"), F_EUR),
    (147, "Endvermögen VOFI, nur Bodenwert", "€", IJ,
     "=" + _ENDE.format(s="V") + "+{c}127-" + _ENDE.format(s="T") + "-" + _ENDE.format(s="U"), F_EUR),
    (148, "Endvermögen VOFI, ohne Restwert", "€", IJ,
     "=" + _ENDE.format(s="V") + "-" + _ENDE.format(s="T") + "-" + _ENDE.format(s="U"), F_EUR),
    (149, "Restwertanteil am Endvermögen", "%", IJ, _SPERRE.format(f='IF({c}146>0,{c}126/{c}146,"n. v.")'),
     F_PCT),
    (150, "Projektkonto (VOFI)", "€", IJ, "=" + _ENDE.format(s="V"), F_EUR),
    (151, "Restschuld NBank und Bank", "€", IJ, "=" + _ENDE.format(s="T") + "+" + _ENDE.format(s="U"), F_EUR),
]
# Block Förderbarwert (Runde 2, F1): Zuschuss netto + Barwertvorteil Darlehen; Objekt-IRR nach Förderbarwert
FOERDER_GEF = [
    (174, "Förderbarwert (Zuschuss + Barwertvorteil)", "€", H_, "=H108+H168", F_EUR),
    (175, "Objekt-IRR nach Förderbarwert, mit Restwert", "%", IJ, _irr(175), F_PCT),
    (176, "Objekt-IRR nach Förderbarwert, nur Bodenwert", "%", IJ, _irr(176), F_PCT),
    (177, "Objekt-IRR nach Förderbarwert, ohne Restwert", "%", IJ, _irr(177), F_PCT),
]
FETT_FOERDER = (174, 175)
# Block Miete für das DSCR-Ziel (Konzept N): Zeilen 179-183 auf Gefördert A/B/C und Frei gleich. Nötige Miete Jahr 1 =
# (DSCR-Ziel × Kapitaldienst Jahr 1 + Objektverwaltung + Instandhaltung Jahr 1) ÷ ((1 − Mietausfall) × Wohnfläche × 12).
# Gefördert mit Tilgungsaufschub (Eingabe 3.2 > 0): Kapitaldienst Jahr 1 zuzüglich Regeltilgung NBank (H110), damit die
# nötige Miete den Kapitaldienst auch nach dem Aufschub trägt.
# {kd} = Spalte Kapitaldienst, {vw}/{ih} = Spalten Objektverwaltung/Instandhaltung (Auszahlungen negativ).
_NOETIG = "=(H181*H182-{vw}7-{ih}7)/((1-Mietausfall)*Wohnflaeche*12)"


def miete_dscr(kd, vw, ih, regel="", text182="Kapitaldienst Jahr 1"):
    return [(181, "DSCR-Ziel", "Faktor", "=DSCR_Ziel", F_FAKTOR),
            (182, text182, "€", f"=-{kd}7{regel}", F_EUR),
            (183, "Nötige Miete Jahr 1 für das DSCR-Ziel", "€/m² Monat", _NOETIG.format(vw=vw, ih=ih), F_EUR2)]


MIETE_DSCR_GEF = miete_dscr("Q", "I", "J", "+IF(Tilgungsaufschub>0,$H$110,0)", "Kapitaldienst Jahr 1, mit Regeltilgung")
FETT_MIETE_DSCR = (183,)
GEF_LETZTE = 183
FETT_RENDITEN = (133, 140, 143)

# Block Liquidität (Konzept D.3): Wert in H
LIQUIDITAET = [
    (155, "Zahlungsüberschuss Jahr 1", "€", "=R7", F_EUR),
    (156, "DSCR Jahr 1", "Faktor", '=IF(ISNUMBER(S7),S7,"–")', F_FAKTOR),
    (157, "DSCR Minimum Jahr 1–35", "Faktor",
     '=IF(COUNT($S$7:INDEX($S$7:$S$48,Bindung))=0,"–",MIN($S$7:INDEX($S$7:$S$48,Bindung)))', F_FAKTOR),
    (158, "Jahre mit Fehlbetrag, Jahr 1–35", "Jahre", '=COUNTIF($R$7:INDEX($R$7:$R$48,Bindung),"<0")', F_ANZ),
    (159, "Größter kumulierter Fehlbetrag, Jahr 1–42", "€", "=MIN(0,MIN($W$7:$W$48))", F_EUR),
    (160, "Zahlungsüberschuss vor NBank-Tilgung, Jahr 1", "€", "=R7-N7", F_EUR),
    (161, "Tragbare Tilgung Jahr 1", "%", "=IF($H$99>0,H160/$H$99,0)", F_PCT),
    (162, "Restschuld NBank Ende Jahr 35", "€", "=INDEX($T$6:$T$48,Bindung+1)", F_EUR),
    (163, "Summe Tilgung NBank", "€", "=-SUM($N$7:$N$48)", F_EUR),
    (164, "Schlussrate NBank über Regeltilgung", "€", "=MAX(0,-INDEX($N$7:$N$48,Laufzeit_max)-$H$110)", F_EUR),
    (165, "Zahlungsüberschuss Jahr 10", "€", "=INDEX($R$7:$R$48,10)", F_EUR),
    (166, "Zahlungsüberschuss Jahr 35", "€", "=INDEX($R$7:$R$48,Bindung)", F_EUR),
    (167, "Zahlungsüberschuss Jahr 42", "€", "=INDEX($R$7:$R$48,Laufzeit_max)", F_EUR),
    (168, "Barwertvorteil NBank-Darlehen", "€",
     "=$H$99*(1-BE_Darlehen)+SUMPRODUCT(($L$7:$L$48+$M$7:$M$48+$N$7:$N$48)/(1+Zins_Bank)^$A$7:$A$48)", F_EUR),
    (169, "Tiefster Stand Projektkonto (VOFI)", "€", "=MIN($V$6:$V$48)", F_EUR),
    (170, "Restschuld Bank Ende Jahr 42", "€", "=INDEX($U$6:$U$48,Laufzeit_max+1)", F_EUR),
]
FETT_LIQUIDITAET = (155,)

# Block Finanzierung bei Bezug (Konzept D.3): Zeile -> (Größe, Einheit, Formel in H, Format)
FINANZIERUNG = [
    (90, "Herstellungskosten KG 200–700, angesetzt", "€", "=Herstellungskosten_qm*Wohnflaeche*Stress_KG", F_EUR),
    (91, "Finanzierungskosten KG 800", "€", "=KG_800", F_EUR),
    (92, "Grundstück (Sacheinlage)", "€", "=Grundstueck", F_EUR),
    (93, "Gesamtkosten", "€", "=H90+H91+H92", F_EUR),
    (94, "Objektinvestition (ohne KG 800)", "€", "=H90+H92", F_EUR),
    (95, "Bemessungsgrenze", "€/m²", "=INDEX(Bemessungsgrenzen,MATCH(Mietenstufe,Mietenstufen,0))", F_EUR),
    (96, "Zuwendungsfähige Kosten", "€",
     "=MIN(H90,H95*Wohnflaeche)+IF(Bodenrichtwert*Grundstuecksflaeche>0,"
     "MIN(H92,Bodenrichtwert*Grundstuecksflaeche),H92)", F_EUR),
    (97, "Darlehensquote", "%", "=INDEX(Quote_Darlehen,MATCH($B$2,Gruppen,0))", F_PCT1),
    (98, "Zuschussquote", "%", "=INDEX(Quote_Zuschuss,MATCH($B$2,Gruppen,0))", F_PCT1),
    (99, "NBank-Darlehen", "€", "=H96*H97", F_EUR),
    (100, "Zuschuss", "€", "=H96*H98", F_EUR),
    (101, "Bearbeitungsentgelte", "€", "=H99*BE_Darlehen+H100*BE_Zuschuss", F_EUR),
    (102, "Mindest-Eigenmittel bar (20 % − Grundstück)", "€", "=MAX(0,Eigenmittelquote*H96-H92)", F_EUR),
    (103, "Bankdarlehen (Restfinanzierung)", "€", "=MAX(0,ROUND(H90-H99-H100-H102-EK_Zusatz,2))", F_EUR),
    (104, "Bares Eigenkapital (Restgröße)", "€", "=MAX(0,H90+H91+H101-H99-H100-H103)", F_EUR),
    (105, "Kasse bei Bezug", "€", "=ROUND(H99+H100+H103+H104-H90-H91-H101,2)", F_EUR),
    (106, "Eigenkapital (Grundstück + bar)", "€", "=H92+H104", F_EUR),
    (107, "Eigenmittelquote, ohne Entgelte", "%", "=IF(H96>0,(H92+H104-H101)/H96,0)", F_PCT1),
    (108, "Zuschuss nach Bearbeitungsentgelt", "€", "=H100*(1-BE_Zuschuss)", F_EUR),
    (109, "Miete Jahr 1", "€/m² Monat",
     "=MIN(INDEX(Hoechstmieten,MATCH(Mietenstufe,Mietenstufen,0),MATCH($B$2,Gruppen,0))"
     '+IF(Effizienz_EH40="ja",Zuschlag_EH40,0),D7)', F_EUR2),
    (110, "Regeltilgung NBank", "€ p. a.", "=Tilgung_NBank*H99", F_EUR),
    (111, "Annuität Bank", "€ p. a.", "=IF(H103>0,PMT(Zins_Bank,Laufzeit_Bank,-H103),0)", F_EUR),
    (112, "Restschuld Bank Ende Zinsbindung", "€",
     "=IF(H103>0,MAX(0,-FV(Zins_Bank,MIN(Zinsbindung,Laufzeit_Bank),-H111,H103)),0)", F_EUR),
    (113, "Anfangstilgung Bankdarlehen", "%", "=IF(H103>0,H111/H103-Zins_Bank,0)", F_PCT),
    (114, "Annuität Bank nach Zinsbindung", "€ p. a.",
     "=IF(H112<1,0,IF(Laufzeit_Bank<=Zinsbindung,H112,PMT(Zins_Anschluss,Laufzeit_Bank-Zinsbindung,-H112)))", F_EUR),
]

# Frei finanziert (Konzept D.4, N): Mindest-Eigenmittel wie gefördert zuzüglich Eingabe 7.1, Rest Bankdarlehen;
# Miete laut Eingabe 10.1.
# Bank, Projektkonto, Zahlungsreihen und Kennzahlen mit den Formeln der Blätter Gefördert (andere Spalten, ohne NBank).
_KOSTEN_VW = "=-Verwaltung_WE*Wohneinheiten*(1+Kostensteigerung)^(A{r}-1+Kosten_Vorlauf)"
_KOSTEN_IH = "=-Instandhaltung_qm*Wohnflaeche*(1+Kostensteigerung)^(A{r}-1+Kosten_Vorlauf)"
ZEITREIHE_FREI = [
    ("A", "t", "0", "=A{p}+1", F_JAHR, Z80),
    ("B", "Jahr", "=Bezugsjahr+A6", "=Bezugsjahr+A{r}", F_JAHR, Z80),
    ("C", "Marktmiete", None, "=Marktmiete_1*Stress_Miete*(1+Mietsteigerung)^(A{r}-1)", F_EUR2, Z80),
    ("D", "Miete\ngerechnet", None, "=$H$109*(1+Mietsteigerung)^(A{r}-1)", F_EUR2, Z80),
    ("E", "Sollmiete", None, "=D{r}*Wohnflaeche*12", F_EUR, Z80),
    ("F", "Mietausfall/\nLeerstand", None, "=-Mietausfall*E{r}", F_EUR, Z80),
    ("G", "Objekt-\nverwaltung", None, _KOSTEN_VW, F_EUR, Z80),
    ("H", "Instand-\nhaltung", None, _KOSTEN_IH, F_EUR, Z80),
    ("I", "Überschuss\nvor Kapital-\ndienst", None, "=SUM(E{r}:H{r})", F_EUR, Z80),
    ("J", "Zins Bank", None, "=-O{p}*IF(A{r}<=Zinsbindung,Zins_Bank,Zins_Anschluss)", F_EUR, Z42),
    ("K", "Tilgung Bank", None, "=-MAX(0,MIN(IF(A{r}<=Zinsbindung,$H$111,$H$114)+J{r},O{p}))", F_EUR, Z42),
    ("L", "Kapitaldienst", None, "=SUM(J{r}:K{r})", F_EUR, Z42),
    # Zahlungsüberschuss auf Cent: Die Miete für DSCR-Ziel 1,0 stellt Jahr 1 rechnerisch auf 0 (kein Rechenrest)
    ("M", "Zahlungs-\nüberschuss", None, "=ROUND(I{r}+L{r},2)", F_EUR, Z42),
    ("N", "DSCR", None, '=IF(-L{r}>1,I{r}/-L{r},"")', F_FAKTOR, Z42),
    ("O", "Restschuld Bank", "=$H$103", "=MAX(0,ROUND(O{p}+K{r},2))", F_EUR, Z42),
    ("P", "Projekt-\nkonto (VOFI)", "=$H$105", "=P{p}*(1+IF(P{p}>=0,Habenzins,Sollzins))+M{r}", F_EUR, Z42),
    ("Q", "Zahlungs-\nüberschuss\nkumuliert", "0", "=Q{p}+M{r}", F_EUR, Z42),
]
FETT_SPALTEN_FREI = ("I", "M")
FREI_ZEIT_LETZTE = "Q"
# Zahlungsreihen für IRR in R–AB (gegliedert, zugeklappt), Blöcke darunter in A–J
GRUPPEN_ZEILE4_FREI = {"A": "Zeit", "C": "Miete", "E": "Ertrag und Bewirtschaftung", "J": "Kapitaldienst",
                       "M": "Ergebnis", "O": "Bestände Jahresende", "R": "Zahlungsreihen für IRR"}
_FREI_RW = '=IF($A{{r}}>${h}$118,"",$R{{r}}+IF($A{{r}}=${h}$118,${h}${z},0))'
IRR_FREI = [
    ("R", "Objekt, ohne Restwert", "=IF($A{r}=0,-$H$94,$I{r})"),
    ("S", "Objekt, mit Restwert, Jahr 35", _FREI_RW.format(h="I", z=126)),
    ("T", "Objekt, nur Bodenwert, Jahr 35", _FREI_RW.format(h="I", z=127)),
    ("U", "Objekt, mit Restwert, Jahr 42", _FREI_RW.format(h="J", z=126)),
    ("V", "Objekt, nur Bodenwert, Jahr 42", _FREI_RW.format(h="J", z=127)),
    ("W", "Eigenkapital, ohne Restwert, Jahr 42", "=IF($A{r}=0,-$H$106+$H$105,$M{r}-IF($A{r}=$J$118,$O{r},0))"),
    ("X", "Eigenkapital, ohne Restwert, Jahr 35",
     '=IF($A{r}>$I$118,"",IF($A{r}=0,$W{r},$M{r}-IF($A{r}=$I$118,$O{r},0)))'),
    ("Y", "Eigenkapital, mit Restwert, Jahr 35", '=IF($A{r}>$I$118,"",$X{r}+IF($A{r}=$I$118,$I$126,0))'),
    ("Z", "Eigenkapital, nur Bodenwert, Jahr 35", '=IF($A{r}>$I$118,"",$X{r}+IF($A{r}=$I$118,$I$127,0))'),
    ("AA", "Eigenkapital, mit Restwert, Jahr 42", "=$W{r}+IF($A{r}=$J$118,$J$126,0)"),
    ("AB", "Eigenkapital, nur Bodenwert, Jahr 42", "=$W{r}+IF($A{r}=$J$118,$J$127,0)"),
]
IRR_ERSTE_FREI, IRR_LETZTE_FREI, IRR_SCHALTER_FREI = "R", "AB", "AC"      # Schalter über AC (Spalte 29)
HILFE_FREI = {"I": ("R", "S"), "J": ("T", "U")}
IRR_ZEILEN_FREI = {136: ("S", "U", "obj"), 137: ("T", "V", "obj"), 138: ("R", "R", "obj"),
                   140: ("Y", "AA", 143), 141: ("Z", "AB", 144), 142: ("X", "W", 145)}
# Finanzierung frei: Zeilen wie Gefördert; ohne NBank-Darlehen, Zuschuss und Entgelte (Zeilen 97-101, 108, 110 leer)
_FIN = {z: (t, e, f, fmt) for z, t, e, f, fmt in FINANZIERUNG}
FINANZIERUNG_FREI = [(z, *_FIN[z]) for z in (90, 91, 92, 93, 94, 95, 96, 102)] + [
    (103, _FIN[103][0], "€", "=MAX(0,ROUND(H90-H102-EK_Zusatz,2))", F_EUR),
    (104, _FIN[104][0], "€", "=MAX(0,H90+H91-H103)", F_EUR),
    (105, _FIN[105][0], "€", "=ROUND(H103+H104-H90-H91,2)", F_EUR),
    (106, *_FIN[106]),
    (107, "Eigenmittelquote (zuwendungsfähige Kosten)", "%", "=IF(H96>0,(H92+H104)/H96,0)", F_PCT1),
    (109, "Miete Jahr 1", "€/m² Monat", '=IF(Miete_Frei="Marktmiete",C7,H183)', F_EUR2),
] + [(z, *_FIN[z]) for z in (111, 112, 113, 114)]
# Restwert frei: Ertragswert zur gerechneten Miete (Spalte I); ohne Dubletten (kein Abschlag, Wert vor = nach)
_FREI_ERSATZ = {122: ("Ertragswert zur gerechneten Miete", _EW.format(s="I")), 125: ("Gebäudeanteil", "={c}122-{c}121"),
                128: ("Ertragswert gegenüber Gesamtkosten", "=IF($H$93>0,{c}122/$H$93-1,0)")}
RESTWERT_FREI = [(z, _FREI_ERSATZ[z][0], e, sp, _FREI_ERSATZ[z][1], fmt) if z in _FREI_ERSATZ
                 else (z, txt, e, sp, f, fmt) for z, txt, e, sp, f, fmt in RESTWERT_GEF if z not in (123, 124, 129)]


def _irr_frei(z):
    return _irr(z, IRR_ZEILEN_FREI, HILFE_FREI, sperre=False)


# Renditen frei: Zeilen wie Gefördert, ohne Sperre (Kasse bei Bezug ist 0: bares Eigenkapital ist die Restgröße)
_VOFI_FREI = '=IF(AND({{c}}{z}>0,$H$106>0),({{c}}{z}/$H$106)^(1/{{c}}$118)-1,"n. v.")'
_EV_FREI = "=" + _ENDE.format(s="P") + "{rw}-" + _ENDE.format(s="O")
RENDITEN_FREI = [
    (136, "Objekt-IRR, mit Restwert", "%", IJ, _irr_frei(136), F_PCT),
    (137, "Objekt-IRR, nur Bodenwert", "%", IJ, _irr_frei(137), F_PCT),
    (138, "Objekt-IRR, ohne Restwert", "%", IJ, _irr_frei(138), F_PCT),
    (139, "Hilfsgröße: Nettoanfangsrendite, statisch", "%", H_, "=IF($H$94>0,I7/$H$94,0)", F_PCT),
    (140, "EK-IRR, mit Restwert", "%", IJ, _irr_frei(140), F_PCT),
    (141, "EK-IRR, nur Bodenwert", "%", IJ, _irr_frei(141), F_PCT),
    (142, "EK-IRR, ohne Restwert", "%", IJ, _irr_frei(142), F_PCT),
    (143, "VOFI-EK-Rendite, mit Restwert", "%", IJ, _VOFI_FREI.format(z=146), F_PCT),
    (144, "VOFI-EK-Rendite, nur Bodenwert", "%", IJ, _VOFI_FREI.format(z=147), F_PCT),
    (145, "VOFI-EK-Rendite, ohne Restwert", "%", IJ, _VOFI_FREI.format(z=148), F_PCT),
    (146, "Endvermögen VOFI, mit Restwert", "€", IJ, _EV_FREI.replace("{rw}", "+{c}126"), F_EUR),
    (147, "Endvermögen VOFI, nur Bodenwert", "€", IJ, _EV_FREI.replace("{rw}", "+{c}127"), F_EUR),
    (148, "Endvermögen VOFI, ohne Restwert", "€", IJ, _EV_FREI.replace("{rw}", ""), F_EUR),
    (149, "Restwertanteil am Endvermögen", "%", IJ, '=IF({c}146>0,{c}126/{c}146,"n. v.")', F_PCT),
    (150, "Projektkonto (VOFI)", "€", IJ, "=" + _ENDE.format(s="P"), F_EUR),
    (151, "Restschuld Bank", "€", IJ, "=" + _ENDE.format(s="O"), F_EUR),
]
FETT_RENDITEN_FREI = (136, 140, 143)
LIQUIDITAET_FREI = [
    (155, "Zahlungsüberschuss Jahr 1", "€", "=M7", F_EUR),
    (156, "DSCR Jahr 1", "Faktor", '=IF(ISNUMBER(N7),N7,"–")', F_FAKTOR),
    (157, "DSCR Minimum Jahr 1–35", "Faktor",
     '=IF(COUNT($N$7:INDEX($N$7:$N$48,Bindung))=0,"–",MIN($N$7:INDEX($N$7:$N$48,Bindung)))', F_FAKTOR),
    (158, "Jahre mit Fehlbetrag, Jahr 1–35", "Jahre", '=COUNTIF($M$7:INDEX($M$7:$M$48,Bindung),"<0")', F_ANZ),
    (159, "Größter kumulierter Fehlbetrag, Jahr 1–42", "€", "=MIN(0,MIN($Q$7:$Q$48))", F_EUR),
    (165, "Zahlungsüberschuss Jahr 10", "€", "=INDEX($M$7:$M$48,10)", F_EUR),
    (166, "Zahlungsüberschuss Jahr 35", "€", "=INDEX($M$7:$M$48,Bindung)", F_EUR),
    (167, "Zahlungsüberschuss Jahr 42", "€", "=INDEX($M$7:$M$48,Laufzeit_max)", F_EUR),
    (169, "Tiefster Stand Projektkonto (VOFI)", "€", "=MIN($P$6:$P$48)", F_EUR),
    (170, "Restschuld Bank Ende Jahr 42", "€", "=INDEX($O$6:$O$48,Laufzeit_max+1)", F_EUR),
]
# Miete für das DSCR-Ziel frei: wie Gefördert, dazu Marktmiete und Aufschläge (Zeilen 184-186); Aufschlag „–“ bei
# Marktmiete 0 (Eingabe 4.4 = 0)
MIETE_DSCR_FREI = miete_dscr("L", "G", "H") + [
    (184, "Marktmiete Jahr 1", "€/m² Monat", "=C7", F_EUR2),
    (185, "Aufschlag Miete Jahr 1 gegenüber Marktmiete", "%", '=IF(H184>0,H109/H184-1,"–")', F_PCT),
    (186, "Aufschlag nötige Miete gegenüber Marktmiete", "%", '=IF(H184>0,H183/H184-1,"–")', F_PCT),
]
FREI_LETZTE = 186
# Aufschlag der gerechneten Miete auf die Marktmiete in den Gruppenzeilen Restwert (116) und Renditen (131)
FREI_AUFSCHLAG_TEXT, FREI_AUFSCHLAG_ZEILEN = "Aufschlag Miete gegenüber Marktmiete", (116, 131)
# Zeilen ohne Inhalt auf Frei (NBank-Größen, Dubletten, Förderbarwert): ausgeblendet
FREI_AUSGEBLENDET = (97, 98, 99, 100, 101, 108, 110, 123, 124, 129, 133, 134, 135, 160, 161, 162, 163, 164, 168,
                     172, 173, 174, 175, 176, 177, 178)

HINWEIS_ZEITREIHE = "Zeitreihe: € p. a., Mieten €/m² Monat, Auszahlungen negativ; ab Jahr 43 nur für Restwert."


def zeitreihe(ws, spalten, fett_spalten, letzte_spalte, bis_t):
    """Schreibt die Zeitreihe (Zeile 6 = t 0). Formeln je Spalte ab Zeile 7 einheitlich."""
    for s, kopf, f0, f, fmt, letzte in spalten:
        ende = min(letzte, Z0 + bis_t)
        if f0 is not None:
            wert = int(f0) if f0.lstrip("-").isdigit() else f0
            zelle(ws, f"{s}{Z0}", wert, "formel" if isinstance(wert, str) else "wert", fmt,
                  fett=s in fett_spalten)
        for r in range(Z0 + 1, ende + 1):
            zelle(ws, f"{s}{r}", f.format(r=r, p=r - 1), "formel", fmt, fett=s in fett_spalten)
    # Rahmen: Haarlinie je Datenzeile, mittlere Linie zwischen t = 42 und t = 43
    for r in range(Z0, Z0 + bis_t + 1 if bis_t < 80 else Z80 + 1):
        rahmen_unten(ws, r, "A", letzte_spalte, HAAR)
    if bis_t >= 42:
        rahmen_unten(ws, Z42, "A", letzte_spalte, MITTEL)


def irr_spalten(ws, spalten, bis_t):
    """Zahlungsreihen für IRR (Zeilen 6-48), eine Formel je Spalte einschließlich t = 0."""
    ende = min(Z42, Z0 + bis_t)
    for s, _kopf, f in spalten:
        for r in range(Z0, ende + 1):
            zelle(ws, f"{s}{r}", f.format(r=r, p=r - 1), "formel", F_EUR)
    erste, letzte = spalten[0][0], spalten[-1][0]
    for r in range(Z0, ende + 1):
        rahmen_unten(ws, r, erste, letzte, HAAR)
    if bis_t >= 42:
        rahmen_unten(ws, Z42, erste, letzte, MITTEL)


def kopf_zeitreihe(ws, titeltext, titel_bis, kopf_bis, gruppen4, koepfe, links):
    """Kopf Zeilen 1-5: Titel (verbunden bis titel_bis = Breite der ersten Druckseite), Projekt, Sprunglinks
    (Zeile 2 rechts neben dem Projektnamen), Hinweis, Gruppen, Spaltenköpfe."""
    titel(ws, titeltext, titel_bis)
    zelle(ws, "C2", "Projekt")
    zelle(ws, "D2", "=Aktives_Projekt", "formel", fett=True)
    for s, text, ziel in links:
        link(ws, f"{s}2", text, ziel)
    zelle(ws, "A3", HINWEIS_ZEITREIHE)
    for i in range(1, ord_spalte(kopf_bis) + 1):
        s = get_column_letter(i)
        zelle(ws, f"{s}4", gruppen4.get(s), "gruppe")
    kopfzeile(ws, 5, koepfe, "A", kopf_bis, hoehe=56,
              rechts=[get_column_letter(i) for i in range(1, ord_spalte(kopf_bis) + 1)])
    ws.freeze_panes = "C6"


def block(ws, gruppen_zeile, gruppen_text, kopf, zeilen, fett=(), bis="J"):
    """Block unter der Zeitreihe: Beschriftung in A (läuft über B-F), Einheit G, Werte H/I/J.
    zeilen: (Zeile, Text, Einheit, Spalten, Formel oder {Spalte: Formel}, Format); Formeln mit {c} = Spalte."""
    gruppenzeile(ws, gruppen_zeile, gruppen_text, "A", bis)
    kopfzeile(ws, gruppen_zeile + 1, kopf, "A", bis, umbruch=False, rechts=("H", "I", "J"), hoehe=18)
    for z, text, einheit, spalten, formel, fmt in zeilen:
        zelle(ws, f"A{z}", text, fett=z in fett)
        zelle(ws, f"G{z}", einheit)
        for c in spalten:
            f = formel[c] if isinstance(formel, dict) else formel
            if isinstance(f, str):
                zelle(ws, f"{c}{z}", f.format(c=c), "formel", fmt, fett=z in fett, h="right")
            else:
                zelle(ws, f"{c}{z}", f, "fest", fmt, fett=z in fett, h="right")
        rahmen_unten(ws, z, "A", bis, HAAR)


def irr_hilfswerte(ws, zeilen, hilfe, kopf_gruppe):
    """Hilfswerte der Nullstellensuche (Konzept E10) in den gegliederten Spalten der Zahlungsreihen, Zeile für Zeile
    neben der Kennzahl. kopf_gruppe: [(Gruppenzeile, Kopfzeile)]."""
    spalten = [hilfe["I"][0], hilfe["I"][1], hilfe["J"][0], hilfe["J"][1]]
    koepfe = ["Jahr 35: erster Treffer", "Jahr 35: zweiter Versuch", "Jahr 42: erster Treffer",
              "Jahr 42: zweiter Versuch"]
    for gz, kz in kopf_gruppe:
        for k, sp in enumerate(spalten):
            zelle(ws, f"{sp}{gz}", "Nullstellensuche IRR" if k == 0 else None, "gruppe")
        kopfzeile(ws, kz, dict(zip(spalten, koepfe)), spalten[0], spalten[-1], hoehe=18, umbruch=False,
                  rechts=spalten)
    for z, (s35, s42, art) in zeilen.items():
        for c, sr in (("I", s35), ("J", s42)):
            for ref, f in irr_hilfe(sr, c, _start(c, art), z, hilfe).items():
                zelle(ws, f"{ref}{z}", f, "formel", F_PCT, h="right")
        rahmen_unten(ws, z, spalten[0], spalten[-1], HAAR)


KOPF_WERT = {"A": "Größe", "G": "Einheit", "H": "Wert"}
KOPF_RESTWERT = {"A": "Größe", "G": "Einheit", "H": "Bezug", "I": "Jahr 35", "J": "Jahr 42"}
KOPF_RENDITEN = {"A": "Kennzahl", "G": "Einheit", "H": "Jahr 1", "I": "Jahr 35", "J": "Jahr 42"}


def _finanzierung_zeilen(liste):
    return [(z, text, einheit, H_, formel, fmt) for z, text, einheit, formel, fmt in liste]


def blatt_gefoerdert(wb, ws, gruppe, bis_t):
    koepfe = {s: kopf for s, kopf, *_ in ZEITREIHE_GEF}
    koepfe.update({s: kopf for s, kopf, _f in IRR_GEF})
    kopf_zeitreihe(ws, f"Gefördert {gruppe}: Zeitreihe und Ergebnisse", "J", IRR_LETZTE_GEF, GRUPPEN_ZEILE4_GEF,
                   koepfe,
                   [("H", "Übersicht", "'Übersicht'!A1"),
                    ("I", "Finanzierung", f"'{ws.title}'!A88"),
                    ("J", "Restwert", f"'{ws.title}'!A116"),
                    ("K", "Renditen", f"'{ws.title}'!A131"),
                    ("L", "Liquidität", f"'{ws.title}'!A153"),
                    ("M", "Förderbarwert", f"'{ws.title}'!A172"),
                    ("N", "DSCR-Ziel", f"'{ws.title}'!A179")])
    zelle(ws, "A2", "Gruppe")
    zelle(ws, "B2", gruppe, "wert", fett=True, h="center")
    for s, _k, _f in IRR_GEF:                 # Köpfe der Zahlungsreihen zentriert (mehrzeilig)
        ws[f"{s}5"].alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    zeitreihe(ws, ZEITREIHE_GEF, FETT_SPALTEN_GEF, "X", bis_t)
    irr_spalten(ws, IRR_GEF, bis_t)
    block(ws, 88, "Finanzierung bei Bezug", KOPF_WERT, _finanzierung_zeilen(FINANZIERUNG), fett=(106,))
    block(ws, 116, "Restwert (Ertragswert)", KOPF_RESTWERT, RESTWERT_GEF, fett=FETT_RESTWERT)
    block(ws, 131, "Renditen vor Steuern", KOPF_RENDITEN, RENDITEN_GEF, fett=FETT_RENDITEN)
    block(ws, 153, "Liquidität", KOPF_WERT, _finanzierung_zeilen(LIQUIDITAET), fett=FETT_LIQUIDITAET)
    block(ws, 172, "Förderbarwert und Objektrendite", KOPF_RESTWERT, FOERDER_GEF, fett=FETT_FOERDER)
    block(ws, 179, "Miete für das DSCR-Ziel", KOPF_WERT, _finanzierung_zeilen(MIETE_DSCR_GEF), fett=FETT_MIETE_DSCR)
    irr_hilfswerte(ws, IRR_ZEILEN_GEF, HILFE_GEF, [(131, 132), (172, 173)])
    # Breiten (Lektorat Nr. 06): A 8 („Gruppe“ neben B2), L 14 (Kopf „Verwaltungs-↵kostenbeitrag“), M 13 (Link
    # „Förderbarwert“ neben N2), Q 13 (Kopf „Kapitaldienst“), Zahlungsreihen 15 (Köpfe mit „Förderbarwert,“ in vier Zeilen)
    breiten(ws, {"A": 8, "B": 7, "C:F": 11, "G:K": 13, "L": 14, "M": 13, "N:P": 12, "Q:R": 13, "S": 8, "T:X": 14,
                 f"Y:{IRR_LETZTE_GEF}": 15})
    # Zahlungsreihen und Nullstellensuche Y-AS: Spaltengliederung Ebene 1, zugeklappt (Schalter über Spalte AT)
    ws.column_dimensions.group("Y", IRR_LETZTE_GEF, outline_level=1, hidden=True)
    ws.column_dimensions[IRR_SCHALTER_GEF].collapsed = True
    # t = 43 … 80 (nur Restwert-Hilfswerte): Zeilengliederung, zugeklappt (Schalter an Zeile 48 = t 42)
    ws.sheet_properties.outlinePr.summaryBelow = False
    ws.row_dimensions.group(Z42 + 1, Z80, outline_level=1, hidden=True)
    ws.row_dimensions[Z42].collapsed = True
    # Druck: Zeitreihe in zwei Bereichen (A–J | K–X, Spalten A:B wiederholt), Blöcke A–J; eine Seite breit.
    # Wiederholt werden nur Zeile 2:3 (Gruppe, Projekt, Einheiten), nicht der Zeitreihenkopf (Runde 2, V4).
    # Der zweite Bereich beginnt in Zeile 2: Der Titel aus A1 bräche dort nach den Wiederholspalten A:B ab (Lektorat Nr. 07).
    druck(ws, titelzeilen="2:3", bereich=DRUCK_GEF, umbrueche=UMBRUCH_GEF, titelspalten="A:B")
    ws.page_setup.pageOrder = "overThenDown"


def blatt_frei(wb, ws, bis_t):
    koepfe = {s: kopf for s, kopf, *_ in ZEITREIHE_FREI}
    koepfe.update({s: kopf for s, kopf, _f in IRR_FREI})
    kopf_zeitreihe(ws, "Frei finanziert: Zeitreihe und Ergebnisse", "I", IRR_LETZTE_FREI, GRUPPEN_ZEILE4_FREI,
                   koepfe,
                   [("H", "Übersicht", "'Übersicht'!A1"),
                    ("I", "Finanzierung", f"'{ws.title}'!A88"),
                    ("J", "Restwert", f"'{ws.title}'!A116"),
                    ("K", "Renditen", f"'{ws.title}'!A131"),
                    ("L", "Liquidität", f"'{ws.title}'!A153"),
                    ("M", "DSCR-Ziel", f"'{ws.title}'!A179")])
    for s, _k, _f in IRR_FREI:                # Köpfe der Zahlungsreihen zentriert (mehrzeilig)
        ws[f"{s}5"].alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    zeitreihe(ws, ZEITREIHE_FREI, FETT_SPALTEN_FREI, FREI_ZEIT_LETZTE, bis_t)
    irr_spalten(ws, IRR_FREI, bis_t)
    block(ws, 88, "Finanzierung bei Bezug", KOPF_WERT, _finanzierung_zeilen(FINANZIERUNG_FREI), fett=(106,))
    block(ws, 116, "Restwert (Ertragswert)", KOPF_RESTWERT, RESTWERT_FREI, fett=FETT_RESTWERT)
    block(ws, 131, "Renditen vor Steuern", KOPF_RENDITEN, RENDITEN_FREI, fett=FETT_RENDITEN_FREI)
    block(ws, 153, "Liquidität", KOPF_WERT, _finanzierung_zeilen(LIQUIDITAET_FREI), fett=FETT_LIQUIDITAET)
    block(ws, 179, "Miete für das DSCR-Ziel", KOPF_WERT, _finanzierung_zeilen(MIETE_DSCR_FREI), fett=FETT_MIETE_DSCR)
    irr_hilfswerte(ws, IRR_ZEILEN_FREI, HILFE_FREI, [(131, 132)])
    # Aufschlag der gerechneten Miete auf die Marktmiete bei den Renditen (Gruppenzeile: Bezeichnung und Zahl)
    for r in FREI_AUFSCHLAG_ZEILEN:
        zelle(ws, f"I{r}", FREI_AUFSCHLAG_TEXT, "gruppe", h="right")
        c = zelle(ws, f"J{r}", "=H185", "formel", F_AUFSCHLAG_FREI, fett=True, h="right")
        c.fill = fuellung(GRUPPE)
    for r in FREI_AUSGEBLENDET:               # leer (Zeilen wie Gefördert), ausgeblendet
        ws.row_dimensions[r].hidden = True
    # Breiten wie Gefördert (Lektorat Nr. 06): A 8, L 13 (Kopf „Kapitaldienst“), Zahlungsreihen 15
    breiten(ws, {"A": 8, "B": 7, "C:D": 11, "E:I": 13, "J:K": 12, "L:M": 13, "N": 8, "O:Q": 13,
                 f"{IRR_ERSTE_FREI}:{IRR_LETZTE_FREI}": 15})
    # Zahlungsreihen und Nullstellensuche R–AB: Spaltengliederung, zugeklappt (Schalter über AC); t = 43 … 80 zugeklappt
    ws.column_dimensions.group(IRR_ERSTE_FREI, IRR_LETZTE_FREI, outline_level=1, hidden=True)
    ws.column_dimensions[IRR_SCHALTER_FREI].collapsed = True
    ws.sheet_properties.outlinePr.summaryBelow = False
    ws.row_dimensions.group(Z42 + 1, Z80, outline_level=1, hidden=True)
    ws.row_dimensions[Z42].collapsed = True
    # Druck: Zeitreihe A–Q auf einer Seite, Blöcke auf zwei Seiten (Umbruch nach Zeile 129), gleicher Maßstab
    druck(ws, titelzeilen="2:3", bereich=DRUCK_FREI, umbrueche=UMBRUCH_FREI)


# ---------------------------------------------------------------------------------------------------
# Übersicht (Konzept D.5): Spalten A Nr., B Kennzahl, C Einheit/Satz, D-G A/B/C/Frei (bzw. Jahr 35),
# H-K A/B/C/Frei Jahr 42, L Bemerkung. Blöcke ohne Horizont (1-4, 8): Bemerkung in H (H-K dort leer, Runde 2 V6).
# Nicht zutreffende Frei-Zellen bleiben leer.
# ---------------------------------------------------------------------------------------------------
MINUS = "−"
GEF_ABC = ("A", "B", "C")
FREI_BLATT = "'Frei finanziert'!"


def _x(g):
    return f"'Gefördert {g}'!"


STRICH = "–"
# Block 1 Projekt und Finanzierung bei Bezug: Zeile, Nr., Bezeichnung, Einheit, Formel mit {x}, Frei (G) oder None,
# Format, Bemerkung (Spalte H)
UEB_BLOCK1 = [
    (9, "1.1", "Gesamtkosten", "€", "={x}H93", "=" + FREI_BLATT + "H93", F_EUR, None),
    (10, "1.2", "Zuwendungsfähige Kosten", "€", "={x}H96", None, F_EUR, None),
    (11, "1.3", "Herstellung über Bemessungsgrenze", "€", "=MAX(0,{x}H90-{x}H95*Wohnflaeche)", None, F_EUR,
     "nicht zuwendungsfähig"),
    (12, "1.4", "Grundstück über Bodenrichtwert × Fläche", "€",
     "=IF(Bodenrichtwert*Grundstuecksflaeche>0,MAX(0,Grundstueck-Bodenrichtwert*Grundstuecksflaeche),0)", None,
     F_EUR, "Deckel nur für die Förderbemessung"),
    (13, "1.5", "NBank-Darlehen", "€", "={x}H99", None, F_EUR, None),
    (14, "1.6", "Zuschuss", "€", "={x}H100", None, F_EUR, None),
    (15, "1.7", "Förderung gesamt", "€", "={x}H99+{x}H100", None, F_EUR, "Darlehen + Zuschuss"),
    (16, "1.8", "Förderquote auf Gesamtkosten", "%", "=IF({x}H93>0,({x}H99+{x}H100)/{x}H93,0)", None, F_PCT1,
     None),
    (17, "1.9", "Förderbarwert (Zuschuss + Barwertvorteil)", "€", "={x}H174", None, F_EUR,
     "Zuschuss nach Entgelt; Barwertvorteil steigt mit Eingabe 6.1"),
    (18, "1.10", "Bankdarlehen", "€", "={x}H103", "=" + FREI_BLATT + "H103", F_EUR,
     "Restfinanzierung; Frei: Rest nach 1.11. Konditionen: Eingabe 6.1–6.4"),
    (19, "1.11", "Eigenmittel (RL Nr. 5.2.6), ohne Entgelte", "€", "={x}H106-{x}H101", "=" + FREI_BLATT + "H106",
     F_EUR, "Frei: Mindest-Eigenmittel wie gefördert zuzüglich Eingabe 7.1"),
    (20, "1.12", "Eigenmittelquote", "%", "={x}H107", "=" + FREI_BLATT + "H107", F_PCT1,
     "mindestens 20 % der zuwendungsfähigen Kosten (1.2)"),
    (21, "1.13", "Bearbeitungsentgelte, einmalig", "€", "={x}H101", None, F_EUR, None),
    (22, "1.14", "Eigenkapital (Grundstück + bar)", "€", "={x}H106", "=" + FREI_BLATT + "H106", F_EUR,
     "Eigenmittel + Entgelte"),
    (23, "1.15", "davon bar", "€", "={x}H104", "=" + FREI_BLATT + "H104", F_EUR, None),
    (24, "1.16", "Zuschuss je Wohnung", "€", "=IF(Wohneinheiten>0,{x}H100/Wohneinheiten,0)", None, F_EUR, None),
    (25, "1.17", "Eigenmittel je Wohnung", "€", "=IF(Wohneinheiten>0,({x}H106-{x}H101)/Wohneinheiten,0)", None,
     F_EUR, None),
    (26, "1.18", "Miete Jahr 1", "€/m² Monat", "={x}H109", "=" + FREI_BLATT + "H109", F_EUR2,
     "Frei laut Eingabe 10.1"),
]
# Block 2 Jahresrechnung Jahr 1 (wie Broschüre S. 11): Zeile, Nr., Bezeichnung, Satz (Formel, Format), Formel {x},
# Format, Bemerkung, fett. Sätze 2 und 3 fortgeschrieben laut Eingabe 5.5 (Satz × Menge = Betrag).
_FORTGESCHRIEBEN = "*(1+Kostensteigerung)^Kosten_Vorlauf"
UEB_BLOCK2 = [
    (29, "1", "Sollmiete: Höchstmiete nettokalt", None, "={x}G7", F_EUR, "Schema wie Broschüre S. 11; Frei: Miete laut 1.18",
     False),
    (30, "", MINUS + " Mietausfall/Leerstand", ("=Mietausfall", F_PCT), "=-{x}H7", F_EUR_KOST, "der Sollmiete", False),
    (31, "2", MINUS + " Objektverwaltung", ("=Verwaltung_WE" + _FORTGESCHRIEBEN, F_SATZ_VW), "=-{x}I7", F_EUR_KOST,
     "Stand 2026 + Eingabe 5.5 Jahre; Betriebskosten umgelegt", False),
    (32, "3", MINUS + " Instandhaltung", ("=Instandhaltung_qm" + _FORTGESCHRIEBEN, F_SATZ_IH), "=-{x}J7", F_EUR_KOST,
     "Stand 2026 + Eingabe 5.5 Jahre", False),
    (33, "4", "= Überschuss vor Kapitaldienst", None, "={x}K7", F_EUR, None, True),
    (34, "5", MINUS + " Verwaltungskostenbeitrag", ("=VKB_Satz", F_PCT), "=-{x}L7", F_EUR_KOST, "des Restkapitals",
     False),
    (35, "6", MINUS + " Zins NBank-Darlehen", ("=Zins_NBank_1_35", F_PCT0), "=-{x}M7", F_EUR_KOST, "bis Ende Jahr 35",
     False),
    (36, "7", MINUS + " Tilgung NBank-Darlehen (Annahme)", ("=Tilgung_NBank", F_PCT), "=-{x}N7", F_EUR_KOST,
     "Satz legt die NBank fest", False),
    (37, "", MINUS + " Kapitaldienst Bankdarlehen", None, "=-({x}O7+{x}P7)", F_EUR_KOST,
     "gefördert nur bei Restfinanzierung",
     False),
    (38, "8", "= Zahlungsüberschuss p. a.", None, "={x}R7", F_EUR, None, True),
    (39, "", "Einmalig: Bearbeitungsentgelte", None, "={x}H101", F_EUR, "nicht in Zeile 8", False),
]
# Frei in der Jahresrechnung (Spalte G): Zeile -> Formel; Zeilen der NBank (34-36, 39) bleiben leer
UEB_BLOCK2_FREI = {29: "={f}E7", 30: "=-{f}F7", 31: "=-{f}G7", 32: "=-{f}H7", 33: "={f}I7", 37: "=-({f}J7+{f}K7)",
                   38: "={f}M7"}
# Block 3 Liquidität: Zeile, Nr., Bezeichnung, Einheit, Formel mit {x}, Format, Bemerkung
UEB_BLOCK3 = [
    (42, "3.1", "Zahlungsüberschuss Jahr 10", "€", "={x}H165", F_EUR, None),
    (43, "3.2", "Zahlungsüberschuss Jahr 35", "€", "={x}H166", F_EUR, None),
    (44, "3.3", "Zahlungsüberschuss Jahr 42", "€", "={x}H167", F_EUR, None),
    (45, "3.4", "Schuldendienstdeckung (DSCR) Jahr 1", "Faktor", "={x}H156", F_FAKTOR,
     "Zeile 4 ÷ Kapitaldienst; nötige Miete: 8.3"),
    (46, "3.5", "DSCR Minimum Jahr 1–35", "Faktor", "={x}H157", F_FAKTOR, None),
    (47, "3.6", "Jahre mit Fehlbetrag, Jahr 1–35", "Jahre", "={x}H158", F_ANZ, None),
    (48, "3.7", "Größter kumulierter Fehlbetrag, Jahr 1–42", "€", "={x}H159", F_EUR, "unverzinst"),
    (49, "3.8", "Tragbare Tilgung Jahr 1", "%", "=MAX(0,{x}H161)", F_PCT,
     "Tilgung, bei der Zeile 8 = 0; „–“: schon ohne Tilgung negativ"),
    (50, "3.9", "Restschuld NBank Ende Jahr 35", "€", "={x}H162", F_EUR, None),
    (51, "3.10", "Schlussrate NBank über Regeltilgung", "€", "={x}H164", F_EUR, "Rest wird in Jahr 42 getilgt"),
    (52, "3.11", "Restschuld Bank Ende Jahr 42", "€", "={x}H170", F_EUR, "bei Laufzeit über 42 Jahre (Eingabe 6.4)"),
]
# Frei in Block 3 (Spalte G): Zeilen der NBank (49-51) bleiben leer
UEB_BLOCK3_FREI = {42: 165, 43: 166, 44: 167, 45: 156, 46: 157, 47: 158, 48: 159, 52: 170}
# Block 4 Tilgungssatz: Rasterwerte B55:B61 (feste Hilfswerte, Anzeige „Tilgung x %“, B59 = Volltilgung in 42 Jahren),
# B62 = Eingabe 3.1 (eingeklappt)
UEB_KOPF4, UEB_RASTER_ERSTE = 54, 55
RASTER = [0.0, 0.01, 0.015, 0.02, "=1/Laufzeit_max", 0.025, 0.03]
RASTER_BEM = {0: "vor Tilgung", 4: "Volltilgung in 42 Jahren", len(RASTER): "= Zeile 8, wenn kein Aufschub"}
UEB_RASTER_EINGABE = UEB_RASTER_ERSTE + len(RASTER)            # 62
_H160, _H99 = "$H$160", "$H$99"


def _schwelle(g1, g0):
    return (f"=IFERROR(({_x(g1)}{_H160}-{_x(g0)}{_H160})/({_x(g1)}{_H99}-{_x(g0)}{_H99}),\"–\")")


def _diff(z):
    return {"D": STRICH, "E": f"=E{z}-D{z}", "F": f"=F{z}-D{z}"}


# Vergleich der Gruppen (Rechenweg Broschüre S. 12): Zeile, Nr., Bezeichnung, Einheit, {Spalte: Formel}, Format,
# Bemerkung. Schwellen sichtbar, Rechenweg darunter eingeklappt.
UEB_BLOCK4_VERGLEICH = [
    (63, "4.9", "Tilgungsschwelle B gegenüber A", "%", {"E": _schwelle("B", "A")}, F_PCT,
     "Rechenweg wie Broschüre S. 12"),
    (64, "4.10", "Tilgungsschwelle C gegenüber A", "%", {"F": _schwelle("C", "A")}, F_PCT, None),
    (65, "4.11", "Tilgungsschwelle C gegenüber B", "%", {"F": _schwelle("C", "B")}, F_PCT, None),
    (66, "4.12", "Mehrschuld gegenüber A", "€",
     {"D": STRICH, "E": f"={_x('B')}{_H99}-{_x('A')}{_H99}", "F": f"={_x('C')}{_H99}-{_x('A')}{_H99}"}, F_EUR, None),
    (67, "4.13", "Mehr-Sollmiete p. a.", "€", _diff(29), F_EUR, None),
    (68, "4.14", MINUS + " Mietausfall/Leerstand", "€", _diff(30), F_EUR_KOST, None),
    (69, "4.15", MINUS + " Verwaltungskostenbeitrag", "€", _diff(34), F_EUR_KOST, None),
    (70, "4.16", "= Mehrüberschuss vor Tilgung", "€",
     {"D": STRICH, "E": f"={_x('B')}{_H160}-{_x('A')}{_H160}", "F": f"={_x('C')}{_H160}-{_x('A')}{_H160}"}, F_EUR,
     "Schwelle = 4.16 ÷ 4.12"),
    (71, "4.17", "Mehrüberschuss bei Tilgung laut Eingabe 3.1", "€", _diff(UEB_RASTER_EINGABE), F_EUR,
     "4.8: B − A, C − A"),
    (72, "4.18", "Einmalig: Mehr an Bearbeitungsentgelten", "€", _diff(39), F_EUR, None),
]
# Blöcke 5-7 mit Horizont: Gruppenzeile, Text, Kopf G/K „Frei“
UEB_GRUPPEN_H = [(74, "Objektrendite vor Steuern", True), (87, "Eigenkapitalrendite vor Steuern", True),
                 (98, "Restwert (Ertragswert)", True)]
# Zeile, Nr., Bezeichnung, Einheit, Zeile auf Gefördert (I/J bzw. H), Frei: Zeile (I/J bzw. H) oder None (leer),
# Format, Bemerkung (Spalte L), nur_bezug (Wert aus Spalte H, nur D-G)
_NULLST = "nicht eindeutig: Hinweis 11"
UEB_HORIZONT = [
    (76, "5.1", "Objekt-IRR nach Förderbarwert, mit Restwert", "%", 175, 136, F_PCT,
     "Frei ohne Förderung; Förderbarwert 1.9", False),
    (77, "5.2", "Objekt-IRR nach Förderbarwert, nur Bodenwert", "%", 176, 137, F_PCT, None, False),
    (78, "5.3", "Objekt-IRR nach Zuschuss, mit Restwert", "%", 133, 136, F_PCT, "ohne Barwertvorteil des Darlehens",
     False),
    (79, "5.4", "Objekt-IRR ohne Zuschuss, mit Restwert", "%", 136, 136, F_PCT, "Abstand zu Frei (Marktmiete): Bindung",
     False),
    (80, "5.5", "Objekt-IRR nach Förderbarwert, ohne Restwert", "%", 177, 138, F_PCT, _NULLST, False),
    (81, "5.6", "Objekt-IRR nach Zuschuss, nur Bodenwert", "%", 134, 137, F_PCT, None, False),
    (82, "5.7", "Objekt-IRR nach Zuschuss, ohne Restwert", "%", 135, 138, F_PCT, _NULLST, False),
    (83, "5.8", "Objekt-IRR ohne Zuschuss, nur Bodenwert", "%", 137, 137, F_PCT, None, False),
    (84, "5.9", "Objekt-IRR ohne Zuschuss, ohne Restwert", "%", 138, 138, F_PCT, _NULLST, False),
    (85, "5.10", "Hilfsgröße: Nettoanfangsrendite, statisch", "% (Jahr 1)", 139, None, F_PCT,
     "ohne Zuschuss, ohne Restwert", True),
    (89, "6.1", "EK-IRR, mit Restwert", "%", 140, 140, F_PCT, None, False),
    (90, "6.2", "EK-IRR, nur Bodenwert", "%", 141, 141, F_PCT, _NULLST, False),
    (91, "6.3", "VOFI-EK-Rendite, mit Restwert", "%", 143, 143, F_PCT, "Kontozinsen laut Eingabe 7.2/7.3", False),
    (92, "6.4", "VOFI-EK-Rendite, nur Bodenwert", "%", 144, 144, F_PCT, "„n. v.“: Endvermögen ≤ 0", False),
    (93, "6.5", "Restwertanteil am Endvermögen", "%", 149, 149, F_PCT,
     "über 100 %: Konto − Restschuld < 0", False),
    (94, "6.6", "EK-IRR, ohne Restwert", "%", 142, 142, F_PCT, _NULLST, False),
    (95, "6.7", "VOFI-EK-Rendite, ohne Restwert", "%", 145, 145, F_PCT, None, False),
    # sichtbar unter den eingeklappten Zeilen 94-95: Wert aus Spalte H (Zeile 169 der Blätter), ein Wert je Variante
    (96, "6.8", "Tiefster Stand Projektkonto (VOFI)", "€ (Jahr 0–42)", 169, 169, F_EUR,
     "negativ: Sollzins laut Eingabe 7.3", True),
    (100, "7.1", "Restwert (Boden + Gebäude)", "€", 126, 126, F_EUR, "nach Eingabe 8.3 und 9.4", False),
    (101, "7.2", "Bodenwert", "€", 121, 121, F_EUR, None, False),
    (102, "7.3", "Gebäudeanteil", "€", 125, 125, F_EUR, None, False),
    (103, "7.4", "Ertragswert Bestand gegenüber Gesamtkosten", "% (Bezug)", 128, 128, F_PCT,
     "negativ: unter Gesamtkosten", True),
    (104, "7.5", "Ertragswert zur Bestandsmiete", "€", 123, 122, F_EUR, "Frei: zur gerechneten Miete", False),
    (105, "7.6", "Abschlag Bestandsmiete unter Zielmiete", "€", 124, None, F_EUR, None, False),
    (106, "7.7", "Liegenschaftszins", "%", 120, 120, F_PCT, "Standort je Projekt: Tabellen, Tabelle 4", False),
    (107, "7.8", "Ertragswert Zielmiete gegenüber Gesamtkosten", "% (Bezug)", 129, None, F_PCT,
     "nachrichtlich", True),
]
FETT_UEB = (76, 89, 91, 100)
# Block 8 Miete für das DSCR-Ziel (Konzept N): Zeile, Nr., Bezeichnung, Einheit, Zelle auf Gefördert (oder None),
# Zelle auf Frei, Format, Bemerkung (Spalte H)
UEB_KOPF8 = 109
UEB_BLOCK8 = [
    (110, "8.1", "DSCR-Ziel", "Faktor", "H181", "H181", F_FAKTOR, "Eingabe 10.2"),
    (111, "8.2", "Kapitaldienst Jahr 1, mit Regeltilgung", "€", "H182", "H182", F_EUR,
     "Zeilen 5 bis 7 und Bankdarlehen; bei Aufschub (Eingabe 3.2) mit Regeltilgung NBank"),
    (112, "8.3", "Nötige Miete Jahr 1 für das DSCR-Ziel", "€/m² Monat", "H183", "H183", F_EUR2,
     "deckt in Jahr 1 DSCR-Ziel × Kapitaldienst, Mietausfall und die Zeilen 2 und 3"),
    (113, "8.4", "Miete Jahr 1, gerechnet", "€/m² Monat", "H109", "H109", F_EUR2, "wie 1.18"),
    (114, "8.5", "Aufschlag Miete Jahr 1 gegenüber Marktmiete", "%", None, "H185", F_PCT,
     "Frei: gerechnete Miete laut Eingabe 10.1"),
    (115, "8.6", "Aufschlag nötige Miete gegenüber Marktmiete", "%", None, "H186", F_PCT,
     "Frei ohne Bankdarlehen: 8.3 deckt nur die Zeilen 2 und 3"),
]
FETT_BLOCK8 = (112,)
# Aufschlag der gerechneten Frei-Miete bei Renditen und Restwert: Gruppenzeilen Block 5, 6 und 7, Spalte L
UEB_AUFSCHLAG_ZEILEN = (74, 87, 98)
# dieselbe Zahl auf Seite 1, ebenfalls in Spalte L (die Bemerkungen dieser Zeilen in H enden vor L): 1.18 Miete Jahr 1,
# Zeile 8 der Jahresrechnung, 3.1 Liquidität
UEB_AUFSCHLAG_SEITE1 = (26, 38, 42)
# Abstandszeilen zwischen den Blöcken: 6 pt wie auf dem Blatt NBank (Seite 2 passt so auch nach der Breitenregel von
# Excel auf eine Druckseite, Konzept G.4)
UEB_ABSTAND, UEB_ABSTAND_HOEHE = (7, 27, 40, 53, 73, 86, 97, 108, 116), 6
# Block 9 Prüfungen P1-P6 (Konzept F.1), sichtbar: Status in C, Kasse bei Bezug A/B/C in D118:F118.
# Jede Prüfung in IFERROR: ein Fehlerwert ergibt „prüfen“ (Runde 2, R1).
UEB_PRUEF_KOPF, UEB_PRUEF_ERSTE, UEB_LETZTE = 117, 118, 123
_IRR_MIT_RW = (133, 136, 140, 143, 175)       # Renditen mit Restwert je Blatt Gefördert (P4)
_IRR_MIT_RW_FREI = (136, 140, 143)           # Renditen mit Restwert auf Frei finanziert (P4)
_EIN_A, _EIN_Z = f"${EINGABE_ERSTE}", f"${EINGABE_LETZTE}"
PRUEFUNGEN = [
    (118, "P1", "Keine Überfinanzierung bei Bezug",
     "AND(" + ",".join(f"{_x(g)}H105<1" for g in GEF_ABC) + ")"),
    (119, "P2", "Eingabe 4.1, 4.2, 8.2, 10.1: Auswahl gültig",
     'AND(COUNTIF(Mietenstufen,Mietenstufe)=1,OR(Effizienz_EH40="ja",Effizienz_EH40="nein"),'
     'OR(Zielmiete="Marktmiete",Zielmiete="Vergleichsmiete"),'
     'OR(Miete_Frei="Marktmiete",Miete_Frei="Miete für DSCR-Ziel"))'),
    (120, "P3", "Bank: Anfangstilgung mind. 1 % (RL Nr. 5.3.6)",
     "AND(" + ",".join(f"OR({_x(g)}H103<1,{_x(g)}H113>=Tilgung_Bank_min-0.00005)" for g in GEF_ABC) + ")"),
    (121, "P4", "Renditen mit Restwert berechnet",
     "AND(" + ",".join([f"COUNT({_x(g)}I{z}:J{z})=2" for g in GEF_ABC for z in _IRR_MIT_RW]
                       + [f"COUNT({FREI_BLATT}I{z}:J{z})=2" for z in _IRR_MIT_RW_FREI]) + ")"),
    (122, "P5", "Gebäudeanteil am Restwert positiv",
     "MIN(" + ",".join(f"{_x(g)}I125:J125" for g in GEF_ABC) + "," + FREI_BLATT + "I125:J125)>0"),
    (123, "P6", "Eingaben vollständig",
     f"IF(Projekt_Nr=1,SUMPRODUCT((LEN(Eingaben!$A{_EIN_A}:$A{_EIN_Z})>0)*(LEN(Eingaben!$D{_EIN_A}:$D{_EIN_Z})=0)),"
     f"SUMPRODUCT((LEN(Eingaben!$A{_EIN_A}:$A{_EIN_Z})>0)*(LEN(Eingaben!$E{_EIN_A}:$E{_EIN_Z})=0)))=0"),
]
# Zeilengliederung Übersicht: Nebenwerte und Details eingeklappt (Schalter an der Zeile darüber)
UEB_EINGEKLAPPT = [(12, 12), (23, 23), (50, 52), (62, 62), (66, 72), (80, 85), (94, 95), (104, 107)]
# Bemerkungen im Prüfblock (Spalte H): P4 und P5 prüfen auch Frei finanziert
PRUEF_BEMERKUNG = {"P1": "Kasse bei Bezug in €", "P4": "A, B, C und Frei; „n. v.“: Hinweis 11",
                   "P5": "A, B, C und Frei (Miete laut Eingabe 10.1)"}
UEB_KOPFZEILEN = {8: "Projekt und Finanzierung bei Bezug", 28: "Jahresrechnung Jahr 1, in € p. a.",
                  41: "Liquidität", UEB_KOPF4: "Zahlungsüberschuss Jahr 1 je Tilgungssatz",
                  UEB_KOPF8: "Miete für das DSCR-Ziel"}
UEB_RECHTS = tuple("DEFGHIJK")


def ueb_kopf(ws, zeile, texte, mitte=(), hoehe=20):
    bem = "L" if "L" in texte else "H"
    kopfzeile(ws, zeile, texte, "A", "L", einzug={bem: 1}, rechts=[s for s in UEB_RECHTS if s not in mitte + (bem,)],
              mitte=mitte, hoehe=hoehe)
    if bem == "H":
        # „Bemerkung“ ist mit Einzug breiter als Spalte H (12): ohne Umbruch läuft der Kopf in die leeren Zellen I–L
        # (mit Umbruch trennte Excel im Wort, Lektorat Nr. 05)
        ws[f"H{zeile}"].alignment = Alignment(horizontal="left", vertical="center", wrap_text=False, indent=1)


def ueb_text(ws, r, nr, text, einheit, bemerkung, fett=False, bem_spalte="H"):
    zelle(ws, f"A{r}", nr if nr else None)
    if text is not None:
        zelle(ws, f"B{r}", text, fett=fett)
    if einheit is not None:
        zelle(ws, f"C{r}", einheit)
    if bemerkung:
        zelle(ws, f"{bem_spalte}{r}", bemerkung, einzug=1)
    rahmen_unten(ws, r, "A", "L", HAAR)


def ueb_wert(ws, ref, v, fmt, fett=False):
    """Wertzelle D-K: Formel (schwarz bzw. grün bei reinem Verweis) oder Strich, rechtsbündig; None = leer."""
    if v is None:
        return
    if isinstance(v, str) and v.startswith("="):
        zelle(ws, ref, v, "formel", fmt, fett=fett, h="right")
    else:
        zelle(ws, ref, v, "text", fmt, fett=fett, h="right")


def blatt_uebersicht(wb, ws):
    titel(ws, "VOFI Mietwohnraum 2026: Übersicht", "L")
    zelle(ws, "B2", "Aktives Projekt", fett=True)
    zelle(ws, "D2", "=Aktives_Projekt", "formel", fett=True)
    link(ws, "H2", "Projekt wählen", "'Eingaben'!D3")
    link(ws, "B3", "Prüfungen", f"'Übersicht'!A{UEB_PRUEF_KOPF}")
    bereich = f"$C${UEB_PRUEF_ERSTE}:$C${UEB_LETZTE}"
    zelle(ws, "D3", f'=IF(COUNTIF({bereich},"OK")=ROWS({bereich}),"OK","prüfen")', "formel", fett=True)
    zelle(ws, "B4", "Konventionen")
    zelle(ws, "D4", "vor Steuern, nominal, Jahr 0 = Bezugsfertigkeit; Zeitreihen: Auszahlungen < 0")
    zelle(ws, "B5", "Legende")
    zelle(ws, "D5", "Ändern nur auf „Eingaben“ (blau auf Gelb). Grün: von anderem Blatt. „–“: 0 oder kein Wert. "
                    "Mehr Zeilen: + links.")
    zelle(ws, "B6", "Blätter")
    for i, b in enumerate(BLAETTER[1:]):
        link(ws, f"{get_column_letter(4 + i)}6", b, f"'{b}'!A1").alignment = Alignment(horizontal="center")
    rahmen_unten(ws, 6, "A", "L", DUENN)
    abc = {"A": "Nr.", "C": "Einheit", "D": "A", "E": "B", "F": "C", "H": "Bemerkung"}

    # Block 1 Projekt und Finanzierung bei Bezug
    ueb_kopf(ws, 8, dict(abc, B=UEB_KOPFZEILEN[8], G="Frei"))
    for r, nr, text, einheit, f, frei, fmt, bem in UEB_BLOCK1:
        ueb_text(ws, r, nr, text, einheit, bem)
        for s, g in zip("DEF", GEF_ABC):
            ueb_wert(ws, f"{s}{r}", f.format(x=_x(g)), fmt)
        ueb_wert(ws, f"G{r}", frei, fmt)

    # Block 2 Jahresrechnung Jahr 1
    ueb_kopf(ws, 28, dict(abc, A="Zeile", B=UEB_KOPFZEILEN[28], C="Satz", G="Frei"))
    for r, nr, text, satz, f, fmt, bem, fett in UEB_BLOCK2:
        ueb_text(ws, r, nr, text, None, bem, fett=fett)
        if satz:
            zelle(ws, f"C{r}", satz[0], "formel", satz[1], h="right")
        for s, g in zip("DEF", GEF_ABC):
            ueb_wert(ws, f"{s}{r}", f.format(x=_x(g)), fmt, fett=fett)
        if r in UEB_BLOCK2_FREI:
            ueb_wert(ws, f"G{r}", UEB_BLOCK2_FREI[r].format(f=FREI_BLATT), fmt, fett=fett)
        if fett:
            rahmen_oben(ws, r, "B", "G", ERGEBNIS_LINIE)

    # Block 3 Liquidität
    ueb_kopf(ws, 41, dict(abc, B=UEB_KOPFZEILEN[41], G="Frei"))
    for r, nr, text, einheit, f, fmt, bem in UEB_BLOCK3:
        ueb_text(ws, r, nr, text, einheit, bem)
        for s, g in zip("DEF", GEF_ABC):
            ueb_wert(ws, f"{s}{r}", f.format(x=_x(g)), fmt)
        if r in UEB_BLOCK3_FREI:
            ueb_wert(ws, f"G{r}", f"={FREI_BLATT}H{UEB_BLOCK3_FREI[r]}", fmt)

    # Block 4 Tilgungssatz: Zahlungsüberschuss Jahr 1 je Tilgungssatz (Tilgung ab Jahr 1), Vergleich der Gruppen
    ueb_kopf(ws, UEB_KOPF4, dict(abc, B=UEB_KOPFZEILEN[UEB_KOPF4], G="höchster Überschuss"), mitte=("G",), hoehe=27)
    for k, ts in enumerate(RASTER + ["=Tilgung_NBank"]):
        r = UEB_RASTER_ERSTE + k
        ueb_text(ws, r, f"4.{k + 1}", None, "€", RASTER_BEM.get(k))
        zelle(ws, f"B{r}", ts, "formel" if isinstance(ts, str) else "fest",
              F_TILG_E if r == UEB_RASTER_EINGABE else F_TILG, h="left")
        for s, g in zip("DEF", GEF_ABC):
            ueb_wert(ws, f"{s}{r}", f"={_x(g)}$H$160-$B{r}*{_x(g)}$H$99", F_EUR)
        kopf = f"$D${UEB_KOPF4}:$F${UEB_KOPF4}"
        ueb_wert(ws, f"G{r}", f"=INDEX({kopf},MATCH(MAX(D{r}:F{r}),D{r}:F{r},0))", None)
        ws[f"G{r}"].alignment = Alignment(horizontal="center")
    for r, nr, text, einheit, formeln, fmt, bem in UEB_BLOCK4_VERGLEICH:
        ueb_text(ws, r, nr, text, einheit, bem)
        for s, f in formeln.items():
            ueb_wert(ws, f"{s}{r}", f, fmt)
    rahmen_oben(ws, UEB_BLOCK4_VERGLEICH[0][0], "B", "G", ERGEBNIS_LINIE)

    # Block 5-7 mit Horizont Jahr 35 (D-G) und Jahr 42 (H-K)
    for gz, text, mit_frei in UEB_GRUPPEN_H:
        gruppenzeile(ws, gz, text, "A", "L", text_spalte="B")
        zelle(ws, f"D{gz}", "Jahr 35", "gruppe")
        zelle(ws, f"H{gz}", "Jahr 42", "gruppe")
        frei = "Frei" if mit_frei else None
        ueb_kopf(ws, gz + 1, {"A": "Nr.", "B": "Kennzahl", "C": "Einheit", "D": "A", "E": "B", "F": "C", "G": frei,
                              "H": "A", "I": "B", "J": "C", "K": frei, "L": "Bemerkung"})
    for r, nr, text, einheit, z, zf, fmt, bem, nur_bezug in UEB_HORIZONT:
        fett = r in FETT_UEB
        ueb_text(ws, r, nr, text, einheit, bem, fett=fett, bem_spalte="L")
        for k, g in enumerate(GEF_ABC):
            if nur_bezug:
                ueb_wert(ws, f"{'DEF'[k]}{r}", f"={_x(g)}H{z}", fmt, fett)
            else:
                ueb_wert(ws, f"{'DEF'[k]}{r}", f"={_x(g)}I{z}", fmt, fett)
                ueb_wert(ws, f"{'HIJ'[k]}{r}", f"={_x(g)}J{z}", fmt, fett)
        if zf is not None and nur_bezug:
            ueb_wert(ws, f"G{r}", f"={FREI_BLATT}H{zf}", fmt, fett)
        elif zf is not None:
            ueb_wert(ws, f"G{r}", f"={FREI_BLATT}I{zf}", fmt, fett)
            ueb_wert(ws, f"K{r}", f"={FREI_BLATT}J{zf}", fmt, fett)
    for i, (gz, _t, _f) in enumerate(UEB_GRUPPEN_H):    # Jahr 42 optisch absetzen
        bis = max(r for r, *_ in UEB_HORIZONT if gz < r < (UEB_GRUPPEN_H[i + 1][0] if i + 1 < len(UEB_GRUPPEN_H)
                                                          else UEB_KOPF8))
        for rr in range(gz + 1, bis + 1):
            c = ws[f"H{rr}"]
            b = c.border
            c.border = Border(left=DUENN, right=b.right, top=b.top, bottom=b.bottom)

    # Aufschlag der gerechneten Frei-Miete auf die Marktmiete, sichtbar bei Renditen und Restwert (Gruppenzeilen
    # Block 5, 6 und 7)
    for gz in UEB_AUFSCHLAG_ZEILEN:
        c = zelle(ws, f"L{gz}", f"={FREI_BLATT}H185", "formel", F_AUFSCHLAG, fett=True, h="left", einzug=1)
        c.fill = fuellung(GRUPPE)
    # Seite 1: dieselbe Zahl bei Miete Jahr 1, Jahresrechnung und Liquidität
    for r in UEB_AUFSCHLAG_SEITE1:
        zelle(ws, f"L{r}", f"={FREI_BLATT}H185", "formel", F_AUFSCHLAG, fett=True, h="left", einzug=1)

    # Block 8 Miete für das DSCR-Ziel: nötige Miete A/B/C/Frei, Aufschläge nur Frei
    ueb_kopf(ws, UEB_KOPF8, dict(abc, B=UEB_KOPFZEILEN[UEB_KOPF8], G="Frei"))
    for r, nr, text, einheit, zg, zf, fmt, bem in UEB_BLOCK8:
        fett = r in FETT_BLOCK8
        ueb_text(ws, r, nr, text, einheit, bem, fett=fett)
        if zg:
            for s, g in zip("DEF", GEF_ABC):
                ueb_wert(ws, f"{s}{r}", f"={_x(g)}{zg}", fmt, fett)
        ueb_wert(ws, f"G{r}", f"={FREI_BLATT}{zf}", fmt, fett)

    # Block 9 Prüfungen (sichtbar): Status in C, Kasse bei Bezug A/B/C in D-F neben P1
    ueb_kopf(ws, UEB_PRUEF_KOPF, {"A": "Nr.", "B": "Prüfung", "C": "Status", "D": "A", "E": "B", "F": "C",
                                  "H": "Bemerkung"}, mitte=("C",))
    for r, nr, text, bed in PRUEFUNGEN:
        ueb_text(ws, r, nr, text, None, PRUEF_BEMERKUNG.get(nr))
        zelle(ws, f"C{r}", f'=IFERROR(IF({bed},"OK","prüfen"),"prüfen")', "formel", h="center")
    for s, g in zip("DEF", GEF_ABC):
        ueb_wert(ws, f"{s}{UEB_PRUEF_ERSTE}", f"={_x(g)}H105", F_EUR)
    regel = CellIsRule(operator="equal", formula=['"prüfen"'], font=Font(name="Arial", bold=True, color="C00000"),
                       fill=PatternFill(start_color="FCE4E4", end_color="FCE4E4", fill_type="solid"))
    ws.conditional_formatting.add("D3", regel)
    ws.conditional_formatting.add(f"C{UEB_PRUEF_ERSTE}:C{UEB_LETZTE}", regel)

    # Gliederung: Nebenwerte und Details eingeklappt, Schalter an der Zeile darüber (summaryBelow = 0)
    ws.sheet_properties.outlinePr.summaryBelow = False
    for a, b in UEB_EINGEKLAPPT:
        ws.row_dimensions.group(a, b, outline_level=1, hidden=True)
        ws.row_dimensions[a - 1].collapsed = True
    breiten(ws, {"A": 6, "B": 42, "C": 17, "D:K": 12, "L": 38})
    for r in UEB_ABSTAND:
        ws.row_dimensions[r].height = UEB_ABSTAND_HOEHE
    ws.freeze_panes = "A7"
    ws.sheet_view.showGridLines = False
    ws.sheet_properties.tabColor = ROT
    druck(ws, titelzeilen="1:2", bereich=f"A1:L{UEB_LETZTE}", umbrueche=[52])


# ---------------------------------------------------------------------------------------------------
# NBank (Konzept D.6): EK-Rendite gegen Orientierungswert, neutral (nur Lage über/unter)
# ---------------------------------------------------------------------------------------------------
NB_MATRIX = [  # Zeile, Nr., Bezeichnung, Horizont (I = 35, J = 42), Zeile auf Gefördert
    (11, "N4", "VOFI-EK-Rendite, mit Restwert", "I", 143), (12, "N5", "VOFI-EK-Rendite, mit Restwert", "J", 143),
    (14, "N6", "EK-IRR, mit Restwert", "I", 140), (15, "N7", "EK-IRR, mit Restwert", "J", 140),
    (17, "N8", "VOFI-EK-Rendite, nur Bodenwert", "I", 144), (18, "N9", "VOFI-EK-Rendite, nur Bodenwert", "J", 144),
    (19, "N10", "EK-IRR, nur Bodenwert", "I", 141), (20, "N11", "EK-IRR, nur Bodenwert", "J", 141),
    (21, "N12", "VOFI-EK-Rendite, ohne Restwert", "I", 145), (22, "N13", "VOFI-EK-Rendite, ohne Restwert", "J", 145),
    (23, "N14", "EK-IRR, ohne Restwert", "I", 142), (24, "N15", "EK-IRR, ohne Restwert", "J", 142),
]
NB_GRUPPEN = [(10, "Primärgröße VOFI (RL Nr. 11.10 Abs. 3)"), (13, "Gegenprobe EK-IRR (DAWI-Beschluss Art. 6)"),
              (16, "nachrichtlich")]
NB_BEZUG = [(27, "N16", "Eigenkapital (Grundstück + bar)", "H106"), (28, "N17", "NBank-Darlehen, Nennwert", "H99"),
            (29, "N18", "Zuschuss nach Bearbeitungsentgelt", "H108"),
            (30, "N19", "Barwertvorteil NBank-Darlehen", "H168"),
            (31, "N20", "Förderbarwert (N18 + N19)", None)]
NB_TEXTE = [("A33", "„über“: Die NBank prüft den angemessenen Gewinn ergänzend (RL Nr. 11.10 Abs. 4); "
                    "Gleichstand gilt als „unter“."),
            ("A34", "Zeitraum, Wiederanlage, Restwert und Swap-Stichtag legt die NBank fest."),
            ("A35", "Barwertvorteil: Darlehen nach Entgelt − Barwert von Zins, Tilgung, Verwaltungskostenbeitrag "
                    "(Eingabe 6.1)."),
            ("A36", "N10, N11, N14, N15: EK-IRR nicht eindeutig (Hinweis 11); maßgeblich ist die VOFI-EK-Rendite.")]


def blatt_nbank(wb, ws):
    titel(ws, "NBank: Orientierung zur Überkompensation", "G")
    link(ws, "I1", "Übersicht", "'Übersicht'!A1").alignment = Alignment(horizontal="right")
    zelle(ws, "A2", "Die NBank rechnet selbst (RL Nr. 11.10). Die Werte sind eine interne Orientierung.")
    zelle(ws, "B3", "Projekt")
    zelle(ws, "D3", "=Aktives_Projekt", "formel", fett=True)
    kopfzeile(ws, 4, {"A": "Nr.", "B": "Größe", "C": "Einheit", "D": "Wert", "G": "Quelle"}, "A", "I",
              rechts=("D",), hoehe=20)
    for r, nr, text, f, einheit, fmt, quelle, fett in (
            (5, "N1", "Swapsatz 30 Jahre", "=Swapsatz_30J", "% p. a.", F_PCT, "Eingabe 3.4", False),
            (6, "N2", "Aufschlag", "=Aufschlag_Swap", "Prozentpunkte", F_PP, "RL Nr. 11.10 Abs. 4", False),
            (7, "N3", "Orientierungswert", "=D5+D6", "% p. a.", F_PCT, None, True)):
        zelle(ws, f"A{r}", nr)
        zelle(ws, f"B{r}", text, fett=fett)
        zelle(ws, f"C{r}", einheit)
        zelle(ws, f"D{r}", f, "formel", fmt, fett=fett, h="right")
        if quelle:
            zelle(ws, f"G{r}", quelle)
        rahmen_unten(ws, r, "A", "I", HAAR)
    rahmen_oben(ws, 7, "B", "D", ERGEBNIS_LINIE)

    gruppenzeile(ws, 8, None, "A", "I")
    zelle(ws, "D8", "Rendite", "gruppe")
    zelle(ws, "G8", "Lage zum Orientierungswert", "gruppe")
    kopfzeile(ws, 9, {"A": "Nr.", "B": "EK-Rendite vor Steuern", "C": "Jahr", "D": "A", "E": "B", "F": "C",
                      "G": "A", "H": "B", "I": "C"}, "A", "I", rechts=("C", "D", "E", "F"),
              mitte=("G", "H", "I"), hoehe=20)
    for r, text in NB_GRUPPEN:
        gruppenzeile(ws, r, text, "A", "I", text_spalte="B")
    for r, nr, text, sp, z in NB_MATRIX:
        zelle(ws, f"A{r}", nr)
        zelle(ws, f"B{r}", text)
        zelle(ws, f"C{r}", "=Bindung" if sp == "I" else "=Laufzeit_max", "formel", F_JAHR, h="right")
        for k, g in enumerate(GEF_ABC):
            d = f"{'DEF'[k]}{r}"
            zelle(ws, d, f"={_x(g)}{sp}{z}", "formel", F_PCT, h="right")
            zelle(ws, f"{'GHI'[k]}{r}",
                  f'=IF(ISERROR({d}),"prüfen",IF(ISNUMBER({d}),IF({d}>$D$7,"über","unter"),"–"))', "formel",
                  h="center")
        rahmen_unten(ws, r, "A", "I", HAAR)

    kopfzeile(ws, 26, {"A": "Nr.", "B": "Grundlagen", "C": "Einheit", "D": "A", "E": "B", "F": "C"}, "A", "I",
              rechts=("D", "E", "F"), hoehe=20)
    for r, nr, text, z in NB_BEZUG:
        zelle(ws, f"A{r}", nr)
        zelle(ws, f"B{r}", text, fett=z is None)
        zelle(ws, f"C{r}", "€")
        for k, g in enumerate(GEF_ABC):
            s = "DEF"[k]
            f = f"={_x(g)}{z}" if z else f"={s}29+{s}30"
            zelle(ws, f"{s}{r}", f, "formel", F_EUR, fett=z is None, h="right")
        rahmen_unten(ws, r, "A", "I", HAAR)
    rahmen_oben(ws, 31, "B", "F", ERGEBNIS_LINIE)
    for ref, text in NB_TEXTE:
        zelle(ws, ref, text)
    for r in (25, 32):
        ws.row_dimensions[r].height = 6
    # C 14: „Prozentpunkte“ steht neben einer belegten Zelle und füllt 13 ganz aus (Lektorat Nr. 06)
    breiten(ws, {"A": 6, "B": 40, "C": 14, "D:F": 11, "G:I": 10})
    ws.freeze_panes = "A10"
    druck(ws, bereich="A1:I36")


# ---------------------------------------------------------------------------------------------------
# Hinweise (Konzept D.7): höchstens 15 kurze Zeilen, A3:B17
# ---------------------------------------------------------------------------------------------------
HINWEISE = [
    "Zweck: Wirtschaftlichkeit geförderter Mietwohnungen nach RL Mietwohnraum 2026, Programmteil 2.1; Gruppen A, B, C "
    "und frei finanziert.",
    "Kürzel: VOFI = vollständiger Finanzplan; IRR = interner Zinsfuß; EK = Eigenkapital; DSCR = Schuldendienstdeckung; "
    "n. v. = kein Wert.",
    "Konventionen: vor Steuern, nominal, jährlich nachschüssig; Jahr 0 = Bezugsfertigkeit.",
    "Bauphase nicht abgebildet: Kosten, Eigenkapital, Entgelte und Verwaltungskostenbeitrag (RL Nr. 12.7.1) erst ab "
    "Bezug; Renditen dadurch zu hoch.",
    "Kostenstand: Eingabe 5.2 und 5.3 (Stand 2026) gelten in Jahr 1 und steigen ab Jahr 2; Eingabe 5.5 schreibt sie "
    "vorab fort.",
    "Mieten gefördert: Höchstmiete (höchstens Marktmiete) in Jahr 1–3, dann alle 3 Jahre höchstens +6,15 %, ab Jahr 36 "
    "höchstens um die Kappungsgrenze; Obergrenze bis Jahr 42 die Vergleichsmiete, danach die Zielmiete (Eingabe 8.2); "
    "je m² ungerundet. Mieten frei: Marktmiete oder Miete für das DSCR-Ziel (Eingabe 10.1, 10.2), jährlich steigend "
    "mit Eingabe 4.5, ohne Grenze nach § 558 BGB; mit Grenze läge der Objekt-IRR zur Marktmiete beim Modellhaus rund "
    "0,4–0,5 Prozentpunkte tiefer. Werte zur Miete für das DSCR-Ziel nur mit dem Aufschlag nennen (Übersicht 8.5).",
    "Finanzierung: Eigenkapital = Grundstück (Sacheinlage) + bar; Bankdarlehen nur als Restfinanzierung. "
    "NBank-Darlehen: 0 % Zins bis Ende Jahr 35, Tilgung linear, Rest in Jahr 42. Frei finanziert: Mindest-Eigenmittel "
    "wie gefördert plus Eingabe 7.1, Rest Bankdarlehen (Eingabe 6.1 bis 6.4). Gefördert mindert Eingabe 7.1 nur das "
    "Bankdarlehen.",
    "Restwert: Ertragswert im Stichjahr (Jahr 35 und Jahr 42), gerechnet bis Jahr 80; Mietpfad wie Hinweis 6.",
    "Restwert-Varianten: mit Restwert = Boden + Gebäude; nur Bodenwert = ohne Gebäudeanteil; ohne Restwert = 0.",
    "Objekt-IRR (ohne Darlehen gerechnet) in drei Stufen: ohne Zuschuss, nach Zuschuss, nach Förderbarwert "
    "(Übersicht 1.9).",
    "IRR: Bei mehreren Nullstellen zeigt die Mappe die größte mit fallendem Barwert. „n. v.“: keine Lösung, "
    "Endvermögen ≤ 0 oder gesperrt (P1). Fehlbeträge: Der EK-IRR rechnet sie als Nachschuss zum internen Zins; die "
    "VOFI-EK-Rendite verzinst sie zum Sollzins (Eingabe 7.3) und bezieht das Endvermögen auf das Eigenkapital bei "
    "Bezug. In beiden Fällen gilt die VOFI-EK-Rendite.",
    "Nach außen: Jahresrechnung, Tilgungsvergleich, Annahmen. Renditen nur in der Beratung, je mit Restwert und nur "
    "Bodenwert, dazu Restwertanteil.",
    "Bandbreite je Rendite, Beratung: Eingabe 9.3 ±0,5 Prozentpunkte, 9.4 = 0,50, 8.3 = 5 %, 8.2 = Vergleichsmiete.",
    "Nicht nach außen: Blatt NBank. Modellhaus: Marktmiete (Eingabe 4.4) und Liegenschaftszins (Tabellen, Tabelle 4) "
    "sind amtliche Werte der Gutachterausschüsse für Rotenburg (Wümme), Stand 01.01.2026; die Vergleichsmiete "
    "(Eingabe 4.3) ist eine Annahme der PGN. Für einen anderen Standort ersetzen.",
    "Tarutinoer: Grundstück 0 € wie Vorgängermappe; Renditen ohne Grundstückskosten, nur Bodenwert = ohne Restwert; "
    "nicht mit Modellhaus vergleichbar.",
]


def blatt_hinweise(wb, ws):
    titel(ws, "Hinweise", "B")
    link(ws, "C1", "Übersicht", "'Übersicht'!A1")
    kopfzeile(ws, 2, {"A": "Nr.", "B": "Hinweis (Version 3.0, Stand 11/2026)"}, "A", "B", hoehe=18, mitte=("A",))
    for i, text in enumerate(HINWEISE):
        r = 3 + i
        zelle(ws, f"A{r}", str(i + 1), h="center", v="top")
        zelle(ws, f"B{r}", text, umbruch=True, v="top")
        rahmen_unten(ws, r, "A", "B", HAAR)
    breiten(ws, {"A": 5, "B": 120, "C": 11})
    ws.freeze_panes = "A3"
    ws.sheet_view.showGridLines = False
    druck(ws, bereich=f"A1:B{2 + len(HINWEISE)}")


# =====================================================================================================
# 4. Mappe bauen, speichern, neu berechnen
# =====================================================================================================
BLAETTER = ["Übersicht", "Eingaben", "Gefördert A", "Gefördert B", "Gefördert C", "Frei finanziert", "NBank",
            "Tabellen", "Hinweise"]


def standardschrift(wb):
    """Arial 10 als Standard der Mappe (Formatvorlage Standard und Schrift 0)."""
    from openpyxl.utils.indexed_list import IndexedList
    basis = Font(name="Arial", size=10, color=ANTHRAZIT)
    fonts = list(wb._fonts)
    fonts[0] = basis
    wb._fonts = IndexedList(fonts)
    wb._named_styles["Normal"].font = basis


def baue(ziel, probe=False):
    NAMEN.clear()
    bis_t = 2 if probe else 80
    wb = Workbook()
    standardschrift(wb)
    ws0 = wb.active
    ws0.title = BLAETTER[0]
    for b in BLAETTER[1:]:
        wb.create_sheet(b)
    # Reihenfolge: Tabellen und Eingaben zuerst, damit die Namen für die Farbwahl der Formeln bekannt sind
    blatt_tabellen(wb, wb["Tabellen"])
    blatt_eingaben(wb, wb["Eingaben"])
    for g in "ABC":
        blatt_gefoerdert(wb, wb[f"Gefördert {g}"], g, bis_t)
    blatt_frei(wb, wb["Frei finanziert"], bis_t)
    blatt_uebersicht(wb, wb["Übersicht"])
    blatt_nbank(wb, wb["NBank"])
    blatt_hinweise(wb, wb["Hinweise"])

    for ws in wb.worksheets:
        ws.sheet_view.tabSelected = ws.title == BLAETTER[0]
        ws.sheet_format.defaultRowHeight = ZEILENHOEHE      # Arial 10 (openpyxl-Vorgabe wäre 15 pt)
    wb.active = 0
    wb.calculation.fullCalcOnLoad = True
    wb.properties.creator = DOK_AUTOR
    wb.properties.lastModifiedBy = DOK_AUTOR
    wb.properties.title = DOK_TITEL
    wb.properties.language = DOK_SPRACHE
    wb.save(ziel)
    return wb


def neu_berechnen(ziel):
    p = subprocess.run([PYTHON, RECALC, str(ziel), "120"], capture_output=True, text=True)
    try:
        erg = json.loads(p.stdout)
    except json.JSONDecodeError:
        print(p.stdout, p.stderr, file=sys.stderr)
        raise SystemExit("recalc.py: keine JSON-Ausgabe")
    print(json.dumps(erg, ensure_ascii=False, indent=1))
    if erg.get("status") != "success" or erg.get("total_errors", 1) != 0:
        raise SystemExit("recalc.py: Fehler in der Neuberechnung")
    return erg


# Blätter mit Zeilengliederung, deren Gruppenzeile über den Detailzeilen steht (summaryBelow = 0)
GLIEDERUNG_OBEN = ("Eingaben", "Übersicht", "Gefördert A", "Gefördert B", "Gefördert C", "Frei finanziert")
# Schalter zugeklappter Gruppen: Übersicht Zeilen über den Details, Gefördert Spalte AO (rechts von Y-AN)
ZUGEKLAPPT = {"Übersicht": ("row", tuple(a - 1 for a, _b in UEB_EINGEKLAPPT)),
              **{f"Gefördert {g}": ("col", (46,)) for g in "ABC"}, "Frei finanziert": ("col", (29,))}
# Zeilengliederung t = 43 … 80 (Schalter an Zeile 48 = t 42) auf allen Zeitreihenblättern
ZUGEKLAPPT_ZEILE = {**{f"Gefördert {g}": (Z42,) for g in "ABC"}, "Frei finanziert": (Z42,)}
DOK_AUTOR, DOK_TITEL, DOK_SPRACHE = "PGN", "VOFI Mietwohnraum 2026", "de-DE"
ZEILENHOEHE = 12.75


def nachbearbeiten(ziel):
    """LibreOffice schreibt beim Neuberechnen zwei Einstellungen nicht zurück: die Lage der Gliederungsschalter
    (summaryBelow = 0) und fullCalcOnLoad. Beide werden direkt im XML ergänzt; Zellwerte und Formeln bleiben
    unverändert (kein erneutes Speichern mit openpyxl, das die berechneten Werte verwürfe)."""
    import zipfile
    with zipfile.ZipFile(ziel) as z:
        infos = z.infolist()
        teile = {i.filename: z.read(i.filename) for i in infos}
    wbx = teile["xl/workbook.xml"].decode("utf-8")
    rels = teile["xl/_rels/workbook.xml.rels"].decode("utf-8")
    rid_ziel = dict(re.findall(r'<Relationship[^>]*?Id="([^"]+)"[^>]*?Target="([^"]+)"', rels))
    rid_ziel.update({a: b for b, a in re.findall(r'<Relationship[^>]*?Target="([^"]+)"[^>]*?Id="([^"]+)"', rels)})
    for nm, rid in re.findall(r'<sheet [^>]*?name="([^"]+)"[^>]*?r:id="([^"]+)"', wbx):
        nm = nm.replace("&apos;", "'").replace("&amp;", "&")
        if nm not in GLIEDERUNG_OBEN:
            continue
        teil = "xl/" + rid_ziel[rid].lstrip("/").removeprefix("xl/")
        x = teile[teil].decode("utf-8")
        if "<outlinePr" in x:
            x = re.sub(r'<outlinePr[^>]*/>', '<outlinePr summaryBelow="0" summaryRight="1"/>', x, count=1)
        elif re.search(r"<sheetPr[^>]*/>", x):
            x = re.sub(r"<sheetPr([^>]*)/>", r'<sheetPr\1><outlinePr summaryBelow="0" summaryRight="1"/></sheetPr>',
                       x, count=1)
        else:
            # Reihenfolge in sheetPr: tabColor, outlinePr, pageSetUpPr
            m = re.search(r"<sheetPr[^>]*>(<tabColor[^>]*/>)?", x)
            x = x[:m.end()] + '<outlinePr summaryBelow="0" summaryRight="1"/>' + x[m.end():]
        teile[teil] = x.encode("utf-8")
    # Zugeklappte Gruppen: LibreOffice schreibt an der Schalterzeile/-spalte collapsed="false"; Excel zeigte dann
    # an einer geschlossenen Gruppe den Schalter "−". Schalterzeilen Übersicht, Schalterspalte AT (46) Gefördert,
    # AC (29) Frei, Schalterzeile 48 (Gruppe t = 43 … 80) auf den Zeitreihenblättern.
    auftraege = [(nm, art, nummern) for nm, (art, nummern) in ZUGEKLAPPT.items()]
    auftraege += [(nm, "row", nummern) for nm, nummern in ZUGEKLAPPT_ZEILE.items()]
    blatt_teil = {}
    for nm, rid in re.findall(r'<sheet [^>]*?name="([^"]+)"[^>]*?r:id="([^"]+)"', wbx):
        nm = nm.replace("&apos;", "'").replace("&amp;", "&")
        blatt_teil[nm] = "xl/" + rid_ziel[rid].lstrip("/").removeprefix("xl/")
    for nm, art, nummern in auftraege:
        teil = blatt_teil[nm]
        x = teile[teil].decode("utf-8")
        for n in nummern:
            muster = rf'<row r="{n}"[^>]*>' if art == "row" else rf'<col [^>]*\bmin="{n}"[^>]*>'
            m = re.search(muster, x)
            if m:
                tag = m.group(0)
                neu = tag.replace('collapsed="false"', 'collapsed="true"') if "collapsed=" in tag \
                    else tag[:-2] + ' collapsed="true"/>' if tag.endswith("/>") \
                    else tag[:-1] + ' collapsed="true">'
                x = x[:m.start()] + neu + x[m.end():]
        teile[teil] = x.encode("utf-8")
    # Dokumenteigenschaften (LibreOffice setzt Autor/Sprache beim Speichern neu)
    if "docProps/core.xml" in teile:
        core = teile["docProps/core.xml"].decode("utf-8")
        for tag, wert in (("dc:creator", DOK_AUTOR), ("cp:lastModifiedBy", DOK_AUTOR), ("dc:title", DOK_TITEL),
                          ("dc:language", DOK_SPRACHE)):
            if re.search(rf"<{tag}\b[^>]*/>", core):
                core = re.sub(rf"<{tag}\b[^>]*/>", f"<{tag}>{wert}</{tag}>", core, count=1)
            elif re.search(rf"<{tag}\b[^>]*>.*?</{tag}>", core, re.S):
                core = re.sub(rf"(<{tag}\b[^>]*>).*?(</{tag}>)", rf"\g<1>{wert}\g<2>", core, count=1, flags=re.S)
            else:
                core = core.replace("</cp:coreProperties>", f"<{tag}>{wert}</{tag}></cp:coreProperties>")
        teile["docProps/core.xml"] = core.encode("utf-8")
    # LibreOffice schreibt Druckwiederholungen (Zeilen und Spalten) doppelt: je Blatt nur den ersten Namen behalten
    gesehen = set()

    def _einmal(m):
        tag = m.group(0)
        schluessel = (re.search(r'name="([^"]+)"', tag).group(1), (re.search(r'localSheetId="(\d+)"', tag) or [None, ""])[1])
        if schluessel in gesehen:
            return ""
        gesehen.add(schluessel)
        return tag
    wbx = re.sub(r"<definedName\b[^>]*>[^<]*</definedName>", _einmal, wbx)
    # Mehrteilige Druckbereiche in der Reihenfolge des Konzepts (bestimmt die Seitenfolge in Excel)
    for nm, bereich in DRUCKBEREICHE.items():
        if "," not in bereich:
            continue
        sid = BLAETTER.index(nm)
        q = "&apos;" + nm + "&apos;!" if " " in nm else nm + "!"
        wert = ",".join(q + "$" + re.sub(r"([A-Z]+)(\d+)", r"\1$\2", t).replace(":", ":$") for t in bereich.split(","))
        wbx = re.sub(rf'(<definedName[^>]*localSheetId="{sid}"[^>]*name="_xlnm.Print_Area"[^>]*>)[^<]*(</definedName>)',
                     lambda m: m.group(1) + wert + m.group(2), wbx)
    if "fullCalcOnLoad" not in wbx:
        wbx = re.sub(r"<calcPr", '<calcPr fullCalcOnLoad="1"', wbx, count=1)
    teile["xl/workbook.xml"] = wbx.encode("utf-8")
    tmp = Path(str(ziel) + ".tmp")
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as z:
        for i in infos:
            z.writestr(i, teile[i.filename])
    os.replace(tmp, ziel)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    ap.add_argument("--ziel", default=str(ZIEL))
    ap.add_argument("--ohne-recalc", action="store_true")
    ap.add_argument("--probe", action="store_true", help="Zeitreihen nur t = 0 ... 2")
    ap.add_argument("--nachbearbeiten", metavar="DATEI",
                    help="nur nachbearbeiten (nach einem erneuten recalc.py auf DATEI)")
    a = ap.parse_args()
    if a.nachbearbeiten:
        nachbearbeiten(a.nachbearbeiten)
        print(f"nachbearbeitet: {a.nachbearbeiten}")
        return
    baue(a.ziel, probe=a.probe)
    print(f"gespeichert: {a.ziel} ({len(NAMEN)} Namen)")
    if not a.ohne_recalc:
        neu_berechnen(a.ziel)
        nachbearbeiten(a.ziel)


if __name__ == "__main__":
    main()
