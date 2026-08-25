import { formatByteSize } from '@semantic-ui/utils';

console.log(formatByteSize(512));
console.log(formatByteSize(1536));
console.log(formatByteSize(10485760));
console.log(formatByteSize(1234567, { decimals: 2 }));
console.log(formatByteSize(10485760, { iec: true }));
console.log(formatByteSize(1536, { unit: 'mb', decimals: 3 }));
console.log(formatByteSize(1500, { base: 1000 }));
console.log(formatByteSize(1536, { locale: 'de-DE' }));
console.log(formatByteSize('10mb'));
console.log(formatByteSize('banana'));
