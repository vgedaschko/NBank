# Prüfbericht PGN-VOFI-Modell v2-1: Objekt- und Eigenkapitalrendite vor Steuern

**Stand:** 09.11.2026 · **Internes Arbeitspapier, nicht zur Weitergabe.**

**Prüfgegenstand:** `broschuere/zulieferungen/PGN_NBank_VOFI_Modell_v2-1.xlsx`, 13 Blätter, 10.197 Formeln, aktives Szenario Basis. SHA-256 `11d558b338b4d0a57dd3f85621d6046ec12e0b027ae7309135c68ef47215e28b`, vor und nach der Prüfung gleich. Die Datei wurde nicht verändert; gerechnet wurde nur mit Kopien.

**Vorgehen**
- Drei Prüflinsen: Renditesystematik (Befunde R1–R10), Förderrecht RL Mietwohnraum 2026 (FR-01–FR-08), Rechentechnik (RT-R1–RT-R14).
- Jeder Befund der Schwere kritisch bis mittel wurde unabhängig gegengeprüft. Grundlage: Excel-Cache, LibreOffice-Neuberechnungen von Kopien in mehreren Varianten, eigene Nachrechnung in Python.
- Befunde der Schwere „gering“ sind nicht gegengeprüft. Wo ich sie für diesen Bericht in der Mappe nachgesehen habe, steht das dabei.
- Zusätzlich gibt es eine eigenständige Referenzrechnung für das Broschüren-Modellhaus (`referenzrechnung.py`).

**Wichtig vorab**
- Die Mappe rechnet nicht das Broschürenhaus, sondern das **Referenzprojekt Tarutinoer Straße 4, Neu Wulmstorf** (`Eingabe!A1`): 14 WE, 828 m², KG 200–700 = 2.963.412 €, Grundstück 0 €, Mietenstufe VI.
- Modellzahlen in diesem Bericht beziehen sich auf dieses Referenzprojekt, sofern nicht ausdrücklich „Broschürenprojekt“ dasteht.
- Laut Zellkommentaren ist die Mappe auf die Folien-Modellrechnung der Powerpoint abgestimmt (`Eingabe!C15` „wie Folien-Modellrechnung“, `Eingabe!C88` „identisch mit der Folien-Modellrechnung“, `Eingabe!C69` „PP-konsistente Parameter“).

**Grundlagen in diesem Ordner:** `modellkarte.md` (Aufbau, Formeln, Kennzahlen), `annahmen.md`/`annahmen.json` (alle Eingaben), `kennzahlen-konzept.md` (Soll-Struktur, Umbauliste), `referenzrechnung.py` und `referenzrechnung-ergebnis.md` (Rechnung für das Broschürenprojekt).

**Kurzbezeichnungen**

| Kürzel | Kennzahl | Fundstelle |
|---|---|---|
| K1 | Nettoanfangsrendite Jahr 1 (Reinertrag T1 ÷ Gesamtkosten) | `Dashboard!C43:G43` |
| K2 | vorläufiger Wertüberschuss bei Fertigstellung, vor Bindungsabschlag | `Dashboard!C44:G44` |
| K3 | VOFI-EK-Rendite mit Restwert, 44,5 J. (42 J. + 2,5 J. Vorlaufzeit) | `Bewertung!N5:N34` (*BW_Rendite*), `Dashboard!C55:G55` |
| K5 | Endwertrendite ohne Objektwert, 44,5 J. | `Bewertung!O5:O34` (*BW_RenditeBew*), `Dashboard!C57:G57` |
| K6 | EK-IRR mit Restwert, 42 J., ohne Vorlaufzeit | `Dashboard!C58:G58` auf *SA_Zahlungsstrom* (`Gefoerdert_A!AJ6:AJ56`) |

Weitere Abkürzungen: RW = Restwert, boG = besondere objektspezifische Grundstücksmerkmale (hier der Abschlag für die gebundene Miete), VKB = Verwaltungskostenbeitrag, Pp = Prozentpunkte. A/B/C = Gefördert A/B/C.

---

## 1. Kurzfazit

### 1.1 Ergebnis

Die These des Kunden bestätigt sich im Kern: Die Mappe rechnet dynamisch nur Eigenkapitalrenditen; eine Objektrendite gibt es nur als statische Nettoanfangsrendite des ersten Jahres vor Zuschuss (`Dashboard!C43`), die `Dashboard!H43` als „übliche Objektrendite … unabhängig von der Kapitalstruktur“ beschreibt. Auf der Eigenkapitalebene ist nur die VOFI-Familie gepaart (K3 mit, K5 ohne Restwert, `Bewertung!N30`/`O30`); zum EK-IRR (`Dashboard!C58`) fehlt das Gegenstück ohne Restwert, und „ohne Gebäude-Restwert, Boden bleibt“ ist nicht angelegt, weil der Restwert nicht in Boden und Gebäude zerlegt und das Grundstück mit 0 € angesetzt ist. Der Rechenkern ist dagegen korrekt und unabhängig auf rund 10⁻⁸ genau nachgerechnet; die Unterschiede zwischen den Kennzahlen sind Konventionen (Horizont, Vorlaufzeit, Wiederanlage), keine Rechenfehler.

Zu hoch oder unvergleichbar werden die Renditen mit Restwert durch drei Ansätze: Der Restwert (72 % des Endvermögens) ist am Horizont ohne Abschlag für die weiterlaufenden niedrigen Bestandsmieten angesetzt, die Vorlaufzeit von 2,5 Jahren wirkt nur im Exponenten der VOFI-Rendite, und mit eingetragenem Grundstück, wie beim Broschürenhaus, setzt die Mappe das Eigenkapital um den Grundstückswert zu hoch an.

Nach außen verwendbar sind die Annahmesätze (Mietausfall 2 %, Verwaltung 367 € je Wohnung, Instandhaltung 14,40 €/m², Tilgung 2,5 % als PGN-Annahme) und die Abbildung der Förderkonditionen nach RL 2026, also alles, was die Broschüre für ihre Liquiditätsrechnung braucht; mit den Broschüreneingaben reproduziert die Mappe deren Jahresrechnung auf den Euro. Nicht nach außen verwendbar sind in v2-1 alle Renditezahlen, auch in der Powerpoint, soweit sie Renditen aus dieser auf die Folien-Modellrechnung abgestimmten Mappe übernimmt. Dasselbe gilt für jede Aussage zum Safe Harbour: `Dashboard!H57` und `Modellannahmen!C22` nennen die Rendite ohne Restwert die „vorsichtigste“ bzw. die dem Prüfmaßstab nähere Lesart, obwohl sie in der Überkompensationsprüfung die antragstellerfreundliche ist; mit Restwert liegt jede Methoden- und Horizontvariante rund 2 bis 4 Pp über dem Grenzwert von 4,39 %, und die maßgebliche Rechnung nimmt ohnehin die NBank selbst vor (RL Nr. 11.10 Abs. 3).

Nach dem Umbau Nr. 1 bis 5 (Abschnitt 4.3) taugt die Mappe als internes Werkzeug und für die individuelle Beratung, dann aber nur mit Paaren „mit Restwert / ohne Gebäude-Restwert“ auf gleicher Zeitbasis und mit ausgewiesenem Restwertanteil.

### 1.2 Verwendung im Überblick

| Verwendung | v2-1 geeignet? | Bedingung |
|---|---|---|
| Annahmesätze für die Broschüren-Jahresrechnung S. 11/12 | ja | Tilgung als Annahme kennzeichnen, Kostenstand 2026 nennen (Abschnitt 5) |
| Förderkonditionen RL 2026 (Quoten, Zins, VKB, Entgelte, Höchstmieten, Bindung) | ja | Zins ab Jahr 36 und Bauphase sind Vorbehalte (Abschnitt 3) |
| Liquidität: Zahlungsüberschuss, DSCR | ja | Bearbeitungsentgelte aus Eigenmitteln, nicht über ein Bankdarlehen |
| Renditen in Powerpoint, Exposé, Investorengespräch | nein | erst nach Umbau Nr. 1–5, dann nur als Paar und Bandbreite |
| Vergleich gefördert gegen frei finanziert | nein | nur gegen *Frei_Marktmiete* und als Objekt-IRR, nicht mit K1 |
| Aussage zum Safe Harbour / zur Überkompensation | nein | NBank rechnet selbst; intern nur als Orientierung |
| Internes Werkzeug für Projektentscheidungen | eingeschränkt | Befunde B1 bis B5 beachten |

---

## 2. Befunde

### 2.1 Übersicht (nach Schwere)

| Nr. | Befund | Schwere | Gegenprüfung | Prüflinsen |
|---|---|---|---|---|
| B1 | Keine dynamische Objektrendite; K1 als „übliche Objektrendite“ beschrieben | kritisch | bestätigt, präzisiert | R1, RT-R1 |
| B2 | EK-Renditen nicht konsistent gepaart; kein EK-IRR ohne RW; keine Variante „ohne Gebäude-RW“ | kritisch | bestätigt, präzisiert | R2, R6, RT-R1 |
| B3 | Überkompensation: Prüfgröße nicht festgelegt, Texte gewichten die antragstellerfreundliche Lesart als „vorsichtig“ | hoch | präzisiert | R3, FR-01, FR-02 |
| B4 | Grundstück 0 €, Texte nennen eine Sacheinlage; bei eingetragenem Grundstück zu hohes bares EK | hoch (latent, im Broschürenprojekt aktiv) | präzisiert | FR-03, R6 |
| B5 | Restwert am Horizont ohne Abschlag für Mindermieten, für A/B/C gleich | mittel | bestätigt | R4, RT-R2 |
| B6 | Bindungsabschlag mischt Preisstände | mittel | bestätigt | RT-R3 |
| B7 | Vorlaufzeit nur im Exponenten, Bauphase ohne Zahlungen | mittel | bestätigt, präzisiert | R5, RT-R4, FR-04 |
| B8 | Kostenstand 2026 im Bewirtschaftungsjahr 2028 | mittel | bestätigt | RT-R5 |
| B9 | Vollausschüttung: Entnahmen fehlen im VOFI-Endwert | mittel (latent) | bestätigt | RT-R6 |
| B10 | „Frei, obere Kante“ als Renditevergleich | mittel | präzisiert | R7, RT-R8 |
| B11 | Wertüberschuss bei Fertigstellung nur vor Bindungsabschlag | gering bis mittel | präzisiert | R1, RT-R7 |
| G1–G12 | Darstellungs- und Kontrollmängel | gering | nicht gegengeprüft | Abschnitt 2.4 |

### 2.2 Kritisch

#### B1 Keine dynamische Objektrendite; die statische Kennzahl ist irreführend beschrieben

**Problem.**
- Für die Objektsicht (unlevered, vor Steuern) gibt es nur K1, die statische Nettoanfangsrendite Jahr 1 auf die Gesamtkosten vor Zuschuss, und K2, eine Wertmarge bei Fertigstellung.
- Es fehlen Objekt-IRR und Objekt-VOFI-Rendite, jeweils mit und ohne Restwert.
- `Dashboard!B43` benennt K1 korrekt als „Nettoanfangsrendite Jahr 1“. `Dashboard!H43` beschreibt sie aber als „die übliche Objektrendite vor Finanzierung, unabhängig von der Kapitalstruktur“. Das ist für den Vergleich gefördert/frei irreführend: Gruppenmiete und Zuschussquote hängen zusammen. K1 enthält die Kosten der Bindung (niedrige Miete), aber nicht ihren Ausgleich (Zuschuss).

**Beleg.**
- `Dashboard!C43:G43` `=IFERROR(INDEX(SA_Reinertrag,MATCH(1,SA_t,0))/Gesamtkosten,"n. v.")` ergibt A/B/C 1,66 / 2,12 / 2,38 %, frei oben/unten 5,60 / 4,18 %. Für A: 49.152 € ÷ 2.963.412 € (`Basisdaten!C33`).
- In der gesamten Mappe gibt es genau fünf IRR-Formeln, alle in `Dashboard!C58:G58` auf *SA_…_Zahlungsstrom* (EK-Reihe). Geprüft wurde eine Suche über alle 13 Blätter nach IRR, XIRR, MIRR, RATE und NPV. Auf *SA_Reinertrag* gibt es weder IRR noch VOFI.

**Auswirkung.** Nachrechnung für das Referenzprojekt, Restwert wie in der Mappe (`Bewertung!L30`), T42:

| Objektrendite (IRR) | A | B | C | Frei oben | Frei unten |
|---|---:|---:|---:|---:|---:|
| brutto, mit RW | 3,64 % | 4,10 % | 4,36 % | 7,59 % | 6,17 % |
| brutto, ohne RW | 0,42 % | 1,45 % | 1,97 % | 6,79 % | 4,89 % |
| nach Zuschuss, mit RW | 5,48 % | 4,94 % | 4,77 % | – | – |
| nach Zuschuss, ohne RW | 2,68 % | 2,47 % | 2,47 % | – | – |
| nachr.: Nettoanfangsrendite nach Zuschuss | 2,76 % | 2,65 % | 2,65 % | – | – |

- Brutto gilt A < B < C, nach Zuschuss kehrt sich die Folge um (A > B > C).
- Eine Aussage wie „Objektrendite gefördert 1,7 % gegen frei 5,6 %“ wäre irreführend, zumal „frei oben“ kein Marktvergleich ist (B10).

**Korrektur.**
- Je Alternative eine Objekt-Zahlungsreihe anlegen: T0 −Gesamtkosten (KG 100–800, Grundstück zum Verkehrswert, ohne Bearbeitungsentgelte und VKB) bzw. −(Gesamtkosten − Zuschuss netto); T1…Tn Reinertrag (Spalte H); in Tn zusätzlich der Restwert in drei Varianten (B2).
- IRR für T35 und T42 ausweisen.
- `Dashboard!H43` umbenennen in „statisch, Jahr 1, brutto vor Zuschuss, ohne Restwert“.
- Umbauliste Nr. 3 und 7.

#### B2 EK-Renditen ohne konsistente Paare; „ohne Gebäude-Restwert“ fehlt

**Problem.**
- Auf der EK-Ebene stehen drei Größen aus zwei Methodenfamilien untereinander:
  - **VOFI:** K3 (mit RW) und K5 (ohne RW), gleicher Endwertansatz, gleiches Konto (Haben 2 %, Soll 5 %), gleicher Exponent 44,5 J. Dieses Paar ist in sich konsistent und steht so auch in `Ueberkompensation!C11:D13`.
  - **IRR:** K6 (mit RW) über 42 J., ohne Vorlaufzeit, mit Wiederanlage implizit zum IRR. Ein Gegenstück ohne RW fehlt.
- Wer K6 gegen K5 als „mit/ohne Restwert“ liest, vermischt zwei Methoden. Die Nichtvergleichbarkeit von K3 und K6 räumt die Mappe selbst ein (`Dashboard!H55`, `H58`), schließt die Lücke aber nicht.
- „Ohne RW“ in K5 streicht Gebäude und Boden zusammen. Die vom Kunden gemeinte Variante „ohne Gebäude-Restwert, Boden bleibt“ ist nirgends angelegt. Der Restwert `Bewertung!L` ist nicht zerlegt; der Bodenwert `Bewertung!H30` ist 0, weil das Grundstück auf 0 € steht (B4).

**Beleg.**
- `Bewertung!N30` `=IF(AND(M30>0,Eigenkapital>0,$B30>0),(M30/Eigenkapital)^(1/($B30+Vorlaufzeit_Jahre))-1,"n. v.")` mit `M30` `=D30+L30-E30` (Konto + Verkehrswert − Restschuld).
- `Bewertung!O30` `=IF(AND(D30-E30>0,…),((D30-E30)/Eigenkapital)^(1/($B30+Vorlaufzeit_Jahre))-1,"n. v.")`.
- `Dashboard!C58` `=IFERROR(IRR(SA_Zahlungsstrom),…)`; Reihe `Gefoerdert_A!AJ48` `=IF($A48=0,T48-Eigenkapital,IF($A48>Jahre_n,0,T48+S48+IF($A48=Jahre_n,IFERROR(AVERAGEIFS(BW_EW,BW_n,Jahre_n,BW_Alt,1),0)-X48,0)))`.

**Auswirkung.**

| EK-Rendite (Referenzprojekt) | A | B | C |
|---|---:|---:|---:|
| K3 VOFI mit RW, 44,5 J. | 6,38 % | 6,44 % | 6,49 % |
| K5 VOFI ohne RW, 44,5 J. | 3,35 % | 3,56 % | 3,74 % |
| K6 EK-IRR mit RW, 42 J. | 7,92 % | 7,93 % | 8,02 % |
| EK-IRR ohne RW, 42 J. (Nachrechnung, fehlt im Modell) | 4,68 % | 4,92 % | 5,19 % |

- Zerlegung für A:
  - K6 − K5 = 4,58 Pp. Der reine Restwerteffekt beträgt im IRR 3,24 Pp und im VOFI 3,03 Pp.
  - K6 − K3 = 1,55 Pp ist Methode: 0,39 Pp Vorlaufzeit und 1,16 Pp Wiederanlage.
- Beweis, dass die Formeln richtig sind: Mit Guthabenzins = IRR und Vorlaufzeit 0 ergibt die VOFI-Rendite exakt den EK-IRR (A 7,924 %, ebenso B, C und frei oben).
- Boden gegen Gebäude (LibreOffice-Lauf mit Grundstück zum Verkehrswert 731.325 €, EK = Grundstück, A):

  | | mit RW | ohne Gebäude-RW | ohne RW |
  |---|---:|---:|---:|
  | VOFI-EK | 5,69 % | 3,00 % | 1,40 % |
  | EK-IRR | 6,15 % | 3,34 % | 1,51 % |

  Zwischen „ohne Gebäude-RW“ und „ohne RW“ liegen 1,5 bis 1,8 Pp. Mit Boden 0 € sind beide Varianten heute identisch.

**Korrektur.**
- EK-Ebene als Matrix auf identischer Zeitbasis anlegen: EK-IRR und VOFI-EK, je mit RW / ohne Gebäude-RW / ohne RW, Horizont T35 und T42, gleicher T0, keine Vorlaufzeit im Exponenten.
- Restwert in Boden (`Bewertung!H`) und Gebäude (L − H) zerlegen; je Szenarioblatt drei AJ-Reihen.
- Brücke Objekt-IRR nach Zuschuss → EK-IRR als Leverage-Effekt zeigen (A: 5,48 % → 7,92 %).
- Umbauliste Nr. 2 und 4.

### 2.3 Hoch und mittel

#### B3 Überkompensation: Prüfgröße nicht festgelegt, Texte falsch gewichtet (hoch)

**Problem.**
- `Ueberkompensation!G11:G13` leitet den Befund allein aus K3 ab: VOFI, Horizont *Jahre_n* 42 + 2,5 J. Vorlaufzeit, Wiederanlage 2 %. Ergebnis: „Safe Harbour NICHT erfüllt“, 1,99 / 2,05 / 2,10 Pp über dem Grenzwert. Das ist die strenge Lesart und mit Restwert über alle Methoden und Horizonte robust.
- `Dashboard!H57` nennt K5 „bewusst die vorsichtigste Lesart, gedacht für die Überkompensationsprüfung“. `Modellannahmen!C22` sagt, K5 liege „näher am Prüfmaßstab … Mit ihr ist der Safe Harbour eingehalten, mit der VOFI-EK-Rendite nicht. Welche Größe die Bewilligungsstelle ansetzt, ist abzustimmen.“
- In einer Überkompensationsprüfung ist die niedrigere Rendite die für den Antragsteller günstige Lesart, nicht die vorsichtige.
- RL Nr. 11.10 Abs. 3 stellt auf die „mit dem geförderten Objekt erzielbare Eigenkapitalrendite“ nach VOFI ab; dazu gehört der Objektwert im Endvermögen. Weder RL noch Art. 6 Abs. 1 DAWI-Beschluss schließen den Restwert aus, und ein Restwert von null bei 45 Jahren Restnutzungsdauer in T35 ist nicht plausibel.
- Die Begründung in C22 („enthält Bodenwertwachstum“) greift im Basisfall nicht, weil der Bodenwert 0 ist.
- Der Prüfhorizont hängt an *Jahre_n* (42) statt an der Bindung (35). Eine IRR-Gegenrechnung fehlt, obwohl Art. 6 Abs. 1 die Kapitalrendite als IRR über den Betrauungszeitraum definiert (G3-21).
- Einen inhaltlichen Widerspruch zwischen C22 und G11:G13 gibt es nicht: C22 räumt selbst ein, dass mit K3 der Safe Harbour nicht erfüllt ist. `Ueberkompensation!C18` ist richtig neutral formuliert.

**Beleg.** `Ueberkompensation!C7` `=Swapsatz_30J+DAWI_Aufschlag` = 4,39 %; `C11` `=IFERROR(AVERAGEIFS(BW_Rendite,BW_n,Jahre_n,BW_Alt,1),"n. v.")` = 6,376 %; `G11` `=IF(…,IF(C11<=DAWI_Grenzwert,"Safe Harbour erfüllt…","Safe Harbour NICHT erfüllt…"))`; Texte `Dashboard!H57`, `Modellannahmen!C22`; RL Nr. 11.10 Abs. 3/4.

**Auswirkung.** Referenzprojekt, Szenario Basis, Grenzwert 4,39 %:

| Variante | A | B | C | gegen Grenzwert |
|---|---:|---:|---:|---|
| VOFI mit RW, 44,5 J. (Modellbefund) | 6,38 % | 6,44 % | 6,49 % | darüber |
| VOFI mit RW, T35 (`Bewertung!N25:N27`) | 6,79 % | 6,88 % | 6,95 % | darüber |
| EK-IRR mit RW, 42 J. | 7,92 % | 7,93 % | 8,02 % | darüber |
| EK-IRR mit RW, 35 J. (Verkehrswert `Bewertung!L25:L27` − Restschuld) | 8,36 % | 8,36 % | 8,46 % | darüber |
| VOFI ohne RW, 44,5 J. | 3,35 % | 3,56 % | 3,74 % | darunter |
| VOFI ohne RW, T35 (`Bewertung!O25:O27`) | 2,37 % | 2,39 % | 2,51 % | darunter |
| EK-IRR ohne RW, 42 J. | 4,68 % | 4,92 % | 5,19 % | darüber |
| EK-IRR ohne RW, 35 J. | 3,01 %* | 3,00 % | 3,25 % | darunter |

\* zweite Nullstelle bei −41 %, weil am Horizont die Restschuld abfließt.

- Mit Restwert liegt jede Variante über dem Grenzwert, auch bei 50 % weniger Restwert (K3 5,31 %, K6 6,85 %) und im Worst Case (K3 5,56 %).
- Ohne Restwert hängt das Ergebnis an der Methode. Mit EK-Abfluss 2,5 J. vor T0 liegt der IRR ohne RW für A darunter (4,21 %), für B/C darüber (4,45 / 4,70 %).
- Die Endwertrendite liegt systematisch unter dem IRR: −0,39 Pp durch die Vorlaufzeit, rund −1,1 Pp durch die Wiederanlage zu 2 %. Nahe am Grenzwert kann das ein falsches „erfüllt“ ergeben.

**Korrektur.**
- Primärgröße: VOFI-EK-Rendite mit Restwert, weil RL Nr. 11.10 Abs. 3 den VOFI vorschreibt. Gegenrechnung: EK-IRR mit Restwert nach Art. 6 Abs. 1 DAWI. Beides für T35 und T42 auf gleicher Zeitbasis.
- Den Horizont von 35 Jahren als Variante führen, nicht als gesetzt: Welchen Betrauungszeitraum die NBank ansetzt, ist nicht veröffentlicht (G3-21).
- Größen ohne Restwert nur nachrichtlich und nicht als „vorsichtig“ bezeichnen. `Dashboard!H57` und `Modellannahmen!C22` neutral fassen wie `Ueberkompensation!C18`.
- Den Befund in G11:G13 nur aus einer mit der NBank abgestimmten Hauptgröße ableiten. Bis dahin gilt: „nicht erfüllt, ergänzende Ermittlungen nach Art. 6 Abs. 4“, sobald eine Variante mit Restwert den Grenzwert überschreitet.
- Beim IRR ohne Restwert auf Mehrfachnullstellen achten.
- Umbauliste Nr. 6.

#### B4 Grundstück und Eigenkapital (hoch, im Referenzprojekt latent, im Broschürenprojekt aktiv)

**Problem.**
- Das Grundstück ist bewusst mit 0 € angesetzt. Kommentar zu `Eingabe!C15`: „Auf Wunsch OHNE Grundstueck gerechnet (wie Folien-Modellrechnung). Tatsaechlicher Verkehrswert des Flurstuecks: 731.325 EUR.“ Das Eigenkapital ist damit nur bar (592.682 €).
- Die Texte `Dashboard!G11`, `Basisdaten!D126`, `Modellannahmen!C6` und `Ueberkompensation!C20` beschreiben dagegen eine Sacheinlage des lastenfreien Grundstücks. Die Rechenlogik für den Boden ist vorhanden, aber nicht belegt.
- Sobald ein Grundstück eingetragen wird, ist das bare EK zu hoch:
  - `Eingabe!C88` `=0.2*Zuwendungsfaehig` setzt das bare EK fest auf 20 % der zuwendungsfähigen Kosten. Diese enthalten das Grundstück schon, die Formel rechnet es aber nicht an. Nach RL Nr. 5.2.6 Satz 2 ist der Wert des lastenfreien Grundstücks jedoch Eigenmittel (F095).
  - `Basisdaten!C126` `=KG_Grundstueck+EK_bar` führt dann Grundstück und Bargeld nebeneinander.
  - Der Überschuss (Grundstückswert abzüglich Bearbeitungsentgelt) liegt als Kasse T0 im VOFI-Konto (`Gefoerdert_A!Y6`), wird zu 2 % verzinst und vergrößert den Nenner aller Renditen.
- Die Mappe dokumentiert das (`Eingabe!E88`: „Zusätzlich zur Sacheinlage des Grundstücks … erhöht es sonst den Kassenbestand in T0“) und meldet es in `Dashboard!C67` bzw. `Finanzierung!H12`. Falsch ist also nicht die Meldung, sondern die Voreinstellung.
- `Dashboard!D66` („Eigenmittel 20 % erfüllt“) ist korrekt, denn 5.2.6 ist eine Mindestquote.
- Eigenleistungen (`Eingabe!C89`) zählen zu den Eigenmitteln (`Basisdaten!C128`), mindern aber weder den Barbedarf (`C32`) noch das Bankdarlehen (`C78`) und fehlen in `C126`.

**Auswirkung.**

| Fall | Eigenkapital | Kasse T0 | K3 Mappe → korrigiert | Abstand zum Grenzwert, A |
|---|---:|---:|---|---|
| Referenzprojekt mit Grundstück 354.120 € (Bodenrichtwert × Fläche) | 1.017.626 € (30,7 %) statt 663.506 € | 330.897 € | A/B/C 5,29 / 5,32 / 5,36 % → 6,10 / 6,13 / 6,17 % | +0,90 statt +1,71 Pp |
| Broschürenprojekt (Grundstück 0,7 Mio. €) | 2,1 Mio. € statt 1,4 Mio. € | 651.000 € | A 4,75 → 5,46 %, C 4,71 → 5,38 % | +0,36 statt +1,07 Pp |

- K3 fällt um 0,7 bis 0,8 Pp zu niedrig aus, also zugunsten des Antragstellers. Nahe am Grenzwert kippt der Befund fälschlich auf „erfüllt“.
- K5 verschiebt sich je nach Fall nach unten oder oben (Broschürenprojekt A 1,80 statt 1,74 %). Der EK-IRR ist kaum betroffen (A 7,26 statt 7,29 %), weil `AJ6` `=T6-Eigenkapital` die Kasse saldiert.
- Die Jahresrechnung der Broschüre ist nicht betroffen.

**Korrektur.**
- Bares EK als Restgröße: `=MAX(0,Eigenmittel_Soll*Zuwendungsfaehig-KG_Grundstueck-Eigenleistungen_Sach)`, unter Beachtung des harten Anteils von mindestens 50 % (RL Nr. 5.2.6 Satz 3). Ein freiwilliger Mehrbetrag wird eine eigene Eingabe; die Formel gehört nach *Basisdaten*, nicht in eine blaue Eingabezelle.
- Eigenleistungen einheitlich in `Basisdaten!C32/C78`, `Gefoerdert_*!P6` und `C126` behandeln. `Dashboard!C67` als Sperre für alle Renditeausweise nutzen.
- Grundstück zum Verkehrswert für EK und Restwert ansetzen; der Bodenrichtwertdeckel (`Basisdaten!C24`, RL Nr. 5.3.2.3) gilt nur für die Förderbemessung.
- Texte G11, D126, C6, C20 an den tatsächlichen Ansatz anpassen. Umbauliste Nr. 1 und 7.

#### B5 Restwert am Horizont ohne Abschlag für Mindermieten (mittel)

**Problem.**
- Der Restwert ist der vorläufige Ertragswert aus Marktmiete abzüglich boG (`Bewertung!L30` `=J30-K30`).
- Der Abschlag in Spalte AD summiert nur Jahre mit t > T und t ≤ *BoG_Grenze* = *Jahre_n* = 42 (`Basisdaten!C140` `=IF(BoG_bis="Bindungsende",Bindung,Jahre_n)`). Am Horizont ist die Summe deshalb leer: `Gefoerdert_A!AD48` = 0. Zusätzlich sind *SA_Marktmiete* und *SA_Miete* für t > *Jahre_n* auf 0 gesetzt. Ein Schalter allein behebt das also nicht.
- Folge: Restwert T42 = 6.713.518 € für A, B und C gleich (`Bewertung!L30:L32`). Die Mieten liegen in T42 aber bei 18,88 / 22,77 / 24,99 €/m² gegen eine Marktmiete von 32,61 €/m² (`Gefoerdert_A/B/C!C48`, `E48`), also 42 / 30 / 23 % darunter.
- Das widerspricht `Eingabe!E104` („Die Bewilligungsmiete holt den Markt nicht ein: Bestandsmietverhältnisse laufen weiter …“). Die Bindung endet in T35; in T42 handelt es sich um Bestandsmieten unter der Kappung nach § 558 BGB, also um einen Mindermietenabschlag.
- Der Restwert trägt 72,4 % des Endwerts (`Bewertung!M30` = 9.276.240 €). Veräußerungskosten (`Dashboard!H52`) und Modernisierungen (`Modellannahmen!C27`) sind nicht angesetzt.

**Auswirkung.**
- Der Abschlag, nach der Logik von Spalte AD über T42 fortgeführt, beträgt A 464.498 €, B 210.048 €, C 144.797 €. Die Fortschreibung reproduziert `Bewertung!K25` (755.396 €) exakt.
- Damit K3 6,25 / 6,39 / 6,46 %, K6 7,80 / 7,88 / 7,99 %, Abstand `Ueberkompensation!E11:E13` 1,86 / 2,00 / 2,07 statt 1,99 / 2,05 / 2,10 Pp.
- Diese Beträge sind eine Untergrenze. Bei einheitlichem Preisstand und ohne Mieterwechsel wären es bis zu 1,26 / 1,02 / 0,95 Mio. €.
- Restwert −20 % senkt K3 und K6 je um 0,37 Pp. Eine grobe Sachwert-Gegenprobe (3,23 Mio. €, 48 % des Ertragswerts) ergibt für A K3 5,26 %, K6 6,80 %.
- Broschürenprojekt (Referenzrechnung): Restwert A 11,90 → 10,66 Mio. €.

**Korrektur.** Mietpfad über *Jahre_n* hinaus fortschreiben und den Abschlag bis zur Zielmiete führen. Veräußerungskosten abziehen. Restwert in Boden und Gebäude zerlegen. Restwertanteil und Sensitivität (−20 %, Sachwert) im Dashboard zeigen. Umbauliste Nr. 5.

#### B6 Bindungsabschlag mischt Preisstände (mittel)

**Problem.** `Gefoerdert_A!AD7` `=…SUMPRODUCT((SA_t>$A7)*(SA_t<=BoG_Grenze)*…*(IFERROR(INDEX(SA_Marktmiete,MATCH($A7+1,SA_t,0)),0)-SA_Miete)*Wohnflaeche*Monate_Jahr*(1-Mietausfall)/(1+AA7)^(SA_t-$A7))`. Die Marktmiete geht als fester Wert des Folgejahres ein, die gebundene Miete dagegen nominal steigend (+6,15 % je 3 Jahre, nach der Bindung +20 % je 3 Jahre). Abgezinst wird mit dem Liegenschaftszins. Der vorläufige Ertragswert (`Z`/`AC`) rechnet dagegen statisch. Die Mietdifferenz schrumpft dadurch künstlich.

**Auswirkung.**
- Abschlag T1 bei einheitlichem Preisstand: A 1.159.554 → 1.760.883 € (+52 %), B 783.413 → 1.441.455 €, C 601.794 → 1.258.924 €.
- Folgewirkungen: Verkehrswert T1 (A) 2,55 → 1,95 Mio. €; LTV am Verkehrswert T1 (`Dashboard!C28:E28`) 46,1 / 59,9 / 65,7 → 60,3 / 77,3 / 83,4 %; K3 am Stichtag T10 (A) 11,32 → 9,04 %; K3 T35 −0,03 Pp.
- K3 und K6 in T42 sind nicht betroffen, weil der Abschlag dort ohnehin 0 ist (B5).
- Gegenprobe mit dem Standardansatz (konstante Differenz × Rentenbarwertfaktor) liegt innerhalb von ±2 %.

**Korrektur.** Beide Mieten auf denselben Preisstand bringen (statisch zum Stichtag oder beide nominal mit nominalem Zins) und die Konvention in `Eingabe!E104` dokumentieren. Umbauliste Nr. 5.

#### B7 Vorlaufzeit nur im Exponenten, Bauphase ohne Zahlungen (mittel)

**Problem.**
- 2,5 Jahre Vorlaufzeit (`Eingabe!C107`) verlängern nur den Annualisierungszeitraum von K3/K5 auf 44,5 Jahre (`Bewertung!N30`). `Eingabe!E107` sagt das ausdrücklich: „wirkt ausschließlich im Exponenten“.
- Alle Mittel fließen in T0 (`Gefoerdert_A!P6` `=IF($A6=0,Darlehen_A+Zuschuss_A+Bank_A+EK_bar,0)`).
- KG 800 steht auf 0 €, obwohl `Basisdaten!C30` Bauzeitkosten von 83.716 € ausweist (`C31` `=IF(KG800_berechnen="ja",Bauzeitkosten,KG_Finanzierung)`, `Eingabe!C95` = „nein“).
- Der VKB fällt erst ab T1 an (`Eingabe!E44`, Vorbehalt). K6 rechnet ohne Vorlaufzeit (`Dashboard!B58`).
- Die Begründung „Grundstück gebunden“ greift bei Grundstück 0 € nicht. Das bare EK fließt aber in die Baukosten; eine Bindung über die Bauzeit von 12 Monaten (`Eingabe!C91`) ist deshalb sachlich vertretbar, 2,5 Jahre sind durch keine Zahlung gedeckt.
- Die Mappe legt die Lücken selbst offen (`Eingabe!E44`, `E91`, `E95`, `E107`, `Dashboard!H55/H58`).

**Auswirkung.**
- Mit `Eingabe!C107` = 0: K3 6,77 / 6,84 / 6,89 % (+0,39 bis +0,40 Pp), K5 (A) 3,55 % (+0,20 Pp).
- Umgekehrt, mit EK-Abfluss in T−2,5 auch im IRR: A 7,29 % mit, 4,21 % ohne Restwert.
- Der fehlende VKB der Bauphase beträgt je nach Abrufplan rund 3.000 bis 6.200 € (A bis C), im Broschürenprojekt rund 8.400 / 12.600 / 14.700 €. Wirkung auf die EK-Renditen unter 0,05 Pp; die Broschüren-Jahresrechnung ist nicht betroffen.
- Die informative Bauzeitrechnung (83.716 €) überzeichnet die Kosten für A bis C, weil sie alle KG zu 4,9 % verzinst und das 0-%-Darlehen nicht berücksichtigt.

**Korrektur.** Bauphase als datierte Zahlungen in VOFI und IRR gleich abbilden: EK zuerst, Abruf in Teilraten (RL Nr. 5.5.3), VKB ab Auszahlung (RL Nr. 12.7.1), Entgelt mit der ersten Rate, Zwischenfinanzierung der Schlussrate. Den Exponenten-Zuschlag streichen. Die Vorlaufzeit nur auf 0 zu setzen, überzeichnet die Rendite. Schalter `BE_in_KG800` nur zusammen mit KG 800 verwenden, sonst verschwindet das Entgelt. Umbauliste Nr. 4.

#### B8 Kostenstand 2026 im Bewirtschaftungsjahr 2028 (mittel, für die Broschüre relevant)

**Problem.** Verwaltung und Instandhaltung sind „ImmoWertV Anlage 3, fortgeschrieben auf 2026“ (`Eingabe!E80/E81`). `Gefoerdert_A!G7` `=…(Verwaltung_WE*Wohneinheiten+Instandhaltung_qm*Wohnflaeche)*(1+Kosten_Wachstum)^($A7-1)+Mietausfall*F7` setzt sie in T1 = 2028 (`B7`) mit Exponent 0 an. Die Marktmieten sind dagegen auf 2028 fortgeschrieben (`Basisdaten!C46/C47`). Gleiches gilt für `Z` und `Bewertung!G`.

**Auswirkung.** Kosten 4,04 % zu niedrig (A: 689 € in T1). K1 (A) 1,66 → 1,64 %; DSCR-Minimum 1,330 / 1,147 / 1,109 → 1,311 / 1,134 / 1,098; K5 −0,06 Pp; K6 (A) 7,92 → 7,85 %. Für die Broschüre: Mit fortgeschriebenen Kosten (381,83 € je Wohnung, 14,98 €/m²) läge A in Jahr 1 bei −656 € statt +455 € (Abschnitt 5).

**Korrektur.** Eingabe „Preisstand Bewirtschaftungskosten“ einführen und den Exponenten in G, Z und `Bewertung!G` einheitlich darauf beziehen, oder den Kostenstand ausdrücklich ausweisen. Umbauliste Nr. 10.

#### B9 Vollausschüttung: Entnahmen fehlen im VOFI-Endwert (mittel, latent)

**Problem.** Bei *Entnahme_Modus* = 1 verlassen die Überschüsse das Konto (`Gefoerdert_A!S7` `=IF(AND(Entnahme_Modus=1,$A7>0,$A7<=Jahre_n),MAX(0,Q7),0)`). Der Endwert `Bewertung!M30` `=D30+L30-E30` zinst sie nicht auf und rechnet sie nicht ein. Der Schalter ist frei wählbar (`Eingabe!C99`, Anzeige `Dashboard!A3`).

**Auswirkung.** LibreOffice-Lauf mit `Eingabe!C99` = 1: K3 = 5,606 % identisch für A, B, C und frei oben; K5 „n. v.“; K6 unverändert. Es fehlen Entnahmen von 1,93 / 2,17 / 2,35 Mio. € (frei oben 6,78 Mio. €). Der Abstand zum Grenzwert sinkt für A von 1,99 auf 1,22 Pp, nur durch den Schalter. Derzeit steht C99 auf 0.

**Korrektur.** Entnahmen im Endwert zum Habenzins bis zum Horizont aufzinsen oder den Schalter für Renditeausweise sperren. Umbauliste Nr. 8.

#### B10 „Frei, obere Kante“ als Renditevergleich (mittel)

**Problem.**
- Die Startmiete dieser Variante ist die für das DSCR-Ziel 1,25 erforderliche Miete, als fester Wert eingetragen (`Eingabe!C69` = 18,8006032). Sie liegt in allen Jahren 29,8 % über der modelleigenen Marktmiete (`Dashboard!F14` 18,80 gegen `G14` 14,48 €/m²); der Restwert wird dagegen aus der Marktmiete gerechnet (`Bewertung!L33`).
- Die Spalte ist gekennzeichnet („Frei, obere Kante (DSCR-Ziel)“, `Dashboard!F5`), und `Eingabe!E69` beschreibt einen Korridor. Dennoch stehen ihre Renditen unkommentiert neben den anderen und dienen in `Ueberkompensation!G14` als „Vergleichsmaßstab“.
- Der feste Wert stimmt nur im Szenario Basis: erforderlich wären Best 17,95 €/m², Worst 21,36 €/m² (DSCR dort 1,09 statt 1,25).

**Auswirkung.** Frei oben: K1 5,60 %, K3 7,62 %, K6 12,25 %, Objekt-IRR 7,59 %. Frei zur Marktmiete: 4,18 / 6,91 / 8,29 / 6,17 %. Im EK-IRR liegt A 4,33 Pp hinter „frei oben“, aber nur 0,37 Pp hinter dem Marktfall.

**Korrektur.** Renditevergleich nur gegen *Frei_Marktmiete*; für die obere Kante keine Renditezeilen. Die erforderliche Startmiete nicht als Verweis `C69` → `Basisdaten!C50` anlegen, denn das erzeugt einen Zirkelbezug über *SF_Mietbedarf*. Sie lässt sich geschlossen berechnen, weil der Mietbedarf algebraisch nicht von der Startmiete abhängt (bei *Entnahme_Modus* 0). Umbauliste Nr. 9.

#### B11 Wertüberschuss bei Fertigstellung nur vor Bindungsabschlag (gering bis mittel)

**Problem.** `Dashboard!C44:G44` `=IFERROR(AVERAGEIFS(BW_Marktwert,BW_n,0,BW_Alt,k)/Gesamtkosten-1,"n. v.")` = 23,2 % in allen fünf Alternativen. Die Zeile ist korrekt als „(vor boG)“ beschriftet (`B44`, `H44`). Es fehlt aber das Gegenstück nach Abschlag. Die einzigen Dashboard-Zeilen zu Abschlag und Verkehrswert (`C45:G47`) stehen in T42, wo der Abschlag 0 ist (B5).

**Auswirkung.** Nach Abschlag (`Bewertung!L5:L7` gegen 2.963.412 €): −15,3 / −2,7 / +3,4 %, bei einheitlichem Preisstand (B6) −35,8 / −25,1 / −19,0 %. Nach außen suggeriert die Zeile einen Wertüberschuss, den das gebundene Objekt nicht hat.

**Korrektur.** Für A bis C den Wertüberschuss nach Abschlag in T0 als Hauptzeile zeigen, die Zeile vor Abschlag nachrichtlich. Umbauliste Nr. 7.

### 2.4 Gering (nicht gegengeprüft)

| Nr. | Befund | Beleg | Auswirkung | Korrektur |
|---|---|---|---|---|
| G1 | „Zuwendung gesamt“ addiert Darlehen und Zuschuss zum Nennwert, für A/B/C gleich | `Ueberkompensation!F11:F13` `=Darlehen_A+Zuschuss_A` = 2.370.730 € (nachgesehen) | Subventionswert rund 1,66 / 1,31 / 1,14 Mio. € (70 / 55 / 48 % des Nennwerts); nur Darstellung | Zuschuss, Barwert Zinsvorteil, Summe getrennt; Referenzzins als Eingabe |
| G2 | Text zur Horizontwirkung gilt nur für K3 | `Ueberkompensation!C19` (nachgesehen); `Bewertung!N20/N25/N30` 7,17 / 6,79 / 6,38 %, `O20/O25/O30` 1,10 / 2,37 / 3,35 % | Mit RW fällt die Rendite mit dem Horizont, ohne RW steigt sie | Text ergänzen, Werte T30/T35/T42 zeigen |
| G3 | Frühe Stichtage zeigen Bewertungsgewinn statt Rendite; keine Zuschussrückzahlung nach RL Nr. 5.4.6 vor T35 | `Bewertung!N10` (T1) 27,55 %, `N15` (T10) 11,32 %; `M` `=D+L-E` | Mit anteiliger Rückzahlung (Zuschuss × (35 − n)/35): T10 7,22 %, T1 −22,98 %; bei T42 ohne Wirkung | Rückzahlung im Endwert für n < 35 abziehen oder Stichtage kennzeichnen |
| G4 | Swapsatz fest, Quelle/Referenz/Stichtag nicht festgelegt | `Ueberkompensation!C5` = 0,0339 (19.08.2026, nachgesehen) | Grenzwert je nach Referenz rund 4,3 bis 4,4 % (G3-25: 3,43 % am 19.10.2026) | Referenz, Quelle, Stichtag als Eingaben, mit NBank abstimmen |
| G5 | Restwert in der IRR-Reihe *Frei_Marktmiete* aus Alternative 4 | `Frei_Marktmiete!AJ48` `…AVERAGEIFS(BW_EW,BW_n,Jahre_n,BW_Alt,4)…` (nachgesehen) | derzeit ohne Zahlenwirkung (gleicher Verkehrswert); schlägt durch, sobald B5/B2 umgesetzt sind | `BW_Alt,5` |
| G6 | Horizont ohne passenden Stichtag: EK-IRR still ohne Restwert | `AJ` mit `IFERROR(AVERAGEIFS(BW_EW,…),0)`; `Bewertung!B30` `=MIN(Stichtag_6,Jahre_n)` | bei *Jahre_n* = 45: K6 5,18 statt 7,72 % (A) ohne Warnung | `NA()` statt 0 oder Stichtag an *Jahre_n* koppeln |
| G7 | Zwei Prüfzeilen melden im Normalzustand Fehler | `Dashboard!D68` „ACHTUNG: das Bewertungsblatt hat 30 statt 24 Zeilen“ (nachgesehen), `E68` | kostet bei Dritten Glaubwürdigkeit | auf 30 Zeilen / 5 Alternativen umstellen |
| G8 | DSCR-Ausreißer 2·10¹³ durch Rundungsrest | `Frei_finanziert!AF37` `=IF(N37>0,H37/N37,"")` bei `N37` = 1,5·10⁻⁸ | nur Blattansicht/Diagramme | Toleranz `Basisdaten!C8` verwenden |
| G9 | Zinsdeckung ohne VKB | `Dashboard!C26` = 63,4 / 75,5 / 82,2 | mit VKB 7,33 / 6,46 / 6,28 | VKB in den Nenner oder Zeile umbenennen |
| G10 | Bewirtschaftung frei mit *Mietausfall_Frei* angezeigt, Ertragswert mit *Mietausfall* gerechnet | `Bewertung!G8` gegen `Frei_finanziert!Z7` | derzeit ohne Wirkung (beide 2 %) | einheitlich |
| G11 | Harte Zahlen und Formeln in Eingabezellen; Text 2 % gegen 1,86 % Banktilgung | `Szenarien!H6` `=3579*Wohnflaeche`, `Eingabe!C88`, `C54`; `Eingabe!E51` | fehleranfällig bei Übertragung auf andere Projekte | Kostenkennwert, EK-Quote, Banklaufzeit als eigene Eingaben |
| G12 | Kapitalstruktur „Frei, untere Kante“ fehlt im Dashboard, Erläuterung steht in der falschen Spalte | `Dashboard!G8:G10` leer, `G11` enthält den Erläuterungstext, `H11` leer (nachgesehen) | Darstellungsfehler | Werte für *Frei_Marktmiete* eintragen, Text nach H11 |

### 2.5 Widerlegte oder korrigierte Teilbefunde

- **„Rechenfehler in der Mappe“** – widerlegt. Alle fünf Szenarioblätter, die Bewertung und die Dashboard-Kennzahlen lassen sich aus den Eingaben neu rechnen (Abweichung höchstens 1,1·10⁻⁸). Acht LibreOffice-Varianten weichen höchstens 7·10⁻⁹ ab. Es gibt keine Zirkelbezüge, und der IRR ist in allen 15 Reihen eindeutig.
- **„Modell folgert, der Safe Harbour sei eingehalten“** – widerlegt. `Ueberkompensation!G11:G13` meldet „NICHT erfüllt“. Kritikwürdig sind nur die Texte H57/C22 (B3).
- **„Widerspruch zwischen Modellannahmen!C22 und dem Prüfblatt“** – widerlegt. C22 räumt ein, dass mit K3 der Safe Harbour nicht erfüllt ist. Unbelegt ist nur die Bevorzugung von K5.
- **„Die VOFI-Endwertrendite weicht von der RL ab, richtig wäre der IRR“** – widerlegt. RL Nr. 11.10 Abs. 3 schreibt den VOFI vor. Die IRR-Definition stammt aus Art. 6 Abs. 1 DAWI; die Spannung zwischen beiden ist eine Frage der RL, kein Modellfehler. Vorschläge, den IRR zur Primärgröße zu machen, kehren die Rangfolge der RL um und sind korrigiert (B3).
- **„35 Jahre sind der Betrauungszeitraum“** – nicht belegt. Die NBank hat ihren Zeitraum nicht veröffentlicht (G3-21). T35 ist als Variante zu führen.
- **„Mit/ohne Restwert nur über verschiedene Familien vergleichbar“** – widerlegt. K3/K5 sind ein konsistentes VOFI-Paar. Es fehlt das IRR-Paar (B2).
- **„K2 ist falsch beschriftet“** und **„K2 ist die einzige Wertkennzahl“** – widerlegt. `B44` lautet „(vor boG)“; daneben gibt es `C45:G47` und die LTV-Zeilen `C28:G30`. Es fehlt nur der Wert nach Abschlag in T0 (B11).
- **„Dashboard!D66 meldet trotz Doppelzählung erfüllt“** – widerlegt. Die Meldung ist korrekt, denn RL Nr. 5.2.6 ist eine Mindestquote.
- **„Grundstück 0 € ist ein Strukturfehler“** – korrigiert. Es ist eine dokumentierte Setzung (Kommentar `Eingabe!C15`). Fehlerhaft sind die Texte (B4).
- **„Beim Broschürenhaus wirkt die Boden-Unterscheidung stärker“** – widerlegt. Der Testfall hatte schon 10,7 % Grundstücksanteil, wie die Broschüre.
- **„In T42 sind die Mieten gebunden“** – korrigiert. Die Bindung endet in T35. In T42 handelt es sich um Bestandsmieten unter Kappung, also um einen Mindermietenabschlag (B5).
- **„Die Begründung für die Vorlaufzeit trägt gar nicht“** – korrigiert. Eine Bindung des baren EK über die Bauzeit von 12 Monaten ist vertretbar, nur die 2,5 Jahre sind nicht durch Zahlungen gedeckt (B7).
- **Korrekturvorschlag „Eingabe!C69 als Formel auf Basisdaten!C50“** – verworfen, weil er einen Zirkelbezug erzeugt (B10).
- **Korrekturvorschlag „Vorlaufzeit einfach auf 0“** – nachrangig, weil er die Rendite überzeichnet (B7).

---

## 3. Förderrecht-Abgleich RL Mietwohnraum 2026

Fakt-IDs aus `factbase-compact.md`; Richtlinientext `rl-mietwohnraum-2026.txt`.

| Kondition | RL / Fakt | Modell | Befund |
|---|---|---|---|
| Fördersätze A 40/40, B 60/20, C 70/10 % | Nr. 5.3.3.1/5.3.3.2; F105 | `Eingabe!C27:C31`, `C35` | richtig (Höchstsätze) |
| Zuschuss nur zusammen mit Darlehen | Nr. 5.3.3.2; F109 | Warnlogik `Eingabe!E28/E30/E35` | richtig |
| Bemessungsgrenze 4.800 / 5.000 €/m² | Nr. 5.3.2.2 | `Eingabe!D118:D119`, `Basisdaten!C26` (MIN-Deckel) | richtig; Fortschreibung bis 21.10.2026 nicht veröffentlicht (G1-04) |
| Grundstück höchstens Bodenrichtwert × Fläche | Nr. 5.3.2.3 | `Basisdaten!C24` `=MIN(KG_Grundstueck,Bodenrichtwert_qm*Grundstuecksflaeche)` | richtig; gilt nur für die Bemessung, nicht für EK und Restwert (B4) |
| Eigenmittel mind. 20 %, davon mind. 50 % hart | Nr. 5.2.6; F094/F095 | `Basisdaten!C127:C135`, `Dashboard!C66/D66` | Prüfung richtig; bares EK rechnet das Grundstück nicht an (B4) |
| Höchstmieten 6,50/7,90/8,70 bzw. 6,80/8,20/9,00 €/m², EH-40-Zuschlag bis 0,30 € | Nr. 5.4.4; F215 | `Eingabe!E118:G119`, `C38`; `Basisdaten!C37:C43` | richtig |
| Keine Erhöhung Jahr 1–3, danach höchstens 6,15 % in 3 Jahren | Nr. 5.4.5; F221 | `Eingabe!C73:C75`, `Gefoerdert_A!C` (T4, T7 … je +6,15 %, gedeckelt durch Vergleichsmiete) | richtig; volle Ausschöpfung unterstellt |
| Belegungs- und Mietbindung 35 Jahre | Nr. 5.4.1/5.4.2; F212 | `Eingabe!C39/C40` | richtig |
| 0 % Zins bis Ende Jahr 35 | Nr. 5.3.4 Satz 1; F113 | `Eingabe!C41/C42`, `Gefoerdert_A!I7` | richtig |
| Zins ab Jahr 36: bis Basiszins § 247 BGB + 3 Pp, höchstens marktüblich | Nr. 5.3.4 Satz 2; F114 | `Eingabe!C43` = 3,74 % (= Bankzins) | Vorbehalt: gesetzt an der Marktobergrenze, nicht hergeleitet (vom Modell vermerkt, `Eingabe!E43`) |
| Laufzeit höchstens 42 Jahre; Tilgungsmodalitäten legt die NBank fest | Nr. 5.3.5; F116, G1-14, G1-15 | `Basisdaten!C9` = 42; `Eingabe!C25` = 40 (Worst 33); `Basisdaten!C62` `=IFERROR(Darlehen_A/MAX(1,Laufzeit_NBank-Tilgungsfrei_NBank),0)` | vereinbar; 2,5 % linear ist PGN-Annahme, kein RL-Wert |
| Tilgungsaufschub bis 5 Jahre bei Fehlbetrag, ohne Anspruch | Nr. 5.3.5; F117 | `Basisdaten!C10` = 5, Prüfung `C45`; `Eingabe!C26` = 0 | richtig abgebildet, nicht genutzt |
| Verwaltungskostenbeitrag 0,5 % des Restkapitals ab Beginn der Auszahlung | Nr. 12.7.1; F277 | `Eingabe!C44`, `Gefoerdert_A!K7` `=IF(OR($A7=0,$A7>Jahre_n),0,N(V6)*VKB_Satz)` | Satz richtig; Bauphase fehlt (B7) |
| Bearbeitungsentgelt 1 % Darlehen / 0,75 % Zuschuss | Nr. 12.7.2/12.7.3; F278/F279 | `Eingabe!C45/C46`, `Basisdaten!C64` | richtig; in der Mappe über ein Bankdarlehen finanziert (`Basisdaten!C78`) |
| Vorrangige Kapitalmarktmittel: Tilgung mind. 1 % zzgl. ersparter Zinsen | Nr. 5.3.6; F118 | `Eingabe!C54` = 1,86 % | richtig; Text `E51` nennt 2 % (G11) |
| Auszahlung in vier Teilraten, 10 % nach Belegung | Nr. 5.5.3; F121 | alles in T0 (`Gefoerdert_A!P6`) | nicht abgebildet, vom Modell vermerkt (`Modellannahmen!C20`) |
| Vorzeitige Volltilgung: Zuschuss anteilig zurück | Nr. 5.4.6; F223 | nicht abgebildet | nur für Stichtage vor T35 relevant (G3) |
| Überkompensation: VOFI-EK-Rendite ≤ Swap 30 J. + 100 Bp | Nr. 5.3.7/11.10; F246, G3-20 bis G3-25 | `Ueberkompensation!C5:G15` | Grenzwert richtig gebildet; Befundtext richtig („ergänzende Ermittlungen“, keine automatische Kürzung); Prüfgröße und Texte siehe B3 und unten |
| Altrecht (WFB 2024) | Nr. 13.2/13.3; G1-20, G1-22 | kein Tilgungsnachlass, keine WFB-Tilgungssätze; WFB nur historisch erwähnt (`Basisdaten!D12`, `Modellannahmen!C22/C30`) | richtig |

**Zur Überkompensationsprüfung im Einzelnen**
- **Wer rechnet:** RL Nr. 11.10 Abs. 3: „Die Bewilligungsbehörde nimmt dazu eine Investitionsrechnung nach dem Modell des vollständigen Finanzplans vor.“ Die PGN-Mappe kann diese Rechnung nur vorbereiten; ihr Befund ist keine Aussage der NBank.
- **Was die RL festlegt:** VOFI, EK-Rendite in % p. a., bezogen auf das „im Rahmen der Finanzierung einzusetzende Eigenkapital“, „mit dem geförderten Objekt erzielbar“, Grenzwert Swap 30 J. + 100 Bp.
- **Was offen ist** (G3-20): Horizont, Wiederanlagezins, Restwertansatz, EK-Bewertung, Quelle und Stichtag des Swapsatzes.
- **Spannung zum DAWI-Beschluss:** Art. 6 Abs. 1 definiert die Kapitalrendite als IRR über den Betrauungszeitraum (G3-21). Art. 6 Abs. 3 stellt auf den laufzeitkongruenten Swapsatz ab, die RL pauschal auf 30 Jahre bei 35 Jahren Bindung (G3-22). Wie die NBank das handhabt, ist nicht belegt.
- **Folgerung:** Die VOFI-Rendite mit Restwert ist die RL-nahe Primärgröße, der EK-IRR die Gegenrechnung. Beide sind für T35 und T42 auszuweisen. Nach außen ist allenfalls zu sagen, dass die NBank die Angemessenheit im Bewilligungsverfahren prüft.

**Tilgungssatz**
- Die RL nennt keinen Satz (F116, G1-14). Auch die NBank-Produktinformation vom 31.08.2026 nennt keinen (G1-15).
- Ein linearer Satz, der in 42 Jahren voll tilgt, liegt bei mindestens 2,38 % (1/42), mit 5 Jahren Aufschub bei 2,70 % (1/37).
- Die früheren WFB-Sätze (1,25 % in der zinslosen Phase, danach 2,5 %) gelten für Neubauförderungen nach RL 2026 nicht mehr (G1-20, G1-22).
- Die 2,5 % der Mappe (Laufzeit 40 J.) sind vereinbar, aber eine Setzung von PGN.

---

## 4. Empfehlung Kennzahlenstruktur

Ausführlich in `kennzahlen-konzept.md`; Zahlen in `referenzrechnung-ergebnis.md`. Hier nur die Eckpunkte.

### 4.1 Vier getrennte Ebenen aus einem Datensatz

| Ebene | Kennzahlen | Restwert | Zweck |
|---|---|---|---|
| 1 Liquidität | Zahlungsüberschuss p. a., DSCR, kumulierter Fehlbetrag, Break-even-Tilgung | keiner | Broschüre, Bank; die einzige Ebene für die Broschüre |
| 2 Objekt (unlevered) | Objekt-IRR brutto und nach Zuschuss | mit / ohne Gebäude-RW / ohne | Wirtschaftlichkeit des Objekts, Vergleich gegen frei zur Marktmiete |
| 3 Eigenkapital (levered) | EK-IRR und VOFI-EK-Rendite auf gleicher Zeitbasis | mit / ohne Gebäude-RW / ohne | Investorensicht |
| 4 NBank | Überkompensationskennzahl, getrennt geführt | mit (primär), ohne nachrichtlich | Antragsvorbereitung, keine Investorenkennzahl |

**Grundsätze**
- Vor Steuern, nominal, T0 = Bezugsfertigkeit.
- Bauphase nur als datierte Zahlungen, kein Zuschlag im Exponenten.
- Zwei Horizonte, T35 (Bindungsende) und T42 (Darlehensende).
- Restwert immer zerlegt in Boden und Gebäude.
- Paare „mit/ohne“ nur innerhalb derselben Methode, desselben Horizonts und desselben T0.

### 4.2 Ergebnis für das Broschürenprojekt (Referenzrechnung, Szenario Basis)

T42, in Klammern T35. „ohne Geb.-RW“ = nur Bodenwert bleibt.

| Kennzahl | A | B | C |
|---|---:|---:|---:|
| Objekt-IRR nach Zuschuss, mit RW | 4,16 % (4,04 %) | 3,71 % (3,55 %) | 3,56 % (3,38 %) |
| Objekt-IRR nach Zuschuss, ohne Geb.-RW | 1,88 % (1,01 %) | 1,57 % (0,61 %) | 1,51 % (0,53 %) |
| EK-IRR, mit RW | 5,90 % (6,03 %) | 5,73 % (5,85 %) | 5,70 % (5,81 %) |
| EK-IRR, ohne Geb.-RW | 2,92 % (1,53 %) | 2,64 % (0,72 %) | 2,63 % (0,47 %) |
| VOFI-EK-Rendite, mit RW | 5,52 % (5,72 %) | 5,56 % (5,75 %) | 5,58 % (5,77 %) |
| VOFI-EK-Rendite, ohne Geb.-RW | 2,71 % (1,63 %) | 2,51 % (0,76 %) | 2,46 % (0,32 %) |
| nachr.: Objekt-IRR brutto, mit RW (frei zur Marktmiete 4,66 %) | 2,48 % | 2,95 % | 3,20 % |

- Der Restwert trägt bei A in T42 77 % des VOFI-Endvermögens. Die Renditen mit Restwert hängen deshalb an Markt- und Vergleichsmiete. Diese sind im Broschürenprojekt Platzhalter vom Standort Neu Wulmstorf.
- Überkompensation (nur Orientierung): Alle Varianten mit Restwert liegen 1,1 bis 1,6 Pp über 4,39 %, alle ohne Gebäude-RW darunter. Das Ergebnis hängt allein am Restwert.

**Überleitung Mappe → saubere Kennzahl** (Broschürenprojekt, A, T42 mit RW):

| Schritt | VOFI-EK | EK-IRR |
|---|---:|---:|
| Mappe wie geliefert, Broschüreneingaben (LibreOffice) | 4,75 % | 6,11 % |
| bares EK ohne Doppelanrechnung des Grundstücks (B4) | 5,46 % | 6,14 % |
| Vorlaufzeit nicht im Exponenten (B7) | 5,79 % | 6,14 % |
| Bearbeitungsentgelte aus EK statt Bankdarlehen | 5,73 % | 6,11 % |
| Abschlag am Horizont fortgeführt, einheitlicher Preisstand (B5/B6) | **5,52 %** | **5,90 %** |

Die verbleibenden 0,38 Pp zwischen VOFI und IRR sind der Methodenunterschied (Wiederanlage 2 % gegen IRR).

### 4.3 Umbau der Mappe (Reihenfolge)

Vor jeder Rendite nach außen sind mindestens die Punkte 1 bis 5 umzusetzen (Details `kennzahlen-konzept.md` Abschnitt 6.2):
1. Bares EK als Restgröße, Grundstück zum Verkehrswert als Sacheinlage (B4).
2. Restwert in Boden und Gebäude zerlegen; drei EK-Reihen und EK-IRR-Zeilen (B2).
3. Objekt-Zahlungsreihen und Objekt-IRR brutto / nach Zuschuss (B1).
4. Vorlaufzeit aus dem Exponenten nehmen, Bauphase datiert (B7).
5. Abschlag über den Horizont fortführen, einheitlicher Preisstand (B5, B6).

Danach: 6 Überkompensationsmatrix und neutrale Texte (B3); 7 Bezeichnungen und Texte (B1, B4, B11); 8 Entnahmemodus (B9); 9 frei, obere Kante (B10); 10 Kostenstand (B8).

**Regeln für die Darstellung nach außen** (nach dem Umbau):
- Renditen immer als Paar „mit RW / ohne Gebäude-RW“ bei gleichem Horizont, mit Restwertanteil, Tilgungsannahme und dem Hinweis „vor Steuern“.
- Keine Gegenüberstellung K3/K5/K6 als „mit/ohne“.
- K1 nicht als „Objektrendite“ bezeichnen.
- Nichts aus „frei, obere Kante“ als Marktvergleich verwenden.
- Keine Aussage „Safe Harbour eingehalten“.

---

## 5. Vorschlag für die Broschüre S. 11/12 (nicht eingesetzt)

Die Seitendateien `11-wirtschaftlichkeit.json` und `12-mix-und-tilgung.json` sind unverändert. Die folgenden Werte sind ein Vorschlag zur Freigabe durch PGN.

### 5.1 Die vier Annahmen

| Annahme | Wert | Quelle in der Mappe | Passt zum Modellhaus? |
|---|---|---|---|
| Mietausfall/Leerstand | **2,0 % der Sollmiete** p. a. | `Eingabe!C82` (*Mietausfall*); verwendet in `Gefoerdert_A!G7` `…+Mietausfall*F7`, `F7` `=C7*Wohnflaeche*Monate_Jahr`; Quelle laut `Eingabe!E82` ImmoWertV Anlage 3 | ja. Regelsatz, unabhängig von der Projektgröße; bei WBS-Nachfrage im angespannten Markt eher vorsichtig. Die Mappe bucht ihn als Aufwand, die Broschüre als Erlösschmälerung; betragsgleich. |
| Nicht umlagefähige Bewirtschaftungskosten | **367 € je Wohnung** p. a., nur Verwaltung | `Eingabe!C80` (*Verwaltung_WE*), Term `Verwaltung_WE*Wohneinheiten` in `Gefoerdert_A!G7`; „ImmoWertV Anlage 3, fortgeschrieben auf 2026“ (`E80`) | ja, je Wohnung übertragbar (20 × 367 € = 7.340 €). Die Mappe setzt **keine** nicht umlagefähigen Betriebskosten an (Betriebskosten voll umgelegt, kein Leerstandsansatz). Die Zeile sollte das sagen. Preisstand 2026. |
| Instandhaltung | **14,40 € je m²** Wohnfläche p. a. | `Eingabe!C81` (*Instandhaltung_qm*), Term `Instandhaltung_qm*Wohnflaeche` in `G7`; Steigerung ab Jahr 2 nach `Eingabe!C84` (2 %) | ja, je m² übertragbar (1.400 m² → 20.160 €). Für einen Neubau in Jahr 1–3 eher hoch, weil der ImmoWertV-Wert ein Mittel über die Nutzungsdauer ist; als vorsichtige Pauschale vertretbar. Preisstand 2026. |
| Tilgung NBank-Darlehen | **2,5 % p. a. linear** vom Ursprungsdarlehen (1/40), ab Jahr 1, ohne Aufschub | `Basisdaten!C62` `=IFERROR(Darlehen_A/MAX(1,Laufzeit_NBank-Tilgungsfrei_NBank),0)`; `Eingabe!C25` = 40 (Szenario Best/Basis; Worst 33 J. = 3,03 %), `Eingabe!C26` = 0; Anzeige `Finanzierung!F5` | keine Projektgröße, sondern PGN-Setzung. Mit RL Nr. 5.3.5 vereinbar (Volltilgung in 40 ≤ 42 J.); die RL nennt keinen Satz, die NBank legt ihn fest. In der Broschüre als Annahme kennzeichnen. |

### 5.2 Jahresrechnung S. 11, Jahr 1 (€ p. a.)

| Zeile | Position (Vorschlag) | A | B | C |
|---|---|---:|---:|---:|
| 1 | Sollmiete: Höchstmiete nettokalt (1.400 m² × 6,80 / 8,20 / 9,00 € × 12) | 114.240 | 137.760 | 151.200 |
|  | − Mietausfall/Leerstand, 2 % der Sollmiete | 2.285 | 2.755 | 3.024 |
| 2 | − nicht umlagefähige Bewirtschaftungskosten: Verwaltung, 367 € je Wohnung p. a. (Betriebskosten voll umgelegt) | 7.340 | 7.340 | 7.340 |
| 3 | − Instandhaltung, 14,40 € je m² p. a. | 20.160 | 20.160 | 20.160 |
| 4 | = Überschuss vor Kapitaldienst | 84.455 | 107.505 | 120.676 |
| 5 | − Verwaltungskostenbeitrag, 0,5 % des Restkapitals (unverändert) | 14.000 | 21.000 | 24.500 |
| 6 | − Zins NBank-Darlehen, 0 % bis Ende Jahr 35 (unverändert) | 0 | 0 | 0 |
| 7 | − Tilgung 2,5 % p. a. (Annahme; den Satz legt die NBank fest) auf 2,8 / 4,2 / 4,9 Mio. € | 70.000 | 105.000 | 122.500 |
| 8 | **= Zahlungsüberschuss p. a.** | **455** | **−18.495** | **−26.324** |

**Rechnung**
- Zeile 4, A: 114.240 − 2.284,8 − 7.340 − 20.160 = 84.455,2. B: 137.760 − 2.755,2 − 27.500 = 107.504,8. C: 151.200 − 3.024 − 27.500 = 120.676.
- Zeile 8, A: 84.455,2 − 14.000 − 70.000 = 455,2. B: 107.504,8 − 21.000 − 105.000 = −18.495,2. C: 120.676 − 24.500 − 122.500 = −26.324.

**Belege**
- Nachgerechnet in drei Wegen: Referenzrechnung (`referenzrechnung-ergebnis.md` Abschnitt 2), eigene Kontrolle (`vofi-work/bericht/brosch_check.py`) und die Mappe selbst. Mit den Broschüreneingaben in einer LibreOffice-Kopie liefert die Mappe denselben Cashflow (`Gefoerdert_A/B/C!Q7`: 455 / −18.495 / −26.324 €).

**Hinweise zu den Werten**
- **Jahr 2 und 3:** Die Werte gelten exakt für Jahr 1. In Jahr 2 und 3 steigen die Kosten um 2 % p. a., und der VKB sinkt mit dem Restkapital:
  - A: 255 / 44 €
  - B: −18.520 / −18.556 €
  - C: −26.261 / −26.210 €

  Die Tabellenüberschrift „Jahre 1–3“ besser auf „Jahr 1“ ändern; Zeile 5 trägt schon „(Jahr 1, nach Vollauszahlung)“.
- **Preisstand:** 367 € und 14,40 €/m² sind Werte von 2026 (B8). Auf 2028 fortgeschrieben (381,83 € bzw. 14,98 €/m²) läge A bei −656 €, B bei −19.606 €, C bei −27.435 €. Belastbar ist deshalb „A etwa ausgeglichen“, nicht „A positiv“.
- **Bearbeitungsentgelte:** Die Rechnung setzt voraus, dass die Entgelte (49.000 / 52.500 / 54.250 €) aus Eigenmitteln gezahlt werden, wie die Broschüre es mit der abgesetzten Einmalzeile darstellt. Über ein Bankdarlehen finanziert, wie in der Mappe, kämen in Jahr 1 rund 2.700 bis 3.000 € Kapitaldienst hinzu; A läge dann bei rund −2.300 €.
- **Andere Tilgungssätze**, Zeile 8, A / B / C:
  - 3,03 % (PGN Worst, 1/33): −14.393 / −40.768 / −52.309 €
  - 2,38 % (1/42, Volltilgung in 42 J.): +3.789 / −13.495 / −20.491 €
  - 1,25 % (alte WFB, gilt nicht mehr): +35.455 / +34.005 / +34.926 €

  Break-even-Tilgung Jahr 1 (Zahlungsüberschuss = 0): A 2,52 %, B 2,06 %, C 1,96 %.

### 5.3 Tilgungsschwellen S. 12: Sie ändern sich

Nur der Mietausfall wirkt auf den Vergleich. Verwaltung und Instandhaltung sind in A, B und C gleich und fallen heraus; der Tilgungssatz ist die Variable des Diagramms. Der Mietausfall mindert die Mehr-Sollmiete im selben Verhältnis:

  Schwelle = [(1 − m) × Mehr-Sollmiete − 0,5 % × Mehrschuld] ÷ Mehrschuld

| | B gegenüber A | C gegenüber A |
|---|---:|---:|
| Mehrschuld | 1.400.000 € | 2.100.000 € |
| Mehr-Sollmiete p. a. | 23.520 € | 36.960 € |
| − Mietausfall 2 % der Mehr-Sollmiete | 470 € | 739 € |
| − Verwaltungskostenbeitrag 0,5 % der Mehrschuld | 7.000 € | 10.500 € |
| = Mehrüberschuss vor Tilgung | **16.050 €** (bisher 16.520 €) | **25.721 €** (bisher 26.460 €) |
| Tilgungsschwelle | **1,15 %** (bisher 1,18 %) | **1,22 %** (bisher 1,26 %) |
| Mehrüberschuss bei 2,5 % Tilgung | −18.950 € (bisher −18.480 €) | −26.779 € (bisher −26.040 €) |

**Rechnung**
- B: 0,98 × 23.520 = 23.049,6; − 7.000 = 16.049,6; ÷ 1.400.000 = 1,146 %.
- C: 0,98 × 36.960 = 36.220,8; − 10.500 = 25.720,8; ÷ 2.100.000 = 1,225 %.
- Allgemeine Form (Rechenweg S. 12): 0,98 × 1,68 % − 0,5 % = 1,15 % (B); 0,98 × 1,76 % − 0,5 % = 1,22 % (C).
- Kontrolle gegen die Jahresrechnung: B − A = −18.495 − 455 = −18.950 €; C − A = −26.324 − 455 = −26.779 €.
- C liegt über B, solange t < (25.721 − 16.050) ÷ 700.000 = **1,38 %** (bisher 1,42 %).
- „Je Prozentpunkt Tilgung −14.000 € (B) bzw. −21.000 € (C)“ bleibt unverändert.

Die Aussagen bleiben in der Struktur richtig: Unter 1,22 % bringt C den höchsten Jahresüberschuss, darüber A. B liegt nie vorn (unter 1,15 % liegt C vor B, darüber A vor B).

**Betroffene Stellen, falls übernommen** (nicht geändert):
- `11-wirtschaftlichkeit.json`:
  - Tabellenzeilen Mietausfall, 2, 3, 4, 7, 8 und Caption.
  - Textblock „B und C gegenüber A“, Vorschlag: „C erzielt 36.960 € mehr Sollmiete im Jahr als A. Nach 2 % Mietausfall und 10.500 € mehr Verwaltungskostenbeitrag bleiben vor Tilgung 25.721 € mehr (B: 16.050 €). Die Tilgung der Mehrschuld von 2,1 Mio. € (B: 1,4 Mio. €) zehrt diesen Vorsprung ab einem Tilgungssatz von 1,22 % (B: 1,15 %) auf.“
- `12-mix-und-tilgung.json`:
  - Diagrammdaten: `before_repayment` 16.050 / 25.721, `threshold` 1,15 / 1,22, `at_2_5` −18.950 / −26.779, Labels, `dimension_chain` mit Teilung bei 1,22 %, `check` mit 1,38 %.
  - `note` mit 1,22 % bzw. 1,15 %.
  - Rechenweg: Unterzeile „− Mietausfall 2 %“ 470 / 739, Zeilen 4 und 5.
  - Notiz unter dem Rechenweg: „Mietausfall 2 %“.
  - `calculation.steps`.
  - `open_points` (Mietausfall dann erledigt).

### 5.4 Redaktionelle Punkte zur Entscheidung

1. **Tenor S. 11:** Bei 2,5 % Tilgung ist A in Jahr 1 etwa ausgeglichen, B und C sind negativ, und zwar in Jahr 1 bis 9. Der größte kumulierte Fehlbetrag liegt bei B bei 92 T€, bei C bei 152 T€ (Referenzrechnung Abschnitt 3). Die Überschrift „Mehr Miete, mehr Darlehen: Überschuss je Jahr“ ist nicht falsch, weckt aber die Erwartung eines positiven Überschusses.
2. **Einordnung des Tilgungssatzes S. 12:** Jeder lineare Satz, der in 42 Jahren voll tilgt (mindestens 2,38 %), liegt über beiden Schwellen. Unter dieser Bedingung ist in Jahr 1 stets A vorn. C wäre nur bei einem Satz unter 1,22 % vorn, also mit Schlussrate oder Tilgungsaufschub. Optional könnte die 2,38-%-Marke als Folge der 42-Jahres-Grenze im Diagramm stehen; das wäre keine eigene Annahme, sondern Arithmetik aus RL Nr. 5.3.5.
3. **Tilgungsaufschub:** Weil B und C bei 2,5 % einen Fehlbetrag haben, käme ein Aufschub bis 5 Jahre nach RL Nr. 5.3.5 in Betracht (Ermessen der NBank, kein Anspruch, F117). In Jahr 1 bis 5 wäre dann C vorn (A 70.455 €, B 86.505 €, C 96.176 €), danach mit 2,70 % Tilgung A. Ob die Broschüre das erwähnt, ist eine inhaltliche Entscheidung.
4. **Bezeichnung Zeile 2** als „Verwaltung“ mit Hinweis „Betriebskosten voll umgelegt“, sonst ist „nicht umlagefähige Bewirtschaftungskosten“ für Fachleser zu weit.
5. **Keine Renditen auf S. 11/12**, wie geplant (`11-wirtschaftlichkeit.json`, Block „Annahmen und Abgrenzung“: „keine Rendite“). Das bleibt richtig.

---

## 6. Offene Fragen an PGN

Fragen, die letztlich die NBank beantworten muss, sind mit (NBank) gekennzeichnet.

1. **Vier Annahmen:** Bestätigen Sie Mietausfall 2 %, Verwaltung 367 € je Wohnung, Instandhaltung 14,40 €/m² und Tilgung 2,5 % linear für das Modellhaus (20 WE, 5.000 €/m²)? Ist der Tilgungssatz mit der NBank besprochen oder eine eigene Setzung? (NBank)
2. **Preisstand:** Sollen die Kostenwerte für die Broschüre als „Kostenstand 2026“ stehen oder auf das erste Bewirtschaftungsjahr fortgeschrieben werden? Davon hängt ab, ob A in Jahr 1 knapp positiv oder knapp negativ ist.
3. **Betriebskosten:** Werden nicht umlagefähige Betriebskosten (etwa bei Leerstand) bewusst mit 0 angesetzt?
4. **Grundstück:** Warum 0 € („auf Wunsch“, Kommentar `Eingabe!C15`)? Soll das Grundstück künftig zum Verkehrswert als Sacheinlage ins EK? Dann ist `Eingabe!C88` vorher umzustellen (B4).
5. **Powerpoint:** Stammen die Zahlen der Folien-Modellrechnung aus dieser Mappe (v2-1) oder aus einem früheren Stand? Enthält die Powerpoint Renditen, und welche der Größen K1 bis K6 sind es?
6. **Restwert:** Ist gewollt, dass der Abschlag für die Mindermieten am Horizont endet? Welche Markt- und Vergleichsmiete soll für ein Modellhaus der Mietenstufe IV bis VII gelten? Sollen Veräußerungskosten und Modernisierungen angesetzt werden?
7. **Vorlaufzeit:** Worauf beruhen die 2,5 Jahre? Gibt es einen Abrufplan für EK und Fördermittel in der Bauphase?
8. **Überkompensation:** Gibt es eine Abstimmung mit der NBank zu Renditegröße, Horizont, Wiederanlagezins, Restwert und EK-Bewertung? Welche Quelle und welchen Stichtag soll der Swapsatz haben? Werden die Texte `Dashboard!H57` und `Modellannahmen!C22` angepasst? (NBank)
9. **Zins ab Jahr 36:** Bleibt es bei 3,74 % als Obergrenze, oder soll aus Basiszinssatz + 3 Pp abgeleitet werden? (NBank)
10. **Frei finanziert:** Wozu dient die Variante „obere Kante“? Reicht für Vergleiche die Variante zur Marktmiete?
11. **Entnahmemodus 1 und Worst-Szenario:** Wird die Vollausschüttung genutzt (B9)? Was begründet im Worst Case die Laufzeit von 33 Jahren (3,03 % Tilgung)?
12. **Weiterverwendung:** Soll PGN die Umbauliste Nr. 1 bis 5 selbst umsetzen, oder soll die Referenzrechnung (`referenzrechnung.py`) als Gegenrechnung dienen?

---

## Anhang: Dateien und Skripte

**In diesem Ordner** (`/home/user/NBank/broschuere/zulieferungen/vofi-pruefung/`):
- `PRUEFBERICHT.md`: dieser Bericht.
- `modellkarte.md`, `annahmen.md`, `annahmen.json`, `kennzahlen-konzept.md`, `referenzrechnung.py`, `referenzrechnung-ergebnis.md`.

**Arbeitsdateien** (Scratchpad dieser Sitzung, nur Kopien der Mappe), unter `/tmp/claude-0/-home-user-NBank/38410f5d-55fd-52ad-a777-dfea55772146/scratchpad/vofi-work/`:
- `rendite/`: extract_series.py, kennzahlen.py, lo_variants.py, zusatz.py, sachwert_check.py samt Ergebnissen.
- `foerderrecht/`: uk_variants.py, lo_land_test.py, lo_land_fix.py, lo_brosch_y1.py, aid_equiv.py, zuschuss_rueck.py.
- `nachrechnung.py`, `nachrechnung_out.json`, `nachrechnung/` (lo_dump.py, scan_formulas.py).
- `modellkarte/`, `referenz/` (lo_vofi_brosch.py, vofi_lo.json).
- Gegenprüfungen: `gp/`, `gegen_fr/`, `adv_rt/`.
- Dieser Bericht: `bericht/spot.py` (Zellstichproben, nur lesend) und `bericht/brosch_check.py` (Kontrolle Abschnitt 5).
