#!/usr/bin/env node
// Selbstprüfung eines IDML-Pakets (ohne InDesign):
//   * ZIP: „mimetype“ zuerst, unkomprimiert, ohne Extra-Feld, exakter Inhalt
//   * jede XML-Datei wohlgeformt (eigener Parser; zusätzlich xmllint, falls vorhanden), keine doppelten Attribute
//   * Self-IDs eindeutig; Verweise aufgelöst (Formate, Farbfelder, Ebenen, Stories, Musterseiten, Rahmenketten,
//     Section-Start, StoryList, src-Verweise der designmap, Schrift-Kombinationen, verknüpfte Dateien in Links/)
//   * Formatketten ohne Zyklus und mit Ziel derselben Art; kein Absatztrenner (U+2029, CR/LF) im <Content>
//   * Musterseiten: Musterobjekte nur auf Seiten, deren Fuß auf die Musterseite gewandert ist (Erwartung aus dem
//     Export), keine Seitenobjekte doppelt an der Stelle eines Musterobjekts
//   * Silbentrennung: Ein-Zeilen-Setzer mit Trennbereich 0 und unbegrenzten Trennungen in Folge; Wörter ab 8
//     Buchstaben in Absätzen mit Trennung haben eine Trennstelle oder einen bedingten Trennstrich davor
// Aufruf: node scripts/idml/check.cjs dist/indesign/Datei.idml
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { readZip } = require('./zip.cjs');

const decode = (v) => v.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (x, d) => String.fromCodePoint(+d)).replace(/&#x([0-9a-f]+);/gi, (x, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&amp;/g, '&');

// Minimaler XML-Parser (Wohlgeformtheit + Elementbaum mit Attributen und Text)
function parseXml(text, name) {
  const errors = [];
  const elements = [];
  const stack = [];
  let i = 0, roots = 0;
  const ent = /^&(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);/;
  const checkText = (s, at) => {
    for (let k = s.indexOf('&'); k > -1; k = s.indexOf('&', k + 1)) if (!ent.test(s.slice(k, k + 12))) { errors.push(`${name}: ungültige Entität bei ${at + k}`); break; }
    if (/</.test(s)) errors.push(`${name}: „<“ im Text bei ${at}`);
  };
  while (i < text.length) {
    const lt = text.indexOf('<', i);
    if (lt < 0) { if (text.slice(i).trim() && !stack.length) errors.push(`${name}: Text nach dem Wurzelelement`); else checkText(text.slice(i), i); break; }
    if (lt > i) {
      const t = text.slice(i, lt);
      if (!stack.length && t.trim()) errors.push(`${name}: Text außerhalb des Wurzelelements`);
      checkText(t, i);
      if (stack.length && stack[stack.length - 1].node) stack[stack.length - 1].node.text += decode(t);
    }
    if (text.startsWith('<?', lt)) { const e = text.indexOf('?>', lt); if (e < 0) { errors.push(`${name}: offene PI`); break; } i = e + 2; continue; }
    if (text.startsWith('<!--', lt)) { const e = text.indexOf('-->', lt); if (e < 0) { errors.push(`${name}: offener Kommentar`); break; } i = e + 3; continue; }
    if (text.startsWith('<![CDATA[', lt)) { const e = text.indexOf(']]>', lt); if (e < 0) { errors.push(`${name}: offenes CDATA`); break; } i = e + 3; continue; }
    if (text.startsWith('<!', lt)) { const e = text.indexOf('>', lt); i = e + 1; continue; }
    const gt = (() => { let q = null; for (let k = lt + 1; k < text.length; k++) { const c = text[k]; if (q) { if (c === q) q = null; } else if (c === '"' || c === "'") q = c; else if (c === '>') return k; } return -1; })();
    if (gt < 0) { errors.push(`${name}: offenes Tag bei ${lt}`); break; }
    const raw = text.slice(lt + 1, gt);
    if (raw.startsWith('/')) {
      const tn = raw.slice(1).trim();
      const top = stack.pop();
      if (!top || top.tag !== tn) { errors.push(`${name}: </${tn}> passt nicht zu <${top ? top.tag : '–'}> bei ${lt}`); break; }
      i = gt + 1; continue;
    }
    const selfClose = raw.endsWith('/');
    const body = selfClose ? raw.slice(0, -1) : raw;
    const m = body.match(/^([A-Za-z_][\w:.-]*)/);
    if (!m) { errors.push(`${name}: ungültiger Tagname bei ${lt}`); break; }
    const tag = m[1];
    const attrs = {};
    const re = /\s+([A-Za-z_][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
    let rest = body.slice(tag.length), mm, consumed = 0;
    while ((mm = re.exec(rest))) {
      if (mm.index !== consumed) break;
      consumed = re.lastIndex;
      const an = mm[1], av = mm[3] !== undefined ? mm[3] : mm[4];
      if (an in attrs) errors.push(`${name}: doppeltes Attribut ${an} in <${tag}>`);
      if (/</.test(av)) errors.push(`${name}: „<“ in Attribut ${an}`);
      checkText(av.replace(/</g, ''), lt);
      attrs[an] = decode(av);
    }
    if (rest.slice(consumed).trim()) errors.push(`${name}: unlesbare Attribute in <${tag}>: ${rest.slice(consumed, consumed + 40)}`);
    if (!stack.length) roots++;
    const parent = stack.length ? stack[stack.length - 1].tag : null;
    const node = { tag, attrs, parent, file: name, children: [], text: '', up: stack.length ? stack[stack.length - 1].node : null };
    if (node.up) node.up.children.push(node);
    elements.push(node);
    if (!selfClose) stack.push({ tag, node });
    i = gt + 1;
  }
  if (stack.length) errors.push(`${name}: ${stack.length} Elemente nicht geschlossen (${stack.map((s) => s.tag).slice(-3).join(', ')})`);
  if (roots !== 1) errors.push(`${name}: ${roots} Wurzelelemente`);
  return { errors, elements };
}

// ---- Schriftdateien lesen (ohne Abhängigkeiten): PostScript-Name und abgedeckte Zeichen (cmap 3/10, 3/1, 0/x) ----
function readTtf(file) {
  const b = fs.readFileSync(file);
  const n = b.readUInt16BE(4);
  const T = {};
  for (let i = 0; i < n; i++) { const o = 12 + 16 * i; T[b.toString('latin1', o, o + 4)] = b.readUInt32BE(o + 8); }
  let ps = '';
  if (T.name !== undefined) {
    const o = T.name, cnt = b.readUInt16BE(o + 2), so = o + b.readUInt16BE(o + 4);
    for (let i = 0; i < cnt && !ps; i++) {
      const r = o + 6 + 12 * i;
      const pid = b.readUInt16BE(r), nid = b.readUInt16BE(r + 6), len = b.readUInt16BE(r + 8), off = b.readUInt16BE(r + 10);
      if (nid !== 6) continue;
      const raw = Buffer.from(b.subarray(so + off, so + off + len));
      ps = pid === 1 ? raw.toString('latin1') : raw.swap16().toString('utf16le');
    }
  }
  const cover = new Set();
  if (T.cmap !== undefined) {
    const o = T.cmap, cnt = b.readUInt16BE(o + 2);
    const subs = [];
    for (let i = 0; i < cnt; i++) { const r = o + 4 + 8 * i; subs.push({ pid: b.readUInt16BE(r), eid: b.readUInt16BE(r + 2), off: o + b.readUInt32BE(r + 4) }); }
    const rank = (s) => (s.pid === 3 && s.eid === 10 ? 0 : s.pid === 0 && s.eid >= 4 ? 1 : s.pid === 3 && s.eid === 1 ? 2 : s.pid === 0 ? 3 : 9);
    const sub = subs.sort((x, y) => rank(x) - rank(y))[0];
    if (sub && rank(sub) < 9) {
      const f = b.readUInt16BE(sub.off);
      if (f === 12) {
        const ng = b.readUInt32BE(sub.off + 12);
        for (let i = 0; i < ng; i++) {
          const r = sub.off + 16 + 12 * i, s0 = b.readUInt32BE(r), s1 = b.readUInt32BE(r + 4), g0 = b.readUInt32BE(r + 8);
          for (let c = s0; c <= s1; c++) if (g0 + (c - s0)) cover.add(c);
        }
      } else if (f === 4) {
        const segX2 = b.readUInt16BE(sub.off + 6);
        const endA = sub.off + 14, startA = endA + segX2 + 2, deltaA = startA + segX2, roA = deltaA + segX2;
        for (let i = 0; i < segX2 / 2; i++) {
          const end = b.readUInt16BE(endA + 2 * i), start = b.readUInt16BE(startA + 2 * i), delta = b.readInt16BE(deltaA + 2 * i), ro = b.readUInt16BE(roA + 2 * i);
          for (let c = start; c <= end && c !== 0xFFFF; c++) {
            let g;
            if (!ro) g = (c + delta) & 0xFFFF;
            else { g = b.readUInt16BE(roA + 2 * i + ro + 2 * (c - start)); if (g) g = (g + delta) & 0xFFFF; }
            if (g) cover.add(c);
          }
        }
      }
    }
  }
  return { ps, cover };
}

const propOf = (el, name) => {
  const P = el.children.find((c) => c.tag === 'Properties');
  const x = P && P.children.find((c) => c.tag === name);
  return x ? x.text : undefined;
};
const descendants = (node, pred, stop = new Set()) => {
  const out = [];
  const visit = (n) => n.children.forEach((c) => { if (pred(c)) out.push(c); if (!stop.has(c.tag)) visit(c); });
  visit(node);
  return out;
};
// Format-Kette (Self → … → Grundformat) für Absatz- und Zeichenformate
function styleChains(all) {
  const styles = new Map(all.filter((e) => e.tag === 'ParagraphStyle' || e.tag === 'CharacterStyle').map((e) => [e.attrs.Self, e]));
  return (self) => {
    const out = [];
    let s = styles.get(self), guard = 0;
    while (s && guard++ < 30) {
      out.push(s);
      const bo = propOf(s, 'BasedOn');
      if (!bo) break;
      const kind = s.tag === 'ParagraphStyle' ? 'ParagraphStyle/' : 'CharacterStyle/';
      const next = styles.get(bo.startsWith('$ID/') ? kind + bo : bo);
      if (!next || next === s) break;
      s = next;
    }
    return out;
  };
}

// Formatketten: Zyklen und Art des BasedOn-Ziels (styleChains bricht an Zyklen nur ab)
function checkStyleChains(all) {
  const errors = [];
  const rings = new Set();
  const bySelf = new Map(all.filter((e) => /^(Paragraph|Character|Object|Table|Cell)Style$/.test(e.tag)).map((e) => [e.attrs.Self, e]));
  for (const st of bySelf.values()) {
    const seen = [st.attrs.Self];
    let cur = st;
    for (;;) {
      const bo = propOf(cur, 'BasedOn');
      if (!bo) break;
      const tgt = bo.startsWith('$ID/') ? `${st.tag}/${bo}` : bo;
      const next = bySelf.get(tgt);
      if (!next) break;   // ungelöst: anderer Prüfpunkt
      if (next.tag !== st.tag) { errors.push(`${st.tag} „${st.attrs.Name}“: BasedOn verweist auf ${next.tag} ${tgt}`); break; }
      if (seen.includes(tgt)) {
        const ring = seen.slice(seen.indexOf(tgt));
        const key = ring.slice().sort().join('|');
        if (!rings.has(key)) { rings.add(key); errors.push(`${st.tag}: Zyklus über BasedOn (${[...ring, tgt].join(' → ')}) – betrifft alle darauf basierenden Formate`); }
        break;
      }
      seen.push(tgt);
      cur = next;
    }
  }
  return errors;
}

// Musterseiten: sichtbare Musterobjekte nur auf Seiten aus expect.masterPages (Fuß auf die Musterseite gewandert),
// jede Seite aus expect.masterPages zeigt sie; ohne Erwartung: keine Seitenobjekte doppelt an Musterobjekt-Stellen
function checkMasters(all, expect) {
  const errors = [];
  const num = (v) => (v || '').trim().split(/\s+/).map(Number);
  const bboxOf = (el) => {
    const pts = descendants(el, (c) => c.tag === 'PathPointType').map((c) => num(c.attrs.Anchor));
    if (!pts.length) return null;
    const m = num(el.attrs.ItemTransform || '1 0 0 1 0 0');
    const xs = pts.map((p) => m[0] * p[0] + m[2] * p[1] + m[4]), ys = pts.map((p) => m[1] * p[0] + m[3] * p[1] + m[5]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  };
  const ITEMS = new Set(['Rectangle', 'Oval', 'Polygon', 'GraphicLine', 'TextFrame']);
  const itemsOf = (sp) => sp.children.filter((c) => ITEMS.has(c.tag)).map((c) => ({ el: c, tag: c.tag, bb: bboxOf(c) })).filter((x) => x.bb);
  const left = (x) => (x.bb[0] + x.bb[2]) / 2 < 0;
  const masters = new Map(all.filter((e) => e.tag === 'MasterSpread').map((ms) => [ms.attrs.Self, { name: ms.attrs.Name, items: itemsOf(ms) }]));
  const mp = expect ? new Set(expect.masterPages || []) : null;
  for (const sp of all.filter((e) => e.tag === 'Spread')) {
    const show = sp.attrs.ShowMasterItems !== 'false';
    const own = itemsOf(sp);
    for (const pg of sp.children.filter((c) => c.tag === 'Page')) {
      const isLeft = num(pg.attrs.ItemTransform)[4] < -0.01;
      const m = masters.get(pg.attrs.AppliedMaster);
      const mItems = m ? m.items.filter((x) => left(x) === isLeft) : [];
      const visible = show && mItems.length > 0;
      const n = Number(pg.attrs.Name);
      if (visible) {
        for (const o of own.filter((x) => left(x) === isLeft)) {
          const d = mItems.find((x) => x.tag === o.tag && x.bb.every((v, i) => Math.abs(v - o.bb[i]) < 0.5));
          if (d) errors.push(`S. ${pg.attrs.Name}: ${o.tag} „${o.el.attrs.Name}“ liegt doppelt – auf der Seite und auf der Musterseite „${m.name}“ („${d.el.attrs.Name}“)`);
        }
      }
      if (mp && Number.isFinite(n)) {
        if (visible && !mp.has(n)) errors.push(`S. ${n}: zeigt die Objekte der Musterseite „${m.name}“, ihr Fuß ist aber nicht auf die Musterseite gewandert (Seite ohne Standard-Fußzeile oder doppelter Fuß)`);
        if (!visible && mp.has(n)) errors.push(`S. ${n}: Fuß liegt auf der Musterseite, deren Objekte sind auf der Seite aber nicht sichtbar (Fußzeile fehlt)`);
      }
    }
  }
  return errors;
}

// Silbentrennung: Trennbereich/Trennungen in Folge beim Ein-Zeilen-Setzer; Wörter ohne Trennstelle geschützt
function checkHyphenation(all) {
  const errors = [];
  let protectedWords = 0;
  const chain = styleChains(all);
  const DEF = { Composer: 'HL Composer', HyphenationZone: '36', HyphenateLadderLimit: '3', Hyphenation: 'true', HyphenateWordsLongerThan: '5', NoBreak: 'false' };
  const root = all.find((e) => e.attrs.Self === 'ParagraphStyle/$ID/[No paragraph style]');
  const pseq = (self) => { const c = chain(self); if (root && c[c.length - 1] !== root) c.push(root); return c; };
  const eff = (seq, k) => { for (const e of seq) if (e && e.attrs[k] !== undefined) return e.attrs[k]; return DEF[k]; };
  const single = (seq) => /^HL Single/.test(eff(seq, 'Composer'));
  const badZone = [];
  for (const st of all.filter((e) => e.tag === 'ParagraphStyle')) {
    const seq = pseq(st.attrs.Self);
    if (single(seq) && (Number(eff(seq, 'HyphenationZone')) !== 0 || Number(eff(seq, 'HyphenateLadderLimit')) !== 0)) {
      badZone.push(`${st.attrs.Name} (${eff(seq, 'HyphenationZone')} pt/${eff(seq, 'HyphenateLadderLimit')})`);
    }
  }
  if (badZone.length) errors.push(`${badZone.length} Absatzformate mit Ein-Zeilen-Setzer, aber Trennbereich bzw. Trennungen in Folge ≠ 0 (erwartet 0/0 wie Chromium): ${badZone.slice(0, 6).join(', ')}`);
  const unprot = [];
  for (const psr of all.filter((e) => e.tag === 'ParagraphStyleRange' && /^Stories\//.test(e.file))) {
    const seq = [psr, ...pseq(psr.attrs.AppliedParagraphStyle)];
    if (eff(seq, 'Hyphenation') !== 'true') continue;
    const min = Number(eff(seq, 'HyphenateWordsLongerThan')) + 1;
    // Zeichen mit NoBreak-Kennung, Absätze an <Br/> getrennt
    const paras = [[]];
    for (const csr of psr.children.filter((c) => c.tag === 'CharacterStyleRange')) {
      const nob = eff([csr, ...chain(csr.attrs.AppliedCharacterStyle), ...seq], 'NoBreak') === 'true';
      for (const k of csr.children) {
        if (k.tag === 'Content') for (const ch of k.text) paras[paras.length - 1].push([ch, nob]);
        else if (k.tag === 'Br') paras.push([]);
      }
    }
    for (const para of paras) {
      const text = para.map((x) => x[0]).join('');
      for (const m of text.matchAll(/[\p{L}\p{M}\u00AD]+/gu)) {
        const w = m[0];
        if ([...w.matchAll(/\p{L}/gu)].length < min) continue;
        if (w[0] === '\u00AD' && !w.slice(1).includes('\u00AD')) { protectedWords++; continue; }
        if (w.includes('\u00AD')) continue;
        if (para.slice(m.index, m.index + w.length).every((x) => x[1])) continue;   // ganz in NoBreak
        unprot.push(`„${w}“ (${psr.file})`);
      }
    }
  }
  if (unprot.length) errors.push(`${unprot.length} Wörter ab 8 Buchstaben ohne Trennstelle in Absätzen mit Silbentrennung – InDesign trennt sie nach Wörterbuch, Chromium nicht: ${unprot.slice(0, 6).join(', ')}`);
  return { errors, protectedWords };
}

// Glyphenabdeckung des gesetzten Texts (wirksamer Schnitt: Lauf lokal > Zeichenformat > Absatz lokal > Absatzformat)
const IGNORE_CH = /[\p{Zs}\p{Cc}\p{Cf}\u2028\u2029\uE000-\uF8FF]/u;
function checkGlyphs(all, fontsDir) {
  const errors = [], warnings = [];
  const byPs = new Map();
  if (fs.existsSync(fontsDir)) {
    for (const f of fs.readdirSync(fontsDir)) {
      if (!/\.(ttf|otf)$/i.test(f)) continue;
      try { const t = readTtf(path.join(fontsDir, f)); byPs.set(t.ps, t); } catch (e) { warnings.push(`Schrift ${f} nicht lesbar: ${e.message}`); }
    }
  }
  if (!byPs.size) { warnings.push(`Glyphenprüfung übersprungen: keine Schriften in ${fontsDir}`); return { errors, warnings, chars: 0 }; }
  const fontPs = new Map(all.filter((e) => e.tag === 'Font').map((e) => [`${e.attrs.FontFamily}\u0000${e.attrs.FontStyleName}`, e.attrs.PostScriptName]));
  const chain = styleChains(all);
  let chars = 0;
  const miss = new Map(), nofile = new Set();
  for (const psr of all.filter((e) => e.tag === 'ParagraphStyleRange' && /^Stories\//.test(e.file))) {
    const pchain = [psr, ...chain(psr.attrs.AppliedParagraphStyle)];
    for (const csr of psr.children.filter((c) => c.tag === 'CharacterStyleRange')) {
      const text = csr.children.filter((c) => c.tag === 'Content').map((c) => c.text).join('');
      if (!text) continue;
      const seq = [csr, ...chain(csr.attrs.AppliedCharacterStyle), ...pchain];
      const fam = seq.map((e) => propOf(e, 'AppliedFont')).find((v) => v !== undefined);
      const st = seq.map((e) => e.attrs.FontStyle).find((v) => v !== undefined);
      const font = byPs.get(fontPs.get(`${fam}\u0000${st}`));
      if (!font) { nofile.add(`${fam} ${st}`); continue; }
      for (const ch of text) {
        if (IGNORE_CH.test(ch)) continue;
        chars++;
        const cp = ch.codePointAt(0);
        if (font.cover.has(cp)) continue;
        const k = `${fam} ${st}|${cp}`;
        const e = miss.get(k) || { face: `${fam} ${st}`, cp, n: 0, files: new Set() };
        e.n++; e.files.add(psr.file);
        miss.set(k, e);
      }
    }
  }
  miss.forEach((e) => errors.push(`Glyphe fehlt: „${String.fromCodePoint(e.cp)}“ U+${e.cp.toString(16).toUpperCase().padStart(4, '0')} in ${e.face} (${e.n}×, ${[...e.files].slice(0, 3).join(', ')}) – InDesign zeigt eine Fehlglyphe`));
  nofile.forEach((f) => warnings.push(`Schnitt ${f} ohne Datei in Document Fonts – Glyphen nicht geprüft`));
  return { errors, warnings, chars };
}

// Rahmen: verfügbare Zeilenbreite je Absatz (Spaltenbreite − Einzüge) und Tabellenhöhe gegen Rahmenhöhe
function checkFrames(all) {
  const errors = [], warnings = [];
  const stories = new Map(all.filter((e) => e.tag === 'Story').map((e) => [e.attrs.Self, e]));
  const chain = styleChains(all);
  const attrOf = (seq, k) => { const v = seq.map((e) => e.attrs[k]).find((x) => x !== undefined); return v === undefined ? 0 : Number(v); };
  for (const tf of all.filter((e) => e.tag === 'TextFrame')) {
    const pts = descendants(tf, (c) => c.tag === 'PathPointType').map((c) => c.attrs.Anchor.split(/\s+/).map(Number));
    if (!pts.length) continue;
    const m = (tf.attrs.ItemTransform || '1 0 0 1 0 0').split(/\s+/).map(Number);
    const sx = Math.hypot(m[0], m[1]), sy = Math.hypot(m[2], m[3]);
    const w = (Math.max(...pts.map((p) => p[0])) - Math.min(...pts.map((p) => p[0]))) * sx;
    const h = (Math.max(...pts.map((p) => p[1])) - Math.min(...pts.map((p) => p[1]))) * sy;
    const tfp = tf.children.find((c) => c.tag === 'TextFramePreference');
    const cols = Number((tfp && tfp.attrs.TextColumnCount) || 1), gut = Number((tfp && tfp.attrs.TextColumnGutter) || 12);
    const colW = (w - (cols - 1) * gut) / cols;
    const story = stories.get(tf.attrs.ParentStory);
    if (!story) continue;
    for (const psr of descendants(story, (c) => c.tag === 'ParagraphStyleRange', new Set(['Table']))) {
      const seq = [psr, ...chain(psr.attrs.AppliedParagraphStyle)];
      const L = attrOf(seq, 'LeftIndent'), R = attrOf(seq, 'RightIndent'), F = attrOf(seq, 'FirstLineIndent');
      const avail = colW - L - R - Math.max(0, F);
      if (avail < 1) {
        const txt = descendants(psr, (c) => c.tag === 'Content').map((c) => c.text).join('').slice(0, 40);
        errors.push(`${psr.file}: Absatz „${txt}“ in Rahmen ${tf.attrs.Self} – Einzüge ${L}/${R}/${F} pt lassen von ${colW.toFixed(1)} pt Spaltenbreite ${avail.toFixed(1)} pt übrig`);
      }
    }
    for (const tb of descendants(story, (c) => c.tag === 'Table')) {
      const rows = tb.children.filter((c) => c.tag === 'Row').reduce((n, r) => n + Number(r.attrs.SingleRowHeight || 0), 0);
      const colsW = tb.children.filter((c) => c.tag === 'Column').reduce((n, c) => n + Number(c.attrs.SingleColumnWidth || 0), 0);
      if (rows > h + 0.5) warnings.push(`Tabelle ${tb.attrs.Self}: Zeilen ${rows.toFixed(1)} pt höher als der Rahmen ${h.toFixed(1)} pt (Übersatz)`);
      if (colsW > w + 0.5) errors.push(`Tabelle ${tb.attrs.Self}: Spalten ${colsW.toFixed(1)} pt breiter als der Rahmen ${w.toFixed(1)} pt`);
    }
  }
  return { errors, warnings };
}

function checkPackage(idmlPath, { xmllint = true, fontsDir = null, expect = null } = {}) {
  const errors = [], warnings = [];
  const buf = fs.readFileSync(idmlPath);
  const entries = readZip(buf);
  const first = entries[0];
  if (!first || first.name !== 'mimetype') errors.push('ZIP: „mimetype“ ist nicht der erste Eintrag');
  else {
    if (first.method !== 0) errors.push('ZIP: „mimetype“ ist komprimiert');
    if (first.extraLen !== 0) errors.push('ZIP: „mimetype“ hat ein Extra-Feld');
    if (first.data.toString('latin1') !== 'application/vnd.adobe.indesign-idml-package') errors.push('ZIP: „mimetype“ hat falschen Inhalt');
    if (first.dataOffset !== 38) errors.push(`ZIP: Inhalt von „mimetype“ beginnt bei Byte ${first.dataOffset} statt 38`);
  }
  const byName = new Map(entries.map((e) => [e.name, e]));
  const all = [];
  const hasXmllint = xmllint && (() => { try { execFileSync('xmllint', ['--version'], { stdio: 'ignore' }); return true; } catch (e) { return false; } })();
  for (const e of entries) {
    if (!e.name.endsWith('.xml')) continue;
    const text = e.data.toString('utf8');
    if (!text.startsWith('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')) errors.push(`${e.name}: XML-Deklaration fehlt/abweichend`);
    const r = parseXml(text, e.name);
    errors.push(...r.errors);
    all.push(...r.elements);
    if (hasXmllint) {
      try { execFileSync('xmllint', ['--noout', '-'], { input: e.data, stdio: ['pipe', 'ignore', 'pipe'] }); } catch (err) { errors.push(`${e.name}: xmllint: ${String(err.stderr || err.message).split('\n')[0]}`); }
    }
  }
  // Self-IDs
  const selfs = new Map();
  for (const el of all) {
    const s = el.attrs.Self;
    if (!s) continue;
    if (selfs.has(s)) errors.push(`Self doppelt: ${s} (${el.tag} in ${el.file} und ${selfs.get(s).tag} in ${selfs.get(s).file})`);
    else selfs.set(s, el);
  }
  const need = (val, what, el) => { if (!selfs.has(val)) errors.push(`Verweis ungelöst: ${what}="${val}" in <${el.tag}> (${el.file})`); };
  const builtin = new Set(['n', '']);
  const refAttrs = ['ParentStory', 'AppliedParagraphStyle', 'AppliedCharacterStyle', 'AppliedObjectStyle', 'AppliedTableStyle', 'AppliedCellStyle', 'ItemLayer', 'AppliedMaster', 'NextTextFrame', 'PreviousTextFrame', 'NextStyle', 'StrokeType', 'PageStart', 'SwatchItemRef', 'AppliedTrapPreset'];
  const colorAttr = /(Color|StopColor)$/;
  for (const el of all) {
    for (const [k, v] of Object.entries(el.attrs)) {
      if (refAttrs.includes(k) && !builtin.has(v)) need(v, k, el);
      else if (colorAttr.test(k) && /^(Color|Swatch|Gradient|Tint|MixedInk)\//.test(v)) need(v, k, el);
      else if (k === 'AppliedLanguage' && v) { if (!selfs.has('Language/' + v.replace(/:/g, '%3a'))) errors.push(`Sprache fehlt in designmap: ${v} (${el.file})`); }
    }
  }
  // designmap: src-Verweise, StoryList, Stories
  const dm = all.filter((e) => e.file === 'designmap.xml');
  const doc = dm.find((e) => e.tag === 'Document');
  if (!doc) errors.push('designmap.xml: <Document> fehlt');
  const dmText = byName.get('designmap.xml') ? byName.get('designmap.xml').data.toString('utf8') : '';
  if (!/<\?aid [^?]*type="document"/.test(dmText)) errors.push('designmap.xml: <?aid … type="document"?> fehlt');
  for (const e of dm) if (e.attrs.src && !byName.has(e.attrs.src)) errors.push(`designmap.xml: Datei fehlt: ${e.attrs.src}`);
  const storyFiles = entries.filter((e) => /^Stories\/.+\.xml$/.test(e.name)).map((e) => e.name);
  const referencedStories = dm.filter((e) => e.tag === 'idPkg:Story').map((e) => e.attrs.src);
  storyFiles.forEach((f) => { if (!referencedStories.includes(f)) errors.push(`Story nicht in designmap: ${f}`); });
  const storySelfs = all.filter((e) => e.tag === 'Story' || e.tag === 'XmlStory').map((e) => e.attrs.Self);
  const list = doc ? (doc.attrs.StoryList || '').split(/\s+/).filter(Boolean) : [];
  storySelfs.forEach((s) => { if (!list.includes(s)) errors.push(`StoryList ohne ${s}`); });
  list.forEach((s) => { if (!storySelfs.includes(s)) errors.push(`StoryList nennt unbekannte Story ${s}`); });
  // jede Story genau einmal als ParentStory
  const parents = all.filter((e) => e.tag === 'TextFrame').map((e) => e.attrs.ParentStory);
  storySelfs.filter((s) => all.find((e) => e.attrs.Self === s && e.tag === 'Story')).forEach((s) => { if (!parents.includes(s)) warnings.push(`Story ${s} ohne Textrahmen`); });
  // Schriften: AppliedFont + FontStyle (Formate, Bereiche) müssen in Fonts.xml stehen
  const fontKeys = new Set(all.filter((e) => e.tag === 'Font').map((e) => `${e.attrs.FontFamily}\u0000${e.attrs.FontStyleName}`));
  const fams = new Set(all.filter((e) => e.tag === 'FontFamily').map((e) => e.attrs.Name));
  const stylesXml = byName.get('Resources/Styles.xml') ? byName.get('Resources/Styles.xml').data.toString('utf8') : '';
  [...stylesXml.matchAll(/<AppliedFont type="string">([^<]*)<\/AppliedFont>/g)].forEach((m) => { if (!fams.has(m[1].replace(/&amp;/g, '&'))) errors.push(`Schriftfamilie nicht in Fonts.xml: ${m[1]}`); });
  for (const e of entries.filter((x) => /^Stories\//.test(x.name))) {
    [...e.data.toString('utf8').matchAll(/<AppliedFont type="string">([^<]*)<\/AppliedFont>/g)].forEach((m) => { if (!fams.has(m[1])) errors.push(`Schriftfamilie nicht in Fonts.xml: ${m[1]} (${e.name})`); });
  }
  // Formate: wirksame Familie + Stil (über die BasedOn-Kette) muss in Fonts.xml stehen
  const pstyles = all.filter((e) => e.tag === 'ParagraphStyle');
  const sChain = styleChains(all);
  for (const st of all.filter((e) => (e.tag === 'ParagraphStyle' || e.tag === 'CharacterStyle') && !/\$ID\//.test(e.attrs.Self))) {
    const seq = sChain(st.attrs.Self);
    const fam = seq.map((e) => propOf(e, 'AppliedFont')).find((v) => v !== undefined);
    const fst = seq.map((e) => e.attrs.FontStyle).find((v) => v !== undefined);
    if (st.tag === 'CharacterStyle' && (fam === undefined || fst === undefined)) continue;   // Zeichenformat ohne Schrift: erbt vom Absatz
    if (!fontKeys.has(`${fam}\u0000${fst}`)) errors.push(`Schnitt fehlt in Fonts.xml: ${fam} ${fst} (${st.attrs.Self})`);
  }
  // Verknüpfungen
  const dir = path.dirname(idmlPath);
  const linkEls = all.filter((e) => e.tag === 'Link');
  const missing = [...new Set(linkEls.map((l) => l.attrs.LinkResourceURI).filter((u) => u.startsWith('file:') && !fs.existsSync(path.join(dir, decodeURI(u.slice(5))))))];
  missing.forEach((m) => errors.push(`Verknüpfte Datei fehlt: ${m}`));
  // Glyphenabdeckung: jedes Zeichen im Text gegen die cmap des wirksamen Schnitts (Document Fonts) prüfen
  const glyph = checkGlyphs(all, fontsDir || path.join(path.dirname(idmlPath), 'Document Fonts'));
  errors.push(...glyph.errors);
  warnings.push(...glyph.warnings);
  // Satzbreite: Einzüge dürfen die Spaltenbreite nicht aufbrauchen; Tabellen passen in ihren Rahmen
  const geo = checkFrames(all);
  errors.push(...geo.errors);
  warnings.push(...geo.warnings);
  // Formatketten, Absatztrenner im Text, Musterseiten, Silbentrennung
  errors.push(...checkStyleChains(all));
  for (const c of all.filter((e) => e.tag === 'Content' && /^Stories\//.test(e.file))) {
    const m = c.text.match(/[\u2029\r\n\u0085]/);
    if (m) errors.push(`${c.file}: Absatztrenner U+${m[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0')} im <Content> – Absätze trennt in IDML nur <Br/>`);
  }
  errors.push(...checkMasters(all, expect));
  const hy = checkHyphenation(all);
  errors.push(...hy.errors);
  return {
    errors, warnings,
    stats: {
      entries: entries.length, xml: entries.filter((e) => e.name.endsWith('.xml')).length, selfs: selfs.size,
      spreads: entries.filter((e) => e.name.startsWith('Spreads/')).length, stories: storyFiles.length,
      pages: all.filter((e) => e.tag === 'Page' && e.file.startsWith('Spreads/')).length,
      textFrames: parents.length, tables: all.filter((e) => e.tag === 'Table').length, links: linkEls.length,
      paraStyles: pstyles.length, xmllint: hasXmllint, glyphChars: glyph.chars, protectedWords: hy.protectedWords,
    },
  };
}

module.exports = { checkPackage, parseXml };

if (require.main === module) {
  const argv = process.argv.slice(2);
  const f = argv.find((x, i) => !x.startsWith('--') && argv[i - 1] !== '--expect');
  if (!f) { console.error('Aufruf: node scripts/idml/check.cjs PAKET.idml [--expect ERWARTUNG.json] [--no-xmllint]'); process.exit(2); }
  const ei = argv.indexOf('--expect');
  const expect = ei > -1 ? JSON.parse(fs.readFileSync(argv[ei + 1], 'utf8')) : null;
  const r = checkPackage(path.resolve(f), { expect, xmllint: !argv.includes('--no-xmllint') });
  console.log(JSON.stringify(r.stats));
  r.warnings.slice(0, 20).forEach((w) => console.log('WARNUNG: ' + w));
  r.errors.slice(0, 50).forEach((e) => console.log('FEHLER: ' + e));
  console.log(r.errors.length ? `${r.errors.length} Fehler` : 'Paket in Ordnung');
  process.exit(r.errors.length ? 1 : 0);
}
