import { debounce } from '@semantic-ui/utils';

// simple function to debounce
function search(query) {
  console.log(`Searching for: ${query}`);
}

// basic debouncing with just delay
const debouncedSearch = debounce(search, 300);

console.log('Rapid calls (only last will execute):');
debouncedSearch('a');
debouncedSearch('ap');
debouncedSearch('app');
debouncedSearch('apple');

// with immediate execution
const immediateSearch = debounce(search, { delay: 300, immediate: true });

setTimeout(() => {
  console.log('\nWith immediate execution:');
  immediateSearch('immediate query');
  immediateSearch('will be ignored');
}, 1000);

// cancel functionality
const cancelableSearch = debounce(search, 500);
cancelableSearch('will be canceled');
cancelableSearch.cancel();
console.log('Search was canceled');
