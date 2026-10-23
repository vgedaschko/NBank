// XML-Hilfen für IDML: Escaping, Attribute (ohne Doppelungen), Zahlenformat.
const HDR = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const NS = 'xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging"';

// In XML 1.0 unzulässige Steuerzeichen entfernen (Tab bleibt)
const clean = (s) => String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '');
const esc = (s) => clean(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;').replace(/\t/g, '&#9;').replace(/\n/g, '&#10;');

// Zahl kompakt (max. 4 Nachkommastellen, kein „-0“)
function num(v, d = 4) {
  if (typeof v !== 'number' || !isFinite(v)) return '0';
  let s = v.toFixed(d).replace(/\.?0+$/, '');
  if (s === '-0') s = '0';
  return s;
}

// Attribute aus [[name, wert], …] oder Objekt; spätere Werte überschreiben frühere (keine doppelten Attribute)
function attrs(list) {
  const m = new Map();
  const entries = Array.isArray(list) ? list : Object.entries(list);
  for (const [k, v] of entries) {
    if (v === undefined || v === null) continue;
    m.set(k, typeof v === 'number' ? num(v) : String(v));
  }
  return [...m].map(([k, v]) => ` ${k}="${escAttr(v)}"`).join('');
}

function el(name, a, children) {
  const at = attrs(a || []);
  if (children === undefined || children === null || children === '') return `<${name}${at}/>`;
  return `<${name}${at}>${children}</${name}>`;
}

module.exports = { HDR, NS, esc, escAttr, num, attrs, el };
