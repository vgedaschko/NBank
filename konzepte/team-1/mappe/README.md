# Team 1 „Geldfluss“: Kopie der Konzepte-Mappe mit Block T1

| Datei | Inhalt |
|---|---|
| `PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team1.xlsx` | Kopie von `konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx` mit Block T1, neu berechnet |
| `build_team1.py` | kopiert, baut Block T1, rechnet neu (recalc.py mit eigenem HOME, danach `vofi/build_vofi.py --nachbearbeiten`), vergleicht, prüft, schreibt `werte_team.json` |
| `werte_team.json` | jede Zahl des Blocks T1 und einige bestehende Zellen (Übersicht Block 4, Tilgungsschwellen der Kostenläufe) mit schluessel, wert, einheit, blatt, zelle, bedeutung, lauf |
| `pruef_team1.log` | `konzepte/mappe/pruefe_konzepte.py` gegen die Team-Kopie, alle Läufe |

Aufruf:

```sh
HOME=<team-1>/.lohome python build_team1.py --recalc PFAD/recalc.py
HOME=<team-1>/.lohome VOFI_RECALC=PFAD/recalc.py python ../../mappe/pruefe_konzepte.py PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team1.xlsx --arbeitsordner $PWD/pruef
```

## Was neu ist

Nur Blatt **Konzepte ab Zeile 108**. Spalten wie Block N5: D = A, E = B, F = C, G = frei zur Marktmiete 15,42 €,
H = frei zur Miete für DSCR 1,2, I = Herkunft. Alle neuen Zellen sind Formeln auf bestehende Zellen; keine neue Annahme, keine
feste Zahl. Reine Verweise auf andere Blätter grün, sonst schwarz (Regel F5 der Mappe). Alle übrigen Zellen sind gleich der
Konzepte-Mappe.

| Nr. | Zeilen | Inhalt | Formel (Kurzform) |
|---|---|---|---|
| Status | D108 | Gesamtstatus P1 bis P7 | „OK“, wenn alle Prüfungen OK |
| T1.1 bis T1.11 | 111 bis 121 | Jahresrechnung Jahr 1, Zeilen 1 bis 9 und Kapitaldienst, je Variante | Verweis auf Zeile 7 (Jahr 1) im Blatt der Variante; Zins und Tilgung gefördert = NBank + Bank; Verwaltungskostenbeitrag frei = 0 |
| T1.12 | 122 | Bewirtschaftung (Zeilen 2 bis 4) | T1.3 + T1.4 + T1.5 |
| T1.13 bis T1.18 | 124 bis 129 | Anteile an der Sollmiete Jahr 1 und Probe 100 % | Zeile ÷ Sollmiete (0, wenn Sollmiete 0) |
| T1.20 bis T1.30 | 132 bis 142 | Summen Jahr 1 bis 35 je Zeile | SUM über Zeilen 7 bis 41 des Blatts der Variante |
| T1.31 bis T1.36 | 144 bis 149 | Anteile an der Sollmiete Jahr 1 bis 35 und Probe | wie T1.13 |
| T1.40 | 152 | kostendeckende Anfangsmiete (Zeile 9 Jahr 1 = 0) | Übersicht D112:G112; Spalte H = Frei finanziert H183 (gleicher Kapitaldienst) |
| T1.41 | 153 | Höchstmiete minus kostendeckende Anfangsmiete (A, B, C) | N5.1 − T1.40 |
| T1.42 | 154 | Miete für DSCR 1,2 minus Marktmiete (H) | H50 − H51 |
| T1.43 | 155 | Herstellungskosten je m², bei denen Zeile 9 Jahr 1 null ist (A, B, C) | Eingabe 2.1 × N5.10 ÷ N5.11 |
| T1.44 | 156 | Herstellungskosten je m², bei denen die DSCR Jahr 1 genau 1,2 ist (A, B, C) | Eingabe 2.1 × N5.13 ÷ N1.1 |
| T1.45 | 157 | letztes Jahr mit DSCR unter 1,2 (Jahr 1 bis 35) | SUMPRODUCT(MAX(…)) über Konzepte Zeitreihe |
| T1.46 | 158 | letztes Jahr mit Kapitaldienst | SUMPRODUCT(MAX(…)) über das Blatt der Variante, Jahr 1 bis 42 |
| T1.R0 bis T1.R35 | 161 bis 196 | kumulierter Zahlungsüberschuss minus Eigenkapital, Jahr 0 bis 35 | Konzepte Zeitreihe (kumuliert) − N5.8 |
| P1 bis P7 | 199 bis 205 | Prüfungen | siehe unten |

**T1.43 und T1.44** gelten, solange der Kapitaldienst Jahr 1 im gleichen Verhältnis wie die Herstellungskosten wächst: kein
Tilgungsaufschub, KG 800 und Grundstück 0, Kosten bis zur Bemessungsgrenze (P6). Dann ist der Zahlungsüberschuss Jahr 1 eine
Gerade in den Kosten, und die Nullstelle ist Eingabe 2.1 × DSCR Jahr 1. `build_team1.py` rechnet die Gerade gegen die Läufe
kosten_4631 und kosten_5460 der Konzepte-Mappe nach (Abweichung unter 1 €). Ergebnis A: 5.151 € je m² (im Vortrag „rund 5.150 €“,
wie heute Folie 23).

## Prüfungen

| Nr. | Prüfung |
|---|---|
| P1 | Jahr 1: Überschuss vor Kapitaldienst, Kapitaldienst und Zahlungsüberschuss gleich N5.10 bis N5.12 |
| P2 | Jahr 1: Zeile 5 + Kapitaldienst = Zeile 9; Anteile ergeben 100 % |
| P3 | Summe Jahr 1 bis 35: Zahlungsüberschuss = N5.16; Anteile ergeben 100 % |
| P4 | Rückfluss: Zahl der Jahre unter null = N5.17 (Jahr, in dem das Eigenkapital erreicht ist) |
| P5 | letztes Jahr mit DSCR unter 1,2 passt zu N5.23 |
| P6 | Kostenschwellen T1.43 unter der Bemessungsgrenze |
| P7 | Status der Mappe (Übersicht D3) und des Blocks K (Konzepte D3) OK |

Ergebnis (14.11.2026): recalc success, 0 Formelfehler, 14.244 Formeln; Vergleich gegen die Konzepte-Mappe 16.541 Zellen, davon
13.856 Formeln, 0 Abweichungen (Blatt Konzepte bis Zeile 106); Status Übersicht D3, Konzepte D3, Konzepte D108 „OK“.
`pruefe_konzepte.py` mit allen Läufen: 624 Prüfungen OK, 0 FEHLER, 7 Hinweise (`pruef_team1.log`).
