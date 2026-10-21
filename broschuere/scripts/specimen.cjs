#!/usr/bin/env node
// Specimen des PGN-Designsystems „Planwerk“ → src/.preview-specimen.html (nicht versioniert):
// U1 · Fachseite 2.1 · PGN-Leistungen · Über PGN · Komponenten I–III · U4. Zugleich Bauplan für den Neusatz:
// foerdermix() rechnet das Maßketten-Diagramm (Zuschuss ab Grundlinie, Ketten in Anthrazit, 80-%-Achse),
// bzp() den Bauzeitenplan nach HOAI. Signaturen mit Text werden inline aus src/assets/pgn/ eingesetzt.
// Nutzung (aus broschuere/): node scripts/specimen.cjs && node scripts/render.cjs --in src/.preview-specimen.html \
//   --pdf dist/qa/specimen.pdf --png dist/qa/specimen --dpi 70 --no-print
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const A = (f) => fs.readFileSync(path.join(ROOT, 'src/assets/pgn', f), 'utf8').replace(/^<!--.*?-->\s*/s, '').trim();
const f2 = (n) => (Math.round(n * 100) / 100).toString();
// Piktogramme der Zuschläge aus dem v1-Partial S. 8 (fehlen sie nach dem Neusatz, bleibt die Stelle leer)
const p08file = path.join(ROOT, 'src/pages/08-programmteil-2-1.html');
const p08 = fs.existsSync(p08file) ? fs.readFileSync(p08file, 'utf8') : '';
const ill = (key) => (p08.match(new RegExp(`<svg class="pict p08-ill p08-ill--${key}".*?</svg>`, 's')) || ['<span class="pict"></span>'])[0];

/* Fördermix als Maßketten-Diagramm: Zuschuss ab Grundlinie, Ketten in Anthrazit, Rot = Zuschuss + 80-%-Achse */
function foerdermix() {
  const W = 180, x0 = 46, x1 = 176, u = (x1 - x0) / 100;
  const rows = [
    { g: 'A', d: ['Einkommen bis', 'zur Grenze'], v: [40, 40, 20] },
    { g: 'B', d: ['Grenze', '+ 40 %'], v: [20, 60, 20] },
    { g: 'C', d: ['Grenze', '+ 60 %'], v: [10, 70, 20] },
  ];
  const top = 11.5, rowH = 14.5, barH = 6.2;
  const H = top + rows.length * rowH + 10.5;
  const out = [];
  out.push(`<defs><pattern id="sp-hatch" patternUnits="userSpaceOnUse" width="1.6" height="1.6" patternTransform="rotate(45)"><rect class="c-equity" width="1.6" height="1.6"/><line class="c-equity-line" x1="0" y1="0" x2="0" y2="1.6"/></pattern></defs>`);
  const ax = x0 + 80 * u;
  const yEnd = top + (rows.length - 1) * rowH + 6.4 + barH + 1.4;
  rows.forEach((r, i) => {
    const y = top + i * rowH, yc = y + 2.8, yb = y + 6.4;
    out.push(`<circle class="axb-c" cx="5" cy="${f2(yb + barH / 2)}" r="4.1"/><text class="axb-t" x="5" y="${f2(yb + barH / 2 + 1.8)}" text-anchor="middle">${r.g}</text>`);
    out.push(`<text x="12.4" y="${f2(yb + barH / 2 - 0.6)}">${r.d[0]}</text><text x="12.4" y="${f2(yb + barH / 2 + 3.1)}">${r.d[1]}</text>`);
    let xs = x0; const stops = [x0];
    const cls = ['c-grant', 'c-loan', ''];
    r.v.forEach((v, j) => {
      const w = v * u;
      out.push(`<rect class="${cls[j]}" x="${f2(xs)}" y="${f2(yb)}" width="${f2(w)}" height="${barH}"${j === 2 ? ' fill="url(#sp-hatch)"' : ''}/>`);
      xs += w; stops.push(xs);
    });
    out.push(`<rect class="c-equity-frame" x="${f2(stops[2])}" y="${f2(yb)}" width="${f2(stops[3] - stops[2])}" height="${barH}"/>`);
    out.push(`<path class="sep-line" d="M${f2(stops[1])},${f2(yb)}v${barH}M${f2(stops[2])},${f2(yb)}v${barH}"/>`);
    // Zuschlag: gestrichelte rote Kappe 80 → 90 (Modellprojekt +5, Housing First +10)
    out.push(`<path class="dim-line--acc" fill="none" stroke-dasharray="1 .6" d="M${f2(ax)},${f2(yb + 0.4)}H${f2(x0 + 90 * u)}V${f2(yb + barH - 0.4)}H${f2(ax)}M${f2(x0 + 85 * u)},${f2(yb + 0.4)}V${f2(yb + barH - 0.4)}"/>`);
    // Maßkette (Anthrazit)
    let d = `M${f2(x0 - 1.4)},${f2(yc)}H${f2(x1 + 1.4)}`, tk = '', hl = '';
    stops.forEach((sx) => { tk += `M${f2(sx - 0.9)},${f2(yc + 0.9)}L${f2(sx + 0.9)},${f2(yc - 0.9)}`; hl += `M${f2(sx)},${f2(yc - 1.2)}V${f2(yb - 0.6)}`; });
    out.push(`<path class="dim-line" d="${hl}" stroke-width=".12"/><path class="dim-line" d="${d}"/><path class="dim-tick" d="${tk}"/>`);
    r.v.forEach((v, j) => {
      const mx = (stops[j] + stops[j + 1]) / 2;
      out.push(`<text class="t-val-ink${j === 0 ? ' t-acc' : ''}" x="${f2(mx)}" y="${f2(yc - 1.1)}" text-anchor="middle">${v} %</text>`);
    });
    if (i === 0) {
      out.push(`<text class="t-val t-s" x="${f2(x0 + 2.2)}" y="${f2(yb + barH / 2 + 1.05)}">Zuschuss</text>`);
      out.push(`<text class="t-val t-s" x="${f2(stops[1] + 2.2)}" y="${f2(yb + barH / 2 + 1.05)}">Darlehen</text>`);
    }
  });
  // 80-%-Achse mit Achskreis
  out.push(`<path class="cap-line" d="M${f2(ax)},${f2(top - 3.6)}V${f2(yEnd)}"/>`);
  out.push(`<circle class="axb-c" cx="${f2(ax)}" cy="${f2(top - 7.2)}" r="3.4" style="stroke:var(--accent);stroke-width:.35"/><text class="t-val-ink t-acc" x="${f2(ax)}" y="${f2(top - 6.05)}" text-anchor="middle">80</text>`);
  out.push(`<text class="t-acc" x="${f2(ax - 5.2)}" y="${f2(top - 6.1)}" text-anchor="end">Förderung bis zu 80 % – in jeder Gruppe</text>`);
  out.push(`<text class="t-acc" x="${f2(x0 + 85 * u)}" y="${f2(yEnd + 3.2)}" text-anchor="middle">85</text><text class="t-acc" x="${f2(x0 + 90 * u)}" y="${f2(yEnd + 3.2)}" text-anchor="middle">90</text>`);
  // Maßstabsleiste 0–100 % als x-Achse
  const sy = H - 7.6;
  let sb = '';
  for (let i = 0; i < 10; i++) sb += `<rect class="${i % 2 ? 'sb-w' : 'sb-b'}" x="${f2(x0 + i * 10 * u)}" y="${f2(sy)}" width="${f2(10 * u)}" height="1.3"/>`;
  [0, 20, 40, 60].forEach((v) => { sb += `<text class="t-ax" x="${f2(x0 + v * u)}" y="${f2(sy + 5)}" text-anchor="middle">${v}</text>`; });
  sb += `<text class="t-ax" x="${f2(x0 + 100 * u)}" y="${f2(sy + 5)}" text-anchor="middle">100</text><text class="t-ax" x="${f2(x0 - 3)}" y="${f2(sy + 5)}" text-anchor="end">%</text>`;
  out.push(sb);
  return `<svg class="chart__svg" viewBox="0 0 ${W} ${f2(H)}" width="${W}mm" height="${f2(H)}mm" role="img" aria-label="Fördermix je Einkommensgruppe, Höchstsätze in Prozent der zuwendungsfähigen Kosten: Gruppe A Zuschuss 40, Darlehen 40, Eigenmittel mindestens 20; Gruppe B Zuschuss 20, Darlehen 60, Eigenmittel 20; Gruppe C Zuschuss 10, Darlehen 70, Eigenmittel 20. Förderung zusammen in jeder Gruppe bis zu 80 Prozent; mit Zuschlag für Modellprojekte bis zu 85, für Housing First bis zu 90 Prozent.">${out.join('')}</svg>`;
}

const foot = (no, rubric) => `<footer class="page__foot" aria-hidden="true"><span class="page__folio">${no}</span><span class="page__running"><span>Mietwohnraumförderung Niedersachsen 2026<span class="sep">·</span><b>${rubric}</b></span><span>Stand: 21.10.2026</span></span></footer>`;
const keyplan = (on) => `<div class="keyplan" role="img" aria-label="Programmteil ${on} von sechs Programmteilen"><span class="keyplan__label">Programmteil</span><ol class="keyplan__list">${['21', '22', '23', '24', '25', '26'].map((n) => `<li class="bs-${n}${`${n[0]}.${n[1]}` === on ? ' is-on' : ''}">${n[0]}.${n[1]}</li>`).join('')}</ol></div>`;
const icon = {
  hinweis: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"><circle cx="12" cy="12" r="9.2"/><path d="M12 10.6v6.2"/><circle cx="12" cy="7.4" r=".9" fill="currentColor" stroke="none"/></svg>',
  achtung: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="miter"><path d="M12 3.2 21.4 20H2.6Z"/><path d="M12 9.6v5.2"/><circle cx="12" cy="17.2" r=".9" fill="currentColor" stroke="none"/></svg>',
  frist: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.4" y="5" width="17.2" height="15.4"/><path d="M3.4 9.6h17.2M8 3v4M16 3v4"/></svg>',
  rechner: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="2.8" width="14" height="18.4"/><path d="M8 6.6h8M8.4 11h.01M12 11h.01M15.6 11h.01M8.4 14.4h.01M12 14.4h.01M15.6 14.4h.01M8.4 17.8h.01M12 17.8h3.6" stroke-linecap="square" stroke-width="2"/></svg>',
  bindung: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="8"/><path d="M12 8.6V13l3 2M9.4 2.6h5.2"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 4v16M4 12h16"/></svg>',
  haken: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.4 12.6 9.6 17.8 19.8 6.2"/></svg>',
  stopp: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8.2 2.8h7.6l5.4 5.4v7.6l-5.4 5.4H8.2l-5.4-5.4V8.2Z"/><path d="M8 12h8"/></svg>',
};
const swatch = (v, name, note, dark) => `<li class="sp-sw"><i style="background:var(${v})${dark ? ';box-shadow:inset 0 0 0 .2mm var(--grey-200)' : ''}"></i><b>${name}</b><span>${note}</span></li>`;

/* Bauzeitenplan */
const LPH = ['Grundlagen', 'Vorplanung', 'Entwurf', 'Genehmigung', 'Ausführungsplanung', 'Vorbereitung der Vergabe', 'Mitwirkung bei der Vergabe', 'Objektüberwachung', 'Objektbetreuung'];
const bzpRows = [
  { n: '01', t: 'Förder-Check', d: 'Programmteil, Standort, Rechnung', bars: [['foerder', 1, 1]] },
  { n: '02', t: 'Planung', d: 'Wohnflächen und Standards nach RL', bars: [['plan', 2, 4]] },
  { n: '03', t: 'Kosten im Griff', d: 'DIN 276, unter der Bemessungsgrenze', bars: [['plan', 2, 3], ['line', 4, 8]] },
  { n: '04', t: 'Antragsunterlagen', d: 'für die Wohnraumförderstelle', bars: [['foerder', 3, 4]], ms: [4, 'Antrag'] },
  { n: '05', t: 'Vergabe', d: 'Zuschlag erst nach der Bewilligung', bars: [['plan', 5, 6], ['outline', 7, 7]] },
  { n: '06', t: 'Bauleitung', d: 'Termine, Kosten, Baufortschritt', bars: [['plan', 8, 8]] },
  { n: '07', t: 'Nachweis', d: 'Verwendungsnachweis in sechs Monaten', bars: [['foerder', 8, 9]], ms: [9, 'Nachweis', 'l'] },
];
const bzp = () => {
  const lph = Array.from({ length: 9 }, (_, i) => `<span class="bzp__lph"><b>${i + 1}</b></span>`).join('');
  const rows = bzpRows.map((r) => {
    const bars = r.bars.map(([k, a, b]) => `<i class="bzp__bar${k === 'foerder' ? ' bzp__bar--foerder' : k === 'line' ? ' bzp__bar--line' : k === 'outline' ? ' bzp__bar--outline' : ''}" style="--from:${a};--to:${b}"></i>`).join('');
    const ms = r.ms ? `<i class="bzp__ms" style="--at:${r.ms[0]}"></i>${r.ms[2] === 'l' ? '' : `<span class="bzp__ms-t" style="--at:${r.ms[0]}">${r.ms[1]}</span>`}` : '';
    return `<div class="bzp__row"><div class="bzp__label"><span class="bzp__title"><em>${r.n}</em>${r.t}</span><small>${r.d}</small></div><div class="bzp__track">${bars}${ms}</div></div>`;
  }).join('');
  return `<figure class="bzp module" role="group" aria-labelledby="sp-bzp-h">
    <figcaption class="chart__head"><h2 class="chart__title" id="sp-bzp-h">Förderweg und Leistungsphasen</h2><p class="chart__sub">nach Leistungsphasen der HOAI</p><ul class="legend"><li><i class="sw sw--grant"></i>förderspezifisch</li><li><i class="sw sw--loan"></i>Planen und Bauen</li><li><i class="sw sw--loan-o"></i>nach der Bewilligung</li></ul></figcaption>
    <div class="bzp__grid u-mt-3">
    <div class="bzp__head"><span class="bzp__label" style="border:0"><span class="label">Leistung</span></span><div class="bzp__phases bzp__phases--top"><span style="grid-column:1 / span 6">Vor der Bewilligung<small>Planung bis LPH 6 ist kein Vorhabenbeginn</small></span><span class="is-after" style="grid-column:7 / span 3">Nach der Bewilligung<small>Vergabe, Bau, Nachweis</small></span></div></div>
    <div class="bzp__head"><span class="bzp__label" style="display:flex;align-items:center;border-bottom:var(--rule-w) solid var(--rule-strong)"><span class="label">Leistungsphase HOAI</span></span><div class="bzp__phases">${lph}</div></div>
    ${rows}
    <i class="bzp__gate" style="--at:6" aria-hidden="true"><span>±0 Bewilligung</span></i>
    </div>
    <ul class="bzp__legend"><li><b>LPH</b> 1 Grundlagen · 2 Vorplanung · 3 Entwurf · 4 Genehmigung · 5 Ausführungsplanung · 6 Vorbereitung der Vergabe · 7 Mitwirkung bei der Vergabe · 8 Objektüberwachung · 9 Objektbetreuung</li></ul>
  </figure>`;
};

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Specimen PGN-Designsystem „Planwerk“ – Mietwohnraumförderung Niedersachsen 2026</title>
<meta name="author" content="Planungsgemeinschaft Nord GmbH">
<meta name="description" content="Specimen des PGN-Designsystems: Umschlag, Fachseite, Leistungsseite, Komponenten">
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="styles.css">
<style>
/* nur Specimen: Swatches und Beschriftung der Musterflächen */
.sp-swatches { display: grid; grid-template-columns: repeat(var(--n, 4), minmax(0, 1fr)); gap: 3mm var(--gutter); }
.sp-sw { display: grid; grid-template-columns: 9mm minmax(0, 1fr); column-gap: 2mm; align-items: start; font-size: var(--fs-micro); line-height: 1.3; color: var(--fg-3); }
.sp-sw i { grid-row: 1 / span 2; width: 9mm; height: 9mm; }
.sp-sw b { font: 700 var(--fs-micro)/1.25 var(--font-display); color: var(--fg); }
.sp-type > * + * { margin-top: 2.6mm; }
.sp-type .label { margin-bottom: -1.4mm; }
.sp-row { display: flex; flex-wrap: wrap; align-items: center; gap: 2.4mm 4mm; }
.p08-leaf, .p08-wall { fill: var(--surface); }
.sp-zu { border-top: var(--rule-w) solid var(--rule-strong); }
.sp-zu > div { display: grid; grid-template-columns: 10mm minmax(0, 1fr); column-gap: 3mm; align-items: start; padding: 1.6mm 0 1.7mm; border-bottom: var(--hair) solid var(--rule); }
.sp-zu p { margin-top: .8mm; }
.sp-zu .pict { --pict-size: 10mm; margin-top: -.4mm; }
.sp-zu h3 { font: 800 9pt/1.22 var(--font-display); letter-spacing: .03em; text-transform: uppercase; color: var(--fg); }
.sp-zu h3 em { display: block; font-style: normal; font-weight: 700; text-transform: none; color: var(--accent-text); letter-spacing: 0; margin-top: .4mm; }
.sp-zu p { font-size: var(--fs-module); line-height: var(--lh-module); }
.back__invite { margin-top: 5mm; max-width: 132mm; font: 500 10pt/1.45 var(--font-text); color: var(--white); }
</style>
</head>
<body>

<!-- ============================================================ U1 -->
<section class="page page--u1 page--cover" data-page="01" id="seite-01" aria-label="Titel">
  <div class="planframe" aria-hidden="true"></div>
  <header class="cover__head">
    <p class="kicker">Planungsgrundlagen für den geförderten Mietwohnungsbau</p>
    <div class="titleblock__cell"><p class="titleblock__label">Ausgabe</p><p class="titleblock__value">Oktober 2026</p></div>
  </header>
  <figure class="cover__drawing" role="group">${A('sig-axo-brauerstrasse.svg')}</figure>
  <p class="cover__caption"><b>Axonometrie</b><span>nach dem Projekt Brauerstraße, Rotenburg (Wümme) · Schema</span></p>
  <div class="cover__stamp">
    <div class="cover__row cover__row--top">
      <div class="titleblock__cell"><p class="titleblock__label">Für</p><p class="titleblock__value">Wohnungsunternehmen, Genossenschaften, Investorinnen und Investoren, Kommunen</p></div>
      <div class="titleblock__cell"><p class="titleblock__label">Planinhalt</p><p class="titleblock__value">Programme, Konditionen, Antragsweg</p></div>
      <div class="titleblock__cell"><p class="titleblock__label">Stand</p><p class="titleblock__value">10/2026</p></div>
      <div class="titleblock__cell titleblock__cell--blatt"><p class="titleblock__label">Blatt</p><p class="titleblock__value">U1</p></div>
    </div>
    <div class="cover__row cover__row--main">
      <div class="cover__main">
        <p class="kicker kicker--ink cover__kicker">Mietwohnraumförderung Niedersachsen 2026</p>
        <h1 class="cover__title">Wohnraum, der sich <em>rechnen</em> kann.</h1>
        <p class="cover__deck">Der Leitfaden zur RL Mietwohnraum 2026 – für Wohnungsunternehmen, Genossenschaften, Investorinnen und Investoren und Kommunen.</p>
      </div>
      <div class="cover__kpi">
        <p class="cover__kpi-pre">Bis zu</p>
        <p class="cover__kpi-num">80<small>%</small></p>
        <p class="cover__kpi-text">Förderquote aus Darlehen und Zuschuss</p>
        <div class="dim dim--on-red" aria-hidden="true"><span class="dim__seg" style="--w:80">Förderung</span><span class="dim__seg" style="--w:20">20</span></div>
      </div>
    </div>
    <div class="cover__row cover__row--foot">
      <div class="cover__logo"><img class="logo" src="assets/pgn/logo-rot.svg" alt="PGN – Architekten, Stadtplaner, Ingenieure"></div>
      <div class="titleblock__cell"><p class="titleblock__label">Herausgeber</p><p class="titleblock__value">Planungsgemeinschaft Nord GmbH<br>Große Straße 49 · 27356 Rotenburg (Wümme)</p></div>
      <div class="titleblock__cell"><p class="titleblock__label">Grundlage</p><p class="titleblock__value">RL Mietwohnraum 2026</p></div>
    </div>
  </div>
</section>

<!-- ============================================================ Fachseite 2.1 -->
<section class="page bs-21" data-page="08" id="seite-08">
  <div class="bs-register" data-bleed aria-hidden="true">2.1</div>
  <header class="page__header"><span class="page__section">Finanzierung</span>${keyplan('2.1')}</header>
  <header class="program-head program-head--master">
    <div class="program-head__no"><p class="chapter-no">2.1<small>Programmteil</small></p><p class="tags"><span class="tag"><i class="sw sw--grant"></i><i class="sw sw--loan"></i>Zuschuss + Darlehen</span></p></div>
    <div class="program-head__main">
      <p class="kicker">Neubau · Änderung · Ersterwerb</p>
      <h1 class="h1">Bis zu <em>80&nbsp;%</em> Förder&shy;quote</h1>
      <p class="deck">Aus Darlehen und Zuschuss – in <b>allen drei</b> Einkommensgruppen</p>
      <p class="program-head__subject">Für gebundene Mietwohnungen in Mehrfamilienhäusern ab drei Wohnungen und in gemeinschaftlichen Wohnformen – im Neubau, durch Änderung und Erweiterung oder als Ersterwerb bis zwei Jahre nach Fertigstellung. Den Zuschuss gibt es nur zusammen mit dem Darlehen.</p>
    </div>
  </header>
  <figure class="chart module u-mt-5" role="group" aria-labelledby="sp-mix-h">
    <figcaption class="chart__head"><h2 class="chart__title" id="sp-mix-h">Fördermix je Einkommensgruppe</h2><p class="chart__sub">Höchstsätze in % der zuwendungsfähigen Kosten</p><ul class="legend"><li><i class="sw sw--grant"></i>Zuschuss</li><li><i class="sw sw--loan"></i>Darlehen</li><li><i class="sw sw--equity"></i>Eigenmittel, mind.</li></ul></figcaption>
    ${foerdermix()}
    <p class="chart__note">Gestrichelt: mit Zuschlag bis 85 bzw. 90&nbsp;%. Grundsatz Gruppe A; B und C nach Zulassung. Bindung 35 Jahre <a class="pageref" href="#seite-09">→&nbsp;S.&nbsp;9</a></p>
  </figure>
  <div class="l-grid u-mt-6" style="--row-gap:0">
    <div class="l-span-6">
      <figure class="formula" role="group" aria-labelledby="sp-wz-h">
        <h2 class="label" id="sp-wz-h" style="color:var(--fg)">Was zählt</h2>
        <div class="formula__row"><span class="formula__op"></span><p class="formula__term">Herstellungskosten KG 200–700 <span class="formula__limit">höchstens Bemessungsgrenze × Wohnfläche</span></p></div>
        <div class="formula__row"><span class="formula__op">+</span><p class="formula__term">Grundstückskosten (KG 100) <span class="formula__limit">höchstens Bodenrichtwert × Grundstücksfläche</span></p></div>
        <div class="formula__row formula__row--result"><span class="formula__op">=</span><p class="formula__term">zuwendungsfähige Kosten</p></div>
      </figure>
      <div class="facts u-mt-4">
        <div class="facts__mod"><p class="label">Bemessungsgrenze</p><p class="facts__text"><b class="u-accent">4.800&nbsp;€</b> je m² Wohnfläche in Mietenstufe I–III, <b class="u-accent">5.000&nbsp;€</b> in IV–VII. Ausgangswerte, fortgeschrieben zum 01.04. und 01.10.; aktueller Wert auf nbank.de.</p></div>
        <div class="facts__mod"><p class="label">Eigenmittel</p><p class="facts__text">Mindestens 20&nbsp;%, mit Zuschlag entsprechend weniger; mindestens die Hälfte als Geld oder lastenfreies Grundstück.</p></div>
      </div>
    </div>
    <section class="l-span-6" aria-labelledby="sp-zu-h">
      <h2 class="chart__title" id="sp-zu-h">Zuschläge und Sonderformen</h2>
      <div class="sp-zu u-mt-2">
        <div>${ill('housing-first')}<div><h3><span lang="en">Housing First</span><em>Zuschuss +10 Prozentpunkte</em></h3><p>Gruppe A: 50&nbsp;%, zusammen 90&nbsp;%; für wohnungslose Menschen (§§&nbsp;67&nbsp;ff. SGB XII).</p></div></div>
        <div>${ill('modellprojekt')}<div><h3>Modellprojekt<em>Zuschuss +5 Prozentpunkte</em></h3><p>Seriell, modular, flexible Grundrisse – Konzepte, die andere aufgreifen.</p></div></div>
        <div>${ill('gemeinschaft')}<div><h3>Gemeinschaftlich wohnen<em>Cluster, WG, Wohngruppe</em></h3><p>Höchstens 40&nbsp;m² je Person, Gemeinschaftsflächen eingerechnet.</p></div></div>
      </div>
      <div class="facts__mod u-mt-3"><p class="label">Kombinierbar</p><p class="facts__text">Neubau und Ersterwerb bis zwölf Monate nach Bauabnahme: mit KfW 298 oder 296, je Wohnung eines. Nicht mit 2.2.</p></div>
    </section>
  </div>
  ${foot('8', 'Finanzierung · Programmteil 2.1')}
</section>

<!-- ============================================================ PGN-Leistungen -->
<section class="page" data-page="20" id="seite-20">
  <header class="page__header"><span class="page__section"><b>PGN</b>Mit PGN zur Bewilligung</span><span class="ref">Leistungsphasen nach HOAI</span></header>
  <div class="title-block title-block--split">
    <div class="title-block__main">
      <p class="kicker">Mit PGN</p>
      <h1 class="h1">So begleiten wir Ihr Förder&shy;projekt</h1>
      <p class="deck u-mt-3">Ein Ansprechpartner für alles</p>
    </div>
    <p class="claim claim--s" style="grid-column: 9 / span 4; padding-bottom: 1mm">Prüfen.<br>Planen.<br><em>Nachweisen.</em></p>
  </div>
  <p class="lead u-mt-5">Den Antrag stellen Sie bei der Wohnraumförderstelle, entscheiden wird die NBank. Wir sorgen dafür, dass Planung, Kosten und Unterlagen zu den Förderregeln passen – und die Förderung nicht an einem zu frühen Vertrag scheitert.</p>
  <div class="u-mt-6">${bzp()}</div>
  <div class="l-grid u-mt-6" style="--row-gap:0">
    <aside class="l-span-6 offer-box offer-box--dark on-dark"><p class="offer-box__title">Schlüsselfertig</p><p class="offer-box__text">Auf Wunsch bauen wir als Generalübernehmer schlüsselfertig – über die PGN Projektgesellschaft Nord GmbH. Die Förderung lässt das zu, wenn der Generalübernehmer vorab der Prüfung von Kalkulation, Vergabe und Abrechnung zustimmt.</p></aside>
    <aside class="l-span-6 offer-box"><p class="offer-box__title">Für Kommunen</p><p class="offer-box__text">Bauleitplanung und städtebauliche Rahmenpläne aus unserer Stadtplanung. Legt der Bebauungsplan geförderten Wohnraum fest, gilt der Bedarf als gegeben. <a class="pageref" href="#seite-18">→&nbsp;S.&nbsp;18</a></p></aside>
  </div>
  ${foot('20', 'Umsetzung · Mit PGN')}
</section>

<!-- ============================================================ Über PGN (Kapitelauftakt mit Punktraster, Referenzen) -->
<section class="page page--opener" data-page="22" id="seite-22">
  <div class="planframe planframe--soft" aria-hidden="true"></div>
  <header class="page__header"><span class="page__section"><b>PGN</b>Über uns</span><span class="ref">Architekten · Stadtplaner · Ingenieure</span></header>
  <p class="kicker">Über PGN · 45 Jahre</p>
  <h1 class="h1 h1--xl u-mt-4">Ihre Generalplaner aus dem Norden. <em>Seit 1981.</em></h1>
  <figure class="photo u-mt-12" role="group" style="--axes-pad:14mm;--cap-h:7mm">
    <div class="raster" aria-hidden="true">${A('sig-raster-brauerstrasse.svg')}</div>
    <div class="photo__axes" aria-hidden="true"><span><b>1</b></span><span><b>2</b></span><span><b>3</b></span><span><b>4</b></span><span><b>5</b></span></div>
    <figcaption class="photo__caption"><b>Punktraster</b><span>Brauerstraße, Rotenburg (Wümme) · Visualisierung als Vektor-Punktraster in PGN-Rot</span></figcaption>
  </figure>
  <div class="cutline" aria-hidden="true"><span>A</span><span>A</span></div>
  <article class="reference reference--feature" aria-labelledby="sp-ref-h">
    <figure class="photo photo--marks" role="group" style="--photo-h:44mm;--photo-pos:62% 55%;--cap-h:7mm">
      <img class="photo__img" src="assets/pgn/img/brauerstrasse-duplex.jpg" alt="Visualisierung des Mehrfamilienhauses Brauerstraße 4 in Rotenburg (Wümme): dreigeschossiger Klinkerbau mit Walmdach und Balkonen">
      <span class="photo__tag">Referenz</span>
      <figcaption class="photo__caption"><b>Ansicht</b><span>Visualisierung, Brauerstraße 4</span></figcaption>
    </figure>
    <div>
      <p class="kicker kicker--plain">Mit NBank-Förderung</p>
      <p class="reference__units">19 <small>Wohnungen<br>barrierefrei, mit Aufzug</small></p>
      <h2 class="reference__name" id="sp-ref-h">Brauerstraße, Rotenburg (Wümme)</h2>
      <dl class="reference__facts">
        <dt>Vorhaben</dt><dd>Neubau eines Mehrfamilienhauses</dd>
        <dt>Wohnungen</dt><dd>ca. 50–61 m²</dd>
        <dt>Technik</dt><dd>Luft-Wasser-Wärmepumpe, PV-Anlage</dd>
        <dt>Status</dt><dd>entsteht aktuell; wird durch die Förderung der NBank unterstützt</dd>
      </dl>
    </div>
  </article>
  <ul class="values l-bottom" aria-label="Für Sie denken wir an">
    <li class="values__item"><img src="assets/pgn/verantwortung-white.svg" alt=""><span class="values__word">Verantwortung.</span></li>
    <li class="values__item"><img src="assets/pgn/kostensicherheit-white.svg" alt=""><span class="values__word">Kostensicherheit.</span></li>
    <li class="values__item"><img src="assets/pgn/innovation-white.svg" alt=""><span class="values__word">Innovation.</span></li>
    <li class="values__item"><img src="assets/pgn/vertrauen-white.svg" alt=""><span class="values__word">Vertrauen.</span></li>
  </ul>
  ${foot('22', 'PGN · Über uns')}
</section>

<!-- ============================================================ Komponenten I -->
<section class="page" data-page="31" id="seite-31">
  <header class="page__header"><span class="page__section"><b>DS</b>Designsystem „Planwerk“</span><span class="ref">Specimen · Komponenten I</span></header>
  <div class="title-block title-block--split">
    <div class="title-block__main"><p class="kicker">Komponenten</p><h1 class="h1 h1--s">Farben, Schrift, <em>Planzeichen</em></h1></div>
    <p class="lead lead--s">Rot ist der eine Akzent: Zuschuss, Maßkette, Marke. Alles andere steht in Fast-Schwarz, Anthrazit und warmem Grau auf weißem Papier.</p>
  </div>
  <section class="module u-mt-6" aria-label="Farben">
    <p class="label">PGN-Palette</p>
    <ul class="sp-swatches u-mt-2" style="--n:6">
      ${swatch('--pgn-red', 'PGN-Rot', '#B71E3F · Weiß 6,4:1')}${swatch('--pgn-red-deep', 'Dunkelrot', '#8B2939 · Signal')}${swatch('--ink', 'Fast-Schwarz', '#202020 · Darlehen')}${swatch('--anthracite', 'Anthrazit', '#3C3C3B · Text')}${swatch('--grey-600', 'Grau', '#626160 · Text 2')}${swatch('--paper', 'Papier', '#F4F3F2 · Flächen', true)}
    </ul>
    <p class="label u-mt-4">Programmteile 2.1–2.6 · immer mit Nummer</p>
    <ul class="sp-swatches u-mt-2" style="--n:6">
      ${swatch('--bs-21', '2.1 Rot', 'Weiß 6,4:1')}${swatch('--bs-22', '2.2 Blau', 'Weiß 6,0:1')}${swatch('--bs-23', '2.3 Ocker', 'Weiß 5,4:1')}${swatch('--bs-24', '2.4 Nordsee', 'Weiß 8,4:1')}${swatch('--bs-25', '2.5 Heide', 'Weiß 5,0:1')}${swatch('--bs-26', '2.6 Anthrazit', 'Weiß 11,0:1')}
    </ul>
    <p class="label u-mt-4">Daten · Fördermix und Einkommensgruppen</p>
    <ul class="sp-swatches u-mt-2" style="--n:6">
      <li class="sp-sw"><i class="sw--grant"></i><b>Zuschuss</b><span>PGN-Rot</span></li><li class="sp-sw"><i class="sw--loan"></i><b>Darlehen</b><span>#202020 · Poché</span></li><li class="sp-sw"><i class="sw--equity"></i><b>Eigenmittel</b><span>Schraffur, beschriftet</span></li><li class="sp-sw"><i style="background:var(--seq-6)"></i><b>Gruppe A</b><span>Stufe 6</span></li><li class="sp-sw"><i style="background:var(--seq-4)"></i><b>Gruppe B</b><span>Stufe 4</span></li><li class="sp-sw"><i style="background:var(--seq-2)"></i><b>Gruppe C</b><span>Stufe 2</span></li>
    </ul>
    <p class="caveat">Geprüft mit validate_palette.js: Programmteile benachbart CVD ΔE ≥ 10,9, Normalsicht ΔE ≥ 22,2; Zuschuss/Darlehen CVD ΔE 16,8. Eigenmittel nur mit Schraffur und Beschriftung. Kein Grün.</p>
  </section>
  <div class="l-grid u-mt-6">
    <section class="l-span-7 sp-type module" aria-label="Typografie">
      <p class="label">H1 · Montserrat 900 · 25 pt</p><p class="h1 h1--norule">Höchstmieten <em>planbar</em></p>
      <p class="label">Deck · Montserrat 300 · 10,5 pt</p><p class="deck">In den ersten drei Jahren <b>6,50–9,00&nbsp;€</b> je m²</p>
      <p class="label">H2 · Montserrat 900 · 13 pt</p><p class="h2">Zuschläge und Sonderformen</p>
      <p class="label">H3 · Montserrat 700 · 10,5 pt</p><p class="h3">Wann gilt ein Vorhaben als begonnen?</p>
      <p class="label">Lead · Work Sans 11 pt</p><p class="lead">Den Antrag stellen Sie bei der Wohnraumförderstelle, entscheiden wird die NBank.</p>
      <p class="label">Fließtext · Work Sans 9,75 pt / 1,47</p><p class="body">Gefördert werden gebundene Mietwohnungen. <b>Bedingungen fett</b>, Verweise als Chip <a class="pageref" href="#seite-08">→&nbsp;S.&nbsp;8</a>.</p>
      <p class="label">Kennzahl · Montserrat 800</p><p class="kf__num">4.800<span class="kf__unit">€/m²</span></p>
    </section>
    <section class="l-span-5 module" aria-label="Planzeichen">
      <p class="label">Achskreise · Einkommensgruppen</p>
      <div class="sp-row u-mt-2"><span class="axis-no">A</span><span class="axis-no">B</span><span class="axis-no">C</span><span class="axis-no axis-no--accent">80</span><span class="grp-chip grp-chip--l grp-chip--a">A</span><span class="grp-chip grp-chip--l grp-chip--b">B</span><span class="grp-chip grp-chip--l grp-chip--c">C</span></div>
      <p class="label u-mt-4">Höhenkoten</p>
      <div class="sp-row u-mt-2"><span class="kote">±0,00 Bewilligung</span><span class="kote">+1 Bau</span></div>
      <p class="label u-mt-4">Maßkette</p>
      <div class="dim u-mt-2" role="img" aria-label="Maßkette: 80 Prozent Förderung, 20 Prozent Eigenmittel"><span class="dim__seg dim__seg--acc" style="--w:80"><b>80&nbsp;%</b>&nbsp;Förderung</span><span class="dim__seg dim__seg--muted" style="--w:20">20&nbsp;%</span></div>
      <p class="label u-mt-4">Schlüsselplan</p>
      <div class="u-mt-2">${keyplan('2.4')}</div>
      <p class="label u-mt-4">Nordpfeil · Stempel · Marken</p>
      <div class="sp-row u-mt-2"><span class="north">${A('sig-nordpfeil.svg')}</span><span class="stamp">Modellrechnung</span><span class="badge badge--form"><span class="badge__pre">Vordruck&nbsp;</span>1011</span><span class="tag"><i class="sw sw--grant"></i>Zuschuss</span><span class="mark mark--yes"></span><span class="mark mark--no"></span><span class="mark mark--warn"></span></div>
      <p class="label u-mt-4">Schnittlinie</p>
      <div class="cutline" aria-hidden="true"><span>A</span><span>A</span></div>
    </section>
  </div>
  ${foot('31', 'Designsystem · Komponenten I')}
</section>

<!-- ============================================================ Komponenten II -->
<section class="page" data-page="32" id="seite-32">
  <header class="page__header"><span class="page__section"><b>DS</b>Designsystem „Planwerk“</span><span class="ref">Specimen · Komponenten II</span></header>
  <p class="label">Hinweise · höchstens zwei Achtung-Kästen im Heft</p>
  <div class="l-grid u-mt-3">
    <aside class="l-span-4 callout callout--hinweis"><p class="callout__label">${icon.hinweis}Hinweis</p><p class="callout__title">Bemessungsgrenze</p><p class="callout__body">Ausgangswerte; fortgeschrieben zum 01.04. und 01.10.</p></aside>
    <aside class="l-span-4 callout callout--achtung"><p class="callout__label">${icon.achtung}Achtung</p><p class="callout__title">Erst Bewilligung, dann Vertrag</p><p class="callout__body">Ein Bau- oder Liefervertrag vor der Bewilligung schließt die Förderung aus.</p></aside>
    <aside class="l-span-4 callout callout--frist"><p class="callout__label">${icon.frist}Frist</p><p class="callout__date">31.12.2026</p><p class="callout__body">Wahlrecht für Modernisierungs&shy;anträge mit Eingang bis zu diesem Tag.</p></aside>
    <dl class="l-span-6 plan-legend"><p class="plan-legend__title">Planlegende</p>
      <div class="plan-legend__item"><span class="plan-legend__sym">${icon.bindung}</span><div><dt>35 Jahre Bindung</dt><dd>Belegungs- und Mietbindung ab Bezugsfertigkeit.</dd></div></div>
      <div class="plan-legend__item"><span class="plan-legend__sym">${icon.plus}</span><div><dt>Zuschuss-Plus</dt><dd>Modellprojekte bis +5, <span lang="en">Housing First</span> bis +10 Prozentpunkte.</dd></div></div>
      <p class="offer">Wir rechnen Ihr Projekt mit Ihnen durch. → Blatt 20</p>
    </dl>
    <div class="l-span-6 l-stack l-stack--m">
      <aside class="callout callout--calc"><p class="callout__label">${icon.rechner}Kalkulationsnotiz</p><p class="callout__body">2,1 Mio. € Mehrdarlehen × 1,26 % Tilgung = 26.460 € je Jahr – der Mietvorteil von Gruppe C ist damit aufgezehrt.</p></aside>
      <p class="gate">${icon.stopp}<span><b>±0 Bewilligung</b> – erst danach Verträge und Baubeginn</span></p>
      <ul class="bullets"><li>Aufzählung mit eckigem Marker in PGN-Rot</li><li><b>Bedingung</b> fett im Modultext 9 pt</li></ul>
    </div>
  </div>
  <div class="key-figures u-mt-6">
    <div class="kf kf--hero">
      <p class="kf__top"><span class="kf__idx">01</span><span>Programmteil 2.1</span></p>
      <p class="kf__fig"><span class="kf__pre">bis zu</span><span class="kf__num">80<span class="kf__unit">%</span></span></p>
      <div class="kf__side"><p class="kf__label">Förderquote aus Darlehen und Zuschuss</p><p class="kf__text">In allen drei Einkommensgruppen; Eigenmittel mindestens 20&nbsp;%.</p></div>
    </div>
    <div class="kf"><p class="kf__top"><span class="kf__idx">02</span><span>Zins</span></p><p class="kf__fig"><span class="kf__num">0<span class="kf__unit">%</span></span></p><p class="kf__label">Zins bis Ende Jahr 35</p><p class="kf__text">Verwaltungskostenbeitrag 0,5&nbsp;% p.&nbsp;a.</p></div>
    <div class="kf"><p class="kf__top"><span class="kf__idx">03</span><span>Bindung</span></p><p class="kf__fig"><span class="kf__num">35<span class="kf__unit">Jahre</span></span></p><p class="kf__label">Belegungs- und Mietbindung</p><p class="kf__text">Ab Bezugsfertigkeit.</p></div>
    <div class="kf kf--accent"><p class="kf__top"><span class="kf__idx">04</span><span>Bemessungsgrenze</span></p><p class="kf__fig"><span class="kf__num">4.800<span class="kf__unit">€</span></span><span class="kf__sub">je m² Wohnfläche, Mietenstufe I–III</span></p></div>
  </div>
  <div class="l-grid u-mt-6">
    <figure class="l-span-6" role="group" aria-labelledby="sp-hm-h">
      <div class="chart__head"><div><h2 class="chart__title" id="sp-hm-h">Höchstmieten</h2></div><p class="chart__sub">Nettokaltmiete in € je m² Wohnfläche, erste drei Jahre</p></div>
      <table class="table table--figures u-mt-3">
        <thead><tr><th scope="col">Mietenstufe</th><th class="num" scope="col"><span class="axis-no axis-no--s">A</span></th><th class="num" scope="col"><span class="axis-no axis-no--s">B</span></th><th class="num" scope="col"><span class="axis-no axis-no--s">C</span></th></tr></thead>
        <tbody><tr><th scope="row">I–III</th><td class="num">6,50</td><td class="num">7,90</td><td class="num">8,70</td></tr><tr><th scope="row">IV–VII</th><td class="num">6,80</td><td class="num">8,20</td><td class="num">9,00</td></tr></tbody>
      </table>
    </figure>
    <div class="l-span-6">
      <h2 class="chart__title">Eckdaten</h2>
      <table class="table table--terms u-mt-3"><tbody>
        <tr><th scope="row">Bindung</th><td>35 Jahre Belegungs- und Mietbindung</td></tr>
        <tr><th scope="row">Darlehen</th><td>0&nbsp;% Zins bis Ende Jahr 35, Verwaltungskostenbeitrag 0,5&nbsp;% p.&nbsp;a.</td></tr>
        <tr><th scope="row">Ersterwerb</th><td>bis zwei Jahre nach Fertigstellung</td></tr>
      </tbody></table>
    </div>
  </div>
  ${foot('32', 'Designsystem · Komponenten II')}
</section>

<!-- ============================================================ Komponenten III -->
<section class="page" data-page="33" id="seite-33">
  <header class="page__header"><span class="page__section"><b>DS</b>Designsystem „Planwerk“</span><span class="ref">Specimen · Komponenten III</span></header>
  <div class="l-grid">
    <div class="l-span-7">
      <h2 class="chart__title">Antragsweg · Höhenkoten</h2>
      <ol class="steps steps--kote u-mt-3">
        <li class="step"><span class="step__no">−2</span><div><p class="step__title">Vorgespräch</p><p class="step__text">Mit der Wohnraumförderstelle: Programmteil, Bedarf, Mieterkreis.</p></div></li>
        <li class="step"><span class="step__no">−1</span><div><p class="step__title">Antrag</p><p class="step__text">Unterlagen über die Wohnraumförderstelle an die NBank.</p></div></li>
        <li class="step is-gate"><span class="step__no">±0</span><div><p class="step__title">Bewilligung</p><p class="step__text">Erst jetzt Verträge schließen und bauen.</p></div></li>
        <li class="step"><span class="step__no">+1</span><div><p class="step__title">Bau und Auszahlung</p><p class="step__text">Raten nach Baufortschritt.</p></div></li>
      </ol>
    </div>
    <div class="l-span-5">
      <blockquote class="quote"><div class="quote__text"><p>Kostensicherheit ist kein Schlagwort, sondern ein wichtiges Versprechen.</p></div><p class="quote__by"><span class="quote__name">PGN · Über uns</span><span class="quote__src">pgn-architekten.de</span></p></blockquote>
      <p class="label u-mt-6">Plakatzeile (Kapitelöffner)</p>
      <p class="claim u-mt-2">Planen. Fördern. <em>Bauen.</em></p>
    </div>
  </div>
  <p class="label u-mt-8">Referenzen · Duplex ≤ 120 mm</p>
  <div class="references u-mt-3" style="--n:3">
    <article class="reference"><figure class="photo" role="group" style="--photo-h:30mm"><img class="photo__img" src="assets/pgn/img/porstweg-duplex.jpg" alt="Visualisierung Porstweg, Rotenburg (Wümme)"></figure><p class="reference__units">29 <small>Wohnungen</small></p><h3 class="reference__name u-mt-2">Porstweg</h3><p class="reference__place">Rotenburg (Wümme) · für die Wohnungsbau-Genossenschaft Rotenburg (Wümme) eG</p></article>
    <article class="reference"><figure class="photo" role="group" style="--photo-h:30mm"><img class="photo__img" src="assets/pgn/img/dehnenweg-duplex.jpg" alt="Visualisierung Dehnenweg, Hohenhameln"></figure><p class="reference__units">15 <small>Wohnungen</small></p><h3 class="reference__name u-mt-2">Dehnenweg</h3><p class="reference__place">Hohenhameln · für die kwg Kreiswohnbaugesellschaft Hildesheim mbH</p></article>
    <article class="reference"><figure class="photo" role="group" style="--photo-h:30mm"><img class="photo__img" src="assets/pgn/img/burgsiedlung-duplex.jpg" alt="Visualisierung Burgsiedlung, Stade"></figure><p class="reference__units">40 <small>Wohnungen</small></p><h3 class="reference__name u-mt-2">Burgsiedlung</h3><p class="reference__place">Stade · für die IDB mbH &amp; Co. Stade-Altes Land KG</p></article>
  </div>
  <div class="l-grid u-mt-8">
    <figure class="l-span-6 photo photo--marks" role="group" style="--photo-h:40mm;--cap-h:7mm">
      <img class="photo__img" src="assets/pgn/img/brauerstrasse-duplex-rot.jpg" alt="Brauerstraße als roter Duplex">
      <figcaption class="photo__caption"><b>Duplex rot</b><span>nur Kapitelauftakt</span></figcaption>
    </figure>
    <div class="l-span-6 l-stack l-stack--m">
      <p class="label">Schriftfeld · Logo</p>
      <div class="titleblock titleblock--frame" style="--n:3">
        <div class="titleblock__cell"><p class="titleblock__label">Projekt</p><p class="titleblock__value">Mietwohnraum&shy;förderung 2026</p></div>
        <div class="titleblock__cell"><p class="titleblock__label">Planinhalt</p><p class="titleblock__value">Über PGN</p></div>
        <div class="titleblock__cell titleblock__cell--blatt"><p class="titleblock__label">Blatt</p><p class="titleblock__value">22</p></div>
      </div>
      <div class="l-row" style="--row-gap:4mm">
        <img class="logo logo--m" src="assets/pgn/logo-rot.svg" alt="PGN – Architekten, Stadtplaner, Ingenieure">
        <span class="on-red" style="background:var(--grad-red);padding:3mm 4mm"><img class="logo logo--s" src="assets/pgn/logo-negativ.svg" alt="PGN, Negativ-Variante"></span>
      </div>
    </div>
  </div>
  ${foot('33', 'Designsystem · Komponenten III')}
</section>

<!-- ============================================================ U4 -->
<section class="page page--u4" data-page="24" id="seite-24" aria-label="Rückseite">
  <div class="cover__art" data-bleed aria-hidden="true">${A('sig-grundriss.svg')}</div>
  <div class="planframe" aria-hidden="true"></div>
  <div class="back__claim">
    <p class="kicker">Planungsgemeinschaft Nord · seit 1981</p>
    <p class="claim"><span class="light">Aus Ihrer guten Idee –</span>machen wir den <em>besten Plan.</em></p>
  </div>
  <div class="back__stamp">
    <div class="back__logo is-first"><img class="logo" src="assets/pgn/logo-rot.svg" alt="PGN – Architekten, Stadtplaner, Ingenieure"><p>Ihre Generalplaner aus dem Norden – Architektur, Tragwerksplanung, Haustechnik, Stadt- und Landschaftsplanung.</p></div>
    <address class="back__contact"><span class="titleblock__label">Kontakt</span><br><b>Planungsgemeinschaft Nord GmbH</b><br>Große Straße 49<br>27356 Rotenburg (Wümme)<br>Telefon <a class="u-url" style="color:inherit;font-family:inherit;font-weight:500" href="tel:+4942619293-0">(+49) 4261 9293-0</a><br><a class="u-url" href="mailto:info@pgn-architekten.de">info@pgn-architekten.de</a><br><a class="u-url" href="https://www.pgn-architekten.de">www.pgn-architekten.de</a></address>
    <div class="back__qr">${A('qr-pgn-architekten.svg')}<span>pgn-architekten.de</span></div>
    <div class="titleblock__cell back__invite-cell is-first"><p class="kicker kicker--plain">Förder-Check</p><p class="titleblock__value">Sprechen Sie uns an: Im Förder-Check prüfen wir mit Ihnen, welcher Programmteil zu Ihrem Projekt passt und wie es sich rechnet.</p></div>
    <div class="titleblock__cell is-row2 is-first" style="grid-column:1 / span 2"><p class="titleblock__label">Projekt</p><p class="titleblock__value">Mietwohnraumförderung Niedersachsen 2026 · Stand 21.10.2026</p></div>
    <div class="titleblock__cell titleblock__cell--blatt is-row2"><p class="titleblock__label">Blatt</p><p class="titleblock__value">U4</p></div>
  </div>
</section>

</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, 'src/.preview-specimen.html'), html);
console.log('src/.preview-specimen.html', Math.round(html.length / 1024), 'KB');
