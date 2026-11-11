# VOFI Mietwohnraum 2026, Version 3

Wirtschaftlichkeitsmappe für geförderten Mietwohnungsbau nach RL Mietwohnraum 2026 (Niedersachsen). Die Mappe wird vollständig aus Code erzeugt und automatisch geprüft.

## Dateien

| Datei | Inhalt |
|---|---|
| `PGN_VOFI_Mietwohnraum_2026_v3.xlsx` | Mappe, neu berechnet; aktiv ist Projekt 2, das Modellhaus von Broschüre und Präsentation (Eingaben D3 = 2) |
| `build_vofi.py` | Generator (openpyxl): Blätter, Formeln, Namen, Formate, Druck |
| `pruefe_vofi.py` | Abnahmeprüfung: Struktur, Gestaltung, Sprache, Seitenreserve im Druck (gerechnet nach der Breitenregel von Excel), 70 Testläufe gegen Referenzrechnung, Broschüre S. 10–12 (gegen Projekt 2) und v2-1; Regression gegen den Stand vor der Erweiterung „Frei finanziert“. Stand 11.11.2026: 617 Prüfungen |
| `KONZEPT-v3.md` | Sollkonzept (intern): Zelladressen, Namen, Rechenlogik, Sollwerte, Abweichungen, Fundstellen der Eingaben; Abschnitt Q: Bewertungsansätze von Projekt 1 für Rotenburg (Wümme), Liegenschaftszins je Projekt, Lektorat der Texte (11.11.2026); Abschnitt R: Modellhaus ist Projekt 2, mit den Sollwerten des Modellhauses (11.11.2026) |
| `AENDERUNGEN.md` | Änderungen gegenüber v2-1, für PGN |

Nur gelesen, nie verändert:

- `../broschuere/zulieferungen/PGN_NBank_VOFI_Modell_v2-1.xlsx` (Vorgängermappe, SHA-256 beginnt mit `11d558b3`)
- `../broschuere/zulieferungen/vofi-pruefung/referenzrechnung.py` und `annahmen.json` (unabhängige Referenzrechnung)
- `../broschuere/content/pages/10-*.json`, `11-*.json`, `12-*.json` (Broschürenwerte; seit 11.11.2026 die Werte von Projekt 2)

## Neuaufbau

```sh
python build_vofi.py      # bauen, mit recalc.py neu berechnen, nachbearbeiten
python pruefe_vofi.py     # Abnahme; Exit-Code 0 = alle Prüfungen OK (einige Minuten)
```

Einzelschritte (Abnahmefolge):

```sh
python build_vofi.py --ohne-recalc
python RECALC PGN_VOFI_Mietwohnraum_2026_v3.xlsx 120
python build_vofi.py --nachbearbeiten PGN_VOFI_Mietwohnraum_2026_v3.xlsx
python pruefe_vofi.py PGN_VOFI_Mietwohnraum_2026_v3.xlsx
```

`RECALC` ist `scripts/recalc.py` des xlsx-Skills (LibreOffice headless; schreibt die Datei an Ort und Stelle; Ergebnis muss `status: success` und `total_errors: 0` sein; es zählt vier Beschriftungen mit führendem „=“ als Formeln mit: 9.832 statt 9.828).

LibreOffice entfernt beim Speichern Gliederungslage (`summaryBelow`), Klappzustand, `fullCalcOnLoad` und Dokumenteigenschaften. `--nachbearbeiten` setzt sie im XML wieder, Werte und Formeln bleiben unverändert. Nach jedem weiteren `recalc.py` erneut aufrufen, sonst meldet das Prüfskript zwei Hinweise (kein Fehler).

Pfade: `build_vofi.py` nimmt den laufenden Python-Interpreter (oder `VOFI_PYTHON`); beide Skripte finden `recalc.py` über `VOFI_RECALC` oder durch Suche unter dem Benutzerordner (`~/.*/skills/**/xlsx/scripts/recalc.py`). `pruefe_vofi.py` hat `VOFI_DIR` und `BROSCH` im Kopf (Abschnitt 0). Optionen des Prüfskripts: `--laeufe L1,L2`, `--parallel 4`, `--timeout 120`, `--ausfuehrlich`, `--behalten`, `--arbeitsordner DIR`, `--baseline PFAD`.

Regression (Konzept N.6, Q.3): Das Prüfskript vergleicht die Läufe L63 und L64 mit dem Stand vor der Erweiterung „Frei finanziert“ (Commit `0dfe8a2`). Beide rechnen mit dem Tilgungssatz dieses Stands (2,5 %), L63 (Projekt 1) dazu mit den Bewertungsansätzen bis 10.11.2026 (Vergleichs- und Marktmiete 12,92 / 14,48 €/m², Liegenschaftszins Neu Wulmstorf). L68 hält den Stand vom 10.11.2026 fest (Tilgung 1/42, dieselben früheren Bewertungsansätze). Texte, die das Lektorat vom 11.11.2026 geändert hat, und die Projektnamen seit 11.11.2026 vergleicht die Regression im neuen Wortlaut. Es holt die Vergleichsdatei selbst mit `git show` aus dem Repository in den Arbeitsordner; ohne Repository meldet es einen Hinweis (kein Fehler). Eine eigene Datei geht über `--baseline PFAD` oder `VOFI_BASELINE`:

```sh
git show 0dfe8a2:vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx > /tmp/vofi_stand_vorher.xlsx
python pruefe_vofi.py --baseline /tmp/vofi_stand_vorher.xlsx
```

Änderungen an der Mappe immer im Generator, nie in der xlsx. Wer Adressen, Texte oder Rechenregeln ändert, zieht `KONZEPT-v3.md` und `pruefe_vofi.py` nach; das Prüfskript liest den Generator nicht. Jeder Text der Mappe steht deshalb an drei Stellen im selben Wortlaut: `build_vofi.py`, `pruefe_vofi.py`, `KONZEPT-v3.md`.

## Stand 11.11.2026

- Modellhaus ist Projekt 2 (Entscheidung des Auftraggebers vom 11.11.2026): Das Modellhaus von Broschüre und Präsentation ist das PGN-Projekt Tarutinoer Str. 4 in Neu Wulmstorf (14 Wohnungen, 828 m², Herstellungskosten 3.579 €/m², Mietenstufe VI; Grundstück im Bestand, Ansatz 0 €). Die Mappe wird mit Eingaben D3 = 2 ausgeliefert. Projekt 1 (20 Wohnungen, 1.400 m², 4.500 €/m²) bleibt in der Mappe und heißt „Vergleichshaus, 20 Wohnungen“; bis 11.11.2026 war es das Modellhaus. Geändert sind D3 und 15 Texte (Projektnamen, Quellen, Hinweise 6, 14 und 15, Fußnoten der Tabelle 4). Keine Zelle hat die Adresse gewechselt, kein Rechenwert hat sich geändert. Einzelheiten und Sollwerte des Modellhauses: `KONZEPT-v3.md`, Abschnitt R; `AENDERUNGEN.md`, Abschnitt 10.
- Prüfskript dazu: Läufe von Projekt 1 setzen D3 = 1 ausdrücklich, Läufe von Projekt 2 rechnen im Auslieferungsstand. Die gelieferten Werte (F2) und die Broschüre S. 10–12 (F9) werden mit Projekt 2 verglichen (Lauf L2); neue Läufe L69 und L70 für die Sensitivität der Broschüre S. 10 (Herstellungskosten 4.631 und 5.000 €/m²). F9 liest die Broschüre zur Laufzeit: Es besteht nur, solange die Seiten 10 bis 12 die Werte von Projekt 2 zeigen.
- Bewertungsansätze von Projekt 1 (Vergleichshaus, damals das Modellhaus) für Rotenburg (Wümme), auf Entscheidung des Auftraggebers: Eingabe 4.4 Marktmiete 13,30 €/m² (vorher 14,48), Eingabe 4.3 Vergleichsmiete 11,87 €/m² (vorher 12,92, PGN-Annahme), Liegenschaftszins 3,3 bis 3,5 % (vorher 2,5 bis 3,1 %). Projekt 2 ist unverändert.
- Blatt Tabellen, Tabelle 4 „Bewertung, Liegenschaftszins je Projekt“: D36:D41 Projekt 1, E36:E41 Projekt 2, F36:F41 „verwendet“ (`=INDEX($D36:$E36,Projekt_Nr)`, Name `LZ_Satz`), Quelle in G36, Fußnoten in A42 (Projekt 1) und A43 (Projekt 2), Druckbereich A1:G43. Keine Zeile und keine Spalte ist eingefügt oder verschoben.
- Die Referenzrechnung unter `../broschuere/` ist unverändert; `pruefe_vofi.py` parametriert sie (`ovm_start`, `markt_start`, `lz_tab`).
- Lektorat der Texte: 63 Befunde eingearbeitet (Kürzel in Hinweis 2 erklärt, eine Größe mit einem Namen, Verweise als „Eingabe x.y“, „RL Nr.“ einheitlich, Dopplungen gestrichen, Spaltenbreiten und Druckbereich der Zeitreihenblätter). Einzelheiten und offene Punkte: `KONZEPT-v3.md`, Abschnitt Q.4 und Abschnitt I (O16 bis O20).

## Abhängigkeiten

- Python 3 (getestet mit 3.13), `openpyxl` (getestet mit 3.1.5); sonst nur Standardbibliothek. Die Referenzrechnung braucht nur die Standardbibliothek.
- LibreOffice (getestet mit 24.2) und `recalc.py` des xlsx-Skills für die Neuberechnung.

```sh
python -m venv .venv && .venv/bin/pip install openpyxl==3.1.5
```

## Drittes Projekt

Ohne Codeänderung: Kopie der Mappe anlegen, auf „Eingaben“ Spalte D (Projekt 1, das Vergleichshaus) und den Namen in D4 überschreiben und D3 auf 1 stellen; auf „Tabellen“ den Liegenschaftszins des Standorts in D36:D41 eintragen und die Fußnote A42 anpassen (Tabelle 4 führt den Liegenschaftszins je Projekt). Projekt 2 ist das Modellhaus von Broschüre und Präsentation und bleibt stehen.

Dauerhaft im Generator (heute fest zwei Projektspalten D und E, „verwendet“ in F, Quelle in G):

1. `EINGABEN`: je Eingabe einen dritten Wert hinter dem Wert von Projekt 2 ergänzen, Quelle anpassen; `PROJEKTE` um den Namen ergänzen, `PROJEKT_STANDARD` prüfen.
2. `blatt_eingaben()`: Projektspalte F einfügen, „verwendet“ nach G, Quelle nach H; `Projektliste` = `$D$4:$F$4`; Formel „verwendet“ `=INDEX($D r:$F r,Projekt_Nr)`; Namen der Eingaben auf Spalte G; Auswahl in D3 `"1,2,3"` mit Meldung; bedingte Formatierung und Datenüberprüfung auch für Spalte F; Breiten, Fixierung, Druckbereich.
3. Prüfung P6 „Eingaben vollständig“ (Übersicht, Formel mit `Projekt_Nr=1`) um Spalte F erweitern.
4. `LIEGENSCHAFTSZINS` und `blatt_tabellen()`: Tabelle 4 hat heute die Spalten D (Projekt 1), E (Projekt 2) und F („verwendet“); für ein drittes Projekt reichen die Spalten D bis F nicht. Die Spalte „verwendet“ und `LZ_Satz` wandern dann nach G, die Quelle nach H (oder der Liegenschaftszins wird je Restnutzungsdauer eine Eingabe).
5. `KONZEPT-v3.md` (B.1, B.2, C) und `pruefe_vofi.py` (Projektschlüssel `PROJEKT_NAME`, `PROJEKT_SPALTE`, `PROJEKT_NR`, Eingabeadressen, Projektwerte, Tabelle 4, Läufe) nachziehen, dann neu aufbauen und prüfen.
