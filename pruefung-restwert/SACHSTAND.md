# Prüfung Restwert und Ertragswert: Sachstand für die Prüfer

Stand 16.11.2026. Gegenstand: der Gebäuderestwert Ende Jahr 35 in der Modellrechnung der PGN (Rechenmappe
`vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx`, erzeugt von `vofi/build_vofi.py` und `vofi/build_kennzahlen.py`) und seine
Darstellung in Broschüre (S. 10 bis 12 = Bogenseiten, gedruckt 9 bis 11) und Vortrag (Folien 19 bis 22, 26, A4).
Die Broschüre soll an den Leiter Wohnimmobilienkredite der NBank gehen. Der Restwert trägt 78 % des Endvermögens in
Gruppe A; er muss fachlich halten.

## 1. Modellhaus (Projekt 2 der Mappe)

14 Wohnungen, 828 m², Neu Wulmstorf (Landkreis Harburg, Mietenstufe VI, angespannter Wohnungsmarkt laut Nds.
Mieterschutzverordnung), Effizienzhaus 55, Herstellungskosten 3.579 €/m² = 2.963.412 €, Grundstück im Bestand und mit 0 €
angesetzt (Verkehrswert 731.325 €, 1.362 m², nicht angesetzt), Bezug 2027, Bindung 35 Jahre.
Gefördert Gruppe A: Zuschuss 40 %, NBank-Darlehen 40 % (0 % Zins bis Jahr 35, Tilgung 2,38 % linear, 0,5 %
Verwaltungskostenbeitrag), Eigenkapital 20 % + Bearbeitungsentgelte (613.426 €). Höchstmiete 6,80 €/m², drei Jahre fest,
dann +6,15 % je drei Jahre. Frei finanziert: Bankdarlehen 80 % zu 3,86 %, Annuität über 30 Jahre, Marktmiete 15,42 €/m²
(+2 % p. a.), Eigenkapital 592.682 €.

## 2. Rechenweg des Restwerts (Blatt „Gefördert A“, Zeilen 118 bis 129; „Frei finanziert“ gleich aufgebaut)

Spalten H = Bezug, I = Jahr 35, J = Jahr 42. Zeitreihe in den Zeilen 7 bis 86 (t = 1 bis 80).

| Zeile | Größe | Formel (Spalte I) | Wert Jahr 35 (A) |
|---|---|---|---|
| 118 | Stichjahr s | `=Bindung` | 35 |
| 119 | Restnutzungsdauer | `=GND-I118` (GND = 80 Jahre, „ImmoWertV Anlage 1“) | 45 |
| 120 | Liegenschaftszins | lineare Interpolation in Tabelle 4 (Blatt Tabellen) nach Restnutzungsdauer + Eingabe 9.3 | 2,80 % |
| 121 | Bodenwert | `=Grundstueck*(1+Bodenwertsteigerung)^I118` (Grundstück 0, Steigerung 1,5 %) | 0 |
| 122 | Ertragswert zur Zielmiete | wie 123, mit Spalte X statt K | 6.762.295 € |
| 123 | Ertragswert zur Bestandsmiete | `=SUMPRODUCT((A7:A86>s)*(A7:A86<=GND)*K7:K86/((1+Mietsteigerung)^(A7:A86-s-1)*(1+LZ)^(A7:A86-s)))+Bodenwert/(1+LZ)^RND` | 5.152.780 € |
| 125 | Gebäudeanteil | `=I123-I121` | 5.152.780 € |
| 126 | Restwert (Boden + Gebäude) | `=(I121+Stress_GebRW*I125)*(1-Veraeusserungskosten)` (Faktor 1, Kosten 0 %) | 5.152.780 € |

Tabelle 4 (Liegenschaftszins Projekt 2, Quelle laut Mappe „Gutachterausschuss Nds., Landesmodell MFH 01.01.2026“, Neu
Wulmstorf, Bodenrichtwert 600 €/m²): RND 30 → 2,5 % · 38 → 2,7 % · 40 → 2,7 % · 50 → 2,9 % · 60 → 3,0 % · 70 → 3,1 %.
Fußnote für Projekt 1 nennt eine Streubreite ±1,2 Prozentpunkte. Der Zins ist der von heute und wird in Jahr 35 (also 2062)
auf die dann verbleibende Restnutzungsdauer von 45 Jahren angewandt.

Zeitreihe je Jahr t (Blatt „Gefördert A“):
- C Vergleichsmiete = 12,92 €/m² × 1,02^(t−1) (Mietübersicht 2022 fortgeschrieben), D Marktmiete = 15,42 × 1,02^(t−1)
  (Gutachterausschuss Lüneburg, Mietübersicht Landkreis Harburg, Hamburger Umland, **Baualter ab 2023**, 40 bis 60 m²,
  Stand 01.01.2026), E Zielmiete = Marktmiete (Eingabe 8.2).
- F gerechnete Miete: in der Bindung (bis Jahr 35) Höchstmiete mit +6,15 % je drei Jahre; danach alle drei Jahre
  +20 % (Eingabe 4.6 „Kappungsgrenze nach Bindungsende“, Quelle „§ 558 Abs. 3 BGB“), gedeckelt bis Jahr 42 auf die
  Vergleichsmiete, ab Jahr 43 auf die Zielmiete (= Marktmiete). Werte: Jahr 35: 13,11 €; Jahr 37: 15,73 €;
  Jahr 42: 18,88 €; Marktmiete Jahr 36: 30,84 €.
- K Überschuss vor Kapitaldienst = Sollmiete − 2 % Mietausfall − Objektverwaltung (367 €/Wohnung, +2 % p. a.) −
  Instandhaltung (14,40 €/m², +2 % p. a.). Betriebskosten voll umgelegt. Keine Modernisierung, keine Ersatzinvestition.
- X Überschuss zur Zielmiete = Zielmiete × Fläche × 12 × 0,98 − Verwaltung − Instandhaltung.

Der Ertragswert in Jahr s summiert also die Überschüsse der Jahre s+1 bis 80, jeden geteilt durch
(1+Mietsteigerung)^(t−s−1) (Preisstand des Jahres s+1) und abgezinst mit dem Liegenschaftszins über t−s Jahre.
Das Ergebnis steht in Preisen des Jahres 36 (nominal, 35 Jahre × 2 % Mietsteigerung eingerechnet).

Frei finanziert: Restwert Jahr 35 = Ertragswert zur Marktmiete = 6.762.295 €.
Zum Vergleich bei Bezug (Spalte H): Ertragswert zur Marktmiete 3.919.829 € (+32,3 % gegenüber den Gesamtkosten ohne
Grundstück), zur Bestandsmiete A 1.847.412 € (−37,7 %).

## 3. Wie der Restwert in die Rendite eingeht (Zeilen 143 bis 149; Blatt Kennzahlen 74 bis 85)

Endvermögen Jahr 35 = Projektkonto (VOFI, Überschüsse mit 2 % Habenzins angelegt, Fehlbeträge 5 % Sollzins) + Restwert −
Restschuld. VOFI-EK-Rendite = (Endvermögen ÷ Eigenkapital)^(1/35) − 1. Vor Steuern, keine Veräußerungskosten.

| Jahr 35 | Gefördert A | Frei finanziert (Marktmiete) |
|---|---|---|
| Projektkonto | 1.692.071 € | 3.096.026 € |
| Restwert | 5.152.780 € | 6.762.295 € |
| Restschuld | 197.561 € | 0 € |
| Endvermögen | 6.647.289 € | 9.858.321 € |
| Eigenkapital bei Bezug | 613.426 € | 592.682 € |
| VOFI-EK-Rendite mit Restwert | 7,05 % | 8,36 % |
| VOFI-EK-Rendite ohne Restwert | 2,58 % | 4,84 % |
| Restwertanteil am Endvermögen | 78 % | 69 % |
| EK-IRR mit / ohne Restwert | 8,22 % / 3,13 % | 9,43 % / 6,11 % |

Blatt „NBank“ (intern): Orientierungswert der Überkompensationsprüfung = Swapsatz 30 Jahre 3,39 % (Stand 19.08.2026) +
1 Prozentpunkt = 4,39 % (RL Nr. 11.10 Abs. 4). 7,05 % liegt darüber, 2,58 % darunter.

## 4. Was Broschüre und Vortrag sagen

- Broschüre Bogen 10 (`broschuere/src/pages/10-modellhaus-finanzierung.html`), Annahmen: „Restwert Ende Jahr 35:
  Ertragswert aus der Marktmiete | wie gefördert“.
- Bogen 12 (`12-35-jahre.html`): H1 „Über 35 Jahre kein Jahr mit Fehlbetrag – Eigenkapitalrendite 7,05 % in A“;
  Säulen 7,05 | 2,58 % (A) und 8,36 | 4,84 % (frei finanziert), Notiz „Vor Steuern. Frei finanziert rechnerisch, bei
  einer DSCR von 0,99; so gibt die Bank das Darlehen nicht“; Tabelle „Vermögen Ende Jahr 35 in Tsd. €“ (Projektkonto,
  + Restwert, − Restschuld, = Vermögen; Anteil des Restwerts 78 % | 69 %); Annahme „Ohne Mietanpassung … sinkt dann auf
  5,08 %“.
- Vortrag Folie 21 (`praesentation/folien/rechnung-rendite.cjs`), Anhang A4 (`anhang-annahmen.cjs`): Zeile Restwert mit
  Quelle Gutachterausschuss/Landesmodell. Quellentabelle Broschüre Bogen 23.
- Die Inhalte je Seite stehen in `broschuere/content/pages/1[012]-*.json`, je Folie in `praesentation/daten/outline.json`.

## 5. Dateien und Werkzeuge

- Generator: `vofi/build_vofi.py` (Restwert: Zeilen 808 bis 833; Renditen 890 bis 920; Tabelle 4: 476 bis 490;
  Eingaben 300 bis 400), `vofi/build_kennzahlen.py`. Konzept: `vofi/KONZEPT-v3.md` (Abschnitte D.3, Q, R), Annahmen
  `vofi/ANNAHMEN.md`, Referenzrechnung in `vofi/pruefe_vofi.py` (Klasse `Soll`, Methoden `restwert`, `a2_greift`).
- Frühere Prüfung der Kalkulation: `pruefung-beispielkalkulation/` (drei Prüfberichte, `Auswertung.md`).
  Kennzahlenkonzept der Vorgängermappe: `broschuere/zulieferungen/vofi-pruefung/kennzahlen-konzept.md`.
- Quellen im Projekt: `broschuere/recherche/quellen/` (u. a. Mietwertgrundlagen 2026 mit der Tabelle des
  Gutachterausschusses für den Landkreis Harburg, Mietübersicht 2022, NBank-Produktinformationen),
  `broschuere/recherche/factbase.md` (RL Mietwohnraum 2026, NWoFG, DVO-NWoFG; Suchbegriffe „11.10“, „Überkompensation“,
  „Swap“, „Bindung“).
- Python mit openpyxl: `/tmp/claude-0/-home-user-NBank/38410f5d-55fd-52ad-a777-dfea55772146/scratchpad/venv/bin/python`.
  Neu berechnen einer Kopie der Mappe (LibreOffice):
  `…/venv/bin/python /root/.claude/skills/synced/d3ee7d9e-3f80-4516-b552-1e1c8f6a1a0c_1f3a70d5-7acd-4ad5-8e28-7b168d5d5595/xlsx/scripts/recalc.py KOPIE.xlsx 120`
  (Eingaben stehen im Blatt „Eingaben“, Spalte F = aktives Projekt wird per Formel aus D/E gezogen; Werte für Projekt 2
  in Spalte E ändern; Namen der Eingaben in `build_vofi.py`). Werte lesen mit `openpyxl.load_workbook(…, data_only=True)`.
- Arbeitsordner für eigene Skripte und Kopien: `/tmp/claude-0/-home-user-NBank/38410f5d-55fd-52ad-a777-dfea55772146/scratchpad/pr/<eigener Unterordner>`.

## 6. Regeln für alle Prüfer

- Im Repository nichts ändern. Kopien und Skripte nur im Arbeitsordner.
- Nichts schätzen und als Tatsache ausgeben. Jede Rechtsaussage mit Fundstelle (Norm, Paragraf, Absatz, Stand) und,
  wenn aus dem Netz gelesen, mit URL. Was nicht an der Quelle gelesen wurde, als „nicht nachgelesen“ kennzeichnen.
- Jede Zahl nachrechnen oder ihre Zelle nennen.
- Keine personenbezogenen Daten oder Projektinterna in Suchanfragen (Suchbegriffe allgemein halten: Normen, Verfahren,
  Ortsname ist in Ordnung).
