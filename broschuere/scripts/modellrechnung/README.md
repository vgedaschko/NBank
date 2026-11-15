# Modellrechnung S. 10–12 (Bogenseiten; gedruckt S. 9–11)

Erzeuger der drei Seiten des Kapitels „Modellrechnung“ seit dem Umbau vom 15.11.2026 (wie Kapitel 3 der Präsentation:
gefördert in Gruppe A gegen frei finanziert zur Marktmiete). Alle Zahlen kommen aus der Rechenmappe v3 über
`praesentation/daten/werte.json` und `praesentation/daten/kennzahlen.json` (`vofi/build_kennzahlen.py`).

| Datei | Zweck |
|---|---|
| `vorlagen/NN-*.html` | Partials mit Platzhaltern `%%NAME%%` für die Diagramme; Text und Tabellen stehen hier |
| `diagramme.cjs` | SVG der Diagramme: `haeuser` (S. 10), `fluss`, `dscr`, `spielraum` (S. 11), `verlauf`, `rendite` (S. 12); 1 Einheit = 1 mm |
| `bauen.cjs` | füllt die Vorlagen, schreibt `src/pages/NN-*.html`, setzt die Schraffuren (`scripts/schraffur.cjs --sync`) |
| `seiten_json.py` | schreibt `content/pages/NN-*.json` mit allen Blöcken und „belege“ |
| `belege.py` | Bausteine: Zellen der Mappe lesen, Formeln rechnen, deutsch runden, Beleg anlegen |

Aufruf aus `broschuere/`:

```bash
node scripts/modellrechnung/bauen.cjs            # alle drei Partials (oder: … bauen.cjs 11)
node scripts/modellrechnung/bauen.cjs --check    # Partials = Vorlage + Diagramme?
python3 scripts/modellrechnung/seiten_json.py    # Seiten-JSON mit Belegen
```

**Belege.** Jede Zahl der drei Seiten steht im Seiten-JSON unter `belege` mit `text` (wie gedruckt), `formel` über Zellen
der Mappe (`Übersicht!D38`, `'Frei finanziert'!J7`, `L69:`/`L70:` vor der Zelle für die Läufe mit 4.631 und 5.460 € je m²;
Rechenzeichen `+ - * /`, Klammern und `abrunden(x, s)`), `art` (zahl, prozent, mio, tsd, jahr) und `nk` (Nachkommastellen). Zahlen aus Läufen,
die nur `build_kennzahlen.py` rechnet (ohne Mietanpassung), tragen `kennzahl` statt `formel`; Wortlaute ohne Zelle
(z. B. „Median aus fünf PGN-Projekten“) tragen `herkunft`. Die Zahlen im JSON entstehen aus den Formeln;
`vofi/pruefe_vofi.py` (F9) rechnet jede Formel gegen die Mappe nach und prüft, dass der Text so im Partial steht.

Neue Werte der Mappe: `vofi/build_vofi.py`, `vofi/build_kennzahlen.py`, `praesentation/daten/werte_aus_vofi.py`, dann
`seiten_json.py`; weicht eine Zahl im Text der Vorlage ab, meldet F9 sie, und die Vorlage wird nachgezogen.
