import { sortBy } from '@semantic-ui/utils';

const users = [
  { name: 'Anna', age: 30, apartment: '10A' },
  { name: 'Bob', age: 19, apartment: '2B' },
  { name: 'Erik', age: 25, apartment: '1C' },
  { name: 'Marie', age: 30, apartment: '12A' },
  { name: 'Åsa', age: 28, apartment: '3B' },
];

// Sort by single key (handles accented characters properly)
console.log('By name:');
console.log(sortBy(users, 'name'));

// Sort by multiple keys (age first, then name)
console.log('By age, then name:');
console.log(sortBy(users, ['age', 'name']));

// Natural sort for apartment numbers (1C, 2B, 3B, 10A, 12A)
console.log('By apartment (natural sort):');
console.log(sortBy(users, 'apartment'));

// Custom comparator with specific locale (å, ä, ö come after z in Swedish)
console.log('By name (Swedish locale):');
console.log(sortBy(users, 'name', (a, b) => a.localeCompare(b, 'sv', { sensitivity: 'base' })));
