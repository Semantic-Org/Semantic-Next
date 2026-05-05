/*
  Krausest js-framework-benchmark parity — Semantic UI keyed-table workload.

  In-CI mirror of tools/benchmark/src/main.js (the browser-served krausest
  contestant). Same data generator, same template shape, same operations:
  one source of truth for "how Semantic UI performs on krausest." The
  external js-framework-benchmark runner and tachometer measure the same
  workload, so cross-tool numbers stay comparable.

  Operations follow krausest's spec:
    run / runLots — create N rows
    replace        — set fresh N rows on a mounted component
    add            — append N rows
    update         — every 10th row gets ' !!!' appended
    select         — set selected id (one-row highlight)
    swap           — swap rows[1] and rows[N-2]
    remove         — splice one row by id
    clear          — empty the list

  Signals pinned to safety: 'reference' so the bench tracks the reference
  fast path regardless of Signal.defaultSafety. Krausest publishes
  best-case for reference-style frameworks; we match that contract.

  Mutations use SUI-idiomatic helpers (push / map / removeItem / new-ref
  set) instead of mutate-then-set-same-ref so reference equality fires
  once per op — no spurious renderer fan-out.
*/
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
*******************************/

const signalOptions = { allowClone: false, safety: 'reference' };

defineComponent({
  tagName: 'bench-app',
  template: `<table><tbody>
    {#each row in rows}
      <tr class="{classIf (is row.id selected) 'danger'}">
        <td class="col-md-1">{row.id}</td>
        <td class="col-md-4"><a class="lbl" data-id="{row.id}">{row.label}</a></td>
        <td class="col-md-1"><a class="remove" data-id="{row.id}">x</a></td>
        <td class="col-md-6"></td>
      </tr>
    {/each}
  </tbody></table>`,
  defaultState: {
    rows: { value: [], options: signalOptions },
    selected: { value: 0, options: signalOptions },
  },
  createComponent({ state }) {
    return {
      // bench access
      getRows: () => state.rows.peek(),

      run(n) {
        state.rows.set(buildData(n));
        state.selected.set(0);
      },
      add(n) {
        state.rows.push(...buildData(n));
      },
      update() {
        state.rows.map((row, i) => i % 10 === 0 ? { id: row.id, label: row.label + ' !!!' } : row);
      },
      select(id) {
        state.selected.set(id);
      },
      clear() {
        state.rows.set([]);
        state.selected.set(0);
      },
      swapRows() {
        // No swap helper exists; two setIndex calls would notify twice.
        // Construct a new array ref so reference equality fires once.
        const rows = state.rows.peek();
        if (rows.length > 998) {
          const newRows = [...rows];
          const tmp = newRows[1];
          newRows[1] = newRows[newRows.length - 2];
          newRows[newRows.length - 2] = tmp;
          state.rows.set(newRows);
        }
      },
      removeRow(id) {
        state.rows.removeItem(id);
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
  const el = document.createElement('bench-app');
  container.appendChild(el);
  await flush();
  return el;
}

function destroy() {
  container.innerHTML = '';
}

function getRows(el) {
  return el.component.getRows();
}

/*******************************
      Create
      (krausest 01_run, 02b_runlots)
*******************************/

const el1 = await mount();
// purpose: measures rendering a fresh 1000-row table into an empty parent.
performance.mark(startMark('create-1k'));
el1.component.run(1000);
await flush();
performance.measure('create-1k', startMark('create-1k'));
destroy();

const el2 = await mount();
// purpose: measures rendering a fresh 10000-row table into an empty parent at ten times the create-1k scale.
performance.mark(startMark('create-10k'));
el2.component.run(10000);
await flush();
performance.measure('create-10k', startMark('create-10k'));
destroy();

/*******************************
      Replace
      (krausest 02_replace)
      Hits the keyed-replace diff path — distinct from create-1k which
      always renders into an empty parent.
*******************************/

const el3 = await mount();
el3.component.run(1000);
await flush();
// purpose: measures replacing 1000 rows with a fresh 1000-row set, exercising the keyed-list diff on a populated table.
performance.mark(startMark('replace-1k'));
el3.component.run(1000);
await flush();
performance.measure('replace-1k', startMark('replace-1k'));
destroy();

/*******************************
      Append
      (krausest 03_add)
*******************************/

const el4 = await mount();
el4.component.run(1000);
await flush();
// purpose: measures appending 1000 new rows onto an existing 1000-row table.
performance.mark(startMark('append-1k'));
el4.component.add(1000);
await flush();
performance.measure('append-1k', startMark('append-1k'));
destroy();

/*******************************
      Partial Update
      (krausest 04_update)
      10× amplified — 5× landed at ~85ms on GHA and straddled the ±2%
      resolution floor. 10× brings the mean to ~170ms (±1.2% expected),
      comfortably below the floor.
*******************************/

const el5 = await mount();
el5.component.run(1000);
await flush();
// purpose: measures updating the label on every tenth row of a 1000-row table, repeated ten times for signal strength.
performance.mark(startMark('update-10th-10'));
for (let i = 0; i < 10; i++) {
  el5.component.update();
  await flush();
}
performance.measure('update-10th-10', startMark('update-10th-10'));
destroy();

/*******************************
      Select
      (krausest 05_select)
      20 selects across spread ids — krausest's published metric is
      single-shot, amplified here for SNR.
*******************************/

// 40 selects spread across the 1k list — doubled from 20 after select-20
// showed run-to-run boundary variance (observed ±4.6% vs expected ±1.5%).
const el6 = await mount();
el6.component.run(1000);
await flush();
// purpose: measures highlighting one row at a time across 40 rows, testing how selection isolates to the affected row.
performance.mark(startMark('select-40'));
for (let i = 0; i < 40; i++) {
  el6.component.select(i * 25);
  await flush();
}
performance.measure('select-40', startMark('select-40'));
destroy();

/*******************************
      Swap Rows
      (krausest 06_swap)
      20 alternating swaps on a 1k list.
*******************************/

const el7 = await mount();
el7.component.run(1000);
await flush();
// purpose: measures swapping the second and second-to-last rows in a 1000-row table, repeated 20 times.
performance.mark(startMark('swap-rows-20'));
for (let i = 0; i < 20; i++) {
  el7.component.swapRows();
  await flush();
}
performance.measure('swap-rows-20', startMark('swap-rows-20'));
destroy();

/*******************************
      Remove Row
      (krausest 07_remove at krausest scale)
      10× amplified per position. List shrinks under each remove; the
      target id is re-fetched each iteration.
*******************************/

// Front + middle amplified to 20× (back stays at 10× — it resolved
// cleanly). Front and middle both do O(N) array-splice memmoves and
// showed higher intrinsic variance than back on GHA at 10×; doubling
// averages more of that variance into each sample.
const el8 = await mount();
el8.component.run(1000);
await flush();
// purpose: measures removing the first row 20 times from a 1000-row table, exercising shift work at the head.
performance.mark(startMark('remove-row-front-20'));
for (let i = 0; i < 20; i++) {
  el8.component.removeRow(getRows(el8)[0].id);
  await flush();
}
performance.measure('remove-row-front-20', startMark('remove-row-front-20'));
destroy();

const el9 = await mount();
el9.component.run(1000);
await flush();
// purpose: measures removing the middle row 20 times from a 1000-row table, exercising splice work mid-list.
performance.mark(startMark('remove-row-middle-20'));
for (let i = 0; i < 20; i++) {
  const rows = getRows(el9);
  el9.component.removeRow(rows[Math.floor(rows.length / 2)].id);
  await flush();
}
performance.measure('remove-row-middle-20', startMark('remove-row-middle-20'));
destroy();

const el10 = await mount();
el10.component.run(1000);
await flush();
// purpose: measures removing the last row 10 times from a 1000-row table, the cheapest splice position.
performance.mark(startMark('remove-row-back-10'));
for (let i = 0; i < 10; i++) {
  const rows = getRows(el10);
  el10.component.removeRow(rows[rows.length - 1].id);
  await flush();
}
performance.measure('remove-row-back-10', startMark('remove-row-back-10'));
destroy();

/*******************************
      Clear
      (krausest 09b_clear-after-runlots)
      Clears a 10k list. krausest also has 09_clear1k; we use the larger
      variant so the measurement clears the noise floor (~10ms clear of a
      1k list sits in the noise-floor-limited bucket on GHA runners).
*******************************/

const el11 = await mount();
el11.component.run(10000);
await flush();
// purpose: measures clearing a 10000-row table back to empty in a single operation.
performance.mark(startMark('clear-10k'));
el11.component.clear();
await flush();
performance.measure('clear-10k', startMark('clear-10k'));
destroy();

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
