// Folie 20 · PGN_DIAGRAMM_MR: Zahlungsüberschuss in Jahr 1 je Tilgungssatz als drei Geraden (A durchgezogen in Tinte, B gestrichelt in
// Tinte, C in Referenzgrau) wie Block 4 der Mappe. Maßkette mit Teilung bei der Schwelle C gegen A, Marke beim Tilgungssatz der
// Jahresrechnung mit den drei Werten, Achskreise an den Linienenden. Kein Rot im Diagramm. Die Achse reicht bis 4,0 %: So schneiden alle drei
// Geraden die Nulllinie im Bild (Tilgungssatz, bei dem der Zahlungsüberschuss null ist; Übersicht 3.8).
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

    // Teilung der Achse: 0,0 bis 4,0 % in Schritten von 0,5 Prozentpunkten
    const saetze = [0, 0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04], n = saetze.length - 1, ACHSE = { min: -40000, max: 80000, schritt: 20000, format: 'ganz' };
    const bei = (g, t) => M(`tilg.ueberschuss_vor_tilgung.${g}`) - t * M(`fin.darlehen_nbank.${g}`), reihe = g => saetze.map(t => bei(g, t));
    // Gegenprobe: Wo die Mappe denselben Satz führt (Übersicht 4.1 bis 4.8), stimmen die Stützpunkte mit ihr überein
    const raster = M('tilg.raster.satz');
    let gleich = 0;
    saetze.forEach(t => { const k = raster.findIndex(r => Math.abs(r - t) < 1e-9); if (k < 0) return; gleich++;
      for (const g of G) R.pruefe(Math.abs(M(`tilg.raster.zahlungsueberschuss.${g}`)[k] - bei(g, t)) < 0.005, `Stützpunkt ${g} bei ${fmt.prozent(t, 1)} weicht vom Raster der Mappe ab.`); });
    R.pruefe(gleich >= 5, 'Das Raster der Mappe deckt weniger als fünf Stützpunkte der Folie 20.');
    R.pruefe(G.every(g => reihe(g).every(v => v > ACHSE.min && v < ACHSE.max)), 'Ein Stützpunkt der Folie 20 liegt außerhalb der Größenachse; Achse im Modul anpassen.');
    const tJahr = M('eingabe.tilgung_nbank'), schwelle = M('tilg.schwelle.C_gegen_A'), bester = M('tilg.raster.bester');
    R.pruefe(tJahr > saetze[0] && tJahr < saetze[n], 'Der Tilgungssatz der Jahresrechnung liegt nicht im Bereich der Achse der Folie 20.');
    for (const g of G) R.pruefe(Math.abs(bei(g, tJahr) - M(`jr1.zahlungsueberschuss.${g}`)) < 0.005, `Der Wert ${g} beim Satz der Jahresrechnung ist nicht Zeile 8 der Jahresrechnung.`);
    R.pruefe(bester[raster.indexOf(0)] === 'C' && !bester.includes('B') && Math.abs(bei('C', schwelle) - bei('A', schwelle)) < 1 && M('tilg.schwelle.B_gegen_A') < schwelle,
      'Die Aussagen „unter der Schwelle C, darüber A, B nie vorn“ treffen nicht mehr zu.');

    const d = D.linien(s, { kategorien: saetze.map(t => fmt.prozent(t, 1)), name: 'Diagramm Zahlungsüberschuss je Tilgungssatz', rand: { l: 1.06, r: 0.55, o: 0.50, u: 0.50 },
      reihen: R.linienReihen(reihe), achse: ACHSE });
    const xSatz = t => d.katMitte(t / saetze[1]), band = oben => (d.yWert(oben) + d.yWert(oben - ACHSE.schritt)) / 2;   // Mitte des Bandes unter der Gitterlinie „oben“

    // Maßkette über dem Diagramm, Teilung bei der Schwelle; Maßhilfslinie bis zum Schnittpunkt von A und C
    const my = d.plot.y - 0.12, xS = xSatz(schwelle);
    B.masskette(s, { x: xSatz(0), y: my, w: xSatz(saetze[n]) - xSatz(0), segmente: [
      // „am höchsten“ bezieht sich auf den Diagrammtitel (Zahlungsüberschuss). Der Wortlaut der Broschüre S. 12 („höchster Zahlungsüberschuss: C“)
      // ist 2,85 Zoll breit, das Segment bis zur Schwelle 2,28 Zoll: Er stieße an die Beschriftung des zweiten Segments.
      { anteil: schwelle, text: ctx.wortlaut('am höchsten: C', 'Maßkette') }, { anteil: saetze[n] - schwelle, text: ctx.wortlaut('am höchsten: A', 'Maßkette') }] });
    B.linie(s, { x: xS, y: my, h: d.yWert(bei('A', schwelle)) - my, art: 'mass', pt: 0.5, name: 'Maßhilfslinie Schwelle' });
    // Der Wert der Schwelle steht links der Maßhilfslinie: Rechts davon folgt nach gut einem halben Zoll die Marke der Jahresrechnung mit ihren Werten
    B.text(s, fmt.prozent(schwelle, 2), { x: xS - 0.08 - 0.80, y: band(60000) - 0.12, w: 0.80, h: 0.24, rolle: 'wert', align: 'right', valign: 'middle', einzeilig: true, name: 'Schwelle C gegen A' });

    // Marke beim Tilgungssatz der Jahresrechnung: Punkte auf den Linien, die drei Werte rechts der Marke, Bezeichnung unter der Achse
    const xM = xSatz(tJahr);
    B.marke(s, { x: xM, y: d.plot.y, h: d.plot.h, art: 'mass' });
    for (const g of G) B.punkt(s, { cx: xM, cy: d.yWert(bei(g, tJahr)), art: R.LINIEN[g].art, name: 'Punkt ' + g });
    B.wertzeilen(s, { x: xM + 0.10, mitten: [band(80000), band(60000), band(40000)], name: 'Jahresrechnung', eintraege: G.map(g => ({ kreis: g, text: fmt.zahl(bei(g, tJahr)) })) });
    // Bezeichnung der Marke im untersten Band rechts der Marke (unter der Achse steht der Achsentitel); das Modul prüft, dass dort keine Linie läuft
    const xText = xM + 0.08, wText = 1.90, tEnde = tJahr + (xText + wText - xM) / d.katBreite * saetze[1];
    R.pruefe(G.every(g => bei(g, Math.min(tEnde, saetze[n])) > ACHSE.min + ACHSE.schritt), 'Im untersten Band rechts der Marke läuft eine Linie durch die Bezeichnung „Jahresrechnung“; Lage im Modul der Folie 20 anpassen.');
    B.text(s, ctx.wortlaut(`Jahresrechnung: ${fmt.prozent(tJahr, 2)}`, 'Markentext'), { x: xText, y: band(ACHSE.min + ACHSE.schritt) - 0.10, w: wText, h: 0.20, rolle: 'achse', farbe: 'text', valign: 'middle', einzeilig: true, name: 'Markentext' });
    B.achsentitel(s, d, { y: ctx.wortlaut('Zahlungsüberschuss in € p. a.', 'Achsentitel'), x: ctx.wortlaut('Tilgungssatz p. a.', 'Achsentitel') });

    B.linienenden(s, { x: xSatz(saetze[n]) + 0.30, eintraege: G.map(g => ({ kreis: g, y: d.yWert(bei(g, saetze[n])) })) });

    // Kommentar: zuerst das Ergebnis beim Satz der Jahresrechnung (in allen drei Gruppen ein Zahlungsüberschuss, am höchsten in A), dann die Sätze,
    // bei denen er null wird (Übersicht 3.8), die Festlegung durch die NBank und zuletzt die Schwelle C gegen A wie in der Broschüre S. 12.
    // Die Zulassung von B und C steht auf den Folien 10 und 15.
    const nullBei = Object.fromEntries(G.map(g => [g, M(`liq.breakeven_tilgung.${g}`)]));
    R.pruefe(G.every(g => bei(g, tJahr) > 0) && bei('A', tJahr) > bei('B', tJahr) && bei('A', tJahr) > bei('C', tJahr),
      'Die Aussage „beim Satz der Jahresrechnung bleibt in allen drei Gruppen ein Zahlungsüberschuss, am höchsten in A“ trifft nicht mehr zu.');
    R.pruefe(tJahr < nullBei.C && nullBei.C < nullBei.B && nullBei.B < nullBei.A && nullBei.A <= saetze[n] && G.every(g => Math.abs(bei(g, nullBei[g])) < 0.5),
      'Die Sätze, bei denen der Zahlungsüberschuss null wird (Übersicht 3.8), liegen nicht mehr in der Reihenfolge C, B, A über dem Satz der Jahresrechnung und im Bereich der Achse.');
    const p2 = v => fmt.prozent(v, 2);
    B.planlegende(s, { platzhalter: 'kommentar', eintraege: [
      { text: `Bei ${p2(tJahr)} Tilgung bleibt in allen drei Gruppen ein Zahlungsüberschuss. Am höchsten ist er in A.` },
      { text: `Null wird er in C bei ${p2(nullBei.C)}, in B bei ${p2(nullBei.B)} und in A bei ${p2(nullBei.A)} Tilgung.` },
      // Untergrenze bei linearer Tilgung: 1 ÷ Höchstlaufzeit (RL Nr. 5.3.5); mit diesem Satz rechnet die Jahresrechnung
      { text: `Den Tilgungssatz legt die NBank fest. Linear über ${M('tab.laufzeit_hoechstens')} Jahre sind es rechnerisch mindestens ${p2(1 / M('tab.laufzeit_hoechstens'))}.` },
      { text: `Unter ${p2(schwelle)} läge C vorn, B in keinem Fall.` }].map(e => ({ text: ctx.wortlaut(e.text, 'Kommentar') })) });
  },
};
