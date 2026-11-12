// Folie 6 · PGN_DIAGRAMM: Bestand gebundener Mietwohnungen in Niedersachsen, 31.12.2016 bis 31.12.2025, als natives Säulendiagramm über
// sieben Spalten. Feine Zeichnung wie auf den Folien 3 und 5 (D.saeulen mit fein: true): eine Reihe, jede Säule mit feiner Kontur; die Jahre bis
// 2024 als helle Fläche, 2025 in Tinte. Beschriftet sind der erste Wert, der Wert der Broschüre für 2024 (beide in Grau) und der letzte (in
// Tinte). Die Maßkette über dem Diagramm misst von der ersten bis zur letzten Säule und trägt den Rückgang. Rechts die Hauptzahl der Folie
// (Rückgang) und darunter die Kennzahl der Broschüre S. 3 (28 % der 2015 bis 2024 ausgelaufenen Bindungen ersetzt).
// Reihe aus daten/markt.json, Block bestand (Altfassung Folie 4, nicht nachgeprüft); Zahlen 2015 bis 2024 aus dem Block markt (Broschüre S. 3).
// Rot im Diagramm nur am Maßkettenwert: Das ist die Zahl des Titels. Kein Schlüsselplan: Die Folie behandelt keinen Programmteil.
'use strict';
const E = require('./_einstieg.cjs');

module.exports = {
  id: 'einstieg-bestand',
  bau(ctx) {
    const { B, D, X, fmt, P } = ctx, s = ctx.folie(), U = E.lies(ctx), wl = (t, was) => ctx.wortlaut(t, was), T = k => wl(U('markt.texte.' + k), k);
    const jahre = X('markt', 'bestand.jahre'), reihe = X('markt', 'bestand.reihe'), werte = jahre.map(j => reihe[j]), n = jahre.length - 1;
    if (werte.some(v => typeof v !== 'number')) throw new Error('bestand.reihe: Nicht jedes Jahr aus bestand.jahre hat einen Wert.');
    if (jahre[0] !== String(X('markt', 'bestand.von')) || jahre[n] !== String(X('markt', 'bestand.bis'))) P.melde('bestand.von und bestand.bis sind nicht das erste und das letzte Jahr der Reihe.');
    const rueckgang = 1 - werte[n] / werte[0], quote = X('markt', 'markt.quote'), minus = fmt.MINUS + fmt.zahl(rueckgang * 100, 1);

    // Gegenproben: Wert 2024 gleich dem Bestand der Broschüre; Quote aus den beiden Zahlen der Broschüre; Titel nennt den Rückgang
    ctx.gleich(`Bestand ${X('markt', 'markt.bestand_jahr')} der Reihe gegen die Broschüre S. 3`, reihe[String(X('markt', 'markt.bestand_jahr'))], X('markt', 'markt.bestand'), 0);
    ctx.gleich('Quote der neu geförderten Bindungen', X('markt', 'markt.neu_gefoerdert') / X('markt', 'markt.ausgelaufen'), quote, 2);
    if (!ctx.glatt(ctx.o.titel).includes(ctx.glatt(fmt.prozent(rueckgang, 1)))) P.melde(`Titel der Folie nennt den Rückgang nicht mit ${fmt.prozent(rueckgang, 1)}.`);
    wl(werte.map(v => fmt.zahl(v)).join(' · '), 'Werte der Reihe');

    // ---- Diagramm über sieben Spalten ----------------------------------------------------------------------------------------
    B.diagrammkopf(s, { titel: wl('Bestand gebundener Mietwohnungen in Niedersachsen', 'Diagrammtitel'), sub: wl('Wohnungen mit Belegungs- und Mietbindung, Bestand zum 31.12.', 'Untertitel') });
    // Wie auf den Folien 3 und 5: frühere Stände als helle Fläche mit feiner Kontur (Bezugswert), der letzte Stand in Tinte
    const arten = jahre.map((j, i) => (i === n ? 'tinte' : 'bezug'));
    const d = D.saeulen(s, { kategorien: jahre, werte, arten, fein: true, reihenname: 'Bestand zum 31.12.', labels: false, rand: { l: 0.96, r: 0.08, o: 0.54 }, luecke: 70, name: 'Diagramm Bestand gebundener Mietwohnungen',
      achse: { min: 0, max: 100000, schritt: 20000, format: 'ganz' },
      altText: `Säulendiagramm: Bestand gebundener Mietwohnungen in Niedersachsen zum 31.12., ${jahre[0]} bis ${jahre[n]}: von ${fmt.zahl(werte[0])} auf ${fmt.zahl(werte[n])} Wohnungen` });
    B.achsentitel(s, d, { y: ctx.wortlaut('Wohnungen', 'Achsentitel') });

    // Werte an drei Säulen im Ton ihrer Säule (auf einer Fläche in der Grundfarbe: keine Gitterlinie läuft durch die Zahl)
    const oben = i => d.yWert(werte[i]) - 0.26, beschriftet = X('markt', 'bestand.beschriftet').map(j => jahre.indexOf(j));
    // Stehen zwei beschriftete Säulen nebeneinander und ihre Werte auf einer Höhe (2024 und 2025), deckt eine Fläche in der Grundfarbe die
    // Gitterlinie zwischen den beiden Zahlen, an der letzten Säule bis zum Rand der Plotfläche: Sonst blieben dort Stummel der Linie stehen
    beschriftet.forEach((i, k) => {
      const j = beschriftet[k + 1];
      if (i >= 0 && j === i + 1) B.grundZwischenWerten(s, { x0: d.katMitte(i), x1: j === n ? d.plot.x + d.plot.w + 0.02 : d.katMitte(j), y0: oben(i), y1: oben(j), name: `Grund Werte ${jahre[i]} und ${jahre[j]}` });
    });
    // In den sieben Spalten stehen die Säulen enger als die Werte breit sind: Zwei Werte an Nachbarsäulen (2024 und 2025) rücken je 0,06 Zoll
    // auseinander, damit die Fläche hinter dem einen den anderen nicht anschneidet
    const RUECKEN = 0.06, versatz = i => (beschriftet.includes(i + 1) ? -RUECKEN : 0) + (beschriftet.includes(i - 1) ? RUECKEN : 0);
    for (const j of X('markt', 'bestand.beschriftet')) {
      const i = jahre.indexOf(j);
      if (i < 0) throw new Error(`bestand.beschriftet nennt ${j}; das Jahr steht nicht in der Reihe.`);
      B.textAufPlot(s, wl(fmt.zahl(werte[i]), `Wert ${j}`), { x: d.katMitte(i) + versatz(i) - 0.50, y: oben(i), w: 1.00, h: 0.22, rolle: 'wert', farbe: D.ART[arten[i]].wert, align: 'center', valign: 'middle', name: 'Wert ' + j });
    }
    // Maßkette von der ersten bis zur letzten Säule; die Maßhilfslinien laufen bis über die Werte der beiden Säulen. Der Wert steht in Rot
    const yM = d.plot.y - 0.20;
    [0, n].forEach(i => { const bis = oben(i) - 0.05; if (bis > yM + 0.06) B.linie(s, { x: d.katMitte(i), y: yM, h: bis - yM, art: 'mass', pt: 0.5, name: 'Maßhilfslinie ' + jahre[i] }); });
    B.masskette(s, { x: d.katMitte(0), y: yM, w: d.katMitte(n) - d.katMitte(0), segmente: [{ anteil: 1, text: wl(`${minus} %`, 'Maßkette'), akzent: true }] });

    // ---- Rechte Spalte: Hauptzahl und Kennzahl der Broschüre ----------------------------------------------------------------------
    B.hauptzahl(s, { gross: true, vorsatz: T('hauptzahl_vorsatz'), zahl: minus, einheit: '%', label: T('hauptzahl_label') });
    B.nebenzahl(s, { vorsatz: T('kennzahl_vorsatz'), zahl: wl(fmt.zahl(quote * 100), 'Kennzahl'), einheit: '%', label: T('kennzahl_label'), text: T('kennzahl_text') });

    // ---- Schriftfeld: Quellenzeile in Kurzform (daten/markt.json, bestand.quelle_kurz); die volle Angabe steht auf der Quellenfolie im Anhang ----
    B.quelle(s, ctx.wortlaut(X('markt', 'bestand.quelle_kurz'), 'Quellenzeile'));
  },
};
