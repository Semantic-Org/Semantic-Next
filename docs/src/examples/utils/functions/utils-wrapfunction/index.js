import { wrapFunction } from '@semantic-ui/utils';

// wrapping a function returns the function
const fn = (x) => x * 2;
const wrappedFn = wrapFunction(fn);
console.log(wrappedFn(5));

// wrapping a value returns a function that returns that value
const value = 'hello';
const wrappedValue = wrapFunction(value);
console.log(wrappedValue());

// practical use - no need for conditional checks
function process(data, transform) {
  const safeFn = wrapFunction(transform);
  return safeFn(data);
}

console.log(process('world', (x) => `Hello ${x}`));
console.log(process('world', 'static result'));
