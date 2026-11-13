// Folie 23 · PGN_DIAGRAMM_MR mit freier Lage des Diagramms: Zahlungsüberschuss in Jahr 1 (Gruppe A) bei drei Herstellungskosten je m²
// als Säulen in Tinte, passgenau darunter ein Rechenblatt mit drei Wertspalten; die Spalte des Modellhauses ist vom Diagramm bis zur
// Tabelle weiß hinterlegt. Die Zeilen 4 und 5 der Tabelle nennen den Zahlungsüberschuss in B und C: So steht das Ergebnis aller drei
// Gruppen auf der Folie. Kein Rot im Diagramm.
// Zahlen aus drei Läufen von werte.json: Modellhaus (3.579 € je m², der PGN-Median), ARGE-Median (4.631 €) und
// Bemessungsgrenze (5.460 € seit 01.10.2026).
// Seit der Änderungsrunde vom 13.11.2026 (F23.1 bis F23.3): Die Köpfe der drei Wertspalten nennen über den Beträgen „Modellhaus“, „ARGE-Median“
// und „Bemessungs-/grenze“ (zweizeilig); Zeile 3 heißt „Kostendeckende Anfangsmiete je m², Gruppe A“ (zweizeilig, die übrigen Zeilen enger);
// rechts Stichpunkte in 14 pt (G9) unter „Ergebnis“ und „Annahme“ mit den Kosten, bis zu denen A, B und C einen Zahlungsüberschuss haben
// (aus den Läufen gerechnet, auf 10 € abgerundet). Die Erklärung der drei Spalten rechts ist entfallen, ebenso die Bezeichnung „Modellhaus“ über
// der weißen Spalte: Sie steht jetzt im Kopf der Tabelle. Tabelle und Diagramm sind dafür niedriger.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'rechnung-kosten',
  bau(ctx) {
    const { B, D, W, X, fmt, colX, span, farben } = ctx, s = ctx.folie(), wl = (t, was) => ctx.wortlaut(t, was);
    B.register(s, '2.1');
    const laeufe = R.KOSTENLAEUFE, L = k => laeufe.map(l => W(l, k)), iModell = laeufe.indexOf('modellhaus'), G3 = R.G;
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
    // die Kosten, bis zu denen sich A trägt, und den Wert des Modellhauses
    const ueberschuss = L('jr1.zahlungsueberschuss.A'), inB = L('jr1.zahlungsueberschuss.B'), inC = L('jr1.zahlungsueberschuss.C');
    R.pruefe(ueberschuss[0] > 0 && ueberschuss[1] > 0 && ueberschuss[2] < 0 && inB[0] > 0 && inC[0] > 0 && [1, 2].every(i => inB[i] < 0 && inC[i] < 0),
      'Die Aussage „beim ARGE-Median trägt sich nur noch A, an der Bemessungsgrenze keine Gruppe“ trifft nicht mehr zu; Titel und Tabelle der Folie 23 anpassen.');
    // Kosten je m², bis zu denen eine Gruppe in Jahr 1 einen Zahlungsüberschuss hat (R.kostenSchwelle: Nullstelle zwischen Modellhaus und
    // Bemessungsgrenze, einheitlich auf 10 € abgerundet; bis 13.11.2026 stand der Titel auf 50 € abgerundet, beides ergibt für A 5.150 €)
    const schwelle = Object.fromEntries(G3.map(g => [g, R.kostenSchwelle(ctx, g).rund]));
    R.pruefe(ctx.glatt(ctx.o.titel) === ctx.glatt(`Bis rund ${fmt.euro(schwelle.A)} je m² trägt sich Gruppe A, im Modellhaus bleiben ${fmt.euro(ueberschuss[0])}`),
      `Der Titel der Folie 23 nennt nicht die Kosten, bis zu denen sich Gruppe A trägt (${fmt.euro(schwelle.A)}), und den Zahlungsüberschuss im Modellhaus.`);
    B.diagrammkopf(s, { titel: 'Zahlungsüberschuss Jahr 1, Gruppe A', sub: 'in € p. a. · nach Herstellungskosten je m² Wohnfläche' });

    // Säulen genau über den drei Wertspalten der Tabelle; die Köpfe der Tabelle sind die Kategorien des Diagramms. Die Tabelle hat fünf Zeilen
    // und endet an der Unterkante der Inhaltszone; das Diagramm ist entsprechend niedriger. Diagramm und Tabelle stehen in den sieben Spalten
    // links (Muster 2): Wertspalten je 1,27 Zoll. Seit 13.11.2026 ist der Kopf dreizeilig (Name über dem Betrag, „Bemessungs-/grenze“ in zwei
    // Zeilen) und Zeile 3 zweizeilig; die übrigen Zeilen sind 0,31 statt 0,34 hoch (12 pt bleibt), das Diagramm beginnt auf derselben Höhe
    const wb = 1.27, tx = colX(1), tw = span(7), plotX = tx + tw - laeufe.length * wb, xM = plotX + iModell * wb, yD = 2.72, yT = 4.25, hD = yT - yD;
    const ACHSE = { min: -5000, max: 20000, schritt: 5000, format: 'ganz' };
    R.pruefe(Math.max(...ueberschuss) < ACHSE.max && Math.min(...ueberschuss) > ACHSE.min, 'Ein Wert der Folie 23 liegt über der Größenachse; Achse im Modul anpassen.');
    B.kasten(s, { x: xM, y: yD, w: wb, h: yT - yD, farbe: farben.hervor, name: 'Spalte Modellhaus' });
    const d = D.saeulen(s, { x: tx, y: yD, w: tw, h: hD, kategorien: kopf.map((k, i) => (i === iModell ? `${k} (Modellhaus)` : k)), werte: ueberschuss, art: 'tinte', reihenname: 'Zahlungsüberschuss Jahr 1', labels: false,
      achse: ACHSE, rand: { l: plotX - tx, r: 0, o: 0.30, u: 0.24 }, katAchse: false, luecke: 150, name: 'Diagramm Zahlungsüberschuss nach Herstellungskosten' });
    // Der Titel der Größenachse steht direkt links der Achsbeschriftung: Die Plotfläche beginnt erst über den Wertspalten der Tabelle
    B.achsentitel(s, d, { y: ctx.wortlaut('€ p. a.', 'Achsentitel'), yVersatz: plotX - tx - 0.86 });
    // Werte an den Säulen als Text auf einer Fläche in der Farbe des Feldes: Die Datenbeschriftung des Diagramms stünde auf den Gitterlinien
    ueberschuss.forEach((v, i) => B.textAufPlot(s, fmt.zahl(v), { x: d.katMitte(i) - 0.50, y: d.yWert(Math.max(v, 0)) - 0.25, w: 1.00, h: 0.22, rolle: 'wert', align: 'center', valign: 'middle',
      grund: i === iModell ? farben.hervor : undefined, name: 'Wert ' + kopf[i] }));
    // Die Kategorien des Diagramms tragen die Tabellenköpfe darunter (katAchse: false schaltet die Achsbeschriftung ab)
    const zeile = (nr, text, werte) => ({ nr, text: ctx.wortlaut(text, `Tabelle, Zeile ${nr}`), werte });
    // Köpfe der Wertspalten: Name über dem Betrag (F23.1). Die Namen stehen gemischt in Work Sans SemiBold 12 pt (Rolle „bezeichnung“, wie bis
    // 13.11.2026 „Modellhaus“ über der weißen Spalte): In den Versalien des Tabellenkopfs ist jeder Name breiter als die Spalte. „Bemessungsgrenze“
    // steht auch gemischt in zwei Zeilen („Bemessungs-/grenze“, Entscheidung zu Rückfrage 23). Der Kopf hat dafür drei Zeilen; die Namen stehen als
    // Textfelder über dem Betrag, unten bündig; die erste Zeile von „Bemessungs-/grenze“ reicht in den leeren unteren Rand des Diagramms
    const namen = [[wl('Modellhaus', 'Spaltenkopf')], [wl('ARGE-Median', 'Spaltenkopf')], ['Bemessungs-', 'grenze']];
    wl('Bemessungs-/grenze', 'Spaltenkopf');
    const t = B.rechenblatt(s, { x: tx, y: yT, w: tw, dicht: true, zeilenH: 0.31, wertBreite: wb, hervor: iModell, name: 'Rechenblatt Szenarien',
      kopf: ['je m² Wohnfläche', ...kopf.map(k => `\n${k}`)], zeilen: [
      zeile(1, 'Gesamtkosten', L('fin.gesamtkosten.A').map(v => fmt.mio(v, 2))),
      zeile(2, `Förderung, ${R.prozentKurz(fmt, quote[0])} der Kosten`, L('fin.foerderung.A').map(v => fmt.mio(v, 2))),
      zeile(3, 'Kostendeckende Anfangsmiete je m², Gruppe A', L('dscr.noetige_miete.A').map(v => fmt.euroDez(v))),
      zeile(4, 'Zahlungsüberschuss in B', inB.map(v => fmt.euro(v))),
      zeile(5, 'Zahlungsüberschuss in C', inC.map(v => fmt.euro(v)))] });

    // Namen über den Beträgen: unten bündig eine Zeile (0,20) über dem Betrag, rechtsbündig mit dem rechten Zellrand der Tabelle (0,08). Zwei Zeilen
    // brauchen 0,47 Zoll (mit Luft) und reichen über die Oberkante des Kopfs in den leeren unteren Rand des Diagramms (0,24; dort steht nichts)
    namen.forEach((zeilen, i) => { const sp = t.spalten[i], h = +(0.235 * zeilen.length).toFixed(3);
      B.text(s, zeilen.join('\n'), { x: sp.x + 0.04, y: +(yT + t.kopfH - 0.04 - 0.20 - h).toFixed(3), w: sp.w - 0.12, h, rolle: 'bezeichnung', align: 'right', valign: 'bottom', name: `Spaltenkopf ${zeilen.join('')}` }); });
    R.pruefe(Math.abs(t.unten - ctx.Y.inhaltEnde) < 0.011, `Folie 23: Die Tabelle endet bei ${t.unten.toFixed(2)} Zoll, nicht an der Unterkante der Inhaltszone.`);

    // Stichpunkte unter „Ergebnis“ und „Annahme“ (F23.2, G9; bis 13.11.2026 eine Planlegende mit der Erklärung der drei Spalten): zuerst, was die
    // höheren Kosten am Zahlungsüberschuss ändern (je 100 € Herstellungskosten je m²; der Zusammenhang ist linear, das Modul prüft es am mittleren
    // Lauf), dann die Kosten, bis zu denen A, B und C einen Zahlungsüberschuss haben (oben gerechnet)
    const je100 = (ueberschuss[0] - ueberschuss[2]) / (kosten[2] - kosten[0]) * 100;
    ctx.gleich('Rückgang des Zahlungsüberschusses je 100 € Herstellungskosten, am mittleren Lauf', (ueberschuss[0] - ueberschuss[1]) / (kosten[1] - kosten[0]) * 100, je100, 2);
    const bis = g => `bis rund ${fmt.euro(schwelle[g])} je m²`, sp = t => ctx.wortlaut(t, 'Stichpunkt');
    B.stichpunkte(s, { platzhalter: 'kommentar', gruppen: [
      { titel: wl('Ergebnis', 'Überschrift'), punkte: [
        // „je 100 €“ und „in A“ bleiben zusammen (geschützte Leerzeichen): Sonst stünde „je“ allein am Zeilenende und „A“ allein am Zeilenanfang
        sp(`je\u00A0100 € je m² mehr sinkt der Zahlungsüberschuss in\u00A0A um ${fmt.euro(je100)}`),
        sp(`A hat einen Zahlungsüberschuss ${bis('A')}`),
        // weicher Umbruch nach „B …,“: Sonst stünde „je m²“ allein in der letzten Zeile
        sp(`B ${bis('B')}, C ${bis('C')}`).replace('m², C', 'm², \nC')] },
      { titel: wl('Annahme', 'Überschrift'), punkte: [sp('nur die Herstellungskosten sind geändert')] }] });
  },
};
