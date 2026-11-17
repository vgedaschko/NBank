// Folie 21 · PGN_DIAGRAMM_MR: Eigenkapitalrendite (VOFI, 35 Jahre, vor Steuern) mit und ohne Restwert, Gruppe A und frei finanziert zur Marktmiete.
// Links gruppierte Säulen mit dem Beitrag des Restwerts als Maßkette, darunter der Hinweis zur DSCR frei finanziert (Verweis auf Folie 19). Rechts
// der Anteil des Restwerts am Vermögen für beide und der Weg zum Vermögen Ende Jahr 35 als Rechenblatt in Tsd. €.
// Zahlen aus der Rechenmappe, Blatt Kennzahlen (D/G 61 bis 86; daten/kennzahlen.json).
'use strict';
const { quelleMarkt } = require('./_modell.cjs');

module.exports = {
  id: 'rechnung-rendite',
  bau(ctx) {
    const { B, D, fmt, ZONE, Y, outline } = ctx, wl = (t, was) => ctx.wortlaut(t, was), zahl = v => typeof v === 'number' && Number.isFinite(v);
    const mitA = ctx.wert('n5.ek_vofi_mit_restwert.A'), ohneA = ctx.wert('n5.ek_vofi_ohne_restwert.A');
    const mitF = ctx.wert('n5.ek_vofi_mit_restwert.frei_markt'), ohneF = ctx.wert('n5.ek_vofi_ohne_restwert.frei_markt'), dF = ctx.wert('n5.dscr_jahr1.frei_markt');
    const konto = ctx.wert('n5.projektkonto_jahr35.A'), rw = ctx.wert('n5.restwert_jahr35.A'), rs = ctx.wert('n5.restschuld_jahr35.A'), verm = ctx.wert('n5.vermoegen_jahr35.A');
    const anteil = ctx.wert('n5.restwertanteil.A'), anteilF = ctx.wert('n5.restwertanteil.frei_markt');
    ctx.gleich('Vermögen = Projektkonto + Restwert − Restschuld', konto + rw - rs, verm, 0);
    const T = v => Math.round(v / 1000);   // in Tsd. €; die gerundeten Zeilen gehen auf
    // Seit 16.11.2026: Das Vermögen steht als Summe der gerundeten Zeilen (höchstens 1 Tsd. € neben dem gerundeten Wert der Mappe)
    const vT = T(konto) + T(rw) - T(rs);
    ctx.pruefe(Math.abs(vT - T(verm)) <= 1, 'Die Zeilen in Tsd. € weichen um mehr als 1 vom Vermögen ab.');
    // Verweis auf die Folie zur Miete für eine DSCR von 1,2 mit ihrer Blattnummer
    const blattMiete = outline.folien.find(f => f.id === 'rechnung-miete').nr;

    const s = ctx.folie(ctx.titelzeilen([`Eigenkapitalrendite in A: ${fmt.prozent(mitA, 2)}`, `mit Restwert, ${fmt.prozent(ohneA, 2)} ohne`], fmt.prozent(mitA, 2)));
    if (zahl(anteilF) && anteilF > 1) ctx.P.hinweis('Rendite: Der Restwert frei finanziert ist größer als das Vermögen (Projektkonto negativ); die Kennzahl zeigt 100 %.');
    B.register(s, '2.1');
    B.quelle(s, quelleMarkt(ctx));
    B.diagrammkopf(s, { titel: wl('Eigenkapitalrendite über 35 Jahre', 'Diagrammtitel'), sub: wl('VOFI, vor Steuern, in % p. a. · Maßkette: Beitrag des Restwerts in Prozentpunkten', 'Untertitel') });
    B.legende(s, { x: ZONE.diagramm.chart.x, y: ZONE.diagramm.legende, eintraege: [{ text: 'mit Restwert', art: 'tinte' }, { text: 'ohne Restwert', art: 'referenz' }] });
    const hinweis = wl(`Frei finanziert rechnerisch, bei einer DSCR von ${fmt.dez(dF, 2)}.\nFinanzierung unter diesen Gesichtspunkten unrealistisch.`, 'Hinweiskasten');
    const cz = ZONE.diagramm.chart, hH = B.hinweisHoehe(hinweis, { w: cz.w, wichtig: true });
    const d = D.gruppierteSaeulen(s, { x: cz.x, y: cz.y, w: cz.w, h: +(Y.inhaltEnde - cz.y - hH - 0.12).toFixed(3), kategorien: ['Gruppe A', 'Frei finanziert'],
      reihen: [{ name: 'mit Restwert', art: 'tinte', werte: [mitA * 100, mitF * 100] }, { name: 'ohne Restwert', art: 'referenz', werte: [ohneA * 100, zahl(ohneF) ? ohneF * 100 : 0] }],
      achse: { min: 0, max: 10, schritt: 2, format: 'roh' }, labels: false, rand: { l: 0.80, r: 0.95 }, name: 'Diagramm Eigenkapitalrendite' });
    // Werte über den Säulen von Hand (seit 16.11.2026): Ohne Restwert ist die Rendite frei finanziert nicht definiert („n. v.“ in der Mappe, das
    // Vermögen Ende Jahr 35 ist dann negativ); dort steht „negativ“ statt einer Zahl, und die Maßkette entfällt
    [[mitA, ohneA], [mitF, ohneF]].forEach(([mit, ohne], i) => [mit, ohne].forEach((v, j) => B.textAufPlot(s, zahl(v) ? fmt.dez(v * 100, 2) : wl('negativ', 'Wert ohne Restwert'),
      { x: d.reiheMitte(i, j) - 0.55, y: d.yWert(zahl(v) ? v * 100 : 0) - 0.27, w: 1.10, h: 0.24, rolle: 'wert', align: 'center', valign: 'middle', name: `Wert ${i ? 'frei finanziert' : 'Gruppe A'} ${j ? 'ohne' : 'mit'} Restwert` })));
    // Beitrag des Restwerts als senkrechte Maßkette rechts neben jedem Säulenpaar: von „ohne“ bis „mit Restwert“, in Prozentpunkten
    [[mitA, ohneA], [mitF, ohneF]].forEach(([mit, ohne], i) => { if (zahl(ohne)) B.massketteSenkrecht(s, { x: d.reiheMitte(i, 1) + d.saeulenBreite / 2 + 0.16, y0: d.yWert(mit * 100), y1: d.yWert(ohne * 100),
      text: `+${fmt.dez((mit - ohne) * 100, 2)}`, seite: 'rechts', name: 'Restwert ' + (i ? 'frei finanziert' : 'Gruppe A') }); });
    B.achsentitel(s, d, { y: wl('in % p. a.', 'Achsentitel') });
    B.hinweis(s, { x: cz.x, y: Y.inhaltEnde, unten: true, w: cz.w, name: 'Frei finanziert', text: hinweis, wichtig: true });

    // Rechts: Anteil des Restwerts am Vermögen für A und frei finanziert nebeneinander, darunter ab y 4,40 der Weg zum Vermögen für beide
    const sp = ZONE.diagramm.spalte, wK = (sp.w - 0.30) / 2;
    [['Gruppe A', anteil], ['Frei finanziert', Math.min(anteilF, 1)]].forEach(([v, a], i) => B.kennzahl(s, { x: sp.x + i * (wK + 0.30), y: Y.inhalt, w: wK, vorsatz: v,
      zahl: fmt.zahl(a * 100, 0), einheit: '%', label: wl('aus dem Restwert', 'Kennzahl'), gross: true }));
    const kF = ctx.wert('n5.projektkonto_jahr35.frei_markt'), rwF = ctx.wert('n5.restwert_jahr35.frei_markt'), rsF = ctx.wert('n5.restschuld_jahr35.frei_markt'), vF = ctx.wert('n5.vermoegen_jahr35.frei_markt');
    ctx.gleich('Vermögen frei = Projektkonto + Restwert − Restschuld', kF + rwF - rsF, vF, 0);
    const vFT = T(kF) + T(rwF) - T(rsF);
    ctx.pruefe(Math.abs(vFT - T(vF)) <= 1, 'Die Zeilen frei finanziert in Tsd. € weichen um mehr als 1 vom Vermögen ab.');
    B.linie(s, { x: sp.x, y: 4.40, w: sp.w, art: 'tinte', name: 'Vermögen Oberlinie' });
    B.rechenblatt(s, { x: sp.x, y: 4.48, w: sp.w, wertBreite: 1.05, dicht: true, kopf: [wl('Tsd. €, Jahr 35', 'Tabellenkopf'), { kreis: 'A' }, 'Frei'], zeilen: [
      { nr: 1, text: 'Projektkonto', werte: [fmt.zahl(T(konto)), fmt.zahl(T(kF))] },
      { nr: 2, zeichen: '+', text: 'Restwert', werte: [fmt.zahl(T(rw)), fmt.zahl(T(rwF))] },
      { nr: 3, zeichen: '−', text: 'Restschuld', werte: [fmt.zahl(T(rs)), fmt.zahl(T(rsF))] },
      { nr: 4, zeichen: '=', text: 'Vermögen', werte: [fmt.zahl(vT), fmt.zahl(vFT)], art: 'ergebnis' }], name: 'Rechenblatt Vermögen' });
  },
};
