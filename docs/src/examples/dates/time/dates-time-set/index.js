import { time } from '@semantic-ui/dates';

const moment = time('09:00');

console.log(moment.set({ minute: 30 }).toString());
console.log(moment.set('hour', 17).toString());
console.log(moment.set('second', 45).toString());

try {
  moment.set('minute', 75);
}
catch (error) {
  console.log(error.code);
}
