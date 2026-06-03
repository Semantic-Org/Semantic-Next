import { reaction, signal } from '@semantic-ui/reactivity';

// --- Array Helpers ---
const numbers = signal([1, 2, 3]);
reaction(() => {
  console.log('Numbers:', numbers.get());
});
numbers.push(4); // Result: [1, 2, 3, 4]
numbers.setIndex(1, 20); // Result: [1, 20, 3, 4]
numbers.removeIndex(0); // Result: [20, 3, 4]

// --- Collection Helpers ---
const records = signal([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]);
reaction(() => {
  console.log('Records:', records.get());
});
// Update the 'name' property for the record at index 1 (or matching by ID in a real use-case)
records.setArrayProperty(1, 'name', 'Charlie');

// --- Boolean Helpers ---
const flag = signal(true);
reaction(() => {
  console.log('Flag:', flag.get());
});
flag.toggle(); // false
flag.toggle(); // true

// --- Number Helpers ---
const counter = signal(0);
reaction(() => {
  console.log('Counter:', counter.get());
});
counter.increment(); // 1
counter.increment(4); // 5
counter.decrement(); // 4

// --- Date Helpers ---
const currentTime = signal(null);
reaction(() => {
  console.log('Current Time:', currentTime.get());
});
currentTime.now(); // Sets currentTime to the current Date
