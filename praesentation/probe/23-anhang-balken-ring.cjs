// Muster PGN_ANHANG: gruppierte Balken (waagerecht) in den Gruppentönen A, B, C mit Werten am Balkenende, Legende mit Achskreisen;
// rechts ein Ringdiagramm mit direkter Beschriftung. Werte aus einer Datendatei mit Herkunft (hier daten/probe.json).
'use strict';
module.exports = {
  id: 'p23-anhang-balken-ring',
  o: { nr: 'A2', layout: 'PGN_ANHANG', titel: 'Grundsatz Gruppe A, B und C nur mit Zulassung', inhalt: 'Kicker: „ANHANG · MIETERKREIS“.' },
  bau(ctx) {
    const { B, D, X, fmt, colX, span, Y } = ctx, s = ctx.folie(), G = ['A', 'B', 'C'];
    const y0 = Y.anhangInhalt;
    B.modulkopf(s, { x: colX(1), y: y0, w: span(8), titel: 'Obergrenze Gesamtjahreseinkommen', sub: 'in €, gültig seit 01.03.2025' });
    const texte = ['bis zur Einkommensgrenze', 'bis 40 % darüber', 'bis 60 % darüber'];
    G.forEach((g, i) => {
      const x = colX(1) + i * 2.60;
      B.achskreis(s, { cx: x + 0.13, cy: y0 + 0.86, d: 0.26, pt: 10, text: g, variante: 'gruppe' });
      B.text(s, texte[i], { x: x + 0.34, y: y0 + 0.74, w: 2.2, h: 0.24, rolle: 'legende', valign: 'middle', einzeilig: true, name: 'Legende Gruppe ' + g });
    });
    D.gruppierteBalken(s, { x: colX(1), y: y0 + 1.06, w: span(8), h: 3.94, kategorien: X('probe', 'einkommensgrenze.haushalte'), katBreite: 2.05, name: 'Diagramm Einkommensgrenzen',
      reihen: G.map(g => ({ name: 'Gruppe ' + g, art: g, werte: X('probe', 'einkommensgrenze.' + g) })), achse: { min: 0, max: 80000, schritt: 20000, format: 'ganz' }, rand: { r: 0.30 }, luecke: 45 });
    B.modulkopf(s, { x: colX(9), y: y0, w: span(4), titel: 'Bedarfslage', sub: 'Einheits- und Samtgemeinden' });
    const a = X('probe', 'bedarf.gegeben'), b = X('probe', 'bedarf.nachweis');
    const r = D.ring(s, { x: colX(9) + 0.52, y: y0 + 0.80, w: 2.80, h: 2.80, segmente: [{ name: 'Bedarf gegeben', wert: a, art: 'tinte' }, { name: 'Bedarf gesondert nachweisen', wert: b, art: 'referenz' }], name: 'Ringdiagramm Bedarfslage' });
    B.text(s, fmt.zahl(a + b), { x: r.cx - 0.6, y: r.cy - 0.24, w: 1.2, h: 0.36, rolle: 'kernwert', align: 'center', valign: 'middle', einzeilig: true, name: 'Ring Summe' });
    B.text(s, 'Gemeinden', { x: r.cx - 0.6, y: r.cy + 0.10, w: 1.2, h: 0.20, rolle: 'label', align: 'center', valign: 'middle', einzeilig: true, name: 'Ring Bezeichnung' });
    B.legende(s, { x: colX(9), y: y0 + 3.72, eintraege: [{ text: `${fmt.zahl(a)} Bedarf gegeben`, art: 'tinte' }] });
    B.legende(s, { x: colX(9), y: y0 + 4.00, eintraege: [{ text: `${fmt.zahl(b)} Bedarf gesondert nachweisen`, art: 'referenz' }] });
    B.text(s, 'In beiden Fällen nötig: die einfache Bedarfsbestätigung der Wohnraumförderstelle zum Bauort.', { x: colX(9), y: y0 + 4.34, w: span(4), h: 0.66, rolle: 'kleinText', name: 'Zeile unter dem Ring' });
  },
};
