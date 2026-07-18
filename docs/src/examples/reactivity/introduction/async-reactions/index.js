import { reaction, signal } from '@semantic-ui/reactivity';

const query = signal('gala');

const search = (term) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`${term} apples`), 1000);
  });
};

reaction(async () => {
  const term = query.get(); // tracked, read before the first await
  console.log(`found ${await search(term)}`);
});

// a change mid-flight coalesces into one re-run after the current run settles
query.set('honeycrisp');
