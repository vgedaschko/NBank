// Muster PGN_INHALT: Zeitstrahl mit Bändern in festen Farben, Achskreisen an den Marken, Maßkette und Höhenkote;
// darunter im Raster 4 + 4 + 4 zwei Kennzahl-Kacheln (44 pt) und ein Eintrag der Planlegende. Kein Rot in den Bändern.
'use strict';
module.exports = {
  id: 'p22-inhalt-zeitstrahl',
  o: { nr: '22', layout: 'PGN_INHALT', titel: '35 Jahre zinsfrei und gebunden, höchstens 42 Jahre Laufzeit',
    inhalt: 'Kicker: „FINANZIERUNG · ECKDATEN“. Titelzeilen: „35 Jahre zinsfrei und gebunden,“ | „höchstens 42 Jahre Laufzeit“ (Signaturwort: „35 Jahre“).' },
  bau(ctx) {
    const { B, W, fmt, colX, span, Y } = ctx, s = ctx.folie(), T = k => W('modellhaus', 'tab.' + k);
    B.register(s, '2.1');
    B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: 12.0, titel: 'Darlehen und Bindung im Zeitverlauf' });
    const frei = T('zinsfreie_jahre'), ende = T('laufzeit_hoechstens');
    // Der Achskreis „42“ am Achsende ragt 0,20 über die Achse: Die Achse endet deshalb 0,20 vor dem Satzspiegel
    const z = B.zeitstrahl(s, { x: colX(1), y: 4.30, w: 12.0 - 0.20, von: -5, bis: ende, ticks: [5, 10, 15, 20, 25, 30, 40], achsText: 'Jahre ab Bezugsfertigkeit',
      marken: [{ wert: 0 }, { wert: frei }, { wert: ende }],
      baender: [
        { von: -5, bis: 0, zeile: 0, art: 'rahmen', text: 'Bauphase' },
        { von: 0, bis: frei, zeile: 0, art: 'referenz', text: `Laufzeit: Jahr 1 bis ${frei}` }, { von: frei, bis: ende, zeile: 0, art: 'bisher', text: 'verzinst' },
        { von: 0, bis: frei, zeile: 1, art: 'tinte', text: `Belegungs- und Mietbindung ${T('bindung')} Jahre` },
        { von: 0, bis: frei, zeile: 2, art: 'papier', text: `${fmt.prozent(T('zins_nbank_bis_jahr35'))} Zins ab Auszahlung bis Ende Jahr ${frei}` }] });
    B.masskette(s, { x: z.xVon(0), y: z.oben - 0.12, w: z.xVon(ende) - z.xVon(0), segmente: [{ anteil: frei, text: `${frei} Jahre` }, { anteil: ende - frei, text: `${ende - frei} Jahre` }] });
    B.kote(s, { x: z.xVon(0), y: z.yBand(0) - 0.09, text: '±0', seite: 'links', w: 0.6 });
    const y = 5.02;
    B.kennzahl(s, { x: colX(1), y, w: span(4), zahl: fmt.zahl(T('verwaltungskostenbeitrag') * 100, 1), einheit: '% p. a.', label: 'Verwaltungskostenbeitrag' });
    B.kennzahl(s, { x: colX(5), y, w: span(4), zahl: `${fmt.zahl(T('bearbeitungsentgelt_darlehen') * 100)} % / ${fmt.zahl(T('bearbeitungsentgelt_zuschuss') * 100, 2)}`, einheit: '%', label: 'Bearbeitungsentgelt, einmalig' });
    B.planlegende(s, { x: colX(9), y, w: span(4), h: 1.48, linie: true, pt: 14, eintraege: [{ titel: 'Tilgung', text: 'Den Satz legt die NBank fest. Beginn nach vollständiger Auszahlung.' }] });
  },
};
