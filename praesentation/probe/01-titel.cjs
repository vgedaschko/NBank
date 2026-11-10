// Muster PGN_TITEL: Titel in drei Zeilen aus dem Konzepttext gelesen, Kennzahlfeld, Bildzeile. Das Feld „Ort, Datum“ bleibt als Eingabefeld leer.
'use strict';
module.exports = {
  id: 'p01-titel',
  o: { nr: '1', layout: 'PGN_TITEL', titel: 'Wohnraum, der sich rechnen kann',
    inhalt: 'Titel in drei Zeilen: „WOHNRAUM, DER“ | „SICH RECHNEN“ | „KANN.“ (Claim der Broschüre; Signaturwort „RECHNEN“ kursiv). Untertitel: „Die RL Mietwohnraum 2026 für Wohnungsunternehmen, Genossenschaften, Investorinnen und Investoren sowie Kommunen.“' },
  bau(ctx) {
    const { B, W, HEX } = ctx, s = ctx.folie();
    const quote = Math.round((W('modellhaus', 'tab.quote_darlehen.A') + W('modellhaus', 'tab.quote_zuschuss.A')) * 100);
    B.titelKennzahl(s, { vorsatz: 'bis zu', zahl: String(quote), einheit: '%', bezug: 'Förderquote aus Darlehen und Zuschuss', zusatz: 'der zuwendungsfähigen Kosten · Programmteil 2.1' });
    B.text(s, 'Referenzprojekt Brauerstraße, Rotenburg (Wümme) · 19 barrierefreie Wohnungen · mit Förderung der NBank',
      { x: 7.60, y: 5.24, w: 5.28, h: 0.38, rolle: 'label', farbe: HEX.hauch, align: 'right', valign: 'bottom', name: 'Bildzeile' });
  },
};
