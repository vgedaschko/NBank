// Hilfsfunktionen der Baugruppe „ueberblick“ (Folien 2, A1, A2, A7, A8). Kein Folienmodul: build.cjs lädt nur folien/<id>.cjs der Folien des Konzepts.
//   monatKurz, monatWort   „2020-02“ → „02/2020“ und „Februar 2020“
//   mittel                 Mittelwert einer Monatsreihe über genannte Monate (Gegenprobe der Quartalsmittel)
//   felder, lies           Zugriff auf daten/markt.json mit gefüllten Platzhaltern ({name}); „mappe_…“ kommt aus daten/werte.json
// Allgemeine Helfer stehen in lib/: ctx.wortlaut, ctx.gleich, ctx.lies, B.modulkopf mit rechts, B.kategorien, B.tabelle mit dicht.
'use strict';

const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
function teile(monat) {
  const m = /^(\d{4})-(\d{2})$/.exec(String(monat));
  if (!m || +m[2] < 1 || +m[2] > 12) throw new Error(`Monat „${monat}“: erwartet wird JJJJ-MM.`);
  return { jahr: m[1], monat: m[2] };
}
const monatKurz = m => { const t = teile(m); return `${t.monat}/${t.jahr}`; };
const monatWort = m => { const t = teile(m); return `${MONATE[+t.monat - 1]} ${t.jahr}`; };

// Mittelwert der Reihe über die genannten Monate; bricht ab, wenn ein Monat in der Reihe fehlt
function mittel(monate, werte, welche) {
  const v = welche.map(m => { const i = monate.indexOf(m); if (i < 0) throw new Error(`mittel: Monat „${m}“ steht nicht in der Reihe.`); return werte[i]; });
  return v.reduce((a, b) => a + b, 0) / v.length;
}

// Zahlen, die in den Texten der Datendatei als Platzhalter stehen. Jede Zahl hat genau eine Quelle:
// daten/markt.json (Broschüre oder Altfassung, mit Herkunft) oder daten/werte.json (Vorsatz „mappe_“, Lauf modellhaus).
function felder(ctx) {
  const { X, W, fmt } = ctx, M = k => W('modellhaus', k), K = p => X('markt', p), satz = v => fmt.zahl(v * 100);
  const monate = K('zinsen.monate'), je = K('markt.je_quadrat');
  const f = {
    // Folie 2
    zins_von: monatKurz(monate[0]), zins_bis: monatKurz(monate[monate.length - 1]), zins_bis_wort: monatWort(monate[monate.length - 1]),
    mappe_zinsbindung: String(M('eingabe.zinsbindung')),
    // Folie A7
    kg_herstellung: K('kosten.gruppen')[0].kg, arge_q1_2020: fmt.zahl(K('kosten.arge_median_q1_2020')),
    mappe_herstellungskosten_qm: fmt.zahl(M('eingabe.herstellungskosten_qm')),
    // Folie A1: Sätze des Programmteils 2.1
    mappe_quote: satz(M('tab.quote_darlehen.A') + M('tab.quote_zuschuss.A')), mappe_bindung: String(M('tab.bindung')), mappe_eigenmittel: satz(M('tab.eigenmittel_mindestens')),
    // Folie A8 (Jahreszahlen ohne Tausenderpunkt)
    seit: String(K('markt.seit')), bis: String(K('markt.bis')), quote: satz(K('markt.quote')), je_quadrat: fmt.zahl(je),
    neu_rund: fmt.zahl(Math.round(K('markt.neu_gefoerdert') / je) * je), ausgelaufen: fmt.zahl(K('markt.ausgelaufen')), bestand: fmt.zahl(K('markt.bestand')), bestand_jahr: String(K('markt.bestand_jahr')),
  };
  for (const g of ['A', 'B', 'C']) { f['mappe_darlehen_' + g] = satz(M(`tab.quote_darlehen.${g}`)); f['mappe_zuschuss_' + g] = satz(M(`tab.quote_zuschuss.${g}`)); }
  return f;
}

// Zugriff auf daten/markt.json mit gefüllten Platzhaltern: const U = lies(ctx); U('markt.texte.satz').
// Der zweite Parameter gibt weitere Felder mit (zum Beispiel die Werte einer Marke).
const lies = ctx => ctx.lies('markt', felder(ctx));

module.exports = { monatKurz, monatWort, mittel, felder, lies };
