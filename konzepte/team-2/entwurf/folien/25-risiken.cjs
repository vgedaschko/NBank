// Entwurf Folie 25 · Schlüsselfolie „Risiken“ (PGN_INHALT_MR, eine native Tabelle über zwölf Spalten).
// Je Zeile ein Lauf der Mappe mit genau einer geänderten Annahme; zwei Blöcke mit denselben Spalten in derselben Reihenfolge (A, B, C, frei):
// links Jahre mit Fehlbetrag (Jahr 1 bis 35), rechts Eigenkapitalrendite mit Restwert. Zellen, die schlechter sind als die Basis, liegen auf
// einer grauen Fläche in zwei Stufen (Flächen als Formen hinter der Tabelle; die Tabelle selbst hat keine Füllung und bleibt editierbar).
// Wo frei finanziert nur gut aussieht, weil die Rechnung die Miete für DSCR 1,2 neu löst, sagt es die zweite Zeile der Änderung.
// Hinweiskasten unter der Tabelle: Was geschieht, wenn der Markt nur 15,42 € zahlt (Block T2.5 der Team-2-Kopie).
'use strict';
const { V, punkte } = require('./_hilfen.cjs');

module.exports = {
  id: 'risiken',
  o: {
    nr: '25', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · RISIKEN',
    quellen: 'Quelle: Rechenmappe v3, Kopie mit neuen Blöcken, Blatt Konzepte D68:H68, D81:H81 je Lauf; Team 2 C59:C62.',
  },
  bau(ctx) {
    const { B, fmt, colX, Raster, Y, ZONE, HEX, wert } = ctx;

    // ---- Zahlen je Lauf: Fehlbetragsjahre (Konzepte Zeile 68) und Eigenkapitalrendite mit Restwert (Zeile 81), Spalten D, E, F, H -------------
    const lauf = (l, k, v) => l === 'konzepte' ? wert(`konzepte:n5.${k}.${v}`) : l === 'r1' ? wert(`liegenschaftszins_plus_0_60:r1.liegenschaftszins_plus_0_60.${k}.${v}`) : wert(`${l}:n6.${l}.${k}.${v}`);
    const ein = l => wert(`${l}:${l}.eingabe`);                                  // geänderte Eingabe des Laufs (Eingaben!E… der Mappe)
    const fb = l => V.map(v => lauf(l, 'jahre_fehlbetrag_1_35', v)), rd = l => V.map(v => lauf(l, 'ek_vofi_mit_restwert', v));
    const lz = wert('konzepte:kern.liegenschaftszins_jahr35.A');               // Übersicht!D106, 2,80 %
    const lzR1 = wert('liegenschaftszins_plus_0_60:r1.liegenschaftszins_plus_0_60.liegenschaftszins_35.A');   // Gefördert A!I120 im Lauf R1
    const markt = wert('konzepte:n2.marktmiete_jahr1'), mieteFrei = wert('konzepte:n2.miete_dscr');          // Konzepte!D13, D12
    const ziel = wert('konzepte:n1.dscr_ziel_bank_frei');
    const mieteK1 = wert('kosten_4631:n6.kosten_4631.miete_jahr1.frei_dscr'), mieteK2 = wert('kosten_5460:n6.kosten_5460.miete_jahr1.frei_dscr');
    const dscrJahre = wert('mietsteigerung_0:n6.mietsteigerung_0.jahre_dscr_unter_ziel.frei_dscr');           // Lauf mietsteigerung_0, Konzepte!H73

    const zeilen = [
      { text: 'Basis: Modellhaus', l: 'konzepte' },
      { text: `Tilgung NBank-Darlehen ${fmt.prozent(ein('tilgung_2_90'), 2)}`, l: 'tilgung_2_90' },
      { text: `Tilgung NBank-Darlehen ${fmt.prozent(ein('tilgung_3_65'), 2)}`, l: 'tilgung_3_65' },
      { text: `Herstellungskosten ${fmt.euro(ein('kosten_4631'))} je m²`, zweite: `(frei: Miete ${fmt.euroDez(mieteK1)})`, l: 'kosten_4631' },
      { text: `Herstellungskosten ${fmt.euro(ein('kosten_5460'))} je m²`, zweite: `(frei: Miete ${fmt.euroDez(mieteK2)})`, l: 'kosten_5460' },
      { text: 'keine Mieterhöhung in der Bindung', l: 'mietanpassung_gefoerdert_0' },
      { text: 'keine Mietsteigerung am Markt', zweite: `(frei: ${dscrJahre} Jahre unter DSCR ${fmt.dez(ziel, 1)})`, l: 'mietsteigerung_0' },
      { text: `Anschlusszins Bankdarlehen ${fmt.prozent(ein('anschlusszins_plus_1'), 2)}`, l: 'anschlusszins_plus_1' },
      { text: `Liegenschaftszins ${fmt.prozent(lzR1, 2)} statt ${fmt.prozent(lz, 2)}`, l: 'r1' },
      { text: `Markt zahlt nur ${fmt.euroDez(markt)} statt ${fmt.euroDez(mieteFrei)}`, l: 'markt' },
    ];
    // Lauf R1: Liegenschaftszins Ende Jahr 35 = Basis + geänderte Eingabe (Eingaben!E50)
    ctx.gleich('Liegenschaftszins R1 = 2,80 % + 0,60 Punkte', lz + ein('liegenschaftszins_plus_0_60'), lzR1, 6);
    // Werte je Zeile; die Zeile „Markt“ gilt nur frei finanziert: Spalte G der Konzepte-Mappe (Rechnung zur Marktmiete)
    zeilen.forEach(z => {
      if (z.l === 'markt') { z.fb = [null, null, null, wert('konzepte:n5.jahre_fehlbetrag_1_35.frei_markt')]; z.rd = [null, null, null, wert('konzepte:n5.ek_vofi_mit_restwert.frei_markt')]; }
      else { z.fb = fb(z.l); z.rd = rd(z.l); }
    });
    const basis = zeilen[0];
    // Stufen der Fläche: Fehlbetrag 1 bis 5 Jahre hell, ab 6 dunkel; Rendite bis 1 Prozentpunkt unter der Basis hell, mehr dunkel.
    // Verglichen wird, was auf der Folie steht (zwei Nachkommastellen); besser oder gleich: keine Fläche
    const r2 = x => Math.round(x * 10000) / 10000;
    const stufeFb = n => n === null ? 0 : n >= 6 ? 2 : n >= 1 ? 1 : 0;
    const stufeRd = (x, b) => x === null ? 0 : r2(x) >= r2(b) ? 0 : punkte(b, x) > 1 ? 2 : 1;
    // Aussagen des Titels: gefördert gibt es Fehlbeträge nur in den Läufen Tilgung und Herstellungskosten; frei finanziert trifft die Rendite am
    // stärksten der Lauf ohne Mietsteigerung
    const mitFb = zeilen.filter(z => z.l !== 'markt' && z.fb.slice(0, 3).some(n => n > 0)).map(z => z.l);
    ctx.pruefe(mitFb.every(l => /^(tilgung|kosten)/.test(l)), `Fehlbeträge gefördert auch in ${mitFb.join(', ')}; Titel prüfen.`);
    const freiMin = zeilen.filter(z => z.l !== 'markt').reduce((m, z) => z.rd[3] < m.rd[3] ? z : m);
    ctx.pruefe(freiMin.l === 'mietsteigerung_0', 'Frei finanziert trifft die Rendite nicht am stärksten der Lauf ohne Mietsteigerung.');

    const s = ctx.folie({ titel: ['Gefördert drücken Tilgung und Kosten,', 'frei finanziert Miete und Mietsteigerung'], akzent: 'Tilgung und Kosten' });
    B.register(s, '2.1');

    // ---- Spalten: Änderung | 4 × Fehlbetrag | Fuge | 4 × Rendite -------------------------------------------------------------------------
    const wF = 0.70, wR = 0.88, fuge = 0.24, wL = +(Raster.CW - 4 * wF - fuge - 4 * wR).toFixed(3);
    const xF = colX(1) + wL, xR = xF + 4 * wF + fuge, yKopf = ZONE.diagramm.kopf;
    B.modulkopf(s, { x: colX(1), y: yKopf, w: wL - 0.20, titel: 'Was sich ändert, je Lauf eine Annahme', sub: 'grau: schlechter als die Basis, dunkel: deutlich schlechter' });
    B.modulkopf(s, { x: xF, y: yKopf, w: 4 * wF, titel: 'Jahre mit Fehlbetrag', sub: 'Jahr 1 bis 35' });
    const yTab = B.modulkopf(s, { x: xR, y: yKopf, w: 4 * wR, titel: 'Eigenkapitalrendite', sub: 'mit Restwert, Ende Jahr 35' });
    const kopf = ['A', 'B', 'C', 'frei'];
    const spalten = [{ kopf: '', breite: wL, art: 'text' }, ...kopf.map(k => ({ kopf: k, breite: wF, art: 'zahl' })), { kopf: '', breite: fuge, art: 'text' },
      ...kopf.map(k => ({ kopf: k, breite: wR, art: 'zahl' }))];
    const strich = '–';
    const zellen = zeilen.map((z, i) => ({ zellen: [z.zweite ? `${z.text} ${z.zweite}` : z.text,
      ...z.fb.map(n => n === null ? strich : fmt.zahl(n)), '', ...z.rd.map(x => x === null ? strich : fmt.prozent(x, 2))], trennlinie: i === 0 }));
    const opt = { x: colX(1), y: yTab, w: Raster.CW, pt: 12, dicht: true, zellrand: [0.03, 0.03], spalten, zeilen: zellen, name: 'Tabelle Risiken' };
    const m = B.tabelle(s, { ...opt, messen: true });
    // Flächen hinter den Zellen (vor der Tabelle angelegt, damit sie darunter liegen)
    const farbe = [null, HEX.flaeche3, HEX.grau300];
    zeilen.forEach((z, i) => {
      const r = m.zeilen[i];
      z.fb.forEach((n, j) => { const st = stufeFb(n); if (st) B.kasten(s, { x: m.spalten[1 + j].x, y: r.y, w: wF, h: r.h, farbe: farbe[st], name: `Fläche Fehlbetrag ${i + 1}-${j + 1}` }); });
      z.rd.forEach((x, j) => { const st = stufeRd(x, basis.rd[j]); if (st) B.kasten(s, { x: m.spalten[6 + j].x, y: r.y, w: wR, h: r.h, farbe: farbe[st], name: `Fläche Rendite ${i + 1}-${j + 1}` }); });
    });
    const t = B.tabelle(s, opt);

    // ---- Hinweiskasten über zwölf Spalten ------------------------------------------------------------------------------------------------
    const dscrMarkt = wert('konzepte:n5.dscr_jahr1.frei_markt');               // Konzepte!G62
    const darlehen = wert('team2:t2.markt_dscr.darlehen_max'), mehrEk = wert('team2:t2.markt_dscr.mehr_ek');   // Team 2!C59, C61
    const hinweis = `Zahlt der Markt nur ${fmt.euroDez(markt)}, liegt die DSCR bei ${fmt.dez(dscrMarkt)}. Die Bank leiht dann nur ${fmt.mio(darlehen, 2)}, `
      + `Sie setzen ${fmt.mio(mehrEk, 2)} mehr Eigenkapital ein.`;
    const hH = B.hinweisHoehe(hinweis, { w: Raster.CW });
    ctx.pruefe(t.unten + 0.12 <= Y.inhaltEnde - hH, `Tabelle (bis ${t.unten}) und Hinweiskasten (${hH}) passen nicht übereinander.`);
    B.hinweis(s, { x: colX(1), y: Y.inhaltEnde, unten: true, w: Raster.CW, name: 'Risiken', text: hinweis });
  },
};
