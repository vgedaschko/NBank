// Folie 19 · PGN_INHALT_MR im Raster 6 + 6 (die Bezeichnungen der Tabelle „Kapitaldienst p. a.“ und „Nötige Miete je m²“ stehen so einzeilig): nötige Miete in Jahr 1 als Balkenpaar (gefördert in Tinte, frei finanziert in Referenzgrau,
// Reihenfolge und Farben wie Folie 16), Werte als Kernwerte am Balkenende, Maßlinie bei der Höchstmiete der Gruppe A.
// Rechts der Rechenweg der nötigen Miete als Tabelle (Kapitaldienst plus Bewirtschaftung, geteilt durch die vermietete Fläche im Jahr) mit den Annahmen der
// freien Finanzierung als Untertitel; bis zum Lektorat vom 11.11.2026 stand dort die Vergleichstabelle der Broschüre S. 11, deren Zahlen Folie 16 schon zeigt.
// Kein Rot im Diagramm. Alle Zahlen aus werte.json (Lauf modellhaus).
'use strict';

module.exports = {
  id: 'rechnung-miete',
  bau(ctx) {
    const { B, D, W, fmt, colX, span, Y } = ctx, s = ctx.folie(), M = k => W('modellhaus', k), wl = (t, was) => ctx.wortlaut(t, was);
    B.register(s, '2.1');

    // Balkenpaar über sechs Spalten
    const yInhalt = B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: span(6), titel: 'Nötige Miete in Jahr 1', sub: 'Miete je m² und Monat, bei der der Zahlungsüberschuss null ist' });
    const werte = [M('dscr.noetige_miete.A'), M('dscr.noetige_miete.Frei')];
    const d = D.balkenpaar(s, { x: colX(1), y: yInhalt + 0.10, w: span(6), h: 3.40, kategorien: ['Gefördert, Gruppe A', 'Frei finanziert'], werte, arten: ['tinte', 'referenz'], reihenname: 'Nötige Miete',
      achse: { min: 0, max: 18, schritt: 3, format: 'roh' }, katBreite: 1.55, rand: { o: 0.52, r: 0.30 }, name: 'Diagramm Nötige Miete' });
    // kurzer Balken: Wert rechts daneben (auf einer Fläche in der Grundfarbe, die die Gitterlinie hinter der Zahl unterbricht);
    // langer Balken: Wert weiß im Balkenende. Liegt die Höchstmiete so dicht rechts vom kurzen Balken, dass ihre Maßlinie durch die Zahl
    // liefe, steht die Zahl rechts der Maßlinie.
    const hm = M('fin.miete_jahr1.A'), xNeben = d.xWert(werte[0]) + 0.14, xWertA = d.xWert(hm) > xNeben - 0.06 && d.xWert(hm) < xNeben + 1.5 ? d.xWert(hm) + 0.12 : xNeben;
    if (!(werte[0] < hm && hm < werte[1])) ctx.P.melde('Die Höchstmiete der Gruppe A liegt nicht zwischen der nötigen Miete gefördert und frei finanziert; Marke und Notizen der Folie 19 anpassen.');
    B.textAufPlot(s, fmt.euroDez(werte[0]), { x: xWertA, y: d.katMitte(0) - 0.20, w: 1.5, h: 0.40, rolle: 'kernwert', valign: 'middle', name: 'Wert am Balken gefördert' });
    B.text(s, fmt.euroDez(werte[1]), { x: d.xWert(werte[1]) - 1.74, y: d.katMitte(1) - 0.20, w: 1.6, h: 0.40, rolle: 'kernwert', farbe: 'FFFFFF', align: 'right', valign: 'middle', einzeilig: true, name: 'Wert am Balken frei finanziert' });
    B.marke(s, { x: d.xWert(hm), y: d.plot.y - 0.32, h: d.plot.h + 0.32, art: 'mass', text: `Höchstmiete Gruppe A: ${fmt.euroDez(hm)}`, textSeite: 'rechts', textBreite: 2.4 });

    // Rechenweg über sechs Spalten; die Unterkante steht auf der Grundlinie des Diagramms. Der Untertitel nennt Zins und Laufzeit des
    // Bankdarlehens, an denen Kapitaldienst und nötige Miete der Spalte „Frei finanziert“ hängen.
    // Nötige Miete = (Kapitaldienst + Objektverwaltung + Instandhaltung) ÷ (Wohnfläche × 12 Monate × Anteil nach Mietausfall)
    const annahme = wl(`Frei finanziert: Bankdarlehen zu ${fmt.prozent(M('eingabe.zins_bank'), 2)}, Annuität ${M('eingabe.laufzeit_bank')} Jahre`, 'Untertitel der Tabelle');
    const yTab = B.modulkopf(s, { x: colX(7), y: Y.inhalt, w: span(6), titel: wl('Rechenweg', 'Tabellentitel'), sub: annahme }) - 0.06;
    const kd = [M('dscr.kapitaldienst_jahr1.A'), M('dscr.kapitaldienst_jahr1.Frei')];
    const bew = ['A', 'Frei'].map(g => M(`jr1.objektverwaltung.${g}`) + M(`jr1.instandhaltung.${g}`));
    const vermietet = 1 - M('eingabe.mietausfall'), teiler = vermietet * M('eingabe.wohnflaeche') * 12;
    // Gegenprobe: Der Rechenweg der Tabelle ergibt die nötige Miete der Mappe (Übersicht 8.3)
    werte.forEach((v, i) => ctx.gleich(`Rechenweg der nötigen Miete, Spalte ${i + 1}`, (kd[i] + bew[i]) / teiler, v, 4));
    const zeilen = [
      { text: 'Kapitaldienst p. a.', wert: fmt.euro(kd[0]), vergleich: fmt.euro(kd[1]) },
      { text: '+ Bewirtschaftung', wert: fmt.euro(bew[0]), vergleich: fmt.euro(bew[1]) },
      { text: `÷ m² × 12 × ${fmt.prozent(vermietet)}`, wert: fmt.zahl(teiler), vergleich: fmt.zahl(teiler) },
      { text: 'Nötige Miete je m²', wert: fmt.euroDez(werte[0]), vergleich: fmt.euroDez(werte[1]), kern: true }];
    zeilen.forEach((z, i) => { wl(z.text, `Rechenweg, Zeile ${i + 1}`); wl(z.wert, `Rechenweg, Zeile ${i + 1}`); wl(z.vergleich, `Rechenweg, Zeile ${i + 1}`); });
    const kopfH = 0.56, frei = d.plot.y + d.plot.h - yTab - kopfH, teil = [0.21, 0.21, 0.21, 0.37];   // Zeilenhöhen als Anteile der freien Höhe
    zeilen.forEach((z, i) => { z.h = +(frei * teil[i]).toFixed(3); });
    B.vergleichstabelle(s, { x: colX(7), y: yTab, w: span(6), wertBreite: 1.74, kopf: ['Jahr 1', 'Gefördert\n(A)', 'Frei\nfinanziert'], zeilen, name: 'Tabelle Rechenweg' });
  },
};
