import { Signal, Reaction } from '@semantic-ui/reactivity';

const stringNumber = new Signal('');
const number = new Signal(null);

Reaction.create(() => {
  // Guard prevents the number from triggering reactivity unless the parsed value changes
  const parsedNumber = Reaction.guard(() => {
    const value = stringNumber.get();
    return Number(value.trim());
  });
  number.set(parsedNumber);
});

// Downstream reaction
Reaction.create(() => {
  if(number.get()) {
    console.log(`Number is ${number.get()}`);
  }
});

// Set number
stringNumber.set('100');
Reaction.flush(); // Logs: Processed value changed to: 100

// Change stringNumber in a way that does not change the processed number.
stringNumber.set('  100  ');
Reaction.flush(); // No log, because 100 === 100

// Change stringNumber so that the processed number changes.
stringNumber.set('200');
Reaction.flush(); // Logs: Processed value changed to: 200

