# Konzept Team 3 „Vergleich“: ein Haus, vier Varianten

Stand 14.11.2026. Rolle: Inhalt (Zahlenwerk, Didaktik). Vortrag, Broschüre und Rechenmappe bleiben unverändert; dies ist ein Konzept.

Zahlen: jede Zahl mit Blatt und Zelle. Kurzform in diesem Text: `K` = Blatt Konzepte, `KZ` = Blatt Konzepte Zeitreihe,
`T3` = Blatt Team 3 Vergleich der Team-Mappe, `Ü` = Übersicht, `E` = Eingaben, `Tab` = Tabellen. Spalten auf `K` und `T3`:
D = A, E = B, F = C, G = frei zur Marktmiete, H = frei zur Miete für DSCR 1,2. Die vollständige Liste mit Wert, Rundung und Zelle
steht in `ZAHLEN.md` (erzeugt aus den beiden JSON-Dateien). Szenario-Läufe: `laeufe/<lauf>.xlsx`, Blatt Konzepte, gleiche Zellen.

## 1 Leitidee

Dasselbe Haus steht auf jeder Folie viermal nebeneinander, immer in derselben Reihenfolge A, B, C, frei finanziert, im selben Maßstab
und mit denselben Merkmalen. Frei finanziert erscheint dabei stets mit zwei Mieten, der Miete für DSCR 1,2 (18,36 €) und der Marktmiete
(15,42 €), damit jede Stärke der freien Finanzierung sofort neben ihrer Bedingung steht.

### Vergleichsraster (gilt für alle Folien des Kapitels)

| Regel | Umsetzung |
|---|---|
| Reihenfolge | A, B, C, Frei 18,36 €, Frei 15,42 €. Nie umsortieren, auch nicht nach Größe. |
| Zwei Mieten frei finanziert | Frei 18,36 € = Miete für DSCR 1,2 (gerechnet, Annahme der PGN). Frei 15,42 € = Marktmiete (Quelle). Beide stehen auf jeder Folie mit einer frei finanzierten Zahl, als Säule, Linie oder Marke. Fester Legendentext: „Frei 18,36 €: Miete für DSCR 1,2 · Frei 15,42 €: Marktmiete“. |
| Zeichen | A, B, C in Tinte mit Strichart und Kreisbuchstabe wie heute auf Folie 21. Frei in Grau wie heute auf Folie 16 und 19; 18,36 € voll, 15,42 € als Kontur bzw. gestrichelt. Rot bleibt Signal. |
| Maßstab | Eine Achse für alle Varianten. Keine zweite Achse, keine Achsbrüche. |
| Wörter | „Miete für DSCR 1,2“ (nicht „nötige Miete“; G4 belegt „kostendeckende Anfangsmiete“ für Zahlungsüberschuss null). „Zahlungsüberschuss“, „Fehlbetrag“, „Projektkonto“, „Überschuss vor Kapitaldienst“, „Kapitaldienst“, „eingesetztes Eigenkapital“, „Objektrendite“, „Eigenkapitalrendite“, „Restwert“. „Gruppe A“ statt „gefördert A“, wo Platz ist. |
| Frei liegt vorn | Jede Folie, auf der frei finanziert eine Kennzahl anführt, nennt im Hinweiskasten die Bedingung (18,36 € liegen 19,1 % über dem Markt, Mietanpassung +2 % p. a.) und das Risiko aus den Läufen N6. |

## 2 Folienfolge Kapitel 3

Hauptteil 12 Folien (13 bis 24, wie heute), danach Umsetzung 25 bis 27, **Fazit 28**, Kontakt 29. Anhang: A0 bis A5 unverändert,
A6 bis A11 neu, Quellen A12. Alle Titel sind mit der Schriftmetrik des Vortrags gemessen (Montserrat Black, 32 pt, höchstens 11,6 Zoll je
Zeile; Anhang 22 pt, 12,0 Zoll).

### 2.1 Hauptteil

**13 · Trenner** (Layout PGN_ABSCHNITT_ROT). Titel bleibt (F13.1): „Modellrechnung: | 14 Wohnungen, gefördert | und frei finanziert“.
Vorspann neu: „Dasselbe Haus in vier Varianten: gefördert in den Gruppen A, B und C und frei finanziert. Jede Folie zeigt alle vier
nebeneinander.“ Daten: 14 Wohnungen `E!F9`, 828 m² `E!F8`.

**14 · Varianten** (PGN_INHALT_MR, Kicker MODELLRECHNUNG · VARIANTEN)
- Titel: „Jede Variante kostet 3,0 Mio. € und | bindet rund 0,6 Mio. € Eigenkapital“ (Signaturwort „0,6 Mio. €“).
- Darstellung: links acht Spalten gestapelte Säulen (natives Diagramm), vier Säulen A, B, C, Frei, je 2,96 Mio. €. Segmente von unten:
  Eigenmittel, Zuschuss, NBank-Darlehen, Bankdarlehen (frei). Darunter, an den Säulen ausgerichtet, eine Tabelle mit drei Zeilen:
  „Miete Jahr 1 je m²“ 6,80 | 8,20 | 9,00 | 18,36 € (Marktmiete 15,42 €), „Herkunft der Miete“ Höchstmiete | Höchstmiete | Höchstmiete |
  Miete für DSCR 1,2, „Eingesetztes Eigenkapital“ 613.426 | 614.908 | 615.649 | 592.682 €. Rechts vier Spalten Stichpunkte 14 pt:
  „Gleich in allen Varianten“: Haus, Herstellungskosten, Grundstück im Bestand, Bewirtschaftung. „Verschieden“: Finanzierung, Miete.
  Hinweiskasten unter dem Diagramm: „Rechenbeispiel, keine Förderzusage. B und C nur mit Zulassung in der Förderentscheidung.
  Gefördert enthält das Eigenkapital die Bearbeitungsentgelte von 20.744 | 22.226 | 22.966 €.“
- Daten: Gesamtkosten `K!D52:H52`; Zuschuss `K!D53:F53`; NBank-Darlehen `K!D54:F54`; Bankdarlehen `K!H55`; Eigenmittel `Ü!D19:G19`;
  Eigenkapital `K!D56:H56`; Bearbeitungsentgelte `K!D57:F57`; Miete `K!D49:H49`; Marktmiete `K!D13`; Förderquote 80 % `T3!D62`.

**15 · Annahmen** (PGN_INHALT_MR, Kicker MODELLRECHNUNG · ANNAHMEN)
- Titel: „Alle Varianten haben gleiche Annahmen, | neu ist nur die DSCR 1,2 der Bank“ (Signaturwort „DSCR 1,2“).
- Darstellung: vier Tafeln nebeneinander (je drei Rasterspalten), jede eine Tabelle mit drei Spalten Annahme, Wert, Herkunft.
  Herkunft als Kürzel: R Richtlinie, G Gesetz, Q Quelle, P Projektdaten PGN, A Annahme der PGN, N neue Annahme der PGN. Die Zeile N ist
  rot unterlegt (Signal). Hinweiskasten über die ganze Breite: Legende der Kürzel und „Ohne Ansatz: Finanzierungskosten KG 800,
  Tilgungsaufschub, Bodenwert, Veräußerungskosten. Vor Steuern, ab Bezug, ohne Bauphase.“

| Tafel | Annahme | Wert | Herkunft | Zelle |
|---|---|---|---|---|
| Haus | Ort, Mietenstufe | Neu Wulmstorf, VI | P | `E!F22` |
| Haus | Wohnungen, Wohnfläche | 14, 828 m² | P | `E!F9`, `E!F8` |
| Haus | Herstellungskosten KG 200–700 | 3.579 € je m² | P | `E!F11` |
| Haus | Bemessungsgrenze | 5.460 € je m² | R | `Tab!C14` |
| Haus | Grundstück | im Bestand, 0 € | P | `E!F13` |
| Haus | Bezug, Kostenstand | 2027, Kosten 2026 | A | `E!F7`, `E!F33` |
| Förderung | Darlehen A, B, C | 40, 60, 70 % | R | `Tab!D5:F5` |
| Förderung | Zuschuss A, B, C | 40, 20, 10 % | R | `Tab!D6:F6` |
| Förderung | Eigenmittel | mindestens 20 % | R | `Tab!D18` |
| Förderung | Höchstmiete A, B, C | 6,80, 8,20, 9,00 € je m² | R | `Tab!D14:F14` |
| Förderung | Mieterhöhung | 3 Jahre fest, dann alle 3 Jahre +6,15 % | R (Abstand A) | `Tab!D27:D29` |
| Förderung | Zins NBank-Darlehen | 0 % bis Jahr 35, danach 3,86 % | R, A | `Tab!D19:D20`, `E!F19` |
| Förderung | Tilgung | 2,38 % p. a. (42 Jahre) | A | `E!F17`, `Tab!D21` |
| Förderung | Verwaltungskostenbeitrag, Bearbeitungsentgelte | 0,5 % p. a.; 1 % und 0,75 % | R | `Tab!D23:D25` |
| Förderung | Bindung, danach | 35 Jahre; Kappungsgrenze 20 % in 3 Jahren | R, G | `Tab!D26`, `E!F27` |
| Frei | Bankdarlehen | 2,37 Mio. € (Kosten minus 20 % Eigenmittel) | A | `K!H55` |
| Frei | Zins, Zinsbindung | 3,86 %, 10 Jahre | Q, A | `E!F35`, `E!F36` |
| Frei | Anschlusszins | 3,86 % | A | `E!F37` |
| Frei | Tilgungsform | jährliche Annuität über 30 Jahre | A | `E!F38` |
| Frei | DSCR der Bank | mindestens 1,2, daraus Miete 18,36 € | **N** | `K!D6`, `K!D12` |
| Frei | Marktmiete | 15,42 € je m² | Q | `E!F25` |
| Frei | Mietanpassung | +2 % p. a. | A | `E!F26` |
| Bewirtschaftung | Mietausfall/Leerstand | 2 % der Sollmiete | A | `E!F29` |
| Bewirtschaftung | Objektverwaltung | 367 € je Wohnung p. a. | A | `E!F30` |
| Bewirtschaftung | Instandhaltung | 14,40 € je m² p. a. | A | `E!F31` |
| Bewirtschaftung | Kostensteigerung | +2 % p. a. ab Jahr 2 | A | `E!F32` |
| Bewertung | Projektkonto | Guthaben 2 %, Soll 5 % | A | `E!F41`, `E!F42` |
| Bewertung | Restwert | Ertragswert Ende Jahr 35, Zielmiete Marktmiete | A | `E!F45` |
| Bewertung | Liegenschaftszins, Nutzungsdauer | 2,8 % (Jahr 35), 80 Jahre | Q | `Ü!D106`, `Tab!D33` |
| Bewertung | Vergleichsmiete (ab Jahr 36) | 12,92 € je m² | Q | `E!F24` |

**16 · Jahr 1 je m²: herein, hinaus, was bleibt** (PGN_DIAGRAMM_MR, Kicker MODELLRECHNUNG · JAHR 1) · Schlüsselfolie 1
- Titel: „Frei finanziert gehen 9,21 € je m² Miete | in den Zins, gefördert 0 €“ (Signaturwort „9,21 €“).
- Darstellung: links sieben Spalten gestapelte Säulen, Einheit € je m² Wohnfläche und Monat, Achse 0 bis 20 €. Vier Säulen A, B, C,
  Frei 18,36 €. Säulenhöhe = Miete. Segmente von unten: Bewirtschaftung (Mietausfall, Objektverwaltung, Instandhaltung),
  Verwaltungskostenbeitrag, Zins, Tilgung, Zahlungsüberschuss. Werte in den Segmenten, Miete über der Säule (aus der Zelle, nicht
  aufsummiert). An der Säule Frei eine waagerechte Marke „Marktmiete 15,42 €“; daneben „Zahlungsüberschuss zur Marktmiete −0,17 €“.
  Rechts Stichpunkte unter drei Überschriften: „Herein“ (Miete), „Hinaus“ (Bewirtschaftung rund 1,85 bis 2,08 € in allen Varianten;
  Kapitaldienst 3,44 | 5,16 | 6,01 | 13,56 €), „Bleibt“ (1,51 | 1,16 | 1,09 | 2,71 €; zur Marktmiete −0,17 €). Hinweiskasten: „In € p. a.:
  Zahlungsüberschuss 15.003 | 11.560 | 10.812 € gefördert, 26.956 € frei zur Miete für DSCR 1,2, −1.691 € zur Marktmiete. Jahresrechnung
  in Anhang A6.“
- Werte (€ je m² und Monat):

| | A | B | C | Frei 18,36 € | Frei 15,42 € | Zellen |
|---|---|---|---|---|---|---|
| Miete | 6,80 | 8,20 | 9,00 | 18,36 | 15,42 | `T3!D21:H21` |
| Bewirtschaftung | 1,85 | 1,88 | 1,90 | 2,08 | 2,03 | `T3!D25:H25` |
| Verwaltungskostenbeitrag | 0,60 | 0,89 | 1,04 | 0 | 0 | `T3!D26:H26` |
| Zins | 0 | 0 | 0 | 9,21 | 9,21 | `T3!D27:H27` |
| Tilgung | 2,84 | 4,26 | 4,97 | 4,35 | 4,35 | `T3!D28:H28` |
| Zahlungsüberschuss | 1,51 | 1,16 | 1,09 | 2,71 | −0,17 | `T3!D30:H30` |
| Zahlungsüberschuss € p. a. | 15.003 | 11.560 | 10.812 | 26.956 | −1.691 | `T3!D17:H17` |

**17 · Miete für DSCR 1,2** (PGN_DIAGRAMM_MR, Kicker MODELLRECHNUNG · MIETE UND DSCR)
- Titel: „In A und B reicht die Höchstmiete für | DSCR 1,2, frei finanziert erst 18,36 €“ (Signaturwort „18,36 €“).
- Darstellung: links gruppierte Säulen, € je m² und Monat; vier Gruppen A, B, C, Frei mit je drei Säulen in derselben Reihenfolge:
  kostendeckende Anfangsmiete (Zahlungsüberschuss Jahr 1 null), Miete für DSCR 1,2, erlaubte bzw. erzielbare Miete (Höchstmiete,
  frei: Marktmiete 15,42 €). Unter dem Diagramm eine Zeile „DSCR Jahr 1 zur Höchstmiete bzw. Marktmiete“ 1,44 | 1,23 | 1,18 | 0,99
  und eine Zeile „Abstand zur Miete für DSCR 1,2“ +0,84 | +0,14 | −0,12 | −2,94 €. Rechts Stichpunkte unter zwei Überschriften:
  „Für welches Darlehen gilt 1,2“: frei finanziert für das Bankdarlehen 2,37 Mio. € (Annahme der PGN); gefördert gibt es kein
  Bankdarlehen, die DSCR misst dort den Kapitaldienst des NBank-Darlehens und 1,2 ist nur Vergleichszahl. „Was die NBank prüft“:
  Eigenmittel mindestens 20 %; angemessenen Gewinn, keine Überkompensation (RL Nr. 11.10, die NBank rechnet selbst); Tilgung eines
  Bankdarlehens mindestens 1 %. Hinweiskasten: „Gruppe C liegt in Jahr 1 bis 3 bei 1,18. Für 1,2 fehlen 0,12 € je m². Ab Jahr 4 liegt
  sie mit der ersten Mieterhöhung bei 1,27. Ein Zahlungsüberschuss von 10.812 € bleibt auch in Jahr 1.“
- Daten: kostendeckende Anfangsmiete `T3!D36:H36` (= `Ü!D112:G112`): 5,26 | 7,01 | 7,89 | 15,59 €. Miete für DSCR 1,2 `T3!D37:H37`
  (= `K!D50:H50`): 5,96 | 8,06 | 9,12 | 18,36 €. Höchstmiete bzw. Marktmiete `T3!D38:G38`: 6,80 | 8,20 | 9,00 | 15,42 €. Abstand
  `T3!D41:G41`. DSCR Jahr 1 `K!D62:H62`. Aufschlag 19,1 % `K!D14`. Bankdarlehen `K!H55`. Eigenmittel 20 % `Tab!D18`, Tilgung Bank 1 %
  `Tab!D31`. DSCR C Jahr 4 `KZ!Z10` = 1,27. Zahlungsüberschuss C `K!F61`.

**18 · DSCR im Zeitverlauf** (PGN_DIAGRAMM_MR, Kicker MODELLRECHNUNG · DSCR)
- Titel: „Ab Jahr 4 liegt die DSCR von A bis C | über 1,2, frei zur Marktmiete ab Jahr 11“ (Signaturwort „Jahr 4“).
- Darstellung: Liniendiagramm Jahr 1 bis 35, Achse 0,8 bis 3,5. Fünf Linien (A, B, C, Frei 18,36 €, Frei 15,42 €). Waagerechte Marke
  „1,2: DSCR-Ziel der Bank, frei finanziert (Annahme der PGN)“. Senkrechte Marke Jahr 30 „Bankdarlehen getilgt“; frei endet dort, weil
  kein Kapitaldienst mehr anfällt. Beschriftung am Anfang (Jahr 1) und Ende (A bis C Jahr 35, frei Jahr 30). Rechts Stichpunkte:
  „Ergebnis“: Jahre unter 1,2 (Jahr 1 bis 35) 0 | 0 | 3 | 0 | 10; Minimum 1,43 | 1,22 | 1,18 | 1,20 | 0,99. „Annahmen“: Mieterhöhung
  gefördert alle drei Jahre +6,15 % (Höchstwert), frei +2 % p. a. Hinweiskasten: „Ohne Mieterhöhung in der Bindung fällt die DSCR
  gefördert bis Jahr 35 auf 1,12 | 1,05 | 1,05; A liegt dann 6 Jahre unter 1,2, B 24, C 35.“
- Daten: Reihen `KZ!H7:H41` (A), `Q7:Q41` (B), `Z7:Z41` (C), `AR7:AR36` (Frei 18,36 €), `AI7:AI36` (Frei 15,42 €). Jahr 35 `K!D72:F72`
  (3,21 | 2,74 | 2,64). Jahr 30 frei `KZ!AR36` 2,13, `KZ!AI36` 1,75. Jahr 11 frei Markt `KZ!AI17` 1,20. Minimum `K!D71:H71`, Jahre unter 1,2
  `K!D73:H73`. Lauf mietanpassung_gefoerdert_0: `K!D71:F71`, `K!D73:F73`.

**19 · Zahlungsüberschuss je Jahr** (PGN_DIAGRAMM_MR, Kicker MODELLRECHNUNG · LIQUIDITÄT)
- Titel: „Kein Jahr mit Fehlbetrag in A, B und C, | frei zur Marktmiete fehlen 1.691 €“ (Signaturwort „Kein Jahr mit Fehlbetrag“).
- Darstellung: Liniendiagramm Jahr 1 bis 35, € p. a., Achse −10.000 bis 330.000 €, Nulllinie betont. Fünf Linien. Werte an Jahr 1 und
  Jahr 35. Marke Jahr 31 „frei: Bankdarlehen getilgt“. Rechts Stichpunkte: „Ergebnis“: Jahre mit Fehlbetrag 0 | 0 | 0 | 0 | 1; tiefster
  Stand des Projektkontos 0 | 0 | 0 | 0 | −1.691 €; frei finanziert ab Jahr 31 ohne Kapitaldienst. „Annahmen“: Miete gefördert alle drei
  Jahre +6,15 %, frei +2 % p. a.; Kosten +2 % p. a. Hinweiskasten (frei liegt vorn): „Frei finanziert liegt nur zur Miete 18,36 € vorn,
  19,1 % über der Marktmiete. Zur Marktmiete liegt der Zahlungsüberschuss erst ab Jahr 11 über A. Ohne Mietsteigerung hätte frei zur
  Marktmiete 30 Jahre mit Fehlbetrag.“
- Daten: Reihen `KZ!F7:F41` (A), `O7:O41` (B), `X7:X41` (C), `AP7:AP41` (Frei 18,36 €), `AG7:AG41` (Frei 15,42 €). Jahr 1 `K!D61:H61`,
  Jahr 35 `K!D64:H64`, Minimum `K!D65:H65`, Fehlbetragsjahre `K!D68:H68`, Projektkonto `K!D70:H70`. Jahr 11 A `KZ!F17` 25.660 €,
  frei Markt `KZ!AG17` 27.454 €. Jahr 31 frei `KZ!AP37` 292.959 €, `KZ!AG37` 241.070 €. Lauf mietsteigerung_0: `K!G68` 30.

**20 · Rückfluss des Eigenkapitals** (PGN_DIAGRAMM_MR, Kicker MODELLRECHNUNG · EIGENKAPITAL) · Schlüsselfolie 2
- Titel: „Gefördert ist das Eigenkapital nach | 22 bis 23 Jahren zurück, frei nach 13 bis 21“ (Signaturwort „22 bis 23 Jahren“).
- Darstellung: Liniendiagramm Jahr 0 bis 35, Größe: kumulierter Zahlungsüberschuss in % des eingesetzten Eigenkapitals (unverzinst),
  Achse 0 bis 700 %. Waagerechte Marke 100 % „Eigenkapital zurück“; an den Schnittpunkten die Jahre 23 | 23 | 22 | 13 | 21. Werte am Ende
  (Jahr 35): 210 | 228 | 245 | 682 | 440 %. Rechts Stichpunkte: „Eingesetzt“: 613.426 | 614.908 | 615.649 € gefördert, 592.682 € frei.
  „Zurück bis Ende Jahr 35“: 1,29 | 1,40 | 1,51 Mio. € gefördert; 4,04 Mio. € (18,36 €), 2,61 Mio. € (15,42 €). Hinweiskasten (frei liegt
  vorn): „13 Jahre nur zur Miete 18,36 €. Zur Marktmiete 21 Jahre; bis Jahr 17 hat dann A mehr Eigenkapital zurück als frei finanziert
  (65 % gegen 63 %). Unverzinst, vor Steuern, ohne Restwert; mit Restwert rechnet die Eigenkapitalrendite auf Folie 22.“
- Daten: Reihen `T3!D66:D101` (A), `E66:E101`, `F66:F101`, `H66:H101` (Frei 18,36 €), `G66:G101` (Frei 15,42 €); Formel kumulierter
  Zahlungsüberschuss `KZ!G6:G48` usw. ÷ Eigenkapital `K!D56:H56`. Jahr zurück `K!D67:H67` (Gegenprobe `T3!D51:H51`, Prüfung T3K5).
  Quote Jahr 35 `T3!D50:H50`. Kumuliert Jahr 35 `K!D66:H66`. Jahr 17: `T3!D83` 65 %, `T3!G83` 63 %; Jahr 18: `T3!D84` 70 %, `T3!G84` 71 %.

**21 · Objektrendite** (PGN_DIAGRAMM_MR, Kicker MODELLRECHNUNG · OBJEKTRENDITE)
- Titel: „Das Haus bringt gefördert 1,7 bis 2,8 %, | frei finanziert 4,5 bis 5,5 % in Jahr 1“ (Signaturwort „1,7 bis 2,8 %“).
- Darstellung: gruppierte Säulen, fünf Positionen (A, B, C, Frei 18,36 €, Frei 15,42 €) mit je zwei Säulen: „Nenner Gesamtkosten“ (dunkel)
  und „Nenner Gesamtkosten ohne Zuschuss“ (hell). Frei hat keinen Zuschuss, beide Säulen sind gleich hoch; das zeigt die Folie mit Absicht.
  Unter dem Diagramm eine Zeile „Objektrendite Jahr 35“ 3,2 | 4,1 | 4,6 | 10,7 | 8,8 %. Rechts Stichpunkte: „Rechnung“: Überschuss vor
  Kapitaldienst ÷ Gesamtkosten, unabhängig von der Finanzierung; Überschuss vor Kapitaldienst Jahr 1 49.152 | 62.784 | 70.574 | 161.734 |
  133.088 €. „Lesart“: gefördert trägt der Zuschuss einen Teil der Kosten, ohne ihn im Nenner steigt A von 1,7 auf 2,8 %; frei hängt die
  Objektrendite nur an der Miete. Hinweiskasten (frei liegt vorn): „Die Höchstmiete liegt bei 44 | 53 | 58 % der Marktmiete. Das begrenzt
  die Objektrendite gefördert. Frei 5,5 % nur zur Miete 18,36 €, zur Marktmiete 4,5 %.“
- Daten: `K!D87:H87`, `K!D88:H88`, `K!D59:H59`, Jahr 35 `T3!D52:H52`, Anteil Marktmiete `T3!D44:F44`, Zuschuss `K!D53:F53`.
  Gegenprobe Nettoanfangsrendite der Mappe `K!D43:H43` (gleich, Abweichung `K!D44:H44` = 0).

**22 · Eigenkapitalrendite** (PGN_DIAGRAMM_MR, Kicker MODELLRECHNUNG · EIGENKAPITALRENDITE)
- Titel: „Mit Restwert bringt das Eigenkapital | gefördert 7,05 bis 7,40 %, frei bis 8,93 %“ (Signaturwort „7,05 bis 7,40 %“).
- Darstellung: gruppierte Säulen, fünf Positionen mit je zwei Säulen: „mit Restwert“ (dunkel), „ohne Restwert“ (hell). Darunter Zeile
  „Anteil des Restwerts am Endvermögen“ 78 | 79 | 79 | 57 | 69 % und Zeile „Restwert Ende Jahr 35“ 5,15 | 5,67 | 5,90 | 6,76 | 6,76 Mio. €.
  Rechts Stichpunkte: „Rechnung“: VOFI-Eigenkapitalrendite über 35 Jahre, vor Steuern; Eigenkapital wie Folie 20; Restwert Ertragswert
  aus der Marktmiete, gefördert mit Abschlag für die niedrigere Miete. „Frei finanziert vorn, weil“: Miete 18,36 € liegt 19,1 % über
  dem Markt; Mieten steigen um 2 % im Jahr. Hinweiskasten (Risiko): „Ohne Mietsteigerung: frei 5,81 % (18,36 €) bzw. 4,41 % (15,42 €),
  gefördert 5,42 | 5,30 | 5,20 %. Anschlusszins +1 Punkt: frei 8,84 % bzw. 8,26 %, gefördert unverändert.“
- Daten: mit Restwert `K!D81:H81` (7,05 | 7,28 | 7,40 | 8,93 | 8,36 %), ohne Restwert `K!D82:H82` (2,58 | 2,61 | 2,75 | 6,32 | 4,84 %),
  Restwertanteil `K!D83:H83`, Restwert `K!D76:H76`, Aufschlag `K!D14`. Lauf mietsteigerung_0 `K!D81:H81`; Lauf anschlusszins_plus_1
  `K!G81:H81`.

**23 · Herstellungskosten der PGN** (heute Folie 22, PGN_INHALT, bleibt unverändert). Begründet die 3.579 € je m² (`E!F11`) vor der
Risikofolie. Die Werte je Kostengruppe stehen nicht in der Mappe, sondern in `praesentation/daten/markt.json` (heutiger Stand).

**24 · Risiken** (PGN_TABELLE_MR, Kicker MODELLRECHNUNG · RISIKEN)
- Titel: „Gefördert hängt das Ergebnis an Tilgung | und Kosten, frei finanziert an der Miete“ (Signaturwort „an der Miete“).
- Darstellung: Tabelle über acht Spalten. Zeilen = je eine geänderte Annahme (Basis, Tilgung 2,90 %, Tilgung 3,65 %, Herstellungskosten
  4.631 €, Herstellungskosten 5.460 €, keine Mieterhöhung gefördert, keine Mietsteigerung frei, Anschlusszins +1 Punkt). Spaltengruppe
  „Jahre mit Fehlbetrag, Jahr 1 bis 35“: A | B | C | Frei 15,42 €. Spaltengruppe „Frei 18,36 €“: Miete für DSCR 1,2 | Jahre mit DSCR
  unter 1,2. Begründung der zwei Gruppen: Frei 18,36 € hat nie einen Fehlbetrag, weil die Bank die Miete neu bemisst; sein Risiko zeigt
  sich in der Miete, die verlangt wird, und in der DSCR. Zellen mit Fehlbetrag hell grau hinterlegt (kein Rot). Rechts Stichpunkte:
  „Gefördert“: Tilgung und Herstellungskosten verschieben die Liquidität; ohne Mieterhöhung bleibt jedes Jahr ein Zahlungsüberschuss.
  „Frei finanziert“: Kosten heben die Miete für DSCR 1,2 auf 23,24 € bzw. 27,09 €; ohne Mietsteigerung 30 Jahre mit Fehlbetrag zur
  Marktmiete. Hinweiskasten: „Ohne Mieterhöhung in der Bindung sinkt die Eigenkapitalrendite mit Restwert gefördert auf 5,08 | 5,37 |
  5,54 %. Alle Läufe in Anhang A9 und A10.“

| Lauf | A | B | C | Frei 15,42 € | Frei 18,36 €: Miete | Frei 18,36 €: Jahre DSCR < 1,2 |
|---|---|---|---|---|---|---|
| Basis | 0 | 0 | 0 | 1 | 18,36 € | 0 |
| Tilgung 2,90 % | 0 | 0 | 1 | 1 | 18,36 € | 0 |
| Tilgung 3,65 % | 3 | 9 | 9 | 1 | 18,36 € | 0 |
| Herstellungskosten 4.631 € | 0 | 3 | 6 | 14 | 23,24 € | 0 |
| Herstellungskosten 5.460 € | 3 | 12 | 12 | 22 | 27,09 € | 0 |
| keine Mieterhöhung gefördert | 0 | 0 | 0 | 1 | 18,36 € | 0 |
| keine Mietsteigerung frei | 0 | 0 | 0 | 30 | 18,36 € | 29 |
| Anschlusszins +1 Punkt | 0 | 0 | 0 | 1 | 18,36 € | 0 |

  Zellen: Basis `K!D68:H68`, `K!H49`, `K!H73`; Läufe dieselben Zellen in `laeufe/<lauf>.xlsx` (tilgung_2_90, tilgung_3_65, kosten_4631,
  kosten_5460, mietanpassung_gefoerdert_0, mietsteigerung_0, anschlusszins_plus_1). Hinweis: Lauf mietanpassung_gefoerdert_0 `K!D81:F81`.

### 2.2 Anhang

**A6 · Jahresrechnung Jahr 1 aller Varianten** (PGN_ANHANG). Titel: „Jahr 1: in A bleiben 15.003 €, frei finanziert 26.956 €“.
Tabelle Zeilen 1 bis 9 nach G2 (Zeile 7 „Zins NBank-Darlehen bzw. Bankdarlehen“, Zeile 8 „Tilgung“), dazu Kapitaldienst und DSCR;
Spalten A | B | C | Frei 18,36 € | Frei 15,42 €; Spaltenkopf mit Miete je m². Hinweiskasten: Bearbeitungsentgelte einmalig 20.744 | 22.226 |
22.966 €. Daten `T3!D6:H18`, `K!D57:F57`.

**A7 · Ende der Bindung und danach** (PGN_ANHANG). Titel: „Ende Jahr 35: gefördert bis 0,35 Mio. € Restschuld, frei keine“. Links
gestapelte Säulen Vermögen Ende Jahr 35 = Restwert + Projektkonto − Restschuld (Restschuld als Segment unter null), fünf Positionen
(6,6 | 7,2 | 7,5 | 11,8 | 9,9 Mio. €). Rechts Tabelle Jahr 36 bis 42: Zins NBank ab Jahr 36 3,86 %, DSCR Jahr 36 2,54 | 2,17 | 2,09,
Zahlungsüberschuss Summe 36 bis 42, Jahre mit Fehlbetrag 0, Restschuld Jahr 42 null, Vermögen Jahr 42, Eigenkapitalrendite Horizont 42.
Hinweiskasten: frei getilgt nach Jahr 30 (jährliche Annuität über 30 Jahre), gefördert läuft das NBank-Darlehen bis Jahr 42.
Daten `K!D75:H79`, `K!D90:H96`, `KZ!H42`, `Q42`, `Z42`, `KZ!F42`, `O42`, `X42`, `KZ!AS36`, `E!F19`.

**A8 · Rendite in allen Lesarten der Mappe** (PGN_ANHANG). Titel: „Objekt-IRR nach Förderbarwert: A 6,93 %, frei 6,66 bis 7,60 %“.
Tabelle fünf Spalten: Objekt-IRR ohne Zuschuss, nach Zuschuss, nach Förderbarwert (je mit Restwert), dieselben ohne Restwert,
EK-IRR mit und ohne Restwert, statische Objektrendite Jahr 1 (Folie 21). Lesehilfe: Die Mappe nennt ihre „Objektrendite“ einen
Objekt-IRR über 35 Jahre (Übersicht 5.1 bis 5.9); die Folie 21 rechnet die statische Größe nach Auftrag. Daten `T3!D121:H125`,
`K!D84:H85`, `K!D87:H87`.

**A9 · Risiken: Liquidität** (PGN_ANHANG). Titel: „Bei 5.460 € je m² hat A 3 Jahre mit Fehlbetrag, frei 22“. Tabelle: neun Zeilen
(Basis und acht Läufe) × Zahlungsüberschuss Jahr 1, Jahre mit Fehlbetrag, tiefster Stand Projektkonto, DSCR Minimum, Jahre unter 1,2,
je fünf Positionen; Spalte Miete für DSCR 1,2. Daten: Basis `K!D61:H73`, Läufe `laeufe/<lauf>.xlsx` dieselben Zellen.

**A10 · Risiken: Rendite und Vermögen** (PGN_ANHANG). Titel: „Ohne Mieterhöhung sinkt die Rendite in A auf 5,08 %“. Tabelle: Basis und
acht Läufe × Eigenkapitalrendite mit und ohne Restwert, Vermögen Ende Jahr 35. Daten `K!D78:H82` je Lauf. Lesehilfe: In den
Kostenläufen steigt frei 18,36 € die Rendite, weil die Bank eine höhere Miete (23,24 € bzw. 27,09 €) ansetzt; das ist kein Vorteil,
sondern eine Bedingung.

**A11 · Tilgungssatz** (heute Folie 20, unverändert im Inhalt, einzeiliger Anhangtitel): „Bis 2,90 % Tilgung bleibt in A, B und C ein
Zahlungsüberschuss“. Daten `Ü!D55:F61`, `Ü!E63`, `Ü!F64`, `Ü!D49:F49`.

**A12 · Quellen** (heute A8). Ergänzt um: Team-Mappe Blatt „Team 3 Vergleich“, Konzepte-Mappe Blätter Konzepte, Frei DSCR 1,2,
Konzepte Zeitreihe, Läufe N6.

### 2.3 Was gegenüber heute entfällt

| Heute | Inhalt heute | Entscheidung | Wohin |
|---|---|---|---|
| 13 | Trenner | bleibt | Titel bleibt, Vorspann neu |
| 14 | Finanzierung, eine Säule (A), Rechenweg, Kennzahlen je Wohnung | ändert sich | vier Säulen (neue 14); Rechenweg und Bemessungsgrenze auf der Annahmenfolie 15; Kennzahlen je Wohnung nur in der Broschüre |
| 15 | Jahresrechnung A, B, C | ändert sich, wandert in den Anhang | A6, erweitert um zwei Spalten frei finanziert |
| 16 | Kapitaldienst A gegen frei (Balken) | entfällt | Kapitaldienst je m² steht in der neuen 16, in € in A6 |
| 17 | Zahlungsfluss gefördert (Fluss) | entfällt | ersetzt durch die Mietzerlegung je m² (neue 16) für alle vier Varianten im selben Maßstab |
| 18 | Zahlungsfluss frei (Fluss) | entfällt | wie 17 |
| 19 | Kostendeckende Anfangsmiete A gegen frei | ändert sich | aufgegangen in der neuen 17 (kostendeckende Anfangsmiete, Miete für DSCR 1,2, Höchstmiete bzw. Marktmiete für alle) |
| 20 | Tilgungssatz | wandert in den Anhang | A11, unverändert; Tilgung 2,90 und 3,65 % auch in der Risikotabelle (neue 24) |
| 21 | Verlauf Zahlungsüberschuss A, B, C | ändert sich | neue 19, mit frei finanziert (zwei Mieten), dazu Fehlbetrag und Projektkonto |
| 22 | Herstellungskosten PGN gegen ARGE | bleibt | neue 23 |
| 23 | Herstellungskosten, Schwelle A 5.150 € | entfällt | Kostenläufe 4.631 und 5.460 € für alle Varianten in der neuen 24 und in A9; die Schwellen 5.150, 4.380, 4.220 € stehen nicht in der Mappe |
| 24 | Zusammenfassung | entfällt | Fazit-Folie 28 |
| A6 | Rendite in A | ändert sich | neue 22 (Hauptteil) und A8 |
| A7 | Tilgungsschwelle je Kosten | entfällt | der Vergleich A gegen B und C nach Tilgung bleibt in A11; die Schwelle je Kosten ist für den Vergleich mit frei finanziert ohne Belang |

Neu im Hauptteil: 15 Annahmen, 17 Miete für DSCR 1,2, 18 DSCR, 20 Rückfluss, 21 Objektrendite, 22 Eigenkapitalrendite, 24 Risiken.
Neu im Anhang: A7, A8, A9, A10.

## 3 Schlüsselfolien

1. **Folie 16, Jahr 1 je m²**. Eine Grafik beantwortet „Was kommt herein, was geht hinaus, was bleibt?“ für alle vier Varianten im selben
   Maßstab. Je m² und Monat ist die Sprache der Immobilienleute; die Säulenhöhe ist die Miete, also sieht jeder sofort: Bewirtschaftung ist
   überall gleich (rund 1,85 bis 2,08 €), der Unterschied ist der Zins (0 gegen 9,21 €). Die Marke 15,42 € an der Säule frei zeigt ohne
   Worte, dass die Marktmiete den Kapitaldienst nicht ganz trägt. Sie ersetzt drei heutige Folien (16, 17, 18).
2. **Folie 20, Rückfluss des Eigenkapitals**. Sie beantwortet „Was bringt das eingesetzte Eigenkapital, und wie entwickelt es sich über
   die Zeit?“ ohne Renditebegriff: Nach wie vielen Jahren ist das Geld zurück? Die 100-%-Linie ist für jeden lesbar, die Schnittpunkte
   (22 bis 23 Jahre gefördert, 13 bzw. 21 Jahre frei) tragen die Aussage. Sie zeigt auch, wo frei finanziert vorn liegt und warum: nur zur
   Miete 18,36 €; zur Marktmiete liegt A bis Jahr 17 vorn.

## 4 Broschüre Blatt 9 bis 11 (Bogenseite 10 bis 12)

Seitenzahl der Broschüre bleibt 24. Die drei Blätter bekommen denselben Aufbau wie das Kapitel: Varianten nebeneinander, A, B, C, frei.

**Blatt 9 · „Ein Haus, vier Varianten“** (Kolumnentitel MODELLRECHNUNG · VARIANTEN UND ANNAHMEN). Titel: „3,0 Mio. €, vier Varianten,
rund 0,6 Mio. € Eigenkapital in jeder“.
- Modul 1, oben links (halbe Breite): Finanzierung als vier gestapelte Säulen (wie Folie 14) statt einer.
- Modul 2, oben rechts: Kasten „Das Modellhaus“ bleibt; ergänzt um „Zuschuss je Wohnung 84.669 | 42.334 | 21.167 €, Eigenmittel je
  Wohnung 42.334 €“ (`Ü!D24:F24`, `Ü!D25`).
- Modul 3, unten über die ganze Breite: Annahmen in vier Tafeln mit Wert und Herkunft (wie Folie 15), Legende der Kürzel.
- Entfällt: Rechenweg (steht in den Annahmen), Sensitivität Herstellungskosten (wandert auf Blatt 11).
- Daten wie Folien 14 und 15.

**Blatt 10 · „Jahr 1: was herein kommt, was hinaus geht, was bleibt“** (MODELLRECHNUNG · JAHR 1). Titel: „Gefördert kein Euro Zins,
frei finanziert 9,21 € je m²“.
- Modul 1, oben links: Mietzerlegung je m² (wie Folie 16).
- Modul 2, oben rechts: Tabelle „Mieten im Vergleich“: kostendeckende Anfangsmiete, Miete für DSCR 1,2, Höchstmiete bzw. Marktmiete,
  DSCR Jahr 1, je A | B | C | Frei (wie Folie 17).
- Modul 3, Mitte über die ganze Breite: Jahresrechnung Jahr 1, Zeilen 1 bis 9 nach G2, dazu Kapitaldienst und DSCR; fünf Spalten
  (wie A6). Ersetzt die Tabelle A, B, C und den Kasten „Zum Vergleich: frei finanziert“.
- Modul 4, unten: Kasten „DSCR 1,2: für welches Darlehen?“ (Bankdarlehen frei finanziert; gefördert kein Bankdarlehen; was die NBank
  prüft; Gruppe C 1,18 in Jahr 1 bis 3).
- Daten `T3!D6:H41`, `K!D62:H62`, `Tab!D18`, `Tab!D31`.

**Blatt 11 · „35 Jahre im Vergleich“** (MODELLRECHNUNG · ZEITVERLAUF UND RISIKEN). Titel: „Gefördert ist das Eigenkapital nach 22 bis
23 Jahren zurück“.
- Modul 1, oben links: Zahlungsüberschuss je Jahr 1 bis 35 (wie Folie 19).
- Modul 2, oben rechts: Rückfluss des Eigenkapitals (wie Folie 20).
- Modul 3, Mitte: Kennzahlentabelle fünf Spalten: Jahre mit Fehlbetrag, tiefster Stand Projektkonto, DSCR Minimum, Jahre unter 1,2,
  Eigenkapital zurück in Jahr, Objektrendite Jahr 1 (zwei Nenner), Eigenkapitalrendite mit und ohne Restwert, Restwertanteil, Restschuld
  und Vermögen Ende Jahr 35 (`K!D67:H88`).
- Modul 4, unten: Risiken kompakt (wie Folie 24, vier Zeilen: Kosten 4.631 und 5.460 €, Tilgung 3,65 %, keine Mietsteigerung).
- Entfällt: heutiges Blatt 11 „Mix und Tilgung“ (Tilgungsschwelle B und C gegenüber A); der Kern steht in A11 des Vortrags. Verweise auf
  „S. 11“ in den Blättern 5, 9 und 10 sind nachzuziehen.

## 5 Fazit-Folie (Folie 28, vor der Schlussfolie)

- Layout PGN_INHALT (weißer Grund, weil sie über das Modellhaus hinaus blickt). Kopf: Abschnitt „Fazit“; Achsleiste mit den Achskreisen 1
  bis 4 wie Agenda und Trenner, alle gefüllt. Kicker FAZIT · VIER ABSCHNITTE.
- Titel: „Gefördert trägt sich das Haus mit 6,80 €, | frei finanziert verlangt die Bank 18,36 €“ (Signaturwort „6,80 €“).
- Aufbau: vier Spalten (je drei Rasterspalten), jede unter ihrem Achskreis, je Spalte eine fette Kopfzeile und drei kurze Zeilen:

| | 1 Ausgangslage | 2 Programmteil 2.1 | 3 Modellrechnung | 4 Umsetzung |
|---|---|---|---|---|
| Kopf | Bauen und Finanzieren sind teurer | 80 % Förderung | Ein Haus, vier Varianten | Erst die Bewilligung |
| Zeile 1 | Herstellungskosten seit 2020 +52,9 % | bis zu 40 % Zuschuss | Jahr 1: 15.003 \| 11.560 \| 10.812 € Zahlungsüberschuss, kein Jahr mit Fehlbetrag | dann Verträge und Baubeginn |
| Zeile 2 | Zins von 0,46 auf 3,86 % | Darlehen 35 Jahre zinsfrei | Frei finanziert: Miete für DSCR 1,2 18,36 €, Marktmiete 15,42 € | Planung bis Leistungsphase 6 vorher möglich |
| Zeile 3 | Kapitaldienst je m² von 7,22 auf 17,55 € | Höchstmiete 6,80 \| 8,20 \| 9,00 € | Eigenkapital nach 22 bis 23 Jahren zurück, Rendite mit Restwert 7,05 bis 7,40 % | PGN plant und begleitet |

- Darunter Ergebniszeile über die ganze Breite (Papierton): „Bedingungen: Herstellungskosten 3.579 € je m², Tilgung 2,38 %, Mieterhöhung
  höchstens +6,15 % alle drei Jahre. Rechenbeispiel, keine Förderzusage.“
- Daten: Ausgangslage `T3!D57` (aus `Tab!D47:E47`), `T3!D58:D59` (`Tab!D49:E49`), `T3!D60:D61` (`Tab!D53:E53`). Programmteil: Förderquote
  `T3!D62` (`Ü!D16`), Zuschuss `Tab!D6`, zinsfreie Jahre `Tab!D20`, Höchstmiete `Tab!D14:F14`. Modellrechnung: `K!D61:F61`, `K!D68:F68`,
  `K!D12`, `K!D13`, `K!D67:F67`, `K!D81:F81`. Bedingungen `E!F11`, `E!F17`, `Tab!D28`. Umsetzung ohne Mappenzahl (Leistungsphase 6 nach
  HOAI, heutige Folie 27).
- Nicht aufgenommen: Bestand gebundener Wohnungen −40,6 % (heutige Folie 6); die Zahl steht nicht in der Mappe.

## 6 Neue Blöcke in der Mappe

**Gemeinsame Blöcke (Konzepte-Mappe, genutzt):** N1 DSCR-Ziel 1,2 (`K!D6`); N2 Miete frei für DSCR 1,2 und Blatt Frei DSCR 1,2 (`K!D10:D16`);
N3 Miete für DSCR 1,2 in A, B, C (`K!D19:F27`); N4 Objektrendite (`K!D36:H44`); N5 Kennzahlen je Variante und Blatt Konzepte Zeitreihe
(`K!D49:H96`); N6 Szenario-Läufe (alle acht genutzt).

**Eigener Block T3** in der Team-Mappe `team-3/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Team3.xlsx`, neues Blatt „Team 3 Vergleich“
(gebaut mit `team-3/mappe/build_team3.py`, Werte in `team-3/mappe/werte_team.json`). Nur Formeln auf bestehende Zellen, keine neue Annahme.

| Teil | Zeilen | Inhalt | Grund |
|---|---|---|---|
| T3.1 | 6 bis 18 | Jahresrechnung Jahr 1 je Variante, € p. a., Auszahlungen positiv: Miete, Sollmiete, Mietausfall, Objektverwaltung, Instandhaltung, Bewirtschaftung, Überschuss vor Kapitaldienst, Verwaltungskostenbeitrag, Zins, Tilgung, Kapitaldienst, Zahlungsüberschuss, DSCR | Die Zerlegung für Frei DSCR 1,2 (Sollmiete 182.444 €, Mietausfall 3.649 €) und Zins/Tilgung frei stand nicht in N5 |
| T3.2 | 21 bis 33 | dieselben Größen je m² Wohnfläche und Monat (÷ `Wohnflaeche` × 12) und Anteile an der Sollmiete | Folie 16 |
| T3.3 | 36 bis 44 | kostendeckende Anfangsmiete (`Ü!D112:G112`), Miete für DSCR 1,2, Miete im Modell, Marktmiete, Abstände, Miete in % der Marktmiete | Folie 17, 21 |
| T3.4 | 47 bis 52 | Eigenkapital, Rückflussquote Jahr 10, 20, 35, erstes Jahr ≥ 100 % (Gegenprobe zu `K!D67:H67`), Objektrendite Jahr 35 | Folie 20, 21 |
| T3.5 | 55 bis 62 | Ausgangslage für das Fazit: Herstellungskosten ARGE Q1 2020 und heute mit Anstieg, Sollzins, Kapitaldienst je m² (`Tab!D47:E53`), Förderquote (`Ü!D16`) | Folie 28 |
| T3.6 | 65 bis 108 | Zeitreihe Jahr 0 bis 42: Rückflussquote (D bis H), Objektrendite (J bis N), Objektrendite nach Zuschuss (P bis R) | Folie 20, 21 |
| T3K | 111 bis 117, Status `T3!D3` | Prüfungen: Zerlegung geht auf (T3K1 bis T3K4), Rückflussjahr gleich N5.17 (T3K5), Status Mappe und Konzepte OK (T3K6), Projekt 2 (T3K7) | alle OK |
| T3.7 | 121 bis 125 | Objekt-IRR der Mappe in fünf Lesarten (`Ü!D76:G84`; frei DSCR 1,2 `Frei DSCR 1,2!I136`, `I138`) | A8 |

Prüfung (14.11.2026): recalc mit eigenem LibreOffice-Profil, 14.739 Formeln, 0 Formelfehler. Alle zwölf bestehenden Blätter der Team-Mappe
gleich der Konzepte-Mappe (16.541 Zellen, davon 13.856 Formeln, 0 Abweichungen bei Formeln und Werten). Status Übersicht D3, Konzepte D3,
Team 3 Vergleich D3: OK. `pruefe_konzepte.py` lief nicht auf der Team-Mappe (sie lässt nur die drei gemeinsamen neuen Blätter zu); die
Gleichheit aller bestehenden Zellen mit der geprüften Konzepte-Mappe ersetzt diesen Lauf.

## 7 Schwächen dieses Konzepts

1. **Dichte.** Fünf Positionen auf jeder Grafik (frei mit zwei Mieten) und zwei Säulen je Position auf Folie 21 und 22 ergeben bis zu zehn
   Säulen. Das ist an der Grenze für den Saal. Wer kürzen will, nimmt auf Folie 21 und 22 die Säulen „Frei 15,42 €“ heraus und nennt den
   Wert in der Zeile darunter; dann ist der Vergleich aber nicht mehr ganz symmetrisch.
2. **Maßstab auf Folie 19.** Frei 18,36 € erreicht 317.109 € in Jahr 35, gefördert 64.860 bis 84.149 €. Auf einer gemeinsamen Achse liegen die
   drei Linien A, B, C dicht beieinander im unteren Viertel. Das ist ehrlich, aber schwer zu lesen; die Stichpunkte müssen die Werte tragen.
3. **Annahmenfolie 15.** 30 Zeilen auf einer Folie in 12 pt Tabellenschrift. Sie ist eine Nachschlagefolie, im Vortrag nicht Zeile für
   Zeile zu erklären. Im Saal ist sie nur aus den ersten Reihen lesbar.
4. **Ein Thema mehr.** Der Hauptteil hat 29 statt 28 Folien (Fazit neu, Zusammenfassung 24 fällt weg, Kapitel 3 behält 12 Folien). Erste
   Kandidaten für den Anhang: 18 (DSCR-Verlauf) und 21 (Objektrendite).
5. **Die Miete 18,36 € ist gerechnet, nicht am Markt belegt.** Überall, wo frei finanziert vorn liegt (Zahlungsüberschuss, Rückfluss,
   Objektrendite, Eigenkapitalrendite, Vermögen), hängt das an dieser Miete. In den Kostenläufen steigt sie auf 23,24 bzw. 27,09 €, und mit
   ihr die Rendite (A10). Das Konzept zeigt deshalb für frei 18,36 € im Risiko die Miete, nicht die Rendite; ein Leser der Anhangtabelle
   kann das trotzdem missverstehen.
6. **Rückfluss unverzinst.** Folie 20 zählt Zahlungsüberschüsse ohne Zins (wie N5.17), das Projektkonto der VOFI verzinst sie mit 2 %. Die
   Jahre sind deshalb eine Spur später als bei verzinster Rechnung, und Folie 20 und Folie 22 rechnen verschieden.
7. **Zwei Begriffe „Objektrendite“.** Die Mappe führt unter „Objektrendite vor Steuern“ einen Objekt-IRR über 35 Jahre in drei Lesarten
   (Übersicht 5.1 bis 5.9), dazu die statische Nettoanfangsrendite als Hilfsgröße (5.10). Der Auftrag definiert die statische Größe. Folie 21
   folgt dem Auftrag, A8 zeigt die Lesarten der Mappe. Mit dem Förderbarwert gerechnet liegt A mit 6,93 % über frei zur Marktmiete (6,66 %);
   das steht nur im Anhang.
8. **Restwert trägt die Rendite.** 57 bis 79 % des Endvermögens sind Restwert. Gefördert und frei rechnen ihn verschieden (5,15 gegen
   6,76 Mio. €): gefördert mit Abschlag, weil die Miete der Gruppe unter der Zielmiete liegt. Eine Bandbreite für Liegenschaftszins und
   Restwert (Hinweis 13 der Mappe) gibt es in N6 nicht.
9. **Was die Mappe nicht abbildet**, gilt für alle Varianten und steht nur im Hinweiskasten der Annahmen: keine Bauphase (Renditen laut
   Hinweis 4 zu hoch), kein Grundstück (Verkehrswert 731.325 € laut Hinweis 15 nicht angesetzt), keine Steuern.
10. **Risiken nur einzeln.** Jeder Lauf ändert eine Annahme. Kombinationen (Kosten hoch und keine Mietsteigerung), eine niedrigere Marktmiete
    und ein anderes DSCR-Ziel als 1,2 fehlen. Die Läufe zur Mietanpassung sind 0 gegen Höchstwert, keine Zwischenwerte.
11. **C über 1,2 hängt an der Mieterhöhung.** C erreicht 1,2 ab Jahr 4 nur mit der höchsten Mieterhöhung (+6,15 % alle drei Jahre). Ohne
    sie bleibt C alle 35 Jahre unter 1,2 (Lauf mietanpassung_gefoerdert_0). Folie 18 sagt das im Hinweiskasten, der Titel nicht.
12. **Rundung.** Die gerundeten Segmente auf Folie 16 ergeben in B 8,19 statt 8,20 € und frei 18,35 statt 18,36 €. Die Summe über der Säule
    kommt deshalb aus der Zelle, nicht aus den Segmenten.
13. **„Rund 0,6 Mio. €“ glättet.** Gefördert enthält das Eigenkapital die Bearbeitungsentgelte; es ist 3,5 bis 3,9 % höher als frei.
    Die Tabelle auf Folie 14 nennt die genauen Werte.
14. **Wortwahl offen.** Der Auftrag spricht von „nötiger Miete“; G4 hat „nötige Miete“ durch „kostendeckende Anfangsmiete“ ersetzt, und
    die meint Zahlungsüberschuss null. Das Konzept sagt deshalb „Miete für DSCR 1,2“. Das muss der Auftraggeber bestätigen.
15. **Fazit ohne Bestand.** Die Zahl −40,6 % gebundene Wohnungen (heutige Folie 6) steht nicht in der Mappe und fehlt im Fazit. Der
    Anstieg der Herstellungskosten (+52,9 %) kommt aus den ARGE-Werten in `Tab!D47:E47` (Block für Folie 5).
16. **Nur drei Folien gebaut.** Gebaut und mit den Prüfungen des Vortrags geprüft sind 16, 20 und 28. Alle übrigen Folien und die drei
    Broschürenblätter sind Skizzen (matplotlib, Schrift und Strich angenähert). Ihre Titel sind mit der Schriftmetrik gemessen, Tabellenhöhen,
    Stichpunkte in 14 pt und native Diagramme aber nicht. Beim Bau können Zeilen umbrechen und Folien voller werden als in der Skizze.
17. **„Ohne Mietanpassung“ ist nicht ganz symmetrisch.** Die Fazit-Folie stellt gefördert ohne Mieterhöhung (Lauf mietanpassung_gefoerdert_0,
    5,08 bis 5,54 %) neben frei ohne Mietsteigerung (Lauf mietsteigerung_0, 4,41 bis 5,81 %). Der Lauf frei nimmt aber auch dem Restwert
    die Steigerung der Marktmiete, der Lauf gefördert nicht. Im Lauf mietsteigerung_0 fällt gefördert auf 5,20 bis 5,42 % (Folie 22, A10).
    Einen Lauf mit beidem zugleich gibt es in N6 nicht. Folie 22 und Fazit nennen deshalb für gefördert zwei verschiedene „ohne“-Werte;
    wer beide Folien nebeneinander liest, muss die Läufe kennen.
18. **Titel Folie 21 mischt zwei Nenner.** „1,7 bis 2,8 %“ reicht von A mit Gesamtkosten (1,7 %) bis A ohne Zuschuss im Nenner (2,8 %).
    Mit Gesamtkosten allein sind es 1,7 bis 2,4 %. Der Titel ist richtig, aber großzügig gelesen.
19. **Risikofolie 24 bricht das Raster.** Die Spalten stehen in zwei Gruppen (A, B, C, Frei 15,42 € | Frei 18,36 €: Miete, Jahre unter 1,2),
    weil frei 18,36 € nie einen Fehlbetrag hat. Damit steht frei 15,42 € vor frei 18,36 €, anders als auf allen anderen Folien.
    Ebenso hat A7 rechts nur A, B, C (frei ist nach Jahr 30 ohne Darlehen).
20. **Fazit im Abschnitt 4.** Der Kopf der Fazit-Folie zeigt „4 Umsetzung“, weil die Bibliothek für „Fazit“ kein Zeichen kennt. Wer im Saal
    auf den Kopf schaut, liest das Fazit als Teil der Umsetzung.
21. **Annahmen in der Broschüre kürzer als auf Folie 15.** Blatt 9 hat 30 Zeilen; Mietenstufe, Bearbeitungsentgelte, Nutzungsdauer und
    Kappungsgrenze stehen nur auf Folie 15 (Mietenstufe im Kasten „Das Modellhaus“). Die vollständige Stelle ist Folie 15.
22. **Leerraum in der Broschüre.** Blatt 10 und 11 haben unten rund ein Viertel der Seite frei, Blatt 9 neben dem Modellhaus. Das Raster der
    Module ist nicht ausgeglichen; im Satz muss es neu verteilt werden.
23. **„Frei 18,36“ ohne Erklärung auf einzelnen Skizzen.** Die Bedeutung (Miete für DSCR 1,2, Annahme der PGN) steht auf 15, 16, 17, 20,
    28 und den Blättern 10 und 11, in den Legenden von 18 und 19 als „(DSCR 1,2)“. Auf 21, 22 und im Anhang steht nur „Frei 18,36“.
    Wer dort einsteigt, braucht Folie 17.
24. **Kumuliert nur als Rückflussquote.** Der kumulierte Zahlungsüberschuss erscheint als % des Eigenkapitals (Folie 20) und als Summe
    bis Jahr 35 in Mio. € (Stichpunkte). Eine Linie in € kumuliert gibt es nicht; das Projektkonto (verzinst) steht nur als Endstand in A7.

## 8 Änderungen der Gestaltung

Stand 14.11.2026, Rolle Gestaltung. Gebaut sind die Schlüsselfolien 16 und 20 und die Fazit-Folie 28 (`entwurf/Entwurf-Team-3.pptx`, Module in
`entwurf/folien/`, Bilder `entwurf/png/`, PDF `entwurf/Entwurf-Team-3.pdf`; Belege jeder Zahl mit Blatt und Zelle in
`entwurf/Entwurf-Team-3.belege.json`, alle 115 Zahlen mit Zelle). Bau, Schemaprüfung (validate.py) und `pruefe_entwurf.py` ohne Fehler.
Die übrigen Folien des Kapitels und die Broschürenblätter 9 bis 11 stehen als Skizzen in `entwurf/skizzen/` (Liste in `SKIZZEN.md`) und
`entwurf/broschuere/`. Punkt 16 der Schwächen ist damit für diese drei Folien überholt.

| Folie | Konzept | Umgesetzt | Grund |
|---|---|---|---|
| alle | Linien: A, B, C in Tinte, frei in Grau | A Tinte voll, B Tinte gestrichelt, C Tinte gepunktet; Frei 18,36 € Referenzgrau voll, Frei 15,42 € Referenzgrau gestrichelt | Heute steht C in Referenzgrau; das Grau gehört nun frei finanziert. Fünf Linien bleiben so unterscheidbar |
| 16 | gestapelte Säulen, vier Säulen, Marke 15,42 € an der Säule Frei | gestapelte **Balken**, **fünf** Balken (A, B, C, Frei 18,36 €, Frei 15,42 €), senkrechte Marke „Marktmiete 15,42 €“ durch alle Balken | In Säulen über sieben Spalten passen die Werte 0,60 bis 1,90 € nicht in ihr Segment. Der fünfte Balken zeigt die Bewirtschaftung zur Marktmiete genau (2,03 €, `T3!G25`) und den Fehlbetrag 0,17 € (`T3!G30`); mit nur einer Marke am Balken Frei 18,36 € wären es 0,22 € gewesen |
| 16 | Miete über der Säule, Zahlungsüberschuss im Segment | Miete im Kategorientext links („A: 6,80 €“), am Balkenende „bleibt 1,51 €“ bzw. „fehlen 0,17 €“; Zahlungsüberschuss als Schraffur ohne Legendeneintrag | Das Balkenende beantwortet „was bleibt“ direkt; die Legende passt so in eine Zeile |
| 16 | Werte in allen Segmenten | Werte nur, wo sie mit Luft hineinpassen; Verwaltungskostenbeitrag 0,60 \| 0,89 \| 1,04 € steht in den Stichpunkten | Kein Wert über den Rand seines Segments |
| 16 | Stichpunkte mit Kapitaldienst 3,44 \| 5,16 \| 6,01 \| 13,56 € | Stichpunkte „Herein“, „Hinaus“, „Bleibt im Jahr“: Höchstmiete 44 bis 58 % der Marktmiete (`T3!D44:F44`), frei 19,1 % über der Marktmiete (`K!D14`), Bewirtschaftung, Verwaltungskostenbeitrag, Zins; Zahlungsüberschuss in € p. a. (`T3!D17:H17`) | Die Spalte war sonst zu hoch (Passprüfung); der Kapitaldienst je m² steht im Diagramm (Zins + Tilgung) |
| 16 | Hinweiskasten mit € p. a. | Hinweiskasten: Bearbeitungsentgelte 20.744 \| 22.226 \| 22.966 € einmalig, außerhalb von Jahr 1 (`K!D57:F57`); € p. a. in den Stichpunkten | Das eine Thema der Folie bleibt Jahr 1; die einmaligen Entgelte fehlten sonst |
| 20 | Titel „Gefördert ist das Eigenkapital nach \| 22 bis 23 Jahren zurück, frei nach 13 bis 21“ | „Eigenkapital zurück: gefördert nach \| 22 bis 23 Jahren, frei nach 13 bzw. 21“ | Zeile 2 war 11,82 Zoll breit (höchstens 11,60); „bzw.“, weil 13 und 21 zwei Mieten sind, keine Spanne |
| 20 | Jahre an den Schnittpunkten | Punkte an den Schnitten mit der 100-%-Marke (zwischen zwei Jahren aus den Werten der Reihe gelegt), daneben „13“, „21“, „22 bis 23“; zusätzlich Marke „Jahr 30: Bankdarlehen getilgt“ (`E!F38`) | Ohne die Marke liest sich der Knick der frei finanzierten Linien nach Jahr 30 als Fehler |
| 20 | Stichpunkte „Eingesetzt“, „Zurück bis Ende Jahr 35“ | dazu Gruppe „Annahmen und Risiko“: Mieterhöhung gefördert +6,15 % alle 3 Jahre, frei +2 % p. a., ohne Mietsteigerung 30 Jahre mit Fehlbetrag zur Marktmiete (Lauf mietsteigerung_0, `K!G68`) | Frei liegt beim Rückfluss in beiden Mieten vorn; die Regel verlangt Annahme und Risiko auf derselben Folie. Ein Rückflussjahr je Lauf führt N6 nicht, daher kein „nur wenn“ |
| 20 | Hinweis „bis Jahr 17 hat A mehr zurück“ | gleich; das Jahr 17 und 65 \| 63 % rechnet das Modul aus den Reihen `T3!D66:D101`, `T3!G66:G101` und prüft, dass sich die Linien nur einmal kreuzen | – |
| 28 | Kopf Abschnitt „Fazit“ | Kopf „4 Umsetzung“, Thema „Fazit“ im Schriftfeld | Ein Abschnitt „Fazit“ hat kein Zeichen; der Kopf zeigte einen leeren Kreis. Die Fazit-Folie steht wie die Kontaktfolie im Abschnitt 4 |
| 28 | Spalten mit Kopfzeile Abschnittsname, darunter fette Aussage und drei Zeilen; Ergebniszeile „Bedingungen“ | Achsleiste 1 bis 4, Stationstitel = Aussage („Teurer als 2020“, „80 % Förderung“, „Ein Haus, vier Varianten“, „Erst die Bewilligung“), je zwei bis drei kurze Zeilen; darunter Tabelle „Unter diesen Annahmen“ gefördert gegen frei finanziert mit denselben vier Merkmalen: Miete Jahr 1, Mietanpassung, Rendite mit Restwert, ohne Mietanpassung | Mit Abschnittsname, Aussage und drei Zeilen lief die Folie über die Inhaltszone. Der symmetrische Vergleich zeigt, dass frei bei der Rendite vorn liegt (8,36 bis 8,93 %, `K!G81:H81`) und unter welcher Annahme (+2 % p. a.), mit dem Risiko daneben: ohne Mietanpassung gefördert 5,08 bis 5,54 % (Lauf mietanpassung_gefoerdert_0, `K!D81:F81`), frei 4,41 bis 5,81 % (Lauf mietsteigerung_0, `K!G81:H81`) |
| 28 | Station 3 mit Jahr-1-Werten und Miete für DSCR 1,2 | „Kein Fehlbetrag in A, B, C“ (`K!D68:F68`), „Eigenkapital nach 22 bis 23 Jahren zurück“ (`K!D67:F67`); die Miete für DSCR 1,2 steht im Titel und in der Tabelle | Derselbe Wert nicht zweimal; Platz |
| 28 | „Rechenbeispiel, keine Förderzusage“ in der Ergebniszeile | rechts im Modulkopf der Tabelle (12 pt grau) | kein frei hängender Text |

Skizzen: Diagramme mit sechsstelligen Beträgen stehen in Tsd. € (Folie 19, Blatt 11). Folie 23 und A11 sind die heutigen Folien 22 und 20
als Bild. In der Broschüre stehen die Annahmen auf Blatt 9 in 2 × 2 Tafeln über je sechs Spalten statt vier Tafeln über je drei Spalten,
weil Wert und Herkunft in drei Spalten (42 mm) nicht nebeneinander passen.

## 9 Abgleich am Ende (Rolle Inhalt, 14.11.2026)

Geprüft: Entwürfe 16, 20, 28 (pptx, Belege, Bilder), alle Skizzen und Broschürenblätter gegen Abschnitt 2 bis 5, `ZAHLEN.md`,
`werte_konzepte.json` und `werte_team.json`. Jede Zahl der pptx steht mit Blatt und Zelle in `entwurf/Entwurf-Team-3.belege.json`
(117 Werte); jede Zahl auf den drei Entwürfen findet sich gerundet in diesen Werten wieder (Ausnahmen nur Blattnummern, Achsteilung und
Jahreszahl 2020). Die Skizzen lesen alle Zahlen aus den beiden JSON-Dateien (`skizzen.py`); die Fußzeile jeder Skizze nennt die Zellen.
Stichproben gegen die Mappe: Übersicht D24:F25, Team 3 Vergleich D55:D62, Status Übersicht D3, Konzepte D3, Team 3 Vergleich D3 = OK.
Aussagen gegen die Reihen geprüft: C liegt in Jahr 1 bis 3 unter 1,2 (1,181 | 1,180 | 1,179), ab Jahr 4 darüber; frei zur Marktmiete
erreicht 1,2 in Jahr 11 (1,204); frei 18,36 € hat in keinem Jahr eine DSCR unter 1,2; A liegt beim Rückfluss bis Jahr 17 vor frei
zur Marktmiete und danach nicht mehr.

### 9.1 Behoben

| Wo | Fehler | Behoben |
|---|---|---|
| 16 (Entwurf) | DSCR 1,2 ohne Kennzeichnung als Annahme der PGN | Stichpunkt „Frei: 18,36 € für DSCR 1,2 (Annahme der PGN), 19,1 % über der Marktmiete“; 1,2 aus `Konzepte!D6` |
| 20 (Entwurf) | Stichpunkt nannte 18,36 € ohne Bedeutung, Marktmiete ohne Betrag | „Frei 4,04 Mio. € zur Miete für DSCR 1,2 (18,36 €, Annahme der PGN), 2,61 Mio. € zur Marktmiete 15,42 €“ |
| 28 (Entwurf) | Marktmiete nur als „19,1 % über der Marktmiete“, nicht als 15,42 €; DSCR 1,2 ohne Kennzeichnung; „Rendite mit Restwert“ statt des festen Worts; Kapitaldienst ohne „und Monat“ | Zeile Miete: „18,36 € für DSCR 1,2 (Annahme der PGN), Marktmiete 15,42 €“; Zeilen „Eigenkapitalrendite mit Restwert“ und „dieselbe ohne Mietanpassung“; „Kapitaldienst von 7,22 auf 17,55 € je m² und Monat“ (wie heutige Folie 5); Spalten 3,1 / 3,4 / 5,5 Zoll |
| 15 (Skizze) | Annahmen unvollständig: Mietenstufe, Zins ab Jahr 36, Verwaltungskostenbeitrag, Bearbeitungsentgelte, Eigenmittel, Liegenschaftszins, Nutzungsdauer, Vergleichsmiete, Kappungsgrenze fehlten; „Annuität 30 J.“ fest im Code; Abstand der Mieterhöhungen und Zinsbindung sind Annahmen der PGN, standen als R bzw. Q | ergänzt (33 Zeilen), Laufzeit aus `Eingaben!F38`, Herkunft „R, A“ und „Q, A“; vierte Tafel heißt „Betrieb, Restwert“ |
| 17 (Skizze) | Legende „kostendeckend“ statt „kostendeckende Anfangsmiete“ | ersetzt |
| 18, 19 (Skizze) | Legende „Frei 18,36“ ohne Bedeutung | „Frei 18,36 (DSCR 1,2)“, „Frei 15,42 (Markt)“ |
| 21, 22, A9, A10 (Skizze) | Spaltenköpfe „Fr 18,36“ | „Frei 18,36“, „Frei 15,42“ |
| 22 (Skizze) | Restwert ohne Einheit; Hinweis „Ohne Mietsteigerung“ verschwieg, dass der Lauf auch den Restwert gefördert senkt | „Restwert J. 35, Mio. €“; „Ohne Steigerung der Marktmiete (wirkt auch auf den Restwert)“ |
| 24 (Skizze) | Spaltenköpfe „Fr: Miete“, „DSCR<1,2“ | „Frei 18,36: Miete“, „Jahre < 1,2“ |
| A7 (Skizze) | „Überschuss 36–42“ (Gedankenstrich, anderes Wort), „EK-Rendite“; Beschriftung lief in die Werte | „Zahlungsüberschuss, Tsd. €“ unter dem Kopf „Jahr 36 bis 42“, „Eigenkapitalrendite, 42 Jahre“, Spalten neu |
| A8, Blatt 11 | „EK-Rendite“ | „Eigenkapitalrendite“ |
| A9 (Skizze) | Hinweis sprach vom Entwurf („Im Entwurf dazu …“) | Hinweis erklärt die letzte Spalte |
| A10 (Skizze) | Tabelle sagte nicht, welche Rendite | Hinweis beginnt mit „Eigenkapitalrendite mit Restwert, 35 Jahre, vor Steuern“ |
| Blatt 9 | Annahmen ohne Zinsen NBank, Verwaltungskostenbeitrag, Eigenmittel, Bindung, Zinsbindung, Tilgung frei, Mietsteigerung, Projektkonto, Restwert, Liegenschaftszins, Vergleichsmiete; Zellen von Zuschuss je Wohnung fehlten | ergänzt (30 Zeilen); Fußzeile mit Übersicht D24:F25, D106 |
| Blatt 10 | Balken ohne Legende und ohne Beschriftung der Marke 15,42 €; „kostendeckend“ | Legende mit Zahlungsüberschuss, Marke „Marktmiete 15,42 €“, Achsentitel; „kostendeckende Anfangsmiete“ |
| Blatt 11 | Liniendiagramme ohne Legende; „Frei 18,36“ ohne Bedeutung | Legende über beiden Diagrammen, Marke „Eigenkapital zurück“, Nulllinie; Unterzeile der Kennzahlen erklärt beide Mieten |
| `ZAHLEN.md` | Fehlten: DSCR-Ziel, Miete und Marktmiete, Bearbeitungsentgelte, Anteil Marktmiete und Aufschlag (16); Annahmen und Lauf mietsteigerung_0 (20); Mietanpassung und beide „ohne“-Läufe (28); DSCR-Ziel stand als „1,20“ | ergänzt in `build_zahlen.py`, neu erzeugt (1.040 Einträge); DSCR-Ziel mit einer Stelle |

Bau nach den Änderungen: `entwurf.cjs` ohne Fehler, `rendern.sh` mit eigenem LibreOffice-Profil, Schemaprüfung bestanden,
`pruefe_entwurf.py` 0 Fehler, 0 Hinweise. Bilder in `entwurf/png/`, PDF `entwurf/Entwurf-Team-3.pdf`.

### 9.2 Pflichtpunkte des Auftrags

| Nr. | Pflichtpunkt | Erfüllt | Wo |
|---|---|---|---|
| 1 | Annahmen vollständig an einer Stelle, je Annahme Wert und Herkunft (Richtlinie, Quelle, Annahme der PGN) | ja | Folie 15 (33 Zeilen, Kürzel R, G, Q, P, A, N); Broschüre Blatt 9 gekürzt |
| 2 | Liquidität: Zahlungsüberschuss je Jahr | ja | Folie 19, Blatt 11 |
| 3 | Zahlungsüberschuss kumuliert | ja | Folie 20 (in % des Eigenkapitals, Summe bis Jahr 35 in Mio. €), Blatt 11 |
| 4 | Jahre mit Fehlbetrag, tiefster Stand des Projektkontos | ja | Folie 19, 24, A9, Blatt 11 |
| 5 | DSCR je Variante in Jahr 1 und im Zeitverlauf | ja | Folie 17 (Jahr 1), 18 (Jahr 1 bis 35), A6, Blatt 10 und 11 |
| 6 | Objektrendite = Überschuss vor Kapitaldienst ÷ Gesamtkosten, unabhängig von der Finanzierung | ja | Folie 21 |
| 7 | Prüfen, ob die Mappe anders definiert | ja | A8 (Mappe: Objekt-IRR über 35 Jahre in drei Lesarten; statische Nettoanfangsrendite gleich Folie 21, Abweichung `K!D44:H44` = 0) |
| 8 | Objektrendite fair bei gefördertem Wohnraum (mit und ohne Zuschuss) | ja | Folie 21 (zwei Nenner), A8 (nach Förderbarwert) |
| 9 | Eigenkapitalrendite mit und ohne Restwert | ja | Folie 22, A8, Blatt 11 |
| 10 | Varianten A, B, C und frei im Zeitverlauf über 35 Jahre | ja | Folie 18, 19, 20, Blatt 11 |
| 11 | Gebundenes Eigenkapital und Rückfluss | ja | Folie 14, 20 |
| 12 | Restschuld und Vermögen am Ende der Bindung | ja | A7, Blatt 11 |
| 13 | Zeit nach Jahr 35 | ja | A7 (Jahr 36 bis 42, A bis C) |
| 14 | Risiken: Tilgungssatz, Herstellungskosten, Mietanpassung, Anschlusszins frei finanziert | ja | Folie 24, A9, A10, A11 |
| 15 | DSCR 1,2 als neue Annahme der PGN gekennzeichnet | ja | Folie 15 (N, grau), 16, 17, 20, 28, Blatt 9 und 10 |
| 16 | Miete für DSCR 1,2 als Formel, nicht Zielwertsuche | ja | gemeinsamer Block N2, `Konzepte!D12` (18,36 €) |
| 17 | Frei finanziert auf allen Folien dieselbe Miete; Mietanpassung wie in der Mappe | ja | 18,36 € überall, +2 % p. a. (`Eingaben!F26`) |
| 18 | Jede Folie mit frei finanzierter Zahl nennt 18,36 € und 15,42 € | ja | alle Folien und Blätter; Bedeutung von „Frei 18,36“ nicht auf jeder (Schwäche 23) |
| 19 | Restwert für alle Varianten aus der Marktmiete 15,42 € | ja | `Konzepte!D76:H76`, Folie 22 |
| 20 | A, B, C zur Höchstmiete; Miete für DSCR 1,2 von A, B, C als Vergleichszahl | ja | Folie 17, Blatt 10 |
| 21 | Für welches Darlehen gilt 1,2, was prüft die NBank; C unter 1,2 gezeigt und eingeordnet | ja | Folie 17, Blatt 10 |
| 22 | Fazit-Folie vor Kontakt über alle vier Abschnitte; Zusammenfassung 24 entfällt | ja | Folie 28 (Entwurf) |
| 23 | Liegt frei vorn: Annahmen und Risiko auf derselben Folie | ja | 16, 19, 20, 21, 22, 28 |
| 24 | Vergleiche symmetrisch | teilweise | überall A, B, C, Frei 18,36, Frei 15,42; Ausnahmen Folie 24 und A7 (Schwäche 19), „ohne“-Läufe im Fazit (Schwäche 17) |
| 25 | Ein Thema je Folie; kein kleiner, frei hängender Text | ja | Entwürfe geprüft; „Rechenbeispiel, keine Förderzusage“ im Modulkopf |
| 26 | Diagramme als native, editierbare Charts | ja für die Entwürfe | 16, 20 native; Skizzen sind Bilder und werden beim Bau native |
| 27 | Hinweise im grauen Kasten mit Info-Symbol, Light 12 pt; Stichpunkte 14 pt | ja | Entwürfe (Bausteine des Vortrags) |
| 28 | Feste Begriffe (Herstellungskosten, kostendeckende Anfangsmiete, jährliche Annuität über 30 Jahre) | ja | 17, Blatt 10, A7; „Förderkonditionen“ kommt im Kapitel nicht vor |
| 29 | Jede Zahl mit Blatt und Zelle | ja | `ZAHLEN.md` (1.040 Einträge), `Entwurf-Team-3.belege.json` (117), Fußzeilen der Skizzen |
| 30 | Nur Mappe v3 als Zahlenquelle, DSCR 1,2 einzige neue Annahme, keine Schätzung | ja | Block T3 nur Formeln auf bestehende Zellen |
| 31 | Mappe unverändert, neue Rechnung in Kopie als neuer Block, Prüfungen OK, Block frei 15,42 € bleibt | ja | Team-Mappe, Abschnitt 6; Status D3 auf Übersicht, Konzepte, Team 3 Vergleich = OK |

