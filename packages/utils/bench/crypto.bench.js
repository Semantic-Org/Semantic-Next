import { bench, describe } from 'vitest';
import { generateId, hashCode, isValidId, parseId } from '../src/crypto.js';

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
// token, link, and code are minted rarely, so the checksum pass and longer body
// are not on any hot path. The shared entropy pool is what keeps the per-id draw
// near a memory read rather than a fresh getRandomValues syscall.
describe('generateId', () => {
  bench('page (8 char, hot path)', () => {
    generateId({ usage: 'page' });
  });
  bench('db (26 char ULID, hot path)', () => {
    generateId();
  });
  bench('link (11 char)', () => {
    generateId({ usage: 'link' });
  });
  bench('token (27 char + checksum)', () => {
    generateId({ usage: 'token' });
  });
  bench('code (12 char + checksum, grouped)', () => {
    generateId({ usage: 'code' });
  });
  bench('uuid (RFC v7)', () => {
    generateId({ format: 'uuid' });
  });
});

const dbId = generateId();
const tokenId = generateId({ usage: 'token', prefix: 'sk_' });

describe('isValidId', () => {
  bench('db (length + alphabet)', () => {
    isValidId(dbId, { usage: 'db' });
  });
  bench('token (+ checksum verify)', () => {
    isValidId(tokenId, { usage: 'token', prefix: 'sk_' });
  });
});

describe('parseId', () => {
  bench('db (+ timestamp decode)', () => {
    parseId(dbId, { usage: 'db' });
  });
});
