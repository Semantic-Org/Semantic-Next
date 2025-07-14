import { roundNumber } from '@semantic-ui/utils';

// default 5 significant digits
console.log(roundNumber(3.14159));
console.log(roundNumber(123.456));
console.log(roundNumber(0.000123));
console.log(roundNumber(999999.999));

// with custom digits
console.log(roundNumber(3.14159, 2));
console.log(roundNumber(123.456, 3));
