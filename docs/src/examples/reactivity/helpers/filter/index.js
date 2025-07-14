// Helper: filter
import { Reaction, Signal } from '@semantic-ui/reactivity';

const numbers = new Signal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

Reaction.create(() => console.log('Even numbers:', numbers.get()));

// Filter to only even numbers
numbers.filter(n => n % 2 === 0);
Reaction.flush();
