# Optik-Lauf 06.11.2026 – Überdeck-Fugen und verwandte Geometriefehler

Auslöser: Kundenbefund S. 18 (Ringdiagramm, weiße `sep-line` als Fuge, ragt über den Außenrand, endet innen zu früh, Stufe an den
dasharray-Enden). Geprüft: alle 24 Partials, `src/styles.css`, `src/assets/*.svg`, `src/assets/pgn/*.svg`, `scripts/pgn-signatures.cjs`
(+ `scripts/specimen.cjs`, das die Fördermix-Vorlage erzeugt).

Methode: (a) Code-Scan der SVG-Geometrie (Ringradien, Rechteckkanten, Fugen, Linienenden, Rahmen vs. Fläche, Drehsinn gefüllter
Pfade, Icon-Bounding-Boxen aller 26 verschiedenen 24er-Icons per `getBBox`, Text-Bounding-Boxen gegen Satzspiegel per Chromium);
(b) Gesamtdokument vorher/nachher mit `pdftoppm -r 400` gerastert, jede Seite in Halbseiten-Übersicht und jedes Diagramm/Icon/Badge
in 400-dpi-Ausschnitten angesehen. „Vorher“ = Build des unveränderten Stands zu Beginn des Laufs (vor jeder Änderung).

Bilddateien: `vorher-NN-name.png` / `nachher-NN-name.png` in diesem Ordner (400 dpi, gleicher Ausschnitt).

## Behobene Fälle

| S. | Element | Problem | Lösung | Bilder |
|---|---|---|---|---|
| 18 | Ringdiagramm „Bedarfslage“ | Fugen als weiße `sep-line` über zwei `circle`+`stroke-dasharray`; Linie radial 0,9–6,4 statt 1,15–6,65 (oben Überstand, innen Rest des dunklen Segments); Stufe an den dasharray-Enden; rechte Fuge schräg/zu kurz | Zwei echte Kreisring-Sektoren (`path`, je zwei Bögen, r 13,75–19,25, Mitte 20/20,4); Fugen 0,7 mit parallelen Kanten (je 0,35 beiderseits der Radiallinie bei 0° und 85,97°). Werte 96/306 von 402, Farben, Ringbreite, Lage, QR unverändert | `*-18-ring`, `*-18-ring-fuge-oben`, `*-18-ring-fuge-rechts` |
| 18 | Icons der Vorrang-Leiter (Rang 4 Wellen, Rang 5 Treppe) | Motiv 1,4–1,5 Einheiten unter der Mitte der 24er-viewBox (bbox-Mitte y 13,4/13,5) → sitzen tiefer als die übrigen Icons | Pfade um 1,4/1,5 nach oben verschoben (Mitte 12,0) | `*-18-icons-zentrierung` |
| 06 | Gestapelte Balken Einkommensgrenzen (6 Zeilen) | 12 weiße `sep-line` als Fugen | Echte Fugen: A endet 0,35 vor, B beginnt 0,35 nach der Teilungsstelle usw. (Gesamtlänge = C-Wert unverändert) | `*-06-balkenfugen` |
| 07 | Fläche unter dem Mietpfad | Treppenfläche als eine Fläche + 2 Linien in Papierfarbe als Fugen | Drei getrennte Flächen mit 0,35 Abstand | `*-07-flaeche-fugen` |
| 08 | Fördermix A/B/C | `sep-line`-Fugen; Eigenmittel-Rahmen 0,1 über die Balkenkante hinaus (Stufe an Ober-/Unterkante zu Darlehen); Schraffurlinien stehen unter dem Rahmen hervor | Echte 0,7-Fugen; Rahmen um ½ Strich nach innen (Außenkante = Segmentkante); `data-hatch` = Rahmen-Mittellinie; Zuschlagskappe beginnt an der Segmentkante | `*-08-foerdermix-fuge`, `*-08-foerdermix-eigenmittel` |
| 08, 13, 14 (+ alle `sb-b/sb-w`) | Maßstabsleisten | Schwarze Felder ohne Kontur, weiße mit 0,2-Kontur → an jedem Wechsel 0,1-mm-Stufe oben/unten | **Global** `.sb-b` mit derselben Kontur (styles.css); ebenso `sig-sb-b` (Axo) und `sig-massstab .b` im Generator | `*-08-massstab`, `*-13-massstab`, `*-14-inseln-massstab`, `*-01-massstab` |
| 09 | Verzinste Restlaufzeit (Schraffur) | Schraffur auf das äußere Rechteck gerechnet, Rahmen 0,15 innen → Linienenden stehen außen über den Rahmen | `data-hatch` auf Rahmen-Mittellinie | `*-09-schraffur-rahmen` |
| 10 | Modellhaus | Geschossdecken als Papier-/Weißlinien über den Flächen (`p10-floor`, `sep-line`); Eigenmittel-Rahmen 0,1 außen | Geschosse als getrennte Flächen (Decke 0,3; Darlehen/Zuschuss 0,7), Fenster je Geschoss mittig; Rahmen + Fensterkontur innen | `*-10-haus` |
| 10 | Sensitivität | `sep-line` Zuschuss/Darlehen; Eigenmittel- und Überschreitungsrahmen außen, Doppelkontur an der Stoßkante | Echte Fuge; Rahmen innen, Eigenmittel-Rahmen zur Überschreitung hin offen (deren Rahmen bildet die Kante) | `*-10-sensitivitaet` |
| 10 | Zeilenlabels Sensitivität | „Förderung, 80 % von 7,70“ und „Mindest-Eigenmittel +“ liefen 5,0 bzw. 1,0 mm links aus dem Satzspiegel | zweizeilig gesetzt (Text unverändert), „+“ an den Zeilenanfang | `*-10-sensitivitaet-labels` |
| 11 | Säulen A/B/C | `sep-line` Zuschuss/Darlehen; Eigenmittel-Rahmen außen | Echte Fuge; Rahmen innen | `*-11-saeulen` |
| 12 | Rechenweg, Ergebniszeile | „1,26 %“ stieß bündig an die rechte Kante der roten Fläche | Wertspalten mit 1,8 mm Innenabstand (Kopf-Achskreise mitversetzt) | `*-12-ergebniszeile` |
| 13 | Modell-Markierung (gestrichelt) | ragte 0,6 über die oberste Rasterlinie hinaus | endet auf der Rasterlinie 100.000 | `*-13-modell-marker` |
| 14 | Finanzierung je m² | `sep-line`; Freistellung der Eigenmittelwerte per **Deckmaske** (`p13-mask`, Fläche in Flächenfarbe über der Schraffur) | Echte Fugen; Schraffur als Rahmenband (4 Rechtecke in `data-hatch`) um eine schraffurfreie Wertefläche, Rahmen innen; Werte in der Mitte der sichtbaren Fläche | `*-14-eigenmittel-fuge` |
| 14 | Grundstück 30/70 | `sep-line` | echte Fuge | `*-14-grundstueck-fuge` |
| 15 | Heatmap Klassensprung | Spalten endeten bei 102,82 statt am Modulrand 102,92 (0,1-mm-Versatz zur Kopflinie) | 3 × 27,273 + 2 × 0,8 = 83,42 ab 19,5; Achskreise mittig nachgeführt | `*-15-heatmap-rand` |
| 16 | Zeitleiste | Stiel unter dem Stichtag-Pin 0,47 neben der Pin-Achse; Bruchzeichen nicht mittig in der Achslücke | Stiel in Pin-Achse (50,73); Bruch symmetrisch zu 140–148 | `*-16-bruch-stiel`, `*-16-bruchzeichen` |
| 19 | Klammer „bei Bauvorhaben“ | Unterbrechung per Papier-Rechteck (`p19-brk-bg`) über der Linie | Linie mit echter Unterbrechung, symmetrisch zur Schrift; Außenenden auf ½ Strich korrigiert | `*-19-klammer` |
| 19 | Schrittitel „Verwendungsnachweis“ | lief (nowrap, Laufweite .03em) 1,4 mm über den rechten Satzspiegelrand | Laufweite 0 nur für diesen Titel | `*-19-titel-rand` |
| 19 | Stopp-Icon im Achtung-Kasten | Achteck 0,6 mm rechts der Textkante der Folgezeilen | optischer Einzug −0,575 mm, Textlage unverändert | `*-19-stopp-icon` |
| 20 | HOAI-Leiste LPH 1–9 | Fugen 0,4 / 0,8 / 0,55 / 0,9 uneinheitlich, Felder 6 und 7 berührten die Bewilligungslinie ungleich | Alle Fugen 0,4, Felder 1–6 und 7–9 stoßen beidseitig an die Linie; Achskreise in Feldmitte | `*-20-hoai-felder` |
| 03 | Kachel 2.1/2.4 (zweifarbige Kopflinie) | Farbwechsel bei 50 % lag 1,2 mm links neben dem roten Reiter | Wechsel unter dem Schrägstrich zwischen den Reitern | `*-03-kachel-farbwechsel` |
| 04 | Programmteil-Matrix `.bs-matrix` | Fugen schwankten 0,8–1,1 mm (Kanten auf ganze px gerastert) | **Global**: Spalten 23 px, Fuge 3 px | `*-04-matrix-fugen` |
| alle Kopfzeilen | Schlüsselplan `.keyplan` | Farbkappe deckte den Rahmen nur rechts, links blieb die schwarze Kante sichtbar | **Global**: Kappe ±1 px statt ±0,2 mm | `*-08-keyplan-kappe` |
| 07 | Mietenstufe-Kästen VI/V/IV | Kastenbreite je Ziffer verschieden (4,6–5,5 mm) | einheitliche Mindestbreite 5,6 mm, zentriert | `*-07-mietenstufe-kaesten` |
| 17, 21 | Vordruck-Kästen im Fließtext | Klammern stießen an den Rahmen | **Global** `.badge--form` mit 0,4 mm Außenabstand | `*-17-vordruck-kasten`, `*-21-vordruck-kasten` |
| U1 | Axonometrie, Attika | Attika als geschlossenes `polygon` → Schlusslinie quer über das Flachdach | offener Linienzug (Generator) | `*-01-attika-schlusslinie` |
| U1 | Kote +9,00 (Traufe) | Kotenlinie lief unter dem Dachüberstand bis an die Wand | endet 1,4 vor dem Dachüberstand wie die übrigen Koten | `*-01-kote-traufe` |
| U4 | Grundriss, Poché | Wandrechtecke mit gegenläufigem Drehsinn → `nonzero` stanzte an Ecken und T-Stößen Löcher | alle Rechtecke im selben Drehsinn (Generator) | `*-24-ecke-A1`, `*-24-t-stoss-trennwand` |
| U4 | Grundriss, Badwand Giebel-WE | begann 0,13 in der Außenwand und lief in die Fensteröffnung | beginnt an der Wand-Innenkante | `*-24-bad-fenster` |
| U4 | Grundriss, Glaslinien | äußere Glaslinien mittig auf der Wandflucht → ½ Strich Überstand | um ½ Strich nach innen | `*-24-fenster-glaslinie` |
| 05 | Navigator-Baum | Ecke Stamm/Ast D aus zwei Pfaden (Lücke an der Ecke); Leader „Ja → Ziel“ endeten 0,5 vor dem Text, uneinheitlich zu den Pfeilen | Stamm + Ast D ein Pfad (Gehrung); Leader auf einheitlichen Abstand | `*-05-baum-ecke-D`, `*-05-leader-abstand` |

Generator: `scripts/pgn-signatures.cjs` geändert und ausgeführt; `sig-axo-brauerstrasse.svg`, `sig-grundriss.svg`, `sig-massstab.svg`
neu. Eingebettete Kopien aktualisiert und geprüft (U1 = Asset + eigene aria-label + Verlaufs-defs, identisch; U4 identisch).
`scripts/specimen.cjs` (Fördermix-Vorlage) erzeugt jetzt echte Fugen und innen liegenden Rahmen.
Global: `.sep-line` aus `styles.css` entfernt (kein Einsatz mehr), `.sb-b`, `.bs-matrix`, `.keyplan__list > li::before`, `.badge--form`.
DESIGN.md: neue Regel „Keine Überdeck-Fugen“ (6.6) und Schraffur-Abschnitt (Rahmen innen, `data-hatch` = Rahmen-Mittellinie,
Freistellung als Rahmenband).

## Ohne Befund geprüft (Auswahl, ca. 150 Elemente)

51 Inline-SVGs (alle Diagramme, Signaturen, QR-Codes U4/S. 18, Weiche S. 16, 7 Marker S. 7), 26 verschiedene Linien-Icons
(17 Inline-Einsätze + `src/assets/ui-*.svg`, Bounding-Box-Mitte), Piktogramme/Zielgruppen-Assets (`src/assets/*.svg`, im Heft nicht
eingebunden), Schlüsselplan (7 Seiten), Programmteil-Matrix (6), Badges/Programmnummern (21), Achskreise (S. 6, 8, 11, 12, 13, 14, 15, 20),
Seitenverweis-Chips (66), Inhalts-Linienplan U2, Kennzahl-Kacheln S. 3, Einheitenquadrate S. 3, Effizienzklassen S. 15, Swimlanes S. 19,
Stationsmarken S. 20, Planraster-Kasten S. 8, Tabellenlinien/Ergebniszeilen S. 9–12, Werte-Icons S. 22, Raster-Bild und Eckmarken S. 22,
Fußzeilen/Schriftfeld, Rahmen U1/U4, Nordpfeil, Höhenkoten, Achskreise und Maßketten der Signaturen.

## Unsicher / zur Entscheidung

1. **S. 22 Werte-Icons (Verantwortung, Kostensicherheit, Innovation, Vertrauen)** – CI-Dateien von PGN, unterschiedlich breit und
   links bündig gesetzt; optisch nicht ganz auf einer Mittelachse. Nicht verändert (Kunden-Assets). Option: in gleich breite Box zentrieren.
2. **S. 3 Kachel 2.1/2.4** – Farbwechsel jetzt unter dem Schrägstrich; alternativ exakt an der Reiterkante 2.4 (dann rote Linie bis an den blauen Reiter).
3. **Ungenutzte `src/assets/ui-*.svg`** (telefon, pfeil, dokument, tipp, kalender) sind 0,3–0,6 Einheiten außermittig, im Heft aber
   nicht eingebunden (die Inline-Kopien sind in Ordnung) – bei Wiederverwendung angleichen.
4. **Git**: Während des Laufs wurde ein Zwischenstand committet (`fff86db`, enthält die frühen Änderungen an S. 5 und 18). Alles
   Weitere ist nicht committet.

## Build

`assemble.cjs` + `render.cjs` (Gesamtdokument): keine OVERFLOW/LASTLINE/MUSTER/FONT/PDFUA/FEHLER/SATZSPIEGEL-Zeilen,
24 `.page`-Elemente = 24 PDF-Seiten, getaggt; `schraffur.cjs --check` 0 Befunde.
