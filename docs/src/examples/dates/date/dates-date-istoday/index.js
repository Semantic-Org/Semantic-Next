import { date, today, tomorrow } from '@semantic-ui/dates';

console.log(today().isToday());
console.log(tomorrow().isToday());
console.log(date('2000-01-01').isToday());
console.log(today('Asia/Tokyo').isToday('Asia/Tokyo'));
