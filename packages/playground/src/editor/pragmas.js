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

const findRegions = (text) => {
  const regions = [];
  const open = {};
  for (const match of text.matchAll(markerPattern)) {
    const keyword = match[1] ?? match[3];
    const isEnd = Boolean(match[2] ?? match[4]);
    const type = keywords[keyword];
    const marker = { from: match.index, to: match.index + match[0].length };
    if (!isEnd) {
      open[type] = marker;
    }
    else if (open[type]) {
      regions.push({ type, start: open[type], end: marker });
      open[type] = null;
    }
  }
  // an unclosed marker hides through end of content (injected preludes rely on it)
  for (const [type, marker] of Object.entries(open)) {
    if (marker) {
      regions.push({ type, start: marker, end: { from: text.length, to: text.length } });
    }
  }
  return regions;
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
  constructor(index) {
    super();
    this.index = index;
  }
  eq(other) {
    return other.index === this.index;
  }
  toDOM(view) {
    const marker = document.createElement('span');
    marker.className = 'cm-foldMarker';
    marker.textContent = '…';
    marker.title = 'Show hidden code';
    marker.onclick = () => view.dispatch({ effects: expandFold.of(this.index) });
    return marker;
  }
  ignoreEvent() {
    return false;
  }
}

const buildDecorations = ({ doc, mode, expanded }) => {
  const text = doc.toString();
  const builder = new RangeSetBuilder();
  if (mode === 'off-visible') {
    return builder.finish();
  }
  const regions = findRegions(text);
  regions.forEach((region, index) => {
    const hideMarkersOnly = mode === 'off'
      || (region.type === 'fold' && expanded.has(index));
    if (hideMarkersOnly) {
      for (const marker of [region.start, region.end]) {
        if (marker.from < marker.to) {
          const range = extendRange(text, marker.from, marker.to);
          builder.add(range.from, range.to, Decoration.replace({}));
        }
      }
      return;
    }
    const range = extendRange(text, region.start.from, region.end.to);
    if (region.type === 'hide') {
      builder.add(range.from, range.to, Decoration.replace({}));
    }
    else {
      builder.add(range.from, range.to, Decoration.replace({ widget: new FoldWidget(index) }));
    }
  });
  return builder.finish();
};

export const pragmas = (mode = 'on') => {
  const field = StateField.define({
    create(state) {
      return { expanded: new Set(), decorations: buildDecorations({ doc: state.doc, mode, expanded: new Set() }) };
    },
    update(value, transaction) {
      let expanded = value.expanded;
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
