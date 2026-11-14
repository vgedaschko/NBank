# Konzepte: Modellrechnung und Fazit-Folie

Stand 14.11.2026. Drei Konzepte für Kapitel 3 des Vortrags (heute Folien 13 bis 24, Anhang A6 und A7), die Broschüre Blatt 9 bis 11
(Bogenseiten 10 bis 12) und eine neue Fazit-Folie vor der Schlussfolie. Nur Konzepte: `praesentation/`, `broschuere/` und `vofi/`
bleiben unverändert. Die Wahl zwischen den Konzepten trifft der Auftraggeber; den Vergleich enthält `GEGENUEBERSTELLUNG.md`.

## Aufbau des Ordners

| Ordner oder Datei | Inhalt |
|---|---|
| `GEGENUEBERSTELLUNG.md` | eine Seite: die drei Konzepte nebeneinander, Ergebnis von Verständnistest und Zahlenprüfung, Aufwand, Schwächen, Empfehlung |
| `mappe/` | gemeinsame Rechengrundlage: Kopie der Mappe v3 mit den Blöcken N1 bis N6, Szenario-Läufe, Prüfskript, alle Werte als JSON (eigene `README.md`) |
| `werkzeug/` | Entwurfswerkzeug: baut Folienentwürfe in der Gestaltung des Vortrags, rendert sie und prüft sie (eigene `ANLEITUNG.md`) |
| `team-1/` | Konzept „Geldfluss“ |
| `team-2/` | Konzept „Fragen eines Investors“ |
| `team-3/` | Konzept „Vergleich“ |

Jeder Teamordner hat denselben Aufbau:

| Datei | Inhalt |
|---|---|
| `KONZEPT.md` | Leitidee, Folienfolge mit Titeln, was entfällt, Schlüsselfolien, Broschüre, Fazit, neue Blöcke der Mappe, Schwächen, Änderungen der Gestaltung, Abgleich mit den Pflichtpunkten |
| `ZAHLEN.md` | jede Zahl des Konzepts mit Wert, Rundung und Blatt!Zelle; erzeugt von `zahlen.py` (Team 1), `zahlen/erzeuge_zahlen.py` (Team 2), `build_zahlen.py` (Team 3) |
| `ABGABE.md` | Liste der Bilder für den Verständnistest, in der Reihenfolge des Vortrags |
| `PRUEFUNG.md` | Verständnistest (fünf Fragen, richtige Antworten mit Zelle, Antworten des Testlesers, Bewertung) und Zahlenprüfung |
| `mappe/` | Kopie der Konzepte-Mappe mit dem eigenen Block (T1, T2, T3), Bauskript, `werte_team.json`, eigene `README.md` |
| `entwurf/folien/` | Folienmodule der gebauten Entwürfe (je drei Folien, darunter das Fazit); Dateien mit „_“ sind Hilfen |
| `entwurf/Entwurf-Team-N.pptx` | gebaute Entwürfe mit nativen Diagrammen und Tabellen; daneben `.belege.json` mit Blatt und Zelle jeder Zahl |
| `entwurf/png/` | Bilder der Entwürfe (`folie-01.png` bis `folie-03.png`, `uebersicht.png`), PDF |
| `entwurf/skizzen/` | übrige Folien als Skizze (Raster, Titel, Lage, echte Zahlen), Liste `SKIZZEN.md`, Zeichenskript, Belege |
| `entwurf/broschuere/` | Skizzen der Broschüre Blatt 9 bis 11 |

Dazu bei Team 2 `entwurf/heute/` (Bilder des heutigen Stands) und `entwurf/werte_zusammen.py`, bei Team 3 `ansicht/` (Bilder der
heutigen Folien und Seiten zum Vergleich).

| Team | Gebaute Entwürfe | Eigener Block der Mappe |
|---|---|---|
| 1 | 16 Jahresrechnung, 17 Geldfluss, 28 Fazit | T1: Blatt Konzepte ab Zeile 108 in `team-1/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team1.xlsx` |
| 2 | 16 Miete für DSCR 1,2, 25 Risiken, 29 Fazit | T2: Blatt „Team 2“ in `team-2/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team2.xlsx`; Lauf R1 in `team-2/mappe/laeufe/` |
| 3 | 16 Jahr 1 je m², 20 Rückfluss, 28 Fazit | T3: Blatt „Team 3 Vergleich“ in `team-3/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Team3.xlsx` |

## Grundlage

- Einzige Zahlenquelle ist die Rechenmappe `vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx` mit ihren Annahmen. Modellhaus ist Projekt 2.
  Das Original bleibt unverändert.
- `mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte.xlsx` ist eine Kopie mit drei neuen Blättern (Konzepte, Frei DSCR 1,2,
  Konzepte Zeitreihe). Alle bestehenden Zellen und Formeln sind gleich dem Original. Die neuen Blöcke sind Formeln.
- Einzige neue Annahme: DSCR-Ziel der Bank für frei finanziert = 1,2 (Konzepte!D6, Annahme der PGN). Daraus folgt per Formel die Miete
  frei finanziert von 18,36 € je m² (Konzepte!D12). Die Rechnung zur Marktmiete 15,42 € steht unverändert auf Blatt „Frei finanziert“.
- Szenario-Läufe N6 (Tilgung, Herstellungskosten, Mietanpassung, Anschlusszins) liegen als Kopien in `mappe/laeufe/`.
- `mappe/werte_konzepte.json` führt jede Zahl mit Wert, Einheit, Blatt, Zelle und Lauf. `mappe/ANNAHMEN.md` führt jede Annahme mit Wert
  und Herkunft. Die Teams lesen nur aus dieser Datei und aus ihrer `werte_team.json`.
- Prüfung: `mappe/pruefe_konzepte.py` gegen die Konzepte-Mappe 624 OK, 0 Fehler (`mappe/pruef_konzepte.log`).

## Wie die Entwürfe gebaut werden

LibreOffice läuft bei mehreren Bearbeitern gleichzeitig. Jeder Aufruf, der LibreOffice startet, bekommt ein eigenes HOME. Damit dort
die Schriften des Vortrags gefunden werden, braucht das HOME einen Verweis auf die installierten Schriften; sonst setzt LibreOffice eine
Ersatzschrift (so bei den heutigen Bildern von Team 3).

```sh
T=/home/user/NBank/konzepte/team-1            # oder team-2, team-3
mkdir -p $T/.lohome && ln -sfn ~/.fonts $T/.lohome/.fonts
```

**1. Mappe.** Erst die gemeinsame Mappe, dann die Team-Kopie (`recalc.py` aus den Werkzeugen für Tabellen):

```sh
cd /home/user/NBank/konzepte/mappe && HOME=$PWD/.lohome python build_konzepte.py --recalc PFAD/recalc.py
cd $T/mappe && HOME=$T/.lohome python build_team1.py --recalc PFAD/recalc.py     # build_team2.py, build_team3.py
cd $T/mappe && HOME=$T/.lohome python lauf_team2.py --recalc PFAD/recalc.py      # nur Team 2, Lauf R1
```

**2. Zahlen.** `ZAHLEN.md` neu schreiben (Skript je Team, siehe oben). Team 2 fasst vorher beide JSON-Dateien zusammen:
`python team-2/entwurf/werte_zusammen.py` schreibt `team-2/entwurf/folien/werte.json`.

**3. Entwürfe.** Bauen mit `werkzeug/entwurf.cjs`, rendern und prüfen mit `werkzeug/rendern.sh`:

```sh
W=/home/user/NBank/konzepte/werkzeug
node $W/entwurf.cjs $T/entwurf/folien $T/entwurf/Entwurf-Team-1.pptx
$W/rendern.sh $T/entwurf/Entwurf-Team-1.pptx $T/entwurf/png --home $T/.lohome
```

`entwurf.cjs` liest die Zahlen über `ctx.wert`: ohne Angabe aus `mappe/werte_konzepte.json`, bei Team 2 aus `entwurf/folien/werte.json`;
die Teamwerte kommen aus `team-N/mappe/werte_team.json`. Jede gelesene Zahl landet mit Blatt und Zelle in `Entwurf-Team-N.belege.json`.
Der Bau prüft Titel, Raster, Schriften, Mindestgrößen und Inhaltszone; `rendern.sh` prüft danach Schema, Hinweiskasten, Stichpunkte und
Sprache. Einzelheiten in `werkzeug/ANLEITUNG.md`.

**4. Skizzen.** Python-Skripte im Teamordner zeichnen die übrigen Folien und die Broschüre als Bild, mit Zahlen aus denselben JSON-Dateien:
`team-1/entwurf/skizzen/bau_skizzen.py`, `team-2/entwurf/skizzen_bauen.py`, `team-3/entwurf/skizzen/skizzen.py`. Skizzen sind keine
fertigen Folien. Schriftmaß und Umbruch stimmen nur ungefähr, und sie laufen nicht durch die Prüfungen des Vortrags.

Alles bleibt in `konzepte/`. Die Skripte schreiben nicht in `praesentation/`, `broschuere/` oder `vofi/`.
