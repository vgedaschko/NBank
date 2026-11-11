#!/usr/bin/env python3
"""Prüft die fertige Vortragsmappe gegen Rechenmappe, Datendateien und Konzept. Liest nur, ändert nichts.

Aufruf im Ordner praesentation:
    python pruefe_folien.py                      prüft dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pptx
    python pruefe_folien.py DATEI.pptx           prüft eine andere Fassung derselben Mappe
    python pruefe_folien.py --zahlen             listet zusätzlich jede Zahl mit ihrem Beleg

Was geprüft wird (eine Zeile je Prüfung, am Ende die Summe; Rückgabewert 1 bei Fehlern):
  Aufbau     38 Folien (28 im Hauptteil, 10 im Anhang) mit Kennung, Blattnummer und Abschnitt wie festgelegt (AUFBAU), in der Reihenfolge des
             Konzepts; Titel-Platzhalter, Abschnitte, Blattnummern, Notizen, Dateieigenschaften, eindeutige Form-IDs; Kicker, Rubrik, Agenda
             und Trenner mit denselben Abschnittsnamen und derselben Zählung
  Form       nur Montserrat und Work Sans, Mindestgrößen (E3), Alternativtexte (Bilder, Diagramme, Flussdiagramme), keine Folie als Bild,
             keine Animationen
  Wortlaut   verbotene Wörter (E5; „Rendite“ und „Marktmiete“ nur auf der Anhangfolie zur Rendite), kein Gedankenstrich als Einschub (E6), das Wort
             „Modellrechnung“ im Kopf genau der festgelegten Folien, je einmal (E7); Quellenzeile im Schriftfeld genau der festgelegten Folien im
             Wortlaut von daten/markt.json (QUELLENZEILEN)
  Zahlen     jede Zahl in Folientexten, Tabellen, Alternativtexten, Diagrammdaten und Notizen hat einen Beleg; die Diagrammdaten stehen gleich im Zwischenspeicher
             und in der eingebetteten Arbeitsmappe; Kernwerte und Kernsätze stehen an ihren Folien, mit Einheit und Vorzeichen; Werte an
             den Diagrammen der Folien 3 bis 6 und 22 stehen in ihrer Form oder Tabellenzelle (KERNWERTE_FORM), Zeitreihen Wert für
             Wert in den Diagrammdaten (REIHEN_DIAGRAMM)
  Verweise   „Folie n“ und „Anhang A n“ in Folientexten und Notizen nennen die Blattnummer der gemeinten Folie (VERWEISE)

Beleg einer Zahl, in dieser Reihenfolge:
  1 daten/werte.json (Rechenmappe), gerundet auf die Nachkommastellen, mit denen die Zahl auf der Folie steht;
    als Wert, als Prozent (Wert × 100) oder in Millionen (Wert ÷ 1.000.000)
  2 Datendateien der Baugruppen (daten/regeln.json, markt.json, umsetzung.json, rahmen.json, rechnung.json): Zahlen mit Herkunft
  3 daten/pruefung.json: gerechnete Größen (die Formel wird hier nachgerechnet) und Zahlen der Sprechernotizen mit Herkunft
  Der Lauf modellhaus_rendite der Rechenmappe und Einträge mit „nur_folie“ in daten/pruefung.json belegen nur Zahlen ihrer einen Folie (E5).
  4 Freiliste (unten, FREI): Angaben, die keine Rechengrößen sind, jede Regel mit Begründung
Die Einheit zählt: Folgt der Zahl ein Prozentzeichen, belegt sie nur ein Anteil oder eine Prozentangabe; folgt „€“ oder „Mio.“, nur ein Eurobetrag.
Daten und Jahreszahlen stehen nicht auf der Freiliste: Sie gelten nur, wenn eine Datendatei oder daten/pruefung.json sie führt. Seiten der
Broschüre und Folienverweise gelten nur, wenn es Seite und Folie gibt.

Braucht nur die Standardbibliothek von Python 3.9 oder neuer.
"""
import ast
import json
import math
import operator
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path

ORDNER = Path(__file__).resolve().parent
DATEN = ORDNER / "daten"
MAPPE = ORDNER / "dist" / "PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pptx"

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
C = "{http://schemas.openxmlformats.org/drawingml/2006/chart}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
REL = "{http://schemas.openxmlformats.org/package/2006/relationships}"

NBSP, MINUS = " ", "−"
# ---- Aufbau der Mappe nach der Festlegung zum Umbau: Blattnummer, Kennung der Folie, Abschnitt; in dieser Reihenfolge ---------------------
# Titel und Schluss tragen keine Blattnummer auf der Folie, zählen aber mit (1 und 28). Der Anhang heißt A0 bis A9.
AUFBAU = [
    ("1", "titel", "Ausgangslage"), ("2", "trenner-ausgangslage", "Ausgangslage"), ("3", "einstieg-baukosten", "Ausgangslage"),
    ("4", "ausgangslage-zinsen", "Ausgangslage"), ("5", "einstieg-kapitaldienst", "Ausgangslage"), ("6", "einstieg-bestand", "Ausgangslage"),
    ("7", "agenda", "Ausgangslage"),
    ("8", "trenner-programmteil", "Programmteil 2.1"), ("9", "neu-seit-juli", "Programmteil 2.1"), ("10", "hoechstmiete", "Programmteil 2.1"),
    ("11", "foerdermix", "Programmteil 2.1"), ("12", "eckdaten-zeitstrahl", "Programmteil 2.1"),
    ("13", "trenner-rechnung", "Modellrechnung"), ("14", "rechnung-finanzierung", "Modellrechnung"), ("15", "rechnung-jahr1", "Modellrechnung"),
    ("16", "rechnung-kapitaldienst", "Modellrechnung"), ("17", "rechnung-fluss-gefoerdert", "Modellrechnung"), ("18", "rechnung-fluss-frei", "Modellrechnung"),
    ("19", "rechnung-miete", "Modellrechnung"), ("20", "rechnung-tilgung", "Modellrechnung"), ("21", "rechnung-verlauf", "Modellrechnung"),
    ("22", "pgn-baukosten", "Modellrechnung"), ("23", "rechnung-kosten", "Modellrechnung"), ("24", "fazit", "Modellrechnung"),
    ("25", "trenner-umsetzung", "Umsetzung"), ("26", "antragsweg", "Umsetzung"), ("27", "pgn-leistungen", "Umsetzung"), ("28", "kontakt", "Umsetzung"),
    ("A0", "anhang-trenner", "Anhang"), ("A1", "anhang-programmteile", "Anhang"), ("A2", "anhang-frist", "Anhang"), ("A3", "anhang-voraussetzungen", "Anhang"),
    ("A4", "anhang-vertraege", "Anhang"), ("A5", "anhang-mieterkreis", "Anhang"), ("A6", "anhang-eckdaten", "Anhang"), ("A7", "anhang-rendite", "Anhang"),
    ("A8", "anhang-tilgungsschwelle", "Anhang"), ("A9", "quellen", "Anhang"),
]
FOLIENZAHL = len(AUFBAU)          # 38: 28 im Hauptteil, 10 im Anhang
HAUPTTEIL, ANHANG = 28, 10
# Folien der Modellrechnung (Layouts mit „_MR“, Papierton): Im Kopf steht das Wort „Modellrechnung“ genau einmal, im Kicker oder als Stempel des
# Layouts, nie beides. Kein Papierton und kein Stempel im Einstieg (Folien 3 bis 6: Medianwerte je m²) und auf pgn-baukosten (Kostenkennwerte).
# Der Zusatz der ersten Modellfolie lautet seit 11.11.2026 „Rechenbeispiel, …“ (vorher „Fiktives Beispiel, …“): Das Modellhaus ist ein Projekt der PGN.
ZUSATZ_MODELLRECHNUNG = "Rechenbeispiel, keine Förderzusage"
STEMPEL = ["rechnung-finanzierung", "rechnung-jahr1", "rechnung-kapitaldienst", "rechnung-fluss-gefoerdert", "rechnung-fluss-frei", "rechnung-miete",
           "rechnung-tilgung", "rechnung-verlauf", "rechnung-kosten", "fazit"]
# Kicker und Rubrik im Schriftfeld nennen den Abschnitt und das Thema der Folie („MODELLRECHNUNG · KAPITALDIENST“). Die Agenda nennt alle vier
# Abschnitte und trägt deshalb einen eigenen Kicker ohne Abschnittsnamen; jede weitere Ausnahme stünde hier.
KICKER_OHNE_ABSCHNITT = {"agenda": "INHALT DES VORTRAGS"}
# Register der Agenda: Der Vortrag behandelt 2.1; für 2.2 bis 2.6 steht die Seite der Broschüre (Festlegung zum Umbau)
REGISTER = {"2.1": "in diesem Vortrag", "2.2": "Broschüre S. 13", "2.3": "Broschüre S. 15", "2.4": "Broschüre S. 14", "2.5": "Broschüre S. 17", "2.6": "Broschüre S. 17"}
SCHRIFTEN = ("Montserrat", "Work Sans")
FIRMA = "Planungsgemeinschaft Nord GmbH"
TITEL_DER_MAPPE = "Mietwohnraumförderung Niedersachsen 2026 – Vortrag"
# Namen der Layouts im Layout-Menü (fertige Mappe) → Namen im Konzept. Eine Quelle mit dem Bau: lib/layoutnamen.json
LAYOUTNAMEN = {v: k for k, v in json.loads((ORDNER / "lib" / "layoutnamen.json").read_text(encoding="utf-8")).items() if not k.startswith("_")}
BROSCHUERE_SEITEN = 24   # die Broschüre hat 24 Seiten; „Broschüre S. 99“ gibt es nicht
# Spuren des Erzeugens, die in keiner Datei der Mappe stehen dürfen (E11): Namen der Bauwerkzeuge und Vermerke wie „erzeugt mit“.
# PowerPoint und Excel als Dateiformat zählen nicht.
WERKZEUGE = ["pptxgenjs", "python-pptx", "LibreOffice", "OpenOffice", "node.js", "generated by", "created with", "erzeugt mit", "erstellt mit", "KI-generiert", "AI-generated"]

# ---- E3: Mindestgrößen in Punkt -------------------------------------------------------------------------------------
MIN_BESCHRIFTUNG, MIN_TABELLE, MIN_FLIESS = 10, 12, 14
# Formen, die die Bibliothek als Fließtext anlegt (Namen aus lib/bausteine.cjs und lib/layouts.cjs). In ihnen müssen die Läufe in Work Sans
# mindestens 14 pt haben; Modultitel und Werte in Montserrat sind Überschriften und fallen unter die Regel für Beschriftungen.
FLIESSTEXT = re.compile(r"^(Kommentar|Planlegende|Aufzählung|Vorspann|Untertitel|Text|Links Text|Rechts Text|Kennzahl( \d)? Text|Achtung Text|"
                        r"Hinweis Text|Hero-Text|Text (fliess|dicht|vorspann))")
LANGER_ABSATZ = 200   # ein Absatz außerhalb von Tabellen mit mehr Zeichen ist Fließtext, wie auch immer seine Form heißt

# ---- E5: Wörter, die auf keiner Folie stehen ---------------------------------------------------------------------------
VERBOTEN = [
    (re.compile(r"\bIRR\b"), "IRR"),
    (re.compile(r"\bDSCR\b"), "DSCR"),
    (re.compile(r"Safe[ -]Harbou?r", re.I), "Safe Harbour"),
    (re.compile(r"Marktmiete", re.I), "Marktmiete"),
    (re.compile(r"Rendite", re.I), "Rendite"),
]
# „Rendite“ ist auf den übrigen Folien nur in dieser einen Wendung zugelassen: der Beihilferegel der Richtlinie (Anhang A6, Broschüre S. 9).
# Sie nennt keine Rendite des Modellhauses. Gebunden ist der ganze Wortlaut der Zeile, wie ihn die Broschüre seit ihrem Lektorat vom 11.11.2026 führt.
RENDITE_ERLAUBT = [re.compile(r"^Die NBank begrenzt jede Förderung so, dass die Eigenkapitalrendite angemessen bleibt \(Prüfung auf Überkompensation\)\. "
                              r"Bis 1 Prozentpunkt über dem 30-jährigen Swapsatz gilt sie stets als angemessen$")]
# Ausnahme von E5 auf Wunsch des Auftraggebers (11.11.2026): Die Anhangfolie zur Eigenkapitalrendite, und nur sie, trägt die Wörter „Rendite“ und
# „Marktmiete“ und Zahlen des Laufs modellhaus_rendite. „IRR“, „DSCR“ und „Safe Harbour“ stehen auch dort nicht.
RENDITE_FOLIE, RENDITE_LAUF = "anhang-rendite", "modellhaus_rendite"
VERBOTEN_AUSNAHME = {RENDITE_FOLIE: ("Rendite", "Marktmiete")}
# Anhangfolie zur Tilgungsschwelle je Herstellungskosten (Rückfrage zu Folie 20; auf Wunsch des Auftraggebers, 11.11.2026)
SCHWELLE_FOLIE = "anhang-tilgungsschwelle"

# ---- Quellenzeile im Schriftfeld: Folie → Block in daten/markt.json (Feld quelle_kurz). Die Form „Quellenzeile“ trägt genau diesen Wortlaut,
# in höchstens zwei Zeilen; auf keiner anderen Folie gibt es eine solche Form ----------------------------------------------------------------
QUELLENZEILEN = {"einstieg-baukosten": "baukosten", "ausgangslage-zinsen": "zinsen", "einstieg-kapitaldienst": "kapitaldienst",
                 "einstieg-bestand": "bestand", "pgn-baukosten": "kosten"}

# ---- E6: Gedankenstrich als Einschub -----------------------------------------------------------------------------------
# Ein Halbgeviertstrich zwischen Leerzeichen ist ein Einschub. Bis-Striche stehen ohne Leerzeichen („1–3“, „IV–VII“); ein Strich allein in
# einer Zelle heißt „kein Wert“. Ausgenommen sind die beiden wörtlichen Claims der PGN (Redaktionsregeln §9.2).
CLAIMS = [re.compile(r"Aus Ihrer guten Idee – machen wir den besten Plan", re.I), re.compile(r"Ihre PGN – ")]

# ---- Kernwerte: Quelle, Schreibweise, erwarteter Text, Folien ------------------------------------------------------------------------------
# Quelle ist ein Schlüssel in werte.json (Lauf modellhaus, sonst „lauf:schluessel“) oder eine Formel in der Schreibweise von daten/pruefung.json
# (Verweise lauf:schluessel und datei#pfad, + − × ÷, Klammern, runde(x, n)); so sind auch Auszahlungen mit gedrehtem Vorzeichen und Werte der
# Datendateien an ihre Folie gebunden. Der Wert steht mit Einheit und Vorzeichen (Minus U+2212, Plus bei den Schreibweisen mit „vz“) an
# seiner Folie, in einem Folientext oder einer Tabellenzelle.
SOLLMIETE_FREI = "modellhaus:dscr.noetige_miete.Frei * modellhaus:eingabe.wohnflaeche * 12"   # nötige Sollmiete frei finanziert, € p. a.
RENDITE = RENDITE_LAUF + ":rendite."                                                            # Schlüssel der Anhangfolie zur Eigenkapitalrendite
# Rechenweg der nötigen Miete (Folie 19): Bewirtschaftung = Objektverwaltung + Instandhaltung; Teiler = Anteil nach Mietausfall × Wohnfläche × 12 Monate
BEWIRTSCHAFTUNG = "modellhaus:jr1.objektverwaltung.A + modellhaus:jr1.instandhaltung.A"
BEWIRTSCHAFTUNG_FREI = "modellhaus:jr1.objektverwaltung.Frei + modellhaus:jr1.instandhaltung.Frei"
MIETFLAECHE_JAHR = "(1 - modellhaus:eingabe.mietausfall) * modellhaus:eingabe.wohnflaeche * 12"
# Sensitivität der Folie 23: dasselbe Haus mit dem ARGE-Median und mit dem Ausgangswert der Bemessungsgrenze als Herstellungskosten je m²
K_ARGE, K_GRENZE = "modellhaus_kosten_4631:", "modellhaus_kosten_5000:"
# Folie 21: Jahre mit Fehlbetrag in A, B und C zusammen (Übersicht 3.6); null heißt auf der Folie „Kein Jahr mit Fehlbetrag“
JAHRE_MIT_FEHLBETRAG = "modellhaus:liq.jahre_mit_fehlbetrag.A + modellhaus:liq.jahre_mit_fehlbetrag.B + modellhaus:liq.jahre_mit_fehlbetrag.C"
# Folie 23: Rückgang des Zahlungsüberschusses in A je 100 € Herstellungskosten je m² (wie in daten/pruefung.json)
JE_100_EURO = ("(modellhaus:jr1.zahlungsueberschuss.A - modellhaus_kosten_5000:jr1.zahlungsueberschuss.A)"
               " / (modellhaus_kosten_5000:eingabe.herstellungskosten_qm - modellhaus:eingabe.herstellungskosten_qm) * 100")
# Anhangfolie zur Tilgungsschwelle: Kosten je m², bei denen die Schwelle C gegenüber A gleich dem Tilgungssatz der Jahresrechnung ist (wie in daten/pruefung.json)
KOSTEN_AM_SCHNITT = ("(modellhaus:tilg.mehr_sollmiete.C - modellhaus:tilg.mehr_mietausfall.C) * modellhaus:eingabe.herstellungskosten_qm"
                     " / (modellhaus:tilg.mehrschuld.C * (modellhaus:eingabe.tilgung_nbank + modellhaus:tab.verwaltungskostenbeitrag))")
KERNWERTE = [
    ("dscr.kapitaldienst_jahr1.A", "euro", "34.150 €", ["rechnung-kapitaldienst", "rechnung-fluss-gefoerdert", "rechnung-miete", "fazit"]),
    ("dscr.kapitaldienst_jahr1.Frei", "euro", "132.805 €", ["rechnung-kapitaldienst", "rechnung-fluss-frei", "rechnung-miete", "fazit"]),
    ("dscr.noetige_miete.A", "euro2", "5,26 €", ["rechnung-miete", "rechnung-kosten", "fazit"]),
    ("dscr.noetige_miete.Frei", "euro2", "15,39 €", ["rechnung-fluss-frei", "rechnung-miete", "fazit"]),
    # Jahr 1: In allen drei Gruppen bleibt ein Zahlungsüberschuss (bis 11.11.2026 nur in A; B und C standen mit Minus)
    ("jr1.zahlungsueberschuss.A", "euro", "15.003 €", ["rechnung-jahr1", "rechnung-fluss-gefoerdert", "rechnung-kosten"]),
    ("jr1.zahlungsueberschuss.A", "zahl", "15.003", ["rechnung-jahr1", "rechnung-tilgung", "rechnung-verlauf", "rechnung-kosten"]),
    ("jr1.zahlungsueberschuss.B", "zahl", "11.560", ["rechnung-jahr1", "rechnung-tilgung", "rechnung-verlauf", "rechnung-kosten"]),
    ("jr1.zahlungsueberschuss.C", "zahl", "10.812", ["rechnung-jahr1", "rechnung-tilgung", "rechnung-verlauf", "rechnung-kosten"]),
    # Folie 23: Mit höheren Herstellungskosten bleibt nur in A ein Zahlungsüberschuss; B und C stehen mit Minus (Vorzeichen gebunden).
    # Die Einträge stehen an der Stelle des früheren Laufs mit 5.200 € je m² (−19.963 € in A über der Bemessungsgrenze), den es nicht mehr gibt.
    (K_ARGE + "jr1.zahlungsueberschuss.A", "zahl", "4.965", ["rechnung-kosten"]),
    (K_GRENZE + "jr1.zahlungsueberschuss.A", "euro", "1.444 €", ["rechnung-kosten"]),
    (K_ARGE + "jr1.zahlungsueberschuss.B", "euro", "−3.497 €", ["rechnung-kosten"]),
    (K_GRENZE + "jr1.zahlungsueberschuss.B", "euro", "−8.778 €", ["rechnung-kosten"]),
    (K_ARGE + "jr1.zahlungsueberschuss.C", "euro", "−6.754 €", ["rechnung-kosten"]),
    (K_GRENZE + "jr1.zahlungsueberschuss.C", "euro", "−12.916 €", ["rechnung-kosten"]),
    ("fin.foerderung.A", "mio", "2,4 Mio. €", ["rechnung-finanzierung", "fazit"]),
    ("fin.gesamtkosten.A", "mio", "3,0 Mio. €", ["rechnung-finanzierung", "fazit"]),
    ("fin.miete_jahr1.A", "euro2", "6,80 €", ["hoechstmiete", "rechnung-fluss-gefoerdert", "rechnung-miete", "fazit"]),
    # Zahlungsfluss in Jahr 1 (Folien 17 und 18)
    ("jr1.sollmiete.A", "euro", "67.565 €", ["rechnung-fluss-gefoerdert", "rechnung-fluss-frei"]),
    ("jr1.ueberschuss_vor_kapitaldienst.A", "euro", "49.152 €", ["rechnung-fluss-gefoerdert"]),
    ("jr1.tilgung_nbank.A", "euro", "28.223 €", ["rechnung-fluss-gefoerdert"]),
    ("jr1.verwaltungskostenbeitrag.A", "euro", "5.927 €", ["rechnung-fluss-gefoerdert"]),
    ("jr1.instandhaltung.A", "euro", "11.923 €", ["rechnung-fluss-gefoerdert", "rechnung-fluss-frei"]),
    ("jr1.objektverwaltung.A", "euro", "5.138 €", ["rechnung-fluss-gefoerdert", "rechnung-fluss-frei"]),
    ("jr1.mietausfall.A", "euro", "1.351 €", ["rechnung-fluss-gefoerdert"]),
    ("modellhaus:jr1.tilgung_nbank.A / modellhaus:jr1.sollmiete.A", "prozent1", "41,8 %", ["rechnung-fluss-gefoerdert"]),
    (SOLLMIETE_FREI, "euro", "152.924 €", ["rechnung-fluss-gefoerdert", "rechnung-fluss-frei"]),   # auf Folie 17 am Umriss der Quelle
    ("modellhaus:eingabe.mietausfall * " + SOLLMIETE_FREI, "euro", "3.058 €", ["rechnung-fluss-frei"]),
    ("-modellhaus:frei.zins_jahr1", "euro", "88.665 €", ["rechnung-fluss-frei"]),
    ("-modellhaus:frei.tilgung_jahr1", "euro", "44.139 €", ["rechnung-fluss-frei"]),
    ("-modellhaus:frei.zins_jahr1 / (" + SOLLMIETE_FREI + ")", "prozent1", "58,0 %", ["rechnung-fluss-frei"]),
    # Herstellungskosten je m²: Das Modellhaus rechnet mit dem PGN-Median (Folien 14, 22 und 23); dazu die beiden Werte der Sensitivität (Folie 23)
    ("eingabe.herstellungskosten_qm", "euro", "3.579 €", ["rechnung-finanzierung", "pgn-baukosten", "rechnung-kosten"]),
    (K_ARGE + "eingabe.herstellungskosten_qm", "euro", "4.631 €", ["pgn-baukosten", "rechnung-kosten"]),
    (K_GRENZE + "eingabe.herstellungskosten_qm", "euro", "5.000 €", ["rechnung-kosten"]),
    ("eingabe.zins_bank", "prozent2", "3,74 %", ["ausgangslage-zinsen", "einstieg-kapitaldienst", "rechnung-kapitaldienst"]),
    # Folie 19: Bewirtschaftung im Rechenweg der nötigen Miete (Objektverwaltung und Instandhaltung, Übersicht D31 + D32)
    (BEWIRTSCHAFTUNG, "euro", "17.061 €", ["rechnung-miete"]),
    # Folien 20 und 24: Tilgungssatz, bei dem der Zahlungsüberschuss null ist (Übersicht 3.8), je Gruppe
    ("liq.breakeven_tilgung.A", "prozent2", "3,65 %", ["rechnung-tilgung", "fazit"]),
    ("liq.breakeven_tilgung.B", "prozent2", "3,03 %", ["rechnung-tilgung"]),
    ("liq.breakeven_tilgung.C", "prozent2", "2,90 %", ["rechnung-tilgung", "fazit"]),
    # Folie 21: Zahlungsüberschuss in Jahr 35 (Übersicht 3.2), im Titel der Wert der Gruppe A
    ("liq.zahlungsueberschuss_jahr35.A", "euro", "64.860 €", ["rechnung-verlauf"]),
    ("liq.zahlungsueberschuss_jahr35.B", "zahl", "76.468", ["rechnung-verlauf"]),
    ("liq.zahlungsueberschuss_jahr35.C", "zahl", "84.149", ["rechnung-verlauf"]),
    # Anhangfolie zur Tilgungsschwelle (A8): Schwelle C gegenüber A der drei Läufe, im Diagramm und in der Tabelle; Kosten am Schnitt auf 100 € gerundet
    ("tilg.schwelle.C_gegen_A", "prozent2", "1,91 %", [SCHWELLE_FOLIE]),
    (K_ARGE + "tilg.schwelle.C_gegen_A", "prozent2", "1,36 %", [SCHWELLE_FOLIE]),
    (K_GRENZE + "tilg.schwelle.C_gegen_A", "prozent2", "1,22 %", [SCHWELLE_FOLIE]),
    (f"runde({KOSTEN_AM_SCHNITT}, -2)", "euro", "3.000 €", [SCHWELLE_FOLIE]),
    # Anhangfolie zur Eigenkapitalrendite (A7): die beiden Titelzahlen (mit Restwert, ohne Restwert) und der tiefste Stand des Projektkontos
    # frei finanziert. Renditen mit zwei Nachkommastellen wie in der Rechenmappe. „Ohne Restwert“ ist die Zeile 6.4 der Übersicht („nur Bodenwert“):
    # Das Grundstück des Modellhauses ist nicht angesetzt, der Bodenwert ist null (Rechenmappe, Blatt Hinweise Nr. 15)
    (RENDITE + "vofi_mit_restwert.A", "prozent2", "6,95 %", [RENDITE_FOLIE]),
    (RENDITE + "vofi_nur_bodenwert.A", "prozent2", "2,58 %", [RENDITE_FOLIE]),
    (RENDITE + "projektkonto_tiefststand.Frei", "zahl", "−22.640", [RENDITE_FOLIE]),
]
# ---- Kernwerte der Ausgangslage und des Kostenvergleichs: Werte der Datendateien und daraus gerechnete Größen, in derselben Schreibweise ----
KOSTEN_2020 = "(markt#baukosten.herstellung.q1_2020 + markt#baukosten.grundstueck.q1_2020)"
KOSTEN_HEUTE = "(markt#baukosten.herstellung.q4_2025 + markt#baukosten.grundstueck.q4_2025)"
FAKTOR_2020 = "monatsrate(markt#kapitaldienst.zins_q1_2020 / 100, modellhaus:eingabe.laufzeit_bank)"   # Monatsrate je Euro Darlehen bei 0,46 % über 30 Jahre
FAKTOR_HEUTE = "monatsrate(modellhaus:eingabe.zins_bank, modellhaus:eingabe.laufzeit_bank)"            # dasselbe bei 3,74 %
KD_2020 = f"markt#kapitaldienst.fremdkapital * {KOSTEN_2020} * {FAKTOR_2020}"     # Kapitaldienst je m² und Monat
KD_HEUTE = f"markt#kapitaldienst.fremdkapital * {KOSTEN_HEUTE} * {FAKTOR_HEUTE}"
KD_BAUKOSTEN = f"markt#kapitaldienst.fremdkapital * ({KOSTEN_HEUTE} - {KOSTEN_2020}) * {FAKTOR_2020}"
KD_ZINS = f"markt#kapitaldienst.fremdkapital * {KOSTEN_2020} * ({FAKTOR_HEUTE} - {FAKTOR_2020})"
KD_WECHSELWIRKUNG = f"markt#kapitaldienst.fremdkapital * ({KOSTEN_HEUTE} - {KOSTEN_2020}) * ({FAKTOR_HEUTE} - {FAKTOR_2020})"
BESTAND_RUECKGANG = "markt#bestand.reihe.wert.2025 / markt#bestand.reihe.wert.2016 - 1"
PGN_UNTER_ARGE = "markt#kosten.pgn.spanne_herstellung.median / markt#kosten.arge.spanne_herstellung.median - 1"
KERNWERTE_MARKT = [
    ("markt#baukosten.herstellung.q1_2020", "zahl", "3.028", ["einstieg-baukosten"]),
    ("markt#baukosten.herstellung.q4_2025", "zahl", "4.631", ["einstieg-baukosten"]),
    ("markt#baukosten.grundstueck.q1_2020", "zahl", "726", ["einstieg-baukosten"]),
    ("markt#baukosten.grundstueck.q4_2025", "zahl", "761", ["einstieg-baukosten"]),
    ("markt#baukosten.herstellung.q4_2025 / markt#baukosten.herstellung.q1_2020 - 1", "prozent1vz", "+52,9 %", ["einstieg-baukosten"]),
    ("markt#baukosten.grundstueck.q4_2025 / markt#baukosten.grundstueck.q1_2020 - 1", "prozent1vz", "+4,8 %", ["einstieg-baukosten"]),
    ("markt#kapitaldienst.zins_q1_2020", "prozentwert2", "0,46 %", ["ausgangslage-zinsen", "einstieg-kapitaldienst"]),
    # Folie 10: Mietpfad der Gruppe A in Mietenstufe IV–VII, auf den Cent abgerundet wie die Broschüre S. 7 (7,2182 → 7,21 und 7,6621 → 7,66)
    ("regeln#mietpfad.jahr4", "euro2", "7,21 €", ["hoechstmiete"]),
    ("regeln#mietpfad.jahr7", "euro2", "7,66 €", ["hoechstmiete"]),
    # Folie 4: Legende (Werte des letzten Monats, Stelle 126 = 07/2026) und die Quartalsmittel an den beiden Marken stehen je Zinsbindung einzeln auf der Folie
    ("markt#zinsen.z20.wert.126", "prozentwert2", "4,02 %", ["ausgangslage-zinsen"]),
    ("markt#zinsen.z30.wert.126", "prozentwert2", "4,15 %", ["ausgangslage-zinsen"]),
    ("markt#zinsen.marken.wert.0.z20", "prozentwert2", "0,87 %", ["ausgangslage-zinsen"]),
    ("markt#zinsen.marken.wert.0.z30", "prozentwert2", "0,98 %", ["ausgangslage-zinsen"]),
    ("markt#zinsen.marken.wert.1.z10", "prozentwert2", "3,49 %", ["ausgangslage-zinsen"]),
    ("markt#zinsen.marken.wert.1.z20", "prozentwert2", "3,74 %", ["ausgangslage-zinsen"]),
    ("markt#zinsen.marken.wert.1.z30", "prozentwert2", "3,87 %", ["ausgangslage-zinsen"]),
    (KOSTEN_2020, "euro", "3.754 €", ["einstieg-kapitaldienst"]),
    (KOSTEN_HEUTE, "euro", "5.392 €", ["einstieg-kapitaldienst"]),
    ("markt#kapitaldienst.fremdkapital", "prozent0", "80 %", ["einstieg-kapitaldienst"]),
    (KD_2020, "euro2", "8,93 €", ["einstieg-kapitaldienst"]),
    (KD_HEUTE, "euro2", "19,95 €", ["einstieg-kapitaldienst"]),
    (f"{KD_HEUTE} - {KD_2020}", "euro2vz", "+11,02 €", ["einstieg-kapitaldienst"]),
    (KD_BAUKOSTEN, "euro2vz", "+3,90 €", ["einstieg-kapitaldienst"]),
    (KD_ZINS, "euro2vz", "+4,96 €", ["einstieg-kapitaldienst"]),
    (KD_WECHSELWIRKUNG, "euro2vz", "+2,16 €", ["einstieg-kapitaldienst"]),
    ("markt#bestand.reihe.wert.2016", "zahl", "85.766", ["einstieg-bestand"]),
    ("markt#bestand.reihe.wert.2024", "zahl", "50.495", ["einstieg-bestand"]),
    ("markt#bestand.reihe.wert.2025", "zahl", "50.920", ["einstieg-bestand"]),
    (BESTAND_RUECKGANG, "prozent1vz", "−40,6 %", ["einstieg-bestand"]),
    ("markt#markt.quote", "prozent0", "28 %", ["einstieg-bestand"]),
    ("markt#markt.ausgelaufen", "zahl", "58.024", ["einstieg-bestand"]),
    ("markt#kosten.pgn.spanne_herstellung.median", "euro", "3.579 €", ["pgn-baukosten"]),
    ("markt#kosten.arge.spanne_herstellung.median", "euro", "4.631 €", ["pgn-baukosten"]),
    (PGN_UNTER_ARGE, "prozent1vz", "−22,7 %", ["pgn-baukosten"]),
    # Folie 22: Die Werte über den Säulen sind Textfelder (Stelle in der Liste wie kosten.gruppen: Herstellung, Bauwerk, Baunebenkosten, Außenanlagen)
    ("markt#kosten.pgn.median.wert.0", "zahl", "3.579", ["pgn-baukosten"]),
    ("markt#kosten.arge.median.wert.0", "zahl", "4.631", ["pgn-baukosten"]),
    ("markt#kosten.pgn.median.wert.1", "zahl", "2.812", ["pgn-baukosten"]),
    ("markt#kosten.arge.median.wert.1", "zahl", "3.713", ["pgn-baukosten"]),
    ("markt#kosten.pgn.median.wert.2", "zahl", "458", ["pgn-baukosten"]),
    ("markt#kosten.arge.median.wert.2", "zahl", "555", ["pgn-baukosten"]),
    ("markt#kosten.pgn.median.wert.3", "zahl", "221", ["pgn-baukosten"]),
    ("markt#kosten.arge.median.wert.3", "zahl", "174", ["pgn-baukosten"]),
]
# ---- Kernsätze: Werte in ihrem Satz. Folie, Satz mit Feldern, je Feld Quelle (wie bei den Kernwerten) und Schreibweise -----------------------
# Der Satz steht so in einer Form der Folie (Groß- und Kleinschreibung zählt nicht, Titel stehen in Versalien). Die Zahl ist damit an ihr Wort
# gebunden: Die Laufzeit von 42 Jahren belegt nicht die Bindung, 0,5 % nicht das Entgelt für den Zuschuss, die Höchstmiete von B nicht die von A.
# Ein Satz ohne Feld ist ein fester Wortlaut, der auf der Folie stehen muss (Fokus des Vortrags auf der Agenda).
KERNSAETZE = [
    ("eckdaten-zeitstrahl", "{a} Jahre zinsfrei und gebunden", {"a": ("tab.zinsfreie_jahre", "zahl")}),
    ("eckdaten-zeitstrahl", "Belegungs- und Mietbindung {a} Jahre", {"a": ("tab.bindung", "zahl")}),
    ("eckdaten-zeitstrahl", "Laufzeit höchstens {a} Jahre", {"a": ("tab.laufzeit_hoechstens", "zahl")}),
    ("eckdaten-zeitstrahl", "{a} Zins ab Auszahlung bis Ende Jahr {b}", {"a": ("tab.zins_nbank_bis_jahr35", "prozent0"), "b": ("tab.zinsfreie_jahre", "zahl")}),
    ("eckdaten-zeitstrahl", "{a} p. a.", {"a": ("tab.verwaltungskostenbeitrag", "prozent1")}),
    ("eckdaten-zeitstrahl", "{a} / {b}", {"a": ("tab.bearbeitungsentgelt_darlehen", "prozent0"), "b": ("tab.bearbeitungsentgelt_zuschuss", "prozent2")}),
    ("anhang-eckdaten", "Verwaltungskostenbeitrag {a} p. a. auf das Restkapital", {"a": ("tab.verwaltungskostenbeitrag", "prozent1")}),
    ("anhang-eckdaten", "Bearbeitungsentgelt {a} des bewilligten Darlehens und {b} des bewilligten Zuschusses",
     {"a": ("tab.bearbeitungsentgelt_darlehen", "prozent0"), "b": ("tab.bearbeitungsentgelt_zuschuss", "prozent2")}),
    ("anhang-eckdaten", "mindestens {a} der zuwendungsfähigen Kosten", {"a": ("tab.eigenmittel_mindestens", "prozent0")}),
    ("foerdermix", "Mindestens {a} der zuwendungsfähigen Kosten", {"a": ("tab.eigenmittel_mindestens", "prozent0")}),
    ("rechnung-jahr1", "{a} | {b} | {c} € je m² und Monat (A | B | C)", {"a": ("fin.miete_jahr1.A", "dez2"), "b": ("fin.miete_jahr1.B", "dez2"), "c": ("fin.miete_jahr1.C", "dez2")}),
    # Modellhaus seit 11.11.2026: PGN-Projekt in Neu Wulmstorf, Mietenstufe VI, Grundstück im Bestand und nicht angesetzt (Eingabe 2.3 = 0).
    # Die Titel der Folien 14 bis 16, 19, 21 und 23 nennen das Ergebnis aller drei Gruppen und die Zahl der Gruppe A
    ("rechnung-finanzierung", "{a} Wohnungen, {b}: bis zu {c} Förderung", {"a": ("eingabe.wohnungen", "zahl"), "b": ("fin.gesamtkosten.A", "mio"), "c": ("fin.foerderung.A", "mio")}),
    ("rechnung-finanzierung", "PGN-Projekt in Neu Wulmstorf · {a} Wohnungen · {b} m² Wohnfläche · Gruppe A · Mietenstufe {c}",
     {"a": ("eingabe.wohnungen", "zahl"), "b": ("eingabe.wohnflaeche", "zahl"), "c": ("eingabe.mietenstufe", "text")}),
    ("rechnung-finanzierung", "Grundstück im Bestand, {a}", {"a": ("eingabe.grundstueck", "nicht_angesetzt")}),
    ("rechnung-finanzierung", "Herstellungskosten, {a} m² × {b}", {"a": ("eingabe.wohnflaeche", "zahl"), "b": ("eingabe.herstellungskosten_qm", "euro")}),
    ("rechnung-jahr1", "Alle drei Gruppen tragen sich ab Jahr 1: {a} Zahlungsüberschuss in A", {"a": ("jr1.zahlungsueberschuss.A", "euro")}),
    ("rechnung-jahr1", "Höchstmiete nettokalt, Mietenstufe {a}:", {"a": ("eingabe.mietenstufe", "text")}),
    ("rechnung-kapitaldienst", "Kapitaldienst in Jahr 1: {a} statt {b} frei finanziert", {"a": ("dscr.kapitaldienst_jahr1.A", "euro"), "b": ("dscr.kapitaldienst_jahr1.Frei", "euro")}),
    ("rechnung-miete", "Nötige Miete: {a} gefördert, {b} je m² frei finanziert", {"a": ("dscr.noetige_miete.A", "euro2"), "b": ("dscr.noetige_miete.Frei", "euro2")}),
    ("rechnung-jahr1", "Verwaltungskostenbeitrag, {a}", {"a": ("tab.verwaltungskostenbeitrag", "prozent1")}),
    ("rechnung-jahr1", "Zins NBank-Darlehen, {a}", {"a": ("tab.zins_nbank_bis_jahr35", "prozent0")}),
    ("rechnung-miete", "Höchstmiete Gruppe A: {a}", {"a": ("fin.miete_jahr1.A", "euro2")}),
    # Folien des Umbaus: die Aussage des Titels und die Angaben, die eine Zahl an ihr Wort binden
    ("ausgangslage-zinsen", "Kredite kosten {a}, Anfang 2020 waren es {b}", {"a": ("eingabe.zins_bank", "prozent2"), "b": ("markt#kapitaldienst.zins_q1_2020", "prozentwert2")}),
    ("einstieg-kapitaldienst", "Kapitaldienst je m² und Monat: von {a} auf {b} seit 2020", {"a": (KD_2020, "dez2"), "b": (KD_HEUTE, "euro2")}),
    ("einstieg-kapitaldienst", "{a} · {b}", {"a": (KD_BAUKOSTEN, "euro2vz"), "b": (f"({KD_BAUKOSTEN}) / (({KD_HEUTE}) - ({KD_2020}))", "prozent0")}),
    ("einstieg-kapitaldienst", "{a} · {b}", {"a": (KD_ZINS, "euro2vz"), "b": (f"({KD_ZINS}) / (({KD_HEUTE}) - ({KD_2020}))", "prozent0")}),
    ("einstieg-kapitaldienst", "{a} · {b}", {"a": (KD_WECHSELWIRKUNG, "euro2vz"), "b": (f"({KD_WECHSELWIRKUNG}) / (({KD_HEUTE}) - ({KD_2020}))", "prozent0")}),
    ("einstieg-bestand", "{a} weniger gebundene Wohnungen als 2016", {"a": ("-(" + BESTAND_RUECKGANG + ")", "prozent1")}),
    ("agenda", "Thema ist Programmteil 2.1: Neubau mit Darlehen und Zuschuss", {}),
    ("agenda", "Der Vortrag behandelt 2.1. Die Programmteile 2.2 bis 2.6 stehen in der Broschüre und im Anhang A1.", {}),
    ("rechnung-fluss-gefoerdert", "Gefördert: {a} der Miete fließen in die Tilgung", {"a": ("modellhaus:jr1.tilgung_nbank.A / modellhaus:jr1.sollmiete.A", "prozent1")}),
    ("rechnung-fluss-gefoerdert", "{a} je m² und Monat", {"a": ("fin.miete_jahr1.A", "euro2")}),
    ("rechnung-fluss-gefoerdert", "{a} · {b}", {"a": ("jr1.tilgung_nbank.A", "euro"), "b": ("modellhaus:jr1.tilgung_nbank.A / modellhaus:jr1.sollmiete.A", "prozent1")}),
    ("rechnung-fluss-gefoerdert", "{a} · {b}", {"a": ("jr1.verwaltungskostenbeitrag.A", "euro"), "b": ("modellhaus:jr1.verwaltungskostenbeitrag.A / modellhaus:jr1.sollmiete.A", "prozent1")}),
    ("rechnung-fluss-frei", "Frei finanziert: {a} der Miete sind Zins", {"a": ("-modellhaus:frei.zins_jahr1 / (" + SOLLMIETE_FREI + ")", "prozent1")}),
    ("rechnung-fluss-frei", "{a} je m² und Monat", {"a": ("dscr.noetige_miete.Frei", "euro2")}),
    ("rechnung-fluss-frei", "{a} · {b}", {"a": ("-modellhaus:frei.zins_jahr1", "euro"), "b": ("-modellhaus:frei.zins_jahr1 / (" + SOLLMIETE_FREI + ")", "prozent1")}),
    ("rechnung-fluss-frei", "{a} · {b}", {"a": ("-modellhaus:frei.tilgung_jahr1", "euro"), "b": ("-modellhaus:frei.tilgung_jahr1 / (" + SOLLMIETE_FREI + ")", "prozent1")}),
    ("pgn-baukosten", "Herstellungskosten der PGN: {a} unter dem ARGE-Median", {"a": ("-(" + PGN_UNTER_ARGE + ")", "prozent1")}),
    # Bis 11.11.2026 stand hier die Marke „Ansatz im Modellhaus: 4.500 €“. Das Modellhaus rechnet seither mit dem PGN-Median selbst; gebunden ist
    # jetzt das Wertepaar der Hauptzahl an die Rechenmappe: Ansatz des Modellhauses und Eingabewert des Laufs mit dem ARGE-Median (Folie 23)
    ("pgn-baukosten", "{a} gegen {b} je m²", {"a": ("eingabe.herstellungskosten_qm", "euro"), "b": (K_ARGE + "eingabe.herstellungskosten_qm", "euro")}),
    ("pgn-baukosten", "{a} gegen {b} je m²", {"a": ("markt#kosten.pgn.spanne_herstellung.median", "euro"), "b": ("markt#kosten.arge.spanne_herstellung.median", "euro")}),   # Label der Hauptzahl
    ("pgn-baukosten", "PGN {a} bis {b},", {"a": ("markt#kosten.pgn.spanne_herstellung.min", "zahl"), "b": ("markt#kosten.pgn.spanne_herstellung.max", "euro")}),
    ("pgn-baukosten", "ARGE {a} bis {b} je m²", {"a": ("markt#kosten.arge.spanne_herstellung.min", "zahl"), "b": ("markt#kosten.arge.spanne_herstellung.max", "euro")}),
    ("pgn-baukosten", "Spanne KG 200–700: Minimum bis Maximum", {}),   # Legende zum Maßzeichen der Spanne neben den Säulen der Herstellung
    # Anhangfolie zur Eigenkapitalrendite (A7): Titel, Annahmen und das Paar, in dem die Rechenmappe Renditen nach außen verlangt
    # Der Titel nennt für Gruppe A beide Lesarten: mit Restwert und ohne Restwert (Rechenmappe, Blatt Hinweise Nr. 12; die Lesart „nur Bodenwert“
    # der Mappe rechnet beim Modellhaus ohne Restwert, weil das Grundstück nicht angesetzt ist: Blatt Hinweise Nr. 15)
    (RENDITE_FOLIE, "Rendite in A: {a} mit Restwert, {b} ohne Restwert", {"a": (RENDITE + "vofi_mit_restwert.A", "prozent2"), "b": (RENDITE + "vofi_nur_bodenwert.A", "prozent2")}),
    (RENDITE_FOLIE, "Eigenkapitalrendite über {a} Jahre, vor Steuern", {"a": ("tab.zinsfreie_jahre", "zahl")}),
    (RENDITE_FOLIE, "Rendite mit Restwert", {}),
    (RENDITE_FOLIE, "Rendite ohne Restwert", {}),
    (RENDITE_FOLIE, "Anteil des Restwerts am Endvermögen", {}),
    (RENDITE_FOLIE, "Vor Steuern, ab Bezug: ohne Bauphase, Abschreibung und Sonder-AfA.", {}),
    # Grundstück im Bestand, nicht angesetzt: an die Eingabe 2.3 der Rechenmappe gebunden (0 €)
    (RENDITE_FOLIE, "Grundstück im Bestand, {a}: weder im Eigenkapital noch im Restwert.", {"a": ("eingabe.grundstueck", "nicht_angesetzt")}),
    # Marktmiete und Liegenschaftszins des Modellhauses gelten für Neu Wulmstorf: Mietband der PGN und Landesmodell des Oberen Gutachterausschusses
    # (Rechenmappe, Eingabe 4.4 und Blatt Tabellen, Tabelle 4, je Spalte Projekt 2). Der Liegenschaftszins steht mit zwei Nachkommastellen
    (RENDITE_FOLIE, "Marktmiete {b} je m²: Mietband der PGN für Neu Wulmstorf. Liegenschaftszins {a}: Landesmodell des Oberen Gutachterausschusses.",
     {"a": (RENDITE + "liegenschaftszins.A", "prozent2"), "b": (RENDITE + "annahme.marktmiete_jahr1", "euro2")}),
    (RENDITE_FOLIE, "Restwert: Ertragswert Ende Jahr {a}.", {"a": ("tab.zinsfreie_jahre", "zahl")}),
    # Bis 11.11.2026 „Marktmiete +2 %, Boden +1,5 % p. a.“: Ohne angesetztes Grundstück gibt es keinen Bodenwert, die Annahme steht nicht mehr auf der Folie
    (RENDITE_FOLIE, "Marktmiete +{a} p. a.", {"a": (RENDITE + "annahme.mietsteigerung", "prozent0")}),
    (RENDITE_FOLIE, "Fehlbeträge laufen auf ein Projektkonto zu {a} Sollzins.", {"a": (RENDITE + "annahme.sollzins", "prozent0")}),
    # Anhangfolie zur Tilgungsschwelle (A8): Titel, Marke und die beiden Absätze
    (SCHWELLE_FOLIE, "Bei {a} Tilgung liegt Gruppe A ab rund {b} je m² vorn", {"a": ("eingabe.tilgung_nbank", "prozent2"), "b": (f"runde({KOSTEN_AM_SCHNITT}, -2)", "euro")}),
    (SCHWELLE_FOLIE, "Jahresrechnung: {a}", {"a": ("eingabe.tilgung_nbank", "prozent2")}),
    (SCHWELLE_FOLIE, "Modellhaus: {a}. ARGE-Median: {b}. Ausgangswert der Bemessungsgrenze: {c}.",
     {"a": ("eingabe.herstellungskosten_qm", "euro"), "b": (K_ARGE + "eingabe.herstellungskosten_qm", "euro"), "c": (K_GRENZE + "eingabe.herstellungskosten_qm", "euro")}),
    (SCHWELLE_FOLIE, "Über der Linie „C gegenüber A“ ist das A, darunter C, B in keinem Fall.", {}),
    (SCHWELLE_FOLIE, "Die Schwelle sinkt mit den Kosten: Die Mehrmiete je m² ist fest vorgegeben, die Mehrschuld wächst mit den Kosten.", {}),
    ("rechnung-jahr1", "Gerechnet ist Jahr 1 zum Kostenstand 2026, vor Steuern.", {}),
    # Folien 20 und 24: Annahme der Rechnung und die Sätze, bei denen der Zahlungsüberschuss null ist (Übersicht 3.8); Schwelle C gegen A.
    # Bis 11.11.2026 hieß der erste Satz „Bei … bleibt nur in A ein Zahlungsüberschuss. Ab … ist er auch dort null.“; beim neuen Modellhaus
    # bleibt er in allen drei Gruppen, und jede Gruppe ist an ihren Satz gebunden
    ("rechnung-tilgung", "Bei {a} Tilgung bleibt in allen drei Gruppen ein Zahlungsüberschuss. Am höchsten ist er in A.", {"a": ("eingabe.tilgung_nbank", "prozent2")}),
    ("rechnung-tilgung", "Null wird er in C bei {c}, in B bei {b} und in A bei {a} Tilgung.",
     {"a": ("liq.breakeven_tilgung.A", "prozent2"), "b": ("liq.breakeven_tilgung.B", "prozent2"), "c": ("liq.breakeven_tilgung.C", "prozent2")}),
    ("rechnung-tilgung", "Unter {a} läge C vorn, B in keinem Fall.", {"a": ("tilg.schwelle.C_gegen_A", "prozent2")}),
    ("fazit", "Annahme {a} p. a., null in C bei {c}, in A bei {b}.", {"a": ("eingabe.tilgung_nbank", "prozent2"), "b": ("liq.breakeven_tilgung.A", "prozent2"), "c": ("liq.breakeven_tilgung.C", "prozent2")}),
    # Folie 21: Bis 11.11.2026 stand hier die Summe der Fehlbeträge in B und C (Übersicht 3.7). Das neue Modellhaus hat kein Jahr mit Fehlbetrag;
    # gebunden ist jetzt diese Aussage an die Jahre mit Fehlbetrag der drei Gruppen (Übersicht 3.6, Summe 0) und der Titel an den Wert in Jahr 35
    ("rechnung-verlauf", "{a} Jahr mit Fehlbetrag.", {"a": (JAHRE_MIT_FEHLBETRAG, "kein")}),
    ("rechnung-verlauf", "Zahlungsüberschuss wächst bis Jahr 35 in allen drei Gruppen, in A auf {a}", {"a": ("liq.zahlungsueberschuss_jahr35.A", "euro")}),
    # Folie 23: Titel und der Satz, was die höheren Kosten am Zahlungsüberschuss ändern
    ("rechnung-kosten", "Bei {a} je m² trägt sich nur noch A: {b} Zahlungsüberschuss statt {c}",
     {"a": (K_GRENZE + "eingabe.herstellungskosten_qm", "euro"), "b": (K_GRENZE + "jr1.zahlungsueberschuss.A", "euro"), "c": ("jr1.zahlungsueberschuss.A", "euro")}),
    ("rechnung-kosten", "Je 100 € je m² mehr sinkt der Zahlungsüberschuss in A um {a}.", {"a": (JE_100_EURO, "euro")}),
    ("rechnung-kosten", "Bis hierher bleibt die Förderquote bei {a}.", {"a": (K_GRENZE + "fin.foerderquote.A", "prozent0")}),
]
# ---- Kernwerte in den Diagrammdaten: Quelle (wie bei den Kernwerten), Folie, Reihe, Kategorie. Der Wert steht dort ungerundet und mit Vorzeichen ----
KERNWERTE_DIAGRAMM = [
    ("tab.hoechstmiete.I.A", "hoechstmiete", "Mietenstufe I–III", "A"),
    ("tab.hoechstmiete.I.B", "hoechstmiete", "Mietenstufe I–III", "B"),
    ("tab.hoechstmiete.I.C", "hoechstmiete", "Mietenstufe I–III", "C"),
    ("tab.hoechstmiete.IV.A", "hoechstmiete", "Mietenstufe IV–VII", "A"),
    ("tab.hoechstmiete.IV.B", "hoechstmiete", "Mietenstufe IV–VII", "B"),
    ("tab.hoechstmiete.IV.C", "hoechstmiete", "Mietenstufe IV–VII", "C"),
    ("jr1.zahlungsueberschuss.A", "rechnung-verlauf", "Gruppe A", "1"),
    ("jr1.zahlungsueberschuss.B", "rechnung-verlauf", "Gruppe B", "1"),
    ("jr1.zahlungsueberschuss.C", "rechnung-verlauf", "Gruppe C", "1"),
    # Folie 23: die drei Säulen (Zahlungsüberschuss in A je Lauf)
    ("jr1.zahlungsueberschuss.A", "rechnung-kosten", "Zahlungsüberschuss Jahr 1", "3.579 € (Modellhaus)"),
    (K_ARGE + "jr1.zahlungsueberschuss.A", "rechnung-kosten", "Zahlungsüberschuss Jahr 1", "4.631 €"),
    (K_GRENZE + "jr1.zahlungsueberschuss.A", "rechnung-kosten", "Zahlungsüberschuss Jahr 1", "5.000 €"),
    # Folie 20: Die Jahresrechnung (Tilgung 1/42) liegt zwischen zwei Achsteilungen; gebunden ist der Stützpunkt 2,5 % der Geraden
    ("modellhaus:tilg.ueberschuss_vor_tilgung.B - 0.025 * modellhaus:fin.darlehen_nbank.B", "rechnung-tilgung", "Gruppe B", "2,5 %"),
    ("modellhaus:tilg.ueberschuss_vor_tilgung.C - 0.025 * modellhaus:fin.darlehen_nbank.C", "rechnung-tilgung", "Gruppe C", "2,5 %"),
    # Folie A8: Die Linien enden an der Bemessungsgrenze mit der Schwelle des Laufs modellhaus_kosten_5000 (Diagrammdaten in Prozent)
    (K_GRENZE + "tilg.schwelle.B_gegen_A * 100", SCHWELLE_FOLIE, "B gegenüber A", "5.000"),
    (K_GRENZE + "tilg.schwelle.C_gegen_A * 100", SCHWELLE_FOLIE, "C gegenüber A", "5.000"),
    # Folien des Umbaus
    ("markt#baukosten.herstellung.q1_2020", "einstieg-baukosten", "Q1 2020", "Herstellung KG 200–700"),
    ("markt#baukosten.herstellung.q4_2025", "einstieg-baukosten", "Q4 2025", "Herstellung KG 200–700"),
    ("markt#baukosten.grundstueck.q1_2020", "einstieg-baukosten", "Q1 2020", "Grundstück KG 100"),
    ("markt#baukosten.grundstueck.q4_2025", "einstieg-baukosten", "Q4 2025", "Grundstück KG 100"),
    ("modellhaus:eingabe.zins_bank * 100", "ausgangslage-zinsen", "10 Jahre", "07/2026"),
    # Folie 4: Die Fläche unter der Reihe „10 Jahre“ führt dieselben Werte wie die Linie (erster und letzter Monat)
    ("modellhaus:eingabe.zins_bank * 100", "ausgangslage-zinsen", "10 Jahre, Fläche", "07/2026"),
    ("markt#zinsen.z10.wert.0", "ausgangslage-zinsen", "10 Jahre, Fläche", "2016"),
    ("markt#zinsen.z10.wert.0", "ausgangslage-zinsen", "10 Jahre", "2016"),
    (KD_2020, "einstieg-kapitaldienst", "Stand Q1 2020", "Q1 2020"),
    (KD_2020, "einstieg-kapitaldienst", "Stand Q1 2020", "Heute"),
    (KD_BAUKOSTEN, "einstieg-kapitaldienst", "Baukosten", "Heute"),
    (KD_ZINS, "einstieg-kapitaldienst", "Zins", "Heute"),
    (KD_WECHSELWIRKUNG, "einstieg-kapitaldienst", "Wechselwirkung", "Heute"),
    ("markt#bestand.reihe.wert.2016", "einstieg-bestand", "Bestand zum 31.12.", "2016"),
    ("markt#bestand.reihe.wert.2024", "einstieg-bestand", "Bestand zum 31.12.", "2024"),
    ("markt#bestand.reihe.wert.2025", "einstieg-bestand", "Bestand zum 31.12.", "2025"),
    ("markt#kosten.pgn.spanne_herstellung.median", "pgn-baukosten", "PGN", "Herstellung KG 200–700"),
    ("markt#kosten.arge.spanne_herstellung.median", "pgn-baukosten", "ARGE", "Herstellung KG 200–700"),
    # Folie 22: Die Werte über den Säulen sind Textfelder und folgen den Diagrammdaten nicht; gebunden sind deshalb auch die übrigen Säulen
    ("markt#kosten.pgn.median.wert.1", "pgn-baukosten", "PGN", "Bauwerk KG 300/400"),
    ("markt#kosten.arge.median.wert.1", "pgn-baukosten", "ARGE", "Bauwerk KG 300/400"),
    ("markt#kosten.pgn.median.wert.2", "pgn-baukosten", "PGN", "Baunebenkosten KG 700"),
    ("markt#kosten.arge.median.wert.2", "pgn-baukosten", "ARGE", "Baunebenkosten KG 700"),
    ("markt#kosten.pgn.median.wert.3", "pgn-baukosten", "PGN", "Außenanlagen KG 500"),
    ("markt#kosten.arge.median.wert.3", "pgn-baukosten", "ARGE", "Außenanlagen KG 500"),
    # Folie 5: Die drei Ursachen haben bei „Q1 2020“ keine Höhe (ihre Datenpunkte stehen ohne Füllung und ohne Linie)
    ("0 * 1", "einstieg-kapitaldienst", "Baukosten", "Q1 2020"),
    ("0 * 1", "einstieg-kapitaldienst", "Zins", "Q1 2020"),
    ("0 * 1", "einstieg-kapitaldienst", "Wechselwirkung", "Q1 2020"),
]
# ---- Ganze Reihen in den Diagrammdaten: Quelle (Liste oder Tabelle Kategorie → Wert in einer Datendatei), Folie, Reihe. Jeder Wert steht an seiner Stelle ----
REIHEN_DIAGRAMM = [
    ("markt#zinsen.z10", "ausgangslage-zinsen", "10 Jahre"),
    ("markt#zinsen.z10", "ausgangslage-zinsen", "10 Jahre, Fläche"),
    ("markt#zinsen.z20", "ausgangslage-zinsen", "20 Jahre"),
    ("markt#zinsen.z30", "ausgangslage-zinsen", "30 Jahre"),
    ("markt#bestand.reihe", "einstieg-bestand", "Bestand zum 31.12."),
]
# ---- Kernwerte in ihrer Form: Quelle und Schreibweise (wie bei den Kernwerten), Folie, Name der Form, Zelle (Zeile, Spalte) einer Tabelle oder None,
# Text mit dem Feld {a} (auch der Name der Form darf {a} tragen). Die Form trägt genau diesen Text; so ist der Wert an seine Bezeichnung gebunden, auch wenn er mehrfach auf der Folie steht ----
KERNWERTE_FORM = [
    ("markt#zinsen.z10.wert.126", "prozentwert2", "ausgangslage-zinsen", "Legende Wert 10 Jahre", None, "{a}"),
    ("markt#zinsen.z20.wert.126", "prozentwert2", "ausgangslage-zinsen", "Legende Wert 20 Jahre", None, "{a}"),
    ("markt#zinsen.z30.wert.126", "prozentwert2", "ausgangslage-zinsen", "Legende Wert 30 Jahre", None, "{a}"),
    ("markt#zinsen.marken.wert.0.z10", "prozentwert2", "ausgangslage-zinsen", "Marke 1 Wert 10 Jahre", None, "{a}"),
    ("markt#zinsen.marken.wert.0.z20", "prozentwert2", "ausgangslage-zinsen", "Marke 1 Wert 20 Jahre", None, "{a}"),
    ("markt#zinsen.marken.wert.0.z30", "prozentwert2", "ausgangslage-zinsen", "Marke 1 Wert 30 Jahre", None, "{a}"),
    ("markt#zinsen.marken.wert.1.z10", "prozentwert2", "ausgangslage-zinsen", "Marke 2 Wert 10 Jahre", None, "{a}"),
    ("markt#zinsen.marken.wert.1.z20", "prozentwert2", "ausgangslage-zinsen", "Marke 2 Wert 20 Jahre", None, "{a}"),
    ("markt#zinsen.marken.wert.1.z30", "prozentwert2", "ausgangslage-zinsen", "Marke 2 Wert 30 Jahre", None, "{a}"),
    ("markt#baukosten.herstellung.q1_2020", "zahl", "einstieg-baukosten", "Wert Herstellung Q1 2020", None, "{a}"),
    ("markt#baukosten.herstellung.q4_2025", "zahl", "einstieg-baukosten", "Wert Herstellung Q4 2025", None, "{a}"),
    ("markt#baukosten.grundstueck.q1_2020", "zahl", "einstieg-baukosten", "Wert Grundstück Q1 2020", None, "{a}"),
    ("markt#baukosten.grundstueck.q4_2025", "zahl", "einstieg-baukosten", "Wert Grundstück Q4 2025", None, "{a}"),
    (KD_2020, "euro2", "einstieg-kapitaldienst", "Summe Q1 2020", None, "{a}"),
    (KD_HEUTE, "euro2", "einstieg-kapitaldienst", "Summe Heute", None, "{a}"),
    (KOSTEN_2020, "euro", "einstieg-kapitaldienst", "Tabelle Rechenweg", (1, 1), "{a}"),
    (KOSTEN_HEUTE, "euro", "einstieg-kapitaldienst", "Tabelle Rechenweg", (1, 2), "{a}"),
    ("markt#kapitaldienst.fremdkapital", "prozent0", "einstieg-kapitaldienst", "Tabelle Rechenweg", (2, 1), "{a}"),
    ("markt#kapitaldienst.fremdkapital", "prozent0", "einstieg-kapitaldienst", "Tabelle Rechenweg", (2, 2), "{a}"),
    ("markt#kapitaldienst.zins_q1_2020", "prozentwert2", "einstieg-kapitaldienst", "Tabelle Rechenweg", (3, 1), "{a}"),
    ("eingabe.zins_bank", "prozent2", "einstieg-kapitaldienst", "Tabelle Rechenweg", (3, 2), "{a}"),
    ("markt#bestand.reihe.wert.2016", "zahl", "einstieg-bestand", "Wert 2016", None, "{a}"),
    ("markt#bestand.reihe.wert.2024", "zahl", "einstieg-bestand", "Wert 2024", None, "{a}"),
    ("markt#bestand.reihe.wert.2025", "zahl", "einstieg-bestand", "Wert 2025", None, "{a}"),
    ("markt#kosten.pgn.median.wert.0", "zahl", "pgn-baukosten", "Wert Herstellung PGN", None, "{a}"),
    ("markt#kosten.arge.median.wert.0", "zahl", "pgn-baukosten", "Wert Herstellung ARGE", None, "{a}"),
    ("markt#kosten.pgn.median.wert.1", "zahl", "pgn-baukosten", "Wert Bauwerk PGN", None, "{a}"),
    ("markt#kosten.arge.median.wert.1", "zahl", "pgn-baukosten", "Wert Bauwerk ARGE", None, "{a}"),
    ("markt#kosten.pgn.median.wert.2", "zahl", "pgn-baukosten", "Wert Baunebenkosten PGN", None, "{a}"),
    ("markt#kosten.arge.median.wert.2", "zahl", "pgn-baukosten", "Wert Baunebenkosten ARGE", None, "{a}"),
    ("markt#kosten.pgn.median.wert.3", "zahl", "pgn-baukosten", "Wert Außenanlagen PGN", None, "{a}"),
    ("markt#kosten.arge.median.wert.3", "zahl", "pgn-baukosten", "Wert Außenanlagen ARGE", None, "{a}"),
    ("markt#kosten.arge.spanne_herstellung.max", "zahl", "pgn-baukosten", "Spanne ARGE Text", None, "Maximum {a}"),
    # Maßkettenwerte: Die Form heißt „Maßkettenwert <Wert>“; Name und Text tragen denselben Wert
    ("markt#baukosten.herstellung.q4_2025 / markt#baukosten.herstellung.q1_2020 - 1", "prozent1vz", "einstieg-baukosten", "Maßkettenwert {a}", None, "{a}"),
    ("markt#baukosten.grundstueck.q4_2025 / markt#baukosten.grundstueck.q1_2020 - 1", "prozent1vz", "einstieg-baukosten", "Maßkettenwert {a}", None, "{a}"),
    (f"{KD_HEUTE} - {KD_2020}", "euro2vz", "einstieg-kapitaldienst", "Maßkettenwert {a}", None, "{a}"),
    (BESTAND_RUECKGANG, "prozent1vz", "einstieg-bestand", "Maßkettenwert {a}", None, "{a}"),
]
# Tabelle der Anhangfolie zur Tilgungsschwelle (A8): Zeile 0 ist der Kopf mit den Herstellungskosten je m² der drei Läufe (Spalten 1 bis 3),
# Zeile 1 die Schwelle B gegenüber A, Zeile 2 die Schwelle C gegenüber A. Jede Zahl ist an ihren Lauf der Rechenmappe gebunden.
KERNWERTE_FORM += [(lauf + key, art, SCHWELLE_FOLIE, "Tabelle Schwellen", (zeile, sp), "{a}")
                   for sp, lauf in enumerate(("modellhaus:", K_ARGE, K_GRENZE), start=1)
                   for zeile, key, art in ((0, "eingabe.herstellungskosten_qm", "euro"), (1, "tilg.schwelle.B_gegen_A", "prozent2"), (2, "tilg.schwelle.C_gegen_A", "prozent2"))]
# Rechenblatt der Anhangfolie zur Eigenkapitalrendite (A7): Zeile 0 ist der Kopf, Spalte 0 die Zeilennummer, Spalte 1 die Position; die Werte
# stehen in den Spalten 2 bis 5 (A, B, C, frei). Jede Zahl der Tabelle ist an ihre Zelle der Rechenmappe gebunden. Zeile 6 („Rendite ohne
# Restwert“) liest die Zeile 6.4 der Übersicht; führt die Mappe dort „n. v.“, steht ein Strich, und ein Restwertanteil über 1 heißt „über 100 %“.
_RT, _SP = "Rechenblatt Rendite", {"A": 2, "B": 3, "C": 4, "Frei": 5}
KERNWERTE_FORM += (
    [("fin.eigenkapital." + g, "zahl", RENDITE_FOLIE, _RT, (1, sp), "{a}") for g, sp in _SP.items()]
    + [("liq.jahre_mit_fehlbetrag." + g, "zahl", RENDITE_FOLIE, _RT, (2, _SP[g]), "{a}") for g in "ABC"]
    + [(RENDITE + "jahre_mit_fehlbetrag.Frei", "zahl", RENDITE_FOLIE, _RT, (2, _SP["Frei"]), "{a}")]
    + [(RENDITE + "projektkonto_tiefststand." + g, "zahl", RENDITE_FOLIE, _RT, (3, sp), "{a}") for g, sp in _SP.items()]
    + [(RENDITE + "restwert_jahr35." + g, "miozahl2", RENDITE_FOLIE, _RT, (4, sp), "{a}") for g, sp in _SP.items()]
    + [(RENDITE + "vofi_mit_restwert." + g, "prozent2", RENDITE_FOLIE, _RT, (5, sp), "{a}") for g, sp in _SP.items()]
    + [(RENDITE + "vofi_nur_bodenwert." + g, "prozent2", RENDITE_FOLIE, _RT, (6, _SP[g]), "{a}") for g in "ABC"]
    + [(RENDITE + "vofi_nur_bodenwert.Frei", "strich_wenn_nv", RENDITE_FOLIE, _RT, (6, _SP["Frei"]), "{a}")]
    + [(RENDITE + "restwertanteil." + g, "prozent0", RENDITE_FOLIE, _RT, (7, _SP[g]), "{a}") for g in "ABC"]
    + [(RENDITE + "restwertanteil.Frei", "ueber100", RENDITE_FOLIE, _RT, (7, _SP["Frei"]), "{a}")]
)
# Tabelle „Rechenweg“ der Folie 19 (nötige Miete): Zeile 0 ist der Kopf, Spalte 0 die Position; Spalte 1 gefördert (A), Spalte 2 frei finanziert.
# Jede Zahl des Rechenwegs ist an ihre Zelle gebunden.
_MT = "Tabelle Rechenweg"
KERNWERTE_FORM += [
    ("dscr.kapitaldienst_jahr1.A", "euro", "rechnung-miete", _MT, (1, 1), "{a}"), ("dscr.kapitaldienst_jahr1.Frei", "euro", "rechnung-miete", _MT, (1, 2), "{a}"),
    (BEWIRTSCHAFTUNG, "euro", "rechnung-miete", _MT, (2, 1), "{a}"), (BEWIRTSCHAFTUNG_FREI, "euro", "rechnung-miete", _MT, (2, 2), "{a}"),
    (MIETFLAECHE_JAHR, "zahl", "rechnung-miete", _MT, (3, 1), "{a}"), (MIETFLAECHE_JAHR, "zahl", "rechnung-miete", _MT, (3, 2), "{a}"),
    ("dscr.noetige_miete.A", "euro2", "rechnung-miete", _MT, (4, 1), "{a}"), ("dscr.noetige_miete.Frei", "euro2", "rechnung-miete", _MT, (4, 2), "{a}"),
]
# ---- Verweise: Folie, Ort („folie“ für Folientext, „notizen“), Text mit Feldern, je Feld die Kennung der gemeinten Folie ------------------------
# Der Text steht so auf der Folie oder in ihren Notizen, und das Feld trägt die Blattnummer der gemeinten Folie aus dem Konzept. Ändert sich
# die Zählung, fällt jeder Verweis auf, der nicht mitgeführt wurde.
VERWEISE = [
    ("agenda", "folie", "stehen in der Broschüre und im Anhang {a}.", {"a": "anhang-programmteile"}),
    ("agenda", "notizen", "in Kurzform im Anhang {a}.", {"a": "anhang-programmteile"}),
    ("einstieg-kapitaldienst", "notizen", "Die nötige Miete des Modellhauses (15,39 €, Folie {a})", {"a": "rechnung-miete"}),
    ("hoechstmiete", "notizen", "die Grenzen stehen im Anhang {a}.", {"a": "anhang-mieterkreis"}),
    ("eckdaten-zeitstrahl", "notizen", "Alle Eckdaten im Anhang {a}.", {"a": "anhang-eckdaten"}),
    ("rechnung-jahr1", "notizen", "kein Jahr mit einem Fehlbetrag (Folie {a})", {"a": "rechnung-verlauf"}),
    ("rechnung-jahr1", "notizen", "B und C folgen auf den Folien {a} und {b}.", {"a": "rechnung-tilgung", "b": "rechnung-verlauf"}),
    ("rechnung-jahr1", "notizen", "Die Rendite über 35 Jahre steht im Anhang (Folie {a}).", {"a": RENDITE_FOLIE}),
    ("rechnung-kapitaldienst", "notizen", "den Zinsverlauf zeigt Folie {a}.", {"a": "ausgangslage-zinsen"}),
    ("rechnung-fluss-gefoerdert", "notizen", "Der Kapitaldienst ist der von Folie {a}:", {"a": "rechnung-kapitaldienst"}),
    ("rechnung-fluss-frei", "notizen", "geht in den Kapitaldienst, wie auf Folie {a}.", {"a": "rechnung-kapitaldienst"}),
    ("rechnung-miete", "notizen", "Die Annahmen stehen auf Folie {a}.", {"a": "rechnung-kapitaldienst"}),
    ("rechnung-verlauf", "notizen", "Folie {a} nennt abgerundet", {"a": "hoechstmiete"}),
    ("rechnung-kosten", "notizen", "ist der PGN-Median der Folie {a},", {"a": "pgn-baukosten"}),
    ("antragsweg", "notizen", "der erste Spatenstich (Anhang {a}).", {"a": "anhang-vertraege"}),
    ("antragsweg", "notizen", "die Bedarfslage am Standort stehen im Anhang {a}.", {"a": "anhang-voraussetzungen"}),
    ("anhang-trenner", "notizen", "{a} und {b} zeigen Programmteile und Frist, {c} und {d} Voraussetzungen und Verträge vor der Bewilligung, {e} und {f} Mieterkreis und Eckdaten, {g} die Eigenkapitalrendite, {i} die Tilgungsschwelle je Herstellungskosten, {h} Quellen und Hinweis.",
     {"a": "anhang-programmteile", "b": "anhang-frist", "c": "anhang-voraussetzungen", "d": "anhang-vertraege", "e": "anhang-mieterkreis", "f": "anhang-eckdaten", "g": RENDITE_FOLIE, "i": SCHWELLE_FOLIE, "h": "quellen"}),
    ("rechnung-tilgung", "notizen", "Wie die Schwelle von den Herstellungskosten abhängt, zeigt Anhang {a}.", {"a": SCHWELLE_FOLIE}),
    (SCHWELLE_FOLIE, "notizen", "auch bei anderen Kosten gilt (Folie {a}).", {"a": "rechnung-tilgung"}),
    ("anhang-eckdaten", "notizen", "verdichtet auf den Folien {a} und {b}, Antrag und Bewilligung auf Folie {c};", {"a": "foerdermix", "b": "eckdaten-zeitstrahl", "c": "antragsweg"}),
    ("anhang-eckdaten", "notizen", "im Hinweis auf {a}.", {"a": "quellen"}),
    ("quellen", "folie", "Folien {a} und {b}: PGN (2026): eigene Auswertung von fünf Projekten", {"a": "pgn-baukosten", "b": "rechnung-kosten"}),
    ("quellen", "folie", "Folie {a}: eigene Rechnung der PGN", {"a": "einstieg-kapitaldienst"}),
    ("quellen", "folie", "Folie {a}: BT-Drs. 21/7303", {"a": "einstieg-bestand"}),
    (RENDITE_FOLIE, "notizen", "über Swapsatz plus 1 Prozentpunkt ({a});", {"a": "anhang-eckdaten"}),
    (RENDITE_FOLIE, "notizen", "kein Jahr mit Fehlbetrag (Folie {a})", {"a": "rechnung-verlauf"}),
    ("quellen", "folie", "{a}–{b}, {c}, {d}", {"a": "rechnung-finanzierung", "b": "fazit", "c": RENDITE_FOLIE, "d": SCHWELLE_FOLIE}),   # Zeile der Modellrechnung in der Spalte „Folie“
    ("quellen", "notizen", "alle Zahlen der Folien {a} bis {b}, {c}, {d}, {e} und {f}.", {"a": "rechnung-finanzierung", "b": "rechnung-verlauf", "c": "rechnung-kosten", "d": "fazit", "e": RENDITE_FOLIE, "f": SCHWELLE_FOLIE}),
    ("quellen", "notizen", "Baukosten (Folien {a} und {b}), Zinsreihe (Folie {c}), Bestandsreihe (Folie {d}) und der PGN-Median der Herstellungskosten (Folien {b} und {e}). Folie {f} rechnet mit diesen Werten.",
     {"a": "einstieg-baukosten", "b": "pgn-baukosten", "c": "ausgangslage-zinsen", "d": "einstieg-bestand", "e": "rechnung-kosten", "f": "einstieg-kapitaldienst"}),
]

# ---- Freiliste: Angaben, die keine Rechengrößen sind. Jede Regel: Name, Muster, Begründung ------------------------------------
# Zahlen innerhalb eines Treffers gelten als belegt. Die Liste ist kurz zu halten; was eine Aussage trägt, gehört in eine Datendatei.
FREI = [
    ("Monat", r"\b(?:0[1-9]|1[0-2])/(?:19|20)\d{2}\b", "Monatsangabe MM/JJJJ einer Zeitreihe oder eines Stands"),
    ("Quartal", r"\bQ[1-4] (?:19|20)\d{2}\b", "Quartalsangabe eines Kostenstands oder Mittelwerts"),
    ("Paragraf", r"§\s?\d+[a-z]?(?:\s+Abs\.\s+\d+)?|\bAbs\.\s+\d+|\bNr\.\s+\d+|\bAbb\.\s+\d+", "Paragraf, Absatz, Nummer oder Abbildung einer Fundstelle"),
    ("Seitenzahl", r"\bS\.\s+\d+(?:(?:,\s+|\s+und\s+|\s+bis\s+|–)\d+)*(?!\s*(?:%|€|m²))", "Seitenzahl einer Quelle"),
    ("Foliennummer", r"\b(?:Folien?|Blatt|Anhang)\s+A?\d+(?:(?:,\s+|\s+und\s+|\s+bis\s+|–|\s+oder\s+)A?\d+)*|\bA\d\b(?:(?:,\s+|\s+und\s+|\s+bis\s+)A\d\b)*",
     "Nummer einer Folie oder eines Blatts im Vortrag"),
    ("Programmteil", r"(?<![\d.,])2\.[1-6](?![\d])", "Nummer eines Programmteils der Richtlinie (2.1 bis 2.6)"),
    ("Kostengruppe", r"\bKG\s+\d{3}(?:[–/]\d{3})?|\bKostengruppen\s+\d{3}–\d{3}", "Nummer einer Kostengruppe nach DIN 276"),
    ("Leistungsphase", r"\b(?:Leistungsphasen?|LPH)\s+\d(?:(?:\s+bis\s+|–|\s+und\s+)\d)?(?:\s+HOAI)?|\bDie Leistungsphasen:(?:\s+\d\s+[^,.]+[,.])+",
     "Nummer einer Leistungsphase der HOAI, auch in der Aufzählung der neun Phasen"),
    ("Bezeichnung", r"\bEH-40\b|\bEffizienzhaus-40\b|\bKfW-Kredit\s+\d+(?:\s+oder\s+\d+)?|\bRechenmappe\s+v\d+|\bDIN\s+\d+", "Ziffer als Teil eines Namens (Effizienzhaus 40, Kreditnummer, Version)"),
    ("Zellbezug", r"\b[A-Z]{1,2}\d{1,3}(?::[A-Z]{1,2}\d{1,3})?\b|\bEingaben?(?:!\w+)?\s+\d\.\d(?:(?:\s+und\s+|\s+bis\s+|,\s+)\d\.\d)*|\bÜbersicht\s+\d\.\d(?:\s+bis\s+\d\.\d)?",
     "Zelle, Eingabe- oder Zeilennummer der Rechenmappe in einer Quellenzeile"),
]
# Geprüfte Angaben: keine Rechengrößen, aber sie müssen stimmen. Ein Datum und eine Jahreszahl gelten nur, wenn eine Datendatei oder
# daten/pruefung.json sie führt (Belege.daten_erlaubt, Belege.jahre); Jahre einer Monatsreihe (Schlüssel JJJJ-MM) gelten nur als Kategorien eines
# Diagramms. Eine Seite der Broschüre gibt es von 1 bis 24, einen Folienverweis nur zu einer Blattnummer des Konzepts.
DATUM = re.compile(r"\b(\d{1,2})\.(\d{1,2})\.(\d{4})?(?!\d)")
JAHR = re.compile(r"(?<![\d.,/])(?:19|20)\d{2}(?![\d]|[.,]\d)")
BROSCHUERE_S = re.compile(r"\bBroschüre\s+S\.\s+(\d+(?:(?:,\s+|\s+und\s+|\s+bis\s+|–)\d+)*)")
FOLIE_NR = re.compile(r"\b(?:Folien?|Anhang)\s+(A?\d+(?:(?:,\s+|\s+und\s+|\s+bis\s+|–|\s+oder\s+)A?\d+)*)|\b(A\d\b(?:(?:,\s+|\s+und\s+|\s+bis\s+)A\d\b)*)")
FOLIEN_NUMMERN = set()   # Blattnummern des Konzepts (1 bis 28, A0 bis A9); main() füllt die Menge
# Kleine ganze Zahlen als Zähler: Jahr der Rechnung, Zeile, Schritt, Gruppe. Nur wenn die Zahl sonst keinen Beleg hat.
ZAEHLER = re.compile(r"\b(?:Jahr(?:e|en)?|Zeilen?|Schritte?|Station(?:en)?|Punkte?|Größen)\s+(\d{1,2})(?:(?:\s+bis\s+|–|\s+und\s+)(\d{1,2}))?")
ZAEHLER_GRUND = "Zähler im Satz (Jahr der Rechnung, Zeile, Schritt), höchstens zweistellig"
NUR_ZAHL_GRUND = "Ordnungszahl in eigener Form oder Zelle (Achskreis, Zeilennummer, Blattnummer, Achsteilung), höchstens zweistellig"

# Läufe der Rechenmappe, deren Werte auf Folien stehen dürfen (die Läufe projekt2 und modellhaus_dscr125 erscheinen nicht: Konzept und E5).
# Der Lauf modellhaus_rendite (RENDITE_LAUF) steht nicht in dieser Liste: Er belegt nur Zahlen der Anhangfolie zur Rendite (RENDITE_FOLIE).
LAEUFE = ("modellhaus", "modellhaus_zeitreihe", "modellhaus_kosten_4631", "modellhaus_kosten_5000")
# Schlüssel, die kein Beleg sind: Deckungsgrade (E5; erlaubt sind nur Kapitaldienst und nötige Miete aus dem Block dscr) und reine Zähler
KEIN_BELEG = re.compile(r"(^|\.)dscr(?!\.kapitaldienst_jahr1|\.noetige_miete)|^zr\.jahr$|projekt_nr|^meta\.")

# Vor einer Zahl steht kein Buchstabe, kein Punkt und kein Komma. Ein Schrägstrich davor zählt nicht: „5.330/5.550 €“ sind zwei Zahlen
# (Monatsangaben MM/JJJJ und „KG 300/400“ deckt die Freiliste).
ZAHL = re.compile(r"(?<![\w.,])(?P<vz>[+\-−–]?)(?P<z>\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)(?![\d])")


# ====================================================================================================================
# Lesen der Mappe
# ====================================================================================================================
def rels(z, teil):
    """Beziehungen eines Teils: Id → (Typ, Ziel als Pfad im Paket)."""
    ordner, name = teil.rsplit("/", 1)
    pfad = f"{ordner}/_rels/{name}.rels"
    if pfad not in z.namelist():
        return {}
    out = {}
    for r in ET.fromstring(z.read(pfad)):
        ziel = r.get("Target")
        if ziel.startswith("/"):
            ziel = ziel[1:]
        else:
            teile = (ordner + "/" + ziel).split("/")
            stapel = []
            for t in teile:
                if t == "..":
                    stapel.pop()
                elif t != ".":
                    stapel.append(t)
            ziel = "/".join(stapel)
        out[r.get("Id")] = (r.get("Type").rsplit("/", 1)[-1], ziel)
    return out


def absaetze(txbody):
    """Absätze eines Textkörpers: [{ text, laeufe: [(text, groesse in pt oder None, schrift oder None)] }]. Zeilenwechsel im Absatz werden zu Leerzeichen."""
    out = []
    for p in txbody.findall(A + "p"):
        laeufe, text = [], ""
        for k in p:
            if k.tag == A + "r":
                t = k.findtext(A + "t") or ""
                rpr = k.find(A + "rPr")
                sz = rpr.get("sz") if rpr is not None else None
                lat = rpr.find(A + "latin") if rpr is not None else None
                laeufe.append((t, int(sz) / 100 if sz else None, lat.get("typeface") if lat is not None else None))
                text += t
            elif k.tag == A + "br":
                text += " "
            elif k.tag == A + "fld":
                text += k.findtext(A + "t") or ""
        out.append({"text": text, "laeufe": laeufe})
    return out


def lies_layout(z, pfad):
    """Name des Layouts und Schriftgröße je Platzhalter (aus dessen Listenstil), Schlüssel: idx oder „title“."""
    wurzel = ET.fromstring(z.read(pfad))
    name = wurzel.find(P + "cSld").get("name")
    name = LAYOUTNAMEN.get(name, name)
    groessen, texte = {}, []
    for sp in wurzel.iter(P + "sp"):
        ph = sp.find(f"{P}nvSpPr/{P}nvPr/{P}ph")
        tx = sp.find(P + "txBody")
        if ph is None:
            if tx is not None:
                texte += [a["text"] for a in absaetze(tx) if a["text"].strip()]
            continue
        d = tx.find(f"{A}lstStyle/{A}lvl1pPr/{A}defRPr") if tx is not None else None
        if d is not None and d.get("sz"):
            groessen["title" if ph.get("type") == "title" else ph.get("idx")] = int(d.get("sz")) / 100
    bilder = [pic.find(f"{P}nvPicPr/{P}cNvPr") for pic in wurzel.iter(P + "pic")]
    return {"name": name, "groessen": groessen, "texte": texte, "bilder": [(b.get("name"), b.get("descr")) for b in bilder if b is not None]}


def lies_arbeitsmappe(z, pfad):
    """Zellen des ersten Blatts einer eingebetteten Arbeitsmappe: { 'B2': Zahl oder Text }. Leere Zellen (<v></v>) stehen als None."""
    import io
    X = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
    xl = zipfile.ZipFile(io.BytesIO(z.read(pfad)))
    texte = []
    if "xl/sharedStrings.xml" in xl.namelist():
        texte = ["".join(t.text or "" for t in si.iter(X + "t")) for si in ET.fromstring(xl.read("xl/sharedStrings.xml")).findall(X + "si")]
    zellen = {}
    for c in ET.fromstring(xl.read("xl/worksheets/sheet1.xml")).iter(X + "c"):
        v = c.findtext(X + "v")
        if v in (None, ""):
            zellen[c.get("r")] = None
        elif c.get("t") == "s":
            zellen[c.get("r")] = texte[int(v)]
        else:
            zellen[c.get("r")] = float(v)
    tabelle = xl.read("xl/tables/table1.xml").decode("utf-8") if "xl/tables/table1.xml" in xl.namelist() else ""
    return {"zellen": zellen, "tabelle": tabelle}


def zellen_von(bezug):
    """„Sheet1!$B$2:$B$36“ → ['B2', …, 'B36'] (eine Spalte oder eine Zeile)."""
    m = re.fullmatch(r"[^!]+!\$([A-Z]+)\$(\d+)(?::\$([A-Z]+)\$(\d+))?", bezug or "")
    if not m:
        return []
    s1, z1, s2, z2 = m.group(1), int(m.group(2)), m.group(3) or m.group(1), int(m.group(4) or m.group(2))
    if s1 != s2 and z1 == z2:
        nr = lambda sp: sum((ord(ch) - 64) * 26 ** i for i, ch in enumerate(reversed(sp)))
        buchstabe = lambda n: (buchstabe((n - 1) // 26) if n > 26 else "") + chr(65 + (n - 1) % 26)
        return [f"{buchstabe(n)}{z1}" for n in range(nr(s1), nr(s2) + 1)]
    return [f"{s1}{n}" for n in range(z1, z2 + 1)]


def lies_diagramm(z, pfad):
    wurzel = ET.fromstring(z.read(pfad))
    reihen = []
    for ser in wurzel.iter(C + "ser"):
        name = " ".join(v.text or "" for v in ser.findall(f"{C}tx//{C}v"))
        kat = [v.text or "" for v in ser.findall(f"{C}cat//{C}pt/{C}v")]
        punkte = [(int(pt.get("idx")), pt.findtext(C + "v")) for pt in ser.findall(f"{C}val//{C}pt")]
        werte = [w for _, w in punkte]
        reihen.append({"name": name, "kategorien": kat, "werte": [float(w) for w in werte if w not in (None, "")],
                       "punkte": [(i, float(w)) for i, w in punkte if w not in (None, "")], "kat_punkte": [(int(pt.get("idx")), pt.findtext(C + "v") or "") for pt in ser.findall(f"{C}cat//{C}pt")],
                       "f_name": ser.findtext(f"{C}tx//{C}f"), "f_kat": ser.findtext(f"{C}cat//{C}f"), "f_werte": ser.findtext(f"{C}val//{C}f")})
    groessen = [int(e.get("sz")) / 100 for e in wurzel.iter() if e.tag in (A + "defRPr", A + "rPr") and e.get("sz")]
    schriften = {e.get("typeface") for e in wurzel.iter(A + "latin") if e.get("typeface")}
    mappe = next((ziel for typ, ziel in rels(z, pfad).values() if typ == "package" and ziel.endswith(".xlsx")), None)
    return {"pfad": pfad, "reihen": reihen, "groessen": groessen, "schriften": schriften, "mappe_pfad": mappe, "mappe": lies_arbeitsmappe(z, mappe) if mappe else None}


def lies_mappe(datei):
    z = zipfile.ZipFile(datei)
    namen = set(z.namelist())
    pres = ET.fromstring(z.read("ppt/presentation.xml"))
    prels = rels(z, "ppt/presentation.xml")
    ids = [(s.get("id"), prels[s.get(R + "id")][1]) for s in pres.find(P + "sldIdLst")]
    abschnitte = []
    for sec in pres.iter("{http://schemas.microsoft.com/office/powerpoint/2010/main}section"):
        abschnitte.append((sec.get("name"), [e.get("id") for e in sec.iter("{http://schemas.microsoft.com/office/powerpoint/2010/main}sldId")]))
    layouts, folien = {}, []
    for sid, pfad in ids:
        wurzel = ET.fromstring(z.read(pfad))
        r = rels(z, pfad)
        lay = next(ziel for typ, ziel in r.values() if typ == "slideLayout")
        if lay not in layouts:
            layouts[lay] = lies_layout(z, lay)
        notiz = next((ziel for typ, ziel in r.values() if typ == "notesSlide"), None)
        f = {"id": sid, "pfad": pfad, "layout": layouts[lay], "layout_pfad": lay, "formen": [], "bilder": [], "diagramme": [], "tabellen": 0, "notizen": None,
             "form_ids": [(e.get("id"), e.get("name") or "") for e in wurzel.iter(P + "cNvPr")],
             "uebergang": wurzel.find(P + "transition") is not None or wurzel.find(P + "timing") is not None}
        baum = wurzel.find(f"{P}cSld/{P}spTree")
        for el in baum.iter():
            if el.tag == P + "sp":
                nv = el.find(f"{P}nvSpPr/{P}cNvPr")
                ph = el.find(f"{P}nvSpPr/{P}nvPr/{P}ph")
                tx = el.find(P + "txBody")
                form = {"name": nv.get("name") or "", "art": "text", "ph": None, "descr": nv.get("descr"), "absaetze": absaetze(tx) if tx is not None else []}
                if ph is not None:
                    form["ph"] = "title" if ph.get("type") == "title" else ph.get("idx")
                f["formen"].append(form)
            elif el.tag == P + "graphicFrame":
                nv = el.find(f"{P}nvGraphicFramePr/{P}cNvPr")
                tbl = el.find(f".//{A}tbl")
                if tbl is not None:
                    f["tabellen"] += 1
                    for zi, tr in enumerate(tbl.findall(A + "tr")):
                        for si, tc in enumerate(tr.findall(A + "tc")):
                            tx = tc.find(A + "txBody")
                            f["formen"].append({"name": nv.get("name") or "", "art": "zelle", "ph": None, "zeile": zi, "spalte": si,
                                                "absaetze": absaetze(tx) if tx is not None else []})
                ch = el.find(f".//{C}chart")
                if ch is not None:
                    d = lies_diagramm(z, r[ch.get(R + "id")][1])
                    d["name"], d["descr"] = nv.get("name") or "", nv.get("descr") or ""
                    f["diagramme"].append(d)
            elif el.tag == P + "pic":
                nv = el.find(f"{P}nvPicPr/{P}cNvPr")
                ext = el.find(f"{P}spPr/{A}xfrm/{A}ext")
                flaeche = int(ext.get("cx")) * int(ext.get("cy")) if ext is not None else 0
                f["bilder"].append((nv.get("name") or "", nv.get("descr"), flaeche))
        if notiz:
            nw = ET.fromstring(z.read(notiz))
            for sp in nw.iter(P + "sp"):
                ph = sp.find(f"{P}nvSpPr/{P}nvPr/{P}ph")
                if ph is not None and ph.get("type") == "body":
                    f["notizen"] = "\n".join(a["text"] for a in absaetze(sp.find(P + "txBody")))
        folien.append(f)
    sldsz = pres.find(P + "sldSz")
    return {"zip": z, "namen": namen, "folien": folien, "abschnitte": abschnitte, "layouts": layouts,
            "flaeche": int(sldsz.get("cx")) * int(sldsz.get("cy")), "format": (int(sldsz.get("cx")), int(sldsz.get("cy")))}


# ====================================================================================================================
# Zahlen: Belege sammeln, Text zerlegen, vergleichen
# ====================================================================================================================
def runde(v, nk):
    """Kaufmännisch runden wie die Formatierer der Bibliothek (lib/daten.cjs)."""
    q = 10 ** nk
    return math.copysign(math.floor(abs(v) * q + 0.5 + 1e-9) / q, v)


def zahl_de(v, nk=0):
    r = runde(v, nk)
    s = f"{abs(r):.{nk}f}"
    g, _, d = s.partition(".")
    g = re.sub(r"\B(?=(\d{3})+(?!\d))", ".", g)
    return (MINUS if r < 0 else "") + g + ("," + d if d else "")


def zerlege(text):
    """Zahlen eines Textes: [(wert, nachkommastellen, anfang, ende, rohtext)]. Deutsche Schreibweise, Tausenderpunkt, Minus U+2212."""
    out = []
    for m in ZAHL.finditer(text):
        roh = m.group("z")
        nk = len(roh.split(",")[1]) if "," in roh else 0
        v = float(roh.replace(".", "").replace(",", "."))
        out.append((v, nk, m.start("z"), m.end("z"), roh))
    return out


def art_von(einheit):
    """Art eines Belegs nach seiner Einheit: anteil (Dezimalbruch, mal 100 ergibt Prozent), prozent, euro oder sonst."""
    e = str(einheit or "")
    return "anteil" if e.startswith("Anteil") else "prozent" if e.startswith(("%", "Prozent")) else "euro" if e.startswith(("€", "Euro")) else "sonst"


class Belege:
    """Zahlen mit Herkunft: werte.json, Datendateien, daten/pruefung.json. Je Zahl: Wert, Herkunft, Art (anteil, prozent, euro, sonst).
    Dazu die Daten und Jahreszahlen, die diese Dateien führen (daten_erlaubt, jahre; jahre_reihe: Jahre einer Monatsreihe)."""

    def __init__(self):
        self.mappe, self.dateien, self.fehler = [], [], []
        # Belege, die nur für eine Folie gelten (Kennung der Folie → Mappe, Datei); folie: Kennung der Folie, deren Text gerade geprüft wird
        self.nur_mappe, self.nur_datei, self.folie = defaultdict(list), defaultdict(list), None
        self.daten_erlaubt, self.jahre, self.jahre_reihe = set(), set(), set()
        self.werte = json.loads((DATEN / "werte.json").read_text(encoding="utf-8"))
        self._angaben(self.werte.get("meta", {}).get("mappe_stand", ""))
        for lauf, L in self.werte["laeufe"].items():
            if lauf == RENDITE_LAUF:
                for k, e in L["werte"].items():
                    self._nimm(self.nur_mappe[RENDITE_FOLIE], e.get("wert") if isinstance(e.get("wert"), (int, float)) else None, f"werte.json {lauf}:{k}", art_von(e.get("einheit")), alle=True)
                continue
            if lauf not in LAEUFE:
                continue
            for k, e in L["werte"].items():
                if not KEIN_BELEG.search(k):
                    self._nimm(self.mappe, e.get("wert"), f"werte.json {lauf}:{k}", art_von(e.get("einheit")), alle=True)
                if e.get("einheit") == "Jahr" and isinstance(e.get("wert"), (int, float)):
                    self.jahre.add(str(int(e["wert"])))
        self.mappe.sort(key=lambda e: ":zr." in e[1])   # Zeitreihen zuletzt: Der Beleg nennt, wo es geht, die Zelle der Übersicht
        self.daten, self.dateinamen = {}, []
        for name in ("regeln", "markt", "umsetzung", "rahmen", "rechnung"):
            pfad = DATEN / f"{name}.json"
            if pfad.exists():
                self.dateinamen.append(pfad.name)
                self.daten[name] = json.loads(pfad.read_text(encoding="utf-8"))
                self._lauf(self.daten[name], f"{name}.json", "", "sonst")
        pfad = DATEN / "pruefung.json"
        if pfad.exists():
            self.dateinamen.append(pfad.name)
            pr = json.loads(pfad.read_text(encoding="utf-8"))
            for e in pr.get("gerechnet", []):
                wo = e.get("wo", "")
                try:
                    v = self.rechne(e["formel"])
                except Exception as ex:  # noqa: BLE001
                    self.fehler.append(f"pruefung.json, gerechnet ({wo}): Formel „{e.get('formel')}“ lässt sich nicht rechnen ({ex})")
                    continue
                if e.get("nur_folie"):      # Beleg nur für diese eine Folie (Zahlen der Anhangfolie zur Rendite)
                    self.nur_datei[e["nur_folie"]].insert(0, (float(v), f"pruefung.json gerechnet: {e['formel']}", e.get("art", "sonst"), True))
                else:
                    self.dateien.insert(0, (float(v), f"pruefung.json gerechnet: {e['formel']}", e.get("art", "sonst"), True))   # vor den Zufallstreffern kleiner Zahlen
                if "wert" not in e:
                    self.fehler.append(f"pruefung.json, gerechnet ({wo}): „wert“ fehlt (die Zahl, wie sie auf der Folie oder in den Notizen steht)")
                elif abs(runde(v * (100 if e.get("art") == "anteil" else 1), e.get("nk", 0)) - e["wert"]) > 1e-9:
                    self.fehler.append(f"pruefung.json, gerechnet ({wo}): Die Formel ergibt {v:.6g}, eingetragen ist {e['wert']}")
            for e in pr.get("notizen", []):
                if not e.get("herkunft"):
                    self.fehler.append(f"pruefung.json, notizen: Eintrag „{e.get('text', e.get('wert'))}“ ohne Herkunft")
                self._nimm(self.dateien, e.get("wert"), f"pruefung.json notizen: {e.get('herkunft', '')}", e.get("art", "sonst"), alle=True)
                self._nimm(self.dateien, e.get("text"), f"pruefung.json notizen: {e.get('herkunft', '')}", "sonst", alle=True)
                self._angaben(e.get("text"))

    def _angaben(self, w):
        """Daten und Jahreszahlen eines Textes in die Positivliste aufnehmen. Das Jahr eines Datums gilt auch allein („bis 2031“)."""
        if not isinstance(w, str):
            return
        for m in re.finditer(r"\b((?:19|20)\d{2})-(?:0[1-9]|1[0-2])\b", w):      # Monatsschlüssel einer Reihe
            self.jahre_reihe.add(m.group(1))
        ohne = re.sub(r"\b(?:19|20)\d{2}-(?:0[1-9]|1[0-2])\b", " ", w)
        for m in DATUM.finditer(ohne):
            self.daten_erlaubt.add(datum_norm(m))
            if m.group(3):
                self.jahre.add(m.group(3))
        for m in JAHR.finditer(DATUM.sub(" ", ohne)):
            self.jahre.add(m.group(0))
        for m in re.finditer(r"\b(?:0[1-9]|1[0-2])/((?:19|20)\d{2})\b", ohne):  # Stand MM/JJJJ
            self.jahre.add(m.group(1))

    def _nimm(self, ziel, w, woher, art, alle=False, text=True):
        """Zahl, Liste oder Text aufnehmen. Lange Reihen der Datendateien (Monatswerte) belegen im Text nur Anfang, Ende, kleinsten und größten Wert;
        in den Diagrammdaten belegen sie jeden Wert (vierte Stelle: gilt für Text)."""
        if isinstance(w, bool) or w is None:
            return
        if isinstance(w, (int, float)):
            ziel.append((float(w), woher, art, text))
        elif isinstance(w, list):
            zahlen = [x for x in w if isinstance(x, (int, float)) and not isinstance(x, bool)]
            lang = not alle and len(zahlen) > 12
            for i, x in enumerate(w):
                im_text = text and (not lang or not isinstance(x, (int, float)) or i in (0, len(w) - 1) or x in (min(zahlen), max(zahlen)))
                self._nimm(ziel, x, woher, art, alle, im_text)
        elif isinstance(w, str):
            self._angaben(w)
            if re.fullmatch(r"\d{4}-\d{2}", w):                             # Monatsschlüssel JJJJ-MM sind keine Zahlen der Folien
                return
            for muster in [DATUM.pattern, JAHR.pattern] + [m for _, m, _ in FREI]:   # Daten, Jahre, Seiten und Nummern belegen keine Zahl
                w = re.sub(muster, " ", w)
            # Die Einheit folgt aus dem Text: „80 %“ belegt eine Prozentzahl, „4.800 €“ und „1,8 Mio. €“ einen Eurobetrag
            for v, _, _, e, _ in zerlege(w):
                rest = w[e:]
                if PROZENT_FOLGT.match(rest):
                    ziel.append((v, woher, "prozent", text))
                elif MIO_FOLGT.match(rest):
                    ziel.append((v * 1e6, woher, "euro", text))
                elif EURO_FOLGT.match(rest):
                    ziel.append((v, woher, "euro", text))
                else:
                    ziel.append((v, woher, "sonst", text))

    def _lauf(self, o, datei, pfad, art):
        """Datendatei durchlaufen. Herkunft, Einheit und Hinweise sind Belegtexte und keine Zahlen der Folien; ebenso die Felder, die nur sagen,
        wo ein Wert steht (schluessel, nr, zeile: Verweise auf Stellen der Broschüre oder Ordnungsnummern)."""
        if isinstance(o, dict):
            if "wert" in o and isinstance(o.get("einheit"), str):
                art = art_von(o["einheit"])
                if o["einheit"].startswith("Jahr") and isinstance(o["wert"], (int, float)) and not isinstance(o["wert"], bool):
                    self.jahre.add(str(int(o["wert"])))
            for k, v in o.items():
                if k in ("herkunft", "_hinweis", "einheit", "geprueft", "schluessel", "nr", "zeile"):
                    continue
                self._lauf(v, datei, f"{pfad}.{k}" if pfad else k, art)
        elif isinstance(o, list) and any(isinstance(x, (dict, list)) for x in o):
            for x in o:
                self._lauf(x, datei, pfad, art)
        else:
            self._nimm(self.dateien, o, f"{datei} {pfad}", art)

    # Formeln in daten/pruefung.json: Grundrechenarten, Klammern, runde(x, n), monatsrate(i, jahre) und Verweise.
    #   lauf:schluessel oder lauf:schluessel[i]   Wert aus daten/werte.json
    #   datei#pfad                                 Wert aus einer Datendatei (daten/<datei>.json, Punktpfad; Feld „wert“; in Listen die Stelle ab 0)
    def rechne(self, formel):
        namen = {}

        def merke(w):
            n = f"w{len(namen)}"
            namen[n] = w
            return n

        def aus_mappe(m):
            w = self.werte["laeufe"][m.group(1)]["werte"][m.group(2)]["wert"]
            return merke(w[int(m.group(3))] if m.group(3) is not None else w)

        def aus_datei(m):
            o = self.daten[m.group(1)]
            for teil in m.group(2).split("."):
                o = o[int(teil)] if isinstance(o, list) else o[teil]   # in einer Liste zählt die Zahl als Index (ab 0)
            return merke(o["wert"] if isinstance(o, dict) else o)
        ausdruck = re.sub(r"\b([a-z0-9_]+)#([A-Za-z0-9_.]+[A-Za-z0-9_])", aus_datei, formel)
        ausdruck = re.sub(r"\b([a-z0-9_]+):([A-Za-z0-9_.]+[A-Za-z0-9_])(?:\[(\d+)\])?", aus_mappe, ausdruck)
        ops = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv, ast.USub: operator.neg}

        def wert(n):
            if isinstance(n, ast.Constant) and isinstance(n.value, (int, float)):
                return n.value
            if isinstance(n, ast.Name) and n.id in namen:
                return namen[n.id]
            if isinstance(n, ast.BinOp) and type(n.op) in ops:
                return ops[type(n.op)](wert(n.left), wert(n.right))
            if isinstance(n, ast.UnaryOp) and type(n.op) in ops:
                return ops[type(n.op)](wert(n.operand))
            if isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == "runde" and len(n.args) == 2:
                return runde(wert(n.args[0]), int(wert(n.args[1])))
            if isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == "monatsrate" and len(n.args) == 2:
                i, jahre = wert(n.args[0]), wert(n.args[1])      # Rate je Euro Annuitätendarlehen bei monatlicher Zahlung
                return (i / 12) / (1 - (1 + i / 12) ** (-12 * jahre))
            raise ValueError("nur Zahlen, Verweise, + − × ÷, Klammern, runde(x, n) und monatsrate(i, jahre)")
        return wert(ast.parse(ausdruck, mode="eval").body)

    def beleg(self, v, nk, prozent=False, mio=False, euro=False):
        """Beleg für eine Zahl, wie sie im Text steht (nk Nachkommastellen). Das Vorzeichen zählt hier nicht (Kernwerte prüfen es an ihrer Folie).
        Die Einheit zählt: Folgt ein Prozentzeichen, belegt nur ein Anteil (0,025 für „2,5 %“) oder eine Prozentangabe; folgt „€“, nur ein
        Eurobetrag; folgt „Mio.“, nur ein Eurobetrag in Millionen. Ohne Einheit im Text belegt jeder Wert außer einem Anteil.
        Gleichheit gilt immer; eine Rundung des Belegs gilt nur, wenn die Zahl im Text mindestens drei geltende Ziffern hat („455“ aus 455,2,
        „6,77“ aus 6,7724). So belegt 6,8 nicht „7“ und 85,3 nicht „85“."""
        v = abs(v)
        ziffern = len(re.sub(r"^0+", "", f"{v:.{nk}f}".replace(".", "")))
        # Belege der Folie, deren Text gerade geprüft wird, zuerst (pruefung.json mit „nur_folie“, dann der Lauf der Renditefolie)
        for quelle, name in ((self.nur_datei.get(self.folie, []), "Datei"), (self.nur_mappe.get(self.folie, []), "Mappe"), (self.mappe, "Mappe"), (self.dateien, "Datei")):
            for x, woher, art, im_text in quelle:
                if not im_text:
                    continue
                ax = abs(x)
                if prozent:
                    formen = [(ax * 100, " (als Prozent)")] if art == "anteil" else [(ax, "")] if art == "prozent" else []
                elif mio:
                    formen = [(ax / 1e6, " (in Millionen)")] if art == "euro" else []
                elif euro:
                    formen = [(ax, "")] if art == "euro" else []
                else:
                    formen = [] if art == "anteil" else [(ax, "")]
                for y, zusatz in formen:
                    if abs(y - v) < 1e-9 or (ziffern >= 3 and abs(runde(y, nk) - v) < 1e-9):
                        return name, woher + zusatz
        return None

    def beleg_roh(self, v):
        """Beleg für einen Rohwert aus den Diagrammdaten: gleich einem Wert, dem Prozentwert eines Anteils (auch auf ganze Prozent gerundet)
        oder dem Millionstel eines Eurobetrags (Achse in Mio. €)."""
        av = abs(v)
        for quelle, name in ((self.mappe, "Mappe"), (self.dateien, "Datei")):
            for x, woher, art, _ in quelle:
                ax = abs(x)
                formen = [ax * 100, runde(ax * 100, 0)] if art == "anteil" else [ax] + ([ax / 1e6] if art == "euro" else [])
                if any(math.isclose(av, y, rel_tol=1e-9, abs_tol=1e-9) for y in formen):
                    return name, woher
        return None


def datum_norm(m):
    """Treffer von DATUM als „TT.MM.JJJJ“ oder „TT.MM.“."""
    return f"{int(m.group(1)):02d}.{int(m.group(2)):02d}.{m.group(3) or ''}"


# Nach der Zahl folgt ein Prozentzeichen, auch am Ende einer Aufzählung („40/60/70 %“, „A 40 + 40 · B 60 + 20 · C 70 + 10 %“, „10–40 %“)
PROZENT_FOLGT = re.compile(r"^(?:[\s ]*(?:[|/·+–,]|und|bis|oder|plus)?[\s ]*(?:[A-Za-zÄÖÜäöüß]+[\s ]+){0,2}[+−]?\d+(?:,\d+)?)*[\s ]*(?:%|Prozent)")
MIO_FOLGT = re.compile(r"^(?:[\s ]*(?:[|/·]|und|bis|oder|statt)[\s ]*[\d.,−]+)*[\s ]*Mio\.", re.I)
# Nach der Zahl folgt „€“, auch am Ende einer Aufzählung („6,80 | 8,20 | 9,00 €“, „5.330/5.550 €“, „84.000 statt 313.703 €“, „6,50–9,00 €“)
EURO_FOLGT = re.compile(r"^(?:[\s ]*(?:[|/·–]|und|bis|oder|statt|gegen)[\s ]*[+−]?[\d.,]+)*[\s ]*€")


def frei_spannen(text):
    """Bereiche eines Textes, die die Freiliste abdeckt: [(anfang, ende, regel)]."""
    out = []
    for name, muster, _ in FREI:
        for m in re.finditer(muster, text):
            out.append((m.start(), m.end(), name))
    return out


def geprueft_spannen(text, belege, reihe=False):
    """Geprüfte Angaben eines Textes: [(anfang, ende, regel, in Ordnung, Hinweis)]. reihe: Der Text ist Kategorie oder Reihe eines Diagramms."""
    out = []
    frei = frei_spannen(text)     # eine Angabe der Freiliste („Eingaben 3.1 und 5.4.“, „KfW-Kredit 298“) ist kein Datum und kein Jahr
    in_frei = lambda m: any(s <= m.start() and m.end() - 1 <= t for s, t, _ in frei)
    for m in DATUM.finditer(text):
        if in_frei(m):
            continue
        ok = datum_norm(m) in belege.daten_erlaubt
        out.append((m.start(), m.end(), "Datum", ok, "" if ok else f"Datum {m.group(0)} steht in keiner Datendatei"))
    for m in JAHR.finditer(text):
        if any(a <= m.start() < e for a, e, *_ in out) or in_frei(m):
            continue
        ok = m.group(0) in belege.jahre or (reihe and m.group(0) in belege.jahre_reihe)
        out.append((m.start(), m.end(), "Jahreszahl", ok, "" if ok else f"Jahreszahl {m.group(0)} steht in keiner Datendatei"))
    for m in BROSCHUERE_S.finditer(text):
        for z in re.finditer(r"\d+", m.group(1)):
            ok = 1 <= int(z.group()) <= BROSCHUERE_SEITEN
            out.append((m.start(1) + z.start(), m.start(1) + z.end(), "Seite der Broschüre", ok, "" if ok else f"Die Broschüre hat {BROSCHUERE_SEITEN} Seiten"))
    for m in FOLIE_NR.finditer(text):
        g = 1 if m.group(1) else 2
        for z in re.finditer(r"A?\d+", m.group(g)):
            ok = not FOLIEN_NUMMERN or z.group() in FOLIEN_NUMMERN
            out.append((m.start(g) + z.start(), m.start(g) + z.end(), "Foliennummer", ok, "" if ok else f"Folie {z.group()} gibt es nicht"))
    return out


def pruefe_text(text, belege, nur_zahl=False, zusatz=(), reihe=False):
    """Jede Zahl eines Textes: [(roh, 'Mappe' | 'Datei' | 'frei: Regel' | None, Herkunft oder Hinweis)]. zusatz: weitere freie Bereiche [(anfang, ende, regel)]."""
    spannen = frei_spannen(text) + list(zusatz)
    geprueft = geprueft_spannen(text, belege, reihe)
    zaehler = [(m.start(i), m.end(i)) for m in ZAEHLER.finditer(text) for i in (1, 2) if m.group(i)]
    out = []
    for v, nk, a, e, roh in zerlege(text):
        # 1 freie Bereiche, die der Aufrufer nennt (Spalte „Folie“ der Quellentabelle)
        if any(s <= a and e <= t for s, t, _ in zusatz):
            out.append((roh, "frei: " + next(r for s, t, r in zusatz if s <= a and e <= t), ""))
            continue
        # 2 geprüfte Angaben: Datum, Jahreszahl, Seite der Broschüre, Folienverweis
        g = next((x for x in geprueft if x[0] <= a and e <= x[1]), None)
        if g:
            out.append((roh, "frei: " + g[2], "") if g[3] else (roh, None, g[4]))
            continue
        regel = next((r for s, t, r in spannen if s <= a and e <= t), None)
        if regel:
            out.append((roh, "frei: " + regel, ""))
            continue
        rest = text[e:]
        b = belege.beleg(v, nk, prozent=bool(PROZENT_FOLGT.match(rest)), mio=bool(MIO_FOLGT.match(rest)), euro=bool(EURO_FOLGT.match(rest)))
        if b:
            out.append((roh, b[0], b[1]))
        elif nk == 0 and v < 100 and any(s <= a and e <= t for s, t in zaehler):
            out.append((roh, "frei: Zähler", ""))
        elif nk == 0 and v < 100 and nur_zahl:
            out.append((roh, "frei: Ordnungszahl", ""))
        else:
            out.append((roh, None, ""))
    return out


# ====================================================================================================================
# Prüfungen
# ====================================================================================================================
class Bericht:
    def __init__(self):
        self.zeilen, self.fehler = [], 0

    def pruefung(self, name, maengel, gut=""):
        ok = not maengel
        self.zeilen.append((ok, name, gut if ok else f"{len(maengel)} Befund{'e' if len(maengel) != 1 else ''}", maengel))
        if not ok:
            self.fehler += 1

    def drucke(self):
        for ok, name, text, maengel in self.zeilen:
            print(f"{'OK    ' if ok else 'FEHLER'}  {name}" + (f" · {text}" if text else ""))
            for m in maengel[:40]:
                print(f"          {m}")
            if len(maengel) > 40:
                print(f"          … und {len(maengel) - 40} weitere")
        n = len(self.zeilen)
        print(f"Summe: {n} Prüfungen, {n - self.fehler} bestanden, {self.fehler} mit Fehlern")


def glatt(t):
    return re.sub(r"\s+", " ", t.replace(NBSP, " ").replace("\u000b", " ")).strip()


def folientext(f, mit_zellen=True):
    return [(fo, a) for fo in f["formen"] if mit_zellen or fo["art"] != "zelle" for a in fo["absaetze"] if a["text"].strip()]


def main(argv):
    zeige_zahlen = "--zahlen" in argv
    args = [a for a in argv if not a.startswith("--")]
    datei = Path(args[0]) if args else MAPPE
    if not datei.exists():
        print(f"FEHLER  Mappe nicht gefunden: {datei}\n        Erst bauen: node build.cjs")
        return 2
    M = lies_mappe(datei)
    konzept = json.loads((DATEN / "outline.json").read_text(encoding="utf-8"))
    K = konzept["folien"]
    F = M["folien"]
    B = Belege()
    ber = Bericht()
    nr = lambda i: (K[i]["nr"] if i < len(K) else str(i + 1))   # Blattnummer zur Meldung
    FOLIEN_NUMMERN.update(str(k["nr"]) for k in K)
    paare = list(zip(F, K))

    # ---- Aufbau --------------------------------------------------------------------------------------------------------
    m = [] if len(F) == FOLIENZAHL == len(K) else [f"Mappe {len(F)} Folien, Konzept {len(K)}, verlangt {FOLIENZAHL}"]
    anhang = [k for k in K if k["abschnitt"] == "Anhang"]
    if (len(K) - len(anhang), len(anhang)) != (HAUPTTEIL, ANHANG):
        m.append(f"Konzept: {len(K) - len(anhang)} Folien im Hauptteil und {len(anhang)} im Anhang, verlangt {HAUPTTEIL} und {ANHANG}")
    ber.pruefung("Folienzahl", m, f"{len(F)} Folien: {HAUPTTEIL} im Hauptteil, {ANHANG} im Anhang")
    # Kennung, Blattnummer und Abschnitt jeder Folie des Konzepts wie festgelegt (AUFBAU); die Mappe folgt dem Konzept (nächste Prüfungen)
    m = []
    ist = [(str(k["nr"]), k["id"], k["abschnitt"]) for k in K]
    for i in range(max(len(ist), len(AUFBAU))):
        a, b = (ist[i] if i < len(ist) else None), (AUFBAU[i] if i < len(AUFBAU) else None)
        if a != b:
            m.append(f"Stelle {i + 1}: Konzept {a or 'fehlt'}, festgelegt {b or 'keine Folie'}")
    ber.pruefung("Aufbau des Konzepts: Kennung, Blattnummer und Abschnitt je Folie wie festgelegt", m, " · ".join(dict.fromkeys(a for _, _, a in AUFBAU)))
    ber.pruefung("Format 16:9", [] if M["format"] == (12192000, 6858000) else [f"Foliengröße {M['format']} EMU statt 12192000 × 6858000 (13,333 × 7,5 Zoll)"], "13,333 × 7,5 Zoll")

    m = []
    for i, (f, k) in enumerate(paare):
        titel = [fo for fo in f["formen"] if fo["ph"] == "title"]
        if len(titel) != 1:
            m.append(f"Folie {nr(i)}: {len(titel)} Titel-Platzhalter")
            continue
        if not f["formen"] or f["formen"][0]["ph"] != "title":
            m.append(f"Folie {nr(i)}: Der Titel steht nicht an erster Stelle der Lesereihenfolge")
        ist = glatt(" ".join(a["text"] for a in titel[0]["absaetze"])).upper()
        soll = glatt(k["titel"]).upper()
        # Titel- und Schlussfolie tragen den Claim im Wortlaut der Broschüre (mit Schlusspunkt, ohne den Strich am Zeilenwechsel)
        if re.sub(r"[.–]", "", ist).replace("  ", " ") != re.sub(r"[.–]", "", soll).replace("  ", " "):
            m.append(f"Folie {nr(i)}: Titel „{ist}“ statt „{soll}“")
        if f["layout"]["name"] != k["layout"]:
            m.append(f"Folie {nr(i)}: Layout {f['layout']['name']} statt {k['layout']}")
    ber.pruefung("Reihenfolge, Layout und Titel-Platzhalter wie im Konzept", m, "Titel zuerst in der Lesereihenfolge")

    m = []
    soll_abschnitte = []
    for k in K:
        if not soll_abschnitte or soll_abschnitte[-1][0] != k["abschnitt"]:
            soll_abschnitte.append([k["abschnitt"], 0])
        soll_abschnitte[-1][1] += 1
    ist_abschnitte = [[n, len(ids)] for n, ids in M["abschnitte"]]
    if ist_abschnitte != soll_abschnitte:
        m.append(f"Mappe: {ist_abschnitte} · Konzept: {soll_abschnitte}")
    ber.pruefung("Abschnitte nach den Kapitelnamen", m, " · ".join(f"{n} {z}" for n, z in ist_abschnitte))

    m = []
    for i, (f, k) in enumerate(paare):
        blatt = [glatt(" ".join(a["text"] for a in fo["absaetze"])) for fo in f["formen"] if fo["name"] == "Blattnummer"]
        ohne = k["layout"] in ("PGN_TITEL", "PGN_SCHLUSS")
        if ohne and blatt:
            m.append(f"Folie {nr(i)}: trägt eine Blattnummer, Titel und Schluss stehen ohne")
        if not ohne and blatt != [str(k["nr"])]:
            m.append(f"Folie {nr(i)}: Blattnummer {blatt} statt „{k['nr']}“")
    ber.pruefung("Blattnummern nach Konzept", m, f"{K[1]['nr']} bis {K[HAUPTTEIL - 2]['nr']}, {K[HAUPTTEIL]['nr']} bis {K[-1]['nr']}; Titel und Schluss ohne" if len(K) == FOLIENZAHL else "")

    # Eine Zählung und dieselben Namen: Kicker und Rubrik je Folie, Achse der Agenda, Achskreis und Achsleiste des Trenners
    m = []
    text_von = lambda f, name: [glatt(" ".join(a["text"] for a in fo["absaetze"])) for fo in f["formen"] if fo["name"] == name]
    hauptteil = list(dict.fromkeys(a for _, _, a in AUFBAU if a != "Anhang"))
    for i, (f, k) in enumerate(paare):
        ab = k["abschnitt"].upper()
        kicker, rubrik = text_von(f, "Kicker"), text_von(f, "Rubrik")
        if k["layout"] in ("PGN_TITEL", "PGN_SCHLUSS"):
            continue
        if k["id"] in KICKER_OHNE_ABSCHNITT:
            if kicker != [KICKER_OHNE_ABSCHNITT[k["id"]]]:
                m.append(f"Folie {nr(i)}: Kicker {kicker} statt „{KICKER_OHNE_ABSCHNITT[k['id']]}“")
        elif kicker and not (len(kicker) == 1 and kicker[0].startswith(ab + " · ") and len(kicker[0]) > len(ab) + 3):
            m.append(f"Folie {nr(i)}: Kicker {kicker} beginnt nicht mit dem Abschnitt „{ab} · “")
        if rubrik != (kicker or [ab]):
            m.append(f"Folie {nr(i)}: Rubrik im Schriftfeld {rubrik} statt {kicker or [ab]}")
        if k["layout"].startswith("PGN_ABSCHNITT"):
            soll = "A" if k["abschnitt"] == "Anhang" else str(hauptteil.index(k["abschnitt"]) + 1) if k["abschnitt"] in hauptteil else "?"
            if text_von(f, "Abschnittsnummer") != [soll]:
                m.append(f"Folie {nr(i)}: Achskreis des Trenners {text_von(f, 'Abschnittsnummer')} statt „{soll}“")
            leiste = [t for n in range(1, 10) for t in text_von(f, f"Abschnitt {n}")]
            if k["abschnitt"] != "Anhang" and leiste != [str(n) for n in range(1, len(hauptteil) + 1)]:
                m.append(f"Folie {nr(i)}: Achsleiste des Trenners {leiste}, der Hauptteil hat {len(hauptteil)} Abschnitte")
        if k["id"] == "agenda":
            namen = [t for n in range(1, 10) for t in text_von(f, f"Abschnitt {n} Name")]
            kreise = [t for n in range(1, 10) for t in text_von(f, f"Achskreis {n}")]
            if namen != [a.upper() for a in hauptteil] or kreise != [str(n) for n in range(1, len(hauptteil) + 1)]:
                m.append(f"Folie {nr(i)}: Die Agenda nennt {list(zip(kreise, namen))}; die Abschnitte heißen {hauptteil}")
            register = {teil: text_von(f, f"Register {teil} Verweis") for teil in REGISTER}
            if register != {teil: [v] for teil, v in REGISTER.items()}:
                m.append(f"Folie {nr(i)}: Register der Programmteile {register} statt {REGISTER}")
    ber.pruefung("Abschnitte einheitlich: Kicker, Rubrik, Agenda und Trenner mit denselben Namen und derselben Zählung", m,
                 f"{len(hauptteil)} Abschnitte und Anhang; Agenda mit eigenem Kicker")

    m = []
    for i, (f, k) in enumerate(paare):
        n = f["notizen"]
        if not n or not n.strip():
            m.append(f"Folie {nr(i)}: ohne Notizen")
            continue
        zeilen = [z for z in n.split("\n") if z.strip()]
        if not zeilen[-1].startswith("Quelle"):
            m.append(f"Folie {nr(i)}: Die letzte Zeile der Notizen ist keine Quellenzeile")
        if not 3 <= len(zeilen) - 1 <= 5:
            m.append(f"Folie {nr(i)}: {len(zeilen) - 1} Notizzeilen (verlangt drei bis fünf und die Quellenzeile)")
        soll = [z for z in (k["notizen"] + "\n" + k["quellen"]).split("\n") if z.strip()]
        if [glatt(z) for z in zeilen] != [glatt(z) for z in soll]:
            m.append(f"Folie {nr(i)}: Notizen weichen vom Konzept ab (outline.json, notizen und quellen)")
    ber.pruefung("Sprechernotizen: drei bis fünf Zeilen und Quellenzeile, Wortlaut des Konzepts", m, f"{len(F)} Folien")

    m = []
    z = M["zip"]
    core = z.read("docProps/core.xml").decode("utf-8")
    app = z.read("docProps/app.xml").decode("utf-8")
    feld = lambda xml, tag: (re.search(rf"<{tag}>([^<]*)</{tag}>", xml) or [None, None])[1]
    for tag, soll in (("dc:title", TITEL_DER_MAPPE), ("dc:creator", FIRMA), ("cp:lastModifiedBy", FIRMA)):
        if feld(core, tag) != soll:
            m.append(f"docProps/core.xml {tag}: „{feld(core, tag)}“ statt „{soll}“")
    if feld(app, "Company") != FIRMA:
        m.append(f"docProps/app.xml Company: „{feld(app, 'Company')}“ statt „{FIRMA}“")
    for vorgabe in ("Office Theme", "<vt:lpstr>Arial", "<vt:lpstr>Calibri", "<vt:lpstr>Slide 1<"):
        if vorgabe in app:
            m.append(f"docProps/app.xml nennt noch die Vorgabe „{vorgabe.replace('<vt:lpstr>', '').replace('<', '')}“")
    for name in sorted(M["namen"]):
        if name.endswith((".xml", ".rels")):
            xml = z.read(name).decode("utf-8", "replace")
            for w in WERKZEUGE:
                if w.lower() in xml.lower():
                    m.append(f"{name}: enthält „{w}“")
            if re.search(r'(descr|name|title)="[^"]*(/home/|/tmp/|[A-Z]:\\\\)', xml):
                m.append(f"{name}: enthält einen Dateipfad des Rechners")
    ber.pruefung("Dateieigenschaften: Titel, Autor, Firma; keine Modell- oder Werkzeugnamen", m, FIRMA)

    # Form-IDs: je Folie eindeutig (die Schemaprüfung der Mappe sieht doppelte IDs nicht)
    m = []
    for i, f in enumerate(F):
        zahl = Counter(fid for fid, _ in f["form_ids"])
        for fid, n in zahl.items():
            if n > 1:
                m.append(f"Folie {nr(i)}: Form-ID {fid} {n}-mal vergeben ({', '.join('„' + name + '“' for x, name in f['form_ids'] if x == fid)})")
    ber.pruefung("Form-IDs je Folie eindeutig", m, f"{sum(len(f['form_ids']) for f in F)} Formen")

    # ---- Form ------------------------------------------------------------------------------------------------------------
    m = []
    fremd = Counter()
    for i, f in enumerate(F):
        for fo, a in folientext(f):
            for _, _, schrift in a["laeufe"]:
                if schrift and not schrift.startswith(SCHRIFTEN):
                    fremd[(nr(i), schrift)] += 1
        for d in f["diagramme"]:
            for s in d["schriften"]:
                if not s.startswith(SCHRIFTEN) and not s.startswith("+"):
                    fremd[(nr(i), s + " (Diagramm)")] += 1
    for pfad in sorted(n for n in M["namen"] if re.match(r"ppt/(slideLayouts|slideMasters)/[^/]+\.xml$", n)):
        for s in set(re.findall(r'<a:latin typeface="([^"+][^"]*)"', z.read(pfad).decode("utf-8"))):
            if not s.startswith(SCHRIFTEN):
                fremd[(pfad.split("/")[-1], s)] += 1
    m += [f"Folie {wo}: Schrift „{s}“ ({n} Stellen)" for (wo, s), n in sorted(fremd.items())]
    ber.pruefung("Schriften: nur Montserrat und Work Sans", m, "Folien, Layouts, Master, Diagramme")

    klein, zellen, fliess, ohne, kleinste = [], [], [], [], 999
    for i, f in enumerate(F):
        for fo, a in folientext(f):
            for text, pt, schrift in a["laeufe"]:
                if not text.strip():
                    continue
                if pt is None and fo["ph"] is not None:
                    pt = f["layout"]["groessen"].get(fo["ph"])
                if pt is None:
                    ohne.append(f"Folie {nr(i)}, „{fo['name']}“: Textlauf „{text[:40]}“ ohne Schriftgröße")
                    continue
                kleinste = min(kleinste, pt)
                wo = f"Folie {nr(i)}, „{fo['name']}“: {pt:g} pt „{glatt(text)[:50]}“"
                if pt < MIN_BESCHRIFTUNG:
                    klein.append(wo)
                if fo["art"] == "zelle" and pt < MIN_TABELLE:
                    zellen.append(wo)
                ist_fliess = fo["art"] != "zelle" and (schrift or "").startswith("Work Sans") and (FLIESSTEXT.match(fo["name"]) or len(a["text"]) > LANGER_ABSATZ)
                if ist_fliess and pt < MIN_FLIESS:
                    fliess.append(wo)
    ber.pruefung(f"Schriftgröße E3: kein Textlauf unter {MIN_BESCHRIFTUNG} pt", klein + ohne, f"kleinste Größe {kleinste:g} pt")
    ber.pruefung(f"Schriftgröße E3: Tabellenzellen mindestens {MIN_TABELLE} pt", zellen, f"{sum(f['tabellen'] for f in F)} Tabellen")
    ber.pruefung(f"Schriftgröße E3: Fließtext mindestens {MIN_FLIESS} pt", fliess, "Kommentar, Planlegende, Aufzählung, Vorspann, Kennzahltext, lange Absätze")
    m = [f"Folie {nr(i)}, „{d['name']}“: {min(d['groessen']):g} pt" for i, f in enumerate(F) for d in f["diagramme"] if d["groessen"] and min(d["groessen"]) < MIN_BESCHRIFTUNG]
    ber.pruefung(f"Schriftgröße E3: Achsen und Beschriftungen der Diagramme mindestens {MIN_BESCHRIFTUNG} pt", m, f"{sum(len(f['diagramme']) for f in F)} Diagramme")

    m = []
    bilder = flussformen = 0
    for i, f in enumerate(F):
        for name, descr, flaeche in f["bilder"]:
            bilder += 1
            if not descr or not descr.strip() or "/" in descr or descr.lower().endswith((".png", ".jpg")):
                m.append(f"Folie {nr(i)}, Bild „{name}“: Alternativtext fehlt oder ist ein Dateiname („{descr}“)")
        for d in f["diagramme"]:
            if not d["descr"].strip():
                m.append(f"Folie {nr(i)}, Diagramm „{d['name']}“: ohne Alternativtext")
        # Flussdiagramme sind aus Formen gebaut: Ein Rahmen „Flussdiagramm …“ trägt den Alternativtext mit den Beträgen der Ströme
        rahmen = [fo for fo in f["formen"] if fo["name"].startswith("Flussdiagramm")]
        flussformen += len(rahmen)
        for fo in rahmen:
            if not (fo.get("descr") or "").strip() or not re.search(r"\d", fo["descr"]):
                m.append(f"Folie {nr(i)}, „{fo['name']}“: ohne Alternativtext mit den Beträgen der Ströme")
        if i < len(K) and K[i]["id"].startswith("rechnung-fluss") and len(rahmen) != 1:
            m.append(f"Folie {nr(i)}: {len(rahmen)} Formen „Flussdiagramm …“ mit Alternativtext, erwartet wird eine")
    for lay in M["layouts"].values():
        for name, descr in lay["bilder"]:
            bilder += 1
            if not descr or "/" in descr:
                m.append(f"Layout {lay['name']}, Bild „{name}“: Alternativtext fehlt oder ist ein Dateiname")
    ber.pruefung("Bilder, Diagramme und Flussdiagramme mit Alternativtext", m, f"{bilder} Bilder (Folien und Layouts), {sum(len(f['diagramme']) for f in F)} Diagramme, {flussformen} Flussdiagramme aus Formen")

    m = [f"Folie {nr(i)}, Bild „{name}“ bedeckt {100 * fl / M['flaeche']:.0f} % der Folie" for i, f in enumerate(F) for name, _, fl in f["bilder"] if fl > 0.5 * M["flaeche"]]
    ber.pruefung("Keine Folie als Bild; Diagramme und Tabellen nativ (E1)", m, f"{sum(len(f['diagramme']) for f in F)} Diagramme, {sum(f['tabellen'] for f in F)} Tabellen")
    m = [f"Folie {nr(i)}: Übergang oder Animation" for i, f in enumerate(F) if f["uebergang"]]
    ber.pruefung("Keine Animationen, keine Übergänge (E13)", m)

    # ---- Wortlaut --------------------------------------------------------------------------------------------------------
    m = []
    rendite, ausnahme = [], []
    for i, f in enumerate(F):
        texte = [a["text"] for _, a in folientext(f)] + f["layout"]["texte"] + [d["name"] + " " + " ".join(r["name"] + " " + " ".join(r["kategorien"]) for r in d["reihen"]) for d in f["diagramme"]]
        fid = K[i]["id"] if i < len(K) else None
        for t in texte:
            for muster, wort in VERBOTEN:
                for tr in muster.finditer(t):
                    # Ausnahme nach Kennung der Folie: nur die Anhangfolie zur Rendite, nur die dort genannten Wörter
                    if wort in VERBOTEN_AUSNAHME.get(fid, ()):
                        ausnahme.append(nr(i))
                        continue
                    if wort == "Rendite":
                        if any(er.search(glatt(t)) for er in RENDITE_ERLAUBT):
                            rendite.append(nr(i))
                            continue
                    m.append(f"Folie {nr(i)}: „{wort}“ in „{glatt(t)[:90]}“")
    m += [f"Folie „{fid}“ (VERBOTEN_AUSNAHME) fehlt im Konzept" for fid in VERBOTEN_AUSNAHME if fid not in {k["id"] for k in K}]
    ber.pruefung("Verbotene Wörter (E5): Rendite, IRR, DSCR, Safe Harbour, Marktmiete", m,
                 f"„Rendite“ und „Marktmiete“ nur auf der Anhangfolie zur Rendite (Folie {', '.join(dict.fromkeys(ausnahme)) or 'keine'}); "
                 f"sonst „Rendite“ nur in der Beihilferegel (Folie {', '.join(dict.fromkeys(rendite)) or 'keine'})")

    # Quellenzeile im Schriftfeld: genau auf den festgelegten Folien, im Wortlaut der Datendatei, höchstens zwei Zeilen
    m = []
    markt = json.loads((DATEN / "markt.json").read_text(encoding="utf-8"))
    for i, (f, k) in enumerate(paare):
        formen = [fo for fo in f["formen"] if fo["name"] == "Quellenzeile"]
        block = QUELLENZEILEN.get(k["id"])
        if not block:
            if formen:
                m.append(f"Folie {nr(i)} ({k['id']}): trägt eine Quellenzeile im Schriftfeld, ist dafür aber nicht festgelegt (QUELLENZEILEN)")
            continue
        soll = glatt((markt.get(block, {}).get("quelle_kurz") or {}).get("wert", ""))
        if not soll:
            m.append(f"Folie {nr(i)} ({k['id']}): daten/markt.json führt {block}.quelle_kurz nicht")
            continue
        if len(formen) != 1:
            m.append(f"Folie {nr(i)} ({k['id']}): {len(formen)} Formen „Quellenzeile“, erwartet wird eine mit „{soll}“")
            continue
        zeilen = [a["text"] for a in formen[0]["absaetze"] if a["text"].strip()]
        ist = glatt(" ".join(zeilen))
        if ist != soll:
            m.append(f"Folie {nr(i)} ({k['id']}): Quellenzeile „{ist}“ statt „{soll}“ (daten/markt.json, {block}.quelle_kurz)")
        if len(zeilen) > 2:
            m.append(f"Folie {nr(i)} ({k['id']}): Quellenzeile in {len(zeilen)} Zeilen (höchstens zwei)")
        if soll not in glatt(k["inhalt"]):
            m.append(f"Folie {nr(i)} ({k['id']}): Die Quellenzeile steht nicht im Feld „inhalt“ des Konzepts")
    m += [f"Folie „{fid}“ (QUELLENZEILEN) fehlt im Konzept" for fid in QUELLENZEILEN if fid not in {k["id"] for k in K}]
    ber.pruefung("Quellenzeile im Schriftfeld: festgelegte Folien, Wortlaut der Datendatei, höchstens zwei Zeilen", m,
                 "Folien " + ", ".join(str(k["nr"]) for k in K if k["id"] in QUELLENZEILEN))

    m = []
    for i, f in enumerate(F):
        for fo, a in folientext(f):
            t = glatt(a["text"])
            if re.search(r"\S\s[–—]\s\S", t) and not any(c.search(t) for c in CLAIMS):
                m.append(f"Folie {nr(i)}, „{fo['name']}“: „{t[:90]}“")
            if "—" in t:
                m.append(f"Folie {nr(i)}, „{fo['name']}“: Geviertstrich in „{t[:60]}“")
    ber.pruefung("Kein Gedankenstrich als Einschub in Folientexten (E6)", m, "Bis-Striche und die Claims der PGN ausgenommen")

    m = []
    for i, (f, k) in enumerate(paare):
        mr = f["layout"]["name"].endswith("_MR")
        soll = k["layout"].endswith("_MR")
        stempel = any("MODELLRECHNUNG" in t for t in f["layout"]["texte"]) or any(a["text"].strip() == "MODELLRECHNUNG" and fo["name"].startswith("Stempel") for fo, a in folientext(f))
        im_kicker = sum(t.upper().count("MODELLRECHNUNG") for t in text_von(f, "Kicker"))
        im_kopf = im_kicker + (1 if stempel else 0)
        if soll and im_kopf != 1:
            m.append(f"Folie {nr(i)}: „Modellrechnung“ steht im Kopf {im_kopf}-mal (Kicker {im_kicker}, Stempel {1 if stempel else 0}); es muss genau einmal sein")
        if not soll and stempel:
            m.append(f"Folie {nr(i)}: Stempel „Modellrechnung“ steht auf einer Folie ohne Modellrechnung")
        zusatz = [a["text"].strip() for fo, a in folientext(f) if "keine Förderzusage" in a["text"] and fo["name"] == "Zusatz Modellrechnung"]
        if bool(zusatz) != (k["id"] == "rechnung-finanzierung"):
            m.append(f"Folie {nr(i)}: Zusatz „keine Förderzusage“ {'fehlt' if not zusatz else 'steht außerhalb der ersten Folie der Modellrechnung'}")
        if zusatz and not stempel and zusatz != [ZUSATZ_MODELLRECHNUNG]:
            m.append(f"Folie {nr(i)}: Zusatz lautet {zusatz} statt „{ZUSATZ_MODELLRECHNUNG}“")
        if mr != soll:
            m.append(f"Folie {nr(i)}: Layout {f['layout']['name']}")
        if soll != (k["id"] in STEMPEL):
            m.append(f"Folie {nr(i)} ({k['id']}): {'steht auf einem Layout der Modellrechnung und gehört nicht zu deren Folien' if soll else 'gehört zu den Folien der Modellrechnung und steht auf keinem Layout mit „_MR“'} (STEMPEL)")
    m += [f"Folie „{fid}“ (STEMPEL) fehlt im Konzept" for fid in STEMPEL if fid not in {k["id"] for k in K}]
    ber.pruefung("„Modellrechnung“ im Kopf der Modellfolien genau einmal, Zusatz nur auf der ersten (E7)", m,
                 "Folien " + ", ".join(str(k["nr"]) for k in K if k["layout"].endswith("_MR")))

    # ---- Zahlen ------------------------------------------------------------------------------------------------------------
    ber.pruefung("Datendateien: gerechnete Größen und Herkunft (daten/pruefung.json)", B.fehler, ", ".join(B.dateinamen))

    stat = Counter()
    liste = []

    def nimm(i, wo, text, nur_zahl=False, zusatz=(), reihe=False):
        bef = []
        B.folie = K[i]["id"] if i < len(K) else None      # Belege, die nur für diese Folie gelten (Anhangfolie zur Rendite)
        for roh, art, woher in pruefe_text(text, B, nur_zahl, zusatz, reihe):
            stat[art.split(":")[0] if art else "ohne"] += 1
            if art and art.startswith("frei"):
                stat[art] += 1
            liste.append((nr(i), wo, roh, art or "OHNE BELEG", woher))
            if not art:
                bef.append(f"Folie {nr(i)}, {wo}: „{roh}“ in „{glatt(text)[:80]}“" + (f" ({woher})" if woher else ""))
        return bef

    m = []
    for i, f in enumerate(F):
        for fo, a in folientext(f):
            t = glatt(a["text"])
            # Spalte „Folie“ der Quellentabelle: Blattnummern
            zusatz = [(0, len(t), "Foliennummer")] if fo["name"] == "Quellentabelle" and fo.get("spalte") == 0 else []
            m += nimm(i, f"„{fo['name']}“", t, nur_zahl=bool(re.fullmatch(r"[+\-−±]?\d{1,2}", t)), zusatz=zusatz)
        for t in f["layout"]["texte"]:
            m += nimm(i, f"Layout {f['layout']['name']}", glatt(t))
        # Alternativtexte tragen Beträge (die der Flussdiagramme jeden Strom mit Betrag und Anteil): wie Folientext prüfen
        for name, descr in [(fo["name"], fo.get("descr")) for fo in f["formen"]] + [(d["name"], d["descr"]) for d in f["diagramme"]]:
            if descr:
                m += nimm(i, f"Alternativtext „{name}“", glatt(descr))
    ber.pruefung("Zahlen in Folientexten, Tabellen und Alternativtexten belegt", m, f"{stat['Mappe']} aus der Rechenmappe, {stat['Datei']} aus Datendateien, {stat['frei']} nach Freiliste")
    vor = Counter(stat)

    m = []
    roh_n = Counter()
    for i, f in enumerate(F):
        for d in f["diagramme"]:
            for r in d["reihen"]:
                for v in r["werte"]:
                    b = B.beleg_roh(v)
                    roh_n[b[0] if b else "ohne"] += 1
                    liste.append((nr(i), f"Diagramm „{d['name']}“, Reihe „{r['name']}“", repr(v), b[0] if b else "OHNE BELEG", b[1] if b else ""))
                    if not b:
                        m.append(f"Folie {nr(i)}, Diagramm „{d['name']}“, Reihe „{r['name']}“: Wert {v:g}")
                for t in dict.fromkeys(r["kategorien"] + [r["name"]]):
                    m += nimm(i, f"Diagramm „{d['name']}“, Kategorie oder Reihe", glatt(t), nur_zahl=bool(re.fullmatch(r"\d{1,2}", glatt(t))), reihe=True)
    ber.pruefung("Zahlen in den Diagrammdaten belegt", m, f"{roh_n['Mappe']} Werte aus der Rechenmappe, {roh_n['Datei']} aus Datendateien")

    # Zwischenspeicher des Diagramms gegen die eingebettete Arbeitsmappe: Wer in PowerPoint „Daten bearbeiten“ wählt, sieht die Arbeitsmappe
    m = []
    zellen_n = 0
    for i, f in enumerate(F):
        for d in f["diagramme"]:
            wo = f"Folie {nr(i)}, Diagramm „{d['name']}“"
            if not d["mappe"]:
                m.append(f"{wo}: ohne eingebettete Arbeitsmappe")
                continue
            Z = d["mappe"]["zellen"]
            if re.search(r"ref=\"[^\"]*'\"", d["mappe"]["tabelle"]):
                m.append(f"{wo}: Der Tabellenbereich der Arbeitsmappe trägt einen überzähligen Apostroph")
            for r in d["reihen"]:
                kopf = zellen_von(r["f_name"])
                if kopf and glatt(str(Z.get(kopf[0]) or "")) != glatt(r["name"]):
                    m.append(f"{wo}: Reihe „{r['name']}“ heißt in der Arbeitsmappe „{Z.get(kopf[0])}“ ({kopf[0]})")
                wz = zellen_von(r["f_werte"])
                for idx, v in r["punkte"]:
                    zellen_n += 1
                    z = wz[idx] if idx < len(wz) else None
                    w = Z.get(z) if z else None
                    if not isinstance(w, float) or not math.isclose(w, v, rel_tol=1e-9, abs_tol=1e-9):
                        m.append(f"{wo}, Reihe „{r['name']}“: Zwischenspeicher {v:g}, Arbeitsmappe {'leer' if w is None else w} ({z})")
                if len([z for z in wz if Z.get(z) is not None]) != len(r["punkte"]):
                    m.append(f"{wo}, Reihe „{r['name']}“: {len(r['punkte'])} Werte im Zwischenspeicher, {len([z for z in wz if Z.get(z) is not None])} in der Arbeitsmappe")
                kz = zellen_von(r["f_kat"])
                for idx, t in r["kat_punkte"]:
                    z = kz[idx] if idx < len(kz) else None
                    w = Z.get(z) if z else None
                    if (w if isinstance(w, str) else "" if w is None else zahl_de(w) if float(w).is_integer() else str(w)) != t and str(w) != t:
                        m.append(f"{wo}: Kategorie „{t}“ heißt in der Arbeitsmappe „{w}“ ({z})")
    ber.pruefung("Diagrammdaten: Zwischenspeicher gleich der eingebetteten Arbeitsmappe", m, f"{sum(len(f['diagramme']) for f in F)} Diagramme, {zellen_n} Werte")

    m = []
    vor2 = Counter(stat)
    for i, f in enumerate(F):
        for zeile in (f["notizen"] or "").split("\n"):
            if zeile.strip():
                m += nimm(i, "Notizen", glatt(zeile))
    d = lambda k: stat[k] - vor2[k]
    ber.pruefung("Zahlen in den Sprechernotizen belegt", m, f"{d('Mappe')} aus der Rechenmappe, {d('Datei')} aus Datendateien, {d('frei')} nach Freiliste")

    m = []

    def kernwert(quelle):
        """Wert zu einem Schlüssel der Rechenmappe („schluessel“ im Lauf modellhaus oder „lauf:schluessel“) oder zu einer Formel in der
        Schreibweise von daten/pruefung.json (Verweise lauf:schluessel und datei#pfad, Grundrechenarten, Klammern, runde)."""
        if re.fullmatch(r"(?:[a-z0-9_]+:)?[A-Za-z0-9_.]+", quelle):
            lauf, _, k = quelle.rpartition(":")
            return B.werte["laeufe"][lauf or "modellhaus"]["werte"][k]["wert"]
        return B.rechne(quelle)
    plus = lambda v, text: ("+" if v > 0 else "") + text
    fmt = {"euro": lambda v: zahl_de(v) + " €", "euro2": lambda v: zahl_de(v, 2) + " €", "dez2": lambda v: zahl_de(v, 2), "zahl": lambda v: zahl_de(v),
           "mio": lambda v: zahl_de(v / 1e6, 1) + " Mio. €", "prozent0": lambda v: zahl_de(v * 100, 0) + " %", "prozent1": lambda v: zahl_de(v * 100, 1) + " %",
           "prozent2": lambda v: zahl_de(v * 100, 2) + " %",
           # Wert steht schon in Prozent · mit Vorzeichen: Plus vor positiven Werten, Minus U+2212 vor negativen
           "prozentwert2": lambda v: zahl_de(v, 2) + " %", "prozent1vz": lambda v: plus(v, zahl_de(v * 100, 1) + " %"), "euro2vz": lambda v: plus(v, zahl_de(v, 2) + " €"),
           # Tabelle der Renditefolie: Millionen ohne Einheit in der Zelle · Strich, wo die Mappe „n. v.“ führt · „über 100 %“ für einen Anteil über 1
           "miozahl2": lambda v: zahl_de(v / 1e6, 2), "strich_wenn_nv": lambda v: "–" if v == "n. v." else zahl_de(v * 100, 2) + " %",
           "ueber100": lambda v: "über 100 %" if v > 1 else zahl_de(v * 100, 0) + " %",
           # Textwert der Mappe (Mietenstufe) · Zähler, der null sein muss („Kein Jahr mit Fehlbetrag“) · Eingabe 2.3: 0 € heißt „nicht angesetzt“
           "text": lambda v: str(v), "kein": lambda v: "Kein" if v == 0 else zahl_de(v), "nicht_angesetzt": lambda v: "nicht angesetzt" if v == 0 else zahl_de(v) + " €"}
    je_id = {k["id"]: (i, f) for i, (f, k) in enumerate(paare)}

    def pruefe_kernwerte(liste, woher):
        bef = []
        for quelle, art, erwartet, ids in liste:
            try:
                ist = fmt[art](kernwert(quelle))
            except Exception as ex:  # noqa: BLE001
                bef.append(f"{quelle}: lässt sich nicht lesen oder rechnen ({ex})")
                continue
            if ist != erwartet:
                bef.append(f"{quelle}: {woher} „{ist}“, als Kernwert festgelegt ist „{erwartet}“")
            for fid in ids:
                if fid not in je_id:
                    bef.append(f"Folie „{fid}“ fehlt")
                    continue
                i, f = je_id[fid]
                alles = " | ".join(glatt(" ".join(a["text"] for a in fo["absaetze"])) for fo in f["formen"])
                if not re.search(r"(?<![\d.,+−])" + re.escape(ist) + r"(?![\d])", alles, re.I):   # Titel stehen in Versalien („MIO.“)
                    bef.append(f"Folie {nr(i)} ({fid}): Kernwert „{ist}“ steht nicht auf der Folie")
        return bef
    ber.pruefung("Kernwerte des Modellhauses an ihren Folien, mit Einheit und Vorzeichen", pruefe_kernwerte(KERNWERTE, "Die Rechenmappe liefert"),
                 " · ".join(dict.fromkeys(e for _, _, e, _ in KERNWERTE)))
    ber.pruefung("Kernwerte der Ausgangslage und des Kostenvergleichs an ihren Folien, mit Einheit und Vorzeichen", pruefe_kernwerte(KERNWERTE_MARKT, "Die Datendateien liefern"),
                 " · ".join(dict.fromkeys(e for _, _, e, _ in KERNWERTE_MARKT)))

    m = []
    for fid, satz, felder in KERNSAETZE:
        if fid not in je_id:
            m.append(f"Folie „{fid}“ fehlt")
            continue
        i, f = je_id[fid]
        soll = satz.format(**{n: fmt[a](kernwert(k)) for n, (k, a) in felder.items()})
        muster = re.compile(r"(?<![\d.,−])" + re.escape(soll.upper()) + r"(?![\d])")
        texte = [glatt(" ".join(a["text"] for a in fo["absaetze"])).upper() for fo in f["formen"]]
        if not any(muster.search(t) for t in texte):
            m.append(f"Folie {nr(i)} ({fid}): Der Satz „{soll}“ steht nicht auf der Folie ({', '.join(k for k, _ in felder.values())})")
    ber.pruefung("Kernsätze: Werte in ihrem Satz", m, f"{len(KERNSAETZE)} Sätze auf {len({fid for fid, _, _ in KERNSAETZE})} Folien")

    m = []
    for schluessel, fid, reihe, kategorie in KERNWERTE_DIAGRAMM:
        if fid not in je_id:
            m.append(f"Folie „{fid}“ fehlt")
            continue
        i, f = je_id[fid]
        soll = kernwert(schluessel)
        treffer = [v for d in f["diagramme"] for r in d["reihen"] if glatt(r["name"]) == reihe
                   for (idx, v), (_, k) in zip(r["punkte"], r["kat_punkte"]) if glatt(k) == kategorie]
        if len(treffer) != 1 or not math.isclose(treffer[0], soll, rel_tol=1e-9, abs_tol=1e-9):
            m.append(f"Folie {nr(i)} ({fid}): Reihe „{reihe}“, Kategorie „{kategorie}“ führt {treffer or 'keinen Wert'}; {schluessel} ist {soll:g}")
    ber.pruefung("Kernwerte in den Diagrammdaten, mit Vorzeichen", m, f"{len(KERNWERTE_DIAGRAMM)} Werte")

    # Ganze Reihen: jeder Wert des Diagramms an seiner Stelle gleich dem Wert der Datendatei (Liste: nach der Stelle; Tabelle: nach der Kategorie)
    m = []
    reihen_n = 0
    for quelle, fid, reihe in REIHEN_DIAGRAMM:
        if fid not in je_id:
            m.append(f"Folie „{fid}“ fehlt")
            continue
        i, f = je_id[fid]
        o = B.daten[quelle.split("#")[0]]
        for teil in quelle.split("#")[1].split("."):
            o = o[int(teil)] if isinstance(o, list) else o[teil]
        soll = o["wert"] if isinstance(o, dict) and "wert" in o else o
        gefunden = [r for d in f["diagramme"] for r in d["reihen"] if glatt(r["name"]) == reihe]
        if len(gefunden) != 1:
            m.append(f"Folie {nr(i)} ({fid}): Reihe „{reihe}“ steht {len(gefunden)}-mal in den Diagrammdaten")
            continue
        r = gefunden[0]
        kat = dict(r["kat_punkte"])
        ist = [(glatt(kat.get(idx, "")), v) for idx, v in r["punkte"]]
        paare_soll = [(str(k), float(v)) for k, v in soll.items()] if isinstance(soll, dict) else [(None, float(v)) for v in soll]
        if len(ist) != len(paare_soll):
            m.append(f"Folie {nr(i)} ({fid}): Reihe „{reihe}“ führt {len(ist)} Werte, {quelle} führt {len(paare_soll)}")
            continue
        for stelle, ((k_ist, v_ist), (k_soll, v_soll)) in enumerate(zip(ist, paare_soll)):
            reihen_n += 1
            if (k_soll is not None and k_ist != k_soll) or not math.isclose(v_ist, v_soll, rel_tol=1e-9, abs_tol=1e-9):
                m.append(f"Folie {nr(i)} ({fid}): Reihe „{reihe}“, Stelle {stelle + 1} ({k_ist}) führt {v_ist:g}; {quelle} führt {v_soll:g}" + (f" ({k_soll})" if k_soll is not None else ""))
    ber.pruefung("Ganze Reihen in den Diagrammdaten, jeder Wert an seiner Stelle", m, f"{len(REIHEN_DIAGRAMM)} Reihen, {reihen_n} Werte")

    # Kernwerte in ihrer Form oder Tabellenzelle: Der Wert steht bei seiner Bezeichnung, nicht nur irgendwo auf der Folie
    m = []
    for quelle, art, fid, form, zelle, muster in KERNWERTE_FORM:
        if fid not in je_id:
            m.append(f"Folie „{fid}“ fehlt")
            continue
        i, f = je_id[fid]
        wert = fmt[art](kernwert(quelle))
        soll, form = muster.format(a=wert), form.format(a=wert)      # der Name der Form darf den Wert tragen („Maßkettenwert {a}“)
        texte = [glatt(" ".join(a["text"] for a in fo["absaetze"])) for fo in f["formen"]
                 if glatt(fo["name"]) == form and (zelle is None or (fo.get("zeile"), fo.get("spalte")) == zelle)]
        if texte != [soll]:
            wo = f"„{form}“" + (f", Zeile {zelle[0] + 1}, Spalte {zelle[1] + 1}" if zelle else "")
            m.append(f"Folie {nr(i)} ({fid}), {wo}: steht {texte or 'nicht auf der Folie'}; erwartet „{soll}“ ({quelle})")
    ber.pruefung("Kernwerte in ihrer Form oder Tabellenzelle", m, f"{len(KERNWERTE_FORM)} Werte auf {len({fid for _, _, fid, _, _, _ in KERNWERTE_FORM})} Folien")

    # ---- Verweise ------------------------------------------------------------------------------------------------------------
    m = []
    nr_von = {k["id"]: str(k["nr"]) for k in K}
    for fid, ort, text, felder in VERWEISE:
        fehlend = [z for z in [fid, *felder.values()] if z not in nr_von]
        if fehlend or fid not in je_id:
            m.append(f"Verweis auf „{text[:50]}…“: Folie {', '.join(fehlend) or fid} fehlt")
            continue
        i, f = je_id[fid]
        soll = glatt(text.format(**{n: nr_von[z] for n, z in felder.items()}))
        wo = glatt(f["notizen"] or "") if ort == "notizen" else " | ".join(glatt(" ".join(a["text"] for a in fo["absaetze"])) for fo in f["formen"])
        if soll not in wo:
            m.append(f"Folie {nr(i)} ({fid}), {'Notizen' if ort == 'notizen' else 'Folientext'}: „{soll}“ steht dort nicht ({', '.join(f'{z} ist Blatt {nr_von[z]}' for z in felder.values())})")
    ber.pruefung("Verweise nennen die Blattnummer der gemeinten Folie", m, f"{len(VERWEISE)} Verweise auf {len({fid for fid, _, _, _ in VERWEISE})} Folien")

    ber.drucke()
    frei = {k: v for k, v in stat.items() if k.startswith("frei: ")}
    if frei:
        print("Freiliste: " + ", ".join(f"{k[6:]} {v}" for k, v in sorted(frei.items(), key=lambda kv: -kv[1])))
    if zeige_zahlen:
        print("\nZahlen und ihre Belege:")
        for wo_nr, wo, roh, art, woher in liste:
            print(f"  {wo_nr:>3}  {roh:>12}  {art:<22} {woher}  [{wo}]")
    return 1 if ber.fehler else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
