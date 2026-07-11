import { reaction, resource, signal } from '@semantic-ui/reactivity';

const query = signal('gala');

// a fake API, 1s per lookup, resolves null when a run is superseded
const search = (term, abortSignal) =>
  new Promise((resolve) => {
    const timer = setTimeout(() => resolve(`${term} apples`), 1000);
    abortSignal.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve(null);
    });
  });

const results = resource(async (comp) => {
  const term = query.get(); // tracked, refetches when query changes
  return search(term, comp.abortSignal);
}, { initialValue: 'nothing yet' });

// re-runs only when a face it reads flips
reaction(() => {
  console.log(results.loading ? 'loading...' : `showing: ${results.get()}`);
});

// supersedes the gala lookup mid-flight, the latest term wins
query.set('honeycrisp');
