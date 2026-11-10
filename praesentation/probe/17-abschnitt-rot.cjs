// Muster PGN_ABSCHNITT_ROT (höchstens zweimal im Vortrag): dieselbe Geometrie auf Rotverlauf, Logo auf weißem Feld.
'use strict';
module.exports = {
  id: 'p17-abschnitt-rot',
  o: { nr: '17', layout: 'PGN_ABSCHNITT_ROT', titel: 'Ihre Rechnung: das Modellhaus',
    inhalt: 'Achskreis XL: „4“. Titelzeilen: „Ihre Rechnung:“ | „das Modellhaus“ (Signaturwort: „Modellhaus“). Lead: „Ein Neubau mit 20 Wohnungen nach Programmteil 2.1, einmal gefördert und einmal frei finanziert gerechnet. Die Rechnung zeigt die Liquidität in Jahr 1 bei Kostenstand 2026, keine Rendite.“ Rubrik im Schriftfeld: „IHRE RECHNUNG“.' },
  bau(ctx) { const s = ctx.folie(); ctx.B.abschnittsleiste(s, { n: 6, aktiv: 4 }); },
};
