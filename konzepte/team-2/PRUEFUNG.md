# Prüfung Team 2: Verständnistest und Zahlenprüfung

Stand 14.11.2026. Grundlage für die richtigen Antworten: `konzepte/mappe/werte_konzepte.json` (Lauf „konzepte“ und Läufe N6), `konzepte/mappe/README.md`, `ANNAHMEN.md`, `team-2/KONZEPT.md`, `team-2/ZAHLEN.md`.
Zellen ohne Dateiangabe stehen in der Konzepte-Mappe (`PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx`). „N6 <lauf>“ = `konzepte/mappe/laeufe/<lauf>.xlsx`, Blatt Konzepte. „T2“ = Team-2-Kopie, Blatt „Team 2“.

## Ergebnis

| Frage | Bewertung |
|---|---|
| a) Eigenkapital | richtig |
| b) Was bleibt in Jahr 1 und 35 | richtig |
| c) Miete frei finanziert und Markt | teilweise |
| d) Höchste Eigenkapitalrendite, Bedingung | richtig |
| e) Drei stärkste Annahmen | richtig |

**Fehlerzahl: 0,5** (keine Frage falsch oder unbeantwortet, eine teilweise).

---

## a) Wie viel Eigenkapital setzt der Investor ein?

**Richtige Antwort.** Rund 0,6 Mio. € in allen vier Varianten. Eigenkapital bei Bezug A 613.426 €, B 614.908 €, C 615.649 €, frei finanziert 592.682 € (Konzepte!D56:F56, H56).
Es besteht aus den Eigenmitteln 592.682 € = 20 % der Gesamtkosten 2.963.412 € (828 m² × 3.579 €; Tabellen!D18, Konzepte!D52, Übersicht!D19:G19) und, nur gefördert, den einmaligen Bearbeitungsentgelten
20.744 | 22.226 | 22.966 € (Konzepte!D57:F57). Frei finanziert ersetzt das Bankdarlehen 2.370.730 € (Konzepte!H55) Zuschuss und NBank-Darlehen.

**Antwort des Testlesers.** Alle vier Beträge, die Zerlegung in Eigenmittel und Bearbeitungsentgelte und die Gesamtkosten stimmen. Der Zusatz zur Marktmiete (Bank leiht 1,95 Mio. €, 0,42 Mio. € mehr Eigenkapital) stimmt mit T2!C59 und C61.

**Bewertung: richtig.**

## b) Wie viel bleibt je Variante in Jahr 1 und in Jahr 35?

**Richtige Antwort.** Zahlungsüberschuss in € p. a.:
- Jahr 1: A 15.003, B 11.560, C 10.812, frei finanziert 26.956 (Konzepte!D61:F61, H61; frei mit 18,36 € Miete).
- Jahr 35: A 64.860, B 76.468, C 84.149, frei finanziert 317.109 (Konzepte!D64:F64, H64).
- Zur Marktmiete 15,42 € (nur Risiko, Folie 25): Jahr 1 −1.691 €, Jahr 35 260.942 € (Konzepte!G61, G64).

**Antwort des Testlesers.** Jahr 1 und Jahr 35 vollständig und richtig, mit der Bedingung „frei nur mit 18,36 € Miete“. Die Zusätze stimmen ebenfalls: kumuliert 1,29 | 1,40 | 1,51 | 4,04 Mio. € (Konzepte!D66:F66, H66), keine Fehlbetragsjahre und tiefster Kontostand 0 (D68:H68, D70:H70 ohne G),
Vermögen Ende Jahr 35 6,65 | 7,19 | 7,49 | 11,82 Mio. € (D78:F78, H78), ohne Restwert 1,49 | 1,51 | 1,59 | 5,06 Mio. € (D79:F79, H79). Den Fehlbetrag zur Marktmiete (−1.691 € in Jahr 1) nennt er hier nicht, die Frage verlangt ihn aber nicht.

**Bewertung: richtig.**

## c) Welche Miete braucht frei finanziert, und was zahlt der Markt?

**Richtige Antwort.** Für DSCR 1,2 braucht frei finanziert 18,36 € je m² und Monat (Konzepte!D12; Rechenweg 134.779 € × 1,2 + 17.061 € ÷ 98 % = Sollmiete 182.444 € ÷ 828 m² ÷ 12, Konzepte!D10, D11, Frei DSCR 1,2!E7). Der Markt zahlt 15,42 € (Konzepte!D13, Eingaben!F25).
Die nötige Miete liegt 19,1 % über dem Markt (Konzepte!D14 = 0,1908); umgekehrt liegt die Marktmiete 16,0 % unter der nötigen Miete (1 − 15,42 ÷ 18,362). Kostendeckend (DSCR 1,0) wären 15,59 € (Übersicht!G112). Zur Marktmiete liegt die DSCR in Jahr 1 bei 0,99 (Konzepte!G62).

**Antwort des Testlesers.** 18,36 €, 15,42 €, Sollmiete 182.444 €, 15,59 € (Sollmiete 154.939 €, in ZAHLEN.md gerechnet), DSCR 0,99 und der Vergleich gefördert (5,96 | 8,06 | 9,12 € gegen 6,80 | 8,20 | 9,00 €, Konzepte!D22:F22, D19:F19; C fehlen 0,12 €, Konzepte!F23; DSCR 1,18, F21) stimmen.
**Falsch** ist der Satz „Der Markt zahlt 15,42 €, das sind 19,1 % weniger als die nötige Miete“. Die 19,1 % sind der Aufschlag der nötigen Miete auf die Marktmiete; die Marktmiete liegt 16,0 % unter der nötigen Miete. Der Testleser hat die Bezugsgröße umgedreht.
(Nebenbei: Die Mappe-README nennt für B 8,07 €; der Zellwert Konzepte!E22 = 8,0650 ergibt 8,06 €, wie der Testleser schreibt.)

**Bewertung: teilweise.** Beide Mieten stimmen, aber die Aussage, wie weit der Markt darunter liegt, ist falsch. Hinweis an das Team: „19,1 % über dem Markt“ wird leicht als „Markt 19,1 % darunter“ gelesen; besser beide Zahlen in Euro und den Abstand in Euro (2,94 €) zeigen.

## d) Welche Variante hat die höchste Eigenkapitalrendite, und unter welcher Bedingung?

**Richtige Antwort.** Frei finanziert: 8,93 % mit Restwert, 6,32 % ohne Restwert (VOFI-EK-Rendite, Horizont Jahr 35, Konzepte!H81, H82); EK-IRR mit Restwert 12,06 % (H84). Bedingung: Miete 18,36 € je m² in Jahr 1, also 19,1 % über der Marktmiete 15,42 €, und +2 % Mietsteigerung p. a. (Eingaben!F26), dazu der Anschlusszins wie Eingabe 6.1.
Ohne Mietsteigerung fällt sie auf 5,81 % (N6 mietsteigerung_0, Konzepte!H81); zur Marktmiete 8,36 % (Konzepte!G81) bei einem Jahr mit Fehlbetrag und DSCR 0,99. Unter den geförderten liegt C vorn: 7,40 % mit, 2,75 % ohne Restwert (Konzepte!F81, F82).

**Antwort des Testlesers.** Variante, beide Renditen, EK-IRR, Bedingung (18,36 € und +2 % p. a.), 5,81 % ohne Mietsteigerung und die geförderten Werte A 7,05 | 2,58 %, B 7,28 | 2,61 %, C 7,40 | 2,75 % sowie der Restwertanteil 78 bis 79 % (Konzepte!D83:F83) stimmen.
Ungenau ist der Zusatz „Zahlt der Markt nur 15,42 €, sind es 8,36 %, dann aber mit 0,42 Mio. € mehr Eigenkapital“: Die 8,36 % (Konzepte!G81) rechnen mit dem vollen Bankdarlehen 2,37 Mio. € und dem Eigenkapital 592.682 € (Konzepte!G55, G56), nicht mit dem kleineren Darlehen und 0,42 Mio. € mehr Eigenkapital aus T2.5. Die Rendite mit dem kleineren Darlehen rechnet das Konzept nicht (KONZEPT.md, Schwäche 9). Der Testleser hat das selbst als unklar gemeldet (Punkt 3).

**Bewertung: richtig.** Kern der Frage vollständig richtig; der ungenaue Zusatz betrifft einen Nebenlauf, den das Konzept auf Folie 25 missverständlich nebeneinander stellt.

## e) Welche drei Annahmen verändern das Ergebnis am stärksten?

**Richtige Antwort.** Eine ausdrückliche Rangfolge von drei Annahmen steht nicht im Konzept. Aus Folie 25 („Gefördert drücken Tilgung und Kosten, frei finanziert Miete und Mietsteigerung“) und den Läufen N6 ergeben sich:
1. **Herstellungskosten.** 5.460 € je m²: Fehlbetrag in A 3, B 12, C 12 Jahren; EK-Rendite mit Restwert 5,30 | 5,27 | 5,25 %; ohne Restwert A −1,53 %, B, C „n. v.“; frei finanziert braucht 27,09 € Miete (N6 kosten_5460, Konzepte!D68:F68, D81:F81, D82:F82, H49).
2. **Tilgungssatz NBank-Darlehen.** 3,65 %: Fehlbetrag A 3, B 9, C 9 Jahre, DSCR-Minimum bis 0,82, tiefster Kontostand C −128.266 € (N6 tilgung_3_65, Konzepte!D68:F68, D71:F71, F70); A trägt bis 3,64 % (Übersicht!D49).
3. **Miete und Mietanpassung.** Gefördert ohne Mieterhöhung in der Bindung: 5,08 | 5,37 | 5,54 % mit, −1,67 | −4,51 | −6,34 % ohne Restwert (N6 mietanpassung_gefoerdert_0, Konzepte!D81:F81, D82:F82) – laut Konzept „trifft die Rendite am stärksten“.
   Frei finanziert ohne Mietsteigerung 5,81 % statt 8,93 % und 29 Jahre unter DSCR 1,2 (N6 mietsteigerung_0, Konzepte!H81, H73); zur Marktmiete DSCR 0,99, 0,42 Mio. € mehr Eigenkapital (Konzepte!G62, T2!C61).

**Antwort des Testlesers.** Er erkennt richtig, dass keine Rangfolge im Entwurf steht, nennt genau diese drei Annahmen mit der Folie-25-Aussage und belegt jede mit richtigen Zahlen (alle gegen die Läufe N6 nachgelesen: 5,30 | 5,27 | 5,25 %, 12 Jahre B und C, −1,53 %, „n. v.“, 27,09 €, 3 | 9 | 9 Jahre, 0,82, 3,64 %, 5,08 | 5,37 | 5,54 %, −1,67 | −4,51 | −6,34 %, 5,81 %, 29 Jahre, 0,99, 0,42 Mio. €).
Dass bei 5.460 € auch A 3 Fehlbetragsjahre hat, lässt er aus; das ist keine falsche Aussage.

**Bewertung: richtig.**

---

## Unklarheiten des Testlesers (nicht gewertet, Einordnung)

1. Frei finanziert mit 18,36 € statt Marktmiete: berechtigt; im Konzept als Schwächen 4, 12 und 17 benannt.
2. Zwei Renditemaße (VOFI-EK-Rendite und EK-IRR): berechtigt; der Unterschied wird auf A6 nicht erklärt. Horizont 42 niedriger mit, höher ohne Restwert: stimmt (A7: A 6,57 % gegen 7,05 % mit, 3,53 % gegen 2,58 % ohne Restwert).
3. Markt-Lauf 8,36 % und 0,42 Mio. €: berechtigt (siehe d). Der eine Fehlbetrag zur Marktmiete ist Jahr 1 mit −1.691 € (Konzepte!G61, G70), passend zur DSCR 0,99 < 1,0.
4. „C fehlen 0,12 €“, obwohl die NBank keine DSCR verlangt: berechtigt; im Konzept als Schwäche 11 benannt.
5. Anschlusszins „3,86 %, dann 3,86 %“: Wortlaut berechtigt unklar (Eingaben!F35 und F37 sind gleich gesetzt). Der Lauf 2,86 % fehlt auf Folie 25 mit Absicht (KONZEPT.md Abschnitt 8, Folie 25, Punkt 1).
6. Vergleichsmiete 12,92 € ist der Wert in Jahr 1 (Eingaben!F24) und steigt mit 2 % p. a.; deshalb liegt A in Jahr 35 bei 13,11 €. Berechtigt unklar, weil die Folie das Jahr nicht nennt.
7. bis 9. Nummerierung, Titelauswahl, „Nettoanfangsrendite; Abweichung 0“: Darstellungsfragen, berechtigt.

---

## Zahlenprüfung

**Geprüft: 1.050 Zahlen. Abweichungen: 2. Ohne Beleg: 4 Gruppen.**

### Abweichungen

| Wo | Gezeigt | Mappe | Zelle |
|---|---|---|---|
| A8 Risikoläufe (`entwurf/skizzen/folie-A8-risikolaeufe.png`), obere Tabelle, Zeile „Liegenschaftszins 3,40 % statt 2,80 %“, Spalten DSCR Minimum A · B · C · FREI | – · – · – · – | 1,43 · 1,22 · 1,18 · 1,20 (Rohwerte 1,43096 · 1,22231 · 1,17913 · 1,2). Lauf R1 hat DSCR-Werte, sie sind nur gleich wie in der Basis. SKIZZEN.md sagt „Lauf R1 führt keine DSCR“, das stimmt nicht; ZAHLEN.md führt für R1 keine DSCR-Zeile. Die Zeile „Anschlusszins 2,86 %“ zeigt dagegen unveränderte Werte, die Tabelle ist in sich uneinheitlich. | `team-2/mappe/laeufe/liegenschaftszins_plus_0_60.xlsx` · Konzepte!D71:H71 |
| A6 Kennzahlen (`entwurf/skizzen/folie-A6-kennzahlen.png`), Zeile „Objektrendite nach Zuschuss“, Spalte FREI FINANZIERT | – | 5,46 % (Rohwert 0,0545771). ZAHLEN.md (Abschnitt A6, „Objektrendite nach Zuschuss, frei“) führt 5,46 % als Wert, wie er auf der Folie steht. Laut SKIZZEN.md ist der Strich gewollt (kein Zuschuss), ZAHLEN.md passt aber nicht zur Folie. Gering. | Konzepte-Mappe · Konzepte!H88 |

### Ohne Beleg

1. Folie 29 (`entwurf/png/folie-03.png`), Umsetzung: „bis Leistungsphase 6 planen“. Die Zahl 6 steht weder in ZAHLEN.md noch in der Mappe.
2. Folie 14 und Broschüre Blatt 9, Spalte HERKUNFT: Richtlinien-Nummern RL 5.3.3, 5.2.6, 5.3.2.2, 5.3.4, 5.3.5, 5.4.4, 5.4.5, 5.4.1, 12.7.1, 12.7.2, 5.3.6; dazu Blatt 10, Kasten 10.3: „RL 5.2.6“, „RL 11.10“. Das sind Verweise, keine Mappenwerte; ZAHLEN.md belegt sie nicht.
3. Folie 29 und Folien 16/25/29, Reiter „2.1“ bzw. „Programmteil 2.1“: Bezeichnung eines Programmteils, kein Mappenwert, nicht in ZAHLEN.md.
4. Folie 24 Herstellungskosten (Bild der heutigen Folie 22): alle Zahlen außer 3.579, 4.631 und 5.460, also ARGE-Mediane 4.631/761/113/3.713/174/76/555, PGN-Werte 3.579/58/2.812/221/75/458 sowie −22,7/−49,3/−24,3/+27,0/−1,3/−17,4 %. Sie stehen absichtlich nicht in ZAHLEN.md und nicht in der Konzepte-Mappe. Gegen `praesentation/daten/markt.json` (kosten.spannen.*) nachgerechnet: alle stimmen, z. B. 3579,18 ÷ 4631,07 − 1 = −22,7 %.
