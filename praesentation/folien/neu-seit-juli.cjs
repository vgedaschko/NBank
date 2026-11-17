// Folie 9 · PGN_INHALT: Programmteil 2.1 im Vergleich. Seit dem Designtest vom 17.11.2026 vier Zeilen in 14 pt (nicht rückzahlbarer Teil,
// Förderquote, Eigenmittel, Bindung); die ganze Tabelle steht im Anhang (anhang-vergleich). Zeilen, Werte und Gegenproben: folien/_vergleich.cjs
'use strict';
const { vergleich } = require('./_vergleich.cjs');
module.exports = {
  id: 'neu-seit-juli',
  bau(ctx) {
    const s = ctx.folie();
    ctx.B.register(s, '2.1');   // erste Folie des Abschnitts „Programmteil 2.1“: Daumenregister wie auf den Folien 10 bis 12
    vergleich(ctx, s, { auswahl: [1, 0, 2, 5], gross: true, titelPruefen: true });
  },
};
