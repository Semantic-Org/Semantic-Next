import { reverseKeys } from './objects.js';

/*-------------------
        Dates
--------------------*/

const timezoneMap = {
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
};

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

const tokenRegExp = /\[([^\]]*)]|YYYY|YY|MMMM|MMM|MM|M|Do|DD|D|dddd|ddd|HH|hh|h|mm|ss|a/g;
const needsNumericMonth = /\bMM?\b/;
const formatterCache = new Map();
const monthFormatterCache = new Map();

const ordinalSuffix = ['th', 'st', 'nd', 'rd'];
const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
const getOrdinal = (d) => d + ((d >= 11 && d <= 13) ? 'th' : (ordinalSuffix[d % 10] || 'th'));

export const formatDate = (date, format = 'LLL', {
  locale = 'default',
  hour12 = true,
  timezone = 'UTC',
  ...additionalOptions
} = {}) => {
  if (date == null || isNaN(date.getTime?.())) { return 'Invalid Date'; }

  const resolvedTimezone = timezone === 'local' ? undefined : (timezoneMap[timezone] || timezone);
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
  };

  // single-pass replacement
  tokenRegExp.lastIndex = 0;
  return formatString.replace(tokenRegExp, (match, escaped) => {
    return escaped !== undefined ? escaped : tokens[match];
  });
};
