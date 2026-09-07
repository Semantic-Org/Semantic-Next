# @semantic-ui/dates

**Temporal, spoken plainly.** Five words cover what business logic says about time, each one a
Temporal type underneath and one call away from it.

| word | what it is | class | Temporal underneath |
| --- | --- | --- | --- |
| `datetime` | an exact moment, with a zone to read it in | `DateTime` | `ZonedDateTime` |
| `date` | a calendar day, no clock, no zone | `CalendarDate` | `PlainDate` |
| `time` | a time of day, no date | `Time` | `PlainTime` |
| `duration` | a length of time | `Duration` | `Duration` |
| `dateRange` `datetimeRange` `timeRange` | a span between two points, named by what it holds | `DateRange` `DateTimeRange` `TimeRange` | two of the above |

The lowercase word is the factory and the class is exported beside it, for `instanceof` and for a
schema that takes a constructor. The brands are exported too, `IS_DATE_TIME` and its siblings, keyed
with `Symbol.for` so a package recognises a value from any copy of this library without bundling it.

```js
import { date, days, datetime, now, time, timeRange } from '@semantic-ui/dates';

const due = date('2026-09-01').plus(days(30));                           // a due date is a date
const visit = date('2026-11-03').at('9:30am', 'America/Los_Angeles');    // date + time + zone = datetime
const open = timeRange(time('9am'), time('5:30pm'));                      // hours are times
open.contains(now().in('Chicago').time);                                  // the store is open
now().since(visit).round('hour').format();                                // '2 months, 3 days, 4 hours'
```

## Installation

```
npm install @semantic-ui/dates
```

The library wraps the runtime's own `Temporal`. Node 26 and current Chromium, Firefox and Safari
ship it. For a runtime without one, load a polyfill first, `import 'temporal-polyfill/global'`.

## The rules

**Three plain words compose into the fourth.** `date.at(time, zone)` and `time.on(date, zone)` make a
datetime. `datetime.date` and `datetime.time` take one apart. A date never carries a clock, so
`date.plus(hours(3))` refuses and says to combine first.

**A zone is a view, an instant is the value.** `datetime('...Z')` fixes the instant. The zone it is read
in is the explicit argument, else a bracketed zone in the string, else the configured default, else the
machine's. An offset in a string never becomes the zone, because arithmetic across a daylight saving
boundary needs the real one. `toString()` and `toJSON()` print the instant in UTC, so two clients
storing the same moment store the same bytes.

**A zone answers to its names.** Anywhere a zone is read it may be an IANA name, a city (`'Berlin'`,
`'los angeles'`), an abbreviation (`'PT'`, `'CET'`, utils' `timezones` table is the floor), a
fixed offset, or a name of your own from `configure({ zoneAliases: { hq: 'Europe/Berlin' } })`, in any case
and spacing. The 418 canonical cities are all distinct, so a city is never a guess.

**Only a datetime is a number.** `valueOf()` gives epoch milliseconds, so datetimes sort with
`(a, b) => a - b` and compare with `<`, while `'Due ' + dt` gives the string, as `Date` decides it. A date, a time and a range refuse `valueOf` with the method to
use instead, so `due < now()` throws rather than being silently always true. A duration is
milliseconds when it has no months or years, or when it came from `until()` and knows its calendar.

**A date range runs through its end. A datetime or time range runs until it.** The 1st through the 7th
is seven days, both included, which is how people write dates. Nine until five excludes five o'clock,
which is how shifts and bookings abut without a conflict. A time range may cross midnight:
`timeRange('22:00', '06:00')` is the night shift, eight hours long, and `contains('01:00')` is true.

**Fields are balanced parts, `total(unit)` is the whole.** `a.until(b)` gives years down to
nanoseconds, so `.months` is the months part. `a.until(b, 'days')` and `.total('days')` give the count.
A duration from `until()` remembers where it started, so months and years total correctly.

**Strict by default, loose on request.** The factories read ISO 8601 and refuse the rest, with the way
out in the error. A missing value refuses too, `now()` and `today()` are the doors for the present.
`{ loose: true }`, the options form of the last argument on all seven factories, reads whatever the
engine's `Date` reads, RFC 2822 and locale strings included, and gives null rather than a throw for
what cannot be read: a point that is not one, a length that is not one, a range with such an end. What
reads but is wrong, a backwards range or an unknown zone, still throws, since that is a mistake in the
code rather than in the data's form. A `Date` object is read everywhere without asking.

**Nouns are properties, questions and verbs are calls.** `dt.year`, `dt.date`, `range.duration` and
`slot.start` read as data, and the parts are real properties, so a value prints them in a console without
a click. `isWeekend()`, `isPast()`, `plus()` and `toFields()` are calls, whatever they need to answer.

**Same verbs everywhere.** `plus`, `minus`, `set`, `startOf`, `endOf`, `round`, `floor`, `ceil`,
`isBefore`, `isAfter`, `equals`, `isSame`, `until`, `since`, `to`, `format`, `formatRelative`. Every method
that takes another point also takes anything its factory reads, so `dt.isBefore('2027-01-01')` works.

## datetime

```js
now(zone?)      datetime(input, zone?)      datetime(input, { zone, loose })
```

Input: an ISO string (`'2026-09-06T14:30Z'`, `'2026-09-06T14:30'` as a wall clock in the zone,
`'2026-09-06'` as midnight), a `Date`, epoch milliseconds, a fields object, a date, a Temporal value.

| read | `year` `month` `day` `weekday` (1 monday to 7 sunday) `hour` `minute` `second` `millisecond` `zone` `offset` `epoch` `quarter` `dayOfYear` `weekOfYear` `daysInMonth` `daysInYear` `hoursInDay` `date` `time` |
| --- | --- |
| move | `plus(x)` `minus(x)` `set({ hour: 9 })` `set('hour', 9)` `at('9am')` `in('Asia/Tokyo')` `startOf('month')` `endOf('day')` `round(15, 'minutes')` `floor('hour')` `ceil('hour')` `next('friday')` `previous('monday')` |
| ask | `equals` `isBefore` `isAfter` `isSame(other, 'day')` `isPast()` `isFuture()` `isToday()` `isTomorrow()` `isYesterday()` `isWeekend()` `isWeekday()` `isLeapYear()` |
| measure | `until(other)` `since(other)` a duration, `until(other, 'hours')` a number, `to(end)` `range('week')` a range |
| show | `format()` medium date and short time, `format('short' \| 'long' \| 'full' \| 'date' \| 'time')`, `format({ dateStyle: 'medium' })`, `format('YYYY-MM-DD h:mm a z')` in day.js tokens, where the presets stand in for `L` and `LLL`, `formatRelative()` |
| out | `toString()` `toJSON()` the instant in UTC, `toJSDate()` `toTemporal()` `valueOf()` epoch milliseconds |

`plus` and `minus` take a duration, a fields object `{ days: 3 }`, a phrase `'1h 30m'`, or a number and
unit `(3, 'days')`. Adding days keeps the wall clock across a daylight saving change, adding hours
counts hours. A count written as text reads as its number beside a unit, so `plus('30', 'days')` from
a form is thirty days. `set` refuses a part out of range, `set('minute', 60)` is `cannotSet`, the way
every factory refuses one. `round`, `floor` and `ceil` snap the wall clock, so on the repeated hour of a
fall-back night they land on its second pass. An Intl options object may name its own `timeZone`.

## date

```js
today(zone?)  tomorrow(zone?)  yesterday(zone?)     date(input)  date(2026, 9, 6)  date(input, zone)  date(input, { zone, loose })
```

Input: `'2026-09-06'`, three numbers, a fields object, a datetime (its date in its zone), a `Date` (its
date in the zone), a Temporal value. A wall-clock string keeps its day: `date('2026-09-06T23:30')` is
the 6th. A string carrying Z or an offset is an instant whose day depends on the zone, so it refuses
unless `{ loose: true, zone }` says which, or `datetime(text, zone).date` chooses it.

| read | `year` `month` `day` `weekday` `quarter` `dayOfYear` `weekOfYear` `daysInMonth` `daysInYear` |
| --- | --- |
| move | `plus` `minus` (years, months, weeks, days) `set` `startOf('week')` `endOf('month')` the last day, `next('monday')` `previous('friday')` |
| ask | `equals` `isBefore` `isAfter` `isSame(other, 'month')` `isPast(zone?)` `isFuture()` `isToday()` `isTomorrow()` `isYesterday()` `isWeekend()` `isWeekday()` `isLeapYear()` |
| combine | `at(time, zone?)` a datetime, `to(end)` `range('month')` a range, `points('hour', zone?)` `split(minutes(30), zone?)` the day's slots as datetimes |
| measure | `until(other)` `since(other)` `until(other, 'days')` |
| show | `format()` `format('long')` `format('MMMM Do, YYYY')` `formatRelative()` yesterday, tomorrow, in 2 weeks |
| out | `toString()` `toJSON()` `'2026-09-06'`, `toJSDate(zone?)` `toTemporal()` |

## time

```js
time(input)  time(9, 30)  time(input, zone)  time(input, { zone, loose })
```

Input: `'09:00'`, `'9am'`, `'5:30 pm'`, `'17:30:15.250'`, numbers, a fields object, a datetime, a `Date`
(its clock in the zone). Arithmetic wraps like a clock face. `until` is signed within the day.

| read | `hour` `minute` `second` `millisecond` |
| --- | --- |
| move | `plus` `minus` `set` `startOf('hour')` `round(30, 'minutes')` `floor` `ceil` |
| ask | `equals` `isBefore` `isAfter` `isSame(other, 'hour')` |
| combine | `on(date, zone?)` a datetime, `to(end)` a range |
| show | `format()` short, `format('HH:mm')` |
| out | `toString()` `toJSON()` `'17:30:00'` `'17:30:15.250'` a fraction in groups of three, `toTemporal()` |

## duration

```js
duration('1h 30m')  duration('2 weeks and 3 days')  duration('PT1H30M')  duration({ hours: 1, minutes: 30 })
duration(90, 'minutes')  duration(1500)              // milliseconds, as utils' toDuration reads it
duration(input, { loose: true })                     // null for what is not a length
years(1) months(1) weeks(1) days(1) hours(1) minutes(1) seconds(1) milliseconds(1)
```

Every spelling `toDuration` in `@semantic-ui/utils` reads is read here, plus compounds, calendar units
and fractions: `1.5 days` is a day and twelve hours. A fraction of a month is refused, and so is a
phrase with mixed signs, `'1h -30m'`, since a length has one sign.

Fields stay as written: `duration('90m')` prints `PT90M` until `balance()` makes it `PT1H30M`. A length
balances to hours and never to days, because a day is a calendar unit that only an anchor or an explicit
`balance('day')` makes from clock time, and folding 36 hours into a day would move a deadline across a
daylight saving change. `plus` and `minus` keep the same line: `days(1).plus(hours(25))` is `P1DT25H`,
and `days(1).minus(hours(1))` refuses, since a day less an hour has no one length. Two durations that
`equals()` can therefore print differently, so a stored length is its `toMilliseconds()`. A bare number
is milliseconds, fractions included, so `duration(performance.now() - start)` reads, and `format()`
prints the clock balanced, so `duration(stored).format()` reads as hours and minutes while `toString()`
keeps the fields as written. A count written as text reads beside its unit: `days('30')` is thirty days.

| read | `years` `months` `weeks` `days` `hours` `minutes` `seconds` `milliseconds` `sign` `anchor`, `toFields()` the nonzero ones |
| --- | --- |
| move | `plus` `minus` `times(n)` `negated()` `abs()` `balance()` 90 minutes to an hour and a half, `balance('day')` `round('minute')` |
| ask | `equals` `compare` `isZero()` `isNegative()` |
| measure | `total('hours')` the whole in one unit, fractional, `toMilliseconds()` |
| show | `format()` `'2 hours, 30 minutes'`, `format('short' \| 'narrow' \| 'digital')` `'2 hr, 30 min'` `'2h 30m'` `'2:30:00'` |
| out | `toString()` `toJSON()` `'PT2H30M'` as written, `toTemporal()` `valueOf()` milliseconds |

## dateRange, datetimeRange, timeRange

```js
dateRange(start, end)  datetimeRange(start, duration)  timeRange('09:00/17:00')  start.to(end)
dateRange(start, end, zone)  dateRange(start, end, { loose: true, zone })   // null for an end that cannot be read
dt.range('day')  date.range('month')       // the unit around a point, as its kind's range
```

A range is named by what it holds, the way Postgres names `daterange` and `tstzrange`, so a reader
knows the kind at the callsite and a `range` from another library never collides. An end reads through
the range's own kind first, `'5pm'` is a time and `dateRange(datetime, datetime)` is the range of their
dates, and as a length when written as one, `'2h'`, `{ hours: 2 }` or a duration. `{ zone }` reads a
datetime range's start in that zone.

| read | `start` `end` `kind` `duration` |
| --- | --- |
| ask | `contains(point)` `contains(range)` `overlaps(other)` `equals` `isEmpty()`, all around the clock for a time range |
| move | `intersection(other)` or null, `in(zone)` a date range becomes the datetime bounds for a query |
| walk | `points('day')` `points(minutes(15))` the points, `split('week')` `split(hours(1))` the sub-ranges |
| show | `format()` `'Sep 1 – 7, 2026'`, `format('time')` `'9:00 – 10:00 AM'` |
| out | `toString()` `toJSON()` `'start/end'` |

Steps count out from the start, so monthly from the 31st lands on each month's last day. A time range
across midnight walks through it. Its intersection with another range refuses when the overlap comes
out in two pieces, `twoPieces`, since one range cannot hold both.

## helpers

```js
compare(a, b)                 // a sort comparator across any one kind, ranges by start then end
earliest(...points)  latest(...points)
configure({ zone: 'UTC', locale: 'en-GB', weekStart: 'sunday', zoneAliases: { hq: 'Europe/Berlin' } })   // each checked at boot
isDateTime(x) isCalendarDate(x) isTime(x) isDuration(x) isDateRange(x) isDateTimeRange(x) isTimeRange(x) kindOf(x)
IS_DATE_TIME IS_CALENDAR_DATE IS_TIME IS_DURATION IS_RANGE IS_DATE_RANGE IS_DATE_TIME_RANGE IS_TIME_RANGE
```

## what survives the wire

`toJSON()` is the wire form, and each factory reads its own back exactly. Two things do not travel.

| kind | prints | does not travel |
| --- | --- | --- |
| `datetime` | the instant in UTC, `2026-09-06T14:30:00.000Z`, six or nine fraction digits only when the value has them | the zone, which is a view. `datetime(text, zone)` or `configure({ zone })` chooses it on the reading side |
| `date` | `2026-09-06` | |
| `time` | `17:30:00`, a fraction in groups of three | |
| `duration` | the fields as written, `PT90M` | the anchor from `until()`, so months and years lose their calendar. A stored length is `toMilliseconds()` |
| the ranges | `start/end` | as their ends |

A meeting at 9am in Berlin next March is a wall clock plus a zone, and that pair is not a type here.
Store the day, the time and the zone as their own fields and compose them with `date.at(time, zone)`
when reading, so a change to the zone's rules moves the instant and not the meeting.

## errors

Every refusal is a coded `RangeError` or `TypeError` built with utils' `createErrors`, one line in
production (`dates refused [notADate] 2026-09-06T14:00Z`) with the way out appended in development.
Codes: `backwards` `cannotAdd` `cannotBalance` `cannotRound` `cannotSet` `cannotSubtract` `cannotTotal` `emptyStep` `fractionalMonth` `mixedKinds` `mixedRange` `mixedSigns` `needsAnchor` `noField` `noPoints` `noTemporal` `noTokens` `noZone` `notADate` `notADateTime` `notADateUnit` `notADuration` `notANumber` `notAPoint` `notATime` `notFinite` `twoPieces` `unknownFormat` `unknownLocale` `unknownUnit` `unknownWeekday` `unknownZone` `unreadableDate` `unreadableDateTime` `unreadableDuration` `unreadableTime`.

## not here, on purpose

Free-form parsing by default: strict reads ISO 8601, and `{ loose: true }` reads what `Date` reads.
Calendar phrases (`'Today at 2:30 PM'`), business days, recurrence rules, and format-string parsing are
each a real feature with its own design, not a method.
