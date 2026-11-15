"""Bausteine für seiten_json.py: erzeugt content/pages/10-, 11-, 12-*.json der Broschüre (Modellrechnung, Stand 15.11.2026). Jede Zahl der Seite steht in „belege“
mit einer Formel über Zellen der Rechenmappe; der Text der Zahl entsteht aus dieser Formel mit den Werten aus
praesentation/daten/werte.json und kennzahlen.json. vofi/pruefe_vofi.py (F9) rechnet dieselben Formeln gegen die Mappe."""
import ast, json, math, operator, re, sys
from pathlib import Path

NB = Path(__file__).resolve().parents[3]   # Wurzel des Repositorys (broschuere/scripts/modellrechnung → ../../..)
WERTE = json.loads((NB / 'praesentation/daten/werte.json').read_text())
KZ = json.loads((NB / 'praesentation/daten/kennzahlen.json').read_text())

# Zellen → Wert: Standardlauf (L2 = Lauf modellhaus) und Kostenlauf 5.460 € je m² (L70 = modellhaus_kosten_5460)
ZELLEN = {'': {}, 'L69': {}, 'L70': {}}
def spalte_zeile(z):
    m = re.fullmatch(r'([A-Z]+)(\d+)', z); return m.group(1), int(m.group(2))
for lauf, ziel in (('modellhaus', ''), ('modellhaus_kosten_4631', 'L69'), ('modellhaus_kosten_5460', 'L70'), ('modellhaus_zeitreihe', '')):
    for e in WERTE['laeufe'][lauf]['werte'].values():
        b, z, v = e.get('blatt'), e.get('zelle'), e.get('wert')
        if not b or not z:
            continue
        if ':' in z and isinstance(v, list):
            s0, r0 = spalte_zeile(z.split(':')[0])
            for i, x in enumerate(v):
                ZELLEN[ziel][(b, f'{s0}{r0 + i}')] = x
        elif isinstance(v, (int, float)) and not isinstance(v, bool):
            ZELLEN[ziel].setdefault((b, z), v)
for e in KZ['laeufe']['modellhaus']['werte'].values():
    b, z, v = e.get('blatt'), e.get('zelle'), e.get('wert')
    if b and z and isinstance(v, (int, float)) and not isinstance(v, bool):
        ZELLEN[''].setdefault((b, z), v)

REF = re.compile(r"(?:(L\d+):)?(?:'([^']+)'|([A-Za-zÄÖÜäöüß]+))!([A-Z]+\d+)")
def rechne(formel):
    namen = {}
    def ersetze(m):
        lauf, blatt, zelle = m.group(1) or '', m.group(2) or m.group(3), m.group(4)
        if (blatt, zelle) not in ZELLEN[lauf]:
            raise KeyError(f'{lauf + ":" if lauf else ""}{blatt}!{zelle} nicht in werte.json/kennzahlen.json')
        n = f'z{len(namen)}'; namen[n] = ZELLEN[lauf][(blatt, zelle)]; return n
    ausdruck = REF.sub(ersetze, formel)
    ops = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv, ast.USub: operator.neg}
    def w(n):
        if isinstance(n, ast.Constant): return n.value
        if isinstance(n, ast.Name): return namen[n.id]
        if isinstance(n, ast.BinOp): return ops[type(n.op)](w(n.left), w(n.right))
        if isinstance(n, ast.UnaryOp): return ops[type(n.op)](w(n.operand))
        if isinstance(n, ast.Call) and n.func.id == 'abrunden': return math.floor(w(n.args[0]) / w(n.args[1])) * w(n.args[1])
        raise ValueError(formel)
    return w(ast.parse(ausdruck, mode='eval').body)

def runde(v, nk):
    q = 10 ** nk; return math.floor(abs(v) * q + 0.5) / q * (1 if v >= 0 else -1)
def de(v, nk=0):
    r = runde(v, nk); s = f'{abs(r):.{nk}f}'; g, _, d = s.partition('.')
    g = re.sub(r'\B(?=(\d{3})+(?!\d))', '.', g)
    return ('−' if r < 0 else '') + g + (',' + d if d else '')
FAKTOR = {'zahl': 1, 'prozent': 100, 'mio': 1e-6, 'tsd': 1e-3, 'jahr': 1}

def Z(key, lauf='modellhaus'):
    """Zelle eines Schlüssels aus kennzahlen.json (annahme.*, n*.*) oder werte.json als Bezug „Blatt!Zelle“ (Blatt in Hochkommas, wenn nötig)"""
    e = KZ['laeufe']['modellhaus']['werte'].get(key) or WERTE['laeufe'][lauf]['werte'].get(key)
    if not e or not e.get('blatt'): raise KeyError(key)
    b = e['blatt']; return (b if re.fullmatch(r'[A-Za-zÄÖÜäöüß]+', b) else f"'{b}'") + '!' + e['zelle']

class Seite:
    def __init__(self): self.belege = []
    def n(self, formel, art='zahl', nk=0, wo=''):
        v = rechne(formel) * FAKTOR.get(art, 1); t = str(int(v)) if art == 'jahr' else de(v, nk)
        self.belege.append({'text': t, 'formel': formel, 'art': art, 'nk': nk, 'wo': wo}); return t
    def k(self, key, art='zahl', nk=0, wo=''):
        """Zahl aus einem Lauf, den nur build_kennzahlen.py rechnet (n6.*): Beleg ist kennzahlen.json, nicht eine Zelle der Standardmappe"""
        e = KZ['laeufe'][key.split('.')[1]]['werte'][key]; v = e['wert'] * FAKTOR[art]; t = de(v, nk)
        self.belege.append({'text': t, 'kennzahl': key, 'art': art, 'nk': nk, 'wo': wo}); return t
    def frei(self, text, herkunft, wo=''):
        self.belege.append({'text': text, 'herkunft': herkunft, 'wo': wo}); return text

def schreibe(nr, name, daten, seite):
    daten['belege'] = seite.belege
    daten['belege_hinweis'] = ('Jede Zahl der Seite mit ihrer Formel über Zellen der Rechenmappe v3 (Lauf L2 = Standard, Projekt 2; „L70:“ = Lauf mit '
                               '5.460 € je m²). „art“: zahl, prozent (× 100), mio (÷ 1.000.000), tsd (÷ 1.000); „nk“: Nachkommastellen. vofi/pruefe_vofi.py '
                               '(F9) rechnet jede Formel gegen die Mappe nach und prüft, dass der Text so im Partial steht. Erzeugt aus den Werten der '
                               'Präsentation (werte.json, kennzahlen.json) am 15.11.2026.')
    p = NB / 'broschuere/content/pages' / f'{nr:02d}-{name}.json'
    p.write_text(json.dumps(daten, ensure_ascii=False, indent=2) + '\n')
    print(p.name, len(seite.belege), 'Belege')
