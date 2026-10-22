#!/usr/bin/env node
// PGN-Signaturen: erzeugt die Planzeichnungen des Designsystems als SVG (Einheiten = mm, viewBox in mm).
//
//   src/assets/pgn/sig-axo-brauerstrasse.svg   U1: Axonometrie nach der Kubatur des Projekts Brauerstraße,
//                                              Rotenburg (Wümme) – Klinker, Walmdach, zweigeschossiger Kopfbau,
//                                              Balkone, PV; rote Maßketten, 80-%-Marke auf der 30,00-m-Kette
//   src/assets/pgn/sig-grundriss.svg           U4 „Rotpause“: Regelgeschoss, Wände mit Poché, Achsen, Bemaßung
//                                              (ganzseitig, viewBox 0 0 210 297 → randabfallend über .cover__art)
//   src/assets/pgn/sig-nordpfeil.svg, sig-kote.svg, sig-schnitt.svg, sig-massstab.svg, sig-achskreis.svg
//                                              kleine Planzeichen (Einzelteile für Satz und InDesign)
//
// Farben: jede Datei trägt ihre Regeln in einem <style>, auf die eigene id beschränkt und über CSS-Variablen mit
// Rückfallwerten (--sig-ink, --sig-line, --sig-accent …, gesetzt in src/styles.css; Themes on-dark/on-red stellen sie um).
// Die Zeichnungen enthalten Text (Maßzahlen, Achsen) → im Satz INLINE einbetten (als <img> fehlen die Webfonts und
// render.cjs kann den Text keiner statischen Instanz zuordnen). Nutzung (aus broschuere/): node scripts/pgn-signatures.cjs

const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'src', 'assets', 'pgn');

const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
const f2 = (n) => (Math.round(n * 100) / 100).toString();
const de = (n, d = 2) => n.toFixed(d).replace('.', ',');
const FS = 3.06;                                   // 8,7 pt (Mindestschrift 8,5 pt = 3,0 mm)
const FS_RED = 3.2;                                // 9,1 pt: rote Schrift ≥ 9 pt (Druckregel 0.4), auch weiße Schrift auf Rot
const FONT = "var(--font-display, 'Montserrat Variable', Montserrat, Arial, sans-serif)";

const write = (name, svg) => {
  fs.writeFileSync(path.join(OUT, name), svg + '\n');
  console.log(`${name}: ${Math.round(svg.length / 1024)} KB`);
};

/* =========================================================================================
   1 · AXONOMETRIE (Isometrie 30°/30°) nach der Kubatur Brauerstraße
   ========================================================================================= */
function axo() {
  const L = 30, D = 12.5;               // Hauptbaukörper
  const FH = 2.9, ZE = 9.0;             // Geschosshöhe, Traufe
  const O = 0.45, HR = 3.4;             // Dachüberstand, Firsthöhe über Traufe (Walmdach, ≈ 27°)
  const W = { x0: 21, x1: 33.5, y0: 4.5, y1: 16.5, z: 6.0, za: 6.35 };   // Kopfbau, zweigeschossig, Flachdach
  const R = 2.3;                        // Achskreis
  const chainY1 = 19.2, chainY2 = 22.0, chainXpos = 36.6;               // Maßketten (Lage in m)
  const yb = chainY2 + 2.9, xb = chainXpos + 2.6;                       // Achskreise außerhalb der Ketten
  const VW = 190;
  const k = (VW - 2 * R - 6) / ((xb + yb) * C30);                       // mm je m: Achskreis 1 bis C passen in 190 mm
  const P0 = (X, Y, Z = 0) => [(X - Y) * C30 * k, (X + Y) * S30 * k - Z * k];
  const minX = P0(0, yb)[0] - R - 3;
  const minY = Math.min(P0(-O, -O, ZE + HR + 3.6)[1], P0(24.5, -4.2, 9.4 + 3.4)[1]) - 8;
  const maxY = P0(30, yb)[1] + R + 12;
  const VH = Math.ceil(maxY - minY);
  const ox = -minX, oy = -minY;
  const P = (X, Y, Z = 0) => { const p = P0(X, Y, Z); return [ox + p[0], oy + p[1]]; };
  const pt = (p) => `${f2(p[0])},${f2(p[1])}`;
  const poly = (pts, cls, extra = '') => `<polygon class="${cls}" points="${pts.map(pt).join(' ')}"${extra}/>`;
  const seg = (a, b) => `M${pt(a)}L${pt(b)}`;
  const out = [];

  // --- Achsraster am Boden ---------------------------------------------------------------
  const axesX = [0, 6, 12, 18, 24, 30];
  const axesY = [0, D / 2, D];
  let grid = '';
  axesX.forEach((x) => { grid += seg(P(x, -3), P(x, chainY1 - 0.6)); });
  axesY.forEach((y) => { grid += seg(P(-3, y), P(chainXpos - 0.6, y)); });
  out.push(`<path class="sig-grid" d="${grid}"/>`);

  // --- Bäume hinten -------------------------------------------------------------------------
  const tree = (X, Y, h, r) => {
    const base = P(X, Y, 0), top = P(X, Y, h);
    const n = 72; let d = '';
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * Math.PI * 2;
      const rr = r * k * (1 + 0.05 * Math.sin(7 * t) + 0.03 * Math.sin(13 * t + 1));
      d += (i ? 'L' : 'M') + f2(top[0] + rr * Math.cos(t)) + ',' + f2(top[1] + rr * Math.sin(t));
    }
    const inner = `M${f2(top[0] - r * k * 0.55)},${f2(top[1] + r * k * 0.1)}q${f2(r * k * 0.5)},${f2(-r * k * 0.5)} ${f2(r * k)},${f2(-r * k * 0.05)}`;
    return `<g class="sig-tree"><path d="${seg(base, [top[0], top[1] + r * k * 0.7])}"/><path class="sig-tree-crown" d="${d}Z"/><path d="${inner}"/></g>`;
  };
  out.push(tree(-3.4, 2.4, 8.2, 3.0));
  out.push(tree(24.5, -4.2, 9.4, 3.1));
  out.push(tree(9, -4.6, 8.6, 2.6));

  // --- Maß-Hilfslinien am Boden (vor dem Kopfbau gezeichnet → werden teilweise verdeckt) ----
  let dh = '';
  axesX.forEach((x) => { dh += seg(P(x, D + 0.5), P(x, chainY1 + 0.45)); });
  [24].forEach((x) => { dh += seg(P(x, chainY1 + 0.45), P(x, chainY2 + 0.45)); });
  [0, 30].forEach((x) => { dh += seg(P(x, chainY1 + 0.45), P(x, chainY2 + 0.45)); });
  axesY.forEach((y) => { dh += seg(P(L + 0.5, y), P(chainXpos + 0.45, y)); });
  out.push(`<path class="sig-dim-h" d="${dh}"/>`);

  // --- Hauptbaukörper: Flächen ----------------------------------------------------------------
  const front = [P(0, D, 0), P(L, D, 0), P(L, D, ZE), P(0, D, ZE)];
  const gable = [P(L, D, 0), P(L, 0, 0), P(L, 0, ZE), P(L, D, ZE)];
  out.push(`<defs><clipPath id="sig-axo-cpF">${poly(front, '')}</clipPath><clipPath id="sig-axo-cpG">${poly(gable, '')}</clipPath>` +
    `<clipPath id="sig-axo-cpWF">${poly([P(W.x0, W.y1, 0), P(W.x1, W.y1, 0), P(W.x1, W.y1, W.z), P(W.x0, W.y1, W.z)], '')}</clipPath>` +
    `<clipPath id="sig-axo-cpWS">${poly([P(W.x1, W.y1, 0), P(W.x1, W.y0, 0), P(W.x1, W.y0, W.z), P(W.x1, W.y1, W.z)], '')}</clipPath></defs>`);
  out.push(poly(front, 'sig-face'));
  out.push(poly(gable, 'sig-face sig-face--side'));

  // Klinker (Schichten alle 1/3 m, Stoßfugen versetzt alle 0,75 m)
  const bricks = (face, x0, x1, z1, clip) => {
    let d = '';
    const courses = Math.round(z1 * 3);
    for (let i = 1; i < courses; i++) { const z = i / 3; d += face === 'F' ? seg(P(x0, D, z), P(x1, D, z)) : seg(P(L, x1, z), P(L, x0, z)); }
    for (let i = 0; i < courses; i++) {
      const za = i / 3, zb = Math.min((i + 1) / 3, z1), off = i % 2 ? 0.375 : 0;
      for (let x = x0 + off + 0.75; x < x1; x += 0.75) d += face === 'F' ? seg(P(x, D, za), P(x, D, zb)) : seg(P(L, x, za), P(L, x, zb));
    }
    return `<path class="sig-brick" clip-path="url(#${clip})" d="${d}"/>`;
  };
  out.push(bricks('F', 0, L, ZE, 'sig-axo-cpF'));
  out.push(bricks('G', 0, D, ZE, 'sig-axo-cpG'));

  // Fenster Hauptbaukörper
  const winF = (x0, x1, z0, z1, Y = D, mull = true) => {
    let s = poly([P(x0, Y, z0), P(x1, Y, z0), P(x1, Y, z1), P(x0, Y, z1)], 'sig-win');
    s += `<path class="sig-win-l" d="${seg(P(x0 - 0.06, Y, z0 - 0.07), P(x1 + 0.06, Y, z0 - 0.07))}${mull ? seg(P((x0 + x1) / 2, Y, z0), P((x0 + x1) / 2, Y, z1)) : ''}"/>`;
    s += `<path class="sig-glint" d="${seg(P(x0 + 0.16, Y, z1 - 0.3), P(x0 + 0.42, Y, z1 - 0.04))}"/>`;
    return s;
  };
  const winS = (Xp, y0, y1, z0, z1, mull = true) => {
    let s = poly([P(Xp, y0, z0), P(Xp, y1, z0), P(Xp, y1, z1), P(Xp, y0, z1)], 'sig-win sig-win--side');
    s += `<path class="sig-win-l" d="${seg(P(Xp, y0 + 0.06, z0 - 0.07), P(Xp, y1 - 0.06, z0 - 0.07))}${mull ? seg(P(Xp, (y0 + y1) / 2, z0), P(Xp, (y0 + y1) / 2, z1)) : ''}"/>`;
    return s;
  };
  const balconyBays = [1, 2];
  let wins = '';
  for (let b = 0; b < 5; b++) {
    const cx = b * 6 + 3;
    for (let f = 0; f < 3; f++) {
      const zf = f * FH;
      if (b === 0 && f === 0) {                       // Hauseingang mit Vordach
        wins += poly([P(cx - 0.85, D, 0), P(cx + 0.85, D, 0), P(cx + 0.85, D, 2.45), P(cx - 0.85, D, 2.45)], 'sig-win sig-door');
        wins += `<path class="sig-win-l" d="${seg(P(cx, D, 0), P(cx, D, 2.45))}"/>`;
        continue;
      }
      if (b === 0) { wins += winF(cx - 0.45, cx + 0.45, zf + 1.2, zf + 2.5, D, false); continue; }   // Treppenhaus
      const tall = balconyBays.includes(b);
      const z0 = tall ? zf + 0.08 : zf + 0.9, z1 = zf + 2.35;
      wins += winF(cx - 2.3, cx - 1.0, z0, z1);
      wins += winF(cx + 1.0, cx + 2.3, z0, z1);
    }
  }
  for (const cy of [3.1, 9.4]) for (let f = 0; f < 3; f++) wins += winS(L, cy - 0.65, cy + 0.65, f * FH + 0.9, f * FH + 2.35);
  out.push(wins);
  // Fallrohre, Sockel, Traufgesims
  out.push(`<path class="sig-edge-thin" d="${seg(P(5.6, D, 0), P(5.6, D, ZE))}${seg(P(0, D, 0.45), P(L, D, 0.45))}${seg(P(L, D, 0.45), P(L, 0, 0.45))}${seg(P(0, D, ZE - 0.2), P(L, D, ZE - 0.2))}${seg(P(L, D, ZE - 0.2), P(L, 0, ZE - 0.2))}"/>`);

  // Walmdach (Ziegel)
  const e = [P(-O, D + O, ZE), P(L + O, D + O, ZE), P(L + O, -O, ZE), P(-O, -O, ZE)];
  const r1 = P(D / 2, D / 2, ZE + HR), r2 = P(L - D / 2, D / 2, ZE + HR);
  const slopeF = [e[0], e[1], r2, r1], hipR = [e[1], e[2], r2];
  out.push(`<defs><clipPath id="sig-axo-cpRF">${poly(slopeF, '')}</clipPath><clipPath id="sig-axo-cpRR">${poly(hipR, '')}</clipPath></defs>`);
  // Dachneigung (≈ 27°) < Blickwinkel der Isometrie (35°): Rückseite und linker Walm sind sichtbar → zuerst zeichnen
  out.push(poly([e[3], e[2], r2, r1], 'sig-roof sig-roof--back'));
  out.push(poly([e[0], e[3], r1], 'sig-roof sig-roof--back'));
  out.push(poly(slopeF, 'sig-roof'));
  out.push(poly(hipR, 'sig-roof sig-roof--side'));
  let tiles = '', tilesR = '';
  const run = D / 2 + O;
  for (let s = 0.36; s < run; s += 0.36) {            // Ziegelreihen parallel zur Traufe
    const z = ZE + (s / run) * HR;
    tiles += seg(P(-O + s, D + O - s, z), P(L + O - s, D + O - s, z));
    tilesR += seg(P(L + O - s, D + O - s, z), P(L + O - s, -O + s, z));
  }
  out.push(`<path class="sig-tile" clip-path="url(#sig-axo-cpRF)" d="${tiles}"/><path class="sig-tile" clip-path="url(#sig-axo-cpRR)" d="${tilesR}"/>`);
  out.push(`<path class="sig-edge" d="M${[e[0], e[1], e[2], e[3], e[0]].map(pt).join('L')}${seg(e[0], r1)}${seg(r1, r2)}${seg(e[1], r2)}"/><path class="sig-edge-thin" d="${seg(e[2], r2)}${seg(e[3], r1)}"/>`);
  // Gaube/Dachfenster (Brauerstraße: liegende Fenster im Walmdach)
  let dw = '';
  for (const x of [7.5, 12.5, 17.5, 22.5]) {
    const s0 = 1.3, s1 = 2.6, z0 = ZE + (s0 / run) * HR, z1 = ZE + (s1 / run) * HR;
    dw += poly([P(x - 0.55, D + O - s0, z0), P(x + 0.55, D + O - s0, z0), P(x + 0.55, D + O - s1, z1), P(x - 0.55, D + O - s1, z1)], 'sig-win sig-win--roof');
  }
  out.push(dw);

  // Balkone am Hauptbaukörper (Glasbrüstung)
  for (let f = 1; f < 3; f++) {
    for (const b of balconyBays) {
      const x0 = b * 6 + 0.5, x1 = b * 6 + 5.5, y0 = D, y1 = D + 1.6, zt = f * FH, zb = zt - 0.22, zr = zt + 1.0;
      let s = poly([P(x0, y0, zt), P(x1, y0, zt), P(x1, y1, zt), P(x0, y1, zt)], 'sig-slab-top');
      s += poly([P(x0, y1, zb), P(x1, y1, zb), P(x1, y1, zt), P(x0, y1, zt)], 'sig-slab');
      s += poly([P(x1, y1, zb), P(x1, y0, zb), P(x1, y0, zt), P(x1, y1, zt)], 'sig-slab sig-slab--side');
      s += poly([P(x0, y0, zt), P(x0, y1, zt), P(x0, y1, zr), P(x0, y0, zr)], 'sig-glass');
      s += poly([P(x0, y1, zt), P(x1, y1, zt), P(x1, y1, zr), P(x0, y1, zr)], 'sig-glass');
      s += poly([P(x1, y1, zt), P(x1, y0, zt), P(x1, y0, zr), P(x1, y1, zr)], 'sig-glass');
      s += `<path class="sig-rail" d="${seg(P(x0, y0, zr), P(x0, y1, zr))}${seg(P(x0, y1, zr), P(x1, y1, zr))}${seg(P(x1, y1, zr), P(x1, y0, zr))}"/>`;
      out.push(s);
    }
  }
  // Vordach Eingang
  {
    const x0 = 1.6, x1 = 4.4, y0 = D, y1 = D + 1.3, zb = 2.62, zt = 2.8;
    out.push(poly([P(x0, y0, zt), P(x1, y0, zt), P(x1, y1, zt), P(x0, y1, zt)], 'sig-slab-top') +
      poly([P(x0, y1, zb), P(x1, y1, zb), P(x1, y1, zt), P(x0, y1, zt)], 'sig-slab') +
      poly([P(x1, y1, zb), P(x1, y0, zb), P(x1, y0, zt), P(x1, y1, zt)], 'sig-slab sig-slab--side'));
  }
  // Kanten Hauptbaukörper
  out.push(`<path class="sig-edge" d="${seg(P(0, D, 0), P(L, D, 0))}${seg(P(L, D, 0), P(L, 0, 0))}${seg(P(0, D, 0), P(0, D, ZE))}${seg(P(L, D, 0), P(L, D, ZE))}${seg(P(L, 0, 0), P(L, 0, ZE))}"/>`);

  // --- Kopfbau (zweigeschossig, Flachdach, Klinker) ------------------------------------------
  const wf = [P(W.x0, W.y1, 0), P(W.x1, W.y1, 0), P(W.x1, W.y1, W.za), P(W.x0, W.y1, W.za)];
  const ws = [P(W.x1, W.y1, 0), P(W.x1, W.y0, 0), P(W.x1, W.y0, W.za), P(W.x1, W.y1, W.za)];
  out.push(poly(wf, 'sig-face'));
  out.push(poly(ws, 'sig-face sig-face--side'));
  {
    let d1 = '', d2 = '';
    const courses = Math.round(W.z * 3);
    for (let i = 1; i < courses; i++) { const z = i / 3; d1 += seg(P(W.x0, W.y1, z), P(W.x1, W.y1, z)); d2 += seg(P(W.x1, W.y1, z), P(W.x1, W.y0, z)); }
    for (let i = 0; i < courses; i++) {
      const za = i / 3, zb = (i + 1) / 3, off = i % 2 ? 0.375 : 0;
      for (let x = W.x0 + off + 0.75; x < W.x1; x += 0.75) d1 += seg(P(x, W.y1, za), P(x, W.y1, zb));
      for (let y = W.y0 + off + 0.75; y < W.y1; y += 0.75) d2 += seg(P(W.x1, y, za), P(W.x1, y, zb));
    }
    out.push(`<path class="sig-brick" clip-path="url(#sig-axo-cpWF)" d="${d1}"/><path class="sig-brick" clip-path="url(#sig-axo-cpWS)" d="${d2}"/>`);
  }
  let ww = '';
  for (let f = 0; f < 2; f++) {
    const zf = f * FH;
    for (const cx of [23.6, 27.2, 30.8]) ww += winF(cx - 0.65, cx + 0.65, zf + 0.9, zf + 2.35, W.y1);
    for (const cy of [6.6, 10.5, 14.4]) ww += winS(W.x1, cy - 0.65, cy + 0.65, zf + 0.9, zf + 2.35);
  }
  out.push(ww);
  out.push(`<path class="sig-edge-thin" d="${seg(P(W.x0, W.y1, 0.45), P(W.x1, W.y1, 0.45))}${seg(P(W.x1, W.y1, 0.45), P(W.x1, W.y0, 0.45))}${seg(P(W.x1 - 0.4, W.y1, 0), P(W.x1 - 0.4, W.y1, W.za))}"/>`);
  // Flachdach als L (außerhalb des Hauptbaukörpers) + Attika + PV
  const roofL = [P(W.x0, D, W.za), P(W.x0, W.y1, W.za), P(W.x1, W.y1, W.za), P(W.x1, W.y0, W.za), P(L, W.y0, W.za), P(L, D, W.za)];
  out.push(poly(roofL, 'sig-flat'));
  out.push(poly([P(W.x0 + 0.3, D, W.za), P(W.x0 + 0.3, W.y1 - 0.3, W.za), P(W.x1 - 0.3, W.y1 - 0.3, W.za), P(W.x1 - 0.3, W.y0 + 0.3, W.za), P(L, W.y0 + 0.3, W.za)], 'sig-attika', ' fill="none"'));
  let pv = '';
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {           // vor dem Hauptbaukörper
    const x0 = 22.0 + i * 1.9, y0 = 13.2 + j * 1.45;
    pv += poly([P(x0, y0, W.za + 0.25), P(x0 + 1.7, y0, W.za + 0.25), P(x0 + 1.7, y0 + 1.15, W.za + 0.25), P(x0, y0 + 1.15, W.za + 0.25)], 'sig-pv');
  }
  for (let j = 0; j < 6; j++) {                                        // neben dem Giebel
    const y0 = 5.3 + j * 1.9;
    pv += poly([P(30.7, y0, W.za + 0.25), P(32.8, y0, W.za + 0.25), P(32.8, y0 + 1.7, W.za + 0.25), P(30.7, y0 + 1.7, W.za + 0.25)], 'sig-pv');
  }
  out.push(pv);
  out.push(`<path class="sig-edge" d="${seg(P(W.x0, W.y1, 0), P(W.x1, W.y1, 0))}${seg(P(W.x1, W.y1, 0), P(W.x1, W.y0, 0))}${seg(P(W.x0, W.y1, 0), P(W.x0, W.y1, W.za))}${seg(P(W.x1, W.y1, 0), P(W.x1, W.y1, W.za))}${seg(P(W.x1, W.y0, 0), P(W.x1, W.y0, W.za))}M${[P(W.x0, D, W.za), P(W.x0, W.y1, W.za), P(W.x1, W.y1, W.za), P(W.x1, W.y0, W.za), P(L, W.y0, W.za)].map(pt).join('L')}"/>`);

  // Maßstabsfiguren (rot, Umriss)
  const person = (X, Y, flip = 1, h = 1.0) => {
    const b = P(X, Y, 0);
    const pts = [[-0.21, 1.44], [0.21, 1.44], [0.18, 0.92], [0.14, 0], [0.03, 0], [0, 0.78], [-0.04, 0], [-0.15, 0], [-0.18, 0.92]];
    const d = 'M' + pts.map(([x, y]) => `${f2(b[0] + x * flip * k * h)},${f2(b[1] - y * k * h)}`).join('L') + 'Z';
    return `<g class="sig-fig"><path d="${d}"/><circle cx="${f2(b[0])}" cy="${f2(b[1] - 1.62 * k * h)}" r="${f2(0.12 * k * h)}"/></g>`;
  };
  out.push(person(2.2, D + 2.0));
  out.push(person(9.4, D + 2.4, -1, 0.94));
  out.push(person(27.5, W.y1 + 1.4, -1));
  out.push(person(35.0, 9.0, 1, 0.97));

  // --- Maßketten (rot) --------------------------------------------------------------------
  const tick = (p, ang, r = 1.15) => {
    const a = ang + Math.PI / 4;
    return `M${f2(p[0] - Math.cos(a) * r)},${f2(p[1] - Math.sin(a) * r)}L${f2(p[0] + Math.cos(a) * r)},${f2(p[1] + Math.sin(a) * r)}`;
  };
  const angX = Math.atan2(S30, C30), angY = Math.atan2(S30, -C30);
  const ground = (txt, X, Y, dir, cls = 'sig-dim-t') => {
    const p = P(X, Y, 0);
    const m = dir === 'x' ? `matrix(${f2(C30)},${f2(S30)},${f2(-C30)},${f2(S30)},${f2(p[0])},${f2(p[1])})`
      : `matrix(${f2(C30)},${f2(-S30)},${f2(C30)},${f2(S30)},${f2(p[0])},${f2(p[1])})`;
    return `<text class="${cls}" transform="${m}" text-anchor="middle">${txt}</text>`;
  };
  let dl = '', dt = '';
  const labels = [];
  const chainX = (Y, stops, texts) => {
    dl += seg(P(stops[0] - 0.6, Y), P(stops[stops.length - 1] + 0.6, Y));
    stops.forEach((x) => { dt += tick(P(x, Y), angX); });
    for (let i = 0; i < stops.length - 1; i++) {
      const t = texts ? texts[i] : [de(stops[i + 1] - stops[i])];
      labels.push(ground(t[0], (stops[i] + stops[i + 1]) / 2, Y - 0.38, 'x', t[1] || 'sig-dim-t'));
    }
  };
  const chainY = (X, stops) => {
    dl += seg(P(X, stops[0] - 0.6), P(X, stops[stops.length - 1] + 0.6));
    stops.forEach((y) => { dt += tick(P(X, y), angY); });
    for (let i = 0; i < stops.length - 1; i++) labels.push(ground(de(stops[i + 1] - stops[i]), X - 0.38, (stops[i] + stops[i + 1]) / 2, 'y'));
  };
  chainX(chainY1, axesX);
  chainX(chainY2, [0, 24, 30], [['24,00 = 80 % FÖRDERUNG', 'sig-dim-t sig-dim-t--key'], ['20 %', 'sig-dim-t sig-dim-t--rest']]);
  chainY(chainXpos, axesY);
  // 80-%-Marke: kräftiger Strich + Fähnchen über der Kette
  const m80 = P(24, chainY2);
  out.push(`<path class="sig-dim" d="${dl}"/><path class="sig-dim-tk" d="${dt}"/>`);
  out.push(`<path class="sig-dim-key" d="${tick(m80, angX, 1.9)}"/><circle class="sig-dim-dot" cx="${f2(m80[0])}" cy="${f2(m80[1])}" r=".75"/>`);
  out.push(labels.join(''));

  // --- Achskreise ---------------------------------------------------------------------------
  const bubble = (end, dirv, label) => {
    const len = Math.hypot(dirv[0], dirv[1]);
    const c = [end[0] + (dirv[0] / len) * R, end[1] + (dirv[1] / len) * R];
    return `<g class="sig-axb"><circle cx="${f2(c[0])}" cy="${f2(c[1])}" r="${R}"/><text x="${f2(c[0])}" y="${f2(c[1] + 1.08)}" text-anchor="middle">${label}</text></g>`;
  };
  axesX.forEach((x, i) => { const e1 = P(x, yb), d0 = P(x, yb - 1); out.push(`<path class="sig-grid" d="${seg(P(x, chainY2 + 0.5), e1)}"/>` + bubble(e1, [e1[0] - d0[0], e1[1] - d0[1]], String(i + 1))); });
  axesY.forEach((y, i) => { const e1 = P(xb, y), d0 = P(xb - 1, y); out.push(`<path class="sig-grid" d="${seg(P(chainXpos + 0.5, y), e1)}"/>` + bubble(e1, [e1[0] - d0[0], e1[1] - d0[1]], 'ABC'[i])); });

  // --- Höhenkoten links ------------------------------------------------------------------------
  const levels = [[0, '±0,00'], [FH, '+2,90'], [2 * FH, '+5,80'], [ZE, '+9,00'], [ZE + HR, '+12,40']];
  let kt = '';
  const xL = P(-O, D + O, 0)[0];
  levels.forEach(([z, t], i) => {
    const base = i === 4 ? r1 : P(0, D, z);
    const xe = base[0] - 1.4, xt = xL - 6.4, y = base[1];
    kt += `<path class="sig-kote-l" d="M${f2(xe)},${f2(y)}H${f2(xL - 19)}"/>`;
    kt += `<path class="sig-kote" d="M${f2(xt)},${f2(y)}l-1.2,-2.05h2.4z"/>`;
    kt += `<text class="sig-kote-t" x="${f2(xt - 2)}" y="${f2(y - 0.75)}" text-anchor="end">${t}</text>`;
  });
  out.push(kt);

  // --- Nordpfeil + Maßstabsleiste -------------------------------------------------------------
  const nx = VW - 9, ny = 10;
  out.push(`<g class="sig-north"><circle cx="${nx}" cy="${ny}" r="5"/><path class="sig-north-fill" d="M${nx},${ny - 4}L${nx + 2},${ny + 3.3}L${nx},${ny + 2}Z"/><path d="M${nx},${ny - 4}L${nx - 2},${ny + 3.3}L${nx},${ny + 2}Z"/><text x="${nx}" y="${ny - 6.4}" text-anchor="middle">N</text></g>`);
  const sx = 6, sy = VH - 6; let sb = '';
  for (let i = 0; i < 5; i++) sb += `<rect x="${f2(sx + i * 2 * k)}" y="${sy}" width="${f2(2 * k)}" height="1.4" class="${i % 2 ? 'sig-sb-w' : 'sig-sb-b'}"/>`;
  sb += `<text class="sig-sb-t" x="${sx}" y="${sy - 1.6}" text-anchor="middle">0</text><text class="sig-sb-t" x="${f2(sx + 5 * k)}" y="${sy - 1.6}" text-anchor="middle">5</text><text class="sig-sb-t" x="${f2(sx + 10 * k)}" y="${sy - 1.6}" text-anchor="middle">10 m</text>`;
  out.push(`<g class="sig-scalebar">${sb}</g>`);

  const style = `<style>
#sig-axo text{font-family:${FONT};}
#sig-axo .sig-grid{stroke:var(--sig-grid,#B4B0AB);stroke-width:.16;stroke-dasharray:5 1 .6 1;fill:none}
#sig-axo .sig-tree path{stroke:var(--sig-soft,#A8A49F);stroke-width:.18;fill:none}
#sig-axo .sig-tree .sig-tree-crown{fill:var(--sig-face,#fff)}
#sig-axo .sig-face{fill:var(--sig-face,#fff)}
#sig-axo .sig-face--side{fill:var(--sig-face-2,#F1EFEC)}
#sig-axo .sig-brick{stroke:var(--sig-brick,#D58E9D);stroke-width:.13;fill:none}
#sig-axo .sig-win{fill:var(--sig-face,#fff);stroke:var(--sig-line,#3C3C3B);stroke-width:.2}
#sig-axo .sig-win--side{fill:var(--sig-glass,#FBFAF9)}
#sig-axo .sig-win--roof{fill:var(--sig-face-2,#F1EFEC);stroke-width:.16}
#sig-axo .sig-door{fill:var(--sig-paper,#F4F3F2)}
#sig-axo .sig-win-l{stroke:var(--sig-line,#3C3C3B);stroke-width:.13;fill:none}
#sig-axo .sig-glint{stroke:var(--sig-soft,#BDB9B4);stroke-width:.12;fill:none}
#sig-axo .sig-edge-thin{stroke:var(--sig-line,#3C3C3B);stroke-width:.14;fill:none}
#sig-axo .sig-roof{fill:var(--sig-face,#fff)}
#sig-axo .sig-roof--side{fill:var(--sig-face-2,#F1EFEC)}
#sig-axo .sig-roof--back{fill:var(--sig-face-3,#E6E3DF)}
#sig-axo .sig-tile{stroke:var(--sig-accent,#B71E3F);stroke-width:.25;fill:none;opacity:.5}
#sig-axo .sig-flat{fill:var(--sig-paper,#F4F3F2)}
#sig-axo .sig-attika{stroke:var(--sig-soft,#A8A49F);stroke-width:.13}
#sig-axo .sig-pv{fill:var(--sig-dark,#57534F);stroke:var(--sig-face,#fff);stroke-width:.1}
#sig-axo .sig-fig path,#sig-axo .sig-fig circle{fill:var(--sig-face,#fff);stroke:var(--sig-accent,#B71E3F);stroke-width:.25;stroke-linejoin:round}
#sig-axo .sig-rail{stroke:var(--sig-line,#3C3C3B);stroke-width:.17;fill:none}
#sig-axo .sig-slab-top{fill:var(--sig-face,#fff);stroke:var(--sig-line,#3C3C3B);stroke-width:.14}
#sig-axo .sig-slab{fill:var(--sig-face-3,#E6E3DF);stroke:var(--sig-line,#3C3C3B);stroke-width:.16}
#sig-axo .sig-slab--side{fill:var(--sig-face-4,#D5D1CC)}
#sig-axo .sig-glass{fill:var(--sig-glass,#FBFAF9);fill-opacity:.65;stroke:var(--sig-line,#3C3C3B);stroke-width:.11}
#sig-axo .sig-edge{stroke:var(--sig-ink,#202020);stroke-width:.4;fill:none;stroke-linejoin:round;stroke-linecap:round}
#sig-axo .sig-dim{stroke:var(--sig-accent,#B71E3F);stroke-width:.25;fill:none}
#sig-axo .sig-dim-tk{stroke:var(--sig-accent,#B71E3F);stroke-width:.42;fill:none}
#sig-axo .sig-dim-key{stroke:var(--sig-accent,#B71E3F);stroke-width:.8;fill:none}
#sig-axo .sig-dim-dot{fill:var(--sig-accent,#B71E3F)}
#sig-axo .sig-dim-h{stroke:var(--sig-accent,#B71E3F);stroke-width:.25;fill:none}
#sig-axo .sig-dim-t{font-weight:600;font-size:${FS_RED}px;fill:var(--sig-accent,#B71E3F)}
#sig-axo .sig-dim-t--key{font-weight:800;letter-spacing:.06px}
#sig-axo .sig-dim-t--rest{font-weight:600;fill:var(--sig-line,#3C3C3B)}
#sig-axo .sig-axb circle{fill:var(--sig-face,#fff);stroke:var(--sig-line,#3C3C3B);stroke-width:.2}
#sig-axo .sig-axb text{font-weight:700;font-size:${FS}px;fill:var(--sig-line,#3C3C3B)}
#sig-axo .sig-kote-l{stroke:var(--sig-line,#3C3C3B);stroke-width:.14;fill:none}
#sig-axo .sig-kote{fill:var(--sig-accent,#B71E3F)}
#sig-axo .sig-kote-t{font-weight:600;font-size:${FS}px;fill:var(--sig-line,#3C3C3B)}
#sig-axo .sig-north circle{fill:none;stroke:var(--sig-line,#3C3C3B);stroke-width:.2}
#sig-axo .sig-north path{fill:var(--sig-face,#fff);stroke:var(--sig-line,#3C3C3B);stroke-width:.2}
#sig-axo .sig-north .sig-north-fill{fill:var(--sig-ink,#202020)}
#sig-axo .sig-north text{font-weight:700;font-size:${FS}px;fill:var(--sig-line,#3C3C3B)}
#sig-axo .sig-sb-b{fill:var(--sig-ink,#202020)}
#sig-axo .sig-sb-w{fill:var(--sig-face,#fff);stroke:var(--sig-ink,#202020);stroke-width:.2}
#sig-axo .sig-sb-t{font-weight:600;font-size:${FS}px;fill:var(--sig-line,#3C3C3B)}
</style>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" id="sig-axo" class="sig sig-axo" viewBox="0 0 ${VW} ${VH}" width="${VW}mm" height="${VH}mm" role="img" aria-label="Axonometrische Linienzeichnung eines geförderten Mehrfamilienhauses nach dem Projekt Brauerstraße in Rotenburg (Wümme): dreigeschossiger Klinkerbau mit Walmdach, Balkonen und zweigeschossigem Kopfbau mit Photovoltaik. Rote Maßketten; auf der 30-Meter-Kette markiert eine rote Marke bei 24 Metern 80 Prozent Förderung, der Rest von 20 Prozent steht für die Eigenmittel.">${style}${out.join('\n')}</svg>`;
}

/* =========================================================================================
   2 · GRUNDRISS „Rotpause“ (U4) – ganzseitig 210 × 297, Linien in currentColor
   ========================================================================================= */
function grundriss() {
  const k = 5.0;                                       // mm je m (≈ 1:200)
  const L = 30, D = 12.5, t = 0.42, ti = 0.2, tw = 0.25;
  const ox = 30, oy = 46;
  const X = (x) => f2(ox + x * k), Y = (y) => f2(oy + y * k);
  const R = 3.1;
  const out = [];
  // Achsen + Achskreise
  let ax = '';
  [0, 6, 12, 18, 24, 30].forEach((x) => { ax += `M${X(x)},${Y(-3.2)}V${Y(D + 2.2)}`; });
  [0, D / 2, D].forEach((y) => { ax += `M${X(-2.6)},${Y(y)}H${X(L + 2.2)}`; });
  out.push(`<path class="sig-g-ax" d="${ax}"/>`);
  [0, 6, 12, 18, 24, 30].forEach((x, i) => out.push(`<g class="sig-g-b"><circle cx="${X(x)}" cy="${f2(oy - 3.2 * k - R)}" r="${R}"/><text x="${X(x)}" y="${f2(oy - 3.2 * k - R + 1.15)}" text-anchor="middle">${i + 1}</text></g>`));
  ['A', 'B', 'C'].forEach((l, i) => { const y = [0, D / 2, D][i]; out.push(`<g class="sig-g-b"><circle cx="${f2(ox - 2.6 * k - R)}" cy="${Y(y)}" r="${R}"/><text x="${f2(ox - 2.6 * k - R)}" y="${f2(oy + y * k + 1.15)}" text-anchor="middle">${l}</text></g>`); });
  // Außenwände als Poché mit Öffnungen (Fenster mittig in den Räumen, nie auf Trennwandachsen)
  const winsH = [];
  [0, 1, 3, 4].forEach((b) => { winsH.push([b * 6 + 0.9, b * 6 + 2.3], [b * 6 + 3.7, b * 6 + 5.1]); });
  winsH.push([13.9, 16.1]);
  const winsV = [[1.6, 3.6], [8.9, 10.9]];
  const wallH = (y, side, open) => {             // side = +1 (Wand nach innen unten), -1 (nach oben)
    const y2 = y + side * t, segs = []; let xs = 0;
    open.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { segs.push([xs, a]); xs = b; }); segs.push([xs, L]);
    let d = '';
    segs.forEach(([a, b]) => { d += `M${X(a)},${Y(Math.min(y, y2))}H${X(b)}V${Y(Math.max(y, y2))}H${X(a)}Z`; });
    let g = '';
    open.forEach(([a, b]) => { g += `M${X(a)},${Y(y + side * t / 2)}H${X(b)}M${X(a)},${Y(y)}H${X(b)}M${X(a)},${Y(y2)}H${X(b)}`; });
    return [d, g];
  };
  const wallV = (x, side, open) => {
    const x2 = x + side * t, segs = []; let ys = 0;
    open.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { segs.push([ys, a]); ys = b; }); segs.push([ys, D]);
    let d = '';
    segs.forEach(([a, b]) => { d += `M${X(Math.min(x, x2))},${Y(a)}V${Y(b)}H${X(Math.max(x, x2))}V${Y(a)}Z`; });
    let g = '';
    open.forEach(([a, b]) => { g += `M${X(x + side * t / 2)},${Y(a)}V${Y(b)}M${X(x)},${Y(a)}V${Y(b)}M${X(x2)},${Y(a)}V${Y(b)}`; });
    return [d, g];
  };
  const parts = [wallH(0, 1, winsH), wallH(D, -1, winsH.filter(([a]) => !(a > 13 && a < 16))), wallV(0, 1, winsV), wallV(L, -1, winsV)];
  out.push(`<path class="sig-g-poche" d="${parts.map((p) => p[0]).join('')}"/>`);
  out.push(`<path class="sig-g-glass" d="${parts.map((p) => p[1]).join('')}"/>`);
  // Innenwände: Wohnungstrennwände (Poché schmal), Flurwände, Zimmerwände
  const fy0 = 5.4, fy1 = 7.1;
  let pw = '';
  const rectV = (x, y0, y1, w) => `M${X(x - w / 2)},${Y(y0)}V${Y(y1)}H${X(x + w / 2)}V${Y(y0)}Z`;
  const rectH = (y, x0, x1, w) => `M${X(x0)},${Y(y - w / 2)}H${X(x1)}V${Y(y + w / 2)}H${X(x0)}Z`;
  [6, 12, 18, 24].forEach((x) => { pw += rectV(x, t, fy0, tw) + rectV(x, fy1, D - t, tw); });
  pw += rectH(fy0, t, 13.2, tw) + rectH(fy0, 16.8, L - t, tw) + rectH(fy1, t, 12.8, tw) + rectH(fy1, 17.2, L - t, tw);
  out.push(`<path class="sig-g-poche sig-g-poche--inner" d="${pw}"/>`);
  let iw = '';
  [0, 1, 3, 4].forEach((b) => {
    const xm = b * 6 + 3.0;
    iw += `M${X(xm)},${Y(t)}V${Y(fy0 - 1.2)}M${X(xm)},${Y(fy1 + 1.4)}V${Y(D - t)}`;      // Zimmerwand
    iw += `M${X(b * 6 + 0.13)},${Y(fy0 - 1.9)}H${X(b * 6 + 2.2)}M${X(b * 6 + 0.13)},${Y(fy1 + 2.0)}H${X(b * 6 + 2.2)}`; // Bad
  });
  out.push(`<path class="sig-g-iw" d="${iw}"/>`);
  // Treppe + Aufzug
  let st = '';
  for (let i = 0; i <= 11; i++) st += `M${X(12.7)},${Y(0.8 + i * 0.28)}H${X(14.9)}M${X(15.1)},${Y(0.8 + i * 0.28)}H${X(17.3)}`;
  st += `M${X(12.7)},${Y(0.8)}V${Y(3.88)}M${X(17.3)},${Y(0.8)}V${Y(3.88)}M${X(15)},${Y(0.8)}V${Y(3.88)}`;
  st += `M${X(13.1)},${Y(8.1)}h${f2(2.1 * k)}v${f2(2.1 * k)}h${f2(-2.1 * k)}zM${X(13.1)},${Y(8.1)}l${f2(2.1 * k)},${f2(2.1 * k)}M${X(15.2)},${Y(8.1)}l${f2(-2.1 * k)},${f2(2.1 * k)}`;
  out.push(`<path class="sig-g-iw" d="${st}"/>`);
  // Türen mit Aufschlag
  let dr = '';
  [[4.0, fy1, 1], [8.0, fy1, 1], [22.0, fy1, 1], [26.0, fy1, 1], [4.0, fy0, -1], [8.0, fy0, -1], [22.0, fy0, -1], [26.0, fy0, -1]].forEach(([x, y, s]) => {
    const r = 0.9 * k;
    dr += `M${X(x)},${Y(y)}v${f2(s * r)}A${f2(r)},${f2(r)} 0 0 ${s > 0 ? 0 : 1} ${f2(ox + x * k + r)},${Y(y)}`;
  });
  out.push(`<path class="sig-g-dr" d="${dr}"/>`);
  // Balkone (Süd)
  let bc = '';
  [1, 3].forEach((b) => { bc += `M${X(b * 6 + 0.6)},${Y(D)}V${Y(D + 1.6)}H${X(b * 6 + 5.4)}V${Y(D)}`; });
  out.push(`<path class="sig-g-iw" d="${bc}"/>`);
  // Raumbeschriftung (frei von Linien und Rahmen)
  const rooms = [[1.5, 10.6, 'WE 1'], [7.5, 10.6, 'WE 2'], [19.5, 10.6, 'WE 3'], [25.5, 10.6, 'WE 4'], [1.5, 2.4, 'WE 5'], [7.5, 2.4, 'WE 6'], [19.5, 2.4, 'WE 7'], [25.5, 2.4, 'WE 8']];
  rooms.forEach(([x, y, l]) => out.push(`<text class="sig-g-t" x="${X(x)}" y="${Y(y)}" text-anchor="middle">${l}</text>`));
  // Maßkette oben (zwischen Achskreisen und Grundriss)
  const cy = -1.7;
  let dm = `M${X(-0.5)},${Y(cy)}H${X(L + 0.5)}`;
  [0, 6, 12, 18, 24, 30].forEach((x) => { dm += `M${f2(ox + x * k - 1.1)},${f2(oy + cy * k + 1.1)}l2.2,-2.2M${X(x)},${Y(cy + 0.5)}V${Y(-0.15)}`; });
  out.push(`<path class="sig-g-dm" d="${dm}"/>`);
  [3, 9, 15, 21, 27].forEach((x) => out.push(`<text class="sig-g-t" x="${X(x)}" y="${f2(oy + cy * k - 1.3)}" text-anchor="middle">6,00</text>`));
  // Nordpfeil
  const nx = ox + L * k - 2, ny = oy + D * k + 17;
  out.push(`<g class="sig-g-north"><circle cx="${f2(nx)}" cy="${f2(ny)}" r="4.4"/><path class="sig-g-north-fill" d="M${f2(nx)},${f2(ny - 3.5)}L${f2(nx + 1.8)},${f2(ny + 2.9)}L${f2(nx)},${f2(ny + 1.8)}Z"/><path d="M${f2(nx)},${f2(ny - 3.5)}L${f2(nx - 1.8)},${f2(ny + 2.9)}L${f2(nx)},${f2(ny + 1.8)}Z"/><text x="${f2(nx - 7)}" y="${f2(ny + 1.1)}" text-anchor="end">REGELGESCHOSS · M 1:200</text></g>`);
  const style = `<style>
#sig-grundriss text{font-family:${FONT};}
#sig-grundriss{color:var(--sig-plan,#fff)}
#sig-grundriss .sig-g-ax{stroke:currentColor;stroke-width:.2;stroke-dasharray:5 1.2 .7 1.2;fill:none;opacity:.55}
#sig-grundriss .sig-g-b circle{fill:none;stroke:currentColor;stroke-width:.25}
#sig-grundriss .sig-g-b text,#sig-grundriss .sig-g-t{font-weight:600;font-size:${FS_RED}px;fill:currentColor}
#sig-grundriss .sig-g-poche{fill:currentColor;fill-opacity:.9;stroke:none}
#sig-grundriss .sig-g-poche--inner{fill-opacity:.7}
#sig-grundriss .sig-g-glass{stroke:currentColor;stroke-width:.2;fill:none}
#sig-grundriss .sig-g-iw{stroke:currentColor;stroke-width:.25;fill:none}
#sig-grundriss .sig-g-dr{stroke:currentColor;stroke-width:.2;fill:none;opacity:.8}
#sig-grundriss .sig-g-dm{stroke:currentColor;stroke-width:.25;fill:none}
#sig-grundriss .sig-g-north circle{fill:none;stroke:currentColor;stroke-width:.25}
#sig-grundriss .sig-g-north path{fill:none;stroke:currentColor;stroke-width:.25}
#sig-grundriss .sig-g-north .sig-g-north-fill{fill:currentColor}
#sig-grundriss .sig-g-north text{font-weight:700;font-size:${FS_RED}px;letter-spacing:.3px;fill:currentColor}
</style>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" id="sig-grundriss" class="sig sig-grundriss" viewBox="0 0 210 297" width="210mm" height="297mm" aria-hidden="true">${style}${out.join('\n')}</svg>`;
}

/* =========================================================================================
   3 · Kleine Planzeichen
   ========================================================================================= */
const small = (id, vb, body, css, label) => `<svg xmlns="http://www.w3.org/2000/svg" id="${id}" class="sig ${id}" viewBox="${vb}" width="${vb.split(' ')[2]}mm" height="${vb.split(' ')[3]}mm" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><style>#${id} text{font-family:${FONT};}${css}</style>${body}</svg>`;

function nordpfeil() {
  return small('sig-nordpfeil', '0 0 12 15', '<circle cx="6" cy="8.6" r="5"/><path class="f" d="M6,4.6L8,11.9L6,10.6Z"/><path d="M6,4.6L4,11.9L6,10.6Z"/><text x="6" y="2.6" text-anchor="middle">N</text>',
    '#sig-nordpfeil circle,#sig-nordpfeil path{fill:none;stroke:var(--sig-line,#3C3C3B);stroke-width:.25}#sig-nordpfeil .f{fill:var(--sig-ink,#202020)}#sig-nordpfeil text{font-weight:700;font-size:3.06px;fill:var(--sig-line,#3C3C3B)}', 'Nordpfeil');
}
function kote() {
  return small('sig-kote', '0 0 30 6', '<path class="l" d="M0,4.6H30"/><path class="t" d="M22,4.6l-1.6,-2.7h3.2z"/><text x="19.2" y="3.6" text-anchor="end">±0,00</text>',
    '#sig-kote .l{stroke:var(--sig-line,#3C3C3B);stroke-width:.2}#sig-kote .t{fill:var(--sig-accent,#B71E3F)}#sig-kote text{font-weight:700;font-size:3.06px;fill:var(--sig-line,#3C3C3B)}', 'Höhenkote ±0,00');
}
function schnitt() {
  return small('sig-schnitt', '0 0 180 9', '<path class="l" d="M6,5.5H174"/><path class="k" d="M2,5.5H10M170,5.5H178"/><path class="t" d="M6,6.6l-2.4,2.4h4.8zM174,6.6l-2.4,2.4h4.8z"/><text x="6" y="3.2" text-anchor="middle">A</text><text x="174" y="3.2" text-anchor="middle">A</text>',
    '#sig-schnitt .l{stroke:var(--sig-ink,#202020);stroke-width:.22;stroke-dasharray:6 1.2 .6 1.2;fill:none}#sig-schnitt .k{stroke:var(--sig-ink,#202020);stroke-width:.8}#sig-schnitt .t{fill:var(--sig-accent,#B71E3F)}#sig-schnitt text{font-weight:800;font-size:3.4px;fill:var(--sig-ink,#202020)}', 'Schnittlinie A–A');
}
function massstab() {
  let b = '';
  for (let i = 0; i < 10; i++) b += `<rect x="${i * 10}" y="4.6" width="10" height="1.4" class="${i % 2 ? 'w' : 'b'}"/>`;
  [0, 20, 40, 60, 80, 100].forEach((v) => { b += `<text x="${v}" y="10.4" text-anchor="middle">${v}</text>`; });
  return small('sig-massstab', '-4 0 108 11', b,
    '#sig-massstab .b{fill:var(--sig-ink,#202020)}#sig-massstab .w{fill:var(--sig-face,#fff);stroke:var(--sig-ink,#202020);stroke-width:.2}#sig-massstab text{font-weight:600;font-size:3.06px;fill:var(--sig-line,#3C3C3B)}', 'Maßstabsleiste 0 bis 100');
}
function achskreis() {
  return small('sig-achskreis', '0 0 8 8', '<circle cx="4" cy="4" r="3.6"/><text x="4" y="5.2" text-anchor="middle">A</text>',
    '#sig-achskreis circle{fill:var(--sig-face,#fff);stroke:var(--sig-ink,#202020);stroke-width:.3}#sig-achskreis text{font-weight:800;font-size:3.4px;fill:var(--sig-ink,#202020)}', 'Achskreis A');
}

write('sig-axo-brauerstrasse.svg', axo());
write('sig-grundriss.svg', grundriss());
write('sig-nordpfeil.svg', nordpfeil());
write('sig-kote.svg', kote());
write('sig-schnitt.svg', schnitt());
write('sig-massstab.svg', massstab());
write('sig-achskreis.svg', achskreis());
