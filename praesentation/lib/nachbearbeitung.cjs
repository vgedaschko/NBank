// Nachbearbeitung der fertigen .pptx (mit jszip aus pptxgenjs, ohne fremde Skripte):
//  1 Theme: Name und die zwölf Theme-Farben (pptxgenjs schreibt nur die Schriften)
//  2 Schraffur: Flächen in der Merkfarbe DCD8D2 werden zum nativen Füllmuster (Formen, Layouts, Diagrammreihen)
//  3 Diagramme: Strichart je Reihe, Farbe der Datenbeschriftung je Reihe
//  4 Aufzählung: eckiger Marker in Rot, 80 % der Schriftgröße, in der Textschrift; Titel-Platzhalter mit idx 0
//  5 leere Platzhalter, die eine Folie nicht füllt, entfernen (sonst liegen in PowerPoint Eingabefelder über dem Inhalt)
//  6 Metadaten: Sprache Deutsch, kein Werkzeugname in der Mappe und in den eingebetteten Arbeitsmappen der Diagramme
//  7 Prüfungen (Farbwerte, Stricharten) und ZIP ohne Ordner-Einträge, [Content_Types].xml zuerst
//  8 Absätze: je Absatz genau ein <a:pPr> am Anfang (pptxgenjs schreibt vor jeden Textlauf eines; das Schema erlaubt nur das erste)
//  9 Master: kein Abstand vor Absätzen in Platzhaltern (pptxgenjs setzt 20 %); Text steht damit im Platzhalter wie im freien Textfeld
// 10 Dateieigenschaften (docProps/app.xml): verwendete Schriften, Name des Themes und die Folientitel statt der Vorgaben „Arial“, „Office Theme“, „Slide 1“
'use strict';
const fs = require('fs');
const JSZip = require(require.resolve('jszip', { paths: [require.resolve('pptxgenjs')] }));

const SLOTS = ['dk1', 'lt1', 'dk2', 'lt2', 'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6', 'hlink', 'folHlink'];
const STRICHE = ['solid', 'dot', 'dash', 'lgDash', 'dashDot', 'lgDashDot', 'lgDashDotDot', 'sysDash', 'sysDot', 'sysDashDot', 'sysDashDotDot'];
// ein <a:pPr>, leer oder mit Inhalt
const PPR = /<a:pPr\b[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g;
const xmlAttr = s => String(s).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function themeXml(xml, theme) {
  const name = xmlAttr(theme.name);
  for (const k of SLOTS) if (!/^[0-9A-Fa-f]{6}$/.test(String(theme.colors[k]))) throw new Error(`Theme: Farbe ${k} ist „${theme.colors[k]}“, erwartet werden sechs Hex-Ziffern ohne Raute.`);
  const scheme = `<a:clrScheme name="${name}">` + SLOTS.map(k => `<a:${k}><a:srgbClr val="${String(theme.colors[k]).toUpperCase()}"/></a:${k}>`).join('') + '</a:clrScheme>';
  const out = xml.replace(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/, () => scheme).replace(/(<a:(?:theme|fontScheme)\b[^>]*?\bname=")[^"]*"/g, (_, kopf) => `${kopf}${name}"`);
  if (!out.includes(scheme)) throw new Error('Theme: ppt/theme/theme1.xml enthält kein <a:clrScheme>.');
  return out;
}

// o: { theme: { name, colors }, firma, schraffur: { merkfarbe, bg, fg, muster }, diagramme: { 'chart3.xml': { striche: { Reihe: 'dash' }, labelFarben: { Reihe: '202020' } } },
//      leerePlatzhalter: { 'slide3.xml': [104, 107] }, markerFarbe }
async function nachbearbeiten(datei, o) {
  const zip = await JSZip.loadAsync(fs.readFileSync(datei));
  const stat = { theme: 0, formen: 0, reihen: 0, labels: 0, striche: 0, marker: 0, platzhalter: 0, arbeitsmappen: 0, ausgeblendet: 0, absaetze: 0, absatzAbweichend: [], masterAbstand: 0 };
  const sch = { merkfarbe: 'DCD8D2', bg: 'DCD8D3', fg: '8E8A85', muster: 'ltUpDiag', ...(o.schraffur || {}) };
  const patt = `<a:pattFill prst="${sch.muster}"><a:fgClr><a:srgbClr val="${sch.fg}"/></a:fgClr><a:bgClr><a:srgbClr val="${sch.bg}"/></a:bgClr></a:pattFill>`;
  const solid = new RegExp(`<a:solidFill>\\s*<a:srgbClr val="${sch.merkfarbe}"\\s*/>\\s*</a:solidFill>`);
  const marker = o.markerFarbe || 'B71E3F', firma = o.firma || 'Planungsgemeinschaft Nord GmbH';
  const offen = JSON.parse(JSON.stringify(o.diagramme || {}));   // was am Ende nicht angewendet wurde, ist ein Fehler

  // 1 Theme
  const themePart = 'ppt/theme/theme1.xml';
  if (!zip.file(themePart)) throw new Error(`${datei}: ${themePart} fehlt.`);
  zip.file(themePart, themeXml(await zip.file(themePart).async('string'), o.theme)); stat.theme = 1;

  for (const name of Object.keys(zip.files)) {
    if (zip.files[name].dir) continue;
    if (/^ppt\/(slides|slideLayouts|slideMasters)\/[^/]+\.xml$/.test(name)) {
      let xml = await zip.file(name).async('string');
      // 2 Schraffur: nur Flächenfüllungen von Formen (in <p:spPr>), nicht Linien oder Text
      xml = xml.replace(/<p:spPr>[\s\S]*?<\/p:spPr>/g, sp => sp.replace(/(<a:ln\b[\s\S]*?<\/a:ln>)|<a:solidFill>\s*<a:srgbClr val="([0-9A-F]{6})"\s*\/>\s*<\/a:solidFill>/g, (m, ln, hex) => (ln ? m : hex === sch.merkfarbe ? (stat.formen++, patt) : m)));
      // 4 Aufzählungsmarker: pptxgenjs schreibt kein <a:buClr>; Reihenfolge laut Schema vor <a:buSzPct>
      xml = xml.replace(/<a:buSzPct val="100000"\/>(<a:buChar )/g, (m, bu) => (stat.marker++, `<a:buClr><a:srgbClr val="${marker}"/></a:buClr><a:buSzPct val="80000"/><a:buFont typeface="${o.markerSchrift || 'Work Sans'}"/>${bu}`));
      // Titel-Platzhalter ohne idx (gilt als 0): so finden PowerPoint-Gliederung, Vorleseprogramme und andere Werkzeuge den Folientitel
      xml = xml.replace(/<p:ph\s+idx="\d+"\s+type="title"/g, '<p:ph type="title"');
      // 5 leere Platzhalter dieser Folie entfernen
      const kurz = name.split('/').pop(), weg = (o.leerePlatzhalter || {})[kurz];
      if (weg && weg.length && name.startsWith('ppt/slides/')) {
        xml = xml.replace(/<p:sp>[\s\S]*?<\/p:sp>/g, sp => {
          const ph = sp.match(/<p:ph\b[^>]*\bidx="(\d+)"/);
          if (!ph || !weg.includes(Number(ph[1]))) return sp;
          if (/<a:t>[^<]+<\/a:t>/.test(sp)) return sp;      // gefüllt: bleibt
          stat.platzhalter++; return '';
        });
      }
      // 8 je Absatz ein <a:pPr> am Anfang. Tragen die Läufe eines Absatzes verschiedene Absatzeigenschaften, gilt die des ersten Laufs;
      //   der Build nennt die Stelle (Abstand, Zeilenmaß und Marker gehören an alle Läufe eines Absatzes gleich).
      xml = xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (m, innen) => {
        const alle = innen.match(PPR);
        if (!alle || (alle.length === 1 && innen.startsWith(alle[0]))) return m;
        stat.absaetze++;
        if (new Set(alle).size > 1) stat.absatzAbweichend.push(`${name.split('/').pop()}: „${(innen.match(/<a:t>([^<]*)<\/a:t>/) || [])[1] || ''}“`);
        return '<a:p>' + alle[0] + innen.replace(PPR, '') + '</a:p>';
      });
      // 9 Master: Abstand vor Absätzen in Platzhaltern auf null
      if (name.startsWith('ppt/slideMasters/')) xml = xml.replace(/<p:bodyStyle>[\s\S]*?<\/p:bodyStyle>/, b => b.replace(/<a:spcBef><a:spcPct val="\d+"\/><\/a:spcBef>/g, () => (stat.masterAbstand++, '<a:spcBef><a:spcPct val="0"/></a:spcBef>')));
      zip.file(name, xml);
    } else if (/^ppt\/charts\/chart\d+\.xml$/.test(name)) {
      let xml = await zip.file(name).async('string');
      const kurz = name.split('/').pop(), anw = (o.diagramme || {})[kurz] || {}, rest = offen[kurz] || {};
      xml = xml.replace(/<c:ser>[\s\S]*?<\/c:ser>/g, ser => {
        const nm = ((ser.match(/<c:tx>[\s\S]*?<c:v>([^<]*)<\/c:v>/) || [])[1] || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
        // 3a Strichart je Reihe (pptxgenjs kennt lineDash nur für das ganze Diagramm)
        if (anw.striche && anw.striche[nm]) {
          let ok = false;
          ser = ser.replace(/<c:spPr>([\s\S]*?)<\/c:spPr>/, (m, inner) => '<c:spPr>' + inner.replace(/<a:prstDash val="[^"]*"\/>/, () => (ok = true, `<a:prstDash val="${anw.striche[nm]}"/>`)) + '</c:spPr>');
          if (ok) { stat.striche++; delete rest.striche[nm]; }
        }
        // 2 Schraffur der Reihe: erstes <c:spPr> der Reihe; die Linie (Fuge) bleibt
        if (solid.test(ser)) {
          stat.reihen++;
          ser = ser.replace(/<c:spPr>([\s\S]*?)<\/c:spPr>/, (m, inner) => '<c:spPr>' + inner.replace(solid, patt) + '</c:spPr>');
        }
        // 3c einzelne Datenbeschriftungen ausblenden (Segment zu klein); <c:dLbl> steht laut Schema am Anfang von <c:dLbls>
        if (anw.labelWeg && anw.labelWeg[nm] && anw.labelWeg[nm].length) {
          const weg = anw.labelWeg[nm].map(i => `<c:dLbl><c:idx val="${i}"/><c:delete val="1"/></c:dLbl>`).join('');
          let ok = false;
          ser = ser.replace(/<c:dLbls>/, () => (ok = true, '<c:dLbls>' + weg));
          if (ok) stat.ausgeblendet += anw.labelWeg[nm].length;
        }
        // 3b Farbe der Datenbeschriftung je Reihe
        if (anw.labelFarben && anw.labelFarben[nm]) {
          let ok = false;
          ser = ser.replace(/<c:dLbls>[\s\S]*?<\/c:dLbls>/, d => d.replace(/(<a:defRPr\b[^>]*>\s*<a:solidFill>\s*)<a:(?:srgbClr|schemeClr) val="[^"]+"\s*\/>/, (m, pre) => (ok = true, `${pre}<a:srgbClr val="${anw.labelFarben[nm]}"/>`)));
          if (ok) stat.labels++;
          delete rest.labelFarben[nm];      // ohne Datenbeschriftung gibt es nichts zu färben
        }
        return ser;
      });
      // pptxgenjs schreibt valAxisCrossesAt: 0 als <c:crossesAt val="autoZero"/>; das Wort gehört in <c:crosses>
      xml = xml.replaceAll('<c:crossesAt val="autoZero"/>', '<c:crosses val="autoZero"/>');
      zip.file(name, xml);
    } else if (/^ppt\/embeddings\/.+\.xlsx$/.test(name)) {
      // 6 eingebettete Arbeitsmappe der Diagramme: Verfasser ersetzen
      const xl = await JSZip.loadAsync(await zip.file(name).async('nodebuffer'));
      const core = xl.file('docProps/core.xml');
      if (core) {
        const neu = (await core.async('string')).replace(/(<dc:creator>)[^<]*(<\/dc:creator>)/, `$1${xmlAttr(firma)}$2`).replace(/(<cp:lastModifiedBy>)[^<]*(<\/cp:lastModifiedBy>)/, `$1${xmlAttr(firma)}$2`);
        xl.file('docProps/core.xml', neu);
        const sauber = new JSZip();
        for (const n of Object.keys(xl.files).filter(n => !xl.files[n].dir)) sauber.file(n, await xl.file(n).async('nodebuffer'), { createFolders: false });
        zip.file(name, await sauber.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
        stat.arbeitsmappen++;
      }
    }
  }

  // 6 Sprache und 7 Prüfungen über alle XML-Teile
  const benutzt = new Set();   // Schriften, die in Folien, Layouts, Master und Diagrammen stehen
  for (const name of Object.keys(zip.files)) {
    if (zip.files[name].dir || !/\.(xml|rels)$/.test(name)) continue;
    let xml = await zip.file(name).async('string');

    if (/^ppt\//.test(name) && xml.includes('lang="en-US"')) { xml = xml.replaceAll('lang="en-US"', 'lang="de-DE"'); zip.file(name, xml); }
    // Reste der Vorgabeschrift von pptxgenjs (Aufzählungszeichen im Master, unsichtbare Beschriftung im Ringdiagramm) auf die Textschrift setzen
    if (/^ppt\/(charts|slideMasters)\//.test(name) && xml.includes('typeface="Arial"')) { xml = xml.replaceAll('typeface="Arial"', `typeface="${o.markerSchrift || 'Work Sans'}"`); zip.file(name, xml); }
    // verwendete Schriften: alle Schriftangaben in Folien, Layouts, Master und Diagrammen; im Theme nur die beiden lateinischen Schriften
    // (die Liste der Ersatzschriften je Schriftsystem gehört zum Theme und zählt nicht)
    if (/^ppt\/(slides|slideLayouts|slideMasters|charts)\//.test(name)) for (const m of xml.matchAll(/typeface="([^"+][^"]*)"/g)) benutzt.add(m[1]);
    if (/^ppt\/theme\//.test(name)) for (const m of xml.matchAll(/<a:latin typeface="([^"+][^"]*)"/g)) benutzt.add(m[1]);
    const farbe = xml.match(/<a:srgbClr val="((?![0-9A-Fa-f]{6}")[^"]*)"/);
    if (farbe) throw new Error(`${name}: <a:srgbClr val="${farbe[1]}"> ist kein Hex-Wert. Meist wurde eine Schemafarbe (C.*) an eine Stelle gegeben, die nur Hex annimmt (Gitterlinien, dataBorder, Farben einer einzelnen Balkenreihe). Dort HEX.* verwenden.`);
    const strich = [...xml.matchAll(/<a:prstDash val="([^"]*)"/g)].find(m => !STRICHE.includes(m[1]));
    if (strich) throw new Error(`${name}: Strichart „${strich[1]}“ gibt es nicht. Erlaubt: ${STRICHE.join(', ')}.`);
    if (/pptxgenjs/i.test(xml)) throw new Error(`${name}: enthält einen Werkzeugnamen (E11). Autor, Firma, Titel und Betreff in build.cjs setzen.`);
  }
  const reste = Object.entries(offen).flatMap(([d, a]) => [...Object.keys(a.striche || {}).map(r => `${d}: Strichart für Reihe „${r}“`), ...Object.keys(a.labelFarben || {}).map(r => `${d}: Beschriftungsfarbe für Reihe „${r}“`)]);
  if (reste.length) throw new Error('Nachbearbeitung: nicht angewendet (Reihe nicht gefunden): ' + reste.join('; '));

  // 10 Dateieigenschaften: Schriften, Theme und Folientitel, wie PowerPoint sie beim Speichern einträgt
  const app = zip.file('docProps/app.xml');
  if (app && Array.isArray(o.folientitel)) {
    const schriften = (o.schriften || []).filter(f => benutzt.has(f)), teile = [...schriften, o.theme.name, ...o.folientitel];
    const paar = (wort, n) => `<vt:variant><vt:lpstr>${wort}</vt:lpstr></vt:variant><vt:variant><vt:i4>${n}</vt:i4></vt:variant>`;
    let xml = await app.async('string');
    xml = xml.replace(/<HeadingPairs>[\s\S]*?<\/HeadingPairs>/, () => `<HeadingPairs><vt:vector size="6" baseType="variant">${paar('Fonts Used', schriften.length)}${paar('Theme', 1)}${paar('Slide Titles', o.folientitel.length)}</vt:vector></HeadingPairs>`)
      .replace(/<TitlesOfParts>[\s\S]*?<\/TitlesOfParts>/, () => `<TitlesOfParts><vt:vector size="${teile.length}" baseType="lpstr">${teile.map(t => `<vt:lpstr>${xmlAttr(t)}</vt:lpstr>`).join('')}</vt:vector></TitlesOfParts>`);
    zip.file('docProps/app.xml', xml);
    stat.eigenschaften = teile.length;
    const fremd = [...benutzt].filter(f => !(o.schriften || []).includes(f));
    if (o.schriften && fremd.length) throw new Error(`Schriften außerhalb des Planwerks in der Mappe: ${fremd.join(', ')} (erlaubt: ${o.schriften.join(', ')}).`);
  }

  // 7 neu packen ohne Ordner-Einträge; [Content_Types].xml zuerst
  const out = new JSZip();
  const names = Object.keys(zip.files).filter(n => !zip.files[n].dir).sort((a, b) => (a === '[Content_Types].xml' ? -1 : b === '[Content_Types].xml' ? 1 : 0));
  for (const n of names) out.file(n, await zip.file(n).async('nodebuffer'), { createFolders: false });
  fs.writeFileSync(datei, await out.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  return stat;
}

module.exports = { nachbearbeiten };
