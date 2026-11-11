# VOFI Mietwohnraum 2026: Änderungen in Version 3

`PGN_VOFI_Mietwohnraum_2026_v3.xlsx` ersetzt `PGN_NBank_VOFI_Modell_v2-1.xlsx` (v2-1, bleibt unverändert). Stand 11.11.2026; vor Steuern, nominal, Jahr 0 = Bezugsfertigkeit.

## 1. Was ist neu

Neun Blätter: Übersicht · Eingaben · Gefördert A, B, C · Frei finanziert · NBank (intern) · Tabellen (Festwerte RL 2026) · Hinweise. Zwei Projekte, Umschalten mit einer Zelle: Modellhaus Broschüre (voreingestellt) und Tarutinoer Str. 4, Neu Wulmstorf. Vier Ebenen:

1. Liquidität: Jahresrechnung Jahr 1, Zahlungsüberschuss, DSCR, Fehlbetrag, Tilgungsvergleich.
2. Objekt: Objekt-IRR ohne Zuschuss, nach Zuschuss, nach Förderbarwert; frei mit wählbarer Miete (10.1).
3. Eigenkapital: EK-IRR und VOFI-EK-Rendite auf gleicher Zeitbasis, Restwertanteil am Endvermögen.
4. NBank (intern): EK-Renditen gegen Swapsatz + 1 Prozentpunkt, nur „über“ oder „unter“.

Ebenen 2 und 3 je mit Restwert, nur Bodenwert, ohne Restwert; Jahr 35 und 42. Frei in den Ebenen 1 bis 3: Mindest-Eigenmittel wie gefördert zuzüglich 7.1, Rest Bankdarlehen (Block 6); Miete: Markt oder DSCR-Ziel.

## 2. Umfang

v2-1 → v3: Blätter 13 → 9; Eingaben 75 + Szenario-Umschalter → 39 je Projekt; Formeln 10.197 → 9.828; benannte Bereiche 384 → 66; Textzellen 1.104 (58.426 Zeichen, 116 über 120) → 1.856 (31.202; 10).

## 3. Weggefallen oder vereinfacht

- Szenario-Umschalter → Stresstest, Block 9 (Werte in Abschnitt 7).
- Entnahmemodus, Kontokorrent, Zinsstaffel, LTV, ICR → entfallen, ohne Wirkung auf Ergebnisse.
- Prolongationsmodi, Realrendite, Stichtage 1–6 → eine Anschlussregel; Jahr 1, 10, 35, 42.
- Mietband, Marktschalter, Formeln in Eingaben → je Größe eine Zahl; RL-Festwerte im Blatt Tabellen.
- Modellannahmen, Formel-Prosa, K1–K7, 6 Nebenblätter → Hinweise, Prüfblock, vier Ebenen.
- „Frei, obere Kante“ mit fester Miete 18,80 €/m² → Auswahl 10.1, Miete berechnet, Aufschlag ausgewiesen.

## 4. Korrekturen B1–B11

Tarutinoer, Gruppe A, Jahr 42, v2-1 → v3 bei gleicher Tilgung (2,5 %); Förderung, Mieten, Bewirtschaftung, Tilgung Jahr 1: auf den Cent gleich.

| Befund | Umsetzung | Wirkung |
|---|---|---|
| B1 keine Objektrendite | Objekt-IRR, drei Stufen | neu: 3,45 / 5,28 / 6,59 %; frei 6,17 % |
| B2 EK-Renditen ungepaart | drei Restwert-Varianten | VOFI-EK 6,49 / 3,52 %; Restwertanteil 70 % |
| B3 Überkompensation wertend | Blatt NBank neutral | nur „über“/„unter“ 4,39 % |
| B4 Grundstück im Eigenkapital | Sacheinlage + bar | Modellhaus VOFI-EK 4,75 → 5,46 %; Tarutinoer 0 |
| B5/B6 Restwert ohne Abschlag | Abschlag bis Zielmiete | Restwert 6,71 → 5,98 Mio. €; VOFI-EK −0,21 Pp |
| B7 Vorlaufzeit im Exponenten | entfällt | VOFI-EK +0,39 Pp |
| B8 Kostenstand | Eingabe 5.5 | 0; Modellhaus mit 5.5 = 2: A 455 → −656 € |
| B9 Entnahmen, B10 „obere Kante“ | entfällt; B10: Auswahl 10.1 | Vergleich frei 7,59 → 6,17 % |
| B11 Wertüberschuss vor Abschlag | nach Abschlag | +23,2 % → −38,7 % |
| Bearbeitungsentgelte | aus Eigenkapital statt Bank | Zahlungsüberschuss Jahr 1 12.429 → 13.591 € |
| Anfangsmiete gefördert | höchstens Marktmiete | 0; greift nur bei niedriger Marktmiete |

Gesamt mit Restwert bei gleicher Tilgung (2,5 %): VOFI-EK 6,38 → 6,49 %, EK-IRR 7,92 → 7,68 %.

Seit 10.11.2026 rechnen beide Projekte mit Tilgung 2,38 % (linear über die Höchstlaufzeit von 42 Jahren) statt 2,5 %. Tarutinoer: Zahlungsüberschuss Jahr 1 13.591 → 15.003 €, EK-IRR 7,68 → 7,77 %, VOFI-EK unverändert 6,49 %. Modellhaus gegenüber v2-1: VOFI-EK 4,75 → 5,52 %, EK-IRR 6,11 → 5,96 %. Seit 11.11.2026 rechnet das Modellhaus mit Bewertungsansätzen für Rotenburg (Wümme): VOFI-EK 5,17 %, EK-IRR 5,61 % (Abschnitt 9).

## 5. Bedienung

1. Blatt „Eingaben“, Zelle D3: Projekt wählen (1 = Spalte D, 2 = Spalte E).
2. Nur blaue Werte auf Gelb ändern; gerechnet wird mit Spalte „verwendet“. Weiteres Projekt: Dateikopie, eine Projektspalte und den Namen in Zeile 4 überschreiben, dazu auf „Tabellen“ den Liegenschaftszins des Standorts (Tabelle 4, Spalte des Projekts).
3. Blatt „Übersicht“: Zeile 3 zeigt „OK“, sonst nennt der Prüfblock P1–P6 die Ursache (P4, P5 auch Frei).
4. Stresstest: Block 9 sowie 3.1, 5.4, 6.3 ändern (Abschnitt 7), danach zurücksetzen.
5. Frei: 10.1 „Marktmiete“ oder „Miete für DSCR-Ziel“ (Ziel 10.2); Aufschlag: Übersicht Spalte L und 8.5.
6. Nach außen nur Ebene 1 und Annahmen; Renditen nur in der Beratung, je mit Restwert und nur Bodenwert, dazu Restwertanteil; frei nur mit Aufschlag.

## 6. Ergebnisse Modellhaus

Jahresrechnung Jahr 1 in € (Übersicht Zeilen 29–38), gleich Broschüre S. 11; Zeile 6 Zins NBank: 0 bis Jahr 35.

| Zeile | A | B | C |
|---|---:|---:|---:|
| 1 Sollmiete (6,80 / 8,20 / 9,00 €/m²) | 114.240 | 137.760 | 151.200 |
| − Mietausfall/Leerstand 2 % | 2.285 | 2.755 | 3.024 |
| 2 − Objektverwaltung 367 € je WE | 7.340 | 7.340 | 7.340 |
| 3 − Instandhaltung 14,40 €/m² | 20.160 | 20.160 | 20.160 |
| 4 = Überschuss vor Kapitaldienst | 84.455 | 107.505 | 120.676 |
| 5 − Verwaltungskostenbeitrag 0,5 % | 14.000 | 21.000 | 24.500 |
| 7 − Tilgung 2,38 % (linear über 42 Jahre) | 66.667 | 100.000 | 116.667 |
| 8 = Zahlungsüberschuss | 3.789 | −13.495 | −20.491 |

Darlehen 2,8 / 4,2 / 4,9 Mio. €, Zuschuss 2,8 / 1,4 / 0,7 Mio. €, Eigenmittel 1,4 Mio. €, Entgelte 49.000 / 52.500 / 54.250 €. Tilgungsschwellen S. 12: B 1,15 %, C 1,22 %. DSCR Jahr 1: 1,05 / 0,89 / 0,85; größter kumulierter Fehlbetrag 0 / −57.036 / −100.472 €; tragbare Tilgung Jahr 1 2,52 / 2,06 / 1,96 %.

| Renditen in %, Jahr 42 (Jahr 35) | A | B | C | frei |
|---|---:|---:|---:|---:|
| Objekt-IRR ohne Zuschuss, mit Restwert | 2,17 (1,71) | 2,66 (2,30) | 2,91 (2,59) | 4,12 (3,99) |
| Objekt-IRR nach Zuschuss, mit Restwert | 3,86 (3,65) | 3,43 (3,17) | 3,28 (3,01) | 4,12 (3,99) |
| Objekt-IRR nach Förderbarwert, mit Restwert | 5,08 (5,02) | 4,85 (4,77) | 4,78 (4,70) | 4,12 (3,99) |
| EK-IRR, mit Restwert | 5,61 (5,61) | 5,45 (5,43) | 5,42 (5,39) | 4,39 (4,20) |
| EK-IRR, nur Bodenwert | 2,97 (1,57) | 2,69 (0,73) | 2,69 (0,47) | 2,03 (−0,07) |
| VOFI-EK-Rendite, mit Restwert | 5,17 (5,25) | 5,20 (5,26) | 5,22 (5,27) | 3,95 (3,57) |
| VOFI-EK-Rendite, nur Bodenwert | 2,73 (1,67) | 2,55 (0,90) | 2,54 (0,56) | n. v. (n. v.) |
| Restwertanteil am Endvermögen | 74 (84) | 76 (91) | 77 (93) | 136 (187) |

Stand 11.11.2026, mit den Bewertungsansätzen für Rotenburg (Wümme) (Abschnitt 9). NBank: mit Restwert „über“ 4,39 %, nur Bodenwert „unter“. Alle Werte = Referenzrechnung (±0,01 Prozentpunkte, ±1 €).

Frei: Eigenkapital 1,4 Mio. €, Bank 5,6 Mio. € (3,74 %, 30 Jahre), Kapitaldienst 313.703 €; zur Marktmiete 13,30 €/m² Jahr 1 −122.232 €, DSCR 0,61, 25 Jahre Fehlbetrag, Projektkonto in allen 42 Jahren im Soll (tiefster Stand −4,82 Mio. €).

| Miete Jahr 1, €/m² | A | B | C | frei | Aufschlag frei | EK-IRR / VOFI-EK frei, Jahr 42 |
|---|---:|---:|---:|---:|---:|---:|
| gerechnet (Standard) | 6,80 | 8,20 | 9,00 | 13,30 | 0 | 4,39 / 3,95 % |
| nötig für DSCR 1,0 | 6,57 | 9,02 | 10,24 | 20,72 | 55,8 % | 9,00 / 7,50 % |
| nötig für DSCR 1,25 | 7,79 | 10,86 | 12,39 | 25,49 | 91,6 % | 12,38 / 8,33 % |

Renditen frei mit Restwert; Zeile 2 und 3 mit 10.1 = „Miete für DSCR-Ziel“ (Restwert zur selben Miete), keine Marktrenditen. Mit Bestandsmieten (§ 558 BGB) läge der Objekt-IRR frei zur Marktmiete rund 0,4–0,5 Prozentpunkte niedriger.

## 7. Stresstest: Best/Worst aus v2-1

| Eingabe | 9.1 Herstellung | 9.2 Mieten | 9.3 Liegenschaftszins | 5.4 Kosten | 3.1 Tilgung | 6.3 Anschluss |
|---|---:|---:|---:|---:|---:|---:|
| Best | 0,95 | 1,05 | −0,30 % | 1,5 % | 2,50 % | 2,74 % |
| Standard | 1,00 | 1,00 | 0,00 % | 2,0 % | 2,38 % | 3,74 % |
| Worst | 1,15 | 0,95 | +0,60 % | 2,5 % | 3,03 % | 4,74 % |

Alle sechs Werte in der Spalte des aktiven Projekts eintragen. 9.3 ist ein Zuschlag in Prozentpunkten. Worst 3,03 % (33 Jahre) ist in v2-1 nicht begründet; der Standard 3.1 ist seit 10.11.2026 2,38 %.

## 8. Offene Punkte (Prüfbericht Abschnitt 6)

1. Tilgungssatz: Beide Projekte rechnen seit 10.11.2026 mit 2,38 % (linear über die Höchstlaufzeit von 42 Jahren), vorher 2,5 %. Welchen Satz setzt die NBank fest? (NBank)
2. Kostenstand 2026 in Jahr 1 oder fortschreiben (5.5)? Nicht umlagefähige Betriebskosten = 0 bestätigen.
3. Grundstück Tarutinoer 0 € oder 731.325 €? Mit Verkehrswert 309.386 € Bank, Jahr 1 A −7.989 €.
4. Modellhaus: Marktmiete (Eingabe 4.4) und Liegenschaftszins sind seit 11.11.2026 amtliche Werte für Rotenburg (Wümme); die Vergleichsmiete (Eingabe 4.3) ist eine Annahme der PGN. Renditen mit Restwert und der Vergleich mit frei finanziert hängen daran; für einen anderen Standort ersetzen (Abschnitt 9).
5. NBank: Renditegröße, Horizont, Restwert, Swap-Stichtag; Zins ab Jahr 36 (3,74 % oder Basiszins + 3 Pp)?
6. Präsentation: Die Anhangfolie zur Eigenkapitalrendite führt die Werte seit 11.11.2026 (abgeglichen). Druck in Excel ansehen (geprüft nur mit LibreOffice).
7. Frei: Konditionen Block 6 auch für ein Bankdarlehen über 80 % der Kosten? 7.1 frei voll anrechnen?
8. Aus dem Lektorat: Stand der Bundesbank-Statistik zur Quelle von Eingabe 6.1 nachtragen; Bandbreite des Liegenschaftszinses festlegen (Hinweis 13 nennt ±0,5 Prozentpunkte, die amtliche Quelle für Rotenburg streut um ±1,2 Prozentpunkte); „RL Nr. 11.10 Abs. 3“ und „Abs. 4“ am Richtlinientext gegenlesen; Hinweis in Zeile 3 der Zeitreihenblätter bricht auf der zweiten Druckseite ab (hinnehmen oder in die Fußzeile setzen).

## 9. Änderung vom 11.11.2026: Bewertungsansätze des Modellhauses, Liegenschaftszins je Projekt, Lektorat

Auf Entscheidung des Auftraggebers rechnet das Modellhaus (Projekt 1) Restwert und „frei finanziert“ mit amtlichen Werten für Rotenburg (Wümme) statt mit Platzhaltern aus Neu Wulmstorf. Projekt 2 (Tarutinoer Straße) ist in jeder Zahl unverändert. Am Modellhaus bleibt sonst alles: Mietenstufe IV, Kosten, Förderung, Tilgung. Die Restwertmethode bleibt der Ertragswert.

| Größe | bis 10.11.2026 | seit 11.11.2026 | Quelle |
|---|---:|---:|---|
| Eingabe 4.4 Marktmiete Neuvermietung, Jahr 1 | 14,48 €/m² | 13,30 €/m² | Gutachterausschuss Otterndorf, Grundstücksmarktdaten 2026, Mietübersicht Landkreis Rotenburg (Wümme), Stichtag 01.01.2026: Baujahr 2020, 70 m², Lage (Bodenrichtwert) 160 €/m², zwischen 13,11 € (Lage 150) und 14,04 € (Lage 200) eingerechnet. Die Übersicht mischt Bestandsmieten und Neuverträge seit 2022 |
| Eingabe 4.3 Ortsübliche Vergleichsmiete, Jahr 1 | 12,92 €/m² | 11,87 €/m² | Annahme der PGN: dasselbe Verhältnis zur Marktmiete wie bisher (12,92 ÷ 14,48). Einen Mietspiegel für Rotenburg gibt es nicht |
| Liegenschaftszins bei Restnutzungsdauer 30 / 38 / 40 / 50 / 60 / 70 Jahren | 2,5 / 2,7 / 2,7 / 2,9 / 3,0 / 3,1 % | 3,3 / 3,4 / 3,4 / 3,5 / 3,5 / 3,5 % | Oberer Gutachterausschuss Niedersachsen, Landesmodell Mehrfamilienhäuser, Stichtag 01.01.2026, Rotenburg (Wümme), Stadt, mittlerer Bodenrichtwert Geschosswohnungsbau 185 €/m² (Streubreite ±1,2 Prozentpunkte) |

Der Liegenschaftszins gilt jetzt je Projekt. Blatt Tabellen, Tabelle 4 „Bewertung, Liegenschaftszins je Projekt“: Spalte D Projekt 1 (Rotenburg), Spalte E Projekt 2 (Neu Wulmstorf, die bisherigen Werte), Spalte F „verwendet“ für das aktive Projekt. Keine Zeile und keine Spalte ist eingefügt oder verschoben; die Adressen der Blätter Übersicht, Eingaben, Gefördert A, B, C und Frei finanziert sind unverändert.

Wirkung am Modellhaus, Jahr 35 (A / B / C / frei):

| Kennzahl | bis 10.11.2026 | seit 11.11.2026 |
|---|---|---|
| Liegenschaftszins | 2,80 % | 3,45 % |
| Restwert | 8.792.244 / 9.570.534 / 9.919.956 / 11.056.129 € | 7.273.476 / 7.921.311 / 8.189.331 / 8.943.115 € |
| VOFI-EK-Rendite, mit Restwert | 5,74 / 5,78 / 5,81 / 5,52 % | 5,25 / 5,26 / 5,27 / 3,57 % |
| VOFI-EK-Rendite, nur Bodenwert | 1,67 / 0,90 / 0,56 % / n. v. | unverändert |
| EK-IRR, mit Restwert | 6,11 / 5,94 / 5,92 / 5,37 % | 5,61 / 5,43 / 5,39 / 4,20 % |
| Frei: Zahlungsüberschuss Jahr 1 | −102.805 € | −122.232 € |
| Frei: Jahre mit Fehlbetrag / tiefster Stand Projektkonto | 21 / −3.192.817 € | 25 / −4.818.629 € |

Unverändert: Finanzierung, Jahresrechnung Jahr 1 für A, B, C (Zeile 8: 3.789 / −13.495 / −20.491 €), Kapitaldienst, nötige Miete (6,57 / 9,02 / 10,24 / 20,72 €/m²), Liquidität A, B, C, Tilgungsvergleich. Der Ertragswert zur Marktmiete liegt bei Bezug jetzt 26,2 % unter den Gesamtkosten (vorher 10,4 %).

Zu beachten: Die Vergleichsmiete ist bis Jahr 42 die Obergrenze der gebundenen Miete. Mit 11,87 €/m² liegt sie für Gruppe C in Jahr 40 nur 2,8 % über der gerechneten Miete (25,70 gegen 24,99 €/m²). Im Standard greift sie nicht. Mit Effizienzhaus 40 (Eingabe 4.2 = ja), mit dem Stressfaktor 9.2 unter rund 0,97 oder mit einer Mietsteigerung unter rund 1,93 % deckelt sie die Miete der Gruppe C ab Jahr 40.

Lektorat der Texte: 63 Befunde eingearbeitet. Die Mappe erklärt ihre Kürzel (Hinweis 2), nennt jede Größe mit einem Namen (Regeltilgung NBank, Barwertvorteil, Förderbarwert, Tragbare Tilgung, Ertragswert zur Bestandsmiete), verweist auf Eingaben immer als „Eingabe x.y“ und schreibt die Richtlinie einheitlich „RL Nr.“. Keine Zahl ändert sich dadurch. Auf den Zeitreihenblättern sind einzelne Spalten breiter, damit Köpfe nicht im Wort umbrechen; die zweite Druckseite der Zeitreihe beginnt in Zeile 2.

Abnahme am 11.11.2026: 599 Prüfungen ohne Fehler, 68 Testläufe gegen die Referenzrechnung.
