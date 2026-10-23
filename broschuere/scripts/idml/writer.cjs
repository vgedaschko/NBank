// IDML-Teildateien aus dem Dokumentmodell (build.cjs) schreiben.
// Koordinaten: Spread-Ursprung am Bund, y = 0 auf halber Seitenhöhe (siehe idml-notes.md, Abschnitt 9 und 12).
const { HDR, NS, esc, num, attrs, el } = require('./xml.cjs');

const LINK_PDF = '$ID/Adobe Portable Document Format (PDF)';
const KAPPA = 0.5522847498;

function writeIdml(doc, opts = {}) {
  const DOM = opts.domVersion || '15.0';
  const W = doc.W, H = doc.H;
  const files = {};
  let n = 0x100;
  const id = () => 'u' + (n++).toString(16);

  // ---- Ebenen (Reihenfolge in designmap.xml = Ebenenbedienfeld von oben nach unten) -----------------------------
  const LAYERS = [
    { key: 'Text', name: 'Text', color: 'Blue' },
    { key: 'Grafiken', name: 'Grafiken', color: 'Green' },
    { key: 'Hintergrund', name: 'Hintergrund', color: 'Red' },
  ].map((l) => ({ ...l, self: id() }));
  if (opts.layerOrder === 'bottom-first') LAYERS.reverse();
  const layerSelf = Object.fromEntries(LAYERS.map((l) => [l.key, l.self]));

  // ---- Geometrie-Helfer -----------------------------------------------------------------------------------------
  const pathXml = (pts, open = false) => '<Properties><PathGeometry><GeometryPathType PathOpen="' + (open ? 'true' : 'false') + '"><PathPointArray>' +
    pts.map((p) => {
      const a = `${num(p[0])} ${num(p[1])}`;
      const l = p[2] ? `${num(p[2][0])} ${num(p[2][1])}` : a;
      const r = p[3] ? `${num(p[3][0])} ${num(p[3][1])}` : a;
      return `<PathPointType Anchor="${a}" LeftDirection="${l}" RightDirection="${r}"/>`;
    }).join('') + '</PathPointArray></GeometryPathType></PathGeometry></Properties>';
  const rectPts = (w, h) => [[0, 0], [0, h], [w, h], [w, 0]];
  const ovalPts = (w, h) => {
    const kx = (w / 2) * KAPPA, ky = (h / 2) * KAPPA;
    return [
      [0, h / 2, [0, h / 2 + ky], [0, h / 2 - ky]],
      [w / 2, 0, [w / 2 - kx, 0], [w / 2 + kx, 0]],
      [w, h / 2, [w, h / 2 - ky], [w, h / 2 + ky]],
      [w / 2, h, [w / 2 + kx, h], [w / 2 - kx, h]],
    ].map(([x, y, l, r]) => [x, y, l, r]);
  };
  // seitenrelative Lage → ItemTransform im Spread (optional mit linearer Matrix um den Kastenmittelpunkt)
  const xform = (page, x, y, w, h, M) => {
    const dx = page.left ? -W : 0, dy = -H / 2;
    if (!M) return `1 0 0 1 ${num(x + dx)} ${num(y + dy)}`;
    const [a, b, c, d] = M;
    const cx = x + w / 2, cy = y + h / 2;
    const tx = cx - (a * w / 2 + c * h / 2) + dx, ty = cy - (b * w / 2 + d * h / 2) + dy;
    return `${num(a, 6)} ${num(b, 6)} ${num(c, 6)} ${num(d, 6)} ${num(tx)} ${num(ty)}`;
  };
  const strokeType = (style) => (style === 'dashed' ? 'StrokeStyle/$ID/Dashed' : style === 'dotted' ? 'StrokeStyle/$ID/Canned Dotted' : style === 'double' ? 'StrokeStyle/$ID/ThinThin' : 'StrokeStyle/$ID/Solid');
  const transparency = (opacity, fillAlpha, strokeAlpha) => {
    let x = '';
    if (opacity !== undefined && opacity < 0.995) x += `<TransparencySetting><BlendingSetting BlendMode="Normal" Opacity="${num(opacity * 100, 1)}"/></TransparencySetting>`;
    if (strokeAlpha !== undefined && strokeAlpha > 0 && strokeAlpha < 0.995) x += `<StrokeTransparencySetting><BlendingSetting BlendMode="Normal" Opacity="${num(strokeAlpha * 100, 1)}"/></StrokeTransparencySetting>`;
    if (fillAlpha !== undefined && fillAlpha > 0 && fillAlpha < 0.995) x += `<FillTransparencySetting><BlendingSetting BlendMode="Normal" Opacity="${num(fillAlpha * 100, 1)}"/></FillTransparencySetting>`;
    return x;
  };
  const corners = (radii) => {
    if (!radii || !radii.some((r) => r > 0.01)) return [];
    const names = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'];
    const out = [];
    radii.forEach((r, i) => {
      out.push([`${names[i]}CornerOption`, r > 0.01 ? 'RoundedCorner' : 'None']);
      out.push([`${names[i]}CornerRadius`, num(r > 0.01 ? r : 0)]);
    });
    return out;
  };

  // ---- Text: Läufe & Absätze ------------------------------------------------------------------------------------
  const PARA_ONLY = new Set(['Justification', 'Hyphenation', 'FirstLineIndent', 'LeftIndent', 'RightIndent', 'SpaceBefore', 'SpaceAfter', 'KeepAllLinesTogether', 'DropCapLines', 'DropCapCharacters', 'StartParagraph']);
  const textAttrs = (a) => {
    const at = [], props = [];
    for (const [k, v] of Object.entries(a)) {
      if (v === undefined) continue;
      if (k === 'AppliedFont') { props.push(`<AppliedFont type="string">${esc(v)}</AppliedFont>`); continue; }
      if (k === 'Leading') { props.push(`<Leading type="unit">${num(v)}</Leading>`); continue; }
      if (k === 'AppliedLanguage') { at.push([k, v]); continue; }
      if (k === 'KeepAllLinesTogether') { at.push(['KeepLinesTogether', v ? 'true' : 'false']); at.push([k, v ? 'true' : 'false']); continue; }
      at.push([k, typeof v === 'boolean' ? (v ? 'true' : 'false') : v]);
    }
    return { at, props };
  };
  const NOCS = 'CharacterStyle/$ID/[No character style]';
  const contentXml = (t) => {
    // Inhalt; erzwungener Zeilenumbruch U+2028 und weicher Trennstrich U+00AD bleiben als Zeichen (InDesign:
    // „Harter Zeilenumbruch“ bzw. „Bedingter Trennstrich“), Platzhalter U+E018 → automatische Seitenzahl
    return `<Content>${esc(t).replace(/\uE018/g, '<?ACE 18?>')}</Content>`;
  };
  // Absatzattribute am ParagraphStyleRange, Zeichenattribute (inkl. Zeilenabstand) an jedem CharacterStyleRange
  const paraXml = (p, isLast) => {
    const pOver = {}, cOver = {};
    for (const [k, v] of Object.entries(p.over || {})) {
      if (PARA_ONLY.has(k)) pOver[k] = v; else cOver[k] = v;
      if (k === 'Leading') pOver[k] = v;
    }
    const { at, props } = textAttrs(pOver);
    let x = `<ParagraphStyleRange${attrs([['AppliedParagraphStyle', p.style.self], ...at])}>`;
    if (props.length) x += `<Properties>${props.join('')}</Properties>`;
    p.fruns.forEach((r, i) => {
      const loc = { ...cOver, ...(r.cstyle ? Object.fromEntries(Object.keys(r.cstyle.attrs).map((k) => [k, undefined])) : {}), ...(r.local || {}) };
      Object.keys(loc).forEach((k) => loc[k] === undefined && delete loc[k]);
      const { at: ca, props: cp } = textAttrs(loc);
      x += `<CharacterStyleRange${attrs([['AppliedCharacterStyle', r.cstyle ? r.cstyle.self : NOCS], ...ca])}>`;
      if (cp.length) x += `<Properties>${cp.join('')}</Properties>`;
      x += contentXml(r.text);
      if (i === p.fruns.length - 1 && !isLast) x += '<Br/>';
      x += '</CharacterStyleRange>';
    });
    return x + '</ParagraphStyleRange>';
  };
  const storyXml = (self, inner) => HDR + `<idPkg:Story ${NS} DOMVersion="${DOM}"><Story Self="${self}" UserText="true" IsEndnoteStory="false" AppliedTOCStyle="n" TrackChanges="false" StoryTitle="$ID/" AppliedNamedGrid="n">` +
    '<StoryPreference OpticalMarginAlignment="false" OpticalMarginSize="12" FrameType="TextFrameType" StoryOrientation="Horizontal" StoryDirection="LeftToRightDirection"/>' +
    '<InCopyExportOption IncludeGraphicProxies="true" IncludeAllResources="false"/>' + inner + '</Story></idPkg:Story>\n';

  // ---- Tabellen -------------------------------------------------------------------------------------------------
  const tableXml = (t) => {
    const tid = id();
    const body = t.nrow - t.header - t.footer;
    let x = `<Table${attrs([['Self', tid], ['HeaderRowCount', t.header], ['FooterRowCount', t.footer], ['BodyRowCount', body], ['ColumnCount', t.ncol],
      ['AppliedTableStyle', 'TableStyle/$ID/[Basic Table]'], ['TableDirection', 'LeftToRightDirection'],
      ['SpaceBefore', 0], ['SpaceAfter', 0],
      ['TopBorderStrokeWeight', 0], ['BottomBorderStrokeWeight', 0], ['LeftBorderStrokeWeight', 0], ['RightBorderStrokeWeight', 0],
      ['TopBorderStrokeColor', 'Swatch/None'], ['BottomBorderStrokeColor', 'Swatch/None'], ['LeftBorderStrokeColor', 'Swatch/None'], ['RightBorderStrokeColor', 'Swatch/None'],
      ['StartRowStrokeCount', 1], ['StartRowStrokeWeight', 0], ['StartRowStrokeColor', 'Swatch/None'],
      ['StartColumnStrokeCount', 1], ['StartColumnStrokeWeight', 0], ['StartColumnStrokeColor', 'Swatch/None']])}>`;
    for (let r = 0; r < t.nrow; r++) x += `<Row Self="${tid}Row${r}" Name="${r}" SingleRowHeight="${num(t.rowH[r])}" MinimumHeight="${num(t.rowH[r])}" AutoGrow="true"/>`;
    for (let c = 0; c < t.ncol; c++) x += `<Column Self="${tid}Column${c}" Name="${c}" SingleColumnWidth="${num(t.colW[c])}"/>`;
    const cells = t.cells.slice().sort((a, b) => a.col - b.col || a.row - b.row);
    for (const c of cells) {
      const edge = (e) => (e ? [num(e.w), e.ref, strokeType(e.style)] : ['0', 'Swatch/None', 'StrokeStyle/$ID/Solid']);
      const [tw, tc, tt] = edge(c.edgesW.top), [bw, bc, bt] = edge(c.edgesW.bottom), [lw, lc, lt] = edge(c.edgesW.left), [rw, rc, rt] = edge(c.edgesW.right);
      const a = [['Self', `${tid}i${c.col}_${c.row}`], ['Name', `${c.col}:${c.row}`], ['RowSpan', c.rowSpan], ['ColumnSpan', c.colSpan],
        ['AppliedCellStyle', 'CellStyle/$ID/[None]'], ['AppliedCellStylePriority', 0],
        ['TopInset', num(c.inset.t)], ['LeftInset', num(c.inset.l)], ['BottomInset', num(c.inset.b)], ['RightInset', num(c.inset.r)],
        ['FillColor', c.fillW ? c.fillW.ref : 'Swatch/None'], ['FillTint', c.fillW ? 100 : -1],
        ['VerticalJustification', 'TopAlign'],
        ['TopEdgeStrokeWeight', tw], ['TopEdgeStrokeColor', tc], ['TopEdgeStrokeType', tt], ['TopEdgeStrokeTint', 100],
        ['BottomEdgeStrokeWeight', bw], ['BottomEdgeStrokeColor', bc], ['BottomEdgeStrokeType', bt], ['BottomEdgeStrokeTint', 100],
        ['LeftEdgeStrokeWeight', lw], ['LeftEdgeStrokeColor', lc], ['LeftEdgeStrokeType', lt], ['LeftEdgeStrokeTint', 100],
        ['RightEdgeStrokeWeight', rw], ['RightEdgeStrokeColor', rc], ['RightEdgeStrokeType', rt], ['RightEdgeStrokeTint', 100]];
      if (c.firstBaseline !== undefined) { a.push(['FirstBaselineOffset', 'FixedHeight']); a.push(['MinimumFirstBaselineOffset', num(Math.max(0, c.firstBaseline))]); }
      x += `<Cell${attrs(a)}>`;
      if (c.paras.length) c.paras.forEach((p, i) => { x += paraXml(p, i === c.paras.length - 1); });
      else x += `<ParagraphStyleRange AppliedParagraphStyle="${doc.cellEmptyStyle}"><CharacterStyleRange AppliedCharacterStyle="${NOCS}"/></ParagraphStyleRange>`;
      x += '</Cell>';
    }
    return x + '</Table>';
  };

  // ---- Seitenobjekte ----------------------------------------------------------------------------------------------
  const stories = [];
  const links = [];
  const itemXml = (page, it) => {
    const self = id();
    const L = layerSelf[it.layer] || layerSelf.Hintergrund;
    const name = it.name ? String(it.name).slice(0, 60) : '$ID/';
    if (it.kind === 'shape' || it.kind === 'line') {
      const fill = it.fill || { ref: 'Swatch/None', alpha: 0 };
      const st = it.stroke;
      const base = [['Self', self], ['ContentType', 'Unassigned'], ['StoryTitle', '$ID/'], ['ItemLayer', L],
        ['FillColor', it.kind === 'line' ? 'Swatch/None' : fill.ref], ['FillTint', -1],
        ['StrokeColor', st ? st.ref : 'Swatch/None'], ['StrokeWeight', st ? num(st.w) : 0], ['StrokeTint', -1],
        ['StrokeType', st ? strokeType(st.style) : 'StrokeStyle/$ID/Solid'],
        ['AppliedObjectStyle', 'ObjectStyle/$ID/[None]'], ['Visible', 'true'], ['Locked', 'false'], ['Name', name]];
      let tag, pts, open = false, xf;
      if (it.kind === 'line') {
        tag = 'GraphicLine';
        pts = [[it.x1, it.y1], [it.x2, it.y2]];
        open = true;
        base.push(['EndCap', it.cap || 'ButtEndCap']);
        xf = xform(page, it.x, it.y, it.w, it.h, it.M);
      } else {
        tag = it.shape === 'oval' ? 'Oval' : it.shape === 'polygon' ? 'Polygon' : 'Rectangle';
        pts = it.shape === 'oval' ? ovalPts(it.w, it.h) : it.shape === 'polygon' ? it.points.map((p) => [p[0], p[1]]) : rectPts(it.w, it.h);
        if (st) base.push(['StrokeAlignment', st.align || 'InsideAlignment']);
        if (tag === 'Rectangle') base.push(...corners(it.radii));
        xf = xform(page, it.x, it.y, it.w, it.h, it.M);
      }
      base.push(['ItemTransform', xf]);
      const wrap = it.wrap ? '<TextWrapPreference Inverse="false" ApplyToMasterPageOnly="false" TextWrapSide="BothSides" TextWrapMode="BoundingBoxTextWrap"><Properties><TextWrapOffset Top="0" Left="0" Bottom="0" Right="0"/></Properties></TextWrapPreference>' : '';
      return `<${tag}${attrs(base)}>${pathXml(pts, open)}${transparency(it.opacity, fill.alpha, st ? st.alpha : undefined)}${wrap}</${tag}>`;
    }
    if (it.kind === 'graphic') {
      const pid = id(), lid = id();
      links.push(it.link);
      const c = it.content;
      return `<Rectangle${attrs([['Self', self], ['ContentType', 'GraphicType'], ['StoryTitle', '$ID/'], ['ItemLayer', L], ['FillColor', 'Swatch/None'], ['StrokeColor', 'Swatch/None'], ['StrokeWeight', 0],
        ['AppliedObjectStyle', 'ObjectStyle/$ID/[None]'], ['Visible', 'true'], ['Locked', 'false'], ['Name', name], ['ItemTransform', xform(page, it.x, it.y)]])}>` +
        pathXml(rectPts(it.w, it.h)) +
        '<FrameFittingOption AutoFit="false" LeftCrop="0" TopCrop="0" RightCrop="0" BottomCrop="0" FittingOnEmptyFrame="None" FittingAlignment="TopLeftAnchor"/>' +
        `<PDF${attrs([['Self', pid], ['ImageTypeName', LINK_PDF], ['AppliedObjectStyle', 'ObjectStyle/$ID/[None]'], ['ItemTransform', `1 0 0 1 ${num(c.dx)} ${num(c.dy)}`], ['Visible', 'true'], ['Name', '$ID/']])}>` +
        `<Properties><GraphicBounds Left="0" Top="0" Right="${num(c.w)}" Bottom="${num(c.h)}"/></Properties>` +
        '<PDFAttribute PageNumber="1" PDFCrop="CropMedia" TransparentBackground="true"/>' +
        `<Link${attrs([['Self', lid], ['AssetURL', '$ID/'], ['AssetID', '$ID/'], ['LinkResourceURI', 'file:' + it.link], ['LinkResourceFormat', LINK_PDF],
          ['StoredState', 'Normal'], ['LinkClassID', 35906], ['LinkClientID', 257], ['LinkResourceModified', 'false'], ['LinkObjectModified', 'false'],
          ['ShowInUI', 'true'], ['CanEmbed', 'true'], ['CanUnembed', 'true'], ['CanPackage', 'true'], ['ImportPolicy', 'NoAutoImport'], ['ExportPolicy', 'NoAutoExport']])}/>` +
        '</PDF></Rectangle>';
    }
    if (it.kind === 'text' || it.kind === 'table') {
      const sid = id();
      let inner = '', fb = null, cols = 1, gutter = 12, balance = false;
      if (it.kind === 'text') {
        const F = it.frame;
        inner = F.paras.map((p, i) => paraXml(p, i === F.paras.length - 1)).join('');
        fb = F.firstBaseline;
        cols = F.columns || 1;
        gutter = F.gutter || 12;
        balance = cols > 1 && !!F.balance;   // CSS column-fill: balance → „Spalten ausgleichen“
      } else {
        inner = `<ParagraphStyleRange AppliedParagraphStyle="${doc.tableAnchorStyle}"><CharacterStyleRange AppliedCharacterStyle="${NOCS}">${tableXml(it.table)}</CharacterStyleRange></ParagraphStyleRange>`;
      }
      stories.push({ self: sid, xml: storyXml(sid, inner) });
      const colW = (it.w - (cols - 1) * gutter) / cols;
      const tfp = [['TextColumnCount', cols], ['TextColumnGutter', num(gutter)], ['TextColumnFixedWidth', num(colW)], ['UseFixedColumnWidth', 'false'],
        ['FirstBaselineOffset', fb !== null ? 'FixedHeight' : 'AscentOffset'], ['MinimumFirstBaselineOffset', num(fb !== null ? Math.max(0, fb) : 0)],
        ['VerticalJustification', 'TopAlign'], ['VerticalThreshold', 0], ...(balance ? [['VerticalBalanceColumns', 'true']] : []), ['IgnoreWrap', it.ignoreWrap ? 'true' : 'false'], ['AutoSizingType', 'Off'], ['AutoSizingReferencePoint', 'TopLeftPoint'],
        ['UseMinimumHeightForAutoSizing', 'false'], ['MinimumHeightForAutoSizing', 0]];
      return `<TextFrame${attrs([['Self', self], ['ParentStory', sid], ['PreviousTextFrame', 'n'], ['NextTextFrame', 'n'], ['ContentType', 'TextType'], ['StoryTitle', '$ID/'], ['ItemLayer', L],
        ['FillColor', 'Swatch/None'], ['StrokeColor', 'Swatch/None'], ['StrokeWeight', 0], ['AppliedObjectStyle', 'ObjectStyle/$ID/[Normal Text Frame]'],
        ['Visible', 'true'], ['Locked', 'false'], ['Name', it.kind === 'table' ? 'Tabelle' : '$ID/'], ['ItemTransform', xform(page, it.x, it.y)]])}>` +
        pathXml(rectPts(it.w, it.h)) +
        `<TextFramePreference${attrs(tfp)}><Properties><InsetSpacing type="list"><ListItem type="unit">0</ListItem><ListItem type="unit">0</ListItem><ListItem type="unit">0</ListItem><ListItem type="unit">0</ListItem></InsetSpacing></Properties></TextFramePreference>` +
        '<TextWrapPreference Inverse="false" ApplyToMasterPageOnly="false" TextWrapSide="BothSides" TextWrapMode="None"/>' +
        '</TextFrame>';
    }
    return '';
  };

  // ---- Seiten / Spreads ---------------------------------------------------------------------------------------------
  // Musterseiten: „A-Inhalt“ mit dem Satzspiegel der Innenseiten (häufigste Seitenränder), Spaltenraster und den
  // gleichbleibenden Fußzeilen-Objekten – nur für Seiten, deren Fuß wirklich auf die Musterseite gewandert ist
  // (doc.master.pages) bzw. die auf Druckbögen mit ausgeblendeten Musterobjekten stehen. „B-Inhalt ohne Fuß“: gleicher
  // Satzspiegel und gleiches Raster, keine Objekte – für Seiten mit Satzspiegel, aber ohne Standard-Fußzeile (z. B.
  // Impressum mit eigener Fußzeile; ShowMasterItems gilt je Druckbogen und würde der Nachbarseite den Fuß nehmen).
  // „U-Umschlag“ ohne Ränder für Seiten mit Rand 0 (Umschlag).
  const zeroM = { top: 0, bottom: 0, left: 0, right: 0 };
  const isZero = (m) => m.top + m.bottom + m.left + m.right < 0.5;
  const spreadIdx = (i) => (i === 0 ? 0 : Math.floor((i + 1) / 2));   // Druckbögen wie unten: [1], [2|3], …
  const nMaster = doc.master ? doc.master.left.length + doc.master.right.length : 0;
  const footPages = new Set(doc.master ? doc.master.pages : []);
  const hiddenPages = new Set(doc.pages.filter((p, i) => doc.master && doc.master.spreadsWithout.has(spreadIdx(i))).map((p) => p.number));
  const masters = [{ key: 'A', self: id(), pages: [id(), id()], prefix: 'A', base: 'Inhalt', margins: doc.margins || zeroM, items: nMaster > 0 }];
  const MA = masters[0];
  const needB = nMaster > 0 && doc.pages.some((p) => !isZero(p.margins) && !footPages.has(p.number) && !hiddenPages.has(p.number));
  const MB = needB ? { key: 'B', self: id(), pages: [id(), id()], prefix: 'B', base: 'Inhalt ohne Fuß', margins: MA.margins, items: false } : null;
  if (MB) masters.push(MB);
  const MU = doc.pages.some((p) => isZero(p.margins) && !footPages.has(p.number)) && !isZero(MA.margins)
    ? { key: 'U', self: id(), pages: [id(), id()], prefix: 'U', base: 'Umschlag', margins: zeroM, items: false } : null;
  if (MU) masters.push(MU);
  const masterOf = (p) => {
    if (footPages.has(p.number)) return MA;                    // Fuß liegt auf der Musterseite
    if (isZero(p.margins) && MU) return MU;
    if (hiddenPages.has(p.number) || !MB) return MA;           // Musterobjekte ausgeblendet bzw. A ohne Objekte
    return MB;
  };
  const pagesOfMaster = (ms) => doc.pages.filter((p) => masterOf(p) === ms).map((p) => p.number);
  const noMasterPages = doc.pages.filter((p) => hiddenPages.has(p.number) && masterOf(p) === MA).map((p) => p.number);
  // Seitenliste kompakt: 2–9, 12–23
  const span = (ns) => ns.reduce((acc, n) => { const l = acc[acc.length - 1]; if (l && n === l[1] + 1) l[1] = n; else acc.push([n, n]); return acc; }, [])
    .map(([a, b]) => (a === b ? `${a}` : `${a}–${b}`)).join(', ');
  doc.masterInfo = masters.map((ms) => {
    const on = pagesOfMaster(ms);
    const where = on.length ? `S. ${span(on)}` : 'keiner Seite zugewiesen (Vorlage für neue Seiten)';
    if (ms.key === 'A') {
      return { name: `${ms.prefix}-${ms.base}`, pages: on, note: `Satzspiegel, Spaltenraster${nMaster ? ` und gemeinsame Fußzeile (${nMaster} Objekte)` : ''} – ${where}` +
        (noMasterPages.length ? `\n      (auf S. ${span(noMasterPages)} mit eigener Seitenfläche steht die Fußzeile auf der Seite, Musterobjekte ausgeblendet)` : '') };
    }
    if (ms.key === 'B') return { name: `${ms.prefix}-${ms.base}`, pages: on, note: `Satzspiegel und Spaltenraster wie „A-Inhalt“, ohne Objekte – ${where}\n      (Seiten ohne die Standard-Fußzeile; ihre eigene Fußzeile steht auf der Seite)` };
    return { name: `${ms.prefix}-${ms.base}`, pages: on, note: `ohne Ränder, Spalten und Objekte – ${where}` };
  });
  // Seitenränder im Modell sind seitenbezogen (links/rechts wie gerendert); InDesign: Left = innen, Right = außen
  const marginXml = (page, m) => {
    const inside = page.left ? m.right : m.left, outside = page.left ? m.left : m.right;
    const cw = W - m.left - m.right;
    const g = !isZero(m) && doc.gridFor ? doc.gridFor(m) : null;
    const cnt = g ? g.count : 1;
    const gut = g ? g.gutter : 12;
    const colW = (cw - (cnt - 1) * gut) / cnt;
    const pos = [];
    for (let i = 0; i < cnt; i++) pos.push(num(i * (colW + gut)), num(i * (colW + gut) + colW));
    return `<MarginPreference${attrs([['ColumnCount', cnt], ['ColumnGutter', num(gut)], ['Top', num(m.top)], ['Bottom', num(m.bottom)],
      ['Left', num(inside)], ['Right', num(outside)], ['ColumnDirection', 'Horizontal'], ['ColumnsPositions', pos.join(' ')]])}/>`;
  };
  const pageXml = (page, self, nameStr, applied) => `<Page${attrs([['Self', self], ['Name', nameStr], ['AppliedTrapPreset', 'TrapPreset/$ID/kDefaultTrapStyleName'], ['GeometricBounds', `0 0 ${num(H)} ${num(W)}`],
    ['ItemTransform', `1 0 0 1 ${num(page.left ? -W : 0)} ${num(-H / 2)}`], ['AppliedMaster', applied], ['OverrideList', ''], ['MasterPageTransform', '1 0 0 1 0 0'], ['TabOrder', ''],
    ['GridStartingPoint', 'TopOutside'], ['UseMasterGrid', 'true']])}><Properties><PageColor type="enumeration">UseMasterColor</PageColor></Properties>${marginXml(page, page.margins)}</Page>`;

  const pages = doc.pages;
  const spreads = [];
  // Seite 1 rechts allein, dann Paare (gerade|ungerade), ggf. letzte gerade Seite allein links
  let i = 0;
  if (pages.length) { spreads.push([pages[0]]); i = 1; }
  for (; i < pages.length; i += 2) spreads.push(pages.slice(i, i + 2));
  const pageSelf = new Map();
  spreads.forEach((sp, si) => {
    const sid = id();
    const pagesXml = sp.map((p) => { const ps = id(); pageSelf.set(p, ps); return pageXml(p, ps, String(p.number), masterOf(p).self); }).join('');
    const binding = sp.length === 1 && !sp[0].left ? 0 : 1;
    const itemsXml = [];
    for (const p of sp) {
      // Ebenen getrennt in ihrer Stapelreihenfolge (Hintergrund → Grafiken → Text), innerhalb nach Malreihenfolge
      for (const layer of ['Hintergrund', 'Grafiken', 'Text']) p.items.filter((it) => it.layer === layer).forEach((it) => itemsXml.push(itemXml(p, it)));
    }
    files[`Spreads/Spread_${sid}.xml`] = HDR + `<idPkg:Spread ${NS} DOMVersion="${DOM}"><Spread${attrs([['Self', sid], ['PageTransitionType', 'None'], ['PageTransitionDirection', 'NotApplicable'], ['PageTransitionDuration', 'Medium'],
      ['ShowMasterItems', doc.master && doc.master.spreadsWithout.has(si) ? 'false' : 'true'], ['PageCount', sp.length], ['BindingLocation', binding], ['AllowPageShuffle', 'true'], ['ItemTransform', `1 0 0 1 0 ${num(si * (H + 180))}`], ['FlattenerOverride', 'Default']])}>` +
      '<FlattenerPreference LineArtAndTextResolution="300" GradientAndMeshResolution="150" ClipComplexRegions="false" ConvertAllStrokesToOutlines="false" ConvertAllTextToOutlines="false"><Properties><RasterVectorBalance type="double">50</RasterVectorBalance></Properties></FlattenerPreference>' +
      pagesXml + itemsXml.join('') + '</Spread></idPkg:Spread>\n';
    sp.spreadSelf = sid;
  });
  masters.forEach((ms) => {
    // ms.margins in Ausrichtung einer rechten Seite (left = innen); linke Musterseite gespiegelt
    const mr = ms.margins, ml = { ...mr, left: mr.right, right: mr.left };
    // Musterobjekte (nur „A-Inhalt“): gemeinsame Fußzeile, je Ebene in Malreihenfolge
    const mItems = [];
    if (ms === MA && doc.master) {
      for (const [side, list] of [[true, doc.master.left], [false, doc.master.right]]) {
        for (const layer of ['Hintergrund', 'Grafiken', 'Text']) list.filter((it) => it.layer === layer).forEach((it) => mItems.push(itemXml({ left: side }, it)));
      }
    }
    files[`MasterSpreads/MasterSpread_${ms.self}.xml`] = HDR + `<idPkg:MasterSpread ${NS} DOMVersion="${DOM}"><MasterSpread${attrs([['Self', ms.self], ['ItemTransform', '1 0 0 1 0 0'], ['Name', `${ms.prefix}-${ms.base}`], ['NamePrefix', ms.prefix], ['BaseName', ms.base], ['ShowMasterItems', 'true'], ['PageCount', 2], ['OverriddenPageItemProps', ''], ['PrimaryTextFrame', 'n']])}>` +
      pageXml({ left: true, margins: ml }, ms.pages[0], ms.prefix, 'n') + pageXml({ left: false, margins: mr }, ms.pages[1], ms.prefix, 'n') + mItems.join('') + '</MasterSpread></idPkg:MasterSpread>\n';
  });

  stories.forEach((s) => { files[`Stories/Story_${s.self}.xml`] = s.xml; });

  // ---- Resources/Graphic.xml ----------------------------------------------------------------------------------------
  const colorXml = (s) => `<Color${attrs([['Self', s.self], ['Model', 'Process'], ['Space', 'RGB'], ['ColorValue', `${s.r} ${s.g} ${s.b}`], ['ColorOverride', 'Normal'], ['AlternateSpace', 'NoAlternateColor'], ['AlternateColorValue', ''], ['Name', s.name], ['ColorEditable', 'true'], ['ColorRemovable', 'true'], ['Visible', 'true'], ['SwatchCreatorID', 7937]])}/>`;
  files['Resources/Graphic.xml'] = HDR + `<idPkg:Graphic ${NS} DOMVersion="${DOM}">\n` + [
    '<Color Self="Color/Black" Model="Process" Space="CMYK" ColorValue="0 0 0 100" ColorOverride="Specialblack" AlternateSpace="NoAlternateColor" AlternateColorValue="" Name="Black" ColorEditable="false" ColorRemovable="false" Visible="true" SwatchCreatorID="7937"/>',
    '<Color Self="Color/Paper" Model="Process" Space="CMYK" ColorValue="0 0 0 0" ColorOverride="Specialpaper" AlternateSpace="NoAlternateColor" AlternateColorValue="" Name="Paper" ColorEditable="true" ColorRemovable="false" Visible="true" SwatchCreatorID="7937"/>',
    '<Color Self="Color/Registration" Model="Registration" Space="CMYK" ColorValue="100 100 100 100" ColorOverride="Specialregistration" AlternateSpace="NoAlternateColor" AlternateColorValue="" Name="Registration" ColorEditable="false" ColorRemovable="false" Visible="true" SwatchCreatorID="7937"/>',
    ...doc.swatches.map(colorXml),
    '<Ink Self="Ink/$ID/Process Cyan" Name="$ID/Process Cyan" Angle="75" ConvertToProcess="false" Frequency="70" NeutralDensity="0.61" PrintInk="true" TrapOrder="1" InkType="Normal"/>',
    '<Ink Self="Ink/$ID/Process Magenta" Name="$ID/Process Magenta" Angle="15" ConvertToProcess="false" Frequency="70" NeutralDensity="0.76" PrintInk="true" TrapOrder="2" InkType="Normal"/>',
    '<Ink Self="Ink/$ID/Process Yellow" Name="$ID/Process Yellow" Angle="0" ConvertToProcess="false" Frequency="70" NeutralDensity="0.16" PrintInk="true" TrapOrder="3" InkType="Normal"/>',
    '<Ink Self="Ink/$ID/Process Black" Name="$ID/Process Black" Angle="45" ConvertToProcess="false" Frequency="70" NeutralDensity="1.7" PrintInk="true" TrapOrder="4" InkType="Normal"/>',
    '<Swatch Self="Swatch/None" Name="None" ColorEditable="false" ColorRemovable="false" Visible="true" SwatchCreatorID="7937"/>',
    ...['Solid', 'Dashed', 'Canned Dotted', 'ThinThin', 'ThickThin', 'ThinThick', 'Canned Dashed 3x2', 'Canned Dashed 4x4'].map((s) => `<StrokeStyle Self="StrokeStyle/$ID/${s}" Name="$ID/${s}"/>`),
  ].join('\n') + '\n</idPkg:Graphic>\n';

  // ---- Resources/Fonts.xml -------------------------------------------------------------------------------------------
  const famMap = new Map();
  doc.faces.forEach((f) => { if (!famMap.has(f.family)) famMap.set(f.family, []); famMap.get(f.family).push(f); });
  // Kombinationen ohne erzeugte Datei (z. B. Systemschrift) trotzdem aufführen
  doc.usedFaces.forEach((u) => {
    if (!famMap.has(u.family)) famMap.set(u.family, []);
    if (!famMap.get(u.family).some((f) => f.style === u.style)) famMap.get(u.family).push({ family: u.family, style: u.style, ps: `${u.family.replace(/\s/g, '')}-${u.style.replace(/\s/g, '')}`, fontType: 'TrueType', missing: true });
  });
  let fi = 0;
  files['Resources/Fonts.xml'] = HDR + `<idPkg:Fonts ${NS} DOMVersion="${DOM}">\n` + [...famMap].map(([fam, faces]) => {
    const fid = `di${(++fi).toString(16)}`;
    return `<FontFamily Self="${fid}" Name="${esc(fam).replace(/"/g, '&quot;')}">` + faces.map((f) => `<Font${attrs([['Self', `${fid}Fontn${fam} ${f.style}`], ['FontFamily', fam], ['Name', `${fam} ${f.style}`], ['PostScriptName', f.ps],
      ['Status', f.missing ? 'NotAvailable' : 'Installed'], ['FontStyleName', f.style], ['FontType', f.fontType || 'TrueType'], ['WritingScript', 0], ['FullName', `${fam} ${f.style}`], ['FullNameNative', `${fam} ${f.style}`],
      ['FontStyleNameNative', f.style], ['PlatformName', '$ID/'], ['Version', f.version || ''], ['TypekitID', '$ID/']])}/>`).join('') + '</FontFamily>';
  }).join('\n') + '\n</idPkg:Fonts>\n';

  // ---- Resources/Styles.xml --------------------------------------------------------------------------------------------
  const defFace = doc.defaultFace;
  // Silbentrennung wie assemble.cjs (weiche Trennstriche ab 8 Buchstaben, je 3 Zeichen vor/nach der Trennung).
  // Trennbereich 0 und unbegrenzte Trennungen in Folge: Chromium kennt beides nicht; mit dem Ein-Zeilen-Setzer würde
  // InDesign sonst Wörter, die weniger als 36 pt (Standard) vor dem Zeilenende beginnen, nicht trennen, sondern in die
  // nächste Zeile schieben (anderer Zeilenfall, Übersatz in knappen Rahmen).
  const HY = doc.hyphenation || { wordsLongerThan: 7, afterFirst: 3, beforeLast: 3, ladderLimit: 0, zone: 0, capitalized: true };
  const hyAttrs = [['HyphenateCapitalizedWords', HY.capitalized ? 'true' : 'false'], ['HyphenateWordsLongerThan', HY.wordsLongerThan],
    ['HyphenateAfterFirst', HY.afterFirst], ['HyphenateBeforeLast', HY.beforeLast], ['HyphenateLadderLimit', HY.ladderLimit ?? 0], ['HyphenationZone', HY.zone ?? 0]];
  // Absatzformat; mit s.basedOn (Basisformat der Schriftfamilie) nur die Abweichungen vom Basisformat
  const pstyleXml = (s) => {
    const parent = s.basedOn || null;
    const a = {};
    for (const [k, v] of Object.entries(s.attrs)) if (!parent || JSON.stringify(parent.attrs[k]) !== JSON.stringify(v)) a[k] = v;
    const font = a.AppliedFont, leading = a.Leading;
    delete a.AppliedFont; delete a.Leading;
    const { at } = textAttrs(a);
    const global = parent ? [] : [['Composer', doc.composer], ['KerningMethod', '$ID/Metrics'], ...hyAttrs];
    return `<ParagraphStyle${attrs([['Self', s.self], ['Name', s.name], ['Imported', 'false'], ['NextStyle', s.self], ['KeyboardShortcut', '0 0'], ...at, ...global])}>` +
      `<Properties>${parent ? `<BasedOn type="object">${esc(parent.self)}</BasedOn>` : '<BasedOn type="string">$ID/[No paragraph style]</BasedOn>'}<PreviewColor type="enumeration">Nothing</PreviewColor>` +
      `${leading !== undefined ? `<Leading type="unit">${num(leading)}</Leading>` : ''}${font !== undefined ? `<AppliedFont type="string">${esc(font)}</AppliedFont>` : ''}</Properties></ParagraphStyle>`;
  };
  const cstyleXml = (s) => {
    const a = { ...s.attrs };
    const font = a.AppliedFont;
    delete a.AppliedFont;
    const { at } = textAttrs(a);
    return `<CharacterStyle${attrs([['Self', s.self], ['Imported', 'false'], ['KeyboardShortcut', '0 0'], ['Name', s.name], ...at])}>` +
      `<Properties><BasedOn type="string">$ID/[No character style]</BasedOn><PreviewColor type="enumeration">Nothing</PreviewColor>${font ? `<AppliedFont type="string">${esc(font)}</AppliedFont>` : ''}</Properties></CharacterStyle>`;
  };
  files['Resources/Styles.xml'] = HDR + `<idPkg:Styles ${NS} DOMVersion="${DOM}">\n` + [
    `<RootCharacterStyleGroup Self="${id()}">`,
    '<CharacterStyle Self="CharacterStyle/$ID/[No character style]" Imported="false" SplitDocument="false" EmitCss="true" IncludeClass="true" Name="$ID/[No character style]"/>',
    ...doc.charStyles.map(cstyleXml),
    '</RootCharacterStyleGroup>',
    `<RootParagraphStyleGroup Self="${id()}">`,
    `<ParagraphStyle Self="ParagraphStyle/$ID/[No paragraph style]" Name="$ID/[No paragraph style]" Imported="false" SplitDocument="false" EmitCss="true" IncludeClass="true" FillColor="Color/Black" FontStyle="${esc(defFace.style)}" PointSize="12" Tracking="0" Capitalization="Normal" Justification="LeftAlign" FirstLineIndent="0" LeftIndent="0" RightIndent="0" SpaceBefore="0" SpaceAfter="0" Hyphenation="true" AppliedLanguage="$ID/de_DE_2006" Composer="${doc.composer}" KerningMethod="$ID/Metrics"${attrs(hyAttrs)} HyphenateLastWord="true" AllowArbitraryHyphenation="false"><Properties><Leading type="enumeration">Auto</Leading><AppliedFont type="string">${esc(defFace.family)}</AppliedFont></Properties></ParagraphStyle>`,
    '<ParagraphStyle Self="ParagraphStyle/$ID/NormalParagraphStyle" Name="$ID/NormalParagraphStyle" Imported="false" NextStyle="ParagraphStyle/$ID/NormalParagraphStyle" KeyboardShortcut="0 0"><Properties><BasedOn type="string">$ID/[No paragraph style]</BasedOn><PreviewColor type="enumeration">Nothing</PreviewColor></Properties></ParagraphStyle>',
    `<ParagraphStyle Self="${doc.tableAnchorStyle}" Name="${doc.tableAnchorStyle.replace('ParagraphStyle/', '')}" Imported="false" NextStyle="${doc.tableAnchorStyle}" KeyboardShortcut="0 0" PointSize="2" SpaceBefore="0" SpaceAfter="0" Hyphenation="false"><Properties><BasedOn type="string">$ID/[No paragraph style]</BasedOn><PreviewColor type="enumeration">Nothing</PreviewColor><Leading type="unit">2</Leading></Properties></ParagraphStyle>`,
    ...(doc.baseStyles || []).map(pstyleXml),   // Basisformate vor ihren Kindern
    ...doc.paraStyles.map(pstyleXml),
    '</RootParagraphStyleGroup>',
    `<TOCStyle Self="TOCStyle/$ID/DefaultTOCStyleName" TitleStyle="ParagraphStyle/$ID/[No paragraph style]" Title="Inhalt" Name="$ID/DefaultTOCStyleName" RunIn="false" IncludeHidden="false" IncludeBookDocuments="false" CreateBookmarks="true" SetStoryDirection="Horizontal" NumberedParagraphs="IncludeFullParagraph" MakeAnchor="false" RemoveForcedLineBreak="false"/>`,
    `<RootCellStyleGroup Self="${id()}"><CellStyle Self="CellStyle/$ID/[None]" AppliedParagraphStyle="ParagraphStyle/$ID/[No paragraph style]" Name="$ID/[None]"/></RootCellStyleGroup>`,
    `<RootTableStyleGroup Self="${id()}"><TableStyle Self="TableStyle/$ID/[No table style]" Name="$ID/[No table style]"/><TableStyle Self="TableStyle/$ID/[Basic Table]" Name="$ID/[Basic Table]"><Properties><BasedOn type="string">$ID/[No table style]</BasedOn></Properties></TableStyle></RootTableStyleGroup>`,
    `<RootObjectStyleGroup Self="${id()}">` +
    '<ObjectStyle Self="ObjectStyle/$ID/[None]" Name="$ID/[None]" AppliedParagraphStyle="ParagraphStyle/$ID/[No paragraph style]" FillColor="Swatch/None" StrokeColor="Swatch/None" StrokeWeight="0" FillTint="-1" StrokeTint="-1"/>' +
    '<ObjectStyle Self="ObjectStyle/$ID/[Normal Graphics Frame]" Name="$ID/[Normal Graphics Frame]" FillColor="Swatch/None" StrokeColor="Swatch/None" StrokeWeight="0"><Properties><BasedOn type="string">$ID/[None]</BasedOn></Properties></ObjectStyle>' +
    '<ObjectStyle Self="ObjectStyle/$ID/[Normal Text Frame]" Name="$ID/[Normal Text Frame]" FillColor="Swatch/None" StrokeColor="Swatch/None" StrokeWeight="0"><Properties><BasedOn type="string">$ID/[None]</BasedOn></Properties></ObjectStyle>' +
    '</RootObjectStyleGroup>',
    // Überfüllungsvorgaben wie in jedem InDesign-Export (Pages verweisen auf kDefaultTrapStyleName)
    '<TrapPreset Self="TrapPreset/$ID/k[No Trap Preset]" Name="$ID/k[No Trap Preset]" DefaultTrapWidth="0.25" BlackWidth="0.5" TrapJoin="MiterEndJoin" TrapEnd="MiterTrapEnds" ObjectsToImages="true" ImagesToImages="true" InternalImages="false" OneBitImages="true" ImagePlacement="CenterEdges" StepThreshold="10" BlackColorThreshold="100" BlackDensity="1.6" SlidingTrapThreshold="70" ColorReduction="100"/>',
    '<TrapPreset Self="TrapPreset/$ID/kDefaultTrapStyleName" Name="$ID/kDefaultTrapStyleName" DefaultTrapWidth="0.25" BlackWidth="0.5" TrapJoin="MiterEndJoin" TrapEnd="MiterTrapEnds" ObjectsToImages="true" ImagesToImages="true" InternalImages="false" OneBitImages="true" ImagePlacement="CenterEdges" StepThreshold="10" BlackColorThreshold="100" BlackDensity="1.6" SlidingTrapThreshold="70" ColorReduction="100"/>',
  ].join('\n') + '\n</idPkg:Styles>\n';

  // ---- Resources/Preferences.xml ----------------------------------------------------------------------------------------
  // Dokumentvorgabe = Satzspiegel der Musterseite „A-Inhalt“ (neue Seiten bekommen Ränder und Spaltenraster)
  const m0 = masters[0].margins;
  const g0 = !isZero(m0) && doc.gridFor ? doc.gridFor(m0) : null;
  const cnt = g0 ? g0.count : 1;
  files['Resources/Preferences.xml'] = HDR + `<idPkg:Preferences ${NS} DOMVersion="${DOM}">\n` + [
    `<DocumentPreference${attrs([['PageHeight', num(H, 6)], ['PageWidth', num(W, 6)], ['PagesPerDocument', pages.length], ['FacingPages', 'true'],
      ['DocumentBleedTopOffset', num(doc.bleed, 6)], ['DocumentBleedBottomOffset', num(doc.bleed, 6)], ['DocumentBleedInsideOrLeftOffset', num(doc.bleed, 6)], ['DocumentBleedOutsideOrRightOffset', num(doc.bleed, 6)],
      ['DocumentBleedUniformSize', 'true'], ['SlugTopOffset', 0], ['SlugBottomOffset', 0], ['SlugInsideOrLeftOffset', 0], ['SlugRightOrOutsideOffset', 0], ['DocumentSlugUniformSize', 'false'],
      ['PreserveLayoutWhenShuffling', 'true'], ['AllowPageShuffle', 'true'], ['OverprintBlack', 'true'], ['PageBinding', 'LeftToRight'], ['ColumnDirection', 'Horizontal'], ['Intent', 'PrintIntent'], ['CreatePrimaryTextFrame', 'false']])}/>`,
    `<MarginPreference${attrs([['ColumnCount', cnt], ['ColumnGutter', num(g0 ? g0.gutter : 12)], ['Top', num(m0.top)], ['Bottom', num(m0.bottom)], ['Left', num(m0.left)], ['Right', num(m0.right)], ['ColumnDirection', 'Horizontal']])}/>`,
    '<ViewPreference HorizontalMeasurementUnits="Millimeters" VerticalMeasurementUnits="Millimeters" RulerOrigin="SpreadOrigin" ShowRulers="true" ShowFrameEdges="true" CursorKeyIncrement="0.25" GuideSnaptoZone="4" LineMeasurementUnits="Points" TypographicMeasurementUnits="Points" TextSizeMeasurementUnits="Points" PrintDialogMeasurementUnits="Millimeters" PointsPerInch="72"/>',
    '<TransparencyPreference BlendingSpace="RGB" GlobalLightAngle="120" GlobalLightAltitude="30"/>',
    `<StoryPreference OpticalMarginAlignment="false" OpticalMarginSize="12" FrameType="TextFrameType" StoryOrientation="Horizontal" StoryDirection="LeftToRightDirection"/>`,
  ].join('\n') + '\n</idPkg:Preferences>\n';

  // ---- XML/, META-INF/ -------------------------------------------------------------------------------------------------
  const backing = id();
  files['XML/Tags.xml'] = HDR + `<idPkg:Tags ${NS} DOMVersion="${DOM}"><XMLTag Self="XMLTag/Root" Name="Root"><Properties><TagColor type="enumeration">LightBlue</TagColor></Properties></XMLTag></idPkg:Tags>\n`;
  files['XML/BackingStory.xml'] = HDR + `<idPkg:BackingStory ${NS} DOMVersion="${DOM}"><XmlStory Self="${backing}" UserText="true" IsEndnoteStory="false" AppliedTOCStyle="n" TrackChanges="false" StoryTitle="$ID/" AppliedNamedGrid="n">` +
    '<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/$ID/NormalParagraphStyle"><CharacterStyleRange AppliedCharacterStyle="CharacterStyle/$ID/[No character style]">' +
    `<XMLElement Self="${id()}" MarkupTag="XMLTag/Root"/><Content>\uFEFF</Content></CharacterStyleRange></ParagraphStyleRange></XmlStory></idPkg:BackingStory>\n`;
  files['META-INF/container.xml'] = HDR + '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="designmap.xml" media-type="text/xml"/></rootfiles></container>\n';
  // fester Zeitstempel (Quelle: doc.date = SOURCE_DATE_EPOCH bzw. letzter Commit), damit Exporte bytegleich sind
  const now = (doc.date || new Date(0)).toISOString().replace(/\.\d+Z$/, 'Z');
  files['META-INF/metadata.xml'] = HDR + '<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>\n<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
    `<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xmp="http://ns.adobe.com/xap/1.0/"><dc:format>application/x-indesign</dc:format>` +
    `<dc:title><rdf:Alt><rdf:li xml:lang="x-default">${esc(doc.title || '')}</rdf:li></rdf:Alt></dc:title><xmp:CreatorTool>scripts/export-idml.cjs</xmp:CreatorTool><xmp:CreateDate>${now}</xmp:CreateDate><xmp:ModifyDate>${now}</xmp:ModifyDate></rdf:Description>` +
    '</rdf:RDF></x:xmpmeta>\n<?xpacket end="w"?>\n';

  // ---- designmap.xml -------------------------------------------------------------------------------------------------
  const storyIds = stories.map((s) => s.self).concat([backing]);
  const sectionStart = pageSelf.get(pages[0]);
  const swatchRefs = ['Swatch/None', 'Color/Registration', 'Color/Paper', 'Color/Black', ...doc.swatches.map((s) => s.self)];
  files['designmap.xml'] = HDR + `<?aid style="50" type="document" readerVersion="6.0" featureSet="257" product="${DOM}(1)" ?>\n` +
    `<Document${attrs([['xmlns:idPkg', 'http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging'], ['DOMVersion', DOM], ['Self', 'd'], ['StoryList', storyIds.join(' ')], ['Name', doc.docName || 'Dokument.indd'],
      ['ZeroPoint', '0 0'], ['ActiveLayer', layerSelf.Text], ['CMYKProfile', 'Coated FOGRA39 (ISO 12647-2:2004)'], ['RGBProfile', 'sRGB IEC61966-2.1'],
      ['SolidColorIntent', 'UseColorSettings'], ['AfterBlendingIntent', 'UseColorSettings'], ['DefaultImageIntent', 'UseColorSettings'],
      ['RGBPolicy', 'PreserveEmbeddedProfiles'], ['CMYKPolicy', 'CombinationOfPreserveAndSafeCmyk'], ['AccurateLABSpots', 'false']])}>\n` + [
    '<Language Self="Language/$ID/de_DE_2006" Name="$ID/de_DE_2006" SingleQuotes="‚‘" DoubleQuotes="„“" PrimaryLanguageName="$ID/de_DE_2006" SublanguageName="$ID/" Id="275" HyphenationVendor="Hunspell" SpellingVendor="Hunspell"/>',
    '<Language Self="Language/$ID/English%3a USA" Name="$ID/English: USA" SingleQuotes="‘’" DoubleQuotes="“”" PrimaryLanguageName="$ID/English" SublanguageName="$ID/USA" Id="269" HyphenationVendor="Hunspell" SpellingVendor="Hunspell"/>',
    '<idPkg:Graphic src="Resources/Graphic.xml"/>',
    '<idPkg:Fonts src="Resources/Fonts.xml"/>',
    '<idPkg:Styles src="Resources/Styles.xml"/>',
    '<NumberingList Self="NumberingList/$ID/[Default]" Name="$ID/[Default]" ContinueNumbersAcrossStories="false" ContinueNumbersAcrossDocuments="false"/>',
    '<idPkg:Preferences src="Resources/Preferences.xml"/>',
    '<idPkg:Tags src="XML/Tags.xml"/>',
    ...LAYERS.map((l) => `<Layer${attrs([['Self', l.self], ['Name', l.name], ['Visible', 'true'], ['Locked', 'false'], ['IgnoreWrap', 'false'], ['ShowGuides', 'true'], ['LockGuides', 'false'], ['UI', 'true'], ['Expendable', 'true'], ['Printable', 'true']])}><Properties><LayerColor type="enumeration">${l.color}</LayerColor></Properties></Layer>`),
    ...masters.map((ms) => `<idPkg:MasterSpread src="MasterSpreads/MasterSpread_${ms.self}.xml"/>`),
    ...spreads.map((sp) => `<idPkg:Spread src="Spreads/Spread_${sp.spreadSelf}.xml"/>`),
    `<Section${attrs([['Self', id()], ['Length', pages.length], ['Name', ''], ['ContinueNumbering', 'false'], ['IncludeSectionPrefix', 'false'], ['PageNumberStart', 1], ['Marker', ''], ['PageStart', sectionStart], ['SectionPrefix', '']])}><Properties><PageNumberStyle type="enumeration">Arabic</PageNumberStyle></Properties></Section>`,
    '<idPkg:BackingStory src="XML/BackingStory.xml"/>',
    ...stories.map((s) => `<idPkg:Story src="Stories/Story_${s.self}.xml"/>`),
    `<ColorGroup Self="ColorGroup/[Root Color Group]" Name="[Root Color Group]" IsRootColorGroup="true">` + swatchRefs.map((r) => `<ColorGroupSwatch Self="${id()}" SwatchItemRef="${esc(r)}"/>`).join('') + '</ColorGroup>',
  ].join('\n') + '\n</Document>\n';

  // Reihenfolge im Paket wie bei Adobe
  const order = ['designmap.xml', 'META-INF/container.xml', 'META-INF/metadata.xml', 'Resources/Graphic.xml', 'Resources/Fonts.xml', 'Resources/Styles.xml', 'Resources/Preferences.xml', 'XML/Tags.xml',
    ...Object.keys(files).filter((k) => k.startsWith('MasterSpreads/')),
    ...spreads.map((sp) => `Spreads/Spread_${sp.spreadSelf}.xml`), 'XML/BackingStory.xml', ...stories.map((s) => `Stories/Story_${s.self}.xml`)];
  return { files, order, links: [...new Set(links)], spreads: spreads.length, stories: stories.length };
}

module.exports = { writeIdml };
