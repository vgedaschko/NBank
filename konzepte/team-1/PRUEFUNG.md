# Prüfung Team 1 „Geldfluss“: Verständnistest und Zahlenprüfung

Stand 14.11.2026. Grundlage der richtigen Antworten: Konzepte-Mappe `konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx`
(Werte aus `werte_konzepte.json`, Lauf „konzepte“ und Läufe N6), `mappe/README.md`, `mappe/ANNAHMEN.md`, `team-1/KONZEPT.md`,
`team-1/ZAHLEN.md`. „Team-1-Mappe“ = `team-1/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team1.xlsx` (Block T1).
Reihenfolge der Werte immer A | B | C | frei (frei = Miete für DSCR 1,2, Spalte H auf Konzepte).

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
- Eigenmittel 592.682 € (20 % der Gesamtkosten 2.963.412 €), in allen vier Varianten gleich: Übersicht!D19 = 592.682,40;
  Konzepte!D52:H52 = 2.963.412; Tabellen!D18 = 20 %.
- Eingesetztes Eigenkapital bei Bezug (mit Bearbeitungsentgelten gefördert): 613.426 | 614.908 | 615.649 | 592.682 €
  (Konzepte!D56:F56, H56); davon Bearbeitungsentgelte 20.744 | 22.226 | 22.966 € (Konzepte!D57:F57), frei „–“ (H57).
- Zusätzliches Eigenkapital bar: 0 € (Eingaben!F40).
- Auf Folie 14 und Blatt 9 gerundet: „je 0,6 Mio. € Eigenmittel“.

**b) Wie viel bleibt je Variante in Jahr 1 und in Jahr 35?** (Zahlungsüberschuss, Zeile 9)
- Jahr 1: 15.003 | 11.560 | 10.812 | 26.956 € (Konzepte!D61:F61, H61). Frei zur Marktmiete 15,42 €: −1.691 € (Konzepte!G61).
- Jahr 35: 64.860 | 76.468 | 84.149 | 317.109 € (Konzepte!D64:F64, H64 = Konzepte Zeitreihe!F41, O41, X41, AP41;
  ZAHLEN Nr. 298, 305, 312, 319). Frei zur Marktmiete: 260.942 € (Konzepte!G64).
- Laut KONZEPT Folie 20 sollen beide Wertereihen als Formen im Diagramm stehen.

**c) Welche Miete braucht frei finanziert, und was zahlt der Markt?**
- Miete für DSCR 1,2 der Bank: 18,36 € je m² und Monat (Konzepte!D12 = H49 = 18,3620; Formel, keine Zielwertsuche).
- Marktmiete: 15,42 € (Eingaben!F25, Gutachterausschuss, Stand 01.01.2026).
- Abstand 2,94 € (Team-1-Mappe Konzepte!H154, T1.42), 19,1 % über der Marktmiete (Konzepte!D14 = 0,1908).
- Zur Marktmiete DSCR Jahr 1 = 0,99 (Konzepte!G62), Fehlbetrag 1.691 € (G61). Kostendeckend frei 15,59 €
  (Team-1-Mappe Konzepte!H152, T1.40).

**d) Welche Variante hat die höchste Eigenkapitalrendite, und unter welcher Bedingung?**
- Frei finanziert: 8,93 % mit Restwert (Konzepte!H81 = 0,08929), 6,32 % ohne Restwert (H82). Gefördert 7,05 | 7,28 | 7,40 %
  (D81:F81), höchste Gruppe C.
- Bedingung: Miete 18,36 € statt Marktmiete 15,42 € (19,1 % darüber, Konzepte!H49, D14) und Mietanpassung 2 % p. a.
  (Eingaben!F26); Anschlusszins 3,86 % (Eingaben!F37) mit geringer Wirkung (8,84 % bzw. 9,01 % bei ±1 Punkt,
  Läufe anschlusszins_plus_1/minus_1 Konzepte!H81).
- Ohne Mietanpassung 5,81 % (Lauf mietsteigerung_0 Konzepte!H81). Zur Marktmiete 8,36 % (Konzepte!G81), aber DSCR 0,99,
  die Bank gäbe das Darlehen so nicht.

**e) Welche drei Annahmen verändern das Ergebnis am stärksten?** (Läufe N6, Folie 24 und A7)
1. Herstellungskosten (Eingaben!E11): bei 5.460 € je m² Eigenkapitalrendite 5,30 | 5,27 | 5,25 | 8,25 %, Fehlbetragsjahre
   3 | 12 | 12 | 0 (Lauf kosten_5460 Konzepte!D81:F81, H81, D68:H68), Miete frei 27,09 € (H49); bei 4.631 € 6,01 | 6,13 | 6,21 | 8,50 %,
   Fehlbetrag 0 | 3 | 6 | 0 (Lauf kosten_4631).
2. Miete und Mietanpassung (Tabellen!D28, Eingaben!F26, Eingaben!F25): gefördert ohne Mieterhöhung 5,08 | 5,37 | 5,54 %
   (Lauf mietanpassung_gefoerdert_0 Konzepte!D81:F81); frei ohne Mietanpassung 8,93 % → 5,81 % (Lauf mietsteigerung_0 H81);
   frei zur Marktmiete DSCR 0,99, Fehlbetrag in Jahr 1 (Konzepte!G62, G61).
3. Tilgungssatz NBank (Eingaben!F17 = 2,381 %): bei 3,65 % Fehlbetragsjahre 3 | 9 | 9, Zahlungsüberschuss Jahr 1 −40 | −11.004 |
   −15.513 € (Lauf tilgung_3_65 Konzepte!D68:F68, D61:F61); Rendite kaum verändert (6,97 | 7,16 | 7,25 %). Zahlungsüberschuss
   null bei 3,65 | 3,03 | 2,90 % (Übersicht!D49:F49).
- Kaum Wirkung: Anschlusszins (gefördert unverändert, frei 8,84 % bzw. 9,01 %).
- Die Rangfolge steht so nicht wörtlich im Material; sie folgt aus den Läufen und dem Titel der Folie 24
  („Gefördert drücken Tilgung und Kosten, frei finanziert hängt alles an der Miete“).

---

## 2 · Antworten des Testlesers

**a)** Eigenmittel: 592.682 €, das sind 20 % der Herstellungskosten von 2.963.412 € (3.579 € je m², 828 m², 14 Wohnungen). Die Titel
runden das auf „3,0 Mio. €, je 0,6 Mio. € Eigenmittel“ (Folie 14, Blatt 9). Weiteres Eigenkapital: 0 € (Folie 15).
Gebunden sind bei Bezug, unverzinst, je nach Variante etwas mehr, weil die einmaligen Bearbeitungsentgelte dazukommen (20.744 | 22.226 |
22.966 €): A 613 Tsd. €, B 615 Tsd. €, C 616 Tsd. €, frei 593 Tsd. € (Folien 21 und 23).

**b)** Jahr 1, Zahlungsüberschuss (Zeile 9, Folie 16, Blatt 10, Fazit): A 15.003 €, B 11.560 €, C 10.812 €, frei 26.956 €. Frei gilt das
nur bei 18,36 € Miete. Zur Marktmiete hätte frei in Jahr 1 einen Fehlbetrag von 1.691 €.
Jahr 35 als Jahreswert: Eine Zahl steht nur für A, im Titel von Folie 20: „In A wächst der Zahlungsüberschuss auf 64.860 €“. Für B, C und
frei steht kein Wert für Jahr 35, die Frage ist dafür also nicht beantwortbar. Abgelesen aus dem Diagramm wären es etwa B ~77, C ~85,
frei ~317 Tsd. € (das ist keine angegebene Zahl).
Was es sonst zu Jahr 35 gibt:
- Summe Jahr 1 bis 35: 1,29 | 1,40 | 1,51 | 4,04 Mio. € (Folien 17 und 20).
- Über das Eigenkapital hinaus am Ende von Jahr 35: 0,68 | 0,79 | 0,89 | 3,45 Mio. € (Folie 21).
- Vermögen Ende Jahr 35: 6,65 | 7,19 | 7,49 | 11,82 Mio. € (Folie 23).
- Kleinster Zahlungsüberschuss in Jahr 1 bis 35: 14.595 | 11.294 | 10.617 | 26.956 €.
- In keiner Variante gibt es ein Jahr mit Fehlbetrag.

**c)** Frei finanziert braucht es 18,36 € je m² und Monat, weil die Bank DSCR 1,2 verlangt. Der Markt zahlt 15,42 € (Marktmiete). Die
Lücke beträgt 2,94 € oder 19,1 % über der Marktmiete (Folien 16 und 18, A6).
Weitere Werte:
- Kostendeckend (Zeile 9 = 0) wären frei 15,59 €.
- Zur Marktmiete liegt der DSCR in Jahr 1 bei 0,99, der Fehlbetrag bei 1.691 €. „Die Bank gäbe das Darlehen so nicht.“
- Bei höheren Herstellungskosten braucht es 23,24 € (bei 4.631 €/m²) bzw. 27,09 € (bei 5.460 €/m²) (Folie 24).
- Vergleichsmiete laut Folie 15: 12,92 €.

**d)** Die höchste Eigenkapitalrendite hat frei finanziert: 8,93 % mit Restwert, 6,32 % ohne Restwert (Folie 23, Fazit). Gefördert liegt
sie bei 7,05 | 7,28 | 7,40 % (A | B | C), am höchsten also C mit 7,40 %.
Bedingung: Frei liegt nur vorn mit 18,36 € Miete (19,1 % über der Marktmiete 15,42 €) und 2 % Mietanpassung pro Jahr (Blatt 11, Kasten
„Frei finanziert vorn: unter welchen Annahmen?“).
- Ohne Mietanpassung sinkt frei auf 5,81 %, und die DSCR liegt dann in 29 Jahren unter 1,2 (tiefster Wert 1,10).
- Nur zur Marktmiete: 8,36 % bei 1 Jahr mit Fehlbetrag, aber DSCR 0,99, die Bank gäbe das Darlehen nicht.
Zusätzlich hängt alles am Restwert: Er ist Ertragswert Ende Jahr 35 bei 2,80 % Liegenschaftszins und macht 78–79 % des Vermögens
gefördert und 57 % frei aus.

**e)** Nach Folie 24 bzw. A7 („Was passiert, wenn eine Annahme kippt?“, Titel: „Gefördert drücken Tilgung und Kosten, frei finanziert
hängt alles an der Miete“):
1. Herstellungskosten.
   - Bei 5.460 €/m² fällt die Eigenkapitalrendite auf 5,30 | 5,27 | 5,25 | 8,25 %, mit 3 | 12 | 12 | 0 Jahren Fehlbetrag. Der
     Zahlungsüberschuss in Jahr 1 liegt bei −2,9 | −15,4 | −20,6 Tsd. €, die Miete frei steigt auf 27,09 €.
   - Bei 4.631 €/m²: 6,01 | 6,13 | 6,21 | 8,50 %, mit 0 | 3 | 6 Jahren Fehlbetrag.
   - Im Fazit steht dazu: „rund 5.150 € je m², Grenze in A“.
2. Miete bzw. Mietentwicklung.
   - Ohne Mieterhöhung gefördert (6,15 % alle 3 Jahre): 5,08 | 5,37 | 5,54 %, DSCR in 6 | 24 | 35 Jahren unter 1,2.
   - Ohne Mietanpassung frei (2 % p. a.): 5,81 %.
   - Frei zur Marktmiete: DSCR 0,99, kein Bankdarlehen.
3. Tilgungssatz der NBank (heute 2,38 %).
   - Bei 3,65 % Tilgung: 3 | 9 | 9 Jahre mit Fehlbetrag, der Zahlungsüberschuss in Jahr 1 liegt bei 0,0 | −11,0 | −15,5 Tsd. €. Die
     Eigenkapitalrendite ändert sich dabei nur wenig (6,97 | 7,16 | 7,25 %).
   - Der Zahlungsüberschuss in Jahr 1 wird null bei 2,90 % (C), 3,03 % (B) und 3,65 % (A).

Kaum Wirkung hat der Anschlusszins (4,86 % oder 2,86 %: frei 8,84 % bzw. 9,01 %, gefördert unverändert).
Ausdrücklich als „die drei stärksten“ benannt werden diese Annahmen nirgends. Die Rangfolge ist meine Ableitung aus Folie 24 und A7.

---

## 3 · Bewertung je Frage

| Frage | Ergebnis | Begründung |
|---|---|---|
| a | richtig | Eigenmittel 592.682 € (Übersicht!D19) und Eigenkapital bei Bezug 613 \| 615 \| 616 \| 593 Tsd. € (Konzepte!D56:H56) mit Grund (Bearbeitungsentgelte D57:F57) und 0 € bar (Eingaben!F40) genannt. Kleine Ungenauigkeit: 20 % beziehen sich auf die Gesamtkosten (Herstellung + KG 800 + Grundstück); weil KG 800 und Grundstück 0 € sind, ist das hier gleich. |
| b | teilweise | Jahr 1 vollständig und genau (Konzepte!D61:H61, dazu G61). Jahr 35 nur für A genau (64.860 €, D64). Für B, C und frei hat der Leser keinen Wert gefunden und nur aus dem Diagramm geschätzt (~77 \| ~85 \| ~317 Tsd. € gegen 76.468 \| 84.149 \| 317.109 €, E64, F64, H64). Die Schätzung liegt nahe, ist aber keine abgelesene Zahl. Ursache im Material: Die in KONZEPT Folie 20 vorgesehenen Werteformen für Jahr 35 fehlen offenbar in der Skizze. |
| c | richtig | 18,36 € (Konzepte!D12/H49), Marktmiete 15,42 € (Eingaben!F25), Abstand 2,94 € (Team-1 H154) und 19,1 % (D14) richtig; Zusatzwerte (15,59 €, DSCR 0,99, Fehlbetrag 1.691 €, 23,24 \| 27,09 €) stimmen. |
| d | richtig | Frei 8,93 % mit, 6,32 % ohne Restwert (H81, H82); Bedingung Miete 18,36 € und 2 % Mietanpassung (Eingaben!F26) richtig; Gegenwerte 5,81 % (Lauf mietsteigerung_0) und 8,36 % zur Marktmiete (G81) richtig. Der Anschlusszins als dritte Bedingung des Vorbehalts fehlt hier, steht aber in e mit der richtigen Wirkung. |
| e | richtig | Herstellungskosten, Miete/Mietanpassung und Tilgungssatz mit den richtigen Laufwerten (kosten_5460, kosten_4631, mietanpassung_gefoerdert_0, mietsteigerung_0, tilgung_3_65) und Anschlusszins als schwach erkannt. Der Leser sagt zu Recht, dass die Rangfolge nicht wörtlich im Material steht. Der Wert „0,0“ für A bei 3,65 % ist so abgelesen; richtig wäre −40 € (siehe Zahlenprüfung). |

Fehlerzahl: 0 falsch, 0 nicht beantwortet, 1 teilweise → **0,5**.

---

## 4 · Was der Testleser unklar fand (Rückmeldung an das Team)

1. Eigenkapital: Titel „je 0,6 Mio. € Eigenmittel“, Tabellen 613 | 615 | 616 | 593 Tsd. €; dass die Bearbeitungsentgelte den Unterschied
   machen, steht nur im Kleingedruckten von Folie 21.
2. Gesamtsumme: Titel „3,0 Mio. €“, gerechnet wird mit 2.963.412 €; im Balken Zuschuss 1,2 statt 1.185 Tsd., Bankdarlehen 2,4 statt 2,37 Mio.
3. Jahr 35: Ein Jahreswert steht nur für A (64.860 €, Titel Folie 20); für B, C und frei nur Diagramme und Summen. Der Titel hebt A hervor,
   obwohl A in Jahr 35 am niedrigsten liegt.
4. „Vom ersten Jahr an“ (Fazit): C hat DSCR 1,18 in Jahr 1 bis 3, Folie 19 sagt „ab Jahr 4 alle über 1,2“; gemeint ist offenbar
   „kein Fehlbetrag“.
5. Höchstmiete C: Folie 18 sagt, die Höchstmiete reiche nur in A und B; C hat trotzdem 10.812 € Überschuss.
6. Zwei Risikomaße: Folie 24 zählt Jahre mit Fehlbetrag, A7 Jahre mit DSCR unter 1,2 (z. B. keine Mieterhöhung 0 | 0 | 0 gegen 6 | 24 | 35).
7. Tilgung 2,90 %: bei C 1 Jahr Fehlbetrag (Folie 24) neben Überschuss 0,0 (A7) und Titel A8 „bis 2,90 % bleibt in allen drei ein
   Überschuss“; A8 verweist noch auf „Folie 23“; die Gruppen tauschen die Reihenfolge bei 1,91 %.
8. Tiefster DSCR (Folie 19: 1,43 | 1,22, Jahr 1: 1,44 | 1,23) und kleinster Überschuss A (14.595 € gegen 15.003 € in Jahr 1): Der
   Tiefpunkt liegt nicht in Jahr 1, das wird nicht erklärt.
9. „Gefördert 0 € Zins“ (Folie 17) neben Verwaltungskostenbeitrag 0,5 % und Zins 3,86 % ab Jahr 36 (A11); Fazit „Darlehen 35 Jahre
   zinsfrei“, Laufzeit 42 Jahre.
10. Objektrendite frei 5,46 % heißt „unabhängig von der Finanzierung“, beruht aber auf der finanzierungsbedingten Miete 18,36 €; Titel
    Folie 22 hebt den Wert nach Abzug des Zuschusses rot hervor.
11. Restwert: 57–79 % des Vermögens; „aus der Miete der Gruppe bis zur Marktmiete“ nicht erklärt; Folie 15 „Miete nach Jahr 42:
    Marktmiete“ gegen A11 „Kappungsgrenze 20 % in 3 Jahren“; in A11 sinkt die Rendite mit Restwert bis Jahr 42 (6,57 %), ohne Restwert
    steigt sie (3,53 %).
12. Frei zur Marktmiete hat mit 8,36 % noch eine höhere Eigenkapitalrendite als alle geförderten Varianten und gilt trotzdem als nicht
    finanzierbar.
13. „rund 5.150 €“ im Fazit wird auf keiner anderen Folie hergeleitet; Kapitelnamen der Fazit-Folie passen nicht recht (18,36 € unter
    „Ausgangslage“, Kopf „4 Umsetzung“).
14. Blatt 11 „Risiko kompakt“: Schreibweise „6,97 % | 3“ muss man sich erschließen; nur A und frei, nicht B und C.

---

## 5 · Zahlenprüfung

Geprüft: **980 Zahlen**. Abweichungen: **5** (davon 2 nur Darstellung/Format). Ohne Beleg: **8 Stellen**.

### Abweichungen

| Wo | gezeigt | Mappe / Befund | Zelle |
|---|---|---|---|
| Folie A7 Risiken im Einzelnen, Zeile Tilgung 3,65 %, Zahlungsüberschuss Jahr 1, Spalte A (in Tsd. €) | 0,0 | −40,34 € (Lauf tilgung_3_65, Konzepte!D61; ZAHLEN Nr. 632: −40 €). Richtig gerundet wäre −0,0. Das Minus fehlt, so verschwindet der Fehlbetrag (F24 zeigt für A 3 Jahre mit Fehlbetrag). Besser in € zeigen oder −0,04. | laeufe/tilgung_3_65.xlsx Konzepte!D61 |
| SKIZZEN.md (Nr. 23 der Testliste), Zeile Folie 15 | 38 Annahmen | Folie 15 und Broschüre Blatt 9 zeigen 39 Zeilen (11 + 14 + 14, gezählt im Bild und in bau_skizzen.py annahmen()). Diese Zahl hängt an keiner Zelle. | – |
| Folie 22 Objektrendite, Tabelle Rechenweg, Zeile Zuschuss Tsd., Spalte FREI | 0 | Die Zelle enthält „–“ (Text, kein Zuschuss), nicht 0. Inhaltlich gleich, aber ohne Zeile in ZAHLEN.md. | Konzepte!H53 |
| Folie 20 Liquidität, Titel „In A wächst der Zahlungsüberschuss auf 64.860 €“ | 64.860 € | Die Zahl stimmt: Jahr 35 = 64.860,07 (Konzepte Zeitreihe!F41). Der Höchstwert in Jahr 1–35 liegt aber in Jahr 34 bei 65.374,86 € (F40). „wächst auf“ ist daher ungenau. | Konzepte Zeitreihe!F41 (F40) |
| Skizzen Folie 14, Folie 18, Broschüre Blatt 9: Achsenbeschriftung der Balkendiagramme | 0.0 · 0.5 · 1.0 … 3.0 bzw. 2.5 · 7.5 · 12.5 · 17.5 | Nur Format: Dezimalpunkt statt Komma. Sonst steht überall deutsches Format, z. B. „0,0 %“ auf Folie A8 und „2,5 %“ auf A9. Keine Abweichung im Wert. | – |

### Ohne Beleg

1. Folie 15 und Broschüre Blatt 9 (Tabelle und Steckbrief „Mietenstufe VI, EH 55“): „EH 55“ steht in keiner Zeile von ZAHLEN.md und in
   keiner Wertzelle. In der Mappe steht nur Eingaben!F23 = „nein“ (EH 40) und die Bemerkung Eingaben!G23 „Planung PGN (EH 55)“. In
   bau_skizzen.py ist es von Hand gesetzt.
2. Folie 17 (Entwurf), Balkenbeschriftung Bewirtschaftung Jahr 1 in Tsd. €: 18,4 | 18,7 | 18,8 | 20,7 ohne Zeile in ZAHLEN.md. Die Werte
   stimmen mit Team-1-Mappe Konzepte!D122:F122, H122 (−18.412 | −18.691 | −18.850 | −20.710).
3. Folie 17 (Entwurf), Balkenbeschriftung Bewirtschaftung Jahr 1–35 in Mio. €: 0,92 | 0,93 | 0,94 | 1,04 ohne Zeile in ZAHLEN.md. Die
   Werte stimmen mit Team-1-Mappe Konzepte!D142:F142, H142 (−919.351 | −933.019 | −940.829 | −1.035.390).
4. Folie 22, Rechenweg: Zuschuss frei „0“. Konzepte!H53 fehlt in ZAHLEN.md, die Zelle enthält „–“.
5. Folie 19, Stichpunkt „C: 1,18 in Jahr 1 bis 3“: Jahr 2 und Jahr 3 stehen nicht in ZAHLEN.md (dort nur Stützjahre 1, 4, 10 …). Die
   Mappe bestätigt: Konzepte Zeitreihe!Z8 = 1,1801 und Z9 = 1,1791.
6. Folie A9 (Bild heute A7): Titel „ab rund 3.000 € je m²“ und der Kurvenverlauf von 2.460 bis 5.460 € je m² haben keine Zeile in
   ZAHLEN.md und keine Zelle. Belegt sind nur die Stützpunkte 3.579, 4.631 und 5.460 (Übersicht!E63/F64 und Läufe kosten_4631,
   kosten_5460). Die Bezeichnung „ARGE-Median 4.631 €“ stammt aus praesentation/daten/markt.json, in der Mappe ist 4.631 nur die
   Laufeingabe Eingaben!E11.
7. Folie A8 (Bild heute 20): Die Linien reichen bis 4,0 % Tilgung, ZAHLEN.md hat Stützpunkte nur bis 3,00 % (Übersicht!B55:F62). Die
   Endpunkte bei 4 % (A ≈ −4.200, B ≈ −17.200, C ≈ −22.800 €, linear) sind ohne Beleg. Sie sind nicht beschriftet.
8. Folie A10 (Bild heute 22): alle Zahlen außer 3.579 € (Eingaben!F11), also −22,7 %, 4.631, 3.713, 2.812, 761, 113, 58, 174, 221, 76,
   75, 555, 458, −49,3 %, −24,3 %, +27,0 %, −1,3 % und −17,4 %. Laut ZAHLEN.md stehen sie bewusst nicht in der Mappe, sondern in
   praesentation/daten/markt.json. Stichprobe gegen markt.json (kosten.pgn/arge, kosten.spannen): alle Prozente rechnen sich richtig nach.

---

## 6 · Was zu tun ist (aus Test und Zahlenprüfung)

1. Folie 20 und Blatt 11: Zahlungsüberschuss Jahr 35 für alle vier als Wert zeigen (64.860 | 76.468 | 84.149 | 317.109 €,
   Konzepte!D64:F64, H64), wie in KONZEPT Folie 20 vorgesehen; Titel „in Jahr 35“ ergänzen oder „wächst auf“ ersetzen (Höchstwert A in
   Jahr 34, F40).
2. Folie A7: A bei Tilgung 3,65 % als −40 € (oder −0,04 Tsd. €) zeigen.
3. Folie 22: Zuschuss frei als „–“ wie in der Mappe; Zeile Konzepte!H53 in ZAHLEN.md aufnehmen.
4. SKIZZEN.md und KONZEPT (Schwäche 7 und 20, Abschnitt 8 Nr. 14): 39 statt 38 Annahmen.
5. Achsen der Skizzen 14, 18 und Blatt 9 mit Dezimalkomma.
6. Belege nachtragen: EH 55, Bewirtschaftung Folie 17 (Team-1 D122:H122, D142:H142), DSCR C Jahr 2 und 3 (Zeitreihe Z8, Z9).
7. Verständnis: Bearbeitungsentgelte als Grund für 613 bis 616 Tsd. € sichtbarer machen; in Folie 24 und A7 klar sagen, welches
   Risikomaß gezählt wird (Fehlbetrag oder DSCR unter 1,2).
