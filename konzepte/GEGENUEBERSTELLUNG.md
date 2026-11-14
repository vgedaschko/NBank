# Gegenüberstellung der drei Konzepte: Modellrechnung und Fazit-Folie

Stand 14.11.2026. Grundlage: KONZEPT.md, ABGABE.md, PRUEFUNG.md, Entwürfe und Skizzen der Teams. Zellen beziehen sich auf die
Konzepte-Mappe (`mappe/`). Alle drei Testleser hatten dieselben fünf Fragen (a Eigenkapital, b was bleibt in Jahr 1 und 35,
c Miete frei finanziert und Markt, d höchste Eigenkapitalrendite, e drei stärkste Annahmen). Die Wahl trifft der Auftraggeber.

| | Team 1 „Geldfluss“ | Team 2 „Fragen eines Investors“ | Team 3 „Vergleich“ |
|---|---|---|---|
| Leitidee | Die Miete läuft durch die Jahresrechnung, Zeilen 1 bis 9. Jede Kennzahl nennt ihre Zeilen. Erst Jahr 1, dann 35 Jahre. | Vier Fragen in der Reihenfolge des Investors: Was setze ich ein, was bleibt jedes Jahr, was gehört mir am Ende, was kann schiefgehen. | Dasselbe Haus viermal nebeneinander, eine Achse, dieselben Merkmale. Frei finanziert immer mit 18,36 € und 15,42 €. |
| Folien | Kapitel 3: 12, Fazit 28, Anhang 6 (davon 3 heutige Folien). Vortrag 29. | Kapitel 3: 13, Fazit 29, Anhang 7. Vortrag 30. | Kapitel 3: 12, Fazit 28, Anhang 6. Vortrag 29. |
| Als Entwurf gebaut | 16 Jahresrechnung, 17 Geldfluss, 28 Fazit | 16 Miete für DSCR 1,2, 25 Risiken, 29 Fazit | 16 Jahr 1 je m², 20 Rückfluss, 28 Fazit |
| Verständnistest | Fehlerzahl 0,5. b teilweise: Jahr 35 als Zahl nur für A. a, c, d, e richtig. | Fehlerzahl 0,5. c teilweise: „19,1 % über dem Markt“ als „Markt 19,1 % darunter“ gelesen (richtig 16,0 %). a, b, d, e richtig. | Fehlerzahl 0,5. b teilweise: Jahr 35 im Diagramm ohne Zahl. a, c, d, e richtig. |
| Zahlenprüfung | 980 Zahlen, 5 Abweichungen. Inhaltlich: A7 zeigt 0,0 statt −40 € (Fehlbetrag verschwindet); „wächst auf 64.860 €“, Höchstwert liegt in Jahr 34. 8 Stellen ohne Beleg, meist heutige Folien. | 1.050 Zahlen, 2 geringe Abweichungen (A8 DSCR im Lauf R1 fehlt, A6 gegen ZAHLEN.md). 4 Gruppen ohne Beleg: RL-Nummern, Leistungsphase 6, Reiter 2.1, heutige Folie 24. | 973 Zahlen, 17 Abweichungen, davon 3 falsche Aussagen: A10 „Rendite steigt“ (sie sinkt von 8,93 auf 8,25 %), Titel 21 mischt zwei Nenner, Titel A11 widerspricht Folie 24. Dazu alte Blattnummern, Rundung, Zellangaben. |
| Mappe | Block T1, nur Formeln. `pruefe_konzepte.py`: 624 OK, 0 Fehler. | Block T2 und Lauf R1 (Liegenschaftszins +0,60). Zellvergleich 0 Abweichungen. Prüfskript nicht gelaufen. | Block T3. Zellvergleich 0 Abweichungen. Prüfskript nicht gelaufen. |
| Aufwand Vortrag | Mittel bis hoch, 3 bis 4 Arbeitstage gesamt. 9 Module neu, 6 umbauen. | Mittel bis groß. Rund 15 Module, Agenda, Quellen, Zählung bis 30. | Mittel bis hoch. 9 Module neu, Fazit fertig, 4 neue Anhangmodule. |
| Aufwand Broschüre | Bogenseiten 10 bis 12 neu. Blatt 9 trägt 39 Annahmen, Satzprobe nötig. | Bogenseiten 10 bis 12 neu, dazu Verweise und InDesign-Paket. | Bogenseiten 10 bis 12 neu. Heutiges Blatt 11 „Mix und Tilgung“ entfällt, Verweise auf S. 11 in drei Blättern. |
| Aufwand Mappe | N1 bis N6 und T1 übernehmen. | N1 bis N6, T2 als N7, Lauf R1. | N1 bis N6 und T3, dazu ein kombinierter Lauf. |
| Stärken | Klarste Antwort auf „herein, hinaus, bleibt“. Stärkster Satz: frei 1,67 Mio. € Zins in 35 Jahren, gefördert 0 € (Team-1-Mappe Konzepte!H138, D138:F138). | Gliederung wie die Fragen des Auftrags. Miete für DSCR 1,2 als Rechenweg auf der Folie. Risikotabelle für alle vier mit Fehlbetrag und Rendite. Einziger Lauf zum Restwert. | Strengste Symmetrie. Kein Vorsprung frei finanziert ohne Marktmiete daneben. Je m² ist die Sprache der Branche. |
| Schwächen | 39 Annahmen, in der Broschüre 5,3 pt. A, B, C auf Folie 20 und 21 gedrängt. Zwei Risikomaße nebeneinander. Fazit „vom ersten Jahr an“, C liegt bis Jahr 3 bei DSCR 1,18. Kostenschwelle 5.150 € ohne eigenen Lauf. | Längster Vortrag. 28 Annahmen dicht. Marktzeile: 8,36 % mit vollem Darlehen (Konzepte!G81) neben „0,42 Mio. € mehr Eigenkapital“ (Team 2!C61). Fehlbetrag einmal bis Jahr 42, einmal bis 35. EK-IRR auf A6 unerklärt. Broschüre: Legenden 6,5 pt. | Meiste Fehler. Bis zehn Säulen je Grafik. 33 Annahmen in 10 bis 12 pt, unter dem Mindestmaß für Tabellen. Fazit „ohne Mietanpassung“ mischt zwei Läufe. Bilder mit Ersatzschrift gerendert. Fünfte Spalte frei 15,42 € auf jeder Folie ist eine eigene Lesart von „dieselbe Miete auf allen Folien“. |

**Gilt für alle drei.** Frei finanziert liegt bei der Eigenkapitalrendite auch zur Marktmiete vorn: 8,36 % gegen 7,40 % in C
(Konzepte!G81, F81). In den Kostenläufen löst die Mappe die Miete frei neu (23,24 und 27,09 €, Konzepte!H49 je Lauf), frei hat dort nie
einen Fehlbetrag. Der Restwert trägt 57 bis 79 % des Vermögens (Konzepte!D83:H83). C mit DSCR 1,18 (Konzepte!F62) liest sich leicht als
„nicht bankfähig“. Gebaut sind je Team nur drei Folien. Offen für den Auftraggeber: Farbe von C, weil Referenzgrau künftig frei finanziert
heißt (Gestaltung ist fest); Kopf der Fazit-Folie (alle zeigen „4 Umsetzung“); die Sperre für „DSCR“, „Rendite“ und „Marktmiete“ in
`praesentation/pruefe_folien.py` aufheben.

## Empfehlung

**Team 2 als Grundgerüst, mit zwei Übernahmen.**

1. Die Gliederung beantwortet die Fragen des Auftrags in seiner Reihenfolge. Die Titel sprechen Investoren direkt an.
2. Nur hier hat der Testleser die Liquidität in Jahr 1 und Jahr 35 vollständig beantwortet. Der Fehler bei c liegt an einer Formulierung.
3. Die saubersten Zahlen: 2 geringe Abweichungen bei 1.050 geprüften Zahlen.
4. Die schwierigsten Pflichtpunkte sind schon gebaut: Miete für DSCR 1,2 mit Rechenweg und der Antwort, für welches Darlehen die 1,2 gilt
   (Folie 16), und die Risiken aller vier Varianten (Folie 25).

Übernehmen: aus Team 1 die Folie „Geldfluss“ (1,67 Mio. € Zins) als eine Anhangfolie an Stelle der beiden Flussfolien A9 und A10, dazu
die Ergebniszeile des Fazits in zwei Hälften. Aus Team 3 die Fazit-Tabelle „Unter diesen Annahmen“, mit einem gemeinsamen Lauf für „ohne
Mietanpassung“.

Vor dem Einbau beheben: Abstand in Euro nennen (2,94 € über der Marktmiete, Konzepte!D12 minus D13) statt nur 19,1 % (Konzepte!D14). Kapitel 3 auf 12 Folien, die unveränderte
Folie Herstellungskosten geht in den Anhang. Marktzeile der Folie 25 in zwei Fälle trennen. Fehlbetrag überall für Jahr 1 bis 35 zählen.
DSCR im Lauf R1 eintragen. Block T2 mit `pruefe_konzepte.py` prüfen. Legenden der Broschüre in den Modulkopf.

Entscheidet die Folienzahl, ist Team 1 die Wahl: Kapitel 3 bleibt bei 12 Folien, Jahr 1 ist am klarsten erklärt. Dann Jahr-35-Werte auf
Folie 20, −40 € auf A7, die Annahmen der Broschüre kürzen und die Risikotabelle von Team 2 übernehmen. Team 3 empfehle ich nicht als
Grundlage: drei falsche Aussagen und die dichteste Darstellung.
