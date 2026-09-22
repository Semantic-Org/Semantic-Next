import { dateTimeFormat } from './intl.js';
import { pad, plural, units } from './units.js';

/*
  the text a value leads with, in the most conventional form for what it holds: what a Date prints
  for the point kinds, the fields spelled out for a length, both ends for a span. English names and
  the parts already read, so it costs a string. the longer strings are joined rather than templated,
  because a template literal past a dozen characters is a cons tree that costs six times the text
  until something reads it
*/

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fields = units.map(plural);

// 'Sun Sep 06 2026', what toDateString() prints
export const legibleDate = ({ weekday, month, day, year }) =>
  [weekdays[weekday - 1], months[month - 1], pad(day), (year < 0 ? '-' : '') + pad(year, 4)].join(' ');

// '17:30:15', the clock toTimeString() prints
export const legibleTime = ({ hour, minute, second }) => `${pad(hour)}:${pad(minute)}:${pad(second)}`;

// a zone's long name as Intl spells it in English, 'Eastern Daylight Time'. a formatter call costs
// more than the rest of the text twenty times over, so the name is kept per zone, offset and day:
// within one day at one offset a zone has one name, and the offset moves at every transition
const zoneNames = new Map();
const zoneName = ({ zone, offset, epoch }) => {
  const key = zone + offset + Math.floor(epoch / 86_400_000);
  let name = zoneNames.get(key);
  if (name === undefined) {
    name = dateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'long' })
      .formatToParts(epoch)
      .find((part) => part.type === 'timeZoneName').value;
    zoneNames.set(key, name);
  }
  return name;
};

// 'Sun Sep 06 2026 14:30:15 GMT-0400 (Eastern Daylight Time)', what toString() prints
export const legibleDateTime = (parts) =>
  [
    legibleDate(parts),
    legibleTime(parts),
    'GMT' + parts.offset.replace(':', ''),
    '(' + zoneName(parts) + ')',
  ].join(' ');

// '1 hour, 30 minutes', the fields as written, so a value prints what it holds and format() balances
export const legibleDuration = (temporal) => {
  const parts = [];
  for (const [index, name] of units.entries()) {
    const count = temporal[fields[index]];
    if (count) {
      parts.push([count, Math.abs(count) === 1 ? name : fields[index]].join(' '));
    }
  }
  return parts.length ? parts.join(', ') : '0 seconds';
};

// 'Tue Sep 01 2026 to Mon Sep 07 2026', both ends. 'to' rather than a dash, which would sit beside a negative offset
export const legibleRange = ({ start, end }) => [start.text, end.text].join(' to ');
