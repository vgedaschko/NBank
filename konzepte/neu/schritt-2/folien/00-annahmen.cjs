// Folie 3.3 (neu): Annahmen der Modellrechnung auf einem Blatt, gefördert (Gruppe A) neben frei finanziert, je mit Herkunft. Botschaft: Haus,
// Bewirtschaftung, Mietausfall, Kontokorrent und Restwert sind gleich angesetzt; verschieden sind nur Miete und Finanzierung. Gleiche Ansätze
// stehen in der Spalte frei finanziert als „wie gefördert“. Alle Werte aus der Konzepte-Mappe (Eingaben, Tabellen, Konzepte).
'use strict';

const QUELLEN = 'Quellen: RL Mietwohnraum 2026; Gutachterausschuss Lüneburg (2026), Mietübersicht Landkreis Harburg; Dr. Klein Wowi (2026)';

module.exports = {
  id: 'annahmen',
  o: { nr: '3.3', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · ANNAHMEN', quellen: QUELLEN },
  bau(ctx) {
    const { B, fmt, colX, span, Y } = ctx, wl = (t, was) => ctx.wortlaut(t, was), a = k => ctx.wert('annahme.' + k);
    const s = ctx.folie(ctx.titelzeilen(['Gleiche Kosten, verschieden sind', 'nur Miete und Finanzierung'], 'Miete und Finanzierung'));
    B.register(s, '2.1');
    B.quelle(s, QUELLEN);
    const p = v => { const h = Math.round(v * 1e4); return fmt.prozent(v, h % 100 === 0 ? 0 : h % 10 === 0 ? 1 : 2); };   // 2 %, 0,5 %, 2,38 %
    const wie = { text: 'wie gefördert', farbe: ctx.HEX.grau600 };
    const zeilen = [
      ['Ertrag', 'Miete Jahr 1 je m²', `Höchstmiete ${fmt.euroDez(a('hoechstmiete_VI.A'))}`, `Marktmiete ${fmt.euroDez(a('marktmiete_jahr1'))}`, 'RL 5.4.4 · Mietübersicht'],
      ['', 'Mietanpassung', `${a('jahre_ohne_mieterhoehung')} Jahre fest, dann +${p(a('mieterhoehung_in_der_bindung'))} je ${a('abstand_mieterhoehungen')} Jahre`, `+${p(a('mietsteigerung'))} p. a.`, 'RL 5.4.5 · PGN'],
      ['', 'Mietausfall, Leerstand', `${p(a('mietausfall'))} der Sollmiete`, wie, 'PGN'],
      ['Kosten', 'Verwaltung, Instandhaltung', `${fmt.euro(a('objektverwaltung_je_wohnung'))} je Wohnung, ${fmt.euroDez(a('instandhaltung_je_qm'))} je m² p. a.`, wie, 'PGN'],
      ['', 'Kostensteigerung', `${p(a('kostensteigerung'))} p. a. ab Jahr 2`, wie, 'PGN'],
      ['Finanzierung', 'Fremdkapital', `Zuschuss und NBank-Darlehen je ${fmt.mio(ctx.wert('n5.zuschuss.A'), 2)}`, `Bankdarlehen ${fmt.mio(ctx.wert('n5.bankdarlehen.frei_markt'), 2)}`, 'RL 5.3.3'],
      ['', 'Zins', `${p(a('zins_nbank_bis_jahr35'))} bis Jahr ${a('zinsfreie_jahre')}`, `${p(a('zins_bank'))}, ${a('zinsbindung')} Jahre fest`, 'RL 5.3.4 · Dr. Klein'],
      ['', 'Tilgung', `${p(a('tilgung_nbank'))} p. a. linear`, `jährliche Annuität über ${a('laufzeit_bank')} Jahre`, 'PGN'],
      ['', 'Verwaltungskostenbeitrag', `${p(a('verwaltungskostenbeitrag'))} vom Restkapital`, { text: 'entfällt', farbe: ctx.HEX.grau600 }, 'RL 12.7.1'],
      ['', 'Kontokorrent', `Soll ${p(a('sollzins'))}, Haben ${p(a('guthabenzins'))}`, wie, 'PGN'],
      ['Restwert', 'Restwert Ende Jahr 35', 'Ertragswert aus der Marktmiete', wie, 'Gutachterausschuss Nds.'],
    ];
    ctx.gleich('Zuschuss = NBank-Darlehen in A', ctx.wert('n5.zuschuss.A'), ctx.wert('n5.darlehen_nbank.A'), 0);
    const yT = B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: span(12), titel: wl('Annahmen der Modellrechnung', 'Modultitel'), sub: wl('Modellhaus · Ertrag, Kosten, Finanzierung, Restwert · Herkunft: Richtlinie (RL), Quelle oder Annahme der PGN', 'Untertitel') });
    B.tabelle(s, { x: colX(1), y: yT + 0.02, w: span(12), pt: 12, name: 'Tabelle Annahmen',
      dicht: true, zellrand: [0.03, 0.03],
      spalten: [{ kopf: 'Position', breite: 2.45, art: 'text' }, { kopf: 'Gefördert, Gruppe A', breite: 3.80, art: 'text' },
        { kopf: 'Frei finanziert', breite: 3.15, art: 'text' }, { kopf: 'Herkunft', art: 'text' }],
      // Gruppen (Ertrag, Kosten, Finanzierung, Restwert) durch eine Linie über der ersten Zeile; der Name der Gruppe entfällt
      // Die Trennlinie steht unter einer Zeile: also an der letzten Zeile vor einer neuen Gruppe
      zeilen: zeilen.map((z, i) => ({ zellen: z.slice(1), trennlinie: i < zeilen.length - 1 && zeilen[i + 1][0] !== '' })) });
  },
};
