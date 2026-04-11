import { roundDecimal, roundNumber } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('Number Utilities', () => {
  describe('roundNumber', () => {
    it('should round numbers to the specified number of significant digits', () => {
      expect(roundNumber(123.456789, 4)).toBe(123.5);
      expect(roundNumber(0.00123456789, 3)).toBe(0.00123);
    });

    it('should handle negative numbers correctly', () => {
      expect(roundNumber(-123.456789, 4)).toBe(-123.5);
      expect(roundNumber(-0.00123456789, 3)).toBe(-0.00123);
    });

    it('should return the original number if it is not a finite number', () => {
      expect(roundNumber(Infinity, 3)).toBe(Infinity);
      expect(roundNumber(NaN, 3)).toBe(NaN);
    });

    it('should return the number unchanged if digits is not a positive integer', () => {
      expect(roundNumber(123.456, 0)).toBe(123.456);
    });

    it('should return the original number if it is not a number', () => {
      expect(roundNumber('not a number', 3)).toBe('not a number');
    });

    it('should handle very large and very small numbers correctly', () => {
      expect(roundNumber(123456789, 3)).toBe(123000000);
      expect(roundNumber(0.000000123456789, 5)).toBe(0.00000012346);
    });
  });

  describe('roundDecimal', () => {
    it('should round numbers to the specified number of decimal places', () => {
      expect(roundDecimal(123.456789, 2)).toBe(123.46);
      expect(roundDecimal(123.456789, 3)).toBe(123.457);
      expect(roundDecimal(123.456789, 0)).toBe(123);
    });

    it('should handle negative numbers correctly', () => {
      expect(roundDecimal(-123.456789, 2)).toBe(-123.46);
      expect(roundDecimal(-0.123456789, 3)).toBe(-0.123);
    });

    it('should return 0 for input 0', () => {
      expect(roundDecimal(0, 2)).toBe(0);
      expect(roundDecimal(0.0, 5)).toBe(0);
    });

    it('should return the original number if it is not a finite number', () => {
      expect(roundDecimal(Infinity, 2)).toBe(Infinity);
      expect(roundDecimal(NaN, 2)).toBe(NaN);
    });

    it('should return the number unchanged if decimals is negative', () => {
      expect(roundDecimal(123.456, -1)).toBe(123.456);
      expect(roundDecimal(123.456, -5)).toBe(123.456);
    });

    it('should return the original number if it is not a number', () => {
      expect(roundDecimal('not a number', 2)).toBe('not a number');
      expect(roundDecimal(null, 2)).toBe(null);
      expect(roundDecimal(undefined, 2)).toBe(undefined);
    });

    it('should use default of 2 decimal places when not specified', () => {
      expect(roundDecimal(123.456789)).toBe(123.46);
      expect(roundDecimal(9.876)).toBe(9.88);
    });

    it('should handle very small and large decimal places', () => {
      expect(roundDecimal(1.123456789, 6)).toBe(1.123457);
      expect(roundDecimal(999.999999, 1)).toBe(1000.0);
    });
  });
});

describe('roundNumber — zero input', () => {
  it('should return 0 for zero input', () => {
    expect(roundNumber(0)).toBe(0);
    expect(roundNumber(0, 3)).toBe(0);
  });

  it('should return 0 for roundDecimal(0)', () => {
    expect(roundDecimal(0)).toBe(0);
    expect(roundDecimal(0, 5)).toBe(0);
  });
});
