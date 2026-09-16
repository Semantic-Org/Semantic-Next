import { configure, date, datetime, duration, months } from '@semantic-ui/dates';
import { CalendarDate, DateRange, DateTime, Duration, VALUE } from '@semantic-ui/dates/schema';

configure({ zone: 'America/New_York' });

// the kind's word, and whether it orders
console.log(CalendarDate[VALUE].kind, CalendarDate[VALUE].ordered);
console.log(DateRange[VALUE].kind, DateRange[VALUE].ordered);

// the wire form read back
console.log(CalendarDate[VALUE].decode('2026-09-06').toString());

// a key is equal exactly when equals() holds
console.log(CalendarDate[VALUE].key(date('2026-09-06')));
console.log(DateTime[VALUE].key(datetime('2026-09-06T14:30Z')));
console.log(DateTime[VALUE].key(new Date('2026-09-06T14:30:00Z')));
console.log(Duration[VALUE].key(duration('PT90M')));

// a length counting months has no key
try {
  Duration[VALUE].key(months(2));
}
catch (error) {
  console.log(error.code);
}

// a calendar day against an instant field is that whole day in the configured zone
const [start, end] = DateTime[VALUE].span(date('2026-03-08'));
console.log(start.toString(), end.toString(), start.until(end, 'hours'));
