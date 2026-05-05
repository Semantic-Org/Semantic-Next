import { defineComponent } from '@semantic-ui/component';
import { ServerRenderer } from '@semantic-ui/renderer';

/*
  Hydrate-each — two windows:

  1. `hydrate-each-100-mount` — DSD parse + connectedCallback + the hydrate
     microtask (eager `adoptServerItems`) + post-hydrate rAF. Per-item
     wiring cost lives here.
  2. `hydrate-each-100` — post-mount items mutation. Items dependency wakes,
     `each.update` reconciles same keys, hits same-ref path. Mostly the
     reconcile walk + Phase 3 snapshot diff.

  Both windows require Declarative Shadow DOM — `setHTMLUnsafe` processes
  `<template shadowrootmode>`, plain `innerHTML` does not.
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
const drainMicrotasks = () => new Promise(r => setTimeout(r, 0));
const startMark = (name) => `${name}-start`;

/*******************************
      Hydrate Each-100 — Mount
      (DSD parse + connectedCallback
       + the hydrate microtask)
*******************************/

// Measured: DSD parse via setHTMLUnsafe (innerHTML doesn't attach the
// shadow root), connectedCallback, the hydrate microtask, and the
// post-hydrate rAF that strips data-sui-bind. Per-item Reactions wire
// here; subsequent updates exercise the already-wired graph.
const itemsForMount = makeItems(1000);
const dsdHTMLForMount = ssrList(itemsForMount);
performance.mark(startMark('hydrate-each-100-mount'));
container.setHTMLUnsafe(dsdHTMLForMount);
await drainMicrotasks();
await flush();
performance.measure('hydrate-each-100-mount', startMark('hydrate-each-100-mount'));
const elForMutate = container.firstElementChild;

/*******************************
      Hydrate Each-100
      (post-mount items mutation)
*******************************/

// Fresh array reference, same keys as SSR markers — exercises the items
// dependency wake + per-Signal equality gate without DOM work.
performance.mark(startMark('hydrate-each-100'));
elForMutate.component.setItems(itemsForMount.slice());
await flush();
performance.measure('hydrate-each-100', startMark('hydrate-each-100'));
container.innerHTML = '';

/*******************************
      Hydrate Helper-100 — Mount
      (per-item attribute helper
       reads external state)
*******************************/

defineComponent({
  tagName: 'bench-hydrate-helper',
  renderingEngine: 'native',
  template: `
    <ul class="list">
      {#each item in items}
        <li data-id="{item.id}" class="{classMap getItemClasses item}">
          <span class="title">{item.title}</span>
        </li>
      {/each}
    </ul>
  `,
  defaultState: {
    activeID: { value: null, options: { allowClone: false, safety: 'reference' } },
    items: { value: [], options: { allowClone: false, safety: 'reference' } },
  },
  createComponent({ self, state }) {
    return {
      isCurrent(item) {
        return state.activeID.get() === item.id;
      },
      getItemClasses(item) {
        return { active: self.isCurrent(item), card: true };
      },
      setActive(id) {
        state.activeID.set(id);
      },
    };
  },
});

const HelperCtor = customElements.get('bench-hydrate-helper');

function ssrHelperList(items) {
  const cloned = HelperCtor.template.clone({ data: { items, activeID: null }, renderingEngine: 'native' });
  cloned.initialize();
  const server = new ServerRenderer({
    ast: cloned.ast,
    data: cloned.getDataContext(),
    subTemplates: cloned.subTemplates,
  });
  const innerHTML = server.render();
  return `<bench-hydrate-helper>`
    + `<template shadowrootmode="open">${innerHTML}</template>`
    + `</bench-hydrate-helper>`;
}

// Same mount-window shape as above, but with a per-item attribute that
// calls a helper closing over external `state.activeID`. Sensitive to
// regressions in per-item Reaction wiring at hydrate time.
const helperItems = makeItems(1000);
const dsdHTMLForHelper = ssrHelperList(helperItems);
performance.mark(startMark('hydrate-helper-100-mount'));
container.setHTMLUnsafe(dsdHTMLForHelper);
await drainMicrotasks();
await flush();
performance.measure('hydrate-helper-100-mount', startMark('hydrate-helper-100-mount'));
const elHelper = container.firstElementChild;

/*******************************
      Hydrate Helper-100
      (state change after mount)
*******************************/

// Mutating a state signal that per-item helpers close over fires 100
// helper invocations + setAttribute calls. Confirms per-item Reactions
// wired at hydrate are reactive to external state, not just to
// itemSignal mutations.
performance.mark(startMark('hydrate-helper-100-state-change'));
elHelper.component.setActive('id-50');
await flush();
performance.measure('hydrate-helper-100-state-change', startMark('hydrate-helper-100-state-change'));
container.innerHTML = '';

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
