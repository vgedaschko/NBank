// LIESMICH.txt für das InDesign-Paket – alle Angaben aus den Daten des Exports (keine festen Beispiele)
const mm = (pt) => (pt / 72) * 25.4;
const de = (v, d = 1) => v.toFixed(d).replace('.', ',');
// Stichprobenseiten der Checkliste „Erster Test in InDesign“ (Kundenvorgabe; fehlende Seiten entfallen) – INDESIGN.md
const STICHPROBE = [1, 9, 11, 20, 24];
const clean = (s) => String(s || '').replace(/[\u00AD\uFEFF]/g, '').replace(/[\u2028\s]+/g, ' ').trim();

// Kurzbeschreibung einer Seite für die Stichprobe: Überschrift, Musterseite, Tabellen, Grafiken
function pageSummary(doc, model, n) {
  const pg = doc.pages[n - 1];
  if (!pg) return null;
  const items = pg.items || [];
  const paras = items.filter((i) => i.kind === 'text').flatMap((i) => i.frame.paras || []);
  // Überschrift: erste h1 (sonst h2) samt Blöcken darin (z. B. <span class="light"> als eigene Zeile)
  const st = (p) => (model.styles || [])[p.paraS] || {};
  const inH = (p, h) => st(p).tag === h || st(p).parentTag === h;
  const heading = (h) => {
    const i = paras.findIndex((p) => inH(p, h));
    if (i < 0) return '';
    let j = i;
    while (j < paras.length && inH(paras[j], h)) j++;
    const y = (p) => (p.lines && p.lines[0] ? p.lines[0].base : 0);   // Lesereihenfolge nach Grundlinie
    return clean(paras.slice(i, j).sort((a, b) => y(a) - y(b)).map((p) => p.text).join(' '));
  };
  let title = heading('h1') || heading('h2');
  if (title.length > 48) title = title.slice(0, 46).replace(/\s+\S*$/, '') + ' …';
  const ms = (doc.masterInfo || []).find((m) => m.pages.includes(n));
  const spread = n === 1 ? 0 : Math.floor(n / 2);
  const hidden = doc.master && doc.master.spreadsWithout && doc.master.spreadsWithout.has(spread);
  const nT = items.filter((i) => i.kind === 'table').length;
  const nG = items.filter((i) => i.kind === 'graphic').length;
  const bits = [];
  if (ms) bits.push(`Musterseite ${ms.name}${hidden ? ' (Musterobjekte ausgeblendet, Fuß auf der Seite)' : ''}`);
  if (nT) bits.push(nT === 1 ? '1 Tabelle' : `${nT} Tabellen`);
  if (nG) bits.push(nG === 1 ? '1 Grafik' : `${nG} Grafiken`);
  return { n, title, bits };
}

function liesmich({ name, doc, fonts, pkg, chk, model, opts, refName, date }) {
  const fams = new Map();
  fonts.faces.forEach((f) => { if (!fams.has(f.family)) fams.set(f.family, []); fams.get(f.family).push(f); });
  const fontLines = [...fams].map(([fam, fs]) => `  ${fam}: ${fs.map((f) => f.style).join(', ')}`).join('\n');
  const otherAxes = fonts.faces.filter((f) => Object.keys(f.axes).some((k) => k !== 'wght'));
  const opszFams = [...fams.keys()].filter((f) => / \d+(\.\d+)?pt$/.test(f));
  const n = model.pages.length;
  const spreads = ['[1]'];
  for (let i = 2; i <= n; i += 2) spreads.push(i + 1 <= n ? `[${i}|${i + 1}]` : `[${i}]`);
  const stand = (date || new Date()).toISOString().slice(0, 10);
  const HY = doc.hyphenation;
  const m = doc.margins;
  const isA4 = Math.abs(doc.W - 595.2756) < 0.05 && Math.abs(doc.H - 841.8898) < 0.05;
  const frames = doc.pages.flatMap((p) => p.items.filter((i) => i.kind === 'text'));
  const multiPara = frames.filter((f) => f.frame.paras.length > 1).length;
  const used = doc.swatches.filter((s) => s.used > 0).sort((a, b) => b.used - a.used);
  const unnamed = used.filter((s) => /^R=\d+ G=\d+ B=\d+$/.test(s.name));
  const swSample = used.filter((s) => !unnamed.includes(s)).slice(0, 6).map((s) => `„${s.name}“`).join(', ');
  const samples = STICHPROBE.map((p) => pageSummary(doc, model, p)).filter(Boolean);
  const tablePages = doc.pages.filter((p) => (p.items || []).some((i) => i.kind === 'table')).map((p) => p.number);
  const nPara = doc.paraStyles.length + (doc.baseStyles || []).length;
  const ref = refName ? `„${refName}“` : 'dem freigegebenen PDF';
  const subst = (doc.glyphs && doc.glyphs.substituted) || [];
  const masters = doc.masterInfo || [];
  const composer = doc.composer === 'HL Single' ? 'Adobe-Ein-Zeilen-Setzer' : 'Adobe-Absatzsetzer';
  const other = doc.composer === 'HL Single' ? 'Adobe-Absatzsetzer' : 'Adobe-Ein-Zeilen-Setzer';
  const lic = fonts.licenses || [];
  const autoFolio = doc.stats.autoFolio || 0;
  const st = doc.stats;
  const hasB = masters.some((x) => /^B-/.test(x.name));

  return `${name} – InDesign-Paket (IDML)
${'='.repeat(name.length + 25)}

Stand der Quelle: ${stand}. Erzeugt mit scripts/export-idml.cjs aus dem HTML-Layout (src/index.html).
Inhalt dieses Ordners:

  ${name}.idml
      InDesign-Dokument (öffnet ab InDesign CC 2020)
  Links/
      ${pkg.links.length} verknüpfte Vektorgrafiken (PDF): Diagramme, Illustrationen, Piktogramme, Icons, Logo,
      QR-Code sowie Flächen mit Verlauf oder Muster
  Document Fonts/
      ${fonts.faces.length} Schriftschnitte (TTF) für dieses Dokument${lic.length ? ` und die Lizenztexte (${lic.join(', ')})` : ''}
${refName ? `  ${refName}\n      das freigegebene PDF zum Vergleich (Stichprobe nach dem Öffnen)\n` : ''}  LIESMICH.txt
      diese Datei

Bitte den Ordner immer vollständig weitergeben (IDML, Links/ und Document Fonts/ nebeneinander).


1. ÖFFNEN
---------
1. Ordner lokal ablegen (nicht direkt aus dem ZIP oder einem Netzlaufwerk öffnen).
2. Schriften bereitstellen (siehe 2.), dann in InDesign Datei > Öffnen > ${name}.idml.
   InDesign legt ein neues, unbenanntes Dokument an.
3. Sofort als .indd IN DIESEN ORDNER sichern (Datei > Speichern unter). Danach findet InDesign die
   Verknüpfungen in Links/ und aktiviert die Schriften aus „Document Fonts“ beim nächsten Öffnen automatisch.
4. Verknüpfungen prüfen (Fenster > Verknüpfungen). Werden Grafiken als fehlend gemeldet: im Bedienfeld alle
   markieren > Bedienfeldmenü > „Erneut mit Ordner verknüpfen …“ > Ordner Links/ wählen.
5. Die Checkliste unter 6. durchgehen und das Ergebnis zurückmelden.

Aufbau: ${n} Seiten ${isA4 ? 'A4 ' : ''}(${de(mm(doc.W), 0)} × ${de(mm(doc.H), 0)} mm), Doppelseiten, Seite 1 rechts allein:
${spreads.join(' ')}
Beschnitt ${de(mm(doc.bleed), 0)} mm umlaufend; randabfallende Flächen und Grafiken reichen an den Außenkanten in den Beschnitt,
nie über den Bund.
Satzspiegel (Musterseite „A-Inhalt“ und Dokumentvorgabe): oben ${de(mm(m.top))} mm, unten ${de(mm(m.bottom))} mm, innen ${de(mm(m.left))} mm,
außen ${de(mm(m.right))} mm${doc.grid ? `, Spaltenraster ${doc.grid.count} Spalten à ${de(mm(doc.grid.col), 2)} mm mit ${de(mm(doc.grid.gutter))} mm Abstand` : ''}.

Musterseiten:
${masters.map((x) => `  „${x.name}“: ${x.note}`).join('\n')}
${autoFolio ? `Die Seitenzahl im Fuß ist die automatische Seitenzahl (Schrift > Sonderzeichen einfügen > Marken > Aktuelle
Seitenzahl); sie folgt beim Einfügen oder Verschieben von Seiten.` : 'Die Seitenzahl im Fuß ist fester Text.'}
${doc.stats.masterItems ? `Die gleichbleibenden Teile der Fußzeile (Linien, Logo, „Blatt“, Seitenzahl, Stand) liegen auf der Musterseite
„A-Inhalt“; seitenabhängige Teile (Projekttitel mit Rubrik) und das Programmteil-Register stehen auf den Seiten.
Beim Einfügen einer Seite mit „A-Inhalt“ erscheint die Fußzeile automatisch; die Rubrik von einer Nachbarseite
kopieren und anpassen.${hasB ? ` Seiten ohne die Standard-Fußzeile (z. B. mit eigener Fußzeile wie das Impressum)
tragen „B-Inhalt ohne Fuß“ – gleicher Satzspiegel, keine Musterobjekte.` : ''}` : 'Kolumnentitel, Logo und Register stehen als normale Objekte auf den Seiten.'}

Ebenen (von oben nach unten): Text · Grafiken · Hintergrund.
Wirken Flächen nach dem Öffnen über dem Text, die Ebenen im Bedienfeld „Ebenen“ in diese Reihenfolge ziehen.


2. SCHRIFTEN
------------
Die Broschüre verwendet variable Webschriften (SIL Open Font License 1.1). InDesign kann die Web-Dateien (WOFF2)
nicht nutzen; deshalb liegen in „Document Fonts“ statische Desktop-Schnitte, aus denselben Quelldateien mit fontTools
instanziiert und mit Familien-/Stilnamen, die exakt zu den Formaten im IDML passen:

${fontLines}

Verwendung: Beim Öffnen einer .indd aktiviert InDesign die Schnitte aus „Document Fonts“ neben dem Dokument
automatisch (nur für dieses Dokument). Beim ersten Öffnen der IDML kann InDesign sie noch als fehlend melden – dann
entweder die TTF-Dateien vorübergehend installieren oder wie unter 1.3 beschrieben als .indd in diesen Ordner sichern,
schließen und erneut öffnen.

Zuordnung CSS → Desktop: Zwischengewichte der Webfassung sind auf benannte Schnitte gerundet (nächstes Gewicht,
bei Gleichstand wie die CSS-Schriftauswahl, z. B. 650 → Bold, 560 → SemiBold, 340 → Light).${opszFams.length ? `
Die optische Größe (opsz) bestimmt die Familie (${opszFams.map((f) => `„${f}“`).join(', ')}).` : ''}${otherAxes.length ? `
Weitere Achsen sind je Schnitt auf den meistverwendeten Wert gesetzt:
${otherAxes.map((f) => `  ${f.family} ${f.style}: ${Object.entries(f.axes).filter(([k]) => k !== 'wght').map(([k, v]) => `${k} ${v}`).join(', ')}`).join('\n')}` : ''}
Die Schnitte sind Instanzen der variablen Quellschrift und können minimal von gleichnamigen offiziellen statischen
Schnitten abweichen; ist die offizielle Schrift installiert, verwendet InDesign für dieses Dokument trotzdem die
Schnitte aus „Document Fonts“.
Lizenz: SIL Open Font License 1.1${lic.length ? ` (Lizenztexte in „Document Fonts“: ${lic.join(', ')})` : ''}. Die Schriften dürfen mit dem
Dokument weitergegeben werden; die Lizenztexte müssen dabei beiliegen.
${subst.length ? `
Ersetzte Zeichen (in den Schnitten nicht vorhanden, im HTML von einer Systemschrift gesetzt):
${subst.map((e) => `  „${String.fromCodePoint(e.cp)}“ (U+${e.cp.toString(16).toUpperCase()}) → „${String.fromCodePoint(e.alt)}“ (U+${e.alt.toString(16).toUpperCase()}) in ${e.face}, S. ${[...e.pages].join(', ')}`).join('\n')}
` : ''}

3. AUFBAU DES DOKUMENTS
-----------------------
- Text: Jeder Textblock des HTML-Layouts ist ein Absatz in einem Textrahmen an der gemessenen Position.
  Absätze desselben Containers, die untereinander stehen und durch kein Objekt getrennt sind, teilen sich einen
  Rahmen (${multiPara} von ${frames.length} Rahmen enthalten mehrere Absätze; Listen- und Rasterbausteine sind meist
  Einzelrahmen, weil Linien, Marken oder Flächen dazwischen liegen). Mehrspaltiger Text steht in mehrspaltigen Rahmen.
  Die erste Grundlinie ist fest eingestellt (Textrahmenoptionen > Grundlinienoptionen > Versatz „Fest“), damit die
  Zeilen exakt wie im PDF stehen. Rahmen sind etwas höher (und einzeilige etwas breiter) als der Text, weil InDesign
  minimal anders misst; sie überlappen nachfolgende Elemente nicht.
- Zeilenfall: Setzer ist der ${composer} – er bricht wie der Browser Zeile für Zeile um, damit der Zeilenfall dem
  freigegebenen PDF entspricht. Mehrzeilige Überschriften und Labels haben feste Zeilenumbrüche (Umschalt+Eingabe) an
  den Stellen des PDFs. Für neuen Text kann im Absatzformat auf den ${other} umgestellt werden.${st.prettyParas ? `
  Im PDF sind die letzten Zeilen vieler Absätze ausgewogener umbrochen, als ein Zeile-für-Zeile-Setzer es täte
  (CSS „text-wrap: pretty“). In ${st.prettyParas} Absätzen stehen deshalb ab der ersten abweichenden Zeile feste
  Zeilenumbrüche (${st.prettyBreaks} insgesamt), davor bricht InDesign von selbst gleich. Wird in einem dieser Absätze Text
  geändert, die Umbrüche dort entfernen (Suchen/Ersetzen: „^n“ durch Leerzeichen).` : ''}
- Silbentrennung: wie im PDF. Getrennt wird an den bedingten Trennstrichen aus der HTML-Fassung (Wörter ab
  ${HY.wordsLongerThan + 1} Buchstaben, je ${HY.afterFirst} Zeichen vor/nach der Trennung); Absätze ohne solche Trennstellen (Überschriften,
  Labels, Kurztexte) haben die Silbentrennung aus. Bei bedingtem Trennstrich trennt InDesign das Wort nur dort.${st.protectedWords ? `
  Wörter, die im PDF nicht getrennt werden (keine Trennstelle oder bewusst geschützt, z. B. Fachbegriffe), haben
  einen unsichtbaren bedingten Trennstrich VOR dem Wort (${st.protectedWords} Wörter) – so trennt InDesign sie auch nicht nach
  Wörterbuch (sichtbar mit Schrift > Verborgene Zeichen einblenden).` : ''}
  Trennbereich 0 pt und Trennungen in Folge unbegrenzt (Absatzformat > Silbentrennung) sind Absicht: Der Browser
  kennt beides nicht; mit dem Standard-Trennbereich von 36 pt würde InDesign Wörter am Zeilenende in die nächste
  Zeile schieben statt sie zu trennen – anderer Zeilenfall und Übersatz in knappen Rahmen.
  In Formaten mit Silbentrennung trennt InDesign neuen Text automatisch (Deutsch 2006, Wörter ab ${HY.wordsLongerThan + 1} Buchstaben).
  Geschützte Leerzeichen (z. B. „80 %“, „§ 7“) bleiben erhalten.
- Formate: ${doc.paraStyles.length} Absatzformate und ${doc.charStyles.length} Zeichenformate, abgeleitet aus den CSS-Klassen des Designsystems
  (deutsche Namen, z. B. „Fließtext“, „Vorspann“, „Tabelle Kopf“). Varianten derselben Klasse tragen das
  unterscheidende Merkmal im Namen (z. B. „… 9 pt“, „… SemiBold“). Abweichende Abstände/Einzüge einzelner
  Absätze sind lokale Abweichungen (+).${(doc.mergedStyles || []).length ? `
  Formate mit gleichem Aussehen sind zusammengeführt (${doc.mergedStyles.length} Gruppen), z. B. ${doc.mergedStyles
    .slice().sort((x, y) => y.from.length - x.from.length).slice(0, 2).map((m) => `„${m.name}“ für ${m.from.filter((f) => f !== m.name).slice(0, 5).map((f) => `„${f}“`).join(', ')}${m.from.length > 6 ? ' u. a.' : ''}`).join('; ')}.` : ''}${(doc.baseStyles || []).length ? `
  Vererbung: Jedes Absatzformat basiert auf dem Basisformat seiner Schriftfamilie (${doc.baseStyles.map((b) => `„${b.name}“`).join(', ')})
  und enthält nur seine Abweichungen davon. Schriftfamilie, Sprache, Setzer und Silbentrennung lassen sich dort
  zentral ändern (z. B. Grundschrift tauschen: im Basisformat die Schriftfamilie ändern).` : ''}
- Farbfelder: nur die ${used.length} verwendeten Farben, benannt „Deutscher Name (Token des Designsystems)“, z. B.
  ${swSample}. Gleiche Farbwerte teilen sich ein Feld (z. B. Programmteil 2.1 = PGN-Rot).${unnamed.length ? `
  ${unnamed.length === 1 ? 'Eine Farbe ohne Token heißt' : `${unnamed.length} Farben ohne Token (Mischtöne einzelner Elemente) heißen`} wie in InDesign üblich nach dem Farbwert (${unnamed.map((s) => `„${s.name}“`).join(', ')}).` : ''}
  Alle Felder sind RGB wie in der HTML-Fassung (Umstellung für den Druck siehe 5.).
- Flächen und Linien: Hintergründe, Kästen, Rahmenlinien, Punkte und Häkchen als native Rechtecke, Ellipsen,
  Polygone und Linien (Kontur innen, Stärke in pt); Deckkraft über Transparenzeinstellungen.
- Tabellen: ${doc.stats.tables} native InDesign-Tabellen (Kopfzeilen, Spaltenbreiten, Zeilenhöhen, Zellabstände, Linien und
  Flächen je Zelle). Zeilen wachsen bei Bedarf automatisch. Icons und Badges in Zellen liegen als eigene Objekte darüber.${st.hangCells ? `
  Rechenzeilen mit vorangestelltem Zeichen („−“, „+“, „=“) haben einen hängenden Einzug (Einzug links und negativer
  Erstzeileneinzug, ${st.hangCells} Zellen); die Breite des Zeichens ist als Laufweite freigehalten.` : ''}${st.widenedTables ? `
  Läuft ein unteilbarer Kopf im Layout über seine Zelle hinaus (z. B. ein Wort in Versalien), ist in ${st.widenedTables === 1 ? 'einer Tabelle' : `${st.widenedTables} Tabellen`}
  eine schmale Hilfsspalte eingefügt, die nur in dieser Zeile zur Kopfzelle gehört und in allen anderen Zeilen mit der
  Nachbarzelle verbunden ist – das Aussehen bleibt gleich, InDesign bricht das Wort nicht um.` : ''}
- Grafiken: Jedes Inline-SVG ist als eigenständiges Vektor-PDF verknüpft (Links/, relativ verknüpft); ragen
  Beschriftungen im Layout über die Grafikbox hinaus, ist der Grafikrahmen entsprechend größer. Texte in
  Diagrammen sind Teil der Grafik (in Illustrator bearbeitbar, Schrift eingebettet). Identische Grafiken teilen sich
  eine Datei. Flächen mit CSS-Verlauf, Muster oder Schraffur sind ebenfalls als PDF verknüpft (Ebene „Hintergrund“).


4. BEKANNTE GRENZEN
-------------------
- Verankerung: Objekte sind nicht im Text verankert. Seitenverweis-Flächen, Aufzählungsquadrate, Checkboxen,
  Farbmarken und Inline-Icons liegen als eigene Objekte an der Stelle des Textes; der Platz dafür ist im Text als
  Laufweite freigehalten. Wird Text umgestellt, diese Objekte von Hand nachziehen.
- ${doc.stats.masterItems ? 'Rubrik (Kolumnentitel) und Programmteil-Register sind Objekte je Seite (seitenabhängiger Inhalt).' : 'Kolumnentitel, Logo und Register sind normale Objekte je Seite (nicht auf der Musterseite).'}
- Hyperlinks und Querverweise der PDF-Fassung sind nicht als InDesign-Hyperlinks angelegt (Text bleibt erhalten).
- Barrierefreiheit (Tags, Alternativtexte, Lesereihenfolge) ist im IDML nicht übertragen.
- Diagrammtexte sind nicht als InDesign-Text editierbar (Grafik-PDF in Illustrator bearbeiten oder Text darüberlegen).
- Für die Prüfung ohne InDesign wurden Struktur, IDs, Verweise, Glyphen und Rahmenbreiten automatisch kontrolliert
  und das Paket mit Scribus 1.6 importiert. Einige Attribute sind nur aus der IDML-Spezifikation bekannt und beim
  ersten Öffnen in InDesign zu kontrollieren: platzierte PDFs (Beschnitt „Medienrahmen“), feste erste Grundlinie,
  Tabellenlinien, abgerundete Ecken, Ein-Zeilen-Setzer mit Trennbereich 0, bedingter Trennstrich vor einem Wort
  (verhindert dessen Trennung), Formatvererbung (Basisformate), Musterseite mit automatischer Seitenzahl, „Spalten
  ausgleichen“ in mehrspaltigen Rahmen, Reihenfolge der Ebenen. Die Checkliste unter 6. deckt diese Punkte ab.
- Der Zeilenfall kann an einzelnen Stellen minimal vom PDF abweichen (InDesign misst Schrift etwas anders als der
  Browser); Rahmen haben dafür eine kleine Reserve. Abweichungen bitte mit der Checkliste melden.


5. WEITERARBEIT – HINWEISE FÜR DIE AGENTUR
------------------------------------------
- Schriften: die Schnitte aus „Document Fonts“ aktivieren (als .indd in diesem Ordner sichern, siehe 1.3) oder
  installieren. Nicht ungeprüft durch gleichnamige offizielle Schnitte ersetzen: Metriken können minimal abweichen,
  dann ändert sich der Zeilenfall (Übersatz prüfen).
- Verknüpfungen: Links/ bleibt neben der .indd. Grafik ändern: Datei aus Links/ in Illustrator öffnen und sichern,
  InDesign aktualisiert die Verknüpfung (Bedienfeld Verknüpfungen). Für die Weitergabe Datei > Verpacken verwenden.
- Farbfelder für den Druck umstellen (Farbfeld doppelklicken > Farbmodus/Farbtyp): Grau- und Schwarztöne für Text
  und Haarlinien als reine Schwarz-Tonwerte (K), sonst werden sie vierfarbig aufgebaut; PGN-Rot und die
  Programmteil-Farben nach den CI-Vorgaben des Kunden (CMYK oder Pantone/HKS als Volltonfarbe). Die verknüpften
  Grafik-PDFs enthalten RGB-Farben: bei der PDF/X-Ausgabe werden sie konvertiert; exakte Volltöne in Illustrator setzen.
- Preflight: Fenster > Ausgabe > Preflight, am besten mit dem Profil der Druckerei (z. B. PDF/X-4). Ausgabe über
  Datei > Exportieren > Adobe PDF (Druck) mit „Anschnitteinstellungen des Dokuments verwenden“ (${de(mm(doc.bleed), 0)} mm).
- Textkorrekturen: In geänderten Absätzen feste Zeilenumbrüche („^n“) entfernen und den Zeilenfall neu prüfen; für
  längere neue Texte im Absatzformat auf den ${other} umstellen.
- Format-Ordnung: Die Formate liegen nicht in Formatgruppen (Ordnern), sind aber durch gemeinsame Namensanfänge
  sortiert („Tabelle …“, „Kennzahl …“, „Titelseite …“). Ordner nach Wunsch: Formate markieren > Bedienfeldmenü >
  „Neue Gruppe aus Formaten …“.


6. ERSTER TEST IN INDESIGN – CHECKLISTE MIT RÜCKMELDUNG
-------------------------------------------------------
Bitte nach dem ersten Öffnen durchgehen und je Punkt „ok“ oder die Abweichung zurückmelden (mit Screenshot).
Immer angeben: InDesign-Version (Hilfe bzw. InDesign > Über InDesign) und Betriebssystem.

[ ] 1. Öffnen: Öffnet ${name}.idml ohne Fehlermeldung oder Warnung?
       Zurückmelden: Wortlaut jeder Meldung (Screenshot), ungefähre Dauer des Öffnens.
[ ] 2. Fehlende Schriften: Schrift > Schriftart suchen – fehlt ein Schnitt, sind Textstellen rosa hinterlegt?
       Erwartet: ${fonts.faces.length} Schnitte (${[...fams.keys()].join(', ')}), nach 1.3 bzw. Installation keiner fehlend.
       Zurückmelden: Namen fehlender Schnitte; ob „Document Fonts“ oder die Installation geholfen hat.
[ ] 3. Fehlende Verknüpfungen: Fenster > Verknüpfungen – ${pkg.links.length} Dateien, keine mit Fragezeichen- oder Warnsymbol?
       Zurückmelden: Anzahl fehlender/geänderter Dateien; ob „Erneut mit Ordner verknüpfen …“ (Links/) geholfen hat.
[ ] 4. Seitenzahl und Doppelseiten: Fenster > Seiten – ${n} Seiten in ${pkg.spreads} Druckbögen ${spreads[0]} ${spreads[1] || ''} … ${spreads[spreads.length - 1]},
       Musterseiten wie unter 1., automatische Seitenzahl im Fuß stimmt mit der Seite überein?
       Zurückmelden: abweichende Seitenzahl, Anordnung oder Musterseite.
[ ] 5. Stichproben gegen ${ref} (Ansicht 100–200 %, Vorschaumodus W):
${samples.map((s) => `       S. ${String(s.n).padEnd(3)}${s.title ? `„${s.title}“` : ''}${s.bits.length ? `${s.title ? ' – ' : ''}${s.bits.join(', ')}` : ''}`).join('\n')}
       Achten auf: Lage von Text, Flächen und Grafiken; Zeilenfall und Trennungen; Text liegt über den Flächen;
       Grafiken vollständig und scharf (Ansicht > Anzeigeleistung > Anzeige mit hoher Qualität).
       Zurückmelden: Seite, Stelle, Screenshot InDesign neben dem PDF (Verschiebung möglichst in mm).
[ ] 6. Formate und Farbfelder: Fenster > Formate > Absatz-/Zeichenformate, Fenster > Farbe > Farbfelder –
       ${nPara} Absatzformate (davon ${(doc.baseStyles || []).length} Basisformate), ${doc.charStyles.length} Zeichenformate, ${used.length} Farbfelder mit deutschen Namen?
       Stichprobe: in einen Fließtext klicken – Formatname ohne „+“ (keine Abweichung)?
       Zurückmelden: fehlende oder doppelte Formate, auffällig viele „+“, Farbfelder ohne Namen.
[ ] 7. Übersatz: Fenster > Ausgabe > Preflight ([Grundprofil]) – Übersatztext 0? Keine roten Pluszeichen an Textrahmen?
       Zurückmelden: Preflight-Liste mit Seiten (Screenshot des Bedienfelds).
[ ] 8. Tabellen bearbeitbar: in eine Zelle klicken (Tabellen auf S. ${tablePages.join(', ')}), Text ändern, Tabelle > Einfügen > Zeile –
       verhält sich alles wie eine normale InDesign-Tabelle, stimmen Linien, Flächen und Spaltenbreiten?
       Zurückmelden: ob bearbeitbar; Abweichungen bei Linien, Flächen, Spaltenbreiten (Seite, Screenshot).
[ ] 9. Sichern und erneut öffnen: als .indd in diesen Ordner sichern, schließen, wieder öffnen – Schriften und
       Verknüpfungen weiterhin vollständig?
       Zurückmelden: ja/nein; sonst die Meldung.

Technische Angaben: DOM-Version 15.0, ${chk.stats.selfs} Objekt-IDs, ${pkg.stories} Textabschnitte, ${pkg.spreads} Druckbögen,
Selbstprüfung: ${chk.errors.length ? chk.errors.length + ' Fehler' : 'ohne Fehler'}.
`;
}

module.exports = { liesmich };
