import { afterFlush, flush, reaction, signal } from '@semantic-ui/reactivity';

const rows = signal(['alpha', 'beta']);
const widths = signal([5, 4]);

// the body runs on every pass of the queue, intermediate states included
reaction(() => {
  console.log(`pass: ${rows.get().length} rows, ${widths.get().length} widths`);
});

// this feeds the reaction above, so one write drains in more than one pass
reaction(() => widths.set(rows.get().map(row => row.length)));

rows.push('gamma');

// registered once at the write site, so the expensive part runs once
afterFlush(() => console.log(`settled: ${rows.peek().length} rows, ${widths.peek().length} widths`));

flush();
