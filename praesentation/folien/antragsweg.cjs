// Folie 26 · PGN_ABLAUF: Antragsweg in acht Stationen (Broschüre S. 19). Zwei Achsleisten zu je vier Stationen über zwölf Spalten,
// Station 4 (Entscheidung der NBank) mit gefülltem Achskreis in Dunkelrot; zwischen den Reihen das Warnband zur Bewilligung
// (einziges Signalelement des Hauptteils), unter Reihe 2 der Hinweiskasten zum Vorhabenbeginn (seit der Änderungsrunde vom 13.11.2026, F26.1 und
// G8; bis dahin eine Zeile in 12 pt). Texte und Fristen aus daten/umsetzung.json.
'use strict';
const { lies } = require('./_umsetzung.cjs');

module.exports = {
  id: 'antragsweg',
  bau(ctx) {
    const { B, P, colX, Y, Raster } = ctx, s = ctx.folie(), U = lies(ctx);

    // ---- Stationen: Wortlaut gegen das Konzept prüfen, dann auf zwei Reihen teilen --------------------------------------
    const stationen = U('antragsweg.stationen'), [n1, n2] = U('antragsweg.reihen');
    if (stationen.length !== n1 + n2) throw new Error(`antragsweg: ${stationen.length} Stationen, die Reihen fassen ${n1} + ${n2}.`);
    for (const t of stationen) {
      ctx.wortlaut(`${t.nr} ${t.titel}`, `Station ${t.nr}, Titel`);
      ctx.wortlaut(t.zustaendig, `Station ${t.nr}, Zuständigkeit`);
      // „\n“ im Text beginnt eine neue Zeile (Station 7 seit 13.11.2026, F26.3); jede Zeile steht für sich im Konzept
      t.text.split('\n').forEach((z, i) => ctx.wortlaut(z, `Station ${t.nr}, Text${t.text.includes('\n') ? ', Zeile ' + (i + 1) : ''}`));
    }
    if (!stationen[n1 - 1].signal) throw new Error('antragsweg: Die letzte Station der ersten Reihe trägt die Bewilligung (signal: true).');

    // ---- Lagen: Reihe 1 beginnt am Kopf der Inhaltszone, der Hinweiskasten steht an ihrer Unterkante ------------------------
    // Seit der Änderungsrunde vom 13.11.2026 braucht Station 4 (F26.2) eine Textzeile mehr, und der Hinweiskasten (F26.1) ist höher als die
    // Zeile in 12 pt davor. Der Platz kommt aus engeren Abständen, die Schriftgrößen bleiben: Achskreise M statt L, Reihe 1 beginnt 0,08 höher,
    // Titel, Zuständigkeit und Text der Stationen stehen enger (B.achsleiste mit dicht), Luft am Warnband 0,05 statt 0,10.
    const KREIS = 'M', D_KREIS = 0.40, H_BAND = 0.42, Y_START = Y.inhalt - 0.08;
    const LUFT_BAND = 0.05;                                   // Abstand der Texte von Reihe 1 zum Warnband und des Warnbands zu den Achskreisen von Reihe 2
    const LUFT_HINWEIS = 0.04;                                // Abstand des Hinweiskastens zum Textfeld der letzten Zeile von Reihe 2 (wie bis dahin zur Zeile)
    // Die Stationen 2 und 6 sind etwas breiter als die übrigen (3,12 statt 2,94 und 3,00 Zoll): „bei der Wohnraumförderstelle“ ist 2,88 Zoll breit
    // und stünde bei vier gleichen Feldern ohne Abstand vor dem Text der Station 3. So bleiben die Texte von Reihe 1 sicher zweizeilig,
    // und zwischen den Spalten steht überall mindestens 0,2 Zoll. Beide Reihen tragen dieselbe Teilung; die Achskreise stehen übereinander.
    const ANTEILE = [0.98, 1.04, 0.98, 1.00];
    const leiste = (y, teil) => B.achsleiste(s, { x: colX(1), y, w: Raster.CW, groesse: KREIS, dicht: true, pt: 14, abstand: 0.06, anteile: ANTEILE.slice(0, teil.length), stationen: teil });

    const r1 = leiste(Y_START + D_KREIS / 2, stationen.slice(0, n1));
    const yBand = +(r1.unten + LUFT_BAND).toFixed(3);
    const kopf = ctx.wortlaut(`${U('antragsweg.warnband.zeichen')} ${U('antragsweg.warnband.wort')}`, 'Warnband, Kopf');
    B.warnband(s, { y: yBand, kopf, text: ctx.wortlaut(U('antragsweg.warnband.text'), 'Warnband, Text') });
    const r2 = leiste(+(yBand + H_BAND + LUFT_BAND + D_KREIS / 2).toFixed(3), stationen.slice(n1));

    // Hinweiskasten zum Vorhabenbeginn (G8): grau, mit Info-Symbol, so breit wie der Ablauf, an der Unterkante der Inhaltszone
    const hinweis = ctx.wortlaut(U('antragsweg.beginn'), 'Hinweiskasten unter Reihe 2');
    const yHinweis = +(Y.inhaltEnde - B.hinweisHoehe(hinweis, { w: Raster.CW })).toFixed(3);

    if (r2.unten > yHinweis - LUFT_HINWEIS + 0.005) P.melde(`Antragsweg: Reihe 2 endet bei y ${r2.unten.toFixed(2)}, der Hinweiskasten beginnt bei ${yHinweis.toFixed(2)}. Texte kürzen oder Abstände senken.`);
    B.hinweis(s, { x: colX(1), y: Y.inhaltEnde, w: Raster.CW, text: hinweis, unten: true, name: 'Vorhabenbeginn' });
  },
};
