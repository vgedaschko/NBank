# Referenzrechnung: Kennzahlen vor Steuern für das Broschüren-Modellprojekt

**Stand:** 09.11.2026. **Internes Werkzeug, nicht zur Weitergabe.** Erzeugt von `referenzrechnung.py` aus `annahmen.json` (SHA-256 `2fef8f887418…`). Begriffe, Zahlungsreihen und Darstellungsregeln: `kennzahlen-konzept.md`. Die Broschüre selbst zeigt keine Renditen, nur den Zahlungsüberschuss p. a. (Abschnitt 2).

Modellprojekt: Broschüre S. 10 (20 WE, 1.400 m², Herstellung 6,3 Mio. €, Grundstück 0,7 Mio. € als Sacheinlage, zuwendungsfähig 7,0 Mio. €, Mietenstufe IV bis VII), Gruppen A, B, C jeweils zu 100 %. Annahmesätze aus dem PGN-VOFI-Modell v2-1 (Szenario Basis); wo das Modell für dieses Projekt nichts hergibt, gelten die als **PH** markierten Platzhalter (Abschnitt 1). Alle Werte nominal, vor Steuern, T0 = Bezugsfertigkeit.

## 0. Kernergebnisse

**Vier Renditekennzahlen je Gruppe** (IRR, Horizont T42 = Darlehensende; in Klammern T35 = Bindungsende). „mit RW“ = Boden + Gebäude, „ohne Geb.-RW“ = nur Bodenwert, „ohne RW“ = Restwert null.

| Kennzahl | A | B | C |
| --- | ---: | ---: | ---: |
| Objektrendite nach Zuschuss, mit RW | 4,16 % (4,04 %) | 3,71 % (3,55 %) | 3,56 % (3,38 %) |
| Objektrendite nach Zuschuss, ohne Geb.-RW | 1,88 % (1,01 %) | 1,57 % (0,61 %) | 1,51 % (0,53 %) |
| EK-Rendite (EK-IRR), mit RW | 5,90 % (6,03 %) | 5,73 % (5,85 %) | 5,70 % (5,81 %) |
| EK-Rendite (EK-IRR), ohne Geb.-RW | 2,92 % (1,53 %) | 2,64 % (0,72 %) | 2,63 % (0,47 %) |

Nachrichtlich (T42): Objektrendite brutto vor Förderung mit RW A 2,48 %, B 2,95 %, C 3,20 %; frei finanziert zur Marktmiete 4,66 %. Ohne jeden Restwert: Objekt nach Zuschuss A 1,20 %, B 1,01 %, C 1,00 %; EK-IRR A 1,82 %, B 1,57 %, C 1,61 %. VOFI-EK-Rendite mit RW A 5,52 %, B 5,56 %, C 5,58 %.

**Jahresrechnung Jahr 1 (Broschüre S. 11, Zeile 8):** Zahlungsüberschuss A 455 €, B −18.495 €, C −26.324 € bei 2,50 % Tilgung. Die vier Annahmen für die Broschüre: Mietausfall 2,0 % der Sollmiete; nicht umlagefähige Bewirtschaftungskosten 367 € je Wohnung p. a. (Verwaltung, Betriebskosten voll umgelegt); Instandhaltung 14,40 € je m² p. a.; Tilgung 2,50 % p. a. linear (PGN-Annahme, die RL nennt keinen Satz).

## 1. Annahmen und Quellen

Status: **PGN** Wert aus dem PGN-Modell (Fundstelle), **BR** Broschüre, **RL** Richtlinie Mietwohnraum 2026, **PH** Platzhalter, für das Broschürenprojekt nicht belegt, vor externer Verwendung durch PGN zu bestätigen.

| Größe | Ansatz | Fundstelle | Status |
| --- | --- | --- | --- |
| Wohnungen / Wohnfläche | 20 WE / 1.400 m² | Broschüre S. 10 | BR |
| Herstellungskosten KG 200 bis 700 | 6.300.000 € (4.500 €/m²) | Broschüre S. 10, Rechenweg Z. 1 | BR |
| Grundstück (Sacheinlage, lastenfrei) | 700.000 €, unter Bodenrichtwert × Fläche | Broschüre S. 10, Z. 2 | BR |
| Grundstücksnebenkosten KG 120 | 0 € | eingebrachtes Grundstück; Modell Eingabe!C90 = 0 | PH |
| KG 800 / Bauzeitzinsen | 0 € | wie Modell Eingabe!C19 = 0 (Bauzeitrechnung C91:C95 nur informativ) | PH |
| Zuwendungsfähige Kosten | 7.000.000 € | Broschüre S. 10, Z. 3; Formel wie Basisdaten!C27 | BR |
| Darlehen/Zuschuss A, B, C | 40/40, 60/20, 70/10 % | Eingabe!C27:C31, Eingabe!C35; RL Nr. 5.3.3 | RL |
| Höchstmiete Jahr 1 bis 3 | 6,80 / 8,20 / 9,00 €/m² | Eingabe!E119:G119; RL Nr. 5.4.4 | RL |
| Mietausfall | 2,0 % der Sollmiete | Eingabe!C82 | PGN |
| Nicht umlagefähige Bewirtschaftung | 367 € je WE p. a. (Verwaltung); Betriebskosten voll umgelegt | Eingabe!C80 | PGN |
| Instandhaltung | 14,40 € je m² p. a. | Eingabe!C81 | PGN |
| Kostensteigerung | 2,0 % p. a. ab Jahr 2; Jahr 1 = Kostenstand 2026 | Eingabe!C84; Gefoerdert_A!G7 | PGN |
| Tilgung NBank | 2,50 % p. a. linear (1/40), ab Jahr 1 | Basisdaten!C62, Eingabe!C25/C26 | PGN |
| Zins NBank | 0 % bis Jahr 35, danach 3,74 % auf die Restschuld | Eingabe!C43 (Vorbehalt im Modell); RL Nr. 5.3.4 | PGN/RL |
| Verwaltungskostenbeitrag | 0,5 % p. a. des Restkapitals zu Jahresbeginn | Eingabe!C44; RL Nr. 12.7.1 | RL |
| Bearbeitungsentgelte | 1 % Darlehen + 0,75 % Zuschuss, einmalig in T0, aus Eigenkapital | RL Nr. 12.7.2/12.7.3; Modell: Bankdarlehen (Basisdaten!C78) | RL/PH |
| Bares Eigenkapital | Restgröße: Herstellung − Darlehen − Zuschuss + Entgelte | Kennzahlenkonzept Abschn. 2.1 (statt Eingabe!C88, Befund FR-03) | PH |
| Mieterhöhung | ab Jahr 4 alle 3 Jahre +6,15 % (Ausschöpfung), nach Bindung 20 % je 3 Jahre, max. Vergleichsmiete | Eingabe!C73:C79; Gefoerdert_A!C7 | PGN |
| Vergleichsmiete / Marktmiete Jahr 1 | 12,92 / 14,48 €/m², +2 % p. a. | Basisdaten!C46:C49 (Standort Neu Wulmstorf, Mietenstufe VI) | PH |
| Restwert | Ertragswert, GND 80 J., LZ-Kurve 2,5 bis 3,1 %, Bindungsabschlag bis zur Zielmiete fortgeführt | Eingabe!C105, B124:C129; Konzept Abschn. 4 | PGN/PH |
| Bodenwert | 700.000 € + 1,5 % p. a. | Eingabe!C106 | PGN |
| Veräußerungskosten | 0 % (Sensitivität 5 %) | Modell: keine | PH |
| Wiederanlage VOFI-Konto | Haben 2 %, Soll 5 % | Eingabe!C100, Eingabe!C101 | PGN |
| Horizonte | T35 (Bindungsende) und T42 (Darlehensende); T0 = Bezugsfertigkeit, EK in T0 | Konzept Abschn. 2.4 | PH |
| Grenzwert Überkompensation | Swap 30 J. 3,39 % + 100 Bp = 4,39 % | Ueberkompensation!C5:C7 (Stand 19.08.2026; Faktbasis G3-25: 3,43 % am 19.10.2026) | PGN/PH |

Finanzierung T0 (sauber, je Gruppe gleiches EK-Prinzip): Grundstück 700.000 € als Sacheinlage + bares EK (A 749.000 €, B 752.500 €, C 754.250 €, jeweils 700.000 € + Bearbeitungsentgelte). Eingesetztes EK: A 1.449.000 €, B 1.452.500 €, C 1.454.250 €. Eigenmittel ohne Entgelte 1.400.000 € = 20,0 % der zuwendungsfähigen Kosten, vollständig in harter Form (Geld oder lastenfreies Grundstück, RL Nr. 5.2.6). Kein Bankdarlehen.

## 2. Jahresrechnung Jahr 1 bis 3 im Schema der Broschüren-S. 11 (€ p. a.)

**Jahr 1** (Broschürenwerte)

|  | Position | A | B | C |
| --- | --- | ---: | ---: | ---: |
| 1 | Sollmiete (1.400 m² × 6,80 / 8,20 / 9,00 € × 12) | 114.240 | 137.760 | 151.200 |
|  | − Mietausfall/Leerstand 2,0 % | −2.285 | −2.755 | −3.024 |
| 2 | − nicht umlagefähige Bewirtschaftungskosten (367 € je Wohnung) | −7.340 | −7.340 | −7.340 |
| 3 | − Instandhaltung (14,40 € je m²) | −20.160 | −20.160 | −20.160 |
| 4 | = Überschuss vor Kapitaldienst | 84.455 | 107.505 | 120.676 |
| 5 | − Verwaltungskostenbeitrag, 0,5 % des Restkapitals | −14.000 | −21.000 | −24.500 |
| 6 | − Zins NBank-Darlehen, 0 % | 0 | 0 | 0 |
| 7 | − Tilgung 2,50 % auf 2,8 / 4,2 / 4,9 Mio. € | −70.000 | −105.000 | −122.500 |
| 8 | **= Zahlungsüberschuss p. a.** | **455** | **−18.495** | **−26.324** |

**Jahr 2** (Kosten +2 % p. a., VKB auf das gesunkene Restkapital)

|  | Position | A | B | C |
| --- | --- | ---: | ---: | ---: |
| 1 | Sollmiete (1.400 m² × 6,80 / 8,20 / 9,00 € × 12) | 114.240 | 137.760 | 151.200 |
|  | − Mietausfall/Leerstand 2,0 % | −2.285 | −2.755 | −3.024 |
| 2 | − nicht umlagefähige Bewirtschaftungskosten (374 € je Wohnung) | −7.487 | −7.487 | −7.487 |
| 3 | − Instandhaltung (14,69 € je m²) | −20.563 | −20.563 | −20.563 |
| 4 | = Überschuss vor Kapitaldienst | 83.905 | 106.955 | 120.126 |
| 5 | − Verwaltungskostenbeitrag, 0,5 % des Restkapitals | −13.650 | −20.475 | −23.888 |
| 6 | − Zins NBank-Darlehen, 0 % | 0 | 0 | 0 |
| 7 | − Tilgung 2,50 % auf 2,8 / 4,2 / 4,9 Mio. € | −70.000 | −105.000 | −122.500 |
| 8 | **= Zahlungsüberschuss p. a.** | **255** | **−18.520** | **−26.261** |

**Jahr 3** (Kosten +2 % p. a., VKB auf das gesunkene Restkapital)

|  | Position | A | B | C |
| --- | --- | ---: | ---: | ---: |
| 1 | Sollmiete (1.400 m² × 6,80 / 8,20 / 9,00 € × 12) | 114.240 | 137.760 | 151.200 |
|  | − Mietausfall/Leerstand 2,0 % | −2.285 | −2.755 | −3.024 |
| 2 | − nicht umlagefähige Bewirtschaftungskosten (382 € je Wohnung) | −7.637 | −7.637 | −7.637 |
| 3 | − Instandhaltung (14,98 € je m²) | −20.974 | −20.974 | −20.974 |
| 4 | = Überschuss vor Kapitaldienst | 83.344 | 106.394 | 119.565 |
| 5 | − Verwaltungskostenbeitrag, 0,5 % des Restkapitals | −13.300 | −19.950 | −23.275 |
| 6 | − Zins NBank-Darlehen, 0 % | 0 | 0 | 0 |
| 7 | − Tilgung 2,50 % auf 2,8 / 4,2 / 4,9 Mio. € | −70.000 | −105.000 | −122.500 |
| 8 | **= Zahlungsüberschuss p. a.** | **44** | **−18.556** | **−26.210** |

Einmalig in T0, außerhalb der Jahresrechnung: Bearbeitungsentgelte A 49.000 €, B 52.500 €, C 54.250 €. Rundung auf ganze Euro je Zeile; die Summenzeilen sind aus ungerundeten Werten gebildet und stimmen mit den gerundeten Zeilen überein.

Folgen für S. 11/12: Mit 2,0 % Mietausfall sinken die Tilgungsschwellen „B bzw. C gegenüber A“ auf **B 1,15 %** und **C 1,22 %** (bisher im Text 1,18 / 1,26 % ohne Mietausfall). Break-even-Tilgung Jahr 1 (Zahlungsüberschuss = 0): A 2,52 %, B 2,06 %, C 1,96 %.

## 3. Liquiditätskennzahlen

DSCR = Überschuss vor Kapitaldienst ÷ Kapitaldienst (VKB + Zins + Tilgung). Kumulierter Fehlbetrag = tiefster Stand der aufsummierten Zahlungsüberschüsse ohne Zinsen, also der Liquiditätsbedarf, den das EK zusätzlich vorhalten muss.

| Kennzahl | A | B | C |
| --- | ---: | ---: | ---: |
| Zahlungsüberschuss Jahr 1 | 455 | −18.495 | −26.324 |
| DSCR Jahr 1 | 1,01 | 0,85 | 0,82 |
| DSCR Minimum T1 bis T35 | 1,00 | 0,85 | 0,82 |
| Zahlungsüberschuss Minimum T1 bis T35 | 44 | −18.556 | −26.324 |
| Jahre mit negativem Überschuss (T1 bis T35) | 0 | 9 (zuletzt Jahr 9) | 9 (zuletzt Jahr 9) |
| Größter kumulierter Fehlbetrag | 0 | −92.052 | −151.922 |
| Summe Zahlungsüberschuss T1 bis T35 | 1.393.449 | 1.159.936 | 1.124.063 |
| Summe Zahlungsüberschuss T1 bis T42 | 2.515.502 | 2.481.143 | 2.573.162 |
| Restschuld NBank Ende T35 | 350.000 (12,5 %) | 525.000 (12,5 %) | 612.500 (12,5 %) |
| Kapitaldienst T36 (VKB + 3,74 % Zins + Tilgung) | 84.840 | 127.260 | 148.470 |

Förderbarwert zum Kalkulationszins 3,74 % (Bankzins Eingabe!C51, nur Information): Zuschuss netto + Barwertvorteil des Darlehens = A 2,78 + 1,14 = **3,92 Mio. €**; B 1,39 + 1,71 = **3,10 Mio. €**; C 0,69 + 1,99 = **2,69 Mio. €**. Der Darlehensvorteil steckt nicht in der Objektrendite nach Zuschuss, nur in der EK-Rendite.

## 4. Renditekennzahlen (Matrix)

Zahlungsreihen nach `kennzahlen-konzept.md` Abschnitt 2: **Objekt brutto** −(Grundstück + Herstellung) in T0, Reinertrag T1…TH, Restwert in TH. **Objekt nach Zuschuss** wie brutto, Investition um den Zuschuss abzüglich Bearbeitungsentgelt Zuschuss gemindert. **EK-IRR** −EK in T0, Zahlungsüberschuss T1…TH, in TH Restwert − Restschuld. **VOFI-EK** (Endvermögen ÷ EK)^(1/H) − 1, Konto mit 2 % Haben / 5 % Soll, gleiche Zeitbasis wie der IRR.

**Horizont T42** (Darlehensende, wie Modell-Horizont)

| Kennzahl | A | B | C | Frei, Marktmiete |
| --- | ---: | ---: | ---: | ---: |
| Objekt brutto (vor Förderung), mit RW | 2,48 % | 2,95 % | 3,20 % | 4,66 % |
| Objekt brutto (vor Förderung), ohne Geb.-RW | −0,03 % | 0,71 % | 1,10 % | 3,32 % |
| Objekt brutto (vor Förderung), ohne RW | −0,83 % | 0,10 % | 0,56 % | 3,07 % |
| Objekt nach Zuschuss, mit RW | 4,16 % | 3,71 % | 3,56 % | 4,66 % |
| Objekt nach Zuschuss, ohne Geb.-RW | 1,88 % | 1,57 % | 1,51 % | 3,32 % |
| Objekt nach Zuschuss, ohne RW | 1,20 % | 1,01 % | 1,00 % | 3,07 % |
| EK-IRR, mit RW | 5,90 % | 5,73 % | 5,70 % | – |
| EK-IRR, ohne Geb.-RW | 2,92 % | 2,64 % | 2,63 % | – |
| EK-IRR, ohne RW | 1,82 % | 1,57 % | 1,61 % | – |
| VOFI-EK-Rendite, mit RW | 5,52 % | 5,56 % | 5,58 % | – |
| VOFI-EK-Rendite, ohne Geb.-RW | 2,71 % | 2,51 % | 2,46 % | – |
| VOFI-EK-Rendite, ohne RW | 1,87 % | 1,58 % | 1,51 % | – |

Restwert T42 (Mio. €): A 10,66 = Boden 1,31 + Gebäude 9,35; B 11,28 = Boden 1,31 + Gebäude 9,97; C 11,51 = Boden 1,31 + Gebäude 10,20; Frei 11,90 = Boden 1,31 + Gebäude 10,59. Bindungsabschlag gegenüber Marktmietniveau: A 1,24, B 0,62, C 0,39 Mio. €. LZ 2,70 % bei RND 38 J.; Restschuld NBank T42: A 0,00, B 0,00, C 0,00 Mio. €.

**Horizont T35** (Bindungsende = Betrauungszeitraum)

| Kennzahl | A | B | C | Frei, Marktmiete |
| --- | ---: | ---: | ---: | ---: |
| Objekt brutto (vor Förderung), mit RW | 2,12 % | 2,68 % | 2,97 % | 4,63 % |
| Objekt brutto (vor Förderung), ohne Geb.-RW | −1,15 % | −0,36 % | 0,05 % | 2,60 % |
| Objekt brutto (vor Förderung), ohne RW | −2,46 % | −1,37 % | −0,83 % | 2,19 % |
| Objekt nach Zuschuss, mit RW | 4,04 % | 3,55 % | 3,38 % | 4,63 % |
| Objekt nach Zuschuss, ohne Geb.-RW | 1,01 % | 0,61 % | 0,53 % | 2,60 % |
| Objekt nach Zuschuss, ohne RW | −0,11 % | −0,32 % | −0,32 % | 2,19 % |
| EK-IRR, mit RW | 6,03 % | 5,85 % | 5,81 % | – |
| EK-IRR, ohne Geb.-RW | 1,53 % | 0,72 % | 0,47 % | – |
| EK-IRR, ohne RW | −1,50 %* | −3,64 %* | −4,69 %* | – |
| VOFI-EK-Rendite, mit RW | 5,72 % | 5,75 % | 5,77 % | – |
| VOFI-EK-Rendite, ohne Geb.-RW | 1,63 % | 0,76 % | 0,32 % | – |
| VOFI-EK-Rendite, ohne RW | −0,15 % | −2,01 % | −3,30 % | – |

\* mehrere Nullstellen (Vorzeichenwechsel durch Restschuld oder Schlussrate am Horizont); angegeben ist die größte Nullstelle mit fallendem Barwert. In diesen Fällen ist die VOFI-EK-Rendite maßgeblich.

Restwert T35 (Mio. €): A 8,79 = Boden 1,18 + Gebäude 7,61; B 9,57 = Boden 1,18 + Gebäude 8,39; C 9,92 = Boden 1,18 + Gebäude 8,74; Frei 11,06 = Boden 1,18 + Gebäude 9,88. Bindungsabschlag gegenüber Marktmietniveau: A 2,26, B 1,49, C 1,14 Mio. €. LZ 2,80 % bei RND 45 J.; Restschuld NBank T35: A 0,35, B 0,53, C 0,61 Mio. €.

Lesart: Brutto liegt A < B < C (höhere Miete), nach Zuschuss kehrt sich die Folge um (A hat den größten Zuschuss). Die EK-Sicht enthält zusätzlich den Zinsvorteil des Darlehens und die Hebelwirkung. „Ohne Geb.-RW“ ist die vorsichtige Lesart für Investoren (Boden bleibt); „ohne RW“ unterstellt, dass auch der Boden wertlos ist, und dient nur als Untergrenze. Frei finanziert: nur Objektsicht (keine Finanzierungsannahme im Broschürenprojekt).

## 5. Überkompensationskennzahl der NBank (getrennt von den Investorenkennzahlen)

RL Nr. 11.10 Abs. 3/4: EK-Rendite aus einem VOFI, bezogen auf das einzusetzende EK, Grenzwert Swap 30 J. + 100 Bp = **4,39 %** (Swapsatz 3,39 % vom 19.08.2026, PH: vor Verwendung aktualisieren). Methode, Horizont und Restwert sind in der RL nicht festgelegt; DAWI-Beschluss Art. 6 Abs. 1: IRR über den Betrauungszeitraum. Primärgröße hier: VOFI-EK-Rendite mit Restwert; Gegenrechnung: EK-IRR mit Restwert; beide für T35 und T42 auf derselben Zeitbasis. Varianten ohne Restwert nur nachrichtlich.

| Größe (Abstand zum Grenzwert) | A | B | C |
| --- | ---: | ---: | ---: |
| VOFI-EK mit RW, T35 | 5,72 % (+1,33 Pp) | 5,75 % (+1,36 Pp) | 5,77 % (+1,38 Pp) |
| VOFI-EK mit RW, T42 | 5,52 % (+1,13 Pp) | 5,56 % (+1,17 Pp) | 5,58 % (+1,19 Pp) |
| EK-IRR mit RW, T35 | 6,03 % (+1,64 Pp) | 5,85 % (+1,46 Pp) | 5,81 % (+1,42 Pp) |
| EK-IRR mit RW, T42 | 5,90 % (+1,51 Pp) | 5,73 % (+1,34 Pp) | 5,70 % (+1,31 Pp) |
| nachr.: VOFI-EK ohne Geb.-RW, T35 | 1,63 % (−2,76 Pp) | 0,76 % (−3,63 Pp) | 0,32 % (−4,07 Pp) |
| nachr.: EK-IRR ohne Geb.-RW, T35 | 1,53 % (−2,86 Pp) | 0,72 % (−3,67 Pp) | 0,47 % (−3,92 Pp) |
| nachr.: VOFI-EK ohne RW, T35 | −0,15 % (−4,54 Pp) | −2,01 % (−6,40 Pp) | −3,30 % (−7,69 Pp) |
| nachr.: EK-IRR ohne RW, T35 | −1,50 %* (−5,89 Pp) | −3,64 %* (−8,03 Pp) | −4,69 %* (−9,08 Pp) |

\* mehrere Nullstellen (Vorzeichenwechsel durch Restschuld oder Schlussrate am Horizont); angegeben ist die größte Nullstelle mit fallendem Barwert. In diesen Fällen ist die VOFI-EK-Rendite maßgeblich.

Befund nach der konservativen Regel des Konzepts (nicht erfüllt, sobald eine Variante mit Restwert über dem Grenzwert liegt): A: nicht erfüllt (ergänzende Prüfung Art. 6 Abs. 4); B: nicht erfüllt (ergänzende Prüfung Art. 6 Abs. 4); C: nicht erfüllt (ergänzende Prüfung Art. 6 Abs. 4). Das ist keine Aussage der NBank, nur die Orientierungsrechnung; die maßgebliche Größe ist mit der NBank abzustimmen.

## 6. Sensitivität Tilgungssatz

Linear in % des Ursprungsdarlehens ab Jahr 1 (Ausnahme: Aufschub). Liegt der Satz unter 1/42, wird die Restschuld im Jahr 42 als Schlussrate getilgt (RL Nr. 5.3.5: Laufzeit höchstens 42 Jahre); die Spalte nennt deren Höhe.

**Liquidität**

| Tilgung | ZÜ J1 A | ZÜ J1 B | ZÜ J1 C | DSCR J1 A | DSCR J1 B | DSCR J1 C | kum. Fehlbetrag A | kum. Fehlbetrag B | kum. Fehlbetrag C | Schlussrate T42 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0,00 % (nur VKB) | 70.455 | 86.505 | 96.176 | 6,03 | 5,12 | 4,93 | 0 | 0 | 0 | 100 % |
| 1,00 % | 42.455 | 44.505 | 47.176 | 2,01 | 1,71 | 1,64 | 0 | 0 | 0 | 58 % |
| 1,25 % (WFB 2024, Jahr 1 bis 35) | 35.455 | 34.005 | 34.926 | 1,72 | 1,46 | 1,41 | 0 | 0 | 0 | 48 % |
| 1,50 % | 28.455 | 23.505 | 22.676 | 1,51 | 1,28 | 1,23 | 0 | 0 | 0 | 37 % |
| 2,00 % | 14.455 | 2.505 | −1.824 | 1,21 | 1,02 | 0,99 | 0 | 0 | −5.663 | 16 % |
| 2,38 % (1/42, Volltilgung in 42 J.) | 3.789 | −13.495 | −20.491 | 1,05 | 0,89 | 0,85 | 0 | −57.036 | −100.472 | 0 % |
| 2,50 % (PGN, 1/40) | 455 | −18.495 | −26.324 | 1,01 | 0,85 | 0,82 | 0 | −92.052 | −151.922 | 0 % |
| 2,70 % nach 5 J. Aufschub (1/37) | 70.455 | 86.505 | 96.176 | 6,03 | 5,12 | 4,93 | 0 | 0 | 0 | 0 % |
| 3,03 % (PGN Worst, 1/33) | −14.393 | −40.768 | −52.309 | 0,85 | 0,73 | 0,70 | −71.782 | −342.890 | −479.026 | 0 % |

**Renditen T42**

| Tilgung | EK-IRR mit RW A | B | C | EK-IRR ohne Geb.-RW A | B | C | VOFI-EK mit RW A | B | C |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0,00 % (nur VKB) | 7,70 % | 8,51 % | 9,04 % | 4,90 %* | 6,02 %* | 6,89 %* | 5,60 % | 5,69 % | 5,75 % |
| 1,00 % | 6,86 % | 7,13 % | 7,33 % | 3,79 %* | 3,90 %* | 4,18 %* | 5,57 % | 5,65 % | 5,70 % |
| 1,25 % (WFB 2024, Jahr 1 bis 35) | 6,67 % | 6,84 % | 6,99 % | 3,59 % | 3,57 %* | 3,75 %* | 5,56 % | 5,63 % | 5,68 % |
| 1,50 % | 6,50 % | 6,58 % | 6,68 % | 3,42 % | 3,30 %* | 3,41 %* | 5,55 % | 5,62 % | 5,67 % |
| 2,00 % | 6,18 % | 6,12 % | 6,15 % | 3,14 % | 2,91 % | 2,93 % | 5,53 % | 5,60 % | 5,64 % |
| 2,38 % (1/42, Volltilgung in 42 J.) | 5,96 % | 5,82 % | 5,80 % | 2,97 % | 2,69 % | 2,69 % | 5,52 % | 5,57 % | 5,60 % |
| 2,50 % (PGN, 1/40) | 5,90 % | 5,73 % | 5,70 % | 2,92 % | 2,64 % | 2,63 % | 5,52 % | 5,56 % | 5,58 % |
| 2,70 % nach 5 J. Aufschub (1/37) | 6,34 % | 6,34 % | 6,40 % | 3,24 % | 3,05 % | 3,10 % | 5,55 % | 5,62 % | 5,67 % |
| 3,03 % (PGN Worst, 1/33) | 5,64 % | 5,39 % | 5,31 % | 2,71 % | 2,39 % | 2,36 % | 5,47 % | 5,39 % | 5,35 % |

\* mehrere Nullstellen (Vorzeichenwechsel durch Restschuld oder Schlussrate am Horizont); angegeben ist die größte Nullstelle mit fallendem Barwert. In diesen Fällen ist die VOFI-EK-Rendite maßgeblich.

Lesart: Bei 0 % Zins ist eine niedrigere Tilgung für den Eigentümer ein zinsloser Aufschub: Liquidität und EK-Rendite steigen, die Objektrendite bleibt gleich (sie ist finanzierungsunabhängig). Der Tilgungssatz verschiebt deshalb die EK-Renditen und vor allem die Rangfolge der Gruppen im Zahlungsüberschuss (S. 12), nicht die Objektrendite.

## 7. Sensitivität Restwert

**Restwert in Mio. €**

| Variante | T35 A | T35 B | T35 C | T42 A | T42 B | T42 C |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Basis: Ertragswert, Bindungsabschlag bis Zielmiete Marktmiete, einheitlicher Preisstand | 8,79 | 9,57 | 9,92 | 10,66 | 11,28 | 11,51 |
| Zielmiete ortsübliche Vergleichsmiete (Kappung § 558 BGB ohne Mieterwechsel) | 8,17 | 8,79 | 9,06 | 9,77 | 10,18 | 10,29 |
| wie VOFI: Marktmiete, kein Abschlag am Horizont (`Gefoerdert_*!AC/AD`) | 9,78 | 10,13 | 10,33 | 11,90 | 11,90 | 11,90 |
| Liegenschaftszins −0,5 Pp | 9,82 | 10,63 | 10,99 | 11,68 | 12,32 | 12,55 |
| Liegenschaftszins +0,5 Pp | 7,91 | 8,65 | 8,99 | 9,76 | 10,37 | 10,59 |
| Veräußerungskosten 5 % | 8,35 | 9,09 | 9,42 | 10,13 | 10,72 | 10,93 |
| Sachwert-Plausibilisierung: Herstellung +2 % p. a., linear über GND 80 J. abgeschrieben | 8,27 | 8,27 | 8,27 | 8,18 | 8,18 | 8,18 |
| Gebäude-Restwert 50 % | 4,99 | 5,37 | 5,55 | 5,98 | 6,30 | 6,41 |
| ohne Gebäude-Restwert (nur Boden) | 1,18 | 1,18 | 1,18 | 1,31 | 1,31 | 1,31 |
| ohne Restwert | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |

**EK-IRR und Objektrendite nach Zuschuss**

| Variante | EK-IRR T35 A | B | C | EK-IRR T42 A | B | C | Objekt n. Z. T42 A | B | C |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Basis: Ertragswert, Bindungsabschlag bis Zielmiete Marktmiete, einheitlicher Preisstand | 6,03 % | 5,85 % | 5,81 % | 5,90 % | 5,73 % | 5,70 % | 4,16 % | 3,71 % | 3,56 % |
| Zielmiete ortsübliche Vergleichsmiete (Kappung § 558 BGB ohne Mieterwechsel) | 5,84 % | 5,61 % | 5,56 % | 5,73 % | 5,53 % | 5,48 % | 4,02 % | 3,56 % | 3,40 % |
| wie VOFI: Marktmiete, kein Abschlag am Horizont (`Gefoerdert_*!AC/AD`) | 6,32 % | 6,00 % | 5,93 % | 6,11 % | 5,84 % | 5,77 % | 4,34 % | 3,79 % | 3,61 % |
| Liegenschaftszins −0,5 Pp | 6,33 % | 6,14 % | 6,10 % | 6,08 % | 5,90 % | 5,87 % | 4,31 % | 3,85 % | 3,69 % |
| Liegenschaftszins +0,5 Pp | 5,76 % | 5,57 % | 5,54 % | 5,73 % | 5,57 % | 5,54 % | 4,02 % | 3,58 % | 3,44 % |
| Veräußerungskosten 5 % | 5,90 % | 5,71 % | 5,67 % | 5,80 % | 5,63 % | 5,60 % | 4,07 % | 3,63 % | 3,49 % |
| Sachwert-Plausibilisierung: Herstellung +2 % p. a., linear über GND 80 J. abgeschrieben | 5,87 % | 5,44 % | 5,31 % | 5,40 % | 5,12 % | 5,06 % | 3,75 % | 3,24 % | 3,08 % |
| Gebäude-Restwert 50 % | 4,59 % | 4,29 % | 4,23 % | 4,86 % | 4,66 % | 4,63 % | 3,31 % | 2,90 % | 2,78 % |
| ohne Gebäude-Restwert (nur Boden) | 1,53 % | 0,72 % | 0,47 % | 2,92 % | 2,64 % | 2,63 % | 1,88 % | 1,57 % | 1,51 % |
| ohne Restwert | −1,50 %* | −3,64 %* | −4,69 %* | 1,82 % | 1,57 % | 1,61 % | 1,20 % | 1,01 % | 1,00 % |

\* mehrere Nullstellen (Vorzeichenwechsel durch Restschuld oder Schlussrate am Horizont); angegeben ist die größte Nullstelle mit fallendem Barwert. In diesen Fällen ist die VOFI-EK-Rendite maßgeblich.

Einordnung: Gesamtkosten 7,00 Mio. €. Der Restwert T42 (Basis, A) beträgt das 1,52-Fache der Gesamtkosten nominal bzw. das 0,66-Fache real (2 % p. a. deflationiert). Anteil des Restwerts am Endvermögen VOFI T42 (A): 77 %.

## 8. Weitere Sensitivitäten

| Variante (T42, mit RW) | EK-IRR A | B | C | VOFI-EK A | B | C | Objekt n. Z. A | B | C |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Basis (EK in T0) | 5,90 % | 5,73 % | 5,70 % | 5,52 % | 5,56 % | 5,58 % | 4,16 % | 3,71 % | 3,56 % |
| EK 1,0 Jahr vor T0 gebunden (Bauzeit 12 Monate, EK zuerst) | 5,74 % | 5,59 % | 5,56 % | 5,38 % | 5,43 % | 5,45 % | 4,16 % | 3,71 % | 3,56 % |
| EK 2,5 Jahre vor T0 gebunden (Vorlaufzeit des Modells, Eingabe!C107) | 5,51 % | 5,39 % | 5,37 % | 5,20 % | 5,24 % | 5,26 % | 4,16 % | 3,71 % | 3,56 % |
| Kostenstand auf T1 fortgeschrieben (+2 Jahre × 2 %) | 5,84 % | 5,68 % | 5,65 % | 5,48 % | 5,53 % | 5,55 % | 4,12 % | 3,68 % | 3,54 % |

Die Vorlaufzeit wirkt hier als datierte EK-Zahlung in IRR und VOFI gleich (Befund R5/R4 Rechentechnik: im Modell nur im VOFI-Exponenten). Eine Bauphase mit Teilauszahlungen und VKB ab Auszahlung ist nicht modelliert (PH).

## 9. Abgleich mit dem VOFI-Modell

### 9.1 Replikation des PGN-Referenzprojekts (Modellkonvention gegen Excel-Cache)

Die Rechnung in Modellkonvention (bares EK = 20 % der zuwendungsfähigen Kosten, Entgelte über Bankdarlehen, Vorlaufzeit 2,5 J. im VOFI-Exponenten, Restwert wie `Gefoerdert_*!AC/AD`) mit den Eingaben der Mappe:

| Kennzahl | Zelle | VOFI (Cache) | Referenzrechnung | Abw. (rel.) |
| --- | ---: | ---: | ---: | ---: |
| A: K1 | Dashboard!C43 | 1,659 % | 1,659 % | 0,0e+00 |
| A: K3 | Dashboard!C55 | 6,376 % | 6,376 % | 0,0e+00 |
| A: K5 | Dashboard!C57 | 3,345 % | 3,345 % | 0,0e+00 |
| A: K6 | Dashboard!C58 | 7,924 % | 7,924 % | 3,3e-16 |
| A: DSCR_T1 | Dashboard!C20 | 1,3385 | 1,3385 | 0,0e+00 |
| A: K3_T35 | Bewertung!N25 | 6,793 % | 6,793 % | 0,0e+00 |
| A: K5_T35 | Bewertung!O25 | 2,370 % | 2,370 % | 0,0e+00 |
| A: VW_T42 | Bewertung!L30 | 6.713.518 | 6.713.518 | 9,7e-16 |
| A: ZUE_T1 | Gefoerdert_A!Q7 | 12.429 | 12.429 | 0,0e+00 |
| B: K1 | Dashboard!D43 | 2,119 % | 2,119 % | 0,0e+00 |
| B: K3 | Dashboard!D55 | 6,440 % | 6,440 % | 0,0e+00 |
| B: K5 | Dashboard!D57 | 3,563 % | 3,563 % | 0,0e+00 |
| B: K6 | Dashboard!D58 | 7,930 % | 7,930 % | 1,1e-16 |
| B: DSCR_T1 | Dashboard!D20 | 1,1502 | 1,1502 | 0,0e+00 |
| B: K3_T35 | Bewertung!N26 | 6,880 % | 6,880 % | 0,0e+00 |
| B: K5_T35 | Bewertung!O26 | 2,385 % | 2,385 % | 0,0e+00 |
| B: VW_T42 | Bewertung!L31 | 6.713.518 | 6.713.518 | 9,7e-16 |
| B: ZUE_T1 | Gefoerdert_B!Q7 | 8.198 | 8.198 | 0,0e+00 |
| C: K1 | Dashboard!E43 | 2,382 % | 2,382 % | 0,0e+00 |
| C: K3 | Dashboard!E55 | 6,494 % | 6,494 % | 0,0e+00 |
| C: K5 | Dashboard!E57 | 3,737 % | 3,737 % | 0,0e+00 |
| C: K6 | Dashboard!E58 | 8,021 % | 8,021 % | 1,1e-16 |
| C: DSCR_T1 | Dashboard!E20 | 1,1111 | 1,1111 | 0,0e+00 |
| C: K3_T35 | Bewertung!N27 | 6,954 % | 6,954 % | 0,0e+00 |
| C: K5_T35 | Bewertung!O27 | 2,515 % | 2,515 % | 0,0e+00 |
| C: VW_T42 | Bewertung!L32 | 6.713.518 | 6.713.518 | 9,7e-16 |
| C: ZUE_T1 | Gefoerdert_C!Q7 | 7.056 | 7.056 | 0,0e+00 |

Größte Abweichung 9,7e-16: Die Rechnung bildet die Mappe in Modellkonvention exakt nach. Unterschiede in den folgenden Abschnitten sind deshalb Konventionsunterschiede, keine Rechenfehler.

### 9.2 Broschürenprojekt im VOFI (LibreOffice-Neuberechnung einer Kopie) gegen Modellkonvention

Alle 117 Vergleichswerte der drei LibreOffice-Läufe (FR03, EK, EKVL0; Definition in `VOFI_LO_BROSCHUERE`) werden in Modellkonvention mit einer größten relativen Abweichung von 4,0e-13 getroffen. Ausgewählte Werte des Laufs FR03 (Mappe, wie geliefert, nur Projektdaten geändert):

| VOFI, Broschüreneingaben | A | B | C |
| --- | ---: | ---: | ---: |
| Eigenkapital (Dashboard!C11:E11) | 2.100.000 | 2.100.000 | 2.100.000 |
| Kasse T0 (`Gefoerdert_*!Y6`) | 651.000 | 647.500 | 645.750 |
| K1 Nettoanfangsrendite (C43) | 1,21 % | 1,54 % | 1,72 % |
| K2 Wertüberschuss T0 vor boG (C44) | −10,4 % | −10,4 % | −10,4 % |
| K3 VOFI-EK mit RW, 44,5 J. (C55) | 4,75 % | 4,71 % | 4,71 % |
| K5 VOFI-EK ohne RW, 44,5 J. (C57) | 1,80 % | 1,66 % | 1,67 % |
| K6 EK-IRR mit RW, 42 J. (C58) | 6,11 % | 5,84 % | 5,77 % |
| K3 T35 (Bewertung!N25:N27) | 4,86 % | 4,81 % | 4,81 % |
| Verkehrswert T42 (C47) | 11.899.677 | 11.899.677 | 11.899.677 |
| Cashflow T1 (`Gefoerdert_*!Q7`) | 455 | −18.495 | −26.324 |
| DSCR T1 (C20) | 1,01 | 0,85 | 0,82 |

### 9.3 Überleitung von der VOFI-Kennzahl zur sauberen Kennzahl (Horizont T42, mit Restwert)

| Schritt | VOFI-EK A | B | C | EK-IRR A | B | C | VOFI ohne RW A | B | C |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 Mappe wie geliefert (FR-03 aktiv: EK 2,1 Mio. €, Kasse T0 0,65 Mio. €) | 4,75 % | 4,71 % | 4,71 % | 6,11 % | 5,84 % | 5,77 % | 1,80 % | 1,66 % | 1,67 % |
| 1 EK ohne Doppelzählung des Grundstücks (EK 1,4 Mio. €, Entgelte über Bank) | 5,46 % | 5,40 % | 5,38 % | 6,14 % | 5,86 % | 5,79 % | 1,74 % | 1,41 % | 1,32 % |
| 2 Vorlaufzeit nicht im Exponenten (gleiche Zeitbasis wie der IRR) | 5,79 % | 5,73 % | 5,71 % | 6,14 % | 5,86 % | 5,79 % | 1,84 % | 1,49 % | 1,40 % |
| 3 Bearbeitungsentgelte aus EK statt Bankdarlehen | 5,73 % | 5,67 % | 5,65 % | 6,11 % | 5,84 % | 5,77 % | 1,87 % | 1,58 % | 1,51 % |
| 4 Restwert mit fortgeführtem Bindungsabschlag, einheitlicher Preisstand (= Basis) | 5,52 % | 5,56 % | 5,58 % | 5,90 % | 5,73 % | 5,70 % | 1,87 % | 1,58 % | 1,51 % |
| 5 nachr.: Zielmiete Vergleichsmiete statt Marktmiete | 5,35 % | 5,35 % | 5,36 % | 5,73 % | 5,53 % | 5,48 % | 1,87 % | 1,58 % | 1,51 % |

Schritt 0 bis 2 sind mit den LibreOffice-Läufen FR03, EK und EKVL0 belegt (Abschnitt 9.2).

**Erklärung der Abweichungen (Werte für A, T42):**

- **Schritt 1, Eigenkapital (Befund FR-03):** Die Mappe setzt das bare EK fest auf 20 % der zuwendungsfähigen Kosten (Eingabe!C88 `=0.2*Zuwendungsfaehig`) und zählt das Grundstück zusätzlich (Basisdaten!C126 `=KG_Grundstueck+EK_bar`). Im Broschürenprojekt wird das EK so 2.100.000 € statt 1.400.000 €; der Überschuss von 651.000 € liegt als Kasse T0 im VOFI-Konto (Gefoerdert_A!Y6) und verzinst sich zu 2 %. Das vergrößert den Nenner und drückt K3; ohne Doppelzählung ändert sich K3 um +0,71 Pp. Der IRR ändert sich kaum (+0,02 Pp), weil die Kasse in T0 mit dem EK verrechnet wird (`Gefoerdert_*!AJ6` `=T6-Eigenkapital`). Die Mappe meldet das selbst (Dashboard!C67: „übersteigt die Gesamtkosten um 651,000 €“).
- **Schritt 2, Vorlaufzeit (Befund R5):** 2,5 Jahre nur im Exponenten von K3/K5 (Bewertung!N30 `(M30/Eigenkapital)^(1/($B30+Vorlaufzeit_Jahre))-1`), nicht im IRR. Ohne diesen Zuschlag: VOFI +0,33 Pp. Als datierte EK-Zahlung gerechnet, kostet dieselbe Vorlaufzeit VOFI und IRR gleichermaßen (Abschnitt 8).
- **Schritt 3, Bearbeitungsentgelte:** In der Mappe über ein Bankdarlehen zu 3,74 % (Basisdaten!C78), hier aus EK. VOFI −0,06 Pp, IRR −0,02 Pp. Das Bankdarlehen erklärt auch den Cashflow T1 des Laufs EK (Gefoerdert_A!Q7 −2.290 € statt 455 €): Kapitaldienst Bank A 2.745 €, B 2.941 €, C 3.039 €. Ohne Bankdarlehen gleicht die Jahresrechnung der Broschüre dem Cashflow der Mappe (Lauf FR03, Q7:Q9) auf den Euro.
- **Schritt 4, Restwert (Befunde R2/R3/R4):** Die Mappe kapitalisiert in T42 die volle Marktmiete; der Abschlag für die gebundene Bestandsmiete ist dort konstruktionsbedingt 0 (`Gefoerdert_*!AD48`, Summe nur bis BoG_Grenze = 42). Die Referenzrechnung führt den Abschlag fort, bis die Bestandsmiete über die Kappung (20 % je 3 Jahre) die Marktmiete erreicht, auf einheitlichem Preisstand: Restwert A 11,90 → 10,66 Mio. € (Abschlag 1,24 Mio. €; B 0,62, C 0,39). VOFI −0,22 Pp, IRR −0,21 Pp; je höher der Abschlag, desto stärker trifft es A.
- **Verbleibende Methodendifferenz VOFI gegen IRR (Befund R2 Rendite):** 5,90 % gegen 5,52 % = +0,38 Pp. Der VOFI legt Überschüsse zu 2 % an bzw. finanziert Fehlbeträge zu 5 %, der IRR unterstellt Wiederanlage zum IRR. Beide Größen sind richtig, aber nicht gegeneinander als „mit/ohne“ lesbar.
- **Objektebene:** Die Mappe hat nur K1 = Reinertrag T1 ÷ Gesamtkosten (Dashboard!C43 `=INDEX(SA_Reinertrag,MATCH(1,SA_t,0))/Gesamtkosten`), im Broschürenprojekt 1,21 % / 1,54 % / 1,72 %. Das ist der statische Jahr-1-Wert der Reihe „Objekt brutto“; eine dynamische Objektrendite (Abschnitt 4) gibt es in der Mappe nicht (Befund R1).

### 9.4 Saubere Kennzahlen für das PGN-Referenzprojekt (nachrichtlich)

| Kennzahl (Referenzprojekt, sauber) | T42 A | T42 B | T42 C | T35 A | T35 B | T35 C |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Objekt brutto, mit RW | 3,45 % | 4,02 % | 4,31 % | 3,23 % | 3,89 % | 4,23 % |
| Objekt nach Zuschuss, mit RW | 5,28 % | 4,85 % | 4,72 % | 5,31 % | 4,83 % | 4,68 % |
| Objekt nach Zuschuss, ohne RW | 2,66 % | 2,46 % | 2,46 % | 1,54 % | 1,33 % | 1,34 % |
| EK-IRR mit RW | 7,68 % | 7,79 % | 7,91 % | 8,04 % | 8,16 % | 8,30 % |
| EK-IRR ohne RW | 4,66 % | 4,90 % | 5,17 % | 3,03 %* | 3,02 %* | 3,26 %* |
| VOFI-EK mit RW | 6,49 % | 6,66 % | 6,75 % | 6,95 % | 7,16 % | 7,27 % |
| VOFI-EK ohne RW | 3,52 % | 3,74 % | 3,92 % | 2,55 % | 2,56 % | 2,70 % |

\* mehrere Nullstellen (Vorzeichenwechsel durch Restschuld oder Schlussrate am Horizont); angegeben ist die größte Nullstelle mit fallendem Barwert. In diesen Fällen ist die VOFI-EK-Rendite maßgeblich.

Vergleich mit der Mappe (T42, A): K3 6,38 %, K6 7,92 %, K5 3,34 %. Im Referenzprojekt ist das Grundstück 0 €, FR-03 wirkt dort nicht; die Abweichung kommt aus Vorlaufzeit, Entgeltfinanzierung und Restwert (Bindungsabschlag nach T42).

## 10. Grenzen der Rechnung

- Vor Steuern; keine AfA, keine Sonderabschreibung, keine Ertragsteuer (wie das Modell, Dashboard!A2).
- Keine Bauphase mit Teilauszahlungen, keine Bauzeitzinsen (KG 800 = 0), VKB erst ab Jahr 1; Auszahlung in vier Raten (RL Nr. 5.5.3) nicht abgebildet.
- Mieterhöhungen werden voll ausgeschöpft; keine Leerstands-Betriebskosten, keine Modernisierung, keine Instandhaltungszyklen.
- Marktmiete und Vergleichsmiete stammen vom Standort des PGN-Referenzprojekts (Mietenstufe VI); für ein Modellhaus „Mietenstufe IV bis VII“ sind sie nur Platzhalter. Sie bestimmen den Restwert und damit alle Renditen mit Restwert.
- Zins nach Jahr 35: 3,74 % (Modell, Marktobergrenze), nicht aus Basiszinssatz + 3 Pp hergeleitet.
- Ein Szenario (Basis). Best/Worst des Modells sind über die Parameter nachrechenbar, aber nicht ausgegeben.

