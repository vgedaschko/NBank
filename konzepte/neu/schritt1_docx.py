"""Schritt 1: Aussagen je Folie für Kapitel 3 und Fazit. Erzeugt Schritt-1-Aussagen.docx und .md."""
import os
from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

HIER = os.path.dirname(os.path.abspath(__file__))
GRAU = RGBColor(0x6B, 0x6B, 0x6B)
ROT = RGBColor(0xC8, 0x10, 0x2E)

TITEL = "Modellrechnung und Fazit: Botschaft je Folie (Schritt 1)"
VORSPANN = [
    ("Zielgruppe: ", "Wohnungsunternehmen, Genossenschaften, Investoren. Erfahrene Immobilienfachleute, keine Förderfachleute. "
     "Sie kennen DSCR und Rendite, nicht Programmteil 2.1. Ihre Frage: Warum gefördert bauen?"),
    ("Was hängen bleiben soll: ", "die vier Punkte des Fazits. Kapitel 3 belegt sie am Modellhaus (Gruppe A). "
     "Frei finanziert dient als Maßstab, mit der Marktmiete von 15,42 €. Die Gruppen A, B und C stehen nebeneinander, "
     "weil sich A und C über die Zeit unterschiedlich entwickeln: A bringt früh Liquidität und Puffer, C mehr über die Laufzeit."),
    ("Umfang: ", "Kapitel 3 mit 7 statt 12 Folien (Trenner und 6). Jede Folie eine Botschaft, die einen Punkt des Fazits trägt."),
]

# Nr, Titel, trägt, Zahlen [(Text, Zelle)], Darstellung
FOLIEN = [
    ("3.1", "14 Wohnungen für 3,0 Mio. €, davon bis zu 2,4 Mio. € Förderung",
     "Grundlage",
     [("heutige Folie 14", "")],
     "Heutige Folie 14, unverändert."),
    ("3.2", "Herstellungskosten der PGN liegen 22,7 % unter dem ARGE-Median",
     "Grundlage, Glaubwürdigkeit",
     [("heutige Folie 22", "")],
     "Heutige Folie 22, unverändert. Rückt vor: Alle Ergebnisse stehen auf diesen Kosten."),
    ("3.3", "Frei finanziert braucht 18,36 € Miete, der Markt zahlt 15,42 €",
     "Fazit 3 und 2",
     [("frei: 18,36 € nötig, 15,42 € Markt, DSCR zur Marktmiete 0,99", "D12, D13, G62"),
      ("A: 5,96 € nötig, 6,80 € Höchstmiete", "D22, D19"),
      ("6,80 € sind 44 % der Marktmiete", "D19 ÷ D13")],
     "Zwei Balkenpaare, A und frei: nötige Miete für DSCR 1,2 neben erzielbarer Miete. A mit Luft nach oben, "
     "frei mit Lücke. Ersetzt die kostendeckende Anfangsmiete (heute 19)."),
    ("3.4", "Kein Jahr mit Fehlbetrag, ab Jahr 10 liegt Gruppe C vor A",
     "Fazit 4 und 1, Wahl der Gruppe",
     [("Jahr 1: A 15.003 €, C 10.812 €", "D61, F61"),
      ("Jahr 10: C 26.890 €, A 25.927 €", "Konzepte Zeitreihe X16, F16"),
      ("Jahr 35: C 84.149 €, A 64.860 €", "D64, F64")],
     "Linien: Zahlungsüberschuss je Jahr, 1 bis 35, A, B und C. Stufen alle drei Jahre aus der Mietanpassung, "
     "Schnittpunkt Jahr 10 markiert. Ein Satz zum Grund: Der Vorteil von A ist der niedrigere Kapitaldienst, er bleibt "
     "gleich. Der Vorteil von C ist die höhere Miete, er wächst mit jeder Mietanpassung. Frei finanziert nicht im "
     "Diagramm: zur Marktmiete nicht finanzierbar (3.3), ab Jahr 31 ohne Kapitaldienst; im Anhang."),
    ("3.5", "Eigenkapitalrendite 7,05 bis 7,40 %, überwiegend aus dem Restwert",
     "Frage nach der Rendite",
     [("mit Restwert: A 7,05 %, C 7,40 %", "D81, F81"),
      ("ohne Restwert: 2,58 bis 2,75 %", "D82:F82"),
      ("frei rechnerisch 8,36 %, bei DSCR 0,99 so nicht finanzierbar", "G81, G62")],
     "Je zwei Balken für A, B, C und frei, mit und ohne Restwert. Frei grau, mit Hinweis auf die DSCR. "
     "Die Rendite entsteht überwiegend aus dem Vermögensaufbau, nicht aus der laufenden Liquidität."),
    ("3.6", "Gruppe A trägt sich bis rund 5.150 € je m², C bis 4.220 €",
     "Fazit 4, Rückbezug auf 3.2",
     [("Herstellungskosten: Modellhaus 3.579 €, Schwelle A 5.150 €, B 4.380 €, C 4.220 €", "Eingaben!F11; heute Folie 23"),
      ("Tilgung: Annahme 2,38 %, Schwelle A 3,65 %, B 3,03 %, C 2,90 %", "Eingaben!F17; heute Folie 20"),
      ("ohne Mietanpassung: A kein Fehlbetrag, Rendite 5,08 %", "D68, D81, Lauf ohne Mietanpassung")],
     "Zwei Skalen mit Annahme und den Schwellen je Gruppe: Herstellungskosten und Tilgungssatz. Der Abstand ist der "
     "Puffer, in A am größten, in C am kleinsten. Fasst heute 20, 23 und 24 zusammen."),
    ("Fazit", "Vier Gründe für geförderten Mietwohnungsbau",
     "Abschluss des Vortrags",
     [("Planbare Mieterträge: Höchstmiete 6,80 € in A, drei Jahre fest. Danach höchstens +6,15 % in drei Jahren.", ""),
      ("Gesicherte Nachfrage: Im Modellhaus liegt die Miete bei 44 % der Marktmiete. Bestand gebundener Wohnungen "
       "seit 2016 um 40,6 % gesunken.", ""),
      ("Neubau, der sonst nicht entsteht: Frei finanziert braucht das Haus 18,36 € Miete, der Markt zahlt 15,42 €.", ""),
      ("Liquidität über 35 Jahre: In A 15.003 € Zahlungsüberschuss in Jahr 1. Kein Jahr mit Fehlbetrag. "
       "Zins 0 % für 35 Jahre.", "")],
     "Vier Felder nebeneinander, je Überschrift und zwei Zeilen. Jede Zahl steht vorher im Vortrag: "
     "+6,15 % auf Folie 10, 40,6 % auf Folie 6, 0 % Zins auf Folie 12, 6,80 €, 44 %, 18,36 € und 15,42 € auf 3.3, "
     "15.003 € und kein Fehlbetrag auf 3.4."),
]

ANHANG = ("Anhang: frei finanziert im Zeitverlauf · DSCR je Jahr (C 3 Jahre unter 1,2) · Annahmen mit Wert und "
          "Herkunft · Jahresrechnung im Detail · Verwendung der Miete (heute 17 und 18) · Objektrendite mit und ohne "
          "Zuschuss · Vermögen Ende Jahr 35 und Zeit danach · Risiken aller Varianten · Tilgungsschwelle (heute A7).")
HEUTE = ("Heutige Folien: 14 und 22 bleiben · 19 geht in 3.3 auf · 15, 16 und 21 in 3.4 · A6 in 3.5 · 20, 23 und 24 in 3.6 · "
         "17, 18 und A7 in den Anhang.")
ENTSCHEIDEN = ""
BROSCHUERE = ("Broschüre in Schritt 4: Blatt 9 Modellhaus, Kosten, Miete · Blatt 10 Liquidität und Rendite · "
              "Blatt 11 Belastbarkeit und Annahmen.")


def zelle_fuellen(cell, teile, groesse=8.5):
    cell.text = ""
    p = cell.paragraphs[0]
    for i, (text, opt) in enumerate(teile):
        if opt.get("neu") and i > 0:
            p = cell.add_paragraph()
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.font.size = Pt(opt.get("pt", groesse))
        r.bold = opt.get("fett", False)
        if opt.get("grau"):
            r.font.color.rgb = GRAU


def schattieren(cell, farbe):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), farbe)
    tcPr.append(shd)


def absatz(doc, text, pt=8.5, fett=False, farbe=None, nach=2):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(nach)
    p.paragraph_format.space_before = Pt(0)
    r = p.add_run(text)
    r.font.size = Pt(pt)
    r.bold = fett
    if farbe:
        r.font.color.rgb = farbe
    return p


def baue_docx(pfad):
    doc = Document()
    st = doc.styles["Normal"]
    st.font.name = "Arial"
    st.element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    st.font.size = Pt(8.5)
    sec = doc.sections[0]
    sec.orientation = WD_ORIENT.LANDSCAPE
    sec.page_width, sec.page_height = Cm(29.7), Cm(21.0)
    for k in ("left_margin", "right_margin"):
        setattr(sec, k, Cm(1.4))
    sec.top_margin, sec.bottom_margin = Cm(0.9), Cm(0.7)

    absatz(doc, TITEL, pt=13, fett=True, nach=2)
    for etikett, text in VORSPANN:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run(etikett); r.bold = True; r.font.size = Pt(9)
        r = p.add_run(text); r.font.size = Pt(9)
    absatz(doc, "", pt=3, nach=0)

    breiten = [Cm(1.1), Cm(6.0), Cm(2.6), Cm(8.8), Cm(8.4)]
    tab = doc.add_table(rows=1, cols=5)
    tab.style = "Table Grid"
    tab.alignment = WD_TABLE_ALIGNMENT.CENTER
    tab.autofit = False
    tblPr = tab._tbl.tblPr
    lay = OxmlElement("w:tblLayout")
    lay.set(qn("w:type"), "fixed")
    tblPr.append(lay)
    kopf = ["Folie", "Titel (Botschaft)", "trägt", "Zahlen (Blatt Konzepte, sonst genannt)", "Darstellung"]
    for i, k in enumerate(kopf):
        c = tab.rows[0].cells[i]
        zelle_fuellen(c, [(k, {"fett": True, "pt": 8.5})])
        schattieren(c, "E6E6E6")
    for nr, aussage, frage, zahlen, darst in FOLIEN:
        row = tab.add_row().cells
        zelle_fuellen(row[0], [(nr, {"fett": True})])
        zelle_fuellen(row[2], [(frage, {"pt": 8})])
        zelle_fuellen(row[1], [(aussage, {"fett": True, "pt": 9})])
        teile = []
        for j, (t, z) in enumerate(zahlen):
            teile.append((t, {"neu": True, "pt": 8}))
            if z:
                teile.append(("  " + z, {"grau": True, "pt": 7}))
        zelle_fuellen(row[3], teile or [("", {})])
        zelle_fuellen(row[4], [(darst, {"pt": 8})])
    grid = tab._tbl.tblGrid
    for i, gc in enumerate(grid.findall(qn("w:gridCol"))):
        gc.set(qn("w:w"), str(int(breiten[i].twips)))
    for row in tab.rows:
        for i, w in enumerate(breiten):
            row.cells[i].width = w

    absatz(doc, "", pt=3, nach=0)
    absatz(doc, ANHANG, nach=1)
    absatz(doc, HEUTE, nach=1)
    absatz(doc, BROSCHUERE, nach=3)
    if ENTSCHEIDEN:
        absatz(doc, ENTSCHEIDEN, fett=True, nach=0)
    doc.save(pfad)


def baue_md(pfad):
    z = [f"# {TITEL}", ""] + [f"**{e}**{t}" for e, t in VORSPANN] + [""]
    z += ["| Folie | Titel (Botschaft) | trägt | Zahlen | Darstellung |",
          "|---|---|---|---|---|"]
    for nr, aussage, frage, zahlen, darst in FOLIEN:
        zt = "<br>".join(f"{t} ({c})" if c else t for t, c in zahlen)
        z.append(f"| {nr} | **{aussage}** | {frage} | {zt} | {darst} |")
    z += ["", ANHANG, "", HEUTE, "", BROSCHUERE, ""] + ([f"**{ENTSCHEIDEN}**", ""] if ENTSCHEIDEN else [])
    open(pfad, "w").write("\n".join(z))


if __name__ == "__main__":
    baue_docx(os.path.join(HIER, "Schritt-1-Aussagen.docx"))
    baue_md(os.path.join(HIER, "Schritt-1-Aussagen.md"))
    print("ok")
