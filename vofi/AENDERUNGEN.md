# VOFI Mietwohnraum 2026: Änderungen in Version 3

`PGN_VOFI_Mietwohnraum_2026_v3.xlsx` ersetzt `PGN_NBank_VOFI_Modell_v2-1.xlsx` (v2-1, bleibt unverändert). Stand 10.11.2026; vor Steuern, nominal, T0 = Bezugsfertigkeit.

## 1. Was ist neu

Neun Blätter: Übersicht · Eingaben · Gefördert A, B, C · Frei finanziert · NBank (intern) · Tabellen (Festwerte RL 2026) · Hinweise. Zwei Projekte, Umschalten mit einer Zelle: Modellhaus Broschüre (voreingestellt) und Tarutinoer Str. 4, Neu Wulmstorf. Vier Ebenen:

1. Liquidität: Jahresrechnung Jahr 1, Zahlungsüberschuss, DSCR, Fehlbetrag, Tilgungsvergleich.
2. Objekt: Objekt-IRR ohne Zuschuss, nach Zuschuss, nach Förderbarwert; frei mit wählbarer Miete (10.1).
3. Eigenkapital: EK-IRR und VOFI-EK-Rendite auf gleicher Zeitbasis, Restwertanteil am Endvermögen.
4. NBank (intern): EK-Renditen gegen Swapsatz + 1 Prozentpunkt, nur „über“ oder „unter“.

Ebenen 2 und 3 je mit Restwert, nur Bodenwert, ohne Restwert; Jahr 35 und 42. Frei in den Ebenen 1 bis 3: Mindest-Eigenmittel wie gefördert zuzüglich 7.1, Rest Bankdarlehen (Block 6); Miete: Markt oder DSCR-Ziel.

## 2. Umfang

v2-1 → v3: Blätter 13 → 9; Eingaben 75 + Szenario-Umschalter → 39 je Projekt; Formeln 10.197 → 9.821; benannte Bereiche 384 → 66; Textzellen 1.104 (58.426 Zeichen, 116 über 120) → 1.863 (31.778; 12).

## 3. Weggefallen oder vereinfacht

- Szenario-Umschalter → Stresstest, Block 9 (Werte in Abschnitt 7).
- Entnahmemodus, Kontokorrent, Zinsstaffel, LTV, ICR → entfallen, ohne Wirkung auf Ergebnisse.
- Prolongationsmodi, Realrendite, Stichtage 1–6 → eine Anschlussregel; Jahr 1, 10, 35, 42.
- Mietband, Marktschalter, Formeln in Eingaben → je Größe eine Zahl; RL-Festwerte im Blatt Tabellen.
- Modellannahmen, Formel-Prosa, K1–K7, 6 Nebenblätter → Hinweise, Prüfblock, vier Ebenen.
- „Frei, obere Kante“ mit fester Miete 18,80 €/m² → Auswahl 10.1, Miete berechnet, Aufschlag ausgewiesen.

## 4. Korrekturen B1–B11

Tarutinoer, Gruppe A, Jahr 42, v2-1 → v3; Förderung, Mieten, Bewirtschaftung, Tilgung Jahr 1: auf den Cent gleich.

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

Gesamt mit Restwert: VOFI-EK 6,38 → 6,49 %, EK-IRR 7,92 → 7,68 %; Modellhaus 4,75 → 5,52 und 6,11 → 5,90 %.

## 5. Bedienung

1. Blatt „Eingaben“, Zelle D3: Projekt wählen (1 = Spalte D, 2 = Spalte E).
2. Nur blaue Werte auf Gelb ändern; gerechnet wird mit Spalte „verwendet“. Weiteres Projekt: Dateikopie, eine Projektspalte und den Namen in Zeile 4 überschreiben.
3. Blatt „Übersicht“: Zeile 3 zeigt „OK“, sonst nennt der Prüfblock P1–P6 die Ursache (P4, P5 auch Frei).
4. Stresstest: Block 9 sowie 3.1, 5.4, 6.3 ändern (Abschnitt 7), danach zurücksetzen.
5. Frei: 10.1 „Marktmiete“ oder „Miete für DSCR-Ziel“ (Ziel 10.2); Aufschlag: Übersicht Spalte L und 8.5.
6. Nach außen nur Ebene 1 und Annahmen; Renditen nur als Paar mit Restwert / nur Bodenwert, frei nur mit Aufschlag.

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
| 7 − Tilgung 2,5 % | 70.000 | 105.000 | 122.500 |
| 8 = Zahlungsüberschuss | 455 | −18.495 | −26.324 |

Darlehen 2,8 / 4,2 / 4,9 Mio. €, Zuschuss 2,8 / 1,4 / 0,7 Mio. €, Eigenmittel 1,4 Mio. €, Entgelte 49.000 / 52.500 / 54.250 €. Tilgungsschwellen S. 12: B 1,15 %, C 1,22 %. DSCR Jahr 1: 1,01 / 0,85 / 0,82; größter kumulierter Fehlbetrag 0 / −92.052 / −151.922 €; Break-even-Tilgung 2,52 / 2,06 / 1,96 %.

| Renditen in %, Jahr 42 (Jahr 35) | A | B | C | frei |
|---|---:|---:|---:|---:|
| Objekt-IRR ohne Zuschuss, mit Restwert | 2,48 (2,12) | 2,95 (2,68) | 3,20 (2,97) | 4,66 (4,63) |
| Objekt-IRR nach Zuschuss, mit Restwert | 4,16 (4,04) | 3,71 (3,55) | 3,56 (3,38) | 4,66 (4,63) |
| Objekt-IRR nach Förderbarwert, mit Restwert | 5,32 (5,36) | 5,07 (5,08) | 5,00 (5,00) | 4,66 (4,63) |
| EK-IRR, mit Restwert | 5,90 (6,03) | 5,73 (5,85) | 5,70 (5,81) | 5,31 (5,37) |
| EK-IRR, nur Bodenwert | 2,92 (1,53) | 2,64 (0,72) | 2,63 (0,47) | 2,89 (1,03) |
| VOFI-EK-Rendite, mit Restwert | 5,52 (5,72) | 5,56 (5,75) | 5,58 (5,77) | 5,42 (5,52) |
| VOFI-EK-Rendite, nur Bodenwert | 2,71 (1,63) | 2,51 (0,76) | 2,46 (0,32) | 1,17 (n. v.) |
| Restwertanteil am Endvermögen | 77 (86) | 80 (93) | 81 (96) | 92 (121) |

NBank: mit Restwert „über“ 4,39 %, nur Bodenwert „unter“. Alle Werte = Referenzrechnung (±0,01 Pp, ±1 €).

Frei: Eigenkapital 1,4 Mio. €, Bank 5,6 Mio. € (3,74 %, 30 Jahre), Kapitaldienst 313.703 €; zur Marktmiete Jahr 1 −102.805 €, DSCR 0,67, 21 Jahre Fehlbetrag, Projektkonto bis Jahr 39 im Soll (−3,19 Mio. €).

| Miete Jahr 1, €/m² | A | B | C | frei | Aufschlag frei | EK-IRR / VOFI-EK frei, Jahr 42 |
|---|---:|---:|---:|---:|---:|---:|
| gerechnet (Standard) | 6,80 | 8,20 | 9,00 | 14,48 | 0 | 5,31 / 5,42 % |
| nötig für DSCR 1,0 | 6,77 | 9,32 | 10,60 | 20,72 | 43,1 % | 9,13 / 7,65 % |
| nötig für DSCR 1,25 | 8,05 | 11,24 | 12,83 | 25,49 | 76,0 % | 12,46 / 8,48 % |

Renditen frei mit Restwert; Zeile 2 und 3 mit 10.1 = „Miete für DSCR-Ziel“ (Restwert zur selben Miete), keine Marktrenditen. Mit Bestandsmieten (§ 558 BGB) läge der Frei-IRR zur Marktmiete 0,4–0,5 Pp niedriger.

## 7. Stresstest: Best/Worst aus v2-1

| Eingabe | 9.1 Herstellung | 9.2 Mieten | 9.3 Liegenschaftszins | 5.4 Kosten | 3.1 Tilgung | 6.3 Anschluss |
|---|---:|---:|---:|---:|---:|---:|
| Best | 0,95 | 1,05 | −0,30 % | 1,5 % | 2,50 % | 2,74 % |
| Standard | 1,00 | 1,00 | 0,00 % | 2,0 % | 2,50 % | 3,74 % |
| Worst | 1,15 | 0,95 | +0,60 % | 2,5 % | 3,03 % | 4,74 % |

Alle sechs Werte in der Spalte des aktiven Projekts eintragen. Worst 3,03 % (33 Jahre) ist in v2-1 nicht begründet.

## 8. Offene Punkte (Prüfbericht Abschnitt 6)

1. Tilgungssatz 2,5 % mit der NBank abgestimmt? Die vier Annahmen sind vorläufig übernommen. (NBank)
2. Kostenstand 2026 in Jahr 1 oder fortschreiben (5.5)? Nicht umlagefähige Betriebskosten = 0 bestätigen.
3. Grundstück Tarutinoer 0 € oder 731.325 €? Mit Verkehrswert 309.386 € Bank, Jahr 1 A −7.989 €.
4. Modellhaus: Mieten 4.3/4.4 und Liegenschaftszins sind Platzhalter; Renditen mit Restwert hängen daran.
5. NBank: Renditegröße, Horizont, Restwert, Swap-Stichtag; Zins ab Jahr 36 (3,74 % oder Basiszins + 3 Pp)?
6. Präsentation: Abgleich nach der Neugestaltung. Druck in Excel ansehen (geprüft nur mit LibreOffice).
7. Frei: Konditionen Block 6 auch für ein Bankdarlehen über 80 % der Kosten? 7.1 frei voll anrechnen?
8. Nötige Miete bei Tilgungsaufschub (3.2 > 0): Jahr 1 ohne Tilgung NBank; mit der Regeltilgung rechnen?
