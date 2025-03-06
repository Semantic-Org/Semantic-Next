/*-------------------
        Dates
--------------------*/

export const formatDate = function(date, format = 'LLL', {
  locale = 'default',
  hour12 = true,
  timezone = 'UTC',
  ...additionalOptions
} = {}) {
  // Check for invalid dates
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  // Create a new Date object with the same timestamp as the original date
  const localDate = new Date(date.getTime());

  if (timezone === 'local') {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  const pad = (n) => (n < 10 ? `0${n}` : n);

  const localeOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: hour12,
    ...additionalOptions
  };

  // Create an Intl.DateTimeFormat instance with the specified timezone or user's local timezone
  const formatter = new Intl.DateTimeFormat(locale, localeOptions);

  // Get the formatted date components using the Intl.DateTimeFormat instance
  const dateParts = formatter.formatToParts(localDate).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  let { year, month, day, weekday, hour, minute, second, dayPeriod } = dateParts;

  // Handle midnight in 24-hour format
  if (hour === '24') {
    hour = '00';
  }

  // Create a new Date object with the specified timezone
  const timezoneDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));

  const dateMap = {
    YYYY: year,
    YY: year.slice(-2),
    MMMM: month,
    MMM: month.slice(0, 3),
    MM: pad(timezoneDate.getMonth() + 1),
    M: timezoneDate.getMonth() + 1,
    DD: pad(timezoneDate.getDate()),
    D: timezoneDate.getDate(),
    Do: day + ['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 !== 10) * day % 10],
    dddd: weekday,
    ddd: weekday.slice(0, 3),
    HH: hour.padStart(2, '0'),
    hh: hour12 ? (hour % 12 || 12).toString().padStart(2, '0') : hour.padStart(2, '0'),
    h: hour12 ? (hour % 12 || 12).toString() : hour,
    mm: minute,
    ss: second,
    a: hour12 && dayPeriod ? dayPeriod.toLowerCase() : '',
  };

  const formatMap = {
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

  format = format.trim();
  const expandedFormat = formatMap[format] || format;

  return expandedFormat
    .replace(/\b(?:YYYY|YY|MMMM|MMM|MM|M|DD|D|Do|dddd|ddd|HH|hh|h|mm|ss|a)\b/g, (match) => {
      return dateMap[match];
    })
    .replace(/\[(.+?)\]/g, (match, p1) => p1)
    .trim();
};
