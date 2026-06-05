import { flush, guard, reaction, signal } from '@semantic-ui/reactivity';

const stringNumber = signal('');
const number = signal(null);

reaction(() => {
  // Guard prevents the number from triggering reactivity unless the parsed value changes
  const parsedNumber = guard(() => {
    const value = stringNumber.get();
    return Number(value.trim());
  });
  number.set(parsedNumber);
});

// Downstream reaction
reaction(() => {
  if (number.get()) {
    console.log(`Number is ${number.get()}`);
  }
});

// Set number
stringNumber.set('100');
flush(); // Logs: Processed value changed to: 100

// Change stringNumber in a way that does not change the processed number.
stringNumber.set('  100  ');
flush(); // No log, because 100 === 100

// Change stringNumber so that the processed number changes.
stringNumber.set('200');
flush(); // Logs: Processed value changed to: 200
