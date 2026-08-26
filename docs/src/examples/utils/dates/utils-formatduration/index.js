import { formatDuration, toDuration } from '@semantic-ui/utils';

console.log(formatDuration(500));
console.log(formatDuration(5000));
console.log(formatDuration(300000));
console.log(formatDuration(90000));
console.log(formatDuration(5400000));
console.log(formatDuration(-90000));

// decimals is a maximum, a value that rounds up to a whole unit promotes
console.log(formatDuration(1234567, { decimals: 3 }));
console.log(formatDuration(3598200));

// hold one unit down a column, printed as spelled
console.log(formatDuration(90000, { unit: 's' }));
console.log(formatDuration(90000, { unit: 'minutes', separator: ' ' }));

// reads anything toDuration reads, and everything it prints reads back
console.log(formatDuration('90s'));
console.log(toDuration(formatDuration(300000)));

// the default rounds. lossless picks the largest unit that reads back exactly
console.log(formatDuration(100000));
console.log(formatDuration(100000, { lossless: true }));
console.log(toDuration(formatDuration(100000, { lossless: true })));

console.log(formatDuration('banana'));
