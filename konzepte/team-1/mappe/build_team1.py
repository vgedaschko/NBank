#!/usr/bin/env python3
"""Team 1 (Geldfluss): eigene Kopie der Konzepte-Mappe mit dem neuen Block T1.

Ablauf
  1. kopieren      konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx -> hier, Name mit _Team1
  2. Block T1      Blatt Konzepte, ab Zeile 108 (unter dem Block K); nur Formeln auf bestehende Zellen
  3. neu rechnen   recalc.py (LibreOffice, eigenes HOME), danach vofi/build_vofi.py --nachbearbeiten
  4. vergleichen   alle Zellen der Konzepte-Mappe (Formeln und Werte) gegen die Kopie: 0 Abweichungen außer Block T1
  5. Gegenproben   Status Übersicht D3, Konzepte D3, T1 (Konzepte D108) = OK; Kostenschwelle gegen die Läufe kosten_*
  6. Ausgabe       werte_team.json (schluessel, wert, einheit, blatt, zelle, bedeutung, lauf)

Aufruf: HOME=<team>/.lohome python build_team1.py --recalc PFAD/recalc.py
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
from openpyxl.styles import Font, PatternFill
from openpyxl.utils import get_column_letter

HIER = Path(__file__).resolve().parent
KONZEPTE = HIER.parent.parent / "mappe"
QUELLE = KONZEPTE / "PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx"
ZIEL = HIER / "PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team1.xlsx"
GENERATOR = HIER.parent.parent.parent / "vofi" / "build_vofi.py"
WERTE_KONZEPTE = KONZEPTE / "werte_konzepte.json"
BLATT = "Konzepte"
START = 108  # erste Zeile des Blocks T1 (Block K endet in Zeile 106)

VAR = ["A", "B", "C", "frei_markt", "frei_dscr"]
SPALTE = dict(zip(VAR, "DEFGH"))
NAME = {"A": "Gruppe A, Höchstmiete", "B": "Gruppe B, Höchstmiete", "C": "Gruppe C, Höchstmiete",
        "frei_markt": "frei finanziert, Marktmiete 15,42 €", "frei_dscr": "frei finanziert, Miete für DSCR 1,2 der Bank"}
BL = {"A": "'Gefördert A'", "B": "'Gefördert B'", "C": "'Gefördert C'",
      "frei_markt": "'Frei finanziert'", "frei_dscr": "'Frei DSCR 1,2'"}
# Spalten der Zeitreihe je Blatt: gefördert | frei
GEF = dict(miete="F", soll="G", ausfall="H", verw="I", inst="J", uevk="K", vkb="L", zins="M", tilg="N",
           zins_b="O", tilg_b="P", kd="Q", zue="R", dscr="S")
FREI = dict(miete="D", soll="E", ausfall="F", verw="G", inst="H", uevk="I", zins="J", tilg="K", kd="L", zue="M",
            dscr="N")
# Zahlungsüberschuss kumuliert auf Blatt Konzepte Zeitreihe (Zeile 6 = Jahr 0, 7..41 = Jahr 1..35)
KUM_ZR = {"A": "G", "B": "P", "C": "Y", "frei_markt": "AH", "frei_dscr": "AQ"}
DSCR_ZR = {"A": "H", "B": "Q", "C": "Z", "frei_markt": "AI", "frei_dscr": "AR"}

FMT_EUR = '#,##0;[Red]-#,##0;"–"'
FMT_EUR2 = '#,##0.00;[Red]-#,##0.00;"–"'
FMT_PCT = '0.0 %;[Red]-0.0 %;"–"'
FMT_X = '0.00;[Red]-0.00;"–"'
FMT_N = '0;[Red]-0;"–"'
ROT = PatternFill("solid", fgColor="8B2939")
HELL = PatternFill("solid", fgColor="F4F3F2")
WEISS_FETT = Font(name="Arial", size=10, bold=True, color="FFFFFF")
FETT = Font(name="Arial", size=10, bold=True)
NORMAL = Font(name="Arial", size=10)
GRUEN = Font(name="Arial", size=10, color="008000")  # reiner Verweis auf ein anderes Blatt (Regel F5 der Mappe)


def z(sp, row):
    return f"${sp}${row}"


def zelle_var(v, feld, row):
    """Zelle eines Felds im Blatt der Variante (Zeile row)."""
    b = BL[v]
    if v in ("frei_markt", "frei_dscr"):
        return f"{b}!{z(FREI[feld], row)}" if feld in FREI else None
    return f"{b}!{z(GEF[feld], row)}"


class Block:
    def __init__(self, ws):
        self.ws = ws
        self.r = START
        self.eintraege = []  # (schluessel, zeile, einheit, bedeutung, varianten)
        self.zeile_von = {}

    def set(self, adr, wert, fmt=None, font=NORMAL, fill=None):
        c = self.ws[adr]
        c.value = wert
        c.font = font
        if fmt:
            c.number_format = fmt
        if fill:
            c.fill = fill

    def kopf(self, titel):
        r = self.r
        for i, t in enumerate(["Nr.", titel, "Einheit", "A", "B", "C", "Frei, Markt", "Frei, DSCR",
                               "Herkunft (Zelle im Blatt der Variante bzw. Formel)"]):
            self.set(f"{get_column_letter(i + 1)}{r}", t, font=WEISS_FETT, fill=ROT)
        self.r += 1

    def abschnitt(self, titel):
        for i in range(1, 10):
            self.set(f"{get_column_letter(i)}{self.r}", None, fill=HELL)
        self.set(f"B{self.r}", titel, font=FETT, fill=HELL)
        self.r += 1

    def zeile(self, nr, schluessel, text, einheit, formeln, fmt, herkunft, varianten=VAR):
        r = self.r
        self.set(f"A{r}", nr)
        self.set(f"B{r}", text)
        self.set(f"C{r}", einheit)
        for v in varianten:
            f = formeln(v, r)
            if f is None:
                continue
            rein = isinstance(f, str) and re.fullmatch(r"='[^']+'!\$?[A-Z]+\$?\d+", f)
            self.set(f"{SPALTE[v]}{r}", f, fmt, font=GRUEN if rein else NORMAL)
        self.set(f"I{r}", herkunft)
        self.eintraege.append((schluessel, r, einheit, f"{nr} {text}", list(varianten)))
        self.zeile_von[schluessel] = r
        self.r += 1
        return r

    def leer(self):
        self.r += 1


def baue_block(wb):
    ws = wb[BLATT]
    assert ws.max_row == 106, f"Blatt Konzepte hat {ws.max_row} Zeilen, erwartet 106"
    for row in ws.iter_rows(min_row=START, max_row=START + 200):
        for c in row:
            assert c.value is None, f"Zelle {c.coordinate} ist nicht leer"
    b = Block(ws)
    # Statuszeile des Blocks (Zeile 108); Formel wird am Ende gesetzt
    status_r = b.r
    b.set(f"B{status_r}", "Prüfungen T1 (Team 1, Geldfluss)", font=FETT)
    b.r += 2

    # ---------------- T1 Jahr 1 -------------------------------------------------------------------------
    b.kopf("T1 Geldfluss Jahr 1 (Zeilen 1 bis 9 der Jahresrechnung, alle Varianten)")
    b.zeile("T1.1", "t1.miete_jahr1", "Miete Jahr 1", "€/m² Monat",
            lambda v, r: "=" + zelle_var(v, "miete", 7), FMT_EUR2, "Spalte Miete gerechnet, Jahr 1")
    b.zeile("T1.2", "t1.sollmiete_jahr1", "Zeile 1 Sollmiete", "€ p. a.",
            lambda v, r: "=" + zelle_var(v, "soll", 7), FMT_EUR, "Spalte Sollmiete, Jahr 1")
    b.zeile("T1.3", "t1.mietausfall_jahr1", "Zeile 2 Mietausfall/Leerstand (Abzug)", "€ p. a.",
            lambda v, r: "=" + zelle_var(v, "ausfall", 7), FMT_EUR, "Spalte Mietausfall/Leerstand, Jahr 1")
    b.zeile("T1.4", "t1.objektverwaltung_jahr1", "Zeile 3 Objektverwaltung (Abzug)", "€ p. a.",
            lambda v, r: "=" + zelle_var(v, "verw", 7), FMT_EUR, "Spalte Objektverwaltung, Jahr 1")
    b.zeile("T1.5", "t1.instandhaltung_jahr1", "Zeile 4 Instandhaltung (Abzug)", "€ p. a.",
            lambda v, r: "=" + zelle_var(v, "inst", 7), FMT_EUR, "Spalte Instandhaltung, Jahr 1")
    b.zeile("T1.6", "t1.uevk_jahr1", "Zeile 5 Überschuss vor Kapitaldienst", "€ p. a.",
            lambda v, r: "=" + zelle_var(v, "uevk", 7), FMT_EUR, "Spalte Überschuss vor Kapitaldienst, Jahr 1")
    b.zeile("T1.7", "t1.vkb_jahr1", "Zeile 6 Verwaltungskostenbeitrag (Abzug)", "€ p. a.",
            lambda v, r: ("=" + zelle_var(v, "vkb", 7)) if v in ("A", "B", "C") else "=0*" + zelle_var(v, "soll", 7),
            FMT_EUR, "Spalte Verwaltungskostenbeitrag, Jahr 1; frei ohne NBank-Darlehen, daher 0")
    b.zeile("T1.8", "t1.zins_jahr1", "Zeile 7 Zins (NBank-Darlehen bzw. Bankdarlehen, Abzug)", "€ p. a.",
            lambda v, r: (f"={zelle_var(v, 'zins', 7)}+{zelle_var(v, 'zins_b', 7)}" if v in ("A", "B", "C")
                          else "=" + zelle_var(v, "zins", 7)), FMT_EUR, "Spalten Zins NBank und Zins Bank, Jahr 1")
    b.zeile("T1.9", "t1.tilgung_jahr1", "Zeile 8 Tilgung (NBank-Darlehen bzw. Bankdarlehen, Abzug)", "€ p. a.",
            lambda v, r: (f"={zelle_var(v, 'tilg', 7)}+{zelle_var(v, 'tilg_b', 7)}" if v in ("A", "B", "C")
                          else "=" + zelle_var(v, "tilg", 7)), FMT_EUR, "Spalten Tilgung NBank und Tilgung Bank, Jahr 1")
    b.zeile("T1.10", "t1.kapitaldienst_jahr1", "Kapitaldienst (Zeilen 6 bis 8, Abzug)", "€ p. a.",
            lambda v, r: "=" + zelle_var(v, "kd", 7), FMT_EUR, "Spalte Kapitaldienst, Jahr 1")
    b.zeile("T1.11", "t1.zue_jahr1", "Zeile 9 Zahlungsüberschuss", "€ p. a.",
            lambda v, r: "=" + zelle_var(v, "zue", 7), FMT_EUR, "Spalte Zahlungsüberschuss, Jahr 1")
    r3, r4, r5 = (b.zeile_von[k] for k in ("t1.mietausfall_jahr1", "t1.objektverwaltung_jahr1",
                                           "t1.instandhaltung_jahr1"))
    b.zeile("T1.12", "t1.bewirtschaftung_jahr1", "Bewirtschaftung (Zeilen 2 bis 4, Abzug)", "€ p. a.",
            lambda v, r: f"={SPALTE[v]}{r3}+{SPALTE[v]}{r4}+{SPALTE[v]}{r5}", FMT_EUR, "T1.3 + T1.4 + T1.5")
    rs = b.zeile_von["t1.sollmiete_jahr1"]
    rb, rv, rz, rt, ru = (b.zeile_von[k] for k in ("t1.bewirtschaftung_jahr1", "t1.vkb_jahr1", "t1.zins_jahr1",
                                                   "t1.tilgung_jahr1", "t1.zue_jahr1"))
    b.abschnitt("Anteile an der Sollmiete Jahr 1 (Geldfluss: wohin die Miete fließt)")
    for nr, k, t, rr, sg in (("T1.13", "t1.anteil_bewirtschaftung_jahr1", "Anteil Bewirtschaftung", rb, "-"),
                             ("T1.14", "t1.anteil_vkb_jahr1", "Anteil Verwaltungskostenbeitrag", rv, "-"),
                             ("T1.15", "t1.anteil_zins_jahr1", "Anteil Zins", rz, "-"),
                             ("T1.16", "t1.anteil_tilgung_jahr1", "Anteil Tilgung", rt, "-"),
                             ("T1.17", "t1.anteil_zue_jahr1", "Anteil Zahlungsüberschuss", ru, "")):
        b.zeile(nr, k, t, "Anteil", lambda v, r, rr=rr, sg=sg: f"=IF({SPALTE[v]}{rs}=0,0,{sg}{SPALTE[v]}{rr}/{SPALTE[v]}{rs})", FMT_PCT,
                f"{'−' if sg else ''}Zeile {rr} ÷ Zeile {rs} (Sollmiete)")
    a0 = b.zeile_von["t1.anteil_bewirtschaftung_jahr1"]
    b.zeile("T1.18", "t1.anteil_summe_jahr1", "Summe der Anteile (Probe = 100 %)", "Anteil",
            lambda v, r: f"=SUM({SPALTE[v]}{a0}:{SPALTE[v]}{a0 + 4})", FMT_PCT, "T1.13 bis T1.17")
    b.leer()

    # ---------------- T1 Summe Jahr 1 bis 35 --------------------------------------------------------------
    b.kopf("T1 Geldfluss Jahr 1 bis 35 (Summen über die Bindung, unverzinst, nominal)")

    def summe(feld):
        def f(v, r):
            if v in ("A", "B", "C"):
                if feld == "zins":
                    return f"=SUM({BL[v]}!$M$7:$M$41)+SUM({BL[v]}!$O$7:$O$41)"
                if feld == "tilg":
                    return f"=SUM({BL[v]}!$N$7:$N$41)+SUM({BL[v]}!$P$7:$P$41)"
                sp = GEF[feld]
            else:
                if feld == "vkb":
                    return f"=0*SUM({BL[v]}!$E$7:$E$41)"
                sp = FREI[feld]
            return f"=SUM({BL[v]}!${sp}$7:${sp}$41)"
        return f

    for nr, k, t, feld, hk in (
            ("T1.20", "t1s.sollmiete", "Sollmiete, Summe Jahr 1–35", "soll", "Spalte Sollmiete, Summe Jahr 1 bis 35"),
            ("T1.21", "t1s.mietausfall", "Mietausfall/Leerstand, Summe (Abzug)", "ausfall", "Spalte Mietausfall/Leerstand, Summe Jahr 1 bis 35"),
            ("T1.22", "t1s.objektverwaltung", "Objektverwaltung, Summe (Abzug)", "verw", "Spalte Objektverwaltung, Summe Jahr 1 bis 35"),
            ("T1.23", "t1s.instandhaltung", "Instandhaltung, Summe (Abzug)", "inst", "Spalte Instandhaltung, Summe Jahr 1 bis 35"),
            ("T1.24", "t1s.uevk", "Überschuss vor Kapitaldienst, Summe", "uevk", "Spalte Überschuss vor Kapitaldienst, Summe Jahr 1 bis 35"),
            ("T1.25", "t1s.vkb", "Verwaltungskostenbeitrag, Summe (Abzug)", "vkb", "Spalte Verwaltungskostenbeitrag, Summe; frei 0"),
            ("T1.26", "t1s.zins", "Zins, Summe (Abzug)", "zins", "Spalten Zins NBank und Zins Bank, Summe Jahr 1 bis 35"),
            ("T1.27", "t1s.tilgung", "Tilgung, Summe (Abzug)", "tilg", "Spalten Tilgung NBank und Tilgung Bank, Summe Jahr 1 bis 35"),
            ("T1.28", "t1s.kapitaldienst", "Kapitaldienst, Summe (Abzug)", "kd", "Spalte Kapitaldienst, Summe Jahr 1 bis 35"),
            ("T1.29", "t1s.zue", "Zahlungsüberschuss, Summe Jahr 1–35", "zue", "Spalte Zahlungsüberschuss, Summe Jahr 1 bis 35")):
        b.zeile(nr, k, t, "€", summe(feld), FMT_EUR, hk)
    s3, s4, s5 = (b.zeile_von[k] for k in ("t1s.mietausfall", "t1s.objektverwaltung", "t1s.instandhaltung"))
    b.zeile("T1.30", "t1s.bewirtschaftung", "Bewirtschaftung, Summe (Zeilen 2 bis 4, Abzug)", "€",
            lambda v, r: f"={SPALTE[v]}{s3}+{SPALTE[v]}{s4}+{SPALTE[v]}{s5}", FMT_EUR, "T1.21 + T1.22 + T1.23")
    ss = b.zeile_von["t1s.sollmiete"]
    sb, sv, sz, st, su = (b.zeile_von[k] for k in ("t1s.bewirtschaftung", "t1s.vkb", "t1s.zins", "t1s.tilgung",
                                                   "t1s.zue"))
    b.abschnitt("Anteile an der Sollmiete Jahr 1 bis 35")
    for nr, k, t, rr, sg in (("T1.31", "t1s.anteil_bewirtschaftung", "Anteil Bewirtschaftung", sb, "-"),
                             ("T1.32", "t1s.anteil_vkb", "Anteil Verwaltungskostenbeitrag", sv, "-"),
                             ("T1.33", "t1s.anteil_zins", "Anteil Zins", sz, "-"),
                             ("T1.34", "t1s.anteil_tilgung", "Anteil Tilgung", st, "-"),
                             ("T1.35", "t1s.anteil_zue", "Anteil Zahlungsüberschuss", su, "")):
        b.zeile(nr, k, t, "Anteil", lambda v, r, rr=rr, sg=sg: f"=IF({SPALTE[v]}{ss}=0,0,{sg}{SPALTE[v]}{rr}/{SPALTE[v]}{ss})", FMT_PCT,
                f"{'−' if sg else ''}Zeile {rr} ÷ Zeile {ss}")
    a1 = b.zeile_von["t1s.anteil_bewirtschaftung"]
    b.zeile("T1.36", "t1s.anteil_summe", "Summe der Anteile (Probe = 100 %)", "Anteil",
            lambda v, r: f"=SUM({SPALTE[v]}{a1}:{SPALTE[v]}{a1 + 4})", FMT_PCT, "T1.31 bis T1.35")
    b.leer()

    # ---------------- T1 Mieten, Schwellen ---------------------------------------------------------------
    b.kopf("T1 Mieten und Schwellen Jahr 1")
    b.zeile("T1.40", "t1.kostendeckende_anfangsmiete", "Kostendeckende Anfangsmiete (Zahlungsüberschuss Jahr 1 = 0)",
            "€/m² Monat",
            lambda v, r: {"A": "='Übersicht'!$D$112", "B": "='Übersicht'!$E$112", "C": "='Übersicht'!$F$112",
                          "frei_markt": "='Übersicht'!$G$112", "frei_dscr": "='Frei finanziert'!$H$183"}[v],
            FMT_EUR2, "Übersicht 8.3 mit DSCR-Ziel der Mappe 1,0 (Eingabe 10.2); Frei DSCR wie Frei finanziert")
    b.zeile("T1.41", "t1.abstand_hoechstmiete_kostendeckend", "Höchstmiete minus kostendeckende Anfangsmiete",
            "€/m² Monat", lambda v, r: f"={SPALTE[v]}49-{SPALTE[v]}{r - 1}", FMT_EUR2, "N5.1 − T1.40",
            varianten=["A", "B", "C"])
    b.zeile("T1.42", "t1.abstand_dscr_miete_marktmiete", "Miete für DSCR 1,2 minus Marktmiete", "€/m² Monat",
            lambda v, r: "=H50-H51", FMT_EUR2, "N5.2 − N5.3 (Spalte H)", varianten=["frei_dscr"])
    b.zeile("T1.43", "t1.kostenschwelle_zue0", "Herstellungskosten je m², bei denen der Zahlungsüberschuss Jahr 1 "
            "null ist", "€/m²",
            lambda v, r: f"=IF(N({SPALTE[v]}60)=0,0,Herstellungskosten_qm*{SPALTE[v]}59/{SPALTE[v]}60)", FMT_EUR,
            "Eingabe 2.1 × N5.10 ÷ N5.11; gilt ohne Aufschub, KG 800 und Grundstück 0, bis zur Bemessungsgrenze",
            varianten=["A", "B", "C"])
    b.zeile("T1.44", "t1.kostenschwelle_dscr12", "Herstellungskosten je m², bei denen die DSCR Jahr 1 genau 1,2 ist",
            "€/m²", lambda v, r: f"=IF(ISNUMBER({SPALTE[v]}62),Herstellungskosten_qm*{SPALTE[v]}62/$D$6,0)", FMT_EUR,
            "Eingabe 2.1 × N5.13 ÷ N1.1; Bedingungen wie T1.43", varianten=["A", "B", "C"])
    b.zeile("T1.45", "t1.letztes_jahr_dscr_unter_ziel", "Letztes Jahr mit DSCR unter 1,2 (Jahr 1–35; 0 = keins)",
            "Jahr",
            lambda v, r: (f"=SUMPRODUCT(MAX(('Konzepte Zeitreihe'!${DSCR_ZR[v]}$7:${DSCR_ZR[v]}$41<$D$6)*"
                          f"ISNUMBER('Konzepte Zeitreihe'!${DSCR_ZR[v]}$7:${DSCR_ZR[v]}$41)*"
                          f"'Konzepte Zeitreihe'!$A$7:$A$41))"), FMT_N,
            "Konzepte Zeitreihe, Spalte DSCR der Variante, Jahr 1–35")
    b.zeile("T1.46", "t1.letztes_jahr_kapitaldienst", "Letztes Jahr mit Kapitaldienst (Darlehen getilgt)", "Jahr",
            lambda v, r: (f"=SUMPRODUCT(MAX((-{BL[v]}!${GEF['kd'] if v in ('A', 'B', 'C') else FREI['kd']}$7:"
                          f"${GEF['kd'] if v in ('A', 'B', 'C') else FREI['kd']}$48>1)*{BL[v]}!$A$7:$A$48))"),
            FMT_N, "Blatt der Variante, Spalte Kapitaldienst, Jahr 1–42")
    b.leer()

    # ---------------- T1 Eigenkapital-Rückfluss ------------------------------------------------------------
    b.kopf("T1 Eigenkapital-Rückfluss: kumulierter Zahlungsüberschuss minus Eigenkapital, Jahr 0 bis 35")
    rueck_von = b.r
    for t in range(0, 36):
        zr = 6 + t
        b.zeile(f"T1.R{t}", f"t1.rueckfluss.j{t:02d}", f"Jahr {t}: kumulierter Zahlungsüberschuss − Eigenkapital",
                "€", lambda v, r, zr=zr: f"='Konzepte Zeitreihe'!${KUM_ZR[v]}${zr}-{SPALTE[v]}$56", FMT_EUR,
                f"Konzepte Zeitreihe Zeile {zr} (kumuliert, unverzinst) − N5.8")
    rueck_bis = b.r - 1
    b.leer()

    # ---------------- Prüfungen ----------------------------------------------------------------------------
    b.kopf("T1 Prüfungen")
    pr_von = b.r
    pruef = [
        ("P1", "Jahr 1: T1.6, T1.10, T1.11 gleich N5.10, N5.11, N5.12",
         "=IF(SUMPRODUCT(ABS(D{a}:H{a}-D59:H59))+SUMPRODUCT(ABS(-D{k}:H{k}-D60:H60))+SUMPRODUCT(ABS(D{u}:H{u}-D61:H61))"
         "<0.05,\"OK\",\"prüfen\")".format(a=b.zeile_von["t1.uevk_jahr1"], k=b.zeile_von["t1.kapitaldienst_jahr1"],
                                          u=b.zeile_von["t1.zue_jahr1"])),
        ("P2", "Jahr 1: Zeile 5 + Kapitaldienst = Zeile 9; Anteile = 100 %",
         "=IF(AND(SUMPRODUCT(ABS(D{a}:H{a}+D{k}:H{k}-D{u}:H{u}))<0.05,SUMPRODUCT((D{q}:H{q}<>0)*ABS(D{s}:H{s}-1))<0.0001),"
         "\"OK\",\"prüfen\")".format(a=b.zeile_von["t1.uevk_jahr1"], k=b.zeile_von["t1.kapitaldienst_jahr1"],
                                    u=b.zeile_von["t1.zue_jahr1"], s=b.zeile_von["t1.anteil_summe_jahr1"],
                                    q=b.zeile_von["t1.sollmiete_jahr1"])),
        ("P3", "Summe Jahr 1–35: Zahlungsüberschuss = N5.16; Anteile = 100 %",
         "=IF(AND(SUMPRODUCT(ABS(D{u}:H{u}-D66:H66))<0.05,SUMPRODUCT((D{q}:H{q}<>0)*ABS(D{s}:H{s}-1))<0.0001),\"OK\",\"prüfen\")"
         .format(u=b.zeile_von["t1s.zue"], s=b.zeile_von["t1s.anteil_summe"], q=b.zeile_von["t1s.sollmiete"])),
        ("P4", "Rückfluss: erstes Jahr ab null = N5.17",
         "=IF(AND(" + ",".join(f"COUNTIF({SPALTE[v]}{rueck_von}:{SPALTE[v]}{rueck_bis},\"<0\")={SPALTE[v]}67"
                                for v in VAR) + "),\"OK\",\"prüfen\")"),
        ("P5", "Letztes Jahr DSCR unter 1,2 passt zu N5.23 (Jahre unter 1,2)",
         "=IF(AND(" + ",".join(f"{SPALTE[v]}{b.zeile_von['t1.letztes_jahr_dscr_unter_ziel']}>={SPALTE[v]}73"
                                for v in VAR) + "),\"OK\",\"prüfen\")"),
        ("P6", "Kostenschwellen liegen unter der Bemessungsgrenze (Formel gilt)",
         "=IF(MAX(D{k}:F{k})<=INDEX(Bemessungsgrenzen,MATCH(Mietenstufe,Mietenstufen,0)),\"OK\",\"prüfen\")"
         .format(k=b.zeile_von["t1.kostenschwelle_zue0"])),
        ("P7", "Prüfungen der Mappe und des Blocks K weiter OK",
         "=IF(AND('Übersicht'!$D$3=\"OK\",$D$3=\"OK\"),\"OK\",\"prüfen\")"),
    ]
    for nr, text, f in pruef:
        r = b.r
        b.set(f"A{r}", nr)
        b.set(f"B{r}", text)
        b.set(f"C{r}", f)
        b.r += 1
    pr_bis = b.r - 1
    b.set(f"D{status_r}", f'=IF(COUNTIF(C{pr_von}:C{pr_bis},"OK")=ROWS(C{pr_von}:C{pr_bis}),"OK","prüfen")', font=FETT)
    b.eintraege.append(("t1.status", status_r, "Text", "Gesamtstatus der Prüfungen T1 (P1 bis P7)", ["_status"]))
    return b, (pr_von, pr_bis), status_r


def finde_recalc(arg):
    if arg:
        return Path(arg)
    for t in sorted(Path("/root").glob(".*/skills/**/xlsx/scripts/recalc.py")):
        return t
    p = Path("/mnt/skills/public/xlsx/scripts/recalc.py")
    if p.exists():
        return p
    sys.exit("recalc.py nicht gefunden (--recalc PFAD)")


def neu_berechnen(datei, recalc):
    p = subprocess.run([sys.executable, str(recalc), str(datei), "240"], capture_output=True, text=True)
    txt = p.stdout.strip()
    try:
        res = json.loads(txt[txt.index("{"):])
    except Exception:
        sys.exit(f"recalc ohne Ergebnis: {txt[:400]} {p.stderr[:400]}")
    subprocess.run([sys.executable, "-B", str(GENERATOR), "--nachbearbeiten", str(datei)], check=True,
                   capture_output=True)
    return res


def gleich(a, b, tol=1e-9):
    if isinstance(a, (int, float)) and isinstance(b, (int, float)) and not isinstance(a, bool):
        return abs(a - b) <= tol * max(1.0, abs(a), abs(b))
    return a == b


def vergleiche(quelle, kopie):
    """Alle Blätter der Konzepte-Mappe gegen die Kopie; Blatt Konzepte nur bis Zeile 106 (darunter Block T1)."""
    erg = dict(zellen=0, formeln=0, abweichungen=[])
    for data_only in (False, True):
        wq = openpyxl.load_workbook(quelle, data_only=data_only)
        wk = openpyxl.load_workbook(kopie, data_only=data_only)
        assert wq.sheetnames == wk.sheetnames, (wq.sheetnames, wk.sheetnames)
        for name in wq.sheetnames:
            sq, sk = wq[name], wk[name]
            mr = max(sq.max_row, sk.max_row)
            if name == BLATT:
                mr = START - 1
            mc = max(sq.max_column, sk.max_column)
            for row in range(1, mr + 1):
                for col in range(1, mc + 1):
                    a, c = sq.cell(row, col).value, sk.cell(row, col).value
                    if a is None and c is None:
                        continue
                    if not data_only:
                        erg["zellen"] += 1
                        if isinstance(a, str) and a.startswith("="):
                            erg["formeln"] += 1
                    if not gleich(a, c):
                        erg["abweichungen"].append(("Wert" if data_only else "Formel", name,
                                                    f"{get_column_letter(col)}{row}", a, c))
    return erg


def roh(v):
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
        return None
    return v


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--recalc", default=None)
    a = ap.parse_args()
    recalc = finde_recalc(a.recalc)

    print("1. kopieren", flush=True)
    shutil.copy(QUELLE, ZIEL)
    wb = openpyxl.load_workbook(ZIEL)
    print("2. Block T1", flush=True)
    b, (pr_von, pr_bis), status_r = baue_block(wb)
    wb.save(ZIEL)
    print("3. neu rechnen", flush=True)
    res = neu_berechnen(ZIEL, recalc)
    print("   recalc:", {k: res.get(k) for k in ("status", "total_errors", "total_formulas")}, flush=True)
    if res.get("status") != "success" or res.get("total_errors"):
        sys.exit(f"recalc mit Fehlern: {res}")
    print("4. vergleichen", flush=True)
    erg = vergleiche(QUELLE, ZIEL)
    print(f"   {erg['zellen']} Zellen, davon {erg['formeln']} Formeln; Abweichungen: {len(erg['abweichungen'])}")
    for x in erg["abweichungen"][:20]:
        print("   ", x)
    if erg["abweichungen"]:
        sys.exit("Abweichungen gegen die Konzepte-Mappe")

    wv = openpyxl.load_workbook(ZIEL, data_only=True)
    ws = wv[BLATT]
    status = {"Übersicht D3": wv["Übersicht"]["D3"].value, "Konzepte D3": ws["D3"].value,
              f"Konzepte D{status_r} (T1)": ws[f"D{status_r}"].value}
    for r in range(pr_von, pr_bis + 1):
        status[f"{ws[f'A{r}'].value} {ws[f'B{r}'].value}"] = ws[f"C{r}"].value
    print("5. Status:", json.dumps(status, ensure_ascii=False, indent=1))
    if any(v != "OK" for v in status.values()):
        sys.exit("Prüfung nicht OK")

    # Gegenprobe Kostenschwelle (T1.43) gegen die Läufe kosten_4631 und kosten_5460 der Konzepte-Mappe:
    # Zahlungsüberschuss Jahr 1 ist linear in den Kosten, ZÜ(K) = ÜvK − KD × K ÷ K0.
    wk = json.load(open(WERTE_KONZEPTE, encoding="utf-8"))
    basis = wk["laeufe"]["konzepte"]["werte"]
    for lauf, k in (("kosten_4631", 4631), ("kosten_5460", 5460)):
        lw = wk["laeufe"][lauf]["werte"]
        for v in ("A", "B", "C"):
            uevk, kd = basis[f"n5.uevk_jahr1.{v}"]["wert"], basis[f"n5.kapitaldienst_jahr1.{v}"]["wert"]
            k0 = basis["annahme.herstellungskosten_qm"]["wert"]
            soll = uevk - kd * k / k0
            ist = lw[f"n6.{lauf}.zue_jahr1.{v}"]["wert"]
            assert abs(soll - ist) < 1.0, (lauf, v, soll, ist)
    print("   Gegenprobe Kostenschwelle gegen Läufe kosten_4631, kosten_5460: OK (Abweichung < 1 €)")

    # Werte schreiben
    werte = {}
    for schl, r, einheit, bed, varianten in b.eintraege:
        if varianten == ["_status"]:
            werte[schl] = dict(schluessel=schl, wert=ws[f"D{r}"].value, einheit=einheit, blatt=BLATT, zelle=f"D{r}",
                               bedeutung=bed, lauf="team1")
            continue
        for v in varianten:
            adr = f"{SPALTE[v]}{r}"
            k = f"{schl}.{v}"
            werte[k] = dict(schluessel=k, wert=roh(ws[adr].value), einheit=einheit, blatt=BLATT, zelle=adr,
                            bedeutung=f"{bed}; {NAME[v]}", lauf="team1")
    # Rückfluss zusätzlich als Reihe (Jahr 0 bis 35) je Variante
    for v in VAR:
        rr = [b.zeile_von[f"t1.rueckfluss.j{t:02d}"] for t in range(36)]
        werte[f"t1.rueckfluss.{v}"] = dict(
            schluessel=f"t1.rueckfluss.{v}", wert=[roh(ws[f"{SPALTE[v]}{r}"].value) for r in rr], einheit="€",
            blatt=BLATT, zelle=f"{SPALTE[v]}{rr[0]}:{SPALTE[v]}{rr[-1]}",
            bedeutung=f"Kumulierter Zahlungsüberschuss minus Eigenkapital, Jahr 0 bis 35; {NAME[v]}", lauf="team1")
    # Bestehende Zellen der Mappe, die werte_konzepte.json nicht führt (Anhang Tilgungssatz)
    wu = wv["Übersicht"]
    for r in range(55, 63):
        for v, sp in (("A", "D"), ("B", "E"), ("C", "F")):
            k = f"ue.tilgungsraster.r{r}.{v}"
            werte[k] = dict(schluessel=k, wert=roh(wu[f"{sp}{r}"].value), einheit="€ p. a.", blatt="Übersicht",
                            zelle=f"{sp}{r}", bedeutung=f"Übersicht 4.{r - 54} Zahlungsüberschuss Jahr 1 je "
                            f"Tilgungssatz; Gruppe {v}", lauf="team1")
        k = f"ue.tilgungsraster.r{r}.satz"
        werte[k] = dict(schluessel=k, wert=roh(wu[f"B{r}"].value), einheit="Anteil", blatt="Übersicht", zelle=f"B{r}",
                        bedeutung=f"Übersicht 4.{r - 54} Tilgungssatz", lauf="team1")
    for k, adr, bed in (("ue.tilgungsschwelle.B_gegen_A", "E63", "Übersicht 4.9 Tilgungsschwelle B gegenüber A"),
                        ("ue.tilgungsschwelle.C_gegen_A", "F64", "Übersicht 4.10 Tilgungsschwelle C gegenüber A")):
        werte[k] = dict(schluessel=k, wert=roh(wu[adr].value), einheit="Anteil", blatt="Übersicht", zelle=adr,
                        bedeutung=bed, lauf="team1")
    # Tilgungsschwellen der Kostenläufe (Anhang Tilgungsschwelle): Zellen Übersicht E63, F64 der Laufkopien
    for lauf in ("kosten_4631", "kosten_5460"):
        datei = KONZEPTE / "laeufe" / f"{lauf}.xlsx"
        wl = openpyxl.load_workbook(datei, data_only=True)["Übersicht"]
        for k, adr, bed in (("B_gegen_A", "E63", "Übersicht 4.9 Tilgungsschwelle B gegenüber A"),
                            ("C_gegen_A", "F64", "Übersicht 4.10 Tilgungsschwelle C gegenüber A")):
            kk = f"lauf.{lauf}.tilgungsschwelle.{k}"
            werte[kk] = dict(schluessel=kk, wert=roh(wl[adr].value), einheit="Anteil", blatt="Übersicht", zelle=adr,
                             bedeutung=f"{bed}; Lauf {lauf} (Datei konzepte/mappe/laeufe/{lauf}.xlsx)", lauf=lauf)
    for v, sp in (("A", "D"), ("B", "E"), ("C", "F"), ("frei_markt", "G")):
        k = f"ue.zue_jahr10.{v}"
        werte[k] = dict(schluessel=k, wert=roh(wu[f"{sp}42"].value), einheit="€ p. a.", blatt="Übersicht",
                        zelle=f"{sp}42", bedeutung=f"Übersicht 3.1 Zahlungsüberschuss Jahr 10; {v}", lauf="team1")

    out = dict(
        meta=dict(titel="Werte des Blocks T1 (Team 1, Geldfluss) und weitere Zellen der Konzepte-Mappe",
                  mappe=ZIEL.name, grundlage="konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx",
                  erzeugt_mit="konzepte/team-1/mappe/build_team1.py", neuberechnung="recalc.py (LibreOffice)",
                  vergleich=dict(zellen=erg["zellen"], formeln=erg["formeln"], abweichungen=len(erg["abweichungen"])),
                  status=status, recalc={k: res.get(k) for k in ("status", "total_errors", "total_formulas")},
                  hinweise=["Werte roh; Abzüge negativ wie in den Blättern der Varianten; Anteile als Dezimalbruch.",
                            "Neue Zellen nur auf Blatt Konzepte ab Zeile 108; alle anderen Zellen gleich der "
                            "Konzepte-Mappe.", "Keine neue Annahme: alle Zellen sind Formeln."]),
        werte=werte)
    (HIER / "werte_team.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"6. werte_team.json: {len(werte)} Werte", flush=True)


if __name__ == "__main__":
    main()
