# Annahmen der Modellrechnung (Modellhaus, Projekt 2)

Erzeugt von `build_konzepte.py` aus `PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx`. Werte roh aus der Mappe; Anteile als Prozent. Herkunft: **Richtlinie** (RL Mietwohnraum 2026), **Gesetz**, **Quelle** (externe Datenquelle), **Projektdaten PGN**, **PGN-Annahme**. Die einzige neue Annahme ist N1 (DSCR 1,2).

| Annahme | Wert | Einheit | Herkunft | Fundstelle laut Mappe | Blatt!Zelle |
|---|---|---|---|---|---|
| Aktives Projekt (Modellhaus = Projekt 2) | 2 | Nummer | Projekt | Entscheidung des Auftraggebers vom 11.11.2026 | Eingaben!D3 |
| Eingabe 1.1 Bezugsjahr | 2027 | Jahr | PGN-Annahme | PGN-Annahme, Planungsstand 2026 | Eingaben!F7 |
| Eingabe 1.2 Wohnfläche | 828 | m² | Projektdaten PGN | Projektdaten PGN, Broschüre S. 10 | Eingaben!F8 |
| Eingabe 1.3 Wohnungen | 14 | Anzahl | Projektdaten PGN | Projektdaten PGN, Broschüre S. 10 | Eingaben!F9 |
| Eingabe 2.1 Herstellungskosten KG 200–700 je m² Wohnfläche | 3.579 | €/m² | Projektdaten PGN | Kostenansatz PGN, Broschüre S. 10 | Eingaben!F11 |
| Eingabe 2.2 Finanzierungskosten KG 800 | 0 | € | PGN-Annahme | PGN-Annahme (Ansatz 0) | Eingaben!F12 |
| Eingabe 2.3 Grundstück, Ansatz (Grundstück im Bestand) | 0 | € | Projektdaten PGN | Grundstück im Bestand, Ansatz 0 € | Eingaben!F13 |
| Eingabe 3.1 Tilgung NBank-Darlehen, linear p. a. | 2,381 % |  | PGN-Annahme | PGN-Annahme: linear über die Höchstlaufzeit von 42 Jahren | Eingaben!F17 |
| Eingabe 3.2 Tilgungsaufschub | 0 | Jahre | PGN-Annahme | PGN-Annahme (Rahmen RL Nr. 5.3.5) | Eingaben!F18 |
| Eingabe 3.3 Zins NBank-Darlehen ab Jahr 36 p. a. | 3,86 % |  | PGN-Annahme | PGN-Annahme: wie Eingabe 6.1 (Rahmen RL Nr. 5.3.4) | Eingaben!F19 |
| Eingabe 4.1 Mietenstufe | VI | Text | Projektdaten PGN | Projektdaten PGN, Broschüre S. 10 | Eingaben!F22 |
| Eingabe 4.2 Effizienzhaus 40 erreicht | nein | Text | Projektdaten PGN | Planung PGN (EH 55), Broschüre S. 11 | Eingaben!F23 |
| Eingabe 4.3 Ortsübliche Vergleichsmiete Jahr 1 | 12,9177 | €/m² Monat | Quelle | Mietübersicht Lkr. Harburg 2022, fortgeschr. | Eingaben!F24 |
| Eingabe 4.4 Marktmiete Neuvermietung Jahr 1 | 15,42 | €/m² Monat | Quelle | Gutachterausschuss Lüneburg, Mietübersicht Landkreis Harburg, Hamburger Umland, Baualter ab 2023, 40–60 m², Stand 01.01.2026 | Eingaben!F25 |
| Eingabe 4.5 Steigerung Markt- und Vergleichsmiete p. a. (Mietanpassung frei finanziert) | 2 % |  | PGN-Annahme | PGN-Annahme | Eingaben!F26 |
| Eingabe 4.6 Kappungsgrenze nach Bindungsende, in 3 Jahren | 20 % |  | Gesetz | § 558 Abs. 3 BGB | Eingaben!F27 |
| Eingabe 5.1 Mietausfall/Leerstand, Anteil der Sollmiete | 2 % |  | PGN-Annahme | PGN-Annahme (Broschüre S. 11) | Eingaben!F29 |
| Eingabe 5.2 Objektverwaltung je Wohnung | 367 | € p. a. | PGN-Annahme | PGN-Annahme (Broschüre S. 11); ImmoWertV fortgeschrieben | Eingaben!F30 |
| Eingabe 5.3 Instandhaltung je m² Wohnfläche | 14,4 | €/m² p. a. | PGN-Annahme | PGN-Annahme (Broschüre S. 11); ImmoWertV fortgeschrieben | Eingaben!F31 |
| Eingabe 5.4 Kostensteigerung ab Jahr 2 p. a. | 2 % |  | PGN-Annahme | PGN-Annahme; Vorgängermappe Best 1,5 %, Worst 2,5 % | Eingaben!F32 |
| Eingabe 5.5 Kostensätze 2026 fortschreiben um | 0 | Jahre | PGN-Annahme | Broschüre S. 11 (Kostenstand 2026) | Eingaben!F33 |
| Eingabe 6.1 Zins Bankdarlehen p. a. | 3,86 % |  | Quelle | Dr. Klein Wowi, Top-Konditionen 10 Jahre, Stand 10.11.2026 | Eingaben!F35 |
| Eingabe 6.2 Zinsbindung Bankdarlehen | 10 | Jahre | PGN-Annahme | PGN-Annahme (Vorgängermappe) | Eingaben!F36 |
| Eingabe 6.3 Anschlusszins Bankdarlehen nach Jahr 10 p. a. | 3,86 % |  | PGN-Annahme | PGN-Annahme: wie Eingabe 6.1; Vorgängermappe ± 1 Punkt | Eingaben!F37 |
| Eingabe 6.4 Laufzeit Bankdarlehen (jährliche Annuität über 30 Jahre) | 30 | Jahre | PGN-Annahme | PGN-Annahme (Vorgängermappe) | Eingaben!F38 |
| Eingabe 7.1 Zusätzliches Eigenkapital bar | 0 | € | PGN-Annahme | PGN-Annahme | Eingaben!F40 |
| Eingabe 7.2 Guthabenzins Projektkonto (VOFI) p. a. | 2 % |  | PGN-Annahme | PGN-Annahme (Vorgängermappe) | Eingaben!F41 |
| Eingabe 7.3 Sollzins Projektkonto (VOFI) p. a. | 5 % |  | PGN-Annahme | PGN-Annahme (Vorgängermappe) | Eingaben!F42 |
| Eingabe 8.1 Bodenwertsteigerung p. a. | 1,5 % |  | PGN-Annahme | PGN-Annahme (Vorgängermappe) | Eingaben!F44 |
| Eingabe 8.2 Zielmiete nach Jahr 42 (Restwert) | Marktmiete | Text | PGN-Annahme | PGN-Annahme | Eingaben!F45 |
| Eingabe 8.3 Veräußerungskosten, Anteil des Restwerts | 0 % |  | PGN-Annahme | PGN-Annahme | Eingaben!F46 |
| Eingabe 9.1 Faktor Herstellungskosten (neutral 1) | 1 | Faktor | PGN-Annahme | PGN-Annahme; Vorgängermappe Best 0,95, Worst 1,15 | Eingaben!F48 |
| Eingabe 9.2 Faktor Markt- und Vergleichsmiete (neutral 1) | 1 | Faktor | PGN-Annahme | PGN-Annahme; Vorgängermappe Best 1,05, Worst 0,95 | Eingaben!F49 |
| Eingabe 9.3 Zuschlag Liegenschaftszins (neutral 0) | 0 | Prozentpunkte | PGN-Annahme | Vorgängermappe: Best −0,30, Worst +0,60 Prozentpunkte | Eingaben!F50 |
| Eingabe 9.4 Faktor Gebäude-Restwert (neutral 1) | 1 | Faktor | PGN-Annahme | PGN-Annahme | Eingaben!F51 |
| Eingabe 10.1 Miete frei finanziert (Blatt Frei finanziert) | Marktmiete | Text | PGN-Annahme | PGN-Annahme | Eingaben!F53 |
| Eingabe 10.2 DSCR-Ziel der Mappe (Übersicht Block 8; nicht die neue Annahme) | 1 | Faktor | PGN-Annahme | PGN-Annahme | Eingaben!F54 |
| T1 Darlehen, höchstens, Gruppe A | 40 % |  | Richtlinie | RL Nr. 5.3.3.1 | Tabellen!D5 |
| T1 Darlehen, höchstens, Gruppe B | 60 % |  | Richtlinie | RL Nr. 5.3.3.1 | Tabellen!E5 |
| T1 Darlehen, höchstens, Gruppe C | 70 % |  | Richtlinie | RL Nr. 5.3.3.1 | Tabellen!F5 |
| T2 Zuschuss, höchstens, Gruppe A | 40 % |  | Richtlinie | RL Nr. 5.3.3.2 | Tabellen!D6 |
| T2 Zuschuss, höchstens, Gruppe B | 20 % |  | Richtlinie | RL Nr. 5.3.3.2 | Tabellen!E6 |
| T2 Zuschuss, höchstens, Gruppe C | 10 % |  | Richtlinie | RL Nr. 5.3.3.2 | Tabellen!F6 |
| T8 Bemessungsgrenze Herstellungskosten, Mietenstufe VI (Stand 01.10.2026) | 5.460 | €/m² | Richtlinie | RL Nr. 5.3.2.2; NBank-Produktinformation, Stand 05.11.2026 | Tabellen!C14 |
| T8 Höchstmiete nettokalt, Mietenstufe VI, Gruppe A | 6,8 | €/m² Monat | Richtlinie | RL Nr. 5.4.4 | Tabellen!D14 |
| T8 Höchstmiete nettokalt, Mietenstufe VI, Gruppe B | 8,2 | €/m² Monat | Richtlinie | RL Nr. 5.4.4 | Tabellen!E14 |
| T8 Höchstmiete nettokalt, Mietenstufe VI, Gruppe C | 9 | €/m² Monat | Richtlinie | RL Nr. 5.4.4 | Tabellen!F14 |
| T10 Eigenmittel, mindestens, Anteil der zuwendungsfähigen Kosten | 20 % |  | Richtlinie | RL Nr. 5.2.6 | Tabellen!D18 |
| T11 Zins NBank-Darlehen bis Ende Jahr 35 | 0 % |  | Richtlinie | RL Nr. 5.3.4 | Tabellen!D19 |
| T12 Zinsfreie Jahre | 35 | Jahre | Richtlinie | RL Nr. 5.3.4 | Tabellen!D20 |
| T13 Höchstlaufzeit NBank-Darlehen, Betrachtungsende | 42 | Jahre | Richtlinie | RL Nr. 5.3.5 | Tabellen!D21 |
| T14 Tilgungsaufschub, höchstens | 5 | Jahre | Richtlinie | RL Nr. 5.3.5 | Tabellen!D22 |
| T15 Verwaltungskostenbeitrag p. a. vom Restkapital | 0,5 % |  | Richtlinie | RL Nr. 12.7.1 | Tabellen!D23 |
| T16 Bearbeitungsentgelt Darlehen, einmalig | 1 % |  | Richtlinie | RL Nr. 12.7.2 | Tabellen!D24 |
| T17 Bearbeitungsentgelt Zuschuss, einmalig | 0,75 % |  | Richtlinie | RL Nr. 12.7.3 | Tabellen!D25 |
| T18 Belegungs- und Mietbindung | 35 | Jahre | Richtlinie | RL Nr. 5.4.1, 5.4.2 | Tabellen!D26 |
| T19 Jahre ohne Mieterhöhung | 3 | Jahre | Richtlinie | RL Nr. 5.4.4, 5.4.5 | Tabellen!D27 |
| T20 Mieterhöhung in der Bindung, höchstens, in 3 Jahren (Mietanpassung gefördert) | 6,15 % |  | Richtlinie | RL Nr. 5.4.5 | Tabellen!D28 |
| T21 Abstand der Mieterhöhungen | 3 | Jahre | PGN-Annahme | PGN-Konvention (Rahmen RL Nr. 5.4.5) | Tabellen!D29 |
| T22 Zuschlag auf die Höchstmiete ab Effizienzhaus 40 | 0,3 | €/m² Monat | Richtlinie | RL Nr. 5.4.4 Satz 2 | Tabellen!D30 |
| T23 Tilgung Bankdarlehen, mindestens p. a. | 1 % |  | Richtlinie | RL Nr. 5.3.6 | Tabellen!D31 |
| T25 Gesamtnutzungsdauer Mehrfamilienhaus (Restwert) | 80 | Jahre | Quelle | ImmoWertV Anlage 1 | Tabellen!D33 |
| T26 Liegenschaftszins, Restnutzungsdauer 30 Jahre, Projekt 2 | 2,5 % |  | Quelle | Gutachterausschuss Nds., Landesmodell MFH 01.01.2026 | Tabellen!F36 |
| T27 Liegenschaftszins, Restnutzungsdauer 38 Jahre, Projekt 2 | 2,7 % |  | Quelle | Gutachterausschuss Nds., Landesmodell MFH 01.01.2026 | Tabellen!F37 |
| T28 Liegenschaftszins, Restnutzungsdauer 40 Jahre, Projekt 2 | 2,7 % |  | Quelle | Gutachterausschuss Nds., Landesmodell MFH 01.01.2026 | Tabellen!F38 |
| T29 Liegenschaftszins, Restnutzungsdauer 50 Jahre, Projekt 2 | 2,9 % |  | Quelle | Gutachterausschuss Nds., Landesmodell MFH 01.01.2026 | Tabellen!F39 |
| T30 Liegenschaftszins, Restnutzungsdauer 60 Jahre, Projekt 2 | 3 % |  | Quelle | Gutachterausschuss Nds., Landesmodell MFH 01.01.2026 | Tabellen!F40 |
| T31 Liegenschaftszins, Restnutzungsdauer 70 Jahre, Projekt 2 | 3,1 % |  | Quelle | Gutachterausschuss Nds., Landesmodell MFH 01.01.2026 | Tabellen!F41 |
| N1 DSCR-Ziel der Bank, frei finanziert (neu) | 1,2 | Faktor | PGN-Annahme | Annahme der PGN (neu): Die Bank verlangt DSCR ≥ 1,2; DSCR = Überschuss vor Kapitaldienst ÷ Kapitaldienst Bankdarlehen | Konzepte!D6 |

Hinweise

- Eingaben: Spalte F (verwendet) zeigt Projekt 2; die Quelle steht in Spalte G (Teil hinter „/“ = Projekt 2).
- Mietanpassung gefördert: Tabellen D27 bis D29 (3 Jahre keine Erhöhung, dann alle 3 Jahre höchstens +6,15 %), ab Jahr 36 Kappungsgrenze (Eingabe 4.6) bis zur Vergleichsmiete. Mietanpassung frei finanziert: Eingabe 4.5 (2 % p. a.).
- Restwert: Ertragswert in Jahr 35 und 42 aus der Marktmiete (frei) bzw. dem Mietpfad der Gruppe (gefördert), Liegenschaftszins Tabellen F36:F41, Gesamtnutzungsdauer T25; Grundstück nicht angesetzt (Bodenwert 0).
- N1 steht auf dem neuen Blatt Konzepte; die übrigen Annahmen stehen unverändert auf Eingaben und Tabellen.
