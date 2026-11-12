# VOFI Mietwohnraum 2026: Änderungen in Version 3

`PGN_VOFI_Mietwohnraum_2026_v3.xlsx` ersetzt `PGN_NBank_VOFI_Modell_v2-1.xlsx` (v2-1, bleibt unverändert). Stand 11.11.2026; vor Steuern, nominal, Jahr 0 = Bezugsfertigkeit.

## 1. Was ist neu

Neun Blätter: Übersicht · Eingaben · Gefördert A, B, C · Frei finanziert · NBank (intern) · Tabellen (Festwerte RL 2026) · Hinweise. Zwei Projekte, Umschalten mit einer Zelle: Projekt 1 „Vergleichshaus, 20 Wohnungen“ und Projekt 2 „Modellhaus, Tarutinoer Str. 4“ (Neu Wulmstorf, 14 Wohnungen). Projekt 2 ist seit 11.11.2026 das Modellhaus von Broschüre und Präsentation und voreingestellt (Abschnitt 10); bis dahin war es Projekt 1. Vier Ebenen:

1. Liquidität: Jahresrechnung Jahr 1, Zahlungsüberschuss, DSCR, Fehlbetrag, Tilgungsvergleich.
2. Objekt: Objekt-IRR ohne Zuschuss, nach Zuschuss, nach Förderbarwert; frei mit wählbarer Miete (10.1).
3. Eigenkapital: EK-IRR und VOFI-EK-Rendite auf gleicher Zeitbasis, Restwertanteil am Endvermögen.
4. NBank (intern): EK-Renditen gegen Swapsatz + 1 Prozentpunkt, nur „über“ oder „unter“.

Ebenen 2 und 3 je mit Restwert, nur Bodenwert, ohne Restwert; Jahr 35 und 42. Frei in den Ebenen 1 bis 3: Mindest-Eigenmittel wie gefördert zuzüglich 7.1, Rest Bankdarlehen (Block 6); Miete: Markt oder DSCR-Ziel.

## 2. Umfang

v2-1 → v3: Blätter 13 → 9; Eingaben 75 + Szenario-Umschalter → 39 je Projekt; Formeln 10.197 → 9.828; benannte Bereiche 384 → 66; Textzellen 1.104 (58.426 Zeichen, 116 über 120) → 1.856 (31.592; 10).

## 3. Weggefallen oder vereinfacht

- Szenario-Umschalter → Stresstest, Block 9 (Werte in Abschnitt 7).
- Entnahmemodus, Kontokorrent, Zinsstaffel, LTV, ICR → entfallen, ohne Wirkung auf Ergebnisse.
- Prolongationsmodi, Realrendite, Stichtage 1–6 → eine Anschlussregel; Jahr 1, 10, 35, 42.
- Mietband, Marktschalter, Formeln in Eingaben → je Größe eine Zahl; RL-Festwerte im Blatt Tabellen.
- Modellannahmen, Formel-Prosa, K1–K7, 6 Nebenblätter → Hinweise, Prüfblock, vier Ebenen.
- „Frei, obere Kante“ mit fester Miete 18,80 €/m² → Auswahl 10.1, Miete berechnet, Aufschlag ausgewiesen.

## 4. Korrekturen B1–B11

Tarutinoer (Projekt 2), Gruppe A, Jahr 42, v2-1 → v3 bei gleicher Tilgung (2,5 %); Förderung, Mieten, Bewirtschaftung, Tilgung Jahr 1: auf den Cent gleich.

| Befund | Umsetzung | Wirkung |
|---|---|---|
| B1 keine Objektrendite | Objekt-IRR, drei Stufen | neu: 3,45 / 5,28 / 6,59 %; frei 6,17 % |
| B2 EK-Renditen ungepaart | drei Restwert-Varianten | VOFI-EK 6,49 / 3,52 %; Restwertanteil 70 % |
| B3 Überkompensation wertend | Blatt NBank neutral | nur „über“/„unter“ 4,39 % |
| B4 Grundstück im Eigenkapital | Sacheinlage + bar | Vergleichshaus VOFI-EK 4,75 → 5,46 %; Tarutinoer 0 |
| B5/B6 Restwert ohne Abschlag | Abschlag bis Zielmiete | Restwert 6,71 → 5,98 Mio. €; VOFI-EK −0,21 Pp |
| B7 Vorlaufzeit im Exponenten | entfällt | VOFI-EK +0,39 Pp |
| B8 Kostenstand | Eingabe 5.5 | 0; Vergleichshaus mit 5.5 = 2: A 455 → −656 € |
| B9 Entnahmen, B10 „obere Kante“ | entfällt; B10: Auswahl 10.1 | Vergleich frei 7,59 → 6,17 % |
| B11 Wertüberschuss vor Abschlag | nach Abschlag | +23,2 % → −38,7 % |
| Bearbeitungsentgelte | aus Eigenkapital statt Bank | Zahlungsüberschuss Jahr 1 12.429 → 13.591 € |
| Anfangsmiete gefördert | höchstens Marktmiete | 0; greift nur bei niedriger Marktmiete |

Gesamt mit Restwert bei gleicher Tilgung (2,5 %): VOFI-EK 6,38 → 6,49 %, EK-IRR 7,92 → 7,68 %.

Seit 10.11.2026 rechnen beide Projekte mit Tilgung 2,38 % (linear über die Höchstlaufzeit von 42 Jahren) statt 2,5 %. Tarutinoer: Zahlungsüberschuss Jahr 1 13.591 → 15.003 €, EK-IRR 7,68 → 7,77 %, VOFI-EK unverändert 6,49 %. Vergleichshaus (Projekt 1) gegenüber v2-1: VOFI-EK 4,75 → 5,52 %, EK-IRR 6,11 → 5,96 %. Seit 11.11.2026 rechnet das Vergleichshaus mit Bewertungsansätzen für Rotenburg (Wümme): VOFI-EK 5,17 %, EK-IRR 5,61 % (Abschnitt 9).

## 5. Bedienung

1. Blatt „Eingaben“, Zelle D3: Projekt wählen (1 = Spalte D, 2 = Spalte E). Ausgeliefert mit 2, dem Modellhaus.
2. Nur blaue Werte auf Gelb ändern; gerechnet wird mit Spalte „verwendet“. Weiteres Projekt: Dateikopie, eine Projektspalte und den Namen in Zeile 4 überschreiben, dazu auf „Tabellen“ den Liegenschaftszins des Standorts (Tabelle 4, Spalte des Projekts).
3. Blatt „Übersicht“: Zeile 3 zeigt „OK“, sonst nennt der Prüfblock P1–P6 die Ursache (P4, P5 auch Frei).
4. Stresstest: Block 9 sowie 3.1, 5.4, 6.3 ändern (Abschnitt 7), danach zurücksetzen.
5. Frei: 10.1 „Marktmiete“ oder „Miete für DSCR-Ziel“ (Ziel 10.2); Aufschlag: Übersicht Spalte L und 8.5.
6. Nach außen nur Ebene 1 und Annahmen; Renditen nur in der Beratung, je mit Restwert und nur Bodenwert, dazu Restwertanteil; frei nur mit Aufschlag.

## 6. Ergebnisse Vergleichshaus (Projekt 1, Eingaben D3 = 1)

Bis 11.11.2026 war Projekt 1 das Modellhaus; die Ergebnisse des Modellhauses seit 11.11.2026 stehen in Abschnitt 10.

Jahresrechnung Jahr 1 in € (Übersicht Zeilen 29–38), gleich Broschüre S. 11 im Stand bis 11.11.2026; Zeile 6 Zins NBank: 0 bis Jahr 35.

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
3. Grundstück Tarutinoer: entschieden am 11.11.2026, Grundstück im Bestand, Ansatz 0 € (Abschnitt 10). Zur Einordnung: Mit dem Verkehrswert 731.325 € als Sacheinlage entstünden 309.386 € Bankdarlehen und in Jahr 1 ein Fehlbetrag in Gruppe A von 6.410 €.
4. Vergleichshaus (Projekt 1): Marktmiete (Eingabe 4.4) und Liegenschaftszins sind seit 11.11.2026 amtliche Werte für Rotenburg (Wümme); die Vergleichsmiete (Eingabe 4.3) ist eine Annahme der PGN. Renditen mit Restwert und der Vergleich mit frei finanziert hängen daran; für einen anderen Standort ersetzen (Abschnitt 9).
5. NBank: Renditegröße, Horizont, Restwert, Swap-Stichtag; Zins ab Jahr 36 (3,74 % oder Basiszins + 3 Pp)?
6. Präsentation und Broschüre zeigen seit 11.11.2026 das Modellhaus Projekt 2 (Abschnitt 10). Die Broschüre S. 10 bis 12 gleicht das Prüfskript mit der Mappe ab; für die Präsentation gibt es diesen Abgleich im Prüfskript nicht. Druck in Excel ansehen (geprüft nur mit LibreOffice).
7. Frei: Konditionen Block 6 auch für ein Bankdarlehen über 80 % der Kosten? 7.1 frei voll anrechnen?
8. Aus dem Lektorat: Stand der Bundesbank-Statistik zur Quelle von Eingabe 6.1 nachtragen; Bandbreite des Liegenschaftszinses festlegen (Hinweis 13 nennt ±0,5 Prozentpunkte, die amtliche Quelle für Rotenburg streut um ±1,2 Prozentpunkte); „RL Nr. 11.10 Abs. 3“ und „Abs. 4“ am Richtlinientext gegenlesen; Hinweis in Zeile 3 der Zeitreihenblätter bricht auf der zweiten Druckseite ab (hinnehmen oder in die Fußzeile setzen).

## 9. Änderung vom 11.11.2026: Bewertungsansätze von Projekt 1, Liegenschaftszins je Projekt, Lektorat

Auf Entscheidung des Auftraggebers rechnet Projekt 1 (damals das Modellhaus, seit Abschnitt 10 das Vergleichshaus) Restwert und „frei finanziert“ mit amtlichen Werten für Rotenburg (Wümme) statt mit Platzhaltern aus Neu Wulmstorf. Projekt 2 (Tarutinoer Straße) ist in jeder Zahl unverändert. An Projekt 1 bleibt sonst alles: Mietenstufe IV, Kosten, Förderung, Tilgung. Die Restwertmethode bleibt der Ertragswert.

| Größe | bis 10.11.2026 | seit 11.11.2026 | Quelle |
|---|---:|---:|---|
| Eingabe 4.4 Marktmiete Neuvermietung, Jahr 1 | 14,48 €/m² | 13,30 €/m² | Gutachterausschuss Otterndorf, Grundstücksmarktdaten 2026, Mietübersicht Landkreis Rotenburg (Wümme), Stichtag 01.01.2026: Baujahr 2020, 70 m², Lage (Bodenrichtwert) 160 €/m², zwischen 13,11 € (Lage 150) und 14,04 € (Lage 200) eingerechnet. Die Übersicht mischt Bestandsmieten und Neuverträge seit 2022 |
| Eingabe 4.3 Ortsübliche Vergleichsmiete, Jahr 1 | 12,92 €/m² | 11,87 €/m² | Annahme der PGN: dasselbe Verhältnis zur Marktmiete wie bisher (12,92 ÷ 14,48). Einen Mietspiegel für Rotenburg gibt es nicht |
| Liegenschaftszins bei Restnutzungsdauer 30 / 38 / 40 / 50 / 60 / 70 Jahren | 2,5 / 2,7 / 2,7 / 2,9 / 3,0 / 3,1 % | 3,3 / 3,4 / 3,4 / 3,5 / 3,5 / 3,5 % | Oberer Gutachterausschuss Niedersachsen, Landesmodell Mehrfamilienhäuser, Stichtag 01.01.2026, Rotenburg (Wümme), Stadt, mittlerer Bodenrichtwert Geschosswohnungsbau 185 €/m² (Streubreite ±1,2 Prozentpunkte) |

Der Liegenschaftszins gilt jetzt je Projekt. Blatt Tabellen, Tabelle 4 „Bewertung, Liegenschaftszins je Projekt“: Spalte D Projekt 1 (Rotenburg), Spalte E Projekt 2 (Neu Wulmstorf, die bisherigen Werte), Spalte F „verwendet“ für das aktive Projekt. Keine Zeile und keine Spalte ist eingefügt oder verschoben; die Adressen der Blätter Übersicht, Eingaben, Gefördert A, B, C und Frei finanziert sind unverändert.

Wirkung an Projekt 1, Jahr 35 (A / B / C / frei):

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

Abnahme dieses Stands: 599 Prüfungen ohne Fehler, 68 Testläufe gegen die Referenzrechnung.

## 10. Änderung vom 11.11.2026: Modellhaus ist Projekt 2

Entscheidung des Auftraggebers vom 11.11.2026: Das Modellhaus von Broschüre und Präsentation ist ab jetzt Projekt 2, das PGN-Projekt Tarutinoer Str. 4 in Neu Wulmstorf. Grund: Es rechnet mit den Baukosten, die PGN selbst ermittelt hat. Das Grundstück wird nicht angesetzt, Bezeichnung „Grundstück im Bestand“. Projekt 1 bleibt als zweites Projekt in der Mappe und heißt Vergleichshaus; bis 11.11.2026 war es das Modellhaus.

| Eingabe | Projekt 1, Vergleichshaus | Projekt 2, Modellhaus |
|---|---:|---:|
| Wohnungen / Wohnfläche | 20 / 1.400 m² | 14 / 828 m² |
| Herstellungskosten KG 200–700 | 4.500 €/m² | 3.579 €/m² |
| Grundstück | 700.000 € | im Bestand, Ansatz 0 € |
| Mietenstufe | IV | VI |
| Vergleichsmiete / Marktmiete Jahr 1 | 11,87 / 13,30 €/m² (Rotenburg) | 12,92 / 14,48 €/m² (Neu Wulmstorf) |

Geändert in der Mappe:

- Auslieferung mit Projekt 2 (Eingaben D3 = 2, vorher 1). Umschalten wie bisher in D3.
- Projektnamen in Zeile 4: „Vergleichshaus, 20 Wohnungen“ und „Modellhaus, Tarutinoer Str. 4“ (vorher „Modellhaus Broschüre“ und „Tarutinoer Str. 4, Neu Wulmstorf“).
- Quellen der Eingaben 1.2, 1.3, 2.1, 2.3 bis 2.5, 4.1 und 4.2: Der Verweis auf die Broschüre steht jetzt bei Projekt 2, Projekt 1 trägt „früheres Modellhaus“. Quelle zu 2.3 für Projekt 2: „Grundstück im Bestand, Ansatz 0 €“.
- Hinweise 6, 14 und 15 und die beiden Fußnoten unter Tabelle 4 (Blatt Tabellen) nennen die Projekte mit ihren neuen Namen. Hinweis 15 führt den Verkehrswert des Grundstücks (731.325 €) als Vermerk: nicht angesetzt.

Das sind 16 Zellen: D3 und 15 Texte. Keine Zelle hat die Adresse gewechselt, keine Zeile und keine Spalte ist eingefügt. Die Rechenwerte beider Projekte sind gleich geblieben: Vor und nach der Änderung je mit D3 = 1 und D3 = 2 neu berechnet, stimmen alle Zahlen aller Blätter überein (9.669 Zahlen mit Projekt 1, 9.687 mit Projekt 2, ohne Toleranz).

### Ergebnisse Modellhaus (Projekt 2, Auslieferungsstand)

Stand 11.11.2026 mit Bankzins 3,74 %. Seit 12.11.2026 gilt 3,86 %; die Werte „frei“ und die Zeile „nach Förderbarwert“ stehen neu in Abschnitt 11.

Jahresrechnung Jahr 1 in € (Übersicht Zeilen 29–38); Zeile 6 Zins NBank: 0 bis Jahr 35.

| Zeile | A | B | C |
|---|---:|---:|---:|
| 1 Sollmiete (6,80 / 8,20 / 9,00 €/m²) | 67.565 | 81.475 | 89.424 |
| − Mietausfall/Leerstand 2 % | 1.351 | 1.630 | 1.788 |
| 2 − Objektverwaltung 367 € je WE | 5.138 | 5.138 | 5.138 |
| 3 − Instandhaltung 14,40 €/m² | 11.923 | 11.923 | 11.923 |
| 4 = Überschuss vor Kapitaldienst | 49.152 | 62.784 | 70.574 |
| 5 − Verwaltungskostenbeitrag 0,5 % | 5.927 | 8.890 | 10.372 |
| 7 − Tilgung 2,38 % (linear über 42 Jahre) | 28.223 | 42.334 | 49.390 |
| 8 = Zahlungsüberschuss | 15.003 | 11.560 | 10.812 |

Gesamtkosten 2.963.412 €, voll zuwendungsfähig. Darlehen 1,19 / 1,78 / 2,07 Mio. €, Zuschuss 1,19 / 0,59 / 0,30 Mio. €, Förderung 2,37 Mio. € (80 %), Eigenmittel 592.682 €, Entgelte 20.744 / 22.226 / 22.966 €. Je Wohnung in Gruppe A: Zuschuss 84.669 €, Eigenmittel 42.334 €. Tilgungsschwellen: B gegenüber A 1,80 %, C gegenüber A 1,91 %, C gegenüber B 2,13 %; unter 1,91 % Tilgung hat C den höchsten Zahlungsüberschuss, darüber A. DSCR Jahr 1: 1,44 / 1,23 / 1,18; kein Jahr mit Fehlbetrag in A, B, C; tragbare Tilgung Jahr 1 3,65 / 3,03 / 2,90 %.

| Renditen in %, Jahr 42 (Jahr 35) | A | B | C | frei |
|---|---:|---:|---:|---:|
| Objekt-IRR ohne Zuschuss, mit Restwert | 3,45 (3,23) | 4,02 (3,89) | 4,31 (4,23) | 6,17 (6,27) |
| Objekt-IRR nach Zuschuss, mit Restwert | 5,28 (5,31) | 4,85 (4,83) | 4,72 (4,68) | 6,17 (6,27) |
| Objekt-IRR nach Förderbarwert, mit Restwert | 6,63 (6,81) | 6,43 (6,58) | 6,39 (6,53) | 6,17 (6,27) |
| EK-IRR, mit Restwert | 7,77 (8,13) | 7,91 (8,29) | 8,05 (8,44) | 8,29 (8,67) |
| EK-IRR, nur Bodenwert | 4,76 (3,13) | 5,05 (3,17) | 5,34 (3,44) | 6,36 (4,99) |
| VOFI-EK-Rendite, mit Restwert | 6,49 (6,95) | 6,67 (7,17) | 6,76 (7,29) | 7,34 (8,03) |
| VOFI-EK-Rendite, nur Bodenwert | 3,53 (2,58) | 3,76 (2,61) | 3,94 (2,75) | 5,15 (4,26) |
| Restwertanteil am Endvermögen | 69 (77) | 69 (78) | 68 (78) | 58 (71) |

Das Grundstück ist nicht angesetzt: Die Renditen tragen keine Grundstückskosten, „nur Bodenwert“ ist gleich „ohne Restwert“ (Hinweis 15). Mit dem Vergleichshaus sind sie deshalb nicht vergleichbar. NBank: mit Restwert „über“ 4,39 %, nur Bodenwert „unter“.

Frei: Eigenkapital 592.682 €, Bank 2,37 Mio. € (3,74 %, 30 Jahre), Kapitaldienst 132.805 €; zur Marktmiete 14,48 €/m² Jahr 1 −8.867 €, DSCR 0,93, 4 Jahre Fehlbetrag (größter kumulierter Fehlbetrag −20.394 €, tiefster Stand Projektkonto −22.640 €).

| Miete Jahr 1, €/m² | A | B | C | frei | Aufschlag frei | EK-IRR / VOFI-EK frei, Jahr 42 |
|---|---:|---:|---:|---:|---:|---:|
| gerechnet (Standard) | 6,80 | 8,20 | 9,00 | 14,48 | 0 | 8,29 / 7,34 % |
| nötig für DSCR 1,0 | 5,26 | 7,01 | 7,89 | 15,39 | 6,3 % | 9,10 / 7,61 % |
| nötig für DSCR 1,25 | 6,14 | 8,33 | 9,42 | 18,80 | 29,8 % | 12,44 / 8,45 % |

Sensitivität der Broschüre S. 10, Herstellungskosten je m² (Gruppe A):

| Größe in € | 3.579 (Modellhaus) | 4.631 (ARGE-Median) | 5.000 (Bemessungsgrenze) |
|---|---:|---:|---:|
| Gesamtkosten | 2.963.412 | 3.834.468 | 4.140.000 |
| Förderung, 80 % | 2.370.730 | 3.067.574 | 3.312.000 |
| Eigenmittel, 20 % | 592.682 | 766.894 | 828.000 |
| Zahlungsüberschuss Jahr 1, A | 15.003 | 4.965 | 1.444 |
| Zahlungsüberschuss Jahr 1, B / C | 11.560 / 10.812 | −3.497 / −6.754 | −8.778 / −12.916 |

Alle Werte = Referenzrechnung (±0,01 Prozentpunkte, ±1 €).

### Prüfung und offene Punkte

Das Prüfskript rechnet Projekt 1 jetzt mit D3 = 1 und Projekt 2 im Auslieferungsstand. Die gelieferten Werte und die Broschüre S. 10 bis 12 vergleicht es mit Projekt 2; für die Sensitivität S. 10 gibt es zwei neue Testläufe (4.631 und 5.000 €/m²). Die Sollwerte aller bisherigen Läufe sind unverändert.

Abnahme am 11.11.2026: 617 Prüfungen ohne Fehler, 70 Testläufe gegen die Referenzrechnung. Darin sind die vier Prüfungen der Broschüre S. 10 bis 12 gegen Projekt 2; sie bestehen mit den Seiten im Stand vom 11.11.2026. Sie lesen die Broschüre bei jedem Lauf neu und schlagen fehl, sobald dort ein Wert von der Mappe abweicht.

Offen:

1. Hinweis 6 nennt den Abstand „rund 0,4–0,5 Prozentpunkte“ (frei finanziert mit Grenze nach § 558 BGB) für das Vergleichshaus. Für das Modellhaus ist er nicht gerechnet.
2. Präsentation: Der Abgleich mit der Mappe steht nicht im Prüfskript (Abschnitt 8 Nr. 6).
3. Der Projektname „Modellhaus, Tarutinoer Str. 4“ nennt den Ort nicht, damit er in der Spalte „verwendet“ in zwei Zeilen passt. Der Ort steht in Hinweis 14 und 15.

## 11. Änderung vom 12.11.2026: Bankzins 3,86 %

Auftrag des Auftraggebers: mit dem jüngsten Wert der Zinsreihe rechnen. Eingabe 6.1 (Zins Bank; Vergleichszins Förderbarwert) und Eingabe 6.3 (Anschlusszins) stehen in beiden Projekten auf 3,86 % statt 3,74 %. Quelle: Dr. Klein Wowi Finanz AG, Top-Konditionen Wohnungswirtschaft, 10 Jahre Zinsbindung, Wert vom 10.11.2026. 3,74 % war der Wert derselben Reihe vom 21.07.2026. Die Quelle führt Wochenwerte; seit Juli lag der Zins zwischen 3,57 % und 4,15 %.

Der Zins des NBank-Darlehens ab Jahr 36 (Eingabe 3.3) folgt dem Bankzins und steht ebenfalls auf 3,86 %. Unverändert: Zinsbindung 10 Jahre, Laufzeit 30 Jahre. Die Jahresrechnung, die Finanzierung und alle Werte der Gruppen A, B und C bis Jahr 35 ändern sich nicht.

### Ergebnisse Modellhaus (Projekt 2), frei finanziert

| Größe | bis 11.11.2026 | seit 12.11.2026 |
|---|---:|---:|
| Kapitaldienst Bankdarlehen p. a. | 132.805 € | 134.779 € |
| davon Zins / Tilgung in Jahr 1 | 88.665 / 44.139 € | 91.510 / 43.268 € |
| Zahlungsüberschuss Jahr 1 zur Marktmiete 14,48 €/m² | −8.867 € | −10.841 € |
| Zahlungsüberschuss Jahr 10 | 15.313 € | 13.339 € |
| DSCR Jahr 1 | 0,93 | 0,92 |
| Jahre mit Fehlbetrag, Jahr 1–35 | 4 | 5 |
| Größter kumulierter Fehlbetrag | −20.394 € | −28.914 € |
| Tiefster Stand Projektkonto | −22.640 € | −33.329 € |
| Nötige Miete für DSCR 1,0 | 15,39 €/m² | 15,59 €/m² |
| Aufschlag der nötigen Miete auf die Marktmiete | 6,3 % | 7,7 % |
| Nötige Miete für DSCR 1,25 | 18,80 €/m² | 19,05 €/m² |
| EK-IRR mit Restwert, Jahr 42 (Jahr 35) | 8,29 (8,67) % | 8,17 (8,55) % |
| EK-IRR nur Bodenwert, Jahr 42 (Jahr 35) | 6,36 (4,99) % | 6,20 (4,79) % |
| VOFI-EK-Rendite mit Restwert, Jahr 42 (Jahr 35) | 7,34 (8,03) % | 7,31 (8,00) % |
| VOFI-EK-Rendite nur Bodenwert, Jahr 42 (Jahr 35) | 5,15 (4,26) % | 5,09 (4,15) % |
| Restwertanteil am Endvermögen, Jahr 42 (Jahr 35) | 58 (71) % | 58 (72) % |

Der Objekt-IRR frei (6,17 % und 6,27 %) hängt nicht an der Finanzierung und bleibt.

### Ergebnisse Modellhaus, gefördert

Der Bankzins ist der Vergleichszins des Förderbarwerts, und der Zins ab Jahr 36 wirkt auf die Jahre 36 bis 42. Es ändern sich nur diese Werte:

| Größe | A | B | C |
|---|---:|---:|---:|
| Förderbarwert, bis 11.11.2026 | 1.670.288 € | 1.328.957 € | 1.158.292 € |
| Förderbarwert, seit 12.11.2026 | 1.682.438 € | 1.347.182 € | 1.179.554 € |
| Objekt-IRR nach Förderbarwert, Jahr 42 (Jahr 35), bisher | 6,63 (6,81) % | 6,43 (6,58) % | 6,39 (6,53) % |
| Objekt-IRR nach Förderbarwert, Jahr 42 (Jahr 35), neu | 6,67 (6,86) % | 6,48 (6,64) % | 6,44 (6,59) % |
| Zahlungsüberschuss Jahr 42, bisher | 115.990 € | 139.129 € | 153.402 € |
| Zahlungsüberschuss Jahr 42, neu (Zins ab Jahr 36: 3,86 %) | 115.957 € | 139.078 € | 153.343 € |

Die Renditen zum Horizont Jahr 42 ändern sich dadurch um höchstens 0,01 Prozentpunkte.

### Vergleichshaus (Projekt 1)

Derselbe Zins. Frei finanziert: VOFI-EK-Rendite mit Restwert Jahr 35 3,32 % statt 3,57 %, tiefster Stand des Projektkontos −5,13 Mio. € statt −4,82 Mio. €. Förderbarwert A / B / C 3.974.156 / 3.182.234 / 2.786.274 € statt 3.945.457 / 3.139.186 / 2.736.050 €.

### Broschüre, Präsentation, Prüfung

Broschüre S. 11 (Vergleich frei finanziert) und Präsentation (Folien 4, 5, 16 bis 19, 24, A7) nennen die neuen Werte. Abnahme am 12.11.2026: 617 Prüfungen ohne Fehler, 70 Testläufe gegen die Referenzrechnung. Läufe, die frühere Stände tragen (Abgleich mit v2-1, Regression), rechnen mit 3,74 % weiter.

## 12. Änderung vom 12.11.2026: Marktmiete des Modellhauses 15,42 €/m²

Entscheidung des Auftraggebers: Die Marktmiete des Modellhauses (Eingabe 4.4, Projekt 2) steht auf 15,42 €/m² statt 14,48 €/m². Quelle: Gutachterausschuss für Grundstückswerte Lüneburg, Mietübersicht Landkreis Harburg, Region Hamburger Umland, Baualter ab 2023, Wohnfläche 40–60 m², Stand 01.01.2026. Die 14,48 €/m² waren der Mittelwert aus 11,70 € (Übersicht zum 01.01.2022) und 15,42 €, je auf 2028 fortgeschrieben; die Mappe nannte das „PGN-Mietband“. Die Quellenangaben in Eingaben und Hinweis 14 sind berichtigt. Die Vergleichsmiete (Eingabe 4.3, 12,92 €/m²) bleibt.

| Größe, Modellhaus | 14,48 €/m² | 15,42 €/m² |
|---|---:|---:|
| Frei: Zahlungsüberschuss Jahr 1 | −10.841 € | −1.691 € |
| Frei: DSCR Jahr 1 | 0,92 | 0,99 |
| Frei: Jahre mit Fehlbetrag, Jahr 1–35 | 5 | 1 |
| Frei: Aufschlag der nötigen Miete (15,59 €/m²) auf die Marktmiete | 7,7 % | 1,1 % |
| Frei: VOFI-EK-Rendite mit Restwert, Jahr 42 (Jahr 35) | 7,31 (8,00) % | 7,60 (8,36) % |
| Frei: VOFI-EK-Rendite nur Bodenwert, Jahr 42 (Jahr 35) | 5,09 (4,15) % | 5,52 (4,84) % |
| A / B / C: VOFI-EK-Rendite mit Restwert, Jahr 35 | 6,95 / 7,17 / 7,29 % | 7,05 / 7,28 / 7,40 % |
| A / B / C: Restwert Jahr 35 | 4,96 / 5,42 / 5,63 Mio. € | 5,15 / 5,67 / 5,90 Mio. € |

Jahresrechnung, Finanzierung, Kapitaldienst und nötige Miete ändern sich nicht. Gefördert wirkt die Marktmiete nur über die Miete nach Ende der Bindung auf den Restwert. Abnahme am 12.11.2026: 617 Prüfungen ohne Fehler.

