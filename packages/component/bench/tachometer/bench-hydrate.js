import { defineComponent } from '@semantic-ui/component';
import { ServerRenderer } from '@semantic-ui/renderer';

/*
  Hydrate-each — gates the AST→string/entries cache (renderer.js
  buildStringCache) against silent regressions. The cache is keyed on
  AST array identity; if anything ever clones the AST between renders,
  the hit rate drops to 0% and per-item hydrateInnerContent reverts to
  a full buildHTMLStringPure call. A 100-item each adoption pays that
  cost 100× per hydrate, well above the σ≈2ms GHA noise floor.

  The measured window is the first-data-change adoption — not the
  initial marker walk. The each block's hydrate hook only registers a
  dep on the collection; per-item reactivity is wired by
  adoptServerItems on the subsequent update, which is where the 100
  hydrateInnerContent calls happen.
*/

defineComponent({
  tagName: 'bench-hydrate-list',
  renderingEngine: 'native',
  template: `
    <ul class="list">
      {#each item in items}
        <li class="card {item.completed ? 'done' : 'todo'}" data-id="{item.id}">
          <span class="title">{item.title}</span>
          <span class="meta">{item.priority} · {item.tag}</span>
          <button class="action">{item.completed ? 'Undo' : 'Done'}</button>
        </li>
      {/each}
    </ul>
  `,
  defaultState: {
    items: { value: [], options: { allowClone: false, safety: 'reference' } },
  },
  createComponent({ state }) {
    return {
      setItems(items) {
        state.items.set(items);
      },
    };
  },
});

const ProtoCtor = customElements.get('bench-hydrate-list');

function makeItems(n) {
  const items = new Array(n);
  for (let i = 0; i < n; i++) {
    items[i] = {
      id: `id-${i}`,
      title: `Item ${i}`,
      priority: i % 3 === 0 ? 'high' : 'low',
      tag: `tag-${i % 7}`,
      completed: i % 2 === 0,
    };
  }
  return items;
}

// Browser-side analog of renderToString. Template.render() routes to
// the client Renderer in a browser, so we drive ServerRenderer
// directly off the cloned template's AST. DSD wrapper mirrors what
// renderToString would emit Node-side.
function ssrList(items) {
  const cloned = ProtoCtor.template.clone({ data: { items }, renderingEngine: 'native' });
  cloned.initialize();
  const server = new ServerRenderer({
    ast: cloned.ast,
    data: cloned.getDataContext(),
    subTemplates: cloned.subTemplates,
  });
  const innerHTML = server.render();
  return `<bench-hydrate-list>`
    + `<template shadowrootmode="open">${innerHTML}</template>`
    + `</bench-hydrate-list>`;
}

const container = document.createElement('div');
document.body.appendChild(container);

const flush = () => new Promise(r => requestAnimationFrame(r));
const startMark = (name) => `${name}-start`;

/*******************************
      Hydrate Each-100
      (first-data-change
       adoption: 100× per-item
       hydrateInnerContent)
*******************************/

// Setup outside the measurement: SSR a 100-item list to DSD, mount,
// drain the hydrate microtask. The element is wired but per-item
// reactivity hasn't been established (each defers it to first update).
const items = makeItems(100);
const dsdHTML = ssrList(items);
container.innerHTML = dsdHTML;
const el = container.firstElementChild;
await Promise.resolve();

// Measured: setItems with a fresh array reference whose item keys
// match the SSR'd markers — Reaction fires, update sees hasHydrated,
// adoptServerItems reuses the server DOM and calls hydrateInnerContent
// 100× (one cachedBuildHTMLString call per item). The trailing rAF
// also picks up the post-hydration marker cleanup pass.
performance.mark(startMark('hydrate-each-100'));
el.component.setItems(items.slice());
await flush();
performance.measure('hydrate-each-100', startMark('hydrate-each-100'));
container.innerHTML = '';

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
