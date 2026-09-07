import { time } from '@semantic-ui/dates';

const opens = time('9am');

console.log(opens.toJSON());
console.log(JSON.stringify({ opens }));
console.log(time(JSON.parse(JSON.stringify(opens))).equals(opens));
