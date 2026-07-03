import { toBase64 } from '@semantic-ui/utils';

console.log(toBase64('hello'));
console.log(toBase64('héllo 👋'));
console.log(toBase64(new Uint8Array([1, 2, 3])));
console.log(toBase64('a?b>c', { urlSafe: true }));
