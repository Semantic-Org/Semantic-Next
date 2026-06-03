import { isStackCapture, isTracing, setStackCapture, setTracing } from '@semantic-ui/reactivity';

console.log(isTracing()); // false, off by default
setTracing(true);
console.log(isTracing()); // true, now in context mode

setStackCapture(true); // implies tracing, upgrades to stack mode
console.log(isStackCapture()); // true

setTracing(false); // off again, also clears stack capture
console.log(isTracing(), isStackCapture()); // false false
