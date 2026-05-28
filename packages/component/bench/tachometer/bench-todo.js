import { defineComponent } from '@semantic-ui/component';
import { flush, reaction } from '@semantic-ui/reactivity';
import { generateID } from '@semantic-ui/utils';

/*******************************
      Subtemplate Definition
*******************************/

const todoItem = defineComponent({
  renderingEngine: 'native',
  template: `
    <li class="{classMap {completed: completed, editing: editing}}">
      <div class="view">
        <input class="toggle" type="checkbox" checked={completed} data-id="{id}" />
        <label data-id="{id}">{title}</label>
        <button class="destroy" data-id="{id}"></button>
      </div>
      {#if editing}
        <input class="edit" value="{title}" data-id="{id}" />
      {/if}
    </li>
  `,
});

/*******************************
      Component Definition
*******************************/

defineComponent({
  tagName: 'bench-todo',
  renderingEngine: 'native',
  template: `
    <section>
      {#if hasTodos}
        <section class="main">
          <input class="toggle-all" type="checkbox" checked={allCompleted} />
          <ul class="todo-list">
            {#each todo in filteredTodos}
              {>todoItem
                id=todo.id
                title=todo.title
                completed=todo.completed
                editing=(isEditing todo.id)
              }
            {/each}
          </ul>
        </section>
        <footer class="footer">
          <span class="todo-count">
            <strong>{activeCount}</strong> {maybePlural activeCount 'item' 'items'} left
          </span>
          <ul class="filters">
            <li><a class="{selectedIf (is filter 'all')}">All</a></li>
            <li><a class="{selectedIf (is filter 'active')}">Active</a></li>
            <li><a class="{selectedIf (is filter 'completed')}">Completed</a></li>
          </ul>
          {#if hasCompleted}
            <button class="clear-completed">Clear completed</button>
          {/if}
        </footer>
      {/if}
    </section>
  `,
  subTemplates: { todoItem },
  defaultState: {
    todos: [],
    filter: 'all',
    editingId: null,
  },
  createComponent({ state }) {
    return {
      // computed
      hasTodos: () => state.todos.get().length > 0,
      filteredTodos() {
        const todos = state.todos.get();
        const filter = state.filter.get();
        if (filter === 'active') { return todos.filter(t => !t.completed); }
        if (filter === 'completed') { return todos.filter(t => t.completed); }
        return todos;
      },
      activeCount: () => state.todos.get().filter(t => !t.completed).length,
      hasCompleted: () => state.todos.get().some(t => t.completed),
      allCompleted() {
        const todos = state.todos.get();
        return todos.length > 0 && todos.every(t => t.completed);
      },
      isEditing: (id) => state.editingId.get() === id,

      // bench access
      getTodos: () => state.todos.peek(),

      // actions
      addOne(title) {
        state.todos.push({ id: generateID(), title, completed: false });
      },
      addBulk(n) {
        const todos = state.todos.peek();
        const batch = new Array(n);
        for (let i = 0; i < n; i++) {
          batch[i] = { id: generateID(), title: `Todo item ${todos.length + i + 1}`, completed: false };
        }
        state.todos.set(todos.concat(batch));
      },
      toggleTodo(id) {
        const todo = state.todos.getItem(id);
        if (todo) {
          state.todos.replaceItem(id, { ...todo, completed: !todo.completed });
        }
      },
      toggleAll() {
        const allDone = state.todos.get().every(t => t.completed);
        state.todos.setArrayProperty('completed', !allDone);
      },
      deleteTodo(id) {
        state.todos.removeItem(id);
      },
      setFilter(f) {
        state.filter.set(f);
      },
      clearCompleted() {
        state.todos.filter(t => !t.completed);
      },
      editTodo(id) {
        state.editingId.set(id);
      },
      saveTodo(id, title) {
        state.editingId.set(null);
        state.todos.setProperty(id, 'title', title);
      },
      renameTodo(id, title) {
        state.todos.setProperty(id, 'title', title);
      },
    };
  },
});

/*******************************
      Benchmark Runner
*******************************/

const container = document.createElement('div');
document.body.appendChild(container);

// Pre-measurement / between-metric idle wait. rAF gates `mount()` so any
// connectedCallback-deferred microtasks settle before the next metric
// starts.
const flush = () => new Promise(r => requestAnimationFrame(r));
// Sync drain of pending Reactions. Used inside `performance.mark` ...
// `performance.measure` regions where a per-iteration `await rAF` would
// dominate wall-clock with 16ms idle gaps and bury sub-frame JS-work
// deltas. The reactivity Scheduler flushes on a microtask, so calling
// `flush()` immediately after a `signal.set` runs every queued
// Reaction synchronously — exactly what we want to measure.
const flushWork = () => flush();
const startMark = (name) => `${name}-start`;

async function mount() {
  const el = document.createElement('bench-todo');
  container.appendChild(el);
  flushWork();
  return el;
}

function destroy() {
  container.innerHTML = '';
}

function getTodos(el) {
  return el.component.getTodos();
}

// Setup helper — add N todos and render, not measured
async function setup(n) {
  const el = await mount();
  el.component.addBulk(n);
  flushWork();
  return el;
}

// Setup helper — toggle every Nth todo as completed. Single flush at the
// end; a per-iteration RAF wait would tax every sample by ~15ms × N, which
// amplifies across every metric since tachometer re-runs the full script
// per sample.
async function markEveryNth(el, n) {
  const todos = getTodos(el);
  for (let i = 0; i < todos.length; i += n) {
    el.component.toggleTodo(todos[i].id);
  }
  flushWork();
}

/*******************************
      Edit Flow
*******************************/

// Positioned ahead of the mutation-heavy benches (toggle/remove/filter) so the
// edit path is measured against fresh component state, not the heap and
// V8-feedback state those benches accumulate across the run.

// edit-start-10: 10 consecutive edit transitions cycling different ids
// (editingId must change each iter or the signal equality short-circuits).
const el14 = await setup(100);
// purpose: Enters edit mode on 10 different items in a row, like double-clicking each one.
performance.mark(startMark('edit-start-10'));
for (let i = 0; i < 10; i++) {
  el14.component.editTodo(getTodos(el14)[40 + i].id);
  flushWork();
}
performance.measure('edit-start-10', startMark('edit-start-10'));
destroy();

// edit-cycle-5: 5 full edit+save cycles (10 ops + 10 RAFs total). Fresh
// mount so the first iter sees editingId=null, not the residual from
// edit-start-10's last iter — otherwise that first transition is an
// edit→edit hop, which is a different workload than the others.
const el15 = await setup(100);
// purpose: Runs 5 full edit-then-save cycles on different items, like editing a row and saving it.
performance.mark(startMark('edit-cycle-5'));
for (let i = 0; i < 5; i++) {
  const id = getTodos(el15)[40 + i].id;
  el15.component.editTodo(id);
  flushWork();
  el15.component.saveTodo(id, `Updated item ${i}`);
  flushWork();
}
performance.measure('edit-cycle-5', startMark('edit-cycle-5'));
destroy();

/*******************************
      Bulk Creation
      (programmatic data load)
*******************************/

const el1 = await mount();
// purpose: Renders 500 todo items added at once from a single data load.
performance.mark(startMark('bulk-add-500'));
el1.component.addBulk(500);
await flush();
performance.measure('bulk-add-500', startMark('bulk-add-500'));
destroy();

const el2 = await mount();
// purpose: Renders 200 todo items added at once from a single data load.
performance.mark(startMark('bulk-add-200'));
el2.component.addBulk(200);
await flush();
performance.measure('bulk-add-200', startMark('bulk-add-200'));
destroy();

/*******************************
      Incremental Creation
      (user adding items one by one)
*******************************/

const el3 = await mount();
// purpose: Appends 20 todo items one at a time, like a user typing entries in a row.
performance.mark(startMark('add-20'));
for (let i = 0; i < 20; i++) {
  el3.component.addOne(`New todo ${i + 1}`);
  flushWork();
}
performance.measure('add-20', startMark('add-20'));
destroy();

/*******************************
      Single Updates
      (one user click)
*******************************/

// Same id every iter so the signal alternates true/false; metric averages
// toggle-on + toggle-off cost — if those diverge (class adds vs removes
// may do different DOM work), the number mixes two workloads. Both legs
// run every iter so regression detection is sound, but this is not a
// pure "single toggle" measurement.
const el4 = await setup(100);
// purpose: Toggles the first item in a 100-item list 100 times, alternating completed on and off.
performance.mark(startMark('toggle-first-100'));
for (let i = 0; i < 100; i++) {
  el4.component.toggleTodo(getTodos(el4)[0].id);
  flushWork();
}
performance.measure('toggle-first-100', startMark('toggle-first-100'));
destroy();

const el5 = await setup(100);
// purpose: Toggles the last item in a 100-item list 100 times, alternating completed on and off.
performance.mark(startMark('toggle-last-100'));
for (let i = 0; i < 100; i++) {
  el5.component.toggleTodo(getTodos(el5)[99].id);
  flushWork();
}
performance.measure('toggle-last-100', startMark('toggle-last-100'));
destroy();

const el6 = await setup(100);
// purpose: Toggles a middle item in a 100-item list 100 times, alternating completed on and off.
performance.mark(startMark('toggle-middle-100'));
for (let i = 0; i < 100; i++) {
  el6.component.toggleTodo(getTodos(el6)[49].id);
  flushWork();
}
performance.measure('toggle-middle-100', startMark('toggle-middle-100'));
destroy();

/*******************************
      Incremental Updates
      (user checking off items)
*******************************/

const el7 = await setup(100);
// purpose: Cycles through the first 10 items 10 times each, like a user toggling items repeatedly down a list.
performance.mark(startMark('toggle-100'));
for (let i = 0; i < 100; i++) {
  el7.component.toggleTodo(getTodos(el7)[i % 10].id);
  flushWork();
}
performance.measure('toggle-100', startMark('toggle-100'));
destroy();

/*******************************
      Bulk Updates
      (one user action, all items)
*******************************/

// 200 alternating toggle-all invocations on a 100-item list. Each call
// touches every item, so the 200× sustains a measurable workload above
// the σ≈2ms per-sample noise floor on CI.
const el8 = await setup(100);
// purpose: Toggles all 100 items completed and back across 200 cycles via the master checkbox.
performance.mark(startMark('toggle-all-200'));
for (let i = 0; i < 200; i++) {
  el8.component.toggleAll();
  flushWork();
}
performance.measure('toggle-all-200', startMark('toggle-all-200'));
destroy();

/*******************************
      Single Removal
*******************************/

// 100× loop per position on a 200-item list — re-fetch each iter since
// the list shrinks. Setup of 200 leaves comfortable headroom past the
// 100-iter loop (list ends at 100 items, never empty).
const el9 = await setup(200);
// purpose: Deletes the first item 100 times from a 200-item list, with remaining items moving up each time.
performance.mark(startMark('remove-first-100'));
for (let i = 0; i < 100; i++) {
  el9.component.deleteTodo(getTodos(el9)[0].id);
  flushWork();
}
performance.measure('remove-first-100', startMark('remove-first-100'));
destroy();

const el10 = await setup(200);
// purpose: Deletes the middle item 100 times from a 200-item list, walking halfway through to find each target.
performance.mark(startMark('remove-middle-100'));
for (let i = 0; i < 100; i++) {
  const todos = getTodos(el10);
  el10.component.deleteTodo(todos[Math.floor(todos.length / 2)].id);
  flushWork();
}
performance.measure('remove-middle-100', startMark('remove-middle-100'));
destroy();

const el10b = await setup(200);
// purpose: Deletes the last item 100 times from a 200-item list, with no other items needing to move.
performance.mark(startMark('remove-last-100'));
for (let i = 0; i < 100; i++) {
  const todos = getTodos(el10b);
  el10b.component.deleteTodo(todos[todos.length - 1].id);
  flushWork();
}
performance.measure('remove-last-100', startMark('remove-last-100'));
destroy();

/*******************************
      Incremental Removal
*******************************/

const el11 = await setup(100);
// purpose: Deletes 50 items from the front of a 100-item list, one click at a time.
performance.mark(startMark('remove-50-front'));
for (let i = 0; i < 50; i++) {
  el11.component.deleteTodo(getTodos(el11)[0].id);
  flushWork();
}
performance.measure('remove-50-front', startMark('remove-50-front'));
destroy();

const el11b = await setup(100);
// purpose: Deletes 50 items from the middle of a 100-item list, one click at a time.
performance.mark(startMark('remove-50-middle'));
for (let i = 0; i < 50; i++) {
  const todos = getTodos(el11b);
  el11b.component.deleteTodo(todos[Math.floor(todos.length / 2)].id);
  flushWork();
}
performance.measure('remove-50-middle', startMark('remove-50-middle'));
destroy();

const el11c = await setup(100);
// purpose: Deletes 50 items from the end of a 100-item list, one click at a time.
performance.mark(startMark('remove-50-back'));
for (let i = 0; i < 50; i++) {
  const todos = getTodos(el11c);
  el11c.component.deleteTodo(todos[todos.length - 1].id);
  flushWork();
}
performance.measure('remove-50-back', startMark('remove-50-back'));
destroy();

/*******************************
      Bulk Removal
*******************************/

// List scaled to 500 (250 marked completed) so the single clearCompleted
// operation is large enough to clear the σ≈2ms per-sample noise floor.
const el12 = await setup(500);
await markEveryNth(el12, 2);
// purpose: Clears 250 completed items from a 500-item list in one action, like clicking clear completed.
performance.mark(startMark('clear-completed-250'));
el12.component.clearCompleted();
await flush();
performance.measure('clear-completed-250', startMark('clear-completed-250'));
destroy();

/*******************************
      Filter Changes
      (parent Signal change only)
*******************************/

// 20 filter transitions cycling active → completed → all — single
// amplified metric replaces the prior three single-shot filter metrics
// (filter-active, filter-completed, filter-all) which each landed in
// the noise-floor-limited bucket.
const el13 = await setup(100);
await markEveryNth(el13, 3);

const filters = ['active', 'completed', 'all'];
// purpose: Cycles through active, completed, and all filters 20 times on a 100-item list.
performance.mark(startMark('filter-cycle-20'));
for (let i = 0; i < 20; i++) {
  el13.component.setFilter(filters[i % 3]);
  flushWork();
}
performance.measure('filter-cycle-20', startMark('filter-cycle-20'));
destroy();

/*******************************
      Rename Flow
      (single-field setProperty)
*******************************/

// Pure setProperty workload — `saveTodo` co-fires editingId, which
// muddies the signal. `renameTodo` does only the per-id field write,
// so the metric isolates the per-key broadcast cost. Distinct from
// `toggle-*` (which uses replaceItem) and `edit-cycle-5` (which mixes
// in an editingId flip per cycle).
const el16 = await setup(100);
// purpose: Renames items in a 100-item list 500 times via single-field setProperty without editingId co-fires.
performance.mark(startMark('rename-500'));
for (let i = 0; i < 500; i++) {
  const todos = getTodos(el16);
  el16.component.renameTodo(todos[i % todos.length].id, `Renamed ${i}`);
  flushWork();
}
performance.measure('rename-500', startMark('rename-500'));
destroy();

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
