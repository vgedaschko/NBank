// Hilfsfunktionen der Baugruppe „ueberblick“ (Folie A1; die Anhangfolie zur Frist ist am 13.11.2026 entfallen). Kein Folienmodul: build.cjs lädt nur folien/<id>.cjs der Folien des Konzepts.
//   felder, lies   Zugriff auf daten/markt.json (Block programmteile) mit gefüllten Platzhaltern ({name}); „mappe_…“ kommt aus daten/werte.json
// Allgemeine Helfer stehen in lib/: ctx.wortlaut, ctx.gleich, ctx.lies, B.modulkopf mit rechts, B.tabelle mit dicht.
'use strict';

// Zahlen, die in den Texten der Datendatei als Platzhalter stehen: die Sätze des Programmteils 2.1 (Folie A1) aus daten/werte.json, Lauf modellhaus.
function felder(ctx) {
  const { W, fmt } = ctx, M = k => W('modellhaus', k), satz = v => fmt.zahl(v * 100);
  const f = { mappe_quote: satz(M('tab.quote_darlehen.A') + M('tab.quote_zuschuss.A')), mappe_bindung: String(M('tab.bindung')), mappe_eigenmittel: satz(M('tab.eigenmittel_mindestens')) };
  for (const g of ['A', 'B', 'C']) { f['mappe_darlehen_' + g] = satz(M(`tab.quote_darlehen.${g}`)); f['mappe_zuschuss_' + g] = satz(M(`tab.quote_zuschuss.${g}`)); }
  return f;
}

// Zugriff auf daten/markt.json mit gefüllten Platzhaltern: const U = lies(ctx); U('programmteile.texte.titel').
const lies = ctx => ctx.lies('markt', felder(ctx));

module.exports = { felder, lies };
