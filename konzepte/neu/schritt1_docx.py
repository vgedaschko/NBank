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
    "Rechenläufe mit je einer geänderten Annahme in Kopien dieser Mappe.",
    "Frei finanziert wird mit 18,36 € Miete gerechnet. Das ist die Miete für eine DSCR von 1,2 in Jahr 1 (Annahme der PGN). "
    "Die Marktmiete von 15,42 € wird auf diesen Folien jeweils mit angegeben.",
]

# Nr, Thema, Aussage, Zahlen [(Text, Zelle)], Darstellung
FOLIEN = [
    ("1", "Investition und Finanzierung",
     "Die Gesamtkosten betragen 3,0 Mio. €, der Eigenkapitaleinsatz in allen Varianten rund 0,6 Mio. €.",
     [("Gesamtkosten 3,0 Mio. €", "D52"),
      ("Eigenkapitaleinsatz rund 0,6 Mio. €", "D56:H56"),
      ("Zuschuss in Gruppe A 1,19 Mio. €", "D53")],
     "Je Variante ein Balken: Eigenkapital, Zuschuss, NBank-Darlehen, Bankdarlehen."),
    ("2", "Kostenbasis",
     "Die Herstellungskosten der PGN liegen 22,7 % unter dem ARGE-Median.",
     [],
     "Heutige Folie 22, unverändert. Sie wird Folie 2, da alle Ergebnisse der Modellrechnung auf diesen Kosten beruhen."),
    ("3", "Liquidität im ersten Jahr",
     "Der Zahlungsüberschuss im ersten Jahr beträgt gefördert 10.812 bis 15.003 €, frei finanziert 26.956 €.",
     [("gefördert 10.812 bis 15.003 €", "D61:F61"),
      ("frei finanziert 26.956 €", "H61"),
      ("Kapitaldienst Gruppe A 34.150 €, frei finanziert 134.779 €", "D60, H60")],
     "Je Variante ein Balken: Mieteinnahmen, aufgeteilt in Bewirtschaftungskosten, Kapitaldienst und Zahlungsüberschuss."),
    ("4", "Kapitaldienstdeckung",
     "Für einen Kapitaldienstdeckungsgrad (DSCR) von 1,2 ist frei finanziert eine Miete von 18,36 € erforderlich, die Marktmiete beträgt 15,42 €.",
     [("erforderliche Miete 18,36 €", "D12"),
      ("Marktmiete 15,42 €", "D13"),
      ("Gruppe C: erforderlich 9,12 €, Höchstmiete 9,00 €", "F22, F19")],
     "Je Variante zwei Balken: erforderliche Miete für DSCR 1,2 und erzielbare Miete (Höchstmiete bzw. Marktmiete). "
     "Dazu: Die DSCR von 1,2 bezieht sich auf das Bankdarlehen frei finanziert. Gefördert besteht kein Bankdarlehen. "
     "Die NBank prüft Eigenmittel und angemessenen Gewinn."),
    ("5", "Liquidität im Zeitverlauf",
     "Der Eigenkapitaleinsatz fließt gefördert nach 22 bis 23 Jahren zurück, frei finanziert nach 13 Jahren.",
     [("gefördert 22 bis 23 Jahre", "D67:F67"),
      ("frei finanziert 13 Jahre", "H67"),
      ("0 Jahre mit Fehlbetrag", "D68:F68, H68")],
     "Kumulierter Zahlungsüberschuss Jahr 1 bis 35 je Variante, Eigenkapitaleinsatz als Bezugslinie."),
    ("6", "Rendite",
     "Die Eigenkapitalrendite beträgt frei finanziert 8,93 %, gefördert 7,05 bis 7,40 %.",
     [("frei finanziert 8,93 %", "H81"),
      ("gefördert 7,05 bis 7,40 %", "D81:F81"),
      ("gefördert ohne Restwert 2,58 bis 2,75 %", "D82:F82")],
     "Je Variante zwei Balken: Eigenkapitalrendite mit und ohne Restwert, Betrachtung über 35 Jahre. "
     "Restwert in allen Varianten auf Basis der Marktmiete."),
    ("7", "Risiken",
     "Bei Herstellungskosten in Höhe des ARGE-Medians entstehen in den Gruppen B und C Jahre mit Fehlbetrag.",
     [("Herstellungskosten 4.631 €/m²: Gruppe B 3, Gruppe C 6 Jahre mit Fehlbetrag", "E68:F68, Lauf kosten_4631"),
      ("ohne Mietanpassung in der Bindung: Eigenkapitalrendite Gruppe A 5,08 % statt 7,05 %",
       "D81, Lauf mietanpassung_gefoerdert_0"),
      ("frei finanziert zur Marktmiete ohne Mietsteigerung: 30 Jahre mit Fehlbetrag", "G68, Lauf mietsteigerung_0")],
     "Tabelle: fünf Rechenläufe mit je einer geänderten Annahme (Herstellungskosten, Mietanpassung, Marktmiete, "
     "Tilgungssatz, Anschlusszins) für alle vier Varianten. Je Feld die Jahre mit Fehlbetrag, Felder mit Fehlbetrag "
     "rot hinterlegt. Die erste Zeile bezieht sich auf Folie 2."),
    ("Fazit", "Abschluss des Vortrags",
     "Mit Programmteil 2.1 ist geförderter Mietwohnungsbau wirtschaftlich darstellbar, sofern die Herstellungskosten "
     "eingehalten werden und die Bewilligung vor Baubeginn vorliegt.",
     [("Keine. Kennzahlen der Modellrechnung gelten nur unter ihren Annahmen.", "")],
     "Vier Felder in der Reihenfolge des Vortrags. Ausgangslage: Herstellungskosten und Zinsen seit 2020 deutlich "
     "gestiegen, Bestand gebundener Wohnungen gesunken. Programmteil 2.1: Zuschuss und zinsfreies Darlehen senken den "
     "Kapitaldienst. Modellrechnung: Mit den Herstellungskosten der PGN trägt sich das Modellhaus in allen drei "
     "Einkommensgruppen. Umsetzung: Verträge und Baubeginn erst nach der Bewilligung."),
]

ANHANG = ("Anhang: Annahmen mit Wert und Herkunft · Jahresrechnung Jahr 1 im Detail · DSCR je Jahr · "
          "Objektrendite mit und ohne Zuschuss · Vermögen und Restschuld Ende Jahr 35, Jahre 36 bis 42 · "
          "Risiken im Einzelnen · Verwendung der Miete (heute Folie 17 und 18).")
HEUTE = ("Heutige Folien: 14 geht in Folie 1 auf, 22 wird Folie 2, 15 und 16 gehen in 3 auf, 19 in 4, 21 in 5, A6 in 6, "
         "20, 23 und A7 in 7 und den Anhang. 24 entfällt, an ihre Stelle tritt das Fazit. "
         "Kapitel 3 umfasst danach 8 statt 12 Folien.")
ENTSCHEIDEN = ("Zu entscheiden: Auf Folie 7 wird frei finanziert mit der Marktmiete von 15,42 € gerechnet. Grund: In den "
               "Rechenläufen ermittelt die Mappe die Miete für DSCR 1,2 jeweils neu (bei 4.631 €/m²: 23,24 €). "
               "Frei finanziert wiese dann in keinem Lauf einen Fehlbetrag aus. Bitte bestätigen.")
BROSCHUERE = "Die Broschüre, Blatt 9 bis 11, wird in Schritt 4 an die freigegebenen Folien angepasst."


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
    for v in VORSPANN:
        absatz(doc, v, pt=8.5, farbe=GRAU, nach=0)
    absatz(doc, "", pt=3, nach=0)

    breiten = [Cm(1.2), Cm(3.3), Cm(7.2), Cm(7.4), Cm(7.8)]
    tab = doc.add_table(rows=1, cols=5)
    tab.style = "Table Grid"
    tab.alignment = WD_TABLE_ALIGNMENT.CENTER
    tab.autofit = False
    tblPr = tab._tbl.tblPr
    lay = OxmlElement("w:tblLayout")
    lay.set(qn("w:type"), "fixed")
    tblPr.append(lay)
    kopf = ["Folie", "Thema", "Aussage (Titel der Folie)", "Zahlen, höchstens drei (Blatt Konzepte)", "Darstellung"]
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
    absatz(doc, ENTSCHEIDEN, fett=True, nach=0)
    doc.save(pfad)


def baue_md(pfad):
    z = [f"# {TITEL}", ""] + VORSPANN + [""]
    z += ["| Folie | Thema | Aussage (Titel der Folie) | Zahlen (Blatt Konzepte) | Darstellung |",
          "|---|---|---|---|---|"]
    for nr, frage, aussage, zahlen, darst in FOLIEN:
        zt = "<br>".join(f"{t} ({c})" if c else t for t, c in zahlen)
        z.append(f"| {nr} | {frage} | **{aussage}** | {zt} | {darst} |")
    z += ["", ANHANG, "", HEUTE, "", BROSCHUERE, "", f"**{ENTSCHEIDEN}**", ""]
    open(pfad, "w").write("\n".join(z))


if __name__ == "__main__":
    baue_docx(os.path.join(HIER, "Schritt-1-Aussagen.docx"))
    baue_md(os.path.join(HIER, "Schritt-1-Aussagen.md"))
    print("ok")
