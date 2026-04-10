import { defineComponent } from '@semantic-ui/component';

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
const categories = ['furniture', 'food', 'animal', 'tech', 'vehicle'];

let nextId = 1;
function random(max) { return Math.round(Math.random() * 1000) % max; }

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`,
      category: categories[random(categories.length)],
      active: Math.random() > 0.5,
    };
  }
  return data;
}

import template from './component.html?raw';

function define(engine) {
  const tagName = `bench-app-${engine}`;
  defineComponent({
    tagName,
    template,
    renderingEngine: engine,
    defaultState: {
      items: { value: [], options: { allowClone: false, equalityFunction: () => false } },
      selected: { value: 0, options: { allowClone: false, equalityFunction: () => false } },
    },
    createComponent({ state }) {
      return {
        create(n) { state.items.set(buildData(n)); state.selected.set(0); },
        append(n) { state.items.set(state.items.peek().concat(buildData(n))); },
        update10th() {
          const rows = state.items.peek();
          for (let i = 0, len = rows.length; i < len; i += 10) {
            rows[i] = { ...rows[i], label: rows[i].label + ' !!!' };
          }
          state.items.set(rows);
        },
        select(id) { state.selected.set(id); },
        remove(id) {
          const rows = state.items.peek();
          const idx = rows.findIndex(r => r.id === id);
          if (idx !== -1) state.items.set([...rows.slice(0, idx), ...rows.slice(idx + 1)]);
        },
        clear() { state.items.set([]); state.selected.set(0); },
        swapRows() {
          const rows = state.items.peek();
          if (rows.length > 998) {
            const tmp = rows[1]; rows[1] = rows[998]; rows[998] = tmp;
            state.items.set(rows);
          }
        },
      };
    },
    events: {
      'click .remove'({ data }) { this.remove(Number(data.id)); },
    },
  });
  return tagName;
}

export { define, buildData };
