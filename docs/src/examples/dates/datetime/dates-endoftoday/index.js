import { endOfToday } from '@semantic-ui/dates';

console.log(endOfToday().toString());
console.log(endOfToday().hour);
console.log(endOfToday().millisecond);

console.log(endOfToday('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss.SSS z'));
