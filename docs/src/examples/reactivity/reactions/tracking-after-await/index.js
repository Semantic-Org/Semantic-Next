import { reaction, settled, signal } from '@semantic-ui/reactivity';

const query = signal('gala');
const sortOrder = signal('price');
const pageSize = signal(10);

const search = (term) => new Promise((resolve) => setTimeout(() => resolve(`${term} apples`), 100));

reaction(async (comp) => {
  const term = query.get(); // tracked, read before the first await
  const results = await search(term);
  const sort = sortOrder.get(); // registers nothing, the await ended the tracking window
  const size = comp.track(() => pageSize.get()); // track reopens the window for a sync block
  console.log(`${results} sorted by ${sort}, ${size} per page`);
});

// settled waits for the in-flight run, flush would return while search is still pending
await settled();

query.set('honeycrisp');
await settled();

sortOrder.set('rating');
await settled();
console.log('sort changed, nothing re-ran');

pageSize.set(25);
