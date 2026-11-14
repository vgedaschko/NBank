# Team 2: Kopie der Konzepte-Mappe mit Block T2 und Lauf R1

| Datei | Inhalt |
|---|---|
| `PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team2.xlsx` | Kopie von `konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx`, alle zwölf Blätter unverändert, dazu Blatt „Team 2“ |
| `laeufe/liegenschaftszins_plus_0_60.xlsx` | Lauf R1: Kopie der Team-2-Mappe, Eingaben!E50 (Eingabe 9.3) = 0,006 |
| `werte_team.json` | jede Zahl mit schluessel, wert, einheit, blatt, zelle, bedeutung, datei; Lauf R1 unter `laeufe` |
| `build_team2.py` | baut die Kopie, rechnet neu, vergleicht alle Blätter mit der Konzepte-Mappe, schreibt `werte_team.json` |
| `lauf_team2.py` | rechnet Lauf R1 und hängt ihn an `werte_team.json` an (nach `build_team2.py` aufrufen) |

Aufruf (LibreOffice mit eigenem Profil):

```sh
HOME=<team-2>/.lohome python build_team2.py --recalc PFAD/recalc.py
HOME=<team-2>/.lohome python lauf_team2.py --recalc PFAD/recalc.py
```

## Block T2 (Blatt „Team 2“, nur Formeln, keine neue Annahme)

| Nr. | Zellen | Inhalt |
|---|---|---|
| T2.1 | C6:G48 | noch gebundenes Eigenkapital je Jahr 0 bis 42 = MAX(0; Eigenkapital Konzepte Zeile 56 − Zahlungsüberschuss kumuliert, Konzepte Zeitreihe); Spalten A, B, C, frei Marktmiete, frei DSCR 1,2 |
| T2.2 | C49:G49 | erstes Jahr ohne gebundenes Eigenkapital |
| T2.3 | C50:G50 | Höchststand des gebundenen Eigenkapitals |
| T2.4 | C51:G51 | Gegenprobe T2.2 gegen Konzepte Zeile 67 (N5.17) |
| T2.5 | C56:C63 | frei finanziert zur Marktmiete: Überschuss vor Kapitaldienst (Konzepte!G59) ÷ 1,2 (Konzepte!D6) = höchster Kapitaldienst; ÷ Kapitaldienst je € Bankdarlehen (Konzepte!H60 ÷ H55) = höchstes Bankdarlehen; Gesamtkosten (H52) minus Darlehen = nötiges Eigenkapital; minus H56 = Mehr-Eigenkapital; Anteil Darlehen; Gegenprobe DSCR = 1,2 |
| Status | D52 | „OK“, wenn T2.4 und T2.5.8 OK sind und Konzepte!D3 und Übersicht!D3 „OK“ zeigen |

Ergebnis (14.11.2026): recalc ohne Formelfehler, 14.181 Formeln; Vergleich mit der Konzepte-Mappe: 12 Blätter, 16.541 Zellen, 13.856 Formeln, 0 Abweichungen;
Status Team 2, Konzepte, Mappe „OK“; Lauf R1 ebenso. `pruefe_konzepte.py` ist nicht gelaufen, weil es nur die Blätter der gemeinsamen Mappe zulässt.

## Lauf R1

Eingabe 9.3 „Zuschlag Liegenschaftszins (Standort)“, Projekt 2 (Eingaben!E50): 0 → 0,006 (+0,60 Prozentpunkte). Die Spanne nennt die Mappe in Eingaben!G50
(„Vorgängermappe: Best −0,30, Worst +0,60 Prozentpunkte“). Liegenschaftszins Ende Jahr 35: 3,40 % statt 2,80 %. Nur ein Szenario für das Restwert-Risiko, keine neue Annahme der Basis.
