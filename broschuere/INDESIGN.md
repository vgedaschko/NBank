# InDesign-Export (IDML)

## Zweck

Die Broschüre wird in HTML/CSS gesetzt und mit Chromium zum PDF gerendert. Der InDesign-Export macht aus genau diesem
gerenderten Layout ein InDesign-Paket, damit die Werbeagentur des Kunden in InDesign weiterarbeiten kann: Korrekturen,
Druckvorstufe, spätere Auflagen. Das Paket öffnet ab InDesign CC 2020 und steht positionsgenau wie das freigegebene PDF.
Text bleibt Text (Absatz- und Zeichenformate), Tabellen sind native InDesign-Tabellen, Farben sind benannte
Farbfelder, Grafiken sind verknüpfte Vektor-PDFs.

Layout, Texte und `styles.css` ändert der Export nicht. Er liest nur `src/index.html`, die von `assemble.cjs` erzeugte
Gesamtdatei.

## Aufruf

```bash
npm install                 # einmalig: Playwright (Chromium), pdf-lib, hyphen
npm run indesign:setup      # einmalig: .venv/ mit den Python-Paketen aus scripts/idml/requirements-idml.txt
npm run indesign            # = node scripts/export-idml.cjs → dist/indesign/
```

Ein Lauf macht alles, was für ein stimmiges Paket nötig ist:

1. **assemble:** `src/index.html` wird aus `template.html` und `src/pages/` neu zusammengesetzt (unter 1 s). Damit wird nie
   ein veraltetes Layout exportiert.
2. **Referenz-PDF:** `dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026.pdf` (das PDF von `npm run build`) kommt ins
   Paket, wenn es jünger als alle Quellen (`src/`, `content/`, `assemble.cjs`, `render.cjs`) ist. Sonst wird die Referenz
   fürs Paket mit `render.cjs` neu gerendert (etwa 10 s), und zwar in den Arbeitsordner des Laufs. Die versionierten
   PDFs in `dist/` fasst der Export nie an, sie aktualisiert weiterhin `npm run build`. Befunde von `render.cjs`
   (OVERFLOW …) erscheinen als Warnung. Sie betreffen das Layout selbst, nicht den Export.
3. **Export:** Chromium misst das Layout, `make-fonts.py` erzeugt die Desktop-Schriften, die Grafiken werden als PDF
   gerendert, das IDML wird geschrieben (etwa 1 Minute).
4. **Prüfungen:** `check.cjs` (Node) und `validate.py` (Python) prüfen das fertige Paket unabhängig voneinander.
5. **Auslieferung:** Nur ohne Prüfungsfehler ersetzt das neue Paket das alte in `dist/indesign/`.

Danach `npm run indesign:check` prüft ein vorhandenes Paket erneut, `npm run indesign:selbsttest` prüft das Prüfnetz
selbst (29 gezielt beschädigte Kopien müssen als Fehler auffallen). Optionen werden mit `--` durchgereicht, z. B.
`npm run indesign -- --python ~/venv/bin/python`. `node scripts/export-idml.cjs --help` zeigt alle Optionen.

### Voraussetzungen

| Was | Wofür | Einrichten |
|---|---|---|
| Node.js ≥ 18, Playwright mit Chromium, pdf-lib | Messen im Browser, Grafiken, PDF | `npm install` (ggf. `npx playwright install chromium`) |
| Python 3 mit **fontTools** und **brotli** (Pflicht) | Desktop-Schnitte aus den WOFF2-Webschriften | `npm run indesign:setup` |
| Python mit lxml, pypdf, pillow (empfohlen) | Prüfung `validate.py`; ohne diese Pakete wird sie mit Hinweis übersprungen | ebenfalls `npm run indesign:setup` |
| poppler-utils (`pdfinfo`) | nur wenn die Referenz neu gerendert wird (wie bei `npm run build`) | Systempaket |
| xmllint (optional) | zusätzliche XML-Prüfung in `check.cjs` | Systempaket `libxml2-utils` |

**Welches Python?** In dieser Reihenfolge: `--python PFAD`, dann die Umgebungsvariable `IDML_PYTHON`, dann
`.venv/bin/python` im Projekt (von `npm run indesign:setup`), zuletzt `python3` aus dem Suchpfad. Beispiel:
`IDML_PYTHON=/pfad/zum/venv/bin/python npm run indesign`. Fehlen fontTools oder brotli, bricht der Export sofort mit
einer Anleitung ab, also vor dem langen Browserlauf.

### Sicherheitsnetz

- **Ein Lauf je Zielordner.** Die Sperrdatei `dist/indesign.lock` (PID, Rechner, Startzeit) lässt nur einen Export, eine
  Prüfung oder einen Selbsttest zu. Ein zweiter Lauf bricht mit Exit-Code 3 ab. Eine Sperre, deren Prozess nicht mehr
  läuft, wird übernommen. Ist sicher kein Lauf aktiv, darf die Datei gelöscht werden.
- **Arbeitsordner je Lauf** (`dist/.indesign-neu-XXXXXX/`). Erst wenn beide Prüfungen ohne Fehler sind, wird
  ausgeliefert: alte Erzeugnisse in einen Sicherungsordner, neue hinein, dann die Sicherung löschen. Schlägt dabei
  etwas fehl, wird zurückgerollt. Andere Dateien in `dist/indesign/` bleiben unberührt.
- **Bei Prüfungsfehlern** bleibt das bisherige Paket unverändert, das fehlerhafte liegt zur Ansicht in
  `dist/indesign-fehlgeschlagen/`, Exit-Code 1. `--force` liefert trotzdem aus.
- **Bei Abbruch** (Browser, Python, Strg+C) wird nur der eigene Arbeitsordner entfernt. Ein Wächter bricht einen
  hängenden Lauf nach 20 Minuten ab (`--max-minuten N`). `make-fonts.py` und `validate.py` haben eigene Zeitlimits.
- **Reproduzierbar:** Zwei Exporte desselben Stands sind bytegleich (IDML, Link-PDFs, Schriften, LIESMICH). Der
  Zeitstempel ist `SOURCE_DATE_EPOCH` oder die jüngste Quelldatei. Eine Nachlieferung ohne inhaltliche Änderung meldet
  in InDesign keine geänderten Verknüpfungen oder Schriften.

Exit-Codes: 0 ausgeliefert · 1 Prüfungsfehler oder Abbruch (altes Paket unverändert) · 2 Voraussetzung fehlt (Python,
Playwright, Referenz-PDF nicht erzeugbar) · 3 anderer Lauf aktiv.

### Optionen (`npm run indesign -- …` bzw. `node scripts/export-idml.cjs …`)

| Option | Standard | Wirkung |
|---|---|---|
| `--python PFAD` | `IDML_PYTHON`, `.venv/bin/python`, `python3` | Python mit fontTools und brotli |
| `--out DIR` | `dist/indesign` | Zielordner |
| `--ref-pdf PDF` | PDF von `npm run build`; ist es veraltet, wird die Referenz neu gerendert | festes Referenz-PDF (wird nicht neu gerendert; Warnung, wenn älter als die Quellen) |
| `--no-ref-pdf` | – | Paket ohne Referenz-PDF |
| `--no-assemble` | – | `src/index.html` nicht neu zusammensetzen |
| `--setzer einzeilig\|absatz` | `einzeilig` | Ein-Zeilen-Setzer (Umbruch wie Chromium) oder Absatzsetzer |
| `--master-selector SEL` / `--no-master-items` | `.page__foot` | Container, dessen gleichbleibende Objekte auf die Musterseite wandern / Fußzeile ganz auf den Seiten lassen |
| `--refs DIR` | `IDML_REFS` | Referenz-IDMLs für `validate.py` (Vokabular, Werte) |
| `--no-validate`, `--force`, `--check`, `--selbsttest` | – | validate.py auslassen / trotz Fehlern ausliefern / nur prüfen / Prüfnetz testen |
| `--max-minuten N` | `20` | Wächter gegen Hänger |
| `--tables frames`, `--no-merge`, `--keep-model` | – | Diagnose: Tabellen als Einzelrahmen, keine Rahmenzusammenfassung, DOM-Modell behalten |

## Paketinhalt (`dist/indesign/`)

| Datei | Inhalt |
|---|---|
| `Mietwohnraumfoerderung-2026.idml` | das InDesign-Dokument: Doppelseiten, Musterseiten, Ebenen, Absatz- und Zeichenformate, Farbfelder, Tabellen |
| `Links/` | verknüpfte Vektor-PDFs: Diagramme, Illustrationen, Piktogramme, Icons, Logo, QR-Code, Verlaufs- und Musterflächen, Fotos |
| `Document Fonts/` | statische Desktop-Schnitte (TTF) von Montserrat und Work Sans plus die OFL-Lizenztexte |
| `Referenz-PGN-Mietwohnraumfoerderung-Niedersachsen-2026.pdf` | das PDF desselben Stands zum Vergleich |
| `LIESMICH.txt` | Anleitung für die Agentur: Öffnen, Schriften, Aufbau, Grenzen, Weiterarbeit, Checkliste mit Rückmeldung |

Den Ordner immer vollständig weitergeben (IDML, `Links/` und `Document Fonts/` nebeneinander), z. B. als ZIP.
`LIESMICH.txt` wird bei jedem Lauf aus den Daten des Exports erzeugt (`scripts/idml/liesmich.cjs`). Zahlen,
Seitenlisten und die Checkliste dort stimmen also immer mit dem gelieferten Paket überein.

Kennzahlen des Exports vom 23.10.2026: 24 Seiten in 13 Druckbögen, 698 Textrahmen mit 1120 Absätzen, 7 Tabellen,
812 Flächen und Linien, 91 Grafikrahmen (80 PDF-Dateien in `Links/`, 16 Objekte auf der Musterseite),
197 Absatzformate plus 2 Basisformate, 55 Zeichenformate, 26 Farbfelder, 13 Schriftschnitte.

## Abbildung HTML → InDesign

| HTML/CSS | InDesign |
|---|---|
| `.page` (A4) | Seite 210 × 297 mm, Doppelseiten, Seite 1 rechts allein: [1] [2\|3] … [22\|23] [24]; Beschnitt 3 mm. Randabfallende Flächen und Grafiken reichen an den Außenkanten in den Beschnitt, nie über den Bund. |
| Satzspiegel, Spaltenraster (`--col`, `--gutter`) | Ränder und 12-Spalten-Raster der Musterseiten und der Dokumentvorgabe |
| `.page__foot` (Fußzeile) | **Musterseiten:** „A-Inhalt“ trägt Satzspiegel, Raster und die gleichbleibende Fußzeile mit automatischer Seitenzahl (S. 2–22). „B-Inhalt ohne Fuß“ hat denselben Satzspiegel ohne Objekte (S. 23, Impressum mit eigener Fußzeile). „U-Umschlag“ hat keine Ränder (S. 1, 24). Auf S. 10/11 (eigene Seitenfläche) steht die Fußzeile auf der Seite, die Musterobjekte sind ausgeblendet. Rubrik und Programmteil-Register sind Objekte je Seite. |
| Stapelreihenfolge | **Ebenen** von oben nach unten: „Text“, „Grafiken“, „Hintergrund“. Innerhalb einer Ebene gilt die Reihenfolge des HTML. |
| Textblöcke (`p`, `h1`–`h4`, `li`, …) | Absätze in Textrahmen an der gemessenen Position. Absätze desselben Containers, die untereinander stehen und durch kein Objekt getrennt sind, teilen sich einen Rahmen. Mehrspaltiger Text steht in mehrspaltigen Rahmen mit „Spalten ausgleichen“. Die erste Grundlinie ist fest („Fest“), Rahmen haben eine kleine Reserve. |
| CSS-Klassen der Textbausteine | **Absatz- und Zeichenformate** mit deutschen Namen aus `scripts/idml/stilnamen.json`, z. B. „Fließtext“, „Vorspann“, „Tabelle Kopf“. Varianten tragen ihr Merkmal im Namen („… 9 pt“, „… SemiBold“), gleich aussehende Formate sind zusammengeführt. Jedes Absatzformat basiert auf „Basis Montserrat“ oder „Basis Work Sans“ und enthält nur seine Abweichungen. Dort lassen sich Schriftfamilie, Sprache (Deutsch 2006), Setzer und Silbentrennung zentral ändern. |
| Formatgruppen | Keine InDesign-Formatgruppen (Ordner): Kein Referenz-IDML eines echten InDesign-Exports belegt deren Syntax, ein Fehler dort könnte das Öffnen gefährden. Die Ordnung entsteht über gemeinsame Namensanfänge („Tabelle …“ 19 Formate, „Kennzahl …“ 10, „Titelseite …“ 8, „Stufe …“, „Referenz …“, „Hinweis …“) und die zwei Basisformate. Ordner kann die Agentur mit „Neue Gruppe aus Formaten …“ selbst anlegen. |
| Farb-Tokens (`--pgn-red` …) | **Farbfelder**, nur die verwendeten, benannt „Deutscher Name (token)“, z. B. „PGN-Rot (pgn-red)“, „Grau 200 Haarlinie (grey-200)“, „Programmteil 2.2 (bs-22)“, sortiert nach Gruppen. Gleiche Farbwerte teilen sich ein Feld. Drei Mischtöne ohne Token heißen nach InDesign-Art „R=… G=… B=…“. Alle Farben sind RGB wie im HTML. Keine Farbgruppen, Farbtöne oder CMYK-Werte, weil die CMYK-Vorgaben des Kunden fehlen. |
| `<table>` | **7 native InDesign-Tabellen** (S. 4, 6, 7, 9, 10, 11, 15): Kopfzeilen, Spaltenbreiten, Zeilenhöhen, Zellabstände, Linien und Flächen je Zelle. Gemeinsame Zellkanten sind nach CSS aufgelöst. Rechenzeilen mit „−“, „+“, „=“ haben einen hängenden Einzug. Für einen unteilbaren Kopf, der im HTML über seine Zelle läuft (S. 7), gibt es eine schmale Hilfsspalte. |
| Inline-SVG, Diagramme, Icons, Logo, QR-Code, CSS-Verläufe/Muster, Fotos | **Grafiken als PDF-Links:** Jede Grafik ist ein eigenes Vektor-PDF in `Links/`, relativ verknüpft und mit sprechendem ASCII-Dateinamen (z. B. `S01-Grafik-02-Logo-PGN.pdf`). Identische Grafiken teilen sich eine Datei. Ragen Beschriftungen über die SVG-Box, ist der Rahmen entsprechend größer. Verlaufsflächen liegen auf der Ebene „Hintergrund“. |
| Hintergründe, Kästen, Linien, Punkte, Häkchen | native Rechtecke, Ellipsen, Polygone und Linien (Kontur innen, Stärke in pt), Deckkraft über Transparenz, abgerundete Ecken |
| Webschriften (variable WOFF2) | statische Desktop-Schnitte in `Document Fonts/`, aus denselben Quelldateien mit fontTools instanziiert. Zwischengewichte sind auf benannte Schnitte gerundet (650 → Bold, 560 → SemiBold). |
| Weiche Trennstriche aus `assemble.cjs` | bedingte Trennstriche. Trennbereich 0 pt und Trennungen in Folge unbegrenzt bilden den Browser nach. Wörter, die im PDF nicht getrennt werden, haben einen bedingten Trennstrich vor dem Wort (verhindert Wörterbuchtrennung). |
| `text-wrap: balance`/`pretty`, Überschriften | feste Zeilenumbrüche (Umschalt+Eingabe) nur dort, wo InDesign den Zeilenfall des PDFs sonst nicht trifft (37 Absätze mit `pretty`, mehrzeilige Überschriften und Labels) |

## Bekannte Grenzen

- **Diagrammtexte sind Teil der Grafik.** Beschriftungen in Diagrammen und Illustrationen sind kein InDesign-Text.
  Bearbeiten heißt: PDF aus `Links/` in Illustrator öffnen (Schrift ist eingebettet) oder Text darüberlegen.
- **Der Umbruch kann minimal abweichen.** InDesign misst Schrift etwas anders als Chromium. Der Ein-Zeilen-Setzer und
  feste Umbrüche halten den Zeilenfall des PDFs, an einzelnen Stellen kann eine Zeile trotzdem anders brechen. Wird Text
  geändert, die festen Umbrüche im Absatz entfernen (Suchen/Ersetzen „^n“ durch Leerzeichen).
- **Keine verankerten Objekte.** Seitenverweis-Chips, Aufzählungsquadrate, Checkboxen, Farbmarken und Inline-Icons
  liegen als lose Objekte an der Textstelle, der Platz ist im Text als Laufweite freigehalten. Wird Text umgestellt,
  diese Objekte von Hand nachziehen. Verankerung und InDesign-Listen sind ungetestete Spezifikationspunkte und würden die
  Positionstreue riskieren.
- **Fotos** stecken als beschnittene PDFs in `Links/`. Für den Druck die hochaufgelösten Originalfotos neu platzieren.
- **Keine Formatgruppen, Farbgruppen, Objektformate.** Siehe Tabelle oben. Alle Farbfelder sind RGB.
- **Hyperlinks, Querverweise und Barrierefreiheit** (Tags, Alternativtexte, Lesereihenfolge) des PDFs sind im IDML
  nicht angelegt. Der Text bleibt erhalten.
- **Ersetztes Zeichen:** „✕“ (U+2715) fehlt in Montserrat Black und wird auf S. 19 durch „✗“ (U+2717) ersetzt (Warnung
  im Log). Abhilfe in der Quelle: im HTML durch „✗“ ersetzen oder in die Teilmenge `pgn-symbols` aufnehmen.
- **Ohne echtes InDesign geprüft.** Geprüft sind Struktur, IDs, Verweise, Vokabular gegen echte InDesign-Exporte,
  Glyphen, Breiten und der Scribus-Import. Nur aus der Spezifikation bekannt und mit der Checkliste zu bestätigen:
  platzierte PDFs (`PDFCrop="CropMedia"`), feste erste Grundlinie, Tabellenattribute und verbundene Zellen,
  Ein-Zeilen-Setzer mit Trennbereich 0, bedingter Trennstrich vor einem Wort, Formatvererbung über Basisformate,
  Musterobjekte, „Spalten ausgleichen“, abgerundete Ecken, Ebenenreihenfolge.
- **Erwartete Warnungen beim Export:** Register-Textrahmen „2.x“ auf S. 9–17 reichen am Außenrand minimal in den
  Beschnitt (der Text selbst nicht). Die Signet-Grafik auf S. 22 wird unten um 10,6 pt beschnitten, wie im HTML durch
  das Elternelement.

## Hinweise für die Agentur

- **Schriften:** Ordner lokal ablegen, die IDML öffnen und sofort als `.indd` in denselben Ordner sichern. Beim
  nächsten Öffnen aktiviert InDesign die Schnitte aus „Document Fonts“ automatisch, nur für dieses Dokument. Alternativ
  die 13 TTF-Dateien installieren. Nicht ungeprüft durch gleichnamige offizielle Schnitte ersetzen: Die Metriken
  können minimal abweichen, dann ändert sich der Zeilenfall. Lizenz: SIL OFL 1.1, die Lizenztexte liegen bei.
- **Verknüpfungen:** `Links/` bleibt neben der `.indd`. Meldet InDesign Grafiken als fehlend: im Bedienfeld
  Verknüpfungen alle markieren, Bedienfeldmenü, „Erneut mit Ordner verknüpfen …“, `Links/` wählen. Grafiken in
  Illustrator bearbeiten und sichern, InDesign aktualisiert die Verknüpfung. Zur Weitergabe Datei > Verpacken.
- **Farbfelder auf CMYK/Pantone umstellen:** Grau- und Schwarztöne für Text und Haarlinien als reine Schwarz-Tonwerte
  (K) anlegen, sonst werden sie vierfarbig aufgebaut. PGN-Rot und die Programmteil-Farben nach der CI des Kunden
  einstellen (CMYK oder Pantone/HKS als Volltonfarbe). Da alle Elemente die Farbfelder verwenden, genügt die Änderung am
  Feld. Die Grafik-PDFs enthalten RGB: Bei der PDF/X-Ausgabe werden sie konvertiert, exakte Volltöne in Illustrator setzen.
- **Preflight:** Fenster > Ausgabe > Preflight mit dem Profil der Druckerei (z. B. PDF/X-4) auf Übersatz, fehlende
  Schriften und Verknüpfungen, RGB und Auflösung prüfen. Druck-PDF über Adobe PDF (Druck) mit „Anschnitteinstellungen
  des Dokuments verwenden“ (3 mm).
- **Textkorrekturen:** In geänderten Absätzen die festen Zeilenumbrüche entfernen. Für längere neue Texte im
  Absatzformat (oder zentral im Basisformat) auf den Adobe-Absatzsetzer umstellen.

## Checkliste „Erster Test in InDesign“ (für den Kunden bzw. die Agentur)

Bitte beim ersten Öffnen durchgehen und je Punkt „ok“ oder die Abweichung mit Screenshot zurückmelden. Immer angeben:
InDesign-Version (Hilfe bzw. InDesign > Über InDesign) und Betriebssystem. Dieselbe Liste steht in `LIESMICH.txt`,
Abschnitt 6.

| Nr. | Prüfen | Erwartet | Was zurückmelden |
|---|---|---|---|
| 1 | **Öffnet ohne Fehlermeldung?** Datei > Öffnen > `Mietwohnraumfoerderung-2026.idml` | Dokument öffnet ohne Meldung (kann eine Minute dauern) | Wortlaut jeder Meldung (Screenshot), ungefähre Dauer |
| 2 | **Fehlende Schriften?** Schrift > Schriftart suchen; rosa hinterlegte Textstellen | 13 Schnitte Montserrat und Work Sans, nach Sichern als `.indd` im Ordner bzw. Installation keiner fehlend | Namen fehlender Schnitte; ob „Document Fonts“ oder die Installation geholfen hat |
| 3 | **Fehlende Verknüpfungen?** Fenster > Verknüpfungen | 80 Dateien, keine mit Fragezeichen- oder Warnsymbol | Anzahl fehlender oder geänderter Dateien; ob „Erneut mit Ordner verknüpfen“ geholfen hat |
| 4 | **Seitenzahl und Doppelseiten korrekt?** Fenster > Seiten | 24 Seiten in 13 Druckbögen: [1] [2\|3] … [22\|23] [24]; Musterseiten A/B/U wie in LIESMICH; automatische Seitenzahl im Fuß = Seite | abweichende Seitenzahl, Anordnung oder Musterseite |
| 5 | **Stichproben gegen das Referenz-PDF** (100–200 %, Vorschaumodus W, Ansicht > Anzeigeleistung > Anzeige mit hoher Qualität): **S. 1** Titel „Wohnraum, der sich rechnen kann.“ mit Axonometrie und Kennzahl „80 %“; **S. 9** „Konditionen auf einem Blatt“ (Tabelle, Zeitstrahl, Register 2.1); **S. 11** „Mehr Miete, mehr Darlehen“ (Tabelle mit hängenden Einzügen, Balkendiagramm, Fußzeile auf der Seite); **S. 20** „So begleiten wir Ihr Förderprojekt“ (Schrittliste, Phasenleiste); **S. 24** Rückseite (Grundriss, QR-Code, randabfallende rote Fläche) | Lage von Text, Flächen und Grafiken wie im PDF; gleicher Zeilenfall; Text liegt über den Flächen; Grafiken vollständig; QR-Code scannbar | Seite, Stelle, Screenshot InDesign neben dem PDF, Verschiebung möglichst in mm |
| 6 | **Formate- und Farbfelder-Bedienfeld:** Fenster > Formate > Absatz-/Zeichenformate, Fenster > Farbe > Farbfelder | 199 Absatzformate (davon 2 Basisformate), 55 Zeichenformate, 26 benannte Farbfelder. Ein Klick in einen Fließtext zeigt das Format ohne „+“. | fehlende oder doppelte Formate, auffällig viele „+“, Farbfelder ohne Namen |
| 7 | **Übersatz-Markierungen?** Fenster > Ausgabe > Preflight ([Grundprofil]); rote Pluszeichen an Textrahmen | kein Übersatztext | Preflight-Liste mit Seiten (Screenshot des Bedienfelds) |
| 8 | **Tabellen bearbeitbar?** In eine Zelle klicken (S. 4, 6, 7, 9, 10, 11, 15), Text ändern, Tabelle > Einfügen > Zeile | verhält sich wie eine normale InDesign-Tabelle; Linien, Flächen und Spaltenbreiten wie im PDF | ob bearbeitbar; Abweichungen bei Linien, Flächen, Spaltenbreiten (Seite, Screenshot) |
| 9 | **Sichern und erneut öffnen:** als `.indd` in den Paketordner sichern, schließen, wieder öffnen | Schriften und Verknüpfungen weiterhin vollständig | ja/nein; sonst die Meldung |

Rückmeldungen zu Punkt 1, 5, 6 und 8 bestätigen bzw. widerlegen die nur aus der Spezifikation bekannten Punkte (siehe
„Bekannte Grenzen“). Stimmt dort etwas nicht, Screenshot und Seite an die Entwicklung, damit der Export angepasst
werden kann.

---

## Anhang für die Entwicklung

### Entscheidungen im Detail

- **Position:** Alle Objekte stehen an der im Browser gemessenen Position, die erste Grundlinie ist fest. Rahmen haben
  unten eine kleine Reserve. Einzeilige Rahmen haben mindestens 2 pt Reserve zur freien Seite; bei rechtsbündigen und
  zentrierten Rahmen bleibt der Gewinn als verfügbare Breite, damit „2.4“ oder die Pagina nicht umbrechen.
- **Zeilenfall:** Standardmäßig setzt der Ein-Zeilen-Setzer. Feste Umbrüche (U+2028) stehen dort, wo InDesign den
  Umbruch nicht nachbilden kann: `hyphens: none`, `text-wrap: balance` (Überschriften) und Anzeigetext ab 18 pt, jeweils
  2–6 Zeilen. Endet eine Zeile an einem weichen Trennstrich, steht dort ein Trennstrich mit Umbruch. Steht an einem
  Zeilenende bereits ein `<br>`, wird kein zweiter Umbruch eingefügt.
- **`text-wrap: pretty`** (`p, li, dd, td, th`): `browser.cjs` misst die Zeilenanfänge zusätzlich unter
  `text-wrap-style: auto`. Nur wo beide abweichen, stehen ab der ersten abweichenden Zeile feste Umbrüche an den Stellen
  des PDFs (derzeit 37 Absätze, 66 Umbrüche). Davor bleiben Text und Silbentrennung frei.
- **Silbentrennung:** Die weichen Trennstriche aus `assemble.cjs` bleiben als bedingte Trennstriche erhalten.
  Automatische Trennung (Wörter ab 8 Buchstaben, 3/3) ist nur in Absätzen mit solchen Trennstellen an.
  - **Trennbereich 0, Trennungen in Folge unbegrenzt** (`HyphenationZone="0"`, `HyphenateLadderLimit="0"`) ist Absicht:
    Mit dem Standard von 36 pt würde InDesign beim Ein-Zeilen-Setzer kein Wort trennen, das weniger als 36 pt vor dem
    Zeilenende beginnt (im PDF 47 von 106 Trennungen). `validate.py` und `check.cjs` melden jeden Ein-Zeilen-Setzer mit
    Trennbereich oder Leiter-Grenze ≠ 0 als Fehler.
  - **Wörterbuchtrennung verhindert:** Wörter ab 8 Buchstaben ohne Trennstelle (auch die mit `u-nohyphens` geschützten
    wie „Rücktrittsrecht“) bekommen einen bedingten Trennstrich vor das Wort (Adobe: „Wort nicht trennen“). Beide
    Prüfungen melden ungeschützte Wörter als Fehler.
- **Mehrspaltiger Text:** Zeilen werden je Spalte gebildet. „Nächste Spalte“ nur, wenn ein Absatz wirklich in der
  nächsten Spalte beginnt. `column-count` am Absatz selbst wird erkannt (S. 18), `column-rule` wird als Linie im
  Spaltenabstand ausgegeben (S. 21).
- **Grafiken:** Ragt SVG-Inhalt sichtbar über die eigene Box, wird der Überstand wie eine Beschnittzugabe mitgerendert,
  beschnitten mit den Clip-Kästen der Vorfahren. Verlaufsflächen am Seitenrand wachsen an den Außenkanten in den
  Beschnitt (U4). Gleich aussehende Flächen werden einmal gerendert und gemeinsam verknüpft.
- **Tabellen:** Die Höhe kommt aus den Zeilen. Gemeinsame Zellkanten werden nach CSS 2.1 § 17.6.2.1 aufgelöst und
  identisch in beide Zellen geschrieben. Hängender Einzug (`text-indent < 0`, S. 10/11): Der linke Zelleninnenabstand
  wird um den Überhang kleiner, der Absatz bekommt Einzug links = −Erstzeileneinzug, weil InDesign Einzug +
  Erstzeileneinzug < 0 nicht zulässt. Unteilbarer Text breiter als die Zelle (S. 7): erst Innenabstand auf der freien
  Seite verkleinern, sonst schmale Hilfsspalte, die nur in dieser Zeile zur Kopfzelle gehört.
- **Inline-Objekte:** Leere Inline-Blöcke und Inline-Grafiken reservieren ihre Breite im Text als Laufweite. Trennt ein
  Abstand zwei Wörter, steht dort ein geschütztes Leerzeichen und nur der Rest ist Laufweite.
- **Glyphen:** Jedes Zeichen wird gegen die cmap seines Schnitts geprüft. Fehlende Zeichen werden über `SUBST`
  (build.cjs) ersetzt (Warnung) oder als Fehler gemeldet.
- **Musterseiten:** „A-Inhalt“ bekommen nur Seiten, deren Fuß wirklich auf die Musterseite gewandert ist, sowie
  Druckbögen mit ausgeblendeten Musterobjekten. `ShowMasterItems` gilt für den ganzen Druckbogen, deshalb gibt es
  „B-Inhalt ohne Fuß“ für Seiten mit Satzspiegel ohne Standard-Fußzeile.
- **Formate:** Namen aus `scripts/idml/stilnamen.json` (`absatz`, `zeichen`, `woerter`, `farben`), Zusammenführung
  über `zusammenfuehren`. Messrauschen unter 0,1 pt entfällt.
- **Ebenen:** In `designmap.xml` steht die oberste Ebene zuerst (wie in den Referenz-IDMLs: „Layer 2“ vor „Layer 1“).
- **Seitenformat** auf 0,01 mm eingerastet, also exakt A4. Weiße Seitenhintergründe werden nicht ausgegeben.
- **Objekte:** Namen aus Bauteil und Rolle („Seitenverweis Fläche“, „Seite Fuß Linie“). Inset-Schatten werden zu
  Konturen innen, Haarlinien aus runden Flächen zu Linien mit runden Enden. Textrahmen bleiben unbenannt (InDesign zeigt
  den Textanfang selbst an).

### Bewusst nicht umgesetzt

- Verankerte Inline-Objekte und InDesign-Listen (Montserrat und Work Sans haben kein U+25A0; Verankerung ist [Spez]).
- Formatgruppen (`ParagraphStyleGroup`), Farbgruppen, Farbtöne, CMYK: keine Referenz-IDML belegt die Syntax bzw. die
  CMYK-Werte fehlen.
- Listen und Raster als Tabellen, Kopfblock in einem Rahmen: struktureller Umbau mit Risiko für die Positionstreue.
- Fotos und Logos als Originaldateien: Bildrahmen-Transform und Bildtyp-Link sind [Spez].
- Ebenen nach Funktion, Objektformate, Gruppen: Komfort ohne Wirkung auf das Ergebnis.

### Prüfwerkzeuge

- `node scripts/idml/check.cjs PAKET.idml`: ZIP-Aufbau, XML (auch xmllint), IDs, Verweise inkl. TrapPreset, Schriften
  über die Formatkette, Glyphenabdeckung, verfügbare Zeilenbreite je Absatz, Tabellen gegen Rahmen, Verknüpfungen,
  Formatketten, Absatztrenner im Text, Musterseiten, Silbentrennung.
- `python -I scripts/idml/validate.py PAKET.idml [--refs DIR] [--compare ZWEITER_EXPORT] [--expect ERWARTUNG.json] [--json OUT]`:
  Vokabular gegen `scripts/idml/vokabular.json` (unbekannte Elemente/Attribute und ungültige Aufzählungswerte = FEHLER),
  Koordinaten, Beschnitt, Grafik-PDFs, Glyphen, Formatketten, Musterseiten, Silbentrennung, Zellbreiten (fontTools).
  `--compare` prüft die Bytegleichheit zweier Exporte. Der Export übergibt eine Erwartung aus dem DOM (Seiten mit
  `.page__foot`), damit eine fehlende oder überzählige Fußzeile auffällt.
- `python -I scripts/idml/validate.py x --refs DIR --write-vocab scripts/idml/vokabular.json`: Vokabular aus
  Referenz-IDMLs plus den geprüften DOM-Eigenschaften (`VETTED`/`ENUMS`) neu erzeugen. Ein neues Attribut im Writer
  gehört nach Prüfung gegen die InDesign-Scripting-DOM-Doku dort hinein.
- `python -I scripts/idml/selbsttest.py PAKET.idml [--keep DIR]`: Mutationstest des Prüfnetzes
  (`npm run indesign:selbsttest`, 29 Mutationen).
- Scribus-Stichprobe: headless Import mit `scribus-idml2pdf.sh` (außerhalb des Repos, immer mit `timeout`). Scribus
  liest die Ebenen andersherum und ignoriert Laufweite, Silbentrennung, feste Grundlinie, Zellkonturen und verbundene
  Zellen. Übersatz und Abweichungen dort sind keine Exporterfehler; Breiten und Zeilenzahl prüft `validate.py`.

### Fehlerbilder

| Meldung | Abhilfe |
|---|---|
| `Python … kann fontTools/brotli nicht laden` | `npm run indesign:setup` oder `--python` bzw. `IDML_PYTHON` auf ein Python mit den Paketen |
| `Playwright fehlt` | `npm install` im Ordner `broschuere/` (ggf. `npx playwright install chromium`) |
| `Referenz-PDF (scripts/render.cjs) fehlgeschlagen` | `npm run build` laufen lassen und die Meldung dort beheben, oder `--no-ref-pdf` |
| `Ein anderer Export … arbeitet gerade mit dist/indesign` (Exit 3) | warten; nur wenn sicher kein Lauf aktiv ist, `dist/indesign.lock` löschen |
| `NICHT ausgeliefert: n Fehler` | Meldungen darüber lesen; das Paket liegt in `dist/indesign-fehlgeschlagen/` |
| `Export nach 20 min abgebrochen` | erneut starten; bei Wiederholung mit `node scripts/render.cjs` bzw. `--keep-model` eingrenzen |
| `Glyphe … fehlt … hat kein Ersatzzeichen` | Zeichen im HTML ersetzen, in die Schrift aufnehmen oder in `SUBST` (build.cjs) eintragen |
| `Absatz … keine verfügbare Zeilenbreite` | Einzüge im Modell prüfen (mehrspaltige Container, Initialen) |
| `[vokabular]` / `[aufzählung]` | Attribut- oder Wertname im Writer prüfen; echte neue DOM-Eigenschaft in `VETTED`/`ENUMS` aufnehmen und Vokabular neu erzeugen |
| `[musterseite]` | Zuordnung in `writer.cjs` (`masterOf`) bzw. `build.cjs` (`master.pages`) prüfen |
| `[silbentrennung]` | `HYPHENATION` in `build.cjs`, Schutz in `prepPara` |
| `[zellbreite]` | Spalten im HTML prüfen; `widenCells` in `build.cjs` nennt in der Warnung, warum es nicht ausweichen konnte |
| `Lizenztext fehlt für …` | `src/fonts/licenses/<familie>-OFL.txt` ergänzen |
