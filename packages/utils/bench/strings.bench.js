import { bench, describe } from 'vitest';
import { camelToKebab, escapeHTML, kebabToCamel } from '../src/strings.js';

/*******************************
       Test Data — Realistic
*******************************/

// Attribute names — the hot path for camelToKebab/kebabToCamel
const camelAttrs = [
  'backgroundColor',
  'fontSize',
  'borderRadius',
  'marginTop',
  'paddingLeft',
  'textAlign',
  'fontWeight',
  'lineHeight',
];
const kebabAttrs = [
  'background-color',
  'font-size',
  'border-radius',
  'margin-top',
  'padding-left',
  'text-align',
  'font-weight',
  'line-height',
];

// Template text — the hot path for escapeHTML during SSR
const cleanText = 'This is a normal paragraph with no special characters at all';
const dirtyText = 'User said: "Hello <world> & \'goodbye\'!"';

/*******************************
         Benchmarks
*******************************/

describe('camelToKebab', () => {
  bench('single attr', () => {
    camelToKebab('backgroundColor');
  });
  bench('8 attrs', () => {
    for (let i = 0; i < camelAttrs.length; i++) { camelToKebab(camelAttrs[i]); }
  });
});

describe('kebabToCamel', () => {
  bench('single attr', () => {
    kebabToCamel('background-color');
  });
  bench('8 attrs', () => {
    for (let i = 0; i < kebabAttrs.length; i++) { kebabToCamel(kebabAttrs[i]); }
  });
});

describe('escapeHTML', () => {
  bench('clean string (no escapes)', () => {
    escapeHTML(cleanText);
  });
  bench('dirty string (needs escaping)', () => {
    escapeHTML(dirtyText);
  });
});
