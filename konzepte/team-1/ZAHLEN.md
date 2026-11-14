# Zahlen des Konzepts von Team 1 (Geldfluss)

Jede Zahl, die in den Folien, der Broschürenskizze und im Fazit vorkommen soll. Erzeugt von `zahlen.py` aus
`konzepte/mappe/werte_konzepte.json` und `konzepte/team-1/mappe/werte_team.json`; keine Zahl ist von Hand gesetzt.

- **Wert** wie auf der Folie (gerundet, deutsches Format, Abzüge als Betrag), **Roh** wie in der Mappe.
- **Quelle**: „Konzepte-Mappe“ = `konzepte/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx`;
  „Team-1-Mappe“ = `konzepte/team-1/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team1.xlsx` (Block T1, Blatt Konzepte
  ab Zeile 108; alle übrigen Zellen gleich der Konzepte-Mappe); „Lauf …“ = Laufkopie `konzepte/mappe/laeufe/<lauf>.xlsx`.
- Reihen (Diagramme über Jahre) stehen mit Stützjahren; die ganze Reihe steht in der genannten Spalte (Jahr 1 = Zeile 7
  auf Konzepte Zeitreihe, Jahr 0 = Zeile 161 auf Konzepte der Team-1-Mappe).
- „frei (18,36 €)“ = frei finanziert mit der Miete für DSCR 1,2 (Spalte H auf Konzepte, Blatt Frei DSCR 1,2).
  In den Läufen kosten_4631 und kosten_5460 rechnet diese Spalte mit der dort neu gelösten Miete (23,24 € bzw. 27,09 €,
  je Lauf Konzepte!H49).
- Folie A10 (Herstellungskosten der PGN, heute Folie 22) bleibt unverändert; ihre Zahlen kommen wie heute aus
  `praesentation/daten/markt.json` (ARGE und PGN) und stehen nicht in der Mappe. Nur 3.579 € ist Eingaben!F11.

| Nr. | Ort | Größe | Wert | Rundung | Roh | Blatt!Zelle | Quelle |
|---|---|---|---|---|---|---|---|
| 1 | F13 Trenner | Wohnungen (Titel) | 14 | ganze Zahl | 14 | Eingaben!F9 | Konzepte-Mappe |
| 2 | F13 Trenner | Wohnfläche (Lead) | 828 | ganze Zahl | 828 | Eingaben!F8 | Konzepte-Mappe |
| 3 | F14 Finanzierung | Wohnungen | 14 | ganze Zahl | 14 | Eingaben!F9 | Konzepte-Mappe |
| 4 | F14 Finanzierung | Wohnfläche in m² | 828 | ganze Zahl | 828 | Eingaben!F8 | Konzepte-Mappe |
| 5 | F14 Finanzierung | Herstellungskosten je m² | 3.579 € | ganze € | 3579 | Eingaben!F11 | Konzepte-Mappe |
| 6 | F14 Finanzierung | Gesamtkosten (Titel, Balkenlänge), A | 3,0 Mio. € | 0,1 Mio. € | 2963412 | Konzepte!D52 | Konzepte-Mappe |
| 7 | F14 Finanzierung | Gesamtkosten (Titel, Balkenlänge), B | 3,0 Mio. € | 0,1 Mio. € | 2963412 | Konzepte!E52 | Konzepte-Mappe |
| 8 | F14 Finanzierung | Gesamtkosten (Titel, Balkenlänge), C | 3,0 Mio. € | 0,1 Mio. € | 2963412 | Konzepte!F52 | Konzepte-Mappe |
| 9 | F14 Finanzierung | Gesamtkosten (Titel, Balkenlänge), frei (18,36 €) | 3,0 Mio. € | 0,1 Mio. € | 2963412 | Konzepte!H52 | Konzepte-Mappe |
| 10 | F14 Finanzierung | Gesamtkosten in € (Stichpunkt) | 2.963.412 € | ganze € | 2963412 | Konzepte!D52 | Konzepte-Mappe |
| 11 | F14 Finanzierung | Zuschuss, A | 1,2 Mio. € | 0,1 Mio. € | 1.18536e+06 | Konzepte!D53 | Konzepte-Mappe |
| 12 | F14 Finanzierung | Zuschuss, B | 0,6 Mio. € | 0,1 Mio. € | 592682 | Konzepte!E53 | Konzepte-Mappe |
| 13 | F14 Finanzierung | Zuschuss, C | 0,3 Mio. € | 0,1 Mio. € | 296341 | Konzepte!F53 | Konzepte-Mappe |
| 14 | F14 Finanzierung | NBank-Darlehen, A | 1,2 Mio. € | 0,1 Mio. € | 1.18536e+06 | Konzepte!D54 | Konzepte-Mappe |
| 15 | F14 Finanzierung | NBank-Darlehen, B | 1,8 Mio. € | 0,1 Mio. € | 1.77805e+06 | Konzepte!E54 | Konzepte-Mappe |
| 16 | F14 Finanzierung | NBank-Darlehen, C | 2,1 Mio. € | 0,1 Mio. € | 2.07439e+06 | Konzepte!F54 | Konzepte-Mappe |
| 17 | F14 Finanzierung | Bankdarlehen, frei | 2,4 Mio. € | 0,1 Mio. € | 2.37073e+06 | Konzepte!H55 | Konzepte-Mappe |
| 18 | F14 Finanzierung | Bankdarlehen, frei, in € | 2.370.730 € | ganze € | 2.37073e+06 | Konzepte!H55 | Konzepte-Mappe |
| 19 | F14 Finanzierung | Zuschussquote A | 40 % | ganze % | 0.4 | Tabellen!D6 | Konzepte-Mappe |
| 20 | F14 Finanzierung | Darlehensquote A | 40 % | ganze % | 0.4 | Tabellen!D5 | Konzepte-Mappe |
| 21 | F14 Finanzierung | Zuschussquote B | 20 % | ganze % | 0.2 | Tabellen!E6 | Konzepte-Mappe |
| 22 | F14 Finanzierung | Darlehensquote B | 60 % | ganze % | 0.6 | Tabellen!E5 | Konzepte-Mappe |
| 23 | F14 Finanzierung | Zuschussquote C | 10 % | ganze % | 0.1 | Tabellen!F6 | Konzepte-Mappe |
| 24 | F14 Finanzierung | Darlehensquote C | 70 % | ganze % | 0.7 | Tabellen!F5 | Konzepte-Mappe |
| 25 | F14 Finanzierung | Eigenmittel, alle Varianten (Titel 0,6 Mio. €) | 0,6 Mio. € | 0,1 Mio. € | 592682 | Übersicht!D19 | Konzepte-Mappe |
| 26 | F14 Finanzierung | Eigenmittel in € | 592.682 € | ganze € | 592682 | Übersicht!D19 | Konzepte-Mappe |
| 27 | F14 Finanzierung | Eigenmittel mindestens | 20 % | ganze % | 0.2 | Tabellen!D18 | Konzepte-Mappe |
| 28 | F14 Finanzierung | Bearbeitungsentgelte einmalig, A | 20.744 € | ganze € | 20743.9 | Konzepte!D57 | Konzepte-Mappe |
| 29 | F14 Finanzierung | Bearbeitungsentgelte einmalig, B | 22.226 € | ganze € | 22225.6 | Konzepte!E57 | Konzepte-Mappe |
| 30 | F14 Finanzierung | Bearbeitungsentgelte einmalig, C | 22.966 € | ganze € | 22966.4 | Konzepte!F57 | Konzepte-Mappe |
| 31 | F14 Finanzierung | Grundstück, Ansatz | 0 € | ganze € | 0 | Eingaben!F13 | Konzepte-Mappe |
| 32 | F14 Finanzierung | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 33 | F14 Finanzierung | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 34 | F15 Annahmen | Eingabe 1.1 Bezugsjahr | 2027 | wie Mappe | 2027 | Eingaben!F7 | Konzepte-Mappe |
| 35 | F15 Annahmen | Eingabe 1.2 Wohnfläche | 828 | ganze Zahl | 828 | Eingaben!F8 | Konzepte-Mappe |
| 36 | F15 Annahmen | Eingabe 1.3 Wohnungen | 14 | ganze Zahl | 14 | Eingaben!F9 | Konzepte-Mappe |
| 37 | F15 Annahmen | Eingabe 2.1 Herstellungskosten KG 200–700 je m² Wohnfläche | 3.579 € | ganze € | 3579 | Eingaben!F11 | Konzepte-Mappe |
| 38 | F15 Annahmen | Eingabe 2.2 Finanzierungskosten KG 800 | 0 € | ganze € | 0 | Eingaben!F12 | Konzepte-Mappe |
| 39 | F15 Annahmen | Eingabe 2.3 Grundstück, Ansatz (Grundstück im Bestand) | 0 € | ganze € | 0 | Eingaben!F13 | Konzepte-Mappe |
| 40 | F15 Annahmen | Eingabe 3.1 Tilgung NBank-Darlehen, linear p. a. | 2,38 % | 0,01 % | 0.0238095 | Eingaben!F17 | Konzepte-Mappe |
| 41 | F15 Annahmen | Eingabe 3.2 Tilgungsaufschub | 0 | ganze Zahl | 0 | Eingaben!F18 | Konzepte-Mappe |
| 42 | F15 Annahmen | Eingabe 3.3 Zins NBank-Darlehen ab Jahr 36 p. a. | 3,86 % | 0,01 % | 0.0386 | Eingaben!F19 | Konzepte-Mappe |
| 43 | F15 Annahmen | Eingabe 4.1 Mietenstufe | VI | wie Mappe | VI | Eingaben!F22 | Konzepte-Mappe |
| 44 | F15 Annahmen | Eingabe 4.2 Effizienzhaus 40 erreicht | nein | wie Mappe | nein | Eingaben!F23 | Konzepte-Mappe |
| 45 | F15 Annahmen | Eingabe 4.3 Ortsübliche Vergleichsmiete Jahr 1 | 12,92 € | 0,01 € | 12.9177 | Eingaben!F24 | Konzepte-Mappe |
| 46 | F15 Annahmen | Eingabe 4.4 Marktmiete Neuvermietung Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 47 | F15 Annahmen | Eingabe 4.5 Steigerung Markt- und Vergleichsmiete p. a. (Mietanpassung frei finanziert) | 2 % | ganze % | 0.02 | Eingaben!F26 | Konzepte-Mappe |
| 48 | F15 Annahmen | Eingabe 4.6 Kappungsgrenze nach Bindungsende, in 3 Jahren | 20 % | ganze % | 0.2 | Eingaben!F27 | Konzepte-Mappe |
| 49 | F15 Annahmen | Eingabe 5.1 Mietausfall/Leerstand, Anteil der Sollmiete | 2 % | ganze % | 0.02 | Eingaben!F29 | Konzepte-Mappe |
| 50 | F15 Annahmen | Eingabe 5.2 Objektverwaltung je Wohnung | 367 € | ganze € | 367 | Eingaben!F30 | Konzepte-Mappe |
| 51 | F15 Annahmen | Eingabe 5.3 Instandhaltung je m² Wohnfläche | 14,40 € | 0,01 € | 14.4 | Eingaben!F31 | Konzepte-Mappe |
| 52 | F15 Annahmen | Eingabe 5.4 Kostensteigerung ab Jahr 2 p. a. | 2 % | ganze % | 0.02 | Eingaben!F32 | Konzepte-Mappe |
| 53 | F15 Annahmen | Eingabe 5.5 Kostensätze 2026 fortschreiben um | 0 | ganze Zahl | 0 | Eingaben!F33 | Konzepte-Mappe |
| 54 | F15 Annahmen | Eingabe 6.1 Zins Bankdarlehen p. a. | 3,86 % | 0,01 % | 0.0386 | Eingaben!F35 | Konzepte-Mappe |
| 55 | F15 Annahmen | Eingabe 6.2 Zinsbindung Bankdarlehen | 10 | ganze Zahl | 10 | Eingaben!F36 | Konzepte-Mappe |
| 56 | F15 Annahmen | Eingabe 6.3 Anschlusszins Bankdarlehen nach Jahr 10 p. a. | 3,86 % | 0,01 % | 0.0386 | Eingaben!F37 | Konzepte-Mappe |
| 57 | F15 Annahmen | Eingabe 6.4 Laufzeit Bankdarlehen (jährliche Annuität über 30 Jahre) | 30 | ganze Zahl | 30 | Eingaben!F38 | Konzepte-Mappe |
| 58 | F15 Annahmen | Eingabe 7.1 Zusätzliches Eigenkapital bar | 0 € | ganze € | 0 | Eingaben!F40 | Konzepte-Mappe |
| 59 | F15 Annahmen | Eingabe 7.2 Guthabenzins Projektkonto (VOFI) p. a. | 2 % | ganze % | 0.02 | Eingaben!F41 | Konzepte-Mappe |
| 60 | F15 Annahmen | Eingabe 7.3 Sollzins Projektkonto (VOFI) p. a. | 5 % | ganze % | 0.05 | Eingaben!F42 | Konzepte-Mappe |
| 61 | F15 Annahmen | Eingabe 8.1 Bodenwertsteigerung p. a. | 1,5 % | 0,1 % | 0.015 | Eingaben!F44 | Konzepte-Mappe |
| 62 | F15 Annahmen | Eingabe 8.2 Zielmiete nach Jahr 42 (Restwert) | Marktmiete | wie Mappe | Marktmiete | Eingaben!F45 | Konzepte-Mappe |
| 63 | F15 Annahmen | Eingabe 8.3 Veräußerungskosten, Anteil des Restwerts | 0 % | ganze % | 0 | Eingaben!F46 | Konzepte-Mappe |
| 64 | F15 Annahmen | Eingabe 9.1 Faktor Herstellungskosten (neutral 1) | 1 | ganze Zahl | 1 | Eingaben!F48 | Konzepte-Mappe |
| 65 | F15 Annahmen | Eingabe 9.2 Faktor Markt- und Vergleichsmiete (neutral 1) | 1 | ganze Zahl | 1 | Eingaben!F49 | Konzepte-Mappe |
| 66 | F15 Annahmen | Eingabe 9.3 Zuschlag Liegenschaftszins (neutral 0) | 0 | ganze Zahl | 0 | Eingaben!F50 | Konzepte-Mappe |
| 67 | F15 Annahmen | Eingabe 9.4 Faktor Gebäude-Restwert (neutral 1) | 1 | ganze Zahl | 1 | Eingaben!F51 | Konzepte-Mappe |
| 68 | F15 Annahmen | Eingabe 10.1 Miete frei finanziert (Blatt Frei finanziert) | Marktmiete | wie Mappe | Marktmiete | Eingaben!F53 | Konzepte-Mappe |
| 69 | F15 Annahmen | Eingabe 10.2 DSCR-Ziel der Mappe (Übersicht Block 8; nicht die neue Annahme) | 1 | ganze Zahl | 1 | Eingaben!F54 | Konzepte-Mappe |
| 70 | F15 Annahmen | T1 Darlehen, höchstens, Gruppe A | 40 % | ganze % | 0.4 | Tabellen!D5 | Konzepte-Mappe |
| 71 | F15 Annahmen | T1 Darlehen, höchstens, Gruppe B | 60 % | ganze % | 0.6 | Tabellen!E5 | Konzepte-Mappe |
| 72 | F15 Annahmen | T1 Darlehen, höchstens, Gruppe C | 70 % | ganze % | 0.7 | Tabellen!F5 | Konzepte-Mappe |
| 73 | F15 Annahmen | T2 Zuschuss, höchstens, Gruppe A | 40 % | ganze % | 0.4 | Tabellen!D6 | Konzepte-Mappe |
| 74 | F15 Annahmen | T2 Zuschuss, höchstens, Gruppe B | 20 % | ganze % | 0.2 | Tabellen!E6 | Konzepte-Mappe |
| 75 | F15 Annahmen | T2 Zuschuss, höchstens, Gruppe C | 10 % | ganze % | 0.1 | Tabellen!F6 | Konzepte-Mappe |
| 76 | F15 Annahmen | T8 Bemessungsgrenze Herstellungskosten, Mietenstufe VI (Stand 01.10.2026) | 5.460 € | ganze € | 5460 | Tabellen!C14 | Konzepte-Mappe |
| 77 | F15 Annahmen | T8 Höchstmiete nettokalt, Mietenstufe VI, Gruppe A | 6,80 € | 0,01 € | 6.8 | Tabellen!D14 | Konzepte-Mappe |
| 78 | F15 Annahmen | T8 Höchstmiete nettokalt, Mietenstufe VI, Gruppe B | 8,20 € | 0,01 € | 8.2 | Tabellen!E14 | Konzepte-Mappe |
| 79 | F15 Annahmen | T8 Höchstmiete nettokalt, Mietenstufe VI, Gruppe C | 9,00 € | 0,01 € | 9 | Tabellen!F14 | Konzepte-Mappe |
| 80 | F15 Annahmen | T10 Eigenmittel, mindestens, Anteil der zuwendungsfähigen Kosten | 20 % | ganze % | 0.2 | Tabellen!D18 | Konzepte-Mappe |
| 81 | F15 Annahmen | T11 Zins NBank-Darlehen bis Ende Jahr 35 | 0 % | ganze % | 0 | Tabellen!D19 | Konzepte-Mappe |
| 82 | F15 Annahmen | T12 Zinsfreie Jahre | 35 | ganze Zahl | 35 | Tabellen!D20 | Konzepte-Mappe |
| 83 | F15 Annahmen | T13 Höchstlaufzeit NBank-Darlehen, Betrachtungsende | 42 | ganze Zahl | 42 | Tabellen!D21 | Konzepte-Mappe |
| 84 | F15 Annahmen | T14 Tilgungsaufschub, höchstens | 5 | ganze Zahl | 5 | Tabellen!D22 | Konzepte-Mappe |
| 85 | F15 Annahmen | T15 Verwaltungskostenbeitrag p. a. vom Restkapital | 0,5 % | 0,1 % | 0.005 | Tabellen!D23 | Konzepte-Mappe |
| 86 | F15 Annahmen | T16 Bearbeitungsentgelt Darlehen, einmalig | 1 % | ganze % | 0.01 | Tabellen!D24 | Konzepte-Mappe |
| 87 | F15 Annahmen | T17 Bearbeitungsentgelt Zuschuss, einmalig | 0,75 % | 0,01 % | 0.0075 | Tabellen!D25 | Konzepte-Mappe |
| 88 | F15 Annahmen | T18 Belegungs- und Mietbindung | 35 | ganze Zahl | 35 | Tabellen!D26 | Konzepte-Mappe |
| 89 | F15 Annahmen | T19 Jahre ohne Mieterhöhung | 3 | ganze Zahl | 3 | Tabellen!D27 | Konzepte-Mappe |
| 90 | F15 Annahmen | T20 Mieterhöhung in der Bindung, höchstens, in 3 Jahren (Mietanpassung gefördert) | 6,15 % | 0,01 % | 0.0615 | Tabellen!D28 | Konzepte-Mappe |
| 91 | F15 Annahmen | T21 Abstand der Mieterhöhungen | 3 | ganze Zahl | 3 | Tabellen!D29 | Konzepte-Mappe |
| 92 | F15 Annahmen | T22 Zuschlag auf die Höchstmiete ab Effizienzhaus 40 | 0,30 € | 0,01 € | 0.3 | Tabellen!D30 | Konzepte-Mappe |
| 93 | F15 Annahmen | T23 Tilgung Bankdarlehen, mindestens p. a. | 1 % | ganze % | 0.01 | Tabellen!D31 | Konzepte-Mappe |
| 94 | F15 Annahmen | T25 Gesamtnutzungsdauer Mehrfamilienhaus (Restwert) | 80 | ganze Zahl | 80 | Tabellen!D33 | Konzepte-Mappe |
| 95 | F15 Annahmen | T26 Liegenschaftszins, Restnutzungsdauer 30 Jahre, Projekt 2 | 2,5 % | 0,1 % | 0.025 | Tabellen!F36 | Konzepte-Mappe |
| 96 | F15 Annahmen | T27 Liegenschaftszins, Restnutzungsdauer 38 Jahre, Projekt 2 | 2,7 % | 0,1 % | 0.027 | Tabellen!F37 | Konzepte-Mappe |
| 97 | F15 Annahmen | T28 Liegenschaftszins, Restnutzungsdauer 40 Jahre, Projekt 2 | 2,7 % | 0,1 % | 0.027 | Tabellen!F38 | Konzepte-Mappe |
| 98 | F15 Annahmen | T29 Liegenschaftszins, Restnutzungsdauer 50 Jahre, Projekt 2 | 2,9 % | 0,1 % | 0.029 | Tabellen!F39 | Konzepte-Mappe |
| 99 | F15 Annahmen | T30 Liegenschaftszins, Restnutzungsdauer 60 Jahre, Projekt 2 | 3 % | ganze % | 0.03 | Tabellen!F40 | Konzepte-Mappe |
| 100 | F15 Annahmen | T31 Liegenschaftszins, Restnutzungsdauer 70 Jahre, Projekt 2 | 3,1 % | 0,1 % | 0.031 | Tabellen!F41 | Konzepte-Mappe |
| 101 | F15 Annahmen | N1 DSCR-Ziel der Bank, frei finanziert (neu) | 1,20 | 0,01 | 1.2 | Konzepte!D6 | Konzepte-Mappe |
| 102 | F16 Jahresrechnung Jahr 1 | Miete je m² und Monat (Kopfzeile), A | 6,80 € | 0,01 € | 6.8 | Konzepte!D111 | Team-1-Mappe |
| 103 | F16 Jahresrechnung Jahr 1 | Miete je m² und Monat (Kopfzeile), B | 8,20 € | 0,01 € | 8.2 | Konzepte!E111 | Team-1-Mappe |
| 104 | F16 Jahresrechnung Jahr 1 | Miete je m² und Monat (Kopfzeile), C | 9,00 € | 0,01 € | 9 | Konzepte!F111 | Team-1-Mappe |
| 105 | F16 Jahresrechnung Jahr 1 | Miete je m² und Monat (Kopfzeile), frei (18,36 €) | 18,36 € | 0,01 € | 18.362 | Konzepte!H111 | Team-1-Mappe |
| 106 | F16 Jahresrechnung Jahr 1 | Zeile 1 Sollmiete, A | 67.565 € | ganze € | 67564.8 | Konzepte!D112 | Team-1-Mappe |
| 107 | F16 Jahresrechnung Jahr 1 | Zeile 1 Sollmiete, B | 81.475 € | ganze € | 81475.2 | Konzepte!E112 | Team-1-Mappe |
| 108 | F16 Jahresrechnung Jahr 1 | Zeile 1 Sollmiete, C | 89.424 € | ganze € | 89424 | Konzepte!F112 | Team-1-Mappe |
| 109 | F16 Jahresrechnung Jahr 1 | Zeile 1 Sollmiete, frei (18,36 €) | 182.444 € | ganze € | 182444 | Konzepte!H112 | Team-1-Mappe |
| 110 | F16 Jahresrechnung Jahr 1 | Zeile 2 Mietausfall/Leerstand, A | 1.351 € | ganze €, Betrag (Abzug) | -1351.3 | Konzepte!D113 | Team-1-Mappe |
| 111 | F16 Jahresrechnung Jahr 1 | Zeile 2 Mietausfall/Leerstand, B | 1.630 € | ganze €, Betrag (Abzug) | -1629.5 | Konzepte!E113 | Team-1-Mappe |
| 112 | F16 Jahresrechnung Jahr 1 | Zeile 2 Mietausfall/Leerstand, C | 1.788 € | ganze €, Betrag (Abzug) | -1788.48 | Konzepte!F113 | Team-1-Mappe |
| 113 | F16 Jahresrechnung Jahr 1 | Zeile 2 Mietausfall/Leerstand, frei (18,36 €) | 3.649 € | ganze €, Betrag (Abzug) | -3648.89 | Konzepte!H113 | Team-1-Mappe |
| 114 | F16 Jahresrechnung Jahr 1 | Zeile 3 Objektverwaltung, A | 5.138 € | ganze €, Betrag (Abzug) | -5138 | Konzepte!D114 | Team-1-Mappe |
| 115 | F16 Jahresrechnung Jahr 1 | Zeile 3 Objektverwaltung, B | 5.138 € | ganze €, Betrag (Abzug) | -5138 | Konzepte!E114 | Team-1-Mappe |
| 116 | F16 Jahresrechnung Jahr 1 | Zeile 3 Objektverwaltung, C | 5.138 € | ganze €, Betrag (Abzug) | -5138 | Konzepte!F114 | Team-1-Mappe |
| 117 | F16 Jahresrechnung Jahr 1 | Zeile 3 Objektverwaltung, frei (18,36 €) | 5.138 € | ganze €, Betrag (Abzug) | -5138 | Konzepte!H114 | Team-1-Mappe |
| 118 | F16 Jahresrechnung Jahr 1 | Zeile 4 Instandhaltung, A | 11.923 € | ganze €, Betrag (Abzug) | -11923.2 | Konzepte!D115 | Team-1-Mappe |
| 119 | F16 Jahresrechnung Jahr 1 | Zeile 4 Instandhaltung, B | 11.923 € | ganze €, Betrag (Abzug) | -11923.2 | Konzepte!E115 | Team-1-Mappe |
| 120 | F16 Jahresrechnung Jahr 1 | Zeile 4 Instandhaltung, C | 11.923 € | ganze €, Betrag (Abzug) | -11923.2 | Konzepte!F115 | Team-1-Mappe |
| 121 | F16 Jahresrechnung Jahr 1 | Zeile 4 Instandhaltung, frei (18,36 €) | 11.923 € | ganze €, Betrag (Abzug) | -11923.2 | Konzepte!H115 | Team-1-Mappe |
| 122 | F16 Jahresrechnung Jahr 1 | Zeile 5 Überschuss vor Kapitaldienst, A | 49.152 € | ganze € | 49152.3 | Konzepte!D116 | Team-1-Mappe |
| 123 | F16 Jahresrechnung Jahr 1 | Zeile 5 Überschuss vor Kapitaldienst, B | 62.784 € | ganze € | 62784.5 | Konzepte!E116 | Team-1-Mappe |
| 124 | F16 Jahresrechnung Jahr 1 | Zeile 5 Überschuss vor Kapitaldienst, C | 70.574 € | ganze € | 70574.3 | Konzepte!F116 | Team-1-Mappe |
| 125 | F16 Jahresrechnung Jahr 1 | Zeile 5 Überschuss vor Kapitaldienst, frei (18,36 €) | 161.734 € | ganze € | 161734 | Konzepte!H116 | Team-1-Mappe |
| 126 | F16 Jahresrechnung Jahr 1 | Zeile 6 Verwaltungskostenbeitrag, A | 5.927 € | ganze €, Betrag (Abzug) | -5926.82 | Konzepte!D117 | Team-1-Mappe |
| 127 | F16 Jahresrechnung Jahr 1 | Zeile 6 Verwaltungskostenbeitrag, B | 8.890 € | ganze €, Betrag (Abzug) | -8890.24 | Konzepte!E117 | Team-1-Mappe |
| 128 | F16 Jahresrechnung Jahr 1 | Zeile 6 Verwaltungskostenbeitrag, C | 10.372 € | ganze €, Betrag (Abzug) | -10371.9 | Konzepte!F117 | Team-1-Mappe |
| 129 | F16 Jahresrechnung Jahr 1 | Zeile 6 Verwaltungskostenbeitrag, frei (18,36 €) | 0 € | ganze €, Betrag (Abzug) | 0 | Konzepte!H117 | Team-1-Mappe |
| 130 | F16 Jahresrechnung Jahr 1 | Zeile 7 Zins, A | 0 € | ganze €, Betrag (Abzug) | 0 | Konzepte!D118 | Team-1-Mappe |
| 131 | F16 Jahresrechnung Jahr 1 | Zeile 7 Zins, B | 0 € | ganze €, Betrag (Abzug) | 0 | Konzepte!E118 | Team-1-Mappe |
| 132 | F16 Jahresrechnung Jahr 1 | Zeile 7 Zins, C | 0 € | ganze €, Betrag (Abzug) | 0 | Konzepte!F118 | Team-1-Mappe |
| 133 | F16 Jahresrechnung Jahr 1 | Zeile 7 Zins, frei (18,36 €) | 91.510 € | ganze €, Betrag (Abzug) | -91510.2 | Konzepte!H118 | Team-1-Mappe |
| 134 | F16 Jahresrechnung Jahr 1 | Zeile 8 Tilgung, A | 28.223 € | ganze €, Betrag (Abzug) | -28223 | Konzepte!D119 | Team-1-Mappe |
| 135 | F16 Jahresrechnung Jahr 1 | Zeile 8 Tilgung, B | 42.334 € | ganze €, Betrag (Abzug) | -42334.5 | Konzepte!E119 | Team-1-Mappe |
| 136 | F16 Jahresrechnung Jahr 1 | Zeile 8 Tilgung, C | 49.390 € | ganze €, Betrag (Abzug) | -49390.2 | Konzepte!F119 | Team-1-Mappe |
| 137 | F16 Jahresrechnung Jahr 1 | Zeile 8 Tilgung, frei (18,36 €) | 43.268 € | ganze €, Betrag (Abzug) | -43268.5 | Konzepte!H119 | Team-1-Mappe |
| 138 | F16 Jahresrechnung Jahr 1 | Zeile 9 Zahlungsüberschuss (Titel A), A | 15.003 € | ganze € | 15002.5 | Konzepte!D121 | Team-1-Mappe |
| 139 | F16 Jahresrechnung Jahr 1 | Zeile 9 Zahlungsüberschuss (Titel A), B | 11.560 € | ganze € | 11559.8 | Konzepte!E121 | Team-1-Mappe |
| 140 | F16 Jahresrechnung Jahr 1 | Zeile 9 Zahlungsüberschuss (Titel A), C | 10.812 € | ganze € | 10812.2 | Konzepte!F121 | Team-1-Mappe |
| 141 | F16 Jahresrechnung Jahr 1 | Zeile 9 Zahlungsüberschuss (Titel A), frei (18,36 €) | 26.956 € | ganze € | 26955.7 | Konzepte!H121 | Team-1-Mappe |
| 142 | F16 Jahresrechnung Jahr 1 | DSCR Jahr 1 (Zeile unter der Tabelle), A | 1,44 | 0,01 | 1.43931 | Konzepte!D62 | Konzepte-Mappe |
| 143 | F16 Jahresrechnung Jahr 1 | DSCR Jahr 1 (Zeile unter der Tabelle), B | 1,23 | 0,01 | 1.22567 | Konzepte!E62 | Konzepte-Mappe |
| 144 | F16 Jahresrechnung Jahr 1 | DSCR Jahr 1 (Zeile unter der Tabelle), C | 1,18 | 0,01 | 1.18092 | Konzepte!F62 | Konzepte-Mappe |
| 145 | F16 Jahresrechnung Jahr 1 | DSCR Jahr 1 (Zeile unter der Tabelle), frei (18,36 €) | 1,20 | 0,01 | 1.2 | Konzepte!H62 | Konzepte-Mappe |
| 146 | F16 Jahresrechnung Jahr 1 | Hinweiskasten: Bearbeitungsentgelte einmalig, A | 20.744 € | ganze € | 20743.9 | Konzepte!D57 | Konzepte-Mappe |
| 147 | F16 Jahresrechnung Jahr 1 | Hinweiskasten: Bearbeitungsentgelte einmalig, B | 22.226 € | ganze € | 22225.6 | Konzepte!E57 | Konzepte-Mappe |
| 148 | F16 Jahresrechnung Jahr 1 | Hinweiskasten: Bearbeitungsentgelte einmalig, C | 22.966 € | ganze € | 22966.4 | Konzepte!F57 | Konzepte-Mappe |
| 149 | F16 Jahresrechnung Jahr 1 | Tilgung NBank-Darlehen p. a. | 2,38 % | 0,01 % | 0.0238095 | Eingaben!F17 | Konzepte-Mappe |
| 150 | F16 Jahresrechnung Jahr 1 | Zins Bankdarlehen | 3,86 % | 0,01 % | 0.0386 | Eingaben!F35 | Konzepte-Mappe |
| 151 | F16 Jahresrechnung Jahr 1 | Laufzeit Bankdarlehen (jährliche Annuität über 30 Jahre) | 30 | ganze Zahl | 30 | Eingaben!F38 | Konzepte-Mappe |
| 152 | F16 Jahresrechnung Jahr 1 | Hinweiskasten: Miete für DSCR 1,2 über der Marktmiete | 19,1 % | 0,1 % | 0.190789 | Konzepte!D14 | Konzepte-Mappe |
| 153 | F16 Jahresrechnung Jahr 1 | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 154 | F16 Jahresrechnung Jahr 1 | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 155 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Sollmiete (Beschriftung am Balken), A | 67.565 € | ganze € | 67564.8 | Konzepte!D112 | Team-1-Mappe |
| 156 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Sollmiete (Beschriftung am Balken), B | 81.475 € | ganze € | 81475.2 | Konzepte!E112 | Team-1-Mappe |
| 157 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Sollmiete (Beschriftung am Balken), C | 89.424 € | ganze € | 89424 | Konzepte!F112 | Team-1-Mappe |
| 158 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Sollmiete (Beschriftung am Balken), frei (18,36 €) | 182.444 € | ganze € | 182444 | Konzepte!H112 | Team-1-Mappe |
| 159 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Bewirtschaftung, A | 27,3 % | 0,1 % | 0.272516 | Konzepte!D124 | Team-1-Mappe |
| 160 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Bewirtschaftung, B | 22,9 % | 0,1 % | 0.229404 | Konzepte!E124 | Team-1-Mappe |
| 161 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Bewirtschaftung, C | 21,1 % | 0,1 % | 0.21079 | Konzepte!F124 | Team-1-Mappe |
| 162 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Bewirtschaftung, frei (18,36 €) | 11,4 % | 0,1 % | 0.113514 | Konzepte!H124 | Team-1-Mappe |
| 163 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Verwaltungskostenbeitrag, A | 8,8 % | 0,1 % | 0.0877206 | Konzepte!D125 | Team-1-Mappe |
| 164 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Verwaltungskostenbeitrag, B | 10,9 % | 0,1 % | 0.109116 | Konzepte!E125 | Team-1-Mappe |
| 165 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Verwaltungskostenbeitrag, C | 11,6 % | 0,1 % | 0.115986 | Konzepte!F125 | Team-1-Mappe |
| 166 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Verwaltungskostenbeitrag, frei (18,36 €) | 0,0 % | 0,1 % | 0 | Konzepte!H125 | Team-1-Mappe |
| 167 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Zins, A | 0,0 % | 0,1 % | 0 | Konzepte!D126 | Team-1-Mappe |
| 168 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Zins, B | 0,0 % | 0,1 % | 0 | Konzepte!E126 | Team-1-Mappe |
| 169 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Zins, C | 0,0 % | 0,1 % | 0 | Konzepte!F126 | Team-1-Mappe |
| 170 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Zins, frei (18,36 €) | 50,2 % | 0,1 % | 0.501578 | Konzepte!H126 | Team-1-Mappe |
| 171 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Tilgung, A | 41,8 % | 0,1 % | 0.417717 | Konzepte!D127 | Team-1-Mappe |
| 172 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Tilgung, B | 52,0 % | 0,1 % | 0.519599 | Konzepte!E127 | Team-1-Mappe |
| 173 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Tilgung, C | 55,2 % | 0,1 % | 0.552315 | Konzepte!F127 | Team-1-Mappe |
| 174 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Tilgung, frei (18,36 €) | 23,7 % | 0,1 % | 0.23716 | Konzepte!H127 | Team-1-Mappe |
| 175 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Zahlungsüberschuss, A | 22,2 % | 0,1 % | 0.222046 | Konzepte!D128 | Team-1-Mappe |
| 176 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Zahlungsüberschuss, B | 14,2 % | 0,1 % | 0.141881 | Konzepte!E128 | Team-1-Mappe |
| 177 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Zahlungsüberschuss, C | 12,1 % | 0,1 % | 0.120909 | Konzepte!F128 | Team-1-Mappe |
| 178 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1: Anteil Zahlungsüberschuss, frei (18,36 €) | 14,8 % | 0,1 % | 0.147748 | Konzepte!H128 | Team-1-Mappe |
| 179 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Sollmiete, Summe (Beschriftung am Balken), A | 3,32 Mio. € | 0,01 Mio. € | 3.31927e+06 | Konzepte!D132 | Team-1-Mappe |
| 180 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Sollmiete, Summe (Beschriftung am Balken), B | 4,00 Mio. € | 0,01 Mio. € | 4.00265e+06 | Konzepte!E132 | Team-1-Mappe |
| 181 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Sollmiete, Summe (Beschriftung am Balken), C | 4,39 Mio. € | 0,01 Mio. € | 4.39315e+06 | Konzepte!F132 | Team-1-Mappe |
| 182 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Sollmiete, Summe (Beschriftung am Balken), frei (18,36 €) | 9,12 Mio. € | 0,01 Mio. € | 9.12121e+06 | Konzepte!H132 | Team-1-Mappe |
| 183 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Bewirtschaftung, A | 27,7 % | 0,1 % | 0.276974 | Konzepte!D144 | Team-1-Mappe |
| 184 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Bewirtschaftung, B | 23,3 % | 0,1 % | 0.2331 | Konzepte!E144 | Team-1-Mappe |
| 185 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Bewirtschaftung, C | 21,4 % | 0,1 % | 0.214158 | Konzepte!F144 | Team-1-Mappe |
| 186 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Bewirtschaftung, frei (18,36 €) | 11,4 % | 0,1 % | 0.113514 | Konzepte!H144 | Team-1-Mappe |
| 187 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Verwaltungskostenbeitrag, A | 3,7 % | 0,1 % | 0.0371996 | Konzepte!D145 | Team-1-Mappe |
| 188 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Verwaltungskostenbeitrag, B | 4,6 % | 0,1 % | 0.0462727 | Konzepte!E145 | Team-1-Mappe |
| 189 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Verwaltungskostenbeitrag, C | 4,9 % | 0,1 % | 0.0491861 | Konzepte!F145 | Team-1-Mappe |
| 190 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Verwaltungskostenbeitrag, frei (18,36 €) | 0,0 % | 0,1 % | 0 | Konzepte!H145 | Team-1-Mappe |
| 191 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Zins, A | 0,0 % | 0,1 % | 0 | Konzepte!D146 | Team-1-Mappe |
| 192 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Zins, B | 0,0 % | 0,1 % | 0 | Konzepte!E146 | Team-1-Mappe |
| 193 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Zins, C | 0,0 % | 0,1 % | 0 | Konzepte!F146 | Team-1-Mappe |
| 194 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Zins, frei (18,36 €) | 18,3 % | 0,1 % | 0.183378 | Konzepte!H146 | Team-1-Mappe |
| 195 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Tilgung, A | 29,8 % | 0,1 % | 0.297597 | Konzepte!D147 | Team-1-Mappe |
| 196 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Tilgung, B | 37,0 % | 0,1 % | 0.370181 | Konzepte!E147 | Team-1-Mappe |
| 197 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Tilgung, C | 39,3 % | 0,1 % | 0.393489 | Konzepte!F147 | Team-1-Mappe |
| 198 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Tilgung, frei (18,36 €) | 26,0 % | 0,1 % | 0.259914 | Konzepte!H147 | Team-1-Mappe |
| 199 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Zahlungsüberschuss, A | 38,8 % | 0,1 % | 0.38823 | Konzepte!D148 | Team-1-Mappe |
| 200 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Zahlungsüberschuss, B | 35,0 % | 0,1 % | 0.350446 | Konzepte!E148 | Team-1-Mappe |
| 201 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Zahlungsüberschuss, C | 34,3 % | 0,1 % | 0.343167 | Konzepte!F148 | Team-1-Mappe |
| 202 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Anteil Zahlungsüberschuss, frei (18,36 €) | 44,3 % | 0,1 % | 0.443194 | Konzepte!H148 | Team-1-Mappe |
| 203 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Zins, Summe (Titel frei 1,67 Mio. €, gefördert 0 €), A | 0,00 Mio. € | 0,01 Mio. €, Betrag | 0 | Konzepte!D138 | Team-1-Mappe |
| 204 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Zins, Summe (Titel frei 1,67 Mio. €, gefördert 0 €), B | 0,00 Mio. € | 0,01 Mio. €, Betrag | 0 | Konzepte!E138 | Team-1-Mappe |
| 205 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Zins, Summe (Titel frei 1,67 Mio. €, gefördert 0 €), C | 0,00 Mio. € | 0,01 Mio. €, Betrag | 0 | Konzepte!F138 | Team-1-Mappe |
| 206 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Zins, Summe (Titel frei 1,67 Mio. €, gefördert 0 €), frei (18,36 €) | 1,67 Mio. € | 0,01 Mio. €, Betrag | -1.67263e+06 | Konzepte!H138 | Team-1-Mappe |
| 207 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Tilgung, Summe (Stichpunkt), A | 0,99 Mio. € | 0,01 Mio. €, Betrag | -987804 | Konzepte!D139 | Team-1-Mappe |
| 208 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Tilgung, Summe (Stichpunkt), B | 1,48 Mio. € | 0,01 Mio. €, Betrag | -1481706 | Konzepte!E139 | Team-1-Mappe |
| 209 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Tilgung, Summe (Stichpunkt), C | 1,73 Mio. € | 0,01 Mio. €, Betrag | -1728657 | Konzepte!F139 | Team-1-Mappe |
| 210 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Tilgung, Summe (Stichpunkt), frei (18,36 €) | 2,37 Mio. € | 0,01 Mio. €, Betrag | -2.37073e+06 | Konzepte!H139 | Team-1-Mappe |
| 211 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Zahlungsüberschuss, Summe (Stichpunkt), A | 1,29 Mio. € | 0,01 Mio. € | 1.28864e+06 | Konzepte!D141 | Team-1-Mappe |
| 212 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Zahlungsüberschuss, Summe (Stichpunkt), B | 1,40 Mio. € | 0,01 Mio. € | 1.40271e+06 | Konzepte!E141 | Team-1-Mappe |
| 213 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Zahlungsüberschuss, Summe (Stichpunkt), C | 1,51 Mio. € | 0,01 Mio. € | 1.50758e+06 | Konzepte!F141 | Team-1-Mappe |
| 214 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Zahlungsüberschuss, Summe (Stichpunkt), frei (18,36 €) | 4,04 Mio. € | 0,01 Mio. € | 4.04247e+06 | Konzepte!H141 | Team-1-Mappe |
| 215 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Verwaltungskostenbeitrag, Summe (Stichpunkt), A | 0,12 Mio. € | 0,01 Mio. €, Betrag | -123476 | Konzepte!D137 | Team-1-Mappe |
| 216 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Verwaltungskostenbeitrag, Summe (Stichpunkt), B | 0,19 Mio. € | 0,01 Mio. €, Betrag | -185213 | Konzepte!E137 | Team-1-Mappe |
| 217 | F17 Geldfluss Jahr 1 und 35 Jahre | Jahr 1–35: Verwaltungskostenbeitrag, Summe (Stichpunkt), C | 0,22 Mio. € | 0,01 Mio. €, Betrag | -216082 | Konzepte!F137 | Team-1-Mappe |
| 218 | F17 Geldfluss Jahr 1 und 35 Jahre | Betrachtung 35 Jahre (Bindung) | 35 | ganze Zahl | 35 | Tabellen!D26 | Konzepte-Mappe |
| 219 | F17 Geldfluss Jahr 1 und 35 Jahre | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 220 | F17 Geldfluss Jahr 1 und 35 Jahre | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 221 | F18 Mieten Jahr 1 | Kostendeckende Anfangsmiete (Zahlungsüberschuss null), A | 5,26 € | 0,01 € | 5.25927 | Konzepte!D152 | Team-1-Mappe |
| 222 | F18 Mieten Jahr 1 | Kostendeckende Anfangsmiete (Zahlungsüberschuss null), B | 7,01 € | 0,01 € | 7.01283 | Konzepte!E152 | Team-1-Mappe |
| 223 | F18 Mieten Jahr 1 | Kostendeckende Anfangsmiete (Zahlungsüberschuss null), C | 7,89 € | 0,01 € | 7.88961 | Konzepte!F152 | Team-1-Mappe |
| 224 | F18 Mieten Jahr 1 | Kostendeckende Anfangsmiete (Zahlungsüberschuss null), frei (18,36 €) | 15,59 € | 0,01 € | 15.5937 | Konzepte!H152 | Team-1-Mappe |
| 225 | F18 Mieten Jahr 1 | Miete für DSCR 1,2, A | 5,96 € | 0,01 € | 5.96069 | Konzepte!D50 | Konzepte-Mappe |
| 226 | F18 Mieten Jahr 1 | Miete für DSCR 1,2, B | 8,06 € | 0,01 € | 8.06497 | Konzepte!E50 | Konzepte-Mappe |
| 227 | F18 Mieten Jahr 1 | Miete für DSCR 1,2, C | 9,12 € | 0,01 € | 9.1171 | Konzepte!F50 | Konzepte-Mappe |
| 228 | F18 Mieten Jahr 1 | Miete für DSCR 1,2, frei (18,36 €) | 18,36 € | 0,01 € | 18.362 | Konzepte!H50 | Konzepte-Mappe |
| 229 | F18 Mieten Jahr 1 | Angesetzte Miete (Höchstmiete bzw. Miete für DSCR 1,2), A | 6,80 € | 0,01 € | 6.8 | Konzepte!D49 | Konzepte-Mappe |
| 230 | F18 Mieten Jahr 1 | Angesetzte Miete (Höchstmiete bzw. Miete für DSCR 1,2), B | 8,20 € | 0,01 € | 8.2 | Konzepte!E49 | Konzepte-Mappe |
| 231 | F18 Mieten Jahr 1 | Angesetzte Miete (Höchstmiete bzw. Miete für DSCR 1,2), C | 9,00 € | 0,01 € | 9 | Konzepte!F49 | Konzepte-Mappe |
| 232 | F18 Mieten Jahr 1 | Angesetzte Miete (Höchstmiete bzw. Miete für DSCR 1,2), frei (18,36 €) | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 233 | F18 Mieten Jahr 1 | Marktmiete (Marke) | 15,42 € | 0,01 € | 15.42 | Konzepte!D13 | Konzepte-Mappe |
| 234 | F18 Mieten Jahr 1 | Titel: Miete für DSCR 1,2 über der Marktmiete | 2,94 € | 0,01 € | 2.94196 | Konzepte!H154 | Team-1-Mappe |
| 235 | F18 Mieten Jahr 1 | Miete für DSCR 1,2 über der Marktmiete, in % | 19,1 % | 0,1 % | 0.190789 | Konzepte!D14 | Konzepte-Mappe |
| 236 | F18 Mieten Jahr 1 | Höchstmiete minus Miete für DSCR 1,2, A | 0,84 € | 0,01 € | 0.839305 | Konzepte!D23 | Konzepte-Mappe |
| 237 | F18 Mieten Jahr 1 | Höchstmiete minus Miete für DSCR 1,2, B | 0,14 € | 0,01 € | 0.135034 | Konzepte!E23 | Konzepte-Mappe |
| 238 | F18 Mieten Jahr 1 | Höchstmiete minus Miete für DSCR 1,2, C | −0,12 € | 0,01 € | -0.117102 | Konzepte!F23 | Konzepte-Mappe |
| 239 | F18 Mieten Jahr 1 | DSCR Jahr 1 zur angesetzten Miete, A | 1,44 | 0,01 | 1.43931 | Konzepte!D62 | Konzepte-Mappe |
| 240 | F18 Mieten Jahr 1 | DSCR Jahr 1 zur angesetzten Miete, B | 1,23 | 0,01 | 1.22567 | Konzepte!E62 | Konzepte-Mappe |
| 241 | F18 Mieten Jahr 1 | DSCR Jahr 1 zur angesetzten Miete, C | 1,18 | 0,01 | 1.18092 | Konzepte!F62 | Konzepte-Mappe |
| 242 | F18 Mieten Jahr 1 | DSCR Jahr 1 zur angesetzten Miete, frei (18,36 €) | 1,20 | 0,01 | 1.2 | Konzepte!H62 | Konzepte-Mappe |
| 243 | F18 Mieten Jahr 1 | DSCR-Ziel der Bank (neue Annahme) | 1,20 | 0,01 | 1.2 | Konzepte!D6 | Konzepte-Mappe |
| 244 | F18 Mieten Jahr 1 | Hinweiskasten: Bankdarlehen, für das die 1,2 gilt | 2,37 Mio. € | 0,01 Mio. € | 2.37073e+06 | Konzepte!H55 | Konzepte-Mappe |
| 245 | F18 Mieten Jahr 1 | Hinweiskasten: Eigenmittel mindestens (NBank prüft) | 20 % | ganze % | 0.2 | Tabellen!D18 | Konzepte-Mappe |
| 246 | F18 Mieten Jahr 1 | Hinweiskasten: Bemessungsgrenze (NBank prüft) | 5.460 € | ganze € | 5460 | Tabellen!C14 | Konzepte-Mappe |
| 247 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 1, A (Reihe Jahr 1–35 im Diagramm) | 1,44 | 0,01 | 1.43931 | Konzepte Zeitreihe!H7 | Konzepte-Mappe |
| 248 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 4, A (Reihe Jahr 1–35 im Diagramm) | 1,55 | 0,01 | 1.54716 | Konzepte Zeitreihe!H10 | Konzepte-Mappe |
| 249 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 10, A (Reihe Jahr 1–35 im Diagramm) | 1,79 | 0,01 | 1.78854 | Konzepte Zeitreihe!H16 | Konzepte-Mappe |
| 250 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 20, A (Reihe Jahr 1–35 im Diagramm) | 2,22 | 0,01 | 2.22032 | Konzepte Zeitreihe!H26 | Konzepte-Mappe |
| 251 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 30, A (Reihe Jahr 1–35 im Diagramm) | 2,76 | 0,01 | 2.76141 | Konzepte Zeitreihe!H36 | Konzepte-Mappe |
| 252 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 35, A (Reihe Jahr 1–35 im Diagramm) | 3,21 | 0,01 | 3.20974 | Konzepte Zeitreihe!H41 | Konzepte-Mappe |
| 253 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 1, B (Reihe Jahr 1–35 im Diagramm) | 1,23 | 0,01 | 1.22567 | Konzepte Zeitreihe!Q7 | Konzepte-Mappe |
| 254 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 4, B (Reihe Jahr 1–35 im Diagramm) | 1,32 | 0,01 | 1.31748 | Konzepte Zeitreihe!Q10 | Konzepte-Mappe |
| 255 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 10, B (Reihe Jahr 1–35 im Diagramm) | 1,52 | 0,01 | 1.52296 | Konzepte Zeitreihe!Q16 | Konzepte-Mappe |
| 256 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 20, B (Reihe Jahr 1–35 im Diagramm) | 1,89 | 0,01 | 1.89337 | Konzepte Zeitreihe!Q26 | Konzepte-Mappe |
| 257 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 30, B (Reihe Jahr 1–35 im Diagramm) | 2,36 | 0,01 | 2.35831 | Konzepte Zeitreihe!Q36 | Konzepte-Mappe |
| 258 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 35, B (Reihe Jahr 1–35 im Diagramm) | 2,74 | 0,01 | 2.73681 | Konzepte Zeitreihe!Q41 | Konzepte-Mappe |
| 259 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 1, C (Reihe Jahr 1–35 im Diagramm) | 1,18 | 0,01 | 1.18092 | Konzepte Zeitreihe!Z7 | Konzepte-Mappe |
| 260 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 4, C (Reihe Jahr 1–35 im Diagramm) | 1,27 | 0,01 | 1.26937 | Konzepte Zeitreihe!Z10 | Konzepte-Mappe |
| 261 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 10, C (Reihe Jahr 1–35 im Diagramm) | 1,47 | 0,01 | 1.46733 | Konzepte Zeitreihe!Z16 | Konzepte-Mappe |
| 262 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 20, C (Reihe Jahr 1–35 im Diagramm) | 1,83 | 0,01 | 1.82526 | Konzepte Zeitreihe!Z26 | Konzepte-Mappe |
| 263 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 30, C (Reihe Jahr 1–35 im Diagramm) | 2,27 | 0,01 | 2.27482 | Konzepte Zeitreihe!Z36 | Konzepte-Mappe |
| 264 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 35, C (Reihe Jahr 1–35 im Diagramm) | 2,64 | 0,01 | 2.63823 | Konzepte Zeitreihe!Z41 | Konzepte-Mappe |
| 265 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 1, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 1,20 | 0,01 | 1.2 | Konzepte Zeitreihe!AR7 | Konzepte-Mappe |
| 266 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 4, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 1,27 | 0,01 | 1.27345 | Konzepte Zeitreihe!AR10 | Konzepte-Mappe |
| 267 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 10, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 1,43 | 0,01 | 1.43411 | Konzepte Zeitreihe!AR16 | Konzepte-Mappe |
| 268 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 20, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 1,75 | 0,01 | 1.74817 | Konzepte Zeitreihe!AR26 | Konzepte-Mappe |
| 269 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 30, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 2,13 | 0,01 | 2.13101 | Konzepte Zeitreihe!AR36 | Konzepte-Mappe |
| 270 | F19 DSCR Jahr 1 bis 35 | DSCR Minimum Jahr 1–35, A | 1,43 | 0,01 | 1.43096 | Konzepte!D71 | Konzepte-Mappe |
| 271 | F19 DSCR Jahr 1 bis 35 | DSCR Minimum Jahr 1–35, B | 1,22 | 0,01 | 1.22231 | Konzepte!E71 | Konzepte-Mappe |
| 272 | F19 DSCR Jahr 1 bis 35 | DSCR Minimum Jahr 1–35, C | 1,18 | 0,01 | 1.17913 | Konzepte!F71 | Konzepte-Mappe |
| 273 | F19 DSCR Jahr 1 bis 35 | DSCR Minimum Jahr 1–35, frei (18,36 €) | 1,20 | 0,01 | 1.2 | Konzepte!H71 | Konzepte-Mappe |
| 274 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 35, A | 3,21 | 0,01 | 3.20974 | Konzepte!D72 | Konzepte-Mappe |
| 275 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 35, B | 2,74 | 0,01 | 2.73681 | Konzepte!E72 | Konzepte-Mappe |
| 276 | F19 DSCR Jahr 1 bis 35 | DSCR Jahr 35, C | 2,64 | 0,01 | 2.63823 | Konzepte!F72 | Konzepte-Mappe |
| 277 | F19 DSCR Jahr 1 bis 35 | Jahre mit DSCR unter 1,2, A | 0 | ganze Zahl | 0 | Konzepte!D73 | Konzepte-Mappe |
| 278 | F19 DSCR Jahr 1 bis 35 | Jahre mit DSCR unter 1,2, B | 0 | ganze Zahl | 0 | Konzepte!E73 | Konzepte-Mappe |
| 279 | F19 DSCR Jahr 1 bis 35 | Jahre mit DSCR unter 1,2, C | 3 | ganze Zahl | 3 | Konzepte!F73 | Konzepte-Mappe |
| 280 | F19 DSCR Jahr 1 bis 35 | Jahre mit DSCR unter 1,2, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H73 | Konzepte-Mappe |
| 281 | F19 DSCR Jahr 1 bis 35 | Letztes Jahr mit DSCR unter 1,2 (0 = keins), A | 0 | ganze Zahl | 0 | Konzepte!D157 | Team-1-Mappe |
| 282 | F19 DSCR Jahr 1 bis 35 | Letztes Jahr mit DSCR unter 1,2 (0 = keins), B | 0 | ganze Zahl | 0 | Konzepte!E157 | Team-1-Mappe |
| 283 | F19 DSCR Jahr 1 bis 35 | Letztes Jahr mit DSCR unter 1,2 (0 = keins), C | 3 | ganze Zahl | 3 | Konzepte!F157 | Team-1-Mappe |
| 284 | F19 DSCR Jahr 1 bis 35 | Letztes Jahr mit DSCR unter 1,2 (0 = keins), frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H157 | Team-1-Mappe |
| 285 | F19 DSCR Jahr 1 bis 35 | Letztes Jahr mit Kapitaldienst (Darlehen getilgt), A | 42 | ganze Zahl | 42 | Konzepte!D158 | Team-1-Mappe |
| 286 | F19 DSCR Jahr 1 bis 35 | Letztes Jahr mit Kapitaldienst (Darlehen getilgt), B | 42 | ganze Zahl | 42 | Konzepte!E158 | Team-1-Mappe |
| 287 | F19 DSCR Jahr 1 bis 35 | Letztes Jahr mit Kapitaldienst (Darlehen getilgt), C | 42 | ganze Zahl | 42 | Konzepte!F158 | Team-1-Mappe |
| 288 | F19 DSCR Jahr 1 bis 35 | Letztes Jahr mit Kapitaldienst (Darlehen getilgt), frei (18,36 €) | 30 | ganze Zahl | 30 | Konzepte!H158 | Team-1-Mappe |
| 289 | F19 DSCR Jahr 1 bis 35 | Linie DSCR 1,2 | 1,20 | 0,01 | 1.2 | Konzepte!D6 | Konzepte-Mappe |
| 290 | F19 DSCR Jahr 1 bis 35 | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 291 | F19 DSCR Jahr 1 bis 35 | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 292 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 1, A (Reihe Jahr 1–35 im Diagramm) | 15.003 € | ganze € | 15002.5 | Konzepte Zeitreihe!F7 | Konzepte-Mappe |
| 293 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 4, A (Reihe Jahr 1–35 im Diagramm) | 18.454 € | ganze € | 18453.7 | Konzepte Zeitreihe!F10 | Konzepte-Mappe |
| 294 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 10, A (Reihe Jahr 1–35 im Diagramm) | 25.927 € | ganze € | 25927.1 | Konzepte Zeitreihe!F16 | Konzepte-Mappe |
| 295 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 20, A (Reihe Jahr 1–35 im Diagramm) | 38.402 € | ganze € | 38401.9 | Konzepte Zeitreihe!F26 | Konzepte-Mappe |
| 296 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 30, A (Reihe Jahr 1–35 im Diagramm) | 52.944 € | ganze € | 52943.6 | Konzepte Zeitreihe!F36 | Konzepte-Mappe |
| 297 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 31, A (Reihe Jahr 1–35 im Diagramm) | 59.447 € | ganze € | 59446.7 | Konzepte Zeitreihe!F37 | Konzepte-Mappe |
| 298 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 35, A (Reihe Jahr 1–35 im Diagramm) | 64.860 € | ganze € | 64860.1 | Konzepte Zeitreihe!F41 | Konzepte-Mappe |
| 299 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 1, B (Reihe Jahr 1–35 im Diagramm) | 11.560 € | ganze € | 11559.8 | Konzepte Zeitreihe!O7 | Konzepte-Mappe |
| 300 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 4, B (Reihe Jahr 1–35 im Diagramm) | 16.061 € | ganze € | 16061 | Konzepte Zeitreihe!O10 | Konzepte-Mappe |
| 301 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 10, B (Reihe Jahr 1–35 im Diagramm) | 25.792 € | ganze € | 25792.4 | Konzepte Zeitreihe!O16 | Konzepte-Mappe |
| 302 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 20, B (Reihe Jahr 1–35 im Diagramm) | 42.170 € | ganze € | 42169.9 | Konzepte Zeitreihe!O26 | Konzepte-Mappe |
| 303 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 30, B (Reihe Jahr 1–35 im Diagramm) | 61.241 € | ganze € | 61241.2 | Konzepte Zeitreihe!O36 | Konzepte-Mappe |
| 304 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 31, B (Reihe Jahr 1–35 im Diagramm) | 69.249 € | ganze € | 69249.4 | Konzepte Zeitreihe!O37 | Konzepte-Mappe |
| 305 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 35, B (Reihe Jahr 1–35 im Diagramm) | 76.468 € | ganze € | 76467.8 | Konzepte Zeitreihe!O41 | Konzepte-Mappe |
| 306 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 1, C (Reihe Jahr 1–35 im Diagramm) | 10.812 € | ganze € | 10812.2 | Konzepte Zeitreihe!X7 | Konzepte-Mappe |
| 307 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 4, C (Reihe Jahr 1–35 im Diagramm) | 15.898 € | ganze € | 15898.3 | Konzepte Zeitreihe!X10 | Konzepte-Mappe |
| 308 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 10, C (Reihe Jahr 1–35 im Diagramm) | 26.890 € | ganze € | 26889.7 | Konzepte Zeitreihe!X16 | Konzepte-Mappe |
| 309 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 20, C (Reihe Jahr 1–35 im Diagramm) | 45.447 € | ganze € | 45446.9 | Konzepte Zeitreihe!X26 | Konzepte-Mappe |
| 310 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 30, C (Reihe Jahr 1–35 im Diagramm) | 67.056 € | ganze € | 67056.1 | Konzepte Zeitreihe!X36 | Konzepte-Mappe |
| 311 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 31, C (Reihe Jahr 1–35 im Diagramm) | 75.919 € | ganze € | 75919.3 | Konzepte Zeitreihe!X37 | Konzepte-Mappe |
| 312 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 35, C (Reihe Jahr 1–35 im Diagramm) | 84.149 € | ganze € | 84149 | Konzepte Zeitreihe!X41 | Konzepte-Mappe |
| 313 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 1, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 26.956 € | ganze € | 26955.7 | Konzepte Zeitreihe!AP7 | Konzepte-Mappe |
| 314 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 4, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 36.855 € | ganze € | 36855.2 | Konzepte Zeitreihe!AP10 | Konzepte-Mappe |
| 315 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 10, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 58.509 € | ganze € | 58508.9 | Konzepte Zeitreihe!AP16 | Konzepte-Mappe |
| 316 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 20, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 100.838 € | ganze € | 100838 | Konzepte Zeitreihe!AP26 | Konzepte-Mappe |
| 317 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 30, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 152.437 € | ganze € | 152437 | Konzepte Zeitreihe!AP36 | Konzepte-Mappe |
| 318 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 31, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 292.959 € | ganze € | 292959 | Konzepte Zeitreihe!AP37 | Konzepte-Mappe |
| 319 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Jahr 35, frei (18,36 €) (Reihe Jahr 1–35 im Diagramm) | 317.109 € | ganze € | 317109 | Konzepte Zeitreihe!AP41 | Konzepte-Mappe |
| 320 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Minimum Jahr 1–35, A | 14.595 € | ganze € | 14595.5 | Konzepte!D65 | Konzepte-Mappe |
| 321 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Minimum Jahr 1–35, B | 11.294 € | ganze € | 11293.9 | Konzepte!E65 | Konzepte-Mappe |
| 322 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Minimum Jahr 1–35, C | 10.617 € | ganze € | 10616.8 | Konzepte!F65 | Konzepte-Mappe |
| 323 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss Minimum Jahr 1–35, frei (18,36 €) | 26.956 € | ganze € | 26955.7 | Konzepte!H65 | Konzepte-Mappe |
| 324 | F20 Zahlungsüberschuss je Jahr | Jahre mit Fehlbetrag Jahr 1–35, A | 0 | ganze Zahl | 0 | Konzepte!D68 | Konzepte-Mappe |
| 325 | F20 Zahlungsüberschuss je Jahr | Jahre mit Fehlbetrag Jahr 1–35, B | 0 | ganze Zahl | 0 | Konzepte!E68 | Konzepte-Mappe |
| 326 | F20 Zahlungsüberschuss je Jahr | Jahre mit Fehlbetrag Jahr 1–35, C | 0 | ganze Zahl | 0 | Konzepte!F68 | Konzepte-Mappe |
| 327 | F20 Zahlungsüberschuss je Jahr | Jahre mit Fehlbetrag Jahr 1–35, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H68 | Konzepte-Mappe |
| 328 | F20 Zahlungsüberschuss je Jahr | Tiefster Stand Projektkonto, A | 0 € | ganze € | 0 | Konzepte!D70 | Konzepte-Mappe |
| 329 | F20 Zahlungsüberschuss je Jahr | Tiefster Stand Projektkonto, B | 0 € | ganze € | 0 | Konzepte!E70 | Konzepte-Mappe |
| 330 | F20 Zahlungsüberschuss je Jahr | Tiefster Stand Projektkonto, C | 0 € | ganze € | 0 | Konzepte!F70 | Konzepte-Mappe |
| 331 | F20 Zahlungsüberschuss je Jahr | Tiefster Stand Projektkonto, frei (18,36 €) | 0 € | ganze € | 0 | Konzepte!H70 | Konzepte-Mappe |
| 332 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss kumuliert Ende Jahr 35, A | 1,29 Mio. € | 0,01 Mio. € | 1.28864e+06 | Konzepte!D66 | Konzepte-Mappe |
| 333 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss kumuliert Ende Jahr 35, B | 1,40 Mio. € | 0,01 Mio. € | 1.40271e+06 | Konzepte!E66 | Konzepte-Mappe |
| 334 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss kumuliert Ende Jahr 35, C | 1,51 Mio. € | 0,01 Mio. € | 1.50758e+06 | Konzepte!F66 | Konzepte-Mappe |
| 335 | F20 Zahlungsüberschuss je Jahr | Zahlungsüberschuss kumuliert Ende Jahr 35, frei (18,36 €) | 4,04 Mio. € | 0,01 Mio. € | 4.04247e+06 | Konzepte!H66 | Konzepte-Mappe |
| 336 | F20 Zahlungsüberschuss je Jahr | Stichpunkt: Mieterhöhung gefördert alle 3 Jahre | 6,15 % | 0,01 % | 0.0615 | Tabellen!D28 | Konzepte-Mappe |
| 337 | F20 Zahlungsüberschuss je Jahr | Stichpunkt: Mietanpassung frei p. a. | 2 % | ganze % | 0.02 | Eingaben!F26 | Konzepte-Mappe |
| 338 | F20 Zahlungsüberschuss je Jahr | Stichpunkt: Kostensteigerung ab Jahr 2 p. a. | 2 % | ganze % | 0.02 | Eingaben!F32 | Konzepte-Mappe |
| 339 | F20 Zahlungsüberschuss je Jahr | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 340 | F20 Zahlungsüberschuss je Jahr | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 341 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 0, A (Reihe Jahr 0–35) | −613.426 € | ganze € | -613426 | Konzepte!D161 | Team-1-Mappe |
| 342 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 5, A (Reihe Jahr 0–35) | −532.340 € | ganze € | -532340 | Konzepte!D166 | Team-1-Mappe |
| 343 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 10, A (Reihe Jahr 0–35) | −422.871 € | ganze € | -422871 | Konzepte!D171 | Team-1-Mappe |
| 344 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 13, A (Reihe Jahr 0–35) | −341.852 € | ganze € | -341852 | Konzepte!D174 | Team-1-Mappe |
| 345 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 20, A (Reihe Jahr 0–35) | −103.876 € | ganze € | -103876 | Konzepte!D181 | Team-1-Mappe |
| 346 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 22, A (Reihe Jahr 0–35) | −22.325 € | ganze € | -22324.9 | Konzepte!D183 | Team-1-Mappe |
| 347 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 23, A (Reihe Jahr 0–35) | 20.805 € | ganze € | 20804.6 | Konzepte!D184 | Team-1-Mappe |
| 348 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 35, A (Reihe Jahr 0–35) | 675.213 € | ganze € | 675213 | Konzepte!D196 | Team-1-Mappe |
| 349 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 0, B (Reihe Jahr 0–35) | −614.908 € | ganze € | -614908 | Konzepte!E161 | Team-1-Mappe |
| 350 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 5, B (Reihe Jahr 0–35) | −548.652 € | ganze € | -548652 | Konzepte!E166 | Team-1-Mappe |
| 351 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 10, B (Reihe Jahr 0–35) | −445.231 € | ganze € | -445231 | Konzepte!E171 | Team-1-Mappe |
| 352 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 13, B (Reihe Jahr 0–35) | −363.190 € | ganze € | -363190 | Konzepte!E174 | Team-1-Mappe |
| 353 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 20, B (Reihe Jahr 0–35) | −108.099 € | ganze € | -108099 | Konzepte!E181 | Team-1-Mappe |
| 354 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 22, B (Reihe Jahr 0–35) | −17.601 € | ganze € | -17600.7 | Konzepte!E183 | Team-1-Mappe |
| 355 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 23, B (Reihe Jahr 0–35) | 30.708 € | ganze € | 30707.9 | Konzepte!E184 | Team-1-Mappe |
| 356 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 35, B (Reihe Jahr 0–35) | 787.804 € | ganze € | 787804 | Konzepte!E196 | Team-1-Mappe |
| 357 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 0, C (Reihe Jahr 0–35) | −615.649 € | ganze € | -615649 | Konzepte!F161 | Team-1-Mappe |
| 358 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 5, C (Reihe Jahr 0–35) | −551.820 € | ganze € | -551820 | Konzepte!F166 | Team-1-Mappe |
| 359 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 10, C (Reihe Jahr 0–35) | −445.933 € | ganze € | -445933 | Konzepte!F171 | Team-1-Mappe |
| 360 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 13, C (Reihe Jahr 0–35) | −359.816 € | ganze € | -359816 | Konzepte!F174 | Team-1-Mappe |
| 361 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 20, C (Reihe Jahr 0–35) | −86.971 € | ganze € | -86971.2 | Konzepte!F181 | Team-1-Mappe |
| 362 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 22, C (Reihe Jahr 0–35) | 10.873 € | ganze € | 10872.6 | Konzepte!F183 | Team-1-Mappe |
| 363 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 23, C (Reihe Jahr 0–35) | 63.249 € | ganze € | 63249.3 | Konzepte!F184 | Team-1-Mappe |
| 364 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 35, C (Reihe Jahr 0–35) | 891.935 € | ganze € | 891935 | Konzepte!F196 | Team-1-Mappe |
| 365 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 0, frei (18,36 €) (Reihe Jahr 0–35) | −592.682 € | ganze € | -592682 | Konzepte!H161 | Team-1-Mappe |
| 366 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 5, frei (18,36 €) (Reihe Jahr 0–35) | −424.903 € | ganze € | -424903 | Konzepte!H166 | Team-1-Mappe |
| 367 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 10, frei (18,36 €) (Reihe Jahr 0–35) | −169.523 € | ganze € | -169523 | Konzepte!H171 | Team-1-Mappe |
| 368 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 13, frei (18,36 €) (Reihe Jahr 0–35) | 29.509 € | ganze € | 29509.4 | Konzepte!H174 | Team-1-Mappe |
| 369 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 20, frei (18,36 €) (Reihe Jahr 0–35) | 641.464 € | ganze € | 641464 | Konzepte!H181 | Team-1-Mappe |
| 370 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 22, frei (18,36 €) (Reihe Jahr 0–35) | 857.371 € | ganze € | 857371 | Konzepte!H183 | Team-1-Mappe |
| 371 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 23, frei (18,36 €) (Reihe Jahr 0–35) | 972.631 € | ganze € | 972631 | Konzepte!H184 | Team-1-Mappe |
| 372 | F21 Eigenkapital-Rückfluss | Kumuliert minus Eigenkapital, Jahr 35, frei (18,36 €) (Reihe Jahr 0–35) | 3.449.783 € | ganze € | 3.44978e+06 | Konzepte!H196 | Team-1-Mappe |
| 373 | F21 Eigenkapital-Rückfluss | Ende Jahr 35 über dem Eigenkapital, A (Tabelle, in Mio. €) | 0,68 Mio. € | 0,01 Mio. € | 675213 | Konzepte!D196 | Team-1-Mappe |
| 374 | F21 Eigenkapital-Rückfluss | Ende Jahr 35 über dem Eigenkapital, B (Tabelle, in Mio. €) | 0,79 Mio. € | 0,01 Mio. € | 787804 | Konzepte!E196 | Team-1-Mappe |
| 375 | F21 Eigenkapital-Rückfluss | Ende Jahr 35 über dem Eigenkapital, C (Tabelle, in Mio. €) | 0,89 Mio. € | 0,01 Mio. € | 891935 | Konzepte!F196 | Team-1-Mappe |
| 376 | F21 Eigenkapital-Rückfluss | Ende Jahr 35 über dem Eigenkapital, frei (18,36 €) (Tabelle, in Mio. €) | 3,45 Mio. € | 0,01 Mio. € | 3.44978e+06 | Konzepte!H196 | Team-1-Mappe |
| 377 | F21 Eigenkapital-Rückfluss | Eigenkapital bei Bezug (Startpunkt), A | 613.426 € | ganze € | 613426 | Konzepte!D56 | Konzepte-Mappe |
| 378 | F21 Eigenkapital-Rückfluss | Eigenkapital bei Bezug (Startpunkt), B | 614.908 € | ganze € | 614908 | Konzepte!E56 | Konzepte-Mappe |
| 379 | F21 Eigenkapital-Rückfluss | Eigenkapital bei Bezug (Startpunkt), C | 615.649 € | ganze € | 615649 | Konzepte!F56 | Konzepte-Mappe |
| 380 | F21 Eigenkapital-Rückfluss | Eigenkapital bei Bezug (Startpunkt), frei (18,36 €) | 592.682 € | ganze € | 592682 | Konzepte!H56 | Konzepte-Mappe |
| 381 | F21 Eigenkapital-Rückfluss | Jahr, in dem das Eigenkapital zurück ist (Titel), A | 23 | ganze Zahl | 23 | Konzepte!D67 | Konzepte-Mappe |
| 382 | F21 Eigenkapital-Rückfluss | Jahr, in dem das Eigenkapital zurück ist (Titel), B | 23 | ganze Zahl | 23 | Konzepte!E67 | Konzepte-Mappe |
| 383 | F21 Eigenkapital-Rückfluss | Jahr, in dem das Eigenkapital zurück ist (Titel), C | 22 | ganze Zahl | 22 | Konzepte!F67 | Konzepte-Mappe |
| 384 | F21 Eigenkapital-Rückfluss | Jahr, in dem das Eigenkapital zurück ist (Titel), frei (18,36 €) | 13 | ganze Zahl | 13 | Konzepte!H67 | Konzepte-Mappe |
| 385 | F21 Eigenkapital-Rückfluss | Zahlungsüberschuss kumuliert Ende Jahr 35, A | 1,29 Mio. € | 0,01 Mio. € | 1.28864e+06 | Konzepte!D66 | Konzepte-Mappe |
| 386 | F21 Eigenkapital-Rückfluss | Zahlungsüberschuss kumuliert Ende Jahr 35, B | 1,40 Mio. € | 0,01 Mio. € | 1.40271e+06 | Konzepte!E66 | Konzepte-Mappe |
| 387 | F21 Eigenkapital-Rückfluss | Zahlungsüberschuss kumuliert Ende Jahr 35, C | 1,51 Mio. € | 0,01 Mio. € | 1.50758e+06 | Konzepte!F66 | Konzepte-Mappe |
| 388 | F21 Eigenkapital-Rückfluss | Zahlungsüberschuss kumuliert Ende Jahr 35, frei (18,36 €) | 4,04 Mio. € | 0,01 Mio. € | 4.04247e+06 | Konzepte!H66 | Konzepte-Mappe |
| 389 | F21 Eigenkapital-Rückfluss | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 390 | F21 Eigenkapital-Rückfluss | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 391 | F22 Objektrendite | Überschuss vor Kapitaldienst Jahr 1 (Zähler), A | 49.152 € | ganze € | 49152.3 | Konzepte!D59 | Konzepte-Mappe |
| 392 | F22 Objektrendite | Überschuss vor Kapitaldienst Jahr 1 (Zähler), B | 62.784 € | ganze € | 62784.5 | Konzepte!E59 | Konzepte-Mappe |
| 393 | F22 Objektrendite | Überschuss vor Kapitaldienst Jahr 1 (Zähler), C | 70.574 € | ganze € | 70574.3 | Konzepte!F59 | Konzepte-Mappe |
| 394 | F22 Objektrendite | Überschuss vor Kapitaldienst Jahr 1 (Zähler), frei (18,36 €) | 161.734 € | ganze € | 161734 | Konzepte!H59 | Konzepte-Mappe |
| 395 | F22 Objektrendite | Gesamtkosten (Nenner), A | 2.963.412 € | ganze € | 2963412 | Konzepte!D52 | Konzepte-Mappe |
| 396 | F22 Objektrendite | Gesamtkosten (Nenner), B | 2.963.412 € | ganze € | 2963412 | Konzepte!E52 | Konzepte-Mappe |
| 397 | F22 Objektrendite | Gesamtkosten (Nenner), C | 2.963.412 € | ganze € | 2963412 | Konzepte!F52 | Konzepte-Mappe |
| 398 | F22 Objektrendite | Gesamtkosten (Nenner), frei (18,36 €) | 2.963.412 € | ganze € | 2963412 | Konzepte!H52 | Konzepte-Mappe |
| 399 | F22 Objektrendite | Zuschuss (Abzug im zweiten Nenner), A | 1.185.365 € | ganze € | 1.18536e+06 | Konzepte!D53 | Konzepte-Mappe |
| 400 | F22 Objektrendite | Zuschuss (Abzug im zweiten Nenner), B | 592.682 € | ganze € | 592682 | Konzepte!E53 | Konzepte-Mappe |
| 401 | F22 Objektrendite | Zuschuss (Abzug im zweiten Nenner), C | 296.341 € | ganze € | 296341 | Konzepte!F53 | Konzepte-Mappe |
| 402 | F22 Objektrendite | Objektrendite Jahr 1, Nenner Gesamtkosten (Titel gefördert), A | 1,66 % | 0,01 % | 0.0165864 | Konzepte!D87 | Konzepte-Mappe |
| 403 | F22 Objektrendite | Objektrendite Jahr 1, Nenner Gesamtkosten (Titel gefördert), B | 2,12 % | 0,01 % | 0.0211866 | Konzepte!E87 | Konzepte-Mappe |
| 404 | F22 Objektrendite | Objektrendite Jahr 1, Nenner Gesamtkosten (Titel gefördert), C | 2,38 % | 0,01 % | 0.0238152 | Konzepte!F87 | Konzepte-Mappe |
| 405 | F22 Objektrendite | Objektrendite Jahr 1, Nenner Gesamtkosten (Titel gefördert), frei (18,36 €) | 5,46 % | 0,01 % | 0.0545771 | Konzepte!H87 | Konzepte-Mappe |
| 406 | F22 Objektrendite | Objektrendite Jahr 1, Nenner Gesamtkosten minus Zuschuss, A | 2,76 % | 0,01 % | 0.027644 | Konzepte!D88 | Konzepte-Mappe |
| 407 | F22 Objektrendite | Objektrendite Jahr 1, Nenner Gesamtkosten minus Zuschuss, B | 2,65 % | 0,01 % | 0.0264832 | Konzepte!E88 | Konzepte-Mappe |
| 408 | F22 Objektrendite | Objektrendite Jahr 1, Nenner Gesamtkosten minus Zuschuss, C | 2,65 % | 0,01 % | 0.0264614 | Konzepte!F88 | Konzepte-Mappe |
| 409 | F22 Objektrendite | Objektrendite Jahr 1, Nenner Gesamtkosten minus Zuschuss, frei (18,36 €) | 5,46 % | 0,01 % | 0.0545771 | Konzepte!H88 | Konzepte-Mappe |
| 410 | F22 Objektrendite | Probe: Nettoanfangsrendite der Mappe (Zeile 139), gleich, A | 1,66 % | 0,01 % | 0.0165864 | Konzepte!D43 | Konzepte-Mappe |
| 411 | F22 Objektrendite | Probe: Nettoanfangsrendite der Mappe (Zeile 139), gleich, B | 2,12 % | 0,01 % | 0.0211866 | Konzepte!E43 | Konzepte-Mappe |
| 412 | F22 Objektrendite | Probe: Nettoanfangsrendite der Mappe (Zeile 139), gleich, C | 2,38 % | 0,01 % | 0.0238152 | Konzepte!F43 | Konzepte-Mappe |
| 413 | F22 Objektrendite | Probe: Nettoanfangsrendite der Mappe (Zeile 139), gleich, frei (18,36 €) | 5,46 % | 0,01 % | 0.0545771 | Konzepte!H43 | Konzepte-Mappe |
| 414 | F22 Objektrendite | Grund der Gleichheit: KG 800 = 0 | 0 € | ganze € | 0 | Eingaben!F12 | Konzepte-Mappe |
| 415 | F22 Objektrendite | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 416 | F22 Objektrendite | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 417 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restwert Ende Jahr 35, A | 5,15 Mio. € | 0,01 Mio. € | 5.15278e+06 | Konzepte!D76 | Konzepte-Mappe |
| 418 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restwert Ende Jahr 35, B | 5,67 Mio. € | 0,01 Mio. € | 5.67338e+06 | Konzepte!E76 | Konzepte-Mappe |
| 419 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restwert Ende Jahr 35, C | 5,90 Mio. € | 0,01 Mio. € | 5.89963e+06 | Konzepte!F76 | Konzepte-Mappe |
| 420 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restwert Ende Jahr 35, frei (18,36 €) | 6,76 Mio. € | 0,01 Mio. € | 6.7623e+06 | Konzepte!H76 | Konzepte-Mappe |
| 421 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Projektkonto Ende Jahr 35, A | 1,69 Mio. € | 0,01 Mio. € | 1.69207e+06 | Konzepte!D77 | Konzepte-Mappe |
| 422 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Projektkonto Ende Jahr 35, B | 1,81 Mio. € | 0,01 Mio. € | 1.81045e+06 | Konzepte!E77 | Konzepte-Mappe |
| 423 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Projektkonto Ende Jahr 35, C | 1,94 Mio. € | 0,01 Mio. € | 1.9353e+06 | Konzepte!F77 | Konzepte-Mappe |
| 424 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Projektkonto Ende Jahr 35, frei (18,36 €) | 5,06 Mio. € | 0,01 Mio. € | 5.06201e+06 | Konzepte!H77 | Konzepte-Mappe |
| 425 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restschuld Ende Jahr 35, A | 0,20 Mio. € | 0,01 Mio. € | 197561 | Konzepte!D75 | Konzepte-Mappe |
| 426 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restschuld Ende Jahr 35, B | 0,30 Mio. € | 0,01 Mio. € | 296341 | Konzepte!E75 | Konzepte-Mappe |
| 427 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restschuld Ende Jahr 35, C | 0,35 Mio. € | 0,01 Mio. € | 345731 | Konzepte!F75 | Konzepte-Mappe |
| 428 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restschuld Ende Jahr 35, frei (18,36 €) | 0,00 Mio. € | 0,01 Mio. € | 0 | Konzepte!H75 | Konzepte-Mappe |
| 429 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restschuld Ende Jahr 35, in €, A | 197.561 € | ganze € | 197561 | Konzepte!D75 | Konzepte-Mappe |
| 430 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restschuld Ende Jahr 35, in €, B | 296.341 € | ganze € | 296341 | Konzepte!E75 | Konzepte-Mappe |
| 431 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restschuld Ende Jahr 35, in €, C | 345.731 € | ganze € | 345731 | Konzepte!F75 | Konzepte-Mappe |
| 432 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Vermögen Ende Jahr 35, A | 6,65 Mio. € | 0,01 Mio. € | 6.64729e+06 | Konzepte!D78 | Konzepte-Mappe |
| 433 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Vermögen Ende Jahr 35, B | 7,19 Mio. € | 0,01 Mio. € | 7.18749e+06 | Konzepte!E78 | Konzepte-Mappe |
| 434 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Vermögen Ende Jahr 35, C | 7,49 Mio. € | 0,01 Mio. € | 7.4892e+06 | Konzepte!F78 | Konzepte-Mappe |
| 435 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Vermögen Ende Jahr 35, frei (18,36 €) | 11,82 Mio. € | 0,01 Mio. € | 1.18243e+07 | Konzepte!H78 | Konzepte-Mappe |
| 436 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapital bei Bezug, A | 613.426 € | ganze € | 613426 | Konzepte!D56 | Konzepte-Mappe |
| 437 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapital bei Bezug, B | 614.908 € | ganze € | 614908 | Konzepte!E56 | Konzepte-Mappe |
| 438 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapital bei Bezug, C | 615.649 € | ganze € | 615649 | Konzepte!F56 | Konzepte-Mappe |
| 439 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapital bei Bezug, frei (18,36 €) | 592.682 € | ganze € | 592682 | Konzepte!H56 | Konzepte-Mappe |
| 440 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapitalrendite mit Restwert (Titel), A | 7,05 % | 0,01 % | 0.0704541 | Konzepte!D81 | Konzepte-Mappe |
| 441 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapitalrendite mit Restwert (Titel), B | 7,28 % | 0,01 % | 0.0727725 | Konzepte!E81 | Konzepte-Mappe |
| 442 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapitalrendite mit Restwert (Titel), C | 7,40 % | 0,01 % | 0.0739967 | Konzepte!F81 | Konzepte-Mappe |
| 443 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapitalrendite mit Restwert (Titel), frei (18,36 €) | 8,93 % | 0,01 % | 0.089285 | Konzepte!H81 | Konzepte-Mappe |
| 444 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapitalrendite ohne Restwert (Titel), A | 2,58 % | 0,01 % | 0.0257691 | Konzepte!D82 | Konzepte-Mappe |
| 445 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapitalrendite ohne Restwert (Titel), B | 2,61 % | 0,01 % | 0.0260804 | Konzepte!E82 | Konzepte-Mappe |
| 446 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapitalrendite ohne Restwert (Titel), C | 2,75 % | 0,01 % | 0.0274717 | Konzepte!F82 | Konzepte-Mappe |
| 447 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Eigenkapitalrendite ohne Restwert (Titel), frei (18,36 €) | 6,32 % | 0,01 % | 0.0631984 | Konzepte!H82 | Konzepte-Mappe |
| 448 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Anteil des Restwerts am Vermögen, A | 78 % | ganze % | 0.77517 | Konzepte!D83 | Konzepte-Mappe |
| 449 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Anteil des Restwerts am Vermögen, B | 79 % | ganze % | 0.78934 | Konzepte!E83 | Konzepte-Mappe |
| 450 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Anteil des Restwerts am Vermögen, C | 79 % | ganze % | 0.787752 | Konzepte!F83 | Konzepte-Mappe |
| 451 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Anteil des Restwerts am Vermögen, frei (18,36 €) | 57 % | ganze % | 0.571898 | Konzepte!H83 | Konzepte-Mappe |
| 452 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Liegenschaftszins Restwert Jahr 35 | 2,80 % | 0,01 % | 0.028 | Übersicht!D106 | Konzepte-Mappe |
| 453 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Restwert aus Marktmiete (alle Varianten frei) | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 454 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 455 | F23 Eigenkapitalrendite und Vermögen Ende Jahr 35 | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 456 | F24 Risiken | Heute: Jahre mit Fehlbetrag, A | 0 | ganze Zahl | 0 | Konzepte!D68 | Konzepte-Mappe |
| 457 | F24 Risiken | Heute: Eigenkapitalrendite mit Restwert, A | 7,05 % | 0,01 % | 0.0704541 | Konzepte!D81 | Konzepte-Mappe |
| 458 | F24 Risiken | Heute: Jahre mit Fehlbetrag, B | 0 | ganze Zahl | 0 | Konzepte!E68 | Konzepte-Mappe |
| 459 | F24 Risiken | Heute: Eigenkapitalrendite mit Restwert, B | 7,28 % | 0,01 % | 0.0727725 | Konzepte!E81 | Konzepte-Mappe |
| 460 | F24 Risiken | Heute: Jahre mit Fehlbetrag, C | 0 | ganze Zahl | 0 | Konzepte!F68 | Konzepte-Mappe |
| 461 | F24 Risiken | Heute: Eigenkapitalrendite mit Restwert, C | 7,40 % | 0,01 % | 0.0739967 | Konzepte!F81 | Konzepte-Mappe |
| 462 | F24 Risiken | Heute: Jahre mit Fehlbetrag, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H68 | Konzepte-Mappe |
| 463 | F24 Risiken | Heute: Eigenkapitalrendite mit Restwert, frei (18,36 €) | 8,93 % | 0,01 % | 0.089285 | Konzepte!H81 | Konzepte-Mappe |
| 464 | F24 Risiken | Tilgung 2,90 %: geänderte Eingabe | 2,90 % | wie Eingabe | 0.029 | Eingaben!E17 | Lauf tilgung_2_90 (Eingabe der Laufkopie) |
| 465 | F24 Risiken | Tilgung 2,90 %: Jahre mit Fehlbetrag, A | 0 | ganze Zahl | 0 | Konzepte!D68 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 466 | F24 Risiken | Tilgung 2,90 %: Eigenkapitalrendite mit Restwert, A | 7,01 % | 0,01 % | 0.0701342 | Konzepte!D81 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 467 | F24 Risiken | Tilgung 2,90 %: Jahre mit Fehlbetrag, B | 0 | ganze Zahl | 0 | Konzepte!E68 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 468 | F24 Risiken | Tilgung 2,90 %: Eigenkapitalrendite mit Restwert, B | 7,23 % | 0,01 % | 0.0723268 | Konzepte!E81 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 469 | F24 Risiken | Tilgung 2,90 %: Jahre mit Fehlbetrag, C | 1 | ganze Zahl | 1 | Konzepte!F68 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 470 | F24 Risiken | Tilgung 2,90 %: Eigenkapitalrendite mit Restwert, C | 7,35 % | 0,01 % | 0.0734966 | Konzepte!F81 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 471 | F24 Risiken | Tilgung 2,90 %: Jahre mit Fehlbetrag, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H68 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 472 | F24 Risiken | Tilgung 2,90 %: Eigenkapitalrendite mit Restwert, frei (18,36 €) | 8,93 % | 0,01 % | 0.089285 | Konzepte!H81 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 473 | F24 Risiken | Tilgung 2,90 %: Miete frei für DSCR 1,2 (neu gelöst) | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 474 | F24 Risiken | Tilgung 3,65 %: geänderte Eingabe | 3,65 % | wie Eingabe | 0.0365 | Eingaben!E17 | Lauf tilgung_3_65 (Eingabe der Laufkopie) |
| 475 | F24 Risiken | Tilgung 3,65 %: Jahre mit Fehlbetrag, A | 3 | ganze Zahl | 3 | Konzepte!D68 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 476 | F24 Risiken | Tilgung 3,65 %: Eigenkapitalrendite mit Restwert, A | 6,97 % | 0,01 % | 0.0697459 | Konzepte!D81 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 477 | F24 Risiken | Tilgung 3,65 %: Jahre mit Fehlbetrag, B | 9 | ganze Zahl | 9 | Konzepte!E68 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 478 | F24 Risiken | Tilgung 3,65 %: Eigenkapitalrendite mit Restwert, B | 7,16 % | 0,01 % | 0.0715922 | Konzepte!E81 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 479 | F24 Risiken | Tilgung 3,65 %: Jahre mit Fehlbetrag, C | 9 | ganze Zahl | 9 | Konzepte!F68 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 480 | F24 Risiken | Tilgung 3,65 %: Eigenkapitalrendite mit Restwert, C | 7,25 % | 0,01 % | 0.0725071 | Konzepte!F81 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 481 | F24 Risiken | Tilgung 3,65 %: Jahre mit Fehlbetrag, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H68 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 482 | F24 Risiken | Tilgung 3,65 %: Eigenkapitalrendite mit Restwert, frei (18,36 €) | 8,93 % | 0,01 % | 0.089285 | Konzepte!H81 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 483 | F24 Risiken | Tilgung 3,65 %: Miete frei für DSCR 1,2 (neu gelöst) | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 484 | F24 Risiken | Herstellungskosten 4.631 €: geänderte Eingabe | 4.631 | wie Eingabe | 4631 | Eingaben!E11 | Lauf kosten_4631 (Eingabe der Laufkopie) |
| 485 | F24 Risiken | Herstellungskosten 4.631 €: Jahre mit Fehlbetrag, A | 0 | ganze Zahl | 0 | Konzepte!D68 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 486 | F24 Risiken | Herstellungskosten 4.631 €: Eigenkapitalrendite mit Restwert, A | 6,01 % | 0,01 % | 0.0600881 | Konzepte!D81 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 487 | F24 Risiken | Herstellungskosten 4.631 €: Jahre mit Fehlbetrag, B | 3 | ganze Zahl | 3 | Konzepte!E68 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 488 | F24 Risiken | Herstellungskosten 4.631 €: Eigenkapitalrendite mit Restwert, B | 6,13 % | 0,01 % | 0.0613367 | Konzepte!E81 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 489 | F24 Risiken | Herstellungskosten 4.631 €: Jahre mit Fehlbetrag, C | 6 | ganze Zahl | 6 | Konzepte!F68 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 490 | F24 Risiken | Herstellungskosten 4.631 €: Eigenkapitalrendite mit Restwert, C | 6,21 % | 0,01 % | 0.0620575 | Konzepte!F81 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 491 | F24 Risiken | Herstellungskosten 4.631 €: Jahre mit Fehlbetrag, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H68 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 492 | F24 Risiken | Herstellungskosten 4.631 €: Eigenkapitalrendite mit Restwert, frei (18,36 €) | 8,50 % | 0,01 % | 0.0849625 | Konzepte!H81 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 493 | F24 Risiken | Herstellungskosten 4.631 €: Miete frei für DSCR 1,2 (neu gelöst) | 23,24 € | 0,01 € | 23.2442 | Konzepte!H49 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 494 | F24 Risiken | Herstellungskosten 5.460 €: geänderte Eingabe | 5.460 | wie Eingabe | 5460 | Eingaben!E11 | Lauf kosten_5460 (Eingabe der Laufkopie) |
| 495 | F24 Risiken | Herstellungskosten 5.460 €: Jahre mit Fehlbetrag, A | 3 | ganze Zahl | 3 | Konzepte!D68 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 496 | F24 Risiken | Herstellungskosten 5.460 €: Eigenkapitalrendite mit Restwert, A | 5,30 % | 0,01 % | 0.0529725 | Konzepte!D81 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 497 | F24 Risiken | Herstellungskosten 5.460 €: Jahre mit Fehlbetrag, B | 12 | ganze Zahl | 12 | Konzepte!E68 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 498 | F24 Risiken | Herstellungskosten 5.460 €: Eigenkapitalrendite mit Restwert, B | 5,27 % | 0,01 % | 0.0526895 | Konzepte!E81 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 499 | F24 Risiken | Herstellungskosten 5.460 €: Jahre mit Fehlbetrag, C | 12 | ganze Zahl | 12 | Konzepte!F68 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 500 | F24 Risiken | Herstellungskosten 5.460 €: Eigenkapitalrendite mit Restwert, C | 5,25 % | 0,01 % | 0.052502 | Konzepte!F81 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 501 | F24 Risiken | Herstellungskosten 5.460 €: Jahre mit Fehlbetrag, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H68 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 502 | F24 Risiken | Herstellungskosten 5.460 €: Eigenkapitalrendite mit Restwert, frei (18,36 €) | 8,25 % | 0,01 % | 0.0824773 | Konzepte!H81 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 503 | F24 Risiken | Herstellungskosten 5.460 €: Miete frei für DSCR 1,2 (neu gelöst) | 27,09 € | 0,01 € | 27.0915 | Konzepte!H49 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 504 | F24 Risiken | keine Mieterhöhung gefördert: geänderte Eingabe | 0,00 % | wie Eingabe | 0 | Tabellen!D28 | Lauf mietanpassung_gefoerdert_0 (Eingabe der Laufkopie) |
| 505 | F24 Risiken | keine Mieterhöhung gefördert: Jahre mit Fehlbetrag, A | 0 | ganze Zahl | 0 | Konzepte!D68 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 506 | F24 Risiken | keine Mieterhöhung gefördert: Eigenkapitalrendite mit Restwert, A | 5,08 % | 0,01 % | 0.0508135 | Konzepte!D81 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 507 | F24 Risiken | keine Mieterhöhung gefördert: Jahre mit Fehlbetrag, B | 0 | ganze Zahl | 0 | Konzepte!E68 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 508 | F24 Risiken | keine Mieterhöhung gefördert: Eigenkapitalrendite mit Restwert, B | 5,37 % | 0,01 % | 0.053698 | Konzepte!E81 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 509 | F24 Risiken | keine Mieterhöhung gefördert: Jahre mit Fehlbetrag, C | 0 | ganze Zahl | 0 | Konzepte!F68 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 510 | F24 Risiken | keine Mieterhöhung gefördert: Eigenkapitalrendite mit Restwert, C | 5,54 % | 0,01 % | 0.0554307 | Konzepte!F81 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 511 | F24 Risiken | keine Mieterhöhung gefördert: Jahre mit Fehlbetrag, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H68 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 512 | F24 Risiken | keine Mieterhöhung gefördert: Eigenkapitalrendite mit Restwert, frei (18,36 €) | 8,93 % | 0,01 % | 0.089285 | Konzepte!H81 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 513 | F24 Risiken | keine Mieterhöhung gefördert: Miete frei für DSCR 1,2 (neu gelöst) | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 514 | F24 Risiken | keine Mietsteigerung frei: geänderte Eingabe | 0,00 % | wie Eingabe | 0 | Eingaben!E26 | Lauf mietsteigerung_0 (Eingabe der Laufkopie) |
| 515 | F24 Risiken | keine Mietsteigerung frei: Jahre mit Fehlbetrag, A | 0 | ganze Zahl | 0 | Konzepte!D68 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 516 | F24 Risiken | keine Mietsteigerung frei: Eigenkapitalrendite mit Restwert, A | 5,42 % | 0,01 % | 0.054179 | Konzepte!D81 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 517 | F24 Risiken | keine Mietsteigerung frei: Jahre mit Fehlbetrag, B | 0 | ganze Zahl | 0 | Konzepte!E68 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 518 | F24 Risiken | keine Mietsteigerung frei: Eigenkapitalrendite mit Restwert, B | 5,30 % | 0,01 % | 0.0529873 | Konzepte!E81 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 519 | F24 Risiken | keine Mietsteigerung frei: Jahre mit Fehlbetrag, C | 0 | ganze Zahl | 0 | Konzepte!F68 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 520 | F24 Risiken | keine Mietsteigerung frei: Eigenkapitalrendite mit Restwert, C | 5,20 % | 0,01 % | 0.0519906 | Konzepte!F81 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 521 | F24 Risiken | keine Mietsteigerung frei: Jahre mit Fehlbetrag, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H68 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 522 | F24 Risiken | keine Mietsteigerung frei: Eigenkapitalrendite mit Restwert, frei (18,36 €) | 5,81 % | 0,01 % | 0.0581256 | Konzepte!H81 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 523 | F24 Risiken | keine Mietsteigerung frei: Miete frei für DSCR 1,2 (neu gelöst) | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 524 | F24 Risiken | Anschlusszins 4,86 %: geänderte Eingabe | 4,86 % | wie Eingabe | 0.0486 | Eingaben!E37 | Lauf anschlusszins_plus_1 (Eingabe der Laufkopie) |
| 525 | F24 Risiken | Anschlusszins 4,86 %: Jahre mit Fehlbetrag, A | 0 | ganze Zahl | 0 | Konzepte!D68 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 526 | F24 Risiken | Anschlusszins 4,86 %: Eigenkapitalrendite mit Restwert, A | 7,05 % | 0,01 % | 0.0704541 | Konzepte!D81 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 527 | F24 Risiken | Anschlusszins 4,86 %: Jahre mit Fehlbetrag, B | 0 | ganze Zahl | 0 | Konzepte!E68 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 528 | F24 Risiken | Anschlusszins 4,86 %: Eigenkapitalrendite mit Restwert, B | 7,28 % | 0,01 % | 0.0727725 | Konzepte!E81 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 529 | F24 Risiken | Anschlusszins 4,86 %: Jahre mit Fehlbetrag, C | 0 | ganze Zahl | 0 | Konzepte!F68 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 530 | F24 Risiken | Anschlusszins 4,86 %: Eigenkapitalrendite mit Restwert, C | 7,40 % | 0,01 % | 0.0739967 | Konzepte!F81 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 531 | F24 Risiken | Anschlusszins 4,86 %: Jahre mit Fehlbetrag, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H68 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 532 | F24 Risiken | Anschlusszins 4,86 %: Eigenkapitalrendite mit Restwert, frei (18,36 €) | 8,84 % | 0,01 % | 0.0884061 | Konzepte!H81 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 533 | F24 Risiken | Anschlusszins 4,86 %: Miete frei für DSCR 1,2 (neu gelöst) | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 534 | F24 Risiken | Anschlusszins 2,86 %: geänderte Eingabe | 2,86 % | wie Eingabe | 0.0286 | Eingaben!E37 | Lauf anschlusszins_minus_1 (Eingabe der Laufkopie) |
| 535 | F24 Risiken | Anschlusszins 2,86 %: Jahre mit Fehlbetrag, A | 0 | ganze Zahl | 0 | Konzepte!D68 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 536 | F24 Risiken | Anschlusszins 2,86 %: Eigenkapitalrendite mit Restwert, A | 7,05 % | 0,01 % | 0.0704541 | Konzepte!D81 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 537 | F24 Risiken | Anschlusszins 2,86 %: Jahre mit Fehlbetrag, B | 0 | ganze Zahl | 0 | Konzepte!E68 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 538 | F24 Risiken | Anschlusszins 2,86 %: Eigenkapitalrendite mit Restwert, B | 7,28 % | 0,01 % | 0.0727725 | Konzepte!E81 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 539 | F24 Risiken | Anschlusszins 2,86 %: Jahre mit Fehlbetrag, C | 0 | ganze Zahl | 0 | Konzepte!F68 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 540 | F24 Risiken | Anschlusszins 2,86 %: Eigenkapitalrendite mit Restwert, C | 7,40 % | 0,01 % | 0.0739967 | Konzepte!F81 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 541 | F24 Risiken | Anschlusszins 2,86 %: Jahre mit Fehlbetrag, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H68 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 542 | F24 Risiken | Anschlusszins 2,86 %: Eigenkapitalrendite mit Restwert, frei (18,36 €) | 9,01 % | 0,01 % | 0.0901026 | Konzepte!H81 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 543 | F24 Risiken | Anschlusszins 2,86 %: Miete frei für DSCR 1,2 (neu gelöst) | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 544 | F24 Risiken | Risikozeile Marktmiete: Jahre mit Fehlbetrag, frei zur Marktmiete 15,42 € (Blatt Frei finanziert) | 1 | ganze Zahl | 1 | Konzepte!G68 | Konzepte-Mappe |
| 545 | F24 Risiken | Risikozeile Marktmiete: Eigenkapitalrendite mit Restwert, frei zur Marktmiete 15,42 € (Blatt Frei finanziert) | 8,36 % | 0,01 % | 0.0836404 | Konzepte!G81 | Konzepte-Mappe |
| 546 | F24 Risiken | Risikozeile Marktmiete: DSCR Jahr 1, frei zur Marktmiete 15,42 € (Blatt Frei finanziert) | 0,99 | 0,01 | 0.987454 | Konzepte!G62 | Konzepte-Mappe |
| 547 | F24 Risiken | Risikozeile Marktmiete: Jahre DSCR unter 1,2, frei zur Marktmiete 15,42 € (Blatt Frei finanziert) | 10 | ganze Zahl | 10 | Konzepte!G73 | Konzepte-Mappe |
| 548 | F24 Risiken | Risikozeile Marktmiete: Zahlungsüberschuss Jahr 1, frei zur Marktmiete 15,42 € (Blatt Frei finanziert) | −1.691 € | ganze € | -1690.97 | Konzepte!G61 | Konzepte-Mappe |
| 549 | F24 Risiken | Risikozeile Marktmiete: tiefster Stand Projektkonto, frei zur Marktmiete 15,42 € (Blatt Frei finanziert) | −1.691 € | ganze € | -1690.97 | Konzepte!G70 | Konzepte-Mappe |
| 550 | F24 Risiken | Hinweiskasten: ohne Mietsteigerung Jahre DSCR unter 1,2, frei | 29 | ganze Zahl | 29 | Konzepte!H73 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 551 | F24 Risiken | Hinweiskasten: ohne Mietsteigerung DSCR Minimum, frei | 1,10 | 0,01 | 1.10179 | Konzepte!H71 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 552 | F24 Risiken | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 553 | F24 Risiken | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 554 | F28 Fazit | 1 Ausgangslage: Kapitaldienst Bankdarlehen Jahr 1 | 134.779 € | ganze € | 134779 | Konzepte!D10 | Konzepte-Mappe |
| 555 | F28 Fazit | 1 Ausgangslage: Zins Bankdarlehen | 3,86 % | 0,01 % | 0.0386 | Eingaben!F35 | Konzepte-Mappe |
| 556 | F28 Fazit | 1 Ausgangslage: Miete für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H50 | Konzepte-Mappe |
| 557 | F28 Fazit | 1 Ausgangslage: Marktmiete | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 558 | F28 Fazit | 1 Ausgangslage: Aufschlag auf die Marktmiete | 19 % | ganze % | 0.190789 | Konzepte!D14 | Konzepte-Mappe |
| 559 | F28 Fazit | 2 Programmteil 2.1: Förderung (Darlehen + Zuschuss) | 2,4 Mio. € | 0,1 Mio. € | 2.37073e+06 | Übersicht!D15 | Konzepte-Mappe |
| 560 | F28 Fazit | 2 Programmteil 2.1: Zuschuss bis | 40 % | ganze % | 0.4 | Tabellen!D6 | Konzepte-Mappe |
| 561 | F28 Fazit | 2 Programmteil 2.1: Darlehen A (Kennzahl 80 % = Darlehen + Zuschuss, Tabellen!D5 + D6) | 40 % | ganze % | 0.4 | Tabellen!D5 | Konzepte-Mappe |
| 562 | F28 Fazit | 2 Programmteil 2.1: Gesamtkosten (Label „von 3,0 Mio. €“) | 3,0 Mio. € | 0,1 Mio. € | 2963412 | Konzepte!D52 | Konzepte-Mappe |
| 563 | F28 Fazit | 2 Programmteil 2.1: zinsfreie Jahre | 35 | ganze Zahl | 35 | Tabellen!D20 | Konzepte-Mappe |
| 564 | F28 Fazit | 2 Programmteil 2.1: Höchstmiete Mietenstufe VI, A | 6,80 € | 0,01 € | 6.8 | Tabellen!D14 | Konzepte-Mappe |
| 565 | F28 Fazit | 2 Programmteil 2.1: Höchstmiete Mietenstufe VI, B | 8,20 € | 0,01 € | 8.2 | Tabellen!E14 | Konzepte-Mappe |
| 566 | F28 Fazit | 2 Programmteil 2.1: Höchstmiete Mietenstufe VI, C | 9,00 € | 0,01 € | 9 | Tabellen!F14 | Konzepte-Mappe |
| 567 | F28 Fazit | 3 Modellrechnung: Kapitaldienst Jahr 1, A | 34.150 € | ganze € | 34149.8 | Konzepte!D60 | Konzepte-Mappe |
| 568 | F28 Fazit | 3 Modellrechnung: Kapitaldienst Jahr 1, frei | 134.779 € | ganze € | 134779 | Konzepte!H60 | Konzepte-Mappe |
| 569 | F28 Fazit | 3 Modellrechnung: Zahlungsüberschuss Jahr 1, A | 15.003 € | ganze € | 15002.5 | Konzepte!D61 | Konzepte-Mappe |
| 570 | F28 Fazit | 3 Modellrechnung: Zahlungsüberschuss Jahr 1, B | 11.560 € | ganze € | 11559.8 | Konzepte!E61 | Konzepte-Mappe |
| 571 | F28 Fazit | 3 Modellrechnung: Zahlungsüberschuss Jahr 1, C | 10.812 € | ganze € | 10812.2 | Konzepte!F61 | Konzepte-Mappe |
| 572 | F28 Fazit | 3 Modellrechnung: Jahre mit Fehlbetrag, A | 0 | ganze Zahl | 0 | Konzepte!D68 | Konzepte-Mappe |
| 573 | F28 Fazit | 3 Modellrechnung: Jahre mit Fehlbetrag, B | 0 | ganze Zahl | 0 | Konzepte!E68 | Konzepte-Mappe |
| 574 | F28 Fazit | 3 Modellrechnung: Jahre mit Fehlbetrag, C | 0 | ganze Zahl | 0 | Konzepte!F68 | Konzepte-Mappe |
| 575 | F28 Fazit | 3 Modellrechnung: Eigenkapital zurück in Jahr, A | 23 | ganze Zahl | 23 | Konzepte!D67 | Konzepte-Mappe |
| 576 | F28 Fazit | 3 Modellrechnung: Eigenkapital zurück in Jahr, B | 23 | ganze Zahl | 23 | Konzepte!E67 | Konzepte-Mappe |
| 577 | F28 Fazit | 3 Modellrechnung: Eigenkapital zurück in Jahr, C | 22 | ganze Zahl | 22 | Konzepte!F67 | Konzepte-Mappe |
| 578 | F28 Fazit | 3 Modellrechnung: Eigenkapitalrendite mit Restwert, A | 7,05 % | 0,01 % | 0.0704541 | Konzepte!D81 | Konzepte-Mappe |
| 579 | F28 Fazit | 3 Modellrechnung: Eigenkapitalrendite mit Restwert, C | 7,40 % | 0,01 % | 0.0739967 | Konzepte!F81 | Konzepte-Mappe |
| 580 | F28 Fazit | 3 Modellrechnung: Eigenkapitalrendite ohne Restwert, A | 2,58 % | 0,01 % | 0.0257691 | Konzepte!D82 | Konzepte-Mappe |
| 581 | F28 Fazit | 3 Modellrechnung: Eigenkapitalrendite ohne Restwert, C | 2,75 % | 0,01 % | 0.0274717 | Konzepte!F82 | Konzepte-Mappe |
| 582 | F28 Fazit | 4 Umsetzung: Eigenmittel mindestens | 592.682 € | ganze € | 592682 | Übersicht!D19 | Konzepte-Mappe |
| 583 | F28 Fazit | 4 Umsetzung: Bearbeitungsentgelte A einmalig | 20.744 € | ganze € | 20743.9 | Konzepte!D57 | Konzepte-Mappe |
| 584 | F28 Fazit | 4 Umsetzung: Bemessungsgrenze | 5.460 € | ganze € | 5460 | Tabellen!C14 | Konzepte-Mappe |
| 585 | F28 Fazit | Ergebniszeile: Eigenkapitalrendite mit Restwert, frei, frei (18,36 €) | 8,93 % | 0,01 % | 0.089285 | Konzepte!H81 | Konzepte-Mappe |
| 586 | F28 Fazit | Ergebniszeile: frei ohne Mietsteigerung, Eigenkapitalrendite | 5,81 % | 0,01 % | 0.0581256 | Konzepte!H81 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 587 | F28 Fazit | Ergebniszeile: gefördert ohne Mieterhöhung, Eigenkapitalrendite, A | 5,08 % | 0,01 % | 0.0508135 | Konzepte!D81 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 588 | F28 Fazit | Ergebniszeile: gefördert ohne Mieterhöhung, Eigenkapitalrendite, B | 5,37 % | 0,01 % | 0.053698 | Konzepte!E81 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 589 | F28 Fazit | Ergebniszeile: gefördert ohne Mieterhöhung, Eigenkapitalrendite, C | 5,54 % | 0,01 % | 0.0554307 | Konzepte!F81 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 590 | F28 Fazit | 4 Umsetzung: Herstellungskosten, bis zu denen A sich trägt | rund 5.150 € | auf 50 € gerundet | 5151.31 | Konzepte!D155 | Team-1-Mappe |
| 591 | F28 Fazit | 4 Umsetzung: Herstellungskosten Modellhaus | 3.579 € | ganze € | 3579 | Eingaben!F11 | Konzepte-Mappe |
| 592 | F28 Fazit | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 593 | F28 Fazit | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 594 | A6 Rechenweg Miete für DSCR 1,2 | DSCR-Ziel | 1,20 | 0,01 | 1.2 | Konzepte!D6 | Konzepte-Mappe |
| 595 | A6 Rechenweg Miete für DSCR 1,2 | Kapitaldienst Jahr 1, A | 34.150 € | ganze € | 34149.8 | Konzepte!D60 | Konzepte-Mappe |
| 596 | A6 Rechenweg Miete für DSCR 1,2 | Kapitaldienst Jahr 1, B | 51.225 € | ganze € | 51224.7 | Konzepte!E60 | Konzepte-Mappe |
| 597 | A6 Rechenweg Miete für DSCR 1,2 | Kapitaldienst Jahr 1, C | 59.762 € | ganze € | 59762.1 | Konzepte!F60 | Konzepte-Mappe |
| 598 | A6 Rechenweg Miete für DSCR 1,2 | Kapitaldienst Jahr 1, frei (18,36 €) | 134.779 € | ganze € | 134779 | Konzepte!H60 | Konzepte-Mappe |
| 599 | A6 Rechenweg Miete für DSCR 1,2 | Objektverwaltung + Instandhaltung Jahr 1 (alle Varianten gleich) | 17.061 € | ganze € | 17061.2 | Konzepte!D11 | Konzepte-Mappe |
| 600 | A6 Rechenweg Miete für DSCR 1,2 | Mietausfall | 2 % | ganze % | 0.02 | Eingaben!F29 | Konzepte-Mappe |
| 601 | A6 Rechenweg Miete für DSCR 1,2 | Wohnfläche | 828 | ganze Zahl | 828 | Eingaben!F8 | Konzepte-Mappe |
| 602 | A6 Rechenweg Miete für DSCR 1,2 | Ergebnis: Miete für DSCR 1,2, A | 5,96 € | 0,01 € | 5.96069 | Konzepte!D50 | Konzepte-Mappe |
| 603 | A6 Rechenweg Miete für DSCR 1,2 | Ergebnis: Miete für DSCR 1,2, B | 8,06 € | 0,01 € | 8.06497 | Konzepte!E50 | Konzepte-Mappe |
| 604 | A6 Rechenweg Miete für DSCR 1,2 | Ergebnis: Miete für DSCR 1,2, C | 9,12 € | 0,01 € | 9.1171 | Konzepte!F50 | Konzepte-Mappe |
| 605 | A6 Rechenweg Miete für DSCR 1,2 | Ergebnis: Miete für DSCR 1,2, frei (18,36 €) | 18,36 € | 0,01 € | 18.362 | Konzepte!H50 | Konzepte-Mappe |
| 606 | A6 Rechenweg Miete für DSCR 1,2 | Gegenprobe DSCR zur Miete für DSCR 1,2, A | 1,20 | 0,01 | 1.2 | Konzepte!D27 | Konzepte-Mappe |
| 607 | A6 Rechenweg Miete für DSCR 1,2 | Gegenprobe DSCR zur Miete für DSCR 1,2, B | 1,20 | 0,01 | 1.2 | Konzepte!E27 | Konzepte-Mappe |
| 608 | A6 Rechenweg Miete für DSCR 1,2 | Gegenprobe DSCR zur Miete für DSCR 1,2, C | 1,20 | 0,01 | 1.2 | Konzepte!F27 | Konzepte-Mappe |
| 609 | A6 Rechenweg Miete für DSCR 1,2 | Gegenprobe DSCR frei | 1,20 | 0,01 | 1.2 | Konzepte!D15 | Konzepte-Mappe |
| 610 | A6 Rechenweg Miete für DSCR 1,2 | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 611 | A6 Rechenweg Miete für DSCR 1,2 | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 612 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Zahlungsüberschuss Jahr 1, A | 8.850 € | ganze € | 8849.9 | Konzepte!D61 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 613 | A7 Risiken im Einzelnen | Tilgung 2,90 %: DSCR Minimum, A | 1,21 | 0,01 | 1.21283 | Konzepte!D71 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 614 | A7 Risiken im Einzelnen | Tilgung 2,90 %: tiefster Stand Projektkonto, A | 0 € | ganze € | 0 | Konzepte!D70 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 615 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Eigenkapitalrendite ohne Restwert, A | 2,44 % | 0,01 % | 0.0243808 | Konzepte!D82 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 616 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Jahre DSCR unter 1,2, A | 0 | ganze Zahl | 0 | Konzepte!D73 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 617 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Zahlungsüberschuss Jahr 1, B | 2.331 € | ganze € | 2330.89 | Konzepte!E61 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 618 | A7 Risiken im Einzelnen | Tilgung 2,90 %: DSCR Minimum, B | 1,04 | 0,01 | 1.03599 | Konzepte!E71 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 619 | A7 Risiken im Einzelnen | Tilgung 2,90 %: tiefster Stand Projektkonto, B | 0 € | ganze € | 0 | Konzepte!E70 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 620 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Eigenkapitalrendite ohne Restwert, B | 2,40 % | 0,01 % | 0.0240007 | Konzepte!E82 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 621 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Jahre DSCR unter 1,2, B | 8 | ganze Zahl | 8 | Konzepte!E73 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 622 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Zahlungsüberschuss Jahr 1, C | 45 € | ganze € | 45.1144 | Konzepte!F61 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 623 | A7 Risiken im Einzelnen | Tilgung 2,90 %: DSCR Minimum, C | 1,00 | 0,01 | 0.999391 | Konzepte!F71 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 624 | A7 Risiken im Einzelnen | Tilgung 2,90 %: tiefster Stand Projektkonto, C | 0 € | ganze € | 0 | Konzepte!F70 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 625 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Eigenkapitalrendite ohne Restwert, C | 2,51 % | 0,01 % | 0.0251484 | Konzepte!F82 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 626 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Jahre DSCR unter 1,2, C | 9 | ganze Zahl | 9 | Konzepte!F73 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 627 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Zahlungsüberschuss Jahr 1, frei (18,36 €) | 26.956 € | ganze € | 26955.7 | Konzepte!H61 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 628 | A7 Risiken im Einzelnen | Tilgung 2,90 %: DSCR Minimum, frei (18,36 €) | 1,20 | 0,01 | 1.2 | Konzepte!H71 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 629 | A7 Risiken im Einzelnen | Tilgung 2,90 %: tiefster Stand Projektkonto, frei (18,36 €) | 0 € | ganze € | 0 | Konzepte!H70 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 630 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Eigenkapitalrendite ohne Restwert, frei (18,36 €) | 6,32 % | 0,01 % | 0.0631984 | Konzepte!H82 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 631 | A7 Risiken im Einzelnen | Tilgung 2,90 %: Jahre DSCR unter 1,2, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H73 | Lauf tilgung_2_90 (laeufe/tilgung_2_90.xlsx) |
| 632 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Zahlungsüberschuss Jahr 1, A | −40 € | ganze € | -40.3352 | Konzepte!D61 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 633 | A7 Risiken im Einzelnen | Tilgung 3,65 %: DSCR Minimum, A | 0,99 | 0,01 | 0.99391 | Konzepte!D71 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 634 | A7 Risiken im Einzelnen | Tilgung 3,65 %: tiefster Stand Projektkonto, A | −515 € | ganze € | -514.911 | Konzepte!D70 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 635 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Eigenkapitalrendite ohne Restwert, A | 2,26 % | 0,01 % | 0.0226258 | Konzepte!D82 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 636 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Jahre DSCR unter 1,2, A | 9 | ganze Zahl | 9 | Konzepte!D73 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 637 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Zahlungsüberschuss Jahr 1, B | −11.004 € | ganze € | -11004.5 | Konzepte!E61 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 638 | A7 Risiken im Einzelnen | Tilgung 3,65 %: DSCR Minimum, B | 0,85 | 0,01 | 0.848992 | Konzepte!E71 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 639 | A7 Risiken im Einzelnen | Tilgung 3,65 %: tiefster Stand Projektkonto, B | −72.823 € | ganze € | -72823.2 | Konzepte!E70 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 640 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Eigenkapitalrendite ohne Restwert, B | 2,03 % | 0,01 % | 0.0202996 | Konzepte!E82 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 641 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Jahre DSCR unter 1,2, B | 15 | ganze Zahl | 15 | Konzepte!E73 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 642 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Zahlungsüberschuss Jahr 1, C | −15.513 € | ganze € | -15512.8 | Konzepte!F61 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 643 | A7 Risiken im Einzelnen | Tilgung 3,65 %: DSCR Minimum, C | 0,82 | 0,01 | 0.818998 | Konzepte!F71 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 644 | A7 Risiken im Einzelnen | Tilgung 3,65 %: tiefster Stand Projektkonto, C | −128.266 € | ganze € | -128266 | Konzepte!F70 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 645 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Eigenkapitalrendite ohne Restwert, C | 2,01 % | 0,01 % | 0.0200766 | Konzepte!F82 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 646 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Jahre DSCR unter 1,2, C | 18 | ganze Zahl | 18 | Konzepte!F73 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 647 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Zahlungsüberschuss Jahr 1, frei (18,36 €) | 26.956 € | ganze € | 26955.7 | Konzepte!H61 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 648 | A7 Risiken im Einzelnen | Tilgung 3,65 %: DSCR Minimum, frei (18,36 €) | 1,20 | 0,01 | 1.2 | Konzepte!H71 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 649 | A7 Risiken im Einzelnen | Tilgung 3,65 %: tiefster Stand Projektkonto, frei (18,36 €) | 0 € | ganze € | 0 | Konzepte!H70 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 650 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Eigenkapitalrendite ohne Restwert, frei (18,36 €) | 6,32 % | 0,01 % | 0.0631984 | Konzepte!H82 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 651 | A7 Risiken im Einzelnen | Tilgung 3,65 %: Jahre DSCR unter 1,2, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H73 | Lauf tilgung_3_65 (laeufe/tilgung_3_65.xlsx) |
| 652 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Zahlungsüberschuss Jahr 1, A | 4.965 € | ganze € | 4964.63 | Konzepte!D61 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 653 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: DSCR Minimum, A | 1,11 | 0,01 | 1.10589 | Konzepte!D71 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 654 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: tiefster Stand Projektkonto, A | 0 € | ganze € | 0 | Konzepte!D70 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 655 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Eigenkapitalrendite ohne Restwert, A | 0,56 % | 0,01 % | 0.00561864 | Konzepte!D82 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 656 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Jahre DSCR unter 1,2, A | 6 | ganze Zahl | 6 | Konzepte!D73 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 657 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Zahlungsüberschuss Jahr 1, B | −3.497 € | ganze € | -3497.02 | Konzepte!E61 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 658 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: DSCR Minimum, B | 0,94 | 0,01 | 0.944648 | Konzepte!E71 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 659 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: tiefster Stand Projektkonto, B | −11.237 € | ganze € | -11236.6 | Konzepte!E70 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 660 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Eigenkapitalrendite ohne Restwert, B | −0,29 % | 0,01 % | -0.00293553 | Konzepte!E82 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 661 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Jahre DSCR unter 1,2, B | 12 | ganze Zahl | 12 | Konzepte!E73 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 662 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Zahlungsüberschuss Jahr 1, C | −6.754 € | ganze € | -6754.12 | Konzepte!F61 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 663 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: DSCR Minimum, C | 0,91 | 0,01 | 0.911274 | Konzepte!F71 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 664 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: tiefster Stand Projektkonto, C | −29.442 € | ganze € | -29441.9 | Konzepte!F70 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 665 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Eigenkapitalrendite ohne Restwert, C | −0,57 % | 0,01 % | -0.00565638 | Konzepte!F82 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 666 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Jahre DSCR unter 1,2, C | 12 | ganze Zahl | 12 | Konzepte!F73 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 667 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Zahlungsüberschuss Jahr 1, frei (18,36 €) | 34.879 € | ganze € | 34879 | Konzepte!H61 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 668 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: DSCR Minimum, frei (18,36 €) | 1,20 | 0,01 | 1.2 | Konzepte!H71 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 669 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: tiefster Stand Projektkonto, frei (18,36 €) | 0 € | ganze € | 0 | Konzepte!H70 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 670 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Eigenkapitalrendite ohne Restwert, frei (18,36 €) | 6,32 % | 0,01 % | 0.0631984 | Konzepte!H82 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 671 | A7 Risiken im Einzelnen | Herstellungskosten 4.631 €: Jahre DSCR unter 1,2, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H73 | Lauf kosten_4631 (laeufe/kosten_4631.xlsx) |
| 672 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Zahlungsüberschuss Jahr 1, A | −2.945 € | ganze € | -2945.46 | Konzepte!D61 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 673 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: DSCR Minimum, A | 0,94 | 0,01 | 0.937984 | Konzepte!D71 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 674 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: tiefster Stand Projektkonto, A | −9.677 € | ganze € | -9676.5 | Konzepte!D70 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 675 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Eigenkapitalrendite ohne Restwert, A | −1,53 % | 0,01 % | -0.0152711 | Konzepte!D82 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 676 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Jahre DSCR unter 1,2, A | 12 | ganze Zahl | 12 | Konzepte!D73 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 677 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Zahlungsüberschuss Jahr 1, B | −15.362 € | ganze € | -15362.1 | Konzepte!E61 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 678 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: DSCR Minimum, B | 0,80 | 0,01 | 0.80122 | Konzepte!E71 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 679 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: tiefster Stand Projektkonto, B | −145.957 € | ganze € | -145957 | Konzepte!E70 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 680 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Eigenkapitalrendite ohne Restwert, B | n. v. | 0,01 % | n. v. | Konzepte!E82 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 681 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Jahre DSCR unter 1,2, B | 18 | ganze Zahl | 18 | Konzepte!E73 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 682 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Zahlungsüberschuss Jahr 1, C | −20.597 € | ganze € | -20596.8 | Konzepte!F61 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 683 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: DSCR Minimum, C | 0,77 | 0,01 | 0.772914 | Konzepte!F71 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 684 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: tiefster Stand Projektkonto, C | −239.781 € | ganze € | -239781 | Konzepte!F70 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 685 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Eigenkapitalrendite ohne Restwert, C | n. v. | 0,01 % | n. v. | Konzepte!F82 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 686 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Jahre DSCR unter 1,2, C | 21 | ganze Zahl | 21 | Konzepte!F73 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 687 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Zahlungsüberschuss Jahr 1, frei (18,36 €) | 41.123 € | ganze € | 41122.7 | Konzepte!H61 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 688 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: DSCR Minimum, frei (18,36 €) | 1,20 | 0,01 | 1.2 | Konzepte!H71 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 689 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: tiefster Stand Projektkonto, frei (18,36 €) | 0 € | ganze € | 0 | Konzepte!H70 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 690 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Eigenkapitalrendite ohne Restwert, frei (18,36 €) | 6,32 % | 0,01 % | 0.0631984 | Konzepte!H82 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 691 | A7 Risiken im Einzelnen | Herstellungskosten 5.460 €: Jahre DSCR unter 1,2, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H73 | Lauf kosten_5460 (laeufe/kosten_5460.xlsx) |
| 692 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Zahlungsüberschuss Jahr 1, A | 15.003 € | ganze € | 15002.5 | Konzepte!D61 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 693 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: DSCR Minimum, A | 1,12 | 0,01 | 1.11618 | Konzepte!D71 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 694 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: tiefster Stand Projektkonto, A | 0 € | ganze € | 0 | Konzepte!D70 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 695 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Eigenkapitalrendite ohne Restwert, A | −1,67 % | 0,01 % | -0.0166825 | Konzepte!D82 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 696 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Jahre DSCR unter 1,2, A | 6 | ganze Zahl | 6 | Konzepte!D73 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 697 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Zahlungsüberschuss Jahr 1, B | 11.560 € | ganze € | 11559.8 | Konzepte!E61 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 698 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: DSCR Minimum, B | 1,05 | 0,01 | 1.05375 | Konzepte!E71 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 699 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: tiefster Stand Projektkonto, B | 0 € | ganze € | 0 | Konzepte!E70 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 700 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Eigenkapitalrendite ohne Restwert, B | −4,51 % | 0,01 % | -0.0450621 | Konzepte!E82 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 701 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Jahre DSCR unter 1,2, B | 24 | ganze Zahl | 24 | Konzepte!E73 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 702 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Zahlungsüberschuss Jahr 1, C | 10.812 € | ganze € | 10812.2 | Konzepte!F61 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 703 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: DSCR Minimum, C | 1,05 | 0,01 | 1.05487 | Konzepte!F71 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 704 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: tiefster Stand Projektkonto, C | 0 € | ganze € | 0 | Konzepte!F70 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 705 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Eigenkapitalrendite ohne Restwert, C | −6,34 % | 0,01 % | -0.0634278 | Konzepte!F82 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 706 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Jahre DSCR unter 1,2, C | 35 | ganze Zahl | 35 | Konzepte!F73 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 707 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Zahlungsüberschuss Jahr 1, frei (18,36 €) | 26.956 € | ganze € | 26955.7 | Konzepte!H61 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 708 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: DSCR Minimum, frei (18,36 €) | 1,20 | 0,01 | 1.2 | Konzepte!H71 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 709 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: tiefster Stand Projektkonto, frei (18,36 €) | 0 € | ganze € | 0 | Konzepte!H70 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 710 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Eigenkapitalrendite ohne Restwert, frei (18,36 €) | 6,32 % | 0,01 % | 0.0631984 | Konzepte!H82 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 711 | A7 Risiken im Einzelnen | keine Mieterhöhung gefördert: Jahre DSCR unter 1,2, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H73 | Lauf mietanpassung_gefoerdert_0 (laeufe/mietanpassung_gefoerdert_0.xlsx) |
| 712 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Zahlungsüberschuss Jahr 1, A | 15.003 € | ganze € | 15002.5 | Konzepte!D61 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 713 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: DSCR Minimum, A | 1,43 | 0,01 | 1.43096 | Konzepte!D71 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 714 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: tiefster Stand Projektkonto, A | 0 € | ganze € | 0 | Konzepte!D70 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 715 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Eigenkapitalrendite ohne Restwert, A | 2,57 % | 0,01 % | 0.0256945 | Konzepte!D82 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 716 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Jahre DSCR unter 1,2, A | 0 | ganze Zahl | 0 | Konzepte!D73 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 717 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Zahlungsüberschuss Jahr 1, B | 11.560 € | ganze € | 11559.8 | Konzepte!E61 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 718 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: DSCR Minimum, B | 1,22 | 0,01 | 1.22231 | Konzepte!E71 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 719 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: tiefster Stand Projektkonto, B | 0 € | ganze € | 0 | Konzepte!E70 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 720 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Eigenkapitalrendite ohne Restwert, B | 2,27 % | 0,01 % | 0.0226971 | Konzepte!E82 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 721 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Jahre DSCR unter 1,2, B | 0 | ganze Zahl | 0 | Konzepte!E73 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 722 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Zahlungsüberschuss Jahr 1, C | 10.812 € | ganze € | 10812.2 | Konzepte!F61 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 723 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: DSCR Minimum, C | 1,18 | 0,01 | 1.17913 | Konzepte!F71 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 724 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: tiefster Stand Projektkonto, C | 0 € | ganze € | 0 | Konzepte!F70 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 725 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Eigenkapitalrendite ohne Restwert, C | 2,00 % | 0,01 % | 0.0199958 | Konzepte!F82 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 726 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Jahre DSCR unter 1,2, C | 3 | ganze Zahl | 3 | Konzepte!F73 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 727 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Zahlungsüberschuss Jahr 1, frei (18,36 €) | 26.956 € | ganze € | 26955.7 | Konzepte!H61 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 728 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: DSCR Minimum, frei (18,36 €) | 1,10 | 0,01 | 1.10179 | Konzepte!H71 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 729 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: tiefster Stand Projektkonto, frei (18,36 €) | 0 € | ganze € | 0 | Konzepte!H70 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 730 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Eigenkapitalrendite ohne Restwert, frei (18,36 €) | 3,11 % | 0,01 % | 0.0310998 | Konzepte!H82 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 731 | A7 Risiken im Einzelnen | keine Mietsteigerung frei: Jahre DSCR unter 1,2, frei (18,36 €) | 29 | ganze Zahl | 29 | Konzepte!H73 | Lauf mietsteigerung_0 (laeufe/mietsteigerung_0.xlsx) |
| 732 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Zahlungsüberschuss Jahr 1, A | 15.003 € | ganze € | 15002.5 | Konzepte!D61 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 733 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: DSCR Minimum, A | 1,43 | 0,01 | 1.43096 | Konzepte!D71 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 734 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: tiefster Stand Projektkonto, A | 0 € | ganze € | 0 | Konzepte!D70 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 735 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Eigenkapitalrendite ohne Restwert, A | 2,58 % | 0,01 % | 0.0257691 | Konzepte!D82 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 736 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Jahre DSCR unter 1,2, A | 0 | ganze Zahl | 0 | Konzepte!D73 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 737 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Zahlungsüberschuss Jahr 1, B | 11.560 € | ganze € | 11559.8 | Konzepte!E61 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 738 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: DSCR Minimum, B | 1,22 | 0,01 | 1.22231 | Konzepte!E71 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 739 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: tiefster Stand Projektkonto, B | 0 € | ganze € | 0 | Konzepte!E70 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 740 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Eigenkapitalrendite ohne Restwert, B | 2,61 % | 0,01 % | 0.0260804 | Konzepte!E82 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 741 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Jahre DSCR unter 1,2, B | 0 | ganze Zahl | 0 | Konzepte!E73 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 742 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Zahlungsüberschuss Jahr 1, C | 10.812 € | ganze € | 10812.2 | Konzepte!F61 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 743 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: DSCR Minimum, C | 1,18 | 0,01 | 1.17913 | Konzepte!F71 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 744 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: tiefster Stand Projektkonto, C | 0 € | ganze € | 0 | Konzepte!F70 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 745 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Eigenkapitalrendite ohne Restwert, C | 2,75 % | 0,01 % | 0.0274717 | Konzepte!F82 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 746 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Jahre DSCR unter 1,2, C | 3 | ganze Zahl | 3 | Konzepte!F73 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 747 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Zahlungsüberschuss Jahr 1, frei (18,36 €) | 26.956 € | ganze € | 26955.7 | Konzepte!H61 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 748 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: DSCR Minimum, frei (18,36 €) | 1,20 | 0,01 | 1.2 | Konzepte!H71 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 749 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: tiefster Stand Projektkonto, frei (18,36 €) | 0 € | ganze € | 0 | Konzepte!H70 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 750 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Eigenkapitalrendite ohne Restwert, frei (18,36 €) | 6,12 % | 0,01 % | 0.0611565 | Konzepte!H82 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 751 | A7 Risiken im Einzelnen | Anschlusszins 4,86 %: Jahre DSCR unter 1,2, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H73 | Lauf anschlusszins_plus_1 (laeufe/anschlusszins_plus_1.xlsx) |
| 752 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Zahlungsüberschuss Jahr 1, A | 15.003 € | ganze € | 15002.5 | Konzepte!D61 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 753 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: DSCR Minimum, A | 1,43 | 0,01 | 1.43096 | Konzepte!D71 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 754 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: tiefster Stand Projektkonto, A | 0 € | ganze € | 0 | Konzepte!D70 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 755 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Eigenkapitalrendite ohne Restwert, A | 2,58 % | 0,01 % | 0.0257691 | Konzepte!D82 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 756 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Jahre DSCR unter 1,2, A | 0 | ganze Zahl | 0 | Konzepte!D73 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 757 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Zahlungsüberschuss Jahr 1, B | 11.560 € | ganze € | 11559.8 | Konzepte!E61 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 758 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: DSCR Minimum, B | 1,22 | 0,01 | 1.22231 | Konzepte!E71 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 759 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: tiefster Stand Projektkonto, B | 0 € | ganze € | 0 | Konzepte!E70 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 760 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Eigenkapitalrendite ohne Restwert, B | 2,61 % | 0,01 % | 0.0260804 | Konzepte!E82 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 761 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Jahre DSCR unter 1,2, B | 0 | ganze Zahl | 0 | Konzepte!E73 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 762 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Zahlungsüberschuss Jahr 1, C | 10.812 € | ganze € | 10812.2 | Konzepte!F61 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 763 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: DSCR Minimum, C | 1,18 | 0,01 | 1.17913 | Konzepte!F71 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 764 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: tiefster Stand Projektkonto, C | 0 € | ganze € | 0 | Konzepte!F70 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 765 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Eigenkapitalrendite ohne Restwert, C | 2,75 % | 0,01 % | 0.0274717 | Konzepte!F82 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 766 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Jahre DSCR unter 1,2, C | 3 | ganze Zahl | 3 | Konzepte!F73 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 767 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Zahlungsüberschuss Jahr 1, frei (18,36 €) | 26.956 € | ganze € | 26955.7 | Konzepte!H61 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 768 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: DSCR Minimum, frei (18,36 €) | 1,20 | 0,01 | 1.2 | Konzepte!H71 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 769 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: tiefster Stand Projektkonto, frei (18,36 €) | 0 € | ganze € | 0 | Konzepte!H70 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 770 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Eigenkapitalrendite ohne Restwert, frei (18,36 €) | 6,50 % | 0,01 % | 0.0650317 | Konzepte!H82 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 771 | A7 Risiken im Einzelnen | Anschlusszins 2,86 %: Jahre DSCR unter 1,2, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H73 | Lauf anschlusszins_minus_1 (laeufe/anschlusszins_minus_1.xlsx) |
| 772 | A7 Risiken im Einzelnen | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 773 | A7 Risiken im Einzelnen | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 774 | A8 Tilgungssatz | Tilgungssatz Stützpunkt Zeile 55 | 0,00 % | 0,01 % | 0 | Übersicht!B55 | Konzepte-Mappe (über werte_team.json) |
| 775 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 55, A | 43.225 € | ganze € | 43225.5 | Übersicht!D55 | Konzepte-Mappe (über werte_team.json) |
| 776 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 55, B | 53.894 € | ganze € | 53894.3 | Übersicht!E55 | Konzepte-Mappe (über werte_team.json) |
| 777 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 55, C | 60.202 € | ganze € | 60202.4 | Übersicht!F55 | Konzepte-Mappe (über werte_team.json) |
| 778 | A8 Tilgungssatz | Tilgungssatz Stützpunkt Zeile 56 | 1,00 % | 0,01 % | 0.01 | Übersicht!B56 | Konzepte-Mappe (über werte_team.json) |
| 779 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 56, A | 31.372 € | ganze € | 31371.8 | Übersicht!D56 | Konzepte-Mappe (über werte_team.json) |
| 780 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 56, B | 36.114 € | ganze € | 36113.8 | Übersicht!E56 | Konzepte-Mappe (über werte_team.json) |
| 781 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 56, C | 39.458 € | ganze € | 39458.5 | Übersicht!F56 | Konzepte-Mappe (über werte_team.json) |
| 782 | A8 Tilgungssatz | Tilgungssatz Stützpunkt Zeile 57 | 1,50 % | 0,01 % | 0.015 | Übersicht!B57 | Konzepte-Mappe (über werte_team.json) |
| 783 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 57, A | 25.445 € | ganze € | 25445 | Übersicht!D57 | Konzepte-Mappe (über werte_team.json) |
| 784 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 57, B | 27.224 € | ganze € | 27223.6 | Übersicht!E57 | Konzepte-Mappe (über werte_team.json) |
| 785 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 57, C | 29.087 € | ganze € | 29086.6 | Übersicht!F57 | Konzepte-Mappe (über werte_team.json) |
| 786 | A8 Tilgungssatz | Tilgungssatz Stützpunkt Zeile 58 | 2,00 % | 0,01 % | 0.02 | Übersicht!B58 | Konzepte-Mappe (über werte_team.json) |
| 787 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 58, A | 19.518 € | ganze € | 19518.2 | Übersicht!D58 | Konzepte-Mappe (über werte_team.json) |
| 788 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 58, B | 18.333 € | ganze € | 18333.3 | Übersicht!E58 | Konzepte-Mappe (über werte_team.json) |
| 789 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 58, C | 18.715 € | ganze € | 18714.6 | Übersicht!F58 | Konzepte-Mappe (über werte_team.json) |
| 790 | A8 Tilgungssatz | Tilgungssatz Stützpunkt Zeile 59 | 2,38 % | 0,01 % | 0.0238095 | Übersicht!B59 | Konzepte-Mappe (über werte_team.json) |
| 791 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 59, A | 15.003 € | ganze € | 15002.5 | Übersicht!D59 | Konzepte-Mappe (über werte_team.json) |
| 792 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 59, B | 11.560 € | ganze € | 11559.8 | Übersicht!E59 | Konzepte-Mappe (über werte_team.json) |
| 793 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 59, C | 10.812 € | ganze € | 10812.2 | Übersicht!F59 | Konzepte-Mappe (über werte_team.json) |
| 794 | A8 Tilgungssatz | Tilgungssatz Stützpunkt Zeile 60 | 2,50 % | 0,01 % | 0.025 | Übersicht!B60 | Konzepte-Mappe (über werte_team.json) |
| 795 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 60, A | 13.591 € | ganze € | 13591.4 | Übersicht!D60 | Konzepte-Mappe (über werte_team.json) |
| 796 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 60, B | 9.443 € | ganze € | 9443.08 | Übersicht!E60 | Konzepte-Mappe (über werte_team.json) |
| 797 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 60, C | 8.343 € | ganze € | 8342.67 | Übersicht!F60 | Konzepte-Mappe (über werte_team.json) |
| 798 | A8 Tilgungssatz | Tilgungssatz Stützpunkt Zeile 61 | 3,00 % | 0,01 % | 0.03 | Übersicht!B61 | Konzepte-Mappe (über werte_team.json) |
| 799 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 61, A | 7.665 € | ganze € | 7664.54 | Übersicht!D61 | Konzepte-Mappe (über werte_team.json) |
| 800 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 61, B | 553 € | ganze € | 552.844 | Übersicht!E61 | Konzepte-Mappe (über werte_team.json) |
| 801 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 61, C | −2.029 € | ganze € | -2029.27 | Übersicht!F61 | Konzepte-Mappe (über werte_team.json) |
| 802 | A8 Tilgungssatz | Tilgungssatz Stützpunkt Zeile 62 | 2,38 % | 0,01 % | 0.0238095 | Übersicht!B62 | Konzepte-Mappe (über werte_team.json) |
| 803 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 62, A | 15.003 € | ganze € | 15002.5 | Übersicht!D62 | Konzepte-Mappe (über werte_team.json) |
| 804 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 62, B | 11.560 € | ganze € | 11559.8 | Übersicht!E62 | Konzepte-Mappe (über werte_team.json) |
| 805 | A8 Tilgungssatz | Zahlungsüberschuss Jahr 1 bei Satz Zeile 62, C | 10.812 € | ganze € | 10812.2 | Übersicht!F62 | Konzepte-Mappe (über werte_team.json) |
| 806 | A8 Tilgungssatz | Tilgungssatz, bei dem der Zahlungsüberschuss null ist, A | 3,65 % | 0,01 % | 0.036466 | Übersicht!D49 | Konzepte-Mappe |
| 807 | A8 Tilgungssatz | Tilgungssatz, bei dem der Zahlungsüberschuss null ist, B | 3,03 % | 0,01 % | 0.0303109 | Übersicht!E49 | Konzepte-Mappe |
| 808 | A8 Tilgungssatz | Tilgungssatz, bei dem der Zahlungsüberschuss null ist, C | 2,90 % | 0,01 % | 0.0290217 | Übersicht!F49 | Konzepte-Mappe |
| 809 | A8 Tilgungssatz | Schwelle C gegenüber A | 1,91 % | 0,01 % | 0.0190961 | Übersicht!F64 | Konzepte-Mappe (über werte_team.json) |
| 810 | A9 Tilgungsschwelle (heute A7) | Schwelle B gegenüber A, 3.579 € | 1,80 % | 0,01 % | 0.0180008 | Übersicht!E63 | Konzepte-Mappe (über werte_team.json) |
| 811 | A9 Tilgungsschwelle (heute A7) | Schwelle C gegenüber A, 3.579 € | 1,91 % | 0,01 % | 0.0190961 | Übersicht!F64 | Konzepte-Mappe (über werte_team.json) |
| 812 | A9 Tilgungsschwelle (heute A7) | Schwelle B gegenüber A, kosten_4631 | 1,28 % | 0,01 % | 0.0127759 | Übersicht!E63 | Lauf kosten_4631 |
| 813 | A9 Tilgungsschwelle (heute A7) | Schwelle C gegenüber A, kosten_4631 | 1,36 % | 0,01 % | 0.0136223 | Übersicht!F64 | Lauf kosten_4631 |
| 814 | A9 Tilgungsschwelle (heute A7) | Schwelle B gegenüber A, kosten_5460 | 1,01 % | 0,01 % | 0.0100769 | Übersicht!E63 | Lauf kosten_5460 |
| 815 | A9 Tilgungsschwelle (heute A7) | Schwelle C gegenüber A, kosten_5460 | 1,08 % | 0,01 % | 0.0107949 | Übersicht!F64 | Lauf kosten_5460 |
| 816 | A11 Nach der Bindung | Zins NBank-Darlehen ab Jahr 36 | 3,86 % | 0,01 % | 0.0386 | Eingaben!F19 | Konzepte-Mappe |
| 817 | A11 Nach der Bindung | Kappungsgrenze nach Bindungsende | 20 % | ganze % | 0.2 | Eingaben!F27 | Konzepte-Mappe |
| 818 | A11 Nach der Bindung | Restschuld Ende Jahr 35, A | 197.561 € | ganze € | 197561 | Konzepte!D75 | Konzepte-Mappe |
| 819 | A11 Nach der Bindung | Restschuld Ende Jahr 35, B | 296.341 € | ganze € | 296341 | Konzepte!E75 | Konzepte-Mappe |
| 820 | A11 Nach der Bindung | Restschuld Ende Jahr 35, C | 345.731 € | ganze € | 345731 | Konzepte!F75 | Konzepte-Mappe |
| 821 | A11 Nach der Bindung | Restschuld Ende Jahr 35, frei (18,36 €) | 0 € | ganze € | 0 | Konzepte!H75 | Konzepte-Mappe |
| 822 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 35, A | 64.860 € | ganze € | 64860.1 | Konzepte Zeitreihe!F41 | Konzepte-Mappe |
| 823 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 36, A | 56.706 € | ganze € | 56706.3 | Konzepte Zeitreihe!F42 | Konzepte-Mappe |
| 824 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 37, A | 82.787 € | ganze € | 82787.1 | Konzepte Zeitreihe!F43 | Konzepte-Mappe |
| 825 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 42, A | 115.957 € | ganze € | 115957 | Konzepte Zeitreihe!F48 | Konzepte-Mappe |
| 826 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 35, B | 76.468 € | ganze € | 76467.8 | Konzepte Zeitreihe!O41 | Konzepte-Mappe |
| 827 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 36, B | 64.572 € | ganze € | 64571.6 | Konzepte Zeitreihe!O42 | Konzepte-Mappe |
| 828 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 37, B | 96.524 € | ganze € | 96524.4 | Konzepte Zeitreihe!O43 | Konzepte-Mappe |
| 829 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 42, B | 139.078 € | ganze € | 139078 | Konzepte Zeitreihe!O48 | Konzepte-Mappe |
| 830 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 35, C | 84.149 € | ganze € | 84149 | Konzepte Zeitreihe!X41 | Konzepte-Mappe |
| 831 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 36, C | 70.382 € | ganze € | 70381.7 | Konzepte Zeitreihe!X42 | Konzepte-Mappe |
| 832 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 37, C | 105.646 € | ganze € | 105646 | Konzepte Zeitreihe!X43 | Konzepte-Mappe |
| 833 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 42, C | 153.343 € | ganze € | 153343 | Konzepte Zeitreihe!X48 | Konzepte-Mappe |
| 834 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 35, frei (18,36 €) | 317.109 € | ganze € | 317109 | Konzepte Zeitreihe!AP41 | Konzepte-Mappe |
| 835 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 36, frei (18,36 €) | 323.451 € | ganze € | 323451 | Konzepte Zeitreihe!AP42 | Konzepte-Mappe |
| 836 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 37, frei (18,36 €) | 329.920 € | ganze € | 329920 | Konzepte Zeitreihe!AP43 | Konzepte-Mappe |
| 837 | A11 Nach der Bindung | Zahlungsüberschuss Jahr 42, frei (18,36 €) | 364.258 € | ganze € | 364258 | Konzepte Zeitreihe!AP48 | Konzepte-Mappe |
| 838 | A11 Nach der Bindung | Zahlungsüberschuss Summe Jahr 36–42, A | 653.081 € | ganze € | 653081 | Konzepte!D91 | Konzepte-Mappe |
| 839 | A11 Nach der Bindung | Zahlungsüberschuss Summe Jahr 36–42, B | 771.524 € | ganze € | 771524 | Konzepte!E91 | Konzepte-Mappe |
| 840 | A11 Nach der Bindung | Zahlungsüberschuss Summe Jahr 36–42, C | 847.491 € | ganze € | 847491 | Konzepte!F91 | Konzepte-Mappe |
| 841 | A11 Nach der Bindung | Zahlungsüberschuss Summe Jahr 36–42, frei (18,36 €) | 2.404.625 € | ganze € | 2.40463e+06 | Konzepte!H91 | Konzepte-Mappe |
| 842 | A11 Nach der Bindung | Jahre mit Fehlbetrag Jahr 36–42, A | 0 | ganze Zahl | 0 | Konzepte!D92 | Konzepte-Mappe |
| 843 | A11 Nach der Bindung | Jahre mit Fehlbetrag Jahr 36–42, B | 0 | ganze Zahl | 0 | Konzepte!E92 | Konzepte-Mappe |
| 844 | A11 Nach der Bindung | Jahre mit Fehlbetrag Jahr 36–42, C | 0 | ganze Zahl | 0 | Konzepte!F92 | Konzepte-Mappe |
| 845 | A11 Nach der Bindung | Jahre mit Fehlbetrag Jahr 36–42, frei (18,36 €) | 0 | ganze Zahl | 0 | Konzepte!H92 | Konzepte-Mappe |
| 846 | A11 Nach der Bindung | Restschuld Ende Jahr 42, A | 0 € | ganze € | 0 | Konzepte!D93 | Konzepte-Mappe |
| 847 | A11 Nach der Bindung | Restschuld Ende Jahr 42, B | 0 € | ganze € | 0 | Konzepte!E93 | Konzepte-Mappe |
| 848 | A11 Nach der Bindung | Restschuld Ende Jahr 42, C | 0 € | ganze € | 0 | Konzepte!F93 | Konzepte-Mappe |
| 849 | A11 Nach der Bindung | Restschuld Ende Jahr 42, frei (18,36 €) | 0 € | ganze € | 0 | Konzepte!H93 | Konzepte-Mappe |
| 850 | A11 Nach der Bindung | Vermögen Ende Jahr 42, A | 8,89 Mio. € | 0,01 Mio. € | 8.888e+06 | Konzepte!D94 | Konzepte-Mappe |
| 851 | A11 Nach der Bindung | Vermögen Ende Jahr 42, B | 9,60 Mio. € | 0,01 Mio. € | 9.60245e+06 | Konzepte!E94 | Konzepte-Mappe |
| 852 | A11 Nach der Bindung | Vermögen Ende Jahr 42, C | 9,99 Mio. € | 0,01 Mio. € | 9.9851e+06 | Konzepte!F94 | Konzepte-Mappe |
| 853 | A11 Nach der Bindung | Vermögen Ende Jahr 42, frei (18,36 €) | 15,57 Mio. € | 0,01 Mio. € | 1.55736e+07 | Konzepte!H94 | Konzepte-Mappe |
| 854 | A11 Nach der Bindung | Eigenkapitalrendite mit Restwert, Horizont Jahr 42, A | 6,57 % | 0,01 % | 0.0657218 | Konzepte!D95 | Konzepte-Mappe |
| 855 | A11 Nach der Bindung | Eigenkapitalrendite mit Restwert, Horizont Jahr 42, B | 6,76 % | 0,01 % | 0.0676241 | Konzepte!E95 | Konzepte-Mappe |
| 856 | A11 Nach der Bindung | Eigenkapitalrendite mit Restwert, Horizont Jahr 42, C | 6,86 % | 0,01 % | 0.0685872 | Konzepte!F95 | Konzepte-Mappe |
| 857 | A11 Nach der Bindung | Eigenkapitalrendite mit Restwert, Horizont Jahr 42, frei (18,36 €) | 8,09 % | 0,01 % | 0.0809341 | Konzepte!H95 | Konzepte-Mappe |
| 858 | A11 Nach der Bindung | Eigenkapitalrendite ohne Restwert, Horizont Jahr 42, A | 3,53 % | 0,01 % | 0.0352804 | Konzepte!D96 | Konzepte-Mappe |
| 859 | A11 Nach der Bindung | Eigenkapitalrendite ohne Restwert, Horizont Jahr 42, B | 3,75 % | 0,01 % | 0.0375484 | Konzepte!E96 | Konzepte-Mappe |
| 860 | A11 Nach der Bindung | Eigenkapitalrendite ohne Restwert, Horizont Jahr 42, C | 3,94 % | 0,01 % | 0.0393574 | Konzepte!F96 | Konzepte-Mappe |
| 861 | A11 Nach der Bindung | Eigenkapitalrendite ohne Restwert, Horizont Jahr 42, frei (18,36 €) | 6,51 % | 0,01 % | 0.0650545 | Konzepte!H96 | Konzepte-Mappe |
| 862 | A11 Nach der Bindung | Mietmarke: Miete frei finanziert für DSCR 1,2 | 18,36 € | 0,01 € | 18.362 | Konzepte!H49 | Konzepte-Mappe |
| 863 | A11 Nach der Bindung | Mietmarke: Marktmiete Jahr 1 | 15,42 € | 0,01 € | 15.42 | Eingaben!F25 | Konzepte-Mappe |
| 864 | Broschüre Blatt 9 bis 11 | alle Zahlen der Skizze | wie Folien 14 bis 24 | wie dort |  | siehe Folien | – |
