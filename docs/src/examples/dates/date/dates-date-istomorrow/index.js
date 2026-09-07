import { today, tomorrow } from '@semantic-ui/dates';

console.log(tomorrow().isTomorrow());
console.log(today().isTomorrow());
console.log(tomorrow('Asia/Tokyo').isTomorrow('Asia/Tokyo'));
