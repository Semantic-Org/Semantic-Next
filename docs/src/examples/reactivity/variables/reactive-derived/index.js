import { Signal, Reaction } from '@semantic-ui/reactivity';

// Example: E-commerce shopping cart with derived signals
const cartItems = new Signal([
  { id: 1, name: 'Laptop', price: 999.99, quantity: 1, category: 'electronics' },
  { id: 2, name: 'Mouse', price: 29.99, quantity: 2, category: 'electronics' },
  { id: 3, name: 'Notebook', price: 4.99, quantity: 5, category: 'office' }
]);

// Using derive() for single-source transformations
const itemCount = cartItems.derive(items => 
  items.reduce((sum, item) => sum + item.quantity, 0)
);

const subtotal = cartItems.derive(items =>
  items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
);

const categoryBreakdown = cartItems.derive(items => {
  const breakdown = {};
  items.forEach(item => {
    breakdown[item.category] = (breakdown[item.category] || 0) + item.quantity;
  });
  return breakdown;
});

// Display cart summary
Reaction.create(() => {
  console.log('Cart Summary:');
  console.log(`Items: ${itemCount.get()}`);
  console.log(`Subtotal: $${subtotal.get().toFixed(2)}`);
  console.log(`Categories:`, categoryBreakdown.get());
  console.log('');
});

// Add new item to cart
cartItems.push({ id: 4, name: 'Pen', price: 1.99, quantity: 10, category: 'office' });

// Modify quantity
cartItems.setArrayProperty(0, 'quantity', 2);

// The derived signals automatically update!