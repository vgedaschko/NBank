#!/usr/bin/env python3
"""Fasst die beiden Zahlenquellen des Teams in einer Datei für ctx.wert zusammen (nur kopieren, nichts rechnen).

Quelle 1: konzepte/mappe/werte_konzepte.json (Konzepte-Mappe, Lauf „konzepte“ und Läufe N6), unverändert übernommen.
Quelle 2: konzepte/team-2/mappe/werte_team.json (Team-2-Kopie: Block T2 und bestehende Zellen, Lauf R1).
          Die Einträge unter „werte“ kommen als Lauf „team2“ dazu, die Läufe der Datei unter ihrem eigenen Namen.

Grund: entwurf.cjs liest in einer Datei mit „laeufe“ nur die Läufe; der Block „werte“ der Team-Datei wäre sonst nicht erreichbar.
Jeder Eintrag behält schluessel, wert, einheit, blatt, zelle und datei; die Belege der pptx nennen damit Blatt und Zelle.
Ausgabe: entwurf/folien/werte.json (wird von entwurf.cjs von selbst gelesen).
"""
import json
from pathlib import Path

HIER = Path(__file__).resolve().parent
KONZEPTE = HIER.parents[1]
Q1 = KONZEPTE / 'mappe' / 'werte_konzepte.json'
Q2 = KONZEPTE / 'team-2' / 'mappe' / 'werte_team.json'
ZIEL = HIER / 'folien' / 'werte.json'

k = json.loads(Q1.read_text(encoding='utf-8'))
t = json.loads(Q2.read_text(encoding='utf-8'))
datei_t = 'konzepte/team-2/mappe/PGN_VOFI_Mietwohnraum_2026_v3_Konzepte_Team2.xlsx'

aus = {'meta': {'titel': 'Zahlen der Entwürfe Team 2 (Kopie zweier Dateien, nichts gerechnet)',
                'quellen': ['konzepte/mappe/werte_konzepte.json', 'konzepte/team-2/mappe/werte_team.json'],
                'erzeugt_mit': 'konzepte/team-2/entwurf/werte_zusammen.py',
                'laeufe_team': 'team2 = werte_team.json, Block „werte“; liegenschaftszins_plus_0_60 = Lauf R1'},
       'laeufe': dict(k['laeufe'])}
werte = {}
for sk, e in t['werte'].items():
    e = dict(e)
    e.setdefault('datei', datei_t)
    werte[sk] = e
aus['laeufe']['team2'] = {'beschreibung': 'Team-2-Kopie, Block T2 und bestehende Zellen', 'datei': datei_t, 'werte': werte}
for name, lauf in t.get('laeufe', {}).items():
    if name in aus['laeufe']:
        raise SystemExit(f'Lauf {name} gibt es schon')
    aus['laeufe'][name] = lauf

# Geänderte Eingabe je Lauf als eigener Eintrag „<lauf>.eingabe“ (Kopie aus „aenderungen“: neuer Wert, alter Wert, Blatt, Zelle)
for name, lauf in aus['laeufe'].items():
    ae = lauf.get('aenderungen') or []
    if len(ae) == 1 and isinstance(lauf.get('werte'), dict):
        e = ae[0]
        sk = f'{name}.eingabe'
        lauf['werte'][sk] = {'schluessel': sk, 'wert': e['neu'], 'alt': e['alt'], 'blatt': e['blatt'], 'zelle': e['zelle'],
                             'bedeutung': lauf.get('beschreibung', ''), 'lauf': name, 'datei': lauf.get('datei', '')}

# Schlüssel dürfen über die Läufe hinweg nicht mit verschiedenen Werten doppelt vorkommen, sonst wäre ctx.wert mehrdeutig
gesehen = {}
for name, lauf in aus['laeufe'].items():
    for sk in (lauf.get('werte') or {}):
        gesehen.setdefault(sk, []).append(name)
doppelt = {sk: n for sk, n in gesehen.items() if len(n) > 1}
ZIEL.write_text(json.dumps(aus, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'{ZIEL.name}: {sum(len(l.get("werte") or {}) for l in aus["laeufe"].values())} Einträge in {len(aus["laeufe"])} Läufen; '
      f'Schlüssel in mehreren Läufen: {len(doppelt)}')
