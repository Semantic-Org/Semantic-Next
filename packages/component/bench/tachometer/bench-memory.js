/*
  Memory canary driver — the in-page half of the heap bot (tools/ci/memory).

  Unlike bench-krausest.js (which auto-runs a fixed op sequence and reads
  *time*), this file runs nothing on load. It exposes a small control surface
  on `window.__heap` that tools/ci/memory/runner.js drives op-by-op over CDP,
  reading *live-instance counts* and post-GC heap between steps.

  Two things this file exists to expose, neither of which the shipped framework
  exposes (and must not — see tools/ci/memory/README.md, "zero bundle impact"):

  1. The prototypes the runner counts with `Runtime.queryObjects(prototype)`.
     queryObjects needs the actual prototype object, so we import the classes
     here and hang them on `window.__heap.prototypes`. Reactivity classes come
     from the package barrel; ReactionScope / DynamicRegion are native-engine
     internals not in the renderer barrel, so we deep-import them by source
     path. esbuild (build-ci.js) bundles these into a self-contained module
     with real class names — no minification, so queryObjects and any later
     snapshot census see `Reaction`, not `a`.

  2. A create -> destroy op surface (`mount` / `run` / `clear` / `destroy`)
     so the runner can churn N cycles and assert the counts net back to
     baseline.

  This is test harness, not framework source. It lives under the bench dir
  for the same reason bench-krausest.js does: it is built by build-ci.js into
  dist/{current,baseline}/ and served as a self-contained page.
*/
import { defineComponent } from '@semantic-ui/component';
import * as reactivity from '@semantic-ui/reactivity';

// Native-engine internals — not exported from the renderer barrel (they're
// tree-shaking-internal) and the package `exports` map gates `./src/*`, so the
// heap census reaches them only by relative source path. A barrel export would
// be a framework-surface change; a relative import in test infra is not.
//
// Known, accepted coupling: these are deep relative imports into framework
// source, not package exports. Renaming or moving reaction-scope.js /
// dynamic-region.js breaks the base build of this instrument, which surfaces as
// a failed Heap Analysis check — the intended signal to re-point these imports.
import { DynamicRegion } from '../../../renderer/src/engines/native/dynamic-region.js';
import { ReactionScope } from '../../../renderer/src/engines/native/reaction-scope.js';

const { Reaction, Dependency, Signal } = reactivity;
const flushWork = reactivity.flush ?? (() => Reaction.flush());

/*******************************
      Data Generation
      (mirrors bench-krausest's generator so the churn workload exercises
      the same each-block reconcile path the perf bot measures)
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
const colours = [
  'red',
  'yellow',
  'blue',
  'green',
  'pink',
  'brown',
  'purple',
  'brown',
  'white',
  'black',
  'orange',
];
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
    };
  }
  return data;
}

/*******************************
      Component Definition
      Same shape as bench-krausest's bench-app: a keyed {#each} table. The
      each block is the prime leak surface — every row owns a child
      ReactionScope, a ReactiveDataContext, per-key Signals/Dependencies,
      and marker-bounded DOM, all of which must net to zero on clear.
*******************************/

defineComponent({
  tagName: 'bench-app',
  template: `<table><tbody>
    {#each rows as row}
      <tr class="{isSelected row.id}">
        <td class="col-md-1">{row.id}</td>
        <td class="col-md-4"><a class="lbl" data-id="{row.id}">{row.label}</a></td>
        <td class="col-md-1"><a class="remove" data-id="{row.id}"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
        <td class="col-md-6"></td>
      </tr>
    {/each}
  </tbody></table>`,
  defaultState: {
    rows: [],
    selected: 0,
  },
  createComponent({ state, match }) {
    const selectedMatch = match(state.selected);
    return {
      getRows: () => state.rows.peek(),
      isSelected(id) {
        return selectedMatch(id) ? 'danger' : '';
      },
      run(n) {
        state.rows.set(buildData(n));
      },
      clear() {
        state.rows.set([]);
      },
      select(id) {
        state.selected.set(id);
      },
    };
  },
});

/*******************************
      Control surface
*******************************/

const container = document.createElement('div');
document.body.appendChild(container);

let mounted = null;

const heap = {
  // Prototypes the runner counts live instances of via queryObjects. Keys are
  // the invariant ids the runner / targets.js / reporter.js share.
  prototypes: {
    Reaction: Reaction.prototype,
    Dependency: Dependency.prototype,
    Signal: Signal.prototype,
    ReactionScope: ReactionScope.prototype,
    DynamicRegion: DynamicRegion.prototype,
  },

  // Mount a fresh <bench-app> and return nothing — the element is held in a
  // module-local so destroy() can drop the only strong reference. (Returning
  // it to the runner would let a CDP RemoteObject handle pin it alive and
  // mask a real leak.)
  mount() {
    mounted = document.createElement('bench-app');
    container.appendChild(mounted);
    flushWork();
  },

  run(n) {
    mounted.component.run(n);
    flushWork();
  },

  clear() {
    mounted.component.clear();
    flushWork();
  },

  // Full teardown: disconnect + drop the reference. disconnectedCallback runs
  // the component's destroy path; the runner's settle() then drains the async
  // tail before counting.
  destroy() {
    container.innerHTML = '';
    mounted = null;
    flushWork();
  },

  // Detach-then-reattach within the same microtask. Exercises SUI's
  // reconnection guard: a transient disconnect must NOT tear down (and a later
  // count must not show the scope double-registered). The runner asserts the
  // post-move counts match a plain mounted scene.
  moveCycle(n) {
    this.mount();
    this.run(n);
    const el = mounted;
    const parent = el.parentNode;
    parent.removeChild(el);
    parent.appendChild(el); // same task: a move, not a removal
    flushWork();
  },

  // Live DOM node count under the container — a cheap detached-node proxy when
  // read after destroy() + GC (anything left is leaked DOM the framework
  // failed to remove). Counted via queryObjects in the runner for the heap
  // census; this is a fast structural fallback.
  containerNodeCount() {
    return container.getElementsByTagName('*').length;
  },
};

window.__heap = heap;
// Signal readiness — the runner waits on this rather than an arbitrary sleep.
window.__heapReady = true;
