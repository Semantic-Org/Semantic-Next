import { roundNumber, sum } from '@semantic-ui/utils';

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

  describe('sum', () => {
    it('should return the sum of an array of numbers', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
    });

    it('should return 0 for an empty array', () => {
      expect(sum([])).toBe(0);
    });
  });
});
