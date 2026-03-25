import { kebabToCamel } from '@semantic-ui/utils';

// Standard conversion
console.log(kebabToCamel('background-color'));
console.log(kebabToCamel('my-component-name'));

// Digit-leading segments use underscore
console.log(kebabToCamel('grid-2x2'));
console.log(kebabToCamel('heading-1'));

// Single-letter segments
console.log(kebabToCamel('arrow-down-a-z'));
