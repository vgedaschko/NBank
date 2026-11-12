# Mietwohnraumförderung Niedersachsen 2026: Vortragsfassung

Vortrag der Planungsgemeinschaft Nord GmbH zur RL Mietwohnraum 2026. 38 Folien im Format 16:9: 28 im Hauptteil, 10 im Anhang.
Zahlen und das Design „Planwerk“ folgen der Broschüre. Einziges Rechenbeispiel ist das Modellhaus: seit 11.11.2026 ein PGN-Projekt in
Neu Wulmstorf (14 Wohnungen, 828 m², 3,0 Mio. €; Grundstück im Bestand und nicht angesetzt), in der Rechenmappe „Projekt 2“
(Entscheidung 29 des Konzepts). Die Straße nennt der Vortrag nicht. Stand der Inhalte: 30.09.2026.

Aufbau: Der Vortrag behandelt Programmteil 2.1 (Neubau mit Darlehen und Zuschuss); die Programmteile 2.2 bis 2.6 stehen in der
Broschüre und in Kurzform auf der Anhangfolie A1.

| Abschnitt | Folien | Inhalt |
|---|---|---|
| 1 Ausgangslage | 1 bis 7 | Titel; Trenner; Einstieg in vier Folien: Baukosten seit 2020, Bauzinsen, Kapitaldienst je m² und Monat, Bestand gebundener Wohnungen in Niedersachsen; Agenda mit dem Fokus auf Programmteil 2.1 |
| 2 Programmteil 2.1 | 8 bis 12 | Trenner; Neuerungen seit 01.07.2026, Höchstmiete, Fördersätze, Eckdaten |
| 3 Modellrechnung | 13 bis 24 | Trenner; Finanzierung, Jahresrechnung, Kapitaldienst; Zahlungsfluss gefördert und frei finanziert als Flussdiagramme im selben Maßstab; nötige Miete, Tilgungssatz, Verlauf; Herstellungskosten der PGN gegen ARGE, Kostenszenario; Zusammenfassung |
| 4 Umsetzung | 25 bis 28 | Trenner; Antragsweg, Leistungen der PGN, Kontakt |
| Anhang | A0 bis A9 | Trenner, Programmteile, Frist, Voraussetzungen, Verträge vor der Bewilligung, Mieterkreis, Eckdaten, Eigenkapitalrendite des Modellhauses, Tilgungsschwelle je Herstellungskosten, Quellen und Hinweis |

Die Folien des Modellhauses (14 bis 21, 23 und 24) stehen auf Papierton; das Wort „Modellrechnung“ steht im Kopf. Folie 14 trägt oben rechts
den Zusatz „Rechenbeispiel, keine Förderzusage“. Die Folien 3 bis 6 und 22 rechnen mit Medianwerten und Kostenkennwerten, nicht mit dem
Modellhaus, und stehen auf weißem Grund. Sie zeigen fremde Daten und tragen deshalb im Schriftfeld eine kurze Quellenzeile.
Den Stempel im Kopf schaltet `STEMPEL_IM_KOPF` in `lib/theme.cjs` wieder ein.

## Muster 2: Aufbau jeder Folie (seit 12.11.2026)

Der Auftraggeber hat „Muster 2“ an den Folien 15 und 20 freigegeben; es gilt für alle Folien (Entscheidung 33 des Konzepts). Grundsatz:
behalten und stufen, nichts abräumen, nichts Neues erfinden.

- **Rahmen:** Jede Inhalts- und Anhangfolie trägt den Planrahmen mit Falzmarken und das Schriftfeld über die ganze Breite: Logo, Projekt und
  Thema der Folie, Quellenzeile, Blatt. Trenner, Titel- und Schlussfolie bleiben in ihrer Form.
- **Kopf:** Zeichen des Abschnitts im Achskreis (1 bis 4 wie Agenda und Trenner, im Anhang „A“) und Abschnittsname in Tinte. Das Thema steht im
  Schriftfeld; Kopf und Schriftfeld sagen nicht dasselbe. Im Konzept steht beides im Feld `inhalt` als Kicker „ABSCHNITT · THEMA“.
- **Titel:** Versalien, 32 pt mit 37 pt Zeilenabstand, genau ein Signaturwort oder eine Zahl in Rot.
- **Schrift:** Versalien nur in Titel, Kopf, Schriftfeld und kleinen Labels (Tabellenkopf, Vorsatz einer Kennzahl). Modul-, Diagramm- und
  Tabellentitel, die Titel der Stationen (Folie 26) und die Namen der Abschnitte auf der Agenda stehen gemischt in Montserrat Bold 16 pt,
  ebenso das Label unter jeder Kennzahl. Fließtext einer Folie steht in einer Größe. Größen kommen aus der Skala in `lib/theme.cjs` (`SKALA`).
- **Rot:** Titellinie, Signaturwort, Reiter 2.1, Zuschuss in Daten, Ergebniszeile, höchstens eine hervorgehobene Kennzahl je Diagramm, Logo.
  Dunkelrot bleibt Signal (Bewilligung, Frist): gefüllter Achskreis und Warnband; der Titel der Station daneben steht in Tinte wie die
  übrigen (Folie 26, A2). Einheiten, Labels, Maßketten, die 80-%-Achse und Aufzählungszeichen stehen in Tinte oder Grau.
- **Kennzahl:** Derselbe Wert steht auf einer Folie neben dem Titel nur einmal groß (Folie 5: Hauptzahl rechts, die Summen über den Säulen
  in 12 pt; Folie 19: Werte an den Balken, die Ergebniszeile der Tabelle in 16 pt).
- **Diagrammfolien** (`PGN_DIAGRAMM`, `PGN_DIAGRAMM_MR`): Diagramm über sieben Spalten, Text oder Kennzahlen über fünf. Titel, Untertitel,
  Legende und Diagramm beginnen auf allen Folien auf denselben Höhen (`ZONE.diagramm`); der Kopf frei gebauter Module (`B.modulkopf`: Folien 17
  bis 19, Anhang) liegt genauso. Passt ein Untertitel nicht in eine Zeile, steht er in zwei (Folie 5); gekürzt wird nicht. Auf Folie 22 ist die
  zweite Zeile entfallen: Sie sagte dasselbe wie das Modul „Grundlage“ rechts. Ihre Teilung behalten Folie 15 (Tabelle über acht Spalten), die frei gebauten Folien 14 und 27
  (8 + 4) und 19 (6 + 6) und die Anhangfolien A5, A7 und A8 (8 + 4).
- **Keine Sprechernotizen** (Entscheidung 32): Das Konzept führt kein Feld `notizen`, die Mappe trägt keine Notizseite. Das Feld `quellen`
  bleibt als Quellenangabe je Folie; aus ihm rechnet die Quellenfolie A9 ihre Blattnummern.

Die Anhangfolie A7 zeigt die Eigenkapitalrendite des Modellhauses über 35 Jahre, vor Steuern. Sie ist die einzige Folie mit Rendite und
Marktmiete des Modellhauses und zeigt die Rendite als Paar „mit Restwert“ und „ohne Restwert“ mit dem Anteil des Restwerts am Endvermögen;
ihr Titel nennt für Gruppe A beide Lesarten. Das Gegenstück heißt „ohne Restwert“, weil das Grundstück nicht angesetzt ist: Der Bodenwert
der Rechenmappe ist null, und ihre Lesart „nur Bodenwert“ rechnet ohne Restwert (Blatt Hinweise Nr. 15). Marktmiete und Liegenschaftszins
gelten für Neu Wulmstorf (Mietübersicht des Gutachterausschusses Lüneburg, Hamburger Umland; Landesmodell des Oberen Gutachterausschusses); die Annahmen der Folie nennen Wert und Herkunft,
die volle Angabe steht in ihrer Quellenzeile (`daten/rechnung.json`, Block `marktwerte`). Renditen und Liegenschaftszins stehen mit zwei
Nachkommastellen wie in der Rechenmappe.

Ergebnis im Ordner `dist/`:

- `PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pptx`: in PowerPoint editierbar. Theme, Layouts mit Platzhaltern
  (im Layout-Menü „Inhalt“, „Diagramm · Modellrechnung“ und so weiter), Abschnitte, native Diagramme und Tabellen.
  Keine Folie ist ein Bild; Sprechernotizen trägt die Mappe nicht.
- `PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pdf`: dieselben Folien mit eingebetteten Schriften.

Die Mappe wird aus Code gebaut. Wer eine Folie in PowerPoint ändert, verliert die Änderung beim nächsten Bau; dauerhafte
Änderungen gehören in die Dateien unten.

## Ordner

| Ort | Inhalt |
|---|---|
| `build.cjs` | baut die Mappe aus Konzept, Folienmodulen und Daten und bearbeitet sie nach (Theme-Farben, Schraffur, Stricharten, Fläche unter einer Linie, Kontur je Datenpunkt, Dateieigenschaften, eindeutige Form-IDs, Platzhalter der Layouts, Diagramme nach Schema, Kennzeichnung dekorativer Formen, Entfernen der leeren Notizseiten). Zwei Läufe liefern dieselbe Datei; ihr Datum ist der Stand der Inhalte |
| `folien/<id>.cjs` | ein Modul je Folie; `folien/_<gruppe>.cjs` enthält, was nur eine Baugruppe braucht (zum Beispiel `_fluss.cjs`: Maßstab und Lagen der beiden Flussdiagramme), `folien/_fein_<id>.cjs`, was nur eine Folie braucht (Folie 4: Legende mit Werten und Werteblöcke an den Marken; Folie 22: Maßzeichen der Spanne) |
| `lib/` | Bibliothek: Theme, Layouts, Bausteine, Diagramme (auch das Flussdiagramm aus nativen Formen), Datenzugriff, Prüfungen beim Bau; Beschreibung in `lib/API.md`. `lib/layoutnamen.json`: Namen der Layouts im Layout-Menü |
| `daten/outline.json` | Folienkonzept: Reihenfolge, Titel, Wortlaut, Quellenangabe je Folie, Entscheidungen. `INHALT.md` ist die Lesefassung dazu |
| `daten/werte.json` | Zahlen der Rechenmappe, erzeugt aus `../vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx`. Jeder Lauf rechnet Projekt 2 der Mappe (das Modellhaus), gleich ob sie mit Projekt 1 oder 2 ausgeliefert ist |
| `daten/regeln.json`, `markt.json`, `umsetzung.json`, `rahmen.json`, `rechnung.json` | Zahlen und Texte, die nur die Broschüre oder die Altfassung hat, je Eintrag mit Herkunft und Prüfstand. `markt.json` führt die Daten des Einstiegs und des Kostenvergleichs (Blöcke `baukosten`, `zinsen`, `kapitaldienst`, `bestand`, `markt`, `kosten`; je Block mit Daten einer fremden Quelle die Kurzform `quelle_kurz` für das Schriftfeld), `rahmen.json` die Agenda (Abschnitte, Register der Programmteile) und die Quellentabelle |
| `daten/pruefung.json` | Belege für das Prüfskript: gerechnete Größen mit Formel (`gerechnet`), einzelne Angaben mit Herkunft (`angaben`) |
| `assets/` | Bilder aus den Assets der Broschüre (Logo, Hintergründe, Planzeichen, Icons); neu erzeugen mit `node lib/assets.cjs` |
| `fonts/` | Montserrat und Work Sans als TTF mit Lizenztexten |
| `probe/` | Musterfolien für Layouts und Bausteine (`node build.cjs --probe`) |
| `werkzeug/render.cjs` | PDF, ein Bild je Folie und eine Übersicht zum Ansehen |
| `pruefe_folien.py` | prüft die fertige Mappe von außen |

## Befehle

Im Ordner `praesentation`, mit Node 22 und Python 3. Einmalig `npm install` (pptxgenjs und die Bildbibliothek).

```bash
# 1 Zahlen aus der Rechenmappe neu erzeugen und gegen Broschüre und Handrechnung abgleichen (braucht LibreOffice)
#   --mappe <Datei> rechnet gegen eine andere Fassung der Mappe als ../vofi/…
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

`pruefe_folien.py` liest Texte, Tabellen und Diagrammdaten der fertigen Datei. Es prüft Folienzahl, Reihenfolge,
Abschnitte, Blattnummern, Kopf und Schriftfeld, Dateieigenschaften, eindeutige Form-IDs, Schriften und Mindestgrößen, Alternativtexte
(Bilder, Diagramme, Flussdiagramme), verbotene Wörter, Gedankenstriche und die Quellenzeilen im Schriftfeld; dazu, dass weder die Mappe
noch das Konzept Sprechernotizen trägt. Die Summe am Ende nennt 32 Prüfungen (bis 12.11.2026 34: Die beiden Prüfungen der Notizen sind entfallen).

- **Aufbau:** Kennung, Blattnummer und Abschnitt jeder Folie stehen fest am Anfang des Skripts (`AUFBAU`), ebenso die Folien mit
  Stempel (`STEMPEL`). Wer eine Folie einfügt, streicht oder verschiebt, führt beide Listen und die Verweise mit. Der Kopf jeder Inhalts-
  und Anhangfolie nennt den Abschnitt (Form „Kicker“) mit seinem Zeichen (Form „Abschnitt im Kopf“), das Schriftfeld das Thema (Form
  „Rubrik“); beide kommen aus dem Kicker des Konzepts („ABSCHNITT · THEMA“) und sagen nie dasselbe. Die Agenda nennt dieselben Namen, der
  Trenner dieselbe Zählung. Das Register der Agenda trägt die Seiten der Broschüre (`REGISTER`).
- **Verweise:** „Folie n“ und „Anhang A n“ in Folientexten müssen die Blattnummer der gemeinten Folie nennen
  (`VERWEISE`: Folie, Text, Kennung der gemeinten Folie). So fällt nach einer neuen Zählung jeder Verweis auf, der nicht folgt.
- **Rendite:** „Rendite“ und „Marktmiete“ stehen nur auf der Anhangfolie A7 (`VERBOTEN_AUSNAHME`, an die Kennung `anhang-rendite`
  gebunden); „IRR“, „DSCR“ und „Safe Harbour“ stehen nirgends. Die Zahlen des Laufs `modellhaus_rendite` und Einträge mit `nur_folie` in
  `daten/pruefung.json` belegen nur Zahlen dieser Folie. Jede Zahl ihrer Tabelle ist an ihre Zelle der Rechenmappe gebunden (`KERNWERTE_FORM`),
  ebenso jede Zahl der Tabelle „Rechenweg“ der Folie 19.
- **Quellenzeilen:** Die Form „Quellenzeile“ steht genau auf den Folien der Liste `QUELLENZEILEN`, im Wortlaut von `daten/markt.json`
  (`quelle_kurz` des Blocks), in höchstens zwei Zeilen. Die Prüfung von Kopf und Schriftfeld liest als Thema nur die Form „Rubrik“.
- **Zahlen:** Jede Zahl braucht einen Beleg in `daten/werte.json`, in einer Datendatei oder in `daten/pruefung.json`; das gilt
  auch für die Alternativtexte der Diagramme und Flussdiagramme, die jeden Strom mit Betrag und Anteil nennen. Die
  Einheit zählt: Vor „%“ belegt nur ein Anteil oder eine Prozentangabe, vor „€“ und „Mio.“ nur ein Eurobetrag. Zahlen hinter
  einem Schrägstrich („5.330/5.550 €“) werden wie jede andere geprüft.
- **Daten und Jahreszahlen** gelten nur, wenn eine Datendatei oder `daten/pruefung.json` sie führt. „Broschüre S. n“ gilt für
  die Seiten 1 bis 24, ein Folienverweis nur für eine Blattnummer des Konzepts.
- **Kernwerte und Kernsätze** stehen an ihren Folien mit Einheit und Vorzeichen („−3.497 €“, „+52,9 %“, „Laufzeit höchstens 42 Jahre“,
  „Bearbeitungsentgelt 1 % des bewilligten Darlehens und 0,75 % des bewilligten Zuschusses“), einige auch in den Diagrammdaten.
  Die Listen `KERNWERTE` (Modellhaus), `KERNWERTE_MARKT` (Ausgangslage und Kostenvergleich), `KERNSAETZE` und `KERNWERTE_DIAGRAMM`
  stehen am Anfang des Skripts. Eine Quelle ist ein Schlüssel der Rechenmappe oder eine Formel wie in `daten/pruefung.json`; so sind
  auch gerechnete Größen gebunden (Kapitaldienst je m² 8,93 und 20,25 €, nötige Sollmiete frei finanziert 154.939 €). Die Liste
  `NICHT_AUF_FOLIE` nennt Wendungen, die nach der Textprüfung vom 12.11.2026 gestrichen sind und nicht auf ihre Folie zurückkehren dürfen
  (Entscheidung 34: „Der Vortrag behandelt 2.1.“, „Entscheidung“ neben „Förderentscheidung“, „Baukosten der PGN“).
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
- **Folie 22:** Werte, Maßzeichen der Spanne und Pfeilspitze mit „Maximum 8.592“ sitzen neben und über den Säulen
  (Abstandsbreite 156 %, Überlappung −12 %); die Flächen in der Grundfarbe unterbrechen die Gitterlinien an 4.631 und 3.713 mit Absicht.
  Die gestrichelte Marke „Ansatz im Modellhaus“ gibt es seit 11.11.2026 nicht mehr.
- **Folien 3 bis 6 und 22, Schriftfeld:** Die Quellenzeile steht rechtsbündig vor der Blatt-Zelle und bricht nicht von selbst um. Ist eine
  Schrift auf dem Vortragsrechner breiter, läuft sie nach links auf die Rubrik zu; auf den Folien 6 und 22 steht sie in zwei Zeilen.
- **Folie 5, Untertitel des Diagramms:** zwei Zeilen im Platzhalter, von Hand gebrochen. Legende und Diagramm stehen darunter in
  freier Lage und rücken nicht nach, wenn PowerPoint die Zeilen höher rechnet.
- **Folie A7:** Die Tabelle hat sieben gleich hohe Zeilen; die Bezeichnungen der Zeilen 3 und 7 stehen in zwei Zeilen. Rechnet PowerPoint
  eine Bezeichnung breiter, bricht sie in ihrer Zeile um, die Tabelle wächst dabei nicht.
- **Folien 4 bis 6 nacheinander zeigen:** Die Jahre der Folie 4 sind Textfelder, die Jahre der Folie 6 und die Kategorien der Folie 5
  Achsbeschriftung des Diagramms. In LibreOffice stehen beide auf einer Höhe; in PowerPoint kann der Abstand zur Achse anders ausfallen.
  Springt es beim Blättern sichtbar, die Jahre der Folie 6 als Textfelder setzen wie auf Folie 4.
- **Strichmuster:** PowerPoint misst Strich und Lücke in Linienstärken. Die gestrichelten Linien der Folien 4 und 5 und den gestrichelten Umriss der Folie 17 deshalb
  auch am Beamer ansehen.

Fällt die Fläche der Folie 4 in PowerPoint anders aus als im PDF, nimmt man in `folien/ausgangslage-zinsen.cjs` die Option `flaeche`
aus dem Aufruf von `D.linien` und baut neu; alles andere bleibt.

Das PDF aus LibreOffice trägt die Sprache Deutsch und kennzeichnet Linien und Flächen als Schmuck; die Alternativtexte der
Diagramme übernimmt LibreOffice nicht. Wer ein PDF mit diesen Alternativtexten braucht, exportiert die Endfassung aus PowerPoint.

## Texte und Zahlen ändern

- **Wortlaut, Titel, Quellenangaben:** `daten/outline.json`. Danach `python daten/inhalt_md.py` und `node build.cjs`. Viele
  Module prüfen ihren Text gegen das Konzept; weicht er ab, nennt der Bau die Stelle. Sprechernotizen gibt es nicht; ein Feld `notizen`
  im Konzept meldet das Prüfskript als Fehler.
- **Kopf und Schriftfeld:** der Kicker im Feld `inhalt` der Folie, „ABSCHNITT · THEMA“. Der Abschnitt steht im Kopf, das Thema im Schriftfeld.
- **Zahlen der Modellrechnung:** nur in der Rechenmappe unter `../vofi/`, Blatt Eingaben, Spalte „Projekt 2“ (das Modellhaus). Danach
  Schritt 1 und der Bau. `daten/werte.json` nie von Hand ändern. Die Läufe stehen in `daten/werte_aus_vofi.py` (`LAEUFE`): Jeder setzt
  Eingaben!D3 auf 2; `modellhaus_kosten_4631` und `modellhaus_kosten_5000` ändern dazu die Herstellungskosten (Eingaben!E11) für Folie 23,
  `projekt2` rechnet den Stand der Altfassung mit Tilgung 2,5 %. Achsen und Maßstäbe der Diagramme (Folien 14, 16 bis 21 und 23) stehen
  als Zahlen in den Folienmodulen und folgen neuen Werten nicht von selbst; die Module melden Werte außerhalb der Achse. Renditen, Restwert und Marktmiete stehen auf der Sperrliste von `daten/werte_aus_vofi.py`; die benannte Ausnahme
  `anhang_rendite` (erlaubt vom Auftraggeber am 11.11.2026) öffnet genau die Zellen der Folie A7 für den Lauf `modellhaus_rendite`.
  `daten/pruefe_werte.py` prüft, dass kein anderer Lauf einen solchen Wert führt. Titel, die eine Zahl nennen, stehen im Konzept und folgen nicht von selbst; der Bau und das Prüfskript
  melden die Abweichung. Die Titel der Folien 15 bis 18 setzt das Modul aus der Rechenmappe und prüft sie gegen das Konzept (`ctx.titelzeilen`).
- **Regelwerte, Marktzahlen, Fristen, Kontaktdaten:** in der Datendatei der Baugruppe, mit `herkunft` und `geprueft`.
- **Quellenzeile im Schriftfeld:** Wortlaut in `daten/markt.json` (`quelle_kurz` des Blocks) und im Feld `inhalt` der Folie im Konzept;
  das Modul setzt sie mit `B.quelle`. Eine weitere Folie mit Quellenzeile braucht einen Eintrag in `QUELLENZEILEN` (`pruefe_folien.py`).
  Der Bau bricht ab, wenn die Zeile mehr als zwei Zeilen braucht oder an die Rubrik stößt.
- **Neuer gerechneter Wert:** Eintrag in `daten/pruefung.json` (`gerechnet`, mit Formel), sonst meldet das Prüfskript
  die Zahl als unbelegt.
- **Aussehen:** Farben, Schriften und Raster in `lib/theme.cjs`, Folienrahmen in `lib/layouts.cjs`, Bausteine in
  `lib/bausteine.cjs` und `lib/diagramme.cjs`.
- **Beschriftungen an den Diagrammen** (Summen, Endwerte, Maßketten, Werte und Maßketten über den Säulen der Folien 3, 5, 6 und 22,
  die Maßzeichen der Spanne auf Folie 22, auf Folie 4 die Werte in Legende und Werteblöcken, die Jahre und der Punkt am Linienende,
  die Jahre unter dem Verlauf der Folie 21) sind Textfelder und Formen und folgen geänderten Diagrammdaten nicht; Zahlen deshalb in
  den Datendateien ändern und neu bauen. Die Flussdiagramme der Folien 17 und 18 sind ganz aus Formen gebaut: Bänder und Beschriftung entstehen nur beim Bau.
- **Folien einfügen, streichen oder verschieben:** Reihenfolge, Blattnummern (`nr`) und Abschnitte in `daten/outline.json`. Der
  Trenner zählt die Abschnitte von selbst; die Agenda führt ihre vier Abschnitte in `daten/rahmen.json`, der Bau prüft sie gegen
  das Konzept. Danach die Verweise in Folientexten und Datendateien nachführen (der Bau prüft die Quellentabelle, `pruefe_folien.py`
  die Listen `AUFBAU`, `STEMPEL` und `VERWEISE`).
- **Speichern:** Die Mappe nur mit PowerPoint speichern. LibreOffice dient allein dem Rendern und entfernt beim Speichern
  Abschnitte, Diagrammdaten und Alternativtexte.
- **Ort und Datum des Vortrags:** Eingabefeld auf der Titelfolie, in PowerPoint ausfüllen.

Nicht auf die Folien gehören Deckungsgrade. Renditen und eine Marktmiete des Modellhauses stehen nur auf der Anhangfolie A7, die Rendite
dort als Paar „mit Restwert“ und „ohne Restwert“ mit dem Restwertanteil (Entscheidung 24 des Konzepts). Auf alle anderen Folien gehören
sie nicht.
Quellen stehen auf der Anhangfolie A9 und je Folie im Konzept (Feld `quellen`, in `INHALT.md` „Quellenangabe“). Die Folien 3 bis 6 und 22
tragen dazu eine kurze Quellenzeile im Schriftfeld (Entscheidung 25); die volle Angabe bleibt auf A9.

## Ungeprüfte Angaben

Diese Angaben stammen aus der Präsentation vom 26.10.2026 (Altfassung) oder, zum Modellhaus, aus der Rechenmappe und der Entscheidung des
Auftraggebers vom 11.11.2026. Sie sind nicht nachgeprüft. In den Datendateien tragen sie
`"geprueft": false`, im Konzept den Vermerk in der Quellenangabe der Folien 3 bis 6, 22, 23 und A9 (in `INHALT.md` nachzulesen). In der
Mappe selbst steht der Vermerk nicht mehr: Er stand in den Sprechernotizen, die es seit 12.11.2026 nicht mehr gibt; die Quellenzeile im
Schriftfeld steht ohne Vermerk. Seit dem Umbau stehen die Angaben im Hauptteil, auf den Folien 3 bis 6 und 22 auch im Titel. Vor dem ersten
Vortrag bestätigt PGN sie oder nimmt sie heraus. Die Werte der ARGE (Folien 3, 5, 22, 23) gehören seit 12.11.2026 nicht mehr dazu: Sie sind
an der Quelle nachgelesen (Endbericht, S. 32 Abb. 20, S. 34 Abb. 22 und 23; Volltext in `../broschuere/recherche/quellen/`). Dasselbe gilt für die
Zinsreihe der Folie 4 und die Werte der Folie 5: Die Reihe ist am 12.11.2026 an der Quelle gelesen (Dr. Klein Wowi Finanz AG, Wochenwerte der
Grafik) und bis 11/2026 fortgeschrieben; der Bankzins der Rechenmappe ist der Wert vom 10.11.2026 (3,86 %).

- Folie 6: Bestand an Mietwohnungen mit Miet- und Belegungsbindung in Niedersachsen zum 31.12., 2016 bis 2025 (85.766 bis 50.920, Rückgang 40,6 %; Altfassung Folie 4; Quelle dort: BT-Drs. 21/7303, Antwort der Bundesregierung vom 21.07.2026). Geprüft sind auf dieser Folie die Zahlen der Broschüre S. 3 (58.024, rund 16.000, 28 %, Bestand 2024 50.495).
- Die Quellenangabe zur Bestandsreihe (BT-Drs. 21/7303) stammt aus der Quellenzeile der Altfassung und ist nicht nachgeprüft. Die PGN-Werte (eigene Auswertung von fünf Projekten: Herstellungskosten 3.579 € je m², Spanne und Werte je Kostengruppe der Folie 22) hat der Auftraggeber am 12.11.2026 bestätigt. Die Angabe zur ARGE (Wohnungsbau in Deutschland 2026, Endbericht, S. 32 Abb. 20 und S. 34 Abb. 22 und 23) ist am 12.11.2026 an der Quelle nachgelesen; die Werte der Folien 3 und 22 stehen seither ungerundet nach der Quelle in daten/markt.json.
- Folie A7: Marktmiete 15,42 € je m² und Liegenschaftszins 2,80 % (Jahr 35) des Modellhauses gelten für Neu Wulmstorf (Rechenmappe, Eingabe 4.4 und Blatt Tabellen, Tabelle 4, je Spalte Projekt 2; Übersicht 7.7). Die Marktmiete ist der Wert der Mietübersicht des Gutachterausschusses Lüneburg für den Landkreis Harburg (Hamburger Umland, Baualter ab 2023, 40 bis 60 m², Stand 01.01.2026); nachgelesen am 12.11.2026 im Zweitabdruck, nicht in der Erstveröffentlichung. Der Liegenschaftszins folgt dem Landesmodell Mehrfamilienhäuser des Oberen Gutachterausschusses, Stichtag 01.01.2026. An diesen Werten hängen der Restwert, die Rendite mit Restwert und alle Werte der Spalte „frei“. Das Grundstück ist nicht angesetzt: Eigenkapital und Restwert sind ohne Grundstück gerechnet, und die Renditen sind mit einem Vorhaben mit Grundstückskauf nicht vergleichbar (Rechenmappe, Blatt Hinweise Nr. 15). Die Veröffentlichung zum Liegenschaftszins ist für den Vortrag nicht eigens nachgeprüft. Für einen anderen Standort neu zu rechnen.
- Folien 13 und 14: Angaben zum Modellhaus (Neubau in Neu Wulmstorf, Landkreis Harburg, 14 Wohnungen, 828 m² Wohnfläche, Mietenstufe VI, Effizienzhaus 55, Grundstück im Bestand) nach der Entscheidung des Auftraggebers vom 11.11.2026 und der Rechenmappe (Projekt 2); nicht gegen Projektunterlagen geprüft.

Der Vorbehalt „bestätigt PGN den Wert 3.579 € nicht, entfallen Folie 22 und die Spalte 3.579 € der Folie 23“ ist überholt: Der Wert ist
seit 11.11.2026 der Ansatz des Modellhauses.

Offene Fragen an PGN (Tilgungssatz 2,38 %, Titel der Zusammenfassung, Herkunft der Herstellungskosten, Daten der Altfassung im Einstieg,
Dauer des Vortrags, Ort und Datum, Bildrechte; zum neuen Modellhaus: Rendite frei finanziert auf A7, Grundstück, Standort Neu Wulmstorf,
Wohnungsmix, Hinweis auf A9; zu Muster 2: Rot auf A8, Signaturwort im Anhang, Tabellenziffern) stehen am Ende von `INHALT.md`.

Das Textlektorat vom 11.11.2026 ist eingearbeitet; welche Befunde der Auftraggeber ausgenommen hat, nennt Entscheidung 27 des Konzepts.
Der Abgleich mit Broschüre und Rechenmappe vom 11.11.2026 ist ebenfalls eingearbeitet: Wo die Broschüre nach ihrem Lektorat anders lautet,
folgt der Vortrag (Entscheidung 28 des Konzepts). Die Kennung der Folie 11 bleibt `foerdermix`, auf der Folie steht „Fördersätze“.

Modellhaus seit 11.11.2026 (Entscheidung 29 des Konzepts): ein PGN-Projekt in Neu Wulmstorf statt des gesetzten Beispiels. Neu sind Titel,
Texte und Zahlen der Folien 13 bis 24 und A7; dazu die Stellen, die das Modellhaus nennen (Agenda, Hinweis auf A9). In allen drei Einkommensgruppen bleibt ab Jahr 1 ein Zahlungsüberschuss; die Titel nennen das Ergebnis aller drei
Gruppen und die Zahl der Gruppe A. `daten/pruefe_werte.py` gleicht dieselben Werte mit der Broschüre S. 10 bis 12 ab.

Anhangfolie A8 seit 11.11.2026 (Entscheidung 30 des Konzepts): Tilgungsschwelle gegenüber A je Herstellungskosten, als Antwort auf die
Rückfrage zu Folie 20, ob die Reihenfolge der Gruppen auch bei anderen Kosten gilt. Die Quellenfolie ist seitdem A9.

Muster 2, keine Sprechernotizen und Textprüfung seit 12.11.2026 (Entscheidungen 32 bis 34 des Konzepts): Aufbau oben unter „Muster 2“.
Fünf Titel stehen ohne Doppelpunkt (Folien 9 und 15 bis 18), Station 4 der Folie 26 heißt „Förderentscheidung“, das Thema der Folie 22
„Herstellungskosten der PGN“; auf Folie 7 ist der Satz „Der Vortrag behandelt 2.1.“ gestrichen. Die Broschüre S. 19 nennt Station 4
weiter „Entscheidung“.

Durchsicht nach dem Ausrollen vom 12.11.2026 (Entscheidung 35 des Konzepts): Drei weitere Titel stehen ohne Doppelpunkt am Zeilenende
(Folien 5, 14 und 22, mit denselben Zahlen; vom Auftraggeber am 12.11.2026 freigegeben). Das Label der Hauptzahl der Folie 5 heißt „je m² und Monat“, der Untertitel der Folie 22 steht in
einer Zeile, der Eintrag „Höchstmiete“ der Folie 24 nennt den Betrag nicht noch einmal. Die Blatt-Zelle des Anhangs heißt „Blatt“.

Bekannte Abweichungen von Muster 2, über die der Auftraggeber entscheidet:

- **Tabellenziffern:** Die Zahlenspalten der Tabellen stehen rechtsbündig, aber nicht in Tabellenziffern (zum Beispiel Folien 14, 15 und 19). Montserrat
  und Work Sans führen sie nur als OpenType-Funktion, die PowerPoint nicht schaltet. Abhilfe wäre eine eigens erzeugte Schriftdatei; die Mappe
  soll aber bei Montserrat und Work Sans bleiben.
- **Rot auf A8:** Marke der Jahresrechnung, Feld „Gruppe A vorn“ und Fläche stehen auf Wunsch des Auftraggebers vom 11.11.2026 in Rot
  (Entscheidung 30). Nach Muster 2 stünden Hilfslinie und Labels in Tinte wie auf Folie 20. Am 12.11.2026 bestätigt: Es bleibt bei Rot.
- **Titel im Anhang:** A1 bis A6 und A9 tragen kein Signaturwort in Rot, A7 und A8 tragen eines. Der Bau verlangt es nur auf Inhaltsfolien.
- **Doppelpunkt am Zeilenende:** Die Titel der Folien 7, 10 und 23 behalten ihn; ohne neuen Wortlaut lässt er sich dort nicht vermeiden.
- **Folie 10:** Der Text rechts steht in 14 pt (Tabelle und zwei Einträge), auf der Nachbarfolie 11 in 16 pt. In 16 pt passt er nur gekürzt.
