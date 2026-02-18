import { wait } from '@semantic-ui/utils';

const start = performance.now();
const getTime = () => Math.round(performance.now() - start);
const controller = new AbortController();
const stopWaiting = () => controller.abort();

// cancel all waits after timeout
setTimeout(stopWaiting, 1200);

// basic usage
await wait(500);
console.log(`Basic wait: ${getTime()}ms`);

// sequential delays
for (let i = 1; i <= 3; i++) {
  await wait(200);
  console.log(`Step ${i}: ${getTime()}ms`);
}

// this wait gets cancelled by the abort above
await wait(5000, { abortController: controller });
console.log(`Cancelled: ${getTime()}ms (not 5000ms later)`);
