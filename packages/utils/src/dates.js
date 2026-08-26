import { toDuration } from './coercion.js';
import { configured } from './functions.js';
import { roundDecimal } from './numbers.js';

/*-------------------
        Dates
--------------------*/

const presetFormats = {
  LT: 'h:mm a',
  LTS: 'h:mm:ss a',
  L: 'MM/DD/YYYY',
  l: 'M/D/YYYY',
  LL: 'MMMM D, YYYY',
  ll: 'MMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm a',
  lll: 'MMM D, YYYY h:mm a',
  LLLL: 'dddd, MMMM D, YYYY h:mm a',
  llll: 'ddd, MMM D, YYYY h:mm a',
};

const tokenRegExp = /\[([^\]]*)]|YYYY|YY|MMMM|MMM|MM|M|Do|DD|D|dddd|ddd|HH|hh|h|mm|ss|a|A/g;
const needsNumericMonth = /\bMM?\b/;
const formatterCache = new Map();
const monthFormatterCache = new Map();

const ordinalSuffix = ['th', 'st', 'nd', 'rd'];
const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
const getOrdinal = (d) => d + ((d >= 11 && d <= 13) ? 'th' : (ordinalSuffix[d % 10] || 'th'));

// timezone abbreviations are ambiguous by nature (IST is Kolkata, Jerusalem, or Dublin depending on
// who you ask), so the picks are editable once at app boot (formatDate.config.timezones.IST =
// 'Asia/Jerusalem'). full IANA names always pass through untouched
export const formatDate = /* @__PURE__ */ configured((date, format = 'LLL', {
  locale = 'default',
  hour12 = true,
  timezone = 'UTC',
  ...additionalOptions
} = {}) => {
  if (date == null || isNaN(date.getTime?.())) { return 'Invalid Date'; }

  const timezones = formatDate.config.timezones;
  const resolvedTimezone = timezone === 'local'
    ? undefined
    : (Object.hasOwn(timezones, timezone) ? timezones[timezone] : timezone);
  const formatString = presetFormats[format] || format;
  const resolvedLocale = locale === 'default' ? undefined : locale;

  // Cached Intl.DateTimeFormat — construction is ~100x more expensive than formatToParts
  const optionKeys = Object.keys(additionalOptions);
  const optionString = optionKeys.length === 0 ? '' : JSON.stringify(additionalOptions);
  const cacheKey = locale + '|' + (resolvedTimezone || '') + '|' + optionString;
  let formatter = formatterCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(resolvedLocale, {
      timeZone: resolvedTimezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hourCycle: 'h23',
      ...additionalOptions,
    });
    formatterCache.set(cacheKey, formatter);
  }

  const dateParts = formatter.formatToParts(date).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  const { year, month, day, weekday, hour, minute, second } = dateParts;

  // Numeric month — only create a second formatter when format uses MM or M tokens
  let numericMonth = 0;
  if (needsNumericMonth.test(formatString)) {
    const monthKey = locale + '|' + (resolvedTimezone || '');
    let monthFormatter = monthFormatterCache.get(monthKey);
    if (!monthFormatter) {
      monthFormatter = new Intl.DateTimeFormat(resolvedLocale, {
        timeZone: resolvedTimezone,
        month: 'numeric',
      });
      monthFormatterCache.set(monthKey, monthFormatter);
    }
    const monthParts = monthFormatter.formatToParts(date);
    for (let i = 0; i < monthParts.length; i++) {
      if (monthParts[i].type === 'month') {
        numericMonth = parseInt(monthParts[i].value, 10);
        break;
      }
    }
  }

  // Derived values for token resolution
  const hour24Value = hour === '24' ? 0 : (parseInt(hour, 10) || 0);
  const hour12Value = hour24Value % 12 || 12;
  const dayNumber = parseInt(day, 10) || 0;

  const tokens = {
    YYYY: year,
    YY: pad2(parseInt(year, 10) % 100),
    MMMM: month,
    MMM: month.slice(0, 3),
    MM: pad2(numericMonth),
    M: numericMonth,
    DD: pad2(dayNumber),
    D: dayNumber,
    Do: getOrdinal(dayNumber),
    dddd: weekday,
    ddd: weekday.slice(0, 3),
    HH: pad2(hour24Value),
    hh: hour12 ? pad2(hour12Value) : pad2(hour24Value),
    h: hour12 ? hour12Value : hour24Value,
    mm: minute,
    ss: second,
    a: hour12 ? (hour24Value < 12 ? 'am' : 'pm') : '',
    A: hour12 ? (hour24Value < 12 ? 'AM' : 'PM') : '',
  };

  // single-pass replacement
  tokenRegExp.lastIndex = 0;
  return formatString.replace(tokenRegExp, (match, escaped) => {
    return escaped !== undefined ? escaped : tokens[match];
  });
}, {
  timezones: {
    ET: 'America/New_York',
    CT: 'America/Chicago',
    MT: 'America/Denver',
    PT: 'America/Los_Angeles',
    AKT: 'America/Anchorage',
    HT: 'Pacific/Honolulu',
    AT: 'America/Halifax',
    UK: 'Europe/London',
    WET: 'Europe/London',
    CET: 'Europe/Paris',
    ECT: 'Europe/Paris',
    EET: 'Europe/Helsinki',
    IRST: 'Europe/Dublin',
    AET: 'Australia/Sydney',
    ACT: 'Australia/Adelaide',
    AWT: 'Australia/Perth',
    NZT: 'Pacific/Auckland',
    BRT: 'America/Sao_Paulo',
    IST: 'Asia/Kolkata',
    INST: 'Asia/Kolkata',
    JST: 'Asia/Tokyo',
    SGT: 'Asia/Singapore',
  },
});

// the ladder is spelled in toDuration's vocabulary and reads its spans from there, so every string
// this prints reads back through toDuration. a unit is added to both: toDuration.config.units.y for
// the span, formatDuration.config.units.unshift('y') for its place in the walk
export const formatDuration = /* @__PURE__ */ configured(
  (value, options = {}) => {
    const config = formatDuration.config;
    const decimals = options.decimals ?? config.decimals;
    const lossless = options.lossless ?? config.lossless;
    const separator = options.separator ?? config.separator;
    const spans = toDuration.config.units;
    const ms = toDuration(value);
    if (ms === null) { return null; }
    const magnitude = Math.abs(ms);
    let unit;
    if (options.unit != null) {
      unit = String(options.unit).toLowerCase();
      if (!Object.hasOwn(spans, unit)) { return null; }
    }
    else {
      const ladder = config.units;
      let index = 0;
      let span = spans[ladder[0]];
      // walk largest first to the first unit the value fills. lossless walks on to the first one
      // whose rounded print reads back to the same value, the product toDuration itself computes
      while (
        index < ladder.length - 1
        && (magnitude < span || (lossless && roundDecimal(magnitude / span, decimals) * span !== magnitude))
      ) {
        span = spans[ladder[++index]];
      }
      // 59.97m rounds to 60m, which is a whole hour. a lossless pick is exact and never promotes
      if (
        !lossless && index > 0 && roundDecimal(magnitude / span, decimals) * span >= spans[ladder[index - 1]]
      ) { index--; }
      unit = ladder[index];
    }
    return (ms < 0 ? '-' : '') + roundDecimal(magnitude / spans[unit], decimals) + separator + unit;
  },
  {
    decimals: 1,
    lossless: false,
    separator: '',
    units: ['w', 'd', 'h', 'm', 's', 'ms'],
  },
);
