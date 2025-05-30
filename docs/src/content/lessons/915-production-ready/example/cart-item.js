import { defineComponent, getText } from '@semantic-ui/component';
import { roundNumber } from '@semantic-ui/utils';

const template = await getText('./cart-item.html');
const css = await getText('./cart-item.css');

export const CartItem = defineComponent({
  templateName: 'cart-item',
  template,
  css,
  events: {
    'click .remove': ({ self }) => self.remove(),
    'click .quantity-decrease': ({ self }) => self.decreaseQuantity(),
    'click .quantity-increase': ({ self }) => self.increaseQuantity(),
  },
  createComponent: ({ data, self, findParent }) => ({
    getSubtotal() {
      return roundNumber(data.price * data.quantity, 2);
    },

    remove() {
      const cart = findParent('shoppingCart');
      console.log(self, cart);
      cart.removeItem(data.id);
    },

    decreaseQuantity() {
      if (data.quantity > 1) {
        const cart = findParent('shoppingCart');
        cart.updateQuantity(data.id, data.quantity - 1);
      }
    },

    increaseQuantity() {
      const cart = findParent('shoppingCart');
      cart.updateQuantity(data.id, data.quantity + 1);
    },
  }),
});
