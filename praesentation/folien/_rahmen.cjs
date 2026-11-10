// Hilfsfunktionen der Baugruppe „rahmen“, die nur die Quellenfolie A9 braucht. Kein Folienmodul: build.cjs lädt nur folien/<id>.cjs.
//   bereiche      Blattnummern zusammenfassen („8–15“, „4, A8“)
//   quellenZeilen Zeilen der Quellentabelle aus daten/rahmen.json; Blattnummern aus dem Feld „quellen“ aller Folien des Konzepts
// Allgemeine Helfer (Wortlautprobe, Texthöhe, Hinweis-Kasten) stehen in lib/: ctx.wortlaut, B.hoehe, B.hinweisKasten.
'use strict';

// Blattnummern in der Reihenfolge des Konzepts zusammenfassen: drei und mehr aufeinanderfolgende Blätter als Bereich mit Halbgeviertstrich,
// Hauptteil und Anhang getrennt. ids: Folien-IDs; folien: Folienliste des Konzepts.
function bereiche(ids, folien) {
  const lage = new Map(folien.map((f, i) => [f.id, i]));
  const reihe = [...ids].sort((a, b) => lage.get(a) - lage.get(b)).map(id => folien[lage.get(id)]);
  const anhang = f => /^A/.test(String(f.nr));
  const gruppen = [];
  for (const f of reihe) {
    const g = gruppen[gruppen.length - 1], letzte = g && g[g.length - 1];
    if (letzte && lage.get(f.id) === lage.get(letzte.id) + 1 && anhang(f) === anhang(letzte)) g.push(f); else gruppen.push([f]);
  }
  return gruppen.map(g => (g.length >= 3 ? `${g[0].nr}–${g[g.length - 1].nr}` : g.map(f => f.nr).join(', '))).join(', ');
}

// Zeilen der Quellentabelle: [{ folien, text, ids }]. Eine Folie zählt zu einer Zeile, wenn ihre Quellenzeile eine Kennung der Zeile enthält;
// Rahmenfolien (Titel, Trenner, Schluss) zählen nicht. „folien“ in der Datendatei setzt die Bezeichnung fest („alle“).
// Geprüft wird: Jeder Teil jeder Quellenzeile des Konzepts gehört zu einer Tabellenzeile oder zu den Teilen ohne Zeile (Verweise auf die
// Broschüre, Bildnachweis); jede Tabellenzeile hat mindestens eine Folie; Text und Blattnummern stehen so im Konzept der Folie.
function quellenZeilen(ctx) {
  const { X, P, W, outline, glatt } = ctx, Q = k => X('rahmen', 'quellen.' + k), gross = t => glatt(t).toLocaleUpperCase('de-DE');
  const rahmenfolien = new Set(Q('rahmenfolien')), ohne = Q('ohne_zeile'), zeilen = Q('zeilen');
  const meta = W.meta(), version = (String(meta.mappe).match(/_(v\d+)\.xlsx$/) || [])[1], stand = (String(meta.mappe_stand).match(/Stand (\d{2}\/\d{4})/) || [])[1];
  if (!version || !stand) throw new Error(`Quellen: Version oder Stand der Mappe nicht lesbar (werte.json meta.mappe „${meta.mappe}“, meta.mappe_stand „${meta.mappe_stand}“).`);
  // Vollständigkeit: kein Teil einer Quellenzeile ohne Tabellenzeile. Teile trennt ein Semikolon oder ein Satzende (Punkt vor Großbuchstabe,
  // außer nach Abkürzungen wie „Nds.“, „Nr.“, „S.“, „Dr.“)
  const kennungen = zeilen.flatMap(z => z.kennung), TEILER = /;\s*|(?<!\b(?:Nds|MBl|Nr|Abs|Abb|RdErl|Dr|S|d|v|V))\.\s+(?=[A-ZÄÖÜ])/;
  for (const f of outline.folien) {
    for (const teil of String(f.quellen || '').replace(/^Quellen?:\s*/, '').split(TEILER).map(t => t.trim()).filter(Boolean)) {
      if (![...kennungen, ...ohne].some(k => teil.includes(k))) P.melde(`Quellen: „${teil}“ (Folie ${f.nr}, ${f.id}) gehört zu keiner Zeile der Quellentabelle. Zeile oder Kennung in daten/rahmen.json ergänzen.`);
    }
  }
  return zeilen.map(z => {
    const text = ctx.fuelle(z.angaben.map(k => Q('angaben.' + k)).join('; '), { version, stand }, 'daten/rahmen.json');
    const ids = outline.folien.filter(f => !rahmenfolien.has(f.layout) && z.kennung.some(k => String(f.quellen || '').includes(k))).map(f => f.id);
    if (!ids.length) P.melde(`Quellen: Keine Folie nennt „${z.kennung.join('“ oder „')}“; die Zeile „${text.slice(0, 60)}…“ stünde ohne Blattnummer.`);
    const folien = z.folien || bereiche(ids, outline.folien);
    ctx.wortlaut(text, 'Quellentabelle');
    if (!gross(ctx.o.inhalt).includes(gross(`„${folien}“ · „${text}“`))) P.hinweis(`Quellentabelle: Blattnummern „${folien}“ für „${text.slice(0, 50)}…“ weichen vom Konzept ab (gerechnet aus den Quellenzeilen der Folien).`);
    return { folien, text, ids };   // die Fundstelle „Nds. MBl. 2026 Nr. 319“ hält die Bibliothek zusammen (schutz)
  });
}

module.exports = { bereiche, quellenZeilen };
