import { isSet } from '@semantic-ui/utils';

console.log('--- Testing Set instances ---');
console.log('isSet(new Set()):', isSet(new Set()));
console.log('isSet(new Set([1, 2, 3])):', isSet(new Set([1, 2, 3])));
console.log('isSet(new Set(["a", "b", "c"])):', isSet(new Set(['a', 'b', 'c'])));

console.log('--- Testing non-Set values ---');
console.log('isSet([]):', isSet([]));
console.log('isSet({}):', isSet({}));
console.log('isSet(new Map()):', isSet(new Map()));
console.log('isSet("set"):', isSet('set'));
console.log('isSet(123):', isSet(123));
console.log('isSet(null):', isSet(null));
console.log('isSet(undefined):', isSet(undefined));

console.log('--- Practical usage ---');
function processCollection(collection) {
  if (isSet(collection)) {
    console.log(`Processing Set with ${collection.size} unique items`);
    for (const item of collection) {
      console.log(`- ${item}`);
    }
  }
  else {
    console.log('Not a Set, cannot process as Set collection');
  }
}

const mySet = new Set(['apple', 'banana', 'cherry']);
const myArray = ['apple', 'banana', 'cherry'];

processCollection(mySet);
processCollection(myArray);
