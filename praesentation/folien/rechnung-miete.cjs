// Folie 19 · PGN_INHALT_MR im Raster 5 + 7: kostendeckende Anfangsmiete in Jahr 1 als Balkenpaar (gefördert in Tinte, frei finanziert in
// Referenzgrau, Reihenfolge und Farben wie Folie 16), Werte als Kernwerte am Balkenende, Maßlinie bei der Höchstmiete der Gruppe A.
// Rechts der Rechenweg der kostendeckenden Anfangsmiete als Tabelle (Kapitaldienst plus Bewirtschaftung plus Mietausfall ergibt die
// kostendeckende Sollmiete, geteilt durch Wohnfläche und zwölf Monate) mit den Annahmen der freien Finanzierung als Untertitel; bis zum
// Lektorat vom 11.11.2026 stand dort die Vergleichstabelle der Broschüre S. 11, deren Zahlen Folie 16 schon zeigt.
// Seit der Änderungsrunde vom 13.11.2026 (F19.1 bis F19.4, G4): Begriff „kostendeckende Anfangsmiete“ statt „nötige Miete“, Mietausfall als
// eigene Zeile des Rechenwegs, Rechenweg breiter (sieben Spalten statt sechs), Diagramm schmaler (fünf Spalten; sein Untertitel steht deshalb
// in zwei Zeilen). Die Tabelle bleibt in 16 pt: In sieben Spalten passt sie.
// Kein Rot im Diagramm. Alle Zahlen aus werte.json (Lauf modellhaus).
'use strict';

module.exports = {
  id: 'rechnung-miete',
  bau(ctx) {
    const { B, D, W, fmt, colX, span, Y } = ctx, s = ctx.folie(), M = k => W('modellhaus', k), wl = (t, was) => ctx.wortlaut(t, was);
    B.register(s, '2.1');

    // Balkenpaar über fünf Spalten. Der Untertitel passt dort nicht in eine Zeile und steht in zwei (gekürzt wird nicht); Diagramm und Plotfläche
    // enden auf derselben Höhe wie bis 13.11.2026
    const sub = ['Miete je m² und Monat,', 'bei der der Zahlungsüberschuss null ist'];
    wl(sub.join(' '), 'Untertitel');
    B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: span(5), titel: wl('Kostendeckende Anfangsmiete in Jahr 1', 'Diagrammtitel'), sub: sub[0] });
    B.text(s, sub[1], { x: colX(1), y: Y.inhalt + 0.64, w: span(5), h: 0.22, rolle: 'sub', valign: 'top', einzeilig: true, name: 'Modul-Untertitel 2' });
    const yInhalt = Y.inhalt + 0.98, werte = [M('dscr.noetige_miete.A'), M('dscr.noetige_miete.Frei')], yChart = yInhalt + 0.10, chartUnten = Y.inhalt + 0.76 + 0.10 + 3.40;
    const d = D.balkenpaar(s, { x: colX(1), y: yChart, w: span(5), h: +(chartUnten - yChart).toFixed(3), kategorien: ['Gefördert, Gruppe A', 'Frei finanziert'], werte, arten: ['tinte', 'referenz'],
      reihenname: 'Kostendeckende Anfangsmiete', achse: { min: 0, max: 18, schritt: 3, format: 'roh' }, katBreite: 1.55, rand: { o: 0.52, r: 0.30, u: 0.50 }, name: 'Diagramm Kostendeckende Anfangsmiete' });
    B.achsentitel(s, d, { x: ctx.wortlaut('Miete in € je m² und Monat', 'Achsentitel') });
    // kurzer Balken: Wert rechts daneben (auf einer Fläche in der Grundfarbe, die die Gitterlinie hinter der Zahl unterbricht);
    // langer Balken: Wert weiß im Balkenende. Liegt die Höchstmiete so dicht rechts vom kurzen Balken, dass ihre Maßlinie durch die Zahl
    // liefe, steht die Zahl rechts der Maßlinie.
    const hm = M('fin.miete_jahr1.A'), xNeben = d.xWert(werte[0]) + 0.14, xWertA = d.xWert(hm) > xNeben - 0.06 && d.xWert(hm) < xNeben + 1.5 ? d.xWert(hm) + 0.12 : xNeben;
    if (!(werte[0] < hm && hm < werte[1])) ctx.P.melde('Die Höchstmiete der Gruppe A liegt nicht zwischen der kostendeckenden Anfangsmiete gefördert und frei finanziert; Marke der Folie 19 anpassen.');
    B.textAufPlot(s, fmt.euroDez(werte[0]), { x: xWertA, y: d.katMitte(0) - 0.20, w: 1.5, h: 0.40, rolle: 'kernwert', valign: 'middle', name: 'Wert am Balken gefördert' });
    B.text(s, fmt.euroDez(werte[1]), { x: d.xWert(werte[1]) - 1.74, y: d.katMitte(1) - 0.20, w: 1.6, h: 0.40, rolle: 'kernwert', farbe: 'FFFFFF', align: 'right', valign: 'middle', einzeilig: true, name: 'Wert am Balken frei finanziert' });
    // Die Beschriftung der Marke steht links der Linie über dem Balken „gefördert“: Rechts reichte sie im schmaleren Diagramm bis an den Rechenweg
    B.marke(s, { x: d.xWert(hm), y: d.plot.y - 0.32, h: d.plot.h + 0.32, art: 'mass', text: `Höchstmiete Gruppe A: ${fmt.euroDez(hm)}`, textSeite: 'links', textBreite: 2.4 });

    // Rechenweg über sieben Spalten; die Unterkante steht auf der Grundlinie des Diagramms. Der Untertitel nennt Zins und Tilgungsform des
    // Bankdarlehens, an denen Kapitaldienst und kostendeckende Anfangsmiete der Spalte „Frei finanziert“ hängen.
    // Kostendeckende Sollmiete = Kapitaldienst + Objektverwaltung + Instandhaltung + Mietausfall (Anteil der Sollmiete);
    // kostendeckende Anfangsmiete = Sollmiete ÷ Wohnfläche ÷ 12 Monate
    const annahme = wl(`Frei finanziert: ${fmt.prozent(M('eingabe.zins_bank'), 2)} Zins, jährliche Annuität über ${M('eingabe.laufzeit_bank')} Jahre`, 'Untertitel der Tabelle');
    const yTab = B.modulkopf(s, { x: colX(6), y: Y.inhalt, w: span(7), titel: wl('Rechenweg', 'Tabellentitel'), sub: annahme }) - 0.06;
    const kd = [M('dscr.kapitaldienst_jahr1.A'), M('dscr.kapitaldienst_jahr1.Frei')];
    const bew = ['A', 'Frei'].map(g => M(`jr1.objektverwaltung.${g}`) + M(`jr1.instandhaltung.${g}`));
    const flaeche = M('eingabe.wohnflaeche'), satz = M('eingabe.mietausfall');
    const soll = werte.map(v => v * flaeche * 12), ausfall = soll.map(v => satz * v);
    // Gegenproben: Die Zeilen ergeben die kostendeckende Sollmiete (Kapitaldienst und Bewirtschaftung ÷ Anteil nach Mietausfall, Übersicht 8.3),
    // und die gerundeten Zeilen gehen in der Summe auf
    soll.forEach((v, i) => ctx.gleich(`Rechenweg der kostendeckenden Anfangsmiete, Spalte ${i + 1}`, (kd[i] + bew[i]) / (1 - satz), v, 2));
    soll.forEach((v, i) => ctx.gleich(`Rechenweg, gerundete Summe, Spalte ${i + 1}`, Math.round(kd[i]) + Math.round(bew[i]) + Math.round(ausfall[i]), Math.round(v), 0));
    const zeilen = [
      { text: 'Kapitaldienst p. a.', wert: fmt.euro(kd[0]), vergleich: fmt.euro(kd[1]) },
      { text: '+ Bewirtschaftung', wert: fmt.euro(bew[0]), vergleich: fmt.euro(bew[1]) },
      { text: `+ Mietausfall, ${fmt.prozent(satz)}`, wert: fmt.euro(ausfall[0]), vergleich: fmt.euro(ausfall[1]) },
      { text: '= kostendeckende Sollmiete p. a.', wert: fmt.euro(soll[0]), vergleich: fmt.euro(soll[1]), ergebnis: true },
      // Ergebniszeile in der Größe der Tabelle: Groß stehen die beiden Werte einmal, an den Balken links
      { text: `÷ ${fmt.qm(flaeche)} ÷ 12 Monate`, wert: fmt.euroDez(werte[0]), vergleich: fmt.euroDez(werte[1]), ergebnis: true }];
    zeilen.forEach((z, i) => { wl(z.text, `Rechenweg, Zeile ${i + 1}`); wl(z.wert, `Rechenweg, Zeile ${i + 1}`); wl(z.vergleich, `Rechenweg, Zeile ${i + 1}`); });
    const kopfH = 0.56, frei = d.plot.y + d.plot.h - yTab - kopfH;   // fünf gleich hohe Zeilen in der freien Höhe
    zeilen.forEach(z => { z.h = +(frei / zeilen.length).toFixed(3); });
    B.vergleichstabelle(s, { x: colX(6), y: yTab, w: span(7), wertBreite: 1.50, kopf: ['Jahr 1', 'Gefördert\n(A)', 'Frei\nfinanziert'], zeilen, name: 'Tabelle Rechenweg' });
  },
};
