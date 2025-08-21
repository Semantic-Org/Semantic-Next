import { isMap } from '@semantic-ui/utils';

console.log('--- Testing Map instances ---');
console.log('isMap(new Map()):', isMap(new Map()));
console.log('isMap(new Map([["a", 1], ["b", 2]])):', isMap(new Map([['a', 1], ['b', 2]])));

console.log('--- Testing non-Map values ---');
console.log('isMap({}):', isMap({}));
console.log('isMap([]):', isMap([]));
console.log('isMap(new Set()):', isMap(new Set()));
console.log('isMap("map"):', isMap('map'));
console.log('isMap(123):', isMap(123));
console.log('isMap(null):', isMap(null));
console.log('isMap(undefined):', isMap(undefined));

console.log('--- Objects with Map-like methods ---');
const mapLikeObject = {
  set: () => {},
  get: () => {},
  has: () => {},
  delete: () => {},
  size: 0,
};
console.log('isMap(mapLikeObject):', isMap(mapLikeObject));

console.log('--- Practical usage ---');
function processKeyValueStore(store) {
  if (isMap(store)) {
    console.log(`Processing Map with ${store.size} entries`);
    for (const [key, value] of store) {
      console.log(`- ${key}: ${value}`);
    }
  }
  else {
    console.log('Not a Map, cannot iterate with Map methods');
  }
}

const userMap = new Map([
  ['user1', { name: 'John', age: 25 }],
  ['user2', { name: 'Jane', age: 30 }],
]);
const userObject = {
  user1: { name: 'John', age: 25 },
  user2: { name: 'Jane', age: 30 },
};

processKeyValueStore(userMap);
processKeyValueStore(userObject);
