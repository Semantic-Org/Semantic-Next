import { isEmpty } from '@semantic-ui/utils';

console.log(isEmpty(null));
console.log(isEmpty(undefined));
console.log(isEmpty([]));
console.log(isEmpty(''));
console.log(isEmpty({}));
console.log(isEmpty({ a: null }));
console.log(isEmpty({ a: 1 }));
console.log(isEmpty({ a: 0 }));
