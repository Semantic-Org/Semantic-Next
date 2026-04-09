import { formatDate } from '@semantic-ui/utils';

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
