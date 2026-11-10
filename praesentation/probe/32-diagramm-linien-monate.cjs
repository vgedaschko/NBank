// Muster PGN_DIAGRAMM für eine lange Reihe (Form der Folie 3 des Konzepts, hier mit Kunstwerten): 127 Monatswerte, Beschriftung nur der Jahre.
// Bei mehr als 40 Kategorien trägt katLabels.nur nicht; die Kategorien heißen deshalb so, dass jede zwölfte die Beschriftung trägt
// (Januar = „2016“), und die Achse zeigt mit katLabels: { jede: 12 } genau diese. Endwerte an den Linienenden, senkrechte Marken mit Text.
'use strict';
module.exports = {
  id: 'p32-diagramm-linien-monate',
  o: { nr: '32', layout: 'PGN_DIAGRAMM', titel: 'Muster: lange Reihe mit Jahresbeschriftung',
    inhalt: 'Kicker: „MUSTER · LANGE REIHE“. Titelzeilen: „Muster mit Kunstwerten:“ | „127 Monate, beschriftet je Jahr“ (Signaturwort: „je Jahr“).' },
  bau(ctx) {
    const { B, D, fmt, colX, ZONE } = ctx, s = ctx.folie();
    B.diagrammkopf(s, { titel: 'Sollzins p. a. nach Zinsbindung', sub: 'in %, Monatswerte 01/2016 bis 07/2026 · Kunstwerte, nur zur Prüfung der Form' });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: '10 Jahre', art: 'tinte', strich: 'solid' }, { text: '20 Jahre', art: 'tinte', strich: 'dash' }, { text: '30 Jahre', art: 'referenz', strich: 'solid' }] });
    const kat = [], r10 = [], r20 = [], r30 = [];
    for (let i = 0; i < 127; i++) {
      const jahr = 2016 + Math.floor(i / 12), monat = i % 12 + 1;
      kat.push(monat === 1 ? String(jahr) : `${String(monat).padStart(2, '0')}/${jahr}`);      // Januar trägt die Jahreszahl
      const v = 1.2 + 2.4 / (1 + Math.exp(-(i - 75) / 6)) + 0.15 * Math.sin(i / 5);
      r10.push(+v.toFixed(2)); r20.push(+(v + 0.35).toFixed(2)); r30.push(+(v + 0.6).toFixed(2));
    }
    const d = D.linien(s, { kategorien: kat, katLabels: { jede: 12 }, rand: { r: 0.85 }, name: 'Diagramm Sollzins nach Zinsbindung', achse: { min: 0, max: 5, schritt: 1, format: 'roh' },
      reihen: [{ name: '10 Jahre', werte: r10, art: 'tinte' }, { name: '20 Jahre', werte: r20, art: 'tinte', strich: 'dash' }, { name: '30 Jahre', werte: r30, art: 'referenz' }] });
    const n = kat.length - 1, enden = B.entzerre([r10, r20, r30].map(r => d.yWert(r[n])), 0.22);
    [r10, r20, r30].forEach((r, i) => B.text(s, fmt.prozentWert(r[n], 2), { x: d.katMitte(n) + 0.08, y: enden[i] - 0.11, w: 0.80, h: 0.22, rolle: 'wert', farbe: i === 2 ? 'sekundaer' : 'titel', valign: 'middle', einzeilig: true, name: 'Endwert ' + (i + 1) }));
    B.marke(s, { x: d.katMitte(kat.indexOf('02/2020')), y: d.plot.y, h: d.plot.h, art: 'mass', text: 'Marke 02/2020', textSeite: 'rechts', textBreite: 1.6 });
    B.marke(s, { x: d.katMitte(kat.indexOf('11/2025')), y: d.plot.y, h: d.plot.h, art: 'mass', text: 'Marke 11/2025', textSeite: 'links', textBreite: 1.6 });
    B.planlegende(s, { platzhalter: 'kommentar', eintraege: [
      { titel: 'Lange Reihe', text: 'Die Kategorien heißen so, dass jede zwölfte die Jahreszahl trägt; die Achse beschriftet nur diese.' },
      { titel: 'Kunstwerte', text: 'Die Zahlen dieser Musterfolie sind erfunden.' }] });
  },
};
