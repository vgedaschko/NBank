// Aus dem DOM-Modell (browser.extract) ein IDML-Dokumentmodell bauen:
// Farbfelder, Text (Rahmen, Absätze, Läufe), Absatz-/Zeichenformate, Flächen/Linien, Grafiken, Tabellen, Ebenen.
// Alle Maße in pt, seitenrelativ (Ursprung links oben); die Umrechnung in Spread-Koordinaten macht writer.cjs.
const fs = require('fs');
const path = require('path');

const MM = 72 / 25.4;
// Silbentrennung wie scripts/assemble.cjs: weiche Trennstriche in Wörtern ab 8 Buchstaben, je 3 Zeichen vor/nach.
// Trennbereich 0 und Trennungen in Folge unbegrenzt (0) wie Chromium (kennt weder Trennzone noch Leiter-Grenze).
const HYPHENATION = { wordsLongerThan: 7, afterFirst: 3, beforeLast: 3, ladderLimit: 0, zone: 0, capitalized: true };
// Container der Seitenzahl (wird automatische Seitenzahl)
const FOLIO_CLASSES = ['page__folio', 'folio'];
const r2 = (v) => Math.round(v * 100) / 100;
const r3 = (v) => Math.round(v * 1000) / 1000;

// ---------------------------------------------------------------------------------------------------------------
// Farbfelder
// ---------------------------------------------------------------------------------------------------------------
// Namen, die InDesign für eigene Felder reserviert (ohne Rücksicht auf Groß/Kleinschreibung)
const RESERVED_SWATCHES = new Set(['paper', 'black', 'registration', 'none', 'papier', 'schwarz', 'passermarken', 'ohne']);
class Swatches {
  constructor(tokens, names = {}) {
    this.list = [];
    this.byKey = new Map();
    this.byName = new Map();
    const order = Object.keys(names);
    const add = (token, c, visible = true) => {
      if (this.byName.has(token)) return this.byName.get(token);
      // sprechender Name „Deutsch (token)“; reservierte Namen nie allein (Verwechslung mit [Papier]/[Schwarz])
      let name = names[token] ? `${names[token]} (${token})` : token;
      if (RESERVED_SWATCHES.has(name.toLowerCase())) name = `${name} (Token)`;
      const sw = { self: 'Color/' + safeName(name), name: safeName(name), token, r: c.r, g: c.g, b: c.b, visible, used: 0,
        rank: order.includes(token) ? order.indexOf(token) : 1e6 };
      this.list.push(sw);
      this.byName.set(token, sw);
      return sw;
    };
    this.add = add;
    // Basistokens (Literal) zuerst als kanonische Felder, dann Aliasse (gleiche Werte, eigener Name)
    for (const pass of [false, true]) {
      for (const t of tokens) {
        if (t.alias !== pass) continue;
        const name = safeName(t.name);
        const sw = add(name, t);
        const key = `${t.r},${t.g},${t.b}`;
        if (t.a >= 0.999 && !this.byKey.has(key)) this.byKey.set(key, sw);
      }
    }
  }
  // Farbe → { ref, alpha }
  ref(c) {
    if (!c || c.a <= 0.004) return { ref: 'Swatch/None', alpha: 0 };
    const key = `${c.r},${c.g},${c.b}`;
    let sw = this.byKey.get(key);
    if (!sw) {
      sw = this.add(`R=${c.r} G=${c.g} B=${c.b}`, c);
      this.byKey.set(key, sw);
    }
    sw.used++;
    return { ref: sw.self, alpha: c.a };
  }
}
function safeName(s) { return String(s).replace(/[:/\\]/g, '-').trim(); }

// ---------------------------------------------------------------------------------------------------------------
// Formatnamen
// ---------------------------------------------------------------------------------------------------------------
const NAMES = JSON.parse(fs.readFileSync(path.join(__dirname, 'stilnamen.json'), 'utf8'));
const IGNORE_CLS = /^(u-|l-|is-|has-|js-|bs-\d|on-|sr-)/;
function semanticKey(s) {
  const filt = (cls) => cls.filter((c) => !IGNORE_CLS.test(c) && !c.includes('--'));
  const own = filt(s.cls);
  const global = own.filter((c) => !/^p\d{2}-/.test(c));
  if ((s.tag === 'td' || s.tag === 'th') && !global.length) {
    if (s.section === 'thead') return 'table thead th';
    if (s.section === 'tfoot') return 'table tfoot td';
    return s.tag === 'th' ? 'table tbody th' : 'table td';
  }
  if (global.length) return global[0];
  if (own.length) return own[0].replace(/^p\d{2}-/, '');
  if (/^h[1-6]$/.test(s.tag)) return s.tag;
  const pf = filt(s.parentCls).map((c) => c.replace(/^p\d{2}-/, ''));
  if (s.tag === 'p' && !pf.length) return 'p';
  return `${pf[0] || s.parentTag} ${s.tag}`;
}
function germanName(key, kind) {
  const exact = (kind === 'char' ? NAMES.zeichen : NAMES.absatz)[key];
  if (exact) return exact;
  const words = key.split(/__|[-\s]+/).filter(Boolean).map((w) => {
    const t = NAMES.woerter[w];
    if (t === undefined) return w.charAt(0).toUpperCase() + w.slice(1);
    return t;
  }).filter(Boolean);
  const dedup = words.filter((w, i) => w.toLowerCase() !== (words[i - 1] || '').toLowerCase());
  let n = dedup.join(' ').trim() || (kind === 'char' ? 'Auszeichnung' : 'Text');
  n = n.charAt(0).toUpperCase() + n.slice(1);
  return safeName(n);
}

// ---------------------------------------------------------------------------------------------------------------
// Text-Attribute
// ---------------------------------------------------------------------------------------------------------------
const CHAR_KEYS = ['AppliedFont', 'FontStyle', 'PointSize', 'FillColor', 'Tracking', 'Capitalization', 'OTFFigureStyle', 'Underline', 'StrikeThru', 'AppliedLanguage'];
const FORMAT_KEYS = ['AppliedFont', 'FontStyle', 'PointSize', 'FillColor', 'Tracking', 'Capitalization', 'OTFFigureStyle', 'Underline', 'StrikeThru'];
const PARA_KEYS = [...CHAR_KEYS, 'Leading', 'Justification', 'Hyphenation', 'FirstLineIndent', 'LeftIndent', 'RightIndent', 'SpaceBefore', 'SpaceAfter', 'KeepAllLinesTogether', 'NoBreak', 'DropCapLines', 'DropCapCharacters', 'StartParagraph'];
const SIG_KEYS = ['AppliedFont', 'FontStyle', 'PointSize', 'Capitalization'];   // Zeilenabstand, Farbe, Abstände: lokale Abweichung

function figureStyle(s) {
  const n = `${s.numeric || ''} ${s.features || ''}`;
  const tab = /tabular-nums|"tnum"/.test(n), old = /oldstyle-nums|"onum"/.test(n), prop = /proportional-nums|"pnum"/.test(n), lin = /lining-nums|"lnum"/.test(n);
  if (tab && old) return 'TabularOldstyle';
  if (tab) return 'TabularLining';
  if (old) return 'ProportionalOldstyle';
  if (prop || lin) return 'ProportionalLining';
  return 'Default';
}
function language(lang) {
  if (/^en/i.test(lang)) return '$ID/English: USA';
  if (/^fr/i.test(lang)) return '$ID/French';
  return '$ID/de_DE_2006';
}

// ---------------------------------------------------------------------------------------------------------------
// Hauptfunktion
// ---------------------------------------------------------------------------------------------------------------
function buildDocument(model, { fonts, graphics, opts }) {
  const warnings = [];
  const sw = new Swatches(model.tokens, NAMES.farben || {});
  const S = model.styles;
  // Seitenformat auf 0,01 mm einrasten (Blink misst im 1/64-px-Raster: 209,996 statt 210 mm → „Benutzerdefiniert“)
  const snapMm = (v) => (Math.round((v / MM) * 100) / 100) * MM;
  const W = snapMm(model.pages[0].w), H = snapMm(model.pages[0].h);
  const errors = [];
  const glyphNotes = { substituted: new Map(), missing: new Map() };
  const bleed = (opts.bleedMm ?? 3) * MM;
  const faceOf = (s) => fonts.faceOfStyle(s);

  const charAttrs = (si) => {
    const s = S[si];
    const f = faceOf(si);
    const col = sw.ref(s.color);
    const a = {
      AppliedFont: f.family, FontStyle: f.style,
      PointSize: r2(s.sizePx * 0.75),
      FillColor: col.ref,
      Tracking: Math.round(((s.letterSpacingPx || 0) / s.sizePx) * 1000),
      Capitalization: s.textTransform === 'uppercase' ? 'AllCaps' : s.caps === 'small-caps' ? 'SmallCaps' : s.caps === 'all-small-caps' ? 'CapToSmallCap' : 'Normal',
      OTFFigureStyle: figureStyle(s),
      Underline: /underline/.test(s.decoration || ''),
      StrikeThru: /line-through/.test(s.decoration || ''),
      AppliedLanguage: language(s.lang),
    };
    if (/^(nowrap|pre)$/.test(s.whiteSpace)) a.NoBreak = true;
    return a;
  };
  const lineHeightPt = (si, fallbackPx) => {
    const s = S[si];
    return (s.lineHeightPx || fallbackPx || s.sizePx * 1.2) * 0.75;
  };
  const alignOf = (s) => {
    const t = s.textAlign;
    if (t === 'right' || t === 'end' || t === '-webkit-right') return 'RightAlign';
    if (t === 'center' || t === '-webkit-center') return 'CenterAlign';
    if (t === 'justify') return 'LeftJustified';
    return 'LeftAlign';
  };

  // ---- Absätze vorbereiten (Läufe, Grundattribute) -------------------------------------------------------------
  // Glyphenabdeckung: jedes gesetzte Zeichen muss im zugeordneten Desktop-Schnitt stehen (sonst rosa Fehlglyphe in
  // InDesign). Fehlende Zeichen werden durch ein vorhandenes Ersatzzeichen ersetzt (Warnung) oder als Fehler gemeldet.
  const SUBST = {
    0x2715: [0x2717, 0x00D7], 0x2716: [0x2717, 0x00D7], 0x2718: [0x2717, 0x00D7], 0x2717: [0x2715, 0x00D7], 0x2714: [0x2713], 0x2713: [0x2714],
    0x2012: [0x2013], 0x2011: [0x2010, 0x2D], 0x2010: [0x2D], 0x2212: [0x2013, 0x2D], 0x2192: [0x2794, 0x2B62], 0x25A0: [0x25AA], 0x2022: [0x00B7],
  };
  const IGN = /[\p{Zs}\p{Cc}\p{Cf}\u2028\u2029\uE000-\uF8FF]/u;   // Leerräume, Steuer- und Formatzeichen (weicher Trennstrich) brauchen keine Glyphe
  const hasCp = (face, cp) => {
    const R = face.cmap;
    let lo = 0, hi = R.length - 1;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (cp < R[m][0]) hi = m - 1; else if (cp > R[m][1]) lo = m + 1; else return true; }
    return false;
  };
  const cpName = (cp) => `„${String.fromCodePoint(cp)}“ (U+${cp.toString(16).toUpperCase().padStart(4, '0')})`;
  const coverRun = (r, pageNo, p) => {
    const face = faceOf(r.s);
    if (!face || !Array.isArray(face.cmap)) return;
    let out = '';
    for (const ch of r.text) {
      const cp = ch.codePointAt(0);
      if (IGN.test(ch) || hasCp(face, cp)) { out += ch; continue; }
      const alt = (SUBST[cp] || []).find((c) => hasCp(face, c));
      const reg = alt !== undefined ? glyphNotes.substituted : glyphNotes.missing;
      const key = `${face.family} ${face.style}|${cp}|${alt}`;
      const e = reg.get(key) || { face: `${face.family} ${face.style}`, cp, alt, pages: new Set(), n: 0, sample: p.key };
      e.pages.add(pageNo); e.n++;
      reg.set(key, e);
      out += alt !== undefined ? String.fromCodePoint(alt) : ch;
    }
    r.text = out;
  };

  let hangCells = 0, widenedCells = 0;
  let paraSeq = 0, autoFolio = 0, protectedWords = 0, prettyParas = 0, prettyBreaks = 0;
  const prettyMiss = [];
  const prepPara = (p, pageNo) => {
    p.id = ++paraSeq;
    if (p.prettyBreaks > 0) { prettyParas++; prettyBreaks += p.prettyBreaks; }
    if (p.prettyBreaks < 0) prettyMiss.push(`S. ${pageNo}`);
    const cs = S[p.containerS], ks = S[p.paraS];
    // Zeilenabstand: gemessene Zeilenfolge, bei einer Zeile CSS-line-height (Container bzw. Leitelement)
    const cssLeading = Math.max(lineHeightPt(p.containerS, p.leadingPx), lineHeightPt(p.paraS, p.leadingPx));
    let leading = cssLeading;
    if (p.lines.length >= 2) {
      const d = p.lines.slice(1).map((l, i) => l.base - p.lines[i].base).sort((a, b) => a - b);
      const measured = d[Math.floor(d.length / 2)];
      if (Math.abs(measured - cssLeading) > 0.35) leading = measured;
    }
    p.leading = Math.round(leading * 20) / 20;
    p.align = alignOf(cs);
    // Silbentrennung wie im HTML (hyphens: manual): getrennt wird nur an den weichen Trennstrichen aus assemble.cjs.
    // Absätze ohne weichen Trennstrich (Überschriften, Labels, kurze Texte) bekommen keine automatische Trennung;
    // Absätze mit weichen Trennstrichen trennen dort (InDesign: bedingter Trennstrich hat Vorrang vor dem Wörterbuch).
    const hasShy = p.runs.some((r) => r.text && r.text.includes('\u00AD'));
    p.hyphenate = (cs.hyphens || 'manual') !== 'none' && /^de/i.test(cs.lang || 'de') && hasShy && !p.fixedBreaks;
    p.keep = cs.breakInside === 'avoid' || cs.breakInside === 'avoid-column';
    p.base = charAttrs(p.paraS);
    p.key = semanticKey(ks);
    // Läufe: weiche Trennstriche raus, Zusatzabstände (padding/margin von Inline-Elementen) als Laufweite
    // Läufe: weiche Trennstriche bleiben (InDesign: bedingter Trennstrich), Zusatzabstände (padding/margin von
    // Inline-Elementen, Breite von Inline-Grafiken/leeren Inline-Blöcken) als Laufweite des vorigen Zeichens;
    // trennt der Abstand zwei Wörter, steht dort ein geschütztes Leerzeichen und nur der Rest ist Laufweite.
    const runs = [];
    let pendingGap = 0;
    const wordCh = /[\p{L}\p{N}]/u;
    p.runs.forEach((r, ri) => {
      if (r.gap !== undefined) {
        const prev = [...runs].reverse().find((x) => x.text && x.text.length);
        if (!prev) { pendingGap += r.gap; return; }   // Abstand am Absatzanfang → steckt in der gemessenen Erstzeilen-Einrückung
        const sz = S[prev.s].sizePx * 0.75;
        const chars = Array.from(prev.text);
        const last = chars.pop();
        const next = p.runs.slice(ri + 1).find((x) => x.text && x.text.replace(/\u00AD/g, '').length);
        if (!next) return;   // Abstand am Absatzende (padding-right des letzten Inline-Elements): ohne Wirkung, nur Umbruchrisiko
        const nextCh = next ? Array.from(next.text.replace(/\u00AD/g, ''))[0] : '';
        const idx = runs.indexOf(prev);
        if (!r.obj && r.gap >= 0.25 * sz && wordCh.test(last) && wordCh.test(nextCh || '')) {
          const sp = (faceOf(prev.s).spaceEm || 0.25) * sz;
          runs.splice(idx + 1, 0, { text: '\u00A0', s: prev.s, shift: prev.shift, trackAdd: Math.round(((r.gap - sp) / sz) * 1000), gapSpace: true });
          return;
        }
        prev.text = chars.join('');
        runs.splice(idx + 1, 0, { text: last, s: prev.s, shift: prev.shift, trackAdd: (prev.trackAdd || 0) + Math.round((r.gap / sz) * 1000) });
        if (!prev.text) runs.splice(idx, 1);
        return;
      }
      if (r.obj || !r.text) return;
      runs.push({ text: r.text, s: r.s, shift: r.shift || 0, dropcap: !!r.dropcap });
    });
    runs.forEach((r) => coverRun(r, pageNo, p));
    // hyphens: none an einem Lauf: Chromium ignoriert dort weiche Trennstriche → raus (InDesign trennte sonst dort)
    runs.forEach((r) => { if (r.text && S[r.s].hyphens === 'none' && r.text.includes('\u00AD')) r.text = r.text.replace(/\u00AD/g, ''); });
    // Wörterbuchtrennung verhindern: Chromium trennt nur an weichen Trennstrichen (hyphens: manual), InDesign in
    // Absätzen mit Silbentrennung zusätzlich nach Wörterbuch. Wörter ab 8 Buchstaben ohne weiche Trennstelle
    // bekommen einen bedingten Trennstrich VOR das Wort (InDesign: „Wort nicht trennen“, unsichtbar).
    if (p.hyphenate) {
      const minLen = HYPHENATION.wordsLongerThan + 1;
      const all = runs.map((r) => r.text || '').join('');
      const starts = [];
      for (const m of all.matchAll(/[\p{L}\p{M}\u00AD]+/gu)) {
        const w = m[0];
        if (w.includes('\u00AD') || [...w.matchAll(/\p{L}/gu)].length < minLen) continue;
        starts.push(m.index);
      }
      let off = 0, k = 0;
      runs.forEach((r) => {
        const t = r.text || '', end = off + t.length;
        let out = '', last = 0, changed = false;
        while (k < starts.length && starts[k] < end) {
          const at = starts[k] - off;
          if (!r.dropcap && !(S[r.s].whiteSpace === 'nowrap' || S[r.s].whiteSpace === 'pre')) { out += t.slice(last, at) + '\u00AD'; last = at; changed = true; protectedWords++; }
          k++;
        }
        if (changed) r.text = out + t.slice(last);
        off = end;
      });
    }
    // Zusammenlegen gleicher Läufe
    p.fruns = [];
    for (const r of runs) {
      const l = p.fruns[p.fruns.length - 1];
      if (l && l.s === r.s && (l.shift || 0) === (r.shift || 0) && !l.trackAdd && !r.trackAdd && !l.dropcap && !r.dropcap) { l.text += r.text; continue; }
      p.fruns.push({ ...r });
    }
    p.fruns = p.fruns.filter((r) => r.text.length);
    p.text = p.fruns.map((r) => r.text).join('');
    return p;
  };

  // Zeilenanfang ohne Erstzeileneinzug: bei negativem text-indent (hängender Einzug) die Inhaltskante des
  // Containers, sonst der Absatzkasten (der die erste Zeile einschließt)
  const hangX = (p) => {
    const ti = (S[p.containerS].textIndentPx || 0) * 0.75;
    return ti < -0.3 && (p.align === 'LeftAlign' || p.align === 'LeftJustified') && p.contentX !== undefined && p.contentX > p.box.x + 0.3 ? p.contentX : p.box.x;
  };

  // ---- Seiten ----------------------------------------------------------------------------------------------------
  const pages = model.pages.map((pg) => {
    const left = pg.number % 2 === 0;   // gerade Seiten links (Seite 1 rechts allein)
    const items = [];
    const paras = pg.paragraphs.map((p) => prepPara(p, pg.number)).filter((p) => p.fruns.length);
    // Pagina als automatische Seitenzahl (gleiche Zahl, gleiche Schrift → gleiche Breite; folgt beim Umstellen)
    if (pg.number === pg.index + 1) {
      paras.forEach((p) => {
        if (!(p.containerCls || []).some((c) => FOLIO_CLASSES.includes(c))) return;
        const runs = p.fruns.filter((r) => r.text.trim());
        if (runs.length !== 1 || runs[0].text.trim() !== String(pg.number)) return;
        runs[0].text = runs[0].text.replace(String(pg.number), '\uE018');
        p.text = p.fruns.map((r) => r.text).join('');
        autoFolio++;
      });
    }
    pg.tables.forEach((t) => t.cells.forEach((c) => { c.paras = c.paras.map((p) => prepPara(p, pg.number)).filter((p) => p.fruns.length); }));

    // Hindernisse (für Rahmenzusammenfassung und Rahmenreserve)
    const obstacles = [];
    paras.forEach((p) => obstacles.push({ kind: 'para', id: p.id, ...p.box }));
    pg.graphics.forEach((g) => obstacles.push({ kind: 'graphic', id: 'g' + g.id, x: g.x, y: g.y, w: g.w, h: g.h }));
    pg.decors.forEach((d) => obstacles.push({ kind: 'decor', id: 'd' + d.id, x: d.x, y: d.y, w: d.w, h: d.h }));
    pg.tables.forEach((t, i) => obstacles.push({ kind: 'table', id: 't' + i, x: t.x, y: t.y, w: t.w, h: t.h }));
    pg.boxes.forEach((b, i) => { if (!b.M) obstacles.push({ kind: 'box', id: 'b' + i, x: b.x, y: b.y, w: b.w, h: b.h }); });
    const inter = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

    // ---- Textrahmen: Absätze desselben Kontexts untereinander zusammenfassen -----------------------------------
    const frames = [];
    const byMulticol = new Map();
    const byCtx = new Map();
    paras.forEach((p) => {
      if (p.multicol) {
        if (!byMulticol.has(p.multicol.id)) byMulticol.set(p.multicol.id, []);
        byMulticol.get(p.multicol.id).push(p);
      } else {
        if (!byCtx.has(p.ctx)) byCtx.set(p.ctx, []);
        byCtx.get(p.ctx).push(p);
      }
    });
    const firstBase = (p) => p.lines[0].base;
    const lastBase = (p) => p.lines[p.lines.length - 1].base;
    const boxBottom = (p) => Math.max(p.box.y + p.box.h, p.lines[p.lines.length - 1].bottom);
    byCtx.forEach((list) => {
      list.sort((a, b) => a.tree - b.tree || a.box.y - b.box.y);
      let F = null;
      for (const p of list) {
        if (opts.mergeFrames !== false && F) {
          const prev = F.paras[F.paras.length - 1];
          const below = p.box.y >= boxBottom(prev) - 1;
          const fx = F.x, fr = F.x + F.w;
          const ov = Math.min(fr, p.box.x + p.box.w) - Math.max(fx, p.box.x);
          const okX = ov >= 0.5 * Math.min(F.w, p.box.w);
          const sb = firstBase(p) - lastBase(prev) - p.leading;
          let ok = below && okX && sb > -0.5;
          if (ok) {
            const R = { x: Math.min(fx, p.box.x), w: Math.max(fr, p.box.x + p.box.w) - Math.min(fx, p.box.x), y: boxBottom(prev), h: p.box.y - boxBottom(prev) };
            const ids = new Set([...F.paras.map((q) => q.id), p.id]);
            const top = Math.min(...F.paras.map((q) => q.box.y)), bottom = p.box.y + p.box.h;
            const lx = Math.min(R.x, ...F.paras.map((q) => q.box.x)), rx = Math.max(R.x + R.w, ...F.paras.map((q) => q.box.x + q.box.w));
            if (R.h > 0.01) {
              for (const o of obstacles) {
                if (o.kind === 'para' && ids.has(o.id)) continue;
                const contains = o.x <= lx + 0.5 && o.x + o.w >= rx - 0.5 && o.y <= top + 0.5 && o.y + o.h >= bottom - 0.5;
                if ((o.kind === 'box' || o.kind === 'decor') && contains) continue;
                if (inter(o, { ...R, y: R.y + 0.2, h: Math.max(0, R.h - 0.4) }) > 0.3) { ok = false; break; }
              }
            }
            // Absätze zwischen beiden (Baumreihenfolge) aus anderen Kontexten, die horizontal überlappen
            if (ok) {
              for (const q of paras) {
                if (ids.has(q.id) || q.tree < prev.tree || q.tree > p.tree) continue;
                if (Math.min(R.x + R.w, q.box.x + q.box.w) - Math.max(R.x, q.box.x) > 0.5 && q.box.y < p.box.y && q.box.y + q.box.h > prev.box.y) { ok = false; break; }
              }
            }
          }
          if (ok) {
            p.spaceBefore = r2(Math.max(0, sb));
            F.paras.push(p);
            const nx = Math.min(F.x, p.box.x), nr = Math.max(F.x + F.w, p.box.x + p.box.w);
            F.x = nx; F.w = nr - nx;
            F.bottom = boxBottom(p);
            continue;
          }
        }
        F = { paras: [p], x: p.box.x, y: Math.min(p.box.y, p.lines[0].top), w: p.box.w, bottom: boxBottom(p) };
        p.spaceBefore = 0;
        frames.push(F);
      }
    });
    byMulticol.forEach((list) => {
      list.sort((a, b) => a.tree - b.tree);
      const mc = list[0].multicol;
      const F = { paras: list, x: mc.x, y: Math.min(mc.y, list[0].lines[0].top), w: mc.w, bottom: mc.y + mc.h, columns: mc.count, gutter: mc.gap, rule: mc.rule || null, mcY: mc.y, mcH: mc.h, balance: mc.balance !== false };
      // Spalte je Zeile kommt aus dem DOM-Modell (Zeilen in Lesereihenfolge: Spalte, dann Grundlinie). Ein Absatz
      // beginnt nur dann in der nächsten Spalte, wenn seine erste Zeile in einer späteren Spalte steht als die
      // letzte Zeile des Vorgängers; am Spaltenkopf entfällt der Abstand davor (wie CSS bei Spaltenumbrüchen).
      list.forEach((p, i) => {
        if (i === 0) { p.spaceBefore = 0; return; }
        const prev = list[i - 1];
        const pc = p.lines[0].col || 0, qc = prev.lines[prev.lines.length - 1].col || 0;
        p.colStart = pc > qc;
        p.spaceBefore = p.colStart ? 0 : r2(Math.max(0, firstBase(p) - lastBase(prev) - p.leading));
      });
      frames.push(F);
    });

    // Geometrie je Rahmen: Einzüge, erste Grundlinie, Reserve nach unten, Verbreiterung einzeiliger Rahmen
    frames.forEach((F) => {
      const colW = F.columns ? (F.w - (F.columns - 1) * F.gutter) / F.columns : F.w;
      F.paras.forEach((p) => {
        const bodyX = hangX(p);
        const relX = F.columns ? 0 : bodyX - F.x;
        p.leftIndent = r2(Math.max(0, relX));
        p.rightIndent = r2(Math.max(0, F.columns ? colW - p.box.w : F.x + F.w - (p.box.x + p.box.w)));
        if (p.leftIndent < 0.3) p.leftIndent = 0;
        if (p.rightIndent < 0.3) p.rightIndent = 0;
        // Erstzeileneinzug relativ zum Zeilenanfang der eigenen Spalte (mehrspaltig) bzw. zum Absatzkasten
        const colX = F.columns ? F.x + (p.lines[0].col || 0) * (colW + F.gutter) + p.leftIndent : bodyX;
        const fi = p.lines[0].left - colX;
        p.firstIndent = !p.dropcap && (p.align === 'LeftAlign' || p.align === 'LeftJustified') && Math.abs(fi) > 0.5 ? r2(fi) : 0;
        if (p.leftIndent + p.firstIndent < 0) p.firstIndent = -p.leftIndent;   // erste Zeile nie links aus dem Rahmen
        const avail = colW - p.leftIndent - p.rightIndent - Math.max(0, p.firstIndent);
        if (avail < 1) warnings.push(`S. ${pg.number}: Absatz „${p.text.slice(0, 40)}“ hat keine verfügbare Zeilenbreite (${r2(avail)} pt) – Einzüge prüfen`);
      });
      F.firstBaseline = r3(F.paras[0].lines[0].base - F.y);
      const single = !F.columns && F.paras.every((p) => (p.lines.length === 1 && !p.text.includes('\u2028')) || p.fixedBreaks);
      const aligns = new Set(F.paras.map((p) => p.align));
      const ids = new Set(F.paras.map((p) => p.id));
      // Reserve nach unten
      const last = F.paras[F.paras.length - 1];
      const want = Math.max(2, last.leading + 1);
      let limit = H - F.bottom;
      for (const o of obstacles) {
        if (o.kind === 'para' && ids.has(o.id)) continue;
        if (Math.min(F.x + F.w, o.x + o.w) - Math.max(F.x, o.x) <= 0.5) continue;
        if (o.y >= F.bottom - 0.5) limit = Math.min(limit, o.y - F.bottom);
        else if ((o.kind === 'box' || o.kind === 'decor') && o.y <= F.y + 0.5 && o.y + o.h >= F.bottom - 0.5) limit = Math.min(limit, o.y + o.h - F.bottom);
      }
      if (F.paras[0].ctxBox && F.paras[0].ctxBox.decorated) {
        const cb = F.paras[0].ctxBox;
        limit = Math.min(limit, cb.y + cb.h - F.bottom);
      }
      F.reserve = r2(Math.max(0, Math.min(want, limit - 0.3)));
      F.h = F.bottom - F.y + F.reserve;
      // Einzeilige Rahmen etwas breiter (InDesign setzt minimal anders) – zur freien Seite hin
      if (single && aligns.size === 1) {
        const al = [...aligns][0];
        const ext = Math.min(24, Math.max(4, F.w * 0.08));
        let freeR = W + (left ? 0 : bleed) - (F.x + F.w), freeL = F.x;
        for (const o of obstacles) {
          if (o.kind === 'para' && ids.has(o.id)) continue;
          if (o.kind === 'box' || o.kind === 'decor') continue;
          if (Math.min(F.y + F.h, o.y + o.h) - Math.max(F.y, o.y) <= 0.3) continue;
          if (o.x >= F.x + F.w - 0.5) freeR = Math.min(freeR, o.x - (F.x + F.w));
          if (o.x + o.w <= F.x + 0.5) freeL = Math.min(freeL, F.x - (o.x + o.w));
        }
        // Der Gewinn bleibt verfügbare Zeilenbreite (keine ausgleichenden Einzüge): InDesign misst minimal anders,
        // ein exakt passendes Wort („2.4“, Pagina) bräche sonst um. Mindestens MIN_RESERVE pt, auch wenn ein
        // Nachbarobjekt nah ist (Textrahmen dürfen sich überlappen, die Schrift steht an derselben Stelle).
        const MIN_RESERVE = 2;
        const pageL = left ? -bleed : 0, pageR = W + (left ? 0 : bleed);
        if (al === 'LeftAlign' || al === 'LeftJustified') {
          const d = Math.min(Math.max(MIN_RESERVE, Math.min(ext, freeR - 0.5)), pageR - (F.x + F.w));
          F.w += Math.max(0, d); F.paras.forEach((p) => { p.rightIndent = 0; });
        } else if (al === 'RightAlign') {
          const d = Math.min(Math.max(MIN_RESERVE, Math.min(ext, freeL - 0.5)), F.x - pageL);
          F.x -= Math.max(0, d); F.w += Math.max(0, d);
          F.paras.forEach((p) => { p.leftIndent = 0; });
        } else if (al === 'CenterAlign') {
          const d = Math.min(Math.max(MIN_RESERVE / 2, Math.min(ext / 2, freeL - 0.5, freeR - 0.5)), F.x - pageL, pageR - (F.x + F.w));
          F.x -= Math.max(0, d); F.w += 2 * Math.max(0, d);
        }
      }
      items.push({ kind: 'text', layer: 'Text', frame: F, paint: F.paras[0].paint, x: F.x, y: F.y, w: F.w, h: F.h, foot: F.paras.every((p) => p.foot) });
      // Spaltenlinie (column-rule) mittig im Spaltenabstand über die Höhe des Spaltenkastens
      if (F.columns && F.rule) {
        const cw = (F.w - (F.columns - 1) * F.gutter) / F.columns;
        for (let c = 1; c < F.columns; c++) {
          const lx = F.x + c * cw + (c - 0.5) * F.gutter;
          items.push({ kind: 'line', layer: 'Hintergrund', x: lx - F.rule.w / 2, y: F.mcY, w: F.rule.w, h: F.mcH, x1: F.rule.w / 2, y1: 0, x2: F.rule.w / 2, y2: F.mcH,
            stroke: { ref: sw.ref(F.rule.color).ref, alpha: F.rule.color.a, w: F.rule.w, style: F.rule.style }, paint: [...F.paras[0].paint.slice(0, 3), 0, F.paras[0].paint[4]], name: 'Spaltenlinie' });
        }
      }
    });

    // ---- Tabellen ----------------------------------------------------------------------------------------------
    pg.tables.forEach((t, ti) => {
      const sumRows = t.rowH.reduce((a, b) => a + b, 0);
      if (t.h - sumRows > 1) warnings.push(`S. ${pg.number}: Tabelle ${ti + 1} ist ${r2(t.h - sumRows)} pt höher als ihre Zeilen (Beschriftung/Rahmen im Tabellenkasten?)`);
      let limit = H - (t.y + t.h);
      for (const o of obstacles) {
        if (o.id === 't' + ti) continue;
        if (Math.min(t.x + t.w, o.x + o.w) - Math.max(t.x, o.x) <= 0.5) continue;
        if (o.y >= t.y + t.h - 0.5 && !(o.kind === 'para' && o.y < t.y + t.h + 0.5 && o.y >= t.y)) limit = Math.min(limit, o.y - (t.y + t.h));
      }
      const reserve = Math.max(0, Math.min(12, limit - 0.3));
      // Zellen mit Innenleben (Badges, Icons) bekommen ihre Fläche als eigenes Rechteck (sonst verdeckt)
      t.cells.forEach((c) => {
        if (c.fill && c.hasInner) {
          items.push({ kind: 'shape', shape: 'rect', layer: 'Hintergrund', x: c.x, y: c.y, w: c.w, h: c.h, fill: sw.ref(c.fill), paint: [t.paint[0], t.paint[1], t.paint[2], 0, t.paint[4]], name: 'Zellfläche' });
          c.fillAsShape = true;
        }
      });
      // Zellen: Kanten/Fläche als Farbfeld-Referenzen, Absätze untereinander (Abstand vor), erste Grundlinie
      t.cells.forEach((c) => {
        c.edgesW = {};
        for (const k of ['top', 'bottom', 'left', 'right']) {
          const e = c.edges[k];
          c.edgesW[k] = e ? { w: e.w, ref: sw.ref(e.color).ref, style: e.style } : null;
        }
        c.fillW = c.fill && !c.fillAsShape ? sw.ref(c.fill) : null;
        c.paras.sort((a, b) => a.tree - b.tree);
        const innerL = c.x + c.inset.l, innerR = c.x + c.w - c.inset.r;
        c.paras.forEach((p, i) => {
          p.spaceBefore = i ? r2(Math.max(0, p.lines[0].base - c.paras[i - 1].lines[c.paras[i - 1].lines.length - 1].base - p.leading)) : 0;
          const bodyX = hangX(p);
          p.leftIndent = r2(Math.max(0, bodyX - innerL)); if (p.leftIndent < 0.3) p.leftIndent = 0;
          p.rightIndent = r2(Math.max(0, innerR - (p.box.x + p.box.w))); if (p.rightIndent < 0.3) p.rightIndent = 0;
          const fi = p.lines[0].left - bodyX;
          p.firstIndent = (p.align === 'LeftAlign' || p.align === 'LeftJustified') && Math.abs(fi) > 0.5 ? r2(fi) : 0;
        });
        // Hängender Einzug (text-indent < 0, z. B. Rechenzeichen in .table--sheet td.is-hang): die erste Zeile ragt in
        // den Zelleninnenabstand. InDesign lässt Einzug + Erstzeileneinzug < 0 nicht zu → Innenabstand links um den
        // Überhang verkleinern und alle Absätze der Zelle um denselben Betrag einrücken (Lage unverändert).
        const over = Math.max(0, ...c.paras.map((p) => -(p.leftIndent + Math.min(0, p.firstIndent))));
        if (over > 0.05) {
          const sh = Math.min(over, c.inset.l);
          c.inset = { ...c.inset, l: r3(c.inset.l - sh) };
          c.paras.forEach((p) => { p.leftIndent = r2(p.leftIndent + sh); if (p.leftIndent + p.firstIndent < 0) p.firstIndent = -p.leftIndent; });
          hangCells++;
        }
        if (c.paras.length) c.firstBaseline = r3(c.paras[0].lines[0].base - (c.y + c.inset.t));
      });
      widenCells(t, ti);
      items.push({ kind: 'table', layer: 'Text', table: t, x: t.x, y: t.y, w: t.w, h: t.h + reserve, paint: t.paint });
      if (t.bg && t.bg.a > 0.004) items.push({ kind: 'shape', shape: 'rect', layer: 'Hintergrund', x: t.x, y: t.y, w: t.w, h: t.h, fill: sw.ref(t.bg), paint: [t.paint[0], t.paint[1], t.paint[2], 0, t.paint[4] - 0.5], name: 'Tabellenfläche' });
    });

    // ---- Zellen mit unteilbarem Text, der (fast) nicht in die Zelle passt ----------------------------------------
    // Im HTML darf ein Wort über die Zelle hinauslaufen (z. B. Kopf „MIETENSTUFE“ in Versalien mit Laufweite), InDesign
    // bricht es dann mitten im Wort um oder setzt die Zelle in Übersatz. Jede einzeilige, unteilbare Zeile braucht in
    // InDesign mindestens CELL_SLACK pt Luft. Abhilfe ohne sichtbare Änderung: 1. Innenabstand auf der freien Seite
    // verkleinern; 2. reicht das nicht, die Spaltengrenze rechts der Zelle nur in deren Zeilen verschieben – dazu eine
    // schmale Hilfsspalte einfügen, die in allen anderen Zeilen mit der Nachbarzelle verbunden ist (Geometrie dort
    // unverändert). Voraussetzung: keine senkrechte Linie an der Grenze, gleiche waagerechte Linien, und die
    // Nachbarzelle hat links genug Platz (Innenabstand oder rechtsbündiger Inhalt).
    function widenCells(t, ti) {
      const CELL_SLACK = 1;
      const brk = (p) => new RegExp(`[ \\u2028\\-\\u2010\\u2013\\u2014/${p.hyphenate ? '\\u00AD' : ''}]`);
      const sameEdge = (a, b) => (!a || a.w < 0.01) ? (!b || b.w < 0.01) : !!b && Math.abs(a.w - b.w) < 0.01 && a.ref === b.ref && a.style === b.style;
      for (const c of t.cells.slice()) {
        for (const p of c.paras) {
          if (p.lines.length !== 1) continue;
          const txt = p.fruns.filter((r) => !(S[r.s].whiteSpace === 'nowrap' || S[r.s].whiteSpace === 'pre')).map((r) => r.text).join('').trim();
          if (brk(p).test(txt)) continue;                 // umbrechbar: InDesign bricht wie Chromium an Wortgrenzen
          const lw = p.lines[0].right - p.lines[0].left;
          const avail = () => c.w - c.inset.l - c.inset.r - p.leftIndent - p.rightIndent - Math.max(0, p.firstIndent);
          let need = lw + CELL_SLACK - avail();
          if (need <= 0.01) continue;
          const label = `S. ${pg.number}: Tabelle ${ti + 1}, Zelle ${c.col}:${c.row} „${p.text.replace(/[\u00AD\u2028]/g, '').slice(0, 30)}“`;
          // 1. Innenabstand auf der freien Seite (linksbündig: rechts, rechtsbündig: links, zentriert: beidseitig)
          const sides = p.align === 'RightAlign' ? ['l'] : p.align === 'CenterAlign' ? ['l', 'r'] : ['r'];
          for (const sd of sides) {
            const take = Math.min(c.inset[sd], need / sides.length);
            if (take <= 0) continue;
            c.inset = { ...c.inset, [sd]: r3(c.inset[sd] - take) };
            // übrige Absätze der Zelle bleiben, wo sie sind
            c.paras.forEach((q) => { if (q !== p) { if (sd === 'r') q.rightIndent = r2(q.rightIndent + take); else q.leftIndent = r2(q.leftIndent + take); } });
          }
          need = lw + CELL_SLACK - avail();
          widenedCells++;
          if (need <= 0.01) continue;
          // 2. Spaltengrenze rechts verschieben (nur linksbündig; Spalte b = erste Spalte rechts der Zelle)
          const b = c.col + c.colSpan;
          const R0 = c.row, R1 = c.row + c.rowSpan;
          const right = t.cells.filter((x) => x.col === b && x.row < R1 && x.row + x.rowSpan > R0);
          const d = Math.ceil((need + 0.05) * 10) / 10;
          const why = p.align !== 'LeftAlign' && p.align !== 'LeftJustified' ? 'nicht linksbündig'
            : b >= t.ncol ? 'Zelle am Tabellenrand'
            : right.some((x) => x.row < R0 || x.row + x.rowSpan > R1) ? 'Nachbarzelle reicht über weitere Zeilen'
            : [...Array(R1 - R0).keys()].some((k) => !right.some((x) => x.row <= R0 + k && x.row + x.rowSpan > R0 + k)) ? 'eine Zelle überspannt die Spaltengrenze'
            : (c.edgesW.right && c.edgesW.right.w > 0.01) || right.some((x) => x.edgesW.left && x.edgesW.left.w > 0.01) ? 'senkrechte Linie an der Spaltengrenze'
            : right.some((x) => (x.row === R0 && !sameEdge(x.edgesW.top, c.edgesW.top)) || (x.row + x.rowSpan === R1 && !sameEdge(x.edgesW.bottom, c.edgesW.bottom)) ||
                (x.row + x.rowSpan < R1 && x.edgesW.bottom && x.edgesW.bottom.w > 0.01)) ? 'waagerechte Linien der Nachbarzelle weichen ab'
            : right.some((x) => x.inset.l < d && !(x.paras.length && x.paras.every((q) => q.align === 'RightAlign' && Math.min(...q.lines.map((l) => l.left)) - (x.x + x.inset.l) >= d + 0.5)))
              ? 'Nachbarzelle hat links keinen Platz' : '';
          if (why) { warnings.push(`${label}: Text ist ${r2(need)} pt breiter als die Zelle (${why}) – InDesign bricht ihn um oder setzt Übersatz`); continue; }
          // Flächen der beteiligten Zellen als eigene Rechtecke (sonst wanderte die Flächenkante mit der Grenze)
          for (const x of [c, ...right]) {
            if (!x.fillW) continue;
            items.push({ kind: 'shape', shape: 'rect', layer: 'Hintergrund', x: x.x, y: x.y, w: x.w, h: x.h, fill: x.fillW, paint: [t.paint[0], t.paint[1], t.paint[2], 0, t.paint[4]], name: 'Zellfläche' });
            x.fillW = null;
          }
          t.colW.splice(b, 0, d);
          t.colW[b + 1] = r3(t.colW[b + 1] - d);
          t.ncol++;
          for (const x of t.cells) {
            if (x === c) { x.colSpan++; x.w += d; continue; }
            if (right.includes(x)) {
              x.col++; x.x += d; x.w -= d;
              if (x.inset.l >= d) x.inset = { ...x.inset, l: r3(x.inset.l - d) };   // Inhaltsbox bleibt stehen
              continue;
            }
            if (x.col < b && x.col + x.colSpan > b) x.colSpan++;                      // überspannt die Grenze
            else if (x.col === b) x.colSpan++;                                        // andere Zeilen: Nachbarzelle umfasst die Hilfsspalte
            else if (x.col > b) x.col++;
          }
          c.paras.forEach((q) => { if (q !== p) q.rightIndent = r2(q.rightIndent + d); });
          t.widened = (t.widened || 0) + 1;
        }
      }
    }

    // ---- Flächen, Linien, Formen ------------------------------------------------------------------------------
    const clipBleed = (x, y, w, h, edges, fill) => {
      // Randabfallende Flächen nur an Außenkanten (oben, unten, außen) um den Beschnitt verlängern, am Bund hart
      // auf die Seitenkante beschneiden (sonst ragt die Fläche in die Nachbarseite des Spreads).
      let x0 = x, y0 = y, x1 = x + w, y1 = y + h;
      const spineLeft = !left;                       // rechte Seite: Bund links; linke Seite: Bund rechts
      if (fill && edges) {
        if (edges.t) y0 = -bleed;
        if (edges.b) y1 = H + bleed;
        if (edges.l && !spineLeft) x0 = -bleed;
        if (edges.r && spineLeft) x1 = W + bleed;
      }
      const lim = fill ? { x0: spineLeft ? 0 : -bleed, x1: spineLeft ? W + bleed : W, y0: -bleed, y1: H + bleed } : { x0: 0, x1: W, y0: 0, y1: H };
      x0 = Math.max(x0, lim.x0); x1 = Math.min(x1, lim.x1); y0 = Math.max(y0, lim.y0); y1 = Math.min(y1, lim.y1);
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    };
    // sprechender Objektname: Bauteil (deutsch, aus der CSS-Klasse) + Rolle; Pseudo-Elemente nach ihrem Elternelement
    const objectName = (b, kind) => {
      const role = kind === 'line' ? 'Linie' : kind === 'oval' ? 'Punkt' : kind === 'polygon' ? 'Form' : (b.w <= 12 && b.h <= 12 ? 'Marke' : 'Fläche');
      if (b.tag === 'idml-pseudo') {
        if (b.parentTag === 'li') return 'Aufzählungszeichen';
        const base = germanName(semanticKey({ tag: b.parentTag, cls: b.parentCls || [], parentCls: b.gparentCls || [], parentTag: '', section: '' }), 'para');
        return `${base} ${role === 'Fläche' ? 'Zierfläche' : role}`;
      }
      const base = germanName(semanticKey({ tag: b.tag, cls: b.cls || [], parentCls: b.parentCls || [], parentTag: b.parentTag || '', section: '' }), 'para');
      return `${base} ${role}`;
    };
    pg.boxes.forEach((b) => {
      const opacity = b.opacity;
      const fill = b.fill ? sw.ref(b.fill) : null;
      const sides = b.sides || [];
      const eq = sides.length === 4 && sides.every((s) => s && sides[0] && Math.abs(s.w - sides[0].w) < 0.01 && s.style === sides[0].style && s.color.r === sides[0].color.r && s.color.g === sides[0].color.g && s.color.b === sides[0].color.b && s.color.a === sides[0].color.a);
      const minR = Math.min(b.w, b.h) / 2;
      const isOval = b.radii && b.radii.every((r) => r >= minR - 0.3) && minR > 0;
      const geom = b.M ? { x: b.x, y: b.y, w: b.w, h: b.h } : clipBleed(b.x, b.y, b.w, b.h, b.edges, !!fill && !b.polygon && !isOval && !b.radii.some((r) => r > 0.01));
      if (geom.w <= 0.01 || geom.h <= 0.01) return;
      const base = { layer: 'Hintergrund', paint: b.paint, M: b.M, opacity, name: objectName(b, b.polygon ? 'polygon' : isOval ? 'oval' : 'rect'), foot: !!b.foot };
      // box-shadow (nur Ausdehnung): außen als Fläche dahinter, innen (inset) als Kontur innen über der Fläche
      (b.spreadShadows || []).forEach((s) => {
        if (s.inset) {
          items.push({ ...base, kind: 'shape', shape: isOval ? 'oval' : 'rect', x: b.x, y: b.y, w: b.w, h: b.h, radii: isOval ? null : b.radii,
            fill: { ref: 'Swatch/None', alpha: 0 }, stroke: { ref: sw.ref(s.color).ref, alpha: s.color.a, w: s.spread, style: 'solid', align: 'InsideAlignment' },
            paint: [...b.paint.slice(0, 4), b.paint[4] + 0.25], name: objectName(b, 'rect').replace(/ (Fläche|Marke)$/, ' Kontur') });
          return;
        }
        items.push({ ...base, kind: 'shape', shape: isOval ? 'oval' : 'rect', x: b.x - s.spread, y: b.y - s.spread, w: b.w + 2 * s.spread, h: b.h + 2 * s.spread,
          radii: b.radii.map((r) => (r > 0 ? r + s.spread : 0)), fill: sw.ref(s.color), paint: [...b.paint.slice(0, 3), b.paint[3], b.paint[4] - 0.5] });
      });
      if (b.polygon) {
        if (fill) items.push({ ...base, kind: 'shape', shape: 'polygon', points: b.polygon, x: b.x, y: b.y, w: b.w, h: b.h, fill });
        return;
      }
      // Haarlinie aus abgerundeter Fläche (Höhe/Breite < 1,2 pt, z. B. border-radius: 50 %): als Linie mit runden Enden
      const thin = Math.min(b.w, b.h), long = Math.max(b.w, b.h);
      if (fill && !eq && !b.M && isOval && thin < 1.2 && long > 10 * thin && !sides.some(Boolean)) {
        const horiz = b.w >= b.h, r = thin / 2;
        items.push({ ...base, kind: 'line', x: b.x, y: b.y, w: b.w, h: b.h, cap: 'RoundEndCap', name: objectName(b, 'line'),
          ...(horiz ? { x1: r, y1: r, x2: b.w - r, y2: r } : { x1: r, y1: r, x2: r, y2: b.h - r }),
          stroke: { ref: fill.ref, alpha: fill.alpha, w: thin, style: 'solid' } });
        return;
      }
      if (fill || eq) {
        const stroke = eq ? { ref: sw.ref(sides[0].color).ref, alpha: sides[0].color.a, w: sides[0].w, style: sides[0].style } : null;
        items.push({ ...base, kind: 'shape', shape: isOval ? 'oval' : 'rect', ...geom, radii: isOval ? null : b.radii, fill: fill || { ref: 'Swatch/None', alpha: 0 }, stroke });
      }
      if (!eq) {
        // einzelne Kanten als Linien (Mitte des Randstreifens)
        const L = [];
        const [t, r, bt, l] = sides;
        if (t) L.push({ s: t, x1: 0, y1: t.w / 2, x2: b.w, y2: t.w / 2 });
        if (bt) L.push({ s: bt, x1: 0, y1: b.h - bt.w / 2, x2: b.w, y2: b.h - bt.w / 2 });
        if (l) L.push({ s: l, x1: l.w / 2, y1: 0, x2: l.w / 2, y2: b.h });
        if (r) L.push({ s: r, x1: b.w - r.w / 2, y1: 0, x2: b.w - r.w / 2, y2: b.h });
        L.forEach((ln) => items.push({ ...base, name: objectName(b, 'line'), kind: 'line', x: b.x, y: b.y, w: b.w, h: b.h, x1: ln.x1, y1: ln.y1, x2: ln.x2, y2: ln.y2,
          stroke: { ref: sw.ref(ln.s.color).ref, alpha: ln.s.color.a, w: ln.s.w, style: ln.s.style }, paint: b.paint }));
      }
      if (b.outline) {
        items.push({ ...base, kind: 'shape', shape: isOval ? 'oval' : 'rect', x: b.x - b.outline.offset, y: b.y - b.outline.offset, w: b.w + 2 * b.outline.offset, h: b.h + 2 * b.outline.offset,
          radii: null, fill: { ref: 'Swatch/None', alpha: 0 }, stroke: { ref: sw.ref(b.outline.color).ref, alpha: b.outline.color.a, w: b.outline.w, style: 'solid', align: 'OutsideAlignment' } });
      }
    });

    // ---- Grafiken (SVG → PDF) und Flächen mit Verlauf/Muster (→ PDF) ---------------------------------------------
    const place = (g, kind, layer) => {
      const info = graphics.get(`${kind}${g.id}`);
      if (!info) { warnings.push(`S. ${pg.number}: Grafik ${kind}${g.id} nicht gerendert`); return; }
      // gerenderter Bereich (inkl. Beschnittzugabe) → Rahmen = Schnitt mit Seite (+ Beschnitt außen)
      const rx = g.x - info.bleed.l * 0.75, ry = g.y - info.bleed.t * 0.75;
      const rw = info.pdfW, rh = info.pdfH;
      const clip = { x0: left ? -bleed : 0, y0: -bleed, x1: left ? W : W + bleed, y1: H + bleed };
      const fx0 = Math.max(rx, clip.x0), fy0 = Math.max(ry, clip.y0), fx1 = Math.min(rx + rw, clip.x1), fy1 = Math.min(ry + rh, clip.y1);
      if (fx1 - fx0 < 0.1 || fy1 - fy0 < 0.1) return;
      items.push({ kind: 'graphic', layer, x: fx0, y: fy0, w: fx1 - fx0, h: fy1 - fy0, content: { dx: rx - fx0, dy: ry - fy0, w: rw, h: rh },
        link: info.file, paint: g.paint, name: info.name, label: g.label || '', foot: !!g.foot });
    };
    pg.graphics.forEach((g) => place(g, 'g', 'Grafiken'));
    pg.decors.forEach((d) => place(d, 'd', 'Hintergrund'));

    // ---- Umfluss-Rechtecke für Floats (Text umfließt wie im Browser) ---------------------------------------------
    (pg.wraps || []).forEach((w) => items.push({ kind: 'shape', shape: 'rect', layer: 'Text', x: w.x, y: w.y, w: w.w, h: w.h, wrap: true,
      fill: { ref: 'Swatch/None', alpha: 0 }, stroke: null, paint: [...w.paint.slice(0, 3), 0, w.paint[4]], name: 'Textumfluss' }));
    items.forEach((it) => { if (it.kind === 'text' && it.frame.paras.some((p) => p.inFloat)) it.ignoreWrap = true; });

    // ---- Seitenhintergrund -----------------------------------------------------------------------------------
    // weißer Seitenhintergrund = Papier: keine Fläche (fängt sonst in InDesign Klicks und Auswahlrechtecke ab)
    const paperWhite = pg.bg && pg.bg.r === 255 && pg.bg.g === 255 && pg.bg.b === 255;
    if (pg.bg && pg.bg.a > 0.004 && !paperWhite) {
      const g = clipBleed(0, 0, W, H, { l: true, r: true, t: true, b: true }, true);
      items.unshift({ kind: 'shape', shape: 'rect', layer: 'Hintergrund', ...g, fill: sw.ref(pg.bg), paint: [-1e9, 0, -1, 0, -1], name: 'Seitenfläche' });
    }

    // ---- Ebenen & Stapelreihenfolge -----------------------------------------------------------------------------
    const cmp = (a, b) => { for (let i = 0; i < 5; i++) if (a.paint[i] !== b.paint[i]) return a.paint[i] - b.paint[i]; return 0; };
    const graphicsItems = items.filter((i) => i.kind === 'graphic' && i.layer === 'Grafiken');
    const overl = (a, b) => Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 0.3 && Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 0.3;
    items.forEach((it) => {
      if (it.layer !== 'Hintergrund') return;
      if (graphicsItems.some((g) => cmp(g, it) < 0 && overl(g, it))) it.layer = 'Grafiken';
    });
    items.sort(cmp);
    return { number: pg.number, left, margins: pg.margins, items, frames };
  });

  // ---- Absatz- und Zeichenformate ------------------------------------------------------------------------------
  const allParas = [];
  pages.forEach((pg) => pg.items.forEach((it) => {
    if (it.kind === 'text') it.frame.paras.forEach((p) => allParas.push(p));
    if (it.kind === 'table') it.table.cells.forEach((c) => c.paras.forEach((p) => { p.inCell = true; allParas.push(p); }));
  }));
  allParas.forEach((p) => {
    const a = { ...p.base };
    a.Leading = p.leading;
    a.Justification = p.align;
    a.Hyphenation = p.hyphenate;
    a.FirstLineIndent = p.firstIndent || 0;
    a.LeftIndent = p.leftIndent || 0;
    a.RightIndent = p.rightIndent || 0;
    a.SpaceBefore = p.spaceBefore || 0;
    a.SpaceAfter = 0;
    a.KeepAllLinesTogether = !!p.keep;
    a.NoBreak = !!a.NoBreak;
    a.DropCapLines = p.dropcap ? p.dropcap.lines : 0;
    a.DropCapCharacters = p.dropcap ? p.dropcap.chars : 0;
    a.StartParagraph = p.colStart ? 'NextColumn' : 'Anywhere';
    // Messrauschen (< 0,1 pt) aus Abständen und Einzügen entfernen – keine sichtbare Wirkung, aber eigene Formatwerte
    for (const k of ['FirstLineIndent', 'LeftIndent', 'RightIndent', 'SpaceBefore']) if (Math.abs(a[k]) < 0.1) a[k] = 0;
    p.attrs = a;
  });
  const sig = (a) => SIG_KEYS.map((k) => a[k]).join('|');
  const groups = new Map();
  allParas.forEach((p) => {
    const base = germanName(p.key, 'para');          // gleicher deutscher Name → gleiches Format (z. B. p, prose p → Fließtext)
    const k = base + '§' + sig(p.attrs);
    if (!groups.has(k)) groups.set(k, { key: base, sig: sig(p.attrs), paras: [] });
    groups.get(k).paras.push(p);
  });
  const mode = (vals) => {
    const m = new Map();
    vals.forEach((v) => m.set(JSON.stringify(v), (m.get(JSON.stringify(v)) || 0) + 1));
    return JSON.parse([...m.entries()].sort((a, b) => b[1] - a[1])[0][0]);
  };
  // Namen: gleicher Schlüssel → häufigste Variante ohne Zusatz, weitere mit unterscheidendem Merkmal
  const de = (v) => String(Math.round(v * 10) / 10).replace('.', ',');
  const swName = (ref) => {
    const s = sw.list.find((x) => x.self === ref);
    return s ? ((NAMES.farben || {})[s.token] || s.token) : String(ref || '').replace(/^(Color|Swatch)\//, '');
  };
  const unique = (reg, name) => { let n = name, k = 2; while (reg.has(n)) n = `${name} ${k++}`; reg.add(n); return n; };
  const byKey = new Map();
  groups.forEach((g) => { if (!byKey.has(g.key)) byKey.set(g.key, []); byKey.get(g.key).push(g); });
  const usedNames = new Set(['Tabellenanker']);
  const paraStyles = [];
  [...byKey].sort((x, y) => y[1].reduce((n, g) => n + g.paras.length, 0) - x[1].reduce((n, g) => n + g.paras.length, 0)).forEach(([key, gs]) => {
    gs.sort((a, b) => b.paras.length - a.paras.length);
    const base = key;
    const main = gs[0].paras[0].attrs;
    gs.forEach((g, i) => {
      const a0 = g.paras[0].attrs;
      // Varianten: alle unterscheidenden Merkmale im Namen (Größe, Schnitt, Versalien) statt „… 2“, „… 3“
      let label = base;
      if (i > 0) {
        const parts = [];
        if (a0.PointSize !== main.PointSize) parts.push(`${de(a0.PointSize)} pt`);
        if (a0.FontStyle !== main.FontStyle || a0.AppliedFont !== main.AppliedFont) parts.push(a0.AppliedFont !== main.AppliedFont ? `${a0.AppliedFont} ${a0.FontStyle}` : a0.FontStyle);
        if (a0.Capitalization !== main.Capitalization) parts.push(a0.Capitalization === 'AllCaps' ? 'Versal' : 'normal');
        if (!parts.length && a0.Leading !== main.Leading) parts.push(`ZAB ${de(a0.Leading)}`);
        if (parts.length) label = `${base} ${parts.join(' ')}`;
      }
      const name = unique(usedNames, label);
      const attrs = {};
      PARA_KEYS.forEach((k) => { attrs[k] = mode(g.paras.map((p) => p.attrs[k])); });
      const st = { self: 'ParagraphStyle/' + name, name, attrs, count: g.paras.length, key };
      paraStyles.push(st);
      g.paras.forEach((p) => {
        p.style = st;
        p.over = {};
        PARA_KEYS.forEach((k) => { if (JSON.stringify(p.attrs[k]) !== JSON.stringify(attrs[k])) p.over[k] = p.attrs[k]; });
      });
    });
  });
  // Formate mit identischen Attributen zusammenführen (gleiches Aussehen, verschiedene Klassennamen): Name = Eintrag
  // in stilnamen.json „zusammenfuehren“ für eines der Mitglieder, sonst das meistverwendete Mitglied
  const mergeStyles = (list, attrKey, reassign, reg, prefer = () => 0) => {
    const byAttrs = new Map();
    list.forEach((s) => { const k = attrKey(s); if (!byAttrs.has(k)) byAttrs.set(k, []); byAttrs.get(k).push(s); });
    const out = [];
    byAttrs.forEach((g) => {
      if (g.length === 1) { out.push(g[0]); return; }
      g.sort((a, b) => prefer(b.name) - prefer(a.name) || b.count - a.count);
      const keep = g[0];
      const cfg = g.map((s) => (NAMES.zusammenfuehren || {})[s.name]).find(Boolean);
      keep.mergedFrom = g.map((s) => s.name);
      if (cfg && cfg !== keep.name) { keep.name = unique(reg, cfg); keep.self = keep.self.replace(/\/.*$/, '/') + keep.name; }
      g.slice(1).forEach((s) => { keep.count += s.count; reassign(s, keep); });
      out.push(keep);
    });
    return out;
  };
  const nParaBefore = paraStyles.length;
  const merged = mergeStyles(paraStyles, (s) => JSON.stringify(PARA_KEYS.map((k) => s.attrs[k])), (from, to) => {
    allParas.forEach((p) => { if (p.style === from) p.style = to; });
  }, usedNames);
  paraStyles.length = 0; paraStyles.push(...merged);
  paraStyles.sort((a, b) => a.name.localeCompare(b.name, 'de'));
  // Basisformate je Schriftfamilie („Basis Work Sans“, „Basis Montserrat“): alle Formate basieren darauf und
  // schreiben nur ihre Abweichungen – Grundschrift, Sprache, Setzer und Silbentrennung zentral änderbar.
  const byFam = new Map();
  paraStyles.forEach((s) => { const f = s.attrs.AppliedFont; if (!byFam.has(f)) byFam.set(f, []); byFam.get(f).push(s); });
  const baseStyles = [];
  const wmode = (pairs) => {   // gewichteter Modus [[Wert, Gewicht], …]
    const m = new Map();
    pairs.forEach(([v, n]) => m.set(JSON.stringify(v), (m.get(JSON.stringify(v)) || 0) + n));
    return JSON.parse([...m.entries()].sort((a, b) => b[1] - a[1])[0][0]);
  };
  [...byFam].sort((x, y) => y[1].reduce((n, s) => n + s.count, 0) - x[1].reduce((n, s) => n + s.count, 0)).forEach(([fam, list]) => {
    const attrs = {};
    PARA_KEYS.forEach((k) => { attrs[k] = wmode(list.map((s) => [s.attrs[k], s.count])); });
    // absatzbezogene Werte im Basisformat neutral (Einzüge, Abstände, Initiale, Umbruch)
    Object.assign(attrs, { FirstLineIndent: 0, LeftIndent: 0, RightIndent: 0, SpaceBefore: 0, SpaceAfter: 0, DropCapLines: 0, DropCapCharacters: 0, StartParagraph: 'Anywhere', KeepAllLinesTogether: false, NoBreak: false });
    const name = unique(usedNames, `Basis ${fam}`);
    const base = { self: 'ParagraphStyle/' + name, name, attrs, count: 0, isBase: true };
    baseStyles.push(base);
    list.forEach((s) => { s.basedOn = base; });
  });

  // Zeichenformate: Abweichungen eines Laufs vom effektiven Absatz
  const charGroups = new Map();
  allParas.forEach((p) => {
    const eff = { ...p.style.attrs, ...p.over };
    p.fruns.forEach((r) => {
      const a = charAttrs(r.s);
      const diff = {};
      FORMAT_KEYS.forEach((k) => { if (JSON.stringify(a[k]) !== JSON.stringify(eff[k])) diff[k] = a[k]; });
      if (diff.FontStyle !== undefined || diff.AppliedFont !== undefined) { diff.AppliedFont = a.AppliedFont; diff.FontStyle = a.FontStyle; }
      const local = {};
      if (a.AppliedLanguage !== eff.AppliedLanguage) local.AppliedLanguage = a.AppliedLanguage;
      if (!!a.NoBreak !== !!eff.NoBreak) local.NoBreak = !!a.NoBreak;
      if (r.shift) local.BaselineShift = r.shift;
      if (r.trackAdd) local.Tracking = (diff.Tracking !== undefined ? diff.Tracking : eff.Tracking) + r.trackAdd;
      // Zeilenabstand größerer Läufe (wie CSS: Zeile wächst mit)
      const lh = lineHeightPt(r.s);
      if (lh > p.leading + 0.5 && Math.abs(S[r.s].sizePx * 0.75 - eff.PointSize) > 0.01 && p.lines.length < 2) local.Leading = r2(lh);
      r.local = local;
      if (Object.keys(diff).length) {
        const ck = semanticKey(S[r.s]);
        const cname = NAMES.zeichen[ck] || NAMES.zeichen[ck.split(' ').pop()] || germanName(ck, 'char');
        const k = cname + '§' + JSON.stringify(Object.entries(diff).sort());
        if (!charGroups.has(k)) charGroups.set(k, { key: cname, diff, runs: [] });
        charGroups.get(k).runs.push(r);
      }
    });
  });
  const charStyles = [];
  const cByKey = new Map();
  charGroups.forEach((g) => { if (!cByKey.has(g.key)) cByKey.set(g.key, []); cByKey.get(g.key).push(g); });
  const usedC = new Set();
  [...cByKey].sort((x, y) => y[1].reduce((n, g) => n + g.runs.length, 0) - x[1].reduce((n, g) => n + g.runs.length, 0)).forEach(([key, gs]) => {
    gs.sort((a, b) => b.runs.length - a.runs.length);
    const base = key;
    gs.forEach((g, i) => {
      const d = g.diff, m = gs[0].diff;
      let label = base;
      if (i > 0 || usedC.has(base)) {
        // alle unterscheidenden Merkmale gegenüber der Hauptvariante (statt „… 2“, „… 3“)
        const parts = [];
        if (d.FontStyle && d.FontStyle !== m.FontStyle) parts.push(d.FontStyle);
        if (d.PointSize && d.PointSize !== m.PointSize) parts.push(`${de(d.PointSize)} pt`);
        if (d.FillColor && d.FillColor !== m.FillColor) parts.push(swName(d.FillColor));
        if (d.Capitalization !== undefined && d.Capitalization !== m.Capitalization) parts.push(d.Capitalization === 'AllCaps' ? 'Versal' : d.Capitalization === 'Normal' ? 'gemischt' : 'Kapitälchen');
        if (d.OTFFigureStyle !== undefined && d.OTFFigureStyle !== m.OTFFigureStyle) parts.push(/Tabular/.test(d.OTFFigureStyle) ? 'Tabellenziffern' : 'Ziffern');
        if (d.Tracking !== undefined && d.Tracking !== m.Tracking) parts.push(`Laufweite ${d.Tracking}`);
        if (d.Underline !== undefined && d.Underline !== m.Underline) parts.push(d.Underline ? 'unterstrichen' : 'ohne Unterstreichung');
        if (!parts.length && d.FillColor) parts.push(swName(d.FillColor));
        if (parts.length) label = `${base} ${parts.slice(0, 2).join(' ')}`;   // höchstens zwei Merkmale, sonst unlesbar lang
      }
      const name = unique(usedC, label);
      const st = { self: 'CharacterStyle/' + name, name, attrs: g.diff, count: g.runs.length };
      charStyles.push(st);
      g.runs.forEach((r) => { r.cstyle = st; });
    });
  });
  const GENERIC_CHAR = new Set(Object.values(NAMES.zeichen).map((v) => v.split(' ')[0]));
  const cMerged = mergeStyles(charStyles, (s) => JSON.stringify(Object.entries(s.attrs).sort()), (from, to) => {
    allParas.forEach((p) => p.fruns.forEach((r) => { if (r.cstyle === from) r.cstyle = to; }));
  }, usedC, (n) => (GENERIC_CHAR.has(n.split(' ')[0]) ? 1 : 0));   // allgemeine Namen („Fett …“, „Betont …“) vor Bauteil-Namen
  charStyles.length = 0; charStyles.push(...cMerged);
  charStyles.sort((a, b) => a.name.localeCompare(b.name, 'de'));

  // Verwendete Schriften
  const usedFaces = new Map();
  const noteFace = (fam, st) => { usedFaces.set(`${fam}\u0000${st}`, { family: fam, style: st }); };
  paraStyles.forEach((s) => noteFace(s.attrs.AppliedFont, s.attrs.FontStyle));
  allParas.forEach((p) => { if (p.over.AppliedFont || p.over.FontStyle) noteFace(p.over.AppliedFont || p.style.attrs.AppliedFont, p.over.FontStyle || p.style.attrs.FontStyle); });
  charStyles.forEach((s) => { if (s.attrs.AppliedFont || s.attrs.FontStyle) { /* Kombination unten geprüft */ } });
  allParas.forEach((p) => p.fruns.forEach((r) => { const f = faceOf(r.s); noteFace(f.family, f.style); }));

  // ---- Musterseite: Fußzeilen-Objekte, die auf allen Seiten einer Seitenart (links/rechts) identisch sind -------------
  // (Linien, Logo, „Blatt“, automatische Seitenzahl, „Stand“) wandern auf die Musterseite „A-Inhalt“; seitenabhängige
  // Teile (Rubrik) bleiben auf der Seite. Druckbögen, auf denen eine Seitenfläche die Musterobjekte verdecken würde
  // (InDesign zeichnet Musterobjekte unter die Seitenobjekte derselben Ebene), behalten ihre Fußzeile und zeigen
  // keine Musterobjekte. Position und Aussehen bleiben identisch (dieselben Objekte, dieselben Koordinaten).
  const master = { left: [], right: [], spreadsWithout: new Set(), pages: new Set() };
  if (opts.masterItems !== false) {
    const pcmp = (a, b) => { for (let i = 0; i < 5; i++) if (a.paint[i] !== b.paint[i]) return a.paint[i] - b.paint[i]; return 0; };
    const ov = (a, b) => Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 0.01 && Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 0.01;
    // Rahmen mit automatischer Seitenzahl: Breite hängt von der Ziffernzahl ab → nur die Bezugskante zählt
    // (links-/rechtsbündig bzw. Mitte); auf der Musterseite bekommt der Rahmen die Vereinigung aller Breiten.
    const isFolio = (it) => it.kind === 'text' && it.frame.paras.some((p) => p.text.includes('\uE018'));
    const folioEdge = (it) => { const al = it.frame.paras[0].align; return al === 'RightAlign' ? it.x + it.w : al === 'CenterAlign' ? it.x + it.w / 2 : it.x; };
    const sigOf = (it) => {
      const g = [it.kind, it.layer, it.shape || '', ...(isFolio(it) ? [folioEdge(it), it.y, it.h] : [it.x, it.y, it.w, it.h]).map((v) => r2(v))].join('|');
      if (it.kind === 'text') {
        const F = it.frame;
        return g + '|' + JSON.stringify([F.firstBaseline, F.columns || 1, F.gutter || 0, it.ignoreWrap || false]) + F.paras.map((p) => p.style.name + JSON.stringify(p.over) +
          p.fruns.map((r) => r.text + '¤' + (r.cstyle ? r.cstyle.name : '') + JSON.stringify(r.local || {})).join('§')).join('¶');
      }
      if (it.kind === 'graphic') return g + '|' + it.link + JSON.stringify(it.content);
      if (it.kind === 'table') return null;
      return g + '|' + JSON.stringify([it.fill, it.stroke, it.radii, it.x1, it.y1, it.x2, it.y2, it.opacity, it.M, it.points, it.cap, it.wrap]);
    };
    // Seiten mit Fuß, deren Fußobjekte nicht von Seitenobjekten mit niedrigerer Malreihenfolge überdeckt werden
    const okPage = (pg) => {
      const foot = pg.items.filter((i) => i.foot);
      if (!foot.length) return false;
      // nur dieselbe Ebene zählt (Ebenen ordnen Muster- und Seitenobjekte gemeinsam)
      return !pg.items.some((o) => !o.foot && foot.some((f) => o.layer === f.layer && pcmp(o, f) < 0 && ov(o, f)));
    };
    // Druckbögen wie im Writer: [1], [2|3], …
    const spreadOf = (i) => (i === 0 ? 0 : Math.floor((i + 1) / 2));
    const bad = new Set();
    pages.forEach((pg, i) => { if (pg.items.some((x) => x.foot) && !okPage(pg)) bad.add(spreadOf(i)); });
    for (const side of [true, false]) {
      const cand = pages.filter((pg, i) => pg.left === side && pg.items.some((x) => x.foot) && !bad.has(spreadOf(i)));
      if (cand.length < 2) continue;
      const counts = cand.map((pg) => {
        const m = new Map();
        pg.items.filter((x) => x.foot).forEach((x) => { const k = sigOf(x); if (k) m.set(k, (m.get(k) || 0) + 1); });
        return m;
      });
      const common = [...counts[0].keys()].filter((k) => counts.every((m) => m.get(k) === counts[0].get(k)));
      if (!common.length) continue;
      const cs = new Set(common);
      master[side ? 'left' : 'right'] = cand[0].items.filter((x) => x.foot && cs.has(sigOf(x))).map((x) => {
        if (!isFolio(x)) return x;
        const same = cand.flatMap((pg) => pg.items.filter((y) => y.foot && sigOf(y) === sigOf(x)));
        const x0 = Math.min(...same.map((y) => y.x)), x1 = Math.max(...same.map((y) => y.x + y.w));
        return { ...x, x: x0, w: x1 - x0 };
      });
      cand.forEach((pg) => { pg.items = pg.items.filter((x) => !(x.foot && cs.has(sigOf(x)))); master.pages.add(pg.number); });
    }
    pages.forEach((pg, i) => { if (bad.has(spreadOf(i))) master.spreadsWithout.add(spreadOf(i)); });
  }

  if (prettyMiss.length) warnings.push(`text-wrap: pretty: ${prettyMiss.length} Absätze mit weniger Zeilen als beim gierigen Umbruch (${[...new Set(prettyMiss)].join(', ')}) – Zeilenfall in InDesign prüfen`);
  const pagesOf = (e) => [...e.pages].sort((a, b) => a - b).join(', ');
  glyphNotes.substituted.forEach((e) => warnings.push(`Glyphe ${cpName(e.cp)} fehlt in ${e.face} – durch ${cpName(e.alt)} ersetzt (S. ${pagesOf(e)}, ${e.n}×, „${e.sample}“)`));
  glyphNotes.missing.forEach((e) => errors.push(`Glyphe ${cpName(e.cp)} fehlt in ${e.face} und hat kein Ersatzzeichen (S. ${pagesOf(e)}, ${e.n}×, „${e.sample}“) – InDesign zeigt eine Fehlglyphe; Zeichen im HTML ersetzen oder in die Schrift aufnehmen`));
  return {
    // nur verwendete Farbfelder (Aliasse, Bildschirm-Tokens und Altbestände bleiben draußen), in Gruppenreihenfolge
    W, H, bleed, pages, swatches: sw.list.filter((s) => s.used > 0).sort((a, b) => a.rank - b.rank || b.used - a.used), swatchesAll: sw.list.length,
    paraStyles, baseStyles, charStyles, master, paraStylesBeforeMerge: nParaBefore,
    mergedStyles: paraStyles.concat(charStyles).filter((st) => st.mergedFrom).map((st) => ({ name: st.name, from: st.mergedFrom, kind: st.self.startsWith('Char') ? 'Zeichen' : 'Absatz' })), faces: fonts.faces, usedFaces: [...usedFaces.values()],
    errors, glyphs: { substituted: [...glyphNotes.substituted.values()], missing: [...glyphNotes.missing.values()] }, hyphenation: HYPHENATION,
    warnings: warnings.concat(fonts.warnings || []),
    stats: {
      masterItems: master.left.length + master.right.length,
      frames: pages.reduce((n, p) => n + p.items.filter((i) => i.kind === 'text').length, 0) + [...master.left, ...master.right].filter((i) => i.kind === 'text').length,
      paragraphs: allParas.length,
      tables: pages.reduce((n, p) => n + p.items.filter((i) => i.kind === 'table').length, 0),
      shapes: pages.reduce((n, p) => n + p.items.filter((i) => i.kind === 'shape' || i.kind === 'line').length, 0) + [...master.left, ...master.right].filter((i) => i.kind === 'shape' || i.kind === 'line').length,
      graphics: pages.reduce((n, p) => n + p.items.filter((i) => i.kind === 'graphic').length, 0) + [...master.left, ...master.right].filter((i) => i.kind === 'graphic').length,
      autoFolio, protectedWords, prettyParas, prettyBreaks, hangCells, widenedCells,
      widenedTables: pages.reduce((n, p) => n + p.items.filter((i) => i.kind === 'table' && i.table.widened).length, 0),
    },
  };
}

module.exports = { buildDocument, semanticKey, germanName };
