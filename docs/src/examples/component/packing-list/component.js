import { defineComponent, getText } from '@semantic-ui/component';
import { generateID } from '@semantic-ui/utils';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultState = {
  items: [
    { id: 'passport', title: 'Passport', packed: true },
    { id: 'charger', title: 'Phone charger', packed: false },
    { id: 'sunscreen', title: 'Sunscreen', packed: false },
  ],
};

const events = {
  'click .item'({ state, data }) {
    state.items.toggleItemProperty(data.item.id, 'packed');
  },
  'keydown .new'({ state, event, value, target }) {
    if (event.key !== 'Enter' || !value.trim()) {
      return;
    }
    state.items.push({ id: generateID(), title: value.trim(), packed: false });
    target.value = '';
  },
  'click .pack'({ state }) {
    state.items.setProperty('packed', true);
  },
  'click .clear'({ state }) {
    state.items.filter((item) => !item.packed);
  },
};

defineComponent({
  tagName: 'packing-list',
  template,
  css,
  defaultState,
  events,
});
