import { bench, describe } from 'vitest';
import { isArray, isEmpty, isEqual, isPlainObject } from '../src/types.js';

/*******************************
       Test Data — Realistic
*******************************/

const emptyObj = {};
const filledObj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
const nullValObj = { a: null, b: null, c: null };
const emptyArr = [];
const filledArr = [1, 2, 3, 4, 5];
const plainObj = { key: 'value' };
const dateInstance = new Date();

/*******************************
         Benchmarks
*******************************/

describe('isEmpty', () => {
  bench('empty object', () => {
    isEmpty(emptyObj);
  });
  bench('5-key object', () => {
    isEmpty(filledObj);
  });
  bench('null-values object', () => {
    isEmpty(nullValObj);
  });
  bench('empty array', () => {
    isEmpty(emptyArr);
  });
  bench('5-element array', () => {
    isEmpty(filledArr);
  });
  bench('null', () => {
    isEmpty(null);
  });
  bench('empty string', () => {
    isEmpty('');
  });
});

describe('type checks (hot guards)', () => {
  bench('isPlainObject — plain', () => {
    isPlainObject(plainObj);
  });
  bench('isPlainObject — Date', () => {
    isPlainObject(dateInstance);
  });
  bench('isArray — array', () => {
    isArray(filledArr);
  });
  bench('isArray — object', () => {
    isArray(plainObj);
  });
});
