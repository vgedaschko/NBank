# Planwerk 16:9: Bibliothek der Vortragsmappe

Stand: Die 37 Folien sind zusammengeführt (`folien/`), die Musterfolien bauen mit derselben Bibliothek (`probe/`, 34 Folien,
alle 19 Layouts). Ein Folienmodul baut nur seine Inhaltszone; Rahmen und Prüfungen kommen aus `build.cjs` und `lib/`. Seit 12.11.2026 gilt
für alle Folien der Aufbau „Muster 2“ (Abschnitt 3, „Muster 2“); die Mappe trägt keine Sprechernotizen.
Was mehrere Folien brauchen, steht in `lib/` (Bausteine `B`, Diagramme `D`, Helfer im `ctx`); was nur eine Baugruppe braucht,
in `folien/_<gruppe>.cjs`. Zahlen der Rechenmappe stehen nur in `daten/werte.json`; diese Datei wird erzeugt und nie von Hand
geändert.

## 1 · Befehle

```bash
# im Ordner praesentation
node build.cjs --nur foerdermix,hoechstmiete --aus dist/teil-regeln.pptx   # einzelne Folien
node build.cjs --gruppe regeln                    # alle Folien der Baugruppe → dist/teil-regeln.pptx
node build.cjs                                    # ganze Mappe; bricht mit der Liste fehlender Module ab
node build.cjs --probe                            # Musterfolien → dist/probe/planwerk-probe.pptx (mit --nur p07-vergleich einzeln)
node build.cjs --gruppe regeln --trotzdem         # schreibt auch bei Fehlern der Prüfung (nur zum Ansehen, Rückgabewert 1)

node werkzeug/render.cjs dist/teil-regeln.pptx dist/render/regeln           # PDF, folie-NN.png (1600 px), uebersicht.png; braucht LibreOffice (SOFFICE=<Pfad>, sonst „soffice“) und pdftoppm
python pruefe_folien.py                                                      # fertige Mappe: Aufbau, Form-IDs, Schrift, Wortlaut, jede Zahl mit Beleg, Diagrammdaten
python pruefe_folien.py --zahlen                                             # dazu jede Zahl mit ihrem Beleg (zum Gegenlesen)
```

Zwei Läufe von `node build.cjs` liefern dieselbe Datei: Datum der Mappe ist ein eigenes Feld (`daten/rahmen.json`,
`titel.datum_datei`, TT.MM.JJJJ; der Stand auf den Folien, `titel.stand`, heißt „11/2026“), die IDs der Abschnitte folgen aus ihrem Namen. Eine Schemaprüfung mit einem Validator für Office-Open-XML ist
eine sinnvolle Zusatzprüfung; sie gehört nicht zum Projekt.

Baugruppen: `rahmen`, `einstieg`, `regeln`, `rechnung`, `fluss`, `struktur`, `umsetzung`, `ueberblick` (Zuordnung in
`daten/outline.json`, Feld `baugruppen`). Hilfsdateien der Baugruppen: `folien/_einstieg.cjs` (Texte der Folien 4 und 6),
`_fluss.cjs` (gemeinsame Anlage der Folien 17 und 18; dazu die Maßkette an der Quelle der Folie 18 und der Umriss an der Quelle der Folie 17, die auf jeder der beiden Folien den Betrag der anderen im selben Maßstab zeigen), `_struktur.cjs` (Agenda, Texte der Folie 22, Quellentabelle), `_rechnung.cjs`,
`_regeln.cjs`, `_umsetzung.cjs`, `_ueberblick.cjs`. Was nur eine Folie braucht, steht in `folien/_fein_<id>.cjs`:
`_fein_ausgangslage-zinsen.cjs` (Folie 4: Legende mit Werten, Werteblöcke an den Marken, Punkt am Linienende, Jahresstriche).
Die Folien 3 und 22 teilen sich `folien/_kostengruppen.cjs` (Diagramm der Kostenspannen mit Sockel, Spanne und Median, Legende, Prozentzeile).
Jedes Bild ansehen. Der Build rechnet Texte gegen ihre Felder und jede Form gegen Satzspiegel und Inhaltszone (Abschnitt 9),
sieht aber keine Überlagerung von Formen untereinander.

## 2 · Vertrag eines Folienmoduls

`folien/<id>.cjs` exportiert `{ id, bau(ctx) }`. `bau` ruft genau einmal `ctx.folie()` auf und baut danach die Inhaltszone.
`ctx.folie()` legt aus `daten/outline.json` an: Layout, Abschnitt, Kopf (Zeichen und Name des Abschnitts), Titel mit Signaturwort, Thema im
Schriftfeld und Blattnummer (`nr` des Konzepts: 1 bis 28, A0 bis A8; Titel und Schluss zählen mit, zeigen aber keine). Keine Sprechernotizen:
kein `addNotes` (die Nachbearbeitung entfernt auch die leeren Notizseiten von pptxgenjs), keine eigene Foliennummer, kein eigener Abschnitt.

```js
// folien/foerdermix.cjs – vollständiges, geprüftes Beispiel (seit 13.11.2026 frei gebaut in 6 + 6 auf PGN_INHALT, Stichpunkte in 14 pt)
'use strict';
module.exports = {
  id: 'foerdermix',
  bau(ctx) {
    const { B, D, W, X, fmt, colX, span, ZONE } = ctx, s = ctx.folie();
    B.register(s, '2.1');
    // Teilung 6 + 6 (seit 13.11.2026, G9): Die Stichpunkte in 14 pt passen auch mit engeren Abständen nicht in fünf Spalten. Diagramm und
    // Stichpunkte stehen deshalb frei (Layout PGN_INHALT); der Kopf liegt auf den Höhen der Diagrammfolien
    const WD = span(6);
    B.modulkopf(s, { x: colX(1), y: ZONE.diagramm.kopf, w: WD, titel: 'Fördersätze je Einkommensgruppe', sub: 'Höchstsätze in % der zuwendungsfähigen Kosten' });   // „Fördersätze“ wie die Broschüre S. 8
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Zuschuss', art: 'zuschuss' }, { text: 'Darlehen', art: 'darlehen' }, { text: 'Eigenmittel, mind.', art: 'eigenmittel' }] });

    const G = ['A', 'B', 'C'], T = k => W('modellhaus', 'tab.' + k);
    const q = (art, g) => Math.round(T(`quote_${art}.${g}`) * 100), em = Math.round(T('eigenmittel_mindestens') * 100);
    const d = D.stapelBalken(s, {               // Kategorien in Lesereihenfolge (A oben); die Bibliothek dreht sie für PowerPoint
      x: colX(1), y: ZONE.diagramm.chart.y, w: WD, h: ZONE.diagramm.chart.h, kategorien: G, name: 'Diagramm Fördersätze', rand: { u: 0.50 }, achse: { min: 0, max: 100, schritt: 20, format: 'roh' }, labelFormat: 'prozent',
      reihen: [{ name: 'Zuschuss', art: 'zuschuss', werte: G.map(g => q('zuschuss', g)) }, { name: 'Darlehen', art: 'darlehen', werte: G.map(g => q('darlehen', g)) }, { name: 'Eigenmittel, mind.', art: 'eigenmittel', werte: G.map(() => em) }] });

    G.forEach((g, i) => B.achskreis(s, { cx: d.plot.x - 0.36, cy: d.katMitte(i), d: 0.42, pt: 14, text: g }));
    const my = d.plot.y - 0.12;
    B.masskette(s, { x: d.plot.x, y: my, w: d.plot.w, segmente: [{ anteil: q('zuschuss', 'A'), text: fmt.prozentWert(q('zuschuss', 'A')) }, { anteil: q('darlehen', 'A'), text: fmt.prozentWert(q('darlehen', 'A')) }, { anteil: em, text: fmt.prozentWert(em) }] });
    B.achse80(s, { x: d.xWert(100 - em), yOben: my, yUnten: d.plot.y + d.plot.h, text: String(100 - em) });
    B.massstab(s, { x: d.plot.x, y: d.plot.y + d.plot.h + 0.02, w: d.plot.w });
    B.achsentitel(s, d, { x: ctx.wortlaut('% der zuwendungsfähigen Kosten', 'Achsentitel') });

    const [tag1, tag2] = X('regeln', 'bemessungsgrenze.fortschreibung'), wl = (t, was) => ctx.wortlaut(t, was);
    // Seit der Änderungsrunde vom 13.11.2026 (F11.1, G9) Stichpunkte unter drei Überschriften, einheitlich 14 pt (bis dahin Planlegende in 16 pt)
    B.stichpunkte(s, { x: colX(7), y: ZONE.diagramm.kopf, w: span(6), h: ctx.Y.inhaltEnde - ZONE.diagramm.kopf, linie: true, titelAbstand: 6, punktAbstand: 1, gruppen: [
      { titel: wl('Zuschuss', 'Überschrift'), punkte: [wl('nicht rückzahlbar', 'Stichpunkt'), wl('nur zusammen mit dem Darlehen', 'Stichpunkt')] },
      { titel: wl('Eigenmittel', 'Überschrift'), punkte: [wl(`mindestens ${fmt.prozentWert(em)} der zuwendungsfähigen Kosten`, 'Stichpunkt'),
        wl('davon soll mindestens die Hälfte Geld oder lastenfreies Grundstück sein', 'Stichpunkt')] },
      { titel: wl('Bemessungsgrenze', 'Überschrift'), punkte: [wl('Obergrenze der zuwendungsfähigen Herstellungskosten je m² Wohnfläche', 'Stichpunkt'),
        // weicher Umbruch vor dem zweiten Wert: Sonst bräche „IV–VII“ am Halbgeviertstrich
        wl(`seit ${X('regeln', 'bemessungsgrenze.gilt_seit')}: ${fmt.zahl(T('bemessungsgrenze.I'))} € in Mietenstufe I–III, ${fmt.zahl(T('bemessungsgrenze.IV'))} € in IV–VII`, 'Stichpunkt').replace('I–III, ', 'I–III, \n'),
        wl(`Fortschreibung zum ${tag1} und ${tag2}, aktueller Wert auf nbank.de`, 'Stichpunkt')] }] });
  },
};
```

### ctx

| Feld | Inhalt |
|---|---|
| `ctx.folie(opt)` | legt die Folie an und gibt sie zurück (`slide` von pptxgenjs). Optionen unten |
| `ctx.o` | Eintrag der Folie aus `outline.json` (`id`, `nr`, `abschnitt`, `layout`, `titel`, `inhalt`, `darstellung`, `daten`, `quellen`); ein Feld `notizen` gibt es nicht mehr |
| `ctx.outline` | das ganze Konzept (für die Folie „Quellen“: Nummern aller Folien) |
| `ctx.B`, `ctx.D` | Bausteine und Diagramme, auf den Grund der Folie eingestellt (Abschnitt 5 und 6) |
| `ctx.W(lauf, schluessel)` | Rohwert aus `werte.json`; bricht mit ähnlichen Schlüsseln in der Meldung ab, wenn er fehlt. Den Lauf `modellhaus_rendite` gibt der Bau nur der Folie `anhang-rendite` frei (`LAUF_NUR_FUER` in `build.cjs`); jede andere Folie bricht den Bau ab. `W.reihe(lauf, schluessel, von = 1, bis = 35)` für Zeitreihen `zr.*`, `W.eintrag(…)` mit Einheit, Blatt, Zelle, Bedeutung |
| `ctx.fmt` | Formatierer (Abschnitt 4) |
| `ctx.X(datei, pfad)` | Wert aus `daten/<datei>.json` über einen Punktpfad; `ctx.daten.regeln` usw. liefert die ganze Datei (fehlende Datei = `{}`) |
| `ctx.C`, `ctx.HEX`, `ctx.F` | Schemafarben, feste Hex-Werte, Schriftfamilien (Abschnitt 3) |
| `ctx.colX(k)`, `ctx.span(n)`, `ctx.Y`, `ctx.ZONE`, `ctx.Raster` | Raster und feste Lagen (Abschnitt 3) |
| `ctx.asset(name)` | Pfad einer Datei in `assets/` (Abschnitt 7) |
| `ctx.P` | Passprüfung: `P.zeile(was, text, stil, breite)`, `P.block(was, text, stil, breite, hoehe)`, `P.melde(text)`, `P.hinweis(text)` |
| `ctx.zoneAusnahme(name, grund)` | nimmt eine Form mit diesem `objectName` von der Zonenprüfung aus (Abschnitt 9); der Build nennt Name und Grund als Hinweis. Nur für Formen, die mit Absicht außerhalb liegen |
| `ctx.grund`, `ctx.farben` | `hell`, `papier`, `rot` oder `anthrazit` und der Farbsatz dazu |
| `ctx.versal(s)`, `ctx.schutz(s)` | Großbuchstaben mit kleinen Einheiten; geschützte Leerzeichen zwischen Zahl und Einheit |
| `ctx.wortlaut(text, was)` | Gegenprobe gegen das Konzept: Der Text steht so im Feld `inhalt` der Folie (Groß- und Kleinschreibung, Fettmarken und geschützte Leerzeichen zählen nicht). Abweichung bricht den Bau ab. Gibt den Text zurück, lässt sich also um jeden Text legen: `B.text(s, ctx.wortlaut(t, 'Deck'), …)` |
| `ctx.titelzeilen(zeilen, akzent)` | Titel mit Werten aus der Rechenmappe: Das Modul baut die Zeilen aus `W` und `fmt`; die Funktion prüft sie gegen das Konzept (Feld `titel` und „Titelzeilen“ mit Signaturwort im Feld `inhalt`) und gibt die Optionen für `ctx.folie()` zurück: `const s = ctx.folie(ctx.titelzeilen([`${kd} Kapitaldienst in Jahr 1`, …], kd))`. Abweichung bricht den Bau ab. So steht keine Zahl eines Titels fest im Modul (Folien 15 bis 18) |
| `ctx.gleich(was, a, b, nk = 2)` | Gegenprobe zweier Zahlen auf `nk` Stellen (Datendatei gegen Mappe, Mittelwert gegen Reihe); Abweichung bricht den Bau ab |
| `ctx.lies(datei, felder)` | Zugriff auf eine Datendatei mit gefüllten Platzhaltern: `const U = ctx.lies('umsetzung', felder); U('antragsweg.beginn')`; `U(pfad, { weitere: Felder })` |
| `ctx.fuelle(v, felder, woher)` | Platzhalter in Texten füllen: `{name}` setzt den Wert (ganze Zahlen in deutscher Schreibweise), `{name:wort}` das Zahlwort; Listen und Objekte werden durchlaufen |
| `ctx.zahlwort(n, gross)`, `ctx.glatt(s)` | 3 → „drei“ (0 bis 12; `gross`: „Drei“) · Vergleichsform eines Textes ohne geschützte Leerzeichen und Fettmarken |
| `ctx.mittel(monate, werte, welche)` | Mittelwert einer Monatsreihe (Schlüssel `JJJJ-MM`) über die genannten Monate, etwa als Gegenprobe eines Quartalsmittels (Folie 4); bricht ab, wenn ein Monat fehlt |

### ctx.folie(opt)

Ohne Optionen liest die Funktion den Rahmen aus dem Feld `inhalt` des Konzepts:
`Kicker: „ABSCHNITT · THEMA“` (der Abschnitt steht im Kopf, das Thema im Schriftfeld) · `Titelzeilen: „Zeile 1“ | „Zeile 2“ (Signaturwort: „…“)` · `Titel in drei Zeilen: „…“ | „…“ | „…“` ·
`Rubrik im Schriftfeld: „…“` · `Achskreis XL: „4“` · `Lead: „…“` · `Untertitel: „…“`. Der Zusatz `(zweite Stimme …)` hinter
einer Titelzeile setzt sie in Montserrat Light 20 pt. Anhangfolien (`PGN_ANHANG`) nehmen `o.titel` als einzeilige Überschrift.
Das Konzept passt für alle 37 Folien; Optionen sind nur für Abweichungen da.

| Option | Wirkung |
|---|---|
| `titel: ['Zeile 1', 'Zeile 2']`, `akzent: 'Signaturwort'`, `stimme: 0` | Titelzeilen von Hand, Signaturwort (muss in einer Zeile vorkommen), Index der Zeile in zweiter Stimme |
| `kicker`, `rubrik` | Kicker („ABSCHNITT · THEMA“) und Rubrik im Schriftfeld (ohne Angabe: das Thema aus dem Kicker; hat er keins, der Kicker) |
| `nr`, `lead` | nur Abschnittsfolien: Zeichen im Achskreis XL, Vorspann |
| `untertitel`, `anlass` | nur Titel und Schluss; ohne `anlass` bleibt „Ort, Datum“ als Eingabefeld leer stehen |
| `kopfzeichen: false` | lässt das Zeichen des Abschnitts im Kopf weg; nur Folie 7 (Kopf „Agenda“ ohne Kapitelnummer, Änderungsrunde vom 13.11.2026, F7.1; `pruefe_folien.py`: `KOPF_AUSNAHME`) |
| `titelAbstand: 39` | Zeilenabstand in pt für eine Titelzeile, über deren Umlaut ein Komma, Semikolon oder eine Klammer steht (siehe unten). Auf Inhaltsfolien nicht mehr nötig: Der Titel steht dort schon mit 37 pt |

Geprüft wird beim Bau: Zeilenzahl des Titels (Inhaltsfolien genau zwei), Breite jeder Zeile (32 pt: höchstens 11,6 Zoll),
Signaturwort vorhanden, Abschnittsname im Kopf höchstens 6,27 Zoll (Feld 6,9 Zoll, 10 % Reserve), Rubrik höchstens 8,0 Zoll.

Kopf: Vor dem Abschnittsnamen steht das Zeichen des Abschnitts im Achskreis S (Form „Abschnitt im Kopf“: 1 bis 4 in der Zählung von Agenda und
Trennern, im Anhang „A“; `build.cjs` rechnet es aus der Folienfolge des Konzepts).

Lesereihenfolge der Formen (Auswahlbereich, Vorleseprogramme): Titel, Zeichen und Name des Abschnitts, dann der Inhalt in der Reihenfolge, in der das
Modul ihn anlegt, zuletzt Rubrik und Blattnummer des Schriftfelds. Ein Modul legt seine Formen deshalb in Leserichtung an.

Titel tragen wie jeder Text geschützte Leerzeichen zwischen Zahl und Einheit („84.000 €“, „80 %“, „7,0 Mio. €“); im Konzept
stehen gewöhnliche Leerzeichen. Titel der Inhaltsfolien stehen seit Muster 2 in 32 pt mit 37 pt Zeilenabstand (vorher 33 pt): Ein Komma, ein
Semikolon oder eine Klammer über einem Ä, Ö oder Ü der nächsten Zeile berührt die Umlautpunkte dann nicht mehr (Folie 14: „3,0“ über
„Förderung“). Auf Layouts mit engerem Zeilenabstand (Trenner 40 pt mit 41 pt) erkennt der Build die Stelle weiter, gibt der unteren Zeile
Schriftgrad + 5 pt und nennt es als Hinweis.

## 3 · Raster, Layouts, Farben, Schrift

Folie 13,333 × 7,5 Zoll. Satzspiegel x 0,667 bis 12,667 (12,00 breit). Zwölf Spalten: `colX(k) = 0,667 + (k − 1) · 1,02`,
`span(n) = n · 1,02 − 0,24`. Breiten: 3 Spalten 2,82 · 4 = 3,84 · 5 = 4,86 · 6 = 5,88 · 7 = 6,90 · 8 = 7,92 · 12 = 12,00.
Teilungen: 8 + 4 (`colX(1)`, `colX(9)`), 7 + 5 (`colX(8)`), 6 + 6 (`colX(7)`), 4 + 4 + 4 (`colX(1)`, `colX(5)`, `colX(9)`).

| `ctx.Y` | Wert | Bedeutung |
|---|---|---|
| `kicker` | 0,44 | Kopfzeile (Höhe 0,30): Achskreis mit dem Zeichen des Abschnitts, daneben der Abschnittsname in Tinte; rechts darin der Schlüsselplan (nur A5), auf Folie 14 der Zusatz der Modellrechnung |
| `titel` | 0,86 | Titel, zwei Zeilen 32 pt mit 37 pt Zeilenabstand (Höhe 1,06); Anhang: eine Zeile 22 pt |
| `deck` / `deckH` / `inhaltNachDeck` | 1,90 / 0,26 / 2,40 | Lage einer Unterzeile (`B.text` mit `rolle: 'deck'`) und Beginn des Inhalts darunter |
| `inhalt` … `inhaltEnde` | 2,10 … 6,50 | Inhaltszone der Inhaltsfolien (Höhe 4,40) |
| `anhangInhalt` | 1,50 | Beginn der Inhaltszone im Anhang (bis 6,50) |
| `fuss` | 6,72 | Schriftfeld (Höhe 0,48) über die ganze Breite des Planrahmens (x 0,30 bis 13,03); Abstand zum Inhalt 0,22. Links das Logo-Feld (bis x 2,20), ab x 2,40 Projektzeile und Rubrik (das Thema der Folie), ab x 12,033 die Blatt-Zelle (`ZONE.schriftfeld`); im freien Feld dazwischen steht die Quellenzeile (`B.quelle`) |

Der Build prüft nach `bau(ctx)` jede Form der Folie: Auf Inhalts- und Anhangfolien liegt sie im Satzspiegel, endet bei
y 6,50 und beginnt nicht im Folienkopf (ab y 1,90, Anhang 1,50). Ausnahmen: Daumenregister (rechter Rand), Zeichen des Abschnitts,
Schlüsselplan und Stempel (Kopfzeile), Quellenzeile (Schriftfeld); Maßketten und Beschnittmarken dürfen 0,08 überstehen. Einzelheiten in Abschnitt 9.

### Muster 2 (gilt für alle Folien, Entscheidung 33 des Konzepts)

Vom Auftraggeber an den Folien 15 und 20 freigegeben. Die Bibliothek trägt die Regeln; ein Modul muss sie nicht nachbauen, darf sie aber nicht umgehen.

| Regel | Wo sie steht |
|---|---|
| Planrahmen mit Falzmarken und Schriftfeld über die ganze Breite auf jeder Inhalts- und Anhangfolie; Trenner, Titel und Schluss bleiben in ihrer Form | `RAHMEN.schriftfeld`, `RAHMEN.planrahmen` (`lib/bausteine.cjs`), `lib/layouts.cjs` |
| Kopf: Zeichen und Name des Abschnitts in Tinte, kein roter Strich; das Thema steht im Schriftfeld; Kopf und Schriftfeld sagen nicht dasselbe | `RAHMEN.kopf`, `folie()` in `build.cjs`; Kicker im Konzept „ABSCHNITT · THEMA“ |
| Titel in Versalien, 32 pt mit 37 pt Zeilenabstand, genau ein Signaturwort oder eine Zahl in Rot; Umbruch nach Sinn, kein einzelnes Wort in der zweiten Zeile | Titel-Platzhalter in `RAHMEN.kopf`; Zeilen im Konzept („Titelzeilen“) |
| Versalien nur in Titel, Kopf, Schriftfeld und kleinen Labels (`tabellenkopf`, `vorsatz`, `label`, Kopf des Warnbands). Modul-, Diagramm- und Tabellentitel und Titel der Stationen gemischt in Montserrat Bold 16 pt; Unterzeile (`deck`) gemischt | `SKALA` in `lib/theme.cjs` |
| Fließtext einer Folie in einer Größe; Größen nur aus `SKALA`, keine neuen Zwischengrößen | `B.planlegende` mit `pt` 16 (Textspalte der Diagrammfolien) oder 14 |
| Rot: Titellinie, Signaturwort, Reiter 2.1 und Programmfarbe, Zuschuss in Daten, Ergebniszeile, höchstens eine hervorgehobene Kennzahl je Diagramm, Logo; Dunkelrot als Signal. Einheit und Vorsatz der Kennzahlen, Maßketten, 80-%-Achse, Konturstempel, Köpfe hervorgehobener Spalten und Aufzählungszeichen in Tinte oder Grau | Abschnitt „Farben“; `B.kennzahl`, `B.achse80`, `B.konturstempel`, `B.rechenblatt`, Nachbearbeitung (Marker) |
| Derselbe Wert steht auf einer Folie nur einmal groß | im Modul: Werte an Diagrammen in `rolle: 'wert'` (12 pt), groß nur die Kennzahl-Kachel |
| Diagramm über sieben Spalten, Text oder Kennzahlen über fünf; Titel, Untertitel, Legende und Diagramm auf allen Folien auf denselben Höhen; Achsentitel bleiben | `ZONE.diagramm` (auch `spalte` für `B.hauptzahl`, `B.nebenzahl`, `B.zweitesModul`) |
| Nichts ragt über die Inhaltszone, nichts überlappt; `node build.cjs` läuft ohne `--trotzdem` | Pass- und Zonenprüfung (Abschnitt 9); Überlagerungen sieht nur das Bild |

### Layouts und ihre Platzhalter

Platzhalter füllt man über die Bausteine (rechte Spalte); sie setzen Versalien, schützen die Leerzeichen vor Einheiten und
prüfen die Länge. Der Platzhalter setzt Schrift und Lage; abweichen kann nur ein einzelner Textlauf. Nicht gefüllte
Platzhalter entfernt die Nachbearbeitung. `kicker`, `title`, `rubrik`, `blatt` füllt `ctx.folie()`. Ein Platzhalter, den
das Layout nicht hat, bricht den Bau ab.

| Layout | Grund | Platzhalter, feste Zonen (`ctx.ZONE`) und die Bausteine dazu |
|---|---|---|
| `PGN_INHALT`, `PGN_INHALT_MR`, `PGN_ABLAUF` | weiß / Papier / weiß | nur Kopf und Fuß; freie Komposition. Ablauf: `ZONE.ablauf` (Achse 2,55, Text 3,00–5,55, Warnband 5,95) als Richtwerte |
| `PGN_DIAGRAMM`, `PGN_DIAGRAMM_MR` | weiß / Papier | Sieben Spalten Diagramm, fünf Spalten Text. `diagrammtitel` (y 2,18, 16 pt gemischt), `diagrammsub` (2,52, oben verankert; zwei Zeilen möglich): `B.diagrammkopf` · Legende als Formen bei `ZONE.diagramm.legende` (2,80) · `chart` (0,667 / 3,06, 6,90 × 3,44): `D.*` ohne Lage · `kommentar` (7,807 / 2,17, 4,86 × 4,33, 16 pt): `B.planlegende`; der Modultitel der ersten Zeile steht auf der Höhe des Diagrammtitels. Modulkopf-Linien bei y 2,10 liegen im Layout · statt des Kommentars Kennzahlen in derselben Spalte (`ZONE.diagramm.spalte`: x 7,807, Breite 4,86, Hauptzahl ab y 2,10, zweites Modul ab y 4,40): `B.hauptzahl`, `B.nebenzahl`, `B.zweitesModul` (Folien 3 bis 6 und 22) |
| `PGN_TABELLE`, `PGN_TABELLE_MR` | weiß / Papier | Acht Spalten Tabelle, vier Spalten Text (Folie 15, so freigegeben). `tabellentitel` (y 2,18), `tabellensub` (2,50; 7,92 breit): `B.tabellenkopf` · Tabelle ab `ZONE.tabelle.tabelle` (y 2,84) bis höchstens 6,20 · `kommentar` (Spalte 9–12): `B.planlegende` mit `pt` 16 · `notiz` (Zeile unter der Tabelle, y 6,05–6,50, unten ausgerichtet, 12 pt): `B.notiz` |
| `PGN_KENNZAHLEN`, `PGN_KENNZAHLEN_MR` | weiß / Papier | je Kachel i = 0, 1, 2: `kfi_kopf` (y 2,20, Versalien in Tinte), `kfi_zahl` (2,44, **44 pt**, Einheit in der Farbe der Zahl), `kfi_label` (3,20, 16 pt einzeilig), `kfi_text` (3,50–4,45, 14 pt): `B.kennzahlFeld`. Darunter ab `ZONE.kennzahlen.darunter` (y 4,70) Platz für eine Planlegende über zwölf Spalten (Muster 10) |
| `PGN_VERGLEICH`, `PGN_VERGLEICH_MR` | weiß / Papier | `links_kopf`, `links_wert` (y 2,52, 36 pt), `links_text` (3,35–6,00), `rechts_…`: `B.vergleichFeld` · `fuss` (y 6,24, zwölf Spalten, 12 pt): `B.vergleichFuss`. Fläche rechts 6,787 / 2,10, 5,88 × 4,02 (endet bei 6,12 über der Fußzeile) |
| `PGN_AUSSAGE` | weiß | `lead` (18 pt, 7,92 × 0,80): `B.vorspann` · `body` (16 pt, 6,90 × 3,45): `B.aufzaehlung` · `seite` (Spalte 9–12, 14 pt): `B.planlegende` |
| `PGN_ZITAT` | weiß | `zitat`, `name`, `quelle`: `B.zitat` |
| `PGN_ANHANG` | weiß | Titel einzeilig, Inhaltszone y 1,50–6,50, Schriftfeld wie die Inhaltsfolien (Blatt-Zelle „Blatt“ mit A1 bis A8; den Anhang nennt der Kopf); freie Komposition (Kopf über `B.modulkopf`) |
| `PGN_AUSSAGE_DUNKEL` | Anthrazit | nur Kopf und Fuß; höchstens zweimal; keine Diagramme außer Einheitenquadraten |
| `PGN_TITEL` | Rot mit Axonometrie | `title` (zwei Zeilen 44 pt), `untertitel`, `anlass`: `ctx.folie()` · Kennzahlfeld: `B.titelKennzahl` · Schriftfeld: Herausgeber; in der zweiten Zelle der Stand der Inhalte, darunter das Eingabefeld `anlass` („Ort, Datum“; leer bleibt es unsichtbar) |
| `PGN_ABSCHNITT`, `PGN_ABSCHNITT_ROT` | weiß / Rot | `nr`, `title` (40 pt, 10,0 Zoll breit, in der Höhe des Achskreises senkrecht mittig: ein bis drei Zeilen stehen auf der Kreismitte; das Signaturwort darf über mehrere Zeilen laufen: auf den Kapiteltrennern die Themen nach dem Doppelpunkt), `lead` (18 pt, 8,0 × 1,40: vier Zeilen mit Luft): `ctx.folie()` · Achsleiste: `B.abschnittsleiste` |
| `PGN_SCHLUSS` | Rot mit Grundriss | `title`, `untertitel`: `ctx.folie()`; Anschrift, Kontakt und QR-Code liegen im Layout |

Die festen Texte der Titel- und der Schlussfolie (Kopfleiste, Herausgeber, Sitz, Stand, Anschrift, Telefon, E-Mail, Web) liest
`lib/layouts.cjs` aus `daten/rahmen.json` (`titel.*`, `kontakt.*`, je Eintrag mit Herkunft). Dort ändern, nicht im Layout.

**In der fertigen Mappe** heißen die Layouts lesbar („Inhalt“, „Inhalt · Modellrechnung“, „Diagramm“, „Anhang“ …; Liste in
`lib/layoutnamen.json`, das leere Layout der Bibliothek heißt „Leer“). Jeder Platzhalter trägt in allen Layouts dieselbe Nummer
(`IDX` in `lib/layouts.cjs`: Kicker 10, Rubrik 11, Blattnummer 12 …) und im Layout selbst Innenabstand 0 und seinen Anker: Eine
neue Folie aus dem Layout, „Zurücksetzen“ und ein Layoutwechsel in PowerPoint lassen die Texte im Raster. Im Bau und im Konzept
bleiben die Namen `PGN_…`; ein neues Layout braucht einen Eintrag in `lib/layoutnamen.json`, ein neuer Platzhalter eine Nummer in `IDX`.

Layouts mit `_MR` stehen auf Papierton; das Wort „Modellrechnung“ steht im Kopf als Abschnittsname (Stempel im Kopf nur mit `STEMPEL_IM_KOPF` in `lib/theme.cjs`); auf Papier sind Kästen und hervorgehobene
Tabellenspalten weiß. Die Bausteine wählen ihre Farben nach dem Grund von selbst. Text steht in einem Platzhalter genauso
wie im freien Textfeld (kein zusätzlicher Abstand vor Absätzen).

### Farben

`ctx.C` (Schemafarben, folgen dem Theme): `tinte` 202020, `anthrazit` 3C3C3B (Fließtext), `weiss`, `papier` F4F3F2, `rot`
B71E3F, `darlehen` 202020, `referenz` 77716B, `dunkelrot` 8B2939, `grau` 626160. `ctx.HEX`: dieselben Töne als Hex, dazu
`linie` CFCCC8, `grau300` B4B0AB, `hauch` F7E3E7, `hauch50` FBF1F3, `flaeche3` E9E7E4, `gruppe.A/B/C`, `bs['2.1'…'2.6']`.

- **Rot ist zugeteilt (Muster 2): Titellinie, Signaturwort, Reiter 2.1 und Programmfarbe 2.1, Zuschuss in Daten, Ergebniszeile, Logo,** dazu je
  Diagramm höchstens eine hervorgehobene Kennzahl (unten „Rot im Diagramm“). In Tinte oder Grau stehen Kopf, Einheit und Vorsatz der
  Kennzahlen, Labels, Maßketten, die 80-%-Achse, der Konturstempel, Köpfe hervorgehobener Tabellenspalten und Aufzählungszeichen. Dunkelrot
  nur als Signal (Bewilligung, Frist, Warnband) und immer mit Wort; der Achtung-Kasten (Musterfolie 31) trägt Oberlinie und Label in Rot.
- **Feste Diagrammfarben** über die Reihenart: `zuschuss` Rot · `darlehen` Tinte · `eigenmittel` Schraffur (immer beschriftet)
  · `tinte` (Miete, Ertrag, eigene Reihe, Aussage) · `referenz` 77716B (frei finanziert, Markt, Vergleich) · `bisher` B4B0AB (nur mit
  Beschriftung) · `bezug` F4F3F2 und `licht` E9E7E4 (helle Flächen, nur in feinen Säulen) · `akzent` (PGN-Rot für die eine Reihe,
  von der Titel und Hauptzahl sprechen; nur Folie 4) · `A`, `B`, `C` (Gruppentöne) · `signal`. Nie `darlehen` und `tinte` als zwei
  Reihen im selben Diagramm.
- **Feine Säulen** (`fein: true`; Folien 3, 5, 6 und 22, nur auf weißem Grund): Der Bezugswert (früherer Stand, Vergleich) steht als
  helle Fläche `bezug` mit Kontur 0,5 pt in Tinte, die Aussage (heutiger Stand, PGN) in `tinte` mit derselben Kontur. Die Säulen sind
  schlank, die Lücke ist immer breiter als die Säule (`saeule`: Breite in Zoll); in Paaren trennt eine Fuge von 12 % der Säulenbreite.
  Kontur und Fuge stehen einmal in `lib/theme.cjs` (`FEIN`). Werte an den Säulen: Montserrat Bold 12 pt im Ton ihrer Säule
  (`D.ART[art].wert`: Bezugswert in Grau 626160, Aussage in Tinte); Zahlen, die der Titel nennt, stehen nie in Grau. Gestapelt
  (Folie 5): Bezugswert unten, darüber Grautöne von unten nach oben heller (`referenz`, `bisher`, `licht`). Auf Papierton
  (Folien 16 und 19) bleibt der Vergleichswert in `referenz`: Dort wäre die helle Fläche nicht vom Grund zu unterscheiden.
- **Rot im Diagramm:** Auf den Folien 3 bis 6 trägt je Diagramm genau eine Größe Rot, nämlich die, die das Signaturwort des Titels
  nennt: Folie 3 der Maßkettenwert der Herstellung, Folie 4 die Reihe „10 Jahre“ (Linie, weiche Fläche, Punkt, Linienstücke),
  Folie 5 die Summe von heute, Folie 6 der Maßkettenwert des Rückgangs. Maßlinien bleiben Anthrazit; rote Flächen gibt es außer der
  weichen Fläche der Folie 4 nicht; rote Schrift im Diagramm nur in Montserrat Bold ab 12 pt. Auf den Folien 16 bis 23 kein Rot im
  Diagramm: Dort bedeutet Rot den Zuschuss. Anhang A7 (Wunsch des Auftraggebers): Fläche „Gruppe A vorn“ in Hauch F7E3E7, Marke der
  Jahresrechnung mit Beschriftung, Punkt am Schnitt und das Feld „Gruppe A vorn“ in Rot; die Folie zeigt keinen Zuschuss.
- **Linienstärken in Diagrammen:** Kontur der feinen Säulen 0,5 pt Tinte · Gitter 0,5 pt CFCCC8 · Grundlinie 0,75 pt Tinte ·
  Maßlinie 0,75 pt Anthrazit mit Maßstrichen 1,25 pt · Maßhilfslinien, Bezugslinie und Zuleitungen 0,5 pt (Zuleitungen in Referenzgrau 77716B) · Linien im Liniendiagramm
  2,25 pt, fein 1,5 pt ohne Strichart (Folie 4) · Zeitmarken der Folie 4 0,5 pt gestrichelt in Referenzgrau · Marken über Säulen
  1 pt gestrichelt in Referenzgrau (Folie 10).
- **Flussdiagramm** (`D.fluss`): Farbrollen `tinte`, `referenz`, `hell` (Referenzgrau mit 50 % Transparenz) und `blass` (70 %, mit feiner
  Kontur), festgelegt in `lib/theme.cjs` (`FLUSSART`, auch als `D.FLUSSART`). Auf den Folien 17 und 18: Tilgung `tinte`, Zins `referenz`,
  Verwaltungskostenbeitrag `hell`, Bewirtschaftung `blass`.
- Programmfarben (`HEX.bs`) nur mit Nummer: `B.register`, `B.schluesselplan`, `B.programmChip`. Kein Grün.
- Wer pptxgenjs direkt aufruft: Schemafarben `C.*` gehen in Text, Formfüllung, Linien und Tabellen. Nur Hex (`HEX.*`) nehmen
  Gitterlinien, `dataBorder` und die Farben einer einzelnen Balkenreihe. Nie „#“, nie acht Stellen.

### Schrift

`ctx.F`: `black` Montserrat Black · `xbold` Montserrat ExtraBold · `mont` Montserrat (fett mit `bold: true`) · `montLight`
Montserrat Light (zweite Stimme, Deck) · `text` Work Sans · `medium` Work Sans Medium · `semi` Work Sans SemiBold · `light` Work Sans
Light (nur im Hinweiskasten, `B.hinweis`).
`bold: true` nur zu `F.mont` und `F.text`. Kursiv nur zu `F.xbold` und `F.mont`. Keine anderen Schriften; der Build bricht
bei jeder anderen Schrift und bei jeder Größe unter 10 pt ab, auch in direkten Aufrufen von pptxgenjs.

Textrollen für `B.text(…, { rolle })` und ihre Mindestgröße bei `pt` (E3): `vorspann` 18 · `fliess` 16 · `dicht` 14
(alle mindestens 14) · `kleinText` 12 (Anthrazit) · `klein` 12 (Grau) · `hinweis` 12 Work Sans Light (Hinweiskasten, G8) · `sub` 12 · `deck` 14 Montserrat Light, gemischt · `modultitel`
und `diagrammtitel` 16 Montserrat Bold, gemischt · `bezeichnung` 12 Work Sans SemiBold in Tinte (Bezeichnungen an Diagrammen) · `wert` 12 Montserrat Bold · `wertGross` 16 (derzeit auf keiner Folie) · `kernwert` 24 ExtraBold ·
`kennlabel` 16 Montserrat Bold · `station` 16 Montserrat Bold, gemischt (Titel einer Station) · `zitat` 24 kursiv (alle mindestens 12; `zitat` 14) · `vorsatz` 12 Versalien
in Tinte (mindestens 11) · `tabellenkopf` 12 Versalien Grau · `label` 10 Medium Grau · `achse` und `legende` 11 (mindestens 10).
Versalien setzen nur `kicker`, `tabellenkopf` und `vorsatz` (und der Titel im Layout).

**Mindestgrößen (E3):** Fließtext 14 pt, Tabellenzellen 12 pt, Beschriftungen und Achsen 10 pt. 12 pt ist Zusätzen
vorbehalten (Notiz, Legende, Anhang): `B.text` mit `rolle: 'fliess'` und `pt: 12` meldet der Build, `rolle: 'kleinText'`
ist dafür da. Titel bricht man von Hand, Versalien setzt die Bibliothek.

**Text in den Bausteinen:** `**fett**` setzt Work Sans SemiBold in Tinte; `\n` beginnt einen Absatz. Leerzeichen zwischen Zahl
und Einheit schützt die Bibliothek selbst („5,6 Mio. €“, „80 %“, „S. 8“, „p. a.“). Verboten sind U+202F, U+2011, ✓ und ✗
(fehlen in den Schriften; dafür `B.icon`). Minus ist U+2212, Bereiche mit Halbgeviertstrich.

## 4 · Daten und Formatierer

- **E10:** Zahlen der Mappe nur über `W(lauf, schluessel)`. Das Modellhaus ist Projekt 2 der Rechenmappe (PGN-Projekt in Neu Wulmstorf,
  3.579 € je m², Grundstück nicht angesetzt); jeder Lauf setzt Eingaben!D3 auf 2. Läufe: `modellhaus`, `modellhaus_zeitreihe`,
  `modellhaus_kosten_4631` (ARGE-Median) und `modellhaus_kosten_5460` (Bemessungsgrenze seit 01.10.2026; beide für die Folien 23 und A7),
  `modellhaus_rendite` (Renditen, Restwert und Marktmiete; nur für die Folie `anhang-rendite`), `projekt2` (Stand der Altfassung mit
  Tilgung 2,5 %), `modellhaus_dscr125` (die beiden letzten erscheinen nicht auf Folien).
  Anteile sind Dezimalbrüche (0,025 = 2,5 %). `zr.*` und `frei.*` führen Auszahlungen negativ: Vorzeichen drehen.
- **Zahlen, die nur Broschüre oder Altfassung haben,** stehen in der Datendatei der Baugruppe, je Eintrag
  `{ "wert": …, "einheit": "…", "herkunft": "Broschüre S. 6", "geprueft": true }`. Zugriff: `ctx.X('regeln', 'mietpfad.jahr4')`
  liefert `wert` und bricht ab, wenn der Pfad fehlt. Muster: `daten/probe.json`.

  | Baugruppe | Datei | Inhalt |
  |---|---|---|
  | `regeln` | `daten/regeln.json` | Regelwerte der Broschüre (Stand bis 30.06.2026, Mietpfad, Angebotsmieten, Einkommensgrenzen) |
  | `einstieg`, `ueberblick`, Folie 22 | `daten/markt.json` | Baukosten Q1 2020 und Q4 2025, Zinsreihe, Eingangswerte zum Kapitaldienst je m², Bestandsreihe und Marktzahlen (Folien 3 bis 6), Kostenvergleich PGN gegen ARGE (Folie 22), Programmteile (A1); Werte der Altfassung mit Vermerk „nicht nachgeprüft“ |
  | `umsetzung` | `daten/umsetzung.json` | Bedarfslage, Fristen, Leistungsphasen |
  | `rahmen`, `struktur` | `daten/rahmen.json` | was Titel, Agenda (Abschnitte, Register der Programmteile), Trenner, Kontakt und Quellen brauchen |
  | `rechnung` | `daten/rechnung.json` | Angaben, die `werte.json` nicht führt (Kostenstand, Text zum PGN-Median, Herkunft von Marktmiete und Liegenschaftszins der Folie A6) |
  | Prüfung | `daten/pruefung.json` | Belege für `pruefe_folien.py`: gerechnete Größen mit Formel (`gerechnet`), einzelne Angaben mit Herkunft (`angaben`) |

- Texte im Wortlaut des Konzepts (`ctx.o.inhalt`) dürfen im Modul stehen; Zahlen darin kommen aus `W` oder `X`.

| `ctx.fmt` | Beispiel |
|---|---|
| `zahl(v, nk = 0)` | 84000 → „84.000“ · −18495,2 → „−18.495“ |
| `dez(v, nk = 2)` | 6,7724 → „6,77“ |
| `euro(v)` · `euroDez(v)` | „84.000 €“ · „6,77 €“ |
| `mio(v, nk = 1)` · `mioZahl(v, nk = 1)` | 5600000 → „5,6 Mio. €“ · „5,6“ |
| `prozent(anteil, nk = 0)` · `prozentWert(p, nk = 0)` | 0,8 → „80 %“ · 3,74 mit nk 2 → „3,74 %“ |
| `euroQm(v)` · `euroJeQm(v)` · `qm(v)` | „6,77 €/m²“ · „6,77 € je m²“ · „1.400 m²“ |
| `monatKurz(m)` · `monatWort(m)` | „2020-02“ → „02/2020“ · „Februar 2020“ |
| `nb(s)` · `NBSP` · `MINUS` | alle Leerzeichen schützen · U+00A0 · U+2212 |

Gerundet wird kaufmännisch und erst hier. Vor jeder Einheit steht U+00A0. Sehr kleine Beträge (ein Rest von 5,8 · 10⁻¹¹ aus einer
Summenprobe) runden zu null.

## 5 · Bausteine `B`

Erstes Argument ist immer die Folie `s`. Maße in Zoll. Jede Form bekommt einen Namen (`name` überschreibt ihn). Rückgaben
tragen `unten` (y unter dem Baustein) zum Stapeln. Fehlt ein Pflichtmaß (`x`, `y`, `w` …) oder ist es keine Zahl, bricht
der Baustein mit einer Meldung ab, die Baustein und Feld nennt.

### Text, Linien, Flächen

| Funktion | Parameter und Maße |
|---|---|
| `B.text(s, text, { x, y, w, h, rolle, pt, farbe, align, valign, einzeilig, name })` | Text in einer Rolle der Schriftskala. Ohne `h` folgt die Höhe dem Text. `einzeilig: true` prüft die Breite, sonst Breite und Höhe; ein einzeiliges Feld bricht nie um (`wrap="none"`): Mit einer breiteren Schrift läuft der Text über sein Feld, statt in eine zweite Zeile zu fallen. `farbe`: Hex, `C.*` oder Schlüssel des Farbsatzes (`titel`, `text`, `sekundaer`, `akzent`). Die Mindestgröße der Rolle wird geprüft. → `{ x, y, w, h, unten }` |
| `B.hoehe(text, { w, rolle, pt })` | Höhe eines Textes in einer Rolle bei gegebener Breite, gerechnet wie `B.text` ohne `h`. Zum Ausrichten an einer Unterkante, bevor gezeichnet wird (Folie A8) |
| `B.zweizeilig(text, { w, rolle, pt, nach })` | bricht einen Text, der nicht in eine Zeile der Breite `w` passt, an der Wortfuge mit den zwei ausgeglichensten Zeilen („\n“); geschützte Leerzeichen brechen nicht. `nach`: Muster für das Ende der ersten Zeile (`/[,;]$/`: nur hinter Komma oder Semikolon). Passt keine Teilung in zwei Zeilen, bleibt der Text unverändert (Folien 7 und 22) |
| `B.altText(s, name, text)` | Alternativtext an einer Form: Die Form mit diesem `objectName` bekommt ihn in der Nachbearbeitung und gilt dann nicht als Schmuck (pptxgenjs schreibt Alternativtexte nur für Bilder und Diagramme). Der Name muss auf der Folie eindeutig sein |
| `B.textAufPlot(s, text, { x, y, w, h, rolle, pt, align, valign, farbe, grund, name })` | einzeiliger Text auf der Plotfläche eines Diagramms (Summe am Balkenende, Wert an einer Säule) mit einer Fläche in der Grundfarbe dahinter, so breit wie die Schrift: Keine Gitterlinie läuft durch die Zahl. `grund`: Farbe der Fläche auf einer hervorgehobenen Spalte (Folien 16, 19, 23) |
| `B.grundZwischenWerten(s, { x0, x1, y0, y1, h, name })` | Fläche in der Grundfarbe zwischen zwei Werten, die nebeneinander auf fast gleicher Höhe über ihren Säulen stehen (`B.textAufPlot`): Sie deckt die Gitterlinie zwischen den beiden Zahlen, denn ein Stück Linie dort läse sich als Bis-Strich. `x0`, `x1`: Mitten der beiden Texte (am Rand der Plotfläche deren Kante); `y0`, `y1`: Oberkanten der Textfelder (Höhe `h`, Vorgabe 0,22). Vor den beiden Texten anlegen. Liegen die Oberkanten um `h` oder mehr auseinander, entfällt die Fläche (Folien 3 und 6). → `true`, wenn gezeichnet |
| `B.vieleck(s, { punkte: [{ x, y }], farbe, name })` | Fläche ohne Kontur als natives Freihandformat aus Ecken in Zoll (im Umlauf), Vorgabe Hauch F7E3E7. Füllt auf der Plotfläche einen Bereich, den das Diagramm nicht selbst füllt (über einer Linie). Vor dem Diagramm anlegen und die Plotfläche dafür vorab rechnen; das Modul prüft sie danach gegen die Rückgabe von `D.linien` (Folie A7) |
| `B.linie(s, { x, y, w \| h, art, strich })` | `art`: `haar` 0,5 pt · `tinte` 0,75 · `kraeftig` 1 · `modul` 1,5 · `mass` 0,75 Anthrazit · `referenz` · `grau` 1,5 B4B0AB · `signal` · `akzent`. `strich`: `dash`, `sysDash`, `lgDashDot` |
| `B.kasten(s, { x, y, w, h, art })` | `kasten` (Papier auf Weiß, Weiß auf Papier) · `rahmen` (Linie 0,75 pt) · `hauch`. `h` ist Pflicht. → Innenfläche `{ x, y, w, h }` mit 0,20 Rand |
| `B.modulkopf(s, { x, y, w, titel, sub, signal, icon, altText, rechts, art, farbe })` | Linie 1,5 pt, Titelfeld y + 0,08 bis y + 0,38 (mittig), Untertitel ab y + 0,42 (oben verankert): dieselbe Lage wie der Kopf der Layouts `PGN_DIAGRAMM` und `PGN_TABELLE`, damit der Kopf beim Blättern nicht springt. `signal: true`: Linie und Titel in Dunkelrot (nur mit Wort, zum Beispiel „Förderschädlich“). `icon: 'check'`: Linien-Icon 0,24 vor dem Titel, `altText` dazu (Folie A3). `rechts`: zweite Angabe rechts in der Titelzeile, 12 pt grau (Folie A1); Titel und Angabe müssen nebeneinander passen. `art`: andere Linienart, `farbe`: Titelfarbe. → y für den Inhalt (y + 0,46, mit Untertitel y + 0,76) |
| `B.diagrammkopf(s, { titel, sub })` · `B.tabellenkopf(s, { titel, sub })` | Kopf in den Platzhaltern von `PGN_DIAGRAMM(_MR)` und `PGN_TABELLE(_MR)`: Titel gemischt (Montserrat Bold 16 pt), Untertitel mit Einheit, beide einzeilig; im Diagramm über 6,90 Zoll, in der Tabelle über 7,92 (geprüft). Nur `B.diagrammkopf`: `sub` als Liste aus zwei Zeilen, wenn der Untertitel nicht in eine Zeile passt (bis 13.11.2026 Folie 5, derzeit auf keiner Folie); Legende und Diagramm stehen dann eine Zeile tiefer, das Modul setzt sie in freier Lage. → `{ unten, legende, chart: { x, y, w, h } }` (Lage der Legende und des Diagramms bis zum Ende der Inhaltszone). Auf anderen Layouts `B.modulkopf` |
| `B.vorspann(s, text)` | Vorspann im Platzhalter `lead` von `PGN_AUSSAGE` (18 pt, 7,92 × 0,80) |
| `B.planlegende(s, { x, y, w, h, eintraege: [{ titel, text }], pt, linie, platzhalter, titelAbstand })` | Kommentarspalte in einem Textfeld. `pt` 16, 14 oder 12. Ein Eintrag braucht `titel` oder `text`; ohne `titel` ist er ein Absatz mit 8 pt Abstand. `platzhalter: 'kommentar' \| 'seite'` füllt den Platzhalter des Layouts; sonst freie Lage, `linie: true` zeichnet die Modulkopf-Linie bei y, der Text beginnt 0,05 darunter (der Modultitel steht dann wie ein Titel aus `B.modulkopf`). `titelAbstand`: Abstand vor den Zwischentiteln in pt (Vorgabe 10; 4 für Spalten, die ihr Feld sonst ganz füllen: Folie 23). **Ohne `h` folgt die Höhe dem Text;** mit `h` wird sie geprüft. Mehrere Spalten: je Spalte ein Aufruf (Muster 10). → `{ x, y, w, h, unten }` |
| `B.aufzaehlung(s, { x, y, w, h, punkte: [], pt, platzhalter })` | eckiger Marker in Tinte, höchstens fünf Punkte, `pt` 16 oder 14 (im Anhang auch 12). `platzhalter: 'body'` in `PGN_AUSSAGE`; sonst freie Lage, ohne `h` folgt die Höhe dem Text. Keine Fettung („**“ wird entfernt). → `{ x, y, w, h, unten }` |
| `B.stichpunkte(s, { x, y, w, h, gruppen: [{ titel, punkte: [] }], platzhalter, linie, titelAbstand, punktAbstand, name })` | Stichpunkte rechts neben Diagrammen und Tabellen (G9, 13.11.2026): je Gruppe eine Überschrift wie ein Modultitel (Montserrat Bold 16 pt, gemischt) und Stichpunkte mit eckigem Marker in Tinte, **einheitlich 14 pt** (fest, keine Option). Ein Textfeld: `platzhalter: 'kommentar'` in `PGN_DIAGRAMM(_MR)` und `PGN_TABELLE(_MR)`, sonst freie Lage; ohne `h` folgt die Höhe dem Text, mit `h` oder im Platzhalter prüft die Passprüfung Höhe und Luft (Meldung: Abstände enger, Spalte breiter oder kürzen; die Schrift bleibt 14 pt). `linie: true` zeichnet die Modulkopf-Linie bei y. `titelAbstand` (pt vor jeder weiteren Überschrift, Vorgabe 10), `punktAbstand` (pt nach jedem Stichpunkt, Vorgabe 4). „\n“ in einem Stichpunkt bricht die Zeile im selben Absatz (weicher Umbruch ohne neuen Marker; Folie 11: vor „5.460 € in IV–VII“, das sonst am Halbgeviertstrich bräche). Formname „Stichpunkte“ (`pruefe_folien.py` prüft 14 pt). Muster 34. → `{ x, y, w, h, unten }` |
| `B.notiz(s, text)` | eine Zeile unter der Tabelle im Platzhalter `notiz` (`PGN_TABELLE`); keine Sprechernotiz |
| `B.zitat(s, { zeilen: [], name, quelle })` | Layout `PGN_ZITAT`: höchstens vier Zeilen zu 38 Zeichen (28 pt, Zeile 36 pt), rote Linie in Zitathöhe. Mit `x, y, w`: freie Lage, 24 pt |

### Planzeichen

| Funktion | Parameter und Maße |
|---|---|
| `B.achskreis(s, { cx, cy, text, groesse, d, pt, variante, gruppe })` | `groesse` S 0,30 / 10 pt · M 0,40 / 12 · L 0,46 / 14 · G 0,90 / 32 (Montserrat Black, Kontur 1,5 pt, Ziffer in Tinte: Agenda) · XL 1,40 / 54 (Ziffer in Rot: Trenner). `variante`: `standard` · `akzent` (roter Ring, für „80“) · `gefuellt` (Rot) · `signal` (Dunkelrot) · `tinte` · `gruppe` (Ton von A, B, C). Achskreise tragen immer Bedeutung; `text` ist Pflicht |
| `B.masskette(s, { x, y, w, segmente: [{ anteil, text, akzent, ausrichtung }], hilfslinienBis, grund })` | Linie 0,75 pt mit 45°-Strichen, Werte 0,28 darüber. Über einem Diagramm bei `plot.y − 0,12`. `ausrichtung: 'links'` für Texte, die breiter sind als ihr Segment. `grund: true` legt hinter jeden Wert eine Fläche in der Grundfarbe, so breit wie die Schrift: für eine Maßkette auf der Plotfläche, damit keine Gitterlinie durch die Zahl läuft (Folie 3; die Fläche endet 0,06 über der Maßlinie und deckt die Maßstriche nicht). Die Linie steht 0,07 über |
| `B.massketteSenkrecht(s, { x, y0, y1, text, seite, name })` | senkrechte Maßkette von `y0` bis `y1` mit 45°-Strichen (Anstieg zwischen zwei Säulen); der Wert steht mittig `links` (Vorgabe) oder `rechts` daneben auf einer Fläche in der Grundfarbe (Folie 5). Die Linie steht 0,07 über |
| `B.zuleitung(s, { x0, y0, x1, y1, xKnick, name })` | Haarlinie 0,5 pt in Referenzgrau 77716B (hält auch am Beamer) von der Kante eines Segments zu seiner Beschriftung; liegen die Enden auf verschiedener Höhe, läuft sie mit einem Knick bei `xKnick` (Vorgabe: Mitte) (Folie 5) |
| `B.achse80(s, { x, yOben, yUnten, text })` | Strichpunktlinie mit Achskreis „80“ auf der Maßkette, in Tinte (bis Muster 2 in Rot) |
| `B.massstab(s, { x, y, w })` | Maßstabsleiste, fünf Felder, 0,05 hoch; bei `plot.y + plot.h + 0,02` |
| `B.markeMitLuecken(s, { y, x0, x1, luecken: [[von, bis]], text, textX, textBreite, lage, name })` | waagerechte Marke über einem Säulendiagramm: gestrichelte Linie 1 pt in Referenzgrau von `x0` bis `x1`, an den `luecken` unterbrochen (Datenbeschriftungen, Säulen bis an die Linie). Der Text steht auf der Verlängerung rechts der Plotfläche, `lage: 'ueber' \| 'unter'`; Zeilen bricht „\n“, „**fett**“ hebt den Wert hervor (Folie 10). `lage: 'aussen'`: Die Marke liegt nur über einem Teil der Plotfläche, der Text steht einzeilig rechts neben dem Linienende auf der Höhe der Linie (`textX`: Vorgabe `x1` + 0,08; bis 11.11.2026 die Marke „Ansatz im Modellhaus“ der Folie 22, derzeit auf keiner Folie) |
| `B.marke(s, { x, y, h \| w, text, art, strich, textSeite, textBreite, rolle })` | senkrechte (`h`) oder waagerechte (`w`) Marke. `art`: `mass`, `referenz`, `signal`. `textSeite` senkrecht `rechts` / `links` / `oben`, waagerecht `oben` / `rechts` / `aussen` (rechts neben dem Linienende; dafür `rand: { r }` im Diagramm vergrößern). Der Text bricht nur an „\n“ (das Textfeld trägt `wrap="none"`, wie die Texte der Legende); jede Zeile muss in `textBreite` (Vorgabe 2,4) passen, das Textfeld ist so breit wie die längste Zeile |
| `B.kote(s, { x, y, text, seite, signal })` | Höhenkote: Dreieck mit Spitze auf (x, y), Wert daneben |
| `B.schnittlinie(s, { x, y, w, text })` | Strichpunktlinie zwischen zwei Buchstaben; höchstens einmal je Folie |
| `B.einheiten(s, { x, y, n, gefuellt, reihen, art, rest })` | Einheitenquadrate 0,20 mit Fuge 0,045. `art`: `tinte` oder `zuschuss`; `rest`: `bisher` (Fläche B4B0AB) oder `kontur`. → `{ w, h, xNach(k) }` |
| `B.entzerre(werte, abstand)` | schiebt Lagen auf Mindestabstand auseinander (Achskreise an Linienenden) |

### Register, Stempel, Chips

| Funktion | Parameter und Maße |
|---|---|
| `B.register(s, '2.1')` | Daumenregister am rechten Rand, 0,42 × 0,62, y = 2,10 + i · 0,74 |
| `B.schluesselplan(s, '2.1')` | sechs Felder in der Kopfzeile (x 9,367–12,667). Nicht auf `_MR`-Layouts (die Kopfzeile bleibt dort rechts frei) und nicht neben dem Daumenregister: Kopf, Schlüsselplan und Reiter nennten den Programmteil dreimal (derzeit nur A5) |
| `B.stempelZusatz(s)` | „Rechenbeispiel, keine Förderzusage“ als schlichte Zeile rechts in der Kickerzeile (11 pt, grau); nur auf Folie 14 (bis 11.11.2026 „Fiktives Beispiel, …“) |
| `B.stempel(s, { x, y, kurz, zusatz })` | Stempel frei gesetzt (2,12 × 0,37) auf Layouts ohne `_MR`; `kurz: true` einfache Kontur 1,95 × 0,26 |
| `B.konturstempel(s, { x, y, w, text })` | Fördervermerk, 0,36 hoch, Kontur und Versalien in Tinte |
| `B.programmChip(s, { x, y, nr })` | 0,42 × 0,24 in der Programmfarbe. → `{ rechts }` |
| `B.chip(s, { x, y, text })` | Verweis-Chip „Broschüre S. N“, 0,26 hoch, Breite folgt dem Text; sparsam. → `{ rechts }` |
| `B.quelle(s, text)` | Quellenzeile im Schriftfeld für Folien mit fremden Daten (Folien 3 bis 6, 10 und 22, Muster 3): Kurzform der Quelle, die volle Angabe steht auf der Quellenfolie. Lage fest: im freien Feld zwischen den beiden Zeilen links (Projekt, Rubrik) und der Blatt-Zelle, rechtsbündig mit 0,20 Abstand vor der Blatt-Zelle, senkrecht mittig, Work Sans 10 pt in Grau. Passt der Text nicht in eine Zeile, bricht der Baustein ihn in zwei ausgeglichene Zeilen (zuerst hinter einem Semikolon, sonst hinter einem Komma, sonst an einer Wortfuge). Geprüft: höchstens zwei Zeilen; mindestens 0,30 Abstand zur längeren der beiden Zeilen links (die Breite der Rubrik ist gerechnet). Nur auf Inhalts- und Anhangfolien, nach `ctx.folie()`, höchstens eine je Folie. Die Form heißt „Quellenzeile“. Der Text kommt aus einer Datendatei (`quelle_kurz`) und steht im Feld `inhalt` des Konzepts: `B.quelle(s, ctx.wortlaut(X('markt', 'baukosten.quelle_kurz'), 'Quellenzeile'))`. → `{ x, y, w, h, zeilen, links, breite }` |
| `B.legende(s, { x, y, eintraege: [{ text, art, strich }], fein })` | Farbfeld 0,28 × 0,17 und Text 11 pt; `strich: 'solid' \| 'dash'` zeichnet ein Linienmuster. `art` wie die Reihenarten. `fein: true` gibt den Feldern die Kontur der feinen Säulen (Pflicht für `bezug` und `licht`; Folien 3 und 22). → `{ rechts }` (der nächste Eintrag beginnt bei `rechts` + 0,20) |

### Kennzahlen und Vergleich

| Funktion | Parameter und Maße |
|---|---|
| `B.kennzahl(s, { x, y, w, vorsatz, zahl, einheit, label, text, gross, teile, trenner, vor, kompakt })` | Kachel mit Oberlinie in freier Lage. 44 pt (Zahl bei y + 0,34, Label bei y + 1,10, Text ab y + 1,40; `kompakt: true` ohne Zeile für den Vorsatz: alles 0,24 höher, Folie 12), `vor`: Zusatz vor der Zahl in der Größe der Einheit („mind. 2,38 % p. a.“, Folie 12), `gross: true` 60 pt (y + 0,60, Label bei y + 1,80). Das Label steht in beiden Größen in 16 pt (Rolle `kennlabel`). Einheit halb so groß in der Farbe der Zahl, Vorsatz in Tinte (Versalien). Bei 3,84 Breite passen bei 60 pt etwa sieben Zeichen. Mehrere Zahlen mit je eigener Einheit: statt `zahl` und `einheit` `teile: [{ zahl, einheit }]`, dazwischen `trenner` (Vorgabe „/“), etwa „1 % / 0,75 %“ (Folie 12). → `{ unten }` |
| `B.hauptzahl(s, { vorsatz, zahl, einheit, label, text, gross })` | Hauptzahl einer Diagrammfolie in der rechten Spalte (`ZONE.diagramm.spalte`, fünf Spalten ab x 7,807, ab y 2,10) statt des Kommentars; die Zahl steht auf der Folie nur hier groß: die Zahl des Titels als Kennzahl-Kachel. `gross: true`: 60 pt mit Vorsatz, Zahl und einer Zeile Label (Folien 3 bis 6 und 22; für Zahlen bis sieben Zeichen); sonst 44 pt, der Text darunter in zwei ausgeglichenen Zeilen (für längere Zahlen, derzeit auf keiner Folie). Meldet, wenn die Kachel in das zweite Modul läuft. → `{ x, w, unten }` |
| `B.nebenzahl(s, { vorsatz, zahl, einheit, label, text })` | zweite Kennzahl derselben Spalte: 44 pt ab y 4,40 (Folien 3, 4, 6). → `{ x, w, unten }` |
| `B.zweitesModul(s, { eintraege \| titel, name })` | zweites Modul derselben Spalte ab y 4,40 statt einer zweiten Kennzahl: Oberlinie 0,75 pt, darunter `eintraege: [{ titel, text }]` als Planlegende in 14 pt (Folie 22) oder nur ein Modultitel (`titel`), unter dem das Modul selbst weiterbaut, etwa eine Tabelle ab `y` + 0,30 (bis 13.11.2026 Folie 5). → `{ x, w, y, inhalt, ende, unten }` |
| `B.kennzahlFeld(s, i, { vorsatz, zahl, einheit, label, text })` | Platzhalter der Layouts `PGN_KENNZAHLEN(_MR)`, i = 0, 1, 2: Zahl **44 pt**, Label 16 pt einzeilig (Rolle `kennlabel`), Text 14 pt bis y 4,45 (höchstens drei Zeilen). Dieselbe Geometrie wie `B.kennzahl`. Für 60 pt: `B.kennzahl` mit `gross: true`. → `{ unten: 4,45, darunter: 4,70 }` |
| `B.hero(s, { x, y, w, h, zahl, einheit, text, flaeche })` | Montserrat Black 96 pt, höchstens eine je Folie; `flaeche: true` auf roter Fläche (h mindestens 2,90 mit Text) |
| `B.vergleichFeld(s, 'links' \| 'rechts', { kopf, wert, text, pt })` | Layouts `PGN_VERGLEICH(_MR)`; `text` ist wahlfrei: Sollen die Absätze links und rechts auf gleicher Höhe beginnen, füllt man nur Kopf und Wert und setzt die Absätze als `B.text` an festen Lagen (Folie 9, Namen „Links Text 1“ …); `text` als Absatz oder Liste von Absätzen, `pt` 16 oder 14 (Feld 2,65 hoch: bei 14 pt zehn Zeilen abzüglich 8 pt je Absatz); Wert 36 pt einzeilig. → `{ x, w, unten }` |
| `B.vergleichFuss(s, text)` | Fußzeile unter beiden Seiten (Platzhalter `fuss`, 12 pt, eine Zeile über zwölf Spalten) |
| `B.titelKennzahl(s, { vorsatz, zahl, einheit, bezug, zusatz })` | Kennzahlfeld der Titelfolie (Vorsatz y 5,77, Zahl 6,00, Bezug ab 6,49); Bezug und Zusatz zusammen höchstens vier Zeilen. „\n“ im Bezug bricht die Zeile von Hand (wie auf U1 der Broschüre) |

### Tabellen (nativ, `addTable`)

| Funktion | Parameter und Maße |
|---|---|
| `B.rechenblatt(s, { x, y, w, kopf, zeilen, wertBreite, dicht, hervor, zeilenH, ergebnisH })` | `kopf: ['Position', 'A', 'B', 'C']`, Einträge als Text oder `{ kreis: 'A' }` (Achskreis als Spaltenkopf). `zeilen: [{ nr, zeichen, text, werte: [], art, h }]` mit `art`: `normal` · `summe` (Oberlinie, halbfett) · `ergebnis` (weiß auf Rot; auch mitten in der Tabelle: Folie A6) · `notiz` (12 pt grau, ohne Linie; unter dem Ergebnis oder als Hinweis ohne Nummer und Betrag zwischen zwei Zeilen: „Grundstück im Bestand, nicht angesetzt“ auf Folie 14; `h` setzt die Höhe einer einzelnen Zeile). Nummernstreifen 0,42, Rechenzeichen 0,30, Wertspalten je `wertBreite` (1,20) oder je Spalte eine Breite als Liste (`[1.06, 1.06, 1.06, 1.22]`: Folie A6), Position nimmt den Rest. `zeilenH`, `ergebnisH`: Mindesthöhe der Zeilen und der Ergebniszeile (gleich hohe Zeilen, wenn einzelne Positionen zwei Zeilen brauchen). Jeder Wert wird gegen die Breite seiner Zelle gerechnet. 14 pt mit Zeile 0,42, Kopf 0,34, Ergebnis 0,46; `dicht: true` 12 pt mit Zeile 0,34, Kopf 0,30, Ergebnis 0,38 (neun Zeilen ab y 2,80 enden bei 6,20). Positionen höchstens zweizeilig. `hervor: i` hebt eine Wertspalte hervor. → `{ unten, spalten: [{ x, w }], zeilen: [{ y, h }], kopfH, positionX, positionW }` |
| `B.vergleichstabelle(s, { x, y, w, kopf: [3], zeilen: [{ text, wert, vergleich, kern, ergebnis }], wertBreite, dicht })` | hervorgehobene Spalte und Vergleichsspalte je `wertBreite` (2,20). Zeile 0,50 bei 16 pt; `dicht` 0,44 bei 14 pt; die Zeile wächst mit dem Text der Position. `kern: true`: Oberlinie, Werte Montserrat ExtraBold 24 pt (höchstens zwei). `ergebnis: true`: dieselbe Zeile mit den Werten in der Größe der Tabelle, wenn der Wert auf der Folie schon groß steht (Folie 19). Reihenfolge: gefördert vor frei finanziert |
| `B.tabelle(s, { x, y, w, spalten: [{ kopf, breite, art, randRechts }], zeilen, pt, kopf, dicht, zeilenH, zielHoehe, schlusslinie, messen })` | allgemeine Tabelle. Spalte `art`: `text` · `zahl` (rechts, Montserrat Bold) · `stichwort`. Zeile als Liste von Zellen oder `{ zellen, trennlinie: true, flaeche: true }`; Zelle als Text (mit „**fett**“) oder `{ text, fett, farbe, align }`. Zeilenhöhe folgt dem Text; ein Wort, das breiter ist als seine Zelle, meldet die Prüfung. `pt` 12 oder 14; `kopf: false` lässt die Kopfzeile weg. `dicht: true`: Zeilenhöhe Zeilenzahl × Zeilenmaß + Zellränder + 0,01, für Tabellen, die die Inhaltszone füllen (Folien A1, A8). Kopfzeile 0,33 Zoll (aus der Schrift gerechnet), je weitere Kopfzeile 0,20. `zeilenH`: Mindesthöhe je Zeile. `zielHoehe`: Gesamthöhe mit Kopf; kurze Zeilen bekommen dafür eine gemeinsame Mindesthöhe. `messen: true` rechnet nur und zeichnet nichts (zwei Tabellen auf gleiche Höhe bringen: Folie A5). `schlusslinie: false` lässt die Linie unter der letzten Zeile weg, wenn ein Kasten anschließt (Folie A8). `randRechts`: rechter Zellrand einer Spalte. → `{ unten, h, kopfH, zeilen: [{ y, h, n }], spalten: [{ x, w }], zeilenzahl, zeilenmass, rand }` (damit lassen sich Chips oder Icons in eine Zelle setzen) |
| `B.hinweisKasten(s, { x, y, w, stichwort, text, spalte, pt })` | Hinweis als Kasten auf Fläche mit Modulkopf-Linie: Stichwort links in einer Spalte der Breite `spalte`, Text rechts (14 pt). Schließt als Fuß an eine Tabelle an, deren erste Spalte so breit ist (Folie A8). → `{ h, unten }` |
| `B.hinweis(s, { x, y, w, text, unten, name })` · `B.hinweisHoehe(text, { w })` | Hinweis am Diagramm (G8, 13.11.2026): grauer Kasten (E9E7E4, ohne Kontur) mit Info-Symbol (`B.icon` „hinweis“, 0,22 Zoll, auf der Höhe der ersten Zeile), Text in **Work Sans Light 12 pt** (Rolle `hinweis`). Steht direkt am Diagramm, an der Tabelle oder am Zeitstrahl und hat dessen `x` und `w`; kein kleiner, frei hängender Text mehr. `unten: true`: `y` ist die Unterkante (Kasten an der Unterkante der Inhaltszone). Vorher mit `B.hinweisHoehe` die Höhe holen und das Diagramm um Höhe plus 0,12 niedriger setzen. Höchstens 200 Zeichen (sonst gilt der Text als Fließtext). Formnamen „Hinweiskasten Fläche“ und „Hinweiskasten Text“ (mit `name` als Zusatz: „Hinweiskasten <name> Text“); `pruefe_folien.py` prüft Schrift und Größe. Nicht zu verwechseln mit `B.hinweisKasten` (Rechtshinweis der Quellenfolie, 14 pt). Muster 34. → `{ x, y, w, h, unten }` |

Ein Kopf mit `\n` bricht in zwei Zeilen. Die Köpfe werden gegen die Spaltenbreite gerechnet; ein Wort, das breiter ist als
seine Zelle, meldet die Passprüfung.

### Ablauf, Zeit, Plan, Bild

| Funktion | Parameter und Maße |
|---|---|
| `B.achsleiste(s, { x, y, w, stationen: [{ nr, titel, zustaendig, text, zusatz, signal }], art, groesse, versalTitel, pt, abstand, anteile })` | `y` ist die Achse. `art: 'reihe'`: bis sechs Stationen mit Titel mittig darunter (über zwölf Spalten Titel bis etwa 14 Zeichen); ohne Titel bis zwölf Achskreise. `art: 'text'` (Vorgabe, wenn Texte da sind): Titel, Zuständigkeit (12 pt), Text (`pt` 14 oder 12) und Zusatz (12 pt grau) linksbündig ab Kreis; je Reihe vier Stationen (Textbreite je Station = w / n − `abstand`, Vorgabe 0,12). `groesse`: `S`, `M`, `L` (Vorgabe). Der Titel einer Station steht gemischt in Montserrat Bold 16 pt wie ein Modultitel; `versalTitel: false` setzt ihn in 12 pt (Datum einer Zeitleiste). `anteile: [1, 1, 1.25, …]` gibt einzelnen Stationen mehr Breite. Alle Texte sind wahlfrei. Zwei Reihen mit dreizeiligen Texten und Warnband dazwischen füllen die Inhaltszone ganz (Muster 13: Achsen bei y 2,33 und 4,65, Warnband bei 3,91). `signal: true` füllt den Kreis in Dunkelrot; der Titel der Station bleibt in Tinte wie die übrigen. → `{ punkte: [x], unten }` |
| `B.warnband(s, { y, kopf, text })` | volle Breite × 0,42 in Dunkelrot, höchstens eines je Folie; `kopf` in Versalien |
| `B.achtung(s, { x, y, w, h, label, text })` | Achtung-Kasten; nur Vorhabenbeginn und Frist 31.12.2026, im Vortrag höchstens zweimal |
| `B.abschnittsleiste(s, { n, aktiv })` | Achskreise M auf der oberen Rahmenlinie der Abschnittsfolien |
| `B.zeitstrahl(s, { x, y, w, von, bis, marken: [{ wert, text, signal }], ticks, baender: [{ von, bis, zeile, art, text }], achsText })` | Jahresachse bei `y`, Achskreise M an den Marken, Bänder darüber (Zeile 0 direkt über der Achse, Höhe 0,36). **Achskreise an den Achsenden brauchen je 0,20 Zoll Platz:** Bei einer Marke am Ende die Achse 0,20 kürzer ansetzen (Muster 22: `w: 12.0 − 0.20`). → `{ xVon(wert), yBand(zeile), oben, unten }` |
| `B.balken(s, { x, y, w, h, art, text, align })` | Band in fester Farbe mit Text: `tinte`, `referenz`, `bisher`, `papier`, `rahmen`, `zuschuss`, `eigenmittel`, `signal`, `A`, `B`, `C` |
| `B.balkenplan(s, { x, y, w, labelBreite, phasen, kopf, zeilen: [{ nr, text, von, bis } \| { nr, text, wort }], zeilenH, nummern, marke: { nach, text, zeichen }, links, rechts })` | Balkenplan der Leistungsphasen (Folie 27, Muster 28): Kopfleiste bei y + 0,50 mit einem Achskreis S je Phase (`phasen`: Anzahl, Vorgabe 9, oder Liste), `kopf` als Bezeichnung der Achse rechtsbündig vor dem ersten Achskreis; je Zeile Nummer und Bezeichnung (14 pt, `labelBreite` Vorgabe 3,30) und ein Balken in Tinte von Phase `von` bis `bis`; `nummern: false` lässt die Zeilennummern weg (Folie 27: Im Plan zählen nur die Leistungsphasen). Zeilen ohne Balken tragen `wort` (12 pt in Tinte). `marke`: senkrechte Linie in Dunkelrot nach Phase `nach` mit gefülltem Achskreis (`zeichen`, Vorgabe „±0“) und Wort bei y. `links`, `rechts`: Sätze unter dem Plan beiderseits der Marke (12 pt, brechen von selbst). `zeilenH` Vorgabe 0,38. → `{ unten, kopfY, planX, planW, xPhase(n), xMarke, zeilen: [{ y, h }] }` |
| `B.pruefliste(s, { x, y, w, spalten, punkte: [{ nr, frage, zusatz, signal }], zeilenH, steg, linien })` | Prüfliste (Folie A2, Muster 29): Achskreis M mit Nummer, Frage in Work Sans SemiBold 14 pt, Zusatz 12 pt grau; `spalten` (Vorgabe 2) werden spaltenweise gefüllt, Haarlinie über jedem Punkt (`linien: false` lässt sie weg). `zeilenH` folgt ohne Angabe dem höchsten Punkt. → `{ unten, zeilenH, felder: [{ x, y, w, h }] }` |
| `B.bild(s, { datei, x, y, w, h, altText, ecke, marken })` | Bild aus `assets/`; ohne `h` im Verhältnis 1800 : 740. Bildecke „Visualisierung“ (Vorgabe), `marken: true` Beschnittmarken. `altText` ist Pflicht. Höchstens sieben Spalten breit |
| `B.icon(s, { name, farbe, x, y, d, altText })` | Linien-Icon: `check`, `kreuz`, `stopp`, `hinweis`, `achtung`, `frist`, `kalender`, `rechner`, `telefon`, `mail`, `web`, `standort`, `dokument`, `pfeil` in `tinte`, `rot`, `dunkelrot`, `weiss`. Ohne `altText` trägt es seine Bezeichnung als Alternativtext („Symbol: Haken“) |

### Beschriftungen an Diagrammen

Formen über der Plotfläche; die Lagen kommen aus der Rückgabe von `D.*` (`xWert`, `yWert`, `katMitte`, `reiheMitte`).

| Funktion | Parameter und Maße |
|---|---|
| `B.segmenttext(s, { x, y, w, h, name, wert, art })` | Beschriftung in einem Segment eines gestapelten Balkens: Name (Work Sans SemiBold 11 pt) über Wert und Anteil (Montserrat Bold 12 pt), mittig; weiß auf Zuschuss und Darlehen, Tinte auf Schraffur und hellen Flächen. Diagramm dazu mit `labels: false` (Folie 14). Die Texte folgen einer späteren Änderung der Diagrammdaten in PowerPoint nicht |
| `B.bezeichnungMitWert(s, { y, h, bezeichnung: { text, x, w, align, name }, wert: { text, x, w, align, name }, grau })` | Bezeichnung (Work Sans SemiBold 12 pt) und Wert (Montserrat Bold 12 pt) in einer Zeile auf gemeinsamer Grundlinie, jede in ihrem Feld; Work Sans steht in gleich hohen Feldern 0,012 Zoll tiefer als Montserrat, der Baustein gleicht das aus. `y`: Oberkante der Zeile, `h` Vorgabe 0,22. `grau: true`: Zeile ohne Betrag, beide Texte in Grau. Beide sind einzeilig und werden gegen ihr Feld geprüft (Folien 5, 17, 18) |
| `B.achsentitel(s, d, { y, x, xAusrichtung, xAbstand, xVon, xBis, yVersatz })` | Achsentitel mit Größe und Einheit, Work Sans 11 pt grau wie die Achsbeschriftung. `y`: senkrechte Achse, von unten nach oben gesetzt, am linken Rand des Diagramms, mittig zur Plotfläche; braucht links der Achsbeschriftung 0,22 Zoll (`rand.l` im Diagramm entsprechend wählen: Säulen 0,80, Linien ab 1,02 bei sechsstelligen Werten; `yVersatz` schiebt den Titel nach rechts: Folie 23). `x`: waagerechte Achse, unter der Achsbeschriftung, mittig zur Plotfläche (`rand.u` ab 0,50; `xAusrichtung: 'rechts'` und `xAbstand: 0.04` setzen die Einheit rechts in die Zeile der Achsbeschriftung: Folie 14). Jedes Diagramm mit bezifferter Achse trägt einen Achsentitel (Entscheidung 31) |
| `B.wertzeilen(s, { x, mitten: [y], eintraege: [{ kreis, text }], name })` | Werte an einer Marke im Liniendiagramm: je Zeile ein Achskreis 0,26 und der Wert (Montserrat Bold 12 pt). `mitten`: Lagen zwischen den Gitterlinien (Folien 20, 21) |
| `B.punkt(s, { cx, cy, art, name })` | Punkt auf einer Linie, 0,10 Zoll, `art`: `tinte`, `referenz` (Schnitt mit einer Marke, Folie 20) oder `akzent` (Rot, nur am Schnitt mit einer roten Marke: Folie A7) |
| `B.linienenden(s, { x, eintraege: [{ kreis, y, wert }], abstand })` | Achskreise S an den Linienenden, auf `abstand` (Vorgabe 0,32) entzerrt; mit `wert` steht der Endwert daneben (Folien 20, 21). → Lagen der Kreise |
| `B.ringWerte(s, { x, cy, w, eintraege: [{ wert, text, art }], schritt })` | direkte Beschriftung eines Ringdiagramms rechts neben dem Ring: Farbfeld, Zahl als Kernwert 24 pt, Bezeichnung 12 pt; der Block steht mittig zur Ringmitte (Folie A2). → `{ oben, unten }` |
| `B.achstexte(s, d)` | Beschriftung der Kategorienachse als Textfelder unter der Plotfläche (Work Sans 11 pt grau, mittig unter der Kategorie) für `D.linien` mit `katLabels: { formen: [...] }` (Folie 21). → `{ unten }` |
| `B.kategorien(s, d, [{ name, zusatz }])` | zweizeilige Kategorientexte unter einem Säulendiagramm mit `katAchse: false`: Bezeichnung (Work Sans SemiBold 12 pt) und Zusatz (11 pt grau), mittig unter der Kategorie (Folien 3 und 22). → `{ unten }` |

## 6 · Diagramme `D` (nativ, `addChart`; das Flussdiagramm aus nativen Formen)

Gemeinsam: `achse: { min, max, schritt, format }` ist Pflicht (feste Achse); die Grenzen dürfen als Zahlen im Modul stehen.
`format` und `labelFormat`: `ganz` (84.000) · `eins` (5,6) · `zwei` (6,77) · `prozent` (80 %) · `roh` (80) oder ein eigener
Code mit `[$-407]`. Lage: ohne `x, y, w, h` im Platzhalter `chart` (nur `PGN_DIAGRAMM(_MR)`), sonst frei. `labels: false`
blendet die Datenbeschriftung aus. `name` wird Objektname. Den Alternativtext gibt `altText`; fehlt er, schreibt die Bibliothek
Art, Name, Kategorien und Reihen („Säulendiagramm: Höchstmiete. Kategorien: A, B, C. Reihen: …“). Kein Titel und keine Legende
im Diagramm: Titel über `B.diagrammkopf` oder `B.modulkopf`, Legende über `B.legende`, Achsentitel (Größe und Einheit) über `B.achsentitel`.

**Reihenfolge:** Kategorien und Reihen immer in Lesereihenfolge übergeben (bei Balken von oben nach unten, also A, B, C und
„Gefördert“ vor „Frei finanziert“). Die Bibliothek dreht sie für PowerPoint selbst. Wo das Konzept eine gedrehte Übergabe
nennt (Folien 11 und 16), beschreibt es pptxgenjs direkt und gilt für `D.*` nicht.

**Plotfläche:** `rand: { l, r, o, u }` überschreibt einzelne Ränder in Zoll. Vorgaben:

| Diagramm | links | rechts | oben | unten |
|---|---|---|---|---|
| Balken (`stapelBalken`, `gruppierteBalken`, `balkenpaar`) | 0,71 ohne Kategorientext; mit `katAchse: true` `katBreite` + 0,10 (`katBreite` Vorgabe 1,6) | 0,24 | 0,60 gestapelt (Platz für die Maßkette), sonst 0,20 | 0,46 |
| Säulen (`stapelSaeulen`, `gruppierteSaeulen`, `saeulen`) | 0,62 | 0,24 | 0,22 | 0,46; mit `katAchse: false` 0,54 |
| Linien | 0,86 | 0,30 | 0,20 | 0,46 |

`luecke` (Abstand der Gruppen in % der Dicke eines einzelnen Balkens): Balken 120, Säulen 80, Balkenpaar 60. Bei gruppierten
Reihen gilt: Kategorienbreite = Reihen × Säulenbreite + Lücke. `saeulenBreite` und `balkenHoehe` der Rückgabe sind die Maße
einer einzelnen Säule oder eines einzelnen Balkens; `reiheMitte(i, j)` und `reiheLinks(i, j)` geben die Lage der Reihe j in der
Kategorie i.

Säulen (`stapelSaeulen`, `gruppierteSaeulen`, `saeulen`) nehmen dazu:

- `saeule: 0.56` statt `luecke`: Breite einer einzelnen Säule in Zoll; die Lücke folgt daraus (0 bis 500 %, sonst Abbruch).
- `fein: true`: feine Zeichnung (Abschnitt 3, Farben). Kontur 0,5 pt in Tinte um jede Säule und jedes Segment statt der Fuge in der
  Grundfarbe; zwischen gruppierten Säulen eine Fuge von 12 % der Säulenbreite (`c:overlap`), die `reiheMitte` und `reiheLinks`
  mitrechnen. Nur auf weißem Grund; die Reihenarten `bezug` und `licht` gibt es nur so. Bei `D.saeulen` mit `arten` trägt die
  Nachbearbeitung die Kontur an jedem Datenpunkt nach (Folie 6): Die Farbe je Datenpunkt überschreibt sonst die Linie der Reihe.
  Gestapelt stehen Segmente mit dem Wert 0 ohne Linie (Folie 5: die drei Ursachen bei „Q1 2020“): Ihre Kontur läge sonst als
  zweite Linie auf der Kante des Segments darunter.
- `gitter: false`: ohne Größenachse und ohne Gitter. Dann steht jeder Wert als Text am Diagramm; `achse` bleibt der Maßstab (Folie 5).

Jede Funktion gibt die Lage zurück: `plot: { x, y, w, h }` in Zoll, dazu `xWert(v)` oder `yWert(v)` und `katMitte(i)`.
`katMitte` nimmt auch gebrochene Indizes (Lage zwischen zwei Kategorien, etwa 1,22 % zwischen 1,0 und 1,5 %).
Planzeichen und Werte am Balkenende setzt man damit als Formen passgenau darüber.

| Funktion | Parameter | Rückgabe |
|---|---|---|
| `D.stapelBalken(s, { kategorien, reihen: [{ name, werte, art }], achse, labelFormat, katAchse, katBreite, luecke })` | waagerecht gestapelt. `katAchse: false` (Vorgabe): Kategorien als Formen davor, etwa Achskreise bei `plot.x − 0,36`; `true`: Text links, `katBreite` Zoll | `xWert`, `katMitte(i)` (y), `balkenHoehe`, `ohneLabel` |
| `D.stapelSaeulen(s, { kategorien, reihen, achse, katAchse, saeule, fein, gitter })` | senkrecht gestapelt. `katAchse`: `'text'` · `'gruppe'` (A, B, C in ExtraBold 14) · `false` (Achse als Linie ohne Beschriftung; Achskreise als Formen bei `plot.y + plot.h + 0,28` oder Texte über `B.kategorien`) | `yWert`, `katMitte(i)` (x), `saeulenBreite`, `ohneLabel` |
| `D.gruppierteSaeulen(s, { … })` · `D.gruppierteBalken(s, { … })` | Reihen nebeneinander, Werte am Ende in Tinte. Balken mit `katAchse: true` als Vorgabe. Feine Säulenpaare: `fein: true`, `saeule`, `labels: false` und die Werte als `B.textAufPlot` im Ton der Säule (Folien 3 und 22) | wie oben, dazu `reiheMitte(i, j)`, Säulen auch `reiheLinks(i, j)` |
| `D.saeulen(s, { kategorien, werte, art, arten, achse, fein })` | eine Reihe, auch unter null; die Nulllinie ist die kräftige Achse. `arten: ['bezug', …, 'tinte']` gibt jeder Säule ihre eigene Farbe (je Kategorie eine Reihenart; Folie 6 mit `fein: true`: frühere Jahre als helle Fläche, das letzte in Tinte) | `yWert`, `katMitte`, `saeulenBreite` |
| `D.balkenpaar(s, { kategorien, werte, arten: ['tinte', 'referenz'], achse, katBreite })` | eine Reihe mit fester Farbe je Balken (gefördert, frei finanziert), ohne Beschriftung; Werte als `B.text` mit `rolle: 'kernwert'` | `xWert`, `katMitte`, `balkenHoehe` |
| `D.linien(s, { kategorien, reihen: [{ name, werte, art, strich }], achse, katLabels, staerke, flaeche })` | 2,25 pt ohne Marker (`staerke`: andere Linienstärke in pt für alle Reihen; fein 1,5). `flaeche: { reihe, name, deckung }`: weiche Fläche unter der genannten Reihe, als eigene Reihe `name` in einem Flächendiagramm auf denselben Achsen und Zellen; Verlauf von der Farbe der Reihe an der Oberkante zur Grundfarbe an der Achse mit `deckung` Prozent Deckung (Vorgabe 26), ohne Kontur. Die Nachbearbeitung legt sie an (Folie 4). `strich`: `solid`, `dash`, `sysDash` … (je Reihe; zwei Reihen mit gleicher Farbe und Strichart meldet die Prüfung). Liegt null im Achsbereich, steht dort die kräftige Achse; Kategorien stehen unten. `katLabels` siehe unten | `yWert`, `katMitte`, `katBreite` |
| `D.ring(s, { x, y, w, h, segmente: [{ name, wert, art }], loch, reihenname })` | Ring ab 12 Uhr im Uhrzeigersinn, ohne Beschriftung. `reihenname`: Name der Reihe im Datenblatt (was die Werte zählen, etwa „Einheits- und Samtgemeinden“; Vorgabe „Anteil“) | `cx`, `cy`, `radius`, `winkel(i)`, `punkt(i, r)` |

**Beschriftung der Kategorien bei `D.linien`:**

- `katLabels: { jede: n }` beschriftet die 1., n + 1., 2n + 1. … Kategorie. Das steht fest in der Datei
  (`c:tickLblSkip`). Die Kategorien so benennen, dass jede n-te die Beschriftung trägt (Monatsreihe: Januar heißt „2016“, `jede: 12`;
  Muster 32 mit 127 Monaten). **LibreOffice beschriftet dichter, sobald die Beschriftungen schon bei kleinerem Abstand
  nebeneinander passen:** Bei 127 Monaten steht bei 7,4 Zoll Plotbreite jeder elfte Punkt unter der Achse („12/2016“, „11/2017“ …),
  bei 6,2 Zoll jeder zwölfte. Für lange Reihen deshalb `formen` nehmen (Folie 4).
- `katLabels: { nur: [1, 5, 10, …] }` beschriftet nur diese Kategorien und lässt die übrigen leer. Das trägt bis
  40 Kategorien (Muster 26 mit 35 Jahren). Darüber dünnen die Programme die Achse selbst aus; der Build bricht dann ab.
  Liegen die genannten Kategorien gleichmäßig ab der ersten, schreibt die Bibliothek von selbst den festen Abstand.
  In den Diagrammdaten heißen die übrigen Kategorien dann „ “ (Leerzeichen).
- `katLabels: { formen: [1, 5, 10, …] }` lässt die Achse ohne Beschriftung und gibt die genannten Kategorien in `katTexte`
  zurück; `B.achstexte(s, d)` setzt sie als Textfelder unter die Achse (Folien 4 und 21). Die Diagrammdaten behalten ihre echten
  Kategorien, und kein Programm dreht, bricht oder dünnt die Beschriftung aus. Nicht an der Achse festlegen lässt sich die
  Drehung: Eine feste Drehung 0 im Diagramm lässt LibreOffice alle Beschriftungen übereinander zeichnen.

Was die Bibliothek von selbst tut: Schrift Work Sans 11 pt an den Achsen, Montserrat Bold 12 pt an den Werten; Beschriftung
im Segment weiß, auf Schraffur und hellem Grau in Tinte; Nullwerte ohne Beschriftung; Minus als U+2212; Fuge 1,5 pt in der
Grundfarbe zwischen gestapelten Segmenten; Eigenmittel als Schraffur. Beschriftungen, die nicht in ihr Segment passen, werden
ausgeblendet und stehen in `ohneLabel: [{ reihe, i, wert }]`; wer den Wert braucht, setzt ihn als Form daneben.

### Flussdiagramm `D.fluss` (Folien 17 und 18, Muster 33)

PowerPoint kennt kein Flussdiagramm („Sankey“). `D.fluss` baut es aus nativen Formen: Knoten als schmale Rechtecke, Ströme als
Freihandformen mit kubischen Kurven. Die Stärke eines Stroms ist sein Betrag ÷ `massstab` (Einheiten je Zoll Höhe); zwei Diagramme
mit demselben Maßstab und denselben Lagen der Knoten lassen sich beim Blättern vergleichen.

```js
const d = D.fluss(s, { name: 'Flussdiagramm Finanzierung', massstab: 2500000, altText: 'Flussdiagramm: Gesamtkosten 7,0 Mio. €. …',
  knoten:  [{ id: 'zuschuss', x: 3.40, y: 3.20, name: 'Zuschuss', art: 'referenz' }, { id: 'gesamt', x: 6.50, y: 3.34, name: 'Gesamtkosten', wert: gesamt }, …],
  stroeme: [{ von: 'zuschuss', nach: 'gesamt', wert: zuschuss, art: 'referenz', name: 'Zuschuss' }, …] });
B.text(s, 'Zuschuss', { x: …, y: d.knoten.zuschuss.mitte - 0.22, … });      // beschriftet wird an den Lagen der Rückgabe
```

| Feld | Bedeutung |
|---|---|
| `name`, `altText` | Objektname des Rahmens (auf der Folie eindeutig) und Alternativtext des Diagramms: jeder Strom mit seinem Betrag (Pflicht). Ein Rahmen ohne Füllung und Linie trägt ihn; Bänder und Knoten gelten als Schmuck |
| `massstab` | Einheiten je Zoll Höhe (Pflicht). Auf den Folien 17 und 18 gemeinsam 68.000 € je Zoll (`folien/_fluss.cjs`; folgt der Größe des Modellhauses und ist dort von Hand gesetzt) |
| `knoten: [{ id, x, y, name, art, wert }]` | `x`, `y`: linke obere Ecke in Zoll. Die Höhe folgt aus den Strömen; `wert` ist eine Gegenprobe. An einem Knoten mit Zu- und Abflüssen müssen beide aufgehen, sonst bricht der Baustein ab |
| `stroeme: [{ von, nach, wert, art, name }]` | Reihenfolge = Stapelfolge an beiden Knoten, von oben. Ein Strom läuft von links nach rechts. Ströme mit dem Betrag 0 werden nicht gezeichnet |
| `arten` | Farbrollen (Vorgabe `FLUSSART`: `tinte`, `referenz`, `hell`, `blass`); eigene Rollen ergänzt man als `{ ...D.FLUSSART, name: { farbe, transparenz, kontur, linie, knoten } }` |
| `knotenBreite` 0,12 · `fuge` 0,02 · `spannung` 0,5 | Breite der Knoten, Abstand zwischen Knoten und Band, Lage der Kurvenpunkte (0,5: in der Mitte) |
| `linieBis` 1,5 · `mindestPt` 0,75 | Ströme unter `linieBis` Punkt Stärke stehen als Linie in ihrer wahren Stärke, mindestens `mindestPt` (auf Folie 17 der Mietausfall von 1.351 €) |

Rückgabe: `{ zoll(wert), knoten: { id: { x, y, w, h, wert, mitte, rechts, unten } }, stroeme: [{ …, x0, x1, y0, y1, h, alsLinie, pt }], rahmen }`.
Das Diagramm trägt keinen Text: Bezeichnungen und Beträge setzt das Modul in Leserichtung mit `B.text` und `B.bezeichnungMitWert`
(12 pt; jedes Textfeld braucht einen eigenen Namen, siehe Fallstrick 12). Geprüft ist das Bild in LibreOffice; Freihandformen und
Transparenz vor dem ersten Vortrag in PowerPoint ansehen.

## 7 · Assets (`assets/`, nur lesen)

`B.bild` und `B.icon` nehmen den Dateinamen; sonst `ctx.asset('name')`. Vorhanden: `ref-brauerstrasse.jpg` (1800 × 740) ·
`axo-hell.png` (Axonometrie, freigestellt, 190 : 165) · `grundriss-hell.png` (186 : 114) · `raster-brauerstrasse-rot.png` ·
`nordpfeil.png` · `logo-rot.png`, `logo-mark-rot.png` (liegen schon in den Layouts) · `qr-pgn.png` · `ui-<name>-<farbe>.png` ·
`pikto-neubau-mfh.png`, `pikto-eh40-neubau.png`, `pikto-modernisierung.png`, `pikto-inseln.png`, `pikto-bindungserwerb.png`,
`pikto-bindungsverlaengerung.png`, `pikto-weg-aufstockung.png`, `pikto-weg-ersterwerb.png` · `wert-<name>-weiss.png` (nur auf
Rot) · `bg-*.png` (Hintergründe der Layouts). Keine Bilder von anderswo, kein Logo auf Rot ohne weißes Feld.

## 8 · Vorlagen: die Folien selbst (`folien/`) und die Musterfolien (`probe/`)

Die 37 Folienmodule sind die besten Beispiele. Zum Nachschlagen: Diagramm mit Hauptzahl und zweiter Kennzahl `einstieg-baukosten`,
`ausgangslage-zinsen`, `einstieg-bestand` · feine Säulenpaare mit Maßkette je Paar `einstieg-baukosten` · feine Linien mit weicher
Fläche, Legende mit Werten und Werteblöcken an den Marken `ausgangslage-zinsen` · schmale gestapelte Säulen mit feiner Kontur, ohne
Achse und Gitter, mit senkrechter Maßkette, Zuleitungen und Tabelle `einstieg-kapitaldienst` · feine Säulen mit eigener Farbe je
Säule und Maßkette über die ganze Reihe `einstieg-bestand` ·
Achse mit großen Achskreisen und Register der Programmteile `agenda` · Flussdiagramm `rechnung-fluss-gefoerdert`, `rechnung-fluss-frei` ·
feine Säulenpaare mit Maßzeichen der Spanne `pgn-baukosten` · Vergleich `neu-seit-juli` · Säulen mit Marken `hoechstmiete` ·
Fördermix `foerdermix` · Zeitstrahl `eckdaten-zeitstrahl` · Balken mit Segmenttext und Rechenblatt `rechnung-finanzierung` ·
Rechenblatt `rechnung-jahr1` · Summen am Balken `rechnung-kapitaldienst` · Balkenpaar und Vergleichstabelle (Rechenweg der nötigen Miete) `rechnung-miete` ·
Linien mit Marken und Werten `rechnung-tilgung`, `rechnung-verlauf` · Säulen über einer Tabelle `rechnung-kosten` · Ablauf
`antragsweg` · Balkenplan und Bild `pgn-leistungen` · dichte Tabelle `anhang-programmteile` · Zeitleiste (Musterfolie 31) ·
Prüfliste und Ring `anhang-voraussetzungen` · Rechenblatt im Anhang mit Ergebniszeile in der Mitte, Spalten verschiedener Breite und
Annahmen daneben `anhang-rendite` · Quellenzeile im Schriftfeld `einstieg-baukosten`, `einstieg-bestand` (zwei Zeilen) · Quellentabelle mit
Hinweis-Kasten `quellen`.

Musterfolien für Layouts und Bausteine, die der Vortrag nicht braucht oder anders einsetzt (`node build.cjs --probe`):

| Brauche ich | Datei in `probe/` |
|---|---|
| Fördermix mit Maßkette und 80-%-Achse, frei auf `PGN_INHALT` | `02-inhalt-foerdermix.cjs` |
| gruppierte Säulen, Achskreise als Kategorien, waagerechte Marke, Quellenzeile im Schriftfeld (zwei Zeilen) | `03-diagramm-saeulen.cjs` |
| gestapelte Säulen auf Papier, Stempelzusatz | `04-diagramm-mr-stapel.cjs` |
| Jahresrechnung: Rechenblatt 12 pt mit roter Ergebniszeile, Notiz, Kommentar | `05-tabelle-mr-rechenblatt.cjs` |
| ein Balken mit Maßkette, Rechenblatt 14 pt, zwei Kennzahl-Kacheln | `06-inhalt-mr-finanzierung.cjs` |
| Vergleich alt → neu im Wortlaut der früheren Folie 9 (bis 13.11.2026; seither eine Tabelle), mit Fußzeile · auf Papier | `07-vergleich.cjs` · `08-vergleich-mr.cjs` |
| Kennzahlen im Layout · Folie 24 im Wortlaut mit Planlegende über zwölf Spalten | `09-kennzahlen.cjs` · `10-kennzahlen-mr.cjs` |
| Vorspann, Aufzählung, Achtung-Kasten, Verweis-Chip | `11-aussage.cjs` |
| allgemeine Tabelle über zwölf Spalten | `12-tabelle.cjs` |
| Ablauf mit acht Stationen und Warnband | `13-ablauf.cjs` |
| Zitat · Anthrazit mit Hero und Einheitenquadraten | `14-zitat.cjs` · `15-dunkel.cjs` |
| Abschnitt hell und rot · Titel · Schluss | `16-…`, `17-…` · `01-titel.cjs` · `19-schluss.cjs` |
| Anhang mit Bild, Bildecke, Konturstempel, Chips, Icons | `18-anhang-bild.cjs` |
| Linien mit Stricharten, Nulllinie, Achskreisen am Ende, Marke | `20-diagramm-mr-linien.cjs`, `26-diagramm-mr-verlauf.cjs` (35 Jahre) |
| lange Reihe: 127 Monate, Beschriftung je Jahr, Endwerte, zwei Marken | `32-diagramm-linien-monate.cjs` |
| Balkenpaar mit Kernwerten und Vergleichstabelle (7 + 5) | `21-inhalt-mr-balkenpaar.cjs` |
| Zeitstrahl mit Bändern, Maßkette, Höhenkote | `22-inhalt-zeitstrahl.cjs` |
| gruppierte Balken, Ring, Werte aus einer Datendatei | `23-anhang-balken-ring.cjs` |
| gestapelte Balken in Grautönen mit Summen am Ende | `24-diagramm-mr-kapitaldienst.cjs` |
| Säulen unter null, Tabelle passgenau unter den Säulen | `25-diagramm-mr-saeulen-tabelle.cjs` |
| Achsleiste in einer Reihe, Kasten, Zitat frei, Hero auf Rot | `27-inhalt-weitere-bausteine.cjs` |
| Balkenplan der Leistungsphasen im Wortlaut der Folie 27, Bild, Konturstempel | `28-inhalt-balkenplan.cjs` |
| Prüfliste und Ring mit direkter Beschriftung (Folie A2) | `29-anhang-pruefliste.cjs` |
| drei Spalten mit Kopf-Icon, eine als Signal, Aufzählungen 14 pt (Folie A3) | `30-anhang-gegenueberstellung.cjs` |
| Achtung-Kasten und Zeitleiste mit sechs Stichtagen (bis 13.11.2026 Folie A2, entfallen) | `31-anhang-zeitleiste.cjs` |
| Hinweiskasten am Diagramm und Stichpunkte rechts in 14 pt (G8, G9) | `34-diagramm-hinweis-stichpunkte.cjs` |
| Flussdiagramm aus nativen Formen: drei Quellen, ein Knoten, zwei Ziele, eigene Farbrolle, Alternativtext | `33-inhalt-mr-flussdiagramm.cjs` |

Bilder dazu: `dist/render/probe/folie-NN.png` und `uebersicht.png` (nach `node build.cjs --probe` und `werkzeug/render.cjs`).

## 9 · Was der Build prüft

Fehler brechen den Bau ab und nennen Folie und Form; Hinweise stehen in der Ausgabe und brechen nicht ab.

| Prüfung | Regel |
|---|---|
| Passprüfung der Bausteine | Texte gegen Breite und Höhe ihres Felds (Titel, Kicker, Kennzahlen, Tabellenköpfe, Werte im Rechenblatt, Planlegende, Marken, Quellenzeile im Schriftfeld …), Mindestgröße je Rolle, Zeichen, die in den Schriften fehlen. Fehler, sobald ein Text höher ist als sein Feld (das Zeilenmaß rechnet 2,5 % Zuschlag für LibreOffice schon ein); Hinweis, wenn in einem mehrzeiligen Feld fester Höhe weniger als 5 % Luft bleiben |
| Pflichtmaße | Fehlt einem Baustein `x`, `y`, `w` oder ein anderes Pflichtfeld, bricht er ab. `B.planlegende`, `B.aufzaehlung` und `B.text` rechnen die Höhe selbst, wenn `h` fehlt |
| Zonenprüfung (alle Formen, auch aus direkten Aufrufen von pptxgenjs) | Lage und Größe sind Zahlen; die Form liegt auf der Folie; auf Inhalts- und Anhangfolien im Satzspiegel (0,667 bis 12,667), unten bis y 6,50, oben ab y 1,90 (Anhang 1,50). Bei einzeiligem freiem Text zählt die Breite der Schrift, nicht die des Textfelds. Ausnahmen über den Namen: `Abschnitt im Kopf`, `Daumenregister…`, `Schlüsselplan…`, `Stempel…`; 0,08 Überstand für `Maßkette`, `Maßstrich`, `Maßhilfslinie`, `Beschnittmarke…`. Die Form `Quellenzeile` (`B.quelle`) liegt im Schriftfeld: Für sie gilt das freie Feld von x 2,40 bis zur Blatt-Zelle (12,03) in der Höhe des Schriftfelds (y 6,72 bis 7,20). Weitere Ausnahme: `ctx.zoneAusnahme('Objektname', 'Grund')` |
| Namen | Jede Form trägt einen `objectName` (die Bausteine setzen ihn) |
| Schrift | nur `F.*`, keine Größe unter 10 pt, auch in Läufen und Tabellenzellen |
| Text | kein „undefined“ und kein „NaN“ auf der Folie |
| Platzhalter | nur Platzhalter, die das Layout hat |
| pptxgenjs | jede Warnung von pptxgenjs gilt als Fehler |
| Nachbearbeitung | ungültige Farben und Stricharten, Werkzeugnamen in der Datei; Reihen, deren Strichart, Beschriftungsfarbe oder Kontur je Datenpunkt nicht ankam; eine Fläche unter einer Linie, die sich nicht anlegen ließ; Schriften außerhalb des Planwerks in Folien, Layouts, Master und Diagrammen; doppelte Form-IDs; Layouts und Platzhalter ohne Beschreibung; Tabellen, die der Bau nicht gemeldet hat |

Die Nachbearbeitung (`lib/nachbearbeitung.cjs`, Schritte im Kopf der Datei) richtet, was pptxgenjs nicht oder nicht schema-gerecht
schreibt: Form-IDs je Folie fortlaufend (Tabellen bekämen sonst die ID einer anderen Form); Platzhalter der Layouts mit
Innenabstand, Anker, festen Nummern und lesbaren Layoutnamen; Diagramme nach Schema (`grouping` im Liniendiagramm, Reihenfolge von
`marker`, `dPt`, `dLbls` und `tickLblSkip`, keine dritte Achsen-ID); die Fläche unter einer Linie (`D.linien` mit `flaeche`: Flächenreihe mit
Verlauf, beide Enden mit derselben Deckung, weil LibreOffice einen Verlauf mit zwei Deckungen in ein Rasterbild umrechnet); die Kontur je
Datenpunkt feiner Säulen mit eigener Farbe je Säule (`D.saeulen` mit `arten` und `fein`: Die Linie der Reihe steht an jedem `c:dPt`;
bleibt einer ohne, bricht der Bau ab); Segmente ohne Höhe in feinen gestapelten Säulen ohne Füllung und ohne Linie; eingebettete Arbeitsmappen mit 0 statt leerer Zelle und
richtigem Tabellenbereich; Alternativtexte an Formen (`B.altText`, `D.fluss`: genau eine Form je Name, sonst Abbruch); Formen ohne Text
und ohne Alternativtext als dekorativ; Tabellen mit Kennung der Kopfzeile oder
Kopfspalte (die Bausteine melden sie über `kx.tabelle`) und der Formatvorlage „keine“; keine Notizseiten (pptxgenjs legt zu jeder Folie eine leere an; sie entfallen samt Beziehung und Inhaltstyp, der Notizmaster bleibt als Vorlage);
`[Content_Types].xml` mit `image/jpeg` und ohne Einträge für fehlende Teile; festes Datum, Abschnitts-IDs aus dem Namen.
Die Liste der Notizmaster in `ppt/presentation.xml` bleibt hinter der Folienliste, wie pptxgenjs sie schreibt: Notiz- und
Folienmaster teilen sich ein Theme, und PowerPoint lehnt die Reihenfolge des Schemas dann ab.
Sie trägt außerdem die verwendeten Schriften, den Namen des Themes, die Folientitel, das Format „Breitbild“ und die Zahl der Wörter
und Absätze in die Dateieigenschaften ein (`docProps/app.xml`). Nach dem Bau prüft `pruefe_folien.py` die fertige Datei von außen: Aufbau, Kopf und Schriftfeld, keine Sprechernotizen, Schriftgrößen,
verbotene Wörter, Gedankenstriche und jede Zahl gegen `daten/werte.json`, die Datendateien und `daten/pruefung.json`.

## 10 · Fallstricke

1. **Die Prüfung bricht den Bau ab** und nennt Folie und Text. Dann kürzen, anders brechen, Feld vergrößern oder eine
   kleinere zulässige Stufe wählen; nie unter die Mindestgrößen gehen. `--trotzdem` nur zum Ansehen.
2. **Platzhalter gewinnen.** Lage, Größe und Schrift eines Platzhalters lassen sich beim Füllen nicht überschreiben, nur je
   Textlauf (die Bausteine tun das, wo `pt` wählbar ist). Platzhalter deshalb über die Bausteine füllen; Text, den man
   direkt mit `s.addText(…, { placeholder })` setzt, prüft niemand auf Länge.
3. **Diagramm im Layout `PGN_DIAGRAMM(_MR)`:** ohne Lage aufrufen. Wer eine andere Höhe braucht (Tabelle oder Zeile unter dem
   Diagramm), gibt `x, y, w, h` an; der leere Platzhalter verschwindet in der Nachbearbeitung (Muster 25).
4. **pptxgenjs verändert Optionsobjekte.** Wer `s.addText` oder `s.addShape` direkt ruft, baut je Aufruf ein neues Objekt,
   setzt `margin: 0` und einen `objectName` (ohne Namen bricht der Bau ab; `isTextBox` setzt der Build bei freien
   Textfeldern selbst). `margin` an Textfeldern zählt in Punkt, an Tabellen in Zoll. Absatzoptionen (`paraSpaceAfter`,
   `lineSpacing`, `bullet`) gehören an alle Läufe eines Absatzes gleich; sonst gilt die des ersten Laufs, und der Build
   nennt die Stelle.
5. **Reihenfolge in Diagrammen:** immer Lesereihenfolge (Abschnitt 6). Stricharten nur über `strich` je Reihe, nie `lineDash`.
6. **Keine Zahl mit Aussage von Hand.** Werte, Maßkettentexte, Markenwerte und Texte wie „20 %“ kommen aus `W` oder `X` und
   `fmt`. Achsgrenzen, Schritte, Lagen und Maße dürfen als Zahlen im Modul stehen.
7. **E5:** keine Renditen, kein DSCR, keine Marktmiete des Modellhauses, kein „Safe Harbour“. Der Lauf `modellhaus_dscr125`
   und die Schlüssel `dscr.ziel` und `zr.dscr.*` erscheinen nicht; `dscr.kapitaldienst_jahr1.*` und `dscr.noetige_miete.*`
   sind erlaubt (Kapitaldienst und nötige Miete bei Überschuss null). **Eine Ausnahme** auf Wunsch des Auftraggebers (11.11.2026):
   Die Anhangfolie A6 (`anhang-rendite`) zeigt die Eigenkapitalrendite über 35 Jahre und nennt die Marktmiete, als Paar „mit Restwert“
   und „ohne Restwert“ mit dem Restwertanteil, wie die Rechenmappe es verlangt (ihre Lesart „nur Bodenwert“ rechnet beim Modellhaus ohne
   Restwert, weil das Grundstück nicht angesetzt ist; das Modul prüft Eingabe 2.3 = 0). Marktmiete und Liegenschaftszins gelten für Neu Wulmstorf;
   ihre Herkunft steht in `daten/rechnung.json` (Block `marktwerte`), die Annahmen der Folie nennen Wert und Herkunft. Ihre Werte stehen im Lauf `modellhaus_rendite`
   (`daten/werte_aus_vofi.py`: Katalog `katalog_rendite`, benannte Ausnahme `anhang_rendite` von der Sperrliste). Der Bau gibt den Lauf
   nur dieser Folie frei, `pruefe_folien.py` lässt „Rendite“ und „Marktmiete“ nur dort zu und nimmt die Zahlen des Laufs nur dort als
   Beleg. Für alle anderen Folien gilt E5 unverändert.
8. **Modellrechnung:** `_MR`-Layouts stehen auf Papierton, das Wort steht im Kopf (Abschnittsname), kein Stempel im Kopf (Schalter `STEMPEL_IM_KOPF`). `B.schluesselplan` ist dort gesperrt, die Programmnummer trägt `B.register`.
9. **Zeilenabstand im Bild:** LibreOffice setzt Text gut 2 % höher als die Schriftmetrik; die Prüfung rechnet das ein.
   Felder nicht bis auf die letzte Zeile füllen: Unter 5 % Luft gibt der Build einen Hinweis.
10. **Achskreise an Achsenden** ragen um ihren halben Durchmesser über die Achse (M 0,20, L 0,23). Zeitstrahl und Leisten
    entsprechend kürzer ansetzen; die Zonenprüfung meldet es sonst.
11. **Schriften:** Die Mappe bettet keine Schriften ein. Für den Vortrag die Dateien aus `fonts/` installieren oder das PDF zeigen.
12. **Namen kleiner Texte:** `pruefe_folien.py` zählt Formen, deren Name mit „Text“, „Untertitel“, „Kommentar“ oder „Planlegende“
    beginnt, als Fließtext (Work Sans mindestens 14 pt). `B.text` ohne `name` heißt „Text (rolle)“. Jede 12-pt-Beschriftung braucht
    deshalb einen eigenen Namen („Ziel Tilgung“, „Register 2.2 Name“, „Notiz zum Diagramm“).
13. **Zahlen der neuen Folien binden:** Eine Zahl, die das Modul rechnet (Anteil, Veränderung, Kapitaldienst je m²), braucht ihre Formel
    in `daten/pruefung.json` und, wenn sie eine Aussage trägt, einen Eintrag in `KERNWERTE`, `KERNWERTE_MARKT` oder `KERNSAETZE`
    am Anfang von `pruefe_folien.py`; sonst belegt sie womöglich nur ein zufällig gleicher Wert aus `werte.json`. Diese drei Listen
    fragen nur, ob der Wert auf der Folie steht. Steht er dort mehrfach oder als Textfeld neben einer Bezeichnung in einem anderen
    Textfeld (Werte über Säulen, Legende und Werteblöcke der Folie 4, Maßkettenwerte, Tabellenzellen), gehört er zusätzlich in
    `KERNWERTE_FORM`: Die Form mit diesem Namen oder die Tabellenzelle (Zeile, Spalte) trägt genau diesen Text. Deshalb bekommt jeder
    Wert am Diagramm einen sprechenden Namen („Wert Herstellung PGN“, „Marke 1 Wert 10 Jahre“). Zeitreihen in Diagrammen stehen als
    Ganzes in `REIHEN_DIAGRAMM` (jeder Wert an seiner Stelle gleich der Datendatei), einzelne Stützpunkte in `KERNWERTE_DIAGRAMM`;
    ein Nullwert heißt dort „0 * 1“, weil eine bloße „0“ als Schlüssel der Rechenmappe gelesen würde. Ein Eintrag in
    `daten/pruefung.json` mit `"nur_folie": "<id>"` belegt nur Zahlen dieser Folie (gerundete Renditen der Folie A6).
14. **Schriftfeld:** Außer Rubrik und Blattnummer steht dort nur die Quellenzeile, und nur über `B.quelle`. Die Prüfung von Kopf und
    Schriftfeld in `pruefe_folien.py` liest die Formen „Kicker“, „Abschnitt im Kopf“ und „Rubrik“ gegen den Kicker des Konzepts
    („ABSCHNITT · THEMA“); die Quellenzeile prüft sie gegen `daten/markt.json` (`QUELLENZEILEN`).
15. **Keine Sprechernotizen:** kein `slide.addNotes`, kein Feld `notizen` im Konzept. `pruefe_folien.py` meldet beides. Was das Publikum
    wissen muss, steht auf der Folie; Quellen stehen im Feld `quellen` des Konzepts und auf A8.
16. **Titel mit Zahlen:** aus `W` und `fmt` bauen und mit `ctx.titelzeilen` gegen das Konzept prüfen (Folien 15 bis 18), oder den Titel aus
    dem Konzept nehmen und im Modul gegen die Mappe prüfen (Folien 19, 21, 23). Nie eine Zahl fest in eine Titelzeile schreiben.
17. **Untertitel eines Diagramms zu lang:** nicht kürzen und nicht verkleinern. `B.diagrammkopf` mit `sub: [zeile1, zeile2]` aufrufen und
    Legende und Diagramm mit der Rückgabe (`legende`, `chart`) in freier Lage setzen (bis 13.11.2026 Folie 5). Sagt die zweite Zeile nur, was ein Modul
    der Folie schon sagt, entfällt sie: Die Legende bleibt dann auf der Höhe der übrigen Diagrammfolien (Folie 22).
