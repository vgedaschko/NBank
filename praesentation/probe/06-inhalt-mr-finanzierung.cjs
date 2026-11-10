// Muster PGN_INHALT_MR: ein gestapelter Balken mit Maßkette und 80-%-Achse, darunter ein Rechenblatt (14 pt, Summenzeile),
// rechts zwei Kennzahl-Kacheln (44 pt). Freie Komposition im Raster 8 + 4.
'use strict';
module.exports = {
  id: 'p06-inhalt-mr-finanzierung',
  o: { nr: '6', layout: 'PGN_INHALT_MR', titel: '20 Wohnungen, 7,0 Mio. €: bis zu 5,6 Mio. € Förderung',
    inhalt: 'Kicker: „MODELLRECHNUNG · FINANZIERUNG“. Titelzeilen: „20 Wohnungen, 7,0 Mio. €:“ | „bis zu 5,6 Mio. € Förderung“ (Signaturwort: „5,6 Mio. €“).' },
  bau(ctx) {
    const { B, D, W, fmt, colX, span, Y } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.register(s, '2.1');
    B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: span(8), titel: `Finanzierung ${fmt.mio(M('fin.gesamtkosten.A'))}, Höchstsätze` });
    const teile = [['Zuschuss', 'zuschuss', M('fin.zuschuss.A')], ['Darlehen', 'darlehen', M('fin.darlehen_nbank.A')], ['Eigenmittel, mind.', 'eigenmittel', M('fin.eigenmittel.A')]];
    const d = D.stapelBalken(s, { x: colX(1), y: 2.42, w: span(8), h: 1.50, kategorien: ['Gruppe A'], name: 'Diagramm Finanzierung Gruppe A',
      reihen: teile.map(([name, art, v]) => ({ name, art, werte: [v / 1e6] })), achse: { min: 0, max: 7, schritt: 1, format: 'eins' }, rand: { l: 0.20, o: 0.50, u: 0.40 }, luecke: 30 });
    const my = d.plot.y - 0.12, foerderung = M('fin.foerderung.A');
    B.masskette(s, { x: d.plot.x, y: my, w: d.plot.w, segmente: [{ anteil: foerderung, text: `Förderung ${fmt.mio(foerderung)} · ${fmt.prozent(M('fin.foerderquote.A'))}` }, { anteil: M('fin.eigenmittel.A'), text: fmt.prozent(M('fin.eigenmittelquote.A')) }] });
    B.achse80(s, { x: d.xWert(foerderung / 1e6), yOben: my, yUnten: d.plot.y + d.plot.h });
    B.rechenblatt(s, { x: colX(1), y: 4.14, w: span(8), kopf: ['Position', '€'], wertBreite: 1.60, zeilen: [
      { nr: 1, text: `Herstellungskosten, ${fmt.qm(M('eingabe.wohnflaeche'))} × ${fmt.zahl(M('eingabe.herstellungskosten_qm'))} €`, werte: [fmt.zahl(M('fin.herstellungskosten'))] },
      { nr: 2, zeichen: '+', text: 'Grundstück', werte: [fmt.zahl(M('fin.grundstueck'))] },
      { nr: 3, zeichen: '=', text: 'zuwendungsfähige Kosten', werte: [fmt.zahl(M('fin.zuwendungsfaehige_kosten.A'))], art: 'summe' },
      { nr: 4, text: `Eigenmittel, mindestens ${fmt.prozent(M('tab.eigenmittel_mindestens'))}`, werte: [fmt.zahl(M('fin.eigenmittel.A'))] }] });
    const k1 = B.kennzahl(s, { x: colX(9), y: Y.inhalt, w: span(4), vorsatz: 'bis zu', zahl: fmt.zahl(M('fin.zuschuss_je_wohnung.A')), einheit: '€', label: 'Zuschuss je Wohnung', text: 'plus Darlehen in gleicher Höhe' });
    B.kennzahl(s, { x: colX(9), y: Math.max(k1.unten + 0.30, 4.14), w: span(4), vorsatz: 'mind.', zahl: fmt.zahl(M('fin.eigenmittel_je_wohnung.A')), einheit: '€', label: 'Eigenmittel je Wohnung', text: `${fmt.prozent(M('tab.eigenmittel_mindestens'))} der Gesamtkosten` });
  },
};
