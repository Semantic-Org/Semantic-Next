import { throttle } from '@semantic-ui/utils';

async function fetchData(endpoint) {
  await new Promise(resolve => setTimeout(resolve, 50));
  console.log(`Fetched: ${endpoint}`);
  return `data from ${endpoint}`;
}

// async throttling with promise handling
const throttledFetch = throttle(fetchData, 200);

// first call executes immediately
throttledFetch('/users').then(result => {
  console.log('First result:', result);
});

// subsequent calls queue for trailing execution
throttledFetch('/posts');
throttledFetch('/comments'); // this replaces /posts

// rapid async calls
setTimeout(() => {
  const rapidThrottle = throttle(fetchData, 150);
  for (let i = 1; i <= 4; i++) {
    rapidThrottle(`/api/v${i}`).then(result => {
      console.log(`API result: ${result}`);
    });
  }
}, 400);
