# Prüfung Team 3 „Vergleich“: Verständnistest und Zahlenprüfung

Stand 14.11.2026. Grundlage der richtigen Antworten: Konzepte-Mappe `konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx`
(Werte aus `werte_konzepte.json`, Lauf „konzepte“ und Läufe N6), `mappe/README.md`, `mappe/ANNAHMEN.md`, `team-3/KONZEPT.md`,
`team-3/ZAHLEN.md`. „T3“ = Blatt „Team 3 Vergleich“ der Team-Mappe `team-3/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Team3.xlsx`.
Reihenfolge der Werte immer A | B | C | Frei 18,36 € | Frei 15,42 € (Spalten D, E, F, H, G auf Konzepte), wo nicht anders gesagt.

## Ergebnis

| Frage | Bewertung |
|---|---|
| a) Eigenkapital | richtig |
| b) Was bleibt in Jahr 1 und Jahr 35 | teilweise |
| c) Miete frei finanziert und Markt | richtig |
| d) Höchste Eigenkapitalrendite, Bedingung | richtig |
| e) Drei stärkste Annahmen | richtig |

**Fehlerzahl: 0,5** (keine Frage falsch oder unbeantwortet; b teilweise = 0,5).

---

## 1 · Fragen und richtige Antworten (mit Beleg)

**a) Wie viel Eigenkapital setzt der Investor ein?**
- Eingesetztes Eigenkapital bei Bezug: 613.426 | 614.908 | 615.649 € gefördert, 592.682 € frei (beide Mieten)
  (Konzepte!D56:F56 = 613.426,28 | 614.907,99 | 615.648,84; Konzepte!G56 = H56 = 592.682,40).
- Davon Bearbeitungsentgelte gefördert 20.744 | 22.226 | 22.966 € (Konzepte!D57:F57), frei „–“ (G57, H57).
- Eigenmittel 592.682 € = 20 % der Gesamtkosten 2.963.412 € (Übersicht!D19; Konzepte!D52:H52; Tabellen!D18 = 20 %); zusätzliches
  Eigenkapital bar 0 € (Eingaben!F40).
- Im Titel Folie 14 und Blatt 9 gerundet „rund 0,6 Mio. €“.

**b) Wie viel bleibt je Variante in Jahr 1 und in Jahr 35?** (Zahlungsüberschuss nach Kapitaldienst, vor Steuern)
- Jahr 1: 15.003 | 11.560 | 10.812 | 26.956 € (Konzepte!D61:F61, H61); frei zur Marktmiete −1.691 € (Konzepte!G61).
  Je m² und Monat 1,51 | 1,16 | 1,09 | 2,71 | −0,17 € (T3!D30:H30).
- Jahr 35: 64.860 | 76.468 | 84.149 | 317.109 € (Konzepte!D64:F64, H64); frei zur Marktmiete 260.942 € (Konzepte!G64).
  Reihen: Konzepte Zeitreihe!F41, O41, X41, AP41, AG41.
- KONZEPT Folie 19 sieht „Werte an Jahr 1 und Jahr 35“ im Diagramm vor; die Skizze 19 und Blatt 11 beschriften Jahr 35 aber nicht.

**c) Welche Miete braucht frei finanziert, und was zahlt der Markt?**
- Miete für DSCR 1,2 der Bank (Annahme der PGN, Konzepte!D6 = 1,2): 18,36 € je m² und Monat (Konzepte!D12 = H49 = 18,3620; Formel,
  keine Zielwertsuche), bezogen auf das Bankdarlehen 2.370.730 € (Konzepte!H55).
- Marktmiete: 15,42 € (Eingaben!F25 = Konzepte!D13; Quelle Gutachterausschuss, Stand 01.01.2026).
- Aufschlag 19,1 % (Konzepte!D14 = 0,1908), Abstand −2,94 € (T3!G41).
- Zur Marktmiete: DSCR Jahr 1 = 0,99 (Konzepte!G62), Fehlbetrag 1.691 € (G61), 10 Jahre unter 1,2 (G73). Kostendeckende Anfangsmiete
  frei 15,59 € (T3!H36 = Übersicht!G112).

**d) Welche Variante hat die höchste Eigenkapitalrendite, und unter welcher Bedingung?**
- Frei finanziert zur Miete für DSCR 1,2 (18,36 €): VOFI-Eigenkapitalrendite mit Restwert 8,93 % (Konzepte!H81 = 0,08929), ohne
  Restwert 6,32 % (H82). Zum Vergleich frei zur Marktmiete 8,36 % (G81), gefördert 7,05 | 7,28 | 7,40 % (D81:F81), unter den
  geförderten C vorn.
- Bedingungen: Miete 18,36 € liegt 19,1 % über dem Markt (Konzepte!D14); Mietanpassung +2 % p. a. (Eingaben!F26); Restwert
  eingerechnet (Ertragswert Ende Jahr 35, 6,76 Mio. €, Konzepte!H76; Anteil am Endvermögen 57 %, H83); Anschlusszins 3,86 %
  (Eingaben!F37) mit geringer Wirkung.
- Gegenwerte: ohne Mietsteigerung 5,81 % (Lauf mietsteigerung_0 Konzepte!H81); Anschlusszins +1 bzw. −1 Punkt 8,84 % bzw. 9,01 %
  (Läufe anschlusszins_plus_1, anschlusszins_minus_1 Konzepte!H81).

**e) Welche drei Annahmen verändern das Ergebnis am stärksten?** (Läufe N6; Folie 24, A9, A10; Titel Folie 24: „Gefördert hängt das
Ergebnis an Tilgung und Kosten, frei finanziert an der Miete“)
1. Herstellungskosten (Eingaben!E11): bei 5.460 € je m² Fehlbetragsjahre 3 | 12 | 12 | 0 | 22, Miete für DSCR 1,2 27,09 €,
   Eigenkapitalrendite 5,30 | 5,27 | 5,25 | 8,25 | 4,96 % (Lauf kosten_5460 Konzepte!D68:H68, H49, D81:H81); bei 4.631 € je m²
   0 | 3 | 6 | 0 | 14, Miete 23,24 € (Lauf kosten_4631).
2. Miete bzw. Mietentwicklung (Eingaben!F26, Tabellen!D28; dazu die Miete 18,36 € selbst): frei ohne Mietsteigerung 30 Jahre mit
   Fehlbetrag zur Marktmiete, Rendite 5,81 | 4,41 % (Lauf mietsteigerung_0 Konzepte!G68, H81, G81); gefördert ohne Mieterhöhung
   5,08 | 5,37 | 5,54 %, DSCR 6 | 24 | 35 Jahre unter 1,2 (Lauf mietanpassung_gefoerdert_0 Konzepte!D81:F81, D73:F73).
3. Tilgungssatz NBank-Darlehen (Eingaben!F17 = 2,381 %): bei 3,65 % Fehlbetragsjahre 3 | 9 | 9 (Lauf tilgung_3_65 Konzepte!D68:F68);
   Zahlungsüberschuss Jahr 1 null bei 3,65 | 3,03 | 2,90 % (Übersicht!D49:F49).
- Kaum Wirkung: Anschlusszins (gefördert unverändert, frei 8,84 % bzw. 9,01 %).
- Eine ausdrückliche Rangfolge „die drei stärksten“ steht nicht im Material; sie folgt aus den Läufen und dem Titel der Folie 24.
  Der Restwert (57 bis 79 % des Endvermögens, Konzepte!D83:H83) trägt die Rendite stark, ist aber in N6 nicht variiert.

---

## 2 · Antworten des Testlesers (Kurzfassung)

- **a)** 613.426 | 614.908 | 615.649 € gefördert, 592.682 € frei; Titel „rund 0,6 Mio. €“; Eigenmittel 0,59 Mio. € in allen Varianten,
  20 %, 42.334 € je Wohnung, Gesamtkosten 2,96 Mio. €; Differenz gefördert/frei = Bearbeitungsentgelte 20.744 | 22.226 | 22.966 €.
- **b)** Jahr 1: 15.003 | 11.560 | 10.812 | 26.956 | −1.691 €, je m² 1,51 | 1,16 | 1,09 | 2,71 | −0,17 €. Jahr 35 als Jahresbetrag „nicht
  beantwortbar“, aus Folie 19 und Blatt 11 abgelesen etwa 65 | 77 | 85 | gut 310 | gut 260 Tsd. €. Dazu kumuliert bis Jahr 35, Vermögen,
  Restschuld, Restwert und Objektrendite Jahr 35.
- **c)** 18,36 € für DSCR 1,2 auf das Bankdarlehen 2,37 Mio. € (neue Annahme der PGN); Markt 15,42 €; 19,1 % darüber; zur Marktmiete DSCR
  0,99, Fehlbetrag 1.691 €, 10 Jahre unter 1,2, Abstand −2,94 €; kostendeckend 15,59 €; Vergleichsmiete 12,92 €; Kostenläufe 23,24 bzw.
  27,09 €; Höchstmiete gefördert 44 | 53 | 58 % der Marktmiete.
- **d)** Frei 18,36 € mit 8,93 % (VOFI, 35 Jahre, vor Steuern, mit Restwert); Reihenfolge 8,36 | 7,40 | 7,28 | 7,05 %. Bedingungen: Miete
  19,1 % über Markt, Mietsteigerung 2 % p. a., Restwert 6,76 Mio. € (57 % der Rendite). Gegenwerte ohne Mietsteigerung, ohne Restwert,
  ohne Mieterhöhung gefördert; Höchstwert 9,01 % im Lauf Anschlusszins −1; Horizont 42 gefördert 6,57 | 6,76 | 6,86 %.
- **e)** 1. Herstellungskosten, 2. Mietentwicklung (frei und gefördert), 3. Tilgungssatz gefördert, jeweils mit den Laufwerten; ergänzend
  Restwert stark, Anschlusszins schwach. Rangfolge ausdrücklich als eigene Ableitung gekennzeichnet.

Der vollständige Wortlaut steht in der Aufgabe des Verständnistests (JSON, Felder a bis e und unklar).

---

## 3 · Bewertung je Frage

| Frage | Ergebnis | Begründung |
|---|---|---|
| a | richtig | Eigenkapital 613.426 \| 614.908 \| 615.649 \| 592.682 € genau (Konzepte!D56:H56), Eigenmittel 592.682 € (Übersicht!D19), 20 % (Tabellen!D18). Der Grund für den Unterschied (Bearbeitungsentgelte, Konzepte!D57:F57) ist richtig erkannt. Kleine Ungenauigkeit: Der Leser hält die Entgelte für „nirgends ausgewiesen“; sie stehen im Hinweiskasten Folie 16 bzw. A6. |
| b | teilweise | Jahr 1 vollständig und genau (Konzepte!D61:H61, T3!D30:H30). Jahr 35 als Jahreswert nicht gefunden; die Ablesung 65 \| 77 \| 85 \| gut 310 \| gut 260 Tsd. € liegt nahe an 64.860 \| 76.468 \| 84.149 \| 317.109 \| 260.942 € (Konzepte!D64:H64), ist aber keine angegebene Zahl. Ursache im Material: Die in KONZEPT Folie 19 vorgesehenen Werte an Jahr 35 fehlen in Skizze 19 und in Blatt 11. Die Zusatzwerte zu Jahr 35 (kumuliert, Vermögen, Restschuld, Restwert, Objektrendite) stimmen. |
| c | richtig | 18,36 € (Konzepte!D12/H49) als Miete für DSCR 1,2, Annahme der PGN (Konzepte!D6), Marktmiete 15,42 € (Eingaben!F25), 19,1 % (D14), −2,94 € (T3!G41), DSCR 0,99, 1.691 €, 10 Jahre unter 1,2 (G62, G61, G73), 15,59 € (T3!H36), 23,24 \| 27,09 € (Läufe kosten_4631/5460 H49) richtig. |
| d | richtig | 8,93 % frei 18,36 € (Konzepte!H81) als höchster Basiswert, Rangfolge und Bedingungen (19,1 %, +2 % p. a., Restwert 57 %, H83) richtig; alle Gegenwerte stimmen mit den Läufen (mietsteigerung_0, mietanpassung_gefoerdert_0, anschlusszins_minus_1 H81 = 9,01 %). |
| e | richtig | Herstellungskosten, Mietentwicklung und Tilgungssatz mit den richtigen Laufwerten (kosten_5460, kosten_4631, mietsteigerung_0, mietanpassung_gefoerdert_0, tilgung_3_65; Übersicht!D49:F49) und Anschlusszins als schwach erkannt. Der Leser sagt zu Recht, dass die Rangfolge nicht wörtlich im Material steht. |

Fehlerzahl: 0 falsch, 0 nicht beantwortet, 1 teilweise → **0,5**.

---

## 4 · Was der Testleser unklar fand (Rückmeldung an das Team, mit Einordnung)

1. Folien- und Blattnummern: Folie 23 trägt „Blatt 22“, A11 „Blatt 20“ mit Kopf „3 Modellrechnung“ und verweist auf „Folie 23“; Reiter
   „2.1“ auf 16 und 20. **Bestätigt** durch die Zahlenprüfung (Abweichungen 4 und 5, ohne Beleg 3).
2. A7 „Zahlungsüberschuss, Tsd. €“ 653 | 772 | 847: Es ist die **Summe Jahr 36 bis 42** (Konzepte!D91:F91), kein Einheitenfehler. Die
   Zeile sagt „Summe“ nicht; nachtragen.
3. Fazit „dieselbe ohne Mietanpassung“ mischt zwei Läufe. **Berechtigt**; vom Team selbst als Schwäche 17 benannt.
4. A10-Hinweis „steigt frei 18,36 € die Rendite“: **Bestätigt**, die Rendite sinkt (8,93 → 8,50 → 8,25 %). Abweichung 1.
5. Fazit-Titel „Gefördert trägt sich das Haus mit 6,80 €“ gilt nur für A; „verlangt die Bank“ widerspricht der Kennzeichnung als
   Annahme der PGN. **Berechtigt**.
6. Fazit „Kapitaldienst 7,22 auf 17,55 € je m²“, „+52,9 %“, „0,46 %“: Die Werte stammen aus dem Block Ausgangslage (Tabellen!D47:E53,
   T3!D57:D61, heutige Folie 5), nicht aus dem Modellhaus (frei 13,56 € = T3!H27 + H28). Die Herkunft ist auf der Folie nicht erkennbar.
7. Viele Renditebegriffe nebeneinander; „Förderbarwert“ in A8 nicht erklärt. **Berechtigt** (Schwäche 7).
8. Folie 17: Spaltenköpfe versetzt, DSCR Jahr 1 frei zur Marktmiete (0,99) gegen A6 1,20; Titel sagt implizit „C reicht nicht“.
   **Berechtigt**; die Leserichtung der Zeile muss eindeutig werden.
9. Folie 18: Minimum 1,43 | 1,22 unter Jahr-1-Wert 1,44 | 1,23. Ursache Kostensteigerung ab Jahr 2 bei fester Miete bis Jahr 3
   (Konzepte!D71:E71); nicht erklärt.
10. „Projektkonto 2 % | 5 %“, Bezug der Prozente bei Darlehen und Zuschuss, „Bewirtschaftung gleich in allen“. **Berechtigt**; der letzte
    Punkt ist Abweichung 13.
11. Folie 20, „65 % gegen 63 %“: gemeint ist A gegen frei 15,42 € (T3!D83, T3!G83); auf der Folie ergänzen.
12. NBank-Darlehen: 35 Jahre zinsfrei, Laufzeit 42 Jahre, Tilgung 2,38 % = 1/42 (Eingaben!F17, Tabellen!D21). Zusammenhang nur angedeutet.

---

## 5 · Zahlenprüfung

Geprüft: **973 Zahlen**. Abweichungen: **17** (davon mehrere nur Rundung, Format, Zellangabe oder Zählweise). Ohne Beleg: **3 Stellen**.

### Abweichungen

| Nr. | Wo | gezeigt | Mappe / Befund | Zelle |
|---|---|---|---|---|
| 1 | A10 Risiken: Rendite (skizzen/A10-risiken-rendite.png), Hinweiskasten | „In den Kostenläufen steigt frei 18,36 € die Rendite, weil die Bank eine höhere Miete ansetzt (23,24 bzw. 27,09 €)“ | Die EK-Rendite mit Restwert frei 18,36 € sinkt: 8,93 % (Basis) auf 8,50 % (kosten_4631) und 8,25 % (kosten_5460). Die Tabelle auf derselben Skizze zeigt das auch. Gestiegen ist nur die Miete für DSCR 1,2 (H49: 23,24 und 27,09 €). Derselbe Satz steht in KONZEPT A10 und Schwäche 5. | Konzepte!H81 (Konzepte-Mappe, laeufe/kosten_4631.xlsx, laeufe/kosten_5460.xlsx); Konzepte!H49 je Lauf |
| 2 | Folie 21 Objektrendite (skizzen/21-objektrendite.png), Titel | „Das Haus bringt gefördert 1,7 bis 2,8 %“ | Definition der Folie: Überschuss vor Kapitaldienst ÷ Gesamtkosten. Damit gefördert 1,66 bis 2,38 %, also 1,7 bis 2,4 %. Die 2,8 % gelten nur für A mit dem anderen Nenner (ohne Zuschuss). Der Titel mischt zwei Lesarten. Frei 4,5 bis 5,5 % stimmt mit beiden Nennern. | Konzepte!D87:F87 (1,66 \| 2,12 \| 2,38 %); Konzepte!D88 (2,76 %) |
| 3 | A11 Tilgungssatz (skizzen/A11-tilgungssatz-unveraendert.png), Titel, im Vergleich mit Folie 24 und A9 | „Bis 2,90 % Tilgung bleibt in allen drei Gruppen ein Zahlungsüberschuss“ | Stimmt nur für Jahr 1: Im Lauf tilgung_2_90 hat C in Jahr 1 +45 €, über Jahr 1 bis 35 aber 1 Jahr mit Fehlbetrag (Minimum −43 €). Folie 24 und A9 zeigen für C eine 1. Der Titel widerspricht diesen Folien. | laeufe/tilgung_2_90.xlsx Konzepte!F61 = 45,11; F65 = −43; F68 = 1; Übersicht!F49 = 2,902 % |
| 4 | A11 Tilgungssatz, Hinweiskasten | „Bei höheren Kosten liegen die Schwellen niedriger, siehe Folie 23.“ | In der neuen Reihenfolge ist Folie 23 die Folie Herstellungskosten der PGN, dort stehen keine Schwellen. Die Kostenläufe stehen auf Folie 24 und in A9/A10. Verweis aus dem alten Vortrag, veraltet. | laeufe/kosten_4631.xlsx, kosten_5460.xlsx, Konzepte!D68:H73 |
| 5 | Folien 23 (23-herstellungskosten-pgn-unveraendert.png) und A11, Schriftfeld | Folie 23 „Blatt 22“; A11 „Blatt 20“ mit Kopf „3 Modellrechnung“, Registermarke 2.1, zweizeiliger Titel | Im neuen Vortrag ist Blatt 22 die EK-Rendite und Blatt 20 der Rückfluss; die Blattnummern doppeln sich. Laut ABGABE.md gehören die Folien auf 23 und A11. SKIZZEN.md kündigt für A11 einen einzeiligen Anhangtitel an, das Bild zeigt den alten Kopf. | – (Gliederung; ABGABE.md Nr. 11 und 19, SKIZZEN.md Zeilen 23 und A11) |
| 6 | A7 Ende der Bindung, Tabelle „Vermögen Jahr 42, Mio. €“ | 8,89 \| 9,60 \| 9,99 | Rohwerte 8.888.004 \| 9.602.454 \| 9.985.098 € auf 2 Stellen richtig. ZAHLEN.md führt als gezeigt 8,9 \| 9,6 \| 10,0 Mio. € (1 Stelle); bei C fällt 9,99 gegen 10,0 auf. | Konzepte!D94:F94 |
| 7 | A7 Ende der Bindung, Tabelle „Zahlungsüberschuss, Tsd. €“ (Jahr 36 bis 42) | 653 \| 772 \| 847 Tsd. € | Rohwerte 653.081 \| 771.524 \| 847.491 € stimmen (Summe Jahr 36–42). ZAHLEN.md führt als gezeigt 0,65 \| 0,77 \| 0,85 Mio. €. Einheit und Rundung weichen von ZAHLEN.md ab; „Summe“ fehlt in der Zeile (siehe Testleser Nr. 2). | Konzepte!D91:F91 |
| 8 | A8 Rendite in allen Lesarten, Zeile „Objektrendite Jahr 1 (Folie 21)“ | 1,7 \| 2,1 \| 2,4 \| 5,5 \| 4,5 % | Werte stimmen mit 1 Stelle. ZAHLEN.md (Abschnitt A8) führt 1,66 \| 2,12 \| 2,38 \| 5,46 \| 4,49 % (2 Stellen); die übrigen Zeilen von A8 stehen mit 2 Stellen. | Konzepte!D87:H87 (Reihenfolge D, E, F, H, G) |
| 9 | Broschüre Blatt 11, Kennzahlentabelle „Vermögen Ende Jahr 35, Mio. €“ | 6,65 \| 7,19 \| 7,49 \| 11,82 \| 9,86 | Richtig gerundet (6.647.289 \| 7.187.494 \| 7.489.203 \| 11.824.305 \| 9.858.321 €). ZAHLEN.md (Blatt 11) führt 6,6 \| 7,2 \| 7,5 \| 11,8 \| 9,9, so auch die A7-Säulen. Vortrag und Broschüre zeigen unterschiedlich viele Stellen. | Konzepte!D78:H78 |
| 10 | Broschüre Blatt 11, Kennzahlentabelle „Restschuld Ende Jahr 35, €“ | 197.561 \| 296.341 \| 345.731 \| 0 \| 0 | Stimmt mit den Zellen (197.560,85 \| 296.341,10 \| 345.731,40). ZAHLEN.md führt die Zahl nur in Mio. € (0,20 \| 0,30 \| 0,35, Abschnitt A7); kein Eintrag in ganzen Euro für die Broschüre. | Konzepte!D75:H75 |
| 11 | Broschüre Blatt 9 (y-Achse Finanzierung) und Blatt 10 (x-Achse Jahr 1 je m²) | 3.0 \| 2.5 \| … \| 0.0 und 0.0 \| 2.5 \| … \| 20.0 | Dezimalpunkt statt Komma; sonst überall deutsches Format. Nur Achsteilung. | – (Achsteilung) |
| 12 | Folie 17 Miete für DSCR 1,2, Hinweiskasten | „Ab Jahr 4 liegt sie [Gruppe C] bei 1,27.“ | C liegt nur in Jahr 4 bis 6 bei 1,27 (1,269 \| 1,269 \| 1,268), danach stufenweise höher (Jahr 7: 1,37; Jahr 35: 2,64). Eindeutig wäre „ab Jahr 4 mindestens 1,27“. 1,18 in Jahr 1 bis 3 und 10.812 € stimmen. | Konzepte Zeitreihe!Z10:Z12, Z13, Z41 |
| 13 | Folie 14 Varianten, Stichpunkte „Gleich in allen“ | „Bewirtschaftung“ | Gleich sind nur die Annahmen; der Betrag hängt über den Mietausfall an der Miete: 18.412 \| 18.691 \| 18.850 \| 20.125 \| 20.710 € p. a. bzw. 1,85 bis 2,08 €/m². Folie 16 sagt selbst „1,85 € bis 2,08 €“. | Team 3 Vergleich!D11:H11, D25:H25 |
| 14 | Folie 15 Annahmen, Zellangabe in der Fußzeile | „Eingaben F7:F45, Tabellen C14:D33, Übersicht D106, Konzepte D6:D13“ | Gezeigte Werte außerhalb der Bereiche: Darlehen 40 \| 60 \| 70 % und Zuschuss 40 \| 20 \| 10 % (Tabellen!D5:F6), Höchstmiete B und C (Tabellen!E14:F14). | Tabellen!D5:F6, E14:F14 |
| 15 | Folie 17, Zellangabe in der Fußzeile | „Team 3 Vergleich D36:G41, Konzepte D62:H62, D14, H55“ | Spalte Frei 15,59 € und 18,36 € steht in Spalte H, außerhalb von D36:G41. Nicht genannt: 10.812 € (Konzepte!F61), Eigenmittel 20 % (Tabellen!D18), Tilgung Bankdarlehen 1 % (Tabellen!D31). | Team 3 Vergleich!H36:H37; Konzepte!F61; Tabellen!D18, D31 |
| 16 | Fußzeilen der Folien 18, 19 und A9 | 18: „Konzepte Zeitreihe H, Q, Z, AR, AI 7:41; Konzepte D71:H73“ · 19: „… Konzepte D61:H70“ · A9: „Konzepte D61:H73 je Lauf“ | Hinweiswerte ohne Zelle: auf 18 Lauf mietanpassung_gefoerdert_0 (1,12 \| 1,05 \| 1,05; 6 \| 24 \| 35); auf 19 Konzepte!D14 (19,1 %) und Lauf mietsteigerung_0 (30 Jahre); auf A9 Spalte Miete DSCR 1,2 in Konzepte!H49, außerhalb von D61:H73. | laeufe/mietanpassung_gefoerdert_0.xlsx Konzepte!D71:F73; Konzepte!D14; laeufe/mietsteigerung_0.xlsx Konzepte!G68; Konzepte!H49 je Lauf |
| 17 | SKIZZEN.md, Zeile Folie 24 | „Tabelle acht Läufe“ | Die Skizze zeigt Basis und 7 Läufe (Anschlusszins −1 fehlt), also 8 Zeilen. Für A9 und A10 steht „Basis und acht Läufe“, dort 9 Zeilen. Zählweise uneinheitlich. | – (laeufe/*.xlsx) |

### Ohne Beleg

1. Folie 23 Herstellungskosten der PGN (skizzen/23-herstellungskosten-pgn-unveraendert.png, heutige Folie): ZAHLEN.md hat keinen
   Abschnitt für Folie 23; weder Konzepte-Mappe noch werte_konzepte.json oder werte_team.json enthalten die Kostengruppen. Ohne Beleg:
   KG 100 761 | –, KG 200 113 | 58, KG 300/400 3.713 | 2.812, KG 500 174 | 221, KG 600 76 | 75, KG 700 555 | 458, die Prozente
   −22,7 %, −49,3 %, −24,3 %, +27,0 %, −1,3 %, −17,4 %, die Min/Max-Säulen, „Kostenstand Q4 2025“ und „fünf Projekte“. Belegt sind nur
   4.631 (Tabellen!E47 = Team 3 Vergleich!D56) und 3.579 (Eingaben!F11). Quelle laut SKIZZEN.md praesentation/daten/markt.json; dort
   nachgerechnet, die Werte passen und sind richtig gerundet (z. B. 3579,18 / 4631,07 − 1 = −22,7 %).
2. Folie 28 Fazit (png/folie-03.png, pptx Folie 3): „Vorher planen bis Leistungsphase 6“ hat keinen Eintrag in ZAHLEN.md und keine Zelle.
3. Registermarke „2.1“ auf Folie 16 (folie-01.png), Folie 20 (folie-02.png) und A11: steht in keiner Zeile von ZAHLEN.md und passt
   nicht zum Kapitel 3 Modellrechnung.

---

## 6 · Was zu tun ist (aus Test und Zahlenprüfung)

1. Folie 19 und Blatt 11: Zahlungsüberschuss Jahr 35 an den Linienenden beschriften (64.860 | 76.468 | 84.149 | 317.109 | 260.942 €,
   Konzepte!D64:H64), wie in KONZEPT Folie 19 vorgesehen. Das ist der Grund für die halbe Fehlerzahl.
2. A10-Hinweis und KONZEPT (A10, Schwäche 5): „steigt die Rendite“ ersetzen durch „steigt die Miete für DSCR 1,2; die Rendite sinkt
   leicht (8,93 → 8,50 → 8,25 %)“.
3. A11-Titel auf Jahr 1 beschränken oder an Folie 24/A9 angleichen (C bei 2,90 %: 1 Jahr Fehlbetrag); Verweis „Folie 23“ auf „Folie 24“.
4. Schriftfelder von Folie 23 und A11 (Blatt, Kopf, Registermarke) und Reiter „2.1“ auf 16 und 20 an die neue Gliederung anpassen.
5. Folie 21: Titel „1,7 bis 2,4 %“ (ein Nenner) oder die zweite Lesart ausdrücklich nennen.
6. Rundung und Einheiten zwischen Skizzen, Broschüre und ZAHLEN.md angleichen (A7, A8, Blatt 11); A7-Zeile „Summe Jahr 36 bis 42“.
7. Fußzeilen der Folien 15, 17, 18, 19, A9 um die fehlenden Zellen ergänzen; Achsen Blatt 9 und 10 mit Dezimalkomma; SKIZZEN.md
   einheitlich zählen.
8. Folie 14 „Bewirtschaftung“ als gleiche Annahme, nicht gleichen Betrag formulieren; Folie 17 „ab Jahr 4 mindestens 1,27“.
9. Fazit: Herkunft der Ausgangslage-Werte (7,22 → 17,55 €, +52,9 %, 0,46 %) kenntlich machen; Titel „mit 6,80 €“ auf A beziehen oder
   allgemein fassen; „verlangt die Bank“ als Annahme der PGN kennzeichnen; die zwei „ohne“-Läufe getrennt benennen.
