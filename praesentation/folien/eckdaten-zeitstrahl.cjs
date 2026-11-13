// Folie 12 · PGN_INHALT: Darlehen und Bindung im Zeitverlauf (Broschüre S. 9). Zeitstrahl über zwölf Spalten mit vier Bändern,
// Achskreisen an 0, 35 und 42 und der Maßkette 35 | 7; darunter im Raster 4 + 4 + 4 zwei Kennzahlen und die Tilgung. Kein Rot in den Bändern.
'use strict';

module.exports = {
  id: 'eckdaten-zeitstrahl',
  bau(ctx) {
    const { B, W, X, fmt, colX, span, Y, Raster, P } = ctx, s = ctx.folie(), T = k => W('modellhaus', 'tab.' + k), M = k => W('modellhaus', k);
    B.register(s, '2.1');
    B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: 12.0, titel: 'Darlehen und Bindung im Zeitverlauf' });

    // ---- Zeitstrahl ------------------------------------------------------------------------------------------------
    // Die Jahresachse beginnt bei 0 (Bezugsfertigkeit). Die Bauphase steht links davor und ist nicht maßstäblich; unter ihr läuft keine Achse.
    // Der Achskreis „42“ ragt 0,20 über das Achsende: Die Achse endet deshalb 0,20 vor dem Satzspiegel.
    const frei = T('zinsfreie_jahre'), ende = T('laufzeit_hoechstens'), bindung = T('bindung');
    // Höhen von oben (Änderungsrunde vom 13.11.2026: Zeitstrahl niedriger, darunter der Hinweiskasten und drei gleich große Kennzahlen, F12.1, F12.2).
    // Die Maßkette steht 0,12 über den Bändern, ihre Werte 0,28 über der Linie, rechts neben dem Modultitel
    const BAU = 2.28, H_BAND = 0.22, Y_MASS = 2.60, DK = 0.40;
    const Y_ACHSE = +(Y_MASS + 0.12 + DK / 2 + 0.10 + 3 * H_BAND + 2 * 0.08).toFixed(3);
    const x0 = colX(1) + BAU, w = Raster.X1 - 0.20 - x0, jeJahr = w / ende;
    const z = B.zeitstrahl(s, { x: x0, y: Y_ACHSE, w, von: 0, bis: ende, bandH: H_BAND, ticks: [5, 10, 15, 20, 25, 30, 40],
      marken: [{ wert: 0 }, { wert: frei }, { wert: ende }],
      baender: [
        { von: 0, bis: frei, zeile: 0, art: 'referenz', text: `Laufzeit höchstens ${ende} Jahre` },
        { von: frei, bis: ende, zeile: 0, art: 'bisher' },
        { von: 0, bis: bindung, zeile: 1, art: 'tinte', text: `Belegungs- und Mietbindung ${bindung} Jahre` },
        { von: -BAU / jeJahr, bis: frei, zeile: 2, art: 'papier', text: `${fmt.prozent(T('zins_nbank_bis_jahr35'))} Zins ab Auszahlung bis Ende Jahr ${frei}` }] });
    // Bauphase: Rahmen ohne Füllung über zwei Bandzeilen, links der Achse
    B.balken(s, { x: colX(1), y: z.yBand(1), w: BAU, h: z.yBand(0) + H_BAND - z.yBand(1), art: 'rahmen', name: 'Band Bauphase' });
    B.text(s, 'Bauphase Neubau:\nAuszahlung in Raten', { x: colX(1) + 0.10, y: z.yBand(1), w: BAU - 0.20, h: z.yBand(0) + H_BAND - z.yBand(1), rolle: 'wert', valign: 'middle', name: 'Bandtext Bauphase' });
    B.text(s, 'Jahre ab Bezugsfertigkeit', { x: colX(1), y: Y_ACHSE - 0.10, w: BAU - 0.30, h: 0.20, rolle: 'achse', align: 'right', valign: 'middle', einzeilig: true, name: 'Achsenbezeichnung' });
    B.masskette(s, { x: z.xVon(0), y: z.oben - 0.12, w: z.xVon(ende) - z.xVon(0), segmente: [{ anteil: frei, text: `${frei} Jahre` }, { anteil: ende - frei, text: `${ende - frei} Jahre` }] });

    // Hinweiskasten unter dem Zeitstrahl, so breit wie dieser (Bauphase bis Achsende): der Zins ab Jahr 36 (F12.2; bis 13.11.2026 die Beschriftung
    // „ab Jahr 36 verzinst“ über dem hellen Abschnitt der Laufzeit)
    const zinsText = ctx.wortlaut(`Ab Jahr ${frei + 1}: Zins bis zu ${X('regeln', 'zins_ab_jahr36.aufschlag')} Prozentpunkte über dem Basiszinssatz (§ 247 BGB), höchstens marktüblich.`, 'Hinweiskasten');
    const h = B.hinweis(s, { x: colX(1), y: z.unten + 0.10, w: Raster.X1 - colX(1), text: zinsText });

    // ---- Drei gleich große Felder im Raster 4 + 4 + 4 (F12.1), ohne Zeile für einen Vorsatz (kompakt): Unter Zeitstrahl und Hinweiskasten fehlt sonst der Platz
    const y = +(h.unten + 0.14).toFixed(3), p100 = (k, nk = 0) => fmt.zahl(T(k) * 100, nk), tilgung = M('eingabe.tilgung_nbank');
    // Tilgung: rechnerisch gleichmäßig über die Höchstlaufzeit (1 ÷ 42 Jahre); den Satz legt die NBank fest (RL Nr. 5.3.5)
    ctx.gleich('Tilgung der Jahresrechnung gegen 1 ÷ Höchstlaufzeit', tilgung, Math.round(1 / ende * 1e4) / 1e4, 4);
    const k1 = B.kennzahl(s, { x: colX(1), y, w: span(4), kompakt: true, zahl: p100('verwaltungskostenbeitrag', 1), einheit: '% p. a.', label: 'Verwaltungskostenbeitrag', text: 'auf das Restkapital, ab Auszahlungsbeginn' });
    const k2 = B.kennzahl(s, { x: colX(5), y, w: span(4), kompakt: true, teile: [{ zahl: p100('bearbeitungsentgelt_darlehen'), einheit: '%' }, { zahl: p100('bearbeitungsentgelt_zuschuss', 2), einheit: '%' }],
      label: 'Bearbeitungsentgelt, einmalig', text: 'des Darlehens / des Zuschusses' });
    const k3 = B.kennzahl(s, { x: colX(9), y, w: span(4), kompakt: true, vor: 'mind.', zahl: fmt.zahl(tilgung * 100, 2), einheit: '% p. a.', label: ctx.wortlaut('Tilgung', 'Label'),
      text: ctx.wortlaut(`Rechnerisch bei ${ende} Jahren Laufzeit. Den Satz legt die NBank fest.`, 'Text Tilgung') });
    const unten = Math.max(k1.unten, k2.unten, k3.unten);
    if (unten > Y.inhaltEnde + 0.005) P.melde(`Die Kennzahlen enden bei y ${unten.toFixed(2)}, die Inhaltszone bei ${Y.inhaltEnde.toFixed(2)}.`);
  },
};
