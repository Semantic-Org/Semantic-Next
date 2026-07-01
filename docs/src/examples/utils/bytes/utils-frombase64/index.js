import { fromBase64 } from '@semantic-ui/utils';

console.log(fromBase64('aGVsbG8='));
console.log(fromBase64('aMOpbGxv'));
console.log(fromBase64('AQID', { as: 'bytes' }));
console.log(fromBase64('YT9iPmM'));
