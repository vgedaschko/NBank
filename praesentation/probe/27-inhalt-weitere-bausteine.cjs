// Muster PGN_INHALT mit den übrigen Bausteinen: Achsleiste in einer Reihe (bis sechs Stationen), Kasten, Zitat in freier Lage,
// Schnittlinie, Hero-Kennzahl auf roter Fläche, Stempel frei gesetzt (auf Layouts ohne „_MR“), Rechenblatt mit Zusatzzeile (art „notiz“).
'use strict';
module.exports = {
  id: 'p27-inhalt-weitere-bausteine',
  o: { nr: '27', layout: 'PGN_INHALT', titel: 'Weitere Bausteine des Planwerks',
    inhalt: 'Kicker: „MUSTER · WEITERE BAUSTEINE“. Titelzeilen: „Weitere Bausteine:“ | „Achsleiste, Kasten, Zitat, Hero“ (Signaturwort: „Hero“).' },
  bau(ctx) {
    const { B, W, fmt, colX, span } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.achsleiste(s, { x: colX(1), y: 2.36, w: 12.0, art: 'reihe', stationen: ['Vorgespräch', 'Antrag', 'Stellungnahme', 'Entscheidung', 'Bau', 'Nachweis'].map((titel, i) => ({ titel, signal: i === 3 })) });
    B.schnittlinie(s, { x: colX(1), y: 3.20, w: span(8), text: 'A' });
    B.stempel(s, { x: 12.667 - 2.12, y: 3.01 });
    const k = B.kasten(s, { x: colX(1), y: 3.44, w: span(4), h: 1.50 });
    B.text(s, '**Kasten:** Papierfläche auf Weiß, weiße Fläche auf Papier. Text mit 0,20 Zoll Abstand zum Rand.', { ...k, rolle: 'dicht', name: 'Kastentext' });
    B.zitat(s, { x: colX(5), y: 3.38, w: span(4), zeilen: ['„Zitat in freier Lage,', 'Zeilen von Hand.“'], name: 'Name', quelle: 'Quelle mit Datum' });
    B.rechenblatt(s, { x: colX(1), y: 5.16, w: span(8), dicht: true, kopf: ['Position', 'A', 'B', 'C'], zeilen: [
      { nr: 8, zeichen: '=', text: 'Zahlungsüberschuss p. a.', werte: ['A', 'B', 'C'].map(g => fmt.zahl(M(`jr1.zahlungsueberschuss.${g}`))), art: 'ergebnis' },
      { text: 'Einmalig: Bearbeitungsentgelte', werte: ['A', 'B', 'C'].map(g => fmt.zahl(M(`jr1.bearbeitungsentgelte.${g}`))), art: 'notiz' }] });
    B.hero(s, { x: colX(9), y: 3.52, w: span(4), h: 2.90, flaeche: true, zahl: String(Math.round(M('fin.foerderquote.A') * 100)), einheit: '%', text: 'Förderquote im Modellhaus, Gruppe A' });
  },
};
