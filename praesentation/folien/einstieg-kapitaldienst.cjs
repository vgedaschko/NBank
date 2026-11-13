// Folie 5 · PGN_DIAGRAMM mit freier Lage des Diagramms: Kapitaldienst je m² Wohnfläche und Monat, Q1 2020 gegen heute, frei finanziert.
// Links ein natives gestapeltes Säulendiagramm mit zwei schmalen Säulen: „Q1 2020“ und „Heute“; die zweite ist gestapelt aus dem Stand Q1 2020
// (helle Fläche) und den drei Ursachen des Anstiegs (Herstellungskosten, Zins, Wechselwirkung, drei Grautöne). Feine Zeichnung (D.stapelSaeulen mit
// fein: true): Jedes Segment trägt eine feine Kontur; das Diagramm steht ohne Größenachse und ohne Gitter, weil jeder Wert als Text daran steht.
// Eine senkrechte Maßlinie fasst den Anstieg, rechts der Plotfläche steht je Ursache Bezeichnung, Betrag, Anteil am Anstieg und eine Zeile
// Erklärung. Unter dem Diagramm steht der Hinweiskasten zum Stand (G8). Rechts Formel und Rechenweg statt der früheren Hauptzahl (F5.7).
// Seit der Änderungsrunde vom 13.11.2026 (F5.1, G12) rechnet die Folie nicht mehr im Modul: Alle Zahlen kommen aus der Rechenmappe, Blatt Tabellen,
// Tabelle 5 „Kapitaldienst je m² (Folie 5)“ (werte.json, Lauf modellhaus, Schlüssel kd5.*): nur Herstellungskosten (ohne Grundstück), jährliche
// Annuität über 30 Jahre wie die freie Finanzierung der Folie 16, 80 % Fremdkapital. Das Modul prüft die Eingaben der Tabelle gegen die Folien 3
// und 4 und rechnet Kapitaldienstsatz, Tilgung und Kapitaldienst nach. Bis 13.11.2026 rechnete die Folie mit Grundstück und monatlicher Rate.
// Die Folie ist keine Modellrechnung (weißer Grund, kein Papierton): Medianwerte deutscher Großstädte je m², kein einzelnes Haus. Rot im Diagramm nur an der
// Summe von heute: Das ist die Zahl, die das Signaturwort des Titels nennt.
'use strict';

module.exports = {
  id: 'einstieg-kapitaldienst',
  bau(ctx) {
    const { B, D, W, X, fmt, colX, span, P, Y, ZONE } = ctx, s = ctx.folie(), M = k => W('modellhaus', k), K = p => X('markt', p), wl = (t, was) => ctx.wortlaut(t, was);

    // ---- Werte der Rechenmappe (Tabelle 5) und Gegenproben ------------------------------------------------------------------------------
    const Q = ['q1_2020', 'heute'], T = (k, q) => M(`kd5.${k}.${q}`);
    const marken = K('zinsen.marken'), z10 = K('zinsen.z10');
    ctx.gleich('Herstellungskosten Q1 2020 (Mappe, Tabelle 5) gegen die Folie 3', T('herstellungskosten_qm', 'q1_2020'), K('baukosten.herstellung.q1_2020'), 2);
    ctx.gleich('Herstellungskosten heute (Mappe, Tabelle 5) gegen Q4 2025 der Folie 3', T('herstellungskosten_qm', 'heute'), K('baukosten.herstellung.q4_2025'), 2);
    ctx.gleich('Sollzins Q1 2020 (Mappe, Tabelle 5) gegen das Quartalsmittel der Folie 4', T('sollzins', 'q1_2020') * 100, marken[0].z10, 2);
    ctx.gleich('Sollzins Q1 2020 (Mappe, Tabelle 5) gegen daten/markt.json', T('sollzins', 'q1_2020') * 100, K('kapitaldienst.zins_q1_2020'), 2);
    ctx.gleich('Sollzins heute (Mappe, Tabelle 5) gegen den Bankzins der Mappe', T('sollzins', 'heute'), M('eingabe.zins_bank'), 6);
    ctx.gleich('Sollzins heute gegen den letzten Monatswert der Reihe „10 Jahre“', T('sollzins', 'heute') * 100, z10[z10.length - 1], 2);
    for (const q of Q) {
      ctx.gleich(`Laufzeit (${q}) gegen die Laufzeit des Bankdarlehens`, T('laufzeit', q), M('eingabe.laufzeit_bank'), 0);
      ctx.gleich(`Fremdkapitalanteil (${q}) gegen daten/markt.json`, T('fremdkapitalanteil', q), K('kapitaldienst.fremdkapital'), 4);
      // Jährliche Annuität: Kapitaldienstsatz = i ÷ (1 − (1 + i)^−n); Tilgung = Satz − Zins; Kapitaldienst je m² und Monat = Kosten × Anteil × Satz ÷ 12
      const i = T('sollzins', q), n = T('laufzeit', q), satz = i / (1 - Math.pow(1 + i, -n));
      ctx.gleich(`Kapitaldienstsatz (${q}) gegen die jährliche Annuität`, T('kapitaldienstsatz', q), satz, 9);
      ctx.gleich(`Anfängliche Tilgung (${q}) gegen Kapitaldienstsatz minus Sollzins`, T('tilgung', q), satz - i, 9);
      ctx.gleich(`Kapitaldienst (${q}) gegen Kosten × Fremdkapitalanteil × Kapitaldienstsatz ÷ 12`, T('kapitaldienst', q), T('herstellungskosten_qm', q) * T('fremdkapitalanteil', q) * satz / 12, 9);
      // Der Rechenweg zeigt Tilgung und Kapitaldienstsatz mit drei Nachkommastellen (Rückfrage 1): Mit den gezeigten Zahlen geht er auf den Cent auf
      const gezeigt = Math.round(T('herstellungskosten_qm', q)) * T('fremdkapitalanteil', q) * (Math.round(satz * 1e5) / 1e5) / 12;
      if (fmt.dez(gezeigt) !== fmt.dez(T('kapitaldienst', q))) P.melde(`Rechenweg ${q}: Mit den gezeigten Zahlen ergeben sich ${fmt.dez(gezeigt)} €, die Mappe nennt ${fmt.dez(T('kapitaldienst', q))} €.`);
    }
    const kd = Q.map(q => T('kapitaldienst', q)), anstieg = M('kd5.anstieg');
    ctx.gleich('Anstieg gegen heute minus Q1 2020', anstieg, kd[1] - kd[0], 9);
    // Der Stand von früher ist der Bezugswert (helle Fläche); die drei Ursachen des Anstiegs stehen darüber in drei Grautönen, von unten nach oben heller
    const teile = [
      { k: 'herstellungskosten', name: 'Herstellungskosten', art: 'referenz', text: 'höhere Kosten zum Zins von 2020' },
      { k: 'zins', name: 'Zins', art: 'bisher', text: 'höherer Zins auf die Kosten von 2020' },
      { k: 'wechselwirkung', name: 'Wechselwirkung', art: 'licht', text: 'höherer Zins auf die höheren Kosten' }]
      .map(t => ({ ...t, wert: M('kd5.zerlegung.' + t.k), anteil: M('kd5.anteil.' + t.k) }));
    ctx.gleich('Herstellungskosten, Zins und Wechselwirkung gegen den Anstieg', teile.reduce((a, t) => a + t.wert, 0), anstieg, 9);
    teile.forEach(t => ctx.gleich(`Anteil ${t.name} gegen Betrag ÷ Anstieg`, t.anteil, t.wert / anstieg, 9));
    if (teile.reduce((a, t) => a + Math.round(t.anteil * 100), 0) !== 100) P.melde('Die gerundeten Anteile am Anstieg ergeben nicht 100 %.');
    for (const v of kd) if (!ctx.glatt(ctx.o.titel).includes(fmt.dez(v))) P.melde(`Titel der Folie nennt den Kapitaldienst nicht mit ${fmt.dez(v)}.`);
    if (!ctx.o.titel.includes(String(K('baukosten.von_jahr')))) P.melde(`Titel der Folie nennt das Jahr ${K('baukosten.von_jahr')} nicht.`);

    // ---- Diagramm über sieben Spalten ----------------------------------------------------------------------------------------
    const staende = [K('baukosten.reihen')[0], 'Heute'], x0 = colX(1), w8 = span(7);
    const kopf = B.diagrammkopf(s, { titel: wl('Kapitaldienst je m² und Monat, frei finanziert', 'Diagrammtitel'), sub: wl('in €, ARGE-Median deutscher Großstädte, ohne Grundstück', 'Untertitel') });
    // Hinweiskasten unter dem Diagramm, so breit wie das Diagramm, an der Unterkante der Inhaltszone (G8, F5.6). Das Diagramm endet 0,12 darüber
    const hinweis = wl(`Kosten ${K('baukosten.reihen')[1]}, Zins ${fmt.monatKurz(K('zinsen.monate').slice(-1)[0])}`, 'Hinweiskasten');
    const yHinweis = +(Y.inhaltEnde - B.hinweisHoehe(hinweis, { w: w8 })).toFixed(3);
    // Freie Lage bis über den Hinweiskasten. Das Diagramm beginnt 0,14 höher als die Vorgabe mit Legende: Diese Folie hat keine Legendenzeile.
    // Schmale Säulen (0,68 Zoll) mit feiner Kontur, ohne Größenachse und Gitter (Maßstab 0 bis 20 €); rechts der Plotfläche stehen die Ursachen
    const PLOT_W = 3.40, SAEULE = 0.68, ACHSE = { min: 0, max: 20, schritt: 2, format: 'roh' }, yD = kopf.chart.y - 0.14, hD = +(yHinweis - 0.12 - yD).toFixed(3);
    const d = D.stapelSaeulen(s, { x: x0, y: yD, w: w8, h: hD, kategorien: staende, labels: false, fein: true, saeule: SAEULE, gitter: false, rand: { l: 0, r: w8 - PLOT_W }, achse: ACHSE,
      name: 'Diagramm Kapitaldienst je m² und Monat',
      altText: `Gestapeltes Säulendiagramm: Kapitaldienst je m² Wohnfläche und Monat, ${staende[0]} ${fmt.euroDez(kd[0])}, heute ${fmt.euroDez(kd[1])}; ` +
        `vom Anstieg entfallen ${teile.map(t => `${fmt.euroDez(t.wert)} auf ${t.name}`).join(', ')}`,
      reihen: [{ name: wl(`Stand ${staende[0]}`, 'Reihe'), art: 'bezug', werte: [kd[0], kd[0]] }, ...teile.map(t => ({ name: t.name, art: t.art, werte: [0, t.wert] }))] });
    const links = i => d.katMitte(i) - d.saeulenBreite / 2, rechts = i => d.katMitte(i) + d.saeulenBreite / 2;

    // Summen über den Säulen in der Größe der Werte an allen Diagrammen (12 pt). Die Summe von heute in Rot wie das Signaturwort des Titels, die
    // von früher in Tinte: Der Titel nennt auch sie
    kd.forEach((v, i) => B.text(s, wl(fmt.euroDez(v), 'Summe'), { x: d.katMitte(i) - 0.60, y: d.yWert(v) - 0.27, w: 1.20, h: 0.22, rolle: 'wert', farbe: i === 1 ? 'akzent' : undefined, align: 'center', valign: 'middle',
      einzeilig: true, name: 'Summe ' + staende[i] }));
    // Anstieg: Bezugslinie (Haarlinie) auf der Höhe des Stands Q1 2020 und senkrechte Maßlinie zwischen den Säulen
    B.linie(s, { x: rechts(0), y: d.yWert(kd[0]), w: links(1) - rechts(0), art: 'mass', pt: 0.5, strich: 'dash', name: 'Bezugslinie Stand ' + staende[0] });
    B.massketteSenkrecht(s, { x: links(1) - 0.26, y0: d.yWert(kd[1]), y1: d.yWert(kd[0]), text: wl('+' + fmt.euroDez(anstieg), 'Maßlinie'), seite: 'links', name: 'Maßkette Anstieg' });

    // Ursachen rechts der Säule „Heute“, von oben nach unten wie im Stapel; die Zeilen sind auf Abstand entzerrt.
    // Die Zuleitung läuft als Haarlinie waagerecht auf der Höhe der ersten Zeile, solange diese Höhe im Segment liegt (sonst mit Knick von der Segmentmitte)
    let fuss = kd[0];
    const mitten = teile.map(t => { const y = d.yWert(fuss + t.wert / 2); fuss += t.wert; return y; }), halb = teile.map(t => (d.yWert(0) - d.yWert(t.wert)) / 2);
    const lagen = B.entzerre(mitten, 0.56), xL = d.plot.x + d.plot.w + 0.16, xB = xL + 1.72, wE = x0 + w8 - xL;   // 1,72: „Herstellungskosten“ braucht 1,60 Zoll
    teile.forEach((t, i) => {
      const y = lagen[i], betrag = wl(`+${fmt.euroDez(t.wert)} · ${fmt.prozent(t.anteil)}`, `Betrag ${t.name}`), imSegment = Math.abs(y - mitten[i]) < halb[i] - 0.04;
      B.zuleitung(s, { x0: rechts(1) + 0.05, y0: imSegment ? y : mitten[i], x1: xL - 0.08, y1: y, xKnick: rechts(1) + 0.22, name: 'Zuleitung ' + t.name });
      B.bezeichnungMitWert(s, { y: y - 0.11, bezeichnung: { text: wl(t.name, 'Ursache'), x: xL, w: xB - xL - 0.06, name: 'Ursache ' + t.name }, wert: { text: betrag, x: xB, w: x0 + w8 - xB, name: 'Betrag ' + t.name } });
      B.text(s, wl(t.text, `Erklärung ${t.name}`), { x: xL, y: y + 0.12, w: wE, h: 0.22, rolle: 'klein', valign: 'middle', einzeilig: true, name: 'Erklärung ' + t.name });
    });
    if (lagen[lagen.length - 1] + 0.34 > yHinweis - 0.04) P.melde('Die Erklärung der untersten Ursache läuft in den Hinweiskasten.');
    B.hinweis(s, { x: x0, y: Y.inhaltEnde, w: w8, text: hinweis, unten: true });

    // ---- Rechte Spalte: Formel und Rechenweg (F5.7, statt der Hauptzahl) ----------------------------------------------------------------
    // Der Modultitel steht auf der Höhe des Diagrammtitels unter der Modulkopf-Linie des Layouts, die Unterzeile auf der Höhe des Untertitels:
    // Sie nennt die Methode einmal (Rückfrage 21). Darunter die Formel in 14 pt und die Tabelle mit den Spalten „Q1 2020“ und „Heute“.
    const sp = ZONE.diagramm.kommentar;
    B.text(s, wl('Rechenweg je m² Wohnfläche', 'Modultitel'), { x: sp.x, y: ZONE.diagramm.titel, w: sp.w, h: 0.30, rolle: 'modultitel', valign: 'middle', einzeilig: true, name: 'Modultitel Rechenweg' });
    B.text(s, wl(`jährliche Annuität über ${T('laufzeit', 'heute')} Jahre`, 'Unterzeile Rechenweg'), { x: sp.x, y: ZONE.diagramm.sub, w: sp.w, h: 0.22, rolle: 'sub', einzeilig: true, name: 'Modul-Untertitel Rechenweg' });
    const formel = ['Kapitaldienst je m² und Monat', '= Herstellungskosten × Fremdkapitalanteil', '× Kapitaldienstsatz ÷ 12'];
    wl(formel.join(' '), 'Formel');
    const f = B.text(s, formel.join('\n'), { x: sp.x, y: ZONE.diagramm.legende + 0.02, w: sp.w, rolle: 'dicht', name: 'Formel' });
    const proz3 = v => fmt.prozent(v, 3), proz2 = v => fmt.prozent(v, 2);
    const zeile = (text, werte, opt = {}) => ({ zellen: [wl(text, 'Rechenweg'), ...werte.map(v => wl(v, 'Rechenweg'))], ...opt });
    const tab = B.tabelle(s, { x: sp.x, y: f.unten + 0.12, w: sp.w, pt: 14, name: 'Tabelle Rechenweg',
      spalten: [{ kopf: '', art: 'text', randRechts: 0.02 }, { kopf: staende[0], breite: 0.92, art: 'zahl', randRechts: 0.04 }, { kopf: staende[1], breite: 0.92, art: 'zahl', randRechts: 0.02 }], zeilen: [
        zeile('Herstellungskosten je m²', Q.map(q => fmt.euro(T('herstellungskosten_qm', q)))),
        zeile('× Fremdkapitalanteil', Q.map(q => fmt.prozent(T('fremdkapitalanteil', q)))),
        zeile('Sollzins p. a.', Q.map(q => proz2(T('sollzins', q)))),
        zeile('+ anfängliche Tilgung', Q.map(q => proz3(T('tilgung', q))), { trennlinie: true }),
        zeile('= Kapitaldienstsatz', Q.map(q => proz3(T('kapitaldienstsatz', q)))),
        zeile('Kapitaldienst je m² und Monat', Q.map(q => fmt.euroDez(T('kapitaldienst', q))))] });
    if (tab.unten > Y.inhaltEnde + 0.005) P.melde(`Tabelle Rechenweg endet bei y ${tab.unten.toFixed(2)}, die Inhaltszone bei ${Y.inhaltEnde.toFixed(2)}.`);

    // ---- Schriftfeld: Quellenzeile in Kurzform (daten/markt.json, kapitaldienst.quelle_kurz); die volle Angabe steht auf der Quellenfolie im Anhang ----
    B.quelle(s, ctx.wortlaut(X('markt', 'kapitaldienst.quelle_kurz'), 'Quellenzeile'));
  },
};
