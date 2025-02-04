import { Signal } from '@semantic-ui/reactivity';

const isActive = new Signal(false);

console.log(isActive.get()); // Output: false

isActive.toggle();
console.log(isActive.get()); // Output: true

isActive.toggle();
console.log(isActive.get()); // Output: false
