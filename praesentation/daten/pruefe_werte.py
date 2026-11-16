#!/usr/bin/env python3
"""Abgleich von werte.json mit der Altfassung und einer Handrechnung.

1. Broschüre S. 10–12: hier nicht mehr geprüft. Die Broschüre ist eingefroren
   auf dem Stand vom 16.11.2026 (Modellhaus mit Vergleichsmiete 12,92 und
   Marktmiete 15,42 €/m²); werte.json und kennzahlen.json führen seit 16.11.2026
   den neuen Stand der Mappe (9,19 und 11,75 €/m²). Den Abgleich der Belege der
   Broschüre mit der Mappe führt vofi/pruefe_vofi.py, Prüfung F9, mit Läufen der
   Mappe, die die beiden früheren Mieten setzen. Das Skript gibt dazu eine Zeile
   aus; sie zählt nicht als Abweichung. Das Modellhaus ist Projekt 2 der Mappe
   (PGN-Projekt in Neu Wulmstorf, Grundstück im Bestand und nicht angesetzt).
2. Altfassung der Präsentation (Folien 11, 13, 14, 17) gegen den Lauf „projekt2“
   (dasselbe Projekt mit Tilgung 2,5 % wie in der Altfassung).
   Abweichungen hier sind Hinweise, kein Fehler: Es gilt die Mappe.
3. Handrechnung: Die Kernwerte jedes Laufs werden aus den Eingaben und den
   Festwerten der Richtlinie neu gerechnet, ohne die Formeln der Mappe; dazu
   Tabelle 5 der Mappe (Kapitaldienst je m², Folie 5) und die Gegenprobe ohne
   Mieterhöhung (Lauf „modellhaus_ohne_mieterhoehung“, Folie 21).
4. Sperrliste: Renditen, Restwert und Marktmiete stehen nur im Lauf der
   benannten Ausnahme (meta.ausnahmen), jeder dieser Werte liegt in einer dort
   genannten Zelle, und kein anderer Lauf führt einen solchen Wert.

Aufruf (im Ordner praesentation):
    python daten/pruefe_werte.py [--bericht DATEI.md]

Rückgabewert 0, wenn 3 und 4 ohne Abweichung sind.
"""

import argparse
import json
import re
import sys
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

HIER = Path(__file__).resolve().parent
WERTE = HIER / "werte.json"
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


# ---------------------------------------------------------------- 1 Broschüre

# Seit 16.11.2026 kein Abgleich mehr an dieser Stelle (siehe Kopf der Datei): eine Zeile im Ergebnis, keine Abweichung.
BROSCHUERE_MELDUNG = "Broschüre eingefroren auf Stand 16.11.2026; Abgleich über vofi/pruefe_vofi.py F9"


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


def handrechnung_kd5(w):
    """Tabelle 5 der Mappe (Kapitaldienst je m², Folie 5): jährliche Annuität i ÷ (1 − (1 + i)^−n), Kosten × 80 % × Satz ÷ 12;
    Zerlegung des Anstiegs wie im Auftrag vom 13.11.2026 (Herstellungskosten = neue Kosten zum alten Zins minus alt, Zins = alte
    Kosten zum neuen Zins minus alt, Wechselwirkung = Rest). Eingangswerte: Kosten und Sollzins Q1 2020 aus der Tabelle, Zins heute
    und Laufzeit aus den Eingaben 6.1 und 6.4."""
    m = w.lauf("modellhaus")
    k0, k1 = m("kd5.herstellungskosten_qm.q1_2020"), m("kd5.herstellungskosten_qm.heute")
    fk, i0, i1, n = m("kd5.fremdkapitalanteil.q1_2020"), m("kd5.sollzins.q1_2020"), m("eingabe.zins_bank"), m("eingabe.laufzeit_bank")
    satz = lambda i: i / (1 - (1 + i) ** -n)
    kd0, kd1 = k0 * fk * satz(i0) / 12, k1 * fk * satz(i1) / 12
    hk, zi = k1 * fk * satz(i0) / 12 - kd0, k0 * fk * satz(i1) / 12 - kd0
    anstieg = kd1 - kd0
    return {
        "kd5.sollzins.heute": i1, "kd5.laufzeit.q1_2020": n, "kd5.laufzeit.heute": n,
        "kd5.kapitaldienstsatz.q1_2020": satz(i0), "kd5.kapitaldienstsatz.heute": satz(i1),
        "kd5.tilgung.q1_2020": satz(i0) - i0, "kd5.tilgung.heute": satz(i1) - i1,
        "kd5.kapitaldienst.q1_2020": kd0, "kd5.kapitaldienst.heute": kd1, "kd5.anstieg": anstieg,
        "kd5.zerlegung.herstellungskosten": hk, "kd5.zerlegung.zins": zi, "kd5.zerlegung.wechselwirkung": anstieg - hk - zi,
        "kd5.anteil.herstellungskosten": hk / anstieg, "kd5.anteil.zins": zi / anstieg,
        "kd5.anteil.wechselwirkung": (anstieg - hk - zi) / anstieg,
    }


def abgleich_kd5_und_gegenprobe(w, b):
    """Tabelle 5 (Folie 5) nachgerechnet; Gegenprobe ohne Mieterhöhung (Folie 21): Miete konstant, kein Fehlbetrag in Jahr 1 bis 35."""
    teil = "Handrechnung"
    werte = w.daten["laeufe"]["modellhaus"]["werte"]
    hand = handrechnung_kd5(w)
    abw = [k for k, v in hand.items() if abs(werte[k]["wert"] - v) > 1e-9 * max(1.0, abs(v))]
    b.zeilen.append((teil, f"modellhaus: Tabelle 5 (Kapitaldienst je m²), {len(hand)} Werte nachgerechnet",
                     "gleich" if not abw else "abweichend: " + ", ".join(abw), "gleich", "kd5.*", "gleich" if not abw else "ABWEICHUNG"))
    o = w.lauf("modellhaus_ohne_mieterhoehung")
    b.gleich(teil, "ohne Mieterhöhung: Mieterhöhung in der Bindung (Tabellen T20)", o("tab.mieterhoehung_in_der_bindung"), 0,
             "modellhaus_ohne_mieterhoehung: tab.mieterhoehung_in_der_bindung")
    m = w.lauf("modellhaus")
    for g in GRUPPEN:
        miete = o(f"zr.miete.{g}")[:35]
        b.gleich(teil, f"ohne Mieterhöhung, {g}: Miete Jahr 1 bis 35 gleich der Miete Jahr 1", miete, [m(f"fin.miete_jahr1.{g}")] * 35,
                 f"modellhaus_ohne_mieterhoehung: zr.miete.{g}")
        zue = o(f"zr.zahlungsueberschuss.{g}")[:35]
        b.gleich(teil, f"ohne Mieterhöhung, {g}: Jahre mit Fehlbetrag in Jahr 1 bis 35", sum(1 for x in zue if x < 0),
                 o(f"liq.jahre_mit_fehlbetrag.{g}"), f"modellhaus_ohne_mieterhoehung: liq.jahre_mit_fehlbetrag.{g}")


def abgleich_handrechnung(w, b):
    abgleich_kd5_und_gegenprobe(w, b)
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
    aus = [f"### Broschüre S. 10–12: {BROSCHUERE_MELDUNG}\n"]
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
    abgleich_altfassung(w, b)
    abgleich_handrechnung(w, b)
    abgleich_sperre(w, b)
    if a.bericht:
        a.bericht.write_text(markdown(b), encoding="utf-8")
    fehler = 0
    print(f"Broschüre S. 10–12: {BROSCHUERE_MELDUNG}")
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
