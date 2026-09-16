// Symbol.for keys survive cross-realm boundaries (bundles, iframes), so
// `instanceof DateTime` works against any realm's class definition
// the whole family under one key, so a package reads any of the seven with one property
export const IS_TEMPORAL = Symbol.for('semantic-ui/Temporal');
export const IS_DATE_TIME = Symbol.for('semantic-ui/DateTime');
export const IS_CALENDAR_DATE = Symbol.for('semantic-ui/CalendarDate');
export const IS_TIME = Symbol.for('semantic-ui/Time');
export const IS_DURATION = Symbol.for('semantic-ui/Duration');
export const IS_RANGE = Symbol.for('semantic-ui/Range');
export const IS_DATE_RANGE = Symbol.for('semantic-ui/DateRange');
export const IS_DATE_TIME_RANGE = Symbol.for('semantic-ui/DateTimeRange');
export const IS_TIME_RANGE = Symbol.for('semantic-ui/TimeRange');
