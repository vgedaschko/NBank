# Kennzahlenkonzept vor Steuern: Objekt- und Eigenkapitalrendite mit und ohne Restwert

**Stand:** 09.11.2026. **Internes Arbeitspapier, nicht zur Weitergabe.**
**Bezug:** Prüfung des PGN-VOFI-Modells v2-1 (`PGN_NBank_VOFI_Modell_v2-1.xlsx`, unverändert, SHA-256 `11d558b3…5e28b`). Befunde R1 bis R7 (Rendite), FR-01 bis FR-03 (Förderrecht), R1 bis R7 (Rechentechnik); Modellkarte `modellkarte.md`, Annahmen `annahmen.md`/`annahmen.json`.
**Referenzrechnung:** `referenzrechnung.py`, Ergebnisse in `referenzrechnung-ergebnis.md`. Alle Zahlen in diesem Papier stammen aus dieser Rechnung (Broschüren-Modellprojekt, Szenario Basis).

---

## 0. Kurzfassung

**Die Vermutung des Kunden trifft zu.** Das Modell trennt Objekt- und EK-Rendite nicht sauber. Das „mit/ohne Restwert“ ist nicht konsistent gepaart.

- **Objektebene:** Es gibt keine dynamische Objektrendite. Vorhanden ist nur die statische Nettoanfangsrendite Jahr 1 (`Dashboard!C43` `=INDEX(SA_Reinertrag,MATCH(1,SA_t,0))/Gesamtkosten`). `Dashboard!H43` nennt sie „die übliche Objektrendite … unabhängig von der Kapitalstruktur“. Das ist irreführend: Die Zahl enthält die Bindungskosten, den Zuschuss als Ausgleich aber nicht.
- **EK-Ebene, mit Restwert:** Es gibt zwei Größen mit unterschiedlicher Zeitbasis und Wiederanlage.
  - K3 ist die VOFI-Endwertrendite über 44,5 Jahre zu 2 % Haben (`Bewertung!N30` `=(M30/Eigenkapital)^(1/($B30+Vorlaufzeit_Jahre))-1`).
  - K6 ist der EK-IRR über 42 Jahre (`Dashboard!C58` auf `Gefoerdert_A!AJ6:AJ56`).
- **EK-Ebene, ohne Restwert:** Es gibt nur K5 (`Bewertung!O30`), und K5 streicht Boden und Gebäude. Einen EK-IRR ohne Restwert gibt es nicht. Auch eine Variante „ohne Gebäude-Restwert, Boden bleibt“ fehlt.

**Vorschlag:** vier getrennte Ebenen, alle aus denselben Jahreszeilen, alle mit gleichem T0 (Bezugsfertigkeit) und gleichem Horizont (T35 und T42).

1. **Liquidität:** Zahlungsüberschuss p. a. und DSCR. Das ist die einzige Ebene für die Broschüre.
2. **Objektrendite (IRR, unlevered):** brutto vor Förderung und nach Zuschuss, jeweils mit Restwert, ohne Gebäude-Restwert und ohne Restwert.
3. **EK-Rendite:** der EK-IRR und dazu die VOFI-EK-Rendite auf derselben Zeitbasis, jeweils mit den drei Restwertvarianten.
4. **Überkompensationskennzahl der NBank:** getrennt geführt, mit eigener Regel. Sie ist keine Investorenkennzahl.

**Ergebnis für das Broschüren-Modellprojekt** (Zahlungsreihen nach Abschnitt 2, Restwert nach Abschnitt 4; T42, in Klammern T35):

| Kennzahl | A | B | C |
|---|---:|---:|---:|
| Objektrendite nach Zuschuss, mit Restwert | 4,16 % (4,04 %) | 3,71 % (3,55 %) | 3,56 % (3,38 %) |
| Objektrendite nach Zuschuss, ohne Gebäude-Restwert | 1,88 % (1,01 %) | 1,57 % (0,61 %) | 1,51 % (0,53 %) |
| EK-IRR, mit Restwert | 5,90 % (6,03 %) | 5,73 % (5,85 %) | 5,70 % (5,81 %) |
| EK-IRR, ohne Gebäude-Restwert | 2,92 % (1,53 %) | 2,64 % (0,72 %) | 2,63 % (0,47 %) |
| nachr.: Objektrendite brutto vor Förderung, mit Restwert | 2,48 % | 2,95 % | 3,20 % |
| nachr.: VOFI-EK-Rendite, mit Restwert | 5,52 % (5,72 %) | 5,56 % (5,75 %) | 5,58 % (5,77 %) |
| Zahlungsüberschuss Jahr 1 (Broschüre S. 11, Zeile 8) | +455 € | −18.495 € | −26.324 € |
| DSCR Jahr 1 | 1,01 | 0,85 | 0,82 |

**Nach außen.**
- **Liquidität:** ja, so wie die Broschüre sie plant. Setzt man die Broschüreneingaben in die Mappe ein, stimmt ihr Cashflow T1 bis T3 (`Gefoerdert_*!Q7:Q9`) mit der Broschüren-Jahresrechnung auf den Euro überein. Mit korrigiertem EK kommt dort nur der Kapitaldienst eines kleinen Bankdarlehens für die Bearbeitungsentgelte hinzu (A 2.745 € p. a.).
- **Renditen:** nicht mit der Mappe v2-1 in ihrer jetzigen Form. Die vier Gründe:
  1. Im Broschürenprojekt zählt sie das Grundstück doppelt (FR-03; K3 sinkt dadurch um 0,71 Pp).
  2. Der Restwert ist am Horizont ohne Bindungsabschlag angesetzt (R4).
  3. Die Größen stehen auf verschiedenen Zeitbasen (R2/R5).
  4. Die Texte zur Überkompensation sind falsch gewichtet (FR-02).

  Nach dem Umbau (Abschnitt 6) gehören Renditen nur in die individuelle Beratung, und nur nach den Regeln aus Abschnitt 5.

---

## 1. Grundsätze

1. **Vor Steuern, nominal, jährlich nachschüssig.** Keine AfA, keine Sonderabschreibung, keine Ertragsteuer. So hält es auch die Mappe (`Dashboard!A2` „Vor Ertragsteuern“).
2. **Eine Zeitachse für alle Kennzahlen.**
   - T0 ist die Bezugsfertigkeit; Jahr t = 1 … H sind die Bewirtschaftungsjahre.
   - Bauphasenzahlungen gehen nur als **datierte** Zahlungen ein (t < 0). Ein Zuschlag im Exponenten ist nicht zulässig (Befund R5).
3. **Zwei Horizonte:** H = 35 (Ende der Belegungs- und Mietbindung, RL Nr. 5.4.1/5.4.2, zugleich der Betrauungszeitraum) und H = 42 (Höchstlaufzeit des Darlehens, RL Nr. 5.3.5; Horizont der Mappe, `Eingabe!C11`). Jede Kennzahl wird für beide ausgewiesen.
4. **Ein Datensatz.**
   - Liquidität, Objekt- und EK-Rendite lesen dieselben Jahreszeilen: Sollmiete, Mietausfall, Bewirtschaftung, Kapitaldienst.
   - Sie unterscheiden sich nur in drei Punkten: welche Zahlungen in die Reihe eingehen, welcher Restwert angesetzt wird und welche Rechenmethode gilt (IRR oder VOFI).
5. **Restwert immer zerlegt in Boden und Gebäude.** Daraus entstehen drei Varianten:
   - **mit RW** (Boden + Gebäude),
   - **ohne Gebäude-RW** (nur Boden; die Lesart des Kunden),
   - **ohne RW** (null; nur als Untergrenze).
6. **Paare nur innerhalb einer Methode.** „Mit/ohne Restwert“ wird nur innerhalb derselben Methode, desselben Horizonts und desselben T0 verglichen, also IRR gegen IRR oder VOFI gegen VOFI.

---

## 2. Zahlungsreihen

### 2.1 Investition und Mittelherkunft in T0

| Größe | Definition | Broschürenprojekt |
|---|---|---:|
| Objektinvestition I | Grundstück zum Verkehrswert bzw. Einbringungswert (KG 100) + Grundstücksnebenkosten (KG 120) + Herstellung KG 200 bis 700 + KG 800 **ohne** Finanzierungskosten | 0,7 + 0 + 6,3 + 0 = 7,0 Mio. € |
| Zuschuss Z | Quote × zuwendungsfähige Kosten (RL Nr. 5.3.3.2) | A 2,8 / B 1,4 / C 0,7 Mio. € |
| Darlehen D | Quote × zuwendungsfähige Kosten (RL Nr. 5.3.3.1) | A 2,8 / B 4,2 / C 4,9 Mio. € |
| Bearbeitungsentgelte | 1 % × D + 0,75 % × Z, einmalig in T0 (RL Nr. 12.7.2/12.7.3) | 49.000 / 52.500 / 54.250 € |
| Bares EK | **Restgröße:** Barbedarf + Entgelte − D − Z − vorrangiges Bankdarlehen, mindestens 0 | 749.000 / 752.500 / 754.250 € |
| Eigenkapital EK | Grundstück (Sacheinlage, lastenfrei, zum Verkehrswert) + bares EK; Eigenleistungen in Geldwert, die den Barbedarf mindern | 1.449.000 / 1.452.500 / 1.454.250 € |

**Warum Restgröße.**
- Die Mappe setzt das bare EK fest auf 20 % der zuwendungsfähigen Kosten (`Eingabe!C88` `=0.2*Zuwendungsfaehig`) und rechnet das Grundstück zusätzlich hinzu (`Basisdaten!C126` `=KG_Grundstueck+EK_bar`).
- Mit Grundstück übersteigt die Mittelherkunft dann den Bedarf. Im Broschürenprojekt liegen 651.000 € als Kasse T0 im VOFI-Konto (`Gefoerdert_A!Y6`), und das EK steigt auf 2,1 Mio. € (Befund FR-03). Die Mappe meldet das selbst in `Dashboard!C67`: „übersteigt die Gesamtkosten um 651,000 €“.
- Die Eigenmittelprüfung (mindestens 20 %, davon mindestens 50 % Geld oder lastenfreies Grundstück, RL Nr. 5.2.6) ist eine **Prüfung**, keine Zahlungsgröße.
- Im Broschürenprojekt ist sie mit 0,7 Mio. € Grundstück + 0,7 Mio. € Geld genau erfüllt. Die Entgelte kommen als bares EK hinzu, sie sind keine Baukosten.

### 2.2 Jahreszeile t = 1 … H

| Zeile | Definition | Quelle der Annahme |
|---|---|---|
| Sollmiete S_t | gebundene Miete × Wohnfläche × 12. Jahr 1 bis 3 Höchstmiete, ab Jahr 4 alle 3 Jahre +6,15 % (RL Nr. 5.4.5, Ausschöpfung unterstellt), nach der Bindung Kappung 20 % je 3 Jahre bis zur Vergleichsmiete | `Gefoerdert_A!C7`, `Eingabe!C73:C79` |
| − Mietausfall | m × S_t, Erlösschmälerung (Broschüre S. 11: Unterzeile zu Zeile 1) | `Eingabe!C82` = 2,0 % |
| − nicht umlagefähige Bewirtschaftung | Verwaltung je WE + nicht umlagefähige Betriebskosten (Modell: 0, Betriebskosten voll umgelegt) | `Eingabe!C80` = 367 € je WE p. a. |
| − Instandhaltung | € je m² Wohnfläche | `Eingabe!C81` = 14,40 € je m² p. a. |
| = **Reinertrag RE_t** | Überschuss vor Kapitaldienst (Broschüre S. 11, Zeile 4) | Kosten ab Jahr 2 +2 % p. a. (`Eingabe!C84`) |
| − Verwaltungskostenbeitrag | 0,5 % × Restkapital zu Jahresbeginn, ab Auszahlung (RL Nr. 12.7.1) | `Gefoerdert_A!K7` `=N(V6)*VKB_Satz` |
| − Zins NBank | 0 % bis Ende Jahr 35, danach höchstens Basiszinssatz § 247 BGB + 3 Pp, höchstens marktüblich (RL Nr. 5.3.4) | Modell 3,74 % (`Eingabe!C43`, Vorbehalt) |
| − Tilgung NBank | Satz legt die NBank fest (RL Nr. 5.3.5); Laufzeit höchstens 42 Jahre; Aufschub bis 5 Jahre nur bei Fehlbetrag | PGN: 2,50 % linear = 1/40 (`Basisdaten!C62`) |
| − Kapitaldienst Bank | nur, wenn ein vorrangiges Bankdarlehen besteht | im Broschürenprojekt keines |
| = **Zahlungsüberschuss ZÜ_t** | RE_t − Kapitaldienst KD_t (Broschüre S. 11, Zeile 8) | |

Die vier Annahmen für die Broschüren-Jahresrechnung sind also:
- Mietausfall 2,0 % der Sollmiete,
- 367 € je Wohnung p. a. (Verwaltung),
- 14,40 € je m² p. a. Instandhaltung,
- Tilgung 2,50 % p. a. linear.

Die Tilgung ist eine PGN-Annahme, die RL nennt keinen Satz. Ergebnis Jahr 1: A +455 €, B −18.495 €, C −26.324 € (`referenzrechnung-ergebnis.md` Abschnitt 2).

### 2.3 Objekt-Zahlungsreihe (Gesamtkapital, unlevered)

| t | Zahlung |
|---|---|
| 0 | −I (brutto) bzw. −(I − Z + 0,75 % × Z) (nach Zuschuss) |
| 1 … H | +RE_t |
| H | zusätzlich + Restwert RW_H × (1 − Veräußerungskosten) |

Nicht enthalten sind Darlehen, Verwaltungskostenbeitrag, Bearbeitungsentgelt Darlehen, Bankdarlehen und Bauzeitzinsen. Das sind Finanzierungskosten, sie gehören in die EK-Reihe.

**Behandlung des Zuschusses: zwei Lesarten, beide ausweisen.**
- **Nach Zuschuss (Hauptgröße der Objektsicht).** Der Zuschuss ist nicht rückzahlbar, unverzinst und an das Objekt gebunden. Wirtschaftlich mindert er die Investition. Bilanziell darf ein Investitionszuschuss die Herstellungskosten mindern (Wahlrecht, R 6.5 Abs. 2 EStR).
  - Das Bearbeitungsentgelt auf den Zuschuss mindert den Zuschuss.
  - Diese Größe beantwortet die Frage: „Was verdient das geförderte Objekt auf das Kapital, das nach dem Zuschuss noch gebunden ist, unabhängig davon, wie der Rest finanziert wird?“
- **Brutto vor Förderung (Vergleichsgröße).**
  - Sie zeigt das gebundene Objekt ohne Ausgleich und ist vergleichbar mit „frei finanziert zur Marktmiete“.
  - Die Differenz ist die Rendite, die die Bindung kostet. Im Broschürenprojekt, T42 mit Restwert: frei 4,66 % gegen A 2,48 %, B 2,95 %, C 3,20 %.
  - Nach Zuschuss holt A fast auf (4,16 %), C kaum (3,56 %).
- **Das Darlehen bleibt Finanzierung**, auch wenn es zinsverbilligt ist. Der Vorteil aus 0 % Zins erscheint deshalb nur in der EK-Rendite.
  - Zur Einordnung kann man ihn als Förderbarwert ausweisen: Zuschuss netto + (D − Barwert des NBank-Kapitaldienstes zum Marktzins).
  - Bei 3,74 %: A 2,78 + 1,14 = 3,92 Mio. €, B 1,39 + 1,71 = 3,10 Mio. €, C 0,69 + 1,99 = 2,69 Mio. €.
- **Brutto und nach Zuschuss nie verwechseln.** Brutto steigt von A nach C (höhere Miete), nach Zuschuss fällt es von A nach C (weniger Zuschuss).

### 2.4 EK-Zahlungsreihe (levered)

| t | Zahlung |
|---|---|
| −v … 0 | −EK (bei Bauphase datiert: EK zuerst, v = Monate bis Bezugsfertigkeit / 12) |
| 1 … H | +ZÜ_t (negativ = Nachschuss des Eigentümers) |
| H | zusätzlich + RW_H × (1 − Veräußerungskosten) − Restschuld_H (NBank + Bank, Nennwert) |

Die Reihe enthält den vollen Kapitaldienst: VKB, Zins und Tilgung, dazu die Bearbeitungsentgelte über das EK in T0.

**Entnahmen.**
- Im IRR sind Entnahmen einfach Teil von ZÜ_t.
- Im VOFI müssen entnommene Beträge zum Habenzins bis H aufgezinst werden. Sonst fehlen sie im Endvermögen. Das ist in der Mappe der Fall bei `Entnahme_Modus` = 1, `Bewertung!M30` `=D30+L30-E30` (Befund R6).

### 2.5 Horizont, Restschuld, Bauphase

- **Restschuld bei H = 35.** Die Restschuld zum Nennwert (bei 2,5 % linear 12,5 % des Darlehens) wird abgezogen. Erst ab Jahr 36 fällt Zins an. Der Nennwert ist der Ablösebetrag.
- **Bauphase (optional).** EK fließt zuerst. Das Darlehen wird nach Baufortschritt abgerufen, der VKB läuft ab Auszahlung (RL Nr. 12.7.1), die Auszahlung erfolgt in Raten (RL Nr. 5.5.3). Alles als datierte Zahlungen.
- **Sensitivität EK-Vorlauf.** Die Referenzrechnung zeigt sie als datierte EK-Zahlung, Werte für A, T42 mit Restwert:

  | EK gebunden ab | EK-IRR | VOFI |
  |---|---:|---:|
  | T0 (Basis) | 5,90 % | 5,52 % |
  | 1 Jahr vor T0 | 5,74 % | 5,38 % |
  | 2,5 Jahre vor T0 | 5,51 % | 5,20 % |

  Die Objektrendite ändert sich dabei nicht.

---

## 3. Kennzahlen

### 3.1 Liquidität (extern geeignet)

| Kennzahl | Definition | Broschürenprojekt (2,50 % Tilgung) |
|---|---|---|
| Zahlungsüberschuss p. a. | ZÜ_t für Jahr 1 bis 3. Jahr 1 ist der Broschürenwert; Jahr 2/3 verschieben sich nur durch Kosten +2 % und den sinkenden VKB. | A +455 / +255 / +44 €; B −18.495 / −18.520 / −18.556 €; C −26.324 / −26.261 / −26.210 € |
| DSCR | RE_t ÷ (VKB + Zins + Tilgung [+ Bank]). Jahr 1 und Minimum T1 bis T35. Der VKB gehört zum Kapitaldienst. | Jahr 1: 1,01 / 0,85 / 0,82; Minimum: 1,00 / 0,85 / 0,82 |
| Jahre mit negativem ZÜ, größter kumulierter Fehlbetrag | Liquiditätsreserve, die das EK zusätzlich vorhalten muss (ohne Zinsen) | A: 0 Jahre / 0 €; B: 9 Jahre / −92.052 €; C: 9 Jahre / −151.922 € |
| Break-even-Tilgung Jahr 1 | (RE_1 − VKB_1) ÷ D | A 2,52 %, B 2,06 %, C 1,96 % |
| Tilgungsschwelle B bzw. C gegenüber A (S. 12) | [(1 − m) × Mehrmiete − 0,5 % × Mehrschuld] ÷ Mehrschuld | mit 2 % Mietausfall: B 1,15 %, C 1,22 % (bisher im Text 1,18 / 1,26 %) |

Die Liquidität hängt weder vom Restwert noch von einer Wiederanlage ab. Sie ist deshalb die robuste Größe für die Broschüre. Bei einer Bankfinanzierung gilt zusätzlich ein DSCR nur auf den Bank-Kapitaldienst (Kreditprüfung der Bank). Er ist hier nicht relevant, weil es kein Bankdarlehen gibt.

### 3.2 Objektrendite

- **Objekt-IRR brutto** und **Objekt-IRR nach Zuschuss**, jeweils für drei Restwertvarianten (mit RW, ohne Gebäude-RW, ohne RW) und zwei Horizonte (T35, T42).
- Hilfsgröße: die **Nettoanfangsrendite Jahr 1** (RE_1 ÷ I, statisch). Sie ist korrekt zu benennen: „statisch, Jahr 1, brutto vor Förderung, ohne Restwert“, also nicht so, wie `Dashboard!H43` sie beschreibt. Im Broschürenprojekt: 1,21 / 1,54 / 1,72 %.
- Eine **VOFI-Objektrendite** ist nicht nötig. Die Objektsicht hat keinen Finanzierungsbedarf, der eine Wiederanlageannahme bräuchte.

### 3.3 EK-Rendite: IRR und VOFI auf gleicher Basis

**EK-IRR.**
- r mit Σ ZE_t · (1 + r)^(−t) = 0 über die EK-Zahlungsreihe aus Abschnitt 2.4.
- Er unterstellt implizit Wiederanlage und Finanzierung zum IRR.
- **Mehrdeutigkeit:** Mehrere Nullstellen sind möglich. Das passiert, wenn am Horizont eine große Auszahlung steht, etwa Restschuld oder Schlussrate ohne Restwert.
  - Dann ist die größte Nullstelle mit fallendem Barwert anzugeben, mit \* gekennzeichnet. Maßgeblich ist in diesem Fall die VOFI-Rendite.
  - Beispiel Broschüre, T35 ohne Restwert: Nullstellen bei −22,5 % und −1,5 % (A).

**VOFI-EK-Rendite.**
- Formel: r_VOFI = (EV_H ÷ EK)^(1/(H + v)) − 1.
- EV_H = Konto_H + RW_H − Restschuld_H.
- Konto_t = Konto_(t−1) · (1 + i) + ZÜ_t mit i = Haben (2 %), solange das Konto positiv ist, und i = Soll (5 %), sobald es negativ ist.
- v ist **nur** eine tatsächlich datierte EK-Vorlaufzeit.
- Die Rendite ist eindeutig, solange EV_H > 0.

**Verhältnis der beiden.**
- Bei Haben = Soll = IRR und v = 0 ist die VOFI-Rendite gleich dem IRR. Das bestätigt die Nachrechnung der Mappe: K3 mit Haben = K6 und Vorlauf 0 ergibt 7,924 % = K6.
- Die verbleibende Differenz ist die Wiederanlageannahme: im Broschürenprojekt A 5,90 % (IRR) gegen 5,52 % (VOFI), also +0,38 Pp.
- Beide Größen sind korrekt. Eine Paarung wie „VOFI mit RW gegen IRR ohne RW“ ist es nicht.

### 3.4 Überkompensationskennzahl der NBank (getrennt)

| Element | Festlegung |
|---|---|
| Rechtsgrundlage | RL Nr. 5.3.7 / 11.10 Abs. 3 und 4: VOFI, „mit dem geförderten Objekt erzielbare Eigenkapitalrendite“, bezogen auf das einzusetzende EK; Grenzwert Swapsatz 30 J. + 100 Bp. Methode, Horizont, Wiederanlage und Restwert legt die RL nicht fest (Faktbasis G3-20). DAWI-Beschluss (EU) 2025/2630 Art. 6 Abs. 1: Kapitalrendite = IRR über den Betrauungszeitraum (G3-21). |
| Primärgröße | **VOFI-EK-Rendite mit Restwert.** Das ist die von der RL verlangte Methode, und „mit dem Objekt erzielbar“ schließt den Objektwert ein. |
| Gegenrechnung | **EK-IRR mit Restwert** (DAWI Art. 6 Abs. 1) |
| Horizont | T35 (Betrauungszeitraum = Bindung) und T42, gleiche Zeitbasis, keine Vorlaufzeit im Exponenten |
| Eigenkapital | Grundstück zum Verkehrswert + bares EK (wie `Ueberkompensation!C20`), ohne Doppelzählung |
| Grenzwert | Swapsatz am Bewilligungstag + 100 Bp. Die Mappe hat 3,39 % vom 19.08.2026 fest eingetragen (`Ueberkompensation!C5`); Markt am 19.10.2026: 3,43 % (G3-25). Quelle und Stichtag sind mit der NBank abzustimmen. |
| Befundregel | Solange die NBank-Methode nicht abgestimmt ist: „nicht erfüllt, ergänzende Prüfung nach Art. 6 Abs. 4“, sobald **eine** Variante mit Restwert den Grenzwert überschreitet. Varianten ohne Restwert sind nur nachrichtlich. Sie sind die antragstellerfreundliche Lesart, **nicht** die „vorsichtige“ (gegen `Dashboard!H57` und `Modellannahmen!C22`, Befunde R3/FR-02). |
| Adressat | nur intern und für das Antragsgespräch. Keine Aussage „Safe Harbour eingehalten“ nach außen. |

**Broschürenprojekt.**
- Alle Varianten mit Restwert liegen über 4,39 %:
  - VOFI T35 5,72 / 5,75 / 5,77 %,
  - VOFI T42 5,52 / 5,56 / 5,58 %,
  - IRR T35 6,03 / 5,85 / 5,81 %,
  - IRR T42 5,90 / 5,73 / 5,70 %.
- Das sind +1,1 bis +1,6 Pp, die Befundregel ergibt also „nicht erfüllt“.
- Die Varianten ohne Gebäude-Restwert liegen unter dem Grenzwert: T42 um 1,5 bis 1,9 Pp, T35 um 2,8 bis 4,1 Pp.
- Der Befund hängt damit am Restwert. Er ist kein Werbeargument in die eine oder andere Richtung.

### 3.5 Übersicht

| Ebene | Kennzahl | Zahlungsreihe | Restwert | Horizont | Methode |
|---|---|---|---|---|---|
| Liquidität | Zahlungsüberschuss p. a., DSCR, kumulierter Fehlbetrag | Jahreszeile 2.2 | – | Jahr 1 bis 3, T1 bis T35 | statisch je Jahr |
| Objekt | Objekt-IRR brutto | 2.3 ohne Zuschuss | mit / ohne Geb. / ohne | T35, T42 | IRR |
| Objekt | Objekt-IRR nach Zuschuss | 2.3 mit Zuschuss netto | mit / ohne Geb. / ohne | T35, T42 | IRR |
| Objekt (Hilfsgröße) | Nettoanfangsrendite Jahr 1 | RE_1 ÷ I | – | Jahr 1 | statisch |
| EK | EK-IRR | 2.4 | mit / ohne Geb. / ohne | T35, T42 | IRR |
| EK | VOFI-EK-Rendite | 2.4 + Konto | mit / ohne Geb. / ohne | T35, T42 | Endwert |
| NBank | Überkompensationskennzahl | 2.4 + Konto | mit (primär), ohne nachr. | T35, T42 | VOFI primär, IRR Gegenrechnung |
| Information | Förderbarwert | Zuschuss + Zinsvorteil | – | bis T42 | Barwert zum Marktzins |

---

## 4. Restwert-Methodik

### 4.1 Zerlegung

- **Boden:** BW_H = Bodenwert T0 × (1 + g_Boden)^H.
  - Bodenwert T0 ist derselbe Wert, der als Sacheinlage ins EK geht, also der Verkehrswert.
  - Der Bodenrichtwert-Deckel (RL Nr. 5.3.2.3, `Basisdaten!C24`) gilt nur für die Förderbemessung, nicht für EK und Restwert (Befund R6).
  - g_Boden = 1,5 % p. a. (`Eingabe!C106`). Im Broschürenprojekt ergibt das 1,18 Mio. € (T35) bzw. 1,31 Mio. € (T42).
- **Gebäude:** Gebäude-RW_H = Ertragswert_H − BW_H.
- **Varianten:** mit RW = BW_H + Gebäude-RW_H; ohne Gebäude-RW = BW_H; ohne RW = 0.

### 4.2 Gebäude-Restwert: Ertragswert mit fortgeführtem Bindungsabschlag

Periodisches Ertragswertverfahren über die Restnutzungsdauer RND = GND − H auf **einheitlichem Preisstand** H + 1:

  EW_H = Σ_(k=1…RND) RE^real_(H+k) ÷ (1 + LZ)^k + BW_H ÷ (1 + LZ)^RND

- **Reinertrag:** RE^real_(H+k) = [C_(H+k) × Wfl × 12 × (1 − m) − Bewirtschaftung_(H+k)] ÷ (1 + g_Miete)^(k−1).
- **Bestandsmiete C:** nach H aus der gebundenen Miete fortgeschrieben, mit Kappung 20 % je 3 Jahre (§ 558 Abs. 3 BGB) bis zur **Zielmiete**.
  - Basis: die marktüblich erzielbare Miete der Mappe (`Basisdaten!C48`), also mit Neuvermietung.
  - Konservativ: die ortsübliche Vergleichsmiete, also ohne Mieterwechsel.
- **LZ:** Liegenschaftszins nach RND, Kurve `Eingabe!B124:C129` (2,5 bis 3,1 %), GND 80 Jahre.
- **Gleichwertigkeit:** Entspricht die Miete von Anfang an der Zielmiete, ist das genau das allgemeine Ertragswertverfahren der Mappe, (RE − BW × LZ) × V + BW. Geprüft: Für „frei, Marktmiete“ trifft die Referenzrechnung den Mappenwert 11.899.677 € exakt. Die Differenz zur Zielmiete ist der Barwert der Mindermiete, also der Abschlag für besondere objektspezifische Grundstücksmerkmale (boG, § 8 Abs. 3 ImmoWertV).

**Was die Mappe anders macht** (`Gefoerdert_A!AD7` `=SUMPRODUCT((SA_t>$A7)*(SA_t<=BoG_Grenze)*…*(INDEX(SA_Marktmiete,MATCH($A7+1,SA_t,0))-SA_Miete)*…/(1+AA7)^(SA_t-$A7))`):
- Der Abschlag zählt nur Jahre bis `BoG_Grenze` = `Jahre_n` = 42. Im Horizontjahr ist er deshalb null (Befunde R4/R2).
- Er hält die Marktmiete des Folgejahres konstant, lässt die gebundene Miete aber nominal steigen und mischt damit Preisstände (Befund R3).

Für das Broschürenprojekt (A, T42):
- Bestandsmiete 18,88 €/m² gegen Marktmiete 33,26 €/m².
- Die Bestandsmiete erreicht die Marktmiete erst in Jahr 55 (Kappungsstufen 22,66 → 27,19 → 32,62 → 39,15 → 42,19).
- Abschlag A 1,24 Mio. €, B 0,62 Mio. €, C 0,39 Mio. €. Restwert A 10,66 statt 11,90 Mio. €.

### 4.3 Varianten und ihre Rolle

| Variante | Zweck | Restwert T42 A (Mio. €) | EK-IRR T42 A |
|---|---|---:|---:|
| Ertragswert, Bindungsabschlag bis Marktmiete (**Basis**) | Hauptwert „mit RW“ | 10,66 | 5,90 % |
| Ertragswert, Zielmiete Vergleichsmiete | konservative Lesart „mit RW“ | 9,77 | 5,73 % |
| wie Mappe: Marktmiete, kein Abschlag am Horizont | nur Abgleich | 11,90 | 6,11 % |
| Sachwert-Plausibilisierung (Herstellung +2 % p. a., linear über 80 J.) | Plausibilität | 8,18 | 5,40 % |
| Gebäude-Restwert 50 % | Stresstest | 5,98 | 4,86 % |
| **ohne Gebäude-RW** (nur Boden) | vorsichtige Investorenlesart | 1,31 | 2,92 % |
| ohne RW | Untergrenze | 0 | 1,82 % |

### 4.4 Sensitivität und Pflichtangaben

- **Pflichtsensitivitäten:**
  - Liegenschaftszins ±0,5 Pp: EK-IRR T42 A 5,73 bis 6,08 %.
  - Gebäude-RW 50 %.
  - Veräußerungskosten 5 %: 5,80 %.
  - Zielmiete Vergleichsmiete.
  - Horizont T35 gegen T42.
- **Restwertabhängigkeit immer ausweisen:** Anteil des Restwerts am VOFI-Endvermögen. Im Broschürenprojekt A, T42: 77 %. Der Restwert T42 beträgt nominal das 1,52-Fache der Gesamtkosten, real (2 % deflationiert) das 0,66-Fache.
- **Platzhalter:** Marktmiete und Vergleichsmiete stammen vom Standort des PGN-Referenzprojekts (Neu Wulmstorf, Mietenstufe VI, `Basisdaten!C46:C49`). Für das Modellhaus „Mietenstufe IV bis VII“ sind das Platzhalter. Jeder Restwert hängt an ihnen.

---

## 5. Darstellungsregeln

### 5.1 Welche Kennzahl für welchen Zweck

| Zweck / Adressat | Kennzahlen | Restwert | Nach außen? |
|---|---|---|---|
| **Broschüre** (S. 10 bis 12) | Zahlungsüberschuss p. a. Jahr 1 (bis 3), Tilgungsschwellen, Annahmen offen genannt | keiner | **ja**, als „Modellrechnung, keine Förderzusage“, ohne Renditen (wie geplant) |
| Investorengespräch (individuell, mit Beratung) | Objekt-IRR nach Zuschuss und EK-IRR, je **mit RW und ohne Gebäude-RW**, T35 und T42; dazu Zahlungsüberschuss, DSCR, Liquiditätsreserve | zerlegt, Basis plus Sensitivität | ja, nur mit Annahmenblatt und Bandbreite, nie als Einzelwert |
| Bank / Finanzierungsanfrage | DSCR (gesamt und Bank), Zahlungsüberschuss, Beleihungsauslauf | Beleihungswert der Bank | ja, auf Anfrage |
| NBank / Förderantrag | VOFI nach Vorgabe der NBank; Überkompensationsmatrix als Vorbereitung | mit (primär) | nur im Antragsverfahren, als Orientierung |
| Intern / Projektentscheidung | volle Matrix (Abschnitt 3.5), Sensitivitäten, Vergleich frei zur Marktmiete | alle Varianten | nein |

### 5.2 Was nicht nach außen geht

1. **Keine Rendite aus der Mappe v2-1, solange der Umbau aus Abschnitt 6 nicht erledigt ist.** Mindestens Nr. 1 bis 5 der Umbauliste. Im Broschürenprojekt weist die Mappe K3 4,75 % aus statt 5,46 % (FR-03) bzw. 5,52 % (sauber).
2. **Keine Gegenüberstellung K3 / K5 / K6 als „mit/ohne Restwert“.** K3 und K5 haben 44,5 Jahre Laufzeit und 2 % Wiederanlage, K6 hat 42 Jahre und Wiederanlage zum IRR (Befund R2).
3. **„Ohne Restwert“ nicht als „vorsichtig“ für die Überkompensation bezeichnen**, und kein „Safe Harbour eingehalten“ (FR-02, R3).
4. **Keine Renditen von „Frei, obere Kante“ als Marktvergleich** (Befund R7: Miete 29,8 % über der modelleigenen Marktmiete). Vergleichsmaßstab ist nur „frei zur Marktmiete“.
5. **Keine statische Nettoanfangsrendite als „Objektrendite“.** Wenn überhaupt, dann „statisch, Jahr 1, brutto vor Förderung“.
6. **Keine Rendite ohne Hinweis „vor Steuern“.** Steuerliche Effekte (AfA, ggf. § 7b EStG) können die Rangfolge ändern. Sie sind nicht Teil dieser Kennzahlen.

### 5.3 Pflichtangaben zu jeder ausgewiesenen Rendite

- Ebene (Objekt brutto, Objekt nach Zuschuss, EK) und Methode (IRR oder VOFI mit Haben-/Sollzins).
- T0, Horizont, Behandlung der Bauphase.
- Restwertvariante und Methode, Anteil des Restwerts am Ergebnis.
- Tilgungssatz als Annahme (die NBank legt ihn fest), Zins nach Jahr 35.
- Kostenstand und Steigerungsraten, Mietausfall, Ausschöpfung der Mieterhöhungen.
- Platzhalter, ausdrücklich gekennzeichnet.
- Externe Rundung: Renditen auf 0,1 Pp, Beträge auf 100 €. Immer als Paar „mit RW / ohne Gebäude-RW“ oder als Bandbreite.

---

## 6. Abgleich mit dem PGN-Modell und Umbauliste

### 6.1 Abgleich (Details: `referenzrechnung-ergebnis.md` Abschnitt 9)

- **Replikation.**
  - In „Modellkonvention“ trifft die Referenzrechnung die Excel-Cache-Werte des Referenzprojekts (K1, K3, K5, K6, DSCR T1, K3/K5 T35, Verkehrswert T42, Cashflow T1; A/B/C) mit einer größten relativen Abweichung von 1·10⁻¹⁵.
  - Auch eine LibreOffice-Neuberechnung einer Kopie mit den Broschüreneingaben trifft sie: 117 Werte, Abweichung höchstens 4·10⁻¹³.
  - Die Unterschiede unten sind also Konventionen, keine Rechenfehler der Mappe.
- **Überleitung im Broschürenprojekt** (T42 mit Restwert, A):

  | Schritt | VOFI | IRR |
  |---|---:|---:|
  | Mappe wie geliefert, Broschüreneingaben | 4,75 % | 6,11 % |
  | EK ohne Doppelzählung (FR-03) | 5,46 % | 6,14 % |
  | Vorlaufzeit nicht im Exponenten (R5) | 5,79 % | 6,14 % |
  | Entgelte aus EK statt Bankdarlehen | 5,73 % | 6,11 % |
  | Bindungsabschlag über den Horizont fortgeführt (R2/R3/R4) | **5,52 %** | **5,90 %** |

  Der Rest (+0,38 Pp) ist der Methodenunterschied VOFI gegen IRR.
- **Jahresrechnung.**
  - Die Mappe mit Broschüreneingaben liefert Cashflow T1 bis T3 = +455 / +255 / +44 € (A). Das ist identisch mit der Broschüren-Jahresrechnung (`Gefoerdert_A!Q7` `=O7+P7+H7-N7`).
  - Mit korrigiertem EK finanziert die Mappe die Entgelte über ein Bankdarlehen und weist deshalb −2.290 € aus (Kapitaldienst Bank 2.745 €).

### 6.2 Umbauliste für die Mappe (internes Werkzeug)

| Nr. | Änderung | Zellen / Namen | Befund |
|---|---|---|---|
| 1 | Bares EK als Restgröße: `=MAX(0,Eigenmittel_Soll*Zuwendungsfaehig-KG_Grundstueck-Eigenleistungen_Sach)` unter Beachtung des harten Anteils von 50 %. Ein freiwilliger Mehrbetrag wird eine eigene Eingabe. `Dashboard!C67` als Sperre für alle Renditeausweise. | `Eingabe!C88`, `Basisdaten!C126`, `Dashboard!C67` | FR-03 |
| 2 | Restwert zerlegen: Boden (`Bewertung!H`) und Gebäude (L − H). Drei Zahlungsströme je Szenarioblatt: AJ mit RW, ohne Gebäude-RW, ohne RW. Dazu EK-IRR-Zeilen für alle drei. | `Bewertung!H/L`, `Gefoerdert_*!AJ`, `Dashboard!C58` | R1, R6 |
| 3 | Objekt-Zahlungsstrom je Blatt: T0 −Gesamtkosten (brutto) bzw. −(Gesamtkosten − Zuschuss netto); T1…Tn Reinertrag H; Tn + Restwert. Objekt-IRR-Zeilen brutto / nach Zuschuss × drei Varianten. | neue Spalte nach AJ, `Dashboard` | R1 |
| 4 | Vorlaufzeit aus dem Exponenten nehmen (`Bewertung!N/O` `^(1/$B30)`). Eine Bauphase nur als datierte Zahlungen. | `Bewertung!N5:O34`, `Eingabe!C107` | R5 |
| 5 | Bindungsabschlag über den Horizont hinaus bis zur Zielmiete fortführen, auf einheitlichem Preisstand (Marktmiete dynamisch oder gebundene Miete deflationiert). | `Gefoerdert_*!AD`, `BoG_Grenze`, `Eingabe!C104` | R2, R3, R4 |
| 6 | Überkompensation als Matrix: VOFI und IRR × T35 und T42 × mit RW / ohne Gebäude-RW / ohne RW. Befund nur aus der abgestimmten Hauptgröße, bis dahin nach der Regel aus 3.4. Texte neutral formulieren. | `Ueberkompensation!C11:G15`, `Dashboard!H57`, `Modellannahmen!C22` | FR-01, FR-02, R3 |
| 7 | Bezeichnungen: `Dashboard!H43` (statisch, Jahr 1, brutto vor Förderung). Den Wert nach boG aus `Bewertung!L5:L9` neben K2 zeigen. `Dashboard!G11`, `Basisdaten!D126`, `Modellannahmen!C6` an den Grundstücksansatz anpassen. | Dashboard, Basisdaten, Modellannahmen | R1, R6, R7 (Rechentechnik) |
| 8 | Entnahmemodus 1: Entnahmen im Endwert zum Habenzins aufzinsen oder den Schalter sperren. | `Bewertung!M`, `Eingabe!C99` | R6 (Rechentechnik) |
| 9 | „Frei, obere Kante“: keine Renditezeilen. `Ueberkompensation!G14` nur auf Frei_Marktmiete. Startmiete geschlossen berechnen statt fest eintragen. | `Eingabe!C69`, `Dashboard!F55:F58` | R7 |
| 10 | Kostenstand 2026 auf T1 fortschreiben oder ausdrücklich als „Kostenstand 2026 in Jahr 1“ kennzeichnen (Effekt EK-IRR −0,06 Pp). | `Gefoerdert_*!G`, `Z`; `Eingabe!E80/E81` | R5 (Rechentechnik) |

---

## 7. Offene Punkte

- **NBank:**
  - Renditegröße (VOFI oder IRR), Horizont (35 oder 42 Jahre), Wiederanlagezins, Restwertansatz und EK-Bewertung in der Überkompensationsprüfung.
  - Quelle und Stichtag des Swapsatzes.
  - Tilgungssatz und Tilgungsform (linear oder annuitätisch, ggf. Aufschub).
  - Zins ab Jahr 36.
- **PGN:**
  - Markt- und Vergleichsmiete für das Modellhaus.
  - Grundstücksansatz (Verkehrswert für EK und Restwert).
  - Veräußerungskosten.
  - Bauphase (Dauer, Abrufplan).
  - Bestätigung der vier Broschürenannahmen; die Tilgung bleibt in der Broschüre als Bandbreite (S. 12).
- **Broschüre S. 11/12:**
  - Mit 2 % Mietausfall sinken die Tilgungsschwellen auf B 1,15 % und C 1,22 %.
  - Bei 2,50 % Tilgung ist nur A knapp positiv (+455 €); B und C sind in Jahr 1 bis 9 negativ.
