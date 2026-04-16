import { noop } from '@semantic-ui/utils';

// noop swallows arguments and returns undefined
console.log(noop()); // undefined
console.log(noop(1, 2, 3)); // undefined

// common use case - default callback that is safe to invoke
function processData(data, callback = noop) {
  const processed = data.toUpperCase();
  callback(processed);
  return processed;
}

console.log(processData('test')); // 'TEST'
