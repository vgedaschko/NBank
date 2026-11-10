// Hilfsfunktionen der Baugruppe „umsetzung“ (Folien 16, 17, A3, A4). Kein Folienmodul: build.cjs lädt nur folien/<id>.cjs der Folien des Konzepts.
//   felder   Zahlen, die in den Texten von daten/umsetzung.json als Platzhalter stehen ({name} Ziffern, {name:wort} Zahlwort)
//   lies     Zugriff auf daten/umsetzung.json mit gefüllten Platzhaltern
// Allgemeine Helfer stehen in lib/: ctx.wortlaut (Gegenprobe gegen das Konzept), ctx.lies, B.ringWerte, B.modulkopf mit icon und altText.
'use strict';

// Jede Zahl hat genau eine Quelle: daten/umsetzung.json (Broschüre, mit Seite und Schlüssel) oder daten/werte.json (Sätze der Richtlinie, tab.*).
function felder(ctx) {
  const { X, W, fmt } = ctx, U = p => X('umsetzung', p), nach = U('leistungen.marke.nach');
  return {
    entscheidung_monate: U('antragsweg.fristen.entscheidung_monate'),
    baubeginn_monate: U('antragsweg.fristen.baubeginn_monate'),
    verwendungsnachweis_monate: U('antragsweg.fristen.verwendungsnachweis_monate'),
    mindest_wohnungen: U('voraussetzungen.mindest_wohnungen'),
    wohnungen: U('referenz.wohnungen'),
    lph_vor: nach,                // letzte Leistungsphase vor der Bewilligung
    lph_nach: nach + 1,           // erste Leistungsphase nach der Bewilligung
    phasen: U('leistungen.phasen'),
    eigenmittel: fmt.prozent(W('modellhaus', 'tab.eigenmittel_mindestens')),
  };
}

// const U = lies(ctx); U('antragsweg.beginn')
const lies = ctx => ctx.lies('umsetzung', felder(ctx));

module.exports = { felder, lies };
