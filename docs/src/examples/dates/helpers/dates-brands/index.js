import {
  date,
  dateRange,
  DateTime,
  datetime,
  IS_CALENDAR_DATE,
  IS_DATE_RANGE,
  IS_DATE_TIME,
  IS_RANGE,
} from '@semantic-ui/dates';

console.log(datetime('2026-09-06T14:30Z')[IS_DATE_TIME]);
console.log(date('2026-09-06')[IS_DATE_TIME]);
console.log(date('2026-09-06')[IS_CALENDAR_DATE]);

// every range kind carries IS_RANGE beside its own brand
const week = dateRange('2026-09-01', '2026-09-07');
console.log(week[IS_RANGE], week[IS_DATE_RANGE]);

// keyed with Symbol.for, so another copy of the library makes the same key
console.log(IS_DATE_TIME === Symbol.for('semantic-ui/DateTime'));
console.log(IS_DATE_TIME.description);

// instanceof reads the brand, not the prototype
console.log(datetime('2026-09-06T14:30Z') instanceof DateTime);
