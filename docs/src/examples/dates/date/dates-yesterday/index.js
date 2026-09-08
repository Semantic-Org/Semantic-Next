import { today, yesterday } from '@semantic-ui/dates';

console.log(yesterday().toString());
console.log(today().since(yesterday(), 'days'));
console.log(yesterday('Asia/Tokyo').toString());
