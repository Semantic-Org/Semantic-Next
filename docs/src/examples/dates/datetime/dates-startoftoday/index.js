import { now, startOfToday } from '@semantic-ui/dates';

console.log(startOfToday().toString());
console.log(startOfToday().equals(now().startOf('day')));

// midnight in a zone
console.log(startOfToday('Asia/Tokyo').hour);
console.log(startOfToday('Asia/Tokyo').zone);
