// Schlüsselfolie 1 · Folie 16 · PGN_DIAGRAMM_MR: Jahr 1 je m² Wohnfläche und Monat. Was kommt herein (Miete), was geht hinaus
// (Bewirtschaftung, Verwaltungskostenbeitrag, Zins, Tilgung), was bleibt (Zahlungsüberschuss), für alle fünf Positionen des
// Vergleichsrasters im selben Maßstab: A, B, C zur Höchstmiete, frei zur Miete für DSCR 1,2, frei zur Marktmiete.
// Gestaltung: gestapelte Balken (waagerecht) statt Säulen, damit die kleinen Beträge lesbar bleiben. Die Balkenlänge ist bei A bis
// Frei 18,36 € die Miete. Frei 15,42 € zeigt nur, was hinausgeht (15,59 €); die senkrechte Marke „Marktmiete 15,42 €“ läuft durch
// alle Balken, am Ende des fünften Balkens steht der Fehlbetrag. Kein Rot im Diagramm (Rot bedeutet dort Zuschuss).
// Zahlen: team-3/mappe/werte_team.json (Team 3 Vergleich D21:H30, D17:H17, D44:H44), konzepte/mappe/werte_konzepte.json (Konzepte D12:D14).
'use strict';
const H = require('./_hilfen.cjs');

module.exports = {
  id: 'jahr1-je-qm',
  o: {
    nr: '16', abschnitt: 'Modellrechnung', layout: 'PGN_DIAGRAMM_MR', kicker: 'MODELLRECHNUNG · JAHR 1',
    quellen: 'Quelle: Rechenmappe v3, Kopie mit neuen Blöcken; Team 3 Vergleich D17:H30, Konzepte D12:D14.',
  },
  bau(ctx) {
    const { B, D, fmt, Y, ZONE, wert } = ctx, T = H.TEAM, N = H.namen(ctx), V = H.V;
    const q = k => H.fuenf(ctx, `t3.qm.${k}`, true);
    const miete = q('sollmiete'), bew = q('bewirtschaftung'), vkb = q('vkb'), zins = q('zins'), tilg = q('tilgung'), zue = q('zue');
    const zueJahr = H.fuenf(ctx, 't3.jr1.zue', true), anteil = H.fuenf(ctx, 't3.miete.anteil_markt', true);
    const aufschlag = wert('n2.aufschlag_marktmiete');
    const iM = V.indexOf('frei_markt'), iD = V.indexOf('frei_dscr');

    // Aussagen gegen die Zahlen: Zerlegung geht auf (Miete = Bewirtschaftung + VKB + Zins + Tilgung + Zahlungsüberschuss), gefördert kein Zins,
    // frei derselbe Zins in beiden Mieten, nur frei zur Marktmiete ein Fehlbetrag
    V.forEach((v, i) => ctx.gleich(`Zerlegung ${v}`, bew[i] + vkb[i] + zins[i] + tilg[i] + zue[i], miete[i], 6));
    ctx.pruefe(zins.slice(0, 3).every(z => z === 0), 'Gefördert hat Zins in Jahr 1; Titel „gefördert 0 €“ stimmt nicht.');
    ctx.gleich('Zins frei in beiden Mieten', zins[iD], zins[iM], 6);
    ctx.pruefe(zue.every((z, i) => (i === iM) === (z < 0)), 'Fehlbetrag in Jahr 1 nicht nur frei zur Marktmiete.');

    const zinsFrei = fmt.euroDez(zins[iD]);
    const s = ctx.folie(ctx.titelzeilen([`Frei finanziert gehen ${zinsFrei} je m² Miete`, 'in den Zins, gefördert 0 €'], zinsFrei));
    B.register(s, '2.1');
    const kopf = B.diagrammkopf(s, { titel: 'Jahr 1: herein, hinaus, was bleibt', sub: 'in € je m² Wohnfläche und Monat, vor Steuern' });

    // Segmente von links: was hinausgeht (hell nach dunkel), am Ende was bleibt (Schraffur: fließt dem Eigenkapital zu). Der Zahlungsüberschuss
    // trägt keine Beschriftung im Segment; sein Wert steht am Balkenende („bleibt“), frei zur Marktmiete der Fehlbetrag („fehlen“)
    const SEG = [
      { name: 'Bewirtschaftung', art: 'C', werte: bew },
      { name: 'Verwaltungskostenbeitrag', art: 'bisher', werte: vkb },
      { name: 'Zins', art: 'referenz', werte: zins },
      { name: 'Tilgung', art: 'tinte', werte: tilg },
      // frei zur Marktmiete ist der Zahlungsüberschuss negativ: Der Balken zeigt dort nur, was hinausgeht (max. 0 nur für die Zeichnung)
      { name: 'Zahlungsüberschuss', art: 'eigenmittel', werte: zue.map(z => Math.max(0, z)) },
    ];
    const lx = ZONE.diagramm.chart.x, cw = ZONE.diagramm.chart.w;
    B.legende(s, { x: lx, y: kopf.legende, eintraege: SEG.slice(0, 4).map(g => ({ text: g.name, art: g.art })) });

    const ent = H.drei(ctx, 'n5.bearbeitungsentgelte');
    const hinweis = `Einmalig, außerhalb von Jahr 1: Bearbeitungsentgelte ${H.balken(ent, fmt.zahl)} € gefördert. Jahresrechnung in € p. a. in Anhang A6.`;
    const hH = B.hinweisHoehe(hinweis, { w: cw }), c = ZONE.diagramm.chart;
    const d = D.stapelBalken(s, { x: lx, y: c.y, w: cw, h: +(Y.inhaltEnde - hH - 0.12 - c.y).toFixed(3), name: 'Diagramm Jahr 1 je m²',
      kategorien: V.map(v => N[v]), reihen: SEG, achse: { min: 0, max: 22, schritt: 2, format: 'roh' }, labels: false,
      rand: { l: 1.16, r: 0.24, o: 0.34, u: 0.50 }, luecke: 45,
      altText: `Gestapelte Balken, € je m² und Monat in Jahr 1. ` + V.map((v, i) => `${N[v]}: Miete ${fmt.euroDez(miete[i])}, Bewirtschaftung ${fmt.euroDez(bew[i])}, Verwaltungskostenbeitrag ${fmt.euroDez(vkb[i])}, Zins ${fmt.euroDez(zins[i])}, Tilgung ${fmt.euroDez(tilg[i])}, Zahlungsüberschuss ${fmt.euroDez(zue[i])}`).join('. ') + '.' });
    B.achsentitel(s, d, { x: 'Miete je m² und Monat in €' });

    // Kategorien als Text links vor den Balken: Variante und Miete (Work Sans SemiBold 12 pt)
    const kat = V.map((v, i) => i < 3 ? `${v}: ${fmt.euroDez(miete[i])}` : `Frei: ${fmt.euroDez(miete[i])}`);
    V.forEach((v, i) => B.text(s, kat[i], { x: lx, y: +(d.katMitte(i) - 0.11).toFixed(3), w: 1.06, h: 0.22, rolle: 'bezeichnung', valign: 'middle', einzeilig: true, name: `Kategorie ${N[v]}` }));
    // Werte in den Segmenten als Formen (die Diagrammbeschriftung ist aus): nur wo der Wert mit Luft hineinpasst; der Zahlungsüberschuss steht
    // am Balkenende. Weiß auf Zins und Tilgung, Tinte auf den hellen Flächen
    V.forEach((v, i) => {
      let x0 = 0;
      SEG.forEach(g => {
        const w = g.werte[i], xa = d.xWert(x0), xb = d.xWert(x0 + w); x0 += w;
        if (w <= 0 || g.name === 'Zahlungsüberschuss') return;
        const t = fmt.dez(w), b = ctx.breite(t, { fontFace: ctx.F.mont, bold: true, fontSize: 12 });
        if (xb - xa < b + 0.12) return;
        B.text(s, t, { x: +xa.toFixed(3), y: +(d.katMitte(i) - 0.11).toFixed(3), w: +(xb - xa).toFixed(3), h: 0.22, rolle: 'wert', align: 'center', valign: 'middle', einzeilig: true,
          farbe: g.art === 'tinte' || g.art === 'referenz' ? 'FFFFFF' : 'titel', name: `Wert ${g.name} ${N[v]}` });
      });
    });
    // Am Balkenende: was bleibt; frei zur Marktmiete, was fehlt
    V.forEach((v, i) => {
      const ende = bew[i] + vkb[i] + zins[i] + tilg[i] + Math.max(0, zue[i]);
      const t = zue[i] < 0 ? `fehlen ${fmt.euroDez(-zue[i])}` : `bleibt ${fmt.euroDez(zue[i])}`;
      const b = ctx.breite(ctx.schutz(t), { fontFace: ctx.F.mont, bold: true, fontSize: 12 }) + 0.06;
      B.textAufPlot(s, t, { x: +(d.xWert(ende) + 0.06).toFixed(3), y: +(d.katMitte(i) - 0.11).toFixed(3), w: +b.toFixed(3), h: 0.22, rolle: 'wert', name: `Ende ${N[v]}` });
    });
    // Marktmiete als senkrechte Marke durch alle Balken
    B.marke(s, { x: +d.xWert(miete[iM]).toFixed(3), y: d.plot.y, h: d.plot.h, art: 'referenz', strich: 'dash', text: `Marktmiete ${N.markt}`, textSeite: 'oben', textBreite: 1.9, name: 'Marke Marktmiete' });
    B.hinweis(s, { x: lx, y: Y.inhaltEnde, unten: true, w: cw, name: 'Bearbeitungsentgelte', text: hinweis });

    // Rechts: Stichpunkte unter „Herein“, „Hinaus“, „Bleibt im Jahr“
    const pz = a => fmt.prozent(a);
    B.stichpunkte(s, { platzhalter: 'kommentar', punktAbstand: 3, gruppen: [
      { titel: 'Herein: die Miete', punkte: [
        `A bis C: Höchstmiete, ${fmt.zahl(anteil[0] * 100)} bis ${pz(anteil[2])} der Marktmiete`,
        `Frei: ${N.dscr} für DSCR ${fmt.dez(ctx.wert('n1.dscr_ziel_bank_frei'), 1)} (Annahme der PGN), ${fmt.prozent(aufschlag, 1)} über der Marktmiete`] },
      { titel: 'Hinaus', punkte: [
        `Bewirtschaftung überall ${fmt.euroDez(Math.min(...bew))} bis ${fmt.euroDez(Math.max(...bew))}`,
        `Verwaltungskostenbeitrag ${H.balken(vkb.slice(0, 3), fmt.dez)} €`,
        `Zins gefördert 0 €, frei ${zinsFrei}`] },
      { titel: 'Bleibt im Jahr', punkte: [
        `Gefördert ${H.balken(zueJahr.slice(0, 3), fmt.zahl)} €`,
        `Frei ${fmt.euro(zueJahr[iD])} zur Miete ${N.dscr}, zur Marktmiete fehlen ${fmt.euro(-zueJahr[iM])}`] }] });
  },
};
