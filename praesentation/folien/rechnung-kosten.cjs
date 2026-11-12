// Folie 23 · PGN_DIAGRAMM_MR mit freier Lage des Diagramms: Zahlungsüberschuss in Jahr 1 (Gruppe A) bei drei Herstellungskosten je m²
// als Säulen in Tinte, passgenau darunter ein Rechenblatt mit drei Wertspalten; die Spalte des Modellhauses ist vom Diagramm bis zur
// Tabelle weiß hinterlegt. Die Zeilen 4 und 5 der Tabelle nennen den Zahlungsüberschuss in B und C: So steht das Ergebnis aller drei
// Gruppen auf der Folie. Kein Rot im Diagramm.
// Zahlen aus drei Läufen von werte.json: Modellhaus (3.579 € je m², der PGN-Median), ARGE-Median (4.631 €) und
// Bemessungsgrenze (5.460 € seit 01.10.2026); die Herkunft der Werte 3.579 € und 4.631 € als Text aus daten/rechnung.json.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'rechnung-kosten',
  bau(ctx) {
    const { B, D, W, X, fmt, colX, span, farben } = ctx, s = ctx.folie();
    B.register(s, '2.1');
    const laeufe = R.KOSTENLAEUFE, L = k => laeufe.map(l => W(l, k)), iModell = laeufe.indexOf('modellhaus');
    const kosten = L('eingabe.herstellungskosten_qm'), kopf = kosten.map(v => fmt.euro(v)), grenze = W('modellhaus', 'fin.bemessungsgrenze_qm');
    // Die drei Läufe: Modellhaus, ARGE-Median der Folie 22, Bemessungsgrenze. Bis dorthin sind die Kosten voll zuwendungsfähig,
    // kein Lauf braucht ein Bankdarlehen, und die Förderquote auf die Gesamtkosten bleibt gleich.
    R.pruefe(iModell === 0 && kosten[0] < kosten[1] && kosten[1] < kosten[2] && kosten[2] === grenze, 'Die drei Läufe der Folie 23 sind nicht mehr Modellhaus, ein Wert darüber und die Bemessungsgrenze.');
    ctx.gleich('Zweiter Lauf der Folie 23 gegen den ARGE-Median der Folie 22', kosten[1], X('markt', 'kosten.arge.spanne_herstellung.median'), 0);
    ctx.gleich('Modellhaus gegen den PGN-Median der Folie 22', kosten[0], X('markt', 'kosten.pgn.spanne_herstellung.median'), 0);
    R.pruefe(new Set(L('eingabe.grundstueck')).size === 1 && new Set(L('fin.bemessungsgrenze_qm')).size === 1, 'Grundstück oder Bemessungsgrenze unterscheiden sich zwischen den drei Läufen der Folie 23.');
    const quote = L('fin.foerderquote.A');
    R.pruefe(L('fin.ueber_bemessungsgrenze.A').every(v => v === 0) && L('fin.bankdarlehen.A').every(v => v === 0) && quote.every(v => Math.abs(v - quote[0]) < 1e-9),
      'Ein Lauf der Folie 23 liegt über der Bemessungsgrenze, trägt ein Bankdarlehen oder hat eine andere Förderquote; Tabelle und Kommentar anpassen.');
    // Aussage des Titels: Beim ARGE-Median bleibt nur in A ein Zahlungsüberschuss, an der Bemessungsgrenze auch in A nicht mehr. Der Titel nennt
    // die Kosten, bis zu denen sich A trägt (linear zwischen Modellhaus und Bemessungsgrenze, auf 50 € abgerundet), und den Wert des Modellhauses
    const ueberschuss = L('jr1.zahlungsueberschuss.A'), inB = L('jr1.zahlungsueberschuss.B'), inC = L('jr1.zahlungsueberschuss.C');
    R.pruefe(ueberschuss[0] > 0 && ueberschuss[1] > 0 && ueberschuss[2] < 0 && inB[0] > 0 && inC[0] > 0 && [1, 2].every(i => inB[i] < 0 && inC[i] < 0),
      'Die Aussage „beim ARGE-Median trägt sich nur noch A, an der Bemessungsgrenze keine Gruppe“ trifft nicht mehr zu; Titel und Tabelle der Folie 23 anpassen.');
    const kNull = kosten[0] + ueberschuss[0] * (kosten[2] - kosten[0]) / (ueberschuss[0] - ueberschuss[2]), kRund = Math.floor(kNull / 50) * 50;
    R.pruefe(ctx.glatt(ctx.o.titel) === ctx.glatt(`Bis rund ${fmt.euro(kRund)} je m² trägt sich Gruppe A, im Modellhaus bleiben ${fmt.euro(ueberschuss[0])}`),
      `Der Titel der Folie 23 nennt nicht die Kosten, bis zu denen sich Gruppe A trägt (${fmt.euro(kRund)}), und den Zahlungsüberschuss im Modellhaus.`);
    B.diagrammkopf(s, { titel: 'Zahlungsüberschuss Jahr 1, Gruppe A', sub: 'in € p. a. · nach Herstellungskosten je m² Wohnfläche' });

    // Säulen genau über den drei Wertspalten der Tabelle; die Köpfe der Tabelle sind die Kategorien des Diagramms. Die Tabelle hat fünf Zeilen
    // und endet an der Unterkante der Inhaltszone; das Diagramm ist entsprechend niedriger. Diagramm und Tabelle stehen in den sieben Spalten
    // links (Muster 2): Wertspalten je 1,27 Zoll, die Position behält ihre Zeile („Nötige Miete je m², Gruppe A“ mit gut 5 % Luft)
    const wb = 1.27, tx = colX(1), tw = span(7), plotX = tx + tw - laeufe.length * wb, xM = plotX + iModell * wb, yD = 2.72, yT = 4.48, hD = yT - yD;
    const ACHSE = { min: -5000, max: 20000, schritt: 5000, format: 'ganz' };
    R.pruefe(Math.max(...ueberschuss) < ACHSE.max && Math.min(...ueberschuss) > ACHSE.min, 'Ein Wert der Folie 23 liegt über der Größenachse; Achse im Modul anpassen.');
    B.kasten(s, { x: xM, y: yD, w: wb, h: yT - yD, farbe: farben.hervor, name: 'Spalte Modellhaus' });
    // Bezeichnung der Spalte gemischt gesetzt (Work Sans SemiBold 12 pt wie die Bezeichnungen an Diagrammen): In Versalien ist das Wort breiter als die Spalte
    B.text(s, 'Modellhaus', { x: xM, y: yD + 0.05, w: wb - 0.08, h: 0.22, rolle: 'bezeichnung', align: 'right', valign: 'middle', einzeilig: true, name: 'Spaltentitel Modellhaus' });
    const d = D.saeulen(s, { x: tx, y: yD, w: tw, h: hD, kategorien: kopf.map((k, i) => (i === iModell ? `${k} (Modellhaus)` : k)), werte: ueberschuss, art: 'tinte', reihenname: 'Zahlungsüberschuss Jahr 1', labels: false,
      achse: ACHSE, rand: { l: plotX - tx, r: 0, o: 0.36, u: 0.24 }, katAchse: false, luecke: 150, name: 'Diagramm Zahlungsüberschuss nach Herstellungskosten' });
    // Der Titel der Größenachse steht direkt links der Achsbeschriftung: Die Plotfläche beginnt erst über den Wertspalten der Tabelle
    B.achsentitel(s, d, { y: ctx.wortlaut('€ p. a.', 'Achsentitel'), yVersatz: plotX - tx - 0.86 });
    // Werte an den Säulen als Text auf einer Fläche in der Farbe des Feldes: Die Datenbeschriftung des Diagramms stünde auf den Gitterlinien
    ueberschuss.forEach((v, i) => B.textAufPlot(s, fmt.zahl(v), { x: d.katMitte(i) - 0.50, y: d.yWert(Math.max(v, 0)) - 0.25, w: 1.00, h: 0.22, rolle: 'wert', align: 'center', valign: 'middle',
      grund: i === iModell ? farben.hervor : undefined, name: 'Wert ' + kopf[i] }));
    // Die Kategorien des Diagramms tragen die Tabellenköpfe darunter (katAchse: false schaltet die Achsbeschriftung ab)
    const zeile = (nr, text, werte) => ({ nr, text: ctx.wortlaut(text, `Tabelle, Zeile ${nr}`), werte });
    B.rechenblatt(s, { x: tx, y: yT, w: tw, dicht: true, wertBreite: wb, hervor: iModell, name: 'Rechenblatt Szenarien', kopf: ['je m² Wohnfläche', ...kopf], zeilen: [
      zeile(1, 'Gesamtkosten', L('fin.gesamtkosten.A').map(v => fmt.mio(v, 2))),
      zeile(2, `Förderung, ${R.prozentKurz(fmt, quote[0])} der Kosten`, L('fin.foerderung.A').map(v => fmt.mio(v, 2))),
      zeile(3, 'Nötige Miete je m², Gruppe A', L('dscr.noetige_miete.A').map(v => fmt.euroDez(v))),
      zeile(4, 'Zahlungsüberschuss in B', inB.map(v => fmt.euro(v))),
      zeile(5, 'Zahlungsüberschuss in C', inC.map(v => fmt.euro(v)))] });

    // Kommentar: zuerst, was die höheren Kosten am Zahlungsüberschuss ändern (je 100 € Herstellungskosten je m²; der Zusammenhang ist linear,
    // das Modul prüft es am mittleren Lauf), dann die Herkunft der drei Werte. titelAbstand 4 pt: vier Einträge füllen die Spalte.
    const je100 = (ueberschuss[0] - ueberschuss[2]) / (kosten[2] - kosten[0]) * 100;
    ctx.gleich('Rückgang des Zahlungsüberschusses je 100 € Herstellungskosten, am mittleren Lauf', (ueberschuss[0] - ueberschuss[1]) / (kosten[1] - kosten[0]) * 100, je100, 2);
    B.planlegende(s, { platzhalter: 'kommentar', pt: 14, titelAbstand: 4, eintraege: [
      // „Je 100 €“ und „in A“ bleiben zusammen (geschützte Leerzeichen): Sonst stünde „Je“ allein am Zeilenende und „A“ allein am Zeilenanfang
      { titel: 'Szenarien', text: ctx.wortlaut(`Nur die Herstellungskosten sind geändert. Je\u00A0100 € je m² mehr sinkt der Zahlungsüberschuss in\u00A0A um ${fmt.euro(je100)}.`, 'Szenarien') },
      { titel: `${kopf[0]} je m²`, text: ctx.wortlaut(X('rechnung', 'kosten_pgn.beschreibung'), 'PGN-Median') },
      { titel: `${kopf[1]} je m²`, text: ctx.wortlaut(X('rechnung', 'kosten_arge.beschreibung'), 'ARGE-Median') },
      { titel: `${kopf[2]} je m²`, text: ctx.wortlaut(`Bemessungsgrenze in Mietenstufe ${R.mietenstufeKlasse(W('modellhaus', 'eingabe.mietenstufe'))} seit ${ctx.X('regeln', 'bemessungsgrenze.gilt_seit')}. Bis hierher bleibt die Förderquote bei ${R.prozentKurz(fmt, quote[0])}.`, 'Bemessungsgrenze') }] });
  },
};
