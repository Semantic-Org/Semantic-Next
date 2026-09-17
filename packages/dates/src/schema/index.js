/*
  the subpath registers the seven kinds with @semantic-ui/schema as it loads, each kind's Type built
  with defineType in its own file: the reads (parse lenient for a write, read and decode throwing this
  library's own refusal), toJSON() as the wire form, a key injective over equals(), whether the kind
  orders. a length adds and refuses a calendar month, the instant kind states what a calendar day
  means for it and upgrades the built-in Date under the same name. the bare entry has none of it, so
  importing this subpath is the whole opt-in
*/

export { CalendarDateType } from './calendar-date.js';
export { DateRangeType } from './date-range.js';
export { DateTimeType } from './date-time.js';
export { DateTimeRangeType } from './datetime-range.js';
export { DurationType } from './duration.js';
export { TimeRangeType } from './time-range.js';
export { TimeType } from './time.js';

export { CalendarDate } from '../calendar-date.js';
export { DateTime } from '../date-time.js';
export { Duration } from '../duration.js';
export { DateRange, DateTimeRange, TimeRange } from '../range.js';
export { Time } from '../time.js';
