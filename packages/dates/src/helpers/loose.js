import { zoneId } from './zones.js';

// a loose string that names an instant: Z, GMT, UTC or an offset at its end, with or without Date's own
// parenthesised zone name after it
const namesInstant = /(?:GMT|UTC|Z|[+-]\d{2}(?::?\d{2})?)(?:\s*\([^)]*\))?\s*$/i;

// whatever this engine's Date reads that Temporal refuses, RFC 2822 and locale strings included. a
// string naming an instant reads in the zone asked for. any other string is a wall clock, read the way
// Date reads it and then stood in the zone asked for, so the day and the clock the person wrote stay
export const looseZoned = (text, zone) => {
  const epoch = Date.parse(text);
  if (Number.isNaN(epoch)) {
    return undefined;
  }
  const instant = Temporal.Instant.fromEpochMilliseconds(epoch);
  if (namesInstant.test(text.trim())) {
    return instant.toZonedDateTimeISO(zoneId(zone));
  }
  return instant.toZonedDateTimeISO(Temporal.Now.timeZoneId()).toPlainDateTime().toZonedDateTime(zoneId(zone));
};
