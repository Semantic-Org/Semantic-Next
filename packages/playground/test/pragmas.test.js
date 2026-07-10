import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { describe, expect, it } from 'vitest';

import { pragmas } from '../src/editor/pragmas.js';

const create = (doc, mode = 'on') => EditorState.create({ doc, extensions: pragmas(mode) });

const decorationRanges = (state) => {
  const ranges = [];
  for (const value of state.facet(EditorView.decorations)) {
    const set = typeof value === 'function' ? value(new EditorView({ state })) : value;
    const cursor = set.iter();
    while (cursor.value) {
      ranges.push({ from: cursor.from, to: cursor.to });
      cursor.next();
    }
  }
  return ranges;
};

describe('pragmas', () => {
  it('hides a hide region and its markers', () => {
    const state = create(`before\n/* sui-hide */secret/* sui-hide-end */\nafter`);
    const ranges = decorationRanges(state);
    expect(ranges).toHaveLength(1);
    const hidden = state.sliceDoc(ranges[0].from, ranges[0].to);
    expect(hidden).toContain('secret');
    expect(hidden).toContain('sui-hide');
  });

  it('supports legacy playground-* keywords and html comment dialect', () => {
    const state = create(`<!-- playground-hide -->\n<head></head>\n<!-- playground-hide-end -->\n<body></body>`);
    const [range] = decorationRanges(state);
    expect(state.sliceDoc(range.from, range.to)).toContain('<head>');
  });

  it('survives nested regions without throwing, collapsing to the outermost', () => {
    const doc = `/* sui-fold */a\n/* sui-hide */b/* sui-hide-end */\nc/* sui-fold-end */rest`;
    const state = create(doc);
    const ranges = decorationRanges(state);
    expect(ranges).toHaveLength(1);
    // editing must not throw either — decorations rebuild per change
    expect(() => state.update({ changes: { from: doc.length, insert: 'x' } })).not.toThrow();
  });

  it('hides orphaned markers so pragma comments never render', () => {
    const state = create(`code\n/* sui-fold-end */\nmore`);
    const ranges = decorationRanges(state);
    expect(ranges).toHaveLength(1);
    expect(state.sliceDoc(ranges[0].from, ranges[0].to)).toContain('sui-fold-end');
  });

  it('hides only the marker itself while an open marker is unmatched', () => {
    const doc = `visible\n/* sui-hide */\nstill visible while typing`;
    const state = create(doc);
    const ranges = decorationRanges(state);
    expect(ranges).toHaveLength(1);
    expect(state.sliceDoc(ranges[0].from, ranges[0].to)).not.toContain('still visible');
  });

  it('renders nothing in off-visible mode', () => {
    const state = create(`/* sui-hide */x/* sui-hide-end */`, 'off-visible');
    expect(decorationRanges(state)).toHaveLength(0);
  });
});
