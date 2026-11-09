# Sollkonzept VOFI Mietwohnraum 2026, Version 3

**Stand:** 09.11.2026, Fassung 4 (Kritik vom 09.11.2026, Abschnitt J; Nacharbeit Runde 1, Abschnitt K; Nacharbeit Runde 2, Abschnitt L) · **Status:** verbindliche Bauvorlage für `build_vofi.py` und `pruefe_vofi.py` · **Intern**

**Ziel:** `/home/user/NBank/vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx`, neu erzeugt von `/home/user/NBank/vofi/build_vofi.py` (openpyxl), danach mit `recalc.py` neu berechnet, geprüft mit `/home/user/NBank/vofi/pruefe_vofi.py`.

**Grundlagen:** alte Mappe `broschuere/zulieferungen/PGN_NBank_VOFI_Modell_v2-1.xlsx` (SHA-256 `11d558b3…5e28b`, wird nie verändert), `vofi-pruefung/PRUEFBERICHT.md` (B1–B11, G1–G12), `kennzahlen-konzept.md` (Konventionen, Umbauliste 6.2), `referenzrechnung.py` (Sollwerte), Broschüre S. 10–12 (`content/pages/10-…`, `11-…`, `12-…`), RL Mietwohnraum 2026 (Nds. MBl. 2026 Nr. 319).

Kurzzeichen (nur in diesem Konzept, nicht in der Excel): RW = Restwert („mit Restwert“), Geb.-RW = Gebäudeanteil des Restwerts („ohne Geb.-RW“ = „nur Bodenwert“), brutto = ohne Zuschuss, ZÜ = Zahlungsüberschuss, VKB = Verwaltungskostenbeitrag, BE = Bearbeitungsentgelte, RR = `referenzrechnung.py`, J35/J42 = Jahr 35/42 (Horizont), x = jedes der Blätter Gefördert A/B/C.

---

## 0. Entscheidungen im Überblick

| Nr. | Entscheidung | Grund |
|---|---|---|
| E1 | 9 Blätter: Übersicht, Eingaben, Gefördert A, Gefördert B, Gefördert C, Frei finanziert, NBank, Tabellen, Hinweise | Höchstgrenze 9; NBank getrennt (Ebene 4); Kennzahlen der Ebenen 1–3 auf der Übersicht |
| E2 | 37 Eingaben in 9 Blöcken (v2-1: 75 Eingabezellen, 101 mit Festlegungen) | Streichliste Abschnitt E |
| E3 | Die Blätter Gefördert A/B/C sind zellgleich; die Gruppe steht nur in `B2` | eine Formel je Spalte für alle drei Gruppen, prüfbar |
| E4 | Zeitachse t = 0 … 80; Zahlungen bis t = 42, t = 43 … 80 nur Mietpfad und Reinertrag für den Restwert | Restwert als Ertragswert bis Gesamtnutzungsdauer 80 Jahre (B5) |
| E5 | Eigenkapital = Grundstück (Verkehrswert, Sacheinlage) + bares Eigenkapital als Restgröße; die Bank finanziert nur Herstellungskosten, die nach Förderung und RL-Mindesteigenmitteln fehlen | B4; Broschüre S. 10 „Restfinanzierung“; Abweichung A3 mit Wirkung D.2a, offen O1 |
| E6 | Bearbeitungsentgelte und KG 800 zahlt das Eigenkapital bei Bezug; die Bank finanziert sie nicht; keine Bauphase, keine Vorlaufzeit | B7; Broschüre S. 11; RR |
| E7 | Tilgung NBank als Satz (2,50 % linear vom Ursprungsdarlehen), ab Jahr Aufschub + 1, Rest spätestens in Jahr 42 | freigegebene Annahme; RL Nr. 5.3.5 |
| E8 | Kostenstand als Eingabe 5.5 (0 = Stand 2026 gilt in Jahr 1) | B8, Umbauliste Nr. 10 |
| E9 | Restwert = periodischer Ertragswert auf einheitlichem Preisstand, Boden und Gebäude getrennt, Abschlag der Bestandsmiete bis zur Zielmiete | B2, B5, B6 |
| E10 | IRR nach der Konvention „größte Nullstelle mit fallendem Barwert“ (kennzahlen-konzept 3.3): erster Treffer der Startwert-Kaskade (Objekt 3 %, Eigenkapital = VOFI-EK-Rendite derselben Variante, sonst 0; danach −10, −30, −50, −60, −70 %; Ergebnisse ≤ −100 % gelten als Fehlversuch), zweiter Versuch `IRR` ab erstem Treffer + 5 Prozentpunkte; gezeigt wird die größere der beiden Nullstellen, wenn der Barwert dort fällt (Barwert bei +0,01 Prozentpunkten < 0), sonst „n. v.“. Beide Treffer stehen als Hilfswerte in den gegliederten Spalten (Gefördert Y–AB, Frei O–R) neben der Kennzahl (Runde 1 R1/R2, Runde 2 R2) | Ein einzelner Startwert trifft bei mehreren Nullstellen je nach Reihe die obere oder die untere (Runde 2 R2: L10, L41, Tilgung 0 %). Mit zweitem Versuch und Barwert-Test gleich der RR in allen Läufen und 28.650 nachgerechneten Reihen, außer Nullstellen unter −69 % („n. v.“, K.2 R1). Bei mehreren Nullstellen ist der IRR nicht eindeutig; maßgeblich ist die VOFI-EK-Rendite (Bemerkung Übersicht 5.5, 5.7, 5.9, 6.2, 6.6; Prüfregel F8) |
| E11 | Stresstest mit 4 neutralen Größen (9.1–9.4) statt Szenario-Umschalter | Vorgabe 5 |
| E12 | 64 benannte Bereiche (v2-1: 384): alle Eingaben (Spalte „verwendet“), Projektwahl und alle Festwerte; keine Gruppen-Namen | Formeln lesbar, Blätter A/B/C identisch |
| E13 | Herstellungskosten je m² Wohnfläche (2.1) und Laufzeit des Bankdarlehens (6.4) als Eingaben; Annuität und Anfangstilgung per Formel | G11; Broschüre denkt in €/m²; keine versteckte Stellenzahl |
| E14 | Überfinanzierung bei Bezug (Kasse ≥ 1 €) sperrt alle Renditen der Blätter Gefördert A/B/C („n. v.“) | B4, Umbauliste Nr. 1 |
| E15 | Prüfblock nur für Fehler, die anschlagen können (P1–P6), sichtbar, mit Kasse bei Bezug neben P1; jede Prüfung in `IFERROR` (Fehlerwert = „prüfen“), Gesamtstatus „OK“ nur bei sechsmal „OK“; zulässige Sonderfälle als Beträge in Block 1 und 3; Identitäten nur im Prüfskript (F13) | Gesamtstatus bleibt aussagekräftig, auch bei Fehlerwerten (Runde 2 R1); Ursache der Sperre sichtbar |
| E16 | Projektwahl über die Position (D3 = 1 oder 2), Projektnamen als Eingaben D4:E4 | Umbenennen eines Projekts löst keinen Bezugsfehler aus (Runde 1, V1) |
| E17 | Übersicht als Kurzfassung auf zwei Druckseiten: Nebenwerte eingeklappt, Restwert-Varianten ausgeschrieben, nicht zutreffende Frei-Zellen leer; Bemerkungen der Blöcke ohne Horizont (1–4, 8) in Spalte H neben den Zahlen | Runde 1, V2/V4; Runde 2, V4/V5 |
| E18 | Vergleich gefördert gegen frei auf Objekt-IRR-Basis nach Förderbarwert (Zuschuss nach Entgelt + Barwertvorteil des NBank-Darlehens zum Zins 6.1); daneben nach Zuschuss und ohne Zuschuss (Kosten der Bindung), Frei in allen Zeilen | Runde 2 FL1: „nach Zuschuss“ enthält den Zinsvorteil des Darlehens nicht, bei B und C der größere Teil der Förderung; kennzahlen-konzept 2.3 weist den Förderbarwert zur Einordnung aus |

---

## A. Blattliste

| Nr. | Blatt | Zweck | Aufbau | Navigation, Fixierung |
|---|---|---|---|---|
| 1 | Übersicht | Ergebnisse des aktiven Projekts in vier Ebenen; Prüfstatus | Kopf Zeile 1–6; Blöcke: 1 Finanzierung (Z. 8–26), 2 Jahresrechnung Jahr 1 (Z. 28–39), 3 Liquidität (Z. 41–52), 4 Tilgungssatz (Z. 54–72), 5 Objektrendite (Z. 74–85), 6 EK-Rendite (Z. 87–95), 7 Restwert (Z. 97–106), 8 Prüfungen (Z. 108–114, sichtbar). Spalten: A Nr., B Kennzahl, C Einheit/Satz, D–G A/B/C/Frei (bzw. Jahr 35), H–K A/B/C/Frei Jahr 42, L Bemerkung; in den Blöcken 1–4 und 8 (ohne Horizont) steht die Bemerkung in H. Zeilengliederung: Nebenwerte in Block 1, 3, 4 und Details in Block 5–7 eingeklappt | Zeile 6: Zellhyperlinks auf alle Blätter; fixiert ab A7 |
| 2 | Eingaben | Auswahl „Aktives Projekt“, alle änderbaren Werte beider Projekte | Z. 1 Titel, Z. 2 Legende, Z. 3 Projektwahl (1 oder 2), Z. 4 Projektnamen (Eingaben), Z. 5 Kopf, Z. 6–51 neun Blöcke mit Zeilengliederung. Spalten A Nr. · B Eingabe · C Einheit · D Projekt 1 · E Projekt 2 · F verwendet · G Quelle | fixiert D6; Zellhyperlink „Übersicht“ in G3 |
| 3–5 | Gefördert A, Gefördert B, Gefördert C | Zeitreihe und Ergebnisse je Einkommensgruppe | Z. 1–5 Kopf (Z. 2 Sprunglinks H2:M2, Z. 4 Gruppen, Z. 5 Spaltenköpfe), Z. 6–86 t = 0 … 80, Spalten A–X sichtbar, Y–AS „Zahlungsreihen für IRR“ und darunter die Nullstellensuche (Y–AB, Z. 131–142 und 172–177; gegliedert, zugeklappt), Zeilen 49–86 (t = 43 … 80) gegliedert, zugeklappt. Unterhalb: Finanzierung (Z. 88–114), Restwert (Z. 116–129), Renditen (Z. 131–151), Liquidität (Z. 153–170), Förderbarwert und Objektrendite (Z. 172–177) | fixiert C6; Zeile 2: Links Übersicht · Finanzierung · Restwert · Renditen · Liquidität · Förderbarwert |
| 6 | Frei finanziert | Vergleich zur Marktmiete, nur Objektebene | wie 3–5, Zeitreihe A–H, Zahlungsreihen O–S und Nullstellensuche O–R (Z. 131–138; gegliedert, zugeklappt); Blöcke in denselben Zeilen wie 3–5 (Z. 88–95, 116–129, 131–139); Leerzeilen 123, 124, 129, 133–135 ausgeblendet | fixiert C6; Zeile 2: Links Übersicht · Kosten · Restwert · Renditen |
| 7 | NBank | Ebene 4: EK-Rendite gegen Orientierungswert, neutral | Z. 1–3 Kopf (Z. 3 Projekt), Z. 4–7 Orientierungswert, Z. 8 Gruppenzeile (Rendite · Lage zum Orientierungswert), Z. 9–24 Matrix, Z. 26–31 Bezugsgrößen, Z. 33–36 Hinweise | fixiert A10; Zellhyperlink „Übersicht“ in I1 |
| 8 | Tabellen | RL-2026-Festwerte, Nutzungsdauer; abgesetzt: Liegenschaftszins Standort Neu Wulmstorf | vier Tabellen mit Titelzeile und Kopfzeile, Quelle je Zeile; Z. 42 Eichhinweis Tabelle 4 | fixiert A3; Zellhyperlink „Übersicht“ in G1 |
| 9 | Hinweise | höchstens 15 kurze Zeilen | A Nr., B Text; Kopf B2 „Hinweis (Version 3.0, Stand 11/2026)“ | fixiert A3; Zellhyperlink „Übersicht“ in C1 |

Blattreihenfolge wie Tabelle, aktives Blatt beim Öffnen: Übersicht. Registerfarben: Übersicht `8B2939`, Eingaben `FFF2CC`, übrige ohne.

Alle Links sind Zellhyperlinks mit Sprungziel (openpyxl `cell.hyperlink = Hyperlink(ref=…, location="'Blatt'!A1")`, Text als Konstante), keine `HYPERLINK`-Formeln.

---

## B. Eingaben

### B.1 Kopf des Blatts

| Zelle | Inhalt | Name | Format |
|---|---|---|---|
| A1 | „Eingaben“ (Titel, A1:G1 verbunden) | – | Titel |
| A2 | „Blaue Werte auf Gelb ändern, auch die Projektnamen in Zeile 4. Gerechnet wird nur die Spalte „verwendet“.“ | – | Text |
| B3 / C3 / D3 | „Aktives Projekt“ / „1 oder 2“ / Auswahlliste „1,2“ (Datenüberprüfung, Meldung „Zulässig: 1 (Spalte D) oder 2 (Spalte E).“), Standard 1 | D3 = `Projekt_Nr` | D3 Eingabe |
| G3 | „Übersicht“, Zellhyperlink → `'Übersicht'!A1` | – | Link |
| B4 / C4 / D4 / E4 | „Projektname“ / „Text“ / „Modellhaus Broschüre“ / „Tarutinoer Str. 4, Neu Wulmstorf“ (Eingaben, Umbruch, Zeilenhöhe 27) | D4:E4 = `Projektliste` | D4, E4 Eingabe |
| F4 | `=INDEX(Projektliste,Projekt_Nr)` | `Aktives_Projekt` | verwendet (grau) |
| A5:G5 | Kopf: Nr. · Eingabe · Einheit · Projekt 1 · Projekt 2 · verwendet · Quelle Projekt 1 / Projekt 2 | – | Kopfzeile |

Die Projektwahl hängt an der Position (1 = Spalte D, 2 = Spalte E), nicht am Namen: Ein umbenanntes Projekt (D4/E4) kann keinen Bezugsfehler mehr auslösen (Befund V1 Runde 1). F3 bleibt leer. Der Projektname auf den anderen Blättern ist `=Aktives_Projekt` (F4). Bedingte Formatierung: Kopf der nicht aktiven Projektspalte (D5 bzw. E5, Regel `Projekt_Nr<>1` bzw. `<>2`) grau `A6A6A6`, ihre Werte D7:D51 bzw. E7:E51 in grauer Schrift `8C8C8C`. Jede Eingabezeile r: Spalte F `=INDEX($D r:$E r,Projekt_Nr)`; der Name zeigt auf `Eingaben!$F$r`. Gruppenzeilen: Spalte A leer, Text in B (z. B. „1 Projekt“), Füllung über A–G. Gliederung: Eingabezeilen Ebene 1, Gruppenzeile darüber (`summaryBelow = False`), aufgeklappt. Kein Blattschutz (Abschnitt K, V12).

### B.2 Eingaben je Block

Gültigkeit = Datenüberprüfung. Die Fehlermeldung nennt den zulässigen Bereich („Zulässig: 0,00 % bis 10,00 %.“, „Zulässig: 0 bis 20.000 €/m² Wohnfläche.“, „Zulässig: 0 bis 2.000 € p. a.“, Jahreszahlen ohne Einheit „Zulässig: 2020 bis 2060.“, Listen: „Zulässig: ja oder nein.“; 3.2: „Zulässig: 0 bis 5 Jahre (RL 2026 Nr. 5.3.5).“ mit dem Wert aus T14; Runde 2 V8); Prozent-Eingaben haben den Eingabehinweis „Als Prozent eingeben, z. B. 2,5 %.“ (9.3: „In Prozentpunkten mit %-Zeichen eingeben, z. B. 0,5 %.“). Werte in Prozent als Bruch (2,5 % = 0,025). Spalte „Quelle (Excel)“ steht so in Spalte G (≤ 60 Zeichen, Sachquelle mit Stand, links Modellhaus, rechts Tarutinoer, ein Eintrag bei gleicher Quelle). „Vorgängermappe“ = PGN-VOFI-Modell v2-1; bei den Stressgrößen nennt die Quelle deren Best/Worst-Werte (E.4). „v2-1“ steht nicht in der Excel. Spalte „Fundstelle“ steht nicht in der Excel; sie steht nur hier und in der Zuordnung von `pruefe_vofi.py`.


**Block 1 Projekt (3), Gruppenzeile 6**

| Nr. | Zeile | Eingabe (Excel) | Name | Einheit | Modellhaus | Tarutinoer | Quelle (Excel) | Fundstelle | Gültigkeit |
|---|---|---|---|---|---|---|---|---|---|
| 1.1 | 7 | Bezugsjahr (ändert nur Jahresangaben) | `Bezugsjahr` | Jahr | 2027 | 2027 | PGN-Annahme, Planungsstand 2026 | RR `fj` / v2-1 Eingabe!C10 | ganze Zahl 2020–2060 |
| 1.2 | 8 | Wohnfläche | `Wohnflaeche` | m² | 1.400 | 828 | Broschüre S. 10 / Projektdaten PGN | Broschüre S. 10 / v2-1 Eingabe!C12 | Dezimal 1–100.000 |
| 1.3 | 9 | Wohnungen | `Wohneinheiten` | Anzahl | 20 | 14 | Broschüre S. 10 / Projektdaten PGN | Broschüre S. 10 / v2-1 Eingabe!C13 | ganze Zahl 1–1.000 |

**Block 2 Kosten und Grundstück (5), Gruppenzeile 10**

| Nr. | Zeile | Eingabe (Excel) | Name | Einheit | Modellhaus | Tarutinoer | Quelle (Excel) | Fundstelle | Gültigkeit |
|---|---|---|---|---|---|---|---|---|---|
| 2.1 | 11 | Herstellungskosten KG 200–700 | `Herstellungskosten_qm` | €/m² Wohnfläche | 4.500 | 3.579 | Broschüre S. 10 / Kostenansatz PGN | Broschüre S. 10 Z. 1 / v2-1 Szenarien!H6 (3.579 × 828 = 2.963.412 €) | Dezimal 0–20.000 |
| 2.2 | 12 | Finanzierungskosten KG 800 | `KG_800` | € | 0 | 0 | PGN-Annahme (Ansatz 0) | RR `kg800` / v2-1 Eingabe!C19 | Dezimal 0–100.000.000 |
| 2.3 | 13 | Grundstück, Verkehrswert (Sacheinlage) | `Grundstueck` | € | 700.000 | 0 | Broschüre S. 10 / Ansatz 0 € (Verkehrswert 731.325 €) | Broschüre S. 10 Z. 2 / v2-1 Eingabe!C15 (Kommentar: Verkehrswert 731.325 €) | Dezimal 0–1.000.000.000 |
| 2.4 | 14 | Bodenrichtwert (0 = kein Deckel) | `Bodenrichtwert` | €/m² | 0 | 260 | Broschüre S. 10: Deckel greift nicht / Projektdaten PGN | Broschüre: Deckel greift nicht / v2-1 Eingabe!C20 | Dezimal 0–10.000 |
| 2.5 | 15 | Grundstücksfläche (0 = kein Deckel) | `Grundstuecksflaeche` | m² | 0 | 1.362 | Broschüre S. 10: Deckel greift nicht / Projektdaten PGN | – / v2-1 Eingabe!C14 | Dezimal 0–1.000.000 |

**Block 3 Förderung NBank (4), Gruppenzeile 16**

| Nr. | Zeile | Eingabe (Excel) | Name | Einheit | Modellhaus | Tarutinoer | Quelle (Excel) | Fundstelle | Gültigkeit |
|---|---|---|---|---|---|---|---|---|---|
| 3.1 | 17 | Tilgung NBank-Darlehen, linear | `Tilgung_NBank` | % p. a. | 2,50 % | 2,50 % | PGN-Annahme (Broschüre S. 11); Vorgängermappe Worst 3,03 % | freigegebene Annahme; RR `laufzeit_nbank` 40 / v2-1 Basisdaten!C62 (1/40) | Dezimal 0–0,1 |
| 3.2 | 18 | Tilgungsaufschub | `Tilgungsaufschub` | Jahre | 0 | 0 | PGN-Annahme (Rahmen RL 2026 Nr. 5.3.5) | RR `tilgungsfrei` / v2-1 Eingabe!C26 | ganze Zahl 0–`=Aufschub_max` |
| 3.3 | 19 | Zins NBank-Darlehen ab Jahr 36 | `Zins_NBank_ab36` | % p. a. | 3,74 % | 3,74 % | PGN-Annahme (Rahmen RL 2026 Nr. 5.3.4) | RR `zins_ab36` / v2-1 Eingabe!C43 | Dezimal 0–0,1 |
| 3.4 | 20 | Swapsatz 30 Jahre | `Swapsatz_30J` | % | 3,39 % | 3,39 % | EUR-Swapsatz 30 Jahre, Stand 19.08.2026 | RR `swap` / v2-1 Ueberkompensation!C5 | Dezimal 0–0,1 |

**Block 4 Miete (6), Gruppenzeile 21**

| Nr. | Zeile | Eingabe (Excel) | Name | Einheit | Modellhaus | Tarutinoer | Quelle (Excel) | Fundstelle | Gültigkeit |
|---|---|---|---|---|---|---|---|---|---|
| 4.1 | 22 | Mietenstufe | `Mietenstufe` | Liste | IV | VI | Broschüre S. 10 / Projektdaten PGN | Broschüre S. 10 (IV–VII) / v2-1 Eingabe!C36 | Liste `=Mietenstufen` |
| 4.2 | 23 | Effizienzhaus 40 erreicht | `Effizienz_EH40` | ja/nein | nein | nein | Broschüre S. 11 (ohne EH-40-Zuschlag) / Planung PGN (EH 55) | Broschüre ohne Zuschlag / v2-1 Eingabe!C37 (EH 55) | Liste „ja,nein“ |
| 4.3 | 24 | Ortsübliche Vergleichsmiete, Jahr 1 | `Vergleichsmiete_1` | €/m² Monat | 12,92 | 12,92 | Platzhalter / PGN-Mietband Neu Wulmstorf, fortgeschrieben | RR `ovm_start` / v2-1 Basisdaten!C49 | Dezimal 0,00–50,00 |
| 4.4 | 25 | Marktmiete Neuvermietung, Jahr 1 | `Marktmiete_1` | €/m² Monat | 14,48 | 14,48 | Platzhalter / PGN-Mietband Neu Wulmstorf, fortgeschrieben | RR `markt_start` / v2-1 Basisdaten!C48 | Dezimal 0,00–50,00 |
| 4.5 | 26 | Steigerung Markt- und Vergleichsmiete | `Mietsteigerung` | % p. a. | 2,00 % | 2,00 % | PGN-Annahme, langfristiger Mittelwert | RR `miet_wachstum` / v2-1 Eingabe!C72 | Dezimal −0,05–0,1 |
| 4.6 | 27 | Kappungsgrenze nach Bindungsende | `Kappungsgrenze` | % in 3 Jahren | 20,00 % | 20,00 % | § 558 Abs. 3 BGB | RR `kapp_norm` (ab 2030 wirksam) / v2-1 Eingabe!C78 | Dezimal 0–0,2 |

**Block 5 Bewirtschaftung (5), Gruppenzeile 28**

| Nr. | Zeile | Eingabe (Excel) | Name | Einheit | Modellhaus | Tarutinoer | Quelle (Excel) | Fundstelle | Gültigkeit |
|---|---|---|---|---|---|---|---|---|---|
| 5.1 | 29 | Mietausfall/Leerstand | `Mietausfall` | % der Sollmiete | 2,00 % | 2,00 % | PGN-Annahme (Broschüre S. 11) | freigegebene Annahme / v2-1 Eingabe!C82 | Dezimal 0–0,2 |
| 5.2 | 30 | Objektverwaltung je Wohnung | `Verwaltung_WE` | € p. a. | 367 | 367 | PGN-Annahme (Broschüre S. 11); ImmoWertV fortgeschrieben | freigegebene Annahme / v2-1 Eingabe!C80 | Dezimal 0–2.000 |
| 5.3 | 31 | Instandhaltung je m² Wohnfläche | `Instandhaltung_qm` | € p. a. | 14,40 | 14,40 | PGN-Annahme (Broschüre S. 11); ImmoWertV fortgeschrieben | freigegebene Annahme / v2-1 Eingabe!C81 | Dezimal 0,00–100,00 |
| 5.4 | 32 | Kostensteigerung ab Jahr 2 | `Kostensteigerung` | % p. a. | 2,00 % | 2,00 % | PGN-Annahme; Vorgängermappe Best 1,5 %, Worst 2,5 % | RR `kosten_wachstum` / v2-1 Eingabe!C84 | Dezimal −0,05–0,1 |
| 5.5 | 33 | Kostensätze 2026 fortschreiben um | `Kosten_Vorlauf` | Jahre | 0 | 0 | Broschüre S. 11 (Kostenstand 2026) | RR `kosten_offset` = 0 / v2-1 wie 0 (B8) | ganze Zahl 0–10 |

**Block 6 Bankdarlehen und Vergleichszins (4), Gruppenzeile 34**

| Nr. | Zeile | Eingabe (Excel) | Name | Einheit | Modellhaus | Tarutinoer | Quelle (Excel) | Fundstelle | Gültigkeit |
|---|---|---|---|---|---|---|---|---|---|
| 6.1 | 35 | Zins Bank, zugleich Abzinsung Förderbarwert | `Zins_Bank` | % p. a. | 3,74 % | 3,74 % | PGN-Annahme (Marktmittel Bundesbank, bisheriger Ansatz) | RR `zins_bank` / v2-1 Eingabe!C51 | Dezimal 0–0,15 |
| 6.2 | 36 | Zinsbindung | `Zinsbindung` | Jahre | 10 | 10 | PGN-Annahme (bisheriger Ansatz) | RR `zinsbindung` / v2-1 Eingabe!C52 | ganze Zahl 1–42 |
| 6.3 | 37 | Anschlusszins | `Zins_Anschluss` | % p. a. | 3,74 % | 3,74 % | PGN-Annahme; Vorgängermappe Best 2,74 %, Worst 4,74 % | RR `zins_anschluss` / v2-1 Eingabe!C53 | Dezimal 0–0,15 |
| 6.4 | 38 | Laufzeit Bankdarlehen (Annuität) | `Laufzeit_Bank` | Jahre | 30 | 30 | PGN-Annahme (bisheriger Ansatz) | RR 30 Jahre fest / v2-1 Eingabe!C54 (1,8618466 % = Annuität 30 Jahre) | ganze Zahl 1–60 |

**Block 7 Eigenkapital und Projektkonto (VOFI) (3), Gruppenzeile 39**

| Nr. | Zeile | Eingabe (Excel) | Name | Einheit | Modellhaus | Tarutinoer | Quelle (Excel) | Fundstelle | Gültigkeit |
|---|---|---|---|---|---|---|---|---|---|
| 7.1 | 40 | Zusätzliches Eigenkapital bar, mindert Bank | `EK_Zusatz` | € | 0 | 0 | PGN-Annahme | neu (ersetzt Formel v2-1 Eingabe!C88) | Dezimal 0–1.000.000.000 |
| 7.2 | 41 | Guthabenzins Projektkonto (VOFI) | `Habenzins` | % p. a. | 2,00 % | 2,00 % | PGN-Annahme (bisheriger Ansatz) | RR `haben` / v2-1 Eingabe!C100 | Dezimal 0–0,1 |
| 7.3 | 42 | Sollzins Projektkonto (VOFI) | `Sollzins` | % p. a. | 5,00 % | 5,00 % | PGN-Annahme (bisheriger Ansatz) | RR `soll` / v2-1 Eingabe!C101 | Dezimal 0–0,2 |

**Block 8 Restwert (3), Gruppenzeile 43**

| Nr. | Zeile | Eingabe (Excel) | Name | Einheit | Modellhaus | Tarutinoer | Quelle (Excel) | Fundstelle | Gültigkeit |
|---|---|---|---|---|---|---|---|---|---|
| 8.1 | 44 | Bodenwertsteigerung | `Bodenwertsteigerung` | % p. a. | 1,50 % | 1,50 % | PGN-Annahme (bisheriger Ansatz) | RR `bodenwert_wachstum` / v2-1 Eingabe!C106 | Dezimal −0,05–0,1 |
| 8.2 | 45 | Zielmiete nach Bindungsende | `Zielmiete` | Liste | Marktmiete | Marktmiete | PGN-Annahme | RR `zielmiete="markt"` / neu (ersetzt v2-1 C104) | Liste „Marktmiete,Vergleichsmiete“ |
| 8.3 | 46 | Veräußerungskosten | `Veraeusserungskosten` | % des Restwerts | 0,00 % | 0,00 % | PGN-Annahme | RR `vk` = 0 / v2-1: keine | Dezimal 0–0,2 |

**Block 9 Stresstest (neutral: Faktor 1, Zuschlag 0) (4), Gruppenzeile 47**

| Nr. | Zeile | Eingabe (Excel) | Name | Einheit | Modellhaus | Tarutinoer | Quelle (Excel) | Fundstelle | Gültigkeit |
|---|---|---|---|---|---|---|---|---|---|
| 9.1 | 48 | Faktor Herstellungskosten | `Stress_KG` | Faktor | 1,00 | 1,00 | PGN-Annahme; Vorgängermappe Best 0,95, Worst 1,15 | v2-1 Szenarien!G6:I6 | Dezimal 0,50–2,00 |
| 9.2 | 49 | Faktor Markt- und Vergleichsmiete | `Stress_Miete` | Faktor | 1,00 | 1,00 | PGN-Annahme; Vorgängermappe Best 1,05, Worst 0,95 | v2-1 Szenarien!G7:I7 | Dezimal 0,50–2,00 |
| 9.3 | 50 | Zuschlag Liegenschaftszins (Standort) | `Stress_LZ` | Prozentpunkte | 0,00 % | 0,00 % | PGN-Annahme; Vorgängermappe Best −0,30, Worst +0,60 Pp | v2-1 Szenarien!G10:I10; RR `lz_delta` | Dezimal −0,02–0,02 |
| 9.4 | 51 | Faktor Gebäude-Restwert | `Stress_GebRW` | Faktor | 1,00 | 1,00 | PGN-Annahme | RR `rw_faktor` | Dezimal 0,00–1,50 |

Modellhaus 4.3/4.4 sind gerundete Platzhalter (Abweichung A7, Wirkung höchstens 318 € im Restwert und 0,0002 Pp in den Renditen); Tarutinoer behält die Werte der Vorgängermappe mit voller Stellenzahl (Rundung abgelehnt, Abschnitt K: sie bräche den 0,01-€-Abgleich F10).

Beide Projekte haben im Standard kein Bankdarlehen. Block 6 wirkt dann nur über 6.1 als Vergleichszins des Barwertvorteils (NBank N19/N20). Das Bankdarlehen entsteht, wenn Förderung und Mindest-Eigenmittel die Herstellungskosten nicht decken (Kosten über der Bemessungsgrenze, Grundstück über dem Deckel; Läufe L4–L8, L10, L39, L40). Die Anfangstilgung folgt aus 6.1 und 6.4 (Gefördert H113); RL Nr. 5.3.6 verlangt mindestens 1 % (Prüfung P3).

**Summe: 37 Eingaben** (Block 1–9: 3 · 5 · 4 · 6 · 5 · 4 · 3 · 3 · 4) plus Projektwahl D3 und Projektnamen D4:E4. Best/Worst-Werte der Vorgängermappe: Abschnitt E.4, Quellenspalte und `AENDERUNGEN.md` Abschnitt 7.

### B.3 Formate in Spalte D–F je Einheit

Eingabezellen ohne Nullabschnitt: Eine eingegebene 0 bleibt als 0 sichtbar (Runde 2 V9; „–“ nur in Ergebniszellen).

| Einheit | Zahlenformat |
|---|---|
| €, €/m² (Kosten, Bodenrichtwert) | `#,##0` |
| €/m² Monat, € p. a. je m² | `#,##0.00` |
| % (Sätze) | `0.00 %` |
| Prozentpunkte (9.3) | `+0.00 %;-0.00 %;0.00 %` |
| Faktor | `0.00` |
| Jahr, Jahre, Anzahl, m² | `0` bzw. `#,##0` |
| Text, Liste | `@` |

---

## C. Tabellen-Blatt

Alle Werte schwarz (Festwert, keine Eingabe), Schrift `3C3C3B`, keine gelbe Füllung. Zeile 1 Titel „Tabellen“ (A1:F1 verbunden), G1 Zellhyperlink „Übersicht“; Zeile 2: „Festwerte RL Mietwohnraum 2026 und Bewertung. Bemessungsgrenzen ab 01.10.2026 halbjährlich fortgeschrieben (nbank.de).“ (RL Nr. 5.3.2.2 Abs. 2: Fortschreibung zum 1.4. und 1.10.; die Tabelle zeigt den Ausgangswert 01.07.2026). Je Tabelle eine Titelzeile (Gruppenzeile) und eine Kopfzeile. Spalte G „Quelle“ ≤ 60 Zeichen, nur Sachquelle, je Zeile ausgeschrieben (kein „dto.“). Spalte „Beleg“ (Fakt-IDs) steht nur hier im Konzept.

**Tabelle 1, Titel Zeile 3 „1 Förderquoten“, Kopf Zeile 4 (Nr. · Festwert · Einheit · A · B · C · Quelle; D4:F4 = `Gruppen` mit „A“, „B“, „C“), Zeilen 5–6**

| Nr. | Zeile | Festwert | Einheit | A | B | C | Quelle (Excel) | Beleg | Name |
|---|---|---|---|---:|---:|---:|---|---|---|
| T1 | 5 | Darlehen, höchstens | % der zuw. Kosten | 40 % | 60 % | 70 % | RL 2026 Nr. 5.3.3.1 | F105 | `Quote_Darlehen` = D5:F5 |
| T2 | 6 | Zuschuss, höchstens | % der zuw. Kosten | 40 % | 20 % | 10 % | RL 2026 Nr. 5.3.3.2 | F105, F109 | `Quote_Zuschuss` = D6:F6 |

**Tabelle 2, Titel Zeile 7 „2 Mietenstufen“, Kopf Zeile 8 (Nr. · Mietenstufe · Bemessungsgrenze €/m² · Höchstmiete A · B · C · Quelle), Zeilen 9–15**

| Nr. | Zeile | B Mietenstufe | C Bemessungsgrenze | D A | E B | F C | G Quelle (Excel) | Beleg |
|---|---|---|---:|---:|---:|---:|---|---|
| T3 | 9 | I | 4.800 | 6,50 | 7,90 | 8,70 | RL 2026 Nr. 5.3.2.2 (Ausgangswert 01.07.2026), 5.4.4 | F098, F215 |
| T4 | 10 | II | 4.800 | 6,50 | 7,90 | 8,70 | RL 2026 Nr. 5.3.2.2 (Ausgangswert 01.07.2026), 5.4.4 | F098, F215 |
| T5 | 11 | III | 4.800 | 6,50 | 7,90 | 8,70 | RL 2026 Nr. 5.3.2.2 (Ausgangswert 01.07.2026), 5.4.4 | F098, F215 |
| T6 | 12 | IV | 5.000 | 6,80 | 8,20 | 9,00 | RL 2026 Nr. 5.3.2.2 (Ausgangswert 01.07.2026), 5.4.4 | F098, F215 |
| T7 | 13 | V | 5.000 | 6,80 | 8,20 | 9,00 | RL 2026 Nr. 5.3.2.2 (Ausgangswert 01.07.2026), 5.4.4 | F098, F215 |
| T8 | 14 | VI | 5.000 | 6,80 | 8,20 | 9,00 | RL 2026 Nr. 5.3.2.2 (Ausgangswert 01.07.2026), 5.4.4 | F098, F215 |
| T9 | 15 | VII | 5.000 | 6,80 | 8,20 | 9,00 | RL 2026 Nr. 5.3.2.2 (Ausgangswert 01.07.2026), 5.4.4 | F098, F215, G1-04 (Ausgangswert 01.07.2026) |

Namen: `Mietenstufen` = B9:B15, `Bemessungsgrenzen` = C9:C15, `Hoechstmieten` = D9:F15.

**Tabelle 3, Titel Zeile 16 „3 Festwerte RL 2026 und ImmoWertV“, Kopf Zeile 17 (Nr. · Festwert · Einheit · Wert · – · – · Quelle), Zeilen 18–33**

| Nr. | Zeile | Festwert | Einheit | Wert (D) | Quelle (Excel) | Beleg | Name |
|---|---|---|---|---:|---|---|---|
| T10 | 18 | Eigenmittel, mindestens | % der zuw. Kosten | 20 % | RL 2026 Nr. 5.2.6 | F094, F095 | `Eigenmittelquote` |
| T11 | 19 | Zins NBank bis Ende Jahr 35 | % p. a. | 0 % | RL 2026 Nr. 5.3.4 | F113 | `Zins_NBank_1_35` |
| T12 | 20 | Zinsfreie Jahre | Jahre | 35 | RL 2026 Nr. 5.3.4 | F113 | `Zinsfreie_Jahre` |
| T13 | 21 | Höchstlaufzeit, Betrachtungsende | Jahre | 42 | RL 2026 Nr. 5.3.5 | F116 | `Laufzeit_max` |
| T14 | 22 | Tilgungsaufschub, höchstens | Jahre | 5 | RL 2026 Nr. 5.3.5 | F117 | `Aufschub_max` |
| T15 | 23 | Verwaltungskostenbeitrag | % p. a. vom Restkapital | 0,50 % | RL 2026 Nr. 12.7.1 | F277 | `VKB_Satz` |
| T16 | 24 | Bearbeitungsentgelt Darlehen | % einmalig | 1,00 % | RL 2026 Nr. 12.7.2 | F278 | `BE_Darlehen` |
| T17 | 25 | Bearbeitungsentgelt Zuschuss | % einmalig | 0,75 % | RL 2026 Nr. 12.7.3 | F279 | `BE_Zuschuss` |
| T18 | 26 | Belegungs- und Mietbindung | Jahre | 35 | RL 2026 Nr. 5.4.1, 5.4.2 | F212 | `Bindung` |
| T19 | 27 | Jahre ohne Mieterhöhung | Jahre | 3 | RL 2026 Nr. 5.4.4, 5.4.5 | F221 | `Mietruhe_Jahre` |
| T20 | 28 | Mieterhöhung in der Bindung, höchstens | % in 3 Jahren | 6,15 % | RL 2026 Nr. 5.4.5 | F221 | `Mietanpassung_Bindung` |
| T21 | 29 | Abstand der Mieterhöhungen | Jahre | 3 | PGN-Konvention (Rahmen RL 2026 Nr. 5.4.5) | F221 | `Erhoehung_Rhythmus` |
| T22 | 30 | Zuschlag Höchstmiete ab EH 40 | €/m² Monat | 0,30 | RL 2026 Nr. 5.4.4 Satz 2 | F217 | `Zuschlag_EH40` |
| T23 | 31 | Tilgung Bankdarlehen, mindestens | % p. a. | 1,00 % | RL 2026 Nr. 5.3.6 | F118 | `Tilgung_Bank_min` |
| T24 | 32 | Aufschlag auf Swapsatz | Prozentpunkte | +1,00 % (Format wie 9.3) | RL 2026 Nr. 11.10 Abs. 4 | F246 | `Aufschlag_Swap` |
| T25 | 33 | Gesamtnutzungsdauer Mehrfamilienhaus | Jahre | 80 | ImmoWertV Anlage 1 | v2-1 Eingabe!C105 | `GND` |

**Tabelle 4, Titel Zeile 34 „4 Bewertung, Standort Neu Wulmstorf“, Kopf Zeile 35 (Nr. · Restnutzungsdauer · Einheit · Liegenschaftszins · – · – · Quelle), Zeilen 36–41**

Die Kurve gilt für den Standort Neu Wulmstorf und ist auf einen mittleren Bodenrichtwert von 600 €/m² geeicht. Für das Modellhaus ist sie ein Platzhalter wie Markt- und Vergleichsmiete (O2); für andere Standorte wirkt Zuschlag 9.3.

| Nr. | Zeile | B Restnutzungsdauer | C | D Liegenschaftszins | G Quelle (Excel) | Beleg |
|---|---|---:|---|---:|---|---|
| T26 | 36 | 30 | Jahre | 2,50 % | OGA Nds., Landesmodell MFH, 01.01.2026, BRW 600 €/m² | v2-1 Eingabe!B124:C130 |
| T27 | 37 | 38 | Jahre | 2,70 % | OGA Nds., Landesmodell MFH, 01.01.2026, BRW 600 €/m² | dto. |
| T28 | 38 | 40 | Jahre | 2,70 % | OGA Nds., Landesmodell MFH, 01.01.2026, BRW 600 €/m² | dto. |
| T29 | 39 | 50 | Jahre | 2,90 % | OGA Nds., Landesmodell MFH, 01.01.2026, BRW 600 €/m² | dto. |
| T30 | 40 | 60 | Jahre | 3,00 % | OGA Nds., Landesmodell MFH, 01.01.2026, BRW 600 €/m² | dto. |
| T31 | 41 | 70 | Jahre | 3,10 % | OGA Nds., Landesmodell MFH, 01.01.2026, BRW 600 €/m² | dto. |

Namen: `LZ_RND` = B36:B41, `LZ_Satz` = D36:D41. Restnutzungsdauer (B) und Liegenschaftszins (D, Kopf „Liegen-↵schaftszins“) rechtsbündig. Tabelle 4 erhält über der Titelzeile einen mittleren Rahmen `3C3C3B`, damit sie sich von den RL-Festwerten absetzt. A42 (Text): „Kurve geeicht auf Bodenrichtwert 600 €/m²; Tarutinoer 260 €/m², Modellhaus Platzhalter; Anpassung über Eingabe 9.3.“ Druckbereich A1:G42.

T14 `Aufschub_max` ist die Obergrenze der Datenüberprüfung von Eingabe 3.2 (formula2 `=Aufschub_max`). T21 ist eine PGN-Konvention im Rahmen der RL (die RL begrenzt nur auf 6,15 % in 3 Jahren; § 558 BGB erlaubt Erhöhungen schon nach 15 Monaten); sie steht in Hinweis 6.

Bewusst nicht in Tabellen: Zuschlag modellhaft/Housing First (RL Nr. 5.3.3.3), Altrecht WFB, Ersterwerb. Grund in Abschnitt E.

---

## D. Rechenlogik

### D.1 Konventionen (gleich RR, Lauf `SAUBER`, Broschürenprojekt)

| Punkt | Regel |
|---|---|
| Zeit | jährlich nachschüssig; t = 0 Bezugsfertigkeit; Bewirtschaftung t = 1 … 42 |
| Steuern | keine (vor Steuern), nominal |
| Vorzeichen | Zeitreihen: Einzahlungen positiv, Auszahlungen negativ; Summen sind `SUM`. Übersicht Block 2: Beträge positiv, Rechenzeichen in der Bezeichnung (wie Broschüre S. 11) |
| Miete | t = 1–3 Höchstmiete (+0,30 € bei EH 40), höchstens Marktmiete Jahr 1 (A11); Erhöhung in t = 4, 7, 10 …; bis t = 35 um 6,15 %, danach um die Kappungsgrenze; jeweils höchstens bis zur Obergrenze, nie Senkung; je m² ungerundet (A10) |
| Obergrenze Miete | t ≤ 42 Vergleichsmiete; t > 42 Zielmiete (Eingabe 8.2) |
| Kosten | Verwaltung je WE und Instandhaltung je m², Faktor (1 + Kostensteigerung)^(t − 1 + Eingabe 5.5) |
| Herstellungskosten | Eingabe 2.1 × Wohnfläche × Faktor 9.1 |
| NBank | VKB 0,5 % und Zins auf die Restschuld des Vorjahres; Tilgung = Satz × Ursprungsdarlehen, ab Jahr Aufschub + 1; Rest in Jahr 42 |
| Bank | Darlehen = Lücke der Herstellungskosten nach Förderung, Mindest-Eigenmitteln in Geld und Zusatz-EK 7.1; Annuität = `PMT(Zins, Laufzeit 6.4, Darlehen)`; nach Zinsbindung Anschlusszins, Rate = Annuität auf Restschuld und Restlaufzeit (6.4 − 6.2) |
| Projektkonto (VOFI) | Konto_t = Konto_t−1 × (1 + Haben bzw. Soll) + ZÜ_t; Haben bei Konto_t−1 ≥ 0 |
| Restwert | Ertragswert im Stichjahr H über RND = 80 − H; Reinertrag mit (1 + Mietsteigerung)^(t − H − 1) deflationiert, mit LZ(RND) abgezinst; plus Bodenwert über RND abgezinst |
| Varianten | mit Restwert = (Boden + Faktor 9.4 × Gebäude) × (1 − VK); nur Bodenwert = Boden × (1 − VK); ohne Restwert = 0 (in der Excel ausgeschrieben, Abkürzungen RW/Geb.-RW nur in diesem Konzept) |
| Objektreihe | t = 0 −Objektinvestition (Grundstück + KG 200–700) bzw. −(Objektinvestition − Zuschuss × (1 − 0,75 %)) bzw. −(Objektinvestition − Förderbarwert); t = 1 … H Überschuss vor Kapitaldienst; t = H + Restwert |
| Förderbarwert | Zuschuss × (1 − 0,75 %) + Barwertvorteil Darlehen (Darlehen × (1 − 1 %) − Barwert von VKB, Zins und Tilgung zum Zins 6.1); RR `foerderbarwert(zins_bank)["gesamt"]` |
| EK-Reihe | t = 0 −Eigenkapital + Kasse; t = 1 … H ZÜ; t = H + Restwert − Restschuld NBank − Restschuld Bank |
| VOFI-EK-Rendite | (Endvermögen ÷ Eigenkapital)^(1/H) − 1, Endvermögen = Konto_H + Restwert − Restschuld_H; „n. v.“ bei Endvermögen ≤ 0 (dann auch Restwertanteil „n. v.“) |
| IRR | größte Nullstelle mit fallendem Barwert (E10): erster Treffer der Kaskade 3 % (Objekt) bzw. VOFI-EK-Rendite derselben Variante (EK, sonst 0), −10, −30, −50, −60, −70 % (Ergebnis ≤ −100 % = Fehlversuch); zweiter Versuch ab Treffer + 5 Pp; die größere Nullstelle gilt, wenn der Barwert dort fällt; sonst oder ohne Treffer „n. v.“ |
| Sperre | Kasse bei Bezug ≥ 1 € (Überfinanzierung): alle Renditen auf Gefördert A/B/C „n. v.“ |
| Horizonte | H = 35 (`Bindung`) und H = 42 (`Laufzeit_max`) |

### D.2 Bewusste Abweichungen vom Code der RR

| Nr. | Abweichung | Grund | Zahlenwirkung |
|---|---|---|---|
| A1 | KG 800 nicht in der Objektinvestition (RR: enthalten) | Kennzahlenkonzept 2.1/2.3: Finanzierungskosten gehören in die EK-Reihe | Standard 0 (KG 800 = 0). Modellhaus mit KG 800 = 100.000 € (L12): Objekt-IRR n. Z. mit RW J42 A 4,16 % (RR 4,07 %), brutto 2,48 % (RR 2,43 %); EK-Ebene gleich RR |
| A2 | Restwert J35: Mietpfad Jahr 36–42 mit Obergrenze Vergleichsmiete (RR: Zielmiete) | ein Mietpfad je Gruppe für Zahlungen und Restwert | 0, solange die Obergrenze bis Jahr 42 nicht greift (Standard: A 18,88 < 29,09 €/m² in Jahr 42). Greift bei Mietsteigerung 1,5 % (C, Jahr 40); Testwerte F7 so gewählt, dass A2 nicht greift |
| A3 | Lücke der Herstellungskosten über Förderung und Mindest-Eigenmitteln finanziert die Bank (RR: bares EK) | Broschüre S. 10 „Restfinanzierung“ | Standard beider Projekte 0. Tarutinoer mit Verkehrswert 731.325 €: Tabelle D.2a; die Liquiditätsaussage kippt (O1). RR-Lesart erreichbar mit 7.1 = Lücke (L5) |
| A4 | IRR per Excel-IRR (Kaskade, zweiter Versuch, Barwert-Test, E10) statt Raster + Bisektion | Excel-Funktion | 0, solange die Nullstelle über −69 % liegt: gleiche Nullstelle wie die RR, auch bei mehreren (Runde 2: alle F.2a-Läufe und 28.650 nachgerechnete Reihen). Unter −69 % „n. v.“ (K.2 R1). Vor Runde 2 zeigte die Mappe bei mehreren Nullstellen teils die untere: L10 A EK-IRR ohne Restwert J35 −14,45 statt −6,42 %, L41 Frei ohne Restwert J35 −22,71 statt −8,44 %, 3.1 = 0 % C EK-IRR nur Bodenwert J35 0,58 statt 4,75 % |
| A5 | Stresstest 9.1, 9.2, Zusatz-EK 7.1 und Banklaufzeit 6.4 zusätzlich; 9.3/9.4 = RR `lz_delta`/`rw_faktor` | Vorgabe | 0 (neutral) |
| A6 | DSCR nur bei Kapitaldienst > 1 € (RR: > 10⁻⁹) | Rundungsrest (G8) | 0 |
| A7 | Modellhaus 4.3/4.4 gerundet 12,92 / 14,48 €/m² (RR: 12,9177 / 14,4804) | keine versteckte Stellenzahl in Eingaben (G11) | Restwert −125 bis −318 € je Variante; Renditen höchstens 0,0002 Pp; PRUEFBERICHT 4.2 (2 Stellen) unverändert. `pruefe_vofi.py` setzt `P['ovm_start'] = 12,92`, `P['markt_start'] = 14,48` |
| A8 | Tilgung bei Aufschub: Satz 3.1 × Ursprungsdarlehen, Rest in Jahr 42 (RR ohne `tilgungssatz`: Darlehen ÷ (40 − Aufschub)) | ein Satz, wie die Broschüre ihn nennt | Standard 0. Aufschub 2 (L16): RR-Standard 2,63 % statt 2,50 %, ZÜ ab Jahr 3 A −3.684 €; Prüfung gegen RR mit `tilgungssatz=0,025` |
| A9 | Banklaufzeit als Eingabe 6.4 (RR: 30 Jahre fest) | G11 | 0 bei 30 Jahren; andere Laufzeiten prüft F7 L7/L8 geschlossen |
| A10 | Gebundene Miete je m² ungerundet (Broschüre S. 7 zeigt „höchstens 7,21 / 7,65 €“, auf Cent abgerundet) | Die Obergrenze gilt für die Miete der Wohnung in Euro; die Mappe rechnet Durchschnitte je m². Wie RR und Vorgängermappe (Runde 2 KO10) | gegen Abrundung je m² (RR, Modellhaus): ZÜ A Jahr 4 +135 €, Jahr 35 +1.166 € (B +71 / +1.483 €, C +58 / +1.029 €); Objekt-IRR nach Zuschuss J42 ≤ +0,01 Pp, EK-IRR mit Restwert J42 ≤ +0,02 Pp, VOFI ≤ +0,01 Pp |
| A11 | Anfangsmiete gefördert höchstens Marktmiete Jahr 1 (`H109 = MIN(Höchstmiete + Zuschlag; D7)`; RR und v2-1 ohne Deckel) | Eine Miete über dem Markt ist nicht erzielbar (Runde 3 R) | 0 in beiden Projekten (6,80–9,00 < 14,48 €/m²); greift nur bei niedriger Marktmiete (Mietenstufe I–III mit eigenen Mieten, Stresstest 9.2). `pruefe_vofi.py` deckelt `startmiete` ebenso |
| A12 | Frei finanziert: Miete = Marktmiete mit Mietsteigerung in allen Jahren (laufende Neuvermietung), keine Bestandsmietenlogik nach § 558 BGB | Übliche Vereinfachung, wie RR und v2-1; zugunsten von frei, also gegen die Förderung (Runde 3 FL) | Modellhaus Frei-IRR mit Restwert J42 4,66 %; mit Bestandsmiete bis zur Vergleichsmiete rund 4,2–4,3 % (J35 4,63 → 4,15–4,23 %), ohne Restwert J42 3,07 → 2,38 %. In Hinweis 6 genannt |

**D.2a Wirkung A3: Tarutinoer mit Grundstück 731.325 € (2.3), Bodenrichtwert 260 €, Fläche 1.362 m² (Lauf L4)**

Zuwendungsfähig 3.317.532 € (Grundstück gedeckelt auf 354.120 €), Förderung 2.654.025,60 €, 20 % = 663.506 € < 731.325 € → Mindest-Eigenmittel in Geld 0, Lücke 309.386,40 €.

| Größe | RR (bares EK) A / B / C | v3 (Bank) A / B / C |
|---|---|---|
| Bankdarlehen | 0 | 309.386 / 309.386 / 309.386 € |
| Bares EK | 332.609 / 334.268 / 335.097 € | 23.223 / 24.881 / 25.711 € (= Entgelte) |
| Eigenkapital | 1.063.934 / 1.065.593 / 1.066.422 € | 754.548 / 756.206 / 757.036 € |
| Eigenmittelquote | 31,4 % | 22,0 % |
| ZÜ Jahr 1 | +9.342 / +3.069 / +906 € | −7.989 / −14.262 / −16.425 € |
| DSCR Jahr 1 | 1,23 / 1,05 / 1,01 | 0,86 / 0,81 / 0,81 |
| Jahre mit Fehlbetrag (1–35) / größter kum. Fehlbetrag | 0 / 0 € | 9 / 10 / 11 Jahre; −41.408 / −87.179 / −100.984 € |
| VOFI-EK mit RW J42 | 5,17 / 5,31 / 5,38 % | 5,76 / 5,88 / 5,96 % |
| VOFI-EK ohne Geb.-RW J42 | 3,04 / 3,12 / 3,21 % | 3,18 / 3,22 / 3,34 % |
| EK-IRR mit RW J42 | 5,70 / 5,77 / 5,84 % | 5,91 / 5,97 / 6,05 % |
| EK-IRR ohne Geb.-RW J42 | 3,39 / 3,44 / 3,56 % | 3,34 / 3,40 / 3,53 % |
| Objekt-IRR n. Z. mit RW J42 | 4,34 / 4,04 / 3,95 % | gleich |

Folgen: Mit Bank sinkt die Liquidität in allen Gruppen unter null, die EK-Renditen mit RW steigen (Hebel) und liegen weiter über dem Orientierungswert 4,39 %.

### D.3 Blatt Gefördert A/B/C

**Kopf**

| Zelle | Inhalt |
|---|---|
| A1 | Titel „Gefördert A: Zeitreihe und Ergebnisse“ (A1:J1 verbunden = Breite der ersten Druckseite; B/C analog) |
| A2 / B2 | „Gruppe“ / „A“ (Konstante, fett; einzige Zelle, die sich zwischen den drei Blättern unterscheidet, außer A1) |
| D2 | `=Aktives_Projekt` (grün) |
| H2:M2 | Zellhyperlinks: „Übersicht“ → `'Übersicht'!A1` · „Finanzierung“ → A88 · „Restwert“ → A116 · „Renditen“ → A131 · „Liquidität“ → A153 · „Förderbarwert“ → A172 (eigenes Blatt); rechts neben dem Projektnamen, auf dem ersten Bildschirm sichtbar (Runde 2 V12) |
| A3 | „€ p. a.; Mieten in €/m² Monat; Auszahlungen negativ; ab Jahr 43 nur Werte für den Restwert.“ |
| Zeile 4 | Gruppen: A4 „Zeit“ · C4 „Miete“ · G4 „Ertrag und Bewirtschaftung“ · L4 „Kapitaldienst“ · R4 „Ergebnis“ · T4 „Bestände Jahresende“ · X4 „Restwert“ · Y4 „Zahlungsreihen für IRR“ |
| Zeile 5 | Spaltenköpfe (Tabelle unten), Zeilenhöhe 56, Umbruch; Köpfe der Zahlungsreihen Y–AS zentriert |

**Zeitreihe** (r = Zeile, p = r − 1; Zeile 6 = t 0; Spalten A–K und X bis Zeile 86 = t 80; L–W bis Zeile 48 = t 42; Y–AS Zeilen 6–48)

| Sp. | Kopf (Zeile 5) | Zeile 6 (t = 0) | Zeilen 7 … (einheitlich) |
|---|---|---|---|
| A | t | `0` | `=A{p}+1` |
| B | Jahr | `=Bezugsjahr+A6` | `=Bezugsjahr+A{r}` |
| C | Vergleichsmiete | leer | `=Vergleichsmiete_1*Stress_Miete*(1+Mietsteigerung)^(A{r}-1)` |
| D | Marktmiete | leer | `=Marktmiete_1*Stress_Miete*(1+Mietsteigerung)^(A{r}-1)` |
| E | Zielmiete | leer | `=IF(Zielmiete="Marktmiete",D{r},C{r})` |
| F | Miete (gebunden, ab Jahr 36 Bestand) | leer | `=IF(A{r}=1,$H$109,IF(AND(A{r}>Mietruhe_Jahre,MOD(A{r}-1-Mietruhe_Jahre,Erhoehung_Rhythmus)=0),MAX(F{p},MIN(F{p}*(1+IF(A{r}<=Bindung,Mietanpassung_Bindung,Kappungsgrenze)),IF(A{r}<=Laufzeit_max,C{r},E{r}))),F{p}))` |
| G | Sollmiete | leer | `=F{r}*Wohnflaeche*12` |
| H | Mietausfall/Leerstand | leer | `=-Mietausfall*G{r}` |
| I | Objektverwaltung | leer | `=-Verwaltung_WE*Wohneinheiten*(1+Kostensteigerung)^(A{r}-1+Kosten_Vorlauf)` |
| J | Instandhaltung | leer | `=-Instandhaltung_qm*Wohnflaeche*(1+Kostensteigerung)^(A{r}-1+Kosten_Vorlauf)` |
| K | Überschuss vor Kapitaldienst | leer | `=SUM(G{r}:J{r})` |
| L | Verwaltungskostenbeitrag | leer | `=-VKB_Satz*T{p}` |
| M | Zins NBank | leer | `=-T{p}*IF(A{r}<=Zinsfreie_Jahre,Zins_NBank_1_35,Zins_NBank_ab36)` |
| N | Tilgung NBank | leer | `=-IF(A{r}=Laufzeit_max,T{p},IF(A{r}<=Tilgungsaufschub,0,MIN($H$110,T{p})))` |
| O | Zins Bank | leer | `=-U{p}*IF(A{r}<=Zinsbindung,Zins_Bank,Zins_Anschluss)` |
| P | Tilgung Bank | leer | `=-MAX(0,MIN(IF(A{r}<=Zinsbindung,$H$111,$H$114)+O{r},U{p}))` |
| Q | Kapitaldienst | leer | `=SUM(L{r}:P{r})` |
| R | Zahlungsüberschuss | leer | `=K{r}+Q{r}` |
| S | DSCR | leer | `=IF(-Q{r}>1,K{r}/-Q{r},"")` |
| T | Restschuld NBank | `=$H$99` | `=MAX(0,ROUND(T{p}+N{r},2))` (auf Cent, keine Rechenreste, Runde 2 V1) |
| U | Restschuld Bank | `=$H$103` | `=MAX(0,ROUND(U{p}+P{r},2))` |
| V | Projektkonto (VOFI) | `=$H$105` | `=V{p}*(1+IF(V{p}>=0,Habenzins,Sollzins))+R{r}` |
| W | Zahlungsüberschuss kumuliert | `0` | `=W{p}+R{r}` |
| X | Überschuss zur Zielmiete (Restwert) | leer | `=E{r}*Wohnflaeche*12*(1-Mietausfall)+I{r}+J{r}` |

Zahlungsreihen für IRR (Zeilen 6–48, eine Formel je Spalte, auch für t = 0; `$I$118` = 35, `$J$118` = 42):

| Sp. | Kopf | Formel (Zeile r) |
|---|---|---|
| Y | Objekt ohne Zuschuss, ohne Restwert | `=IF($A{r}=0,-$H$94,$K{r})` |
| Z | Objekt ohne Zuschuss, mit Restwert, Jahr 35 | `=IF($A{r}>$I$118,"",$Y{r}+IF($A{r}=$I$118,$I$126,0))` |
| AA | Objekt ohne Zuschuss, nur Bodenwert, Jahr 35 | wie Z mit `$I$127` |
| AB | Objekt ohne Zuschuss, mit Restwert, Jahr 42 | `=IF($A{r}>$J$118,"",$Y{r}+IF($A{r}=$J$118,$J$126,0))` |
| AC | Objekt ohne Zuschuss, nur Bodenwert, Jahr 42 | wie AB mit `$J$127` |
| AD | Objekt nach Zuschuss, ohne Restwert | `=IF($A{r}=0,-($H$94-$H$108),$K{r})` |
| AE–AH | Objekt nach Zuschuss, mit Restwert / nur Bodenwert, Jahr 35 / Jahr 42 | wie Z–AC mit Basis `$AD{r}` |
| AI | Eigenkapital, ohne Restwert, Jahr 42 | `=IF($A{r}=0,-$H$106+$H$105,$R{r}-IF($A{r}=$J$118,$T{r}+$U{r},0))` |
| AJ | Eigenkapital, ohne Restwert, Jahr 35 | `=IF($A{r}>$I$118,"",IF($A{r}=0,$AI{r},$R{r}-IF($A{r}=$I$118,$T{r}+$U{r},0)))` |
| AK | Eigenkapital, mit Restwert, Jahr 35 | `=IF($A{r}>$I$118,"",$AJ{r}+IF($A{r}=$I$118,$I$126,0))` |
| AL | Eigenkapital, nur Bodenwert, Jahr 35 | wie AK mit `$I$127` |
| AM | Eigenkapital, mit Restwert, Jahr 42 | `=$AI{r}+IF($A{r}=$J$118,$J$126,0)` |
| AN | Eigenkapital, nur Bodenwert, Jahr 42 | wie AM mit `$J$127` |
| AO | Objekt, Förderbarwert, ohne Restwert | `=IF($A{r}=0,-($H$94-$H$174),$K{r})` |
| AP–AS | Objekt, Förderbarwert, mit Restwert / nur Bodenwert, Jahr 35 / Jahr 42 | wie Z–AC mit Basis `$AO{r}` |

Spalten Y–AS: Gliederung Ebene 1, zugeklappt (Schalter über AT). In denselben Spalten stehen unterhalb der Zeitreihe die Hilfswerte der Nullstellensuche (E10): Gruppenzeile Y131/Y172 „Nullstellensuche IRR“, Kopf Y132:AB132 und Y173:AB173 „Jahr 35: erster Treffer · Jahr 35: zweiter Versuch · Jahr 42: erster Treffer · Jahr 42: zweiter Versuch“, Werte in den Zeilen der IRR-Kennzahlen (133–138, 140–142, 175–177). Zeilen 49–86 (t = 43 … 80, nur Restwert-Hilfswerte): Gliederung Ebene 1, zugeklappt, Schalter an Zeile 48 (`summaryBelow = False`). Druck siehe G.4.

**Block Finanzierung bei Bezug** (Beschriftung in Spalte A, läuft über B–F; Einheit G; Wert H)

| Zeile | Größe | Einheit | Formel H |
|---|---|---|---|
| 88 | Gruppenzeile „Finanzierung bei Bezug“ | | |
| 89 | Kopf: Größe · Einheit · Wert | | |
| 90 | Herstellungskosten KG 200–700, angesetzt | € | `=Herstellungskosten_qm*Wohnflaeche*Stress_KG` |
| 91 | Finanzierungskosten KG 800 | € | `=KG_800` |
| 92 | Grundstück (Sacheinlage) | € | `=Grundstueck` |
| 93 | Gesamtkosten | € | `=H90+H91+H92` |
| 94 | Objektinvestition (ohne KG 800) | € | `=H90+H92` |
| 95 | Bemessungsgrenze | €/m² | `=INDEX(Bemessungsgrenzen,MATCH(Mietenstufe,Mietenstufen,0))` |
| 96 | Zuwendungsfähige Kosten | € | `=MIN(H90,H95*Wohnflaeche)+IF(Bodenrichtwert*Grundstuecksflaeche>0,MIN(H92,Bodenrichtwert*Grundstuecksflaeche),H92)` |
| 97 | Darlehensquote | % | `=INDEX(Quote_Darlehen,MATCH($B$2,Gruppen,0))` |
| 98 | Zuschussquote | % | `=INDEX(Quote_Zuschuss,MATCH($B$2,Gruppen,0))` |
| 99 | NBank-Darlehen | € | `=H96*H97` |
| 100 | Zuschuss | € | `=H96*H98` |
| 101 | Bearbeitungsentgelte | € | `=H99*BE_Darlehen+H100*BE_Zuschuss` |
| 102 | Eigenmittel bar (20 % abzüglich Grundstück) | € | `=MAX(0,Eigenmittelquote*H96-H92)` (Modellannahme: Mindest-Eigenmittel abzüglich Grundstück, alles bar; nicht die RL-Hälfte „Geld oder lastenfreies Grundstück“) |
| 103 | Bankdarlehen (Restfinanzierung) | € | `=MAX(0,ROUND(H90-H99-H100-H102-EK_Zusatz,2))` |
| 104 | Bares Eigenkapital, inkl. Entgelte | € | `=MAX(0,H90+H91+H101-H99-H100-H103)` |
| 105 | Kasse bei Bezug | € | `=ROUND(H99+H100+H103+H104-H90-H91-H101,2)` |
| 106 | Eigenkapital (Grundstück + bar) | € | `=H92+H104` |
| 107 | Eigenmittelquote, ohne Entgelte | % (eine Stelle) | `=IF(H96>0,(H92+H104-H101)/H96,0)` |
| 108 | Zuschuss nach Bearbeitungsentgelt | € | `=H100*(1-BE_Zuschuss)` |
| 109 | Miete Jahr 1 | €/m² Monat | `=INDEX(Hoechstmieten,MATCH(Mietenstufe,Mietenstufen,0),MATCH($B$2,Gruppen,0))+IF(Effizienz_EH40="ja",Zuschlag_EH40,0)` |
| 110 | Tilgungsrate NBank | € p. a. | `=Tilgung_NBank*H99` |
| 111 | Annuität Bank | € p. a. | `=IF(H103>0,PMT(Zins_Bank,Laufzeit_Bank,-H103),0)` |
| 112 | Restschuld Bank Ende Zinsbindung | € | `=IF(H103>0,MAX(0,-FV(Zins_Bank,MIN(Zinsbindung,Laufzeit_Bank),-H111,H103)),0)` |
| 113 | Anfangstilgung Bankdarlehen | % | `=IF(H103>0,H111/H103-Zins_Bank,0)` |
| 114 | Annuität Bank nach Zinsbindung | € p. a. | `=IF(H112<1,0,IF(Laufzeit_Bank<=Zinsbindung,H112,PMT(Zins_Anschluss,Laufzeit_Bank-Zinsbindung,-H112)))` |

H103 enthält KG 800 nicht: KG 800 und Entgelte zahlt H104 (E6, wie RR). `ROUND(…,2)` verhindert ein Bankdarlehen aus Rundungsresten, wenn die Lücke rechnerisch 0 ist (Herstellungskosten unter der Bemessungsgrenze und Grundstück unter dem Deckel). H112 wird geschlossen (`FV`) gerechnet, nicht per `INDEX` aus Spalte U: Ein Bezug auf U6:U48 erzeugt über P → H114 einen Zirkelbezug.

**Block Restwert** (H = Bezug, I = Jahr 35, J = Jahr 42; Formel für H, I und J gleich, Spaltenbezug relativ)

| Zeile | Größe | Einheit | Formel (Spalte H, in I/J analog) |
|---|---|---|---|
| 116 | Gruppenzeile „Restwert (Ertragswert)“ | | |
| 117 | Kopf: Größe · Einheit · Bezug · Jahr 35 · Jahr 42 | | |
| 118 | Stichjahr | Jahr | H `0`, I `=Bindung`, J `=Laufzeit_max` |
| 119 | Restnutzungsdauer | Jahre | `=GND-H118` |
| 120 | Liegenschaftszins | % | `=IF(H119<=INDEX(LZ_RND,1),INDEX(LZ_Satz,1),IF(H119>=INDEX(LZ_RND,COUNT(LZ_RND)),INDEX(LZ_Satz,COUNT(LZ_RND)),INDEX(LZ_Satz,MATCH(H119,LZ_RND,1))+(H119-INDEX(LZ_RND,MATCH(H119,LZ_RND,1)))/(INDEX(LZ_RND,MATCH(H119,LZ_RND,1)+1)-INDEX(LZ_RND,MATCH(H119,LZ_RND,1)))*(INDEX(LZ_Satz,MATCH(H119,LZ_RND,1)+1)-INDEX(LZ_Satz,MATCH(H119,LZ_RND,1)))))+Stress_LZ` |
| 121 | Bodenwert | € | `=Grundstueck*(1+Bodenwertsteigerung)^H118` |
| 122 | Ertragswert zur Zielmiete | € | `=SUMPRODUCT(($A$7:$A$86>H118)*($A$7:$A$86<=GND)*$X$7:$X$86/((1+Mietsteigerung)^($A$7:$A$86-H118-1)*(1+H120)^($A$7:$A$86-H118)))+H121/(1+H120)^H119` |
| 123 | Ertragswert Bestand | € | wie 122 mit `$K$7:$K$86` |
| 124 | Abschlag Bestandsmiete unter Zielmiete | € | `=H122-H123` (in Jahr 35/42 ist die Bindung ausgelaufen: Mindermietenabschlag) |
| 125 | Gebäudeanteil | € | `=H123-H121` |
| 126 | Restwert (Boden + Gebäude) | € | nur I/J: `=(I121+Stress_GebRW*I125)*(1-Veraeusserungskosten)` |
| 127 | Restwert nur Bodenwert | € | nur I/J: `=I121*(1-Veraeusserungskosten)` |
| 128 | Ertragswert Bestand gegenüber Gesamtkosten | % | nur H: `=IF($H$93>0,H123/$H$93-1,0)` |
| 129 | Ertragswert Zielmiete gegenüber Gesamtkosten | % | nur H: `=IF($H$93>0,H122/$H$93-1,0)` |

**Block Renditen** (I = Jahr 35, J = Jahr 42; IRR-Bereich endet per `INDEX` im Stichjahr). Jede Formel der Zeilen 133–145, 149 und 175–177 beginnt mit der Sperre `=IF($H$105>=1,"n. v.",…)` (E14); unten ist nur der innere Teil angegeben. IRR-Kennzahlen nach E10, Beispiel 133 (Reihe AE, Jahr 35, Hilfswerte Y/Z; J: Reihe AG, Hilfswerte AA/AB):

- Hilfswert erster Treffer `Y133 = KASKADE($AE$6:INDEX($AE$6:$AE$48,I$118+1),0.03)`, `KASKADE(B, s0)` = `IFERROR(V(s0),IFERROR(V(-0.1),IFERROR(V(-0.3),IFERROR(V(-0.5),IFERROR(V(-0.6),IFERROR(V(-0.7),"n. v."))))))`, `V(s) = IF(IRR(B,s)>-1,IRR(B,s),NA())`
- Hilfswert zweiter Versuch `Z133 = IFERROR(IRR(B,Y133+0.05),"n. v.")`
- Kennzahl `I133 = IF(COUNT($Y133:$Z133)=0,"n. v.",IF($AE$6+NPV(MAX($Y133:$Z133)+0.0001,$AE$7:INDEX($AE$6:$AE$48,I$118+1))<0,MAX($Y133:$Z133),"n. v."))`

In der Tabelle steht je Zeile die Reihe (I · J) und der Startwert s0 des ersten Treffers.

| Zeile | Kennzahl | Formel Spalte I, innerer Teil (J analog mit der J42-Spalte) |
|---|---|---|
| 131 | Gruppenzeile „Renditen vor Steuern“ | |
| 132 | Kopf: Kennzahl · Einheit · – · Jahr 35 · Jahr 42 | |
| 133 | Objekt-IRR nach Zuschuss, mit Restwert | AE · J: AG; s0 = 0,03 |
| 134 | Objekt-IRR nach Zuschuss, nur Bodenwert | AF · J: AH |
| 135 | Objekt-IRR nach Zuschuss, ohne Restwert | AD · J: AD |
| 136 | Objekt-IRR ohne Zuschuss, mit Restwert | Z · J: AB |
| 137 | Objekt-IRR ohne Zuschuss, nur Bodenwert | AA · J: AC |
| 138 | Objekt-IRR ohne Zuschuss, ohne Restwert | Y · J: Y |
| 139 | Hilfsgröße: Nettoanfangsrendite, statisch | nur H: `IF($H$94>0,K7/$H$94,0)` (ohne Zuschuss, ohne Restwert; kein Vergleich mit frei) |
| 140 | EK-IRR, mit Restwert | AK · J: AM; s0 = `IF(ISNUMBER(I143),I143,0)` (J: J143) |
| 141 | EK-IRR, nur Bodenwert | AL, Start I144 · J: AN, Start J144 |
| 142 | EK-IRR, ohne Restwert | AJ, Start I145 · J: AI, Start J145 |
| 143 | VOFI-EK-Rendite, mit Restwert | `IF(AND(I146>0,$H$106>0),(I146/$H$106)^(1/I$118)-1,"n. v.")` |
| 144 | VOFI-EK-Rendite, nur Bodenwert | wie 143 mit I147 |
| 145 | VOFI-EK-Rendite, ohne Restwert | wie 143 mit I148 |
| 146 | Endvermögen VOFI, mit Restwert | `=INDEX($V$6:$V$48,I$118+1)+I126-INDEX($T$6:$T$48,I$118+1)-INDEX($U$6:$U$48,I$118+1)` (ohne Sperre) |
| 147 | Endvermögen VOFI, nur Bodenwert | wie 146 mit I127 |
| 148 | Endvermögen VOFI, ohne Restwert | wie 146 ohne Restwert |
| 149 | Restwertanteil am Endvermögen | `IF(I146>0,I126/I146,"n. v.")` |
| 150 | Projektkonto (VOFI) | `=INDEX($V$6:$V$48,I$118+1)` (ohne Sperre) |
| 151 | Restschuld NBank und Bank | `=INDEX($T$6:$T$48,I$118+1)+INDEX($U$6:$U$48,I$118+1)` (ohne Sperre) |

**Block Liquidität** (Wert in H)

| Zeile | Größe | Einheit | Formel H |
|---|---|---|---|
| 153 / 154 | Gruppenzeile „Liquidität“ / Kopf | | |
| 155 | Zahlungsüberschuss Jahr 1 | € | `=R7` |
| 156 | DSCR Jahr 1 | Faktor | `=S7` |
| 157 | DSCR Minimum Jahr 1–35 | Faktor | `=IF(COUNT($S$7:INDEX($S$7:$S$48,Bindung))=0,"–",MIN($S$7:INDEX($S$7:$S$48,Bindung)))` |
| 158 | Jahre mit Fehlbetrag, Jahr 1–35 | Jahre | `=COUNTIF($R$7:INDEX($R$7:$R$48,Bindung),"<0")` |
| 159 | Größter kumulierter Fehlbetrag, Jahr 1–42 | € | `=MIN(0,MIN($W$7:$W$48))` |
| 160 | Zahlungsüberschuss vor NBank-Tilgung, Jahr 1 | € | `=R7-N7` |
| 161 | Break-even-Tilgung Jahr 1 | % | `=IF($H$99>0,H160/$H$99,0)` |
| 162 | Restschuld NBank Ende Jahr 35 | € | `=INDEX($T$6:$T$48,Bindung+1)` |
| 163 | Summe Tilgung NBank | € | `=-SUM($N$7:$N$48)` |
| 164 | Schlussrate NBank über Regelrate | € | `=MAX(0,-INDEX($N$7:$N$48,Laufzeit_max)-$H$110)` |
| 165 | Zahlungsüberschuss Jahr 10 | € | `=INDEX($R$7:$R$48,10)` |
| 166 | Zahlungsüberschuss Jahr 35 | € | `=INDEX($R$7:$R$48,Bindung)` |
| 167 | Zahlungsüberschuss Jahr 42 | € | `=INDEX($R$7:$R$48,Laufzeit_max)` |
| 168 | Barwertvorteil NBank-Darlehen | € | `=$H$99*(1-BE_Darlehen)+SUMPRODUCT(($L$7:$L$48+$M$7:$M$48+$N$7:$N$48)/(1+Zins_Bank)^$A$7:$A$48)` |
| 169 | Tiefster Stand Projektkonto (VOFI) | € | `=MIN($V$6:$V$48)` |
| 170 | Restschuld Bank Ende Jahr 42 | € | `=INDEX($U$6:$U$48,Laufzeit_max+1)` |

**Block Förderbarwert und Objektrendite** (Runde 2 FL1; Kopf wie Restwert: Größe · Einheit · Bezug · Jahr 35 · Jahr 42)

| Zeile | Größe | Einheit | Formel |
|---|---|---|---|
| 172 / 173 | Gruppenzeile „Förderbarwert und Objektrendite“ / Kopf | | |
| 174 | Förderbarwert (Zuschuss + Barwertvorteil) | € | H: `=H108+H168` |
| 175 | Objekt-IRR nach Förderbarwert, mit Restwert | % | I/J nach E10 mit Reihe AP · AR, s0 = 0,03 |
| 176 | Objekt-IRR nach Förderbarwert, nur Bodenwert | % | AQ · AS |
| 177 | Objekt-IRR nach Förderbarwert, ohne Restwert | % | AO · AO |

Kein Zirkelbezug: Zeitreihe ← H99–H114 (nur Eingaben/Tabellen); Restwert ← K, X; H168/H174 ← L, M, N; IRR-Spalten ← Restwert, H174; Hilfswerte ← IRR-Spalten; Renditen ← Hilfswerte, V, T, U, H105.

### D.4 Blatt Frei finanziert

| Sp. | Kopf | Zeile 6 | Zeilen 7 … 86 bzw. 6 … 48 |
|---|---|---|---|
| A, B | t, Jahr | wie D.3 | wie D.3 |
| C | Marktmiete | leer | `=Marktmiete_1*Stress_Miete*(1+Mietsteigerung)^(A{r}-1)` |
| D | Sollmiete | leer | `=C{r}*Wohnflaeche*12` |
| E | Mietausfall/Leerstand | leer | `=-Mietausfall*D{r}` |
| F, G | Objektverwaltung, Instandhaltung | leer | wie D.3 Spalte I, J |
| H | Überschuss vor Kapitaldienst | leer | `=SUM(D{r}:G{r})` |
| O | Objekt, ohne Restwert (6–48) | `=IF($A{r}=0,-$H$94,$H{r})` | einheitlich |
| P / Q | Objekt, mit Restwert / nur Bodenwert, Jahr 35 | `=IF($A{r}>$I$118,"",$O{r}+IF($A{r}=$I$118,$I$126,0))` / `$I$127` | einheitlich |
| R / S | Objekt, mit Restwert / nur Bodenwert, Jahr 42 | `=IF($A{r}>$J$118,"",$O{r}+IF($A{r}=$J$118,$J$126,0))` / `$J$127` | einheitlich |

Die Zahlungsreihen stehen in O–S (Gruppe Zeile 4 „Zahlungsreihen für IRR“, Köpfe zentriert), Spaltengliederung Ebene 1, zugeklappt (Schalter über T); darunter in O–R die Hilfswerte der Nullstellensuche (Gruppenzeile O131, Kopf O132:R132, Werte Zeilen 136–138, wie D.3); N bleibt frei, damit die Blöcke darunter (A–J) nicht in gegliederten Spalten liegen (Befund V9 Runde 1). Zeilen 49–86 gegliedert und zugeklappt wie D.3.

Kopf: A1 Titel „Frei finanziert: Zeitreihe und Ergebnisse“ (A1:H1 verbunden), D2 `=Aktives_Projekt`, Zellhyperlinks I2 „Übersicht“, J2 „Kosten“ → A88, K2 „Restwert“ → A116, L2 „Renditen“ → A131. Blöcke in denselben Zeilen wie D.3: 90–94 (Kosten, gleiche Formeln), 95 „Marktmiete Jahr 1“ `=C7`; 118–121 wie D.3; 122 „Ertragswert zur Marktmiete“ (SUMPRODUCT über `$H$7:$H$86`); 123, 124 und 129 leer (Dubletten: Bestand = Marktmiete, Abschlag 0, Wert vor = nach Abschlag); 125 „Gebäudeanteil“ `=H122-H121`; 126, 127 wie D.3; 128 „Ertragswert Marktmiete gegenüber Gesamtkosten“ `=IF($H$93>0,H122/$H$93-1,0)`; Renditen 136–138 „Objekt-IRR, mit Restwert / nur Bodenwert / ohne Restwert“ (Spalten P/R, Q/S, O/O; Regel E10 mit s0 = 0,03, Hilfswerte O/P · Q/R; ohne Sperre, keine Finanzierung); 139 „Hilfsgröße: Nettoanfangsrendite, statisch“ `=IF($H$94>0,H7/$H$94,0)`. Zeilen 123, 124, 129 und 133–135 leer und ausgeblendet (Runde 2 V14), 140–177 leer. Druck siehe G.4.

### D.5 Blatt Übersicht

Muster: Spalte D/E/F = `'Gefördert A'!x`, `'Gefördert B'!x`, `'Gefördert C'!x` mit gleicher Zelle x (reiner Verweis, grün); G = `'Frei finanziert'!x` oder leer (nicht zutreffende Frei-Zellen bleiben leer, Befund V4 Runde 1). In Blöcken mit Horizont: D–G aus Spalte I (Jahr 35), H–K aus Spalte J (Jahr 42). Formeln mit Rechnung (Block 1 Zeilen 11, 12, 15, 16, 24, 25; Block 2 Sätze und Kostenzeilen; Block 3 Zeile 49; Block 4; Block 8) sind schwarz. Alle Kopfzeilen Höhe 20 (Block 4: 27, zweizeiliger Kopf G). Abkürzungen RW/Geb.-RW/brutto kommen nicht vor: „mit Restwert“, „nur Bodenwert“, „ohne Restwert“, „ohne Zuschuss“, „nach Zuschuss“, „nach Förderbarwert“. Bemerkungen: Blöcke 1–4 und 8 in Spalte H (H–K sind dort leer, der Text läuft nach rechts; Runde 2 V4), Blöcke 5–7 in L. Quellenhinweis je Block einmal (Runde 2 V7).

**Kopf**

| Zeile | Inhalt |
|---|---|
| 1 | Titel „VOFI Mietwohnraum 2026: Übersicht“ (A1:L1 verbunden) |
| 2 | B2 „Aktives Projekt“; D2 `=Aktives_Projekt`; H2 „Projekt wählen“, Zellhyperlink → `'Eingaben'!D3` |
| 3 | B3 „Prüfungen“, Zellhyperlink → `'Übersicht'!A108`; D3 `=IF(COUNTIF($C$109:$C$114,"OK")=ROWS($C$109:$C$114),"OK","prüfen")` |
| 4 | B4 „Konventionen“; D4 „vor Steuern, nominal, T0 = Bezugsfertigkeit; Zeitreihen: Auszahlungen negativ“ |
| 5 | B5 „Legende“; D5 „Ändern nur auf „Eingaben“ (blau auf Gelb). Grün: Verweis auf ein anderes Blatt. Weitere Zeilen: + am linken Rand.“ |
| 6 | B6 „Blätter“; D6:K6 Zellhyperlinks: Eingaben · Gefördert A · Gefördert B · Gefördert C · Frei finanziert · NBank · Tabellen · Hinweise |

**Block 1 Projekt und Finanzierung bei Bezug** (Kopf Zeile 8: Nr. · Projekt und Finanzierung bei Bezug · Einheit · A · B · C · Frei · Bemerkung (H))

| Zeile | Nr. | Inhalt B | C | D–F (G) | H Bemerkung | Gliederung |
|---|---|---|---|---|---|---|
| 9 | 1.1 | Gesamtkosten | € | H93 (G: Frei H93) |  | sichtbar |
| 10 | 1.2 | Zuwendungsfähige Kosten | € | H96 |  | sichtbar |
| 11 | 1.3 | Herstellung über Bemessungsgrenze | € | `=MAX(0,x!H90-x!H95*Wohnflaeche)` | nicht zuwendungsfähig | sichtbar |
| 12 | 1.4 | Grundstück über Bodenrichtwert × Fläche | € | `=IF(Bodenrichtwert*Grundstuecksflaeche>0,MAX(0,Grundstueck-Bodenrichtwert*Grundstuecksflaeche),0)` | Deckel nur für die Förderbemessung | eingeklappt |
| 13 | 1.5 | NBank-Darlehen | € | H99 |  | sichtbar |
| 14 | 1.6 | Zuschuss | € | H100 |  | sichtbar |
| 15 | 1.7 | Förderung gesamt | € | `=x!H99+x!H100` | Darlehen + Zuschuss | sichtbar |
| 16 | 1.8 | Förderquote auf Gesamtkosten | % | `=IF(x!H93>0,(x!H99+x!H100)/x!H93,0)` |  | sichtbar |
| 17 | 1.9 | Förderbarwert (Zuschuss + Barwertvorteil) | € | H174 | Zuschuss nach Entgelt + Zinsvorteil; steigt mit Eingabe 6.1 | sichtbar |
| 18 | 1.10 | Bankdarlehen | € | H103 | Restfinanzierung | sichtbar |
| 19 | 1.11 | Eigenmittel (RL Nr. 5.2.6), ohne Entgelte | € | `=x!H106-x!H101` |  | sichtbar |
| 20 | 1.12 | Eigenmittelquote | % | H107 | mindestens 20 % | sichtbar |
| 21 | 1.13 | Bearbeitungsentgelte, einmalig | € | H101 |  | sichtbar |
| 22 | 1.14 | Eigenkapital (Grundstück + bar) | € | H106 | Eigenmittel + Entgelte | sichtbar |
| 23 | 1.15 | davon bar | € | H104 |  | eingeklappt |
| 24 | 1.16 | Zuschuss je Wohnung | € | `=IF(Wohneinheiten>0,x!H100/Wohneinheiten,0)` |  | sichtbar (Broschüre S. 10) |
| 25 | 1.17 | Eigenmittel je Wohnung | € | `=IF(Wohneinheiten>0,(x!H106-x!H101)/Wohneinheiten,0)` |  | sichtbar (Broschüre S. 10) |
| 26 | 1.18 | Miete Jahr 1 | €/m² Monat | H109 (G: Frei H95) |  | sichtbar |

**Block 2 Jahresrechnung Jahr 1** (Kopf Zeile 28: Zeile · Jahresrechnung Jahr 1, in € p. a. · Satz · A · B · C · Bemerkung (H)). Bezeichnungen nach `11-wirtschaftlichkeit.json`, gekürzt; Beträge positiv, Rechenzeichen in der Bezeichnung; Kostenzeilen ohne Rotformat (Format `#,##0;-#,##0;"–"`), Zeile 38 im Standard-Euroformat.

| Zeile | A | Inhalt B | C Satz | D–F | H Bemerkung |
|---|---|---|---|---|---|
| 29 | 1 | Sollmiete: Höchstmiete nettokalt |  | G7 | Schema wie Broschüre S. 11 |
| 30 |  | − Mietausfall/Leerstand | `=Mietausfall` | `=-x!H7` | der Sollmiete |
| 31 | 2 | − Objektverwaltung | `=Verwaltung_WE*(1+Kostensteigerung)^Kosten_Vorlauf` (`#,##0" € je Wohnung"`) | `=-x!I7` | Satz 2026, fortgeschrieben laut Eingabe 5.5; Betriebskosten umgelegt |
| 32 | 3 | − Instandhaltung | `=Instandhaltung_qm*(1+Kostensteigerung)^Kosten_Vorlauf` (`0.00" €/m²"`) | `=-x!J7` | Satz 2026, fortgeschrieben laut Eingabe 5.5 |
| 33 | 4 | = Überschuss vor Kapitaldienst |  | K7 |  |
| 34 | 5 | − Verwaltungskostenbeitrag | `=VKB_Satz` | `=-x!L7` | des Restkapitals |
| 35 | 6 | − Zins NBank-Darlehen | `=Zins_NBank_1_35` | `=-x!M7` | bis Ende Jahr 35 |
| 36 | 7 | − Tilgung NBank-Darlehen (Annahme) | `=Tilgung_NBank` | `=-x!N7` | Satz legt die NBank fest |
| 37 |  | − Kapitaldienst Bankdarlehen |  | `=-(x!O7+x!P7)` | nur bei Restfinanzierung |
| 38 | 8 | = Zahlungsüberschuss p. a. |  | R7 |  |
| 39 |  | Einmalig: Bearbeitungsentgelte |  | H101 | nicht in Zeile 8 |

**Block 3 Liquidität** (Kopf Zeile 41: Nr. · Liquidität · Einheit · A · B · C · Bemerkung (H))

| Zeile | Nr. | Inhalt B | C | D–F | H Bemerkung | Gliederung |
|---|---|---|---|---|---|---|
| 42 | 3.1 | Zahlungsüberschuss Jahr 10 | € | H165 |  | sichtbar |
| 43 | 3.2 | Zahlungsüberschuss Jahr 35 | € | H166 |  | sichtbar |
| 44 | 3.3 | Zahlungsüberschuss Jahr 42 | € | H167 |  | sichtbar |
| 45 | 3.4 | Schuldendienstdeckung (DSCR) Jahr 1 | Faktor | H156 | Zeile 4 ÷ Kapitaldienst | sichtbar |
| 46 | 3.5 | DSCR Minimum Jahr 1–35 | Faktor | H157 |  | sichtbar |
| 47 | 3.6 | Jahre mit Fehlbetrag, Jahr 1–35 | Jahre | H158 |  | sichtbar |
| 48 | 3.7 | Größter kumulierter Fehlbetrag, Jahr 1–42 | € | H159 | ohne Zinsen | sichtbar |
| 49 | 3.8 | Break-even-Tilgung Jahr 1 | % | `=MAX(0,x!H161)` | Tilgung, bei der Zeile 8 = 0; „–“: schon ohne Tilgung negativ | sichtbar |
| 50 | 3.9 | Restschuld NBank Ende Jahr 35 | € | H162 |  | eingeklappt |
| 51 | 3.10 | Schlussrate NBank Jahr 42 über Regelrate | € | H164 | Rest wird in Jahr 42 getilgt | eingeklappt |
| 52 | 3.11 | Restschuld Bank Ende Jahr 42 | € | H170 | bei Laufzeit über 42 Jahre (Eingabe 6.4) | eingeklappt |

**Block 4 Tilgungssatz** (Kopf Zeile 54: Nr. · Zahlungsüberschuss Jahr 1 je Tilgungssatz · Einheit · A · B · C · höchster Überschuss (zentriert, zweizeilig) · Bemerkung (H)). Die Rasterwerte stehen als Zahl in Spalte B (Format `"Tilgung "0.00 %`, Anzeige „Tilgung 1,00 %“; feste Hilfswerte, schwarz, keine Eingabe), außer B59 `=1/Laufzeit_max` und B62 `=Tilgung_NBank` (Format `"Tilgung "0.00 %" laut Eingabe 3.1"`). C = „€“. Zwischenwerte 1,25 / 1,75 / 2,25 / 2,75 % gestrichen (Runde 2 V5).

| Zeile | Nr. | B | D–F, G | H Bemerkung | Gliederung |
|---|---|---|---|---|---|
| 55–61 | 4.1–4.7 | 0,00 · 1,00 · 1,50 · 2,00 · `=1/Laufzeit_max` · 2,50 · 3,00 % | D `='Gefördert A'!$H$160-$B55*'Gefördert A'!$H$99`, E/F analog; G `=INDEX($D$54:$F$54,MATCH(MAX(D55:F55),D55:F55,0))` | Zeile 55: „vor Tilgung“; Zeile 59: „Volltilgung in 42 Jahren“ | sichtbar |
| 62 | 4.8 | `=Tilgung_NBank` | wie 55 | „gleich Zeile 8, ohne Aufschub“ (3.2 = 0) | eingeklappt |

Vergleich der Gruppen, Schema Broschüre S. 12 (oberer Rahmen Ergebnislinie an Zeile 63; Schwellen sichtbar, Rechenweg darunter eingeklappt; D der Zeilen 66–72 „–“):

| Zeile | Nr. | Inhalt B | C | E / F | H Bemerkung | Gliederung |
|---|---|---|---|---|---|---|
| 63 | 4.9 | Tilgungsschwelle B gegenüber A | % | E `=IFERROR(('Gefördert B'!$H$160-'Gefördert A'!$H$160)/('Gefördert B'!$H$99-'Gefördert A'!$H$99),"–")` | Rechenweg wie Broschüre S. 12 | sichtbar |
| 64 | 4.10 | Tilgungsschwelle C gegenüber A | % | F analog C gegen A |  | sichtbar |
| 65 | 4.11 | Tilgungsschwelle C gegenüber B | % | F analog C gegen B |  | sichtbar |
| 66 | 4.12 | Mehrschuld gegenüber A | € | `='Gefördert B'!$H$99-'Gefördert A'!$H$99` / C analog |  | eingeklappt |
| 67 | 4.13 | Mehr-Sollmiete p. a. | € | `=E29-D29` / `=F29-D29` |  | eingeklappt |
| 68 | 4.14 | − Mietausfall/Leerstand | € | `=E30-D30` / `=F30-D30` (Kostenformat) |  | eingeklappt |
| 69 | 4.15 | − Verwaltungskostenbeitrag | € | `=E34-D34` / `=F34-D34` (Kostenformat) |  | eingeklappt |
| 70 | 4.16 | = Mehrüberschuss vor Tilgung | € | `='Gefördert B'!$H$160-'Gefördert A'!$H$160` / C analog | Schwelle = 4.16 ÷ 4.12 | eingeklappt |
| 71 | 4.17 | Mehrüberschuss bei Tilgung laut Eingabe 3.1 | € | `=E62-D62` / `=F62-D62` | Zeile 8: B − A, C − A | eingeklappt |
| 72 | 4.18 | Einmalig: Mehr an Bearbeitungsentgelten | € | `=E39-D39` / `=F39-D39` |  | eingeklappt |

H160 = R7 − N7; bei Aufschub > 0 ist N7 = 0 und das Raster zeigt den Zahlungsüberschuss mit Tilgung ab Jahr 1 und Kosten Jahr 1. 4.13 − 4.14 − 4.15 = 4.16 (Prüfskript F13).

**Block 5 Objektrendite** (Gruppenzeile 74 „Objektrendite vor Steuern“, D74 „Jahr 35“, H74 „Jahr 42“; Kopf Zeile 75: Nr. · Kennzahl · Einheit · A · B · C · Frei · A · B · C · Frei · Bemerkung). Frei steht in allen Objekt-IRR-Zeilen (frei: ohne Förderung, nach Förderbarwert = nach Zuschuss = ohne Zuschuss; E18).

| Zeile | Nr. | Inhalt B | C | D–F (H–J) | G (K) Frei | L Bemerkung | Gliederung |
|---|---|---|---|---|---|---|---|
| 76 | 5.1 | Objekt-IRR nach Förderbarwert, mit Restwert | % | I175 (J175) | Frei I136 (J136) | Frei ohne Förderung; Förderbarwert 1.9 | sichtbar, fett |
| 77 | 5.2 | Objekt-IRR nach Förderbarwert, nur Bodenwert | % | I176 (J176) | Frei I137 (J137) |  | sichtbar |
| 78 | 5.3 | Objekt-IRR nach Zuschuss, mit Restwert | % | I133 (J133) | Frei I136 (J136) | gefördert ohne Zinsvorteil Darlehen | sichtbar |
| 79 | 5.4 | Objekt-IRR ohne Zuschuss, mit Restwert | % | I136 (J136) | Frei I136 (J136) | Abstand zu Frei: Kosten der Bindung | sichtbar |
| 80 | 5.5 | Objekt-IRR nach Förderbarwert, ohne Restwert | % | I177 (J177) | Frei I138 (J138) | mehrere Nullstellen möglich | eingeklappt |
| 81 | 5.6 | Objekt-IRR nach Zuschuss, nur Bodenwert | % | I134 (J134) | Frei I137 (J137) |  | eingeklappt |
| 82 | 5.7 | Objekt-IRR nach Zuschuss, ohne Restwert | % | I135 (J135) | Frei I138 (J138) | mehrere Nullstellen möglich | eingeklappt |
| 83 | 5.8 | Objekt-IRR ohne Zuschuss, nur Bodenwert | % | I137 (J137) | Frei I137 (J137) |  | eingeklappt |
| 84 | 5.9 | Objekt-IRR ohne Zuschuss, ohne Restwert | % | I138 (J138) | Frei I138 (J138) | mehrere Nullstellen möglich | eingeklappt |
| 85 | 5.10 | Hilfsgröße: Nettoanfangsrendite, statisch | % (Jahr 1) | H139; H–J leer | leer | ohne Zuschuss, ohne Restwert | eingeklappt |

**Block 6 EK-Rendite** (Gruppenzeile 87 „Eigenkapitalrendite vor Steuern“, D87 „Jahr 35“, H87 „Jahr 42“; Kopf Zeile 88: Nr. · Kennzahl · Einheit · A · B · C · (leer) · A · B · C · (leer) · Bemerkung)

| Zeile | Nr. | Inhalt B | C | D–F (H–J) | L Bemerkung | Gliederung |
|---|---|---|---|---|---|---|
| 89 | 6.1 | EK-IRR, mit Restwert | % | I140 (J140) |  | sichtbar, fett |
| 90 | 6.2 | EK-IRR, nur Bodenwert | % | I141 (J141) | mehrere Nullstellen möglich | sichtbar |
| 91 | 6.3 | VOFI-EK-Rendite, mit Restwert | % | I143 (J143) | Kontozinsen laut Eingabe 7.2/7.3 | sichtbar, fett |
| 92 | 6.4 | VOFI-EK-Rendite, nur Bodenwert | % | I144 (J144) |  | sichtbar |
| 93 | 6.5 | Restwertanteil am Endvermögen | % | I149 (J149) |  | sichtbar |
| 94 | 6.6 | EK-IRR, ohne Restwert | % | I142 (J142) | mehrere Nullstellen möglich | eingeklappt |
| 95 | 6.7 | VOFI-EK-Rendite, ohne Restwert | % | I145 (J145) |  | eingeklappt |

**Block 7 Restwert** (Gruppenzeile 97 „Restwert (Ertragswert)“, D97 „Jahr 35“, H97 „Jahr 42“; Kopf Zeile 98: Nr. · Kennzahl · Einheit · A · B · C · Frei · A · B · C · Frei · Bemerkung)

| Zeile | Nr. | Inhalt B | C | D–F (H–J) | G (K) Frei | L Bemerkung | Gliederung |
|---|---|---|---|---|---|---|---|
| 99 | 7.1 | Restwert (Boden + Gebäude) | € | I126 (J126) | Frei I126 (J126) | nach Eingabe 8.3 und 9.4 | sichtbar, fett |
| 100 | 7.2 | Bodenwert | € | I121 (J121) | Frei I121 (J121) |  | sichtbar |
| 101 | 7.3 | Gebäudeanteil | € | I125 (J125) | Frei I125 (J125) |  | sichtbar |
| 102 | 7.4 | Ertragswert Bestand gegenüber Gesamtkosten | % (Bezug) | H128; H–J leer | Frei H128; K leer | bei Bezug; negativ: unter Gesamtkosten | sichtbar |
| 103 | 7.5 | Ertragswert Bestand | € | I123 (J123) | Frei I122 (J122) | Frei: zur Marktmiete | eingeklappt |
| 104 | 7.6 | Abschlag Bestandsmiete unter Zielmiete | € | I124 (J124) | leer |  | eingeklappt |
| 105 | 7.7 | Liegenschaftszins | % | I120 (J120) | Frei I120 (J120) | Standort Neu Wulmstorf | eingeklappt |
| 106 | 7.8 | Ertragswert Zielmiete gegenüber Gesamtkosten | % (Bezug) | H129; H–J leer | leer | bei Bezug; nachrichtlich | eingeklappt |

**Block 8 Prüfungen** (Kopf Zeile 108: Nr. · Prüfung · Status (C, zentriert) · A · B · C · Bemerkung (H); Zeilen 109–114 = P1–P6 aus F.1, sichtbar; Gesamtstatus in D3). D109:F109 zeigen die Kasse bei Bezug A/B/C (`='Gefördert x'!H105`, grün, Euro), H109 „Kasse bei Bezug in €“; A/B/C stehen damit in denselben Spalten wie in allen Blöcken (Runde 2 V6).

Gliederung Übersicht: Zeilen 12, 23, 50–52, 62, 66–72, 80–85, 94–95, 103–106 Ebene 1, zugeklappt (`hidden`), Schalter an der Zeile darüber (`summaryBelow = False`). Der Prüfblock ist nicht gegliedert. Spaltenbreiten G.3; Druck zwei Seiten (Umbruch nach Zeile 52), Wiederholzeilen 1:2.

### D.6 Blatt NBank

| Zeile | Nr. | B | C | D–F (A/B/C) | G–I Lage A/B/C |
|---|---|---|---|---|---|
| 1 | | Titel „NBank: Orientierung zur Überkompensation“ (A1:G1 verbunden); I1 Zellhyperlink „Übersicht“ | | | |
| 2 | | A2: „Die NBank rechnet selbst (RL Nr. 11.10). Die Werte sind eine interne Orientierung.“ | | | |
| 3 | | B3 „Projekt“, D3 `=Aktives_Projekt` (grün, fett) | | | |
| 4 | | Kopf: Nr. · Größe · Einheit · Wert · – · – · Quelle | | | |
| 5 | N1 | Swapsatz 30 Jahre | % | D `=Swapsatz_30J` | G: Eingabe 3.4 |
| 6 | N2 | Aufschlag | Prozentpunkte | D `=Aufschlag_Swap` (Format `+0.00 %`) | G: RL 2026 Nr. 11.10 Abs. 4 |
| 7 | N3 | Orientierungswert | % | D `=D5+D6` | |
| 8 | | Gruppenzeile A8:I8: D8 „Rendite“, G8 „Lage zum Orientierungswert“ | | | |
| 9 | | Kopf: Nr. · EK-Rendite vor Steuern · Jahr · A · B · C · A · B · C | | | |
| 10 | | Gruppenzeile „Primärgröße VOFI (RL Nr. 11.10 Abs. 3)“ | | | |
| 11 / 12 | N4 / N5 | VOFI-EK-Rendite, mit Restwert | 35 / 42 | `'Gefördert x'!I143` / `J143` | `=IF(ISERROR(D11),"prüfen",IF(ISNUMBER(D11),IF(D11>$D$7,"über","unter"),"–"))` |
| 13 | | Gruppenzeile „Gegenrechnung EK-IRR (DAWI Art. 6 Abs. 1)“ | | | |
| 14 / 15 | N6 / N7 | EK-IRR, mit Restwert | 35 / 42 | I140 / J140 | wie oben |
| 16 | | Gruppenzeile „nachrichtlich“ | | | |
| 17 / 18 | N8 / N9 | VOFI-EK-Rendite, nur Bodenwert | 35 / 42 | I144 / J144 | wie oben |
| 19 / 20 | N10 / N11 | EK-IRR, nur Bodenwert | 35 / 42 | I141 / J141 | wie oben |
| 21 / 22 | N12 / N13 | VOFI-EK-Rendite, ohne Restwert | 35 / 42 | I145 / J145 | wie oben |
| 23 / 24 | N14 / N15 | EK-IRR, ohne Restwert | 35 / 42 | I142 / J142 | wie oben |
| 26 | | Kopf: Nr. · Bezugsgrößen · Einheit · A · B · C | | | |
| 27 | N16 | Eigenkapital (Grundstück + bar) | € | H106 | |
| 28 | N17 | NBank-Darlehen, Nennwert | € | H99 | |
| 29 | N18 | Zuschuss nach Bearbeitungsentgelt | € | H108 | |
| 30 | N19 | Barwertvorteil Darlehen zum Vergleichszins | € | H168 | |
| 31 | N20 | Ausgleichsleistung, Barwert | € | `=D29+D30` | |
| 33 | | A33: „„über“: Die NBank prüft den angemessenen Gewinn ergänzend (RL Nr. 11.10 Abs. 4); Gleichstand gilt als „unter“.“ | | | |
| 34 | | A34: „Horizont, Wiederanlage, Restwert und Swap-Stichtag legt die NBank fest.“ | | | |
| 35 | | A35: „Barwertvorteil: Darlehen nach Entgelt abzüglich Barwert von Zins, Tilgung und VKB zum Zins laut Eingabe 6.1.“ | | | |
| 36 | | A36: „EK-IRR nur Bodenwert und ohne Restwert: mehrere Nullstellen möglich; VOFI-EK-Rendite maßgeblich.“ | | | |

Kein Abstand in Prozentpunkten, nur die Lage „über/unter“ (Vorgabe 8); „über“ heißt nicht Überkompensation, sondern Anlass für ergänzende Ermittlungen der NBank (A33). Kein Text „Safe Harbour“, „eingehalten“, „erfüllt“. Bei gesperrten Renditen (E14) zeigen D–F „n. v.“ und G–I „–“; bei Fehlerwerten zeigen G–I „prüfen“ (Runde 2 R1). N20 „Ausgleichsleistung, Barwert“ ist derselbe Betrag wie der Förderbarwert (Gefördert H174, Übersicht 1.9). Spaltenbreiten A 6 · B 40 · C 13 · D–F 11 · G–I 10; Abstandszeilen 25, 32 Höhe 6; Druckbereich A1:I36.

### D.7 Blatt Hinweise (15 Zeilen, A3:B17)

A1:B1 Titel, C1 Zellhyperlink „Übersicht“, Kopf A2:B2 „Nr. · Hinweis (Version 3.0, Stand 11/2026)“. Je Zeile ein Gedanke, 106–145 Zeichen (Runde 2 V3).

| Nr. | Text |
|---|---|
| 1 | Zweck: Wirtschaftlichkeit geförderter Mietwohnungen nach RL Mietwohnraum 2026, Programmteil 2.1; Gruppen A, B, C und frei finanziert. |
| 2 | Bedienung: Projekt auf „Eingaben“ wählen (1 oder 2), nur blaue Werte auf Gelb ändern, Ergebnisse auf „Übersicht“; weitere Zeilen über +. |
| 3 | Konventionen: vor Steuern, nominal, jährlich nachschüssig; T0 = Bezugsfertigkeit; Zeitreihen mit Auszahlungen negativ. |
| 4 | Bauphase nicht abgebildet: Kosten, Eigenkapital, Entgelte und Verwaltungskostenbeitrag (RL Nr. 12.7.1) erst ab Bezug; alle Renditen eher zu hoch. |
| 5 | Kostenstand: Die Sätze 5.2 und 5.3 (Stand 2026) gelten in Jahr 1, Steigerung ab Jahr 2; Eingabe 5.5 schreibt sie um Jahre fort. |
| 6 | Mieten: Höchstmiete (höchstens Marktmiete) in Jahr 1–3, dann alle 3 Jahre +6,15 % (ab Jahr 36 Kappungsgrenze) bis zur Vergleichsmiete; je m² ungerundet. Frei finanziert: Marktmiete wie bei Neuvermietung, ohne Grenze nach § 558 BGB; der Frei-IRR liegt dadurch rund 0,4–0,5 Prozentpunkte höher. |
| 7 | Finanzierung: Eigenkapital = Grundstück (Sacheinlage) + bar; Bank nur für die Lücke; NBank-Darlehen 0 % bis Jahr 35, linear, Rest in Jahr 42. |
| 8 | Restwert: Ertragswert im Stichjahr; Bestandsmiete je 3 Jahre höchstens um die Kappungsgrenze, bis Jahr 42 bis zur Vergleichs-, dann Zielmiete. |
| 9 | Restwert-Varianten: mit Restwert = Boden + Gebäude; nur Bodenwert = ohne Gebäudeanteil; ohne Restwert = 0. |
| 10 | Objekt-IRR ohne Finanzierung: ohne Zuschuss, nach Zuschuss, nach Förderbarwert (Zuschuss + Barwertvorteil Darlehen zum Zins 6.1). |
| 11 | IRR bei mehreren Nullstellen: größte mit fallendem Barwert, maßgeblich dann die VOFI-EK-Rendite. „n. v.“: keine Lösung oder gesperrt (P1). |
| 12 | Nach außen: Jahresrechnung, Tilgungsvergleich, Annahmen. Renditen nur in der Beratung, als Paar mit Restwert / nur Bodenwert und Restwertanteil. |
| 13 | Bandbreite zu jeder Rendite in der Beratung: Eingabe 9.3 ±0,5 %, 9.4 = 0,50, 8.3 = 5 %, 8.2 = Vergleichsmiete. |
| 14 | Nicht nach außen: Blatt NBank, Renditen ohne Paar, Platzhalter (Modellhaus: Mieten 4.3/4.4, Liegenschaftszins Neu Wulmstorf). |
| 15 | Tarutinoer: Grundstück 0 € wie Vorgängermappe; Renditen ohne Grundstückskosten, nur Bodenwert = ohne Restwert; nicht mit Modellhaus vergleichbar. |

---

## E. Streichliste und Korrekturliste

### E.1 Streichliste (Element v2-1 → v3)

| Element v2-1 | v3 | Grund | Zahlenwirkung |
|---|---|---|---|
| Szenario-Umschalter, Blatt Szenarien (6 Treiber) | entfällt; Stresstest 9.1–9.3, Kostensteigerung 5.4, Tilgung 3.1, Anschlusszins 6.3 | Vorgabe 5 | Basis unverändert; Best/Worst siehe E.4 |
| Szenario-Treiber Kostensteigerung (`Szenarien!G8:I8`) | kein eigener Stresswert; Best/Worst direkt in 5.4 | doppelt zu 5.4 | 0 |
| Kostenkennwert als Gesamtbetrag (`Szenarien!H6`) | 2.1 je m² Wohnfläche | G11; Bemessungsgrenze und Broschüre in €/m² | 0 (3.579 × 828 = 2.963.412 €) |
| Anfängliche Tilgung Bank als Formelwert (`C54`, 1,8618466 %) | 6.4 Laufzeit 30 Jahre, Tilgung per Formel | G11 | 0 |
| Entnahmemodus 0/1/2, Sondertilgung, Entnahme (`Eingabe!C99`, Sp. R/S) | entfällt, nur Thesaurierung | B9 | 0 (v2-1 Modus 0) |
| Kontokorrentlinie (`C102`) und Überziehungskennzahlen | entfällt; Sollstand bleibt sichtbar über Zeile 169 „Tiefster Stand Projektkonto (VOFI)“ und Übersicht 3.6/3.7 | Anzeige ohne Rechenwirkung | 0 |
| Zinsstaffel, Referenzauslauf, Beleihungsabschlag, Margentabelle (`C55:C57`, `B133:C136`), Beleihungswert, LTV-Zeilen | entfällt | Staffel aus; Bankfähigkeit nicht Kernfrage | 0 |
| Prolongationsmodi 0/1/2, Tilgung ab Prolongation (`C58:C59`) | eine Regel (Modus 2) | Vorgabe 6 | 0 (v2-1 Modus 2) |
| Realrendite, Inflation (`C108`, K4) | entfällt | Vorgabe 6 | K4 nicht mehr ausgewiesen |
| Stichtage 1–6 (`C109:C114`), Blatt Bewertung | feste Auswertungen Bezug, Jahr 1, 10, 35, 42 | Vorgabe 6 | J35/J42 unverändert; frühe VOFI-Renditen (T1 27,55 %) entfallen (G3) |
| Frei, obere Kante; DSCR-Ziel; Startmiete 18,80 € (`C69:C70`), Blatt Frei_finanziert | entfällt; nur Frei zur Marktmiete | B10 | Vergleich frei 6,17 % statt 7,59 % (Tarutinoer, J42) |
| Vorlaufzeit 2,5 J. im Exponenten (`C107`) | entfällt; T0 = Bezugsfertigkeit | B7 | VOFI-EK mit RW J42: Tarutinoer A +0,39 Pp, Modellhaus A +0,33 Pp |
| Bauzeitrechnung (`C91:C95`, `Basisdaten!C28:C31`) | entfällt; KG 800 bleibt Eingabe 2.2 | B7 | 0 (Schalter „nein“) |
| Schalter Bearbeitungsentgelt in KG 800 (`C47`) und Bankfinanzierung der Entgelte | entfällt; Entgelte aus Eigenkapital bei Bezug | Broschüre S. 11 | Tarutinoer: Bankdarlehen −20.744 / −22.226 / −22.966 €; ZÜ Jahr 1 +1.162 / +1.245 / +1.287 €; VOFI −0,07/−0,08/−0,08 Pp; EK-IRR −0,05 Pp |
| Mietband-Anker, Basisjahre, Ansatz im Band, Zuschlag Standard, Mietfaktor (`C63:C68`, `C71`) | 4.3 Vergleichsmiete und 4.4 Marktmiete, je Jahr 1; Faktor 9.2 | Vorgabe 6. Zwei Eingaben statt einer, weil die Vergleichsmiete die Obergrenze der gebundenen Miete bis Jahr 42 ist (Spalte F) und Zielmiete-Option 8.2; Bezug Jahr 1 wie v2-1 `Basisdaten!C46:C49` | 0 (Tarutinoer gleiche Werte 12,9177 / 14,4804; Modellhaus gerundet, A7) |
| Wohnungsmarkt, Kappung angespannt, Verordnung bis (`C76:C77`, `C79`) | eine Eingabe 4.6 | Vorgabe 6 | 0 (ab 2030 ohnehin 20 %) |
| Blatt Modellannahmen (Langtexte) | Blatt Hinweise, 15 Zeilen | Vorgabe 6 | 0 |
| Formel-Prosa in Spalte E, ACHTUNG-Sätze, Kontrollspalte AK (9 Identitäten je Zeile) | entfällt; Prüfblock P1–P6, Identitäten im Prüfskript (F13) | Vorgabe 6, 10 | 0 |
| Zelladressen und Fakt-IDs in Quellenangaben | entfallen in der Excel; Fundstellen in B.2 und C dieses Konzepts | Vorgabe 10 | 0 |
| K1–K7 in alter Form | Ebenen 1–4 (Abschnitt D.5, D.6) | B1–B3 | siehe E.2 |
| Debt Yield, ICR, Kapitaldienst je m², DSCR unter Ziel, erforderliche Startmiete, LTV | entfällt | ergänzt: keine Kernfrage, G9 | 0 |
| Blatt Finanzierung (Tranchenübersicht) | Übersicht Block 1 | ergänzt: Doppelung | 0 |
| Basisdaten (Festwerte, Abgeleitetes) | Tabellen + Blöcke unter der Zeitreihe | ergänzt: eine Stelle je Größe | 0 |
| Vorhabenart, Zuschlag modellhaft/Housing First (`C32:C34`) | entfällt | ergänzt: beide Projekte Regelfall | 0 |
| Grundstück Kaufpreis, Wertansatz (`C16:C17`) | entfällt; 2.3 Verkehrswert | ergänzt: ein Wertansatz | 0 |
| Bodenwert Liegenschaftszinsmodell (`C21`) | entfällt; Eichwert 600 €/m² in der Quelle von Tabelle 4 | ergänzt: nur Text in v2-1 | 0 |
| KG 120 Grundstücksnebenkosten (`C90`) | entfällt; bei Erwerb im Grundstückswert | ergänzt: 0 in beiden Projekten | 0 |
| Eigenleistungen (`C89`) | entfällt | ergänzt: 0; harte Eigenmittel dann immer 100 % | 0 |
| Mietausfall frei finanziert (`C83`) | eine Eingabe 5.1 | ergänzt: gleicher Wert (G10) | 0 |
| Belegungsbindung getrennt (`C40`), Regelquote, Eigenmittel hart, Zeilen_Soll, Monate_Jahr, Toleranz | Tabellen T18; sonst entfällt (12 und 1 € direkt) | ergänzt | 0 |
| Laufzeit NBank 40 J. (`C25`) | 3.1 Tilgungssatz 2,50 % | ergänzt: die Broschüre nennt den Satz | 0 (bei Aufschub A8) |
| Abschlag bis (`C104`, `BoG_Grenze`) | 8.2 Zielmiete; Abschlag immer bis Zielmiete | B5 | siehe E.2 B5 |

### E.2 Korrekturliste B1–B11 (Umbauliste 6.2 Nr. 1–7 und 10)

| Befund | Umbau Nr. | Lösung in v3 | Ort | Wirkung (A, J42 mit RW) |
|---|---|---|---|---|
| B1 keine Objektrendite | 3, 7 | Objekt-IRR ohne und nach Zuschuss, je mit Restwert / nur Bodenwert / ohne Restwert, J35/J42; Nettoanfangsrendite nur als „Hilfsgröße … statisch“ ohne Frei-Vergleich (Runde 1); Objekt-IRR nach Förderbarwert als Entscheidungsvergleich gegen frei (Runde 2, E18) | Gefördert Z. 133–139, 172–177, Übersicht Block 5 | neu: Modellhaus 4,16 % / 2,48 %; Tarutinoer 5,28 % / 3,45 % |
| B2 EK-Paare uneinheitlich | 2 | EK-IRR und VOFI-EK, je drei Varianten, gleiche Zeitbasis; Restwert in Boden und Gebäude | Z. 121–127, 140–145 | neu: EK-IRR ohne RW, ohne Geb.-RW |
| B3 Überkompensation | 6 | Blatt NBank: VOFI primär, IRR Gegenrechnung, J35/J42; nachrichtlich ohne; „über/unter“; „Die NBank rechnet selbst“ | NBank | keine Befundaussage mehr |
| B4 Grundstück/EK | 1, 7 | EK = Grundstück + bar (Restgröße); Mindest-Eigenmittel abzüglich Grundstück; Zusatz-EK als eigene Eingabe 7.1; Deckel nur für Förderbemessung; Sperre aller Renditen bei Kasse bei Bezug ≥ 1 € (E14), Status P1 | Z. 96–107, 133–149; Übersicht 1.3, 1.4, P1 | Modellhaus EK 1,449 statt 2,1 Mio. €, VOFI 5,46 statt 4,75 % (Mappenmechanik). Modellhaus mit Grundstück 2,0 Mio. € (L11): Kasse 281.900 €, Renditen „n. v.“ statt FR-03-Werten |
| B5 Restwert ohne Abschlag am Horizont | 5 | Mietpfad bis Jahr 80, Abschlag bis Zielmiete; VK-Eingabe; Restwertanteil | Sp. F, X; Z. 122–127, 149 | Tarutinoer RW J42 −734.315 / −364.936 / −233.009 €; Modellhaus A 11,90 → 10,66 Mio. € |
| B6 Preisstände gemischt | 5 | Reinertrag deflationiert mit Mietsteigerung, Abzinsung mit LZ | Z. 122–123 | mit B5 zusammen: Wert bei Bezug nach Abschlag Tarutinoer A −38,7 % statt −15,3 % |
| B7 Vorlaufzeit im Exponenten | 4 | teilweise (Vorgabe 6): Exponent-Zuschlag entfällt, T0 = Bezugsfertigkeit, KG 800 Eingabe; eine datierte Bauphase gibt es nicht. Restverzerrung: alle Renditen eher zu hoch, weil Herstellungskosten und Eigenkapital vor Bezug abfließen (Eigenkapital 1 Jahr vor Bezug, Modellhaus A, J42 mit Restwert: EK-IRR 5,74 statt 5,90 %, −0,16 Pp; VOFI 5,38 statt 5,52 %, −0,13 Pp, ungerundet 5,3834 gegen 5,5151 %; kennzahlen-konzept 2.5); VKB der Bauphase ab Auszahlung (RL Nr. 12.7.1) rund 8.400 / 12.600 / 14.700 € (PRUEFBERICHT B7) nicht angesetzt; Hinweis 4 nennt beides ohne Zahlen (Runde 2 R5, FL2) | Z. 143, Hinweis 4 | gegenüber v2-1: Tarutinoer VOFI +0,39 Pp; Modellhaus +0,33 Pp; Restwirkung siehe links |
| B8 Kostenstand | 10 | Eingabe 5.5 „Kostensätze 2026 fortschreiben um“ Jahre (0 = Stand 2026 gilt unverändert in Jahr 1 = 2028), Hinweis 5, Übersicht C31/C32 fortgeschriebener Satz mit Bemerkung „Satz 2026, fortgeschrieben laut Eingabe 5.5“ | Sp. I, J | bei 5.5 = 2: Modellhaus ZÜ J1 −656 / −19.606 / −27.435 €, EK-IRR −0,06 Pp |
| B9 Entnahmen | 8 | entfällt (nur Thesaurierung) | – | 0 |
| B10 Frei, obere Kante | 9 | entfällt | – | – |
| B11 Wertüberschuss nur vor Abschlag | 7 | Hauptzeile nach Abschlag, vor Abschlag nachrichtlich | Z. 128–129 („Ertragswert Bestand/Zielmiete gegenüber Gesamtkosten“), Übersicht 7.4/7.8 | Modellhaus A −54,7 % (vor Abschlag −10,4 %) |

G-Befunde: G1 → NBank N17–N20 (Barwertvorteil); G2 → beide Horizonte je Kennzahl; G3 → keine Stichtage vor J35; G4 → 3.4 mit Stand in der Quelle; G5 → eigene Frei-Reihe; G6 → feste Horizonte; G7 → Prüfblock P1–P6 und F13; G8 → DSCR erst ab 1 € Kapitaldienst; G9 → ICR entfällt; G10 → ein Mietausfall; G11 → keine Formeln in Eingabezellen, Kostenkennwert je m² (2.1), Banklaufzeit (6.4), EK als Restgröße plus 7.1, keine Eingabe mit mehr als 2 sichtbaren Nachkommastellen beim Modellhaus; G12 → Frei-Spalte vollständig.

### E.3 Überleitung v2-1 → v3, Tarutinoer (aus RR, Schritte kumulativ)

| Schritt | VOFI-EK mit RW J42 A / B / C | EK-IRR mit RW J42 A / B / C | VOFI ohne RW J42 A / B / C |
|---|---|---|---|
| 0 v2-1 (Cache) | 6,376 / 6,440 / 6,494 % | 7,924 / 7,930 / 8,021 % | 3,345 / 3,563 / 3,737 % |
| 1 EK ohne Doppelzählung (B4) | unverändert (Grundstück 0) | unverändert | unverändert |
| 2 Vorlaufzeit nicht im Exponenten (B7) | 6,768 / 6,836 / 6,894 % | unverändert | 3,548 / 3,779 / 3,964 % |
| 3 Entgelte aus Eigenkapital | 6,697 / 6,760 / 6,814 % | 7,877 / 7,881 / 7,970 % | 3,520 / 3,743 / 3,923 % |
| 4 Restwert mit Abschlag bis Zielmiete (B5/B6) = v3 | **6,489 / 6,661 / 6,753 %** | **7,683 / 7,790 / 7,914 %** | 3,520 / 3,743 / 3,923 % |

Modellhaus (PRUEFBERICHT 4.2): VOFI A 4,75 → 5,46 → 5,79 → 5,73 → **5,52 %**; EK-IRR A 6,11 → 6,14 → 6,14 → 6,11 → **5,90 %**. Rundung 4.3/4.4 (A7) ändert diese Werte nicht.

### E.4 Best/Worst aus v2-1 für die Änderungsübersicht

| Treiber v2-1 | Best | Basis | Worst | in v3 eintragen |
|---|---|---|---|---|
| Herstellungskosten KG 200–700 | 2.815.241 € | 2.963.412 € | 3.407.924 € | 9.1: 0,95 / 1,00 / 1,15 |
| Mietniveau (beide Anker) | 1,05 | 1,00 | 0,95 | 9.2 |
| Kostensteigerung | 1,5 % | 2,0 % | 2,5 % | 5.4: 1,5 / 2,0 / 2,5 % |
| Zuschlag Liegenschaftszins | −0,3 Pp | 0 | +0,6 Pp | 9.3 |
| Laufzeit NBank-Darlehen | 40 J. | 40 J. | 33 J. | 3.1: 2,50 / 2,50 / 3,03 % |
| Anschlusszins Bank | 2,74 % | 3,74 % | 4,74 % | 6.3 |

Ablage: `/home/user/NBank/vofi/AENDERUNGEN.md` Abschnitt 7 (Kundenfassung, Abschluss 09.11.2026). Sie ersetzt das interne `AENDERUNGSPROTOKOLL-v3.md` aus Runde 1; dessen Inhalt steht vollständig in B.2, C, D.2, D.2a, E, F.4, K und L. Die Best/Worst-Werte stehen zusätzlich kurz in der Quellenspalte der Eingaben 3.1, 5.4, 6.3, 9.1, 9.2 und 9.3 („Vorgängermappe Best … , Worst …“).

---

## F. Prüfblock und Abnahme

### F.1 Prüfblock auf der Übersicht (Z. 109–114, sichtbar, Status C: „OK“ oder „prüfen“)

Nur Zustände, die ein falsches oder unzulässiges Ergebnis anzeigen und anschlagen können. Bedingung jeweils für alle drei Blätter x. Statusformel: `=IFERROR(IF(<Bedingung>,"OK","prüfen"),"prüfen")` (ein Fehlerwert ergibt „prüfen“, Runde 2 R1); Gesamtstatus D3 „OK“ nur, wenn alle sechs „OK“ zeigen.

| Nr. | Zeile | Prüfung (B) | Formelkern |
|---|---|---|---|
| P1 | 109 | Keine Überfinanzierung bei Bezug | `x!H105 < 1`; Kasse A/B/C in D109:F109 |
| P2 | 110 | Auswahlfelder 4.1, 4.2 und 8.2 gültig | `AND(COUNTIF(Mietenstufen,Mietenstufe)=1,OR(Effizienz_EH40="ja",Effizienz_EH40="nein"),OR(Zielmiete="Marktmiete",Zielmiete="Vergleichsmiete"))` (Einfügen umgeht die Datenüberprüfung; Runde 2 R3 ersetzt die frühere P2 „Eigenmittel mind. 20 %“, die wegen H102 nie anschlagen konnte) |
| P3 | 111 | Bank: Anfangstilgung mind. 1 % (RL Nr. 5.3.6) | `OR(x!H103<1,x!H113>=Tilgung_Bank_min-0.00005)` |
| P4 | 112 | Renditen mit Restwert berechnet | `COUNT(x!I z:J z)=2` für z = 133, 136, 140, 143, 175 und A, B, C sowie `COUNT('Frei finanziert'!I136:J136)=2` (Zahlen verlangt; „n. v.“ und Fehlerwerte schlagen an) |
| P5 | 113 | Gebäudeanteil am Restwert positiv | `MIN(x!I125:J125,'Frei finanziert'!I125:J125) > 0` |
| P6 | 114 | Eingaben vollständig | `IF(Projekt_Nr=1,SUMPRODUCT((LEN(Eingaben!$A$7:$A$51)>0)*(LEN(Eingaben!$D$7:$D$51)=0)),SUMPRODUCT((LEN(Eingaben!$A$7:$A$51)>0)*(LEN(Eingaben!$E$7:$E$51)=0))) = 0` |

Bedingte Formatierung „prüfen“: Schrift rot fett, Füllung `FCE4E4` (C109:C114 und D3). Erwartung beide Projekte, Standard: alle „OK“. Zulässige Sonderfälle sind keine Prüfungen, sondern Beträge: Herstellung über Bemessungsgrenze (1.3), Grundstück über Deckel (1.4), Schlussrate NBank (3.10), Restschuld Bank Jahr 42 (3.11). Die Eigenmittelquote steht als Anzeige in 1.12. Ein Sollstand im Projektkonto (Modellhaus B/C, Jahr 1–9) ist ein Ergebnis, kein Prüffehler; er steht in Übersicht 3.6/3.7. Den Tilgungsaufschub begrenzt die Datenüberprüfung 3.2 (0 bis `Aufschub_max`).

### F.2 Abnahme `pruefe_vofi.py` (läuft grün = alle Punkte erfüllt)

| Nr. | Kriterium | Verfahren |
|---|---|---|
| F1 | v2-1 unverändert | SHA-256 beginnt `11d558b3` |
| F2 | recalc | `status = success`, `total_errors = 0`, für jeden Testlauf F7 |
| F3 | Struktur | 9 Blätter in der Reihenfolge A; keine Makros, keine externen Verknüpfungen; verbundene Zellen nur in Zeile 1; 64 Namen, alle Eingabe-Namen zeigen auf `Eingaben!$F$7:$F$51`, `Projekt_Nr` = D3, `Aktives_Projekt` = F4, `Projektliste` = D4:E4; keine Funktionen XLOOKUP, XMATCH, LET, LAMBDA, FILTER, SORT, UNIQUE, SEQUENCE, OFFSET, INDIRECT, HYPERLINK; Zellhyperlinks mit Sprungziel vorhanden (Übersicht B3 → A108, H2, D6:K6; Eingaben G3; Gefördert H2:M2; Frei I2:L2; NBank I1; Tabellen G1; Hinweise C1); kein Zirkelbezug |
| F4 | Formeln einheitlich | je Zeitreihenspalte Zeilen 7 … Ende R1C1-gleich (Y–AS ab Zeile 6); Blätter Gefördert A/B/C zellgleich außer A1 und B2; Zahlenkonstanten in Formeln nur 0, 1, 2 (ROUND, COUNT), 10 (Jahr 10), 12 (Monate), 0,03 und 0,1/0,3/0,5/0,6/0,7 (IRR-Startwerte E10), 0,05 (zweiter Versuch), 0,0001 (Barwert-Test) und 0,00005 (Toleranz P3); konstante Zahlen in Zellen außerhalb von Eingaben und Tabellen nur A6, W6, H118 (je 0) und die Rasterwerte Übersicht B55:B61 außer B59 (schwarz, feste Hilfswerte) |
| F5 | Gestaltung | Arial 10 (Titel 14); Eingabezellen D/E der Eingabezeilen 7–51, D3, D4 und E4 Schrift `0000FF`, Füllung `FFF2CC`; Spalte F Füllung `EDEDED`; reine Blattverweise grün `008000`; Kopfzeilen `8B2939`/weiß; Druck A4 quer, `fitToWidth` 1, Fußzeile `&A` / `Seite &P von &N`, Druckbereiche und Wiederholungen laut G.4 (Reihenfolge mehrteiliger Bereiche aus `workbook.xml`); keine doppelten definierten Namen; Fixierung laut A; Gliederung laut B.1, D.3, D.4 und D.5; Dokumenteigenschaften Autor „PGN“, Titel „VOFI Mietwohnraum 2026“, Sprache de-DE; `summaryBelow = 0` und `fullCalcOnLoad`: fehlen sie, weil die Mappe nach `build_vofi.py` erneut mit `recalc.py` gespeichert wurde, meldet das Skript einen HINWEIS (Abhilfe `build_vofi.py --nachbearbeiten MAPPE`) |
| F6 | Sprache | Bezeichnungen ≤ 45 Zeichen, Quellen ≤ 60, keine Zelle > 120 außer Hinweise; Hinweise ≤ 15 Zeilen; ohne „!“, „ACHTUNG“, „Wichtig:“, „Safe Harbour“, „eingehalten“, „bitte“, „unbedingt“, Emojis; Quellenspalten ohne Zelladressen (Muster `[A-Z]+[0-9]+!` bzw. `![A-Z]+[0-9]+`) und ohne Fakt-IDs (`F[0-9]{3}`, `G[0-9]-[0-9]{2}`); „Verwaltungskostenbeitrag“ (nicht „-betrag“) |
| F7 | Testläufe | Kopie, Eingaben setzen (beide Spalten des aktiven Projekts bleiben getrennt; gesetzt wird die Spalte des aktiven Projekts), recalc, lesen; Läufe siehe Tabelle F.2a |
| F8 | Sollwerte gegen RR | RR wird importiert, Werte nicht abgeschrieben. Modellhaus: `parameter_broschuere(A)` mit `P['ovm_start'] = 12,92`, `P['markt_start'] = 14,48`; Tarutinoer: `parameter_referenzprojekt(A)`; Overrides laut F.2a, nach Änderung von Mengen, Kosten, Kostensätzen, Grundstück, Bodenrichtwert, Mietenstufe oder Effizienz `finalisiere(P)`. Bankpfad (A3, nur bei Lücke > 0): `Lauf(P2, g, ek_modell=True)` mit `P2['eigenmittel_quote'] = (BE_g + max(0, 20 % × zuw − Grundstück) + EK_Zusatz + KG 800) / zuw`; das ergibt Bank = Lücke, bares EK = Entgelte + KG 800 + Mindest-EM in Geld + Zusatz-EK, Kasse 0. Verglichen werden: Förderbeträge, Bank, EK, Förderbarwert, Jahresrechnung Jahr 1–3, Liquidität Block 3, alle Renditen J35/J42 (auch nach Förderbarwert), Restwert Block 7, NBank-Lage. IRR (Runde 2): Soll ist der Wert der RR, bei einer Nullstelle diese, bei mehreren die größte mit fallendem Barwert (kennzahlen-konzept 3.3), Toleranz unten. „n. v.“ ist nur zulässig, wenn die RR keinen Wert hat oder der Wert unter −69 % liegt (K.2 R1); hat die RR-Reihe im Raster −90 … 100 % keine Nullstelle, darf Excel eine Nullstelle außerhalb zeigen (Barwert auf der RR-Reihe unter 1 €). Die NBank-Lage folgt aus dem RR-Wert. Restwert J35 nur vergleichen, wenn A2 nicht greift (RR-Mietpfad Jahr 36–42 mit Obergrenze Vergleichsmiete gleich dem zur Zielmiete) |
| F9 | Broschüre | L1 gegen die Zahlen aus `content/pages/10-…json`, `11-…json`, `12-…json` (zur Laufzeit gelesen, Zuordnung F.2b), gerundet auf die dort gezeigte Stelle; L10 gegen die Sensitivität S. 10. Später dasselbe für die Präsentation (O9) |
| F10 | v2-1 | L2: Tabelle F.4, Spalte „gleich“ auf 0,01 €; Spalte „Δ“ auf 0,01 € |
| F11 | B4/A3 | L3, L4, L5, L9 laut F.5 |
| F12 | Restfinanzierung, Sperre | L10 und L11 laut F.5 |
| F13 | Identitäten (nur Prüfskript) | für L1, L2 und alle Läufe aus F.2a: NBank-Darlehen vollständig getilgt (`ABS(x!H163-x!H99) < 1`); Ertragswert gefördert = frei bei Zielmiete Marktmiete (`ABS('Gefördert A'!J122-'Frei finanziert'!J122) < 1`); Tilgungsvergleich = Jahresrechnung bei Aufschub 0 (`ABS(Übersicht!D62-Übersicht!D38) < 1`, E, F); Rechenweg S. 12 geht auf (4.13 − 4.14 − 4.15 = 4.16, E und F); Zeitachse passt (`Laufzeit_max = 42`, `GND ≤ 80`, Zeile 48 = t 42, Zeile 86 = t 80); Bankdarlehen bei Laufzeit ≤ 42 bis Ende Laufzeit getilgt (`INDEX(U, Laufzeit_Bank+1) < 1`); Kasse = 0 bei P1 „OK“ (C109) |

Toleranzen: Beträge ≤ 1 € (Jahresrechnung, Förderbeträge ≤ 0,01 €); Renditen und Sätze ≤ 0,0001 (0,01 Pp); DSCR ≤ 0,001; Zählwerte exakt; Text exakt.

**F.2a Testläufe** (je Lauf eine Eingabe abseits des Standards, sonst Standard; „RR“ = Vergleich nach F8)

| Lauf | Projekt | Eingabe | RR-Aufruf | geprüft |
|---|---|---|---|---|
| L1 | Modellhaus | Standard | `P` wie F8 | alles, F.3, F9 |
| L2 | Tarutinoer | Standard | `parameter_referenzprojekt` | alles, F.4 |
| L3 | Tarutinoer | 2.3 = 354.120 (= Deckel) | `grundstueck` | alles, F.5 |
| L4 | Tarutinoer | 2.3 = 731.325 | Bankpfad | alles, F.5, D.2a |
| L5 | Tarutinoer | wie L4, 7.1 = 309.386,40 | `grundstueck`, SAUBER | alles, F.5 |
| L6 | Tarutinoer | wie L4, 6.1 = 4,5 %, 6.2 = 15, 6.3 = 5,5 % | Bankpfad, `zins_bank`, `zinsbindung`, `zins_anschluss` | alles |
| L7 | Tarutinoer | wie L4, 6.4 = 25 | geschlossen | H111 = PMT(3,74 %, 25, Bank); Restschuld Bank Ende Jahr 25 < 1 €; P3 „OK“ |
| L8 | Tarutinoer | wie L4, 6.1 = 5 %, 6.3 = 5 %, 6.4 = 42 | geschlossen | H113 = 0,74 %; P3 „prüfen“; D3 „prüfen“ |
| L9 | Tarutinoer | 2.3 = 731.325, 2.4 = 0 | `grundstueck`, `brw=None` | alles; Bank 0 |
| L10 | Modellhaus | 2.1 = 5.200 | Bankpfad, `herstellung` | F.5, Broschüre S. 10 Sensitivität |
| L11 | Modellhaus | 2.3 = 2.000.000 | `grundstueck` (nur Kasse) | F.5: Sperre |
| L12 | Modellhaus | 2.2 = 100.000 | `kg800` (EK-Ebene); Objekt-IRR = L1 (A1) | alles außer Objekt-IRR gegen RR |
| L13 | Modellhaus | 1.1 = 2030 | wie L1 | alle Ergebnisse = L1 |
| L14 | Modellhaus | 1.2 = 1.000, 1.3 = 15 | `wfl`, `we`, `herstellung = 4.500 × wfl` | alles |
| L15 | Modellhaus | 3.1 = 1/33 | `tilgungssatz=1/33` | alles |
| L16 | Modellhaus | 3.2 = 2 | `tilgungsfrei=2`, `tilgungssatz=0,025` (A8) | alles |
| L17 | Modellhaus | 3.3 = 5,0 % | `zins_ab36` | alles |
| L18 | Modellhaus | 3.4 = 4,60 % | `swap` | NBank-Lage gegen RR (VOFI J42 „unter“, übrige mit RW „über“; Abstand ≥ 0,018 Pp) |
| L19 | Modellhaus | 4.1 = II | `mietenstufe` | alles |
| L20 | Modellhaus | 4.2 = ja | `effizienz="EH 40"` | alles |
| L21 | Modellhaus | 4.3 = 12,00 | `ovm_start` | alles |
| L22 | Modellhaus | 4.4 = 16,00 | `markt_start` | alles |
| L23 | Modellhaus | 4.5 = 2,5 % | `miet_wachstum` | alles (bei 1,5 % griffe A2) |
| L24 | Modellhaus | 4.6 = 15 % | `kapp_norm`, `kapp_ang` | alles |
| L25 | Modellhaus | 5.1 = 4,0 % | `mietausfall`, `mietausfall_frei` | alles |
| L26 | Modellhaus | 5.2 = 400 | `verwaltung_we` | alles |
| L27 | Modellhaus | 5.3 = 18,00 | `instandhaltung_qm` | alles |
| L28 | Modellhaus | 5.4 = 2,5 % | `kosten_wachstum` | alles |
| L29 | Modellhaus | 5.5 = 2 | `kosten_offset=2` | alles |
| L30 | Modellhaus | 7.2 = 3,0 % | `haben` | alles |
| L31 | Modellhaus | 7.3 = 7,0 % | `soll` | alles |
| L32 | Modellhaus | 8.1 = 1,0 % | `bodenwert_wachstum` | alles |
| L33 | Modellhaus | 8.2 = Vergleichsmiete | `zielmiete="ovm"` | alles |
| L34 | Modellhaus | 8.3 = 5 % | `vk=0,05` | alles |
| L35 | Modellhaus | 9.1 = 1,10 | `herstellung × 1,10` | alles |
| L36 | Modellhaus | 9.2 = 0,95 | `ovm_start`, `markt_start` × 0,95 | alles |
| L37 | Modellhaus | 9.3 = +0,5 Pp | `lz_delta=0,005` | alles |
| L38 | Modellhaus | 9.4 = 0,50 | `rw_faktor=0,5` | alles |
| L39 | Modellhaus | 2.1 = 6.000 (Bank 1,4 Mio. €) | Bankpfad, `herstellung` | alles; EK-IRR nur Bodenwert J35 C eine Nullstelle −5,30 % (Kaskade, R1) |
| L40 | Modellhaus | 9.1 = 2,0 | Bankpfad, `herstellung × 2` | alles; EK-IRR nur Bodenwert J35/J42 A −12,49 / −5,06 %, ohne Restwert J42 A −8,46 %; VOFI mit Restwert „n. v.“ → P4 „prüfen“, Restwertanteil „n. v.“ (R3) |
| L41 | Modellhaus | 4.5 = −5 % | `miet_wachstum` | alles (A2 greift, J35 nicht gegen RR); Frei Objekt-IRR mit Restwert ohne Nullstelle → „n. v.“ statt −199,50 % (R2); Frei ohne Restwert J35 −8,44 % (größte fallende Nullstelle, Runde 2 R2) |
| L42 | Modellhaus | 4.1 = „VIII“ (per Einfügen, ohne Datenüberprüfung) | keiner (Fehlerlauf) | recalc meldet Fehlerwerte; D3 und P1–P5 „prüfen“, P6 „OK“; NBank G11:I24 „prüfen“ (Runde 2 R1) |

Damit läuft jede der 37 Eingaben mindestens einmal abseits des Standards gegen die RR oder eine geschlossene Rechnung. Grenze der Kaskade: Nullstellen unter etwa −70 % findet `IRR` in LibreOffice nicht zuverlässig (Lauf mit 5.4 = 10 %: −72 … −95 %); die Mappe zeigt dann „n. v.“ (Hinweis 11), F8 lässt das unter −69 % zu. Vorab geprüft (RR): In keinem Lauf greift A2; „EK-IRR ohne RW, J35“ ist in fast allen Läufen mehrdeutig oder ohne Nullstelle, Tarutinoer zusätzlich „ohne Geb.-RW, J35“; dafür gilt die Nullstellenregel F8.

**F.2b Zuordnung Broschüre → Excel (L1, F9)**

| Datei, Feld | Excel |
|---|---|
| 10: Chart „Finanzierung“ `segments` Darlehen/Zuschuss/Eigenmittel (Mio. €), `bracket` 5,6 / „80 %“ | Übersicht D13, D14, D19 (÷ 10⁶, 1 Stelle); D15, D16 |
| 10: `table.rows` 1–4 (6.300.000 / 700.000 / 7.000.000 / 1.400.000) | 'Gefördert A'!H90, H92; Übersicht D10, D19 |
| 10: `key_figures` 140.000 / 70.000 | Übersicht D24, D25 (sichtbar) |
| 10: Wasserfall 7,98 / 7,70 / 0,28 / 6,16 / „1,54 + 0,28“ / 77,2 % (L10) | Übersicht D9, D10, D11 (sichtbar), D15, D19 + D18, D16 |
| 11: Chart `series` Darlehen/Zuschuss/Eigenmittel A/B/C, `totals` 5,6 | Übersicht D13:F13, D14:F14, D19:F19, D15:F15 |
| 11: `table.rows` 1–8 und `aside_row` | Übersicht D29:F39 (Zeile 37 = 0) |
| 12: `calculation.A_B_C` (Mio., €/m², € p. a.) | Übersicht D13:F14, D26:F26, D29:F30, D34:F34, D36:F36, D38:F38, D21:F21 |
| 12: `series` B/C `before_repayment`, `extra_debt`, `threshold`, `at_2_5`, `per_percentage_point`, `check` 1,38 % | Übersicht E70/F70, E66/F66 (= E13−D13), E63/F64, E71/F71 (= E60−D60), −(E13−D13)/100, F65 |
| 12: `table.rows` Mehrschuld, Mehr-Sollmiete, Mietausfall, VKB, Mehrüberschuss, Schwelle; `aside_row` | Übersicht Zeilen 66, 67, 68, 69, 70 (E/F, Zeile für Zeile), 63/64; Einmalzeile 72 |
| 12: Rasterzeilen „höchster Überschuss“ | Übersicht B55:B62 (Tilgungssatz), G55:G62 |

### F.3 Sollwerte Modellhaus (aktiv, Standard)

**(a) Broschüre S. 10–12** (Übersicht)

| Größe | Zelle | A | B | C |
|---|---|---:|---:|---:|
| Gesamtkosten | D9:F9 | 7.000.000 | 7.000.000 | 7.000.000 |
| Zuwendungsfähige Kosten | D10:F10 | 7.000.000 | 7.000.000 | 7.000.000 |
| Herstellung über Bemessungsgrenze / Grundstück über Deckel | D11:F12 | 0 / 0 | 0 / 0 | 0 / 0 |
| NBank-Darlehen | D13:F13 | 2.800.000 | 4.200.000 | 4.900.000 |
| Zuschuss | D14:F14 | 2.800.000 | 1.400.000 | 700.000 |
| Förderung gesamt / Förderquote | D15:F16 | 5.600.000 / 80,0 % | 5.600.000 / 80,0 % | 5.600.000 / 80,0 % |
| Förderbarwert (Zuschuss + Barwertvorteil) | D17:F17 | 3.918.544,27 | 3.098.816,40 | 2.688.952,47 |
| Bankdarlehen | D18:F18 | 0 | 0 | 0 |
| Eigenmittel (RL Nr. 5.2.6) | D19:F19 | 1.400.000 | 1.400.000 | 1.400.000 |
| Eigenmittelquote | D20:F20 | 20,0 % | 20,0 % | 20,0 % |
| Bearbeitungsentgelte | D21:F21 | 49.000 | 52.500 | 54.250 |
| Eigenkapital / davon bar | D22:F23 | 1.449.000 / 749.000 | 1.452.500 / 752.500 | 1.454.250 / 754.250 |
| Zuschuss je Wohnung / Eigenmittel je Wohnung | D24:F25 | 140.000 / 70.000 | 70.000 / 70.000 | 35.000 / 70.000 |
| Miete Jahr 1 | D26:F26 | 6,80 | 8,20 | 9,00 |
| 1 Sollmiete | D29:F29 | 114.240,00 | 137.760,00 | 151.200,00 |
| − Mietausfall | D30:F30 | 2.284,80 | 2.755,20 | 3.024,00 |
| 2 − Objektverwaltung | D31:F31 | 7.340,00 | 7.340,00 | 7.340,00 |
| 3 − Instandhaltung | D32:F32 | 20.160,00 | 20.160,00 | 20.160,00 |
| 4 = Überschuss vor Kapitaldienst | D33:F33 | 84.455,20 | 107.504,80 | 120.676,00 |
| 5 − Verwaltungskostenbeitrag | D34:F34 | 14.000,00 | 21.000,00 | 24.500,00 |
| 6 − Zins | D35:F35 | 0 | 0 | 0 |
| 7 − Tilgung | D36:F36 | 70.000,00 | 105.000,00 | 122.500,00 |
| − Kapitaldienst Bank | D37:F37 | 0 | 0 | 0 |
| 8 = Zahlungsüberschuss p. a. (Anzeige) | D38:F38 | 455,20 (455) | −18.495,20 (−18.495) | −26.324,00 (−26.324) |
| Einmalig: Bearbeitungsentgelte | D39:F39 | 49.000 | 52.500 | 54.250 |
| Tilgungsschwelle gegenüber A | E63, F64 | – | 1,1464 % (1,15 %) | 1,2248 % (1,22 %) |
| Tilgungsschwelle C gegenüber B | F65 | – | – | 1,3816 % (1,38 %) |
| Mehrschuld gegenüber A | E66, F66 | – | 1.400.000 | 2.100.000 |
| Mehr-Sollmiete p. a. / − Mietausfall / − Verwaltungskostenbeitrag | E67:F69 | – | 23.520,00 / 470,40 / 7.000,00 | 36.960,00 / 739,20 / 10.500,00 |
| = Mehrüberschuss vor Tilgung gegenüber A | E70, F70 | – | 16.049,60 (16.050) | 25.720,80 (25.721) |
| Mehrüberschuss bei Tilgung laut Eingabe 3.1 (2,50 %) | E71, F71 | – | −18.950,40 (−18.950) | −26.779,20 (−26.779) |
| Einmalig: Mehr an Bearbeitungsentgelten | E72, F72 | – | 3.500 | 5.250 |

**(b) Liquidität, Tilgungsvergleich**

| Größe | A | B | C |
|---|---:|---:|---:|
| ZÜ Jahr 2 / 3 (Zeitreihe R8, R9) | 255,20 / 44,20 | −18.520,20 / −18.556,20 | −26.261,50 / −26.210,00 |
| ZÜ Jahr 10 / 35 / 42 | 20.192,26 / 89.837,47 / 248.897,22 | 7.336,41 / 98.228,43 / 312.892,19 | 2.877,71 / 105.598,26 / 349.460,75 |
| DSCR Jahr 1 / Minimum 1–35 | 1,0054 / 1,0005 | 0,8532 / 0,8515 | 0,8209 / 0,8202 |
| Jahre mit Fehlbetrag / größter kum. Fehlbetrag | 0 / 0 | 9 / −92.052,06 | 9 / −151.921,55 |
| Break-even-Tilgung | 2,5163 % | 2,0596 % | 1,9628 % |
| Restschuld NBank Ende Jahr 35 | 350.000 | 525.000 | 612.500 |
| Schlussrate NBank über Regelrate / Restschuld Bank Jahr 42 | 0 / 0 | 0 / 0 | 0 / 0 |
| ZÜ J1 bei 0,00 % (vor Tilgung) | 70.455,20 | 86.504,80 | 96.176,00 |
| ZÜ J1 bei 1,00 / 1,50 % | 42.455,20 / 28.455,20 | 44.504,80 / 23.504,80 | 47.176,00 / 22.676,00 |
| ZÜ J1 bei 2,00 / 2,381 / 2,50 % | 14.455,20 / 3.788,53 / 455,20 | 2.504,80 / −13.495,20 / −18.495,20 | −1.824,00 / −20.490,67 / −26.324,00 |
| ZÜ J1 bei 3,00 % | −13.544,80 | −39.495,20 | −50.824,00 |
| höchster Überschuss (G55:G62) | C bei 0,00 und 1,00 %; A ab 1,50 % | | |

**(c) Renditen und Restwert (RR mit 4.3/4.4 = 12,92/14,48, A7), Jahr 35 / Jahr 42** (Übersicht: 5.1–5.10 Zeilen 76–85 in der Reihenfolge D.5; 6.1–6.7 Zeilen 89–95 in der Reihenfolge EK-IRR mit / nur Boden, VOFI mit / nur Boden, Restwertanteil, EK-IRR ohne, VOFI ohne; 7.1–7.8 Zeilen 99–106. „n. FBW“ = nach Förderbarwert; „n. Z.“ = nach Zuschuss, „brutto“ = ohne Zuschuss, RW = Restwert, ohne Geb.-RW = nur Bodenwert. Nettoanfangsrendite frei nur auf dem Blatt Frei H139, nicht auf der Übersicht.)

| Kennzahl | A | B | C | Frei |
|---|---:|---:|---:|---:|
| Objekt-IRR n. FBW, mit RW | 5,3570 / 5,3210 % | 5,0760 / 5,0695 % | 4,9959 / 4,9968 % | 4,6281 / 4,6577 % |
| Objekt-IRR n. FBW, ohne Geb.-RW | 2,5173 / 3,2253 % | 2,3706 / 3,1369 % | 2,3783 / 3,1623 % | 2,6025 / 3,3191 % |
| Objekt-IRR n. FBW, ohne RW | 1,5268 / 2,6379 % | 1,5636 / 2,6616 % | 1,6529 / 2,7369 % | 2,1896 / 3,0659 % |
| Objekt-IRR n. Z., mit RW | 4,0390 / 4,1558 % | 3,5459 / 3,7124 % | 3,3827 / 3,5627 % | 4,6281 / 4,6577 % |
| Objekt-IRR n. Z., ohne Geb.-RW | 1,0089 / 1,8793 % | 0,6148 / 1,5732 % | 0,5254 / 1,5129 % | 2,6025 / 3,3191 % |
| Objekt-IRR n. Z., ohne RW | −0,1143 / 1,2010 % | −0,3215 / 1,0105 % | −0,3249 / 1,0036 % | 2,1896 / 3,0659 % |
| Objekt-IRR brutto, mit RW | 2,1152 / 2,4771 % | 2,6804 / 2,9528 % | 2,9667 / 3,1962 % | 4,6281 / 4,6577 % |
| Objekt-IRR brutto, ohne Geb.-RW | −1,1493 / −0,0253 % | −0,3649 / 0,7078 % | 0,0527 / 1,0951 % | 2,6025 / 3,3191 % |
| Objekt-IRR brutto, ohne RW | −2,4606 / −0,8327 % | −1,3737 / 0,0960 % | −0,8297 / 0,5641 % | 2,1896 / 3,0659 % |
| Nettoanfangsrendite Jahr 1 | 1,2065 % | 1,5358 % | 1,7239 % | 3,0128 % |
| EK-IRR, mit RW | 6,0348 / 5,8983 % | 5,8463 / 5,7305 % | 5,8121 / 5,6997 % | – |
| EK-IRR, ohne Geb.-RW | 1,5306 / 2,9175 % | 0,7192 / 2,6385 % | 0,4698 / 2,6260 % | – |
| EK-IRR, ohne RW (J35 mehrdeutig) | −1,5014 / 1,8157 % | −3,6394 / 1,5663 % | −4,6876 / 1,6054 % | – |
| VOFI-EK, mit RW | 5,7242 / 5,5151 % | 5,7514 / 5,5578 % | 5,7730 / 5,5821 % | – |
| VOFI-EK, ohne Geb.-RW | 1,6313 / 2,7146 % | 0,7574 / 2,5071 % | 0,3234 / 2,4626 % | – |
| VOFI-EK, ohne RW | −0,1514 / 1,8697 % | −2,0134 / 1,5760 % | −3,2989 / 1,5125 % | – |
| Restwertanteil am Endvermögen | 86,48 / 77,16 % | 93,07 / 80,11 % | 95,67 / 80,81 % | – |
| Bodenwert | 1.178.716,92 / 1.308.192,98 | gleich | gleich | gleich |
| Ertragswert Bestand (= RW mit) | 8.792.243,99 / 10.657.902,45 | 9.570.534,13 / 11.282.394,83 | 9.919.955,64 / 11.505.426,09 | 11.056.129,02 / 11.899.358,54 |
| Abschlag Bestandsmiete unter Zielmiete | 2.263.885,03 / 1.241.456,10 | 1.485.594,88 / 616.963,72 | 1.136.173,37 / 393.932,45 | leer (Frei: Dublette entfällt) |
| Liegenschaftszins | 2,80 / 2,70 % | gleich | gleich | gleich |
| Ertragswert Bestand / Zielmiete gegenüber Gesamtkosten, Bezug | −54,68 / −10,39 % | −45,96 / −10,39 % | −41,21 / −10,39 % | −10,39 % (nur 7.4) |
| NBank: Lage mit RW (N4–N7) | über | über | über | – |
| NBank: Lage ohne Geb.-RW, ohne RW (N8–N15) | unter | unter | unter | – |
| NBank: Barwertvorteil / Ausgleichsleistung | 1.139.544,27 / 3.918.544,27 | 1.709.316,40 / 3.098.816,40 | 1.994.202,47 / 2.688.952,47 | – |

Gegen PRUEFBERICHT 4.2 (2 Stellen) unverändert; gegen die RR mit vollen Mietwerten weichen die Renditen höchstens 0,0002 Pp ab, der Restwert höchstens 318 €.

### F.4 Tarutinoer (aktiv, Standard) gegen v2-1-Cache

| Größe | v2-1 Zelle | v2-1 A / B / C | v3 A / B / C | Bewertung |
|---|---|---|---|---|
| NBank-Darlehen | Basisdaten!C61/C65/C69 | 1.185.364,80 / 1.778.047,20 / 2.074.388,40 | gleich | gleich |
| Zuschuss | Basisdaten!C63/C67/C71 | 1.185.364,80 / 592.682,40 / 296.341,20 | gleich | gleich |
| Bearbeitungsentgelte | Basisdaten!C64/C68/C72 | 20.743,88 / 22.225,59 / 22.966,44 | gleich | gleich |
| Tilgungsrate | Basisdaten!C62/C66/C70 | 29.634,12 / 44.451,18 / 51.859,71 | gleich | gleich |
| Sollmiete J1 | Gefoerdert_*!F7 | 67.564,80 / 81.475,20 / 89.424,00 | gleich | gleich |
| Bewirtschaftung inkl. Mietausfall J1 | Gefoerdert_*!G7 | 18.412,50 / 18.690,70 / 18.849,68 | −(H7+I7+J7) gleich | gleich |
| Reinertrag J1 | Gefoerdert_*!H7 | 49.152,30 / 62.784,50 / 70.574,32 | gleich | gleich |
| VKB J1 | Gefoerdert_*!K7 | 5.926,82 / 8.890,24 / 10.371,94 | gleich | gleich |
| Ertragswert Marktmiete Bezug / J35 / J42 | Gefoerdert_A!AC6 / AC41 / AC48 | 3.650.346,71 / 6.297.398,11 / 6.713.517,69 | Z. 122 gleich | gleich |
| Frei: Reinertrag J1 | Frei_Marktmiete!H7 | 123.938,09 | gleich | gleich |
| Nettoanfangsrendite J1 | Dashboard!C43:E43 | 1,6586 / 2,1187 / 2,3815 % | gleich | gleich |
| Wertüberschuss vor Abschlag | Dashboard!C44 | 23,18 % | gleich | gleich |
| Bankdarlehen | Basisdaten!C78/C89/C100 | 20.743,88 / 22.225,59 / 22.966,44 | 0 | Δ: Entgelte aus EK |
| Kapitaldienst Bank J1 | Gefoerdert_*!L7+M7 | 1.162,04 / 1.245,04 / 1.286,54 | 0 | Δ: dto. |
| Zahlungsüberschuss J1 | Gefoerdert_*!Q7 | 12.429,32 / 8.198,04 / 7.056,12 | 13.591,36 / 9.443,08 / 8.342,67 | Δ +1.162,04 / +1.245,04 / +1.286,54 |
| Eigenkapital | Basisdaten!C126 | 592.682,40 | 613.426,28 / 614.907,99 / 615.648,84 | Δ = Entgelte |
| DSCR J1 | Dashboard!C20:E20 | 1,3385 / 1,1502 / 1,1111 | 1,3822 / 1,1770 / 1,1341 | Δ: kein Bank-Kapitaldienst |
| Verkehrswert J35 | Gefoerdert_*!AE41 | 5.542.001,75 / 5.750.922,14 / 5.870.305,21 | 4.958.369,14 / 5.418.698,12 / 5.625.370,66 | Δ: B6 |
| Verkehrswert J42 | Bewertung!L30:L32 | 6.713.517,69 (alle) | 5.979.202,22 / 6.348.581,36 / 6.480.508,97 | Δ: B5/B6 |
| VOFI-EK mit RW J42 | Dashboard!C55:E55 | 6,376 / 6,440 / 6,494 % | 6,489 / 6,661 / 6,753 % | Überleitung E.3 |
| EK-IRR mit RW J42 | Dashboard!C58:E58 | 7,924 / 7,930 / 8,021 % | 7,683 / 7,790 / 7,914 % | Überleitung E.3 |

Weitere v3-Sollwerte Tarutinoer (RR, J35 / J42): Objekt-IRR nach Förderbarwert mit RW 6,77/6,59 % · 6,53/6,38 % · 6,48/6,34 % (Förderbarwert 1.658.894 / 1.311.867 / 1.138.353 €); Objekt-IRR n. Z. mit RW 5,31/5,28 % · 4,83/4,85 % · 4,68/4,72 %; ohne RW 1,54/2,66 % · 1,33/2,46 % · 1,34/2,46 %; brutto mit RW 3,23/3,45 % · 3,89/4,02 % · 4,23/4,31 %; Frei 6,27/6,17 %; EK-IRR ohne RW 3,03/4,66 % · 3,02/4,90 % · 3,26/5,17 %; VOFI ohne RW 2,55/3,52 % · 2,56/3,74 % · 2,70/3,92 %; Tilgungsschwellen 1,80 / 1,91 %; Break-even 3,65 / 3,03 / 2,90 %; Barwertvorteil 482.419,88 / 723.629,82 / 844.234,79 €. Ohne Grundstück sind „ohne Geb.-RW“ und „ohne RW“ gleich; „EK-IRR ohne Geb.-RW, J35“ ist dann mehrdeutig (Nullstellen A −41,3 % und 3,03 %). Lage EK-IRR ohne RW J42: „über“ (4,66–5,17 % > 4,39 %).

### F.5 Sollwerte Finanzierungsfälle

| Lauf | Größe | A | B | C |
|---|---|---:|---:|---:|
| L3 | Bank / Kasse / Eigenmittelquote | 0 / 0 / 20,0 % | 0 / 0 / 20,0 % | 0 / 0 / 20,0 % |
| L3 | Eigenkapital (= 354.120 + 2.963.412 + BE − D − Z) | 686.729,12 | 688.387,89 | 689.217,27 |
| L3 | ZÜ J1 / VOFI-EK mit RW J42 / EK-IRR mit RW J42 | 9.341,92 / 6,2004 % / 7,0575 % | 3.068,92 / 6,3374 % / 7,0573 % | 906,15 / 6,4140 % / 7,1194 % |
| L4 | Bank / bares EK (= BE) / Eigenmittelquote | 309.386,40 / 23.222,72 / 22,04 % | 309.386,40 / 24.881,49 / 22,04 % | 309.386,40 / 25.710,87 / 22,04 % |
| L4 | ZÜ J1 / DSCR J1 | −7.989,43 / 0,8602 | −14.262,43 / 0,8149 | −16.425,20 / 0,8112 |
| L4 | VOFI-EK mit RW J42 / EK-IRR mit RW J42 | 5,7568 % / 5,9112 % | 5,8831 % / 5,9723 % | 5,9607 % / 6,0488 % |
| L5 | Bank / Eigenkapital | 0 / 1.063.934,12 | 0 / 1.065.592,89 | 0 / 1.066.422,27 |
| L5 | ZÜ J1 / VOFI-EK mit RW J42 / EK-IRR mit RW J42 | 9.341,92 / 5,1727 % / 5,7016 % | 3.068,92 / 5,3065 % / 5,7662 % | 906,15 / 5,3813 % / 5,8382 % |
| L10 | Gesamtkosten / zuwendungsfähig / über Bemessungsgrenze | 7.980.000 / 7.700.000 / 280.000 | gleich | gleich |
| L10 | Förderung / Förderquote / Mindest-EM in Geld (H102) | 6.160.000 / 77,19 % (77,2 %) / 840.000 | gleich | gleich |
| L10 | Bank / Eigenmittel / Eigenkapital | 280.000 / 1.540.000 / 1.593.900 | 280.000 / 1.540.000 / 1.597.750 | 280.000 / 1.540.000 / 1.599.675 |
| L10 | ZÜ J1; P1–P6 | −23.629,97; alle „OK“ | −46.780,37 | −56.709,17 |
| L11 | Kasse bei Bezug | 281.900 | 277.750 | 275.675 |
| L11 | Status | P1 (C109), P4 (C112) und D3 „prüfen“; Kasse in Übersicht D109:F109; Gefördert A/B/C Zeilen 133–145, 149, 175–177 „n. v.“; NBank Lage „–“; Frei-Renditen Zahlen (G76/K76, G78/K78, G79/K79) | | |

---

## G. Gestaltung und Sprache

### G.1 Farben und Schrift

| Element | Schrift | Füllung | Sonstiges |
|---|---|---|---|
| Standard, Beschriftungen | Arial 10, `3C3C3B` | keine | |
| Blatttitel (Zeile 1) | Arial 14 fett, `3C3C3B` | keine | A1 über Tabellenbreite verbunden |
| Kopfzeile Tabelle | Arial 10 fett, `FFFFFF` | `8B2939` | Umbruch, vertikal mittig, Höhe 30 (Zeitreihe 42) |
| Gruppenzeile | Arial 10 fett, `3C3C3B` | `F4F3F2` | über die Tabellenbreite gefüllt |
| Eingabe (D/E, D3) | Arial 10, `0000FF` | `FFF2CC` | Rahmen dünn `D9D9D9` |
| verwendet (F) | Arial 10, `000000` | `EDEDED` | |
| Formel | Arial 10, `000000` | keine | |
| Verweis auf anderes Blatt (Formel nur aus Bezug oder Name eines anderen Blatts) | Arial 10, `008000` | keine | |
| Zellhyperlink | Arial 10, `8B2939`, unterstrichen | keine | nicht blau (Blau = Eingabe) |
| Ergebniszeilen (Zeile 4 und 8 der Jahresrechnung, Überschuss vor Kapitaldienst, ZÜ) | fett | keine | oberer Rahmen dünn `3C3C3B` |
| Status „prüfen“ | rot fett (bedingt) | `FCE4E4` (bedingt) | |
| Datenzeilen | | | unterer Rahmen Haarlinie `D9D9D9`; Rahmen zwischen t = 42 und t = 43 mittel `3C3C3B` |

Gitternetz aus auf Übersicht und Hinweise. Keine Kommentare, keine Bilder, keine Diagramme.

### G.2 Zahlenformate

| Zweck | Code | Beispiel |
|---|---|---|
| Euro | `#,##0;[Red]-#,##0;"–"` | 1.449.000 · −18.495 · – |
| Euro, Kostenzeilen Jahresrechnung und Rechenweg (Übersicht D30:F32, D34:F37, E68:F69) | `#,##0;-#,##0;"–"` | 2.285 |
| Euro mit Cent, €/m² Monat | `#,##0.00;[Red]-#,##0.00;"–"` | 14,40 · 6,80 |
| Prozent | `0.00 %;[Red]-0.00 %;"–"` | 5,52 % |
| Prozent, eine Stelle | `0.0 %;[Red]-0.0 %;"–"` | 20,0 % |
| Prozent ohne Strich bei 0 (Übersicht C35) | `0.00 %` | 0,00 % |
| Tilgungsraster (Übersicht B55:B61; B62) | `"Tilgung "0.00 %` · `"Tilgung "0.00 %" laut Eingabe 3.1"` | Tilgung 1,00 % |
| Faktor, DSCR | `0.00;[Red]-0.00;"–"` | 1,01 |
| t, Jahr | `0` | 2028 |
| Anzahl | `#,##0;[Red]-#,##0;"–"` | 9 |
| Satz Verwaltung (Übersicht C31) | `#,##0" € je Wohnung"` | 367 € je Wohnung |
| Satz Instandhaltung (Übersicht C32) | `0.00" €/m²"` | 14,40 €/m² |
| Eingabezellen (Eingaben D–F) | ohne Nullabschnitt, siehe B.3 | 0 |

Prozente immer als Bruch gespeichert, auch der Zuschlag 9.3; keine Speicherung „× 100“. Formatcodes in englischer Notation; die Anzeige (Punkt, Komma, „Rot“) folgt dem Gebietsschema.

### G.3 Spaltenbreiten (Zeichen)

| Blatt | Breiten |
|---|---|
| Übersicht | A 6 · B 42 · C 17 (Satz „367 € je Wohnung“) · D–K 12 · L 38 |
| Eingaben | A 6 · B 44 · C 15 · D 22 · E 22 · F 16 · G 58 |
| Gefördert A/B/C | A 5 · B 7 · C–F 10 · G–K 13 · L–Q 12 · R 13 · S 8 · T–W 13 · X 13 · Y–AS 12 |
| Frei finanziert | A 5 · B 7 · C 10 · D–H 13 · I–J 12 · O–S 12 |
| NBank | A 6 · B 40 · C 13 · D–F 11 · G–I 10 |
| Tabellen | A 6 · B 44 · C 18 · D–F 12 · G 56 |
| Hinweise | A 5 · B 120 (Umbruch) |

Beschriftungen der Blöcke unter der Zeitreihe stehen in Spalte A und laufen über B–F (Zellen leer); kein Zellverbund.

### G.4 Druck

A4 quer, `fitToWidth` 1, `fitToHeight` 0, Ränder 1,5 cm, Fußzeile links `&A`, rechts `Seite &P von &N`. Standardzeilenhöhe aller Blätter 12,75 pt (Arial 10; openpyxl schriebe sonst 15 pt). Übersicht: Wiederholungszeilen 1:2, Druckbereich `A1:L114`, Umbruch nach Zeile 52 (zwei Seiten, eingeklappte Zeilen werden nicht gedruckt). Eingaben: Wiederholungszeilen 4:5 (Projektnamen und Kopf, Runde 2 V10). Gefördert A/B/C: Druckbereich `A1:J48,K1:X48,A88:J177` (Zeitreihe in zwei Bereichen nebeneinander, Blöcke), Wiederholungszeilen 2:3 (Gruppe, Projekt, Sprunglinks, Einheiten; der Zeitreihenkopf Zeile 4–5 steht auf beiden Zeitreihenseiten ohnehin, über den Blockseiten nicht, Runde 2 V2), Wiederholungsspalten A:B, Umbruch nach Zeile 129 (Kosten, Finanzierung und Restwert auf einer Seite, Renditen, Liquidität und Förderbarwert auf der nächsten; Runde 3 V), Seitenfolge „erst nach rechts“; Titel A1:J1 (erste Seite); die Zeilen 49–86 sind zugeklappt und werden nicht gedruckt. Frei finanziert: Druckbereich `A1:H48,A88:J139`, Wiederholungszeilen 2:3, kein fester Umbruch (Runde 3 V). LibreOffice sortiert mehrteilige Druckbereiche beim Speichern um und schreibt die Druckwiederholungen doppelt; `build_vofi.py` stellt beides nach `recalc.py` wieder her. Excel rechnet einen Maßstab je Blatt (Gefördert rund 73 %, Zeitreihe zwei Seiten), LibreOffice je Bereich (Zeitreihe A–J bis 100 %, dann drei Seiten). `fullCalcOnLoad = True`; Dokumenteigenschaften Autor „PGN“, Titel „VOFI Mietwohnraum 2026“, Sprache de-DE.

### G.5 Beispielzeilen

Eingaben, Zeile 30:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| 5.2 | Objektverwaltung je Wohnung | € p. a. | 367 (blau auf Gelb) | 367 (blau auf Gelb) | `=INDEX($D30:$E30,Projekt_Nr)` → 367 (grau) | PGN-Annahme (Broschüre S. 11); ImmoWertV fortgeschrieben |

Übersicht, Zeilen 31 und 38:

| A | B | C | D | E | F | H |
|---|---|---|---|---|---|---|
| 2 | − Objektverwaltung | `=Verwaltung_WE*(1+Kostensteigerung)^Kosten_Vorlauf` → 367 € je Wohnung | `=-'Gefördert A'!I7` → 7.340 (schwarz) | → 7.340 | → 7.340 | Satz 2026, fortgeschrieben laut Eingabe 5.5; Betriebskosten umgelegt |
| 8 | = Zahlungsüberschuss p. a. | | `='Gefördert A'!R7` → 455 (grün, fett) | → −18.495 (rot) | → −26.324 (rot) | |

Gefördert A, Zeile 7 (t = 1, Modellhaus): C 12,92 · D 14,48 · E 14,48 · F 6,80 · G 114.240 · H −2.285 · I −7.340 · J −20.160 · K 84.455 · L −14.000 · M – · N −70.000 · O – · P – · Q −84.000 · R 455 · S 1,01 · T 2.730.000 · U – · V 455 · W 455 · X 210.899.

### G.6 Sprachregeln

| Regel | Umsetzung |
|---|---|
| Länge | Bezeichnung ≤ 45 Zeichen; Quelle ≤ 60; jede Zelle ≤ 120 außer Hinweise B3:B17 |
| Ton | Aussagesätze ohne Ausrufezeichen, ohne „Wichtig:“, „ACHTUNG“, „bitte“, „unbedingt“, Emojis; keine Werkstatthinweise (Skriptnamen, Zelladressen, Fakt-IDs) |
| Keine Formel-Prosa | Texte sind Konstanten; Formeln liefern nur Zahlen oder ein Statuswort („OK“, „prüfen“, „über“, „unter“, „A“/„B“/„C“, „n. v.“, „–“) |
| Begriffe | Objekt-IRR, EK-IRR, VOFI-EK-Rendite, Restwert, Gebäude-Restwert, Bodenwert, Verwaltungskostenbeitrag, Bearbeitungsentgelt, Zahlungsüberschuss (auch kumuliert, nie „ZÜ“ oder „Jahresüberschuss“), Überschuss vor Kapitaldienst (Zeile 4 der Jahresrechnung, auch Spaltenkopf Gefördert K und Frei H; „Reinertrag“ nur im Text des Konzepts, Runde 2 KO1), Förderbarwert (Zuschuss nach Entgelt + Barwertvorteil Darlehen), höchster Überschuss (nicht „beste Gruppe“, Runde 2 KO2), Sollmiete, Objektverwaltung, Mietausfall/Leerstand, Kappungsgrenze, Liegenschaftszins, Projektkonto (VOFI), Schuldendienstdeckung (DSCR, einmal ausgeschrieben in Übersicht 3.4), Abschlag Bestandsmiete unter Zielmiete, Ertragswert gegenüber Gesamtkosten, Aufschlag in Prozentpunkten |
| Restwert-Varianten | „mit Restwert“, „nur Bodenwert“, „ohne Restwert“; Objekt-IRR „ohne Zuschuss“ / „nach Zuschuss“ (nicht „brutto“) |
| Broschürenbegriffe | Jahresrechnung (Block 2) mit den Bezeichnungen aus `11-wirtschaftlichkeit.json`, gekürzt; Tilgungsvergleich mit „Mehrschuld“, „Mehrüberschuss“, „Tilgungsschwelle“ wie S. 12; „zuwendungsfähige Kosten“ |
| Verweise | auf Eingaben einheitlich „Eingabe x.y“, auf die Jahresrechnung „Zeile n“ (Broschürennummer, nicht Excel-Zeile) |
| Abkürzungen | VKB nur in NBank A34; „Vorgängermappe“ statt „v2-1“; Einheiten in Spalte „Einheit“ |
| Neutral zur NBank | „über/unter Orientierungswert“; „Die NBank rechnet selbst (RL Nr. 11.10).“ |

---

## H. Umsetzung

| Datei | Inhalt |
|---|---|
| `build_vofi.py` | Konstanten (Farben, Formate), Tabelle `EINGABEN` (Nr., Zeile, Bezeichnung, Name, Einheit, Format, Wert Modellhaus, Wert Tarutinoer, Quelle, Gültigkeit) als einzige Quelle der Eingabewerte, Tabelle `FESTWERTE`; je Blatt eine Funktion; Gefördert A/B/C aus einer Funktion mit Parameter Gruppe; Namen, Datenüberprüfung, bedingte Formatierung, Gliederung, Zellhyperlinks, Druck; Speichern, danach `recalc.py … 120` |
| `pruefe_vofi.py` | F1–F13; importiert `vofi-pruefung/referenzrechnung.py` für Sollwerte (inkl. Bankpfad F8 als Hilfsfunktion); liest v2-1 nur mit `data_only=True` aus einer Kopie; liest Broschürenwerte aus `content/pages/10–12`; findet Zellen über die Adressen dieses Konzepts; Läufe F.2a parallel (eigenes LibreOffice-Profil je Lauf); Ausgabe je Kriterium „OK“/„FEHLER“ mit Ist/Soll; Exit-Code 0 nur bei vollständigem Erfolg |

Zeilen- und Spaltenadressen dieses Konzepts sind verbindlich; eine Änderung erfordert die Anpassung von Konzept und Prüfskript.

---

## I. Offene Punkte

| Nr. | Punkt | Wer |
|---|---|---|
| O1 | Restfinanzierung über Bank (E5, A3) statt über bares Eigenkapital bestätigen. Beim Referenzprojekt mit tatsächlichem Verkehrswert 731.325 € kippt damit die Liquiditätsaussage: Bank 309.386 €; ZÜ Jahr 1 A +9.342 → −7.989 € (B +3.069 → −14.262 €, C +906 → −16.425 €); DSCR Jahr 1 A 1,23 → 0,86; VOFI-EK mit RW J42 A 5,17 → 5,76 %; EK-IRR mit RW J42 A 5,70 → 5,91 % (D.2a). Die RR-Lesart ergibt sich in v3 mit 7.1 = Lücke (L5) | PGN |
| O2 | Für das Modellhaus sind Markt- und Vergleichsmiete (12,92 / 14,48 €/m²) und die Liegenschaftszinskurve (Neu Wulmstorf, Eichwert Bodenrichtwert 600 €/m²) Platzhalter; alle Renditen mit Restwert hängen daran (PRUEFBERICHT Frage 6). Für andere Standorte: Kurve in Tabelle 4 tauschen oder Zuschlag 9.3 | PGN |
| O3 | Swapsatz 3,39 % vom 19.08.2026; Quelle und Stichtag (Markt 19.10.2026: 3,43 %) | PGN / NBank |
| O4 | Zins ab Jahr 36: 3,74 % als Obergrenze oder Basiszinssatz + 3 Pp (Frage 9) | NBank |
| O5 | Kostenstand für die Broschüre: Stand 2026 in Jahr 1 (Eingabe 5.5 = 0) oder fortgeschrieben (Frage 2) | PGN |
| O6 | Modellhaus: Bodenrichtwert und Grundstücksfläche nicht bekannt, Deckel 0 = aus | PGN |
| O7 | Zuschlag modellhaft/Housing First gestrichen; bei Bedarf als Eingabe nachrüsten | PGN |
| O8 | erledigt (Runde 1): `AENDERUNGSPROTOKOLL-v3.md` angelegt; im Abschluss ersetzt durch `AENDERUNGEN.md` (Kundenfassung) und `README.md` (Technik) | – |
| O9 | Abgleich Excel ↔ Präsentation wie F9, sobald die Präsentation neu gestaltet ist (zuletzt). Excel ↔ Broschüre ist erledigt (F9 grün; Broschüre S. 11/12 verweist auf v3) | Orchestrator |
| O10 | Bemessungsgrenzen ab 01.10.2026 fortgeschrieben (RL Nr. 5.3.2.2); bis 21.10.2026 keine Bekanntgabe. Tabelle 2 bei Bekanntgabe auf nbank.de nachziehen | PGN |
| O11 | Kopplung Bezugsjahr 1.1 und Kostenstand 5.5 (z. B. 5.5 = 1.1 − 2026 + 1): fachlich abzustimmen; bis dahin ändert 1.1 nur Jahreszahlen (Bezeichnung „ändert nur Jahresangaben“) | PGN |
| O12 | Vergleichszins des Förderbarwerts: Eingabe 6.1 (3,74 %, Bankzins) bewertet den Zinsvorteil des NBank-Darlehens; ein höherer Zins erhöht den Förderbarwert und den Objekt-IRR nach Förderbarwert. Bestätigen, dass der Bankzins der richtige Vergleichszins für die Beratung ist (Runde 2 FL1) | PGN |

---

## J. Kritik vom 09.11.2026: Umsetzung

### J.1 Umgesetzt

| Nr. | Kritikpunkt | Umsetzung | Ort |
|---|---|---|---|
| K1 | A3 mit „0 (keine Lücke)“ beziffert; Bankpfad ungetestet | Fall Tarutinoer mit Verkehrswert 731.325 € beziffert (Liquidität und Renditen, A/B/C); Lauf L4 mit Sollwerten Bank 309.386,40 €, bares EK = Entgelte, Eigenmittelquote 22,0 %; L5–L8 für Zusatz-EK und Bankkonditionen; Zahlen in O1 | D.2 A3, D.2a, F.2a, F.5, O1 |
| K2 | H103 nahm KG 800 in die Banklücke | H103 ohne H91; KG 800 zahlt H104 wie E6 und RR; Test L12 (KG 800 = 100.000 €: Bank 0, bares EK 849.000 €) | D.3 Z. 103, E6, F.2a |
| K3 | Prüfblock meldet zulässige Fälle, Selbsttests | Prüfblock P1–P6 (alte P1, P2, P8, P10 nur mit RW, P11, P14); alte P3/P4/P6/P9 als Beträge Übersicht 1.3, 1.4, 3.10, 3.11; alte P5, P12, P13, P15 nur in F13; alte P7 entfällt (Datenüberprüfung 3.2) | F.1, D.5 Block 1/3/8, F13 |
| K4 | Sperre der Renditen bei Überfinanzierung fehlte | Sperre `IF($H$105>=1,"n. v.",…)` in allen Renditezeilen der Blätter Gefördert; wirkt auf Übersicht und NBank; Test L11 | E14, D.3 Renditen, E.2 B4, F.5 |
| K5 | Liegenschaftszinskurve als neutraler Festwert | Tabelle 4 „Bewertung, Standort Neu Wulmstorf“ abgesetzt, Quelle mit Stichtag und Eichwert BRW 600 €/m², Tabellen Zeile 2 neu; Hinweis 14, O2, 9.3 als Standortanpassung | C Tabelle 4, D.7, O2, B.2 9.3 |
| K6 | Eingaben mit versteckter Stellenzahl | 2.1 je m² (4.500 / 3.579); 6.4 Laufzeit 30 Jahre, Tilgung per Formel (H111, H113); Modellhaus 4.3/4.4 = 12,92 / 14,48 mit Abweichung A7 und neuen Sollwerten F.3 (c); Tarutinoer volle Stellen, Anzeige 2 Stellen | B.2, D.3, D.2 A7, F.3 |
| K7 | Prüfspuren in der Quellenspalte | Quelle nur Sachquelle; Zelladressen und Fakt-IDs in eigene Spalten „Fundstelle“/„Beleg“, die nicht in die Excel gehen; Bedienhinweise in die Bezeichnung (2.4, 2.5, 5.5, 7.1) oder gestrichen; T9 „RL 2026 Nr. 5.3.2.2, 5.4.4“; Prüfung F6 | B.2, C, F6 |
| K8 | Nur 6 von 39 Eingaben gegen RR geprüft | 38 Läufe F.2a, jede Eingabe mindestens einmal abseits des Standards; L3 in allen Renditen gegen RR; Nullstellenregel und A2-Regel in F8 | F.2a, F8 |
| K9 | Übersicht Block 5–7 zu dicht | Zeilengliederung: sichtbar Objekt-IRR n. Z. und EK-IRR mit RW / ohne Geb.-RW, VOFI-EK mit RW, Restwertanteil, Restwert, Boden, Gebäude, Wertüberschuss nach Abschlag; eingeklappt brutto, ohne RW, Ertragswert, Bindungsabschlag, LZ, Wertüberschuss vor Abschlag, Prüfdetails; Frei nur einmal je Variante | D.5 Block 5–8 |
| K10 | Tilgungsraster bei Aufschub falsch beschriftet | Kopf „Überschuss Jahr 1 bei Tilgung ab Jahr 1“; Bemerkung Zeile 65 „gleich Zeile 37 ohne Aufschub“; Identität nur bei Aufschub 0 (F13) | D.5 Block 4 |
| K11 | Broschürenzahlen fehlen als Ankerwerte | Block 1: Förderung gesamt, Förderquote, Eigenmittel ohne Entgelte, je Wohnung, Überleitung Eigenmittel + Entgelte = Eigenkapital; Block 4: Rasterpunkt 0 %, Mehrüberschuss vor Tilgung | D.5 Block 1/4, F.3 (a) |
| K12 | O8 veraltet, kein Abgleich mit der Broschüre | O8 gestrichen; F9 liest `content/pages/10–12` und vergleicht nach F.2b; Präsentation als O9 | F9, F.2b, I |
| K13 | Bezeichnungen der Jahresrechnung weichen von S. 11 ab | Bezeichnungen aus `11-wirtschaftlichkeit.json` (gekürzt), Rechenzeichen in der Bezeichnung, Kostenbeträge positiv ohne Rotformat | D.5 Block 2, G.2, G.5 |
| K14 | Zwei Bezeichnungen > 45 Zeichen | „Jahresrechnung Jahr 1 (wie Broschüre S. 11)“ (43), „Gegenrechnung EK-IRR (DAWI Art. 6 Abs. 1)“ (41) | D.5, D.6 |
| K15 | Konstantenliste widerspricht P10 und C51 | P4 zählt „n. v.“ (Vergleich mit 0); Konstantenliste neu (0, 1, 2, 10, 12, 0,03, 0,00005); Rasterwerte als feste Hilfswerte schwarz, C61 Formel | F.1 P4, F4, D.5 Block 4 |
| K16 | Abstand × 100 gespeichert | Abstand entfällt; nur Lage „über/unter“ | D.6, G.2 |
| K17 | Mehrdeutigkeit nur an 6.3 vermerkt | Bemerkung an EK-IRR ohne Geb.-RW (6.2) und ohne RW (6.6); E10 eingeschränkt auf Standardläufe; Nullstellenregel F8 (Runde 2: auch an 5.5, 5.7, 5.9; Konvention E10 umgesetzt) | D.5 Block 6, E10, F8 |
| K18 | Redundante Eingaben 1.1, 9.3; Einheit 9.5 | Projektbezeichnung gestrichen (Projektname = `Aktives_Projekt`); Zuschlag Kostensteigerung gestrichen (Best/Worst direkt in 5.4, E.4); Gebäude-RW als Faktor 1,00 (jetzt 9.4); 37 Eingaben | B.2, E.1, E.4 |
| K19 | Werkstatt- und Belehrungston | Hinweis 15 „Version 3.0, Stand 11/2026.“; Hinweis 4 neu; Tabellen Zeile 2 „Festwerte RL Mietwohnraum 2026 und Bewertung“; „Schuldendienstdeckung (DSCR)“ in 3.4 | D.7, C, D.5 |
| K20 | HYPERLINK-Formel mit Excel-Syntax | nur Zellhyperlinks mit Sprungziel; HYPERLINK-Funktion in F3 verboten, Existenz der Links geprüft; Linkfarbe PGN-Rot | A, B.1, D.3, D.4, D.5, F3, G.1 |
| K21 | Blöcke unter der Zeitreihe schwer zu finden | Sprunglinks in Zeile 2 (fixierter Bereich) auf Finanzierung, Restwert, Renditen, Liquidität | D.3 Kopf, D.4 |
| K22 | Zwei Mieteingaben statt einer ohne Begründung | Begründung in E.1: Vergleichsmiete als Obergrenze bis Jahr 42 und Zielmiete-Option 8.2; Bezug Jahr 1 wie v2-1 `Basisdaten!C46:C49` | E.1 |

### J.2 Abgelehnte Kritik

| Nr. | Abgelehnter Teil | Fachlicher Grund |
|---|---|---|
| K3 (Teil) | „Datenüberprüfung 6.4 mit Minimum = Tilgung_Bank_min statt P8“ | 6.4 ist nach K6 die Laufzeit; die Anfangstilgung folgt aus Zins und Laufzeit (H113) und lässt sich nicht als Grenze einer Eingabe prüfen. RL Nr. 5.3.6 bleibt deshalb Prüfung P3 (alte P8). Sie ist ein echter Fehlerfall (L8: 5 %, 42 Jahre → 0,74 %) |
| K4 (Variante) | „Förderung auf den Barbedarf deckeln“ | Die RL bemisst Darlehen und Zuschuss nach Quote auf die zuwendungsfähigen Kosten; wie die NBank eine Überfinanzierung auflöst (Kürzung, Ablehnung, Ausgleich), legt sie im Einzelfall fest. Eine Deckelung im Modell wäre eine eigene Förderannahme. Die Sperre zeigt den Fall, ohne ihn zu rechnen |
| K9 (Detail) | „Frei in 5.1–5.3 als –“ | Korrigiert in Runde 2 (FL1, E18): Der Vergleich nach Zuschuss gegen frei ist kein Entscheidungsvergleich, weil „nach Zuschuss“ den Zinsvorteil des NBank-Darlehens nicht enthält (kennzahlen-konzept 2.3: das Darlehen bleibt Finanzierung). Entscheidungsvergleich ist jetzt der Objekt-IRR nach Förderbarwert (5.1/5.2) gegen frei; ohne Zuschuss gegen frei (5.4) zeigt die Kosten der Bindung. Frei steht in allen Objekt-IRR-Zeilen (frei: ohne Förderung) |
| K17 (Option) | Zähler der Vorzeichenwechsel je EK-Reihe mit „*“ | Die Mehrdeutigkeit betrifft fest bekannte Zeilen (EK-IRR ohne Geb.-RW und ohne RW, J35); die Bemerkung an diesen Zeilen genügt. Ein Zähler je Reihe wäre ein weiteres Statusfeld ohne Handlungsfolge für die Nutzer; die Kontrolle übernimmt F8 |
| K18 (Detail) | `Projektname = INDEX(Projektliste,Projekt_Nr)` als eigener Name | Der Wert steht bereits in der Auswahlzelle D3 (`Aktives_Projekt`); ein zweiter Name für denselben Text wäre doppelt. Ergebnis wie verlangt: ein Name je Projekt |
| K21 (Option) | Blöcke oberhalb der Zeitreihe anordnen | Excel fixiert nur Zeilen am oberen Rand. Stünden die Blöcke (rund 80 Zeilen) über der Zeitreihe, ließen sich die Spaltenköpfe der 81 Zeitreihenzeilen nicht mehr fixieren; die Zeitreihe wäre ohne Köpfe zu lesen. Die Sprunglinks im fixierten Kopf lösen das Auffinden, die Adressen bleiben stabil |

---

## K. Nacharbeit Runde 1 (Prüfbefunde vom 09.11.2026)

Befunde in der Reihenfolge der Prüfung: R = Rechnung, FL = Fachlogik, V = Verständlichkeit, KO = Konsistenz. Zahlenwirkung auf die Standardläufe L1 (Modellhaus) und L2 (Tarutinoer): keine; alle Sollwerte F.3–F.5 unverändert. Neue Werte entstehen nur dort, wo vorher „n. v.“ stand (Läufe L39–L41).

### K.1 Umgesetzt

| Befund | Kern | Umsetzung | Ort |
|---|---|---|---|
| R1 | IRR „n. v.“ trotz genau einer Nullstelle | Startwert-Kaskade 3 % bzw. VOFI → −10 → −30 → −50 → −70 % (Prüfer-Kaskade um −30 und −70 % erweitert: −14,05 % findet nur −30 %, −63 … −70 % nur −70 %); L39 (2.1 = 6.000): C EK-IRR nur Bodenwert J35 −5,30 % statt „n. v.“; L40 (9.1 = 2,0): A −12,49 / −5,06 / −8,46 % | E10, D.1, D.3, F.2a |
| R2 | Scheinlösung ≤ −100 % | jeder Versuch nur, wenn IRR > −100 %; L41 (4.5 = −5 %): Frei Objekt-IRR mit Restwert J35 „n. v.“ statt −199,50 % | D.3, D.4, F.2a |
| R3 | P4 ohne VOFI; Restwertanteil 0 | P4 zählt auch Zeile 143; Zeile 149 „n. v.“ bei Endvermögen ≤ 0 (L40: P4 „prüfen“) | F.1, D.3 |
| R4 | NBank N10–N15 mehrdeutig ohne Hinweis | A35 „EK-IRR nur Bodenwert und ohne Restwert: mehrere Nullstellen möglich; VOFI-EK-Rendite maßgeblich.“ | D.6 |
| R5, FL11 | T14 `Aufschub_max` wirkungslos | Datenüberprüfung 3.2 formula2 `=Aufschub_max`; Hinweis B.2 des Prüfskripts entfällt | B.2, C |
| R6 | Zeitraum Fehlbetrag | „Größter kumulierter Fehlbetrag, Jahr 1–42“ (Übersicht 3.7, Gefördert 159) | D.3, D.5 |
| R7 | Hinweise 6/9 Mietpfad ungenau | Hinweis 6 und 9 neu (Erhöhung je 3 Jahre um höchstens die Kappungsgrenze, bis Jahr 42 bis zur Vergleichsmiete, danach bis zur Zielmiete) | D.7 |
| R8 | Werte Jahr 1/Bezug unter „Jahr 35“ | Einheit „% (Jahr 1)“ (5.7) und „% (Bezug)“ (7.4, 7.8) | D.5 |
| R9, FL6 | Änderungsprotokoll fehlt; Best/Worst nicht für Nutzer | `AENDERUNGSPROTOKOLL-v3.md` angelegt; Best/Worst kurz in der Quellenspalte von 3.1, 5.4, 6.3, 9.1, 9.2, 9.3 | E.4, B.2 |
| FL1 | VOFI-Paar eingeklappt | Block 6 neu: 6.1 EK-IRR mit Restwert, 6.2 nur Bodenwert, 6.3 VOFI mit Restwert, 6.4 VOFI nur Bodenwert, 6.5 Restwertanteil sichtbar; 6.6/6.7 „ohne Restwert“ eingeklappt | D.5 |
| FL2 | Nettoanfangsrendite im IRR-Block mit Frei | Block „Objektrendite vor Steuern“; 5.7 „Hilfsgröße: Nettoanfangsrendite, statisch“, Bemerkung „ohne Zuschuss, ohne Restwert“, Frei leer | D.5 |
| FL3 | Bemessungsgrenzen ohne Stand | Quelle „RL 2026 Nr. 5.3.2.2 (Ausgangswert 01.07.2026), 5.4.4“; Tabellen A2 mit Fortschreibungshinweis; O10 | C |
| FL4 | B7 nur per Konvention | Hinweis 4 nennt Richtung und Größe (EK-IRR −0,16 Pp, VOFI −0,14 Pp); E.2 B7 „teilweise“ mit VKB der Bauphase | D.7, E.2 |
| FL5 | Tarutinoer ohne Bodenwert, Kurve geeicht auf 600 €/m² | Hinweis 14 (Grundstück 0 €, nur Bodenwert = ohne Restwert, Renditen ohne Grundstückskosten, nicht vergleichbar); Tabellen A42 Eichung gegen Standort-BRW | D.7, C |
| FL7 | „Bindungsabschlag“ in Jahr 35/42 | „Abschlag Bestandsmiete unter Zielmiete“ (Gefördert 124, Übersicht 7.6) | D.3, D.5 |
| FL8 | „brutto“, „Wertüberschuss“ | „ohne Zuschuss“; „Ertragswert Bestand/Zielmiete gegenüber Gesamtkosten“ | D.3, D.5 |
| FL9, KO13 | Aufschlag Swapsatz in „%“ | Einheit „Prozentpunkte“ (T24, NBank N2), Hinweis 12 „+ 1 Prozentpunkt (100 Basispunkte)“; Hinweis 8 „bis Ende Jahr 35“ | C, D.6, D.7 |
| FL10 | RL-Quellen für Modellannahmen | T21 „PGN-Konvention (Rahmen RL 2026 Nr. 5.4.5)“, 3.2/3.3 „PGN-Annahme (Rahmen RL …)“, 6.4 „PGN-Annahme (bisheriger Ansatz)“; Hinweis 6 „Erhöhung alle 3 Jahre“ | B.2, C, D.7 |
| FL12 | 6.1 wirkt auch ohne Bank | Block 6 „Bankdarlehen und Vergleichszins“, 6.1 „Zins Bankdarlehen, auch Vergleichszins NBank“, N19 „… zum Vergleichszins“ | B.2, D.6 |
| FL13 | Kostenstand schwach gekennzeichnet | 5.5 „Jahre vom Kostenstand bis Jahr 1“; Hinweis 5; Übersicht L30/L31 „Kostenstand 2026“ | B.2, D.5, D.7 |
| V1 | Projektwahl am Text der Spaltenköpfe | D3 = 1 oder 2 (`Projekt_Nr`), Namen in D4:E4 (Eingaben), F4 `=INDEX(Projektliste,Projekt_Nr)` = `Aktives_Projekt`; Legende A2 nennt Zeile 4 | B.1 |
| V2 | Abkürzungen RW, Geb.-RW, brutto | in der ganzen Mappe ausgeschrieben („mit Restwert“, „nur Bodenwert“, „ohne Restwert“, „ohne Zuschuss“, „Eigenkapital“ in den Reihenköpfen) | D.3–D.7, G.6 |
| V3 | Prüfblock eingeklappt, Ursache unsichtbar | Prüfblock sichtbar (Z. 104–110), Kasse A/B/C in E105:G105 | D.5, F.1 |
| V4 | Übersicht nicht auf einen Blick | eingeklappt: 1.3, 1.4, 1.14–1.16, 3.9–3.11, 4.12; Raster als „Tilgung x %“ in B; Frei-Zellen leer; Spalten B 42, L 38; Kopfhöhe 20; Druck zwei Seiten | D.5, G.3, G.4 |
| V5 | Druck Gefördert 48 %, Seite nur t = 43–80 | Zeilen 49–86 gegliedert, zugeklappt; Druckbereich `A1:J48,K1:X48,A88:J170`; Wiederholungen Zeilen 2:5, Spalten A:B; Standardzeilenhöhe 12,75 pt | D.3, G.4 |
| V6 | Quelle „v2-1“ | Sachquellen mit Stand, „PGN-Annahme (bisheriger Ansatz)“, „Vorgängermappe“; „(Basis)“ gestrichen | B.2 |
| V7 | 1.1 ohne Wirkung | „Bezugsjahr (nur Jahreszahlen)“; Kopplung mit 5.5 offen (O11) | B.2, I |
| V8 | unklare Bezeichnungen | „Restwert (Boden + Gebäude)“, „Ertragswert … gegenüber Gesamtkosten“, „Tilgungsschwelle C gegenüber B“, „beste Gruppe“, „Zahlungsüberschuss kumuliert“, L65 „gleich Zeile 8, ohne Aufschub“, „Eingabe x.y“, „Projektkonto (VOFI)“ | D.3–D.6 |
| V9 | Frei: Zahlungsreihen sichtbar, Dubletten | Zahlungsreihen in O–S (gegliedert), Köpfe zentriert; Zeilen 123, 124, 129 leer | D.4 |
| V10 | Meldungen der Datenüberprüfung | Meldung mit Bereich, Eingabehinweis bei Prozent; 3.2 bis `Aufschub_max` | B.2 |
| V11 | NBank ohne Projekt, ohne Rücksprung | NBank B3/D3 Projekt; Links „Übersicht“ NBank I1, Tabellen G1, Hinweise C1 | D.6, C, D.7 |
| V14 | Legende ohne Gliederung | D5 „… Weitere Zeilen: + am linken Rand.“ | D.5 |
| KO1 | „Jahresüberschuss“ (Broschüre S. 12) | Broschüre: „Zahlungsüberschuss“ (Lead, Randnotiz; JSON, Partial, copy.md, plan.json); Mappe B53 „Zahlungsüberschuss Jahr 1 je Tilgungssatz“, G53 „beste Gruppe“ | Broschüre S. 12, D.5 |
| KO2 | L65 „Zeile 37“ | „gleich Zeile 8, ohne Aufschub“ | D.5 |
| KO3 | Rechenweg S. 12 fehlt | 4.13 „Mehrschuld gegenüber A“ (1.400.000 / 2.100.000), 4.15 „Mehrüberschuss bei Tilgung laut Eingabe 3.1“ (−18.950 / −26.779); Blöcke 5–8 rücken zwei Zeilen nach unten | D.5, F.2b, F.3 |
| KO4 | Reinertrag/Überschuss vor Kapitaldienst | L44 „Zeile 4 ÷ Kapitaldienst“; Gefördert K5 „Reinertrag (vor Kapitaldienst)“ | D.3, D.5 |
| KO5 | Köpfe „Verwaltung“, „Mietausfall“ | „Objektverwaltung“, „Mietausfall/Leerstand“ auf allen Zeitreihenblättern | D.3, D.4 |
| KO6 | Quelle 5.2/5.3 überzeichnet | „PGN-Annahme (Broschüre S. 11); ImmoWertV fortgeschrieben“ | B.2 |
| KO7 | Quelle 2.4/2.5 | „Broschüre S. 10: Deckel greift nicht / Projektdaten PGN“ | B.2 |
| KO8 | „Mindest-Eigenmittel in Geld“ | „Eigenmittel bar (20 % abzüglich Grundstück)“ | D.3 |
| KO9 | „C vor B unterhalb Tilgungssatz“ | „Tilgungsschwelle C gegenüber B“, L „Broschüre S. 12“ | D.5 |
| KO10 | Kopf Jahresrechnung ohne Einheit | „Jahresrechnung Jahr 1 in € (Broschüre S. 11)“ | D.5 |
| KO11 | „zuwendungsfähige Gesamtkosten“ (Broschüre S. 10/12) | Broschüre: „zuwendungsfähige Kosten“ (S. 10 Zeile 3, S. 12 Rechenbasis; JSON, Partial, copy.md, plan.json) | Broschüre |
| KO12 | Broschüren-Metadaten auf v2-1 | `values_source` S. 11, `calculation.basis` und `open_points` S. 12, copy.md Anhang B Nr. 1 auf v3 (Eingaben 3.1, 5.1–5.3; Übersicht Z. 28–38, 66–71); Abgleich Excel ↔ Broschüre als erledigt, Präsentation offen (O9) | Broschüre, I |

### K.2 Teilweise umgesetzt oder abgelehnt

| Befund | Abgelehnter Teil | Grund |
|---|---|---|
| V4 (Teil) | 1.9 Bankdarlehen einklappen; Spalte L 30, B 40 Zeichen | 1.9 ist eine Hauptgröße der Finanzierung (Broschüre S. 10 „Restfinanzierung“) und erklärt Zeile „Kapitaldienst Bankdarlehen“; bei L 30 / B 40 würden Bemerkungen und Bezeichnungen bis 45 Zeichen abgeschnitten (LibreOffice-Druck geprüft). Gewählt: L 38, B 42 |
| V5 (Teil) | `fitToWidth` 2 mit Spaltenumbruch | Vorgabe 9 verlangt „an Seitenbreite angepasst“; LibreOffice ignoriert manuelle Spaltenumbrüche bei `fitToWidth` 2 (Probe: Umbruch nach M statt J). Gleiche Wirkung mit zwei Druckbereichen und `fitToWidth` 1: Excel rund 73 % statt 48 %, Zeitreihe zwei Seiten, Blöcke vier Seiten; Wiederholungszeilen 2:5 wie vorgeschlagen (der Zeitreihenkopf steht damit auch über den Blockseiten) |
| V12 | Blattschutz | Excel sperrt auf geschützten Blättern die Gliederungsschalter; ohne Makro (`EnableOutlining`) nicht lösbar, Makros sind ausgeschlossen. Die Gliederung ist Vorgabe 3. Umgesetzt ist der andere Teil: Kopf und Werte der nicht aktiven Projektspalte grau (bedingte Formatierung) |
| V13 (Teil) | Tarutinoer 4.3/4.4 auf 2 Stellen runden | Die Werte sind die der Vorgängermappe; Vorgabe 11c verlangt Gleichheit mit v2-1, wo die Konvention unverändert ist. Rundung auf 12,92 / 14,48 €/m² änderte z. B. Frei Reinertrag Jahr 1 um −3,47 € und alle Ertragswerte; der 0,01-€-Abgleich F10 fiele. Die Anzeige hat 2 Stellen. Umgesetzt: F3 leer (Projektwahl V1), Dokumenteigenschaften „PGN“, Titel, de-DE |
| R1 (Grenze) | Nullstellen unter etwa −70 % | `IRR` konvergiert in LibreOffice dort von keinem Startwert zuverlässig (5.4 = 10 %: −72 … −95 %); die Mappe zeigt „n. v.“ (Hinweis 11). Fachlich ohne Aussage (Totalverlust) |
| V7 (Teil) | Kopplung 1.1 mit 5.5 | fachlich abzustimmen (O11); Umbenennung umgesetzt |

### K.3 Änderungen am Prüfskript (Konzeptänderungen Runde 1, Sollwerte der RR unverändert)

Adressen Übersicht ab Zeile 66 (+2), Block 6 neu geordnet, Prüfblock Z. 105–110 sichtbar, Raster in B54:B65; Frei-Zahlungsreihen O–S, Frei 123/124/129 leer; Frei-Zellen der Übersicht leer statt „–“, G79 (jetzt G81) leer; Projektwahl D3 = 1/2, `Aktives_Projekt` = F4; Bezeichnungen, Quellen, Hinweise laut B.2, D.3–D.7; Datenüberprüfung mit Bereichsmeldung und `Aufschub_max`; Konstanten 0,1/0,3/0,5/0,7; Druck laut G.4 (Reihenfolge mehrteiliger Druckbereiche aus `workbook.xml`, keine doppelten Namen); Dokumenteigenschaften; Gliederung Zeilen 49–86; Zeile 149 „n. v.“ bei Endvermögen ≤ 0; P4 mit Zeile 143; Läufe L39–L41. Prüfskript-Korrektur: Die Abnahmefolge `build_vofi.py && recalc.py && pruefe_vofi.py` endet mit einem LibreOffice-Speichern, das `summaryBelow`, `collapsed` und `fullCalcOnLoad` entfernt; das Skript meldet deren Fehlen als HINWEIS statt FEHLER (Skriptkopf Nr. 4). Die gelieferte Mappe ist nachbearbeitet.

---

## L. Nacharbeit Runde 2 (Prüfbefunde vom 09.11.2026)

Kennung: R = Rechnung, FL = Fachlogik, V = Verständlichkeit, KO = Konsistenz, je in der Reihenfolge der Befundliste. Zahlenwirkung auf die Standardläufe L1 (Modellhaus) und L2 (Tarutinoer): keine an bestehenden Kennzahlen; neu sind Förderbarwert 1.9 und Objekt-IRR nach Förderbarwert (Block 5). Adressänderungen der Übersicht: D.5; Prüfskript: L.3.

### L.1 Umgesetzt

| Befund | Kern | Umsetzung | Zahlenwirkung | Ort |
|---|---|---|---|---|
| R1 | Gesamtstatus „OK“ trotz Fehlerwerten | D3 `=IF(COUNTIF($C$109:$C$114,"OK")=ROWS($C$109:$C$114),"OK","prüfen")`; jede Prüfung `=IFERROR(IF(…,"OK","prüfen"),"prüfen")`; P4 verlangt Zahlen (`COUNT(x!I z:J z)=2` je Zeile 133, 136, 140, 143, 175 und Frei 136), Fehlerwerte zählen nicht; NBank-Lage `=IF(ISERROR(D11),"prüfen",…)`; Fehlerlauf L42 (Mietenstufe „VIII“ per Einfügen) | keine | D.5 Block 8, D.6, F.1, F.2a |
| R2 | Mehrdeutiger IRR je nach Startwert | Konvention „größte Nullstelle mit fallendem Barwert“ umgesetzt (E10): erster Treffer der Kaskade, zweiter Versuch ab Treffer + 5 Pp, gezeigt die größere Nullstelle, wenn der Barwert dort fällt; Hilfswerte in den gegliederten Spalten (Gefördert Y–AB, Frei O–R); Kaskade um −60 % ergänzt; Bemerkung „mehrere Nullstellen möglich“ auch an den Objekt-IRR ohne Restwert (5.5, 5.7, 5.9, mit Frei); Prüfregel F8 auf die Konventions-Nullstelle | Standard keine. L10: Gefördert A EK-IRR ohne Restwert J35 −14,45 → −6,42 %; L41: Frei Objekt-IRR ohne Restwert J35 −22,71 → −8,44 %; Modellhaus 3.1 = 0 %: EK-IRR nur Bodenwert J35 C 0,58 → 4,75 %, ohne Restwert J42 B 1,24 → 4,92 %, C 1,23 → 6,17 %, NBank N10 C und N15 B/C „unter“ → „über“; 5.4 = 10 %: Frei ohne Restwert J35 −7,17 → −5,78 % | E10, D.1, D.2 A4, D.3, D.4, F8 |
| R3 | P2 „Eigenmittel mind. 20 %“ kann nicht anschlagen | P2 gestrichen (H102 erzwingt die 20 %); ersetzt durch „Auswahlfelder 4.1, 4.2 und 8.2 gültig“ (Einfügen umgeht die Datenüberprüfung; ungültige Listenwerte erzeugen Fehlerwerte, die Ursache steht dann in P2). Eigenmittelquote bleibt Anzeige 1.12 | keine | F.1 |
| R4, FL5 (Teil) | Satz Verwaltung/Instandhaltung fest bei 5.5 > 0 | C31/C32 fortgeschrieben: `=Verwaltung_WE*(1+Kostensteigerung)^Kosten_Vorlauf` bzw. Instandhaltung; Bemerkung „Satz 2026, fortgeschrieben laut Eingabe 5.5 …“ | L29 (5.5 = 2): C31 381,83 € je Wohnung, C32 14,98 €/m²; Satz × Menge = Betrag | D.5 Block 2 |
| R5 | VOFI-Wirkung EK-Vorlauf −0,14 statt −0,13 Pp | E.2 B7 korrigiert (−0,13 Pp); Hinweis 4 ohne Zahlen (V3) | – | E.2, D.7 |
| R6 | Verweis 6.5 statt 6.6 | E10 und J.1 K17 korrigiert | – | 0, J.1 |
| FL1 | Vergleich gefördert gegen frei nur nach Zuschuss (ohne Zinsvorteil Darlehen) | Förderbarwert (Zuschuss nach Entgelt + Barwertvorteil Darlehen zum Zins 6.1) als Übersicht 1.9 und Gefördert H174; neue Kennzahl „Objekt-IRR nach Förderbarwert“ (Reihe AO–AS, t = 0 −(H94 − H174)), Block 5 mit Frei in allen Zeilen: 5.1/5.2 nach Förderbarwert (Entscheidungsvergleich), 5.3 nach Zuschuss („gefördert ohne Zinsvorteil Darlehen“), 5.4 ohne Zuschuss („Abstand zu Frei: Kosten der Bindung“); J.2 K9 korrigiert | Modellhaus J42 mit Restwert: nach Förderbarwert 5,32 / 5,07 / 5,00 % gegen frei 4,66 % (nach Zuschuss 4,16 / 3,71 / 3,56 %); Tarutinoer 6,59 / 6,38 / 6,34 % gegen 6,17 % | D.3, D.5, J.2 |
| FL2 | Hinweis 4 unvollständig | „Bauphase nicht abgebildet: Kosten, Eigenkapital, Entgelte und Verwaltungskostenbeitrag (RL Nr. 12.7.1) erst ab Bezug; alle Renditen eher zu hoch.“ | – | D.7 |
| FL3 | Förderquoten ohne „höchstens“ | T1 „Darlehen, höchstens“, T2 „Zuschuss, höchstens“ | – | C |
| FL4 | Bedeutung „über“ unklar | NBank A33 „„über“: Die NBank prüft den angemessenen Gewinn ergänzend (RL Nr. 11.10 Abs. 4); Gleichstand gilt als „unter“.“; Kopf G8 „Lage zum Orientierungswert“ | – | D.6 |
| FL5 | feste Bemerkungen L68, L30/L31 | Bemerkung Raster 3.1 ohne Satz; 4.17 „Zeile 8: B − A, C − A“; L30/L31 siehe R4 | – | D.5 |
| FL6 | Bandbreite fehlt | Hinweis 13 „Bandbreite zu jeder Rendite in der Beratung: Eingabe 9.3 ±0,5 %, 9.4 = 0,50, 8.3 = 5 %, 8.2 = Vergleichsmiete.“ | – | D.7 |
| V1 | Rechenreste als „0“/„-0“ | H105 `=ROUND(…,2)`; Restschuld T `=MAX(0,ROUND(T{p}+N{r},2))`, U analog | ≤ 0,005 € je Zelle; Tarutinoer und Bankfall ohne Rechenrest | D.3 |
| V2 | Zeitreihenkopf über den Blockseiten, Titel abgeschnitten | Wiederholzeilen 2:3 (Gefördert, Frei); Titel A1:J1 | – | G.4 |
| V3 | Hinweise zu lang | 15 Zeilen, je ein Gedanke, 106–145 Zeichen; Zahlen aus Hinweis 4 gestrichen; Tarutinoer eigene Zeile; Version im Kopf B2 | – | D.7 |
| V4 | Bemerkungen weit rechts (L) | Blöcke 1–4 und 8: Bemerkung in H (H–K dort leer, Text läuft nach rechts); Blöcke 5–7 weiter L | – | D.5 |
| V5 | Übersicht zu lang | Raster 0 / 1,00 / 1,50 / 2,00 / 2,38 / 2,50 / 3,00 % (Zwischenwerte gestrichen); 3.1-Zeile und Rechenweg S. 12 eingeklappt; Block 5: 4 sichtbare Zeilen | Raster 7 statt 11 Zeilen, Rechenweg eingeklappt; Übersicht 89 sichtbare von 114 Zeilen (vorher 90 von 110, jetzt mit Förderbarwert 1.9, Rechenweg S. 12 und Objekt-IRR nach Förderbarwert) | D.5 |
| V6 | Spaltenlogik Prüfblock, Kopf G53, Frei-Kopf Block 6 | Prüfblock: Status C, Kasse A/B/C D–F; G „höchster Überschuss“ zentriert (zweizeilig); Kopf Frei in Block 6 leer | – | D.5 |
| V7, KO3 | „Broschüre S. 12“ sechsmal, „(bei 2,50 %)“ fest | Quelle einmal je Block: 29 „Schema wie Broschüre S. 11“, 63 „Rechenweg wie Broschüre S. 12“; 4.17 „Zeile 8: B − A, C − A“; „B nie vorn“ nicht als fester Text (hängt von den Eingaben ab) | – | D.5 |
| V8 | Meldungen der Datenüberprüfung | ohne doppelten Punkt; „Zulässig: 2020 bis 2060.“; 3.2 „Zulässig: 0 bis 5 Jahre (RL 2026 Nr. 5.3.5).“ | – | B.2 |
| V9 | Eingabe 0 als „–“ | Eingabespalten D–F ohne Nullabschnitt (B.3) | – | B.3 |
| V10 | Eingaben-Druck, Kopf G5 | Wiederholzeilen 4:5; G5 „Quelle Projekt 1 / Projekt 2“ | – | B.1, G.4 |
| V11 | Bezeichnungen | 1.1 „Bezugsjahr (ändert nur Jahresangaben)“; 5.5 „Kostensätze 2026 fortschreiben um“ (Einheit Jahre); 3.8 `=MAX(0,x!H161)` mit Bemerkung „Tilgung, bei der Zeile 8 = 0; „–“: schon ohne Tilgung negativ“; NBank G8 „Lage zum Orientierungswert“ | – | B.2, D.5, D.6 |
| V12 | Sprunglinks außerhalb des Bildschirms | Gefördert H2:M2 (Übersicht, Finanzierung, Restwert, Renditen, Liquidität, Förderbarwert) | – | D.3 |
| V13 | Formate uneinheitlich | H107 „0.0 %“; Tabellen B35:B41 und D35 rechtsbündig | – | D.3, C |
| V14 | Leerzeilen Frei | Zeilen 123, 124, 129 ausgeblendet (Adressen gleich) | – | D.4 |
| V15, KO5 | 7.4 unter „Jahr 35“; S.-10-Werte eingeklappt | 7.4 Bemerkung „bei Bezug; negativ: unter Gesamtkosten“; 1.3, 1.16, 1.17 sichtbar, 1.4 und 1.15 („davon bar“) eingeklappt | – | D.5 |
| KO1 | „Reinertrag“ gegen „Überschuss vor Kapitaldienst“ | Spaltenköpfe Gefördert K und Frei H „Überschuss vor Kapitaldienst“, Gefördert X „Überschuss zur Zielmiete (Restwert)“ | – | D.3, D.4, G.6 |
| KO2 | „beste Gruppe“ wertet | G54 „höchster Überschuss“ (wie Broschüre S. 12) | – | D.5 |
| KO4 | Rechenweg S. 12 nicht zeilengleich | 4.12 Mehrschuld, 4.13 Mehr-Sollmiete p. a., 4.14 − Mietausfall/Leerstand, 4.15 − Verwaltungskostenbeitrag, 4.16 = Mehrüberschuss vor Tilgung, 4.18 Einmalig: Mehr an Bearbeitungsentgelten; Broschüre `values_source`/`calculation.basis` auf Zeilen 29–39 und 55–72 | – | D.5, F.2b, Broschüre |
| KO6 | Bezeichnungen Jahresrechnung | C31 Format `#,##0" € je Wohnung"`; Kopf „Jahresrechnung Jahr 1, in € p. a.“ (Quelle in der Bemerkung, 45-Zeichen-Grenze); Zeile 8 „= Zahlungsüberschuss p. a.“ | – | D.5 |
| KO7 | Quelle 4.2 | „Broschüre S. 11 (ohne EH-40-Zuschlag) / Planung PGN (EH 55)“ | – | B.2 |
| KO8 | Broschüren-Metadaten v2-1, C Jahr 2 | copy.md Anhang B (Eingaben 5.1–5.3, 3.1, Spalte F), plan.json, HTML-Kommentare S. 11/12 auf v3; C Jahr 2 −26.262 € (ungerundet −26.261,50 €) | – | Broschüre |
| KO9 | „Höchstwerte“ S. 11 | „Höchstsätze“ (JSON, Partial, copy.md); Gesamt-Build | – | Broschüre |

### L.2 Abgelehnt oder anders umgesetzt

| Befund | Abgelehnter Teil | Grund |
|---|---|---|
| FL4 (Teil) | „nicht über“ statt „unter“ | Vorgabe 8 schreibt „unter/über Orientierungswert“ vor. Der Gleichstand ist in A33 geregelt („Gleichstand gilt als „unter““) |
| V5 (Teil) | Zwischenwerte 1,25 / 1,75 / 2,25 / 2,75 % einklappen, Adressen gleich | gestrichen statt eingeklappt: Die Schwellen 4.9–4.11 geben die Wechselpunkte genau an, die Zwischenwerte tragen nichts bei. Adressen ändern sich ohnehin (Förderbarwert 1.9) |
| V5 (Option) | Zeile „Kernwerte“ über Block 1 | Doppelung; die Spaltenlogik D–G = Jahr 35 der Blöcke 5–7 wäre dort nicht einzuhalten. Mit den Verdichtungen stehen Finanzierung, Jahresrechnung und Liquidität auf Druckseite 1, Tilgung, Renditen und Prüfungen auf Seite 2 |
| V6 (Teil) | G53 „Beste“ | KO2 verlangt „höchster Überschuss“ (wie Broschüre S. 12); umgesetzt KO2 |
| KO6 (Teil) | Kopf „Jahresrechnung Jahr 1, in € p. a. (Broschüre S. 11)“ | 51 Zeichen, Bezeichnungen höchstens 45 (Vorgabe 10); Quelle steht als Bemerkung in Zeile 1 (H29) |
| KO10 | gebundene Miete auf volle Cent abrunden (`ROUNDDOWN`) | Die Mietobergrenze gilt für die Miete der Wohnung in Euro, nicht für den Quadratmeterpreis in Cent; die Mappe rechnet Durchschnittsmieten je m² über alle Wohnungen. Die Broschüre S. 7 zeigt mit „höchstens 7,21 / 7,65 €“ die auf Cent abgerundete Darstellung, das ist kein Widerspruch. Abrunden hieße die Referenzrechnung und die Sollwerte (PRUEFBERICHT 4.2) zu ändern. Wirkung (Modellhaus, RR): Zahlungsüberschuss A Jahr 4 −135 €, Jahr 35 −1.166 € (B −71 / −1.483 €, C −58 / −1.029 €); Objekt-IRR nach Zuschuss J42 −0,01 Pp, EK-IRR mit Restwert J42 A −0,02 Pp, VOFI −0,01 Pp. Begründet in D.2 A10 und Hinweis 6 („je m² ungerundet“) |

### L.3 Änderungen am Prüfskript

Konzeptänderungen (Adressen, Texte, Formeln) laut L.1 und D.5; Sollwerte der Referenzrechnung unverändert. Prüfskript-Korrekturen mit Begründung im Skriptkopf (Nr. 6, 7): F8 verlangt bei mehreren Nullstellen den Wert der RR (größte Nullstelle mit fallendem Barwert) statt jeder Nullstelle; „n. v.“ nur ohne RR-Wert oder unter der Kaskadengrenze −69 % (K.2 R1); NBank-Lage aus dem RR-Wert; neuer Fehlerlauf L42. Neue Identität F13: Rechenweg 4.13 − 4.14 − 4.15 = 4.16. Gegenprobe der Nullstellenregel außerhalb des Skripts: 28.650 Zahlungsreihen (89 Mappenläufe aus der Prüfung Runde 2, 360 RR-Varianten mit Tilgung 0–6 %, Mietsteigerung −5 bis +5 %, Kostensteigerung 0–10 %, Kosten × 0,8–2, Grundstück 0–3 Mio. €) mit der LibreOffice-Iteration nachgerechnet: alle gleich der RR-Konvention, außer 74 Reihen mit Nullstelle unter −69 % („n. v.“).

## M. Nacharbeit Runde 3 (Prüfbefunde vom 09.11.2026)

Zahlenwirkung auf L1 (Modellhaus) und L2 (Tarutinoer): keine.

| Kennung | Befund | Umsetzung |
|---|---|---|
| R | Anfangsmiete ohne Deckel durch die Marktmiete | Gefördert H109 mit `MIN(…; D7)`, Abweichung A11, Hinweis 6, `pruefe_vofi.py` (`startmiete`) |
| FL | Frei ohne Bestandsmietenlogik (§ 558 BGB) | nicht umgebaut; als Abweichung A12 mit Zahlenwirkung offengelegt, Hinweis 6 |
| V | Eingabe 6.1 wirkt zugleich als Abzinsung des Förderbarwerts | Bezeichnung 6.1 „Zins Bank, zugleich Abzinsung Förderbarwert“, Bemerkung 1.9 „steigt mit Eingabe 6.1“; eigene Eingabe bleibt offen (O12) |
| V | Druck Gefördert/Frei mit halb leeren Blockseiten | Umbrüche Gefördert nur nach Zeile 129, Frei ohne festen Umbruch (G.4) |
| KO | InDesign-Paket älter als PDF | `npm run indesign` neu, Zip neu gepackt |

