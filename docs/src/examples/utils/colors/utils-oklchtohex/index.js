import { oklchToHex } from '@semantic-ui/utils';

console.log(oklchToHex('oklch(0.7 0.15 180)'));
console.log(oklchToHex('oklch(0.5 0.2 90)'));
console.log(oklchToHex('oklch(0.8 0.1 270)'));

// passthrough for existing hex colors
console.log(oklchToHex('#ff5733'));
console.log(oklchToHex('#00ff00'));
