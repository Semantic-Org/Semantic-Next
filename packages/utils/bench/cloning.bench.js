import { bench, describe } from 'vitest';
import { clone } from '../src/cloning.js';

/*******************************
       Test Data — Realistic
*******************************/

const flatSettings = {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  icon: 'check',
  label: 'Submit',
  className: 'ui primary button',
};

const nestedState = {
  config: { theme: 'dark', locale: 'en-US', debug: false },
  layout: { columns: 3, gap: '1rem', padding: '2rem' },
  items: [
    { id: 1, name: 'First', active: true, meta: { tags: ['a', 'b'] } },
    { id: 2, name: 'Second', active: false, meta: { tags: ['c'] } },
    { id: 3, name: 'Third', active: true, meta: { tags: ['d', 'e', 'f'] } },
  ],
  metadata: { version: 2, updatedAt: new Date('2024-01-01') },
};

const wideSettings = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 'six',
  g: 'seven',
  h: 'eight',
  i: 'nine',
  j: 'ten',
  k: true,
  l: false,
  m: null,
  n: 'fourteen',
  o: 'fifteen',
  p: 16,
  q: 17,
  r: 18,
  s: 19,
  t: 20,
};

const mixedTypes = {
  date: new Date(),
  regex: /test-pattern/gi,
  array: [1, [2, 3], { nested: true }],
  set: new Set([1, 2, 3]),
  map: new Map([['key', 'value']]),
};

// Deep tree: boundary-call cost of structuredClone is roughly fixed per call,
// so a large structure is where it can amortize that overhead against the
// hand-rolled recursive walk. Built from plain objects/arrays only so both
// paths produce equivalent results.
const deepTree = (() => {
  const make = (depth) => {
    if (depth === 0) { return { leaf: true, n: depth, tag: 'end' }; }
    return {
      depth,
      label: `node-${depth}`,
      children: [make(depth - 1), make(depth - 1)],
      values: [depth, depth * 2, depth * 3],
    };
  };
  return make(10);
})();

// TypedArray-bearing shape. NOTE: clone() does not currently preserve typed
// arrays (they fall through to the plain-object branch and get mangled into
// index-keyed objects), so this pair is a correctness contrast, not a like-for-
// like speed comparison. structuredClone is the only correct option here.
const typedData = {
  weights: new Float64Array(1024),
  ids: new Int32Array(1024),
  label: 'layer-weights',
};

/*******************************
         Benchmarks
*******************************/

// Grouped by shape so vitest's comparative reporter shows clone vs
// structuredClone relative within each block.

describe('flat 8-key object', () => {
  bench('clone', () => {
    clone(flatSettings);
  });
  bench('structuredClone', () => {
    structuredClone(flatSettings);
  });
});

describe('20-key wide object', () => {
  bench('clone', () => {
    clone(wideSettings);
  });
  bench('structuredClone', () => {
    structuredClone(wideSettings);
  });
});

describe('nested state with arrays', () => {
  bench('clone', () => {
    clone(nestedState);
  });
  bench('structuredClone', () => {
    structuredClone(nestedState);
  });
});

describe('mixed types (Date, RegExp, Set, Map)', () => {
  bench('clone', () => {
    clone(mixedTypes);
  });
  bench('structuredClone', () => {
    structuredClone(mixedTypes);
  });
});

describe('deep tree (depth 10)', () => {
  bench('clone', () => {
    clone(deepTree);
  });
  bench('structuredClone', () => {
    structuredClone(deepTree);
  });
});

describe('typed arrays (correctness contrast)', () => {
  bench('clone', () => {
    clone(typedData);
  });
  bench('structuredClone', () => {
    structuredClone(typedData);
  });
});
