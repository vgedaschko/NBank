# Designsystem „Editorial Premium“ – Komponentenkatalog

Broschüre **Mietwohnraumförderung Niedersachsen 2026** (RL Mietwohnraum 2026), DIN A4 hoch, 20 Seiten.
Basis ist der Siegerentwurf A (Petrol · Terrakotta · Sand, Fraunces + Inter). Übernommen aus den anderen Entwürfen:
Modellrechnung, Schriftfeld, Warnband im Ablauf, Baustein-Piktogramme und Förderart-Chips, Höchstwert-Hinweis (aus B);
Zitat-Baustein, zweispaltiger Warnkasten „Gilt als Beginn / Gilt nicht als Beginn“, hervorgehobene Spalte A, Zielgruppen-Zeile,
Stand- und Haftungszeile, Fördertatbestände als Icon-Reihe (aus C).

| Datei | Inhalt |
|---|---|
| `src/styles.css` | Tokens, Seitenrahmen, Typografie, Layout-Utilities, alle Komponenten |
| `src/assets/*.svg` | Titelillustration, Haus-Diagramm, Piktogramme, UI-Icons, Dekor (inline einbetten) |
| `src/.preview-specimen.html` | Specimen: 4 Seiten mit allen Block-Komponenten und allen 5 Diagrammtypen (funktionierende Beispiele zum Kopieren) |
| `src/.preview-varianten.html` | Titel (`.page--cover`), dunkle Seite, Zusatzkomponenten, Asset-Bogen, Rückseite (`.page--back`) |

Vorschau rendern (aus `broschuere/`):

```bash
NODE_PATH=/opt/node22/lib/node_modules node scripts/render.cjs --in src/.preview-specimen.html --pdf dist/qa/specimen.pdf --png dist/qa/specimen --dpi 60
```

---

## 0 · Grundregeln (verbindlich)

1. **Farben nur über Tokens** (`var(--…)`). Komponenten nutzen ausschließlich die *semantischen* Tokens (`--fg`, `--surface-2`, `--accent-text` …), nie Palettenwerte. Dann funktionieren sie automatisch auf hellen, sandfarbenen und dunklen Flächen.
2. **Schriften nur aus `fonts/fonts.css`**: Fraunces Variable (Display, Zahlen) und Inter Variable (Text, Labels, Tabellen, Diagramme). Keine weiteren Familien. **Pfeile und Symbole `→ ↔ ≤ ≥ ≈ ✓ ✗` immer als echtes Zeichen** tippen: Sie kommen aus einer eingebetteten Inter-Teilmenge (`inter-arrows-symbols`, für Inter *und* Fraunces, aufrecht und kursiv registriert). Keine Inline-SVG-Pfeile, keine Ersatz-Spans. Andere Symbole (⚠ ↳ ★ …) gibt es nicht → `.mark`, `.icon`.
   **Im PDF statische Instanzen:** `scripts/render.cjs` ersetzt beim Rendern jede genutzte Kombination aus Familie, Stil, `wght`, `opsz` (und bei Fraunces `SOFT`/`WONK`) durch eine statische Instanz aus `src/fonts/static/` (Familien „FI …“, Liste `instances.json`). Fehlt eine Instanz, meldet der Lauf `FONT: … fehlen` und schreibt `needed.json`; dann `python3 scripts/fonts-static.py` (fontTools + brotli) ausführen und neu rendern. Ergebnis: CID-TrueType (Identity-H) statt Type 3. Kein `paint-order`/`stroke` auf Text (Halo) – Skia setzt gestrichenen Text wieder als Type 3.
   **Eindeutige Fontnamen:** `fonts-static.py` benennt jede Instanz und Unicode-Teilmenge eigens (nameID 1/2/4/6, z. B. PostScript `Inter-in-w650-o14-latin`, `Fraunces-fn-w400-o144-s40-k0-latin`, `Inter-arrows-w400-o14`; nameID 16/17/25 entfallen) – sonst hießen alle Schnitte „Inter-Regular“ bzw. „Fraunces-9ptBlack“. `render.cjs` vergibt zusätzlich je Fontprogramm ein eigenes Subset-Präfix (6 Buchstaben aus dem MD5 des FontFile2; Chrome nummeriert sonst je Seite neu „AAAAAA+ …“). Prüfung: Jeder BaseFont-Name entspricht genau einer Fontdatei (`pdffonts` + MD5 über FontFile2). Nach Änderungen an der Namensgebung `src/fonts/static/*.woff2` löschen, dann `python3 scripts/fonts-static.py` (Instanzen werden sonst übersprungen).
3. **Mindestschrift 8,5 pt** – auch in SVG (dort `3px` bei 1 Einheit = 1 mm). **8,5 pt (`--fs-micro`) nur für Fundstellen, Fußnoten, Bildunterschriften/Diagrammnotizen, Achsen- und Versal-Labels, Kurzmarken, Badges und Nachschlage-Register** (Gemeindeverzeichnis S. 7, Term Sheet S. 9). **Modultext 9 pt / 1,36** (`--fs-module`, `--lh-module`): Listen (`.bullets`, Checklisten), `.facts__text`, `.callout__body` (auch `--s`, `--inline`, `--calc`), Kachel- und Kennzahltexte, Schritttexte, Tabellenzellen (`.table--compact`, `--matrix`). Auf sehr dichten Seiten darf der Durchschuss bis 1,27 sinken, die Größe nicht. Ziel: höchstens rund 420 Wörter je Innenseite – zuerst Dubletten streichen (Aussage mit Verweis „→ S. N“ auf die Seite, wo sie vollständig steht), nie Bedingungen. Fußnotenziffern (`.fn`) haben ebenfalls 8,5 pt und sind **immer Inter 650 aufrecht**. Sie stehen **nur im Fließtext, in Tabellenzellen und Bildunterschriften** – nie an `h1`–`h4`, `.kicker`, `.label` oder Diagrammtiteln (s. 6.13).
4. **Silbentrennung** setzt `scripts/assemble.cjs` (weiche Trennstriche). CSS: `hyphens: manual` für Fließtext, Blocksatz mit `.u-justify` möglich.
   - **Ausnahmeliste** `HYPH_EXCEPTIONS` in `assemble.cjs`: feste Trennfugen statt Automaten-Trennung (Überkompensations-prüfung, Hilfe-stellung, Bau-abnahme, Energiebedarfs-ausweis, Wohnungsmarkt-beobachtung, Vorhaben-beginn, Wohnraum-förder-stelle, Pflege-grad, Entwicklungs-konzept, Gemeinschafts-unterkünfte, Subventions-erheblich, Energie-effizienz, Bearbeitungs-entgelt, Finanzierungs-entscheidung, Antrags-eingang, Grundbuch-lasten-frei, Bedarfs-abschätzung, Bemessungs-grenze, Kosten-gruppe, Zuwendungs-fähig, Eigentums-wohnung, Städte-baulich …; ungetrennt: „vorzeitigem/-en/-er“, Einkommen, zulassen, Maßnahme(n), Bindungsende, Förderberatung). Ein Strich markiert die einzige erlaubte Trennstelle; Flexionsendungen (-s, -es, -en, -n, -e) werden mitgefunden, andere Formen (-er, -em) brauchen einen eigenen Schlüssel. Neue sinnentstellende Trennungen (mitten im Kompositionsglied: „Pfle-gegrad“, „Bemes-sungsgrenze“) dort ergänzen, nicht im Partial – und danach den Gesamtlauf prüfen: Eine Ausnahme verschiebt den Umbruch, auf vollen Seiten kann das eine Zeile kosten (OVERFLOW) oder an anderer Stelle eine neue schlechte Trennung erzeugen. „Mie-tenstufe“ und „Mietver-trag“ bleiben deshalb vorerst automatisch getrennt (S. 3/7/13/16 voll).
   - **Geschützte Leerzeichen** setzt `assemble.cjs` vor der Trennung automatisch (`NBSP_RULES`): Zahl + %/€/m²/Mio./Mrd./Euro, §/§§/Nr./S./Abs./DIN/max./mind./inkl./ca./rd. + Zahl, „Mio. €“, „p. a.“, „z. B.“, „u. a.“, „d. h.“, „i. d. R.“, Rechtszitate „§ 7 Abs. 3“, „§ 4 Satz 2“, „Abs. 3 Satz 1“, „RL Nr. 11.4“ und „je m²“. Im Partial dafür kein `&nbsp;` nötig (schadet aber nicht). Den harten Bindestrich in **„DVO-NWoFG“** schützt keine Regel: Zitate immer als `<span class="u-nowrap">§&nbsp;4 DVO-NWoFG</span>` setzen (auch in Fundstellen); Bereiche wie „I–III/IV–VII“ in schmalen Spalten ebenso.
   - **Vorspann** (`.lead`) ohne automatische Trennung (`lead` in `NOHY_CLASSES`, CSS `hyphens: manual; text-wrap: pretty`); wo nötig nur von Hand an Kompositionsfugen trennen (`Wohnraum&shy;förderstelle`).
   - **Kein Trennrest allein in der letzten Zeile** („zulas-|sen.“): `text-wrap: pretty` gilt für `p, li, dd, td, th`, greift aber nicht zuverlässig. `render.cjs` meldet verbliebene Fälle als **`LASTLINE`-Zeilen (= Fehler, wie OVERFLOW)**: letzte Zeile eines Blocks (nächster Nicht-Inline-Vorfahr; Blöcke aus nur einem Wort zählen nicht) besteht nur aus dem Rest eines weich getrennten Wortes. Abhilfe: Wort in `HYPH_EXCEPTIONS` ungetrennt, sonst das letzte Wort im Partial in `.u-nohyphens` (S. 8 „×&nbsp;Wohnfläche“) oder Satz umstellen.
   - `text-wrap: pretty` meidet in Chrome Trennstellen und braucht dafür gelegentlich eine Zeile **mehr** als der gierige Umbruch. Wird eine volle Seite dadurch zu lang, den einzelnen Block seitenlokal auf `text-wrap: wrap` setzen (S. 12 `.p12-eh40`).
   - `render.cjs` entfernt vor dem PDF alle **ungenutzten** weichen Trennstriche (Textlayer, Suche, Copy & Paste) und prüft den Umbruch dabei gegen; Absätze, deren Satz sich ändern würde, behalten ihre Trennstellen.
   Überschriften, Titel, Zahlen **und Versal-Labels** (`.kicker`, `.label`, `.callout__label`, `.term__label`, `.kf__pre`, `.bullets__title`, `.contact__label`, `.stamp`, `.stampline`, `.cover__rl`, `.caveat`, `thead th`, Zeilenköpfe in `.table--terms` …) trennen **nie** (`hyphens: none` ist voreingestellt). `assemble.cjs` setzt in diesen Elementen (und in `h1`–`h4`, `thead`, `.deck`, `.lead`, `.u-url`, `.u-nohyphens`) auch **keine** weichen Trennstriche – sonst stünden sie im PDF-Textlayer („EDI­TO­RIAL“). Die Klassenliste in `assemble.cjs` (`NOHY_CLASSES`) muss eine Teilmenge der `hyphens: none`-Selektoren bleiben. Passt ein einzelnes Wort nicht in die Spalte, `.u-hyphens` auf die Überschrift setzen; einzelne Wörter im Fließtext mit `.u-nohyphens` von der Trennung ausnehmen.
   E-Mail-Adressen, URLs und Telefonnummern immer als Link mit `.u-url` (keine Trennung, kein Umbruch): `<a class="u-url" href="https://www.nbank.de">nbank.de</a>`, `href="mailto:…"`, `href="tel:+49511300319333"`. `a` erbt Farbe und Schrift, die Optik ändert sich nicht; Chrome erzeugt Link-Annotationen (mit Tagging auch Link-Tags). Die Alternativbeschreibung je Annotation (`/Contents`, PDF/UA-1 7.18.5) setzt `render.cjs` aus dem Link: `aria-label` oder Text inkl. `.u-sr` (ohne `aria-hidden`); „→ S. 15“ → „Verweis auf Seite 15“, `tel:` → „Telefon …“, `mailto:` → „E-Mail an …“, Web → „Website …“. Links ohne Text (z. B. QR-Code) brauchen ein `aria-label`; Links nie in `role="img"` oder `aria-hidden` (Vorprüfung `PDFUA:`).
5. **Keine negativen Ränder an Grid-/Flex-Kindern.** Chromium berechnet sie im Druck anders als am Bildschirm – der Overflow-Check sieht es nicht, das PDF schon (gemessen: +7 mm pro Ablaufzeile). Polster gehört in die Zelle, nicht als Minus-Rand an den Nachbarn.
6. **Randabfallend** (Titelbild, Register-Reiter, Farbstreifen, Dekor) bekommt `data-bleed` – das Render-Skript nimmt diese Elemente vom Overflow-Check aus. Text bleibt ≥ 5 mm vom Endformat (`--safe`).
7. **Förderquoten immer mit „bis zu“**, Eigenmittel mit „mind.“/„mindestens“. Modellrechnungen tragen immer die **Stempelzeile** `.stampline` („Modellrechnung – fiktives Beispiel, keine Förderzusage“) als erste Zeile des Moduls (s. 6.12).
9. **Standard-Vorbehalt** (Höchstwerte · Überkompensationsprüfung · kein Rechtsanspruch · verfügbare Haushaltsmittel) steht **ausformuliert nur im Lesehinweis S. 2 und im Impressum S. 20**. Programmspezifische Fälle bleiben im Text (S. 12 Kombination, S. 16 „Kombinierbar mit“). Sonst genau eine Kurzmarke `.caveat` direkt unter dem Hauptdiagramm bzw. Kachelraster der Seite (s. 6.13). Keine Einschränkung entfällt.
10. **Fortschreibung der Bemessungsgrenze** ausformuliert nur im Hinweis-Kasten S. 8, als Termin im Zeitstrahl S. 15 und als Link „Immer aktuell“ S. 20; überall sonst „Fortschreibung → S. 8“.
11. **Kalkulationsnotiz höchstens einmal je Doppelseite**, immer als unterstes Modul der Außenspalte (gerade Seite links, ungerade rechts) in voller Spaltenbreite (s. 6.3). Wiederholte Aussagen werden durch einen Seitenverweis-Chip `.pageref` ersetzt.
12. **Querverweise** immer „→ S. N“ und als Link: `<a class="u-nowrap" href="#seite-NN">→&nbsp;S.&nbsp;NN</a>`; jede `section.page` trägt `id="seite-NN"`. Schreibweisen: „RL Nr. 5.4.4“ (nie „Nr.“ allein, nie „§ RL“), „Leistungsphase 6 HOAI“, „auch bei Wiedervermietung“, „in den Jahren 1–3“ (Achsen-/Spaltenlabels „Jahr 1–3“ dürfen bleiben), Datum „01.04./01.10.“ bzw. „jeweils zum 01.04. und 01.10.“, „Stand 08/2026“, Schrägstrich-Paare ohne Leerzeichen („4.800/5.000 €“), Bereiche mit Halbgeviert („6,50–9,00 €“), Zahlwörter im Fließtext („bis zwei Jahre nach Fertigstellung“, „ab drei Wohnungen“, „in drei Jahren“, „sieben Inselgemeinden“). Titel amtlich und in „…“: Arbeitshilfe „Kosten-Finanzierungsaufteilung“, Merkblatt „Vorzeitiger Vorhabenbeginn in der Wohnraumförderung“.
13. **Barrierefreiheit im PDF** (getaggt, s. 9): jedes `<figure>` ohne eigene Rolle bekommt `role="group"` (sonst /Figure ohne Alt), Diagramm-SVGs `role="img"` + vollständiges `aria-label`; `.page__foot`, `.bs-register` und `.bs-strip` tragen `aria-hidden="true"` (Artefakte); englische Begriffe im Fließtext mit `<span lang="en">` („Housing First“, „Term Sheet“).
   **Artefakte:** Chrome taggt nur Inhalte mit Strukturbezug; `render.cjs` (`markArtifacts()` in `finishPdf`) umschließt danach jeden Mal-Lauf außerhalb von Marked Content – Seitengrund, Flächen, Linien, aria-hidden-Text (Fußzeile, Register-Reiter, Farbleisten, Zier-Anführungszeichen, Deko-Pfeile) – mit `/Artifact BMC … EMC` (PDF/UA-1, Matterhorn 01-005). Folge: Was vorgelesen werden soll, darf nicht `aria-hidden` sein; Deko immer `aria-hidden`.
   **Kein bedeutungstragender Generated Content** (`::before { content: "…" }` fehlt im Tag-Baum): Fußnotenziffern (`.footnotes__no`) und das Wort „Vordruck“ (`.badge__pre`) setzt `assemble.cjs` als echten Text ein (s. 6.13, 6.5). `::before/::after` nur für Striche, Punkte, Marker.
14. **Vorhabenbeginn-Regel** („Erst Bewilligung, dann Vertrag/Baubeginn“) ausformuliert nur im **Antragsweg S. 19** (Bernstein-Band + Ampel „Darf ich das vor der Bewilligung?“) und als Prüfpunkt im **Grundcheck S. 4**. S. 5: einzeiliges `.gate` „Erst Bewilligung, dann Vertrag oder Spatenstich → S. 19“ am Fuß des Baums; S. 14 und S. 16: programmspezifische Stopp-Zeile (Stopp-Icon in Bernstein + fetter Satz im Faktenmodul, kein Kasten); S. 9: Marke im Zeitstrahl. Kein weiterer Achtung-Kasten zu diesem Thema.
15. **Fundstellen-Abstand:** Zwischen letztem Modul und Fundstellenblock mindestens 4 mm (global: `.page > :has(+ .footnotes) { margin-bottom: 4mm }`, die Fußnoten sitzen mit `.l-bottom` am Fuß). Passt eine Seite dann nicht, Inhalt entlasten – nicht den Abstand drücken.
8. Seitenspezifisches CSS nur im `<style>` der eigenen `<section>` mit Präfix `.page[data-page="NN"]`; dort keine neuen Hex-Farben.

### Klassen-Namenskonvention

| Präfix / Muster | Bedeutung | Beispiele |
|---|---|---|
| `block`, `block__element`, `block--modifier` | BEM für Komponenten | `.kf`, `.kf__num`, `.kf--hero`, `.callout--frist` |
| `page`, `page__*`, `page--*` | Seitenrahmen und -varianten | `.page__foot`, `.page--accent` |
| `l-*` | Layout (Raster, Stapel, Position) | `.l-grid`, `.l-span-7`, `.l-stack--m`, `.l-bottom` |
| `u-*` | Utilities (Abstand, Satz, Sichtbarkeit) | `.u-mt-6`, `.u-justify`, `.u-hyphens`, `.u-sr` |
| `bs-21` … `bs-26` | Baustein-Farbe eines Fördergegenstands; setzt `--bs`/`--bs-tint` für alles darin | `<section class="page bs-24">` |
| `on-dark`, `on-light`, `on-sand` | Theme-Scope für einen Teilbereich | `<div class="on-dark">` |
| SVG: `c-*` Flächen, `t-*` Text, `tl-*` Zeitstrahl, `fl-*` Ablauf, `ill-*` Illustration, `pict-*` Piktogramm-Teile | nur innerhalb von SVG | `.c-loan`, `.t-val`, `.tl-pin--signal` |

---

## 1 · Tokens

### 1.1 Farben (Palette → Semantik)

| Semantisches Token | hell (Standard) | dunkel (`.page--dark/--cover/--back`, `.on-dark`, `.kf--hero`, `.contact--dark`) | Einsatz |
|---|---|---|---|
| `--surface` | Papier `#FAF6EF` | Petrol 900 `#0E2A33` | Seitengrund |
| `--surface-2` | Sand 100 `#F0E6D3` | Petrol 800 | Bänder, Kästen, hervorgehobene Spalte |
| `--surface-3` | Sand 200 | Petrol 700 | Schraffur-Grund, Raster |
| `--fg` / `--fg-2` / `--fg-3` | Tinte / 6,8:1 / 5,9:1 | Papier / 9,4:1 / 6,3:1 | Text 1/2/3 |
| `--rule` / `--rule-strong` | Sand 400 / Tinte | Petrol-Linie / Papier | Haarlinie / Modul-Linie (1,2 pt) |
| `--accent` / `--accent-text` / `--accent-soft` | Terrakotta 600 / 700 (5,9:1) / 100 | Terrakotta 300 / 300 / Petrol 800 | Akzent, Kicker, Querverweise · Achtung-Kasten |
| `--loan` · `--grant` · `--equity` | Petrol 600 · Terrakotta 600 · Sand 300 | Petrol 400 · Terrakotta 300 · Petrol 700 | **Datenfarben** Darlehen · Zuschuss · Eigenmittel |
| `--on-data` | Weiß (5,0:1 / 4,8:1) | Tinte | Text in Datenbalken |
| `--signal-fill` / `--signal-soft` / `--signal-text` | Bernstein `#E6A532` / 100 / 800 (7:1) | Bernstein / Petrol 800 / Bernstein | **nur** Stopp, Frist, Warnband |
| `--tip` / `--tip-soft` / `--tip-text` | Petrol 600 / 100 / 700 | Petrol 400 / 800 / 300 | Tipp-Kasten |
| `--ok` / `--no` | Petrol 600 / Terrakotta 700 | Petrol 400 / Terrakotta 300 | `.mark--yes/--no` |
| `--old` | Sand 400 | Sand 400 | Datenreihe „bisher / altes Recht“ (SVG `c-old`, HTML `.sw--old`) |

`.page--accent` / `.on-sand`: Seitengrund Sand 100, Kästen werden Papier (Umkehr), Linien Sand 500.
`.on-light` (helle Insel auf dunkler Seite, z. B. Plakette oder Kontaktkachel auf Titel/Rückseite) setzt neben den Tokens auch `color: var(--fg)` – Text erbt dort nicht mehr die Papierfarbe der dunklen Seite.
Plan-Aliasse (aus `plan.json`): `--color-primary`, `--color-accent`, `--color-loan`, `--color-grant`, `--color-equity`, `--signal`, `--baustein-21` … `--baustein-26`.

**Farbregeln:** Terrakotta ist Akzent *und* Datenfarbe „Zuschuss“ – deshalb Warnungen/Fristen nie terrakotta, sondern Bernstein (`--signal-*`). Bernstein nie für Daten oder Deko – nur für Förderentscheidung/Vorhabenbeginn (Stopp), Stichtag und Fristen. Dafür: ausgelaufene Bindungen, Ring-Rest und „bisher“ in `--old` (`c-old`, S. 3); Kostenlinien in `--fg-2` gestrichelt mit Label (S. 9); Werte „über der Grenze“ als Eigenmittel-Schraffur mit `--rule-strong`-Kontur (S. 10). Petrol-Grün-Töne der Bausteine nie für Datenreihen „Darlehen/Zuschuss“.

### 1.2 Baustein-Register (6 Fördergegenstände)

| Klasse | Token | Ton | Fördergegenstand | Förderart-Chip |
|---|---|---|---|---|
| `.bs-21` | `--bs-21` `#1A6470` | Petrol | 2.1 Mietwohnungen in Mehrfamilienhäusern | Darlehen + Zuschuss |
| `.bs-22` | `--bs-22` `#2F6A4A` | Tanne | 2.2 Energetisch hochwertiger Neubau (EH 40) | Zuschuss |
| `.bs-23` | `--bs-23` `#85601A` | Ocker | 2.3 Klimagerechte Modernisierung | Zuschuss |
| `.bs-24` | `--bs-24` `#2A4F9A` | Nordsee | 2.4 Ostfriesische Inseln | Darlehen + Zuschuss |
| `.bs-25` | `--bs-25` `#6A4A8A` | Heide | 2.5 Erwerb von Belegungs- und Mietbindungen | Festbetrag (Zuschuss) |
| `.bs-26` | `--bs-26` `#8E3349` | Bordeaux | 2.6 Verlängerung auslaufender Bindungen | Zinsverbilligung |

Weiß auf allen Baustein-Farben ≥ 5,7:1. Baustein-Farben erscheinen **immer zusammen mit der Nummer 2.1–2.6** (graustufenfest). `-tint`-Varianten für Flächen.

### 1.3 Typografie

| Token | Wert | Rolle |
|---|---|---|
| `--font-display` | Fraunces Variable | Headlines, Lead, Zahlen, Zitate |
| `--font-text` | Inter Variable | Fließtext, Labels, Tabellen, Diagramme |
| `--fs-cover` | 64 pt | Titel |
| `--fs-h1` / `--fs-h1-s` | 40 / 32 pt | Seitentitel |
| `--fs-h2` / `--fs-h3` | 19 / 12,5 pt | Zwischentitel / Modultitel |
| `--fs-lead` | 13 pt (`.lead--s` 11,5 pt) | Vorspann (Fraunces) |
| `--fs-body` / `--fs-small` / `--fs-micro` | 9,5 / 9 / **8,5 pt (Minimum)** | Fließtext / Kacheln, Tabellen / Labels, Fußnoten |
| `--fs-module` / `--lh-module` | = `--fs-small` (9 pt) / 1,36 | **Modultext**: Listen, Kästen, Kacheln, Faktenspalten, Tabellenzellen (Ausnahme Term Sheet S. 9) |
| `--fs-fig-hero` / `-xl` / `-l` / `-m` / `-s` | 150 / 60 / 42 / 30 / 20 pt | Kennzahlen |

Fraunces: `"WONK" 0` überall; Gewicht ≥ 350 unter 24 pt (Druck auf Naturpapier), leichte Schnitte (250–340) nur ≥ 30 pt. Deshalb stehen `.step__no` (20/26 pt) und SVG `.t-num-l` (25,5 pt) auf 360.
Display-Überschriften: Laufweite −0,016 em, **Wortabstand +0,06 em** (Fix für „Aufeinen Blick“).

### 1.4 Raster und Satzspiegel

| Token | Wert |
|---|---|
| Seite | 210 × 297 mm, `@page { margin: 0 }` |
| `--m-top` / `--m-bottom` | 14 mm / 22 mm (Inhalt endet bei 275 mm, ≥ 6 mm über der Fußlinie) |
| `--m-inner` / `--m-outer` | 18 mm / 18 mm (Rückendrahtheftung, symmetrisch) |
| Satzspiegel | 174 × 261 mm, 12 Spalten à 9,92 mm, Steg `--gutter` 5 mm |
| `--foot-y` | Fußzeile 10 mm über Endformat |
| `--safe` | Text ≥ 5 mm vom Endformat |
| Abstände | `--sp-1 … --sp-16` = 1, 2, 3, 4, 5, 6, 8, 10, 12, 16 mm |
| Linien | `--hair` 0,5 pt · `--rule-w` 0,8 pt · `--rule-heavy` 1,2 pt (Modul-Beginn) |

Spaltenbreiten: `l-span-3` 39,8 mm · `-4` 54,7 mm · `-5` 69,6 mm · `-6` 84,5 mm · `-7` 99,4 mm · `-8` 114,3 mm · `-9` 129,2 mm · `-12` 174 mm.

---

## 2 · Seitenrahmen

```html
<section class="page bs-21" data-page="08">
  <div class="bs-register" data-bleed>2.1</div>                       <!-- nur Programmseiten -->
  <header class="page__header"><span class="page__section"><b>04</b>Finanzierung</span><span>RL Nr. 2.1, 5</span></header>

  … Inhalt (Seite ist eine Flex-Spalte; .l-bottom schiebt ein Modul an den Fuß) …

  <footer class="page__foot">
    <span class="page__folio">8</span>
    <span class="page__running"><span>Mietwohnraumförderung Niedersachsen 2026<span class="sep">·</span><b>Finanzierung</b></span><span>Stand: 21.10.2026</span></span>
  </footer>
</section>
```

- `data-page="NN"` ist Pflicht. Gerade Nummern (endet auf 0/2/4/6/8) = linke Seite: Seitenzahl und Register-Reiter wandern automatisch nach außen links. Ohne Nummer: `.page--left` / `.page--right`.
- `.page__header` ist optional (Kapitelmarke: Kapitelnummer in Terrakotta + Kapitelname; rechts RL-Fundstelle). Er sitzt im Fluss, 8 mm Abstand zum Inhalt.
- `.page__foot` (Kolumnentitel + Seitenzahl) auf allen Innenseiten; nicht auf Titel und Rückseite. Immer `<footer class="page__foot" aria-hidden="true">` (Artefakt im getaggten PDF).
- Varianten: `.page--cover` (Titel, dunkel, ohne Polster), `.page--dark` (dunkle Innenseite), `.page--accent` (Sandseite: die Mittel-Doppelseite 10|11 „Rechnen“; Kästen werden automatisch Papier), `.page--back` (Rückseite, dunkel, ohne Fuß).
- **Rhythmus:** Jede Doppelseite hat ein dominantes Hauptelement (S. 8 Fördermix, S. 10 Finanzierungshaus als Reprise des Titelhauses – 20 Fenster = 20 Wohnungen, Geschosse 40/40/20 –, S. 11 Spiegeldiagramm).
- `.bs-register`: 15 × 12 mm Reiter an der Oberkante, außen bündig mit dem Satzspiegel, Farbe aus `bs-2x` der Seite; immer mit `data-bleed aria-hidden="true"`.
- **Master-Opener der Programmseiten** (S. 8, 12, 13, 14, 16, 17), ein Muster für alle sechs:

```html
<header class="program-head program-head--master">
  <div class="program-head__no">                              <!-- 4 Spalten außen: gerade Seite links, ungerade rechts -->
    <p class="chapter-no">02<small>Programmteil</small></p>    <!-- Ziffer = Kürzel der RL-Nummer, kein Laufzähler („von 06“ entfällt) -->
    <p class="tags"><span class="tag"><i class="sw sw--grant"></i>Zuschuss</span></p>
  </div>
  <div class="program-head__main">                            <!-- 8 Spalten (l-span-8), feste Breite -->
    <p class="kicker">Programmteil 2.2 · EH-40-Neubau</p>     <!-- ohne Vorstrich -->
    <h1 class="h1 h1--s">…</h1>
    <p class="deck">Bis zu <b>…</b> …</p>                      <!-- Fraunces, ≤ 2 Zeilen, Kernzahlen in Akzent -->
    <p class="program-head__subject">Gegenstandssatz …</p>    <!-- Inter 9,5 pt, fg-2, ≤ 3 Zeilen -->
  </div>
</header>
```
  Abstände: Kicker → H1 2,4 mm, H1 → Deck 2,6 mm, Deck → Gegenstand 1,8 mm; danach `u-mt-4`. Ziffer und Chip stehen außen bündig. Zusatzelemente (z. B. Inselkette S. 13) dürfen unter dem Gegenstandssatz in `__main` stehen. Der ältere Kopf `<div class="l-grid program-head">` bleibt nur für Specimen-Seiten.

---

## 3 · Typografie-Bausteine

```html
<div class="title-block title-block--split">                <!-- --split: 7 + 5 Spalten; --split-6: 6 + 6 -->
  <div class="title-block__main">
    <p class="kicker">Die Förderung in Zahlen</p>            <!-- Versalien, Terrakotta, 7-mm-Strich davor -->
    <h1 class="h1">Auf einen Blick</h1>                      <!-- .h1--s 32 pt, .h1--xl 52 pt; <em> = kursiv Terrakotta -->
  </div>
  <p class="lead">Seit dem 1. Juli 2026 gilt …</p>           <!-- .lead--s 11,5 pt -->
</div>

<h2 class="h2">Zwischentitel</h2>   <h3 class="h3">Modultitel</h3>   <p class="label">Versal-Label</p> <p class="label label--accent">…</p>
<div class="prose text-cols-2 u-justify"><p class="dropcap">Fließtext …<span class="fn">1</span></p><p>…</p></div>
<p class="small">Kleintext 9 pt</p>   <p class="footnote">Fußnotentext 8,5 pt</p>
<span class="ref">RL Nr. 5.3.3</span>                         <!-- Quellenmarke ohne Präfix: die Richtlinie hat Nummern, keine Paragrafen (kein „§ RL“) -->
<p class="deck">Bis zu <b>50 %</b> der zuwendungsfähigen Kosten …</p>   <!-- Unterzeile unter der H1: Fraunces 11 pt, b = Akzent + nowrap -->
<p class="deck deck--s">Läuft Ihre Belegungs- und Mietbindung … aus, …</p>   <!-- ganzer Satz: 10,5 pt, fg-2, b ohne nowrap -->
<span class="pageref">→&nbsp;S.&nbsp;8–11</span>                <!-- Seitenverweis-Chip (Akzent-Hauch, Pfeil als Zeichen) -->
```

Regeln: Pro Seite genau ein `.h1`. Kicker ≤ 6 Wörter. Lead ≤ 35 Wörter, ungetrennt (`.lead`: `hyphens: manual`, `text-wrap: pretty`; Trennung nur von Hand an Kompositionsfugen). Die Initiale `.dropcap` ist auf genau drei Zeilen Fließtext (9,5 pt / 1,45) abgestimmt (50 pt, Zeilenhöhe .74). Blocksatz nur ab 70 mm Spaltenbreite (`.text-cols-2` erst ab `l-span-8`), sonst Flattersatz. `.dropcap` nur einmal pro Heft (Editorial).

---

## 4 · Layout-Utilities

```html
<div class="l-grid"> <div class="l-span-7">…</div> <div class="l-span-5">…</div> </div>   <!-- 12er-Raster; --row-gap per style -->
<div class="l-grid l-grid--stretch">…</div>       <!-- Kacheln gleich hoch -->
<div class="l-cols l-cols--3">…</div>             <!-- gleich breite Spalten (2/3/4/6) -->
<div class="l-stack l-stack--m">…</div>           <!-- vertikaler Abstand zwischen Kindern (xs/s/m/l/xl = 1/2/4/6/10 mm) -->
<div class="l-sidebar">Hauptspalte · Marginalie (4 Spalten)</div>   <!-- .l-sidebar--left: Marginalie links (3 Spalten) -->
<div class="module">…</div>                       <!-- Modul beginnt mit 1,2-pt-Linie (Markenzeichen von A) -->
<div class="band">…</div>                         <!-- Sandband mit Haarlinie oben -->
<div class="… l-bottom">…</div>                   <!-- Modul an den Fuß des Satzspiegels -->
```

Weitere Utilities: `.u-justify`, `.u-hyphens`, `.u-nohyphens` (Wort/Bereich nicht trennen), `.u-url`, `.u-nowrap`, `.u-tnum`, `.u-accent`, `.u-muted`, `.u-strong`, `.u-sr` (nur Screenreader), `.u-avoid-break`, `.u-mt-0 … .u-mt-12`.
`.u-sr` blendet per `clip-path: inset(50%)` aus und nutzt bewusst kein `overflow: hidden` (render.cjs würde sonst „schneidet Inhalt ab“ melden); taugt auch für `<caption>`/`<thead>`, die nur für Screenreader gedacht sind. Keine seitenlokalen Kopien (`.pNN-sr`) mehr anlegen.

Abstände zwischen Modulen: `u-mt-5` (eng) · `u-mt-6` (Standard) · `u-mt-8` (nach Seitentitel) · `u-mt-10` (Kapitelwechsel). Keine eigenen Pixelwerte.

---

## 5 · Block-Typen aus dem Seiten-JSON → Komponenten

| JSON-Block | Komponente | Varianten |
|---|---|---|
| `key_figures` | `.key-figures` + `.kf` | `.kf--hero`, `.kf--band`, `.kf--s/--xl/--accent/--bs`, Raster `--2/--4`, `.kf__sub`, Vorsatz in `.kf__top`, `.seal` |
| `table` | `.table` | `--figures`, `--compact`, `--terms`, `--compare`, `--matrix`, `--heat`; `.num`, `.is-hl`, `.is-total`, `.is-key`, `.is-group-end`, `.bs-row` |
| `callout` | `.callout--hinweis/--achtung/--tipp/--frist` | `--s` (kompakt), `--inline` (Label im Textfluss), `__split` (zweispaltig), `.gate` (Warnband), `--side`, `--plain` |
| `quote` | `.quote` | `--l` (Pull-Quote), `--band` (Zitatband) |
| `steps` | `.steps` | `--lanes` (Sie/Förderstelle/NBank), `--h` (waagerecht), `.steps__gate`, `.ratebar` |
| `chart` | `figure.chart` + Inline-SVG | stacked-bar, bar, grid/heatmap, timeline, compare (+ Ablauf `fl-*`, Ring) |
| `faq` | `dl.faq` | `--2col` |
| `checklist` | `ul.checklist` | Kästchen, Status (`.mark--yes/--no/--warn`), `--cols`, `--open-end` |
| `contact` | `address.contact` | `--dark`, `--plain`, `__tel--xl` |
| `bullets` | `ul.bullets` | `--ruled`, `--check`, `--dash`, `--num`, `--compact`, `--body`; Titel `.bullets__title`; Seitenleiste `.facts` |

Feldzuordnung (typisch): `value/unit/prefix/label/text/ref` → `kf__num/kf__unit/kf__pre/kf__label/kf__text/ref`; `title/subtitle/note/source` → `chart__title/chart__sub/chart__note/source`; `variant` des Callouts → Modifikator; `who` im Schritt → Bahnen-Marker; `form` → `.badge--form`; `deadline` → `.badge--frist`.

---

## 6 · Komponenten

### 6.1 Kennzahlen (`key_figures`)

```html
<div class="key-figures">                       <!-- 3 Kacheln je Reihe; --4 = 4 je Reihe; --2 = 2 je Reihe -->
  <article class="kf kf--hero">                 <!-- dunkle Leitkachel, volle Breite, 150 pt -->
    <div class="kf__top"><span class="kf__idx">01</span><span class="ref">RL Nr. 5.3.3</span></div>
    <p class="kf__fig"><span class="kf__pre">bis zu</span><span class="kf__num">80<span class="kf__unit">%</span></span></p>
    <div class="kf__side">
      <h2 class="kf__label">Förderquote aus Darlehen und Zuschuss</h2>
      <p class="kf__text">in % der zuwendungsfähigen Kosten, Programmteil 2.1 – in jeder Einkommensgruppe:</p>
      <table class="kf__mix">
        <tr><th>A</th><td><i class="sw sw--loan"></i><b>40 %</b> Darlehen</td><td><i class="sw sw--grant"></i><b>40 %</b> Zuschuss</td></tr>
      </table>
    </div>
  </article>

  <article class="kf">
    <div class="kf__top"><span class="kf__idx">02</span><span class="ref">RL Nr. 5.3.4, 12.7</span></div>
    <p class="kf__fig"><span class="kf__pre">Darlehenszins</span><span class="kf__num">0<span class="kf__unit">%</span></span></p>
    <h3 class="kf__label">bis Ende des 35. Jahres</h3>
    <p class="kf__text">nach Bezugsfertigkeit. Dazu 0,5 % Verwaltungskostenbeitrag p. a. …</p>
  </article>

  <article class="kf kf--band">                 <!-- Sandband, volle Breite: Erklärung links, Werte rechts -->
    <div><div class="kf__top" style="justify-content:flex-start"><span class="kf__idx">05</span><b class="kf__label u-mt-0">Bemessungsgrenzen je m² Wohnfläche</b></div>
      <p class="kf__text">… Ausgangswerte, fortgeschrieben zum 1. April und 1. Oktober; aktuelle Werte auf nbank.de.</p></div>
    <div class="kf__values">
      <div class="kf__value"><p class="kf__num">4.800<span class="kf__unit">€</span></p><small>Mietenstufe I–III</small></div>
      <div class="kf__value"><p class="kf__num">5.000<span class="kf__unit">€</span></p><small>Mietenstufe IV–VII</small></div>
    </div>
  </article>
</div>

<div class="seal"><span class="seal__pre">bis zu</span><span class="seal__num">80<span class="seal__unit">%</span></span><span class="seal__text">Förderquote, Programmteil 2.1</span></div>
<!-- .seal--filled = Terrakotta-Fläche; .seals = Reihe; Größe über --seal-size (Standard 34 mm) -->
```

Dichte Raster (z. B. 4 × 2 auf S. 3): Der Vorsatz darf in die Kopfzeile wandern – `<div class="kf__top"><span class="bs-badge bs-21"><b class="bs-badge__no">2.1</b></span><span class="kf__pre">bis zu</span></div>`. Das Badge steht im DOM **vor** `kf__pre` und wird per `order` nach rechts gesetzt (mehrere Badges in `.kf__badges`), damit der PDF-Text „bis zu 80 %“ lautet. Lange Einheiten (€/m² Wohnfläche und Monat) als `.kf__sub` direkt unter der Zahl.

Regeln: `kf__pre` steht **immer** über der Zahl (Höhe reserviert, auch leer) – „bis zu“, „mind.“, „rund“, „Festbetrag“, „Darlehenszins“. Einheit immer in `kf__unit` (Abstand automatisch, nie Leerzeichen davor tippen). Jede Kachel mit RL-Fundstelle in `kf__top`. Kostenhinweise (Verwaltungskostenbeitrag, Bearbeitungsentgelt) direkt in `kf__text`, keine Sternchen. Höchstens eine Hero-Kachel pro Seite. Zahlen > 6 Zeichen (z. B. „90.000“) nur in 3er- oder 2er-Raster.

### 6.2 Tabellen (`table`)

```html
<figure class="module">
  <figcaption class="fig-head"><h2 class="fig-head__title">Höchstmieten</h2><p class="fig-head__sub">Nettokaltmiete je m² Wohnfläche und Monat, Jahr 1–3 ab Mietbindung</p></figcaption>
  <table class="table table--figures">
    <thead><tr><th>Mietenstufe</th><th class="num is-hl">Gruppe<span class="big">A</span></th><th class="num">Gruppe<span class="big">B</span></th><th class="num">Gruppe<span class="big">C</span></th></tr></thead>
    <tbody>
      <tr><th scope="row">I–III</th><td class="num is-hl">6,50<span class="unit">€</span></td><td class="num">7,90<span class="unit">€</span></td><td class="num">8,70<span class="unit">€</span></td></tr>
    </tbody>
  </table>
  <p class="source u-mt-2">Ab KfW-EH-40-Niveau bis zu 0,30 € mehr. <b>RL Nr. 5.4.4</b></p>
</figure>
```

| Variante | Einsatz |
|---|---|
| `.table` | Standard 9 pt, Haarlinien, Kopf mit 0,8-pt-Linie, Abschluss 0,8 pt |
| `.table--figures` | wenige große Werte (Fraunces 20 pt, Gewicht 380) – Höchstmieten, Fördersätze |
| `.table--compact` | Modultext 9 pt / 1,36, dichte Tabellen (Rechenweg, Vergleich, Unterlagen); engere Zellpolster |
| `.table--terms` | Term Sheet: `th scope="row"` als Versal-Label (30 %) + Text |
| `.table--compare` | bisher → neu: `.col-old` (grau), `.table__arrow` („→“), `.col-new` (fett) |
| `.table--matrix` + `tr.bs-row.bs-2x` | Übersicht der Programmteile mit Baustein-Kante |
| `.table--heat` + `td.seq-1…6` | Heatmap als Tabelle (Prozent groß, Höchstbetrag in `<small>`) |

Zellen: `.num` = rechtsbündig + `tabular-nums` (für **alle** Zahlenspalten inkl. Kopf), `.unit` = kleine Einheit hinter dem Wert, `.is-hl` = Regelfall/Spalte A sandfarben, `tr.is-total` = Summenzeile, `tr.is-key` = hervorgehobene Zeile, `.muted` = Nebeninfo.
Ziffern: Die Tabelle setzt **proportionale** Ziffern, nur `.num` ist tabellarisch. (Inter-`tnum` macht auch Bindestriche ziffernbreit: „KfW - EH - 40“, „öffentlich - rechtlich“.)
Gruppentrenner (0,8 pt): `tr.is-group-end` bzw. `th.is-group-end` an der **oberen** Zelle setzen. Im Druck runden Haarlinie und 0,8 pt beide auf 1 px; bei `border-collapse` gewinnt sonst die Haarlinie der oberen Zelle gegen ein `border-top` darunter.
Mischgrößen in einer Zeile (Inter-Label 8,5 pt neben Fraunces-Wert): `vertical-align: baseline` greift im Chromium-PDF bei Tabellenzellen **nicht** (Bildschirm-DOM misst korrekt, PDF setzt oben bündig). Stattdessen `vertical-align: top` und das kleinere Label per `padding-top` auf die Grundlinie schieben (Inter 8,5 pt neben Fraunces 11 pt, beide Zeilenhöhe 1, 0,5 mm Polster: 1,24 mm).
`.table__arrow` enthält das Zeichen „→“ (kein Icon); im Kopf ebenfalls Akzentfarbe.
Regeln: höchstens 8 Zeilen × 5 Spalten; Zellen ≤ 8 Wörter; Einheiten in den Kopf, wenn für die Spalte gleich; Quellenzeile `.source` direkt darunter; nie Tabellen als Bild.

### 6.3 Hinweise (`callout`) und Warnband

```html
<aside class="callout callout--hinweis"><p class="callout__label"><!-- assets/ui-hinweis.svg -->Hinweis</p><p class="callout__body">…</p></aside>
<aside class="callout callout--tipp"><p class="callout__label"><!-- ui-tipp.svg -->Tipp</p><p class="callout__body">…</p></aside>
<aside class="callout callout--frist"><p class="callout__label"><!-- ui-frist.svg -->Frist</p><p class="callout__date">31.12.2026</p><p class="callout__body">…</p></aside>

<aside class="callout callout--achtung">
  <p class="callout__label"><!-- ui-achtung.svg -->Achtung</p>
  <h3 class="callout__title">Vor der Bewilligung nicht beginnen</h3>
  <div class="callout__split">
    <div class="callout__col"><p class="callout__col-title"><i class="mark mark--no"></i>Gilt als Beginn</p>
      <ul class="bullets bullets--dash bullets--compact"><li>Liefer-, Leistungs-, Kauf- oder Werkvertrag</li><li>Baubeginn, erster Spatenstich</li></ul></div>
    <div class="callout__col"><p class="callout__col-title"><i class="mark mark--yes"></i>Gilt nicht als Beginn</p>
      <ul class="bullets bullets--dash bullets--compact"><li>Grundstückskauf, Planung bis Leistungsphase 6 HOAI</li><li>Baugrunduntersuchung</li></ul></div>
  </div>
</aside>

<p class="gate"><!-- ui-stopp.svg --><span><b>Erst nach der Förderentscheidung beginnen.</b> Begonnene Vorhaben werden nicht gefördert.</span></p>
```

| Variante | Farbe | Wofür |
|---|---|---|
| `--hinweis` | Sand, Tinte-Linie | Ergänzung, Verweis auf nbank.de, Fortschreibung |
| `--achtung` | Terrakotta-Hauch, Terrakotta-Linie | Förderausschluss, Vorhabenbeginn, Nicht-Kumulierbarkeit |
| `--tipp` | Petrol-Hauch, Petrol-Linie | Praxisrat (als Rat gekennzeichnet, kein Rechtsanspruch) |
| `--frist` | Bernstein-Hauch, 2,4-pt-Bernsteinlinie, Datum groß | Stichtage (31.12.2026 Wahlrecht), Fristen |
| `.gate` | Bernsteinband, quer | Stopp-Linie im Ablauf, max. 1 pro Seite |

Regeln: Label immer mit Icon (`assets/ui-*.svg`, Klasse `icon`); Body ≤ 45 Wörter (`l-span-4`) bzw. ≤ 70 Wörter (`l-span-6` und breiter). Höchstens 2 Callouts pro Seite plus ein `.gate`. `--side` setzt die Linie links (für Marginalspalten), `--plain` ohne Fläche.

| Zusatz | Wirkung | Einsatz |
|---|---|---|
| `.callout--s` | Polster 3,2/4,4/3,6 mm, Titel 11,5 pt, Body 9 pt / 1,36 (Modultext) | schmale Kästen (`l-span-4/-5`) auf dichten Programmseiten (S. 12–14, 16) |
| `.callout--inline` | Label (Icon + Versal) im Textfluss vor dem Body, Polster 2,2/2,4 mm | Bänder über die volle Satzspiegelbreite (Kalkulationsnotiz S. 9) |
| `.callout--calc` | Kalkulationsnotiz: Tipp-Farben, Polster 2,8/4/3,2 mm, Icon 3,8 mm, Body 9 pt / 1,36 | **die** Kalkulationsnotiz der Doppelseite (Regel 0.11) |
| `.callout--calc.calc--figure` | Option mit Rechengrafik: `.calc__grid` (Text links, Grafik rechts, unten bündig), Inline-SVG `.calc__fig` (1 Einheit = 1 mm, ≤ 32 mm breit, Datenfarben wie im Heft) | S. 16 (Miete + Zuschuss = bis zu 9,50 €) |
| `.icon--signal` | Icon in Bernstein | Stopp-Icon (`ui-stopp`) für **alle** „Erst Bewilligung, dann …“-Warnungen (S. 5, 14, 16, 19); (!) bleibt für die übrigen Achtung-Kästen |

**Kalkulationsnotiz:** `callout callout--tipp callout--calc`, Label „Kalkulationsnotiz“, Icon **`ui-rechner`** (nicht `ui-tipp`), kein zusätzlicher Titel. **Höchstens eine je Doppelseite**, immer das unterste Modul der Außenspalte in voller Spaltenbreite (Stand: S. 9, 11, 13, 15, 16, 18; die Doppelseiten 2|3, 4|5 und 6|7 haben keine – S. 7 führt den Satz als fetten Einstieg der Mietpfad-Bildunterschrift –, S. 9 als volles Band `.callout--inline` am Seitenende). Doppelte Aussagen ersetzt ein Seitenverweis-Chip:

```html
<a class="pageref" href="#seite-18">Standort prüfen →&nbsp;S.&nbsp;18</a>
```
Offen (Redaktionsentscheidung): `.callout--achtung` ist Terrakotta = Datenfarbe „Zuschuss“; Regel 1.1 („Warnungen nie terrakotta“) gilt bisher nur für Fristen/Stopp. Bis zur Entscheidung bleibt `--achtung` Terrakotta, der Stopp-Marker darin wird Bernstein (`.icon--signal`).

### 6.4 Zitat (`quote`)

```html
<figure class="quote">                                     <!-- --l: Pull-Quote 20 pt; --band: Zitatband mit Namensspalte rechts -->
  <blockquote class="quote__text"><p>So öffnet sich eine Tür für all jene, die bisher knapp durchs Raster gefallen sind.</p></blockquote>
  <figcaption class="quote__by"><span class="quote__name">Michael Kiesewetter</span><span>Vorstandsvorsitzender der NBank</span><span class="quote__src">MW-Presseinformation vom 03.07.2026</span></figcaption>
</figure>
```

Regeln: **Nur wörtliche Zitate aus der Faktenbasis** (Feld `quote` in `factbase.json`, IDs G3-01, G3-02, G3-04, G3-05, G3-07 bis G3-10), Kürzungen nur an Satzgrenzen. Anführungszeichen setzt CSS („ als großes Terrakotta-Zeichen, das unten auf der Grundlinie der ersten Zitatzeile hängt – nicht auf Versalhöhe, sonst liest es sich als englisches ”; “ am Ende) – im Text keine Anführungszeichen tippen. Seitenoverrides des `top`-Werts nach der Formel im CSS-Kommentar von `.quote::before`. Name und Funktion im Nachweis immer untereinander (eigene Zeilen). Namen exakt: „Grant Hendrik Tonne, Niedersächsischer Minister für Wirtschaft, Verkehr und Bauen“ bzw. „Wirtschafts- und Bauminister“; „Michael Kiesewetter, Vorstandsvorsitzender der NBank“. Quelle mit Datum immer in `quote__src`. Höchstens ein Zitat pro Doppelseite; ≤ 40 Wörter (`--band`/`--l` ≤ 25 Wörter).

### 6.5 Ablauf (`steps`)

```html
<div class="steps steps--lanes">                           <!-- --lanes per style anpassbar: style="--lanes:2" -->
  <div class="steps__head">
    <span class="steps__head-label">Schritt<span class="lane-legend"><span><i class="mk mk--lead"></i>ist am Zug</span><span><i class="mk mk--inv"></i>ist beteiligt</span></span></span>
    <span class="lane-h">Sie<small>Antrag</small></span>
    <span class="lane-h lane-h--hl">Förderstelle<small>Kommune</small></span>
    <span class="lane-h">NBank<small>Bewilligung</small></span>
  </div>
  <ol>
    <li class="step">
      <span class="step__no">02</span>
      <div><h3 class="step__title">Förderentscheidung</h3>
        <p class="step__text">Die NBank soll innerhalb von drei Monaten entscheiden: <b>Fördervertrag</b> bei Darlehen, <b>Bescheid</b> bei reinem Zuschuss.</p>
        <p class="step__meta"><span class="badge badge--form">1011</span><span class="badge badge--frist">Soll ≤ 3 Monate</span></p></div>
      <span class="lane"><i class="mk mk--inv"></i></span><span class="lane lane--hl"></span><span class="lane"><i class="mk mk--lead"></i></span>
    </li>
    <li class="steps__gate"><p class="gate"><!-- ui-stopp.svg --><span><b>Erst nach der Förderentscheidung beginnen.</b> Begonnene Vorhaben werden nicht gefördert.</span></p></li>
    <li class="step">… <div class="ratebar" role="img" aria-label="Auszahlung Neubau: …">
        <span class="ratebar__seg" style="--v:30"><b>bis zu 30 %</b>Baubeginn</span><span class="ratebar__seg" style="--v:30"><b>bis zu 30 %</b>Rohbau</span>
        <span class="ratebar__seg" style="--v:30"><b>bis zu 30 %</b>Innenputz</span>
        <span class="ratebar__seg ratebar__seg--final ratebar__seg--end" style="--v:10"><span class="ratebar__lab"><b>10 %</b>Fertigstellung</span></span>
      </div> …</li>
  </ol>
</div>

<ol class="steps steps--h" style="--n:3">                  <!-- waagerecht, 3–5 Schritte, Pfeil zwischen den Schritten (Polster rechts 2,4 mm, letzter Schritt 0) -->
  <li class="step"><span class="step__no">01</span><h3 class="step__title">Prolongationsangebot</h3><p class="step__text">…</p></li>
</ol>

<ol class="steps"><li class="step"><span class="step__no">01</span><div><h3 class="step__title">…</h3><p class="step__text">…</p></div></li></ol>   <!-- einfache Liste -->
```

Regeln: Marker unterscheiden sich in **Form** (voll/hohl), nicht nur Farbe; die Förderstellen-Bahn ist getönt (`lane--hl`). Jede Zeile mindestens einen `mk--lead`. Das `.gate` steht genau zwischen „Förderentscheidung“ und dem ersten Schritt, der einen Vertrag/Baubeginn bedeutet. `.ratebar`: Segmente proportional (`--v` in %), Beschriftung unter dem Balken mit Meilenstein; letztes schmales Segment mit `--end`. Vordrucke als `.badge--form` (nur Nummer – das Wort „Vordruck“ fügt `assemble.cjs` als `<span class="badge__pre">Vordruck&nbsp;</span>` ein, kein `::before`), Fristen als `.badge--frist`. Schritttext ≤ 3 Zeilen (≈ 170 Zeichen) in der Bahnen-Variante.

### 6.6 Diagramme (`chart`)

```html
<figure class="chart module">                              <!-- .chart--s: kleiner Titel für Drittel-/Viertelspalten -->
  <figcaption class="chart__head">
    <h2 class="chart__title">So setzt sich die Finanzierung zusammen</h2>
    <p class="chart__sub">Höchstsätze in % der zuwendungsfähigen Kosten</p>
    <ul class="legend"><li><i class="sw sw--loan"></i>Förderdarlehen bis zu</li><li><i class="sw sw--grant"></i>Zuschuss bis zu</li><li><i class="sw sw--equity"></i>Eigenmittel mindestens</li></ul>
  </figcaption>
  <svg class="chart__svg" viewBox="0 0 174 52" width="174mm" height="52mm" role="img" aria-label="Vollständige Datenaussage in einem Satz …">
    …
  </svg>
  <p class="chart__note"><b>Den Zuschuss gibt es nur zusammen mit dem Darlehen.</b> …</p>
  <p class="source">Quelle: RL Nr. 5.3.3 · eigene Berechnung</p>
</figure>
```

**SVG-Konventionen**

- **1 SVG-Einheit = 1 mm**: `viewBox`-Breite = `width` in mm (z. B. `viewBox="0 0 84.5 50" width="84.5mm" height="50mm"`). Nur dann stimmen die Schriftgrade. Breite = Spaltenbreite (Tabelle in 1.4).
- Text-Klassen: `t-b` fett/Tinte · `t-s` 8,5 pt (z. B. `t-val t-s` in schmalen Segmenten) · `t-m` 9,2 pt · `t-l` 12 pt · `t-val` Wert im Balken (`--on-data`) · `t-val-ink` Wert außerhalb · `t-cat` Fraunces-Gruppenbuchstabe · `t-num` / `t-num-l` Fraunces-Zahl 18 / 25,5 pt · `t-ax` Achse · `t-caps` Versal-Label · `t-acc` · `t-signal` · `t-bs` · `t-end` / `t-mid` (Ausrichtung) · `t-on-seq` / `t-on-seq-light` (auf Heatmap) · `t-tnum` (Tabellenziffern). **Kein `stroke` auf SVG-Text, Skia → Type 3:** `t-halo` (Papier-Kontur) nicht mehr verwenden (nirgends mehr im Einsatz; die Regel `.chart__svg .t-halo` in styles.css kann entfallen). Labels über Gitterlinien stattdessen mit einer Fläche freistellen: `<rect>` in `--surface` direkt nach der Gitterlinie und vor den Kurven (Beispiel S. 12, `.p12-halo`).
- Ziffern im SVG sind **proportional** (sonst sperren Bindestriche: „KfW-EH-40-Niveau“); tabellarisch nur `t-ax` und `t-tnum`, wo Ziffern untereinander fluchten müssen.
- Zahl–Einheit in SVG-Labels: schmales geschütztes Leerzeichen U+202F (`15 % 1.080 €` in 21-mm-Säulen); im HTML-Fließtext normales `&nbsp;`. Nicht bei Fraunces-Zahlen (U+202F ist dort breiter).
- Flächen: `c-loan` · `c-grant` · `c-equity` (+ Schraffur) · `c-accent` · `c-signal` · `c-ink` (Miete/Ertrag) · `c-muted` · `c-surface(-2)` · `c-old` (bisher, Token `--old`) · `c-bs` / `c-bs-21…26` · `c-seq-1…6`. Passende HTML-Swatches: `.sw--loan/--grant/--equity/--ink/--old/--signal/--bs`.
- Linien: `ax` (Achse 0,3) · `gridline` (0,18) · `tick` · `lead-line` (Führungslinie) · `brk` (Klammer) · `dash` · `cap-line` (Deckel/Kappung, gestrichelt) · `line-loan/-grant/-ink/-bs/-signal` · `sep-line`.
- Eigenmittel-Schraffur: Pattern aus `assets/deko-schraffur.svg` **mit eindeutiger ID je Diagramm** (`schraffur-08-1`), dann `fill="url(#schraffur-08-1)"` + Rahmen `class="c-equity-frame"`.
- Jedes Diagramm: `role="img"` + `aria-label` mit allen Werten in einem Satz.

**Diagrammtypen** (funktionierende Beispiele: `src/.preview-specimen.html`, Seiten 03 und 05)

| Typ | Aufbau | Beispiel |
|---|---|---|
| **stacked-bar** | Label-Spalte links (Gruppenbuchstabe `t-cat` + zwei Zeilen), Balken 7 mm hoch, Zeilen 11 mm, 0,6 mm Fuge zwischen Segmenten, Werte zentriert im Segment, Klammern (`brk`) über „Förderung bis zu 80 %“ / „mind. 20 %“, Achse 0–100 % unten | Finanzierung A/B/C (2.1) |
| **bar** (Säulen/Balken) | Werte direkt über/an den Balken, dünne `gridline`s statt Achsenzahlen, Kategorie + Zusatzwert unter der Basislinie | Bindungserwerb 60 m² (2.5), Marktvergleich Miete |
| **grid / heatmap** | Zellen mit 0,6 mm Fuge, sequenzielle Petrol-Skala `c-seq-1…6` (dunkler = höher), Wert groß + Höchstbetrag klein, Text ab Stufe 4 weiß | Klassensprung × Gruppe (2.3) |
| **timeline** | Achse `tl-axis`, Monats-`tl-tick`, Pins: `tl-pin--key` (In-Kraft), `--signal` (Stichtag, größer, Text `t-signal`), `--draft` (gestrichelt, Entwurf), `--done` (Ende); Labels abwechselnd oben/unten; lange Spannen mit Achsenbruch (`//`) | Stichtage 2026–2031 |
| **compare** | gespiegelte Säulen: oben Zuschuss (`c-grant`), unten Jahresmiete (`c-ink` – nicht `c-loan`, sonst verwechselbar mit Darlehen), Kategorie in der Mitte; Reihenname mit „bis zu“ und Einheit als Legende im Kopf (`.legend--stack`, Einheit in Klammern) | Szenarien A/B/C/Mix |
| Ablauf/Entscheidung (Zusatz) | `fl-box`, `fl-box--hl`, `fl-box--bs`, `fl-diamond`, `fl-edge` + `fl-arrow` (Pfeilspitze als Polygon, keine `<marker>`), `fl-yes`/`fl-no` | Navigator |
| Ring (Zusatz) | `ring-bg` + `ring-val` (`stroke-dasharray`, Akzent); `ring-val--fg` = Segment in Tinte, `ring-bg--old` = Grundring „bisher“ (`--old`, nie Bernstein); Segmentfuge `sep-line` | Anteil 28 %, Bedarfslage 306/96 |

**Diagramm-Regeln**

1. **Farben je Datenreihe sind fest:** Darlehen = `--loan` (Petrol), Zuschuss = `--grant` (Terrakotta), Eigenmittel = `--equity` (Sand, schraffiert), Miete/Ertrag = `--fg` (`c-ink`, `.sw--ink`), Bestand/bisher = `--old` (`c-old`, Sand 400), Signal/Stichtag = Bernstein, Programmteile = Baustein-Farbe + Nummer, Einkommensgruppen A/B/C = Petrol-Skala `seq-6/-4/-2` (A dunkelste, `.grp-chip`). Dieselbe Größe hat im ganzen Heft dieselbe Farbe.
2. **Direkt beschriften, keine Legenden-Suche:** Werte stehen im oder am Balken, Kategorien direkt an der Achse. Eine Legende (`.legend`) nur ergänzend im Kopf und nur, wenn sie die „bis zu“/„mindestens“-Aussage trägt. Kopf-Varianten: `.chart__head--inline` (Titel und Legende in einer Zeile, spart ≈ 5 mm), `.chart__head--stack` (Titel einzeilig, Legende linksbündig darunter – für `l-span-7` ohne Untertitel), Legende untereinander mit `.legend--stack`.
3. **Höchstwerte kennzeichnen:** „bis zu“ in Klammer, Legende oder Untertitel; Eigenmittel „mind.“.
4. **Wahrheitsgetreue Proportionen:** Längen exakt aus den Daten; Balken beginnen bei 0; keine 3D-Effekte, keine dekorativen Pseudo-Diagramme. Achsenbruch nur sichtbar markiert.
5. **Zahlenformat deutsch:** 80 %, 4.800 €, 0,5 %, 2,80 Mio. €, Tausenderpunkt, Dezimalkomma, Leerzeichen vor % und €.
6. Modellrechnungen und eigene Berechnungen im Untertitel oder in der `.chart__note` kennzeichnen („Modellrechnung“, „eigene Berechnung“); Quelle/RL-Nummer in `.source`.
7. Textgrößen in SVG nie unter `3px` (8,5 pt); Diagrammtitel ≤ 8 Wörter, Untertitel ≤ 15, Notiz ≤ 45, Labels ≤ 4 Wörter.

### 6.7 Häufige Fragen (`faq`)

```html
<dl class="faq">                                           <!-- .faq--2col für zwei Spalten -->
  <div class="faq__item"><dt class="faq__q">Gibt es den Zuschuss auch ohne Darlehen?</dt>
    <dd class="faq__a">In 2.1 nicht: Der Zuschuss ist an das Darlehen gebunden. Reine Zuschüsse gibt es in 2.2 und 2.3.</dd></div>
</dl>
```
Nummerierung (01, 02 …) setzt CSS. Frage ≤ 12 Wörter, Antwort ≤ 45 Wörter, Antwort beginnt mit der Antwort („Ja.“, „Nein:“, „Die NBank.“).

### 6.8 Checkliste (`checklist`)

```html
<ul class="checklist">                                     <!-- .checklist--cols: zweispaltig -->
  <li class="checklist__item"><span class="checklist__box"></span><span>Förderantrag <span class="badge badge--form">1011</span><span class="checklist__note">bei der Wohnraumförderstelle einreichen</span></span></li>
  <li class="checklist__item"><i class="mark mark--warn"></i><span>Bei 2.3: Energiebedarfsausweis mit Ausgangsklasse</span></li>
</ul>
```
Kästchen (`checklist__box`) sind druckbar zum Ankreuzen. Status-Varianten mit `.mark--yes` (✓, Petrol), `.mark--no` (✕, Terrakotta), `.mark--warn` (!, Bernstein) – Form + Farbe, graustufenfest. Eintrag ≤ 12 Wörter, ≤ 12 Einträge pro Spalte.
Linien: Unter einem `.bullets__title` entfällt die obere Linie des ersten Eintrags automatisch (keine Doppellinie). Folgt direkt eine Fußnoten- oder Modullinie, `.checklist--open-end` setzen (letzter Eintrag ohne Unterlinie).

### 6.9 Kontakt (`contact`)

```html
<address class="contact contact--dark">                    <!-- Standard: Sandkasten; --dark: Petrol; --plain: ohne Fläche -->
  <p class="contact__label">Wir beraten Sie gern</p>
  <p class="contact__name">Förderberatung Wohnraumförderung</p>   <!-- optional -->
  <p class="contact__tel">0511 30031-9333</p>                    <!-- __tel--xl auf der Rückseite -->
  <p class="contact__lines">Mo–Fr 08:00–17:00 Uhr<br><b class="u-url">wohnraumfoerderung@nbank.de</b></p>
</address>
```
Daten nur aus der Faktenbasis (F322–F324). Telefonnummer nie umbrechen (ist `nowrap`, Wortabstand +0,12 em, damit „0511 30031-9333“ nicht zusammenläuft). Größen: Standard 19 pt, `.contact__tel--l` 26 pt / 360 (Kachel ab `l-span-5`), `.contact__tel--xl` 34 pt. Helle Kachel auf dunkler Seite: `.contact.on-light`. E-Mail in `<b class="u-url">` (im Kontakt 8,5 pt, passt ab `l-span-4`); mit Name und E-Mail besser `l-span-5`.

### 6.10 Aufzählung (`bullets`)

```html
<h3 class="bullets__title">Gefördert wird</h3>             <!-- Versal-Titel mit 1,2-pt-Linie -->
<ul class="bullets bullets--ruled"><li><b>Neubau</b></li><li><b>Änderung, Erweiterung,</b> z. B. Aufstockung</li></ul>
<!-- --check (Haken), --dash (Strich), --num (Fraunces-Ziffern), --compact (enger), --body (9,5 pt Tinte) -->
```
≤ 7 Punkte, je ≤ 15 Wörter; Schlüsselwort fett am Anfang. Fußnotenziffer im `.bullets__title` mit Icon (Flex-Container) steht per `align-self` oben – kein Wrapper-Span nötig.

**Faktenspalte** (gestapelte Textmodule in einer Seitenleiste neben Diagrammen, S. 14, 16):

```html
<div class="l-span-5 facts">
  <section class="facts__mod"><h3 class="label label--accent">Was gefördert wird</h3><p class="facts__text"><b>…</b> …</p></section>   <!-- erstes Modul: 1,2-pt-Linie -->
  <section class="facts__mod"><h3 class="label label--accent">Bindung und Miete</h3><ul class="bullets"><li>…</li></ul></section>       <!-- weitere: Haarlinie -->
  <aside class="callout callout--frist callout--s">…</aside>
</div>
```
Module 3,2 mm Abstand, Text und Bullets 9 pt / 1,36 (Modultext).

### 6.11 Fördergegenstände: Badges, Chips, Register

```html
<span class="bs-badge bs-24"><b class="bs-badge__no">2.4</b>Ostfriesische Inseln</span>   <!-- --l größer -->
<span class="tag"><i class="sw sw--loan"></i><i class="sw sw--grant"></i>Darlehen + Zuschuss</span>
<span class="tag"><i class="sw sw--grant"></i>Zuschuss</span>
<span class="tag"><i class="sw sw--grant-o"></i>Festbetrag</span>
<span class="tag"><i class="sw sw--loan-o"></i>Zinsverbilligung</span>
<div class="tags">…mehrere .tag/.bs-badge…</div>
<div class="bs-stripes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>   <!-- sechs Farbstreifen -->

<ul class="programs">                                      <!-- 3 × 2 Übersicht; --compact = kleinere Schrift/Piktogramme -->
  <li class="program bs-21"><!-- assets/pikto-neubau-mfh.svg --><span class="program__no">2.1</span>
    <p class="program__title">Mietwohnungen in Mehrfamilienhäusern</p>
    <p class="program__meta"><span class="tag"><i class="sw sw--loan"></i><i class="sw sw--grant"></i>Darlehen + Zuschuss</span><span class="program__page">S. 8</span></p></li>
</ul>

<p class="chapter-no">01<small>Programmteil</small></p>    <!-- Programmnummer groß, Farbe = Baustein; Label „Programmteil“ (kein „von 06“: die Ziffern folgen den RL-Nummern, nicht der Seitenfolge) -->

<div class="paths">                                        <!-- Fördertatbestände als Icon-Reihe; --n per style -->
  <div class="path"><!-- pikto-neubau-mfh.svg --><div><p class="path__title">Neubau</p><p class="path__text">Mehrfamilienhaus ab drei Wohneinheiten</p></div></div>
  <div class="path"><!-- pikto-weg-aufstockung.svg -->…Änderung und Erweiterung…</div>
  <div class="path"><!-- pikto-weg-ersterwerb.svg -->…Ersterwerb…</div>
</div>
```
Badge-Farben **nur** für die Zuordnung zu einem Programmteil – nie für Daten. `bs-2x` an der `<section>` färbt Register, Kapitelnummer, `kf--bs`, Piktogramm-Akzente automatisch. Die Ziffer im `.bs-badge` bleibt weiß, auch in Komponenten, die `b` einfärben (`.bullets b`, `.kf__text b`).

```html
<span class="grp-chip grp-chip--a">A</span>   <!-- Einkommensgruppe: A = seq-6, B = seq-4, C = seq-2 (hell, dunkle Schrift); 4 mm / 9 pt, --l 5,2 mm / 11 pt -->
<span class="badge badge--s badge--form">1011</span>   <!-- --s: kleineres Polster für 8,5/9-pt-Fließtext; Gruppen „(1005a bzw. 1006a, …)“ mit .u-nowrap zusammenhalten -->
<div class="bs-strip" data-bleed aria-hidden="true">   <!-- Register-Leiste am Fuß von Titel und Rückseite (Artefakt) -->
  <ol class="bs-strip__nos" aria-label="Programmteile 2.1 bis 2.6"><li class="bs-21">2.1</li>…<li class="bs-26">2.6</li></ol>
  <div class="bs-stripes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
</div>
```
Nummern der `.bs-strip` stehen auf dunklen Seiten in `--bs-tint`, auf hellen in `--bs`.

### 6.12 Modellrechnung, Rechenblatt, Stempel

```html
<section class="model" aria-label="Modellrechnung">
  <div class="model__head"><div><p class="stamp">Modellrechnung</p><h3 class="model__title">1 Mio. € zuwendungsfähige Kosten, Gruppe A</h3></div>
    <p class="model__note">Annahme, keine Förderzusage. Höchstsätze; Überkompensationsprüfung vorbehalten.</p></div>
  <div class="model__grid" style="--n:3">
    <div class="model__item"><p class="model__label"><i class="sw sw--loan"></i>Darlehen</p><p class="model__value">400.000<small>€</small></p><span class="model__pre">bis zu 40 %</span></div>
    <div class="model__item"><p class="model__label"><i class="sw sw--grant"></i>Zuschuss</p><p class="model__value">400.000<small>€</small></p><span class="model__pre">bis zu 40 %</span></div>
    <div class="model__item"><p class="model__label"><i class="sw sw--equity"></i>Eigenmittel</p><p class="model__value">200.000<small>€</small></p><span class="model__pre">mindestens 20 %</span></div>
  </div>
  <dl class="model__rows">
    <div class="model__row"><dt>Bearbeitungsentgelte, einmalig</dt><dd>7.000 €</dd></div>
    <div class="model__row model__row--total"><dt>Verwaltungskostenbeitrag p. a., bis zu</dt><dd>2.000 €</dd></div>
  </dl>
  <p class="model__calc"><b>Rechenweg:</b> 1 % von 400.000 € + 0,75 % von 400.000 € = 7.000 €; 0,5 % p. a. auf das Restkapital, sinkt mit der Tilgung. RL Nr. 12.7</p>
</section>

<div class="formula">                                      <!-- --wide: Grenze rechts in eigener Spalte (ab l-span-8) -->
  <div class="formula__row"><span class="formula__op"></span><span class="formula__term">Herstellungskosten (KG 200–700)</span><span class="formula__limit">bis Bemessungsgrenze × m²</span></div>
  <div class="formula__row"><span class="formula__op">+</span><span class="formula__term">Grundstückskosten (KG 100)</span><span class="formula__limit">bis Bodenrichtwert × Fläche</span></div>
  <div class="formula__row formula__row--result"><span class="formula__op">=</span><span class="formula__term">zuwendungsfähige Kosten</span><span class="formula__limit">RL Nr. 5.3.2</span></div>
</div>
```
Jede Zahl der Modellrechnung muss nachrechenbar sein (Rechenweg in `model__calc`); Annahmen im Titel oder als „Annahme: …“ am Diagramm; Stempel immer sichtbar.

**Stempelzeile** (eine Komponente für alle Modellrechnungen, Muster S. 13):

```html
<p class="stampline"><span class="stamp">Modellrechnung</span><span>– fiktives Beispiel, keine Förderzusage</span></p>
```
Immer die **erste Zeile des Modellrechnungs-Moduls** (über dem Titel: S. 7, 11, 16, 17; in der Randspalte der Titelzone: S. 10; rechts neben dem Titel im Diagrammkopf, wenn die Zeile dort Platz hat: S. 13). 8,5 pt, `--fg-2`, ohne Drehung, ohne absolute Positionierung, nie im `h2`. Flex-Zeile: Der Zusatz ist **unteilbar** (`white-space: nowrap`) – passt er nicht neben den Stempel, rückt er geschlossen darunter, nie „– fiktives | Beispiel …“.
In Spalten **unter 70 mm** von vornherein die gestapelte Variante (S. 10 Randspalte, S. 17 Modellkasten), Zusatz ohne Gedankenstrich:
```html
<p class="stampline stampline--stack"><span class="stamp">Modellrechnung</span><span>fiktives Beispiel, keine Förderzusage</span></p>
```
Kicker der Modellrechnungsseite wiederholt „Modellrechnung“ nicht (S. 10: „Programmteil 2.1 · Neubau“). Der Satz „Annahme, keine Förderzusage“ steht damit an der Stempelzeile und wird im Text nicht wiederholt. Achtung: Die Doppelkontur (`outline-offset` 0,7 mm) ragt ≈ 0,8 mm über die Box hinaus.

### 6.13 Fußnoten, Quellen, Hinweise, Begriffe

```html
<p>… bis zu 80 % der zuwendungsfähigen Kosten.<span class="fn">1</span></p>
<ol class="footnotes footnotes--2col l-bottom">              <!-- ein System für alle Seiten: volle Satzspiegelbreite, Haarlinie darüber -->
  <li class="footnotes__src"><b>Fundstellen:</b> RL Nr. 5.3.2, 5.3.3; NBank-Produktinformation …</li>   <!-- seitenweite Quellen: ziffernlos, zuerst -->
  <li>Zuwendungsfähig sind … (RL Nr. 5.3.2).</li>               <!-- nummeriert ab 1 -->
</ol>
<p class="caveat">Höchstwerte&nbsp;· Überkompensationsprüfung&nbsp;· kein&nbsp;Rechtsanspruch <a href="#seite-02">→&nbsp;S.&nbsp;2</a></p>   <!-- Kurzmarke, direkt unter dem Hauptdiagramm/Kachelraster -->
<p class="source"><b>Quelle:</b> RL Mietwohnraum 2026, Nr. 5.3.3 · eigene Berechnung</p>
<p class="stand"><b>Stand: 21.10.2026.</b> Maßgeblich sind die RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319) und die Förderentscheidung.</p>
<p class="note"><b>Alle Förderwerte sind Höchstwerte („bis zu“).</b> Maßgeblich ist die Förderentscheidung der NBank.</p>
<aside class="term"><p class="term__label">Begriff</p><h4 class="term__word">Verwaltungskostenbeitrag</h4><p class="term__text">0,5 % pro Jahr auf das jeweilige Restkapital …</p></aside>
<ol class="toc"><li class="toc__item"><span class="toc__no">01</span><span class="toc__title">Die Zahlen zuerst</span><span class="toc__page">3</span></li></ol>
```
Fußnotenziffern sind **echter Text**: `assemble.cjs` stellt jedem nummerierten `<li>` einer `.footnotes`-Liste `<span class="footnotes__no">N</span>` voran (N zählt je Liste ab 1, `.footnotes__src` zählt nicht) – im Partial nur `<li>Text</li>` schreiben. Kein `counter()`/`::before` (fehlt im Tag-Baum; vorgelesen würde „…2025).1“ ohne zugehörige Fußnote). Vor dem Block mindestens 4 mm Luft (Regel 15).
Fußnoten: **ein System** `.footnotes.footnotes--2col.l-bottom` auf allen Seiten, nie in einer Seitenspalte, kein Run-in. Höchstens 4 Zeilen je Spalte, **nur Quellen und RL-Nummern** – Erläuterungen gehören in den Text (Bullets, Diagrammnotiz, Detailblock). Seitenweite Fundstellen stehen als erste, ziffernlose Zeile `.footnotes__src` („Fundstellen: RL Nr. …“); nummerierte Fußnoten (≤ 3) nur, wo eine Aussage eine eigene Quelle braucht. Ziffern nur im Fließtext, in Tabellenzellen und Bildunterschriften. `.note` (Höchstwert-Hinweis) auf der Kennzahlen- und der Übersichtsseite. `.stand` auf der Rückseite (und optional am Ende von Kapiteln).

`.caveat` (Kurzmarke Standard-Vorbehalt): Inter 8,5 pt / 500, `--fg-3`, Link „→ S. 2“ in Akzent; genau einmal je Seite, fest direkt unter dem Hauptdiagramm bzw. dem Kachelraster (S. 1, 3, 4, 5, 8, 10–17); ausformuliert nur S. 2 (Lesehinweis) und S. 20 (Impressum). Auf den Modellrechnungsseiten zusätzlich die Stempelzeile.

| Zusatz | Wirkung |
|---|---|
| `.footnotes--2col` | zwei Spalten (`column-count`, `orphans/widows: 1`); nummerierte Fußnoten sind monolithisch (`inline-block`), die Fundstellen-Zeile darf von Spalte 1 in Spalte 2 laufen |
| `.footnotes__src` | ziffernlose Fundstellen-Zeile; steht sie allein, läuft sie über die volle Breite; folgen ihr zwei oder mehr nummerierte Fußnoten, ebenfalls volle Breite und die Fußnoten zweispaltig darunter (S. 18) |
| `.imprint` | nie trennen; Absätze mit 1,2 mm Abstand; Spalten über `l-grid` mit ganzen Absätzen, nicht `column-count` (Fundstellen würden zerrissen) |

### 6.14 Titel und Rückseite

```html
<section class="page page--cover" data-page="01">
  <div class="cover__art" data-bleed><!-- assets/titel-illustration.svg (viewBox = ganze Seite) --></div>
  <div class="cover__top">
    <div class="cover__mast"><span><b>Investitions- und Förderbank Niedersachsen – NBank</b></span><span>Stand: Oktober 2026</span></div>
    <p class="kicker cover__kicker">RL Mietwohnraum 2026 · in Kraft seit 1. Juli 2026</p>
    <h1 class="cover__title">Wohnraum,<br>der sich<br><em>rechnet.</em></h1>
    <p class="cover__deck"><strong>Mietwohnraumförderung Niedersachsen 2026:</strong> Konditionen, Kennzahlen und Modellrechnungen.</p>
    <p class="audience cover__audience"><span class="audience__label">Für</span><span class="audience__item">Wohnungsunternehmen</span><span class="audience__item">Genossenschaften</span>…</p>
  </div>
  <div class="cover__band" data-bleed>
    <ol class="cover__programs"><li class="cover__program bs-21"><b>2.1</b>Mietwohnungen in Mehrfamilienhäusern</li>…</ol>
    <div class="titleblock">                                <!-- „Schriftfeld“: Grundlage · Antrag · Bewilligung -->
      <div class="titleblock__cell"><p class="titleblock__label">Grundlage</p><p class="titleblock__value">RdErl. d. MW v. 25.06.2026, Nds. MBl. 2026 Nr. 319</p></div>
      <div class="titleblock__cell"><p class="titleblock__label">Antrag</p><p class="titleblock__value">Wohnraumförderstelle Ihrer Kommune</p></div>
      <div class="titleblock__cell"><p class="titleblock__label">Bewilligung</p><p class="titleblock__value">Investitions- und Förderbank Niedersachsen – NBank</p></div>
    </div>
    <div class="bs-stripes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
  </div>
</section>
```
Die Titelillustration enthält die Beschriftung (`<g class="ill-labels">`: bis zu 40 % Zuschuss / bis zu 40 % Darlehen / mind. 20 % Eigenmittel, Text im SVG 8,8 pt). Ausblenden mit `class="ill-labels-off"` am Container. Sie ist auf einen dreizeiligen Titel und einen zweizeiligen Deck abgestimmt: Labels beginnen bei 155 mm, das Haus steht rechts ab 128 mm. **Kein Logo, keine CI-Nachahmung**, Herausgeberzeile nur als Text.

Rückseite: `.page--back`, darin `.h1` mit `<em>`, `contact--plain` + `contact__tel--xl`, `.checklist`, `assets/haus-diagramm.svg` (Klammer zum Titel, Breite über Container z. B. `.back__art`), `.stand`, `.imprint`, `.bs-strip` (Nummern + Streifen) absolut am Fuß mit `data-bleed` – wie auf dem Titel.
Helle Plakette auf dem dunklen Titel: `.seal` mit `.on-light` und `background: var(--surface)` (S. 1) – Text und Tokens kommen aus dem hellen Scope, die Ziffer bleibt lesbar.

---

## 7 · Assets (`src/assets/`)

Alle SVGs sind **inline-tauglich**: ohne XML-Prolog, ohne IDs (Ausnahme: `deko-schraffur.svg`, ID beim Einbetten umbenennen), Farben über `currentColor` und CSS-Klassen aus `styles.css`. Einbetten: Datei-Inhalt direkt ins HTML kopieren; Größe/Farbe über Klassen.

| Datei | Inhalt | Einsatz / Steuerung |
|---|---|---|
| `titel-illustration.svg` | Haus = gestapeltes Balkendiagramm: 2 Geschosse Eigenmittel (schraffiert), 4 Darlehen, 4 Zuschuss – das oberste Zuschuss-Geschoss mit Gründach und PV schwebt noch am Kran; Isometrie, viewBox = Seite 210 × 297 | nur Titel, in `.cover__art`; Farben `ill-*` (passen sich Hell/Dunkel an) |
| `haus-diagramm.svg` | dasselbe Haus kompakt, ohne Beschriftung, enge viewBox | Rückseite, Kapitelöffner; Breite über Container, Höhe automatisch |
| `pikto-neubau-mfh.svg` · `pikto-eh40-neubau.svg` · `pikto-modernisierung.svg` · `pikto-inseln.svg` · `pikto-bindungserwerb.svg` · `pikto-bindungsverlaengerung.svg` | sechs Fördergegenstände, feine Petrol-Linien-Isometrie, gemeinsame viewBox (gleiche Gebäudegröße) | Klasse `pict` (+ `pict--s/m/l/xl` = 9/14/20/28 mm); Linie = `color`, Akzent = `--pict-accent` (Standard: `--bs` bzw. `--accent`) |
| `pikto-weg-aufstockung.svg` · `pikto-weg-ersterwerb.svg` | Fördertatbestände Änderung/Erweiterung, Ersterwerb (Neubau = `pikto-neubau-mfh`) | `.paths` |
| `zielgruppe-*.svg` (5) | Wohnungsunternehmen, Genossenschaften, Investoren, Projektentwicklung, Kommunen | Zielgruppen-Kacheln (Editorial) |
| `ui-*.svg` (16) | hinweis, achtung, stopp, tipp, frist, kalender, check, kreuz, ausrufe, pfeil, dokument, telefon, mail, web, standort, rechner | Klasse `icon` (+ `icon--s/m/l`), Linie 1,6 im 24er-Raster |
| `deko-isoraster.svg` | Isometrie-Raster (Linien auf viewBox zugeschnitten) | Flächenmuster hinter Titel/Kapitelöffnern; Container mit `position`, `data-bleed`, Farbe über `color` |
| `deko-dachlinie.svg` | Silhouette einer Straßenzeile als Linien-Trenner | volle Satzspiegelbreite, z. B. vor Impressum |
| `deko-schraffur.svg` | `<pattern>` für Eigenmittel | ID eindeutig machen (`schraffur-NN-n`) |

Generatoren (Isometrie, Diagramme) liegen nicht im Repo; die SVGs sind fertig.

---

## 8 · Textmengen je Layout-Typ (Richtwerte für A4, gemessen am Specimen)

Satzspiegel 174 × 261 mm. Gemessene Modulhöhen: Titelblock 26–40 mm · Hero-Kachel 64 mm · Kennzahlen-Reihe (3 Kacheln) 46–58 mm · Kennzahlen-Band 22 mm · gestapeltes Balkendiagramm mit Kopf und Notiz 80–87 mm · Zeitstrahl 52–58 mm · Drittel-Diagramm 65–72 mm · Höchstmieten-Tabelle (2 Zeilen) 60 mm · Ablaufschritt mit Bahnen 24–28 mm (mit Ratenleiste 42 mm) · Callout (Drittel) 30–38 mm · Zitatband 30 mm · Modellrechnung 50–60 mm · Fußnoten 8 mm je Zeilenpaar. Fließtext 9,5 pt: 4,9 mm Zeilenhöhe; ≈ 50 Zeichen je Zeile in `l-span-6`, ≈ 34 Zeichen in `l-span-4`.

| Layout-Typ | Wörter gesamt | Struktur und Grenzen |
|---|---|---|
| **cover** | ≤ 90 | Kicker ≤ 8 Wörter · Titel ≤ 5 Wörter / 3 Zeilen · Deck ≤ 20 Wörter / 2 Zeilen · Zielgruppen-Zeile · 6 Programmteile (≤ 5 Wörter) · Schriftfeld 3 Zellen à ≤ 10 Wörter. Keine Fließtexte. |
| **editorial** | 240–290 | Titelblock + Editorial 100–150 Wörter (2 Spalten, Blocksatz, Initiale) + 1 Zitat ≤ 40 Wörter + Inhaltsverzeichnis/Linienplan + ≤ 4 Zielgruppen-Kacheln à ≤ 25 Wörter |
| **key-figures** | 200–240 | Lead ≤ 25 Wörter · 1 Hero + 6 Kacheln (oder 8 im 4er-Raster mit `kf--s`) · je Kachel: Label ≤ 6 Wörter, Text ≤ 20 Wörter (≤ 4 Zeilen) · 1 Band · `.note` |
| **overview-matrix** | 220–260 | `.table--matrix` mit 6 Zeilen (2.1–2.6) × ≤ 5 Spalten, Zellen ≤ 6 Wörter, oder `.programs` 3 × 2 (Titel + Chip + Seitenverweis ≤ 12 Wörter) · Lead ≤ 30 Wörter · `.note` |
| **program-detail** | 250–280 | Register + Kapitelnummer · Titel ≤ 6 Wörter · Lead ≤ 35 Wörter · Chips · `.paths` (3 × ≤ 10 Wörter) · 1 Diagramm · 2 Bullet-Spalten à ≤ 5 Punkte **oder** 1 Tabelle · 1 Callout **oder** Modellrechnung · Fußnoten ≤ 3 |
| **chart-focus** | 220–280 | Titelblock · 1 Hauptdiagramm (60–110 mm) + max. 2 Nebendiagramme (Drittel) · Notizen ≤ 45 Wörter je Diagramm · Stempel „Modellrechnung“ bei Rechenbeispielen · Rechenweg-Tabelle ≤ 8 Zeilen |
| **table-focus** | 240–285 | Titelblock · 1 Haupttabelle ≤ 8 Zeilen × 5 Spalten (oder 2 Tabellen ≤ 5 Zeilen) · Marginalie (`.term`/`.l-sidebar`) ≤ 60 Wörter · Quellenzeile |
| **process** | 250–285 | Titelblock · `.steps--lanes` mit ≤ 7 Schritten (Text ≤ 3 Zeilen; bei 8 Schritten ≤ 2 Zeilen) + 1 `.gate` · darunter 1 Callout `__split` + `.contact` **oder** Ampel-Tabelle (`.table` mit `.mark`) |
| **faq** | 250–290 | Titelblock · 6–8 Fragen (`.faq--2col`), je Frage ≤ 12, Antwort ≤ 45 Wörter · optional 1 Kontakt- oder Tipp-Kasten |
| **back-cover** | ≤ 270 | Headline ≤ 10 Wörter · 2–3 Kontakte · Checkliste ≤ 10 Einträge · weitere Programme ≤ 30 Wörter · `.stand` · Impressum ≤ 50 Wörter · `.bs-stripes` |

Weitere Typen aus `plan.json`: **table-checklist** = table-focus (Tabelle oben ≤ 6 Zeilen) + Checkliste ≤ 8 Einträge; **decision-tree** = chart-focus mit SVG `fl-*` (≤ 5 Entscheidungsrauten, 6 Ziel-Kacheln `fl-box--bs` mit Nummer; Seitenverweis über der Ziffer, sobald darüber Platz ist); **chart-table** = Diagramm (≤ 90 mm) + Tabelle ≤ 6 Zeilen; **term-sheet** = Zeitstrahl (≤ 50 mm) + `.table--terms` ≤ 12 Zeilen; **timeline** = Zeitstrahl volle Breite + Vergleichstabelle ≤ 5 Zeilen + Checkliste; **infographic** = chart-focus mit nummerierter Leiter (`.bullets--num`/`.steps`) und Ring.

Obergrenze für Innenseiten: **rund 420 Wörter** (Term Sheet S. 9 ausgenommen), davon der Großteil in Modultext 9 pt.
Passt etwas nicht: zuerst Redundanz streichen (Vorbehalt → Kurzmarke, Fortschreibung → S. 8, Vorhabenbeginn → S. 19, Konditionen 2.1 → S. 9, Kosten des Modellhauses → S. 11, doppelte Kalkulationsnotiz → Chip), dann Modul verkleinern (`kf--s`, `.chart--s`, `.table--compact`) – nie Zahlen, Bedingungen oder Quellen streichen (Fußnoten-Erläuterungen wandern in den Text), nie unter 8,5 pt gehen, nie Abstände unter die Token-Werte drücken.

---

## 9 · QA vor Abgabe einer Seite

- Render-Skript ohne `OVERFLOW`- und `LASTLINE`-Zeilen; PDF-Seitenzahl = Anzahl `.page`.
- PNG ansehen: nichts klebt an Linien (≥ 2 mm), Module enden ≥ 6 mm über der Fußlinie, keine Hurenkinder/Schusterjungen in Kacheln.
- Mindestens 4 mm Luft zwischen letzter Textzeile/Kastenkante und Fundstellenlinie.
- Kein Umbruch in Rechtszitaten („§ 7 | Abs. 3“, „RL | Nr.“, „DVO- | NWoFG“) und Stempelzeilen.
- PDF/UA-Grundlagen: keine Mal-Operatoren außerhalb von Marked Content (Lauf meldet „Artefakte: … markiert“); Fußnotenziffern und „Vordruck“ im Textlayer und getaggt; jeder BaseFont-Name genau ein Fontprogramm; jede Link-Annotation mit `/Contents` (Lauf meldet „Link-Namen (/Contents): N/N“). **PDF/UA-Kennung** (`pdfuaid:part 1` im XMP, nur Bildschirm-PDF) setzt `render.cjs` nur, wenn die Vorprüfung nichts findet – sonst Zeilen `PDFUA:` (Link ohne Namen, Link in `role="img"`/`aria-hidden`, Sprung der Überschriftenebene, z. B. h1 → h3) und „Kennung NICHT gesetzt“. Abnahme extern mit veraPDF (PDF/UA-1) oder PAC 2024.
- Nur Fraunces und Inter im PDF, **nur CID TrueType, kein Type 3** (`pdffonts dist/…pdf`; Ursache für Type 3 wäre eine fehlende statische Instanz – Lauf meldet `FONT:` – oder gestrichener Text).
- `pdfinfo`: `Tagged: yes`, Seitenzahl = Anzahl `.page`; Lesezeichen je Seite „S. N · Titel“ (aus der `h1`, ohne Fußnotenziffern und Trennstriche), `h2` als Unterpunkte; Metadaten (Titel, Autor NBank, Thema, Stichwörter, Sprache de-DE, XMP) setzt `render.cjs` per pdf-lib.
- Textlayer prüfen: `pdftotext` liefert Versal-Labels ohne weiche Trennstriche („EDITORIAL“, „STICHTAG“, „MODELLRECHNUNG“), keine ungenutzten U+00AD, Pfeile als echte Zeichen.
- Inter-Teilmenge ohne `cv05`/`ss02`: „l“ und „I“ sind gleich (WoFlV, BGBl.) – nicht per CSS lösbar.
- Kein Text < 8,5 pt (auch SVG), kein Text < 5 mm vom Endformat.
- Alle Quoten „bis zu“, Zuschuss 2.1 „nur zusammen mit dem Darlehen“, Kosten (0,5 % p. a., 1 % / 0,75 %) bei der Kennzahl, Bemessungsgrenzen als Ausgangswerte mit Fortschreibungshinweis.
- Diagramme: Proportionen aus Daten, direkt beschriftet, `aria-label` vollständig.

**Druckvorstufe:** Beim Gesamtlauf (`--in src/index.html`) erzeugt `render.cjs` neben dem Bildschirm-PDF (A4, ohne Beschnitt) ein **Druck-PDF** `dist/…-Druck-3mm-Beschnitt.pdf` (Abschalten: `--no-print`, Pfad: `--print-pdf`): Bogen 216 × 303 mm (auf 1/100 Zoll aufgerundet), jede Seite in einem Bogen-Rahmen in Seitenfarbe, `[data-bleed]`-Flächen (Titelbild, Register, Streifen) um 3 mm über das Endformat verlängert; TrimBox = 210 × 297 mm, BleedBox/CropBox = Bogen. Offen bleibt die Konvertierung nach PDF/X-4 durch die Druckerei mit dem ICC-Profil des Papiers (Naturpapier z. B. PSO Uncoated v3 FOGRA52; Proof der feinen Fraunces-Haarstriche und des Sand-Bands), RGB-Tokens → CMYK.
