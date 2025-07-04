// Helper: map
import { Reaction, Signal } from '@semantic-ui/reactivity';

const prices = new Signal([10, 20, 30, 40]);

Reaction.create(() => console.log('Prices:', prices.get()));

// Apply 10% discount to all prices
prices.map(price => price * 0.9);
Reaction.flush();
