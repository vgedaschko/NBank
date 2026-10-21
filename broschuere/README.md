# Wohnraum, der sich rechnen kann. – Mietwohnraumförderung Niedersachsen 2026

> **Entwurf – vor Veröffentlichung fachliche Freigabe durch NBank/MW.**
> Die Broschüre verwendet bewusst kein Logo und keine CI der NBank (Herausgeberzeile nur als Text).
> Offizielles Logo und CI werden über die Tokens in `src/styles.css` eingesetzt (siehe [Logo und CI](#logo-und-ci)).

## Zweck

Die Broschüre umfasst 20 Seiten im Format DIN A4 hoch und erklärt die **RL Mietwohnraum 2026** (RdErl. d. MW v. 25.06.2026,
Nds. MBl. 2026 Nr. 319, in Kraft seit 01.07.2026). Zielgruppen sind Wohnungsunternehmen, Genossenschaften,
Investorinnen und Investoren, Projektentwicklung und Kommunen. Die Broschüre liest die Richtlinie wie ein Investment-Memo:
zuerst die Zahlen, dann die Orientierung und die Ertragsseite, dann die Finanzierung mit Modellrechnung und Szenarien,
danach die übrigen Programmteile, zuletzt Standort, Kommune und Antragsweg. Redaktionsstand: **21.10.2026**.

Ergebnis (in `dist/`):

| Datei | Zweck |
|---|---|
| `Mietwohnraumfoerderung-Niedersachsen-2026.pdf` | Bildschirm-PDF: getaggt, Lesezeichen aus den Überschriften, Metadaten (Info + XMP), Link-Beschreibungen, PDF/UA-Kennung bei fehlerfreier Vorprüfung |
| `Mietwohnraumfoerderung-Niedersachsen-2026-Druck-3mm-Beschnitt.pdf` | Druck-PDF mit 3 mm Beschnitt, TrimBox/BleedBox gesetzt; RGB, die Konvertierung nach PDF/X-4 übernimmt die Druckerei |

## Inhalt

| S. | Bereich | Überschrift |
|---:|---|---|
| 1 | Titel | Wohnraum, der sich rechnen kann. |
| 2 | Einstieg | Damit sich Investieren wieder rechnet (Editorial, Inhalt) |
| 3 | Überblick · Kennzahlen | Die Förderung in sieben Zahlen |
| 4 | Überblick · Neu und Grundcheck | Was 2026 neu ist |
| 5 | Überblick · Navigator | Vom Vorhaben zum passenden Programmteil |
| 6 | Ertragsseite · Mieterkreis | Ihr Mieterkreis: drei Einkommensgruppen |
| 7 | Ertragsseite · Mieten | Mieten: gedeckelt, aber planbar |
| 8 | Finanzierung · Programmteil 2.1 | Bis zu 80 % Förderquote |
| 9 | Finanzierung · Term Sheet | Konditionen auf einem Blatt |
| 10 | Finanzierung · Modellrechnung | 20 Wohnungen, 7,0 Mio. €: bis zu 5,6 Mio. € Förderung |
| 11 | Finanzierung · Szenarien | Mehr Zuschuss oder mehr Miete? |
| 12 | Neubau · Programmteil 2.2 | Reiner Zuschuss statt Darlehen |
| 13 | Neubau · Programmteil 2.4 | Höhere Kostengrenze, 10 % Eigenmittel |
| 14 | Bestand · Programmteil 2.3 | Zuschuss nach Klassensprung |
| 15 | Bestand · Stichtag 31.12.2026 | Wahlrecht für Modernisierungsanträge |
| 16 | Bestand · Programmteil 2.5 | Festbetrag für freie Bestandswohnungen |
| 17 | Bestand · Programmteil 2.6 | Bindung verlängern, Zins auf 0 % |
| 18 | Umsetzung · Standort und Kommune | Wo Bedarf gilt – und was Kommunen tun können |
| 19 | Umsetzung · Antragsweg | Vom Vorgespräch bis zum Verwendungsnachweis |
| 20 | Umsetzung · Kontakt und Unterlagen | Rechnen Sie Ihr Projekt durch – bevor Sie beginnen. (Kontakt, Unterlagen, Impressum) |

Die Seiten sind als Doppelseiten angelegt (Rückendrahtheftung): 2|3, 4|5 … 18|19. Die Mittel-Doppelseite 10|11 trägt
Modellrechnung und Szenarien.

## Aufbau des Repos

```
broschuere/
├── content/                 Texte (fachlich geprüft, verbindlich)
│   ├── pages/NN-slug.json   Text je Seite: Headline, Blöcke, Tabellen, Diagrammdaten, Fußnoten, Fakt-IDs
│   ├── copy.md              Gesamttext aller 20 Seiten zur fachlichen Freigabe, mit Anhang „Offene fachliche Punkte“
│   └── plan.json            Dramaturgie und Seitenplan
├── src/
│   ├── template.html        HTML-Gerüst inkl. PDF-Metadaten (title, meta author/description/keywords)
│   ├── pages/NN-slug.html   Seiten-Partials (eine <section class="page" data-page="NN"> je Datei)
│   ├── styles.css           Designsystem: Tokens, Typografie, Layout, Komponenten
│   ├── assets/*.svg         Titelillustration, Haus-Diagramm, Piktogramme, UI-Icons
│   └── fonts/               Fraunces + Inter (SIL OFL, Lizenzen in fonts/licenses), statische PDF-Instanzen in fonts/static
├── DESIGN.md                Designsystem: Grundregeln, Komponentenkatalog, Satzregeln
├── recherche/               Faktenbasis: factbase.md (lesbar), factbase.json (mit Belegzitaten), README.md
├── scripts/
│   ├── assemble.cjs         setzt template.html + src/pages/*.html zu src/index.html zusammen (Silbentrennung, geschützte Leerzeichen)
│   ├── render.cjs           rendert HTML → PDF (Playwright/Chromium) + QA-Prüfungen + PNG-Vorschauen
│   └── fonts-static.py      erzeugt statische Schriftinstanzen (nur bei neuen Schriftschnitten nötig)
└── dist/                    PDFs (versioniert); dist/preview und dist/qa sind Arbeitsdateien (nicht versioniert)
```

Arbeitsweise: Textänderungen erst in `content/pages/NN-*.json` **und** `content/copy.md` freigeben, dann im Partial
`src/pages/NN-*.html` umsetzen. Jede Aussage lässt sich über die `fact_ids` einer Seite auf die Faktenbasis in
`recherche/` und die Richtlinie zurückführen. Seitenspezifisches CSS steht im Partial und beginnt immer mit dem Präfix
`.page[data-page="NN"]`. Farben werden nur über Tokens gesetzt, die Mindestschrift ist 8,5 pt (Details in `DESIGN.md`).

## Build

Voraussetzungen: Node.js ≥ 18 (getestet mit 22), Chromium für Playwright 1.56.1, `poppler-utils` (`pdfinfo`, `pdftoppm`),
ImageMagick (`montage`, nur für den Kontaktbogen der Vorschau). Für `npm run fonts` zusätzlich Python 3 mit `fonttools` und `brotli`.

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
  --pdf dist/Mietwohnraumfoerderung-Niedersachsen-2026.pdf --png dist/preview --dpi 80
```

Einzelne Seite (z. B. S. 11) zur Kontrolle:

```bash
node scripts/assemble.cjs --only 11 --out src/.preview-11.html
node scripts/render.cjs --in src/.preview-11.html --pdf dist/qa/p11.pdf --png dist/qa/p11 --dpi 80
```

**Silbentrennung:** Headless-Chromium trennt Deutsch nicht selbst. `assemble.cjs` setzt deshalb weiche Trennstriche
(U+00AD) in Wörtern ab 8 Buchstaben. Ausgenommen sind Überschriften, Labels, Vorspann und Elemente mit `.u-nohyphens`.
Feste Trennfugen für sinnentstellende Fälle stehen in `HYPH_EXCEPTIONS`, geschützte Leerzeichen (Zahl + Einheit,
§-Zitate, „z. B.“ …) setzt `NBSP_RULES`. `render.cjs` entfernt vor dem PDF alle ungenutzten Trennstriche, damit Suche
und Copy & Paste sauber bleiben. Die Partials enthalten deshalb keine weichen Trennstriche: Änderungen immer im
Partial vornehmen und neu zusammensetzen, `src/index.html` nie von Hand bearbeiten (die Datei wird erzeugt und ist nicht versioniert).

**QA-Ausgabe von `render.cjs`:** Diese Zeilen gelten als Fehler und müssen vor einer Freigabe leer sein:
- `OVERFLOW`: Inhalt ragt über die Seite oder einen Rahmen hinaus.
- `LASTLINE`: Ein Trennrest steht allein in der letzten Zeile.
- `PDFUA`: Befund der PDF/UA-Vorprüfung, z. B. Link ohne Namen oder Sprung der Überschriftenebene.
- `FEHLER`: Lade- oder Renderfehler.
- `FONT`: Ein Schriftschnitt fehlt. Dann `npm run fonts` ausführen und neu rendern.

Zusätzlich muss die Ausgabe `.page-Elemente: 20, PDF-Seiten: 20` lauten. Die externe Abnahme der Barrierefreiheit erfolgt mit veraPDF/PAC.

## Logo und CI

- **Farben:** Die Palette steht zentral in `:root` von `src/styles.css` (Petrol, Terrakotta, Sand, Amber, Baustein-Farben
  `--bs-21` … `--bs-26`). Die semantischen Tokens (`--color-primary`, `--color-accent`, `--color-loan`, `--color-grant`,
  `--color-equity`, `--signal`, `--baustein-21` … `--baustein-26`) verweisen darauf. Für die NBank-CI nur die Palettenwerte
  ersetzen. Komponenten und Seiten-CSS nutzen ausschließlich Tokens und übernehmen die Änderung automatisch. Kontraste danach prüfen,
  vor allem bei weißer Schrift auf `--color-primary` (S. 1 und S. 20).
- **Schriften:** `--font-display` und `--font-text` stehen in `src/styles.css`. Bei anderen Familien müssen außerdem
  `src/fonts/fonts.css`, `scripts/fonts-static.py` und die Schriftzuordnung in `scripts/render.cjs` angepasst werden.
  Diese ist auf Fraunces und Inter ausgelegt, sonst bettet Chromium variable Fonts als Type 3 ein.
- **Logo:** Das Logo als SVG in `src/assets/` ablegen und auf S. 1 (Fuß neben der Herausgeberzeile) und S. 20 (Impressum) einsetzen.
  Danach den Gesamtlauf auf `OVERFLOW` prüfen.
- **Metadaten:** Titel, Autor, Thema und Stichwörter des PDFs kommen aus `<title>` und `<meta name="author|description|keywords">`
  in `src/template.html`.

## Offene fachliche Punkte (vor Druckfreigabe klären)

In der Broschüre sind diese Stellen als „mit der NBank klären“ oder als „eigene Berechnung/Ableitung“ gekennzeichnet.
Die ausführliche Fassung steht in `content/copy.md` (Anhang „Offene fachliche Punkte – Rückfragen an die NBank“) und in
`recherche/factbase.md` (Abschnitt „Lücken (Kritiker) / weiterhin offen“).

**Rückfragen an die NBank (aus `copy.md`):**
1. **Bemessungsgrenzen:** Wurden sie zum 01.10.2026 fortgeschrieben (RL Nr. 5.3.2.2)? Bis 21.10.2026 war nichts veröffentlicht.
   Betroffen sind S. 3, 4, 8, 10, 13, 15, 20 und die Modellrechnung (4.500 bzw. 5.200 €/m²).
2. **Zuschläge 2.1:** Lassen sich Housing First (+10 Prozentpunkte) und Modellprojekt (+5 Prozentpunkte) addieren? Vordruck 1011 nennt höchstens 85 bzw. 90 %.
   Dürfen die Eigenmittel dann unter 20 % liegen?
3. **Antragsberechtigung:** Sind Personengesellschaften ohne eigene Rechtspersönlichkeit (z. B. GbR) antragsberechtigt?
4. **§ 4 Abs. 2 DVO-NWoFG:** Welche Fördersätze und Höchstmieten gelten für Wohnungen mit bis zu +20 % Einkommensgrenze?
5. **A-Haushalte in B/C-Wohnungen:** Ist der Einzug zur B/C-Höchstmiete zulässig (eigene Auslegung von § 7 NWoFG und RL Nr. 1.6)?
6. **Ostfriesische Inseln (2.4):** Offen sind der EH-40-Mietaufschlag, Mietenstufe und Mietobergrenzen in 2.2/2.3, die Abgrenzung von 2.4 und 2.2, die Bemessung des Ersterwerbs und die Sicherheiten.
7. **2.2 EH 40:** Gelten Bemessungsgrenze und Bodenrichtwert-Deckel? Ist 2.1 + 2.2 im selben Gebäude möglich?
8. **2.5 Bindungserwerb:** Wie werden Zwischenlaufzeiten (z. B. 7 oder 12 Jahre) bezuschusst?
9. **Überkompensationsprüfung:** Welchen 30-jährigen Swapsatz verwendet die NBank (Quelle, Referenz EURIBOR oder €STR, Stichtag, Mittelung)? Welchen Betrachtungszeitraum? Welche
   VoFi-Ansätze (nicht veröffentlicht)? Was folgt, wenn die Rendite die Schwelle übersteigt?
10. **Tilgung:** Welchen Tilgungssatz und Zahlungsrhythmus legt die NBank fest? Die RL nennt keinen Satz (betrifft das Term Sheet und die Modellrechnung).
11. **Mietenstufen ab 01.01.2027** (Entwurf BR-Drs. 474/26): Wie wirken sie auf laufende Anträge und Bewilligungen?
12. **Klassensprung 2.3 ab 2027:** Wie wird bewertet, wenn sich die Rechennorm ändert (DIN V 18599 → DIN/TS 18599:2025-10)?
13. **Antragsunterlagen:** Gilt die Checkliste vom 20.07.2025 für die RL 2026 weiter?
14. **Hinweis an die NBank:** In der Arbeitshilfe „Kosten-Finanzierungsaufteilung (08/26)“ steht für Gruppe C ein falscher Zellbezug (E21 statt E15).
15. **Zitate** (Tonne, Kiesewetter) mit den Pressestellen von MW und NBank abstimmen.

**Weitere Lücken (aus `recherche/factbase.md`):**
- Kostenaufteilung in gemischten Vorhaben: Ist die NBank-Arbeitshilfe verbindlich? Wie werden Gemeinschaftsräume, Tiefgarage und Stellplätze behandelt? Gilt die
  Bemessungsgrenze je Einkommensgruppe oder für das ganze Gebäude? Wie wird bei Teilbindung in der Modernisierung gerechnet?
- Kombination mit KfW/BEG (297/298, 296, 261, BEG EM): Wie werden die Mittel in der Überkompensationsprüfung behandelt? Wie verhalten sich die Bemessungsgrundlagen von NBank und KfW?
  Für BEG EM fehlt die BAnz-Fundstelle.
- Gebietskulisse: Stand und Methodik der NBank-Bedarfskarte (dort ist „Hemmoor“ fehlerhaft codiert). Welche Gemeinden haben eine Verordnung zum Benennungsrecht
  nach § 7 Abs. 3 NWoFG? Werden weitere Hochschulstandorte anerkannt („insbesondere“)? Bleiben die WoGV-Mietenstufen 2027 unverändert?
- Belegung und Mietvertrag: Gibt es eine Fehlbelegungsabgabe? Sind Einmalleistungen erlaubt (Kaution, Mietvorauszahlung, Baukostenzuschuss)? Wie werden genossenschaftliche
  Geschäftsanteile und Dauernutzungsverträge behandelt (RL Nr. 11.7.1)?
- Haben NBank-Formulare und -Merkblätter die Umbenennung des GEG in GModG (ab 29.07.2026) nachvollzogen?
