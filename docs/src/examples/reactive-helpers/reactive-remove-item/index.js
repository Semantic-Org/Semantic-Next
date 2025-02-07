// Helper: removeItem
import { Signal, Reaction } from '@semantic-ui/reactivity';

const products = new Signal([
  { id: 'prod1', name: 'Laptop', stock: 5 },
  { id: 'prod2', name: 'Phone', stock: 0 },
  { id: 'prod3', name: 'Tablet', stock: 3 }
]);

Reaction.create((reaction) => {
  const currentProducts = products.get();
  if(!reaction.firstRun) {
    console.log('Available products:', currentProducts);
  }
});

// Remove out of stock product
products.removeItem('prod2');
Reaction.flush();
// Output: Shows product list without the Phone
