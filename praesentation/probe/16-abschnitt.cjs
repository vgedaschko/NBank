// Muster PGN_ABSCHNITT: Achskreis XL, Titel 40 pt, Vorspann, Achsleiste der Abschnitte auf der oberen Rahmenlinie.
'use strict';
module.exports = {
  id: 'p16-abschnitt',
  o: { nr: '16', layout: 'PGN_ABSCHNITT', titel: 'Finanzierung: Darlehen und Zuschuss',
    inhalt: 'Achskreis XL: „3“. Titelzeilen: „Finanzierung:“ | „Darlehen und Zuschuss“ (Signaturwort: „Zuschuss“). Lead: „Fördermix je Einkommensgruppe, Eckdaten des Darlehens und die Bindung über 35 Jahre.“ Rubrik im Schriftfeld: „FINANZIERUNG“.' },
  bau(ctx) { const s = ctx.folie(); ctx.B.abschnittsleiste(s, { n: 6, aktiv: 3 }); },
};
