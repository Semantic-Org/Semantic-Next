import { duration, weeks } from '@semantic-ui/dates';

const ttl = duration('1h 30m');

console.log(ttl.toJSON());
console.log(JSON.stringify({ ttl }));
console.log(duration(JSON.parse(JSON.stringify(ttl))).equals(ttl));
console.log(weeks(1).toJSON());
