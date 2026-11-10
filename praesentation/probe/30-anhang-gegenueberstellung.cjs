// Muster PGN_ANHANG im Wortlaut der Folie A4 des Konzepts: drei Spalten im Raster 4 + 4 + 4 mit Modulkopf und Kopf-Icon (B.modulkopf mit icon),
// die dritte Spalte als Signal in Dunkelrot (signal: true, immer mit Wort); darunter je eine Aufzählung in 14 pt, die Höhe folgt dem Text.
'use strict';
module.exports = {
  id: 'p30-anhang-gegenueberstellung',
  o: { nr: 'A4', layout: 'PGN_ANHANG', titel: 'Welche Verträge vor der Bewilligung möglich sind', inhalt: 'Kicker: „ANHANG · VORHABENBEGINN“.' },
  bau(ctx) {
    const { B, colX, span, Y } = ctx, s = ctx.folie();
    const spalten = [
      { titel: 'Zulässig', icon: 'check', altText: 'Haken', punkte: ['Baugrundstück kaufen oder Erbbaurecht bestellen', 'nicht bindende Reservierung beim Kauf', 'Planung bis einschließlich Leistungsphase 6 HOAI', 'Baugrund untersuchen, Grundstück herrichten'] },
      { titel: 'Bedingt zulässig', icon: 'hinweis', altText: 'Hinweiszeichen', punkte: ['Vertrag mit eindeutigem, folgenlosem Rücktrittsrecht oder eindeutiger Bedingung für den Fall, dass die Förderung ausbleibt; die NBank prüft die Klausel im Einzelfall', 'vorzeitiger Vorhabenbeginn nach Zulassung durch die NBank'] },
      { titel: 'Förderschädlich', icon: 'stopp', altText: 'Stoppzeichen', signal: true, punkte: ['Bau-, Werk-, Liefer-, Leistungs- oder Kaufvertrag (außer Baugrundstück)', 'beim Ersterwerb: bindender Kaufvertrag über die Wohnungen', 'Beauftragung ab Leistungsphase 7 HOAI', 'erster Spatenstich', 'bei 2.5: Mietvertrag oder Überlassung der Wohnung'] }];
    spalten.forEach((sp, i) => {
      const x = colX(1 + 4 * i), y = B.modulkopf(s, { x, y: Y.anhangInhalt, w: span(4), titel: sp.titel, icon: sp.icon, altText: sp.altText, signal: sp.signal });
      B.aufzaehlung(s, { x, y: y + 0.06, w: span(4), pt: 14, punkte: sp.punkte, name: 'Aufzählung ' + sp.titel });
    });
  },
};
