import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { describe, expect, it } from 'vitest';

import { pragmas, visibleLineNumber } from '../src/editor/pragmas.js';

const create = (doc, mode = 'on') => EditorState.create({ doc, extensions: pragmas(mode) });

const numbering = (state, lines) => lines.map(line => visibleLineNumber(state, line));

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

describe('visibleLineNumber', () => {
  const doc = [
    'import { router } from "nav-router";',
    '',
    '/* playground-hide */',
    'const base = "/sandbox";',
    'history.replaceState(null, "", base);',
    '/* playground-hide-end */',
    'const app = router({ base });',
    'await app.start();',
  ].join('\n');

  it('numbers the lines the reader sees continuously across a hidden region', () => {
    const state = create(doc);
    expect(numbering(state, [1, 2, 7, 8])).toEqual([1, 2, 3, 4]);
  });

  it('counts only the line breaks inside a region that starts mid-line', () => {
    const state = create(`a /* playground-hide */b\nc/* playground-hide-end */ d\ne`);
    expect(numbering(state, [1, 3])).toEqual([1, 2]);
  });

  it('closes the gap a hidden marker line leaves when regions are shown', () => {
    const state = create(doc, 'off');
    expect(numbering(state, [1, 2, 4, 5, 7, 8])).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('keeps document numbering when nothing is hidden', () => {
    expect(numbering(create(doc, 'off-visible'), [1, 7, 8])).toEqual([1, 7, 8]);
    expect(numbering(create('one\ntwo'), [1, 2])).toEqual([1, 2]);
  });

  it('follows edits above a hidden region', () => {
    const state = create(doc).update({ changes: { from: 0, insert: 'const x = 1;\n' } }).state;
    expect(numbering(state, [1, 2, 3, 8, 9])).toEqual([1, 2, 3, 4, 5]);
  });
});
