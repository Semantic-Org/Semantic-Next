import { debounce } from '@semantic-ui/utils';

async function saveData(data) {
  await new Promise(resolve => setTimeout(resolve, 50));
  console.log(`Saved: ${data}`);
  return `result: ${data}`;
}

// async debouncing with promise sharing
const debouncedSave = debounce(saveData, 200);

// all calls share the same promise
Promise.all([
  debouncedSave('data1'),
  debouncedSave('data2'),
  debouncedSave('data3'), // only this executes
]).then(results => {
  console.log('All results:', results); // all get same result
});

// subsequent calls after settlement
setTimeout(async () => {
  const result = await debouncedSave('data4');
  console.log('New result:', result);
}, 400);
