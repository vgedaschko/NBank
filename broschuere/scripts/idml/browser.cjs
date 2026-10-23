// Browser-seitige Teile des IDML-Exports. Jede exportierte Funktion ist in sich geschlossen (keine Closures über
// Modul-Variablen), weil Playwright sie als Quelltext in die Seite überträgt (page.evaluate(fn, arg)).
// Gemeinsame Hilfsfunktionen installiert installHelpers() als window.__idml.

/* eslint-disable no-var */

// ---------------------------------------------------------------------------------------------------------------
// 1 · Hilfsfunktionen in der Seite
// ---------------------------------------------------------------------------------------------------------------
function installHelpers() {
  const H = (window.__idml = window.__idml || {});
  if (H.ready) return;
  H.ready = true;

  H.parseColor = (s) => {
    if (!s || s === 'transparent' || s === 'none') return null;
    const m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
    if (m) {
      let a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
      return { r: Math.round(+m[1]), g: Math.round(+m[2]), b: Math.round(+m[3]), a };
    }
    // color(srgb r g b / a) o. ä.: über ein Canvas normalisieren
    const c = H._cv || (H._cv = document.createElement('canvas').getContext('2d'));
    c.fillStyle = '#000';
    c.fillStyle = s;
    const v = c.fillStyle;
    if (v.startsWith('#')) {
      const n = parseInt(v.slice(1), 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
    }
    const m2 = v.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/);
    if (m2) return { r: +m2[1], g: +m2[2], b: +m2[3], a: m2[4] === undefined ? 1 : +m2[4] };
    return null;
  };
  H.visibleColor = (c) => c && c.a > 0.004;

  H.SKIP_TAGS = new Set(['style', 'script', 'template', 'title', 'noscript', 'head', 'meta', 'link']);
  H.GRAPHIC_TAGS = new Set(['svg', 'img', 'canvas', 'video', 'picture', 'object', 'embed', 'iframe']);
  H.INLINE_DISPLAYS = new Set(['inline', 'inline-block', 'inline-flex', 'inline-grid', 'inline-table', 'contents', 'ruby', 'ruby-text', 'ruby-base']);
  H.ATOMIC_INLINE = new Set(['inline-block', 'inline-flex', 'inline-grid', 'inline-table']);

  // Unsichtbar für Sehende, aber im DOM (z. B. .u-sr, clip-path: inset(50%))
  H.isVisuallyHidden = (el, cs) => {
    if (cs.display === 'none') return true;
    if (parseFloat(cs.opacity) === 0) return true;
    if (/inset\(\s*50%/.test(cs.clipPath)) return true;
    if (cs.clip && /rect\(\s*0(px)?,?\s+0(px)?,?\s+0(px)?,?\s+0(px)?\s*\)/.test(cs.clip)) return true;
    if ((cs.position === 'absolute' || cs.position === 'fixed') && (cs.overflow === 'hidden' || cs.overflowX === 'hidden')) {
      const r = el.getBoundingClientRect();
      if (r.width <= 1.01 && r.height <= 1.01) return true;
    }
    return false;
  };

  // Schrift-Grundlinie: Abstand Oberkante Textfragment → Grundlinie für die Schrift eines Elements (gecacht)
  H._baseCache = new Map();
  H.baselineOffset = (cs) => {
    const key = [cs.fontFamily, cs.fontWeight, cs.fontStyle, cs.fontSize, cs.fontStretch, cs.fontVariationSettings, cs.fontOpticalSizing].join('|');
    if (H._baseCache.has(key)) return H._baseCache.get(key);
    let host = H._probeHost;
    if (!host) {
      host = H._probeHost = document.createElement('div');
      host.setAttribute('data-idml-probe', '');
      host.style.cssText = 'position:absolute;left:-20000px;top:0;visibility:hidden;white-space:nowrap;line-height:normal;letter-spacing:normal;text-transform:none';
      document.body.appendChild(host);
    }
    const sp = document.createElement('span');
    for (const p of ['font-family', 'font-weight', 'font-style', 'font-size', 'font-stretch', 'font-variation-settings', 'font-optical-sizing', 'font-synthesis']) {
      sp.style.setProperty(p, cs.getPropertyValue(p), 'important');
    }
    sp.style.lineHeight = 'normal';
    sp.textContent = 'Hxg';
    const ib = document.createElement('span');
    ib.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline;margin:0;padding:0;border:0';
    sp.appendChild(ib);
    host.appendChild(sp);
    const rg = document.createRange();
    rg.setStart(sp.firstChild, 0); rg.setEnd(sp.firstChild, 1);
    const tr = rg.getClientRects()[0];
    const off = ib.getBoundingClientRect().bottom - tr.top;
    const res = { off, h: tr.height };
    sp.remove();
    H._baseCache.set(key, res);
    return res;
  };

  // Zähler (counter()) für ::before/::after auswerten
  H.counterValue = (el, name) => {
    const parsePairs = (s, dflt) => {
      const out = new Map();
      if (!s || s === 'none') return out;
      const t = s.trim().split(/\s+/);
      for (let i = 0; i < t.length; i++) {
        const n = t[i];
        const v = i + 1 < t.length && /^-?\d+$/.test(t[i + 1]) ? parseInt(t[++i], 10) : dflt;
        out.set(n, v);
      }
      return out;
    };
    // Reset-Element suchen: Vorfahr-oder-selbst bzw. deren vorangehende Geschwister
    let reset = null, resetVal = 0;
    for (let a = el; a && !reset; a = a.parentElement) {
      for (let s = a; s; s = s.previousElementSibling) {
        const m = parsePairs(getComputedStyle(s).counterReset, 0);
        if (m.has(name)) { reset = s; resetVal = m.get(name); break; }
      }
    }
    if (!reset) return 0;
    const scopeRoot = reset.parentElement || document.documentElement;
    const all = scopeRoot.querySelectorAll('*');
    let v = resetVal, started = false;
    for (const e of all) {
      if (e === reset) started = true;
      if (!started) continue;
      if (getComputedStyle(e).display !== 'none') {
        const inc = parsePairs(getComputedStyle(e).counterIncrement, 1);
        if (inc.has(name)) v += inc.get(name);
      }
      if (e === el) break;
    }
    return v;
  };
  H.formatCounter = (n, style) => {
    style = (style || 'decimal').trim();
    const roman = (x, up) => {
      const t = [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
      let s = '';
      for (const [v, r] of t) while (x >= v) { s += r; x -= v; }
      return up ? s.toUpperCase() : s;
    };
    const alpha = (x, up) => { let s = ''; while (x > 0) { x--; s = String.fromCharCode(97 + (x % 26)) + s; x = Math.floor(x / 26); } return up ? s.toUpperCase() : s; };
    switch (style) {
      case 'decimal-leading-zero': return (n < 10 && n >= 0 ? '0' : '') + n;
      case 'lower-roman': return roman(n, false);
      case 'upper-roman': return roman(n, true);
      case 'lower-alpha': case 'lower-latin': return alpha(n, false);
      case 'upper-alpha': case 'upper-latin': return alpha(n, true);
      case 'none': return '';
      default: return String(n);
    }
  };
  // content-Wert eines Pseudo-Elements in Text auflösen (Strings, counter(), attr(), Anführungszeichen)
  H.resolveContent = (content, el) => {
    if (!content || content === 'none' || content === 'normal') return null;
    let out = '', i = 0;
    while (i < content.length) {
      const ch = content[i];
      if (ch === '"' || ch === "'") {
        let j = i + 1, s = '';
        while (j < content.length && content[j] !== ch) {
          if (content[j] === '\\') {
            const hex = content.slice(j + 1).match(/^[0-9a-fA-F]{1,6}\s?/);
            if (hex) { s += String.fromCodePoint(parseInt(hex[0], 16)); j += 1 + hex[0].length; continue; }
            s += content[j + 1]; j += 2; continue;
          }
          s += content[j++];
        }
        out += s; i = j + 1; continue;
      }
      const m = content.slice(i).match(/^(counters?)\(\s*([\w-]+)\s*(?:,\s*("[^"]*"|[\w-]+))?\s*(?:,\s*([\w-]+))?\s*\)/);
      if (m) {
        const style = m[1] === 'counter' ? m[3] : m[4];
        out += H.formatCounter(H.counterValue(el, m[2]), style);
        i += m[0].length; continue;
      }
      const a = content.slice(i).match(/^attr\(\s*([\w-]+)\s*\)/);
      if (a) { out += el.getAttribute(a[1]) || ''; i += a[0].length; continue; }
      const q = content.slice(i).match(/^(open-quote|close-quote|no-open-quote|no-close-quote)/);
      if (q) { out += q[1] === 'open-quote' ? '„' : q[1] === 'close-quote' ? '“' : ''; i += q[0].length; continue; }
      i++;
    }
    return out;
  };

  // Lineare 2D-Matrix (a b c d) aller Transformationen vom Element bis zur Seite (Verschiebungen stecken im Rechteck)
  H.linearMatrix = (el, stop) => {
    let M = [1, 0, 0, 1];
    const chain = [];
    for (let e = el; e && e !== stop.parentElement; e = e.parentElement) chain.push(e);
    chain.reverse();                                   // äußerstes zuerst
    for (const e of chain) {
      const t = getComputedStyle(e).transform;
      if (!t || t === 'none') continue;
      const m = t.match(/^matrix\(([^)]+)\)$/);
      let L = null;
      if (m) { const v = m[1].split(',').map(Number); L = [v[0], v[1], v[2], v[3]]; }
      const m3 = t.match(/^matrix3d\(([^)]+)\)$/);
      if (m3) { const v = m3[1].split(',').map(Number); L = [v[0], v[1], v[4], v[5]]; }
      if (!L) continue;
      // M := M · L
      M = [M[0] * L[0] + M[2] * L[1], M[1] * L[0] + M[3] * L[1], M[0] * L[2] + M[2] * L[3], M[1] * L[2] + M[3] * L[3]];
    }
    return M;
  };
  H.isIdentity = (M) => Math.abs(M[0] - 1) < 1e-4 && Math.abs(M[1]) < 1e-4 && Math.abs(M[2]) < 1e-4 && Math.abs(M[3] - 1) < 1e-4;
}

// ---------------------------------------------------------------------------------------------------------------
// 2 · Vorbereitung: Pseudo-Elemente als echte Elemente, Original-Schriften merken
// ---------------------------------------------------------------------------------------------------------------
function prepare(opts) {
  const H = window.__idml;
  const pageSel = opts.pageSelector;
  const elsBefore = [...document.querySelectorAll(pageSel + ', ' + pageSel + ' *')];
  const snap = () => elsBefore.map((el) => {
    const r = el.getBoundingClientRect();
    return [r.left, r.top, r.width, r.height];
  });
  const before = snap();

  // 2a · ::before/::after materialisieren (nur Inhalte, die tatsächlich gesetzt werden)
  let pseudos = 0;
  const jobs = [];
  for (const el of elsBefore) {
    if (H.SKIP_TAGS.has(el.localName) || el.closest('svg')) continue;
    for (const pseudo of ['::before', '::after']) {
      const cs = getComputedStyle(el, pseudo);
      if (!cs.content || cs.content === 'none' || cs.content === 'normal' || cs.display === 'none') continue;
      const text = H.resolveContent(cs.content, el);
      if (text === null) continue;
      const props = [];
      for (let i = 0; i < cs.length; i++) {
        const p = cs[i];
        if (p === 'content' || p.startsWith('counter-') || p === '-webkit-border-image' || p.startsWith('-webkit-mask-box-image')) continue;   // Alt-Kurzformen setzen sonst „fill“
        props.push([p, cs.getPropertyValue(p)]);
      }
      jobs.push({ el, pseudo, text, props });
    }
  }
  for (const j of jobs) {
    const sp = document.createElement('idml-pseudo');
    for (const [p, v] of j.props) sp.style.setProperty(p, v);
    sp.setAttribute('data-idml-pseudo', j.pseudo === '::before' ? 'before' : 'after');
    sp.setAttribute('aria-hidden', 'true');
    if (j.text) sp.textContent = j.text;
    if (j.pseudo === '::before') { j.el.insertBefore(sp, j.el.firstChild); j.el.setAttribute('data-idml-pb', ''); }
    else { j.el.appendChild(sp); j.el.setAttribute('data-idml-pa', ''); }
    pseudos++;
  }
  const st = document.createElement('style');
  st.textContent = '[data-idml-pb]::before{content:none!important;display:none!important}[data-idml-pa]::after{content:none!important;display:none!important}';
  document.head.appendChild(st);
  document.body.offsetHeight;

  // 2b · Original-Schrift je Element (vor der Zuordnung statischer Instanzen) merken
  const fontOrig = (H.fontOrig = new WeakMap());
  for (const el of document.querySelectorAll(pageSel + ', ' + pageSel + ' *')) {
    const cs = getComputedStyle(el);
    const fvs = {};
    if (cs.fontVariationSettings && cs.fontVariationSettings !== 'normal') {
      cs.fontVariationSettings.split(',').forEach((p) => {
        const m = p.trim().match(/^["'](\w{4})["']\s+(-?[\d.]+)/);
        if (m) fvs[m[1]] = Number(m[2]);
      });
    }
    fontOrig.set(el, {
      family: cs.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, ''),
      weight: Math.round(Number(cs.fontWeight)) || 400,
      italic: cs.fontStyle === 'italic' || cs.fontStyle.startsWith('oblique'),
      sizePx: parseFloat(cs.fontSize),
      opticalAuto: cs.fontOpticalSizing !== 'none',
      fvs,
    });
  }

  const after = snap();
  let moved = 0, max = 0;
  for (let i = 0; i < before.length; i++) {
    const d = Math.max(...before[i].map((v, k) => Math.abs(v - after[i][k])));
    if (d > 0.5) { moved++; max = Math.max(max, d); }
  }
  return { pseudos, moved, maxShift: Math.round(max * 100) / 100 };
}

// ---------------------------------------------------------------------------------------------------------------
// 3 · Extraktion: Seiten, Farb-Tokens, Flächen/Linien, Grafiken, Absätze, Tabellen
// ---------------------------------------------------------------------------------------------------------------
function extract(opts) {
  const H = window.__idml;
  const PT = 0.75;
  const round = (v, n = 3) => Math.round(v * 10 ** n) / 10 ** n;
  const docEls = [...document.querySelectorAll('*')];
  const treeIndex = new Map(docEls.map((e, i) => [e, i]));
  const csCache = new Map();
  const CS = (el) => { let c = csCache.get(el); if (!c) { c = getComputedStyle(el); csCache.set(el, c); } return c; };
  // Elemente des Seitenfußes (Kandidaten für die Musterseite)
  const inFoot = (el) => !!(opts.footSelector && el.closest && el.closest(opts.footSelector));

  // 3a · Farb-Tokens aus :root-Regeln (Reihenfolge der Deklaration)
  const tokens = [];
  const seen = new Set();
  const rootCS = getComputedStyle(document.documentElement);
  const probe = document.createElement('div');
  document.body.appendChild(probe);
  const visitRules = (rules) => {
    for (const r of rules) {
      if (r.cssRules && !r.selectorText) { try { visitRules(r.cssRules); } catch (e) { /* */ } continue; }
      if (!r.selectorText || !r.style) continue;
      if (!r.selectorText.split(',').some((s) => s.trim() === ':root')) continue;
      for (let i = 0; i < r.style.length; i++) {
        const name = r.style[i];
        if (!name.startsWith('--') || seen.has(name)) continue;
        const raw = r.style.getPropertyValue(name).trim();
        const val = rootCS.getPropertyValue(name).trim();
        probe.style.color = '';
        probe.style.color = val;
        if (!probe.style.color) continue;
        const c = H.parseColor(getComputedStyle(probe).color);
        if (!c) continue;
        seen.add(name);
        tokens.push({ name: name.slice(2), ...c, alias: /var\(/.test(raw) });
      }
    }
  };
  for (const sh of document.styleSheets) { try { visitRules(sh.cssRules); } catch (e) { /* fremde Stylesheets */ } }
  probe.remove();

  // 3b · @font-face-Quellen (für die Desktop-Schriften)
  const fontFaces = [];
  const visitFF = (rules, base) => {
    for (const r of rules) {
      if (r.cssRules && !(r instanceof CSSFontFaceRule)) { try { visitFF(r.cssRules, base); } catch (e) { /* */ } continue; }
      if (!(r instanceof CSSFontFaceRule)) continue;
      const fam = r.style.getPropertyValue('font-family').trim().replace(/^["']|["']$/g, '');
      const src = r.style.getPropertyValue('src');
      const urls = [...src.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map((m) => new URL(m[1], base).href);
      fontFaces.push({
        family: fam, style: (r.style.getPropertyValue('font-style') || 'normal').trim(),
        weight: (r.style.getPropertyValue('font-weight') || '400').trim(),
        unicodeRange: (r.style.getPropertyValue('unicode-range') || '').trim(), urls,
      });
    }
  };
  for (const sh of document.styleSheets) { try { visitFF(sh.cssRules, sh.href || location.href); } catch (e) { /* */ } }

  const pages = [...document.querySelectorAll(opts.pageSelector)];
  const out = { tokens, fontFaces, pages: [], fontsUsed: [], warnings: [] };
  const fontUse = new Map();   // Schlüssel → Zeichenanzahl (für Schnitt-Bündelung)
  const styleInfo = new Map(); // Element → Stil-Datensatz (Index in out.styles)
  out.styles = [];
  let gCount = 0, dCount = 0;

  const semClasses = (el) => [...el.classList];
  const styleOf = (el) => {
    if (styleInfo.has(el)) return styleInfo.get(el);
    const cs = CS(el);
    const f = H.fontOrig.get(el) || { family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), weight: +cs.fontWeight, italic: cs.fontStyle === 'italic', sizePx: parseFloat(cs.fontSize), opticalAuto: true, fvs: {} };
    const lh = cs.lineHeight === 'normal' ? null : parseFloat(cs.lineHeight);
    const ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing);
    const s = {
      tag: el.localName, cls: semClasses(el), parentCls: el.parentElement ? semClasses(el.parentElement) : [], parentTag: el.parentElement ? el.parentElement.localName : '',
      family: f.family, weight: f.weight, italic: f.italic, sizePx: f.sizePx, opticalAuto: f.opticalAuto, fvs: f.fvs,
      lineHeightPx: lh, letterSpacingPx: ls, color: H.parseColor(cs.color), textTransform: cs.textTransform,
      caps: cs.fontVariantCaps, numeric: cs.fontVariantNumeric, features: cs.fontFeatureSettings,
      decoration: cs.textDecorationLine, verticalAlign: cs.verticalAlign, whiteSpace: cs.whiteSpace,
      textAlign: cs.textAlign, hyphens: cs.hyphens || cs.webkitHyphens, textIndentPx: parseFloat(cs.textIndent) || 0,
      breakInside: cs.breakInside, lang: (el.closest('[lang]') || document.documentElement).getAttribute('lang') || '',
      section: (el.closest('thead, tbody, tfoot') || {}).localName || '',
    };
    const idx = out.styles.length;
    out.styles.push(s);
    styleInfo.set(el, idx);
    return idx;
  };

  // Effektive Deckkraft (Produkt bis zur Seite)
  const opacityOf = (el, page) => {
    let o = 1;
    for (let e = el; e && e !== page.parentElement; e = e.parentElement) o *= parseFloat(CS(e).opacity);
    return o;
  };
  // Malreihenfolge (vereinfachtes CSS-Stapelmodell)
  const paintKey = (el, page, phase) => {
    let z = 0, posRoot = -1;
    for (let e = el; e && e !== page; e = e.parentElement) {
      const cs = CS(e);
      if (cs.position !== 'static') {
        posRoot = treeIndex.get(e);
        if (cs.zIndex !== 'auto') z = parseInt(cs.zIndex, 10) || 0;
      }
    }
    return [z, posRoot >= 0 ? 1 : 0, posRoot, phase, treeIndex.get(el)];
  };

  pages.forEach((page, pIdx) => {
    const P = page.getBoundingClientRect();
    const pcs = CS(page);
    const pg = {
      index: pIdx, number: Number(page.dataset.page) || pIdx + 1,
      w: P.width * PT, h: P.height * PT,
      bg: H.parseColor(pcs.backgroundColor),
      margins: { top: parseFloat(pcs.paddingTop) * PT, bottom: parseFloat(pcs.paddingBottom) * PT, left: parseFloat(pcs.paddingLeft) * PT, right: parseFloat(pcs.paddingRight) * PT },
      boxes: [], graphics: [], decors: [], paragraphs: [], tables: [], wraps: [],
    };
    out.pages.push(pg);
    const rel = (r) => ({ x: (r.left - P.left) * PT, y: (r.top - P.top) * PT, w: r.width * PT, h: r.height * PT });
    const tol = (opts.bleedTolMm || 0.8) * 96 / 25.4;
    const edgesOf = (r) => ({ l: r.left - P.left < tol, r: P.right - r.right < tol, t: r.top - P.top < tol, b: P.bottom - r.bottom < tol });

    const rowVisible = (r) => {
      for (let e = r; e && e !== r.closest('table'); e = e.parentElement) {
        const cs = CS(e);
        if (cs.display === 'none' || H.isVisuallyHidden(e, cs) || cs.position === 'absolute' || cs.position === 'fixed') return false;
      }
      return r.getBoundingClientRect().height > 0.5;
    };
    // Native Tabellen bestimmen
    const nativeTables = new Set();
    if (opts.tables !== 'frames') {
      page.querySelectorAll('table').forEach((t) => {
        if (CS(t).display !== 'table' || H.isVisuallyHidden(t, CS(t))) return;
        if (t.querySelector('table')) return;                                   // verschachtelt → Rahmen je Zelle
        const rows = [...t.rows].filter(rowVisible);
        if (!rows.length) return;
        const ok = rows.every((r) => CS(r).display === 'table-row' && [...r.cells].every((c) => CS(c).display === 'table-cell'));
        if (ok) nativeTables.add(t);
      });
    }
    const tableParts = new Set();
    nativeTables.forEach((t) => {
      tableParts.add(t);
      t.querySelectorAll('thead, tbody, tfoot, tr, td, th, caption, colgroup, col').forEach((e) => { if (e.closest('table') === t) tableParts.add(e); });
    });
    const cellOf = (el) => { const c = el.closest('td, th'); return c && nativeTables.has(c.closest('table')) ? c : null; };

    // ---- Dekoration (Flächen, Linien, Formen) ------------------------------------------------------------------
    const consumed = new Set();   // Elemente, deren Text in einen umgebenden Absatz eingeflossen ist
    const decorate = (el, cs, inGraphicDecorList) => {
      if (cs.visibility !== 'visible') return;
      const isTablePart = tableParts.has(el) && el.localName !== 'table' && el.localName !== 'caption';
      if (isTablePart) return;
      const bg = H.parseColor(cs.backgroundColor);
      const hasBg = H.visibleColor(bg);
      const bgImg = cs.backgroundImage && cs.backgroundImage !== 'none';
      const sides = ['top', 'right', 'bottom', 'left'].map((s) => {
        const w = parseFloat(cs.getPropertyValue(`border-${s}-width`)) || 0;
        const style = cs.getPropertyValue(`border-${s}-style`);
        const color = H.parseColor(cs.getPropertyValue(`border-${s}-color`));
        return w > 0 && style !== 'none' && style !== 'hidden' && H.visibleColor(color) ? { w, style, color } : null;
      });
      const anyBorder = sides.some(Boolean);
      const borderImg = cs.borderImageSource && cs.borderImageSource !== 'none';
      const shadow = cs.boxShadow && cs.boxShadow !== 'none';
      const outlineW = cs.outlineStyle !== 'none' ? parseFloat(cs.outlineWidth) || 0 : 0;
      const outlineC = outlineW ? H.parseColor(cs.outlineColor) : null;
      if (!hasBg && !bgImg && !anyBorder && !borderImg && !(shadow) && !(outlineW && H.visibleColor(outlineC))) return;
      const isInline = cs.display === 'inline';
      const r0 = el.getBoundingClientRect();
      if (r0.width < 0.01 && r0.height < 0.01) return;
      const opacity = opacityOf(el, page);
      const clip = cs.clipPath && cs.clipPath !== 'none' ? cs.clipPath : null;
      const shadowSimple = shadow ? parseSpreadShadows(cs.boxShadow) : [];
      const complex = bgImg || borderImg || (clip && !/^polygon\(/.test(clip)) || (shadow && shadowSimple === null);
      const phase = isInline || H.ATOMIC_INLINE.has(cs.display) ? 1 : 0;
      if (complex) {
        // als Grafik (PDF) rendern: Hintergrund/Rahmen ohne Inhalt
        const id = ++dCount;
        el.setAttribute('data-idml-d', String(id));
        const r = r0;
        // randabfallend erweiterbar (Beschnittzugabe durch Vergrößern der Box): nur reine Hintergrundflächen
        const round0 = ['top-left', 'top-right', 'bottom-right', 'bottom-left'].every((c) => !parseFloat(cs.getPropertyValue(`border-${c}-radius`)));
        const growable = bgImg && !anyBorder && !borderImg && !clip && !shadow && round0 && H.isIdentity(H.linearMatrix(el, page));
        // Signatur des Aussehens: gleiche Flächen (z. B. Logo in jeder Fußzeile) werden nur einmal gerendert
        const sig = ['background-image', 'background-size', 'background-position', 'background-repeat', 'background-color', 'background-origin', 'background-clip',
          'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset', 'border-image-repeat', 'clip-path', 'box-shadow',
          'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
          ...['top', 'right', 'bottom', 'left'].flatMap((s) => [`border-${s}-width`, `border-${s}-style`, `border-${s}-color`]), 'transform', 'opacity', 'filter', 'mix-blend-mode']
          .map((p) => cs.getPropertyValue(p)).join('|') + `|${r.width.toFixed(2)}x${r.height.toFixed(2)}`;
        pg.decors.push({ id, ...rel(r), edges: edgesOf(r), paint: paintKey(el, page, phase), opacity: 1, cls: semClasses(el), tag: el.localName, why: bgImg ? 'background-image' : borderImg ? 'border-image' : clip ? 'clip-path' : 'box-shadow', growable, sig,
          parentCls: el.parentElement ? semClasses(el.parentElement) : [], foot: inFoot(el) });
        return;
      }
      const M = H.linearMatrix(el, page);
      const bw = cs.boxSizing === 'border-box' ? parseFloat(cs.width) : parseFloat(cs.width) + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
      const bh = cs.boxSizing === 'border-box' ? parseFloat(cs.height) : parseFloat(cs.height) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
      const boxW = isInline || !(bw > 0) ? r0.width : bw, boxH = isInline || !(bh > 0) ? r0.height : bh;
      const radii = ['top-left', 'top-right', 'bottom-right', 'bottom-left'].map((c) => {
        const v = cs.getPropertyValue(`border-${c}-radius`).split(' ')[0];
        return Math.min(v.endsWith('%') ? (parseFloat(v) / 100) * Math.min(boxW, boxH) : parseFloat(v) || 0, Math.min(boxW, boxH) / 2);
      });
      const frags = isInline ? [...el.getClientRects()].filter((r) => r.width > 0.01 && r.height > 0.01) : [r0];
      frags.forEach((r, fi) => {
        let geom;
        if (!H.isIdentity(M) && !isInline) {
          // Untransformierte Größe + lineare Matrix; Mittelpunkt aus dem Hüllrechteck
          const w = cs.boxSizing === 'border-box' ? parseFloat(cs.width) : parseFloat(cs.width) + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
          const h = cs.boxSizing === 'border-box' ? parseFloat(cs.height) : parseFloat(cs.height) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
          const cx = (r.left + r.width / 2 - P.left) * PT, cy = (r.top + r.height / 2 - P.top) * PT;
          geom = { x: cx - (w * PT) / 2, y: cy - (h * PT) / 2, w: w * PT, h: h * PT, M: M.map((v) => round(v, 6)) };
        } else {
          geom = rel(r);
        }
        const fsides = isInline ? sides.map((s, k) => (k === 3 && fi > 0) || (k === 1 && fi < frags.length - 1) ? null : s) : sides;
        const item = {
          ...geom, edges: geom.M ? { l: false, r: false, t: false, b: false } : edgesOf(r), opacity,
          fill: hasBg ? bg : null, sides: fsides.map((s) => s && { w: s.w * PT, style: s.style, color: s.color }),
          radii: radii.map((v) => v * PT), paint: paintKey(el, page, phase), cls: semClasses(el), tag: el.localName,
          inCell: !!cellOf(el),
          // für sprechende Objektnamen (Pseudo-Elemente nach Elternelement)
          parentCls: el.parentElement ? semClasses(el.parentElement) : [], parentTag: el.parentElement ? el.parentElement.localName : '',
          gparentCls: el.parentElement && el.parentElement.parentElement ? semClasses(el.parentElement.parentElement) : [],
        };
        if (clip && /^polygon\(/.test(clip)) item.polygon = parsePolygon(clip, geom.w / PT, geom.h / PT).map(([x, y]) => [x * PT, y * PT]);
        if (shadowSimple && shadowSimple.length) item.spreadShadows = shadowSimple.map((s) => ({ spread: s.spread * PT, color: s.color, inset: s.inset }));
        if (outlineW && H.visibleColor(outlineC)) item.outline = { w: outlineW * PT, color: outlineC, offset: (parseFloat(cs.outlineOffset) || 0) * PT };
        item.foot = inFoot(el);
        pg.boxes.push(item);
      });
    };
    function parsePolygon(s, w, h) {
      const body = s.replace(/^polygon\(\s*(nonzero|evenodd)?\s*,?/, '').replace(/\)\s*[\w-]*\s*$/, '');
      return body.split(',').map((pt) => {
        const [a, b] = pt.trim().split(/\s+/);
        const v = (t, ref) => t.endsWith('%') ? (parseFloat(t) / 100) * ref : parseFloat(t);
        return [v(a, w), v(b, h)];
      });
    }
    // box-shadow nur mit Ausdehnung (0 0 0 Xpx Farbe) → Fläche außen bzw. (inset) Kontur innen; sonst null (= komplex)
    function parseSpreadShadows(s) {
      const parts = s.split(/,(?![^(]*\))/);
      const res = [];
      for (const p of parts) {
        const color = H.parseColor((p.match(/rgba?\([^)]*\)/) || [])[0]);
        const inset = /\binset\b/.test(p);
        const nums = p.replace(/rgba?\([^)]*\)/, '').replace(/\binset\b/, '').trim().split(/\s+/).filter(Boolean);
        const v = nums.map(parseFloat);
        if (v.length < 4 || v[0] || v[1] || v[2]) return null;
        if (v[3] > 0 && H.visibleColor(color)) res.push({ spread: v[3], color, inset });   // unsichtbare Schatten entfallen
      }
      return res;
    }

    // ---- Grafiken ------------------------------------------------------------------------------------------------
    const addGraphic = (el, cs) => {
      const r = el.getBoundingClientRect();
      if (r.width < 0.5 || r.height < 0.5 || cs.visibility !== 'visible') return;
      const id = ++gCount;
      el.setAttribute('data-idml-g', String(id));
      const phase = H.INLINE_DISPLAYS.has(cs.display) ? 2 : 0;
      const label = el.getAttribute('aria-label') || (el.querySelector && el.querySelector('title') ? el.querySelector('title').textContent : '') || el.getAttribute('alt') || '';
      const cls = semClasses(el).concat(el.parentElement ? semClasses(el.parentElement) : []);
      const M = H.linearMatrix(el, page);
      const ink = H.isIdentity(M) ? inkOverflow(el, cs, r) : null;
      pg.graphics.push({ id, ...rel(r), edges: edgesOf(r), paint: paintKey(el, page, phase), tag: el.localName, cls, label: label.slice(0, 200), rotated: !H.isIdentity(M), inCell: !!cellOf(el), opacity: opacityOf(el, page), foot: inFoot(el), ...(ink ? { ink } : {}) });
    };
    // Sichtbarer Überstand eines Inline-SVG (overflow: visible) über die eigene Box in px: Vereinigung der Rechtecke
    // aller Grafikelemente (+ halbe Konturstärke), beschnitten mit den Clip-Kästen der Vorfahren (overflow ≠ visible).
    // Ohne diesen Zuschlag schneidet das Link-PDF Beschriftungen ab, die im HTML über die SVG-Box ragen.
    function inkOverflow(el, cs, r) {
      if (el.localName !== 'svg') return null;
      if (cs.overflowX !== 'visible' && cs.overflowY !== 'visible') return null;
      let x0 = r.left, y0 = r.top, x1 = r.right, y1 = r.bottom;
      for (const e of el.querySelectorAll('*')) {
        if (!(e instanceof SVGGraphicsElement) || e.localName === 'g' || e.localName === 'svg' || e.localName === 'a') continue;
        if (e.closest('defs, clipPath, mask, marker, pattern, symbol')) continue;
        const ecs = getComputedStyle(e);
        if (ecs.display === 'none' || ecs.visibility !== 'visible' || parseFloat(ecs.opacity) === 0) continue;
        const q = e.getBoundingClientRect();
        if (q.width < 0.01 && q.height < 0.01) continue;
        let g = 0;
        if (ecs.stroke && ecs.stroke !== 'none' && (parseFloat(ecs.strokeOpacity) || 0) > 0) {
          const ctm = e.getScreenCTM ? e.getScreenCTM() : null;
          const sc = ctm ? Math.hypot(ctm.a, ctm.b) : 1;
          g = ((parseFloat(ecs.strokeWidth) || 0) / 2) * sc * (ecs.strokeLinecap === 'square' || ecs.strokeLinejoin === 'miter' ? 1.5 : 1);
        }
        x0 = Math.min(x0, q.left - g); y0 = Math.min(y0, q.top - g); x1 = Math.max(x1, q.right + g); y1 = Math.max(y1, q.bottom + g);
      }
      if (cs.overflowX !== 'visible') { x0 = Math.max(x0, r.left); x1 = Math.min(x1, r.right); }
      if (cs.overflowY !== 'visible') { y0 = Math.max(y0, r.top); y1 = Math.min(y1, r.bottom); }
      for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
        const acs = CS(a);
        const cx = acs.overflowX !== 'visible' || /paint|strict|content/.test(acs.contain || '');
        const cy = acs.overflowY !== 'visible' || /paint|strict|content/.test(acs.contain || '');
        if (!cx && !cy) continue;
        const ar = a.getBoundingClientRect();
        const pl = ar.left + parseFloat(acs.borderLeftWidth), pr = ar.right - parseFloat(acs.borderRightWidth);
        const pt = ar.top + parseFloat(acs.borderTopWidth), pb = ar.bottom - parseFloat(acs.borderBottomWidth);
        if (cx) { x0 = Math.max(x0, pl); x1 = Math.min(x1, pr); }
        if (cy) { y0 = Math.max(y0, pt); y1 = Math.min(y1, pb); }
      }
      // 1 px Sicherheitszugabe (Kantenglättung, Glyphenüberhänge) nur an Seiten mit echtem Überstand
      const o = (v) => (v > 0.25 ? Math.ceil((v + 1) * 4) / 4 : 0);
      const ink = { l: o(r.left - x0), t: o(r.top - y0), r: o(x1 - r.right), b: o(y1 - r.bottom) };
      return ink.l || ink.t || ink.r || ink.b ? ink : null;
    }

    // ---- Text: Absätze aus Inline-Inhalten von Blockcontainern ------------------------------------------------------
    const isInlineLevel = (cs) => H.INLINE_DISPLAYS.has(cs.display) && cs.position !== 'absolute' && cs.position !== 'fixed' && cs.float === 'none';
    const lineHeightOf = (el) => { const cs = CS(el); return parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2; };
    // Atomares Inline-Element (inline-block/-flex …) einzeilig und ohne echte Blöcke → Text fließt in den Absatz ein
    const flattenable = (el, cs, parentEl) => {
      if (!H.ATOMIC_INLINE.has(cs.display)) return true;
      if (cs.display === 'inline-table') return false;
      const r = el.getBoundingClientRect();
      if (r.height > lineHeightOf(parentEl) * 1.6 + 2) return false;
      for (const d of el.querySelectorAll('*')) {
        if (H.GRAPHIC_TAGS.has(d.localName) || d.closest('svg')) continue;
        const dcs = CS(d);
        if (dcs.display === 'none') continue;
        if (dcs.position === 'absolute' || dcs.position === 'fixed') return false;
        if (/^(table|list-item|grid|flex)$/.test(dcs.display) && d.parentElement !== el) return false;
      }
      return true;
    };

    const collect = (container, node, acc, styleEl) => {
      for (const ch of node.childNodes) {
        if (ch.nodeType === 3) {
          if (ch.nodeValue.length) acc.cur.items.push({ t: ch, el: styleEl });
          continue;
        }
        if (ch.nodeType !== 1) continue;
        const tag = ch.localName;
        if (H.SKIP_TAGS.has(tag) || ch.hasAttribute('data-idml-probe')) continue;
        const cs = CS(ch);
        if (cs.display === 'none' || H.isVisuallyHidden(ch, cs)) continue;
        if (tag === 'br') { acc.cur.items.push({ br: true, el: styleEl }); continue; }
        if (H.GRAPHIC_TAGS.has(tag)) { acc.cur.items.push({ obj: ch, w: inlineSpace(ch, cs) }); continue; }
        if (isInlineLevel(cs)) {
          const atomic = H.ATOMIC_INLINE.has(cs.display);
          // leerer Inline-Block (Farbmarke, Platzhalter): Breite im Text freihalten wie eine Inline-Grafik
          if (atomic && !/\S/.test(ch.textContent) && !ch.querySelector('svg, img, canvas')) {
            consumed.add(ch); ch.querySelectorAll('*').forEach((d) => consumed.add(d));
            acc.cur.items.push({ obj: ch, w: inlineSpace(ch, cs) });
            continue;
          }
          if (cs.display === 'contents' || cs.display === 'inline' || flattenable(ch, cs, node)) {
            if (atomic) { ch.querySelectorAll('*').forEach((d) => consumed.add(d)); consumed.add(ch); }
            let gapL = (parseFloat(cs.marginLeft) || 0) + (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.paddingLeft) || 0);
            let gapR = (parseFloat(cs.marginRight) || 0) + (parseFloat(cs.borderRightWidth) || 0) + (parseFloat(cs.paddingRight) || 0);
            if (atomic) {
              // feste Breite (width/min-width) breiter als der Text (z. B. Rechenzeichen .table__op): der Überschuss
              // gehört zum Platzbedarf im Text – vor bzw. hinter den Text, je nach Lage des Texts in der Box
              const er = ch.getBoundingClientRect();
              const rr = document.createRange();
              rr.selectNodeContents(ch);
              const tr = rr.getBoundingClientRect();
              if (tr.width > 0.01) {
                const inL = er.left + (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.paddingLeft) || 0);
                const inR = er.right - (parseFloat(cs.borderRightWidth) || 0) - (parseFloat(cs.paddingRight) || 0);
                gapL += Math.max(0, tr.left - inL);
                gapR += Math.max(0, inR - tr.right);
              }
            }
            if (gapL > 0.3) acc.cur.items.push({ gap: gapL, el: ch });
            const n0 = acc.cur.items.length;
            if (atomic) collectAtomic(ch, acc); else collect(container, ch, acc, ch);
            if (gapR > 0.3 && acc.cur.items.length > n0) acc.cur.items.push({ gap: gapR, el: ch, after: true });
            continue;
          }
        }
        // Floats und absolut positionierte Elemente liegen außerhalb des Flusses: Text läuft weiter
        if (cs.float !== 'none' || cs.position === 'absolute' || cs.position === 'fixed') continue;
        // Blockgrenze
        acc.flush(ch);
      }
    };
    // Platzbedarf eines Inline-Objekts im Textfluss (Randbox-Breite in px); 0 für Block-/absolut positionierte Objekte
    const inlineSpace = (el, cs) => {
      if (!isInlineLevel(cs) || cs.visibility !== 'visible') return 0;
      const r = el.getBoundingClientRect();
      if (r.width < 0.01) return 0;
      return r.width + (parseFloat(cs.marginLeft) || 0) + (parseFloat(cs.marginRight) || 0);
    };
    // Text eines flachgelegten atomaren Inline-Elements in Dokumentreihenfolge
    const collectAtomic = (el, acc) => {
      for (const ch of el.childNodes) {
        if (ch.nodeType === 3) { if (ch.nodeValue.length) acc.cur.items.push({ t: ch, el }); continue; }
        if (ch.nodeType !== 1) continue;
        const cs = CS(ch);
        if (cs.display === 'none' || H.isVisuallyHidden(ch, cs) || H.SKIP_TAGS.has(ch.localName)) continue;
        if (ch.localName === 'br') { acc.cur.items.push({ br: true, el }); continue; }
        if (H.GRAPHIC_TAGS.has(ch.localName)) { acc.cur.items.push({ obj: ch, w: inlineSpace(ch, cs) }); continue; }
        const gapL = (parseFloat(cs.marginLeft) || 0) + (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.paddingLeft) || 0);
        const gapR = (parseFloat(cs.marginRight) || 0) + (parseFloat(cs.borderRightWidth) || 0) + (parseFloat(cs.paddingRight) || 0);
        if (gapL > 0.3) acc.cur.items.push({ gap: gapL, el: ch });
        const n0 = acc.cur.items.length;
        collectAtomic(ch, acc);
        if (gapR > 0.3 && acc.cur.items.length > n0) acc.cur.items.push({ gap: gapR, el: ch, after: true });
      }
    };

    const range = document.createRange();
    const finishParagraph = (container, items, anon) => {
      // Messen: Textfragmente je Zeile
      const textItems = items.filter((it) => it.t);
      if (!textItems.some((it) => /[^\s\u00AD]/.test(it.t.nodeValue))) return null;
      const rects = [];
      // Initiale: ::first-letter mit float → InDesign-Initiale (Zeilen aus der Höhe des Buchstabens)
      let dropcap = null;
      const fl = getComputedStyle(container, '::first-letter');
      if (fl && fl.float && fl.float !== 'none' && textItems.length) {
        const ft = textItems.find((it) => /\S/.test(it.t.nodeValue));
        const k = ft.t.nodeValue.search(/\S/);
        range.setStart(ft.t, k); range.setEnd(ft.t, k + 1);
        const r = range.getBoundingClientRect();
        const lhC = parseFloat(CS(container).lineHeight) || parseFloat(CS(container).fontSize) * 1.2;
        const sIdx = out.styles.length;
        out.styles.push({
          tag: 'idml-initiale', cls: ['initiale'], parentCls: [...container.classList], parentTag: container.localName,
          family: fl.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, ''), weight: Math.round(+fl.fontWeight) || 400,
          italic: fl.fontStyle === 'italic', sizePx: parseFloat(fl.fontSize), opticalAuto: fl.fontOpticalSizing !== 'none', fvs: (() => {
            const o = {}; if (fl.fontVariationSettings && fl.fontVariationSettings !== 'normal') fl.fontVariationSettings.split(',').forEach((q) => { const m = q.trim().match(/^["'](\w{4})["']\s+(-?[\d.]+)/); if (m) o[m[1]] = +m[2]; }); return o;
          })(),
          lineHeightPx: null, letterSpacingPx: 0, color: H.parseColor(fl.color), textTransform: fl.textTransform, caps: fl.fontVariantCaps,
          numeric: fl.fontVariantNumeric, features: fl.fontFeatureSettings, decoration: 'none', verticalAlign: 'baseline', whiteSpace: 'normal',
          textAlign: 'left', hyphens: 'none', textIndentPx: 0, breakInside: 'auto', lang: 'de', section: '',
        });
        dropcap = { item: ft, index: k, lines: Math.max(2, Math.round((r.height + 0.25 * lhC) / lhC)), s: sIdx };
      }
      for (const it of textItems) {
        const cs = CS(it.t.parentElement);
        if (cs.visibility !== 'visible') { it.hidden = true; continue; }
        range.selectNodeContents(it.t);
        if (dropcap && dropcap.item === it) range.setStart(it.t, Math.min(it.t.nodeValue.length, dropcap.index + 1));
        const bo = H.baselineOffset(cs);
        const va = cs.verticalAlign;
        for (const r of range.getClientRects()) {
          if (r.width < 0.01 || r.height < 0.01) continue;
          rects.push({ l: r.left, t: r.top, r: r.right, b: r.bottom, base: r.top + bo.off, normal: va === 'baseline', it });
        }
        const first = range.getClientRects()[0];
        if (first) it.base = first.top + bo.off;
      }
      if (!rects.length) return null;
      // Mehrspaltiger Kontext (column-count am Container oder einem Vorfahren): Zeilen je Spalte bilden, sonst
      // verschmelzen Zeilen gleicher Grundlinie aus verschiedenen Spalten und die Lesereihenfolge kippt.
      let colOf = () => 0;
      for (let a = container; a && a !== page.parentElement; a = a.parentElement) {
        const acs = CS(a);
        const n = parseInt(acs.columnCount, 10) || 1;
        if (n < 2) continue;
        const R = a.getBoundingClientRect();
        const x0 = R.left + parseFloat(acs.paddingLeft) + parseFloat(acs.borderLeftWidth);
        const w = R.width - parseFloat(acs.paddingLeft) - parseFloat(acs.paddingRight) - parseFloat(acs.borderLeftWidth) - parseFloat(acs.borderRightWidth);
        const gap = acs.columnGap === 'normal' ? parseFloat(acs.fontSize) : parseFloat(acs.columnGap);
        const cw = (w - (n - 1) * gap) / n;
        colOf = (x) => Math.max(0, Math.min(n - 1, Math.floor((x - x0 + gap / 2) / (cw + gap))));
        break;
      }
      // Zeilen bilden: normale Fragmente nach Spalte und Grundlinie, übrige nach Überdeckung
      const lines = [];
      rects.forEach((r) => { r.col = colOf(r.l); });
      rects.filter((r) => r.normal).sort((a, b) => a.col - b.col || a.base - b.base || a.l - b.l).forEach((r) => {
        const L = lines.find((l) => l.col === r.col && Math.abs(l.base - r.base) < 1.2);
        if (L) { L.rs.push(r); } else lines.push({ base: r.base, col: r.col, rs: [r] });
      });
      rects.filter((r) => !r.normal).forEach((r) => {
        const c = (r.t + r.b) / 2;
        let L = lines.find((l) => l.col === r.col && l.rs.some((x) => c >= x.t - 1 && c <= x.b + 1));
        if (!L) {
          // Zeile ohne normale Fragmente (nur hoch-/tiefgestellt)
          L = lines.find((l) => l.col === r.col && Math.abs(l.base - r.base) < 1.2);
          if (!L) { L = { base: r.base, col: r.col, rs: [] }; lines.push(L); }
        }
        L.rs.push(r);
      });
      lines.sort((a, b) => a.col - b.col || a.base - b.base);
      lines.forEach((l) => {
        l.top = Math.min(...l.rs.map((r) => r.t)); l.bottom = Math.max(...l.rs.map((r) => r.b));
        l.left = Math.min(...l.rs.map((r) => r.l)); l.right = Math.max(...l.rs.map((r) => r.r));
      });
      // Feste Zeilenumbrüche für mehrzeilige Absätze, deren Zeilenfall InDesign nicht nachbilden kann
      // (hyphens: none; text-wrap: balance bei Überschriften): Zeilenanfänge suchen
      const ccs = CS(container);
      const balanced = /balance/.test(`${ccs.textWrap || ''} ${ccs.textWrapStyle || ''}`);
      const display = parseFloat(ccs.fontSize) >= 24;   // Anzeigetext ab 18 pt (Kennzahlen, Titel): Zeilenfall ist Gestaltung
      const fixBreaks = opts.fixBreaks !== false && (ccs.hyphens === 'none' || balanced || display) && lines.length >= 2 && lines.length <= 6 && !dropcap &&
        new Set(lines.map((l) => l.col)).size === 1;
      if (fixBreaks) {
        // Zeile eines Zeichens über seine Grundlinie (kleinere/hochgestellte Zeichen wie „€“ zählen zur Zeile, in der
        // sie stehen – ein Vergleich der Oberkanten hielte sie für einen neuen Zeilenanfang)
        const lineOf = (r, bo) => {
          const base = r.top + bo, c = (r.top + r.bottom) / 2;
          let k = lines.findIndex((l) => Math.abs(l.base - base) < 1.2);
          if (k < 0) k = lines.findIndex((l) => c >= l.top - 1 && c <= l.bottom + 1);
          if (k < 0) k = lines.reduce((best, l, j) => (Math.abs(l.base - base) < Math.abs(lines[best].base - base) ? j : best), 0);
          return k;
        };
        let prevLine = null;
        for (const it of textItems) {
          if (it.hidden) continue;
          const v = it.t.nodeValue;
          const bo = H.baselineOffset(CS(it.t.parentElement)).off;
          it.lineStarts = new Set();
          for (let i = 0; i < v.length; i++) {
            if (/\s/.test(v[i]) || v[i] === '\u00AD') continue;
            const atWordStart = i === 0 || /[\s\-\u2010\u2013\u2014\/\u00AD]/.test(v[i - 1]);
            if (!atWordStart && prevLine !== null) continue;
            range.setStart(it.t, i); range.setEnd(it.t, i + 1);
            const r = range.getClientRects()[0];
            if (!r || r.height < 0.01) continue;
            const k = lineOf(r, bo);
            if (prevLine !== null && k > prevLine) it.lineStarts.add(i);
            prevLine = Math.max(prevLine === null ? k : prevLine, k);
          }
        }
      }
      // text-wrap: pretty (styles.css: p, li, dd, td, th): Chromium bricht die letzten Zeilen ausgewogener um als ein
      // gieriger Setzer (InDesign Ein-Zeilen-Setzer). Zeilenanfänge unter pretty und unter text-wrap-style: auto
      // vergleichen; ab der ersten abweichenden Zeile feste Umbrüche an den Stellen des PDFs (davor bricht InDesign
      // ohnehin gleich, dort bleiben Text und Silbentrennung frei).
      let prettyBreaks = 0;
      const prettyStyle = /pretty/.test(`${ccs.textWrap || ''} ${ccs.textWrapStyle || ''}`);
      if (!fixBreaks && prettyStyle && opts.fixBreaks !== false && lines.length >= 2 && !dropcap && new Set(lines.map((l) => l.col)).size === 1) {
        const starts = () => {
          const res = [];
          let band = null;
          for (const it of textItems) {
            if (it.hidden) continue;
            const v = it.t.nodeValue;
            for (let i = 0; i < v.length; i++) {
              if (/\s/.test(v[i]) || v[i] === '\u00AD') continue;
              const atWordStart = i === 0 || /[\s\-\u2010\u2013\u2014\/\u00AD]/.test(v[i - 1]);
              if (!atWordStart && band) continue;
              range.setStart(it.t, i); range.setEnd(it.t, i + 1);
              const r = range.getClientRects()[0];
              if (!r || r.height < 0.01) continue;
              const c = (r.top + r.bottom) / 2;
              if (band && c > band.b + 1) { res.push({ it, i }); band = { t: r.top, b: r.bottom }; }
              else if (!band) band = { t: r.top, b: r.bottom };
              else { band.t = Math.min(band.t, r.top); band.b = Math.max(band.b, r.bottom); }
            }
          }
          return res;
        };
        const P1 = starts();
        const st = container.style, prev = st.getPropertyValue('text-wrap-style'), prio = st.getPropertyPriority('text-wrap-style');
        st.setProperty('text-wrap-style', 'auto', 'important');
        const W1 = starts();
        if (prev) st.setProperty('text-wrap-style', prev, prio); else st.removeProperty('text-wrap-style');
        let j = 0;
        while (j < P1.length && j < W1.length && P1[j].it === W1[j].it && P1[j].i === W1[j].i) j++;
        if (j < P1.length || j < W1.length) {
          for (const x of P1.slice(j)) { (x.it.lineStarts || (x.it.lineStarts = new Set())).add(x.i); prettyBreaks++; }
          if (!prettyBreaks) prettyBreaks = -1;   // nur eine Zeile weniger als gierig: nicht nachbildbar (Warnung)
        }
      }
      // Bezugsrechteck: Inhaltsbox des Containers (bzw. Zeilenhülle bei anonymen Flex-/Grid-Elementen)
      const cr = container.getBoundingClientRect();
      const content = {
        l: cr.left + parseFloat(ccs.borderLeftWidth) + parseFloat(ccs.paddingLeft),
        r: cr.right - parseFloat(ccs.borderRightWidth) - parseFloat(ccs.paddingRight),
        t: cr.top + parseFloat(ccs.borderTopWidth) + parseFloat(ccs.paddingTop),
        b: cr.bottom - parseFloat(ccs.borderBottomWidth) - parseFloat(ccs.paddingBottom),
      };
      // Initiale: Zeilenzahl = Anzahl der von der Initiale eingerückten Zeilen (die Glyphenhöhe überschätzt sie)
      if (dropcap) {
        let n = 0;
        for (const l of lines) { if (l.left > content.l + 1) n++; else break; }
        if (n >= 2) dropcap.lines = n;
      }
      const flexLike = /^(flex|inline-flex|grid|inline-grid)$/.test(ccs.display);
      let box;
      const lt = Math.min(...lines.map((l) => l.top)), lb = Math.max(...lines.map((l) => l.bottom));
      const ll = Math.min(...lines.map((l) => l.left)), lr = Math.max(...lines.map((l) => l.right));
      if (!anon) box = { l: Math.min(content.l, ll), r: Math.max(content.r, lr), t: Math.min(content.t, lt), b: Math.max(content.b, lb) };
      else if (flexLike) box = { l: ll, r: lr, t: lt, b: lb };
      else box = { l: Math.min(content.l, ll), r: Math.max(content.r, lr), t: lt, b: lb };

      // Text in Läufe (Zeichenformat-Quelle = Elternelement des Textknotens)
      const runs = [];
      let prevSpace = true;
      const push = (text, el, extra) => {
        if (!text) return;
        const s = styleOf(el);
        const last = runs[runs.length - 1];
        if (last && last.text !== undefined && last.s === s && (last.shift || 0) === ((extra && extra.shift) || 0)) { last.text += text; return; }
        runs.push({ text, s, ...(extra || {}) });
      };
      let lastBase = null;
      for (const it of items) {
        if (it.gap) { runs.push({ gap: it.gap * PT, after: !!it.after, s: styleOf(it.el) }); continue; }
        if (it.br) {
          if (runs.length && runs[runs.length - 1].text) runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/ +$/, '');
          push('\u2028', it.el); prevSpace = true; continue;
        }
        if (it.obj) {
          // Inline-Grafik bzw. leerer Inline-Block: Platz im Text freihalten (wird in build.cjs Laufweite)
          if (it.w > 0.3) { runs.push({ gap: it.w * PT, obj: true, s: styleOf(it.obj.parentElement) }); prevSpace = false; }
          continue;
        }
        if (it.hidden) continue;
        const pel = it.t.parentElement;
        const cs = CS(pel);
        let t = it.t.nodeValue;
        if (it.lineStarts && it.lineStarts.size) t = [...t].map((c, i) => (it.lineStarts.has(i) ? '\u0001' : '') + c).join('');
        if (dropcap && dropcap.item === it) {
          // Initiale als eigener Lauf (Zeichenformat), Rest normal
          const k = dropcap.index;
          const pre = t.slice(0, k).replace(/[ \t\n\r\f]+/g, ' ');
          if (pre.trim()) push(pre, pel);
          runs.push({ text: t[k], s: dropcap.s, dropcap: true });
          t = t.slice(k + 1);
          prevSpace = false;
        }
        const ws = cs.whiteSpace;
        if (ws === 'pre' || ws === 'pre-wrap' || ws === 'break-spaces') {
          t = t.replace(/\r\n?/g, '\n').replace(/\n/g, '\u2028');
        } else if (ws === 'pre-line') {
          t = t.replace(/[ \t\f\r]+/g, ' ').replace(/ ?\n ?/g, '\u2028');
        } else {
          t = t.replace(/[ \t\n\r\f]+/g, ' ');
        }
        if (prevSpace) t = t.replace(/^ +/, '');
        if (!t) continue;
        prevSpace = / $/.test(t) || t.endsWith('\u2028');
        if (cs.textTransform === 'capitalize') t = t.replace(/(^|[\s\u00A0\-–„"(])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
        else if (cs.textTransform === 'lowercase') t = t.toLowerCase();
        // Grundlinienversatz (hoch-/tiefgestellt) gemessen statt vertical-align nachzubilden
        let shift = 0;
        if (cs.verticalAlign !== 'baseline' && it.base !== undefined) {
          const L = lines.find((l) => l.rs.some((r) => r.it === it));
          if (L) shift = (L.base - it.base) * PT;
          if (Math.abs(shift) < 0.2) shift = 0;
        }
        push(t, pel, shift ? { shift: Math.round(shift * 100) / 100 } : null);
        lastBase = it.base;
      }
      // Abschluss: Leerraum am Ende entfernen
      for (let i = runs.length - 1; i >= 0; i--) {
        if (runs[i].text === undefined) continue;
        runs[i].text = runs[i].text.replace(/[ ]+$/, '');
        if (runs[i].text) break;
        runs.splice(i, 1);
      }
      // Zeilenanfang-Marker → erzwungener Zeilenumbruch (Leerzeichen davor ersetzen, sonst einfügen)
      let prevRun = null;
      for (const r of runs) {
        if (r.text === undefined) continue;
        let t = '';
        for (const c of r.text) {
          if (c !== '\u0001') { t += c; continue; }
          const before = t || (prevRun ? prevRun.text : '');
          if (!before || before.endsWith('\u2028')) continue;                       // <br> steht schon da
          if (t.endsWith(' ')) t = t.slice(0, -1) + '\u2028';
          else if (!t && prevRun.text.endsWith(' ')) prevRun.text = prevRun.text.slice(0, -1) + '\u2028';
          else if (t.endsWith('\u00AD')) t = t.slice(0, -1) + '-\u2028';              // Trennung am weichen Trennstrich
          else if (!t && prevRun.text.endsWith('\u00AD')) prevRun.text = prevRun.text.slice(0, -1) + '-\u2028';
          else t += '\u2028';
        }
        r.text = t;
        prevRun = r;
      }
      if (!runs.some((r) => r.text && /[^\s\u00AD\u2028]/.test(r.text))) return null;

      // Leitendes Element (meiste Zeichen) für das Absatzformat
      const count = new Map();
      runs.forEach((r) => { if (r.text) count.set(r.s, (count.get(r.s) || 0) + r.text.replace(/\s/g, '').length); });
      const domS = [...count.entries()].sort((a, b) => b[1] - a[1])[0][0];
      // Absatz-Stilquelle: Container – oder das einzige Inline-Element, das allen Text trägt
      const textEls = new Set(items.filter((it) => it.t && /\S/.test(it.t.nodeValue)).map((it) => it.el));
      let keyEl = container;
      if (anon || textEls.size >= 1) {
        // gemeinsamer Vorfahr aller Text-Elemente unterhalb des Containers
        let common = null;
        textEls.forEach((e) => {
          if (!common) { common = e; return; }
          while (common && !common.contains(e)) common = common.parentElement;
        });
        if (common && container.contains(common) && common !== container) keyEl = common;
      }
      const lh = (() => {
        const v = CS(container).lineHeight;
        if (v !== 'normal') return parseFloat(v);
        if (lines.length > 1) { const d = lines.slice(1).map((l, i) => l.base - lines[i].base).sort((a, b) => a - b); return d[Math.floor(d.length / 2)]; }
        return lines[0].bottom - lines[0].top;
      })();
      const firstRect = lines[0].rs.slice().sort((a, b) => a.l - b.l)[0];
      return {
        container, anon, keyEl, runs, domS,
        paraS: styleOf(keyEl === container ? container : keyEl), containerS: styleOf(container),
        box: { x: (box.l - P.left) * PT, y: (box.t - P.top) * PT, w: (box.r - box.l) * PT, h: (box.b - box.t) * PT },
        lines: lines.map((l) => ({ base: round((l.base - P.top) * PT), top: round((l.top - P.top) * PT), bottom: round((l.bottom - P.top) * PT), left: round((l.left - P.left) * PT), right: round((l.right - P.left) * PT), col: l.col })),
        firstTextX: (firstRect.l - P.left) * PT,
        dropcap: dropcap ? { lines: dropcap.lines, chars: 1 } : null,
        fixedBreaks: fixBreaks,
        prettyBreaks,
        contentX: ((anon && flexLike ? ll : content.l) - P.left) * PT,   // Zeilenanfang ohne Erstzeileneinzug
        leadingPx: lh,
        marginTop: parseFloat(CS(container).marginTop) * PT || 0,
        breakInside: CS(container).breakInside,
      };
    };

    const paragraphsOf = (container) => {
      const res = [];
      const acc = {
        cur: { items: [] },
        flush() {
          if (acc.cur.items.length) res.push({ items: acc.cur.items });
          acc.cur = { items: [] };
          acc.broken = true;
        },
      };
      collect(container, container, acc, container);
      const hadBlock = !!acc.broken;
      if (acc.cur.items.length) res.push({ items: acc.cur.items });
      return res.map((r) => finishParagraph(container, r.items, hadBlock || res.length > 1)).filter(Boolean);
    };

    // ---- Tabellen ----------------------------------------------------------------------------------------------------
    const tableModel = (t) => {
      const rows = [...t.rows].filter(rowVisible);
      const grid = [];
      const cells = [];
      rows.forEach((row, ri) => {
        grid[ri] = grid[ri] || [];
        let ci = 0;
        for (const cell of row.cells) {
          while (grid[ri][ci]) ci++;
          const cs = cell.colSpan || 1, rs = cell.rowSpan || 1;
          for (let dr = 0; dr < rs; dr++) for (let dc = 0; dc < cs; dc++) {
            grid[ri + dr] = grid[ri + dr] || [];
            grid[ri + dr][ci + dc] = cell;
          }
          cells.push({ cell, row: ri, col: ci, colSpan: cs, rowSpan: Math.min(rs, rows.length - ri) });
          ci += cs;
        }
      });
      const ncol = Math.max(...grid.map((g) => g.length));
      const T = t.getBoundingClientRect();
      // Spaltengrenzen aus Zellen ohne colspan
      const lefts = Array.from({ length: ncol + 1 }, () => []);
      cells.forEach((c) => {
        const r = c.cell.getBoundingClientRect();
        lefts[c.col].push(r.left);
        lefts[c.col + c.colSpan].push(r.right);
      });
      const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
      const bounds = lefts.map((a, i) => (a.length ? med(a) : null));
      bounds[0] = T.left; bounds[ncol] = T.right;
      for (let i = 1; i < ncol; i++) if (bounds[i] === null) bounds[i] = bounds[i - 1];
      const colW = bounds.slice(1).map((b, i) => (b - bounds[i]) * PT);
      const rowRects = rows.map((r) => r.getBoundingClientRect());
      const rowH = rowRects.map((r) => r.height * PT);
      const groupOf = (row) => row.parentElement.localName;   // thead/tbody/tfoot/table
      const header = rows.filter((r) => groupOf(r) === 'thead').length;
      const footer = rows.filter((r) => groupOf(r) === 'tfoot').length;
      const edge = (el, side) => {
        if (!el) return null;
        const cs = CS(el);
        const w = parseFloat(cs.getPropertyValue(`border-${side}-width`)) || 0;
        const st = cs.getPropertyValue(`border-${side}-style`);
        const c = H.parseColor(cs.getPropertyValue(`border-${side}-color`));
        return w > 0 && st !== 'none' && st !== 'hidden' && H.visibleColor(c) ? { w: w * PT, style: st, color: c } : null;
      };
      const best = (...cands) => cands.filter(Boolean).sort((a, b) => b.w - a.w)[0] || null;
      // Zusammenfallende Rahmen (border-collapse) je gemeinsamer Kante EINMAL nach CSS 2.1 § 17.6.2.1 auflösen:
      // breiter > Stil (double … inset) > Herkunft (Zelle, Zeile, Zeilengruppe, Tabelle) > oben/links.
      // Beide Zellen bekommen denselben Gewinner (InDesign kennt pro Kante nur eine Linie).
      const STYLE_RANK = { double: 8, solid: 7, dashed: 6, dotted: 5, ridge: 4, outset: 3, groove: 2, inset: 1 };
      const cand = (e, side, origin, pos) => { const x = edge(e, side); return x ? { ...x, origin, pos } : null; };
      const resolveEdge = (list) => {
        const c = list.filter(Boolean);
        if (!c.length) return null;
        c.sort((a, b) => b.w - a.w || (STYLE_RANK[b.style] || 0) - (STYLE_RANK[a.style] || 0) || a.origin - b.origin || a.pos - b.pos);
        return { w: c[0].w, style: c[0].style, color: c[0].color };
      };
      const groupOfRow = (row) => (row && row.parentElement !== t ? row.parentElement : null);
      const hEdge = (r, c) => {   // Kante oberhalb von Zeile r (r = Zeilenzahl: Unterkante)
        const up = r > 0 ? (grid[r - 1] || [])[c] : null, dn = r < rows.length ? (grid[r] || [])[c] : null;
        if (up && up === dn) return null;
        const upRow = r > 0 ? rows[r - 1] : null, dnRow = r < rows.length ? rows[r] : null;
        const ug = groupOfRow(upRow), dg = groupOfRow(dnRow);
        return resolveEdge([up && cand(up, 'bottom', 0, 0), dn && cand(dn, 'top', 0, 1),
          upRow && cand(upRow, 'bottom', 1, 0), dnRow && cand(dnRow, 'top', 1, 1),
          ug && ug !== dg && cand(ug, 'bottom', 2, 0), dg && ug !== dg && cand(dg, 'top', 2, 1),
          r === 0 && cand(t, 'top', 5, 0), r === rows.length && cand(t, 'bottom', 5, 1)]);
      };
      const vEdge = (r, c) => {   // Kante links von Spalte c (c = Spaltenzahl: rechte Außenkante)
        const lf = c > 0 ? (grid[r] || [])[c - 1] : null, rt = c < ncol ? (grid[r] || [])[c] : null;
        if (lf && lf === rt) return null;
        const row = rows[r], g = groupOfRow(row);
        return resolveEdge([lf && cand(lf, 'right', 0, 0), rt && cand(rt, 'left', 0, 1),
          c === 0 && cand(row, 'left', 1, 0), c === ncol && cand(row, 'right', 1, 1),
          c === 0 && g && cand(g, 'left', 2, 0), c === ncol && g && cand(g, 'right', 2, 1),
          c === 0 && cand(t, 'left', 5, 0), c === ncol && cand(t, 'right', 5, 1)]);
      };
      const cellsOut = cells.map((c) => {
        const el = c.cell, cs = CS(el), row = rows[c.row], lastRow = rows[c.row + c.rowSpan - 1];
        const rg = row.parentElement !== t ? row.parentElement : null;
        const lrg = lastRow.parentElement !== t ? lastRow.parentElement : null;
        const firstInGroup = rg && rg.rows ? rg.rows[0] === row : false;
        const lastInGroup = lrg && lrg.rows ? lrg.rows[lrg.rows.length - 1] === lastRow : false;
        const isTop = c.row === 0, isBottom = c.row + c.rowSpan === rows.length, isLeft = c.col === 0, isRight = c.col + c.colSpan === ncol;
        // Nachbarzellen (für die gemeinsame Kante im collapse-Modell)
        const above = c.row > 0 ? grid[c.row - 1][c.col] : null;
        const below = c.row + c.rowSpan < rows.length ? grid[c.row + c.rowSpan][c.col] : null;
        const leftN = c.col > 0 ? grid[c.row][c.col - 1] : null;
        const rightN = c.col + c.colSpan < ncol ? grid[c.row][c.col + c.colSpan] : null;
        const collapse = CS(t).borderCollapse === 'collapse';
        const edges = collapse ? {
          top: hEdge(c.row, c.col), bottom: hEdge(c.row + c.rowSpan, c.col),
          left: vEdge(c.row, c.col), right: vEdge(c.row, c.col + c.colSpan),
        } : {
          top: best(edge(el, 'top'), edge(row, 'top'), firstInGroup && edge(rg, 'top'), isTop && edge(t, 'top'), collapse && above && edge(above, 'bottom'), collapse && above && edge(above.parentElement, 'bottom')),
          bottom: best(edge(el, 'bottom'), edge(lastRow, 'bottom'), lastInGroup && edge(lrg, 'bottom'), isBottom && edge(t, 'bottom'), collapse && below && edge(below, 'top'), collapse && below && edge(below.parentElement, 'top')),
          left: best(edge(el, 'left'), isLeft && edge(t, 'left'), collapse && leftN && edge(leftN, 'right')),
          right: best(edge(el, 'right'), isRight && edge(t, 'right'), collapse && rightN && edge(rightN, 'left')),
        };
        const fill = [el, row, rg].map((e) => e && H.parseColor(CS(e).backgroundColor)).find((x) => H.visibleColor(x)) || null;
        const r = el.getBoundingClientRect();
        const hasInner = [...el.querySelectorAll('*')].some((d) => {
          if (H.GRAPHIC_TAGS.has(d.localName)) return true;
          const dcs = CS(d);
          return H.visibleColor(H.parseColor(dcs.backgroundColor)) || ['top', 'right', 'bottom', 'left'].some((s) => (parseFloat(dcs.getPropertyValue(`border-${s}-width`)) || 0) > 0 && dcs.getPropertyValue(`border-${s}-style`) !== 'none');
        });
        return {
          row: c.row, col: c.col, rowSpan: c.rowSpan, colSpan: c.colSpan, tag: el.localName,
          x: (r.left - P.left) * PT, y: (r.top - P.top) * PT, w: r.width * PT, h: r.height * PT,
          inset: { t: parseFloat(cs.paddingTop) * PT, r: parseFloat(cs.paddingRight) * PT, b: parseFloat(cs.paddingBottom) * PT, l: parseFloat(cs.paddingLeft) * PT },
          border: { t: parseFloat(cs.borderTopWidth) * PT, b: parseFloat(cs.borderBottomWidth) * PT },
          valign: cs.verticalAlign, fill, edges, hasInner, cls: semClasses(el), paras: [],
          s: styleOf(el),
        };
      });
      // Senkrechte Ausdehnung aus den Zeilen (getBoundingClientRect der Tabelle schließt <caption> ein; die
      // Beschriftung ist ein eigener Absatz und darf nicht von der Tabelle überdeckt werden)
      let ty0 = T.top, ty1 = T.bottom;
      const cap = [...t.children].find((e) => e.localName === 'caption' && CS(e).display !== 'none');
      if (cap) {
        const tcs = CS(t);
        const sep = tcs.borderCollapse !== 'collapse';
        ty0 = Math.min(...rowRects.map((r) => r.top)) - (sep ? parseFloat(tcs.borderTopWidth) + (parseFloat(tcs.borderSpacing.split(' ').pop()) || 0) : 0);
        ty1 = Math.max(...rowRects.map((r) => r.bottom)) + (sep ? parseFloat(tcs.borderBottomWidth) + (parseFloat(tcs.borderSpacing.split(' ').pop()) || 0) : 0);
        ty0 = Math.max(ty0, T.top); ty1 = Math.min(ty1, T.bottom);
      }
      return {
        el: t, x: (T.left - P.left) * PT, y: (ty0 - P.top) * PT, w: T.width * PT, h: (ty1 - ty0) * PT,
        nrow: rows.length, ncol, colW, rowH, header, footer, cells: cellsOut, cellEls: cells.map((c) => c.cell),
        cls: semClasses(t), paint: paintKey(t, page, 3),
        bg: H.parseColor(CS(t).backgroundColor),
      };
    };
    const tableModels = new Map();
    nativeTables.forEach((t) => tableModels.set(t, tableModel(t)));

    // ---- Durchlauf ---------------------------------------------------------------------------------------------------
    const walk = (el) => {
      const cs = CS(el);
      if (H.SKIP_TAGS.has(el.localName) || el.hasAttribute('data-idml-probe')) return;
      if (cs.display === 'none' || H.isVisuallyHidden(el, cs)) return;
      if (el !== page) decorate(el, cs);
      // Umfließen: Float-Elemente bekommen in InDesign ein unsichtbares Umfluss-Rechteck (Randbox)
      if (el !== page && cs.float !== 'none' && cs.visibility === 'visible') {
        const r = el.getBoundingClientRect();
        const mt = parseFloat(cs.marginTop) || 0, mr = parseFloat(cs.marginRight) || 0, mb = parseFloat(cs.marginBottom) || 0, ml = parseFloat(cs.marginLeft) || 0;
        pg.wraps.push({ x: (r.left - ml - P.left) * PT, y: (r.top - mt - P.top) * PT, w: (r.width + ml + mr) * PT, h: (r.height + mt + mb) * PT, side: cs.float, paint: paintKey(el, page, 0) });
      }
      if (H.GRAPHIC_TAGS.has(el.localName)) { addGraphic(el, cs); return; }
      const blockLevel = el === page || !isInlineLevel(cs) || (H.ATOMIC_INLINE.has(cs.display) && !consumed.has(el));
      if (blockLevel && !consumed.has(el) && cs.display !== 'contents') {
        const ps = paragraphsOf(el);
        ps.forEach((p) => {
          const cell = cellOf(el);
          const tbl = cell ? tableModels.get(cell.closest('table')) : null;
          let inFloat = false;
          for (let e = el; e && e !== page; e = e.parentElement) if (CS(e).float !== 'none') { inFloat = true; break; }
          const rec = {
            ...p, inFloat,
            container: undefined, keyEl: undefined,
            ctxIdx: null, tree: treeIndex.get(el),
            paint: paintKey(el, page, 3),
            keyS: p.paraS,
            foot: inFoot(el),
          };
          rec._container = el;
          if (tbl) {
            const ci = tbl.cellEls.indexOf(cell);
            tbl.cells[ci].paras.push(rec);
          } else {
            pg.paragraphs.push(rec);
          }
        });
      }
      for (const ch of el.children) walk(ch);
    };
    walk(page);

    // Kontext (gemeinsamer Rahmen) je Absatz: nächster „trennender“ Vorfahr des Containers
    const breaking = (a) => {
      if (a === page) return true;
      const cs = CS(a);
      if (cs.position !== 'static') return true;
      if (/^(flex|inline-flex|grid|inline-grid|table-cell|table|inline-block)$/.test(cs.display)) return true;
      if (H.visibleColor(H.parseColor(cs.backgroundColor)) || cs.backgroundImage !== 'none') return true;
      if (['top', 'right', 'bottom', 'left'].some((s) => (parseFloat(cs.getPropertyValue(`border-${s}-width`)) || 0) > 0 && cs.getPropertyValue(`border-${s}-style`) !== 'none')) return true;
      if ((parseInt(cs.columnCount, 10) || 1) > 1) return true;
      return false;
    };
    const ctxOf = (container, anon) => {
      const ccs = CS(container);
      if ((parseInt(ccs.columnCount, 10) || 1) > 1) return container;            // column-count am Absatz/Container selbst
      if (anon && /^(flex|inline-flex|grid|inline-grid)$/.test(ccs.display)) return container;
      let a = container.parentElement;
      while (a && !breaking(a)) a = a.parentElement;
      return a || page;
    };
    pg.paragraphs.forEach((p) => {
      const ctx = ctxOf(p._container, p.anon);
      const ccs = CS(ctx);
      p.ctx = treeIndex.get(ctx);
      const cols = parseInt(ccs.columnCount, 10) || 1;
      if (cols > 1) {
        const r = ctx.getBoundingClientRect();
        p.multicol = {
          id: treeIndex.get(ctx), count: cols, gap: (ccs.columnGap === 'normal' ? parseFloat(ccs.fontSize) : parseFloat(ccs.columnGap)) * PT,
          x: (r.left + parseFloat(ccs.paddingLeft) + parseFloat(ccs.borderLeftWidth) - P.left) * PT,
          y: (r.top + parseFloat(ccs.paddingTop) + parseFloat(ccs.borderTopWidth) - P.top) * PT,
          w: (r.width - parseFloat(ccs.paddingLeft) - parseFloat(ccs.paddingRight) - parseFloat(ccs.borderLeftWidth) - parseFloat(ccs.borderRightWidth)) * PT,
          h: (r.height - parseFloat(ccs.paddingTop) - parseFloat(ccs.paddingBottom) - parseFloat(ccs.borderTopWidth) - parseFloat(ccs.borderBottomWidth)) * PT,
        };
        const rw = parseFloat(ccs.columnRuleWidth) || 0, rc = H.parseColor(ccs.columnRuleColor);
        if (rw > 0 && !/^(none|hidden)$/.test(ccs.columnRuleStyle) && H.visibleColor(rc)) p.multicol.rule = { w: rw * PT, style: ccs.columnRuleStyle, color: rc };
        p.multicol.balance = ccs.columnFill !== 'auto';
      }
      // Bezugskasten des Kontexts (für Rahmenreserve nach unten)
      const r = ctx.getBoundingClientRect();
      const deco = ctx !== page && (H.visibleColor(H.parseColor(ccs.backgroundColor)) || ccs.backgroundImage !== 'none' ||
        ['top', 'right', 'bottom', 'left'].some((s) => (parseFloat(ccs.getPropertyValue(`border-${s}-width`)) || 0) > 0 && ccs.getPropertyValue(`border-${s}-style`) !== 'none'));
      p.ctxBox = { x: (r.left - P.left) * PT, y: (r.top - P.top) * PT, w: r.width * PT, h: r.height * PT, decorated: deco };
      p.containerCls = semClasses(p._container);
      p.containerTag = p._container.localName;
      delete p._container;
    });
    tableModels.forEach((tm) => {
      tm.cells.forEach((c) => c.paras.forEach((p) => { delete p._container; }));
      delete tm.el; delete tm.cellEls;
      pg.tables.push(tm);
    });
  });

  // Schriftnutzung (Zeichen je Original-Schrift), getrennt nach HTML-Text
  out.pages.forEach((pg) => {
    const add = (p) => p.runs.forEach((r) => {
      if (!r.text) return;
      const n = r.text.replace(/\s/g, '').length;
      if (!n) return;
      fontUse.set(r.s, (fontUse.get(r.s) || 0) + n);
    });
    pg.paragraphs.forEach(add);
    pg.tables.forEach((t) => t.cells.forEach((c) => c.paras.forEach(add)));
  });
  out.fontUse = [...fontUse.entries()];

  // Texte für die Übergabe in Node bereinigen (Elemente sind nicht serialisierbar)
  out.pages.forEach((pg) => {
    const clean = (p) => {
      p.runs.forEach((r) => { delete r.it; });
    };
    pg.paragraphs.forEach(clean);
    pg.tables.forEach((t) => t.cells.forEach((c) => c.paras.forEach(clean)));
  });
  out.graphicsCount = gCount;
  out.decorCount = dCount;
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// 4 · Grafik-Durchgang: jede markierte Grafik auf ein eigenes Druckblatt (oben links) stellen
// ---------------------------------------------------------------------------------------------------------------
// kind: 'g' (data-idml-g: SVG/IMG) oder 'd' (data-idml-d: Flächen mit Verlauf/Muster, ohne Inhalt)
function stageGraphics(opts) {
  const { kind, slotW, slotH, items } = opts;   // items: [{id, bleed: {l,t,r,b} px, grow}]
  const attr = kind === 'g' ? 'data-idml-g' : 'data-idml-d';
  const els = items.map((it) => document.querySelector(`[${attr}="${it.id}"]`));
  const keep = new Set();
  els.forEach((el) => { for (let e = el; e; e = e.parentElement) keep.add(e); });
  // Vor dem Umbau: berechnete Werte der Zielelemente einfrieren (Größe, Rahmen, Farben)
  const frozen = els.map((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const w = cs.boxSizing === 'border-box' || el.localName === 'svg' ? parseFloat(cs.width) : parseFloat(cs.width) + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const props = [];
    if (kind === 'd') {
      for (let i = 0; i < cs.length; i++) {
        const p = cs[i];
        if (p === '-webkit-border-image' || p.startsWith('-webkit-mask-box-image') || p.startsWith('--')) continue;   // Alt-Kurzformen setzen sonst „fill“
        props.push([p, cs.getPropertyValue(p)]);
      }
    }
    return { w: r.width, h: r.height, props, cssW: w };
  });
  const st = document.createElement('style');
  st.setAttribute('data-idml-stage', kind);
  st.textContent = `
    @page { size: ${slotW / 96}in ${slotH / 96}in; margin: 0; }
    html, body { background: transparent !important; margin: 0 !important; padding: 0 !important; width: ${slotW}px !important; height: auto !important; overflow: visible !important; }
    [data-idml-hide] { display: none !important; }
    [data-idml-anc] { position: static !important; transform: none !important; filter: none !important; contain: none !important; overflow: visible !important;
      visibility: hidden !important; background: none !important; border-color: transparent !important; box-shadow: none !important; outline: none !important;
      columns: auto !important; break-before: auto !important; break-after: auto !important; break-inside: auto !important;
      display: block !important; float: none !important; width: 0 !important; min-width: 0 !important; max-width: none !important; height: 0 !important; min-height: 0 !important;
      padding: 0 !important; margin: 0 !important; border-width: 0 !important; }
    ${kind === 'd' ? `[${attr}] * { visibility: hidden !important; } [${attr}] *:not([data-idml-on]):not(:has([data-idml-on])) { display: none !important; }` : ''}
    [${attr}][data-idml-on] { visibility: visible !important; }
    #idml-spacer { display: block !important; position: static !important; width: 1px; height: ${items.length * slotH}px; visibility: hidden; margin: 0; }
  `;
  document.head.appendChild(st);
  // Alles, was weder Ziel noch Vorfahr eines Ziels ist, ausblenden
  const targets = new Set(els);
  document.querySelectorAll('body *').forEach((e) => {
    if (keep.has(e)) { if (!targets.has(e)) e.setAttribute('data-idml-anc', ''); return; }
    if ([...targets].some((t) => t.contains(e))) return;
    if (e.localName === 'style' || e.localName === 'link') return;
    e.setAttribute('data-idml-hide', '');
  });
  document.body.style.setProperty('position', 'static', 'important');
  document.body.style.setProperty('transform', 'none', 'important');
  const spacer = document.createElement('div');
  spacer.id = 'idml-spacer';
  document.body.insertBefore(spacer, document.body.firstChild);
  // Ziele positionieren (Baumreihenfolge, damit verschachtelte Ziele ihren Bezug kennen)
  const order = els.map((el, i) => i).sort((a, b) => (els[a].compareDocumentPosition(els[b]) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  for (const i of order) {
    const el = els[i], it = items[i], f = frozen[i];
    if (kind === 'd') {
      for (const [p, v] of f.props) el.style.setProperty(p, v, 'important');
      el.style.setProperty('font-size', '0px', 'important');
    }
    el.setAttribute('data-idml-on', '');
    el.style.setProperty('position', 'absolute', 'important');
    el.style.setProperty('margin', '0', 'important');
    el.style.setProperty('transform', 'none', 'important');
    el.style.setProperty('box-sizing', 'border-box', 'important');
    // Flächen mit Beschnittzugabe wachsen in den Beschnitt (Verlauf/Muster läuft weiter), Grafiken bekommen Rand
    const grow = !!it.grow && !!it.bleed;
    const gw = grow ? it.bleed.l + it.bleed.r : 0, gh = grow ? it.bleed.t + it.bleed.b : 0;
    el.style.setProperty('width', (f.w + gw) + 'px', 'important');
    el.style.setProperty('height', (f.h + gh) + 'px', 'important');
    el.style.setProperty('min-width', '0', 'important');
    el.style.setProperty('max-width', 'none', 'important');
    el.style.setProperty('flex', 'none', 'important');
    if (it.bleed && (it.bleed.l || it.bleed.t || it.bleed.r || it.bleed.b)) el.style.setProperty('overflow', 'visible', 'important');
    el.style.setProperty('left', '0px', 'important');
    el.style.setProperty('top', '0px', 'important');
    const o = el.getBoundingClientRect();
    const tx = (it.bleed && !grow ? it.bleed.l : 0), ty = i * slotH + (it.bleed && !grow ? it.bleed.t : 0);
    el.style.setProperty('left', (tx - o.left) + 'px', 'important');
    el.style.setProperty('top', (ty - (o.top + window.scrollY)) + 'px', 'important');
  }
  document.body.offsetHeight;
  // Kontrolle der Lage
  return els.map((el, i) => {
    const r = el.getBoundingClientRect();
    return { id: items[i].id, x: r.left, y: r.top + window.scrollY - i * slotH, w: r.width, h: r.height };
  });
}

module.exports = { installHelpers, prepare, extract, stageGraphics };
