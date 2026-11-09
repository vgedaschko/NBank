# VOFI Mietwohnraum 2026: Änderungen in Version 3

`PGN_VOFI_Mietwohnraum_2026_v3.xlsx` ersetzt `PGN_NBank_VOFI_Modell_v2-1.xlsx` (v2-1, bleibt unverändert erhalten). Stand 09.11.2026. Gerechnet wird vor Steuern, nominal, T0 = Bezugsfertigkeit.

## 1. Was ist neu

Neun Blätter: Übersicht · Eingaben · Gefördert A, B, C · Frei finanziert · NBank (intern) · Tabellen (Festwerte RL 2026) · Hinweise. Zwei Projekte nebeneinander, Umschalten mit einer Zelle: Modellhaus Broschüre (voreingestellt) und Tarutinoer Str. 4, Neu Wulmstorf. Kennzahlen in vier getrennten Ebenen:

1. Liquidität: Jahresrechnung Jahr 1, Zahlungsüberschuss, DSCR, Fehlbetrag, Tilgungsvergleich.
2. Objekt: Objekt-IRR ohne Zuschuss, nach Zuschuss, nach Förderbarwert; frei finanziert zur Marktmiete.
3. Eigenkapital: EK-IRR und VOFI-EK-Rendite auf gleicher Zeitbasis, Restwertanteil am Endvermögen.
4. NBank (intern): EK-Renditen gegen Swapsatz + 1 Prozentpunkt, nur „über“ oder „unter“.

Ebenen 2 und 3 je mit Restwert, nur Bodenwert, ohne Restwert; Jahr 35 und 42.

## 2. Umfang

| | v2-1 | v3 |
|---|---:|---:|
| Blätter | 13 | 9 |
| Eingaben | 75 + Szenario-Umschalter | 37 je Projekt, 9 Blöcke |
| Formeln | 10.197 | 9.007 |
| Benannte Bereiche | 384 | 64 |
| Textzellen (Zeichen; davon über 120) | 1.104 (58.426; 116) | 1.664 (27.657; 12) |

Mehr Textzellen, weil jede Zahl Bezeichnung und Einheit hat; die Textmenge ist halbiert.

## 3. Weggefallen oder vereinfacht

| v2-1 | v3 | Grund |
|---|---|---|
| Szenario-Umschalter | Stresstest, Block 9 | Werte in Abschnitt 7 |
| Entnahmemodus, Kontokorrent, Zinsstaffel, LTV, ICR | entfällt | ohne Wirkung auf Ergebnisse |
| Prolongationsmodi, Realrendite, Stichtage 1–6 | eine Anschlussregel; Jahr 1, 10, 35, 42 | Rendite nach Jahr 1 (27,55 %) ohne Aussage |
| Mietband, Marktschalter, Formeln in Eingaben | je Größe eine Zahl | einfacher |
| RL-Festwerte bei den Eingaben | Blatt Tabellen | nicht zum Ändern |
| Modellannahmen, Formel-Prosa, K1–K7, 6 Nebenblätter | Hinweise, Prüfblock, vier Ebenen | Doppelungen |

Vorlaufzeit, „obere Kante“ und Entgelt-Schalter: Abschnitt 4.

## 4. Korrekturen B1–B11

Tarutinoer Str. 4, Gruppe A, Jahr 42, v2-1 → v3. Förderung, Mieten, Bewirtschaftung und Tilgung Jahr 1 bleiben auf den Cent gleich.

| Befund | Umsetzung | Wirkung |
|---|---|---|
| B1 keine Objektrendite | Objekt-IRR, drei Stufen | neu: 3,45 / 5,28 / 6,59 %; frei 6,17 % |
| B2 EK-Renditen ungepaart | drei Restwert-Varianten | VOFI-EK 6,49 / 3,52 %; Restwertanteil 70 % |
| B3 Überkompensation wertend | Blatt NBank neutral | nur „über“/„unter“ 4,39 % |
| B4 Grundstück im Eigenkapital | Sacheinlage + bar | 0 bei Grundstück 0 €; Modellhaus VOFI-EK 4,75 → 5,46 % |
| B5/B6 Restwert ohne Abschlag | Abschlag bis Zielmiete | Restwert 6,71 → 5,98 Mio. €; VOFI-EK −0,21 Pp |
| B7 Vorlaufzeit im Exponenten | entfällt | VOFI-EK +0,39 Pp |
| B8 Kostenstand | Eingabe 5.5 | 0; Modellhaus mit 5.5 = 2: A 455 → −656 € |
| B9 Entnahmen, B10 frei „obere Kante“ | entfällt | Vergleich frei 7,59 → 6,17 % |
| B11 Wertüberschuss vor Abschlag | nach Abschlag | +23,2 % → −38,7 % |
| Bearbeitungsentgelte | aus Eigenkapital statt Bank | Zahlungsüberschuss Jahr 1 12.429 → 13.591 € |
| Anfangsmiete gefördert | höchstens Marktmiete | 0 in beiden Projekten; greift nur bei niedriger Marktmiete |

Gesamt mit Restwert: VOFI-EK 6,38 → 6,49 %, EK-IRR 7,92 → 7,68 %; Modellhaus 4,75 → 5,52 / 6,11 → 5,90 %.

## 5. Bedienung

1. Blatt „Eingaben“, Zelle D3: Projekt wählen (1 = Spalte D, 2 = Spalte E).
2. Nur blaue Werte auf Gelb ändern; gerechnet wird mit Spalte „verwendet“. Blöcke über + aufklappen.
3. Weiteres Projekt: Dateikopie, eine Projektspalte und den Namen in Zeile 4 überschreiben.
4. Blatt „Übersicht“: Zeile 3 zeigt „OK“, sonst nennt der Prüfblock P1–P6 die Ursache.
5. Stresstest: Block 9 sowie 3.1, 5.4, 6.3 ändern (Abschnitt 7), danach zurücksetzen.
6. Nach außen nur Ebene 1 und Annahmen; Renditen nur als Paar mit Restwert / nur Bodenwert.

## 6. Ergebnisse Modellhaus

Jahresrechnung Jahr 1 in € (Übersicht Zeilen 29–38), gleich Broschüre S. 11:

| Zeile | A | B | C |
|---|---:|---:|---:|
| 1 Sollmiete (6,80 / 8,20 / 9,00 €/m²) | 114.240 | 137.760 | 151.200 |
| − Mietausfall/Leerstand 2 % | 2.285 | 2.755 | 3.024 |
| 2 − Objektverwaltung 367 € je WE | 7.340 | 7.340 | 7.340 |
| 3 − Instandhaltung 14,40 €/m² | 20.160 | 20.160 | 20.160 |
| 4 = Überschuss vor Kapitaldienst | 84.455 | 107.505 | 120.676 |
| 5 − Verwaltungskostenbeitrag 0,5 % | 14.000 | 21.000 | 24.500 |
| 6 − Zins NBank (0 % bis Jahr 35) | 0 | 0 | 0 |
| 7 − Tilgung 2,5 % | 70.000 | 105.000 | 122.500 |
| 8 = Zahlungsüberschuss | 455 | −18.495 | −26.324 |

Darlehen 2,8 / 4,2 / 4,9 Mio. €, Zuschuss 2,8 / 1,4 / 0,7 Mio. €, Eigenmittel 1,4 Mio. €, Entgelte 49.000 / 52.500 / 54.250 €. Tilgungsschwellen S. 12: B 1,15 %, C 1,22 %. DSCR Jahr 1: 1,01 / 0,85 / 0,82; größter kumulierter Fehlbetrag 0 / −92.052 / −151.922 €; Break-even-Tilgung 2,52 / 2,06 / 1,96 %.

Renditen in %, Jahr 42 (Jahr 35):

| Kennzahl | A | B | C | frei |
|---|---:|---:|---:|---:|
| Objekt-IRR ohne Zuschuss, mit Restwert | 2,48 (2,12) | 2,95 (2,68) | 3,20 (2,97) | 4,66 (4,63) |
| Objekt-IRR nach Zuschuss, mit Restwert | 4,16 (4,04) | 3,71 (3,55) | 3,56 (3,38) | 4,66 (4,63) |
| Objekt-IRR nach Förderbarwert, mit Restwert | 5,32 (5,36) | 5,07 (5,08) | 5,00 (5,00) | 4,66 (4,63) |
| EK-IRR, mit Restwert | 5,90 (6,03) | 5,73 (5,85) | 5,70 (5,81) | |
| EK-IRR, nur Bodenwert | 2,92 (1,53) | 2,64 (0,72) | 2,63 (0,47) | |
| VOFI-EK-Rendite, mit Restwert | 5,52 (5,72) | 5,56 (5,75) | 5,58 (5,77) | |
| VOFI-EK-Rendite, nur Bodenwert | 2,71 (1,63) | 2,51 (0,76) | 2,46 (0,32) | |
| Restwertanteil am Endvermögen | 77 (86) | 80 (93) | 81 (96) | |

NBank: mit Restwert „über“ Orientierungswert 4,39 %, nur Bodenwert „unter“. Alle Werte = Referenzrechnung (±0,01 Pp, ±1 €).

Frei finanziert folgt der Marktmiete wie bei laufender Neuvermietung (wie v2-1). Mit Bestandsmieten nach § 558 BGB läge der Frei-IRR rund 0,4–0,5 Prozentpunkte niedriger, also etwa gleichauf mit A nach Zuschuss.

## 7. Stresstest: Best/Worst aus v2-1

| Eingabe | Best | Standard | Worst |
|---|---:|---:|---:|
| 9.1 Faktor Herstellungskosten | 0,95 | 1,00 | 1,15 |
| 9.2 Faktor Markt- und Vergleichsmiete | 1,05 | 1,00 | 0,95 |
| 9.3 Zuschlag Liegenschaftszins | −0,30 % | 0,00 % | +0,60 % |
| 5.4 Kostensteigerung ab Jahr 2 | 1,5 % | 2,0 % | 2,5 % |
| 3.1 Tilgung NBank-Darlehen | 2,50 % | 2,50 % | 3,03 % |
| 6.3 Anschlusszins | 2,74 % | 3,74 % | 4,74 % |

Alle sechs Werte in der Spalte des aktiven Projekts eintragen. Worst 3,03 % (33 Jahre) ist in v2-1 nicht begründet.

## 8. Offene Punkte (Prüfbericht Abschnitt 6)

1. Tilgungssatz 2,5 % mit der NBank abgestimmt? Die vier Annahmen sind vorläufig übernommen. (NBank)
2. Kostenstand 2026 in Jahr 1 oder fortschreiben (5.5)? Nicht umlagefähige Betriebskosten = 0 bestätigen.
3. Grundstück Tarutinoer 0 € oder 731.325 €? Mit Verkehrswert 309.386 € Bank, Jahr 1 A −7.989 €.
4. Modellhaus: Mieten 4.3/4.4 und Liegenschaftszins sind Platzhalter; Renditen mit Restwert hängen daran.
5. NBank: Renditegröße, Horizont, Restwert, Swap-Stichtag; Zins ab Jahr 36 (3,74 % oder Basiszins + 3 Pp)?
6. Präsentation: Abgleich mit der Excel nach der Neugestaltung.
