# Konzept Team 2: Fragen eines Investors

Modellrechnung (Vortrag Kapitel 3, Anhang, Broschüre Blatt 9 bis 11) und Fazit-Folie. Nur Konzept: Vortrag, Broschüre und Rechenmappe bleiben unverändert.
Jede Zahl steht mit Wert, Rundung und Blatt!Zelle in `ZAHLEN.md` (erzeugt aus den Mappen, 792 Einträge). Hier stehen die Zahlen gerundet, wie auf der Folie,
und die Fundstelle in Kurzform.

Kurzformen der Fundstellen:
**Konzepte-Mappe** = `konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx` (Werte in `werte_konzepte.json`, Lauf „konzepte“).
**N6 &lt;lauf&gt;** = `konzepte/mappe/laeufe/<lauf>.xlsx`, Blatt Konzepte, gleiche Zelle wie im Hauptlauf.
**T2** = Team-2-Kopie `konzepte/team-2/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team2.xlsx`, Blatt „Team 2“ (Werte in `team-2/mappe/werte_team.json`).
**R1** = `konzepte/team-2/mappe/laeufe/liegenschaftszins_plus_0_60.xlsx`, Blatt Konzepte.
Zeitreihen: Blatt „Konzepte Zeitreihe“, Zeile = 6 + Jahr; Spalten je Variante: A C bis K, B L bis T, C U bis AC, frei finanziert (Miete für DSCR 1,2) AM bis AU.

Varianten auf allen Folien in derselben Reihenfolge: **A, B, C, frei finanziert**. „Frei finanziert“ heißt immer: Miete 18,36 € je m² in Jahr 1, die Miete,
bei der die DSCR in Jahr 1 genau 1,2 ist (Konzepte!D12). Die Rechnung zur Marktmiete 15,42 € (Blatt Frei finanziert, Spalte G auf Konzepte) zeigt
das Konzept nur als Risiko auf Folie 25.

**Mietzeile frei finanziert** (fester Baustein jeder Folie mit einer frei finanzierten Zahl, als Kategorietext oder Spaltenkopf):
„frei finanziert“ und darunter „18,36 € je m², Markt 15,42 €“ (Konzepte!D12, Konzepte!D13). Die Gruppen tragen symmetrisch ihre Miete:
„A“ und darunter „6,80 € je m²“ (B 8,20 €, C 9,00 €; Konzepte!D49:F49).

---

## 1 · Leitidee

Die Modellrechnung beantwortet die vier Fragen eines Investors in der Reihenfolge, in der er sie stellt: Was setze ich ein, was bleibt mir jedes Jahr,
was gehört mir am Ende, was kann schiefgehen. Jede Antwort zeigt dasselbe Haus in vier Varianten auf derselben Achse; frei finanziert rechnet mit der Miete,
die die Bank für DSCR 1,2 verlangt (18,36 €), und nennt daneben immer die Marktmiete (15,42 €), damit sichtbar bleibt, was der Vorsprung kostet.

---

## 2 · Folienfolge Kapitel 3

Kapitel 3 hat 13 Folien (heute 12: 13 bis 24). Folie 24 (Zusammenfassung) entfällt; die Fazit-Folie steht als Folie 29 vor der Schlussfolie (siehe Abschnitt 5 dieses Konzepts).
Neue Nummern danach: 26 Trenner Umsetzung, 27 Antragsweg, 28 PGN-Leistungen, 29 Fazit, 30 Kontakt. Hauptteil 30 Folien statt 28.

Gliederung nach den Fragen:

| Frage | Folien |
|---|---|
| Was gilt? | 14 Annahmen |
| Was setze ich ein? | 15 Einsatz, 16 Miete für DSCR 1,2 |
| Was bleibt mir jedes Jahr? | 17 Jahr 1, 18 Zahlungsüberschuss bis Jahr 42, 19 Rückfluss des Eigenkapitals, 20 DSCR im Verlauf |
| Was bringt mein Geld? | 21 Objektrendite, 22 Eigenkapitalrendite |
| Was gehört mir am Ende? | 23 Vermögen Ende Jahr 35 |
| Was kann schiefgehen? | 24 Herstellungskosten der PGN, 25 Risiken |

Farben in allen Diagrammen (Muster 2, Rot nur für den Zuschuss): Varianten als Kategorie: A, B, C in Tinte, frei finanziert in Referenzgrau 77716B (wie heute
Folien 16 und 19). Varianten als Linie: A Tinte durchgezogen, B Tinte gestrichelt, C Tinte gepunktet, frei finanziert Referenzgrau durchgezogen. Das ändert die
Farbe von C gegenüber heute (Folien 20, 21: C in Referenzgrau), weil Referenzgrau nach der Bibliothek frei finanziert bedeutet. Achskreise A, B, C an den
Linienenden, für frei finanziert der Schriftzug „frei“.

### Hauptteil

#### 13 · Modellrechnung: Einsatz, Überschuss, Vermögen, Risiko (Trenner, ändert sich)

- Layout `PGN_ABSCHNITT_ROT`, Achskreis XL „3“. Titel in drei Zeilen: „Modellrechnung:“ | „Einsatz, Überschuss,“ | „Vermögen, Risiko“; Signaturwort nach G10: „Einsatz, Überschuss, Vermögen, Risiko“.
- Lead: „Ein PGN-Projekt in Neu Wulmstorf, 14 Wohnungen, 828 m². Gefördert in A, B und C und frei finanziert: was Sie einsetzen, was bleibt, was Ihnen gehört, was schiefgehen kann.“
- Daten: Wohnungen Eingaben!F9, Wohnfläche Eingaben!F8.
- Folgeänderung außerhalb von Kapitel 3: Die Agenda (Folie 7) nennt bei „3 Modellrechnung“ dieselben Themen.

#### 14 · Alle vier Varianten rechnen mit demselben Haus und denselben Kosten (neu)

- Kicker „MODELLRECHNUNG · ANNAHMEN“. Titel: „Alle vier Varianten rechnen mit“ | „demselben Haus und denselben Kosten“ (Signaturwort „demselben Haus“).
- Darstellung: `PGN_INHALT_MR`, zwei native Tabellen nebeneinander (6 + 6 Spalten), je drei Spalten „Annahme“ · „Wert“ · „Herkunft“, 12 pt, Zeilen 0,24 Zoll,
  je 14 Zeilen. Links Modulkopf „Haus, Miete, Bewirtschaftung“, rechts „Finanzierung und Rechnung“. Herkunft als kurzes Wort: „RL 5.4.4“ (Richtlinie mit Nummer),
  „Gesetz“, „Quelle“, „Projekt“ (Projektdaten PGN), „PGN“ (Annahme der PGN), „Formel“. Die eine neue Annahme (DSCR 1,2) steht mit „PGN, neu“ und weißer
  Hervorhebung der Zeile. Kein Hinweiskasten; die Erklärung der Herkunftswörter steht als Untertitel unter beiden Modulköpfen. Volle Fundstellen: Quellenfolie.
- Links: 1 Modellhaus: 14 Wohnungen, 828 m², Mietenstufe VI, Effizienzhaus 55, Bezug 2027 · Projekt | 2 Herstellungskosten 3.579 € je m², 2.963.412 € · Projekt |
  3 Grundstück im Bestand, 0 € angesetzt, auch im Restwert; KG 800 0 € · Projekt, PGN | 4 Höchstmiete A, B, C 6,80 | 8,20 | 9,00 € je m² · RL 5.4.4 |
  5 Mietanpassung gefördert: 3 Jahre fest, dann alle 3 Jahre +6,15 % · RL 5.4.5 | 6 Belegungs- und Mietbindung 35 Jahre · RL 5.4.1 |
  7 Nach der Bindung +20 % in 3 Jahren bis zur Vergleichsmiete, Jahr 1 12,92 € · Gesetz, Quelle | 8 Marktmiete Jahr 1 15,42 € je m² · Quelle |
  9 Miete frei finanziert Jahr 1 18,36 € je m², Miete für DSCR 1,2 · Formel | 10 Mietanpassung frei finanziert +2 % p. a. · PGN |
  11 Mietausfall/Leerstand 2 % · PGN | 12 Objektverwaltung 367 € je Wohnung p. a. · PGN | 13 Instandhaltung 14,40 € je m² p. a. · PGN |
  14 Kostensteigerung ab Jahr 2: 2 % p. a., Kostenstand 2026 · PGN.
- Rechts: 1 Zuschuss | NBank-Darlehen: A 40 | 40 %, B 20 | 60 %, C 10 | 70 % · RL 5.3.3 | 2 Eigenmittel mindestens 20 %, kein zusätzliches Eigenkapital · RL 5.2.6, PGN |
  3 Bemessungsgrenze 5.460 € je m², eingehalten · RL 5.3.2.2 | 4 Zins NBank-Darlehen 0 % bis Jahr 35, danach 3,86 % · RL 5.3.4, PGN |
  5 Tilgung NBank-Darlehen 2,38 % p. a., gleichmäßig über 42 Jahre, ohne Aufschub · PGN | 6 Verwaltungskostenbeitrag 0,5 % des Restkapitals p. a. · RL 12.7.1 |
  7 Bearbeitungsentgelt einmalig 1 % des Darlehens, 0,75 % des Zuschusses · RL 12.7.2, 12.7.3 | 8 Bankdarlehen frei finanziert 2.370.730 €, gleiche Eigenmittel · Formel |
  9 Zins Bankdarlehen 3,86 %, 10 Jahre fest, Anschlusszins 3,86 % · Quelle, PGN | 10 Tilgung Bankdarlehen: jährliche Annuität über 30 Jahre · PGN |
  11 DSCR, die die Bank verlangt: 1,2; kostendeckend: 1,0 · PGN, neu | 12 Projektkonto: Guthabenzins 2 %, Sollzins 5 % · PGN |
  13 Restwert Ende Jahr 35: Ertragswert, Liegenschaftszins 2,80 %, Nutzungsdauer 80 Jahre, Zielmiete Marktmiete, ohne Verkaufskosten · Quelle, PGN |
  14 Rechnung vor Steuern, ab Bezug, Szenariofaktoren neutral · PGN.
- Daten: Eingaben!F7:F54 (alle Eingaben Projekt 2), Tabellen!D5:F6, C14:F14, D18:D33, Konzepte!D6, D12, D52, H55, Übersicht!D106. Einzeln in `ZAHLEN.md`, Abschnitt F14.
- Prüfung im Modul: jede Annahme aus ANNAHMEN.md der gemeinsamen Mappe kommt in einer Zeile vor (Liste gegen Liste), auch die ohne Wirkung (Bodenwertsteigerung 1,5 %, Zeile 3 links, als Zusatz „ohne Wirkung“).

#### 15 · Sie setzen in allen vier Varianten rund 0,6 Mio. € Eigenkapital ein (ändert heute 14)

- Kicker „MODELLRECHNUNG · EINSATZ“. Titel: „Sie setzen in allen vier Varianten“ | „rund 0,6 Mio. € Eigenkapital ein“ (Signaturwort „0,6 Mio. €“).
- Darstellung: `PGN_DIAGRAMM_MR`. Links (7 Spalten) natives gestapeltes Balkendiagramm, waagerecht, vier Kategorien A, B, C, frei finanziert (Kategorietext mit
  Mietzeile). Segmente von links: Zuschuss (Rot), NBank-Darlehen (Tinte), Bankdarlehen (Referenzgrau), Eigenmittel (Schraffur), Bearbeitungsentgelte (hell B4B0AB,
  beschriftet, rechts außerhalb der Gesamtkosten). Achse 0 bis 3,0 Mio. €, Schritt 0,5. Maßlinie bei 2,96 Mio. € „Gesamtkosten, in allen Varianten gleich“.
  Rechts (5 Spalten) Tabelle „Eigenkapital in €“: Eigenmittel 592.682 (alle) · + Bearbeitungsentgelte 20.744 | 22.226 | 22.966 | 0 · = Eigenkapital bei Bezug
  613.426 | 614.908 | 615.649 | 592.682 (Ergebniszeile). Darunter Stichpunkte 14 pt „Was die Regeln verlangen“: „Eigenmittel mindestens 20 % der Kosten“ ·
  „gefördert kommen einmalig die Bearbeitungsentgelte dazu“ · „frei finanziert ersetzt das Bankdarlehen Zuschuss und NBank-Darlehen“.
- Daten: Gesamtkosten Konzepte!D52:H52; Zuschuss Konzepte!D53:F53; NBank-Darlehen Konzepte!D54:F54; Bankdarlehen Konzepte!H55; Eigenmittel Übersicht!D19:G19;
  Bearbeitungsentgelte Konzepte!D57:F57; Eigenkapital Konzepte!D56:F56, H56; Mietzeile Konzepte!D49:H49, D13.
- Prüfung: Zuschuss + Darlehen + Eigenmittel = Gesamtkosten (gefördert); Bankdarlehen + Eigenmittel = Gesamtkosten (frei); Eigenmittel + Entgelte = Eigenkapital.

#### 16 · Für DSCR 1,2 braucht frei finanziert 18,36 € Miete, der Markt zahlt 15,42 € (Schlüsselfolie, ersetzt heute 19)

- Kicker „MODELLRECHNUNG · MIETE FÜR DSCR 1,2“. Titel: „Für DSCR 1,2 braucht frei finanziert“ | „18,36 € Miete, der Markt zahlt 15,42 €“ (Signaturwort „18,36 €“).
- Darstellung: `PGN_DIAGRAMM_MR`. Links (7 Spalten) natives gruppiertes Balkendiagramm, waagerecht, Kategorien A, B, C, frei finanziert, zwei Reihen je Kategorie:
  „kostendeckende Anfangsmiete, DSCR 1,0“ (hell B4B0AB) und „Miete für DSCR 1,2“ (Tinte; frei finanziert Referenzgrau). Je Kategorie eine senkrechte Marke als Form
  (0,75 pt Anthrazit) mit Beschriftung: bei A, B, C „Höchstmiete 6,80 € | 8,20 € | 9,00 €“, bei frei finanziert „Marktmiete 15,42 €“. Werte am Balkenende.
  Achse 0 bis 20 € je m², Schritt 4. Hinweiskasten unter dem Diagramm (so breit wie dieses): „Die 1,2 gilt für das Bankdarlehen frei finanziert und ist eine Annahme der PGN.
  Gefördert gibt es im Modell kein Bankdarlehen. Dort misst die DSCR die Deckung des NBank-Darlehens, die 1,2 ist nur ein Vergleich. Die NBank prüft stattdessen
  Eigenmittel, Tilgungssatz und angemessenen Gewinn.“
  Rechts (5 Spalten) Tabelle „Rechenweg frei finanziert, Jahr 1, in €“: 1 Kapitaldienst Bankdarlehen 134.779 · 2 × 1,2 = Überschuss vor Kapitaldienst 161.734 ·
  3 + Objektverwaltung und Instandhaltung 17.061 · 4 ÷ 98 % (Mietausfall 2 %) = Sollmiete 182.444 · 5 ÷ 828 m² ÷ 12 Monate = 18,36 € je m² (Ergebniszeile).
  Darunter Stichpunkte „Ergebnis“: „A und B erreichen 1,2 mit der Höchstmiete“ · „C fehlen 0,12 € je m², DSCR 1,18 in Jahr 1 bis 3“ · „frei finanziert liegt die Miete für DSCR 1,2 19,1 % über dem Markt“.
- Daten: kostendeckende Anfangsmiete Übersicht!D112:G112 (frei finanziert G112, gilt für beide Mieten, weil der Kapitaldienst gleich ist); Miete für DSCR 1,2
  Konzepte!D50:F50, D12; Höchstmiete Konzepte!D19:F19; Marktmiete Konzepte!D13; Rechenweg Konzepte!D10, D6, H59, D11, Eingaben!F29, Frei DSCR 1,2!E7, Eingaben!F8, Konzepte!D12;
  DSCR Jahr 1 Konzepte!D21:F21; „ja/nein“ Konzepte!D24:F24; Abstand C Konzepte!F23; Jahre unter 1,2 Konzepte!F26; Aufschlag Konzepte!D14.
- Prüfung: Rechenweg ergibt Konzepte!D12 (Formel, keine Zielwertsuche; Gegenprobe Konzepte!D15 = 1,2); Konzepte!F24 = „nein“ ist der Grund für den Satz zu C.
- Einordnung von C (Wortlaut der Stichpunkte, keine Wertung): C hat in Jahr 1 einen Zahlungsüberschuss von 10.812 € und kein Jahr mit Fehlbetrag; die DSCR liegt
  1,18-fach, ab Jahr 4 nach der ersten Mieterhöhung bei 1,27 (Folie 20). Für das NBank-Darlehen gibt es keine DSCR-Vorgabe.

#### 17 · In Jahr 1 bleibt in allen vier Varianten ein Zahlungsüberschuss, in A 15.003 € (ändert heute 15, nimmt heute 16 auf)

- Kicker „MODELLRECHNUNG · JAHR 1“. Titel: „In Jahr 1 bleibt in allen vier Varianten“ | „ein Zahlungsüberschuss, in A 15.003 €“ (Signaturwort „15.003 €“).
- Darstellung: `PGN_TABELLE_MR`. Links (8 Spalten) Rechenblatt-Tabelle wie heute Folie 15, Spalten Nr · Position · A · B · C · frei finanziert (Spaltenköpfe A, B, C als
  Achskreise, „FREI“ als Wort mit Mietzeile). Zeilen nach G2: 1 Sollmiete 67.565 | 81.475 | 89.424 | 182.444 · 2 − Mietausfall/Leerstand, 2 % 1.351 | 1.630 | 1.788 | 3.649 ·
  3 − Objektverwaltung 5.138 (alle) · 4 − Instandhaltung 11.923 (alle) · 5 = Überschuss vor Kapitaldienst 49.152 | 62.784 | 70.574 | 161.734 ·
  6 − Verwaltungskostenbeitrag, 0,5 % 5.927 | 8.890 | 10.372 | – · 7 − Zins: NBank 0 %, Bank 3,86 % 0 | 0 | 0 | 91.510 ·
  8 − Tilgung: NBank 2,38 %, Bank jährliche Annuität 28.223 | 42.334 | 49.390 | 43.268 · 9 = Zahlungsüberschuss 15.003 | 11.560 | 10.812 | 26.956 (Ergebniszeile).
  Ohne Nummer darunter zwei Zeilen: „Kapitaldienst, Zeilen 6 bis 8“ 34.150 | 51.225 | 59.762 | 134.779 und „DSCR, Zeile 5 ÷ Kapitaldienst“ 1,44 | 1,23 | 1,18 | 1,20.
  Hinweiskasten unter der Tabelle: „Einmalig, außerhalb der Jahresrechnung: Bearbeitungsentgelte 20.744 | 22.226 | 22.966 €. Frei finanziert: Miete 18,36 € je m² für DSCR 1,2, Marktmiete 15,42 €.“
  Rechts (4 Spalten) Stichpunkte „Was hereinkommt“: „gefördert die Höchstmiete, frei finanziert 18,36 €“ · „Was hinausgeht“: „Bewirtschaftung gleich in allen vier Varianten“ ·
  „gefördert 0 % Zins bis Jahr 35, frei finanziert 91.510 € Zins“ · „Was bleibt“: „frei finanziert am meisten, aber nur mit 18,36 € Miete“.
- Daten: Übersicht!D29:F38 (Zeilen 1 bis 4, 6 bis 8 gefördert); Frei DSCR 1,2!E7:H7, J7, K7 (frei finanziert); Konzepte!D59:H59 (Zeile 5), D61:H61 (Zeile 9),
  D60:H60 (Kapitaldienst), D62:H62 (DSCR), D57:F57 (Entgelte); Sätze Eingaben!F29:F31, F17, F35, Tabellen!D23.
- Prüfung: Summenproben je Spalte wie heute Folie 15; Zeile 9 = Konzepte Zeile 61; DSCR = Zeile 5 ÷ Kapitaldienst.

#### 18 · Kein Jahr mit Fehlbetrag, in A wächst der Zahlungsüberschuss auf 64.860 € (ändert heute 21)

- Kicker „MODELLRECHNUNG · ZAHLUNGSÜBERSCHUSS“. Titel: „Kein Jahr mit Fehlbetrag, in A wächst“ | „der Zahlungsüberschuss auf 64.860 €“ (Signaturwort „64.860 €“).
- Darstellung: `PGN_DIAGRAMM_MR`. Links (7 Spalten) natives Liniendiagramm, Jahr 1 bis 42, vier Linien; y-Achse 0 bis 400.000 €, Schritt 50.000. Zwei senkrechte Marken:
  Jahr 30 „Bankdarlehen getilgt“, Jahr 35 „Ende der Bindung“. Werte an den Linienenden bei Jahr 35. Hinweiskasten unter dem Diagramm: „Frei finanziert: Miete 18,36 € je m²
  für DSCR 1,2, Marktmiete 15,42 €, beide +2 % p. a.; ab Jahr 31 kein Kapitaldienst. Gefördert: Höchstmiete alle drei Jahre +6,15 %; ab Jahr 36 Zins 3,86 % auf die Restschuld,
  Miete bis zur Vergleichsmiete.“
  Rechts (5 Spalten) Tabelle „Zahlungsüberschuss in € p. a.“, Spalten A · B · C · frei finanziert: Jahr 1 15.003 | 11.560 | 10.812 | 26.956 · Jahr 10 25.927 | 25.792 | 26.890 | 58.509 ·
  Jahr 20 38.402 | 42.170 | 45.447 | 100.838 · Jahr 30 52.944 | 61.241 | 67.056 | 152.437 · Jahr 35 64.860 | 76.468 | 84.149 | 317.109 · Jahr 42 115.957 | 139.078 | 153.343 | 364.258 ·
  Summenzeile „kumuliert Jahr 1 bis 35, Mio. €“ 1,29 | 1,40 | 1,51 | 4,04 · „Jahre mit Fehlbetrag, Jahr 1 bis 42“ 0 | 0 | 0 | 0 · „tiefster Stand Projektkonto“ 0 | 0 | 0 | 0 €.
- Daten: Konzepte Zeitreihe Spalten F, O, X, AP (Zeilen 7 bis 48; Jahr 1, 10, 20, 30, 35, 42 = Zeilen 7, 16, 26, 36, 41, 48); Konzepte!D66:F66, H66; D68:F68, H68; D92:F92, H92; D70:F70, H70;
  Marken Eingaben!F38 (30), Tabellen!D26 (35).
- Prüfung: kein Wert der vier Reihen unter null; Titelzahl = Konzepte!D64.
- Liegt vorn: frei finanziert. Unter welchen Annahmen: Miete 18,36 € (19,1 % über dem Markt) und +2 % p. a.; Risiko: Folie 25 (ohne Mietsteigerung).

#### 19 · Gefördert ist Ihr Eigenkapital zurück in 22 bis 23 Jahren, frei finanziert in 13 (neu)

- Kicker „MODELLRECHNUNG · RÜCKFLUSS“. Titel: „Gefördert ist Ihr Eigenkapital zurück“ | „in 22 bis 23 Jahren, frei finanziert in 13“ (Signaturwort „22 bis 23 Jahren“).
- Darstellung: `PGN_DIAGRAMM_MR`. Links (7 Spalten) natives Liniendiagramm „Noch gebundenes Eigenkapital“, Jahr 0 bis 35, vier Linien von 0,59 bis 0,62 Mio. € bis null;
  y-Achse 0 bis 700.000 €, Schritt 100.000. Punkt und Jahreszahl, wo jede Linie null erreicht (13, 22, 23). Hinweiskasten: „Gebunden ist das Eigenkapital, das der
  Zahlungsüberschuss noch nicht zurückgezahlt hat, ohne Zinsen. Ein Fehlbetrag würde es erhöhen; es gibt keinen. Frei finanziert: Miete 18,36 € je m², Marktmiete 15,42 €.“
  Rechts (5 Spalten) Tabelle: „Eigenkapital bei Bezug“ 613.426 | 614.908 | 615.649 | 592.682 · „noch gebunden nach 10 Jahren“ 422.871 | 445.231 | 445.933 | 169.523 ·
  „zurück in Jahr“ 23 | 23 | 22 | 13 (Ergebniszeile) · „Zahlungsüberschuss bis Jahr 35, Mio. €“ 1,29 | 1,40 | 1,51 | 4,04. Stichpunkte: „Gefördert bindet der
  Kapitaldienst des NBank-Darlehens den Überschuss der ersten Jahre“ · „frei finanziert schneller, weil die Miete 18,36 € beträgt“.
- Daten: neuer Block T2 (T2!C6:G41, Jahr 0 bis 35; Zurück-Jahr T2!C49:G49 mit Gegenprobe Konzepte!D67:H67, T2!C51:G51 = „OK“); Eigenkapital Konzepte!D56:F56, H56; kumuliert Konzepte!D66:F66, H66.
- Liegt vorn: frei finanziert, unter der Annahme 18,36 €.

#### 20 · Nur Gruppe C liegt in Jahr 1 bis 3 unter DSCR 1,2, danach steigt sie überall (neu)

- Kicker „MODELLRECHNUNG · DSCR IM VERLAUF“. Titel: „Nur Gruppe C liegt in Jahr 1 bis 3 unter“ | „DSCR 1,2, danach steigt sie überall“ (Signaturwort „Jahr 1 bis 3“).
- Darstellung: `PGN_DIAGRAMM_MR`. Links (7 Spalten) natives Liniendiagramm DSCR, Jahr 1 bis 35, vier Linien (frei finanziert endet nach Jahr 30, danach kein Kapitaldienst);
  y-Achse 0,8 bis 3,4, Schritt 0,4; waagerechte Bezugslinie bei 1,2 mit Beschriftung „1,2: Annahme der Bank, frei finanziert“. Werte bei Jahr 1 an den Linien.
  Hinweiskasten: „DSCR = Überschuss vor Kapitaldienst ÷ Kapitaldienst. Gefördert ist es der Kapitaldienst des NBank-Darlehens, frei finanziert der des Bankdarlehens.
  Frei finanziert: Miete 18,36 € je m², Marktmiete 15,42 €.“
  Rechts (5 Spalten) Tabelle „DSCR“: Jahr 1 1,44 | 1,23 | 1,18 | 1,20 · Minimum Jahr 1 bis 35 1,43 | 1,22 | 1,18 | 1,20 · Jahre unter 1,2 0 | 0 | 3 | 0 ·
  Jahr 30 2,76 | 2,36 | 2,27 | 2,13 · Jahr 35 3,21 | 2,74 | 2,64 | –. Stichpunkte „Wofür die 1,2 gilt“: „frei finanziert verlangt sie die Bank (Annahme der PGN)“ ·
  „gefördert ist sie ein Vergleich, die NBank gibt keine vor“ · „gefördert hängt die DSCR am Tilgungssatz: bei 2,90 % liegen B 8 und C 9 Jahre unter 1,2 (Folie 25)“.
- Daten: Konzepte Zeitreihe Spalten H, Q, Z, AR (Zeilen 7 bis 41); Konzepte!D62:H62, D71:H71, D73:H73, D72:F72 (H72 „–“); Jahr 30 Konzepte Zeitreihe!H36, Q36, Z36, AR36;
  C Jahr 4 Konzepte Zeitreihe!Z10 (1,27); Lauf N6 tilgung_2_90 Konzepte!E73, F73.
- Einordnung der Gruppe unter 1,2: siehe Folie 16; die drei Jahre enden mit der ersten Mieterhöhung nach drei Jahren (Tabellen!D27).

#### 21 · Gefördert bringt das Haus 1,66 bis 2,38 %, nach Abzug des Zuschusses bis 2,76 % (neu)

- Kicker „MODELLRECHNUNG · OBJEKTRENDITE“. Titel: „Gefördert bringt das Haus 1,66 bis 2,38 %,“ | „nach Abzug des Zuschusses bis 2,76 %“ (Signaturwort „bis 2,76 %“).
- Darstellung: `PGN_DIAGRAMM_MR`. Links (7 Spalten) natives gruppiertes Säulendiagramm, Kategorien A, B, C, frei finanziert, zwei Reihen: „auf die Gesamtkosten“ (Tinte;
  frei finanziert Referenzgrau) und „auf die Gesamtkosten nach Zuschuss“ (hell B4B0AB, beschriftet; bei frei finanziert keine Säule, Text „kein Zuschuss“).
  Achse 0 bis 6 %, Schritt 1. Passgenau darunter Tabelle: „Miete Jahr 1 je m²“ 6,80 | 8,20 | 9,00 | 18,36 · „Überschuss vor Kapitaldienst Jahr 1“ 49.152 | 62.784 | 70.574 | 161.734 ·
  „Gesamtkosten nach Zuschuss“ 1.778.047 | 2.370.730 | 2.667.071 | 2.963.412.
  Rechts (5 Spalten) Stichpunkte „Was die Zahl misst“: „Überschuss vor Kapitaldienst Jahr 1 ÷ Gesamtkosten, ohne Finanzierung“ · „die Mappe nennt sie Nettoanfangsrendite;
  gleich, weil keine Finanzierungskosten angesetzt sind“ · „Fair gerechnet“: „der Zuschuss senkt die Kosten, die Sie tragen: zweite Säule“ · „frei finanziert liegt vorn,
  weil die Miete 18,36 € statt 6,80 bis 9,00 € beträgt“.
- Daten: Konzepte!D87:H87 (auf Gesamtkosten), D88:F88 (nach Zuschuss); Nettoanfangsrendite der Mappe Konzepte!D43:H43, Abweichung D44:H44 = 0; Konzepte!D59:H59, D49:H49,
  D37 (2.963.412), D38:F38; gerechnet: Gesamtkosten − Zuschuss (Nenner von Konzepte!D42).
- Mappe definiert anders? Ja, dem Namen nach: Zeile 139 „Nettoanfangsrendite“ teilt durch die Objektinvestition ohne KG 800 (H94); im Modellhaus ist KG 800 = 0 (Eingaben!F12), die Werte sind gleich (Konzepte!D44:H44 = 0).
- Liegt vorn: frei finanziert (5,46 %), weil die Miete 19,1 % über dem Markt angesetzt ist.

#### 22 · Ohne Restwert bringt Ihr Eigenkapital gefördert 2,58 bis 2,75 % im Jahr (neu, ersetzt A6)

- Kicker „MODELLRECHNUNG · EIGENKAPITALRENDITE“. Titel: „Ohne Restwert bringt Ihr Eigenkapital“ | „gefördert 2,58 bis 2,75 % im Jahr“ (Signaturwort „2,58 bis 2,75 %“).
- Darstellung: `PGN_DIAGRAMM_MR`. Links (7 Spalten) natives gruppiertes Balkendiagramm, waagerecht, Kategorien A, B, C, frei finanziert (Mietzeile), zwei Reihen
  „ohne Restwert“ (hell B4B0AB) und „mit Restwert“ (Tinte; frei finanziert Referenzgrau). Achse 0 bis 10 %, Schritt 2. Werte am Balkenende mit zwei Nachkommastellen.
  Hinweiskasten: „Eigenkapitalrendite: Zinssatz, zu dem das Eigenkapital bei Bezug in 35 Jahren auf das Endvermögen wächst. Überschüsse liegen auf dem Projektkonto zu 2 %.
  Mit Restwert zählt das Haus zum Ertragswert Ende Jahr 35, ohne Restwert nur Projektkonto minus Restschuld.“
  Rechts (5 Spalten) Tabelle: „Eigenkapital bei Bezug“ 613.426 | 614.908 | 615.649 | 592.682 · „Vermögen Ende Jahr 35, Mio. €“ 6,65 | 7,19 | 7,49 | 11,82 ·
  „Restwertanteil“ 78 | 79 | 79 | 57 %. Stichpunkte: „Gefördert stammen gut drei Viertel des Ergebnisses aus dem Restwert“ · „frei finanziert liegt vorn: 6,32 % ohne, 8,93 % mit Restwert,
  nur mit 18,36 € Miete und +2 % p. a.“ · „ohne Mietsteigerung 5,81 % mit Restwert (Folie 25)“.
- Daten: Konzepte!D81:H81, D82:H82, D83:H83, D56:F56, H56, D78:H78; Lauf N6 mietsteigerung_0 Konzepte!H81.
- Die Wörter IRR und VOFI stehen nicht auf der Folie; die EK-IRR (Konzepte!D84:H85) steht im Anhang A6.

#### 23 · Nach 35 Jahren gehören Ihnen in A 6,65 Mio. €, davon 78 % Restwert (neu)

- Kicker „MODELLRECHNUNG · VERMÖGEN“. Titel: „Nach 35 Jahren gehören Ihnen in A“ | „6,65 Mio. €, davon 78 % Restwert“ (Signaturwort „6,65 Mio. €“).
- Darstellung: `PGN_DIAGRAMM_MR`. Links (7 Spalten) natives gestapeltes Säulendiagramm mit negativem Teil: je Variante Restwert (Tinte; frei finanziert Referenzgrau) und
  Projektkonto (hell B4B0AB) über null, Restschuld (Schraffur) unter null; Summe „Vermögen“ als Wert über der Säule (5,15 + 1,69 − 0,20 = 6,65 Mio. € in A).
  y-Achse −1 bis 13 Mio. €, Schritt 2. Passgenau darunter Tabelle: Restwert 5,15 | 5,67 | 5,90 | 6,76 · Projektkonto 1,69 | 1,81 | 1,94 | 5,06 · − Restschuld 0,20 | 0,30 | 0,35 | 0,00 ·
  = Vermögen Ende Jahr 35 6,65 | 7,19 | 7,49 | 11,82 (Ergebniszeile) · ohne Restwert 1,49 | 1,51 | 1,59 | 5,06 · Vermögen Ende Jahr 42 8,89 | 9,60 | 9,99 | 15,57 (alle in Mio. €).
  Rechts (5 Spalten) Stichpunkte „Restwert“: „Ertragswert Ende Jahr 35, Liegenschaftszins 2,80 %“ · „gefördert steigt die Miete erst nach der Bindung zur Marktmiete:
  in A 1,61 Mio. € unter dem Ertragswert zur Marktmiete von 6,76 Mio. €“ · „Restschuld“: „NBank-Darlehen bis Jahr 42 getilgt, Bankdarlehen bis Jahr 30“ ·
  „frei finanziert liegt vorn, mit 18,36 € Miete (Markt 15,42 €)“.
- Daten: Konzepte!D76:H76, D77:H77, D75:H75, D78:H78, D79:H79, D83:H83, D94:H94, D93:H93; Ertragswert zur Marktmiete (Zielmiete) Gefördert A!I122, B!I122, C!I122 (je 6,76 Mio. €); Abschlag Gefördert A!I124 1,61 Mio. €, B!I124 1,09 Mio. €, C!I124 0,86 Mio. €; Liegenschaftszins Gefördert A!I120.
- Prüfung: Restwert + Projektkonto − Restschuld = Vermögen je Variante (Konzepte Zeile 76 + 77 − 75 = 78).

#### 24 · Herstellungskosten der PGN liegen 22,7 % unter dem ARGE-Median (bleibt, heute 22)

- Unverändert; neu nur die Stellung: Sie leitet die Frage „Was kann schiefgehen?“ ein, weil Folie 25 mit 4.631 € (ARGE-Median) und 5.460 € (Bemessungsgrenze) rechnet.
- Daten wie heute (praesentation/daten/markt.json; Ansatz 3.579 € = Eingaben!F11).

#### 25 · Gefördert drücken Tilgung und Kosten, frei finanziert Miete und Mietsteigerung (Schlüsselfolie, ersetzt heute 20 und 23)

- Kicker „MODELLRECHNUNG · RISIKEN“. Titel: „Gefördert drücken Tilgung und Kosten,“ | „frei finanziert Miete und Mietsteigerung“ (Signaturwort „Tilgung und Kosten“).
- Darstellung: `PGN_INHALT_MR`, eine native Tabelle über 12 Spalten, zwei Blöcke nebeneinander mit denselben Spalten in derselben Reihenfolge: links „Jahre mit Fehlbetrag,
  Jahr 1 bis 35“, rechts „Eigenkapitalrendite mit Restwert“, je A · B · C · frei finanziert. Zellen mit Abweichung von der Basis grau hinterlegt (E9E7E4), je stärker,
  desto dunkler in zwei Stufen (Liquidität: 1 bis 5 Jahre, ab 6 Jahre; Rendite: bis 1 Prozentpunkt, mehr als 1 Prozentpunkt unter Basis). Zeilen (Änderung · Fundstelle):

  | Änderung | Fehlbetrag A | B | C | frei | Rendite A | B | C | frei |
  |---|---|---|---|---|---|---|---|---|
  | Basis (Modellhaus) | 0 | 0 | 0 | 0 | 7,05 % | 7,28 % | 7,40 % | 8,93 % |
  | Tilgung NBank-Darlehen 2,90 % | 0 | 0 | 1 | 0 | 7,01 % | 7,23 % | 7,35 % | 8,93 % |
  | Tilgung NBank-Darlehen 3,65 % | 3 | 9 | 9 | 0 | 6,97 % | 7,16 % | 7,25 % | 8,93 % |
  | Herstellungskosten 4.631 € je m² | 0 | 3 | 6 | 0 ¹ | 6,01 % | 6,13 % | 6,21 % | 8,50 % ¹ |
  | Herstellungskosten 5.460 € je m² | 3 | 12 | 12 | 0 ¹ | 5,30 % | 5,27 % | 5,25 % | 8,25 % ¹ |
  | keine Mieterhöhung in der Bindung | 0 | 0 | 0 | 0 | 5,08 % | 5,37 % | 5,54 % | 8,93 % |
  | keine Mietsteigerung am Markt | 0 | 0 | 0 | 0 ² | 5,42 % | 5,30 % | 5,20 % | 5,81 % |
  | Anschlusszins 4,86 % | 0 | 0 | 0 | 0 | 7,05 % | 7,28 % | 7,40 % | 8,84 % |
  | Anschlusszins 2,86 % | 0 | 0 | 0 | 0 | 7,05 % | 7,28 % | 7,40 % | 9,01 % |
  | Liegenschaftszins 3,40 % statt 2,80 % | 0 | 0 | 0 | 0 | 6,76 % | 7,00 % | 7,13 % | 8,75 % |
  | Markt zahlt nur 15,42 € | – | – | – | 1 | – | – | – | 8,36 % |

  In der Folie stehen ¹ und ² nicht als Fußnote, sondern als zweite Zeile in der Zelle (12 pt grau): ¹ „Miete 23,24 €“ bzw. „Miete 27,09 €“ (die Bank verlangt bei höheren
  Kosten mehr Miete für 1,2), ² „DSCR 29 Jahre unter 1,2“.
  Hinweiskasten unter der Tabelle über 12 Spalten: „Zahlt der Markt nur 15,42 €, liegt die DSCR in Jahr 1 bei 0,99. Die Bank gibt dann bei 1,2 höchstens 1,95 Mio. € Darlehen,
  66 % der Kosten. Sie setzen 0,42 Mio. € mehr Eigenkapital ein. Je Lauf ist genau eine Annahme geändert; alle Werte: Anhang A8.“
- Daten: Basis Konzepte!D68:H68, D81:H81 (Spalte G nicht); Läufe N6 tilgung_2_90, tilgung_3_65, kosten_4631, kosten_5460, mietanpassung_gefoerdert_0, mietsteigerung_0,
  anschlusszins_plus_1, anschlusszins_minus_1 je Konzepte!D68:F68, H68 und D81:F81, H81; Lauf R1 (eigener Lauf, Eingaben!E50 = 0,6 Prozentpunkte) Konzepte!D68:H68, D81:H81,
  Liegenschaftszins Gefördert A!I120 = 3,40 %; Zeile „Markt“ Konzepte!G68, G81, G62; Mieten der Kostenläufe N6 kosten_4631 und kosten_5460 Konzepte!H49; Lauf mietsteigerung_0
  Konzepte!H73 (29), H71 (1,10); Darlehen und Mehr-Eigenkapital T2!C59, C62, C61.
- Was die Tabelle zeigt: Gefördert fehlt Geld nur, wenn Tilgung oder Kosten steigen (bei 3,65 % Tilgung auch in A; die tragbare Tilgung A liegt bei 3,64 %, Übersicht!D49).
  Die Rendite trifft am stärksten eine Mietanpassung, die ausbleibt. Frei finanziert bleibt flüssig, solange 18,36 € erzielt werden und die Miete steigt; sonst sinkt die DSCR
  unter das, was die Bank verlangt, oder es fehlt Eigenkapital.

### Anhang

Der Anhang Modellrechnung wächst von zwei auf sieben Folien. Neue Nummern: A0 Trenner, A1 bis A5 wie heute, A6 bis A12 Modellrechnung, A13 Quellen.

#### A6 · Kennzahlen je Variante von Jahr 1 bis Jahr 42 (ersetzt heute A6)

- `PGN_ANHANG`, native Tabelle über 12 Spalten, Spalten A · B · C · frei finanziert (Mietzeile), Zeilen in drei Gruppen: „Jahr 1“ (Miete, Miete für DSCR 1,2, Eigenkapital,
  Zahlungsüberschuss, DSCR, Objektrendite mit und nach Zuschuss), „35 Jahre“ (Zahlungsüberschuss Jahr 35, kumuliert, Eigenkapital zurück, Jahre mit Fehlbetrag, tiefster Stand Projektkonto,
  DSCR Minimum, Jahre unter 1,2, Restschuld, Restwert, Vermögen, Eigenkapitalrendite mit und ohne Restwert, EK-IRR mit und ohne Restwert), „Jahr 42“ (Verweis auf A7).
- Daten: Konzepte!D49:H96 (Zeilen 49, 50, 56, 61, 62, 64, 66, 67, 68, 70, 71, 73, 75, 76, 78, 81, 82, 84, 85, 87, 88). Hinweis: EK-IRR ohne Restwert nach der Mappe nicht eindeutig (Hinweis 11).

#### A7 · Jahr 36 bis 42: in keiner Variante ein Fehlbetrag (neu, Zeit nach Jahr 35)

- `PGN_ANHANG`, links (7 Spalten) Liniendiagramm Miete je m² Jahr 30 bis 42 (gefördert springt mit der Kappungsgrenze: A 13,11 € in Jahr 35, 15,73 € in Jahr 37, 18,88 € in Jahr 40),
  rechts (5 Spalten) Tabelle: Restschuld Ende Jahr 35 197.561 | 296.341 | 345.731 | 0 € · Zahlungsüberschuss Jahr 36 56.706 | 64.572 | 70.382 | 323.451 · Jahr 42 115.957 | 139.078 | 153.343 | 364.258 ·
  Summe Jahr 36 bis 42 653.081 | 771.524 | 847.491 | 2.404.625 · Jahre mit Fehlbetrag 0 | 0 | 0 | 0 · Restschuld Ende Jahr 42 0 · Vermögen Ende Jahr 42 8,89 | 9,60 | 9,99 | 15,57 Mio. € ·
  Eigenkapitalrendite Horizont 42 mit Restwert 6,57 | 6,76 | 6,86 | 8,09 %, ohne 3,53 | 3,75 | 3,94 | 6,51 %.
- Hinweiskasten: „Ab Jahr 36 trägt das NBank-Darlehen 3,86 % Zins; die Restschuld ist bis Jahr 42 getilgt. Die Miete steigt nach der Bindung um höchstens 20 % in drei Jahren bis zur Vergleichsmiete.“
- Daten: Konzepte Zeitreihe Spalten C, L, U, AM (Zeilen 36 bis 48), F, O, X, AP (Zeilen 42, 48); Konzepte!D75:H75, D90:H96; Eingaben!F19, F27.

#### A8 · Risikoläufe: tiefster Projektkontostand, DSCR und Rendite (neu)

- `PGN_ANHANG`, native Tabelle über 12 Spalten, Zeilen wie Folie 25 (ohne Basis), je Variante vier Kennzahlen in zwei Tabellenblöcken: tiefster Stand Projektkonto (€),
  DSCR Minimum, Eigenkapitalrendite ohne Restwert, Vermögen Ende Jahr 35 (Mio. €). Zum Beispiel C bei 3,65 % Tilgung −128.266 €, bei 5.460 € je m² −239.781 €.
- Daten: Läufe N6 je Konzepte!D70:H70, D71:H71, D82:H82, D78:H78; Lauf R1 dieselben Zellen. Alle Werte in `ZAHLEN.md`, Abschnitt A8.

#### A9 · Gefördert fließen 41,8 % der Miete in die Tilgung (heute 17, bleibt inhaltlich, wandert in den Anhang)

- Flussdiagramm unverändert; Titel einzeilig für den Anhang.

#### A10 · Frei finanziert fließen 50,2 % der Miete in den Zins (heute 18, ändert sich)

- Flussdiagramm wie heute, aber mit der Miete für DSCR 1,2: Quelle Sollmiete 182.444 €; Ziele Zins 91.510 € (50,2 %), Tilgung 43.268 € (23,7 %), Zahlungsüberschuss 26.956 € (14,8 %, jetzt mit Band),
  Instandhaltung 11.923 € (6,5 %), Objektverwaltung 5.138 € (2,8 %), Mietausfall 3.649 € (2,0 %). Maßkette an der Quelle: „Sollmiete zur Marktmiete 15,42 €“ statt der Höchstmiete.
  Mietzeile im Untertitel. Der gestrichelte Umriss „frei finanziert kostendeckend“ auf A9 entfällt (eine Miete je Folie).
- Daten: Frei DSCR 1,2!E7:M7; Anteile gerechnet (Betrag ÷ Sollmiete E7), Formeln in `ZAHLEN.md`, Abschnitt A10.

#### A11 · Bis 2,90 % Tilgung bleibt in A, B und C ein Zahlungsüberschuss (heute 20, bleibt, wandert in den Anhang)

- Liniendiagramm Zahlungsüberschuss je Tilgungssatz unverändert; Titel einzeilig. Ergänzt Folie 25 um die Zwischenwerte.

#### A12 · Bei 2,38 % Tilgung liegt Gruppe A ab rund 3.000 € je m² vorn (heute A7, bleibt)

### Was gegenüber heute entfällt

| Heute | Neu | Was geschieht |
|---|---|---|
| 13 Trenner | 13 | ändert sich: Titel und Lead nach den Fragen (G10) |
| 14 Finanzierung Gruppe A | 15 | ändert sich: vier Varianten, Eigenkapital mit Bearbeitungsentgelten; Kennzahlen „Ø je Wohnung“ entfallen |
| 15 Jahresrechnung A, B, C | 17 | ändert sich: Spalte frei finanziert, Zeilen Kapitaldienst und DSCR |
| 16 Kapitaldienst | 17 | entfällt als Folie: Kapitaldienst steht in Folie 17 (Zeilen 6 bis 8 und Summe) |
| 17 Zahlungsfluss gefördert | A9 | bleibt inhaltlich, wandert in den Anhang |
| 18 Zahlungsfluss frei finanziert | A10 | ändert sich (18,36 € statt kostendeckend 15,59 €), wandert in den Anhang |
| 19 Kostendeckende Anfangsmiete | 16 | entfällt als Folie: die kostendeckende Anfangsmiete ist eine Reihe der Folie 16 |
| 20 Tilgungssatz | A11, 25 | wandert in den Anhang; zwei Tilgungssätze stehen in der Risikotabelle |
| 21 Verlauf A, B, C | 18 | ändert sich: vier Varianten, Jahr 1 bis 42 |
| 22 Herstellungskosten der PGN | 24 | bleibt, rückt vor die Risikofolie |
| 23 Herstellungskosten-Szenario | 25 | entfällt: die Kostenläufe stehen in der Risikotabelle; die geschätzte Schwelle „rund 5.150 €“ entfällt (nicht in der Mappe) |
| 24 Zusammenfassung | 29 | entfällt nach Auftrag; die neue Fazit-Folie 29 blickt auf den ganzen Vortrag |
| A6 Rendite | 22, A6 | entfällt in dieser Form: Rendite im Hauptteil (Folie 22), alle Kennzahlen im Anhang A6 |
| A7 Tilgungsschwelle | A12 | bleibt |
| neu | 14, 16, 19, 20, 21, 23, 25, A7, A8 | Annahmen, Miete für DSCR 1,2, Rückfluss, DSCR im Verlauf, Objektrendite, Vermögen, Risiken, Zeit nach Jahr 35, alle Risikoläufe |

---

## 3 · Schlüsselfolien

**Folie 16 (Miete für DSCR 1,2).** Sie macht die neue Annahme greifbar und klärt in einem Bild, wofür die 1,2 gilt: Frei finanziert verlangt die Bank sie für das Bankdarlehen,
und das heißt 18,36 € Miete, 19,1 % über dem Markt. Gefördert liegen A und B mit der Höchstmiete darüber, C fehlen 0,12 €; dort ist die 1,2 ein Vergleich, die NBank prüft anderes.
Jede frei finanzierte Zahl der folgenden Folien hängt an dieser Miete; ohne Folie 16 wäre der Vorsprung frei finanziert auf den Folien 17 bis 23 nicht zu verstehen.

**Folie 25 (Risiken).** Sie beantwortet die letzte Investorenfrage und rückt den Vorsprung frei finanziert zurecht: Gefördert gerät die Liquidität nur bei höherer Tilgung
oder höheren Kosten unter Druck; frei finanziert fällt die Rendite ohne Mietsteigerung von 8,93 % auf 5,81 %, und zahlt der Markt nur 15,42 €, fehlen 0,42 Mio. € Eigenkapital.
Die Folie zeigt alle vier Varianten mit denselben Kennzahlen in derselben Ordnung.

---

## 4 · Broschüre Blatt 9 bis 11 (Bogenseiten 10 bis 12)

Seitenzahl bleibt 24. Jedes Blatt beantwortet eine Frage; die Zahlen sind die der Folien (Fundstellen in `ZAHLEN.md`, Spalte „Blatt 9“, „Blatt 10“, „Blatt 11“).

**Blatt 9 · „Ein Haus, vier Finanzierungen, rund 0,6 Mio. € Eigenkapital“ (Kolumne MODELLRECHNUNG · ANNAHMEN UND EINSATZ)**
- 9.1 Steckbrief Modellhaus (bleibt, rechts oben): Ort, 14 Wohnungen, 828 m², Effizienzhaus 55, Mietenstufe VI, Herstellungskosten 3.579 € je m², Bemessungsgrenze 5.460 € eingehalten, Grundstück im Bestand.
- 9.2 Annahmen vollständig (neu, linke Hälfte, zweispaltig): die 28 Zeilen der Folie 14 mit Wert und Herkunft; die neue Annahme DSCR 1,2 hervorgehoben.
- 9.3 Finanzierung je Variante (ändert den Balken der heutigen S. 10): vier gestapelte Balken wie Folie 15 mit Zuschuss, NBank-Darlehen, Bankdarlehen, Eigenmittel, Bearbeitungsentgelte.
- 9.4 Rechenweg Eigenkapital (ändert den heutigen Rechenweg): 828 m² × 3.579 € = 2.963.412 €; Eigenmittel 20 % 592.682 €; + Bearbeitungsentgelte 20.744 | 22.226 | 22.966 €; = Eigenkapital 613.426 | 614.908 | 615.649 | 592.682 €.
- Entfällt: Kennzahlen „Ø Zuschuss je Wohnung“ und „Ø Eigenmittel je Wohnung“; die Sensitivitätstabelle Herstellungskosten wandert in die Risikotabelle auf Blatt 11.

**Blatt 10 · „In Jahr 1 bleibt in allen vier Varianten ein Zahlungsüberschuss“ (MODELLRECHNUNG · JAHR 1 UND BANK)**
- 10.1 Jahresrechnung Jahr 1 mit vier Spalten wie Folie 17 (Zeilen 1 bis 9, Kapitaldienst, DSCR, Bearbeitungsentgelte).
- 10.2 Miete für DSCR 1,2 (neu): Balken wie Folie 16 (kostendeckend, DSCR 1,2, Marke Höchstmiete oder Marktmiete) mit Rechenweg 134.779 € × 1,2 + 17.061 € ÷ 98 % ÷ 828 m² ÷ 12 = 18,36 €.
- 10.3 Kasten „Welche DSCR gilt wofür?“: frei finanziert Bankdarlehen, 1,2 als Annahme der PGN; gefördert kein Bankdarlehen, die NBank prüft Eigenmittel (RL 5.2.6), Tilgungssatz und angemessenen Gewinn (RL 11.10);
  C liegt in Jahr 1 bis 3 bei 1,18, ab Jahr 4 bei 1,27.
- Entfällt: Vergleichskasten „Zum Vergleich: frei finanziert“ (geht in 10.1 und 10.2 auf), der Fließtext „Annahmen“ (steht auf Blatt 9), die Finanzierungssäulen A, B, C (stehen auf Blatt 9).

**Blatt 11 · „Gefördert ist Ihr Eigenkapital in 22 bis 23 Jahren zurück“ (MODELLRECHNUNG · 35 JAHRE UND RISIKO)**
- 11.1 Liniendiagramm Zahlungsüberschuss Jahr 1 bis 42, vier Varianten, Marken Jahr 30 und 35 (Folie 18).
- 11.2 Liniendiagramm noch gebundenes Eigenkapital Jahr 0 bis 35 (Folie 19).
- 11.3 Kennzahlentabelle: DSCR Jahr 1 und Minimum, Jahre unter 1,2, Objektrendite auf Gesamtkosten und nach Zuschuss, Eigenkapitalrendite ohne und mit Restwert, Restschuld, Restwert, Vermögen Ende Jahr 35, Restwertanteil (Folien 20 bis 23).
- 11.4 Risikotabelle kompakt wie Folie 25 (elf Zeilen, Fehlbetragsjahre und Eigenkapitalrendite) mit dem Satz zur Marktmiete (1,95 Mio. € Darlehen, 0,42 Mio. € mehr Eigenkapital).
- 11.5 Eine Zeile zum Mix (Rest der heutigen S. 12): „B liegt nie vorn. Unter 1,91 % Tilgung hat C den höchsten Zahlungsüberschuss, darüber A.“ (Übersicht!E63 1,80 %, F64 1,91 %).
- Entfällt: Diagramm Mehrüberschuss je Tilgungssatz und Rechenweg B und C gegenüber A (bleiben im Vortrag auf A11 und A12).

---

## 5 · Fazit-Folie (neu, Folie 29, vor der Schlussfolie)

- Layout `PGN_INHALT` (weißer Grund, blickt über alle Abschnitte), Kicker „UMSETZUNG · FAZIT“. Titel: „Gefördert trägt sich das Haus ab Jahr 1,“ | „frei finanziert nur über der Marktmiete“ (Signaturwort „ab Jahr 1“).
- Aufbau: oben die Achse der Agenda (Folie 7) mit vier großen Achskreisen 1 bis 4 im Abstand von drei Spalten; unter jedem Achskreis der Name des Abschnitts (Montserrat Bold 16 pt)
  und drei Stichpunkte in 14 pt, je mit einer Zahl. Darunter über 12 Spalten die Ergebniszeile weiß auf Rot. Kein Diagramm.
  1 **Ausgangslage**: „3,86 % Zins bei 10 Jahren Zinsbindung“ · „frei finanziert deckt erst 15,59 € je m² die Kosten“ · „der Markt zahlt 15,42 €“.
  2 **Programmteil 2.1**: „40 % Zuschuss und 40 % Darlehen in A“ · „Darlehen 35 Jahre zu 0 % Zins“ · „Höchstmiete A 6,80 € je m²“.
  3 **Modellrechnung**: „rund 0,6 Mio. € Eigenkapital in allen Varianten“ · „A: 15.003 € in Jahr 1, Eigenkapital in Jahr 23 zurück, 2,58 % ohne und 7,05 % mit Restwert“ ·
  „frei finanziert: 26.956 € in Jahr 1, zurück in Jahr 13, 8,93 % mit Restwert, nur mit 18,36 € Miete“.
  4 **Umsetzung**: „Tilgungssatz früh mit der NBank klären: bis 3,64 % bleibt in A ein Zahlungsüberschuss“ · „Bearbeitungsentgelte 20.744 € einmalig einplanen“ ·
  „Planung bis Leistungsphase 6 vor der Bewilligung, Verträge danach“.
  Ergebniszeile: „Gefördert: in A, B und C ab Jahr 1 ein Zahlungsüberschuss, kein Jahr mit Fehlbetrag. Frei finanziert: nur mit 19,1 % mehr Miete als am Markt.“
- Daten: Eingaben!F35; Übersicht!G112; Eingaben!F25; Tabellen!D6, D5, D19, D20, D14; Konzepte!D56 (0,6 Mio. €), D61, D82, D81, H61, H81, H49, D14, D68:F68, D57; T2!C49, G49;
  Übersicht!D49 (3,6466 %, abgerundet auf 3,64 %). „Leistungsphase 6“ ist keine Rechengröße (Folie 28, HOAI).
- Symmetrie: Abschnitt 3 nennt A und frei finanziert mit denselben Merkmalen in derselben Reihenfolge (Zahlungsüberschuss Jahr 1, Rückfluss, Rendite, Bedingung).

---

## 6 · Neue Blöcke in der Mappe

Genutzt aus der gemeinsamen Konzepte-Mappe:
- **N1** Konzepte!D6 DSCR-Ziel der Bank 1,2 (einzige neue Annahme) · **N2** Konzepte!D10:D16 und Blatt Frei DSCR 1,2 (Miete 18,36 €, Zeitreihe) ·
  **N3** Konzepte!D19:F27 (A, B, C zur Höchstmiete und für 1,2) · **N4** Konzepte!D36:H44 (Objektrendite mit und nach Zuschuss, Abgleich Nettoanfangsrendite) ·
  **N5** Konzepte!D49:H96 und Blatt Konzepte Zeitreihe · **N6** acht Läufe in `mappe/laeufe/` · **K** Prüfungen Konzepte!C99:C106.

Eigene Ergänzungen (Team-2-Kopie, alle bestehenden Zellen unverändert):
- **T2.1 bis T2.4** Blatt „Team 2“, Zeilen 6 bis 51: noch gebundenes Eigenkapital je Jahr 0 bis 42 und Variante, `=MAX(0;Konzepte!<EK>56 − 'Konzepte Zeitreihe'!<kumuliert>)`;
  erstes Jahr ohne gebundenes Eigenkapital (C49:G49), Höchststand (C50:G50), Gegenprobe gegen Konzepte Zeile 67 (C51:G51, alle „OK“). Für Folie 19 und Blatt 11.
- **T2.5** Blatt „Team 2“, C56:C63: frei finanziert zur Marktmiete, höchstes Bankdarlehen bei DSCR 1,2 = Bankdarlehen × (Überschuss vor Kapitaldienst zur Marktmiete ÷ 1,2) ÷ Kapitaldienst
  (1,95 Mio. €, 66 % der Kosten), nötiges Eigenkapital 1,01 Mio. €, Mehr-Eigenkapital 0,42 Mio. €, Gegenprobe DSCR = 1,2 („OK“). Nur Formeln auf Konzepte!G59, D6, H60, H55, H52, H56. Für Folie 25, Blatt 11, Fazit.
- **Status** Team 2!D52 = „OK“ (T2.4, T2.5.8, Konzepte!D3, Übersicht!D3).
- **R1** eigener Lauf `team-2/mappe/laeufe/liegenschaftszins_plus_0_60.xlsx`: Eingaben!E50 (Eingabe 9.3 Zuschlag Liegenschaftszins) 0 → 0,006; die Spanne „Worst +0,60“ nennt die Mappe selbst (Eingaben!G50). Keine neue Annahme für die Basis. Liegenschaftszins Jahr 35 3,40 %.
- **Ausgabe** `team-2/mappe/werte_team.json`: Block T2, Lauf R1 und bestehende Zellen, die `werte_konzepte.json` nicht führt (Frei DSCR 1,2!E7:N7; Übersicht!D112:G112, E63, F64; Gefördert A, B, C!I120, I122:I124), je mit Blatt und Zelle.
- Bau und Prüfung: `team-2/mappe/build_team2.py` und `lauf_team2.py` (recalc mit eigenem HOME): recalc ohne Formelfehler (14.181 Formeln); Vergleich aller zwölf Blätter der Konzepte-Mappe mit der Kopie:
  16.541 Zellen, davon 13.856 Formeln, 0 Abweichungen; Status Konzepte, Mappe, Team 2 „OK“, auch im Lauf R1. `pruefe_konzepte.py` ist nicht gelaufen (es kennt das Blatt „Team 2“ nicht).
- Vorschlag für die endgültige Mappe: T2 als Block N7 auf Blatt Konzepte übernehmen.

---

## 7 · Schwächen des Konzepts

1. **Annahmenfolie dicht.** 28 Zeilen in 12 pt auf einer Folie sind am Rand dessen, was man im Vortrag liest. Sie ist eine Nachschlagefolie; im Vortrag reicht ein Satz dazu.
2. **Mehr Folien.** Kapitel 3 hat 13 statt 12 Folien, dazu die Fazit-Folie; der Vortrag wird gut drei Minuten länger. Der Anhang Modellrechnung wächst von zwei auf sieben Folien.
3. **Frei finanziert drückt die Diagramme.** Auf Folie 18 reicht frei finanziert bis 364.258 €, die Gruppen liegen im unteren Viertel der Achse. Die Tabelle rechts gleicht das aus, das Bild nicht.
4. **Der Vorsprung frei finanziert ist eine Rechnung mit 18,36 €.** Alle frei finanzierten Kennzahlen setzen eine Miete 19,1 % über dem Markt voraus. Die Marktmiete erscheint nur als Mietzeile und als eine Risikozeile;
   kombinierte Fälle (höhere Kosten und Marktmiete) zeigt das Konzept nicht. In den Kostenläufen löst die Mappe die Miete neu (23,24 € und 27,09 €); frei finanziert zeigt dort 0 Fehlbetragsjahre, was ohne die Zusatzzeile beruhigend wirkt.
5. **Restwert gefördert nicht direkt aus 15,42 €.** Die Mappe rechnet gefördert den Ertragswert aus dem Mietpfad, der nach der Bindung über die Kappungsgrenze zur Marktmiete (Zielmiete) läuft. Folie 23 zeigt den Abstand zum Ertragswert zur Marktmiete (in A 1,61 Mio. €).
   Ob das die Vorgabe „Restwert für alle Varianten aus der Marktmiete“ trifft, muss der Auftraggeber bestätigen.
6. **Ein Rückfluss ohne Zinsen.** „Eigenkapital zurück in Jahr 23“ rechnet unverzinst; mit Zinsen läge das Jahr später. Die Eigenkapitalrendite (VOFI) legt Überschüsse zu 2 % an; wer ausschüttet, rechnet anders.
7. **Risikotabelle zählt Jahre, nicht Euro.** „Jahre mit Fehlbetrag“ sagt nichts über die Höhe; die Beträge (bis −239.781 € in C) stehen nur im Anhang A8. Jeder Lauf ändert eine Annahme; keine Läufe für Mietausfall, Instandhaltung, Kostensteigerung.
8. **Was die NBank prüft, bleibt ohne Zahl.** Den angemessenen Gewinn (RL 11.10) rechnet die NBank selbst; das Blatt NBank der Mappe ist nicht für außen. Die Folien nennen die Prüfung, nicht den Maßstab.
9. **T2.5 ist eine vereinfachte Darlehensbemessung.** Sie bemisst nur Jahr 1 bei gleichem Zins und gleicher Laufzeit und rechnet die Folgejahre und die Rendite mit dem kleineren Darlehen nicht durch.
10. **Folie 24 trägt Zahlen außerhalb der Mappe.** Die Kostenvergleiche PGN und ARGE kommen aus `markt.json` (Altfassung, nicht nachgeprüft). Ebenso nennt die Fazit-Folie für die Ausgangslage Zahlen der Mappe (3,86 %, 15,59 €, 15,42 €) statt der Marktdaten des Kapitels 1 (52,9 %, 40,6 %), weil diese nicht in der Mappe stehen.
11. **C unter 1,2 kann falsch ankommen.** Wer DSCR 1,2 als Bankregel kennt, liest „C 1,18“ als Mangel, obwohl es kein Bankdarlehen gibt. Die Folien 16 und 20 sagen das zweimal; ganz ausräumen lässt es sich nicht.
12. **Objektrendite frei finanziert zur Miete über dem Markt.** 5,46 % ist keine Marktrendite des Hauses. Die Regel „eine Miete je Folie“ verbietet, daneben den Wert zur Marktmiete zu zeigen.
13. **Blatt 11 der Broschüre ist voll.** Fünf Module auf einer Seite; das Mehrüberschuss-Diagramm zum Mix entfällt dort und bleibt nur im Vortrag (A11, A12).
14. **Farbe von C ändert sich.** C wird von Referenzgrau auf gepunktete Tinte umgestellt, weil Referenzgrau frei finanziert bedeutet; das betrifft auch die übernommenen Anhangfolien A11 und A12.
