import { assertOptions, isFunction, isNumber } from '@semantic-ui/utils';

const spec = { retries: isNumber, timeout: isNumber, onError: isFunction, meta: true };

// a valid bag comes back as the same object
console.log(assertOptions({ retries: 3, meta: { team: 'ui' } }, spec));

// a typo names the nearest known key
try {
  assertOptions({ retires: 3 }, spec, { name: 'createClient' });
}
catch (error) {
  console.log(error.message);
}

// a hint says what a refused value should have been
try {
  assertOptions({ timeout: '5s' }, spec, { name: 'createClient', hints: { timeout: 'a number of milliseconds' } });
}
catch (error) {
  console.log(error.message);
}

// every problem at once, each with its structured form
try {
  assertOptions({ retires: 3, onError: 'log' }, spec);
}
catch (error) {
  console.log(error.problems.map(({ key, kind }) => `${kind} ${key}`));
}

// an undefined value counts as not provided, the spread-an-optional idiom
console.log(assertOptions({ timeout: undefined }, spec));

// warn reports and carries on, a callback gets the problems to render
assertOptions({ retires: 3 }, spec, { onInvalid: 'warn' });
assertOptions({ retires: 3 }, spec, { onInvalid: (problems) => console.log(problems[0].suggestion) });

// allowUnknown judges only the listed keys, for a bag that is mostly someone else's
console.log(assertOptions({ PORT: 3000, HOME: '/root' }, { PORT: isNumber }, { allowUnknown: true }));
