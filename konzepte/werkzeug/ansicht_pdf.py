"""Baut je Team eine Ansichts-PDF: alle Folien in Vortragsreihenfolge, danach die Broschürenseiten."""
import glob, os, re
from PIL import Image, ImageDraw, ImageFont

HIER = os.path.dirname(os.path.abspath(__file__))
BASIS = os.path.dirname(HIER)
FONT = os.path.expanduser("~/.fonts/pgn/WorkSans-Medium.ttf")
LEIT = {"1": "Geldfluss", "2": "Fragen eines Investors", "3": "Vergleich"}
ENTWURF = {"1": ["16", "17", "28"], "2": ["16", "25", "29"], "3": ["16", "20", "28"]}


def schluessel(nr):
    if nr.startswith("A"):
        return (1, int(nr[1:]))
    return (0, int(nr))


def folien(team):
    t = os.path.join(BASIS, f"team-{team}", "entwurf")
    liste = []
    for i, nr in enumerate(ENTWURF[team], 1):
        liste.append((nr, "fertiger Entwurf", os.path.join(t, "png", f"folie-0{i}.png")))
    for p in glob.glob(os.path.join(t, "skizzen", "*.png")):
        m = re.match(r"(?:folie-)?(A?\d+)-(.*)\.png", os.path.basename(p))
        art = "heutige Folie, unverändert" if "unveraendert" in m.group(2) else "Skizze"
        liste.append((m.group(1), art, p))
    liste.sort(key=lambda x: schluessel(x[0]))
    seiten = []
    for nr, art, p in liste:
        name = f"Anhang {nr}" if nr.startswith("A") else f"Folie {nr}"
        seiten.append((f"{name} · {art}", p))
    for p in sorted(glob.glob(os.path.join(t, "broschuere", "*.png")), key=lambda s: int(re.findall(r"\d+", os.path.basename(s))[0])):
        blatt = int(re.findall(r"\d+", os.path.basename(p))[0])
        seiten.append((f"Broschüre Blatt {blatt} · Skizze", p))
    return seiten


def seite(titel, bild, team):
    img = Image.open(bild).convert("RGB")
    breite = 1600
    img = img.resize((breite, round(img.height * breite / img.width)), Image.LANCZOS)
    kopf = 70
    s = Image.new("RGB", (breite, img.height + kopf), "white")
    d = ImageDraw.Draw(s)
    d.rectangle([0, 0, breite, kopf], fill=(38, 50, 56))
    f = ImageFont.truetype(FONT, 30)
    d.text((24, 18), f"Team {team} „{LEIT[team]}“ · {titel}", font=f, fill="white")
    s.paste(img, (0, kopf))
    return s


if __name__ == "__main__":
    ziel = os.path.join(BASIS, "ansicht")
    os.makedirs(ziel, exist_ok=True)
    for team in "123":
        bilder = [seite(t, p, team) for t, p in folien(team)]
        out = os.path.join(ziel, f"Ansicht-Team-{team}-{LEIT[team].replace(' ', '-')}.pdf")
        bilder[0].save(out, save_all=True, append_images=bilder[1:], resolution=150)
        print(out, len(bilder), "Seiten")
