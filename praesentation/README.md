# Mietwohnraumförderung Niedersachsen 2026: Vortragsfassung

Vortrag der Planungsgemeinschaft Nord GmbH zur RL Mietwohnraum 2026. 28 Folien im Format 16:9: 18 im Hauptteil, 10 im Anhang.
Aufbau, Zahlen und das Design „Planwerk“ folgen der Broschüre. Einziges Rechenbeispiel ist das Modellhaus der Broschüre
(20 Wohnungen, 1.400 m², 7,0 Mio. €). Stand der Inhalte: 30.09.2026.

Ergebnis im Ordner `dist/`:

- `PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pptx`: in PowerPoint editierbar. Theme, Layouts mit Platzhaltern
  (im Layout-Menü „Inhalt“, „Diagramm · Modellrechnung“ und so weiter), Abschnitte, native Diagramme und Tabellen,
  Sprechernotizen mit Quellenzeile. Keine Folie ist ein Bild.
- `PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pdf`: dieselben Folien mit eingebetteten Schriften.

Die Mappe wird aus Code gebaut. Wer eine Folie in PowerPoint ändert, verliert die Änderung beim nächsten Bau; dauerhafte
Änderungen gehören in die Dateien unten.

## Ordner

| Ort | Inhalt |
|---|---|
| `build.cjs` | baut die Mappe aus Konzept, Folienmodulen und Daten und bearbeitet sie nach (Theme-Farben, Schraffur, Stricharten, Dateieigenschaften, eindeutige Form-IDs, Platzhalter der Layouts, Diagramme nach Schema, Kennzeichnung dekorativer Formen). Zwei Läufe liefern dieselbe Datei; ihr Datum ist der Stand der Inhalte |
| `folien/<id>.cjs` | ein Modul je Folie; `folien/_<gruppe>.cjs` enthält, was nur eine Baugruppe braucht |
| `lib/` | Bibliothek: Theme, Layouts, Bausteine, Diagramme, Datenzugriff, Prüfungen beim Bau; Beschreibung in `lib/API.md`. `lib/layoutnamen.json`: Namen der Layouts im Layout-Menü |
| `daten/outline.json` | Folienkonzept: Reihenfolge, Titel, Wortlaut, Sprechernotizen, Quellen. `INHALT.md` ist die Lesefassung dazu |
| `daten/werte.json` | Zahlen der Rechenmappe, erzeugt aus `../vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx` |
| `daten/regeln.json`, `markt.json`, `umsetzung.json`, `rahmen.json`, `rechnung.json` | Zahlen und Texte, die nur die Broschüre oder die Altfassung hat, je Eintrag mit Herkunft und Prüfstand |
| `daten/pruefung.json` | Belege für das Prüfskript: gerechnete Größen mit Formel, Zahlen der Sprechernotizen mit Herkunft |
| `assets/` | Bilder aus den Assets der Broschüre (Logo, Hintergründe, Planzeichen, Icons); neu erzeugen mit `node lib/assets.cjs` |
| `fonts/` | Montserrat und Work Sans als TTF mit Lizenztexten |
| `probe/` | Musterfolien für Layouts und Bausteine (`node build.cjs --probe`) |
| `werkzeug/render.cjs` | PDF, ein Bild je Folie und eine Übersicht zum Ansehen |
| `pruefe_folien.py` | prüft die fertige Mappe von außen |

## Befehle

Im Ordner `praesentation`, mit Node 22 und Python 3. Einmalig `npm install` (pptxgenjs und die Bildbibliothek).

```bash
# 1 Zahlen aus der Rechenmappe neu erzeugen und gegen Broschüre und Handrechnung abgleichen (braucht LibreOffice)
python daten/werte_aus_vofi.py
python daten/pruefe_werte.py

# 2 Lesefassung des Konzepts neu schreiben
python daten/inhalt_md.py

# 3 Mappe bauen (bricht ab, wenn ein Text nicht in sein Feld passt oder vom Konzept abweicht)
node build.cjs
node build.cjs --nur foerdermix,hoechstmiete --aus dist/test.pptx    # einzelne Folien

# 4 Rendern: PDF, Bilder und Übersicht nach dist/render/gesamt, das PDF zum Weitergeben nach dist/
#   braucht LibreOffice („soffice“ im Suchpfad oder SOFFICE=<Pfad zum Programm>) und pdftoppm (Poppler)
node werkzeug/render.cjs dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pptx dist/render/gesamt \
  --pdf dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pdf

# 5 Prüfen
python pruefe_folien.py              # eine Zeile je Prüfung, Summe am Ende, Rückgabewert 1 bei Fehlern
python pruefe_folien.py --zahlen     # dazu jede Zahl mit ihrem Beleg
```

`pruefe_folien.py` liest Texte, Tabellen, Diagrammdaten und Notizen der fertigen Datei. Es prüft Folienzahl, Reihenfolge,
Abschnitte, Blattnummern, Notizen, Dateieigenschaften, eindeutige Form-IDs, Schriften und Mindestgrößen, Alternativtexte,
verbotene Wörter und Gedankenstriche.

- **Zahlen:** Jede Zahl braucht einen Beleg in `daten/werte.json`, in einer Datendatei oder in `daten/pruefung.json`. Die
  Einheit zählt: Vor „%“ belegt nur ein Anteil oder eine Prozentangabe, vor „€“ und „Mio.“ nur ein Eurobetrag. Zahlen hinter
  einem Schrägstrich („5.330/5.550 €“) werden wie jede andere geprüft.
- **Daten und Jahreszahlen** gelten nur, wenn eine Datendatei oder `daten/pruefung.json` sie führt. „Broschüre S. n“ gilt für
  die Seiten 1 bis 24, ein Folienverweis nur für eine Blattnummer des Konzepts.
- **Kernwerte und Kernsätze** stehen an ihren Folien mit Einheit und Vorzeichen („−18.495“, „Laufzeit höchstens 42 Jahre“,
  „Bearbeitungsentgelt 1 % des bewilligten Darlehens und 0,75 % des bewilligten Zuschusses“), einige auch in den Diagrammdaten.
  Die Listen `KERNWERTE`, `KERNSAETZE` und `KERNWERTE_DIAGRAMM` stehen am Anfang des Skripts.
- **Diagrammdaten:** Zwischenspeicher und eingebettete Arbeitsmappe jedes Diagramms stimmen überein.
- Was das Skript nicht sieht: zwei Werte derselben Einheit, die im freien Text vertauscht sind und nicht zu den Kernsätzen
  gehören. Kleine ganze Zahlen ohne Einheit prüft es nur schwach, weil sie in den Daten häufig vorkommen.

Zusatzprüfung, nicht Teil des Projekts: die Mappe mit einem Validator für Office-Open-XML gegen das Schema prüfen. Die
Nachbearbeitung bricht bei doppelten Form-IDs, ungültigen Farben und Stricharten selbst ab.

## Schriften

Die Mappe nutzt nur Montserrat und Work Sans und bettet sie nicht ein. Vor dem Vortrag die Dateien aus `fonts/` auf dem
Vortragsrechner installieren. Ohne Installation ersetzt PowerPoint die Schriften, und Umbrüche und Abstände stimmen nicht mehr.
Zwei Auswege: die Mappe auf einem Rechner mit installierten Schriften einmal mit eingebetteten Schriften speichern
(Datei, Optionen, Speichern, „Schriftarten in der Datei einbetten“) oder das PDF zeigen.

Gerendert und geprüft ist die Mappe mit LibreOffice. Vor dem ersten Vortrag einmal in PowerPoint öffnen und jede Folie ansehen.
Das PDF aus LibreOffice trägt die Sprache Deutsch und kennzeichnet Linien und Flächen als Schmuck; die Alternativtexte der
Diagramme übernimmt LibreOffice nicht. Wer ein PDF mit diesen Alternativtexten braucht, exportiert die Endfassung aus PowerPoint.

## Texte und Zahlen ändern

- **Wortlaut, Titel, Notizen, Quellen:** `daten/outline.json`. Danach `python daten/inhalt_md.py` und `node build.cjs`. Viele
  Module prüfen ihren Text gegen das Konzept; weicht er ab, nennt der Bau die Stelle.
- **Zahlen der Modellrechnung:** nur in der Rechenmappe unter `../vofi/`. Danach Schritt 1 und der Bau. `daten/werte.json` nie
  von Hand ändern. Titel, die eine Zahl nennen, stehen im Konzept und folgen nicht von selbst; der Bau und das Prüfskript
  melden die Abweichung.
- **Regelwerte, Marktzahlen, Fristen, Kontaktdaten:** in der Datendatei der Baugruppe, mit `herkunft` und `geprueft`.
- **Neue Zahl in einer Notiz oder ein neuer gerechneter Wert:** Eintrag in `daten/pruefung.json`, sonst meldet das Prüfskript
  sie als unbelegt.
- **Aussehen:** Farben, Schriften und Raster in `lib/theme.cjs`, Folienrahmen in `lib/layouts.cjs`, Bausteine in
  `lib/bausteine.cjs` und `lib/diagramme.cjs`.
- **Beschriftungen an den Diagrammen** (Summen, Endwerte, Maßketten, die Jahre unter dem Verlauf der Folie 13) sind Textfelder
  und folgen geänderten Diagrammdaten nicht; Zahlen deshalb in den Datendateien ändern und neu bauen.
- **Speichern:** Die Mappe nur mit PowerPoint speichern. LibreOffice dient allein dem Rendern und entfernt beim Speichern
  Abschnitte, Diagrammdaten und Alternativtexte.
- **Ort und Datum des Vortrags:** Eingabefeld auf der Titelfolie, in PowerPoint ausfüllen.

Nicht auf die Folien gehören Renditen, Deckungsgrade und eine Marktmiete des Modellhauses. Quellen stehen in den Notizen und
auf der Anhangfolie A9, nicht als Fußzeile.

## Ungeprüfte Angaben aus der Altfassung

Diese Angaben stammen aus der Präsentation vom 26.10.2026 und sind nicht nachgeprüft. In den Datendateien tragen sie
`"geprueft": false`, in den Notizen der Folien 2, 14, A7 und A9 den Vermerk. Vor dem ersten Vortrag bestätigt PGN sie oder
nimmt sie heraus.

- Folie 2: Zinsreihe „Sollzins p. a. nach Zinsbindung“, 127 Monatswerte 01/2016 bis 07/2026 für 10, 20 und 30 Jahre, Bezeichnung „Top-Konditionen Wohnungswirtschaft“ (Altfassung Folie 24; Quelle dort: Dr. Klein Wowi Finanz AG).
- Folie 2: Ø Q1 2020 0,46 | 0,87 | 0,98 %; Ø Q4 2025 3,49 | 3,74 | 3,87 %; Juli 2026 3,74 | 4,02 | 4,15 %; in den Notizen Tiefstwert 0,33 % (10/2020) und Höchstwert 3,86 % (10/2023).
- Folie 14 und A7: Herstellungskosten 3.579 € je m² (Median aus fünf PGN-Projekten, Kostengruppen 200–700, Kostenstand Q4 2025; Altfassung Folien 11 und 12).
- Folie 14, Spalte 3.579 €: Gesamtkosten 5,71 Mio. €, Förderung 4,57 Mio. €, Zahlungsüberschuss 15.928 €, nötige Miete 5,83 €; in den Notizen Kapitaldienst 68.527 € und nötige Miete frei finanziert 17,21 €. Mit der Mappe gerechnet, aber auf dem ungeprüften Eingabewert.
- A7: PGN-Werte je Kostengruppe (Median Bauwerk 2.812 €, Baunebenkosten 458 €, Außenanlagen 221 €; Spanne Herstellung 3.321 bis 3.861 €; Altfassung Folie 12).
- A7: ARGE-Werte für deutsche Großstädte, Bruttokosten (Median Q4 2025: Herstellung 4.631 €, Bauwerk 3.713 €, Baunebenkosten 555 €, Außenanlagen 174 €; Spanne Herstellung 3.221 bis 8.592 €; Median Q1 2020: 3.028 €; Altfassung Folien 12 und 23).
- Quellenangaben zu diesen Daten (Dr. Klein Wowi Finanz AG; ARGE e. V., Wohnungsbau in Deutschland 2026, S. 32 Abb. 20 und S. 34 Abb. 23; PGN, eigene Auswertung von fünf Projekten) stammen aus den Quellenzeilen der Altfassung.

Offene Fragen an PGN (Tenor der Jahresrechnung, Tilgungssatz 2,5 %, Bildrechte, Ort und Datum) stehen am Ende von `INHALT.md`.
