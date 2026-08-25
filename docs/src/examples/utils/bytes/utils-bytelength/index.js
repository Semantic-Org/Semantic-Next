import { byteLength, toByteSize } from '@semantic-ui/utils';

console.log(byteLength('hello'));
console.log(byteLength('héllo'));
console.log(byteLength('👋'));
console.log(byteLength(new Float32Array(2)));
console.log(byteLength({}));

const body = JSON.stringify({ name: 'Jack', tags: ['a', 'b'] });
console.log(byteLength(body) > toByteSize('1kb'));
