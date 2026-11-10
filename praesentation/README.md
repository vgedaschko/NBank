# Mietwohnraumförderung Niedersachsen 2026: Vortragsfassung

Vortrag der Planungsgemeinschaft Nord GmbH zur RL Mietwohnraum 2026. 36 Folien im Format 16:9: 28 im Hauptteil, 8 im Anhang.
Zahlen und das Design „Planwerk“ folgen der Broschüre. Einziges Rechenbeispiel ist das Modellhaus der Broschüre
(20 Wohnungen, 1.400 m², 7,0 Mio. €). Stand der Inhalte: 30.09.2026.

Aufbau: Der Vortrag behandelt Programmteil 2.1 (Neubau mit Darlehen und Zuschuss); die Programmteile 2.2 bis 2.6 stehen in der
Broschüre und in Kurzform auf der Anhangfolie A1.

| Abschnitt | Folien | Inhalt |
|---|---|---|
| 1 Ausgangslage | 1 bis 7 | Titel; Trenner; Einstieg in vier Folien: Baukosten seit 2020, Bauzinsen, Kapitaldienst je m² und Monat, Bestand gebundener Wohnungen in Niedersachsen; Agenda mit dem Fokus auf Programmteil 2.1 |
| 2 Programmteil 2.1 | 8 bis 12 | Trenner; Neuerungen seit 01.07.2026, Höchstmiete, Fördermix, Eckdaten |
| 3 Ihre Rechnung | 13 bis 24 | Trenner; Finanzierung, Jahresrechnung, Kapitaldienst; Zahlungsfluss gefördert und frei finanziert als Flussdiagramme im selben Maßstab; nötige Miete, Tilgungssatz, Verlauf; Herstellungskosten der PGN gegen ARGE, Kostenszenario; Zusammenfassung |
| 4 Umsetzung | 25 bis 28 | Trenner; Antragsweg, Leistungen der PGN, Kontakt |
| Anhang | A0 bis A7 | Trenner, Programmteile, Frist, Voraussetzungen, Verträge vor der Bewilligung, Mieterkreis, Eckdaten, Quellen und Hinweis |

Den Stempel „Modellrechnung“ tragen die Folien des Modellhauses (14 bis 21, 23 und 24). Die Folien 3 bis 6 und 22 rechnen mit
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
| `build.cjs` | baut die Mappe aus Konzept, Folienmodulen und Daten und bearbeitet sie nach (Theme-Farben, Schraffur, Stricharten, Fläche unter einer Linie, Kontur je Datenpunkt, Dateieigenschaften, eindeutige Form-IDs, Platzhalter der Layouts, Diagramme nach Schema, Kennzeichnung dekorativer Formen). Zwei Läufe liefern dieselbe Datei; ihr Datum ist der Stand der Inhalte |
| `folien/<id>.cjs` | ein Modul je Folie; `folien/_<gruppe>.cjs` enthält, was nur eine Baugruppe braucht (zum Beispiel `_fluss.cjs`: Maßstab und Lagen der beiden Flussdiagramme), `folien/_fein_<id>.cjs`, was nur eine Folie braucht (Folie 4: Legende mit Werten und Werteblöcke an den Marken; Folie 22: Maßzeichen der Spanne) |
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
- **Zahlen:** Jede Zahl braucht einen Beleg in `daten/werte.json`, in einer Datendatei oder in `daten/pruefung.json`; das gilt
  auch für die Alternativtexte der Diagramme und Flussdiagramme, die jeden Strom mit Betrag und Anteil nennen. Die
  Einheit zählt: Vor „%“ belegt nur ein Anteil oder eine Prozentangabe, vor „€“ und „Mio.“ nur ein Eurobetrag. Zahlen hinter
  einem Schrägstrich („5.330/5.550 €“) werden wie jede andere geprüft.
- **Daten und Jahreszahlen** gelten nur, wenn eine Datendatei oder `daten/pruefung.json` sie führt. „Broschüre S. n“ gilt für
  die Seiten 1 bis 24, ein Folienverweis nur für eine Blattnummer des Konzepts.
- **Kernwerte und Kernsätze** stehen an ihren Folien mit Einheit und Vorzeichen („−13.495“, „+52,9 %“, „Laufzeit höchstens 42 Jahre“,
  „Bearbeitungsentgelt 1 % des bewilligten Darlehens und 0,75 % des bewilligten Zuschusses“), einige auch in den Diagrammdaten.
  Die Listen `KERNWERTE` (Modellhaus), `KERNWERTE_MARKT` (Ausgangslage und Kostenvergleich), `KERNSAETZE` und `KERNWERTE_DIAGRAMM`
  stehen am Anfang des Skripts. Eine Quelle ist ein Schlüssel der Rechenmappe oder eine Formel wie in `daten/pruefung.json`; so sind
  auch gerechnete Größen gebunden (Kapitaldienst je m² 8,95 und 20,14 €, nötige Sollmiete frei finanziert 348.167 €).
- **Werte an den Diagrammen der Folien 3 bis 6 und 22** stehen als Textfelder neben ihrer Bezeichnung und zum Teil mehrfach auf der
  Folie. Die Liste `KERNWERTE_FORM` bindet sie deshalb an ihre Form oder Tabellenzelle: Das Textfeld mit diesem Namen trägt genau diesen
  Wert (Werte über den Säulen, Legende und Werteblöcke der Folie 4, Maßkettenwerte, „Maximum 8.592“, Summen und Tabelle „Rechenweg“ der
  Folie 5). Die Liste `REIHEN_DIAGRAMM` prüft ganze Zeitreihen Wert für Wert gegen die Datendatei (drei Zinsreihen und die Fläche der
  Folie 4, Bestandsreihe der Folie 6). Wer eine Form umbenennt oder eine Tabellenzeile verschiebt, führt die Liste mit.
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
besonders die Flussdiagramme der Folien 17 und 18 (Freihandformen, Transparenz der hellen Bänder, gestrichelter Umriss an der Quelle
der Folie 17), die Agenda (Folie 7) und die Tabelle „Rechenweg“ der Folie 5. Einzeilige Beschriftungen brechen nicht um: Ist eine
Schrift auf dem Vortragsrechner breiter, läuft der Text über sein Feld, statt in eine zweite Zeile zu fallen.

Die fein gezeichneten Diagramme der Folien 3 bis 6 und 22 in PowerPoint eigens ansehen, mit installierten Schriften und bei 200 %.
Beim Öffnen darf keine Meldung „Reparieren“ erscheinen. Geprüft ist bisher nur das Bild aus LibreOffice.

- **Folie 3:** Werte und Maßketten sitzen mittig über den Säulen (ihre Lage ist aus Lücke und Fuge des Diagramms gerechnet; in den
  Reihenoptionen stehen Abstandsbreite 418 % und Überlappung −12 %); Kontur 0,5 pt an beiden Reihen; die Flächen in der Grundfarbe
  unterbrechen die Gitterlinie nur an den Werten und am Maßkettenwert „+4,8 %“.
- **Folie 4:** die weiche Fläche unter der Reihe „10 Jahre“ (Flächendiagramm hinter den Linien; in „Datenreihen formatieren“ ein
  Farbverlauf linear nach unten von Rot nach Weiß, zwei Stopps, Transparenz 74 %, keine Kontur; Anfang und Ende an der Mitte des ersten
  und des letzten Monats; die Gitterlinien scheinen durch). Die Fläche ist eine eigene Reihe „10 Jahre, Fläche“ auf der Spalte der Reihe
  „10 Jahre“; ihr Name steht fest im Diagramm, unter „Daten bearbeiten“ erscheinen deshalb vier Reihen auf drei Wertspalten. Dazu die beiden
  Werteblöcke (die Gitterlinie läuft mit rund 0,05 Zoll Luft in der Fuge unter der ersten Zeile; rechnet PowerPoint die Zeile höher,
  rückt sie an die Zahl) und das Strichmuster der beiden Marken (0,5 pt).
- **Folie 5:** Die drei Ursachen führen bei „Q1 2020“ den Wert 0; diese drei Datenpunkte stehen ohne Füllung und ohne Linie
  (Nachbearbeitung), damit auf der Oberkante der linken Säule keine zweite Linie liegt. Wer dort in PowerPoint einen Wert einträgt,
  sieht kein Segment. Die Oberkante soll so stark wirken wie der übrige Umriss. Maßstriche sitzen auf den Säulenkanten, Summen mittig
  über den Säulen (Abstandsbreite 165 %); die Trennlinien zwischen den Segmenten sind so stark wie der Umriss. Die Zuleitungen
  (0,5 pt in Referenzgrau 77716B) führen von jedem Segment zu seiner Zeile. Dazu das Strichmuster der Bezugslinie (0,5 pt).
- **Folie 6:** Jede der zehn Säulen trägt ihre Kontur (die Nachbearbeitung setzt sie je Datenpunkt); ohne sie stünden die hellen Säulen
  kaum sichtbar auf Weiß.
- **Folie 22:** Werte, Maßzeichen der Spanne, Pfeilspitze mit „Maximum 8.592“ und Marke sitzen neben und über den Säulen
  (Abstandsbreite 156 %, Überlappung −12 %); die gestrichelte Marke (1 pt) setzt an der Maßlinie der ARGE-Spanne aus; die Flächen in
  der Grundfarbe unterbrechen die Gitterlinien an 4.631 und 3.713 mit Absicht.
- **Folien 4 bis 6 nacheinander zeigen:** Die Jahre der Folie 4 sind Textfelder, die Jahre der Folie 6 und die Kategorien der Folie 5
  Achsbeschriftung des Diagramms. In LibreOffice stehen beide auf einer Höhe; in PowerPoint kann der Abstand zur Achse anders ausfallen.
  Springt es beim Blättern sichtbar, die Jahre der Folie 6 als Textfelder setzen wie auf Folie 4.
- **Strichmuster:** PowerPoint misst Strich und Lücke in Linienstärken. Die gestrichelten Linien der Folien 4, 5 und 22 deshalb auch am
  Beamer ansehen.

Fällt die Fläche der Folie 4 in PowerPoint anders aus als im PDF, nimmt man in `folien/ausgangslage-zinsen.cjs` die Option `flaeche`
aus dem Aufruf von `D.linien` und baut neu; alles andere bleibt.

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
- **Beschriftungen an den Diagrammen** (Summen, Endwerte, Maßketten, Werte und Maßketten über den Säulen der Folien 3, 5, 6 und 22,
  die Maßzeichen der Spanne auf Folie 22, auf Folie 4 die Werte in Legende und Werteblöcken, die Jahre und der Punkt am Linienende,
  die Jahre unter dem Verlauf der Folie 21) sind Textfelder und Formen und folgen geänderten Diagrammdaten nicht; Zahlen deshalb in
  den Datendateien ändern und neu bauen. Die Flussdiagramme der Folien 17 und 18 sind ganz aus Formen gebaut: Bänder und Beschriftung entstehen nur beim Bau.
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
`"geprueft": false`, in den Notizen der Folien 3 bis 6, 22, 23 und A7 den Vermerk (auf den Folien 3 bis 6 und 22 als Regie-Hinweis,
dazu in jeder Quellenzeile). Seit dem Umbau stehen sie im Hauptteil, auf den Folien 3 bis 6 und 22 auch im Titel. Vor dem ersten
Vortrag bestätigt PGN sie oder nimmt sie heraus.

- Folie 3: ARGE-Mediane deutscher Großstädte, Bruttokosten je m² Wohnfläche, Q1 2020 und Q4 2025: Herstellung 3.028 und 4.631 € (+52,9 %), Grundstück 726 und 761 € (+4,8 %); in den Notizen Bauwerk +52,2 % und Baunebenkosten +57,1 % (Altfassung Folie 23).
- Folie 4: Zinsreihe „Sollzins p. a. nach Zinsbindung“, 127 Monatswerte 01/2016 bis 07/2026 für 10, 20 und 30 Jahre, Bezeichnung „Top-Konditionen Wohnungswirtschaft“ (Altfassung Folie 24; Quelle dort: Dr. Klein Wowi Finanz AG).
- Folie 4: Ø Q1 2020 0,46 | 0,87 | 0,98 %; Ø Q4 2025 3,49 | 3,74 | 3,87 %; Juli 2026 3,74 | 4,02 | 4,15 %; im Titel 3,74 und 0,46 % (10 Jahre Zinsbindung); in den Notizen Tiefstwert 0,33 % (10/2020) und Höchstwert 3,86 % (10/2023).
- Folie 5: Kapitaldienst je m² und Monat 8,95 € (Q1 2020) und 20,14 € (heute), Anstieg 11,19 € mit den Anteilen 3,91 | 5,07 | 2,21 €. Neu gerechnet nach der Methode der Rechenmappe (80 % Fremdkapital, jährliche Annuität über 30 Jahre), aber auf ungeprüften Eingangswerten: Kosten 3.754 und 5.392 € je m² (ARGE), Zins 0,46 % (Dr. Klein Wowi Finanz AG); der Fremdkapitalanteil von 80 % ist die Annahme der Altfassung Folie 5.
- Folie 6: Bestand an Mietwohnungen mit Miet- und Belegungsbindung in Niedersachsen zum 31.12., 2016 bis 2025 (85.766 bis 50.920, Rückgang 40,6 %; Altfassung Folie 4; Quelle dort: BT-Drs. 21/7303, Antwort der Bundesregierung vom 21.07.2026). Geprüft sind auf dieser Folie die Zahlen der Broschüre S. 3 (58.024, rund 16.000, 28 %, Bestand 2024 50.495).
- Folien 22 und 23: Herstellungskosten 3.579 € je m² (Median aus fünf PGN-Projekten, Kostengruppen 200–700, Kostenstand Q4 2025; Altfassung Folien 11 und 12).
- Folie 23, Spalte 3.579 €: Gesamtkosten 5,71 Mio. €, Förderung 4,57 Mio. €, Zahlungsüberschuss 18.647 €, nötige Miete 5,67 €; in den Notizen Kapitaldienst 65.808 € und nötige Miete frei finanziert 17,21 €. Mit der Mappe gerechnet, aber auf dem ungeprüften Eingabewert.
- Folie 22: PGN-Werte je Kostengruppe (Median Bauwerk 2.812 €, Baunebenkosten 458 €, Außenanlagen 221 €; Spanne Herstellung 3.321 bis 3.861 €; Altfassung Folie 12).
- Folie 22: ARGE-Werte für deutsche Großstädte, Bruttokosten (Median Q4 2025: Herstellung 4.631 €, Bauwerk 3.713 €, Baunebenkosten 555 €, Außenanlagen 174 €; Spanne Herstellung 3.221 bis 8.592 €; Altfassung Folie 12) und der daraus gerechnete Abstand von 22,7 %.
- Quellenangaben zu diesen Daten (ARGE e. V., Wohnungsbau in Deutschland 2026, S. 32 Abb. 20 und S. 34 Abb. 23; Dr. Klein Wowi Finanz AG; BT-Drs. 21/7303; PGN, eigene Auswertung von fünf Projekten) stammen aus den Quellenzeilen der Altfassung.

Bestätigt PGN den Wert 3.579 € nicht, entfallen Folie 22 und die Spalte 3.579 € der Folie 23.

Offene Fragen an PGN (Tenor der Jahresrechnung, Tilgungssatz 2,38 %, Titel der Zusammenfassung, Daten der Altfassung im Einstieg,
Dauer des Vortrags, Ort und Datum, Bildrechte) stehen am Ende von `INHALT.md`.
