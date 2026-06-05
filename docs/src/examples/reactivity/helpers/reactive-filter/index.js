// Helper: filter
import { flush, reaction, signal } from '@semantic-ui/reactivity';

const numbers = signal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

reaction(() => console.log('Even numbers:', numbers.get()));

// Filter to only even numbers
numbers.filter(n => n % 2 === 0);
flush();
