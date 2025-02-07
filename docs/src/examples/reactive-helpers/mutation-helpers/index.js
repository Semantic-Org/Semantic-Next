import { Signal, Reaction } from '@semantic-ui/reactivity';

// --- Array Helpers ---
const numbers = new Signal([1, 2, 3]);
Reaction.create(() => {
  console.log('Numbers:', numbers.get());
});
numbers.push(4);          // Result: [1, 2, 3, 4]
numbers.setIndex(1, 20);   // Result: [1, 20, 3, 4]
numbers.removeIndex(0);    // Result: [20, 3, 4]

// --- Collection Helpers ---
const records = new Signal([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]);
Reaction.create(() => {
  console.log('Records:', records.get());
});
// Update the 'name' property for the record at index 1 (or matching by ID in a real use-case)
records.setArrayProperty(1, 'name', 'Charlie');

// --- Boolean Helpers ---
const flag = new Signal(true);
Reaction.create(() => {
  console.log('Flag:', flag.get());
});
flag.toggle(); // false
flag.toggle(); // true

// --- Number Helpers ---
const counter = new Signal(0);
Reaction.create(() => {
  console.log('Counter:', counter.get());
});
counter.increment();    // 1
counter.increment(4);   // 5
counter.decrement();    // 4

// --- Date Helpers ---
const currentTime = new Signal(null);
Reaction.create(() => {
  console.log('Current Time:', currentTime.get());
});
currentTime.now(); // Sets currentTime to the current Date
