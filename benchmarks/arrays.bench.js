import { bench, describe } from 'vitest';
import {
  difference,
  flatten,
  groupBy,
  intersection,
  range,
  sortBy,
  unique,
  uniqueItems,
} from '../packages/utils/src/arrays.js';

describe('array utilities', () => {
  const smallArray = range(0, 20);
  const mediumArray = range(0, 100);
  const largeArray = range(0, 500);

  bench('unique - small array', () => {
    unique([...smallArray, ...smallArray]);
  });

  bench('unique - medium array', () => {
    unique([...mediumArray, ...mediumArray]);
  });

  bench('flatten - nested arrays', () => {
    const nested = [[1, 2], [3, 4], [[5, 6], [7, 8]], [9, 10]];
    flatten(nested);
  });

  bench('flatten - deeply nested', () => {
    const nested = [[[[[1, 2]]], [[3, 4]]], [[[5, 6]], [[7, 8]]]];
    flatten(nested);
  });

  bench('sortBy - numeric property', () => {
    const data = mediumArray.map((i) => ({ id: i, value: Math.random() }));
    sortBy(data, 'value');
  });

  bench('sortBy - multiple keys', () => {
    const data = mediumArray.map((i) => ({
      category: i % 5,
      priority: i % 3,
      value: Math.random(),
    }));
    sortBy(data, ['category', 'priority', 'value']);
  });

  bench('groupBy - small dataset', () => {
    const data = smallArray.map((i) => ({ category: i % 5, value: i }));
    groupBy(data, 'category');
  });

  bench('groupBy - large dataset', () => {
    const data = largeArray.map((i) => ({ category: i % 10, value: i }));
    groupBy(data, 'category');
  });

  bench('intersection - small arrays', () => {
    const arr1 = range(0, 20);
    const arr2 = range(10, 30);
    const arr3 = range(15, 35);
    intersection(arr1, arr2, arr3);
  });

  bench('intersection - largearrays', () => {
    const arr1 = range(0, 200);
    const arr2 = range(100, 300);
    const arr3 = range(150, 350);
    intersection(arr1, arr2, arr3);
  });

  bench('difference - small arrays', () => {
    const arr1 = range(0, 20);
    const arr2 = range(10, 30);
    difference(arr1, arr2);
  });

  bench('difference - large arrays', () => {
    const arr1 = range(0, 200);
    const arr2 = range(100, 300);
    difference(arr1, arr2);
  });

  bench('uniqueItems - multiple arrays', () => {
    const arr1 = range(0, 30);
    const arr2 = range(20, 50);
    const arr3 = range(40, 70);
    uniqueItems(arr1, arr2, arr3);
  });
});
