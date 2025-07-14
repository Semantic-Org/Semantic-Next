import { prettifyHash } from '@semantic-ui/utils';

// default 6-character padding
console.log(prettifyHash(0));
console.log(prettifyHash(123));
console.log(prettifyHash(456789));
console.log(prettifyHash(1000000));

// custom options
console.log(prettifyHash(123, { minLength: 8 }));
console.log(prettifyHash(123, { minLength: 4, padChar: 'X' }));
console.log(prettifyHash(123, { minLength: 1 }));
