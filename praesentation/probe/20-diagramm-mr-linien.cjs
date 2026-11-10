// Muster PGN_DIAGRAMM_MR: Liniendiagramm mit drei Reihen (A durchgezogen in Tinte, B gestrichelt in Tinte, C in Referenzgrau),
// kräftiger Nulllinie, Achskreisen an den Linienenden, senkrechter Marke und Legende mit Linienmustern. Kein Rot im Diagramm.
'use strict';
module.exports = {
  id: 'p20-diagramm-mr-linien',
  o: { nr: '20', layout: 'PGN_DIAGRAMM_MR', titel: 'Der Tilgungssatz entscheidet über den Zahlungsüberschuss in Jahr 1',
    inhalt: 'Kicker: „MODELLRECHNUNG · MIX UND TILGUNG“. Titelzeilen: „Der Tilgungssatz entscheidet über“ | „den Zahlungsüberschuss in Jahr 1“ (Signaturwort: „Tilgungssatz“).' },
  bau(ctx) {
    const { B, D, W, fmt, colX, ZONE } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.register(s, '2.1');
    B.diagrammkopf(s, { titel: 'Zahlungsüberschuss je Tilgungssatz', sub: 'Jahr 1, in € p. a. · Tilgungssatz p. a. auf das NBank-Darlehen' });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Gruppe A', art: 'tinte', strich: 'solid' }, { text: 'Gruppe B', art: 'tinte', strich: 'dash' }, { text: 'Gruppe C', art: 'referenz', strich: 'solid' }] });
    const saetze = [0, 0.005, 0.01, 0.015, 0.02, 0.025, 0.03], G = ['A', 'B', 'C'];
    const reihe = g => saetze.map(t => M(`tilg.ueberschuss_vor_tilgung.${g}`) - t * M(`fin.darlehen_nbank.${g}`));
    const d = D.linien(s, { kategorien: saetze.map(t => fmt.prozent(t, 1)), name: 'Diagramm Zahlungsüberschuss je Tilgungssatz', rand: { r: 0.55 },
      reihen: [{ name: 'Gruppe A', werte: reihe('A'), art: 'tinte' }, { name: 'Gruppe B', werte: reihe('B'), art: 'tinte', strich: 'dash' }, { name: 'Gruppe C', werte: reihe('C'), art: 'referenz' }],
      achse: { min: -60000, max: 100000, schritt: 20000, format: 'ganz' } });
    const letzter = saetze.length - 1, enden = B.entzerre(G.map(g => d.yWert(reihe(g)[letzter])), 0.32);
    G.forEach((g, i) => B.achskreis(s, { cx: d.katMitte(letzter) + 0.30, cy: enden[i], groesse: 'S', text: g }));
    // Lage des Tilgungssatzes der Jahresrechnung auf der Achse; der Satz (1/42) liegt zwischen zwei Teilungen
    const iJahr = M('eingabe.tilgung_nbank') / saetze[1];
    B.marke(s, { x: d.katMitte(iJahr), y: d.plot.y, h: d.plot.h, art: 'mass', text: 'Annahme der Jahresrechnung', textSeite: 'links' });
    B.planlegende(s, { platzhalter: 'kommentar', eintraege: [
      { text: `Unter ${fmt.prozent(M('tilg.schwelle.C_gegen_A'), 2)} Tilgung bringt C den höchsten Zahlungsüberschuss, darüber A.` },
      { text: 'B liegt in dieser Rechnung nie vorn.' },
      { text: 'Den Tilgungssatz legt die NBank fest, die Richtlinie nennt keinen.' }] });
  },
};
