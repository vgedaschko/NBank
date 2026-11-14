#!/usr/bin/env python3
"""Team 2: Szenario-Lauf R1 „Liegenschaftszins +0,60 Prozentpunkte“ (Restwert-Risiko).

Kopie der Team-2-Mappe, eine Eingabe geändert: Eingaben!E50 (Eingabe 9.3 Zuschlag Liegenschaftszins, Projekt 2)
von 0 auf 0,006 (+0,60 Prozentpunkte; Spanne laut Mappe, Spalte G: „Vorgängermappe: Best −0,30, Worst +0,60“).
Neu berechnen (eigenes HOME), Status prüfen, Werte nach werte_team.json unter laeufe.<lauf> schreiben.

Aufruf:  HOME=<team-2>/.lohome python lauf_team2.py --recalc PFAD/recalc.py
"""
import argparse, json, os, shutil, subprocess, sys
from pathlib import Path
import openpyxl

HIER = Path(__file__).resolve().parent
QUELLE = HIER / "PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team2.xlsx"
WERTE = HIER / "werte_team.json"
LAUF = "liegenschaftszins_plus_0_60"
ZIEL = HIER / "laeufe" / f"{LAUF}.xlsx"
AENDERUNG = ("Eingaben", "E50", 0.006)
SPALTE = {"A": "D", "B": "E", "C": "F", "frei_markt": "G", "frei_dscr": "H"}
ZEILEN = {  # Kennzahl: (Zeile auf Konzepte, Einheit, Bedeutung)
    "restwert_jahr35": (76, "€", "Restwert Ende Jahr 35"),
    "vermoegen_jahr35": (78, "€", "Vermögen Ende Jahr 35"),
    "ek_vofi_mit_restwert": (81, "Anteil", "VOFI-EK-Rendite mit Restwert"),
    "ek_vofi_ohne_restwert": (82, "Anteil", "VOFI-EK-Rendite ohne Restwert"),
    "restwertanteil": (83, "Anteil", "Restwertanteil am Endvermögen"),
    "jahre_fehlbetrag_1_35": (68, "Jahre", "Jahre mit Fehlbetrag, Jahr 1 bis 35"),
    "projektkonto_tiefststand": (70, "€", "Tiefster Stand Projektkonto"),
    "dscr_jahr1": (62, "Faktor", "DSCR Jahr 1"),
    "miete_jahr1": (49, "€/m² Monat", "Miete Jahr 1"),
}


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--recalc", required=True); a = ap.parse_args()
    shutil.copy(QUELLE, ZIEL)
    wb = openpyxl.load_workbook(ZIEL)
    b, z, neu = AENDERUNG
    alt = wb[b][z].value
    wb[b][z].value = neu
    wb.save(ZIEL)
    env = dict(os.environ); env["PYTHONDONTWRITEBYTECODE"] = "1"
    p = subprocess.run([sys.executable, a.recalc, str(ZIEL), "240"], capture_output=True, text=True, env=env)
    res = json.loads(p.stdout[p.stdout.index("{"):])
    wv = openpyxl.load_workbook(ZIEL, data_only=True)
    status = {"konzepte": wv["Konzepte"]["D3"].value, "mappe": wv["Übersicht"]["D3"].value, "team2": wv["Team 2"]["D52"].value}
    datei = "konzepte/team-2/mappe/laeufe/" + ZIEL.name
    w = {}
    for k, (r, einh, bed) in ZEILEN.items():
        for v, sp in SPALTE.items():
            s = f"r1.{LAUF}.{k}.{v}"
            w[s] = {"schluessel": s, "wert": wv["Konzepte"][f"{sp}{r}"].value, "einheit": einh, "blatt": "Konzepte",
                    "zelle": f"{sp}{r}", "bedeutung": f"{bed}; {v}; Lauf {LAUF}", "datei": datei, "lauf": LAUF}
    for g in "ABC":
        s = f"r1.{LAUF}.liegenschaftszins_35.{g}"
        w[s] = {"schluessel": s, "wert": wv[f"Gefördert {g}"]["I120"].value, "einheit": "Anteil", "blatt": f"Gefördert {g}",
                "zelle": "I120", "bedeutung": f"Liegenschaftszins Restwert Jahr 35; Gruppe {g}; Lauf {LAUF}", "datei": datei, "lauf": LAUF}
    s = f"r1.{LAUF}.liegenschaftszins_35.frei"
    w[s] = {"schluessel": s, "wert": wv["Frei DSCR 1,2"]["I120"].value, "einheit": "Anteil", "blatt": "Frei DSCR 1,2",
            "zelle": "I120", "bedeutung": f"Liegenschaftszins Restwert Jahr 35; frei finanziert; Lauf {LAUF}", "datei": datei, "lauf": LAUF}
    d = json.loads(WERTE.read_text(encoding="utf-8"))
    d.setdefault("laeufe", {})[LAUF] = {
        "beschreibung": "Liegenschaftszins +0,60 Prozentpunkte (Eingabe 9.3, Spanne der Vorgängermappe laut Mappe Eingaben!G50)",
        "aenderungen": [{"blatt": b, "zelle": z, "alt": alt, "neu": neu}], "datei": datei,
        "recalc": {k: res.get(k) for k in ("status", "total_errors", "total_formulas")}, "status": status, "werte": w}
    WERTE.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    print("recalc:", d["laeufe"][LAUF]["recalc"], "Status:", status)
    ok = res.get("status") == "success" and not res.get("total_errors") and all(v == "OK" for v in status.values())
    print("Ergebnis:", "OK" if ok else "FEHLER"); sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
