import { today, yesterday } from '@semantic-ui/dates';

console.log(yesterday().isYesterday());
console.log(today().isYesterday());
console.log(yesterday('Asia/Tokyo').isYesterday('Asia/Tokyo'));
