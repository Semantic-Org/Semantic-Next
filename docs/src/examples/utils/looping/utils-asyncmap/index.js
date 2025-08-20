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

console.log('--- Set mapping (returns array) ---');
const mySet = new Set(['apple', 'banana', 'cherry']);
const setResult = await asyncMap(mySet, async (value, index) => {
  await delay(25);
  return `${index}: ${value.toUpperCase()}`;
});
console.log('Set result:', setResult);

console.log('--- Map mapping (returns new Map) ---');
const myMap = new Map([
  ['user1', { name: 'John', score: 85 }],
  ['user2', { name: 'Jane', score: 92 }],
  ['user3', { name: 'Bob', score: 78 }],
]);
const mapResult = await asyncMap(myMap, async (user, userId) => {
  await delay(30);
  return {
    ...user,
    id: userId,
    grade: user.score >= 90 ? 'A' : user.score >= 80 ? 'B' : 'C',
  };
});
console.log('Map result:');
for (const [id, user] of mapResult) {
  console.log(`${id}:`, user);
}
