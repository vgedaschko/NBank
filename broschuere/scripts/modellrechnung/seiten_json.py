"""Schreibt content/pages/10-modellhaus-finanzierung.json, 11-jahr-1.json und 12-35-jahre.json (Modellrechnung, Stand 15.11.2026)
mit allen Blöcken und den „belege“ jeder Zahl. Aufruf aus broschuere/: python3 scripts/modellrechnung/seiten_json.py"""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from belege import Seite, Z, schreibe, NB

ALT = {n: json.loads(next((NB / 'broschuere/content/pages').glob(f'{n}-*.json')).read_text()) for n in ('10', '11', '12')}
SOLLF = f"({Z('n5.miete_jahr1.frei_markt')} * {Z('annahme.wohnflaeche')} * 12)"
KNULL = lambda g: (f"abrunden({Z('annahme.herstellungskosten_qm')} + Übersicht!{g}38 * (L70:Eingaben!F11 - {Z('annahme.herstellungskosten_qm')})"
                   f" / (Übersicht!{g}38 - L70:Übersicht!{g}38), 10)")
STAND = 'Umbau der Modellrechnung am 15.11.2026 nach der Präsentation (Folien 14 bis 22 und Fazit)'

# ------------------------------------------------------------------ S. 10
s = Seite()
gk, zu, dl, bank, ek = (s.n(Z(k), 'mio', 2, w) for k, w in (('n5.gesamtkosten.A', 'Unterzeile'), ('n5.zuschuss.A', 'Haus A'), ('n5.darlehen_nbank.A', 'Haus A'),
                                                       ('n5.bankdarlehen.frei_markt', 'Haus frei'), ('n5.eigenkapital.frei_markt', 'Häuser')))
q_ek = s.n(f"{Z('n5.eigenkapital.frei_markt')} / {Z('n5.gesamtkosten.A')}", 'prozent', 0, 'Maßkette')
q_fk = s.n(f"1 - {Z('n5.eigenkapital.frei_markt')} / {Z('n5.gesamtkosten.A')}", 'prozent', 0, 'Maßkette')
q_zu = s.n(f"{Z('n5.zuschuss.A')} / {Z('n5.gesamtkosten.A')}", 'prozent', 0, 'Titel')
z_nb = s.n(Z('annahme.zins_nbank_bis_jahr35'), 'prozent', 0, 'Haus A, Annahmen')
z_bk = s.n(Z('annahme.zins_bank'), 'prozent', 2, 'Haus frei, Annahmen')
we, wf = s.n(Z('annahme.wohnungen'), wo='Steckbrief'), s.n(Z('annahme.wohnflaeche'), wo='Steckbrief')
schnitt = s.n(f"{Z('annahme.wohnflaeche')} / {Z('annahme.wohnungen')}", wo='Steckbrief')
hk = s.n(Z('annahme.herstellungskosten_qm'), wo='Steckbrief')
bezug = s.n(Z('annahme.bezugsjahr'), 'jahr', wo='Steckbrief')
jahre = s.n(Z('annahme.bindung'), wo='Steckbrief')
zu_we = s.n(f"{Z('n5.zuschuss.A')} / {Z('annahme.wohnungen')}", wo='Kennzahl')
ek_we = s.n(f"{Z('n5.eigenkapital.frei_markt')} / {Z('annahme.wohnungen')}", wo='Kennzahl')
bea = s.n(Z('n5.bearbeitungsentgelte.A'), wo='Kennzahl')
hm = s.n(Z('annahme.hoechstmiete_VI.A'), nk=2, wo='Annahmen'); mm = s.n(Z('annahme.marktmiete_jahr1'), nk=2, wo='Annahmen')
fest = s.n(Z('annahme.jahre_ohne_mieterhoehung'), wo='Annahmen'); erh = s.n(Z('annahme.mieterhoehung_in_der_bindung'), 'prozent', 2, 'Annahmen')
takt = s.n(Z('annahme.abstand_mieterhoehungen'), wo='Annahmen'); mst = s.n(Z('annahme.mietsteigerung'), 'prozent', 0, 'Annahmen')
ausf = s.n(Z('annahme.mietausfall'), 'prozent', 0, 'Annahmen'); verw = s.n(Z('annahme.objektverwaltung_je_wohnung'), wo='Annahmen')
inst = s.n(Z('annahme.instandhaltung_je_qm'), nk=2, wo='Annahmen'); kst = s.n(Z('annahme.kostensteigerung'), 'prozent', 0, 'Annahmen')
zfj = s.n(Z('annahme.zinsfreie_jahre'), wo='Annahmen'); zb = s.n(Z('annahme.zinsbindung'), wo='Annahmen')
vkb = s.n(Z('annahme.verwaltungskostenbeitrag'), 'prozent', 1, 'Annahmen'); tilg = s.n(Z('annahme.tilgung_nbank'), 'prozent', 2, 'Annahmen')
lz = s.n(Z('annahme.laufzeit_bank'), wo='Annahmen'); soll = s.n(Z('annahme.sollzins'), 'prozent', 0, 'Annahmen'); haben = s.n(Z('annahme.guthabenzins'), 'prozent', 0, 'Annahmen')
d10 = {
  'no': 10, 'slug': 'modellhaus-finanzierung', 'layout_type': 'chart-focus', 'page_variant': 'accent', 'page_dense': True,
  'running_title': 'Modellrechnung · Modellhaus und Finanzierung', 'kicker': 'Modellrechnung',
  'headline_light': 'Modellhaus in Neu Wulmstorf', 'headline': f'Gleiches Eigenkapital, gefördert {q_zu} % Zuschuss',
  'blocks': [
    {'type': 'chart', 'chart': 'stacked-house', 'title': 'Mittelherkunft', 'unit': 'Mio. €', 'subtitle': f'Gesamtkosten je {gk} Mio. € · Rechenbeispiel, keine Förderzusage',
     'data': {'categories': ['Gefördert, Gruppe A', 'Frei finanziert'],
              'segments': [{'category': 'Gefördert, Gruppe A', 'name': 'Zuschuss', 'note': 'nicht rückzahlbar', 'display': zu, 'share': f'{q_zu} %'},
                           {'category': 'Gefördert, Gruppe A', 'name': 'NBank-Darlehen', 'note': f'{z_nb} % Zins', 'display': dl, 'share': f'{q_zu} %'},
                           {'category': 'Gefördert, Gruppe A', 'name': 'Eigenkapital', 'display': ek, 'share': f'{q_ek} %'},
                           {'category': 'Frei finanziert', 'name': 'Bankdarlehen', 'note': f'{z_bk} % Zins', 'display': bank, 'share': f'{q_fk} %'},
                           {'category': 'Frei finanziert', 'name': 'Eigenkapital', 'display': ek, 'share': f'{q_ek} %'}],
              'dimension': [{'name': 'Eigenkapital', 'share': f'{q_ek} %'}, {'name': 'Fremdkapital', 'share': f'{q_fk} %'}]}},
    {'type': 'profile', 'heading': 'Das Modellhaus', 'rows': [
      ['Ort', 'Neu Wulmstorf, Landkreis Harburg, Mietenstufe VI'],
      ['Wohnungen', f'{we} für Gruppe A, {wf} m², im Schnitt {schnitt} m²'],
      ['Herstellungskosten', f'{hk} € je m², Median aus fünf PGN-Projekten'],
      ['Standard', 'Effizienzhaus 55, Grundstück nicht angesetzt'],
      ['Rechnung', f'Bezug {bezug}, betrachtet über {jahre} Jahre']]},
    {'type': 'key_figures', 'items': [
      {'value': zu_we, 'unit': '€', 'label': 'Zuschuss je Wohnung', 'text': 'nicht rückzahlbar'},
      {'value': ek_we, 'unit': '€', 'label': 'Eigenkapital je Wohnung', 'text': f'in beiden Fällen gleich; gefördert dazu {bea} € Bearbeitungsentgelte'}]},
    {'type': 'table', 'role_hint': 'annahmen', 'caption': 'Annahmen der Rechnung', 'subtitle': 'Vor Steuern. Gleiche Kosten, verschieden sind nur Miete und Finanzierung.',
     'columns': ['Position', 'Gefördert, Gruppe A', 'Frei finanziert'], 'rows': [
      ['Miete Jahr 1', f'Höchstmiete {hm} € je m² und Monat', f'Marktmiete {mm} € je m² und Monat'],
      ['Mietanpassung', f'{fest} Jahre fest, dann +{erh} % je {takt} Jahre', f'+{mst} % p. a.'],
      ['Mietausfall', f'{ausf} % der Sollmiete', 'wie gefördert'],
      ['Objektverwaltung', f'{verw} € je Wohnung p. a.', 'wie gefördert'],
      ['Instandhaltung', f'{inst} € je m² p. a.', 'wie gefördert'],
      ['Kostensteigerung', f'{kst} % p. a. ab Jahr 2', 'wie gefördert'],
      ['Zins', f'{z_nb} % bis Jahr {zfj}', f'{z_bk} %, {zb} Jahre fest'],
      ['Verwaltungskostenbeitrag', f'{vkb} % vom Restkapital', 'entfällt'],
      ['Tilgung', f'{tilg} % p. a.', f'jährliche Annuität über {lz} Jahre'],
      ['Kontokorrent', f'Soll {soll} %, Haben {haben} %', 'wie gefördert'],
      ['Restwert Ende Jahr 35', 'Ertragswert, Miete nach der Bindung', 'Ertragswert, Marktmiete']]}],
  'footnotes': [], 'fact_ids': ALT['10']['fact_ids'],
  'visual_idea': ('Akzentseite, linke Hälfte der Doppelseite 10|11 (dicht, 9 pt). Kopfzeile mit Rubrik „Modellrechnung“ und Schlüsselplan; H1 in 25 pt mit '
                  '„Modellhaus in Neu Wulmstorf“ als zweite Stimme, Rot nur an „40 %“. Hauptelement über die volle Breite: zwei Häuser als gestapelte '
                  'Balken, je fünf Geschosse zu 20 % der Gesamtkosten, 14 Fenster = 14 Wohnungen; gefördert Zuschuss (Rot, ab der Grundlinie), '
                  'NBank-Darlehen, Eigenkapital (Schraffur); frei finanziert Bankdarlehen und Eigenkapital; Maßkette links Eigenkapital 20 % | Fremdkapital 80 %. '
                  'Hinweis „Rechenbeispiel, keine Förderzusage“ als Unterzeile des Diagramms. Darunter Steckbrief „Das Modellhaus“ (7, außen) und zwei '
                  'Kennzahlen je Wohnung (5, am Bund), unten die Annahmen gefördert gegen frei finanziert über die volle Breite. Kein Foto: Die '
                  'Visualisierung der Referenzen zeigt ein anderes PGN-Projekt in Neu Wulmstorf. ' + STAND),
}
schreibe(10, 'modellhaus-finanzierung', d10, s)

# ------------------------------------------------------------------ S. 11
s = Seite()
mmh = s.n(Z('n2.marktmiete_jahr1'), nk=2, wo='Titel'); bed = s.n(Z('n2.miete_dscr'), nk=2, wo='Titel, Diagramm')
U = lambda z: f'Übersicht!{z}'
pA = lambda zaehler, wo: s.n(f'{zaehler} / {U("D29")}', 'prozent', 1, wo)
pF = lambda zaehler, wo: s.n(f'{zaehler} / {SOLLF}', 'prozent', 1, wo)
fl = {'bewA': pA(f'({U("D30")} + {U("D31")} + {U("D32")})', 'Fluss A'), 'vkbA': pA(U('D34'), 'Fluss A'), 'tilA': pA(U('D36'), 'Fluss A'), 'ueA': pA(U('D38'), 'Fluss A'),
      'bewF': pF(f"({Z('annahme.mietausfall')} * {SOLLF} + {U('G31')} + {U('G32')})", 'Fluss frei'), 'zinsF': pF("-'Frei finanziert'!J7", 'Fluss frei'),
      'tilF': pF("-'Frei finanziert'!K7", 'Fluss frei'), 'fehlF': pF(f"-{Z('n5.zue_jahr1.frei_markt')}", 'Fluss frei')}
sA, sF = s.n(U('D29'), wo='Fluss, Jahresrechnung'), s.n(SOLLF, wo='Fluss, Jahresrechnung')
R = lambda f, wo='Jahresrechnung': s.n(f, wo=wo)
zeilen = [
  ['1', f'Sollmiete, {s.n(Z("annahme.wohnflaeche"))} m² × {s.n(U("D26"), nk=2)} | {s.n(Z("n5.miete_jahr1.frei_markt"), nk=2)} € × 12', sA, sF],
  ['2', f'− Mietausfall/Leerstand, {s.n(Z("annahme.mietausfall"), "prozent")} % der Sollmiete', R(U('D30')), R(f"{Z('annahme.mietausfall')} * {SOLLF}")],
  ['3', f'− Objektverwaltung, {s.n(Z("annahme.objektverwaltung_je_wohnung"))} € je Wohnung', R(U('D31')), R(U('G31'))],
  ['4', f'− Instandhaltung, {s.n(Z("annahme.instandhaltung_je_qm"), nk=2)} € je m²', R(U('D32')), R(U('G32'))],
  ['5', '= Überschuss vor Kapitaldienst', R(U('D33')), R(Z('n5.uevk_jahr1.frei_markt'))],
  ['6', f'− Verwaltungskostenbeitrag, {s.n(Z("annahme.verwaltungskostenbeitrag"), "prozent", 1)} % des NBank-Darlehens', R(U('D34')), '0'],
  ['7', f'− Zins, NBank {s.n(Z("annahme.zins_nbank_bis_jahr35"), "prozent")} % | Bank {s.n(Z("annahme.zins_bank"), "prozent", 2)} %', R(U('D35')), R("-'Frei finanziert'!J7")],
  ['8', f'− Tilgung, NBank {s.n(Z("annahme.tilgung_nbank"), "prozent", 2)} % | Bank Annuität über {s.n(Z("annahme.laufzeit_bank"))} Jahre', R(U('D36')), R("-'Frei finanziert'!K7")],
  ['9', '= Zahlungsüberschuss p. a.', R(U('D38')), R(Z('n5.zue_jahr1.frei_markt'))]]
fuss = [['Kapitaldienst, Zeilen 6 bis 8', R(U('D111')), R(Z('n5.kapitaldienst_jahr1.frei_markt'))],
        ['DSCR, Zeile 5 ÷ Kapitaldienst', s.n(Z('n5.dscr_jahr1.A'), nk=2, wo='Jahresrechnung'), s.n(Z('n5.dscr_jahr1.frei_markt'), nk=2, wo='Jahresrechnung')]]
dA, hmA, ziel = s.n(Z('n3.miete_dscr.A'), nk=2, wo='DSCR'), s.n(Z('n3.hoechstmiete.A'), nk=2, wo='DSCR'), s.n(Z('n1.dscr_ziel_bank_frei'), nk=1, wo='DSCR')
luecke = s.n(f"{Z('n2.miete_dscr')} - {Z('n2.marktmiete_jahr1')}", nk=2, wo='DSCR')
kM, kA, kC = s.n(Z('annahme.herstellungskosten_qm'), wo='Spielraum'), s.n(KNULL('D'), wo='Spielraum'), s.n(KNULL('F'), wo='Spielraum')
arge = s.n('L69:Eingaben!F11', wo='Spielraum')
tM, tA, tC = s.n(Z('annahme.tilgung_nbank'), 'prozent', 2, 'Spielraum'), s.n(U('D49'), 'prozent', 2, 'Spielraum'), s.n(U('F49'), 'prozent', 2, 'Spielraum')
d11 = {
  'no': 11, 'slug': 'jahr-1', 'layout_type': 'chart-focus', 'page_variant': 'accent',
  'running_title': 'Modellrechnung · Jahr 1', 'kicker': 'Modellrechnung',
  'headline_light': f'Der Markt zahlt {mmh} € je m²', 'headline': f'Frei finanziert braucht das Haus {bed} €',
  'blocks': [
    {'type': 'chart', 'chart': 'stacked-bar-share', 'title': 'Wohin die Miete fließt', 'unit': 'in % der Sollmiete, Jahr 1, gleiches Haus, gleiche Kosten',
     'legend': ['Bewirtschaftung, Mietausfall', 'Verwaltungskostenbeitrag', 'Zins', 'Tilgung', 'Zahlungsüberschuss'],
     'data': {'Gefördert, Gruppe A': {'Sollmiete': f'{sA} €', 'Bewirtschaftung, Mietausfall': f"{fl['bewA']} %", 'Verwaltungskostenbeitrag': f"{fl['vkbA']} %",
                                      'Zins': '0 %', 'Tilgung': f"{fl['tilA']} %", 'Zahlungsüberschuss': f"{fl['ueA']} %"},
              'Frei finanziert': {'Sollmiete': f'{sF} €', 'Bewirtschaftung, Mietausfall': f"{fl['bewF']} %", 'Zins': f"{fl['zinsF']} %", 'Tilgung': f"{fl['tilF']} %",
                                  'Fehlbetrag': f"{fl['fehlF']} %, über das Kontokorrent"}}},
    {'type': 'table', 'role_hint': 'dominant', 'caption': 'Jahresrechnung Jahr 1, in € p. a.', 'columns': ['', 'Position', 'Gefördert, A', 'Frei finanziert'],
     'rows': zeilen, 'result_row': '9', 'footer_rows': fuss},
    {'type': 'chart', 'chart': 'bar-pair', 'title': 'Miete für eine DSCR von 1,2', 'subtitle': 'in € je m² und Monat, Jahr 1',
     'data': {'Gruppe A': dA, 'Frei finanziert': bed, 'Höchstmiete': hmA, 'Marktmiete': mmh},
     'note': f'DSCR = Überschuss vor Kapitaldienst ÷ Kapitaldienst; {ziel} verlangt die Bank (Annahme der PGN). Zur Marktmiete fehlen {luecke} € (gestrichelt).'},
    {'type': 'chart', 'chart': 'stacked-bar', 'title': 'Spielraum in Jahr 1', 'legend': ['Modellhaus', 'bis zur Schwelle'],
     'data': {'Herstellungskosten je m²': {'Modellhaus': f'{kM} €', 'Gruppe A': f'{kA} €', 'Gruppe C': f'{kC} €', 'ARGE-Median': f'{arge} €'},
              'Tilgungssatz p. a.': {'Modellhaus': f'{tM} %', 'Gruppe A': f'{tA} %', 'Gruppe C': f'{tC} %'}},
     'note': 'Bis zur Schwelle bleibt in Jahr 1 ein Zahlungsüberschuss.'}],
  'footnotes': [], 'fact_ids': ALT['11']['fact_ids'],
  'visual_idea': ('Akzentseite, rechte Hälfte der Doppelseite 10|11. H1 mit „Der Markt zahlt 15,42 € je m²“ als zweite Stimme, Rot nur an „18,36 €“. '
                  'Band 1: „Wohin die Miete fließt“ als zwei Balken in Prozent der Sollmiete über die volle Breite (gefördert und frei finanziert), '
                  'Fehlbetrag frei finanziert als gestrichelter Umriss hinter der 100-%-Linie. Hauptelement: die Jahresrechnung gefördert gegen frei '
                  'finanziert, Zeilen 1 bis 9, Ergebniszeile rot, darunter Kapitaldienst und DSCR. Band 3: Miete für eine DSCR von 1,2 (Lücke zur '
                  'Marktmiete gestrichelt) | Spielraum in Jahr 1 (Herstellungskosten mit Marke beim ARGE-Median, Tilgungssatz). Kein Rot im Diagramm. ' + STAND),
}
schreibe(11, 'jahr-1', d11, s)

# ------------------------------------------------------------------ S. 12
s = Seite()
J = lambda g, j: f"'Gefördert {g}'!R{6 + j}"
a1, c1, a35, c35 = s.n(J('A', 1), wo='Verlauf'), s.n(J('C', 1), wo='Verlauf'), s.n(J('A', 35), wo='Verlauf'), s.n(J('C', 35), wo='Verlauf')
kdA, kdC = s.n(U('D111'), wo='Grund'), s.n(U('F111'), wo='Grund')
mC, mA = s.n(U('F26'), nk=2, wo='Grund'), s.n(U('D26'), nk=2, wo='Grund')
erh = s.n(Z('annahme.mieterhoehung_in_der_bindung'), 'prozent', 2, 'Annahmen')
ohne = s.k('n6.mietanpassung_gefoerdert_0.ek_vofi_mit_restwert.A', 'prozent', 2, 'Annahmen')
rA, rA0, rF, rF0 = (s.n(Z(k), 'prozent', 2, 'Rendite') for k in ('n5.ek_vofi_mit_restwert.A', 'n5.ek_vofi_ohne_restwert.A', 'n5.ek_vofi_mit_restwert.frei_markt', 'n5.ek_vofi_ohne_restwert.frei_markt'))
dF = s.n(Z('n5.dscr_jahr1.frei_markt'), nk=2, wo='Rendite')
T = lambda k: s.n(Z(k), 'tsd', 0, 'Vermögen')
vm = [['1', 'Projektkonto', T('n5.projektkonto_jahr35.A'), T('n5.projektkonto_jahr35.frei_markt')],
      ['2', '+ Restwert', T('n5.restwert_jahr35.A'), T('n5.restwert_jahr35.frei_markt')],
      ['3', '− Restschuld', T('n5.restschuld_jahr35.A'), T('n5.restschuld_jahr35.frei_markt')],
      ['4', '= Vermögen', T('n5.vermoegen_jahr35.A'), T('n5.vermoegen_jahr35.frei_markt')]]
vf = [['Eigenkapital bei Bezug', T('n5.eigenkapital.A'), T('n5.eigenkapital.frei_markt')],
      ['Anteil des Restwerts', s.n(Z('n5.restwertanteil.A'), 'prozent', 0, 'Vermögen') + ' %', s.n(Z('n5.restwertanteil.frei_markt'), 'prozent', 0, 'Vermögen') + ' %']]
anteil = s.n(f"{Z('n3.hoechstmiete.A')} / {Z('n2.marktmiete_jahr1')}", 'prozent', 0, 'Gründe')
bestand = s.frei('40,6', 'Bestand gebundener Wohnungen 2016 → 2025 (BT-Drs. 21/7303), wie Broschüre S. 3 und Präsentation Folie 6', 'Gründe')
zue1 = s.n(U('D38'), wo='Gründe'); z0 = s.n(Z('annahme.zins_nbank_bis_jahr35'), 'prozent', 0, 'Gründe'); zf = s.n(Z('annahme.zinsfreie_jahre'), wo='Gründe, Titel')
d12 = {
  'no': 12, 'slug': '35-jahre', 'layout_type': 'chart-focus',
  'running_title': 'Modellrechnung · 35 Jahre', 'kicker': 'Modellrechnung',
  'headline_light': f'Gruppe A und C über {zf} Jahre', 'headline': 'Kein Jahr mit Fehlbetrag',
  'blocks': [
    {'type': 'text', 'heading': 'Grund', 'bullets': [f'A: mehr Zuschuss, Kapitaldienst {kdA} € statt {kdC} € in C. Der Vorteil bleibt etwa gleich.',
                                                     f'C: Miete {mC} € statt {mA} €. Der Vorteil wächst mit jeder Mietanpassung.']},
    {'type': 'text', 'heading': 'Annahmen', 'bullets': [f'Miete alle drei Jahre +{erh} %, Höchstwert',
                                                        f'Ohne Mietanpassung bleibt in A in jedem Jahr ein Zahlungsüberschuss; die Eigenkapitalrendite sinkt dann auf {ohne} %.']},
    {'type': 'chart', 'chart': 'line', 'title': 'Zahlungsüberschuss je Jahr', 'unit': 'in € p. a.', 'legend': ['Gruppe A', 'Gruppe C'],
     'data': {'Jahr 1': {'A': a1, 'C': c1}, 'Jahr 35': {'A': a35, 'C': c35}, 'Marke': 'ab Jahr 10 liegt C vorn'}},
    {'type': 'chart', 'chart': 'grouped-bar', 'title': 'Eigenkapitalrendite über 35 Jahre', 'legend': ['mit Restwert', 'ohne'],
     'data': {'Gruppe A': {'mit Restwert': f'{rA} %', 'ohne': f'{rA0} %'}, 'Frei finanziert': {'mit Restwert': f'{rF} %', 'ohne': f'{rF0} %'}},
     'note': f'Vor Steuern. Frei finanziert rechnerisch, bei einer DSCR von {dF}; so gibt die Bank das Darlehen nicht (→ S. 10).'},
    {'type': 'table', 'role_hint': 'vermoegen', 'caption': 'Vermögen Ende Jahr 35, in Tsd. €', 'columns': ['', 'Position', 'A', 'Frei'], 'rows': vm, 'result_row': '4', 'footer_rows': vf,
     'note': (f'Restwert: Ertragswert Ende Jahr {zf} mit dem Liegenschaftszins von {s.frei("2026", "Stichtag des Liegenschaftszinses (Tabellen, Tabelle 4: Landesmodell 01.01.2026)", "Notiz Restwert")}, in Preisen des Jahres {zf}. '
              f'Nach der Bindung steigt die Miete in A um höchstens {s.frei("20", "Eingabe 4.6 Kappungsgrenze nach Bindungsende (Eingaben!F27), § 558 Abs. 3 Satz 1 BGB", "Notiz Restwert")} % in drei Jahren. '
              f'Mit {s.frei("15", "§ 2 Nr. 7 NMiSchuV vom 20.12.2024, gültig bis 31.12.2029 (pruefung-restwert/BERICHT.md, Befund 3)", "Notiz Restwert")} % wie heute in Neu Wulmstorf beträgt die Rendite '
              f'{s.frei("6,75", "Mappe neu berechnet mit Eingabe 4.6 = 15 %: Gefördert A I143 = 6,754 % (16.11.2026)", "Notiz Restwert")} %, mit dem halben Restwert '
              f'{s.frei("5,56", "Mappe neu berechnet mit Eingabe 9.4 = 0,5: Gefördert A I143 = 5,556 % (16.11.2026)", "Notiz Restwert")} %.')},
    {'type': 'reasons', 'heading': 'Vier Gründe für geförderten Mietwohnungsbau', 'items': [
      {'title': 'Planbare Mieterträge', 'text': f'Höchstmiete {mA} € in A, drei Jahre fest. Danach höchstens +{erh} % in drei Jahren.'},
      {'title': 'Gesicherte Nachfrage', 'text': f'Im Modellhaus liegt die Miete bei {anteil} % der Marktmiete. Bestand gebundener Wohnungen seit 2016 um {bestand} % gesunken.'},
      {'title': 'Neubau, der sonst nicht entsteht', 'text': f'Frei finanziert braucht das Haus {s.n(Z("n2.miete_dscr"), nk=2, wo="Gründe")} € Miete, der Markt zahlt {s.n(Z("n2.marktmiete_jahr1"), nk=2, wo="Gründe")} €.'},
      {'title': 'Liquidität über 35 Jahre', 'text': f'In A {zue1} € Zahlungsüberschuss in Jahr 1. Kein Jahr mit Fehlbetrag. Zins {z0} % für {zf} Jahre.'}]}],
  'footnotes': [], 'fact_ids': ALT['12']['fact_ids'],
  'visual_idea': ('Linke Seite der Doppelseite 12|13 (Heftmitte), weiß. H1 mit „Über 35 Jahre kein Jahr mit Fehlbetrag“ als zweite Stimme, Rot nur an „7,05 %“. '
                  'Band 1: Grund und Annahmen als Stichpunkte (4, außen) | Liniendiagramm Zahlungsüberschuss je Jahr A und C, Jahr 1 bis 35, mit Fläche '
                  'unter C, Werten Jahr 1 oben links, Marke bei Jahr 10 und Werten an den Linienenden (8, am Bund). Band 2: Eigenkapitalrendite mit '
                  'und ohne Restwert als Säulen (6) | Rechenblatt Vermögen Ende Jahr 35 in Tsd. € mit roter Ergebniszeile (6). Band 3: vier Gründe für '
                  'geförderten Mietwohnungsbau in vier Spalten, Wortlaut des Auftraggebers. ' + STAND),
}
schreibe(12, '35-jahre', d12, s)
