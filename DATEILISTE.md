# Dateiliste des Projekts

Stand 12.11.2026. 781 versionierte Dateien: 651 aktuell, 57 veraltet, 73 Zwischenstand. Gelöscht oder verschoben ist nichts.

Die Spalte „Vorschlag“ gilt erst nach Freigabe.

Nachtrag 12.11.2026: Nach Freigabe liegen im Ordner `archiv/` die Vergleichsbilder (`muster-2/`, `konzepte-baukosten/`), die drei Textdateien (`textpruefung/`), das Hilfsmodul `_fein_pgn-baukosten.cjs` und die Messdatei `.measure-tmp.html`. Alles andere ist geblieben, wo es war. Die Pfade in den Tabellen unten zeigen den Stand vor dem Verschieben.

Nachtrag 12.11.2026, Prüfung der Beispielkalkulation: Im Ordner `pruefung-beispielkalkulation/` liegen die drei Prüfberichte und `Auswertung.md` (Einigkeit und Widerspruch, zehn Rückfragen, Liste zur Entscheidung). Stand: aktuell, gehört zu Vortrag und Excel.

Nachtrag 13.11.2026, Änderungsrunde (globale Regeln): `praesentation/folien/anhang-frist.cjs` ist gelöscht (Anhangfolie zur Frist 31.12.2026 entfallen). Neu: `praesentation/probe/34-diagramm-hinweis-stichpunkte.cjs` (Musterfolie für Hinweiskasten und Stichpunkte) und unter `broschuere/recherche/quellen/` drei Quellen im Volltext (GdW-Präsentation zur Jahrespressekonferenz 2026, BT-Drs. 21/7303, NBank-Produktinformation Stand 01.04.2026).

## Die Ergebnisse, je eine aktuelle Datei

| Ergebnis | Aktuelle Datei | Daraus erzeugt |
|---|---|---|
| Vortrag | `praesentation/dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pptx` | PDF-Ausgabe im selben Ordner |
| Handout (Broschüre) | `broschuere/dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026.pdf` | Druck-PDF mit Beschnitt und InDesign-Paket im selben Ordner |
| Excel | `vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx` | |
| Bauskript Vortrag | `praesentation/build.cjs` | mit `lib/`, `folien/`, `daten/`, Prüfung `pruefe_folien.py` |
| Bauskript Broschüre | `broschuere/scripts/assemble.cjs` und `render.cjs` | mit `src/pages/`, `src/styles.css`, InDesign-Export `export-idml.cjs` |
| Bauskript Excel | `vofi/build_vofi.py` | Prüfung `pruefe_vofi.py` |

Eine Datei mit dem Namen „Handout“ gibt es nicht; als Handout ist hier die Broschüre geführt.

## Veraltet und Zwischenstand

| Datei | Stand | Gehört zu | Was es ist | Vorschlag |
|---|---|---|---|---|
| `/README.md` | veraltet | Projekt gesamt | leere Startdatei (nur Überschrift) | löschen oder mit Übersicht füllen |
| `broschuere/korrektur/Korrektur-1-PGN-Mietwohnraumfoerderung-2026.pdf` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet | ins Archiv |
| `broschuere/korrektur/lauf-1/` (62 Dateien) | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet | ins Archiv |
| `broschuere/korrektur/optik-durchlauf/` (2 Dateien) | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet | ins Archiv |
| `broschuere/scripts/specimen.cjs` | veraltet | Bauskript Broschüre | Musterseiten-Skript, noch auf dem Stand vor Muster 2 | löschen oder nachziehen |
| `broschuere/src/.measure-tmp.html` | veraltet | Bauskript Broschüre | Messdatei vom 22.10., von nichts benutzt | löschen |
| `broschuere/src/assets/` (29 Dateien) | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) | löschen nach Sichtung |
| `broschuere/src/assets/pgn/` (2 Dateien) | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) | löschen nach Sichtung |
| `broschuere/src/assets/pgn/img/` (5 Dateien) | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) | löschen nach Sichtung |
| `broschuere/src/assets/pgn/ref/` (6 Dateien) | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) | löschen nach Sichtung |
| `broschuere/zulieferungen/2026-10-26_PGN_allgemeine_Mietwohnraumfoerderung_NBank.pptx` | veraltet | Vortrag | Ihr ursprünglicher Vortrag, abgelöst; bleibt unverändert | ins Archiv |
| `broschuere/zulieferungen/PGN_NBank_VOFI_Modell_v2-1.xlsx` | veraltet | Excel | Ihre Vorlage v2-1, abgelöst durch v3; bleibt unverändert | ins Archiv |
| `broschuere/zulieferungen/vofi-pruefung/` (7 Dateien) | veraltet | Excel | Prüfung der alten Mappe v2-1 | ins Archiv |
| `konzepte-baukosten/` (3 Dateien) | Zwischenstand | Vortrag | Vergleichsbild zu den Baukosten-Folien, eingebaut | löschen |
| `muster-2/` (4 Dateien) | Zwischenstand | Vortrag/Broschüre | Vergleichsbild zu Muster 2, eingebaut | löschen |
| `praesentation/folien/_fein_pgn-baukosten.cjs` | veraltet | Bauskript Vortrag | Hilfsmodul der alten Folie 22, von keiner Folie mehr benutzt | löschen |
| `textpruefung/Geaenderte-Saetze-alt-neu.md` | Zwischenstand | Vortrag/Broschüre | Protokoll der geänderten Sätze, alles eingebaut | ins Archiv |
| `textpruefung/` (2 Dateien) | veraltet | Vortrag/Broschüre | Befund vor der Überarbeitung, erledigt | ins Archiv |

## Alle Dateien

| Datei | Stand | Gehört zu | Was es ist |
|---|---|---|---|
| `.claude/skills/impeccable/LICENSE` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/NOTICE.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/SKILL.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/adapt.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/adapt.native.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/android.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/animate.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/audit.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/audit.native.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/bolder.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/clarify.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/colorize.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/component-review.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/craft-floor.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/craft.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/critique.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/degraded/asset-producer.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/degraded/documenter.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/degraded/finish-reviewer.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/degraded/manual-edit-applier.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/delight.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/distill.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/doctor.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/document.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/extract.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/generate.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/harden.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/hooks.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/init.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/ios.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/layout.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/live-setup.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/live.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/mode-operate.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/mode-persuade.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/mode-read.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/new-work.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/onboard.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/operate.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/optimize.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/overdrive.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/polish.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/quieter.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/region-map.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/routing.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/shape.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/typeset.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/reference/visualize.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/VERSION` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/command-metadata.json` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/data/font-index-failures.json` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/data/font-index.json` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/engine-checksums.txt` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/impeccable` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/impeccable.cmd` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/live-browser-dom.js` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/live-browser-ignores.js` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/live-browser-session.js` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/live-browser.js` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/impeccable/scripts/modern-screenshot.umd.js` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/no-ai-slop/LICENSE` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/no-ai-slop/SKILL.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `.claude/skills/no-ai-slop/eval.md` | aktuell | Werkzeug | Prüfhilfe für Gestaltung bzw. Text, kein Ergebnis |
| `README.md` | veraltet | Projekt gesamt | leere Startdatei (nur Überschrift) |
| `broschuere/.gitignore` | aktuell | Bauskript Broschüre | Gestaltungsregeln, Vorlage oder Einstellung |
| `broschuere/DESIGN.md` | aktuell | Bauskript Broschüre | Gestaltungsregeln, Vorlage oder Einstellung |
| `broschuere/INDESIGN.md` | aktuell | Bauskript Broschüre | Gestaltungsregeln, Vorlage oder Einstellung |
| `broschuere/README.md` | aktuell | Bauskript Broschüre | Gestaltungsregeln, Vorlage oder Einstellung |
| `broschuere/content/REDAKTIONSREGELN.md` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/copy.md` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/01-umschlag-titel.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/02-editorial-inhalt.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/03-zahlen-zuerst.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/04-neu-und-grundcheck.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/05-navigator.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/06-mieterkreis-einkommensgruppen.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/07-ertragsseite-mieten.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/08-programmteil-2-1.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/09-konditionen-term-sheet.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/10-modellrechnung-neubau.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/11-wirtschaftlichkeit.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/12-mix-und-tilgung.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/13-programmteil-2-2-eh40.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/14-programmteil-2-4-inseln.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/15-programmteil-2-3-modernisierung.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/16-programmteil-2-5-2-6-bindungen.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/17-standort-und-kommune.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/18-antragsweg.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/19-pgn-leistungen.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/20-unterlagen-kontakte.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/21-ueber-pgn.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/22-impressum-hinweise.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/23-quellen-notizen.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/pages/24-umschlag-rueckseite.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/content/plan.json` | aktuell | Handout (Broschüre) | Textfassung und Redaktionsregeln |
| `broschuere/dist/PGN-Mietwohnraumfoerderung-2026-InDesign.zip` | aktuell | Handout (Broschüre) | InDesign-Paket, aus demselben Bau |
| `broschuere/dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Druck-3mm-Beschnitt.pdf` | aktuell | Handout (Broschüre) | Druckfassung mit 3 mm Beschnitt, aus demselben Bau |
| `broschuere/dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026.pdf` | aktuell | Handout (Broschüre) | ERGEBNIS: Broschüre (PDF) |
| `broschuere/korrektur/Korrektur-1-PGN-Mietwohnraumfoerderung-2026.pdf` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ENTSCHEIDUNGEN.md` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/UMSETZUNG.md` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S01-01.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S01-02.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S01-03.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S01-04.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S02-05.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S02-06.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S02-07.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S02-08.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S02-09.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S02-10.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S03-11.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S04-12.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S04-13.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S04-14.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S05-15.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S05-16.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S06-17.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S06-18.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S07-19.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S07-20.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S07-21.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S08-22.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S09-23.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S09-24.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S10-25.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S10-26.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S10-27.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S10-28.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S10-29.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S11-30.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S11-31.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S11-32.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S11-33.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S12-34.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S12-35.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S12-36.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S13-37.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S14-38.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S15-39.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S15-40.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S16-41.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S17-42.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S19-43.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S20-44.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S20-45.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S20-46.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S20-47.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S20-48.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S20-49.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S20-50.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S21-51.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S21-52.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S22-53.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S23-54.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S23-55.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S23-56.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S23-57.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/ausschnitt-S24-58.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/kommentare.json` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/lauf-1/kommentare.md` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/optik-durchlauf/BERICHT.md` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/korrektur/optik-durchlauf/vergleich-auswahl.png` | Zwischenstand | Handout (Broschüre) | Korrekturlauf 1 (Ihr PDF mit Kommentaren, Entscheidungen, Ausschnitte), eingearbeitet |
| `broschuere/package-lock.json` | aktuell | Bauskript Broschüre | Gestaltungsregeln, Vorlage oder Einstellung |
| `broschuere/package.json` | aktuell | Bauskript Broschüre | Gestaltungsregeln, Vorlage oder Einstellung |
| `broschuere/recherche/README.md` | aktuell | Handout (Broschüre) | Faktenbasis der Texte |
| `broschuere/recherche/factbase.json` | aktuell | Handout (Broschüre) | Faktenbasis der Texte |
| `broschuere/recherche/factbase.md` | aktuell | Handout (Broschüre) | Faktenbasis der Texte |
| `broschuere/recherche/pgn-ci.md` | aktuell | Handout (Broschüre) | Faktenbasis der Texte |
| `broschuere/recherche/pgn-facts.md` | aktuell | Handout (Broschüre) | Faktenbasis der Texte |
| `broschuere/scripts/assemble.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/export-idml.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/fonts-static.py` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/browser.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/build.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/check.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/fonts.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/graphics.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/liesmich.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/make-fonts.py` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/requirements-idml.txt` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/selbsttest.py` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/stilnamen.json` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/validate.py` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/vokabular.json` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/writer.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/xml.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/idml/zip.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/pdf-kommentare.py` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/pgn-images.py` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/pgn-signatures.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/render.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/schraffur.cjs` | aktuell | Bauskript Broschüre | BAUSKRIPT bzw. Werkzeug (assemble, render, InDesign, Schriften, Bilder) |
| `broschuere/scripts/specimen.cjs` | veraltet | Bauskript Broschüre | Musterseiten-Skript, noch auf dem Stand vor Muster 2 |
| `broschuere/src/.measure-tmp.html` | veraltet | Bauskript Broschüre | Messdatei vom 22.10., von nichts benutzt |
| `broschuere/src/assets/deko-dachlinie.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/deko-isoraster.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/deko-schraffur.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/haus-diagramm.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/MANIFEST.md` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/favicon.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/img/bahnhofstrasse-duplex-rot.jpg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/img/bahnhofstrasse-duplex.jpg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/img/brauerstrasse-duplex-rot.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/img/brauerstrasse-duplex.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/img/burgsiedlung-duplex-rot.jpg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/img/burgsiedlung-duplex.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/img/dehnenweg-duplex-rot.jpg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/img/dehnenweg-duplex.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/img/lindenhof-duplex.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/img/porstweg-duplex-rot.jpg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/img/porstweg-duplex.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/innovation-white.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/kostensicherheit-white.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/logo-gruen.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/logo-mark-rot.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/logo-mono.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/logo-negativ.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/logo-rot.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/logo-weiss.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/qr-pgn-architekten.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/ref/ref-01-brauerstrasse-rotenburg.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/ref/ref-02-bahnhofstrasse-neu-wulmstorf.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/ref/ref-03-burgsiedlung-stade.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/ref/ref-04-dehnenweg-hohenhameln.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/ref/ref-05-waldblick-tiftlingerode.jpg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/ref/ref-06-ludwig-beck-strasse-winsen.jpg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/ref/ref-07-porstweg-rotenburg.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/ref/ref-08-hemphoefen-rotenburg-foto.jpg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/ref/ref-09-kiefernweg-rotenburg-foto.jpg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/ref/ref-10-wohnen-in-soltau-quartier.jpg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/ref/ref-11-wohnen-im-lindenhof-gifhorn.jpg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/ref/ref-12-eichenweg-rotenburg-rohbau-foto.jpg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pgn/sig-achskreis.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/sig-axo-brauerstrasse.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/sig-grundriss.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/sig-kote.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/sig-massstab.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/sig-nordpfeil.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/sig-raster-brauerstrasse.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/sig-schnitt.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/verantwortung-white.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pgn/vertrauen-white.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/pikto-bindungserwerb.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pikto-bindungsverlaengerung.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pikto-eh40-neubau.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pikto-inseln.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pikto-modernisierung.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pikto-neubau-mfh.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pikto-weg-aufstockung.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/pikto-weg-ersterwerb.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/titel-illustration.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/ui-achtung.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-ausrufe.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-check.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/ui-dokument.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-frist.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/ui-hinweis.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-kalender.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-kreuz.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-mail.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-pfeil.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-rechner.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-standort.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-stopp.svg` | aktuell | Bauskript Broschüre | Bild oder Symbol, eingebunden |
| `broschuere/src/assets/ui-telefon.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-tipp.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/ui-web.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/zielgruppe-genossenschaften.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/zielgruppe-investoren.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/zielgruppe-kommunen.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/zielgruppe-projektentwicklung.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/assets/zielgruppe-wohnungsunternehmen.svg` | veraltet | Bauskript Broschüre | Bild oder Symbol, auf keiner Seite eingebunden (Namenssuche) |
| `broschuere/src/fonts/files/bricolage-grotesque-latin-ext-opsz-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/bricolage-grotesque-latin-opsz-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/fraunces-latin-ext-full-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/fraunces-latin-ext-full-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/fraunces-latin-full-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/fraunces-latin-full-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/instrument-sans-latin-ext-standard-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/instrument-sans-latin-ext-standard-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/instrument-sans-latin-standard-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/instrument-sans-latin-standard-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/inter-arrows-symbols-wght-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/inter-latin-ext-opsz-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/inter-latin-ext-opsz-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/inter-latin-opsz-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/inter-latin-opsz-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/montserrat-latin-ext-wght-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/montserrat-latin-ext-wght-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/montserrat-latin-wght-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/montserrat-latin-wght-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/pgn-symbols-wght-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/source-serif-4-latin-ext-opsz-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/source-serif-4-latin-ext-opsz-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/source-serif-4-latin-opsz-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/source-serif-4-latin-opsz-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/work-sans-latin-ext-wght-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/work-sans-latin-ext-wght-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/work-sans-latin-wght-italic.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/files/work-sans-latin-wght-normal.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/fonts.css` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/licenses/bricolage-grotesque-OFL.txt` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/licenses/fraunces-OFL.txt` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/licenses/instrument-sans-OFL.txt` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/licenses/inter-OFL.txt` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/licenses/montserrat-OFL.txt` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/licenses/source-serif-4-OFL.txt` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/licenses/work-sans-OFL.txt` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w250-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w300-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w320-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w330-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w340-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w350-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w360-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w370-o24.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w370-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w380-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w400-o14.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w400-o16.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w400-o20.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w400-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w420-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w430-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w450-o14.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w450-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w480-o14.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w480-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w500-o14.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w500-o16.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w500-o24.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w500-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w520-o24.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w560-o14.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w560-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w580-o14.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w600-o14.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w600-o32.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w650-o14.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/arrows-w700-o14.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fi-w300-o144-s80-k1-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fi-w300-o144-s80-k1-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fi-w320-o144-s70-k1-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fi-w320-o144-s70-k1-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fi-w370-o36-s60-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fi-w370-o36-s60-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w250-o144-s70-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w250-o144-s70-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w300-o144-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w300-o144-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w320-o144-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w320-o144-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w330-o144-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w330-o144-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w330-o144-s50-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w330-o144-s50-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w340-o144-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w340-o144-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w340-o144-s50-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w340-o144-s50-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w350-o144-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w350-o144-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w360-o144-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w360-o144-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w360-o144-s60-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w360-o144-s60-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w370-o144-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w370-o144-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w370-o24-s30-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w370-o24-s30-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w380-o144-s50-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w380-o144-s50-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w380-o72-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w380-o72-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w400-o144-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w400-o144-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w400-o144-s60-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w400-o144-s60-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w400-o36-s30-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w400-o36-s30-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w400-o72-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w400-o72-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w420-o48-s30-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w420-o48-s30-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w420-o72-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w420-o72-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w430-o72-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w430-o72-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w450-o36-s30-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w450-o36-s30-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w450-o72-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w450-o72-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w480-o36-s30-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w480-o36-s30-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w500-o16-s0-k1-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w500-o16-s0-k1-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w500-o24-s30-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w500-o24-s30-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w500-o36-s30-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w500-o36-s30-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w500-o72-s40-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w500-o72-s40-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w520-o24-s30-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w520-o24-s30-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w560-o36-s30-k0-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/fn-w560-o36-s30-k0-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w400-o14-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w400-o14-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w400-o16-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w400-o16-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w400-o20-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w400-o20-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w450-o14-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w450-o14-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w480-o14-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w480-o14-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w500-o14-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w500-o14-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w500-o32-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w500-o32-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w560-o14-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w560-o14-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w580-o14-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w580-o14-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w600-o14-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w600-o14-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w600-o32-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w600-o32-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w650-o14-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w650-o14-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w700-o14-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/in-w700-o14-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/instances.json` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mi-w500-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mi-w500-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mi-w800-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mi-w800-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w300-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w300-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w340-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w340-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w350-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w350-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w360-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w360-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w370-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w370-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w400-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w400-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w420-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w420-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w430-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w430-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w450-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w450-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w480-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w480-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w500-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w500-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w520-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w520-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w560-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w560-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w600-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w600-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w650-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w650-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w700-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w700-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w800-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w800-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w900-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/mn-w900-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/needed.json` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w300.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w340.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w350.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w360.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w370.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w400.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w420.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w430.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w450.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w480.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w500.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w520.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w560.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w580.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w600.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w650.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w700.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w800.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/sym-w900.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wi-w400-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wi-w400-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w400-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w400-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w450-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w450-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w500-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w500-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w580-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w580-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w600-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w600-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w650-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w650-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w700-latin-ext.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/fonts/static/wn-w700-latin.woff2` | aktuell | Bauskript Broschüre | Schriftdatei |
| `broschuere/src/pages/01-umschlag-titel.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/02-editorial-inhalt.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/03-zahlen-zuerst.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/04-neu-und-grundcheck.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/05-navigator.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/06-mieterkreis-einkommensgruppen.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/07-ertragsseite-mieten.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/08-programmteil-2-1.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/09-konditionen-term-sheet.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/10-modellrechnung-neubau.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/11-wirtschaftlichkeit.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/12-mix-und-tilgung.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/13-programmteil-2-2-eh40.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/14-programmteil-2-4-inseln.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/15-programmteil-2-3-modernisierung.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/16-programmteil-2-5-2-6-bindungen.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/17-standort-und-kommune.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/18-antragsweg.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/19-pgn-leistungen.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/20-unterlagen-kontakte.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/21-ueber-pgn.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/22-impressum-hinweise.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/23-quellen-notizen.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/pages/24-umschlag-rueckseite.html` | aktuell | Bauskript Broschüre | Seite der Broschüre |
| `broschuere/src/styles.css` | aktuell | Bauskript Broschüre | Gestaltungsregeln, Vorlage oder Einstellung |
| `broschuere/src/template.html` | aktuell | Bauskript Broschüre | Gestaltungsregeln, Vorlage oder Einstellung |
| `broschuere/zulieferungen/2026-10-26_PGN_allgemeine_Mietwohnraumfoerderung_NBank.pptx` | veraltet | Vortrag | Ihr ursprünglicher Vortrag, abgelöst; bleibt unverändert |
| `broschuere/zulieferungen/PGN_NBank_VOFI_Modell_v2-1.xlsx` | veraltet | Excel | Ihre Vorlage v2-1, abgelöst durch v3; bleibt unverändert |
| `broschuere/zulieferungen/vofi-pruefung/PRUEFBERICHT.md` | veraltet | Excel | Prüfung der alten Mappe v2-1 |
| `broschuere/zulieferungen/vofi-pruefung/annahmen.json` | veraltet | Excel | Prüfung der alten Mappe v2-1 |
| `broschuere/zulieferungen/vofi-pruefung/annahmen.md` | veraltet | Excel | Prüfung der alten Mappe v2-1 |
| `broschuere/zulieferungen/vofi-pruefung/kennzahlen-konzept.md` | veraltet | Excel | Prüfung der alten Mappe v2-1 |
| `broschuere/zulieferungen/vofi-pruefung/modellkarte.md` | veraltet | Excel | Prüfung der alten Mappe v2-1 |
| `broschuere/zulieferungen/vofi-pruefung/referenzrechnung-ergebnis.md` | veraltet | Excel | Prüfung der alten Mappe v2-1 |
| `broschuere/zulieferungen/vofi-pruefung/referenzrechnung.py` | veraltet | Excel | Prüfung der alten Mappe v2-1 |
| `konzepte-baukosten/Eingebaut-Folie-03-und-22.png` | Zwischenstand | Vortrag | Vergleichsbild zu den Baukosten-Folien, eingebaut |
| `konzepte-baukosten/Folie-03-Baukosten-2020-gegen-2025.png` | Zwischenstand | Vortrag | Vergleichsbild zu den Baukosten-Folien, eingebaut |
| `konzepte-baukosten/Folie-22-PGN-gegen-ARGE.png` | Zwischenstand | Vortrag | Vergleichsbild zu den Baukosten-Folien, eingebaut |
| `muster-2/Broschuere-S11-vorher-nachher.png` | Zwischenstand | Vortrag/Broschüre | Vergleichsbild zu Muster 2, eingebaut |
| `muster-2/Folie-15-vorher-nachher.png` | Zwischenstand | Vortrag/Broschüre | Vergleichsbild zu Muster 2, eingebaut |
| `muster-2/Folie-20-vorher-nachher.png` | Zwischenstand | Vortrag/Broschüre | Vergleichsbild zu Muster 2, eingebaut |
| `muster-2/Vortrag-alle-Folien-Muster-2.png` | Zwischenstand | Vortrag/Broschüre | Vergleichsbild zu Muster 2, eingebaut |
| `praesentation/.gitignore` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/INHALT.md` | aktuell | Vortrag | Lesefassung aller Folientexte, wird erzeugt |
| `praesentation/README.md` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/assets/axo-hell.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/bg-anthrazit.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/bg-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/bg-schluss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/bg-titel.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/grundriss-hell.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/logo-mark-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/logo-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/nordpfeil.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/pikto-bindungserwerb.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/pikto-bindungsverlaengerung.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/pikto-eh40-neubau.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/pikto-inseln.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/pikto-modernisierung.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/pikto-neubau-mfh.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/pikto-weg-aufstockung.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/pikto-weg-ersterwerb.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/qr-pgn.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/raster-brauerstrasse-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ref-brauerstrasse.jpg` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-achtung-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-achtung-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-achtung-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-achtung-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-check-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-check-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-check-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-check-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-dokument-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-dokument-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-dokument-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-dokument-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-frist-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-frist-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-frist-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-frist-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-hinweis-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-hinweis-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-hinweis-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-hinweis-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-kalender-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-kalender-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-kalender-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-kalender-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-kreuz-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-kreuz-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-kreuz-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-kreuz-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-mail-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-mail-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-mail-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-mail-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-pfeil-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-pfeil-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-pfeil-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-pfeil-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-rechner-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-rechner-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-rechner-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-rechner-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-standort-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-standort-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-standort-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-standort-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-stopp-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-stopp-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-stopp-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-stopp-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-telefon-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-telefon-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-telefon-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-telefon-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-web-dunkelrot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-web-rot.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-web-tinte.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/ui-web-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/wert-innovation-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/wert-kostensicherheit-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/wert-verantwortung-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/assets/wert-vertrauen-weiss.png` | aktuell | Bauskript Vortrag | Bild oder Symbol für den Bau |
| `praesentation/build.cjs` | aktuell | Bauskript Vortrag | BAUSKRIPT: baut den Vortrag |
| `praesentation/daten/inhalt_md.py` | aktuell | Bauskript Vortrag | Daten, Konzept oder Belege des Vortrags |
| `praesentation/daten/markt.json` | aktuell | Bauskript Vortrag | Daten, Konzept oder Belege des Vortrags |
| `praesentation/daten/outline.json` | aktuell | Bauskript Vortrag | Daten, Konzept oder Belege des Vortrags |
| `praesentation/daten/probe.json` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/daten/pruefe_werte.py` | aktuell | Bauskript Vortrag | Daten, Konzept oder Belege des Vortrags |
| `praesentation/daten/pruefung.json` | aktuell | Bauskript Vortrag | Daten, Konzept oder Belege des Vortrags |
| `praesentation/daten/rahmen.json` | aktuell | Bauskript Vortrag | Daten, Konzept oder Belege des Vortrags |
| `praesentation/daten/rechnung.json` | aktuell | Bauskript Vortrag | Daten, Konzept oder Belege des Vortrags |
| `praesentation/daten/regeln.json` | aktuell | Bauskript Vortrag | Daten, Konzept oder Belege des Vortrags |
| `praesentation/daten/umsetzung.json` | aktuell | Bauskript Vortrag | Daten, Konzept oder Belege des Vortrags |
| `praesentation/daten/werte.json` | aktuell | Bauskript Vortrag | Daten, Konzept oder Belege des Vortrags |
| `praesentation/daten/werte_aus_vofi.py` | aktuell | Bauskript Vortrag | Daten, Konzept oder Belege des Vortrags |
| `praesentation/dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pdf` | aktuell | Vortrag | PDF-Ausgabe des Vortrags, aus der pptx erzeugt |
| `praesentation/dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pptx` | aktuell | Vortrag | ERGEBNIS: Vortrag (PowerPoint) |
| `praesentation/folien/_einstieg.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/_fein_ausgangslage-zinsen.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/_fein_pgn-baukosten.cjs` | veraltet | Bauskript Vortrag | Hilfsmodul der alten Folie 22, von keiner Folie mehr benutzt |
| `praesentation/folien/_fluss.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/_kostengruppen.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/_rechnung.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/_regeln.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/_struktur.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/_ueberblick.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/_umsetzung.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/agenda.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/anhang-eckdaten.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/anhang-frist.cjs` | gelöscht am 13.11.2026 | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/anhang-mieterkreis.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/anhang-programmteile.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/anhang-rendite.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/anhang-tilgungsschwelle.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/anhang-trenner.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/anhang-vertraege.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/anhang-voraussetzungen.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/antragsweg.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/ausgangslage-zinsen.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/eckdaten-zeitstrahl.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/einstieg-baukosten.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/einstieg-bestand.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/einstieg-kapitaldienst.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/fazit.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/foerdermix.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/hoechstmiete.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/kontakt.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/neu-seit-juli.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/pgn-baukosten.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/pgn-leistungen.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/quellen.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/rechnung-finanzierung.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/rechnung-fluss-frei.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/rechnung-fluss-gefoerdert.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/rechnung-jahr1.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/rechnung-kapitaldienst.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/rechnung-kosten.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/rechnung-miete.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/rechnung-tilgung.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/rechnung-verlauf.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/titel.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/trenner-ausgangslage.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/trenner-programmteil.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/trenner-rechnung.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/folien/trenner-umsetzung.cjs` | aktuell | Bauskript Vortrag | Modul einer Folie bzw. gemeinsamer Teil |
| `praesentation/fonts/Montserrat-Black.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/Montserrat-BlackItalic.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/Montserrat-Bold.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/Montserrat-BoldItalic.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/Montserrat-ExtraBold.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/Montserrat-ExtraBoldItalic.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/Montserrat-Italic.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/Montserrat-Light.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/Montserrat-LightItalic.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/Montserrat-Medium.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/Montserrat-Regular.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/Montserrat-SemiBold.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/WorkSans-Bold.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/WorkSans-BoldItalic.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/WorkSans-Italic.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/WorkSans-Light.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/WorkSans-Medium.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/WorkSans-MediumItalic.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/WorkSans-Regular.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/WorkSans-SemiBold.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/WorkSans-SemiBoldItalic.ttf` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/montserrat-OFL.txt` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/fonts/work-sans-OFL.txt` | aktuell | Bauskript Vortrag | Schriftdatei für Bau und Prüfung |
| `praesentation/lib/API.md` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/lib/assets.cjs` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/lib/bausteine.cjs` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/lib/daten.cjs` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/lib/diagramme.cjs` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/lib/layoutnamen.json` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/lib/layouts.cjs` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/lib/nachbearbeitung.cjs` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/lib/passpruefung.cjs` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/lib/schriftmetrik.json` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/lib/theme.cjs` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/lib/zonenpruefung.cjs` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/package-lock.json` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/package.json` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/probe/01-titel.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/02-inhalt-foerdermix.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/03-diagramm-saeulen.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/04-diagramm-mr-stapel.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/05-tabelle-mr-rechenblatt.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/06-inhalt-mr-finanzierung.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/07-vergleich.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/08-vergleich-mr.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/09-kennzahlen.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/10-kennzahlen-mr.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/11-aussage.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/12-tabelle.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/13-ablauf.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/14-zitat.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/15-dunkel.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/16-abschnitt.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/17-abschnitt-rot.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/18-anhang-bild.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/19-schluss.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/20-diagramm-mr-linien.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/21-inhalt-mr-balkenpaar.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/22-inhalt-zeitstrahl.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/23-anhang-balken-ring.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/24-diagramm-mr-kapitaldienst.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/25-diagramm-mr-saeulen-tabelle.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/26-diagramm-mr-verlauf.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/27-inhalt-weitere-bausteine.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/28-inhalt-balkenplan.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/29-anhang-pruefliste.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/30-anhang-gegenueberstellung.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/31-anhang-zeitleiste.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/32-diagramm-linien-monate.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/probe/33-inhalt-mr-flussdiagramm.cjs` | aktuell | Bauskript Vortrag | Musterfolie der Bausteine (Testbau läuft), kein Ergebnis |
| `praesentation/pruefe_folien.py` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/werkzeug/render.cjs` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `praesentation/werkzeug/schriftmetrik.py` | aktuell | Bauskript Vortrag | Bibliothek, Prüfung oder Einstellung |
| `textpruefung/Geaenderte-Saetze-alt-neu.md` | Zwischenstand | Vortrag/Broschüre | Protokoll der geänderten Sätze, alles eingebaut |
| `textpruefung/Textpruefung-Broschuere.md` | veraltet | Vortrag/Broschüre | Befund vor der Überarbeitung, erledigt |
| `textpruefung/Textpruefung-Vortrag.md` | veraltet | Vortrag/Broschüre | Befund vor der Überarbeitung, erledigt |
| `vofi/.gitignore` | aktuell | Excel | Begleitunterlage zur Rechenmappe v3 |
| `vofi/AENDERUNGEN.md` | aktuell | Excel | Begleitunterlage zur Rechenmappe v3 |
| `vofi/KONZEPT-v3.md` | aktuell | Excel | Begleitunterlage zur Rechenmappe v3 |
| `vofi/PGN_VOFI_Mietwohnraum_2026_v3.xlsx` | aktuell | Excel | ERGEBNIS: Rechenmappe v3 |
| `vofi/README.md` | aktuell | Excel | Begleitunterlage zur Rechenmappe v3 |
| `vofi/build_vofi.py` | aktuell | Bauskript Excel | erzeugt die Rechenmappe |
| `vofi/pruefe_vofi.py` | aktuell | Bauskript Excel | prüft die Rechenmappe |

## Nicht versioniert (entsteht beim Bau, liegt nur auf der Arbeitsmaschine)

- `broschuere/dist/indesign/`: entpacktes InDesign-Paket, derselbe Inhalt wie die ZIP-Datei
- `broschuere/dist/preview/`, `broschuere/dist/qa/`: Vorschaubilder und Prüfausgaben
- `broschuere/src/index.html`, `broschuere/src/.preview-NN.html`: zusammengesetzte Seiten
- `node_modules/`, `broschuere/.venv/`: Programmpakete
