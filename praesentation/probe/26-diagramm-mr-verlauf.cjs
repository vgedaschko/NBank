// Muster PGN_DIAGRAMM_MR: Linien über 35 Jahre aus den Zeitreihen der Mappe (W.reihe liefert Jahr 1 bis 35), Kategorien nur an
// ausgewählten Jahren beschriftet (katLabels.nur), senkrechte Marke aus der Kategorienmitte, Werte an den Linienenden.
'use strict';
module.exports = {
  id: 'p26-diagramm-mr-verlauf',
  o: { nr: '26', layout: 'PGN_DIAGRAMM_MR', titel: 'Ab Jahr 10 Zahlungsüberschuss in allen drei Einkommensgruppen',
    inhalt: 'Kicker: „IHRE RECHNUNG · LAUFZEIT“. Titelzeilen: „Ab Jahr 10 Zahlungsüberschuss“ | „in allen drei Einkommensgruppen“ (Signaturwort: „Ab Jahr 10“).' },
  bau(ctx) {
    const { B, D, W, fmt, colX, ZONE } = ctx, s = ctx.folie(), G = ['A', 'B', 'C'];
    B.register(s, '2.1');
    B.diagrammkopf(s, { titel: 'Zahlungsüberschuss Jahr 1 bis 35', sub: 'in € p. a. · Modellhaus, Gruppen A, B und C' });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Gruppe A', art: 'tinte', strich: 'solid' }, { text: 'Gruppe B', art: 'tinte', strich: 'dash' }, { text: 'Gruppe C', art: 'referenz', strich: 'solid' }] });
    const jahre = W.reihe('modellhaus_zeitreihe', 'zr.jahr'), reihe = g => W.reihe('modellhaus_zeitreihe', `zr.zahlungsueberschuss.${g}`);
    const d = D.linien(s, { kategorien: jahre, katLabels: { nur: [1, 5, 10, 15, 20, 25, 30, 35] }, rand: { r: 1.30 }, name: 'Diagramm Zahlungsüberschuss Jahr 1 bis 35',
      reihen: [{ name: 'Gruppe A', werte: reihe('A'), art: 'tinte' }, { name: 'Gruppe B', werte: reihe('B'), art: 'tinte', strich: 'dash' }, { name: 'Gruppe C', werte: reihe('C'), art: 'referenz' }],
      achse: { min: -40000, max: 120000, schritt: 20000, format: 'ganz' } });
    const n = jahre.length - 1, enden = B.entzerre(G.map(g => d.yWert(reihe(g)[n])), 0.30);
    G.forEach((g, i) => {
      B.achskreis(s, { cx: d.katMitte(n) + 0.26, cy: enden[i], groesse: 'S', text: g });
      B.text(s, fmt.zahl(reihe(g)[n]), { x: d.katMitte(n) + 0.46, y: enden[i] - 0.12, w: 0.85, h: 0.24, rolle: 'wert', valign: 'middle', einzeilig: true, name: 'Endwert ' + g });
    });
    B.marke(s, { x: d.katMitte(9), y: d.plot.y, h: d.plot.h, art: 'mass', text: 'Jahr 10', textSeite: 'rechts', textBreite: 1.0 });
    B.planlegende(s, { platzhalter: 'kommentar', pt: 14, eintraege: [
      { titel: 'Jahre 1 bis 9', text: 'B und C schließen in dieser Rechnung mit einem Fehlbetrag.' },
      { titel: 'Mieterhöhung', text: `Erstmals nach ${W('modellhaus', 'tab.jahre_ohne_mieterhoehung')} Jahren, dann höchstens ${fmt.prozent(W('modellhaus', 'tab.mieterhoehung_in_der_bindung'), 2)} in drei Jahren.` }] });
  },
};
