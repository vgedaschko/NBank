// Muster PGN_DIAGRAMM_MR: gestapelte Säulen in den festen Farben (Zuschuss, Darlehen, Eigenmittel schraffiert) auf Papier.
// Zusatz „Fiktives Beispiel, keine Förderzusage“ in der Kickerzeile, nur auf der ersten Folie der Modellrechnung.
'use strict';
module.exports = {
  id: 'p04-diagramm-mr-stapel',
  o: { nr: '4', layout: 'PGN_DIAGRAMM_MR', titel: '20 Wohnungen, 7,0 Mio. €: bis zu 5,6 Mio. € Förderung',
    inhalt: 'Kicker: „MODELLRECHNUNG · FINANZIERUNG“. Titelzeilen: „20 Wohnungen, 7,0 Mio. €:“ | „bis zu 5,6 Mio. € Förderung“ (Signaturwort: „5,6 Mio. €“).' },
  bau(ctx) {
    const { B, D, W, fmt, colX, ZONE } = ctx, s = ctx.folie();
    B.stempelZusatz(s); B.register(s, '2.1');
    const G = ['A', 'B', 'C'], mio = k => G.map(g => W('modellhaus', `fin.${k}.${g}`) / 1e6);
    B.diagrammkopf(s, { titel: 'Finanzierung in Mio. €', sub: `Gesamtkosten je ${fmt.mio(W('modellhaus', 'fin.gesamtkosten.A'))} · Höchstsätze` });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Zuschuss', art: 'zuschuss' }, { text: 'Darlehen', art: 'darlehen' }, { text: 'Eigenmittel, mind.', art: 'eigenmittel' }] });
    D.stapelSaeulen(s, { kategorien: G, katAchse: 'gruppe', name: 'Diagramm Finanzierung',
      reihen: [{ name: 'Zuschuss', art: 'zuschuss', werte: mio('zuschuss') }, { name: 'Darlehen', art: 'darlehen', werte: mio('darlehen_nbank') }, { name: 'Eigenmittel, mind.', art: 'eigenmittel', werte: mio('eigenmittel') }],
      achse: { min: 0, max: 7, schritt: 1.4, format: 'eins' } });
    B.planlegende(s, { platzhalter: 'kommentar', eintraege: [
      { text: 'Von A nach C wird Zuschuss zu Darlehen, und die zulässige Höchstmiete steigt.' },
      { text: 'B und C setzen eine Zulassung in der Förderentscheidung voraus.' }] });
  },
};
