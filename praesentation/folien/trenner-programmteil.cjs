// Folie 8 · Trenner „Programmteil 2.1: die Regeln“ (PGN_ABSCHNITT_ROT): Achskreis XL mit der Nummer des Abschnitts, Titel und Vorspann im
// Wortlaut des Konzepts, Achsleiste der vier Abschnitte. Aufbau und Zählung: S.trenner in folien/_struktur.cjs. Keine Zahlen.
'use strict';
const S = require('./_struktur.cjs');

module.exports = { id: 'trenner-programmteil', bau(ctx) { S.trenner(ctx); } };
