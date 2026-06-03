// Helper: map
import { flush, reaction, signal } from '@semantic-ui/reactivity';

const prices = signal([10, 20, 30, 40]);

reaction(() => console.log('Prices:', prices.get()));

// Apply 10% discount to all prices
prices.map(price => price * 0.9);
flush();
