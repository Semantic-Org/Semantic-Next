import { Signal, Reaction } from '@semantic-ui/reactivity';

// Example: E-commerce checkout with computed signals
const cartItems = new Signal([
  { id: 1, name: 'Laptop', price: 999.99, quantity: 1 },
  { id: 2, name: 'Mouse', price: 29.99, quantity: 2 },
  { id: 3, name: 'Notebook', price: 4.99, quantity: 5 }
]);

const taxRate = new Signal(0.08); // 8% tax
const shippingRate = new Signal(9.99);
const discountPercent = new Signal(0.1); // 10% discount

// First get subtotal from cart items
const subtotal = cartItems.derive(items =>
  items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
);

// Using computed() for multi-source calculations
const discount = Signal.computed(() => 
  subtotal.get() * discountPercent.get()
);

const taxableAmount = Signal.computed(() => 
  subtotal.get() - discount.get()
);

const tax = Signal.computed(() => 
  taxableAmount.get() * taxRate.get()
);

const total = Signal.computed(() => 
  taxableAmount.get() + tax.get() + shippingRate.get()
);

// Display checkout summary
Reaction.create(() => {
  console.log('Checkout Summary:');
  console.log(`Subtotal: $${subtotal.get().toFixed(2)}`);
  console.log(`Discount: -$${discount.get().toFixed(2)}`);
  console.log(`Tax: $${tax.get().toFixed(2)}`);
  console.log(`Shipping: $${shippingRate.get().toFixed(2)}`);
  console.log(`Total: $${total.get().toFixed(2)}`);
  console.log('');
});

// Update discount
discountPercent.set(0.15); // 15% discount

// Change tax rate
taxRate.set(0.10); // 10% tax

// Add more items
cartItems.push({ id: 4, name: 'Coffee', price: 12.99, quantity: 2 });

// All computed values update automatically!