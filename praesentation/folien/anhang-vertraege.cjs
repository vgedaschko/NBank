// Folie A4 · PGN_ANHANG: Verträge und Maßnahmen vor der Bewilligung als Gegenüberstellung in drei Spalten im Raster 4 + 4 + 4 (Broschüre S. 19).
// Je Spalte Modulkopf mit Kopf-Icon und eine Aufzählung mit eckigen Markern; die Spalte „Förderschädlich“ mit Linie und Kopf in Dunkelrot
// (Signal immer mit Wort). Kein Grün, kein Achtung-Kasten. Texte aus daten/umsetzung.json.
'use strict';
const { lies } = require('./_umsetzung.cjs');

module.exports = {
  id: 'anhang-vertraege',
  bau(ctx) {
    const { B, P, colX, span, Y } = ctx, s = ctx.folie(), U = lies(ctx);
    const spalten = U('vorhabenbeginn.spalten');
    if (spalten.length !== 3) throw new Error(`anhang-vertraege: ${spalten.length} Spalten, das Raster 4 + 4 + 4 fasst drei.`);
    if (spalten.filter(sp => sp.signal).length !== 1) throw new Error('anhang-vertraege: Genau eine Spalte trägt das Signal (Dunkelrot).');
    spalten.forEach((sp, i) => {
      const x = colX(1 + 4 * i), w = span(4);
      ctx.wortlaut(sp.titel, `Spalte ${i + 1}, Kopf`);
      sp.punkte.forEach((p, k) => ctx.wortlaut(p, `Spalte ${i + 1}, Punkt ${k + 1}`));
      const y = B.modulkopf(s, { x, y: Y.anhangInhalt, w, titel: sp.titel, icon: sp.icon, altText: sp.icon_text, signal: !!sp.signal });
      const liste = B.aufzaehlung(s, { x, y: y + 0.14, w, pt: 16, punkte: sp.punkte, name: 'Aufzählung ' + sp.titel });
      if (liste.unten > Y.inhaltEnde) P.melde(`Verträge: Die Spalte „${sp.titel}“ endet bei y ${liste.unten.toFixed(2)}, die Inhaltszone bei ${Y.inhaltEnde.toFixed(2)}.`);
    });
  },
};
