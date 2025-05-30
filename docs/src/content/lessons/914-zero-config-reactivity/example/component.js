import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

defineComponent({
  tagName: 'shopping-cart',
  template,
  css,
  defaultState: { 
    items: []
  },
  events: {
    'click .add-btn': ({ self }) => self.addItem(),
    'click .clear-btn': ({ self }) => self.clearCart(),
    'click .remove': ({ self, target, $ }) => {
      const $item = $(target).closest('.item');
      const id = parseInt($item.attr('data-id'));
      self.removeItem(id);
    }
  },
  createComponent: ({ state, self }) => ({
    getTotal() {
      return state.items.get().reduce((sum, item) => sum + item.price, 0);
    },
    
    addItem() {
      const items = ['Coffee', 'Book', 'Headphones', 'Plant', 'Notebook', 'Mug'];
      state.items.push({
        id: Date.now(),
        name: items[Math.floor(Math.random() * items.length)],
        price: Math.floor(Math.random() * 50) + 5
      });
    },
    
    removeItem(id) {
      const index = state.items.get().findIndex(item => item.id === id);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    
    clearCart() {
      state.items.set([]);
    }
  })
});