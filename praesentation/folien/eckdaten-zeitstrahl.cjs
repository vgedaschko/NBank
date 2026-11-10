// Folie 12 · PGN_INHALT: Darlehen und Bindung im Zeitverlauf (Broschüre S. 9). Zeitstrahl über zwölf Spalten mit vier Bändern,
// Achskreisen an 0, 35 und 42 und der Maßkette 35 | 7; darunter im Raster 4 + 4 + 4 zwei Kennzahlen und die Tilgung. Kein Rot in den Bändern.
'use strict';

module.exports = {
  id: 'eckdaten-zeitstrahl',
  bau(ctx) {
    const { B, W, fmt, colX, span, Y, Raster } = ctx, s = ctx.folie(), T = k => W('modellhaus', 'tab.' + k);
    B.register(s, '2.1');
    B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: 12.0, titel: 'Darlehen und Bindung im Zeitverlauf' });

    // ---- Zeitstrahl ------------------------------------------------------------------------------------------------
    // Die Jahresachse beginnt bei 0 (Bezugsfertigkeit). Die Bauphase steht links davor und ist nicht maßstäblich; unter ihr läuft keine Achse.
    // Der Achskreis „42“ ragt 0,20 über das Achsende: Die Achse endet deshalb 0,20 vor dem Satzspiegel.
    const frei = T('zinsfreie_jahre'), ende = T('laufzeit_hoechstens'), bindung = T('bindung');
    const BAU = 2.28, Y_ACHSE = 4.33, H_BAND = 0.36;
    const x0 = colX(1) + BAU, w = Raster.X1 - 0.20 - x0, jeJahr = w / ende;
    const z = B.zeitstrahl(s, { x: x0, y: Y_ACHSE, w, von: 0, bis: ende, bandH: H_BAND, ticks: [5, 10, 15, 20, 25, 30, 40],
      marken: [{ wert: 0 }, { wert: frei }, { wert: ende }],
      baender: [
        { von: 0, bis: frei, zeile: 0, art: 'referenz', text: `Laufzeit höchstens ${ende} Jahre` },
        { von: frei, bis: ende, zeile: 0, art: 'bisher' },
        { von: 0, bis: bindung, zeile: 1, art: 'tinte', text: `Belegungs- und Mietbindung ${bindung} Jahre` },
        { von: -BAU / jeJahr, bis: frei, zeile: 2, art: 'papier', text: `${fmt.prozent(T('zins_nbank_bis_jahr35'))} Zins ab Auszahlung bis Ende Jahr ${frei}` }] });
    // Beschriftung des hellen Abschnitts der Laufzeit: Der Text ist breiter als sieben Jahre und steht deshalb direkt über dem Band
    B.text(s, `ab Jahr ${frei + 1} verzinst`, { x: z.xVon(frei) + 0.10, y: z.yBand(1), w: z.xVon(ende) + 0.20 - z.xVon(frei) - 0.10, h: H_BAND, rolle: 'wert', valign: 'bottom', einzeilig: true, name: 'Beschriftung Laufzeit ab Zinsbeginn' });
    // Bauphase: Rahmen ohne Füllung über zwei Bandzeilen, links der Achse
    B.balken(s, { x: colX(1), y: z.yBand(1), w: BAU, h: z.yBand(0) + H_BAND - z.yBand(1), art: 'rahmen', name: 'Band Bauphase' });
    B.text(s, 'Bauphase Neubau:\nAuszahlung in Raten', { x: colX(1) + 0.10, y: z.yBand(1), w: BAU - 0.20, h: z.yBand(0) + H_BAND - z.yBand(1), rolle: 'wert', valign: 'middle', name: 'Bandtext Bauphase' });
    B.text(s, 'Jahre ab Bezugsfertigkeit', { x: colX(1), y: Y_ACHSE - 0.10, w: BAU - 0.30, h: 0.20, rolle: 'achse', align: 'right', valign: 'middle', einzeilig: true, name: 'Achsenbezeichnung' });
    B.masskette(s, { x: z.xVon(0), y: z.oben - 0.12, w: z.xVon(ende) - z.xVon(0), segmente: [{ anteil: frei, text: `${frei} Jahre` }, { anteil: ende - frei, text: `${ende - frei} Jahre` }] });

    // ---- Drei Felder im Raster 5 + 4 + 3 -----------------------------------------------------------------------------
    // Das erste Feld ist fünf Spalten breit: Sein Text braucht 4,08 Zoll und bräche in vier Spalten (3,84) in zwei Zeilen, die unten aus der Inhaltszone liefen.
    const y = 4.78, p100 = (k, nk = 0) => fmt.zahl(T(k) * 100, nk);
    B.kennzahl(s, { x: colX(1), y, w: span(5), zahl: p100('verwaltungskostenbeitrag', 1), einheit: '% p. a.', label: 'Verwaltungskostenbeitrag', text: 'auf das Restkapital, ab Auszahlungsbeginn' });
    B.kennzahl(s, { x: colX(6), y, w: span(4), teile: [{ zahl: p100('bearbeitungsentgelt_darlehen'), einheit: '%' }, { zahl: p100('bearbeitungsentgelt_zuschuss', 2), einheit: '%' }],
      label: 'Bearbeitungsentgelt, einmalig', text: 'des Darlehens / des Zuschusses' });
    B.planlegende(s, { x: colX(10), y, w: span(3), linie: true, pt: 14, eintraege: [{ titel: 'Tilgung', text: 'Den Satz legt die NBank fest. Beginn nach vollständiger Auszahlung.' }] });
  },
};
