import { Reaction, Signal } from '@semantic-ui/reactivity';

const startMark = (name) => `${name}-start`;

/*******************************
      Fixtures
*******************************/

const makeRecords = (n) => {
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = {
      id: `rec-${i}`,
      name: `Record ${i}`,
      active: i % 3 !== 0,
      tags: ['a', 'b'],
    };
  }
  return out;
};

let sink = null;

/*******************************
      Reactive machinery
*******************************/

// signal-reactive-fanout-500x1200
{
  const sig = new Signal(0);
  const reactions = new Array(500);
  for (let i = 0; i < 500; i++) {
    reactions[i] = Reaction.create(() => {
      sink = sig.get();
    });
  }
  // purpose: Fans out one signal's value change to 500 subscribers across 1200 successive updates.
  performance.mark(startMark('signal-reactive-fanout-500x1200'));
  for (let i = 0; i < 1200; i++) {
    sig.set(i + 1);
    Reaction.flush();
  }
  performance.measure('signal-reactive-fanout-500x1200', startMark('signal-reactive-fanout-500x1200'));
  for (let i = 0; i < 500; i++) { reactions[i].stop(); }
}

// signal-computed-chain-10x60k — doubled outer iterations (30k → 60k)
// after the 30k run showed run-to-run boundary variance.
{
  const root = new Signal(0);
  const chain = [root];
  for (let i = 0; i < 10; i++) {
    const prev = chain[chain.length - 1];
    chain.push(prev.derive(v => v + 1));
  }
  const end = chain[chain.length - 1];
  const observer = Reaction.create(() => {
    sink = end.get();
  });
  // purpose: Propagates a value change from root to leaf through a 10-deep chain of derived signals 60000 times.
  performance.mark(startMark('signal-computed-chain-10x60k'));
  for (let i = 0; i < 60_000; i++) {
    root.set(i + 1);
    Reaction.flush();
  }
  performance.measure('signal-computed-chain-10x60k', startMark('signal-computed-chain-10x60k'));
  observer.stop();
}

// signal-reactive-multi-read-5x160k — doubled outer iterations (16k → 32k,
// so 5 signals × 32k = 160k total flushes) after the 80k variant showed
// run-to-run boundary variance.
{
  const sigs = [new Signal(0), new Signal(0), new Signal(0), new Signal(0), new Signal(0)];
  const r = Reaction.create(() => {
    sink = sigs[0].get() + sigs[1].get() + sigs[2].get() + sigs[3].get() + sigs[4].get();
  });
  // purpose: Changes five signals in turn for 32000 rounds with one subscriber reading all five.
  performance.mark(startMark('signal-reactive-multi-read-5x160k'));
  for (let i = 0; i < 32_000; i++) {
    for (let j = 0; j < 5; j++) {
      sigs[j].set(i * 5 + j);
      Reaction.flush();
    }
  }
  performance.measure('signal-reactive-multi-read-5x160k', startMark('signal-reactive-multi-read-5x160k'));
  r.stop();
}

/*******************************
      Large array-of-objects
*******************************/

// signal-reactive-list-replace-1000x1000 — doubled iterations from 500
// to 1000 so the per-sample allocator/GC variance averages out.
// Previous 500-iter runs held Inconclusive (observed CI ~5-7× expected).
{
  const items = new Signal(makeRecords(1000));
  const r = Reaction.create(() => {
    const list = items.get();
    let active = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].active) { active++; }
    }
    sink = active;
  });
  // purpose: Replaces a 1000-item list signal with a fresh 1000-item array and rescans it 1000 times.
  performance.mark(startMark('signal-reactive-list-replace-1000x1000'));
  for (let i = 0; i < 1000; i++) {
    items.set(makeRecords(1000));
    Reaction.flush();
  }
  performance.measure('signal-reactive-list-replace-1000x1000', startMark('signal-reactive-list-replace-1000x1000'));
  r.stop();
}

// signal-reactive-list-filter-1000x300
{
  const items = new Signal(makeRecords(1000));
  const search = new Signal('');
  const r = Reaction.create(() => {
    const list = items.get();
    const term = search.get();
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].name.includes(term)) { count++; }
    }
    sink = count;
  });
  // purpose: Changes a search-term signal 300 times, re-scanning a 1000-item list on each change.
  performance.mark(startMark('signal-reactive-list-filter-1000x300'));
  for (let i = 0; i < 300; i++) {
    search.set(`q-${i}`);
    Reaction.flush();
  }
  performance.measure('signal-reactive-list-filter-1000x300', startMark('signal-reactive-list-filter-1000x300'));
  r.stop();
}

/*******************************
      Helpers with subscriber
*******************************/

// signal-reactive-push-2000x20 — doubled outer reset cycles from 1000
// to 2000 so each push op's cost is averaged across more iterations.
// Previous 1000-cycle run held at ±2.3% (Inconclusive at ±1% expected).
{
  const sig = new Signal([]);
  const r = Reaction.create(() => {
    const list = sig.get();
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].active) { count++; }
    }
    sink = count;
  });
  // purpose: Appends 20 items onto an empty list signal with a subscriber, across 2000 reset cycles.
  performance.mark(startMark('signal-reactive-push-2000x20'));
  for (let c = 0; c < 2000; c++) {
    sig.set([]);
    Reaction.flush();
    for (let p = 0; p < 20; p++) {
      sig.push({ id: `rec-${p}`, name: `Record ${p}`, active: p % 3 !== 0, tags: ['a', 'b'] });
      Reaction.flush();
    }
  }
  performance.measure('signal-reactive-push-2000x20', startMark('signal-reactive-push-2000x20'));
  r.stop();
}

// signal-reactive-set-index-300
{
  const sig = new Signal(makeRecords(1000));
  const r = Reaction.create(() => {
    const list = sig.get();
    let active = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].active) { active++; }
    }
    sink = active;
  });
  // purpose: Replaces one item by index in a 1000-item list signal across 300 updates, with a subscriber.
  performance.mark(startMark('signal-reactive-set-index-300'));
  for (let i = 0; i < 300; i++) {
    sig.setIndex(i % 1000, {
      id: `rec-${i % 1000}`,
      name: `Record ${i}`,
      active: i % 2 === 0,
      tags: ['x'],
    });
    Reaction.flush();
  }
  performance.measure('signal-reactive-set-index-300', startMark('signal-reactive-set-index-300'));
  r.stop();
}

// signal-reactive-set-property-by-id-200 — alternating front/back averages N/2 scan.
// 100 iterations landed at ~113ms with observed CI ~2.5× expected (straddled
// ±2%); 200 doubles the workload to ~225ms so per-sample jitter becomes a
// smaller fraction of the total and the CI resolves.
{
  const sig = new Signal(makeRecords(1000));
  const r = Reaction.create(() => {
    const list = sig.get();
    let active = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].active) { active++; }
    }
    sink = active;
  });
  const ids = new Array(200);
  for (let i = 0; i < 200; i++) {
    const idx = (i % 2 === 0) ? (i / 2) % 1000 : 999 - (((i - 1) / 2) % 1000);
    ids[i] = `rec-${idx}`;
  }
  // purpose: Finds an item by id and updates one field in a 1000-item list signal across 200 alternating updates.
  performance.mark(startMark('signal-reactive-set-property-by-id-200'));
  for (let i = 0; i < 200; i++) {
    sig.setProperty(ids[i], 'active', i % 2 === 0);
    Reaction.flush();
  }
  performance.measure('signal-reactive-set-property-by-id-200', startMark('signal-reactive-set-property-by-id-200'));
  r.stop();
}

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));

if (sink === Symbol()) { console.log('noop'); }
