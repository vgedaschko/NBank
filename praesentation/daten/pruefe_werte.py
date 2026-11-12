#!/usr/bin/env python3
"""Abgleich von werte.json mit der Broschüre, der Altfassung und einer Handrechnung.

1. Broschüre S. 10–12: jede dort gezeigte Zahl der Modellrechnung gegen den Wert
   der Mappe, gerundet auf die gezeigte Stelle (Läufe „modellhaus“,
   „modellhaus_kosten_4631“ und „modellhaus_kosten_5460“). Die Broschüre wird aus
   content/pages/*.json gelesen. Das Modellhaus ist seit 11.11.2026 Projekt 2 der
   Mappe (PGN-Projekt in Neu Wulmstorf, Grundstück im Bestand und nicht angesetzt).
2. Altfassung der Präsentation (Folien 11, 13, 14, 17) gegen den Lauf „projekt2“
   (dasselbe Projekt mit Tilgung 2,5 % wie in der Altfassung).
   Abweichungen hier sind Hinweise, kein Fehler: Es gilt die Mappe.
3. Handrechnung: Die Kernwerte jedes Laufs werden aus den Eingaben und den
   Festwerten der Richtlinie neu gerechnet, ohne die Formeln der Mappe.
4. Sperrliste: Renditen, Restwert und Marktmiete stehen nur im Lauf der
   benannten Ausnahme (meta.ausnahmen), jeder dieser Werte liegt in einer dort
   genannten Zelle, und kein anderer Lauf führt einen solchen Wert.

Aufruf (im Ordner praesentation):
    python daten/pruefe_werte.py [--bericht DATEI.md]

Rückgabewert 0, wenn 1, 3 und 4 ohne Abweichung sind.
"""

import argparse
import json
import re
import sys
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

HIER = Path(__file__).resolve().parent
WERTE = HIER / "werte.json"
BROSCHUERE = HIER.parent.parent / "broschuere" / "content" / "pages"
GRUPPEN = ("A", "B", "C")


# ---------------------------------------------------------------- Formate

def D(x):
    return x if isinstance(x, Decimal) else Decimal(str(x))


def de(x, stellen=0):
    """Deutsche Zahl, kaufmännisch gerundet, Minuszeichen U+2212."""
    q = D(x).quantize(Decimal(1).scaleb(-stellen), rounding=ROUND_HALF_UP)
    s = f"{abs(q):,.{stellen}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return ("−" if q < 0 else "") + s


def mio(x, stellen=1):
    return de(D(x) / 1000000, stellen)


def pct(x, stellen=0):
    return de(D(x) * 100, stellen)


def zahl(x, stellen=0):
    return float(D(x).quantize(Decimal(1).scaleb(-stellen), rounding=ROUND_HALF_UP))


def zeige(x):
    """Anzeige im Bericht: Zahlen deutsch, Listen mit Strich getrennt."""
    if isinstance(x, bool):
        return "ja" if x else "nein"
    if isinstance(x, (int, float)):
        d = D(x).normalize()
        return de(d, max(0, -d.as_tuple().exponent))
    if isinstance(x, (list, tuple)):
        return " | ".join(zeige(v) for v in x)
    return str(x)


# ---------------------------------------------------------------- Daten

class Werte:
    def __init__(self, daten):
        self.daten = daten

    def lauf(self, name):
        werte = self.daten["laeufe"][name]["werte"]
        return lambda schluessel: werte[schluessel]["wert"]

    def zelle(self, lauf, schluessel):
        w = self.daten["laeufe"][lauf]["werte"][schluessel]
        return f"{w['blatt']}!{w['zelle']}"

    def schluessel(self, lauf, zelle):
        """Schlüssel zu einer Zelle („Übersicht!D9“) im Lauf, sonst None."""
        for k, w in self.daten["laeufe"][lauf]["werte"].items():
            if f"{w['blatt']}!{w['zelle']}" == zelle:
                return k
        return None


class Bericht:
    def __init__(self):
        self.zeilen = []  # (teil, stelle, gezeigt, mappe, quelle, status)

    def gleich(self, teil, stelle, gezeigt, mappe, quelle):
        ok = gezeigt == mappe
        self.zeilen.append((teil, stelle, zeige(gezeigt), zeige(mappe), quelle, "gleich" if ok else "ABWEICHUNG"))

    def enthaelt(self, teil, stelle, text, mappe, quelle):
        ok = mappe in text
        self.zeilen.append((teil, stelle, mappe if ok else "fehlt im Text", mappe, quelle, "gleich" if ok else "ABWEICHUNG"))

    def anzahl(self, teil=None):
        z = [x for x in self.zeilen if teil is None or x[0] == teil]
        return len(z), sum(1 for x in z if x[5] != "gleich")


def seite(nr):
    (pfad,) = sorted(BROSCHUERE.glob(f"{nr:02d}-*.json"))
    return json.loads(pfad.read_text(encoding="utf-8"))


def stufe_genannt(text, stufe, nur_stufe=False):
    """Der Text nennt die Mietenstufe der Mappe („Mietenstufe VI“) oder, wo eine Regel für die ganze Klasse gilt, deren Klasse
    („Mietenstufe IV–VII“: Höchstmiete und Bemessungsgrenze). nur_stufe: Nur die Stufe selbst zählt (Standort des Modellhauses)."""
    stufen = ("I", "II", "III", "IV", "V", "VI", "VII")
    if stufe not in stufen:
        return False
    if re.search(rf"Mietenstufe {stufe}(?![IV–])", text):
        return True
    klasse = "I–III" if stufen.index(stufe) < 3 else "IV–VII"
    return not nur_stufe and f"Mietenstufe {klasse}" in text


def block(s, typ, **merkmale):
    treffer = [b for b in s["blocks"] if b["type"] == typ and all(b.get(k) == v for k, v in merkmale.items())]
    if len(treffer) != 1:
        sys.exit(f"Broschüre S. {s['no']}: Block {typ} {merkmale} nicht eindeutig ({len(treffer)}).")
    return treffer[0]


# ---------------------------------------------------------------- 1 Broschüre

def abgleich_broschuere(w, b):
    m = w.lauf("modellhaus")
    q = lambda k: "modellhaus: " + k

    # ---- Seite 10
    T = "Broschüre S. 10"
    s = seite(10)
    wfl, we, hk = m("eingabe.wohnflaeche"), m("eingabe.wohnungen"), m("eingabe.herstellungskosten_qm")
    # Seit 12.11.2026 steht die Überschrift der Seite in zwei Feldern: Wohnungen und Gesamtkosten als zweite Stimme (headline_light), darunter die Förderung
    kopf = " ".join(t for t in (s.get("headline_light"), s["headline"]) if t)
    b.enthaelt(T, "Überschrift: Wohnungen", kopf, f"{de(we)} Wohnungen", q("eingabe.wohnungen"))
    b.enthaelt(T, "Überschrift: Gesamtkosten", kopf, f"{mio(m('fin.gesamtkosten.A'))} Mio. €", q("fin.gesamtkosten.A"))
    b.enthaelt(T, "Überschrift: Förderung", s["headline"], f"bis zu {mio(m('fin.foerderung.A'))} Mio. € Förderung", q("fin.foerderung.A"))
    b.enthaelt(T, "Vorspann: Wohnungen", s["lead"], f"{de(we)} Neubauwohnungen", q("eingabe.wohnungen"))
    b.enthaelt(T, "Vorspann: Wohnfläche", s["lead"], f"zusammen {de(wfl)} m² Wohnfläche", q("eingabe.wohnflaeche"))
    # Bis 11.11.2026 nannte der Vorspann den Wohnungsmix (Summe Wohnungen und m²); das neue Modellhaus nennt die mittlere Wohnungsgröße
    b.enthaelt(T, "Vorspann: Wohnfläche je Wohnung im Schnitt", s["lead"], f"im Schnitt {de(D(wfl) / D(we))} m²", q("eingabe.wohnflaeche ÷ eingabe.wohnungen"))
    b.enthaelt(T, "Vorspann: Herstellungskosten je m²", s["lead"], f"Herstellungskosten {de(hk)} € je m²", q("eingabe.herstellungskosten_qm"))
    b.enthaelt(T, "Vorspann: Bemessungsgrenze", s["lead"], f"Bemessungsgrenze von {de(m('fin.bemessungsgrenze_qm'))} €", q("fin.bemessungsgrenze_qm"))
    b.enthaelt(T, "Vorspann: Abstand zur Bemessungsgrenze", s["lead"], f"{de(m('fin.bemessungsgrenze_qm') - hk)} € unter", q("fin.bemessungsgrenze_qm − eingabe.herstellungskosten_qm"))
    # Grundstück: Ist es nicht angesetzt (Eingabe 2.3 = 0), sagt der Vorspann das mit diesen Worten; sonst nennt er den Betrag
    grundstueck = "Grundstück im Bestand, nicht angesetzt" if m("fin.grundstueck") == 0 and m("eingabe.grundstueck") == 0 else f"Grundstück {de(m('fin.grundstueck'))} €"
    b.enthaelt(T, "Vorspann: Grundstück", s["lead"], grundstueck, q("eingabe.grundstueck, fin.grundstueck"))
    b.gleich(T, "Vorspann: nennt die Mietenstufe der Mappe", stufe_genannt(s["lead"], m("eingabe.mietenstufe"), nur_stufe=True), True, q("eingabe.mietenstufe"))

    haus = block(s, "chart", chart="stacked-bar")["data"]
    b.gleich(T, "Haus-Diagramm: Gesamtkosten", haus["total"]["display"], mio(m("fin.gesamtkosten.A")), q("fin.gesamtkosten.A"))
    seg = {x["name"]: x for x in haus["segments"]}
    b.gleich(T, "Haus-Diagramm: Darlehen", seg["Darlehen"]["display"], mio(m("fin.darlehen_nbank.A")), q("fin.darlehen_nbank.A"))
    b.gleich(T, "Haus-Diagramm: Darlehen, Anteil", seg["Darlehen"]["share"], f"{pct(m('fin.darlehensquote.A'))} %", q("fin.darlehensquote.A"))
    b.gleich(T, "Haus-Diagramm: Zuschuss", seg["Zuschuss"]["display"], mio(m("fin.zuschuss.A")), q("fin.zuschuss.A"))
    b.gleich(T, "Haus-Diagramm: Zuschuss, Anteil", seg["Zuschuss"]["share"], f"{pct(m('fin.zuschussquote.A'))} %", q("fin.zuschussquote.A"))
    b.gleich(T, "Haus-Diagramm: Eigenmittel", seg["Eigenmittel"]["display"], mio(m("fin.eigenmittel.A")), q("fin.eigenmittel.A"))
    b.gleich(T, "Haus-Diagramm: Eigenmittel, Anteil", seg["Eigenmittel"]["share"], f"mind. {pct(m('fin.eigenmittelquote.A'))} %", q("fin.eigenmittelquote.A"))
    b.gleich(T, "Haus-Diagramm: Förderung", haus["bracket"]["display"], mio(m("fin.foerderung.A")), q("fin.foerderung.A"))
    b.gleich(T, "Haus-Diagramm: Förderung, Anteil", haus["bracket"]["share"], f"{pct(m('fin.foerderquote.A'))} %", q("fin.foerderquote.A"))

    r = block(s, "table")["rows"]
    b.enthaelt(T, "Rechenweg 1: Ansatz", r[0][1], f"{de(wfl)} m² × {de(hk)} €", q("eingabe.wohnflaeche, eingabe.herstellungskosten_qm"))
    b.gleich(T, "Rechenweg 1: Herstellungskosten", r[0][2], de(m("fin.herstellungskosten")), q("fin.herstellungskosten"))
    b.gleich(T, "Rechenweg 2: Grundstück", r[1][2], de(m("fin.grundstueck")), q("fin.grundstueck"))
    b.gleich(T, "Rechenweg 3: zuwendungsfähige Kosten", r[2][2], de(m("fin.zuwendungsfaehige_kosten.A")), q("fin.zuwendungsfaehige_kosten.A"))
    b.gleich(T, "Rechenweg 4: Eigenmittel", r[3][2], de(m("fin.eigenmittel.A")), q("fin.eigenmittel.A"))
    b.enthaelt(T, "Rechenweg 4: Eigenmittel, Anteil", r[3][1], f"mindestens {pct(m('fin.eigenmittelquote.A'))} %", q("fin.eigenmittelquote.A"))

    kz = block(s, "key_figures")["items"]
    b.gleich(T, "Kennzahl: Zuschuss je Wohnung", kz[0]["value"], de(m("fin.zuschuss_je_wohnung.A")), q("fin.zuschuss_je_wohnung.A"))
    b.gleich(T, "Kennzahl: Eigenmittel je Wohnung", kz[1]["value"], de(m("fin.eigenmittel_je_wohnung.A")), q("fin.eigenmittel_je_wohnung.A"))
    b.enthaelt(T, "Kennzahl: Gesamtkosten je Wohnung", kz[1]["note"], f"{pct(m('fin.eigenmittelquote.A'))} % von {de(m('fin.gesamtkosten.A') / we)} € Gesamtkosten", q("fin.gesamtkosten.A ÷ eingabe.wohnungen"))

    # Sensitivität: drei Spalten (Modellhaus, ARGE-Median, Ausgangswert der Bemessungsgrenze). Die Tabelle des Hefts steht in „columns“ und
    # „rows“; jede Zeile nennt ihre Zelle der Übersicht. Die Schlüssel „steps“ und „result“ beschreiben die Spalte an der Bemessungsgrenze.
    T = "Broschüre S. 10, Sensitivität"
    wf = block(s, "chart", chart="waterfall")
    laeufe = ("modellhaus", "modellhaus_kosten_4631", "modellhaus_kosten_5460")
    spalten = wf["data"].get("columns", [])
    b.gleich(T, "Spalten: Herstellungskosten je m² der drei Läufe", [x.get("kosten_je_m2") for x in spalten],
             [w.lauf(l)("eingabe.herstellungskosten_qm") for l in laeufe], "eingabe.herstellungskosten_qm je Lauf")
    b.gleich(T, "Spalten: Beschriftung", [x.get("display") for x in spalten], [f"{de(w.lauf(l)('eingabe.herstellungskosten_qm'))} €" for l in laeufe], "eingabe.herstellungskosten_qm je Lauf")
    b.gleich(T, "Spalte 3 ist der Ausgangswert der Bemessungsgrenze", w.lauf(laeufe[2])("eingabe.herstellungskosten_qm"), m("fin.bemessungsgrenze_qm"), q("fin.bemessungsgrenze_qm"))
    zeilen_s = wf["data"].get("rows", [])
    b.gleich(T, "Tabelle: Zeilen vorhanden", len(zeilen_s) > 0, True, "Broschüre: data.rows")
    for z in zeilen_s:
        schl = w.schluessel("modellhaus", z.get("zelle", ""))
        if not schl:
            b.zeilen.append((T, f"Zeile „{z.get('label')}“: Zelle {z.get('zelle')!r}", "nicht in werte.json", "Zelle der Übersicht", "Lauf modellhaus", "ABWEICHUNG"))
            continue
        ist = [w.lauf(l)(schl) for l in laeufe]
        stellen = max((len(str(v).split(".")[1]) if isinstance(v, float) and "." in str(v) else 0) for v in z["values"])
        b.gleich(T, f"Zeile „{z.get('label')}“: Werte", [float(v) for v in z["values"]], [zahl(v, stellen) for v in ist], f"{schl} je Lauf")
        b.gleich(T, f"Zeile „{z.get('label')}“: Beschriftung", z["display"], [de(v) for v in ist], f"{schl} je Lauf")
    for l in laeufe[1:]:
        b.gleich(T, f"{l}: nichts über der Bemessungsgrenze, kein Bankdarlehen, Förderquote wie im Modellhaus",
                 (w.lauf(l)("fin.ueber_bemessungsgrenze.A"), w.lauf(l)("fin.bankdarlehen.A"), w.lauf(l)("fin.foerderquote.A")), (0, 0, m("fin.foerderquote.A")), f"{l}: fin.*")
    k = w.lauf("modellhaus_kosten_5460")
    q5 = lambda x: "modellhaus_kosten_5460: " + x
    st = wf["data"]["steps"]
    b.enthaelt(T, "Titel: Sensitivität der Herstellungskosten je m²", wf["title"], "Herstellungskosten je m²", q5("eingabe.herstellungskosten_qm"))
    b.gleich(T, "Gesamtkosten", st[0]["display"], mio(k("fin.gesamtkosten.A"), 2), q5("fin.gesamtkosten.A"))
    b.gleich(T, "zuwendungsfähig", st[0]["segments"][0]["display"], mio(k("fin.zuwendungsfaehige_kosten.A"), 2), q5("fin.zuwendungsfaehige_kosten.A"))
    b.gleich(T, "über der Grenze", st[0]["segments"][1]["display"], mio(k("fin.ueber_bemessungsgrenze.A"), 2), q5("fin.ueber_bemessungsgrenze.A"))
    b.gleich(T, "Förderung", st[1]["display"], mio(k("fin.foerderung.A"), 2), q5("fin.foerderung.A"))
    b.enthaelt(T, "Förderung: Ansatz", st[1]["label"], f"80 % von {mio(k('fin.zuwendungsfaehige_kosten.A'), 2)}", q5("fin.zuwendungsfaehige_kosten.A"))
    b.gleich(T, "Mindest-Eigenmittel + Restfinanzierung", st[2]["display"],
             f"{mio(k('fin.eigenmittel.A'), 2)} + {mio(k('fin.bankdarlehen.A'), 2)}", q5("fin.eigenmittel.A, fin.bankdarlehen.A"))
    b.gleich(T, "Förderquote auf die Gesamtkosten", wf["data"]["result"]["display"], f"bis zu {pct(k('fin.foerderquote.A'), 1)} %", q5("fin.foerderquote.A"))
    for g in ("B", "C"):
        b.gleich(T, f"Gruppe {g}: gleiche Förderung und Eigenmittel wie A",
                 (k(f"fin.foerderung.{g}"), k(f"fin.eigenmittel.{g}"), k(f"fin.bankdarlehen.{g}")),
                 (k("fin.foerderung.A"), k("fin.eigenmittel.A"), k("fin.bankdarlehen.A")), q5(f"fin.*.{g}"))

    # ---- Seite 11
    T = "Broschüre S. 11"
    s = seite(11)
    b.enthaelt(T, "Vorspann: Förderquote", s["lead"], f"{pct(m('fin.foerderquote.A'))} % Förderung", q("fin.foerderquote.A"))
    ch = block(s, "chart")
    b.enthaelt(T, "Diagramm: Gesamtkosten", ch["subtitle"], f"Gesamtkosten je {mio(m('fin.gesamtkosten.A'))} Mio. €", q("fin.gesamtkosten.A"))
    reihen = {x["name"]: x for x in ch["data"]["series"]}
    for name, schl in (("Darlehen", "fin.darlehen_nbank"), ("Zuschuss", "fin.zuschuss"), ("Eigenmittel, mind.", "fin.eigenmittel")):
        for i, g in enumerate(GRUPPEN):
            b.gleich(T, f"Diagramm: {name} {g}", reihen[name]["labels"][i], mio(m(f"{schl}.{g}")), q(f"{schl}.{g}"))
            b.gleich(T, f"Diagramm: {name} {g}, Zahlenwert", reihen[name]["values"][i], zahl(D(m(f"{schl}.{g}")) / 1000000, 1), q(f"{schl}.{g}"))
    for i, g in enumerate(GRUPPEN):
        b.gleich(T, f"Diagramm: Förderung {g}", ch["data"]["totals"]["labels"][i], mio(m(f"fin.foerderung.{g}")), q(f"fin.foerderung.{g}"))

    t = block(s, "table", caption="Jahresrechnung Jahr 1, in € p. a.")
    r = t["rows"]
    zeilen = [
        ("Zeile 1 Sollmiete", "jr1.sollmiete"), ("Mietausfall/Leerstand", "jr1.mietausfall"),
        ("Zeile 2 Objektverwaltung", "jr1.objektverwaltung"), ("Zeile 3 Instandhaltung", "jr1.instandhaltung"),
        ("Zeile 4 Überschuss vor Kapitaldienst", "jr1.ueberschuss_vor_kapitaldienst"),
        ("Zeile 5 Verwaltungskostenbeitrag", "jr1.verwaltungskostenbeitrag"), ("Zeile 6 Zins NBank", "jr1.zins_nbank"),
        ("Zeile 7 Tilgung", "jr1.tilgung_nbank"), ("Zeile 8 Zahlungsüberschuss", "jr1.zahlungsueberschuss"),
    ]
    for i, (name, schl) in enumerate(zeilen):
        for j, g in enumerate(GRUPPEN):
            b.gleich(T, f"Jahresrechnung {name}, {g}", r[i][2 + j], de(m(f"{schl}.{g}")), q(f"{schl}.{g}"))
    for j, g in enumerate(GRUPPEN):
        b.gleich(T, f"Einmalig: Bearbeitungsentgelte, {g}", t["aside_row"][2 + j], de(m(f"jr1.bearbeitungsentgelte.{g}")), q(f"jr1.bearbeitungsentgelte.{g}"))
    mieten = " | ".join(de(m(f"fin.miete_jahr1.{g}"), 2) for g in GRUPPEN)
    darl = " | ".join(mio(m(f"fin.darlehen_nbank.{g}")) for g in GRUPPEN)
    b.enthaelt(T, "Zeile 1: Ansatz Höchstmieten", r[0][1], f"{de(wfl)} m² × {mieten} € × 12", q("fin.miete_jahr1.A/B/C"))
    b.gleich(T, "Zeile 1: Mietenstufe der Mappe oder ihre Klasse (I–III, IV–VII)", stufe_genannt(r[0][1], m("eingabe.mietenstufe")), True, q("eingabe.mietenstufe"))
    b.enthaelt(T, "Unterzeile: Satz Mietausfall", r[1][1], f"{pct(m('jr1.satz.mietausfall'))} % der Sollmiete", q("jr1.satz.mietausfall"))
    b.enthaelt(T, "Zeile 2: Satz Objektverwaltung", r[2][1], f"{de(m('jr1.satz.objektverwaltung'))} € je Wohnung", q("jr1.satz.objektverwaltung"))
    b.enthaelt(T, "Zeile 3: Satz Instandhaltung", r[3][1], f"{de(m('jr1.satz.instandhaltung'), 2)} € je m²", q("jr1.satz.instandhaltung"))
    b.enthaelt(T, "Zeile 5: Satz Verwaltungskostenbeitrag", r[5][1], f"{pct(m('jr1.satz.verwaltungskostenbeitrag'), 1)} % des Restkapitals", q("jr1.satz.verwaltungskostenbeitrag"))
    b.enthaelt(T, "Zeile 6: Zins und zinsfreie Jahre", r[6][1], f"{pct(m('jr1.satz.zins_nbank'))} % bis Ende Jahr {m('tab.zinsfreie_jahre')}", q("jr1.satz.zins_nbank, tab.zinsfreie_jahre"))
    b.enthaelt(T, "Zeile 7: Tilgungssatz und Darlehen", r[7][1], f"Tilgung {pct(m('jr1.satz.tilgung_nbank'), 2)} % p. a. (Annahme: {m('tab.laufzeit_hoechstens')} Jahre) auf {darl} Mio. € Darlehen", q("jr1.satz.tilgung_nbank, fin.darlehen_nbank.A/B/C"))
    b.enthaelt(T, "Einmalig: Sätze der Entgelte", t["aside_row"][1],
               f"{pct(m('tab.bearbeitungsentgelt_darlehen'))} % des Darlehens + {pct(m('tab.bearbeitungsentgelt_zuschuss'), 2)} % des Zuschusses",
               q("tab.bearbeitungsentgelt_darlehen, tab.bearbeitungsentgelt_zuschuss"))

    r = block(s, "table", caption="Zum Vergleich: frei finanziert")["rows"]
    b.gleich(T, "Vergleich frei: Zuschuss A", r[0][1], f"{mio(m('fin.zuschuss.A'))} Mio. €", q("fin.zuschuss.A"))
    b.gleich(T, "Vergleich frei: Darlehen A", r[1][1], f"{mio(m('fin.darlehen_nbank.A'))} Mio. €", q("fin.darlehen_nbank.A"))
    b.gleich(T, "Vergleich frei: Bankdarlehen frei", r[1][2], f"{mio(m('fin.bankdarlehen.Frei'))} Mio. €", q("fin.bankdarlehen.Frei"))
    b.gleich(T, "Vergleich frei: Kapitaldienst A", r[2][1], f"{de(m('dscr.kapitaldienst_jahr1.A'))} €", q("dscr.kapitaldienst_jahr1.A"))
    b.gleich(T, "Vergleich frei: Kapitaldienst frei", r[2][2], f"{de(m('dscr.kapitaldienst_jahr1.Frei'))} €", q("dscr.kapitaldienst_jahr1.Frei"))
    b.gleich(T, "Vergleich frei: nötige Miete A", r[3][1], f"{de(m('dscr.noetige_miete.A'), 2)} €", q("dscr.noetige_miete.A"))
    b.gleich(T, "Vergleich frei: nötige Miete frei", r[3][2], f"{de(m('dscr.noetige_miete.Frei'), 2)} €", q("dscr.noetige_miete.Frei"))
    b.gleich(T, "Vergleich frei: DSCR-Ziel der nötigen Miete", m("dscr.ziel"), 1, q("dscr.ziel"))
    an = block(s, "text", heading="Annahmen")["body"]
    b.enthaelt(T, "Annahmen: Eigenmittel frei", an, f"Eigenmittel {mio(m('fin.eigenmittel.Frei'))} Mio. €", q("fin.eigenmittel.Frei"))
    b.enthaelt(T, "Annahmen: Bankdarlehen und Zins", an, f"Bankdarlehen {mio(m('fin.bankdarlehen.Frei'))} Mio. € zu {pct(m('eingabe.zins_bank'), 2)} % Zins", q("fin.bankdarlehen.Frei, eingabe.zins_bank"))
    b.enthaelt(T, "Annahmen: Laufzeit", an, f"Annuität über {m('eingabe.laufzeit_bank')} Jahre", q("eingabe.laufzeit_bank"))

    # ---- Seite 12
    T = "Broschüre S. 12"
    s = seite(12)
    b.enthaelt(T, "Vorspann: Verwaltungskostenbeitrag", s["lead"], f"{pct(m('tab.verwaltungskostenbeitrag'), 1)} % Verwaltungskostenbeitrag", q("tab.verwaltungskostenbeitrag"))
    b.enthaelt(T, "Vorspann: zinsfreie Jahre", s["lead"], f"bis Ende Jahr {m('tab.zinsfreie_jahre')} zinsfrei", q("tab.zinsfreie_jahre"))
    ch = block(s, "chart")
    d = ch["data"]
    schwelle = {"B": m("tilg.schwelle.B_gegen_A"), "C": m("tilg.schwelle.C_gegen_A")}
    for x in d["series"]:
        g = x["name"]
        b.gleich(T, f"Diagramm {g}: Mehrüberschuss vor Tilgung", x["before_repayment"], zahl(m(f"tilg.mehrueberschuss_vor_tilgung.{g}")), q(f"tilg.mehrueberschuss_vor_tilgung.{g}"))
        b.gleich(T, f"Diagramm {g}: Mehrschuld", x["extra_debt"], m(f"tilg.mehrschuld.{g}"), q(f"tilg.mehrschuld.{g}"))
        b.gleich(T, f"Diagramm {g}: je Prozentpunkt Tilgung", x["per_percentage_point"], -zahl(D(m(f"tilg.mehrschuld.{g}")) / 100), q(f"1 % × tilg.mehrschuld.{g}"))
        b.gleich(T, f"Diagramm {g}: Tilgungsschwelle", x["threshold"], zahl(D(schwelle[g]) * 100, 2), q(f"tilg.schwelle.{g}_gegen_A"))
        b.gleich(T, f"Diagramm {g}: Mehrüberschuss beim Satz der S. 11", x["at_s11"], zahl(m(f"tilg.mehrueberschuss_bei_tilgung.{g}")), q(f"tilg.mehrueberschuss_bei_tilgung.{g}"))
        b.gleich(T, f"Diagramm {g}: Beschriftung vor Tilgung", x["labels"][0], de(m(f"tilg.mehrueberschuss_vor_tilgung.{g}")), q(f"tilg.mehrueberschuss_vor_tilgung.{g}"))
        b.gleich(T, f"Diagramm {g}: Beschriftung Schwelle", x["labels"][1], f"{g}: {pct(schwelle[g], 2)} %", q(f"tilg.schwelle.{g}_gegen_A"))
    # Der Satz der Jahresrechnung (1/42 = 2,38 %) liegt im Bereich der Achse; ihr Ende ist der Rasterpunkt 2,5 % der Mappe
    b.gleich(T, "Diagramm: Achsenende ist ein Rasterpunkt der Mappe und nicht kleiner als der Satz der Jahresrechnung",
             [d["x"]["to"] / 100 in [round(float(x), 6) for x in m("tilg.raster.satz")], d["x"]["to"] / 100 >= float(m("eingabe.tilgung_nbank"))], [True, True], q("tilg.raster.satz, eingabe.tilgung_nbank"))
    b.gleich(T, "Maßkette: Teilung", d["dimension_chain"][0]["to"], zahl(D(schwelle["C"]) * 100, 2), q("tilg.schwelle.C_gegen_A"))
    vB, vC = m("tilg.mehrueberschuss_vor_tilgung.B"), m("tilg.mehrueberschuss_vor_tilgung.C")
    sB, sC = m("tilg.mehrschuld.B"), m("tilg.mehrschuld.C")
    b.enthaelt(T, "Kontrolle C gegen B: Ansatz", d["check"], f"({de(vC)} − {de(vB)}) ÷ ({de(sC)} − {de(sB)})", q("tilg.mehrueberschuss_vor_tilgung, tilg.mehrschuld"))
    b.enthaelt(T, "Kontrolle C gegen B: Schwelle", d["check"], f"= {pct(m('tilg.schwelle.C_gegen_B'), 2)} %", q("tilg.schwelle.C_gegen_B"))
    b.enthaelt(T, "Geometrie: ungerundete Werte", d["geometry"], f"B {de(vB, 1)} €, C {de(vC, 1)} €", q("tilg.mehrueberschuss_vor_tilgung.B/C"))
    b.enthaelt(T, "Geometrie: Nulldurchgänge", d["geometry"], f"B {pct(schwelle['B'], 4)} %, C {pct(schwelle['C'], 4)} %", q("tilg.schwelle.B_gegen_A, tilg.schwelle.C_gegen_A"))
    # Die Schwelle C nennt seit 12.11.2026 die Überschrift der Seite; der gleichlautende Satz der Notiz ist dort gestrichen
    b.enthaelt(T, "Überschrift: Schwelle C", s["headline"], f"Über {pct(schwelle['C'], 2)} % Tilgung", q("tilg.schwelle.C_gegen_A"))
    b.enthaelt(T, "Notiz: Schwelle B", ch["note"], f"Unter {pct(schwelle['B'], 2)} % liegt C vor B, darüber A", q("tilg.schwelle.B_gegen_A"))
    b.enthaelt(T, "Notiz: je Prozentpunkt", ch["note"], f"von B um {de(D(sB) / 100)} €, von C um {de(D(sC) / 100)} €", q("1 % × tilg.mehrschuld.B/C"))
    raster = dict(zip(m("tilg.raster.satz")[:7], m("tilg.raster.bester")[:7]))
    b.gleich(T, "Notiz: höchster Überschuss unter und über der Schwelle (Raster 0 bis 3 %)",
             "".join(raster[x] for x in sorted(raster)),
             "".join("C" if x < schwelle["C"] else "A" for x in sorted(raster)), q("tilg.raster.bester"))

    t = block(s, "table")
    r = t["rows"]
    zeilen = [
        (0, "Rechenweg 1 Mehrschuld", "tilg.mehrschuld", de), (1, "Rechenweg 2 Mehr-Sollmiete", "tilg.mehr_sollmiete", de),
        (2, "Rechenweg: Mietausfall", "tilg.mehr_mietausfall", de), (3, "Rechenweg 3 Verwaltungskostenbeitrag", "tilg.mehr_verwaltungskostenbeitrag", de),
        (4, "Rechenweg 4 Mehrüberschuss vor Tilgung", "tilg.mehrueberschuss_vor_tilgung", de),
    ]
    for i, name, schl, f in zeilen:
        for j, g in enumerate(("B", "C")):
            b.gleich(T, f"{name}, {g}", r[i][2 + j], f(m(f"{schl}.{g}")), q(f"{schl}.{g}"))
    for j, g in enumerate(("B", "C")):
        b.gleich(T, f"Rechenweg 5 Tilgungsschwelle, {g}", r[5][2 + j], f"{pct(schwelle[g], 2)} %", q(f"tilg.schwelle.{g}_gegen_A"))
        b.gleich(T, f"Einmalig: Mehr an Bearbeitungsentgelten, {g}", t["aside_row"][2 + j], de(m(f"tilg.mehr_bearbeitungsentgelte.{g}")), q(f"tilg.mehr_bearbeitungsentgelte.{g}"))
    mA = D(m("fin.miete_jahr1.A"))
    b.enthaelt(T, "Rechenweg 1: Darlehen", r[0][1], f"Darlehen {mio(m('fin.darlehen_nbank.B'))} | {mio(m('fin.darlehen_nbank.C'))} statt {mio(m('fin.darlehen_nbank.A'))} Mio. €", q("fin.darlehen_nbank.A/B/C"))
    b.enthaelt(T, "Rechenweg 2: Mehrmiete je m²", r[1][1], f"{de(wfl)} m² × {de(D(m('fin.miete_jahr1.B')) - mA, 2)} | {de(D(m('fin.miete_jahr1.C')) - mA, 2)} € × 12", q("fin.miete_jahr1.A/B/C"))
    b.enthaelt(T, "Rechenweg: Satz Mietausfall", r[2][1], f"Mietausfall {pct(m('jr1.satz.mietausfall'))} %", q("jr1.satz.mietausfall"))
    b.enthaelt(T, "Rechenweg 3: Satz", r[3][1], f"{pct(m('jr1.satz.verwaltungskostenbeitrag'), 1)} % von Zeile 1", q("jr1.satz.verwaltungskostenbeitrag"))
    lz = block(s, "text", heading="Über die Laufzeit")["body"]
    b.enthaelt(T, "Über die Laufzeit: Mehrschuld", lz, f"A trägt {mio(sB)} Mio. € weniger Schulden als B und {mio(sC)} Mio. € weniger als C", q("tilg.mehrschuld.B/C"))
    # Die zinsfreien Jahre nennt auf dieser Seite nur noch der Vorspann (oben geprüft); die Höchstlaufzeit steht seit 12.11.2026 nicht mehr auf S. 12
    abc = s["calculation"]["A_B_C"]
    felder = [
        ("zuschuss_mio", "fin.zuschuss", lambda x: zahl(D(x) / 1000000, 1)), ("darlehen_mio", "fin.darlehen_nbank", lambda x: zahl(D(x) / 1000000, 1)),
        ("hoechstmiete_eur_m2", "fin.miete_jahr1", lambda x: zahl(x, 2)), ("sollmiete_pa", "jr1.sollmiete", zahl),
        ("mietausfall_2_prozent_pa", "jr1.mietausfall", zahl), ("verwaltungskostenbeitrag_pa", "jr1.verwaltungskostenbeitrag", zahl),
        ("tilgung_pa", "jr1.tilgung_nbank", zahl), ("zahlungsueberschuss_jahr_1", "jr1.zahlungsueberschuss", zahl),
        ("bearbeitungsentgelte", "jr1.bearbeitungsentgelte", zahl),
    ]
    for feld, schl, f in felder:
        b.gleich(T, f"Rechenblock A | B | C: {feld}", [float(x) for x in abc[feld]], [f(m(f"{schl}.{g}")) for g in GRUPPEN], q(f"{schl}.A/B/C"))
    b.enthaelt(T, "Rechenblock: Basis", s["calculation"]["basis"],
               f"{de(we)} Wohnungen, {de(wfl)} m² Wohnfläche, zuwendungsfähige Kosten {mio(m('fin.zuwendungsfaehige_kosten.A'))} Mio. €", q("eingabe.*, fin.zuwendungsfaehige_kosten.A"))


# ---------------------------------------------------------------- 2 Altfassung

def abgleich_altfassung(w, b):
    """Gezeigte Werte der Altfassung vom 26.10.2026 (Folien 11, 13, 14, 17), abgetippt."""
    p = w.lauf("projekt2")
    q = lambda k: "projekt2: " + k
    T = "Altfassung, Projekt 2"
    wfl = p("eingabe.wohnflaeche")
    alt = [
        ("Folie 11: Wohneinheiten", "14", de(p("eingabe.wohnungen")), "eingabe.wohnungen"),
        ("Folie 11: Wohnfläche", "828 m²", f"{de(wfl)} m²", "eingabe.wohnflaeche"),
        ("Folie 11: Mietenstufe", "VI", p("eingabe.mietenstufe"), "eingabe.mietenstufe"),
        ("Folie 11: KfW-EH 55, kein EH-40-Mietzuschlag (Eingabe 4.2 „EH 40 erreicht“)", "nein", p("eingabe.eh40"), "eingabe.eh40"),
        ("Folie 11: Herstellungskosten je m²", "3.579 €/m²", f"{de(p('eingabe.herstellungskosten_qm'))} €/m²", "eingabe.herstellungskosten_qm"),
        ("Folie 11: Gesamtkosten, ohne Grundstück", "2.963.412 €", f"{de(p('fin.gesamtkosten.A'))} €", "fin.gesamtkosten.A"),
        ("Folie 11: Grundstück im Ansatz", "0 €", f"{de(p('fin.grundstueck'))} €", "fin.grundstueck"),
        ("Folie 11: Mietausfallwagnis", "2 %", f"{pct(p('jr1.satz.mietausfall'))} %", "jr1.satz.mietausfall"),
        ("Folie 11: Verwaltung je Wohnung", "367 €", f"{de(p('jr1.satz.objektverwaltung'))} €", "jr1.satz.objektverwaltung"),
        ("Folie 11: Verwaltung p. a.", "5.138 €", f"{de(p('jr1.objektverwaltung.A'))} €", "jr1.objektverwaltung.A"),
        ("Folie 11: Instandhaltung je m²", "14,40 €", f"{de(p('jr1.satz.instandhaltung'), 2)} €", "jr1.satz.instandhaltung"),
        ("Folie 11: Instandhaltung p. a.", "11.923 €", f"{de(p('jr1.instandhaltung.A'))} €", "jr1.instandhaltung.A"),
        ("Folie 11: Eigenmittel 20 %", "592.682 €", f"{de(p('fin.eigenmittel.A'))} €", "fin.eigenmittel.A"),
        ("Folie 13: NBank-Darlehen 40 %", "1.185.365", de(p("fin.darlehen_nbank.A")), "fin.darlehen_nbank.A"),
        ("Folie 13: NBank-Zuschuss 40 %", "1.185.365", de(p("fin.zuschuss.A")), "fin.zuschuss.A"),
        ("Folie 13: zulässige Miete Gruppe A", "6,80 €/m²", f"{de(p('fin.miete_jahr1.A'), 2)} €/m²", "fin.miete_jahr1.A"),
        ("Folie 13: Tilgung p. a.", "29.634 €", f"{de(p('jr1.tilgung_nbank.A'))} €", "jr1.tilgung_nbank.A"),
        ("Folie 13: Verwaltungskostenbeitrag 0,5 %", "5.927 €", f"{de(p('jr1.verwaltungskostenbeitrag.A'))} €", "jr1.verwaltungskostenbeitrag.A"),
        ("Folie 13: Einmalentgelte", "20.744 €", f"{de(p('fin.bearbeitungsentgelte.A'))} €", "fin.bearbeitungsentgelte.A"),
        ("Folie 14: Bankdarlehen 80 %", "2.370.730", de(p("fin.bankdarlehen.Frei")), "fin.bankdarlehen.Frei"),
        ("Folie 14: Sollzins", "3,74 %", f"{pct(p('eingabe.zins_bank'), 2)} %", "eingabe.zins_bank"),
        ("Folie 14: Annuität, 30 Jahre", "132.805 €", f"{de(p('frei.annuitaet'))} €", "frei.annuitaet"),
        ("Folie 14: Zins im Jahr 1", "88.665 €", f"{de(-p('frei.zins_jahr1'))} €", "frei.zins_jahr1"),
        ("Folie 14: Tilgung im Jahr 1", "44.140 €", f"{de(-p('frei.tilgung_jahr1'))} €", "frei.tilgung_jahr1"),
        ("Folie 14, 17: erforderliche Miete frei", "15,39 €/m²", f"{de(p('dscr.noetige_miete.Frei'), 2)} €/m²", "dscr.noetige_miete.Frei"),
        ("Folie 14: erforderliche Miete frei, p. a.", "152.924 €", f"{de(D(p('dscr.noetige_miete.Frei')) * wfl * 12)} €", "dscr.noetige_miete.Frei × Wohnfläche × 12"),
        ("Folie 14, 17: Überschuss gefördert, auf 100 € gerundet", "13.600 €", f"{de(D(p('jr1.zahlungsueberschuss.A')).quantize(Decimal('1E2'), rounding=ROUND_HALF_UP))} €", "jr1.zahlungsueberschuss.A"),
    ]
    for stelle, gezeigt, mappe, schl in alt:
        b.gleich(T, stelle, gezeigt, mappe, q(schl))


# ---------------------------------------------------------------- 3 Handrechnung

def handrechnung(w, lauf, basis="modellhaus"):
    """Rechnet die Kernwerte aus Eingaben und Festwerten neu. Gibt Paare
    (Schlüssel, Handwert) zurück. Festwerte kommen aus dem Lauf „modellhaus“."""
    t = w.lauf("modellhaus")
    e = w.lauf(lauf if lauf != "modellhaus_dscr125" else basis)
    ziel = w.lauf(lauf)("dscr.ziel")
    wfl, we = e("eingabe.wohnflaeche"), e("eingabe.wohnungen")
    stufe = e("eingabe.mietenstufe")
    herst = wfl * e("eingabe.herstellungskosten_qm")
    grund = e("eingabe.grundstueck")
    grenze = t(f"tab.bemessungsgrenze.{stufe}")
    gesamt = herst + e("eingabe.finanzierungskosten_kg800") + grund
    zuwf = min(herst, wfl * grenze) + grund
    em_bar = max(0.0, t("tab.eigenmittel_mindestens") * zuwf - grund)
    i, n = e("eingabe.zins_bank"), e("eingabe.laufzeit_bank")
    af = i / (1 - (1 + i) ** -n)
    ausfall, tilg = e("eingabe.mietausfall"), e("eingabe.tilgung_nbank")
    verw = e("eingabe.objektverwaltung_je_wohnung") * we
    inst = e("eingabe.instandhaltung_je_qm") * wfl
    vkb = t("tab.verwaltungskostenbeitrag")
    hand = {"fin.herstellungskosten": herst, "fin.zuwendungsfaehige_kosten.A": zuwf,
            "fin.ueber_bemessungsgrenze.A": max(0.0, herst - wfl * grenze)}
    vor_tilgung, darlehen = {}, {}
    for g in GRUPPEN:
        dar = zuwf * t(f"tab.quote_darlehen.{g}")
        zus = zuwf * t(f"tab.quote_zuschuss.{g}")
        bank = max(0.0, herst - dar - zus - em_bar - e("eingabe.eigenkapital_zusatz"))
        entgelt = dar * t("tab.bearbeitungsentgelt_darlehen") + zus * t("tab.bearbeitungsentgelt_zuschuss")
        miete = t(f"tab.hoechstmiete.{stufe}.{g}") + (t("tab.zuschlag_hoechstmiete_eh40") if e("eingabe.eh40") == "ja" else 0)
        soll = miete * wfl * 12
        uvk = soll - ausfall * soll - verw - inst
        kd = vkb * dar + t("tab.zins_nbank_bis_jahr35") * dar + tilg * dar + bank * af
        darlehen[g], vor_tilgung[g] = dar, uvk - vkb * dar - bank * af
        hand.update({
            f"fin.gesamtkosten.{g}": gesamt, f"fin.darlehen_nbank.{g}": dar, f"fin.zuschuss.{g}": zus,
            f"fin.foerderung.{g}": dar + zus, f"fin.foerderquote.{g}": (dar + zus) / gesamt,
            f"fin.bankdarlehen.{g}": bank, f"fin.eigenmittel.{g}": gesamt - dar - zus - bank,
            f"fin.bearbeitungsentgelte.{g}": entgelt, f"fin.zuschuss_je_wohnung.{g}": zus / we,
            f"fin.miete_jahr1.{g}": miete, f"jr1.sollmiete.{g}": soll, f"jr1.mietausfall.{g}": ausfall * soll,
            f"jr1.objektverwaltung.{g}": verw, f"jr1.instandhaltung.{g}": inst,
            f"jr1.ueberschuss_vor_kapitaldienst.{g}": uvk, f"jr1.verwaltungskostenbeitrag.{g}": vkb * dar,
            f"jr1.tilgung_nbank.{g}": tilg * dar, f"jr1.kapitaldienst_bank.{g}": bank * af,
            f"jr1.zahlungsueberschuss.{g}": uvk - kd, f"liq.dscr_jahr1.{g}": uvk / kd,
            f"liq.breakeven_tilgung.{g}": max(0.0, (uvk - vkb * dar - bank * af) / dar),
            f"dscr.kapitaldienst_jahr1.{g}": kd,
            f"dscr.noetige_miete.{g}": (ziel * kd + verw + inst) / ((1 - ausfall) * wfl * 12),
        })
    bank_frei = max(0.0, herst - em_bar - e("eingabe.eigenkapital_zusatz"))
    hand.update({
        "fin.bankdarlehen.Frei": bank_frei, "fin.eigenmittel.Frei": grund + herst - bank_frei,
        "frei.annuitaet": bank_frei * af, "frei.zins_jahr1": -bank_frei * i, "frei.tilgung_jahr1": -(bank_frei * af - bank_frei * i),
        "dscr.kapitaldienst_jahr1.Frei": bank_frei * af,
        "dscr.noetige_miete.Frei": (ziel * bank_frei * af + verw + inst) / ((1 - ausfall) * wfl * 12),
        "tilg.schwelle.B_gegen_A": (vor_tilgung["B"] - vor_tilgung["A"]) / (darlehen["B"] - darlehen["A"]),
        "tilg.schwelle.C_gegen_A": (vor_tilgung["C"] - vor_tilgung["A"]) / (darlehen["C"] - darlehen["A"]),
        "tilg.schwelle.C_gegen_B": (vor_tilgung["C"] - vor_tilgung["B"]) / (darlehen["C"] - darlehen["B"]),
        "tilg.mehrueberschuss_vor_tilgung.B": vor_tilgung["B"] - vor_tilgung["A"],
        "tilg.mehrueberschuss_vor_tilgung.C": vor_tilgung["C"] - vor_tilgung["A"],
    })
    return hand


def abgleich_handrechnung(w, b):
    for lauf in ("modellhaus", "modellhaus_dscr125", "modellhaus_kosten_4631", "modellhaus_kosten_5460", "projekt2"):
        werte = w.daten["laeufe"][lauf]["werte"]
        n = abw = 0
        groesste = 0.0
        for schl, hand in handrechnung(w, lauf).items():
            if schl not in werte:
                continue
            n += 1
            ist = werte[schl]["wert"]
            diff = abs(ist - hand)
            groesste = max(groesste, diff)
            if diff > 1e-6 * max(1.0, abs(ist)):
                abw += 1
                b.zeilen.append(("Handrechnung", f"{lauf}: {schl}", f"Hand {hand!r}", repr(ist), f"{lauf}: {schl}", "ABWEICHUNG"))
        b.zeilen.append(("Handrechnung", f"{lauf}: {n} Werte nachgerechnet, größte Differenz {groesste:.2e}",
                         f"{n - abw} gleich", f"{n} Werte", lauf, "gleich" if abw == 0 else "ABWEICHUNG"))


# ---------------------------------------------------------------- 4 Sperrliste

def _zellen(bereich):
    """„D91:G91“ → {'D91', 'E91', 'F91', 'G91'} (Spalten A bis Z reichen hier)."""
    m = re.fullmatch(r"([A-Z])(\d+)(?::([A-Z])(\d+))?", bereich)
    if not m:
        sys.exit(f"Ausnahme: Bereich „{bereich}“ nicht lesbar.")
    s1, z1, s2, z2 = m.group(1), int(m.group(2)), m.group(3) or m.group(1), int(m.group(4) or m.group(2))
    return {f"{chr(sp)}{ze}" for sp in range(ord(s1), ord(s2) + 1) for ze in range(z1, z2 + 1)}


def abgleich_sperre(w, b):
    teil = "Sperrliste"
    ausnahmen = w.daten["meta"].get("ausnahmen", [])
    erlaubt = {a["lauf"]: a for a in ausnahmen}
    for a in ausnahmen:
        voll = all(a.get(k) for k in ("name", "lauf", "erlaubt_von", "erlaubt_am", "zweck", "bedingung", "zellen"))
        b.zeilen.append((teil, f"Ausnahme {a.get('name')}: erlaubt von {a.get('erlaubt_von')}, {a.get('erlaubt_am')}; {a.get('zweck')}",
                         "vollständig" if voll else "Angabe fehlt", "vollständig", "meta.ausnahmen", "gleich" if voll else "ABWEICHUNG"))
    for lauf, daten in w.daten["laeufe"].items():
        werte = daten["werte"]
        heikel = [k for k, v in werte.items() if k.startswith("rendite.") or "ausnahme" in v]
        if lauf not in erlaubt:
            b.zeilen.append((teil, f"{lauf}: Werte aus gesperrten Zellen", str(len(heikel)), "0", lauf, "gleich" if not heikel else "ABWEICHUNG"))
            continue
        a = erlaubt[lauf]
        offen = {(blatt, z) for eintrag in a["zellen"] for blatt, bereich in [eintrag.split("!")] for z in _zellen(bereich)}
        gelesen = {(v["blatt"], v["zelle"]) for v in werte.values()}
        fremd = sorted(k for k, v in werte.items() if v.get("ausnahme") != a["name"] or (v["blatt"], v["zelle"]) not in offen)
        b.zeilen.append((teil, f"{lauf}: {len(werte)} Werte, alle aus den Zellen der Ausnahme {a['name']}",
                         "ja" if not fremd else "nein: " + ", ".join(fremd), "ja", lauf, "gleich" if not fremd else "ABWEICHUNG"))
        ungenutzt = sorted(f"{blatt}!{z}" for blatt, z in offen - gelesen)
        b.zeilen.append((teil, f"{lauf}: jede geöffnete Zelle wird gelesen", "ja" if not ungenutzt else "nein: " + ", ".join(ungenutzt), "ja", lauf,
                         "gleich" if not ungenutzt else "ABWEICHUNG"))


# ---------------------------------------------------------------- Ausgabe

def markdown(b):
    aus = []
    for teil in dict.fromkeys(z[0] for z in b.zeilen):
        n, abw = b.anzahl(teil)
        aus.append(f"### {teil}: {n} Prüfungen, Abweichungen: {abw}\n")
        aus.append("| Stelle | gezeigt | Mappe, gerundet | Schlüssel | Ergebnis |")
        aus.append("|---|---:|---:|---|---|")
        for _, stelle, gezeigt, mappe, quelle, status in (z for z in b.zeilen if z[0] == teil):
            stelle, gezeigt, mappe = (x.replace("|", "\\|") for x in (stelle, gezeigt, mappe))
            aus.append(f"| {stelle} | {gezeigt} | {mappe} | `{quelle}` | {status} |")
        aus.append("")
    return "\n".join(aus)


def main():
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("--werte", type=Path, default=WERTE)
    p.add_argument("--bericht", type=Path)
    a = p.parse_args()
    w = Werte(json.loads(a.werte.read_text(encoding="utf-8")))
    b = Bericht()
    abgleich_broschuere(w, b)
    abgleich_altfassung(w, b)
    abgleich_handrechnung(w, b)
    abgleich_sperre(w, b)
    if a.bericht:
        a.bericht.write_text(markdown(b), encoding="utf-8")
    fehler = 0
    for teil in dict.fromkeys(z[0] for z in b.zeilen):
        n, abw = b.anzahl(teil)
        print(f"{teil}: {n} Prüfungen, Abweichungen: {abw}")
        for z in b.zeilen:
            if z[0] == teil and z[5] != "gleich":
                print(f"   {z[1]}: gezeigt {z[2]} / Mappe {z[3]}  [{z[4]}]")
        if not teil.startswith("Altfassung"):
            fehler += abw
    sys.exit(1 if fehler else 0)


if __name__ == "__main__":
    main()
