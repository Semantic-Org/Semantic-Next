import { isBinary } from '@semantic-ui/utils';

const uint8Array = new Uint8Array([1, 2, 3]);
const int16Array = new Int16Array([1, 2, 3]);
const float32Array = new Float32Array([1.1, 2.2, 3.3]);
const arrayBuffer = new ArrayBuffer(8);
const regularArray = [1, 2, 3];

console.log(isBinary(uint8Array));
console.log(isBinary(int16Array));
console.log(isBinary(float32Array));
console.log(isBinary(arrayBuffer));
console.log(isBinary(regularArray));
console.log(isBinary('binary'));
