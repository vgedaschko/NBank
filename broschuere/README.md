# Wohnraum, der sich rechnen kann. – Mietwohnraumförderung Niedersachsen 2026 (PGN-Fassung)

> **Herausgeberin: Planungsgemeinschaft Nord GmbH (PGN), Rotenburg (Wümme).** Die NBank ist Bewilligungsstelle und wird
> nur sachlich genannt, nie als Absender (kein Logo von NBank oder Land). Vor dem Druck liefert PGN die Platzhalter
> `[PGN-Rechnung: …]`, `[PGN: …]` und `[Platzhalter]` zu (siehe [Platzhalter](#platzhalter--was-pgn-vor-dem-druck-liefert)
> und Anhang B in `content/copy.md`).
>
> **v1 = Commit `b347308`:** Die frühere NBank-Fassung (20 Seiten, Stand 21.10.2026, Herausgeberin NBank) ist nicht mehr
> im Arbeitsstand enthalten und wird nicht ausgeliefert. Sie bleibt über Git abrufbar (siehe [Frühere Fassung](#frühere-fassung-v1)).

## Zweck

Die Broschüre umfasst 24 Seiten im Format DIN A4 hoch und erklärt die **RL Mietwohnraum 2026**
(RdErl. d. MW v. 25.06.2026, Nds. MBl. 2026 Nr. 319, in Kraft seit 01.07.2026) mit dem Blick des Generalplaners.
Zielgruppen sind Wohnungsunternehmen, Genossenschaften, Investorinnen und Investoren, Projektentwicklung und Kommunen.
Die Broschüre liest die Richtlinie wie ein Investment-Memo: zuerst die Zahlen, dann die Orientierung und die Ertragsseite,
dann die Finanzierung mit Modellrechnung und Wirtschaftlichkeit, danach die übrigen Programmteile, Standort, Kommune und
Antragsweg, zuletzt die Leistungen von PGN. Redaktionsstand: **21.10.2026**.

## Dateien in `dist/`

Ausgeliefert werden nur diese beiden Dateien:

| Datei | Zweck |
|---|---|
| `PGN-Mietwohnraumfoerderung-Niedersachsen-2026.pdf` | Bildschirm-PDF, 24 Seiten A4: getaggt, Lesezeichen aus den Überschriften, Metadaten (Info + XMP, Autor und Erzeuger Planungsgemeinschaft Nord GmbH), Link-Beschreibungen, PDF/UA-Kennung bei fehlerfreier Vorprüfung |
| `PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Druck-3mm-Beschnitt.pdf` | Druck-PDF, 24 Seiten mit 3 mm Beschnitt (216 × 303 mm), TrimBox/BleedBox gesetzt; RGB, die Konvertierung nach PDF/X-4 übernimmt die Druckerei |

Arbeitsdateien (nicht versioniert, siehe `.gitignore`): `dist/preview/seite-01.png` … `seite-24.png` und
`uebersicht.png` (Kontaktbogen) aus dem Gesamt-Build, `dist/qa/` aus Einzelseiten-Renderings.

## Seitenübersicht (24 Seiten)

Rückendrahtheftung: Umschlag (4 Seiten) um einen Innenteil von 20 Seiten. Doppelseiten 2|3, 4|5 … 22|23; die
Doppelseite 10|11 „Ihre Rechnung“ trägt Finanzierung und Wirtschaftlichkeit, physische Heftmitte ist 12|13.

**Umschlag**

| S. | Seite | Kolumnentitel | Überschrift |
|---:|---|---|---|
| 1 | U1 | Umschlag · Titel | Wohnraum, der sich rechnen kann. |
| 2 | U2 | Einstieg · Editorial | Damit sich Investieren wieder rechnet (Editorial, Inhalt) |
| 23 | U3 | PGN · Impressum | Impressum und Hinweise |
| 24 | U4 | Umschlag · Rückseite | Aus Ihrer guten Idee – machen wir den besten Plan. |

**Innenteil (S. 3–22)**

| S. | Kolumnentitel | Überschrift |
|---:|---|---|
| 3 | Überblick · Kennzahlen | Die Förderung in sieben Zahlen |
| 4 | Überblick · Neu und Grundcheck | Was neu ist – und ob Ihr Projekt passt |
| 5 | Überblick · Navigator | Vom Vorhaben zum passenden Programmteil |
| 6 | Ertragsseite · Mieterkreis | Ihr Mieterkreis: drei Einkommensgruppen |
| 7 | Ertragsseite · Mieten | Mieten: gedeckelt, aber planbar |
| 8 | Finanzierung · Programmteil 2.1 | Bis zu 80 % Förderquote |
| 9 | Finanzierung · Term Sheet | Konditionen auf einem Blatt |
| 10 | Ihre Rechnung · Finanzierung | 20 Wohnungen, 7,0 Mio. €: bis zu 5,6 Mio. € Förderung |
| 11 | Ihre Rechnung · Wirtschaftlichkeit | Mehr Miete, mehr Darlehen: Was bleibt im Jahr? |
| 12 | Neubau · Programmteil 2.2 | Reiner Zuschuss statt Darlehen |
| 13 | Neubau · Programmteil 2.4 | Höhere Kostengrenze, 10 % Eigenmittel |
| 14 | Bestand · Programmteil 2.3 | Zuschuss nach Klassensprung |
| 15 | Bestand · Stichtag 31.12.2026 | Altes Recht oder RL 2026: Sie haben die Wahl |
| 16 | Bestand · Programmteil 2.5 | Festbetrag für freie Bestandswohnungen |
| 17 | Bestand · Programmteil 2.6 | Bindung verlängern, Zins auf 0 % |
| 18 | Umsetzung · Standort und Kommune | Wo Bedarf gilt – und was Kommunen tun können |
| 19 | Umsetzung · Antragsweg | Vom Vorgespräch bis zum Verwendungsnachweis |
| 20 | Umsetzung · Mit PGN | So begleiten wir Ihr Förderprojekt |
| 21 | Umsetzung · Unterlagen und Kontakte | Unterlagen, Kontakte und Verfahrensdetails |
| 22 | PGN · Über uns | Ihre Generalplaner aus dem Norden. Seit 1981. |

## Platzhalter – was PGN vor dem Druck liefert

Platzhalter sind gewollt und im Heft als gestrichelt umrandete Felder gesetzt (globale Klasse `.ph` in
`src/styles.css`). Beim Einsetzen den `<span class="ph …">` samt Klasse im Partial ersetzen, Text in
`content/pages/NN-*.json` und `content/copy.md` nachziehen und neu bauen. Maßgeblich und vollständig ist
**Anhang B „Vor dem Druck mit PGN klären“ in `content/copy.md`**.

Im Heft sichtbar (25 Felder):

| S. | Platzhalter | Anzahl | PGN liefert |
|---:|---|---:|---|
| 11 | `[PGN-Rechnung: … % der Miete]` (Zeile 2, Mietausfallwagnis) | 1 | Satz in % der Nettokaltmiete |
| 11 | `[PGN-Rechnung: … € je Wohnung p. a.]` (Zeile 3, nicht umlagefähige Bewirtschaftungskosten) | 1 | Ansatz je Wohnung (20 Wohnungen) |
| 11 | `[PGN-Rechnung: … € je m² p. a.]` (Zeile 4, Instandhaltung) | 1 | Ansatz je m² Wohnfläche (1.400 m²) |
| 11 | `[PGN-Rechnung: Tilgungssatz … %]` (Zeile 8, Tilgung) | 1 | Tilgungssatz der Beispielrechnung |
| 11 | `[PGN-Rechnung]` (Zeilen 2, 3, 4, 5, 8, 9 × Spalten A, B, C) | 18 | Beträge aus der PGN-Beispiel-Investitionsrechnung, Zwischensumme Zeile 5, Ergebnis Zeile 9 |
| 23 | `Verantwortlich für den Inhalt: [PGN: Name bestätigen]` | 1 | verantwortliche Person für die Broschüre |
| 23 | `Bildnachweis: … [PGN: Urheber bestätigen]` | 1 | Urheber und Nutzungsrecht der Visualisierungen S. 22 |
| 23 | `Druck: [Platzhalter]` | 1 | Druckerei mit Anschrift |

Außerdem vor dem Druck zu bestätigen oder freizugeben (ohne Platzhalter im Heft, Details in Anhang B):
Preisstand der Beispielrechnung S. 11; Geschäftsführung, Herausgeberzeile und PDF-Metadaten (U3); Formulierung
„Seit 1981“ (S. 2, 22); Bildrechte und hochaufgelöste Originale (U1, S. 20, 22); Negativ-Logo, CMYK-/Pantone-Werte und
CI-Anwendung; Zitate Tonne (S. 2) und Kiesewetter (S. 6); PGN-Claims, Leistungsaussagen S. 20, Referenzen S. 22 und
eine mögliche Ansprechperson auf U4.

## Aufbau des Repos

```
broschuere/
├── content/                 Texte (fachlich geprüft, verbindlich)
│   ├── pages/NN-slug.json   Text je Seite: Headline, Blöcke, Tabellen, Diagrammdaten, Fußnoten, Fakt-IDs
│   ├── copy.md              Gesamttext aller 24 Seiten zur Freigabe, Anhang A (Rückfragen an die NBank) und B (Zulieferungen PGN)
│   ├── REDAKTIONSREGELN.md  Hinweis-Diät und Stimme (verbindlich)
│   └── plan.json            Dramaturgie und Seitenplan
├── src/
│   ├── template.html        HTML-Gerüst inkl. PDF-Metadaten (title, meta author/description/keywords)
│   ├── pages/NN-slug.html   Seiten-Partials (eine <section class="page" data-page="NN"> je Datei)
│   ├── styles.css           Designsystem „Planwerk“: Tokens, Typografie, Layout, Komponenten
│   ├── assets/pgn/          Logos, Signaturen, Fotos, Planzeichen (MANIFEST.md)
│   └── fonts/               Montserrat + Work Sans (SIL OFL, Lizenzen in fonts/licenses), statische PDF-Instanzen in fonts/static
├── DESIGN.md                Designsystem: Grundregeln, Komponentenkatalog, Satzregeln
├── recherche/               Faktenbasis: factbase.md (lesbar), factbase.json (mit Belegzitaten), pgn-facts.md, pgn-ci.md, README.md
├── scripts/
│   ├── assemble.cjs         setzt template.html + src/pages/*.html zu src/index.html zusammen (Silbentrennung, geschützte Leerzeichen)
│   ├── render.cjs           rendert HTML → PDF (Playwright/Chromium) + QA-Prüfungen + PNG-Vorschauen
│   ├── fonts-static.py      erzeugt statische Schriftinstanzen (nur bei neuen Schriftschnitten nötig)
│   ├── pgn-signatures.cjs   Axonometrie, Grundriss, Planzeichen (SVG)
│   └── pgn-images.py        Duplex-Fotos, Vektor-Punktraster
└── dist/                    die beiden PGN-PDFs; dist/preview und dist/qa sind Arbeitsdateien (nicht versioniert)
```

Arbeitsweise: Textänderungen erst in `content/pages/NN-*.json` **und** `content/copy.md` freigeben, dann im Partial
`src/pages/NN-*.html` umsetzen. Jede Aussage lässt sich über die `fact_ids` einer Seite auf die Faktenbasis in
`recherche/` und die Richtlinie zurückführen. Seitenspezifisches CSS steht im Partial und beginnt immer mit dem Präfix
`.page[data-page="NN"]`. Farben werden nur über Tokens gesetzt, die Mindestschrift ist 8,5 pt (Details in `DESIGN.md`).

## Build

Voraussetzungen: Node.js ≥ 18 (getestet mit 22), Chromium für Playwright 1.56.1, `poppler-utils` (`pdfinfo`, `pdftoppm`),
ImageMagick (`montage`, nur für den Kontaktbogen der Vorschau). Python 3 nur für die Hilfsskripte (siehe unten).

```bash
cd broschuere
npm install
npx playwright install chromium    # entfällt, wenn PLAYWRIGHT_BROWSERS_PATH auf vorhandene Browser zeigt

npm run build      # src/index.html zusammensetzen → Bildschirm-PDF + Druck-PDF in dist/
npm run preview    # wie build, zusätzlich dist/preview/seite-NN.png (80 dpi) und dist/preview/uebersicht.png
```

Gleichwertig ohne npm (aus `broschuere/`; `NODE_PATH` nur nötig, wenn die Module global statt in `node_modules/` liegen):

```bash
NODE_PATH=/opt/node22/lib/node_modules node scripts/assemble.cjs
NODE_PATH=/opt/node22/lib/node_modules node scripts/render.cjs --in src/index.html \
  --pdf dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026.pdf --png dist/preview --dpi 80
```

Das Druck-PDF entsteht im selben Lauf automatisch neben dem Bildschirm-PDF. Einzelne Seite (z. B. S. 11) zur Kontrolle,
ohne Druck-PDF:

```bash
node scripts/assemble.cjs --only 11 --out src/.preview-11.html
node scripts/render.cjs --in src/.preview-11.html --pdf dist/qa/p11.pdf --png dist/qa/p11 --dpi 80 --no-print
```

**Statische Schriften (`scripts/fonts-static.py`):** Chromium bettet variable Schriften als Type 3 ein. `render.cjs`
ersetzt sie deshalb durch statische Instanzen aus `src/fonts/static/` (versioniert, ein normaler Build braucht kein
Python). Erst wenn `render.cjs` eine `FONT`-Zeile meldet (neuer Schnitt, neues Gewicht), fehlende Instanzen erzeugen
und neu rendern. Das System-Python ist meist „externally managed“ (PEP 668), deshalb in einer virtuellen Umgebung:

```bash
cd broschuere
python3 -m venv .venv                          # einmalig; .venv/ ist in .gitignore
.venv/bin/pip install fonttools brotli Pillow  # Pillow nur für scripts/pgn-images.py
.venv/bin/python scripts/fonts-static.py       # oder: source .venv/bin/activate && npm run fonts
```

Danach Build wiederholen. Bei Änderungen an der Namensgebung der Instanzen `src/fonts/static/*.woff2` löschen und das
Skript neu laufen lassen (Details im Kopf von `fonts-static.py`).

**Silbentrennung:** Headless-Chromium trennt Deutsch nicht selbst. `assemble.cjs` setzt deshalb weiche Trennstriche
(U+00AD) in Wörtern ab 8 Buchstaben. Ausgenommen sind Überschriften, Labels, Vorspann und Elemente mit `.u-nohyphens`.
Feste Trennfugen für sinnentstellende Fälle stehen in `HYPH_EXCEPTIONS`, geschützte Leerzeichen (Zahl + Einheit,
§-Zitate, „z. B.“ …) setzt `NBSP_RULES`; Zahlen- und Stufenbereiche mit „–“ („10–40 %“, „I–III“) kommen dort samt Einheit
in `.u-nowrap`. `render.cjs` entfernt vor dem PDF alle ungenutzten Trennstriche, damit Suche
und Copy & Paste sauber bleiben. Die Partials enthalten deshalb keine weichen Trennstriche: Änderungen immer im
Partial vornehmen und neu zusammensetzen, `src/index.html` nie von Hand bearbeiten (die Datei wird erzeugt und ist nicht versioniert).

**QA-Ausgabe von `render.cjs`:** Diese Zeilen gelten als Fehler und müssen vor einer Freigabe leer sein:
- `OVERFLOW`: Inhalt ragt über die Seite oder einen Rahmen hinaus.
- `LASTLINE`: Ein Trennrest steht allein in der letzten Zeile.
- `SATZSPIEGEL`: Inhalt endet unter der Satzspiegel-Unterkante (273 mm) oder ragt aus einem Block mit fester Höhe.
- `PDFUA`: Befund der PDF/UA-Vorprüfung, z. B. Link ohne Namen oder Sprung der Überschriftenebene.
- `FEHLER`: Lade- oder Renderfehler.
- `FONT`: Ein Schriftschnitt fehlt. Dann `scripts/fonts-static.py` ausführen (siehe oben) und neu rendern.

Zusätzlich muss die Ausgabe `.page-Elemente: 24, PDF-Seiten: 24` lauten. Die externe Abnahme der Barrierefreiheit erfolgt mit veraPDF/PAC.

## Logo und CI

Die PGN-Fassung nutzt das Designsystem **„Planwerk“** (Details und Komponentenkatalog: `DESIGN.md`).

- **Farben:** PGN-Rot #B71E3F (Verlauf 160° nach #8B2939), Fast-Schwarz #202020, Anthrazit #3C3C3B, warmes Hellgrau #F4F3F2,
  Grau #626160 (Text) bzw. #757474/#868686 (Linien). Kein Grün (#26772B gehört der PGN Projektgesellschaft). Alle Werte stehen
  als Tokens in `:root` von `src/styles.css`; Komponenten nutzen nur die semantischen Tokens. Programmteile 2.1–2.6:
  `--bs-21` … `--bs-26` (validiert, immer mit Nummer). CMYK-/Pantone-Werte für PGN-Rot bei PGN bzw. der Agentur erfragen.
- **Schriften:** Montserrat (Überschriften, Zahlen, Labels) und Work Sans (Text), selbst gehostet in `src/fonts/` (SIL OFL);
  Pfeile, ≤ ≥ ≈ ✓ ✗ ‰ und schmale Leerzeichen aus der Teilmenge `pgn-symbols-wght-normal.woff2`. Für das PDF ersetzt
  `scripts/render.cjs` die variablen Schriften durch statische Instanzen (`scripts/fonts-static.py`, Familien in `FAMILIES`
  bzw. `FAMS`) – sonst Type 3.
- **Logo:** `src/assets/pgn/logo-rot.svg` (Standard), `logo-negativ.svg`/`logo-weiss.svg` für Rot (Freigabe offen),
  `logo-mark-rot.svg` im Plankopf. Kein Logo von NBank oder Land.
- **Signaturen und Bilder:** `node scripts/pgn-signatures.cjs` (Axonometrie, Grundriss, Planzeichen),
  `.venv/bin/python scripts/pgn-images.py` (Duplex-Fotos, Vektor-Punktraster; braucht Pillow); Specimen: `node scripts/specimen.cjs`.
- **Metadaten:** Titel, Autor, Thema und Stichwörter des PDFs kommen aus `<title>` und `<meta name="author|description|keywords">`
  in `src/template.html` (Vorgaben in `render.cjs`: Autor/Erzeuger Planungsgemeinschaft Nord GmbH).

## Offene fachliche Punkte (vor Druckfreigabe klären)

Nach der Hinweis-Diät (`content/REDAKTIONSREGELN.md`) stehen offene Fachfragen nicht im Heft, sondern in
`content/copy.md`, **Anhang A „Offene fachliche Rückfragen an die NBank“** (19 Punkte, maßgebliche Nummerierung), und in
`recherche/factbase.md` (Abschnitt „Lücken (Kritiker) / weiterhin offen“). Schwerpunkte: Fortschreibung der
Bemessungsgrenzen zum 01.10.2026 (betrifft S. 3, 4, 8, 13 und die Modellrechnung S. 10–12), Kombinierbarkeit der Zuschläge in 2.1, Tilgungsmodalitäten
(Term Sheet S. 9, Jahresrechnung S. 11), Swapsatz der Überkompensationsprüfung, Mietenstufen ab 01.01.2027,
Sonderfragen Ostfriesische Inseln (2.4), 2.2, 2.3 (Klassensprung, Kostenschlüssel, BEG) und 2.5 (Zwischenlaufzeiten,
Kombination) sowie die Abstimmung der Zitate mit den Pressestellen.

## Frühere Fassung (v1)

Die NBank-Fassung v1 (20 Seiten, freigabegeprüft, Stand 21.10.2026) ist **Commit `b347308`**. Ihre PDFs lagen unter
`dist/Mietwohnraumfoerderung-Niedersachsen-2026*.pdf` und sind aus dem Arbeitsstand entfernt. Abruf bei Bedarf:

```bash
git show b347308:broschuere/dist/Mietwohnraumfoerderung-Niedersachsen-2026.pdf > /tmp/nbank-v1.pdf
git show b347308:broschuere/dist/Mietwohnraumfoerderung-Niedersachsen-2026-Druck-3mm-Beschnitt.pdf > /tmp/nbank-v1-druck.pdf
git switch --detach b347308    # kompletter Quellstand der v1 (zurück mit: git switch -)
```

## Korrekturschleife mit kommentiertem PDF

Korrekturen können direkt im PDF gemacht werden (Acrobat, Vorschau, PDF-XChange, Foxit …): Notizen, Markierungen,
Durchstreichungen, „Text ersetzen“, Textfelder, Freihand. Das Skript liest alle Kommentare mit Seite, Position (mm),
betroffenem Text, Zeile und Bildausschnitt aus und ordnet sie der Textdatei der Seite zu:

```bash
pip install pymupdf
python3 scripts/pdf-kommentare.py Korrektur.pdf --out dist/korrektur
# → dist/korrektur/kommentare.md, kommentare.json, ausschnitt-SNN-NN.png
```
