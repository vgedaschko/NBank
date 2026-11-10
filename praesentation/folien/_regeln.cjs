// Hilfsfunktion der Baugruppe „regeln“ (Folien 9 bis 12, A5, A6; die Funktion braucht nur A6). Kein Folienmodul: Der Build lädt nur folien/<id>.cjs zu den IDs des Konzepts.
// Allgemeine Helfer stehen in lib/: ctx.fuelle (Platzhalter), B.kennzahl mit teile, B.markeMitLuecken, Säulenlagen in der Rückgabe von D.*.
'use strict';

// Werte der Mappe, die in den Texten der Eckdaten stehen: Platzhalter → fertig formatierter Text.
// Quelle ist immer daten/werte.json (Lauf modellhaus, tab.*); daten/regeln.json trägt an diesen Stellen nur den Platzhalter.
function werteAusMappe(ctx) {
  const { W, fmt } = ctx, T = k => W('modellhaus', 'tab.' + k), G = ['A', 'B', 'C'];
  const satz = art => G.map(g => fmt.zahl(T(`quote_${art}.${g}`) * 100)).join('/');
  return {
    darlehen_abc: satz('darlehen'),
    zuschuss_abc: satz('zuschuss'),
    foerderquote: fmt.prozent(T('quote_darlehen.A') + T('quote_zuschuss.A')),
    eigenmittel: fmt.prozent(T('eigenmittel_mindestens')),
    zins: fmt.prozent(T('zins_nbank_bis_jahr35')),
    zinsfreie_jahre: String(T('zinsfreie_jahre')),
    verwaltungskostenbeitrag: fmt.prozent(T('verwaltungskostenbeitrag'), 1),
    entgelt_darlehen: fmt.prozent(T('bearbeitungsentgelt_darlehen')),
    entgelt_zuschuss: fmt.prozent(T('bearbeitungsentgelt_zuschuss'), 2),
  };
}

module.exports = { werteAusMappe };
