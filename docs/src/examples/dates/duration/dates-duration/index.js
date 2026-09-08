import { duration } from '@semantic-ui/dates';

console.log(duration('1h 30m').toString());
console.log(duration('2 weeks and 3 days').toString());
console.log(duration('PT1H30M').toString());
console.log(duration({ hours: 1, minutes: 30 }).toString());
console.log(duration(90, 'minutes').toString());

// a bare number is milliseconds
console.log(duration(1500).toString());

// a fraction spills into the unit below
console.log(duration(1.5, 'days').toString());

// a length has one sign
console.log(duration('-1h 30m').toString());

// a loose read gives null rather than a throw for what is not a length
console.log(duration('soon', { loose: true }));
