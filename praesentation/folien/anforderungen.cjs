// Folie 14 · PGN_INHALT: angemessene Wohnflächen und bauliche Anforderungen der Förderung in Programmteil 2.1 (neu am 16.11.2026, Wunsch der
// Geschäftsleitung). Links über fünf Spalten die Wohnfläche je Haushalt (RL Nr. 5.1.1), rechts über sieben Spalten die baulichen Anforderungen
// mit Fundstelle. Recherche vom 16.11.2026 am Wortlaut der RL Mietwohnraum 2026; die Wohnflächen stehen auch in der Faktenbasis der Broschüre
// (F053 bis F057). Bemessungsgrenze aus der Rechenmappe (werte.json, tab.bemessungsgrenze). Die Zahlen der RL stehen als Text im Modul.
'use strict';

module.exports = {
  id: 'anforderungen',
  bau(ctx) {
    const { B, W, fmt, colX, span, Y, P } = ctx, s = ctx.folie(), wl = (t, was) => ctx.wortlaut(t, was), T = k => W('modellhaus', 'tab.' + k);
    B.register(s, '2.1');
    // ---- links: Wohnfläche je Haushalt ----------------------------------------------------------------------------------------------
    const lx = colX(1), lw = span(5);
    const yL = B.modulkopf(s, { x: lx, y: Y.inhalt, w: lw, titel: wl('Angemessene Wohnfläche', 'Modultitel'), sub: wl('je Haushalt, nach Wohnflächenverordnung · RL Nr. 5.1.1', 'Untertitel') });
    const flaechen = [['1 Person', 'bis 50 m²'], ['2 Personen', 'bis 60 m²'], ['3 Personen', 'bis 75 m²'], ['4 Personen', 'bis 85 m²'], ['jede weitere Person', '+10 m²'],
      ['rollstuhlgerecht', '+12 m², mit Freisitz +15 m²']];
    flaechen.forEach(z => wl(`„${z[0]}“ · „${z[1]}“`, 'Wohnfläche'));
    const tl = B.tabelle(s, { x: lx, y: yL, w: lw, pt: 14, name: 'Tabelle Wohnfläche', spalten: [{ kopf: 'Haushalt', breite: 2.30, art: 'text' }, { kopf: 'Wohnfläche', art: 'text' }],
      zeilen: flaechen.map(z => [z[0], `**${z[1]}**`]) });
    const hinweis = wl('Mindestens 30 m² je Wohnung (Soll). Bis +10 % im Einzelfall mit Zustimmung der Wohnraumförderstelle.', 'Hinweiskasten');
    B.hinweis(s, { x: lx, y: Y.inhaltEnde, unten: true, w: lw, name: 'Wohnfläche', text: hinweis });
    if (tl.unten > Y.inhaltEnde - B.hinweisHoehe(hinweis, { w: lw }) - 0.06) P.melde(`Tabelle Wohnfläche endet bei y ${tl.unten.toFixed(2)} und stößt an den Hinweiskasten.`);

    // ---- rechts: bauliche Anforderungen mit Fundstelle ------------------------------------------------------------------------------
    const rx = colX(6) + 0.12, rw = span(7) - 0.12;
    const yR = B.modulkopf(s, { x: rx, y: Y.inhalt, w: rw, titel: wl('Bauliche Anforderungen', 'Modultitel'), sub: wl('Programmteil 2.1, Neubau', 'Untertitel') });
    // Designtest 17.11.2026: Stichpunkte in 14 pt statt der Tabelle mit Quellenspalte; die Fundstellen stehen in der Quellenzeile
    const gruppen = [
      { titel: 'Gebäude und Grundriss', punkte: [
        'Mehrfamilienhaus ab drei Wohnungen, je Gebäude mindestens zwei gebunden',
        'Kinderzimmer mindestens 10 m², keine Durchgangsräume',
        'Balkon höchstens ein Zehntel der Wohnfläche'] },
      { titel: 'Kosten, Barrierefreiheit, Energie', punkte: [
        `Herstellungskosten bis ${fmt.zahl(T('bemessungsgrenze.I'))} € je m², in Mietenstufe IV bis VII bis ${fmt.zahl(T('bemessungsgrenze.IV'))} €`,
        'Über vier Wohnungen alle barrierefrei, jede achte rollstuhlgerecht',
        'Energie: gesetzlicher Standard (GModG)'] }];
    gruppen.forEach(g => { wl(g.titel, 'Gruppentitel'); g.punkte.forEach(t => wl(t, 'Stichpunkt')); });
    const stp = B.stichpunkte(s, { x: rx, y: yR + 0.06, w: rw, titelAbstand: 8, punktAbstand: 3, name: 'Stichpunkte Bauliche Anforderungen', gruppen });
    if (stp.unten > Y.inhaltEnde + 0.005) P.melde(`Stichpunkte enden bei y ${stp.unten.toFixed(2)}, die Inhaltszone bei ${Y.inhaltEnde.toFixed(2)}.`);
    B.quelle(s, wl('Quellen: RL Mietwohnraum 2026, Nr. 1.5 und 5.1 bis 5.3; § 49 NBauO; § 15 GModG', 'Quellenzeile'));
  },
};
