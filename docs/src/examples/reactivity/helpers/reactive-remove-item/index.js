// Helper: removeItem
import { reaction, signal } from '@semantic-ui/reactivity';

const products = signal([
  { id: 'prod1', name: 'Laptop', stock: 5 },
  { id: 'prod2', name: 'Phone', stock: 0 },
  { id: 'prod3', name: 'Tablet', stock: 3 },
]);

reaction(() => {
  console.log('Available products:', products.value);
});

// Remove out of stock product
console.log('removed prod2');
products.removeItem('prod2');
