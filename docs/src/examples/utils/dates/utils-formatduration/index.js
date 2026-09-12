import { formatDuration, toDuration } from '@semantic-ui/utils';

// the default reads the way a person says it, the two largest whole units
console.log(formatDuration(500));
console.log(formatDuration(5000));
console.log(formatDuration(300000));
console.log(formatDuration(242100));
console.log(formatDuration(3900000));
console.log(formatDuration(-90000));

// the clock form, the way a lap time reads
console.log(formatDuration(390000, { format: 'clock' }));
console.log(formatDuration(3900000, { format: 'clock' }));

// the decimal form: decimals is a maximum, a value that rounds up to a whole unit promotes
console.log(formatDuration(90000, { format: 'decimal' }));
console.log(formatDuration(1234567, { format: 'decimal', decimals: 3 }));
console.log(formatDuration(3598200, { format: 'decimal' }));

// hold one unit down a column, printed as spelled
console.log(formatDuration(90000, { format: 'decimal', unit: 's' }));
console.log(formatDuration(90000, { format: 'decimal', unit: 'minutes', separator: ' ' }));

// reads anything toDuration reads, and everything the decimal form prints reads back
console.log(formatDuration('90s'));
console.log(toDuration(formatDuration(300000, { format: 'decimal' })));

// the decimal form rounds. lossless picks the largest unit that reads back exactly
console.log(formatDuration(100000, { format: 'decimal' }));
console.log(formatDuration(100000, { format: 'decimal', lossless: true }));
console.log(toDuration(formatDuration(100000, { format: 'decimal', lossless: true })));

console.log(formatDuration('banana'));
