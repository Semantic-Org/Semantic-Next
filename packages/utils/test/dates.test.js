import { formatDate, formatDuration, toDuration } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format dates correctly with predefined formats', () => {
      const testCases = [
        {
          date: '2023-05-18T00:00:00Z',
          formats: {
            LT: '12:00 am',
            LTS: '12:00:00 am',
            L: '05/18/2023',
            l: '5/18/2023',
            LL: 'May 18, 2023',
            ll: 'May 18, 2023',
            LLL: 'May 18, 2023 12:00 am',
            lll: 'May 18, 2023 12:00 am',
            LLLL: 'Thursday, May 18, 2023 12:00 am',
            llll: 'Thu, May 18, 2023 12:00 am',
          },
        },
        {
          date: '2023-05-18T01:23:45Z',
          formats: {
            LT: '1:23 am',
            LTS: '1:23:45 am',
            L: '05/18/2023',
            l: '5/18/2023',
            LL: 'May 18, 2023',
            ll: 'May 18, 2023',
            LLL: 'May 18, 2023 1:23 am',
            lll: 'May 18, 2023 1:23 am',
            LLLL: 'Thursday, May 18, 2023 1:23 am',
            llll: 'Thu, May 18, 2023 1:23 am',
          },
        },
        {
          date: '2023-12-31T23:59:59Z',
          formats: {
            LT: '11:59 pm',
            LTS: '11:59:59 pm',
            L: '12/31/2023',
            l: '12/31/2023',
            LL: 'December 31, 2023',
            ll: 'Dec 31, 2023',
            LLL: 'December 31, 2023 11:59 pm',
            lll: 'Dec 31, 2023 11:59 pm',
            LLLL: 'Sunday, December 31, 2023 11:59 pm',
            llll: 'Sun, Dec 31, 2023 11:59 pm',
          },
        },
        {
          date: '2024-02-29T12:30:00Z',
          formats: {
            LT: '12:30 pm',
            LTS: '12:30:00 pm',
            L: '02/29/2024',
            l: '2/29/2024',
            LL: 'February 29, 2024',
            ll: 'Feb 29, 2024',
            LLL: 'February 29, 2024 12:30 pm',
            lll: 'Feb 29, 2024 12:30 pm',
            LLLL: 'Thursday, February 29, 2024 12:30 pm',
            llll: 'Thu, Feb 29, 2024 12:30 pm',
          },
        },
        {
          date: '2023-06-01T09:30:00Z',
          formats: {
            LT: '9:30 am',
            LTS: '9:30:00 am',
            L: '06/01/2023',
            l: '6/1/2023',
            LL: 'June 1, 2023',
            ll: 'Jun 1, 2023',
            LLL: 'June 1, 2023 9:30 am',
            lll: 'Jun 1, 2023 9:30 am',
            LLLL: 'Thursday, June 1, 2023 9:30 am',
            llll: 'Thu, Jun 1, 2023 9:30 am',
          },
        },
        {
          date: '2023-01-01T00:00:00Z',
          formats: {
            LT: '12:00 am',
            LTS: '12:00:00 am',
            L: '01/01/2023',
            l: '1/1/2023',
            LL: 'January 1, 2023',
            ll: 'Jan 1, 2023',
            LLL: 'January 1, 2023 12:00 am',
            lll: 'Jan 1, 2023 12:00 am',
            LLLL: 'Sunday, January 1, 2023 12:00 am',
            llll: 'Sun, Jan 1, 2023 12:00 am',
          },
        },
        {
          date: '2023-01-01T00:01:00Z',
          formats: {
            LT: '12:01 am',
            LTS: '12:01:00 am',
            L: '01/01/2023',
            l: '1/1/2023',
            LL: 'January 1, 2023',
            ll: 'Jan 1, 2023',
            LLL: 'January 1, 2023 12:01 am',
            lll: 'Jan 1, 2023 12:01 am',
            LLLL: 'Sunday, January 1, 2023 12:01 am',
            llll: 'Sun, Jan 1, 2023 12:01 am',
          },
        },
        {
          date: '2023-01-02T00:00:00Z',
          formats: {
            LT: '12:00 am',
            LTS: '12:00:00 am',
            L: '01/02/2023',
            l: '1/2/2023',
            LL: 'January 2, 2023',
            ll: 'Jan 2, 2023',
            LLL: 'January 2, 2023 12:00 am',
            lll: 'Jan 2, 2023 12:00 am',
            LLLL: 'Monday, January 2, 2023 12:00 am',
            llll: 'Mon, Jan 2, 2023 12:00 am',
          },
        },
        {
          date: '2023-01-01T00:00:00Z',
          formats: {
            LT: '7:00 pm',
            LTS: '7:00:00 pm',
            L: '12/31/2022',
            l: '12/31/2022',
            LL: 'December 31, 2022',
            ll: 'Dec 31, 2022',
            LLL: 'December 31, 2022 7:00 pm',
            lll: 'Dec 31, 2022 7:00 pm',
            LLLL: 'Saturday, December 31, 2022 7:00 pm',
            llll: 'Sat, Dec 31, 2022 7:00 pm',
          },
          options: {
            timezone: 'America/New_York',
          },
        },
      ];

      testCases.forEach(({ date, formats, options }) => {
        const dateObj = new Date(date);

        Object.entries(formats).forEach(([format, expectedValue]) => {
          expect(formatDate(dateObj, format, options)).toBe(expectedValue);
        });
      });
    });

    const date = new Date('2023-05-18T15:34:56Z');

    it('should format date with default options', () => {
      expect(formatDate(date, 'YYYY-MM-DD hh:mm:ss a')).toBe('2023-05-18 03:34:56 pm');
    });

    it('should format date with 12-hour format when hour12 is true', () => {
      expect(formatDate(date, 'YYYY-MM-DD hh:mm:ss a', { hour12: true })).toBe('2023-05-18 03:34:56 pm');
    });

    it('should format date with 24-hour format when hour12 is false', () => {
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss', { hour12: false })).toBe('2023-05-18 15:34:56');
    });

    it('should format date with custom timezone', () => {
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss', { timezone: 'America/New_York' })).toBe('2023-05-18 11:34:56');
    });

    it('should handle timezone shorthand (ET, PT, etc)', () => {
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss', { timezone: 'ET' })).toBe('2023-05-18 11:34:56');
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss', { timezone: 'PT' })).toBe('2023-05-18 08:34:56');
    });

    it('reads shorthand aliases from formatDate.config.timezones, editable at boot', () => {
      const savedZone = formatDate.config.timezones.IST;
      formatDate.config.timezones.IST = 'Asia/Jerusalem';
      try {
        expect(formatDate(date, 'HH:mm', { timezone: 'IST' })).toBe('18:34');
      }
      finally {
        formatDate.config.timezones.IST = savedZone;
      }
      expect(formatDate(date, 'HH:mm', { timezone: 'IST' })).toBe('21:04');
    });
    /*
    it('should format date with local timezone', () => {
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss', { timezone: 'local' })).toBe('2023-05-18 ' + date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    });*/

    it('should format date with predefined format (LT)', () => {
      expect(formatDate(date, 'LT')).toBe('3:34 pm');
    });

    it('should format date with predefined format (LTS)', () => {
      expect(formatDate(date, 'LTS')).toBe('3:34:56 pm');
    });

    it('should format date with predefined format (L)', () => {
      expect(formatDate(date, 'L')).toBe('05/18/2023');
    });

    it('should format date with predefined format (LL)', () => {
      expect(formatDate(date, 'LL')).toBe('May 18, 2023');
    });

    it('should format date with predefined format (LLL)', () => {
      expect(formatDate(date, 'LLL')).toBe('May 18, 2023 3:34 pm');
    });

    it('should format date with predefined format (LLLL)', () => {
      expect(formatDate(date, 'LLLL')).toBe('Thursday, May 18, 2023 3:34 pm');
    });

    it('should format date with custom format string', () => {
      expect(formatDate(date, '[Today is] dddd, MMMM Do, YYYY')).toBe('Today is Thursday, May 18th, 2023');
    });

    it('should handle single-digit hours correctly', () => {
      const earlyDate = new Date('2023-05-18T09:34:56Z');
      expect(formatDate(earlyDate, 'YYYY-MM-DD hh:mm:ss a', { hour12: true })).toBe('2023-05-18 09:34:56 am');
      expect(formatDate(earlyDate, 'YYYY-MM-DD HH:mm:ss', { hour12: false })).toBe('2023-05-18 09:34:56');
    });

    it('should handle midnight correctly', () => {
      const midnightDate = new Date('2023-05-18T00:00:00Z');
      expect(formatDate(midnightDate, 'YYYY-MM-DD hh:mm:ss a', { hour12: true })).toBe('2023-05-18 12:00:00 am');
      expect(formatDate(midnightDate, 'YYYY-MM-DD HH:mm:ss', { hour12: false })).toBe('2023-05-18 00:00:00');
    });

    it('should handle 24:00 hour format (convert to 00:00)', () => {
      // Some time formats use 24:00 to represent end of day
      const date24 = new Date('2023-05-18T00:00:00Z');
      const formatted = formatDate(date24, 'HH:mm:ss', { hour12: false });
      expect(formatted).toBe('00:00:00');
    });

    it('should handle noon correctly', () => {
      const noonDate = new Date('2023-05-18T12:00:00Z');
      expect(formatDate(noonDate, 'YYYY-MM-DD hh:mm:ss a', { hour12: true })).toBe('2023-05-18 12:00:00 pm');
      expect(formatDate(noonDate, 'YYYY-MM-DD HH:mm:ss', { hour12: false })).toBe('2023-05-18 12:00:00');
    });

    it('should format MM token with zero-padded numeric month', () => {
      expect(formatDate(new Date('2023-01-15T00:00:00Z'), 'MM')).toBe('01');
      expect(formatDate(new Date('2023-09-15T00:00:00Z'), 'MM')).toBe('09');
      expect(formatDate(new Date('2023-12-15T00:00:00Z'), 'MM')).toBe('12');
    });

    it('should format M token with unpadded numeric month', () => {
      expect(formatDate(new Date('2023-01-15T00:00:00Z'), 'M')).toBe('1');
      expect(formatDate(new Date('2023-09-15T00:00:00Z'), 'M')).toBe('9');
      expect(formatDate(new Date('2023-12-15T00:00:00Z'), 'M')).toBe('12');
    });

    it('should handle leap years correctly', () => {
      const leapYearDate = new Date('2024-02-29T15:34:56Z');
      expect(formatDate(leapYearDate, 'YYYY-MM-DD')).toBe('2024-02-29');
    });

    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');
      expect(formatDate(invalidDate, 'YYYY-MM-DD')).toBe('Invalid Date');
    });
  });
});

describe('formatDate — ordinal suffixes', () => {
  it('should format 1st, 2nd, 3rd correctly', () => {
    expect(formatDate(new Date('2023-01-01T00:00:00Z'), 'Do')).toBe('1st');
    expect(formatDate(new Date('2023-01-02T00:00:00Z'), 'Do')).toBe('2nd');
    expect(formatDate(new Date('2023-01-03T00:00:00Z'), 'Do')).toBe('3rd');
  });

  it('should format 11th, 12th, 13th (special cases)', () => {
    expect(formatDate(new Date('2023-01-11T00:00:00Z'), 'Do')).toBe('11th');
    expect(formatDate(new Date('2023-01-12T00:00:00Z'), 'Do')).toBe('12th');
    expect(formatDate(new Date('2023-01-13T00:00:00Z'), 'Do')).toBe('13th');
  });

  it('should format 21st, 22nd, 23rd correctly', () => {
    expect(formatDate(new Date('2023-01-21T00:00:00Z'), 'Do')).toBe('21st');
    expect(formatDate(new Date('2023-01-22T00:00:00Z'), 'Do')).toBe('22nd');
    expect(formatDate(new Date('2023-01-23T00:00:00Z'), 'Do')).toBe('23rd');
  });

  it('should handle escaped text in format strings', () => {
    const date = new Date('2023-05-18T00:00:00Z');
    expect(formatDate(date, '[Day:] D [of] MMMM')).toBe('Day: 18 of May');
  });
});

describe('formatDate — invalid input', () => {
  it('should return "Invalid Date" for null', () => {
    expect(formatDate(null)).toBe('Invalid Date');
  });

  it('should return "Invalid Date" for undefined', () => {
    expect(formatDate(undefined)).toBe('Invalid Date');
  });
});

describe('formatDuration', () => {
  it('picks the largest unit the value fills', () => {
    expect(formatDuration(0)).toBe('0ms');
    expect(formatDuration(500)).toBe('500ms');
    expect(formatDuration(5000)).toBe('5s');
    expect(formatDuration(300000)).toBe('5m');
    expect(formatDuration(3600000)).toBe('1h');
    expect(formatDuration(86400000)).toBe('1d');
    expect(formatDuration(604800000)).toBe('1w');
  });

  it('caps at the top of the ladder rather than inventing a unit', () => {
    expect(formatDuration(1814400000)).toBe('3w');
    expect(formatDuration(31449600000)).toBe('52w');
  });

  it('rounds to decimals as a maximum, dropping trailing zeros', () => {
    expect(formatDuration(90000)).toBe('1.5m');
    expect(formatDuration(90000, { decimals: 0 })).toBe('2m');
    expect(formatDuration(90000, { decimals: 3 })).toBe('1.5m');
    expect(formatDuration(1234567)).toBe('20.6m');
    expect(formatDuration(1234567, { decimals: 3 })).toBe('20.576m');
    expect(formatDuration(1234567, { decimals: 0 })).toBe('21m');
  });

  it('promotes a value that rounds up to a whole unit', () => {
    expect(formatDuration(3598200)).toBe('1h');
    expect(formatDuration(3598200, { decimals: 3 })).toBe('59.97m');
    expect(formatDuration(999.96)).toBe('1s');
    expect(formatDuration(59.5, { decimals: 0 })).toBe('60ms');
  });

  it('keeps the sign', () => {
    expect(formatDuration(-90000)).toBe('-1.5m');
    expect(formatDuration(-500)).toBe('-500ms');
    expect(formatDuration(-0)).toBe('0ms');
  });

  it('prints sub-millisecond values', () => {
    expect(formatDuration(0.5)).toBe('0.5ms');
    expect(formatDuration(0.04)).toBe('0ms');
  });

  it('reads anything toDuration reads', () => {
    expect(formatDuration('90s')).toBe('1.5m');
    expect(formatDuration('1.5h')).toBe('1.5h');
    expect(formatDuration('10 minutes')).toBe('10m');
    expect(formatDuration('1500')).toBe('1.5s');
  });

  it('returns null when there is no duration to format', () => {
    expect(formatDuration('banana')).toBe(null);
    expect(formatDuration('1h 30m')).toBe(null);
    expect(formatDuration(null)).toBe(null);
    expect(formatDuration(undefined)).toBe(null);
    expect(formatDuration(NaN)).toBe(null);
    expect(formatDuration(Infinity)).toBe(null);
    expect(formatDuration({})).toBe(null);
  });

  it('holds one unit for a column when asked', () => {
    expect(formatDuration(90000, { unit: 's' })).toBe('90s');
    expect(formatDuration(1500, { unit: 'ms' })).toBe('1500ms');
    expect(formatDuration(5400000, { unit: 'd', decimals: 3 })).toBe('0.063d');
    expect(formatDuration(5400000, { unit: 'd' })).toBe('0.1d');
    expect(formatDuration(-90000, { unit: 's' })).toBe('-90s');
  });

  it('prints the unit as spelled, any spelling toDuration reads', () => {
    expect(formatDuration(90000, { unit: 'minutes' })).toBe('1.5minutes');
    expect(formatDuration(5400000, { unit: 'HR' })).toBe('1.5hr');
    expect(formatDuration(5400000, { unit: 'fortnight' })).toBe(null);
  });

  it('holds a unit without promoting', () => {
    expect(formatDuration(3598200, { unit: 'm' })).toBe('60m');
  });

  it('puts a separator between the number and the unit when asked', () => {
    expect(formatDuration(90000, { separator: ' ' })).toBe('1.5 m');
    expect(formatDuration(90000, { unit: 'minutes', separator: ' ' })).toBe('1.5 minutes');
    expect(formatDuration(-90000, { separator: ' ' })).toBe('-1.5 m');
    expect(toDuration(formatDuration(90000, { unit: 'minutes', separator: ' ' }))).toBe(90000);
  });

  describe('lossless', () => {
    it('walks on to the largest unit that reads back exactly', () => {
      expect(formatDuration(100000, { lossless: true })).toBe('100s');
      expect(formatDuration(93784000, { lossless: true })).toBe('93784s');
      expect(formatDuration(3598200, { lossless: true })).toBe('3598.2s');
      expect(formatDuration(777600000, { lossless: true })).toBe('9d');
    });

    it('keeps the short print when it already reads back', () => {
      expect(formatDuration(300000, { lossless: true })).toBe('5m');
      expect(formatDuration(2500, { lossless: true })).toBe('2.5s');
      expect(formatDuration(1100, { lossless: true })).toBe('1.1s');
      expect(formatDuration(0.5, { lossless: true })).toBe('0.5ms');
      expect(formatDuration(0, { lossless: true })).toBe('0ms');
    });

    it('honors decimals as the precision a unit may print at', () => {
      expect(formatDuration(2500, { lossless: true, decimals: 0 })).toBe('2500ms');
      expect(formatDuration(1234567, { lossless: true, decimals: 3 })).toBe('1234.567s');
    });

    it('round-trips through toDuration', () => {
      const values = [
        0,
        0.5,
        20,
        333,
        1000,
        1100,
        2500,
        4000,
        10000,
        30000,
        60000,
        100000,
        300000,
        3598200,
        5400000,
        93784000,
        777600000,
        -90000,
      ];
      for (const value of values) {
        expect(toDuration(formatDuration(value, { lossless: true }))).toBe(value);
      }
    });
  });

  describe('config', () => {
    it('reads its defaults from formatDuration.config', () => {
      const { decimals, lossless, separator } = formatDuration.config;
      formatDuration.config.decimals = 0;
      formatDuration.config.lossless = true;
      formatDuration.config.separator = ' ';
      expect(formatDuration(90000)).toBe('90 s');
      expect(formatDuration(90000, { decimals: 1 })).toBe('1.5 m');
      expect(formatDuration(100000, { lossless: false, decimals: 1 })).toBe('1.7 m');
      expect(formatDuration(90000, { separator: '' })).toBe('90s');
      Object.assign(formatDuration.config, { decimals, lossless, separator });
    });

    it('takes a unit added to both toDuration and the ladder', () => {
      toDuration.config.units.y = 365.25 * 86400000;
      formatDuration.config.units.unshift('y');
      expect(formatDuration(365.25 * 86400000 * 2)).toBe('2y');
      expect(formatDuration(86400000 * 400)).toBe('1.1y');
      expect(formatDuration(86400000 * 400, { lossless: true })).toBe('400d');
      expect(toDuration(formatDuration(365.25 * 86400000 * 2))).toBe(365.25 * 86400000 * 2);
      formatDuration.config.units.shift();
      delete toDuration.config.units.y;
      expect(formatDuration(365.25 * 86400000 * 2)).toBe('104.4w');
    });
  });
});
