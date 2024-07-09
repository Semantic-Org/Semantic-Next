import { $ } from '@semantic-ui/query';

// alternatively can inline as attributes in html
$('search-component').settings({
  placeholder: 'Search fruit...',
  options: ['Tomato', 'Strawberry', 'Blueberry', 'Kumquat', 'Banana']
});
