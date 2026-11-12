// Muster PGN_DIAGRAMM_MR mit freier Lage des Diagramms: Säulen einer Reihe mit einem Wert unter null (kräftige Nulllinie) und
// passgenau darunter ein Rechenblatt mit drei Wertspalten, die erste hervorgehoben. Werte aus drei Läufen der Mappe (Modellhaus, ARGE-Median,
// Bemessungsgrenze); gezeigt ist Gruppe C, weil dort Werte unter null liegen (die Folie 23 des Vortrags zeigt Gruppe A).
'use strict';
module.exports = {
  id: 'p25-diagramm-mr-saeulen-tabelle',
  o: { nr: '25', layout: 'PGN_DIAGRAMM_MR', titel: 'Herstellungskosten je m² bestimmen Förderquote und Zahlungsüberschuss',
    inhalt: 'Kicker: „MODELLRECHNUNG · HERSTELLUNGSKOSTEN“. Titelzeilen: „Herstellungskosten je m² bestimmen“ | „Förderquote und Zahlungsüberschuss“ (Signaturwort: „Herstellungskosten“).' },
  bau(ctx) {
    const { B, D, W, fmt, colX, span } = ctx, s = ctx.folie();
    B.register(s, '2.1');
    const laeufe = ['modellhaus', 'modellhaus_kosten_4631', 'modellhaus_kosten_5460'], L = k => laeufe.map(l => W(l, k));
    const kosten = L('eingabe.herstellungskosten_qm').map(v => fmt.zahl(v) + ' €');
    B.diagrammkopf(s, { titel: 'Zahlungsüberschuss Jahr 1, Gruppe C', sub: 'in € p. a. · nach Herstellungskosten je m² Wohnfläche' });
    const wb = 1.60, tx = colX(1), tw = span(8), plotX = tx + tw - 3 * wb;
    D.saeulen(s, { x: tx, y: 2.72, w: tw, h: 2.02, kategorien: kosten, werte: L('jr1.zahlungsueberschuss.C'), art: 'tinte', reihenname: 'Zahlungsüberschuss',
      achse: { min: -30000, max: 20000, schritt: 10000, format: 'ganz' }, rand: { l: plotX - tx, r: 0, o: 0.22, u: 0.10 }, katAchse: false, luecke: 150, name: 'Diagramm Zahlungsüberschuss nach Kosten' });
    B.rechenblatt(s, { x: tx, y: 4.84, w: tw, dicht: true, wertBreite: wb, hervor: 0, kopf: ['je m² Wohnfläche', ...kosten], zeilen: [
      { nr: 1, text: 'Gesamtkosten', werte: L('fin.gesamtkosten.C').map(v => fmt.mio(v, 2)) },
      { nr: 2, text: 'Förderung', werte: L('fin.foerderung.C').map(v => fmt.mio(v, 2)) },
      { nr: 3, text: 'Zahlungsüberschuss p. a.', werte: L('jr1.zahlungsueberschuss.C').map(v => fmt.euro(v)), art: 'summe' },
      { nr: 4, text: 'Nötige Miete je m²', werte: L('dscr.noetige_miete.C').map(v => fmt.euroDez(v)) }] });
    B.planlegende(s, { platzhalter: 'kommentar', pt: 14, eintraege: [
      { titel: 'Bemessungsgrenze', text: `Zuwendungsfähig sind Herstellungskosten bis ${fmt.zahl(W('modellhaus', 'fin.bemessungsgrenze_qm'))} € je m² Wohnfläche.` },
      { titel: 'Über der Grenze', text: 'Mehrkosten trägt der Bauherr mit Eigenmitteln oder Bankdarlehen.' }] });
  },
};
