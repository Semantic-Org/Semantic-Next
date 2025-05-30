import { defineComponent, getText } from '@semantic-ui/component';
import { sum, roundNumber } from '@semantic-ui/utils';
import { CartItem } from './cart-item.js';

const template = await getText('./component.html');
const css = await getText('./component.css');

defineComponent({
  tagName: 'shopping-cart',
  template,
  css,
  defaultState: {
    items: []
  },
  defaultSettings: {
    showCheckout: true,
    maxItems: 10,
    currency: 'USD'
  },
  events: {
    'click .add-sample': ({ self }) => self.addSampleItem(),
    'click .clear-cart': ({ self }) => self.clearCart(),
    'click .checkout': ({ self }) => self.checkout()
  },
  createComponent: ({ state, settings, self, dispatchEvent }) => ({
    getItemCount() {
      return sum(state.items.get().map(item => item.quantity));
    },
    
    getTotal() {
      return roundNumber(sum(state.items.get().map(item => item.price * item.quantity)), 2);
    },
    
    addItem(product) {
      const items = state.items.get();
      const existingIndex = items.findIndex(item => item.id === product.id);
      
      if (existingIndex >= 0) {
        // Update quantity of existing item
        this.updateQuantity(product.id, items[existingIndex].quantity + 1);
      } else {
        // Add new item
        state.items.push({
          ...product,
          quantity: 1
        });
      }
      
      dispatchEvent('cartUpdated', { 
        action: 'add', 
        item: product,
        total: self.getTotal(),
        itemCount: self.getItemCount()
      });
    },
    
    removeItem(itemId) {
      const index = state.items.get().findIndex(item => item.id === itemId);
      if (index >= 0) {
        const removedItem = state.items.get()[index];
        state.items.splice(index, 1);
        
        dispatchEvent('cartUpdated', { 
          action: 'remove', 
          item: removedItem,
          total: self.getTotal(),
          itemCount: self.getItemCount()
        });
      }
    },
    
    updateQuantity(itemId, newQuantity) {
      const items = state.items.get();
      const index = items.findIndex(item => item.id === itemId);
      
      if (index >= 0 && newQuantity > 0) {
        state.items.setArrayProperty(index, 'quantity', newQuantity);
        
        dispatchEvent('cartUpdated', { 
          action: 'update', 
          item: items[index],
          total: self.getTotal(),
          itemCount: self.getItemCount()
        });
      }
    },
    
    clearCart() {
      state.items.set([]);
      dispatchEvent('cartUpdated', { 
        action: 'clear',
        total: 0,
        itemCount: 0
      });
    },
    
    addSampleItem() {
      const sampleProducts = [
        { id: 'coffee', name: 'Premium Coffee', price: 12.99, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop' },
        { id: 'book', name: 'JavaScript Guide', price: 29.99, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop' },
        { id: 'headphones', name: 'Wireless Headphones', price: 79.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
        { id: 'plant', name: 'Desk Plant', price: 19.99, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop' }
      ];
      
      const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
      self.addItem(randomProduct);
    },
    
    checkout() {
      if (state.items.get().length === 0) return;
      
      dispatchEvent('checkout', {
        items: state.items.get(),
        total: self.getTotal(),
        itemCount: self.getItemCount()
      });
      
      // Simulate checkout process
      alert(`Checkout: ${self.getItemCount()} items for $${self.getTotal()}`);
    }
  }),
  subTemplates: {
    cartItem: CartItem
  }
});