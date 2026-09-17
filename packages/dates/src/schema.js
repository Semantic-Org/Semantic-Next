/*
  the value protocol, what a schema reads off a class to store, compare and order its values:
  the kind's name, a strict read for the wire and a read for a write, a primitive key injective
  over equals(), whether the kind orders, and the family that registers together. a length declares
  summable and a wire form stricter than toJSON(), and the instant kind declares condition, what a
  field of it means for a calendar day, and upgrades, the built-in it stands in for. the reads throw
  this library's own refusal. one file per kind under schema/, attached in a subpath of its own, so
  the bare entry has none of it and a schema that names one class is the whole opt-in
*/

import './schema/calendar-date.js';
import './schema/date-range.js';
import './schema/date-time.js';
import './schema/datetime-range.js';
import './schema/duration.js';
import './schema/time-range.js';
import './schema/time.js';

export { CalendarDate } from './calendar-date.js';
export { DateTime } from './date-time.js';
export { Duration } from './duration.js';
export { DateRange, DateTimeRange, TimeRange } from './range.js';
export { VALUE } from './schema/protocol.js';
export { Time } from './time.js';
