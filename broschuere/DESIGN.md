# PGN-Designsystem „Planwerk“ – Komponentenkatalog

Broschüre **Mietwohnraumförderung Niedersachsen 2026** (RL Mietwohnraum 2026), Herausgeber **Planungsgemeinschaft Nord GmbH**
(PGN Architekten und Ingenieure, Rotenburg (Wümme)). DIN A4 hoch, 24 Seiten, Rückendrahtheftung: U1 Titel · U2 Editorial/Inhalt ·
20 Innenseiten · U3 Impressum · U4 Rückseite.

**Leitidee:** Die Broschüre ist ein **Planwerk**. Die Gestaltung kommt aus dem Handwerk eines Generalplaners: Planrahmen,
Schriftfeld mit Blattnummer, Achskreise, Maßketten mit 45°-Architektenstrich, Höhenkoten, Schnittlinie, Maßstabsleiste,
Nordpfeil, Axonometrie. Rot ist **der eine Akzent** (Zuschuss, Maßkette, Marke, Bewilligung); alles andere steht in
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
3. **Mindestschrift 8,5 pt** – auch in SVG (`3px` bei 1 Einheit = 1 mm). 8,5 pt (`--fs-micro`) nur für Fundstellen, Bildunterschriften, Achsen, Versal-Labels, Schriftfeld-Bezeichnungen, Badges. **Modultext 9 pt / 1,38** (`--fs-module`). **Fließtext 9,75 pt / 1,47** (Work Sans). Vorspann 11 pt.
4. **Druckregeln (Offset, PGN-Rot aus drei Druckfarben):** rote Linien ≥ 0,25 mm (`--rule-red-min`), rote Schrift ≥ 9 pt und ≥ 600 (`--fs-label-accent`: alle roten Versal-Labels 9 pt), kein Negativtext unter 9 pt aus Verläufen (weiß auf Rot: ≥ 9 pt, ≥ 600; Fließtext auf Rot nur ≥ 10 pt). PGN-Rot nach Möglichkeit als Sonderfarbe anlegen (bei PGN/Agentur „klar“ erfragen). **Kein vollflächiger Papierton** auf Innenseiten (`#F4F3F2` druckt als 4-%-Fläche wolkig) – Papier nur für Kästen, Bänder, die Blatt-Zelle und höchstens die Mittel-Doppelseite (`.page--accent`); für ein getöntes Heft Naturpapier statt Fläche.
5. **Silbentrennung** setzt `scripts/assemble.cjs` (weiche Trennstriche, `HYPH_EXCEPTIONS`, `NBSP_RULES` – unverändert aus v1, s. README). Überschriften, Titel, Zahlen und Versal-Labels bekommen **keine** automatischen Trennstriche (`NOHY_CLASSES`, ergänzt um `claim`, `service__title`, `reference__name`, `bzp__title`, `keyplan`, `kote`, `axis-no`, `titleblock__value`, `page__running` …). Überschriften stehen auf `hyphens: manual`: **Montserrat-Versalien sind breit – lange Komposita in H1/Claim immer von Hand an der Fuge trennen** (`Mietwohnraum&shy;förderung`, `Modernisierungs&shy;anträge`). Faustregel H1 25 pt: ≈ 6,8 mm je Versal → 14 Zeichen auf 8 Spalten (≈ 99 mm), 19 Zeichen auf 12 Spalten.
   **Seit der CSS-Integration (22.10.2026):** Zahlen- und Stufenbereiche mit Halbgeviertstrich („10–40 %“, „6,50–9,00 €“, „15–20 Jahre“, „I–III“, „08:00–17:00“) setzt der Assembler samt Einheit in `.u-nowrap` – Chromium bricht sonst nach „–“ um. Inhalt von `<svg>` bleibt bis zum schließenden `</svg>` unberührt, auch wenn die Signatur ein eigenes `<style>` trägt (früher setzte das innere `</style>` den Zustand zurück → Trennstriche in SVG-Text, LASTLINE-Fehlalarme). Neue Fugen: `Gebäude|nutz|fläche`, `Einkommens|gruppe`. `NOHY_CLASSES` + `ph`, `runin`, `bs-no`.
   **Einheitenzeichen im Versalsatz bleiben klein** („JE m² WOHNFLÄCHE“, nicht „JE M²“): Der Assembler setzt „m²“ in allen Elementen ohne Trennung (`NOHY_TAGS`/`NOHY_CLASSES`: Überschriften, Labels, Vorspann, Tabellenköpfe) in `<span class="u-unit">` (`text-transform: none`). Ein neues Versal-Element mit Einheit gehört deshalb in `NOHY_CLASSES`; an anderer Stelle `.u-unit` von Hand setzen. In SVG-Text keine Einheiten in `.t-caps`.
6. **Keine negativen Ränder an Grid-/Flex-Kindern** (Chromium-Druck rechnet sie anders). Ausnahme: die rote Titellinie der H1 hängt per `::before` 5,75 mm links neben dem Satzspiegel – das ist ein absolut positioniertes Pseudo-Element, kein Rand.
7. **Randabfallend** (Daumenregister, Umschlagverlauf, Grundriss U4) bekommt `data-bleed`. Verläufe laufen nur über `.cover__art` in den Beschnitt (`render.cjs` verlängert dort `left/top/width/height` und die viewBox ganzseitiger SVGs); Vollton-Flächen mit `data-bleed` verlängert der Druck-Lauf per Schatten. Text ≥ 5 mm vom Endformat.
8. **Förderquoten mit „bis zu“** nur in Headline, Kennzahl, Tabellen- und Diagrammkopf („Höchstsätze“); Eigenmittel „mind.“. Vorbehalte, Fundstellen und Haftung stehen einmal im Impressum (U3) – siehe `content/REDAKTIONSREGELN.md` (Hinweis-Diät). Genau zwei Achtung-Kästen im Heft (Vorhabenbeginn, Frist 31.12.2026).
9. **Querverweise** „→ S. N“ als Link `<a class="pageref" href="#seite-NN">→&nbsp;S.&nbsp;N</a>`; jede `section.page` trägt `id="seite-NN"`. **Wortlaut wie im JSON:** steht der Verweis dort in Klammern, bleiben Klammern und Satzzeichen (`<span class="u-nowrap">(<a class="pageref" …>…</a>).</span>`) – auf allen Seiten gleich. Der Chip ist 4,35 mm hoch (passt in die 9-pt-Modulzeile, kein seitenlokales Nachpolstern) und links wie rechts 1 mm gepolstert, damit ein folgendes Satzzeichen am Chip steht. Auf Anthrazit (`.page--dark`, `.on-dark`, `.contact--dark`) Kontur statt Hauch, Schrift `--accent-text` (#E8A3B1). **Keine Links in Absätzen, die im Mehrspaltensatz über eine Spaltengrenze laufen:** Chromium schreibt dort zusätzlich eine Link-Annotation an die Position vor dem Umbruch (S. 2: Geisterlink über dem Inhaltsverzeichnis; `render.cjs` meldet „Link-Annotation ohne passenden DOM-Link“).
10. **Barrierefreiheit im PDF** (getaggt): `<figure>` ohne eigene Rolle → `role="group"`; Diagramm-SVGs `role="img"` + vollständiges `aria-label`; Signaturen, Planrahmen, Fuß, Register, Achskreis-Überlagerung `aria-hidden="true"` (Artefakte); Fotos mit `alt`; englische Begriffe `<span lang="en">`. Kein bedeutungstragender Generated Content (`::before` nur für Striche, Marker, Dreiecke; Ausnahme Zitatzeichen „ “ und das Label „Blatt“ im Artefakt-Fuß).
11. **Seitenspezifisches CSS** nur im `<style>` der eigenen `<section>` mit Präfix `.page[data-page="NN"]`; dort keine neuen Hex-Farben.
12. **Ein dominantes Element je Seite** (Kennzahl, Diagramm, Tabelle oder Prozess), höchstens drei Module daneben; Weißraum ist Gestaltungsmittel.

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

## 1 · Tokens

### 1.1 Farben (Palette → Semantik)

| Token | Wert | Rolle | Kontrast |
|---|---|---|---|
| `--pgn-red` | #B71E3F | Akzent, Zuschuss, Maßketten, Marke | Weiß darauf 6,4:1; auf Weiß 6,4:1, auf Papier 5,8:1 |
| `--pgn-red-deep` | #8B2939 | Verlaufsende, Signal (Frist, Bewilligung, Warnband), Seitenverweis-Text (`--accent-deep`; auf Anthrazit → #E8A3B1, auf Rot → Weiß) | Weiß darauf 8,5:1 |
| `--grad-red` | 160°, #B71E3F → #8B2939 | rote Flächen (U4, Kennzahlfeld U1, Hero-Kachel, Werte, Phase „nach Bewilligung“) | – |
| `--pgn-red-300` | #E8A3B1 | Akzent als Text auf Anthrazit | 5,4:1 auf #3C3C3B |
| `--pgn-red-100` / `-50` | #F7E3E7 / #FBF1F3 | Hauch: Seitenverweis-Chip, Achtung-Kasten, ±0-Zeile | Grau #626160 darauf ≥ 5,0:1 |
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
| Eigenmittel (mind.) | `--equity` + Schraffur · `sw--equity` | #DCD8D3 mit 45°-Schraffur #8E8A85, **immer beschriftet** | 1,4:1 gegen Weiß → Relief: Schraffur + Beschriftung + Rahmen `c-equity-frame` |
| Zuschlag (+5/+10 Pp.) | `dim-line--acc` gestrichelt · `sw--cap` | rote gestrichelte Kappe über der 80-%-Achse | – |
| Miete/Ertrag | `c-ink` · `sw--ink` | Fast-Schwarz (nie `c-loan` daneben) | – |
| bisher / altes Recht | `--old` · `c-old` · `sw--old` | #B4B0AB | – |
| Einkommensgruppen A/B/C | `seq-6/-4/-2` · `.grp-chip--a/b/c` · `.axis-no` | warmes Grau dunkel → hell; im Diagramm Achskreis mit Buchstabe | Text auf Stufe 1–3 #202020 (≥ 7,3:1), auf 4–6 weiß (≥ 4,8:1) |
| Heatmap | `seq-1` … `seq-6` | eine Tonleiter, Werte stehen immer in der Zelle | – |
| Heatmap auf einer Programmseite | `c-bs-step-1` … `c-bs-step-7` | Tonleiter der Programmfarbe: Tint → `--bs` → `--bs` + 25 % Tinte (color-mix); Text `--fg` auf Stufe 1–5, `--on-bs` auf 6–7 | Tinte auf Stufe 5 ≥ 5,3:1, Weiß auf `--bs` 5,4:1, auf Stufe 7 ≈ 7:1 (2.3); nur mit Programmnummer im Seitenkopf (S. 14) |
| Dauer ohne Geldfluss (Bindung, Laufzeit) | `dim-line` / `dim-tick` | Maßkette in Anthrazit, kein Band in der Programmfarbe (2.1 = Rot wäre „Zuschuss“, der Tint zu flau) | S. 9 |
| Signal (Bewilligung, Stichtag) | `--signal-fill` · `c-signal` · `tl-pin--signal` | Dunkelrot, immer mit Label | – |

Darlehen in Anthrazit #3C3C3B fällt durch (CVD ΔE 5,7 gegen Rot) – deshalb #202020. Rot nie für Rahmen, Achsen oder Maßketten **im Diagramm** (Maßketten dort Anthrazit `dim-line`/`dim-tick`); Rot bleibt Zuschuss + 80-%-Achse.

### 1.4 Typografie

| Token | Wert | Schrift | Einsatz |
|---|---|---|---|
| `--fs-cover` | 30 pt | Montserrat 900 Versalien, lh .97 | Titelzeile U1 (2–3 Zeilen) |
| `--fs-h1` / `--fs-h1-s` / `.h1--xl` | 25 / 20 / 34 pt | Montserrat 900 Versalien, lh 1,04, Laufweite −0,005 em | Seitentitel / dichte Seiten / Kapitelauftakt |
| `--fs-h2` | 13 pt | Montserrat 900 Versalien | Abschnittstitel |
| Diagramm-/Modulkopf (`.chart__title`, `.fig-head__title`) | 10 pt | Montserrat 800 Versalien, +0,07 em | Planlegenden-Titel |
| `--fs-h3` | 10,5 pt | Montserrat 700, gemischt | Fragen, Begriffe, Programmtitel |
| Modultitel (`.callout__title`, `.step__title`, `.service__title`) | 9,75 pt | Montserrat 800 Versalien, +0,04 em | – |
| `--fs-deck` | 10,5 pt | Montserrat 300 Versalien, +0,03 em; Kennwert `b` 800 Rot | Unterzeile unter H1 |
| `--fs-lead` | 11 pt / 1,45 | Work Sans 400, max. 132 mm (≈ 65–70 Zeichen) | Vorspann |
| `--fs-body` | 9,75 pt / 1,47 | Work Sans 400, `b` 600 | Fließtext |
| `--fs-module` | 9 pt / 1,38 | Work Sans | Listen, Kästen, Kacheln, Tabellenzellen |
| `--fs-micro` | 8,5 pt | Work Sans 500 / Montserrat 700 Versalien (+0,1 em) | Labels, Achsen, Fundstellen |
| `--fs-label-accent` | 9 pt | Montserrat 700 Versalien, rot | Kicker und alle roten Labels (Druckregel) |
| `--fs-fig-hero` / `-xl` / `-l` / `-m` / `-s` | 84 / 46 / 28 / 21 / 17 pt | Montserrat 800–900, Tabellenziffern | Hero-Zahl / große / Kachel / kleine Kachel / Tabellen-Kernwerte |

Zahlen immer Montserrat mit `tabular-nums` (Kachel, Tabelle `.num`, Diagrammwerte `t-val`, Blattnummer). Einheiten (`kf__unit`) halb so groß in Rot. Signaturwort (`em` in `.h1`, `.claim`, `.cover__title`) = Montserrat 800 kursiv Rot. Zweite Stimme `.light` = Montserrat 300 Versalien.

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
| `--station-mk` | 4,4 mm | Quadrat-Marke einer Station (Antragsweg S. 19 im SVG, Leistungen S. 20) |

Spaltenbreiten: 3 Sp. 41,25 · 4 Sp. 56,7 · 5 Sp. 72,1 · 6 Sp. 87,5 · 7 Sp. 102,9 · 8 Sp. 118,3 · 9 Sp. 133,8 · 12 Sp. 180 mm.
Linien: `--hair` 0,2 mm · `--rule-w` 0,3 mm · `--rule-heavy` 0,5 mm (Modulkopf) · `--rule-accent` 0,75 mm (rote Titellinie) · `--rule-red-min` 0,25 mm. Abstände `--sp-1 … --sp-16` (1–16 mm).

---

## 2 · Seitenrahmen

```html
<section class="page bs-21" data-page="08" id="seite-08">
  <div class="bs-register" data-bleed aria-hidden="true">2.1</div>          <!-- nur Programmseiten: Daumenregister -->
  <header class="page__header">
    <span class="page__section"><b>2.1</b>Finanzierung</span>               <!-- Rubrik links (b = rotes Kürzel, optional) -->
    <div class="keyplan" role="img" aria-label="Programmteil 2.1 von sechs Programmteilen">
      <span class="keyplan__label">Programmteil</span>
      <ol class="keyplan__list"><li class="bs-21 is-on">2.1</li><li class="bs-22">2.2</li><li class="bs-23">2.3</li>
        <li class="bs-24">2.4</li><li class="bs-25">2.5</li><li class="bs-26">2.6</li></ol>
    </div>
  </header>
  … Inhalt (Flex-Spalte; .l-bottom schiebt ein Modul an den Fuß) …
  <footer class="page__foot" aria-hidden="true"><span class="page__folio">8</span><span class="page__running"><span>Mietwohnraumförderung Niedersachsen 2026<span class="sep">·</span><b>Finanzierung · Programmteil 2.1</b></span><span>Stand: 21.10.2026</span></span></footer>
</section>
```

- **Mini-Plankopf** (`.page__foot`, Markup wie v1): 9,5 mm hoch, 0,3-mm-Oberlinie, Zellen: *Blatt NN* (Papier, Montserrat 900 12 pt, Label „Blatt“ per CSS) · PGN-Wortmarke (`assets/pgn/logo-mark-rot.svg`) · Projekt (Zeile 1) / Rubrik in Versalien (Zeile 2) · Stand. Gerade Seiten (`data-page` endet auf 0/2/4/6/8 oder `.page--left`): Blatt links außen; ungerade: rechts außen. Das volle Schriftfeld bleibt Umschlag und Kapitelauftakten vorbehalten.
- **Daumenregister** `.bs-register`: 10 × 21 mm am Außenrand, Lage nach Programmteil (`top: 52 mm + Index × 25 mm`, 2.1 oben … 2.6 unten), Programmfarbe, Nummer Montserrat 800 9 pt weiß. Gerade Seiten links gespiegelt. Immer `data-bleed aria-hidden="true"`.
- **Schlüsselplan** `.keyplan`: im Seitenkopf rechts; jedes Feld mit Farbkante, aktives Feld gefüllt. Steht auf allen Programmseiten (S. 8, 12, 13, 14, 16, 17) und darf auf Übersichten (Navigator) ohne `is-on` stehen.
- **Varianten:** `.page--u1` / `.page--u4` (Umschlag, ohne Polster, s. 7) · `.page--opener` (Kapitelauftakt im Planrahmen `.planframe--soft`, Fuß 4 mm über der Rahmenlinie) · `.page--accent` (Papierseite, nur Mittel-Doppelseite) · `.page--dark` (Anthrazit-Verlauf) · `.page--back` (v1-Rückseite, jetzt Rot) · `.page--cover` (v1-Titel, jetzt hell).
- **Planrahmen** `<div class="planframe" aria-hidden="true"></div>`: 8 mm vom Endformat, 0,35 mm Fast-Schwarz, Falzmarken bei 105/210 mm; `--soft` = Haarlinie Logo-Grau. Auf Rot weiß.
- **Master-Opener der Programmseiten** (S. 8, 12, 13, 14, 16, 17). Der Tag unter der Nummer ist im Kopf kompakt (Polster 1,2 mm, Farbfelder 2,4 mm), damit „Zuschuss + Darlehen“ in drei Spalten (41,25 mm) passt:

```html
<header class="program-head program-head--master">
  <div class="program-head__no">                               <!-- 3 Spalten außen: gerade Seite links, ungerade rechts -->
    <p class="chapter-no">2.1<small>Programmteil</small></p>   <!-- Montserrat 900 60 pt in --bs -->
    <p class="tags"><span class="tag"><i class="sw sw--grant"></i><i class="sw sw--loan"></i>Zuschuss + Darlehen</span></p>
  </div>
  <div class="program-head__main">                             <!-- 9 Spalten -->
    <p class="kicker">Neubau · Änderung · Ersterwerb</p>      <!-- ohne Vorstrich, ohne „Programmteil 2.1“ (steht außen) -->
    <h1 class="h1">Bis zu <em>80&nbsp;%</em> Förder&shy;quote</h1>
    <p class="deck">Aus Darlehen und Zuschuss – in <b>allen drei</b> Einkommensgruppen</p>
    <p class="program-head__subject">Gegenstandssatz (Work Sans 9,75 pt, ≤ 4 Zeilen) …</p>
  </div>
</header>
```

---

## 3 · Typografie-Bausteine

```html
<p class="kicker">Mit PGN</p>                                   <!-- Montserrat 700 9 pt Versalien +0,16 em, Rot, 7-mm-Strich -->
<p class="kicker kicker--ink">…</p>  <p class="kicker kicker--plain">…</p>   <!-- Tinte mit rotem Strich / ohne Strich -->
<h1 class="h1">So begleiten wir Ihr Förder&shy;projekt</h1>    <!-- 900 Versalien; rote 0,75-mm-Linie hängt links (.h1--norule ohne) -->
<h1 class="h1"><span class="light">Mietwohnungen in</span>Mehrfamilienhäusern</h1>  <!-- zweite Stimme 300 -->
<h1 class="h1">Bis zu <em>80&nbsp;%</em> Förderquote</h1>       <!-- em = 800 kursiv Rot (Signaturwort) -->
<p class="deck">Ein Ansprechpartner für <b>alles</b></p>        <!-- 300 Versalien; .deck--s = ganzer Satz in Work Sans 10,5 pt -->
<p class="lead">Den Antrag stellen Sie bei …</p>               <!-- Work Sans 11 pt, max. 132 mm; .lead--s 10,25 pt -->
<p class="claim">Planen. Fördern. <em>Bauen.</em></p>           <!-- Plakatzeile 22 pt; --s 13 pt, --l 31 pt, --rule mit roter Linie -->
<h2 class="h2">Zuschläge und Sonderformen</h2>  <h3 class="h3">Wann gilt ein Vorhaben als begonnen?</h3>
<p class="label">Versal-Label</p>  <p class="label label--accent">Rotes Label (9 pt)</p>
<div class="prose"><p class="dropcap">Fließtext …</p></div>     <!-- Initiale Montserrat 900 Rot über drei Zeilen; nur einmal (Editorial) -->
<a class="pageref" href="#seite-09">→&nbsp;S.&nbsp;9</a>        <!-- Seitenverweis-Chip: Hauch + Dunkelrot, 4,35 mm hoch -->
<b class="runin">Kombinierbar mit</b> KfW 298 …                 <!-- Run-in-Label: 800 9 pt Versalien +0,05 em, 2 mm Abstand (Bänder, Zeilenlisten, Stationen) -->
<b class="bs-no bs-23">2.3</b>                                  <!-- Programmnummer im Fließtext: 800, 1em, Programmfarbe -->
<span class="ph">[PGN-Rechnung: … % der Miete]</span>            <!-- Platzhalter (s. 6.16) -->
<div class="kicker-row"><p class="kicker kicker--plain">…</p><p class="stampline stampline--inline">…</p></div>   <!-- Kickerzeile 7 mm mit Stempel -->
<p class="lead lead--cols-2">…</p>                              <!-- langer Vorspann zweispaltig (dichte Seiten) -->
```

Titelblock mit Vorspann rechts: `.title-block.title-block--split` (7 + 5 Spalten) bzw. `--split-6`. Regeln: genau ein `.h1` je Seite; Kicker ≤ 6 Wörter; Deck ≤ 1 Zeile (≤ 2 auf Programmseiten); Lead ≤ 45 Wörter / 4 Zeilen; Plakatzeile ≤ 3 Wörter, nur auf Kapitelöffnern, PGN-Seiten und dem Umschlag.

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
| `chart` | `figure.chart` + Inline-SVG | Maßketten-Balken (Fördermix), Säulen, Heatmap, Zeitstrahl, Spiegel, Ablauf, Ring |
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

Varianten seit der CSS-Integration: `.key-figures--n` (Kachelzeile in einer Teilspalte, `style="--n: 7"`, Spannen je Kachel), `.kf--band--compact` (drei Werte neben einer Erklärung: Werte ohne Mindestbreite, 3 mm Polster). Regeln: Kachelkopf 0,3-mm-Linie; Zahl Montserrat 800 28 pt (Tabellenziffern); Einheit halb so groß in Rot; `kf__pre` rot 9 pt. Höchstens eine Hero-Kachel je Seite. Zahlen > 6 Zeichen (4.800/5.000, 90.000) nur in 2er-/3er-Raster oder `kf--s`. In der Kopfzeile darf ein Programm-Badge stehen (`.bs-badge`, DOM vor `kf__pre`, per `order` rechts).

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
  <tbody><tr><th scope="row">2</th><td class="is-hang"><span class="table__op">+</span> Grundstück</td><td class="num">700.000</td></tr>
         <tr class="is-sum">…</tr>                               <!-- Summenstrich 0,3 mm, Text 600 -->
         <tr class="is-result on-red">…</tr></tbody>             <!-- Ergebniszeile Vollton PGN-Rot (kein Verlauf auf tr: setzt je Zelle neu an) -->
</table>
```

Kopf: Montserrat 700 8,5 pt Versalien, 0,3-mm-Linie Fast-Schwarz; Zeilen Haarlinien; Abschluss 0,3 mm. **Massendaten-Stufe:** `.num` = Montserrat 600 9 pt, Tabellenziffern, rechtsbündig (Einkommensgrenzen, Kalkulation). **Kernwerte** `.table--figures`: höchstens 6–8 Werte je Seite; mehr Werte (Höchstmieten S. 7, 19 Werte) in der mittleren Stufe `.table--figures-m` (Montserrat 700 13 pt). **Term Sheet** `.table--terms`: Positionsspalte genau 3 Spalten (46-mm-Achse), Text 9 pt in `--text`, Werte fett in Tinte. **Vergleich** `.table--compare`: neue Spalte in Tinte, nicht fett – hervorgehoben werden nur Kennwerte (`.table--compare--strong` = ganze Spalte 600). Gruppenköpfe A/B/C als Achskreise. Weitere Zellklassen wie v1 (`.unit`, `.is-hl`, `.is-total`, `.is-key`, `.is-group-end`, `.bs-row`, `.table__arrow`). Höchstens 8 Zeilen × 5 Spalten.

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
| `--achtung` | Rot-Hauch, 0,5-mm-Rotlinie, Label rot 9 pt | nur Vorhabenbeginn (S. 19, Kurzverweis S. 4/5) |
| `--achtung.--inline.--ref` | ohne Fläche, Stopp-Icon, Titel 800 Versalien, 0,25-mm-Rotlinie unten, einzeilig | Kurzverweis auf den Achtung-Kasten (S. 5) – „kein eigener Kasten“ |
| `--frist` | Papier, 0,9-mm-Dunkelrotlinie, Datum Montserrat 900 21 pt | nur Frist 31.12.2026 (S. 14/15) |
| `--tipp` | Papier, Anthrazitlinie | Praxisrat |
| `--calc` | Weiß mit 5-mm-Planraster, Rechner-Icon rot | höchstens drei Kalkulationsnotizen im Heft |
| `.plan-legend` | gebündelte Hinweise: Symbol rot, Titel 800 Versalien, 2–3 Zeilen | statt mehrerer Kästen – die Hinweis-Diät-Form |
| `.gate` | Dunkelrotband, weiß, Titel 800 Versalien | „±0 Bewilligung“ im Ablauf, max. 1 je Seite |

### 6.4 Zitat

```html
<blockquote class="quote"><div class="quote__text"><p>Kostensicherheit ist kein Schlagwort, sondern ein wichtiges Versprechen.</p></div>
  <p class="quote__by"><span class="quote__name">PGN · Über uns</span><span class="quote__src">pgn-architekten.de</span></p></blockquote>
```
Rote 0,75-mm-Linie links statt Zier-Anführungszeichen; „ und “ setzt CSS (nicht tippen). Montserrat 500 kursiv 12,5 pt (`--l` 17 pt). Nur wörtliche Zitate mit Quelle; höchstens zwei im Heft (Redaktionsregeln).

### 6.5 Ablauf (`steps`)

```html
<ol class="steps steps--kote">                                <!-- Höhenkoten: −2 Vorgespräch, −1 Antrag, ±0 Bewilligung, +1 Bau -->
  <li class="step"><span class="step__no">−1</span><div><p class="step__title">Antrag</p><p class="step__text">…</p></div></li>
  <li class="step is-gate"><span class="step__no">±0</span><div><p class="step__title">Bewilligung</p><p class="step__text">Erst jetzt Verträge schließen und bauen.</p></div></li>
</ol>
```
Weitere Varianten wie v1: `.steps--lanes` (Sie · Förderstelle · NBank, Marker voll/hohl), `.steps--h` (waagerecht, roter Winkel zwischen den Schritten), `.ratebar` (Auszahlungsraten). Schrittnummern sonst Montserrat 900 20 pt Rot.

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
- Reihenfolge **Zuschuss ab der Grundlinie** (rot) · Darlehen (#202020) · Eigenmittel (Schraffur `pattern` mit `c-equity`/`c-equity-line`, Rahmen `c-equity-frame`); 0,7-mm-Fuge (`sep-line`).
- Über jedem Balken eine **Maßkette in Anthrazit** (`dim-line` 0,22, `dim-tick` 0,45 als 45°-Strich, Hilfslinien 0,12) mit den Werten (Montserrat 700, `t-val-ink`, Zuschusswert `t-acc`).
- **80-%-Achse** rot Strichpunkt (`cap-line`, 0,25 mm) mit rotem Achskreis „80“ und Label „Förderung bis zu 80 % – in jeder Gruppe“; Zuschläge als rote gestrichelte Kappe 80 → 85 → 90.
- **Maßstabsleiste als x-Achse** (`sb-b`/`sb-w`, 1,3 mm hoch, Labels 0–100 `t-ax`).
- Namen im Balken nur in der ersten Zeile („Zuschuss“, „Darlehen“, `t-val t-s` weiß).

**Kopf und Plotfläche:** `.chart__head--stamp` (Zeile 1 Titel + `.stamp`, Zeile 2 Untertitel links, Legende rechts; S. 13), `.chart__plot` (Stempel absolut in der freien Fläche über niedrigen Säulen, spart eine Kopfzeile; S. 16), `.chart__unit` / `--block` (Einheit im Titel in Work Sans 9 pt gemischt: „Höchstmiete nettokalt, € je m² und Monat …“; S. 7), `.legend--wrap` (Legende in schmaler 3-Spalten-Marginalie), `.sw--axis` (80-%-Achse als Legendeneintrag). `.chart__svg` steht im Raster oben (`align-self: start`) und wird nicht auf die Höhe der Nachbarspalte gestreckt.

**SVG-Konventionen:** 1 SVG-Einheit = 1 mm (`viewBox`-Breite = `width` in mm). Beschriftung Work Sans (`text` 3px = 8,5 pt, `t-m` 9,2 pt, `t-l` 12 pt), Werte Montserrat (`t-val`, `t-val-ink`, `t-num` 18 pt, `t-num-l` 25,5 pt, `t-cat` 7px, `axb-t` 5px – alle mit Tabellenziffern). `t-acc` = Rot 700. `t-unit` = Einheit hinter einem Wert (Work Sans 500 8,5 pt, grau – auch hinter roten Werten). Einkommensgruppen als Achskreis: `c-grp-a/-b/-c` (seq-6/-4/-2) + `t-grp` (`--ink` auf C). `axb-c--acc` = Achskreis der 80-/90-%-Achse (rot, 0,35). `dash--fine` (0,9/0,7) für Wartezeiten, `tl-axis--strong` (0,45) für dominante Zeitleisten, `tl-draft` (gestrichelter Rahmen auf Papier) für Geplantes. Kein `stroke` auf Text. Zahl–Einheit im SVG mit U+202F (aus der Symbolteilmenge).

**Diagramm-Regeln:** (1) Farben je Reihe fest (1.3). (2) Direkt beschriften; Legende im Kopf nur ergänzend. (3) Höchstwerte im Kopf („Höchstsätze“, „bis zu“). (4) Proportionen exakt, Balken ab 0, keine 3D-Effekte. (5) Zahlenformat deutsch. (6) Modellrechnungen tragen den Stempel `.stamp` „Modellrechnung“ (einmal je Rechnung). (7) Nie Größen unterschiedlicher Einheit an einer gemeinsamen Grundlinie – getrennte, gleich ausgerichtete Diagramme. (8) Rot im Diagramm nur für Zuschuss, 80-%-Achse und Zuschlag. (9) Programmfarben nur mit Nummer. (10) Diagrammtitel ≤ 6 Wörter (Versalien!), Untertitel ≤ 12, Notiz ≤ 30 Wörter / 1–2 Zeilen.

### 6.7 FAQ, Checkliste, Kontakt, Aufzählung

Markup wie v1 (`dl.faq`, `ul.checklist`, `address.contact`, `ul.bullets`); `.checklist--compact` + `.mark--s` (3,4-mm-Marken, Haken/Kreuz neu zentriert, ohne Außenlinien; Spielregeln S. 7); Badge im Ankreuzpunkt ohne eigenen Außenabstand (Klammer „(Vordruck 3076)“ ohne Luft); `.bullets > li.is-stop` (Ausschluss als Listenpunkt: Stopp-Icon `icon--stopp icon--signal` statt Quadrat, Fettung in Signalrot – Hinweis-Diät statt Achtung-Kasten; S. 16); `.contact__label--tight` (+0,04 em in schmalen Kontaktfeldern); neu: FAQ-Nummern Montserrat 900 rot, Frage Montserrat 700 10 pt; Aufzählungsmarker **eckig** (1,4 mm Rot); `.bullets--num` mit „01“; `.contact__name` Montserrat 800 Versalien, `.contact__tel` Montserrat 800 17 pt (`--l` 22, `--xl` 28 pt); `.contact--dark` Anthrazitverlauf.

### 6.8 Badges, Chips, Schlüsselplan, Programmnummer

```html
<span class="badge badge--form"><span class="badge__pre">Vordruck&nbsp;</span>1011</span>  <span class="badge badge--frist">Soll ≤ 3 Monate</span>
<span class="tag"><i class="sw sw--grant"></i>Zuschuss</span>   <span class="bs-badge bs-24"><b class="bs-badge__no">2.4</b>Inseln</span>
<span class="grp-chip grp-chip--l grp-chip--a">A</span>   <!-- Einkommensgruppe: Kreis, Stufe 6/4/2 -->
<p class="chapter-no">2.4<small>Programmteil</small></p>       <!-- Programmnummer groß in --bs -->
<span class="bs-matrix" role="img" aria-label="gilt für 2.1 bis 2.4"><i class="bs-21">2.1</i>…<i class="bs-25 is-off">2.5</i>…</span>   <!-- Programmteil-Matrix: 6 Felder, nicht zutreffend = Geisterziffer -->
```

### 6.9 Modellrechnung, Rechenblatt, Stempel

`.stamp` (doppelte Kontur, 0,25 mm + Haarlinie, Montserrat 800 9 pt Rot), `.stamp--s` (Kurzstempel für die zweite Nennung derselben Modellrechnung, z. B. im Kicker S. 11: einfache Kontur, Schrift des Kickers – Redaktionsregeln: nur ein Vollstempel je Rechnung), `.stampline` (`--inline`: einzeilig neben dem Kicker in `.kicker-row`), `.formula--stack` (Grenze als eigene graue Zeile unter dem Term, 400), `.model` (Papier, `model__value` Montserrat 800 16 pt), `.formula` (**5-mm-Planraster**, Operatoren `+ =` Montserrat 900 Rot, Ergebniszeile 0,3 mm). Markup wie v1.

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
  <div><p class="kicker kicker--plain">Mit NBank-Förderung</p>
    <p class="reference__units">19 <small>Wohnungen<br>barrierefrei, mit Aufzug</small></p>
    <h2 class="reference__name" id="ref-h">Brauerstraße, Rotenburg (Wümme)</h2>
    <dl class="reference__facts"><dt>Vorhaben</dt><dd>Neubau eines Mehrfamilienhauses</dd><dt>Status</dt><dd>entsteht aktuell; wird durch die Förderung der NBank unterstützt</dd></dl></div>
</article>
<div class="references" style="--n:3">
  <article class="reference"><figure class="photo" role="group" style="--photo-h:30mm"><img class="photo__img" src="assets/pgn/img/porstweg-duplex.jpg" alt="…"></figure>
    <p class="reference__units">29 <small>Wohnungen</small></p><h3 class="reference__name u-mt-2">Porstweg</h3><p class="reference__place">Rotenburg (Wümme) · für die …</p></article>
</div>
```
`.reference__units--text`: Einheit gemischt in Work Sans neben der Zahl (schmale 3-Spalten-Referenzen, S. 22). **Fakten nur aus `recherche/pgn-facts.md`**, Status wörtlich („entsteht aktuell“, „wird durch die Förderung der NBank unterstützt“ – nie „umgesetzt“; Schreibweise „NBank“, nicht „N-Bank“, daher Paraphrase). Bauherr nur, wo er im Text der Projektseite steht.

### 6.14 PGN-Werte, Logo

```html
<ul class="values" aria-label="Für Sie denken wir an">
  <li class="values__item"><img src="assets/pgn/verantwortung-white.svg" alt=""><span class="values__word">Verantwortung.</span></li> …
</ul>
<img class="logo logo--m" src="assets/pgn/logo-rot.svg" alt="PGN – Architekten, Stadtplaner, Ingenieure">
```
QR-Code inline mit `.qr-bg` / `.qr-mod` (Tokens `--white` / `--ink`; S. 18, U4). Logo: `logo-rot.svg` auf Weiß/Papier (Standard, ≥ 34 mm breit, Schutzzone = Höhe des „P“); `logo-negativ.svg` (weiß mit Unterzeile, abgeleitet) bzw. `logo-weiss.svg` (nur Wortmarke) auf Rot/Anthrazit – Freigabe bei PGN offen, auf dem Umschlag deshalb Logo rot auf weißem Schriftfeld; `logo-mark-rot.svg` nur als Wortmarke im Plankopf (11,5 mm); `logo-mono.svg` (currentColor) für Einfarbdruck. Logo-SVGs sind reine Pfade (als `<img>` vektoriell im PDF). Kein Logo von NBank oder Land.

### 6.15 Inhaltsverzeichnis als Linienplan (`.lp`, U2)

```html
<nav class="lp" aria-label="Inhalt">
  <div class="lp__line"><p class="lp__name">Überblick</p>
    <ol><li class="lp__stop"><a href="#seite-03"><span class="lp__pg"><span class="u-sr">Seite </span>3</span><span class="lp__mk" aria-hidden="true"></span><span class="lp__t">Kennzahlen</span></a></li>…</ol></div>
  <div class="lp__line"><p class="lp__name">Finanzierung</p> … <span class="lp__mk lp__mk--bs bs-21">2.1</span> …</div>   <!-- Programmteil als Chip auf der Linie -->
  <div class="lp__line lp__line--em">…</div>   <!-- Mittel-Doppelseite: Papier, kräftige Linie -->   <div class="lp__line lp__line--pgn">…</div>   <!-- PGN-Teil rot -->
</nav>
```
Je Kapitel (= Kolumnentitel) eine Linie als Pseudo-Element-Strich, Haltestellen als Quadrate, Stichtag `.lp__mk--signal` + `.lp__t--signal`. Steuergrößen `--lp-pg` (Seitenzahl 6,2 mm), `--lp-mk` (Marke 7,4 mm), `--lp-gap`, `--lp-w` (Linie 0,7 mm), `--lp-c`. Die Listenform `.toc__item` bleibt für Übersichten ohne Kapitel.

### 6.16 Platzhalter für PGN-Zulieferungen (`.ph`)

```html
<span class="ph">[PGN-Rechnung: … € je Wohnung p. a.]</span>   <td class="num"><span class="ph ph--cell">[PGN-Rechnung]</span></td>
```
Heftweit eine Form für „[PGN-Rechnung: …]“, „[PGN: …]“, „[Platzhalter]“: gestrichelte Haarlinie in `--fg-3`, Fläche `--surface-2`, Text grau, nie umbrochen – Plankonvention „gestrichelt = noch offen“, neutral (S. 11 trägt 22 Platzhalter; rot wäre dort eine Fläche aus Rosa). `--cell`: Wertzelle, zentriert, 8,5 pt. Auf Rot (Ergebniszeile) zusätzlich `.on-light`. Beim Einsetzen der Werte den Span samt Klasse ersetzen; Suche nach `class="ph` findet alle offenen Stellen (S. 11, U3).

---

## 7 · Umschlag (U1, U4)

Aufgeklappt ist der Umschlag **ein Planblatt**: Planrahmen 8 mm, Schriftfelder auf U1 und U4 mit derselben Oberkante (`--horizon` 196 mm), Blattnummern „U1“/„U4“.

**Gebaut (Stand 22.10.2026): zweizeiliges Schriftfeld** auf beiden Seiten – `.cover__stamp.cover__stamp--2row` (U1) und `.back__stamp.back__stamp--2row` (U4): Zeile 1 Titel bzw. Einladung + Kontakt | 56-mm-Feld (Kennzahl 80 % bzw. QR), Zeile 2 Absenderleiste 18 mm (Oberkante 271 mm) mit Spalten Logo 64 mm | Herausgeber bzw. Projekt | Stand 34 mm | Blatt 22 mm. Kennzahl U1 54 pt (sekundär zur Titelzeile), Bezug darunter `.cover__kpi-note` (600 9 pt). Im weißen Schriftfeld von U4 gelten die hellen Tokens (`--rule` #CFCCC8 statt Rosa aus dem Rot-Scope). Die dreizeilige Fassung unten bleibt für den Specimen definiert.

**U1 (`.page--u1`)**: Kopfleiste (`.cover__head`: Kicker „Planungsgrundlagen für den geförderten Mietwohnungsbau“ + Zelle Ausgabe) · Axonometrie `sig-axo-brauerstrasse.svg` **inline** in `.cover__drawing` (190 × 165 mm) · `.cover__caption` rechts über dem Schriftfeld · `.cover__stamp` mit drei Zeilen: `.cover__row--top` (Für · Planinhalt · Stand · Blatt U1) / `.cover__row--main` (Kicker, `.cover__title` mit rotem Signaturwort, `.cover__deck` | `.cover__kpi` auf Rotverlauf: „Bis zu“, 80 % in Montserrat 900 64 pt weiß, Label, Maßkette 80/20) / `.cover__row--foot` (Logo rot · Herausgeber · Grundlage). Textmengen: Titel ≤ 5 Wörter / 2–3 Zeilen bei 30 pt; Deck ≤ 25 Wörter; Schriftfeld-Werte ≤ 8 Wörter (8,5 pt Montserrat 600).

**U4 (`.page--u4`)**: `.cover__art` (`data-bleed`, Rotverlauf) mit `sig-grundriss.svg` **inline** (ganzseitig 210 × 297, weiße Linien, Poché-Wände) · `.planframe` · `.back__claim` (Kicker + `.claim` 34 pt: „Aus Ihrer guten Idee –“ als `.light`, „machen wir den *besten Plan.*“) · `.back__stamp` weiß: Logo + Beschreibung | Kontakt (`address.back__contact`, Links `.u-url`) | QR (`qr-pgn-architekten.svg` inline, Ziel www.pgn-architekten.de, Ruhezone 4 Module) / Förder-Check-Einladung (`.back__invite-cell`, ein Satz) / Projekt + Blatt U4.

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

Druckregel in den Signaturen (`scripts/pgn-signatures.cjs`, `FS_RED` = 3,2 px = 9,1 pt): rote Maßkettenschrift der Axonometrie und die weiße Planbeschriftung der Rotpause ≥ 9 pt; rote Linien der Axonometrie (Dachdeckung, Figuren, Maßhilfslinien) 0,25 mm. Die Klinkerlinien (`.sig-brick`, 0,13 mm in #D58E9D) sind Textur, kein Rot im Sinn der Druckregel – bei Andruck prüfen. Nach `node scripts/pgn-signatures.cjs` die Inline-Kopien auf U1/U4 nachziehen (nur der `<style>`-Block ändert sich).

Signaturen mit Text **immer inline** einbetten (Inhalt der Datei ohne Kommentar in das HTML kopieren): Als `<img>` fehlen die Webfonts und `render.cjs` kann den Text keiner statischen Instanz zuordnen. Die Dateien tragen ihr eigenes, auf die id beschränktes `<style>` mit Token-Rückfallwerten. Neu erzeugen: `node scripts/pgn-signatures.cjs`, `python3 scripts/pgn-images.py`. v1-Assets (`assets/*.svg`: Piktogramme, UI-Icons, Haus-Diagramm) bleiben gültig und übernehmen die PGN-Farben über die Klassen `pict-*`, `icon`, `ill-*`.

---

## 9 · Bildeinsatz

- Website-Bilder sind höchstens 1800 × 740 px: **Duplex bis 120 mm Breite** (≥ 380 ppi), Banner bis 180 mm (≥ 254 ppi) nur als Punktraster oder rot-Duplex auf Kapitelauftakten. Nie randabfallend, nie farbig-original (Klinker-Orange und blauer Himmel kämpfen mit PGN-Rot).
- Großformatig nur **Vektor-Punktraster** (kein vorgerastertes Pixelbild → kein Moiré, einfärbbar).
- Jedes Foto mit Bildunterschrift `.photo__caption` („Ansicht“, „Visualisierung …“), Referenzbilder mit `.photo__tag` – bei mehreren Bildern auf einer Seite stattdessen die neutrale Bildecke `.photo__credit` („Visualisierung“, weiß, 8,5 pt grau; S. 22), sonst wird es zu viel Rot. Beschnittmarken `photo--marks` nur an einem Bild je Seite.
- Bildrechte und Credits vor dem Druck bei PGN erfragen; Hi-Res-Originale (`…-5120.jpg`) anfordern.

---

## 10 · Textmengen je Layout-Typ (gemessen am Specimen)

Satzspiegel 180 × 259 mm (14 → 273 mm). Gemessen: Programmkopf (Nummer + Kicker + H1 + Deck + Gegenstand 4 Zeilen) 51 mm · Titelblock split 34 mm · Fördermix-Diagramm mit Kopf und Notiz 89 mm · Bauzeitenplan 7 Zeilen 133 mm · Rechenblatt 3 Zeilen 33 mm · Hero-Kachel 46 mm · Kachelreihe 42 mm · Höchstmieten 2 Zeilen 29 mm · Callout-Reihe (3 × 4 Sp.) 42 mm · Planlegende 2 Einträge 46 mm · Höhenkoten-Ablauf 4 Schritte 78 mm · Referenzreihe (3) 60 mm · Hauptreferenz 65 mm · Punktraster-Banner 74 mm · Werte-Reihe 27 mm. Fließtext 9,75 pt: 5,1 mm Zeilenhöhe, ≈ 56 Zeichen in `l-span-6`; Modultext 9 pt: 4,4 mm, ≈ 60 Zeichen in `l-span-6`.

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
| imprint (U3) | ≤ 200 | zentraler Rechtshinweis, Quellen, Impressum |
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

- `render.cjs` ohne `OVERFLOW`, `LASTLINE`, `SATZSPIEGEL`, `PDFUA`, `FEHLER`, `FONT`; `SATZSPIEGEL` meldet Inhalt unter der Satzspiegel-Unterkante (273 mm bzw. Polster der Seite) und Inhalt, der aus einem Block fester Höhe ragt; „Statische Schriften: N/N“; `pdffonts` nur CID TrueType (Montserrat-…, WorkSans-…, PGNSymbols-…).
- PNG ansehen: H1 ohne Überstand, nichts klebt an Linien (≥ 2 mm), Module enden ≥ 5 mm über dem Plankopf.
- Rot zählen: je Seite höchstens Kicker, Titellinie, Signaturwort, Zuschuss und ein Akzentmodul.
- Druckregeln (0.4), WCAG (1.1), Mindestschrift 8,5 pt auch in SVG.
- Fakten: PGN nur aus `recherche/pgn-facts.md`, Förderinhalte aus `content/pages/*.json` – Wortlaut je Textstelle gegen den DOM-Text prüfen (Klammern und Satzzeichen um Seitenverweise inklusive).
- Gemeinsame Horizonte einer Doppelseite nach Änderungen an globalen Komponenten nachmessen (ein kleinerer Chip verschiebt alles darunter um 0,4–0,6 mm).
- Bekannt, nicht behoben: Versal-Labels mit Laufweite (Kicker 0,16 em, `.label`, `.bullets__title`, SVG `.t-caps`) liest `pdftotext` als gesperrte Einzelbuchstaben („N AVI G ATO R“); Satz und Struktur sind korrekt, betroffen sind nur Copy & Paste und Volltextsuche einzelner Viewer.

## 13 · Integration der Seiten-CSS (Stand 22.10.2026)

Aus den Meldungen der Seitenbauer übernommen (global, seitenlokale Kopien entfernt): Seitenverweis-Chip kompakt und auf Anthrazit lesbar (S. 3, 4, 7, 9, 14, 15, 18–21) · Platzhalter `.ph` (S. 11, U3) · Rechenblatt-Tabelle `.table--sheet`, `.is-sum`, `.table__op`, Ergebniszeile `.is-result` (S. 10, 11) · Kickerzeile `.kicker-row`, `.stampline--inline`, `.stamp--s` (S. 10, 11) · Run-in-Label `.runin` (S. 5, 8, 12, 20) · Programmnummer im Text `.bs-no` (S. 18, 21) · QR-Farben `.qr-bg/.qr-mod` (S. 18, U4) · Schriftfeld zweizeilig `.cover__stamp--2row` / `.back__stamp--2row`, `.cover__kpi-note` (U1, U4) · Linienplan `.lp` (U2) · Programmteil-Matrix `.bs-matrix` (S. 4) · `.callout--ref` (S. 5) · SVG `c-grp-*`/`t-grp` (S. 6) · `.chart__unit`, `.table--figures-m`, `.checklist--compact`, `.mark--s` (S. 7) · `.formula--stack`, `.legend--wrap`, `.chart__svg` oben im Raster, kompakter Programm-Tag (S. 8) · `.table--terms` = Term Sheet (S. 9) · SVG `.t-unit` (S. 10) · `.sw--axis` (S. 11) · `.chart__head--stamp`, `.kf--band--compact`, `.axb-c--acc` (S. 8, 13) · Heatmap `c-bs-step-*` (S. 14) · `.tl-axis--strong`, `.tl-draft` (S. 15) · `.key-figures--n`, `.chart__plot`, `.bullets > li.is-stop`, `.dash--fine` (S. 16, 17) · `.lead--cols-2` (S. 18) · `--station-mk` (S. 19, 20) · `.contact__label--tight` (S. 21) · `.photo__credit`, `.reference__units--text` (S. 22). Dazu Assembler (SVG-Überspringen, Bereiche, Fugen), Signaturen (Druckregel), `render.cjs` (SATZSPIEGEL).

**Bewusst seitenlokal (Einzelfall, Geometrie an die Seite gebunden):** Kennzahlraster mit Subgrid und Reiter (S. 3), Navigator-Baum und Ziel-Kacheln (S. 5), Zulassungsband (S. 6), Frist-Kasten als Schriftfeld am Zeitleisten-Pin (S. 15), Schrittfolge mit Akteur (S. 17), Vorrang-Leiter (S. 18), Swimlane und geteilter Achtung-Kasten (S. 19), HOAI-Planleiste mit Legende (S. 20), Werte gestapelt (S. 22), Logo-Band als Fuß von U3. Kandidaten für eine globale Komponente, sobald ein zweiter Einsatz entsteht. **Nicht übernommen:** `text-wrap: wrap` statt `balance` für alle h3 (nur S. 8 betroffen, lokal gelöst); Kursiv-Instanz Work Sans 500 (nicht gebraucht); Laufweite der Versal-Labels (s. 12).
- Druck-PDF: randabfallende Flächen (Register, U4-Verlauf) im Beschnitt prüfen (`--print-pdf`).
