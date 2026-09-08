import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30:15.250', 'America/New_York');

console.log(moment.year, moment.month, moment.day);
console.log(moment.hour, moment.minute, moment.second, moment.millisecond);

// ISO weekday, 1 for monday through 7 for sunday
console.log(moment.weekday);

console.log(moment.zone);
console.log(moment.offset);
console.log(moment.epoch);

console.log(moment.quarter, moment.dayOfYear, moment.weekOfYear);
console.log(moment.daysInMonth, moment.daysInYear, moment.hoursInDay);

// the date and the time as their own values
console.log(moment.date.toString());
console.log(moment.time.toString());
