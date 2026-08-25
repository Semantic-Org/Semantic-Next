import { toByteSize } from '@semantic-ui/utils';

console.log(toByteSize('10mb'));
console.log(toByteSize('1.5 KB'));
console.log(toByteSize('2 gigabytes'));
console.log(toByteSize('10mib'));
console.log(toByteSize('10mb', { base: 1000 }));
console.log(toByteSize(1500));
console.log(toByteSize('1h'));
console.log(toByteSize('unlimited') ?? Infinity);
