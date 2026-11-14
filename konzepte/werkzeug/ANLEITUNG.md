# Entwurfswerkzeug: Folienentwürfe in der Gestaltung des Vortrags

Mit diesem Werkzeug baut jedes Team Folienentwürfe, die genauso aussehen wie der Vortrag: Planrahmen, Kopf mit Zeichen und Name des
Abschnitts, Titel mit Signaturwort, Schriftfeld mit Thema und Blatt, Papierton der Modellrechnung, native Diagramme und Tabellen. Theme,
Layouts, Bausteine, Diagramme und alle Prüfungen kommen aus `praesentation/lib` und werden nur gelesen. Der Ordner `praesentation/`
bleibt unverändert.

| Datei | Zweck |
|---|---|
| `entwurf.cjs` | baut aus einem Ordner mit Folienmodulen eine pptx und schreibt daneben die Belege aller Zahlen (`<name>.belege.json`) |
| `rendern.sh` | rendert die pptx zu PDF und PNG je Folie (1600 px breit) über `praesentation/werkzeug/render.cjs`, prüft danach das Schema und Schrift, Rollen und Sprache |
| `pruefe_entwurf.py` | Prüfung der fertigen pptx von außen (auch einzeln aufrufbar) |
| `beispiel/` | eine Beispielfolie: Säulendiagramm, Tabelle, Hinweiskasten, Stichpunkte, Zahlen über `ctx.wert`, Wortlaut in `konzept.json` |

## 1 · Schnellstart

```bash
W=/home/user/NBank/konzepte/werkzeug
mkdir -p /home/user/NBank/konzepte/<team>/.lohome
node $W/entwurf.cjs /home/user/NBank/konzepte/<team>/folien /home/user/NBank/konzepte/<team>/dist/entwurf.pptx
$W/rendern.sh /home/user/NBank/konzepte/<team>/dist/entwurf.pptx /home/user/NBank/konzepte/<team>/dist/render --home /home/user/NBank/konzepte/<team>/.lohome
# Bilder ansehen: dist/render/folie-01.png …, Übersicht: dist/render/uebersicht.png, PDF: dist/render/entwurf.pdf
```

Das Beispiel nachbauen: `node $W/entwurf.cjs $W/beispiel $W/beispiel/dist/beispiel.pptx` und
`$W/rendern.sh $W/beispiel/dist/beispiel.pptx $W/beispiel/dist/render --home <eigener Ordner>/.lohome`.

**LibreOffice läuft bei mehreren Teams gleichzeitig.** Jeder Aufruf von `rendern.sh` bekommt deshalb mit `--home` einen eigenen Ordner
(etwa `konzepte/<team>/.lohome`; vorher anlegen, am Ende löschen). Ohne `--home` legt das Skript einen Zwischenordner im Zielordner an und
löscht ihn danach. `entwurf.cjs` selbst startet kein LibreOffice.

Optionen von `entwurf.cjs`:

| Option | Wirkung |
|---|---|
| `--nur id1,id2` | nur diese Folien des Ordners |
| `--werte datei.json` | Zahlenquelle für `ctx.wert` (Vorgabe: `<ordner>/werte.json`, sonst `konzepte/mappe/werte_konzepte.json`) |
| `--ohne-wortlaut` | Wortlautprobe ganz aus |
| `--titel "Name"` | Titel der Mappe in den Dateieigenschaften |
| `--trotzdem` | schreibt die Datei auch bei Fehlern der Prüfung (nur zum Ansehen; Rückgabewert bleibt 1) |

Optionen von `rendern.sh`: `--home <ordner>`, `--ohne-pruefung`. Umgebung: `PYTHON` (Vorgabe `python3`), `VALIDATE` (Pfad zu `validate.py`;
ohne Angabe sucht das Skript die Prüfung der pptx-Werkzeuge unter `/root/.*/skills/`), `SOFFICE` (Pfad zu `soffice`).

## 2 · Ordner eines Teams

```
konzepte/<team>/folien/
  01-annahmen.cjs      ein Modul je Folie; Reihenfolge = Dateiname (01-, 02-, … oder 01a-)
  02-liquiditaet.cjs
  _hilfen.cjs          Dateien mit „_“ am Anfang sind Hilfsdateien und keine Folien
  konzept.json         wahlfrei: Wortlaut und Rahmen je Folie (Abschnitt 4)
  werte.json           wahlfrei: eigene Zahlenquelle des Teams (sonst konzepte/mappe/werte_konzepte.json)
```

## 3 · Ein Folienmodul

```js
'use strict';
module.exports = {
  id: 'liquiditaet',                                   // eindeutig im Ordner
  o: {                                                 // Rahmen der Folie (alles außer titel wahlfrei)
    nr: '16',                                          // Blatt im Schriftfeld (Vorgabe: laufende Nummer)
    abschnitt: 'Modellrechnung',                       // Name im Kopf; Zeichen 1 bis 4 wie im Vortrag, Anhang „A“, sonst o.zeichen
    layout: 'PGN_DIAGRAMM_MR',                         // Layout des Vortrags (Abschnitt 5)
    kicker: 'MODELLRECHNUNG · LIQUIDITÄT',             // „ABSCHNITT · THEMA“: Abschnitt im Kopf, Thema im Schriftfeld
    titel: ['Zeile 1 des Titels', 'Zeile 2 mit Zahl'], // Inhaltsfolien genau zwei Zeilen, 32 pt, höchstens 11,6 Zoll je Zeile
    akzent: 'Zahl',                                    // Signaturwort: genau eine Wortgruppe, rot und kursiv
    quellen: 'Quelle: Rechenmappe v3, Kopie mit neuen Blöcken, Blatt …',
  },
  bau(ctx) {
    const { B, D, fmt, colX, span, Y, ZONE, wert } = ctx;
    const ueA = wert('liq.ueberschuss.A');             // Zahl aus der JSON-Datei, mit Blatt und Zelle in den Belegen
    const titel = fmt.euro(ueA);
    const s = ctx.folie(ctx.titelzeilen(['Zeile 1 des Titels', `in A bleiben ${titel}`], titel));   // Titel mit Zahl: aus den Werten bauen
    // … Inhaltszone bauen (Abschnitt 6 und 7)
  },
};
```

`ctx.folie(opt)` legt die Folie an und muss genau einmal laufen. Optionen überschreiben `o`: `titel`, `akzent`, `kicker`, `rubrik`
(Thema im Schriftfeld), `kopfzeichen: false`, `titelAbstand`; auf Trennern `nr` (Achskreis) und `lead`; auf Titel und Schluss `untertitel`.

Wichtige Felder von `ctx`:

| Feld | Inhalt |
|---|---|
| `ctx.wert(schluessel, datei?)` | Zahl aus einer JSON-Datei (Abschnitt 4). `ctx.wert.eintrag(…)` liefert den ganzen Eintrag (`wert`, `einheit`, `blatt`, `zelle`, …), `ctx.wert.zelle(…)` „Blatt!Zelle“, `ctx.wert.reihe(schluessel, von, bis)` einen Ausschnitt einer Zeitreihe |
| `ctx.W(lauf, schluessel)`, `ctx.W.reihe(…)` | Zahlen des heutigen Vortrags (`praesentation/daten/werte.json`, nur lesen; alle Läufe frei, auch `modellhaus_rendite`) |
| `ctx.fmt` | Formatierer: `zahl`, `dez`, `euro`, `euroDez`, `mio`, `prozent`, `prozentWert`, `euroJeQm`, `qm`; geschützte Leerzeichen und Minus U+2212 setzen sie selbst |
| `ctx.B`, `ctx.D` | Bausteine und Diagramme des Vortrags, auf den Grund der Folie eingestellt |
| `ctx.colX(k)`, `ctx.span(n)`, `ctx.Y`, `ctx.ZONE` | Raster: zwölf Spalten, `colX(1)` = 0,667, Breiten `span(5)` 4,86 · `span(7)` 6,90 · `span(12)` 12,00; Inhaltszone y 2,10 bis 6,50 (Anhang ab 1,50) |
| `ctx.wortlaut(text, was)` | Wortlautprobe gegen `konzept.json` (Abschnitt 4); gibt den Text zurück |
| `ctx.titelzeilen(zeilen, akzent)` | Titel mit Zahlen; prüft gegen „Titelzeilen“ in `konzept.json`, wenn vorhanden |
| `ctx.pruefe(bedingung, meldung)` | Aussage gegen die Zahlen prüfen („A liegt vorn“, „kein Jahr mit Fehlbetrag“); bricht den Bau ab, wenn sie nicht stimmt |
| `ctx.gleich(was, a, b, nk)` | Gegenprobe zweier Zahlen auf `nk` Stellen |
| `ctx.zoneAusnahme(name, grund)` | eine Form mit Absicht außerhalb der Inhaltszone (selten) |
| `ctx.lib(name)`, `ctx.vortrag(name)` | Module aus `praesentation/lib` (etwa `passpruefung` für `breite`) und Hilfsdateien des Vortrags (`_rechnung`: `R.G`, `R.pruefe`, `R.linienReihen`, `R.linienLegende`), nur lesen |
| `ctx.breite(text, stil)` | Breite eines Textes in Zoll (Schriftmetrik des Vortrags) |

Aus eigenen Hilfsdateien: `const { lib, vortrag } = require('/home/user/NBank/konzepte/werkzeug/entwurf.cjs');`

## 4 · Zahlen und Wortlaut

**Zahlen.** Jede Zahl kommt aus einer Datei, nie von Hand ins Modul (Achsgrenzen, Lagen und Maße ausgenommen). `ctx.wert` liest die
Datei unabhängig von ihrem Aufbau: flach (`{ "schluessel": 12.3 }` oder `{ "schluessel": { "wert": 12.3, "blatt": "…", "zelle": "…" } }`),
verschachtelt über Punktpfade, unter `werte`, oder im Aufbau von `praesentation/daten/werte.json` mit Läufen (`"lauf:schluessel"`; ohne Lauf
muss der Schlüssel eindeutig sein). Fehlt ein Schlüssel, nennt die Meldung ähnliche Schlüssel. Fehlt die Datei noch (die gemeinsame Datei
`konzepte/mappe/werte_konzepte.json` entsteht parallel), bricht der Bau mit einer klaren Meldung ab; bis dahin `--werte` oder `<ordner>/werte.json`.

Nach jedem Bau steht neben der pptx `<name>.belege.json`: je Folie jede gelesene Zahl mit Datei, Schlüssel, Wert, Einheit, Blatt und Zelle.
Daraus lassen sich die Angaben „Blatt und Zelle“ des Konzepts übernehmen. Der Bau meldet, wie viele Zahlen ohne Blatt und Zelle sind.

**Gerechnete Größen** (Verhältnis, Summe, Differenz) rechnet das Modul aus Werten der Datei und schreibt die Formel als Kommentar dazu.
Wo die Mappe die Größe selbst führt, gehört sie aus der Mappe gelesen, nicht nachgerechnet; sonst zeigt `ctx.gleich` die Gegenprobe.

**Wortlaut.** Ohne Text im Feld `inhalt` ist die Wortlautprobe aus (der Bau sagt es als Hinweis). Wer den abgestimmten Wortlaut festhalten will,
legt `konzept.json` an. Jede Angabe dort gewinnt gegen `o` im Modul:

```json
{ "liquiditaet": { "kicker": "MODELLRECHNUNG · LIQUIDITÄT",
    "inhalt": "Titelzeilen: „Zeile 1“ | „Zeile 2“ (Signaturwort: „…“). Hinweiskasten: „…“. Stichpunkte unter „Annahmen“: „…“ · „…“." } }
```

Dann prüft `ctx.wortlaut(text)` jeden Text gegen dieses Feld (Groß- und Kleinschreibung, Fettmarken und geschützte Leerzeichen zählen nicht).

## 5 · Layouts

| Layout | Grund | Wofür |
|---|---|---|
| `PGN_INHALT_MR` · `PGN_INHALT` | Papier · weiß | frei gebaute Folie (Diagramm und Tabelle nebeneinander, Rechenblatt, drei Schritte) |
| `PGN_DIAGRAMM_MR` · `PGN_DIAGRAMM` | Papier · weiß | Diagramm über sieben Spalten, rechts fünf Spalten Stichpunkte: `B.diagrammkopf`, Diagramm ohne Lage, `B.stichpunkte({ platzhalter: 'kommentar' })` |
| `PGN_TABELLE_MR` · `PGN_TABELLE` | Papier · weiß | Tabelle über acht Spalten (`B.tabellenkopf`, Tabelle ab `ZONE.tabelle.tabelle`), rechts vier Spalten Stichpunkte |
| `PGN_KENNZAHLEN_MR` | Papier | drei Kennzahlen (`B.kennzahlFeld(s, 0..2, …)`), darunter ab y 4,70 frei |
| `PGN_VERGLEICH_MR` | Papier | zwei Seiten gegenüber (`B.vergleichFeld`), symmetrisch |
| `PGN_ANHANG` | weiß | einzeiliger Titel (`o.titel` als Text), Inhaltszone ab y 1,50 |
| `PGN_ABSCHNITT` | weiß | Trenner (`ctx.folie({ nr, lead })`), bis drei Titelzeilen |
| `PGN_AUSSAGE`, `PGN_ABLAUF`, `PGN_ZITAT`, `PGN_TITEL`, `PGN_SCHLUSS` | | wie im Vortrag (`praesentation/lib/API.md`, Abschnitt 3) |

Folien der Modellrechnung stehen auf Papierton (`_MR`). Das Daumenregister `B.register(s, '2.1')` tragen dort alle Inhaltsfolien des Vortrags.

## 6 · Bausteine, die Entwürfe fast immer brauchen

Vollständige Liste mit allen Maßen: `praesentation/lib/API.md`, Abschnitt 5. Beispiele: die Module in `praesentation/folien/`
(Abschnitt 8 der API) und `beispiel/01-beispiel.cjs`.

- **Modulkopf** `B.modulkopf(s, { x, y, w, titel, sub })`: Linie, Titel in Montserrat Bold 16 pt, Untertitel mit Einheit. Rückgabe: y für den
  Inhalt. Für frei gebaute Folien auf der Höhe `ZONE.diagramm.kopf`, damit der Kopf beim Blättern nicht springt.
- **Hinweiskasten** (G8) `B.hinweis(s, { x, y, w, text, unten: true, name })`: grauer Kasten mit Info-Symbol, Work Sans Light 12 pt, so breit
  wie das Diagramm oder die Tabelle, direkt daran. Erst `B.hinweisHoehe(text, { w })` holen, dann das Diagramm um Höhe plus 0,12 niedriger
  setzen. Höchstens 200 Zeichen. Kein anderer kleiner, frei hängender Text.
- **Stichpunkte rechts** (G9) `B.stichpunkte(s, { x, y, w, linie: true, gruppen: [{ titel, punkte: [] }] })` oder mit `platzhalter: 'kommentar'`:
  Überschrift wie ein Modultitel, Stichpunkte fest in 14 pt. Passt es nicht, Abstände enger (`titelAbstand`, `punktAbstand`), Spalte breiter oder
  kürzen; nie kleiner.
- **Text** `B.text(s, text, { x, y, w, rolle, name })`: Rollen `dicht` (14 pt, Fließtext), `kleinText` (12 pt, nur Zusätze), `modultitel`,
  `wert`, `kernwert`, `bezeichnung`. `**fett**` setzt Work Sans SemiBold. Jede kleine Beschriftung braucht einen eigenen Namen, der nicht mit
  „Text“ beginnt (sonst gilt sie als Fließtext).
- **Tabellen** (nativ): `B.tabelle(s, { x, y, w, pt: 12 | 14, spalten: [{ kopf, breite, art: 'text' | 'zahl' | 'stichwort' }], zeilen })`;
  Zelle als Text oder `{ text, fett, farbe }`, Zeile auch `{ zellen, trennlinie: true, flaeche: true }`. Rechenblatt mit Nummern, Rechenzeichen
  und roter Ergebniszeile: `B.rechenblatt(s, { kopf: ['Position', { kreis: 'A' }, …], zeilen: [{ nr, zeichen, text, werte, art: 'summe' | 'ergebnis' | 'notiz' }] })`.
  Gefördert gegen frei finanziert: `B.vergleichstabelle` (gefördert vor frei finanziert).
- **Kennzahlen**: `B.kennzahl(s, { x, y, w, vorsatz, zahl, einheit, label, text })` (44 pt, `gross` 60 pt). Derselbe Wert steht auf einer
  Folie nur einmal groß.
- **Beschriftung an Diagrammen**: `B.legende`, `B.achsentitel(s, d, { y, x })` (Pflicht bei bezifferter Achse), `B.achstexte(s, d)`,
  `B.linienenden`, `B.wertzeilen`, `B.marke`, `B.markeMitLuecken`, `B.textAufPlot`, `B.punkt`.

## 7 · Diagramme (nativ, in PowerPoint editierbar)

`achse: { min, max, schritt, format }` ist Pflicht. Ohne `x, y, w, h` steht das Diagramm im Platzhalter von `PGN_DIAGRAMM(_MR)`. Kein Titel
und keine Legende im Diagramm selbst: Kopf über `B.diagrammkopf` oder `B.modulkopf`, Legende über `B.legende`.

| Funktion | Wofür |
|---|---|
| `D.linien(s, { kategorien, reihen: [{ name, werte, art, strich }], achse, katLabels: { formen: [1, 5, 10, …, 35] } })` | Zeitverlauf über 35 Jahre; mit `B.achstexte(s, d)` für die Jahre. Bis vier Reihen unterscheidbar über Farbe und `strich` (`solid`, `dash`, `sysDash`) |
| `D.saeulen`, `D.gruppierteSaeulen`, `D.stapelSaeulen` | Vergleich je Variante, Jahreswerte unter null (`D.saeulen`, die Nulllinie ist kräftig) |
| `D.stapelBalken`, `D.gruppierteBalken`, `D.balkenpaar` | Finanzierung, Kapitaldienst, gefördert gegen frei finanziert |
| `D.fluss` | Flussdiagramm aus nativen Formen (was hereinkommt, was hinausgeht) |
| `D.ring` | Anteile |

Reihenarten (Farbe): `tinte` (Aussage, gefördert), `referenz` (frei finanziert, Markt, Vergleich), `zuschuss` (Rot, nur Zuschuss), `darlehen`,
`eigenmittel` (Schraffur), `bisher`, `A`, `B`, `C` (Gruppentöne). Nie `darlehen` und `tinte` als zwei Reihen in einem Diagramm. Kein weiteres
Rot im Diagramm der Modellrechnung: Dort bedeutet Rot den Zuschuss. Rückgabe jeder Funktion: `plot`, `xWert`/`yWert`, `katMitte`, damit sich
Marken und Werte als Formen passgenau setzen lassen.

## 8 · Was geprüft wird

Beim Bau (`entwurf.cjs`, dieselben Prüfungen wie der Vortrag): Titel (Zeilenzahl, Breite, Signaturwort), Kopf und Schriftfeld, jeder Text
gegen Breite und Höhe seines Felds, Mindestgrößen je Rolle, nur Montserrat und Work Sans, keine Größe unter 10 pt, jede Form im Satzspiegel
und in der Inhaltszone (bis y 6,50), Namen aller Formen, Platzhalter des Layouts, Warnungen von pptxgenjs, Nachbearbeitung (Diagramme nach
Schema, Alternativtexte, Tabellen gekennzeichnet). Fehler brechen ab und nennen Folie und Text.

Nach dem Rendern (`rendern.sh`): Schemaprüfung der Datei (`validate.py`) und `pruefe_entwurf.py`: Schriften auch in Diagrammen, Tabellen
mindestens 12 pt, Hinweiskasten in Work Sans Light 12 pt, Stichpunkte 14 pt, Fließtext mindestens 14 pt, kein Gedankenstrich als Einschub,
kein „undefined“ oder „NaN“, Alternativtext an jedem Diagramm, keine Sprechernotizen, keine Werkzeugnamen und keine Pfade aus Arbeitsordnern
in der Datei; Hinweise bei „Baukosten“, „nötige Miete“, „Förderregeln“ und „Annuität“ ohne „jährliche Annuität über 30 Jahre“.
`python3 pruefe_entwurf.py datei.pptx --text` listet dazu den Text jeder Folie.

Nicht geprüft und nur im Bild zu sehen: Überlagerungen von Formen untereinander, Datenbeschriftungen, die sich berühren, Abstände.
**Jedes Bild ansehen.**

## 9 · Regeln, die das Werkzeug nicht für Sie prüft

- Ein Thema je Folie. Vergleiche symmetrisch: beide Seiten dieselben Merkmale in derselben Reihenfolge.
- Kurze Sätze, keine Gedankenstriche, für dieselbe Sache immer dasselbe Wort, kein Werbeton. Begriffe: „Herstellungskosten“,
  „kostendeckende Anfangsmiete“, „jährliche Annuität über 30 Jahre“, „Förderkonditionen“.
- Rot nur für Titellinie, Signaturwort, Zuschuss in Daten, Ergebniszeile und höchstens eine hervorgehobene Kennzahl je Diagramm.
- Liegt frei finanziert bei einer Kennzahl vorn, gehört das auf die Folie, mit den Annahmen und dem Risiko dazu.
- Die Prüfung `praesentation/pruefe_folien.py` gilt für den ganzen Vortrag und verbietet dort noch „DSCR“, „Rendite“ und „Marktmiete“
  außerhalb von A6. Für die Konzepte ist diese Sperre aufgehoben; sie läuft auf Entwürfe nicht.

## 10 · Fallstricke

1. **Tabellenköpfe stehen in Versalien** und sind breiter, als der Text im Modul aussieht („ÜBERSCHUSS“ braucht bei 12 pt gut 1,3 Zoll).
   Die Passprüfung meldet es; Spalte breiter oder Kopf mit `\n` in zwei Zeilen.
2. **Datenbeschriftungen über Säulen** dürfen nicht breiter sein als die Säule plus Lücke. Sechsstellige Beträge überlappen; dann in
   Tsd. € zeigen (Werte ÷ 1.000, Untertitel und Achsentitel „in Tsd. € p. a.“) oder `labels: false` und Werte als Formen setzen.
3. **Senkrechter Achsentitel** braucht links Platz: `rand: { l: 0.80 }` bei Säulen, bei Linien mit sechsstelligen Werten ab 1,02.
4. **Inhaltszone endet bei y 6,50.** Stichpunkte, die einen Hauch zu lang sind, bricht die Zonenprüfung ab: kürzen oder Abstände enger.
5. **Doppelpunkt am Zeilenende eines Titels** vermeiden; die erste Titelzeile endet besser mit einem Wort.
6. **Abschnitte hängen zusammen.** Kommt derselbe Abschnitt nach einem anderen wieder, bricht der Bau ab (Dateien umbenennen).
7. **Schlüssel in mehreren Läufen:** `ctx.wert('jr1.zahlungsueberschuss.A')` ist in einer Datei mit Läufen mehrdeutig, wenn die Läufe
   verschiedene Werte führen; dann `ctx.wert('modellhaus:jr1.zahlungsueberschuss.A')`.
8. **Namen kleiner Texte:** Ein Textfeld, dessen Name mit „Text“ beginnt, gilt als Fließtext (mindestens 14 pt). 12-pt-Beschriftungen
   bekommen einen eigenen Namen („Wert Jahr 35 A“).
9. **pptxgenjs direkt:** Wer `s.addText` oder `s.addShape` direkt ruft, setzt `objectName`, `margin: 0`, nur `ctx.F.*` als Schrift und
   baut je Aufruf ein neues Optionsobjekt. Lieber die Bausteine nehmen.
10. **Nichts in `praesentation/` schreiben.** Ausgabe und Render liegen im Teamordner; beide Skripte lehnen Ziele in `praesentation/` ab.
11. **LibreOffice parallel:** immer `--home` mit dem eigenen Ordner; Profile anderer Teams nie mitbenutzen.
