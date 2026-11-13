// Folie A4 · PGN_ANHANG: Obergrenzen des Gesamtjahreseinkommens für vier Haushaltstypen als gruppierte Balken in den Gruppentönen A, B, C
// (Broschüre S. 6), rechts die Zulassung von B und C und der Nachweis als Stichpunkte in 14 pt (Broschüre S. 12 und 6). Alle Werte aus
// daten/regeln.json. Kein Rot im Diagramm.
'use strict';
module.exports = {
  id: 'anhang-mieterkreis',
  bau(ctx) {
    const { B, D, X, fmt, colX, span, Y } = ctx, s = ctx.folie(), G = ['A', 'B', 'C'];
    const R = k => X('regeln', k), y0 = Y.anhangInhalt;

    // ---- Diagramm über acht Spalten -----------------------------------------------------------------------------
    B.modulkopf(s, { x: colX(1), y: y0, w: span(8), titel: 'Obergrenze Gesamtjahreseinkommen', sub: `in €, gültig seit ${R('einkommensgrenze.gueltig_seit')}` });
    const legende = { A: 'bis zur Einkommensgrenze', B: `bis ${fmt.prozent(R('einkommensgrenze.zuschlag_B'))} darüber`, C: `bis ${fmt.prozent(R('einkommensgrenze.zuschlag_C'))} darüber` };
    // Die Einträge folgen im Abstand von 0,20 Zoll auf den Text des Vorgängers (wie B.legende), nicht in festem Schritt: gleiche Lücken
    let xL = colX(1);
    for (const g of G) {
      const tb = ctx.P.zeile('Legende Gruppe ' + g, B.schutz(legende[g]), B.stil('legende'), 3.0) + 0.04;
      B.achskreis(s, { cx: xL + 0.13, cy: y0 + 0.86, d: 0.26, pt: 10, text: g, variante: 'gruppe' });
      B.text(s, legende[g], { x: xL + 0.34, y: y0 + 0.74, w: tb, h: 0.24, rolle: 'legende', valign: 'middle', einzeilig: true, name: 'Legende Gruppe ' + g });
      xL += 0.34 + tb + 0.20;
    }
    const d = D.gruppierteBalken(s, { x: colX(1), y: y0 + 1.06, w: span(8), h: 3.94, kategorien: R('einkommensgrenze.haushalte'), katBreite: 2.05, name: 'Diagramm Einkommensgrenzen',
      reihen: G.map(g => ({ name: 'Gruppe ' + g, art: g, werte: R('einkommensgrenze.' + g) })), achse: { min: 0, max: 80000, schritt: 20000, format: 'ganz' }, rand: { r: 0.30, u: 0.50 }, luecke: 45 });
    B.achsentitel(s, d, { x: ctx.wortlaut('Gesamtjahreseinkommen in €', 'Achsentitel') });

    // ---- Stichpunkte rechts (seit der Änderungsrunde vom 13.11.2026, F34.1 und G9: je Satz ein Stichpunkt, 14 pt; bis dahin Planlegende) ---------
    const wl = (t, was) => ctx.wortlaut(t, was);
    B.stichpunkte(s, { x: colX(9), y: y0, w: span(4), h: Y.inhaltEnde - y0, linie: true, gruppen: [
      { titel: wl('Zulassung von B und C', 'Überschrift'), punkte: R('zulassung.punkte').map(p => wl(p, 'Stichpunkt')) },
      { titel: wl('Nachweis', 'Überschrift'), punkte: R('zulassung.nachweis').map(p => wl(p, 'Stichpunkt')) }] });
  },
};
