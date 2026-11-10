// Muster PGN_ABSCHNITT_ROT (höchstens zweimal im Vortrag): dieselbe Geometrie auf Rotverlauf, Logo auf weißem Feld.
'use strict';
module.exports = {
  id: 'p17-abschnitt-rot',
  o: { nr: '17', layout: 'PGN_ABSCHNITT_ROT', titel: 'Modellrechnung: Neubau mit 20 Wohnungen',
    inhalt: 'Achskreis XL: „4“. Titelzeilen: „Modellrechnung:“ | „Neubau mit 20 Wohnungen“ (Signaturwort: „20 Wohnungen“). Lead: „Das Modellhaus nach Programmteil 2.1, einmal gefördert und einmal frei finanziert gerechnet. Die Rechnung zeigt die Liquidität in Jahr 1 bei Kostenstand 2026, keine Rendite.“ Rubrik im Schriftfeld: „MODELLRECHNUNG“.' },
  bau(ctx) { const s = ctx.folie(); ctx.B.abschnittsleiste(s, { n: 6, aktiv: 4 }); },
};
