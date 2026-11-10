#!/usr/bin/env node
// Baut die Vortragsmappe aus daten/outline.json und den Folienmodulen in folien/<id>.cjs.
//   node build.cjs                          ganze Mappe → dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pptx
//   node build.cjs --nur id1,id2            nur diese Folien (Foliennummer und Abschnitt wie im Konzept)
//   node build.cjs --gruppe regeln          alle Folien einer Baugruppe → dist/teil-regeln.pptx
//   node build.cjs --aus dist/datei.pptx    Zieldatei
//   node build.cjs --probe                  Musterfolien aus probe/ → dist/probe/planwerk-probe.pptx
//   node build.cjs --trotzdem               schreibt die Datei auch bei Fehlern der Passprüfung (nur zum Ansehen; Rückgabewert bleibt 1)
'use strict';
const path = require('path'), fs = require('fs');
const pptxgen = require('pptxgenjs');
const T = require('./lib/theme.cjs');
const { definiereLayouts, layoutBeschreibung, LAYOUTS } = require('./lib/layouts.cjs');
const { bausteine, titelLaeufe, titelPruefzeilen, titelKollisionen, schutz } = require('./lib/bausteine.cjs');
const { diagramme } = require('./lib/diagramme.cjs');
const daten = require('./lib/daten.cjs');
const { Pruefung } = require('./lib/passpruefung.cjs');
const { ueberwache, pruefeZonen } = require('./lib/zonenpruefung.cjs');
const { nachbearbeiten } = require('./lib/nachbearbeitung.cjs');
const { asset } = require('./lib/assets.cjs');

const ROOT = __dirname;
const ZIEL = 'dist/PGN-Mietwohnraumfoerderung-Niedersachsen-2026-Vortrag.pptx';
const BEHALTEN = ['anlass'];   // leere Platzhalter, die als Eingabefeld stehen bleiben (Titelfolie: „Ort, Datum“)
const TITEL_LUFT = 5;          // Zuschlag in pt auf den Schriftgrad für eine Titelzeile, über deren Umlaut ein Zeichen mit Unterlänge steht

function argumente(argv) {
  const a = { nur: null, aus: null, probe: false, gruppe: null, trotzdem: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--probe') a.probe = true;
    else if (k === '--trotzdem') a.trotzdem = true;
    else if (k === '--nur' || k === '--aus' || k === '--gruppe') {
      const v = argv[++i];
      if (!v) throw new Error(`${k} braucht einen Wert.`);
      if (k === '--nur') a.nur = v.split(',').map(s => s.trim()).filter(Boolean); else a[k.slice(2)] = v;
    } else throw new Error(`Unbekanntes Argument „${k}“. Erlaubt: --nur id1,id2 · --gruppe name · --aus datei.pptx · --probe · --trotzdem`);
  }
  return a;
}

// Kicker, Titelzeilen, Signaturwort und weitere Rahmentexte aus dem Feld „inhalt“ des Konzepts lesen
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

async function main() {
  const arg = argumente(process.argv.slice(2));
  const outline = daten.outline();

  // ---- Folienliste ------------------------------------------------------------------------------------------------
  let liste;   // [{ o, modul }]
  if (arg.probe) {
    const dir = path.join(ROOT, 'probe');
    liste = fs.readdirSync(dir).filter(f => f.endsWith('.cjs')).sort().map(f => {
      const modul = require(path.join(dir, f));
      if (!modul.o || !modul.bau) throw new Error(`probe/${f}: Musterfolien exportieren { id, o, bau }.`);
      return { o: { abschnitt: 'Musterfolien', notizen: '– Musterfolie des Planwerks.', quellen: 'Quelle: keine; Musterfolie.', inhalt: '', ...modul.o, id: modul.id }, modul };
    });
    if (arg.nur) liste = liste.filter(e => arg.nur.includes(e.o.id));
  } else {
    let folien = outline.folien;
    if (arg.gruppe) {
      const g = outline.baugruppen.find(x => x.name === arg.gruppe);
      if (!g) throw new Error(`Baugruppe „${arg.gruppe}“ gibt es nicht. Vorhanden: ${outline.baugruppen.map(x => x.name).join(', ')}`);
      folien = folien.filter(f => g.folien.includes(f.id));
    }
    if (arg.nur) {
      const fremd = arg.nur.filter(id => !outline.folien.some(f => f.id === id));
      if (fremd.length) throw new Error(`--nur: unbekannte Folien ${fremd.join(', ')}. Vorhanden: ${outline.folien.map(f => f.id).join(', ')}`);
      folien = folien.filter(f => arg.nur.includes(f.id));
    }
    const fehlen = folien.filter(f => !fs.existsSync(path.join(ROOT, 'folien', f.id + '.cjs'))).map(f => f.id);
    if (fehlen.length) throw new Error(`Folienmodule fehlen (${fehlen.length} von ${folien.length}): ${fehlen.join(', ')}\nErwartet wird je Folie folien/<id>.cjs mit module.exports = { id, bau(ctx) }.`);
    liste = folien.map(o => {
      const modul = require(path.join(ROOT, 'folien', o.id + '.cjs'));
      if (modul.id !== o.id || typeof modul.bau !== 'function') throw new Error(`folien/${o.id}.cjs: erwartet wird module.exports = { id: '${o.id}', bau(ctx) }.`);
      return { o, modul };
    });
  }
  if (!liste.length) throw new Error('Keine Folie zu bauen.');
  const ziel = path.resolve(ROOT, arg.aus || (arg.probe ? 'dist/probe/planwerk-probe.pptx' : arg.gruppe ? `dist/teil-${arg.gruppe}.pptx` : ZIEL));

  // ---- Mappe ------------------------------------------------------------------------------------------------------
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: T.THEME.headFontFace, bodyFontFace: T.THEME.bodyFontFace };
  pres.title = arg.probe ? 'Planwerk 16:9 – Musterfolien' : 'Mietwohnraumförderung Niedersachsen 2026 – Vortrag';
  pres.subject = 'RL Mietwohnraum 2026';
  pres.author = T.FIRMA; pres.company = T.FIRMA; pres.revision = '1';
  definiereLayouts(pres);

  const P = new Pruefung(), anweisungen = {}, leer = {}, tabellen = {}, altTexte = {}, warnungen = [];
  const warnAlt = console.warn;
  console.warn = (...a) => { warnungen.push(a.join(' ')); };
  const abschnitte = new Set();

  liste.forEach(({ o, modul }, nr) => {
    const lay = LAYOUTS[o.layout];
    if (!lay) throw new Error(`Folie „${o.id}“: Layout „${o.layout}“ gibt es nicht. Vorhanden: ${Object.keys(LAYOUTS).join(', ')}`);
    P.setzeFolie(o.id);
    if (!abschnitte.has(o.abschnitt)) { pres.addSection({ title: o.abschnitt }); abschnitte.add(o.abschnitt); }
    else if (nr > 0 && liste[nr - 1].o.abschnitt !== o.abschnitt) throw new Error(`Folie „${o.id}“: Der Abschnitt „${o.abschnitt}“ kommt zum zweiten Mal. Abschnitte müssen in der Folienfolge zusammenhängen.`);
    let slide = null, formen = [];
    const ausnahmen = new Map();   // Objektname → Grund (ctx.zoneAusnahme)
    const zuletzt = [];            // Rubrik und Blattnummer des Schriftfelds: nach dem Inhalt angelegt, damit sie in der Lesereihenfolge am Ende stehen
    // tabelle: Jede Tabelle meldet, ob sie eine Kopfzeile oder eine Kopfspalte hat (in der Reihenfolge, in der die Folie sie anlegt)
    const kx = { grund: lay.grund, art: lay.art, P, layout: o.layout, merke: (datei, anw) => { anweisungen[datei] = anw; }, tabelle: t => { (tabellen[`slide${nr + 1}.xml`] = tabellen[`slide${nr + 1}.xml`] || []).push(t); },
      // altText: Alternativtext für eine Form dieser Folie (Objektname → Text); die Nachbearbeitung schreibt ihn als „descr“ (B.altText, D.fluss)
      altText: (name, text) => {
        const a = altTexte[`slide${nr + 1}.xml`] = altTexte[`slide${nr + 1}.xml`] || {};
        if (name in a) throw new Error(`Folie „${o.id}“: Der Alternativtext für die Form „${name}“ ist zweimal gesetzt. Objektnamen mit Alternativtext sind je Folie eindeutig.`);
        a[name] = text;
      } };
    const B = bausteine(pres, kx), D = diagramme(pres, kx), cs = T.GRUND[lay.grund], inh = o.inhalt || '';

    function folie(opt = {}) {
      if (slide) throw new Error(`Folie „${o.id}“: ctx.folie() wurde zweimal aufgerufen.`);
      slide = pres.addSlide({ masterName: o.layout, sectionTitle: o.abschnitt });
      formen = ueberwache(slide);   // hält Lage und Größe jeder Form fest (auch bei direkten Aufrufen von pptxgenjs)
      const hat = f => lay.felder.includes(f);
      // Titel
      const gelesen = leseTitel(inh) || {};
      let zeilen = opt.titel || gelesen.zeilen || null;
      if (typeof zeilen === 'string') zeilen = [zeilen];
      if (!zeilen || !zeilen.length) { if (lay.art === 'anhang' || lay.art === 'abschnitt') zeilen = [o.titel]; else throw new Error(`Folie „${o.id}“: Titelzeilen fehlen. ctx.folie({ titel: ['Zeile 1', 'Zeile 2'], akzent: 'Signaturwort' }) oder im Konzept „Titelzeilen: „…“ | „…“ (Signaturwort: „…“)“.`); }
      const akzent = opt.akzent !== undefined ? opt.akzent : gelesen.akzent;
      const stimme = opt.stimme !== undefined ? opt.stimme : gelesen.stimme;
      const t = lay.titel;
      if (zeilen.length < t.min || zeilen.length > t.max) P.melde(`Titel hat ${zeilen.length} Zeile(n); das Layout ${o.layout} verlangt ${t.min === t.max ? t.min : t.min + ' bis ' + t.max}. Zeilen: ${zeilen.join(' | ')}`);
      if (lay.art === 'inhalt' && !akzent) P.melde('Titel ohne Signaturwort (genau eine Wortgruppe in Montserrat ExtraBold kursiv).');
      const basis = { fontFace: T.F.black, fontSize: t.pt };
      const pruefzeilen = titelPruefzeilen(zeilen, { akzent, stimme }, basis);
      pruefzeilen.forEach((l, i) => P.zeile(`Titelzeile ${i + 1} (${t.pt} pt)`, l, null, t.breite));
      if (zeilen.some(z => /\.$/.test(z)) && lay.art !== 'titel' && lay.art !== 'schluss') P.hinweis('Titel endet mit einem Punkt.');
      // Unterlänge über Umlaut: Die untere Zeile bekommt etwas mehr Zeilenabstand (sonst berührt etwa ein Komma die Punkte eines Ö)
      const abstand = {};
      for (const k of titelKollisionen(pruefzeilen)) {
        abstand[k.zeile] = opt.titelAbstand || t.pt + TITEL_LUFT;
        P.hinweis(`Titel: „${k.oben}“ in Zeile ${k.zeile} steht über „${k.unten}“ in Zeile ${k.zeile + 1}. Zeile ${k.zeile + 1} bekommt ${abstand[k.zeile]} pt Zeilenabstand, damit sich die Zeichen nicht berühren (anderer Wert: ctx.folie({ titelAbstand })).`);
      }
      slide.addText(titelLaeufe(zeilen, { akzent, stimme, abstand, akzentFarbe: lay.grund === 'rot' ? null : cs.signatur }), { placeholder: 'title' });
      // Kicker und Rubrik
      const kicker = opt.kicker !== undefined ? opt.kicker : zitat(inh, /Kicker: „([^“]+)“/);
      if (hat('kicker')) {
        if (!kicker) throw new Error(`Folie „${o.id}“: Kicker fehlt (ctx.folie({ kicker }) oder im Konzept „Kicker: „…““).`);
        const k = T.versal(kicker);
        P.zeile('Kicker', k, { fontFace: T.F.mont, bold: true, fontSize: 12, weite: 1.9 }, 6.0);
        slide.addText(k, { placeholder: 'kicker' });
      }
      if (hat('rubrik')) {
        const r = T.versal(opt.rubrik !== undefined ? opt.rubrik : zitat(inh, /Rubrik[^:„“]*: „([^“]+)“/) || kicker || o.abschnitt);
        P.zeile('Rubrik im Schriftfeld', r, { fontFace: T.F.mont, bold: true, fontSize: 10, weite: 0.6 }, lay.art === 'abschnitt' ? 7.0 : 8.0);
        zuletzt.push(() => slide.addText(r, { placeholder: 'rubrik' }));
      }
      if (hat('blatt')) zuletzt.push(() => slide.addText(String(o.nr), { placeholder: 'blatt' }));
      // Abschnitt: Nummer im Achskreis und Vorspann
      if (lay.art === 'abschnitt') {
        const n = opt.nr !== undefined ? opt.nr : zitat(inh, /Achskreis XL: „([^“]+)“/);
        if (n === null || n === undefined) throw new Error(`Folie „${o.id}“: Nummer für den Achskreis fehlt (ctx.folie({ nr })).`);
        slide.addText(String(n), { placeholder: 'nr' });
        const lead = opt.lead !== undefined ? opt.lead : zitat(inh, /Lead: „([^“]+)“/);
        if (lead) { P.block('Vorspann', lead, { fontFace: T.F.text, fontSize: 18, zeileMal: 1.1 }, 8.0, 1.40, { luft: true }); slide.addText(schutz(lead), { placeholder: 'lead' }); }
      }
      // Titel und Schluss: Untertitel; Titel: Ort und Datum (ohne Angabe bleibt das Eingabefeld stehen)
      if (hat('untertitel')) {
        const u = opt.untertitel !== undefined ? opt.untertitel : zitat(inh, /Untertitel: „([^“]+)“/);
        if (u) { P.block('Untertitel', u, { fontFace: T.F.text, fontSize: 18, zeileMal: 1.1 }, lay.art === 'titel' ? 6.3 : 5.4, lay.art === 'titel' ? 1.15 : 1.2, { luft: true }); slide.addText(schutz(u), { placeholder: 'untertitel' }); }
      }
      if (hat('anlass') && opt.anlass) slide.addText(opt.anlass, { placeholder: 'anlass' });
      // Notizen: Notizzeilen, Leerzeile, Quellenzeile
      const notiz = [o.notizen, o.quellen].filter(Boolean).join('\n\n');
      if (!o.notizen) P.hinweis('Sprechernotizen fehlen.');
      if (!o.quellen) P.hinweis('Quellenzeile fehlt.');
      slide.addNotes(notiz);
      return slide;
    }

    // Vergleichsform für die Gegenprobe gegen das Konzept: ohne geschützte Leerzeichen und Fettmarken, in Großbuchstaben (Versalien setzt erst die Bibliothek)
    const gross = t => daten.glatt(t).toLocaleUpperCase('de-DE');
    const ctx = {
      pres, C: T.C, HEX: T.HEX, F: T.F, Raster: T.Raster, colX: T.colX, span: T.span, Y: T.Y, ZONE: T.ZONE,
      B, D, W: daten.W, fmt: daten.fmt, X: daten.X, o, outline, asset, P, grund: lay.grund, farben: cs, versal: T.versal, schutz, folie,
      glatt: daten.glatt, zahlwort: daten.zahlwort, fuelle: daten.fuelle, mittel: daten.mittel,
      // Gegenprobe: Der Text steht so im Feld „inhalt“ des Konzepts (Groß- und Kleinschreibung, Fettmarken und geschützte Leerzeichen zählen nicht).
      // Zahlen aus werte.json und den Datendateien sind damit zugleich gegen das Konzept geprüft. Eine Abweichung bricht den Bau ab. Rückgabe: der Text
      wortlaut(text, was) {
        if (!gross(inh).includes(gross(text))) P.melde(`Wortlautprobe${was ? ' ' + was : ''}: „${daten.glatt(text)}“ steht so nicht im Feld „inhalt“ des Konzepts (outline.json, Folie ${o.id}).`);
        return text;
      },
      // Gegenprobe zweier Zahlen auf nk Nachkommastellen (kaufmännisch gerundet wie die Formatierer). Eine Abweichung bricht den Bau ab
      gleich(was, a, b, nk = 2) { if (daten.fmt.zahl(a, nk) !== daten.fmt.zahl(b, nk)) P.melde(`Gegenprobe ${was}: ${daten.fmt.zahl(a, nk)} gegen ${daten.fmt.zahl(b, nk)}.`); },
      // Zugriff auf eine Datendatei mit gefüllten Platzhaltern: const U = ctx.lies('umsetzung', felder); U('antragsweg.beginn'); U(pfad, { weitere: Felder })
      lies(datei, felder = {}) { return (pfad, mehr) => daten.fuelle(daten.X(datei, pfad), mehr ? { ...felder, ...mehr } : felder, `daten/${datei}.json`); },
      get daten() { return Object.fromEntries(daten.DATEIEN.filter(n => n !== 'probe').map(n => [n, daten.datei(n)])); },
      get slide() { return slide; },
      // Eine Form mit Absicht außerhalb von Satzspiegel oder Inhaltszone: Name der Form und Grund; der Build nennt die Ausnahme als Hinweis
      zoneAusnahme(name, grund) {
        if (!name || !grund || String(grund).trim().length < 8) throw new Error('ctx.zoneAusnahme(name, grund): Objektname und ein Grund in Worten sind Pflicht.');
        ausnahmen.set(String(name), String(grund));
      },
    };
    try { modul.bau(ctx); } catch (e) { e.message = `Folie „${o.id}“ (${arg.probe ? 'probe' : 'folien'}/…): ${e.message}`; throw e; }
    if (!slide) throw new Error(`Folie „${o.id}“: bau(ctx) hat ctx.folie() nicht aufgerufen.`);
    for (const f of zuletzt) f();   // Lesereihenfolge: Titel, Kicker, Inhalt in der Reihenfolge des Moduls, zuletzt das Schriftfeld
    // Lage aller Formen: Folienfläche, Satzspiegel, Inhaltszone, Namen, Schriften (lib/zonenpruefung.cjs)
    pruefeZonen(formen, { art: lay.art, layout: o.layout }, P, ausnahmen);

    // Platzhalter, die die Folie nicht gefüllt hat (werden in der Nachbearbeitung entfernt)
    const layout = pres.slideLayouts.find(l => l._name === o.layout);
    const gefuellt = new Set(slide._slideObjects.filter(x => x.options && x.options.placeholder).map(x => x.options.placeholder));
    for (const name of gefuellt) if (!lay.felder.includes(name)) P.melde(`Platzhalter „${name}“ gibt es im Layout ${o.layout} nicht (vorhanden: ${lay.felder.join(', ')}). Der Text läge lose bei 0 / 0.`);
    const weg = layout._slideObjects.filter(x => x._type === 'placeholder' && !gefuellt.has(x.options.placeholder) && !BEHALTEN.includes(x.options.placeholder)).map(x => x.options._placeholderIdx);
    if (weg.length) leer[`slide${nr + 1}.xml`] = weg;
  });
  // ---- Prüfen, schreiben, nachbearbeiten ------------------------------------------------------------------------------
  for (const h of P.hinweise) console.log(`Hinweis · Folie „${h.folie}“ – ${h.text}`);
  if (P.fehler.length) console.error(`Passprüfung: ${P.fehler.length} Fehler\n` + P.bericht());
  if (P.fehler.length && !arg.trotzdem) { console.warn = warnAlt; console.error('Abbruch: Die Mappe wurde nicht geschrieben. Zum Ansehen trotz Fehlern: --trotzdem'); process.exit(1); }

  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  await pres.writeFile({ fileName: ziel });
  console.warn = warnAlt;
  // Datum der Mappe: der Stand der Inhalte (daten/rahmen.json, titel.stand). Kein Tagesdatum, damit zwei Läufe dieselbe Datei liefern
  const st = String(daten.X('rahmen', 'titel.stand')).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!st) throw new Error('daten/rahmen.json: titel.stand ist kein Datum der Form TT.MM.JJJJ.');
  const stat = await nachbearbeiten(ziel, { theme: T.THEME, firma: T.FIRMA, schraffur: { merkfarbe: T.HEX.schraffur, bg: T.HEX.eigenmittel, fg: T.HEX.schraffurLinie }, diagramme: anweisungen, leerePlatzhalter: leer,
    folientitel: liste.map(e => e.o.titel), schriften: Object.values(T.F), layouts: layoutBeschreibung(pres), tabellen, altTexte, datum: `${st[3]}-${st[2]}-${st[1]}T00:00:00Z` });
  console.log(`${path.relative(ROOT, ziel)} · ${liste.length} Folien · Abschnitte: ${[...abschnitte].join(', ')}`);
  console.log(`Nachbearbeitung: Theme „${T.THEME.name}“, Schraffur ${stat.formen} Formen und ${stat.reihen} Reihen, ${stat.striche} Stricharten, ${stat.labels} Beschriftungsfarben, ${stat.ausgeblendet} Beschriftungen ausgeblendet, ${stat.marker} Marker, ${stat.platzhalter} leere Platzhalter entfernt, ${stat.arbeitsmappen} Arbeitsmappen, ${stat.absaetze} Absätze bereinigt`);
  console.log(`Datei: ${stat.layoutPlatzhalter} Platzhalter der Layouts mit Innenabstand und Anker, ${stat.idx} Platzhalternummern gesetzt, ${stat.diagrammSchema} Stellen der Diagramme nach Schema, ${stat.nullen} Nullwerte in Arbeitsmappen, ${stat.dekorativ} Formen dekorativ, ${stat.altTexte} Formen mit Alternativtext, ${stat.tabellen} Tabellen gekennzeichnet, ${stat.notizAbsaetze} Notizabsätze, ${stat.inhaltstypen} tote Inhaltstypen entfernt`);
  if (!stat.masterAbstand) { console.error('Nachbearbeitung: Der Absatzabstand im Master wurde nicht gefunden (bodyStyle). Text in Platzhaltern stünde mit 20 % Abstand vor jedem Absatz.'); process.exit(1); }
  for (const a of stat.absatzAbweichend) console.log(`Hinweis · ${a} – Die Läufe dieses Absatzes tragen verschiedene Absatzeigenschaften; es gilt die des ersten Laufs.`);
  if (warnungen.length) { console.error('Warnungen von pptxgenjs (gelten als Fehler; meist eine ungültige Farbe oder Option):\n' + [...new Set(warnungen)].map(w => '  ' + w).join('\n')); process.exit(1); }
  if (P.fehler.length) process.exit(1);
}

main().catch(e => { console.error('Fehler: ' + e.message); process.exit(1); });
