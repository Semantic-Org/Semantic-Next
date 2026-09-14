import { debounce } from '@semantic-ui/utils';

function search(query) {
  console.log(`Searching: ${query}`);
  return query;
}

// basic debouncing - only last call executes
const debouncedSearch = debounce(search, 200);
debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc'); // only this executes

// leading edge - executes on both leading and trailing edges
setTimeout(() => {
  const leadingDebounce = debounce(search, 200, { leading: true });
  leadingDebounce('first'); // executes immediately (leading)
  leadingDebounce('second'); // executes after 200ms (trailing)
}, 300);

// maxWait - forces execution after maximum time
setTimeout(() => {
  const maxWaitDebounce = debounce(search, 300, { maxWait: 500 });
  maxWaitDebounce('input1');
  setTimeout(() => maxWaitDebounce('input2'), 100);
  setTimeout(() => maxWaitDebounce('input3'), 200);
  setTimeout(() => maxWaitDebounce('input4'), 400); // forces execution at 500ms
  // input5 triggers a new debounce cycle after maxWait
  setTimeout(() => maxWaitDebounce('input5'), 600); // executes 300ms later
}, 600);

// abortController - a teardown drops the pending call, its promise resolves to undefined
setTimeout(() => {
  const controller = new AbortController();
  const abortable = debounce(search, 200, { abortController: controller });
  abortable('unmounted').then((result) => console.log(`Aborted resolved with: ${result}`));
  controller.abort(); // search never runs
}, 1700);
