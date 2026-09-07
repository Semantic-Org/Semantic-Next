import { today } from '@semantic-ui/dates';

console.log(today().toString());
console.log(today().format('full'));

// today depends on where you stand
console.log(today('Asia/Tokyo').toString());
console.log(today('Pacific/Honolulu').toString());
