# PGN – Corporate-Design-Analyse (aus CSS, SVG und Bildern der Website)

Quellen:
- https://www.pgn-architekten.de/templates/klar/css/template.min.css?1750163062 (identisch mit ../template.min.css)
- https://www.pgn-architekten.de/templates/klar/css/bootstrap.min.css (angepasstes Bootstrap-Theme)
- die SVG-Dateien in assets/
- HTML der Startseite

Ein offizielles CD-Manual, CMYK-, Pantone- oder RAL-Werte stehen **nicht** auf der Website. Alle Farbangaben unten sind Bildschirm-Werte (sRGB, HEX). Die Druckfarben sollte man bei PGN oder der Agentur „klar Werbeagentur GmbH“ (laut Impressum verantwortlich für das Design der Website) erfragen.

## 1. Farben

| Rolle | HEX | Belegte Verwendung | Belege |
|---|---|---|---|
| **Primär / PGN-Rot** | **#B71E3F** | Logo-Wortmarke (logo-rot.svg), Favicon-Grund, `meta theme-color`, mask-icon-Farbe. Bootstrap `--bs-primary`. Links (`a`), `.text-red`, Primär-Button, Akzentlinien, Hover in Navigation und Footer, Chronik-Slider, Fokus-Ringe. Die Werte-Sektion „Für Sie denken wir an:“ liegt auf einem roten Verlauf. | template.min.css (43 Vorkommen), bootstrap.min.css, logo-rot.svg, favicon.svg |
| Dunkelrot (Verlaufsende) | **#8B2939** (im Favicon #8A2939) | Endfarbe aller roten Verläufe: `linear-gradient(160deg, #B71E3F 0%, #8B2939 100%)` für Buttons und Flächen, `to bottom` für Sektionen und Overlays. Bootstrap `--bs-danger`. | template.min.css, favicon.svg |
| **Text / Anthrazit** | **#3C3C3B** | Fließtext (`body{color:#3c3c3b}`), Seitentitel, Sekundär-Button (Verlauf #3C3C3B → #202020), Hover-Farbe für Links, Rahmenlinien, Formular-Rahmen. Bootstrap `--bs-dark`. In den Icon-SVGs als Farbklasse definiert. | template.min.css (28 Vorkommen) |
| Fast-Schwarz | **#202020** | Navigationsleiste (linker dunkler Teil), Hintergrund und Bildunterschrift des Start-Sliders, Bild-Overlay „transparent → #202020“, Formulartext | template.min.css |
| Mittelgrau | **#757474** | Footer-Text und Footer-Links, aktiver Menüpunkt, gestrichelte Trennlinien im Dropdown, Platzhaltertext. Bootstrap `--bs-secondary`. | template.min.css, bootstrap.min.css |
| Logo-Grau | **#868686** | Unterzeile im Logo („ARCHITEKTEN STADTPLANER INGENIEURE“ bzw. „PROJEKTIEREN …“). Als Farbklasse in den Icon-SVGs. | logo-rot.svg, logo-gruen.svg, Icons |
| **Fläche / warmes Hellgrau** | **#F4F3F2** | Seitenkopf (`#pagehead`), Footer-Hintergrund, Dropdown-Menü, Akkordeon, Hintergrund der Leistungs-Panels. Bootstrap `--bs-light`. | template.min.css (17 Vorkommen) |
| Weiß | #FFFFFF | Text auf Rot und Dunkel, weißer Rand unter der Navigation (20 px), weiße Trennlinien im Werte-Raster, Werte-Icons | template.min.css |
| **Sekundär / PGN-Grün** | **#26772B** | **Farbe der PGN Projektgesellschaft Nord GmbH:** logo-gruen.svg, Überschrift „Projektentwicklung“ (`.text-green`), grünes Overlay mit Verlauf #26772B → #3C3C3B (`.green-overlay`, `.grad-green-tb`), grünes Low-Poly-Ornament. Bootstrap `--bs-success`. | template.min.css, bootstrap.min.css, logo-gruen.svg |
| Nebenwerte | #F8F9FA (Hover im Dropdown), rgba(194,64,92,.5) (Fokus-Schatten) | technische UI-Zustände, für Print nicht relevant | template.min.css |

### Hover- und Zustandslogik
Rot und Anthrazit tauschen beim Hover die Rollen:
- `.btn-primary`: roter Verlauf, beim Hover anthrazitfarbener Verlauf (#3C3C3B → #202020).
- `.btn-secondary`: anthrazitfarbener Verlauf, beim Hover roter Verlauf.
- Links: Rot, beim Hover Anthrazit. Footer-Links: Grau #757474, beim Hover Rot.
- `.btn-light:hover`: Hintergrund #3C3C3B mit weißer Schrift.

### Verläufe (aus dem CSS)
- `grad-rot-diag`: 160°, #B71E3F → #8B2939 (Buttons, rote Flächen)
- `grad-rot-tb`: von oben nach unten, #B71E3F → #8B2939 (Werte-Sektion)
- `grad-grau-diag`: 160°, #3C3C3B → #202020
- `grad-green-tb`: #26772B → #3C3C3B
- `grad-primary-lr` / `-tb`: #F4F3F2 → #B71E3F
- Slider-Overlay: transparent bis 50 %, dann → #202020

### Kontraste (WCAG, berechnet)
| Kombination | Kontrast |
|---|---|
| Weiß auf #B71E3F | 6,4 : 1 |
| Weiß auf #8B2939 | 8,5 : 1 |
| Weiß auf #26772B | 5,6 : 1 |
| #3C3C3B auf #F4F3F2 | 10,0 : 1 |
| #B71E3F auf Weiß | 6,4 : 1 |
| #757474 auf #F4F3F2 | 4,2 : 1 (für Fließtext knapp, nur als Auszeichnung verwenden) |
| #868686 auf Weiß | 3,6 : 1 (nur für große Schrift, wie im Logo) |

## 2. Schriften

Beide Schriften sind selbst gehostet (`/templates/klar/webfonts/`) und werden per `@font-face` eingebunden. Montserrat und Work Sans sind Open-Source-Schriften von Google Fonts unter der SIL Open Font License. Das ist allgemeines Wissen und steht nicht auf der Website.

| Schrift | Eingebundene Schnitte | Verwendung |
|---|---|---|
| **Montserrat** (v15) | 300 Light, 500 Medium, 600 SemiBold, 700 Bold, **800 ExtraBold Italic**, 900 Black | Alle Überschriften, Navigation, Buttons, Lead-Texte, Display-Zeilen |
| **Work Sans** (v9) | 400 Regular, 400 Italic, 700 Bold, 700 Bold Italic | Fließtext (`body`) |

### Typo-Hierarchie (aus dem CSS)
| Element | Schrift / Schnitt | Weitere Eigenschaften |
|---|---|---|
| h1–h6 (Basis) | Montserrat 700, **Versalien** | Zeilenhöhe 1,2 |
| h1, h2, h3, h4 | **Montserrat 900 Black**, Versalien | h1 2,2 rem, h2 2 rem, h3 1,75 rem, h4 1,5 rem |
| Werte-Titel („Verantwortung.“) und andere h4 in UIkit-Modulen | Montserrat 700, Versalien | – |
| Display-Zeilen (`.display-1` … `-4`) | Montserrat 900, Versalien | Hervorhebung `span.highlight` in **Montserrat 800 Italic in PGN-Rot**, z. B. „VORAUS*denken*“ |
| `.lead` (Unterzeilen, Dachzeilen) | Montserrat 600, Versalien | 1,06 rem; Dachzeilen auf Presse-Kacheln in Rot |
| Buttons | Montserrat 500, Versalien | 0,85 rem, eckig |
| Navigation | Montserrat 700, Versalien | Laufweite 0,25 px |
| Dropdown | Montserrat 600 | Laufweite 0,25 px |
| Slider-Unterzeile | **Montserrat 300 Light, Versalien** | 1,1 rem |
| Fließtext | **Work Sans 400** | 1 rem (1,06 rem ab großen Viewports), Zeilenhöhe 1,5, Farbe #3C3C3B |
| fett im Text | Work Sans 700 | – |

Die Unterzeile im Logo ist in Pfade umgewandelt. Optisch ist es eine geometrische Grotesk in Versalien, leicht und weit gesperrt, sehr ähnlich zu Montserrat Light/Regular. **[UNSICHER]**: Die Schrift ist im SVG nicht benannt.

## 3. Logo-System
- **Rot (#B71E3F) mit grauer Unterzeile „ARCHITEKTEN / STADTPLANER / INGENIEURE“:** Planungsgemeinschaft Nord GmbH, das Hauptlogo.
- **Grün (#26772B) mit Unterzeile „PROJEKTIEREN / ENTWICKELN / ERSCHLIESSEN“:** PGN Projektgesellschaft Nord GmbH.
- **Weiß, nur „PGN“:** Negativ-Variante für rote oder dunkle Flächen (auf dem Server vorhanden, auf keiner Seite eingebunden).
- **Favicon:** weißes „PGN“ auf rotem Quadrat mit Verlauf. Das dient zugleich als Signet und App-Icon.
- Aufbau: kräftige, rechteckig-geometrische Wortmarke „PGN“ (eckige Buchstaben, G mit horizontalem Querbalken), ein dünner senkrechter Haarstrich, rechts die dreizeilige Unterzeile, oben und unten bündig mit der Wortmarke.
- Mindestgrößen und Schutzzonen sind auf der Website **nicht dokumentiert**. Im Web ist das Logo 250 px breit, im Leistungs-Panel maximal 260 px.

## 4. Gestaltungsmuster

1. **Versalien überall in den Überschriften.** Headlines, Buttons, Navigation, Lead-Zeilen und Akkordeon-Titel stehen in Großbuchstaben. Dazu kommt ein starker Kontrast zwischen Montserrat Black (900) und dem ruhigen Work-Sans-Fließtext.
2. **Senkrechte Akzentlinien links.** Seitentitel tragen `border-left: 2px solid #B71E3F` mit 1,5 rem Abstand. Die Slider-Bildunterschrift hat `border-left: 1px solid #B71E3F`, die Leistungs-Panels `border-left: 2px solid #3C3C3B`. Das ist das wiederkehrende Ordnungselement. Es spiegelt den Haarstrich im Logo.
3. **Feine Trennlinien.** Im Werte-Raster stehen weiße 1-px-Linien zwischen den Spalten, im Menü gestrichelte graue Linien (#757474) und auf großen Viewports anthrazitfarbene vertikale Spaltenlinien (`.border-xl-end`).
4. **Keine Rundungen.** `border-radius: 0` gilt für Buttons und Formulare. Die Formensprache ist architektonisch und eckig. Schatten werden kaum eingesetzt.
5. **Diagonale Verläufe (160°)** statt flacher Farbflächen, bei Rot und bei Anthrazit.
6. **Low-Poly-Facetten.** Ein rot bzw. grün facettiertes Dreiecksornament ragt von rechts oben in hellgraue Flächen (bg-leistungen-red.jpg / -green.jpg). Rot steht für die Planung, Grün für die Projektentwicklung.
7. **Dunkler Modellhintergrund.** bg-modelldark.jpg ist ein stark abgedunkeltes Architekturmodell und dient als Hintergrund der Karriere-Sektionen.
8. **Sprachmuster:**
   - Drei-Wort-Claims mit Punkten: „Individuell. Originell. Kostensicher.“, „Effizient. Komfortabel. Abgestimmt.“, „Konstruktiv. Sicher. Statisch.“, „Kalkulieren. Überblicken. Kommunizieren.“, „Umweltverträglich. Modern. Termintreu.“
   - Werte als Einzelwörter mit Punkt: „Verantwortung.“
   - Zweizeilige Leitsätze: „Menschlich sein. / Menschlich bleiben.“
   - Wortspiel „[Voraus | Mit | Nach | Um | Weiter] denken“.
   - Kunden werden gesiezt, Bewerber geduzt, mit norddeutschem Humor („Schietwetter“, „PGN-rote Gummistiefel“).
9. **Icons:** dünne, gleichmäßige Linienicons in Weiß auf Rot (Stoppuhr, Schild mit Haken, Raute mit Pfeilen, Handschlag), 140 px groß und zentriert. In der Kopfzeile kommen Font-Awesome-Symbole hinzu.

## 5. Bildsprache
- **Panoramaformat 1800 × 740 px** (≈ 2,43 : 1) für Header- und Projektbilder. Thumbnails haben 4 : 3 oder 16 : 9.
- **Wohnungsbau:** fast nur fotorealistische Visualisierungen. Typisch sind norddeutsche Klinkerbauten (rotbunt, gelb oder sandfarben), oft mit hellem Staffelgeschoss oder Zinkgauben, dazu blauer Himmel, gepflegter Rasen, Laubbäume, Passanten, Familien und Autos. Die Perspektive ist meist eine Übereck-Ansicht auf Augenhöhe, bei Quartieren die Vogelperspektive. Echte Fotos fertiger Gebäude gibt es nur wenige (Hemphöfen, Kiefernweg).
- **People- und Office-Fotografie** (Slider, Moods): warme Holzparkett-Böden, Glas, geringe Schärfentiefe, Bewegungsunschärfe am Empfang, natürliche Lichtstimmung. Rote PGN-Requisiten setzen Markenakzente: PGN-Zollstock, Bürohund, rote Bauplane auf der Baustelle.
- **Technik und Modelle:** weiße 3D-Druck-Modelle, Hände in schwarzen Handschuhen, Drohne im Gegenlicht, AR auf dem Smartphone über einem Grundriss.
- **Handzeichnung:** aquarellierte Vogelperspektiven-Skizze eines Wohnquartiers (moods/aquarell.jpg). Das passt zu „Von der Handskizze über den Modellbau bis zur High-End 3D-Animation“.
- **Overlays:** Auf Slider-Bildern liegt ein Verlauf nach #202020 als Lesegrund für weiße Schrift. Leistungsseiten nutzen ein rotes bzw. grünes Verlaufs-Overlay (`.red-overlay`, `.green-overlay`).

## 6. Ableitung für die Broschüre (Vorschlag, nicht von PGN vorgegeben)
- Grundfläche Weiß oder #F4F3F2. Text #3C3C3B in Work Sans. Überschriften in Montserrat Black, Versalien.
- PGN-Rot #B71E3F (Verlauf nach #8B2939) für Titelflächen, Akzentlinien und Zahlen. Grün #26772B **nur**, wenn die PGN Projektgesellschaft (Generalübernehmer, schlüsselfertig) gemeint ist.
- Eine senkrechte rote 2-pt-Linie links neben Kapiteltiteln, angelehnt an `#pagehead .headline`.
- Die vier Werte-Icons weiß auf rotem Verlauf in einer Viererreihe mit weißen Trennlinien, wie auf der Startseite.
- CMYK-Werte für #B71E3F und #26772B **bei PGN oder der Agentur erfragen**. Eine automatische Umrechnung würde vom Hausrot abweichen.
