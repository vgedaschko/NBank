// Folie 26 · PGN_ABLAUF: Antragsweg in acht Stationen (Broschüre S. 19). Zwei Achsleisten zu je vier Stationen über zwölf Spalten,
// Station 4 (Entscheidung der NBank) mit gefülltem Achskreis in Dunkelrot; zwischen den Reihen das Warnband zur Bewilligung
// (einziges Signalelement des Hauptteils), unter Reihe 2 die Zeile zum Vorhabenbeginn. Texte und Fristen aus daten/umsetzung.json.
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
      ctx.wortlaut(t.text, `Station ${t.nr}, Text`);
    }
    if (!stationen[n1 - 1].signal) throw new Error('antragsweg: Die letzte Station der ersten Reihe trägt die Bewilligung (signal: true).');

    // ---- Lagen: Reihe 1 beginnt an der Oberkante der Inhaltszone, die Zeile zum Beginn steht an ihrer Unterkante ---------
    const D_KREIS = 0.46, H_BAND = 0.42, H_ZEILE = 0.22;
    const LUFT_BAND = 0.10;                                   // Abstand der Texte von Reihe 1 zum Warnband und des Warnbands zu den Achskreisen von Reihe 2
                                                              // (0,10: Die Titel der Stationen stehen seit Muster 2 gemischt in 16 pt und sind je Reihe 0,04 höher;
                                                              // so bleibt unter Reihe 2 der Abstand zur Zeile zum Vorhabenbeginn)
    // Die Stationen 2 und 6 sind etwas breiter als die übrigen (3,12 statt 2,94 und 3,00 Zoll): „bei der Wohnraumförderstelle“ ist 2,88 Zoll breit
    // und stünde bei vier gleichen Feldern ohne Abstand vor dem Text der Station 3. So bleiben die Texte von Reihe 1 sicher zweizeilig,
    // und zwischen den Spalten steht überall mindestens 0,2 Zoll. Beide Reihen tragen dieselbe Teilung; die Achskreise stehen übereinander.
    const ANTEILE = [0.98, 1.04, 0.98, 1.00];
    const leiste = (y, teil) => B.achsleiste(s, { x: colX(1), y, w: Raster.CW, groesse: 'L', pt: 14, abstand: 0.06, anteile: ANTEILE.slice(0, teil.length), stationen: teil });

    const r1 = leiste(Y.inhalt + D_KREIS / 2, stationen.slice(0, n1));
    const yBand = +(r1.unten + LUFT_BAND).toFixed(3);
    const kopf = ctx.wortlaut(`${U('antragsweg.warnband.zeichen')} ${U('antragsweg.warnband.wort')}`, 'Warnband, Kopf');
    B.warnband(s, { y: yBand, kopf, text: ctx.wortlaut(U('antragsweg.warnband.text'), 'Warnband, Text') });
    const r2 = leiste(+(yBand + H_BAND + LUFT_BAND + D_KREIS / 2).toFixed(3), stationen.slice(n1));

    const yZeile = Y.inhaltEnde - H_ZEILE;
    if (r2.unten > yZeile - 0.04) P.melde(`Antragsweg: Reihe 2 endet bei y ${r2.unten.toFixed(2)}, die Zeile zum Vorhabenbeginn beginnt bei ${yZeile.toFixed(2)}. Texte kürzen oder Abstände senken.`);
    B.text(s, ctx.wortlaut(U('antragsweg.beginn'), 'Zeile unter Reihe 2'), { x: colX(1), y: yZeile, w: Raster.CW, h: H_ZEILE, rolle: 'klein', valign: 'bottom', einzeilig: true, name: 'Zeile unter dem Ablauf' });
  },
};
