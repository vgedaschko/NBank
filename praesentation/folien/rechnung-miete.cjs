// Folie 19 · PGN_DIAGRAMM_MR: Miete für eine DSCR von 1,2 in Jahr 1, Gruppe A gegen frei finanziert (Balkenpaar). Marken: Höchstmiete am Balken A,
// Marktmiete am Balken frei finanziert; der Teil des Balkens frei finanziert über der Marktmiete steht als Lücke in Dunkelrot (Signal). Rechts wie
// in Kapitel 1 die Hauptzahl (Lücke je m²) und eine Nebenzahl (Luft in A). Unter dem Diagramm die Lesart der DSCR.
// Zahlen aus der Rechenmappe, Blatt Kennzahlen (D6, D12, D13, D19, D22) und Blatt Frei DSCR 1,2 (daten/kennzahlen.json).
'use strict';
const { quelleMarkt } = require('./_modell.cjs');

module.exports = {
  id: 'rechnung-miete',
  bau(ctx) {
    const { B, D, C, fmt, ZONE, Y } = ctx, wl = (t, was) => ctx.wortlaut(t, was);
    const nA = ctx.wert('n3.miete_dscr.A'), hm = ctx.wert('n3.hoechstmiete.A'), nF = ctx.wert('n2.miete_dscr'), markt = ctx.wert('n2.marktmiete_jahr1');
    const dA = ctx.wert('n5.dscr_jahr1.A'), dF = ctx.wert('n5.dscr_jahr1.frei_markt'), ziel = ctx.wert('n1.dscr_ziel_bank_frei');
    ctx.pruefe(nA < hm && nF > markt && dA >= ziel && dF < ziel, 'A erreicht die DSCR von 1,2 zur Höchstmiete nicht, oder frei finanziert erreicht sie zur Marktmiete.');
    const luecke = nF - markt, luft = hm - nA, anteil = hm / markt;   // Kennzahlen D12 − D13, D19 − D22, D19 ÷ D13
    const s = ctx.folie(ctx.titelzeilen([`Frei finanziert braucht ${fmt.euroDez(nF)}`, `Miete, der Markt zahlt ${fmt.euroDez(markt)}`], fmt.euroDez(nF)));
    B.register(s, '2.1');
    B.quelle(s, quelleMarkt(ctx));
    B.diagrammkopf(s, { titel: wl(`Miete für eine DSCR von ${fmt.dez(ziel, 1)} in Jahr 1`, 'Diagrammtitel'), sub: wl('in € je m² und Monat · Linie: erzielbare Miete', 'Untertitel') });
    B.legende(s, { x: ZONE.diagramm.chart.x, y: ZONE.diagramm.legende, eintraege: [{ text: 'Gruppe A', art: 'tinte' }, { text: 'Frei finanziert', art: 'referenz' }, { text: 'Lücke zur Marktmiete', art: 'signal' }] });
    const hinweis = wl(`DSCR = Überschuss vor Kapitaldienst ÷ Kapitaldienst.\nDSCR = ${fmt.dez(ziel, 1)} verlangt die Bank mindestens für ihr Darlehen, Annahme.\nGefördert gilt die DSCR für das NBank-Darlehen.`, 'Hinweiskasten');
    const cz = ZONE.diagramm.chart, hH = B.hinweisHoehe(hinweis, { w: cz.w });
    const d = D.balkenpaar(s, { x: cz.x, y: cz.y, w: cz.w, h: +(Y.inhaltEnde - cz.y - hH - 0.12).toFixed(3), kategorien: ['Gruppe A', 'Frei finanziert'], werte: [nA, nF], arten: ['tinte', 'referenz'],
      reihenname: 'Miete für DSCR 1,2', achse: { min: 0, max: 21, schritt: 3, format: 'roh' }, katBreite: 1.55, rand: { o: 0.50, r: 1.20, u: 0.50 }, name: 'Diagramm Miete für DSCR 1,2' });
    B.achsentitel(s, d, { x: wl('Miete in € je m² und Monat', 'Achsentitel') });
    const bh = d.balkenHoehe;
    // Lücke: der Teil des Balkens frei finanziert über der Marktmiete, als Fläche in Dunkelrot über dem Balken
    B.kasten(s, { x: d.xWert(markt), y: d.katMitte(1) - bh / 2, w: d.xWert(nF) - d.xWert(markt), h: bh, farbe: C.dunkelrot, name: 'Lücke zur Marktmiete' });
    B.textAufPlot(s, fmt.euroDez(nA), { x: Math.max(d.xWert(nA), d.xWert(hm)) + 0.12, y: d.katMitte(0) - 0.20, w: 1.3, h: 0.40, rolle: 'kernwert', valign: 'middle', name: 'Wert Gruppe A' });
    B.textAufPlot(s, fmt.euroDez(nF), { x: d.xWert(nF) + 0.12, y: d.katMitte(1) - 0.20, w: 1.3, h: 0.40, rolle: 'kernwert', valign: 'middle', name: 'Wert frei finanziert' });
    B.marke(s, { x: d.xWert(hm), y: d.katMitte(0) - bh / 2 - 0.32, h: bh + 0.44, art: 'mass', text: `Höchstmiete ${fmt.euroDez(hm)}`, textSeite: 'oben', textBreite: 2.0 });
    B.marke(s, { x: d.xWert(markt), y: d.katMitte(1) - bh / 2 - 0.32, h: bh + 0.44, art: 'mass', text: `Marktmiete ${fmt.euroDez(markt)}`, textSeite: 'rechts', textBreite: 2.0 });   // rechts der Linie: oben läge die Zeile unter dem Wert von A
    B.hinweis(s, { x: cz.x, y: Y.inhaltEnde, unten: true, w: cz.w, name: 'DSCR', text: hinweis });

    // Seit 16.11.2026 (Wunsch des Auftraggebers): rechts dieselbe Reihenfolge wie im Diagramm, erst Gruppe A, dann frei finanziert; beide in 44 pt
    B.hauptzahl(s, { vorsatz: 'Gruppe A', zahl: fmt.dez(luft, 2), einheit: '€ je m²', label: wl('Luft unter der Höchstmiete', 'Nebenzahl'),
      text: wl(`DSCR ${fmt.dez(dA, 2)} zur Höchstmiete, die bei ${fmt.prozent(anteil, 0)} der Marktmiete liegt.`, 'Nebenzahl') });
    B.nebenzahl(s, { vorsatz: 'Frei finanziert', zahl: fmt.dez(luecke, 2), einheit: '€ je m²', label: wl('fehlen am Markt', 'Hauptzahl') });
  },
};
