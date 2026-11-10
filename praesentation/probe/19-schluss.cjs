// Muster PGN_SCHLUSS: Titel mit erster Zeile in zweiter Stimme (Montserrat Light 20 pt), Untertitel; Kontaktdaten und QR-Code liegen im Layout.
'use strict';
module.exports = {
  id: 'p19-schluss',
  o: { nr: '19', layout: 'PGN_SCHLUSS', titel: 'Aus Ihrer guten Idee – machen wir den besten Plan',
    inhalt: 'Titel in drei Zeilen: „AUS IHRER GUTEN IDEE“ (zweite Stimme, 20 pt) | „MACHEN WIR DEN“ | „BESTEN PLAN.“ (Claim der Broschüre U4; Signaturwort „BESTEN PLAN“ kursiv). Untertitel: „Wir planen Ihr Vorhaben im geförderten Mietwohnungsbau, von der Machbarkeit bis zur Fertigstellung. Sprechen Sie uns an.“' },
  bau(ctx) { ctx.folie(); },
};
