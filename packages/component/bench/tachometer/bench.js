import { defineComponent } from '@semantic-ui/component';

/*******************************
      Data Generation
*******************************/

const adjectives = [
  'pretty',
  'large',
  'big',
  'small',
  'tall',
  'short',
  'long',
  'handsome',
  'plain',
  'quaint',
  'clean',
  'elegant',
  'easy',
  'angry',
  'crazy',
  'helpful',
  'mushy',
  'odd',
  'unsightly',
  'adorable',
  'important',
  'inexpensive',
  'cheap',
  'expensive',
  'fancy',
];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'white', 'black', 'orange'];
const nouns = [
  'table',
  'chair',
  'house',
  'bbq',
  'desk',
  'car',
  'pony',
  'cookie',
  'sandwich',
  'burger',
  'pizza',
  'mouse',
  'keyboard',
];
const categories = ['furniture', 'food', 'animal', 'tech', 'vehicle'];

let nextId = 1;
function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${
        nouns[random(nouns.length)]
      }`,
      category: categories[random(categories.length)],
      active: Math.random() > 0.5,
    };
  }
  return data;
}

/*******************************
      Component Definition
*******************************/

defineComponent({
  tagName: 'bench-app',
  template: `<table><tbody>
    {#each item in items}
      <tr class="{classIf (is item.id selected) 'selected'}">
        <td class="id">{item.id}</td>
        <td class="label">{item.label}</td>
        <td class="category">{item.category}</td>
        <td class="status">{classIf item.active 'active' 'inactive'}</td>
        <td class="actions"><a data-id="{item.id}" class="remove">x</a></td>
      </tr>
    {/each}
  </tbody></table>`,
  defaultState: {
    items: { value: [], options: { allowClone: false, equalityFunction: () => false } },
    selected: { value: 0, options: { allowClone: false, equalityFunction: () => false } },
  },
  createComponent({ state }) {
    return {
      create(n) {
        state.items.set(buildData(n));
        state.selected.set(0);
      },
      append(n) {
        state.items.set(state.items.peek().concat(buildData(n)));
      },
      update10th() {
        const rows = state.items.peek();
        for (let i = 0, len = rows.length; i < len; i += 10) {
          rows[i] = { ...rows[i], label: rows[i].label + ' !!!' };
        }
        state.items.set(rows);
      },
      select(id) {
        state.selected.set(id);
      },
      clear() {
        state.items.set([]);
        state.selected.set(0);
      },
      swapRows() {
        const rows = state.items.peek();
        if (rows.length > 998) {
          const tmp = rows[1];
          rows[1] = rows[998];
          rows[998] = tmp;
          state.items.set(rows);
        }
      },
    };
  },
});

/*******************************
      Benchmark Runner
*******************************/

const container = document.createElement('div');
document.body.appendChild(container);

const updateComplete = () => new Promise(r => requestAnimationFrame(r));
const startMark = (name) => `${name}-start`;

async function mount() {
  const el = document.createElement('bench-app');
  container.appendChild(el);
  await updateComplete();
  return el;
}

function destroy() {
  container.innerHTML = '';
}

// Create 1,000 rows
const el1 = await mount();
performance.mark(startMark('create-1k'));
el1.component.create(1000);
await updateComplete();
performance.measure('create-1k', startMark('create-1k'));
destroy();

// Create 10,000 rows
const el2 = await mount();
performance.mark(startMark('create-10k'));
el2.component.create(10000);
await updateComplete();
performance.measure('create-10k', startMark('create-10k'));
destroy();

// Append 1,000 rows to existing 1,000
const el3 = await mount();
el3.component.create(1000);
await updateComplete();
performance.mark(startMark('append-1k'));
el3.component.append(1000);
await updateComplete();
performance.measure('append-1k', startMark('append-1k'));
destroy();

// Update every 10th row
const el4 = await mount();
el4.component.create(1000);
await updateComplete();
performance.mark(startMark('update-10th'));
el4.component.update10th();
await updateComplete();
performance.measure('update-10th', startMark('update-10th'));
destroy();

// Select row — 20 selects across different ids, amplified so the
// total duration clears the σ≈2ms per-sample noise floor on CI.
const el5 = await mount();
el5.component.create(1000);
await updateComplete();
performance.mark(startMark('select-20'));
for (let i = 0; i < 20; i++) {
  el5.component.select(100 + i * 50);
  await updateComplete();
}
performance.measure('select-20', startMark('select-20'));
destroy();

// Swap rows — 20 alternating swaps so the amplified duration clears the
// σ≈2ms per-sample noise floor on CI.
const el6 = await mount();
el6.component.create(1000);
await updateComplete();
performance.mark(startMark('swap-rows-20'));
for (let i = 0; i < 20; i++) {
  el6.component.swapRows();
  await updateComplete();
}
performance.measure('swap-rows-20', startMark('swap-rows-20'));
destroy();

// Clear rows — list scaled to 5k so tree destruction is large enough to
// clear the σ≈2ms per-sample noise floor on CI.
const el7 = await mount();
el7.component.create(5000);
await updateComplete();
performance.mark(startMark('clear-5k'));
el7.component.clear();
await updateComplete();
performance.measure('clear-5k', startMark('clear-5k'));
destroy();

// Log results
performance.getEntriesByType('measure')
  .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
