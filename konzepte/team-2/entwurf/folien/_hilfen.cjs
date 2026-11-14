// Hilfen der Entwürfe Team 2 (keine Folie). Zahlen kommen nur über ctx.wert aus folien/werte.json (Kopie von werte_konzepte.json und
// werte_team.json, siehe entwurf/werte_zusammen.py); hier stehen nur Namen, Reihenfolge und kleine Rechenhelfer.
'use strict';

// Varianten in der Reihenfolge aller Folien: A, B, C, frei finanziert (Miete für DSCR 1,2 der Bank, Spalte H der Konzepte-Mappe)
const V = ['A', 'B', 'C', 'frei_dscr'];
const NAME = { A: 'Gruppe A', B: 'Gruppe B', C: 'Gruppe C', frei_dscr: 'frei finanziert' };
const KURZ = { A: 'A', B: 'B', C: 'C', frei_dscr: 'frei' };

// Prozentpunkte zwischen zwei Anteilen (0,0705 − 0,0601 = 1,04 Punkte)
const punkte = (a, b) => (a - b) * 100;

module.exports = { V, NAME, KURZ, punkte };
