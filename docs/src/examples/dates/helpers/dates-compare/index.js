import { compare, date, dateRange, datetime, hours, time } from '@semantic-ui/dates';

const dates = ['2026-03-01', '2026-01-01', '2026-02-01'].map(date);
console.log(dates.sort(compare).map(String));

// a raw value beside a point reads as the point's kind
console.log(compare(datetime('2026-09-06T14:30Z'), '2026-09-06T14:30:00Z'));
console.log(compare(time('5pm'), '9am'));
console.log(compare(hours(1), '90m'));

// ranges order by start, then by end
const q1 = dateRange('2026-01-01', '2026-03-31');
const january = dateRange('2026-01-01', '2026-01-31');
const q2 = dateRange('2026-04-01', '2026-06-30');
console.log([q2, q1, january].sort(compare).map(String));

// kinds do not compare with each other
try {
  compare(date('2026-09-06'), datetime('2026-09-06T14:30Z'));
}
catch (error) {
  console.log(error.code);
}
