import { memoize } from '@semantic-ui/utils';

// expensive function to demonstrate memoization
function expensiveFunction(a, b, c) {
  console.log('Computing expensive result...');
  return a * b * c;
}

const memoizedFn = memoize(expensiveFunction);

console.log('First call:');
console.log(memoizedFn(2, 3, 4));

console.log('Second call with same args:');
console.log(memoizedFn(2, 3, 4));

console.log('Third call with different args:');
console.log(memoizedFn(1, 2, 3));

// with custom hash function
const customMemoized = memoize(expensiveFunction, (args) => args.join('-'));
console.log('Custom hash function:');
console.log(customMemoized(5, 6, 7));
