import { createCache } from '@semantic-ui/utils';

// default LRU — evicts the least recently used entry when full
const lru = createCache({ maxSize: 3 });
lru.set('a', 1);
lru.set('b', 2);
lru.set('c', 3);
lru.get('a'); // touching 'a' protects it
lru.set('d', 4); // evicts 'b' (least recently used)
console.log([...lru.keys()]);

// FIFO — evicts the oldest inserted entry regardless of reads
const fifo = createCache({ maxSize: 3, eviction: 'fifo' });
fifo.set('a', 1);
fifo.set('b', 2);
fifo.set('c', 3);
fifo.get('a'); // reads do not affect insertion order
fifo.set('d', 4); // evicts 'a'
console.log([...fifo.keys()]);

// Flush — clears the entire cache when full (cheap bulk invalidation)
const flushing = createCache({ maxSize: 3, eviction: 'flush' });
flushing.set('a', 1);
flushing.set('b', 2);
flushing.set('c', 3);
flushing.set('d', 4); // clears a/b/c, then stores 'd'
console.log([...flushing.keys()]);

// onEvict — observe every entry that leaves the cache
const observed = createCache({
  maxSize: 2,
  onEvict: (key, value) => console.log('evicted', key, value),
});
observed.set('x', 10);
observed.set('y', 20);
observed.set('z', 30);

// Map-like API: has, delete, clear, size, and iteration
const cache = createCache({ maxSize: 10 });
cache.set('one', 1).set('two', 2);
console.log(cache.has('one'));
console.log(cache.size);
console.log([...cache.entries()]);
