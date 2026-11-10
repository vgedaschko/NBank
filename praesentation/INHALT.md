# Folienkonzept: Mietwohnraumförderung Niedersachsen 2026, Vortragsfassung

Planungsgemeinschaft Nord GmbH · Design „Planwerk“ · 16:9 · Stand der Inhalte 30.09.2026

Hauptteil 28 Folien, Anhang 8 Folien. Diese Datei wird aus `daten/outline.json` erzeugt (`python daten/inhalt_md.py`); Änderungen gehören in die JSON-Datei.

## Leitgedanke

Der Vortrag führt einen Entscheider in rund 35 Minuten zu einer Rechnung: Im Modellhaus der Broschüre (20 Wohnungen, 1.400 m², 7,0 Mio. €) liegt die Miete, bei der der Zahlungsüberschuss in Jahr 1 null ist, gefördert bei 6,77 € je m² und damit unter der Höchstmiete von 6,80 €; frei finanziert wären 20,72 € nötig. Der Kapitaldienst beträgt 84.000 € statt 313.703 €. Vor der Agenda steht ein Einstieg in vier Folien: Baukosten, Zinsen, Kapitaldienst je m² und der Bestand gebundener Wohnungen in Niedersachsen. Die Agenda nennt die vier Abschnitte und den Fokus: Der Vortrag behandelt Programmteil 2.1; die Programmteile 2.2 bis 2.6 stehen in der Broschüre und im Anhang A1. Vor der Rechnung steht, was man zum Lesen braucht (Neuerung seit 01.07.2026, Höchstmiete, Fördermix, Eckdaten). In der Rechnung zeigen zwei Flussdiagramme, wohin die Miete gefördert und frei finanziert fließt. Nach ihr steht, wovon das Ergebnis abhängt (Tilgungssatz, Laufzeit, Herstellungskosten) und was als Nächstes zu tun ist (erst Bewilligung, dann Vertrag; Planung mit PGN bis Leistungsphase 6 vorher). Zahlen, Begriffe und Planzeichen sind die der Broschüre; alle Modellwerte kommen über werte.json aus der Mappe.

## Begründung

Bewertung der drei Entwürfe. „entscheider“ trägt am besten zur Kernaussage: Die Rechnung ist die Mitte des Vortrags, Kapitaldienst und nötige Miete haben je eine eigene Folie mit einem Balkenpaar, danach folgen die Größen, die das Ergebnis verschieben, und der nächste Schritt. Schwächen: Seine Folie 2 macht ungeprüfte Zahlen der Altfassung zum Titel, eine Folie zu den Neuerungen fehlt, die Schlussfolie der Rechnung hat keinen Aussage-Titel. „broschuere“ hat die größte Einheit mit der Broschüre und die saubersten Wortlaute, erreicht den Vergleich „frei finanziert“ aber erst auf seiner Folie 11, zeigt Kapitaldienst und Miete auf einer Folie und braucht zwei Folien für Inhalt und Zusammenfassung; das Material der Altfassung steht nur im Anhang. „altfassung“ hält die gewohnte Gliederung und baut die Marktdaten als native Diagramme, stellt aber drei ungeprüfte Reihen und den ungeprüften Kostenwert 3.579 € in Titel des Hauptteils, braucht drei Trenner ohne Aussage und zeigt die Leistungen der PGN nur im Anhang. Entschieden: Gerüst von „entscheider“ (heute Folien 8 bis 27), dazu von „broschuere“ die Vorher-Nachher-Folie und die Marktzahl 28 %, von „altfassung“ das Zinsdiagramm mit drei Zinsbindungen, die Säulen der Höchstmieten und der Kostenvergleich. Umbau nach Durchsicht durch den Auftraggeber: Vor der Agenda steht ein Einstieg in vier Folien (Baukosten, Zinsen, Kapitaldienst je m², Bestand gebundener Wohnungen), die Agenda nennt die vier Abschnitte und den Fokus auf Programmteil 2.1, nach dem Kapitaldienst zeigen zwei Flussdiagramme den Zahlungsfluss in Jahr 1, und der Kostenvergleich PGN gegen ARGE steht im Hauptteil vor dem Kostenszenario. Die früheren Anhangfolien zu Herstellungskosten und Markt gehen darin auf. Damit tragen die Folien 3 bis 6 und 22 Zahlen der Altfassung im Titel. Auf Wunsch des Auftraggebers beginnt jeder der vier Abschnitte mit einem Trenner. Der Vermerk „nicht nachgeprüft“ steht in den Notizen und in INHALT.md; PGN bestätigt die Werte vor dem ersten Vortrag. Abschnitte: Ausgangslage (Folien 1 bis 7), Programmteil 2.1 (8 bis 12), Ihre Rechnung (13 bis 24), Umsetzung (25 bis 28), Anhang (A0 bis A7). Ablauf mit Zeiten: Ausgangslage 5 bis 6 Minuten (je Folie des Einstiegs etwa eine Minute), Programmteil 2.1 6 Minuten, Ihre Rechnung 17 bis 18 Minuten (Höhepunkt auf den Folien 16 bis 19), Umsetzung 5 Minuten; zusammen 33 bis 35 Minuten. Umfang: Hauptteil 28 Folien, davon vier Trenner, Anhang 8 Folien einschließlich Trenner, letzte Folie „Quellen und Hinweis“. E1 bis E14 sind eingehalten: natives Diagramm oder native Tabelle auf jeder Datenfolie, die Flussdiagramme aus nativen Formen, Layouts aus der Planwerk-Spezifikation, das Modellhaus als einziges Rechenbeispiel (Folie 5 rechnet Medianwerte je m² und trägt keinen Stempel), keine Renditen und keine Marktmiete des Modellhauses, Stempel auf den Folien 14 bis 21, 23 und 24, Quellen in den Notizen und auf A7, zwei Signalelemente (Warnband auf Folie 26, Frist auf A2), keine fremden Bilder.

## Folienübersicht

| Nr. | ID | Abschnitt | Layout | Titel | Baugruppe |
|---|---|---|---|---|---|
| 1 | `titel` | Ausgangslage | `PGN_TITEL` | Wohnraum, der sich rechnen kann | rahmen |
| 2 | `trenner-ausgangslage` | Ausgangslage | `PGN_ABSCHNITT_ROT` | Ausgangslage: Kosten, Zinsen, Bestand | struktur |
| 3 | `einstieg-baukosten` | Ausgangslage | `PGN_DIAGRAMM` | Bauen ist seit 2020 um gut die Hälfte teurer geworden | einstieg |
| 4 | `ausgangslage-zinsen` | Ausgangslage | `PGN_DIAGRAMM` | Kredite kosten 3,74 %, Anfang 2020 waren es 0,46 % | einstieg |
| 5 | `einstieg-kapitaldienst` | Ausgangslage | `PGN_DIAGRAMM` | Kapitaldienst je m² und Monat: von 8,95 auf 20,14 € seit 2020 | einstieg |
| 6 | `einstieg-bestand` | Ausgangslage | `PGN_DIAGRAMM` | Niedersachsen: 40,6 % weniger gebundene Wohnungen als 2016 | einstieg |
| 7 | `agenda` | Ausgangslage | `PGN_INHALT` | Thema ist Programmteil 2.1: Neubau mit Darlehen und Zuschuss | struktur |
| 8 | `trenner-programmteil` | Programmteil 2.1 | `PGN_ABSCHNITT_ROT` | Programmteil 2.1: die Konditionen | struktur |
| 9 | `neu-seit-juli` | Programmteil 2.1 | `PGN_VERGLEICH` | Seit 01.07.2026: Darlehen plus Zuschuss statt Tilgungsnachlass | regeln |
| 10 | `hoechstmiete` | Programmteil 2.1 | `PGN_DIAGRAMM` | Höchstmiete in Programmteil 2.1: 6,50–9,00 € je m², drei Jahre fest | regeln |
| 11 | `foerdermix` | Programmteil 2.1 | `PGN_DIAGRAMM` | In jeder Einkommensgruppe bis zu 80 % Förderquote | regeln |
| 12 | `eckdaten-zeitstrahl` | Programmteil 2.1 | `PGN_INHALT` | 35 Jahre zinsfrei und gebunden, höchstens 42 Jahre Laufzeit | regeln |
| 13 | `trenner-rechnung` | Ihre Rechnung | `PGN_ABSCHNITT_ROT` | Ihre Rechnung: das Modellhaus | struktur |
| 14 | `rechnung-finanzierung` | Ihre Rechnung | `PGN_INHALT_MR` | 20 Wohnungen, 7,0 Mio. €: bis zu 5,6 Mio. € Förderung | rechnung |
| 15 | `rechnung-jahr1` | Ihre Rechnung | `PGN_TABELLE_MR` | Jahr 1: Zahlungsüberschuss 455 € in A, Fehlbeträge in B und C | rechnung |
| 16 | `rechnung-kapitaldienst` | Ihre Rechnung | `PGN_DIAGRAMM_MR` | Kapitaldienst in Jahr 1: 84.000 € statt 313.703 € frei finanziert | rechnung |
| 17 | `rechnung-fluss-gefoerdert` | Ihre Rechnung | `PGN_INHALT_MR` | Gefördert: 61,3 % der Miete fließen in die Tilgung | fluss |
| 18 | `rechnung-fluss-frei` | Ihre Rechnung | `PGN_INHALT_MR` | Frei finanziert: 60,2 % der Miete gehen an Zinsen | fluss |
| 19 | `rechnung-miete` | Ihre Rechnung | `PGN_INHALT_MR` | Nötige Miete: 6,77 € gefördert, 20,72 € je m² frei finanziert | rechnung |
| 20 | `rechnung-tilgung` | Ihre Rechnung | `PGN_DIAGRAMM_MR` | Der Tilgungssatz entscheidet über den Zahlungsüberschuss in Jahr 1 | rechnung |
| 21 | `rechnung-verlauf` | Ihre Rechnung | `PGN_DIAGRAMM_MR` | Ab Jahr 10 Zahlungsüberschuss in allen drei Einkommensgruppen | rechnung |
| 22 | `pgn-baukosten` | Ihre Rechnung | `PGN_DIAGRAMM` | Herstellungskosten der PGN: 22,7 % unter dem ARGE-Median | struktur |
| 23 | `rechnung-kosten` | Ihre Rechnung | `PGN_DIAGRAMM_MR` | Herstellungskosten je m² bestimmen Förderquote und Zahlungsüberschuss | rechnung |
| 24 | `fazit` | Ihre Rechnung | `PGN_KENNZAHLEN_MR` | Tilgungssatz, Kosten und Höchstmiete bestimmen das Ergebnis | rahmen |
| 25 | `trenner-umsetzung` | Umsetzung | `PGN_ABSCHNITT_ROT` | Umsetzung: der Weg zur Bewilligung | struktur |
| 26 | `antragsweg` | Umsetzung | `PGN_ABLAUF` | Erst die Bewilligung, dann Verträge und Baubeginn | umsetzung |
| 27 | `pgn-leistungen` | Umsetzung | `PGN_INHALT` | Planung bis Leistungsphase 6 ist vor der Bewilligung möglich | umsetzung |
| 28 | `kontakt` | Umsetzung | `PGN_SCHLUSS` | Aus Ihrer guten Idee – machen wir den besten Plan | rahmen |
| A0 | `anhang-trenner` | Anhang | `PGN_ABSCHNITT` | Anhang | struktur |
| A1 | `anhang-programmteile` | Anhang | `PGN_ANHANG` | Vier Ausgangslagen führen zu sechs Programmteilen | ueberblick |
| A2 | `anhang-frist` | Anhang | `PGN_ANHANG` | 31.12.2026: Wahlrecht für Modernisierungsanträge | ueberblick |
| A3 | `anhang-voraussetzungen` | Anhang | `PGN_ANHANG` | Sechs Voraussetzungen, darunter Bedarf am Standort | umsetzung |
| A4 | `anhang-vertraege` | Anhang | `PGN_ANHANG` | Vor der Bewilligung zulässig: Planung bis LPH 6 | umsetzung |
| A5 | `anhang-mieterkreis` | Anhang | `PGN_ANHANG` | Grundsatz ist Gruppe A; B und C nur mit Zulassung | regeln |
| A6 | `anhang-eckdaten` | Anhang | `PGN_ANHANG` | Programmteil 2.1: 0 % Zins bis Ende des 35. Jahres | regeln |
| A7 | `quellen` | Anhang | `PGN_ANHANG` | Quellen und Hinweis | struktur |

## Folien im Einzelnen

### 1 · Wohnraum, der sich rechnen kann

ID `titel` · Abschnitt Ausgangslage · Layout `PGN_TITEL` · Baugruppe rahmen

**Aussage:** PGN zeigt, wie die RL Mietwohnraum 2026 die Rechnung eines Neubaus verändert: bis zu 80 % Förderquote aus Darlehen und Zuschuss in Programmteil 2.1.

**Inhalt (Wortlaut der Folie):** Kopfleiste: „MIETWOHNRAUMFÖRDERUNG NIEDERSACHSEN 2026“. Titel in drei Zeilen: „WOHNRAUM, DER“ | „SICH RECHNEN“ | „KANN.“ (Claim der Broschüre im Wortlaut, deshalb mit Schlusspunkt; Signaturwort „RECHNEN“ kursiv). Untertitel: „Die RL Mietwohnraum 2026 für Wohnungsunternehmen, Genossenschaften, Investorinnen und Investoren sowie Kommunen.“ Schriftfeld: „Herausgeber“ · „Planungsgemeinschaft Nord GmbH, Rotenburg (Wümme)“ · „Stand 30.09.2026“ · „Vortrag“ · Platzhalter „Ort, Datum“ (trägt PGN ein). Kennzahlfeld: „BIS ZU“ · „80 %“ · „Förderquote aus Darlehen und Zuschuss“ · „der zuwendungsfähigen Kosten · Programmteil 2.1“. Bildzeile an der Zeichnung (10 pt): „Referenzprojekt Brauerstraße, Rotenburg (Wümme) · 19 barrierefreie Wohnungen · mit Förderung der NBank“. Kein Logo von NBank oder Land, keine Foliennummer.

**Darstellung:** Dominant: Axonometrie Brauerstraße als Negativ auf Rotverlauf (Hintergrundbild bg-titel.png, erzeugt aus ../broschuere/src/assets/pgn/sig-axo-brauerstrasse.svg) mit Maßkette, dazu das weiße Kennzahlfeld mit roter „80 %“. Weißer Planrahmen, Titellinie weiß, Logo rot auf weißem Feld (logo-rot.svg). Wie Probe 1 und Broschüre U1.

**Daten:** Broschüre S. 1 (content/pages/01-umschlag-titel.json: headline, subline ohne „Ein Leitfaden der PGN zur“, Kennzahl, Schriftfeld, image.caption). Gegenprobe 80 %: werte.json, Lauf modellhaus, tab.quote_darlehen.A + tab.quote_zuschuss.A.

**Herkunft:** Broschüre S. 1

**Sprechernotizen**

- Begrüßung; Absender ist die Planungsgemeinschaft Nord GmbH, Stand der Inhalte 30.09.2026.
- Thema: die RL Mietwohnraum 2026, in Kraft seit 01.07.2026, befristet bis 31.12.2031.
- Schwerpunkt: Programmteil 2.1 und eine Modellrechnung für einen Neubau mit 20 Wohnungen.
- Die Zeichnung zeigt das Referenzprojekt Brauerstraße in Rotenburg (Wümme): 19 barrierefreie Wohnungen, mit Förderung der NBank.
- Broschüre und Rechenmappe der PGN enthalten dieselben Zahlen.

**Quellenzeile der Notizen:** Quelle: RL Mietwohnraum 2026, RdErl. d. MW v. 25.06.2026 (Nds. MBl. 2026 Nr. 319); Broschüre S. 1.

### 2 · Ausgangslage: Kosten, Zinsen, Bestand

ID `trenner-ausgangslage` · Abschnitt Ausgangslage · Layout `PGN_ABSCHNITT_ROT` · Baugruppe struktur

**Aussage:** Der erste Abschnitt zeigt, was Bauen und Finanzieren heute kosten und wie viele gebundene Wohnungen Niedersachsen noch hat.

**Inhalt (Wortlaut der Folie):** Achskreis XL: „1“. Titelzeilen: „Ausgangslage:“ | „Kosten, Zinsen, Bestand“ (Signaturwort: „Kosten, Zinsen, Bestand“; gesetzt in Versalien, 40 pt). Lead: „Was Bauen und Finanzieren heute kosten und wie viele gebundene Wohnungen Niedersachsen noch hat.“ Rubrik im Schriftfeld: „AUSGANGSLAGE“. Achsleiste auf der oberen Rahmenlinie: Achskreise „1“ bis „4“ für Ausgangslage, Programmteil 2.1, Ihre Rechnung, Umsetzung; die „1“ gefüllt.

**Darstellung:** Wie die Trenner der anderen Abschnitte: Achskreis XL mit der „1“ und der Titel (Montserrat Black 40 pt) auf Rotverlauf (bg-rot.png). Weißer Planrahmen, Logo rot auf weißem Feld, Achsleiste mit vier Achskreisen M, der erste gefüllt. Ohne Stempel. Wie Probe 14.

**Daten:** Keine Zahlen. Name und Nummer des Abschnitts folgen aus dem Feld „abschnitt“; die Zählung rechnet folien/_struktur.cjs wie für die Agenda.

**Herkunft:** neu nach Durchsicht durch den Auftraggeber: Trenner vor jedem Abschnitt des Hauptteils

**Sprechernotizen**

- Zuerst die Ausgangslage, in vier Folien.
- Baukosten, Bauzinsen und was beides zusammen für den Kapitaldienst bedeutet.
- Danach der Bestand gebundener Wohnungen in Niedersachsen.
- Als Nächstes: die Baukosten.

**Quellenzeile der Notizen:** Quelle: keine eigenen Angaben.

### 3 · Bauen ist seit 2020 um gut die Hälfte teurer geworden

ID `einstieg-baukosten` · Abschnitt Ausgangslage · Layout `PGN_DIAGRAMM` · Baugruppe einstieg

**Aussage:** Die Herstellungskosten je m² Wohnfläche sind von Q1 2020 bis Q4 2025 um 52,9 % gestiegen, von 3.028 auf 4.631 €; das Grundstück hat sich mit 4,8 % kaum verteuert.

**Inhalt (Wortlaut der Folie):** Kicker: „AUSGANGSLAGE · BAUKOSTEN“. Titelzeilen: „Bauen ist seit 2020“ | „um gut die Hälfte teurer geworden“ (Signaturwort: „gut die Hälfte“). Diagrammtitel: „HERSTELLUNG UND GRUNDSTÜCK JE M² WOHNFLÄCHE“. Untertitel: „in €, Bruttokosten · ARGE-Median deutscher Großstädte“. Legende: „Q1 2020“ · „Q4 2025“. Säulenwerte Q1 2020 | Q4 2025: „Herstellung“ · „KG 200–700“ 3.028 | 4.631 · „Grundstück“ · „KG 100“ 726 | 761. Rechte Spalte, Hauptzahl: Vorsatz „HERSTELLUNG, KG 200–700“ · Zahl „+52,9 %“ · Label „Q1 2020 bis Q4 2025“. Zweite Kennzahl: Vorsatz „GRUNDSTÜCK, KG 100“ · Zahl „+4,8 %“ · Label „Q1 2020 bis Q4 2025“.

**Darstellung:** Dominant: natives gruppiertes Säulendiagramm über 8 Spalten im Platzhalter des Layouts mit zwei Kategorien (Herstellung, Grundstück) und 2 Reihen: „Q1 2020“ in B4B0AB, „Q4 2025“ in Tinte 202020; y-Achse 0 bis 5.000 €, Schritt 1.000. Die Beschriftung im Diagramm ist ausgeblendet; die Werte stehen als Formen über den Säulen (Montserrat Bold 12, auf einer Fläche in der Grundfarbe: 726 und 761 stünden sonst auf der Gitterlinie). Kategorien zweizeilig als Textfelder unter den Säulen (Bezeichnung, darunter die Kostengruppe). Lücke zwischen den Gruppen 185 %: Eine Säule ist 0,92 Zoll breit, so breit wie die Säulen der Folie 5. Rechts über 4 Spalten, wie auf den Folien 4 bis 6: die Hauptzahl der Folie (60 pt, Einheit in Rot) mit Vorsatz und einer Zeile Label ab y 2,10, darunter ab y 4,40 die zweite Kennzahl (44 pt). Die Wertepaare stehen an den Säulen und nicht noch einmal in den Kacheln. Farben der vier Folien des Einstiegs: frühere Stände in Grau B4B0AB, der heutige Stand in Tinte. Weißer Grund, kein Stempel, kein Rot im Diagramm, kein Bild der ARGE; Schlüsselplan und Daumenregister entfallen, weil die Folie keinen Programmteil behandelt.

**Daten:** daten/markt.json, Block baukosten: herstellung.q1_2020, herstellung.q4_2025, grundstueck.q1_2020, grundstueck.q4_2025 (ungerundet), reihen, auf_der_folie, von_jahr. Veränderung im Code gerechnet (Q4 2025 ÷ Q1 2020 − 1); Belege mit Formel in daten/pruefung.json („Folie 3“). Für die Notizen: baukosten.bauwerk und baukosten.baunebenkosten. Gegenprobe: herstellung.q4_2025 = kosten.arge.spanne_herstellung.median.

**Herkunft:** Altfassung Folie 23, nicht nachgeprüft; Auswahl auf Herstellung und Grundstück nach der Festlegung zum Umbau

**Sprechernotizen**

- Bauen ist teurer geworden. Die Herstellungskosten je m² Wohnfläche lagen Anfang 2020 im Median bei 3.028 €, Ende 2025 bei 4.631 €: 52,9 % mehr.
- Das Grundstück hat sich im selben Zeitraum kaum verteuert: von 726 auf 761 € je m² Wohnfläche, 4,8 % mehr.
- Der Anstieg betrifft alle Kostengruppen der Herstellung: Bauwerk plus 52,2 %, Baunebenkosten plus 57,1 %.
- Die Werte sind Mediane für deutsche Großstädte, Bruttokosten. Regie: aus der Präsentation vom 26.10.2026 übernommen, nicht nachgeprüft.
- Als Nächstes: der Zins.

**Quellenzeile der Notizen:** Quelle: ARGE e. V. (2026): Wohnungsbau in Deutschland 2026 (Endbericht), S. 34, Abb. 23 (aus der Altfassung übernommen, nicht nachgeprüft).

### 4 · Kredite kosten 3,74 %, Anfang 2020 waren es 0,46 %

ID `ausgangslage-zinsen` · Abschnitt Ausgangslage · Layout `PGN_DIAGRAMM` · Baugruppe einstieg

**Aussage:** Frei finanzierter Neubau trägt heute Zinsen von drei bis vier Prozent, Anfang 2020 waren es bei 10 Jahren Zinsbindung 0,46 %; mit 3,74 % rechnen die nächste Folie und später der Vergleich „frei finanziert“.

**Inhalt (Wortlaut der Folie):** Kicker: „AUSGANGSLAGE · BAUZINSEN“. Titelzeilen: „Kredite kosten 3,74 %,“ | „Anfang 2020 waren es 0,46 %“ (Signaturwort: „3,74 %“). Diagrammtitel: „SOLLZINS P. A. NACH ZINSBINDUNG“. Untertitel: „in %, Monatswerte 01/2016 bis 07/2026, Top-Konditionen Wohnungswirtschaft“. Legende: „10 Jahre“ · „20 Jahre“ · „30 Jahre“. Marke 1: „Ø Q1 2020: 0,46 | 0,87 | 0,98 %“. Marke 2: „Ø Q4 2025: 3,49 | 3,74 | 3,87 %“. Endwerte an den Linien: „3,74 %“ · „4,02 %“ · „4,15 %“ mit der Bezeichnung „Juli 2026“. Rechte Spalte, Hauptzahl: Vorsatz „JULI 2026“ · Zahl „3,74 %“ · Label „10 Jahre Zinsbindung“. Zweite Kennzahl: Vorsatz „Ø Q1 2020“ · Zahl „0,46 %“ · Label „10 Jahre Zinsbindung“.

**Darstellung:** Dominant: natives Liniendiagramm über 8 Spalten mit 3 Reihen zu je 127 Monatswerten: „10 Jahre“ durchgezogen in Tinte 202020, „20 Jahre“ gestrichelt in 202020 (Strichart über die Nachbearbeitung), „30 Jahre“ in Referenzgrau 77716B; Linienstärke 2,25 pt, keine Marker. x-Achse: Monate 01/2016 bis 07/2026, beschriftet nur die Jahre 2016 bis 2026. y-Achse: 0 bis 5 %, Schritt 1, Format [$-407]0. Endwerte Juli 2026 direkt an den Linienenden (Montserrat Bold 12). Zwei senkrechte Marken als Formen (0,75 pt Anthrazit) bei 02/2020 und 11/2025 mit den Quartalsmitteln; Lage aus der Kategorienmitte gerechnet. Rechts über 4 Spalten, wie auf den Folien 3, 5 und 6: die Hauptzahl der Folie (60 pt, Einheit in Rot) mit Vorsatz und einer Zeile Label ab y 2,10, darunter ab y 4,40 die zweite Kennzahl (44 pt); mit beiden Werten rechnet die Folie 5, und beide nennt der Titel. Der Satz der Broschüre S. 2 steht gekürzt in den Sprechernotizen. Kein Rot im Diagramm.

**Daten:** daten/markt.json, Block zinsen; übernommen aus alt-daten.json, Altfassung Folie 24, diagramme[0].monatswerte.werte (127 Zeilen: monat, z10, z20, z30; 2016-01 bis 2026-07), monatswerte.markierte_monate, zeichnungstexte (Ø Q1 2020, Ø Q4 2025). In daten/markt.json mit Herkunft und Vermerk „nicht nachgeprüft“. Satz der Sprechernotizen: Broschüre S. 2 (02-editorial-inhalt.json, lead; in daten/markt.json unter zinsen.texte.ausgangslage; in den Notizen ohne den Halbsatz zu den Baukosten). Titel: dieselben Werte wie Hauptzahl und zweite Kennzahl; das Modul prüft den Titel gegen beide. Hauptzahl 3,74 %: werte.json, Lauf modellhaus, eingabe.zins_bank (Eingaben!F35), gleich dem letzten Wert der Reihe; Label: eingabe.zinsbindung. Zweite Kennzahl 0,46 %: zinsen.marken[0].z10.

**Herkunft:** Satz der Sprechernotizen: Broschüre S. 2. Zinsreihe und die Werte in Titel und Kennzahlen: Altfassung Folie 24, nicht nachgeprüft; 3,74 % ist auch der Zins des Bankdarlehens in der Rechenmappe.

**Sprechernotizen**

- Kredite kosteten Ende 2025 drei bis vier Prozent. Die Zahl der Baugenehmigungen hat sich seit 2021 mehr als halbiert.
- Bei 10 Jahren Zinsbindung lag der Sollzins Anfang 2020 im Mittel bei 0,46 %, Ende 2025 bei 3,49 %, im Juli 2026 bei 3,74 %.
- Tiefstwert dieser Reihe 0,33 % im Oktober 2020, Höchstwert 3,86 % im Oktober 2023; bei 20 und 30 Jahren Zinsbindung liegt der Höchstwert im Juli 2026 (4,02 und 4,15 %).
- Die 3,74 % kehren in der Modellrechnung als Zins des Bankdarlehens wieder; dort sind sie eine Annahme der PGN, wie in der Rechenmappe. Was Kosten und Zins zusammen für den Kapitaldienst bedeuten, zeigt die nächste Folie.
- Die Zinsreihe endet im Juli 2026. Regie: aus der Präsentation vom 26.10.2026 übernommen, nicht nachgeprüft.

**Quellenzeile der Notizen:** Quelle: NBank-Pressemitteilung zur Wohnungsmarktbeobachtung vom 05.12.2025 (Broschüre S. 2). Zinsreihe: Dr. Klein Wowi Finanz AG (2026), Zinsentwicklung für die Wohnungswirtschaft, Top-Konditionen nach Zinsbindung, Monatswerte 01/2016 bis 07/2026 (aus der Altfassung übernommen, nicht nachgeprüft).

### 5 · Kapitaldienst je m² und Monat: von 8,95 auf 20,14 € seit 2020

ID `einstieg-kapitaldienst` · Abschnitt Ausgangslage · Layout `PGN_DIAGRAMM` · Baugruppe einstieg

**Aussage:** Höhere Baukosten und höherer Zins heben den Kapitaldienst einer frei finanzierten Wohnung von 8,95 auf 20,14 € je m² und Monat; vom Anstieg entfallen 35 % auf die Baukosten, 45 % auf den Zins und 20 % auf die Wechselwirkung aus beidem.

**Inhalt (Wortlaut der Folie):** Kicker: „AUSGANGSLAGE · KAPITALDIENST“. Titelzeilen: „Kapitaldienst je m² und Monat:“ | „von 8,95 auf 20,14 € seit 2020“ (Signaturwort: „20,14 €“). Diagrammtitel: „KAPITALDIENST JE M² UND MONAT, FREI FINANZIERT“. Untertitel: „in € · ARGE-Median deutscher Großstädte · Annuität 30 Jahre · Anteile am Anstieg in %“. Säule „Q1 2020“ mit der Summe „8,95 €“; Säule „Heute“ mit der Summe „20,14 €“, gestapelt von unten: Stand Q1 2020 8,95 · Baukosten 3,91 · Zins 5,07 · Wechselwirkung 2,21. Maßlinie zwischen den Säulen: „+11,19 €“. Beschriftung rechts der Säule „Heute“, von oben: „Wechselwirkung“ · „+2,21 € · 20 %“ · „höherer Zins auf die höheren Kosten“ | „Zins“ · „+5,07 € · 45 %“ · „höherer Zins auf die Kosten von 2020“ | „Baukosten“ · „+3,91 € · 35 %“ · „höhere Kosten zum Zins von 2020“. Notiz unter den Ursachen (12 pt, zwei Zeilen): „Heute: Kosten Q4 2025, Zins Juli 2026.“ | „Kapitaldienst: Zins und Tilgung.“ Rechte Spalte, Hauptzahl: Vorsatz „HEUTE“ · Zahl „20,14 €“ · Label „Kapitaldienst je m² und Monat“. Darunter Modultitel „RECHENWEG JE M² WOHNFLÄCHE“, Tabelle mit den Spalten „Q1 2020“ | „Heute“: „Grundstück und Herstellung“ 3.754 € | 5.392 € · „× Fremdkapital“ 80 % | 80 % · „Sollzins p. a.“ 0,46 % | 3,74 %.

**Darstellung:** Layout PGN_DIAGRAMM wie die Folien 3, 4 und 6; das Diagramm steht in freier Lage und reicht bis zum Ende der Inhaltszone. Dominant: links über 8 Spalten ein natives gestapeltes Säulendiagramm mit zwei Kategorien („Q1 2020“, „Heute“) und 4 Reihen: „Stand Q1 2020“ (8,95 in beiden Säulen) in B4B0AB, „Baukosten“ in Tinte 202020, „Zins“ in 77716B, „Wechselwirkung“ in D8D4CF (bei „Q1 2020“ je 0); y-Achse 0 bis 24 €, Schritt 4, Format [$-407]0 wie auf Folie 19; die Beschriftung im Diagramm ist ausgeblendet. Die Plotfläche ist 3,30 Zoll breit (Säulen 0,92 Zoll wie auf Folie 3). Als Formen darüber: die Summen über den Säulen (Montserrat Bold 16); zwischen den Säulen eine gestrichelte Bezugslinie auf der Höhe des Stands Q1 2020 und eine senkrechte Maßlinie (0,75 pt Anthrazit, 45°-Striche) mit dem Anstieg; rechts der Säule „Heute“ je Segment eine Zuleitung (Haarlinie), die Bezeichnung (Work Sans SemiBold 12), in einer Flucht dahinter Betrag und Anteil (Montserrat Bold 12) und darunter eine Zeile Erklärung (12 pt, grau), auf 0,56 Zoll Abstand entzerrt. In derselben Spalte unten, bündig mit der Grundlinie der Säulen, die Notiz in 12 pt (zwei Zeilen). Rechts über 4 Spalten, wie auf den Folien 3, 4 und 6: die Hauptzahl der Folie (60 pt, Einheit in Rot) mit Vorsatz und einer Zeile Label ab y 2,10, darunter ab y 4,40 der Rechenweg als kleine native Tabelle (addTable, 14 pt) mit drei Zeilen und den Wertspalten „Q1 2020“ und „Heute“: die Kette von den Kosten über das Fremdkapital und den Zins zum Kapitaldienst. Weißer Grund und kein Stempel: Die Folie rechnet mit Medianwerten je m² und ist keine Modellrechnung. Kein Rot im Diagramm. Die Aufteilung in Zins und Tilgung steht nicht auf der Folie.

**Daten:** daten/markt.json: baukosten.herstellung und baukosten.grundstueck (Q1 2020, Q4 2025), kapitaldienst.fremdkapital, kapitaldienst.zins_q1_2020 (gleich zinsen.marken[0].z10), kapitaldienst.annuitaetenfaktor_q1_2020 (Gegenprobe). werte.json, Lauf modellhaus: eingabe.zins_bank (3,74 %, gleich dem letzten Wert der Reihe zinsen.z10), eingabe.laufzeit_bank; Probe der Methode: fin.bankdarlehen.Frei × Annuitätenfaktor = frei.annuitaet (313.703 €). Im Code gerechnet: Annuitätenfaktor = i ÷ (1 − (1 + i)^−n); Kapitaldienst je m² und Monat = Kosten × 0,8 × Faktor ÷ 12; Baukosten = (Kosten heute − Kosten Q1 2020) × 0,8 × Faktor Q1 2020 ÷ 12; Zins = Kosten Q1 2020 × 0,8 × (Faktor heute − Faktor Q1 2020) ÷ 12; Wechselwirkung = Rest. Die Faktoren nimmt das Modul wie daten/pruefung.json (Q1 2020: kapitaldienst.annuitaetenfaktor_q1_2020; heute: frei.annuitaet ÷ fin.bankdarlehen.Frei) und prüft beide gegen die Formel. Ergebnisse mit Formel in daten/pruefung.json („Folie 5“), dort auch Kapitaldienst je Jahr und Zins und Tilgung im ersten Jahr.

**Herkunft:** Kette und Zerlegung nach Altfassung Folie 5; neu gerechnet nach der Methode der Rechenmappe (jährliche Annuität über 30 Jahre; die Altfassung nannte mit monatlicher Annuität 8,93 und 19,95 €). Eingangswerte aus der Altfassung, nicht nachgeprüft

**Sprechernotizen**

- Kosten und Zins zusammen, gerechnet je m² Wohnfläche mit den Medianwerten deutscher Großstädte: Grundstück und Herstellung 3.754 € Anfang 2020, 5.392 € Ende 2025.
- Davon 80 % als Bankdarlehen mit jährlicher Annuität über 30 Jahre, wie in der Rechenmappe. Zins bei 10 Jahren Zinsbindung: Anfang 2020 0,46 %, im Juli 2026 3,74 %.
- Der Kapitaldienst steigt von 8,95 auf 20,14 € je m² und Monat: 3,91 € durch die Baukosten, 5,07 € durch den Zins, 2,21 € durch beides zugleich.
- Regie: 20,14 € sind Zins und Tilgung beim Median von 5.392 € je m². Das Modellhaus kostet mit Grundstück 5.000 € je m²; sein Kapitaldienst frei finanziert beträgt 18,67 € je m² und Monat. Die nötige Miete des Modellhauses (20,72 €, Folie 19) enthält auch Objektverwaltung, Instandhaltung und Mietausfall.
- Als Nächstes: der Bestand an gebundenen Wohnungen. Regie: Kosten und Zinsen aus der Präsentation vom 26.10.2026 übernommen, nicht nachgeprüft.

**Quellenzeile der Notizen:** Quelle: ARGE e. V. (2026): Wohnungsbau in Deutschland 2026 (Endbericht), S. 34, Abb. 23; Zinsen: Dr. Klein Wowi Finanz AG (2026), Zinsentwicklung für die Wohnungswirtschaft (beide aus der Altfassung übernommen, nicht nachgeprüft); eigene Rechnung der PGN (Annuitätendarlehen über 30 Jahre, jährliche Annuität).

### 6 · Niedersachsen: 40,6 % weniger gebundene Wohnungen als 2016

ID `einstieg-bestand` · Abschnitt Ausgangslage · Layout `PGN_DIAGRAMM` · Baugruppe einstieg

**Aussage:** Der Bestand gebundener Mietwohnungen in Niedersachsen ist von 85.766 (2016) auf 50.920 (2025) gesunken; von 2015 bis 2024 hat die Neuförderung nur 28 % der ausgelaufenen Bindungen ersetzt.

**Inhalt (Wortlaut der Folie):** Kicker: „AUSGANGSLAGE · BESTAND IN NIEDERSACHSEN“. Titelzeilen: „Niedersachsen: 40,6 % weniger“ | „gebundene Wohnungen als 2016“ (Signaturwort: „40,6 % weniger“). Diagrammtitel: „BESTAND GEBUNDENER MIETWOHNUNGEN IN NIEDERSACHSEN“. Untertitel: „Wohnungen mit Miet- und Belegungsbindung, Bestand zum 31.12.“ Säulen „2016“ bis „2025“ (Werte der Reihe: 85.766 · 82.496 · 74.887 · 67.335 · 60.265 · 55.193 · 52.601 · 51.242 · 50.495 · 50.920); an der Säule beschriftet: 2016 „85.766“ · 2024 „50.495“ · 2025 „50.920“. Maßkette über dem Diagramm von 2016 bis 2025: „−40,6 %“. Rechte Spalte, Hauptzahl: Vorsatz „2016 BIS 2025“ · Zahl „−40,6 %“ · Label „gebundene Mietwohnungen“. Zweite Kennzahl: Vorsatz „2015 BIS 2024“ · Zahl „28 %“ · Label „ausgelaufener Bindungen ersetzt“ · Text „58.024 Bindungen ausgelaufen, rund 16.000 Wohnungen neu gefördert.“

**Darstellung:** Dominant: natives Säulendiagramm über 8 Spalten im Platzhalter des Layouts mit einer Reihe und zehn Kategorien (2016 bis 2025); die Säulen 2016 bis 2024 in Grau B4B0AB, die Säule 2025 in Tinte 202020 (Farbe je Datenpunkt; wie auf den Folien 3 und 5: frühere Stände grau, der heutige Stand in Tinte); y-Achse 0 bis 100.000, Schritt 20.000, Format [$-407]#,##0; die Beschriftung im Diagramm ist ausgeblendet, drei Werte stehen als Formen an ihrer Säule (Montserrat Bold 12): der erste, der Wert der Broschüre für 2024 und der letzte. Über dem Diagramm eine Maßkette von der ersten bis zur letzten Säule mit dem Rückgang; die Maßhilfslinien laufen bis über die Werte der beiden Säulen. Rechts über 4 Spalten, wie auf den Folien 3 bis 5: die Hauptzahl der Folie (60 pt, Einheit in Rot) mit Vorsatz und einer Zeile Label ab y 2,10, darunter ab y 4,40 die Kennzahl der Broschüre S. 3 (44 pt) mit Vorsatz, Label und Text (14 pt). Weißer Grund, kein Stempel, kein Rot im Diagramm. Die neu bewilligten Wohnungen je Jahr, Landesziel und Pestel-Lücke der Altfassung stehen nicht auf der Folie.

**Daten:** daten/markt.json, Block bestand: reihe (Jahr und Wert, 2016 bis 2025), jahre, von, bis, beschriftet. Rückgang im Code gerechnet (1 − Wert 2025 ÷ Wert 2016); Beleg mit Formel in daten/pruefung.json („Folie 6“). Block markt (Broschüre S. 3, 03-zahlen-zuerst.json, blocks[2].data): seit, bis, ausgelaufen, neu_gefoerdert (gezeigt als „rund 16.000“), quote, texte (hauptzahl_vorsatz, hauptzahl_label, kennzahl_vorsatz, kennzahl_label, kennzahl_text). Gegenprobe: reihe 2024 = markt.bestand (50.495). Keine Werte der Mappe.

**Herkunft:** Reihe 2016 bis 2025: Altfassung Folie 4, nicht nachgeprüft. Kennzahl und Zahlen 2015 bis 2024: Broschüre S. 3 (vor dem Umbau die Anhangfolie „Markt in Niedersachsen“)

**Sprechernotizen**

- Der Bestand gebundener Mietwohnungen in Niedersachsen ist von 85.766 Ende 2016 auf 50.920 Ende 2025 gesunken: 40,6 % weniger.
- Der Grund: Bindungen laufen aus. Von 2015 bis 2024 waren es 58.024; neu gefördert wurden rund 16.000 Wohnungen, das sind 28 %.
- 2025 lag der Bestand erstmals in dieser Reihe über dem Vorjahr: 425 Wohnungen mehr als 2024.
- Regie: Reihe 2016 bis 2025 aus der Präsentation vom 26.10.2026 übernommen, nicht nachgeprüft; die Zahlen für 2015 bis 2024 stehen in der Broschüre S. 3.
- Als Nächstes: der Inhalt des Vortrags.

**Quellenzeile der Notizen:** Quelle: BT-Drs. 21/7303, Antwort der Bundesregierung vom 21.07.2026 (Bestand zum 31.12., aus der Altfassung übernommen, nicht nachgeprüft); NBank-Wohnungsmarktbericht 2025; Broschüre S. 3.

### 7 · Thema ist Programmteil 2.1: Neubau mit Darlehen und Zuschuss

ID `agenda` · Abschnitt Ausgangslage · Layout `PGN_INHALT` · Baugruppe struktur

**Aussage:** Der Vortrag hat vier Abschnitte und behandelt Programmteil 2.1 (Neubau mit Darlehen und Zuschuss); die Programmteile 2.2 bis 2.6 stehen in der Broschüre und im Anhang A1.

**Inhalt (Wortlaut der Folie):** Kicker: „INHALT DES VORTRAGS“. Titelzeilen: „Thema ist Programmteil 2.1:“ | „Neubau mit Darlehen und Zuschuss“ (Signaturwort: „Programmteil 2.1“). Achse mit vier Achskreisen: „1“ · „AUSGANGSLAGE“ · „Baukosten, Zinsen, Kapitaldienst, Bestand“ | „2“ · „PROGRAMMTEIL 2.1“ · „Neuerungen, Höchstmiete, Fördermix, Eckdaten“ | „3“ · „IHRE RECHNUNG“ · „Das Modellhaus, gefördert und frei finanziert“ | „4“ · „UMSETZUNG“ · „Antragsweg und Planung mit PGN“. Modultitel: „DIE SECHS PROGRAMMTEILE DER RICHTLINIE“. Untertitel: „Der Vortrag behandelt 2.1. Die Programmteile 2.2 bis 2.6 stehen in der Broschüre und im Anhang A1.“ Register, sechs Felder: „2.1“ · „Neubau, Änderung und Erweiterung, Ersterwerb“ · „in diesem Vortrag“ | „2.2“ · „Energetisch hochwertiger Neubau“ · „Broschüre S. 13“ | „2.3“ · „Klimagerechte Modernisierung“ · „Broschüre S. 15“ | „2.4“ · „Ostfriesische Inseln“ · „Broschüre S. 14“ | „2.5“ · „Belegungsbindungen erwerben“ · „Broschüre S. 17“ | „2.6“ · „Auslaufende Bindungen verlängern“ · „Broschüre S. 17“.

**Darstellung:** Dominant: eine waagerechte Achse über 12 Spalten (Linie 1 pt Tinte) mit vier großen Achskreisen (Durchmesser 0,9 Zoll, Ziffer Montserrat Black 32 pt in Tinte, Kontur 1,5 pt wie der Achskreis XL der Trennerfolie), je Abschnitt einer, im Abstand von drei Spalten; von jedem Achskreis läuft eine senkrechte Achslinie (Strichpunkt, 0,75 pt) nach unten wie die Achsen eines Grundrisses, rechts daneben der Name des Abschnitts (Montserrat ExtraBold 16 pt, Versalien) und eine Zeile Inhalt (14 pt, zwei Zeilen, an der Wortfuge mit den ausgeglichensten Zeilen gebrochen). Keine Aufzählungsliste. Darunter über 12 Spalten ein Modulkopf mit Titel; der Satz zum Fokus steht darunter in 14 pt, sein erster Satz halbfett. Das Register der sechs Programmteile steht in einer Reihe als Schlüsselplan in groß: sechs gleich breite Felder mit schmaler Fuge (je 1,95 Zoll; im Rasterfeld von zwei Spalten bräche „Belegungsbindungen“ in 12 pt mitten im Wort), je Feld Programm-Chip mit Nummer in der Programmfarbe, Name (Work Sans SemiBold 12 pt) und unter einer Haarlinie der Verweis (12 pt, grau); das Feld 2.1 auf der hellen Fläche seiner Programmfarbe (F7E3E7), sein Verweis in Tinte halbfett, die übrigen Felder auf Papierton. Der Schlüsselplan in der Kickerzeile entfällt, weil das Register auf der Folie steht. Weißer Grund; Rot nur an Kicker, Titellinie, Signaturwort und am Feld 2.1 (Chip und Ton seiner Programmfarbe).

**Daten:** daten/rahmen.json, Block agenda: abschnitte (Nummer, Name, eine Zeile Inhalt), register (Titel, Untertitel mit Fettmarke am ersten Satz, Nummer und Verweis je Programmteil). Namen der Programmteile: daten/markt.json, programmteile.zeilen (Broschüre S. 5). Gegenproben im Modul: Zahl, Reihenfolge und Namen der Abschnitte gleich dem Feld „abschnitt“ der Folien des Hauptteils (dieselbe Funktion in folien/_struktur.cjs zählt die Achsleisten der Trenner, Folien 2, 8, 13 und 25); der Satz zum Register nennt die Anhangfolie der Programmteile mit ihrer Blattnummer. Keine Werte der Mappe.

**Herkunft:** neu nach Durchsicht durch den Auftraggeber (Agenda, Fokus auf Programmteil 2.1, Verweis auf die Broschüre); Seiten der Broschüre: 13, 14, 15 und 17

**Sprechernotizen**

- Die Ausgangslage liegt hinter uns: Baukosten, Zinsen, Kapitaldienst, Bestand.
- Der Vortrag behandelt Programmteil 2.1: Neubau mit Darlehen und Zuschuss. Die Programmteile 2.2 bis 2.6 stehen in der Broschüre und in Kurzform im Anhang A1.
- Es folgen drei Abschnitte: die Konditionen des Programmteils 2.1, die Rechnung am Modellhaus und der Weg zur Bewilligung.
- Die Rechnung nimmt etwa die Hälfte der Zeit ein.
- Als Nächstes: was seit 01.07.2026 neu ist.

**Quellenzeile der Notizen:** Quelle: keine eigenen Angaben; Broschüre S. 5, 13, 14, 15 und 17.

### 8 · Programmteil 2.1: die Konditionen

ID `trenner-programmteil` · Abschnitt Programmteil 2.1 · Layout `PGN_ABSCHNITT_ROT` · Baugruppe struktur

**Aussage:** Der zweite Abschnitt nennt die Konditionen des Programmteils 2.1: Darlehen plus Zuschuss, Höchstmiete, Fördermix und Eckdaten.

**Inhalt (Wortlaut der Folie):** Achskreis XL: „2“. Titelzeilen: „Programmteil 2.1:“ | „die Konditionen“ (Signaturwort: „Konditionen“; gesetzt in Versalien, 40 pt). Lead: „Darlehen plus Zuschuss: Höchstmiete, Fördermix und Eckdaten der neuen Richtlinie.“ Rubrik im Schriftfeld: „PROGRAMMTEIL 2.1“. Achsleiste auf der oberen Rahmenlinie: Achskreise „1“ bis „4“ für Ausgangslage, Programmteil 2.1, Ihre Rechnung, Umsetzung; die „2“ gefüllt.

**Darstellung:** Wie die Trenner der anderen Abschnitte: Achskreis XL mit der „2“ und der Titel (Montserrat Black 40 pt) auf Rotverlauf (bg-rot.png). Weißer Planrahmen, Logo rot auf weißem Feld, Achsleiste mit vier Achskreisen M, der zweite gefüllt. Ohne Stempel. Wie Probe 14.

**Daten:** Keine Zahlen. Name und Nummer des Abschnitts folgen aus dem Feld „abschnitt“; die Zählung rechnet folien/_struktur.cjs wie für die Agenda.

**Herkunft:** neu nach Durchsicht durch den Auftraggeber: Trenner vor jedem Abschnitt des Hauptteils

**Sprechernotizen**

- Jetzt die Konditionen des Programmteils 2.1, soweit man sie für die Rechnung braucht.
- Vier Folien: die Neuerung, die Höchstmiete, der Fördermix und die Eckdaten des Darlehens.
- Einzelheiten stehen in der Broschüre und im Anhang.
- Als Nächstes: Darlehen plus Zuschuss statt Tilgungsnachlass.

**Quellenzeile der Notizen:** Quelle: keine eigenen Angaben.

### 9 · Seit 01.07.2026: Darlehen plus Zuschuss statt Tilgungsnachlass

ID `neu-seit-juli` · Abschnitt Programmteil 2.1 · Layout `PGN_VERGLEICH` · Baugruppe regeln

**Aussage:** Die neue Richtlinie ersetzt den Tilgungsnachlass durch einen nicht rückzahlbaren Zuschuss; Darlehen und Zuschuss decken zusammen bis zu 80 % der zuwendungsfähigen Kosten.

**Inhalt (Wortlaut der Folie):** Kicker: „PROGRAMMTEIL 2.1 · NEUERUNGEN“. Titelzeilen: „Seit 01.07.2026: Darlehen plus“ | „Zuschuss statt Tilgungsnachlass“ (Signaturwort: „Zuschuss“). Links: Kopf „BIS 30.06.2026“ · Wert „75 % Darlehen“ · drei Absätze: „Instrument: zinsloses Darlehen, 75 % der Gesamtkosten; Tilgungsnachlass 30 % des Darlehens nur bei geringen Einkommen“ · „Bemessung je m² Wohnfläche: 5.330/5.550 € Gesamtkosten, Neubau inkl. Grundstück“ · „Mieterkreis und Höchstmiete Jahre 1–3 (nettokalt je m²): geringe und mittlere Einkommen; 6,30/6,60 € (geringe)“. Rechts: Kopf „SEIT 01.07.2026“ · Wert „80 % Förderung“ · drei Absätze: „Instrument: Darlehen + Zuschuss statt Tilgungsnachlass; zusammen 80 % der zuwendungsfähigen Kosten (Gruppe A: je 40 %)“ · „Bemessung je m² Wohnfläche: Ausgangswerte 4.800/5.000 € Herstellungskosten; Grundstück separat bis Bodenrichtwert“ · „Mieterkreis und Höchstmiete Jahre 1–3 (nettokalt je m²): Gruppen A, B, C (B/C nur mit Zulassung); A: 6,50/6,80 €“. Fußzeile unter beiden Seiten (12 pt): „Programmteil 2.1 im Vergleich · Höchstsätze · Wertepaare: Mietenstufe I–III/IV–VII · Bemessung nicht direkt vergleichbar“.

**Darstellung:** Dominant: das Wertepaar „75 % Darlehen“ → „80 % Förderung“ (Montserrat ExtraBold 36 pt) im Layout PGN_VERGLEICH wie Probe 12: links grau (Modulkopf-Linie B4B0AB, Kopf und Wert in accent6), rechts Papierfläche mit Kopf in Rot und Wert in Tinte, Pfeil „→“ im Steg. Darunter je Seite drei Kurzabsätze (14 pt) als Textfelder an festen Lagen, damit die drei Zeilen links und rechts auf gleicher Höhe stehen; die Werte (75 %, 30 %, 5.330/5.550 €, 6,30/6,60 €; 80 %, 40 %, 4.800/5.000 €, 6,50/6,80 €) in Work Sans SemiBold wie in der Broschüre S. 4, die Zeilenbezeichnungen mager. Fußzeile als Textfeld über 12 Spalten. Daumenregister 2.1 wie auf den Folien 10 bis 12.

**Daten:** Broschüre S. 4 (04-neu-und-grundcheck.json, blocks[0]: caption, columns, rows[0..2], note). Abgleich der Werte seit 01.07.2026: werte.json, Lauf modellhaus, tab.quote_darlehen.A, tab.quote_zuschuss.A, tab.bemessungsgrenze.I, tab.bemessungsgrenze.IV, tab.hoechstmiete.I.A, tab.hoechstmiete.IV.A. Die Werte bis 30.06.2026 stehen nur in der Broschüre (daten/regeln.json mit Seitenangabe).

**Herkunft:** Broschüre S. 4 (ersetzt Altfassung Folie 6)

**Sprechernotizen**

- Die RL Mietwohnraum 2026 gilt seit 01.07.2026 und ist bis 31.12.2031 befristet.
- Bisher: zinsloses Darlehen über 75 % der Gesamtkosten, Tilgungsnachlass nur bei geringen Einkommen. Jetzt: Darlehen plus Zuschuss, zusammen bis zu 80 % der zuwendungsfähigen Kosten.
- Der Zuschuss ist nicht rückzahlbar und wird nur zusammen mit dem Darlehen gewährt.
- Die Bemessung ist nicht direkt vergleichbar: früher Gesamtkosten mit Grundstück, jetzt Herstellungskosten; das Grundstück kommt bis zum Bodenrichtwert hinzu.
- Der Mieterkreis ist jetzt in die Gruppen A, B und C geteilt, bisher waren es geringe und mittlere Einkommen; B und C brauchen eine Zulassung in der Förderentscheidung.

**Quellenzeile der Notizen:** Quelle: RL Mietwohnraum 2026, RdErl. d. MW v. 25.06.2026 (Nds. MBl. 2026 Nr. 319); Förderregeln bis 30.06.2026: NBank-Produktinformation „Allgemeine Mietwohnraumförderung“, Stand 01.04.2026 (Broschüre S. 4).

### 10 · Höchstmiete in Programmteil 2.1: 6,50–9,00 € je m², drei Jahre fest

ID `hoechstmiete` · Abschnitt Programmteil 2.1 · Layout `PGN_DIAGRAMM` · Baugruppe regeln

**Aussage:** Einkommensgruppe und Mietenstufe legen die Höchstmiete fest; sie gilt drei Jahre, danach steigt sie um höchstens 6,15 % in drei Jahren.

**Inhalt (Wortlaut der Folie):** Kicker: „PROGRAMMTEIL 2.1 · MIETEN“. Titelzeilen: „Höchstmiete in Programmteil 2.1:“ | „6,50–9,00 € je m², drei Jahre fest“ (Signaturwort: „drei Jahre fest“). Diagrammtitel: „HÖCHSTMIETE NETTOKALT, JAHRE 1–3“. Untertitel: „€ je m² und Monat · nach Einkommensgruppe und Mietenstufe“. Legende: „Mietenstufe I–III“ · „Mietenstufe IV–VII“. Säulenwerte: A 6,50 | 6,80 · B 7,90 | 8,20 · C 8,70 | 9,00. Zwei Marken: „Angebotsmiete Niedersachsen 2024, Mittel (landesweit): 9,00“ · „Angebotsmiete Neubau Niedersachsen 2024, Median (landesweit): 11,22“. Zeile unter dem Diagramm: „Ab EH-40-Niveau bis zu +0,30 €.“ Kommentarspalte, Modultitel „MIETPFAD“ mit der Unterzeile „Gruppe A · Mietenstufe IV–VII“, darunter drei Zeilen: „Jahr 1–3“ · „6,80 €“ | „ab Jahr 4“ · „höchstens“ · „7,21 €“ | „ab Jahr 7“ · „höchstens“ · „7,65 €“. Modultitel „REGEL“: „Ab Jahr 4 höchstens +6,15 % in drei Jahren, auch bei Wiedervermietung; keine Staffel- oder Indexmiete.“ Modultitel „GRUPPEN“: „Grundsatz ist Gruppe A; B und C nur mit Zulassung in der Förderentscheidung.“

**Darstellung:** Dominant: natives gruppiertes Säulendiagramm über 8 Spalten, Kategorien A, B, C (Achskreise als Kategorienbeschriftung), 2 Reihen: „Mietenstufe I–III“ in B4B0AB, „Mietenstufe IV–VII“ in Tinte 202020; Werte über den Säulen (Montserrat Bold 12, Format [$-407]0.00); y-Achse 0 bis 12 €, Schritt 2. Zwei waagerechte gestrichelte Marken in 77716B als Formen bei 9,00 und 11,22 (1 pt); die Beschriftung steht dreizeilig rechts auf der Verlängerung der Linie (11 pt, über der oberen und unter der unteren Marke), und die Linie setzt an den Datenbeschriftungen und über der Säule 9,00 aus. Rechts Kommentarspalte mit drei Einträgen (14 pt), der Mietpfad als kleine native Tabelle mit den Werten in Montserrat Bold. Schlüsselplan mit 2.1 aktiv, Daumenregister 2.1. Kein Rot im Diagramm.

**Daten:** werte.json, Lauf modellhaus: tab.hoechstmiete.I.A/B/C, tab.hoechstmiete.IV.A/B/C, tab.jahre_ohne_mieterhoehung, tab.mieterhoehung_in_der_bindung, tab.zuschlag_hoechstmiete_eh40. Mietpfad 7,21 und 7,65 sowie Angebotsmieten 9,00 und 11,22: Broschüre S. 7 (07-ertragsseite-mieten.json, blocks[1]) über daten/regeln.json; nicht aus zr.miete.A, weil die Mappe ungerundet mit 7,2182 und 7,6621 weiterrechnet.

**Herkunft:** Broschüre S. 7 (Gruppen S. 6); Säulenform nach Altfassung Folie 10

**Sprechernotizen**

- Die Einnahmen sind vorgegeben: Programmteil, Einkommensgruppe und Mietenstufe legen die Höchstmiete fest.
- Gruppe A bis zur Einkommensgrenze, B bis 40 % darüber, C bis 60 % darüber; die Grenzen stehen im Anhang A5.
- Drei Jahre fest, danach höchstens +6,15 % in drei Jahren: für Gruppe A in Mietenstufe IV–VII höchstens 7,21 € ab Jahr 4 und 7,65 € ab Jahr 7.
- Zum Vergleich die Angebotsmieten 2024 im Land: 9,00 € im Mittel, 11,22 € im Neubau (Median).
- Vermietung nur an Haushalte mit Wohnberechtigungsschein. Die Modellrechnung nutzt 6,80 | 8,20 | 9,00 €.

**Quellenzeile der Notizen:** Quelle: RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319); Angebotsmieten: NBank-Wohnungsmarktbericht 2025; Broschüre S. 6 und 7.

### 11 · In jeder Einkommensgruppe bis zu 80 % Förderquote

ID `foerdermix` · Abschnitt Programmteil 2.1 · Layout `PGN_DIAGRAMM` · Baugruppe regeln

**Aussage:** Darlehen und Zuschuss tragen in A, B und C zusammen bis zu 80 % der zuwendungsfähigen Kosten; von A nach C wird Zuschuss zu Darlehen.

**Inhalt (Wortlaut der Folie):** Kicker: „PROGRAMMTEIL 2.1 · FÖRDERMIX“. Titelzeilen: „In jeder Einkommensgruppe“ | „bis zu 80 % Förderquote“ (Signaturwort: „80 %“). Diagrammtitel: „FÖRDERMIX JE EINKOMMENSGRUPPE“. Untertitel: „Höchstsätze in % der zuwendungsfähigen Kosten“. Legende: „Zuschuss“ · „Darlehen“ · „Eigenmittel, mind.“ Balken (Zuschuss | Darlehen | Eigenmittel): A 40 % | 40 % | 20 % · B 20 % | 60 % | 20 % · C 10 % | 70 % | 20 %. Maßkette über Balken A: „40 %“ | „40 %“ | „20 %“; 80-%-Achse mit Achskreis „80“. Kommentarspalte (14 pt), Modultitel „REGELFALL GRUPPE A“: „B und C mit Zulassung in der Förderentscheidung. Der Zuschuss wird nur zusammen mit dem Darlehen gewährt.“ Modultitel „EIGENMITTEL“: „Mindestens 20 % der zuwendungsfähigen Kosten; mindestens die Hälfte als Geld oder lastenfreies Grundstück.“ Modultitel „BEMESSUNGSGRENZE“: „4.800 € je m² Wohnfläche in Mietenstufe I–III, 5.000 € in IV–VII; Ausgangswerte, fortgeschrieben zum 01.04. und 01.10.; aktuell auf nbank.de.“

**Darstellung:** Dominant: Signatur-Diagramm der Broschüre S. 8 wie Probe 2: natives gestapeltes Balkendiagramm (waagerecht, Achse 0 bis 100, Schritt 20), Kategorien in der Reihenfolge C, B, A übergeben, 3 Reihen: Zuschuss in accent1 B71E3F, Darlehen in 202020, Eigenmittel mit Merkfarbe DCD8D2 (wird zur Schraffur); Werte im Segment. Darüber als Formen: Achskreise A, B, C, Maßkette 40 | 40 | 20, rote 80-%-Achse (lgDashDot) mit Achskreis „80“, Maßstabsleiste. Rechts Kommentarspalte mit drei Einträgen. Schlüsselplan mit 2.1 aktiv, Daumenregister 2.1.

**Daten:** werte.json, Lauf modellhaus: tab.quote_zuschuss.A/B/C, tab.quote_darlehen.A/B/C, tab.eigenmittel_mindestens, tab.bemessungsgrenze.I, tab.bemessungsgrenze.IV. Wortlaut: Broschüre S. 8 (08-programmteil-2-1.json).

**Herkunft:** Broschüre S. 8

**Sprechernotizen**

- In allen drei Gruppen tragen Darlehen und Zuschuss zusammen bis zu 80 % der zuwendungsfähigen Kosten; von A nach C wird Zuschuss zu Darlehen.
- Zuwendungsfähig sind die Herstellungskosten bis zur Bemessungsgrenze mal Wohnfläche, dazu die Grundstückskosten bis zum Bodenrichtwert.
- Gefördert werden Mehrfamilienhäuser ab drei Wohnungen: Neubau, Änderung und Erweiterung, Ersterwerb bis zwei Jahre nach Fertigstellung.
- Zuschlag auf den Zuschuss: Modellprojekt +5, Housing First +10 Prozentpunkte.
- Nicht mit Programmteil 2.2 kombinierbar; je Wohnung ist ein KfW-Kredit 298 oder 296 möglich.

**Quellenzeile der Notizen:** Quelle: RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319); Broschüre S. 8.

### 12 · 35 Jahre zinsfrei und gebunden, höchstens 42 Jahre Laufzeit

ID `eckdaten-zeitstrahl` · Abschnitt Programmteil 2.1 · Layout `PGN_INHALT` · Baugruppe regeln

**Aussage:** Das Darlehen kostet bis Ende Jahr 35 keinen Zins, dafür 0,5 % Verwaltungskostenbeitrag im Jahr und einmalige Entgelte; die Wohnungen sind 35 Jahre gebunden, den Tilgungssatz legt die NBank fest.

**Inhalt (Wortlaut der Folie):** Kicker: „PROGRAMMTEIL 2.1 · ECKDATEN“. Titelzeilen: „35 Jahre zinsfrei und gebunden,“ | „höchstens 42 Jahre Laufzeit“ (Signaturwort: „35 Jahre“). Modultitel: „DARLEHEN UND BINDUNG IM ZEITVERLAUF“. Achse: „Jahre ab Bezugsfertigkeit“ mit den Marken „0“ · „35“ · „42“. Bänder: „Bauphase Neubau: Auszahlung in Raten“ · „0 % Zins ab Auszahlung bis Ende Jahr 35“ · „Belegungs- und Mietbindung 35 Jahre“ · „Laufzeit höchstens 42 Jahre“, über dem hellen Abschnitt der Laufzeit „ab Jahr 36 verzinst“. Maßkette: „35 Jahre“ | „7 Jahre“. Darunter drei Felder. Feld 1: Kennzahl „0,5 % p. a.“ · Label „Verwaltungskostenbeitrag“ · Text „auf das Restkapital, ab Auszahlungsbeginn“. Feld 2: Kennzahl „1 % / 0,75 %“ · Label „Bearbeitungsentgelt, einmalig“ · Text „des Darlehens / des Zuschusses“. Feld 3: Modultitel „TILGUNG“ · „Den Satz legt die NBank fest. Beginn nach vollständiger Auszahlung.“

**Darstellung:** Dominant: Zeitstrahl aus nativen Formen über 12 Spalten: vier waagerechte Bänder über einer Jahresachse 0 bis 42 (Bauphase links von 0), Achskreise M an 0, 35 und 42, Maßkette 35 | 7 über den Bändern. Farben: Bindung in Tinte 202020 mit weißer Schrift, 0 % Zins als Papierfläche mit Rahmen 0,75 pt, Laufzeit Jahr 0 bis 35 in 77716B und Jahr 36 bis 42 in B4B0AB mit Beschriftung, Bauphase als Rahmen ohne Füllung links vor der Achse; kein Rot in den Bändern. Darunter im Raster 5 + 4 + 3 zwei Kennzahl-Kacheln (44 pt, Einheit in Rot) und ein Planlegenden-Eintrag „Tilgung“ (14 pt). Daumenregister 2.1.

**Daten:** Broschüre S. 9 (09-konditionen-term-sheet.json: blocks[0] Zeitstrahl mit bands und axis.ticks; blocks[1].rows Zins, Tilgung, Kosten laufend, Kosten einmalig). Abgleich: werte.json, Lauf modellhaus, tab.zins_nbank_bis_jahr35, tab.zinsfreie_jahre, tab.bindung, tab.laufzeit_hoechstens, tab.verwaltungskostenbeitrag, tab.bearbeitungsentgelt_darlehen, tab.bearbeitungsentgelt_zuschuss.

**Herkunft:** Broschüre S. 9 (ersetzt Altfassung Folie 25)

**Sprechernotizen**

- Zinsfrei bis Ende des 35. Jahres nach Bezugsfertigkeit; danach bis zu 3 Prozentpunkte über dem Basiszinssatz, höchstens marktüblich.
- Die Förderung bindet Belegung und Miete für 35 Jahre.
- Laufend 0,5 % Verwaltungskostenbeitrag auf das Restkapital; einmalig 1 % des Darlehens und 0,75 % des Zuschusses.
- Auszahlung im Neubau in Raten: je bis zu 30 % bei Baubeginn, Rohbau und Innenputz, 10 % nach Fertigstellung und Belegung.
- Einen Tilgungssatz nennt die Richtlinie nicht, die NBank legt ihn fest; die Modellrechnung nimmt 2,5 % an. Alle Eckdaten im Anhang A6.

**Quellenzeile der Notizen:** Quelle: RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319); Broschüre S. 9.

### 13 · Ihre Rechnung: das Modellhaus

ID `trenner-rechnung` · Abschnitt Ihre Rechnung · Layout `PGN_ABSCHNITT_ROT` · Baugruppe struktur

**Aussage:** Ein Neubau mit 20 Wohnungen wird einmal gefördert und einmal frei finanziert gerechnet.

**Inhalt (Wortlaut der Folie):** Achskreis XL: „3“. Titelzeilen: „Ihre Rechnung:“ | „das Modellhaus“ (Signaturwort: „Modellhaus“; gesetzt in Versalien, 40 pt). Lead: „Ein Neubau mit 20 Wohnungen nach Programmteil 2.1, einmal gefördert und einmal frei finanziert gerechnet.“ Rubrik im Schriftfeld: „IHRE RECHNUNG“. Achsleiste auf der oberen Rahmenlinie: Achskreise „1“ bis „4“ für Ausgangslage, Programmteil 2.1, Ihre Rechnung, Umsetzung; die „3“ gefüllt.

**Darstellung:** Dominant: Achskreis XL mit der „3“ und der Titel (Montserrat Black 40 pt) auf Rotverlauf (bg-rot.png). Weißer Planrahmen, Logo rot auf weißem Feld, Achsleiste mit vier Achskreisen M, der dritte gefüllt. Roter Trenner wie vor jedem Abschnitt des Hauptteils. Ohne Stempel, weil die Folie keine Ergebniszahl trägt. Wie Probe 14.

**Daten:** werte.json, Lauf modellhaus: eingabe.wohnungen. Satz zur Liquidität: Broschüre S. 11 (11-wirtschaftlichkeit.json, Annahmen). Kapitelname „Ihre Rechnung“: Kolumnentitel der Broschüre S. 10 bis 12.

**Herkunft:** neu; Kapitelname und Satz aus der Broschüre S. 10 und 11

**Sprechernotizen**

- Ab hier wird gerechnet: das Modellhaus der Broschüre S. 10 bis 12, dieselben Zahlen wie in der Rechenmappe.
- Zuerst Finanzierung und Jahresrechnung, dann der Vergleich mit der freien Finanzierung: Kapitaldienst, Zahlungsfluss, nötige Miete.
- Danach: Tilgungssatz, Verlauf über 35 Jahre, Herstellungskosten je m².
- Alle Folien mit dem Stempel sind Modellrechnungen: fiktives Beispiel, keine Förderzusage.

**Quellenzeile der Notizen:** Quelle: Modellrechnung der PGN (VOFI-Mappe v3); Broschüre S. 10 bis 12.

### 14 · 20 Wohnungen, 7,0 Mio. €: bis zu 5,6 Mio. € Förderung

ID `rechnung-finanzierung` · Abschnitt Ihre Rechnung · Layout `PGN_INHALT_MR` · Baugruppe rechnung

**Aussage:** Von 7,0 Mio. € Gesamtkosten kommen bis zu 5,6 Mio. € aus Darlehen und Zuschuss, mindestens 1,4 Mio. € sind Eigenmittel.

**Inhalt (Wortlaut der Folie):** Kicker: „IHRE RECHNUNG · FINANZIERUNG“. Stempel: „MODELLRECHNUNG“ mit Zusatz „fiktives Beispiel, keine Förderzusage“ (einzige Vollversion). Titelzeilen: „20 Wohnungen, 7,0 Mio. €:“ | „bis zu 5,6 Mio. € Förderung“ (Signaturwort: „5,6 Mio. €“). Deck: „20 Neubauwohnungen nach Programmteil 2.1 · 1.400 m² Wohnfläche · Gruppe A · Mietenstufe IV–VII“. Diagrammtitel: „FINANZIERUNG 7,0 MIO. €, HÖCHSTSÄTZE“. Balkensegmente: „Zuschuss 2,8 Mio. € · 40 %“ | „Darlehen 2,8 Mio. € · 40 %“ | „Eigenmittel, mind. 1,4 Mio. € · 20 %“. Maßkette: „Förderung 5,6 Mio. € · 80 %“ | „20 %“. Rechenblatt „RECHENWEG, IN €“: 1 „Herstellungskosten, 1.400 m² × 4.500 €“ 6.300.000 · 2 „+ Grundstück“ 700.000 · 3 „= zuwendungsfähige Kosten“ 7.000.000 · 4 „Eigenmittel, mindestens 20 %“ 1.400.000. Notiz unter dem Rechenblatt (12 pt): „Von den Eigenmitteln sollen mindestens 700.000 € Geld oder lastenfreies Grundstück sein. 4.500 € je m² liegen 500 € unter dem Ausgangswert der Bemessungsgrenze von 5.000 €.“ Kennzahl 1: Vorsatz „BIS ZU“ · „140.000 €“ · Label „Ø Zuschuss je Wohnung“ · Text „plus Darlehen in gleicher Höhe“. Kennzahl 2: Vorsatz „MIND.“ · „70.000 €“ · Label „Ø Eigenmittel je Wohnung“ · Text „20 % von 350.000 € Gesamtkosten“.

**Darstellung:** Dominant: ein nativer gestapelter Balken (waagerecht, eine Kategorie, Achse 0 bis 7 Mio. €, Format [$-407]0.0) über 8 Spalten mit 3 Reihen: Zuschuss in accent1, Darlehen in 202020, Eigenmittel schraffiert (Merkfarbe DCD8D2); Beschriftung im Segment. Darüber Maßkette „Förderung 5,6 Mio. € · 80 %“ | „20 %“ und rote 80-%-Achse mit Achskreis „80“, dieselben Zeichen wie auf Folie 11. Darunter über 8 Spalten ein Rechenblatt (addTable) mit vier nummerierten Zeilen (14 pt, Zeile 3 als Summenzeile, keine rote Ergebniszeile). Rechts in 4 Spalten zwei Kennzahl-Kacheln untereinander (44 pt, Einheit in Rot). Papierton, Daumenregister 2.1.

**Daten:** werte.json, Lauf modellhaus: eingabe.wohnungen, eingabe.wohnflaeche, eingabe.herstellungskosten_qm, eingabe.mietenstufe, fin.herstellungskosten, fin.grundstueck, fin.zuwendungsfaehige_kosten.A, fin.gesamtkosten.A, fin.zuschuss.A, fin.darlehen_nbank.A, fin.foerderung.A, fin.foerderquote.A, fin.eigenmittel.A, fin.zuschussquote.A, fin.darlehensquote.A, fin.eigenmittelquote.A, fin.eigenmittel_bar, fin.bemessungsgrenze_qm, fin.zuschuss_je_wohnung.A, fin.eigenmittel_je_wohnung.A. 350.000 € = fin.gesamtkosten.A ÷ eingabe.wohnungen, im Code gerechnet. Wortlaut: Broschüre S. 10 (10-modellrechnung-neubau.json).

**Herkunft:** Mappe (Lauf modellhaus); Broschüre S. 10 (ersetzt Altfassung Folie 11)

**Sprechernotizen**

- Das Modellhaus: 20 Wohnungen (2 × 50, 6 × 60, 8 × 75, 4 × 85 m²), zusammen 1.400 m², alle für Gruppe A, Mietenstufe IV–VII, angespannter Wohnungsmarkt.
- Herstellungskosten 4.500 € je m², dazu 700.000 € Grundstück: 7,0 Mio. € zuwendungsfähige Kosten.
- Davon bis zu 2,8 Mio. € Zuschuss und 2,8 Mio. € Darlehen; mindestens 1,4 Mio. € Eigenmittel, die Hälfte als Geld oder lastenfreies Grundstück.
- Je Wohnung bis zu 140.000 € Zuschuss und mindestens 70.000 € Eigenmittel.
- Alle Sätze sind Höchstsätze; maßgeblich ist die Förderentscheidung der NBank.

**Quellenzeile der Notizen:** Quelle: Modellrechnung der PGN, VOFI-Mappe v3, Blatt Übersicht (D9 bis D25); RL Mietwohnraum 2026; Broschüre S. 10.

### 15 · Jahr 1: Zahlungsüberschuss 455 € in A, Fehlbeträge in B und C

ID `rechnung-jahr1` · Abschnitt Ihre Rechnung · Layout `PGN_TABELLE_MR` · Baugruppe rechnung

**Aussage:** Bei 2,5 % Tilgung (Annahme) deckt die Höchstmiete in Gruppe A den Kapitaldienst knapp; B und C schließen Jahr 1 mit einem Fehlbetrag.

**Inhalt (Wortlaut der Folie):** Kicker: „IHRE RECHNUNG · WIRTSCHAFTLICHKEIT“. Stempel: „MODELLRECHNUNG“. Titelzeilen: „Jahr 1: Zahlungsüberschuss 455 €“ | „in A, Fehlbeträge in B und C“ (Signaturwort: „455 €“). Tabellentitel: „JAHRESRECHNUNG JAHR 1, IN € P. A.“ Untertitel: „Höchstmiete nettokalt, Mietenstufe IV–VII: 6,80 | 8,20 | 9,00 € je m² (A | B | C)“. Spalten: Nr. · Position · A · B · C. Zeilen: 1 „Sollmiete zur Höchstmiete“ 114.240 | 137.760 | 151.200 · ohne Nummer „− Mietausfall/Leerstand, 2 %“ 2.285 | 2.755 | 3.024 · 2 „− Objektverwaltung, 367 € je Wohnung“ 7.340 | 7.340 | 7.340 · 3 „− Instandhaltung, 14,40 € je m²“ 20.160 | 20.160 | 20.160 · 4 „= Überschuss vor Kapitaldienst“ 84.455 | 107.505 | 120.676 · 5 „− Verwaltungskostenbeitrag, 0,5 %“ 14.000 | 21.000 | 24.500 · 6 „− Zins NBank-Darlehen, 0 %“ 0 | 0 | 0 · 7 „− Tilgung 2,5 % p. a. (Annahme)“ 70.000 | 105.000 | 122.500 · 8 „= Zahlungsüberschuss p. a.“ 455 | −18.495 | −26.324. Notiz unter der Tabelle (12 pt): „Einmalig, außerhalb der Jahresrechnung: Bearbeitungsentgelte 49.000 | 52.500 | 54.250 €“. Kommentarspalte, Modultitel „ANNAHMEN“: „Liquidität in Jahr 1 bei Kostenstand 2026, keine Rendite.“ · „Tilgung auf 2,8 | 4,2 | 4,9 Mio. € Darlehen.“ · „B und C setzen eine Zulassung in der Förderentscheidung voraus.“

**Darstellung:** Dominant: native Rechenblatt-Tabelle (addTable) über 8 Spalten: Nummernstreifen in E9E7E4, Rechenzeichen vor der Position, drei Wertspalten je 1,20 Zoll rechtsbündig (Montserrat Bold), 12 pt, Zeilenhöhe 0,34; Summenstrich über Zeile 4 und Zeile 8; Ergebniszeile 8 weiß auf PGN-Rot; Spaltenköpfe als Achskreise A, B, C. Zeilennummern wie Broschüre S. 11. Rechts Planlegende „Annahmen“ über 4 Spalten (16 pt). Papierton, Daumenregister 2.1.

**Daten:** werte.json, Lauf modellhaus: jr1.sollmiete.A/B/C, jr1.mietausfall.A/B/C, jr1.objektverwaltung.A/B/C, jr1.instandhaltung.A/B/C, jr1.ueberschuss_vor_kapitaldienst.A/B/C, jr1.verwaltungskostenbeitrag.A/B/C, jr1.zins_nbank.A/B/C, jr1.tilgung_nbank.A/B/C, jr1.zahlungsueberschuss.A/B/C, jr1.bearbeitungsentgelte.A/B/C, jr1.satz.mietausfall, jr1.satz.objektverwaltung, jr1.satz.instandhaltung, jr1.satz.verwaltungskostenbeitrag, jr1.satz.zins_nbank, jr1.satz.tilgung_nbank, fin.miete_jahr1.A/B/C, fin.darlehen_nbank.A/B/C. Positionstexte gekürzt nach Broschüre S. 11 (11-wirtschaftlichkeit.json).

**Herkunft:** Mappe (Lauf modellhaus); Broschüre S. 11 (ersetzt Altfassung Folie 13)

**Sprechernotizen**

- Zeilen 1 bis 4: Aus der Höchstmiete bleiben nach Mietausfall, Objektverwaltung und Instandhaltung 84.455 € in Gruppe A.
- Zeilen 5 bis 7: kein Zins, 0,5 % Verwaltungskostenbeitrag, Tilgung 2,5 % als Annahme. Kapitaldienst in A: 84.000 €.
- Zeile 8: In A bleiben 455 €. B und C tragen mehr Darlehen, als die höhere Miete in Jahr 1 bedient: −18.495 und −26.324 €.
- B und C haben in dieser Rechnung neun Jahre Fehlbetrag (Folie 21). Bei vorübergehendem Fehlbetrag kann die NBank den Tilgungsbeginn um bis zu fünf Jahre hinausschieben.
- Zunächst Gruppe A im Vergleich mit der freien Finanzierung; B und C folgen auf den Folien 20 und 21.

**Quellenzeile der Notizen:** Quelle: Modellrechnung der PGN, VOFI-Mappe v3, Blatt Übersicht (D29:F39), Eingaben 3.1 und 5.1 bis 5.3; Broschüre S. 11 und 21.

### 16 · Kapitaldienst in Jahr 1: 84.000 € statt 313.703 € frei finanziert

ID `rechnung-kapitaldienst` · Abschnitt Ihre Rechnung · Layout `PGN_DIAGRAMM_MR` · Baugruppe rechnung

**Aussage:** Dasselbe Haus kostet frei finanziert in Jahr 1 313.703 € Kapitaldienst, gefördert in Gruppe A 84.000 €, weil 5,6 Mio. € Bankdarlehen verzinst werden.

**Inhalt (Wortlaut der Folie):** Kicker: „IHRE RECHNUNG · KAPITALDIENST“. Stempel: „MODELLRECHNUNG“. Titelzeilen: „Kapitaldienst in Jahr 1: 84.000 €“ | „statt 313.703 € frei finanziert“ (Signaturwort: „84.000 €“). Diagrammtitel: „KAPITALDIENST IN JAHR 1“. Untertitel: „in € p. a. · gleiches Haus, gefördert und frei finanziert“. Legende: „Tilgung“ · „Zins“ · „Verwaltungskostenbeitrag“. Balken „Gefördert, Gruppe A“: Tilgung 70.000 · Verwaltungskostenbeitrag 14.000 · Summe „84.000 €“. Balken „Frei finanziert“: Tilgung 104.263 · Zins 209.440 · Summe „313.703 €“. Kommentarspalte, Modultitel „ANNAHMEN“: „Frei finanziert: gleiches Haus, Eigenmittel 1,4 Mio. €, Bankdarlehen 5,6 Mio. € zu 3,74 % Zins, Annuität über 30 Jahre. Objektverwaltung und Instandhaltung wie gefördert.“ · „Gefördert: Zuschuss 2,8 Mio. €, Darlehen 2,8 Mio. € zu 0 % Zins, Tilgung 2,5 % p. a.“

**Darstellung:** Dominant: natives gestapeltes Balkendiagramm (waagerecht) über 8 Spalten mit 2 Kategorien (übergeben als „Frei finanziert“, „Gefördert, Gruppe A“, damit gefördert oben steht) und 3 Reihen: Tilgung in Tinte 202020, Zins in 77716B, Verwaltungskostenbeitrag in B4B0AB; Werte im Segment; x-Achse 0 bis 350.000 €, Schritt 50.000, Format [$-407]#,##0. Die Summen 84.000 € und 313.703 € als Formen am Balkenende (Montserrat ExtraBold 24). Kein Rot im Diagramm. Rechts Planlegende „Annahmen“ mit zwei Absätzen (16 pt). Papierton, Daumenregister 2.1.

**Daten:** werte.json, Lauf modellhaus: dscr.kapitaldienst_jahr1.A, dscr.kapitaldienst_jahr1.Frei, jr1.tilgung_nbank.A, jr1.verwaltungskostenbeitrag.A, jr1.zins_nbank.A, frei.zins_jahr1 und frei.tilgung_jahr1 (Vorzeichen drehen), frei.annuitaet, fin.bankdarlehen.Frei, fin.eigenmittel.Frei, fin.eigenmittel.A, fin.zuschuss.A, fin.darlehen_nbank.A, eingabe.zins_bank, eingabe.laufzeit_bank, eingabe.tilgung_nbank. Wortlaut der Annahmen: Broschüre S. 11.

**Herkunft:** Mappe (Lauf modellhaus); Broschüre S. 11; Zerlegung in Zins und Tilgung aus dem Blatt „Frei finanziert“ (ersetzt Altfassung Folie 14)

**Sprechernotizen**

- Gleiches Haus, gleiche Eigenmittel von 1,4 Mio. €; verschieden ist die Herkunft der übrigen 5,6 Mio. €.
- Gefördert: 2,8 Mio. € als Zuschuss, 2,8 Mio. € als zinsfreies Darlehen. Kapitaldienst 84.000 €: 70.000 € Tilgung, 14.000 € Verwaltungskostenbeitrag.
- Frei finanziert: 5,6 Mio. € Bankdarlehen zu 3,74 %, Annuität über 30 Jahre. Kapitaldienst 313.703 €: 209.440 € Zins, 104.263 € Tilgung.
- 3,74 % und 30 Jahre sind Annahmen der PGN, wie in der Rechenmappe; den Zinsverlauf zeigt Folie 4.
- Die nächsten beiden Folien zeigen, wohin die Miete in beiden Fällen fließt. Regie: keine Rendite und keine Marktmiete nennen.

**Quellenzeile der Notizen:** Quelle: Modellrechnung der PGN, VOFI-Mappe v3, Blatt Übersicht (D13, D14, G18, D111, G111), Blatt Frei finanziert (J7, K7), Eingaben 6.1 und 6.4; Broschüre S. 11.

### 17 · Gefördert: 61,3 % der Miete fließen in die Tilgung

ID `rechnung-fluss-gefoerdert` · Abschnitt Ihre Rechnung · Layout `PGN_INHALT_MR` · Baugruppe fluss

**Aussage:** Von 114.240 € Sollmiete zur Höchstmiete fließen in Jahr 1 70.000 € in die Tilgung des zinsfreien NBank-Darlehens; nach Bewirtschaftung und Verwaltungskostenbeitrag bleibt ein Zahlungsüberschuss von 455 €.

**Inhalt (Wortlaut der Folie):** Kicker: „IHRE RECHNUNG · ZAHLUNGSFLUSS GEFÖRDERT“. Stempel: „MODELLRECHNUNG“. Titelzeilen: „Gefördert: 61,3 % der Miete“ | „fließen in die Tilgung“ (Signaturwort: „61,3 %“). Modultitel: „ZAHLUNGSFLUSS IN JAHR 1, GEFÖRDERT“. Untertitel: „in € p. a. und in % der Sollmiete · Modellhaus, Gruppe A · gleicher Maßstab wie frei finanziert“. Quelle links: „Sollmiete zur Höchstmiete“ · „114.240 €“ · „6,80 € je m² und Monat“. Umriss an der Quelle: „frei finanziert nötig: 348.167 €“. Knoten in der Mitte: „Überschuss vor Kapitaldienst“ · „84.455 €“. Ziele rechts, von oben: „Tilgung“ · „70.000 € · 61,3 %“ | „Zins NBank-Darlehen“ · „0 €“ | „Verwaltungskostenbeitrag“ · „14.000 € · 12,3 %“ | „Zahlungsüberschuss“ · „455 € · 0,4 %“ | „Instandhaltung“ · „20.160 € · 17,6 %“ | „Objektverwaltung“ · „7.340 € · 6,4 %“ | „Mietausfall/Leerstand“ · „2.285 € · 2,0 %“. Im Band der Tilgung: „61,3 %“. Maßlinie an Tilgung, Zins und Verwaltungskostenbeitrag: „Kapitaldienst 84.000 €“.

**Darstellung:** Dominant: Flussdiagramm über 12 Spalten aus nativen Freihandformen (Punktangabe von pptxgenjs, kein Bild; Baustein D.fluss der Bibliothek, gemeinsame Anlage beider Folien in folien/_fluss.cjs), von links nach rechts: die Quelle als senkrechter Balken in Tinte, links davon rechtsbündig Bezeichnung (Work Sans SemiBold 12), Betrag (Montserrat ExtraBold 24) und Zusatz (12 pt grau); der Knoten „Überschuss vor Kapitaldienst“ in der Mitte, Bezeichnung und Betrag in einer Zeile darüber; rechts die Ziele untereinander, je Ziel eine Zeile mit der Bezeichnung am Balken (Work Sans SemiBold 12) und Betrag und Anteil rechtsbündig in einer Spalte (Montserrat Bold 12). Jedes Band ist so dick wie sein Betrag; der Maßstab ist 160.000 € je Zoll Höhe. Maßstab, Lagen der Knoten, Oberkante und Reihenfolge der Ziele sind auf den Folien 17 und 18 gleich, damit beim Blättern nur die Höhen wechseln. Die Ströme über den Knoten tragen schon von der Quelle an die Farbe ihres Ziels: An der Quelle ist abzulesen, welcher Teil der Miete wohin fließt. Farbrollen wie auf Folie 16: Tilgung in Tinte; Verwaltungskostenbeitrag im Referenzgrau des Themes mit 50 % Transparenz (auf Papierton wie B4B0AB); Instandhaltung, Objektverwaltung und Mietausfall im Referenzgrau mit 70 % Transparenz (wie CFCCC8) und feiner Kontur. Die Balken der Ziele tragen die Farbe ihres Bands. Ströme unter 1,5 pt Stärke stehen als Linie: der Zahlungsüberschuss in Tinte mit der Mindeststärke 0,75 pt (455 € wären im Maßstab dünner als eine Haarlinie), der Mietausfall in seiner wahren Stärke. „Zins NBank-Darlehen 0 €“ steht als Zeile ohne Band in Grau. Der Anteil der Tilgung steht als Kernwert weiß im Band (Montserrat ExtraBold 24), wie die Werte in den Balken der Folie 19. Eine senkrechte Maßlinie (0,75 pt Anthrazit) mit kurzen Querstrichen fasst die Zeilen Tilgung, Zins und Verwaltungskostenbeitrag zum Kapitaldienst. An der Quelle setzt ein gestrichelter Umriss (0,75 pt, 77716B, ohne Füllung, so breit wie der Balken) den Balken nach unten fort bis zur Höhe von 348.167 €: so viel Sollmiete braucht dasselbe Haus frei finanziert (Quelle der Folie 18, selber Maßstab). Links daneben stehen rechtsbündig zwei Zeilen, bündig mit der Unterkante des Umrisses: die Bezeichnung (12 pt) und der Betrag (Montserrat Bold 12). Die Bänder beginnen rechts neben dem Balken und bleiben frei. Ein Rahmen ohne Füllung trägt den Alternativtext des Diagramms (jeder Strom mit Betrag und Anteil); Bänder und Knoten sind als Schmuck gekennzeichnet. Darüber ein Modulkopf mit Titel und Untertitel über 12 Spalten. Papierton, Stempel, Daumenregister 2.1. Kein Rot im Diagramm.

**Daten:** werte.json, Lauf modellhaus: jr1.sollmiete.A, fin.miete_jahr1.A, jr1.mietausfall.A, jr1.objektverwaltung.A, jr1.instandhaltung.A, jr1.ueberschuss_vor_kapitaldienst.A, jr1.verwaltungskostenbeitrag.A, jr1.zins_nbank.A, jr1.tilgung_nbank.A, jr1.zahlungsueberschuss.A, dscr.kapitaldienst_jahr1.A; für den Umriss dscr.noetige_miete.Frei und eingabe.wohnflaeche (nötige Sollmiete frei finanziert = dscr.noetige_miete.Frei × eingabe.wohnflaeche × 12, wie auf Folie 18). Anteile im Code gerechnet (Betrag ÷ jr1.sollmiete.A, eine Nachkommastelle); Belege mit Formel in daten/pruefung.json („Folie 17“). Summenprobe im Modul: Mietausfall + Objektverwaltung + Instandhaltung + Überschuss vor Kapitaldienst = Sollmiete; Verwaltungskostenbeitrag + Zins + Tilgung + Zahlungsüberschuss = Überschuss vor Kapitaldienst; Verwaltungskostenbeitrag + Zins + Tilgung = dscr.kapitaldienst_jahr1.A.

**Herkunft:** Mappe (Lauf modellhaus, Jahresrechnung Jahr 1, Gruppe A); Form des Flussdiagramms nach Altfassung Folie 13 (dort als Pixelbild und für das Projekt der Altfassung)

**Sprechernotizen**

- Der Zahlungsfluss in Jahr 1 für das Modellhaus in Gruppe A: 114.240 € Sollmiete zur Höchstmiete von 6,80 € je m².
- Davon gehen 2.285 € für Mietausfall ab, 7.340 € für die Objektverwaltung und 20.160 € für die Instandhaltung. Es bleiben 84.455 € vor Kapitaldienst.
- Der Kapitaldienst ist der von Folie 16: 84.000 €. Zins fällt bis Ende Jahr 35 nicht an.
- 61,3 % der Miete tilgen das Darlehen: 70.000 €. Es bleibt ein Zahlungsüberschuss von 455 €.
- Der gestrichelte Umriss an der Quelle zeigt die Sollmiete, die dasselbe Haus frei finanziert braucht: 348.167 €. Die nächste Folie zeigt diesen Fall im selben Maßstab.

**Quellenzeile der Notizen:** Quelle: Modellrechnung der PGN, VOFI-Mappe v3, Blatt Übersicht (D26, D29:D38, D111, G112); Broschüre S. 11.

### 18 · Frei finanziert: 60,2 % der Miete gehen an Zinsen

ID `rechnung-fluss-frei` · Abschnitt Ihre Rechnung · Layout `PGN_INHALT_MR` · Baugruppe fluss

**Aussage:** Frei finanziert braucht dasselbe Haus in Jahr 1 348.167 € Sollmiete, damit der Zahlungsüberschuss null ist; 209.440 € davon sind Zins, 104.263 € Tilgung.

**Inhalt (Wortlaut der Folie):** Kicker: „IHRE RECHNUNG · ZAHLUNGSFLUSS FREI FINANZIERT“. Stempel: „MODELLRECHNUNG“. Titelzeilen: „Frei finanziert: 60,2 % der Miete“ | „gehen an Zinsen“ (Signaturwort: „60,2 %“). Modultitel: „ZAHLUNGSFLUSS IN JAHR 1, FREI FINANZIERT“. Untertitel: „in € p. a. und in % der Sollmiete · Miete, bei der der Zahlungsüberschuss null ist · gleicher Maßstab wie gefördert“. Quelle links: „Nötige Sollmiete“ · „348.167 €“ · „20,72 € je m² und Monat“. Maßkette an der Quelle: „Sollmiete zur Höchstmiete: 114.240 €“. Knoten in der Mitte: „Überschuss vor Kapitaldienst“ · „313.703 €“. Ziele rechts, von oben: „Tilgung“ · „104.263 € · 29,9 %“ | „Zins Bankdarlehen“ · „209.440 € · 60,2 %“ | „Zahlungsüberschuss“ · „0 €“ | „Instandhaltung“ · „20.160 € · 5,8 %“ | „Objektverwaltung“ · „7.340 € · 2,1 %“ | „Mietausfall/Leerstand“ · „6.963 € · 2,0 %“. Im Band des Zinses: „60,2 %“. Maßlinie an Tilgung und Zins: „Kapitaldienst 313.703 €“.

**Darstellung:** Dominant: Flussdiagramm über 12 Spalten aus nativen Freihandformen (Punktangabe von pptxgenjs, kein Bild; Baustein D.fluss der Bibliothek, gemeinsame Anlage beider Folien in folien/_fluss.cjs), von links nach rechts: die Quelle als senkrechter Balken in Tinte, links davon rechtsbündig Bezeichnung (Work Sans SemiBold 12), Betrag (Montserrat ExtraBold 24) und Zusatz (12 pt grau); der Knoten „Überschuss vor Kapitaldienst“ in der Mitte, Bezeichnung und Betrag in einer Zeile darüber; rechts die Ziele untereinander, je Ziel eine Zeile mit der Bezeichnung am Balken (Work Sans SemiBold 12) und Betrag und Anteil rechtsbündig in einer Spalte (Montserrat Bold 12). Jedes Band ist so dick wie sein Betrag; der Maßstab ist 160.000 € je Zoll Höhe. Maßstab, Lagen der Knoten, Oberkante und Reihenfolge der Ziele sind auf den Folien 17 und 18 gleich, damit beim Blättern nur die Höhen wechseln. Die Ströme über den Knoten tragen schon von der Quelle an die Farbe ihres Ziels: An der Quelle ist abzulesen, welcher Teil der Miete wohin fließt. Farbrollen wie auf Folie 16: Tilgung in Tinte, Zins in 77716B; Instandhaltung, Objektverwaltung und Mietausfall im Referenzgrau des Themes mit 70 % Transparenz (auf Papierton wie CFCCC8) und feiner Kontur. Die Balken der Ziele tragen die Farbe ihres Bands. „Zahlungsüberschuss 0 €“ steht als Zeile ohne Band in Grau. Der Anteil des Zinses steht als Kernwert weiß im Band (Montserrat ExtraBold 24), wie die Werte in den Balken der Folie 19. Links der Quelle misst eine senkrechte Maßkette (0,75 pt Anthrazit, 45°-Striche) von der Oberkante bis zur Höhe von 114.240 € den Teil der nötigen Sollmiete, den die Höchstmiete deckt; sie ist so hoch wie der Balken der Quelle auf Folie 17. Ihre Beschriftung steht zweizeilig links daneben, mittig zur Maßkette; Bezeichnung, Betrag und Zusatz der Quelle stehen darunter. Eine senkrechte Maßlinie mit kurzen Querstrichen fasst die Zeilen Tilgung und Zins zum Kapitaldienst. Ein Rahmen ohne Füllung trägt den Alternativtext des Diagramms (jeder Strom mit Betrag und Anteil); Bänder und Knoten sind als Schmuck gekennzeichnet. Darüber ein Modulkopf mit Titel und Untertitel über 12 Spalten. Papierton, Stempel, Daumenregister 2.1. Kein Rot im Diagramm.

**Daten:** werte.json, Lauf modellhaus: dscr.noetige_miete.Frei, eingabe.wohnflaeche, eingabe.mietausfall, jr1.objektverwaltung.Frei, jr1.instandhaltung.Frei, dscr.kapitaldienst_jahr1.Frei, frei.zins_jahr1 und frei.tilgung_jahr1 (Vorzeichen drehen), jr1.sollmiete.A (Marke). Im Code gerechnet: nötige Sollmiete = dscr.noetige_miete.Frei × eingabe.wohnflaeche × 12 (Gegenprobe: (Kapitaldienst + Objektverwaltung + Instandhaltung) ÷ (1 − eingabe.mietausfall)); Mietausfall = eingabe.mietausfall × nötige Sollmiete; Anteile = Betrag ÷ nötige Sollmiete, eine Nachkommastelle. Belege mit Formel in daten/pruefung.json („Folie 18“). Summenprobe im Modul wie auf Folie 17; der Zahlungsüberschuss ist null. Gerundet beschriftet bleibt 1 € Unterschied zwischen der Quelle (348.167 €) und der Summe der Ziele (348.166 €).

**Herkunft:** Mappe (Lauf modellhaus, Übersicht 8.2 und 8.3, Blatt Frei finanziert); Broschüre S. 11; Form des Flussdiagramms nach Altfassung Folie 14

**Sprechernotizen**

- Dasselbe Haus frei finanziert, im selben Maßstab wie die Folie davor: Die Miete, bei der der Zahlungsüberschuss null ist, liegt bei 20,72 € je m². Das sind 348.167 € im Jahr.
- Objektverwaltung und Instandhaltung sind gleich; der Mietausfall von 2 % wächst mit der Miete auf 6.963 €.
- 313.703 € gehen in den Kapitaldienst, wie auf Folie 16. 60,2 % der Miete sind Zins: 209.440 €.
- Regie: Die Miete ist hier eine Rechengröße, keine Marktmiete.
- Die nächste Folie stellt die nötige Miete je m² gegenüber: gefördert und frei finanziert.

**Quellenzeile der Notizen:** Quelle: Modellrechnung der PGN, VOFI-Mappe v3, Blatt Übersicht (D29, G31, G32, G111, G112), Blatt Frei finanziert (J7, K7), Eingaben 5.1, 6.1 und 6.4; Broschüre S. 11.

### 19 · Nötige Miete: 6,77 € gefördert, 20,72 € je m² frei finanziert

ID `rechnung-miete` · Abschnitt Ihre Rechnung · Layout `PGN_INHALT_MR` · Baugruppe rechnung

**Aussage:** Gefördert liegt die Miete, bei der der Zahlungsüberschuss null ist, mit 6,77 € unter der Höchstmiete von 6,80 €; frei finanziert liegt sie bei 20,72 €.

**Inhalt (Wortlaut der Folie):** Kicker: „IHRE RECHNUNG · NÖTIGE MIETE“. Stempel: „MODELLRECHNUNG“. Titelzeilen: „Nötige Miete: 6,77 € gefördert,“ | „20,72 € je m² frei finanziert“ (Signaturwort: „6,77 €“). Diagrammtitel: „NÖTIGE MIETE IN JAHR 1“. Untertitel: „Miete je m² und Monat, bei der der Zahlungsüberschuss null ist“. Balken „Gefördert, Gruppe A“: „6,77 €“. Balken „Frei finanziert“: „20,72 €“. Marke: „Höchstmiete Gruppe A: 6,80 €“. Tabelle „ZUM VERGLEICH: FREI FINANZIERT“ mit dem Untertitel „Bankdarlehen zu 3,74 % Zins, Annuität über 30 Jahre“, Spalten „Jahr 1“ · „Gefördert (A)“ · „Frei finanziert“: „Zuschuss“ 2,8 Mio. € | 0 · „Darlehen“ 2,8 Mio. € | 5,6 Mio. € · „Kapitaldienst p. a.“ 84.000 € | 313.703 € · „Nötige Miete je m²“ 6,77 € | 20,72 €.

**Darstellung:** Dominant: natives Balkendiagramm (waagerecht) über 6 Spalten (Raster 6 + 6) mit zwei Balken in derselben Reihenfolge und denselben Farben wie Folie 16: „Gefördert, Gruppe A“ in Tinte 202020, „Frei finanziert“ in 77716B; x-Achse 0 bis 24 €, Schritt 4, Format [$-407]0 wie die Achse der Folie 10; Werte am Balkenende als Formen (Montserrat ExtraBold 24). Senkrechte Maßlinie bei 6,80 € als Form (0,75 pt Anthrazit) mit Beschriftung. Rechts über 6 Spalten die Vergleichstabelle der Broschüre S. 11 (addTable, 4 Zeilen, 16 pt, Bezeichnungen einzeilig, Unterkante auf der Grundlinie des Diagramms) mit Zins und Laufzeit des Bankdarlehens als Untertitel: Spalte „Gefördert (A)“ weiß hervorgehoben, Vergleichsspalte in accent6, letzte Zeile als Kernzeile mit Oberlinie und Montserrat ExtraBold. Kein Rot im Diagramm. Papierton, Daumenregister 2.1.

**Daten:** werte.json, Lauf modellhaus: dscr.noetige_miete.A, dscr.noetige_miete.Frei, dscr.ziel, fin.miete_jahr1.A, fin.zuschuss.A, fin.darlehen_nbank.A, fin.bankdarlehen.Frei, dscr.kapitaldienst_jahr1.A, dscr.kapitaldienst_jahr1.Frei, eingabe.zins_bank, eingabe.laufzeit_bank. Für die Notizen: nötige Sollmiete frei finanziert (daten/pruefung.json, „Folie 18“), dscr.noetige_miete.B/C, fin.miete_jahr1.B/C, jr1.objektverwaltung.A, jr1.instandhaltung.A, jr1.satz.mietausfall, eingabe.wohnflaeche. Tabelle: Broschüre S. 11 („Zum Vergleich: frei finanziert“).

**Herkunft:** Mappe (Lauf modellhaus); Broschüre S. 11 (ersetzt Altfassung Folien 14 und 17)

**Sprechernotizen**

- Gefördert ist der Zahlungsüberschuss bei 6,77 € je m² null; das sind 0,03 € weniger als die Höchstmiete von 6,80 €. Frei finanziert sind 20,72 € nötig; das sind die 348.167 € Sollmiete im Jahr von der Folie davor.
- Rechenweg: Kapitaldienst plus Objektverwaltung plus Instandhaltung, geteilt durch 1.400 m² × 12 Monate × 98 %: 111.500 € bzw. 341.203 € ÷ 16.464.
- Für B und C: 9,32 € und 10,60 € gegen Höchstmieten von 8,20 € und 9,00 €; daher die Fehlbeträge in Jahr 1.
- 20,72 € sind eine Rechengröße, keine Marktmiete. Regie: keine Aussage zur erzielbaren Miete an einem Standort.
- Die Annahmen stehen auf Folie 16. Das Ergebnis hängt zuerst am Tilgungssatz.

**Quellenzeile der Notizen:** Quelle: Modellrechnung der PGN, VOFI-Mappe v3, Blatt Übersicht (D13, D14, G18, D26:F26, D31, D32, D111:G112), Eingaben 5.1, 6.1 und 6.4; Broschüre S. 11.

### 20 · Der Tilgungssatz entscheidet über den Zahlungsüberschuss in Jahr 1

ID `rechnung-tilgung` · Abschnitt Ihre Rechnung · Layout `PGN_DIAGRAMM_MR` · Baugruppe rechnung

**Aussage:** Jeder halbe Prozentpunkt Tilgung verschiebt das Ergebnis deutlich; unter 1,22 % bringt C den höchsten Zahlungsüberschuss, darüber A.

**Inhalt (Wortlaut der Folie):** Kicker: „IHRE RECHNUNG · MIX UND TILGUNG“. Stempel: „MODELLRECHNUNG“. Titelzeilen: „Der Tilgungssatz entscheidet über“ | „den Zahlungsüberschuss in Jahr 1“ (Signaturwort: „Tilgungssatz“). Diagrammtitel: „ZAHLUNGSÜBERSCHUSS JE TILGUNGSSATZ“. Untertitel: „Jahr 1, in € p. a. · Tilgungssatz p. a. auf das NBank-Darlehen“. Legende: „Gruppe A“ · „Gruppe B“ · „Gruppe C“. Linien A | B | C, beschriftet bei 2,5 %: 455 | −18.495 | −26.324. Achsbeschriftung x: „0,0 %“ bis „3,0 %“. Maßkette über dem Diagramm: „höchster Überschuss: C“ (0 bis 1,22 %) | „höchster Überschuss: A“ (ab 1,22 %), an der Maßhilfslinie „1,22 %“. Marke bei 2,5 %: „Annahme der Jahresrechnung“. Kommentarspalte: „Unter 1,22 % Tilgung bringt C den höchsten Zahlungsüberschuss, darüber A.“ · „B liegt in dieser Rechnung nie vorn.“ · „Den Tilgungssatz legt die NBank fest, die Richtlinie nennt keinen.“ · „B und C setzen eine Zulassung in der Förderentscheidung voraus.“

**Darstellung:** Dominant: natives Liniendiagramm über 8 Spalten mit drei Geraden A, B, C über die Tilgungssätze 0,0 bis 3,0 % in Schritten von 0,5 (7 Stützpunkte je Reihe: A 70.455 · 56.455 · 42.455 · 28.455 · 14.455 · 455 · −13.545; B 86.505 · 65.505 · 44.505 · 23.505 · 2.505 · −18.495 · −39.495; C 96.176 · 71.676 · 47.176 · 22.676 · −1.824 · −26.324 · −50.824). A durchgezogen in Tinte, B gestrichelt in Tinte, C in 77716B (Strichart über die Nachbearbeitung); y-Achse −60.000 bis 100.000 €, Schritt 20.000; kräftige Nulllinie; Achskreise A, B, C an den Linienenden. Darüber als Formen: Maßkette mit Teilung bei 1,22 % und senkrechte Marke bei 2,5 % mit den drei Werten; Lage aus der Kategorienmitte gerechnet. Kein Rot im Diagramm. Rechts Kommentarspalte mit drei Sätzen (16 pt).

**Daten:** werte.json, Lauf modellhaus: Stützpunkte im Code aus tilg.ueberschuss_vor_tilgung.A/B/C − Satz × fin.darlehen_nbank.A/B/C, geprüft gegen tilg.raster.satz und tilg.raster.zahlungsueberschuss.A/B/C (Übersicht!D55:F62); tilg.raster.bester, tilg.schwelle.C_gegen_A, tilg.schwelle.B_gegen_A, eingabe.tilgung_nbank. Für die Notizen: liq.breakeven_tilgung.A/B/C, tilg.mehrschuld.B/C, tilg.mehrueberschuss_vor_tilgung.B/C. Wortlaut der drei Sätze: Broschüre S. 12 (12-mix-und-tilgung.json).

**Herkunft:** Mappe (Blatt Übersicht, Block 4 „Zahlungsüberschuss Jahr 1 je Tilgungssatz“); Aussagen Broschüre S. 12; Darstellung wie in der Mappe, die Broschüre zeigt denselben Zusammenhang als Mehrüberschuss gegenüber A

**Sprechernotizen**

- Bei 2,5 % Tilgung stehen die Werte der Jahresrechnung: 455, −18.495 und −26.324 €.
- Ein halber Prozentpunkt Tilgung verschiebt das Ergebnis in A um 14.000 €, in B um 21.000 €, in C um 24.500 €.
- Unter 1,22 % bringt C den höchsten Zahlungsüberschuss, darüber A; B liegt nie vorn (Schwelle B gegen A 1,15 %). Rechenweg: Mehrüberschuss vor Tilgung geteilt durch die Mehrschuld gegenüber A, für C 25.721 € ÷ 2,1 Mio. €, für B 16.050 € ÷ 1,4 Mio. €. Ein Mix liegt anteilig dazwischen.
- Zahlungsüberschuss null bei 2,52 % (A), 2,06 % (B) und 1,96 % (C). Bei 2,381 % ist das Darlehen in 42 Jahren getilgt, der längsten Laufzeit.
- Den Satz legt die NBank fest. Alle Werte gelten für Jahr 1; danach kann die Miete alle drei Jahre steigen. Regie: keine Empfehlung für einen Mix.

**Quellenzeile der Notizen:** Quelle: Modellrechnung der PGN, VOFI-Mappe v3, Blatt Übersicht (D55:G62, E63, F64, E66:F70, D49:F49); Broschüre S. 12.

### 21 · Ab Jahr 10 Zahlungsüberschuss in allen drei Einkommensgruppen

ID `rechnung-verlauf` · Abschnitt Ihre Rechnung · Layout `PGN_DIAGRAMM_MR` · Baugruppe rechnung

**Aussage:** Über die Bindung wächst der Zahlungsüberschuss mit den Mieten; B und C haben bei 2,5 % Tilgung neun Jahre Fehlbetrag.

**Inhalt (Wortlaut der Folie):** Kicker: „IHRE RECHNUNG · VERLAUF“. Stempel: „MODELLRECHNUNG“. Titelzeilen: „Ab Jahr 10 Zahlungsüberschuss“ | „in allen drei Einkommensgruppen“ (Signaturwort: „Ab Jahr 10“). Diagrammtitel: „ZAHLUNGSÜBERSCHUSS JAHR 1 BIS 35“. Untertitel: „in € p. a. · Modellhaus, Gruppen A, B und C“. Legende: „Gruppe A“ · „Gruppe B“ · „Gruppe C“. Beschriftete Werte A | B | C: Jahr 1: 455 | −18.495 | −26.324 · Jahr 35: 89.837 | 98.228 | 105.598. Marken: „Jahr 1“ · „Jahr 10“. Kommentarspalte, Modultitel „ANNAHMEN“: „Tilgung 2,5 % p. a. Miete alle drei Jahre +6,15 % (Höchstwert). Objektverwaltung und Instandhaltung ab Jahr 2 +2 % p. a.“ Modultitel „B UND C“: „Nur mit Zulassung in der Förderentscheidung. Neun Jahre mit Fehlbetrag, zusammen 92.052 € (B) und 151.922 € (C).“

**Darstellung:** Dominant: natives Liniendiagramm über 8 Spalten mit 3 Reihen zu je 35 Jahreswerten: A durchgezogen in Tinte, B gestrichelt in Tinte, C in 77716B (Strichart über die Nachbearbeitung); x-Achse Jahr 1 bis 35 (Kategorien 1 bis 35 in den Diagrammdaten), beschriftet 1, 5, 10, 15, 20, 25, 30, 35 mit Textfeldern unter der Achse; y-Achse −40.000 bis 120.000 €, Schritt 20.000, Format [$-407]#,##0; kräftige Nulllinie; Achskreise A, B, C an den Linienenden; Werte für Jahr 1 und Jahr 35 als Formen; senkrechte Marke bei Jahr 10. Rechts Planlegende mit zwei Einträgen (16 pt). Kein Rot im Diagramm. Die Jahre 36 bis 42 werden nicht gezeigt.

**Daten:** werte.json, Lauf modellhaus_zeitreihe: zr.jahr, zr.zahlungsueberschuss.A/B/C (Index 0 bis 34; Blätter Gefördert A, B, C, R7:R41). Lauf modellhaus: liq.zahlungsueberschuss_jahr10.A/B/C, liq.zahlungsueberschuss_jahr35.A/B/C, liq.jahre_mit_fehlbetrag.A/B/C, liq.groesster_kumulierter_fehlbetrag.B/C, liq.restschuld_nbank_jahr35.A/B/C, eingabe.tilgung_nbank, eingabe.kostensteigerung, tab.mieterhoehung_in_der_bindung, tab.abstand_mieterhoehungen.

**Herkunft:** Mappe (Blätter Gefördert A, B, C; Übersicht 3.1 bis 3.9); nicht in der Broschüre

**Sprechernotizen**

- Mit jeder Mieterhöhung wächst der Zahlungsüberschuss; der Kapitaldienst sinkt mit dem Verwaltungskostenbeitrag auf das Restkapital.
- Gruppe A: 455 € in Jahr 1, 6.707 € in Jahr 4, 20.192 € in Jahr 10, 89.837 € in Jahr 35.
- B und C: Fehlbetrag in den Jahren 1 bis 9, Überschuss ab Jahr 10 (7.336 und 2.878 €). Bis dahin laufen 92.052 € (B) und 151.922 € (C) auf.
- Der Verlauf gilt mit den Annahmen der Folie: höchste zulässige Mieterhöhung alle drei Jahre, ungerundet gerechnet (in A 7,2182 € ab Jahr 4; Folie 10 nennt abgerundet 7,21 €), 2 % Kostensteigerung, 2,5 % Tilgung.
- Restschuld des NBank-Darlehens Ende Jahr 35: 350.000 | 525.000 | 612.500 €; bei 2,5 % ist es nach 40 Jahren getilgt. Als Nächstes die Herstellungskosten: erst der Kostenvergleich der PGN, dann die Wirkung im Modellhaus.

**Quellenzeile der Notizen:** Quelle: Modellrechnung der PGN, VOFI-Mappe v3, Blätter Gefördert A, B, C (R7:R41), Blatt Übersicht (D42:F50), Eingaben 3.1 und 5.4.

### 22 · Herstellungskosten der PGN: 22,7 % unter dem ARGE-Median

ID `pgn-baukosten` · Abschnitt Ihre Rechnung · Layout `PGN_DIAGRAMM` · Baugruppe struktur

**Aussage:** PGN-Projekte liegen im Median der Herstellungskosten bei 3.579 € je m² Wohnfläche, der ARGE-Median deutscher Großstädte bei 4.631 €; das sind 22,7 % weniger. Grundlage sind fünf eigene Projekte, Kostenstand Q4 2025.

**Inhalt (Wortlaut der Folie):** Kicker: „IHRE RECHNUNG · BAUKOSTEN DER PGN“. Titelzeilen: „Herstellungskosten der PGN:“ | „22,7 % unter dem ARGE-Median“ (Signaturwort: „22,7 % unter“). Diagrammtitel: „HERSTELLUNGSKOSTEN JE M² WOHNFLÄCHE, MEDIAN“. Untertitel: „in €, Bruttokosten, Kostenstand Q4 2025 · PGN: fünf Projekte · ARGE: deutsche Großstädte“. Legende: „PGN“ · „ARGE“. Säulenwerte PGN | ARGE: „Herstellung KG 200–700“ 3.579 | 4.631 · „Bauwerk KG 300/400“ 2.812 | 3.713 · „Baunebenkosten KG 700“ 458 | 555 · „Außenanlagen KG 500“ 221 | 174. Marke über dem Säulenpaar der Herstellung: „Ansatz im Modellhaus: 4.500 €“. Rechte Spalte, Kennzahl: Vorsatz „PGN GEGEN ARGE, KG 200–700“ · Zahl „−22,7 %“ · Label „3.579 € gegen 4.631 € je m²“. Modultitel „GRUNDLAGE“: „PGN: eigene Auswertung von fünf Projekten. ARGE: deutsche Großstädte.“ Modultitel „SPANNE KG 200–700“: „PGN 3.321 bis 3.861 €, ARGE 3.221 bis 8.592 € je m².“

**Darstellung:** Dominant: natives gruppiertes Säulendiagramm über 8 Spalten im Platzhalter des Layouts mit vier Kostengruppen und 2 Reihen: PGN in Tinte 202020, ARGE in 77716B; Werte über den Säulen (Montserrat Bold 12, Format [$-407]#,##0); y-Achse 0 bis 5.000 €, Schritt 1.000; Kategorien zweizeilig als Textfelder unter den Säulen (Bezeichnung, darunter die Kostengruppe). Über dem Säulenpaar der Herstellung eine waagerechte gestrichelte Marke bei 4.500 € (1 pt, 77716B); sie reicht nur über dieses Paar und setzt an der ARGE-Säule aus, die über die Linie ragt. Die Beschriftung steht rechts neben dem Linienende auf der Höhe der Linie (11 pt, der Wert halbfett). Rechts über 4 Spalten an der Stelle der Kommentarspalte die Hauptzahl der Folie wie auf den Folien 3 bis 6 (60 pt, Einheit in Rot, mit Vorsatz und einer Zeile Label in 16 pt; das Label nennt das Wertepaar der Mediane, für einen Text darunter ist in 60 pt kein Platz) und ab y 4,40, der Lage des zweiten Moduls der Folien 3 bis 6, unter einer Oberlinie eine Planlegende mit zwei Einträgen (14 pt; die Spanne bricht hinter dem Komma). Weißer Grund und kein Stempel: Die Folie zeigt Kostenkennwerte und kein Modellhaus. Kein Rot im Diagramm, kein Bild der ARGE. Bestätigt PGN den Wert 3.579 € nicht, entfällt die Folie.

**Daten:** daten/markt.json, Block kosten: gruppen, pgn.median, arge.median, pgn.spanne_herstellung, arge.spanne_herstellung (ungerundet), texte; die Platzhalter der Texte füllt folien/_struktur.cjs (kostenFelder). Abstand im Code gerechnet (1 − PGN-Median ÷ ARGE-Median); Beleg mit Formel in daten/pruefung.json („Folie 22“). Ansatz 4.500 €: werte.json, Lauf modellhaus, eingabe.herstellungskosten_qm. Gegenproben im Modul: pgn.median der Herstellung gerundet gleich dem Eingabewert des Laufs modellhaus_pgn_kosten (eingabe.herstellungskosten_qm); arge.median je Kostengruppe gleich baukosten.*.q4_2025; Median der Herstellung in Reihe und Spanne gleich; der Titel nennt den gerechneten Abstand.

**Herkunft:** Altfassung Folie 12, nicht nachgeprüft (vor dem Umbau die Anhangfolie zu den Herstellungskosten; auf Wunsch des Auftraggebers im Hauptteil vor Folie 23)

**Sprechernotizen**

- PGN hat fünf eigene Projekte ausgewertet: Die Herstellungskosten liegen im Median bei 3.579 € je m² Wohnfläche, Kostengruppen 200–700, hochgerechnet auf Q4 2025.
- Der ARGE-Median für deutsche Großstädte liegt bei 4.631 €. Der PGN-Median liegt 22,7 % darunter.
- Die Grundgesamtheiten sind verschieden: fünf Projekte der PGN und Großstädte bundesweit. Bei den Außenanlagen liegt PGN über dem ARGE-Median.
- Das Modellhaus rechnet mit 4.500 € je m². Was 3.579 € in derselben Rechnung bewirken, zeigt die nächste Folie.
- Regie: Werte von PGN und ARGE aus der Präsentation vom 26.10.2026 übernommen, nicht nachgeprüft.

**Quellenzeile der Notizen:** Quelle: ARGE e. V. (2026): Wohnungsbau in Deutschland 2026 (Endbericht), S. 32, Abb. 20; PGN (2026): eigene Auswertung von fünf Projekten, Hochrechnung auf Q4 2025 (beide aus der Altfassung übernommen, nicht nachgeprüft); Ansatz im Modellhaus: Modellrechnung der PGN, VOFI-Mappe v3, Eingabe 2.1.

### 23 · Herstellungskosten je m² bestimmen Förderquote und Zahlungsüberschuss

ID `rechnung-kosten` · Abschnitt Ihre Rechnung · Layout `PGN_DIAGRAMM_MR` · Baugruppe rechnung

**Aussage:** Bis zur Bemessungsgrenze sind die Herstellungskosten voll zuwendungsfähig; darüber sinkt die Förderquote, und Jahr 1 schließt mit einem Fehlbetrag.

**Inhalt (Wortlaut der Folie):** Kicker: „IHRE RECHNUNG · HERSTELLUNGSKOSTEN“. Stempel: „MODELLRECHNUNG“. Titelzeilen: „Herstellungskosten je m² bestimmen“ | „Förderquote und Zahlungsüberschuss“ (Signaturwort: „Herstellungskosten“). Diagrammtitel: „ZAHLUNGSÜBERSCHUSS JAHR 1, GRUPPE A“. Untertitel: „in € p. a. · nach Herstellungskosten je m² Wohnfläche“. Säulen: „3.579 €“ 15.928 · „4.500 € (Modellhaus)“ 455 · „5.200 €“ −23.630; über der mittleren Spalte „MODELLHAUS“. Tabelle unter den Säulen, Kopf „JE m² WOHNFLÄCHE“, Spalten 3.579 € | 4.500 € | 5.200 €: „Gesamtkosten“ 5,71 | 7,00 | 7,98 Mio. € · „Förderung, Höchstsätze“ 4,57 | 5,60 | 6,16 Mio. € · „Förderquote auf die Gesamtkosten“ 80 % | 80 % | 77,2 % · „Nötige Miete je m², Gruppe A“ 5,83 | 6,77 | 8,24 €. Kommentarspalte, Modultitel „SZENARIEN“: „Geändert sind nur die Herstellungskosten. Grundstück 700.000 €, Mieten und Annahmen wie im Modellhaus.“ Modultitel „3.579 € JE M²“: „Median aus fünf PGN-Projekten, Kostengruppen 200–700, Kostenstand Q4 2025.“ Modultitel „5.200 € JE M²“: „200 € über dem Ausgangswert der Bemessungsgrenze von 5.000 €. 0,28 Mio. € sind nicht zuwendungsfähig; gerechnet mit einem Bankdarlehen zu 3,74 % Zins.“

**Darstellung:** Dominant: natives Säulendiagramm über 8 Spalten mit drei Säulen in Tinte 202020 (eine unter null), kräftige Nulllinie, Werte an den Säulen (Montserrat Bold 12), y-Achse −30.000 bis 20.000 €, Schritt 10.000, Format [$-407]#,##0; Kategorien „3.579 €“, „4.500 € (Modellhaus)“, „5.200 €“. Passgenau unter den Säulen eine Rechenblatt-Tabelle (addTable) mit drei Wertspalten und vier Zeilen (12 pt), die mittlere Spalte weiß hervorgehoben. Rechts Planlegende mit drei Einträgen (14 pt). Kein Rot im Diagramm. Entfällt die Spalte 3.579 €, bleibt die Folie mit zwei Säulen bestehen.

**Daten:** werte.json, Läufe modellhaus_pgn_kosten (Eingaben!D11 = 3.579), modellhaus (4.500) und modellhaus_kosten_5200 (5.200), jeweils: eingabe.herstellungskosten_qm, fin.bankdarlehen.A und eingabe.zins_bank (Lauf modellhaus_kosten_5200: Bankdarlehen für die Kosten über der Bemessungsgrenze), fin.gesamtkosten.A, fin.zuwendungsfaehige_kosten.A, fin.ueber_bemessungsgrenze.A, fin.foerderung.A, fin.foerderquote.A, fin.eigenmittel.A, fin.bankdarlehen.A, jr1.zahlungsueberschuss.A, dscr.noetige_miete.A, dscr.noetige_miete.Frei, dscr.kapitaldienst_jahr1.A; dazu fin.bemessungsgrenze_qm und eingabe.grundstueck. Herkunft des Werts 3.579: daten/markt.json, kosten.pgn.median (Altfassung Folie 12: Median Herstellung PGN 3.579,18); dieselbe Zahl zeigt Folie 22.

**Herkunft:** Mappe (drei dokumentierte Läufe); Finanzierung bei 5.200 € wie Broschüre S. 10; Eingabewert 3.579 € aus Altfassung Folien 11 und 12, nicht nachgeprüft; Jahreswerte der Szenarien neu aus der Mappe

**Sprechernotizen**

- Bis zur Bemessungsgrenze sind die Herstellungskosten voll zuwendungsfähig; die Förderung wächst mit den Kosten, die Höchstmiete bleibt.
- Bei 5.200 € je m² liegen 0,28 Mio. € über der Grenze. Die Rechnung finanziert sie über ein Bankdarlehen zu 3,74 % (Annuität über 30 Jahre, 15.685 € p. a.); die Förderquote auf die Gesamtkosten sinkt auf 77,2 %, Jahr 1 schließt mit −23.630 €.
- Bei 3.579 € je m², dem PGN-Median der Folie 22, sinkt der Kapitaldienst auf 68.527 €; es bleiben 15.928 € in Jahr 1. Der Wert ist keine Zusage für ein einzelnes Vorhaben.
- Frei finanziert läge die nötige Miete bei 17,21 | 20,72 | 23,58 € je m².
- Die Bemessungsgrenze wird zum 01.04. und 01.10. fortgeschrieben; aktueller Wert auf nbank.de.

**Quellenzeile der Notizen:** Quelle: Modellrechnung der PGN, VOFI-Mappe v3, drei Läufe mit Eingabe 2.1 (Eingaben!D11) = 3.579 | 4.500 | 5.200 € je m²; Broschüre S. 10. Herstellungskosten 3.579 €: PGN (2026), eigene Auswertung von fünf Projekten, Kostenstand Q4 2025 (aus der Altfassung übernommen, nicht nachgeprüft).

### 24 · Tilgungssatz, Kosten und Höchstmiete bestimmen das Ergebnis

ID `fazit` · Abschnitt Ihre Rechnung · Layout `PGN_KENNZAHLEN_MR` · Baugruppe rahmen

**Aussage:** Das Modellhaus in drei Zahlen mit ihren Bedingungen; für ein eigenes Vorhaben sind Tilgungssatz, Herstellungskosten je m² und Höchstmiete zu klären.

**Inhalt (Wortlaut der Folie):** Kicker: „IHRE RECHNUNG · ZUSAMMENFASSUNG“. Stempel: „MODELLRECHNUNG“. Titelzeilen: „Tilgungssatz, Kosten und“ | „Höchstmiete bestimmen das Ergebnis“ (Signaturwort: „das Ergebnis“). Kachel 1: Vorsatz „BIS ZU“ · Zahl „5,6 Mio. €“ · Label „Förderung“ · Text „80 % von 7,0 Mio. €: je 2,8 Mio. € Darlehen und Zuschuss. Bindung 35 Jahre.“ Kachel 2: Vorsatz „KAPITALDIENST IN JAHR 1“ · Zahl „84.000 €“ · Label „gefördert, Gruppe A“ · Text „Frei finanziert: 313.703 €.“ Kachel 3: Vorsatz „NÖTIGE MIETE IN JAHR 1“ · Zahl „6,77“ mit Einheit „€ je m²“ · Label „gefördert, Gruppe A“ · Text „Frei finanziert: 20,72 €. Höchstmiete: 6,80 €.“ Darunter über die volle Breite unter einer Modulkopf-Linie ohne eigenen Titel (der Folientitel nennt die drei Größen) drei Einträge: „Tilgungssatz“ · „Annahme 2,5 % p. a.; den Satz legt die NBank fest.“ | „Herstellungskosten je m²“ · „Zuwendungsfähig bis zur Bemessungsgrenze, Ausgangswert 5.000 € in Mietenstufe IV–VII.“ | „Höchstmiete“ · „Nach Einkommensgruppe und Mietenstufe; im Modellhaus 6,80 €.“

**Darstellung:** Dominant: drei Kennzahl-Kacheln im Raster 4 + 4 + 4 (Zahl Montserrat ExtraBold 44 pt, Einheit halb so groß in Rot) mit Oberlinie, Vorsatz, Label und einer Textzeile (14 pt). Darunter ab y 4,70 eine Planlegende über 12 Spalten mit Modulkopf-Linie, ohne eigenen Titel, und drei Einträgen im selben Raster (Modultitel 13 pt, Text 14 pt). Papierton, Stempel, Daumenregister 2.1. Kein Diagramm, kein wertender Satz.

**Daten:** werte.json, Lauf modellhaus: fin.foerderung.A, fin.foerderquote.A, fin.gesamtkosten.A, fin.darlehen_nbank.A, fin.zuschuss.A, tab.bindung, dscr.kapitaldienst_jahr1.A, dscr.kapitaldienst_jahr1.Frei, dscr.noetige_miete.A, dscr.noetige_miete.Frei, fin.miete_jahr1.A, eingabe.tilgung_nbank, fin.bemessungsgrenze_qm.

**Herkunft:** Mappe (Lauf modellhaus); Broschüre S. 10 und 11; Zusammenstellung neu (ersetzt Altfassung Folie 17)

**Sprechernotizen**

- Bis zu 5,6 Mio. € Förderung, 84.000 statt 313.703 € Kapitaldienst, 6,77 statt 20,72 € nötige Miete je m².
- In Gruppe A bleibt in Jahr 1 ein Zahlungsüberschuss von 455 €; der Abstand zur Höchstmiete ist klein.
- Im eigenen Vorhaben hängt das Ergebnis an drei Größen: Tilgungssatz, Herstellungskosten je m², Höchstmiete nach Gruppe und Mietenstufe.
- Belegung und Miete sind dafür 35 Jahre gebunden.
- Als Nächstes: der Weg zur Bewilligung.

**Quellenzeile der Notizen:** Quelle: Modellrechnung der PGN, VOFI-Mappe v3, Blatt Übersicht (D15, D16, D26, D111, G111, D112, G112); Broschüre S. 10 und 11.

### 25 · Umsetzung: der Weg zur Bewilligung

ID `trenner-umsetzung` · Abschnitt Umsetzung · Layout `PGN_ABSCHNITT_ROT` · Baugruppe struktur

**Aussage:** Der vierte Abschnitt zeigt den Antragsweg und was PGN vor der Bewilligung plant.

**Inhalt (Wortlaut der Folie):** Achskreis XL: „4“. Titelzeilen: „Umsetzung:“ | „der Weg zur Bewilligung“ (Signaturwort: „Bewilligung“; gesetzt in Versalien, 40 pt). Lead: „Vom Vorgespräch bis zum Verwendungsnachweis, und was PGN vor der Bewilligung plant.“ Rubrik im Schriftfeld: „UMSETZUNG“. Achsleiste auf der oberen Rahmenlinie: Achskreise „1“ bis „4“ für Ausgangslage, Programmteil 2.1, Ihre Rechnung, Umsetzung; die „4“ gefüllt.

**Darstellung:** Wie die Trenner der anderen Abschnitte: Achskreis XL mit der „4“ und der Titel (Montserrat Black 40 pt) auf Rotverlauf (bg-rot.png). Weißer Planrahmen, Logo rot auf weißem Feld, Achsleiste mit vier Achskreisen M, der vierte gefüllt. Ohne Stempel. Wie Probe 14.

**Daten:** Keine Zahlen. Name und Nummer des Abschnitts folgen aus dem Feld „abschnitt“; die Zählung rechnet folien/_struktur.cjs wie für die Agenda.

**Herkunft:** neu nach Durchsicht durch den Auftraggeber: Trenner vor jedem Abschnitt des Hauptteils

**Sprechernotizen**

- Zum Schluss der Weg vom Vorhaben zur Bewilligung.
- Erst der Antragsweg mit seinen Fristen, dann die Planung mit PGN.
- Vorab: Vor der Bewilligung keine Bau-, Liefer- oder Kaufverträge.
- Als Nächstes: der Antragsweg.

**Quellenzeile der Notizen:** Quelle: keine eigenen Angaben.

### 26 · Erst die Bewilligung, dann Verträge und Baubeginn

ID `antragsweg` · Abschnitt Umsetzung · Layout `PGN_ABLAUF` · Baugruppe umsetzung

**Aussage:** Acht Schritte vom Vorgespräch bis zum Verwendungsnachweis; vor der Bewilligung begonnene Vorhaben werden nicht gefördert.

**Inhalt (Wortlaut der Folie):** Kicker: „UMSETZUNG · ANTRAGSWEG“. Titelzeilen: „Erst die Bewilligung,“ | „dann Verträge und Baubeginn“ (Signaturwort: „Verträge und Baubeginn“). Reihe 1: „1 VORGESPRÄCH“ · „Förderstelle mit Ihnen“ · „Nachweise und Unterlagen vorab klären“ | „2 ANTRAG“ · „Sie“ · „bei der Wohnraumförderstelle am Bauort“ | „3 STELLUNGNAHME“ · „Förderstelle“ · „Bedarfsbestätigung, Weiterleitung an die NBank“ | „4 ENTSCHEIDUNG“ · „NBank“ · „Fördervertrag oder Bescheid; Ziel: höchstens drei Monate“. Warnband: „±0 BEWILLIGUNG“ · „Vor der Bewilligung begonnene Vorhaben werden nicht gefördert.“ Reihe 2: „5 BAUAUSFÜHRUNG“ · „Sie“ · „Baubeginn spätestens vier Monate nach Bekanntgabe der Förderentscheidung“ | „6 AUSZAHLUNG“ · „NBank“ · „in Raten nach Baufortschritt“ | „7 FERTIGSTELLUNG“ · „Förderstelle mit Ihnen“ · „Vermietung nur mit WBS“ | „8 VERWENDUNGSNACHWEIS“ · „Sie“ · „innerhalb von sechs Monaten nach Erfüllung des Förderzwecks“. Zeile unter Reihe 2 (12 pt): „Als Vorhabenbeginn gilt ein Bau-, Liefer- oder Kaufvertrag (außer für das Baugrundstück) oder der erste Spatenstich.“

**Darstellung:** Dominant: Ablauf aus nativen Formen mit zwei Achsleisten zu je vier Stationen über 12 Spalten: Achskreise L mit 1 bis 8, Station 4 gefüllt in Dunkelrot 8B2939; je Station Titel (Montserrat ExtraBold Versalien 13 pt), Zuständigkeit (Work Sans Medium 12 pt, accent6) und eine Textzeile (14 pt), linksbündig ab Kreis. Zwischen den Reihen das Warnband in Dunkelrot über die volle Breite (0,42 hoch, Text weiß 14 pt); die Teilung fällt auf die Bewilligung. Einziges Signalelement des Hauptteils.

**Daten:** Broschüre S. 19 (19-antragsweg.json: blocks[0].data.stations[0..7] mit lane, title, body, deadline; blocks[1] Achtung-Kasten „Erst Bewilligung, dann Vertrag“). Keine Werte der Mappe.

**Herkunft:** Broschüre S. 19 (ersetzt Altfassung Folie 15)

**Sprechernotizen**

- Acht Schritte: Sie beantragen bei der Wohnraumförderstelle am Bauort, die NBank entscheidet.
- Vor der Bewilligung zulässig: Grundstück kaufen, Planung bis einschließlich Leistungsphase 6, Baugrund untersuchen. Förderschädlich: Bau-, Liefer- und Kaufverträge, Beauftragung ab Leistungsphase 7, erster Spatenstich (Anhang A4).
- Fristen: Entscheidung der NBank als Ziel in höchstens drei Monaten; Baubeginn spätestens vier Monate nach Bekanntgabe; Verwendungsnachweis innerhalb von sechs Monaten.
- Die sechs Voraussetzungen und die Bedarfslage am Standort stehen im Anhang A3.
- Als Nächstes: die Planung vor der Bewilligung, bis Leistungsphase 6.

**Quellenzeile der Notizen:** Quelle: RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319); Broschüre S. 19 und 21.

### 27 · Planung bis Leistungsphase 6 ist vor der Bewilligung möglich

ID `pgn-leistungen` · Abschnitt Umsetzung · Layout `PGN_INHALT` · Baugruppe umsetzung

**Aussage:** PGN kann vor der Bewilligung planen: Machbarkeit, Planung und Antragsunterlagen liegen davor, Vergabe und Bau danach.

**Inhalt (Wortlaut der Folie):** Kicker: „UMSETZUNG · MIT PGN“. Titelzeilen: „Planung bis Leistungsphase 6 ist“ | „vor der Bewilligung möglich“ (Signaturwort: „vor der Bewilligung“). Deck: „Leistungen der PGN nach Leistungsphasen 1 bis 9“ Kopfleiste: Bezeichnung „Leistungsphase“, rechtsbündig vor dem ersten Achskreis, und die Achskreise „1“ bis „9“. Marke zwischen 6 und 7: „Bewilligung“. Unter dem Plan links der Marke: „Planungsauftrag LPH 1–6: vor der Bewilligung möglich“; rechts der Marke: „ab LPH 7: erst nach der Bewilligung“. Sieben Zeilen ohne eigene Nummer (die Ziffern des Plans sind die Leistungsphasen): „Förderung und Machbarkeit“ · „vor dem Vorgespräch“ | „Förderkonforme Planung“ · Balken 1–4 | „Kostenplanung“ · Balken 2–8 | „Antragsunterlagen“ · „Vorgespräch und Antrag“ | „Ausführungsplanung und Vergabe“ · Balken 5–7 | „Bauleitung“ · Balken 8 | „Fertigstellung und Nachweis“ · Balken 8–9. Rechte Spalte: Bild mit Bildecke „Visualisierung“ und Konturstempel „MIT FÖRDERUNG DER NBANK“; Bildzeile: „Brauerstraße, Rotenburg (Wümme) · 19 barrierefreie Wohnungen“. Darunter Modultitel „FÖRDERUNG UND MACHBARKEIT“: „Wir klären Programmteil, Standort und Mieterkreis und ermitteln Flächen und Kosten für Ihre Wirtschaftlichkeitsberechnung.“

**Darstellung:** Dominant: Balkenplan aus nativen Formen über 8 Spalten: Achsleiste mit neun Achskreisen S (Leistungsphase 1 bis 9), die Bezeichnung „Leistungsphase“ rechtsbündig davor; darunter sieben Zeilen mit der Leistung (14 pt, ohne Nummer) und je einem Balken in Tinte über die zugehörigen Leistungsphasen; die erste und die vierte Leistung ohne Balken, mit ihrer Phase im Wortlaut (12 pt, Tinte). Senkrechte Bewilligungsmarke in Dunkelrot 8B2939 zwischen 6 und 7 mit gefülltem Achskreis und dem Wort „Bewilligung“; die beiden Sätze links und rechts der Marke unter dem Plan (12 pt). Rechts über 4 Spalten das Bild ../broschuere/src/assets/pgn/img/brauerstrasse-duplex.jpg (3,84 × 1,58 Zoll, Bildecke, Konturstempel, altText) und ein Planlegenden-Eintrag zur ersten Leistung (14 pt).

**Daten:** Broschüre S. 20 (20-pgn-leistungen.json: subline (in den Notizen); blocks[0].items[0..6] mit title, phase, body; blocks[0].scale.phases und scale.marker). Referenz: Broschüre S. 22 (22-ueber-pgn.json, blocks[2].items[0]) und S. 1 (image.caption). Keine Werte der Mappe.

**Herkunft:** Broschüre S. 20 (Referenz S. 22 und S. 1)

**Sprechernotizen**

- PGN kann vor der Bewilligung planen: Leistungsphasen 1 bis 6 sind zulässig, Vergabe und Bau folgen danach. PGN ist dabei ein Ansprechpartner für alles, von der Machbarkeit bis zur Übergabe.
- Der erste Schritt liegt vor dem Vorgespräch: Programmteil, Standort und Mieterkreis klären, Flächen und Kosten ermitteln. Die Wirtschaftlichkeitsberechnung bleibt Sache des Bauherrn.
- Leistungsphasen 1 bis 6 reichen von den Grundlagen bis zur Vorbereitung der Vergabe; die Leistungsphasen 7 bis 9 sind Vergabe, Objektüberwachung und Objektbetreuung.
- Schlüsselfertig baut die PGN Projektgesellschaft Nord GmbH als Generalübernehmer. Förderfähig ist das, wenn Sie mindestens drei Unternehmen zum Angebot auffordern, erst nach der Bewilligung beauftragen und die Gesellschaft vorab schriftlich der Prüfung von Kalkulation, Nachunternehmervergabe und Abrechnung zustimmt.
- Regie: zur Brauerstraße nur die 19 barrierefreien Wohnungen und die Förderung der NBank nennen.

**Quellenzeile der Notizen:** Quelle: Broschüre S. 20 und 22; Bild: Planungsgemeinschaft Nord GmbH (Visualisierung).

### 28 · Aus Ihrer guten Idee – machen wir den besten Plan

ID `kontakt` · Abschnitt Umsetzung · Layout `PGN_SCHLUSS` · Baugruppe rahmen

**Aussage:** PGN plant Vorhaben im geförderten Mietwohnungsbau von der Machbarkeit bis zur Fertigstellung; so erreichen Sie uns.

**Inhalt (Wortlaut der Folie):** Titel in drei Zeilen: „AUS IHRER GUTEN IDEE“ (zweite Stimme, 20 pt) | „MACHEN WIR DEN“ | „BESTEN PLAN.“ (Claim der Broschüre U4 im Wortlaut „Aus Ihrer guten Idee – machen wir den besten Plan.“; der Zeilenwechsel steht an der Stelle des Gedankenstrichs; Signaturwort „BESTEN PLAN“ kursiv). Untertitel: „Wir planen Ihr Vorhaben im geförderten Mietwohnungsbau, von der Machbarkeit bis zur Fertigstellung. Sprechen Sie uns an.“ Schriftfeld: „PLANUNGSGEMEINSCHAFT NORD GMBH“ · „Große Straße 49 · 27356 Rotenburg (Wümme)“ · „Telefon“ „(+49) 4261 9293-0“ · „E-Mail“ „info@pgn-architekten.de“ · „Web“ „www.pgn-architekten.de“ · QR-Code auf https://www.pgn-architekten.de. Keine Foliennummer.

**Darstellung:** Dominant: Regelgeschoss-Grundriss in Weiß auf Rotverlauf (Hintergrundbild bg-schluss.png, erzeugt aus ../broschuere/src/assets/pgn/sig-grundriss.svg) mit dem Claim. Weißer Planrahmen, Titellinie weiß, Logofeld weiß mit logo-rot.svg, QR-Feld weiß mit qr-pgn-architekten.svg. Wie Probe 10 und Broschüre U4.

**Daten:** Broschüre S. 24 (24-umschlag-rueckseite.json: headline, headline_highlight, lead, blocks[1] Kontakt und QR). Kontakt der NBank für die Notizen: Broschüre S. 21.

**Herkunft:** Broschüre S. 24 (ersetzt Altfassung Folie 18)

**Sprechernotizen**

- Dank und Angebot zum Gespräch; Kontakt über Telefon, E-Mail oder die Website.
- Zum Mitnehmen: die Broschüre „Mietwohnraumförderung Niedersachsen 2026“ und die Rechenmappe der PGN mit denselben Zahlen. Die Broschüre behandelt auch die Programmteile 2.2 bis 2.6.
- Für Rückfragen im Anhang: Programmteile, Frist 31.12.2026, Voraussetzungen, Verträge vor der Bewilligung, Mieterkreis, Eckdaten, Quellen.
- Förderberatung der NBank: 0511 30031-9333, wohnraumfoerderung@nbank.de.

**Quellenzeile der Notizen:** Quelle: Broschüre S. 24 und 21.

### A0 · Anhang

ID `anhang-trenner` · Abschnitt Anhang · Layout `PGN_ABSCHNITT` · Baugruppe struktur

**Aussage:** Der Anhang hält Einzelheiten für Rückfragen bereit.

**Inhalt (Wortlaut der Folie):** Achskreis XL: „A“. Titel: „ANHANG“. Lead: „Programmteile und Frist · Voraussetzungen und Verträge · Mieterkreis und Eckdaten · Quellen“. Rubrik im Schriftfeld: „ANHANG“.

**Darstellung:** Dominant: Achskreis XL mit „A“ (Montserrat Black, Rot) und der Titel (40 pt) auf Weiß. Planrahmen in Tinte, Logo im Schriftfeld, ohne Achsleiste der Abschnitte. Der Vorspann ist von Hand in zwei Zeilen gebrochen (A1 bis A4 | A5 bis A7). Wie Probe 6.

**Daten:** Keine Zahlen. Reihenfolge der Anhangfolien A1 bis A7 laut dieser Liste.

**Herkunft:** neu

**Sprechernotizen**

- Der Anhang wird nur bei Rückfragen gezeigt.
- A1 und A2: Programmteile und Frist. A3 und A4: Voraussetzungen und Verträge vor der Bewilligung. A5 und A6: Mieterkreis und Eckdaten. A7: Quellen und Hinweis.
- A1 zeigt die Programmteile 2.2 bis 2.6 in Kurzform; ausführlich stehen sie in der Broschüre.
- A2 entfällt bei Vorträgen nach dem 31.12.2026; vor Bestandshaltern gehört A2 in den Hauptteil.

**Quellenzeile der Notizen:** Quelle: keine eigenen Angaben.

### A1 · Vier Ausgangslagen führen zu sechs Programmteilen

ID `anhang-programmteile` · Abschnitt Anhang · Layout `PGN_ANHANG` · Baugruppe ueberblick

**Aussage:** Der Hauptteil rechnet Programmteil 2.1; für reinen Zuschuss, Inseln und Bestand gibt es fünf weitere.

**Inhalt (Wortlaut der Folie):** Kicker: „ANHANG · PROGRAMMTEILE“. Tabellentitel: „DIE SECHS PROGRAMMTEILE“. Untertitel: „Höchstsätze · B und C nur mit Zulassung“. Zeile über der Tabelle (12 pt): „Neu schaffen oder erstmals erwerben: 2.1, 2.2, 2.4 · Bestand modernisieren: 2.3 · Bestandswohnung binden: 2.5 · Bindung verlängern: 2.6“. Spalten: Programmteil · Instrument · Bis zu · Bindung · Eigenmittel. Zeilen: „2.1 Neubau, Änderung und Erweiterung, Ersterwerb“ · „Darlehen + Zuschuss (Zuschuss nur mit Darlehen)“ · „zusammen 80 %: A 40 + 40 · B 60 + 20 · C 70 + 10 %“ · „35 Jahre“ · „mind. 20 %“ | „2.2 Energetisch hochwertiger Neubau“ · „nur Zuschuss; nicht mit 2.1 kombinierbar“ · „A 50 · B 40 · C 30 %, max. 90.000/75.000/60.000 € je Wohnung“ · „35 Jahre“ · „mind. 20 %“ | „2.4 Ostfriesische Inseln“ · „Darlehen + Zuschuss“ · „zusammen 90 % der Herstellungskosten + 100 % der Grundstückskosten“ · „35 Jahre“ · „mind. 10 %“ | „2.3 Klimagerechte Modernisierung“ · „Zuschuss je gebundener Wohnung; Wahlrecht bis 31.12.2026“ · „10–40 %, höchstens 9.000–31.000 €“ · „25 Jahre; vermietet ohne WBS 35 Jahre“ · „mind. 20 %“ | „2.5 Belegungsbindungen erwerben“ · „Zuschuss“ · „Festbetrag 2,00–3,00 € je m² und Monat, nach Bindungsdauer gestaffelt“ · „5–20 Jahre“ · „–“ | „2.6 Auslaufende Bindungen verlängern“ · „Zuschuss zur Zinsverbilligung; Antrag erst nach Prolongationsangebot der NBank“ · „Zins 0 % auf bis zu 100 % der Restschuld, längstens 20 Jahre“ · „+ bis zu 20 Jahre“ · „–“. Fußzeile: „Den Antrag stellen Sie bei Ihrer kommunalen Wohnraumförderstelle, die NBank bewilligt.“

**Darstellung:** Dominant: native Tabelle (addTable) über 12 Spalten mit sechs Zeilen und fünf Spalten, 12 pt, zweizeilige Zellen; in der ersten Spalte ein Programm-Chip (Rechteck in der Programmfarbe mit weißer Nummer) vor dem Namen; kräftige Linien nach 2.4, 2.3 und 2.5 trennen die vier Ausgangslagen. Programmfarben nur am Chip.

**Daten:** Broschüre S. 5 (05-navigator.json: lead, blocks[0].data.branches[].label und pins, blocks[1].data.tiles[0..5] mit name, instrument, max, binding, equity). Keine Werte der Mappe.

**Herkunft:** Broschüre S. 5 (ersetzt Altfassung Folie 9 „Zwei Wege“)

**Sprechernotizen**

- Der Hauptteil rechnet Programmteil 2.1; daneben gibt es fünf weitere.
- 2.2: reiner Zuschuss ab EH-40-Niveau, nicht mit 2.1 kombinierbar. Das Modellhaus (350.000 € je Wohnung) erhielte nach Programmteil 2.2 einen Zuschuss von 1,8 Mio. €, nach 2.1 dagegen 2,8 Mio. € Zuschuss und 2,8 Mio. € Darlehen (Broschüre S. 13).
- 2.3: Zuschuss je nach Sprung in den Effizienzklassen, in Gruppe A bis zu 31.000 € je gebundener Wohnung.
- 2.5 und 2.6 kommen ohne Baumaßnahme aus: Bindungen erwerben oder verlängern.
- Alle Werte sind Höchstsätze; B und C nur mit Zulassung.

**Quellenzeile der Notizen:** Quelle: RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319); Broschüre S. 5, 13, 15 und 17.

### A2 · 31.12.2026: Wahlrecht für Modernisierungsanträge

ID `anhang-frist` · Abschnitt Anhang · Layout `PGN_ANHANG` · Baugruppe ueberblick

**Aussage:** Geht ein Modernisierungsantrag bis 31.12.2026 bei der Wohnraumförderstelle ein, lässt sich darin das alte Recht wählen; die Wahl ist bindend.

**Inhalt (Wortlaut der Folie):** Kicker: „ANHANG · STICHTAG“. Achtung-Kasten, Label „FRIST 31.12.2026“: „Geht Ihr Modernisierungsantrag bis 31.12.2026 bei der Wohnraumförderstelle ein, können Sie darin ausdrücklich das alte Recht (Förderregeln 2024) wählen. Die Wahl ist bindend; das alte Recht gilt dann bis zum Abschluss des Verfahrens. Ohne Wahl gilt die RL 2026; Neubau, Ersterwerb und alle übrigen Vorhaben werden nur nach RL 2026 gefördert.“ Zeitleiste „STICHTAGE JUNI 2026 BIS DEZEMBER 2031“: „30.06.2026“ · „Förderregeln 2024 enden“ | „01.07.2026“ · „RL Mietwohnraum 2026 in Kraft“ | „31.12.2026“ · „Wahlrecht Modernisierung“ · „Antragseingang bei der Wohnraumförderstelle“ | „01.01.2027“ · „Neue Rechennorm für Energiebedarfsausweise“ · „Klassengrenzen unverändert“ | „2027“ · „Neue Mietenstufen geplant“ · „Entwurf“ | „31.12.2031“ · „RL Mietwohnraum 2026 läuft aus“. Zeile darunter: „Programmteil 2.3 nach RL 2026: Zuschuss je nach Klassensprung und Einkommensgruppe bis zu 10–40 %, höchstens 9.000–31.000 € je gebundener Wohnung.“

**Darstellung:** Dominant: Zeitleiste aus nativen Formen über 12 Spalten mit sechs Marken (Achskreise S auf einer Achsleiste, Datum in Montserrat Bold 12, Text 12 pt); die Marke 31.12.2026 gefüllt in Dunkelrot 8B2939. Darüber der Achtung-Kasten (Fläche FBF1F3, Oberlinie 1,5 pt in Rot, Label rot 12 pt, Text 14 pt): zweites und letztes Achtung-Element des Vortrags.

**Daten:** Broschüre S. 16 (16-stichtag-wahlrecht-fristen.json: blocks[0] Achtung-Kasten, blocks[1].data.events[0..5], blocks[2].rows[0][2]). Keine Werte der Mappe.

**Herkunft:** Broschüre S. 16 (Zuschuss 2.3: S. 15)

**Sprechernotizen**

- Das Wahlrecht gilt nur für Modernisierungsanträge. Maßgeblich ist der Eingang bei der Wohnraumförderstelle bis 31.12.2026; die Wahl ist bindend.
- Altes Recht: anfangs zinsloses Darlehen bis zu 75 % der Kosten. RL 2026: Zuschuss von 10 bis 40 %, höchstens 9.000 bis 31.000 € je gebundener Wohnung.
- Gebäude, die zwischen 01.02.2002 und 07.12.2004 fertiggestellt wurden, fallen nur unter die RL 2026.
- Regie: vor Bestandshaltern gehört diese Folie in den Hauptteil. Bei Vorträgen nach dem 31.12.2026 entfällt sie.

**Quellenzeile der Notizen:** Quelle: RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319); Broschüre S. 15 und 16.

### A3 · Sechs Voraussetzungen, darunter Bedarf am Standort

ID `anhang-voraussetzungen` · Abschnitt Anhang · Layout `PGN_ANHANG` · Baugruppe umsetzung

**Aussage:** Ob ein Vorhaben für Programmteil 2.1 in Frage kommt, klären sechs Fragen; der Bedarf gilt in 306 Einheits- und Samtgemeinden als gegeben.

**Inhalt (Wortlaut der Folie):** Kicker: „ANHANG · VORAUSSETZUNGEN“. Modultitel: „GRUNDCHECK FÜR PROGRAMMTEIL 2.1“. Sechs Fragen: 1 „Antragsberechtigt, Finanzierung gesichert?“ · 2 „Vor der Bewilligung nicht begonnen?“ · 3 „Mehrfamilienhaus ab drei Wohnungen?“ · 4 „Bedarf am Standort?“ · 5 „Mindestens 20 % Eigenmittel?“ mit Zusatz „Bezogen auf die zuwendungsfähigen Kosten.“ · 6 „Grundstück gesichert?“ mit Zusatz „Eigentum, Erbbaurecht oder gesicherter Erwerb.“ Diagrammtitel: „BEDARFSLAGE AUF DER NBANK-KARTE“. Untertitel: „Einheits- und Samtgemeinden“. Segmente: „306“ · „Bedarf gegeben“ | „96“ · „Bedarf gesondert nachweisen“. Zeile unter dem Ring: „In beiden Fällen nötig: die einfache Bedarfsbestätigung der Wohnraumförderstelle zum Bauort.“

**Darstellung:** Dominant: Prüfliste über 7 Spalten mit sechs Achskreisen M (1 bis 6) in zwei Spalten zu je drei Fragen, Frage in Work Sans SemiBold 14 pt, Zusatz 12 pt. Rechts über 5 Spalten ein natives Ringdiagramm (doughnut) mit zwei Segmenten: 306 in Tinte 202020, 96 in 77716B, beide direkt beschriftet (Zahl Montserrat ExtraBold 24, Bezeichnung 12 pt). Kein Rot, keine Karte, kein QR-Code.

**Daten:** Broschüre S. 4 (04-neu-und-grundcheck.json, blocks[1].items[0..5]) und S. 18 (18-standort-und-kommune.json, blocks[1]: title, data.unit, data.segments, note). Keine Werte der Mappe.

**Herkunft:** Broschüre S. 4 und S. 18 (ersetzt die Landkarte der Altfassung Folie 8)

**Sprechernotizen**

- Antragsberechtigt sind Privatpersonen, Unternehmen mit eigener Rechtspersönlichkeit, Genossenschaften und Kommunen.
- Für 2.1 muss am Bauort ein nicht nur kurzfristiger Bedarf an gebundenen Mietwohnungen bestehen. In sechs Gebietsarten gilt er als erfüllt, etwa im angespannten Wohnungsmarkt (derzeit 57 Kommunen) und in Mietenstufe IV–VII (derzeit 29 Gemeinden).
- Die NBank-Karte weist 306 Einheits- und Samtgemeinden mit gegebenem Bedarf aus und 96 mit gesondertem Nachweis (Abruf 21.10.2026).
- Je Neubau mindestens zwei gebundene Wohnungen; Erbbaurecht mit mindestens 60 Jahren Restlaufzeit.
- Mietenstufe IV bis VI haben derzeit 29 Gemeinden, darunter Hannover, Braunschweig, Göttingen, Lüneburg, Oldenburg, Osnabrück, Stade und Wolfsburg; alle übrigen Festlandgemeinden liegen in I bis III. Stufe VII gibt es in Niedersachsen nicht.

**Quellenzeile der Notizen:** Quelle: RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319); NBank-Landkarte Wohnraumförderung, abgerufen am 21.10.2026; Landesregierung, Pressemitteilung vom 25.11.2025; Broschüre S. 4, 7, 18 und 21.

### A4 · Vor der Bewilligung zulässig: Planung bis LPH 6

ID `anhang-vertraege` · Abschnitt Anhang · Layout `PGN_ANHANG` · Baugruppe umsetzung

**Aussage:** Grundstückskauf und Planung bis Leistungsphase 6 sind vor der Bewilligung zulässig; Bau-, Liefer- und Kaufverträge sind förderschädlich.

**Inhalt (Wortlaut der Folie):** Kicker: „ANHANG · VORHABENBEGINN“. Drei Spalten. „ZULÄSSIG“: „Baugrundstück kaufen oder Erbbaurecht bestellen“ · „nicht bindende Reservierung beim Kauf“ · „Planung bis einschließlich Leistungsphase 6 HOAI“ · „Baugrund untersuchen, Grundstück herrichten“. „BEDINGT ZULÄSSIG“: „Vertrag mit eindeutigem, folgenlosem Rücktrittsrecht oder eindeutiger Bedingung für den Fall, dass die Förderung ausbleibt; die NBank prüft die Klausel im Einzelfall“ · „vorzeitiger Vorhabenbeginn nach Zulassung durch die NBank“. „FÖRDERSCHÄDLICH“: „Bau-, Werk-, Liefer-, Leistungs- oder Kaufvertrag (außer Baugrundstück)“ · „beim Ersterwerb: bindender Kaufvertrag über die Wohnungen“ · „Beauftragung ab Leistungsphase 7 HOAI“ · „erster Spatenstich“ · „bei 2.5: Mietvertrag oder Überlassung der Wohnung“.

**Darstellung:** Dominant: dreispaltige Gegenüberstellung im Raster 4 + 4 + 4 aus nativen Textfeldern mit Modulkopf-Linie und Kopf-Icon je Spalte (ui-check und ui-hinweis in Tinte, ui-stopp in Dunkelrot aus ../broschuere/src/assets/); Text 16 pt mit eckigen Markern; die Spalte „Förderschädlich“ mit Linie und Kopf in Dunkelrot 8B2939. Kein Grün, kein Achtung-Kasten.

**Daten:** Broschüre S. 19 (19-antragsweg.json, blocks[2].data.columns[0..2] mit title und items). Keine Werte der Mappe.

**Herkunft:** Broschüre S. 19

**Sprechernotizen**

- Als Vorhabenbeginn gilt ein Bau-, Liefer- oder Kaufvertrag (außer für das Baugrundstück) oder der erste Spatenstich.
- Planung bis einschließlich Leistungsphase 6 ist zulässig; ab Leistungsphase 7 erst nach der Bewilligung.
- Rücktrittsklauseln prüft die NBank im Einzelfall. Einen vorzeitigen Vorhabenbeginn lässt nur die NBank zu, auf eigenes Risiko des Bauherrn.
- Beim Ersterwerb schließt die Käuferseite den Kaufvertrag erst nach ihrer Bewilligung.

**Quellenzeile der Notizen:** Quelle: RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319); Broschüre S. 2, 19 und 21.

### A5 · Grundsatz ist Gruppe A; B und C nur mit Zulassung

ID `anhang-mieterkreis` · Abschnitt Anhang · Layout `PGN_ANHANG` · Baugruppe regeln

**Aussage:** Drei Einkommensgruppen bestimmen den Mieterkreis: A bis zur Einkommensgrenze, B bis 40 % darüber, C bis 60 % darüber.

**Inhalt (Wortlaut der Folie):** Kicker: „ANHANG · MIETERKREIS“. Diagrammtitel: „OBERGRENZE GESAMTJAHRESEINKOMMEN“. Untertitel: „in €, gültig seit 01.03.2025“. Legende: „A bis zur Einkommensgrenze“ · „B bis 40 % darüber“ · „C bis 60 % darüber“. Werte A | B | C: „1 Person“ 21.250 | 29.750 | 34.000 · „2 Erwachsene“ 28.750 | 40.250 | 46.000 · „2 Erwachsene + 1 Kind“ 36.250 | 50.750 | 58.000 · „2 Erwachsene + 2 Kinder“ 43.750 | 61.250 | 70.000. Kommentarspalte, Modultitel „ZULASSUNG VON B UND C“: „Grundsatz ist Gruppe A; B und C muss die NBank in der Förderentscheidung zulassen. Bis 60 % über der Einkommensgrenze setzt das eine besondere Lage oder Zweckbindung voraus, etwa einen angespannten Wohnungsmarkt; sonst sind bei Vorhaben ab zwölf zusammenhängenden Wohnungen bis +20 % für höchstens die Hälfte der Wohnungen möglich; C entfällt dann.“ Modultitel „NACHWEIS“: „Wohnberechtigungsschein (WBS) der Kommune.“

**Darstellung:** Dominant: natives gruppiertes Balkendiagramm (waagerecht) über 8 Spalten mit vier Haushaltstypen und 3 Reihen in den Gruppentönen A 2A2826, B 77716B, C D8D4CF; Endwerte am Balken (Montserrat Bold 12, Format [$-407]#,##0); x-Achse 0 bis 80.000 €, Schritt 20.000; Achskreise A, B, C in der Legende, die Einträge im Abstand von 0,20 Zoll. Rechts Kommentarspalte mit zwei Einträgen (14 pt). Kein Rot im Diagramm.

**Daten:** Broschüre S. 6 (06-mieterkreis-einkommensgruppen.json, blocks[0].data.rows[0], [1], [3], [4] und series) und S. 12 (12-mix-und-tilgung.json, blocks[2].body) über daten/regeln.json. Keine Werte der Mappe.

**Herkunft:** Broschüre S. 6 und S. 12 (ersetzt Altfassung Folie 26)

**Sprechernotizen**

- Maßgeblich ist das Gesamtjahreseinkommen; nach den Abzügen kann das Bruttoeinkommen deutlich über den Grenzen liegen.
- Weitere Haushaltstypen: 1 erwachsene Person + 1 Kind 32.500 | 45.500 | 52.000 €; 2 Erwachsene + 3 Kinder 51.250 | 71.750 | 82.000 €.
- Den Wohnberechtigungsschein stellt die Kommune aus, meist Landkreis oder Stadt; er gilt ein Jahr.
- Angemessene Wohnfläche: bis 50, 60, 75 und 85 m² für ein bis vier Personen; so ist auch das Modellhaus gemischt.

**Quellenzeile der Notizen:** Quelle: NWoFG § 3 Abs. 2, DVO-NWoFG § 4; RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319); Broschüre S. 6 und 12.

### A6 · Programmteil 2.1: 0 % Zins bis Ende des 35. Jahres

ID `anhang-eckdaten` · Abschnitt Anhang · Layout `PGN_ANHANG` · Baugruppe regeln

**Aussage:** Alle Konditionen des Programmteils 2.1 in einer Tabelle, einschließlich Sicherheiten, vorzeitiger Rückzahlung und Beihilferecht.

**Inhalt (Wortlaut der Folie):** Kicker: „ANHANG · ECKDATEN“. Tabelle mit zwölf Zeilen in zwei Blöcken. Block links: „Antrag, Bewilligung“ · „Antrag bei der Wohnraumförderstelle am Bauort; die NBank bewilligt mit öffentlich-rechtlichem Fördervertrag“ | „Sätze (Höchstwerte)“ · „Darlehen 40/60/70 % plus Zuschuss 40/20/10 % (Gruppe A/B/C), zusammen 80 % der zuwendungsfähigen Kosten; Zuschuss nur mit Darlehen, B und C nur mit Zulassung“ | „Eigenmittel“ · „mindestens 20 % der zuwendungsfähigen Kosten; mindestens die Hälfte als Geld oder lastenfreies Grundstück“ | „Zins“ · „0 % bis Ende des 35. Jahres nach Bezugsfertigkeit; danach bis zu 3 Prozentpunkte über dem Basiszinssatz, höchstens marktüblich“ | „Tilgung“ · „Satz legt die NBank fest; Beginn nach vollständiger Auszahlung, spätestens zwei Jahre nach dem auf die Bekanntgabe der Förderentscheidung folgenden Monat“ | „Kosten, laufend“ · „Verwaltungskostenbeitrag 0,5 % p. a. auf das Restkapital, ab Auszahlungsbeginn“. Block rechts: „Kosten, einmalig“ · „Bearbeitungsentgelt 1 % des bewilligten Darlehens und 0,75 % des bewilligten Zuschusses“ | „Auszahlung“ · „in Raten nach Baufortschritt; Darlehen und Zuschuss je Rate anteilig, Ihre Eigenmittel in der Regel zuerst“ | „Sicherheiten“ · „nachrangige Grundschuld direkt nach den Kapitalmarktmitteln“ | „Versicherung“ · „Brand ab Baubeginn, Sturm ab Bezugsfertigkeit, jeweils gleitender Neuwert, bis zur vollständigen Rückzahlung“ | „Vorzeitige Rückzahlung“ · „Zuschuss anteilig für die restliche Bindungsdauer zurückzuzahlen; die Bindungen enden frühestens 20 Jahre nach Bindungsbeginn“ | „Beihilferecht“ · „Die NBank prüft jede Förderung auf Überkompensation. Eine Eigenkapitalrendite bis 1 Prozentpunkt über dem 30-jährigen Swapsatz gilt stets als angemessen.“

**Darstellung:** Dominant: zwei native Tabellen (addTable) nebeneinander im Raster 6 + 6 mit je sechs Zeilen und zwei Spalten: Stichwort in Montserrat Bold 12 (1,55 Zoll), Text in Work Sans 12; Zeilenlinien 0,5 pt, Kopf entfällt; beide Tabellen enden auf derselben Höhe. Die Zeile „Beihilferecht“ auf Papierfläche. Schlüsselplan mit 2.1 aktiv.

**Daten:** Broschüre S. 9 (09-konditionen-term-sheet.json, blocks[1].rows[0..11], gekürzt um Seitenverweise und Nebensätze) über daten/regeln.json. Abgleich der Zahlen: werte.json, Lauf modellhaus, tab.quote_darlehen.A/B/C, tab.quote_zuschuss.A/B/C, tab.eigenmittel_mindestens, tab.zinsfreie_jahre, tab.verwaltungskostenbeitrag, tab.bearbeitungsentgelt_darlehen, tab.bearbeitungsentgelt_zuschuss.

**Herkunft:** Broschüre S. 9

**Sprechernotizen**

- Sätze, Eigenmittel, Zins, Tilgung und Kosten stehen verdichtet auf den Folien 11 und 12, Antrag und Bewilligung auf Folie 26; rechts stehen die übrigen Punkte, nach denen oft gefragt wird.
- Tilgungsaufschub: Bei vorübergehendem Fehlbetrag kann die NBank den Tilgungsbeginn um bis zu fünf Jahre hinausschieben.
- Zuschlag auf den Zuschuss: Modellprojekt +5, Housing First +10 Prozentpunkte; die Eigenmittel sinken dann entsprechend.
- Vorrangig vor der NBank-Grundschuld stehen nur übliche erststellige Kapitalmarktdarlehen.
- Regie: Der Satz zum Beihilferecht steht im Vortrag nur hier und im Hinweis auf A7.

**Quellenzeile der Notizen:** Quelle: RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319); Broschüre S. 9 und 21.

### A7 · Quellen und Hinweis

ID `quellen` · Abschnitt Anhang · Layout `PGN_ANHANG` · Baugruppe struktur

**Aussage:** Woher die Angaben stammen; maßgeblich sind die Richtlinie und die Förderentscheidung der NBank, Absender ist PGN allein.

**Inhalt (Wortlaut der Folie):** Kicker: „ANHANG · QUELLEN“. Tabelle, Spalten „Folie“ · „Quelle“: „alle“ · „RL Mietwohnraum 2026, Runderlass des Niedersächsischen Ministeriums für Wirtschaft, Verkehr und Bauen vom 25.06.2026 (Nds. MBl. 2026 Nr. 319), gültig vom 01.07.2026 bis 31.12.2031; ergänzend NWoFG, DVO-NWoFG und WoGV“ | „3, 5, 22, 23“ · „ARGE e. V. (2026): Wohnungsbau in Deutschland 2026 (Endbericht), S. 32, Abb. 20, und S. 34, Abb. 23; Folien 22 und 23: PGN (2026): eigene Auswertung von fünf Projekten, Kostenstand Q4 2025“ | „4, 5“ · „NBank-Pressemitteilung zur Wohnungsmarktbeobachtung vom 05.12.2025; Zinsreihe: Dr. Klein Wowi Finanz AG (2026), Zinsentwicklung für die Wohnungswirtschaft, Monatswerte 01/2016 bis 07/2026; Folie 5: eigene Rechnung der PGN“ | „6, 10“ · „NBank-Wohnungsmarktbericht 2025; Folie 6: BT-Drs. 21/7303, Antwort der Bundesregierung vom 21.07.2026“ | „9“ · „NBank-Produktinformation „Allgemeine Mietwohnraumförderung“, Stand 01.04.2026 (Förderregeln bis 30.06.2026)“ | „14–24“ · „Modellrechnung der Planungsgemeinschaft Nord GmbH (Rechenmappe v3, Stand 11/2026)“ | „A3“ · „NBank-Landkarte Wohnraumförderung, abgerufen am 21.10.2026; Landesregierung, Pressemitteilung vom 25.11.2025“. Kasten „HINWEIS“ im festen Wortlaut, genau einmal im Vortrag: „Alle Angaben ohne Gewähr, Stand 30.09.2026. Maßgeblich sind die RL Mietwohnraum 2026 und die Förderentscheidung der NBank. Fördersätze und Beträge sind Höchstwerte; die NBank prüft jede Förderung auf Überkompensation (EU-Beihilferecht). Modellrechnungen sind fiktive Beispiele, keine Förderzusage.“ Darunter: „NBank und Land Niedersachsen sind nicht Herausgeber dieser Präsentation.“ · „Alle Visualisierungen, Zeichnungen und Diagramme: Planungsgemeinschaft Nord GmbH“.

**Darstellung:** Dominant: native Tabelle (addTable) über 12 Spalten mit zwei Spalten (Folie 1,02 Zoll, Quelle) und sieben Zeilen, 12 pt. Direkt anschließend der Hinweis als Kasten auf Papierfläche mit Modulkopf-Linie (Stichwort „HINWEIS“ links in der Spalte „Folie“, Text 14 pt); an der Unterkante der Inhaltszone zwei Zeilen in 12 pt. Kein Achtung-Kasten, kein Vermerk zum Prüfstand auf der Folienfläche.

**Daten:** Broschüre S. 23 (23-impressum-hinweise.json: blocks[2] Hinweis, blocks[3] Rechtsgrundlage, blocks[4] Quellen, blocks[1] mit „Präsentation“ statt „Broschüre“, Bildnachweis aus blocks[0]). Zeilen und Kennungen in daten/rahmen.json (quellen.zeilen). Quellenzeilen der Altfassung laut alt-inventar.md (Altfassung Folien 4, 5, 12, 23 und 24). Stand der Mappe: werte.json, meta.mappe und meta.mappe_stand. Foliennummern beim Bau aus der fertigen Folienliste setzen. Die Foliennummern vor einzelnen Angaben („Folien 22 und 23: …“, „Folie 5: …“, „Folie 6: …“) stehen in daten/rahmen.json als Text; das Modul rechnet sie beim Bau gegen die Quellenzeilen des Konzepts nach (folien/_struktur.cjs, quellenZeilen).

**Herkunft:** Broschüre S. 23; Quellenangaben zu den Folien 3 bis 6, 22 und 23 aus der Altfassung, nicht nachgeprüft

**Sprechernotizen**

- Geprüft gegen Broschüre und Belegsammlung: Förderregeln, Marktzahlen der Broschüre, Bedarfskarte. Aus der Rechenmappe: alle Zahlen der Folien 14 bis 21, 23 und 24.
- Aus der Präsentation vom 26.10.2026 übernommen und nicht nachgeprüft: Baukosten (Folien 3 und 22), Zinsreihe (Folie 4), Bestandsreihe (Folie 6) und der PGN-Median der Herstellungskosten (Folien 22 und 23). Folie 5 rechnet mit diesen Werten.
- Regie: Der Rechtshinweis steht im Vortrag nur hier.
- Absender ist die Planungsgemeinschaft Nord GmbH; NBank und Land Niedersachsen sind nicht Herausgeber.

**Quellenzeile der Notizen:** Quelle: Broschüre S. 23; Quellenangaben der Altfassung zu Baukosten, Zinsen, Bestand und Herstellungskosten der PGN (aus der Altfassung übernommen, nicht nachgeprüft).

## Baugruppen

- **rahmen** (3 Folien): 1 `titel`, 24 `fazit`, 28 `kontakt`
  Titel, Zusammenfassung der Rechnung und Kontakt; an diesen Modulen ändert der Umbau nichts. Die Abschnitte der Mappe folgen aus dem Feld „abschnitt“: Ausgangslage, Programmteil 2.1, Ihre Rechnung, Umsetzung, Anhang. Layouts PGN_TITEL, PGN_KENNZAHLEN_MR, PGN_SCHLUSS; Assets bg-titel, bg-schluss, Logo, QR-Code.
- **einstieg** (4 Folien): 3 `einstieg-baukosten`, 4 `ausgangslage-zinsen`, 5 `einstieg-kapitaldienst`, 6 `einstieg-bestand`
  Thematischer Einstieg vor der Agenda (Folien 3 bis 6), je Folie eine Zahl: Herstellungskosten +52,9 %, Sollzins 3,74 %, Kapitaldienst 20,14 € je m² und Monat, Bestand −40,6 %. Daten in daten/markt.json (Blöcke baukosten, zinsen, kapitaldienst, bestand, markt); die Werte der Altfassung tragen den Vermerk „nicht nachgeprüft“, die Zahlen der Broschüre S. 3 im Block markt sind geprüft. Folie 5 rechnet im Modul nach der Methode der Rechenmappe (jährliche Annuität über 30 Jahre, 80 % Fremdkapital) und prüft die Methode am Modellhaus (313.703 €); Belege mit Formel in daten/pruefung.json. Weißer Grund, kein Stempel, kein Rot in den Diagrammen. Alle vier Folien haben denselben Aufbau: links das Diagramm über acht Spalten, rechts die Hauptzahl in 60 pt und ab y 4,40 ein zweites Modul (Bausteine B.hauptzahl, B.nebenzahl und B.zweitesModul der Bibliothek). Auf der vorhandenen Folie ausgangslage-zinsen ist das Diagramm geblieben; an die Stelle der Kommentarspalte sind die beiden Kennzahlen getreten, der Satz der Broschüre S. 2 steht in den Notizen.
- **regeln** (6 Folien): 9 `neu-seit-juli`, 10 `hoechstmiete`, 11 `foerdermix`, 12 `eckdaten-zeitstrahl`, A5 `anhang-mieterkreis`, A6 `anhang-eckdaten`
  Regelteil nach Broschüre S. 4 und 6 bis 9: vier Hauptfolien (9 bis 12) und zwei Anhangfolien (A5, A6). Regelwerte der Broschüre, die werte.json nicht führt (Stand bis 30.06.2026, Mietpfad 7,21 und 7,65, Angebotsmieten, Einkommensgrenzen, Texte der Eckdaten), kommen mit Seitenangabe in daten/regeln.json; tab.* aus werte.json dient dem Abgleich. Bausteine: Fördermix-Diagramm (Probe 2), Vergleich (Probe 12), Zeitstrahl, Schlüsselplan und Daumenregister 2.1.
- **rechnung** (7 Folien): 14 `rechnung-finanzierung`, 15 `rechnung-jahr1`, 16 `rechnung-kapitaldienst`, 19 `rechnung-miete`, 20 `rechnung-tilgung`, 21 `rechnung-verlauf`, 23 `rechnung-kosten`
  Sieben Folien der Modellrechnung (14 bis 16, 19 bis 21 und 23), alle auf Papierton mit Stempel, Vollversion mit Zusatz nur auf Folie 14. Alle Zahlen aus werte.json (Läufe modellhaus, modellhaus_zeitreihe, modellhaus_pgn_kosten, modellhaus_kosten_5200), gerundet erst beim Formatieren; Vorzeichen von zr.* und frei.* drehen. Kein Rot in den Diagrammen der Folien 16 bis 23; gefördert in Tinte, frei finanziert in 77716B. Keine Renditen, keine Marktmiete, kein Lauf modellhaus_dscr125.
- **fluss** (2 Folien): 17 `rechnung-fluss-gefoerdert`, 18 `rechnung-fluss-frei`
  Zwei Flussdiagramme des Zahlungsflusses in Jahr 1 für das Modellhaus, Gruppe A (Folien 17 und 18), auf Papierton mit Stempel. Beide Module teilen sich Maßstab (Euro je Zoll Höhe), Lagen der Knoten, Reihenfolge der Ziele und Farbrollen aus einer gemeinsamen Datei folien/_fluss.cjs: Tilgung Tinte, Zins 77716B, Verwaltungskostenbeitrag und Bewirtschaftung im Referenzgrau des Themes mit 50 und 70 % Transparenz (auf Papierton wie B4B0AB und CFCCC8); kein Rot. Gebaut mit dem Baustein D.fluss der Bibliothek aus nativen Freihandformen (Punktangabe von pptxgenjs), kein Pixelbild. Werte aus werte.json (Lauf modellhaus); nötige Sollmiete frei finanziert, Mietausfall dazu und alle Anteile rechnet das Modul, Belege mit Formel in daten/pruefung.json. Zuflüsse und Abflüsse gehen je Knoten auf; das Modul prüft es.
- **struktur** (8 Folien): 7 `agenda`, 22 `pgn-baukosten`, 2 `trenner-ausgangslage`, 8 `trenner-programmteil`, 13 `trenner-rechnung`, 25 `trenner-umsetzung`, A0 `anhang-trenner`, A7 `quellen`
  Agenda mit dem Fokus auf Programmteil 2.1 (Folie 7; feste Texte in daten/rahmen.json, Block agenda), Kostenvergleich PGN gegen ARGE im Hauptteil (Folie 22; Daten in daten/markt.json, Block kosten; tritt an die Stelle der früheren Anhangfolie zu den Herstellungskosten), rote Trenner vor jedem Abschnitt des Hauptteils (Folien 2, 8, 13 und 25: Achskreis mit der Nummer des Abschnitts, Achsleiste mit vier Kreisen), Anhang-Trenner (A0: Vorspann ohne „Herstellungskosten und Markt“) und Quellen (A7: Zeilen in daten/rahmen.json, Blattnummern aus den Quellenzeilen aller Folien). A7 wird zuletzt gebaut, wenn die Quellenzeilen feststehen.
- **umsetzung** (4 Folien): 26 `antragsweg`, 27 `pgn-leistungen`, A3 `anhang-voraussetzungen`, A4 `anhang-vertraege`
  Antragsweg und Leistungen der PGN nach Broschüre S. 19 und 20, dazu die Anhangfolien A3 und A4 (S. 4, 18, 19). Folie 26 trägt das Warnband, eines von zwei Signalelementen. Bausteine: Achsleiste mit Achskreisen, Balkenplan der Leistungsphasen, Ringdiagramm, Bild mit Bildecke „Visualisierung“ und Konturstempel.
- **ueberblick** (2 Folien): A1 `anhang-programmteile`, A2 `anhang-frist`
  Nachschlagefolien nach Broschüre S. 5 und 16: Programmteile (A1; die Agenda verweist darauf) und Frist (A2, zweites Signalelement). Texte in daten/markt.json (Blöcke programmteile, frist). An den Modulen ändert der Umbau nichts.

## Entscheidungen

1. Gerüst ist der Entwurf „entscheider“: Die Rechnung am Modellhaus steht in der Mitte (Folien 13 bis 24), davor die Ausgangslage und die Regeln, die man zum Lesen braucht, danach der Weg zur Bewilligung und die Leistungen der PGN.
2. Der Höhepunkt steht auf vier Folien: Kapitaldienst 84.000 gegen 313.703 € als Balkenpaar (Folie 16), der Zahlungsfluss in Jahr 1 gefördert und frei finanziert als Flussdiagramme im selben Maßstab (Folien 17 und 18) und die nötige Miete 6,77 gegen 20,72 € je m² mit der Marke Höchstmiete 6,80 € (Folie 19).
3. Nach Durchsicht durch den Auftraggeber steht vor der Agenda ein Einstieg in vier Folien, je Folie eine Zahl: Herstellungskosten +52,9 % seit Q1 2020 (Folie 3), Sollzins 3,74 % (Folie 4), Kapitaldienst 20,14 statt 8,95 € je m² und Monat (Folie 5), Bestand gebundener Wohnungen in Niedersachsen −40,6 % seit 2016 (Folie 6). Die Folien 3 bis 6 und 22 tragen damit Zahlen der Altfassung im Titel; der Vermerk steht in den Notizen und in INHALT.md.
4. Folie 4 nutzt die Zinsreihe der Altfassung als natives Diagramm. Ihr Titel nennt die beiden Werte der rechten Spalte, mit denen Folie 5 rechnet: 3,74 % im Juli 2026 und 0,46 % Anfang 2020, je bei 10 Jahren Zinsbindung. Der geprüfte Satz der Broschüre S. 2 („Kredite kosteten Ende 2025 drei bis vier Prozent“) steht in den Sprechernotizen. Bautätigkeit, Landesziel, Pestel-Lücke und der Vergleich mit den 1990er-Jahren aus der Altfassung entfallen: nicht belegt. Die neu bewilligten Wohnungen je Jahr entfallen, weil die Reihe anders abgegrenzt ist als die Förderbilanz der NBank.
5. Folie 5 rechnet nach der Methode der Rechenmappe: 80 % Fremdkapital, Annuitätendarlehen über 30 Jahre mit jährlicher Annuität. Die Probe am Modellhaus ergibt 313.703 € (werte.json). Ergebnis 8,95 und 20,14 € je m² und Monat; die Altfassung nannte mit monatlicher Annuität 8,93 und 19,95 €. Zerlegung des Anstiegs von 11,19 €: Baukosten 3,91 € (neue Kosten zum alten Zins), Zins 5,07 € (alte Kosten zum neuen Zins), Wechselwirkung 2,21 € (Rest). Die Folie trägt keinen Stempel und nennt den Wert „Kapitaldienst je m² und Monat“, damit ihn niemand mit der nötigen Miete des Modellhauses (20,72 €) verwechselt. Die Aufteilung in Zins und Tilgung ist in der Lesart „erstes Jahr“ gerechnet (heute 13,44 € Zins und 6,69 € Tilgung) und steht nur in daten/pruefung.json.
6. Die Agenda (Folie 7) steht nach dem Einstieg; die frühere Entscheidung „keine Agenda“ ist durch den Wunsch des Auftraggebers ersetzt. Sie zeigt die vier Abschnitte an einer Achse und nennt den Fokus: Der Vortrag behandelt Programmteil 2.1; die Programmteile 2.2 bis 2.6 stehen in der Broschüre (S. 13, 14, 15 und 17) und im Anhang A1. Jeder der vier Abschnitte beginnt auf Wunsch des Auftraggebers mit einem roten Trenner (Folien 2, 8, 13 und 25), der Anhang mit einem hellen.
7. Abschnitte der Mappe: Ausgangslage, Programmteil 2.1, Ihre Rechnung, Umsetzung, Anhang. Kicker und Rubrik nennen den Abschnitt und das Thema der Folie; die Agenda trägt den Kicker „Inhalt des Vortrags“, weil sie alle vier Abschnitte nennt. Die Kontaktfolie zählt zum Abschnitt Umsetzung.
8. Aus „broschuere“ übernommen: die Vorher-Nachher-Folie zu den Neuerungen seit 01.07.2026 (Folie 9) und die Marktzahl 28 % (Folie 6). Eine zweite Zusammenfassung gibt es nicht.
9. Aus „altfassung“ übernommen: Baukosten Q1 2020 gegen Q4 2025 (Folie 3), drei Zinsbindungen im Zinsdiagramm (Folie 4), die Kette zum Kapitaldienst je m² (Folie 5), die Bestandsreihe 2016 bis 2025 (Folie 6), Höchstmieten als gruppierte Säulen (Folie 10), die Flussdiagramme (Folien 17 und 18; in der Altfassung Pixelbilder), der Kostenvergleich PGN gegen ARGE (Folie 22) und das Kostenszenario am Modellhaus (Folie 23). Alle Diagramme sind nativ neu gebaut.
10. Die Flussdiagramme (Folien 17 und 18) zeigen das Modellhaus in Gruppe A mit den Werten der Jahresrechnung. Beide haben denselben Maßstab und dieselben Lagen der Knoten. Anteile an der Sollmiete stehen mit einer Nachkommastelle und nur an den Zielen; so ergeben sie auf beiden Folien 100,0 %. Frei finanziert ist die Quelle die Sollmiete, bei der der Zahlungsüberschuss null ist (348.167 €); gerundet beschriftet bleibt 1 € Unterschied zur Summe der Ziele.
11. Folie 20 zeigt den Zahlungsüberschuss je Tilgungssatz für A, B und C wie Block 4 der Mappe. Das Diagramm schließt an die Jahresrechnung an (bei 2,5 % stehen deren Werte) und trägt die Sätze der Broschüre S. 12. Das Diagramm „Mehrüberschuss gegenüber A“ der Broschüre steht nicht auf einer Folie; der Rechenweg steht in den Notizen.
12. Der Verlauf Jahr 1 bis 35 steht im Hauptteil (Folie 21). Wird gekürzt, wandert zuerst Folie 21 in den Anhang.
13. Der Kostenvergleich PGN gegen ARGE steht auf Wunsch des Auftraggebers im Hauptteil (Folie 22), direkt vor dem Kostenszenario (Folie 23), das 3.579 € je m² als eine von drei Spalten nennt. Folie 22 trägt keinen Stempel und nennt die Grundlagen: fünf Projekte der PGN, deutsche Großstädte bei der ARGE, Kostenstand Q4 2025. Ohne Bestätigung der PGN entfallen Folie 22 und die Spalte 3.579 €; Folie 23 steht dann mit 4.500 und 5.200 €.
14. Die Zusammenfassung (Folie 24) schließt den Abschnitt „Ihre Rechnung“ und steht vor Antragsweg und PGN. Sie nennt drei Zahlen mit Bedingung und die drei Größen, von denen das Ergebnis abhängt; einen wertenden Satz gibt es nicht (Redaktionsregeln §8.1 und §9.7).
15. Die sechs Voraussetzungen und die Bedarfslage (306 und 96) stehen im Anhang (A3). Eigenmittel und Vorhabenbeginn stehen ohnehin auf den Folien 11 und 26.
16. Der Anhang-Trenner zählt zum Anhang: Trenner, sechs Inhaltsfolien, Quellen. Die früheren Anhangfolien zu Herstellungskosten und Markt sind in den Folien 22 und 6 aufgegangen. Umfang: Hauptteil 28, Anhang 8 Folien.
17. Das Projekt der Altfassung (14 Wohnungen, ohne Grundstück; Lauf projekt2) erscheint nicht. Zwei Rechenbeispiele mit 455 € und 13.591 € nebeneinander verwirren; die Werte liegen in werte.json bereit.
18. Stempel „Modellrechnung“ auf allen Folien des Modellhauses (14 bis 21, 23 und 24), Vollversion mit Zusatz nur auf Folie 14. Kein Stempel auf Folie 5 (Medianwerte je m²) und Folie 22 (Kostenkennwerte). Zwei Signalelemente im ganzen Vortrag: Warnband „Bewilligung“ (Folie 26) und Achtung-Kasten „Frist 31.12.2026“ (A2). Rote Folien: Titel, Trenner, Kontakt.
19. Der Vermerk „aus der Altfassung übernommen, nicht nachgeprüft“ steht in den Sprechernotizen der Folien 3, 4, 5, 6, 22, 23 und A7 und in INHALT.md; auf den Folien 3 bis 6 und 22 als Regie-Hinweis, weil er kein Sprechtext ist, und in jeder Quellenzeile. Auf der Folienfläche von A7 stehen die Quellen ohne Prüfvermerk, weil das Publikum die Quelle braucht und der Prüfstand ein Arbeitsvermerk für PGN ist.
20. Datenweg: Zahlen der Mappe nur über daten/werte.json. Regelwerte, die nur die Broschüre hat, kommen mit Seitenangabe in daten/regeln.json; Reihen und Werte der Altfassung mit Herkunft in daten/markt.json; gerechnete Größen mit Formel in daten/pruefung.json. Im Foliencode steht keine Zahl von Hand.
21. Begriff auf den Folien 18, 19, 23 und 24: „Nötige Miete“ wie in der Mappe, auf Folie 19 ausgeschrieben als „Miete je m² und Monat, bei der der Zahlungsüberschuss null ist“; Folie 18 nennt die Jahressumme „Nötige Sollmiete“. Die Marktmiete des Modellhauses, DSCR und Renditen erscheinen nirgends.

## Offene Fragen an PGN

1. Tenor der Jahresrechnung: Folie 15 nennt im Titel 455 € für A und Fehlbeträge für B und C. Trägt PGN diesen Titel im Vortrag? Die Entscheidung zum Tenor ist auch für die Broschüre noch offen.
2. Tilgungssatz 2,5 %: Die Folien 15 bis 24 rechnen mit dieser Annahme; sie ist nicht mit der NBank abgestimmt. Bleibt PGN dabei, oder nennt die NBank einen Satz? Unter 2,381 % bliebe in Jahr 42 eine Schlussrate.
3. Titel der Zusammenfassung (Folie 24): Bleibt es bei „Tilgungssatz, Kosten und Höchstmiete bestimmen das Ergebnis“?
4. Herstellungskosten 3.579 € je m² (Median aus fünf PGN-Projekten, Kostenstand Q4 2025): Bestätigt PGN den Wert, die Spanne 3.321 bis 3.861 € und die Werte je Kostengruppe für den Hauptteil (Folien 22 und 23)?
5. Daten der Altfassung im Einstieg: Darf PGN die ARGE-Werte (Folien 3, 5 und 22), die Zinsreihe der Dr. Klein Wowi Finanz AG (Folien 4 und 5) und die Bestandsreihe aus BT-Drs. 21/7303 (Folie 6) im Vortrag zeigen, und stimmen die Quellenangaben? Gibt es die Zinsreihe bis 09/2026? Folie 4 nennt im Titel jetzt die Werte der Reihe (3,74 und 0,46 %). Soll dort wieder der Satz der Broschüre stehen („Kredite kosteten Ende 2025 drei bis vier Prozent“), rückt die Hauptzahl auf das Mittel Q4 2025 (3,49 %).
6. Dauer: Mit Einstieg, Agenda, Flussdiagrammen und Kostenvergleich hat der Hauptteil 28 Folien, davon vier Trenner, und dauert 33 bis 35 Minuten. Reicht die Redezeit? Sonst wandert zuerst Folie 21 in den Anhang.
7. Vortrag: Ort und Datum für die Titelfolie. Liegt der Termin nach dem 31.12.2026, entfällt A2; sitzen Bestandshalter im Publikum, rückt A2 in den Hauptteil.
8. Referenzbild Brauerstraße auf Folie 27: Sind die Bildrechte für öffentliche Vorträge geklärt?
9. Soll das Projekt der Altfassung (14 Wohnungen, 828 m², ohne Grundstück) als zusätzliche Anhangfolie erscheinen? Vorgesehen ist es nicht.

## Ungeprüfte Angaben (aus der Altfassung übernommen, nicht nachgeprüft)

1. Folie 3: ARGE-Mediane deutscher Großstädte, Bruttokosten je m² Wohnfläche, Q1 2020 und Q4 2025: Herstellung 3.028 und 4.631 € (+52,9 %), Grundstück 726 und 761 € (+4,8 %); in den Notizen Bauwerk +52,2 % und Baunebenkosten +57,1 % (Altfassung Folie 23).
2. Folie 4: Zinsreihe „Sollzins p. a. nach Zinsbindung“, 127 Monatswerte 01/2016 bis 07/2026 für 10, 20 und 30 Jahre, Bezeichnung „Top-Konditionen Wohnungswirtschaft“ (Altfassung Folie 24; Quelle dort: Dr. Klein Wowi Finanz AG).
3. Folie 4: Ø Q1 2020 0,46 | 0,87 | 0,98 %; Ø Q4 2025 3,49 | 3,74 | 3,87 %; Juli 2026 3,74 | 4,02 | 4,15 %; im Titel 3,74 und 0,46 % (10 Jahre Zinsbindung); in den Notizen Tiefstwert 0,33 % (10/2020) und Höchstwert 3,86 % (10/2023).
4. Folie 5: Kapitaldienst je m² und Monat 8,95 € (Q1 2020) und 20,14 € (heute), Anstieg 11,19 € mit den Anteilen 3,91 | 5,07 | 2,21 €. Neu gerechnet nach der Methode der Rechenmappe, aber auf ungeprüften Eingangswerten: Kosten 3.754 und 5.392 € je m² (ARGE), Zins 0,46 % (Dr. Klein Wowi Finanz AG); der Fremdkapitalanteil von 80 % ist die Annahme der Altfassung Folie 5.
5. Folie 6: Bestand an Mietwohnungen mit Miet- und Belegungsbindung in Niedersachsen zum 31.12., 2016 bis 2025 (85.766 bis 50.920, Rückgang 40,6 %; Altfassung Folie 4; Quelle dort: BT-Drs. 21/7303, Antwort der Bundesregierung vom 21.07.2026). Geprüft sind auf dieser Folie die Zahlen der Broschüre S. 3 (58.024, rund 16.000, 28 %, Bestand 2024 50.495).
6. Folien 22 und 23: Herstellungskosten 3.579 € je m² (Median aus fünf PGN-Projekten, Kostengruppen 200–700, Kostenstand Q4 2025; Altfassung Folien 11 und 12).
7. Folie 23, Spalte 3.579 €: Gesamtkosten 5,71 Mio. €, Förderung 4,57 Mio. €, Zahlungsüberschuss 15.928 €, nötige Miete 5,83 €; in den Notizen Kapitaldienst 68.527 € und nötige Miete frei finanziert 17,21 €. Mit der Mappe gerechnet, aber auf dem ungeprüften Eingabewert.
8. Folie 22: PGN-Werte je Kostengruppe (Median Bauwerk 2.812 €, Baunebenkosten 458 €, Außenanlagen 221 €; Spanne Herstellung 3.321 bis 3.861 €; Altfassung Folie 12).
9. Folie 22: ARGE-Werte für deutsche Großstädte, Bruttokosten (Median Q4 2025: Herstellung 4.631 €, Bauwerk 3.713 €, Baunebenkosten 555 €, Außenanlagen 174 €; Spanne Herstellung 3.221 bis 8.592 €; Altfassung Folie 12) und der daraus gerechnete Abstand von 22,7 %.
10. Quellenangaben zu diesen Daten (ARGE e. V., Wohnungsbau in Deutschland 2026, S. 32 Abb. 20 und S. 34 Abb. 23; Dr. Klein Wowi Finanz AG; BT-Drs. 21/7303; PGN, eigene Auswertung von fünf Projekten) stammen aus den Quellenzeilen der Altfassung.
