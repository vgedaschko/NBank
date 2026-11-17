// Anhang · PGN_ANHANG: Programmteil 2.1 im Vergleich, ganze Tabelle mit sechs Zeilen (Designtest vom 17.11.2026; die Folie 9 zeigt vier davon).
'use strict';
const { vergleich } = require('./_vergleich.cjs');
module.exports = {
  id: 'anhang-vergleich',
  bau(ctx) { vergleich(ctx, ctx.folie(), { ohneKopf: true }); },
};
