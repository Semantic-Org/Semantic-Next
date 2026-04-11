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

/*******************************
         Benchmarks
*******************************/

describe('clone', () => {
  bench('flat 8-key object', () => {
    clone(flatSettings);
  });
  bench('20-key wide object', () => {
    clone(wideSettings);
  });
  bench('nested state with arrays', () => {
    clone(nestedState);
  });
  bench('mixed types (Date, RegExp, Set, Map)', () => {
    clone(mixedTypes);
  });
});
