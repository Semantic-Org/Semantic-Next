import { defineComponent } from '@semantic-ui/component';
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
    // Dual-option compat — both the pre-refactor API (allowClone) and
    // the post-refactor API (safety) hit the reference fast path, so the
    // bench measures the impl, not the knob-activation semantics.
    todos: { value: [], options: { allowClone: false, equalityFunction: () => false, safety: 'reference' } },
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
    };
  },
});

/*******************************
      Benchmark Runner
*******************************/

const container = document.createElement('div');
document.body.appendChild(container);

const flush = () => new Promise(r => requestAnimationFrame(r));
const startMark = (name) => `${name}-start`;

async function mount() {
  const el = document.createElement('bench-todo');
  container.appendChild(el);
  await flush();
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
  await flush();
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
  await flush();
}

/*******************************
      Bulk Creation
      (programmatic data load)
*******************************/

const el1 = await mount();
performance.mark(startMark('bulk-add-500'));
el1.component.addBulk(500);
await flush();
performance.measure('bulk-add-500', startMark('bulk-add-500'));
destroy();

const el2 = await mount();
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
performance.mark(startMark('add-20'));
for (let i = 0; i < 20; i++) {
  el3.component.addOne(`New todo ${i + 1}`);
  await flush();
}
performance.measure('add-20', startMark('add-20'));
destroy();

/*******************************
      Single Updates
      (one user click)
*******************************/

// 10× loop per index; same id every iter so signal alternates true/false.
// Metric averages toggle-on + toggle-off cost — if those diverge (class
// adds vs removes may do different DOM work), the number mixes two
// workloads. Both legs run every iter so regression detection is sound,
// but this is not a pure "single toggle" measurement.
const el4 = await setup(100);
performance.mark(startMark('toggle-first-10'));
for (let i = 0; i < 10; i++) {
  el4.component.toggleTodo(getTodos(el4)[0].id);
  await flush();
}
performance.measure('toggle-first-10', startMark('toggle-first-10'));
destroy();

const el5 = await setup(100);
performance.mark(startMark('toggle-last-10'));
for (let i = 0; i < 10; i++) {
  el5.component.toggleTodo(getTodos(el5)[99].id);
  await flush();
}
performance.measure('toggle-last-10', startMark('toggle-last-10'));
destroy();

const el6 = await setup(100);
performance.mark(startMark('toggle-middle-10'));
for (let i = 0; i < 10; i++) {
  el6.component.toggleTodo(getTodos(el6)[49].id);
  await flush();
}
performance.measure('toggle-middle-10', startMark('toggle-middle-10'));
destroy();

/*******************************
      Incremental Updates
      (user checking off items)
*******************************/

const el7 = await setup(100);
performance.mark(startMark('toggle-10'));
for (let i = 0; i < 10; i++) {
  el7.component.toggleTodo(getTodos(el7)[i].id);
  await flush();
}
performance.measure('toggle-10', startMark('toggle-10'));
destroy();

/*******************************
      Bulk Updates
      (one user action, all items)
*******************************/

// 20 alternating toggle-all invocations on a 100-item list — amplified
// so the measurement clears the σ≈2ms per-sample noise floor on CI.
const el8 = await setup(100);
performance.mark(startMark('toggle-all-20'));
for (let i = 0; i < 20; i++) {
  el8.component.toggleAll();
  await flush();
}
performance.measure('toggle-all-20', startMark('toggle-all-20'));
destroy();

/*******************************
      Single Removal
*******************************/

// 10× loop per position; re-fetch each iter since the list shrinks.
// Each position's ~10ms per-delete workload clears the σ≈2ms floor.
const el9 = await setup(100);
performance.mark(startMark('remove-first-10'));
for (let i = 0; i < 10; i++) {
  el9.component.deleteTodo(getTodos(el9)[0].id);
  await flush();
}
performance.measure('remove-first-10', startMark('remove-first-10'));
destroy();

const el10 = await setup(100);
performance.mark(startMark('remove-middle-10'));
for (let i = 0; i < 10; i++) {
  const todos = getTodos(el10);
  el10.component.deleteTodo(todos[Math.floor(todos.length / 2)].id);
  await flush();
}
performance.measure('remove-middle-10', startMark('remove-middle-10'));
destroy();

const el10b = await setup(100);
performance.mark(startMark('remove-last-10'));
for (let i = 0; i < 10; i++) {
  const todos = getTodos(el10b);
  el10b.component.deleteTodo(todos[todos.length - 1].id);
  await flush();
}
performance.measure('remove-last-10', startMark('remove-last-10'));
destroy();

/*******************************
      Incremental Removal
*******************************/

const el11 = await setup(100);
performance.mark(startMark('remove-5-front'));
for (let i = 0; i < 5; i++) {
  el11.component.deleteTodo(getTodos(el11)[0].id);
  await flush();
}
performance.measure('remove-5-front', startMark('remove-5-front'));
destroy();

const el11b = await setup(100);
performance.mark(startMark('remove-5-middle'));
for (let i = 0; i < 5; i++) {
  const todos = getTodos(el11b);
  el11b.component.deleteTodo(todos[Math.floor(todos.length / 2)].id);
  await flush();
}
performance.measure('remove-5-middle', startMark('remove-5-middle'));
destroy();

const el11c = await setup(100);
performance.mark(startMark('remove-5-back'));
for (let i = 0; i < 5; i++) {
  const todos = getTodos(el11c);
  el11c.component.deleteTodo(todos[todos.length - 1].id);
  await flush();
}
performance.measure('remove-5-back', startMark('remove-5-back'));
destroy();

/*******************************
      Bulk Removal
*******************************/

// List scaled to 500 (250 marked completed) so the single clearCompleted
// operation is large enough to clear the σ≈2ms per-sample noise floor.
const el12 = await setup(500);
await markEveryNth(el12, 2);
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
performance.mark(startMark('filter-cycle-20'));
for (let i = 0; i < 20; i++) {
  el13.component.setFilter(filters[i % 3]);
  await flush();
}
performance.measure('filter-cycle-20', startMark('filter-cycle-20'));
destroy();

/*******************************
      Edit Flow
*******************************/

// edit-start-10: 10 consecutive edit transitions cycling different ids
// (editingId must change each iter or the signal equality short-circuits).
const el14 = await setup(100);
performance.mark(startMark('edit-start-10'));
for (let i = 0; i < 10; i++) {
  el14.component.editTodo(getTodos(el14)[40 + i].id);
  await flush();
}
performance.measure('edit-start-10', startMark('edit-start-10'));
destroy();

// edit-cycle-5: 5 full edit+save cycles (10 ops + 10 RAFs total). Fresh
// mount so the first iter sees editingId=null, not the residual from
// edit-start-10's last iter — otherwise that first transition is an
// edit→edit hop, which is a different workload than the others.
const el15 = await setup(100);
performance.mark(startMark('edit-cycle-5'));
for (let i = 0; i < 5; i++) {
  const id = getTodos(el15)[40 + i].id;
  el15.component.editTodo(id);
  await flush();
  el15.component.saveTodo(id, `Updated item ${i}`);
  await flush();
}
performance.measure('edit-cycle-5', startMark('edit-cycle-5'));
destroy();

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
