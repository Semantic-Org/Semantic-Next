import { camelToKebab } from '@semantic-ui/utils';

// Standard conversion
console.log(camelToKebab('backgroundColor'));
console.log(camelToKebab('myComponentName'));

// Underscore-digit decoded back to hyphen-digit
console.log(camelToKebab('grid_2x2'));
console.log(camelToKebab('heading_1'));

// Consecutive uppercase
console.log(camelToKebab('arrowDownAZ'));
