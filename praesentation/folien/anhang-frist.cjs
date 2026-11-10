// Folie A2 · PGN_ANHANG: Achtung-Kasten zur Frist 31.12.2026 (zweites und letztes Achtung-Element des Vortrags), darunter die Zeitleiste der
// sechs Stichtage als Achsleiste mit Achskreisen S; der 31.12.2026 gefüllt in Dunkelrot. Darunter eine Zeile zum Zuschuss nach Programmteil 2.3.
// Texte und Stichtage aus daten/markt.json (Broschüre S. 16).
'use strict';
const { lies } = require('./_ueberblick.cjs');

module.exports = {
  id: 'anhang-frist',
  bau(ctx) {
    const { B, X, colX, Y } = ctx, s = ctx.folie(), U = lies(ctx), x = colX(1), w = 12.0, y0 = Y.anhangInhalt;
    const label = X('markt', 'frist.achtung.label'), tage = U('frist.zeitleiste');
    ctx.wortlaut(label, 'Label des Achtung-Kastens');

    // ---- Achtung-Kasten über zwölf Spalten ---------------------------------------------------------------------------------
    B.achtung(s, { x, y: y0, w, h: 1.52, label, text: ctx.wortlaut(U('frist.achtung'), 'Achtung-Kasten') });

    // ---- Zeitleiste: Datum in Montserrat Bold 12, Text und Zusatz 12 pt; die Station mit dem langen Wort bekommt mehr Breite -----------
    const yAchse = B.modulkopf(s, { x, y: y0 + 1.84, w, titel: ctx.wortlaut(X('markt', 'frist.zeitleiste.titel'), 'Titel der Zeitleiste') }) + 0.32;
    tage.forEach(t => { ctx.wortlaut(t.datum, 'Stichtag'); ctx.wortlaut(t.text, `Stichtag ${t.datum}`); if (t.zusatz) ctx.wortlaut(t.zusatz, `Stichtag ${t.datum}, Zusatz`); });
    if (tage.filter(t => t.signal).length !== 1) ctx.P.melde('Zeitleiste: Genau ein Stichtag trägt das Signal (31.12.2026).');
    const leiste = B.achsleiste(s, { x, y: yAchse, w, art: 'text', groesse: 'S', versalTitel: false, pt: 12, anteile: [0.9, 1, 1.05, 1.25, 0.9, 0.9],
      stationen: tage.map(t => ({ titel: t.datum, text: t.text, zusatz: t.zusatz, signal: !!t.signal })) });

    // ---- Zeile zum Zuschuss nach RL 2026, unten in der Inhaltszone -------------------------------------------------------------
    const zeile = ctx.wortlaut(U('frist.zuschuss_2_3'), 'Zeile unter der Zeitleiste'), yZeile = Y.inhaltEnde - 0.72;
    if (leiste.unten > yZeile - 0.20) ctx.P.melde(`Zeitleiste endet bei y ${leiste.unten.toFixed(2)} und reicht an die Zeile darunter (ab y ${yZeile.toFixed(2)}).`);
    B.linie(s, { x, y: yZeile, w, art: 'haar', name: 'Linie über der Zeile' });
    B.programmChip(s, { x, y: yZeile + 0.16, nr: X('markt', 'frist.zuschuss_2_3.nr') });
    B.text(s, zeile, { x: x + 0.56, y: yZeile + 0.14, w: w - 0.56, rolle: 'dicht', name: 'Zeile unter der Zeitleiste' });
  },
};
