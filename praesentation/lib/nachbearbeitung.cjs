// Nachbearbeitung der fertigen .pptx (mit jszip aus pptxgenjs, ohne fremde Skripte):
//  1 Theme: Name und die zwölf Theme-Farben (pptxgenjs schreibt nur die Schriften)
//  2 Schraffur: Flächen in der Merkfarbe DCD8D2 werden zum nativen Füllmuster (Formen, Layouts, Diagrammreihen)
//  3 Diagramme: Strichart je Reihe, Farbe der Datenbeschriftung je Reihe
//  4 Aufzählung: eckiger Marker in Rot, 80 % der Schriftgröße, in der Textschrift; Titel-Platzhalter mit idx 0
//  5 leere Platzhalter, die eine Folie nicht füllt, entfernen (sonst liegen in PowerPoint Eingabefelder über dem Inhalt)
//  6 Metadaten: Sprache Deutsch, kein Werkzeugname in der Mappe und in den eingebetteten Arbeitsmappen der Diagramme
//  7 Prüfungen (Farbwerte, Stricharten, eindeutige Form-IDs) und ZIP ohne Ordner-Einträge, [Content_Types].xml zuerst
//  8 Absätze: je Absatz genau ein <a:pPr> am Anfang (pptxgenjs schreibt vor jeden Textlauf eines; das Schema erlaubt nur das erste)
//  9 Master: kein Abstand vor Absätzen in Platzhaltern (pptxgenjs setzt 20 %); Text steht damit im Platzhalter wie im freien Textfeld
// 10 Dateieigenschaften (docProps/app.xml): verwendete Schriften, Name des Themes und die Folientitel statt der Vorgaben „Arial“, „Office Theme“, „Slide 1“;
//    Format „Widescreen“, Wörter und Absätze gezählt; im Theme kein Verweis auf das Office-Design
// 11 Form-IDs je Folie, Layout und Master fortlaufend (pptxgenjs zählt Tabellen eigens und vergibt so doppelte IDs)
// 12 Layouts: Platzhalter mit Innenabstand 0 und ihrem Anker, feste idx je Platzhaltername, lesbare Namen im Layout-Menü
// 13 Diagramme schema-gerecht: grouping im Liniendiagramm, Reihenfolge von marker, dPt, dLbls und tickLblSkip, keine dritte Achsen-ID;
//    Arbeitsmappen: Nullwerte als 0 statt leer, Tabellenbereich ohne Apostroph
// 14 Barrierefreiheit: Formen ohne Text und ohne Alternativtext als dekorativ gekennzeichnet; Tabellen mit Kopfzeile oder Kopfspalte gekennzeichnet
// 15 Notizen: je Zeile ein Absatz
// 16 Paket: [Content_Types].xml ohne tote Einträge und mit image/jpeg
// 17 Wiederholbarkeit: festes Datum in den Eigenschaften und an den ZIP-Einträgen, Abschnitts-IDs aus dem Abschnittsnamen
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const JSZip = require(require.resolve('jszip', { paths: [require.resolve('pptxgenjs')] }));

const SLOTS = ['dk1', 'lt1', 'dk2', 'lt2', 'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6', 'hlink', 'folHlink'];
const STRICHE = ['solid', 'dot', 'dash', 'lgDash', 'dashDot', 'lgDashDot', 'lgDashDotDot', 'sysDash', 'sysDot', 'sysDashDot', 'sysDashDotDot'];
// ein <a:pPr>, leer oder mit Inhalt
const PPR = /<a:pPr\b[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g;
const DEKORATIV = '<a:extLst><a:ext uri="{C183D7F6-B498-43B3-948B-1728B52AA6E4}"><adec:decorative xmlns:adec="http://schemas.microsoft.com/office/drawing/2017/decorative" val="1"/></a:ext></a:extLst>';
const OHNE_STIL = '{2D5ABB26-0587-4C30-8999-92F81FD0307C}';   // Tabellenformatvorlage „Keine Formatvorlage, kein Raster“: Die Zellen tragen ihre Formatierung selbst
const ANKER = { top: 't', middle: 'ctr', bottom: 'b' };
const entXml = s => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
// GUID aus einem Namen (gleicher Name, gleiche ID: Zwei Läufe des Baus liefern dieselbe Datei)
const guid = name => { const h = crypto.createHash('sha1').update(String(name)).digest('hex'); return `{${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}}`.toUpperCase(); };
const xmlAttr = s => String(s).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function themeXml(xml, theme) {
  const name = xmlAttr(theme.name);
  for (const k of SLOTS) if (!/^[0-9A-Fa-f]{6}$/.test(String(theme.colors[k]))) throw new Error(`Theme: Farbe ${k} ist „${theme.colors[k]}“, erwartet werden sechs Hex-Ziffern ohne Raute.`);
  const scheme = `<a:clrScheme name="${name}">` + SLOTS.map(k => `<a:${k}><a:srgbClr val="${String(theme.colors[k]).toUpperCase()}"/></a:${k}>`).join('') + '</a:clrScheme>';
  const out = xml.replace(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/, () => scheme).replace(/(<a:(?:theme|fontScheme)\b[^>]*?\bname=")[^"]*"/g, (_, kopf) => `${kopf}${name}"`)
    // die Erweiterung nennt das Office-Design als Familie des Themes; das Theme ist das Planwerk
    .replace(/<a:extLst>\s*<a:ext\b[^>]*>\s*<thm15:themeFamily\b[^>]*\/>\s*<\/a:ext>\s*<\/a:extLst>/, '');
  if (!out.includes(scheme)) throw new Error('Theme: ppt/theme/theme1.xml enthält kein <a:clrScheme>.');
  return out;
}

// o: { theme: { name, colors }, firma, schraffur: { merkfarbe, bg, fg, muster }, diagramme: { 'chart3.xml': { striche: { Reihe: 'dash' }, labelFarben: { Reihe: '202020' } } },
//      leerePlatzhalter: { 'slide3.xml': [104, 107] }, markerFarbe,
//      layouts: { PGN_INHALT: { anzeige: 'Inhalt', platzhalter: { 101: { name: 'kicker', anker: 'middle', idx: 10 }, title: { name: 'title', anker: 'top' } } } },
//      tabellen: { 'slide4.xml': [{ kopfzeile: false, kopfspalte: true }] } (in der Reihenfolge, in der die Folie sie anlegt),
//      datum: '2026-09-30T00:00:00Z' (Stand der Inhalte; steht in den Eigenschaften und an den ZIP-Einträgen) }
async function nachbearbeiten(datei, o) {
  const zip = await JSZip.loadAsync(fs.readFileSync(datei));
  const stat = { theme: 0, formen: 0, reihen: 0, labels: 0, striche: 0, marker: 0, platzhalter: 0, arbeitsmappen: 0, ausgeblendet: 0, absaetze: 0, absatzAbweichend: [], masterAbstand: 0,
    dekorativ: 0, tabellen: 0, layoutPlatzhalter: 0, idx: 0, diagrammSchema: 0, nullen: 0, notizAbsaetze: 0, inhaltstypen: 0 };
  const datum = o.datum || '2026-01-01T00:00:00Z', zipDatum = new Date(datum);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(datum) || isNaN(zipDatum)) throw new Error(`Nachbearbeitung: datum „${datum}“ ist kein Zeitpunkt der Form 2026-09-30T00:00:00Z.`);
  const layoutVon = {};      // 'ppt/slideLayouts/slideLayout5.xml' → Beschreibung des Layouts aus o.layouts
  const nullZellen = {};     // 'ppt/embeddings/….xlsx' → Zellen, in denen der Zwischenspeicher des Diagramms 0 führt
  const sch = { merkfarbe: 'DCD8D2', bg: 'DCD8D3', fg: '8E8A85', muster: 'ltUpDiag', ...(o.schraffur || {}) };
  const patt = `<a:pattFill prst="${sch.muster}"><a:fgClr><a:srgbClr val="${sch.fg}"/></a:fgClr><a:bgClr><a:srgbClr val="${sch.bg}"/></a:bgClr></a:pattFill>`;
  const solid = new RegExp(`<a:solidFill>\\s*<a:srgbClr val="${sch.merkfarbe}"\\s*/>\\s*</a:solidFill>`);
  const marker = o.markerFarbe || 'B71E3F', firma = o.firma || 'Planungsgemeinschaft Nord GmbH';
  const offen = JSON.parse(JSON.stringify(o.diagramme || {}));   // was am Ende nicht angewendet wurde, ist ein Fehler

  // 1 Theme
  const themePart = 'ppt/theme/theme1.xml';
  if (!zip.file(themePart)) throw new Error(`${datei}: ${themePart} fehlt.`);
  zip.file(themePart, themeXml(await zip.file(themePart).async('string'), o.theme)); stat.theme = 1;

  // Ziel einer Beziehung eines Teils (erste Beziehung, deren Ziel zum Muster passt), als Pfad im Paket
  const zielVon = async (teil, muster) => {
    const ordner = teil.slice(0, teil.lastIndexOf('/')), rels = zip.file(`${ordner}/_rels/${teil.slice(ordner.length + 1)}.rels`);
    if (!rels) return null;
    for (const m of (await rels.async('string')).matchAll(/\bTarget="([^"]+)"/g)) {
      if (!muster.test(m[1])) continue;
      const teile = [];
      for (const t of (m[1].startsWith('/') ? m[1].slice(1) : ordner + '/' + m[1]).split('/')) { if (t === '..') teile.pop(); else if (t !== '.') teile.push(t); }
      return teile.join('/');
    }
    return null;
  };
  const mappeVon = teil => zielVon(teil, /embeddings\/[^/]+\.xlsx$/);

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
      // 12 Layouts: Die Platzhalter tragen Innenabstand 0 und ihren Anker selbst (pptxgenjs schreibt beides nur auf die Folie). Eine neue Folie
      //    aus dem Layout und jede Folie nach „Zurücksetzen“ steht damit im Raster. Dazu der Name im Layout-Menü
      if (name.startsWith('ppt/slideLayouts/')) {
        const technisch = entXml((xml.match(/<p:cSld name="([^"]*)"/) || [])[1] || ''), L = (o.layouts || {})[technisch];
        if (o.layouts && !L) throw new Error(`${name}: Das Layout „${technisch}“ kennt die Nachbearbeitung nicht (o.layouts).`);
        if (L) {
          layoutVon[name] = L;
          xml = xml.replace(/<p:sp>[\s\S]*?<\/p:sp>/g, sp => {
            const ph = sp.match(/<p:ph\b[^>]*>/);
            if (!ph) return sp;
            const idx = (ph[0].match(/\bidx="(\d+)"/) || [])[1], p = /\btype="title"/.test(ph[0]) ? L.platzhalter.title : L.platzhalter[idx];
            if (!p) throw new Error(`${name}: Platzhalter mit idx ${idx} steht nicht in der Beschreibung des Layouts „${technisch}“.`);
            if (!ANKER[p.anker]) return sp;      // Platzhalter ohne Text (Diagramm)
            return sp.replace(/<a:bodyPr wrap="square" rtlCol="0">/, () => (stat.layoutPlatzhalter++, `<a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0" anchor="${ANKER[p.anker]}">`));
          });
          if (L.anzeige) xml = xml.replace(/<p:cSld name="[^"]*"/, () => `<p:cSld name="${xmlAttr(L.anzeige)}"`);
        }
      }
      if (name.startsWith('ppt/slides/')) {
        // 14 Formen ohne Text, ohne Platzhalter und ohne Alternativtext (Linien, Flächen, Kreise) sind Schmuck: als dekorativ kennzeichnen,
        //    damit Vorleseprogramme sie übergehen und die Barrierefreiheitsprüfung keinen fehlenden Alternativtext meldet
        xml = xml.replace(/<p:sp>[\s\S]*?<\/p:sp>/g, sp => {
          if (/<a:t>[^<]+<\/a:t>/.test(sp) || /<p:ph\b/.test(sp) || /<p:cNvPr\b[^>]*\bdescr="[^"]+"/.test(sp)) return sp;
          return sp.replace(/(<p:cNvPr id="\d+" name="[^"]*")><\/p:cNvPr>/, (m, anfang) => (stat.dekorativ++, `${anfang}>${DEKORATIV}</p:cNvPr>`));
        });
        // 14 Tabellen: Kopfzeile oder Kopfspalte kennzeichnen; Formatvorlage „keine“, die Zellen tragen ihre Formatierung selbst
        const tab = ((o.tabellen || {})[kurz] || []).slice();
        let n = 0;
        xml = xml.replace(/<a:tblPr\/>/g, () => {
          const t = tab[n++] || {};
          stat.tabellen++;
          return `<a:tblPr${t.kopfzeile ? ' firstRow="1"' : ''}${t.kopfspalte ? ' firstCol="1"' : ''}><a:tableStyleId>${OHNE_STIL}</a:tableStyleId></a:tblPr>`;
        });
        if (o.tabellen && n !== tab.length) throw new Error(`${name}: ${n} Tabellen in der Folie, ${tab.length} hat der Bau gemeldet.`);
      }
      // 11 Form-IDs fortlaufend: Jede Form eines Teils bekommt eine eigene ID (die erste ist der Gruppenrahmen mit 1). Verweise auf Form-IDs
      //    (Verbinder, Animationen) gibt es in der Mappe nicht; kämen sie dazu, müssten sie mitgeführt werden.
      if (/\bspid="|<a:(?:stCxn|endCxn)\b/.test(xml)) throw new Error(`${name}: enthält Verweise auf Form-IDs (Verbinder oder Animation). Die Neuvergabe der IDs würde sie lösen.`);
      { let nr = 0; xml = xml.replace(/<p:cNvPr id="\d+"/g, () => `<p:cNvPr id="${++nr}"`); }
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
      // 13 Schema der Diagramme (dml-chart.xsd). PowerPoint und LibreOffice dulden die Abweichungen, verlassen sollte sich darauf niemand:
      //    a Liniendiagramm: Pflichtelement <c:grouping> vor <c:varyColors>
      xml = xml.replace(/<c:lineChart>(\s*)<c:varyColors/g, (m, leer) => (stat.diagrammSchema++, `<c:lineChart>${leer}<c:grouping val="standard"/><c:varyColors`));
      //    b Linienreihen: <c:invertIfNegative> gibt es dort nicht; <c:marker> steht vor <c:dLbls>
      xml = xml.replace(/<c:lineChart>[\s\S]*?<\/c:lineChart>/g, lin => lin.replace(/<c:ser>[\s\S]*?<\/c:ser>/g, ser => {
        ser = ser.replace(/\s*<c:invertIfNegative val="0"\/>/, () => (stat.diagrammSchema++, ''));
        const mk = ser.match(/<c:marker>[\s\S]*?<\/c:marker>/), dl = ser.match(/<c:dLbls>[\s\S]*?<\/c:dLbls>/);
        if (mk && dl && dl.index < mk.index) { ser = ser.slice(0, dl.index) + mk[0] + dl[0] + ser.slice(dl.index + dl[0].length, mk.index) + ser.slice(mk.index + mk[0].length); stat.diagrammSchema++; }
        return ser;
      }));
      //    e Balkenreihen: <c:dPt> steht vor <c:dLbls>
      xml = xml.replace(/<c:barChart>[\s\S]*?<\/c:barChart>/g, bar => bar.replace(/<c:ser>[\s\S]*?<\/c:ser>/g, ser => {
        const dl = ser.match(/<c:dLbls>[\s\S]*?<\/c:dLbls>/), punkte = [...ser.matchAll(/\s*<c:dPt>[\s\S]*?<\/c:dPt>/g)];
        if (!dl || !punkte.length || punkte[0].index < dl.index) return ser;
        const ende = punkte[punkte.length - 1].index + punkte[punkte.length - 1][0].length;
        stat.diagrammSchema++;
        return ser.slice(0, dl.index) + punkte.map(p => p[0].trim()).join('') + ser.slice(dl.index, punkte[0].index) + ser.slice(ende);
      }));
      //    c dritte Achsen-ID ohne Achse
      xml = xml.replace(/(<c:axId val="\d+"\/>\s*<c:axId val="\d+"\/>)\s*<c:axId val="\d+"\/>(?=\s*<\/c:(?:bar|line)Chart>)/g, (m, zwei) => (stat.diagrammSchema++, zwei));
      //    d <c:tickLblSkip> steht vor <c:noMultiLvlLbl> (an dieser Angabe hängt die Beschriftung jeder n-ten Kategorie)
      xml = xml.replace(/(\s*<c:noMultiLvlLbl val="\d"\/>)(\s*<c:tickLblSkip val="\d+"\/>)/g, (m, a, b) => (stat.diagrammSchema++, b + a));
      // Nullwerte: Der Zwischenspeicher führt 0, die Arbeitsmappe eine leere Zelle (pptxgenjs schreibt 0 nicht). Zellen merken, Schritt 13 unten füllt sie
      const mappe = await mappeVon(name);
      if (mappe) for (const ser of xml.matchAll(/<c:ser>[\s\S]*?<\/c:ser>/g)) {
        const val = ser[0].match(/<c:val>\s*<c:numRef>\s*<c:f>Sheet1!\$([A-Z]+)\$(\d+)(?::\$[A-Z]+\$\d+)?<\/c:f>([\s\S]*?)<\/c:numRef>/);
        if (!val) continue;
        for (const pt of val[3].matchAll(/<c:pt idx="(\d+)">\s*<c:v>([^<]*)<\/c:v>/g)) if (pt[2] !== '' && Number(pt[2]) === 0) (nullZellen[mappe] = nullZellen[mappe] || new Set()).add(val[1] + (Number(val[2]) + Number(pt[1])));
      }
      zip.file(name, xml);
    } else if (/^ppt\/notesSlides\/[^/]+\.xml$/.test(name)) {
      // 15 Notizen: je Zeile ein Absatz (pptxgenjs schreibt alle Zeilen in einen Lauf, getrennt nur durch Zeilenvorschub-Zeichen)
      let xml = await zip.file(name).async('string');
      xml = xml.replace(/<a:p><a:r>(<a:rPr\b[^>]*\/>)<a:t>([^<]*\n[^<]*)<\/a:t><\/a:r>(<a:endParaRPr\b[^>]*\/>)?<\/a:p>/g, (m, rpr, text, ende) => text.split(/\r?\n/).map(z => {
        stat.notizAbsaetze++;
        return z.trim() ? `<a:p><a:r>${rpr}<a:t>${z}</a:t></a:r></a:p>` : `<a:p>${ende || '<a:endParaRPr lang="de-DE" dirty="0"/>'}</a:p>`;
      }).join(''));
      zip.file(name, xml);
    }
  }

  // 6 und 13 eingebettete Arbeitsmappen der Diagramme: Verfasser und Datum ersetzen, Nullwerte füllen, Tabellenbereich richten
  for (const name of Object.keys(zip.files).filter(n => /^ppt\/embeddings\/.+\.xlsx$/.test(n)).sort()) {
    const xl = await JSZip.loadAsync(await zip.file(name).async('nodebuffer'));
    const core = xl.file('docProps/core.xml');
    if (core) {
      const neu = (await core.async('string')).replace(/(<dc:creator>)[^<]*(<\/dc:creator>)/, `$1${xmlAttr(firma)}$2`).replace(/(<cp:lastModifiedBy>)[^<]*(<\/cp:lastModifiedBy>)/, `$1${xmlAttr(firma)}$2`)
        .replace(/(<dcterms:(created|modified)\b[^>]*>)[^<]*(<\/dcterms:\2>)/g, `$1${datum}$3`);
      xl.file('docProps/core.xml', neu);
    }
    const blatt = xl.file('xl/worksheets/sheet1.xml'), zellen = nullZellen[name];
    if (blatt && zellen) {
      let x = await blatt.async('string');
      for (const z of zellen) x = x.replace(`<c r="${z}"><v></v></c>`, () => (stat.nullen++, `<c r="${z}"><v>0</v></c>`));
      xl.file('xl/worksheets/sheet1.xml', x);
    }
    // pptxgenjs schreibt den Bereich der Tabelle mit einem überzähligen Apostroph (ref="A1:D3'")
    const tabelle = xl.file('xl/tables/table1.xml');
    if (tabelle) xl.file('xl/tables/table1.xml', (await tabelle.async('string')).replace(/(<table\b[^>]*\bref="[A-Z]+\d+:[A-Z]+\d+)'"/, '$1"'));
    const sauber = new JSZip();
    for (const n of Object.keys(xl.files).filter(n => !xl.files[n].dir)) sauber.file(n, await xl.file(n).async('nodebuffer'), { createFolders: false, date: zipDatum });
    zip.file(name, await sauber.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
    stat.arbeitsmappen++;
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
    // Form-IDs: je Folie, Layout, Master und Notizseite eindeutig
    if (/^ppt\/(slides|slideLayouts|slideMasters|notesSlides|notesMasters)\/[^/]+\.xml$/.test(name)) {
      const ids = [...xml.matchAll(/<p:cNvPr id="(\d+)"/g)].map(m => m[1]), doppelt = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
      if (doppelt.length) throw new Error(`${name}: Form-ID ${doppelt.join(', ')} ist doppelt vergeben. IDs müssen je Folie eindeutig sein.`);
    }
  }
  const reste = Object.entries(offen).flatMap(([d, a]) => [...Object.keys(a.striche || {}).map(r => `${d}: Strichart für Reihe „${r}“`), ...Object.keys(a.labelFarben || {}).map(r => `${d}: Beschriftungsfarbe für Reihe „${r}“`)]);
  if (reste.length) throw new Error('Nachbearbeitung: nicht angewendet (Reihe nicht gefunden): ' + reste.join('; '));

  // 12 idx der Platzhalter: je Platzhaltername eine feste Nummer, gleich in allen Layouts (pptxgenjs zählt die Objekte eines Layouts durch;
  //    derselbe Platzhalter hätte sonst je Layout eine andere Nummer, und ein Layoutwechsel in PowerPoint würfe die Texte in falsche Felder)
  if (o.layouts) {
    const neuIdx = (xml, L, wo) => xml.replace(/<p:ph\b[^>]*>/g, ph => ph.replace(/\bidx="(\d+)"/, (m, i) => {
      const p = L.platzhalter[i];
      if (!p || !(p.idx > 0)) throw new Error(`${wo}: Für den Platzhalter mit idx ${i} ist keine feste Nummer hinterlegt (lib/layouts.cjs, IDX).`);
      stat.idx++;
      return `idx="${p.idx}"`;
    }));
    for (const [lay, L] of Object.entries(layoutVon)) {
      const nummern = Object.values(L.platzhalter).map(p => p.idx).filter(i => i > 0);
      if (new Set(nummern).size !== nummern.length) throw new Error(`${lay}: Zwei Platzhalter des Layouts bekämen dieselbe Nummer (lib/layouts.cjs, IDX).`);
      zip.file(lay, neuIdx(await zip.file(lay).async('string'), L, lay));
    }
    for (const name of Object.keys(zip.files).filter(n => /^ppt\/slides\/[^/]+\.xml$/.test(n))) {
      const lay = await zielVon(name, /slideLayouts\/[^/]+\.xml$/), L = layoutVon[lay];
      if (!L) throw new Error(`${name}: Das Layout der Folie (${lay}) ist nicht beschrieben.`);
      zip.file(name, neuIdx(await zip.file(name).async('string'), L, name));
    }
  }

  // 16 Paket: Inhaltstypen. Den Typ image/jpg gibt es nicht; Einträge für Teile, die nicht im Paket liegen (pptxgenjs zählt je Folie einen Master), entfallen
  {
    const teil = '[Content_Types].xml';
    let xml = await zip.file(teil).async('string');
    xml = xml.replaceAll('ContentType="image/jpg"', 'ContentType="image/jpeg"')
      .replace(/<Override PartName="\/([^"]+)"[^>]*\/>/g, (m, pfad) => (zip.file(pfad) ? m : (stat.inhaltstypen++, '')));
    zip.file(teil, xml);
  }
  // 17 presentation.xml: Abschnitts-IDs aus dem Namen. Die Liste der Notizmaster bleibt hinter der Folienliste, wie pptxgenjs sie schreibt:
  //    Das Schema nennt sie davor, aber Notiz- und Folienmaster teilen sich hier ein Theme, und PowerPoint lehnt die Schema-Reihenfolge dann ab.
  {
    const teil = 'ppt/presentation.xml';
    let xml = await zip.file(teil).async('string');
    xml = xml.replace(/(<p14:section name="([^"]*)" id=")[^"]*"/g, (m, anfang, n) => `${anfang}${guid('Abschnitt ' + entXml(n))}"`);
    zip.file(teil, xml);
  }
  // 17 festes Datum in den Eigenschaften
  {
    const core = zip.file('docProps/core.xml');
    if (core) zip.file('docProps/core.xml', (await core.async('string')).replace(/(<dcterms:(created|modified)\b[^>]*>)[^<]*(<\/dcterms:\2>)/g, `$1${datum}$3`));
  }

  // 10 Dateieigenschaften: Schriften, Theme und Folientitel, wie PowerPoint sie beim Speichern einträgt
  const app = zip.file('docProps/app.xml');
  if (app && Array.isArray(o.folientitel)) {
    const schriften = (o.schriften || []).filter(f => benutzt.has(f)), teile = [...schriften, o.theme.name, ...o.folientitel];
    const paar = (wort, n) => `<vt:variant><vt:lpstr>${wort}</vt:lpstr></vt:variant><vt:variant><vt:i4>${n}</vt:i4></vt:variant>`;
    let xml = await app.async('string');
    xml = xml.replace(/<HeadingPairs>[\s\S]*?<\/HeadingPairs>/, () => `<HeadingPairs><vt:vector size="6" baseType="variant">${paar('Fonts Used', schriften.length)}${paar('Theme', 1)}${paar('Slide Titles', o.folientitel.length)}</vt:vector></HeadingPairs>`)
      .replace(/<TitlesOfParts>[\s\S]*?<\/TitlesOfParts>/, () => `<TitlesOfParts><vt:vector size="${teile.length}" baseType="lpstr">${teile.map(t => `<vt:lpstr>${xmlAttr(t)}</vt:lpstr>`).join('')}</vt:vector></TitlesOfParts>`);
    // Format, Wörter und Absätze: gezählt über die Texte der Folien (pptxgenjs trägt 0 und das alte 16:9-Format ein)
    let woerter = 0, absaetze = 0;
    for (const n of Object.keys(zip.files).filter(n => /^ppt\/slides\/[^/]+\.xml$/.test(n))) {
      for (const p of (await zip.file(n).async('string')).matchAll(/<a:p>[\s\S]*?<\/a:p>/g)) {
        const t = entXml([...p[0].matchAll(/<a:t>([^<]*)<\/a:t>/g)].map(m => m[1]).join('')).trim();
        if (t) { absaetze++; woerter += t.split(/[\s\u00A0]+/).length; }
      }
    }
    xml = xml.replace(/<PresentationFormat>[^<]*<\/PresentationFormat>/, '<PresentationFormat>Breitbild</PresentationFormat>')
      .replace(/<Words>\d*<\/Words>/, `<Words>${woerter}</Words>`).replace(/<Paragraphs>\d*<\/Paragraphs>/, `<Paragraphs>${absaetze}</Paragraphs>`);
    zip.file('docProps/app.xml', xml);
    stat.eigenschaften = teile.length;
    const fremd = [...benutzt].filter(f => !(o.schriften || []).includes(f));
    if (o.schriften && fremd.length) throw new Error(`Schriften außerhalb des Planwerks in der Mappe: ${fremd.join(', ')} (erlaubt: ${o.schriften.join(', ')}).`);
  }

  // 7 neu packen ohne Ordner-Einträge; [Content_Types].xml zuerst
  const out = new JSZip();
  const names = Object.keys(zip.files).filter(n => !zip.files[n].dir).sort((a, b) => (a === '[Content_Types].xml' ? -1 : b === '[Content_Types].xml' ? 1 : 0));
  // 17 jeder Eintrag trägt dasselbe Datum: Zwei Läufe des Baus liefern dieselbe Datei
  for (const n of names) out.file(n, await zip.file(n).async('nodebuffer'), { createFolders: false, date: zipDatum });
  fs.writeFileSync(datei, await out.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  return stat;
}

module.exports = { nachbearbeiten };
