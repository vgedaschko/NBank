# Rechenmappe für die Konzepte (Modellrechnung, Fazit)

Grundlage für alle Konzepte: eine Kopie der VOFI-Mappe v3 mit drei neuen Blättern. Das Original `vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx` und `vofi/build_vofi.py` sind unverändert. Modellhaus = Projekt 2 (Eingaben D3 = 2; die Mappe wird so ausgeliefert, die Kopie ändert D3 nicht).

## Dateien

| Datei | Inhalt |
|---|---|
| `PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx` | Kopie der Mappe, neu berechnet; neue Blätter Konzepte, Frei DSCR 1,2, Konzepte Zeitreihe |
| `build_konzepte.py` | baut die Kopie (lädt das Original, hängt die Blätter an), rechnet neu, vergleicht Original gegen Kopie, rechnet die Szenario-Läufe, schreibt JSON und ANNAHMEN.md |
| `pruefe_konzepte.py` | Kopie von `vofi/pruefe_vofi.py`; lässt nur die neuen Blätter zu und prüft die neuen Blöcke (Abschnitt „Prüfung“) |
| `werte_konzepte.json` | jede Zahl mit schluessel, wert, einheit, blatt, zelle, bedeutung, lauf (dazu herkunft) |
| `ANNAHMEN.md` | alle Annahmen mit Wert, Herkunft (Richtlinie, Gesetz, Quelle, Projektdaten PGN, PGN-Annahme) und Blatt!Zelle |
| `laeufe/*.xlsx` | Szenario-Läufe N6: Kopien der Konzepte-Mappe, je eine Eingabe geändert, neu berechnet |
| `pruef_original.log`, `pruef_konzepte.log` | Prüfprotokolle (siehe unten) |

Aufruf (LibreOffice mit eigenem Profil):

```sh
HOME=$PWD/.lohome python build_konzepte.py --recalc PFAD/recalc.py            # bauen, rechnen, Läufe, Ausgabe
HOME=$PWD/.lohome python build_konzepte.py --recalc PFAD/recalc.py --ohne-bauen   # nur Läufe und Ausgabe
HOME=$PWD/.lohome VOFI_RECALC=PFAD/recalc.py python pruefe_konzepte.py --arbeitsordner $PWD/pruef
```

## Was neu ist

Einzige neue Annahme: **Konzepte!D6 DSCR-Ziel der Bank, frei finanziert = 1,2 (Annahme der PGN)**. Alle anderen neuen Zellen sind Formeln auf die bestehenden Blätter.

| Block | Blatt, Zellen | Inhalt |
|---|---|---|
| N1 | Konzepte D6, D7 | DSCR-Ziel der Bank 1,2 (Eingabe, blau auf Gelb); aktives Projekt |
| N2 | Konzepte D10:D16; Blatt Frei DSCR 1,2 | Miete frei finanziert für DSCR 1,2 in Jahr 1 und Gegenprobe; vollständige Zeitreihe Jahr 0 bis 80 mit dieser Miete |
| N3 | Konzepte D19:F27 | Gefördert A, B, C: Höchstmiete, Kapitaldienst NBank-Darlehen, DSCR zur Höchstmiete, Miete für DSCR 1,2, Abstand, Jahre unter 1,2 |
| N4 | Konzepte D36:H44 | Objektrendite Jahr 1 je Variante, mit und ohne Zuschuss im Nenner; Vergleich mit der Nettoanfangsrendite der Mappe |
| N5 | Konzepte D49:H96; Blatt Konzepte Zeitreihe | Kennzahlen je Variante (A, B, C, frei zur Marktmiete, frei zur Miete für DSCR 1,2) und Jahr 0 bis 42 je Variante |
| K | Konzepte C99:C106, Status D3 | Prüfungen der neuen Blöcke (K1 bis K8), alle OK |
| N6 | `laeufe/`, JSON `laeufe.<lauf>` | Szenario-Läufe (Risiken) |

**Blatt Frei DSCR 1,2** ist eine Zellkopie von „Frei finanziert“ (gleiche Spalten und Formeln: Sollmiete mit Mietanpassung Eingabe 4.5, Mietausfall, Objektverwaltung, Instandhaltung, Überschuss vor Kapitaldienst, Zins, Tilgung, Kapitaldienst, Zahlungsüberschuss, kumuliert, DSCR, Restschuld, Projektkonto, Renditen). Anders sind nur: H109 = H183 (Miete Jahr 1 = Miete für das DSCR-Ziel), H181 = Konzepte!D6, H122:J122 rechnen den Ertragswert aus der Hilfsspalte AD (Überschuss vor Kapitaldienst zur Marktmiete), Texte A1, A87, A109, A122, A181. Damit kommt der Restwert wie gefordert aus der Marktmiete 15,42 € und ist gleich dem Restwert auf „Frei finanziert“ (Prüfung K4). Die Rechnung frei finanziert zur Marktmiete 15,42 € steht unverändert auf „Frei finanziert“.

## Definitionen

**DSCR** (wie in der Mappe, Spalte S bzw. N, H156, H157) = Überschuss vor Kapitaldienst ÷ Kapitaldienst, je Jahr.
- Gefördert: K ÷ −Q. Kapitaldienst Q = Verwaltungskostenbeitrag (0,5 % vom Restkapital) + Zins NBank-Darlehen (0 % bis Jahr 35) + Tilgung NBank-Darlehen + Kapitaldienst Bankdarlehen. Im Modellhaus gibt es gefördert **kein Bankdarlehen** (Übersicht D18:F18 = 0); die DSCR der Gruppen ist also die Deckung des Kapitaldiensts des NBank-Darlehens. Die 1,2 ist dort eine Vergleichszahl (N3), keine Vorgabe der NBank.
- Frei finanziert: I ÷ −L, Kapitaldienst = Annuität des Bankdarlehens (Eingabe 6.1 bis 6.4). Für dieses Bankdarlehen gilt die neue Annahme DSCR ≥ 1,2.
- Was die NBank stattdessen prüft (laut Mappe und Broschüre): Überkompensation bzw. angemessenen Gewinn nach RL Nr. 11.10 (Blatt NBank: VOFI-EK-Rendite gegen Swapsatz + 1 Prozentpunkt; die NBank rechnet selbst; Blatt NBank ist laut Hinweis 14 nicht für außen), Eigenmittel mindestens 20 % (RL Nr. 5.2.6), Tilgung eines Bankdarlehens mindestens 1 % (RL Nr. 5.3.6). Eine DSCR-Vorgabe für das NBank-Darlehen enthält die Mappe nicht.
- Miete für DSCR-Ziel (N2, N3; Logik wie Mappe Zeile 183): (Ziel × Kapitaldienst Jahr 1 + Objektverwaltung + Instandhaltung) ÷ ((1 − Mietausfall) × Wohnfläche × 12). Formel, keine Zielwertsuche.

**Objektrendite** (N4) = Überschuss vor Kapitaldienst Jahr 1 ÷ Gesamtkosten (H93 = Herstellung + KG 800 + Grundstück), unabhängig von der Finanzierung. Zweite Lesart für A, B, C: Nenner Gesamtkosten − Zuschuss (H100). Die Mappe definiert die **Nettoanfangsrendite** (Zeile 139) als Überschuss vor Kapitaldienst Jahr 1 ÷ Objektinvestition H94 = Herstellung + Grundstück, also ohne KG 800; gefördert „n. v.“ bei Überfinanzierung. Die Werte sind gleich, solange KG 800 = 0 (Eingabe 2.2; N4.9 = 0 in allen Varianten). Die Mappe nennt sie „Hilfsgröße … ohne Zuschuss, ohne Restwert“ (Übersicht L85).

**Vermögen Ende Jahr 35** (N5.27) = Restwert − Restschuld + Projektkonto = Endvermögen VOFI mit Restwert (I146). Restschuld gefördert = NBank + Bank. Projektkonto = Zahlungsüberschüsse mit Guthabenzins 2 % / Sollzins 5 % (Eingabe 7.2, 7.3). Ohne Restwert: I148.

**Eigenkapitalrendite**: VOFI-EK-Rendite (I143 mit, I145 ohne Restwert; Horizont Jahr 35) wie Anhangfolie A6; dazu EK-IRR (I140, I142; ohne Restwert laut Mappe nicht eindeutig, Hinweis 11). Eigenkapital H106: gefördert mit Bearbeitungsentgelten (613.426 | 614.908 | 615.649 €), frei 592.682 €. Modellhaus ohne Grundstückskosten: „nur Bodenwert“ = „ohne Restwert“.

**Jahr, in dem der kumulierte Zahlungsüberschuss das Eigenkapital erreicht** (N5.17): erstes Jahr mit kumuliertem Zahlungsüberschuss (unverzinst) ≥ H106; „n. v.“ = nicht bis Jahr 42.

## Kernwerte (Lauf „konzepte“)

| Größe | A | B | C | frei, Marktmiete | frei, DSCR 1,2 | Zelle (Konzepte) |
|---|---|---|---|---|---|---|
| Miete Jahr 1, €/m² | 6,80 | 8,20 | 9,00 | 15,42 | 18,36 | D49:H49 |
| Miete für DSCR 1,2, €/m² | 5,96 | 8,07 | 9,12 | 18,36 | 18,36 | D50:H50 |
| DSCR Jahr 1 | 1,44 | 1,23 | 1,18 | 0,99 | 1,20 | D62:H62 |
| Zahlungsüberschuss Jahr 1, € | 15.003 | 11.560 | 10.812 | −1.691 | 26.956 | D61:H61 |
| Zahlungsüberschuss Jahr 35, € | 64.860 | 76.468 | 84.149 | 260.942 | 317.109 | D64:H64 |
| Eigenkapital erreicht in Jahr | 23 | 23 | 22 | 21 | 13 | D67:H67 |
| Jahre mit Fehlbetrag 1–35 | 0 | 0 | 0 | 1 | 0 | D68:H68 |
| Tiefster Stand Projektkonto, € | 0 | 0 | 0 | −1.691 | 0 | D70:H70 |
| Jahre mit DSCR unter 1,2 (1–35) | 0 | 0 | 3 | 10 | 0 | D73:H73 |
| Vermögen Ende Jahr 35, € | 6.647.289 | 7.187.494 | 7.489.203 | 9.858.321 | 11.824.305 | D78:H78 |
| VOFI-EK-Rendite mit Restwert | 7,05 % | 7,28 % | 7,40 % | 8,36 % | 8,93 % | D81:H81 |
| VOFI-EK-Rendite ohne Restwert | 2,58 % | 2,61 % | 2,75 % | 4,84 % | 6,32 % | D82:H82 |
| Objektrendite Jahr 1 | 1,66 % | 2,12 % | 2,38 % | 4,49 % | 5,46 % | D87:H87 |
| Objektrendite, Nenner ohne Zuschuss | 2,76 % | 2,65 % | 2,65 % | 4,49 % | 5,46 % | D88:H88 |

Miete frei für DSCR 1,2: 18,3620 €/m² (Konzepte D12 = Frei DSCR 1,2 H183), 19,1 % über der Marktmiete 15,42 €. Gruppe C erreicht DSCR 1,2 zur Höchstmiete nicht (1,18; nötig 9,12 € statt 9,00 €; Jahr 1 bis 3, danach steigt die Miete). Frei finanziert liegt bei Zahlungsüberschuss, Eigenkapitalrendite und Objektrendite vorn, aber nur unter den Annahmen Miete 18,36 € (über dem Markt) bzw. 15,42 € mit Fehlbetrag in Jahr 1 und DSCR unter 1,2 in den Jahren 1 bis 10, Mietsteigerung 2 % p. a. und Anschlusszins wie Eingabe 6.1; die Läufe N6 zeigen das Risiko.

## N6 Szenario-Läufe

Je Lauf eine Eingabe geändert (Eingaben Spalte E = Projekt 2 bzw. Tabellen), neu berechnet; Werte in `werte_konzepte.json` unter `laeufe.<lauf>` mit Zelle auf Blatt Konzepte der Kopie `laeufe/<lauf>.xlsx` (Zahlungsüberschuss Jahr 1 und Minimum, Fehlbetragsjahre, DSCR Jahr 1 und Minimum, Jahre unter 1,2, EK-Rendite mit/ohne Restwert, Projektkonto, Vermögen, Mieten). Alle Läufe: recalc ohne Formelfehler, Status Konzepte und Mappe OK.

| Lauf | Änderung |
|---|---|
| tilgung_2_90, tilgung_3_65 | Eingaben E17 = 2,90 % bzw. 3,65 % (tragbare Tilgung C bzw. A, Übersicht 3.8, gerundet) |
| kosten_4631, kosten_5460 | Eingaben E11 = 4.631 bzw. 5.460 €/m² (wie die Läufe der Präsentation) |
| mietanpassung_gefoerdert_0 | Tabellen D28 = 0 (keine Mieterhöhung in der Bindung; wirkt nur gefördert) |
| mietsteigerung_0 | Eingaben E26 = 0 (Mietanpassung frei finanziert; wirkt auch auf Vergleichsmiete und Restwert) |
| anschlusszins_plus_1, anschlusszins_minus_1 | Eingaben E37 = 4,86 % bzw. 2,86 % (Vorgängermappe ± 1 Punkt) |

Frei DSCR 1,2 löst die Miete in jedem Lauf neu (die Bank bemisst beim Abschluss). Sie ändert sich nur in den Kostenläufen (Miete Jahr 1 dann über 23 € bzw. 27 €; Wert in Konzepte H49 der Laufkopie).

## Prüfung (14.11.2026, Mappe SHA-256 ab420609…)

- Original gegen Kopie, alle neun bestehenden Blätter: 11.920 Zellen, davon 9.848 Formeln, Formeln/Konstanten und Werte gleich, 0 Abweichungen (build_konzepte.py; pruefe_konzepte.py Prüfung K). recalc: success, 0 Formelfehler.
- `vofi/pruefe_vofi.py` gegen die Kopie (`pruef_original.log`): 610 OK, 4 FEHLER, 7 Hinweise. Alle vier Fehler kommen nur von den neuen Blättern: F3 Blattzahl/Reihenfolge, F4 feste Zahlen (Konzepte!D6 und die kopierten Nullen A6, Q6, H118 auf Frei DSCR 1,2), F5 Eingabeoptik Konzepte!D6, F5 Abbruch bei der Fixierung (kein Sollwert für die neuen Blätter; die Prüfungen dahinter liefen deshalb nicht).
- `pruefe_konzepte.py` (`pruef_konzepte.log`): **624 OK, 0 FEHLER**, 7 Hinweise (dieselben wie bisher). Das sind die bisherigen 618 Prüfungen mit allen 71 Läufen, unverändert streng, und 6 neue Prüfungen K: bestehende Blätter gegen das Original; Frei DSCR 1,2 gegen Frei finanziert; neue Blöcke nur Formeln, keine Fehlerwerte; Gegenrechnung von Hand (N2 = 18,36 €, DSCR Jahr 1 = 1,2, N3, N4); Zeitreihe gleich den Quellblättern; Status K1 bis K8 und Mappe OK.
