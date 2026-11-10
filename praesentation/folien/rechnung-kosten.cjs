// Folie 14 · PGN_DIAGRAMM_MR mit freier Lage des Diagramms: Zahlungsüberschuss in Jahr 1 (Gruppe A) bei drei Herstellungskosten je m²
// als Säulen in Tinte mit kräftiger Nulllinie, passgenau darunter ein Rechenblatt mit drei Wertspalten; die Spalte des Modellhauses ist
// vom Diagramm bis zur Tabelle weiß hinterlegt. Kein Rot im Diagramm.
// Zahlen aus drei Läufen von werte.json (3.579, 4.500 und 5.200 € je m²); die Herkunft des Werts 3.579 € als Text aus daten/rechnung.json.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'rechnung-kosten',
  bau(ctx) {
    const { B, D, W, X, fmt, colX, span, farben } = ctx, s = ctx.folie();
    B.register(s, '2.1');
    const laeufe = R.KOSTENLAEUFE, L = k => laeufe.map(l => W(l, k)), iModell = laeufe.indexOf('modellhaus');
    const kosten = L('eingabe.herstellungskosten_qm'), kopf = kosten.map(v => fmt.euro(v)), grenze = W('modellhaus', 'fin.bemessungsgrenze_qm'), ueber = L('fin.ueber_bemessungsgrenze.A');
    R.pruefe(kosten[0] < kosten[1] && kosten[1] < grenze && grenze < kosten[2] && ueber[0] === 0 && ueber[1] === 0 && ueber[2] > 0, 'Die drei Läufe der Folie 14 liegen nicht mehr unter, unter und über der Bemessungsgrenze.');
    R.pruefe(new Set(L('eingabe.grundstueck')).size === 1 && new Set(L('fin.bemessungsgrenze_qm')).size === 1, 'Grundstück oder Bemessungsgrenze unterscheiden sich zwischen den drei Läufen der Folie 14.');
    // Über der Bemessungsgrenze finanziert die Mappe die nicht zuwendungsfähigen Kosten über ein Bankdarlehen; die beiden anderen Läufe haben keins.
    // An dieser Annahme hängen Zahlungsüberschuss und nötige Miete der Spalte 5.200 €; die Folie nennt sie deshalb.
    const bank = L('fin.bankdarlehen.A');
    R.pruefe(bank[0] === 0 && bank[1] === 0 && Math.abs(bank[2] - ueber[2]) < 0.5, 'Das Bankdarlehen des Laufs über der Bemessungsgrenze ist nicht gleich den nicht zuwendungsfähigen Kosten, oder ein anderer Lauf der Folie 14 trägt ein Bankdarlehen.');
    const ueberschuss = L('jr1.zahlungsueberschuss.A');
    B.diagrammkopf(s, { titel: 'Zahlungsüberschuss Jahr 1, Gruppe A', sub: 'in € p. a. · nach Herstellungskosten je m² Wohnfläche' });

    // Säulen genau über den drei Wertspalten der Tabelle; die Köpfe der Tabelle sind die Kategorien des Diagramms
    const wb = 1.48, tx = colX(1), tw = span(8), plotX = tx + tw - laeufe.length * wb, xM = plotX + iModell * wb, yD = 2.72, yT = 4.84, hD = yT - yD;
    B.kasten(s, { x: xM, y: yD, w: wb, h: yT - yD, farbe: farben.hervor, name: 'Spalte Modellhaus' });
    B.text(s, 'Modellhaus', { x: xM, y: yD + 0.05, w: wb - 0.08, h: 0.22, rolle: 'tabellenkopf', align: 'right', valign: 'middle', einzeilig: true, name: 'Spaltentitel Modellhaus' });
    const d = D.saeulen(s, { x: tx, y: yD, w: tw, h: hD, kategorien: kopf.map((k, i) => (i === iModell ? `${k} (Modellhaus)` : k)), werte: ueberschuss, art: 'tinte', reihenname: 'Zahlungsüberschuss Jahr 1', labels: false,
      achse: { min: -30000, max: 20000, schritt: 10000, format: 'ganz' }, rand: { l: plotX - tx, r: 0, o: 0.36, u: 0.24 }, katAchse: false, luecke: 150, name: 'Diagramm Zahlungsüberschuss nach Herstellungskosten' });
    // Werte an den Säulen als Text auf einer Fläche in der Farbe des Feldes: Die Datenbeschriftung des Diagramms stünde auf den Gitterlinien
    ueberschuss.forEach((v, i) => B.textAufPlot(s, fmt.zahl(v), { x: d.katMitte(i) - 0.50, y: v < 0 ? d.yWert(v) + 0.03 : d.yWert(v) - 0.25, w: 1.00, h: 0.22, rolle: 'wert', align: 'center', valign: 'middle',
      grund: i === iModell ? farben.hervor : undefined, name: 'Wert ' + kopf[i] }));
    // Die Kategorien des Diagramms tragen die Tabellenköpfe darunter (katAchse: false schaltet die Achsbeschriftung ab)
    B.rechenblatt(s, { x: tx, y: yT, w: tw, dicht: true, wertBreite: wb, hervor: iModell, name: 'Rechenblatt Szenarien', kopf: ['je m² Wohnfläche', ...kopf], zeilen: [
      { nr: 1, text: 'Gesamtkosten', werte: L('fin.gesamtkosten.A').map(v => fmt.mio(v, 2)) },
      { nr: 2, text: 'Förderung, Höchstsätze', werte: L('fin.foerderung.A').map(v => fmt.mio(v, 2)) },
      { nr: 3, text: 'Förderquote auf die Gesamtkosten', werte: L('fin.foerderquote.A').map(v => R.prozentKurz(fmt, v)) },
      { nr: 4, text: 'Nötige Miete je m², Gruppe A', werte: L('dscr.noetige_miete.A').map(v => fmt.euroDez(v)) }] });

    // titelAbstand 4 pt: Mit dem Satz zum Bankdarlehen füllt die Spalte ihr Feld; mit 10 pt vor den Zwischentiteln bliebe keine Luft, so sind es gut 5 %
    B.planlegende(s, { platzhalter: 'kommentar', pt: 14, titelAbstand: 4, eintraege: [
      { titel: 'Szenarien', text: ctx.wortlaut(`Geändert sind nur die Herstellungskosten. Grundstück ${fmt.euro(W('modellhaus', 'eingabe.grundstueck'))}, Mieten und Annahmen wie im Modellhaus.`, 'Szenarien') },
      { titel: `${kopf[0]} je m²`, text: ctx.wortlaut(X('rechnung', 'kosten_pgn.beschreibung'), 'PGN-Median') },
      { titel: `${kopf[2]} je m²`, text: ctx.wortlaut(`${fmt.euro(kosten[2] - grenze)} über dem Ausgangswert der Bemessungsgrenze von ${fmt.euro(grenze)}. ${fmt.mio(ueber[2], 2)} sind nicht zuwendungsfähig; ` +
        `gerechnet mit einem Bankdarlehen zu ${fmt.prozent(W(laeufe[2], 'eingabe.zins_bank'), 2)} Zins.`, 'über der Bemessungsgrenze') }] });
  },
};
