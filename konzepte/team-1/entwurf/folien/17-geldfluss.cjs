// Folie 17 · Schlüsselfolie 2 · Geldfluss: wohin die Sollmiete geht, Jahr 1 und Jahr 1 bis 35 (PGN_INHALT_MR, 6 + 6).
// Zwei gleich gebaute Module: je ein natives gestapeltes Balkendiagramm (A | B | C | frei von oben), die Balkenlänge ist der Anteil an der
// Sollmiete (alle Balken 100 %), die Zahl im Segment der Betrag: links in Tsd. € p. a. (Zeilen der Folie 16), rechts in Mio. € (Summe
// Jahr 1 bis 35). Volle Euro passten in schmale Segmente nicht (Zahlungsüberschuss C und frei blieben ohne Zahl).
// Am Balkenende die Sollmiete: was hereinkommt. Fünf Reihen in der Reihenfolge der Jahresrechnung; eine Legende für beide Module.
// Farben: kein Rot im Diagramm (Rot = Zuschuss). Zahlungsüberschuss Tinte (was bleibt), Tilgung schraffiert (baut Vermögen auf, wie die
// Eigenmittel), Zins Referenzgrau (geht an die Bank), Verwaltungskostenbeitrag B4B0AB, Bewirtschaftung D8D4CF.
// Zahlen: Team-1-Mappe Konzepte!D112:H128 (Jahr 1), D132:H148 (Summen Jahr 1 bis 35); Konzepte-Mappe H49, Eingaben!F25, F26.
'use strict';
const werte = require('./_werte.cjs');

module.exports = {
  id: 'geldfluss',
  o: {
    nr: '17', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · GELDFLUSS',
    quellen: 'Quelle: Rechenmappe v3, Kopie mit neuen Blöcken, Blatt Konzepte, Zeilen 111 bis 148',
  },
  bau(ctx) {
    const { B, D, fmt, colX, span, Y, HEX } = ctx, { K, T, V } = werte(ctx);
    const NAMEN = ['A', 'B', 'C', 'frei'];

    // ---- Zahlen: je Zeitraum fünf Beträge (Abzüge negativ in der Mappe) und die Anteile an der Sollmiete -------------------------
    const REIHEN = [
      { k: 'bewirtschaftung', name: 'Bewirtschaftung, Zeilen 2 bis 4', art: 'C' },
      { k: 'vkb', name: 'Verwaltungskostenbeitrag, 6', art: 'bisher' },
      { k: 'zins', name: 'Zins, 7', art: 'referenz' },
      { k: 'tilgung', name: 'Tilgung, 8', art: 'eigenmittel' },
      { k: 'zue', name: 'Zahlungsüberschuss, 9', art: 'tinte' }];
    const jahr1 = {
      soll: V.map(v => T(`t1.sollmiete_jahr1.${v}`)),                                            // Konzepte!D112:H112
      betrag: REIHEN.map(r => V.map(v => Math.abs(T(`t1.${r.k}_jahr1.${v}`)))),                // Konzepte!D116:H122 (Zeilen der Reihen)
      anteil: REIHEN.map(r => V.map(v => Math.abs(T(`t1.anteil_${r.k}_jahr1.${v}`)))) };      // Konzepte!D124:H128
    const summe = {
      soll: V.map(v => T(`t1s.sollmiete.${v}`)),                                                 // Konzepte!D132:H132
      betrag: REIHEN.map(r => V.map(v => Math.abs(T(`t1s.${r.k}.${v}`)))),                     // Konzepte!D136:H142
      anteil: REIHEN.map(r => V.map(v => Math.abs(T(`t1s.anteil_${r.k}.${v}`)))) };           // Konzepte!D144:H148
    const mieteFrei = K('n5.miete_jahr1.frei_dscr'), marktmiete = K('annahme.marktmiete_jahr1'), anpassung = K('annahme.mietsteigerung');

    // ---- Aussagen gegen die Zahlen --------------------------------------------------------------------------------------------------
    const zinsSumme = summe.betrag[2];
    ctx.pruefe(zinsSumme.slice(0, 3).every(v => v === 0), 'Gefördert fließt über 35 Jahre Zins; Titel „gefördert 0 €“ stimmt nicht.');
    ctx.pruefe(summe.anteil[4][3] > Math.max(...summe.anteil[4].slice(0, 3)), 'Frei liegt beim Anteil Zahlungsüberschuss nicht mehr vorn; Hinweis anpassen.');
    [jahr1, summe].forEach((z, zi) => V.forEach((v, i) => {
      ctx.gleich(`Anteile ${zi ? 'Summe' : 'Jahr 1'} ${v}`, z.anteil.reduce((a, r) => a + r[i], 0), 1, 4);
      ctx.gleich(`Beträge ${zi ? 'Summe' : 'Jahr 1'} ${v}`, z.betrag.reduce((a, r) => a + r[i], 0), z.soll[i], 0);
    }));

    const zinsTitel = fmt.mio(zinsSumme[3], 2);
    const s = ctx.folie(ctx.titelzeilen(['In 35 Jahren gehen frei finanziert', `${zinsTitel} in den Zins, gefördert 0 €`], zinsTitel));
    B.register(s, '2.1');

    // ---- Hinweiskasten über zwölf Spalten an der Unterkante -------------------------------------------------------------------------
    const hinweis = `Summen nominal, unverzinst. Frei finanziert: Miete ${fmt.euroDez(mieteFrei)} für DSCR 1,2 · Marktmiete ${fmt.euroDez(marktmiete)}. `
      + `Mehr Zahlungsüberschuss als gefördert nur mit dieser Miete und ${fmt.prozent(anpassung)} Mietanpassung p. a., siehe Folie 24.`;
    const hH = B.hinweisHoehe(hinweis, { w: span(12) });

    // ---- Legende für beide Module ---------------------------------------------------------------------------------------------------
    const y0 = Y.inhalt, yLeg = y0 + 0.82, yChart = yLeg + 0.34, hChart = +(Y.inhaltEnde - hH - 0.12 - yChart).toFixed(3);
    B.legende(s, { x: colX(1), y: yLeg, eintraege: REIHEN.map(r => ({ text: r.name, art: r.art })) });

    // ---- Zwei gleich gebaute Module ---------------------------------------------------------------------------------------------------
    const modul = (spalte, z, titel, sub, fmtSeg, fmtSoll, nameZeit) => {
      const x = colX(spalte), w = span(6);
      B.modulkopf(s, { x, y: y0, w, titel, sub });
      const d = D.stapelBalken(s, { x, y: yChart, w, h: hChart, name: `Diagramm Geldfluss ${nameZeit}`, labels: false, luecke: 70,
        rand: { l: 0.62, r: 0.80, o: 0.30, u: 0.56 },
        kategorien: NAMEN, reihen: REIHEN.map((r, j) => ({ name: r.name, art: r.art, werte: z.anteil[j].map(a => +(a * 100).toFixed(4)) })),
        achse: { min: 0, max: 100, schritt: 25, format: 'prozent' },
        altText: `Gestapeltes Balkendiagramm, ${nameZeit}: Anteile an der Sollmiete je Variante A, B, C, frei. `
          + REIHEN.map((r, j) => `${r.name}: ${z.betrag[j].map(fmtSeg).join(' | ')}`).join('; ') + `. Sollmiete ${z.soll.map(fmtSoll).join(' | ')}.` });
      B.achsentitel(s, d, { x: 'Anteil an der Sollmiete in %' });
      // Kategorien vor den Balken: Achskreise A, B, C, das Wort „frei“
      NAMEN.forEach((n, i) => {
        const cy = d.katMitte(i);
        if (i < 3) B.achskreis(s, { cx: d.plot.x - 0.30, cy, groesse: 'S', text: n, name: `Kategorie ${n} ${nameZeit}` });
        else B.text(s, n, { x: d.plot.x - 0.62, y: cy - 0.12, w: 0.52, h: 0.24, rolle: 'bezeichnung', align: 'right', valign: 'middle', einzeilig: true, name: `Kategorie frei ${nameZeit}` });
      });
      // Beträge in den Segmenten (nur wo die Zahl in das Segment passt), weiß auf dunklen Reihen, Tinte auf hellen
      V.forEach((v, i) => {
        let links = 0;
        REIHEN.forEach((r, j) => {
          const a = z.anteil[j][i] * 100, x0 = d.xWert(links), x1 = d.xWert(links + a); links += a;
          if (z.betrag[j][i] === 0) return;
          const t = fmtSeg(z.betrag[j][i]), tb = ctx.breite(t, { fontFace: ctx.F.mont, bold: true, fontSize: 12 });
          if (tb + 0.10 > x1 - x0) return;
          const hell = ['C', 'bisher', 'eigenmittel'].includes(r.art);
          B.text(s, t, { x: +(x0 + 0.02).toFixed(3), y: +(d.katMitte(i) - 0.11).toFixed(3), w: +(x1 - x0 - 0.04).toFixed(3), h: 0.22, rolle: 'wert', align: 'center', valign: 'middle',
            farbe: hell ? HEX.tinte : 'FFFFFF', einzeilig: true, name: `Wert ${r.name} ${NAMEN[i]} ${nameZeit}` });
        });
      });
      // Sollmiete am Balkenende, darüber die Bezeichnung der Spalte
      const xS = d.xWert(100) + 0.10, wS = 0.66;
      B.text(s, 'Sollmiete', { x: +(xS + wS - 0.90).toFixed(3), y: +(d.plot.y - 0.27).toFixed(3), w: 0.90, h: 0.22, rolle: 'bezeichnung', align: 'right', valign: 'middle', einzeilig: true, name: `Bezeichnung Sollmiete ${nameZeit}` });
      V.forEach((v, i) => B.text(s, fmtSoll(z.soll[i]), { x: xS, y: +(d.katMitte(i) - 0.11).toFixed(3), w: wS, h: 0.22, rolle: 'wert', align: 'right', valign: 'middle', einzeilig: true,
        name: `Wert Sollmiete ${NAMEN[i]} ${nameZeit}` }));
      return d;
    };
    const tsd = v => fmt.dez(v / 1e3, 1), mio = v => fmt.dez(v / 1e6, 2);
    modul(1, jahr1, 'Jahr 1', 'Länge: Anteil an der Sollmiete · Zahlen in Tsd. € p. a.', tsd, tsd, 'Jahr 1');
    modul(7, summe, 'Jahr 1 bis 35 zusammen', 'Länge: Anteil an der Sollmiete · Zahlen in Mio. €', mio, mio, 'Jahr 1 bis 35');

    B.hinweis(s, { x: colX(1), y: Y.inhaltEnde, unten: true, w: span(12), name: 'Geldfluss', text: hinweis });
  },
};
