# Skizzen Team 1 „Geldfluss“

Übrige Folien von Kapitel 3 und Anhang als Skizze (16:9, Raster mit zwölf Spalten, Inhaltszone, Titel, Lage der Elemente, echte Zahlen).
Die Schlüsselfolien 16 und 17 und das Fazit 28 sind fertige Entwürfe in `../folien/` (gebaut zu `../Entwurf-Team-1.pptx`, Bilder in `../png/`).
Erzeugt von `bau_skizzen.py`; jede Zahl kommt aus `konzepte/mappe/werte_konzepte.json` (Lauf konzepte oder Laufkopie) oder
`konzepte/team-1/mappe/werte_team.json`; alle gelesenen Schlüssel mit Blatt und Zelle stehen in `skizzen.belege.tsv`.
Die Skizzen nutzen Diagramme aus der Zeichenbibliothek nur als Bild; in der Folie werden sie native Diagramme nach `praesentation/lib`.

| Folie | Datei | Layout | Inhalt der Skizze | Zahlen (Blatt!Zelle) |
|---|---|---|---|---|
| 13 | `folie-13-trenner.png` | PGN_ABSCHNITT_ROT | Trenner mit Themen im Titel, Lead mit Wohnungen und Fläche | Eingaben!F9, F8 |
| 14 | `folie-14-finanzierung.png` | PGN_INHALT_MR, 8 + 4 | gestapelte Balken je Variante (Zuschuss rot, NBank-Darlehen, Bankdarlehen, Eigenmittel schraffiert), Hinweiskasten mit Bearbeitungsentgelten und Mietmarke, Stichpunkte „Gleich in allen vier“ und „Verschieden“ | Konzepte!D52:H55, D57:F57, H49; Übersicht!D15, D19:G19; Eingaben!F8, F9, F11, F25, F35, F38; Tabellen!D18 |
| 15 | `folie-15-annahmen.png` | PGN_INHALT_MR, 4 + 4 + 4 | drei Tabellen „Annahme · Wert · Herkunft“ (38 Annahmen, dieselbe Liste wie Blatt 9), rote Marke an DSCR 1,2, Hinweiskasten über zwölf Spalten mit Mietmarke | Eingaben!F7 bis F46; Tabellen!C14 bis D29, F36 bis F41; Konzepte!D6, H49; Übersicht!D106 |
| 16 | `../png/folie-01.png` | fertiger Entwurf | Jahresrechnung Jahr 1, vier Spalten, Mietzeile und DSCR-Zeile | Team-1-Mappe Konzepte!D111:H121; Konzepte!D62:H62, G61, D57:F57, D14 |
| 17 | `../png/folie-02.png` | fertiger Entwurf | Geldfluss Jahr 1 und Jahr 1 bis 35 als 100-%-Balken | Team-1-Mappe Konzepte!D112:H148 |
| 18 | `folie-18-mieten.png` | PGN_DIAGRAMM_MR, 7 + 5 | gruppierte Balken kostendeckend, für DSCR 1,2, angesetzt; Marke Marktmiete; Hinweiskasten „für welches Darlehen gilt 1,2“; DSCR-Tabelle und Stichpunkte | Team-1-Mappe Konzepte!D152:H152, H154; Konzepte!D49:H50, D62:H62, F61, D14, D26:F26; Eingaben!F25 |
| 19 | `folie-19-dscr-verlauf.png` | PGN_DIAGRAMM_MR, 7 + 5 | DSCR je Jahr, vier Linien, Marke 1,2 „gilt nur frei finanziert“, Punkt „Bankdarlehen getilgt“ | Konzepte Zeitreihe!H7:H41, Q7:Q41, Z7:Z41, AR7:AR36; Konzepte!D71:H71, D73:H73; Team-1-Mappe Konzepte!D158:H158 |
| 20 | `folie-20-liquiditaet.png` | PGN_DIAGRAMM_MR, 7 + 5 | Zahlungsüberschuss je Jahr, Sprung frei in Jahr 31 beschriftet; Tabelle Liquidität (Fehlbetrag, tiefster Stand Projektkonto, kleinster Überschuss, kumuliert) | Konzepte Zeitreihe!F7:F41, O, X, AP; Konzepte!D64:H70; Eingaben!F26, F32; Tabellen!D28 |
| 21 | `folie-21-rueckfluss.png` | PGN_DIAGRAMM_MR, 7 + 5 | kumulierter Zahlungsüberschuss minus Eigenkapital, Jahr 0 bis 35, Nulllinie „Eigenkapital zurück“; Tabelle gebundenes Eigenkapital | Team-1-Mappe Konzepte!D161:H196; Konzepte!D56:H56, D67:H67; Übersicht!D19 |
| 22 | `folie-22-objektrendite.png` | PGN_DIAGRAMM_MR, 7 + 5 | Säulenpaare ÷ Gesamtkosten und ÷ Gesamtkosten minus Zuschuss; Rechenweg-Tabelle; Stichpunkte „Fair lesen“ | Konzepte!D87:H88, D59:H59, D52:H53, D49:H49 |
| 23 | `folie-23-eigenkapitalrendite.png` | PGN_DIAGRAMM_MR, 7 + 5 | gestapelte Säulen Vermögen Ende Jahr 35 (Restwert, Projektkonto, Restschuld unter null); Rechenblatt mit Ergebniszeile Eigenkapitalrendite | Konzepte!D56:H56, D75:H83; Übersicht!D106; Lauf mietsteigerung_0 Konzepte!H81 |
| 24 | `folie-24-risiken.png` | PGN_INHALT_MR, 12 | Tabelle je Lauf: Jahre mit Fehlbetrag, Eigenkapitalrendite mit Restwert, Miete frei; Hinweiskasten zur Miete frei | je Lauf Konzepte!D68:H68, D81:H81, H49; Lauf mietsteigerung_0 H71, H73; Konzepte!G62, G68, G81 |
| A6 | `folie-A6-miete-dscr.png` | PGN_ANHANG | Rechenblatt der Formel Miete für DSCR 1,2 mit Gegenprobe | Konzepte!D6, D11, D15, D27:F27, D50:H50, D60:H60; Eingaben!F8, F25, F29 |
| A7 | `folie-A7-risiken-einzeln.png` | PGN_ANHANG | Tabelle je Lauf mit Gruppenkopf: Zahlungsüberschuss Jahr 1, DSCR tiefster Wert, Jahre DSCR unter 1,2 (dazu im Bau: tiefster Stand Projektkonto, Eigenkapitalrendite ohne Restwert); Hinweiskasten mit Mietmarke | je Lauf Konzepte!D61:H61, D71:H71, D73:H73, D70:H70, D82:H82 |
| A8 | `folie-A8-heute-20-unveraendert.png` | wie heute Folie 20 | Tilgungssatz, verschoben, Inhalt unverändert (Bild der heutigen Folie; Blattnummer und Verweis „Folie 23“ werden beim Einbau zu A8 und A9) | Übersicht!B55:F62, D49:F49, F64 |
| A9 | `folie-A9-heute-A7-unveraendert.png` | wie heute A7 | Tilgungsschwelle je Herstellungskosten, unverändert (Blattnummer wird A9) | Übersicht!E63, F64 und Läufe kosten_4631, kosten_5460 |
| A10 | `folie-A10-heute-22-unveraendert.png` | wie heute Folie 22 | Herstellungskosten der PGN, unverändert | praesentation/daten/markt.json; Eingaben!F11 |
| A11 | `folie-A11-nach-der-bindung.png` | PGN_ANHANG | Zahlungsüberschuss Jahr 30 bis 42 mit Marke „Ende der Bindung“, Hinweiskasten mit Mietmarke; Tabelle Restschuld, Jahr 42, Vermögen, Rendite Horizont 42 | Konzepte Zeitreihe!F36:F48, O, X, AP; Konzepte!D75:H75, D90:H96; Eingaben!F19, F27 |
| 28 | `../png/folie-03.png` | fertiger Entwurf | Fazit: vier Kapitel mit Kennzahl, Ergebniszeile gefördert gegen frei finanziert | siehe `../Entwurf-Team-1.belege.json` |

Broschüre (A4 hoch, Satzspiegel 180 × 259 mm, zwölf Spalten zu 11,33 mm, Steg 4 mm) in `../broschuere/`:

| Blatt | Datei | Module | Zahlen |
|---|---|---|---|
| 9 (Bogenseite 10) | `blatt-09-bogen-10.png` | Finanzierung als gestapelte Balken (7 Spalten) · Steckbrief Modellhaus (4) · Annahmen vollständig in drei Tabellen mit Herkunft, dieselbe Liste wie Folie 15 (je 4) · Kasten „Neu: DSCR 1,2 der Bank“ (12) | wie Folien 14, 15, 18 |
| 10 (Bogenseite 11) | `blatt-10-bogen-11.png` | Jahresrechnung Jahr 1 mit vier Spalten, Mietzeile, DSCR-Zeile (12) · Geldfluss Jahr 1 in % (7) · Mieten im Vergleich mit Kasten „Gruppe C unter DSCR 1,2“ (4) · Kasten Annahmen mit Mietmarke (12) | wie Folien 16, 17 links, 18 |
| 11 (Bogenseite 12) | `blatt-11-bogen-12.png` | Zahlungsüberschuss je Jahr, „Jahre mit Fehlbetrag“ im Modulkopf (7) · Geldfluss Jahr 1 bis 35 in % (5) · „Was das Eigenkapital bringt“ (7) · Risiko kompakt (5) · Kasten „Frei finanziert vorn: unter welchen Annahmen?“ · Kasten Tilgungssatz (Übersicht!F64); unten Platz für Quellenzeile | wie Folien 17 rechts, 20 bis 24; Team-1-Mappe Übersicht!F64 |
