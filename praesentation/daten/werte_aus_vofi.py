#!/usr/bin/env python3
"""Werte der VOFI-Mappe v3 für die Präsentation bereitstellen.

Liest die Mappe PGN_VOFI_Mietwohnraum_2026_v3.xlsx (nur lesend), rechnet
Kopien in einem Arbeitsordner mit LibreOffice neu und schreibt werte.json.
Die Folien holen jede Zahl der Modellrechnung aus werte.json; im Foliencode
steht keine Zahl der Mappe von Hand.

Aufruf (im Ordner praesentation):
    python daten/werte_aus_vofi.py --recalc PFAD/recalc.py
    python daten/werte_aus_vofi.py            # ohne recalc.py: LibreOffice direkt

Optionen:
    --mappe PFAD          Mappe (Vorgabe: ../vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx)
    --ziel PFAD           Ausgabe (Vorgabe: daten/werte.json)
    --recalc PFAD         Neuberechnungsskript recalc.py (auch Umgebungsvariable VOFI_RECALC)
    --arbeitsordner PFAD  Ordner für die Kopien; bleibt erhalten. Ohne Angabe:
                          temporärer Ordner, der am Ende gelöscht wird.

Jeder Wert in werte.json hat: schluessel, wert (roh, ungerundet), einheit,
blatt, zelle, bedeutung, lauf. Reihen (Zeitreihe, Tilgungsraster) stehen als
Liste in „wert“, die Zelle ist dann ein Bereich.

Das Modellhaus ist Projekt 2 der Mappe (PGN-Projekt in Neu Wulmstorf, Grundstück
im Bestand; Entscheidung des Auftraggebers vom 11.11.2026). Jeder Lauf setzt
dafür Eingaben!D3 auf 2, gleich ob die Mappe mit Projekt 1 oder Projekt 2
ausgeliefert ist. Die Eingaben von Projekt 2 stehen in Spalte E, die verwendeten
Werte in Spalte F; Änderungen eines Laufs stehen deshalb in Spalte E.

Nicht exportiert werden Renditen, Restwerte, der Förderbarwert, das Blatt
NBank sowie alles, was an der Markt- oder Vergleichsmiete hängt (Sperrliste).
Einzige Ausnahme ist der Lauf „modellhaus_rendite“ für die Anhangfolie A7
(AUSNAHMEN): Er liest genau die dort genannten Zellen und keine weitere.

Abgleich mit der Broschüre S. 10–12, der Altfassung und einer Handrechnung:
    python daten/pruefe_werte.py
"""

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import openpyxl
from openpyxl.utils import column_index_from_string, get_column_letter, range_boundaries

HIER = Path(__file__).resolve().parent
MAPPE = HIER.parent.parent / "vofi" / "PGN_VOFI_Mietwohnraum_2026_v3.xlsx"
ZIEL = HIER / "werte.json"

GRUPPEN = ("A", "B", "C")
SPALTE = {"A": "D", "B": "E", "C": "F", "Frei": "G"}
BLATT = {"A": "Gefördert A", "B": "Gefördert B", "C": "Gefördert C", "Frei": "Frei finanziert"}
NAME = {"A": "Gruppe A", "B": "Gruppe B", "C": "Gruppe C", "Frei": "frei finanziert"}
STUFEN = ("I", "II", "III", "IV", "V", "VI", "VII")
JAHRE = (7, 48)  # Zeilen der Zeitreihe: Jahr 1 bis 42

EINHEITEN = {
    "€": "Euro, einmalig oder Bestand",
    "€ p. a.": "Euro je Jahr",
    "€/m²": "Euro je m² Wohnfläche",
    "€/m² p. a.": "Euro je m² Wohnfläche und Jahr",
    "€/m² Monat": "Euro je m² Wohnfläche und Monat, nettokalt",
    "m²": "Quadratmeter Wohnfläche",
    "Anteil": "Dezimalbruch; mal 100 ergibt Prozent (0,025 = 2,5 %)",
    "Faktor": "Verhältniszahl ohne Einheit",
    "Jahre": "Anzahl Jahre",
    "Jahr": "Jahr der Rechnung (1 bis 42) oder Kalenderjahr",
    "Anzahl": "Stückzahl",
    "Nummer": "Kennziffer",
    "Text": "Textwert der Mappe",
}


# --------------------------------------------------------------------------
# Sperrliste: Zellen, die nie exportiert werden (Entscheidung E5)
# --------------------------------------------------------------------------

def _in(zelle, bereich):
    c1, r1, c2, r2 = range_boundaries(bereich)
    zc1, zr1, zc2, zr2 = range_boundaries(zelle)
    return not (zc2 < c1 or zc1 > c2 or zr2 < r1 or zr1 > r2)


SPERRE = {
    "NBank": [("A1:Z200", "Blatt NBank ist intern")],
    "Übersicht": [
        ("A74:L107", "Renditen und Restwert"),
        ("D17:G17", "Förderbarwert"),
        ("G26:G26", "Miete frei = Marktmiete"),
        ("G29:G30", "Sollmiete frei zur Marktmiete"),
        ("G33:G33", "Überschuss frei zur Marktmiete"),
        ("G38:G38", "Zahlungsüberschuss frei zur Marktmiete"),
        ("G42:G48", "Liquidität frei zur Marktmiete"),
        ("G113:G115", "Marktmiete und Aufschlag auf die Marktmiete"),
        ("L1:L123", "Aufschlag auf die Marktmiete"),
    ],
    "Eingaben": [
        ("D20:F20", "Swapsatz (NBank, intern)"),
        ("D24:F26", "Vergleichs- und Marktmiete"),
        ("D41:F46", "Projektkonto und Restwert"),
        ("D4:F4", "Projektname (Projekt 2 mit Straßenname)"),
    ],
    "Gefördert": [
        ("C6:E86", "Vergleichs-, Markt- und Zielmiete"),
        ("V6:V86", "Projektkonto (VOFI)"),
        ("X6:AS86", "Restwert und Zahlungsreihen der Renditen"),
        ("H116:J151", "Restwert und Renditen"),
        ("H168:J169", "Barwertvorteil und Projektkonto"),
        ("H172:J177", "Förderbarwert und Objektrendite"),
    ],
    "Frei finanziert": [
        ("C6:F86", "Marktmiete und Miete laut Eingabe 10.1"),
        ("I6:I86", "Überschuss zur Marktmiete"),
        ("M6:N86", "Zahlungsüberschuss und DSCR zur Marktmiete"),
        ("P6:AB86", "Projektkonto und Zahlungsreihen der Renditen"),
        ("H109:H109", "Miete laut Eingabe 10.1"),
        ("H116:J169", "Restwert, Renditen, Liquidität zur Marktmiete"),
        ("H184:H186", "Marktmiete und Aufschlag"),
    ],
}


def gesperrt(blatt, zelle):
    regeln = SPERRE.get("Gefördert" if blatt.startswith("Gefördert") else blatt, [])
    for bereich, grund in regeln:
        if _in(zelle, bereich):
            return grund
    return None


# --------------------------------------------------------------------------
# Ausnahmen von der Sperrliste: benannt, an einen Lauf gebunden, Zelle für Zelle
# --------------------------------------------------------------------------
# Die Sperrliste gilt weiter. Eine Ausnahme öffnet genau die genannten Zellen
# für genau einen Lauf; jede andere gesperrte Zelle bricht den Lauf ab, und
# kein anderer Lauf liest eine dieser Zellen.
#
# anhang_rendite: Der Auftraggeber will eine Anhangfolie zur Eigenkapitalrendite,
# weil Investoren danach fragen (erlaubt am 11.11.2026). E5 gilt für alle
# anderen Folien weiter. Bedingung laut Blatt Hinweise der Mappe, Nr. 12:
# Renditen nur als Paar „mit Restwert / nur Bodenwert“ mit dem Restwertanteil.
# Das Modellhaus ist seit 11.11.2026 Projekt 2 der Mappe (Neu Wulmstorf). Seine
# Marktmiete (Eingabe 4.4, Spalte Projekt 2) kommt aus der Mietübersicht des Gutachterausschusses
# Lüneburg (Hamburger Umland, Stand 01.01.2026), sein Liegenschaftszins aus dem Landesmodell Mehrfamilienhäuser
# des Oberen Gutachterausschusses (Tabellen, Tabelle 4, Spalte Projekt 2). Beide
# Werte stehen als Annahme mit ihrer Herkunft auf der Folie. Das Grundstück ist
# nicht angesetzt: Die Lesart „nur Bodenwert“ rechnet deshalb ohne Restwert
# (Hinweise Nr. 15).
AUSNAHMEN = [
    dict(
        name="anhang_rendite",
        lauf="modellhaus_rendite",
        erlaubt_von="Auftraggeber",
        erlaubt_am="11.11.2026",
        zweck="Anhangfolie A7 „Eigenkapitalrendite“ (Folie anhang-rendite); auf keiner anderen Folie",
        bedingung="Renditen nur als Paar „mit Restwert / nur Bodenwert“ mit dem Restwertanteil (Mappe, Blatt Hinweise, Nr. 12)",
        zellen={
            "Übersicht": [
                ("G47", "Jahre mit Fehlbetrag, frei finanziert zur Marktmiete"),
                ("D91:G91", "VOFI-EK-Rendite, mit Restwert"),
                ("D92:G92", "VOFI-EK-Rendite, nur Bodenwert"),
                ("D93:G93", "Restwertanteil am Endvermögen"),
                ("D96:G96", "Tiefster Stand des Projektkontos"),
                ("D100:G100", "Restwert Ende Jahr 35"),
                ("D106:G106", "Liegenschaftszins"),
            ],
            "Eingaben": [
                ("F25", "Marktmiete Neuvermietung, Jahr 1"),
                ("F26", "Steigerung Markt- und Vergleichsmiete"),
                ("F41", "Guthabenzins Projektkonto"),
                ("F42", "Sollzins Projektkonto"),
                ("F44", "Bodenwertsteigerung"),
            ],
        },
    ),
]


def _innerhalb(zelle, bereich):
    c1, r1, c2, r2 = range_boundaries(bereich)
    zc1, zr1, zc2, zr2 = range_boundaries(zelle)
    return c1 <= zc1 and zc2 <= c2 and r1 <= zr1 and zr2 <= r2


def ausnahme(lauf, blatt, zelle):
    """Name der Ausnahme, die diese Zelle für diesen Lauf öffnet, sonst None.
    Die Zelle muss ganz in einem genannten Bereich liegen."""
    for a in AUSNAHMEN:
        if a["lauf"] != lauf:
            continue
        for bereich, _ in a["zellen"].get(blatt, []):
            if _innerhalb(zelle, bereich):
                return a["name"]
    return None


def pruefe_ausnahmen(laeufe):
    """Jede Ausnahme nennt einen Lauf, den es gibt, und nur gesperrte Zellen;
    der Lauf liest jede genannte Zelle (keine Ausnahme auf Vorrat)."""
    namen = {l["lauf"]: l for l in laeufe}
    for a in AUSNAHMEN:
        if a["lauf"] not in namen:
            sys.exit(f"Ausnahme {a['name']}: Den Lauf {a['lauf']} gibt es nicht.")
        for feld in ("erlaubt_von", "erlaubt_am", "zweck", "bedingung"):
            if not a.get(feld):
                sys.exit(f"Ausnahme {a['name']}: „{feld}“ fehlt.")
        gelesen = [(w["blatt"], w["zelle"]) for w in namen[a["lauf"]]["katalog"]]
        for blatt, bereiche in a["zellen"].items():
            for bereich, _ in bereiche:
                if not gesperrt(blatt, bereich):
                    sys.exit(f"Ausnahme {a['name']}: {blatt}!{bereich} ist nicht gesperrt; der Eintrag ist überflüssig.")
                c1, r1, c2, r2 = range_boundaries(bereich)
                for sp in range(c1, c2 + 1):
                    for ze in range(r1, r2 + 1):
                        einzel = f"{get_column_letter(sp)}{ze}"
                        if not any(b == blatt and _innerhalb(einzel, z) for b, z in gelesen):
                            sys.exit(f"Ausnahme {a['name']}: {blatt}!{einzel} ist geöffnet, aber der Lauf {a['lauf']} liest die Zelle nicht.")


# --------------------------------------------------------------------------
# Katalog der Werte
# --------------------------------------------------------------------------

def W(schluessel, blatt, zelle, einheit, bedeutung, leer=False):
    """leer=True: einzelne Werte einer Reihe dürfen fehlen (null in werte.json)."""
    return dict(schluessel=schluessel, blatt=blatt, zelle=zelle, einheit=einheit, bedeutung=bedeutung, leer=leer)


def je_gruppe(praefix, zeile, einheit, bedeutung, gruppen=GRUPPEN):
    """Eine Zeile der Übersicht, je Gruppe eine Spalte."""
    return [
        W(f"{praefix}.{g}", "Übersicht", f"{SPALTE[g]}{zeile}", einheit, f"{bedeutung}; {NAME[g]}")
        for g in gruppen
    ]


def katalog_eingaben():
    e = lambda k, z, einheit, b: W(f"eingabe.{k}", "Eingaben", z, einheit, b)
    return [
        e("projekt_nr", "D3", "Nummer", "Aktives Projekt: 2 = Modellhaus (PGN-Projekt in Neu Wulmstorf); 1 = früheres Rechenbeispiel"),
        e("bezugsjahr", "F7", "Jahr", "Eingabe 1.1 Bezugsjahr; T0 = Bezugsfertigkeit"),
        e("wohnflaeche", "F8", "m²", "Eingabe 1.2 Wohnfläche"),
        e("wohnungen", "F9", "Anzahl", "Eingabe 1.3 Wohnungen"),
        e("herstellungskosten_qm", "F11", "€/m²", "Eingabe 2.1 Herstellungskosten KG 200–700 je m² Wohnfläche"),
        e("finanzierungskosten_kg800", "F12", "€", "Eingabe 2.2 Finanzierungskosten KG 800 (Ansatz 0)"),
        e("grundstueck", "F13", "€", "Eingabe 2.3 Grundstück, Ansatz in Kosten und Förderung (Modellhaus: Grundstück im Bestand, Ansatz 0)"),
        e("tilgung_nbank", "F17", "Anteil", "Eingabe 3.1 Tilgung NBank-Darlehen, linear, p. a. (PGN-Annahme; den Satz legt die NBank fest)"),
        e("tilgungsaufschub", "F18", "Jahre", "Eingabe 3.2 Tilgungsaufschub"),
        e("zins_nbank_ab_jahr36", "F19", "Anteil", "Eingabe 3.3 Zins NBank-Darlehen ab Jahr 36, p. a. (PGN-Annahme)"),
        e("mietenstufe", "F22", "Text", "Eingabe 4.1 Mietenstufe"),
        e("eh40", "F23", "Text", "Eingabe 4.2 Effizienzhaus 40 erreicht (ja/nein)"),
        e("kappungsgrenze", "F27", "Anteil", "Eingabe 4.6 Kappungsgrenze nach Bindungsende, in 3 Jahren (§ 558 Abs. 3 BGB)"),
        e("mietausfall", "F29", "Anteil", "Eingabe 5.1 Mietausfall/Leerstand, Anteil der Sollmiete (PGN-Annahme)"),
        e("objektverwaltung_je_wohnung", "F30", "€ p. a.", "Eingabe 5.2 Objektverwaltung je Wohnung (PGN-Annahme, Kostenstand 2026)"),
        e("instandhaltung_je_qm", "F31", "€/m² p. a.", "Eingabe 5.3 Instandhaltung je m² Wohnfläche (PGN-Annahme, Kostenstand 2026)"),
        e("kostensteigerung", "F32", "Anteil", "Eingabe 5.4 Kostensteigerung ab Jahr 2, p. a. (PGN-Annahme)"),
        e("kostenstand_fortschreibung", "F33", "Jahre", "Eingabe 5.5 Kostensätze 2026 fortschreiben um … Jahre"),
        e("zins_bank", "F35", "Anteil", "Eingabe 6.1 Zins Bankdarlehen p. a. (PGN-Annahme)"),
        e("zinsbindung", "F36", "Jahre", "Eingabe 6.2 Zinsbindung Bankdarlehen"),
        e("anschlusszins", "F37", "Anteil", "Eingabe 6.3 Anschlusszins Bankdarlehen p. a. (PGN-Annahme)"),
        e("laufzeit_bank", "F38", "Jahre", "Eingabe 6.4 Laufzeit Bankdarlehen, Annuität (PGN-Annahme)"),
        e("eigenkapital_zusatz", "F40", "€", "Eingabe 7.1 Zusätzliches Eigenkapital bar, mindert das Bankdarlehen"),
        e("miete_frei", "F53", "Text", "Eingabe 10.1 Miete frei finanziert (Auswahl)"),
        e("dscr_ziel", "F54", "Faktor", "Eingabe 10.2 DSCR-Ziel für die nötige Miete"),
    ]


def katalog_finanzierung():
    k = []
    k += je_gruppe("fin.gesamtkosten", 9, "€", "Übersicht 1.1 Gesamtkosten", GRUPPEN + ("Frei",))
    k += je_gruppe("fin.zuwendungsfaehige_kosten", 10, "€", "Übersicht 1.2 Zuwendungsfähige Kosten")
    k += je_gruppe("fin.ueber_bemessungsgrenze", 11, "€", "Übersicht 1.3 Herstellung über der Bemessungsgrenze, nicht zuwendungsfähig")
    k += je_gruppe("fin.grundstueck_ueber_bodenrichtwert", 12, "€", "Übersicht 1.4 Grundstück über Bodenrichtwert × Fläche")
    k += je_gruppe("fin.darlehen_nbank", 13, "€", "Übersicht 1.5 NBank-Darlehen")
    k += je_gruppe("fin.zuschuss", 14, "€", "Übersicht 1.6 Zuschuss")
    k += je_gruppe("fin.foerderung", 15, "€", "Übersicht 1.7 Förderung gesamt (Darlehen + Zuschuss)")
    k += je_gruppe("fin.foerderquote", 16, "Anteil", "Übersicht 1.8 Förderquote auf die Gesamtkosten")
    k += je_gruppe("fin.bankdarlehen", 18, "€", "Übersicht 1.10 Bankdarlehen (gefördert: Restfinanzierung; frei: Rest nach Eigenmitteln)", GRUPPEN + ("Frei",))
    k += je_gruppe("fin.eigenmittel", 19, "€", "Übersicht 1.11 Eigenmittel (RL Nr. 5.2.6), ohne Entgelte", GRUPPEN + ("Frei",))
    k += je_gruppe("fin.eigenmittelquote", 20, "Anteil", "Übersicht 1.12 Eigenmittelquote auf die zuwendungsfähigen Kosten", GRUPPEN + ("Frei",))
    k += je_gruppe("fin.bearbeitungsentgelte", 21, "€", "Übersicht 1.13 Bearbeitungsentgelte, einmalig (1 % des Darlehens + 0,75 % des Zuschusses)")
    k += je_gruppe("fin.eigenkapital", 22, "€", "Übersicht 1.14 Eigenkapital (Grundstück + bar) = Eigenmittel + Entgelte", GRUPPEN + ("Frei",))
    k += je_gruppe("fin.eigenkapital_bar", 23, "€", "Übersicht 1.15 Eigenkapital, davon bar", GRUPPEN + ("Frei",))
    k += je_gruppe("fin.zuschuss_je_wohnung", 24, "€", "Übersicht 1.16 Zuschuss je Wohnung")
    k += je_gruppe("fin.eigenmittel_je_wohnung", 25, "€", "Übersicht 1.17 Eigenmittel je Wohnung")
    k += je_gruppe("fin.miete_jahr1", 26, "€/m² Monat", "Übersicht 1.18 Miete Jahr 1 (Höchstmiete nettokalt)")
    k += [
        W("fin.herstellungskosten", "Gefördert A", "H90", "€", "Herstellungskosten KG 200–700, angesetzt (Wohnfläche × Eingabe 2.1)"),
        W("fin.grundstueck", "Gefördert A", "H92", "€", "Grundstück (Sacheinlage)"),
        W("fin.bemessungsgrenze_qm", "Gefördert A", "H95", "€/m²", "Bemessungsgrenze der Herstellungskosten für die Mietenstufe des Projekts"),
        W("fin.eigenmittel_bar", "Gefördert A", "H102", "€", "Eigenmittel bar (20 % der zuwendungsfähigen Kosten abzüglich Grundstück)"),
    ]
    for g in GRUPPEN:
        k.append(W(f"fin.darlehensquote.{g}", BLATT[g], "H97", "Anteil", f"Darlehensquote auf die zuwendungsfähigen Kosten; {NAME[g]}"))
        k.append(W(f"fin.zuschussquote.{g}", BLATT[g], "H98", "Anteil", f"Zuschussquote auf die zuwendungsfähigen Kosten; {NAME[g]}"))
    return k


def katalog_jahr1():
    u = lambda k, z, einheit, b: W(k, "Übersicht", z, einheit, b)
    k = []
    k += je_gruppe("jr1.sollmiete", 29, "€ p. a.", "Jahresrechnung Zeile 1 Sollmiete (Höchstmiete × Wohnfläche × 12)")
    k += je_gruppe("jr1.mietausfall", 30, "€ p. a.", "Jahresrechnung Zeile 1, Unterzeile: Mietausfall/Leerstand (Abzug, positiv geführt)")
    k += je_gruppe("jr1.objektverwaltung", 31, "€ p. a.", "Jahresrechnung Zeile 2 Objektverwaltung (Abzug, positiv geführt)", GRUPPEN + ("Frei",))
    k += je_gruppe("jr1.instandhaltung", 32, "€ p. a.", "Jahresrechnung Zeile 3 Instandhaltung (Abzug, positiv geführt)", GRUPPEN + ("Frei",))
    k += je_gruppe("jr1.ueberschuss_vor_kapitaldienst", 33, "€ p. a.", "Jahresrechnung Zeile 4 Überschuss vor Kapitaldienst")
    k += je_gruppe("jr1.verwaltungskostenbeitrag", 34, "€ p. a.", "Jahresrechnung Zeile 5 Verwaltungskostenbeitrag (Abzug, positiv geführt)")
    k += je_gruppe("jr1.zins_nbank", 35, "€ p. a.", "Jahresrechnung Zeile 6 Zins NBank-Darlehen (0 bis Ende Jahr 35)")
    k += je_gruppe("jr1.tilgung_nbank", 36, "€ p. a.", "Jahresrechnung Zeile 7 Tilgung NBank-Darlehen (Abzug, positiv geführt)")
    k += je_gruppe("jr1.kapitaldienst_bank", 37, "€ p. a.", "Jahresrechnung: Kapitaldienst Bankdarlehen (gefördert nur bei Restfinanzierung)", GRUPPEN + ("Frei",))
    k += je_gruppe("jr1.zahlungsueberschuss", 38, "€ p. a.", "Jahresrechnung Zeile 8 Zahlungsüberschuss")
    k += je_gruppe("jr1.bearbeitungsentgelte", 39, "€", "Einmalig, außerhalb der Jahresrechnung: Bearbeitungsentgelte")
    k += [
        u("jr1.satz.mietausfall", "C30", "Anteil", "Satz Mietausfall/Leerstand, Anteil der Sollmiete"),
        u("jr1.satz.objektverwaltung", "C31", "€ p. a.", "Satz Objektverwaltung je Wohnung in Jahr 1"),
        u("jr1.satz.instandhaltung", "C32", "€/m² p. a.", "Satz Instandhaltung je m² Wohnfläche in Jahr 1"),
        u("jr1.satz.verwaltungskostenbeitrag", "C34", "Anteil", "Satz Verwaltungskostenbeitrag, Anteil des Restkapitals p. a."),
        u("jr1.satz.zins_nbank", "C35", "Anteil", "Zinssatz NBank-Darlehen bis Ende Jahr 35"),
        u("jr1.satz.tilgung_nbank", "C36", "Anteil", "Tilgungssatz NBank-Darlehen p. a. (PGN-Annahme)"),
    ]
    return k


def katalog_liquiditaet():
    k = []
    k += je_gruppe("liq.zahlungsueberschuss_jahr10", 42, "€ p. a.", "Übersicht 3.1 Zahlungsüberschuss Jahr 10")
    k += je_gruppe("liq.zahlungsueberschuss_jahr35", 43, "€ p. a.", "Übersicht 3.2 Zahlungsüberschuss Jahr 35")
    k += je_gruppe("liq.zahlungsueberschuss_jahr42", 44, "€ p. a.", "Übersicht 3.3 Zahlungsüberschuss Jahr 42")
    k += je_gruppe("liq.dscr_jahr1", 45, "Faktor", "Übersicht 3.4 Schuldendienstdeckung (DSCR) Jahr 1 = Zeile 4 ÷ Kapitaldienst")
    k += je_gruppe("liq.dscr_minimum_jahr1_35", 46, "Faktor", "Übersicht 3.5 DSCR Minimum Jahr 1–35")
    k += je_gruppe("liq.jahre_mit_fehlbetrag", 47, "Jahre", "Übersicht 3.6 Jahre mit Fehlbetrag, Jahr 1–35")
    k += je_gruppe("liq.groesster_kumulierter_fehlbetrag", 48, "€", "Übersicht 3.7 Größter kumulierter Fehlbetrag, Jahr 1–42, ohne Zinsen")
    k += je_gruppe("liq.breakeven_tilgung", 49, "Anteil", "Übersicht 3.8 Break-even-Tilgung Jahr 1: Tilgungssatz, bei dem Zeile 8 null ist")
    k += je_gruppe("liq.restschuld_nbank_jahr35", 50, "€", "Übersicht 3.9 Restschuld NBank Ende Jahr 35")
    k += je_gruppe("liq.schlussrate_nbank_jahr42", 51, "€", "Übersicht 3.10 Schlussrate NBank Jahr 42 über der Regelrate")
    k += je_gruppe("liq.restschuld_bank_jahr42", 52, "€", "Übersicht 3.11 Restschuld Bank Ende Jahr 42", GRUPPEN + ("Frei",))
    return k


def katalog_tilgung():
    u = lambda k, z, einheit, b: W(k, "Übersicht", z, einheit, b)
    k = [
        u("tilg.raster.satz", "B55:B62", "Anteil", "Übersicht 4.1–4.8 Tilgungssätze des Vergleichs (4.5 = Volltilgung in 42 Jahren, 4.8 = Eingabe 3.1)"),
        u("tilg.raster.bester", "G55:G62", "Text", "Übersicht 4.1–4.8 Gruppe mit dem höchsten Zahlungsüberschuss je Tilgungssatz"),
    ]
    for g in GRUPPEN:
        k.append(u(f"tilg.raster.zahlungsueberschuss.{g}", f"{SPALTE[g]}55:{SPALTE[g]}62", "€ p. a.",
                   f"Übersicht 4.1–4.8 Zahlungsüberschuss Jahr 1 je Tilgungssatz; {NAME[g]}"))
        k.append(W(f"tilg.ueberschuss_vor_tilgung.{g}", BLATT[g], "H160", "€ p. a.",
                   f"Zahlungsüberschuss vor NBank-Tilgung, Jahr 1; {NAME[g]}"))
    k += [
        u("tilg.schwelle.B_gegen_A", "E63", "Anteil", "Übersicht 4.9 Tilgungsschwelle B gegenüber A: bis zu diesem Satz liegt B über A"),
        u("tilg.schwelle.C_gegen_A", "F64", "Anteil", "Übersicht 4.10 Tilgungsschwelle C gegenüber A: bis zu diesem Satz liegt C über A"),
        u("tilg.schwelle.C_gegen_B", "F65", "Anteil", "Übersicht 4.11 Tilgungsschwelle C gegenüber B: bis zu diesem Satz liegt C über B"),
    ]
    for g in ("B", "C"):
        s = SPALTE[g]
        k += [
            u(f"tilg.mehrschuld.{g}", f"{s}66", "€", f"Übersicht 4.12 Mehrschuld gegenüber A; {NAME[g]}"),
            u(f"tilg.mehr_sollmiete.{g}", f"{s}67", "€ p. a.", f"Übersicht 4.13 Mehr-Sollmiete gegenüber A; {NAME[g]}"),
            u(f"tilg.mehr_mietausfall.{g}", f"{s}68", "€ p. a.", f"Übersicht 4.14 Mehr an Mietausfall/Leerstand gegenüber A (Abzug); {NAME[g]}"),
            u(f"tilg.mehr_verwaltungskostenbeitrag.{g}", f"{s}69", "€ p. a.", f"Übersicht 4.15 Mehr an Verwaltungskostenbeitrag gegenüber A (Abzug); {NAME[g]}"),
            u(f"tilg.mehrueberschuss_vor_tilgung.{g}", f"{s}70", "€ p. a.", f"Übersicht 4.16 Mehrüberschuss vor Tilgung gegenüber A; {NAME[g]}"),
            u(f"tilg.mehrueberschuss_bei_tilgung.{g}", f"{s}71", "€ p. a.", f"Übersicht 4.17 Mehrüberschuss gegenüber A beim Tilgungssatz der Eingabe 3.1; {NAME[g]}"),
            u(f"tilg.mehr_bearbeitungsentgelte.{g}", f"{s}72", "€", f"Übersicht 4.18 Einmalig: Mehr an Bearbeitungsentgelten gegenüber A; {NAME[g]}"),
        ]
    return k


def katalog_dscr():
    k = [W("dscr.ziel", "Übersicht", "D110", "Faktor", "Übersicht 8.1 DSCR-Ziel (Eingabe 10.2)")]
    alle = GRUPPEN + ("Frei",)
    k += je_gruppe("dscr.kapitaldienst_jahr1", 111, "€ p. a.", "Übersicht 8.2 Kapitaldienst Jahr 1 mit Regeltilgung (Zeilen 5 bis 7 und Bankdarlehen)", alle)
    k += je_gruppe("dscr.noetige_miete", 112, "€/m² Monat", "Übersicht 8.3 Nötige Miete Jahr 1 für das DSCR-Ziel: deckt DSCR-Ziel × Kapitaldienst und die Zeilen 2 und 3", alle)
    return k


def katalog_frei():
    f = lambda k, z, einheit, b: W(f"frei.{k}", "Frei finanziert", z, einheit, b)
    return [
        f("annuitaet", "H111", "€ p. a.", "Annuität Bankdarlehen (Zins Eingabe 6.1, Laufzeit Eingabe 6.4)"),
        f("zins_jahr1", "J7", "€ p. a.", "Zins Bankdarlehen in Jahr 1 (im Blatt negativ: Auszahlung)"),
        f("tilgung_jahr1", "K7", "€ p. a.", "Tilgung Bankdarlehen in Jahr 1 (im Blatt negativ: Auszahlung)"),
        f("anfangstilgung", "H113", "Anteil", "Anfangstilgung Bankdarlehen p. a."),
        f("restschuld_ende_zinsbindung", "H112", "€", "Restschuld Bankdarlehen am Ende der Zinsbindung (Eingabe 6.2)"),
        f("eigenmittel_bar", "H102", "€", "Eigenmittel bar, frei finanziert (wie gefördert: 20 % abzüglich Grundstück)"),
    ]


def katalog_tabellen():
    t = lambda k, z, einheit, b: W(f"tab.{k}", "Tabellen", z, einheit, b)
    k = []
    for g in GRUPPEN:
        k.append(t(f"quote_darlehen.{g}", f"{SPALTE[g]}5", "Anteil", f"T1 Darlehen, höchstens, Anteil der zuwendungsfähigen Kosten; {NAME[g]} (RL 2026 Nr. 5.3.3.1)"))
        k.append(t(f"quote_zuschuss.{g}", f"{SPALTE[g]}6", "Anteil", f"T2 Zuschuss, höchstens, Anteil der zuwendungsfähigen Kosten; {NAME[g]} (RL 2026 Nr. 5.3.3.2)"))
    for i, stufe in enumerate(STUFEN):
        z = 9 + i
        k.append(t(f"bemessungsgrenze.{stufe}", f"C{z}", "€/m²", f"T{3 + i} Bemessungsgrenze Herstellungskosten, Mietenstufe {stufe} (RL 2026 Nr. 5.3.2.2, Ausgangswert 01.07.2026)"))
        for g in GRUPPEN:
            k.append(t(f"hoechstmiete.{stufe}.{g}", f"{SPALTE[g]}{z}", "€/m² Monat", f"T{3 + i} Höchstmiete nettokalt, Mietenstufe {stufe}; {NAME[g]} (RL 2026 Nr. 5.4.4)"))
    k += [
        t("eigenmittel_mindestens", "D18", "Anteil", "T10 Eigenmittel, mindestens, Anteil der zuwendungsfähigen Kosten (RL 2026 Nr. 5.2.6)"),
        t("zins_nbank_bis_jahr35", "D19", "Anteil", "T11 Zins NBank-Darlehen bis Ende Jahr 35 (RL 2026 Nr. 5.3.4)"),
        t("zinsfreie_jahre", "D20", "Jahre", "T12 Zinsfreie Jahre (RL 2026 Nr. 5.3.4)"),
        t("laufzeit_hoechstens", "D21", "Jahre", "T13 Höchstlaufzeit des Darlehens, Betrachtungsende (RL 2026 Nr. 5.3.5)"),
        t("tilgungsaufschub_hoechstens", "D22", "Jahre", "T14 Tilgungsaufschub, höchstens (RL 2026 Nr. 5.3.5)"),
        t("verwaltungskostenbeitrag", "D23", "Anteil", "T15 Verwaltungskostenbeitrag p. a. vom Restkapital (RL 2026 Nr. 12.7.1)"),
        t("bearbeitungsentgelt_darlehen", "D24", "Anteil", "T16 Bearbeitungsentgelt Darlehen, einmalig (RL 2026 Nr. 12.7.2)"),
        t("bearbeitungsentgelt_zuschuss", "D25", "Anteil", "T17 Bearbeitungsentgelt Zuschuss, einmalig (RL 2026 Nr. 12.7.3)"),
        t("bindung", "D26", "Jahre", "T18 Belegungs- und Mietbindung (RL 2026 Nr. 5.4.1, 5.4.2)"),
        t("jahre_ohne_mieterhoehung", "D27", "Jahre", "T19 Jahre ohne Mieterhöhung (RL 2026 Nr. 5.4.4, 5.4.5)"),
        t("mieterhoehung_in_der_bindung", "D28", "Anteil", "T20 Mieterhöhung in der Bindung, höchstens, in 3 Jahren (RL 2026 Nr. 5.4.5)"),
        t("abstand_mieterhoehungen", "D29", "Jahre", "T21 Abstand der Mieterhöhungen (PGN-Konvention im Rahmen der RL 2026 Nr. 5.4.5)"),
        t("zuschlag_hoechstmiete_eh40", "D30", "€/m² Monat", "T22 Zuschlag auf die Höchstmiete ab Effizienzhaus 40 (RL 2026 Nr. 5.4.4 Satz 2)"),
        t("tilgung_bank_mindestens", "D31", "Anteil", "T23 Tilgung Bankdarlehen, mindestens, p. a. (RL 2026 Nr. 5.3.6)"),
    ]
    return k


def katalog_zeitreihe():
    z1, z2 = JAHRE
    k = [
        W("zr.jahr", "Gefördert A", f"A{z1}:A{z2}", "Jahr", "Jahr der Rechnung, 1 bis 42 (T0 = Bezugsfertigkeit)"),
        W("zr.kalenderjahr", "Gefördert A", f"B{z1}:B{z2}", "Jahr", "Kalenderjahr zu Jahr 1 bis 42 (Bezugsjahr + Jahr)"),
    ]
    spalten = [
        ("miete", "F", "€/m² Monat", "Miete je m² und Monat (gebunden bis Jahr 35, danach Bestandsmiete)"),
        ("sollmiete", "G", "€ p. a.", "Sollmiete"),
        ("ueberschuss_vor_kapitaldienst", "K", "€ p. a.", "Überschuss vor Kapitaldienst"),
        ("verwaltungskostenbeitrag", "L", "€ p. a.", "Verwaltungskostenbeitrag (im Blatt negativ: Auszahlung)"),
        ("zins_nbank", "M", "€ p. a.", "Zins NBank-Darlehen, 0 bis Ende Jahr 35 (im Blatt negativ: Auszahlung)"),
        ("tilgung_nbank", "N", "€ p. a.", "Tilgung NBank-Darlehen (im Blatt negativ: Auszahlung)"),
        ("kapitaldienst", "Q", "€ p. a.", "Kapitaldienst = Verwaltungskostenbeitrag + Zins + Tilgung, NBank und Bank (im Blatt negativ: Auszahlung)"),
        ("zahlungsueberschuss", "R", "€ p. a.", "Zahlungsüberschuss = Überschuss vor Kapitaldienst + Kapitaldienst"),
        ("dscr", "S", "Faktor", "Schuldendienstdeckung (DSCR) = Überschuss vor Kapitaldienst ÷ Kapitaldienst; "
                              "null, sobald kein Kapitaldienst mehr anfällt"),
        ("restschuld_nbank", "T", "€", "Restschuld NBank-Darlehen am Jahresende"),
        ("zahlungsueberschuss_kumuliert", "W", "€", "Zahlungsüberschuss kumuliert, ohne Zinsen"),
    ]
    for g in GRUPPEN:
        for name, sp, einheit, bedeutung in spalten:
            k.append(W(f"zr.{name}.{g}", BLATT[g], f"{sp}{z1}:{sp}{z2}", einheit, f"{bedeutung}; Jahr 1 bis 42; {NAME[g]}",
                       leer=(name == "dscr")))
        k.append(W(f"zr.restschuld_nbank_bei_bezug.{g}", BLATT[g], f"T{z1 - 1}", "€", f"NBank-Darlehen bei Bezug (Jahr 0); {NAME[g]}"))
    frei = [
        ("zins_bank", "J", "€ p. a.", "Zins Bankdarlehen (im Blatt negativ: Auszahlung)"),
        ("tilgung_bank", "K", "€ p. a.", "Tilgung Bankdarlehen (im Blatt negativ: Auszahlung)"),
        ("kapitaldienst", "L", "€ p. a.", "Kapitaldienst Bankdarlehen = Zins + Tilgung (im Blatt negativ: Auszahlung)"),
        ("restschuld_bank", "O", "€", "Restschuld Bankdarlehen am Jahresende"),
    ]
    for name, sp, einheit, bedeutung in frei:
        k.append(W(f"zr.{name}.Frei", "Frei finanziert", f"{sp}{z1}:{sp}{z2}", einheit, f"{bedeutung}; Jahr 1 bis 42; frei finanziert"))
    k.append(W("zr.restschuld_bank_bei_bezug.Frei", "Frei finanziert", f"O{z1 - 1}", "€", "Bankdarlehen bei Bezug (Jahr 0); frei finanziert"))
    return k


def katalog_rendite():
    """Werte der Anhangfolie A7 „Eigenkapitalrendite“. Jede Zelle steht auf der
    Sperrliste und ist nur über die Ausnahme anhang_rendite lesbar (AUSNAHMEN).
    Horizont Jahr 35: Spalten D bis G der Übersicht. Eigenkapital bei Bezug und
    die Jahre mit Fehlbetrag der Gruppen A, B, C führt der Lauf modellhaus
    (fin.eigenkapital.*, liq.jahre_mit_fehlbetrag.*)."""
    alle = GRUPPEN + ("Frei",)
    u = lambda k, z, einheit, b: W(f"rendite.{k}", "Übersicht", z, einheit, b)
    e = lambda k, z, einheit, b: W(f"rendite.annahme.{k}", "Eingaben", z, einheit, b)
    k = [u("jahre_mit_fehlbetrag.Frei", "G47", "Jahre", "Übersicht 3.6 Jahre mit Fehlbetrag, Jahr 1–35; frei finanziert zur Marktmiete")]
    k += je_gruppe("rendite.vofi_mit_restwert", 91, "Anteil", "Übersicht 6.3 VOFI-EK-Rendite vor Steuern, mit Restwert, Horizont Jahr 35", alle)
    k += je_gruppe("rendite.vofi_nur_bodenwert", 92, "Anteil", "Übersicht 6.4 VOFI-EK-Rendite vor Steuern, nur Bodenwert, Horizont Jahr 35 (Modellhaus: Grundstück nicht angesetzt, der Bodenwert ist null und der Wert rechnet ohne Restwert; Hinweise Nr. 15)", alle)
    k += je_gruppe("rendite.restwertanteil", 93, "Anteil", "Übersicht 6.5 Restwertanteil am Endvermögen, Horizont Jahr 35", alle)
    k += je_gruppe("rendite.projektkonto_tiefststand", 96, "€", "Übersicht 6.8 Tiefster Stand des Projektkontos (VOFI), Jahr 0–42", alle)
    k += je_gruppe("rendite.restwert_jahr35", 100, "€", "Übersicht 7.1 Restwert (Boden + Gebäude), Ertragswert Ende Jahr 35", alle)
    k += je_gruppe("rendite.liegenschaftszins", 106, "Anteil", "Übersicht 7.7 Liegenschaftszins des Ertragswerts, Horizont Jahr 35 (Landesmodell Mehrfamilienhäuser des Oberen Gutachterausschusses, Stichtag 01.01.2026; Tabellen, Tabelle 4, Spalte des aktiven Projekts)", alle)
    k += [
        e("marktmiete_jahr1", "F25", "€/m² Monat", "Eingabe 4.4 Marktmiete Neuvermietung, Jahr 1 (Modellhaus: Gutachterausschuss Lüneburg, Hamburger Umland, Baualter ab 2023, 40 bis 60 m², Stand 01.01.2026)"),
        e("mietsteigerung", "F26", "Anteil", "Eingabe 4.5 Steigerung Markt- und Vergleichsmiete p. a."),
        e("guthabenzins", "F41", "Anteil", "Eingabe 7.2 Guthabenzins Projektkonto (VOFI) p. a."),
        e("sollzins", "F42", "Anteil", "Eingabe 7.3 Sollzins Projektkonto (VOFI) p. a."),
        e("bodenwertsteigerung", "F44", "Anteil", "Eingabe 8.1 Bodenwertsteigerung p. a."),
    ]
    return k


KERN = (katalog_eingaben() + katalog_finanzierung() + katalog_jahr1() + katalog_liquiditaet()
        + katalog_tilgung() + katalog_dscr() + katalog_frei())

# Das Modellhaus ist Projekt 2 der Mappe. Jeder Lauf setzt Eingaben!D3 auf 2; in
# der Mappe darf dort 1 oder 2 stehen (kein fester alter Wert). Steht schon 2
# dort, ändert der Lauf nichts. Alle weiteren Änderungen stehen in Spalte E
# (Eingaben von Projekt 2) und nennen den Wert, den die Mappe dort führt.
PROJEKT = 2
PROJEKT_SETZEN = dict(blatt="Eingaben", zelle="D3", erlaubt=(1, 2), neu=PROJEKT,
                      eingabe="Aktives Projekt: Projekt 2 (Modellhaus), gleich welcher Stand ausgeliefert ist")
HERSTELLUNG = 3579  # Eingaben!E11: Herstellungskosten des Modellhauses, € je m² Wohnfläche


def mit_projekt(*weitere):
    """Änderungen eines Laufs: immer zuerst Projekt 2 setzen."""
    return [dict(PROJEKT_SETZEN)] + [dict(a) for a in weitere]


def kosten(neu):
    return dict(blatt="Eingaben", zelle="E11", alt=HERSTELLUNG, neu=neu, eingabe="2.1 Herstellungskosten KG 200–700, Projekt 2")


LAEUFE = [
    dict(
        lauf="modellhaus",
        beschreibung="Modellhaus: Projekt 2 der Mappe, ein PGN-Projekt in Neu Wulmstorf (14 Wohnungen, 828 m², "
                     "Herstellungskosten 3.579 € je m², Grundstück im Bestand und nicht angesetzt, Mietenstufe VI, "
                     "Tilgung 1/42 = 2,38 %), Eingabe 10.1 = Marktmiete, Eingabe 10.2 = 1,0.",
        aenderungen=mit_projekt(),
        katalog=KERN + katalog_tabellen(),
    ),
    dict(
        lauf="modellhaus_zeitreihe",
        beschreibung="Modellhaus (Projekt 2), Jahr 1 bis 42 aus den Blättern Gefördert A, B, C; frei "
                     "finanziert nur Kapitaldienst und Restschuld. Jahr 36 bis 42 mit den Annahmen der Mappe: "
                     "Zins NBank laut Eingabe 3.3, Mieterhöhung nach Bindungsende laut Eingabe 4.6.",
        aenderungen=mit_projekt(),
        katalog=katalog_zeitreihe(),
    ),
    dict(
        lauf="modellhaus_rendite",
        beschreibung="Modellhaus (Projekt 2): Eigenkapitalrendite vor Steuern über 35 Jahre als Paar „mit "
                     "Restwert / nur Bodenwert“ mit Restwertanteil, dazu Projektkonto, Restwert und die Annahmen "
                     "dahinter. Nur für die Anhangfolie A7 (Folie anhang-rendite); Ausnahme anhang_rendite von der "
                     "Sperrliste. Das Grundstück ist nicht angesetzt: „nur Bodenwert“ rechnet ohne Restwert "
                     "(Hinweise Nr. 15). Marktmiete: Gutachterausschuss Lüneburg, Hamburger Umland, Stand 01.01.2026; Liegenschaftszins: "
                     "Landesmodell Mehrfamilienhäuser des Oberen Gutachterausschusses.",
        aenderungen=mit_projekt(),
        katalog=katalog_rendite(),
    ),
    dict(
        lauf="modellhaus_dscr125",
        beschreibung="Modellhaus (Projekt 2), DSCR-Ziel 1,25 statt 1,0: nötige Miete in Jahr 1.",
        aenderungen=mit_projekt(dict(blatt="Eingaben", zelle="E54", alt=1, neu=1.25, eingabe="10.2 DSCR-Ziel für die nötige Miete, Projekt 2")),
        katalog=[w for w in katalog_eingaben() if w["schluessel"] in ("eingabe.projekt_nr", "eingabe.dscr_ziel")] + katalog_dscr(),
    ),
    dict(
        lauf="modellhaus_kosten_4631",
        beschreibung="Modellhaus (Projekt 2) mit Herstellungskosten 4.631 € je m² (ARGE-Median deutscher Großstädte, "
                     "Q4 2025; aus der Altfassung der Präsentation übernommen, nicht nachgeprüft) statt 3.579 € je m²: "
                     "Sensitivität der Folie 23.",
        aenderungen=mit_projekt(kosten(4631)),
        katalog=KERN,
    ),
    dict(
        lauf="modellhaus_kosten_5000",
        beschreibung="Modellhaus (Projekt 2) mit Herstellungskosten 5.000 € je m² (Ausgangswert der Bemessungsgrenze "
                     "in Mietenstufe IV bis VII) statt 3.579 € je m²: Sensitivität der Folie 23.",
        aenderungen=mit_projekt(kosten(5000)),
        katalog=KERN,
    ),
    dict(
        lauf="projekt2",
        beschreibung="Projekt 2 der Mappe im Stand der früheren Präsentation vom 26.10.2026 (Altfassung): wie das "
                     "Modellhaus, aber mit Tilgung 2,5 % statt 1/42 und mit dem Bankzins vom 21.07.2026 (3,74 % statt "
                     "3,86 %, auch als Anschlusszins und als Zins des NBank-Darlehens ab Jahr 36). Nur für den Vergleich mit der Altfassung "
                     "(daten/pruefe_werte.py); erscheint auf keiner Folie.",
        aenderungen=mit_projekt(dict(blatt="Eingaben", zelle="E17", alt=1 / 42, neu=0.025, eingabe="3.1 Tilgung NBank-Darlehen, wie Altfassung"),
                                dict(blatt="Eingaben", zelle="E35", alt=0.0386, neu=0.0374, eingabe="6.1 Zins Bank, wie Altfassung"),
                                dict(blatt="Eingaben", zelle="E37", alt=0.0386, neu=0.0374, eingabe="6.3 Anschlusszins, wie Altfassung"),
                                dict(blatt="Eingaben", zelle="E19", alt=0.0386, neu=0.0374, eingabe="3.3 Zins NBank-Darlehen ab Jahr 36, wie Altfassung")),
        katalog=KERN,
    ),
]


# --------------------------------------------------------------------------
# Mappe kopieren, ändern, neu berechnen, lesen
# --------------------------------------------------------------------------

def sha256(pfad):
    h = hashlib.sha256()
    with open(pfad, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def neu_berechnen(datei, recalc, ordner):
    """Rechnet die Kopie mit LibreOffice neu. Die Kopie hat keine gespeicherten
    Ergebnisse mehr (openpyxl schreibt nur Formeln), jede Zahl ist neu gerechnet."""
    if recalc:
        r = subprocess.run([sys.executable, str(recalc), str(datei), "180"], capture_output=True, text=True)
        try:
            bericht = json.loads(r.stdout)
        except ValueError:
            sys.exit(f"Neuberechnung gescheitert ({datei.name}): {r.stdout} {r.stderr}")
        if bericht.get("status") != "success" or bericht.get("total_errors", 1) != 0:
            sys.exit(f"Neuberechnung meldet Fehler ({datei.name}): {json.dumps(bericht, ensure_ascii=False)}")
        return "recalc.py (LibreOffice)"
    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if not soffice:
        sys.exit("LibreOffice (soffice) fehlt; bitte --recalc angeben oder LibreOffice installieren.")
    aus = ordner / "lo-aus"
    profil = ordner / "lo-profil"
    aus.mkdir(exist_ok=True)
    r = subprocess.run(
        [soffice, "--headless", "--norestore", f"-env:UserInstallation={profil.as_uri()}",
         "--convert-to", "xlsx:Calc MS Excel 2007 XML", "--outdir", str(aus), str(datei)],
        capture_output=True, text=True, timeout=300)
    ergebnis = aus / datei.name
    if r.returncode != 0 or not ergebnis.exists():
        sys.exit(f"LibreOffice hat {datei.name} nicht neu berechnet: {r.stderr}")
    shutil.move(str(ergebnis), str(datei))
    return "LibreOffice direkt (Konvertierung der Kopie ohne gespeicherte Ergebnisse)"


def gleich(a, b):
    if isinstance(a, bool) or isinstance(b, bool):
        return a == b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(a - b) <= 1e-9 * max(1.0, abs(a), abs(b))
    return a == b


def kopie_rechnen(mappe, ordner, lauf, aenderungen, recalc):
    """Kopiert die Mappe, setzt die Eingaben des Laufs, rechnet neu und gibt die
    Arbeitsmappe mit Ergebnissen zurück."""
    kopie = ordner / f"{lauf}.xlsx"
    shutil.copyfile(mappe, kopie)
    wb = openpyxl.load_workbook(kopie)
    for a in aenderungen:
        zelle = wb[a["blatt"]][a["zelle"]]
        if "erlaubt" in a:
            if not any(gleich(zelle.value, x) for x in a["erlaubt"]):
                sys.exit(f"{lauf}: {a['blatt']}!{a['zelle']} enthält {zelle.value!r}, erlaubt ist {a['erlaubt']!r}. Mappe geändert?")
        elif not gleich(zelle.value, a["alt"]):
            sys.exit(f"{lauf}: {a['blatt']}!{a['zelle']} enthält {zelle.value!r}, erwartet {a['alt']!r}. Mappe geändert?")
        zelle.value = a["neu"]
    wb.save(kopie)
    wb.close()
    methode = neu_berechnen(kopie, recalc, ordner)
    return openpyxl.load_workbook(kopie, data_only=True), methode


def lies(wb, eintrag, lauf=None):
    blatt, zelle = eintrag["blatt"], eintrag["zelle"]
    grund = gesperrt(blatt, zelle)
    if grund and not ausnahme(lauf, blatt, zelle):
        sys.exit(f"Gesperrte Zelle im Katalog: {eintrag['schluessel']} → {blatt}!{zelle} ({grund})")
    ws = wb[blatt]
    if ":" in zelle:
        wert = [c.value for zeile in ws[zelle] for c in zeile]
    else:
        wert = ws[zelle].value
    for v in (wert if isinstance(wert, list) else [wert]):
        if v is None and eintrag["leer"]:
            continue
        if v is None or (isinstance(v, str) and (v.startswith("#") or eintrag["einheit"] != "Text")):
            sys.exit(f"Kein gültiger Wert: {eintrag['schluessel']} → {blatt}!{zelle} = {v!r}")
        if eintrag["einheit"] == "Text" and not isinstance(v, str):
            sys.exit(f"Text erwartet: {eintrag['schluessel']} → {blatt}!{zelle} = {v!r}")
    return wert


def pruefe_eingaben(original, wb, aenderungen, lauf):
    """Im Blatt Eingaben darf sich nur geändert haben, was der Lauf nennt."""
    erlaubt = {(a["blatt"], a["zelle"]) for a in aenderungen}
    ws_o, ws_n = original["Eingaben"], wb["Eingaben"]
    for zeile in ws_o["D3:E54"]:
        for c in zeile:
            neu = ws_n[c.coordinate].value
            if ("Eingaben", c.coordinate) in erlaubt:
                continue
            if not gleich(c.value, neu):
                sys.exit(f"{lauf}: Eingaben!{c.coordinate} weicht ab ({c.value!r} → {neu!r}), ohne dass der Lauf das vorsieht.")
    for a in aenderungen:
        ist = wb[a["blatt"]][a["zelle"]].value
        if not gleich(ist, a["neu"]):
            sys.exit(f"{lauf}: {a['blatt']}!{a['zelle']} ist {ist!r}, gesetzt war {a['neu']!r}.")


def pruefe_auslieferung(original, wb):
    """Die neu gerechnete Kopie ohne Änderung muss die gespeicherten Ergebnisse
    der Mappe in jeder Zelle wiedergeben."""
    zellen = abweichungen = 0
    beispiele = []
    for ws in original:
        ws_n = wb[ws.title]
        for zeile in ws.iter_rows():
            for c in zeile:
                neu = ws_n[c.coordinate].value
                if c.value is None and neu is None:
                    continue
                zellen += 1
                if not gleich(c.value, neu):
                    abweichungen += 1
                    if len(beispiele) < 5:
                        beispiele.append(f"{ws.title}!{c.coordinate}: {c.value!r} / {neu!r}")
    if abweichungen:
        sys.exit("Neuberechnung weicht vom Auslieferungsstand ab: " + "; ".join(beispiele))
    return zellen


def pruefe_voraussetzungen(wb):
    """Auslieferungsstand: Projekt 1 oder 2 aktiv; 10.1 = Marktmiete, 10.2 = 1,0 und
    Stresstest neutral, im aktiven Projekt (Spalte F) und in Projekt 2 (Spalte E),
    mit dem die Läufe rechnen."""
    e = wb["Eingaben"]
    if not any(gleich(e["D3"].value, x) for x in PROJEKT_SETZEN["erlaubt"]):
        sys.exit(f"Mappe nicht im Auslieferungsstand: Eingaben!D3 = {e['D3'].value!r}, erwartet 1 oder 2.")
    soll = {"53": "Marktmiete", "54": 1, "48": 1, "49": 1, "50": 0, "51": 1, "18": 0, "33": 0}
    for spalte in ("F", "E"):
        for zeile, wert in soll.items():
            zelle = f"{spalte}{zeile}"
            if not gleich(e[zelle].value, wert):
                sys.exit(f"Mappe nicht im Auslieferungsstand: Eingaben!{zelle} = {e[zelle].value!r}, erwartet {wert!r}.")


def pruefe_mieten(wb):
    """Die Mieten der geförderten Varianten dürfen bis Jahr 42 nicht an der
    Markt- oder Vergleichsmiete hängen (beide stehen auf der Sperrliste)."""
    stufe = wb["Eingaben"]["F22"].value
    zeile = 9 + STUFEN.index(stufe)
    zuschlag = wb["Tabellen"]["D30"].value if wb["Eingaben"]["F23"].value == "ja" else 0
    z1, z2 = JAHRE
    for g in GRUPPEN:
        ws = wb[BLATT[g]]
        hoechst = wb["Tabellen"][f"{SPALTE[g]}{zeile}"].value + zuschlag
        if not gleich(ws["H109"].value, hoechst):
            return False
        for z in range(z1, z2 + 1):
            if ws[f"F{z}"].value >= ws[f"C{z}"].value - 1e-9:
                return False
    return True


def json_text(daten):
    """JSON mit Einrückung; Listen aus einfachen Werten stehen in einer Zeile."""
    text = json.dumps(daten, ensure_ascii=False, indent=1)

    kurz = re.compile(r'-?\d+(\.\d+)?([eE][+-]?\d+)?|"[^"]{0,3}"|null')

    def einzeilig(m):
        teile = [t.strip() for t in m.group(1).split(",\n")]
        if all(kurz.fullmatch(t) for t in teile):
            return "[" + ", ".join(teile) + "]"
        return m.group(0)

    return re.sub(r"\[\n\s*([^\[\]{}]*?)\n\s*\]", einzeilig, text) + "\n"


def main():
    p = argparse.ArgumentParser(description="Werte der VOFI-Mappe v3 für die Präsentation bereitstellen.")
    p.add_argument("--mappe", type=Path, default=MAPPE)
    p.add_argument("--ziel", type=Path, default=ZIEL)
    p.add_argument("--recalc", type=Path, default=os.environ.get("VOFI_RECALC"))
    p.add_argument("--arbeitsordner", type=Path)
    a = p.parse_args()

    mappe = a.mappe.resolve()
    if not mappe.exists():
        sys.exit(f"Mappe fehlt: {mappe}")
    if a.recalc and not Path(a.recalc).exists():
        sys.exit(f"Neuberechnungsskript fehlt: {a.recalc}")
    pruefsumme = sha256(mappe)

    if a.arbeitsordner:
        ordner = a.arbeitsordner.resolve()
        ordner.mkdir(parents=True, exist_ok=True)
        aufraeumen = False
    else:
        ordner = Path(tempfile.mkdtemp(prefix="vofi-werte-"))
        aufraeumen = True
    if mappe.parent == ordner or mappe.parent in ordner.parents:
        sys.exit("Der Arbeitsordner darf nicht im Ordner der Mappe liegen.")

    try:
        original = openpyxl.load_workbook(mappe, data_only=True)
        pruefe_voraussetzungen(original)
        stand = re.sub(r"^.*\((.*)\)\s*$", r"\1", str(original["Hinweise"]["B2"].value))

        pruefe_ausnahmen(LAEUFE)
        laeufe = {}
        methode = None
        gerechnet = {}

        def rechne(name, aenderungen):
            """Rechnet je Satz wirksamer Änderungen eine Kopie. Wirksam ist eine
            Änderung, wenn die Mappe an der Stelle nicht schon den neuen Wert führt."""
            wirksam = [x for x in aenderungen if not gleich(original[x["blatt"]][x["zelle"]].value, x["neu"])]
            signatur = json.dumps([(x["blatt"], x["zelle"], x["neu"]) for x in wirksam], sort_keys=True)
            if signatur not in gerechnet:
                gerechnet[signatur] = kopie_rechnen(mappe, ordner, name, aenderungen, a.recalc)
            return gerechnet[signatur]

        # Die Kopie ohne Änderung gibt die gespeicherten Ergebnisse der Mappe wieder,
        # auch wenn kein Lauf den Auslieferungsstand selbst rechnet (Projekt 1 aktiv).
        wb, methode = rechne("auslieferung", [])
        auslieferung = dict(aktives_projekt=original["Eingaben"]["D3"].value,
                            zellen_gleich_neuberechnung=pruefe_auslieferung(original, wb))

        for lauf in LAEUFE:
            name = lauf["lauf"]
            wb, methode = rechne(name, lauf["aenderungen"])
            pruefe_eingaben(original, wb, lauf["aenderungen"], name)
            if not gleich(wb["Eingaben"]["D3"].value, PROJEKT):
                sys.exit(f"{name}: rechnet nicht mit Projekt {PROJEKT} (Eingaben!D3 = {wb['Eingaben']['D3'].value!r}).")
            pruefungen = {"pruefblock_mappe": wb["Übersicht"]["D3"].value}
            pruefungen["mieten_ohne_platzhalter"] = pruefe_mieten(wb)
            werte = {}
            for eintrag in lauf["katalog"]:
                if eintrag["schluessel"] in werte:
                    sys.exit(f"Schlüssel doppelt: {eintrag['schluessel']}")
                werte[eintrag["schluessel"]] = dict(
                    schluessel=eintrag["schluessel"], wert=lies(wb, eintrag, name), einheit=eintrag["einheit"],
                    blatt=eintrag["blatt"], zelle=eintrag["zelle"], bedeutung=eintrag["bedeutung"], lauf=name)
                # Wert aus einer gesperrten Zelle: Die Ausnahme steht am Wert (meta.ausnahmen nennt, wer sie erlaubt hat und wofür)
                if gesperrt(eintrag["blatt"], eintrag["zelle"]):
                    werte[eintrag["schluessel"]]["ausnahme"] = ausnahme(name, eintrag["blatt"], eintrag["zelle"])
            laeufe[name] = dict(
                beschreibung=lauf["beschreibung"],
                aenderungen=[{k: (list(v) if isinstance(v, tuple) else v) for k, v in a_.items()} for a_ in lauf["aenderungen"]],
                pruefungen=pruefungen,
                anzahl_werte=len(werte),
                werte=werte,
            )

        if sha256(mappe) != pruefsumme:
            sys.exit("Die Mappe hat sich während des Laufs geändert.")

        daten = dict(
            meta=dict(
                titel="Werte der VOFI-Mappe für die Präsentation Mietwohnraumförderung Niedersachsen 2026",
                mappe=mappe.name,
                mappe_sha256=pruefsumme,
                mappe_stand=stand,
                auslieferung=auslieferung,
                modellhaus=f"Projekt {PROJEKT} der Mappe; jeder Lauf setzt Eingaben!D3 auf {PROJEKT}",
                erzeugt_mit="daten/werte_aus_vofi.py",
                neuberechnung=methode,
                aufbau="laeufe.<lauf>.werte.<schluessel> = {schluessel, wert, einheit, blatt, zelle, bedeutung, lauf}",
                einheiten=EINHEITEN,
                hinweise=[
                    "Alle Werte roh und ungerundet; gerundet wird erst auf der Folie.",
                    "Anteile sind Dezimalbrüche (0,025 = 2,5 %).",
                    "Übersicht: Abzüge der Jahresrechnung stehen positiv. Zeitreihen der Blätter Gefördert A, B, C "
                    "und Frei finanziert: Auszahlungen negativ.",
                    "Reihen stehen als Liste in „wert“; zr.* hat 42 Werte für Jahr 1 bis 42, tilg.raster.* hat 8 Werte "
                    "für die Zeilen 4.1 bis 4.8.",
                    "Vor Steuern, nominal, T0 = Bezugsfertigkeit; Modellrechnung, keine Förderzusage.",
                ],
                ausnahmen=[
                    dict(name=x["name"], lauf=x["lauf"], erlaubt_von=x["erlaubt_von"], erlaubt_am=x["erlaubt_am"],
                         zweck=x["zweck"], bedingung=x["bedingung"],
                         zellen=[f"{blatt}!{bereich}" for blatt, bereiche in x["zellen"].items() for bereich, _ in bereiche])
                    for x in AUSNAHMEN
                ],
                nicht_exportiert=[
                    "Renditen, Restwerte, Förderbarwert, Projektkonto (VOFI), Blatt NBank; ausgenommen sind allein die "
                    "Zellen der Ausnahmen (meta.ausnahmen), und nur in ihrem Lauf",
                    "Markt- und Vergleichsmiete (Eingaben 4.3, 4.4) und alles, was daran hängt: Jahresrechnung, "
                    "Liquidität und Zeitreihe „frei finanziert“ zur Marktmiete, Aufschlag auf die Marktmiete",
                    "Projektnamen (Projekt 2 enthält einen Straßennamen; der Vortrag nennt die Straße nicht)",
                ],
            ),
            laeufe=laeufe,
        )
        a.ziel.parent.mkdir(parents=True, exist_ok=True)
        a.ziel.write_text(json_text(daten), encoding="utf-8")
        print(f"{a.ziel}: {sum(l['anzahl_werte'] for l in laeufe.values())} Werte in {len(laeufe)} Läufen")
        for name, l in laeufe.items():
            print(f"  {name}: {l['anzahl_werte']} Werte, Prüfblock {l['pruefungen']['pruefblock_mappe']}")
        print(f"  Mappe unverändert, SHA-256 {pruefsumme}")
    finally:
        if aufraeumen:
            shutil.rmtree(ordner, ignore_errors=True)
        else:
            for rest in ("lo-aus", "lo-profil"):
                shutil.rmtree(ordner / rest, ignore_errors=True)


if __name__ == "__main__":
    main()
