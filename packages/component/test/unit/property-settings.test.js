import { describe, expect, it } from 'vitest';
import { getPropertySettings } from '../../src/component-helpers.js';

const converterFor = (type) => getPropertySettings({ name: 'test', type }).converter;

describe('getPropertySettings converters', () => {
  describe('Boolean', () => {
    const { fromAttribute, toAttribute } = converterFor(Boolean);

    it('reads attribute presence as true', () => {
      expect(fromAttribute('')).toBe(true);
    });

    it('reads the generous boolean vocabulary', () => {
      expect(fromAttribute('true')).toBe(true);
      expect(fromAttribute('yes')).toBe(true);
      expect(fromAttribute('on')).toBe(true);
      expect(fromAttribute('1')).toBe(true);
      expect(fromAttribute('false')).toBe(false);
      expect(fromAttribute('no')).toBe(false);
      expect(fromAttribute('off')).toBe(false);
      expect(fromAttribute('disabled')).toBe(false);
      expect(fromAttribute('0')).toBe(false);
      expect(fromAttribute('null')).toBe(false);
      expect(fromAttribute('undefined')).toBe(false);
    });

    it('reads attribute removal as false', () => {
      expect(fromAttribute(null)).toBe(false);
    });

    it('falls back to truthiness for unrecognized values, always a real boolean', () => {
      expect(fromAttribute('banana')).toBe(true);
    });

    it('serializes to the attribute as a string', () => {
      expect(toAttribute(true)).toBe('true');
      expect(toAttribute(false)).toBe('false');
    });
  });

  describe('Number', () => {
    const { fromAttribute, toAttribute } = converterFor(Number);

    it('parses numeric attribute strings', () => {
      expect(fromAttribute('42')).toBe(42);
      expect(fromAttribute('3.5')).toBe(3.5);
      expect(fromAttribute('-7')).toBe(-7);
    });

    it('lands null for unparseable values, never a poison number', () => {
      expect(fromAttribute('abc')).toBe(null);
      expect(fromAttribute('')).toBe(null);
      expect(fromAttribute('1e999')).toBe(null);
    });

    it('preserves null for attribute removal', () => {
      expect(fromAttribute(null)).toBe(null);
    });

    it('serializes numbers and removes the attribute for nullish', () => {
      expect(toAttribute(42)).toBe('42');
      expect(toAttribute(null)).toBe(null);
      expect(toAttribute(undefined)).toBe(null);
    });
  });

  describe('Object and Array', () => {
    const { fromAttribute, toAttribute } = converterFor(Object);

    it('round-trips JSON through the attribute', () => {
      expect(fromAttribute(toAttribute({ a: 1 }))).toEqual({ a: 1 });
      expect(fromAttribute(toAttribute([1, 2]))).toEqual([1, 2]);
    });

    it('reads malformed JSON as null', () => {
      expect(fromAttribute('{not json')).toBe(null);
    });

    it('drops the attribute for circular values rather than throwing', () => {
      const circular = {};
      circular.self = circular;
      expect(toAttribute(circular)).toBe(null);
    });
  });

  describe('Function and propertyOnly', () => {
    it('never reflects to an attribute', () => {
      expect(getPropertySettings({ name: 'test', type: Function }).attribute).toBe(false);
      expect(getPropertySettings({ name: 'test', type: String, propertyOnly: true }).attribute).toBe(false);
    });
  });
});
