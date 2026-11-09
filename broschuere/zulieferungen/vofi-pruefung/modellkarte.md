# Modellkarte: PGN-VOFI-Modell v2-1

**Prüfgegenstand:** `broschuere/zulieferungen/PGN_NBank_VOFI_Modell_v2-1.xlsx` (SHA-256 `11d558b3…5e28b`). Die Originaldatei wurde nicht verändert, der Hash ist vor und nach der Prüfung gleich.
**Stand der Prüfung:** 09.11.2026. Internes Arbeitspapier, nicht zur Weitergabe an Dritte.

**Methode**
- Alle Formeln wurden mit openpyxl ausgelesen. Die zwischengespeicherten Ergebniswerte stammen aus `data_only=True`.
- Eine Kopie der Mappe wurde in LibreOffice 24.2 neu berechnet. Für das Szenario Basis weicht die Neuberechnung höchstens um 5·10⁻¹⁴ (relativ) vom Excel-Cache ab. Der Cache ist also konsistent.
- Best Case und Worst Case existieren nicht als Cache. Sie wurden nur in der Kopie berechnet.
- Jede Aussage nennt `Blatt!Zelle` oder einen benannten Bereich und die Formel.

**Wichtig vorab:** Die Mappe rechnet das **Referenzprojekt Tarutinoer Straße 4, Neu Wulmstorf** (`Eingabe!A1`).
- Eckdaten: 14 WE, 828 m² Wohnfläche, Mietenstufe VI, KG 200–700 = 2.963.412 €, Grundstück 0 €.
- Das ist **nicht** das Modellprojekt der Broschüre (20 WE, 1.400 m², 7,0 Mio. €, Mietenstufe IV).
- Ergebniswerte sind deshalb nicht auf die Broschüre übertragbar. Übertragbar sind nur die Annahmesätze (Abschnitt 2.4).

---

## 0. Kurzbefund

1. **Die Vermutung des Kunden trifft zu.** Das Modell hat keine dynamische Kennzahl in Objektsicht. Die Objektebene besteht nur aus der statischen Nettoanfangsrendite Jahr 1 (`Dashboard!C43:G43`) und einer Wertmarge bei Fertigstellung (`Dashboard!C44:G44`). Alle dynamischen Renditen sind Eigenkapitalrenditen vor Steuern.
2. **Die Paare „mit/ohne Restwert“ sind uneinheitlich.**
   - Mit Restwert gibt es zwei EK-Größen: die VOFI-EK-Rendite (`BW_Rendite`, 44,5 Jahre einschließlich Vorlaufzeit, Wiederanlage zum Guthabenzins) und den EK-IRR (`SA_Zahlungsstrom`, 42 Jahre ohne Vorlaufzeit, Wiederanlage implizit zum IRR).
   - Ohne Restwert gibt es nur die Endwertrendite ohne Objektwert (`BW_RenditeBew`). Einen EK-IRR ohne Restwert gibt es nicht.
   - Die drei vorhandenen EK-Größen haben verschiedene Zeitbasen und Wiederanlageannahmen. Sie sind deshalb nicht direkt vergleichbar.
3. **„Restwert“ heißt im Modell:** voller Verkehrswert am Horizont, ermittelt als Ertragswert aus **Marktmiete** (`Bewertung!L30:L34` = `SA_EW_vorlaeufig` − `SA_BoG`).
   - Gebäude und Boden werden nicht getrennt. Der Boden ist ohnehin mit 0 € angesetzt (`Eingabe!C15` = 0).
   - Am Horizont ist der Bindungsabschlag konstruktionsbedingt null (`BoG_Grenze` = `Jahre_n` = 42). Die geförderten Mieten liegen in T42 aber noch 23–42 % unter der Marktmiete (Abschnitt 4.2, Nr. 5).
4. **Für die Überkompensation verwendet das Modell die VOFI-Endwertrendite.** Es nutzt weder einen IRR noch den Betrauungszeitraum (`Ueberkompensation!C11:D15`). Mit Restwert wird der Grenzwert von 4,39 % überschritten (6,38–6,49 %), ohne Restwert eingehalten (3,35–3,74 %). Das Ergebnis hängt also allein an der Definition.
5. **Die Rechentechnik ist sauber.**
   - In allen fünf Szenarioblättern steht pro Spalte durchgehend dieselbe relative Formel (Zeilen 6–56). Neun Bestandsidentitäten werden je Zeile geprüft, alle mit „ok“.
   - Es gibt keine expliziten Blattbezüge; alles läuft über 384 benannte Bereiche.
   - Einziger Formelfehler mit Bezug zu den Renditen: `Frei_Marktmiete!AJ6:AJ56` greift auf `BW_Alt,4` statt `5` zu. Numerisch hat das derzeit keine Wirkung.

---

## 1. Blätter und Datenfluss

### 1.1 Zweck der Blätter

| Blatt | Formeln | Zweck |
|---|---:|---|
| Dashboard | 242 | Kennzahlen je Handlungsalternative in den Spalten C–G (A, B, C, Frei obere Kante, Frei untere Kante): Kapitalstruktur, Mieten, Bankfähigkeit (DSCR, ICR, Debt Yield, LTV), Ausgleichskonto, Objektwert/Endwert, EK-Renditen, Kontrollen. `A2`: „Orientierungsrechnung … Vor Ertragsteuern.“ |
| Eingabe | 76 | Alle Eingaben (blaue Zellen) mit Quellen. Szenariowahl `C6`. Nachschlagetabellen für Mietenstufen (`B117:G119`), Liegenschaftszins (`B123:C129`) und Margenstaffel (`B133:C136`). |
| Basisdaten | 110 | Festwerte (`C6:C13`) und abgeleitete Größen: Kosten, Mieten, Förderbeträge, Bankdarlehen, Annuitäten, Eigenkapital, Eigenmittelprüfung, Kontoauswertung. |
| Gefoerdert_A / _B / _C | je 1.836 | VOFI je Einkommensgruppe. Jahre T0–T50 in den Zeilen 6–56, gerechnet bis `Jahre_n` = 42. Spalten A–AK, siehe Abschnitt 3. |
| Frei_finanziert | 1.836 | VOFI ohne Förderung, „obere Kante“. Startmiete aus dem DSCR-Ziel. |
| Frei_Marktmiete | 1.836 | VOFI ohne Förderung, „untere Kante“. Startmiete = marktüblich erzielbare Miete. |
| Szenarien | 20 | Best / Basis / Worst für sechs korrelierte Treiber, `G5:I10`. |
| Bewertung | 390 | Ertragswert und Verkehrswert zu sechs Stichtagen × fünf Alternativen (`B5:Q34`). Endwert und die beiden VOFI-EK-Renditen. |
| Ueberkompensation | 26 | Safe-Harbour-Vergleich nach RL Nr. 5.3.7 / 11.10. |
| Finanzierung | 150 | Tranchenübersicht T0 je Alternative. Reine Darstellung, keine Rückwirkung. |
| Modellannahmen | 3 | Textkatalog der Annahmen und Vorbehalte. Die drei Formeln setzen nur Texte zusammen. |

### 1.2 Datenfluss

Abgeleitet aus den benannten Bereichen (Skript `dataflow.py`, Ergebnis `dataflow.csv`).

```
Szenarien (SZ_*) ──INDEX(…,Szenario_Nr)──► Eingabe (C18, C25, C53, C71, C84, C103)
Eingabe ──► Basisdaten ──► Gefoerdert_A/B/C, Frei_finanziert, Frei_Marktmiete
                  ▲                │  (SA_/SB_/SC_/SF_/SM_*)
                  │                ├──► Bewertung (Konto, Restschuld, Vervielf., Ertragswert, boG)
                  │                │         │
                  │                │         ├──► Szenarioblätter, Spalte AJ in T=n (BW_EW, Restwert für den IRR)
                  │                │         ├──► Dashboard (BW_*)
                  │                │         └──► Ueberkompensation (BW_Rendite, BW_RenditeBew)
                  │                └──► Dashboard (SA_* … SM_*)
                  └── Rückflüsse: Beleihungswert C76 ← SA_EW_vorlaeufig(T0); Miete_Frei_Erforderlich C50 ← MAX(SF_Mietbedarf);
                      Fehlbetragsjahre C45 ← SA/SB/SC_Saldo; Kontoauswertung C145:C147 ← *_Konto
Basisdaten ──► Finanzierung (nur Darstellung)
```

Der Rückfluss über den Beleihungswert erzeugt keinen Zirkel. `Basisdaten!C76` speist nur den Auslauf (`C80` ff.). Das Bankdarlehen hängt nicht vom Beleihungswert ab, weil die Zinsstaffel aus ist (`Eingabe!C55` = 0).

Auf `Finanzierung` und `Modellannahmen` greift kein anderes Blatt zu.

---

## 2. Eingaben

### 2.1 Eingabe (Auswahl, Szenario Basis)

**Objekt**

| Zelle | Name | Wert | Bemerkung |
|---|---|---|---|
| C6 | `Szenario` | Basis | → `Basisdaten!C17` `Szenario_Nr` = 2 |
| C10 / C11 | `Fertigstellungsjahr` / `Jahre_n` | 2027 / 42 | T0 = Bezugsfertigkeit. Bewirtschaftung 2028–2069. |
| C12 / C13 | `Wohnflaeche` / `Wohneinheiten` | 828 m² / 14 | |

**Grundstück und Kosten**

| Zelle | Name | Wert | Bemerkung |
|---|---|---|---|
| C15 / C16 / C17 | `KG_Grundstueck_VW` / `_KP` / `Grundstueck_Ansatz` | 0 € / 0 € / „Verkehrswert“ | **Grundstück 0 €.** Wirkt auf Gesamtkosten, Eigenkapital und Bodenwert (`Basisdaten!C23`). |
| C18 | `KG_Herstellung` | `=INDEX(SZ_KG_Herstellung,Szenario_Nr)` → 2.963.412 € | Formel in einer Eingabezelle, Quelle `Szenarien!H6` `=3579*Wohnflaeche` |
| C19 / C90 | `KG_Finanzierung` / `KG_Grundstueck_NK` | 0 / 0 | |
| C20 / C21 | `Bodenrichtwert_qm` / `Bodenwert_Modell_qm` | 260 / 600 €/m² | C21 wird nur in einem Text verwendet. `E21` warnt, dass die Liegenschaftszinskurve beim Bodenwert 0 nicht modellkonform ist. |

**Förderung**

| Zelle | Name | Wert | Bemerkung |
|---|---|---|---|
| C25 / C26 | `Laufzeit_NBank` / `Tilgungsfrei_NBank` | `=INDEX(SZ_Laufzeit_NBank,…)` → 40 J. / 0 | Worst Case: 33 J. |
| C27–C31, C35 | `Quote_D_*`, `Quote_Z_*` | A 40/40, B 60/20, C 70/10 % | wie in der Broschüre |
| C36 / C37 | `Mietenstufe` / `Effizienzstandard` | VI / EH 55 | Band 2, Mieten 6,80 / 8,20 / 9,00 €/m² (`Basisdaten!C41:C43`) |
| C39 / C41 | `Bindung` / `Zinsfrei_Jahre` | 35 / 35 | |
| C42 / C43 | `Zins_NBank_1_35` / `_ab36` | 0 % / 3,74 % | Satz ab T36 gesetzt, nicht aus dem Basiszins hergeleitet (`E43`) |
| C44–C47 | `VKB_Satz`, `BE_Darlehen`, `BE_Zuschuss`, `BE_in_KG800` | 0,5 %, 1 %, 0,75 %, 0 | Verwaltungskostenbeitrag erst ab T1 (`E44`) |

**Bankfinanzierung**

| Zelle | Name | Wert | Bemerkung |
|---|---|---|---|
| C51–C53 | `Zins_Bank`, `Zinsbindung`, `Zins_Anschluss` | 3,74 %, 10 J., `=INDEX(SZ_Zins_Anschluss,…)` 3,74 % | |
| C54 | `Tilgung_Bank` | `=IF(Zins_Bank_F=0,1/30,Zins_Bank_F/((1+Zins_Bank_F)^30-1))` → 1,862 % | Annuität auf 30 Jahre. Der Text in `E51` nennt „2 %“. |
| C58 | `Prolongation` | 2 | Rate hält die Restlaufzeit |

**Mieten und Bewirtschaftung**

| Zelle | Name | Wert | Bemerkung |
|---|---|---|---|
| C63–C67 | Anker der Marktmiete | 11,70 €/m² (2023) / 15,42 €/m² (2026), Mittelwert | → `Marktmiete_Start` 14,48 €, `OVM_Start` 12,92 € |
| C69 | `Miete_Frei_Start` | **18,8006032 (fester Wert)** | Kopie von `Basisdaten!C50`. Passt nur im Szenario Basis. |
| C70 / C71 / C72 | `DSCR_Ziel` / `Miet_Faktor` / `OVM_Wachstum` | 1,25 / 1,0 (Szenario) / 2,0 % | |
| C73–C79 | Karenz, Rhythmus, Kappung, Marktlage | 3 J., 3 J., 6,15 %, angespannt bis 2029, 15 % / 20 % | |
| **C80** | `Verwaltung_WE` | **367 €/WE·a** | ImmoWertV Anlage 3, „fortgeschrieben auf 2026“ |
| **C81** | `Instandhaltung_qm` | **14,40 €/m²·a** | ebenso |
| **C82 / C83** | `Mietausfall` / `Mietausfall_Frei` | **2 % / 2 %** | ImmoWertV Anlage 3 |
| C84 | `Kosten_Wachstum` | `=INDEX(SZ_Kosten_Wachstum,…)` → 2,0 % | |

**Eigenkapital**

| Zelle | Name | Wert | Bemerkung |
|---|---|---|---|
| C88 | `EK_bar` | `=0.2*Zuwendungsfaehig` → 592.682 € | Formel in einer Eingabezelle |
| C89 | `Eigenleistungen_Sach` | 0 | wirkt nur auf die Eigenmittelprüfung |

**Ergebnisverwendung, Bewertung und Zeit**

| Zelle | Name | Wert | Bemerkung |
|---|---|---|---|
| C99–C102 | `Entnahme_Modus`, `Haben`, `Soll`, `Kontokorrentlinie` | 0 = Thesaurierung, 2 %, 5 %, 0 € | |
| C103 / C104 / C105 / C106 | `LZ_Zuschlag` / `BoG_bis` / `GND` / `Bodenwert_Wachstum` | 0 (Szenario) / „Horizont“ / 80 J. / 1,5 % | |
| C107 / C108 | `Vorlaufzeit_Jahre` / `Inflation` | 2,5 J. / 2 % | Vorlaufzeit wirkt nur im Exponenten von `BW_Rendite` und `BW_RenditeBew` |
| C109–C114 | `Stichtag_1…6` | 0, 1, 10, 30, 35, 42 | Bewertungsstichtage |

### 2.2 Szenarien (`Szenarien!G5:I10`; Best / Basis / Worst)

| Treiber | Best | Basis | Worst |
|---|---|---|---|
| Anschlusszins (`SZ_Zins_Anschluss`) | 2,74 % | 3,74 % | 4,74 % |
| KG 200–700 (`SZ_KG_Herstellung`) | 2.815.241 € | 2.963.412 € | 3.407.924 € |
| Mietniveau (`SZ_Miet_Faktor`) | 1,05 | 1,00 | 0,95 |
| Kostensteigerung (`SZ_Kosten_Wachstum`) | 1,5 % | 2,0 % | 2,5 % |
| Laufzeit NBank (`SZ_Laufzeit_NBank`) | 40 J. | 40 J. | 33 J. |
| Zuschlag Liegenschaftszins (`SZ_LZ_Zuschlag`) | −0,3 Pp | 0 | +0,6 Pp |

`Szenarien!A2` spricht von „fünf Größen“, `Eingabe!E6` von „sechs Treibern“ und zählt fünf auf. Tatsächlich sind es sechs Zeilen.

### 2.3 Basisdaten: Festwerte und Schlüsselgrößen

**Festwerte**
- `C6` 50 Jahreszeilen, `C8` Toleranz 0,01 €.
- `C9` 42 J. Höchstlaufzeit, `C10` 5 J. Tilgungsstreckung.
- `C11` 80 % Förderhöchstsatz.
- `C12` 20 % Eigenmittel, `C13` 50 % davon hart.

**Abgeleitete Kosten**
- `C27` `Zuwendungsfaehig` `=KG_Grundstueck_gedeckelt+KG_Herstellung_gedeckelt` = 2.963.412 €.
- `C32` `Barbedarf` `=KG_Herstellung+KG_Finanzierung_eff+KG_Grundstueck_NK` = 2.963.412 €.
- `C33` `Gesamtkosten` `=KG_Grundstueck+KG_Grundstueck_NK+KG_Herstellung+KG_Finanzierung_eff` = 2.963.412 €.

**Förderung und Tilgung**
- `C61/C65/C69` `Darlehen_*` `=Zuwendungsfaehig*Quote_D_*`.
- `C63/C67/C71` `Zuschuss_*` `=Zuwendungsfaehig*Quote_Z_eff_*`.
- `C62/C66/C70` `Tilgungsrate_*` `=IFERROR(Darlehen_*/MAX(1,Laufzeit_NBank-Tilgungsfrei_NBank),0)`. Das ist eine **lineare Ratentilgung mit festem Betrag**: 29.634 € (A) = 2,5 % des Ursprungsdarlehens p. a.
- `C64/C68/C72` `Entgelt_*` `=IF(BE_in_KG800=1,0,Darlehen_*·BE_Darlehen+Zuschuss_*·BE_Zuschuss)`. Ergebnis: 20.744 / 22.226 / 22.966 €.

**Bankdarlehen**
- `C78/C89/C100` `Bank_*` `=MAX(0,Barbedarf-Darlehen_*-Zuschuss_*+Entgelt_*-EK_bar)`. In den geförderten Varianten ist das genau das Bearbeitungsentgelt, das Entgelt wird also mit einem kleinen Bankdarlehen finanziert.
- `C111` `Bank_F` `=MAX(0,Barbedarf-EK_bar)` = 2.370.730 €.

**Eigenkapital**
- `C126` `Eigenkapital` `=KG_Grundstueck+EK_bar` = 592.682 €, laut `D126` der „Nenner aller Renditen“.

### 2.4 Die vier Annahmen für die Broschüren-Jahresrechnung (S. 11/12)

| Broschürenzeile | Modellwert | Fundstelle und Formel | Anmerkung |
|---|---|---|---|
| Mietausfall/Leerstand in % der Sollmiete | **2,0 %** | `Eingabe!C82` `Mietausfall`. Wirkt in `Gefoerdert_A!G7` als `+Mietausfall*F7` (2 % des Rohertrags). Frei: `Eingabe!C83` 2,0 %. | Im Modell als Aufwand in der Bewirtschaftung, nicht als Erlösschmälerung. Rechnerisch ist das gleich. |
| nicht umlagefähige Bewirtschaftungskosten je Wohnung p. a. | **367 €/WE·a** (Verwaltung) | `Eingabe!C80` `Verwaltung_WE`. In `G7`: `(Verwaltung_WE*Wohneinheiten+…)*(1+Kosten_Wachstum)^($A7-1)`. | Die einzige nicht umlagefähige Position außer Instandhaltung und Mietausfall. Weitere nicht umlagefähige Betriebskosten sind nicht modelliert. |
| Instandhaltung je m² p. a. | **14,40 €/m²·a** | `Eingabe!C81` `Instandhaltung_qm`, ebenfalls in `G7` | Gleichmäßiger Jahresaufwand, keine Modernisierungszyklen (`Modellannahmen!C10`, `C27`) |
| Tilgungssatz NBank-Darlehen | **2,5 % p. a. des Ursprungsdarlehens, linear** (Basis und Best). Worst Case 3,03 % (33 J.). | `Basisdaten!C62` `=IFERROR(Darlehen_A/MAX(1,Laufzeit_NBank-Tilgungsfrei_NBank),0)`; `Finanzierung!F5` `=Tilgungsrate_A/MAX(Darlehen_A,1)` = 0,025. Tilgungsbeginn T1, da `Tilgungsfrei_NBank` = 0. | Ergibt sich aus der angenommenen Laufzeit von 40 J. (`Szenarien!H9`). Die RL nennt keinen Satz. Restschuld Ende T35 = 12,5 % (`Finanzierung!I5`). Das Bankdarlehen ist dagegen eine Annuität mit 1,86 % Anfangstilgung (`Eingabe!C54`). |

Kostenbasis „2026“: Verwaltung und Instandhaltung werden in `G7` erst ab T1 = 2028 mit dem Exponenten 0 fortgeschrieben. Die zwei Jahre 2026 bis 2028 fehlen, bei 2 % p. a. sind das rund 4 % zu niedrige Bewirtschaftungskosten.

---

## 3. Aufbau eines Szenarioblatts (Muster `Gefoerdert_A`)

Zeile 6 ist T0, Zeile 7 ist T1, …, Zeile 48 ist T42. Die Zeilen 49–56 (T43–T50) rechnen null.

Bezüge auf das Vorjahr sind relativ (`C6` bezieht sich auf `C5`) und werden mit `N()` neutralisiert. Formeln unten in der Form für T1 (Zeile 7). Die Werte sind der Cache im Szenario Basis.

**Zeitachse und Mieten**

| Sp. | Inhalt | Formel (Zeile 7) | T1 |
|---|---|---|---:|
| A / B | t / Kalenderjahr | Konstante 0…50; `=Fertigstellungsjahr+$A7` | 1 / 2028 |
| C | gebundene Miete €/m² | `=IF(OR($A7=0,$A7>Jahre_n),0,IF($A7=1,Startmiete_A,IF(AND($A7>Karenz_Jahre,MOD($A7-1-Karenz_Jahre,Anpassung_Rhythmus)=0),MAX(N(C6),MIN(N(C6)*(1+IF($A7<=Bindung,Kappung,IF(AND(Marktlage="angespannt",OR(Marktlage_bis=0,Fertigstellungsjahr+$A7<=Marktlage_bis)),Kappung_angespannt,Kappung_normal))),D7)),N(C6))))`. Erhöhung in T4, T7, …: bis T35 um 6,15 %, danach um 15 % bzw. 20 %, gedeckelt durch die Vergleichsmiete D. | 6,80 |
| D | ortsübliche Vergleichsmiete | `=…OVM_Start*(1+OVM_Wachstum)^($A7-1)` | 12,92 |
| E | Marktmiete | `=…Marktmiete_Start*(1+OVM_Wachstum)^($A7-1)` | 14,48 |

**Einzahlungen und Bewirtschaftung**

| Sp. | Inhalt | Formel (Zeile 7) | T1 |
|---|---|---|---:|
| F | Rohertrag | `=C7*Wohnflaeche*Monate_Jahr` | 67.565 |
| G | Bewirtschaftung | `=…(Verwaltung_WE*Wohneinheiten+Instandhaltung_qm*Wohnflaeche)*(1+Kosten_Wachstum)^($A7-1)+Mietausfall*F7` | 18.412 |
| H | Reinertrag | `=F7-G7` | 49.152 |

**Kapitaldienst NBank**

| Sp. | Inhalt | Formel (Zeile 7) | T1 |
|---|---|---|---:|
| I | NBank-Zins | `=…N(V6)*IF($A7<=Zinsfrei_Jahre,Zins_NBank_1_35,Zins_NBank_ab36)` | 0 (ab T36: 3,74 %) |
| J | NBank-Tilgung | `=IF(OR($A7=0,$A7>Jahre_n,$A7<=Tilgungsfrei_NBank),0,MIN(Tilgungsrate_A,N(V6)))` | 29.634 |
| K | Verwaltungskostenbeitrag | `=…N(V6)*VKB_Satz` | 5.927 |

**Kapitaldienst Bank**

| Sp. | Inhalt | Formel (Zeile 7) | T1 |
|---|---|---|---:|
| L | Bankzins | `=…N(W6)*IF($A7<=Zinsbindung,Zins_Bank_A,Zins_Anschluss_A)` | 776 |
| M | Banktilgung | `=…MAX(0,MIN(IF($A7>Zinsbindung,AnnuitaetP_A,Annuitaet_A)-L7,N(W6)))` | 386 |
| N | Kapitaldienst | `=I7+J7+K7+L7+M7` | 36.723 |

**Finanzierung in T0**

| Sp. | Inhalt | Formel | T0 |
|---|---|---|---:|
| O | Auszahlung T0 | `=IF($A6=0,-(Barbedarf+Entgelt_A),0)` | −2.984.156 |
| P | Mittelherkunft T0 | `=IF($A6=0,Darlehen_A+Zuschuss_A+Bank_A+EK_bar,0)` | 2.984.156 |

Der Zuschuss ist reine Mittelherkunft. Das Bearbeitungsentgelt ist eine Auszahlung in T0.

**Ergebnisverwendung**

| Sp. | Inhalt | Formel (Zeile 7) | T1 |
|---|---|---|---:|
| Q | Cashflow nach Kapitaldienst | `=O7+P7+H7-N7` | 12.429 |
| R / S | Sondertilgung (Modus 2) / Entnahme (Modus 1) | `=IF(AND(Entnahme_Modus=2,…),MAX(0,MIN(Q7,N(W6)-M7)),0)` / `=IF(AND(Entnahme_Modus=1,…),MAX(0,Q7),0)` | 0 / 0 |
| T | Saldo ins Konto | `=Q7-R7-S7` | 12.429 |
| U | Kontozinsen (Wiederanlage bzw. Kontokorrent) | `=…N(Y6)*IF(N(Y6)>=0,Haben,Soll)` | 0 (T2: 249) |

**Bestandsgrößen**

| Sp. | Inhalt | Formel (Zeile 7) | T1 |
|---|---|---|---:|
| V | Restschuld NBank | `=IF($A7=0,Darlehen_A,MAX(0,N(V6)-J7))` | 1.155.731 |
| W | Restschuld Bank | `=IF($A7=0,Bank_A,MAX(0,N(W6)-M7-R7))` | 20.358 |
| X | Restschuld gesamt | `=V7+W7` | 1.176.088 |
| Y | VOFI-Konto | `=IF($A7=0,T7,N(Y6)+U7+T7)` | 12.429 (T42: 2.562.722) |

**Ertragswert je Jahr (Restwert)**

| Sp. | Inhalt | Formel (Zeile 7) | T1 |
|---|---|---|---:|
| Z | Reinertrag zur Marktmiete im Folgejahr | `=…Marktmiete_Start*(1+OVM_Wachstum)^$A7*Wohnflaeche*Monate_Jahr*(1-Mietausfall)-(Verwaltung_WE*Wohneinheiten+Instandhaltung_qm*Wohnflaeche)*(1+Kosten_Wachstum)^$A7` | 126.417 |
| AA | Liegenschaftszinssatz | `LZ_Zuschlag` + lineare Interpolation in `LZ_RND`/`LZ_Satz` über RND = `GND-$A7`, an den Rändern gekappt | 3,10 % (T42: 2,70 %) |
| AB | Vervielfältiger | `=…((1+AA7)^(GND-$A7)-1)/((1+AA7)^(GND-$A7)*AA7)` | 29,37 |
| AC | vorläufiger Ertragswert | `=…KG_Grundstueck*(1+Bodenwert_Wachstum)^$A7+MAX(0,Z7-KG_Grundstueck*(1+Bodenwert_Wachstum)^$A7*AA7)*AB7`. Mit Bodenwert 0 also nur Reinertrag × Vervielfältiger. | 3.712.361 |
| AD | Abschlag Mietbindung (boG) | verkürzt: `=SUMPRODUCT((SA_t>$A7)*(SA_t<=BoG_Grenze)*(E_{t+1}>SA_Miete)*(E_{t+1}-SA_Miete)*Wohnflaeche*Monate_Jahr*(1-Mietausfall)/(1+AA7)^(SA_t-$A7))`, wobei E_{t+1} = `INDEX(SA_Marktmiete,MATCH($A7+1,SA_t,0))`, also die Marktmiete des Folgejahres, konstant gehalten | 1.159.554 |
| AE | Verkehrswert | `=AC7-N(AD7)` | 2.552.806 |

**Kennzahlen, Rendite-Zahlungsreihe und Kontrolle**

| Sp. | Inhalt | Formel (Zeile 7) | T1 |
|---|---|---|---:|
| AF / AG / AH | DSCR / LTV am vorl. Ertragswert / LTV am Verkehrswert | `=H7/N7`; `=X7/AC7`; `=X7/AE7` | 1,338 / 31,7 % / 46,1 % |
| AI | Mietbedarf für das DSCR-Ziel | `=(DSCR_Ziel*N7+G7-Mietausfall*F7)/(F7*(1-Mietausfall))*INDEX(SA_Miete,MATCH(1,SA_t,0))` | 6,47 |
| **AJ** | **Zahlungsstrom für den EK-IRR** | `=IF($A7=0,T7-Eigenkapital,IF($A7>Jahre_n,0,T7+S7+IF($A7=Jahre_n,IFERROR(AVERAGEIFS(BW_EW,BW_n,Jahre_n,BW_Alt,1),0)-X7,0)))` | T0 −592.682; T1 12.429; T42 6.858.928 |
| AK | Kontrolle: neun Identitäten je Zeile | Restschulden, Konto, Kapitaldienst, Rohertrag, Reinertrag, Cashflow, Saldo, Jahr | alle „ok“ |

**Was das Szenarioblatt enthält und was nicht**
- **Steuern:** keine. Keine Formel enthält AfA, Steuer oder § 7b. Der Ausschluss ist bewusst (`Dashboard!A2`, `Modellannahmen!C21`).
- **Wiederanlage:** Überschüsse werden zu 2 % angelegt, Unterdeckungen zu 5 % finanziert (Spalten U und Y).
- **Restwert:** erscheint im Blatt nur in AJ im Horizontjahr, übernommen aus `Bewertung` (`BW_EW`).
- **Endvermögen:** steht nicht im Szenarioblatt, sondern in `Bewertung!M` (Konto + Verkehrswert − Restschuld).

### 3.1 Abweichungen der anderen Szenarioblätter

Geprüft mit `diff_sheets.py`. Die Formeln wurden normalisiert: Präfix SA→SX, Suffix _A→_X, `BW_Alt`-Index, relative Zeilenbezüge. Ergebnis in `diff_sheets.txt`.

**Gefoerdert_B, Gefoerdert_C:** strukturell identisch mit A. Nur die Titel in A1/A2 unterscheiden sich.

**Frei_finanziert:** zehn Spalten weichen ab.

| Spalte | Abweichung |
|---|---|
| C | `=…Miete_Frei_Start*(1+OVM_Wachstum)^($A-1)`: jährliche Steigerung, keine Kappung |
| G, AI | `Mietausfall_Frei` statt `Mietausfall` |
| I, J, K, V | `=0` (kein Förderdarlehen) |
| O | `=-(Barbedarf+0)` (kein Bearbeitungsentgelt) |
| P | `=0+0+Bank_X+EK_bar` |
| AD | `=0` (kein Bindungsabschlag) |

**Frei_Marktmiete:** wie Frei_finanziert. Zusätzlich:
- C = `Marktmiete_Start*(1+OVM_Wachstum)^($A-1)`.
- L, M und W verweisen fest auf `Zins_Bank_F`, `Annuitaet_F` und `Bank_F` (dasselbe Bankdarlehen wie Frei_finanziert).
- **AJ verweist auf `BW_Alt,4` statt `5`**, also auf den Verkehrswert von „Frei, obere Kante“. Das ist ein Kopierfehler. Er wirkt derzeit nicht, weil der Ertragswert objektbezogen ist und bei den freien Varianten kein Abschlag anfällt.

**Zeilenkonsistenz** (`row_consistency.py`): In allen fünf Blättern hat jede Spalte von Zeile 6 bis 56 dieselbe relative Formel. Es gibt keine überschriebenen Einzeljahre.

---

## 4. Renditekennzahlen im Einzelnen

Grundlagen, die für alle Kennzahlen gelten:
- **Eigenkapital** = `Basisdaten!C126` `=KG_Grundstueck+EK_bar` = 0 + 592.682 €. Es ist in allen fünf Alternativen gleich. Eigenleistungen gehören nicht dazu.
- **Steuern:** alle Kennzahlen sind vor Steuern und nominal, mit Ausnahme von K4.
- **Szenarioblätter:** enthalten selbst keine Rendite, nur die Zahlungsreihe AJ. Auch das Blatt `Szenarien` enthält keine Renditekennzahl, nur die Treiberwerte.

### K1 Nettoanfangsrendite Jahr 1 (`Dashboard!C43:G43`)

**Formel:** `=IFERROR(INDEX(SA_Reinertrag,MATCH(1,SA_t,0))/Gesamtkosten,"n. v.")`

- **Sicht:** Objekt, statisch, nur ein Jahr (T1).
- **Restwert:** nein.
- **Zähler:** Reinertrag zur gebundenen Ist-Miete, also nach Verwaltung, Instandhaltung und Mietausfall.
- **Nenner:** `Gesamtkosten` (KG 100 + 120 + 200–700 + 800), ohne Bearbeitungsentgelt. Der **Zuschuss wird nicht abgezogen**.
- **Finanzierung:** Darlehen, Zuschuss und Entgelte spielen keine Rolle.

**Werte Basis:** A 1,66 % · B 2,12 % · C 2,38 % · Frei oben 5,60 % · Frei unten 4,18 %.

### K2 Vorläufiger Wertüberschuss bei Fertigstellung (`Dashboard!C44:G44`)

**Formel:** `=IFERROR(AVERAGEIFS(BW_Marktwert,BW_n,0,BW_Alt,1)/Gesamtkosten-1,"n. v.")`

- Vorläufiger Ertragswert in T0 (vor dem Bindungsabschlag) im Verhältnis zu den Gesamtkosten.
- Das ist eine Marge, **keine Rendite p. a.**
- Objektsicht, ohne Finanzierung, in allen Alternativen gleich: **23,2 %**.

### K3 VOFI-EK-Rendite nominal

**Fundstellen**
- `Bewertung!N5:N34` = `BW_Rendite`, an sechs Stichtagen.
- `Dashboard!C55:G55` `=IFERROR(AVERAGEIFS(BW_Rendite,BW_n,Jahre_n,BW_Alt,k),"n. v.")`.
- `Ueberkompensation!C11:C15`.

**Formel** (`Bewertung!N30`, analog): `=IF(AND(M30>0,Eigenkapital>0,$B30>0),(M30/Eigenkapital)^(1/($B30+Vorlaufzeit_Jahre))-1,"n. v.")`
mit dem Endwert `M30` `=D30+L30-E30`:
- D = Konto: `INDEX(SA_Konto,…)`
- L = Verkehrswert: `J30-K30` = `SA_EW_vorlaeufig` − `SA_BoG`
- E = Restschuld: `INDEX(SA_Rest,…)`

**Eigenschaften**
- **Sicht:** Eigenkapital. Endwertverfahren: ein Einsatz, ein Endwert. Die Überschüsse werden über das Konto mit 2 % / 5 % thesauriert.
- **Restwert:** ja, voller Verkehrswert nach § 194 BauGB am Stichtag (Ertragswert aus Marktmiete abzüglich Bindungsabschlag). Am Horizont ist der Abschlag 0.
- **Finanzierung:**
  - Zuschuss, Darlehen und Bankdarlehen sind T0-Mittelherkunft (`P6`).
  - Tilgung, VKB und Zinsen mindern über N die Überschüsse.
  - Das Bearbeitungsentgelt ist in T0 Auszahlung (`O6`), finanziert über `Bank_A`.
  - Die Restschuld wird zum Nennwert abgezogen; in T42 ist sie überall 0.
- **Zeitraum:** Exponent `Jahre_n + Vorlaufzeit_Jahre` = 44,5 Jahre. Das Eigenkapital gilt 2,5 Jahre vor T0 als ertraglos gebunden.

**Werte T42 Basis:** A 6,38 % · B 6,44 % · C 6,49 % · Frei oben 7,62 % · Frei unten 6,91 %.

### K4 VOFI-EK-Rendite real (`Dashboard!C56:G56`)

**Formel:** `(1+BW_Rendite)/(1+Inflation)-1`, wobei `Inflation` = 2 % (`Eingabe!C108`). Sonst wie K3.

**Werte:** A 4,29 % · B 4,35 % · C 4,41 % · Frei oben 5,51 % · Frei unten 4,81 %.

### K5 Endwertrendite ohne Objektwert

**Fundstellen**
- `Bewertung!O5:O34` = `BW_RenditeBew`.
- `Dashboard!C57:G57` „Endwertrendite ohne Wertansatz der Immobilie“.
- `Ueberkompensation!D11:D15`.

**Formel** (`Bewertung!O30`): `=IF(AND(D30-E30>0,Eigenkapital>0,$B30>0),((D30-E30)/Eigenkapital)^(1/($B30+Vorlaufzeit_Jahre))-1,"n. v.")`

**Eigenschaften**
- **Sicht:** Eigenkapital, Endwert = Konto − Restschuld.
- **Restwert:** nein, er wird vollständig auf null gesetzt, für Gebäude und Boden zugleich. Eine Variante „ohne Gebäude-Restwert, Boden bleibt“ gibt es nicht.
- **Zeitraum:** wie K3, 44,5 Jahre.

**Werte T42:** A 3,35 % · B 3,56 % · C 3,74 % · Frei oben 6,27 % · Frei unten 4,85 %.

### K6 EK-IRR, levered (`Dashboard!C58:G58`)

**Formel:** `=IFERROR(IRR(SA_Zahlungsstrom),IFERROR(IRR(SA_Zahlungsstrom,0.02),IFERROR(IRR(SA_Zahlungsstrom,-0.2),"n. v.")))` auf `Gefoerdert_A!AJ6:AJ56`. Formel von AJ siehe Abschnitt 3.

**Zahlungsreihe**
- T0: −Eigenkapital.
- T1–T41: Saldo + Entnahme (= Q − R).
- T42: zusätzlich Verkehrswert (`BW_EW`) − Restschuld.

**Eigenschaften**
- **Sicht:** Eigenkapital, nach vollem Kapitaldienst. Ausdrücklich „kein Projekt-IRR“ (`Dashboard!H58`).
- **Restwert:** ja.
- **Zeitraum:** 42 Jahre **ohne** Vorlaufzeit.
- **Wiederanlage:** keine explizite, Kontozinsen gehen nicht ein. Der IRR unterstellt implizit Wiederanlage zum IRR.
- **Finanzierung:** wie K3.

**Werte:** A 7,92 % · B 7,93 % · C 8,02 % · Frei oben 12,25 % · Frei unten 8,29 %.

### K7 Abstand zum Grenzwert (`Ueberkompensation!E11:E15`)

**Formel:** `=IF(ISNUMBER(C11),C11-DAWI_Grenzwert,"n. v.")`. Das ist K3 minus 4,39 %.

**Werte:** A +1,99 Pp · B +2,05 Pp · C +2,10 Pp.

### Nebenkennzahlen ohne Renditecharakter

- **Debt Yield** (`Dashboard!C27`): `Reinertrag T1 / SA_Rest(T0)`. Bezugsgröße ist das Fremdkapital einschließlich NBank-Darlehen. Werte 4,1 % / 3,5 % / 3,4 % / 7,0 % / 5,2 %.
- **DSCR** (`SA_DSCR` = H/N): enthält den Verwaltungskostenbeitrag.
- **ICR** (`C26`).
- **LTV** (`SA_Auslauf`, `SA_Auslauf_VW`).

### 4.1 Matrix Objekt/EK × mit/ohne Restwert (Basis, Gefördert A / B / C)

| | mit Restwert | ohne Restwert |
|---|---|---|
| **Objekt (unlevered, vor Steuern)** | **im Modell: keine Rendite.** Nur K2 (Marge 23,2 % in T0). | **im Modell: nur K1**, statisch Jahr 1: 1,66 / 2,12 / 2,38 % |
| **Eigenkapital (levered, vor Steuern)** | K3 VOFI: 6,38 / 6,44 / 6,49 % (44,5 J., 2 %-Wiederanlage). K6 IRR: 7,92 / 7,93 / 8,02 % (42 J.) | K5: 3,35 / 3,56 / 3,74 % (44,5 J.). **EK-IRR ohne Restwert: fehlt** |

**Kontrollrechnung für die fehlenden Felder** (nicht im Modell; `kontrollrechnung.py`, Basis):

| | A | B | C | Frei oben | Frei unten |
|---|---:|---:|---:|---:|---:|
| EK-IRR ohne Restwert (AJ ohne `BW_EW` in T42) | 4,68 % | 4,92 % | 5,19 % | 11,53 % | 6,36 % |
| Objekt-IRR brutto mit Restwert (−Gesamtkosten, Reinertrag H, VW T42) | 3,64 % | 4,10 % | 4,36 % | 7,59 % | 6,17 % |
| Objekt-IRR brutto ohne Restwert | 0,42 % | 1,45 % | 1,97 % | 6,79 % | 4,89 % |
| Objekt-IRR nach Zuschuss mit Restwert (−(GK − Zuschuss)) | 5,48 % | 4,94 % | 4,77 % | 7,59 % | 6,17 % |
| Objekt-IRR nach Zuschuss ohne Restwert | 2,68 % | 2,47 % | 2,47 % | 6,79 % | 4,89 % |
| Restwert T42 / Gesamtkosten | 2,27-fach (nominal) | | | | |

Die Behandlung des Zuschusses kehrt die Rangfolge auf Objektebene um. Brutto liegt A < B < C, nach Zuschuss A > B > C. Best und Worst Case stehen in `kontrollrechnung.json`; zum Beispiel ist im Worst Case der Objekt-IRR brutto ohne Restwert für A −0,31 %.

### 4.2 Konsistenzbefunde zu den Renditen

1. **Verschiedene Zeitbasen.** K3 und K5 rechnen mit 44,5 Jahren (Exponent mit Vorlaufzeit), K6 mit 42 Jahren ab T0. Das Modell sagt das selbst (`Dashboard!H55`). Ein Paar mit gleicher Basis gibt es nicht.
2. **Verschiedene Wiederanlage.** K3 und K5 verzinsen das Konto explizit mit 2 % bzw. 5 %, K6 implizit zum IRR. Für A liegt K6 rund 1,55 Pp über K3. Davon gehen etwa 0,39 Pp auf die Vorlaufzeit zurück (K3 über 42 statt 44,5 Jahre: 6,77 % statt 6,38 %) und etwa 1,16 Pp auf die unterschiedliche Wiederanlage.
3. **Nur EK-Sicht ist dynamisch.** Für eine Objektrendite (Gesamtkapital, unlevered) fehlen Zahlungsreihe, IRR und Endwert.
4. **„Ohne Objektwert“ heißt Restwert = 0 für Gebäude und Boden.** Weil der Boden mit 0 € angesetzt ist (`Basisdaten!C23` = 0), ist „mit Restwert“ faktisch ein reiner Gebäude-Ertragswert. Das liegt am Eingabestand, nicht an der Struktur.
5. **Restwert aus Marktmiete.** Der Wert ist in allen Alternativen gleich (6.713.518 € in T42). In T42 liegen die gebundenen Mieten bei 18,88 / 22,77 / 24,99 €/m²; Marktmiete 32,61 €/m², Vergleichsmiete 29,09 €/m² (`Gefoerdert_*!C48`, `D48`, `E48`). Der Bindungsabschlag ist dort 0, weil `BoG_Grenze` = `Jahre_n`.
   - Würde der Abschlag nach derselben Logik wie Spalte AD über T42 hinaus fortgeführt, fiele der Verkehrswert um 464.000 € (A, 6,9 %), 210.000 € (B) bzw. 145.000 € (C).
   - K3 sänke dadurch auf 6,25 / 6,39 / 6,46 % (`restwert_bog_extension.py`).
   - Für „Frei, obere Kante“ (Miete 42,34 €/m² in T42) ist der Restwert umgekehrt zu niedrig angesetzt.
6. **Ertragswert ohne Bodenanteil.** Der Liegenschaftszins ist auf 600 €/m² Bodenwert geeicht (`Eingabe!B130`, `Modellannahmen!C16`), angesetzt sind 0 €. Die Warnung in `Eingabe!E21` ist aktiv.
7. **Eigenkapital.** Es besteht nur aus barem EK in Höhe von 20 % der zuwendungsfähigen Kosten (`Eingabe!C88` als Formel) und ist in allen Alternativen gleich. In den geförderten Varianten ist damit die Kapitalstruktur fixiert: Förderung 80 % + EK 20 % + Bankdarlehen in Höhe des Bearbeitungsentgelts.
8. **Horizontabhängigkeit gegenläufig.** Für A an den Stichtagen T30 / T35 / T42 (`Bewertung!N20,N25,N30` bzw. `O…`):
   - K3: 7,17 / 6,79 / 6,38 % (fällt mit dem Horizont).
   - K5: 1,10 / 2,37 / 3,35 % (steigt mit dem Horizont).
   - Folge: Die Wahl des Horizonts entscheidet mit über den Safe-Harbour-Befund.

---

## 5. Überkompensation (`Ueberkompensation`)

**Eingaben**
- `C5` `Swapsatz_30J` = 3,39 %. Fester Wert, EUR 30Y Mid Swap vom 19.08.2026; laut `G5` „auf den Tag der Bewilligung fortzuschreiben“.
- `C6` `DAWI_Aufschlag` = 1,00 %.
- `C7` `DAWI_Grenzwert` `=Swapsatz_30J+DAWI_Aufschlag` = 4,39 %.

**Vergleich je Alternative (Zeilen 11–15)**

| Spalte | Formel | Bedeutung |
|---|---|---|
| C | `=IFERROR(AVERAGEIFS(BW_Rendite,BW_n,Jahre_n,BW_Alt,k),"n. v.")` | K3 am Horizont |
| D | analog mit `BW_RenditeBew` | K5 |
| E | `=C−DAWI_Grenzwert` | Abstand |
| F | `=Darlehen_*+Zuschuss_*` | Zuwendung, jeweils 2.370.730 € |
| G | `IF(C<=DAWI_Grenzwert,"Safe Harbour erfüllt…","Safe Harbour NICHT erfüllt…")` | Befundtext |

- Der Befund in G beruht **allein auf Spalte C**, also der Rendite mit Restwert. Für A, B und C lautet er „NICHT erfüllt“ (+1,99 / +2,05 / +2,10 Pp).
- Spalte D liegt in allen drei geförderten Varianten unter dem Grenzwert, fließt aber in keinen Befund ein.
- Die Zeilen 14 und 15 (frei) sind als „Vergleichsmaßstab“ gekennzeichnet.

`Ueberkompensation!C18:C22` hält offen:
- welche Renditegröße die Behörde ansetzt (mit oder ohne Wert der Immobilie),
- dass der Horizont eine Setzung der Mappe ist,
- dass das Eigenkapital zum Verkehrswert angesetzt wird.

`Modellannahmen!C22` hält fest, dass der Safe Harbour mit K5 eingehalten ist, mit K3 nicht.

**Abgleich mit dem Recht**
- RL Nr. 11.10 Abs. 3 verlangt eine VOFI-Investitionsrechnung und „die mit dem geförderten Objekt erzielbare Eigenkapitalrendite in Prozent pro Jahr, bezogen auf das … einzusetzende Eigenkapital“. Eine Methode (IRR oder Endwert) und einen Zeitraum nennt sie nicht.
- Art. 6 Abs. 1 DAWI-Beschluss (EU) 2025/2630 definiert die Kapitalrendite als **IRR über den Betrauungszeitraum** (Faktenbasis G3-21). Welchen Zeitraum die NBank ansetzt, ist nicht veröffentlicht.
- Die Mappe weicht in zwei Punkten davon ab: Sie nutzt keinen IRR, sondern die Endwertrendite K3, und sie rechnet über 42 + 2,5 Jahre statt über die 35 Jahre der Bindung.

**Kontrollrechnung EK-IRR über 35 Jahre** (Basis, nicht im Modell; `kontrolle_irr35.py`):

| | A | B | C |
|---|---:|---:|---:|
| mit Verkehrswert T35 (`Bewertung!L25:L27`, nach Abschlag) | 8,36 % | 8,36 % | 8,46 % |
| ohne Restwert, Restschuld T35 abgezogen | 3,01 % | 3,00 % | 3,25 % |

Auch hier gilt: mit Restwert über dem Grenzwert, ohne Restwert darunter.

---

## 6. Zwischengespeicherte Ergebniswerte

### 6.1 Szenario Basis (Excel-Cache `data_only`, `Dashboard`)

| Kennzahl (Dashboard-Zeile) | Gef. A | Gef. B | Gef. C | Frei oben | Frei unten |
|---|---:|---:|---:|---:|---:|
| NBank-Darlehen / Zuschuss (8/9) | 1.185.365 / 1.185.365 | 1.778.047 / 592.682 | 2.074.388 / 296.341 | 0 / 0 | leer¹ |
| Bankdarlehen (10) | 20.744 | 22.226 | 22.966 | 2.370.730 | leer¹ |
| Eigenkapital (11) | 592.682 | 592.682 | 592.682 | 592.682 | leer¹ |
| Startmiete €/m² (14) | 6,80 | 8,20 | 9,00 | 18,80 | 14,48 |
| DSCR T1 / Minimum (20/21) | 1,338 / 1,330 | 1,150 / 1,147 | 1,111 / 1,109 | 1,250 / 1,250 | 0,933 / 0,933 |
| Tiefster Kontostand (36) | 12.429 | 8.198 | 7.056 | 33.201 | −22.640 |
| K1 Nettoanfangsrendite (43) | 1,66 % | 2,12 % | 2,38 % | 5,60 % | 4,18 % |
| K2 Wertüberschuss T0 (44) | 23,2 % | 23,2 % | 23,2 % | 23,2 % | 23,2 % |
| Verkehrswert T42 (47) | 6.713.518 | 6.713.518 | 6.713.518 | 6.713.518 | 6.713.518 |
| VOFI-Konto T42 (48) | 2.562.722 | 2.814.259 | 3.033.147 | 8.870.049 | 4.882.844 |
| Endwert T42 (52) | 9.276.240 | 9.527.777 | 9.746.664 | 15.583.567 | 11.596.361 |
| K3 VOFI-EK nominal (55) | 6,376 % | 6,440 % | 6,494 % | 7,623 % | 6,911 % |
| K4 VOFI-EK real (56) | 4,290 % | 4,353 % | 4,406 % | 5,513 % | 4,815 % |
| K5 ohne Objektwert (57) | 3,345 % | 3,563 % | 3,737 % | 6,269 % | 4,853 % |
| K6 EK-IRR (58) | 7,924 % | 7,930 % | 8,021 % | 12,250 % | 8,289 % |
| K7 Abstand zum Grenzwert (UK E11:E13) | +1,99 Pp | +2,05 Pp | +2,10 Pp | (+3,23) | (+2,52) |

¹ `Dashboard!G8:G11` sind leer; der Erläuterungstext steht in `G11` statt in `H11`. Rechnerisch gilt für Frei unten dasselbe wie für Frei oben (`Finanzierung!D41:D45`).

**K3 / K5 je Stichtag** (`Bewertung!N`/`O`, Cache; Gefördert A):

| Stichtag | K3 | K5 |
|---|---:|---:|
| T1 | 27,55 % | n. v. |
| T10 | 11,32 % | n. v. |
| T30 | 7,17 % | 1,10 % |
| T35 | 6,79 % | 2,37 % |
| T42 | 6,38 % | 3,35 % |

Die hohen frühen Werte von K3 entstehen aus dem Bewertungsgewinn bei Fertigstellung (Endwert in T0 = 1,30 Mio. € gegen 0,59 Mio. € Eigenkapital).

### 6.2 Best und Worst Case

Diese Werte sind nicht im Cache. Sie stammen aus der LibreOffice-Neuberechnung der Kopie (`lo_results.json`).

| Kennzahl | Szenario | Gef. A | Gef. B | Gef. C | Frei oben | Frei unten |
|---|---|---:|---:|---:|---:|---:|
| K1 NAR | Best | 1,75 % | 2,23 % | 2,51 % | 5,90 % | 4,65 % |
| | Worst | 1,44 % | 1,84 % | 2,07 % | 4,87 % | 3,43 % |
| K3 VOFI-EK | Best | 6,79 % | 6,85 % | 6,91 % | 8,01 % | 7,49 % |
| | Worst | 5,56 % | 5,56 % | 5,58 % | 6,82 % | 5,50 % |
| K5 ohne Objektwert | Best | 3,69 % | 3,93 % | 4,11 % | 6,61 % | 5,61 % |
| | Worst | 2,43 % | 2,43 % | 2,50 % | 5,45 % | 2,21 % |
| K6 EK-IRR | Best | 8,57 % | 8,62 % | 8,74 % | 13,71 % | 10,02 % |
| | Worst | 6,33 % | 6,09 % | 6,06 % | 9,35 % | 5,76 % |
| DSCR min | Best | 1,41 | 1,21 | 1,17 | 1,32 | 1,04 |
| | Worst | 0,98 | 0,85 | 0,82 | **1,09** | 0,77 |

Der Grenzwert von 4,39 % ist in allen Szenarien gleich. K3 liegt in jedem Szenario darüber, K5 in jedem Szenario darunter.

Worst Case, „Frei, obere Kante“: Der DSCR verfehlt das Ziel 1,25, weil `Eingabe!C69` ein fester Wert ist und nicht neu aufgelöst wird. Die „obere Kante“ stimmt nur im Szenario Basis.

---

## 7. Weitere Auffälligkeiten

Diese Punkte sind für die Renditen nicht tragend, für eine externe Verwendung aber relevant.

- **Formeln in Eingabezellen** (`Eingabe!C18`, `C25`, `C53`, `C54`, `C71`, `C84`, `C88`, `C103`). Das widerspricht der Konvention in `Eingabe!A2`, nach der blaue Zellen Eingaben sind.
- **`Eingabe!C69` `Miete_Frei_Start`** ist ein fester Wert, siehe 6.2.
- **Texte passen nicht zu den Werten.**
  - `Eingabe!E51` nennt eine Banktilgung von 2 %; die Formel in `C54` ergibt 1,86 %.
  - `E51` nennt als Quelle 3,98 % bzw. 3,79 %; angesetzt sind 3,74 %.
- **Auszahlung und Bauphase.** Die Zuwendung wird vollständig in T0 gebucht (`Modellannahmen!C20`). Der Verwaltungskostenbeitrag läuft erst ab T1 (`Eingabe!E44`). Die Bauphase ist dadurch zu günstig dargestellt.
- **Frei, untere Kante:** 8 Jahre negativer Kontostand bei einer Linie von 0 €, Überziehung 22.640 € (`Dashboard!G37:G39`). Der Sollzins von 5 % ist eine Annahme, keine Zusage.
- **Nicht abgebildet:** Steuern einschließlich § 7b EStG, Modernisierung, Veräußerungskosten, Stellplätze (`Modellannahmen!C21`, `C26`–`C28`).

---

## Hilfsskripte und Ergebnisdateien

Alle unter `/tmp/claude-0/-home-user-NBank/38410f5d-55fd-52ad-a777-dfea55772146/scratchpad/vofi-work/modellkarte/`. Python-Skripte, die die Mappe lesen, wurden mit `-I` aufgerufen.

| Datei | Inhalt |
|---|---|
| `orig_copy.xlsx`, `lo_copy.xlsx` | Arbeitskopien |
| `dump_csv.py` → `dump/<Blatt>.csv`, `dump/_names.csv`, `dump/_sheets.txt` | Formel- und Cache-Dump je Blatt, 384 Namen |
| `view.py`, `vals.py` | kompakte Blatt- und Wertansichten |
| `diff_sheets.py` → `diff_sheets.txt` | normalisierter Formelvergleich der Szenarioblätter |
| `row_consistency.py` | Prüfung auf eine Formel je Spalte |
| `dataflow.py` → `dataflow.csv` | Datenfluss über die benannten Bereiche |
| `lo_recalc.py` → `lo_results.json` | LibreOffice-Neuberechnung Best / Basis / Worst |
| `compare_cached.py` | Cache gegen Neuberechnung |
| `kontrollrechnung.py` → `kontrollrechnung.json` | fehlende Kennzahlen: EK-IRR ohne Restwert, Objekt-IRR |
| `kontrolle_irr35.py` | EK-IRR über 35 Jahre |
| `restwert_bog_extension.py` | Bindungsabschlag über den Horizont hinaus |
