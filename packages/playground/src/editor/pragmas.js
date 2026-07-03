import { RangeSetBuilder, StateEffect, StateField } from '@codemirror/state';
import { Decoration, EditorView, WidgetType } from '@codemirror/view';

/*
  Pragma regions — special comments that shape what the editor shows without
  ever changing what builds. Canonical keywords are sui-hide / sui-fold;
  playground-hide / playground-fold remain as aliases since they appear
  literally in example sources and shared links.

    hide: invisible in the editor, present in output (injected scaffolding)
    fold: collapsed behind a "…" widget; expanding reveals the region and the
          marker comments stay invisible — the reader never sees a pragma

  Modes: 'on' (hide and fold), 'off' (regions visible, markers hidden),
  'off-visible' (markers shown as literal text).
*/

const keywords = {
  'sui-hide': 'hide',
  'playground-hide': 'hide',
  'sui-fold': 'fold',
  'playground-fold': 'fold',
};

const markerPattern = new RegExp(
  `(?:/\\*\\s*(${Object.keys(keywords).join('|')})(-end)?\\s*\\*/)`
    + `|(?:<!--\\s*(${Object.keys(keywords).join('|')})(-end)?\\s*-->)`,
  'g',
);

const hasMarkers = (text) => {
  return text.includes('sui-') || text.includes('playground-');
};

/*
  Returns regions plus orphaned markers (unmatched opens are treated as
  running to end of content — injected preludes rely on it; unmatched ends
  stay orphans so their comment still hides).
*/
const findRegions = (text) => {
  const regions = [];
  const orphans = [];
  const open = {};
  for (const match of text.matchAll(markerPattern)) {
    const keyword = match[1] ?? match[3];
    const isEnd = Boolean(match[2] ?? match[4]);
    const type = keywords[keyword];
    const marker = { from: match.index, to: match.index + match[0].length };
    if (!isEnd) {
      if (open[type]) {
        orphans.push(open[type]);
      }
      open[type] = marker;
    }
    else if (open[type]) {
      regions.push({ type, start: open[type], end: marker });
      open[type] = null;
    }
    else {
      orphans.push(marker);
    }
  }
  for (const [type, marker] of Object.entries(open)) {
    if (marker) {
      regions.push({ type, start: marker, end: { from: text.length, to: text.length } });
    }
  }
  return { regions, orphans };
};

/* extend a range over surrounding whitespace so hidden regions don't leave blank lines */
const extendRange = (text, from, to) => {
  let start = from;
  while (start > 0 && (text[start - 1] === ' ' || text[start - 1] === '\t')) {
    start -= 1;
  }
  if (start > 0 && text[start - 1] !== '\n') {
    start = from;
  }
  let end = to;
  while (end < text.length && (text[end] === ' ' || text[end] === '\t')) {
    end += 1;
  }
  if (text[end] === '\n' && (start === 0 || text[start - 1] === '\n')) {
    end += 1;
  }
  else {
    end = to;
  }
  return { from: start, to: end };
};

const expandFold = StateEffect.define();

class FoldWidget extends WidgetType {
  constructor(position) {
    super();
    this.position = position;
  }
  eq(other) {
    return other.position === this.position;
  }
  toDOM(view) {
    const marker = document.createElement('span');
    marker.className = 'cm-foldMarker';
    marker.textContent = '…';
    marker.title = 'Show hidden code';
    marker.onclick = () => view.dispatch({ effects: expandFold.of(this.position) });
    return marker;
  }
  ignoreEvent() {
    return false;
  }
}

const buildDecorations = ({ doc, mode, expanded }) => {
  const builder = new RangeSetBuilder();
  if (mode === 'off-visible') {
    return builder.finish();
  }
  const text = doc.toString();
  if (!hasMarkers(text)) {
    return builder.finish();
  }
  const { regions, orphans } = findRegions(text);
  const ranges = [];
  const hideMarker = (marker) => {
    if (marker.from < marker.to) {
      const range = extendRange(text, marker.from, marker.to);
      ranges.push({ from: range.from, to: range.to, decoration: Decoration.replace({}) });
    }
  };
  for (const region of regions) {
    const markersOnly = mode === 'off'
      || (region.type === 'fold' && expanded.has(region.start.from));
    if (markersOnly) {
      hideMarker(region.start);
      hideMarker(region.end);
      continue;
    }
    const range = extendRange(text, region.start.from, region.end.to);
    const decoration = region.type === 'hide'
      ? Decoration.replace({})
      : Decoration.replace({ widget: new FoldWidget(region.start.from) });
    ranges.push({ from: range.from, to: range.to, decoration });
  }
  for (const orphan of orphans) {
    if (mode !== 'off-visible') {
      hideMarker(orphan);
    }
  }
  // builder requires sorted, non-overlapping ranges — nested regions collapse into the outermost
  ranges.sort((a, b) => a.from - b.from || b.to - a.to);
  let coveredTo = -1;
  for (const range of ranges) {
    if (range.from < coveredTo) {
      continue;
    }
    builder.add(range.from, range.to, range.decoration);
    coveredTo = range.to;
  }
  return builder.finish();
};

export const pragmas = (mode = 'on') => {
  const field = StateField.define({
    create(state) {
      return { expanded: new Set(), decorations: buildDecorations({ doc: state.doc, mode, expanded: new Set() }) };
    },
    update(value, transaction) {
      /* expanded folds are keyed by start-marker position, mapped through edits */
      let expanded = value.expanded;
      if (transaction.docChanged && expanded.size) {
        expanded = new Set([...expanded].map(position => transaction.changes.mapPos(position)));
      }
      for (const effect of transaction.effects) {
        if (effect.is(expandFold)) {
          expanded = new Set(expanded).add(effect.value);
        }
      }
      if (!transaction.docChanged && expanded === value.expanded) {
        return value;
      }
      return { expanded, decorations: buildDecorations({ doc: transaction.newDoc, mode, expanded }) };
    },
    provide: (self) => EditorView.decorations.from(self, value => value.decorations),
  });
  return [field];
};
