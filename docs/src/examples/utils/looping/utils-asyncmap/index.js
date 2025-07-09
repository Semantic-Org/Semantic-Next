import { asyncMap } from '@semantic-ui/utils';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // simulate async work

const arr = [1, 2, 3];
const result = await asyncMap(arr, async (value) => {
  await delay(100);
  return value * 2;
});

console.log('Array result:', result);

const obj = { a: 1, b: 2 };
const objResult = await asyncMap(obj, async (value, key) => {
  await delay(50);
  return `${key}-${value}`;
});

console.log('Object result:', objResult);
