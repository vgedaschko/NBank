#!/usr/bin/env python3
"""Team 2: Kopie der Konzepte-Mappe mit einem neuen Block T2 (Blatt „Team 2“) und Ausgabe werte_team.json.

Ablauf:
  1. Kopie von konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx anlegen (bestehende Zellen unverändert)
  2. Blatt „Team 2“ anhängen: nur Formeln auf die bestehenden Blätter (keine neue Annahme)
  3. neu berechnen (recalc.py, LibreOffice mit eigenem HOME)
  4. alle bestehenden Blätter der Kopie gegen die Konzepte-Mappe vergleichen (Formeln und Werte), Status prüfen
  5. werte_team.json schreiben: Block T2 und bestehende Zellen, die werte_konzepte.json nicht führt, je mit Blatt und Zelle

Aufruf:  HOME=<team-2>/.lohome python build_team2.py --recalc PFAD/recalc.py
"""
import argparse, json, os, shutil, subprocess, sys
from pathlib import Path
import openpyxl
from openpyxl.styles import Font, PatternFill

HIER = Path(__file__).resolve().parent
QUELLE = HIER.parent.parent / "mappe" / "PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx"
ZIEL = HIER / "PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team2.xlsx"
AUSGABE = HIER / "werte_team.json"
BLATT = "Team 2"

# Variante: (Schlüssel, Spalte EK auf Konzepte, Spalte kumuliert auf Konzepte Zeitreihe, Spalte Jahr EK erreicht auf Konzepte)
VARIANTEN = [
    ("A", "D", "G", "D"),
    ("B", "E", "P", "E"),
    ("C", "F", "Y", "F"),
    ("frei_markt", "G", "AH", "G"),
    ("frei_dscr", "H", "AQ", "H"),
]
NAMEN = {"A": "Gruppe A, Höchstmiete", "B": "Gruppe B, Höchstmiete", "C": "Gruppe C, Höchstmiete",
         "frei_markt": "frei finanziert, Marktmiete 15,42 € (Block der Mappe)",
         "frei_dscr": "frei finanziert, Miete für DSCR 1,2 der Bank"}
SPALTEN = ["C", "D", "E", "F", "G"]          # Spalten der Varianten auf „Team 2“
Z0, Z42 = 6, 48                               # Zeilen Jahr 0 bis 42 auf „Team 2“ (gleich wie Konzepte Zeitreihe)


def blatt_team2(wb):
    ws = wb.create_sheet(BLATT)
    ws["A1"] = "Team 2: Block T2, noch gebundenes Eigenkapital je Jahr (neu, nur Formeln, keine neue Annahme)"
    ws["A1"].font = Font(bold=True, size=12)
    ws["A2"] = ("T2.1 gebunden = Eigenkapital bei Bezug (Konzepte Zeile 56) minus Zahlungsüberschuss kumuliert, unverzinst "
                "(Konzepte Zeitreihe), nicht unter null. Fehlbeträge erhöhen das gebundene Eigenkapital.")
    ws["A3"] = "Gleiche Zeile = gleiches Jahr wie auf Konzepte Zeitreihe. Status: D52."
    kopf = ["t", "Jahr"] + [NAMEN[v[0]] for v in VARIANTEN]
    for i, k in enumerate(kopf):
        c = ws.cell(5, i + 1, k)
        c.font = Font(bold=True)
    for r in range(Z0, Z42 + 1):
        ws[f"A{r}"] = f"='Konzepte Zeitreihe'!A{r}"
        ws[f"B{r}"] = f"='Konzepte Zeitreihe'!B{r}"
        for sp, (v, ek, kum, _) in zip(SPALTEN, VARIANTEN):
            ws[f"{sp}{r}"] = f"=MAX(0,Konzepte!${ek}$56-'Konzepte Zeitreihe'!{kum}{r})"
            ws[f"{sp}{r}"].number_format = "#,##0"
    # T2.2 erstes Jahr ohne gebundenes Eigenkapital, T2.3 Höchststand, T2.4 Gegenprobe gegen Konzepte Zeile 67
    ws["A49"] = "T2.2"; ws["B49"] = "erstes Jahr ohne gebundenes Eigenkapital"
    ws["A50"] = "T2.3"; ws["B50"] = "Höchststand gebundenes Eigenkapital, Jahr 0 bis 42"
    ws["A51"] = "T2.4"; ws["B51"] = "Gegenprobe T2.2 = Konzepte Zeile 67 (N5.17)"
    for sp, (v, ek, kum, j) in zip(SPALTEN, VARIANTEN):
        ws[f"{sp}49"] = f'=IFERROR(INDEX($A${Z0}:$A${Z42},MATCH(0,{sp}{Z0}:{sp}{Z42},0)),"n. v.")'
        ws[f"{sp}50"] = f"=MAX({sp}{Z0}:{sp}{Z42})"
        ws[f"{sp}50"].number_format = "#,##0"
        ws[f"{sp}51"] = f'=IF(OR({sp}49=Konzepte!{j}67,AND({sp}49="n. v.",NOT(ISNUMBER(Konzepte!{j}67)))),"OK","prüfen")'
    ws["A52"] = "Status"; ws["B52"] = "T2.4 und T2.5.8 OK, Konzepte!D3 und Übersicht!D3 OK"
    ws["D52"] = ('=IF(AND(COUNTIF(C51:G51,"OK")=5,C63="OK",Konzepte!D3="OK",\'Übersicht\'!D3="OK"),"OK","prüfen")')
    # T2.5 frei finanziert zur Marktmiete: höchstes Bankdarlehen bei DSCR-Ziel (Konzepte!D6) und Mehr-Eigenkapital
    ws["A55"] = "T2.5"
    ws["B55"] = ("Frei finanziert zur Marktmiete 15,42 €: höchstes Bankdarlehen bei DSCR 1,2 in Jahr 1 und nötiges "
                 "Eigenkapital (nur Formeln; Zins, jährliche Annuität über 30 Jahre und Kosten wie Blatt Frei DSCR 1,2)")
    zeilen = [
        ("T2.5.1", "Überschuss vor Kapitaldienst Jahr 1 zur Marktmiete", "€ p. a.", "=Konzepte!G59"),
        ("T2.5.2", "höchster Kapitaldienst Jahr 1 bei DSCR-Ziel (T2.5.1 ÷ Konzepte!D6)", "€ p. a.", "=C56/Konzepte!D6"),
        ("T2.5.3", "Kapitaldienst Jahr 1 je € Bankdarlehen (Konzepte!H60 ÷ H55)", "Faktor", "=Konzepte!H60/Konzepte!H55"),
        ("T2.5.4", "höchstes Bankdarlehen (T2.5.2 ÷ T2.5.3)", "€", "=C57/C58"),
        ("T2.5.5", "nötiges Eigenkapital (Gesamtkosten Konzepte!H52 − T2.5.4)", "€", "=Konzepte!H52-C59"),
        ("T2.5.6", "Mehr-Eigenkapital gegenüber Konzepte!H56", "€", "=C60-Konzepte!H56"),
        ("T2.5.7", "Bankdarlehen in % der Gesamtkosten", "Anteil", "=C59/Konzepte!H52"),
        ("T2.5.8", "Gegenprobe: DSCR Jahr 1 mit T2.5.4 = DSCR-Ziel", "Text",
         '=IF(ABS(C56/(C59*C58)-Konzepte!D6)<0.0001,"OK","prüfen")'),
    ]
    for i, (nr, txt, einh, f) in enumerate(zeilen):
        r = 56 + i
        ws[f"A{r}"] = nr; ws[f"B{r}"] = txt; ws[f"D{r}"] = einh; ws[f"C{r}"] = f
        ws[f"C{r}"].number_format = "#,##0.0000" if einh in ("Faktor", "Anteil") else "#,##0"
    ws["D52"].font = Font(bold=True)
    ws.column_dimensions["B"].width = 12
    for sp in SPALTEN:
        ws.column_dimensions[sp].width = 22
    ws.freeze_panes = "C6"
    return ws


def gleich(a, b, tol=1e-9):
    if isinstance(a, (int, float)) and isinstance(b, (int, float)) and not isinstance(a, bool):
        return abs(a - b) <= tol * max(1.0, abs(a), abs(b))
    return a == b


def vergleiche(quelle, kopie):
    erg = dict(blaetter=0, zellen=0, formeln=0, abweichungen=[])
    for data_only in (False, True):
        wq = openpyxl.load_workbook(quelle, data_only=data_only)
        wk = openpyxl.load_workbook(kopie, data_only=data_only)
        erg["blaetter"] = len(wq.sheetnames)
        assert wk.sheetnames[:len(wq.sheetnames)] == wq.sheetnames
        for name in wq.sheetnames:
            sq, sk = wq[name], wk[name]
            for row in range(1, max(sq.max_row, sk.max_row) + 1):
                for col in range(1, max(sq.max_column, sk.max_column) + 1):
                    a, b = sq.cell(row, col).value, sk.cell(row, col).value
                    if a is None and b is None:
                        continue
                    if not data_only:
                        erg["zellen"] += 1
                        erg["formeln"] += isinstance(a, str) and a.startswith("=")
                    if not gleich(a, b):
                        erg["abweichungen"].append([("Wert " if data_only else "Formel ") + name,
                                                    sq.cell(row, col).coordinate, a, b])
    return erg


def recalc(datei, pfad):
    env = dict(os.environ)
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    p = subprocess.run([sys.executable, str(pfad), str(datei), "240"], capture_output=True, text=True, env=env)
    t = p.stdout.strip()
    return json.loads(t[t.index("{"):])


def eintrag(wv, schluessel, blatt, zelle, einheit, bedeutung, datei, liste=None):
    if liste:
        sp, r0, r1 = liste
        wert = [wv[blatt][f"{sp}{r}"].value for r in range(r0, r1 + 1)]
    else:
        wert = wv[blatt][zelle].value
    return {"schluessel": schluessel, "wert": wert, "einheit": einheit, "blatt": blatt, "zelle": zelle,
            "bedeutung": bedeutung, "datei": datei}


def ausgabe(status_recalc, vgl):
    wv = openpyxl.load_workbook(ZIEL, data_only=True)
    kopie = "konzepte/team-2/mappe/" + ZIEL.name
    w = {}

    def add(e):
        w[e["schluessel"]] = e

    # Block T2 (neu)
    add(eintrag(wv, "t2.jahr", BLATT, f"A{Z0}:A{Z42}", "Jahr", "Jahr der Rechnung 0 bis 42", kopie, ("A", Z0, Z42)))
    for sp, (v, *_ ) in zip(SPALTEN, VARIANTEN):
        add(eintrag(wv, f"t2.gebunden.{v}", BLATT, f"{sp}{Z0}:{sp}{Z42}", "€",
                    f"T2.1 noch gebundenes Eigenkapital, Jahr 0 bis 42; {NAMEN[v]}", kopie, (sp, Z0, Z42)))
        add(eintrag(wv, f"t2.jahr_frei.{v}", BLATT, f"{sp}49", "Jahr",
                    f"T2.2 erstes Jahr ohne gebundenes Eigenkapital; {NAMEN[v]}", kopie))
        add(eintrag(wv, f"t2.hoechststand.{v}", BLATT, f"{sp}50", "€",
                    f"T2.3 Höchststand gebundenes Eigenkapital, Jahr 0 bis 42; {NAMEN[v]}", kopie))
        add(eintrag(wv, f"t2.gegenprobe.{v}", BLATT, f"{sp}51", "Text",
                    f"T2.4 Gegenprobe gegen Konzepte Zeile 67; {NAMEN[v]}", kopie))
    add(eintrag(wv, "t2.status", BLATT, "D52", "Text", "Status Block T2 und Mappe", kopie))
    for i, (k, einh, b) in enumerate([
            ("uevk_markt", "€ p. a.", "T2.5.1 Überschuss vor Kapitaldienst Jahr 1 zur Marktmiete 15,42 €"),
            ("kd_max", "€ p. a.", "T2.5.2 höchster Kapitaldienst Jahr 1 bei DSCR 1,2"),
            ("kd_je_euro", "Faktor", "T2.5.3 Kapitaldienst Jahr 1 je € Bankdarlehen (jährliche Annuität über 30 Jahre)"),
            ("darlehen_max", "€", "T2.5.4 höchstes Bankdarlehen zur Marktmiete bei DSCR 1,2"),
            ("ek_noetig", "€", "T2.5.5 nötiges Eigenkapital zur Marktmiete bei DSCR 1,2"),
            ("mehr_ek", "€", "T2.5.6 Mehr-Eigenkapital gegenüber dem Eigenkapital aller Varianten (Konzepte!H56)"),
            ("darlehen_anteil", "Anteil", "T2.5.7 Bankdarlehen in % der Gesamtkosten"),
            ("gegenprobe", "Text", "T2.5.8 Gegenprobe DSCR Jahr 1 = 1,2")]):
        add(eintrag(wv, f"t2.markt_dscr.{k}", BLATT, f"C{56 + i}", einh, b, kopie))

    # Bestehende Zellen der Konzepte-Mappe, die werte_konzepte.json nicht führt (in der Kopie gleich)
    mappe = "konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx"
    for sp, k, b in [("E", "sollmiete", "Sollmiete"), ("F", "mietausfall", "Mietausfall/Leerstand (negativ)"),
                     ("G", "objektverwaltung", "Objektverwaltung (negativ)"), ("H", "instandhaltung", "Instandhaltung (negativ)"),
                     ("I", "uevk", "Überschuss vor Kapitaldienst"), ("J", "zins", "Zins Bankdarlehen (negativ)"),
                     ("K", "tilgung", "Tilgung Bankdarlehen (negativ)"), ("L", "kapitaldienst", "Kapitaldienst (negativ)"),
                     ("M", "zue", "Zahlungsüberschuss"), ("N", "dscr", "DSCR")]:
        add(eintrag(wv, f"jr1.frei_dscr.{k}", "Frei DSCR 1,2", f"{sp}7", "€ p. a." if k != "dscr" else "Faktor",
                    f"Jahr 1, frei finanziert, Miete für DSCR 1,2: {b}", mappe))
    for sp, v in zip("DEFG", ["A", "B", "C", "frei_markt"]):
        add(eintrag(wv, f"kdam.{v}", "Übersicht", f"{sp}112", "€/m² Monat",
                    f"Übersicht 8.3 kostendeckende Anfangsmiete Jahr 1 (DSCR-Ziel der Mappe 1,0, Eingabe 10.2); {v}", mappe))
    for z, k, b in [("E63", "tilgungsschwelle.B", "Übersicht 4.9 Tilgungsschwelle B gegenüber A"),
                    ("F64", "tilgungsschwelle.C", "Übersicht 4.10 Tilgungsschwelle C gegenüber A")]:
        add(eintrag(wv, k, "Übersicht", z, "Anteil", b, mappe))
    for g in "ABC":
        for z, k, b in [("I122", "ertragswert_zielmiete_35", "Ertragswert zur Zielmiete (Marktmiete) Ende Jahr 35"),
                        ("I123", "ertragswert_bestandsmiete_35", "Ertragswert zur Bestandsmiete Ende Jahr 35 (= Restwert)"),
                        ("I124", "abschlag_bindung_35", "Abschlag Bestandsmiete unter Zielmiete Ende Jahr 35"),
                        ("I120", "liegenschaftszins_35", "Liegenschaftszins Restwert Jahr 35")]:
            add(eintrag(wv, f"rw.{k}.{g}", f"Gefördert {g}", z, "€" if z != "I120" else "Anteil", b + f"; Gruppe {g}", mappe))

    out = {"meta": {
        "titel": "Werte Team 2: Block T2 und bestehende Zellen der Konzepte-Mappe",
        "kopie": kopie, "quelle": mappe,
        "aufbau": "werte.<schluessel> = {schluessel, wert, einheit, blatt, zelle, bedeutung, datei}",
        "neue_annahme": "keine; Block T2 sind nur Formeln",
        "recalc": {k: status_recalc.get(k) for k in ("status", "total_errors", "total_formulas")},
        "vergleich_mit_konzepte_mappe": {"blaetter": vgl["blaetter"], "zellen": vgl["zellen"], "formeln": vgl["formeln"],
                                          "abweichungen": len(vgl["abweichungen"])},
        "status": {"team2": wv[BLATT]["D52"].value, "konzepte": wv["Konzepte"]["D3"].value,
                   "mappe": wv["Übersicht"]["D3"].value},
    }, "werte": w}
    AUSGABE.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--recalc", required=True)
    a = ap.parse_args()
    shutil.copy(QUELLE, ZIEL)
    wb = openpyxl.load_workbook(ZIEL)
    blatt_team2(wb)
    wb.save(ZIEL)
    res = recalc(ZIEL, a.recalc)
    print("recalc:", {k: res.get(k) for k in ("status", "total_errors", "total_formulas")})
    vgl = vergleiche(QUELLE, ZIEL)
    print("Vergleich:", {k: (v if k != "abweichungen" else len(v)) for k, v in vgl.items()})
    for x in vgl["abweichungen"][:20]:
        print("  ", x)
    out = ausgabe(res, vgl)
    print("Status:", out["meta"]["status"])
    ok = (res.get("status") == "success" and not res.get("total_errors") and not vgl["abweichungen"]
          and all(v == "OK" for v in out["meta"]["status"].values()))
    print("Ergebnis:", "OK" if ok else "FEHLER")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
