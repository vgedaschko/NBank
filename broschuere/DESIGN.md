# PGN-Designsystem „Planwerk“ – Komponentenkatalog

Broschüre **Mietwohnraumförderung Niedersachsen 2026** (RL Mietwohnraum 2026), Herausgeber **Planungsgemeinschaft Nord GmbH**
(PGN Architekten und Ingenieure, Rotenburg (Wümme)). DIN A4 hoch, 24 Seiten, Rückendrahtheftung: U1 Titel · U2 Editorial/Inhalt ·
20 Innenseiten (S. 3–22, mit dem Impressum auf S. 22) · U3 Quellen · U4 Rückseite. Seit der Änderungsrunde vom
13.11.2026 ohne das Blatt „Stichtag 31.12.2026“; Bogenseiten 17–23 heißen seitdem 16–22, S. 23 ist neu.

**Leitidee:** Die Broschüre ist ein **Planwerk**. Die Gestaltung kommt aus dem Handwerk eines Generalplaners: Planrahmen,
Schriftfeld mit Blattnummer, Achskreise, Maßketten mit 45°-Architektenstrich, Höhenkoten, Schnittlinie, Maßstabsleiste,
Nordpfeil, Axonometrie. Rot ist **der eine Akzent** und zugeteilt (Titellinie, ein Wort im H1, Zuschuss, Achtung, Marke; s. 0a); alles andere steht in
Fast-Schwarz, Anthrazit und warmem Grau auf weißem Papier. Typografie wie auf pgn-architekten.de: Montserrat 900 in
Versalien, Signaturwort in Montserrat 800 kursiv in PGN-Rot, Fließtext in Work Sans.

Basis ist der Siegerentwurf **A „Bauplan“**. Übernommen aus der Jury:

| Herkunft | Übernahme | Umsetzung |
|---|---|---|
| A | Planrahmen, Schriftfeld, Maßketten-Diagramm, Achskreise, Höhenkoten, Schnittlinie A–A, Maßstabsleiste als Achse, Bauzeitenplan nach HOAI mit Bewilligungslinie, Planlegende, Axonometrie, „Rotpause“ auf U4 | U1/U4, `.chart__svg`, `.bzp`, `.plan-legend`, `.cutline`, `.kote`, `.axis-no` |
| A korrigiert | Titelfeld im Planrahmen geschlossen; Rotpause mit Wandstärken (Poché), Fenster nie auf Trennwandachsen, Bemaßung frei von der Rahmenlinie; keine dekorativen Achskreise im Seitenkopf | `sig-grundriss.svg`, `.cover__stamp` |
| A → Brauerstraße | Axonometrie nach der Kubatur des NBank-geförderten Projekts Brauerstraße (Walmdach, Kopfbau, Balkone, PV); 80-%-Marke auf der 30,00-m-Kette, 20 % Rest | `sig-axo-brauerstrasse.svg` |
| B | Fernwirkung: Kennzahlfeld U1 auf PGN-Rotverlauf mit weißer 80; Plakatzeilen („PLANEN. FÖRDERN. *BAUEN.*“); große Programmnummer „2.1“; Daumenregister am Außenrand (links gespiegelt); Höchstmieten in Montserrat 800 mit Tabellenziffern; Bauzeitenplan Rot = förderspezifisch / Fast-Schwarz = Planen und Bauen; Horizont U1 = U4 | `.cover__kpi`, `.claim`, `.chapter-no`, `.bs-register`, `.table--figures`, `--horizon` |
| C | Vektor-Punktraster der Brauerstraße in PGN-Rot; Duplex-Banner mit Achskreisen; Höhenkoten „±0 = Bewilligung“; Mini-Plankopf statt 14-mm-Schriftfeld auf Innenseiten; kundenzentrierte Schriftfeldtexte; Light/Black-Kontrast als zweite Stimme | `sig-raster-brauerstrasse.svg`, `.photo__axes`, `.steps--kote`, `.page__foot`, `.h1 .light` |
| Jury 3 | Druckregeln (rote Linien ≥ 0,25 mm, rote Schrift ≥ 9 pt/≥ 600, kein Negativtext < 9 pt aus Verläufen), Massendaten-Tabellenstufe, leichte Diagrammvariante (Balken 6–7 mm), kein vollflächiger Papierton, Schraffur nur mit Beschriftung | Abschnitte 0, 1, 6 |
| bewusst nicht | Schiefer-Darlehen aus C (außerhalb CI) · riesige freistehende „80“ ohne Architekturkontext aus B (Rabattplakat-Risiko) · Grün (#26772B gehört der PGN Projektgesellschaft) | – |

| Datei | Inhalt |
|---|---|
| `src/styles.css` | Tokens, Seitenrahmen, Typografie, Layout-Utilities, alle Komponenten, Umschlag |
| `src/fonts/fonts.css` | Montserrat + Work Sans (latin, latin-ext, normal + italic) + PGN-Symbol-Teilmenge; Fraunces/Inter (v1, ungenutzt) |
| `src/assets/pgn/` | Logos, Signaturen (`sig-*.svg`), Punktraster, Duplex-Fotos (`img/`), QR-Code, Werte-Icons |
| `scripts/pgn-signatures.cjs` | erzeugt `sig-*.svg` (Axonometrie, Grundriss, Planzeichen) |
| `scripts/pgn-images.py` | erzeugt Duplex-JPGs und das Vektor-Punktraster aus `ref/*.jpg` (Pillow) |
| `scripts/specimen.cjs` | baut `src/.preview-specimen.html` (nicht versioniert): U1, Fachseite 2.1, PGN-Leistungen, Über PGN, Komponenten I–III, U4 – zugleich Bauplan (`foerdermix()`, `bzp()`) |

```bash
# Specimen bauen und rendern (aus broschuere/)
node scripts/specimen.cjs
NODE_PATH=/opt/node22/lib/node_modules node scripts/render.cjs --in src/.preview-specimen.html \
  --pdf dist/qa/specimen.pdf --png dist/qa/specimen --dpi 70 --no-print
# Druck-PDF mit 3 mm Beschnitt zum Prüfen der randabfallenden Flächen
NODE_PATH=/opt/node22/lib/node_modules node scripts/render.cjs --in src/.preview-specimen.html \
  --pdf dist/qa/specimen.pdf --print-pdf dist/qa/specimen-druck.pdf
```

---

## 0 · Grundregeln (verbindlich)

1. **Farben nur über Tokens** (`var(--…)`). Komponenten nutzen ausschließlich die *semantischen* Tokens (`--fg`, `--text`, `--surface-2`, `--accent-text` …). Dann funktionieren sie auf Weiß, Papier, Anthrazit und Rot. **Kein Grün** (#26772B ist die Farbe der PGN Projektgesellschaft Nord GmbH; das Modul „Schlüsselfertig“ steht in Anthrazit).
2. **Schriften nur aus `fonts/fonts.css`**: Montserrat Variable (Überschriften, Zahlen, Labels, Diagrammwerte) und Work Sans Variable (Fließtext, Modultext, Tabellentext, Diagrammbeschriftung). **Pfeile und Symbole `→ ↔ ≤ ≥ ≈ ✓ ✗ ‰` immer als echtes Zeichen** tippen, ebenso schmale geschützte Leerzeichen (U+202F, U+2009) und den geschützten Bindestrich (U+2011): Montserrat und Work Sans haben diese Zeichen nicht; sie kommen aus der Teilmenge `pgn-symbols-wght-normal.woff2` (InterVariable, opsz fest 14, Achse wght), die für beide Familien in normal und italic registriert ist. `€ „ “ ‚ ‘ – — § ½ ² ·` haben beide Familien selbst.
   **Im PDF statische Instanzen:** `scripts/render.cjs` ersetzt jede genutzte Kombination aus Familie, Stil und `wght` durch eine statische Instanz aus `src/fonts/static/` (Familien „FI mn-w900“, „FI wi-w400“ …, Liste `instances.json`; Symbolteilmenge je Gewicht `sym-wNNN.woff2`). Fehlt eine Instanz, meldet der Lauf `FONT: … fehlen` und schreibt `needed.json`; dann `python3 scripts/fonts-static.py` (Python mit fontTools + brotli) und neu rendern. Ziel: „Statische Schriften: N/N Textstellen zugeordnet“ und in `pdffonts` **nur CID TrueType**. Kein `stroke`/`paint-order` auf Text (Skia setzt gestrichenen Text als Type 3; `.t-halo` nicht verwenden).
3. **Mindestschrift 8,5 pt** – auch in SVG (`3px` bei 1 Einheit = 1 mm). 8,5 pt (`--fs-micro`) nur für Fundstellen, Bildunterschriften, Achsen, Versal-Labels, Schriftfeld-Bezeichnungen, Badges. **Text, Modultext und Tabellen 9,5 pt / 1,42** (`--fs-body` = `--fs-small` = `--fs-module`), auf dichten Seiten 9 pt. Vorspann 12 pt. Die Stufen stehen in 0a.
4. **Druckregeln (Offset, PGN-Rot aus drei Druckfarben):** rote Linien ≥ 0,25 mm (`--rule-red-min`), rote Schrift ≥ 9 pt und ≥ 600 (`--fs-label-accent` 9 pt: Achtung- und Frist-Label, Stempel „Modellrechnung“; die übrigen Labels stehen seit 12.11.2026 in Schwarz und 8,5 pt), kein Negativtext unter 9 pt aus Verläufen (weiß auf Rot: ≥ 9 pt, ≥ 600; Fließtext auf Rot nur ≥ 10 pt). PGN-Rot nach Möglichkeit als Sonderfarbe anlegen (bei PGN/Agentur „klar“ erfragen). **Kein vollflächiger Papierton** auf Innenseiten (`#F4F3F2` druckt als 4-%-Fläche wolkig) – Papier nur für Kästen, Bänder, die Blatt-Zelle und höchstens die Mittel-Doppelseite (`.page--accent`); für ein getöntes Heft Naturpapier statt Fläche.
5. **Silbentrennung** setzt `scripts/assemble.cjs` (weiche Trennstriche, `HYPH_EXCEPTIONS`, `NBSP_RULES` – unverändert aus v1, s. README). Überschriften, Titel, Zahlen und Versal-Labels bekommen **keine** automatischen Trennstriche (`NOHY_CLASSES`, ergänzt um `claim`, `service__title`, `reference__name`, `bzp__title`, `keyplan`, `kote`, `axis-no`, `titleblock__value`, `page__running` …). Überschriften stehen auf `hyphens: manual`: **Montserrat-Versalien sind breit – lange Komposita in H1/Claim immer von Hand an der Fuge trennen** (`Mietwohnraum&shy;förderung`, `Modernisierungs&shy;anträge`). Faustregel H1 25 pt: ≈ 6,8 mm je Versal → 14 Zeichen auf 8 Spalten (≈ 99 mm), 19 Zeichen auf 12 Spalten.
   **Seit der CSS-Integration (22.10.2026):** Zahlen- und Stufenbereiche mit Halbgeviertstrich („10–40 %“, „6,50–9,00 €“, „15–20 Jahre“, „I–III“, „08:00–17:00“) setzt der Assembler samt Einheit in `.u-nowrap` – Chromium bricht sonst nach „–“ um. Inhalt von `<svg>` bleibt bis zum schließenden `</svg>` unberührt, auch wenn die Signatur ein eigenes `<style>` trägt (früher setzte das innere `</style>` den Zustand zurück → Trennstriche in SVG-Text, LASTLINE-Fehlalarme). Neue Fugen: `Gebäude|nutz|fläche`, `Einkommens|gruppe`. `NOHY_CLASSES` + `ph`, `runin`, `bs-no`.
   **Einheitenzeichen im Versalsatz bleiben klein** („JE m² WOHNFLÄCHE“, nicht „JE M²“): Der Assembler setzt „m²“ in allen Elementen ohne Trennung (`NOHY_TAGS`/`NOHY_CLASSES`: Überschriften, Labels, Vorspann, Tabellenköpfe) in `<span class="u-unit">` (`text-transform: none`). Ein neues Versal-Element mit Einheit gehört deshalb in `NOHY_CLASSES`; an anderer Stelle `.u-unit` von Hand setzen. In SVG-Text keine Einheiten in `.t-caps`.
6. **Keine negativen Ränder an Grid-/Flex-Kindern** (Chromium-Druck rechnet sie anders). Ausnahme: die rote Titellinie der H1 hängt per `::before` 5,75 mm links neben dem Satzspiegel – das ist ein absolut positioniertes Pseudo-Element, kein Rand.
7. **Randabfallend** (Daumenregister, Umschlagverlauf, Grundriss U4) bekommt `data-bleed`. Verläufe laufen nur über `.cover__art` in den Beschnitt (`render.cjs` verlängert dort `left/top/width/height` und die viewBox ganzseitiger SVGs); Vollton-Flächen mit `data-bleed` verlängert der Druck-Lauf per Schatten. Text ≥ 5 mm vom Endformat.
8. **Förderquoten mit „bis zu“** nur in Headline, Kennzahl, Tabellen- und Diagrammkopf („Höchstsätze“); Eigenmittel „mind.“. Vorbehalte, Fundstellen und Haftung stehen einmal im Impressum (S. 22) – siehe `content/REDAKTIONSREGELN.md` (Hinweis-Diät). Genau ein Achtung-Kasten im Heft (Vorhabenbeginn); der Frist-Kasten 31.12.2026 ist am 13.11.2026 mit dem Blatt „Stichtag“ entfallen.
9. **Querverweise** „→ S. N“ als Link `<a class="pageref" href="#seite-NN">→&nbsp;S.&nbsp;N</a>`; jede `section.page` trägt `id="seite-NN"`. **Wortlaut wie im JSON:** steht der Verweis dort in Klammern, bleiben Klammern und Satzzeichen (`<span class="u-nowrap">(<a class="pageref" …>…</a>).</span>`) – auf allen Seiten gleich. Der Verweis steht halbfett (Work Sans 600) in Schrift, Größe und Farbe des umgebenden Textes, ohne Kästchen und ohne Polster; das gilt auch auf Anthrazit (`.page--dark`, `.on-dark`, `.contact--dark`). **Keine Links in Absätzen, die im Mehrspaltensatz über eine Spaltengrenze laufen:** Chromium schreibt dort zusätzlich eine Link-Annotation an die Position vor dem Umbruch (S. 2: Geisterlink über dem Inhaltsverzeichnis; `render.cjs` meldet „Link-Annotation ohne passenden DOM-Link“).
10. **Barrierefreiheit im PDF** (getaggt): `<figure>` ohne eigene Rolle → `role="group"`; Diagramm-SVGs `role="img"` + vollständiges `aria-label`; Signaturen, Planrahmen, Fuß, Register, Achskreis-Überlagerung `aria-hidden="true"` (Artefakte); Fotos mit `alt`; englische Begriffe `<span lang="en">`. Kein bedeutungstragender Generated Content (`::before` nur für Striche, Marker, Dreiecke; Ausnahme Zitatzeichen „ “ und das Label „Blatt“ im Artefakt-Fuß).
11. **Seitenspezifisches CSS** nur im `<style>` der eigenen `<section>` mit Präfix `.page[data-page="NN"]`; dort keine neuen Hex-Farben.
12. **Ein dominantes Element je Seite** (Kennzahl, Diagramm, Tabelle oder Prozess), höchstens drei Module daneben; Weißraum ist Gestaltungsmittel.
13. **Schraffur und Muster nur als Vektor** (Korrekturlauf 1): kein SVG-`<pattern>`, kein `repeating-*-gradient`, keine gekachelten Verläufe – Chromium rastert sie im PDF. Schraffur = `path.hatch[data-hatch]` (scripts/schraffur.cjs), in CSS Daten-URI-Tokens ohne Kachelung (1.3.1). `render.cjs` meldet Verstöße als `MUSTER:`.

### Klassen-Namenskonvention

| Präfix / Muster | Bedeutung | Beispiele |
|---|---|---|
| `block`, `block__element`, `block--modifier` | BEM für Komponenten | `.kf__num`, `.callout--frist`, `.service__phase` |
| `page`, `page__*`, `page--*` | Seitenrahmen und -varianten | `.page__foot`, `.page--u1`, `.page--opener` |
| `l-*` / `u-*` | Layout / Utilities | `.l-grid`, `.l-span-7`, `.l-indent`, `.u-mt-6`, `.u-caps` |
| `bs-21` … `bs-26` | Programmteil; setzt `--bs`, `--bs-tint`, `--bs-i` (Lage des Daumenregisters) | `<section class="page bs-24">` |
| `on-light`, `on-paper` (= `on-sand`), `on-dark`, `on-red` | Theme-Scope | `<aside class="offer-box offer-box--dark on-dark">` |
| SVG: `c-*` Flächen, `t-*` Text, `dim-*` Maßkette, `axb-*` Achskreis, `sb-*` Maßstabsleiste, `tl-*` Zeitstrahl, `fl-*` Ablauf, `ill-*` Illustration v1, `pict-*` Piktogramm, `sig-*` Signatur (eigene `<style>` je Datei) | nur innerhalb von SVG | `.c-grant`, `.dim-tick`, `.axb-c` |

Die **Klassen-API der v1 bleibt vollständig erhalten** (alle Selektoren, die `src/pages/01–20` nutzen, existieren weiter; sie sehen nur anders aus). Rückwärts-Aliase: `--sand-300`, `--sand-500`, `--petrol-900`, `--color-*`, `--baustein-*`.

---

## 0a · Stufung und Zuteilung (Stand 12.11.2026)

Gilt für alle Innenseiten (S. 2–23) und geht älteren Angaben in diesem Dokument vor. Im Code: `src/styles.css`, Abschnitt
„8b · STUFUNG UND ZUTEILUNG“. Der Umschlag (U1, U4) folgt Abschnitt 7. Grundsatz: Die Hausform bleibt, sie wird gestuft.

**Schriftstufen.** Fünf Stufen, dazwischen steht nichts.

| Stufe | Token | Schrift | Wofür |
|---|---|---|---|
| 25 pt | `--fs-h1` | Montserrat 900 Versalien | H1, Hauptzeile |
| 15,5 pt | `.h1 .light` (0,62 em) | Montserrat 300 Versalien, +0,05 em | zweite Stimme im H1 |
| 12 pt | `--fs-lead` · `--fs-deck` · `--fs-h3` | Work Sans 400 · Work Sans 400 · Montserrat 800 gemischt | Vorspann `.lead` · Unterzeile `.deck` · Modultitel (`.chart__title`, `.fig-head__title`, `.plan-legend__title`, `.h3`, gleichgestellt `.term__word`, `.offer-box__title`, `.callout__title`, `.program__title`) |
| 9,5 pt | `--fs-body` = `--fs-small` = `--fs-module` | Work Sans 400, Zeilenabstand 1,42 | Text, Listen, Kästen, Tabellen |
| 8,5 pt | `--fs-micro` | Work Sans 400/500 · Montserrat 700 Versalien | Labels, Tabellenkopf, Unterzeilen der Abbildungen (`.chart__sub`), Achsen, Rubrik, Kolumnentitel |

Eigene Rollen neben den Stufen:

- **Kernwerte ab 17 pt** (`--fs-fig-s` 17 · `-m` 21 · `-l` 28 · `-xl` 46 · `-hero` 84 pt; Programmnummer 60 pt, S. 16 46 pt): Kennzahlen und große Ziffern in Montserrat 800–900. Die Einheit steht in Schwarz. Steht ein Wert auf der Seite mehrfach, ist er nur einmal groß.
- **Diagrammwerte** `--svg-fs-m` 3,25 px = 9,2 pt (`t-m`, `t-val`, `t-val-ink`): eigene Diagrammstufe im SVG. Achsen und übrige Beschriftung 8,5 pt (`--svg-fs-s`).
- **Druckregel 9 pt** (`--fs-label-accent`): rote Schrift und Negativschrift nie unter 9 pt. Betrifft Achtung- und Frist-Label, den Stempel „Modellrechnung“ und die Nummer im Daumenregister.
- **Dichte Seite** `.page--dicht` am `<section class="page …">`: Text, Listen und Tabellen der ganzen Seite in 9 pt (Zeilenabstand 1,4, Modultext 1,38). Nur wenn die Seite in 9,5 pt nach ehrlichem Versuch nicht aufgeht. Nie zwei Textgrößen auf einer Seite. Reihenfolge der Mittel: Abstände seitenlokal nachziehen, Vorspann teilen, dann `.page--dicht`. Text kürzen ist kein Mittel. Dicht sind S. 3, 6, 7, 9, 14, 15, 17, 18 und 20.

**Versalien** nur: H1 samt zweiter Stimme, Rubrik der Kopfzeile, Kolumnentitel und Schriftfeld, die 8,5-pt-Labels (Tabellenkopf, `.label`, Run-in-Label `.runin`) und der Stempel. Modultitel, Unterzeile und Vorspann laufen gemischt.

**Rot** nur:

- Titellinie am H1 und **ein** Wort oder **eine** Zahl im H1 (`em`, Montserrat 800 kursiv), nie eine ganze Zeile
- Zuschuss in Daten (Flächen und Linien der Reihe; die Wertbeschriftung `t-acc` steht in Schwarz)
- Ergebniszeile der Rechenblätter (`.is-result`)
- Achtung (Achtung-Kasten S. 18 mit Einzeiler S. 5; Frist-Kasten und Stichtag-Kachel sind am 13.11.2026 entfallen)
- Daumenregister, Schlüsselplan und Programmteilfarben (2.1 = PGN-Rot)
- Stempel „Modellrechnung“ (S. 14)
- Logo. Rote Flächen, die zur Hausform gehören, bleiben: Wertefeld und Punktraster S. 21, Umschlag.

In Schwarz stehen: Labels (`.kf__pre`, `.term__label`, `.contact__label`, `.service__phase`, `.audience__label`, `.label--accent`), Einheiten (`.kf__unit`, `.seal__unit`), Aufzählungszeichen und Zähler, Fußnotenziffern, Initiale, Seitenverweise, Angebotssatz `.offer`, Hilfslinien im Diagramm (80-%-Linie `.cap-line`, Maßkette und Achskreis `--acc`) und die Linie links an Zitat, Begriff und Notiz (`.quote::before`, `.term`, `.note`).

**Kopfzeile.** Jede Innenseite S. 2–23 beginnt mit `<header class="page__header">`. Links die Rubrik `.page__section` (Montserrat 700, 8,5 pt Versalien, +0,16 em, Schwarz). Sie ist der erste Teil des Kolumnentitels im Fuß: Editorial (S. 2), Überblick (3–5), Ertragsseite (6–7), Finanzierung (8–9), Modellrechnung (10–12), Neubau (13–14), Bestand (15–16), Umsetzung (17–20), PGN (21–23). Rechts der Schlüsselplan `.keyplan`, nur auf Seiten eines Programmteils (S. 8–16). Höhe 7 mm ohne und 8,5 mm mit Schlüsselplan, darunter Haarlinie und 5 mm Abstand. Innerhalb einer Doppelseite nie gemischt, damit Kopfzeile, H1 und erste Bandlinie links und rechts auf gleicher Höhe stehen. S. 17 (Standort, ohne Schlüsselplan) steht neben S. 16 (2.5 und 2.6) und hält deshalb die Höhe der Kopfzeile mit Schlüsselplan (`min-height: 8.46mm`, seitenlokal). S. 2 trägt rechts „Inhalt“ über dem Inhaltsverzeichnis, S. 21 rechts das Label „45 Jahre PGN“. S. 22 (Impressum) und S. 23 (Quellen) tragen die Rubrik „PGN“ mit Linie wie S. 21. Die rote Kicker-Zeile über dem H1 (`.kicker`, `.kicker-row`) gibt es auf den Innenseiten nicht mehr; `.kicker` steht nur noch auf U1. Der Fuß bleibt, wie er ist.


**Doppelseiten ab S. 16 (seit 13.11.2026).** Mit dem Blatt „Stichtag“ entfällt eine Seite; ab S. 16 sind die Doppelseiten neu gepaart. Gemeinsame Horizonte je Paar:

| Doppelseite | Kopfzeile | Gemeinsam | Anmerkung |
|---|---|---|---|
| 16 \| 17 Bindungen \| Standort | 8,46 mm (S. 17 ohne Schlüsselplan in derselben Höhe) | H1 27,5 mm · erste Bandlinie 85,8 mm (Spaltenkopf der Vergleichstabelle = Oberkante Leiter und Ring) · Unterkante 273 mm | S. 16 links: Programmnummer, Tags und Register außen links |
| 18 \| 19 Antragsweg \| Leistungen | 7 mm | H1 26 mm · erste Bandlinie 50,7 mm · Unterkante 273 mm | S. 19: Unterzeile rechts neben dem H1 (Spalten 8–12, Grundlinie auf der zweiten H1-Zeile), damit die Bandlinie auf der Höhe von S. 18 steht (Prüfrunde 1; vorher 59,5 mm) |
| 20 \| 21 Unterlagen \| Über PGN | 7 mm | H1 26 mm · Unterkante 273 mm | erste Bandlinie 59,5 mm bzw. 68,5 mm: S. 21 trägt einen Vorspann |
| 22 \| 23 Impressum \| Quellen | 7 mm, Rubrik „PGN“ | H1 26 mm · erste Bandlinie 52,5 mm, 7 mm unter dem Vorspann S. 22 (Impressum-Schriftfeld = Kopf der Quellentabelle; Prüfrunde 2, vorher 68,5 mm) · Unterkante 273 mm (Rechtsquellen = Notizfläche) | beide mit Standardfuß (Blatt 21, 22); Impressum und Hinweis in natürlicher Höhe (die festen Zeilen von 61 mm sind entfallen), gleicher Abstand über und unter dem Hinweis (je 16,9 mm); Quellentabelle mit vollem Steg vor „Verwendet auf“, seit der Nachprüfung B22.2 (14.11.2026) vierzehn Zeilen mit Zeilenabstand wie `.table--compact` (Schrift 9,5 pt unverändert), Notizraster 15 mm hoch (vorher 45 mm) |

Die Seiten 19 und 21 standen bis zum 13.11.2026 links; ihre Lage („außen“ = links) ist nicht gespiegelt.

**Inhalte S. 2–12 (Änderungsrunde 13.11.2026).** S. 2: Das Vorwort steht in drei Absätzen zweispaltig in der Textstufe (9,5 pt) mit Initiale; der Vorspann in 12 pt entfällt, die Absätze laufen über die Spaltengrenze (nicht mehr ein Absatz je Spalte); „Ihr Einstieg“ hat drei Blöcke. Die Zitatlinie bleibt auf 139,6 mm; das Zitat steht mittig zwischen Signatur und „Ihr Einstieg“ (je 19,9 mm bis zur Linie), „Ihr Einstieg“ steht unten (Linie 220,6 mm, Kacheltext bis 271,3 mm, 7,2 mm über dem Fuß; die gemeinsame Oberkante mit dem Marktband S. 3 entfällt, Prüfrunde 1). S. 3: Das Marktband beginnt bei 196,2 mm (Höhe 76,8 mm), 9,6 mm unter der unteren Kachelreihe wie der Abstand zwischen den Kachelreihen; die gewonnene Höhe steht über Kernbotschaft und Quadratdiagramm (Prüfrunde 2). S. 4: Vergleichstabelle wie Folie 9 (vier Spalten 42 | 40 | 56 | 42 mm, fünf Zeilen, 9,5 pt, keine Pfeilspalte); die Zusatzzeile „Mietenstufe I–III / IV–VII“ steht in beiden Zeilen gleich einzeilig (Prüfrunde 2; der Umbruch nach „Mietenstufe“ aus Prüfrunde 1 entfällt). S. 6: Bedingungen für B und C als `.bullets` im Zulassungsband; Zone C (Nachweis | Zitat) steht 6 mm tiefer, das Zitat im Zeilenabstand 1,28. S. 7: unter der Bildunterschrift die Quellenzeile `.source` (einzige Quellenzeile an einem Diagramm, `content/REDAKTIONSREGELN.md` §2); das Diagramm steht dafür mit 6,0 statt 6,3 mm je €. S. 9: Eckdaten in den Zeilenabständen des Systems. S. 10: Steckbrief „Das Modellhaus“ als Zeilen „Bezeichnung: Angabe“ (Vorlauf halbfett) mit Haarlinien; Sensitivität mit zwei Sätzen im Fuß, Oberkante weiter gleich der unteren Bandlinie S. 11 (219,4 mm). S. 11 und 12: Rechenblätter ohne Unterzeilen, jede Zeile mit Nummer (Jahresrechnung 1–9, Rechenweg 1–6). S. 12: Flächenbeschriftung „über null: Vorteil gegenüber A“ zweizeilig rechtsbündig, damit die 1,91-%-Linie frei bleibt.

**Inhalte S. 15–24 (Änderungsrunde 13.11.2026).** S. 15: Der Satz zur Rechennorm ab 01.01.2027 steht als letzter Absatz von „Ablauf und Kombination“ (unter dem Diagramm „Effizienzklassen“ passt er nicht ohne Verschieben); die Bandlinie bei 198,7 mm bleibt. S. 17: Vorspann ein Absatz in 12 pt über die volle Breite, fünf Zeilen; damit die erste Bandlinie bei 85,8 mm bleibt (S. 16 reicht bis 273 mm), stehen Unterzeile und Vorspann mit Zeilenabstand 1,25 (H1 → Unterzeile 2,6 mm, Unterzeile → Vorspann 2,4 mm, Vorspann → Bandlinie 3,2 mm); „Instrumente der Kommune“ in zwei Karten (77 | 98 mm); „Freistellung von der Belegungsbindung“ als Kasten auf `--surface-2` mit drei `.bullets`; Leiter, Karten und Kasten mit engeren Abständen. S. 18: Fähnchen an Station 4 dreizeilig, die Klammer „Bei Bauvorhaben“ und alles darunter stehen 4 mm tiefer. S. 19: Unterzeile rechts neben dem H1, erste Bandlinie 50,7 mm wie S. 18, die gewonnenen 8,8 mm stehen über der HOAI-Leiste (Abstand 12,3 mm) und über dem Kasten (Prüfrunde 1); HOAI-Leiste mit dem Namen unter jeder Nummer im Feld (Feldhöhe 20,4 mm; Umbruch nur an Wort und Wortfuge), Legende darunter entfällt; unten ein Kasten „Schlüsselfertig mit der PGN Projektgesellschaft Nord“ (Anthrazit) über die volle Breite, „Für Kommunen“ entfällt. S. 22: „Rechtsquellen“ (Label 3 Spalten | Einträge 9 Spalten wie das Schriftfeld, hängender Einzug 4 mm); „Verwaltungsvorschriften“ trennt an der Wortfuge (`.u-hyphens`, Ausnahme in `assemble.cjs`). S. 23: Quellentabelle mit zehn Zeilen, Seitenzahlen als Verweise. U4: Claim ohne Gedankenstrich.

**H1.** Immer 25 pt. `.h1--s` ist entfallen (die Klasse bleibt ohne Wirkung, nicht mehr verwenden). Passt der Titel nicht in 25 pt oder trug der frühere Kicker Inhalt, steht dieser Teil als zweite Stimme `<span class="light">` über der Hauptzeile: 15,5 pt, Schwarz, 1,2 mm Abstand. Zwischen beiden steht kein Doppelpunkt; im PDF-Lesezeichen verbindet `render.cjs` sie mit „: “, außer das H1 trägt `data-satz` (der Titel läuft als ein Satz durch: S. 2, S. 3 und U4). Zweite Stimme tragen S. 2, 3, 8, 10, 11, 13, 14, 15 und 16. Seiten mit Programmkopf (`.program-head`, große Programmnummer) behalten ihn.

**Vorspann und Unterzeile.** `.lead`: Work Sans 400, 12 pt / 1,36, Schwarz. `.lead--s` ist entfallen. Ist der Vorspann länger als etwa drei Zeilen, bleibt der erste Satz (höchstens zwei) `.lead`, der Rest folgt als `<p class="body">` direkt darunter (S. 7, 10, 11, 17). `.deck`: Work Sans 400, 12 pt, gemischt, Kennwert `b` halbfett in Schwarz; `.deck--s` ist dieselbe Form.

**Modultitel.** Montserrat 800, 12 pt, gemischt, Laufweite 0. Die Einheit steht im Titel als `<span class="chart__unit">` (Work Sans 500 in Textgröße), ohne Komma davor: „Jahresrechnung Jahr 1 in € p. a.“, „Rechenweg in €“. `.chart__unit--block` setzt sie in eine eigene Zeile. Alles, was auf einer Seite wie ein Modultitel arbeitet, hat diese Form. Über einem Modultitel ist mehr Luft als darunter.

**Seitenverweis.** `.pageref`: halbfett im Text, in Schrift, Größe und Farbe der Umgebung, ohne Kästchen.

---

## 1 · Tokens

### 1.1 Farben (Palette → Semantik)

| Token | Wert | Rolle | Kontrast |
|---|---|---|---|
| `--pgn-red` | #B71E3F | Akzent, Zuschuss, Maßketten, Marke | Weiß darauf 6,4:1; auf Weiß 6,4:1, auf Papier 5,8:1 |
| `--pgn-red-deep` | #8B2939 | Verlaufsende, Signal (Frist, Bewilligung, Warnband) | Weiß darauf 8,5:1 |
| `--grad-red` | 160°, #B71E3F → #8B2939 | rote Flächen (U4, Kennzahlfeld U1, Hero-Kachel, Werte, Phase „nach Bewilligung“) | – |
| `--pgn-red-300` | #E8A3B1 | Akzent als Text auf Anthrazit | 5,4:1 auf #3C3C3B |
| `--pgn-red-100` / `-50` | #F7E3E7 / #FBF1F3 | Hauch: Achtung-Kasten, ±0-Zeile | Grau #626160 darauf ≥ 5,0:1 |
| `--ink` | #202020 | Überschriften, Zahlen, Darlehen (Poché), Rahmen | 16,3:1 |
| `--anthracite` | #3C3C3B | Fließtext (`--text`), Linien, `--grad-dark` | 11,0:1; 10,0:1 auf Papier |
| `--grey-600` | #626160 | Sekundärtext `--fg-3` (aus CI-#757474 abgedunkelt) | 6,2:1 Weiß · 5,6:1 Papier · 5,0:1 #E9E7E4 |
| `--grey-500` / `--grey-450` | #757474 / #868686 | CI-Grau / Logo-Grau: nur Linien, Logo | – |
| `--grey-300` / `-200` / `-150` / `-100` | #B4B0AB / #CFCCC8 / #DCD8D3 / #E9E7E4 | Planraster · Haarlinien · Eigenmittel-Fläche · Fläche 3 | – |
| `--paper` | #F4F3F2 | Kästen, Bänder, Blatt-Zelle (`--surface-2`) | Anthrazit darauf 10,0:1 |

Semantische Tokens je Theme (Komponenten nutzen nur diese):

| Token | hell (`:root`, `.on-light`) | Papier (`.page--accent`, `.on-paper`) | Anthrazit (`.page--dark`, `.on-dark`) | Rot (`.page--u4`, `.page--back`, `.on-red`, `.kf--hero`, `.cover__kpi`) |
|---|---|---|---|---|
| `--surface` / `-2` / `-3` | Weiß / Papier / #E9E7E4 | Papier / Weiß / #E9E7E4 | #3C3C3B / #4A4948 / #575655 | Rot / Dunkelrot / #A3233F |
| `--fg` / `--text` / `--fg-2` / `--fg-3` | #202020 / #3C3C3B / #3C3C3B / #626160 | wie hell | Weiß / #EDEBE8 / #E2DFDB / #B4B0AB | Weiß / Weiß / #F7E3E7 / #F7E3E7 |
| `--rule` / `--rule-strong` | #CFCCC8 / #202020 | wie hell | #5E5D5C / Weiß | #D47E91 / Weiß |
| `--accent` / `--accent-text` | Rot / Rot | Rot / Rot | Rot / #E8A3B1 | Weiß / Weiß |
| `--loan` / `--grant` / `--equity` | #202020 / Rot / #DCD8D3 | wie hell | Papier / #E36A82 / #5E5D5C | #202020 / Weiß / #D47E91 |
| `--signal-fill` / `--signal-text` | Dunkelrot / Dunkelrot | wie hell | Dunkelrot / #E8A3B1 | – |
| `--ok` / `--no` | #202020 / Rot | wie hell | Weiß / #E8A3B1 | Weiß / Weiß |
| `--sig-*` (Signaturen) | Tinte, Anthrazit, Rot, Raster #B4B0AB, Klinker #D58E9D | Flächen Papier | invertiert | Grundriss weiß |

WCAG geprüft (alle Textpaare ≥ 4,5:1): Text 11,0 · fg-3 auf Weiß/Papier/Fläche 3/Hauch 6,2/5,6/5,0/5,0 · Rot auf Weiß/Papier 6,4/5,8 · Weiß auf Rot/Dunkelrot 6,4/8,5 · Hauch auf Rot 5,2 · Anthrazit-Theme Text/fg-3/Akzent 9,3/5,1/5,4. Logo-Grau #868686 (3,6:1) nur im Logo.

### 1.2 Programmteile 2.1–2.6 (`--bs-21` … `--bs-26`)

| Programmteil | Token | Wert | Weiß darauf | Tint |
|---|---|---|---|---|
| 2.1 Mietwohnungen in MFH | `--bs-21` | #B71E3F PGN-Rot | 6,4:1 | #F7E3E7 |
| 2.2 Energetisch hochwertig (EH 40) | `--bs-22` | #3A62A6 Blau | 6,0:1 | #E4EAF4 |
| 2.3 Klimagerechte Modernisierung | `--bs-23` | #A0581A Ocker | 5,4:1 | #F4E7DB |
| 2.4 Ostfriesische Inseln | `--bs-24` | #0A5372 Nordsee | 8,4:1 | #DFEBF0 |
| 2.5 Erwerb von Bindungen | `--bs-25` | #9A52AE Heide | 5,0:1 | #F1E6F4 |
| 2.6 Verlängerung von Bindungen | `--bs-26` | #3C3C3B Anthrazit | 11,0:1 | #E9E7E4 |

Validiert mit `dataviz/scripts/validate_palette.js` (Reihenfolge 2.1 → 2.6, benachbarte Paare): **CVD ΔE ≥ 10,9** (Ziel 8), **Normalsicht ΔE ≥ 22,2** (Boden 15), alle ≥ 3:1 gegen Weiß. 2.4 (L 0,42) und 2.6 (unbunt) liegen bewusst außerhalb des Kategorienbands: zulässig, weil **die Nummer immer mitsteht** (zweite Kodierung – Register, Schlüsselplan, Chip, Kapitelnummer). Programmfarben nie als einzige Kodierung in Datenmarken.

### 1.3 Diagrammfarben (fest, im ganzen Heft gleich)

| Reihe | Token / Klasse | Kodierung | Prüfung |
|---|---|---|---|
| Zuschuss | `--grant` · `c-grant` · `sw--grant` | PGN-Rot, beginnt an der Grundlinie | – |
| Darlehen | `--loan` · `c-loan` · `sw--loan` | #202020 (Poché = geschnittenes Bauteil) | Zuschuss ↔ Darlehen: CVD ΔE 16,8, Normalsicht 32,3 |
| Eigenmittel (mind.) | `--equity` + Vektorschraffur `path.hatch` · `sw--equity` | #DCD8D3 mit 45°-Linien #8E8A85 (Abstand 1,2 mm, Linie 0,2 mm, s. 1.3.1), **immer beschriftet** | 1,4:1 gegen Weiß → Relief: Schraffur + Beschriftung + Rahmen `c-equity-frame` |
| Zuschlag (+5/+10 Pp.) | `dim-line--acc` gestrichelt · `sw--cap` | rote gestrichelte Kappe über der 80-%-Achse | – |
| Miete/Ertrag | `c-ink` · `sw--ink` | Fast-Schwarz (nie `c-loan` daneben) | – |
| bisher / altes Recht | `--old` · `c-old` · `sw--old` | #B4B0AB | – |
| Einkommensgruppen A/B/C | `seq-6/-4/-2` · `.grp-chip--a/b/c` · `.axis-no` | warmes Grau dunkel → hell; im Diagramm Achskreis mit Buchstabe | Text auf Stufe 1–3 #202020 (≥ 7,3:1), auf 4–6 weiß (≥ 4,8:1) |
| Heatmap | `seq-1` … `seq-6` | eine Tonleiter, Werte stehen immer in der Zelle | – |
| Heatmap auf einer Programmseite | `c-bs-step-1` … `c-bs-step-7` | Tonleiter der Programmfarbe: Tint → `--bs` → `--bs` + 25 % Tinte (color-mix); Text `--fg` auf Stufe 1–5, `--on-bs` auf 6–7 | Tinte auf Stufe 5 ≥ 5,3:1, Weiß auf `--bs` 5,4:1, auf Stufe 7 ≈ 7:1 (2.3); nur mit Programmnummer im Seitenkopf (S. 14) |
| Dauer ohne Geldfluss (Bindung, Laufzeit) | `dim-line` / `dim-tick` | Maßkette in Anthrazit, kein Band in der Programmfarbe (2.1 = Rot wäre „Zuschuss“, der Tint zu flau) | S. 9 |
| Signal (Bewilligung; bis 13.11.2026 auch Stichtag) | `--signal-fill` · `c-signal` · `tl-pin--signal` | Dunkelrot, immer mit Label | – |

Darlehen in Anthrazit #3C3C3B fällt durch (CVD ΔE 5,7 gegen Rot) – deshalb #202020. Rot nie für Rahmen, Achsen oder Maßketten **im Diagramm** (Maßketten dort Anthrazit `dim-line`/`dim-tick`); Rot bleibt Zuschuss + 80-%-Achse.

### 1.3.1 Schraffur und Muster – nur als Vektor (Korrekturlauf 1, verbindlich)

**Warum:** Chromium rastert beim PDF-Export jede **SVG-`<pattern>`-Füllung** und jedes **gekachelte CSS-Muster**
(`repeating-linear-gradient`, Verlauf mit `background-size` + `repeat`) als Bild mit 72 dpi in einer Kachel
(PatternType 1) – im Druck verpixelt (Kundenkommentar S. 10/11). `pdfimages -list` zeigt diese Bilder **nicht** (sie
liegen in den Pattern-Ressourcen); deshalb prüft `render.cjs` selbst und meldet `MUSTER:` (Fehler wie OVERFLOW).

**Technik im Diagramm (SVG, 1 Einheit = 1 mm):** Schraffur = vorgeschnittene 45°-Linien in **einem** `<path>`, ohne
`<pattern>`, ohne `clip-path`, ohne IDs. Reihenfolge: Fläche · Linien · Rahmen.

```html
<rect class="c-equity" x="107.35" y="8.6" width="23.15" height="6.2"/>                       <!-- Fläche = Segment (nach der Fuge) -->
<path class="hatch" data-hatch="107.45 8.7 22.95 6" d="…"/>          <!-- Rahmen-Mittellinie; d erzeugt scripts/schraffur.cjs -->
<rect class="c-equity-frame" x="107.45" y="8.7" width="22.95" height="6"/>                   <!-- Rahmen um ½ Strich (0,1) nach innen -->
```

- `data-hatch="x y w h"` = Rechteck (mehrere mit `;` getrennt in einem Pfad). Optional `data-hatch-step="…"`
  (Standard **1,2 mm** rechtwinklig) und `data-hatch-dir="\"` (Gegenrichtung; Standard „/“ von links unten nach rechts oben).
- `d` erzeugen: `node scripts/schraffur.cjs "x y w h"` (gibt das fertige Element aus); nach Maßänderungen
  `node scripts/schraffur.cjs --sync` (alle Partials). `assemble.cjs` berechnet `d` beim Zusammensetzen ohnehin neu
  (Hinweiszeile, wenn das Partial veraltet ist) und meldet `<pattern>`/CSS-Muster als `MUSTER:`.
  `node scripts/schraffur.cjs --check` prüft Partials und `styles.css` (Exit 1 bei Befund).
- Linien global verankert (wie `userSpaceOnUse`): benachbarte Flächen laufen bündig durch.
- Klassen: `.hatch` (Linie `--equity-line`, 0,2 mm) · `.hatch--over` (Linie `--fg-2`, für „über der Bemessungsgrenze“,
  mit `data-hatch-dir="\"`; seit 11/2026 im Heft nicht gesetzt, weil die Sensitivität S. 10 eine Tabelle ist) · seitenlokal nur die Linienfarbe ändern (S. 9: `.p09-hatch-line` = `--loan`, verzinste Restlaufzeit).
  Die Linienenden stehen bis 0,07 mm über das Rechteck (stumpfe Enden unter 45°) – deshalb `data-hatch` = Rechteck auf der
  **Mittellinie des Rahmens**, dann deckt der Rahmen die Enden. Der Rahmen liegt **innen** (um ½ Strichbreite eingerückt):
  seine Außenkante = Segmentkante, bündig mit den Nachbarsegmenten (früher stand er 0,1 mm über → Stufe an Ober-/Unterkante).
  Freigestellte Werte in der Schraffur (S. 14) als Rahmenband: mehrere Rechtecke in `data-hatch`, keine Deckmaske.
- Ist keine Schraffur nötig (keine Unterscheidung schwarz-weiß/CVD), **flächige Tönung** statt Muster
  (`--surface-2`, `--seq-*`, `c-muted`).

**Technik in CSS (Legende, Rechenblatt, Strichpunktlinien):** fest gefärbte SVG-Daten-URIs als Tokens in `:root`,
**immer einmal gesetzt** (`… 0 0 / 100% 100% no-repeat`, nie gekachelt) – Chromium schreibt sie als Vektor:

| Token | Einsatz | Inhalt |
|---|---|---|
| `--sw-equity` | `.sw--equity` | Schraffur 4,6 × 3 mm mit Rahmen |
| `--sw-cap` | `.sw--cap` | rote gestrichelte Kappe (Strich 1 / Lücke 0,6 wie `dim-line--acc` im Diagramm) |
| `--sw-axis` | `.sw--axis` | 80-%-Achse Strichpunkt (1,6/0,5/0,4/0,5) |
| `--planraster` | `.callout--calc`, `.formula` | 5-mm-Planraster als **eine** Zeichnung 180 × 260 mm (`background-size: 180mm 260mm; no-repeat`) |
| `--dashdot-h` / `--dashdot-v` | `.cutline`, `.photo__axes` | Strichpunktlinie über die volle Breite bzw. Höhe (SVG ohne viewBox, Strichmaße in px) |

Neu erzeugen nach Parameteränderung: `node scripts/schraffur.cjs --css` und die Zeilen in `:root` ersetzen. Die Daten-URIs
kennen keine Tokens: Farben sind für hellen Grund gesetzt (Planraster nur auf Weiß/Papier). Weitere Muster nach demselben
Prinzip anlegen. **Verboten:** `<pattern>`, `repeating-*-gradient`, `background-size` mit Kachelung für Muster;
erlaubt bleiben einfache Verläufe (`--grad-red`, `--grad-dark`) und `linear-gradient … no-repeat` (Vektor-Shading).
Der Bauzeitenplan `.bzp__track` hat deshalb kein Spaltenraster mehr (bei Bedarf als SVG-Linien zeichnen).

**Prüfen:** `render.cjs` ohne `MUSTER:`; zusätzlich Ausschnitt bei 300 dpi (`pdftoppm -r 300 -f N -l N -png …`): Linien
gleichmäßig scharf, keine Treppen. Fotos (S. 21) sind echte Bilder und werden nicht gemeldet.

### 1.4 Typografie

| Token | Wert | Schrift | Einsatz |
|---|---|---|---|
| `--fs-cover` | 30 pt | Montserrat 900 Versalien, lh .97 | Titelzeile U1 (2–3 Zeilen) |
| `--fs-h1` / `.h1--xl` | 25 / 34 pt | Montserrat 900 Versalien, lh 1,04, Laufweite −0,005 em | Seitentitel / Kapitelauftakt (im Heft ungenutzt). `--fs-h1-s` (20 pt) ist als Token noch da, `.h1--s` setzt 25 pt |
| `.h1 .light` | 15,5 pt (0,62 em) | Montserrat 300 Versalien, +0,05 em, lh 1,2 | zweite Stimme im H1 |
| `--fs-h2` | 13 pt | Montserrat 900 Versalien | Abschnittstitel `.h2` (auf den Seiten ungenutzt; liegt außerhalb der Stufen) |
| `--fs-h3` · Modultitel (`.chart__title`, `.fig-head__title`, `.plan-legend__title`, `.h3`, `.term__word`, `.offer-box__title`, `.callout__title`, `.program__title`) | 12 pt | Montserrat 800, gemischt, lh 1,2, Laufweite 0 | Modultitel |
| `.chart__unit` | Textgröße (9,5 pt, dicht 9 pt) | Work Sans 500, gemischt | Einheit im Modultitel, ohne Komma davor |
| `--fs-deck` | 12 pt / 1,36 | Work Sans 400, gemischt; Kennwert `b` 600 in Schwarz | Unterzeile unter H1 |
| `--fs-lead` | 12 pt / 1,36 | Work Sans 400, Schwarz, max. 132 mm | Vorspann |
| `--fs-body` = `--fs-small` = `--fs-module` | 9,5 pt / 1,42 | Work Sans 400, `b` 600 | Text, Listen, Kästen, Kacheln, Tabellenzellen; `.page--dicht`: 9 pt / 1,4 (Modultext 1,38) |
| `--fs-micro` | 8,5 pt | Work Sans 400/500 / Montserrat 700 Versalien (+0,1 em) | Labels, Achsen, Fundstellen, Rubrik der Kopfzeile (+0,16 em) |
| `--fs-label-accent` | 9 pt | Montserrat 700–800 Versalien | rote Schrift und Negativschrift (Druckregel): Achtung- und Frist-Label, Stempel, Daumenregister; Dachzeile U1 |
| `--fs-fig-hero` / `-xl` / `-l` / `-m` / `-s` | 84 / 46 / 28 / 21 / 17 pt | Montserrat 800–900, Tabellenziffern | Hero-Zahl / große / Kachel / kleine Kachel / Tabellen-Kernwerte |

Zahlen immer Montserrat mit `tabular-nums` (Kachel, Tabelle `.num`, Diagrammwerte `t-val`, Blattnummer). Einheiten (`kf__unit`) halb so groß in Schwarz. Signaturwort (`em` in `.h1`, `.claim`, `.cover__title`) = Montserrat 800 kursiv Rot, im H1 genau ein Wort oder eine Zahl. Zweite Stimme `.light` = Montserrat 300 Versalien, 15,5 pt, Schwarz. SVG-Schriftgrade: `--svg-fs-s` 3 px = 8,5 pt · `--svg-fs-m` 3,25 px = 9,2 pt (Diagrammwerte) · `-l` 12 pt · `-xl` 18 pt · `-xxl` 25,5 pt.

### 1.5 Raster und Satzspiegel

| Token | Wert | |
|---|---|---|
| Seite | 210 × 297 mm | `@page { size: 210mm 297mm; margin: 0 }`, `print-color-adjust: exact` |
| `--m-inner` / `--m-outer` | 15 / 15 mm | Satzspiegel 180 mm |
| `--m-top` / `--m-bottom` | 14 / 24 mm | Inhalt endet 273 mm (5 mm über dem Plankopf) |
| `--gutter` / `--col` | 5 / 10,42 mm | 12 Spalten |
| `--plan` | 5 mm | Planraster (Rechenblatt, Kalkulationsnotiz) |
| `--foot-y` / `--foot-h` | 9 / 9,5 mm | Mini-Plankopf |
| `--frame-inset` | 8 mm | Planrahmen (Umschlag, Kapitelauftakt) |
| `--horizon` | 196 mm | Oberkante Schriftfeld U1 = U4 |
| `--rule-hang` | 5,75 mm | rote Titellinie links neben dem Satzspiegel |
| `--station-mk` | 4,4 mm | Quadrat-Marke einer Station (Antragsweg S. 18 im SVG, Leistungen S. 19) |

Spaltenbreiten: 3 Sp. 41,25 · 4 Sp. 56,7 · 5 Sp. 72,1 · 6 Sp. 87,5 · 7 Sp. 102,9 · 8 Sp. 118,3 · 9 Sp. 133,8 · 12 Sp. 180 mm.
Linien: `--hair` 0,2 mm · `--rule-w` 0,3 mm · `--rule-heavy` 0,5 mm (Modulkopf) · `--rule-accent` 0,75 mm (rote Titellinie) · `--rule-red-min` 0,25 mm. Abstände `--sp-1 … --sp-16` (1–16 mm).

---

## 2 · Seitenrahmen

```html
<section class="page bs-21" data-page="08" id="seite-08">
  <div class="bs-register" data-bleed aria-hidden="true">2.1</div>          <!-- nur Programmseiten: Daumenregister -->
  <header class="page__header">
    <span class="page__section">Finanzierung</span>                          <!-- Rubrik links: erster Teil des Kolumnentitels, 8,5 pt Versalien, Schwarz -->
    <div class="keyplan" role="img" aria-label="Programmteil 2.1 von sechs Programmteilen">
      <span class="keyplan__label">Programmteil</span>
      <ol class="keyplan__list"><li class="bs-21 is-on">2.1</li><li class="bs-22">2.2</li><li class="bs-23">2.3</li>
        <li class="bs-24">2.4</li><li class="bs-25">2.5</li><li class="bs-26">2.6</li></ol>
    </div>
  </header>
  … Inhalt (Flex-Spalte; .l-bottom schiebt ein Modul an den Fuß) …
  <footer class="page__foot" aria-hidden="true"><span class="page__folio">8</span><span class="page__running"><span>Mietwohnraumförderung Niedersachsen 2026<span class="sep">·</span><b>Finanzierung · Programmteil 2.1</b></span></span></footer>
</section>
```

- **Mini-Plankopf** (`.page__foot`, Markup wie v1): 9,5 mm hoch, 0,3-mm-Oberlinie, Zellen: *Blatt NN* (Papier, Montserrat 900 12 pt, Label „Blatt“ per CSS) · PGN-Wortmarke (`assets/pgn/logo-mark-rot.svg`) · Projekt (Zeile 1) / Rubrik in Versalien (Zeile 2). **Kein Stand in der Fußzeile** (Korrekturlauf 1; „Stand 11/2026“ seit 13.11.2026 nur auf U1 und im Impressum S. 22). Das Impressum trägt seit 13.11.2026 den Standardfuß (Blatt 21), S. 23 ebenso (Blatt 22). Gerade Seiten (`data-page` endet auf 0/2/4/6/8 oder `.page--left`): Blatt links außen; ungerade: rechts außen. Das volle Schriftfeld bleibt Umschlag und Kapitelauftakten vorbehalten.
- **Daumenregister** `.bs-register`: 10 × 21 mm am Außenrand, Lage nach Programmteil (`top: 52 mm + Index × 25 mm`, 2.1 oben … 2.6 unten), Programmfarbe, Nummer Montserrat 800 9 pt weiß. Gerade Seiten links gespiegelt. Immer `data-bleed aria-hidden="true"`.
- **Kopfzeile** `.page__header`: auf jeder Innenseite S. 2–23, Rubrik links, 7 mm hoch (mit Schlüsselplan 8,5 mm), Haarlinie, 5 mm Abstand zum H1; S. 17 hält ohne Schlüsselplan die Höhe von S. 16 (s. 0a).
- **Schlüsselplan** `.keyplan`: in der Kopfzeile rechts; jedes Feld mit Farbkante, aktives Feld gefüllt (S. 16: 2.5 und 2.6). Steht auf den Seiten eines Programmteils (S. 8–16), sonst nicht.
- **Varianten:** `.page--u1` / `.page--u4` (Umschlag, ohne Polster, s. 7) · `.page--opener` (Kapitelauftakt im Planrahmen `.planframe--soft`, Fuß 4 mm über der Rahmenlinie) · `.page--accent` (Papierseite, nur Mittel-Doppelseite) · `.page--dark` (Anthrazit-Verlauf) · `.page--back` (v1-Rückseite, jetzt Rot) · `.page--cover` (v1-Titel, jetzt hell).
- **Planrahmen** `<div class="planframe" aria-hidden="true"></div>`: 8 mm vom Endformat, 0,35 mm Fast-Schwarz, Falzmarken bei 105/210 mm; `--soft` = Haarlinie Logo-Grau. Auf Rot weiß.
- **Master-Opener der Programmseiten** (S. 8, 13, 14, 15, 16). Der Tag unter der Nummer ist im Kopf kompakt (Polster 1,2 mm, Farbfelder 2,4 mm), damit „Zuschuss + Darlehen“ in drei Spalten (41,25 mm) passt:

```html
<header class="program-head program-head--master">
  <div class="program-head__no">                               <!-- 3 Spalten außen: gerade Seite links, ungerade rechts -->
    <p class="chapter-no">2.1<small>Programmteil</small></p>   <!-- Montserrat 900 60 pt in --bs -->
    <p class="tags"><span class="tag"><i class="sw sw--grant"></i><i class="sw sw--loan"></i>Zuschuss + Darlehen</span></p>
  </div>
  <div class="program-head__main">                             <!-- 9 Spalten -->
    <h1 class="h1"><span class="light">Neubau, Änderung, Ersterwerb</span> Bis zu <em>80&nbsp;%</em> Förder&shy;quote</h1>   <!-- früherer Kicker als zweite Stimme -->
    <p class="deck">Darlehen plus Zuschuss in jeder Einkommensgruppe, mit Zuschlag bis zu <b>90&nbsp;%</b></p>
    <p class="program-head__subject">Gegenstandssatz (Work Sans 9,5 pt, dicht 9 pt) …</p>
  </div>
</header>
```

---

## 3 · Typografie-Bausteine

```html
<header class="page__header"><span class="page__section">Umsetzung</span></header>   <!-- Kopfzeile mit Rubrik; ersetzt die Kicker-Zeile (s. 0a) -->
<p class="kicker kicker--ink">…</p>                             <!-- Dachzeile: nur noch U1 (Montserrat 700 9 pt Versalien) -->
<h1 class="h1">So begleiten wir Ihr Förder&shy;projekt</h1>    <!-- 900 Versalien; rote 0,75-mm-Linie hängt links (.h1--norule ohne) -->
<h1 class="h1"><span class="light">14 Wohnungen, 3,0&nbsp;Mio.&nbsp;€</span> bis zu <em>2,4&nbsp;Mio.&nbsp;€</em> Förderung</h1>  <!-- zweite Stimme: 300, 15,5 pt, Schwarz, eigene Zeile, kein Doppelpunkt -->
<h1 class="h1">Konditionen und <em>Kosten</em></h1>            <!-- em = 800 kursiv Rot: genau ein Wort oder eine Zahl -->
<p class="deck">Ein Ansprechpartner für alles</p>               <!-- Unterzeile: Work Sans 12 pt, gemischt; b = 600 Schwarz; .deck--s gleich -->
<p class="lead">Den Antrag stellen Sie bei …</p>               <!-- Vorspann: Work Sans 12 pt, Schwarz, max. 132 mm; .lead--s entfallen -->
<p class="body">Rest eines geteilten Vorspanns …</p>            <!-- direkt unter .lead, Textgröße -->
<p class="claim">Planen. Fördern. <em>Bauen.</em></p>           <!-- Plakatzeile 22 pt; --s 13 pt, --l 31 pt, --rule mit roter Linie -->
<h2 class="chart__title">Jahresrechnung Jahr 1 <span class="chart__unit">in € p. a.</span></h2>   <!-- Modultitel: Montserrat 800 12 pt gemischt; Einheit ohne Komma -->
<h3 class="h3">Wann gilt ein Vorhaben als begonnen?</h3>       <!-- dieselbe Form wie der Modultitel -->
<p class="label">Versal-Label</p>                               <!-- 8,5 pt; .label--accent steht in Schwarz -->
<div class="prose"><p class="dropcap">Fließtext …</p></div>     <!-- Initiale Montserrat 900 Schwarz über drei Zeilen; nur einmal (Editorial) -->
<a class="pageref" href="#seite-09">→&nbsp;S.&nbsp;9</a>        <!-- Seitenverweis: halbfett im Text, ohne Kästchen -->
<b class="runin">Kombinierbar mit</b> KfW 298 …                 <!-- Run-in-Label: 800 8,5 pt Versalien +0,1 em, 2 mm Abstand (Bänder S. 8, 13); S. 5 und 19 setzen es seitenlokal als Modultitel -->
<b class="bs-no bs-23">2.3</b>                                  <!-- Programmnummer im Fließtext: 800, 1em, Programmfarbe -->
<span class="ph">[PGN-Rechnung: … % der Miete]</span>            <!-- Platzhalter (s. 6.16) -->
<p class="chart__sub">Rechenbeispiel, keine Förderzusage</p>   <!-- 8,5-pt-Unterzeile unter dem Modultitel (S. 10); .kicker-row und .stampline--inline sind im Heft ungenutzt -->
```

Titelblock mit Vorspann rechts: `.title-block.title-block--split` (7 + 5 Spalten) bzw. `--split-6`. Regeln: genau ein `.h1` je Seite; zweite Stimme ≤ 1 Zeile; Deck ≤ 1 Zeile (≤ 2 auf Programmseiten); Vorspann höchstens etwa drei Zeilen, sonst teilen (s. 0a); Plakatzeile ≤ 3 Wörter, nur auf Kapitelöffnern, PGN-Seiten und dem Umschlag.

---

## 4 · Layout-Utilities

```html
<div class="l-grid"> <div class="l-span-7">…</div> <div class="l-span-5">…</div> </div>   <!-- 12er-Raster; --row-gap per style -->
<div class="l-cols l-cols--3">…</div>   <div class="l-stack l-stack--m">…</div>   <div class="l-sidebar">…</div>
<p class="chart__note l-indent">…</p>                           <!-- Einzugsachse 3 Spalten + Steg ≈ 46 mm (Notizen unter Diagrammen) -->
<div class="module">…</div>                                     <!-- Modulkopf: 0,5-mm-Linie Fast-Schwarz -->
<div class="module module--hair">…</div>  <div class="band">…</div>  <div class="… l-bottom">…</div>
```

Utilities wie v1: `.u-mt-0 … .u-mt-12`, `.u-nowrap`, `.u-tnum`, `.u-accent`, `.u-muted`, `.u-strong`, `.u-caps` (Montserrat 700 Versalien), `.u-unit` (Einheit im Versalsatz klein, setzt `assemble.cjs`), `.u-sr`, `.u-hyphens`, `.u-nohyphens`, `.u-justify`, `.u-url`, `.u-avoid-break`. Abstände zwischen Modulen: `u-mt-5` eng · `u-mt-6` Standard · `u-mt-8` nach Seitentitel · `u-mt-10/12` Kapitelwechsel.

---

## 5 · Block-Typen aus dem Seiten-JSON → Komponenten

| JSON-Block | Komponente | Varianten |
|---|---|---|
| `key_figures` | `.key-figures` + `.kf` | `--hero` (Rotverlauf), `--band` (Papier), `--s/--xl/--accent/--bs`, Raster `--2/--4`, `.seal` |
| `table` | `.table` | `--figures` (Kernwerte 17 pt), `--compact`, `--terms` (Eckdaten), `--compare`, `--matrix`, `--heat` |
| `callout` | `.callout--hinweis/--achtung/--tipp/--frist/--calc`, `.plan-legend`, `.gate` | `--s`, `--inline`, `--side`, `--plain`, `__split` |
| `quote` | `.quote` | `--l`, `--band` |
| `steps` | `.steps` | `--kote` (Höhenkoten, ±0 = Bewilligung), `--lanes`, `--h`, `.ratebar` |
| `chart` | `figure.chart` + Inline-SVG | Maßketten-Balken (Fördermix), Säulen, Heatmap, Zeitstrahl, Spiegel, Ablauf, Einheitenquadrate mit Maßkette (S. 3, seit Korrekturlauf 1 statt Ring + Balkenpaar: ein Diagramm je Aussage) |
| `faq` · `checklist` · `contact` · `bullets` | wie v1 | – |
| **`services`** (neu) | `.services` + `.service`, `.bzp` (Bauzeitenplan), `.lph-scale`, `.offer-box` | `--2col`, `--band` (Prozessband), `.offer-box--dark` |
| **`references`** (neu) | `.references` + `.reference`, `.reference--feature` | `.photo` (Duplex), `.reference__units`, `.reference__facts` |
| Umschlag | `.page--u1` / `.page--u4` | s. 7 |

Feldzuordnung `services`: `title/body/phase` → `.service__title/.service__text/.service__phase`; als Gantt: `phase` → `--from/--to` (LPH 1–9), förderspezifisch → `.bzp__bar--foerder`. `references`: `name/place/client/units/note/image` → `.reference__name/.reference__place (+ client)/.reference__units/.reference__facts/.photo__img`.

---

## 6 · Komponenten

### 6.1 Kennzahlen (`key_figures`)

```html
<div class="key-figures">
  <div class="kf kf--hero">                                   <!-- PGN-Rotverlauf, volle Breite, Zahl 84 pt 900 weiß -->
    <p class="kf__top"><span class="kf__idx">01</span><span>Programmteil 2.1</span></p>
    <p class="kf__fig"><span class="kf__pre">bis zu</span><span class="kf__num">80<span class="kf__unit">%</span></span></p>
    <div class="kf__side"><p class="kf__label">Förderquote aus Darlehen und Zuschuss</p><p class="kf__text">…</p></div>
  </div>
  <div class="kf"><p class="kf__top"><span class="kf__idx">02</span><span>Zins</span></p>
    <p class="kf__fig"><span class="kf__num">0<span class="kf__unit">%</span></span></p>
    <p class="kf__label">Zins bis Ende Jahr 35</p><p class="kf__text">Verwaltungskostenbeitrag 0,5&nbsp;% p.&nbsp;a.</p></div>
  <div class="kf kf--accent"> … <span class="kf__sub">je m² Wohnfläche, Mietenstufe I–III</span> … </div>   <!-- Zahl in Rot -->
</div>
<div class="seal"><span class="seal__pre">bis zu</span><span class="seal__num">80<span class="seal__unit">%</span></span><span class="seal__text">…</span></div>  <!-- Achskreis; --filled = Rotverlauf -->
```

Varianten seit der CSS-Integration: `.key-figures--n` (Kachelzeile in einer Teilspalte, `style="--n: 7"`, Spannen je Kachel), `.kf--band--compact` (drei Werte neben einer Erklärung: Werte ohne Mindestbreite, 3 mm Polster). Regeln: Kachelkopf 0,3-mm-Linie; Zahl Montserrat 800 28 pt (Tabellenziffern); Einheit halb so groß in Schwarz; `kf__pre` 8,5 pt Versalien in Schwarz. Höchstens eine Hero-Kachel je Seite. Zahlen > 6 Zeichen (4.800/5.000, 90.000) nur in 2er-/3er-Raster oder `kf--s`. In der Kopfzeile darf ein Programm-Badge stehen (`.bs-badge`, DOM vor `kf__pre`, per `order` rechts).

### 6.2 Tabellen (`table`)

```html
<table class="table table--figures">                          <!-- Höchstmieten: Kernwerte Montserrat 800 17 pt -->
  <thead><tr><th scope="col">Mietenstufe</th><th class="num" scope="col"><span class="axis-no axis-no--s">A</span></th>…</tr></thead>
  <tbody><tr><th scope="row">I–III</th><td class="num">6,50</td><td class="num">7,90</td><td class="num">8,70</td></tr></tbody>
</table>
<table class="table table--terms"><tbody><tr><th scope="row">Bindung</th><td>35 Jahre Belegungs- und Mietbindung</td></tr></tbody></table>
```

```html
<table class="table table--sheet">                             <!-- Rechenblatt (S. 10, 11): Zeilennummern-Streifen, hängende Rechenzeichen -->
  <colgroup><col class="col-no"><col><col></colgroup>
  <tbody><tr><th scope="row">3</th><td class="is-hang"><span class="table__op">−</span> Instandhaltung, 14,40 € je m² p. a.</td><td class="num">11.923</td></tr>
         <tr class="is-sum">…</tr>                               <!-- Summenstrich 0,3 mm, Text 600 -->
         <tr class="is-result on-red">…</tr></tbody>             <!-- Ergebniszeile Vollton PGN-Rot (kein Verlauf auf tr: setzt je Zelle neu an) -->
</table>
```

Kopf: Montserrat 700 8,5 pt Versalien, 0,3-mm-Linie Fast-Schwarz; Zeilen Haarlinien; Abschluss 0,3 mm. **Massendaten-Stufe:** `.num` = Montserrat 600 in Textgröße (9,5 pt, dicht 9 pt), Tabellenziffern, rechtsbündig (Einkommensgrenzen, Kalkulation). **Kernwerte** `.table--figures`: höchstens 6–8 Werte je Seite; mehr Werte (Höchstmieten S. 7, 19 Werte) in der mittleren Stufe `.table--figures-m` (Montserrat 700 12 pt). **Eckdaten** `.table--terms`: Positionsspalte genau 3 Spalten (46-mm-Achse), Text in Textgröße (S. 9 ist dicht: 9 pt) in `--text`, Werte fett in Tinte. **Vergleich** `.table--compare`: neue Spalte in Tinte, nicht fett – hervorgehoben werden nur Kennwerte (`.table--compare--strong` = ganze Spalte 600). Gruppenköpfe A/B/C als Achskreise. Weitere Zellklassen wie v1 (`.unit`, `.is-hl`, `.is-total`, `.is-key`, `.is-group-end`, `.bs-row`, `.table__arrow`). Höchstens 8 Zeilen × 5 Spalten.

### 6.3 Hinweise, Planlegende, Warnband

```html
<aside class="callout callout--hinweis"><p class="callout__label"><svg class="icon">…</svg>Hinweis</p><p class="callout__title">Bemessungsgrenze</p><p class="callout__body">…</p></aside>
<aside class="callout callout--achtung">…Erst Bewilligung, dann Vertrag…</aside>   <!-- Hauch + 0,5-mm-Rotlinie; genau 2× im Heft -->
<aside class="callout callout--frist"><p class="callout__label">…Frist</p><p class="callout__date">31.12.2026</p><p class="callout__body">…</p></aside>
<aside class="callout callout--calc"><p class="callout__label"><svg class="icon">…rechner…</svg>Kalkulationsnotiz</p><p class="callout__body">…</p></aside>  <!-- 5-mm-Planraster -->

<dl class="plan-legend"><p class="plan-legend__title">Planlegende</p>
  <div class="plan-legend__item"><span class="plan-legend__sym"><svg>…</svg></span><div><dt>35 Jahre Bindung</dt><dd>Belegungs- und Mietbindung ab Bezugsfertigkeit.</dd></div></div>
  <p class="offer">Wir rechnen Ihr Projekt mit Ihnen durch. → Blatt 20</p>   <!-- höchstens ein Angebotssatz je Fachseite -->
</dl>

<p class="gate"><svg class="icon">…stopp…</svg><span><b>±0 Bewilligung</b> – erst danach Verträge und Baubeginn</span></p>
```

| Variante | Aussehen | Wofür |
|---|---|---|
| `--hinweis` | Papier, 0,3-mm-Linie Tinte, Label grau | Ergänzung, Ausgangswerte |
| `--achtung` | Rot-Hauch, 0,5-mm-Rotlinie, Label rot 9 pt | nur Vorhabenbeginn (S. 18, Kurzverweis S. 4/5) |
| `--achtung.--inline.--ref` | ohne Fläche, Stopp-Icon, Titel 800, 0,25-mm-Rotlinie unten, einzeilig | Kurzverweis auf den Achtung-Kasten (S. 5) – „kein eigener Kasten“ |
| `--frist` | Papier, 0,9-mm-Dunkelrotlinie, Datum Montserrat 900 21 pt | im Heft ungenutzt seit 13.11.2026 (Frist 31.12.2026 entfallen); bleibt als Komponente (Specimen) |
| `--tipp` | Papier, Anthrazitlinie | Praxisrat |
| `--calc` | Weiß mit 5-mm-Planraster, Rechner-Icon rot | höchstens drei Kalkulationsnotizen im Heft |
| `.plan-legend` | gebündelte Hinweise: Symbol rot, Titel als Modultitel (800, 12 pt, gemischt), 2–3 Zeilen; im Heft ungenutzt | statt mehrerer Kästen – die Hinweis-Diät-Form |
| `.gate` | Dunkelrotband, weiß, Titel 800 Versalien | „±0 Bewilligung“ im Ablauf, max. 1 je Seite |

### 6.4 Zitat

```html
<blockquote class="quote"><div class="quote__text"><p>Kostensicherheit ist kein Schlagwort, sondern ein wichtiges Versprechen.</p></div>
  <p class="quote__by"><span class="quote__name">PGN · Über uns</span><span class="quote__src">pgn-architekten.de</span></p></blockquote>
```
Schwarze 0,75-mm-Linie links statt Zier-Anführungszeichen (seit 12.11.2026, vorher rot); „ und “ setzt CSS (nicht tippen). Montserrat 500 kursiv 12 pt (`--l` 17 pt, im Heft ungenutzt). Nur wörtliche Zitate mit Quelle; höchstens zwei im Heft (Redaktionsregeln).

### 6.5 Ablauf (`steps`)

```html
<ol class="steps steps--kote">                                <!-- Höhenkoten: −2 Vorgespräch, −1 Antrag, ±0 Bewilligung, +1 Bau -->
  <li class="step"><span class="step__no">−1</span><div><p class="step__title">Antrag</p><p class="step__text">…</p></div></li>
  <li class="step is-gate"><span class="step__no">±0</span><div><p class="step__title">Bewilligung</p><p class="step__text">Erst jetzt Verträge schließen und bauen.</p></div></li>
</ol>
```
Weitere Varianten wie v1: `.steps--lanes` (Sie · Förderstelle · NBank, Marker voll/hohl), `.steps--h` (waagerecht, roter Winkel zwischen den Schritten), `.ratebar` (Auszahlungsraten). Schrittnummern sonst Montserrat 900 20 pt Rot (Komponente im Heft ungenutzt).

### 6.6 Diagramme (`chart`)

```html
<figure class="chart module" role="group" aria-labelledby="mix-h">
  <figcaption class="chart__head">
    <h2 class="chart__title" id="mix-h">Fördermix je Einkommensgruppe</h2>          <!-- volle Zeile -->
    <p class="chart__sub">Höchstsätze in % der zuwendungsfähigen Kosten</p>           <!-- Spalte 1 -->
    <ul class="legend"><li><i class="sw sw--grant"></i>Zuschuss</li><li><i class="sw sw--loan"></i>Darlehen</li><li><i class="sw sw--equity"></i>Eigenmittel, mind.</li></ul>
  </figcaption>
  <svg class="chart__svg" viewBox="0 0 180 61" width="180mm" height="61mm" role="img" aria-label="Vollständige Datenaussage …">…</svg>
  <p class="chart__note">Gestrichelt: mit Zuschlag bis 85 bzw. 90 %. … <a class="pageref" href="#seite-09">→&nbsp;S.&nbsp;9</a></p>
</figure>
```

**Maßketten-Balken (Fördermix, Signatur des Hefts)** – Bauplan: `scripts/specimen.cjs`, Funktion `foerdermix()`:
- Zeilen je Gruppe 14,5 mm, Balken 6–7 mm (leichte Variante; nie 14 mm-Blöcke), Gruppe als Achskreis (`axb-c` + `axb-t`, r 4,1 mm) mit zweizeiliger Beschreibung.
- Reihenfolge **Zuschuss ab der Grundlinie** (rot) · Darlehen (#202020) · Eigenmittel (Fläche `c-equity` + Vektorschraffur `path.hatch[data-hatch]` + Rahmen `c-equity-frame`, s. 1.3.1 – kein `<pattern>`); 0,7-mm-Fuge als **echter Abstand** (je 0,35 beiderseits der Teilungsstelle, s. „Keine Überdeck-Fugen“ unten).
- Über jedem Balken eine **Maßkette in Anthrazit** (`dim-line` 0,22, `dim-tick` 0,45 als 45°-Strich, Hilfslinien 0,12) mit den Werten (Montserrat 700, `t-val-ink`; `t-acc` steht seit 12.11.2026 ebenfalls in Schwarz).
- **80-%-Achse** als Strichpunkt in Schwarz (`cap-line`, 0,25 mm) mit Achskreis „80“ und Label „Förderung bis zu 80 % – in jeder Gruppe“; Zuschläge als gestrichelte Kappe 80 → 85 → 90, ebenfalls in Schwarz (Hilfslinien sind nicht rot, s. 0a).
  Strichstärken in SVGs mit mm-viewBox immer **ohne Einheit** angeben (`stroke-width: .25`): eine CSS-Länge wie `.25mm` wird in px umgerechnet und dann als Nutzereinheit gelesen – im Diagramm rund 0,95 mm (Korrekturlauf 1, global in `.cap-line`/`.dim-line--acc` behoben).
- **Maßstabsleiste als x-Achse** (`sb-b`/`sb-w`, 1,3 mm hoch, Labels 0–100 `t-ax`).
- Namen im Balken nur in der ersten Zeile („Zuschuss“, „Darlehen“, `t-val t-s` weiß).

**Kopf und Plotfläche:** `.chart__head--stamp` (Zeile 1 Titel + `.stamp`, Zeile 2 Untertitel links, Legende rechts; S. 13), `.chart__plot` (Stempel absolut in der freien Fläche über niedrigen Säulen, spart eine Kopfzeile; bis Korrekturlauf 1 S. 16), `.chart__unit` / `--block` (Einheit im Titel in Work Sans 500 in Textgröße, ohne Komma davor: „Höchstmiete nettokalt € je m² und Monat …“; S. 6, 7, 11, 12, 13), `.legend--wrap` (Legende in schmaler 3-Spalten-Marginalie), `.sw--axis` (80-%-Achse als Legendeneintrag). `.chart__svg` steht im Raster oben (`align-self: start`) und wird nicht auf die Höhe der Nachbarspalte gestreckt.

**SVG-Konventionen:** 1 SVG-Einheit = 1 mm (`viewBox`-Breite = `width` in mm). Beschriftung Work Sans (`text` 3px = 8,5 pt, `t-m` 9,2 pt, `t-l` 12 pt), Werte Montserrat (`t-val`, `t-val-ink`, `t-num` 18 pt, `t-num-l` 25,5 pt, `t-cat` 7px, `axb-t` 5px – alle mit Tabellenziffern). `t-acc` = 700, seit 12.11.2026 Schwarz. `t-unit` = Einheit hinter einem Wert (Work Sans 500 8,5 pt, grau – auch hinter roten Werten). Einkommensgruppen als Achskreis: `c-grp-a/-b/-c` (seq-6/-4/-2) + `t-grp` (`--ink` auf C). `axb-c--acc` = Achskreis der 80-/90-%-Achse (Schwarz, 0,35). `dash--fine` (0,9/0,7) für Wartezeiten, `tl-axis--strong` (0,45) für dominante Zeitleisten, `tl-draft` (gestrichelter Rahmen auf Papier) für Geplantes. Kein `stroke` auf Text. Zahl–Einheit im SVG mit U+202F (aus der Symbolteilmenge).

**Keine Überdeck-Fugen (Optik-Lauf 06.11.2026, Kundenbefund S. 18):** Fugen, Lücken und Freistellungen sind echte Geometrie,
nie eine darübergelegte Linie/Fläche in Papierfarbe (`sep-line`, „Radierer“, Textmaske). Gestapelte Balken/Säulen: Segmente enden
0,35 vor bzw. beginnen 0,35 nach der Teilungsstelle (Fuge 0,7; Geschossdecke im Haus S. 10: 0,3). Ringe: Kreisring-Sektoren als
`path` mit zwei Bögen, Fugen mit parallelen Kanten (Versatz ½ Fuge rechtwinklig zur Radiallinie), kein `stroke-dasharray`.
Konturen liegen innen (Rechteck um ½ Strich eingerückt), wenn die Fläche bündig an Nachbarn oder Bezugslinien stoßen soll;
Maßstabsleisten tragen auf **beiden** Feldern dieselbe Kontur (`.sb-b`, `.sb-w`, `sig-sb-*`). Gefüllte Pfade, die sich
überlappen (Poché, Wände), laufen alle im selben Drehsinn – sonst stanzt `nonzero` an den Überlappungen Löcher.
Leader-/Kotenlinien enden mit festem Abstand vor dem vordersten Punkt des Bezugs (nicht darunter durch). Prüfskript-Ausschnitte
und Bericht: `dist/qa/optik/`.

**Diagramm-Regeln:** (1) Farben je Reihe fest (1.3). (2) Direkt beschriften; Legende im Kopf nur ergänzend. (3) Höchstwerte im Kopf („Höchstsätze“, „bis zu“). (4) Proportionen exakt, Balken ab 0, keine 3D-Effekte. (5) Zahlenformat deutsch. (6) Modellrechnungen tragen den Stempel `.stamp` „Modellrechnung“ (einmal je Rechnung; S. 14). Im Kapitel „Modellrechnung“ (S. 10–12) trägt die Rubrik der Kopfzeile das Wort, dort steht kein Stempel. (7) Nie Größen unterschiedlicher Einheit an einer gemeinsamen Grundlinie – getrennte, gleich ausgerichtete Diagramme. (8) Rot im Diagramm nur für Zuschuss; 80-%-Achse, Zuschlagskappe und Wertbeschriftung stehen in Schwarz. (9) Programmfarben nur mit Nummer. (10) Diagrammtitel ≤ 6 Wörter (12 pt, gemischt), Einheit als `.chart__unit`, Untertitel ≤ 12, Notiz ≤ 30 Wörter / 1–2 Zeilen.

### 6.7 FAQ, Checkliste, Kontakt, Aufzählung

Markup wie v1 (`dl.faq`, `ul.checklist`, `address.contact`, `ul.bullets`); `.checklist--compact` (Modultext, ohne Außenlinien; Vermietungsbedingungen S. 7 – dort seit Korrekturlauf 1 Marken als Inline-SVG `.p07-mk`: Kreis 3,4 mm bzw. Raute 4 mm, Haken/Kreuz/Ausrufezeichen geometrisch exakt zentriert, Mitte auf der ersten Textzeile; die CSS-Marken `.mark`/`.mark--s` zentrieren im PDF nur auf ±0,15 mm und sind derzeit ungenutzt); Badge im Ankreuzpunkt ohne eigenen Außenabstand (Klammer „(Vordruck 3076)“ ohne Luft); `.bullets > li.is-stop` (Ausschluss als Listenpunkt: Stopp-Icon `icon--stopp icon--signal` statt Quadrat, Fettung in Signalrot – Hinweis-Diät statt Achtung-Kasten; seit Korrekturlauf 1 auf S. 17 als Inline-Marke in der Tabellenzelle); `.contact__label--tight` (+0,04 em in schmalen Kontaktfeldern); FAQ-Nummern Montserrat 900 in Schwarz, Frage Montserrat 700 10 pt (`dl.faq` ist im Heft ungenutzt; S. 21 setzt die Verfahrensdetails seitenlokal in den Stufen); Aufzählungsmarker **eckig** (1,4 mm, Schwarz); `.bullets--num` mit „01“ in Schwarz; `.contact__label` 8,5 pt Versalien in Schwarz; `.contact__name` Montserrat 800 Versalien (S. 21 seitenlokal Montserrat 700, 12 pt, gemischt), `.contact__tel` Montserrat 800 17 pt (`--l` 22, `--xl` 28 pt); `.contact--dark` Anthrazitverlauf.

### 6.8 Badges, Chips, Schlüsselplan, Programmnummer

```html
<span class="badge badge--form"><span class="badge__pre">Vordruck&nbsp;</span>1011</span>  <span class="badge badge--frist">Soll ≤ 3 Monate</span>
<span class="tag"><i class="sw sw--grant"></i>Zuschuss</span>   <span class="bs-badge bs-24"><b class="bs-badge__no">2.4</b>Inseln</span>
<span class="grp-chip grp-chip--l grp-chip--a">A</span>   <!-- Einkommensgruppe: Kreis, Stufe 6/4/2 -->
<p class="chapter-no">2.4<small>Programmteil</small></p>       <!-- Programmnummer groß in --bs -->
<span class="bs-matrix" role="img" aria-label="gilt für 2.1 bis 2.4"><i class="bs-21">2.1</i>…<i class="bs-25 is-off">2.5</i>…</span>   <!-- Programmteil-Matrix: 6 Felder, nicht zutreffend = Geisterziffer -->
```

### 6.9 Modellrechnung, Rechenblatt, Stempel

`.stamp` (doppelte Kontur, 0,25 mm + Haarlinie, Montserrat 800 9 pt Rot), `.stamp--s` (Kurzstempel für die zweite Nennung derselben Modellrechnung: einfache Kontur, Schrift der 9-pt-Labels – Redaktionsregeln: nur ein Vollstempel je Rechnung; im Heft zurzeit nicht gesetzt, die Klasse bleibt), `.stampline` (`--inline` und `.kicker-row` sind seit 12.11.2026 im Heft ungenutzt; S. 10 trägt den Hinweis „Rechenbeispiel, keine Förderzusage“ als `.chart__sub` unter dem Titel des Finanzierungsdiagramms, ohne `.stamp`). Im Kapitel S. 10–12 steht das Wort „Modellrechnung“ im Kopf nur als Rubrik der Kopfzeile. Der Stempel ist rot (S. 14), das Label „Mit Förderung der NBank“ auf S. 21 hat eine schwarze Kontur. `.formula--stack` (Grenze als eigene graue Zeile unter dem Term, 400), `.model` (Papier, `model__value` Montserrat 800 16 pt), `.formula` (**5-mm-Planraster** als Vektorzeichnung `--planraster`, s. 1.3.1, Operatoren `+ =` Montserrat 900 in Schwarz, Ergebniszeile 0,3 mm). Markup wie v1.

### 6.10 Planzeichen

```html
<span class="axis-no">A</span>  <span class="axis-no axis-no--accent">80</span>  <span class="axis-no axis-no--s">B</span>   <!-- Achskreis -->
<span class="kote">±0,00 Bewilligung</span>                                                               <!-- Höhenkote: rotes Dreieck -->
<div class="dim" role="img" aria-label="80 Prozent Förderung, 20 Prozent Eigenmittel">                     <!-- Maßkette (HTML) -->
  <span class="dim__seg dim__seg--acc" style="--w:80"><b>80&nbsp;%</b>&nbsp;Förderung</span><span class="dim__seg dim__seg--muted" style="--w:20">20&nbsp;%</span></div>
<div class="cutline" aria-hidden="true"><span>A</span><span>A</span></div>                                   <!-- Schnittlinie A–A als Abschnittstrenner -->
<span class="north"><!-- assets/pgn/sig-nordpfeil.svg inline --></span>
```
Einsatz sparsam und mit Bedeutung: Achskreise für Gruppen/Phasen/Achsen, Koten für Stufen relativ zur Bewilligung, Maßkette für Anteile, Schnittlinie höchstens einmal je Seite zwischen Inhalt und PGN-Teil.

### 6.11 Fotos und Punktraster

```html
<figure class="photo photo--marks" role="group" style="--photo-h:44mm;--photo-pos:62% 55%;--cap-h:7mm">
  <img class="photo__img" src="assets/pgn/img/brauerstrasse-duplex.jpg" alt="…">
  <span class="photo__tag">Referenz</span>
  <figcaption class="photo__caption"><b>Ansicht</b><span>Visualisierung, Brauerstraße 4</span></figcaption>
</figure>
<figure class="photo" role="group" style="--axes-pad:14mm;--cap-h:7mm">                       <!-- Banner mit Achskreisen -->
  <div class="raster" aria-hidden="true"><!-- assets/pgn/sig-raster-brauerstrasse.svg inline --></div>
  <div class="photo__axes" aria-hidden="true"><span><b>1</b></span>…<span><b>5</b></span></div>
  <figcaption class="photo__caption"><b>Punktraster</b><span>…</span></figcaption>
</figure>
```

### 6.12 PGN-Leistungen (`services`)

```html
<figure class="bzp module" role="group" aria-labelledby="bzp-h">
  <figcaption class="chart__head"><h2 class="chart__title" id="bzp-h">Förderweg und Leistungsphasen</h2><p class="chart__sub">nach HOAI</p>
    <ul class="legend"><li><i class="sw sw--grant"></i>förderspezifisch</li><li><i class="sw sw--loan"></i>Planen und Bauen</li><li><i class="sw sw--loan-o"></i>nach der Bewilligung</li></ul></figcaption>
  <div class="bzp__grid u-mt-3">
    <div class="bzp__head"><span class="bzp__label" style="border:0"><span class="label">Leistung</span></span>
      <div class="bzp__phases bzp__phases--top"><span style="grid-column:1 / span 6">Vor der Bewilligung<small>Planung bis LPH 6 ist kein Vorhabenbeginn</small></span><span class="is-after" style="grid-column:7 / span 3">Nach der Bewilligung<small>Vergabe, Bau, Nachweis</small></span></div></div>
    <div class="bzp__head"><span class="bzp__label">…Leistungsphase HOAI…</span><div class="bzp__phases"><span class="bzp__lph"><b>1</b></span>…<span class="bzp__lph"><b>9</b></span></div></div>
    <div class="bzp__row"><div class="bzp__label"><span class="bzp__title"><em>01</em>Förder-Check</span><small>Programmteil, Standort, Rechnung</small></div>
      <div class="bzp__track"><i class="bzp__bar bzp__bar--foerder" style="--from:1;--to:1"></i></div></div>
    <div class="bzp__row">… <i class="bzp__bar" style="--from:2;--to:3"></i><i class="bzp__bar bzp__bar--line" style="--from:4;--to:8"></i> …</div>
    <div class="bzp__row">… <i class="bzp__bar bzp__bar--foerder" style="--from:3;--to:4"></i><i class="bzp__ms" style="--at:4"></i><span class="bzp__ms-t" style="--at:4">Antrag</span> …</div>
    <i class="bzp__gate" style="--at:6" aria-hidden="true"><span>±0 Bewilligung</span></i>
  </div>
  <ul class="bzp__legend"><li><b>LPH</b> 1 Grundlagen · 2 Vorplanung · … · 9 Objektbetreuung</li></ul>
</figure>

<ol class="services services--2col">                              <!-- Textvariante; --band = sieben Stationen nebeneinander (Quadrat-Marken) -->
  <li class="service"><span class="service__no">01</span><div><span class="service__phase">Vor dem Vorgespräch</span>
    <p class="service__title">Förder-Check und Machbarkeit</p><p class="service__text">…≤ 30 Wörter…</p></div></li>
</ol>
<div class="lph-scale" role="img" aria-label="Leistungsphasen 1 bis 9, Bewilligung zwischen 6 und 7"><ol class="lph-scale__list"><li><b>1</b>Grundlagen</li>…</ol><span class="lph-scale__gate" style="--at:6"><span>±0 Bewilligung</span></span></div>
<aside class="offer-box offer-box--dark on-dark"><p class="offer-box__title">Schlüsselfertig</p><p class="offer-box__text">…</p></aside>   <!-- Anthrazit, kein Grün -->
<aside class="offer-box"><p class="offer-box__title">Für Kommunen</p><p class="offer-box__text">…</p></aside>
```
Gantt: Rot nur für förderspezifische Leistungen (Förder-Check, Antragsunterlagen, Nachweis), Fast-Schwarz für Planen und Bauen, dünne Linie für laufende Kostenverfolgung, Kontur für Leistungen nach der Bewilligung, Raute = Meilenstein. Titel einzeilig (≤ 24 Zeichen bei `--label-w: 64mm`), Beschreibung einzeilig (≤ 38 Zeichen) → 10,6 mm je Zeile.

### 6.13 Referenzen (`references`)

```html
<article class="reference reference--feature" aria-labelledby="ref-h">  <!-- Hauptreferenz: Bild 100 mm + Datenspalte -->
  <figure class="photo photo--marks" role="group" style="--photo-h:44mm;--cap-h:7mm">…</figure>
  <div><p class="label">Mit NBank-Förderung</p>
    <p class="reference__units">19 <small>Wohnungen<br>barrierefrei, mit Aufzug</small></p>
    <h2 class="reference__name" id="ref-h">Brauerstraße, Rotenburg (Wümme)</h2>
    <dl class="reference__facts"><dt>Vorhaben</dt><dd>Neubau eines Mehrfamilienhauses</dd><dt>Status</dt><dd>entsteht aktuell; wird durch die Förderung der NBank unterstützt</dd></dl></div>
</article>
<div class="references" style="--n:3">
  <article class="reference"><figure class="photo" role="group" style="--photo-h:30mm"><img class="photo__img" src="assets/pgn/img/porstweg-duplex.jpg" alt="…"></figure>
    <p class="reference__units">29 <small>Wohnungen</small></p><h3 class="reference__name u-mt-2">Porstweg</h3><p class="reference__place">Rotenburg (Wümme) · für die …</p></article>
</div>
```
**Rangfolge in der Kachel (S. 21, seitenlokal `.p22-ref`; Korrekturlauf 1, Stufen seit 12.11.2026):** Projektname (`.reference__name`, Montserrat 800, 12 pt, gemischt, Tinte; Hauptreferenz gleich) → Ort (`.reference__place`, Work Sans 500, 9,5 pt) → Auftraggeber (`.p22-client`: graues Versal-Label „Auftraggeber“ in 8,5 pt über dem Namen, Haarlinie darüber, Firmennamen ohne Trennung; nur wo belegt) → Kennzahl (`.p22-kpi`: Zahl Montserrat 800 12 pt, Einheit Work Sans 8,5 pt, Haarlinie darüber) → Kurzbeschreibung (`.p22-note`, 8,5 pt grau, Größe · Aufzug · barrierefrei · Technik). Die vier kleinen Kacheln teilen ein Zeilenraster (`grid-template-rows: subgrid`, feste `grid-row` je Feld): Namen auf einer Grundlinie (`align-self: end`), Auftraggeber- und Kennzahl-Haarlinien durchgehend; fehlt der Auftraggeber, bleibt die Zelle mit Haarlinie leer. Fördervermerk der Hauptreferenz als eckiges Label mit schwarzer Kontur (8,5 pt Versalien, Schwarz) am Fuß der Datenspalte (bündig mit der Bildunterkante). Das Label „45 Jahre PGN“ steht rechts in der Kopfzeile, in der Form der Rubrik und ohne Rahmen. Rot auf S. 21 nur: Titellinie, Jahreszahl im H1, Wertefeld, Punktraster mit Beschnittmarken. Der Hinweis auf weitere Projekte steht rechts im Modulkopf. Die Zahl-über-Name-Form oben (`.reference__units`) bleibt als Komponente für Einzelreferenzen.
`.reference__units--text`: Einheit gemischt in Work Sans neben der Zahl (schmale 3-Spalten-Referenzen; seit Korrekturlauf 1 auf S. 21 ersetzt durch `.p22-kpi`). **Fakten nur aus `recherche/pgn-facts.md`**, Status wörtlich („entsteht aktuell“, „wird durch die Förderung der NBank unterstützt“ – nie „umgesetzt“; Schreibweise „NBank“, nicht „N-Bank“, daher Paraphrase). Bauherr nur, wo er im Text der Projektseite steht.

### 6.14 PGN-Werte, Logo

```html
<ul class="values" aria-label="Für Sie denken wir an">
  <li class="values__item"><img src="assets/pgn/verantwortung-white.svg" alt=""><span class="values__word">Verantwortung.</span></li> …
</ul>
<img class="logo logo--m" src="assets/pgn/logo-rot.svg" alt="PGN – Architekten, Stadtplaner, Ingenieure">
```
Werte auf S. 21 (seitenlokal `.p22-values`): Auftakt „Für Sie denken wir an:“ in der Vorspannstufe (Work Sans 12 pt, weiß), die vier Wörter in der Form der Modultitel (Montserrat 800, 12 pt, gemischt, weiß) auf dem roten Verlauf, Haarlinien dazwischen. QR-Code inline mit `.qr-bg` / `.qr-mod` (Tokens `--white` / `--ink`; S. 17, U4). Logo: `logo-rot.svg` auf Weiß/Papier (Standard, ≥ 34 mm breit, Schutzzone = Höhe des „P“); `logo-negativ.svg` (weiß mit Unterzeile, abgeleitet) bzw. `logo-weiss.svg` (nur Wortmarke) auf Rot/Anthrazit – Freigabe bei PGN offen, auf dem Umschlag deshalb Logo rot auf weißem Schriftfeld; `logo-mark-rot.svg` nur als Wortmarke im Plankopf (11,5 mm); `logo-mono.svg` (currentColor) für Einfarbdruck. Logo-SVGs sind reine Pfade (als `<img>` vektoriell im PDF). Kein Logo von NBank oder Land.

### 6.15 Inhaltsverzeichnis als Linienplan (`.lp`, U2)

```html
<nav class="lp" aria-label="Inhalt">
  <div class="lp__line"><p class="lp__name">Überblick</p>
    <ol><li class="lp__stop"><a href="#seite-03"><span class="lp__pg"><span class="u-sr">Seite </span>3</span><span class="lp__mk" aria-hidden="true"></span><span class="lp__t">Kennzahlen</span></a></li>…</ol></div>
  <div class="lp__line"><p class="lp__name">Finanzierung</p> … <span class="lp__mk lp__mk--bs bs-21">2.1</span> …</div>   <!-- Programmteil als Chip auf der Linie -->
  <div class="lp__line lp__line--em">…</div>   <!-- Mittel-Doppelseite: Papier, kräftige Linie -->   <div class="lp__line lp__line--pgn">…</div>   <!-- PGN-Teil rot -->
</nav>
```
Je Kapitel (= Kolumnentitel) eine Linie als Pseudo-Element-Strich, Haltestellen als Quadrate (die Stichtag-Marke `.lp__mk--signal`/`.lp__t--signal` ist am 13.11.2026 entfallen). Steuergrößen `--lp-pg` (Seitenzahl 6,2 mm), `--lp-mk` (Marke 7,4 mm), `--lp-gap`, `--lp-w` (Linie 0,7 mm), `--lp-c`. Die Listenform `.toc__item` bleibt für Übersichten ohne Kapitel.

### 6.16 Platzhalter für PGN-Zulieferungen (`.ph`)

```html
<span class="ph">[PGN-Rechnung: … € je Wohnung p. a.]</span>   <td class="num"><span class="ph ph--cell">[PGN-Rechnung]</span></td>
```
Heftweit eine Form für „[PGN-Rechnung: …]“, „[PGN: …]“, „[Platzhalter]“: gestrichelte Haarlinie in `--fg-3`, Fläche `--surface-2`, Text grau, nie umbrochen – Plankonvention „gestrichelt = noch offen“, neutral (S. 11 trug bis 09.11.2026 22 Platzhalter; rot wäre dort eine Fläche aus Rosa). `--cell`: Wertzelle, zentriert, 8,5 pt. Auf Rot (Ergebniszeile) zusätzlich `.on-light`. Beim Einsetzen der Werte den Span samt Klasse ersetzen; Suche nach `class="ph` findet alle offenen Stellen (seit 09.11.2026 keine: S. 11/12 mit den PGN-Werten gefüllt, das Impressum seit Korrekturlauf 1 ohne Platzhalter).

---

## 7 · Umschlag (U1, U4)

Aufgeklappt ist der Umschlag **ein Planblatt**: Planrahmen 8 mm, Schriftfelder auf U1 und U4 mit derselben Oberkante (`--horizon` 196 mm).

**Korrekturlauf 1 – durchgehend roter Umschlag (U4|U1):** Beide Seiten liegen ganz auf dem Rotverlauf (`.cover__art`, randabfallend), Planrahmen, Schriftfeldlinien und Schrift weiß (weiß auf Rot ≥ 9 pt / ≥ 600, Fließtext ≥ 10 pt). Weiß bleiben je Seite nur zwei Felder in derselben Lage: rechts das 56-mm-Feld (U1 Kennzahl invertiert, 80 % in PGN-Rot · U4 QR-Code mit Ruhezone) und unten links das Logofeld 64 mm (`logo-rot.svg`, bis das Negativ-Logo freigegeben ist). **Keine Blattnummern auf dem Umschlag**, Stand nur auf U1 (und im Impressum S. 22). U1-Absenderleiste: Logo | Herausgeber | Stand 56 mm; U4: Logo | Informationsbroschüre. Die Axonometrie auf U1 steht als Negativ: Linien weiß, Flächen deckend in SVG-Verläufen, die den Seitenverlauf in der Lage der Zeichnung nachbilden (`sig-axo-r0` = Seitenverlauf, `r4`–`r16` = + 4–16 % Weiß; `<defs>` in der Inline-Kopie), Linien ≥ 0,16 mm, Planbeschriftung 3,2 px. Umgesetzt seitenlokal (`.page[data-page="01"]`, `.page[data-page="24"]`, U1 mit `.on-red`); die Beschreibungen unten nennen den Stand vor Korrekturlauf 1.

**Gebaut (Stand 22.10.2026): zweizeiliges Schriftfeld** auf beiden Seiten – `.cover__stamp.cover__stamp--2row` (U1) und `.back__stamp.back__stamp--2row` (U4): Zeile 1 Titel bzw. Einladung + Kontakt | 56-mm-Feld (Kennzahl 80 % bzw. QR), Zeile 2 Absenderleiste 18 mm (Oberkante 271 mm) mit Spalten Logo 64 mm | Herausgeber bzw. Projekt | Stand 34 mm | Blatt 22 mm. Kennzahl U1 54 pt (sekundär zur Titelzeile), Bezug darunter `.cover__kpi-note` (600 9 pt). Im weißen Schriftfeld von U4 gelten die hellen Tokens (`--rule` #CFCCC8 statt Rosa aus dem Rot-Scope). Die dreizeilige Fassung unten bleibt für den Specimen definiert.

**U1 (`.page--u1`)**: Kopfleiste (`.cover__head`: Kicker „Planungsgrundlagen für den geförderten Mietwohnungsbau“ + Zelle Ausgabe) · Axonometrie `sig-axo-brauerstrasse.svg` **inline** in `.cover__drawing` (190 × 165 mm) · `.cover__caption` rechts über dem Schriftfeld · `.cover__stamp` mit drei Zeilen: `.cover__row--top` (Für · Planinhalt · Stand · Blatt U1) / `.cover__row--main` (Kicker, `.cover__title` mit rotem Signaturwort, `.cover__deck` | `.cover__kpi` auf Rotverlauf: „Bis zu“, 80 % in Montserrat 900 64 pt weiß, Label, Maßkette 80/20) / `.cover__row--foot` (Logo rot · Herausgeber · Grundlage). Textmengen: Titel ≤ 5 Wörter / 2–3 Zeilen bei 30 pt; Deck ≤ 25 Wörter; Schriftfeld-Werte ≤ 8 Wörter (8,5 pt Montserrat 600).

**U4 (`.page--u4`)**: `.cover__art` (`data-bleed`, Rotverlauf) mit `sig-grundriss.svg` **inline** (ganzseitig 210 × 297, weiße Linien, Poché-Wände) · `.planframe` · `.back__claim` (Kicker + `.claim` 34 pt: „Aus Ihrer guten Idee“ als `.light`, „machen wir den *besten Plan.*“; seit 13.11.2026 ohne Gedankenstrich wie Folie 28 des Vortrags, H1 mit `data-satz`) · `.back__stamp` weiß: Logo + Beschreibung | Kontakt (`address.back__contact`, Links `.u-url`) | QR (`qr-pgn-architekten.svg` inline, Ziel www.pgn-architekten.de, Ruhezone 4 Module) / Förder-Check-Einladung (`.back__invite-cell`, ein Satz) / Projekt + Blatt U4.

Druck: Nur `.cover__art` läuft in den Beschnitt; Planrahmen und Schriftfelder bleiben im Endformat. Weißer Text auf dem Verlauf ≥ 9 pt (Kicker 9 pt 700, Claim 34 pt).

---

## 8 · Assets (`src/assets/pgn/`)

| Datei | Inhalt | Einsatz |
|---|---|---|
| `logo-rot.svg` · `logo-weiss.svg` · `logo-gruen.svg` | Originale der Website (grün nicht verwenden) | s. 6.14 |
| `logo-negativ.svg` · `logo-mono.svg` · `logo-mark-rot.svg` | abgeleitet: weiß mit Unterzeile, currentColor, Wortmarke rot | Rot/Anthrazit · Einfarbdruck · Plankopf |
| `sig-axo-brauerstrasse.svg` | Axonometrie Brauerstraße (Walmdach, Kopfbau, Balkone, PV, Klinker), Maßketten mit 80-%-Marke, Achskreise 1–6/A–C, Koten, Nordpfeil, Maßstab | U1, Kapitelauftakt; **inline** |
| `sig-grundriss.svg` | Regelgeschoss „Rotpause“ (Poché, Achsen, Bemaßung, WE 1–8, Nordpfeil), ganzseitig | U4 in `.cover__art`; **inline**; Farbe über `color` |
| `sig-raster-brauerstrasse.svg` | Vektor-Punktraster 180 × 68 mm (currentColor, ≈ 17.000 Punkte in 8 Stufen) | `.raster` auf Kapitelauftakt/Über PGN |
| `sig-nordpfeil.svg` · `sig-kote.svg` · `sig-schnitt.svg` · `sig-massstab.svg` · `sig-achskreis.svg` | Einzelzeichen (auch für InDesign) | inline oder als Vorlage |
| `img/*-duplex.jpg` · `img/*-duplex-rot.jpg` | Duplex #202020 → #F4F3F2 bzw. Dreiton Rot (Brauerstraße, Porstweg, Dehnenweg, Burgsiedlung, Bahnhofstraße) | Referenzen ≤ 120 mm, rot nur Kapitelauftakt |
| `qr-pgn-architekten.svg` | QR-Code (Version 3, Fehlerkorrektur M) für https://www.pgn-architekten.de, Farben über `.qr-bg`/`.qr-mod` (Rückfall im eigenen `<style>`), dekodiert geprüft | U4, inline |
| `*-white.svg` (4) | Werte-Icons der Website | `.values` |
| `ref/*.jpg` | Originale 1800 × 740 px (Bildrechte bei PGN klären, MANIFEST.md) | nur über `pgn-images.py` |

Druckregel in den Signaturen (`scripts/pgn-signatures.cjs`, `FS_RED` = 3,2 px = 9,1 pt): rote Maßkettenschrift der Axonometrie und die weiße Planbeschriftung der Rotpause ≥ 9 pt; rote Linien der Axonometrie (Dachdeckung, Figuren, Maßhilfslinien) 0,25 mm. Die Klinkerlinien (`.sig-brick`, 0,13 mm in #D58E9D) sind Textur, kein Rot im Sinn der Druckregel – bei Andruck prüfen. Nach `node scripts/pgn-signatures.cjs` die Inline-Kopien auf U1/U4 nachziehen (nur der `<style>`-Block ändert sich; auf U1 die `<defs>` mit den Verläufen `sig-axo-r*` erhalten).

Signaturen mit Text **immer inline** einbetten (Inhalt der Datei ohne Kommentar in das HTML kopieren): Als `<img>` fehlen die Webfonts und `render.cjs` kann den Text keiner statischen Instanz zuordnen. Die Dateien tragen ihr eigenes, auf die id beschränktes `<style>` mit Token-Rückfallwerten. Neu erzeugen: `node scripts/pgn-signatures.cjs`, `python3 scripts/pgn-images.py`. v1-Assets (`assets/*.svg`: Piktogramme, UI-Icons, Haus-Diagramm) bleiben gültig und übernehmen die PGN-Farben über die Klassen `pict-*`, `icon`, `ill-*`.

---

## 9 · Bildeinsatz

- Website-Bilder sind höchstens 1800 × 740 px: **Duplex bis 120 mm Breite** (≥ 380 ppi), Banner bis 180 mm (≥ 254 ppi) nur als Punktraster oder rot-Duplex auf Kapitelauftakten. Nie randabfallend, nie farbig-original (Klinker-Orange und blauer Himmel kämpfen mit PGN-Rot).
- Großformatig nur **Vektor-Punktraster** (kein vorgerastertes Pixelbild → kein Moiré, einfärbbar).
- Jedes Foto mit Bildunterschrift `.photo__caption` („Ansicht“, „Visualisierung …“), Referenzbilder mit `.photo__tag` – bei mehreren Bildern auf einer Seite stattdessen die neutrale Bildecke `.photo__credit` („Visualisierung“, weiß, 8,5 pt grau; S. 21), sonst wird es zu viel Rot. Beschnittmarken `photo--marks` nur an einem Bild je Seite.
- Bildrechte und Credits vor dem Druck bei PGN erfragen; Hi-Res-Originale (`…-5120.jpg`) anfordern.

---

## 10 · Textmengen je Layout-Typ (gemessen am Specimen)

Satzspiegel 180 × 259 mm (14 → 273 mm). Gemessen: Programmkopf (Nummer + H1 mit zweiter Stimme + Deck + Gegenstand 4 Zeilen; 51 mm im Specimen mit dem alten Kopf gemessen) · Titelblock split 34 mm · Fördermix-Diagramm mit Kopf und Notiz 89 mm · Bauzeitenplan 7 Zeilen 133 mm · Rechenblatt 3 Zeilen 33 mm · Hero-Kachel 46 mm · Kachelreihe 42 mm · Höchstmieten 2 Zeilen 29 mm · Callout-Reihe (3 × 4 Sp.) 42 mm · Planlegende 2 Einträge 46 mm · Höhenkoten-Ablauf 4 Schritte 78 mm · Referenzreihe (3) 60 mm · Hauptreferenz 65 mm · Punktraster-Banner 74 mm · Werte-Reihe 27 mm. Die Maße stammen aus dem Specimen vor der Stufung (Fließtext 9,75 pt, Modultext 9 pt). Seit 12.11.2026 gilt: Text 9,5 pt mit 4,76 mm Zeilenhöhe, dichte Seite 9 pt mit 4,45 mm; der Specimen ist nicht nachgemessen.

| Layout-Typ (plan.json) | Wörter | Struktur |
|---|---|---|
| cover (U1) | ≤ 40 | s. 7 |
| editorial (U2) | 180–210 | Titelblock, Editorial 2 Spalten mit Initiale, Inhaltsverzeichnis, Unterschrift |
| key-figures | 160–190 | Hero + 6 Kacheln (Label ≤ 6, Text ≤ 15 Wörter) |
| program-detail | **200–240** | Programmkopf · 1 dominantes Diagramm/Tabelle (≤ 75 mm) · 2 Module (Rechenblatt, Zuschläge/Planlegende) · kein Hinweiskasten. Specimen S. 8: 188 Wörter füllen die Seite mit einem 89-mm-Diagramm; ab 240 Wörtern Diagramm auf 70 mm verdichten oder ein Modul streichen |
| term-sheet | 200–230 | Zeitstrahl ≤ 50 mm + `.table--terms` ≤ 12 Zeilen (Modultext ≥ 9 pt) |
| chart-focus (Mittel-Doppelseite) | 200–240 | Hauptdiagramm 80–110 mm + Rechenweg-Tabelle ≤ 8 Zeilen + 1 Kalkulationsnotiz |
| table-focus / chart-table | 200–240 | Haupttabelle ≤ 8 Zeilen + Marginalie ≤ 60 Wörter |
| table-checklist / decision-tree / timeline / infographic | 180–220 | wie v1, ein dominantes Element |
| process (Antragsweg) | 200–230 | Höhenkoten-Ablauf ≤ 7 Schritte (≤ 2 Zeilen) + 1 Achtung-Kasten |
| services | 180–240 | Bauzeitenplan 7 Zeilen + 2 Ergänzungsmodule (Specimen: 175 Wörter) |
| service-checklist | 220–250 | Checkliste 2 Spalten + Kontakte + Verfahrensdetails |
| about-references | 150–200 | Auftakt mit Raster-Banner + Hauptreferenz + 3 Referenzen oder Werte |
| imprint (S. 22) | ≤ 200 | Impressum, zentraler Rechtshinweis, Rechtsquellen (drei Gruppen, hängender Einzug) |
| sources (S. 23, U3) | ≤ 150 | Quellentabelle über die volle Breite; die Fläche darunter bleibt frei (seit 14.11.2026 keine Notizfläche) |
| back-cover (U4) | ≤ 45 | s. 7 |

Harte Obergrenze Fachseite 280 Wörter (Redaktionsregeln). Passt etwas nicht: zuerst Doppelungen streichen, dann Modul verkleinern (`kf--s`, `.table--compact`, Diagramm niedriger), nie unter 8,5 pt, nie Abstände unter die Tokens.

---

## 11 · Kalibrierung mit den v1-Partials (Stand 21.10.2026)

Die Partials `src/pages/01–20` stammen aus der NBank-Fassung (Dichte bis 414 Wörter/Seite) und werden seitenweise neu gesetzt. Mit dem PGN-System gerendert (`dist/qa/all.pdf`, 2.055/2.055 Textstellen statisch, nur CID-Schriften) laufen über das Satzspiegelende (273 mm):

| Seite | Überlauf | Ursache / beim Neusatz |
|---|---|---|
| 2 Editorial | +3,4 mm | 326 Wörter → 210 |
| 5 Navigator | +2,7 mm | Fundstellenblock entfällt (Hinweis-Diät) |
| 7 Mieten | +6,1 mm | 395 Wörter → 230 |
| 8 Programmteil 2.1 | +3,8 mm | 401 Wörter → 240; neuer Aufbau wie Specimen |
| 15 Stichtag | +12,2 mm; H1 „Modernisierungsanträge“ 17,5 mm zu breit | 362 Wörter → 220; `&shy;` in der H1 |
| 18 Standort | +2,6 mm; H1 8,5 mm zu breit | 414 Wörter → 230; H1 umbrechen |
| 19 Antragsweg | +7,0 mm; H1 „Verwendungsnachweis“ 14 mm zu breit | 353 Wörter → 210; `&shy;` |

Weitere Einzelbefunde: S. 3 Kennzahl „4.800/5.000“ 7,7 mm breiter als die Kachel (→ `kf--s` oder zwei Werte), S. 4 Eckbeschriftung `p04-corner` 11,1 mm (seitenlokales CSS). Alle übrigen Seiten passen. Titel (S. 1) und Rückseite (S. 20) der v1 werden durch U1/U4 ersetzt.

---

## 12 · QA vor Abgabe einer Seite

- `render.cjs` ohne `OVERFLOW`, `LASTLINE`, `SATZSPIEGEL`, `MUSTER`, `PDFUA`, `FEHLER`, `FONT`; `MUSTER` meldet gerasterte Musterfüllungen (s. 1.3.1); `SATZSPIEGEL` meldet Inhalt unter der Satzspiegel-Unterkante (273 mm bzw. Polster der Seite) und Inhalt, der aus einem Block fester Höhe ragt; „Statische Schriften: N/N“; `pdffonts` nur CID TrueType (Montserrat-…, WorkSans-…, PGNSymbols-…).
- PNG ansehen: H1 ohne Überstand, nichts klebt an Linien (≥ 2 mm), Module enden ≥ 5 mm über dem Plankopf.
- Stufen und Rot nach 0a prüfen: nur 25 | 15,5 | 12 | 9,5 (dicht 9) | 8,5 pt und die Kernwerte; Rot nur an Titellinie, einem Wort oder einer Zahl im H1, Zuschuss, Ergebniszeile, Achtung, Register und Programmteilfarbe, Stempel, Logo.
- Doppelseite: Kopfzeile, H1 und erste Bandlinie links und rechts auf gleicher Höhe; über einem Modultitel mehr Luft als darunter.
- Druckregeln (0.4), WCAG (1.1), Mindestschrift 8,5 pt auch in SVG.
- Fakten: PGN nur aus `recherche/pgn-facts.md`, Förderinhalte aus `content/pages/*.json` – Wortlaut je Textstelle gegen den DOM-Text prüfen (Klammern und Satzzeichen um Seitenverweise inklusive).
- Gemeinsame Horizonte einer Doppelseite nach Änderungen an globalen Komponenten nachmessen (schon 0,4–0,6 mm an einem Baustein verschieben alles darunter).
- Bekannt, nicht behoben: Versal-Labels mit Laufweite (Rubrik 0,16 em, `.label`, `.bullets__title`, SVG `.t-caps`) liest `pdftotext` als gesperrte Einzelbuchstaben („N AVI G ATO R“); Satz und Struktur sind korrekt, betroffen sind nur Copy & Paste und Volltextsuche einzelner Viewer.

## 13 · Integration der Seiten-CSS (Stand 22.10.2026)

Stand der Integration vom 22.10.2026. Seit der Stufung vom 12.11.2026 (0a) gilt abweichend: Seitenverweis ohne Chip, Kickerzeile `.kicker-row` und `.stampline--inline` im Heft ungenutzt, `.chart__unit` auf S. 6, 7, 11, 12 und 13, Run-in-Label in 8,5 pt.

Aus den Meldungen der Seitenbauer übernommen (global, seitenlokale Kopien entfernt): Seitenverweis-Chip kompakt und auf Anthrazit lesbar (S. 3, 4, 7, 9, 14, 15, 18–21) · Platzhalter `.ph` (S. 11, U3) · Rechenblatt-Tabelle `.table--sheet`, `.is-sum`, `.table__op`, Ergebniszeile `.is-result` (S. 10, 11) · Kickerzeile `.kicker-row`, `.stampline--inline`, `.stamp--s` (S. 10, 11) · Run-in-Label `.runin` (S. 5, 8, 12, 20) · Programmnummer im Text `.bs-no` (S. 18, 21) · QR-Farben `.qr-bg/.qr-mod` (S. 18, U4) · Schriftfeld zweizeilig `.cover__stamp--2row` / `.back__stamp--2row`, `.cover__kpi-note` (U1, U4) · Linienplan `.lp` (U2) · Programmteil-Matrix `.bs-matrix` (S. 4) · `.callout--ref` (S. 5) · SVG `c-grp-*`/`t-grp` (S. 6) · `.chart__unit`, `.table--figures-m`, `.checklist--compact`, `.mark--s` (S. 7) · `.formula--stack`, `.legend--wrap`, `.chart__svg` oben im Raster, kompakter Programm-Tag (S. 8) · `.table--terms` = Eckdaten (S. 9) · SVG `.t-unit` (S. 10) · `.sw--axis` (S. 11) · `.chart__head--stamp`, `.kf--band--compact`, `.axb-c--acc` (S. 8, 13) · Heatmap `c-bs-step-*` (S. 14) · `.tl-axis--strong`, `.tl-draft` (S. 15) · `.key-figures--n`, `.chart__plot`, `.bullets > li.is-stop`, `.dash--fine` (früher S. 16, 17; seit Korrekturlauf 1 im Heft ungenutzt, bleiben als Komponenten) · `.lead--cols-2` (S. 18) · `--station-mk` (S. 19, 20) · `.contact__label--tight` (S. 21) · `.photo__credit`, `.reference__units--text` (S. 22). Dazu Assembler (SVG-Überspringen, Bereiche, Fugen), Signaturen (Druckregel), `render.cjs` (SATZSPIEGEL).

**Bewusst seitenlokal (Einzelfall, Geometrie an die Seite gebunden):** Kennzahlraster mit Subgrid und Reiter (S. 3), Navigator-Baum und Ziel-Kacheln (S. 5), Zulassungsband (S. 6), Eckdaten-Vergleich zweier Programmteile mit gemeinsamen Zeilen über beide Spalten und zwei Daumenregistern (S. 16, Korrekturlauf 1), Vorrang-Leiter (S. 17), Swimlane und geteilter Achtung-Kasten (S. 18), HOAI-Planleiste mit dem Namen jeder Phase im Feld, Feldbreiten nach Namenslänge (S. 19, seit 13.11.2026; vorher Legende darunter), Werte gestapelt (S. 21), Quellentabelle und Notizfläche im Planraster (S. 23, seit 13.11.2026). Entfallen am 13.11.2026: Frist-Kasten am Zeitleisten-Pin (Blatt „Stichtag“), Logo-Band als Fuß des Impressums (jetzt Standardfuß). Kandidaten für eine globale Komponente, sobald ein zweiter Einsatz entsteht. **Nicht übernommen:** `text-wrap: wrap` statt `balance` für alle h3 (nur S. 8 betroffen, lokal gelöst); Kursiv-Instanz Work Sans 500 (nicht gebraucht); Laufweite der Versal-Labels (s. 12).
- Druck-PDF: randabfallende Flächen (Register, U4-Verlauf) im Beschnitt prüfen (`--print-pdf`).
