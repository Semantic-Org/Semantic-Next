import { now } from '@semantic-ui/dates';

console.log(now().toString());
console.log(now().format());

// in a zone
console.log(now('Asia/Tokyo').zone);
console.log(now('Asia/Tokyo').format('time'));

// millisecond precision, so a JSON round trip reads back equal
console.log(now().microsecond);
