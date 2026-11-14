#!/usr/bin/env node
// Entwurfswerkzeug: baut Folienentwürfe in der Gestaltung des Vortrags, ohne den Ordner praesentation/ zu ändern.
// Theme, Layouts, Bausteine, Diagramme, Passprüfung, Zonenprüfung und Nachbearbeitung kommen per require aus praesentation/lib (nur lesen).
//
//   node konzepte/werkzeug/entwurf.cjs <ordner-mit-folienmodulen> <ausgabe.pptx> [Optionen]
//
//   --nur id1,id2        nur diese Folien des Ordners
//   --werte DATEI.json   Zahlenquelle für ctx.wert (Vorgabe: <ordner>/werte.json, sonst konzepte/mappe/werte_konzepte.json)
//   --ohne-wortlaut      Wortlautprobe ganz aus, auch wenn <ordner>/konzept.json Texte führt
//   --titel "Name"       Titel der Mappe in den Dateieigenschaften (Vorgabe: Name des Ordners)
//   --trotzdem           schreibt die Datei auch bei Fehlern der Passprüfung (nur zum Ansehen; Rückgabewert bleibt 1)
//
// Folienmodule: jede Datei <ordner>/*.cjs, deren Name nicht mit „_“ beginnt, in der Reihenfolge der Dateinamen (01-…, 02-…).
// Dateien mit „_“ am Anfang sind Hilfsdateien des Teams. Ein Modul exportiert wie im Vortrag { id, bau(ctx) } und dazu den Rahmen der Folie:
//   module.exports = { id: 'verlauf', o: { nr: '21', abschnitt: 'Modellrechnung', layout: 'PGN_DIAGRAMM_MR', kicker: 'MODELLRECHNUNG · VERLAUF',
//     titel: ['Zeile 1', 'Zeile 2'], akzent: 'Signaturwort', quellen: 'Quelle: …' }, bau(ctx) { const s = ctx.folie(); … } };
// Felder von o können auch in <ordner>/konzept.json stehen ({ "<id>": { … } }); die Datei gewinnt. Dort steht auch der Wortlaut für die Probe
// (Feld „inhalt“ wie in outline.json). Ohne „inhalt“ ist ctx.wortlaut eine reine Durchreiche.
// Ausgabe: <ausgabe.pptx> und daneben <ausgabe>.belege.json (jede Zahl aus ctx.wert und ctx.W mit Datei, Schlüssel, Blatt und Zelle).
'use strict';
const path = require('path'), fs = require('fs');

const PRAES = path.resolve(__dirname, '..', '..', 'praesentation');
const KONZEPTE = path.resolve(__dirname, '..');
const WERTE_VORGABE = path.join(KONZEPTE, 'mappe', 'werte_konzepte.json');
const lib = name => require(path.join(PRAES, 'lib', name.endsWith('.cjs') || name.endsWith('.json') ? name : name + '.cjs'));
// Hilfsdatei einer Baugruppe des Vortrags (folien/_rechnung.cjs usw.), nur lesen: ctx.vortrag('_rechnung')
const vortrag = name => require(path.join(PRAES, 'folien', name.endsWith('.cjs') ? name : name + '.cjs'));

// ---- Zahlen aus einer JSON-Datei: ctx.wert(schluessel, datei) ------------------------------------------------------------------------
// Unabhängig vom Aufbau der Datei. Gelesen werden:
//   { "schluessel": 12.3 }  ·  { "schluessel": { "wert": 12.3, "blatt": "…", "zelle": "…", … } }  ·  verschachtelt über Punktpfade
//   { "werte": { … } }  ·  { "laeufe": { "<lauf>": { "werte": { … } } } } (Aufbau von praesentation/daten/werte.json; Schlüssel „lauf:schluessel“,
//   ohne Lauf wird der Schlüssel in allen Läufen gesucht und muss eindeutig sein)
const _dateien = new Map();
function ladeJson(datei) {
  if (!_dateien.has(datei)) {
    if (!fs.existsSync(datei)) throw new Error(`ctx.wert: Datei „${datei}“ gibt es (noch) nicht. Andere Datei mit ctx.wert(schluessel, datei) oder --werte angeben.`);
    _dateien.set(datei, JSON.parse(fs.readFileSync(datei, 'utf8')));
  }
  return _dateien.get(datei);
}
const istEintrag = v => v !== null && typeof v === 'object' && !Array.isArray(v) && 'wert' in v;
function pfad(o, k) {
  if (o && typeof o === 'object' && k in o) return { ok: true, v: o[k] };
  let x = o;
  for (const t of k.split('.')) { if (x === null || typeof x !== 'object' || !(t in x)) return { ok: false }; x = x[t]; }
  return { ok: true, v: x };
}
function alleSchluessel(o, vor = '', aus = []) {
  if (o && typeof o === 'object' && !Array.isArray(o) && !istEintrag(o)) for (const [k, v] of Object.entries(o)) alleSchluessel(v, vor ? vor + '.' + k : k, aus);
  else aus.push(vor);
  return aus;
}
function suche(daten, schluessel, datei) {
  const fehlt = (kandidaten) => {
    const stamm = schluessel.replace(/^[^:]*:/, '').split('.').slice(0, 2).join('.');
    const nah = kandidaten.filter(k => k.includes(stamm)).slice(0, 12);
    return new Error(`ctx.wert: Schlüssel „${schluessel}“ fehlt in ${datei}.` + (nah.length ? ` Ähnliche Schlüssel: ${nah.join(', ')}` : ''));
  };
  if (daten && daten.laeufe && typeof daten.laeufe === 'object') {
    const m = schluessel.match(/^([^:]+):(.+)$/);
    if (m) {
      const L = daten.laeufe[m[1]];
      if (!L) throw new Error(`ctx.wert: Lauf „${m[1]}“ gibt es in ${datei} nicht. Vorhanden: ${Object.keys(daten.laeufe).join(', ')}`);
      const r = pfad(L.werte || L, m[2]);
      if (!r.ok) throw fehlt(Object.keys(L.werte || L).map(k => m[1] + ':' + k));
      return { roh: r.v, lauf: m[1] };
    }
    const treffer = Object.entries(daten.laeufe).filter(([, L]) => pfad(L.werte || L, schluessel).ok);
    if (treffer.length === 1) return { roh: pfad(treffer[0][1].werte || treffer[0][1], schluessel).v, lauf: treffer[0][0] };
    if (treffer.length > 1) {
      // in mehreren Läufen: eindeutig nur, wenn überall derselbe Wert steht
      const werte = treffer.map(([, L]) => JSON.stringify((v => istEintrag(v) ? v.wert : v)(pfad(L.werte || L, schluessel).v)));
      if (new Set(werte).size === 1) return { roh: pfad(treffer[0][1].werte || treffer[0][1], schluessel).v, lauf: treffer[0][0] };
      throw new Error(`ctx.wert: Schlüssel „${schluessel}“ steht in ${datei} in mehreren Läufen mit verschiedenen Werten (${treffer.map(t => t[0]).join(', ')}). Schreibweise „lauf:schluessel“.`);
    }
    throw fehlt(Object.entries(daten.laeufe).flatMap(([n, L]) => Object.keys(L.werte || L).map(k => n + ':' + k)));
  }
  for (const quelle of [daten, daten && daten.werte].filter(Boolean)) {
    const r = pfad(quelle, schluessel);
    if (r.ok) return { roh: r.v, lauf: null };
  }
  throw fehlt(alleSchluessel(daten && daten.werte ? daten.werte : daten));
}

// ---- Titel und Rahmentexte aus dem Feld „inhalt“ (wie build.cjs des Vortrags) -------------------------------------------------------------
const zitat = (inh, re) => { const m = inh.match(re); return m ? m[1] : null; };
function leseTitel(inh) {
  const m = inh.match(/(?<![A-Za-zÄÖÜäöüß])Titel(?:zeilen)?(?: in \w+ Zeilen)?: (?=„)/);
  if (!m) return null;
  let rest = inh.slice(m.index + m[0].length), stimme = null;
  const zeilen = [];
  for (;;) {
    const z = rest.match(/^„([^“]+)“(?:\s*\(([^)]*)\))?/);
    if (!z) break;
    zeilen.push(z[1]);
    if (z[2] && /zweite Stimme/.test(z[2])) stimme = zeilen.length - 1;
    rest = rest.slice(z[0].length);
    const sep = rest.match(/^\s*\|\s*/);
    if (!sep) break;
    rest = rest.slice(sep[0].length);
  }
  const ak = inh.slice(m.index, m.index + 700).match(/Signaturwort:? „([^“]+)“/);
  return { zeilen, stimme, akzent: ak ? ak[1] : null };
}

function argumente(argv) {
  const a = { ordner: null, aus: null, nur: null, werte: null, wortlaut: true, titel: null, trotzdem: false };
  const frei = [];
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--trotzdem') a.trotzdem = true;
    else if (k === '--ohne-wortlaut') a.wortlaut = false;
    else if (['--nur', '--werte', '--titel'].includes(k)) {
      const v = argv[++i];
      if (!v) throw new Error(`${k} braucht einen Wert.`);
      if (k === '--nur') a.nur = v.split(',').map(s => s.trim()).filter(Boolean); else a[k.slice(2)] = v;
    } else if (k.startsWith('--')) throw new Error(`Unbekanntes Argument „${k}“. Erlaubt: --nur id1,id2 · --werte datei.json · --ohne-wortlaut · --titel "Name" · --trotzdem`);
    else frei.push(k);
  }
  [a.ordner, a.aus] = frei;
  if (!a.ordner || !a.aus || frei.length > 2) throw new Error('Aufruf: node entwurf.cjs <ordner-mit-folienmodulen> <ausgabe.pptx> [--nur id1,id2] [--werte datei.json] [--ohne-wortlaut] [--titel "Name"] [--trotzdem]');
  if (!/\.pptx$/i.test(a.aus)) throw new Error(`Ausgabe „${a.aus}“: erwartet wird eine Datei mit der Endung .pptx.`);
  return a;
}

async function main() {
  const arg = argumente(process.argv.slice(2));
  const pptxgen = require(require.resolve('pptxgenjs', { paths: [PRAES] }));
  const T = lib('theme'), { definiereLayouts, layoutBeschreibung, LAYOUTS } = lib('layouts');
  const { bausteine, titelLaeufe, titelPruefzeilen, titelKollisionen, schutz } = lib('bausteine');
  const { diagramme } = lib('diagramme'), daten = lib('daten'), { Pruefung, breite } = lib('passpruefung');
  const { ueberwache, pruefeZonen } = lib('zonenpruefung'), { nachbearbeiten } = lib('nachbearbeitung'), { asset } = lib('assets');
  const TITEL_LUFT = 5, BEHALTEN = ['anlass'];

  const ordner = path.resolve(arg.ordner), ziel = path.resolve(arg.aus);
  if (!fs.existsSync(ordner) || !fs.statSync(ordner).isDirectory()) throw new Error(`Ordner „${ordner}“ gibt es nicht.`);
  if (ziel.startsWith(PRAES + path.sep)) throw new Error('Die Ausgabe darf nicht in praesentation/ liegen; der Vortrag bleibt unverändert.');
  const werteDatei = arg.werte ? path.resolve(arg.werte) : (fs.existsSync(path.join(ordner, 'werte.json')) ? path.join(ordner, 'werte.json') : WERTE_VORGABE);
  const konzeptDatei = path.join(ordner, 'konzept.json');
  let konzept = fs.existsSync(konzeptDatei) ? JSON.parse(fs.readFileSync(konzeptDatei, 'utf8')) : {};
  if (konzept.folien && !Array.isArray(konzept.folien)) konzept = konzept.folien;

  // ---- Folienliste -----------------------------------------------------------------------------------------------------------------------
  const dateien = fs.readdirSync(ordner).filter(f => f.endsWith('.cjs') && !f.startsWith('_')).sort((a, b) => a.localeCompare(b, 'de', { numeric: true }));
  let liste = dateien.map((f, i) => {
    const modul = require(path.join(ordner, f));
    if (!modul || typeof modul.id !== 'string' || typeof modul.bau !== 'function') throw new Error(`${f}: erwartet wird module.exports = { id: '…', o: { … }, bau(ctx) }.`);
    const o = { nr: String(i + 1), abschnitt: 'Modellrechnung', layout: 'PGN_INHALT', inhalt: '', ...(modul.o || {}), ...(konzept[modul.id] || {}), id: modul.id, datei: f };
    o.nr = String(o.nr);
    return { o, modul };
  });
  const doppelt = liste.map(e => e.o.id).filter((id, i, a) => a.indexOf(id) !== i);
  if (doppelt.length) throw new Error(`Folienkennung doppelt: ${[...new Set(doppelt)].join(', ')}`);
  if (arg.nur) {
    const fremd = arg.nur.filter(id => !liste.some(e => e.o.id === id));
    if (fremd.length) throw new Error(`--nur: unbekannte Folien ${fremd.join(', ')}. Vorhanden: ${liste.map(e => e.o.id).join(', ')}`);
    liste = liste.filter(e => arg.nur.includes(e.o.id));
  }
  if (!liste.length) throw new Error(`Keine Folie zu bauen: In ${ordner} liegt kein Modul *.cjs (Hilfsdateien beginnen mit „_“).`);

  // Zeichen des Abschnitts im Kopf: Zählung des Vortrags (Ausgangslage 1, Programmteil 2.1 2, Modellrechnung 3, Umsetzung 4, Anhang A).
  // Ein Abschnitt, den der Vortrag nicht hat, braucht o.zeichen; sonst steht „·“
  const vortragsOutline = daten.outline();
  const hauptAbschnitte = [...new Set(vortragsOutline.folien.map(f => f.abschnitt).filter(a => a !== 'Anhang'))];
  const abschnittszeichen = o => o.zeichen !== undefined ? String(o.zeichen) : o.abschnitt === 'Anhang' ? 'A' : (hauptAbschnitte.indexOf(o.abschnitt) + 1 || '·').toString();

  // ---- Mappe ------------------------------------------------------------------------------------------------------------------------------
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: T.THEME.headFontFace, bodyFontFace: T.THEME.bodyFontFace };
  pres.title = arg.titel || `Entwurf ${path.basename(ordner)}`;
  pres.subject = 'RL Mietwohnraum 2026, Entwurf';
  pres.author = T.FIRMA; pres.company = T.FIRMA; pres.revision = '1';
  definiereLayouts(pres);

  const P = new Pruefung(), anweisungen = {}, leer = {}, tabellen = {}, altTexte = {}, warnungen = [], belege = {};
  const warnAlt = console.warn;
  console.warn = (...a) => { warnungen.push(a.join(' ')); };
  const abschnitte = new Set();
  let wortlautAus = 0;

  liste.forEach(({ o, modul }, nr) => {
    const lay = LAYOUTS[o.layout];
    if (!lay) throw new Error(`Folie „${o.id}“: Layout „${o.layout}“ gibt es nicht. Vorhanden: ${Object.keys(LAYOUTS).join(', ')}`);
    P.setzeFolie(o.id);
    if (!abschnitte.has(o.abschnitt)) { pres.addSection({ title: o.abschnitt }); abschnitte.add(o.abschnitt); }
    else if (nr > 0 && liste[nr - 1].o.abschnitt !== o.abschnitt) throw new Error(`Folie „${o.id}“: Der Abschnitt „${o.abschnitt}“ kommt zum zweiten Mal. Abschnitte müssen in der Folienfolge zusammenhängen (Dateien umbenennen oder o.abschnitt angleichen).`);
    let slide = null, formen = [], thema = null;
    const ausnahmen = new Map(), zuletzt = [], inh = String(o.inhalt || ''), mitWortlaut = arg.wortlaut && inh.trim().length > 0;
    if (!mitWortlaut) wortlautAus++;
    const datei = `slide${nr + 1}.xml`;
    const kx = { grund: lay.grund, art: lay.art, P, layout: o.layout, merke: (d, anw) => { anweisungen[d] = anw; }, tabelle: t => { (tabellen[datei] = tabellen[datei] || []).push(t); },
      altText: (name, text) => {
        const a = altTexte[datei] = altTexte[datei] || {};
        if (name in a) throw new Error(`Folie „${o.id}“: Der Alternativtext für die Form „${name}“ ist zweimal gesetzt. Objektnamen mit Alternativtext sind je Folie eindeutig.`);
        a[name] = text;
      } };
    const B = bausteine(pres, kx), D = diagramme(pres, kx), cs = T.GRUND[lay.grund];

    function folie(opt = {}) {
      if (slide) throw new Error(`Folie „${o.id}“: ctx.folie() wurde zweimal aufgerufen.`);
      slide = pres.addSlide({ masterName: o.layout, sectionTitle: o.abschnitt });
      formen = ueberwache(slide);
      const hat = f => lay.felder.includes(f);
      const gelesen = leseTitel(inh) || {};
      let zeilen = opt.titel || (Array.isArray(o.titel) ? o.titel : null) || gelesen.zeilen || null;
      if (typeof zeilen === 'string') zeilen = [zeilen];
      if ((!zeilen || !zeilen.length) && typeof o.titel === 'string' && (lay.art === 'anhang' || lay.art === 'abschnitt')) zeilen = [o.titel];
      if (!zeilen || !zeilen.length) throw new Error(`Folie „${o.id}“: Titelzeilen fehlen. ctx.folie({ titel: ['Zeile 1', 'Zeile 2'], akzent: 'Signaturwort' }) oder o.titel als Liste.`);
      o.titelText = zeilen.join(' ');
      const akzent = opt.akzent !== undefined ? opt.akzent : o.akzent !== undefined ? o.akzent : gelesen.akzent;
      const stimme = opt.stimme !== undefined ? opt.stimme : o.stimme !== undefined ? o.stimme : gelesen.stimme;
      const t = lay.titel;
      if (zeilen.length < t.min || zeilen.length > t.max) P.melde(`Titel hat ${zeilen.length} Zeile(n); das Layout ${o.layout} verlangt ${t.min === t.max ? t.min : t.min + ' bis ' + t.max}. Zeilen: ${zeilen.join(' | ')}`);
      if (lay.art === 'inhalt' && !akzent) P.melde('Titel ohne Signaturwort (genau eine Wortgruppe in Montserrat ExtraBold kursiv).');
      if (akzent && !zeilen.some(z => z.includes(akzent))) P.melde(`Signaturwort „${akzent}“ steht in keiner Titelzeile.`);
      const pruefzeilen = titelPruefzeilen(zeilen, { akzent, stimme }, { fontFace: T.F.black, fontSize: t.pt });
      pruefzeilen.forEach((l, i) => P.zeile(`Titelzeile ${i + 1} (${t.pt} pt)`, l, null, t.breite));
      if (zeilen.some(z => /\.$/.test(z)) && lay.art !== 'titel' && lay.art !== 'schluss') P.hinweis('Titel endet mit einem Punkt.');
      const abstand = {};
      for (const k of titelKollisionen(pruefzeilen)) {
        if (!opt.titelAbstand && t.zeile >= t.pt + TITEL_LUFT) continue;
        abstand[k.zeile] = opt.titelAbstand || t.pt + TITEL_LUFT;
        P.hinweis(`Titel: „${k.oben}“ in Zeile ${k.zeile} steht über „${k.unten}“ in Zeile ${k.zeile + 1}. Zeile ${k.zeile + 1} bekommt ${abstand[k.zeile]} pt Zeilenabstand.`);
      }
      slide.addText(titelLaeufe(zeilen, { akzent, stimme, abstand, akzentFarbe: lay.grund === 'rot' ? null : cs.signatur }), { placeholder: 'title' });
      // Kopf (Abschnitt mit Zeichen) und Schriftfeld (Thema): Kicker „ABSCHNITT · THEMA“
      const kicker = opt.kicker !== undefined ? opt.kicker : o.kicker !== undefined ? o.kicker : zitat(inh, /Kicker: „([^“]+)“/) || `${o.abschnitt} · ${o.thema || 'Entwurf'}`;
      if (hat('kicker')) {
        const [kAbschnitt, ...kRest] = String(kicker).split(' · ');
        const k = T.versal(kAbschnitt);
        thema = kRest.join(' · ') || null;
        if (opt.kopfzeichen !== false) B.achskreis(slide, { cx: T.X0 + 0.15, cy: T.Y.kicker + 0.15, groesse: 'S', text: abschnittszeichen(o), name: 'Abschnitt im Kopf' });
        P.zeile('Kicker', k, { fontFace: T.F.mont, bold: true, fontSize: 12, weite: 1.0 }, +(T.Y.kickerW / 1.1).toFixed(2));
        slide.addText(k, { placeholder: 'kicker' });
      }
      if (hat('rubrik')) {
        const r = T.versal(opt.rubrik !== undefined ? opt.rubrik : o.rubrik !== undefined ? o.rubrik : zitat(inh, /Rubrik[^:„“]*: „([^“]+)“/) || thema || kicker || o.abschnitt);
        P.zeile('Rubrik im Schriftfeld', r, { fontFace: T.F.mont, bold: true, fontSize: 10, weite: 0.6 }, lay.art === 'abschnitt' ? 7.0 : 8.0);
        kx.rubrik = r;
        zuletzt.push(() => slide.addText(r, { placeholder: 'rubrik' }));
      }
      if (hat('blatt')) zuletzt.push(() => slide.addText(String(o.nr), { placeholder: 'blatt' }));
      if (lay.art === 'abschnitt') {
        const n = opt.nr !== undefined ? opt.nr : o.achskreis !== undefined ? o.achskreis : zitat(inh, /Achskreis XL: „([^“]+)“/);
        if (n === null || n === undefined) throw new Error(`Folie „${o.id}“: Nummer für den Achskreis fehlt (ctx.folie({ nr })).`);
        slide.addText(String(n), { placeholder: 'nr' });
        const lead = opt.lead !== undefined ? opt.lead : o.lead !== undefined ? o.lead : zitat(inh, /Lead: „([^“]+)“/);
        if (lead) { P.block('Vorspann', lead, { fontFace: T.F.text, fontSize: 18, zeileMal: 1.1 }, 8.0, 1.40, { luft: true }); slide.addText(schutz(lead), { placeholder: 'lead' }); }
      }
      if (hat('untertitel')) {
        const u = opt.untertitel !== undefined ? opt.untertitel : o.untertitel !== undefined ? o.untertitel : zitat(inh, /Untertitel: „([^“]+)“/);
        if (u) { P.block('Untertitel', u, { fontFace: T.F.text, fontSize: 18, zeileMal: 1.1 }, lay.art === 'titel' ? 6.3 : 5.4, lay.art === 'titel' ? 1.15 : 1.2, { luft: true }); slide.addText(schutz(u), { placeholder: 'untertitel' }); }
      }
      if (hat('anlass') && opt.anlass) slide.addText(opt.anlass, { placeholder: 'anlass' });
      if (!o.quellen) P.hinweis('Quellenangabe fehlt (o.quellen, etwa „Quelle: Rechenmappe v3, Blatt …“).');
      return slide;
    }

    // Zahlen mit Beleg: jede Zahl aus ctx.wert und ctx.W wird mit Datei, Schlüssel, Blatt und Zelle in <ausgabe>.belege.json festgehalten
    const merkeBeleg = b => { const l = belege[o.id] = belege[o.id] || []; if (!l.some(x => x.datei === b.datei && x.schluessel === b.schluessel)) l.push(b); };
    const relativ = d => path.relative(path.resolve(KONZEPTE, '..'), d);
    const eintragAus = (schluessel, d) => {
      const dateiPfad = d ? (path.isAbsolute(d) ? d : path.resolve(ordner, d)) : werteDatei;
      const { roh, lauf } = suche(ladeJson(dateiPfad), String(schluessel), relativ(dateiPfad));
      const e = istEintrag(roh) ? roh : { wert: roh };
      merkeBeleg({ datei: relativ(dateiPfad), schluessel: String(schluessel), lauf: lauf || e.lauf || null, wert: e.wert, einheit: e.einheit || null, blatt: e.blatt || null, zelle: e.zelle || null });
      return e;
    };
    const wert = (schluessel, d) => eintragAus(schluessel, d).wert;
    wert.eintrag = eintragAus;
    // „Blatt!Zelle“ des Eintrags (für Quellenangaben und Annahmentabellen); null, wenn die Datei keine Zelle führt
    wert.zelle = (schluessel, d) => { const e = eintragAus(schluessel, d); return e.blatt && e.zelle ? `${e.blatt}!${e.zelle}` : null; };
    wert.reihe = (schluessel, von = 1, bis = null, d) => {
      const v = wert(schluessel, d);
      if (!Array.isArray(v)) throw new Error(`ctx.wert.reihe: „${schluessel}“ ist keine Reihe.`);
      return v.slice(von - 1, bis === null ? undefined : bis);
    };
    wert.datei = werteDatei;
    // Werte des Vortrags (praesentation/daten/werte.json), nur lesen; ohne die Sperre einzelner Läufe (die Entscheidung E5 ist für die Konzepte aufgehoben)
    const W = Object.assign((lauf, k) => { const e = daten.W.eintrag(lauf, k); merkeBeleg({ datei: 'praesentation/daten/werte.json', schluessel: `${lauf}:${k}`, lauf, wert: e.wert, einheit: e.einheit || null, blatt: e.blatt || null, zelle: e.zelle || null }); return e.wert; },
      { eintrag: (lauf, k) => daten.W.eintrag(lauf, k), reihe: (lauf, k, von = 1, bis = 35) => { W(lauf, k); return daten.W.reihe(lauf, k, von, bis); }, laeufe: daten.W.laeufe, meta: daten.W.meta });

    const gross = t => daten.glatt(t).toLocaleUpperCase('de-DE');
    const ctx = {
      pres, C: T.C, HEX: T.HEX, F: T.F, Raster: T.Raster, colX: T.colX, span: T.span, Y: T.Y, ZONE: T.ZONE, SKALA: T.SKALA,
      B, D, W, wert, fmt: daten.fmt, X: daten.X, o, outline: { folien: liste.map(e => e.o) }, asset, P, grund: lay.grund, farben: cs, versal: T.versal, schutz, folie,
      glatt: daten.glatt, zahlwort: daten.zahlwort, fuelle: daten.fuelle, mittel: daten.mittel, breite, lib, vortrag, ordner,
      // Wortlautprobe gegen das Feld „inhalt“ (o.inhalt oder konzept.json); ohne Text im Feld eine Durchreiche
      wortlaut(text, was) {
        if (mitWortlaut && !gross(inh).includes(gross(text))) P.melde(`Wortlautprobe${was ? ' ' + was : ''}: „${daten.glatt(text)}“ steht so nicht im Feld „inhalt“ (${o.datei} oder konzept.json).`);
        return text;
      },
      titelzeilen(zeilen, akzent) {
        if (mitWortlaut) {
          const gelesen = leseTitel(inh), g = t => daten.glatt(String(t));
          if (gelesen && (gelesen.zeilen.map(g).join(' | ') !== zeilen.map(g).join(' | ') || g(gelesen.akzent || '') !== g(akzent || '')))
            P.melde(`Titelzeilen: „${zeilen.map(g).join('“ | „')}“ (Signaturwort „${g(akzent || '')}“); im Feld „inhalt“ stehen „${gelesen.zeilen.map(g).join('“ | „')}“ (Signaturwort „${g(gelesen.akzent || '')}“).`);
        }
        return { titel: zeilen, akzent };
      },
      gleich(was, a, b, nk = 2) { if (daten.fmt.zahl(a, nk) !== daten.fmt.zahl(b, nk)) P.melde(`Gegenprobe ${was}: ${daten.fmt.zahl(a, nk)} gegen ${daten.fmt.zahl(b, nk)}.`); },
      // Aussage gegen die Zahlen prüfen: ctx.pruefe(bedingung, 'Meldung'); bricht den Bau ab, wenn die Bedingung nicht gilt
      pruefe(bedingung, meldung) { if (!bedingung) P.melde(`Aussage stimmt nicht: ${meldung}`); },
      lies(d, felder = {}) { return (p, mehr) => daten.fuelle(daten.X(d, p), mehr ? { ...felder, ...mehr } : felder, `daten/${d}.json`); },
      get daten() { return Object.fromEntries(daten.DATEIEN.filter(n => n !== 'probe').map(n => [n, daten.datei(n)])); },
      get slide() { return slide; },
      zoneAusnahme(name, grund) {
        if (!name || !grund || String(grund).trim().length < 8) throw new Error('ctx.zoneAusnahme(name, grund): Objektname und ein Grund in Worten sind Pflicht.');
        ausnahmen.set(String(name), String(grund));
      },
    };
    try { modul.bau(ctx); } catch (e) { e.message = `Folie „${o.id}“ (${o.datei}): ${e.message}`; throw e; }
    if (!slide) throw new Error(`Folie „${o.id}“: bau(ctx) hat ctx.folie() nicht aufgerufen.`);
    for (const f of zuletzt) f();
    pruefeZonen(formen, { art: lay.art, layout: o.layout }, P, ausnahmen);

    const layout = pres.slideLayouts.find(l => l._name === o.layout);
    const gefuellt = new Set(slide._slideObjects.filter(x => x.options && x.options.placeholder).map(x => x.options.placeholder));
    for (const name of gefuellt) if (!lay.felder.includes(name)) P.melde(`Platzhalter „${name}“ gibt es im Layout ${o.layout} nicht (vorhanden: ${lay.felder.join(', ')}).`);
    const weg = layout._slideObjects.filter(x => x._type === 'placeholder' && !gefuellt.has(x.options.placeholder) && !BEHALTEN.includes(x.options.placeholder)).map(x => x.options._placeholderIdx);
    if (weg.length) leer[datei] = weg;
  });

  // ---- Prüfen, schreiben, nachbearbeiten ------------------------------------------------------------------------------------------------------
  for (const h of P.hinweise) console.log(`Hinweis · Folie „${h.folie}“: ${h.text}`);
  if (wortlautAus) console.log(`Hinweis · Wortlautprobe aus für ${wortlautAus} von ${liste.length} Folien (kein Feld „inhalt“ in o oder konzept.json${arg.wortlaut ? '' : '; --ohne-wortlaut'}).`);
  if (P.fehler.length) console.error(`Passprüfung: ${P.fehler.length} Fehler\n` + P.bericht());
  if (P.fehler.length && !arg.trotzdem) { console.warn = warnAlt; console.error('Abbruch: Die Datei wurde nicht geschrieben. Zum Ansehen trotz Fehlern: --trotzdem'); process.exit(1); }

  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  await pres.writeFile({ fileName: ziel });
  console.warn = warnAlt;
  const st = String(daten.X('rahmen', 'titel.datum_datei')).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  const stat = await nachbearbeiten(ziel, { theme: T.THEME, firma: T.FIRMA, schraffur: { merkfarbe: T.HEX.schraffur, bg: T.HEX.eigenmittel, fg: T.HEX.schraffurLinie }, diagramme: anweisungen, leerePlatzhalter: leer,
    folientitel: liste.map(e => e.o.titelText || (Array.isArray(e.o.titel) ? e.o.titel.join(' ') : e.o.titel) || e.o.id), schriften: Object.values(T.F), layouts: layoutBeschreibung(pres), tabellen, altTexte, lagen: {},
    datum: st ? `${st[3]}-${st[2]}-${st[1]}T00:00:00Z` : '2026-11-13T00:00:00Z' });
  const belegDatei = ziel.replace(/\.pptx$/i, '.belege.json');
  fs.writeFileSync(belegDatei, JSON.stringify({ werte_datei: path.relative(path.resolve(KONZEPTE, '..'), werteDatei), folien: belege }, null, 1) + '\n');
  const zahl = Object.values(belege).reduce((s, l) => s + l.length, 0), ohneZelle = Object.values(belege).flat().filter(b => !b.blatt || !b.zelle);
  console.log(`${ziel} · ${liste.length} Folien · Abschnitte: ${[...abschnitte].join(', ')}`);
  console.log(`Nachbearbeitung: ${stat.diagrammSchema} Stellen der Diagramme nach Schema, ${stat.altTexte} Formen mit Alternativtext, ${stat.tabellen} Tabellen gekennzeichnet, ${stat.platzhalter} leere Platzhalter entfernt`);
  console.log(`Belege: ${zahl} Werte in ${path.basename(belegDatei)}` + (ohneZelle.length ? ` · Hinweis: ${ohneZelle.length} ohne Blatt und Zelle (${ohneZelle.slice(0, 5).map(b => b.schluessel).join(', ')}${ohneZelle.length > 5 ? ' …' : ''})` : ''));
  if (!stat.masterAbstand) { console.error('Nachbearbeitung: Der Absatzabstand im Master wurde nicht gefunden.'); process.exit(1); }
  for (const a of stat.absatzAbweichend) console.log(`Hinweis · ${a}: Die Läufe dieses Absatzes tragen verschiedene Absatzeigenschaften; es gilt die des ersten Laufs.`);
  if (warnungen.length) { console.error('Warnungen von pptxgenjs (gelten als Fehler; meist eine ungültige Farbe oder Option):\n' + [...new Set(warnungen)].map(w => '  ' + w).join('\n')); process.exit(1); }
  if (P.fehler.length) process.exit(1);
}

module.exports = { PRAES, KONZEPTE, lib, vortrag, WERTE_VORGABE };
if (require.main === module) main().catch(e => { console.error('Fehler: ' + e.message); process.exit(1); });
