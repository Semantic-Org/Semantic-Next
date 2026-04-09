import { bench, describe } from 'vitest';
import { hashCode, tokenize } from '../src/crypto.js';

/*******************************
       Test Data — Realistic
*******************************/

// CSS string — hashCode's primary use case (stylesheet dedup)
const shortCSS = '.button { color: red; font-size: 14px; }';
const mediumCSS = `
.ui.button { display: inline-flex; align-items: center; justify-content: center;
  padding: 0.75em 1.5em; font-size: 1rem; font-weight: 600; line-height: 1;
  border-radius: 0.375rem; border: none; cursor: pointer; transition: all 0.2s; }
.ui.button:hover { filter: brightness(1.1); }
.ui.button:active { transform: scale(0.98); }
.ui.button.primary { background: var(--primary); color: white; }
.ui.button.secondary { background: var(--secondary); color: white; }
`;

// Component names — tokenize's primary use case
const componentNames = [
  'My Custom Button',
  'dropdown-menu',
  'FormField_Input',
  'sidebar navigation',
  'Modal__Overlay',
];

/*******************************
         Benchmarks
*******************************/

describe('hashCode (default fast path)', () => {
  bench('short CSS (~40 chars)', () => {
    hashCode(shortCSS);
  });
  bench('medium CSS (~500 chars)', () => {
    hashCode(mediumCSS);
  });
});

describe('tokenize', () => {
  bench('5 component names', () => {
    for (let i = 0; i < componentNames.length; i++) { tokenize(componentNames[i]); }
  });
});
