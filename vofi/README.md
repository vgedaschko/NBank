# VOFI Mietwohnraum 2026, Version 3

Wirtschaftlichkeitsmappe für geförderten Mietwohnungsbau nach RL Mietwohnraum 2026 (Niedersachsen). Die Mappe wird vollständig aus Code erzeugt und automatisch geprüft.

## Dateien

| Datei | Inhalt |
|---|---|
| `PGN_VOFI_Mietwohnraum_2026_v3.xlsx` | Mappe, neu berechnet, aktives Projekt Modellhaus |
| `build_vofi.py` | Generator (openpyxl): Blätter, Formeln, Namen, Formate, Druck |
| `pruefe_vofi.py` | Abnahmeprüfung: Struktur, Gestaltung, Sprache, Seitenreserve im Druck (gerechnet nach der Breitenregel von Excel), 68 Testläufe gegen Referenzrechnung, Broschüre S. 10–12 und v2-1; Regression gegen den Stand vor der Erweiterung „Frei finanziert“. Stand 11.11.2026: 599 Prüfungen |
| `KONZEPT-v3.md` | Sollkonzept (intern): Zelladressen, Namen, Rechenlogik, Sollwerte, Abweichungen, Fundstellen der Eingaben; Abschnitt Q: Bewertungsansätze des Modellhauses für Rotenburg (Wümme), Liegenschaftszins je Projekt, Lektorat der Texte (11.11.2026) |
| `AENDERUNGEN.md` | Änderungen gegenüber v2-1, für PGN |

Nur gelesen, nie verändert:

- `../broschuere/zulieferungen/PGN_NBank_VOFI_Modell_v2-1.xlsx` (Vorgängermappe, SHA-256 beginnt mit `11d558b3`)
- `../broschuere/zulieferungen/vofi-pruefung/referenzrechnung.py` und `annahmen.json` (unabhängige Referenzrechnung)
- `../broschuere/content/pages/10-*.json`, `11-*.json`, `12-*.json` (Broschürenwerte)

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

Regression (Konzept N.6, Q.3): Das Prüfskript vergleicht die Läufe L63 und L64 mit dem Stand vor der Erweiterung „Frei finanziert“ (Commit `0dfe8a2`). Beide rechnen mit dem Tilgungssatz dieses Stands (2,5 %), L63 dazu mit den Bewertungsansätzen des Modellhauses bis 10.11.2026 (Vergleichs- und Marktmiete 12,92 / 14,48 €/m², Liegenschaftszins Neu Wulmstorf). L68 hält den Stand vom 10.11.2026 fest (Tilgung 1/42, dieselben früheren Bewertungsansätze). Texte, die das Lektorat vom 11.11.2026 geändert hat, vergleicht die Regression im neuen Wortlaut. Es holt die Vergleichsdatei selbst mit `git show` aus dem Repository in den Arbeitsordner; ohne Repository meldet es einen Hinweis (kein Fehler). Eine eigene Datei geht über `--baseline PFAD` oder `VOFI_BASELINE`:

```sh
git show 0dfe8a2:vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx > /tmp/vofi_stand_vorher.xlsx
python pruefe_vofi.py --baseline /tmp/vofi_stand_vorher.xlsx
```

Änderungen an der Mappe immer im Generator, nie in der xlsx. Wer Adressen, Texte oder Rechenregeln ändert, zieht `KONZEPT-v3.md` und `pruefe_vofi.py` nach; das Prüfskript liest den Generator nicht. Jeder Text der Mappe steht deshalb an drei Stellen im selben Wortlaut: `build_vofi.py`, `pruefe_vofi.py`, `KONZEPT-v3.md`.

## Stand 11.11.2026

- Bewertungsansätze des Modellhauses (Projekt 1) für Rotenburg (Wümme), auf Entscheidung des Auftraggebers: Eingabe 4.4 Marktmiete 13,30 €/m² (vorher 14,48), Eingabe 4.3 Vergleichsmiete 11,87 €/m² (vorher 12,92, PGN-Annahme), Liegenschaftszins 3,3 bis 3,5 % (vorher 2,5 bis 3,1 %). Projekt 2 ist unverändert.
- Blatt Tabellen, Tabelle 4 „Bewertung, Liegenschaftszins je Projekt“: D36:D41 Projekt 1, E36:E41 Projekt 2, F36:F41 „verwendet“ (`=INDEX($D36:$E36,Projekt_Nr)`, Name `LZ_Satz`), Quelle in G36, Fußnoten in A42 und A43, Druckbereich A1:G43. Keine Zeile und keine Spalte ist eingefügt oder verschoben.
- Die Referenzrechnung unter `../broschuere/` ist unverändert; `pruefe_vofi.py` parametriert sie (`ovm_start`, `markt_start`, `lz_tab`).
- Lektorat der Texte: 63 Befunde eingearbeitet (Kürzel in Hinweis 2 erklärt, eine Größe mit einem Namen, Verweise als „Eingabe x.y“, „RL Nr.“ einheitlich, Dopplungen gestrichen, Spaltenbreiten und Druckbereich der Zeitreihenblätter). Einzelheiten und offene Punkte: `KONZEPT-v3.md`, Abschnitt Q.4 und Abschnitt I (O16 bis O20).

## Abhängigkeiten

- Python 3 (getestet mit 3.13), `openpyxl` (getestet mit 3.1.5); sonst nur Standardbibliothek. Die Referenzrechnung braucht nur die Standardbibliothek.
- LibreOffice (getestet mit 24.2) und `recalc.py` des xlsx-Skills für die Neuberechnung.

```sh
python -m venv .venv && .venv/bin/pip install openpyxl==3.1.5
```

## Drittes Projekt

Ohne Codeänderung: Kopie der Mappe anlegen, auf „Eingaben“ Spalte E (Projekt 2) und den Namen in E4 überschreiben; auf „Tabellen“ den Liegenschaftszins des Standorts in E36:E41 eintragen und die Fußnote A42 anpassen (Tabelle 4 führt den Liegenschaftszins je Projekt).

Dauerhaft im Generator (heute fest zwei Projektspalten D und E, „verwendet“ in F, Quelle in G):

1. `EINGABEN`: je Eingabe einen dritten Wert hinter dem Tarutinoer-Wert ergänzen, Quelle anpassen; `PROJEKTE` um den Namen ergänzen.
2. `blatt_eingaben()`: Projektspalte F einfügen, „verwendet“ nach G, Quelle nach H; `Projektliste` = `$D$4:$F$4`; Formel „verwendet“ `=INDEX($D r:$F r,Projekt_Nr)`; Namen der Eingaben auf Spalte G; Auswahl in D3 `"1,2,3"` mit Meldung; bedingte Formatierung und Datenüberprüfung auch für Spalte F; Breiten, Fixierung, Druckbereich.
3. Prüfung P6 „Eingaben vollständig“ (Übersicht, Formel mit `Projekt_Nr=1`) um Spalte F erweitern.
4. `LIEGENSCHAFTSZINS` und `blatt_tabellen()`: Tabelle 4 hat heute die Spalten D (Projekt 1), E (Projekt 2) und F („verwendet“); für ein drittes Projekt reichen die Spalten D bis F nicht. Die Spalte „verwendet“ und `LZ_Satz` wandern dann nach G, die Quelle nach H (oder der Liegenschaftszins wird je Restnutzungsdauer eine Eingabe).
5. `KONZEPT-v3.md` (B.1, B.2, C) und `pruefe_vofi.py` (Eingabeadressen, Projektwerte, Tabelle 4, Läufe) nachziehen, dann neu aufbauen und prüfen.
