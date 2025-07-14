import { weightedObjectSearch } from '@semantic-ui/utils';

const items = [
  { title: 'Apple iPhone Pro', category: 'phone', description: 'Latest smartphone from Apple' },
  { title: 'Samsung Galaxy', category: 'phone', description: 'Android phone with great camera' },
  { title: 'Apple Watch', category: 'watch', description: 'Smartwatch from Apple Inc' },
  { title: 'MacBook Pro Apple', category: 'laptop', description: 'Professional laptop' },
];

// Basic search - finds items containing "apple"
console.log('=== Basic Search for "apple" ===');
const basicResults = weightedObjectSearch('apple', items, {
  propertiesToMatch: ['title', 'category', 'description'],
});
console.log(basicResults.map(item => ({ title: item.title, weight: item.weight })));

// Multi-word search
console.log('\n=== Multi-word Search for "apple phone" ===');
const multiResults = weightedObjectSearch('apple phone', items, {
  propertiesToMatch: ['title', 'category', 'description'],
});
console.log(multiResults.map(item => ({ title: item.title, weight: item.weight })));

// With match details
console.log('\n=== With Match Details ===');
const detailedResults = weightedObjectSearch('apple', items, {
  propertiesToMatch: ['title', 'description'],
  returnMatches: true,
});
console.log(detailedResults[0]);
