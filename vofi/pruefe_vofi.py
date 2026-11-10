#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Abnahmeprüfung VOFI Mietwohnraum 2026, Version 3
================================================

Prüft die fertige Mappe PGN_VOFI_Mietwohnraum_2026_v3.xlsx allein gegen
  - das Sollkonzept    /home/user/NBank/vofi/KONZEPT-v3.md (Adressen, Abschnitte A–G, Abnahme F1–F13),
  - die Referenzrechnung broschuere/zulieferungen/vofi-pruefung/referenzrechnung.py (importiert, nicht verändert),
  - die Broschüre       broschuere/content/pages/10-…, 11-…, 12-….json (zur Laufzeit gelesen),
  - die alte Mappe v2-1 (nur gelesen, data_only, aus einer Kopie).
build_vofi.py wird nicht gelesen und nicht importiert.

Aufruf
  python pruefe_vofi.py [MAPPE.xlsx] [--laeufe L1,L2] [--parallel 4] [--timeout 120] [--ausfuehrlich]
                        [--behalten] [--arbeitsordner DIR] [--baseline PFAD]
Exit-Code 0 nur, wenn alle Prüfungen OK sind. HINWEIS-Zeilen zählen nicht als Fehler.

Korrekturen am Prüfskript (09.11.2026, Baustufe 2; Sollwerte unverändert)
  1. F6 Sprache: Das Muster für „ACHTUNG“ war "(?i)achtung" ohne Wortgrenze und traf damit das vom Konzept
     vorgeschriebene Wort „Betrachtungsende“ (Tabellen T13 „Höchstlaufzeit, Betrachtungsende“, das dieselbe
     Prüfung unter „Beschriftungen laut Konzept“ wörtlich verlangt). Das Skript widersprach sich selbst.
     Neu: "(?i)\bachtung\b".
  2. norm_text: Kopfzeilen sollen umbrechen (Konzept G.1 „Umbruch“), die Spaltenbreiten G.3 sind schmaler als
     einzelne Kopfwörter („Verwaltungskostenbeitrag“ in 12 Zeichen). Ein lesbarer Umbruch braucht dort einen
     Trennstrich mit Zeilenumbruch („Verwaltungs-↵kostenbeitrag“). norm_text normalisierte Zeilenumbrüche
     schon zu Leerzeichen, behandelte die Trennung aber als anderen Text. Neu: „Buchstabe, Bindestrich,
     Zeilenumbruch, Kleinbuchstabe“ wird vor dem Vergleich zusammengezogen. Konzepttexte enthalten keine
     Zeilenumbrüche; „Markt- und“ (Bindestrich mit Leerzeichen) bleibt unberührt.
  3. Formelerkennung: Das Skript hielt jede Zelle, deren Text mit „=“ beginnt, für eine Formel. Das Konzept
     schreibt in der Jahresrechnung (D.5 Block 2, G.5) die Texte „= Überschuss vor Kapitaldienst“ und
     „= Zahlungsüberschuss“ vor, die BESCHRIFTUNG wörtlich verlangt; als vermeintliche Formeln fielen sie in
     F5 (Formelfarbe) und F6 (Formel-Prosa) durch, bei jeder richtigen Umsetzung. Neu: Formel = Zelle mit
     Formelelement (openpyxl data_type "f"), Hilfsfunktion ist_formelzelle.

Korrekturen am Prüfskript (09.11.2026, Nacharbeit Runde 1; Sollwerte der Referenzrechnung unverändert)
  4. F5 summaryBelow / fullCalcOnLoad: Die vorgeschriebene Abnahmefolge lautet „build_vofi.py && recalc.py MAPPE
     && pruefe_vofi.py MAPPE“. recalc.py speichert die Mappe mit LibreOffice, das beide Angaben beim Speichern
     entfernt (nachgewiesen an der Mappe vor und nach Runde 1). Das Skript konnte in dieser Folge bei keiner
     Mappe grün werden. Neu: fehlen die Angaben, meldet F5 einen HINWEIS mit der Abhilfe
     „build_vofi.py --nachbearbeiten MAPPE“; ein falscher Wert (summaryBelow = 1) bleibt FEHLER, ebenso ein
     calcPr mit calcId ohne fullCalcOnLoad (ohne calcId rechnet Excel beim Öffnen ohnehin neu).
  5. F5 Druckbereich: openpyxl gibt mehrteilige Druckbereiche sortiert zurück; die Reihenfolge (sie bestimmt die
     Seitenfolge in Excel) wird deshalb aus workbook.xml gelesen.
  Konzeptänderungen Runde 1 (KONZEPT-v3.md, Abschnitt K.3), denen das Skript folgt: Übersicht-Adressen ab Zeile
  66 (+2), Block 6 neu geordnet, Prüfblock Z. 105–110 sichtbar mit Kasse E105:G105, Raster in B54:B65, Frei-
  Zellen der Übersicht leer statt „–“ (auch G81, vorher G79), Frei-Zahlungsreihen O–S, Frei 123/124/129 leer,
  Projektwahl D3 = 1/2 und Aktives_Projekt = F4, Bezeichnungen/Quellen/Hinweise, Datenüberprüfung mit
  Bereichsmeldung und Aufschub_max, IRR-Startwerte 0,1/0,3/0,5/0,7 als zulässige Konstanten, Druck (G.4),
  Dokumenteigenschaften, keine doppelten Namen, Gliederung t = 43 … 80, Zeile 149 „n. v.“ bei Endvermögen ≤ 0,
  P4 mit Zeile 143, neue Läufe L39–L41 (Bank mit negativen EK-Renditen, Faktor 2,0, Mietsteigerung −5 %).

Korrekturen am Prüfskript (09.11.2026, Nacharbeit Runde 2; Sollwerte der Referenzrechnung unverändert)
  6. F8 Nullstellenregel: Bei mehreren Nullstellen ließ das Skript jede Nullstelle gelten (Barwert < 1 €) und „n. v.“
     ohne Bedingung. So blieb unentdeckt, dass die Mappe je nach Startwert die untere Nullstelle zeigte (Prüfbefund R2
     Runde 2: L10 EK-IRR ohne Restwert Jahr 35 A −14,45 % statt −6,42 %; L41 Frei Objekt-IRR ohne Restwert Jahr 35
     −22,71 % statt −8,44 %). Neu: Soll ist der Wert der RR (eine Nullstelle: diese; mehrere: die größte mit fallendem
     Barwert, kennzahlen-konzept 3.3); „n. v.“ nur, wenn die RR keinen Wert hat oder der Wert unter −69 % liegt
     (Kaskadengrenze, Konzept K.2 R1). Dieselbe Regel gilt für die NBank-Lage (vorher aus dem Excel-Wert), für P4
     und für die Konzeptwerte F.3–F.5.
  7. Fehlerwerte: Das Skript hatte keinen Lauf mit Fehlerwerten; der Gesamtstatus „OK“ trotz #N/A (Prüfbefund R1
     Runde 2) blieb unentdeckt. Neu: Fehlerlauf L42 (Mietenstufe „VIII“ per Einfügen) mit eigener Erwartung.
  Konzeptänderungen Runde 2 (KONZEPT-v3.md, Abschnitt L), denen das Skript folgt: Übersicht neu geordnet (Block 1 mit
  Förderbarwert 1.9 ab Zeile 17 +1; Bemerkungen der Blöcke 1–4 und 8 in H; Raster 0/1,0/1,5/2,0/2,38/2,5/3,0 % in
  B55:B61, 3.1 in B62; Schwellen 63–65; Rechenweg S. 12 in 66–72; Block 5 mit Objekt-IRR nach Förderbarwert und Frei
  in allen Zeilen; Blöcke 6–8 +4; Prüfstatus in C109:C114, Kasse D109:F109; P2 „Auswahlfelder gültig“), Gefördert
  Zahlungsreihen AO–AS, Block Förderbarwert Zeilen 172–177, Hilfswerte der Nullstellensuche Y–AB, Sprunglinks H2:M2,
  Druckwiederholung 2:3, Kasse und Restschulden auf Cent gerundet, IRR-Konstanten 0,6/0,05/0,0001, Eingabeformate
  ohne Nullabschnitt, Texte laut Abschnitt L.

Erweiterung „Frei finanziert: Finanzierung, Mietwahl, Eigenkapitalebene“ (KONZEPT-v3.md, Abschnitt N)
  Konzeptänderungen, denen das Skript folgt: Eingaben 10.1 (Miete frei finanziert) und 10.2 (DSCR-Ziel) in den Zeilen
  53/54 (39 Eingaben, 66 Namen); Blatt Frei finanziert mit Bankdarlehen, Kapitaldienst, Projektkonto, EK-Reihen
  (Zeitreihe A–Q, Zahlungsreihen R–AB, Blöcke in den Zeilen der Blätter Gefördert); Block „Miete für das DSCR-Ziel“
  in den Zeilen 179–183 (Frei bis 186) auf allen vier Zeitreihenblättern; Übersicht mit Frei-Spalte G in Block 1–3
  und 6, Block 8 „Miete für das DSCR-Ziel“ (Zeilen 108–114), Prüfblock in den Zeilen 116–122, Aufschlag der
  gerechneten Frei-Miete in L74 und L87.
  Druck (G.4): Frei finanziert in den Bereichen A1:Q48 und A88:Q186 (drei Seiten), feste Seitenumbrüche nach
  Zeile 115 und 152 (Gefördert) bzw. 129 (Frei); F5 prüft die Umbrüche aller Blätter.
  Sollwerte frei: RR.Lauf(…, "M") mit Bankdarlehen (ek_modell, Parameterkopie mit Eigenmittelquote = (Mindest-
  Eigenmittel in Geld + Zusatz-EK + KG 800) ÷ zuwendungsfähige Kosten, wie der Bankpfad F8 für gefördert); der
  EK-Teil (EK-IRR, VOFI-EK-Rendite, Endvermögen), den RR.kennzahlen für "M" nicht rechnet, wird hier nachgebildet.
  Die nötige Miete für das DSCR-Ziel rechnet das Skript selbst; bei Schalter „Miete für DSCR-Ziel“ läuft die RR mit
  dieser Miete als Marktmiete der Parameterkopie. Bei Laufzeit Bank ≠ 30 Jahre (RR fest 30) wird der Bankpfad frei
  geschlossen gerechnet und mit Überschuss vor Kapitaldienst und Restwert der RR verbunden.
  Regression (Entscheidung 7): Läufe L1 und L2 gegen den Stand vor der Erweiterung (--baseline oder VOFI_BASELINE;
  sonst aus dem Repository, Commit BASELINE_COMMIT); ist der Stand nicht erreichbar, meldet das Skript einen HINWEIS.

Nacharbeit Prüfrunde 1 zur Erweiterung „Frei finanziert“ (KONZEPT-v3.md, Abschnitt N.7)
  Konzeptänderungen, denen das Skript folgt: Übersicht 6.8 „Tiefster Stand Projektkonto (VOFI)“ in Zeile 96 (A/B/C/
  Frei aus Zeile 169 der Blätter); Block 7 ab Zeile 98, Block 8 in den Zeilen 109–115, Prüfblock 117–123; Aufschlag
  der gerechneten Frei-Miete auch in L98 und auf dem Blatt Frei finanziert (I131/J131); Bemerkungen 1.10, 1.11, 5.4,
  6.1, 6.5, 8.6, P4, P5; Hinweise 6 und 7; Eingaben Spalte F Breite 20.
  Neue Läufe L53–L58 (Laufzeit Bank 60 Jahre, frei ohne Bankdarlehen mit Marktmiete und mit Miete für DSCR-Ziel,
  Miete für DSCR-Ziel mit Zinsbindung 1 Jahr und Anschlusszins 6 %, DSCR-Ziel 0,5 und 3). Neue Identität F13:
  Eigenmittel frei = Eigenmittel 1.11 gefördert, solange gefördert die Eingabe 7.1 ganz aufnimmt.
  Pfade: recalc.py über VOFI_RECALC oder Suche; kein fester Pfad auf einen Sitzungsordner.

Nacharbeit Prüfrunde 2 zur Erweiterung „Frei finanziert“ (KONZEPT-v3.md, Abschnitt N.8)
  Konzeptänderungen, denen das Skript folgt: Aufschlag der gerechneten Frei-Miete auch auf Seite 1 der Übersicht
  (L26, L38, L42); Abstandszeilen der Übersicht 6 pt; Gefördert Spalten T–X Breite 14; DSCR Jahr 1 „–“ ohne
  Kapitaldienst (Zeile 156 aller Zeitreihenblätter); Aufschläge „–“ bei Marktmiete 0 (Frei 185/186); Bemerkungen 1.12,
  Zeile „Kapitaldienst Bankdarlehen“, 6.8, 8.2, 8.3; Frei Bezeichnung Zeile 107; Hinweise 6 und 11.
  Neue Läufe L59–L62: Laufzeit Bank gleich und kleiner als die Zinsbindung (6.4 = 10; 6.4 = 5 mit Bankdarlehen
  gefördert), Zinsbindung gleich Laufzeit 30 Jahre (6.2 = 30) und Marktmiete 0 mit Miete für DSCR-Ziel. Die RR teilt
  bei Zinsbindung ≥ 30 Jahre durch die Restlaufzeit 0; sie läuft dann mit Zinsbindung 29 Jahre, der Bankpfad wird
  geschlossen gerechnet (wie bei Laufzeit ≠ 30 Jahre, A9).
  Neue Prüfung F5: Seitenreserve je Druckseite nach der Breitenregel von Excel (ECMA-376), mindestens 10 pt.
"""
import argparse
import concurrent.futures as cf
import copy
import hashlib
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import zipfile
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

import openpyxl
from openpyxl.formula.tokenizer import Tokenizer
from openpyxl.utils import column_index_from_string, get_column_letter
from openpyxl.utils.cell import range_boundaries

# =====================================================================================================
# 0. Pfade und Toleranzen
# =====================================================================================================
VOFI_DIR = Path("/home/user/NBank/vofi")
MAPPE_STANDARD = VOFI_DIR / "PGN_VOFI_Mietwohnraum_2026_v3.xlsx"
BROSCH = Path("/home/user/NBank/broschuere")
V21 = BROSCH / "zulieferungen" / "PGN_NBank_VOFI_Modell_v2-1.xlsx"
V21_SHA_PREFIX = "11d558b3"
PRUEF_DIR = BROSCH / "zulieferungen" / "vofi-pruefung"
SEITEN_DIR = BROSCH / "content" / "pages"


def finde_recalc():
    """recalc.py des xlsx-Skills: Umgebungsvariable VOFI_RECALC, sonst Suche unter dem Benutzerordner."""
    if os.environ.get("VOFI_RECALC"):
        return Path(os.environ["VOFI_RECALC"])
    for treffer in sorted(Path.home().glob(".*/skills/**/xlsx/scripts/recalc.py")):
        return treffer
    return Path("recalc.py")


RECALC = finde_recalc()

# Stand vor der Erweiterung „Frei finanziert“ (Konzept N), nur für die Regressionsprüfung: --baseline PFAD oder
# Umgebungsvariable VOFI_BASELINE; sonst holt das Skript die Mappe des Commits BASELINE_COMMIT aus dem Repository.
BASELINE = os.environ.get("VOFI_BASELINE", "")
BASELINE_COMMIT = "0dfe8a2"
BASELINE_GIT = "vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx"
MIETWAHL = ("Marktmiete", "Miete für DSCR-Ziel")        # Eingabe 10.1

TOL_EUR = 1.0          # Beträge
TOL_CENT = 0.01        # Förderbeträge, Jahresrechnung Jahr 1, v2-1-Abgleich
TOL_SATZ = 0.0001      # Renditen und Sätze (0,01 Pp)
TOL_MIETE = 0.0001     # €/m² Monat
TOL_DSCR = 0.001
IRR_GRENZE = -0.69     # Konzept K.2 R1: Nullstellen unter rund −70 % findet die Kaskade nicht zuverlässig („n. v.“)

PROJEKT_NAME = {"M": "Modellhaus Broschüre", "T": "Tarutinoer Str. 4, Neu Wulmstorf"}
PROJEKT_SPALTE = {"M": "D", "T": "E"}
GRUPPEN = ("A", "B", "C")
GEF = {g: f"Gefördert {g}" for g in GRUPPEN}
FREI = "Frei finanziert"
UEB = "Übersicht"
BLAETTER = ["Übersicht", "Eingaben", "Gefördert A", "Gefördert B", "Gefördert C", "Frei finanziert",
            "NBank", "Tabellen", "Hinweise"]

ROT, WEISS, GRAU_GRUPPE, ANTHRAZIT = "8B2939", "FFFFFF", "F4F3F2", "3C3C3B"
BLAU, GELB, GRAU_F, GRUEN, SCHWARZ = "0000FF", "FFF2CC", "EDEDED", "008000", "000000"


# =====================================================================================================
# 1. Bericht
# =====================================================================================================
def fmt(x):
    """Ist/Soll-Darstellung im Bericht (deutsch)."""
    if x is None:
        return "leer"
    if isinstance(x, bool):
        return str(x)
    if isinstance(x, (int, float)):
        if isinstance(x, float) and (math.isnan(x) or math.isinf(x)):
            return str(x)
        if x != 0 and abs(x) < 1:
            s = f"{x:.6f}"
        elif abs(x) >= 1000:
            s = f"{x:,.2f}"
        else:
            s = f"{x:.4f}".rstrip("0").rstrip(".") if isinstance(x, float) else str(x)
        return s.replace(",", "X").replace(".", ",").replace("X", ".")
    return repr(x) if isinstance(x, str) else str(x)


class Pruefung:
    """Eine Prüfung mit beliebig vielen Einzelvergleichen; berichtet als eine Zeile, Fehler einzeln."""

    def __init__(self, bericht, kz, titel):
        self.b, self.kz, self.titel = bericht, kz, titel
        self.n, self.fehler, self.ok_zeilen = 0, [], []

    def check(self, ok, was, ist=None, soll=None, info=None):
        self.n += 1
        z = f"{was}: Ist {fmt(ist)} | Soll {fmt(soll)}" + (f" ({info})" if info else "")
        if ok:
            self.ok_zeilen.append(z)
        else:
            self.fehler.append(z)
        return ok

    def zahl(self, was, ist, soll, tol, info=None):
        ok = isinstance(ist, (int, float)) and not isinstance(ist, bool) and isinstance(soll, (int, float)) \
            and abs(ist - soll) <= tol + 1e-12
        return self.check(ok, was, ist, soll, info or f"Tol. {fmt(tol)}")

    def gleich(self, was, ist, soll, info=None):
        if isinstance(soll, str) and isinstance(ist, str):
            ok = norm_text(ist) == norm_text(soll)
        elif soll is None or soll == "":
            ok = ist is None or ist == ""
        else:
            ok = ist == soll
        return self.check(ok, was, ist, soll, info)

    def fertig(self):
        self.b.ergebnis(self)


class Bericht:
    def __init__(self, ausfuehrlich=False):
        self.aus = ausfuehrlich
        self.zeilen = []
        self.n_ok = self.n_fehler = self.n_hinweis = 0
        self.fehlerliste = []

    def abschnitt(self, titel):
        self.zeilen.append("")
        self.zeilen.append("=" * 100)
        self.zeilen.append(titel)
        self.zeilen.append("=" * 100)
        print("\n".join(self.zeilen[-4:]), flush=True)

    def pruefung(self, kz, titel):
        return Pruefung(self, kz, titel)

    def ergebnis(self, p):
        if p.n == 0:
            z = [f"FEHLER  {p.kz:<5} {p.titel}: keine Werte geprüft"]
            self.n_fehler += 1
            self.fehlerliste.append(f"{p.kz} {p.titel}")
        elif p.fehler:
            z = [f"FEHLER  {p.kz:<5} {p.titel} ({len(p.fehler)} von {p.n} Werten)"]
            z += [f"          - {f}" for f in p.fehler[:25]]
            if len(p.fehler) > 25:
                z.append(f"          … {len(p.fehler) - 25} weitere")
            self.n_fehler += 1
            self.fehlerliste.append(f"{p.kz} {p.titel} ({len(p.fehler)})")
        else:
            z = [f"OK      {p.kz:<5} {p.titel} ({p.n} Werte)"]
            if self.aus:
                z += [f"          · {o}" for o in p.ok_zeilen]
            self.n_ok += 1
        self.zeilen += z
        print("\n".join(z), flush=True)

    def hinweis(self, kz, text):
        z = f"HINWEIS {kz:<5} {text}"
        self.zeilen.append(z)
        self.n_hinweis += 1
        print(z, flush=True)

    def schluss(self):
        z = ["", "=" * 100,
             f"Ergebnis: {self.n_ok} Prüfungen OK, {self.n_fehler} FEHLER, {self.n_hinweis} Hinweise"]
        if self.fehlerliste:
            z.append("Fehlerhaft: " + "; ".join(self.fehlerliste[:30])
                     + (f"; … {len(self.fehlerliste) - 30} weitere" if len(self.fehlerliste) > 30 else ""))
        z.append("GESAMT: " + ("OK" if self.n_fehler == 0 else "FEHLER"))
        self.zeilen += z
        print("\n".join(z), flush=True)
        return 0 if self.n_fehler == 0 else 1


# =====================================================================================================
# 2. Hilfsfunktionen
# =====================================================================================================
def dz(a, b):
    """a − b, None wenn ein Wert keine Zahl ist."""
    return a - b if ist_zahl(a) and ist_zahl(b) else None


def norm_text(s):
    s = re.sub(r"(?<=\w)-\n(?=[a-zäöüß])", "", str(s))          # Trennung im Kopf: „Instand-↵haltung“
    return re.sub(r"\s+", " ", s).strip()


def ist_zahl(x):
    return isinstance(x, (int, float)) and not isinstance(x, bool)


def rgb6(color):
    """Farbe einer openpyxl-Color als RRGGBB oder None (Theme/Index)."""
    if color is None:
        return None
    try:
        v = color.rgb
    except Exception:
        return None
    if isinstance(v, str) and len(v) >= 6:
        return v[-6:].upper()
    return None


def fill6(cell):
    f = cell.fill
    if f is None or f.fill_type in (None, "none"):
        return None
    return rgb6(f.fgColor)


def norm_numfmt(code):
    return (code or "").replace("\\", "").replace('"', "").upper().replace(" ", "")


def de_zahl(s):
    """'1.400.000' / '−18.495' / '6,80' / '1,15 %' -> float (Prozent als Bruch), dazu Nachkommastellen."""
    t = str(s).strip().replace("−", "-").replace(" ", " ")
    pct = t.endswith("%")
    t = t.replace("%", "").replace("€", "").strip()
    t = t.replace(".", "").replace(" ", "")
    nk = len(t.split(",")[1]) if "," in t else 0
    v = float(t.replace(",", "."))
    if pct:
        return v / 100.0, nk + 2
    return v, nk


def kw(s):
    """Konzeptwert als deutscher Text -> (Wert, Toleranz aus der gezeigten Stelle)."""
    v, nk = de_zahl(s)
    return v, 0.5 * 10 ** (-nk) * 1.0000001 + 1e-12


def runde(x, nk):
    q = Decimal(1).scaleb(-nk)
    return float(Decimal(repr(float(x))).quantize(q, rounding=ROUND_HALF_UP))


def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


CELL_RE = re.compile(r"^(\$?)([A-Z]{1,3})(\$?)(\d+)$")
COL_RE = re.compile(r"^(\$?)([A-Z]{1,3})$")
ROW_RE = re.compile(r"^(\$?)(\d+)$")


def split_sheet(ref):
    """"'Blatt X'!A1:B2" -> ("Blatt X", "A1:B2"); ohne Blatt -> (None, ref)."""
    if "!" in ref:
        s, r = ref.rsplit("!", 1)
        s = s.strip()
        if s.startswith("'") and s.endswith("'"):
            s = s[1:-1].replace("''", "'")
        return s, r
    return None, ref


def ref_r1c1(ref, row, col):
    """Ein Bezug (ohne Blatt) -> R1C1-Text; Namen bleiben unverändert."""
    teile = ref.split(":")
    out = []
    for t in teile:
        m = CELL_RE.match(t)
        if m:
            ca, cl, ra, rw = m.groups()
            c = column_index_from_string(cl)
            r = int(rw)
            rs = f"R{r}" if ra else f"R[{r - row}]"
            cs = f"C{c}" if ca else f"C[{c - col}]"
            out.append(rs + cs)
        else:
            out.append(t)
    return ":".join(out)


def tokens(formel):
    try:
        return Tokenizer(formel).items
    except Exception:
        return None


def zu_r1c1(formel, row, col):
    toks = tokens(formel)
    if toks is None:
        return formel
    out = []
    for t in toks:
        v = t.value
        if t.type == "OPERAND" and t.subtype == "RANGE":
            s, r = split_sheet(v)
            out.append((f"'{s}'!" if s else "") + ref_r1c1(r, row, col))
        elif t.type == "FUNC" and t.subtype == "OPEN" and ":" in v:
            pre, fn = v.rsplit(":", 1)
            s, r = split_sheet(pre)
            r = ref_r1c1(r, row, col) if CELL_RE.match(r.strip()) else r
            out.append((f"'{s}'!" if s else "") + r + ":" + fn)
        else:
            out.append(v)
    return "".join(out)


def bezuege(formel):
    """Alle Bezüge einer Formel: Liste (blatt|None, text) inkl. Namen."""
    toks = tokens(formel) or []
    res = []
    for t in toks:
        if t.type == "OPERAND" and t.subtype == "RANGE":
            res.append(split_sheet(t.value))
        elif t.type == "FUNC" and t.subtype == "OPEN" and ":" in t.value:
            bs, ref = split_sheet(t.value.rsplit(":", 1)[0])
            if CELL_RE.match(ref.strip()):
                res.append((bs, ref.strip()))
    return [(bs, r) for bs, r in res if r]


def funktionen(formel):
    toks = tokens(formel) or []
    fs = []
    for t in toks:
        if t.type == "FUNC" and t.subtype == "OPEN":
            n = t.value.rsplit(":", 1)[-1].rstrip("(").upper()
            if n:
                fs.append(n)
    return fs


def zahlkonstanten(formel):
    toks = tokens(formel) or []
    out = []
    for t in toks:
        if t.type == "OPERAND" and t.subtype == "NUMBER":
            try:
                out.append(float(t.value))
            except ValueError:
                out.append(t.value)
    return out


def ist_reiner_bezug(formel):
    """Formel besteht nur aus einem Bezug oder Namen (ohne Rechnung)."""
    toks = tokens(formel)
    if not toks or len(toks) != 1:
        return None
    t = toks[0]
    if t.type == "OPERAND" and t.subtype == "RANGE":
        return split_sheet(t.value)
    return None


# =====================================================================================================
# 3. Konzepttabellen (KONZEPT-v3.md, Abschnitte A–D, verbindliche Adressen)
# =====================================================================================================
# Eingaben B.2: Nr, Zeile, Name, Bezeichnung, Einheit, Formatklasse, Gültigkeit, Quelle,
#               Sollwert Modellhaus / Tarutinoer als Funktion der RR-Parameter (P) bzw. Konstante.
def _g(key):
    return lambda P: P[key]


_VG = "PGN-Annahme; Vorgängermappe"
EINGABEN = [
    ("1.1", 7, "Bezugsjahr", "Bezugsjahr (ändert nur Jahresangaben)", "Jahr", "ganz", ("whole", 2020, 2060),
     "PGN-Annahme, Planungsstand 2026", _g("fj"), _g("fj")),
    ("1.2", 8, "Wohnflaeche", "Wohnfläche", "m²", "ganz", ("decimal", 1, 100000), "Broschüre S. 10 / Projektdaten PGN",
     _g("wfl"), _g("wfl")),
    ("1.3", 9, "Wohneinheiten", "Wohnungen", "Anzahl", "ganz", ("whole", 1, 1000), "Broschüre S. 10 / Projektdaten PGN",
     _g("we"), _g("we")),
    ("2.1", 11, "Herstellungskosten_qm", "Herstellungskosten KG 200–700", "€/m² Wohnfläche", "eur0",
     ("decimal", 0, 20000), "Broschüre S. 10 / Kostenansatz PGN",
     lambda P: P["herstellung"] / P["wfl"], lambda P: P["herstellung"] / P["wfl"]),
    ("2.2", 12, "KG_800", "Finanzierungskosten KG 800", "€", "eur0", ("decimal", 0, 1e8), "PGN-Annahme (Ansatz 0)",
     _g("kg800"), _g("kg800")),
    ("2.3", 13, "Grundstueck", "Grundstück, Verkehrswert (Sacheinlage)", "€", "eur0", ("decimal", 0, 1e9),
     "Broschüre S. 10 / Ansatz 0 € (Verkehrswert 731.325 €)", _g("grundstueck"), _g("grundstueck")),
    ("2.4", 14, "Bodenrichtwert", "Bodenrichtwert (0 = kein Deckel)", "€/m²", "eur0", ("decimal", 0, 10000),
     "Broschüre S. 10: Deckel greift nicht / Projektdaten PGN", lambda P: P["brw"] or 0, lambda P: P["brw"] or 0),
    ("2.5", 15, "Grundstuecksflaeche", "Grundstücksfläche (0 = kein Deckel)", "m²", "ganz", ("decimal", 0, 1e6),
     "Broschüre S. 10: Deckel greift nicht / Projektdaten PGN", lambda P: P["gfl"] or 0, lambda P: P["gfl"] or 0),
    ("3.1", 17, "Tilgung_NBank", "Tilgung NBank-Darlehen, linear", "% p. a.", "pct", ("decimal", 0, 0.10),
     "PGN-Annahme: linear über 42 Jahre / Vorgängermappe 2,50 %", lambda P: 1 / 42,
     lambda P: 1 / P["laufzeit_nbank"]),   # Modellhaus: 1/Höchstlaufzeit (RL 2026 Nr. 5.3.5); Tarutinoer wie v2-1 (40 Jahre)
    ("3.2", 18, "Tilgungsaufschub", "Tilgungsaufschub", "Jahre", "ganz", ("whole", 0, "Aufschub_max"),
     "PGN-Annahme (Rahmen RL 2026 Nr. 5.3.5)", _g("tilgungsfrei"), _g("tilgungsfrei")),
    ("3.3", 19, "Zins_NBank_ab36", "Zins NBank-Darlehen ab Jahr 36", "% p. a.", "pct", ("decimal", 0, 0.10),
     "PGN-Annahme (Rahmen RL 2026 Nr. 5.3.4)", _g("zins_ab36"), _g("zins_ab36")),
    ("3.4", 20, "Swapsatz_30J", "Swapsatz 30 Jahre", "%", "pct", ("decimal", 0, 0.10),
     "EUR-Swapsatz 30 Jahre, Stand 19.08.2026", _g("swap"), _g("swap")),
    ("4.1", 22, "Mietenstufe", "Mietenstufe", "Liste", "text", ("list", "Mietenstufen"),
     "Broschüre S. 10 / Projektdaten PGN", _g("mietenstufe"), _g("mietenstufe")),
    ("4.2", 23, "Effizienz_EH40", "Effizienzhaus 40 erreicht", "ja/nein", "text", ("list", "ja,nein"),
     "Broschüre S. 11 (ohne EH-40-Zuschlag) / Planung PGN (EH 55)", lambda P: "ja" if P["effizienz"] in ("EH 40", "EH 40 QNG") else "nein",
     lambda P: "ja" if P["effizienz"] in ("EH 40", "EH 40 QNG") else "nein"),
    ("4.3", 24, "Vergleichsmiete_1", "Ortsübliche Vergleichsmiete, Jahr 1", "€/m² Monat", "eur2",
     ("decimal", 0, 50), "Platzhalter / PGN-Mietband Neu Wulmstorf, fortgeschrieben", lambda P: 12.92,
     _g("ovm_start")),
    ("4.4", 25, "Marktmiete_1", "Marktmiete Neuvermietung, Jahr 1", "€/m² Monat", "eur2", ("decimal", 0, 50),
     "Platzhalter / PGN-Mietband Neu Wulmstorf, fortgeschrieben", lambda P: 14.48, _g("markt_start")),
    ("4.5", 26, "Mietsteigerung", "Steigerung Markt- und Vergleichsmiete", "% p. a.", "pct", ("decimal", -0.05, 0.10),
     "PGN-Annahme, langfristiger Mittelwert", _g("miet_wachstum"), _g("miet_wachstum")),
    ("4.6", 27, "Kappungsgrenze", "Kappungsgrenze nach Bindungsende", "% in 3 Jahren", "pct", ("decimal", 0, 0.20),
     "§ 558 Abs. 3 BGB", _g("kapp_norm"), _g("kapp_norm")),
    ("5.1", 29, "Mietausfall", "Mietausfall/Leerstand", "% der Sollmiete", "pct", ("decimal", 0, 0.20),
     "PGN-Annahme (Broschüre S. 11)", _g("mietausfall"), _g("mietausfall")),
    ("5.2", 30, "Verwaltung_WE", "Objektverwaltung je Wohnung", "€ p. a.", "eur0", ("decimal", 0, 2000),
     "PGN-Annahme (Broschüre S. 11); ImmoWertV fortgeschrieben", _g("verwaltung_we"), _g("verwaltung_we")),
    ("5.3", 31, "Instandhaltung_qm", "Instandhaltung je m² Wohnfläche", "€ p. a.", "eur2", ("decimal", 0, 100),
     "PGN-Annahme (Broschüre S. 11); ImmoWertV fortgeschrieben", _g("instandhaltung_qm"), _g("instandhaltung_qm")),
    ("5.4", 32, "Kostensteigerung", "Kostensteigerung ab Jahr 2", "% p. a.", "pct", ("decimal", -0.05, 0.10),
     _VG + " Best 1,5 %, Worst 2,5 %", _g("kosten_wachstum"), _g("kosten_wachstum")),
    ("5.5", 33, "Kosten_Vorlauf", "Kostensätze 2026 fortschreiben um", "Jahre", "ganz", ("whole", 0, 10),
     "Broschüre S. 11 (Kostenstand 2026)", lambda P: 0, lambda P: 0),
    ("6.1", 35, "Zins_Bank", "Zins Bank, zugleich Abzinsung Förderbarwert", "% p. a.", "pct", ("decimal", 0, 0.15),
     "PGN-Annahme (Marktmittel Bundesbank, bisheriger Ansatz)", _g("zins_bank"), _g("zins_bank")),
    ("6.2", 36, "Zinsbindung", "Zinsbindung", "Jahre", "ganz", ("whole", 1, 42), "PGN-Annahme (bisheriger Ansatz)",
     _g("zinsbindung"), _g("zinsbindung")),
    ("6.3", 37, "Zins_Anschluss", "Anschlusszins", "% p. a.", "pct", ("decimal", 0, 0.15),
     _VG + " Best 2,74 %, Worst 4,74 %", _g("zins_anschluss"), _g("zins_anschluss")),
    ("6.4", 38, "Laufzeit_Bank", "Laufzeit Bankdarlehen (Annuität)", "Jahre", "ganz", ("whole", 1, 60),
     "PGN-Annahme (bisheriger Ansatz)", lambda P: 30, lambda P: 30),
    ("7.1", 40, "EK_Zusatz", "Zusätzliches Eigenkapital bar, mindert Bank", "€", "eur0", ("decimal", 0, 1e9),
     "PGN-Annahme", lambda P: 0, lambda P: 0),
    ("7.2", 41, "Habenzins", "Guthabenzins Projektkonto (VOFI)", "% p. a.", "pct", ("decimal", 0, 0.10),
     "PGN-Annahme (bisheriger Ansatz)", _g("haben"), _g("haben")),
    ("7.3", 42, "Sollzins", "Sollzins Projektkonto (VOFI)", "% p. a.", "pct", ("decimal", 0, 0.20),
     "PGN-Annahme (bisheriger Ansatz)", _g("soll"), _g("soll")),
    ("8.1", 44, "Bodenwertsteigerung", "Bodenwertsteigerung", "% p. a.", "pct", ("decimal", -0.05, 0.10),
     "PGN-Annahme (bisheriger Ansatz)", _g("bodenwert_wachstum"), _g("bodenwert_wachstum")),
    ("8.2", 45, "Zielmiete", "Zielmiete nach Bindungsende", "Liste", "text", ("list", "Marktmiete,Vergleichsmiete"),
     "PGN-Annahme", lambda P: "Marktmiete", lambda P: "Marktmiete"),
    ("8.3", 46, "Veraeusserungskosten", "Veräußerungskosten", "% des Restwerts", "pct", ("decimal", 0, 0.20),
     "PGN-Annahme", lambda P: 0, lambda P: 0),
    ("9.1", 48, "Stress_KG", "Faktor Herstellungskosten", "Faktor", "faktor", ("decimal", 0.5, 2),
     _VG + " Best 0,95, Worst 1,15", lambda P: 1, lambda P: 1),
    ("9.2", 49, "Stress_Miete", "Faktor Markt- und Vergleichsmiete", "Faktor", "faktor", ("decimal", 0.5, 2),
     _VG + " Best 1,05, Worst 0,95", lambda P: 1, lambda P: 1),
    ("9.3", 50, "Stress_LZ", "Zuschlag Liegenschaftszins (Standort)", "Prozentpunkte", "pp", ("decimal", -0.02, 0.02),
     _VG + " Best −0,30, Worst +0,60 Pp", lambda P: 0, lambda P: 0),
    ("9.4", 51, "Stress_GebRW", "Faktor Gebäude-Restwert", "Faktor", "faktor", ("decimal", 0, 1.5), "PGN-Annahme",
     lambda P: 1, lambda P: 1),
    ("10.1", 53, "Miete_Frei", "Miete frei finanziert", "Liste", "text", ("list", "Marktmiete,Miete für DSCR-Ziel"),
     "PGN-Annahme", lambda P: "Marktmiete", lambda P: "Marktmiete"),
    ("10.2", 54, "DSCR_Ziel", "DSCR-Ziel für die nötige Miete", "Faktor", "faktor", ("decimal", 0.5, 3), "PGN-Annahme",
     lambda P: 1, lambda P: 1),
]
EINGABE_LETZTE = 54
EIN = {e[0]: e for e in EINGABEN}
GRUPPENZEILEN = {6: ("1", "Projekt"), 10: ("2", "Kosten und Grundstück"), 16: ("3", "Förderung NBank"),
                 21: ("4", "Miete"), 28: ("5", "Bewirtschaftung"), 34: ("6", "Bankdarlehen und Vergleichszins"),
                 39: ("7", "Eigenkapital und Projektkonto (VOFI)"), 43: ("8", "Restwert"), 47: ("9", "Stresstest"),
                 52: ("10", "Miete frei finanziert")}

# Tabellen C: Tabelle 3 (Zeile, Nr., Festwert, Einheit, Quelle, Name, Sollwert aus RR-Parametern/Annahmen)
TAB3 = [
    (18, "T10", "Eigenmittel, mindestens", "% der zuw. Kosten", "RL 2026 Nr. 5.2.6", "Eigenmittelquote",
     lambda P, A: P["eigenmittel_quote"]),
    (19, "T11", "Zins NBank bis Ende Jahr 35", "% p. a.", "RL 2026 Nr. 5.3.4", "Zins_NBank_1_35",
     lambda P, A: P["zins_1_35"]),
    (20, "T12", "Zinsfreie Jahre", "Jahre", "RL 2026 Nr. 5.3.4", "Zinsfreie_Jahre", lambda P, A: P["zinsfrei"]),
    (21, "T13", "Höchstlaufzeit, Betrachtungsende", "Jahre", "RL 2026 Nr. 5.3.5", "Laufzeit_max",
     lambda P, A: P["n"]),
    (22, "T14", "Tilgungsaufschub, höchstens", "Jahre", "RL 2026 Nr. 5.3.5", "Aufschub_max",
     lambda P, A: A.w("Hoechst_Tilgungsfrei")),
    (23, "T15", "Verwaltungskostenbeitrag", "% p. a. vom Restkapital", "RL 2026 Nr. 12.7.1", "VKB_Satz",
     lambda P, A: P["vkb"]),
    (24, "T16", "Bearbeitungsentgelt Darlehen", "% einmalig", "RL 2026 Nr. 12.7.2", "BE_Darlehen",
     lambda P, A: P["be_d"]),
    (25, "T17", "Bearbeitungsentgelt Zuschuss", "% einmalig", "RL 2026 Nr. 12.7.3", "BE_Zuschuss",
     lambda P, A: P["be_z"]),
    (26, "T18", "Belegungs- und Mietbindung", "Jahre", "RL 2026 Nr. 5.4.1, 5.4.2", "Bindung",
     lambda P, A: P["bindung"]),
    (27, "T19", "Jahre ohne Mieterhöhung", "Jahre", "RL 2026 Nr. 5.4.4, 5.4.5", "Mietruhe_Jahre",
     lambda P, A: P["karenz"]),
    (28, "T20", "Mieterhöhung in der Bindung, höchstens", "% in 3 Jahren", "RL 2026 Nr. 5.4.5",
     "Mietanpassung_Bindung", lambda P, A: P["kappung"]),
    (29, "T21", "Abstand der Mieterhöhungen", "Jahre", "PGN-Konvention (Rahmen RL 2026 Nr. 5.4.5)", "Erhoehung_Rhythmus",
     lambda P, A: P["rhythmus"]),
    (30, "T22", "Zuschlag Höchstmiete ab EH 40", "€/m² Monat", "RL 2026 Nr. 5.4.4 Satz 2", "Zuschlag_EH40",
     lambda P, A: P["zuschlag_eh40"]),
    (31, "T23", "Tilgung Bankdarlehen, mindestens", "% p. a.", "RL 2026 Nr. 5.3.6", "Tilgung_Bank_min",
     lambda P, A: 0.01),
    (32, "T24", "Aufschlag auf Swapsatz", "Prozentpunkte", "RL 2026 Nr. 11.10 Abs. 4", "Aufschlag_Swap",
     lambda P, A: P["dawi_aufschlag"]),
    (33, "T25", "Gesamtnutzungsdauer Mehrfamilienhaus", "Jahre", "ImmoWertV Anlage 1", "GND",
     lambda P, A: P["gnd"]),
]
MIETENSTUFEN = ["I", "II", "III", "IV", "V", "VI", "VII"]
LZ_QUELLE = "OGA Nds., Landesmodell MFH, 01.01.2026, BRW 600 €/m²"

NAMEN = {"Aktives_Projekt": "Eingaben!$F$4", "Projekt_Nr": "Eingaben!$D$3", "Projektliste": "Eingaben!$D$4:$E$4",
         "Gruppen": "Tabellen!$D$4:$F$4", "Quote_Darlehen": "Tabellen!$D$5:$F$5",
         "Quote_Zuschuss": "Tabellen!$D$6:$F$6", "Mietenstufen": "Tabellen!$B$9:$B$15",
         "Bemessungsgrenzen": "Tabellen!$C$9:$C$15", "Hoechstmieten": "Tabellen!$D$9:$F$15",
         "LZ_RND": "Tabellen!$B$36:$B$41", "LZ_Satz": "Tabellen!$D$36:$D$41"}
NAMEN.update({e[2]: f"Eingaben!$F${e[1]}" for e in EINGABEN})
NAMEN.update({t[5]: f"Tabellen!$D${t[0]}" for t in TAB3})
EINGABE_NAMEN = {e[2] for e in EINGABEN}

# Zellhyperlinks (Blatt, Zelle, Text, Ziel-Blatt, Ziel-Zelle)
LINKS = [(UEB, "B3", "Prüfungen", UEB, "A117"), (UEB, "H2", "Projekt wählen", "Eingaben", "D3"),
         ("Eingaben", "G3", "Übersicht", UEB, "A1"), ("NBank", "I1", "Übersicht", UEB, "A1"),
         ("Tabellen", "G1", "Übersicht", UEB, "A1"), ("Hinweise", "C1", "Übersicht", UEB, "A1")]
for _i, _b in enumerate(BLAETTER[1:]):
    LINKS.append((UEB, get_column_letter(4 + _i) + "6", _b, _b, "A1"))
for _g_ in GRUPPEN:
    for _z, _t, _a in (("H2", "Übersicht", None), ("I2", "Finanzierung", "A88"), ("J2", "Restwert", "A116"),
                       ("K2", "Renditen", "A131"), ("L2", "Liquidität", "A153"), ("M2", "Förderbarwert", "A172"),
                       ("N2", "DSCR-Ziel", "A179")):
        LINKS.append((GEF[_g_], _z, _t, UEB if _a is None else GEF[_g_], _a or "A1"))
for _z, _t, _a in (("H2", "Übersicht", None), ("I2", "Finanzierung", "A88"), ("J2", "Restwert", "A116"),
                   ("K2", "Renditen", "A131"), ("L2", "Liquidität", "A153"), ("M2", "DSCR-Ziel", "A179")):
    LINKS.append((FREI, _z, _t, UEB if _a is None else FREI, _a or "A1"))

FIXIERUNG = {UEB: "A7", "Eingaben": "D6", "Gefördert A": "C6", "Gefördert B": "C6", "Gefördert C": "C6",
             FREI: "C6", "NBank": "A10", "Tabellen": "A3", "Hinweise": "A3"}
TITEL = {UEB: "VOFI Mietwohnraum 2026: Übersicht", "Eingaben": "Eingaben",
         "Gefördert A": "Gefördert A: Zeitreihe und Ergebnisse", "Gefördert B": "Gefördert B: Zeitreihe und Ergebnisse",
         "Gefördert C": "Gefördert C: Zeitreihe und Ergebnisse", FREI: "Frei finanziert: Zeitreihe und Ergebnisse",
         "NBank": "NBank: Orientierung zur Überkompensation", "Tabellen": "Tabellen", "Hinweise": None}
SPALTENBREITE = {UEB: {"A": 6, "B": 42, "C": 17, **{c: 12 for c in "DEFGHIJK"}, "L": 38},
                 "Eingaben": {"A": 6, "B": 44, "C": 15, "D": 22, "E": 22, "F": 20, "G": 58},
                 FREI: {"A": 5, "B": 7, "C": 11, "D": 11, **{c: 13 for c in "EFGHI"}, **{c: 12 for c in "JKL"}, "M": 13,
                        "N": 8, **{c: 13 for c in "OPQ"},
                        **{get_column_letter(c): 12 for c in range(18, 29)}},
                 "NBank": {"A": 6, "B": 40, "C": 13, "D": 11, "E": 11, "F": 11, "G": 10, "H": 10, "I": 10},
                 "Tabellen": {"A": 6, "B": 44, "C": 18, "D": 12, "E": 12, "F": 12, "G": 56},
                 "Hinweise": {"A": 5, "B": 120}}
_gb = {"A": 5, "B": 7, **{c: 10 for c in "CDEF"}, **{c: 13 for c in "GHIJK"}, **{c: 12 for c in "LMNOPQ"},
       "R": 13, "S": 8, **{c: 14 for c in "TUVWX"}}
for _c in range(column_index_from_string("Y"), column_index_from_string("AS") + 1):
    _gb[get_column_letter(_c)] = 12
for _g_ in GRUPPEN:
    SPALTENBREITE[GEF[_g_]] = _gb
DRUCKBEREICH = {g: "A1:J48,K1:X48,A88:J183" for g in GEF.values()}
DRUCKBEREICH[FREI] = "A1:Q48,A88:Q186"
WIEDERHOLZEILEN = {"Eingaben": "4:5", FREI: "2:3", **{g: "2:3" for g in GEF.values()}}
WIEDERHOLSPALTEN = {FREI: "", **{g: "A:B" for g in GEF.values()}}
# Feste Seitenumbrüche nach Zeile (Konzept G.4): Blockgrenzen
UMBRUCH = {UEB: [52], "Eingaben": [33], "Tabellen": [33], FREI: [129], **{g: [115, 152] for g in GEF.values()}}
KOPFZEILEN = {"Eingaben": [5], UEB: [8, 28, 41, 54, 75, 88, 99, 109, 117], "NBank": [4, 9, 26],
              "Tabellen": [4, 8, 17, 35], FREI: [5, 89, 117, 132, 154, 180],
              **{g: [5, 89, 117, 132, 154, 173, 180] for g in GEF.values()}}
GRUPPENZEILEN_BLATT = {"Eingaben": list(GRUPPENZEILEN), UEB: [74, 87, 98], "NBank": [10, 13, 16],
                       "Tabellen": [3, 7, 16, 34], FREI: [88, 116, 131, 153, 179],
                       **{g: [88, 116, 131, 153, 172, 179] for g in GEF.values()}}

# Beschriftungen laut Konzept: {Blatt: {Zelle: Text}}
BESCHRIFTUNG = {UEB: {}, "Eingaben": {}, "NBank": {}, "Tabellen": {}, "Hinweise": {}, FREI: {}}
_U = BESCHRIFTUNG[UEB]
_U.update({"B2": "Aktives Projekt", "B4": "Konventionen", "B5": "Legende", "B6": "Blätter",
           "D4": "vor Steuern, nominal, T0 = Bezugsfertigkeit; Zeitreihen: Auszahlungen negativ",
           "D5": "Ändern nur auf „Eingaben“ (blau auf Gelb). Grün: Verweis auf ein anderes Blatt. "
                 "Weitere Zeilen: + am linken Rand.",
           "B8": "Projekt und Finanzierung bei Bezug", "G8": "Frei", "H8": "Bemerkung",
           "A28": "Zeile", "B28": "Jahresrechnung Jahr 1, in € p. a.", "C28": "Satz", "G28": "Frei", "H28": "Bemerkung",
           "B41": "Liquidität", "G41": "Frei", "H41": "Bemerkung",
           "B54": "Zahlungsüberschuss Jahr 1 je Tilgungssatz", "G54": "höchster Überschuss", "H54": "Bemerkung",
           "B74": "Objektrendite vor Steuern", "D74": "Jahr 35", "H74": "Jahr 42", "G75": "Frei", "K75": "Frei",
           "B87": "Eigenkapitalrendite vor Steuern", "D87": "Jahr 35", "H87": "Jahr 42", "G88": "Frei", "K88": "Frei",
           "B98": "Restwert (Ertragswert)", "D98": "Jahr 35", "H98": "Jahr 42", "G99": "Frei", "K99": "Frei",
           "B109": "Miete für das DSCR-Ziel", "C109": "Einheit", "D109": "A", "E109": "B", "F109": "C", "G109": "Frei",
           "H109": "Bemerkung",
           "B117": "Prüfung", "C117": "Status", "D117": "A", "E117": "B", "F117": "C", "H117": "Bemerkung"})
# Übersicht (Konzept D.5, Runde 2): Zeile -> (Nr., Bezeichnung, Einheit, Bemerkung|None, Spalte der Bemerkung)
# Blöcke ohne Horizont (1–4, 8): Bemerkung in H; Blöcke 5–7: Bemerkung in L.
_NST = "mehrere Nullstellen möglich"
UEB_ZEILEN = {
    9: ("1.1", "Gesamtkosten", "€", None), 10: ("1.2", "Zuwendungsfähige Kosten", "€", None),
    11: ("1.3", "Herstellung über Bemessungsgrenze", "€", "nicht zuwendungsfähig"),
    12: ("1.4", "Grundstück über Bodenrichtwert × Fläche", "€", "Deckel nur für die Förderbemessung"),
    13: ("1.5", "NBank-Darlehen", "€", None), 14: ("1.6", "Zuschuss", "€", None),
    15: ("1.7", "Förderung gesamt", "€", "Darlehen + Zuschuss"), 16: ("1.8", "Förderquote auf Gesamtkosten", "%", None),
    17: ("1.9", "Förderbarwert (Zuschuss + Barwertvorteil)", "€",
         "Zuschuss nach Entgelt + Zinsvorteil; steigt mit Eingabe 6.1"),
    18: ("1.10", "Bankdarlehen", "€", "Restfinanzierung; Frei: Rest nach Eigenmitteln 1.11 (Eingaben Block 6)"),
    19: ("1.11", "Eigenmittel (RL Nr. 5.2.6), ohne Entgelte", "€",
         "Frei: Mindest-Eigenmittel wie gefördert zuzüglich Eingabe 7.1"),
    20: ("1.12", "Eigenmittelquote", "%", "mindestens 20 % der zuwendungsfähigen Kosten (1.2)"),
    21: ("1.13", "Bearbeitungsentgelte, einmalig", "€", None),
    22: ("1.14", "Eigenkapital (Grundstück + bar)", "€", "Eigenmittel + Entgelte"), 23: ("1.15", "davon bar", "€", None),
    24: ("1.16", "Zuschuss je Wohnung", "€", None), 25: ("1.17", "Eigenmittel je Wohnung", "€", None),
    26: ("1.18", "Miete Jahr 1", "€/m² Monat", "Frei laut Eingabe 10.1"),
    29: ("1", "Sollmiete: Höchstmiete nettokalt", None, "Schema wie Broschüre S. 11; Frei: Miete laut 1.18"),
    30: ("", "− Mietausfall/Leerstand", None, "der Sollmiete"),
    31: ("2", "− Objektverwaltung", None, "Satz 2026, fortgeschrieben laut Eingabe 5.5; Betriebskosten umgelegt"),
    32: ("3", "− Instandhaltung", None, "Satz 2026, fortgeschrieben laut Eingabe 5.5"),
    33: ("4", "= Überschuss vor Kapitaldienst", None, None),
    34: ("5", "− Verwaltungskostenbeitrag", None, "des Restkapitals"),
    35: ("6", "− Zins NBank-Darlehen", None, "bis Ende Jahr 35"),
    36: ("7", "− Tilgung NBank-Darlehen (Annahme)", None, "Satz legt die NBank fest"),
    37: ("", "− Kapitaldienst Bankdarlehen", None, "gefördert nur bei Restfinanzierung"),
    38: ("8", "= Zahlungsüberschuss p. a.", None, None), 39: ("", "Einmalig: Bearbeitungsentgelte", None, "nicht in Zeile 8"),
    42: ("3.1", "Zahlungsüberschuss Jahr 10", "€", None), 43: ("3.2", "Zahlungsüberschuss Jahr 35", "€", None),
    44: ("3.3", "Zahlungsüberschuss Jahr 42", "€", None),
    45: ("3.4", "Schuldendienstdeckung (DSCR) Jahr 1", "Faktor", "Zeile 4 ÷ Kapitaldienst; nötige Miete: 8.3"),
    46: ("3.5", "DSCR Minimum Jahr 1–35", "Faktor", None), 47: ("3.6", "Jahre mit Fehlbetrag, Jahr 1–35", "Jahre", None),
    48: ("3.7", "Größter kumulierter Fehlbetrag, Jahr 1–42", "€", "ohne Zinsen"),
    49: ("3.8", "Break-even-Tilgung Jahr 1", "%", "Tilgung, bei der Zeile 8 = 0; „–“: schon ohne Tilgung negativ"),
    50: ("3.9", "Restschuld NBank Ende Jahr 35", "€", None),
    51: ("3.10", "Schlussrate NBank Jahr 42 über Regelrate", "€", "Rest wird in Jahr 42 getilgt"),
    52: ("3.11", "Restschuld Bank Ende Jahr 42", "€", "bei Laufzeit über 42 Jahre (Eingabe 6.4)"),
    63: ("4.9", "Tilgungsschwelle B gegenüber A", "%", "Rechenweg wie Broschüre S. 12"),
    64: ("4.10", "Tilgungsschwelle C gegenüber A", "%", None),
    65: ("4.11", "Tilgungsschwelle C gegenüber B", "%", None),
    66: ("4.12", "Mehrschuld gegenüber A", "€", None), 67: ("4.13", "Mehr-Sollmiete p. a.", "€", None),
    68: ("4.14", "− Mietausfall/Leerstand", "€", None), 69: ("4.15", "− Verwaltungskostenbeitrag", "€", None),
    70: ("4.16", "= Mehrüberschuss vor Tilgung", "€", "Schwelle = 4.16 ÷ 4.12"),
    71: ("4.17", "Mehrüberschuss bei Tilgung laut Eingabe 3.1", "€", "Zeile 8: B − A, C − A"),
    72: ("4.18", "Einmalig: Mehr an Bearbeitungsentgelten", "€", None),
    76: ("5.1", "Objekt-IRR nach Förderbarwert, mit Restwert", "%", "Frei ohne Förderung; Förderbarwert 1.9"),
    77: ("5.2", "Objekt-IRR nach Förderbarwert, nur Bodenwert", "%", None),
    78: ("5.3", "Objekt-IRR nach Zuschuss, mit Restwert", "%", "gefördert ohne Zinsvorteil Darlehen"),
    79: ("5.4", "Objekt-IRR ohne Zuschuss, mit Restwert", "%", "Abstand zu Frei (Marktmiete): Bindung"),
    80: ("5.5", "Objekt-IRR nach Förderbarwert, ohne Restwert", "%", _NST),
    81: ("5.6", "Objekt-IRR nach Zuschuss, nur Bodenwert", "%", None),
    82: ("5.7", "Objekt-IRR nach Zuschuss, ohne Restwert", "%", _NST),
    83: ("5.8", "Objekt-IRR ohne Zuschuss, nur Bodenwert", "%", None),
    84: ("5.9", "Objekt-IRR ohne Zuschuss, ohne Restwert", "%", _NST),
    85: ("5.10", "Hilfsgröße: Nettoanfangsrendite, statisch", "% (Jahr 1)", "ohne Zuschuss, ohne Restwert"),
    89: ("6.1", "EK-IRR, mit Restwert", "%", "Frei: Eigenmittel wie 1.11, Rest Bank"),
    90: ("6.2", "EK-IRR, nur Bodenwert", "%", _NST),
    91: ("6.3", "VOFI-EK-Rendite, mit Restwert", "%", "Kontozinsen laut Eingabe 7.2/7.3"),
    92: ("6.4", "VOFI-EK-Rendite, nur Bodenwert", "%", "„n. v.“: Endvermögen ≤ 0"),
    93: ("6.5", "Restwertanteil am Endvermögen", "%", "über 100 %: Konto nach Restschuld < 0"),
    94: ("6.6", "EK-IRR, ohne Restwert", "%", _NST), 95: ("6.7", "VOFI-EK-Rendite, ohne Restwert", "%", "„n. v.“: Endvermögen ≤ 0"),
    96: ("6.8", "Tiefster Stand Projektkonto (VOFI)", "€ (Jahr 0–42)", "negativ: Soll zu 7.3; EK-IRR: Nachschuss"),
    100: ("7.1", "Restwert (Boden + Gebäude)", "€", "nach Eingabe 8.3 und 9.4"), 101: ("7.2", "Bodenwert", "€", None),
    102: ("7.3", "Gebäudeanteil", "€", None),
    103: ("7.4", "Ertragswert Bestand gegenüber Gesamtkosten", "% (Bezug)", "bei Bezug; negativ: unter Gesamtkosten"),
    104: ("7.5", "Ertragswert Bestand", "€", "Frei: zur gerechneten Miete"),
    105: ("7.6", "Abschlag Bestandsmiete unter Zielmiete", "€", None),
    106: ("7.7", "Liegenschaftszins", "%", "Standort Neu Wulmstorf"),
    107: ("7.8", "Ertragswert Zielmiete gegenüber Gesamtkosten", "% (Bezug)", "bei Bezug; nachrichtlich"),
    110: ("8.1", "DSCR-Ziel", "Faktor", "Eingabe 10.2"),
    111: ("8.2", "Kapitaldienst Jahr 1, mit Regeltilgung", "€",
          "Zeilen 5 bis 7 und Bankdarlehen; bei Tilgungsaufschub (3.2) mit Regeltilgung NBank"),
    112: ("8.3", "Nötige Miete Jahr 1 für das DSCR-Ziel", "€/m² Monat",
          "deckt in Jahr 1 DSCR-Ziel × Kapitaldienst und die Zeilen 2 und 3; Folgejahre: 3.5"),
    113: ("8.4", "Miete Jahr 1, gerechnet", "€/m² Monat", "wie 1.18"),
    114: ("8.5", "Aufschlag Miete Jahr 1 gegenüber Marktmiete", "%", "Frei: gerechnete Miete laut Eingabe 10.1"),
    115: ("8.6", "Aufschlag nötige Miete gegenüber Marktmiete", "%",
          "Frei ohne Bankdarlehen: 8.3 deckt nur die Zeilen 2 und 3"),
    118: ("P1", "Keine Überfinanzierung bei Bezug", None, "Kasse bei Bezug in €"),
    119: ("P2", "Auswahlfelder 4.1, 4.2, 8.2 und 10.1 gültig", None, None),
    120: ("P3", "Bank: Anfangstilgung mind. 1 % (RL Nr. 5.3.6)", None, None),
    121: ("P4", "Renditen mit Restwert berechnet", None, "A, B, C und Frei; „n. v.“ bei Endvermögen ≤ 0"),
    122: ("P5", "Gebäudeanteil am Restwert positiv", None, "A, B, C und Frei (Miete laut Eingabe 10.1)"),
    123: ("P6", "Eingaben vollständig", None, None),
}
UEB_HORIZONT_ZEILEN = range(76, 108)          # Bemerkung in L
# Block 8 Miete für das DSCR-Ziel (Konzept N): Zeilen 110–115; Zeile -> Zelle auf Gefördert (None = leer) und auf Frei
UEB_BLOCK8 = {110: ("H181", "H181"), 111: ("H182", "H182"), 112: ("H183", "H183"), 113: ("H109", "H109"),
              114: (None, "H185"), 115: (None, "H186")}
# Aufschlag der gerechneten Frei-Miete als Zahl mit Text im Zahlenformat, Spalte L: Seite 1 bei Miete Jahr 1 (1.18),
# Jahresrechnung (Zeile 8) und Liquidität (3.1), Seite 2 in den Gruppenzeilen der Blöcke 5, 6 und 7; auf dem Blatt
# Frei finanziert Bezeichnung I131 und Zahl J131 (Gruppenzeile der Renditen). Vierter Abschnitt des Formats: Text „–“
# bei Marktmiete 0.
UEB_AUFSCHLAG_SEITE1 = ("L26", "L38", "L42")
UEB_AUFSCHLAG = UEB_AUFSCHLAG_SEITE1 + ("L74", "L87", "L98")
F_AUFSCHLAG_FREI = '+0.0 %;[Red]-0.0 %;"0,0 %"'
F_AUFSCHLAG = ('"Frei: Miete "0.0 %" über Marktmiete";"Frei: Miete "0.0 %" unter Marktmiete";"Frei: Miete = Marktmiete";'
               '"Frei: Marktmiete 0, Aufschlag "@')
# Abstandszeilen der Übersicht zwischen den Blöcken (Konzept G.4): 6 pt
UEB_ABSTAND, UEB_ABSTAND_HOEHE = (7, 27, 40, 53, 73, 86, 97, 108, 116), 6.0
# Seitenreserve nach der Breitenregel von Excel (Konzept G.4): mindestens so viele Punkt je Druckseite
SEITENRESERVE_MIN = 10.0
# Prüfblock (Konzept F.1): Zeilen 118–123, Status in C, Kasse bei Bezug in D118:F118, Gesamtstatus D3
PZ = 118                                      # Zeile von P1
UEB_PRUEF = list(range(PZ, PZ + 6))
# Rasterzeilen Block 4 (4.1–4.8): Spalte B enthält den Tilgungssatz als Zahl (Format „Tilgung 0,00 %“), Zeile 62 = 3.1
UEB_RASTER_ZEILEN = list(range(55, 63))
UEB_RASTER = {55 + _k: (f"4.{_k + 1}", "€", "vor Tilgung" if _k == 0 else "Volltilgung in 42 Jahren" if _k == 4
                        else "gleich Zeile 8, ohne Aufschub" if _k == 7 else None) for _k in range(8)}
for _r, (_a, _b, _c, _l) in UEB_ZEILEN.items():
    _U[f"A{_r}"] = _a
    _U[f"B{_r}"] = _b
    if _c is not None:
        _U[f"C{_r}"] = _c
    if _l is not None:
        _U[f"{'L' if _r in UEB_HORIZONT_ZEILEN else 'H'}{_r}"] = _l
for _r, (_a, _c, _l) in UEB_RASTER.items():
    _U[f"A{_r}"], _U[f"C{_r}"] = _a, _c
    if _l is not None:
        _U[f"H{_r}"] = _l
# Übersicht: eingeklappte Zeilen (Konzept D.5) und Rasterformat Block 4
UEB_EINGEKLAPPT = [(12, 12), (23, 23), (50, 52), (62, 62), (66, 72), (80, 85), (94, 95), (104, 107)]
UEB_SICHTBAR = [9, 10, 11, 13, 17, 18, 22, 24, 25, 26, 42, 49, 55, 61, 63, 64, 65, 76, 77, 78, 79, 89, 90, 91, 92, 93,
                96, 100, 101, 102, 103, 110, 111, 112, 113, 114, 115] + UEB_PRUEF
F_TILG, F_TILG_E = '"Tilgung "0.00 %', '"Tilgung "0.00 %" laut Eingabe 3.1"'

_E = BESCHRIFTUNG["Eingaben"]
_E.update({"A2": "Blaue Werte auf Gelb ändern, auch die Projektnamen in Zeile 4. Gerechnet wird nur die Spalte "
                 "„verwendet“.",
           "B3": "Aktives Projekt", "C3": "1 oder 2", "B4": "Projektname", "C4": "Text", "D4": PROJEKT_NAME["M"],
           "E4": PROJEKT_NAME["T"], "A5": "Nr.", "B5": "Eingabe", "C5": "Einheit", "D5": "Projekt 1",
           "E5": "Projekt 2", "F5": "verwendet", "G5": "Quelle Projekt 1 / Projekt 2"})
for _e in EINGABEN:
    _E[f"A{_e[1]}"] = _e[0]
    _E[f"B{_e[1]}"] = _e[3]
    _E[f"C{_e[1]}"] = _e[4]
    _E[f"G{_e[1]}"] = _e[7]

_T = BESCHRIFTUNG["Tabellen"]
_T.update({"A2": "Festwerte RL Mietwohnraum 2026 und Bewertung. Bemessungsgrenzen ab 01.10.2026 halbjährlich "
                 "fortgeschrieben (nbank.de).",
           "A42": "Kurve geeicht auf Bodenrichtwert 600 €/m²; Tarutinoer 260 €/m², Modellhaus Platzhalter; "
                  "Anpassung über Eingabe 9.3.",
           "B3": None, "D4": "A", "E4": "B", "F4": "C",
           "A5": "T1", "B5": "Darlehen, höchstens", "C5": "% der zuw. Kosten", "G5": "RL 2026 Nr. 5.3.3.1",
           "A6": "T2", "B6": "Zuschuss, höchstens", "C6": "% der zuw. Kosten", "G6": "RL 2026 Nr. 5.3.3.2"})
del _T["B3"]
for _i, _m in enumerate(MIETENSTUFEN):
    _T[f"A{9 + _i}"] = f"T{3 + _i}"
    _T[f"B{9 + _i}"] = _m
    _T[f"G{9 + _i}"] = "RL 2026 Nr. 5.3.2.2 (Ausgangswert 01.07.2026), 5.4.4"
for _t in TAB3:
    _T[f"A{_t[0]}"], _T[f"B{_t[0]}"], _T[f"C{_t[0]}"], _T[f"G{_t[0]}"] = _t[1], _t[2], _t[3], _t[4]
for _i in range(6):
    _T[f"A{36 + _i}"] = f"T{26 + _i}"
    _T[f"C{36 + _i}"] = "Jahre"
    _T[f"G{36 + _i}"] = LZ_QUELLE
TAB_TITEL = {3: "1 Förderquoten", 7: "2 Mietenstufen", 16: "3 Festwerte RL 2026 und ImmoWertV",
             34: "4 Bewertung, Standort Neu Wulmstorf"}

_N = BESCHRIFTUNG["NBank"]
_N.update({"A2": "Die NBank rechnet selbst (RL Nr. 11.10). Die Werte sind eine interne Orientierung.",
           "B3": "Projekt", "A5": "N1", "B5": "Swapsatz 30 Jahre", "C5": "%", "G5": "Eingabe 3.4",
           "A6": "N2", "B6": "Aufschlag", "C6": "Prozentpunkte", "G6": "RL 2026 Nr. 11.10 Abs. 4",
           "A7": "N3", "B7": "Orientierungswert", "C7": "%",
           "B10": "Primärgröße VOFI (RL Nr. 11.10 Abs. 3)", "B13": "Gegenrechnung EK-IRR (DAWI Art. 6 Abs. 1)",
           "B16": "nachrichtlich",
           "D8": "Rendite", "G8": "Lage zum Orientierungswert", "G9": "A", "H9": "B", "I9": "C",
           "A33": "„über“: Die NBank prüft den angemessenen Gewinn ergänzend (RL Nr. 11.10 Abs. 4); "
                  "Gleichstand gilt als „unter“.",
           "A34": "Horizont, Wiederanlage, Restwert und Swap-Stichtag legt die NBank fest.",
           "A35": "Barwertvorteil: Darlehen nach Entgelt abzüglich Barwert von Zins, Tilgung und VKB zum Zins "
                  "laut Eingabe 6.1.",
           "A36": "EK-IRR nur Bodenwert und ohne Restwert: mehrere Nullstellen möglich; VOFI-EK-Rendite maßgeblich."})
# NBank-Matrix: Zeile -> (Nr., Bezeichnung, Horizont, Zeile auf Gefördert)
NB_MATRIX = {11: ("N4", "VOFI-EK-Rendite, mit Restwert", 35, 143), 12: ("N5", "VOFI-EK-Rendite, mit Restwert", 42, 143),
             14: ("N6", "EK-IRR, mit Restwert", 35, 140), 15: ("N7", "EK-IRR, mit Restwert", 42, 140),
             17: ("N8", "VOFI-EK-Rendite, nur Bodenwert", 35, 144),
             18: ("N9", "VOFI-EK-Rendite, nur Bodenwert", 42, 144),
             19: ("N10", "EK-IRR, nur Bodenwert", 35, 141), 20: ("N11", "EK-IRR, nur Bodenwert", 42, 141),
             21: ("N12", "VOFI-EK-Rendite, ohne Restwert", 35, 145),
             22: ("N13", "VOFI-EK-Rendite, ohne Restwert", 42, 145),
             23: ("N14", "EK-IRR, ohne Restwert", 35, 142), 24: ("N15", "EK-IRR, ohne Restwert", 42, 142)}
for _r, (_a, _b, _h, _z) in NB_MATRIX.items():
    _N[f"A{_r}"], _N[f"B{_r}"] = _a, _b
NB_BEZUG = {27: ("N16", "Eigenkapital (Grundstück + bar)", "H106"), 28: ("N17", "NBank-Darlehen, Nennwert", "H99"),
            29: ("N18", "Zuschuss nach Bearbeitungsentgelt", "H108"),
            30: ("N19", "Barwertvorteil Darlehen zum Vergleichszins", "H168"),
            31: ("N20", "Ausgleichsleistung, Barwert", None)}
for _r, (_a, _b, _z) in NB_BEZUG.items():
    _N[f"A{_r}"], _N[f"B{_r}"], _N[f"C{_r}"] = _a, _b, "€"

HINWEISE = [
    "Zweck: Wirtschaftlichkeit geförderter Mietwohnungen nach RL Mietwohnraum 2026, Programmteil 2.1; Gruppen A, B, C "
    "und frei finanziert.",
    "Bedienung: Projekt auf „Eingaben“ wählen (1 oder 2), nur blaue Werte auf Gelb ändern, Ergebnisse auf „Übersicht“; "
    "weitere Zeilen über +.",
    "Konventionen: vor Steuern, nominal, jährlich nachschüssig; T0 = Bezugsfertigkeit; Zeitreihen mit Auszahlungen "
    "negativ.",
    "Bauphase nicht abgebildet: Kosten, Eigenkapital, Entgelte und Verwaltungskostenbeitrag (RL Nr. 12.7.1) erst ab "
    "Bezug; alle Renditen eher zu hoch.",
    "Kostenstand: Die Sätze 5.2 und 5.3 (Stand 2026) gelten in Jahr 1, Steigerung ab Jahr 2; Eingabe 5.5 schreibt sie "
    "um Jahre fort.",
    "Mieten: Höchstmiete (höchstens Marktmiete) in Jahr 1–3, dann alle 3 Jahre +6,15 % (ab Jahr 36 Kappungsgrenze) "
    "bis zur Vergleichsmiete; je m² ungerundet. Frei finanziert: Marktmiete wie bei Neuvermietung, ohne Grenze nach "
    "§ 558 BGB; der Frei-IRR zur Marktmiete liegt dadurch rund 0,4–0,5 Prozentpunkte höher. Eingabe 10.1 rechnet "
    "frei wahlweise mit der Miete, die in Jahr 1 das DSCR-Ziel (Eingabe 10.2) erreicht; Aufschlag auf die Marktmiete: "
    "Übersicht 1.18 und 8.5. Jahresrechnung, Renditen und Restwert frei zu dieser Miete nur zusammen mit dem "
    "Aufschlag nennen.",
    "Finanzierung: Eigenkapital = Grundstück (Sacheinlage) + bar; Bank nur für die Lücke; NBank-Darlehen 0 % bis "
    "Jahr 35, linear, Rest in Jahr 42. Frei finanziert: Mindest-Eigenmittel wie gefördert zuzüglich Eingabe 7.1, "
    "der Rest als Bankdarlehen zu den Konditionen der Eingaben 6.1 bis 6.4; gefördert nimmt 7.1 nur bis zur Höhe "
    "des Bankdarlehens auf.",
    "Restwert: Ertragswert im Stichjahr; Bestandsmiete je 3 Jahre höchstens um die Kappungsgrenze, bis Jahr 42 bis zur "
    "Vergleichs-, dann Zielmiete.",
    "Restwert-Varianten: mit Restwert = Boden + Gebäude; nur Bodenwert = ohne Gebäudeanteil; ohne Restwert = 0.",
    "Objekt-IRR ohne Finanzierung: ohne Zuschuss, nach Zuschuss, nach Förderbarwert (Zuschuss + Barwertvorteil "
    "Darlehen zum Zins 6.1).",
    "IRR bei mehreren Nullstellen: größte mit fallendem Barwert, maßgeblich dann die VOFI-EK-Rendite. „n. v.“: keine "
    "Lösung gefunden, Endvermögen ≤ 0 oder gesperrt (P1). Fehlbeträge über Jahre: Der EK-IRR rechnet sie als Nachschuss zum internen Zins, die "
    "VOFI-EK-Rendite führt sie zum Sollzins 7.3 und bezieht auf das Eigenkapital bei Bezug; maßgeblich ist dann die "
    "VOFI-EK-Rendite.",
    "Nach außen: Jahresrechnung, Tilgungsvergleich, Annahmen. Renditen nur in der Beratung, als Paar mit Restwert / "
    "nur Bodenwert und Restwertanteil.",
    "Bandbreite zu jeder Rendite in der Beratung: Eingabe 9.3 ±0,5 %, 9.4 = 0,50, 8.3 = 5 %, 8.2 = Vergleichsmiete.",
    "Nicht nach außen: Blatt NBank, Renditen ohne Paar, Platzhalter (Modellhaus: Mieten 4.3/4.4, Liegenschaftszins "
    "Neu Wulmstorf).",
    "Tarutinoer: Grundstück 0 € wie Vorgängermappe; Renditen ohne Grundstückskosten, nur Bodenwert = ohne Restwert; "
    "nicht mit Modellhaus vergleichbar.",
]
for _i, _t in enumerate(HINWEISE):
    BESCHRIFTUNG["Hinweise"][f"B{3 + _i}"] = _t

# Gefördert: Kopf, Spaltenköpfe, Blockbeschriftungen (Spalte A) und Einheiten (Spalte G)
_GK = {"A2": "Gruppe", "A3": "€ p. a.; Mieten in €/m² Monat; Auszahlungen negativ; ab Jahr 43 nur Werte für den Restwert.",
       "Y131": "Nullstellensuche IRR", "Y172": "Nullstellensuche IRR",
       **{f"{_s}{_z}": _t for _z in (132, 173) for _s, _t in zip(("Y", "Z", "AA", "AB"),
          ("Jahr 35: erster Treffer", "Jahr 35: zweiter Versuch", "Jahr 42: erster Treffer", "Jahr 42: zweiter Versuch"))},
       "A4": "Zeit", "C4": "Miete", "G4": "Ertrag und Bewirtschaftung", "L4": "Kapitaldienst", "R4": "Ergebnis",
       "T4": "Bestände Jahresende", "X4": "Restwert", "Y4": "Zahlungsreihen für IRR"}
_KOEPFE = ["t", "Jahr", "Vergleichsmiete", "Marktmiete", "Zielmiete", "Miete (gebunden, ab Jahr 36 Bestand)", "Sollmiete",
           "Mietausfall/ Leerstand", "Objektverwaltung", "Instandhaltung", "Überschuss vor Kapitaldienst",
           "Verwaltungskostenbeitrag", "Zins NBank", "Tilgung NBank", "Zins Bank", "Tilgung Bank", "Kapitaldienst",
           "Zahlungsüberschuss", "DSCR", "Restschuld NBank", "Restschuld Bank", "Projektkonto (VOFI)",
           "Zahlungsüberschuss kumuliert", "Überschuss zur Zielmiete (Restwert)",
           "Objekt ohne Zuschuss, ohne Restwert", "Objekt ohne Zuschuss, mit Restwert, Jahr 35",
           "Objekt ohne Zuschuss, nur Bodenwert, Jahr 35", "Objekt ohne Zuschuss, mit Restwert, Jahr 42",
           "Objekt ohne Zuschuss, nur Bodenwert, Jahr 42", "Objekt nach Zuschuss, ohne Restwert",
           "Objekt nach Zuschuss, mit Restwert, Jahr 35", "Objekt nach Zuschuss, nur Bodenwert, Jahr 35",
           "Objekt nach Zuschuss, mit Restwert, Jahr 42", "Objekt nach Zuschuss, nur Bodenwert, Jahr 42",
           "Eigenkapital, ohne Restwert, Jahr 42", "Eigenkapital, ohne Restwert, Jahr 35",
           "Eigenkapital, mit Restwert, Jahr 35", "Eigenkapital, nur Bodenwert, Jahr 35",
           "Eigenkapital, mit Restwert, Jahr 42", "Eigenkapital, nur Bodenwert, Jahr 42",
           "Objekt, Förderbarwert, ohne Restwert", "Objekt, Förderbarwert, mit Restwert, Jahr 35",
           "Objekt, Förderbarwert, nur Bodenwert, Jahr 35", "Objekt, Förderbarwert, mit Restwert, Jahr 42",
           "Objekt, Förderbarwert, nur Bodenwert, Jahr 42"]
for _i, _k in enumerate(_KOEPFE):
    _GK[f"{get_column_letter(1 + _i)}5"] = _k
GEF_BLOCK = {
    88: ("Finanzierung bei Bezug", None), 90: ("Herstellungskosten KG 200–700, angesetzt", "€"),
    91: ("Finanzierungskosten KG 800", "€"), 92: ("Grundstück (Sacheinlage)", "€"), 93: ("Gesamtkosten", "€"),
    94: ("Objektinvestition (ohne KG 800)", "€"), 95: ("Bemessungsgrenze", "€/m²"),
    96: ("Zuwendungsfähige Kosten", "€"), 97: ("Darlehensquote", "%"), 98: ("Zuschussquote", "%"),
    99: ("NBank-Darlehen", "€"), 100: ("Zuschuss", "€"), 101: ("Bearbeitungsentgelte", "€"),
    102: ("Eigenmittel bar (20 % abzüglich Grundstück)", "€"), 103: ("Bankdarlehen (Restfinanzierung)", "€"),
    104: ("Bares Eigenkapital, inkl. Entgelte", "€"), 105: ("Kasse bei Bezug", "€"),
    106: ("Eigenkapital (Grundstück + bar)", "€"), 107: ("Eigenmittelquote, ohne Entgelte", "%"),
    108: ("Zuschuss nach Bearbeitungsentgelt", "€"), 109: ("Miete Jahr 1", "€/m² Monat"),
    110: ("Tilgungsrate NBank", "€ p. a."), 111: ("Annuität Bank", "€ p. a."),
    112: ("Restschuld Bank Ende Zinsbindung", "€"), 113: ("Anfangstilgung Bankdarlehen", "%"),
    114: ("Annuität Bank nach Zinsbindung", "€ p. a."),
    116: ("Restwert (Ertragswert)", None), 118: ("Stichjahr", "Jahr"), 119: ("Restnutzungsdauer", "Jahre"),
    120: ("Liegenschaftszins", "%"), 121: ("Bodenwert", "€"), 122: ("Ertragswert zur Zielmiete", "€"),
    123: ("Ertragswert Bestand", "€"), 124: ("Abschlag Bestandsmiete unter Zielmiete", "€"),
    125: ("Gebäudeanteil", "€"), 126: ("Restwert (Boden + Gebäude)", "€"), 127: ("Restwert nur Bodenwert", "€"),
    128: ("Ertragswert Bestand gegenüber Gesamtkosten", "%"), 129: ("Ertragswert Zielmiete gegenüber Gesamtkosten", "%"),
    131: ("Renditen vor Steuern", None), 133: ("Objekt-IRR nach Zuschuss, mit Restwert", None),
    134: ("Objekt-IRR nach Zuschuss, nur Bodenwert", None), 135: ("Objekt-IRR nach Zuschuss, ohne Restwert", None),
    136: ("Objekt-IRR ohne Zuschuss, mit Restwert", None), 137: ("Objekt-IRR ohne Zuschuss, nur Bodenwert", None),
    138: ("Objekt-IRR ohne Zuschuss, ohne Restwert", None), 139: ("Hilfsgröße: Nettoanfangsrendite, statisch", None),
    140: ("EK-IRR, mit Restwert", None), 141: ("EK-IRR, nur Bodenwert", None), 142: ("EK-IRR, ohne Restwert", None),
    143: ("VOFI-EK-Rendite, mit Restwert", None), 144: ("VOFI-EK-Rendite, nur Bodenwert", None),
    145: ("VOFI-EK-Rendite, ohne Restwert", None), 146: ("Endvermögen VOFI, mit Restwert", None),
    147: ("Endvermögen VOFI, nur Bodenwert", None), 148: ("Endvermögen VOFI, ohne Restwert", None),
    149: ("Restwertanteil am Endvermögen", None), 150: ("Projektkonto (VOFI)", None),
    151: ("Restschuld NBank und Bank", None), 153: ("Liquidität", None),
    155: ("Zahlungsüberschuss Jahr 1", "€"), 156: ("DSCR Jahr 1", "Faktor"),
    157: ("DSCR Minimum Jahr 1–35", "Faktor"), 158: ("Jahre mit Fehlbetrag, Jahr 1–35", "Jahre"),
    159: ("Größter kumulierter Fehlbetrag, Jahr 1–42", "€"), 160: ("Zahlungsüberschuss vor NBank-Tilgung, Jahr 1", "€"),
    161: ("Break-even-Tilgung Jahr 1", "%"), 162: ("Restschuld NBank Ende Jahr 35", "€"),
    163: ("Summe Tilgung NBank", "€"), 164: ("Schlussrate NBank über Regelrate", "€"),
    165: ("Zahlungsüberschuss Jahr 10", "€"), 166: ("Zahlungsüberschuss Jahr 35", "€"),
    167: ("Zahlungsüberschuss Jahr 42", "€"), 168: ("Barwertvorteil NBank-Darlehen", "€"),
    169: ("Tiefster Stand Projektkonto (VOFI)", "€"), 170: ("Restschuld Bank Ende Jahr 42", "€"),
    172: ("Förderbarwert und Objektrendite", None), 174: ("Förderbarwert (Zuschuss + Barwertvorteil)", "€"),
    175: ("Objekt-IRR nach Förderbarwert, mit Restwert", "%"), 176: ("Objekt-IRR nach Förderbarwert, nur Bodenwert", "%"),
    177: ("Objekt-IRR nach Förderbarwert, ohne Restwert", "%"),
    179: ("Miete für das DSCR-Ziel", None), 181: ("DSCR-Ziel", "Faktor"), 182: ("Kapitaldienst Jahr 1, mit Regeltilgung", "€"),
    183: ("Nötige Miete Jahr 1 für das DSCR-Ziel", "€/m² Monat"),
}
for _r, (_a, _u) in GEF_BLOCK.items():
    _GK[f"A{_r}"] = _a
    if _u:
        _GK[f"G{_r}"] = _u
for _g_ in GRUPPEN:
    BESCHRIFTUNG[GEF[_g_]] = dict(_GK, B2=_g_)
_F = BESCHRIFTUNG[FREI]
# Frei finanziert (Konzept D.4, N): Zeitreihe A–Q, Zahlungsreihen R–AB, Blöcke in den Zeilen der Blätter Gefördert
FREI_KOEPFE = ["t", "Jahr", "Marktmiete", "Miete gerechnet", "Sollmiete", "Mietausfall/ Leerstand", "Objektverwaltung",
               "Instandhaltung", "Überschuss vor Kapitaldienst", "Zins Bank", "Tilgung Bank", "Kapitaldienst",
               "Zahlungsüberschuss", "DSCR", "Restschuld Bank", "Projektkonto (VOFI)", "Zahlungsüberschuss kumuliert",
               "Objekt, ohne Restwert", "Objekt, mit Restwert, Jahr 35", "Objekt, nur Bodenwert, Jahr 35",
               "Objekt, mit Restwert, Jahr 42", "Objekt, nur Bodenwert, Jahr 42",
               "Eigenkapital, ohne Restwert, Jahr 42", "Eigenkapital, ohne Restwert, Jahr 35",
               "Eigenkapital, mit Restwert, Jahr 35", "Eigenkapital, nur Bodenwert, Jahr 35",
               "Eigenkapital, mit Restwert, Jahr 42", "Eigenkapital, nur Bodenwert, Jahr 42"]
for _i, _k in enumerate(FREI_KOEPFE):
    _F[f"{get_column_letter(1 + _i)}5"] = _k
_F.update({"A3": _GK["A3"], "A4": "Zeit", "C4": "Miete", "E4": "Ertrag und Bewirtschaftung", "J4": "Kapitaldienst",
           "M4": "Ergebnis", "O4": "Bestände Jahresende", "R4": "Zahlungsreihen für IRR", "AC5": ""})
# Zeilen mit derselben Bezeichnung und Einheit wie Gefördert
FREI_WIE_GEF = [88, 90, 91, 92, 93, 94, 95, 96, 102, 103, 105, 106, 109, 111, 112, 113, 114, 116, 118, 119, 120, 121, 125,
                126, 127, 131, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 153, 155, 156, 157, 158, 159,
                165, 166, 167, 169, 170, 179, 181, 182, 183]
for _r in FREI_WIE_GEF:
    _F[f"A{_r}"] = GEF_BLOCK[_r][0]
    if GEF_BLOCK[_r][1]:
        _F[f"G{_r}"] = GEF_BLOCK[_r][1]
# Zeilen ohne Inhalt auf Frei (NBank-Größen, Dubletten, Förderbarwert): leer und ausgeblendet
FREI_LEER = [97, 98, 99, 100, 101, 108, 110, 123, 124, 129, 133, 134, 135, 160, 161, 162, 163, 164, 168, 172, 173, 174,
             175, 176, 177, 178]
_F.update({f"A{_r}": "" for _r in FREI_LEER})
_F.update({"A104": "Bares Eigenkapital, inkl. KG 800", "G104": "€", "A107": "Eigenmittelquote (zuwendungsfähige Kosten)", "G107": "%",
           "A122": "Ertragswert zur gerechneten Miete", "G122": "€",
           "A128": "Ertragswert gegenüber Gesamtkosten", "G128": "%",
           "A136": "Objekt-IRR, mit Restwert", "A137": "Objekt-IRR, nur Bodenwert", "A138": "Objekt-IRR, ohne Restwert",
           "A151": "Restschuld Bank", "A184": "Marktmiete Jahr 1", "G184": "€/m² Monat",
           "A185": "Aufschlag Miete Jahr 1 gegenüber Marktmiete", "G185": "%",
           "A186": "Aufschlag nötige Miete gegenüber Marktmiete", "G186": "%", "R131": "Nullstellensuche IRR",
           "I116": "Aufschlag Miete gegenüber Marktmiete", "I131": "Aufschlag Miete gegenüber Marktmiete",
           **{f"{_s}132": _t for _s, _t in zip("RSTU", ("Jahr 35: erster Treffer", "Jahr 35: zweiter Versuch",
                                                       "Jahr 42: erster Treffer", "Jahr 42: zweiter Versuch"))}})


# =====================================================================================================
# 4. Sollwerte aus der Referenzrechnung (importiert, unverändert)
# =====================================================================================================
RR = None
ANN = None
BASIS = {}


def lade_referenz():
    global RR, ANN
    sys.dont_write_bytecode = True                 # nichts in vofi-pruefung/ schreiben
    sys.path.insert(0, str(PRUEF_DIR))
    import referenzrechnung as rr  # noqa: E402
    sys.path.remove(str(PRUEF_DIR))
    RR = rr
    ANN = rr.Annahmen(str(PRUEF_DIR / "annahmen.json"))
    pb = rr.parameter_broschuere(ANN)
    pb["ovm_start"], pb["markt_start"] = 12.92, 14.48           # Abweichung A7 (Konzept D.2)
    BASIS["M"], BASIS["T"] = pb, rr.parameter_referenzprojekt(ANN)


def standard_eingaben(proj):
    P = BASIS[proj]
    return {e[0]: (e[8] if proj == "M" else e[9])(P) for e in EINGABEN}


def pmt(i, n, pv):
    if pv <= 0 or n <= 0:
        return 0.0
    return pv / n if i == 0 else pv * i / (1 - (1 + i) ** (-n))


def restschuld(i, m, ann, pv):
    if pv <= 0:
        return 0.0
    if i == 0:
        return max(0.0, pv - ann * m)
    return max(0.0, pv * (1 + i) ** m - ann * ((1 + i) ** m - 1) / i)


# Übersicht Block 5–7: Zeile -> Zeile auf Gefördert (I = Jahr 35, J = Jahr 42) bzw. Spalte H (Bezug, Jahr 1)
UEB_QUELLE_IJ = {76: 175, 77: 176, 78: 133, 79: 136, 80: 177, 81: 134, 82: 135, 83: 137, 84: 138,
                 89: 140, 90: 141, 91: 143, 92: 144, 93: 149, 94: 142, 95: 145,
                 100: 126, 101: 121, 102: 125, 104: 123, 105: 124, 106: 120}
UEB_QUELLE_H = {85: "H139", 96: "H169", 103: "H128", 107: "H129"}
# Frei-Spalten G/K: Zeile -> Zeile auf Frei finanziert (Frei in allen Objekt-IRR-Zeilen 5.1–5.9, Runde 2 F1;
# Block 6 EK-Rendite mit Frei, Konzept N; 7.5 Ertragswert = Ertragswert zur gerechneten Miete, Zeile 122)
UEB_FREI_IJ = {76: 136, 77: 137, 78: 136, 79: 136, 80: 138, 81: 137, 82: 138, 83: 137, 84: 138,
               89: 140, 90: 141, 91: 143, 92: 144, 93: 149, 94: 142, 95: 145,
               100: 126, 101: 121, 102: 125, 104: 122, 106: 120}
# Frei-Spalte G in Block 1 und 3: Zeile -> Zelle auf Frei finanziert
UEB_FREI_H = {9: "H93", 18: "H103", 19: "H106", 20: "H107", 22: "H106", 23: "H104", 26: "H109",
              42: "H165", 43: "H166", 44: "H167", 45: "H156", 46: "H157", 47: "H158", 48: "H159", 52: "H170"}


class Soll:
    """Sollwerte eines Laufs: Eingaben -> RR-Parameter (Konvention RR, Lauf SAUBER), Bankpfad nach F8."""

    def __init__(self, proj, aenderungen):
        self.proj = proj
        e = standard_eingaben(proj)
        e.update(aenderungen)
        self.e = e
        P = copy.deepcopy(BASIS[proj])
        P.update(fj=int(e["1.1"]), wfl=float(e["1.2"]), we=e["1.3"], kg800=float(e["2.2"]),
                 grundstueck=float(e["2.3"]), grundstueck_nk=0.0,
                 herstellung=float(e["2.1"]) * float(e["1.2"]) * float(e["9.1"]),
                 zins_ab36=e["3.3"], swap=e["3.4"], mietenstufe=e["4.1"],
                 effizienz="EH 40" if e["4.2"] == "ja" else "EH 55",
                 ovm_start=e["4.3"] * e["9.2"], markt_start=e["4.4"] * e["9.2"], miet_wachstum=e["4.5"],
                 kapp_norm=e["4.6"], kapp_ang=e["4.6"], mietausfall=e["5.1"], mietausfall_frei=e["5.1"],
                 verwaltung_we=e["5.2"], instandhaltung_qm=e["5.3"], kosten_wachstum=e["5.4"],
                 zins_bank=e["6.1"], zinsbindung=min(int(e["6.2"]), 29), zins_anschluss=e["6.3"], prolongation=2,
                 haben=e["7.2"], soll=e["7.3"], bodenwert_wachstum=e["8.1"], lz_zuschlag=0.0)
        brw, gfl = float(e["2.4"]), float(e["2.5"])
        P["brw"], P["gfl"] = (brw if brw * gfl > 0 else None), gfl
        RR.finalisiere(P)
        P["startmiete"] = {g: min(v, P["markt_start"]) for g, v in P["startmiete"].items()}   # H109: höchstens Marktmiete
        self.P = P
        self.opt = dict(tilgungssatz=e["3.1"], tilgungsfrei=int(e["3.2"]), kosten_offset=int(e["5.5"]),
                        zielmiete="markt" if e["8.2"] == "Marktmiete" else "ovm", vk=e["8.3"], lz_delta=e["9.3"],
                        rw_faktor=e["9.4"])
        self.Z = P["zuwendungsfaehig"]
        self.min_em = max(0.0, P["eigenmittel_quote"] * self.Z - P["grundstueck"])
        self.laufzeit_bank = int(e["6.4"])
        # Die RR rechnet die Bank fest über 30 Jahre und teilt bei Zinsbindung ≥ 30 Jahre durch die Restlaufzeit 0.
        # Sie läuft dann mit Zinsbindung 29 Jahre; der Bankpfad kommt in diesem Fall wie bei Laufzeit ≠ 30 Jahre aus
        # der geschlossenen Rechnung (bank_param, bank_reihe) mit der Zinsbindung laut Eingabe 6.2.
        self.zinsbindung = int(e["6.2"])
        self.bank_rr = self.laufzeit_bank == 30 and self.zinsbindung < 30
        self.l = {g: self.lauf(g) for g in GRUPPEN}
        self.dscr_ziel = float(e["10.2"])
        self.l["M"] = self.lauf_frei()
        self.bank = any(self.l[g].bank0 > 0 for g in GRUPPEN)
        self.bank_geschlossen = self.bank and not self.bank_rr          # RR rechnet nur 30 Jahre (A9)
        self.rw = {g: {H: self.l[g].restwert(H) for H in (0, 35, 42)} for g in GRUPPEN + ("M",)}

    def luecke(self, g):
        P = self.P
        D, Zu = P["quote_d"][g] * self.Z, P["quote_z"][g] * self.Z
        return round(P["herstellung"] - D - Zu - self.min_em - self.e["7.1"], 2)

    def lauf(self, g, **extra):
        opt = dict(self.opt, **extra)
        P = self.P
        if self.luecke(g) > 0 and self.Z > 0:
            D, Zu = P["quote_d"][g] * self.Z, P["quote_z"][g] * self.Z
            P2 = dict(P)
            P2["eigenmittel_quote"] = (D * P["be_d"] + Zu * P["be_z"] + self.min_em + self.e["7.1"] + P["kg800"]) / self.Z
            return RR.Lauf(P2, g, ek_modell=True, **opt)
        return RR.Lauf(P, g, **opt)

    # ------------------------------------------------------------------ Frei finanziert (Konzept N)
    def kd1_bank(self, B):
        """Kapitaldienst Bank Jahr 1 (Zins + Tilgung) für ein Darlehen B zu den Konditionen 6.1/6.4."""
        i = self.P["zins_bank"]
        return B * i + max(0.0, min(pmt(i, self.laufzeit_bank, B) - B * i, B))

    def noetige_miete(self, kd1):
        """Nötige Miete Jahr 1 für das DSCR-Ziel: (Ziel × Kapitaldienst Jahr 1 + Objektverwaltung + Instandhaltung
        Jahr 1) ÷ ((1 − Mietausfall) × Wohnfläche × 12)."""
        P = self.P
        vw, ih = self.kosten(1)
        return (self.dscr_ziel * kd1 + vw + ih) / ((1 - P["mietausfall"]) * P["wfl"] * P["monate"])

    def lauf_frei(self):
        """RR.Lauf "M" mit der Finanzierung laut Konzept N: bares Eigenkapital = Mindest-Eigenmittel in Geld +
        Zusatz-EK + KG 800, Bank = Herstellungskosten − Mindest-Eigenmittel in Geld − Zusatz-EK (Kasse 0); die Miete
        ist die Marktmiete oder (Eingabe 10.1) die nötige Miete für das DSCR-Ziel als Marktmiete der Parameterkopie."""
        P, e = self.P, self.e
        PM = dict(P)
        self.frei_bank = max(0.0, round(P["herstellung"] - self.min_em - e["7.1"], 2))
        self.frei_kd1 = self.kd1_bank(self.frei_bank)
        self.frei_noetig = self.noetige_miete(self.frei_kd1)
        self.frei_dscr_miete = e["10.1"] != "Marktmiete"        # wie die Mappe: alles außer „Marktmiete“
        if self.frei_dscr_miete:
            PM["markt_start"] = self.frei_noetig
        if self.frei_bank > 0 and self.Z > 0:
            PM["eigenmittel_quote"] = (self.min_em + e["7.1"] + P["kg800"]) / self.Z
            return RR.Lauf(PM, "M", ek_modell=True, **self.opt)
        return RR.Lauf(PM, "M", **self.opt)

    def frei_reihen(self):
        """Zeitreihen frei t = 0 … 42: Überschuss vor Kapitaldienst aus der RR; Bank, Zahlungsüberschuss und
        Projektkonto aus der RR bei Laufzeit 30 Jahre (dort gegen die geschlossene Bankrechnung geprüft), sonst
        geschlossen (RR rechnet nur 30 Jahre, A9)."""
        l, P, n = self.l["M"], self.P, self.P["n"]
        L, br = l.L, self.bank_reihe("M")
        if self.bank_rr:
            for t in range(1, n + 1):
                if abs(L["BZINS"][t] - br[t][0]) > 0.01 or abs(L["BTILG"][t] - br[t][1]) > 0.01 \
                        or abs(L["W"][t] - br[t][2]) > 0.01:
                    raise ValueError(f"Frei: Bankpfad RR ungleich geschlossene Rechnung in Jahr {t}")
            return dict(RE=L["RE"], BZ=L["BZINS"], BT=L["BTILG"], KD=L["KD"], ZUE=L["ZUE"], W=L["W"], KONTO=L["KONTO"])
        out = {k: [0.0] * (n + 1) for k in ("BZ", "BT", "KD", "ZUE", "W", "KONTO")}
        out["RE"], out["W"][0] = L["RE"], l.bank0
        for t in range(1, n + 1):
            bz, bt, w = br[t]
            out["BZ"][t], out["BT"][t], out["KD"][t], out["W"][t] = bz, bt, bz + bt, w
            out["ZUE"][t] = L["RE"][t] - bz - bt
            k = out["KONTO"][t - 1]
            out["KONTO"][t] = k * (1 + (P["haben"] if k >= 0 else P["soll"])) + out["ZUE"][t]
        return out

    # ------------------------------------------------------------------ Hilfsgrößen
    def ziel(self, l, t):
        return l.markt(t) if self.opt["zielmiete"] == "markt" else l.ovm(t)

    def mietpfad(self, g):
        """Miete t = 1 … GND: bis 42 aus der RR, danach mit RR._miete bis zur Zielmiete."""
        l, n = self.l[g], self.P["n"]
        c = {t: l.L["C"][t] for t in range(1, n + 1)}
        for t in range(n + 1, self.P["gnd"] + 1):
            c[t] = l._miete(t, c[t - 1], cap=self.ziel(l, t)) if l.gef else l.markt(t)
        return c

    def kosten(self, t):
        P = self.P
        f = (1 + P["kosten_wachstum"]) ** (t - 1 + self.opt["kosten_offset"])
        return P["verwaltung_we"] * P["we"] * f, P["instandhaltung_qm"] * P["wfl"] * f

    def a2_greift(self, g, H):
        """Abweichung A2: RR-Mietpfad H+1 … 42 mit Obergrenze Zielmiete statt Vergleichsmiete."""
        l = self.l[g]
        if not l.gef:
            return False
        c = l.L["C"][H] if H > 0 else 0.0
        for s in range(H + 1, self.P["n"] + 1):
            c = l._miete(s, c, cap=self.ziel(l, s))
            if abs(c - l.L["C"][s]) > 1e-9:
                return True
        return False

    def i0(self, g, art):
        """Investition in t = 0: brutto, nach Zuschuss (nZ) oder nach Förderbarwert (fbw, Runde 2 F1:
        Zuschuss netto + Barwertvorteil Darlehen zum Vergleichszins 6.1, RR.foerderbarwert)."""
        P, l = self.P, self.l[g]
        i0 = P["grundstueck"] + P["herstellung"]            # Abweichung A1: ohne KG 800
        if art == "brutto":
            return i0
        if art == "fbw":
            return i0 - l.foerderbarwert(P["zins_bank"])["gesamt"]
        return i0 - (l.Zu - l.Zu * P["be_z"])

    def cf_obj(self, g, art, H, v):
        l = self.l[g]
        cf = [(0, -self.i0(g, art))] + [(t, l.L["RE"][t]) for t in range(1, H + 1)]
        cf[-1] = (H, cf[-1][1] + self.rw[g][H][v])
        return cf

    def cf_ek(self, g, H, v):
        l = self.l[g]
        rest = l.L["R"][H] + l.L["W"][H]
        cf = [(0, -l.EK + l.kasse0)] + [(t, l.L["ZUE"][t]) for t in range(1, H + 1)]
        cf[-1] = (H, cf[-1][1] + self.rw[g][H][v] - rest)
        return cf

    def irr(self, cf):
        return ("irr", RR.irr(cf), cf)

    def vofi(self, g, H, v):
        l = self.l[g]
        ev = l.L["KONTO"][H] + self.rw[g][H][v] - (l.L["R"][H] + l.L["W"][H])
        return ev, ((ev / l.EK) ** (1 / H) - 1 if ev > 0 and l.EK > 0 else None)

    def bank_param(self, g):
        l, P = self.l[g], self.P
        B, i, n, zb, za = l.bank0, P["zins_bank"], self.laufzeit_bank, self.zinsbindung, P["zins_anschluss"]
        ann = pmt(i, n, B)
        rest_zb = restschuld(i, min(zb, n), ann, B) if B > 0 else 0.0
        anf = ann / B - i if B > 0 else 0.0
        annp = 0.0 if rest_zb < 1 else (rest_zb if n <= zb else pmt(za, n - zb, rest_zb))
        return dict(B=B, ann=ann, rest_zb=rest_zb, anf=anf, annp=annp, i=i, za=za, zb=zb, n=n)

    def bank_reihe(self, g):
        """Geschlossene Bankrechnung (für Laufzeiten ≠ 30 Jahre): Zins, Tilgung, Restschuld je Jahr."""
        b = self.bank_param(g)
        w, out = b["B"], {0: (0.0, 0.0, b["B"])}
        for t in range(1, self.P["n"] + 1):
            bz = w * (b["i"] if t <= b["zb"] else b["za"])
            bt = max(0.0, min((b["ann"] if t <= b["zb"] else b["annp"]) - bz, w))
            w = max(0.0, w - bt)
            out[t] = (bz, bt, w)
        return out

    def sperre(self, g):
        return self.l[g].kasse0 >= 1

    # ------------------------------------------------------------------ Soll je Blatt Gefördert x
    def gefoerdert(self, g):
        """{Zelle: Spezifikation} für 'Gefördert g'. Spezifikation: (art, wert[, cf])."""
        P, l, n = self.P, self.l[g], self.P["n"]
        L, s = l.L, {}
        geschl = self.bank_geschlossen
        bankr = self.bank_reihe(g) if geschl else None
        fin = not geschl                       # finanzierungsabhängige Größen gegen RR
        c = self.mietpfad(g)
        ma = P["mietausfall"]
        wfl = P["wfl"]
        # Zeitreihe
        s["A6"], s["B6"] = ("zahl", 0), ("zahl", P["fj"])
        s["T6"], s["W6"] = ("cent", l.D), ("zahl", 0)
        s["U6"] = ("cent", l.bank0)
        if fin:
            s["V6"] = ("cent", l.kasse0)
        kum = 0.0
        for t in range(1, P["gnd"] + 1):
            r = 6 + t
            vw, ih = self.kosten(t)
            S = c[t] * wfl * P["monate"]
            s[f"A{r}"], s[f"B{r}"] = ("zahl", t), ("zahl", P["fj"] + t)
            s[f"C{r}"], s[f"D{r}"], s[f"E{r}"] = ("miete", l.ovm(t)), ("miete", l.markt(t)), ("miete", self.ziel(l, t))
            s[f"F{r}"] = ("miete", c[t])
            art = "cent" if t == 1 else "eur"
            s[f"G{r}"], s[f"H{r}"], s[f"I{r}"], s[f"J{r}"] = (art, S), (art, -ma * S), (art, -vw), (art, -ih)
            s[f"K{r}"] = (art, S * (1 - ma) - vw - ih)
            s[f"X{r}"] = ("eur", self.ziel(l, t) * wfl * P["monate"] * (1 - ma) - vw - ih)
            if t > n:
                continue
            s[f"L{r}"], s[f"M{r}"], s[f"N{r}"] = (art, -L["VKB"][t]), (art, -L["ZINS"][t]), (art, -L["TILG"][t])
            s[f"T{r}"] = ("eur", L["R"][t])
            if fin:
                kd = L["KD"][t]
                s[f"O{r}"], s[f"P{r}"] = (art, -L["BZINS"][t]), (art, -L["BTILG"][t])
                s[f"Q{r}"], s[f"R{r}"] = (art, -kd), (art, L["ZUE"][t])
                s[f"S{r}"] = ("dscr", L["RE"][t] / kd) if kd > 1 else ("leer", None)
                s[f"U{r}"], s[f"V{r}"] = ("eur", L["W"][t]), ("eur", L["KONTO"][t])
                kum += L["ZUE"][t]
                s[f"W{r}"] = ("eur", kum)
            else:
                bz, bt, w = bankr[t]
                s[f"O{r}"], s[f"P{r}"], s[f"U{r}"] = ("eur", -bz), ("eur", -bt), ("eur", w)
        # Zahlungsreihen für IRR (Zeilen 6–48)
        if fin:
            for t in range(0, n + 1):
                r = 6 + t
                for col, art in (("Y", "brutto"), ("AD", "nZ")):
                    s[f"{col}{r}"] = ("eur", -self.i0(g, art) if t == 0 else L["RE"][t])
                for cols, art in ((("Z", "AA", "AB", "AC"), "brutto"), (("AE", "AF", "AG", "AH"), "nZ")):
                    base = -self.i0(g, art) if t == 0 else L["RE"][t]
                    for col, H, v in zip(cols, (35, 35, 42, 42), ("mit", "oG", "mit", "oG")):
                        s[f"{col}{r}"] = ("leer", None) if t > H else \
                            ("eur", base + (self.rw[g][H][v] if t == H else 0.0))
                base = -self.i0(g, "fbw") if t == 0 else L["RE"][t]
                s[f"AO{r}"] = ("eur", base)
                for col, H, v in zip(("AP", "AQ", "AR", "AS"), (35, 35, 42, 42), ("mit", "oG", "mit", "oG")):
                    s[f"{col}{r}"] = ("leer", None) if t > H else \
                        ("eur", base + (self.rw[g][H][v] if t == H else 0.0))
                ek0 = -l.EK + l.kasse0
                for H, cols in ((42, ("AI", "AM", "AN")), (35, ("AJ", "AK", "AL"))):
                    if t > H:
                        for col in cols:
                            s[f"{col}{r}"] = ("leer", None)
                        continue
                    rest = (L["R"][H] + L["W"][H]) if t == H else 0.0
                    basis = ek0 if t == 0 else L["ZUE"][t] - rest
                    s[f"{cols[0]}{r}"] = ("eur", basis)
                    s[f"{cols[1]}{r}"] = ("eur", basis + (self.rw[g][H]["mit"] if t == H else 0.0))
                    s[f"{cols[2]}{r}"] = ("eur", basis + (self.rw[g][H]["oG"] if t == H else 0.0))
        # Finanzierung bei Bezug
        b = self.bank_param(g)
        gk = P["herstellung"] + P["kg800"] + P["grundstueck"]
        s.update({"H90": ("cent", P["herstellung"]), "H91": ("cent", P["kg800"]), "H92": ("cent", P["grundstueck"]),
                  "H93": ("cent", gk), "H94": ("cent", P["grundstueck"] + P["herstellung"]),
                  "H95": ("cent", P["bemessungsgrenze"][P["band"]]), "H96": ("cent", self.Z),
                  "H97": ("satz", P["quote_d"][g]), "H98": ("satz", P["quote_z"][g]), "H99": ("cent", l.D),
                  "H100": ("cent", l.Zu), "H101": ("cent", l.BE), "H102": ("cent", self.min_em),
                  "H103": ("cent", l.bank0), "H104": ("cent", l.ek_bar), "H105": ("cent", l.kasse0),
                  "H106": ("cent", l.EK),
                  "H107": ("satz", (P["grundstueck"] + l.ek_bar - l.BE) / self.Z if self.Z else 0.0),
                  "H108": ("cent", l.Zu * (1 - P["be_z"])), "H109": ("miete", P["startmiete"][g]),
                  "H110": ("cent", l.rate), "H111": ("cent", b["ann"]), "H112": ("eur", b["rest_zb"]),
                  "H113": ("satz", b["anf"]), "H114": ("eur", b["annp"])})
        # Restwert
        for col, H in (("H", 0), ("I", 35), ("J", 42)):
            rw = self.rw[g][H]
            s[f"{col}118"], s[f"{col}119"] = ("zahl", H), ("zahl", P["gnd"] - H)
            s[f"{col}120"], s[f"{col}121"] = ("satz", rw["lz"]), ("eur", rw["boden"])
            if not self.a2_greift(g, H):
                s[f"{col}122"], s[f"{col}123"] = ("eur", rw["ertragswert_vor_abschlag"]), ("eur", rw["voll"])
                s[f"{col}124"], s[f"{col}125"] = ("eur", rw["abschlag"]), ("eur", rw["gebaeude"])
                if H:
                    s[f"{col}126"], s[f"{col}127"] = ("eur", rw["mit"]), ("eur", rw["oG"])
                else:
                    s["H128"] = ("satz", rw["voll"] / gk - 1 if gk > 0 else 0.0)
                    s["H129"] = ("satz", rw["ertragswert_vor_abschlag"] / gk - 1 if gk > 0 else 0.0)
        # Renditen
        sp = self.sperre(g)
        nv = ("nv", None)
        s["H139"] = nv if sp else ("satz", L["RE"][1] / self.i0(g, "brutto") if self.i0(g, "brutto") > 0 else 0.0)
        for col, H in (("I", 35), ("J", 42)):
            if H == 35 and self.a2_greift(g, 35):
                continue
            for z, art, v in ((133, "nZ", "mit"), (134, "nZ", "oG"), (135, "nZ", "null"),
                              (136, "brutto", "mit"), (137, "brutto", "oG"), (138, "brutto", "null")):
                s[f"{col}{z}"] = nv if sp else self.irr(self.cf_obj(g, art, H, v))
            for z, v in ((175, "mit"), (176, "oG"), (177, "null")):
                s[f"{col}{z}"] = nv if sp else self.irr(self.cf_obj(g, "fbw", H, v))
            if not fin:
                continue
            for z, v in ((140, "mit"), (141, "oG"), (142, "null")):
                s[f"{col}{z}"] = nv if sp else self.irr(self.cf_ek(g, H, v))
            for z, v in ((143, "mit"), (144, "oG"), (145, "null")):
                ev, vf = self.vofi(g, H, v)
                s[f"{col}{z}"] = nv if sp else ("vofi", vf)
                s[f"{col}{z + 3}"] = ("eur", ev)
            ev_mit = self.vofi(g, H, "mit")[0]
            s[f"{col}149"] = nv if sp or ev_mit <= 0 else ("satz", self.rw[g][H]["mit"] / ev_mit)
            s[f"{col}150"] = ("eur", L["KONTO"][H])
            s[f"{col}151"] = ("eur", L["R"][H] + L["W"][H])
        # Liquidität
        if fin:
            ds = [L["RE"][t] / L["KD"][t] for t in range(1, P["bindung"] + 1) if L["KD"][t] > 1]
            kum, kmin = 0.0, 0.0
            for t in range(1, n + 1):
                kum += L["ZUE"][t]
                kmin = min(kmin, kum)
            s.update({"H155": ("cent", L["ZUE"][1]),
                      "H156": ("dscr", L["RE"][1] / L["KD"][1]) if L["KD"][1] > 1 else ("text", "–"),
                      "H157": ("dscr", min(ds)) if ds else ("text", "–"),
                      "H158": ("zahl", sum(1 for t in range(1, P["bindung"] + 1) if L["ZUE"][t] < 0)),
                      "H159": ("eur", kmin), "H160": ("cent", L["ZUE"][1] + L["TILG"][1]),
                      "H161": ("satz", (L["ZUE"][1] + L["TILG"][1]) / l.D if l.D > 0 else 0.0),
                      "H165": ("eur", L["ZUE"][10]), "H166": ("eur", L["ZUE"][P["bindung"]]),
                      "H167": ("eur", L["ZUE"][n]), "H169": ("eur", min(L["KONTO"][0:n + 1]))})
        s.update({"H162": ("eur", L["R"][P["bindung"]]), "H163": ("eur", sum(L["TILG"][1:n + 1])),
                  "H164": ("eur", max(0.0, L["TILG"][n] - l.rate)),
                  "H168": ("eur", l.foerderbarwert(P["zins_bank"])["darlehen"]),
                  "H174": ("eur", l.foerderbarwert(P["zins_bank"])["gesamt"]),
                  "H170": ("eur", L["W"][n] if fin else bankr[n][2])})
        # Miete für das DSCR-Ziel (Konzept N): Kapitaldienst Jahr 1 aus VKB, Zins, Tilgung NBank (RR) und Bank
        # (geschlossen, gilt für jede Laufzeit)
        b1 = self.bank_reihe(g)[1]
        kd1 = L["VKB"][1] + L["ZINS"][1] + L["TILG"][1] + b1[0] + b1[1]
        if fin and abs(kd1 - L["KD"][1]) > 0.01:
            raise ValueError(f"Gefördert {g}: Kapitaldienst Jahr 1 ungleich RR")
        if self.opt["tilgungsfrei"] > 0:          # Tilgungsaufschub: nötige Miete mit der Regeltilgung NBank
            kd1 += l.rate
        s.update({"H181": ("satz", self.dscr_ziel), "H182": ("cent", kd1), "H183": ("miete", self.noetige_miete(kd1))})
        return s

    # ------------------------------------------------------------------ Soll Blatt Frei finanziert
    def frei(self):
        P, l = self.P, self.l["M"]
        s, n = {}, P["n"]
        ma, wfl = P["mietausfall"], P["wfl"]
        i0 = P["grundstueck"] + P["herstellung"]
        markt = self.l["A"].markt                     # Marktmiete laut Eingabe 4.4 (l["M"] rechnet mit der Frei-Miete)
        R = self.frei_reihen()
        re_ = {}
        leer, nv = ("leer", None), ("nv", None)
        for t in range(1, P["gnd"] + 1):
            r = 6 + t
            vw, ih = self.kosten(t)
            S = l.markt(t) * wfl * P["monate"]
            re_[t] = S * (1 - ma) - vw - ih
            art = "cent" if t == 1 else "eur"
            s.update({f"A{r}": ("zahl", t), f"B{r}": ("zahl", P["fj"] + t), f"C{r}": ("miete", markt(t)),
                      f"D{r}": ("miete", l.markt(t)), f"E{r}": (art, S), f"F{r}": (art, -ma * S), f"G{r}": (art, -vw),
                      f"H{r}": (art, -ih), f"I{r}": (art, re_[t])})
            if t <= n and abs(re_[t] - R["RE"][t]) > 1e-6:
                raise ValueError("Frei: Überschuss vor Kapitaldienst ungleich RR")
        # Kapitaldienst, Ergebnis, Bestände (t = 0 … 42)
        s.update({"A6": ("zahl", 0), "B6": ("zahl", P["fj"]), "O6": ("cent", l.bank0), "P6": ("cent", 0.0),
                  "Q6": ("zahl", 0)})
        kum, kmin = 0.0, 0.0
        for t in range(1, n + 1):
            r = 6 + t
            art = "cent" if t == 1 else "eur"
            kd = R["KD"][t]
            kum += R["ZUE"][t]
            kmin = min(kmin, kum)
            s.update({f"J{r}": (art, -R["BZ"][t]), f"K{r}": (art, -R["BT"][t]), f"L{r}": (art, -kd),
                      f"M{r}": (art, R["ZUE"][t]), f"N{r}": ("dscr", re_[t] / kd) if kd > 1 else leer,
                      f"O{r}": ("eur", R["W"][t]), f"P{r}": ("eur", R["KONTO"][t]), f"Q{r}": ("eur", kum)})
        # Zahlungsreihen für IRR: Objekt R–V, Eigenkapital W–AB (EK-Teil hier nachgebildet, RR.kennzahlen bricht
        # für "M" vorher ab): t = 0 −Eigenkapital, t = 1 … H Zahlungsüberschuss, t = H + Restwert − Restschuld Bank
        for t in range(0, n + 1):
            r = 6 + t
            base = -i0 if t == 0 else re_[t]
            s[f"R{r}"] = ("eur", base)
            for col, H, v in (("S", 35, "mit"), ("T", 35, "oG"), ("U", 42, "mit"), ("V", 42, "oG")):
                s[f"{col}{r}"] = leer if t > H else ("eur", base + (self.rw["M"][H][v] if t == H else 0.0))
            for H, cols in ((42, ("W", "AA", "AB")), (35, ("X", "Y", "Z"))):
                if t > H:
                    for col in cols:
                        s[f"{col}{r}"] = leer
                    continue
                basis = -l.EK if t == 0 else R["ZUE"][t] - (R["W"][H] if t == H else 0.0)
                s[f"{cols[0]}{r}"] = ("eur", basis)
                s[f"{cols[1]}{r}"] = ("eur", basis + (self.rw["M"][H]["mit"] if t == H else 0.0))
                s[f"{cols[2]}{r}"] = ("eur", basis + (self.rw["M"][H]["oG"] if t == H else 0.0))
        # Finanzierung bei Bezug: gleiche Eigenmittel wie gefördert, Rest Bank, Kasse 0
        gk = P["herstellung"] + P["kg800"] + P["grundstueck"]
        b = self.bank_param("M")
        if abs(l.bank0 - self.frei_bank) > 0.01 or abs(l.kasse0) > 1e-9:
            raise ValueError("Frei: Bankdarlehen der RR ungleich Restfinanzierung laut Konzept N")
        s.update({"H90": ("cent", P["herstellung"]), "H91": ("cent", P["kg800"]), "H92": ("cent", P["grundstueck"]),
                  "H93": ("cent", gk), "H94": ("cent", i0), "H95": ("cent", P["bemessungsgrenze"][P["band"]]),
                  "H96": ("cent", self.Z), "H102": ("cent", self.min_em), "H103": ("cent", self.frei_bank),
                  "H104": ("cent", l.ek_bar), "H105": ("cent", 0.0), "H106": ("cent", l.EK),
                  "H107": ("satz", l.EK / self.Z if self.Z else 0.0), "H109": ("miete", l.markt(1)),
                  "H111": ("cent", b["ann"]), "H112": ("eur", b["rest_zb"]), "H113": ("satz", b["anf"]),
                  "H114": ("eur", b["annp"])})
        for z in (97, 98, 99, 100, 101, 108, 110, 160, 161, 162, 163, 164, 168, 174):
            s[f"H{z}"] = leer
        # Restwert (Ertragswert zur gerechneten Miete), Renditen
        for col, H in (("H", 0), ("I", 35), ("J", 42)):
            rw = self.rw["M"][H]
            s.update({f"{col}118": ("zahl", H), f"{col}119": ("zahl", P["gnd"] - H), f"{col}120": ("satz", rw["lz"]),
                      f"{col}121": ("eur", rw["boden"]), f"{col}122": ("eur", rw["ertragswert_vor_abschlag"]),
                      f"{col}123": leer, f"{col}124": leer, f"{col}125": ("eur", rw["gebaeude"])})
            if abs(rw["ertragswert_vor_abschlag"] - rw["voll"]) > 1e-6:
                raise ValueError("Frei: Ertragswert zur gerechneten Miete ungleich Bestand (Dublette 123 nicht zulässig)")
            if H:
                s[f"{col}126"], s[f"{col}127"] = ("eur", rw["mit"]), ("eur", rw["oG"])
                for z, v in ((136, "mit"), (137, "oG"), (138, "null")):
                    cf_ = [(0, -i0)] + [(t, re_[t]) for t in range(1, H + 1)]
                    cf_[-1] = (H, cf_[-1][1] + rw[v])
                    s[f"{col}{z}"] = self.irr(cf_)
                rest = R["W"][H]
                for z, v in ((140, "mit"), (141, "oG"), (142, "null")):
                    cf_ = [(0, -l.EK)] + [(t, R["ZUE"][t]) for t in range(1, H + 1)]
                    cf_[-1] = (H, cf_[-1][1] + rw[v] - rest)
                    s[f"{col}{z}"] = self.irr(cf_)
                for z, v in ((143, "mit"), (144, "oG"), (145, "null")):
                    ev = R["KONTO"][H] + rw[v] - rest
                    s[f"{col}{z}"] = ("vofi", (ev / l.EK) ** (1 / H) - 1 if ev > 0 and l.EK > 0 else None)
                    s[f"{col}{z + 3}"] = ("eur", ev)
                ev_mit = R["KONTO"][H] + rw["mit"] - rest
                s[f"{col}149"] = nv if ev_mit <= 0 else ("satz", rw["mit"] / ev_mit)
                s[f"{col}150"], s[f"{col}151"] = ("eur", R["KONTO"][H]), ("eur", rest)
                for z in (133, 134, 135, 175, 176, 177):
                    s[f"{col}{z}"] = leer
        s["H128"] = ("satz", self.rw["M"][0]["voll"] / gk - 1 if gk > 0 else 0.0)
        s["H129"] = leer
        s["H139"] = ("satz", re_[1] / i0 if i0 > 0 else 0.0)
        # Liquidität
        ds = [re_[t] / R["KD"][t] for t in range(1, P["bindung"] + 1) if R["KD"][t] > 1]
        s.update({"H155": ("cent", R["ZUE"][1]),
                  "H156": ("dscr", re_[1] / R["KD"][1]) if R["KD"][1] > 1 else ("text", "–"),
                  "H157": ("dscr", min(ds)) if ds else ("text", "–"),
                  "H158": ("zahl", sum(1 for t in range(1, P["bindung"] + 1) if round(R["ZUE"][t], 2) < 0)),
                  "H159": ("eur", kmin), "H165": ("eur", R["ZUE"][10]), "H166": ("eur", R["ZUE"][P["bindung"]]),
                  "H167": ("eur", R["ZUE"][n]), "H169": ("eur", min(R["KONTO"][0:n + 1])), "H170": ("eur", R["W"][n])})
        # Miete für das DSCR-Ziel: nötige Miete (im Prüfskript gerechnet), Marktmiete, Aufschläge
        if abs(R["KD"][1] - self.frei_kd1) > 0.01:
            raise ValueError("Frei: Kapitaldienst Jahr 1 ungleich geschlossene Rechnung")
        m1 = markt(1)
        s.update({"H181": ("satz", self.dscr_ziel), "H182": ("cent", self.frei_kd1),
                  "H183": ("miete", self.frei_noetig), "H184": ("miete", m1),
                  "H185": ("satz", l.markt(1) / m1 - 1) if m1 > 0 else ("text", "–"),
                  "H186": ("satz", self.frei_noetig / m1 - 1) if m1 > 0 else ("text", "–")})
        return s

    # ------------------------------------------------------------------ Soll Übersicht und NBank
    RASTER = [0.0, 0.01, 0.015, 0.02, None, 0.025, 0.03]   # None = 1/Laufzeit_max (Runde 2: Raster verdichtet)

    def uebersicht(self, sg, sf):
        """sg = {g: Soll Gefördert g}, sf = Soll Frei. Liefert {Zelle: Spezifikation}."""
        P, s = self.P, {}
        sp_ = lambda g, z: sg[g].get(z)                                     # noqa: E731
        strich, leer = ("text", "–"), ("leer", None)
        for i, g in enumerate(GRUPPEN):
            c = "DEF"[i]
            l = self.l[g]
            gk = sg[g]["H93"][1]
            werte = {9: sp_(g, "H93"), 10: sp_(g, "H96"),
                     11: ("cent", max(0.0, P["herstellung"] - P["bemessungsgrenze"][P["band"]] * P["wfl"])),
                     12: ("cent", max(0.0, P["grundstueck"] - P["brw"] * P["gfl"]) if P["brw"] else 0.0),
                     13: sp_(g, "H99"), 14: sp_(g, "H100"), 15: ("cent", l.D + l.Zu),
                     16: ("satz", (l.D + l.Zu) / gk if gk > 0 else 0.0), 17: sp_(g, "H174"), 18: sp_(g, "H103"),
                     19: ("cent", l.EK - l.BE), 20: sp_(g, "H107"), 21: sp_(g, "H101"), 22: sp_(g, "H106"),
                     23: sp_(g, "H104"), 24: ("cent", l.Zu / P["we"]), 25: ("cent", (l.EK - l.BE) / P["we"]),
                     26: sp_(g, "H109")}
            if not self.bank_geschlossen:
                L = l.L
                h161 = sp_(g, "H161")
                werte.update({29: ("cent", L["S"][1]), 30: ("cent", L["MA"][1]), 31: ("cent", L["VW"][1]),
                              32: ("cent", L["IH"][1]), 33: ("cent", L["RE"][1]), 34: ("cent", L["VKB"][1]),
                              35: ("cent", L["ZINS"][1]), 36: ("cent", L["TILG"][1]),
                              37: ("cent", L["BZINS"][1] + L["BTILG"][1]), 38: ("cent", L["ZUE"][1]),
                              39: ("cent", l.BE),
                              42: sp_(g, "H165"), 43: sp_(g, "H166"), 44: sp_(g, "H167"), 45: sp_(g, "H156"),
                              46: sp_(g, "H157"), 47: sp_(g, "H158"), 48: sp_(g, "H159"),
                              49: ("satz", max(0.0, h161[1])) if h161 is not None else None,
                              50: sp_(g, "H162"), 51: sp_(g, "H164"), 52: sp_(g, "H170")})
                for k, ts in enumerate(self.RASTER):
                    ts = 1 / P["n"] if ts is None else ts
                    werte[55 + k] = ("cent", self.lauf(g, tilgungssatz=ts, tilgungsfrei=0).L["ZUE"][1])
                werte[62] = ("cent", self.lauf(g, tilgungssatz=self.e["3.1"], tilgungsfrei=0).L["ZUE"][1])
            for z, v in werte.items():
                if v is not None:
                    s[f"{c}{z}"] = v
            # Block 5–7 (D–F Jahr 35 aus Spalte I, H–J Jahr 42 aus Spalte J)
            c42 = "HIJ"[i]
            for z, quelle in UEB_QUELLE_IJ.items():
                for col, sc in ((c, "I"), (c42, "J")):
                    v = sp_(g, f"{sc}{quelle}")
                    if v is not None:
                        s[f"{col}{z}"] = v
            for z, quelle in UEB_QUELLE_H.items():
                if sp_(g, quelle) is not None:
                    s[f"{c}{z}"] = sp_(g, quelle)
                s[f"{c42}{z}"] = leer
        # Frei-Spalten G (Jahr 35) und K (Jahr 42); nicht zutreffende Frei-Zellen leer (Konzept D.5, N)
        for z in list(range(9, 27)) + list(range(42, 53)):
            s[f"G{z}"] = sf[UEB_FREI_H[z]] if z in UEB_FREI_H else leer
        # Jahresrechnung Jahr 1 frei (Beträge positiv), Zeilen der NBank leer
        RF = self.frei_reihen()
        lf = self.l["M"].L
        s.update({"G29": ("cent", lf["S"][1]), "G30": ("cent", lf["MA"][1]), "G31": ("cent", lf["VW"][1]),
                  "G32": ("cent", lf["IH"][1]), "G33": ("cent", lf["RE"][1]), "G34": leer, "G35": leer, "G36": leer,
                  "G37": ("cent", RF["KD"][1]), "G38": ("cent", RF["ZUE"][1]), "G39": leer})
        # Block 8 Miete für das DSCR-Ziel (A/B/C/Frei), Aufschläge nur Frei; Aufschlag in Spalte L (Seite 1: L26, L38,
        # L42; Renditen und Restwert: L74, L87, L98)
        for z, (zg, zf) in UEB_BLOCK8.items():
            for i, g in enumerate(GRUPPEN):
                if zg is None:
                    s[f"{'DEF'[i]}{z}"] = leer
                elif sp_(g, zg) is not None:
                    s[f"{'DEF'[i]}{z}"] = sp_(g, zg)
            s[f"G{z}"] = sf[zf]
        for z in UEB_AUFSCHLAG:
            s[z] = sf["H185"]
        for z, quelle in UEB_FREI_IJ.items():
            s[f"G{z}"], s[f"K{z}"] = sf[f"I{quelle}"], sf[f"J{quelle}"]
        for z in [z for z in UEB_QUELLE_IJ if z not in UEB_FREI_IJ]:
            s[f"G{z}"], s[f"K{z}"] = leer, leer
        s["G103"], s["K103"] = sf["H128"], leer
        s["G96"], s["K96"] = sf["H169"], leer                 # 6.8 Tiefster Stand Projektkonto: ein Wert je Variante
        s["G85"], s["K85"], s["G107"], s["K107"] = leer, leer, leer, leer
        # Sätze in Spalte C (Objektverwaltung, Instandhaltung fortgeschrieben laut 5.5), Raster in Spalte B
        e = self.e
        fort = (1 + e["5.4"]) ** int(e["5.5"])
        s.update({"C30": ("satz", e["5.1"]), "C31": ("cent", e["5.2"] * fort), "C32": ("cent", e["5.3"] * fort),
                  "C34": ("satz", P["vkb"]), "C35": ("satz", P["zins_1_35"]), "C36": ("satz", e["3.1"]),
                  "B62": ("satz", e["3.1"])})
        for k, ts in enumerate(self.RASTER):
            s[f"B{55 + k}"] = ("satz", 1 / P["n"] if ts is None else ts)
        # Tilgungsraster: höchster Überschuss, Vergleich der Gruppen (Schwellen, Rechenweg S. 12)
        if not self.bank_geschlossen:
            for z in list(range(55, 63)):
                vals = [s[f"{c}{z}"][1] for c in "DEF"]
                mx = max(vals)
                if sorted(vals)[-1] - sorted(vals)[-2] > 0.005:
                    s[f"G{z}"] = ("text", GRUPPEN[vals.index(mx)])
            h160 = {g: sg[g]["H160"][1] for g in GRUPPEN}
            d = {g: self.l[g].D for g in GRUPPEN}
            for zelle, g1, g0 in (("E63", "B", "A"), ("F64", "C", "A"), ("F65", "C", "B")):
                if abs(d[g1] - d[g0]) > 1e-9:
                    s[zelle] = ("satz", (h160[g1] - h160[g0]) / (d[g1] - d[g0]))
            for z in range(66, 73):
                s[f"D{z}"] = strich
            for c in "EF":
                s[f"{c}66"] = ("cent", d["BC"["EF".index(c)]] - d["A"])
                for z, quelle in ((67, 29), (68, 30), (69, 34), (71, 62), (72, 39)):
                    s[f"{c}{z}"] = ("cent", s[f"{c}{quelle}"][1] - s[f"D{quelle}"][1])
                s[f"{c}70"] = ("cent", h160["BC"["EF".index(c)]] - h160["A"])
        # Prüfstatus P1–P6 (C118:C123), Kasse bei Bezug (D118:F118) und Gesamtstatus D3
        for i, g in enumerate(GRUPPEN):
            if sg[g].get("H105") is not None:
                s[f"{'DEF'[i]}{PZ}"] = sg[g]["H105"]
        st = self.status(sg, sf)
        for k, v in enumerate(st):
            if v is not None:
                s[f"C{PZ + k}"] = ("text", v)
        if "prüfen" in st:
            s["D3"] = ("text", "prüfen")
        elif all(v == "OK" for v in st):
            s["D3"] = ("text", "OK")
        return s

    def status(self, sg, sf):
        """P1–P6 laut Konzept F.1 (Runde 2, N): P2 = Auswahlfelder gültig (mit 10.1); P4 = alle Renditen mit Restwert
        Zahlen (Zeilen 133, 136, 140, 143, 175 je Gruppe, Frei 136, 140, 143), nach der Nullstellenregel F8."""
        e = self.e
        ls = [self.l[g] for g in GRUPPEN]
        p1 = all(l.kasse0 < 1 for l in ls)
        p2 = e["4.1"] in MIETENSTUFEN and e["4.2"] in ("ja", "nein") and e["8.2"] in ("Marktmiete", "Vergleichsmiete") \
            and e["10.1"] in MIETWAHL
        p3 = all(l.bank0 < 1 or self.bank_param(g)["anf"] >= 0.01 - 0.00005 for g, l in zip(GRUPPEN, ls))
        p4 = True
        unsicher = False
        specs = [sg[g].get(f"{col}{z}") for g in GRUPPEN for z in (133, 136, 140, 143, 175) for col in "IJ"]
        specs += [sf[f"{col}{z}"] for z in (136, 140, 143) for col in "IJ"]
        for sp in specs:
            if sp is None:
                unsicher = True
            elif sp[0] == "nv" or (sp[0] == "vofi" and sp[1] is None):
                p4 = False
            elif sp[0] == "irr":
                if sp[1].wert is None:
                    p4 = False
                elif sp[1].wert < IRR_GRENZE:
                    unsicher = True                  # Konzept K.2 R1: unter −70 % darf Excel „n. v.“ zeigen
        p5 = min([self.rw[g][H]["gebaeude"] for g in GRUPPEN + ("M",) for H in (35, 42)]) > 0
        q = lambda b: "OK" if b else "prüfen"                                # noqa: E731
        return [q(p1), q(p2), q(p3), None if (unsicher and p4) else q(p4), q(p5), "OK"]

    def nbank(self, sg):
        P, s = self.P, {}
        orient = P["swap"] + P["dawi_aufschlag"]
        s["D5"], s["D6"], s["D7"] = ("satz", P["swap"]), ("satz", P["dawi_aufschlag"]), ("satz", orient)
        for r, (_nr, _b, H, z) in NB_MATRIX.items():
            s[f"C{r}"] = ("jahr", H)
            for i, g in enumerate(GRUPPEN):
                sp = sg[g].get(f"{'I' if H == 35 else 'J'}{z}")
                if sp is None:
                    continue
                s[f"{'DEF'[i]}{r}"] = sp
                s[f"{'GHI'[i]}{r}"] = ("lage", sp, orient, f"{'DEF'[i]}{r}")
        for r, (_nr, _b, z) in NB_BEZUG.items():
            for i, g in enumerate(GRUPPEN):
                if z:
                    if sg[g].get(z) is not None:
                        s[f"{'DEF'[i]}{r}"] = sg[g][z]
                elif sg[g].get("H108") is not None and sg[g].get("H168") is not None:
                    s[f"{'DEF'[i]}{r}"] = ("eur", sg[g]["H108"][1] + sg[g]["H168"][1])
        return s

    def alle(self):
        sg = {g: self.gefoerdert(g) for g in GRUPPEN}
        sf = self.frei()
        return {**{GEF[g]: sg[g] for g in GRUPPEN}, FREI: sf, UEB: self.uebersicht(sg, sf), "NBank": self.nbank(sg)}


# =====================================================================================================
# 5. Vergleich Ist gegen Spezifikation
# =====================================================================================================
TOLS = {"cent": TOL_CENT, "eur": TOL_EUR, "satz": TOL_SATZ, "miete": TOL_MIETE, "dscr": TOL_DSCR, "zahl": 0.0}


def vergleiche(p, was, ist, spec, werte_blatt=None):
    art = spec[0]
    if art == "leer":
        return p.check(ist is None or ist == "", was, ist, "leer")
    if art == "text":
        return p.gleich(was, ist, spec[1])
    if art == "nv":
        return p.check(ist == "n. v.", was, ist, "n. v.", "Sperre/keine Nullstelle")
    if art == "jahr":
        return p.check(ist == spec[1] or ist == str(spec[1]), was, ist, spec[1])
    if art == "vofi":
        if spec[1] is None:
            return p.check(ist == "n. v.", was, ist, "n. v.", "Endvermögen ≤ 0")
        return p.zahl(was, ist, spec[1], TOL_SATZ)
    if art == "irr":
        # Nullstellenregel F8 (Runde 2): Soll ist der Wert der RR (eine Nullstelle: diese; mehrere: die größte mit
        # fallendem Barwert, kennzahlen-konzept 3.3). „n. v.“ nur, wenn die RR keinen Wert hat oder der Wert unter
        # der Kaskadengrenze liegt (Konzept K.2 R1); hat die RR keine Nullstelle im Raster −90 … 100 %, darf Excel
        # eine Nullstelle außerhalb zeigen (Barwert auf der RR-Reihe unter 1 €).
        r, cf_ = spec[1], spec[2]
        n_ = f"{len(r.roots)} Nullstelle(n) RR"
        if r.wert is not None:
            if ist == "n. v." and r.wert < IRR_GRENZE:
                return p.check(True, was, ist, fmt(r.wert), f"{n_}, unter Kaskadengrenze: n. v. zulässig")
            return p.zahl(was, ist, r.wert, TOL_SATZ, n_ + ("" if len(r.roots) == 1 else ", größte fallende"))
        if ist == "n. v.":
            return p.check(True, was, ist, "n. v.", n_ + ", keine fallende")
        if ist_zahl(ist) and not r.roots:
            bw = RR.npv(ist, cf_)
            return p.check(abs(bw) < 1.0, was, ist, "Nullstelle außerhalb des RR-Rasters", f"Barwert {bw:.2f} €")
        return p.check(False, was, ist, "n. v.", n_ + ", keine fallende")
    if art == "lage":
        sp, orient, quelle = spec[1], spec[2], spec[3]
        v = None
        if sp[0] == "irr":
            v = sp[1].wert
        elif sp[0] in ("vofi", "satz"):
            v = sp[1]
        if v is None:
            return p.gleich(was, ist, "–")
        if abs(v - orient) < TOL_SATZ:
            return p.check(ist in ("über", "unter"), was, ist, "über/unter", "Abstand unter Toleranz")
        return p.gleich(was, ist, "über" if v > orient else "unter", f"Wert {fmt(v)}, Orientierung {fmt(orient)}")
    return p.zahl(was, ist, spec[1], TOLS[art])


# =====================================================================================================
# 6. Testläufe in Excel (Kopie, Eingaben setzen, recalc.py, lesen)
# =====================================================================================================
LAEUFE = [
    ("L1", "M", {}), ("L2", "T", {}), ("L3", "T", {"2.3": 354120}), ("L4", "T", {"2.3": 731325}),
    ("L5", "T", {"2.3": 731325, "7.1": 309386.40}),
    ("L6", "T", {"2.3": 731325, "6.1": 0.045, "6.2": 15, "6.3": 0.055}),
    ("L7", "T", {"2.3": 731325, "6.4": 25}), ("L8", "T", {"2.3": 731325, "6.1": 0.05, "6.3": 0.05, "6.4": 42}),
    ("L9", "T", {"2.3": 731325, "2.4": 0}), ("L10", "M", {"2.1": 5200}), ("L11", "M", {"2.3": 2000000}),
    ("L12", "M", {"2.2": 100000}), ("L13", "M", {"1.1": 2030}), ("L14", "M", {"1.2": 1000, "1.3": 15}),
    ("L15", "M", {"3.1": 1 / 33}), ("L16", "M", {"3.2": 2}), ("L17", "M", {"3.3": 0.05}), ("L18", "M", {"3.4": 0.046}),
    ("L19", "M", {"4.1": "II"}), ("L20", "M", {"4.2": "ja"}), ("L21", "M", {"4.3": 12.00}),
    ("L22", "M", {"4.4": 16.00}), ("L23", "M", {"4.5": 0.025}), ("L24", "M", {"4.6": 0.15}),
    ("L25", "M", {"5.1": 0.04}), ("L26", "M", {"5.2": 400}), ("L27", "M", {"5.3": 18.00}),
    ("L28", "M", {"5.4": 0.025}), ("L29", "M", {"5.5": 2}), ("L30", "M", {"7.2": 0.03}), ("L31", "M", {"7.3": 0.07}),
    ("L32", "M", {"8.1": 0.01}), ("L33", "M", {"8.2": "Vergleichsmiete"}), ("L34", "M", {"8.3": 0.05}),
    ("L35", "M", {"9.1": 1.10}), ("L36", "M", {"9.2": 0.95}), ("L37", "M", {"9.3": 0.005}), ("L38", "M", {"9.4": 0.50}),
    # Nacharbeit Runde 1: Bankdarlehen mit negativen EK-Renditen (IRR-Kaskade, P4 mit VOFI), keine Nullstelle > −100 %
    ("L39", "M", {"2.1": 6000}), ("L40", "M", {"9.1": 2.0}), ("L41", "M", {"4.5": -0.05}),
    # Konzept N (frei finanziert): Miete für DSCR-Ziel 1,0 und 1,25 in beiden Projekten; Bankzins 0 % und 6 %;
    # Laufzeit Bank 20 und 42 Jahre; Zusatz-EK 1 Mio. €; Grundstück 500.000 €
    ("L43", "M", {"10.1": "Miete für DSCR-Ziel"}), ("L44", "M", {"10.1": "Miete für DSCR-Ziel", "10.2": 1.25}),
    ("L45", "T", {"10.1": "Miete für DSCR-Ziel"}), ("L46", "T", {"10.1": "Miete für DSCR-Ziel", "10.2": 1.25}),
    ("L47", "M", {"6.1": 0.0}), ("L48", "M", {"6.1": 0.06}), ("L49", "M", {"6.4": 20}), ("L50", "M", {"6.4": 42}),
    ("L51", "M", {"7.1": 1000000}), ("L52", "M", {"2.3": 500000}),
    # Nacharbeit Prüfrunde 1 (Konzept N.7): Laufzeit Bank 60 Jahre (Restschuld am Horizont 42); frei ohne Bankdarlehen
    # (Zusatz-EK 6 Mio. €) mit Marktmiete und mit Miete für DSCR-Ziel; Miete für DSCR-Ziel mit Zinsbindung 1 Jahr und
    # Anschlusszins 6 %; DSCR-Ziel an den Grenzen 0,5 und 3 (Tarutinoer)
    ("L53", "M", {"6.4": 60}), ("L54", "M", {"7.1": 6000000}),
    ("L55", "M", {"10.1": "Miete für DSCR-Ziel", "6.2": 1, "6.3": 0.06}),
    ("L56", "T", {"10.1": "Miete für DSCR-Ziel", "10.2": 0.5}), ("L57", "T", {"10.1": "Miete für DSCR-Ziel", "10.2": 3.0}),
    ("L58", "M", {"10.1": "Miete für DSCR-Ziel", "7.1": 6000000}),
    # Nacharbeit Prüfrunde 2 (Konzept N.8): Laufzeit Bank gleich der Zinsbindung (6.4 = 10) und kleiner (6.4 = 5,
    # Tarutinoer mit Verkehrswert: Bankdarlehen auch gefördert); Zinsbindung gleich Laufzeit 30 Jahre; Marktmiete 0
    # mit Miete für DSCR-Ziel (Aufschläge „–“)
    ("L59", "M", {"6.4": 10}), ("L60", "T", {"2.3": 731325, "6.4": 5}), ("L61", "M", {"6.2": 30}),
    ("L62", "M", {"4.4": 0, "10.1": "Miete für DSCR-Ziel"}),
    # Vorgabe 3.1 des Modellhauses seit 10.11.2026: 1/42 (linear über die Höchstlaufzeit). L63 rechnet das Modellhaus mit dem
    # früheren Satz 2,5 %: Träger der Regression gegen den Stand vorher und der bisherigen Sollwerte des Konzepts
    ("L63", "M", {"3.1": 0.025}),
]
# Fehlerlauf (Runde 2, R1): ungültige Mietenstufe per Einfügen (die Datenüberprüfung greift dabei nicht). Erwartet:
# Fehlerwerte in der Mappe, aber Gesamtstatus und Prüfungen „prüfen“ (nie „OK“ aus Fehlerwerten), NBank-Lage „prüfen“.
LAEUFE_FEHLER = [("L42", "M", {"4.1": "VIII"})]


def pruefe_fehlerlauf(b, lid, res, werte):
    p = b.pruefung("F7", f"{lid} ungültige Mietenstufe: Status „prüfen“, kein „OK“ aus Fehlerwerten")
    p.check(res.get("status") == "errors_found" and (res.get("total_errors") or 0) > 0, "recalc meldet Fehlerwerte",
            res.get("total_errors"), "> 0 (erwartet)")
    if werte is None:
        p.check(False, "Werte", None, "gelesen")
        p.fertig()
        return
    p.gleich("Übersicht!D3 Gesamtstatus", werte.get(UEB, "D3"), "prüfen")
    for r in UEB_PRUEF[:5]:
        p.gleich(f"Übersicht!C{r} ({UEB_ZEILEN[r][0]})", werte.get(UEB, f"C{r}"), "prüfen")
    p.gleich(f"Übersicht!C{PZ + 5} (P6, Eingaben vollständig)", werte.get(UEB, f"C{PZ + 5}"), "OK")
    for r in NB_MATRIX:
        for c in "GHI":
            p.gleich(f"NBank!{c}{r}", werte.get("NBank", f"{c}{r}"), "prüfen")
    p.fertig()


def recalc(pfad, timeout):
    cmd = [sys.executable, str(RECALC), str(pfad), str(timeout)]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout + 180)
    except subprocess.TimeoutExpired:
        return {"error": "Zeitüberschreitung recalc.py"}
    txt = r.stdout.strip()
    try:
        return json.loads(txt[txt.index("{"):])
    except (ValueError, json.JSONDecodeError):
        return {"error": f"keine JSON-Antwort: {txt[:300]} {r.stderr[:300]}"}


class Werte:
    """Zwischengespeicherte Zellwerte (data_only) je Blatt."""

    def __init__(self, pfad):
        wb = openpyxl.load_workbook(pfad, data_only=True, read_only=True)
        self.d = {}
        for ws in wb.worksheets:
            m = {}
            for r, row in enumerate(ws.iter_rows(min_row=1, max_row=ws.max_row or 1, min_col=1,
                                                 max_col=ws.max_column or 1, values_only=True), start=1):
                for c, v in enumerate(row, start=1):
                    if v is not None:
                        m[f"{get_column_letter(c)}{r}"] = v
            self.d[ws.title] = m
        wb.close()

    def blatt(self, name):
        return self.d.get(name, {})

    def get(self, blatt, zelle):
        return self.d.get(blatt, {}).get(zelle)


def excel_lauf(mappe, ordner, lid, proj, aend, timeout):
    ziel = Path(ordner) / f"{lid}.xlsx"
    shutil.copy(mappe, ziel)
    wb = openpyxl.load_workbook(ziel)
    ws = wb["Eingaben"]
    ws["D3"] = 1 if proj == "M" else 2
    for nr, v in aend.items():
        ws[f"{PROJEKT_SPALTE[proj]}{EIN[nr][1]}"] = v
    wb.save(ziel)
    wb.close()
    t0 = time.time()
    res = recalc(ziel, timeout)
    if "error" in res:
        res = recalc(ziel, timeout * 2)
    werte = Werte(ziel) if "status" in res else None
    return lid, res, werte, time.time() - t0


# =====================================================================================================
# 7. Strukturprüfungen an der gelieferten Mappe (F1, F3–F6)
# =====================================================================================================
def sheet_xml(mappe):
    """{Blattname: XML-Text} aus der Datei (für Angaben, die openpyxl nicht liest)."""
    out = {}
    with zipfile.ZipFile(mappe) as z:
        wbx = z.read("xl/workbook.xml").decode("utf-8")
        rels = z.read("xl/_rels/workbook.xml.rels").decode("utf-8")
        ziel = dict(re.findall(r'<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"', rels))
        ziel.update({a: b for b, a in re.findall(r'<Relationship[^>]*Target="([^"]+)"[^>]*Id="([^"]+)"', rels)})
        for m in re.finditer(r'<sheet\b[^>]*>', wbx):
            tag = m.group(0)
            name = re.search(r'name="([^"]+)"', tag).group(1)
            rid = re.search(r'r:id="([^"]+)"', tag).group(1)
            name = name.replace("&amp;", "&").replace("&apos;", "'").replace("&quot;", '"')
            t = ziel.get(rid, "")
            pfad = t.lstrip("/") if t.startswith("/") else "xl/" + t
            try:
                out[name] = z.read(pfad).decode("utf-8")
            except KeyError:
                out[name] = ""
        out["__workbook__"] = wbx
        out["__namelist__"] = z.namelist()
    return out


def name_ziele(wb):
    """{Name: (Blatt, min_col, min_row, max_col, max_row, Text)} der Arbeitsmappen-Namen."""
    out = {}
    for n, dn in wb.defined_names.items():
        txt = dn.attr_text or ""
        s, r = split_sheet(txt)
        try:
            b = range_boundaries(r.replace("$", ""))
        except Exception:
            b = None
        out[n] = (s, b, txt)
    return out


def ist_formelzelle(c):
    """Formel = Zelle mit Formelelement (openpyxl data_type 'f'). Ein Text, der mit „=“ beginnt (Konzept D.5
    Block 2: „= Überschuss vor Kapitaldienst“, „= Zahlungsüberschuss“), ist keine Formel."""
    return c.data_type == "f" and isinstance(c.value, str) and c.value.startswith("=")


def alle_formeln(wb):
    for ws in wb.worksheets:
        for row in ws.iter_rows():
            for c in row:
                if ist_formelzelle(c):
                    yield ws.title, c


def pruefe_v21(b):
    p = b.pruefung("F1", "v2-1 unverändert (SHA-256)")
    h = sha256(V21)
    p.check(h.startswith(V21_SHA_PREFIX), "SHA-256", h[:16] + "…", V21_SHA_PREFIX + "…")
    p.fertig()


def pruefe_f3(b, mappe, wb, xml):
    p = b.pruefung("F3", "Blätter: Anzahl ≤ 9, Namen und Reihenfolge laut A")
    p.check(len(wb.sheetnames) <= 9, "Blattzahl", len(wb.sheetnames), "≤ 9")
    p.gleich("Reihenfolge", " · ".join(wb.sheetnames), " · ".join(BLAETTER))
    p.gleich("aktives Blatt beim Öffnen", wb.active.title, UEB)
    p.fertig()

    p = b.pruefung("F3", "Keine Makros, keine externen Verknüpfungen")
    nl = xml["__namelist__"]
    p.check(not any("vbaProject" in n for n in nl), "Makroteil", [n for n in nl if "vba" in n.lower()], "keiner")
    p.check(not any(n.startswith("xl/externalLinks/") for n in nl), "externe Verknüpfungen",
            [n for n in nl if "externalLink" in n], "keine")
    p.check(not any("connections" in n for n in nl), "Datenverbindungen", None, "keine")
    ext = [f"{s}!{c.coordinate}" for s, c in alle_formeln(wb) if re.search(r"\[\d+\]", c.value)]
    p.check(not ext, "Formeln mit externem Bezug", ext[:5], "keine")
    p.fertig()

    p = b.pruefung("F3", "Verbundene Zellen nur in Zeile 1 (Blatttitel)")
    for ws in wb.worksheets:
        for mr in ws.merged_cells.ranges:
            p.check(mr.min_row == 1 and mr.max_row == 1, f"{ws.title} {mr.coord}", mr.coord, "nur Zeile 1")
        p.check(True, f"{ws.title} geprüft")
    p.fertig()

    p = b.pruefung("F3", "Definierte Namen: 66, Ziele laut Konzept, kein #REF")
    nz = name_ziele(wb)
    eigene = {n: v for n, v in nz.items() if not n.startswith("_xlnm")}
    p.check(len(eigene) == len(NAMEN) == 66, "Anzahl Namen", len(eigene), 66)
    for n, soll in NAMEN.items():
        if n not in eigene:
            p.check(False, f"Name {n}", "fehlt", soll)
            continue
        s, bnd, txt = eigene[n]
        ss, sr = split_sheet(soll)
        ok = s == ss and bnd == range_boundaries(sr.replace("$", "")) and "$" in txt
        p.check(ok, f"Name {n}", txt, soll)
    for n, (s, bnd, txt) in eigene.items():
        if n not in NAMEN:
            p.check(False, f"Name {n}", txt, "nicht im Konzept")
        p.check("#REF" not in txt.upper() and s in wb.sheetnames and bnd is not None, f"Name {n} gültig", txt,
                "gültiger Bezug")
    for ws in wb.worksheets:
        lok = [n for n in ws.defined_names if not n.startswith("_xlnm")] if hasattr(ws, "defined_names") else []
        p.check(not lok, f"{ws.title}: blattbezogene Namen", lok, "keine")
    p.fertig()

    p = b.pruefung("F3", "Funktionen: nur Excel 2016 und LibreOffice (keine verbotenen)")
    verboten = {"XLOOKUP", "XMATCH", "LET", "LAMBDA", "FILTER", "SORT", "SORTBY", "UNIQUE", "SEQUENCE", "OFFSET",
                "INDIRECT", "HYPERLINK", "RANDARRAY", "TEXTJOIN", "CONCAT", "IFS", "SWITCH", "MAXIFS", "MINIFS"}
    benutzt = {}
    for s, c in alle_formeln(wb):
        for f in funktionen(c.value):
            f0 = f.replace("_XLFN.", "").replace("_XLWS.", "")
            benutzt.setdefault(f0, f"{s}!{c.coordinate}")
            if f0 in verboten or f.startswith("_XL"):
                p.check(False, f"{s}!{c.coordinate}", f, "nicht verwenden")
    p.check(True, "verwendete Funktionen", ", ".join(sorted(benutzt)))
    p.fertig()

    p = b.pruefung("F3", "Zellhyperlinks mit Sprungziel (keine HYPERLINK-Formeln)")
    for blatt, zelle, text, zb, zz in LINKS:
        if blatt not in wb.sheetnames:
            p.check(False, f"{blatt}!{zelle}", "Blatt fehlt", text)
            continue
        c = wb[blatt][zelle]
        h = c.hyperlink
        loc = (h.location or h.target or "") if h is not None else ""
        s, r = split_sheet(loc.lstrip("#"))
        ok = h is not None and (s or blatt) == zb and r.replace("$", "") == zz and not str(c.value).startswith("=")
        p.check(ok, f"{blatt}!{zelle} Ziel", loc or None, f"'{zb}'!{zz}")
        p.gleich(f"{blatt}!{zelle} Text", c.value, text)
        p.check(rgb6(c.font.color) == ROT and bool(c.font.underline), f"{blatt}!{zelle} Linkformat",
                f"{rgb6(c.font.color)}, unterstrichen={c.font.underline}", f"{ROT}, unterstrichen")
    p.fertig()

    p = b.pruefung("F3", "Kein Zirkelbezug (Abhängigkeitsgraph aller Formeln)")
    zyklus = finde_zyklus(wb, nz)
    p.check(zyklus is None, "Zirkelbezug", " → ".join(zyklus[:8]) if zyklus else None, "keiner")
    p.fertig()


def finde_zyklus(wb, nz):
    formeln = {}
    for s, c in alle_formeln(wb):
        formeln[(s, c.row, c.column)] = c.value
    grenzen = {}
    for (s, r, col) in formeln:
        mr, mc = grenzen.get(s, (0, 0))
        grenzen[s] = (max(mr, r), max(mc, col))

    def kanten(knoten):
        s0 = knoten[0]
        out = set()
        for s, ref in bezuege(formeln[knoten]):
            s = s or s0
            if ref in nz:
                s, bnd, _ = nz[ref]
            else:
                try:
                    bnd = range_boundaries(ref.replace("$", ""))
                except Exception:
                    continue
            if not bnd or s not in grenzen or all(x is None for x in bnd):
                continue
            c1, r1, c2, r2 = bnd
            mr, mc = grenzen[s]
            r1, c1 = r1 or 1, c1 or 1
            r2, c2 = min(r2 or mr, mr), min(c2 or mc, mc)
            for r in range(r1, r2 + 1):
                for c in range(c1, c2 + 1):
                    if (s, r, c) in formeln:
                        out.add((s, r, c))
        return out

    farbe = {}
    for start in formeln:
        if start in farbe:
            continue
        stapel = [(start, iter(kanten(start)))]
        farbe[start] = 1
        pfad = [start]
        while stapel:
            k, it = stapel[-1]
            nxt = next(it, None)
            if nxt is None:
                farbe[k] = 2
                stapel.pop()
                pfad.pop()
                continue
            f = farbe.get(nxt, 0)
            if f == 1:
                i = pfad.index(nxt)
                return [f"{s}!{get_column_letter(c)}{r}" for s, r, c in pfad[i:] + [nxt]]
            if f == 0:
                farbe[nxt] = 1
                pfad.append(nxt)
                stapel.append((nxt, iter(kanten(nxt))))
    return None


ZEITREIHEN = {**{g: [(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "X"], 7, 86),
                     (["L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W"], 7, 48),
                     ([get_column_letter(c) for c in range(25, 46)], 6, 48)] for g in GEF.values()},
              FREI: [(["A", "B", "C", "D", "E", "F", "G", "H", "I"], 7, 86),
                     (["J", "K", "L", "M", "N", "O", "P", "Q"], 7, 48),
                     ([get_column_letter(c) for c in range(18, 29)], 6, 48)]}
# 0,1–0,7: IRR-Startwerte E10 (0,6 seit Runde 2); 0,05: zweiter Versuch; 0,0001: Barwert-Test „fallend“ (E10)
ERLAUBTE_KONSTANTEN = [0.0, 1.0, 2.0, 10.0, 12.0, 0.03, 0.1, 0.3, 0.5, 0.6, 0.7, 0.05, 0.0001, 0.00005]

# Frei finanziert rechnet Bank, Projektkonto, EK-Reihen und Kennzahlen mit den Formeln der Blätter Gefördert
# (Konzept N: keine zweite Rechenvariante). Verglichen wird die Formel je Zelle nach Umsetzen der Spalten auf
# gemeinsame Platzhalter; auf Gefördert entfallen dabei die NBank-Anteile (Restschuld NBank T) und die Sperre E14.
_SP_GEF = {"K": "RE", "O": "BZ", "P": "BT", "Q": "KD", "R": "ZUE", "S": "DSCR", "U": "W", "V": "KONTO", "W": "KUM",
           "AI": "EK42", "AJ": "EK35", "AK": "EK35M", "AL": "EK35B", "AM": "EK42M", "AN": "EK42B", "Y": "H1", "Z": "H2",
           "AA": "H3", "AB": "H4"}
_SP_FREI = {"I": "RE", "J": "BZ", "K": "BT", "L": "KD", "M": "ZUE", "N": "DSCR", "O": "W", "P": "KONTO", "Q": "KUM",
            "W": "EK42", "X": "EK35", "Y": "EK35M", "Z": "EK35B", "AA": "EK42M", "AB": "EK42B", "R": "H1", "S": "H2",
            "T": "H3", "U": "H4"}
_REF_RE = re.compile(r"(?<![A-Za-z_])(\$?)([A-Z]{1,2})(\$?)(\d+)(?![\d(A-Za-z_])")


def _spalten_norm(f, karte):
    """Zellbezüge der Zeitreihenspalten auf Platzhalter umsetzen; Bezüge auf die Blockspalten H/I/J (Zeilen ab 88)
    und auf Spalte A bleiben stehen."""
    def ers(m):
        col, row = m.group(2), int(m.group(4))
        if row >= 88 and col in ("H", "I", "J"):
            return m.group(0)
        return f"{m.group(1)}<{karte[col]}>{m.group(3)}{row}" if col in karte else m.group(0)
    return _REF_RE.sub(ers, f.replace(" ", ""))


def gef_formel_norm(f):
    f = f.replace(" ", "")
    if f.startswith('=IF($H$105>=1,"n.v.",') and f.endswith(")"):          # Sperre E14 (nur Gefördert)
        f = "=" + f[len('=IF($H$105>=1,"n.v.",'):-1]
    f = _spalten_norm(f, _SP_GEF)
    f = re.sub(r"\$T(\d+)\+", "", f)                                       # Restschuld NBank in den EK-Reihen
    f = re.sub(r"-INDEX\(\$T\$6:\$T\$48,([IJ])\$118\+1\)", "", f)           # … im Endvermögen
    f = re.sub(r"INDEX\(\$T\$6:\$T\$48,([IJ])\$118\+1\)\+", "", f)          # … in Zeile 151
    return f


def frei_formel_norm(f):
    return _spalten_norm(f, _SP_FREI)


# (Zelle Frei, Zelle Gefördert A): Zeitreihe Zeile 7 und 48, Zahlungsreihen Zeile 6, 41 und 48, Kennzahlen I und J
# Ausnahme: Zahlungsüberschuss frei (Spalte M) auf Cent gerundet, FREI_ZUE
FREI_GLEICH_GEF = [(f"{cf_}{r}", f"{cg}{r}") for cf_, cg in (("J", "O"), ("K", "P"), ("N", "S"), ("O", "U"),
                                                              ("P", "V"), ("Q", "W")) for r in (7, 48)]
FREI_ZUE = "=ROUND(I{r}+L{r},2)"
FREI_GLEICH_GEF += [(f"{cf_}{r}", f"{cg}{r}") for cf_, cg in (("W", "AI"), ("X", "AJ"), ("Y", "AK"), ("Z", "AL"),
                                                               ("AA", "AM"), ("AB", "AN")) for r in (6, 41, 48)]
FREI_GLEICH_GEF += [(f"{c}{z}", f"{c}{z}") for z in list(range(140, 152)) for c in "IJ"]
FREI_GLEICH_GEF += [(f"{cf_}{z}", f"{cg}{z}") for z in (140, 141, 142)
                    for cf_, cg in (("R", "Y"), ("S", "Z"), ("T", "AA"), ("U", "AB"))]
FREI_GLEICH_GEF += [(f"H{z}", f"H{z}") for z in (111, 112, 113, 114, 155, 156, 157, 158, 159, 165, 166, 167, 169, 170)]


def pruefe_f4(b, wb):
    p = b.pruefung("F4", "Formeln je Zeitreihenspalte einheitlich (R1C1)")
    for blatt, gruppen in ZEITREIHEN.items():
        ws = wb[blatt]
        for cols, r0, r1 in gruppen:
            for col in cols:
                ci = column_index_from_string(col)
                ref = None
                abw = []
                for r in range(r0, r1 + 1):
                    v = ws.cell(r, ci).value
                    if not (isinstance(v, str) and v.startswith("=")):
                        abw.append(f"{col}{r} keine Formel")
                        continue
                    rc = zu_r1c1(v, r, ci)
                    if ref is None:
                        ref = rc
                    elif rc != ref:
                        abw.append(f"{col}{r}")
                p.check(not abw, f"{blatt} {col}{r0}:{col}{r1}", ", ".join(abw[:4]) or "einheitlich", "einheitlich")
    p.fertig()

    p = b.pruefung("F4", "Blätter Gefördert A/B/C zellgleich außer A1 und B2")
    wa = wb[GEF["A"]]
    for g in ("B", "C"):
        wg = wb[GEF[g]]
        abw = []
        mr = max(wa.max_row, wg.max_row)
        mc = max(wa.max_column, wg.max_column)
        for r in range(1, mr + 1):
            for c in range(1, mc + 1):
                k = f"{get_column_letter(c)}{r}"
                if k in ("A1", "B2"):
                    continue
                if wa.cell(r, c).value != wg.cell(r, c).value:
                    abw.append(k)
        p.check(not abw, f"Gefördert A gegen {g}", ", ".join(abw[:6]) or "gleich", "gleich")
        p.gleich(f"Gefördert {g} B2", wg["B2"].value, g)
    p.gleich("Gefördert A B2", wa["B2"].value, "A")
    p.fertig()

    p = b.pruefung("F4", "Frei finanziert: Bank, Projektkonto, EK-Reihen, Kennzahlen mit den Formeln von Gefördert A")
    wf = wb[FREI]
    for zf, zg in FREI_GLEICH_GEF:
        ff, fg = wf[zf].value, wa[zg].value
        nf = frei_formel_norm(ff) if isinstance(ff, str) else ff
        ng = gef_formel_norm(fg) if isinstance(fg, str) else fg
        p.check(isinstance(ff, str) and nf == ng, f"Frei!{zf} wie Gefördert A!{zg}", nf, ng)
    for r in (7, 48):
        v = wf[f"M{r}"].value
        p.check(isinstance(v, str) and v.replace(" ", "") == FREI_ZUE.format(r=r), f"Frei!M{r} Zahlungsüberschuss auf Cent",
                v, FREI_ZUE.format(r=r))
    p.fertig()

    p = b.pruefung("F4", "Zahlenkonstanten in Formeln nur 0, 1, 2, 10, 12, 0,03, IRR-Konstanten (E10), 0,00005")
    for s, c in alle_formeln(wb):
        for k in zahlkonstanten(c.value):
            ok = isinstance(k, float) and any(abs(k - e) < 1e-12 for e in ERLAUBTE_KONSTANTEN)
            if not ok:
                p.check(False, f"{s}!{c.coordinate}", k, "0/1/2/10/12/0,03/0,1–0,7/0,05/0,0001/0,00005",
                        c.value[:80])
    p.check(True, "alle Formeln durchsucht")
    p.fertig()

    p = b.pruefung("F4", "Feste Zahlen außerhalb Eingaben/Tabellen nur A6, W6 (Frei Q6), H118 und Raster B55:B61")
    erlaubt = {(g, z) for g in GEF.values() for z in ("A6", "W6", "H118")} | {(FREI, "A6"), (FREI, "Q6"), (FREI, "H118")}
    erlaubt |= {(UEB, f"B{r}") for r in range(55, 62) if r != 59}
    for ws in wb.worksheets:
        if ws.title in ("Eingaben", "Tabellen"):
            continue
        for row in ws.iter_rows():
            for c in row:
                if ist_zahl(c.value) and (ws.title, c.coordinate) not in erlaubt:
                    p.check(False, f"{ws.title}!{c.coordinate}", c.value, "keine feste Zahl")
    for (s, z) in sorted(erlaubt):
        v = wb[s][z].value
        if z in ("A6", "W6", "Q6", "H118"):
            p.check(v == 0 and ist_zahl(v), f"{s}!{z}", v, 0)
    v59 = wb[UEB]["B59"].value
    p.check(isinstance(v59, str) and v59.replace(" ", "") == "=1/Laufzeit_max", "Übersicht!B59", v59, "=1/Laufzeit_max")
    v62 = wb[UEB]["B62"].value
    p.check(isinstance(v62, str) and v62.replace(" ", "") == "=Tilgung_NBank", "Übersicht!B62", v62, "=Tilgung_NBank")
    for k, ts in enumerate(Soll.RASTER):
        if ts is not None:
            v = wb[UEB][f"B{55 + k}"].value
            p.check(ist_zahl(v) and abs(v - ts) < 1e-12, f"Übersicht!B{55 + k}", v, ts)
    p.fertig()


def breite(ws, col):
    ci = column_index_from_string(col)
    for k, d in ws.column_dimensions.items():
        lo = d.min or column_index_from_string(k)
        hi = d.max or lo
        if lo <= ci <= hi and d.width:
            return d.width
    return None


def spalten_gliederung(ws, col):
    ci = column_index_from_string(col)
    for k, d in ws.column_dimensions.items():
        lo = d.min or column_index_from_string(k)
        hi = d.max or lo
        if lo <= ci <= hi:
            return d.outline_level or 0, bool(d.hidden)
    return 0, False


def fmt_klasse(code):
    n = norm_numfmt(code)
    if "%" in n:
        if n.startswith("+"):
            return "pp"
        return "pct1" if n.startswith("0.0%") else "pct"
    if "#,##0.00" in n:
        return "eur2"
    if "#,##0" in n:
        return "eur0"
    if n.startswith("0.00"):
        return "faktor"
    if n in ("0", "GENERAL", "0;[RED]-0;–"):
        return "ganz"
    if n == "@":
        return "text"
    return n


def eingabe_zellen():
    z = {("Eingaben", "D3"), ("Eingaben", "D4"), ("Eingaben", "E4")}
    for e in EINGABEN:
        z |= {("Eingaben", f"D{e[1]}"), ("Eingaben", f"E{e[1]}")}
    return z


def excel_px(w):
    """Spaltenbreite in Pixel nach ECMA-376 (Breitenattribut, größte Ziffernbreite 7 px bei Arial 10)."""
    return math.trunc((256 * w + math.trunc(128 / 7)) / 256 * 7)


def seitenreserve(ws):
    """Druckseiten eines Blatts nach der Breitenregel von Excel: Maßstab in ganzen Prozent aus dem breitesten
    Druckbereich (mit Wiederholspalten), ein Maßstab je Blatt; Seiten = Druckbereiche, geteilt an den festen
    Umbrüchen; Höhe je Seite mit Wiederholzeilen. Liefert (Maßstab %, verfügbare Höhe pt, [(Seite, Höhe, Reserve)])."""
    def b_px(ci):
        for k, d in ws.column_dimensions.items():
            lo = d.min or column_index_from_string(k)
            hi = d.max or lo
            if lo <= ci <= hi:
                return 0 if d.hidden else excel_px(d.width or 10.71)
        return excel_px(10.71)

    def h_pt(r):
        d = ws.row_dimensions[r]
        return 0.0 if d.hidden else float(d.height or ws.sheet_format.defaultRowHeight or 12.75)

    pa = ws.print_area or ""
    pa = pa.split(",") if isinstance(pa, str) else list(pa)
    bereiche = [range_boundaries(split_sheet(t_.strip())[1].replace("$", "")) for t_ in pa if t_]
    tr, tc = (ws.print_title_rows or "").replace("$", ""), (ws.print_title_cols or "").replace("$", "")
    t0, t1 = (int(x) for x in tr.split(":")) if tr else (0, -1)
    c0, c1 = (column_index_from_string(x) for x in tc.split(":")) if tc else (0, -1)
    breit = 841.89 - (ws.page_margins.left + ws.page_margins.right) * 72         # A4 quer, Punkt
    hoch = 595.28 - (ws.page_margins.top + ws.page_margins.bottom) * 72
    weite = []
    for a, _r0, e, _r1 in bereiche:
        px = sum(b_px(c) for c in range(a, e + 1))
        if c1 >= c0 and a > c1:
            px += sum(b_px(c) for c in range(c0, c1 + 1))
        weite.append(px * 0.75)
    massstab = min(100, math.floor(100 * breit / max(weite)))
    verfuegbar = hoch / (massstab / 100)
    umbr = sorted(b_.id for b_ in ws.row_breaks.brk)
    seiten = []
    for a, r0, e, r1 in bereiche:
        grenzen = [r0 - 1] + [x for x in umbr if r0 <= x < r1] + [r1]
        for g0, g1 in zip(grenzen, grenzen[1:]):
            h = sum(h_pt(r) for r in range(g0 + 1, g1 + 1))
            if t1 >= t0 and g0 + 1 > t0:
                h += sum(h_pt(r) for r in range(t0, t1 + 1))
            seiten.append((f"{get_column_letter(a)}{g0 + 1}:{get_column_letter(e)}{g1}", h, verfuegbar - h))
    return massstab, verfuegbar, seiten


def pruefe_f5(b, wb, xml, nz):
    inp = eingabe_zellen()
    p = b.pruefung("F5", "Schrift Arial 10 (Titel A1: 14)")
    for ws in wb.worksheets:
        for row in ws.iter_rows():
            for c in row:
                if c.value is None:
                    continue
                soll = 14 if c.coordinate == "A1" else 10
                if c.font.name != "Arial" or abs((c.font.size or 0) - soll) > 0.01:
                    p.check(False, f"{ws.title}!{c.coordinate}", f"{c.font.name} {c.font.size}", f"Arial {soll}")
        p.check(True, f"{ws.title} geprüft")
    p.fertig()

    p = b.pruefung("F5", "Eingabezellen blau auf Gelb, Spalte „verwendet“ grau, sonst keine Eingabeoptik")
    for (s, z) in sorted(inp):
        c = wb[s][z]
        p.check(rgb6(c.font.color) == BLAU and fill6(c) == GELB, f"{s}!{z}", f"{rgb6(c.font.color)}/{fill6(c)}",
                f"{BLAU}/{GELB}")
    for e in EINGABEN + [("", 4)]:
        c = wb["Eingaben"][f"F{e[1]}"]
        p.check(fill6(c) == GRAU_F and rgb6(c.font.color) in (SCHWARZ, None), f"Eingaben!F{e[1]}",
                f"{rgb6(c.font.color)}/{fill6(c)}", f"{SCHWARZ}/{GRAU_F}")
    for ws in wb.worksheets:
        for row in ws.iter_rows():
            for c in row:
                if (ws.title, c.coordinate) in inp:
                    continue
                if (c.value is not None and rgb6(c.font.color) == BLAU) or fill6(c) == GELB:
                    p.check(False, f"{ws.title}!{c.coordinate}", "Eingabeoptik", "keine Eingabe außerhalb Eingaben")
    p.fertig()

    p = b.pruefung("F5", "Formeln schwarz, reine Verweise auf andere Blätter grün")
    for s, c in alle_formeln(wb):
        rb = ist_reiner_bezug(c.value)
        fremd = False
        if rb:
            bs, ref = rb
            if ref in nz and bs is None:
                bs = nz[ref][0]
            fremd = bs is not None and bs != s
        farbe = rgb6(c.font.color)
        if fremd:
            if farbe != GRUEN:
                p.check(False, f"{s}!{c.coordinate}", farbe, GRUEN, c.value[:60])
        elif farbe not in (SCHWARZ, None):
            p.check(False, f"{s}!{c.coordinate}", farbe, SCHWARZ, c.value[:60])
    p.check(True, "alle Formeln geprüft")
    p.fertig()

    p = b.pruefung("F5", "Kopfzeilen PGN-Rot/weiß, Gruppenzeilen Hellgrau")
    for blatt, zeilen in KOPFZEILEN.items():
        ws = wb[blatt]
        for r in zeilen:
            zellen = [c for c in ws[r] if c.value not in (None, "")]
            p.check(len(zellen) >= 2, f"{blatt} Kopfzeile {r}", len(zellen), "≥ 2 Spaltenköpfe")
            for c in zellen:
                p.check(fill6(c) == ROT and rgb6(c.font.color) == WEISS, f"{blatt}!{c.coordinate}",
                        f"{fill6(c)}/{rgb6(c.font.color)}", f"{ROT}/{WEISS}")
    for blatt, zeilen in GRUPPENZEILEN_BLATT.items():
        ws = wb[blatt]
        for r in zeilen:
            tx = [c for c in ws[r][:3] if c.value not in (None, "")]
            p.check(bool(tx), f"{blatt} Gruppenzeile {r} Text", None if not tx else tx[0].value, "Text in A–C")
            p.check(fill6(ws[f"A{r}"]) == GRAU_GRUPPE, f"{blatt}!A{r} Füllung", fill6(ws[f"A{r}"]), GRAU_GRUPPE)
            if tx:
                p.check(bool(tx[0].font.b), f"{blatt}!{tx[0].coordinate} fett", tx[0].font.b, True)
    p.fertig()

    p = b.pruefung("F5", "Druck: A4 quer, Seitenbreite, Ränder 1,5 cm, Fußzeile, Druckbereich, Wiederholzeilen")
    for ws in wb.worksheets:
        ps = ws.page_setup
        t = ws.title
        p.gleich(f"{t} Ausrichtung", ps.orientation, "landscape")
        p.check(str(ps.paperSize) == "9", f"{t} Papier", ps.paperSize, "9 (A4)")
        fit = ws.sheet_properties.pageSetUpPr.fitToPage if ws.sheet_properties.pageSetUpPr else None
        p.check(bool(fit) and str(ps.fitToWidth) == "1" and str(ps.fitToHeight) == "0", f"{t} an Seitenbreite",
                f"fitToPage={fit}, {ps.fitToWidth}×{ps.fitToHeight}", "fitToPage, 1×0")
        for seite in ("left", "right", "top", "bottom"):
            m = getattr(ws.page_margins, seite)
            p.check(abs(m - 1.5 / 2.54) < 0.02, f"{t} Rand {seite}", m, round(1.5 / 2.54, 3))
        p.gleich(f"{t} Fußzeile links", ws.oddFooter.left.text, "&A")
        p.gleich(f"{t} Fußzeile rechts", ws.oddFooter.right.text, "Seite &P von &N")
        pa = (ws.print_area or "")
        pa = pa if isinstance(pa, str) else ",".join(pa)
        pa_n = ",".join(split_sheet(t.strip())[1].replace("$", "") for t in pa.split(",")) if pa else ""
        if t in DRUCKBEREICH and "," in DRUCKBEREICH[t]:
            # mehrteilig: Reihenfolge aus workbook.xml (openpyxl gibt die Teilbereiche sortiert zurück)
            sid = wb.sheetnames.index(t)
            m = re.search(rf'<definedName\b[^>]*localSheetId="{sid}"[^>]*name="_xlnm.Print_Area"[^>]*>([^<]*)<',
                          xml["__workbook__"]) or re.search(
                rf'<definedName\b[^>]*name="_xlnm.Print_Area"[^>]*localSheetId="{sid}"[^>]*>([^<]*)<', xml["__workbook__"])
            roh = (m.group(1) if m else "").replace("&apos;", "'")
            pa_x = ",".join(split_sheet(x_.strip())[1].replace("$", "") for x_ in roh.split(",")) if roh else ""
            p.gleich(f"{t} Druckbereich (Reihenfolge)", pa_x, DRUCKBEREICH[t])
        elif t in DRUCKBEREICH:
            p.gleich(f"{t} Druckbereich", pa_n, DRUCKBEREICH[t])
        else:
            p.check(bool(pa_n), f"{t} Druckbereich gesetzt", pa_n or None, "gesetzt")
        if t in WIEDERHOLZEILEN:
            p.gleich(f"{t} Wiederholzeilen", (ws.print_title_rows or "").replace("$", ""), WIEDERHOLZEILEN[t])
        if t in WIEDERHOLSPALTEN:
            p.gleich(f"{t} Wiederholspalten", (ws.print_title_cols or "").replace("$", ""), WIEDERHOLSPALTEN[t])
        p.gleich(f"{t} Seitenumbrüche nach Zeile", sorted(b_.id for b_ in ws.row_breaks.brk), UMBRUCH.get(t, []))
    p.fertig()

    # Konzept G.4, N.8: LibreOffice und Excel rechnen Spaltenbreiten verschieden um. Geprüft wird die Rechnung nach der
    # Breitenregel von Excel (ECMA-376); das Druckbild in Excel selbst bleibt offen (O13).
    p = b.pruefung("F5", f"Druck: Seitenreserve nach der Breitenregel von Excel mindestens {fmt(SEITENRESERVE_MIN)} pt, "
                         "Abstandszeilen Übersicht 6 pt")
    seiten_soll = {UEB: 2, "Eingaben": 2, "Tabellen": 2, "NBank": 1, FREI: 3, **{g: 5 for g in GEF.values()}}
    for t, anzahl in seiten_soll.items():
        massstab, verfuegbar, seiten = seitenreserve(wb[t])
        p.check(len(seiten) == anzahl, f"{t} Druckseiten (Bereiche und feste Umbrüche)", len(seiten), anzahl,
                f"Maßstab {massstab} %, verfügbare Höhe {verfuegbar:.1f} pt")
        for bereich, h, reserve in seiten:
            p.check(reserve >= SEITENRESERVE_MIN, f"{t} {bereich}: Reserve bei Maßstab {massstab} %", round(reserve, 1),
                    f"≥ {fmt(SEITENRESERVE_MIN)}", f"Höhe {h:.1f} von {verfuegbar:.1f} pt")
    wu_ = wb[UEB]
    for r in UEB_ABSTAND:
        leer = all(c.value in (None, "") for c in wu_[r])
        h = wu_.row_dimensions[r].height
        p.check(leer and h is not None and abs(h - UEB_ABSTAND_HOEHE) <= 0.5, f"Übersicht Abstandszeile {r}",
                f"Höhe {h}, leer={leer}", f"leer, {fmt(UEB_ABSTAND_HOEHE)} pt")
    p.fertig()

    p = b.pruefung("F5", "Ansicht: Fixierung, Gitternetz, Registerfarben, Spaltenbreiten")
    for ws in wb.worksheets:
        t = ws.title
        p.gleich(f"{t} Fixierung", ws.freeze_panes, FIXIERUNG[t])
        if t in (UEB, "Hinweise"):
            p.check(ws.sheet_view.showGridLines is False, f"{t} Gitternetz aus", ws.sheet_view.showGridLines, False)
        tc = rgb6(ws.sheet_properties.tabColor) if ws.sheet_properties.tabColor is not None else None
        soll = {UEB: ROT, "Eingaben": GELB}.get(t)
        p.gleich(f"{t} Registerfarbe", tc, soll)
        for col, w in SPALTENBREITE.get(t, {}).items():
            ist = breite(ws, col)
            p.check(ist is not None and abs(ist - w) <= 1.0, f"{t} Breite {col}", ist, w)
    p.fertig()

    p = b.pruefung("F5", "Gliederung: Eingaben-Blöcke, Übersicht Details, Zahlungsreihen, Jahre 43–80")
    we = wb["Eingaben"]
    for e in EINGABEN:
        d = we.row_dimensions[e[1]]
        p.check((d.outline_level or 0) == 1 and not d.hidden, f"Eingaben Zeile {e[1]}",
                f"Ebene {d.outline_level}, verborgen={d.hidden}", "Ebene 1, aufgeklappt")
    for r in GRUPPENZEILEN:
        p.check((we.row_dimensions[r].outline_level or 0) == 0, f"Eingaben Gruppenzeile {r}",
                we.row_dimensions[r].outline_level, 0)
    wu = wb[UEB]
    for a, e in UEB_EINGEKLAPPT:
        for r in range(a, e + 1):
            d = wu.row_dimensions[r]
            p.check((d.outline_level or 0) == 1 and bool(d.hidden), f"Übersicht Zeile {r}",
                    f"Ebene {d.outline_level}, verborgen={d.hidden}", "Ebene 1, zugeklappt")
    for r in UEB_SICHTBAR:
        d = wu.row_dimensions[r]
        p.check(not d.hidden and not d.outline_level, f"Übersicht Zeile {r} sichtbar",
                f"Ebene {d.outline_level}, verborgen={d.hidden}", "sichtbar")
    for g, (c0, c1) in [(g, (25, 45)) for g in GEF.values()] + [(FREI, (18, 28))]:
        for c in range(c0, c1 + 1):
            lv, hid = spalten_gliederung(wb[g], get_column_letter(c))
            p.check(lv >= 1 and hid, f"{g} Spalte {get_column_letter(c)}", f"Ebene {lv}, verborgen={hid}",
                    "Ebene 1, zugeklappt")
        for r in range(49, 87):
            d = wb[g].row_dimensions[r]
            p.check((d.outline_level or 0) == 1 and bool(d.hidden), f"{g} Zeile {r} (t = {r - 6})",
                    f"Ebene {d.outline_level}, verborgen={d.hidden}", "Ebene 1, zugeklappt")
        p.check(not wb[g].row_dimensions[48].hidden, f"{g} Zeile 48 sichtbar", wb[g].row_dimensions[48].hidden, False)
    for c in range(1, 18):                         # Frei: Zeitreihe A–Q ohne Gliederung, ohne leere Platzhalterspalte
        lv, hid = spalten_gliederung(wb[FREI], get_column_letter(c))
        p.check(lv == 0 and not hid and wb[FREI].cell(5, c).value not in (None, ""), f"{FREI} Spalte {get_column_letter(c)}",
                f"Ebene {lv}, verborgen={hid}, Kopf={wb[FREI].cell(5, c).value}", "sichtbar, mit Kopf")
    for r in range(88, 187):                       # Frei: leere Zeilen ausgeblendet, belegte sichtbar
        hid = bool(wb[FREI].row_dimensions[r].hidden)
        if r in FREI_LEER:
            p.check(hid, f"{FREI} Zeile {r} (leer) ausgeblendet", hid, True)
        elif wb[FREI][f"A{r}"].value not in (None, ""):
            p.check(not hid, f"{FREI} Zeile {r} sichtbar", hid, False)
    fehlt_sb = []
    for t in ("Eingaben", UEB) + tuple(GEF.values()) + (FREI,):
        sp = re.search(r"<sheetPr\b.*?</sheetPr>|<sheetPr\b[^>]*/>", xml.get(t, ""), re.S)
        sp = sp.group(0) if sp else ""
        wert = re.search(r'summaryBelow="([^"]*)"', sp)
        if wert is None:
            fehlt_sb.append(t)              # von LibreOffice entfernt (siehe Skriptkopf, Korrektur 4)
            continue
        p.check(wert.group(1) in ("0", "false"), f"{t} Summenzeile oberhalb (summaryBelow)", wert.group(1), "0")
    p.fertig()
    if fehlt_sb:
        b.hinweis("F5", "summaryBelow fehlt (" + ", ".join(fehlt_sb) + "): Datei nach build_vofi.py erneut mit recalc.py "
                        "gespeichert; build_vofi.py --nachbearbeiten DATEI stellt die Angabe wieder her")

    p = b.pruefung("F5", "Dokumenteigenschaften: Autor PGN, Titel, Sprache de-DE")
    props = wb.properties
    p.gleich("Autor", props.creator, "PGN")
    p.gleich("Titel", props.title, "VOFI Mietwohnraum 2026")
    p.gleich("Sprache", props.language, "de-DE")
    p.fertig()

    p = b.pruefung("F5", "Definierte Namen je Blatt eindeutig (keine doppelten Druckangaben)")
    paare = re.findall(r'<definedName\b([^>]*)>', xml["__workbook__"])
    schl = [(re.search(r'name="([^"]+)"', a_).group(1), (re.search(r'localSheetId="(\d+)"', a_) or [None, ""])[1])
            for a_ in paare]
    doppelt = sorted({k for k in schl if schl.count(k) > 1})
    p.check(not doppelt, "doppelte definedName", doppelt[:5], "keine")
    p.fertig()

    p = b.pruefung("F5", "Neuberechnung beim Öffnen (fullCalcOnLoad) bzw. ohne calcId (Excel rechnet beim Öffnen)")
    cp = re.search(r"<calcPr\b[^>]*>", xml["__workbook__"])
    cp = cp.group(0) if cp else ""
    voll = bool(re.search(r'fullCalcOnLoad="(1|true)"', cp))
    p.check(voll or "calcId" not in cp, "calcPr", cp or None, 'fullCalcOnLoad="1" oder ohne calcId')
    p.fertig()
    if not voll:
        b.hinweis("F5", "fullCalcOnLoad fehlt: Datei nach build_vofi.py erneut mit recalc.py gespeichert; "
                        "build_vofi.py --nachbearbeiten DATEI stellt die Angabe wieder her")


FLEX_GRUPPE = {("NBank", 10): "Primärgröße VOFI (RL Nr. 11.10 Abs. 3)", ("NBank", 13): "Gegenrechnung EK-IRR (DAWI Art. 6 Abs. 1)",
               ("NBank", 16): "nachrichtlich", (UEB, 74): "Objektrendite vor Steuern",
               (UEB, 87): "Eigenkapitalrendite vor Steuern", (UEB, 98): "Restwert (Ertragswert)"}
FLEX_GRUPPE.update({("Tabellen", r): t for r, t in TAB_TITEL.items()})
EMOJI_RE = re.compile("[\U0001F000-\U0001FAFF☀-➿️⬀-⯿]")


def pruefe_f6(b, wb):
    p = b.pruefung("F6", "Textlängen: Bezeichnung ≤ 45, Quelle ≤ 60, Bemerkung Übersicht L ≤ 40, sonst ≤ 120 (außer Hinweise)")
    bez = {"Eingaben": ("B", 6, EINGABE_LETZTE), UEB: ("B", 8, PZ + 5), "Tabellen": ("B", 3, 41), "NBank": ("B", 3, 31)}
    for g in list(GEF.values()) + [FREI]:
        bez[g] = ("A", 88, 186)
    quelle = {"Eingaben": ("G", 7, EINGABE_LETZTE), "Tabellen": ("G", 5, 41), "NBank": ("G", 5, 7)}
    for ws in wb.worksheets:
        for row in ws.iter_rows():
            for c in row:
                if not isinstance(c.value, str) or ist_formelzelle(c):
                    continue
                n = len(c.value)
                grenze = 120
                if ws.title == "Hinweise" and c.column == 2 and 3 <= c.row <= 17:
                    grenze = 10 ** 6
                if ws.title in bez:
                    col, r0, r1 = bez[ws.title]
                    if c.column_letter == col and r0 <= c.row <= r1:
                        grenze = 45
                if ws.title in GEF.values() or ws.title == FREI:
                    if c.row in (4, 5):
                        grenze = 45
                if ws.title in quelle:
                    col, r0, r1 = quelle[ws.title]
                    if c.column_letter == col and r0 <= c.row <= r1:
                        grenze = 60
                if n > grenze:
                    p.check(False, f"{ws.title}!{c.coordinate}", f"{n} Zeichen", f"≤ {grenze}", c.value[:50])
        p.check(True, f"{ws.title} geprüft")
    wu = wb[UEB]                                  # Bemerkungen der Blöcke 5–7 passen in Spalte L (Breite 38)
    for r in UEB_HORIZONT_ZEILEN:
        v = wu[f"L{r}"].value
        if isinstance(v, str) and not ist_formelzelle(wu[f"L{r}"]) and len(v) > 40:
            p.check(False, f"Übersicht!L{r}", f"{len(v)} Zeichen", "≤ 40", v[:50])
    p.check(True, "Übersicht Spalte L geprüft")
    for z in UEB_AUFSCHLAG_SEITE1:                # Seite 1: Bemerkung in H endet vor dem Aufschlag in L (H–K = 48 Zeichen)
        r = z[1:]
        v = wu[f"H{r}"].value
        p.check(v is None or (isinstance(v, str) and len(v) <= 40), f"Übersicht!H{r} neben {z}", v, "leer oder ≤ 40 Zeichen")
        for c in "IJK":
            p.check(wu[f"{c}{r}"].value in (None, ""), f"Übersicht!{c}{r}", wu[f"{c}{r}"].value, "leer")
    wh = wb["Hinweise"]
    zeilen = [r for r in range(1, (wh.max_row or 1) + 1) if any(c.value not in (None, "") for c in wh[r])]
    inhalt = [r for r in zeilen if r >= 3]
    p.check(len(inhalt) <= 15 and all(r <= 17 for r in inhalt), "Hinweise: Zeilen ab Zeile 3", len(inhalt), "≤ 15 (A3:B17)")
    p.fertig()

    p = b.pruefung("F6", "Sprache: keine Ausrufezeichen, ACHTUNG, Wichtig:, Belehrungen, Emojis, Werkstattspuren")
    regeln = [(r"!", "Ausrufezeichen"), (r"(?i)\bachtung\b", "ACHTUNG"), (r"Wichtig:", "Wichtig:"),
              (r"(?i)safe\s*harbou?r", "Safe Harbour"), (r"(?i)eingehalten", "eingehalten"),
              (r"(?i)\bbitte\b", "bitte"), (r"(?i)\bunbedingt\b", "unbedingt"),
              (r"Verwaltungskostenbetrag", "Verwaltungskostenbetrag"),
              (r"[A-Z]+[0-9]+!|![A-Z]+[0-9]+|\b[A-Z]{1,3}\$?[0-9]+:[A-Z]{1,3}\$?[0-9]+\b", "Zelladresse"),
              (r"\bF[0-9]{3}\b|\bG[0-9]-[0-9]{2}\b", "Fakt-ID"), (r"\.py\b|\.xlsx\b|\.md\b", "Dateiname")]
    for ws in wb.worksheets:
        for row in ws.iter_rows():
            for c in row:
                v = c.value
                if not isinstance(v, str) or ist_formelzelle(c):
                    continue
                for rx, was in regeln:
                    if re.search(rx, v):
                        p.check(False, f"{ws.title}!{c.coordinate}", v[:60], f"ohne {was}")
                if EMOJI_RE.search(v):
                    p.check(False, f"{ws.title}!{c.coordinate}", v[:60], "ohne Emoji")
                if ws.title == "NBank" and re.search(r"(?i)erfüllt", v):
                    p.check(False, f"{ws.title}!{c.coordinate}", v[:60], "ohne „erfüllt“")
        p.check(True, f"{ws.title} geprüft")
    p.fertig()

    p = b.pruefung("F6", "Beschriftungen laut Konzept (Bezeichnungen, Einheiten, Quellen, Hinweise)")
    for blatt, zellen in BESCHRIFTUNG.items():
        ws = wb[blatt]
        for z, soll in zellen.items():
            r = int(re.sub(r"[A-Z]", "", z))
            if (blatt, r) in FLEX_GRUPPE and z[0] in "AB":
                continue
            ist = ws[z].value
            if soll == "" or soll is None:
                p.check(ist in (None, ""), f"{blatt}!{z}", ist, "leer")
            else:
                p.gleich(f"{blatt}!{z}", ist if not ist_zahl(ist) else str(ist), soll)
    for (blatt, r), soll in FLEX_GRUPPE.items():
        ws = wb[blatt]
        ist = [ws[f"A{r}"].value, ws[f"B{r}"].value]
        p.check(any(isinstance(x, str) and norm_text(x) == norm_text(soll) for x in ist), f"{blatt} Zeile {r}",
                " | ".join(str(x) for x in ist if x), soll)
    for r in range(3, 18):
        v = wb["Hinweise"][f"A{r}"].value
        p.check(str(v) == str(r - 2), f"Hinweise!A{r}", v, str(r - 2))
    for g in list(GEF.values()) + [FREI]:
        v = wb[g]["D2"].value
        p.check(isinstance(v, str) and v.replace(" ", "") == "=Aktives_Projekt", f"{g}!D2", v, "=Aktives_Projekt")
    for t, soll in TITEL.items():
        v = wb[t]["A1"].value
        if soll:
            p.gleich(f"{t}!A1", v, soll)
        else:
            p.check(isinstance(v, str) and v.strip() != "", f"{t}!A1", v, "Titel")
    p.fertig()


def pruefe_eingaben(b, wb, nz):
    we = wb["Eingaben"]
    p = b.pruefung("B.2", "Eingabewerte beider Projekte = Broschüre/RR (Modellhaus) bzw. v2-1 (Tarutinoer)")
    for proj in ("M", "T"):
        soll = standard_eingaben(proj)
        col = PROJEKT_SPALTE[proj]
        for e in EINGABEN:
            ist = we[f"{col}{e[1]}"].value
            s = soll[e[0]]
            if isinstance(s, str):
                p.gleich(f"{e[0]} {e[2]} ({PROJEKT_NAME[proj][:10]})", ist, s)
            else:
                p.zahl(f"{e[0]} {e[2]} ({PROJEKT_NAME[proj][:10]})", ist, float(s), 1e-9 * max(1.0, abs(s)))
    p.check(we["D3"].value == 1, "D3 Aktives Projekt (Standard)", we["D3"].value, 1)
    p.gleich("D4 Projektname 1", we["D4"].value, PROJEKT_NAME["M"])
    p.gleich("E4 Projektname 2", we["E4"].value, PROJEKT_NAME["T"])
    p.fertig()

    p = b.pruefung("B.1", "Spalte „verwendet“: INDEX auf die Projektspalte, Projektwahl über die Position (1/2)")
    f4 = (we["F4"].value or "").replace(" ", "").upper()
    p.check(f4 == "=INDEX(PROJEKTLISTE,PROJEKT_NR)", "Eingaben!F4", we["F4"].value, "=INDEX(Projektliste,Projekt_Nr)")
    p.check(we["F3"].value in (None, ""), "Eingaben!F3 leer", we["F3"].value, "leer")
    for e in EINGABEN:
        v = (we[f"F{e[1]}"].value or "")
        ok = v.replace(" ", "").upper() == f"=INDEX($D{e[1]}:$E{e[1]},PROJEKT_NR)"
        p.check(ok, f"Eingaben!F{e[1]}", v, f"=INDEX($D{e[1]}:$E{e[1]},Projekt_Nr)")
    labels = [we[f"B{e[1]}"].value for e in EINGABEN]
    doppelt = sorted({x for x in labels if labels.count(x) > 1})
    p.check(not doppelt, "jede Eingabe genau einmal (Bezeichnung)", doppelt, "keine Doppelungen")
    belegt = [r for r in range(6, EINGABE_LETZTE + 1) if r not in GRUPPENZEILEN]
    p.check(sorted(e[1] for e in EINGABEN) == belegt and len(EINGABEN) == 39, "Eingabezeilen 7–54 lückenlos",
            len(EINGABEN), 39)
    # bestehende Eingaben behalten Nummer und Zeile (Konzept N: Block 10 angehängt, keine Verschiebung)
    fest = {"3.1": 17, "5.1": 29, "5.2": 30, "5.3": 31, "6.1": 35, "6.2": 36, "6.3": 37, "6.4": 38, "7.1": 40, "7.2": 41,
            "7.3": 42, "9.1": 48, "9.2": 49, "9.3": 50, "9.4": 51}
    for nr, z in fest.items():
        p.gleich(f"Eingabe {nr} in Zeile {z}", str(we[f"A{z}"].value), nr)
    p.check(not any(we[f"A{r}"].value for r in GRUPPENZEILEN), "Gruppenzeilen ohne Nr.", None, "Spalte A leer")
    for r, (k, kurz) in GRUPPENZEILEN.items():
        v = we[f"B{r}"].value or ""
        p.check(norm_text(v).startswith(f"{k} {kurz}"), f"Eingaben!B{r}", v, f"{k} {kurz} …")
    p.fertig()

    p = b.pruefung("B.2", "Datenüberprüfung je Eingabe (Typ, Grenzen, Meldung)")
    dvs = we.data_validations.dataValidation
    for e in EINGABEN + [("–", 3, "Projekt_Nr", None, None, None, ("list", "1,2"))]:
        r = e[1]
        cols = ("D", "E") if r != 3 else ("D",)
        for col in cols:
            zelle = f"{col}{r}"
            treffer = [dv for dv in dvs if zelle in dv.sqref]
            if not treffer:
                p.check(False, f"{zelle} ({e[2]})", "keine", e[6])
                continue
            dv = treffer[0]
            g = e[6]
            if g[0] == "list":
                f1 = (dv.formula1 or "").lstrip("=").replace(" ", "")
                ok = dv.type == "list" and f1.strip('"') == g[1].replace(" ", "")
                p.check(ok, f"{zelle} ({e[2]})", f"{dv.type} {dv.formula1}", f"list {g[1]}")
            else:
                f2 = (dv.formula2 or "").lstrip("=").strip()
                try:
                    lo = float(dv.formula1)
                    hi = f2 if isinstance(g[2], str) else float(f2)
                except (TypeError, ValueError):
                    lo = hi = None
                ok_hi = hi == g[2] if isinstance(g[2], str) else \
                    (hi is not None and abs(hi - g[2]) <= 1e-9 * max(1, abs(g[2])))
                ok = dv.type == g[0] and (dv.operator in (None, "between")) and lo is not None and \
                    abs(lo - g[1]) <= 1e-9 * max(1, abs(g[1])) and ok_hi
                p.check(ok, f"{zelle} ({e[2]})", f"{dv.type} {dv.operator} {dv.formula1}–{dv.formula2}",
                        f"{g[0]} between {g[1]}–{g[2]}")
            # Meldung nennt den zulässigen Bereich (Konzept B.2): „Zulässig: … bis …“ bzw. Auswahl
            err = norm_text(dv.error or "")
            ok = bool(dv.showErrorMessage) and err.startswith("Zulässig: ") and len(err) <= 120
            if ok and g[0] != "list" and not isinstance(g[2], str):
                ok = all(any(v in err for v in de_bereich(w, e[5])) for w in (g[1], g[2]))
            p.check(ok, f"{zelle} Meldung", dv.error, "Zulässig: <Bereich>")
            if e[5] in ("pct", "pp"):
                p.check(bool(dv.showInputMessage) and "%" in (dv.prompt or ""), f"{zelle} Eingabehinweis",
                        dv.prompt, "Prozent-Hinweis")
    p.fertig()

    p = b.pruefung("B.3", "Zahlenformate Eingaben (D–F je Einheit, deutsch, ohne Nullabschnitt: 0 bleibt sichtbar)")
    for e in EINGABEN:
        for col in "DEF":
            code = we[f"{col}{e[1]}"].number_format
            k = fmt_klasse(code)
            soll = e[5]
            ok = (k == soll or (soll == "ganz" and k in ("ganz", "eur0"))) and "–" not in norm_numfmt(code)
            p.check(ok, f"Eingaben!{col}{e[1]} ({e[2]})", code, soll + ", ohne „–“")
    p.fertig()

    p = b.pruefung("B.2", "Keine ungenutzten Eingaben (jeder Eingabe-Name wird in Formeln verwendet)")
    zaehler = {n: 0 for n in NAMEN}
    for s, c in alle_formeln(wb):
        for _bs, ref in bezuege(c.value):
            if ref in zaehler:
                zaehler[ref] += 1
    for ws in wb.worksheets:
        for dv in ws.data_validations.dataValidation:
            for f in (dv.formula1, dv.formula2):
                for n in zaehler:
                    if f and re.search(rf"\b{n}\b", f):
                        zaehler[n] += 1
    for n in sorted(EINGABE_NAMEN):
        p.check(zaehler[n] > 0, f"Name {n}", zaehler[n], "≥ 1 Verwendung")
    p.fertig()
    for n in sorted(set(NAMEN) - EINGABE_NAMEN):
        if zaehler[n] == 0:
            b.hinweis("B.2", f"Name {n} wird in keiner Formel und keiner Datenüberprüfung verwendet")


def de_bereich(x, klasse):
    """Grenzwert in deutscher Schreibweise wie in der Meldung der Datenüberprüfung (ohne Vorzeichen-Plus);
    Varianten mit und ohne Tausenderpunkt (Jahreszahlen ohne)."""
    if klasse in ("pct", "pp"):
        t = [f"{x * 100:,.2f}"]
    elif klasse in ("eur2", "faktor"):
        t = [f"{x:,.2f}"]
    else:
        t = [f"{x:,.0f}", f"{x:.0f}"]
    return [v.replace(",", "X").replace(".", ",").replace("X", ".").replace("-", "−") for v in t]


def pruefe_tabellen(b, wb):
    wt = wb["Tabellen"]
    P = BASIS["M"]
    p = b.pruefung("C", "Tabellen-Festwerte = RL 2026 / Referenzrechnung, schwarz, nicht gelb")
    for i, g in enumerate(GRUPPEN):
        c = "DEF"[i]
        p.zahl(f"Quote Darlehen {g}", wt[f"{c}5"].value, P["quote_d"][g], 1e-12)
        p.zahl(f"Quote Zuschuss {g}", wt[f"{c}6"].value, P["quote_z"][g], 1e-12)
    for k, m in enumerate(MIETENSTUFEN):
        r = 9 + k
        band = 1 if m in ("I", "II", "III") else 2
        p.zahl(f"Bemessungsgrenze {m}", wt[f"C{r}"].value, P["bemessungsgrenze"][band], 1e-9)
        for i, g in enumerate(GRUPPEN):
            p.zahl(f"Höchstmiete {m} {g}", wt[f"{'DEF'[i]}{r}"].value, P["hoechstmiete"][g][band], 1e-9)
    for t in TAB3:
        p.zahl(f"{t[1]} {t[5]}", wt[f"D{t[0]}"].value, float(t[6](P, ANN)), 1e-12)
    for k, (rnd, lz) in enumerate(P["lz_tab"]):
        p.zahl(f"LZ RND {rnd}", wt[f"B{36 + k}"].value, rnd, 0)
        p.zahl(f"LZ Satz {rnd}", wt[f"D{36 + k}"].value, lz, 1e-12)
    for row in wt.iter_rows(min_row=3):
        for c in row:
            if ist_zahl(c.value):
                p.check(rgb6(c.font.color) in (ANTHRAZIT, SCHWARZ, None) and fill6(c) != GELB, f"Tabellen!{c.coordinate} Format",
                        f"{rgb6(c.font.color)}/{fill6(c)}", "schwarz/anthrazit, ohne Gelb")
    p.fertig()


def pruefe_uebersicht_formate(b, wb):
    wu = wb[UEB]
    p = b.pruefung("G.2", "Zahlenformate Übersicht")
    kosten = (30, 31, 32, 34, 35, 36, 37, 68, 69)          # Kostenzeilen ohne Rotformat (Jahresrechnung, Rechenweg)
    for r, (_a, _b, einheit, _l) in UEB_ZEILEN.items():
        for col in "DEFGHIJK":
            c = wu[f"{col}{r}"]
            if c.value is None or (isinstance(c.value, str) and not c.value.startswith("=")):
                continue                                        # leer, „–“ oder Bemerkung (Spalte H, Blöcke 1–4, 8)
            k = fmt_klasse(c.number_format)
            if r in kosten:
                n = norm_numfmt(c.number_format)
                p.check(k == "eur0" and "[RED]" not in n, f"Übersicht!{col}{r}", c.number_format, '#,##0;-#,##0;"–"')
            elif r in (29, 33, 38, 39) or einheit == "€" or (einheit or "").startswith("€ ("):
                p.check(k == "eur0", f"Übersicht!{col}{r}", c.number_format, "Euro")
            elif einheit is not None and einheit.startswith("%"):
                p.check(k in ("pct", "pct1"), f"Übersicht!{col}{r}", c.number_format, "Prozent")
            elif einheit == "Faktor":
                p.check(k == "faktor", f"Übersicht!{col}{r}", c.number_format, "Faktor 0,00")
            elif einheit == "€/m² Monat":
                p.check(k == "eur2", f"Übersicht!{col}{r}", c.number_format, "#,##0.00")
    p.check(norm_numfmt(wu["C31"].number_format) == norm_numfmt('#,##0" € je Wohnung"'), "Übersicht!C31",
            wu["C31"].number_format, '#,##0" € je Wohnung"')
    p.check(norm_numfmt(wu["C32"].number_format) == norm_numfmt('0.00" €/m²"'), "Übersicht!C32", wu["C32"].number_format,
            '0.00" €/m²"')
    p.check(norm_numfmt(wu["C35"].number_format) == "0.00%", "Übersicht!C35", wu["C35"].number_format, "0.00 %")
    for z in UEB_AUFSCHLAG:                       # Aufschlag der Frei-Miete bei den Renditen: Zahl, Text im Format
        v = wu[z].value
        p.check(isinstance(v, str) and v.replace(" ", "") == "='Freifinanziert'!H185", f"Übersicht!{z}", v,
                "='Frei finanziert'!H185")
        p.check(norm_numfmt(wu[z].number_format) == norm_numfmt(F_AUFSCHLAG), f"Übersicht!{z} Format",
                wu[z].number_format, F_AUFSCHLAG)
        p.check(bool(wu[z].font.b) and wu[z].alignment.horizontal == "left", f"Übersicht!{z} fett, linksbündig",
                f"fett={wu[z].font.b}, {wu[z].alignment.horizontal}", "fett, left")
    wf = wb[FREI]                                 # Blatt Frei finanziert: Aufschlag in den Gruppenzeilen
    for z in ("J116", "J131"):                    # Gruppenzeilen Restwert und Renditen
        v = wf[z].value
        p.check(isinstance(v, str) and v.replace(" ", "") == "=H185", f"Frei finanziert!{z}", v, "=H185")
        p.check(norm_numfmt(wf[z].number_format) == norm_numfmt(F_AUFSCHLAG_FREI), f"Frei finanziert!{z} Format",
                wf[z].number_format, F_AUFSCHLAG_FREI)
    for r in UEB_RASTER_ZEILEN:
        soll = F_TILG_E if r == 62 else F_TILG
        p.check(norm_numfmt(wu[f"B{r}"].number_format) == norm_numfmt(soll), f"Übersicht!B{r}",
                wu[f"B{r}"].number_format, soll)
        for col in "DEF":
            p.check(fmt_klasse(wu[f"{col}{r}"].number_format) == "eur0", f"Übersicht!{col}{r}",
                    wu[f"{col}{r}"].number_format, "Euro")
    p.fertig()


# =====================================================================================================
# 8. Prüfungen je Lauf (F2, F8, F13) und Textergebnisse
# =====================================================================================================
def zellsort(z):
    m = re.match(r"([A-Z]+)(\d+)", z)
    return (int(m.group(2)), column_index_from_string(m.group(1)))


def pruefe_lauf(b, lid, proj, aend, res, werte, soll, specs):
    p = b.pruefung("F2", f"{lid} recalc: status = success, total_errors = 0")
    p.gleich("status", res.get("status"), "success", res.get("error"))
    p.zahl("total_errors", res.get("total_errors"), 0, 0, json.dumps(res.get("error_summary", {}))[:200])
    p.fertig()
    if werte is None:
        return
    p = b.pruefung("F7", f"{lid} Projektwahl und gesetzte Eingaben wirken (Spalte „verwendet“)")
    p.gleich("Eingaben!F4 (Aktives_Projekt)", werte.get("Eingaben", "F4"), PROJEKT_NAME[proj])
    p.zahl("Projekt_Nr (Eingaben!D3)", werte.get("Eingaben", "D3"), 1 if proj == "M" else 2, 0)
    for e in EINGABEN:
        ist = werte.get("Eingaben", f"F{e[1]}")
        s = soll.e[e[0]]
        if isinstance(s, str):
            p.gleich(f"F{e[1]} {e[2]}", ist, s)
        else:
            p.zahl(f"F{e[1]} {e[2]}", ist, float(s), 1e-9 * max(1.0, abs(s)))
    p.fertig()
    titel = {"Gefördert": "Gefördert A–C (Zeitreihe, Finanzierung, Restwert, Renditen, Liquidität)",
             FREI: "Frei finanziert", UEB: "Übersicht (Blöcke 1–8, Prüfstatus)", "NBank": "NBank (Lage, Bezugsgrößen)"}
    gruppen = {"Gefördert": [GEF[g] for g in GRUPPEN], FREI: [FREI], UEB: [UEB], "NBank": ["NBank"]}
    for k, blaetter in gruppen.items():
        p = b.pruefung("F8", f"{lid} {titel[k]} gegen Referenzrechnung")
        for blatt in blaetter:
            wb_ = werte.blatt(blatt)
            for zelle in sorted(specs[blatt], key=zellsort):
                vergleiche(p, f"{blatt}!{zelle}", wb_.get(zelle), specs[blatt][zelle], wb_)
        p.fertig()
    if soll.bank_geschlossen:
        b.hinweis("F8", f"{lid}: Laufzeit Bank {soll.laufzeit_bank} Jahre, Zinsbindung {soll.zinsbindung} Jahre; "
                        "Bankpfad geschlossen gerechnet, Kapitaldienst-abhängige Größen gefördert nicht gegen die RR (A9)")
    if any(soll.a2_greift(g, H) for g in GRUPPEN for H in (0, 35)):
        b.hinweis("F8", f"{lid}: Abweichung A2 greift; Restwert und Renditen Jahr 35 nicht gegen die RR verglichen")
    # Selbstprüfung: eigene Zahlungsreihen = RR-Kennzahlen, wenn KG 800 = 0
    if soll.P["kg800"] == 0 and not soll.bank_geschlossen:
        p = b.pruefung("F8", f"{lid} Prüfskript: eigene Zahlungsreihen = RR.kennzahlen (Selbstprüfung)")
        for g in GRUPPEN + ("M",):
            for H in (35, 42):
                kz = soll.l[g].kennzahlen(H)
                for art in ("brutto", "nZ"):
                    for v in ("mit", "oG", "null"):
                        a, r = RR.irr(soll.cf_obj(g, art, H, v)).wert, RR.rv(kz[f"obj_{art}_{v}"])
                        p.check(a == r or (a is not None and r is not None and abs(a - r) < 1e-12),
                                f"{g} obj_{art}_{v} J{H}", a, r)
                if g != "M":
                    for v in ("mit", "oG", "null"):
                        a, r = RR.irr(soll.cf_ek(g, H, v)).wert, RR.rv(kz[f"ek_irr_{v}"])
                        p.check(a == r or (a is not None and r is not None and abs(a - r) < 1e-12),
                                f"{g} ek_irr_{v} J{H}", a, r)
                        p.check(soll.vofi(g, H, v)[1] == kz[f"ek_vofi_{v}"] or
                                abs((soll.vofi(g, H, v)[1] or 0) - (kz[f"ek_vofi_{v}"] or 0)) < 1e-12,
                                f"{g} ek_vofi_{v} J{H}", soll.vofi(g, H, v)[1], kz[f"ek_vofi_{v}"])
        p.fertig()
    # F13 Identitäten
    p = b.pruefung("F13", f"{lid} Identitäten")
    for g in GRUPPEN:
        x = GEF[g]
        h163, h99 = werte.get(x, "H163"), werte.get(x, "H99")
        p.check(ist_zahl(h163) and ist_zahl(h99) and abs(h163 - h99) < 1, f"{x} NBank-Darlehen voll getilgt", h163, h99)
        h103 = werte.get(x, "H103") or 0
        lfz = int(soll.e["6.4"])
        if ist_zahl(h103) and h103 > 0 and lfz <= 42:
            u = werte.get(x, f"U{6 + lfz}")
            p.check(ist_zahl(u) and u < 1, f"{x} Bank getilgt Ende Jahr {lfz}", u, "< 1")
        if werte.get(UEB, f"C{PZ}") == "OK":
            k = werte.get(x, "H105")
            p.check(ist_zahl(k) and abs(k) < 0.01, f"{x} Kasse = 0 bei P1 OK", k, 0)
    # Frei finanziert (Konzept N): Kasse 0, Finanzierung geht auf, Mietwahl, DSCR-Ziel, Aufschläge, nötige Miete
    fw = lambda z: werte.get(FREI, z)                                           # noqa: E731
    zahlen = all(ist_zahl(fw(z)) for z in ("H90", "H91", "H92", "H103", "H104", "H105", "H106", "H109", "H181", "H182",
                                           "H183", "H184", "C7", "D7", "G7", "H7"))
    p.check(zahlen, "Frei: Finanzierung und Miete für das DSCR-Ziel sind Zahlen", zahlen, True)
    if zahlen:
        p.check(abs(fw("H105")) < 0.01, "Frei Kasse bei Bezug = 0", fw("H105"), 0)
        p.check(abs(fw("H103") + fw("H104") - fw("H90") - fw("H91")) < 0.01, "Frei Bank + bares EK = KG 200–800",
                fw("H103") + fw("H104"), fw("H90") + fw("H91"))
        p.check(abs(fw("H106") - fw("H92") - fw("H104")) < 0.01, "Frei Eigenkapital = Grundstück + bar", fw("H106"),
                fw("H92") + fw("H104"))
        # Eigenmittel frei = Eigenmittel 1.11 gefördert, solange gefördert die Eingabe 7.1 ganz aufnimmt (Lücke ≥ 0);
        # sonst liegt frei um den Teil von 7.1 höher, den gefördert nicht braucht (Konzept D.4, N.7)
        for i_, g in enumerate(GRUPPEN):
            em = [werte.get(GEF[g], "H106"), werte.get(GEF[g], "H101")]
            c_ = "DEF"[i_]
            if not all(ist_zahl(x_) for x_ in em):
                p.check(False, f"{GEF[g]} Eigenmittel 1.11", em, "Zahlen")
            elif soll.luecke(g) >= 0:
                p.check(abs(fw("H106") - (em[0] - em[1])) < 0.01, f"Frei Eigenkapital = Eigenmittel 1.11 Gefördert {g}",
                        fw("H106"), em[0] - em[1])
                p.check(ist_zahl(werte.get(UEB, "G19")) and ist_zahl(werte.get(UEB, f"{c_}19"))
                        and abs(werte.get(UEB, "G19") - werte.get(UEB, f"{c_}19")) < 0.01, f"Übersicht G19 = {c_}19",
                        werte.get(UEB, "G19"), werte.get(UEB, f"{c_}19"))
            else:
                p.check(fw("H106") > em[0] - em[1] - 0.01, f"Frei Eigenkapital ≥ Eigenmittel 1.11 Gefördert {g} "
                        "(7.1 über dem Bankdarlehen gefördert)", fw("H106"), em[0] - em[1])
        nb = werte.get("Eingaben", "F29"), werte.get("Eingaben", "F8")
        noetig = (fw("H181") * fw("H182") - fw("G7") - fw("H7")) / ((1 - nb[0]) * nb[1] * 12)
        p.check(abs(fw("H183") - noetig) < 1e-9, "Frei nötige Miete = (Ziel × Kapitaldienst + Kosten) ÷ Ertrag je €/m²",
                fw("H183"), noetig)
        if fw("H184") > 0:
            p.check(ist_zahl(fw("H185")) and abs(fw("H185") - (fw("H109") / fw("H184") - 1)) < 1e-12,
                    "Frei Aufschlag gerechnete Miete", fw("H185"), fw("H109") / fw("H184") - 1)
            p.check(ist_zahl(fw("H186")) and abs(fw("H186") - (fw("H183") / fw("H184") - 1)) < 1e-12,
                    "Frei Aufschlag nötige Miete", fw("H186"), fw("H183") / fw("H184") - 1)
        else:                                     # Marktmiete 0: Aufschlag nicht bestimmt, „–“ in allen Ausweisen
            for z_ in ("H185", "H186", "J116", "J131"):
                p.gleich(f"Frei {z_} bei Marktmiete 0", fw(z_), "–")
            for z_ in UEB_AUFSCHLAG + ("G114", "G115"):
                p.gleich(f"Übersicht {z_} bei Marktmiete 0", werte.get(UEB, z_), "–")
        p.check(abs(fw("D7") - fw("H109")) < 1e-12, "Frei Miete Jahr 1 der Zeitreihe = Miete Jahr 1", fw("D7"), fw("H109"))
        if soll.e["10.1"] == "Marktmiete":
            p.check(abs(fw("H109") - fw("C7")) < 1e-12 and fw("H185") in (0, "–"),
                    "Frei Schalter Marktmiete: Miete = Marktmiete", fw("H109"), fw("C7"))
        else:
            p.check(abs(fw("H109") - fw("H183")) < 1e-12, "Frei Schalter DSCR-Ziel: Miete = nötige Miete", fw("H109"),
                    fw("H183"))
            if fw("H182") > 1:
                p.check(ist_zahl(fw("H156")) and abs(fw("H156") - soll.dscr_ziel) < 1e-9,
                        "Frei Schalter DSCR-Ziel: DSCR Jahr 1 = DSCR-Ziel", fw("H156"), soll.dscr_ziel)
                p.check(ist_zahl(fw("H155")) and abs(fw("H155") - (soll.dscr_ziel - 1) * fw("H182")) < 0.01,
                        "Frei Schalter DSCR-Ziel: Zahlungsüberschuss Jahr 1 = (Ziel − 1) × Kapitaldienst", fw("H155"),
                        (soll.dscr_ziel - 1) * fw("H182"))
        lfz = int(soll.e["6.4"])
        if fw("H103") > 0 and lfz <= 42:
            u = fw(f"O{6 + lfz}")
            p.check(ist_zahl(u) and u < 1, f"Frei Bank getilgt Ende Jahr {lfz}", u, "< 1")
    # Laufzeit Bank ≤ Zinsbindung (Konzept N.8): keine Restschuld am Ende der Zinsbindung, keine Annuität danach,
    # Bank am Ende der Laufzeit getilgt (unter 1 €, Restschulden sind auf Cent gerundet), kein Kapitaldienst Bank im
    # Folgejahr; gilt für Frei und für jedes Blatt Gefördert mit Bankdarlehen
    lfz, zb_ = int(soll.e["6.4"]), int(soll.e["6.2"])
    if lfz <= zb_:
        for x, (cz, ct, cr) in [(GEF[g], ("O", "P", "U")) for g in GRUPPEN] + [(FREI, ("J", "K", "O"))]:
            h103 = werte.get(x, "H103")
            if not (ist_zahl(h103) and h103 > 0):
                continue
            for z_ in ("H112", "H114"):
                v = werte.get(x, z_)
                p.check(ist_zahl(v) and abs(v) < 0.01, f"{x} {z_} = 0 bei Laufzeit ≤ Zinsbindung", v, 0)
            if lfz < 42:
                u = werte.get(x, f"{cr}{6 + lfz}")
                kd = [werte.get(x, f"{c_}{7 + lfz}") for c_ in (cz, ct)]
                p.check(ist_zahl(u) and u < 1, f"{x} Restschuld Bank Ende Jahr {lfz}", u, "< 1")
                p.check(all(ist_zahl(v) for v in kd) and abs(sum(kd)) < 1,
                        f"{x} Kapitaldienst Bank Jahr {lfz + 1}", kd, "unter 1 €")
    for g in GRUPPEN:                             # nötige Miete gefördert: dieselbe Formel mit dem Kapitaldienst Q7
        x = GEF[g]
        v = [werte.get(x, z) for z in ("H181", "H182", "H183", "Q7", "I7", "J7", "H110")]
        if all(ist_zahl(a_) for a_ in v):
            nb = werte.get("Eingaben", "F29"), werte.get("Eingaben", "F8")
            regel = v[6] if int(soll.e["3.2"]) > 0 else 0.0   # Tilgungsaufschub: Regeltilgung NBank kommt dazu
            p.check(abs(v[1] + v[3] - regel) < 0.005 and abs(v[2] - (v[0] * v[1] - v[4] - v[5]) / ((1 - nb[0]) * nb[1] * 12)) < 1e-9,
                    f"{x} nötige Miete aus Kapitaldienst Jahr 1", v[2], "(Ziel × Kapitaldienst + Kosten) ÷ Ertrag")
        else:
            p.check(False, f"{x} Miete für das DSCR-Ziel", v, "Zahlen")
    if soll.e["8.2"] == "Marktmiete" and soll.e["10.1"] == "Marktmiete":
        a, f = werte.get(GEF["A"], "J122"), werte.get(FREI, "J122")
        p.check(ist_zahl(a) and ist_zahl(f) and abs(a - f) < 1, "Ertragswert gefördert = frei (Zielmiete Marktmiete)", a, f)
    if int(soll.e["3.2"]) == 0:
        for c in "DEF":
            a, j = werte.get(UEB, f"{c}62"), werte.get(UEB, f"{c}38")
            p.check(ist_zahl(a) and ist_zahl(j) and abs(a - j) < 1, f"Übersicht {c}62 = {c}38", a, j)
    # Rechenweg S. 12 geht auf (Runde 2): 4.13 − 4.14 − 4.15 = 4.16
    for c in "EF":
        v = [werte.get(UEB, f"{c}{z}") for z in (67, 68, 69, 70)]
        p.check(all(ist_zahl(x) for x in v) and abs(v[0] - v[1] - v[2] - v[3]) < 0.01,
                f"Übersicht {c}67 − {c}68 − {c}69 = {c}70", v, "Summe 0")
    p.zahl("Laufzeit_max", werte.get("Tabellen", "D21"), 42, 0)
    p.check(ist_zahl(werte.get("Tabellen", "D33")) and werte.get("Tabellen", "D33") <= 80, "GND ≤ 80",
            werte.get("Tabellen", "D33"), "≤ 80")
    for x in list(GEF.values()) + [FREI]:
        p.zahl(f"{x} A48 = t 42", werte.get(x, "A48"), 42, 0)
        p.zahl(f"{x} A86 = t 80", werte.get(x, "A86"), 80, 0)
    p.fertig()


ERLAUBTE_TEXTE = {"OK", "prüfen", "über", "unter", "A", "B", "C", "n. v.", "–", "", "ja", "nein", "Marktmiete",
                  "Vergleichsmiete", "Miete für DSCR-Ziel"} | set(MIETENSTUFEN) | set(PROJEKT_NAME.values())


def pruefe_formeltexte(b, wb, laeufe):
    p = b.pruefung("F6", "Keine Formel-Prosa: Formeln liefern nur Zahlen oder Statuswörter")
    orte = [(s, c.coordinate) for s, c in alle_formeln(wb)]
    for lid, werte in laeufe:
        for s, z in orte:
            v = werte.get(s, z)
            if isinstance(v, str) and v not in ERLAUBTE_TEXTE:
                p.check(False, f"{lid} {s}!{z}", v[:60], "Zahl oder Statuswort")
        p.check(True, f"{lid}: {len(orte)} Formeln geprüft")
    p.fertig()


def pruefe_gelieferte_werte(b, gel, l1):
    p = b.pruefung("F2", "Gelieferte Mappe neu berechnet, Modellhaus aktiv (Zwischenwerte = Lauf L1)")
    fehler = []
    for blatt in (UEB, "NBank") + tuple(GEF.values()) + (FREI,):
        for z, v in l1.blatt(blatt).items():
            g = gel.get(blatt, z)
            if ist_zahl(v):
                ok = ist_zahl(g) and abs(g - v) <= 1e-6 * max(1.0, abs(v))
            else:
                ok = g == v
            p.check(ok, f"{blatt}!{z}", g, v)
    for blatt, m in gel.d.items():
        for z, v in m.items():
            if isinstance(v, str) and v.strip() in ("#VALUE!", "#DIV/0!", "#REF!", "#NAME?", "#NULL!", "#NUM!", "#N/A"):
                fehler.append(f"{blatt}!{z}")
    p.check(not fehler, "Fehlerwerte im Zwischenspeicher", fehler[:5], "keine")
    p.fertig()


REGRESSION_STATUS = ("OK", "prüfen", "n. v.", "–", "A", "B", "C")
REGRESSION_UMBENANNT = {("P2", "Auswahlfelder 4.1, 4.2 und 8.2 gültig"): ("P2", "Auswahlfelder 4.1, 4.2, 8.2 und 10.1 gültig")}
REGRESSION_FREI = {"Ertragswert zur Marktmiete": "Ertragswert zur gerechneten Miete",
                   "Ertragswert Marktmiete gegenüber Gesamtkosten": "Ertragswert gegenüber Gesamtkosten"}


def pruefe_regression(b, lid, alt, neu):
    """Entscheidung 7 (Konzept N): Mit Schalter „Marktmiete“ sind alle Zellwerte der Blätter Gefördert A/B/C und
    NBank, der Übersicht-Spalten D–F und H–J (Zeilen nach Nr. und Bezeichnung zugeordnet) und die bisherigen
    Frei-Objektwerte (nach Spaltenkopf bzw. Bezeichnung zugeordnet) gleich dem Stand vorher (Toleranz 1e-9)."""
    def gl(a, c):
        if ist_zahl(a) and ist_zahl(c):
            return abs(a - c) <= 1e-9 * max(1.0, abs(a))
        return (norm_text(a) if isinstance(a, str) else a) == (norm_text(c) if isinstance(c, str) else c)

    p = b.pruefung("N", f"{lid} Regression: Gefördert A/B/C und NBank zellgleich dem Stand vorher")
    n = 0
    for blatt in list(GEF.values()) + ["NBank"]:
        for z, v in alt.blatt(blatt).items():
            n += 1
            if not gl(v, neu.get(blatt, z)):
                p.check(False, f"{blatt}!{z}", neu.get(blatt, z), v)
    p.check(n > 5000, "verglichene Zellen", n, "> 5000")
    p.fertig()

    p = b.pruefung("N", f"{lid} Regression: Übersicht Spalten D–F und H–J, Prüfstatus (Zuordnung nach Bezeichnung)")
    ua, un = alt.blatt(UEB), neu.blatt(UEB)

    def schluessel(u):
        out = {}
        for r in range(7, 200):
            a_, b_ = u.get(f"A{r}"), u.get(f"B{r}")
            if a_ is None and b_ is None:
                continue
            out.setdefault((str(a_) if a_ is not None else "", norm_text(b_) if isinstance(b_, str) else b_), []).append(r)
        return out
    ka, kn = schluessel(ua), schluessel(un)
    n = 0
    for k, rs in ka.items():
        k2 = REGRESSION_UMBENANNT.get(k, k)
        if k2 not in kn or len(kn[k2]) != len(rs):
            p.check(False, f"Übersicht Zeile {rs} {k}", None, "eindeutige Zuordnung")
            continue
        for ra, rn in zip(rs, kn[k2]):
            for col in "CDEFHIJ":
                if col == "C" and not k[0].startswith("P"):
                    continue                      # Einheit/Satz; Status nur in den Prüfzeilen
                va, vn = ua.get(f"{col}{ra}"), un.get(f"{col}{rn}")
                if any(isinstance(x, str) and x not in REGRESSION_STATUS for x in (va, vn)):
                    continue                      # Bemerkungstext (Spalte H der Blöcke ohne Horizont), kein Ergebnis
                n += 1
                if not gl(va, vn):
                    p.check(False, f"Übersicht!{col}{rn} ({k[0]} {k[1]})", vn, va)
    p.check(gl(ua.get("D3"), un.get("D3")), "Übersicht!D3", un.get("D3"), ua.get("D3"))
    p.check(n > 300, "verglichene Zellen", n, "> 300")
    p.fertig()

    p = b.pruefung("N", f"{lid} Regression: bisherige Frei-Objektwerte (Zeitreihe, Restwert, Objekt-IRR)")
    fa, fn = alt.blatt(FREI), neu.blatt(FREI)
    kopf = lambda f: {norm_text(v): re.match(r"[A-Z]+", z).group(0) for z, v in f.items()        # noqa: E731
                      if re.fullmatch(r"[A-Z]+5", z) and isinstance(v, str)}
    ka, kn = kopf(fa), kopf(fn)
    n = 0
    for k, ca in ka.items():
        cn = kn.get(k)
        if cn is None:
            p.check(False, f"Frei Spalte „{k}“", None, "vorhanden")
            continue
        for r in range(6, 87):
            va, vn = fa.get(f"{ca}{r}"), fn.get(f"{cn}{r}")
            if va is None and vn is None:
                continue
            n += 1
            if not gl(va, vn):
                p.check(False, f"Frei!{cn}{r} ({k})", vn, va)
    for r in range(7, 87):                        # Schalter „Marktmiete“: gerechnete Miete = Marktmiete vorher
        n += 1
        if not gl(fa.get(f"C{r}"), fn.get(f"D{r}")):
            p.check(False, f"Frei!D{r} Miete gerechnet", fn.get(f"D{r}"), fa.get(f"C{r}"))
    bez = {}
    for z, v in fn.items():
        if re.fullmatch(r"A\d+", z) and int(z[1:]) >= 88 and isinstance(v, str):
            bez.setdefault(norm_text(v), []).append(int(z[1:]))
    for z, v in fa.items():
        if not (re.fullmatch(r"A\d+", z) and int(z[1:]) >= 88 and isinstance(v, str)):
            continue
        ra = int(z[1:])
        if norm_text(v) in ("Größe", "Kennzahl") or not any(fa.get(f"{c}{ra}") is not None for c in "HIJ"):
            continue
        if norm_text(v) == "Marktmiete Jahr 1":
            rn = [184]
        else:
            rn = bez.get(REGRESSION_FREI.get(norm_text(v), norm_text(v)))
        if not rn or len(rn) != 1:
            p.check(False, f"Frei Zeile {ra} „{v}“", rn, "eindeutige Zuordnung")
            continue
        for c in "HIJ":
            va, vn = fa.get(f"{c}{ra}"), fn.get(f"{c}{rn[0]}")
            if va is None:
                continue
            n += 1
            if not gl(va, vn):
                p.check(False, f"Frei!{c}{rn[0]} ({v})", vn, va)
    p.check(n > 800, "verglichene Zellen", n, "> 800")
    p.fertig()


def hole_baseline(ordner):
    """Stand vorher aus dem Repository in den Arbeitsordner holen (git show COMMIT:PFAD); None, wenn nicht erreichbar."""
    ziel = Path(ordner) / "stand_vorher.xlsx"
    try:
        r = subprocess.run(["git", "-C", str(VOFI_DIR), "show", f"{BASELINE_COMMIT}:{BASELINE_GIT}"],
                           capture_output=True, timeout=60)
    except (OSError, subprocess.TimeoutExpired):
        return None
    if r.returncode != 0 or len(r.stdout) < 10000:
        return None
    ziel.write_bytes(r.stdout)
    return ziel


def baseline_lauf(baseline, ordner, proj, timeout):
    """Stand vorher mit aktivem Projekt proj neu berechnen (Kopie) und lesen."""
    ziel = Path(ordner) / f"baseline_{proj}.xlsx"
    shutil.copy(baseline, ziel)
    wb = openpyxl.load_workbook(ziel)
    wb["Eingaben"]["D3"] = 1 if proj == "M" else 2
    wb.save(ziel)
    wb.close()
    res = recalc(ziel, timeout)
    return Werte(ziel) if res.get("status") == "success" and not res.get("total_errors") else None


def pruefe_gleich_l1(b, lid, werte, l1):
    p = b.pruefung("F7", f"{lid} Ergebnisse Übersicht = L1")
    for z, v in l1.blatt(UEB).items():
        g = werte.get(UEB, z)
        if ist_zahl(v):
            p.zahl(f"Übersicht!{z}", g, v, 1e-6 * max(1.0, abs(v)))
        else:
            p.gleich(f"Übersicht!{z}", g, v)
    p.fertig()


# =====================================================================================================
# 9. Konzept-Sollwerte (F.3, F.4, F.5, D.2a) – deutsche Zahlen, Toleranz = gezeigte Stelle
# =====================================================================================================
def _abc(zeile, a, b_, c, blatt=UEB, spalten="DEF"):
    return [(blatt, f"{spalten[i]}{zeile}", v) for i, v in enumerate((a, b_, c)) if v is not None]


def _gef(zelle, a, b_, c):
    return [(GEF[g], zelle, v) for g, v in zip(GRUPPEN, (a, b_, c)) if v is not None]


def _vier(zeile, a35, a42, b35, b42, c35, c42, f35=None, f42=None):
    out = _abc(zeile, a35, b35, c35) + _abc(zeile, a42, b42, c42, spalten="HIJ")
    if f35 is not None:
        out += [(UEB, f"G{zeile}", f35), (UEB, f"K{zeile}", f42)]
    return out


KONZEPT = {"L1": [], "L2": [], "L3": [], "L4": [], "L5": [], "L7": [], "L8": [], "L10": [], "L11": [], "L12": []}
_K = KONZEPT["L1"]
for _z, _w in {9: ("7.000.000",) * 3, 10: ("7.000.000",) * 3, 11: ("0",) * 3, 12: ("0",) * 3,
               13: ("2.800.000", "4.200.000", "4.900.000"), 14: ("2.800.000", "1.400.000", "700.000"),
               15: ("5.600.000",) * 3, 16: ("80,0 %",) * 3, 17: ("3.918.544,27", "3.098.816,40", "2.688.952,47"),
               18: ("0",) * 3, 19: ("1.400.000",) * 3,
               20: ("20,0 %",) * 3, 21: ("49.000", "52.500", "54.250"), 22: ("1.449.000", "1.452.500", "1.454.250"),
               23: ("749.000", "752.500", "754.250"), 24: ("140.000", "70.000", "35.000"), 25: ("70.000",) * 3,
               26: ("6,80", "8,20", "9,00"), 29: ("114.240,00", "137.760,00", "151.200,00"),
               30: ("2.284,80", "2.755,20", "3.024,00"), 31: ("7.340,00",) * 3, 32: ("20.160,00",) * 3,
               33: ("84.455,20", "107.504,80", "120.676,00"), 34: ("14.000,00", "21.000,00", "24.500,00"),
               35: ("0",) * 3, 36: ("70.000,00", "105.000,00", "122.500,00"), 37: ("0",) * 3,
               38: ("455,20", "−18.495,20", "−26.324,00"), 39: ("49.000", "52.500", "54.250"),
               42: ("20.192,26", "7.336,41", "2.877,71"), 43: ("89.837,47", "98.228,43", "105.598,26"),
               44: ("248.897,22", "312.892,19", "349.460,75"), 45: ("1,0054", "0,8532", "0,8209"),
               46: ("1,0005", "0,8515", "0,8202"), 47: ("0", "9", "9"), 48: ("0", "−92.052,06", "−151.921,55"),
               49: ("2,5163 %", "2,0596 %", "1,9628 %"), 50: ("350.000", "525.000", "612.500"), 51: ("0",) * 3,
               52: ("0",) * 3, 55: ("70.455,20", "86.504,80", "96.176,00"), 56: ("42.455,20", "44.504,80", "47.176,00"),
               57: ("28.455,20", "23.504,80", "22.676,00"), 58: ("14.455,20", "2.504,80", "−1.824,00"),
               59: ("3.788,53", "−13.495,20", "−20.490,67"), 60: ("455,20", "−18.495,20", "−26.324,00"),
               61: ("−13.544,80", "−39.495,20", "−50.824,00"), 62: ("455,20", "−18.495,20", "−26.324,00")}.items():
    _K += _abc(_z, *_w)
_K += [(UEB, "E63", "1,1464 %"), (UEB, "F64", "1,2248 %"), (UEB, "F65", "1,3816 %"),
       (UEB, "E66", "1.400.000"), (UEB, "F66", "2.100.000"), (UEB, "E67", "23.520,00"), (UEB, "F67", "36.960,00"),
       (UEB, "E68", "470,40"), (UEB, "F68", "739,20"), (UEB, "E69", "7.000,00"), (UEB, "F69", "10.500,00"),
       (UEB, "E70", "16.049,60"), (UEB, "F70", "25.720,80"), (UEB, "E71", "−18.950,40"), (UEB, "F71", "−26.779,20"),
       (UEB, "E72", "3.500"), (UEB, "F72", "5.250"), (UEB, "G55", "=C"), (UEB, "G56", "=C")]
_K += [(UEB, f"G{_r}", "=A") for _r in range(57, 63)]
_K += _gef("R8", "255,20", "−18.520,20", "−26.261,50") + _gef("R9", "44,20", "−18.556,20", "−26.210,00")
_K += _vier(76, "5,3570 %", "5,3210 %", "5,0760 %", "5,0695 %", "4,9959 %", "4,9968 %", "4,6281 %", "4,6577 %")
_K += _vier(77, "2,5173 %", "3,2253 %", "2,3706 %", "3,1369 %", "2,3783 %", "3,1623 %", "2,6025 %", "3,3191 %")
_K += _vier(78, "4,0390 %", "4,1558 %", "3,5459 %", "3,7124 %", "3,3827 %", "3,5627 %", "4,6281 %", "4,6577 %")
_K += _vier(81, "1,0089 %", "1,8793 %", "0,6148 %", "1,5732 %", "0,5254 %", "1,5129 %", "2,6025 %", "3,3191 %")
_K += _vier(82, "−0,1143 %", "1,2010 %", "−0,3215 %", "1,0105 %", "−0,3249 %", "1,0036 %", "2,1896 %", "3,0659 %")
_K += _vier(79, "2,1152 %", "2,4771 %", "2,6804 %", "2,9528 %", "2,9667 %", "3,1962 %", "4,6281 %", "4,6577 %")
_K += _vier(83, "−1,1493 %", "−0,0253 %", "−0,3649 %", "0,7078 %", "0,0527 %", "1,0951 %", "2,6025 %", "3,3191 %")
_K += _vier(84, "−2,4606 %", "−0,8327 %", "−1,3737 %", "0,0960 %", "−0,8297 %", "0,5641 %", "2,1896 %", "3,0659 %")
_K += _abc(85, "1,2065 %", "1,5358 %", "1,7239 %") + [(FREI, "H139", "3,0128 %")]      # Frei nur auf dem Blatt
# Frei in Block 6 (G, K): Abschnitt N.8; „=n. v.“ = Text (Endvermögen ≤ 0)
_K += _vier(89, "6,0348 %", "5,8983 %", "5,8463 %", "5,7305 %", "5,8121 %", "5,6997 %", "5,3681 %", "5,3143 %")
_K += _vier(90, "1,5306 %", "2,9175 %", "0,7192 %", "2,6385 %", "0,4698 %", "2,6260 %", "1,0270 %", "2,8936 %")
_K += _vier(94, "−1,5014 %", "1,8157 %", "−3,6394 %", "1,5663 %", "−4,6876 %", "1,6054 %", "−0,3830 %", "2,3174 %")
_K += _vier(91, "5,7242 %", "5,5151 %", "5,7514 %", "5,5578 %", "5,7730 %", "5,5821 %", "5,5180 %", "5,4237 %")
_K += _vier(92, "1,6313 %", "2,7146 %", "0,7574 %", "2,5071 %", "0,3234 %", "2,4626 %", "=n. v.", "1,1656 %")
_K += _vier(95, "−0,1514 %", "1,8697 %", "−2,0134 %", "1,5760 %", "−3,2989 %", "1,5125 %", "=n. v.", "−0,8709 %")
_K += _vier(93, "86,48 %", "77,16 %", "93,07 %", "80,11 %", "95,67 %", "80,81 %", "120,52 %", "92,47 %")
_K += _abc(96, "0", "−121.719,23", "−218.293,08") + [(UEB, "G96", "−3.192.817,19")]     # 6.8, Abschnitt N.7
_K += _vier(101, *(("1.178.716,92", "1.308.192,98") * 4))
for _z in (100, 104):
    _K += _vier(_z, "8.792.243,99", "10.657.902,45", "9.570.534,13", "11.282.394,83", "9.919.955,64", "11.505.426,09",
                "11.056.129,02", "11.899.358,54")
_K += _vier(105, "2.263.885,03", "1.241.456,10", "1.485.594,88", "616.963,72", "1.136.173,37", "393.932,45")
_K += _vier(106, *(("2,80 %", "2,70 %") * 4))
_K += _abc(103, "−54,68 %", "−45,96 %", "−41,21 %") + [(UEB, "G103", "−10,39 %")]
_K += _abc(107, "−10,39 %", "−10,39 %", "−10,39 %")
_K += _gef("H174", "3.918.544,27", "3.098.816,40", "2.688.952,47")
_K += _abc(30, "1.139.544,27", "1.709.316,40", "1.994.202,47", blatt="NBank")
_K += _abc(31, "3.918.544,27", "3.098.816,40", "2.688.952,47", blatt="NBank")
for _r in (11, 12, 14, 15):
    _K += _abc(_r, "=über", "=über", "=über", blatt="NBank", spalten="GHI")
for _r in range(17, 25):
    _K += _abc(_r, "=unter", "=unter", "=unter", blatt="NBank", spalten="GHI")

_K = KONZEPT["L2"]
_K += _abc(38, "13.591,36", "9.443,08", "8.342,67") + _abc(22, "613.426,28", "614.907,99", "615.648,84")
_K += _abc(45, "1,3822", "1,1770", "1,1341") + _abc(18, "0", "0", "0")
_K += _abc(13, "1.185.364,80", "1.778.047,20", "2.074.388,40") + _abc(14, "1.185.364,80", "592.682,40", "296.341,20")
_K += _abc(21, "20.743,88", "22.225,59", "22.966,44")
_K += _gef("H110", "29.634,12", "44.451,18", "51.859,71") + _gef("I123", "4.958.369,14", "5.418.698,12", "5.625.370,66")
_K += _gef("J123", "5.979.202,22", "6.348.581,36", "6.480.508,97") + _gef("J143", "6,489 %", "6,661 %", "6,753 %")
_K += _gef("J140", "7,683 %", "7,790 %", "7,914 %")
_K += _vier(78, "5,31 %", "5,28 %", "4,83 %", "4,85 %", "4,68 %", "4,72 %", "6,27 %", "6,17 %")
_K += _vier(82, "1,54 %", "2,66 %", "1,33 %", "2,46 %", "1,34 %", "2,46 %")
_K += _vier(79, "3,23 %", "3,45 %", "3,89 %", "4,02 %", "4,23 %", "4,31 %", "6,27 %", "6,17 %")
_K += _vier(76, "6,77 %", "6,59 %", "6,53 %", "6,38 %", "6,48 %", "6,34 %", "6,27 %", "6,17 %")
_K += _vier(94, "3,03 %", "4,66 %", "3,02 %", "4,90 %", "3,26 %", "5,17 %")
_K += _vier(95, "2,55 %", "3,52 %", "2,56 %", "3,74 %", "2,70 %", "3,92 %")
_K += [(UEB, "E63", "1,80 %"), (UEB, "F64", "1,91 %")] + _abc(49, "3,65 %", "3,03 %", "2,90 %")
_K += _abc(30, "482.419,88", "723.629,82", "844.234,79", blatt="NBank")
_K += _abc(24, "=über", "=über", "=über", blatt="NBank", spalten="GHI")

KONZEPT["L3"] += _abc(18, "0", "0", "0") + _gef("H105", "0", "0", "0") + _abc(20, "20,0 %", "20,0 %", "20,0 %")
KONZEPT["L3"] += _abc(22, "686.729,12", "688.387,89", "689.217,27") + _abc(38, "9.341,92", "3.068,92", "906,15")
KONZEPT["L3"] += _abc(91, "6,2004 %", "6,3374 %", "6,4140 %", spalten="HIJ")
KONZEPT["L3"] += _abc(89, "7,0575 %", "7,0573 %", "7,1194 %", spalten="HIJ")
_K = KONZEPT["L4"]
_K += _abc(18, *("309.386,40",) * 3) + _abc(23, "23.222,72", "24.881,49", "25.710,87") + _abc(20, *("22,04 %",) * 3)
_K += _abc(38, "−7.989,43", "−14.262,43", "−16.425,20") + _abc(45, "0,8602", "0,8149", "0,8112")
_K += _abc(91, "5,7568 %", "5,8831 %", "5,9607 %", spalten="HIJ") + _abc(89, "5,9112 %", "5,9723 %", "6,0488 %", spalten="HIJ")
_K += _abc(22, "754.548", "756.206", "757.036") + _abc(47, "9", "10", "11") + _abc(48, "−41.408", "−87.179", "−100.984")
_K += _abc(92, "3,18 %", "3,22 %", "3,34 %", spalten="HIJ") + _abc(90, "3,34 %", "3,40 %", "3,53 %", spalten="HIJ")
_K += _abc(78, "4,34 %", "4,04 %", "3,95 %", spalten="HIJ")
KONZEPT["L5"] += _abc(18, "0", "0", "0") + _abc(22, "1.063.934,12", "1.065.592,89", "1.066.422,27")
KONZEPT["L5"] += _abc(38, "9.341,92", "3.068,92", "906,15") + _abc(91, "5,1727 %", "5,3065 %", "5,3813 %", spalten="HIJ")
KONZEPT["L5"] += _abc(89, "5,7016 %", "5,7662 %", "5,8382 %", spalten="HIJ")
KONZEPT["L7"] += [(UEB, f"C{PZ + 2}", "=OK")] + [(GEF[g], "U31", "<1") for g in GRUPPEN]
KONZEPT["L8"] += _gef("H113", "0,74 %", "0,74 %", "0,74 %") + [(UEB, f"C{PZ + 2}", "=prüfen"), (UEB, "D3", "=prüfen")]
_K = KONZEPT["L10"]
_K += _abc(9, *("7.980.000",) * 3) + _abc(10, *("7.700.000",) * 3) + _abc(11, *("280.000",) * 3)
_K += _abc(15, *("6.160.000",) * 3) + _abc(16, *("77,19 %",) * 3) + _gef("H102", *("840.000",) * 3)
_K += _abc(18, *("280.000",) * 3) + _abc(19, *("1.540.000",) * 3) + _abc(22, "1.593.900", "1.597.750", "1.599.675")
_K += _abc(38, "−19.963,30", "−41.280,37", "−50.292,50") + [(UEB, f"C{r}", "=OK") for r in UEB_PRUEF]
_K += [(UEB, "D3", "=OK")]
KONZEPT["L11"] += _gef("H105", "281.900", "277.750", "275.675") + _abc(PZ, "281.900", "277.750", "275.675")
KONZEPT["L11"] += [(UEB, f"C{PZ}", "=prüfen"), (UEB, f"C{PZ + 3}", "=prüfen"), (UEB, "D3", "=prüfen")]
KONZEPT["L11"] += [("NBank", f"{c}{r}", "=–") for r in NB_MATRIX for c in "GHI"]
KONZEPT["L11"] += [(UEB, f"{c}{r}", "#") for c in "GK" for r in (76, 78, 79)]
KONZEPT["L12"] += [(UEB, "D18", "0"), (UEB, "D23", "849.000")]


# ---- Vorgabe 3.1 seit 10.11.2026: Modellhaus mit Tilgung 1/42 (linear über die Höchstlaufzeit) ---------------------------------
# Die Tabellen oben nennen die Sollwerte des Modellhauses bei Tilgung 2,5 %; sie gelten unverändert für L63 (3.1 = 2,5 %).
# Für L1 (Vorgabe 1/42) weichen die folgenden Zellen ab. Gerechnet prüft F8 jeden Wert gegen die Referenzrechnung; hier steht
# die Anzeige der Mappe in der Schreibweise des Konzepts („=…“: Text in der Zelle).
KONZEPT["L63"] = list(KONZEPT["L1"])
_L1_TILGUNG_42 = {
    ("Übersicht", "D17"): "3.945.457,05", ("Übersicht", "E17"): "3.139.185,52", ("Übersicht", "F17"): "2.736.049,81",
    ("Übersicht", "D36"): "66.666,67", ("Übersicht", "E36"): "100.000,00", ("Übersicht", "F36"): "116.666,67",
    ("Übersicht", "D38"): "3.788,53", ("Übersicht", "E38"): "−13.495,20", ("Übersicht", "F38"): "−20.490,67",
    ("Übersicht", "D42"): "23.375,59", ("Übersicht", "E42"): "12.111,41", ("Übersicht", "F42"): "8.448,54",
    ("Übersicht", "D43"): "92.604,14", ("Übersicht", "E43"): "102.378,43", ("Übersicht", "F43"): "110.439,93",
    ("Übersicht", "D44"): "179.404,03", ("Übersicht", "E44"): "208.652,19", ("Übersicht", "F44"): "227.847,56",
    ("Übersicht", "D45"): "1,0470", ("Übersicht", "E45"): "0,8885", ("Übersicht", "F45"): "0,8548",
    ("Übersicht", "D46"): "1,0418", ("Übersicht", "E46"): "0,8866", ("Übersicht", "F46"): "0,8540", ("Übersicht", "E47"): "6",
    ("Übersicht", "E48"): "−57.036,14", ("Übersicht", "F48"): "−100.471,55", ("Übersicht", "D50"): "466.667",
    ("Übersicht", "E50"): "700.000", ("Übersicht", "F50"): "816.667", ("Übersicht", "D62"): "3.788,53",
    ("Übersicht", "E62"): "−13.495,20", ("Übersicht", "F62"): "−20.490,67", ("Übersicht", "E71"): "−17.283,73",
    ("Übersicht", "F71"): "−24.279,20", ("Gefördert A", "R8"): "3.571,87", ("Gefördert B", "R8"): "−13.545,20",
    ("Gefördert C", "R8"): "−20.457,33", ("Gefördert A", "R9"): "3.344,20", ("Gefördert B", "R9"): "−13.606,20",
    ("Gefördert C", "R9"): "−20.435,00", ("Übersicht", "D76"): "5,3954 %", ("Übersicht", "E76"): "5,1223 %",
    ("Übersicht", "F76"): "5,0452 %", ("Übersicht", "H76"): "5,3552 %", ("Übersicht", "I76"): "5,1108 %",
    ("Übersicht", "J76"): "5,0411 %", ("Übersicht", "D77"): "2,5617 %", ("Übersicht", "E77"): "2,4241 %",
    ("Übersicht", "F77"): "2,4355 %", ("Übersicht", "H77"): "3,2651 %", ("Übersicht", "I77"): "3,1848 %",
    ("Übersicht", "J77"): "3,2135 %", ("Übersicht", "D89"): "6,1063 %", ("Übersicht", "E89"): "5,9440 %",
    ("Übersicht", "F89"): "5,9225 %", ("Übersicht", "H89"): "5,9631 %", ("Übersicht", "I89"): "5,8184 %",
    ("Übersicht", "J89"): "5,7990 %", ("Übersicht", "D90"): "1,5681 %", ("Übersicht", "E90"): "0,7323 %",
    ("Übersicht", "F90"): "0,4677 %", ("Übersicht", "H90"): "2,9656 %", ("Übersicht", "I90"): "2,6944 %",
    ("Übersicht", "J90"): "2,6885 %", ("Übersicht", "D94"): "−1,7028 %", ("Übersicht", "H94"): "1,8337 %",
    ("Übersicht", "I94"): "1,5752 %", ("Übersicht", "J94"): "1,6181 %", ("Übersicht", "D91"): "5,7353 %",
    ("Übersicht", "E91"): "5,7795 %", ("Übersicht", "F91"): "5,8134 %", ("Übersicht", "H91"): "5,5194 %",
    ("Übersicht", "I91"): "5,5722 %", ("Übersicht", "J91"): "5,6043 %", ("Übersicht", "D92"): "1,6737 %",
    ("Übersicht", "E92"): "0,8999 %", ("Übersicht", "F92"): "0,5594 %", ("Übersicht", "H92"): "2,7275 %",
    ("Übersicht", "I92"): "2,5547 %", ("Übersicht", "J92"): "2,5377 %", ("Übersicht", "D95"): "−0,0746 %",
    ("Übersicht", "E95"): "−1,6592 %", ("Übersicht", "F95"): "−2,5489 %", ("Übersicht", "H95"): "1,8878 %",
    ("Übersicht", "I95"): "1,6450 %", ("Übersicht", "J95"): "1,6217 %", ("Übersicht", "D93"): "86,17 %",
    ("Übersicht", "E93"): "92,21 %", ("Übersicht", "F93"): "94,39 %", ("Übersicht", "H93"): "77,03 %",
    ("Übersicht", "I93"): "79,65 %", ("Übersicht", "J93"): "80,10 %", ("Übersicht", "E96"): "−67.599,69",
    ("Übersicht", "F96"): "−133.137,63", ("Gefördert A", "H174"): "3.945.457,05", ("Gefördert B", "H174"): "3.139.185,52",
    ("Gefördert C", "H174"): "2.736.049,81", ("NBank", "D30"): "1.166.457,05", ("NBank", "E30"): "1.749.685,52",
    ("NBank", "F30"): "2.041.299,81", ("NBank", "D31"): "3.945.457,05", ("NBank", "E31"): "3.139.185,52",
    ("NBank", "F31"): "2.736.049,81", ("Übersicht", "E94"): "=n. v.", ("Übersicht", "F94"): "=n. v.", ("NBank", "H23"): "=–", ("NBank", "I23"): "=–",
}
KONZEPT["L1"] = [(_bl, _z, _L1_TILGUNG_42.get((_bl, _z), _v)) for _bl, _z, _v in KONZEPT["L1"]]


def pruefe_konzeptwerte(b, lid, werte, specs):
    if lid not in KONZEPT or not KONZEPT[lid]:
        return
    p = b.pruefung("F.3–5", f"{lid} Sollwerte laut Konzept (F.3, F.4, F.5, D.2a)")
    for blatt, zelle, soll in KONZEPT[lid]:
        ist = werte.get(blatt, zelle)
        was = f"{blatt}!{zelle}"
        if soll.startswith("="):
            p.gleich(was, ist, soll[1:])
        elif soll == "<1":
            p.check(ist_zahl(ist) and ist < 1, was, ist, "< 1")
        elif soll == "#":
            p.check(ist_zahl(ist), was, ist, "Zahl")
        else:
            v, tol = kw(soll)
            sp = specs.get(blatt, {}).get(zelle)
            if ist == "n. v." and sp is not None and sp[0] == "irr" and sp[1].wert is not None \
                    and sp[1].wert < IRR_GRENZE:
                p.check(True, was, ist, soll, "unter Kaskadengrenze; n. v. zulässig")
            else:
                p.zahl(was, ist, v, tol)
    p.fertig()


# =====================================================================================================
# 10. Abgleich mit v2-1 (F10, Lauf L2) und Überleitung E.3
# =====================================================================================================
def pruefe_v21_abgleich(b, ordner, werte, soll):
    kopie = Path(ordner) / "v2-1_kopie.xlsx"
    shutil.copy(V21, kopie)
    alt = Werte(kopie)
    a = lambda s, z: alt.get(s, z)                                              # noqa: E731
    n = lambda s, z: werte.get(s, z)                                            # noqa: E731
    p = b.pruefung("F10", "L2 Tarutinoer gegen v2-1-Cache: gleiche Konvention (0,01 €)")
    zeilen = {"A": ("C61", "C63", "C64", "C62"), "B": ("C65", "C67", "C68", "C66"), "C": ("C69", "C71", "C72", "C70")}
    for g in GRUPPEN:
        x, ga = GEF[g], f"Gefoerdert_{g}"
        for alt_z, neu_z, bez in zip(zeilen[g], ("H99", "H100", "H101", "H110"),
                                     ("NBank-Darlehen", "Zuschuss", "Bearbeitungsentgelte", "Tilgungsrate")):
            p.zahl(f"{g} {bez}", n(x, neu_z), a("Basisdaten", alt_z), TOL_CENT)
        p.zahl(f"{g} Sollmiete J1", n(x, "G7"), a(ga, "F7"), TOL_CENT)
        bew = -sum(n(x, z) for z in ("H7", "I7", "J7")) if all(ist_zahl(n(x, z)) for z in ("H7", "I7", "J7")) else None
        p.zahl(f"{g} Bewirtschaftung inkl. Mietausfall J1", bew, a(ga, "G7"), TOL_CENT)
        p.zahl(f"{g} Reinertrag J1", n(x, "K7"), a(ga, "H7"), TOL_CENT)
        p.zahl(f"{g} VKB J1", -n(x, "L7") if ist_zahl(n(x, "L7")) else None, a(ga, "K7"), TOL_CENT)
        p.zahl(f"{g} Nettoanfangsrendite", n(x, "H139"), a("Dashboard", f"{'CDE'[GRUPPEN.index(g)]}43"), 1e-9)
    for neu_z, alt_z in (("H122", "AC6"), ("I122", "AC41"), ("J122", "AC48")):
        p.zahl(f"A Ertragswert Marktmiete {neu_z}", n(GEF["A"], neu_z), a("Gefoerdert_A", alt_z), TOL_CENT)
    p.zahl("Frei Reinertrag J1", n(FREI, "I7"), a("Frei_Marktmiete", "H7"), TOL_CENT)
    p.zahl("A Wertüberschuss vor Abschlag", n(GEF["A"], "H129"), a("Dashboard", "C44"), 1e-9)
    p.fertig()

    p = b.pruefung("F10", "L2 Abweichungen zu v2-1 erklärt (Entgelte aus EK, Restwert, Vorlaufzeit)")
    l21 = {g: RR.Lauf(BASIS["T"], g, **RR.MODELL) for g in GRUPPEN}
    for i, g in enumerate(GRUPPEN):
        x, ga, c = GEF[g], f"Gefoerdert_{g}", "CDE"[i]
        be_alt = a("Basisdaten", zeilen[g][2])
        p.zahl(f"{g} Bank v2-1 = Entgelte", a("Basisdaten", ("C78", "C89", "C100")[i]), be_alt, TOL_CENT)
        p.zahl(f"{g} Bank v3 = 0", n(x, "H103"), 0.0, TOL_CENT)
        kd_bank = a(ga, "L7") + a(ga, "M7")
        p.zahl(f"{g} ZÜ J1: v3 − v2-1 = Kapitaldienst Bank v2-1", dz(n(x, "R7"), a(ga, "Q7")), kd_bank, TOL_CENT)
        p.zahl(f"{g} EK: v3 − v2-1 = Entgelte", dz(n(x, "H106"), a("Basisdaten", "C126")), n(x, "H101"), TOL_CENT)
        q7 = n(x, "Q7")
        p.zahl(f"{g} DSCR v2-1 = Reinertrag ÷ (Kapitaldienst v3 + Bank v2-1)", a("Dashboard", f"{c}20"),
               n(x, "K7") / (-q7 + kd_bank) if ist_zahl(q7) and ist_zahl(n(x, "K7")) else None, 1e-6)
        k42, k35 = l21[g].kennzahlen(42), l21[g].kennzahlen(35)
        for bez, ist, rr in (("VOFI-EK mit RW J42", a("Dashboard", f"{c}55"), k42["ek_vofi_mit"]),
                             ("EK-IRR mit RW J42", a("Dashboard", f"{c}58"), RR.rv(k42["ek_irr_mit"])),
                             ("Verkehrswert J35", a(ga, "AE41"), k35["rw"]["voll"]),
                             ("Verkehrswert J42", a("Bewertung", f"L{30 + i}"), k42["rw"]["voll"])):
            p.zahl(f"{g} v2-1 {bez} = RR Modellkonvention", ist, rr, 1e-6 * max(1.0, abs(rr)))
    p.fertig()

    p = b.pruefung("E.3", "Überleitung v2-1 → v3 Tarutinoer (RR, Schritte kumulativ) = Konzept")
    M = RR.MODELL
    schritte = [dict(M), dict(M, ek_modell=False, vorlauf_exponent=0.0),
                dict(M, ek_modell=False, vorlauf_exponent=0.0, be_bank=False),
                dict(M, ek_modell=False, vorlauf_exponent=0.0, be_bank=False, restwert="bestand", schlussrate=True)]
    soll_e3 = [(("6,376 %", "6,440 %", "6,494 %"), ("7,924 %", "7,930 %", "8,021 %"), ("3,345 %", "3,563 %", "3,737 %")),
               (("6,768 %", "6,836 %", "6,894 %"), ("7,924 %", "7,930 %", "8,021 %"), ("3,548 %", "3,779 %", "3,964 %")),
               (("6,697 %", "6,760 %", "6,814 %"), ("7,877 %", "7,881 %", "7,970 %"), ("3,520 %", "3,743 %", "3,923 %")),
               (("6,489 %", "6,661 %", "6,753 %"), ("7,683 %", "7,790 %", "7,914 %"), ("3,520 %", "3,743 %", "3,923 %"))]
    for k, (opt, sw) in enumerate(zip(schritte, soll_e3)):
        for i, g in enumerate(GRUPPEN):
            kz = RR.Lauf(BASIS["T"], g, **opt).kennzahlen(42)
            for key, s in zip(("ek_vofi_mit", "ek_irr_mit", "ek_vofi_null"), sw):
                v, tol = kw(s[i])
                p.zahl(f"Schritt {(0, 2, 3, 4)[k]} {g} {key}", RR.rv(kz[key]), v, tol)
    for i, g in enumerate(GRUPPEN):
        p.zahl(f"v3 Excel {g} VOFI-EK mit RW J42 = Schritt 4", n(GEF[g], "J143"), kw(soll_e3[3][0][i])[0], kw(soll_e3[3][0][i])[1])
    p.fertig()


# =====================================================================================================
# 11. Broschüre S. 10–12 (F9): Werte zur Laufzeit aus content/pages lesen
# =====================================================================================================
def seite(nr):
    treffer = sorted(SEITEN_DIR.glob(f"{nr:02d}-*.json"))
    return json.loads(treffer[0].read_text(encoding="utf-8"))


def block(s, typ, **kw_):
    for bl in s["blocks"]:
        if bl.get("type") == typ and all(bl.get(k) == v or bl.get("data", {}).get(k) == v for k, v in kw_.items()):
            return bl
    return None


def nk_von(v):
    t = repr(float(v)) if not isinstance(v, str) else v
    return len(t.split(".")[1].rstrip("0")) if "." in t else 0


def bro(p, was, ist, soll, nk=None, faktor=1.0):
    """Excel-Wert auf die gezeigte Stelle gerundet = Broschürenwert."""
    if isinstance(soll, str):
        soll, nk2 = de_zahl(soll)
        nk = nk2 if nk is None else nk
    nk = nk_von(soll) if nk is None else nk
    if not ist_zahl(ist):
        return p.check(False, was, ist, soll)
    return p.check(abs(runde(ist / faktor, nk) - soll) < 1e-9, was, runde(ist / faktor, nk), soll,
                   f"Excel {fmt(ist)}, gerundet auf {nk} Stellen")


def regex_zahl(p, was, text, muster):
    m = re.search(muster, text)
    if not m:
        p.check(False, was, "nicht im Broschürentext gefunden", muster)
        return None
    return m.groups()


def pruefe_broschuere(b, w, w10):
    u = lambda z: w.get(UEB, z)                                               # noqa: E731
    # ---------------- S. 10
    s10 = seite(10)
    p = b.pruefung("F9", "Broschüre S. 10 (Finanzierung, Rechenweg, Kennzahlen) = Übersicht L1")
    ch = block(s10, "chart", chart="stacked-bar")["data"]
    ziel = {"Darlehen": "D13", "Zuschuss": "D14", "Eigenmittel": "D19"}
    for seg in ch["segments"]:
        bro(p, f"S. 10 {seg['name']} (Mio. €) ↔ {ziel[seg['name']]}", u(ziel[seg["name"]]), seg["display"], faktor=1e6)
    bro(p, "S. 10 Gesamt 7,0 Mio. € ↔ D9", u("D9"), ch["total"]["display"], faktor=1e6)
    bro(p, "S. 10 Förderung ↔ D15", u("D15"), ch["bracket"]["display"], faktor=1e6)
    bro(p, "S. 10 Förderquote ↔ D16", u("D16"), ch["bracket"]["share"])
    for seg in ch["segments"]:
        anteil = seg["share"]
        if seg["name"] == "Eigenmittel":
            v, _ = de_zahl(anteil.replace("mind.", "").strip())
            p.check(ist_zahl(u("D20")) and u("D20") >= v - 1e-9 and runde(u("D20"), 2) == v, "S. 10 Eigenmittel mind. 20 % ↔ D20",
                    u("D20"), v)
        else:
            q = u(ziel[seg["name"]]) / u("D10") if ist_zahl(u(ziel[seg["name"]])) and ist_zahl(u("D10")) and u("D10") else None
            bro(p, f"S. 10 Anteil {seg['name']} ↔ {ziel[seg['name']]}/D10", q, anteil)
    tab = block(s10, "table", role_hint="rechenweg")
    for row, ziel_ in zip(tab["rows"], ((GEF["A"], "H90"), (GEF["A"], "H92"), (UEB, "D10"), (UEB, "D19"))):
        bro(p, f"S. 10 Rechenweg {row[0]} ↔ {ziel_[0]}!{ziel_[1]}", w.get(*ziel_), row[2])
    g = regex_zahl(p, "S. 10 Rechenweg 1 (m² × €)", tab["rows"][0][1], r"([\d.]+) m² × ([\d.]+) €")
    if g:
        bro(p, "S. 10 Wohnfläche ↔ Eingaben!F8", w.get("Eingaben", "F8"), g[0])
        bro(p, "S. 10 Kosten je m² ↔ Eingaben!F11", w.get("Eingaben", "F11"), g[1])
    kf = block(s10, "key_figures")["items"]
    bro(p, "S. 10 Ø Zuschuss je Wohnung ↔ D24", u("D24"), kf[0]["value"])
    bro(p, "S. 10 Ø Eigenmittel je Wohnung ↔ D25", u("D25"), kf[1]["value"])
    p.fertig()
    if w10 is not None:
        p = b.pruefung("F9", "Broschüre S. 10 Sensitivität 5.200 €/m² = Übersicht L10")
        u10 = lambda z: w10.get(UEB, z)                                       # noqa: E731
        wf = block(s10, "chart", chart="waterfall")["data"]
        st = wf["steps"]
        bro(p, "Gesamtkosten ↔ D9", u10("D9"), st[0]["display"], faktor=1e6)
        bro(p, "zuwendungsfähig ↔ D10", u10("D10"), st[0]["segments"][0]["display"], faktor=1e6)
        bro(p, "über der Grenze ↔ D11", u10("D11"), st[0]["segments"][1]["display"], faktor=1e6)
        bro(p, "Förderung ↔ D15", u10("D15"), st[1]["display"], faktor=1e6)
        teile = [x.strip() for x in st[2]["display"].split("+")]
        bro(p, "Mindest-Eigenmittel ↔ D19", u10("D19"), teile[0], faktor=1e6)
        bro(p, "Restfinanzierung ↔ D18", u10("D18"), teile[1], faktor=1e6)
        bro(p, "Summe ↔ D18 + D19", (u10("D18") + u10("D19") if ist_zahl(u10("D18")) and ist_zahl(u10("D19")) else None), st[2]["value"], nk=2, faktor=1e6)
        bro(p, "Förderquote ↔ D16", u10("D16"), wf["result"]["value"] / 100, nk=3)
        p.fertig()
    # ---------------- S. 11
    s11 = seite(11)
    p = b.pruefung("F9", "Broschüre S. 11 (Finanzierung A/B/C, Jahresrechnung Jahr 1) = Übersicht L1")
    ch = block(s11, "chart", chart="stacked-bar")["data"]
    reihe = {"Darlehen": 13, "Zuschuss": 14, "Eigenmittel, mind.": 19}
    for ser in ch["series"]:
        for i, lab in enumerate(ser["labels"]):
            bro(p, f"S. 11 {ser['name']} {GRUPPEN[i]}", u(f"{'DEF'[i]}{reihe[ser['name']]}"), lab, faktor=1e6)
    for i, lab in enumerate(ch["totals"]["labels"]):
        bro(p, f"S. 11 Förderung {GRUPPEN[i]}", u(f"{'DEF'[i]}15"), lab, faktor=1e6)
    tab = block(s11, "table", role_hint="dominant")
    zeilen = [29, 30, 31, 32, 33, 34, 35, 36, 38]
    for row, z in zip(tab["rows"], zeilen):
        for i in range(3):
            bro(p, f"S. 11 Zeile {row[0] or '1a'} {GRUPPEN[i]} ↔ {'DEF'[i]}{z}", u(f"{'DEF'[i]}{z}"), row[2 + i])
    for i in range(3):
        bro(p, f"S. 11 Bearbeitungsentgelte {GRUPPEN[i]} ↔ {'DEF'[i]}39", u(f"{'DEF'[i]}39"), tab["aside_row"][2 + i])
        p.check(abs(u(f"{'DEF'[i]}37") or 0) < 0.005, f"S. 11 kein Bank-Kapitaldienst {GRUPPEN[i]} ↔ {'DEF'[i]}37",
                u(f"{'DEF'[i]}37"), 0)
    lab = [r[1] for r in tab["rows"]]
    g = regex_zahl(p, "S. 11 Zeile 1 Mieten", lab[0], r"\(([\d.]+) m² × ([\d,]+) \| ([\d,]+) \| ([\d,]+) € × (\d+)\)")
    if g:
        bro(p, "S. 11 Wohnfläche ↔ Eingaben!F8", w.get("Eingaben", "F8"), g[0])
        for i in range(3):
            bro(p, f"S. 11 Höchstmiete {GRUPPEN[i]} ↔ {'DEF'[i]}26", u(f"{'DEF'[i]}26"), g[1 + i])
    for k, (muster, zelle, bez) in enumerate(((r"([\d,]+) % der Sollmiete", "C30", "Mietausfall"),
                                              (r"([\d.]+) € je Wohnung", "C31", "Objektverwaltung"),
                                              (r"([\d,]+) € je m²", "C32", "Instandhaltung"))):
        g = regex_zahl(p, f"S. 11 {bez}", lab[1 + k], muster)
        if g:
            bro(p, f"S. 11 {bez} ↔ {zelle}", u(zelle), g[0] + (" %" if "%" in muster else ""))
    g = regex_zahl(p, "S. 11 VKB-Satz", lab[5], r"([\d,]+) % des Restkapitals")
    if g:
        bro(p, "S. 11 VKB-Satz ↔ C34", u("C34"), g[0] + " %")
    g = regex_zahl(p, "S. 11 Zins", lab[6], r"([\d,]+) % bis Ende Jahr (\d+)")
    if g:
        bro(p, "S. 11 Zins NBank ↔ C35", u("C35"), g[0] + " %")
        bro(p, "S. 11 zinsfreie Jahre ↔ Tabellen!D20", w.get("Tabellen", "D20"), g[1])
    g = regex_zahl(p, "S. 11 Tilgung", lab[7], r"Tilgung ([\d,]+) % .*auf ([\d,]+) \| ([\d,]+) \| ([\d,]+) Mio")
    if g:
        bro(p, "S. 11 Tilgungssatz ↔ C36", u("C36"), g[0] + " %")
        for i in range(3):
            bro(p, f"S. 11 Darlehen {GRUPPEN[i]} ↔ {'DEF'[i]}13", u(f"{'DEF'[i]}13"), g[1 + i], faktor=1e6)
    g = regex_zahl(p, "S. 11 Entgeltsätze", tab["aside_row"][1], r"\(([\d,]+) % des Darlehens \+ ([\d,]+) % des Zuschusses\)")
    if g:
        bro(p, "S. 11 Entgelt Darlehen ↔ Tabellen!D24", w.get("Tabellen", "D24"), g[0] + " %")
        bro(p, "S. 11 Entgelt Zuschuss ↔ Tabellen!D25", w.get("Tabellen", "D25"), g[1] + " %")
    # Vergleich frei finanziert (Kasten unten links): Übersicht 1.5, 1.6, 1.10, 8.2, 8.3 bei DSCR-Ziel 1,0
    vg = block(s11, "table", caption="Zum Vergleich: frei finanziert")
    if vg is None:
        p.check(False, "S. 11 Vergleich frei finanziert", "Tabelle fehlt", "Tabelle „Zum Vergleich: frei finanziert“")
    else:
        zahl = lambda t: t.replace("Mio. €", "").replace("€", "").strip()   # noqa: E731
        p.check(abs((u("D110") or 0) - 1) < 1e-12, "S. 11 Vergleich: DSCR-Ziel 1,0 ↔ D110", u("D110"), 1)
        ziele = (("D14", None, 1e6), ("D13", "G18", 1e6), ("D111", "G111", 1.0), ("D112", "G112", 1.0))
        for row, (za, zf, fk) in zip(vg["rows"], ziele):
            bro(p, f"S. 11 Vergleich {row[0]} A ↔ {za}", u(za), zahl(row[1]), faktor=fk)
            if zf is None:
                p.check(row[2] == "0" and not ist_zahl(u("G14")), f"S. 11 Vergleich {row[0]} Frei", row[2], "0")
            else:
                bro(p, f"S. 11 Vergleich {row[0]} Frei ↔ {zf}", u(zf), zahl(row[2]), faktor=fk)
    txt = block(s11, "text", heading="Annahmen")["body"]
    g = regex_zahl(p, "S. 11 Annahmen frei", txt,
                   r"Eigenmittel ([\d,]+) Mio\. €, Bankdarlehen ([\d,]+) Mio\. € zu ([\d,]+) % Zins, Annuität über (\d+) Jahre")
    if g:
        bro(p, "S. 11 Annahmen Eigenmittel frei ↔ G19", u("G19"), g[0], faktor=1e6)
        bro(p, "S. 11 Annahmen Bankdarlehen frei ↔ G18", u("G18"), g[1], faktor=1e6)
        bro(p, "S. 11 Annahmen Zins Bank ↔ Eingaben!F35", w.get("Eingaben", "F35"), g[2] + " %")
        bro(p, "S. 11 Annahmen Laufzeit Bank ↔ Eingaben!F38", w.get("Eingaben", "F38"), g[3])
    p.fertig()
    # ---------------- S. 12
    s12 = seite(12)
    p = b.pruefung("F9", "Broschüre S. 12 (Tilgungsschwellen, Rechenweg, Rechenbasis) = Übersicht L1")
    ch = block(s12, "chart", chart="line")["data"]
    for ser in ch["series"]:
        c = {"B": "E", "C": "F"}[ser["name"]]
        bro(p, f"S. 12 {ser['name']} vor Tilgung ↔ {c}70", u(f"{c}70"), ser["before_repayment"], nk=0)
        bro(p, f"S. 12 {ser['name']} Mehrschuld ↔ {c}13−D13", dz(u(f"{c}13"), u("D13")), ser["extra_debt"], nk=0)
        bro(p, f"S. 12 {ser['name']} Mehrschuld ↔ {c}66", u(f"{c}66"), ser["extra_debt"], nk=0)
        bro(p, f"S. 12 {ser['name']} je Prozentpunkt ↔ −({c}13−D13)/100", (-dz(u(f"{c}13"), u("D13")) / 100 if dz(u(f"{c}13"), u("D13")) is not None else None),
            ser["per_percentage_point"], nk=0)
        bro(p, f"S. 12 {ser['name']} Schwelle ↔ {'E63' if c == 'E' else 'F64'}", u("E63" if c == "E" else "F64"),
            ser["threshold"] / 100, nk=4)
        bro(p, f"S. 12 {ser['name']} bei 2,5 % ↔ {c}60−D60", dz(u(f"{c}60"), u("D60")), ser["at_2_5"], nk=0)
        bro(p, f"S. 12 {ser['name']} beim Satz der S. 11 ↔ {c}71", u(f"{c}71"), ser["at_s11"], nk=0)
    g = regex_zahl(p, "S. 12 Kontrolle C/B", ch["check"], r"= ([\d,]+) %")
    if g:
        bro(p, "S. 12 Tilgungsschwelle C gegenüber B ↔ F65", u("F65"), g[0] + " %")
    grenze = ch["dimension_chain"][0]["to"] / 100
    links, rechts = ch["dimension_chain"][0]["label"][-1], ch["dimension_chain"][1]["label"][-1]
    for k in range(8):
        ts = u(f"B{55 + k}")
        if ist_zahl(ts) and abs(ts - grenze) > 0.0001:
            p.gleich(f"S. 12 höchster Überschuss bei {fmt(ts)} ↔ G{55 + k}", u(f"G{55 + k}"), links if ts < grenze else rechts)
    tab = block(s12, "table", role_hint="rechenweg")
    # Rechenweg Zeile für Zeile gegen Übersicht 4.12–4.16 (Runde 2, KO3), Schwellen 4.9/4.10, Einmalzeile 4.18
    for row, z in zip(tab["rows"], (66, 67, 68, 69, 70)):
        for i, c in enumerate("EF"):
            bro(p, f"S. 12 Rechenweg {row[0] or '2a'} {'BC'[i]} ↔ {c}{z}", u(f"{c}{z}"), row[2 + i])
    for i, c in enumerate("EF"):
        bro(p, f"S. 12 Rechenweg 2 {'BC'[i]} ↔ {c}29−D29", dz(u(f"{c}29"), u("D29")), tab["rows"][1][2 + i])
        bro(p, f"S. 12 Rechenweg 5 {'BC'[i]} ↔ {'E63' if c == 'E' else 'F64'}", u("E63" if c == "E" else "F64"),
            tab["rows"][5][2 + i])
        bro(p, f"S. 12 Mehr-Entgelte {'BC'[i]} ↔ {c}72", u(f"{c}72"), tab["aside_row"][2 + i])
    calc = s12["calculation"]["A_B_C"]
    for key, z, fk in (("zuschuss_mio", 14, 1e6), ("darlehen_mio", 13, 1e6), ("hoechstmiete_eur_m2", 26, 1.0),
                       ("sollmiete_pa", 29, 1.0), ("mietausfall_2_prozent_pa", 30, 1.0),
                       ("verwaltungskostenbeitrag_pa", 34, 1.0), ("tilgung_pa", 36, 1.0),
                       ("zahlungsueberschuss_jahr_1", 38, 1.0), ("bearbeitungsentgelte", 21, 1.0)):
        for i, v in enumerate(calc[key]):
            bro(p, f"S. 12 Rechenbasis {key} {GRUPPEN[i]} ↔ {'DEF'[i]}{z}", u(f"{'DEF'[i]}{z}"), v, faktor=fk)
    p.fertig()


# =====================================================================================================
# 12. Ablauf
# =====================================================================================================
def sicher(b, kz, titel, fn, *args):
    try:
        return fn(*args)
    except Exception as ex:                                            # Prüfung bricht ab -> FEHLER
        import traceback
        p = b.pruefung(kz, f"{titel} (abgebrochen)")
        p.check(False, type(ex).__name__, str(ex)[:200], "Prüfung ohne Abbruch",
                traceback.format_exc().strip().splitlines()[-3][:160])
        p.fertig()
        return None


def main():
    ap = argparse.ArgumentParser(description="Abnahmeprüfung VOFI Mietwohnraum 2026 v3")
    ap.add_argument("mappe", nargs="?", default=str(MAPPE_STANDARD))
    ap.add_argument("--laeufe", default="alle", help="z. B. L1,L2 oder 'alle' oder 'keine'")
    ap.add_argument("--parallel", type=int, default=max(1, min(4, os.cpu_count() or 1)))
    ap.add_argument("--timeout", type=int, default=120)
    ap.add_argument("--ausfuehrlich", action="store_true", help="auch jeden OK-Einzelwert ausgeben")
    ap.add_argument("--arbeitsordner", default=None)
    ap.add_argument("--behalten", action="store_true", help="Kopien der Testläufe nicht löschen")
    ap.add_argument("--baseline", default=BASELINE,
                    help="Stand vor der Erweiterung „Frei finanziert“ für die Regression (Konzept N); ohne Angabe "
                         "aus dem Repository (Commit " + BASELINE_COMMIT + ")")
    a = ap.parse_args()
    mappe = Path(a.mappe)
    if not mappe.exists():
        print(f"FEHLER: Mappe {mappe} nicht gefunden.")
        return 2
    lade_referenz()
    b = Bericht(a.ausfuehrlich)
    b.abschnitt(f"Abnahmeprüfung {mappe.name} (SHA-256 {sha256(mappe)[:12]}…) gegen KONZEPT-v3.md, "
                f"referenzrechnung.py, Broschüre S. 10–12")

    b.abschnitt("F1, F3–F6, B, C, G: Struktur, Gestaltung, Sprache der gelieferten Mappe")
    sicher(b, "F1", "v2-1 unverändert", pruefe_v21, b)
    wb = openpyxl.load_workbook(mappe)
    xml = sheet_xml(mappe)
    nz = name_ziele(wb)
    fehlend = [s for s in BLAETTER if s not in wb.sheetnames]
    if fehlend:
        p = b.pruefung("F3", "Pflichtblätter vorhanden")
        p.check(False, "fehlende Blätter", fehlend, "alle 9")
        p.fertig()
        return b.schluss()
    sicher(b, "F3", "Struktur", pruefe_f3, b, mappe, wb, xml)
    sicher(b, "F4", "Formeln", pruefe_f4, b, wb)
    sicher(b, "F5", "Gestaltung", pruefe_f5, b, wb, xml, nz)
    sicher(b, "F6", "Sprache", pruefe_f6, b, wb)
    sicher(b, "B", "Eingaben", pruefe_eingaben, b, wb, nz)
    sicher(b, "C", "Tabellen", pruefe_tabellen, b, wb)
    sicher(b, "G.2", "Zahlenformate", pruefe_uebersicht_formate, b, wb)

    if a.laeufe == "alle":
        laeufe = LAEUFE + LAEUFE_FEHLER
    elif a.laeufe == "keine":
        laeufe = []
    else:
        wahl = [x.strip() for x in a.laeufe.split(",")]
        laeufe = [l for l in LAEUFE + LAEUFE_FEHLER if l[0] in wahl]
    fehlerlaeufe = {l[0] for l in LAEUFE_FEHLER}
    if laeufe:
        ordner = Path(a.arbeitsordner) if a.arbeitsordner else Path(tempfile.mkdtemp(prefix="pruefe_vofi_"))
        ordner.mkdir(parents=True, exist_ok=True)
        b.abschnitt(f"F2, F7–F13: {len(laeufe)} Testläufe (Kopien in {ordner}, {a.parallel} parallel)")
        ergebnisse = {}
        t0 = time.time()
        with cf.ThreadPoolExecutor(max_workers=a.parallel) as ex:
            futs = [ex.submit(excel_lauf, mappe, ordner, lid, proj, aend, a.timeout) for lid, proj, aend in laeufe]
            for f in cf.as_completed(futs):
                try:
                    lid, res, werte, dt = f.result()
                except Exception as e:
                    lid, res, werte, dt = "?", {"error": str(e)}, None, 0
                ergebnisse[lid] = (res, werte)
                print(f"        {lid}: recalc {res.get('status', res.get('error', '?'))} in {dt:.0f} s", flush=True)
        print(f"        Testläufe gesamt {time.time() - t0:.0f} s", flush=True)
        specs_je = {}
        for lid, proj, aend in laeufe:
            res, werte = ergebnisse.get(lid, ({"error": "nicht gelaufen"}, None))
            b.abschnitt(f"Lauf {lid}: {PROJEKT_NAME[proj]}, "
                        + (", ".join(f"{EIN[k][2]} = {fmt(v)}" for k, v in aend.items()) or "Standard"))
            if lid in fehlerlaeufe:
                sicher(b, "F7", f"{lid} Fehlerlauf", pruefe_fehlerlauf, b, lid, res, werte)
                continue
            soll = sicher(b, "F8", f"{lid} Sollwerte RR", Soll, proj, aend)
            if soll is None:
                continue
            specs = sicher(b, "F8", f"{lid} Sollwerte RR", soll.alle) or {}
            specs_je[lid] = specs
            sicher(b, "F8", f"{lid} Vergleich", pruefe_lauf, b, lid, proj, aend, res, werte, soll, specs)
            if werte is not None:
                sicher(b, "F.3–5", f"{lid} Konzeptwerte", pruefe_konzeptwerte, b, lid, werte, specs)
        w = {lid: ergebnisse[lid][1] for lid in ergebnisse
             if ergebnisse[lid][1] is not None and lid not in fehlerlaeufe}
        b.abschnitt("Laufübergreifend: gelieferte Werte, Broschüre (F9), v2-1 (F10), Textergebnisse")
        if "L1" in w:
            sicher(b, "F2", "gelieferte Werte", pruefe_gelieferte_werte, b, Werte(mappe), w["L1"])
            sicher(b, "F9", "Broschüre", pruefe_broschuere, b, w["L1"], w.get("L10"))
        if "L2" in w:
            sicher(b, "F10", "v2-1", pruefe_v21_abgleich, b, ordner, w["L2"], None)
        if "L13" in w and "L1" in w:
            sicher(b, "F7", "L13 = L1", pruefe_gleich_l1, b, "L13", w["L13"], w["L1"])
        # Regression laut Entscheidung 7 (Konzept N): L1 und L2 gegen den Stand vorher
        if not a.baseline:
            a.baseline = str(hole_baseline(ordner) or "")
        if a.baseline and Path(a.baseline).exists():
            for lid, proj in (("L63", "M"), ("L2", "T")):   # L63: Modellhaus mit Tilgung 2,5 % wie im Stand vorher
                if lid in w:
                    alt = sicher(b, "N", f"{lid} Stand vorher berechnen", baseline_lauf, a.baseline, ordner, proj, a.timeout)
                    if alt is None:
                        p = b.pruefung("N", f"{lid} Regression: Stand vorher neu berechnet")
                        p.check(False, "recalc Stand vorher", None, "success")
                        p.fertig()
                    else:
                        sicher(b, "N", f"{lid} Regression", pruefe_regression, b, lid, alt, w[lid])
        else:
            b.hinweis("N", f"Stand vorher nicht gefunden ({a.baseline or 'Commit ' + BASELINE_COMMIT}): Regression "
                           "laut Entscheidung 7 nicht geprüft (--baseline PFAD)")
        sicher(b, "F6", "Formeltexte", pruefe_formeltexte, b, wb, [(k, v) for k, v in sorted(w.items())])
        geaendert = {k for _l, _p, aend in laeufe for k in aend}
        offen = [e[0] for e in EINGABEN if e[0] not in geaendert]
        if offen and len(laeufe) == len(LAEUFE) + len(LAEUFE_FEHLER):
            b.hinweis("F7", "Eingaben ohne eigenen Lauf abseits des Standards: " + ", ".join(offen)
                      + " (2.5 wirkt in L4 über den Grundstücksdeckel des Tarutinoer)")
        if not a.behalten and not a.arbeitsordner:
            shutil.rmtree(ordner, ignore_errors=True)
    else:
        b.hinweis("F7", "keine Testläufe gewählt (--laeufe keine): F2, F7–F13 nicht geprüft")
        b.n_fehler += 1
        b.fehlerliste.append("Testläufe nicht ausgeführt")
    return b.schluss()


if __name__ == "__main__":
    sys.exit(main())
