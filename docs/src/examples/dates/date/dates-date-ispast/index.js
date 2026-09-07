import { date, today, tomorrow, yesterday } from '@semantic-ui/dates';

console.log(date('2000-01-01').isPast());
console.log(yesterday().isPast());
console.log(tomorrow().isPast());

// today depends on where you stand
console.log(today('Asia/Tokyo').isPast('Asia/Tokyo'));
