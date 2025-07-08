import { oklchToRgb } from '@semantic-ui/utils';

console.log(oklchToRgb('oklch(0.7 0.15 180)'));
console.log(oklchToRgb('oklch(0.5 0.2 90)'));
console.log(oklchToRgb('oklch(0.8 0.1 270)'));

// with comma syntax
console.log(oklchToRgb('oklch(0.6, 0.18, 45)'));
