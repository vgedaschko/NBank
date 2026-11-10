// Muster PGN_AUSSAGE_DUNKEL (höchstens zweimal im Vortrag): Hero-Kennzahl, Einheitenquadrate mit Maßkette in Weiß.
// Werte aus einer Datendatei mit Herkunft (hier daten/probe.json über ctx.X).
'use strict';
module.exports = {
  id: 'p15-dunkel',
  o: { nr: '15', layout: 'PGN_AUSSAGE_DUNKEL', titel: 'Seit 2015 nur 28 % der Bindungen ersetzt',
    inhalt: 'Kicker: „ÜBERBLICK · MARKT IN NIEDERSACHSEN“. Titelzeilen: „Seit 2015 hat die Neuförderung“ | „nur 28 % der Bindungen ersetzt“ (Signaturwort: „28 %“).' },
  bau(ctx) {
    const { B, X, colX, span, HEX } = ctx, s = ctx.folie();
    const n = X('probe', 'markt.ausgelaufen_tausend'), neu = X('probe', 'markt.neu_tausend');
    B.hero(s, { x: colX(1), y: 2.35, w: span(4), zahl: String(Math.round(X('probe', 'markt.quote') * 100)), einheit: '%', text: 'der seit 2015 ausgelaufenen Bindungen neu gefördert' });
    const x0 = colX(5) + 0.30, y0 = 3.05;
    const e = B.einheiten(s, { x: x0, y: y0, n, gefuellt: neu, art: 'zuschuss' });
    B.masskette(s, { x: x0, y: y0 - 0.14, w: e.w, segmente: [{ anteil: neu, text: `rund ${neu}.000 neu gefördert`, ausrichtung: 'links' }, { anteil: n - neu, text: 'nicht ersetzt' }] });
    B.text(s, '1 Quadrat = 1.000 Wohnungen · 2015–2024: 58.024 Bindungen ausgelaufen', { x: x0, y: y0 + e.h + 0.12, w: e.w, h: 0.24, rolle: 'achse', farbe: HEX.grau300, valign: 'middle', einzeilig: true, name: 'Legende Einheiten' });
  },
};
