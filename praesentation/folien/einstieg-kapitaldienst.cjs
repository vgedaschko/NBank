// Folie 5 · PGN_DIAGRAMM mit freier Lage des Diagramms: Kapitaldienst je m² Wohnfläche und Monat, Q1 2020 gegen heute, frei finanziert.
// Links ein natives gestapeltes Säulendiagramm mit zwei Säulen: „Q1 2020“ und „Heute“; die zweite ist gestapelt aus dem Stand Q1 2020 und den
// drei Ursachen des Anstiegs (Baukosten, Zins, Wechselwirkung). Eine senkrechte Maßlinie fasst den Anstieg, rechts der Säule steht je Ursache
// Bezeichnung, Betrag, Anteil am Anstieg und eine Zeile Erklärung. Rechts die Hauptzahl der Folie und darunter der Rechenweg als kleine Tabelle
// (Kosten, Fremdkapital, Sollzins: die Kette von den Folien 3 und 4 zum Kapitaldienst).
// Gerechnet wird nach der Methode der Rechenmappe: Annuitätendarlehen mit jährlicher Annuität, Faktor = i ÷ (1 − (1 + i)^−n). Kosten und Zins
// Q1 2020 aus daten/markt.json (ARGE-Mediane und Zinsreihe der Altfassung, nicht nachgeprüft), Zins heute und Laufzeit aus daten/werte.json.
// Die Folie ist keine Modellrechnung (kein Stempel): Medianwerte deutscher Großstädte je m², kein einzelnes Haus. Kein Rot im Diagramm.
'use strict';

module.exports = {
  id: 'einstieg-kapitaldienst',
  bau(ctx) {
    const { B, D, W, X, fmt, colX, span, P } = ctx, s = ctx.folie(), M = k => W('modellhaus', k), K = p => X('markt', p), wl = (t, was) => ctx.wortlaut(t, was);

    // ---- Rechnung ---------------------------------------------------------------------------------------------------------------
    const n = M('eingabe.laufzeit_bank'), iHeute = M('eingabe.zins_bank'), zins2020 = K('kapitaldienst.zins_q1_2020'), fk = K('kapitaldienst.fremdkapital');
    const af = i => i / (1 - Math.pow(1 + i, -n));
    const kosten = ['q1_2020', 'q4_2025'].map(q => K(`baukosten.herstellung.${q}`) + K(`baukosten.grundstueck.${q}`));
    // Faktoren wie in daten/pruefung.json: Q1 2020 aus der Datendatei, heute aus der Mappe (Annuität ÷ Bankdarlehen); beide gegen die Formel geprüft
    const faktor = [K('kapitaldienst.annuitaetenfaktor_q1_2020'), M('frei.annuitaet') / M('fin.bankdarlehen.Frei')];
    ctx.gleich('Annuitätenfaktor Q1 2020 (Datendatei gegen Formel)', faktor[0], af(zins2020 / 100), 9);
    ctx.gleich('Annuitätenfaktor heute (Mappe gegen Formel)', faktor[1], af(iHeute), 9);
    ctx.gleich('Probe der Methode am Modellhaus: Bankdarlehen × Faktor gegen die Annuität der Mappe', M('fin.bankdarlehen.Frei') * af(iHeute), M('frei.annuitaet'), 2);
    const marken = K('zinsen.marken'), z10 = K('zinsen.z10');
    ctx.gleich('Zins Q1 2020 gegen das Quartalsmittel der Folie 4', zins2020, marken[0].z10);
    ctx.gleich('Zins heute (Mappe) gegen den letzten Monatswert der Reihe „10 Jahre“', iHeute * 100, z10[z10.length - 1]);
    ctx.gleich('Fremdkapitalanteil gegen das Modellhaus frei finanziert', fk, M('fin.bankdarlehen.Frei') / M('fin.gesamtkosten.Frei'), 4);
    const kd = kosten.map((k, i) => fk * k * faktor[i] / 12), mehr = kosten[1] - kosten[0], anstieg = kd[1] - kd[0];
    const teile = [
      { name: 'Baukosten', art: 'tinte', wert: fk * mehr * faktor[0] / 12, text: 'höhere Kosten zum Zins von 2020' },
      { name: 'Zins', art: 'referenz', wert: fk * kosten[0] * (faktor[1] - faktor[0]) / 12, text: 'höherer Zins auf die Kosten von 2020' },
      { name: 'Wechselwirkung', art: 'C', wert: fk * mehr * (faktor[1] - faktor[0]) / 12, text: 'höherer Zins auf die höheren Kosten' }];
    ctx.gleich('Baukosten, Zins und Wechselwirkung gegen den Anstieg', teile.reduce((a, t) => a + t.wert, 0), anstieg, 9);
    if (teile.reduce((a, t) => a + Math.round(t.wert / anstieg * 100), 0) !== 100) P.melde('Die gerundeten Anteile am Anstieg ergeben nicht 100 %.');
    for (const v of kd) if (!ctx.glatt(ctx.o.titel).includes(fmt.dez(v))) P.melde(`Titel der Folie nennt den Kapitaldienst nicht mit ${fmt.dez(v)}.`);
    if (!ctx.o.titel.includes(String(K('baukosten.von_jahr')))) P.melde(`Titel der Folie nennt das Jahr ${K('baukosten.von_jahr')} nicht.`);

    // ---- Diagramm über acht Spalten ------------------------------------------------------------------------------------------
    const staende = [K('baukosten.reihen')[0], 'Heute'], x0 = colX(1), w8 = span(8);
    B.diagrammkopf(s, { titel: wl('Kapitaldienst je m² und Monat, frei finanziert', 'Diagrammtitel'), sub: wl(`in € · ARGE-Median deutscher Großstädte · Annuität ${n} Jahre · Anteile am Anstieg in %`, 'Untertitel') });   // ohne „über“: knapp 10 % Luft im einzeiligen Platzhalter
    // Freie Lage bis zum Ende der Inhaltszone (die Grundlinie der Säulen liegt wie auf den Folien 4 und 6 bei y 6,04); die Plotfläche ist 3,30 Zoll
    // breit, rechts davon stehen die Ursachen des Anstiegs und die Notiz
    const PLOT_W = 3.30, ACHSE = { min: 0, max: 24, schritt: 4, format: 'roh' }, yD = 2.76, hD = ctx.Y.inhaltEnde - yD;
    const d = D.stapelSaeulen(s, { x: x0, y: yD, w: w8, h: hD, kategorien: staende, labels: false, rand: { r: w8 - 0.62 - PLOT_W, o: 0.22, u: 0.46 }, achse: ACHSE, name: 'Diagramm Kapitaldienst je m² und Monat',
      altText: `Gestapeltes Säulendiagramm: Kapitaldienst je m² Wohnfläche und Monat, ${staende[0]} ${fmt.euroDez(kd[0])}, heute ${fmt.euroDez(kd[1])}; ` +
        `vom Anstieg entfallen ${teile.map(t => `${fmt.euroDez(t.wert)} auf ${t.name}`).join(', ')}`,
      reihen: [{ name: wl(`Stand ${staende[0]}`, 'Reihe'), art: 'bisher', werte: [kd[0], kd[0]] }, ...teile.map(t => ({ name: t.name, art: t.art, werte: [0, t.wert] }))] });
    const links = i => d.katMitte(i) - d.saeulenBreite / 2, rechts = i => d.katMitte(i) + d.saeulenBreite / 2;

    // Summen über den Säulen
    kd.forEach((v, i) => B.textAufPlot(s, wl(fmt.euroDez(v), 'Summe'), { x: d.katMitte(i) - 0.60, y: d.yWert(v) - 0.33, w: 1.20, h: 0.26, rolle: 'wertGross', align: 'center', valign: 'middle', name: 'Summe ' + staende[i] }));
    // Anstieg: Bezugslinie auf der Höhe des Stands Q1 2020 und senkrechte Maßlinie zwischen den Säulen
    B.linie(s, { x: rechts(0), y: d.yWert(kd[0]), w: links(1) - rechts(0), art: 'mass', strich: 'dash', name: 'Bezugslinie Stand ' + staende[0] });
    B.massketteSenkrecht(s, { x: links(1) - 0.17, y0: d.yWert(kd[1]), y1: d.yWert(kd[0]), text: wl('+' + fmt.euroDez(anstieg), 'Maßlinie'), seite: 'links', name: 'Maßkette Anstieg' });

    // Ursachen rechts der Säule „Heute“, von oben nach unten wie im Stapel; die Zeilen sind auf Abstand entzerrt
    // Die Zuleitung läuft waagerecht auf der Höhe der ersten Zeile, solange diese Höhe im Segment liegt (sonst mit Knick von der Segmentmitte)
    let fuss = kd[0];
    const mitten = teile.map(t => { const y = d.yWert(fuss + t.wert / 2); fuss += t.wert; return y; }), halb = teile.map(t => (d.yWert(0) - d.yWert(t.wert)) / 2);
    const lagen = B.entzerre(mitten, 0.56), xL = rechts(1) + 0.42, xB = xL + 1.52, wE = x0 + w8 - xL;
    teile.forEach((t, i) => {
      const y = lagen[i], betrag = wl(`+${fmt.euroDez(t.wert)} · ${fmt.prozent(t.wert / anstieg)}`, `Betrag ${t.name}`), imSegment = Math.abs(y - mitten[i]) < halb[i] - 0.04;
      B.zuleitung(s, { x0: rechts(1) + 0.04, y0: imSegment ? y : mitten[i], x1: xL - 0.08, y1: y, xKnick: rechts(1) + 0.20, name: 'Zuleitung ' + t.name });
      B.bezeichnungMitWert(s, { y: y - 0.11, bezeichnung: { text: wl(t.name, 'Ursache'), x: xL, w: xB - xL - 0.06, name: 'Ursache ' + t.name }, wert: { text: betrag, x: xB, w: x0 + w8 - xB, name: 'Betrag ' + t.name } });
      B.text(s, wl(t.text, `Erklärung ${t.name}`), { x: xL, y: y + 0.12, w: wE, h: 0.22, rolle: 'klein', valign: 'middle', einzeilig: true, name: 'Erklärung ' + t.name });
    });

    // Notiz in der Spalte der Ursachen, unten bündig mit der Grundlinie der Säulen
    const notiz = [`Heute: Kosten ${K('baukosten.reihen')[1]}, Zins ${fmt.monatWort(K('zinsen.monate').slice(-1)[0])}.`, 'Kapitaldienst: Zins und Tilgung.'].map(z => wl(z, 'Notiz zum Diagramm')).join('\n');
    const hN = B.hoehe(notiz, { w: wE, rolle: 'klein' });
    B.text(s, notiz, { x: xL, y: d.yWert(0) - hN + 0.03, w: wE, h: hN, rolle: 'klein', valign: 'bottom', name: 'Notiz zum Diagramm' });

    // ---- Rechte Spalte: Hauptzahl und Rechenweg ------------------------------------------------------------------------------------
    B.hauptzahl(s, { gross: true, vorsatz: wl('Heute', 'Vorsatz'), zahl: fmt.dez(kd[1]), einheit: '€', label: wl('Kapitaldienst je m² und Monat', 'Label') });
    const g = B.zweitesModul(s, { titel: wl('Rechenweg je m² Wohnfläche', 'Modultitel'), name: 'Rechenweg' });
    // Die Kopfzeile der Tabelle ist links leer; sie beginnt deshalb schon unter der Grundlinie des Modultitels
    const tab = B.tabelle(s, { x: g.x, y: g.y + 0.30, w: g.w, pt: 14, name: 'Tabelle Rechenweg',
      spalten: [{ kopf: '', art: 'text' }, { kopf: staende[0], breite: 0.95, art: 'zahl' }, { kopf: staende[1], breite: 0.95, art: 'zahl' }], zeilen: [
        [wl('Grundstück und Herstellung', 'Rechenweg'), ...kosten.map(k => wl(fmt.euro(k), 'Rechenweg'))],
        [wl('× Fremdkapital', 'Rechenweg'), fmt.prozent(fk), fmt.prozent(fk)],
        [wl('Sollzins p. a.', 'Rechenweg'), wl(fmt.prozentWert(zins2020, 2), 'Rechenweg'), wl(fmt.prozent(iHeute, 2), 'Rechenweg')]] });
    if (tab.unten > g.ende + 0.005) P.melde(`Tabelle Rechenweg endet bei y ${tab.unten.toFixed(2)}, die Inhaltszone bei ${g.ende.toFixed(2)}.`);
  },
};
