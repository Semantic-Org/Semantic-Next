import { isPathKey } from '@semantic-ui/utils';

// a key carries any character except ']'
console.log(isPathKey('jack@semantic-ui.com'));
console.log(isPathKey('200.40.50'));
console.log(isPathKey('v 2.0 (beta)'));
console.log(isPathKey('lot]7'));

// the guard at a form boundary, where a typed id exists before any record does
const submitted = ['ACME-1', 'lot]7'];
for (const id of submitted) {
  console.log(id, isPathKey(id) ? 'addressable' : 'rejected');
}
