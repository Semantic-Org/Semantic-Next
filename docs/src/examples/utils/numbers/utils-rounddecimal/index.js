import { roundDecimal } from '@semantic-ui/utils';

// default 2 decimal places
console.log(roundDecimal(3.14159));
console.log(roundDecimal(123.456789));
console.log(roundDecimal(1.005));
console.log(roundDecimal(99.999));

// with custom decimal places
console.log(roundDecimal(3.14159, 3));
console.log(roundDecimal(123.456, 1));
