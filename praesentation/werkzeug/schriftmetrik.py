# Erzeugt lib/schriftmetrik.json: Zeichenbreiten (em) je Schriftdatei für die Passprüfung von Titeln, Kennzahlen und Tabellenköpfen.
# Aufruf (nur nötig, wenn sich fonts/ ändert): python -I werkzeug/schriftmetrik.py fonts lib/schriftmetrik.json   (braucht fontTools)
import glob, json, os, sys
from fontTools.ttLib import TTFont
src, out = sys.argv[1], sys.argv[2]
chars = [chr(c) for c in range(0x20, 0x7f)] + [chr(c) for c in range(0xa0, 0x100)] + list('€–—„“‚‘’”…·•→↔≤≥≈‰±−×÷²³½§ẞŒœ■')
res = {}
for p in sorted(glob.glob(os.path.join(src, '*.ttf'))):
    f = TTFont(p); cmap = f.getBestCmap(); hm = f['hmtx'].metrics; upm = f['head'].unitsPerEm; os2 = f['OS/2']; name = f['name']
    res[os.path.basename(p)[:-4]] = {
        'familie': name.getDebugName(1), 'stil': name.getDebugName(2), 'gewicht': os2.usWeightClass,
        'zeile_em': round((f['hhea'].ascent - f['hhea'].descent + f['hhea'].lineGap) / upm, 4), 'versalhoehe_em': round(os2.sCapHeight / upm, 4),
        'breiten_em': {ch: round(hm[cmap[ord(ch)]][0] / upm, 4) for ch in chars if ord(ch) in cmap},
    }
json.dump(res, open(out, 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(res), 'Schriften ->', out)
