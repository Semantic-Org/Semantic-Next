import { describe, expect, it } from 'vitest';
import { lisIndices } from '../../src/shared/lis.js';

const pick = (values, idx) => idx.map((i) => values[i]);
const strictlyIncreasing = (a) => a.every((v, i) => i === 0 || a[i - 1] < v);

describe('lisIndices', () => {
  it('is empty for empty input', () => {
    expect(lisIndices([])).toEqual([]);
  });

  it('returns the lone index for a single element', () => {
    expect(lisIndices([7])).toEqual([0]);
  });

  it('keeps every index when already ascending', () => {
    expect(lisIndices([0, 1, 2, 3])).toEqual([0, 1, 2, 3]);
  });

  it('keeps a single index when strictly descending', () => {
    expect(lisIndices([3, 2, 1, 0])).toHaveLength(1);
  });

  it('returns ascending indices selecting a strictly-increasing, maximal subsequence', () => {
    const values = [2, 1, 5, 3, 4, 7, 6];
    const idx = lisIndices(values);
    expect(idx).toEqual([...idx].sort((a, b) => a - b));
    expect(strictlyIncreasing(pick(values, idx))).toBe(true);
    expect(idx).toHaveLength(4); // e.g. values 1,3,4,6
  });
});
