import { today, tomorrow } from '@semantic-ui/dates';

console.log(tomorrow().toString());
console.log(tomorrow().since(today(), 'days'));
console.log(tomorrow('Asia/Tokyo').toString());
