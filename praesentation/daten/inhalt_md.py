#!/usr/bin/env python3
"""Erzeugt INHALT.md aus daten/outline.json (Folienkonzept der Vortragsfassung).

Aufruf im Ordner praesentation:  python daten/inhalt_md.py
"""
import json
from pathlib import Path

ORDNER = Path(__file__).resolve().parent
QUELLE = ORDNER / "outline.json"
ZIEL = ORDNER.parent / "INHALT.md"

FELDER = [
    ("aussage", "Aussage"),
    ("inhalt", "Inhalt (Wortlaut der Folie)"),
    ("darstellung", "Darstellung"),
    ("daten", "Daten"),
    ("herkunft", "Herkunft"),
    ("notizen", "Sprechernotizen"),
    ("quellen", "Quellenzeile der Notizen"),
]


def zelle(text):
    return text.replace("|", "\\|").replace("\n", " ")


def main():
    o = json.loads(QUELLE.read_text(encoding="utf-8"))
    folien = o["folien"]
    haupt = [f for f in folien if not f["nr"].startswith("A")]
    anhang = [f for f in folien if f["nr"].startswith("A")]
    z = []
    z.append("# Folienkonzept: Mietwohnraumförderung Niedersachsen 2026, Vortragsfassung")
    z.append("")
    z.append("Planungsgemeinschaft Nord GmbH · Design „Planwerk“ · 16:9 · Stand der Inhalte 30.09.2026")
    z.append("")
    z.append(
        f"Hauptteil {len(haupt)} Folien, Anhang {len(anhang)} Folien. "
        "Diese Datei wird aus `daten/outline.json` erzeugt (`python daten/inhalt_md.py`); "
        "Änderungen gehören in die JSON-Datei."
    )
    z.append("")
    z.append("## Leitgedanke")
    z.append("")
    z.append(o["leitgedanke"])
    z.append("")
    z.append("## Begründung")
    z.append("")
    z.append(o["begruendung"])
    z.append("")
    z.append("## Folienübersicht")
    z.append("")
    z.append("| Nr. | ID | Abschnitt | Layout | Titel | Baugruppe |")
    z.append("|---|---|---|---|---|---|")
    for f in folien:
        z.append(
            f"| {f['nr']} | `{f['id']}` | {f['abschnitt']} | `{f['layout']}` | "
            f"{zelle(f['titel'])} | {f['baugruppe']} |"
        )
    z.append("")
    z.append("## Folien im Einzelnen")
    for f in folien:
        z.append("")
        z.append(f"### {f['nr']} · {f['titel']}")
        z.append("")
        z.append(
            f"ID `{f['id']}` · Abschnitt {f['abschnitt']} · Layout `{f['layout']}` · "
            f"Baugruppe {f['baugruppe']}"
        )
        for schluessel, name in FELDER:
            z.append("")
            if schluessel == "notizen":
                z.append(f"**{name}**")
                z.append("")
                for zeile in f[schluessel].split("\n"):
                    zeile = zeile.strip()
                    if zeile:
                        z.append("- " + zeile.lstrip("– ").strip())
            else:
                z.append(f"**{name}:** {f[schluessel]}")
    z.append("")
    z.append("## Baugruppen")
    z.append("")
    nr = {f["id"]: f["nr"] for f in folien}
    for g in o["baugruppen"]:
        liste = ", ".join(f"{nr[i]} `{i}`" for i in g["folien"])
        z.append(f"- **{g['name']}** ({len(g['folien'])} Folien): {liste}")
        if g.get("hinweis"):
            z.append(f"  {g['hinweis']}")
    for titel, schluessel in [
        ("Entscheidungen", "entscheidungen"),
        ("Offene Fragen an PGN", "offene_fragen"),
        ("Ungeprüfte Angaben (aus der Altfassung übernommen, nicht nachgeprüft)", "ungepruefte_angaben"),
    ]:
        z.append("")
        z.append(f"## {titel}")
        z.append("")
        for i, punkt in enumerate(o[schluessel], 1):
            z.append(f"{i}. {punkt}")
    z.append("")
    ZIEL.write_text("\n".join(z), encoding="utf-8")
    print(f"{ZIEL} geschrieben: {len(folien)} Folien, {len(z)} Zeilen")


if __name__ == "__main__":
    main()
