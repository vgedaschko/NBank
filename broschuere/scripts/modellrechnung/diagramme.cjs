// Generator der Diagramme für die Broschüre S. 10–12 (Bogenseiten): liest die Zahlen aus der Rechenmappe
// (praesentation/daten/kennzahlen.json und werte.json über praesentation/lib/daten.cjs) und gibt SVG aus.
'use strict';
const d = require(require('path').join(__dirname, '../../../praesentation/lib/daten.cjs'));
const K = d.K, W = (k) => d.W('modellhaus', k), f = d.fmt;
const r = (n) => { const s = (Math.round(n * 100) / 100).toFixed(2).replace(/\.?0+$/, ''); return s === '-0' ? '0' : s; };
const NB = ' ';   // schmales geschütztes Leerzeichen zwischen Zahl und Einheit im SVG
const de = (v, nk = 0) => f.zahl(v, nk);
const mio = (v) => de(v / 1e6, 2);

// ---------------------------------------------------------------- S. 10: zwei Häuser, Mittelherkunft
function haeuser() {
  const gk = K('n5.gesamtkosten.A'), zu = K('n5.zuschuss.A'), dl = K('n5.darlehen_nbank.A'), bank = K('n5.bankdarlehen.frei_markt');
  const ek = K('n5.eigenkapital.frei_markt');
  if (Math.abs(zu / gk - 0.4) > 1e-9 || Math.abs(ek / gk - 0.2) > 1e-9) throw new Error('Quoten 40/20 % stimmen nicht mehr: Geschosse neu teilen');
  const W_ = 34, H = 9.4, B = [0, 1, 2, 3, 4, 5].map(i => 5 + i * H), G = B[5];   // Geschossgrenzen: je Geschoss 20 % der Gesamtkosten
  const out = [];
  const haus = (x0, arten) => {
    // arten: je Geschoss von oben 'eq' | 'loan' | 'grant'
    out.push(`<rect class="c-muted" x="${r(x0 - 0.6)}" y="3.8" width="${r(W_ + 1.2)}" height="1.2"/>`);
    for (let i = 0; i < 4; i++) { const px = x0 + 1.8 + i * 7.9; out.push(`<polygon class="ill-pv" points="${r(px)},3.8 ${r(px + 6.4)},3.8 ${r(px + 5.6)},1.4 ${r(px - 0.8)},1.4"/>`); }
    for (let g = 0; g < 5; g++) {
      const a = arten[g], oben = arten[g - 1], unten = arten[g + 1];
      const y0 = B[g] + (g === 0 ? 0 : oben === a ? 0.15 : 0.35 * (a === 'eq' || oben === 'eq' ? 0 : 1));
      const y1 = B[g + 1] - (g === 4 ? 0 : unten === a ? 0.15 : 0.35 * (a === 'eq' || unten === 'eq' ? 0 : 1));
      if (a === 'eq') {
        out.push(`<rect class="c-equity" x="${r(x0)}" y="${r(y0)}" width="${W_}" height="${r(y1 - y0)}"/>`);
        out.push(`<path class="hatch" data-hatch="${r(x0 + 0.1)} ${r(y0 + 0.1)} ${r(W_ - 0.2)} ${r(y1 - y0 - 0.2)}" d=""/>`);
        out.push(`<rect class="c-equity-frame" x="${r(x0 + 0.1)}" y="${r(y0 + 0.1)}" width="${r(W_ - 0.2)}" height="${r(y1 - y0 - 0.2)}"/>`);
        for (const dx of [9.85, 19.55]) out.push(`<rect class="p10-win p10-win--eq" x="${r(x0 + dx)}" y="${r(y0 + (y1 - y0 - 6) / 2)}" width="4.6" height="6"/>`);
      } else {
        out.push(`<rect class="${a === 'grant' ? 'c-grant' : 'c-loan'}" x="${r(x0)}" y="${r(y0)}" width="${W_}" height="${r(y1 - y0)}"/>`);
        for (const dx of [4.9, 14.6, 24.3]) out.push(`<rect class="p10-win" x="${r(x0 + dx)}" y="${r(y0 + (y1 - y0 - 6.2) / 2)}" width="4.8" height="6.2"/>`);
      }
    }
  };
  const xA = 26, xF = 108;
  haus(xA, ['eq', 'loan', 'loan', 'grant', 'grant']);
  haus(xF, ['eq', 'loan', 'loan', 'loan', 'loan']);
  out.push(`<path class="p10-ground" d="M20.5,${G}H${r(xA + W_ + 4)}M${r(xF - 4)},${G}H${r(xF + W_ + 4)}"/>`);
  // Maßkette links: Eigenkapital 20 % | Fremdkapital 80 % (gilt für beide Häuser)
  const mx = 21.8;
  out.push(`<path class="dim-line" stroke-width=".12" d="M${r(xA - 0.4)},5H${r(mx - 1.3)}M${r(xA - 0.4)},${B[1]}H${r(mx - 1.3)}M${r(xA - 0.4)},${G}H${r(mx - 1.3)}"/>`);
  out.push(`<path class="dim-line" d="M${r(mx)},3.7V${r(G + 1.3)}"/>`);
  out.push(`<path class="dim-tick" d="${[5, B[1], G].map(y => `M${r(mx - 0.9)},${r(y + 0.9)}L${r(mx + 0.9)},${r(y - 0.9)}`).join('')}"/>`);
  const lx = mx - 1.8;
  out.push(`<text class="p10-lab t-end" x="${r(lx)}" y="${r(B[0] + H / 2 - 0.6)}"><tspan class="t-b">Eigenkapital</tspan></text>`);
  out.push(`<text class="t-val-ink t-end" x="${r(lx)}" y="${r(B[0] + H / 2 + 3.6)}">${de(ek / gk * 100)}${NB}%</text>`);
  out.push(`<text class="p10-lab t-end" x="${r(lx)}" y="${r((B[1] + G) / 2 - 0.6)}"><tspan class="t-b">Fremdkapital</tspan></text>`);
  out.push(`<text class="t-val-ink t-end" x="${r(lx)}" y="${r((B[1] + G) / 2 + 3.6)}">${de((1 - ek / gk) * 100)}${NB}%</text>`);
  // Beschriftung rechts neben jedem Haus: Bezeichnung und Betrag in Mio. €
  const lab = (x, yMitte, name, wert, acc) => {
    out.push(`<text class="p10-lab" x="${r(x + 0.25)}" y="${r(yMitte - 2.2)}"><tspan class="t-b">${name[0]}</tspan>${name[1] ? ' · ' + name[1] : ''}</text>`);
    out.push(`<text class="t-num${acc ? ' t-acc' : ''}" x="${r(x)}" y="${r(yMitte + 4.3)}">${mio(wert)}<tspan class="t-unit" dx="0.9">Mio.${NB}€</tspan></text>`);
  };
  const ax = xA + W_ + 2.6, fx = xF + W_ + 2.6;
  lab(ax, B[0] + H / 2, ['Eigenkapital'], ek);
  lab(ax, B[2], ['NBank-Darlehen', `${f.prozent(K('annahme.zins_nbank_bis_jahr35'), 0)} Zins`], dl);
  lab(ax, B[4], ['Zuschuss', 'nicht rückzahlbar'], zu, true);
  lab(fx, B[0] + H / 2, ['Eigenkapital'], ek);
  lab(fx, B[3], ['Bankdarlehen', `${f.prozent(K('annahme.zins_bank'), 2)} Zins`], bank);
  // Bezeichnung unter den Häusern
  out.push(`<text class="t-b t-mid" x="${r(xA + W_ / 2)}" y="${r(G + 5.6)}">Gefördert, Gruppe A</text>`);
  out.push(`<text class="t-b t-mid" x="${r(xF + W_ / 2)}" y="${r(G + 5.6)}">Frei finanziert</text>`);
  const aria = `Mittelherkunft des Modellhauses, Gesamtkosten je ${mio(gk)} Millionen Euro, dargestellt als zwei Häuser mit fünf gleich hohen Geschossen zu je 20 Prozent. Gefördert in Gruppe A: unten zwei Geschosse Zuschuss ${mio(zu)} Millionen Euro, nicht rückzahlbar, darüber zwei Geschosse NBank-Darlehen ${mio(dl)} Millionen Euro zu 0 Prozent Zins, oben ein Geschoss Eigenkapital ${mio(ek)} Millionen Euro. Frei finanziert: vier Geschosse Bankdarlehen ${mio(bank)} Millionen Euro zu ${f.prozent(K('annahme.zins_bank'), 2).replace(/\s%/, ' Prozent')} Zins, oben ein Geschoss Eigenkapital ${mio(ek)} Millionen Euro. Maßkette: Fremdkapital 80 Prozent, Eigenkapital 20 Prozent, in beiden Fällen gleich.`;
  return `<svg class="chart__svg p10-house__svg" viewBox="0 0 180 ${r(G + 7)}" width="180mm" height="${r(G + 7)}mm" role="img" aria-label="${aria}">${out.join('')}</svg>`;
}

module.exports = { haeuser, K, W, de, mio, r, NB };


// ---------------------------------------------------------------- S. 11: Wohin die Miete fließt (Anteile an der Sollmiete)
function fluss() {
  const wf = W('eingabe.wohnflaeche'), mA = W('jr1.sollmiete.A'), mF = K('n5.miete_jahr1.frei_markt') * wf * 12;
  const bewA = W('jr1.mietausfall.A') + W('jr1.objektverwaltung.A') + W('jr1.instandhaltung.A');
  const bewF = W('eingabe.mietausfall') * mF + W('jr1.objektverwaltung.Frei') + W('jr1.instandhaltung.Frei');
  const A = [['bew', bewA], ['vkb', W('jr1.verwaltungskostenbeitrag.A')], ['zins', W('jr1.zins_nbank.A')], ['tilg', W('jr1.tilgung_nbank.A')], ['ue', W('jr1.zahlungsueberschuss.A')]];
  const F = [['bew', bewF], ['zins', -W('frei.zins_jahr1')], ['tilg', -W('frei.tilgung_jahr1')]];
  const fehl = F.reduce((s, x) => s + x[1], 0) - mF;   // Kapitaldienst und Bewirtschaftung über der Sollmiete
  if (Math.abs(A.reduce((s, x) => s + x[1], 0) - mA) > 1) throw new Error('Anteile A gehen nicht auf');
  if (Math.abs(fehl + K('n5.zue_jahr1.frei_markt')) > 1) throw new Error('Fehlbetrag stimmt nicht mit Kennzahlen G61');
  const x0 = 33, L = 136, y = { A: 6, F: 20 }, h = 9, out = [];
  const cls = { bew: 'c-seq-2', vkb: 'c-seq-3', zins: 'c-seq-4', tilg: 'c-loan', ue: 'p11-ue' };
  const hell = { bew: true, vkb: true, ue: true };
  const pct = (v, m) => de(v / m * 100, 1) + NB + '%';
  const balken = (reihe, m, yy) => {
    let x = x0;
    reihe.forEach(([k, v], i) => {
      if (v <= 0) return;
      const w = v / m * L, a = i === 0 ? 0 : 0.35, b = 0.35;
      out.push(`<rect class="${cls[k]}" x="${r(x + a)}" y="${yy}" width="${r(w - a - b)}" height="${h}"/>`);
      if (w > 9) out.push(`<text class="${hell[k] ? 't-val-ink' : 't-val'} t-mid" x="${r(x + w / 2)}" y="${r(yy + h / 2 + 1.15)}">${pct(v, m)}</text>`);
      x += w;
    });
    return x;
  };
  balken(A, mA, y.A);
  const ende = balken(F, mF, y.F);
  // 100 % = Sollmiete; frei finanziert reicht die Miete nicht: der Rest über das Kontokorrent
  out.push(`<path class="p11-100" d="M${r(x0 + L)},${y.A - 3.4}V${y.F + h + 1.2}"/>`);
  out.push(`<text class="t-ax t-end" x="${r(x0 + L - 0.8)}" y="${r(y.A - 1.3)}">100${NB}% = Sollmiete</text>`);
  out.push(`<rect class="p11-fehl" x="${r(x0 + L + 0.2)}" y="${r(y.F + 0.2)}" width="${r(ende - x0 - L - 0.4)}" height="${r(h - 0.4)}"/>`);
  out.push(`<text class="t-ax t-end" x="${r(x0 + L + 2.4)}" y="${r(y.F + h + 4.6)}">Fehlbetrag ${pct(fehl, mF)}, über das Kontokorrent</text>`);
  // Bezeichnung links
  const kat = (yy, name, m) => {
    out.push(`<text class="t-b" x="0" y="${r(yy + 3.6)}">${name}</text>`);
    out.push(`<text class="t-ax" x="0" y="${r(yy + 7.6)}">Sollmiete ${de(m)}${NB}€</text>`);
  };
  kat(y.A, 'Gefördert, Gruppe A', mA);
  kat(y.F, 'Frei finanziert', mF);
  const aria = `Wohin die Miete in Jahr 1 fließt, in Prozent der Sollmiete. Gefördert, Gruppe A, Sollmiete ${de(mA)} Euro: Bewirtschaftung und Mietausfall ${pct(bewA, mA)}, Verwaltungskostenbeitrag ${pct(A[1][1], mA)}, Zins 0 Prozent, Tilgung ${pct(A[3][1], mA)}, Zahlungsüberschuss ${pct(A[4][1], mA)}. Frei finanziert zur Marktmiete, Sollmiete ${de(mF)} Euro: Bewirtschaftung und Mietausfall ${pct(bewF, mF)}, Zins ${pct(F[1][1], mF)}, Tilgung ${pct(F[2][1], mF)}; zusammen mehr als die Miete, der Fehlbetrag von ${pct(fehl, mF)} läuft über das Kontokorrent.`.replace(/ %/g, ' Prozent');
  return `<svg class="chart__svg p11-fl__svg" viewBox="0 0 180 ${y.F + h + 6}" width="180mm" height="${y.F + h + 6}mm" role="img" aria-label="${aria}">${out.join('')}</svg>`;
}

// ---------------------------------------------------------------- S. 11: Miete für eine DSCR von 1,2
function dscr() {
  const nA = K('n3.miete_dscr.A'), hm = K('n3.hoechstmiete.A'), nF = K('n2.miete_dscr'), markt = K('n2.marktmiete_jahr1');
  const x0 = 24, s = 2.8, X = (v) => x0 + v * s, out = [], yA = 7, yF = 22, h = 7;
  // Achse mit Teilstrichen statt Gitter: Gitterlinien liefen durch die Beschriftung der Marken
  out.push(`<path class="ax" d="M${x0},${yF + h + 1.6}H${r(X(21))}"/>`);
  for (let v = 0; v <= 21; v += 3) {
    out.push(`<path class="tick" d="M${r(X(v))},${yF + h + 1.6}v1.2"/>`);
    out.push(`<text class="t-ax t-mid" x="${r(X(v))}" y="${yF + h + 6}">${v}</text>`);
  }
  out.push(`<rect class="c-ink" x="${x0}" y="${yA}" width="${r(nA * s)}" height="${h}"/>`);
  out.push(`<text class="t-val t-end" x="${r(X(nA) - 1.2)}" y="${r(yA + h / 2 + 1.15)}">${de(nA, 2)}${NB}€</text>`);
  out.push(`<path class="p11-mk" d="M${r(X(hm))},${yA - 2.2}V${yA + h + 1}"/>`);
  out.push(`<text class="t-ax" x="${r(X(hm) + 1)}" y="${r(yA - 0.4)}">Höchstmiete <tspan class="t-b">${de(hm, 2)}${NB}€</tspan></text>`);
  out.push(`<rect class="c-old" x="${x0}" y="${yF}" width="${r(markt * s - 0.35)}" height="${h}"/>`);
  out.push(`<rect class="p11-luecke" x="${r(X(markt) + 0.35)}" y="${r(yF + 0.15)}" width="${r((nF - markt) * s - 0.5)}" height="${r(h - 0.3)}"/>`);
  out.push(`<text class="t-val-ink" x="${r(X(nF) + 1.2)}" y="${r(yF + h / 2 + 1.15)}">${de(nF, 2)}${NB}€</text>`);
  out.push(`<text class="t-ax t-end" x="${r(X(markt) - 0.6)}" y="${r(yF - 1.2)}">Marktmiete <tspan class="t-b">${de(markt, 2)}${NB}€</tspan></text>`);
  out.push(`<text class="t-b" x="0" y="${r(yA + h / 2 + 1.1)}">Gruppe A</text>`);
  out.push(`<text class="t-b" x="0" y="${r(yF + h / 2 + 1.1)}">Frei finanziert</text>`);
  out.push(`<text class="t-ax t-end" x="${r(X(21))}" y="${yF + h + 10}">€ je m² und Monat</text>`);
  const aria = `Miete je Quadratmeter und Monat, bei der der Überschuss vor Kapitaldienst in Jahr 1 das 1,2-Fache des Kapitaldiensts erreicht. Gruppe A: ${de(nA, 2)} Euro, die Höchstmiete von ${de(hm, 2)} Euro liegt darüber. Frei finanziert: ${de(nF, 2)} Euro, die Marktmiete von ${de(markt, 2)} Euro liegt ${de(nF - markt, 2)} Euro darunter.`;
  return `<svg class="chart__svg p11-ds__svg" viewBox="0 0 87.5 ${yF + h + 11}" width="87.5mm" height="${yF + h + 11}mm" role="img" aria-label="${aria}">${out.join('')}</svg>`;
}

// ---------------------------------------------------------------- S. 11: Spielraum in Jahr 1
function spielraum() {
  const k = (g) => { // Kostenschwelle wie folien/_rechnung.cjs (Nullstelle, auf 10 € abgerundet)
    const L = ['modellhaus', 'modellhaus_kosten_5460'], k0 = d.W(L[0], 'eingabe.herstellungskosten_qm'), k2 = d.W(L[1], 'eingabe.herstellungskosten_qm');
    const z0 = d.W(L[0], `jr1.zahlungsueberschuss.${g}`), z2 = d.W(L[1], `jr1.zahlungsueberschuss.${g}`);
    return Math.floor((k0 + z0 * (k2 - k0) / (z0 - z2)) / 10) * 10;
  };
  const kM = W('eingabe.herstellungskosten_qm'), kA = k('A'), kC = k('C'), arge = d.X('markt', 'kosten.arge.spanne_herstellung.median');
  const tM = W('eingabe.tilgung_nbank'), tA = W('liq.breakeven_tilgung.A'), tC = W('liq.breakeven_tilgung.C');
  const x0 = 24, Lg = 54, out = [], h = 5.6;
  const gruppe = (y0, titel, annahme, werte, max, fmtV, marke) => {
    const X = (v) => x0 + v / max * Lg;
    out.push(`<text class="t-b" x="0" y="${r(y0 + 2.6)}">${titel}</text>`);
    werte.forEach(([g, v], i) => {
      const yy = y0 + 5.2 + i * (h + 2);
      out.push(`<text class="t-ax" x="0" y="${r(yy + h / 2 + 1.05)}">Gruppe ${g}</text>`);
      out.push(`<rect class="c-ink" x="${x0}" y="${r(yy)}" width="${r(X(annahme) - x0 - 0.35)}" height="${h}"/>`);
      out.push(`<text class="t-val" x="${r(x0 + 1.4)}" y="${r(yy + h / 2 + 1.15)}">${fmtV(annahme)}</text>`);
      out.push(`<rect class="c-seq-2" x="${r(X(annahme) + 0.35)}" y="${r(yy)}" width="${r(X(v) - X(annahme) - 0.35)}" height="${h}"/>`);
      const lx = marke && X(marke.wert) > X(v) - 0.5 && X(marke.wert) < X(v) + 12 ? X(marke.wert) + 1.2 : X(v) + 1.2;
      out.push(`<text class="t-val-ink" x="${r(lx)}" y="${r(yy + h / 2 + 1.15)}">${fmtV(v)}</text>`);
    });
    if (marke) {
      const yu = y0 + 5.2 + 2 * (h + 2);
      out.push(`<path class="p11-arge" d="M${r(X(marke.wert))},${r(y0 + 4)}V${r(yu - 0.6)}"/>`);
      out.push(`<text class="t-ax t-end" x="${r(X(marke.wert) - 0.8)}" y="${r(yu + 1.6)}">${marke.text}</text>`);
    }
  };
  gruppe(0, 'Herstellungskosten je m²', kM, [['A', kA], ['C', kC]], 6000, (v) => de(v) + NB + '€', { wert: arge, text: `ARGE-Median ${de(arge)}${NB}€` });
  gruppe(23.5, 'Tilgungssatz p. a.', tM * 100, [['A', tA * 100], ['C', tC * 100]], 4, (v) => de(v, 2) + NB + '%', null);
  const aria = `Spielraum in Jahr 1: bis zu welchen Herstellungskosten und bis zu welchem Tilgungssatz ein Zahlungsüberschuss bleibt. Herstellungskosten je Quadratmeter: gerechnet mit ${de(kM)} Euro, Gruppe A trägt sich bis rund ${de(kA)} Euro, Gruppe C bis rund ${de(kC)} Euro; der ARGE-Median liegt bei ${de(arge)} Euro. Tilgungssatz: gerechnet mit ${de(tM * 100, 2)} Prozent, Gruppe A bis ${de(tA * 100, 2)} Prozent, Gruppe C bis ${de(tC * 100, 2)} Prozent.`;
  return `<svg class="chart__svg p11-sp__svg" viewBox="0 0 87.5 43" width="87.5mm" height="43mm" role="img" aria-label="${aria}">${out.join('')}</svg>`;
}
module.exports.fluss = fluss; module.exports.dscr = dscr; module.exports.spielraum = spielraum;

// ---------------------------------------------------------------- S. 12: Verlauf A und C, Jahr 1 bis 35
function verlauf() {
  const J = d.W.reihe('modellhaus_zeitreihe', 'zr.jahr'), A = d.W.reihe('modellhaus_zeitreihe', 'zr.zahlungsueberschuss.A'), C = d.W.reihe('modellhaus_zeitreihe', 'zr.zahlungsueberschuss.C');
  const n = J.length - 1;
  if (J[0] !== 1 || J[n] !== 35 || !A.every(v => v > 0) || !C.every(v => v > 0)) throw new Error('Zeitreihe oder Aussage „kein Jahr mit Fehlbetrag“ stimmt nicht');
  let k = n; while (k > 0 && C[k - 1] > A[k - 1]) k--;
  const ab = J[k];
  const x0 = 14, x1 = 100, yT = 5, yB = 53, max = 100000;
  const X = (j) => x0 + (j - 1) / 34 * (x1 - x0), Y = (v) => yB - v / max * (yB - yT), out = [];
  for (let v = 0; v <= max; v += 20000) {
    out.push(`<path class="${v ? 'gridline' : 'ax'}" d="M${x0},${r(Y(v))}H${x1}"/>`);
    out.push(`<text class="t-ax t-end" x="${x0 - 1.4}" y="${r(Y(v) + 1.05)}">${de(v)}</text>`);
  }
  for (const j of [1, 5, 10, 15, 20, 25, 30, 35]) {
    out.push(`<path class="tick" d="M${r(X(j))},${yB}v1.2"/>`);
    out.push(`<text class="t-ax t-mid" x="${r(X(j))}" y="${yB + 4.6}">${j}</text>`);
  }
  out.push(`<text class="t-ax t-end" x="${x1}" y="${yB + 8.6}">Jahr</text>`);
  // Fläche unter C, Linien A und C
  const pfad = (R) => R.map((v, i) => `${i ? 'L' : 'M'}${r(X(J[i]))},${r(Y(v))}`).join('');
  out.push(`<path class="p12-flaeche" d="${pfad(C)}L${r(X(35))},${yB}L${r(X(1))},${yB}Z"/>`);
  out.push(`<path class="p12-l p12-l--c" d="${pfad(C)}"/>`);
  out.push(`<path class="p12-l p12-l--a" d="${pfad(A)}"/>`);
  // Jahr 1: Werte oben links; Jahr ab: Marke
  out.push(`<text class="t-b" x="${x0 + 2}" y="9.6">Jahr 1</text>`);
  const zeile = (y, g, v) => {
    out.push(`<circle class="c-grp-${g.toLowerCase()}" cx="${x0 + 4.15}" cy="${r(y)}" r="2.15"/><text class="t-grp${g === 'C' ? ' t-grp--ink' : ''}" x="${x0 + 4.15}" y="${r(y + 1.08)}">${g}</text>`);
    out.push(`<text class="t-val-ink" x="${x0 + 7.6}" y="${r(y + 1.15)}">${de(v)}</text>`);
  };
  zeile(14, 'A', A[0]); zeile(19.4, 'C', C[0]);
  out.push(`<path class="p12-mk" d="M${r(X(ab))},${yT - 1}V${yB}"/>`);
  out.push(`<text class="t-ax" x="${r(X(ab) + 1.2)}" y="${yT + 3.4}">ab Jahr ${ab} liegt <tspan class="t-b">C</tspan> vorn</text>`);
  // Jahr 35: Werte an den Linienenden
  const ende = (g, v, dy) => {
    const y = Y(v) + dy;
    out.push(`<circle class="c-grp-${g.toLowerCase()}" cx="${r(x1 + 3.4)}" cy="${r(y)}" r="2.15"/><text class="t-grp${g === 'C' ? ' t-grp--ink' : ''}" x="${r(x1 + 3.4)}" y="${r(y + 1.08)}">${g}</text>`);
    out.push(`<text class="t-val-ink" x="${r(x1 + 6.6)}" y="${r(y + 1.15)}">${de(v)}</text>`);
  };
  ende('C', C[n], 0); ende('A', A[n], 0);
  out.push(`<text class="t-ax" x="${x0 - 12}" y="2.2">€ p. a.</text>`);
  const aria = `Zahlungsüberschuss je Jahr in Euro, Jahr 1 bis 35, Gruppe A und Gruppe C. Kein Jahr mit Fehlbetrag. Jahr 1: A ${de(A[0])}, C ${de(C[0])}. Ab Jahr ${ab} liegt C vor A. Jahr 35: A ${de(A[n])}, C ${de(C[n])}. Die Miete steigt alle drei Jahre, deshalb springen beide Linien im Abstand von drei Jahren.`;
  return `<svg class="chart__svg p12-vl__svg" viewBox="0 0 118.3 63" width="118.3mm" height="63mm" role="img" aria-label="${aria}">${out.join('')}</svg>`;
}

// ---------------------------------------------------------------- S. 12: Eigenkapitalrendite mit und ohne Restwert
function rendite() {
  const w = { A: [K('n5.ek_vofi_mit_restwert.A'), K('n5.ek_vofi_ohne_restwert.A')], F: [K('n5.ek_vofi_mit_restwert.frei_markt'), K('n5.ek_vofi_ohne_restwert.frei_markt')] };
  const x0 = 11, x1 = 86, yT = 5, yB = 37, max = 0.10, out = [];
  const Y = (v) => yB - v / max * (yB - yT);
  for (let v = 0; v <= max + 1e-9; v += 0.02) {
    out.push(`<path class="${v ? 'gridline' : 'ax'}" d="M${x0},${r(Y(v))}H${x1}"/>`);
    out.push(`<text class="t-ax t-end" x="${x0 - 1.4}" y="${r(Y(v) + 1.05)}">${de(v * 100)}</text>`);
  }
  const bw = 11, gruppe = (cx, [mit, ohne], name) => {
    [[mit, 'c-ink'], [ohne, 'c-seq-3']].forEach(([v, c], i) => {
      const x = cx - bw - 0.35 + i * (bw + 0.7);
      out.push(`<rect class="${c}" x="${r(x)}" y="${r(Y(v))}" width="${bw}" height="${r(yB - Y(v))}"/>`);
      out.push(`<text class="t-val-ink t-mid" x="${r(x + bw / 2)}" y="${r(Y(v) - 1.3)}">${de(v * 100, 2)}${NB}%</text>`);
    });
    out.push(`<text class="t-b t-mid" x="${r(cx)}" y="${yB + 4.6}">${name}</text>`);
  };
  gruppe(31, w.A, 'Gruppe A'); gruppe(67, w.F, 'Frei finanziert');
  out.push(`<text class="t-ax" x="0" y="2.2">% p. a.</text>`);
  const p = (v) => de(v * 100, 2) + ' Prozent';
  const aria = `Eigenkapitalrendite über 35 Jahre, vor Steuern, in Prozent pro Jahr. Gruppe A: ${p(w.A[0])} mit Restwert, ${p(w.A[1])} ohne Restwert. Frei finanziert zur Marktmiete: ${p(w.F[0])} mit Restwert, ${p(w.F[1])} ohne Restwert.`;
  return `<svg class="chart__svg p12-re__svg" viewBox="0 0 87.5 43" width="87.5mm" height="43mm" role="img" aria-label="${aria}">${out.join('')}</svg>`;
}
module.exports.verlauf = verlauf; module.exports.rendite = rendite;

if (require.main === module) {
  const f = module.exports[process.argv[2]];
  if (!f) { console.error('Aufruf: node diagramme.cjs ' + Object.keys(module.exports).join('|')); process.exit(2); }
  console.log(f());
}
