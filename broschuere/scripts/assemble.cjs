#!/usr/bin/env node
// Setzt die Broschüre aus src/template.html und den Seiten-Partials in src/pages/*.html zusammen.
//
// Nutzung:
//   node scripts/assemble.cjs                         -> src/index.html (alle Seiten)
//   node scripts/assemble.cjs --only 05 --out src/.preview-05.html
//                                                     -> nur Seiten, deren Dateiname mit "05" beginnt
// --only akzeptiert eine kommagetrennte Liste von Präfixen (z. B. "01,02").

const fs = require('fs');
const path = require('path');
const { hyphenateSync } = require('hyphen/de');

// Headless-Chromium trennt Deutsch nicht selbst (hyphens: auto greift nicht) – daher werden in
// Textknoten weiche Trennstriche (U+00AD) gesetzt. Tags, <style>, <script> und <svg> bleiben unberührt.
// Mindestens 3 Zeichen vor bzw. nach einer Trennstelle, Wörter ab 8 Buchstaben.
const SHY = '\u00AD';
// Ausnahmen mit festen Trennfugen (Kompositionsfugen statt sinnentstellender Automaten-Trennung):
// „Überkompensati-onsprüfung“, „Hil-festellung“, „Bauab-nahme“ … Schlüssel klein geschrieben; ein Strich „-“
// markiert die einzige erlaubte Trennstelle, ein Wort ohne Strich wird gar nicht getrennt.
// Gilt auch für Flexionsformen: Endet das Wort auf eine der Endungen in EXC_SUFFIXES, wird der Stamm nachgeschlagen.
const HYPH_EXCEPTIONS = new Map(Object.entries({
  'überkompensationsprüfung': 'überkompensations-prüfung',
  'überkompensationsverbot': 'überkompensations-verbot',
  'überkompensation': 'über-kompensation',
  'hilfestellung': 'hilfe-stellung',
  'bauabnahme': 'bau-abnahme',
  'energiebedarfsausweis': 'energiebedarfs-ausweis',
  'energieausweis': 'energie-ausweis',
  'wohnungsmarktbeobachtung': 'wohnungsmarkt-beobachtung',
  'vorhabenbeginn': 'vorhaben-beginn',
  'vorzeitigem': 'vorzeitigem',
  'vorzeitigen': 'vorzeitigen',
  'vorzeitiger': 'vorzeitiger',
  'wohnraumförderstelle': 'wohnraum-förder-stelle',
  'wohnraumförderstellen': 'wohnraum-förder-stellen',
  'mehrfamilienhäuser': 'mehr-familien-häuser',
  'mehrfamilienhaus': 'mehr-familien-haus',
  // Trennung nur an der Kompositionsfuge („Pfle-gegrad“, „Bemes-sungsgrenze“, „Eigen-tumswohnungen“ …)
  'pflegegrad': 'pflege-grad',
  'entwicklungskonzept': 'entwicklungs-konzept',
  'gemeinschaftsunterkünfte': 'gemeinschafts-unterkünfte',
  'subventionserheblich': 'subventions-erheblich',
  'energieeffizienz': 'energie-effizienz',
  'bearbeitungsentgelt': 'bearbeitungs-entgelt',
  'finanzierungsentscheidung': 'finanzierungs-entscheidung',
  'antragseingang': 'antrags-eingang',
  'grundbuchlastenfrei': 'grundbuch-lasten-frei',
  'bedarfsabschätzung': 'bedarfs-abschätzung',
  'mieterseite': 'mieter-seite',
  'fehlbelegung': 'fehl-belegung',
  'belegungsbindung': 'belegungs-bindung',
  'förderentscheidung': 'förder-entscheidung',
  'verwaltungskostenbeitrag': 'verwaltungs-kosten-beitrag',
  'kapitalkosten': 'kapital-kosten',
  'kostengruppe': 'kosten-gruppe',
  'bemessungsgrenze': 'bemessungs-grenze',
  'zuwendungsfähig': 'zuwendungs-fähig',
  'eigentumswohnung': 'eigentums-wohnung',
  'eigentumswohnungen': 'eigentums-wohnun-gen',
  'eigentumsumschreibung': 'eigentums-umschreibung',
  'bezugsfertigkeit': 'bezugs-fertigkeit',
  'prozentpunkt': 'prozent-punkt',
  'personenkreis': 'personen-kreis',
  'einzelmaßnahme': 'einzel-maßnahme',
  'erhöhungssperre': 'erhöhungs-sperre',
  'finanzierungsaufteilung': 'finanzierungs-aufteilung',
  'wohnungsmarkt': 'wohnungs-markt',
  'marktakteur': 'markt-akteur',
  'städtebaulich': 'städte-baulich',
  'städtebaulicher': 'städte-baulicher',
  'städtebaulichem': 'städte-baulichem',
  'wohnraumversorgungskonzept': 'wohnraum-versorgungs-konzept',
  'baulandmodell': 'bauland-modell',
  'gebäudenutzfläche': 'gebäude-nutz-fläche',
  'einkommensgruppe': 'einkommens-gruppe',
  // ungetrennt: kurze Wörter, deren Rest sonst allein in der letzten Zeile stünde („zulas-sen.“, „Maß-nahmen.“)
  'einkommen': 'einkommen',
  'zulassen': 'zulassen',
  'maßnahme': 'maßnahme',
  'bindungsende': 'bindungsende',
  'förderberatung': 'förderberatung',
}));
const EXC_SUFFIXES = ['', 's', 'es', 'en', 'n', 'e'];
function exceptionFor(word) {
  const lower = word.toLowerCase();
  for (const suf of EXC_SUFFIXES) {
    if (suf && !lower.endsWith(suf)) continue;
    const stem = suf ? lower.slice(0, -suf.length) : lower;
    const hit = HYPH_EXCEPTIONS.get(stem);
    if (!hit) continue;
    // Groß-/Kleinschreibung des Originals übernehmen, Strich → weicher Trennstrich
    let out = '', i = 0;
    for (const ch of hit) {
      if (ch === '-') { out += SHY; continue; }
      out += word[i++];
    }
    return out + word.slice(i);
  }
  return null;
}
function hyphenateWord(word) {
  const exc = exceptionFor(word);
  if (exc !== null) return exc;
  const parts = hyphenateSync(word, { hyphenChar: SHY }).split(SHY);
  while (parts.length > 1 && parts[0].length < 3) parts.splice(0, 2, parts[0] + parts[1]);
  while (parts.length > 1 && parts[parts.length - 1].length < 3) parts.splice(-2, 2, parts[parts.length - 2] + parts[parts.length - 1]);
  return parts.join(SHY);
}

// Geschützte Leerzeichen (vor der Trennung, in allen Textknoten außer <style>/<script>/<svg>/<title>):
// Zahl + Einheit, Abkürzung + Zahl, mehrteilige Abkürzungen. U+00A0 hat dieselbe Breite wie das normale
// Leerzeichen – der Satz ändert sich nur dort, wo bisher zwischen den Teilen umbrochen wurde.
const NBSP = '\u00A0';
const NBSP_RULES = [
  [/(\d) (%|€|m²|Mio\.|Mrd\.|Euro\b)/g, `$1${NBSP}$2`],
  [/(^|[\s(„–])(§§?|Nr\.|S\.|Abs\.|DIN|max\.|mind\.|inkl\.|ca\.|rd\.|Nds\. MBl\.|MBl\.) (\d)/g, `$1$2${NBSP}$3`],
  [/(Mio\.|Mrd\.) €/g, `$1${NBSP}€`],
  [/\bp\. a\./g, `p.${NBSP}a.`],
  [/\bz\. B\./g, `z.${NBSP}B.`],
  [/\bu\. a\./g, `u.${NBSP}a.`],
  [/\bd\. h\./g, `d.${NBSP}h.`],
  [/\bi\. d\. R\./g, `i.${NBSP}d.${NBSP}R.`],
  // Rechtszitate zusammenhalten: „§ 7 Abs. 3“, „§ 4 Satz 2“, „Abs. 3 Satz 1“ – läuft nach der §-Ziffer-Regel
  // (dort ist „§ 7“ schon „§ 7“ mit U+00A0 – oder im Partial als &nbsp; geschrieben, daher beides im Muster); „RL Nr. 11.4“, „je m²“.
  [/(§§?(?:[ \u00A0]|&nbsp;)?\d+[a-z]?) (Abs\.|Satz|Nr\.)/g, `$1${NBSP}$2`],
  [/(Abs\.(?:[ \u00A0]|&nbsp;)\d+[a-z]?) (Satz|Nr\.)/g, `$1${NBSP}$2`],
  [/\bRL (Nr\.)/g, `RL${NBSP}$1`],
  [/\bje (m²)/g, `je${NBSP}$1`],
  // Zahlen- und Stufenbereiche mit Halbgeviertstrich nie am Strich umbrechen („10–|40 %“, „6,50–|9,00 €“, „I–|III“):
  // Chromium bricht nach „–“ um (Zeilenumbruchklasse BA). Der ganze Bereich samt Einheit kommt in .u-nowrap
  // (läuft nach den NBSP-Regeln; ein Wortverbinder U+2060 stünde im Textlayer des PDFs).
  [/(\d[\d.,:]*–\d[\d.,:]*(?:(?:\u00A0|&nbsp;)(?:%|€|m²|Mio\.(?:\u00A0|&nbsp;)€|Mio\.|Mrd\.|Jahre\b))?|\b[IVX]+–[IVX]+\b)/g,
    '<span class="u-nowrap">$1</span>'],
];
function protectSpaces(text) {
  return NBSP_RULES.reduce((t, [re, rep]) => t.replace(re, rep), text);
}
// Elemente, die per CSS nie getrennt werden (hyphens: none in styles.css): dort keine weichen Trennstriche setzen,
// sonst landen sie im Textlayer des PDFs („EDI­TO­RIAL“, „STICH­TAG“) und stören Suche, Copy & Paste und Screenreader.
// Liste muss eine Teilmenge der hyphens:none-Selektoren in styles.css sein (dann ändert sich am Satz nichts).
// .u-hyphens / .u-justify schalten die Trennung für ein Element (und seine Kinder) wieder ein.
// Tabellenköpfe (thead) sind Versal-Labels; Zeilenköpfe (tbody th) trennen dagegen bewusst (S. 4) und
// werden nur im Term Sheet (S. 9) per .u-nohyphens ausgenommen.
const NOHY_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'thead']);
const NOHY_CLASSES = new Set([
  'h1', 'h2', 'h3', 'h4', 'display', 'cover__title', 'chapter-no', 'deck', 'kf__label', 'chart__title', 'fig-head__title',
  'step__title', 'faq__q', 'callout__title', 'program__title', 'model__title', 'contact__name', 'term__word', 'path__title',
  'kicker', 'label', 'callout__label', 'term__label', 'kf__pre', 'bullets__title', 'contact__label', 'seal__pre',
  'titleblock__label', 'audience__label', 'steps__head-label', 'page__section', 'u-nohyphens', 'u-url',
  'stamp', 'stampline', 'cover__rl', 'lead', 'caveat', 'chapter-no__label', 'badge__pre',
  // PGN-Designsystem: Plakatzeile, Leistungen, Referenzen, Bauzeitenplan, Planzeichen, Schriftfeld
  'claim', 'service__title', 'service__phase', 'reference__name', 'bzp__title', 'keyplan', 'photo__tag', 'kote', 'axis-no',
  'values__word', 'offer-box__title', 'plan-legend__title', 'cover__kpi-pre', 'titleblock__value', 'page__running',
  // Integration der Seiten-CSS: Platzhalter, Run-in-Label, Kurzstempel, Programmnummer im Text
  'ph', 'runin', 'bs-no',
]);
const HY_CLASSES = new Set(['u-hyphens', 'u-justify']);
// Einheitenzeichen bleiben im Versalsatz klein („JE m² WOHNFLÄCHE“, nicht „JE M²“): in Elementen ohne Trennung
// (Überschriften, Labels, Vorspann, Tabellenköpfe – dort sitzen die Versal-Stile) kommt „m²“ in <span class="u-unit">
// (text-transform: none). In Fließtext ändert der Span nichts und entfällt deshalb. SVG-Text bleibt unberührt.
const wrapUnits = (text) => text.replace(/m²/g, '<span class="u-unit">m²</span>');
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

function hyphenateHtml(html) {
  // <style>, <script>, <svg>, <title>: Inhalt unverändert. Der Zustand gilt bis zum passenden schließenden Tag des
  // äußersten übersprungenen Elements – ein <style> oder <title> in einem Inline-SVG (Signaturen) und verschachtelte
  // <svg> setzen ihn nicht zurück (sonst bekämen die <text> nach dem inneren </style> weiche Trennstriche).
  let skip = null, skipDepth = 0;
  const stack = [];         // offene Elemente: { tag, nohy }
  return html
    .split(/(<[^>]+>)/)
    .map((chunk) => {
      if (chunk.startsWith('<')) {
        const m = chunk.match(/^<(\/?)(style|script|svg|title)\b/i);
        const mt = m && m[2].toLowerCase();
        if (m && !m[1] && !chunk.endsWith('/>')) {
          if (!skip) { skip = mt; skipDepth = 1; } else if (skip === mt) skipDepth++;
        } else if (m && m[1] && skip === mt && --skipDepth === 0) skip = null;
        if (skip || m || chunk.startsWith('<!')) return chunk;
        const t = chunk.match(/^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)/);
        if (!t) return chunk;
        const tag = t[2].toLowerCase();
        if (t[1]) {                                   // schließendes Tag: bis zum passenden öffnenden abbauen
          const i = stack.map((e) => e.tag).lastIndexOf(tag);
          if (i > -1) stack.length = i;
        } else if (!VOID_TAGS.has(tag) && !chunk.endsWith('/>')) {
          const cls = ((chunk.match(/\sclass="([^"]*)"/) || [])[1] || '').split(/\s+/);
          const parent = stack.length ? stack[stack.length - 1].nohy : false;
          const hy = cls.some((c) => HY_CLASSES.has(c));
          const nohy = !hy && (parent || NOHY_TAGS.has(tag) || cls.some((c) => NOHY_CLASSES.has(c)));
          stack.push({ tag, nohy, unit: cls.includes('u-unit') });
        }
        return chunk;
      }
      if (skip) return chunk;
      const text = protectSpaces(chunk);
      const top = stack.length ? stack[stack.length - 1] : null;
      if (top && top.nohy) return top.unit ? text : wrapUnits(text);
      return text.replace(/[A-Za-zÄÖÜäöüß]{8,}/g, hyphenateWord);
    })
    .join('');
}

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const out = path.resolve(root, arg('out', 'src/index.html'));
const only = arg('only', null);

if (path.dirname(out) !== src) {
  console.error('--out muss in src/ liegen, damit relative Pfade (fonts/, assets/, styles.css) stimmen.');
  process.exit(1);
}

const prefixes = only ? only.split(',').map((s) => s.trim()) : null;
const files = fs
  .readdirSync(path.join(src, 'pages'))
  .filter((f) => f.endsWith('.html'))
  .filter((f) => !prefixes || prefixes.some((p) => f.startsWith(p)))
  .sort();

if (!files.length) {
  console.error('Keine passenden Seiten in src/pages gefunden.');
  process.exit(1);
}

// Generated Content ist im getaggten PDF unsichtbar (Screenreader, Vorlesen, Textlayer). Bedeutungstragender Text
// steht deshalb als echter DOM-Text im Satz – das Partial bleibt schlank, assemble.cjs ergänzt:
//   1. Fußnotenziffern: jedes nummerierte <li> einer .footnotes-Liste (nicht .footnotes__src) bekommt
//      <span class="footnotes__no">N</span> vorangestellt (N = laufende Nummer innerhalb der Liste).
//   2. Vordruck-Badges: <span class="badge … badge--form">1011</span> bekommt <span class="badge__pre">Vordruck </span>
//      (mit geschütztem Leerzeichen, damit Textlayer und Vorlesen „Vordruck 1011“ ergeben).
function generatedText(html) {
  html = html.replace(/(<ol\b[^>]*\bclass="[^"]*\bfootnotes\b[^"]*"[^>]*>)([\s\S]*?)(<\/ol>)/g, (m, open, inner, close) => {
    let n = 0;
    inner = inner.replace(/<li\b([^>]*)>(\s*)(<span class="footnotes__no">\d+<\/span>)?/g, (li, attrs, ws, existing) => {
      if (/\bfootnotes__src\b/.test(attrs)) return li;
      n++;
      return `<li${attrs}>${ws}<span class="footnotes__no">${n}</span>`;
    });
    return open + inner + close;
  });
  html = html.replace(/(<span\b[^>]*\bclass="[^"]*\bbadge--form\b[^"]*"[^>]*>)(?!<span class="badge__pre">)/g,
    `$1<span class="badge__pre">Vordruck${NBSP}</span>`);
  return html;
}

const template = fs.readFileSync(path.join(src, 'template.html'), 'utf8');
const pages = files
  .map((f) => `<!-- ${f} -->\n` + fs.readFileSync(path.join(src, 'pages', f), 'utf8').trim())
  .join('\n\n');
fs.writeFileSync(out, hyphenateHtml(generatedText(template.replace('<!--PAGES-->', pages))));
console.log(`${files.length} Seite(n) -> ${path.relative(root, out)}`);
