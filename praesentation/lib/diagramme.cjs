// Native Diagramme (addChart) nach den Diagramm-Regeln des Planwerks (Spezifikation Abschnitt 6).
// Feste Farben je Reihenart, festgelegte Plotfläche, deutsches Zahlenformat ([$-407]), Schrift Work Sans und Montserrat.
// Jede Funktion gibt die Lage der Plotfläche in Zoll zurück, damit Planzeichen (Maßkette, Achskreise, Marken) passgenau darüberliegen.
// Dazu das Flussdiagramm (D.fluss): kein Diagrammtyp von PowerPoint, deshalb aus nativen Formen gebaut (Freihandformen mit Kurven).
'use strict';
const { C, HEX, F, GRUND, ZONE, FLUSSART } = require('./theme.cjs');
const { breite } = require('./passpruefung.cjs');
const { zahl } = require('./daten.cjs').fmt;

// Reihenart → Farbe der Fläche oder Linie und Farbe der Beschriftung im Segment
const ART = {
  zuschuss:    { farbe: C.rot, hex: HEX.rot, label: 'FFFFFF' },
  darlehen:    { farbe: C.darlehen, hex: HEX.tinte, label: 'FFFFFF' },
  eigenmittel: { farbe: HEX.schraffur, hex: HEX.schraffur, label: HEX.tinte },   // Merkfarbe: wird in der Nachbearbeitung zur Schraffur
  tinte:       { farbe: C.tinte, hex: HEX.tinte, label: 'FFFFFF' },
  referenz:    { farbe: C.referenz, hex: HEX.referenz, label: 'FFFFFF' },
  bisher:      { farbe: HEX.grau300, hex: HEX.grau300, label: HEX.tinte },
  signal:      { farbe: C.dunkelrot, hex: HEX.dunkelrot, label: 'FFFFFF' },
  A:           { farbe: HEX.gruppe.A, hex: HEX.gruppe.A, label: 'FFFFFF' },
  B:           { farbe: HEX.gruppe.B, hex: HEX.gruppe.B, label: 'FFFFFF' },
  C:           { farbe: HEX.gruppe.C, hex: HEX.gruppe.C, label: HEX.tinte },
};
const FORMAT = { ganz: '[$-407]#,##0', eins: '[$-407]0.0', zwei: '[$-407]0.00', prozent: '[$-407]0" %"', roh: '[$-407]0' };
const STRICHE = ['solid', 'dash', 'lgDash', 'sysDash', 'sysDot', 'dashDot', 'lgDashDot'];
const NUR_MAX = 40;   // katLabels.nur (leere Beschriftungen dazwischen) trägt bis zu dieser Zahl von Kategorien

// kx: { grund, P, layout, merke(dateiname, anweisung), altText(objektname, text) }
function diagramme(pres, kx) {
  const cs = GRUND[kx.grund || 'hell'], P = kx.P, D = {};
  const hatChartFeld = /DIAGRAMM/.test(kx.layout || '');

  const art = a => ART[a] || (() => { throw new Error(`Reihenart „${a}“ gibt es nicht. Erlaubt: ${Object.keys(ART).join(', ')}`); })();
  const fmt = f => FORMAT[f] || f || FORMAT.ganz;
  // Negative Werte mit dem Minuszeichen U+2212 (zweiter Abschnitt des Formats)
  const mitMinus = f => { const c = fmt(f); return c.includes(';') ? c : `${c};${c.replace('[$-407]', '[$-407]\u2212')}`; };
  // Beschriftung im Segment: Nullwerte bleiben leer (dritter Abschnitt des Formats)
  const fmtOhneNull = f => { const c = fmt(f); return c.includes(';') ? c : `${mitMinus(c)};`; };
  // Text einer Datenbeschriftung, wie das Format ihn schreibt (für die Prüfung, ob er in das Segment passt)
  const NK = { ganz: 0, eins: 1, zwei: 2, prozent: 0, roh: 0 };
  const labelText = (v, f) => (f in NK ? zahl(v, NK[f]) + (f === 'prozent' ? '\u00a0%' : '') : zahl(v, 0));
  const labelBreite = (v, f) => breite(labelText(v, f), { fontFace: F.mont, bold: true, fontSize: 12 });
  // Gestapelte Reihen: Beschriftungen, die nicht in ihr Segment passen, werden ausgeblendet und dem Aufrufer gemeldet.
  // segment(v) liefert { laenge, dicke } des Segments in Zoll; index(i) den Index der Kategorie in den Diagrammdaten
  function zuKleineLabels(o, f, segment, index) {
    const weg = {}, liste = [];
    for (const r of o.reihen) r.werte.forEach((v, i) => {
      if (v === 0) return;
      const g = segment(v), b = labelBreite(v, f);
      const passt = g.quer ? g.laenge >= 0.24 && g.dicke >= b + 0.06 : g.laenge >= b + 0.10 && g.dicke >= 0.22;
      if (!passt) { (weg[r.name] = weg[r.name] || []).push(index(i)); liste.push({ reihe: r.name, i, wert: v }); }
    });
    return { weg, liste };
  }

  // Lage des Diagramms: Platzhalter „chart“ des Layouts PGN_DIAGRAMM(_MR) oder freie Lage x, y, w, h
  function lage(o) {
    if (o.x === undefined && o.y === undefined) {
      if (!hatChartFeld) throw new Error('Diagramm ohne x, y, w, h geht nur im Layout PGN_DIAGRAMM oder PGN_DIAGRAMM_MR (Platzhalter „chart“).');
      return { geo: { ...ZONE.diagramm.chart }, opt: { placeholder: 'chart' } };
    }
    for (const k of ['x', 'y', 'w', 'h']) if (typeof o[k] !== 'number' || !isFinite(o[k])) throw new Error(`Diagramm: ${k} fehlt oder ist keine Zahl (x, y, w, h in Zoll oder keines davon für den Platzhalter „chart“).`);
    // Satzspiegel und Inhaltszone prüft der Build für alle Formen (lib/zonenpruefung.cjs)
    return { geo: { x: o.x, y: o.y, w: o.w, h: o.h }, opt: { x: o.x, y: o.y, w: o.w, h: o.h } };
  }
  // Plotfläche aus Rändern in Zoll: { l, r, o, u }
  function plotflaeche(geo, rand) {
    const L = { x: rand.l / geo.w, y: rand.o / geo.h, w: (geo.w - rand.l - rand.r) / geo.w, h: (geo.h - rand.o - rand.u) / geo.h };
    if (L.w <= 0.2 || L.h <= 0.2) throw new Error('Diagramm: Die Ränder lassen keine Plotfläche übrig.');
    return { L, plot: { x: geo.x + rand.l, y: geo.y + rand.o, w: geo.w - rand.l - rand.r, h: geo.h - rand.o - rand.u } };
  }
  function achse(o) {
    const a = o.achse || {};
    for (const k of ['min', 'max', 'schritt']) if (typeof a[k] !== 'number') throw new Error(`Diagramm: achse.${k} fehlt. Die Größenachse wird immer fest gesetzt: achse: { min, max, schritt, format }.`);
    return a;
  }
  // Alternativtext, wenn das Modul keinen mitgibt: Art des Diagramms, Name, Kategorien und Reihen (Vorleseprogramme lesen ihn statt des Bildes)
  function beschreibung(typ, o) {
    const name = String(o.name || '').replace(/^(Diagramm|Ringdiagramm)\s+/, ''), k = (o.kategorien || []).map(String), r = (o.reihen || []).map(x => x.name).filter(Boolean);
    const kat = k.length > 8 ? `${k[0]} bis ${k[k.length - 1]} (${k.length} Werte)` : k.join(', ');
    return `${typ}${name ? ': ' + name : ''}` + (kat ? `. Kategorien: ${kat}` : '') + (r.length > 1 ? `. Reihen: ${r.join(', ')}` : '') + '.';
  }
  function basis(o, L, a, typ) {
    return {
      layout: L, showLegend: false, showTitle: false,
      valAxisMinVal: a.min, valAxisMaxVal: a.max, valAxisMajorUnit: a.schritt, valAxisLabelFormatCode: mitMinus(a.format),
      valAxisLabelFontFace: F.text, valAxisLabelFontSize: 11, valAxisLabelColor: HEX.grau600, valAxisLineShow: false,
      valGridLine: { color: HEX.linie, size: 0.5 }, catGridLine: { style: 'none' },
      catAxisLabelFontFace: F.text, catAxisLabelFontSize: 11, catAxisLabelColor: HEX.grau600,
      catAxisLineShow: true, catAxisLineColor: HEX.tinte, catAxisLineSize: 0.75, catAxisMajorTickMark: 'none', valAxisMajorTickMark: 'none',
      dataLabelFontFace: F.mont, dataLabelFontBold: true, dataLabelFontSize: 12, dataLabelColor: 'FFFFFF',
      objectName: o.name || 'Diagramm', altText: o.altText || beschreibung(typ || 'Diagramm', o),
    };
  }
  function pruefeReihen(kategorien, reihen) {
    if (!Array.isArray(kategorien) || !kategorien.length) throw new Error('Diagramm: kategorien fehlt (Liste der Kategorien).');
    if (!Array.isArray(reihen) || !reihen.length) throw new Error('Diagramm: reihen fehlt (Liste aus { name, werte, art }).');
    for (const r of reihen) {
      if (!r.name) throw new Error('Diagramm: Eine Reihe hat keinen Namen (name erscheint im Datenblatt von PowerPoint und steuert Strichart und Beschriftungsfarbe).');
      if (!Array.isArray(r.werte) || r.werte.length !== kategorien.length) throw new Error(`Diagramm: Reihe „${r.name}“ hat ${r.werte && r.werte.length} Werte, es gibt ${kategorien.length} Kategorien.`);
      for (const v of r.werte) if (typeof v !== 'number' || !isFinite(v)) throw new Error(`Diagramm: Reihe „${r.name}“ enthält „${v}“; erlaubt sind nur Zahlen.`);
    }
  }
  function zeichne(s, typ, daten, optionen, merk) {
    s.addChart(typ, daten, optionen);
    const rel = s._relsChart[s._relsChart.length - 1];
    if (kx.merke && merk) kx.merke(rel.fileName, merk);
    return rel.fileName;
  }
  const umgekehrt = a => [...a].reverse();

  // ---- Gestapelte Balken (waagerecht) --------------------------------------------------------------------------------
  // o: { x, y, w, h | Platzhalter, kategorien: [oben → unten], reihen: [{ name, werte, art }], achse: { min, max, schritt, format },
  //      labels: true, labelFormat, katAchse: false (Achskreise oder Text als Formen davor) | true, katBreite: Zoll für die Kategorientexte,
  //      rand: { l, r, o, u }, luecke: 120, name }
  // Rückgabe: { x, y, w, h, plot, xWert(v), katMitte(i) (y der Zeile i, von oben gezählt), katHoehe, balkenHoehe,
  //             ohneLabel: [{ reihe, i, wert }] (Segmente, deren Beschriftung nicht hineinpasst und deshalb ausgeblendet ist) }
  function balken(s, o, gestapelt) {
    const { geo, opt } = lage(o), a = achse(o), n = o.kategorien.length;
    pruefeReihen(o.kategorien, o.reihen);
    const katAchse = !!o.katAchse;
    const rand = { l: katAchse ? (o.katBreite || 1.6) + 0.10 : 0.71, r: 0.24, o: gestapelt ? 0.60 : 0.20, u: 0.46, ...(o.rand || {}) };
    const { L, plot } = plotflaeche(geo, rand), luecke = o.luecke ?? 120;
    const eine = o.reihen.length === 1;
    // Balken: die erste Kategorie steht unten, bei gruppierten Balken auch die erste Reihe. Beides wird hier gedreht.
    const reihen = gestapelt || eine ? o.reihen : umgekehrt(o.reihen);
    const daten = reihen.map(r => ({ name: r.name, labels: umgekehrt(o.kategorien), values: umgekehrt(r.werte) }));
    const optionen = { ...opt, ...basis(o, L, a, gestapelt ? 'Gestapeltes Balkendiagramm' : 'Balkendiagramm'), barDir: 'bar', barGrouping: gestapelt ? 'stacked' : 'clustered', barGapWidthPct: luecke,
      catAxisHidden: !katAchse, catAxisLabelPos: 'low', catAxisLabelColor: HEX.anthrazit, valAxisLabelPos: 'low',
      showValue: o.labels !== false, dataLabelFormatCode: mitMinus(o.labelFormat || a.format) };
    if (gestapelt) { optionen.dataBorder = { pt: 1.5, color: cs.fuge }; optionen.dataLabelPosition = 'ctr'; optionen.dataLabelFormatCode = fmtOhneNull(o.labelFormat || a.format); }
    else { optionen.dataLabelPosition = 'outEnd'; optionen.dataLabelColor = HEX.tinte; }
    // Farben: eine Reihe mit wechselnden Farben je Kategorie braucht Hex, mehrere Reihen nehmen Schemafarben
    const merk = { labelFarben: {} };
    if (eine && o.arten) optionen.chartColors = umgekehrt(o.arten).map(x => art(x).hex);
    else optionen.chartColors = reihen.map(r => art(r.art || 'tinte').farbe);
    if (gestapelt) for (const r of reihen) merk.labelFarben[r.name] = art(r.art || 'tinte').label;
    // Dicke eines einzelnen Balkens: c:gapWidth zählt in Prozent eines Balkens, nicht der Gruppe (Kategorienhöhe = Reihen × Balken + Lücke)
    const kh = plot.h / n, sp = gestapelt || eine ? 1 : o.reihen.length, bh = kh / (sp + luecke / 100);
    let ohneLabel = [];
    if (gestapelt && o.labels !== false) {
      const k = zuKleineLabels(o, o.labelFormat || a.format, v => ({ laenge: Math.abs(v) / (a.max - a.min) * plot.w, dicke: bh }), i => n - 1 - i);
      merk.labelWeg = k.weg; ohneLabel = k.liste;
    }
    const datei = zeichne(s, pres.charts.BAR, daten, optionen, merk);
    return { ...geo, plot, datei, katHoehe: kh, balkenHoehe: bh, ohneLabel,
      xWert: v => plot.x + plot.w * (v - a.min) / (a.max - a.min), katMitte: i => plot.y + kh * (i + 0.5),
      // gruppierte Balken: y der Reihe j (von oben) in der Kategorie i
      reiheMitte: (i, j) => plot.y + kh * i + (kh - sp * bh) / 2 + bh * (j + 0.5) };
  }
  D.stapelBalken = (s, o) => balken(s, o, true);
  // Gruppierte Balken (waagerecht): Reihen in der Reihenfolge der Legende von oben nach unten; Werte am Balkenende
  D.gruppierteBalken = (s, o) => balken(s, { katAchse: true, ...o }, false);
  // Balkenpaar: eine Reihe, je Kategorie eine feste Farbe (gefördert in Tinte, frei finanziert in Referenzgrau).
  // o: { kategorien: [oben → unten], werte: [], arten: ['tinte', 'referenz'], achse, katAchse: true, katBreite, labels: false, reihenname }
  D.balkenpaar = (s, o) => {
    if (!o.arten || o.arten.length !== o.kategorien.length) throw new Error('D.balkenpaar: arten braucht je Kategorie eine Reihenart, zum Beispiel [\'tinte\', \'referenz\'].');
    return balken(s, { katAchse: true, labels: false, luecke: 60, ...o, reihen: [{ name: o.reihenname || 'Wert', werte: o.werte }] }, false);
  };

  // ---- Säulen ---------------------------------------------------------------------------------------------------------
  // o: { x, y, w, h | Platzhalter, kategorien, reihen: [{ name, werte, art }], achse, labels: true, labelFormat,
  //      katAchse: 'text' (Vorgabe) | 'gruppe' (A, B, C in Montserrat ExtraBold 14) | false (Achskreise oder Texte als Formen), rand, luecke: 80, name }
  // Rückgabe: { x, y, w, h, plot, yWert(v), katMitte(i) (x der Kategorie i), katBreite, saeulenBreite (einzelne Säule), reiheMitte(i, j), reiheLinks(i, j) }
  function saeulen(s, o, gestapelt) {
    const { geo, opt } = lage(o), a = achse(o), n = o.kategorien.length;
    pruefeReihen(o.kategorien, o.reihen);
    const rand = { l: 0.62, r: 0.24, o: 0.22, u: o.katAchse === false ? 0.54 : 0.46, ...(o.rand || {}) };
    const { L, plot } = plotflaeche(geo, rand), luecke = o.luecke ?? 80, eine = o.reihen.length === 1;
    const daten = o.reihen.map(r => ({ name: r.name, labels: o.kategorien, values: r.werte }));
    const optionen = { ...opt, ...basis(o, L, a, gestapelt ? 'Gestapeltes Säulendiagramm' : 'Säulendiagramm'), barDir: 'col', barGrouping: gestapelt ? 'stacked' : 'clustered', barGapWidthPct: luecke,
      catAxisLabelPos: 'low', showValue: o.labels !== false, dataLabelFormatCode: mitMinus(o.labelFormat || a.format),
      chartColors: o.reihen.map(r => art(r.art || 'tinte').farbe) };
    // Eine Reihe mit eigener Farbe je Säule (frühere Stände grau, der letzte in Tinte): je Kategorie eine Reihenart, als Hex wie beim Balkenpaar
    if (o.arten) {
      if (!eine || gestapelt || o.arten.length !== n) throw new Error(`Säulendiagramm: arten gilt nur für eine einzelne Reihe und braucht je Kategorie eine Reihenart (${o.arten.length} für ${n} Kategorien).`);
      optionen.chartColors = o.arten.map(x => art(x).hex);
    }
    // katAchse false: Die Kategorien tragen Achskreise oder Texte als Formen (B.achskreis 0,28 unter der Plotfläche, B.kategorien);
    // die Achse selbst bleibt als Linie stehen, ihre Beschriftung ist abgeschaltet (kein unsichtbarer Text unter der Plotfläche)
    if (o.katAchse === false) optionen.catAxisLabelPos = 'none';
    else if (o.katAchse === 'gruppe') Object.assign(optionen, { catAxisLabelFontFace: F.xbold, catAxisLabelFontSize: 14, catAxisLabelColor: HEX.tinte });
    else optionen.catAxisLabelColor = HEX.anthrazit;
    if (a.min < 0) optionen.catAxisLineSize = 1;                       // kräftige Nulllinie
    const merk = { labelFarben: {} };
    if (gestapelt) { optionen.dataBorder = { pt: 1.5, color: cs.fuge }; optionen.dataLabelPosition = 'ctr'; optionen.dataLabelFormatCode = fmtOhneNull(o.labelFormat || a.format); for (const r of o.reihen) merk.labelFarben[r.name] = art(r.art || 'tinte').label; }
    else { optionen.dataLabelPosition = 'outEnd'; optionen.dataLabelColor = HEX.tinte; }
    // Breite einer einzelnen Säule: c:gapWidth zählt in Prozent einer Säule, nicht der Gruppe (Kategorienbreite = Reihen × Säule + Lücke)
    const kb = plot.w / n, sp = gestapelt || eine ? 1 : o.reihen.length, bb = kb / (sp + luecke / 100);
    let ohneLabel = [];
    if (gestapelt && o.labels !== false) {
      const k = zuKleineLabels(o, o.labelFormat || a.format, v => ({ quer: true, laenge: Math.abs(v) / (a.max - a.min) * plot.h, dicke: bb }), i => i);
      merk.labelWeg = k.weg; ohneLabel = k.liste;
    }
    const datei = zeichne(s, pres.charts.BAR, daten, optionen, merk);
    return { ...geo, plot, datei, katBreite: kb, saeulenBreite: bb, ohneLabel,
      yWert: v => plot.y + plot.h * (1 - (v - a.min) / (a.max - a.min)), katMitte: i => plot.x + kb * (i + 0.5),
      // gruppierte Säulen: x der Mitte und der linken Kante der Säule der Reihe j in der Kategorie i
      reiheMitte: (i, j) => plot.x + kb * i + (kb - sp * bb) / 2 + bb * (j + 0.5), reiheLinks: (i, j) => plot.x + kb * i + (kb - sp * bb) / 2 + bb * j };
  }
  D.stapelSaeulen = (s, o) => saeulen(s, o, true);
  D.gruppierteSaeulen = (s, o) => saeulen(s, o, false);
  // Säulen einer Reihe, auch mit Werten unter null (kräftige Nulllinie). o wie oben, statt reihen: { werte, art: 'tinte', reihenname,
  // arten: ['bisher', …, 'tinte'] (eigene Farbe je Säule) }
  D.saeulen = (s, o) => saeulen(s, { ...o, reihen: [{ name: o.reihenname || 'Wert', werte: o.werte, art: o.art || 'tinte' }] }, false);

  // ---- Linien -----------------------------------------------------------------------------------------------------------
  // o: { x, y, w, h | Platzhalter, kategorien: [], reihen: [{ name, werte, art: tinte | referenz | bisher, strich: solid | dash | sysDash … }],
  //      achse, katLabels: 'alle' | { jede: n } | { nur: ['1', '5', …] } | { formen: ['1', '5', …] }, rand, name }
  // Liegt null zwischen min und max, steht die Größenachse als kräftige Nulllinie bei null; die Kategorien stehen unten.
  // Rückgabe: { x, y, w, h, plot, yWert(v), katMitte(i), katBreite, katTexte: [{ i, text }] (bei katLabels.formen: die Beschriftungen für B.achstexte) }
  D.linien = (s, o) => {
    const { geo, opt } = lage(o), a = achse(o), n = o.kategorien.length;
    pruefeReihen(o.kategorien, o.reihen);
    const rand = { l: 0.86, r: 0.30, o: 0.20, u: 0.46, ...(o.rand || {}) };
    const { L, plot } = plotflaeche(geo, rand);
    // Beschriftung der Kategorien: alle · { jede: n } (die 1., n + 1., 2n + 1. …; fest in der Datei, gilt in PowerPoint und LibreOffice) ·
    // { nur: [...] } (übrige Beschriftungen bleiben leer; nur bis 40 Kategorien verlässlich, darüber dünnen die Programme selbst aus)
    // { formen: [...] } (die Achse bleibt ohne Beschriftung, die genannten Kategorien stehen als Textfelder darunter: B.achstexte. Die Daten
    // behalten ihre echten Kategorien, und kein Programm dreht, bricht oder dünnt die Beschriftung aus)
    let labels = o.kategorien.map(String), frequenz = null, katTexte = null;
    if (o.katLabels && o.katLabels.formen) {
      const nur = o.katLabels.formen.map(String), fremd = nur.filter(l => !labels.includes(l));
      if (fremd.length) throw new Error(`D.linien: katLabels.formen nennt ${fremd.map(l => `„${l}“`).join(', ')}; diese Kategorien gibt es nicht.`);
      katTexte = labels.map((l, i) => ({ i, text: l })).filter(e => nur.includes(e.text));
    } else if (o.katLabels && o.katLabels.jede) {
      frequenz = o.katLabels.jede;
      if (!Number.isInteger(frequenz) || frequenz < 1) throw new Error(`D.linien: katLabels.jede ist „${frequenz}“; erwartet wird eine ganze Zahl ab 1.`);
    } else if (o.katLabels && o.katLabels.nur) {
      const nur = o.katLabels.nur.map(String), fremd = nur.filter(l => !labels.includes(l));
      if (fremd.length) throw new Error(`D.linien: katLabels.nur nennt ${fremd.map(l => `„${l}“`).join(', ')}; diese Kategorien gibt es nicht.`);
      const idx = labels.map((l, i) => (nur.includes(l) ? i : -1)).filter(i => i >= 0), schritt = idx.length > 1 ? idx[1] - idx[0] : 0;
      const gleichmaessig = idx.length > 1 && idx[0] === 0 && idx.every((v, i) => v === i * schritt) && idx[idx.length - 1] + schritt >= n;
      if (gleichmaessig) frequenz = schritt;                       // jede n-te ab der ersten: als fester Abstand schreiben
      else if (n > NUR_MAX) throw new Error(`D.linien: katLabels.nur trägt bei ${n} Kategorien nicht (ab ${NUR_MAX + 1} dünnen PowerPoint und LibreOffice die Achse selbst aus, und es blieben nur wenige Beschriftungen stehen). ` +
        'Stattdessen katLabels: { jede: n } verwenden und die Kategorien so benennen, dass die 1., n + 1., 2n + 1. … die Beschriftung trägt (Monatsreihe: Januar heißt „2016“, jede: 12).');
      else { labels = labels.map(l => (nur.includes(l) ? l : ' ')); frequenz = 1; }   // Abstand 1: PowerPoint lässt sonst von sich aus Beschriftungen weg
    }
    const daten = o.reihen.map(r => ({ name: r.name, labels, values: r.werte }));
    const optionen = { ...opt, ...basis(o, L, a, 'Liniendiagramm'), lineSize: o.staerke || 2.25, lineDataSymbol: 'none', catAxisLabelPos: 'low', showValue: false,
      chartColors: o.reihen.map(r => art(r.art || 'tinte').farbe) };
    if (frequenz) optionen.catAxisLabelFrequency = frequenz;
    if (katTexte) optionen.catAxisLabelPos = 'none';
    if (a.min < 0 && a.max > 0) optionen.catAxisLineSize = 1;
    const merk = { striche: {} };
    for (const r of o.reihen) {
      if (r.strich && !STRICHE.includes(r.strich)) throw new Error(`D.linien: Strichart „${r.strich}“ gibt es nicht (${STRICHE.join(', ')}).`);
      if (r.strich && r.strich !== 'solid') merk.striche[r.name] = r.strich;
    }
    if (P && new Set(o.reihen.map(r => (r.art || 'tinte') + '|' + (r.strich || 'solid'))).size < o.reihen.length) P.melde('D.linien: Zwei Reihen haben dieselbe Farbe und Strichart und sind nicht zu unterscheiden.');
    const datei = zeichne(s, pres.charts.LINE, daten, optionen, merk);
    const kb = plot.w / n;
    return { ...geo, plot, datei, katBreite: kb, katTexte: katTexte || [], yWert: v => plot.y + plot.h * (1 - (v - a.min) / (a.max - a.min)), katMitte: i => plot.x + kb * (i + 0.5) };
  };

  // ---- Ring ---------------------------------------------------------------------------------------------------------------
  // o: { x, y, w, h, segmente: [{ name, wert, art }], loch: 62, name }. Beschriftung als Formen (B.text) an cx, cy, radius.
  // Rückgabe: { x, y, w, h, cx, cy, radius, winkel(i) (Mitte des Segments i in Grad, 0 = oben, im Uhrzeigersinn) }
  D.ring = (s, o) => {
    for (const k of ['x', 'y', 'w', 'h']) if (typeof o[k] !== 'number') throw new Error(`D.ring: ${k} fehlt.`);
    const d = Math.min(o.w, o.h), rand = 0.10, L = { x: (o.w - d) / 2 / o.w + rand * d / o.w, y: (o.h - d) / 2 / o.h + rand * d / o.h, w: d * (1 - 2 * rand) / o.w, h: d * (1 - 2 * rand) / o.h };
    const sum = o.segmente.reduce((a, g) => a + g.wert, 0);
    const optionen = { x: o.x, y: o.y, w: o.w, h: o.h, layout: L, holeSize: o.loch || 62, showLegend: false, showTitle: false, showValue: false, showPercent: false, showLabel: false, showLeaderLines: false,
      chartColors: o.segmente.map(g => art(g.art || 'tinte').farbe), dataBorder: { pt: 1.5, color: cs.fuge }, dataLabelFontFace: F.mont, dataLabelFontSize: 12, dataLabelColor: 'FFFFFF', firstSliceAng: 0,
      objectName: o.name || 'Ringdiagramm', altText: o.altText || beschreibung('Ringdiagramm', { name: o.name, kategorien: o.segmente.map(g => g.name) }) };
    const datei = zeichne(s, pres.charts.DOUGHNUT, [{ name: o.reihenname || 'Anteil', labels: o.segmente.map(g => g.name), values: o.segmente.map(g => g.wert) }], optionen, null);
    let lauf = 0;
    const mitten = o.segmente.map(g => { const m = (lauf + g.wert / 2) / sum * 360; lauf += g.wert; return m; });
    const radius = d * (1 - 2 * rand) / 2, cx = o.x + o.w / 2, cy = o.y + o.h / 2;
    return { x: o.x, y: o.y, w: o.w, h: o.h, datei, cx, cy, radius, winkel: i => mitten[i],
      punkt: (i, r = 1) => { const w = (mitten[i] - 90) * Math.PI / 180; return { x: cx + Math.cos(w) * radius * r, y: cy + Math.sin(w) * radius * r }; } };
  };

  // ---- Flussdiagramm aus nativen Formen ------------------------------------------------------------------------------------------------
  // Knoten als schmale Rechtecke, Ströme als Freihandformen mit kubischen Kurven. Stärke = Betrag ÷ Maßstab (Einheiten je Zoll Höhe); zwei
  // Diagramme mit demselben Maßstab lassen sich in der Höhe vergleichen. Ströme unter linieBis (pt) stehen als Linie in ihrer wahren Stärke,
  // mindestens mindestPt. Ströme und Knoten mit dem Betrag 0 werden nicht gezeichnet; ihre Lage steht in der Rückgabe, damit die Beschriftung
  // sie nennen kann. Ein Rahmen ohne Füllung und Linie trägt den Alternativtext des Diagramms; Bänder und Knoten gelten als Schmuck.
  // Beschriftet wird mit B.text an den Lagen der Rückgabe; das Diagramm selbst trägt keinen Text.
  // o: { name (Objektname des Rahmens, auf der Folie eindeutig), altText (Pflicht: Ströme mit Beträgen), massstab (Einheiten je Zoll Höhe),
  //      knoten:  [{ id, x, y, name, art: 'tinte', wert }]   x, y: linke obere Ecke; ohne wert gilt die größere Summe aus Zu- und Abflüssen
  //      stroeme: [{ von, nach, wert, art, name }]            Reihenfolge = Stapelfolge an beiden Knoten, von oben
  //      arten (Farbrollen, Vorgabe FLUSSART aus theme.cjs: tinte, referenz, hell, blass), knotenBreite: 0.12, fuge: 0.02 (Abstand zwischen
  //      Knoten und Band), spannung: 0.5 (Lage der Kurvenpunkte), mindestPt: 0.75, linieBis: 1.5 }
  // Rückgabe: { zoll(wert), knoten: { id: { x, y, w, h, wert, mitte, rechts, unten } }, stroeme: [{ …, x0, x1, y0, y1, h, alsLinie, pt }], rahmen: { x, y, w, h } }
  D.fluss = (s, o) => {
    const arten = o.arten || FLUSSART, r4 = v => +v.toFixed(4);
    if (!(o.massstab > 0)) throw new Error('D.fluss: massstab fehlt (Einheiten je Zoll Höhe).');
    if (!o.altText) throw new Error('D.fluss: altText fehlt (Beschreibung des Diagramms für Vorleseprogramme: Ströme mit Beträgen).');
    if (!Array.isArray(o.knoten) || !Array.isArray(o.stroeme)) throw new Error('D.fluss: knoten und stroeme fehlen (Listen).');
    if (typeof kx.altText !== 'function') throw new Error('D.fluss: Der Bau nimmt keine Alternativtexte für Formen an (kx.altText fehlt).');
    const kb = o.knotenBreite ?? 0.12, fuge = o.fuge ?? 0.02, sp = o.spannung ?? 0.5, minPt = o.mindestPt ?? 0.75, linieBis = o.linieBis ?? 1.5;
    const zoll = v => v / o.massstab, name = o.name || 'Flussdiagramm';
    const rolle = (a, wo) => arten[a] || (() => { throw new Error(`D.fluss: Farbrolle „${a}“ (${wo}) gibt es nicht: ${Object.keys(arten).join(', ')}`); })();
    const fuellung = r => (r.transparenz ? { color: r.farbe, transparency: r.transparenz } : { color: r.farbe });

    // Knoten: Höhe aus den Strömen; an einem Knoten mit Zu- und Abflüssen gehen beide auf
    const K = {};
    for (const k of o.knoten) {
      for (const f of ['x', 'y']) if (typeof k[f] !== 'number' || !isFinite(k[f])) throw new Error(`D.fluss: Knoten „${k.id}“: „${f}“ fehlt oder ist keine Zahl.`);
      K[k.id] = { ...k, ein: 0, aus: 0, offEin: 0, offAus: 0 };
    }
    for (const st of o.stroeme) {
      for (const e of [st.von, st.nach]) if (!K[e]) throw new Error(`D.fluss: Strom „${st.name}“: Knoten „${e}“ gibt es nicht.`);
      if (typeof st.wert !== 'number' || !isFinite(st.wert) || st.wert < 0) throw new Error(`D.fluss: Strom „${st.name}“: Betrag „${st.wert}“ ist keine Zahl ab 0.`);
      K[st.von].aus += st.wert; K[st.nach].ein += st.wert;
    }
    for (const k of Object.values(K)) {
      if (k.ein > 0 && k.aus > 0 && Math.abs(k.ein - k.aus) > 0.005) throw new Error(`D.fluss: Knoten „${k.id}“: Zuflüsse (${k.ein.toFixed(2)}) und Abflüsse (${k.aus.toFixed(2)}) gehen nicht auf.`);
      const fluss = Math.max(k.ein, k.aus);
      if (k.wert !== undefined && Math.abs(k.wert - fluss) > 0.005) throw new Error(`D.fluss: Knoten „${k.id}“: Betrag ${k.wert} gegen ${fluss.toFixed(2)} aus den Strömen.`);
      k.wert = fluss; k.h = zoll(fluss);
    }

    // Ströme: Lage an beiden Knoten in wahrer Stärke gestapelt (auch Linien belegen nur ihre wahre Stärke)
    const stroeme = [];
    for (const st of o.stroeme) {
      const a = K[st.von], b = K[st.nach], h = zoll(st.wert);
      const g = { ...st, h, x0: a.x + kb + fuge, x1: b.x - fuge, y0: a.y + a.offAus, y1: b.y + b.offEin, alsLinie: h * 72 < linieBis, pt: Math.max(h * 72, minPt) };
      a.offAus += h; b.offEin += h;
      if (g.x1 <= g.x0) throw new Error(`D.fluss: Strom „${st.name}“ läuft nicht von links nach rechts (x ${g.x0.toFixed(2)} bis ${g.x1.toFixed(2)}).`);
      stroeme.push(g);
    }

    // Rahmen mit dem Alternativtext: Hülle aller Knoten und Bänder; erste Form des Diagramms (Lesereihenfolge), ohne Füllung und ohne Linie
    const gez = stroeme.filter(g => g.wert > 0), kn = Object.values(K).filter(k => k.wert > 0);
    const xs = [...kn.flatMap(k => [k.x, k.x + kb]), ...gez.flatMap(g => [g.x0, g.x1])], ys = [...kn.flatMap(k => [k.y, k.y + k.h]), ...gez.flatMap(g => [g.y0, g.y0 + g.h, g.y1, g.y1 + g.h])];
    if (!xs.length) throw new Error('D.fluss: Kein Strom mit einem Betrag über 0.');
    const rahmen = { x: r4(Math.min(...xs)), y: r4(Math.min(...ys)), w: r4(Math.max(...xs) - Math.min(...xs)), h: r4(Math.max(...ys) - Math.min(...ys)) };
    s.addShape(pres.shapes.RECTANGLE, { ...rahmen, line: { type: 'none' }, objectName: name });
    kx.altText(name, o.altText);

    // Bänder (unter den Knoten). Punkte der Freihandform in Zoll, bezogen auf die linke obere Ecke der Form
    for (const g of gez) {
      const r = rolle(g.art || 'tinte', `Strom „${g.name}“`), w = g.x1 - g.x0, c = w * sp, on = 'Band ' + g.name;
      if (g.alsLinie) {
        // Mittellinie des Stroms; die Form braucht eine Höhe über 0, auch wenn die Linie waagerecht läuft
        const ya = g.y0 + g.h / 2, yb = g.y1 + g.h / 2, top = Math.min(ya, yb), hoehe = Math.max(Math.abs(yb - ya), 0.01), l = r.linie || r;
        const line = { color: l.farbe, width: +g.pt.toFixed(2) };
        if (l.transparenz) line.transparency = l.transparenz;
        s.addShape(pres.shapes.CUSTOM_GEOMETRY, { x: r4(g.x0), y: r4(top), w: r4(w), h: r4(hoehe), line, objectName: on,
          points: [{ x: 0, y: r4(ya - top) }, { x: r4(w), y: r4(yb - top), curve: { type: 'cubic', x1: r4(c), y1: r4(ya - top), x2: r4(w - c), y2: r4(yb - top) } }] });
        continue;
      }
      const top = Math.min(g.y0, g.y1), ya = r4(g.y0 - top), yb = r4(g.y1 - top), h = r4(g.h), B = r4(w);
      const line = r.kontur ? { color: r.kontur.farbe, width: r.kontur.pt, ...(r.kontur.transparenz ? { transparency: r.kontur.transparenz } : {}) } : { type: 'none' };
      s.addShape(pres.shapes.CUSTOM_GEOMETRY, { x: r4(g.x0), y: r4(top), w: B, h: r4(Math.abs(g.y1 - g.y0) + g.h), fill: fuellung(r), line, objectName: on,
        points: [{ x: 0, y: ya },
          { x: B, y: yb, curve: { type: 'cubic', x1: r4(c), y1: ya, x2: r4(w - c), y2: yb } },
          { x: B, y: r4(yb + h) },
          { x: 0, y: r4(ya + h), curve: { type: 'cubic', x1: r4(w - c), y1: r4(yb + h), x2: r4(c), y2: r4(ya + h) } },
          { close: true }] });
    }
    // Knoten: schmale Rechtecke in wahrer Höhe, mindestens so hoch wie die dünnste Linie
    const knoten = {};
    for (const k of Object.values(K)) {
      const hz = Math.max(k.h, minPt / 72), y = k.y + k.h / 2 - hz / 2;
      const kr = rolle(k.art || 'tinte', `Knoten „${k.id}“`);
      if (k.wert > 0) s.addShape(pres.shapes.RECTANGLE, { x: r4(k.x), y: r4(y), w: kb, h: r4(hz), fill: fuellung(kr.knoten || kr), line: { type: 'none' }, objectName: 'Knoten ' + (k.name || k.id) });
      knoten[k.id] = { x: k.x, y: k.y, w: kb, h: k.h, wert: k.wert, mitte: k.y + k.h / 2, rechts: k.x + kb, unten: k.y + k.h };
    }
    return { zoll, knoten, stroeme, rahmen };
  };

  D.FORMAT = FORMAT; D.ART = ART; D.FLUSSART = FLUSSART;
  return D;
}

module.exports = { diagramme, ART, FORMAT };
