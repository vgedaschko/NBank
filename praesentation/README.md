# Mietwohnraumförderung Niedersachsen 2026: Vortragsfassung

Vortrag der Planungsgemeinschaft Nord GmbH zur RL Mietwohnraum 2026. 33 Folien im Format 16:9: 25 im Hauptteil, 8 im Anhang.
Zahlen und das Design „Planwerk“ folgen der Broschüre. Einziges Rechenbeispiel ist das Modellhaus der Broschüre
(20 Wohnungen, 1.400 m², 7,0 Mio. €). Stand der Inhalte: 30.09.2026.

Aufbau: Der Vortrag behandelt Programmteil 2.1 (Neubau mit Darlehen und Zuschuss); die Programmteile 2.2 bis 2.6 stehen in der
Broschüre und in Kurzform auf der Anhangfolie A1.

| Abschnitt | Folien | Inhalt |
|---|---|---|
| 1 Ausgangslage | 1 bis 6 | Titel; Einstieg in vier Folien: Baukosten seit 2020, Bauzinsen, Kapitaldienst je m² und Monat, Bestand gebundener Wohnungen in Niedersachsen; Agenda mit dem Fokus auf Programmteil 2.1 |
| 2 Programmteil 2.1 | 7 bis 10 | Neuerungen seit 01.07.2026, Höchstmiete, Fördermix, Eckdaten |
| 3 Ihre Rechnung | 11 bis 22 | Trenner; Finanzierung, Jahresrechnung, Kapitaldienst; Zahlungsfluss gefördert und frei finanziert als Flussdiagramme im selben Maßstab; nötige Miete, Tilgungssatz, Verlauf; Herstellungskosten der PGN gegen ARGE, Kostenszenario; Zusammenfassung |
| 4 Umsetzung | 23 bis 25 | Antragsweg, Leistungen der PGN, Kontakt |
| Anhang | A0 bis A7 | Trenner, Programmteile, Frist, Voraussetzungen, Verträge vor der Bewilligung, Mieterkreis, Eckdaten, Quellen und Hinweis |

Den Stempel „Modellrechnung“ tragen die Folien des Modellhauses (12 bis 19, 21 und 22). Die Folien 2 bis 5 und 20 rechnen mit
Medianwerten und Kostenkennwerten, nicht mit dem Modellhaus, und tragen keinen Stempel.

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
| `folien/<id>.cjs` | ein Modul je Folie; `folien/_<gruppe>.cjs` enthält, was nur eine Baugruppe braucht (zum Beispiel `_fluss.cjs`: Maßstab und Lagen der beiden Flussdiagramme) |
| `lib/` | Bibliothek: Theme, Layouts, Bausteine, Diagramme (auch das Flussdiagramm aus nativen Formen), Datenzugriff, Prüfungen beim Bau; Beschreibung in `lib/API.md`. `lib/layoutnamen.json`: Namen der Layouts im Layout-Menü |
| `daten/outline.json` | Folienkonzept: Reihenfolge, Titel, Wortlaut, Sprechernotizen, Quellen. `INHALT.md` ist die Lesefassung dazu |
| `daten/werte.json` | Zahlen der Rechenmappe, erzeugt aus `../vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx` |
| `daten/regeln.json`, `markt.json`, `umsetzung.json`, `rahmen.json`, `rechnung.json` | Zahlen und Texte, die nur die Broschüre oder die Altfassung hat, je Eintrag mit Herkunft und Prüfstand. `markt.json` führt die Daten des Einstiegs und des Kostenvergleichs (Blöcke `baukosten`, `zinsen`, `kapitaldienst`, `bestand`, `markt`, `kosten`), `rahmen.json` die Agenda (Abschnitte, Register der Programmteile) und die Quellentabelle |
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
Abschnitte, Blattnummern, Notizen, Dateieigenschaften, eindeutige Form-IDs, Schriften und Mindestgrößen, Alternativtexte
(Bilder, Diagramme, Flussdiagramme), verbotene Wörter und Gedankenstriche.

- **Aufbau:** Kennung, Blattnummer und Abschnitt jeder Folie stehen fest am Anfang des Skripts (`AUFBAU`), ebenso die Folien mit
  Stempel (`STEMPEL`). Wer eine Folie einfügt, streicht oder verschiebt, führt beide Listen und die Verweise mit. Kicker und Rubrik
  jeder Folie beginnen mit dem Namen ihres Abschnitts, die Agenda nennt dieselben Namen, der Trenner dieselbe Zählung; die einzige
  Ausnahme ist der Kicker der Agenda (`KICKER_OHNE_ABSCHNITT`). Das Register der Agenda trägt die Seiten der Broschüre (`REGISTER`).
- **Verweise:** „Folie n“ und „Anhang A n“ in Folientexten und Notizen müssen die Blattnummer der gemeinten Folie nennen
  (`VERWEISE`: Folie, Text, Kennung der gemeinten Folie). So fällt nach einer neuen Zählung jeder Verweis auf, der nicht folgt.
- **Zahlen:** Jede Zahl braucht einen Beleg in `daten/werte.json`, in einer Datendatei oder in `daten/pruefung.json`. Die
  Einheit zählt: Vor „%“ belegt nur ein Anteil oder eine Prozentangabe, vor „€“ und „Mio.“ nur ein Eurobetrag. Zahlen hinter
  einem Schrägstrich („5.330/5.550 €“) werden wie jede andere geprüft.
- **Daten und Jahreszahlen** gelten nur, wenn eine Datendatei oder `daten/pruefung.json` sie führt. „Broschüre S. n“ gilt für
  die Seiten 1 bis 24, ein Folienverweis nur für eine Blattnummer des Konzepts.
- **Kernwerte und Kernsätze** stehen an ihren Folien mit Einheit und Vorzeichen („−18.495“, „+52,9 %“, „Laufzeit höchstens 42 Jahre“,
  „Bearbeitungsentgelt 1 % des bewilligten Darlehens und 0,75 % des bewilligten Zuschusses“), einige auch in den Diagrammdaten.
  Die Listen `KERNWERTE` (Modellhaus), `KERNWERTE_MARKT` (Ausgangslage und Kostenvergleich), `KERNSAETZE` und `KERNWERTE_DIAGRAMM`
  stehen am Anfang des Skripts. Eine Quelle ist ein Schlüssel der Rechenmappe oder eine Formel wie in `daten/pruefung.json`; so sind
  auch gerechnete Größen gebunden (Kapitaldienst je m² 8,95 und 20,14 €, nötige Sollmiete frei finanziert 348.167 €).
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

Gerendert und geprüft ist die Mappe mit LibreOffice. Vor dem ersten Vortrag einmal in PowerPoint öffnen und jede Folie ansehen,
besonders die Flussdiagramme der Folien 15 und 16 (Freihandformen, Transparenz der hellen Bänder), die Agenda (Folie 6) und die
Tabelle „Rechenweg“ der Folie 4.
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
- **Beschriftungen an den Diagrammen** (Summen, Endwerte, Maßketten, Werte über den Säulen der Folien 2 und 5, die Jahre unter dem
  Verlauf der Folie 19) sind Textfelder und folgen geänderten Diagrammdaten nicht; Zahlen deshalb in den Datendateien ändern und
  neu bauen. Die Flussdiagramme der Folien 15 und 16 sind ganz aus Formen gebaut: Bänder und Beschriftung entstehen nur beim Bau.
- **Folien einfügen, streichen oder verschieben:** Reihenfolge, Blattnummern (`nr`) und Abschnitte in `daten/outline.json`. Der
  Trenner zählt die Abschnitte von selbst; die Agenda führt ihre vier Abschnitte in `daten/rahmen.json`, der Bau prüft sie gegen
  das Konzept. Danach die Verweise in Notizen und Datendateien nachführen (der Bau prüft die Quellentabelle, `pruefe_folien.py`
  die Listen `AUFBAU`, `STEMPEL` und `VERWEISE`).
- **Speichern:** Die Mappe nur mit PowerPoint speichern. LibreOffice dient allein dem Rendern und entfernt beim Speichern
  Abschnitte, Diagrammdaten und Alternativtexte.
- **Ort und Datum des Vortrags:** Eingabefeld auf der Titelfolie, in PowerPoint ausfüllen.

Nicht auf die Folien gehören Renditen, Deckungsgrade und eine Marktmiete des Modellhauses. Quellen stehen in den Notizen und
auf der Anhangfolie A7, nicht als Fußzeile.

## Ungeprüfte Angaben aus der Altfassung

Diese Angaben stammen aus der Präsentation vom 26.10.2026 und sind nicht nachgeprüft. In den Datendateien tragen sie
`"geprueft": false`, in den Notizen der Folien 2 bis 5, 20, 21 und A7 den Vermerk. Seit dem Umbau stehen sie im Hauptteil, auf den
Folien 2, 4, 5 und 20 auch im Titel. Vor dem ersten Vortrag bestätigt PGN sie oder nimmt sie heraus.

- Folie 2: ARGE-Mediane deutscher Großstädte, Bruttokosten je m² Wohnfläche, Q1 2020 und Q4 2025: Herstellung 3.028 und 4.631 € (+52,9 %), Grundstück 726 und 761 € (+4,8 %); in den Notizen Bauwerk +52,2 % und Baunebenkosten +57,1 % (Altfassung Folie 23).
- Folie 3: Zinsreihe „Sollzins p. a. nach Zinsbindung“, 127 Monatswerte 01/2016 bis 07/2026 für 10, 20 und 30 Jahre, Bezeichnung „Top-Konditionen Wohnungswirtschaft“ (Altfassung Folie 24; Quelle dort: Dr. Klein Wowi Finanz AG).
- Folie 3: Ø Q1 2020 0,46 | 0,87 | 0,98 %; Ø Q4 2025 3,49 | 3,74 | 3,87 %; Juli 2026 3,74 | 4,02 | 4,15 %; in den Notizen Tiefstwert 0,33 % (10/2020) und Höchstwert 3,86 % (10/2023).
- Folie 4: Kapitaldienst je m² und Monat 8,95 € (Q1 2020) und 20,14 € (heute), Anstieg 11,19 € mit den Anteilen 3,91 | 5,07 | 2,21 €. Neu gerechnet nach der Methode der Rechenmappe (80 % Fremdkapital, jährliche Annuität über 30 Jahre), aber auf ungeprüften Eingangswerten: Kosten 3.754 und 5.392 € je m² (ARGE), Zins 0,46 % (Dr. Klein Wowi Finanz AG); der Fremdkapitalanteil von 80 % ist die Annahme der Altfassung Folie 5.
- Folie 5: Bestand an Mietwohnungen mit Miet- und Belegungsbindung in Niedersachsen zum 31.12., 2016 bis 2025 (85.766 bis 50.920, Rückgang 40,6 %; Altfassung Folie 4; Quelle dort: BT-Drs. 21/7303, Antwort der Bundesregierung vom 21.07.2026). Geprüft sind auf dieser Folie die Zahlen der Broschüre S. 3 (58.024, rund 16.000, 28 %, Bestand 2024 50.495).
- Folien 20 und 21: Herstellungskosten 3.579 € je m² (Median aus fünf PGN-Projekten, Kostengruppen 200–700, Kostenstand Q4 2025; Altfassung Folien 11 und 12).
- Folie 21, Spalte 3.579 €: Gesamtkosten 5,71 Mio. €, Förderung 4,57 Mio. €, Zahlungsüberschuss 15.928 €, nötige Miete 5,83 €; in den Notizen Kapitaldienst 68.527 € und nötige Miete frei finanziert 17,21 €. Mit der Mappe gerechnet, aber auf dem ungeprüften Eingabewert.
- Folie 20: PGN-Werte je Kostengruppe (Median Bauwerk 2.812 €, Baunebenkosten 458 €, Außenanlagen 221 €; Spanne Herstellung 3.321 bis 3.861 €; Altfassung Folie 12).
- Folie 20: ARGE-Werte für deutsche Großstädte, Bruttokosten (Median Q4 2025: Herstellung 4.631 €, Bauwerk 3.713 €, Baunebenkosten 555 €, Außenanlagen 174 €; Spanne Herstellung 3.221 bis 8.592 €; Altfassung Folie 12) und der daraus gerechnete Abstand von 22,7 %.
- Quellenangaben zu diesen Daten (ARGE e. V., Wohnungsbau in Deutschland 2026, S. 32 Abb. 20 und S. 34 Abb. 23; Dr. Klein Wowi Finanz AG; BT-Drs. 21/7303; PGN, eigene Auswertung von fünf Projekten) stammen aus den Quellenzeilen der Altfassung.

Bestätigt PGN den Wert 3.579 € nicht, entfallen Folie 20 und die Spalte 3.579 € der Folie 21.

Offene Fragen an PGN (Tenor der Jahresrechnung, Tilgungssatz 2,5 %, Titel der Zusammenfassung, Daten der Altfassung im Einstieg,
Dauer des Vortrags, Ort und Datum, Bildrechte) stehen am Ende von `INHALT.md`.
