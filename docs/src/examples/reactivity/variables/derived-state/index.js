// Derived State: Computing values from other signals
import { Reaction, Signal } from '@semantic-ui/reactivity';

// Base signals
const items = new Signal([
  { id: 1, name: 'Apple', price: 1.50, inStock: true },
  { id: 2, name: 'Banana', price: 0.80, inStock: false },
  { id: 3, name: 'Orange', price: 1.20, inStock: true },
]);

// Derived signals
const totalItems = new Signal(0);
const totalValue = new Signal(0);
const inStockCount = new Signal(0);

// Compute derived state automatically
Reaction.create(() => {
  const currentItems = items.get();

  totalItems.set(currentItems.length);

  const value = currentItems
    .filter(item => item.inStock)
    .reduce((sum, item) => sum + item.price, 0);
  totalValue.set(value);

  const inStock = currentItems.filter(item => item.inStock).length;
  inStockCount.set(inStock);
});

// Display derived values
Reaction.create(() => {
  console.log(`Items: ${totalItems.get()}, In Stock: ${inStockCount.get()}, Value: $${totalValue.get()}`);
});

// Add new item
items.push({ id: 4, name: 'Grape', price: 2.00, inStock: true });
Reaction.flush();
