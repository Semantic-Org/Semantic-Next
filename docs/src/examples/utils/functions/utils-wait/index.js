import { wait } from '@semantic-ui/utils';

const start = performance.now();
const getTime = () => Math.round(performance.now() - start);

// basic usage
await wait(500);
console.log(`Basic wait: ${getTime()}ms`);

// sequential delays
for (let i = 1; i <= 3; i++) {
  await wait(200);
  console.log(`Step ${i}: ${getTime()}ms`);
}

// abort rejects with AbortError (default)
const controller = new AbortController();
setTimeout(() => controller.abort(), 100);
try {
  await wait(5000, { abortController: controller });
}
catch (e) {
  console.log(`Rejected: ${e.name} at ${getTime()}ms`);
}

// rejectOnAbort: false resolves instead
const controller2 = new AbortController();
setTimeout(() => controller2.abort(), 100);
await wait(5000, { abortController: controller2, rejectOnAbort: false });
console.log(`Resolved early: ${getTime()}ms`);
