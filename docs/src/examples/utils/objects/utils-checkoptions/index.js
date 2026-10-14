import { checkOptions, isFunction, isNumber, suggest } from '@semantic-ui/utils';

const spec = { retries: isNumber, timeout: isNumber, onError: isFunction, meta: true };

// a valid bag comes back as the same object
console.log(checkOptions({ retries: 3, meta: { team: 'ui' } }, spec));

// an unknown key lists the known ones
try {
  checkOptions({ retires: 3 }, spec, { name: 'createClient' });
}
catch (error) {
  console.log(error.message);
}

// hand it suggest and the message names the nearest key instead
try {
  checkOptions({ retires: 3 }, spec, { name: 'createClient', suggest });
}
catch (error) {
  console.log(error.message);
}

// a hint says what a refused value should have been, every problem on its own line
try {
  checkOptions({ timeout: '5s', onError: 'log' }, spec, { hints: { timeout: 'a number of milliseconds' } });
}
catch (error) {
  console.log(error.message);
}

// an undefined value counts as not provided, the spread-an-optional idiom
console.log(checkOptions({ timeout: undefined }, spec));

// onInvalid takes the message instead of the throw, console.warn for an advisory check
checkOptions({ retires: 3 }, spec, { onInvalid: console.warn });
