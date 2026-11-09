# PGN-VOFI-Modell v2-1: Annahmen und Eingaben

Prüfgegenstand: `/home/user/NBank/broschuere/zulieferungen/PGN_NBank_VOFI_Modell_v2-1.xlsx` (SHA-256 `11d558b338b4d0a5…`), 13 Blätter, 10.197 Formeln, aktives Szenario Basis. Die Originaldatei ist unverändert; gerechnet wurde mit einer Kopie. LibreOffice-Neuberechnung der Kopie (recalc/vofi.xlsx): 10.197 Formeln verglichen, nur Gebietsschema-Formatierungen und zwei DSCR-Zellen mit nahezu null Kapitaldienst (Frei_finanziert!AF37, Frei_Marktmiete!AF37) weichen ab; die gespeicherten Werte sind aktuell.

Zellangaben in der Form Blatt!Zelle, benannte Bereiche kursiv. Die Broschürenzahlen in Abschnitt 1 sind eine eigene Nachrechnung mit den Modellannahmen. Im Modell selbst stehen sie nicht.

## 1. Die vier Werte für die Broschüre (S. 11/12)

| Position | Wert | Einheit | Zelle / Name | Plausibilität |
|---|---|---|---|---|
| Mietausfall/Leerstand (S. 11 Zeile 1, Unterzeile; S. 12 Notiz) | **2,0 %** | % der Sollmiete (Nettokaltmiete) p. a. | Eingabe!C82; *Mietausfall* | Plausibel und üblich: entspricht dem Regelsatz Wohnen der ImmoWertV Anlage 3 (2 % des Rohertrags; Quelle laut Eingabe!E82) und der II. BV. Bei WBS-Nachfrage im angespannten Markt eher vorsichtig. Frei finanziert separat: Eingabe!C83 = 2 %. Senkt die Tilgungsschwellen S. 12 auf B 1,15 % / C 1,22 %. |
| nicht umlagefähige Bewirtschaftungskosten (S. 11 Zeile 2) | **367 €** | € je Wohnung p. a. (Verwaltungskosten); nicht umlagefähige Betriebskosten: kein Ansatz (0) | Eingabe!C80; *Verwaltung_WE* | Plausibel: ImmoWertV Anlage 3 (Basiswert 2021: 298 €/Wohnung), laut Eingabe!E80 auf 2026 fortgeschrieben; die Größenordnung passt zu einer VPI-Fortschreibung um rund 23 % (nicht gegen eine amtliche Veröffentlichung geprüft). In der Broschüre als „Verwaltung“ benennen oder ergänzen, dass Betriebskosten voll umgelegt werden. Kein Leerstands-Betriebskostenansatz. |
| Instandhaltung (S. 11 Zeile 3) | **14,40 €** | € je m² Wohnfläche p. a.; Steigerung 2,0 % p. a. ab Jahr 2 (Kostensteigerung, Szenario 1,5/2,0/2,5 %) | Eingabe!C81 (Steigerung Eingabe!C84 = INDEX(SZ_Kosten_Wachstum,Szenario_Nr) → Szenarien!H8); *Instandhaltung_qm / Kosten_Wachstum* | Vertretbar, für Neubau in Jahr 1–3 vorsichtig: ImmoWertV Anlage 3 (Basiswert 2021: 11,70 €/m²) ist ein über die Nutzungsdauer gemittelter Wertermittlungsansatz; altersgestaffelte Sätze (II. BV § 28) liegen für junge Gebäude niedriger. Als Pauschale mit Quelle gut vertretbar. |
| Tilgung NBank-Darlehen (S. 11 Zeile 7; S. 12 Bandbreite) | **2,50 %** | % des Ursprungsdarlehens p. a., linear (gleichbleibender Betrag), keine Annuität; ab Jahr 1, ohne Aufschub; Szenario Best/Basis 2,50 % (40 J.), Worst 3,03 % (33 J.) | Basisdaten!C62 (Tilgungsrate_A); Laufzeit Eingabe!C25 = INDEX(SZ_Laufzeit_NBank,Szenario_Nr) → Szenarien!G9:I9 = 40/40/33; Tilgungsfrei Eingabe!C26 = 0; Anzeige Finanzierung!F5/F14/F23 = 2,50 %; *Tilgungsrate_A/_B/_C, Laufzeit_NBank, Tilgungsfrei_NBank* | Annahme von PGN, kein RL-Wert (RL Nr. 5.3.5: NBank setzt fest; Faktbasis G1-14/G1-15). Rechnerisch schlüssig: Volltilgung binnen 40 ≤ 42 Jahren. Ein linearer Satz, der in 42 Jahren voll tilgt, liegt bei mindestens 2,38 % (1/42), mit 5 Jahren Aufschub bei 2,70 % (1/37). Bisher (WFB 2024) galten mindestens 1,25 % in der zinsfreien Phase und 2,5 % danach (G1-20/G1-21). Folge für S. 11/12: bei 2,50 % liegt A vorn, B und C sind in Jahr 1 negativ (siehe Jahresrechnung). |

Wie das Modell die Werte verwendet:

- **Mietausfall/Leerstand:** Gefoerdert_A!G7: =IF(OR($A7=0,$A7>Jahre_n),0,(Verwaltung_WE*Wohneinheiten+Instandhaltung_qm*Wohnflaeche)*(1+Kosten_Wachstum)^($A7-1)+Mietausfall*F7); F7 =C7*Wohnflaeche*Monate_Jahr (Sollmiete). Im Modell als Aufwand innerhalb der Bewirtschaftung gebucht, nicht als Erlösschmälerung; betragsgleich.
- **nicht umlagefähige Bewirtschaftungskosten:** Gefoerdert_A!G7 (Term Verwaltung_WE*Wohneinheiten, Steigerung (1+Kosten_Wachstum)^(t-1)). Die Bewirtschaftung im Modell besteht nur aus Verwaltung + Instandhaltung + Mietausfall; Betriebskosten gelten als voll umlagefähig.
- **Instandhaltung:** Gefoerdert_A!G7 (Term Instandhaltung_qm*Wohnflaeche, Steigerung (1+Kosten_Wachstum)^(t-1)); gleichmäßiger Jahresaufwand, keine Instandhaltungszyklen (Modellannahmen!C10), keine Modernisierungsinvestitionen (Modellannahmen!C27).
- **Tilgung NBank-Darlehen:** Konstante Jahresrate 2,5 % × Ursprungsbetrag bis zur Volltilgung in T40; Verwaltungskostenbeitrag 0,5 % auf das fallende Restkapital zusätzlich; ab T36 zusätzlich 3,74 % Zins auf den Rest (12,5 % des Ursprungsbetrags). Bankdarlehen dagegen Annuität mit 1,86 % Anfangstilgung (Eingabe!C54). Formel: `Basisdaten!C62: =IFERROR(Darlehen_A/MAX(1,Laufzeit_NBank-Tilgungsfrei_NBank),0); Gefoerdert_A!J7: =IF(OR($A7=0,$A7>Jahre_n,$A7<=Tilgungsfrei_NBank),0,MIN(Tilgungsrate_A,N(V6)))`

### Jahresrechnung S. 11 mit den Modellannahmen (Jahr 1, € p. a.)

| Zeile | Position | A | B | C |
|---|---|---:|---:|---:|
| 1 | Sollmiete | 114.240 | 137.760 | 151.200 |
|  | − Mietausfall 2,0 % | 2.285 | 2.755 | 3.024 |
| 2 | − Verwaltung 367 € × 20 WE | 7.340 | 7.340 | 7.340 |
| 3 | − Instandhaltung 14,40 € × 1.400 m² | 20.160 | 20.160 | 20.160 |
| 4 | = Überschuss vor Kapitaldienst | 84.455 | 107.505 | 120.676 |
| 5 | − Verwaltungskostenbeitrag 0,5 % | 14.000 | 21.000 | 24.500 |
| 6 | − Zins 0 % | 0 | 0 | 0 |
| 7 | − Tilgung 2,50 % | 70.000 | 105.000 | 122.500 |
| 8 | = Zahlungsüberschuss | **455** | **−18.495** | **−26.324** |

Zeile 8 bei anderen Tilgungssätzen:

| Tilgungssatz | A | B | C |
|---|---:|---:|---:|
| Modell Basis/Best: 1/40 (2,50 %) | 455 | −18.495 | −26.324 |
| Modell Worst: 1/33 (3,03 %) | −14.393 | −40.768 | −52.309 |
| RL-Mindestwert linear 1/42 (2,38 %) | 3.789 | −13.495 | −20.491 |
| bisherige WFB-Tilgung 1,25 % (1,25 %) | 35.455 | 34.005 | 34.926 |

Tilgungsschwellen S. 12 mit 2 % Mietausfall: B 1,15 %, C 1,22 % (ohne Mietausfall 1,18 % / 1,26 %). Damit ist das offene Feld auf S. 12 gefüllt: (1 − m) × 1,68 % − 0,5 % bzw. (1 − m) × 1,76 % − 0,5 % mit m = 2 %.

Hinweise zur Übernahme:
- Die Kostenwerte sind Stand 2026. Das Modell setzt sie unverändert für T1 = 2028 an und steigert sie ab Jahr 2 um 2 % p. a. In Jahr 3 sind das 7.637 € Verwaltung und 20.974 € Instandhaltung. Für eine Jahresrechnung „Jahr 1–3“ sind die Jahr-1-Werte konsistent mit dem Modell.
- „Nicht umlagefähige Bewirtschaftungskosten“ bedeutet im Modell nur die Verwaltungskosten. Nicht umlagefähige Betriebskosten setzt es nicht an. Die Zeile sollte deshalb „Verwaltung“ heißen oder einen Hinweis bekommen.
- Den Tilgungssatz hat PGN angenommen, die Richtlinie nennt keinen. Bei 2,50 % kippen B und C in Jahr 1 ins Minus, und A liegt bei null. Der Tenor von S. 11 („Mehr Miete, mehr Darlehen: Überschuss je Jahr“) und die Bandbreite auf S. 12 sollten das aufnehmen.

## 2. Weitere Kernannahmen

| Thema | Wert | Zelle | Formel / Verwendung | Hinweis |
|---|---|---|---|---|
| Verwaltungskosten | 367 € je WE p. a.; +2,0 % p. a. ab T2 | Eingabe!C80, Eingabe!C84 | `Gefoerdert_A!G7 (s. o.)` | Kostenstand 2026 wird ohne Fortschreibung als T1 = 2028 angesetzt (fortgeschrieben wären es 381,83 € bzw. 14,98 €/m²). |
| Mietsteigerung gefördert | T1–T3: 0; ab T4 alle 3 Jahre +6,15 % (≈ 2,01 % p. a.), gedeckelt durch Vergleichsmiete; nach Bindung (ab T36) Kappung 20 % je 3 Jahre (VO angespannt endet 2029), gedeckelt durch Vergleichsmiete | Eingabe!C73:C79 | `Gefoerdert_A!C7: =IF(OR($A7=0,$A7>Jahre_n),0,IF($A7=1,Startmiete_A,IF(AND($A7>Karenz_Jahre,MOD($A7-1-Karenz_Jahre,Anpassung_Rhythmus)=0),MAX(N(C6),MIN(N(C6)*(1+IF($A7<=Bindung,Kappung,IF(AND(Marktlage="angespannt",OR(Marktlage_bis=0,Fertigstellungsjahr+$A7<=Marktlage_bis)),Kappung_angespannt,Kappung_normal))),D7)),N(C6))))` | Ausschöpfung jeder zulässigen Erhöhung unterstellt (Modellannahmen!C11). Miete A: 6,80 → 13,11 €/m² in T35 (Dashboard!C15) → 18,88 €/m² in T42 (Dashboard!C16). |
| Markt- und Vergleichsmiete | Vergleichsmiete T1 12,92 €/m², Marktmiete T1 14,48 €/m² (Mittel der Anker 11,70 €/2023 und 15,42 €/2026, je +2,0 % p. a. fortgeschrieben); Wachstum 2,0 % p. a. | Eingabe!C63:C72; Basisdaten!C46:C49 | `Basisdaten!C48: =IF(Miete_Ansatz="unterer Anker",Anker_unten,IF(Miete_Ansatz="oberer Anker",Anker_oben,(Anker_unten+Anker_oben)/2))+Zuschlag_Standard` | Steuert Restwert (Ertragswert), boG und frei finanzierte Varianten, nicht die geförderte Startmiete. |
| Kostensteigerung | 2,0 % p. a. (Best 1,5 %, Worst 2,5 %) auf Verwaltung und Instandhaltung; Mietausfall wächst mit der Miete | Eingabe!C84 = INDEX(SZ_Kosten_Wachstum,Szenario_Nr); Szenarien!G8:I8 | `Exponent (t−1) in Gefoerdert_A!G` | Im Ertragswert (Spalte Z) mit Exponent t gerechnet. |
| Betrachtungszeitraum | 42 Jahre ab Bezugsfertigkeit (T1–T42 = 2028–2069); zusätzlich 2,5 Jahre Vorlaufzeit nur im Exponenten der VOFI-Endwertrendite (44,5 Jahre) | Eingabe!C11, Eingabe!C107 | `Bewertung!N5: =IF(AND(M5>0,Eigenkapital>0,$B5>0),(M5/Eigenkapital)^(1/($B5+Vorlaufzeit_Jahre))-1,"n. v.")` | EK-IRR (Dashboard!C58) rechnet ohne Vorlaufzeit; beide Renditen haben damit unterschiedliche Zeitbasis. |
| Restwertansatz | Verkehrswert in T42 nach Ertragswertverfahren auf Marktmiete (6,71 Mio. €, alle Varianten gleich), abzüglich Restschuld zum Nennwert (in T42: 0 €); keine Veräußerungskosten | Bewertung!J/K/L/M (Zeilen 30–34), BW_EW, BW_Endwert; Parameter Eingabe!C103:C106, Eingabe!B124:C129 | `Gefoerdert_A!AC: =KG_Grundstueck*(1+Bodenwert_Wachstum)^$A+MAX(0,Z-KG_Grundstueck*(1+Bodenwert_Wachstum)^$A*AA)*AB; Bewertung!M: =D+L-E; Gefoerdert_A!AJ48 (T42): T+S+Verkehrswert−Restschuld` | LZ 3,1 % (RND 80) → 2,7 % (RND 38). Der Abzug für die gebundene Miete (boG) ist in T42 konstruktionsbedingt 0: die nach T42 fortbestehende Mietdifferenz der Bestandsmieter fehlt (eigene Abschätzung: A rd. 0,46 Mio. €, B 0,21 Mio. €, C 0,14 Mio. €). Bodenwert 0 € (Eingabe!C15). |
| Zins NBank nach Jahr 35 | 3,74 % p. a. für T36–T42 auf das Restkapital (bei 40 J. Laufzeit 12,5 % des Ursprungsbetrags) | Eingabe!C43 (Zins_NBank_ab36) | `Gefoerdert_A!I7: =IF(OR($A7=0,$A7>Jahre_n),0,N(V6)*IF($A7<=Zinsfrei_Jahre,Zins_NBank_1_35,Zins_NBank_ab36))` | Gesetzt = Bankzins (marktüblich als Obergrenze); nicht aus Basiszinssatz + 3 Pp. hergeleitet (Eingabe!E43 „VORBEHALT“). |
| Habenzins / Sollzins / Kontokorrent | Haben 2,0 %, Soll 5,0 %, Linie 0 € | Eingabe!C100, C101, C102 | `Gefoerdert_A!U7: =IF(OR($A7=0,$A7>Jahre_n),0,N(Y6)*IF(N(Y6)>=0,Haben,Soll))` | Thesaurierung (Entnahme_Modus 0): Überschüsse verzinsen sich mit 2 % im VOFI-Konto; in A/B/C bleibt das Konto positiv, Frei_Marktmiete überzieht um 22.640 € (Basisdaten!C147). |
| Bankdarlehen | 3,74 % fest 10 J., Anfangstilgung 1,86 % (Annuität, rechnerische Laufzeit 30 J.), Anschluss 2,74/3,74/4,74 %, Prolongationsmodus 2; in A/B/C nur 20.744/22.226/22.966 € (= Bearbeitungsentgelte) | Eingabe!C51:C59; Basisdaten!C78, C89, C100 | `Basisdaten!C78: =MAX(0,Barbedarf-Darlehen_A-Zuschuss_A+Entgelt_A-EK_bar)` | Eingabe!E51 nennt „die angesetzten 2 %“, die Zelle C54 rechnet 1,86 %. |
| Eigenkapital | 592.682 € = 20 % der zuwendungsfähigen Kosten, nur bar; Grundstück 0 € | Eingabe!C88, Basisdaten!C126 | `Eingabe!C88: =0.2*Zuwendungsfaehig; Basisdaten!C126: =KG_Grundstueck+EK_bar` | Nenner aller Renditen; identisch in allen Varianten. |
| Bauphase / KG 800 | KG 800 = 0 € angesetzt; informativ berechnet 83.716 € (12 Monate, 4,9 % ZF-Zins, 3 % Bereitstellung, 6 Monate frei) | Eingabe!C19, C91:C95; Basisdaten!C28:C31 | `Basisdaten!C31: =IF(KG800_berechnen="ja",Bauzeitkosten,KG_Finanzierung)` | Zuwendung komplett in T0 gebucht, keine Teilraten (Modellannahmen!C20); VKB in der Bauphase fehlt (Eingabe!E44). |
| Überkompensation | Swap 30 J. 3,39 % (19.08.2026) + 100 Bp. = 4,39 % | Ueberkompensation!C5:C7 | `Ueberkompensation!C11: =IFERROR(AVERAGEIFS(BW_Rendite,BW_n,Jahre_n,BW_Alt,1),"n. v.")` | Geprüft wird die VOFI-Endwertrendite mit Restwert (A 6,38 %) und ohne Restwert (A 3,34 %), nicht der IRR (Dashboard!C58: A 7,92 %); Swapsatz vor Verwendung aktualisieren (Ueberkompensation!G5). |
| Sonstige Bewertungsparameter | GND 80 J., Bodenwertwachstum 1,5 %, LZ-Kurve 2,5–3,1 %, Beleihungsabschlag 10 %, DSCR-Ziel 1,25, Inflation 2,0 % | Eingabe!C105, C106, B124:C129, C57, C70, C108 | `—` | Wirkt auf Restwert, Beleihungswert und Kennzahlen, nicht auf die Jahresrechnung der Broschüre. |

### Szenarien (Szenarien!B5:I10)

| Treiber | Name | Best | Basis | Worst | Art |
|---|---|---:|---:|---:|---|
| Anschlusszins ab Prolongation | *SZ_Zins_Anschluss* | 2,74 % | 3,74 % | 4,74 % | absolut |
| Herstellungskosten KG 200–700 | *SZ_KG_Herstellung* | 2.815.241 € | 2.963.412 € (`=3579*Wohnflaeche`) | 3.407.924 € | relativ |
| Mietniveau, Faktor auf beide Anker | *SZ_Miet_Faktor* | 1,05 | 1,00 | 0,95 | relativ |
| Kostensteigerung | *SZ_Kosten_Wachstum* | 1,50 % | 2,00 % | 2,50 % | absolut |
| Laufzeit NBank-Darlehen | *SZ_Laufzeit_NBank* | 40 | 40 | 33 | absolut |
| Zuschlag auf den Liegenschaftszinssatz | *SZ_LZ_Zuschlag* | −0,30 % | 0,00 % | 0,60 % | absolut |

## 3. Abgleich mit dem Broschüren-Modellprojekt

| Merkmal | Modell (Zelle) | Broschüre S. 10–12 | Befund |
|---|---|---|---|
| Projekt | Referenzprojekt Tarutinoer Straße 4, Neu Wulmstorf (Eingabe!A1) | fiktives Modellhaus (S. 10) | Abweichung: reales Referenzobjekt statt Modellhaus. |
| Wohneinheiten | 14 (Eingabe!C13) | 20 | Abweichung |
| Wohnfläche | 828 m², Ø 59 m²/WE (Eingabe!C12) | 1.400 m², Ø 70 m²/WE | Abweichung |
| Herstellungskosten | 3.579 €/m² = 2.963.412 € (Szenarien!H6 =3579*Wohnflaeche; Eingabe!C18) | 4.500 €/m² = 6,3 Mio. € | Abweichung: Broschüre rd. 26 % teurer je m². |
| Grundstück | 0 € (Eingabe!C15/C16; Bodenrichtwertdeckel 260 €/m² × 1.362 m² = 354.120 €) | 700.000 € | Abweichung: im Modell kein Grundstückswert. |
| Zuwendungsfähige Kosten | 2.963.412 € = 3.579 €/m² (Basisdaten!C27) | 7,0 Mio. € = 5.000 €/m² | Abweichung: Darlehen je m² in der Broschüre um rd. 40 % höher, Kapitaldienst entsprechend. |
| Mietenstufe / Band | VI → Band IV–VII (Eingabe!C36, Basisdaten!C18) | IV–VII | Übereinstimmung im Band: gleiche Bemessungsgrenze 5.000 €/m² und Höchstmieten. |
| Höchstmieten Jahr 1–3 | 6,80 / 8,20 / 9,00 €/m² (Basisdaten!C41:C43, Eingabe!E119:G119), EH 55 ohne Zuschlag | 6,80 / 8,20 / 9,00 €/m² | Übereinstimmung |
| Förderquoten Darlehen/Zuschuss | A 40/40, B 60/20, C 70/10 % (Eingabe!C27:C31, C35) | A 40/40, B 60/20, C 70/10 % | Übereinstimmung |
| Eigenmittel | 20 % bar = 592.682 € (Eingabe!C88) | 20 % = 1,4 Mio. €, davon mind. 0,7 Mio. € Geld/Grundstück | Gleiche Quote, andere Zusammensetzung (Broschüre mit Grundstück). |
| Varianten | A, B, C jeweils zu 100 % (Blätter Gefoerdert_A/_B/_C) plus zwei frei finanzierte Varianten | A, B, C jeweils zu 100 %; Mix nur als Schwellenlogik (S. 12) | Übereinstimmung in der Logik; kein Mischfall im Modell. |
| Marktlage | angespannt (Eingabe!C76) | per Verordnung angespannt | Übereinstimmung |
| Zeitbezug | Bezugsfertigkeit 2027, Kostenstand 2026, Horizont 42 Jahre | Jahr 1–3 ohne Kalenderjahr | Für die Broschüre Jahr-1-Werte (Kostenstand 2026) verwenden. |
| Ergebnis Jahr 1 (zur Einordnung) | A: Rohertrag 67.565 €, Bewirtschaftung 18.412 €, Kapitaldienst 36.723 €, Cashflow +12.429 € (Gefoerdert_A!F7:Q7); B +8.198 €, C +7.056 € | mit denselben Annahmen: A +455 €, B −18.495 €, C −26.324 € (eigene Nachrechnung) | Das Referenzprojekt trägt sich wegen niedrigerer Kosten je m²; das Broschürenhaus mit 5.000 €/m² kaum (A) bzw. nicht (B, C). |

## 4. Förderkonditionen im Modell gegen RL Mietwohnraum 2026

| Kondition | RL / Fakt-ID | Modell (Zelle, Formel) | Befund |
|---|---|---|---|
| Zuschuss statt Tilgungsnachlass | RL Nr. 5.3.3.2; F009/F105 | Zuschussquoten Eingabe!C28/C30/C35, Zuschuss_A/B/C (Basisdaten!C63/C67/C71: =Zuwendungsfaehig*Quote_Z_eff_A); kein Tilgungsnachlass im Modell | erfüllt |
| Zuschuss nur mit Darlehen | RL Nr. 5.3.3.2 Satz 2 | Warnlogik Eingabe!E28/E30/E35 | erfüllt |
| Fördersätze A 40/40, B 60/20, C 70/10 | RL Nr. 5.3.3.1/5.3.3.2; F105 | Eingabe!C27:C31, C35 | erfüllt (Höchstsätze) |
| Zuschlag modellhaft/Housing First nur auf Zuschuss | RL Nr. 5.3.3.3 | Basisdaten!C54/C55 | erfüllt (inaktiv) |
| 0 % Zins bis Ende Jahr 35 | RL Nr. 5.3.4 Satz 1; F113 | Eingabe!C41 = 35, C42 = 0 %; Gefoerdert_A!I7 (s. o.) | erfüllt |
| Zins ab Jahr 36: bis Basiszins + 3 Pp., höchstens marktüblich | RL Nr. 5.3.4 Satz 2; F114 | Eingabe!C43 = 3,74 % gesetzt | Vorbehalt: Annahme an der Marktobergrenze, nicht hergeleitet (vom Modell selbst vermerkt). |
| Laufzeit max. 42 Jahre, Tilgung legt NBank fest | RL Nr. 5.3.5; F116, G1-14 | Basisdaten!C9 = 42; Laufzeit Eingabe!C25 = 40 (Worst 33); lineare Tilgung 2,5 % | erfüllt; Tilgungssatz ist PGN-Annahme |
| Tilgungsaufschub bis 5 Jahre nur bei Fehlbetrag | RL Nr. 5.3.5 Satz 5; F117 | Basisdaten!C10 = 5; Eingabe!C26 = 0; Prüfung Basisdaten!C45 | erfüllt |
| Tilgungsbeginn nach Vollauszahlung | RL Nr. 5.3.5 Satz 1; F115 | Tilgung ab T1 (Gefoerdert_A!J7) | erfüllt (Näherung) |
| Verwaltungskostenbeitrag 0,5 % des Restkapitals ab Beginn der Auszahlung | RL Nr. 12.7.1; F277 | Eingabe!C44; Gefoerdert_A!K7: =IF(OR($A7=0,$A7>Jahre_n),0,N(V6)*VKB_Satz) | Satz erfüllt; Abweichung: erst ab T1, Bauphase fehlt (vom Modell vermerkt, Eingabe!E44). |
| Bearbeitungsentgelt 1 % Darlehen / 0,75 % Zuschuss | RL Nr. 12.7.2/12.7.3; F278/F279 | Eingabe!C45/C46; Basisdaten!C64: =IF(BE_in_KG800=1,0,Darlehen_A*BE_Darlehen+Zuschuss_A*BE_Zuschuss) | erfüllt; als Barbedarf in T0, über Bankdarlehen finanziert |
| Höchstmieten Jahr 1–3 nach Mietenstufe, EH-40-Zuschlag bis 0,30 € | RL Nr. 5.4.4; F215/F217 | Eingabe!B118:G119, C38; Basisdaten!C37:C43 | erfüllt |
| Keine Erhöhung Jahr 1–3, danach max. 6,15 % in 3 Jahren | RL Nr. 5.4.5; F221 | Eingabe!C73 = 3, C74 = 3, C75 = 6,15 %; Gefoerdert_A!C | erfüllt; Ausschöpfung unterstellt |
| Belegungs- und Mietbindung 35 Jahre | RL Nr. 5.4.1/5.4.2; F212 | Eingabe!C39 = 35, C40 = 35 | erfüllt |
| Bemessungsgrenze 4.800/5.000 €/m², halbjährlich angepasst | RL Nr. 5.3.2.2 | Eingabe!D118:D119; Basisdaten!C26 | Ausgangswerte; Anpassung nicht abgebildet (wie Broschüre) |
| Grundstück bis Bodenrichtwert | RL Nr. 5.3.2.3 | Basisdaten!C24: =MIN(KG_Grundstueck,Bodenrichtwert_qm*Grundstuecksflaeche) | erfüllt |
| Eigenmittel mind. 20 %, davon mind. 50 % hart | RL Nr. 5.2.6; F094 | Basisdaten!C12/C13, C127:C135 | erfüllt |
| Vorrangige Kapitalmarktmittel: Tilgung mind. 1 % zzgl. ersparter Zinsen | RL Nr. 5.3.6; F118 | Bank-Annuität 1,86 % Anfangstilgung (Eingabe!C54) | erfüllt; Text Eingabe!E51 nennt fälschlich 2 % |
| Auszahlung in vier Teilraten, 10 % nach Belegung | RL Nr. 5.5.3 | alles in T0 (Gefoerdert_A!P6) | Abweichung, vom Modell vermerkt (Modellannahmen!C20) |
| Überkompensation: EK-Rendite (VOFI) ≤ Swap 30 J. + 100 Bp. | RL Nr. 5.3.7/11.10; F246, G3-20, G3-21 (DAWI: IRR) | Ueberkompensation!C5:C13 | Grenzwert richtig gebildet; Renditegröße offen (VOFI-Endwertrendite mit/ohne Restwert statt IRR), Swapsatz vom 19.08.2026 veraltet |

## 5. Abweichungen und Auffälligkeiten

1. **Modellprojekt passt nicht zur Broschüre** (hoch). 14 WE, 828 m², 3.579 €/m², Grundstück 0 € statt 20 WE, 1.400 m², 5.000 €/m² inkl. 0,7 Mio. € Grundstück. Nur die Annahmen (Mietausfall, Verwaltung, Instandhaltung, Tilgung) sind übertragbar, nicht die Ergebnisse. Beleg: Eingabe!C12/C13/C15, Szenarien!H6, Basisdaten!C27.
2. **Jahresrechnung der Broschüre mit den Modellannahmen: A knapp über null, B und C negativ** (hoch). Bei 2,50 % Tilgung: A +455 €, B −18.495 €, C −26.324 € p. a.; Tilgungsschwellen mit 2 % Mietausfall B 1,15 %, C 1,22 %. Die S.-12-Aussage gilt rechnerisch, aber jeder lineare Satz, der binnen 42 Jahren voll tilgt (≥ 2,38 %), liegt über beiden Schwellen. Beleg: eigene Nachrechnung (brosch_calc.py) mit Eingabe!C80:C82, Eingabe!C44, Basisdaten!C62.
3. **Restwert ohne Abschlag für die gebundene Bestandsmiete** (hoch). Der Endwert kapitalisiert ab T43 die volle Marktmiete (33,26 €/m²), obwohl die Miete A in T42 bei 18,88 €/m² liegt und nach § 558 BGB nur stufenweise steigt. Eigene Abschätzung nach der Modelllogik: Restwert zu hoch um rd. 0,46 Mio. € (A), 0,21 Mio. € (B), 0,14 Mio. € (C); das erhöht EK-IRR und VOFI-Rendite mit Restwert. Beleg: Gefoerdert_A!AD48 (boG in T42 = 0, da SA_Marktmiete für T43 = 0 und BoG_Grenze = 42), Bewertung!L30:L34, Gefoerdert_A!AJ48.
4. **Kein Grundstückswert** (mittel). Eigenkapital nur bar, Bodenwert im Ertragswert 0, die Liegenschaftszinskurve passt laut eigenem Hinweis nicht. Für Renditen nach außen nicht belastbar, bis der Grundstücksansatz geklärt ist. Beleg: Eingabe!C15 = 0, Eingabe!E21 („ACHTUNG ... nicht mehr modellkonform“).
5. **KG 800 = 0** (mittel). Bauzeitzinsen von 83.716 € sind berechnet, aber nicht angesetzt; Kosten um rd. 2,8 % zu niedrig. Beleg: Eingabe!C19, Eingabe!E91, Basisdaten!C30.
6. **Kennzahlen nicht sauber getrennt** (mittel). Objektrendite nur statisch (Nettoanfangsrendite Jahr 1 = Reinertrag/Gesamtkosten), kein Objekt-IRR mit/ohne Restwert; EK-Renditen mit unterschiedlicher Methode (VOFI-Endwert mit 2,5 J. Vorlaufzeit und 2 % Wiederanlage vs. IRR ohne Vorlaufzeit); EK-Rendite ohne Restwert nur als VOFI-Endwert, nicht als IRR. Der Verdacht des Kunden ist damit im Kern bestätigt. Beleg: Dashboard!C43, C55, C57, C58; Bewertung!N/O; Ueberkompensation!C11:D13.
7. **Kostenstand** (niedrig). Kostenstand 2026 gilt unverändert für T1 = 2028; zwei Jahre Steigerung fehlen (381,83 €/WE, 14,98 €/m² bei 2 %). Beleg: Gefoerdert_A!G7 (Exponent $A7-1), Eingabe!E80/E81.
8. **Eingabezellen mit Formeln bzw. händisch nachzuführenden Werten** (niedrig). C54 (=30-J.-Annuitätstilgung) und C88 (=0.2*Zuwendungsfaehig) sind als Eingabe markiert; C69 ist ein eingetragener Lösungswert (18,8006032), der nach jeder Änderung händisch auf Basisdaten!C50 zu setzen ist; 3.579 €/m² steckt im Formeltext. Beleg: Eingabe!C54, Eingabe!C88, Eingabe!C69, Szenarien!H6.
9. **Text widerspricht Zelle** (niedrig). „die angesetzten 2 %“ Tilgung, gerechnet werden 1,86 %. Beleg: Eingabe!E51 vs. Eingabe!C54.
10. **Veraltete Kontrollanzeigen** (niedrig). Prüfen auf 24 Bewertungszeilen/4 Varianten, das Blatt hat 30/5: zeigen „ACHTUNG“ bzw. „Hinweis“, obwohl die Struktur stimmt. Beleg: Dashboard!D68, Dashboard!E68.
11. **Verweis auf falsche Variante** (niedrig). Der Restwert der Variante „Frei, untere Kante“ wird aus Zeile „Frei, obere Kante“ gelesen; zahlenmäßig ohne Wirkung, weil der Verkehrswert objektbezogen und ohne boG ist. Beleg: Frei_Marktmiete!AJ6:AJ56 (BW_Alt,4 statt 5).
12. **Swapsatz** (niedrig). 3,39 % vom 19.08.2026; laut Faktbasis G3-25 lag der Satz am 19.10.2026 bei 3,43 % (Marktorientierung, kein NBank-Parameter). Beleg: Ueberkompensation!C5.

## 6. Welche Renditen das Modell heute ausweist

| Kennzahl | Restwert | Zelle | Formel | Werte (Basis) |
|---|---|---|---|---|
| Nettoanfangsrendite Jahr 1 (Objekt, statisch) | ohne | Dashboard!C43:G43 | `=IFERROR(INDEX(SA_Reinertrag,MATCH(1,SA_t,0))/Gesamtkosten,"n. v.")` | A 1,66 %, B 2,12 %, C 2,38 %, Frei oben 5,60 %, Frei unten 4,18 % |
| VOFI-EK-Rendite (Endwert inkl. Verkehrswert, 44,5 J.) | mit | Dashboard!C55:G55 / Bewertung!N (BW_Rendite) | `Bewertung!N: =(M/Eigenkapital)^(1/(B+Vorlaufzeit_Jahre))-1; M = Konto + Verkehrswert − Restschuld` | A 6,38 %, B 6,44 %, C 6,49 %, Frei oben 7,62 %, Frei unten 6,91 % |
| Endwertrendite ohne Objektwert (VOFI, 44,5 J.) | ohne | Dashboard!C57:G57 / Bewertung!O (BW_RenditeBew) | `Bewertung!O: =((D-E)/Eigenkapital)^(1/(B+Vorlaufzeit_Jahre))-1` | A 3,34 %, B 3,56 %, C 3,74 %, Frei oben 6,27 %, Frei unten 4,85 % |
| EK-IRR (42 J., ohne Vorlaufzeit) | mit | Dashboard!C58:G58 | `=IFERROR(IRR(SA_Zahlungsstrom),...); SA_Zahlungsstrom = Gefoerdert_A!AJ6:AJ56` | A 7,92 %, B 7,93 %, C 8,02 %, Frei oben 12,25 %, Frei unten 8,29 % |
| Objekt-IRR (unlevered) mit/ohne Restwert | fehlt | — | `nicht vorhanden` | — |
| EK-IRR ohne Restwert | fehlt | — | `nicht vorhanden` | — |

Objektrendite und EK-Rendite vor Steuern werden nicht durchgängig je mit und ohne Restwert und nach derselben Methode geführt. Das bestätigt die Vermutung des Kunden. Den Vorschlag für eine saubere Kennzahlenstruktur macht der nächste Prüfschritt.

## 7. Vollständige Eingabeliste

Art: Eingabe = blau hinterlegte Wertzelle; Eingabezelle mit Formel = als Eingabe markiert, enthält aber eine Formel; szenariogesteuert = aus Blatt Szenarien; Festlegung = Basisdaten-Kopfblock.

| Zelle | Name | Parameter | Wert | Einheit | Art | Bedeutung |
|---|---|---|---|---|---|---|
| Eingabe!C6 | *Szenario* | Gewähltes Szenario | Basis |  | Eingabe | Szenarioschalter (Best Case/Basis/Worst Case); steuert Anschlusszins, Herstellungskosten, Mietfaktor, Kostensteigerung, LZ-Zuschlag, NBank-Laufzeit über Blatt Szenarien. |
| Eingabe!C10 | *Fertigstellungsjahr* | Fertigstellungsjahr (T0) | 2027 | Jahr | Eingabe | Jahr der Bezugsfertigkeit T0; Bewirtschaftung ab T1 = 2028. |
| Eingabe!C11 | *Jahre_n* | Betrachtungshorizont | 42 | Jahre | Eingabe | Betrachtungszeitraum in Jahren ab T0 (T1–T42 = 2028–2069); Bewertungshorizont für Restwert und Renditen. |
| Eingabe!C12 | *Wohnflaeche* | Wohnfläche | 828 | m² | Eingabe | Wohnfläche des Referenzprojekts; Basis für Miete, Instandhaltung, Kostendeckel. |
| Eingabe!C13 | *Wohneinheiten* | Wohneinheiten | 14 | Stück | Eingabe | Anzahl Wohneinheiten; Basis der Verwaltungskosten je WE. |
| Eingabe!C14 | *Grundstuecksflaeche* | Grundstücksfläche | 1.362 | m² | Eingabe | Grundstücksfläche; für Bodenrichtwertdeckel und Bodenwert. |
| Eingabe!C15 | *KG_Grundstueck_VW* | KG 100 Bodenwert, Verkehrswert des unbebauten Grundstücks | 0 € | € | Eingabe | Verkehrswert des unbebauten Grundstücks (KG 100). Steht auf 0 €: kein Grundstückswert in Kosten, Eigenkapital und Bodenwert. |
| Eingabe!C16 | *KG_Grundstueck_KP* | KG 100 Kaufpreis, falls erworben | 0 € | € | Eingabe | Kaufpreis des Grundstücks, nur bei Erwerb; 0 €. |
| Eingabe!C17 | *Grundstueck_Ansatz* | Maßgeblicher Wertansatz | Verkehrswert |  | Eingabe | Wahl des Grundstückswertansatzes (Verkehrswert/Kaufpreis/Bodenrichtwert) für Kosten, EK und Bodenwert. |
| Eingabe!C18 | *KG_Herstellung* | KG 200–700 Herstellungskosten | 2.963.412 € | € | szenariogesteuert: `=INDEX(SZ_KG_Herstellung,Szenario_Nr)` | Herstellungskosten KG 200–700; aus Szenarien!G6:I6, Basis =3579*Wohnflaeche (3.579 €/m², fest im Formeltext). |
| Eingabe!C19 | *KG_Finanzierung* | KG 800 Finanzierung | 0 € | € | Eingabe | Finanzierungskosten KG 800 (Bauzeitzinsen); Eingabe 0 €, die informative Bauzeitrechnung ergibt 83.716 €. |
| Eingabe!C20 | *Bodenrichtwert_qm* | Bodenrichtwert nach § 196 BauGB (Förderung) | 260 | €/m² | Eingabe | Bodenrichtwert für den Fördergrenzdeckel nach RL Nr. 5.3.2.3. |
| Eingabe!C21 | *Bodenwert_Modell_qm* | Bodenwert des Liegenschaftszinsmodells (Bewertung) | 600 | €/m² | Eingabe | Bodenwert, dem die Liegenschaftszinskurve zugeordnet ist (nur Bewertung). |
| Eingabe!C25 | *Laufzeit_NBank* | Laufzeit NBank-Darlehen | 40 | Jahre | szenariogesteuert: `=INDEX(SZ_Laufzeit_NBank,Szenario_Nr)` | Laufzeit des NBank-Darlehens; bestimmt den linearen Tilgungssatz (1/40 = 2,50 % p. a.). Szenario: 40/40/33 Jahre. |
| Eingabe!C26 | *Tilgungsfrei_NBank* | Tilgungsfreie Jahre NBank-Darlehen | 0 | Jahre | Eingabe | Tilgungsaufschub NBank-Darlehen (RL bis 5 Jahre bei Fehlbetrag); 0. |
| Eingabe!C27 | *Quote_D_A* | Quote Darlehen Gruppe A | 40,00 % | % | Eingabe | Darlehensquote Gruppe A auf zuwendungsfähige Kosten. |
| Eingabe!C28 | *Quote_Z_A* | Quote Zuschuss Gruppe A | 40,00 % | % | Eingabe | Zuschussquote Gruppe A. |
| Eingabe!C29 | *Quote_D_B* | Quote Darlehen Gruppe B | 60,00 % | % | Eingabe | Darlehensquote Gruppe B. |
| Eingabe!C30 | *Quote_Z_B* | Quote Zuschuss Gruppe B | 20,00 % | % | Eingabe | Zuschussquote Gruppe B. |
| Eingabe!C31 | *Quote_D_C* | Quote Darlehen Gruppe C | 70,00 % | % | Eingabe | Darlehensquote Gruppe C. |
| Eingabe!C32 | *Vorhabenart* | Vorhabenart nach Nummer 5.1 | Regelfall |  | Eingabe | Vorhabenart (Regelfall/Modellhaft/Housing First); steuert Zuschusszuschlag. |
| Eingabe!C33 | *Zuschlag_modellhaft* | Höchstzuschlag modellhafte Wohnungsbauprojekte | 5,00 % | % | Eingabe | Zuschusszuschlag modellhafte Projekte (bis 5 Pp.), nur bei Vorhabenart Modellhaft aktiv. |
| Eingabe!C34 | *Zuschlag_housing_first* | Höchstzuschlag Housing First | 10,00 % | % | Eingabe | Zuschusszuschlag Housing First (bis 10 Pp.), nur bei Vorhabenart Housing First aktiv. |
| Eingabe!C35 | *Quote_Z_C* | Quote Zuschuss Gruppe C | 10,00 % | % | Eingabe | Zuschussquote Gruppe C. |
| Eingabe!C36 | *Mietenstufe* | Mietenstufe des Standortes | VI |  | Eingabe | Mietenstufe; Band 2 (IV–VII) bestimmt Bemessungsgrenze 5.000 €/m² und Höchstmieten 6,80/8,20/9,00 €/m². |
| Eingabe!C37 | *Effizienzstandard* | Effizienzstandard | EH 55 |  | Eingabe | Energiestandard; nur EH 40/EH 40 QNG lösen den Mietzuschlag aus. |
| Eingabe!C38 | *Zuschlag_EH40* | Mietzuschlag ab Effizienzhaus 40 | 0,30 | €/m²·Mon | Eingabe | Mietzuschlag bei mind. EH 40 (RL Nr. 5.4.4 Satz 2), hier ohne Wirkung (EH 55). |
| Eingabe!C39 | *Bindung* | Mietbindung | 35 | Jahre | Eingabe | Mietbindung in Jahren (RL Nr. 5.4.2). |
| Eingabe!C40 | *Belegungsbindung* | Belegungsbindung | 35 | Jahre | Eingabe | Belegungsbindung (RL Nr. 5.4.1); nur dokumentarisch, nicht im Zahlungsstrom. |
| Eingabe!C41 | *Zinsfrei_Jahre* | Zinsfreie Jahre des Förderdarlehens | 35 | Jahre | Eingabe | Dauer der Zinsfreiheit des Förderdarlehens (RL Nr. 5.3.4). |
| Eingabe!C42 | *Zins_NBank_1_35* | Zins NBank Jahr 1 bis 35 | 0,00 % | % | Eingabe | Zins NBank-Darlehen Jahr 1–35. |
| Eingabe!C43 | *Zins_NBank_ab36* | Zins NBank ab Jahr 36 | 3,74 % | % | Eingabe | Zins NBank-Darlehen ab Jahr 36 (T36–T42); gesetzt = Bankzins, nicht aus Basiszinssatz hergeleitet. |
| Eingabe!C44 | *VKB_Satz* | Verwaltungskostenbetrag | 0,50 % | % | Eingabe | Verwaltungskostenbeitrag p. a. auf das Restkapital (Vorjahresende); im Modell erst ab T1. |
| Eingabe!C45 | *BE_Darlehen* | Bearbeitungsentgelt Darlehen | 1,00 % | % | Eingabe | Einmaliges Bearbeitungsentgelt Darlehen (Zahlung in T0). |
| Eingabe!C46 | *BE_Zuschuss* | Bearbeitungsentgelt Zuschuss | 0,75 % | % | Eingabe | Einmaliges Bearbeitungsentgelt Zuschuss (Zahlung in T0). |
| Eingabe!C47 | *BE_in_KG800* | Bearbeitungsentgelt in KG 800 enthalten | 0 | Schalter (0 oder 1) | Eingabe | Schalter: Entgelt in KG 800 enthalten (1) oder zusätzlicher Barbedarf (0). |
| Eingabe!C51 | *Zins_Bank* | Zins Bankdarlehen | 3,74 % | % | Eingabe | Zins Bankdarlehen Erstkondition (10 J. fest), Bundesbank-Marktmittel. |
| Eingabe!C52 | *Zinsbindung* | Zinsbindung | 10 | Jahre | Eingabe | Zinsbindung Bankdarlehen. |
| Eingabe!C53 | *Zins_Anschluss* | Anschlusszins ab Jahr 11 | 3,74 % | % | szenariogesteuert: `=INDEX(SZ_Zins_Anschluss,Szenario_Nr)` | Anschlusszins Bank ab Jahr 11; Szenario 2,74/3,74/4,74 %. |
| Eingabe!C54 | *Tilgung_Bank* | Anfangstilgung Bankdarlehen | 1,8618 % | % | Eingabezelle mit Formel: `=IF(Zins_Bank_F=0,1/30,Zins_Bank_F/((1+Zins_Bank_F)^30-1))` | Anfangstilgung Bankdarlehen (Annuität); Formel = 30-Jahres-Annuität beim Erstzins, also 1,86 %, obwohl als Eingabe markiert. |
| Eingabe!C55 | *Zins_Staffel* | Zinsstaffel nach Beleihungsauslauf | 0 | Schalter (0 oder 1) | Eingabe | Schalter Zinsstaffel nach Beleihungsauslauf (0 = aus). |
| Eingabe!C56 | *Zins_Referenzauslauf* | Referenzauslauf des angesetzten Zinses | 70,00 % | % | Eingabe | Beleihungsauslauf, für den der Bankzins gilt (nur bei Staffel). |
| Eingabe!C57 | *Beleihungsabschlag* | Sicherheitsabschlag zum Beleihungswert | 10,00 % | % | Eingabe | Sicherheitsabschlag vom vorläufigen Ertragswert zum Näherungs-Beleihungswert. |
| Eingabe!C58 | *Prolongation* | Verhalten der Rate bei Prolongation | 2 | Schalter (0, 1 oder 2) | Eingabe | Prolongationsmodus Bank: 2 = Rate auf Restlaufzeit neu bemessen. |
| Eingabe!C59 | *Tilgung_Anschluss* | Tilgung ab Prolongation | 2,00 % | % | Eingabe | Tilgungssatz ab Prolongation; nur in Modus 1 wirksam, hier ohne Wirkung. |
| Eingabe!C63 | *Vertragsmiete_Basis* | Vertragsmiete, unterer Anker | 11,70 | €/m²·Mon | Eingabe | Untere Marktmietanker (Vertragsmieten GAA Lüneburg 2023), Basis der ortsüblichen Vergleichsmiete. |
| Eingabe!C64 | *Anker_unten_Jahr* | Basisjahr des unteren Ankers | 2023 | Jahr | Eingabe | Basisjahr unterer Anker. |
| Eingabe!C65 | *Angebotsmiete_Basis* | Mietniveau, oberer Anker | 15,42 | €/m²·Mon | Eingabe | Oberer Marktmietanker (GAA 2026, teils Angebotsmieten). |
| Eingabe!C66 | *Anker_oben_Jahr* | Basisjahr des oberen Ankers | 2026 | Jahr | Eingabe | Basisjahr oberer Anker. |
| Eingabe!C67 | *Miete_Ansatz* | Ansatz der Marktmiete im Band | Mittelwert |  | Eingabe | Lage der marktüblichen Miete im Band (Mittelwert → 14,48 €/m² in T1). |
| Eingabe!C68 | *Zuschlag_Standard* | Zuschlag für den energetischen Standard | 0 | €/m²·Mon | Eingabe | Zuschlag auf Marktmiete für Energiestandard; 0. |
| Eingabe!C69 | *Miete_Frei_Start* | Startmiete frei finanziert, obere Kante des Korridors | 18,8006 | €/m²·Mon | Eingabe | Startmiete der frei finanzierten Variante (DSCR-Ziel-Kante); als fester Wert eingetragen, muss händisch dem Rechenergebnis Basisdaten!C50 nachgeführt werden. |
| Eingabe!C70 | *DSCR_Ziel* | DSCR-Ziel im ungünstigsten Jahr | 1,25 | Faktor | Eingabe | Ziel-Kapitaldienstdeckung (Reinertrag/Kapitaldienst) im ungünstigsten Jahr. |
| Eingabe!C71 | *Miet_Faktor* | Mietniveau-Faktor | 1 | Faktor | szenariogesteuert: `=INDEX(SZ_Miet_Faktor,Szenario_Nr)` | Mietniveau-Faktor auf beide Anker; Szenario 1,05/1,00/0,95. |
| Eingabe!C72 | *OVM_Wachstum* | Wachstum Mietniveau | 2,00 % | % | Eingabe | Jährliches Wachstum von Markt- und Vergleichsmiete (auch Pfad frei finanziert). |
| Eingabe!C73 | *Karenz_Jahre* | Karenzjahre ohne Mieterhöhung | 3 | Jahre | Eingabe | Jahre ohne Mieterhöhung zu Beginn der Bindung (RL Nr. 5.4.5). |
| Eingabe!C74 | *Anpassung_Rhythmus* | Rhythmus der Mietanpassung | 3 | Jahre | Eingabe | Abstand der Mietanpassungen (alle 3 Jahre: T4, T7, ...). |
| Eingabe!C75 | *Kappung* | Mietanpassung während der Bindung | 6,15 % | % | Eingabe | Höchsterhöhung je 3 Jahre während der Bindung (RL Nr. 5.4.5); zusätzlich gedeckelt durch Vergleichsmiete. |
| Eingabe!C76 | *Marktlage* | Wohnungsmarkt der Kommune | angespannt |  | Eingabe | Marktlage (angespannt) für die Kappungsgrenze nach Bindungsende. |
| Eingabe!C77 | *Kappung_angespannt* | Kappungsgrenze bei angespanntem Markt | 15,00 % | % | Eingabe | Kappungsgrenze § 558 BGB bei angespanntem Markt (gilt nur bis Ablauf der VO). |
| Eingabe!C78 | *Kappung_normal* | Kappungsgrenze im Regelfall | 20,00 % | % | Eingabe | Kappungsgrenze § 558 BGB im Regelfall; wirkt nach Bindungsende (2063 ff.). |
| Eingabe!C79 | *Marktlage_bis* | Verordnung befristet bis Ende | 2029 | Jahr | Eingabe | Befristung der Mieterschutz-VO (Ende 2029). |
| Eingabe!C80 | *Verwaltung_WE* | Verwaltungskosten | 367 | €/WE·a | Eingabe | Verwaltungskosten je Wohneinheit und Jahr (ImmoWertV Anlage 3, fortgeschrieben 2026); einziger Posten der nicht umlagefähigen Bewirtschaftungskosten neben Instandhaltung und Mietausfall. |
| Eingabe!C81 | *Instandhaltung_qm* | Instandhaltungskosten | 14,40 | €/m²·a | Eingabe | Instandhaltungskosten je m² Wohnfläche und Jahr (ImmoWertV Anlage 3, fortgeschrieben 2026), konstant über die Nutzungsdauer, gesteigert mit der Kostensteigerung. |
| Eingabe!C82 | *Mietausfall* | Mietausfallwagnis | 2,00 % | % | Eingabe | Mietausfallwagnis in % der Sollmiete (Rohertrag) der geförderten Varianten. |
| Eingabe!C83 | *Mietausfall_Frei* | Mietausfallwagnis frei finanziert | 2,00 % | % | Eingabe | Mietausfallwagnis der frei finanzierten Varianten. |
| Eingabe!C84 | *Kosten_Wachstum* | Kostensteigerung | 2,00 % | % | szenariogesteuert: `=INDEX(SZ_Kosten_Wachstum,Szenario_Nr)` | Jährliche Steigerung von Verwaltungs- und Instandhaltungskosten ab T2; Szenario 1,5/2,0/2,5 %. |
| Eingabe!C88 | *EK_bar* | Bares Eigenkapital | 592.682 € | € | Eingabezelle mit Formel: `=0.2*Zuwendungsfaehig` | Bares Eigenkapital; Formel =0.2*Zuwendungsfaehig in einer Eingabezelle. |
| Eingabe!C89 | *Eigenleistungen_Sach* | Eigenleistungen (Sach- und Arbeitsleistungen, in Geldwert) | 0 € | € | Eingabe | Eigenleistungen (weiche Eigenmittel), nur Eigenmittelprüfung. |
| Eingabe!C90 | *KG_Grundstueck_NK* | KG 120 Grundstücksnebenkosten | 0 € | € | Eingabe | Grundstücksnebenkosten KG 120. |
| Eingabe!C91 | *Bauzeit_Monate* | Bauzeit | 12 | Monate | Eingabe | Bauzeit für die informative Bauzeitzinsrechnung. |
| Eingabe!C92 | *ZF_Zins* | Zwischenfinanzierungszins | 4,90 % | % | Eingabe | Zwischenfinanzierungszins Bauphase (informativ). |
| Eingabe!C93 | *Bereitstellungszins* | Bereitstellungszins | 3,00 % | % | Eingabe | Bereitstellungszins (informativ). |
| Eingabe!C94 | *Bereitstellungsfrei* | Bereitstellungsfreie Zeit | 6 | Monate | Eingabe | Bereitstellungsfreie Zeit (informativ). |
| Eingabe!C95 | *KG800_berechnen* | KG 800 aus der Bauzeitrechnung | nein |  | Eingabe | Schalter: KG 800 aus Bauzeitrechnung übernehmen (nein). |
| Eingabe!C99 | *Entnahme_Modus* | Entnahmemodus | 0 | Schalter (0, 1 oder 2) | Eingabe | Ergebnisverwendung: 0 Thesaurierung, 1 Ausschüttung, 2 Sondertilgung. |
| Eingabe!C100 | *Haben* | Guthabenzins | 2,00 % | % | Eingabe | Habenzins auf positives VOFI-Konto (Wiederanlage). |
| Eingabe!C101 | *Soll* | Sollzins bei Unterdeckung | 5,00 % | % | Eingabe | Sollzins auf negatives VOFI-Konto (Zwischenfinanzierung). |
| Eingabe!C102 | *Kontokorrentlinie* | Kontokorrentlinie | 0 € | € | Eingabe | Zugesagte Kontokorrentlinie; 0 € (Frei_Marktmiete überzieht um 22.640 €). |
| Eingabe!C103 | *LZ_Zuschlag* | Zuschlag auf die Liegenschaftszinskurve | 0,00 % | % | szenariogesteuert: `=INDEX(SZ_LZ_Zuschlag,Szenario_Nr)` | Parallelverschiebung der Liegenschaftszinskurve; Szenario −0,3/0/+0,6 Pp. |
| Eingabe!C104 | *BoG_bis* | Abschlag Mietpreisbindung bis | Horizont |  | Eingabe | Bis wann die Mietdifferenz als boG vom Ertragswert abgezogen wird (Horizont = T42). |
| Eingabe!C105 | *GND* | Gesamtnutzungsdauer | 80 | Jahre | Eingabe | Gesamtnutzungsdauer für Restnutzungsdauer und Vervielfältiger. |
| Eingabe!C106 | *Bodenwert_Wachstum* | Bodenwertwachstum | 1,50 % | % | Eingabe | Bodenwertsteigerung p. a. (wirkt hier nicht, Bodenwert 0 €). |
| Eingabe!C107 | *Vorlaufzeit_Jahre* | Vorlaufzeit bis Bezugsfertigkeit | 2,50 | Jahre | Eingabe | Vorlaufzeit vor T0; nur im Exponenten der VOFI-Endwertrendite. |
| Eingabe!C108 | *Inflation* | Preissteigerung für die Realrendite | 2,00 % | % | Eingabe | Inflation nur zur Umrechnung in Realrendite. |
| Eingabe!C109 | *Stichtag_1* | Stichtag 1 | 0 | Jahre | Eingabe | Bewertungsstichtag 1 (Jahre nach T0). |
| Eingabe!C110 | *Stichtag_2* | Stichtag 2 | 1 | Jahre | Eingabe | Bewertungsstichtag 2 (Jahre nach T0). |
| Eingabe!C111 | *Stichtag_3* | Stichtag 3 | 10 | Jahre | Eingabe | Bewertungsstichtag 3 (Jahre nach T0). |
| Eingabe!C112 | *Stichtag_4* | Stichtag 4 | 30 | Jahre | Eingabe | Bewertungsstichtag 4 (Jahre nach T0). |
| Eingabe!C113 | *Stichtag_5* | Stichtag 5 | 35 | Jahre | Eingabe | Bewertungsstichtag 5 (Jahre nach T0). |
| Eingabe!C114 | *Stichtag_6* | Stichtag 6 | 42 | Jahre | Eingabe | Bewertungsstichtag 6 (Jahre nach T0). |
| Basisdaten!C6 | *Zeilen_Soll* | Jahreszeilen je VOFI-Blatt | 50 | Zeilen | Festlegung | Anzahl Jahreszeilen je VOFI-Blatt (Horizont ≤ 50). |
| Basisdaten!C7 | *Monate_Jahr* | Monate je Jahr | 12 | Monate | Festlegung | Monate je Jahr. |
| Basisdaten!C8 | *Toleranz* | Rechentoleranz | 0 € | € | Festlegung | Rechentoleranz der Kontrollspalten in €. |
| Basisdaten!C9 | *Hoechstlaufzeit_NBank* | Höchstlaufzeit NBank-Darlehen | 42 | Jahre | Festlegung | Höchstlaufzeit NBank-Darlehen (RL Nr. 5.3.5). |
| Basisdaten!C10 | *Hoechst_Tilgungsfrei* | Höchstdauer der Tilgungsstreckung | 5 | Jahre | Festlegung | Höchstdauer Tilgungsaufschub (RL Nr. 5.3.5). |
| Basisdaten!C11 | *Regelquote* | Summe der Höchstsätze nach Nr. 5.3.3.1 und 5.3.3.2 | 80,00 % | % | Festlegung | Summe der Höchstsätze Darlehen + Zuschuss. |
| Basisdaten!C12 | *Eigenmittel_Soll* | Geforderte Eigenmittel | 20,00 % | % | Festlegung | Mindest-Eigenmittel in % der zuwendungsfähigen Kosten (RL Nr. 5.2.6). |
| Basisdaten!C13 | *Eigenmittel_hart_Soll* | Davon in harter Form | 50,00 % | % | Festlegung | Mindestanteil harter Eigenmittel an den Eigenmitteln (RL Nr. 5.2.6). |
| Ueberkompensation!C5 | *Swapsatz_30J* | Swapsatz für Finanzierungsmittel mit 30-jähriger Laufzeit | 3,39 % | % | Eingabe | EUR-Swapsatz 30 Jahre (Stand 19.08.2026) als Basis des Safe Harbour. |
| Ueberkompensation!C6 | *DAWI_Aufschlag* | Zuschlag nach Artikel 6 Abs. 3 Satz 1 DAWI-Freistellungsbeschluss | 1,00 % | % | Eingabe | Aufschlag 100 Basispunkte (DAWI Art. 6 Abs. 3). |

### Nachschlagetabellen

| Band | Mietenstufen | Bemessungsgrenze €/m² | A €/m² | B €/m² | C €/m² | Zelle |
|---|---|---:|---:|---:|---:|---|
| 1 | I bis III | 4.800 | 6,50 | 7,90 | 8,70 | Eingabe!B118:G118 |
| 2 | IV bis VII | 5.000 | 6,80 | 8,20 | 9,00 | Eingabe!B119:G119 |

Liegenschaftszins nach Restnutzungsdauer (*LZ_RND*/*LZ_Satz*): RND 30: 2,50 %; RND 38: 2,70 %; RND 40: 2,70 %; RND 50: 2,90 %; RND 60: 3,00 %; RND 70: 3,10 % (Eingabe!B124:C129, linear interpoliert).

Zinsaufschlag nach Beleihungsauslauf (*Marge_Grenze*/*Marge_Satz*, Staffel aus): bis 60 %: 0,00 %; bis 80 %: 0,35 %; bis 100 %: 0,75 % (Eingabe!B134:C136).

Arbeitsdateien: /tmp/claude-0/-home-user-NBank/38410f5d-55fd-52ad-a777-dfea55772146/scratchpad/vofi-work/ (extract.py, brosch_calc.py, bog_ext.py, build_report.py, recalc/vofi.xlsx).
