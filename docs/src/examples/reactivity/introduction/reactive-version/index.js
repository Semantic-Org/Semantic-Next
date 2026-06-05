import { flush, reaction, signal } from '@semantic-ui/reactivity';

const rows = signal(['a', 'b']);
const filter = signal('all');

let seenRows = rows.version;

// one reaction tracks both signals, version tells us which one moved
reaction((computation) => {
  rows.get(); // these two reads own the subscription
  filter.get();

  if (computation.firstRun) {
    console.log('initial render');
    return;
  }

  if (rows.version !== seenRows) {
    seenRows = rows.version;
    console.log('rows changed — reindex');
  }
  else {
    console.log('filter changed — refilter');
  }
});

filter.set('active'); // only filter moved
flush();

rows.push('c'); // rows moved
flush();
