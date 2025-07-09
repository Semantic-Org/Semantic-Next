import { noop } from '@semantic-ui/utils';

const value = 'hello';
const result = noop(value);
console.log(result);

// common use case - default callback
function processData(data, callback = noop) {
  const processed = data.toUpperCase();
  callback(processed);
  return processed;
}

const data = processData('test');
console.log(data);
