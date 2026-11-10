// Muster PGN_ZITAT: wörtliches Zitat mit Quelle, Zeilen von Hand gebrochen (höchstens vier Zeilen), rote Linie in Zitathöhe.
'use strict';
module.exports = {
  id: 'p14-zitat',
  o: { nr: '14', layout: 'PGN_ZITAT', titel: 'Das Land will, dass sich Investieren wieder rechnet',
    inhalt: 'Kicker: „ÜBERBLICK · STIMME AUS DEM LAND“. Titelzeilen: „Das Land will, dass sich“ | „Investieren wieder rechnet“ (Signaturwort: „rechnet“).' },
  bau(ctx) {
    const s = ctx.folie();
    ctx.B.zitat(s, { zeilen: ['„Bezahlbarer Wohnraum entsteht nur,', 'wenn Investitionen wieder wirtschaftlich', 'möglich sind.“'], name: 'Grant Hendrik Tonne', quelle: 'Niedersächsischer Wirtschafts- und Bauminister, Pressemitteilung MW vom 03.07.2026' });
  },
};
