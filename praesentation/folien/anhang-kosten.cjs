// Folie A7 · PGN_ANHANG: Herstellungskosten je m² Wohnfläche, Median, als natives gruppiertes Säulendiagramm über acht Spalten
// (vier Kostengruppen; PGN in Tinte, ARGE in Referenzgrau, Werte über den Säulen). Rechts die Spanne der Herstellung als kleine native Tabelle
// und zwei Sätze zur Einordnung. Werte aus daten/markt.json (Altfassung Folien 12 und 23, nicht nachgeprüft); Ansatz des Modellhauses aus
// daten/werte.json. Kein Rot, keine Wertung.
'use strict';
const { lies } = require('./_ueberblick.cjs');

module.exports = {
  id: 'anhang-kosten',
  bau(ctx) {
    const { B, D, X, fmt, colX, span, Y, P } = ctx, s = ctx.folie(), U = lies(ctx), T = k => ctx.wortlaut(U('kosten.texte.' + k), k), y0 = Y.anhangInhalt;
    const gruppen = X('markt', 'kosten.gruppen'), wer = ['pgn', 'arge'].map((k, i) => ({ k, name: ctx.wortlaut(X('markt', `kosten.${k}.name`), 'Legende'), art: i ? 'referenz' : 'tinte',
      median: X('markt', `kosten.${k}.median`), spanne: ['min', 'median', 'max'].map(m => X('markt', `kosten.${k}.spanne_herstellung.${m}`)) }));

    // Gegenproben: Titel der Folie, Säulenwerte und Spanne im Wortlaut des Konzepts; Median der Herstellung steht in Reihe und Spanne gleich
    gruppen.forEach((g, i) => ctx.wortlaut(`„${g.name} ${g.kg}“ ${wer.map(r => fmt.zahl(r.median[i])).join(' | ')}`, `Säulenwerte ${g.name}`));
    for (const r of wer) {
      ctx.wortlaut(`„${r.name}“ ${r.spanne.map(v => fmt.zahl(v)).join(' / ')}`, `Spanne ${r.name}`);
      if (r.median[0] !== r.spanne[1]) P.melde(`${r.name}: Der Median der Herstellung steht in Reihe (${r.median[0]}) und Spanne (${r.spanne[1]}) verschieden.`);
      if (!ctx.o.titel.includes(`${r.name}-Median ${fmt.zahl(r.median[0])}`)) P.melde(`Titel der Folie nennt den ${r.name}-Median nicht mit ${fmt.zahl(r.median[0])}.`);
    }

    // ---- Diagramm über acht Spalten ------------------------------------------------------------------------------------------
    B.modulkopf(s, { x: colX(1), y: y0, w: span(8), titel: T('diagrammtitel'), sub: 'in €, ' + T('untertitel') });
    B.legende(s, { x: colX(1), y: y0 + 0.70, eintraege: wer.map(r => ({ text: r.name, art: r.art })) });
    const LUECKE = 70;
    const d = D.gruppierteSaeulen(s, { x: colX(1), y: y0 + 0.98, w: span(8), h: Y.inhaltEnde - y0 - 0.98, kategorien: gruppen.map(g => `${g.name} ${g.kg}`), katAchse: false, luecke: LUECKE,
      rand: { u: 0.58 }, achse: { min: 0, max: 5000, schritt: 1000, format: 'ganz' }, labelFormat: 'ganz', name: 'Diagramm Herstellungskosten',
      altText: `Säulendiagramm: Herstellungskosten je m² Wohnfläche, Median, ${wer.map(r => r.name).join(' und ')} für ${gruppen.map(g => g.name).join(', ')}`,
      reihen: wer.map(r => ({ name: r.name, art: r.art, werte: r.median })) });
    B.kategorien(s, d, gruppen.map(g => ({ name: g.name, zusatz: g.kg })));

    // ---- Spanne der Herstellung über vier Spalten ---------------------------------------------------------------------------------
    const x = colX(9), w = span(4), [kopfTitel, kopfSpalten] = T('tabellentitel').split(': ');
    const yTab = B.modulkopf(s, { x, y: y0, w, titel: kopfTitel, sub: '€ je m² Wohnfläche' });
    const tab = B.tabelle(s, { x, y: yTab - 0.04, w, pt: 14, name: 'Tabelle Spanne der Herstellung',
      spalten: [{ kopf: '', breite: 0.90, art: 'stichwort' }, ...kopfSpalten.split(' / ').map(k => ({ kopf: k, art: 'zahl' }))],
      zeilen: wer.map(r => [r.name, ...r.spanne.map(v => fmt.zahl(v))]) });
    B.planlegende(s, { x, y: tab.unten + 0.30, w, pt: 14, eintraege: [{ text: T('zeile_q1_2020') }, { text: T('zeile_modellhaus') }] });
  },
};
