/*
  each kind's Type, built with the schema package's defineType and carried on the class under
  Symbol.for('semantic-ui/value'): the name, the reads (parse lenient for a write, read and decode
  throwing this library's own refusal), toJSON() as the wire form, a key injective over equals(),
  whether the kind orders, and the family that registers together. a length adds and refuses a
  calendar month, the instant kind states what a calendar day means for it and names the Date it
  upgrades. one file per kind under schema/, in a subpath of its own, so the bare entry has none of
  it, and the schema package is the consumer: naming one class in a schema registers the seven
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
