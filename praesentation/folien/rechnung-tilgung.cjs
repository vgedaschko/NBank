// Folie 18 · PGN_DIAGRAMM_MR: Zahlungsüberschuss in Jahr 1 je Tilgungssatz als drei Geraden (A durchgezogen in Tinte, B gestrichelt in
// Tinte, C in Referenzgrau) wie Block 4 der Mappe. Maßkette mit Teilung bei der Schwelle C gegen A, Marke beim Tilgungssatz der
// Jahresrechnung mit den drei Werten, Achskreise an den Linienenden. Kein Rot im Diagramm.
// Stützpunkte: Zahlungsüberschuss vor Tilgung − Satz × NBank-Darlehen (werte.json, Lauf modellhaus), gegen das Raster der Mappe geprüft.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'rechnung-tilgung',
  bau(ctx) {
    const { B, D, W, fmt } = ctx, s = ctx.folie(), M = k => W('modellhaus', k), G = R.G;
    B.register(s, '2.1');
    B.diagrammkopf(s, { titel: 'Zahlungsüberschuss je Tilgungssatz', sub: 'Jahr 1, in € p. a. · Tilgungssatz p. a. auf das NBank-Darlehen' });
    R.linienLegende(ctx, s);

    // Teilung der Achse: 0,0 bis 3,0 % in Schritten von 0,5 Prozentpunkten
    const saetze = [0, 0.005, 0.01, 0.015, 0.02, 0.025, 0.03], n = saetze.length - 1;
    const bei = (g, t) => M(`tilg.ueberschuss_vor_tilgung.${g}`) - t * M(`fin.darlehen_nbank.${g}`), reihe = g => saetze.map(t => bei(g, t));
    // Gegenprobe: Wo die Mappe denselben Satz führt (Übersicht 4.1 bis 4.8), stimmen die Stützpunkte mit ihr überein
    const raster = M('tilg.raster.satz');
    let gleich = 0;
    saetze.forEach(t => { const k = raster.findIndex(r => Math.abs(r - t) < 1e-9); if (k < 0) return; gleich++;
      for (const g of G) R.pruefe(Math.abs(M(`tilg.raster.zahlungsueberschuss.${g}`)[k] - bei(g, t)) < 0.005, `Stützpunkt ${g} bei ${fmt.prozent(t, 1)} weicht vom Raster der Mappe ab.`); });
    R.pruefe(gleich >= 5, 'Das Raster der Mappe deckt weniger als fünf Stützpunkte der Folie 18.');
    const tJahr = M('eingabe.tilgung_nbank'), schwelle = M('tilg.schwelle.C_gegen_A'), bester = M('tilg.raster.bester');
    R.pruefe(saetze.includes(tJahr), 'Der Tilgungssatz der Jahresrechnung liegt nicht auf der Achsteilung der Folie 18.');
    for (const g of G) R.pruefe(Math.abs(bei(g, tJahr) - M(`jr1.zahlungsueberschuss.${g}`)) < 0.005, `Der Wert ${g} beim Satz der Jahresrechnung ist nicht Zeile 8 der Jahresrechnung.`);
    R.pruefe(bester[raster.indexOf(0)] === 'C' && !bester.includes('B') && Math.abs(bei('C', schwelle) - bei('A', schwelle)) < 1 && M('tilg.schwelle.B_gegen_A') < schwelle,
      'Die Aussagen „unter der Schwelle C, darüber A, B nie vorn“ treffen nicht mehr zu.');

    const d = D.linien(s, { kategorien: saetze.map(t => fmt.prozent(t, 1)), name: 'Diagramm Zahlungsüberschuss je Tilgungssatz', rand: { r: 0.55, o: 0.50 },
      reihen: R.linienReihen(reihe), achse: { min: -60000, max: 100000, schritt: 20000, format: 'ganz' } });
    const xSatz = t => d.katMitte(t / saetze[1]), band = oben => (d.yWert(oben) + d.yWert(oben - 20000)) / 2;   // Mitte des Bandes unter der Gitterlinie „oben“

    // Maßkette über dem Diagramm, Teilung bei der Schwelle; Maßhilfslinie bis zum Schnittpunkt von A und C
    const my = d.plot.y - 0.12, xS = xSatz(schwelle);
    B.masskette(s, { x: xSatz(0), y: my, w: xSatz(saetze[n]) - xSatz(0), segmente: [
      { anteil: schwelle, text: 'höchster Überschuss: C' }, { anteil: saetze[n] - schwelle, text: 'höchster Überschuss: A' }] });
    B.linie(s, { x: xS, y: my, h: d.yWert(bei('A', schwelle)) - my, art: 'mass', pt: 0.5, name: 'Maßhilfslinie Schwelle' });
    B.text(s, fmt.prozent(schwelle, 2), { x: xS + 0.08, y: band(60000) - 0.12, w: 0.80, h: 0.24, rolle: 'wert', valign: 'middle', einzeilig: true, name: 'Schwelle C gegen A' });

    // Marke beim Tilgungssatz der Jahresrechnung: Punkte auf den Linien, die drei Werte rechts der Marke, Bezeichnung unter der Achse
    const xM = xSatz(tJahr);
    B.marke(s, { x: xM, y: d.plot.y, h: d.plot.h, art: 'mass' });
    for (const g of G) B.punkt(s, { cx: xM, cy: d.yWert(bei(g, tJahr)), art: R.LINIEN[g].art, name: 'Punkt ' + g });
    B.wertzeilen(s, { x: xM + 0.10, mitten: [band(100000), band(80000), band(60000)], name: 'Jahresrechnung', eintraege: G.map(g => ({ kreis: g, text: fmt.zahl(bei(g, tJahr)) })) });
    B.text(s, 'Annahme der Jahresrechnung', { x: xM - 1.30, y: d.plot.y + d.plot.h + 0.26, w: 2.60, h: 0.20, rolle: 'achse', farbe: 'text', align: 'center', valign: 'middle', einzeilig: true, name: 'Markentext' });

    B.linienenden(s, { x: xSatz(saetze[n]) + 0.30, eintraege: G.map(g => ({ kreis: g, y: d.yWert(bei(g, saetze[n])) })) });

    B.planlegende(s, { platzhalter: 'kommentar', eintraege: [
      { text: `Unter ${fmt.prozent(schwelle, 2)} Tilgung bringt C den höchsten Zahlungsüberschuss, darüber A.` },
      { text: 'B liegt in dieser Rechnung nie vorn.' },
      { text: 'Den Tilgungssatz legt die NBank fest, die Richtlinie nennt keinen.' },
      // Bedingung, die beim Vergleich von A, B und C nicht fehlen darf (Broschüre S. 12, Redaktionsregeln §3)
      { text: 'B und C setzen eine Zulassung in der Förderentscheidung voraus.' }].map(e => ({ text: ctx.wortlaut(e.text, 'Kommentar') })) });
  },
};
