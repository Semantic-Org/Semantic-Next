import { reaction, signal } from '@semantic-ui/reactivity';

const query = signal('gala');

const search = (term, abortSignal) =>
  new Promise((resolve) => {
    const timer = setTimeout(() => resolve(`${term} apples`), 100);
    abortSignal.addEventListener('abort', () => {
      clearTimeout(timer);
      console.log(`"${term}" aborted`);
      resolve(null);
    });
  });

reaction(async (comp) => {
  const term = query.get(); // tracked, read before the first await
  const results = await search(term, comp.abortSignal);
  if (results) {
    console.log(`found ${results}`);
  }
});

// writes while a run is in flight abort it and coalesce into one re-run
query.set('fuji');
query.set('honeycrisp');
