# Team-Mappe Team 3 (Vergleich)

`PGN_VOFI_Mietwohnraum_2026_v3_Team3.xlsx` ist eine Kopie der Konzepte-Mappe (`konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx`)
mit einem weiteren Blatt „Team 3 Vergleich“ (Block T3). Alle zwölf bestehenden Blätter sind unverändert. Block T3 enthält nur Formeln auf
bestehende Zellen; es gibt keine neue Annahme.

Aufruf (LibreOffice mit eigenem Profil):

```sh
HOME=<team-3>/.lohome python build_team3.py --recalc <PFAD>/recalc.py
```

Das Skript kopiert die Konzepte-Mappe, hängt das Blatt an, rechnet neu (danach `vofi/build_vofi.py --nachbearbeiten` wie in
`konzepte/mappe/build_konzepte.py`), vergleicht alle bestehenden Blätter Zelle für Zelle mit der Konzepte-Mappe (Formeln und Werte) und
schreibt `werte_team.json` (je Schlüssel: wert, einheit, blatt, zelle, bedeutung, herkunft, lauf). Der Bau bricht ab, wenn recalc Fehler
meldet, eine bestehende Zelle abweicht oder ein Status nicht OK ist.

## Block T3 (Blatt „Team 3 Vergleich“)

Spalten D bis H wie auf „Konzepte“: D Gruppe A, E Gruppe B, F Gruppe C, G frei zur Marktmiete 15,42 €, H frei zur Miete für DSCR 1,2.

| Teil | Zeilen | Inhalt | Quelle der Formeln |
|---|---|---|---|
| T3.1 | 6–18 | Jahresrechnung Jahr 1, € p. a., Auszahlungen positiv (Miete, Sollmiete, Mietausfall, Objektverwaltung, Instandhaltung, Bewirtschaftung, Überschuss vor Kapitaldienst, Verwaltungskostenbeitrag, Zins, Tilgung, Kapitaldienst, Zahlungsüberschuss, DSCR) | Gefördert A/B/C Zeile 7 (G bis S), Frei finanziert und Frei DSCR 1,2 Zeile 7 (E bis N), Konzepte Zeile 49 |
| T3.2 | 21–33 | T3.1 je m² Wohnfläche und Monat (÷ Wohnflaeche × 12); Anteile Zins, Tilgung, Zahlungsüberschuss an der Sollmiete | T3.1, Name `Wohnflaeche` |
| T3.3 | 36–44 | kostendeckende Anfangsmiete, Miete für DSCR 1,2, Miete im Modell, Marktmiete, Abstände, Miete in % der Marktmiete | Übersicht D112:G112, Konzepte Zeilen 49 bis 51 |
| T3.4 | 47–52 | Eigenkapital, Rückflussquote Jahr 10, 20, 35, erstes Jahr ≥ 100 %, Objektrendite Jahr 35 | Konzepte Zeile 56, T3.6 |
| T3.5 | 55–62 (nur D) | Herstellungskosten ARGE Q1 2020 und heute, Anstieg, Sollzins, Kapitaldienst je m², Förderquote (für die Fazit-Folie) | Tabellen D47:E53, Übersicht D16 |
| T3.6 | 65–108 | Zeitreihe Jahr 0 bis 42: Rückflussquote = kumulierter Zahlungsüberschuss ÷ Eigenkapital (D bis H); Objektrendite = Überschuss vor Kapitaldienst ÷ Gesamtkosten (J bis N); Objektrendite, Nenner ohne Zuschuss (P bis R) | Konzepte Zeitreihe, Konzepte Zeilen 52, 53, 56 |
| T3K | 111–117, Status D3 | T3K1 bis T3K4 Zerlegung geht auf; T3K5 Rückflussjahr = Konzepte Zeile 67; T3K6 Status Übersicht und Konzepte OK; T3K7 Projekt 2 | T3 |
| T3.7 | 121–125 | Objekt-IRR der Mappe, Jahr 35: ohne Zuschuss, nach Zuschuss, nach Förderbarwert (mit Restwert), ohne und nach Zuschuss (ohne Restwert) | Übersicht Zeilen 76 bis 84; Frei DSCR 1,2 I136, I138 |

## Prüfung (14.11.2026)

recalc: success, 14.739 Formeln, 0 Formelfehler. Bestehende Blätter gegen die Konzepte-Mappe: 16.541 Zellen, davon 13.856 Formeln,
0 Abweichungen (Formeln und Werte). Status Übersicht D3, Konzepte D3, Team 3 Vergleich D3: OK.
