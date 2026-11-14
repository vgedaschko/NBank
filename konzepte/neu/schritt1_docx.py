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

TITEL = "Modellrechnung und Fazit: Aussagen je Folie (Schritt 1)"
VORSPANN = [
    "Stand 14.11.2026. Zahlen aus der Konzepte-Mappe, Blatt Konzepte (Kopie der Rechenmappe v3, Modellhaus). "
    "Läufe aus konzepte/mappe/laeufe.",
    "Frei finanziert rechnet mit 18,36 € Miete. Das ist die Miete für eine DSCR von 1,2 in Jahr 1 (Annahme der PGN). "
    "Die Marktmiete 15,42 € steht auf jeder dieser Folien dabei.",
]

# Nr, Frage, Aussage, Zahlen [(Text, Zelle)], Darstellung
FOLIEN = [
    ("1", "Was setze ich ein?",
     "Ein Haus für 3,0 Mio. €, in jeder Variante rund 0,6 Mio. € Eigenkapital.",
     [("3,0 Mio. € Gesamtkosten", "D52"),
      ("rund 0,6 Mio. € Eigenkapital", "D56:H56"),
      ("Zuschuss bis 1,19 Mio. € in A", "D53")],
     "Ein Balken je Variante: Eigenkapital, Zuschuss, NBank-Darlehen, Bankdarlehen."),
    ("2", "Was kommt herein, was geht hinaus, was bleibt?",
     "Im ersten Jahr bleiben gefördert 10.812 bis 15.003 €, frei finanziert 26.956 €.",
     [("10.812 bis 15.003 € gefördert", "D61:F61"),
      ("26.956 € frei finanziert", "H61"),
      ("Kapitaldienst A 34.150 €, frei 134.779 €", "D60, H60")],
     "Je Variante ein Balken Miete, geteilt in Bewirtschaftung, Kapitaldienst und was bleibt."),
    ("3", "Geht die Bank mit?",
     "Für eine DSCR von 1,2 braucht frei finanziert 18,36 € Miete, der Markt zahlt 15,42 €.",
     [("18,36 € nötige Miete", "D12"),
      ("15,42 € Marktmiete", "D13"),
      ("C braucht 9,12 €, erlaubt sind 9,00 €", "F22, F19")],
     "Je Variante zwei Balken: Miete für DSCR 1,2 und Miete, die man bekommt. Dazu ein Satz: "
     "Die 1,2 gilt für das Bankdarlehen frei finanziert. Gefördert gibt es kein Bankdarlehen, "
     "die NBank prüft Eigenmittel und angemessenen Gewinn."),
    ("4", "Was bleibt mir über die Jahre?",
     "Ihr Eigenkapital ist gefördert nach 22 bis 23 Jahren zurück, frei finanziert nach 13.",
     [("22 bis 23 Jahre gefördert", "D67:F67"),
      ("13 Jahre frei finanziert", "H67"),
      ("kein Jahr mit Fehlbetrag", "D68:F68, H68")],
     "Linien: Zahlungsüberschuss aufsummiert, Jahr 1 bis 35, je Variante. Waagerechte Linie: Eigenkapital."),
    ("5", "Was bringt mein Eigenkapital?",
     "Bei der Eigenkapitalrendite liegt frei finanziert vorn: 8,93 % gegen 7,05 bis 7,40 %.",
     [("8,93 % frei finanziert", "H81"),
      ("7,05 bis 7,40 % gefördert", "D81:F81"),
      ("ohne Restwert gefördert 2,58 bis 2,75 %", "D82:F82")],
     "Je Variante zwei Balken: Eigenkapitalrendite mit und ohne Restwert, 35 Jahre. "
     "Restwert in allen Varianten aus der Marktmiete."),
    ("6", "Was kann schiefgehen?",
     "Baukosten und Mietanpassung bewegen das Ergebnis am stärksten.",
     [("Baukosten 4.631 €/m²: B 3 und C 6 Jahre mit Fehlbetrag", "E68:F68, Lauf kosten_4631"),
      ("ohne Mietanpassung: A 5,08 % statt 7,05 %", "D81, Lauf mietanpassung_gefoerdert_0"),
      ("frei zur Marktmiete, Marktmiete steigt nicht: 30 Jahre mit Fehlbetrag", "G68, Lauf mietsteigerung_0")],
     "Tabelle: fünf Läufe (Baukosten, Mietanpassung, Marktmiete, Tilgungssatz, Anschlusszins) mal vier Varianten. "
     "Je Feld die Jahre mit Fehlbetrag. Felder mit Fehlbetrag rot."),
    ("7", "Lassen sich die Baukosten halten?",
     "Herstellungskosten der PGN liegen 22,7 % unter dem ARGE-Median.",
     [],
     "Heutige Folie 22, unverändert. Steht nach Folie 6 und antwortet auf das Baukostenrisiko."),
    ("Fazit", "Was nehme ich mit?",
     "Gefördert trägt sich das Modellhaus ab dem ersten Jahr und bringt 7,05 bis 7,40 % auf das Eigenkapital.",
     [("0 % Zins bis Jahr 35", "Tabellen!D19"),
      ("kein Jahr mit Fehlbetrag", "D68:F68"),
      ("7,05 bis 7,40 %", "D81:F81")],
     "Vier Felder in der Reihenfolge des Vortrags: Ausgangslage, Programmteil 2.1, Modellrechnung, Umsetzung, "
     "je ein Satz. Darunter eine Zeile: unter welchen Annahmen."),
]

ANHANG = ("Anhang: Annahmen mit Wert und Herkunft · Jahresrechnung Jahr 1 Zeile für Zeile · DSCR je Jahr · "
          "Objektrendite mit und ohne Zuschuss · Vermögen und Restschuld Ende Jahr 35, Jahre 36 bis 42 · "
          "Risiken im Einzelnen · Wohin die Miete fließt (heute Folie 17 und 18).")
HEUTE = ("Heutige Folien: 14 geht in 1 auf · 15 und 16 in 2 · 19 in 3 · 21 in 4 · A6 in 5 · 20, 23 und A7 in 6 "
         "und den Anhang · 22 bleibt · 24 entfällt, dafür das Fazit. Kapitel 3 hat dann 8 statt 12 Folien.")
ENTSCHEIDEN = ("Zu entscheiden: Auf Folie 6 rechnet frei finanziert mit der Marktmiete 15,42 €. Grund: In den Läufen "
               "rechnet die Mappe die Miete für DSCR 1,2 neu (bei 4.631 €/m²: 23,24 €). Frei hätte dann nie einen "
               "Fehlbetrag. Einverstanden?")
BROSCHUERE = "Broschüre Blatt 9 bis 11 folgt in Schritt 4 den freigegebenen Folien."


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
    sec.top_margin, sec.bottom_margin = Cm(1.1), Cm(0.9)

    absatz(doc, TITEL, pt=13, fett=True, nach=2)
    for v in VORSPANN:
        absatz(doc, v, pt=8.5, farbe=GRAU, nach=0)
    absatz(doc, "", pt=3, nach=0)

    breiten = [Cm(1.2), Cm(3.0), Cm(7.0), Cm(8.2), Cm(7.5)]
    tab = doc.add_table(rows=1, cols=5)
    tab.style = "Table Grid"
    tab.alignment = WD_TABLE_ALIGNMENT.CENTER
    tab.autofit = False
    tblPr = tab._tbl.tblPr
    lay = OxmlElement("w:tblLayout")
    lay.set(qn("w:type"), "fixed")
    tblPr.append(lay)
    kopf = ["Folie", "Frage des Investors", "Aussage (Titel der Folie)", "Zahlen, höchstens drei (Blatt Konzepte)", "Darstellung"]
    for i, k in enumerate(kopf):
        c = tab.rows[0].cells[i]
        zelle_fuellen(c, [(k, {"fett": True, "pt": 8.5})])
        schattieren(c, "E6E6E6")
    for nr, frage, aussage, zahlen, darst in FOLIEN:
        row = tab.add_row().cells
        zelle_fuellen(row[0], [(nr, {"fett": True})])
        zelle_fuellen(row[1], [(frage, {})])
        zelle_fuellen(row[2], [(aussage, {"fett": True, "pt": 9})])
        teile = []
        for j, (t, z) in enumerate(zahlen):
            teile.append((t, {"neu": True}))
            teile.append(("  " + z, {"grau": True, "pt": 7.5}))
        zelle_fuellen(row[3], teile or [("", {})])
        zelle_fuellen(row[4], [(darst, {})])
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
    absatz(doc, ENTSCHEIDEN, fett=True, nach=0)
    doc.save(pfad)


def baue_md(pfad):
    z = [f"# {TITEL}", ""] + VORSPANN + [""]
    z += ["| Folie | Frage des Investors | Aussage (Titel der Folie) | Zahlen (Blatt Konzepte) | Darstellung |",
          "|---|---|---|---|---|"]
    for nr, frage, aussage, zahlen, darst in FOLIEN:
        zt = "<br>".join(f"{t} ({c})" for t, c in zahlen)
        z.append(f"| {nr} | {frage} | **{aussage}** | {zt} | {darst} |")
    z += ["", ANHANG, "", HEUTE, "", BROSCHUERE, "", f"**{ENTSCHEIDEN}**", ""]
    open(pfad, "w").write("\n".join(z))


if __name__ == "__main__":
    baue_docx(os.path.join(HIER, "Schritt-1-Aussagen.docx"))
    baue_md(os.path.join(HIER, "Schritt-1-Aussagen.md"))
    print("ok")
