import {
  asyncEach,
  asyncMap,
  each,
} from '@semantic-ui/utils';

import { describe, expect, it, vi } from 'vitest';

describe('iterators', () => {
  describe('each', () => {
    describe('Array iteration', () => {
      it('should iterate over all elements', () => {
        const array = [1, 2, 3];
        const spy = vi.fn();
        each(array, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenNthCalledWith(1, 1, 0, array);
        expect(spy).toHaveBeenNthCalledWith(2, 2, 1, array);
        expect(spy).toHaveBeenNthCalledWith(3, 3, 2, array);
      });

      it('should break early if the callback returns false', () => {
        const array = [1, 2, 3];
        const spy = vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
        each(array, spy);
        expect(spy).toHaveBeenCalledTimes(2);
      });
    });

    describe('Object iteration', () => {
      it('should iterate over all properties', () => {
        const obj = { a: 1, b: 2, c: 3 };
        const spy = vi.fn();
        each(obj, spy);
        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenCalledWith(1, 'a', obj);
        expect(spy).toHaveBeenCalledWith(2, 'b', obj);
        expect(spy).toHaveBeenCalledWith(3, 'c', obj);
      });

      it('should break early if the callback returns false', () => {
        const obj = { a: 1, b: 2, c: 3 };
        const spy = vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
        each(obj, spy);
        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('should not iterate over non-enumerable properties', () => {
        const obj = { a: 1, b: 2 };
        Object.defineProperty(obj, 'c', {
          value: 3,
          enumerable: false,
        });
        const spy = vi.fn();
        each(obj, spy);
        expect(spy).toHaveBeenCalledTimes(2); // should not include non-enumerable 'c'
        expect(spy).toHaveBeenCalledWith(1, 'a', obj);
        expect(spy).toHaveBeenCalledWith(2, 'b', obj);
        expect(spy).not.toHaveBeenCalledWith(3, 'c', obj); // ensure 'c' is not iterated
      });
    });

    it('should handle null/undefined gracefully', () => {
      const spy = vi.fn();
      each(null, spy);
      each(undefined, spy);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('asyncEach', () => {
    it('should iterate over an array asynchronously', async () => {
      const array = [1, 2, 3];
      const spy = vi.fn();
      await asyncEach(array, spy);
      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenNthCalledWith(1, 1, 0, array);
      expect(spy).toHaveBeenNthCalledWith(2, 2, 1, array);
      expect(spy).toHaveBeenNthCalledWith(3, 3, 2, array);
    });

    it('should handle null/undefined gracefully', async () => {
      const spy = vi.fn();
      await asyncEach(null, spy);
      await asyncEach(undefined, spy);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('asyncMap', () => {
    it('should map an array asynchronously', async () => {
      const array = [1, 2, 3];
      const result = await asyncMap(array, async (value) => value * 2);
      expect(result).toEqual([2, 4, 6]);
    });

    it('should map an object asynchronously', async () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = await asyncMap(obj, async (value) => value * 2);
      expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });

    it('should handle null/undefined gracefully', async () => {
      const result1 = await asyncMap(null, async (value) => value);
      expect(result1).toBeNull();
      const result2 = await asyncMap(undefined, async (value) => value);
      expect(result2).toBeUndefined();
    });
  });
});
