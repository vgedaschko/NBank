// Muster PGN_KENNZAHLEN: drei Kennzahlen in den Platzhaltern des Layouts (Zahl 44 pt, Einheit in der Farbe der Zahl, Label 16 pt, Text 14 pt).
// Für eine einzelne Kachel in 60 pt: B.kennzahl mit gross: true in freier Lage (Muster 18 zeigt B.kennzahl).
'use strict';
module.exports = {
  id: 'p09-kennzahlen',
  o: { nr: '9', layout: 'PGN_KENNZAHLEN', titel: 'Die Förderung in drei Zahlen',
    inhalt: 'Kicker: „ÜBERBLICK · KENNZAHLEN“. Titelzeilen: „Programmteil 2.1:“ | „die Förderung in drei Zahlen“ (Signaturwort: „drei Zahlen“).' },
  bau(ctx) {
    const { B, W } = ctx, s = ctx.folie(), T = k => W('modellhaus', 'tab.' + k);
    B.schluesselplan(s, '2.1'); B.register(s, '2.1');
    B.kennzahlFeld(s, 0, { vorsatz: 'bis zu', zahl: String(Math.round((T('quote_darlehen.A') + T('quote_zuschuss.A')) * 100)), einheit: '%', label: 'Förderquote', text: 'Darlehen und Zuschuss, in allen drei Einkommensgruppen.' });
    B.kennzahlFeld(s, 1, { vorsatz: 'Zins', zahl: String(T('zins_nbank_bis_jahr35') * 100), einheit: '%', label: `bis Ende des ${T('zinsfreie_jahre')}. Jahres`, text: 'Dazu der Verwaltungskostenbeitrag auf das Restkapital.' });
    B.kennzahlFeld(s, 2, { vorsatz: 'Bindung', zahl: String(T('bindung')), einheit: 'Jahre', label: 'Belegungs- und Mietbindung', text: `Laufzeit des Darlehens höchstens ${T('laufzeit_hoechstens')} Jahre.` });
  },
};
