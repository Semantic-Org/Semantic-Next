/*
  the subpath registers the seven kinds with @semantic-ui/schema as it loads, each kind's Type built
  with defineType in its own file: the reads (parse lenient for a write, read and decode throwing this
  library's own refusal), toJSON() as the wire form, a key injective over equals(), whether the kind
  orders. a length adds and refuses a calendar month, the instant kind states what a calendar day
  means for it and upgrades the built-in Date under the same name. the bare entry has none of it, so
  importing this subpath is the whole opt-in
*/

import { registerType } from '@semantic-ui/schema';

import { CalendarDateType as calendarDate } from './calendar-date.js';
import { DateRangeType as dateRange } from './date-range.js';
import { DateTimeType as dateTime } from './date-time.js';
import { DateTimeRangeType as dateTimeRange } from './datetime-range.js';
import { DurationType as duration } from './duration.js';
import { TimeRangeType as timeRange } from './time-range.js';
import { TimeType as time } from './time.js';

// registered here, once each. the instant's registration upgrades the built-in datetime and hands that Type back
export const DateTimeType = registerType(dateTime);
export const CalendarDateType = registerType(calendarDate);
export const TimeType = registerType(time);
export const DurationType = registerType(duration);
export const DateRangeType = registerType(dateRange);
export const DateTimeRangeType = registerType(dateTimeRange);
export const TimeRangeType = registerType(timeRange);

export { CalendarDate } from '../calendar-date.js';
export { DateTime } from '../date-time.js';
export { Duration } from '../duration.js';
export { DateRange, DateTimeRange, TimeRange } from '../range.js';
export { Time } from '../time.js';
