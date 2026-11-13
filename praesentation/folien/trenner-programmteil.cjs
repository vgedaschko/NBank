// Folie 8 · Trenner „Programmteil 2.1: Neuerungen, Höchstmiete, Fördersätze, Eckdaten“ (PGN_ABSCHNITT_ROT): Achskreis XL mit der Nummer des
// Abschnitts, Titel in drei Zeilen und Vorspann im Wortlaut des Konzepts, Achsleiste der vier Abschnitte. Aufbau und Zählung: S.trenner in
// folien/_struktur.cjs. Keine Zahlen. Der Vorspann bricht von selbst (Änderungsrunde vom 13.11.2026, F8.2: zwei Sätze, bis zu vier Zeilen).
'use strict';
const S = require('./_struktur.cjs');

module.exports = { id: 'trenner-programmteil', bau(ctx) { S.trenner(ctx); } };
