import { bench, describe } from 'vitest';
import { generateID, hashCode, isValidID, parseID } from '../src/crypto.js';

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

/*******************************
         Benchmarks
*******************************/

describe('hashCode', () => {
  bench('short CSS (~40 chars)', () => {
    hashCode(shortCSS);
  });
  bench('medium CSS (~500 chars)', () => {
    hashCode(mediumCSS);
  });
});

// page and db are the hot tiers — minted per template instance and per record.
// token and slug are minted rarely, so the checksum pass and longer body are
// not on any hot path. The shared entropy pool is what keeps the per-id draw
// near a memory read rather than a fresh getRandomValues syscall.
describe('generateID', () => {
  bench('page (8 char, hot path)', () => {
    generateID({ usage: 'page' });
  });
  bench('db (26 char ULID, hot path)', () => {
    generateID();
  });
  bench('slug (11 char)', () => {
    generateID({ usage: 'slug' });
  });
  bench('token (27 char + checksum)', () => {
    generateID({ usage: 'token' });
  });
  bench('uuid (RFC v7)', () => {
    generateID({ format: 'uuid' });
  });
});

const dbID = generateID();
const tokenID = generateID({ usage: 'token', prefix: 'sk_' });

describe('isValidID', () => {
  bench('db (length + alphabet)', () => {
    isValidID(dbID, { usage: 'db' });
  });
  bench('token (+ checksum verify)', () => {
    isValidID(tokenID, { usage: 'token', prefix: 'sk_' });
  });
});

describe('parseID', () => {
  bench('db (+ timestamp decode)', () => {
    parseID(dbID, { usage: 'db' });
  });
});
