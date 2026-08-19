import {
  coerceBoolean,
  coerceDate,
  coerceDuration,
  coerceInteger,
  coerceNumber,
  coerceString,
  toBoolean,
  toDate,
  toDuration,
  toInteger,
  toNumber,
  toString,
} from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('toBoolean', () => {
  it('passes booleans through and reads numbers by zero-ness', () => {
    expect(toBoolean(true)).toBe(true);
    expect(toBoolean(false)).toBe(false);
    expect(toBoolean(1)).toBe(true);
    expect(toBoolean(-3)).toBe(true);
    expect(toBoolean(0)).toBe(false);
    expect(toBoolean(-0)).toBe(false);
    expect(toBoolean(NaN)).toBe(false);
  });

  it('recognizes generous true and false spellings, case-insensitively', () => {
    for (const truthy of ['true', 'TRUE', 't', 'yes', 'y', 'on', 'enabled', ' on ']) {
      expect(toBoolean(truthy)).toBe(true);
    }
    for (const falsy of ['false', 'FALSE', 'f', 'no', 'n', 'off', 'disabled', ' off ', 'null', 'undefined', 'nan']) {
      expect(toBoolean(falsy)).toBe(false);
    }
  });

  it('reads numeric strings by their value', () => {
    expect(toBoolean('1')).toBe(true);
    expect(toBoolean('2e3')).toBe(true);
    expect(toBoolean('0')).toBe(false);
    expect(toBoolean('0.0')).toBe(false);
  });

  it('returns null for anything it does not recognize', () => {
    expect(toBoolean('banana')).toBe(null);
    expect(toBoolean('')).toBe(null);
    expect(toBoolean('   ')).toBe(null);
    expect(toBoolean(null)).toBe(null);
    expect(toBoolean(undefined)).toBe(null);
    expect(toBoolean({})).toBe(null);
    expect(toBoolean([1])).toBe(null);
  });

  it('falls back to native truthiness under loose, never returning null', () => {
    expect(toBoolean('banana', { loose: true })).toBe(true);
    expect(toBoolean({}, { loose: true })).toBe(true);
    expect(toBoolean([1], { loose: true })).toBe(true);
    expect(toBoolean('', { loose: true })).toBe(false);
    expect(toBoolean(null, { loose: true })).toBe(false);
    expect(toBoolean(0n, { loose: true })).toBe(false);
  });

  it('extends the falsy set per call, tolerating a single token or non-strings', () => {
    expect(toBoolean('nope', { falsy: ['nope'] })).toBe(false);
    expect(toBoolean('nope', { falsy: 'nope' })).toBe(false);
    expect(toBoolean('nope', { falsy: ['nope '] })).toBe(false);
    expect(toBoolean('x', { falsy: [0, 1] })).toBe(null);
    expect(toBoolean('false', { falsy: ['nope'] })).toBe(false);
    expect(toBoolean('yes', { falsy: ['nope'] })).toBe(true);
  });

  it('lets a caller falsy token override the built-in truthy set', () => {
    expect(toBoolean('y', { falsy: ['y'] })).toBe(false);
    expect(toBoolean('on', { falsy: ['on'] })).toBe(false);
  });

  it('onInvalid: passthrough returns the original on an unrecognized value, loose wins over it', () => {
    const obj = {};
    expect(toBoolean('banana')).toBe(null);
    expect(toBoolean('banana', { onInvalid: 'null' })).toBe(null);
    expect(toBoolean('banana', { onInvalid: 'passthrough' })).toBe('banana');
    expect(toBoolean(obj, { onInvalid: 'passthrough' })).toBe(obj);
    // loose takes precedence over onInvalid
    expect(toBoolean('banana', { loose: true, onInvalid: 'passthrough' })).toBe(true);
    // a recognized value is unaffected by either setting
    expect(toBoolean('yes', { onInvalid: 'passthrough' })).toBe(true);
  });

  it('takes a per-call truthy override, winning over the config vocabulary', () => {
    expect(toBoolean('yep', { truthy: ['yep'] })).toBe(true);
    expect(toBoolean('nope', { truthy: ['yep'] })).toBe(null);
    expect(toBoolean('false', { truthy: ['false'] })).toBe(true);
  });

  it('reads a token in both config lists as false, falsy wins within a layer', () => {
    toBoolean.config.truthy.push('ok');
    toBoolean.config.falsy.push('ok');
    try {
      expect(toBoolean('ok')).toBe(false);
    }
    finally {
      toBoolean.config.truthy.pop();
      toBoolean.config.falsy.pop();
    }
  });

  it('reads toBoolean.config for the vocabulary and defaults, with per-call winning', () => {
    const savedTruthy = toBoolean.config.truthy;
    const savedOnInvalid = toBoolean.config.onInvalid;
    toBoolean.config.truthy = [...savedTruthy, 'oui'];
    toBoolean.config.onInvalid = 'passthrough';
    try {
      expect(toBoolean('oui')).toBe(true);
      expect(toBoolean('banana')).toBe('banana');
      expect(toBoolean('banana', { onInvalid: 'null' })).toBe(null);
    }
    finally {
      toBoolean.config.truthy = savedTruthy;
      toBoolean.config.onInvalid = savedOnInvalid;
    }
  });
});

describe('toNumber', () => {
  it('passes finite numbers through and rejects the poison values', () => {
    expect(toNumber(42)).toBe(42);
    expect(toNumber(-3.14)).toBe(-3.14);
    expect(toNumber(NaN)).toBe(null);
    expect(toNumber(Infinity)).toBe(null);
    expect(toNumber(-Infinity)).toBe(null);
  });

  it('parses numeric strings, trimming first', () => {
    expect(toNumber('42')).toBe(42);
    expect(toNumber('  3.14 ')).toBe(3.14);
    expect(toNumber('1e3')).toBe(1000);
    expect(toNumber('0x1f')).toBe(31);
    expect(toNumber('1e999')).toBe(null);
  });

  it('normalizes negative zero', () => {
    expect(Object.is(toNumber('-0'), 0)).toBe(true);
    expect(Object.is(toNumber(-0), 0)).toBe(true);
  });

  it('reads booleans as 1 and 0, rejects blanks and non-primitives', () => {
    expect(toNumber(true)).toBe(1);
    expect(toNumber(false)).toBe(0);
    expect(toNumber('')).toBe(null);
    expect(toNumber('5px')).toBe(null);
    expect(toNumber(null)).toBe(null);
    expect(toNumber([5])).toBe(null);
    expect(toNumber({})).toBe(null);
  });

  it('onInvalid: passthrough returns the original value on failure, null stays the default', () => {
    const obj = {};
    expect(toNumber('abc')).toBe(null);
    expect(toNumber('abc', { onInvalid: 'null' })).toBe(null);
    expect(toNumber('abc', { onInvalid: 'passthrough' })).toBe('abc');
    expect(toNumber(Infinity, { onInvalid: 'passthrough' })).toBe(Infinity);
    expect(toNumber(obj, { onInvalid: 'passthrough' })).toBe(obj);
    // a coercible value is unaffected by either setting
    expect(toNumber('42', { onInvalid: 'null' })).toBe(42);
    expect(toNumber('42', { onInvalid: 'passthrough' })).toBe(42);
  });
});

describe('toInteger', () => {
  it('truncates toward zero and normalizes negative zero', () => {
    expect(toInteger('3.9')).toBe(3);
    expect(toInteger('-3.9')).toBe(-3);
    expect(toInteger(42.7)).toBe(42);
    expect(Object.is(toInteger('-0.5'), 0)).toBe(true);
  });

  it('returns null for non-finite and unconvertible input', () => {
    expect(toInteger(Infinity)).toBe(null);
    expect(toInteger('Infinity')).toBe(null);
    expect(toInteger('abc')).toBe(null);
    expect(toInteger(null)).toBe(null);
  });

  it('onInvalid: passthrough returns the original value on failure, never a truncated NaN artifact', () => {
    expect(toInteger('abc')).toBe(null);
    expect(toInteger('abc', { onInvalid: 'null' })).toBe(null);
    expect(toInteger('abc', { onInvalid: 'passthrough' })).toBe('abc');
    expect(toInteger(Infinity, { onInvalid: 'passthrough' })).toBe(Infinity);
    // a coercible value still truncates, unaffected by either setting
    expect(toInteger('3.9', { onInvalid: 'null' })).toBe(3);
    expect(toInteger('3.9', { onInvalid: 'passthrough' })).toBe(3);
  });
});

describe('toDate', () => {
  it('parses ISO strings and epoch-millisecond numbers', () => {
    expect(toDate('2024-01-01')?.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    expect(toDate('2024-01-01T12:00:00Z')?.toISOString()).toBe('2024-01-01T12:00:00.000Z');
    expect(toDate(1700000000000)?.toISOString()).toBe('2023-11-14T22:13:20.000Z');
  });

  it('reads a number as unix seconds under epoch, for JWT exp and unix timestamps', () => {
    expect(toDate(1700000000, { epoch: 'seconds' })?.toISOString()).toBe('2023-11-14T22:13:20.000Z');
    expect(toDate(1700000000)?.toISOString()).not.toBe('2023-11-14T22:13:20.000Z');
  });

  it('resolves a zoneless datetime in the ambient zone, honors an explicit offset', () => {
    expect(toDate('2024-06-30T09:00')?.getTime()).toBe(new Date('2024-06-30T09:00').getTime());
    expect(toDate('2024-06-30T09:00Z')?.toISOString()).toBe('2024-06-30T09:00:00.000Z');
    expect(toDate('2024-06-30T09:00:00+00:00')?.toISOString()).toBe('2024-06-30T09:00:00.000Z');
  });

  it('normalizes the space separator and no-colon offset to the spec form before parsing', () => {
    expect(toDate('2024-01-01 12:00')?.getTime()).toBe(new Date('2024-01-01T12:00').getTime());
    expect(toDate('2024-01-01T09:00+0530')?.toISOString()).toBe('2024-01-01T03:30:00.000Z');
    expect(toDate('2024-01-01T09:00+05:30')?.toISOString()).toBe('2024-01-01T03:30:00.000Z');
  });

  it('passes a valid Date through by reference', () => {
    const date = new Date('2024-06-30');
    expect(toDate(date)).toBe(date);
  });

  it('rejects ambiguous, loose, and impossible dates rather than guessing', () => {
    expect(toDate('2024')).toBe(null);
    expect(toDate('01/15/2024')).toBe(null);
    expect(toDate('Jan 1 2024')).toBe(null);
    expect(toDate('20240101')).toBe(null);
    expect(toDate('2024-02-30')).toBe(null);
    expect(toDate('2023-02-29')).toBe(null);
    expect(toDate('1700000000000')).toBe(null);
  });

  it('validates leap days against the real calendar year, including years 0-99', () => {
    expect(toDate('2024-02-29')?.toISOString()).toBe('2024-02-29T00:00:00.000Z');
    expect(toDate('0000-02-29')?.toISOString()).toBe('0000-02-29T00:00:00.000Z');
    expect(toDate('0001-02-29')).toBe(null);
  });

  it('returns null rather than an Invalid Date', () => {
    expect(toDate('banana')).toBe(null);
    expect(toDate(new Date('banana'))).toBe(null);
    expect(toDate(NaN)).toBe(null);
    expect(toDate('')).toBe(null);
    expect(toDate(null)).toBe(null);
    expect(toDate(true)).toBe(null);
  });

  it('composes with ?? for a default', () => {
    const fallback = new Date('2000-01-01');
    expect(toDate('nonsense') ?? fallback).toBe(fallback);
  });

  it('onInvalid: passthrough returns the original value on failure, null stays the default', () => {
    const invalid = new Date('banana');
    expect(toDate('not-a-date')).toBe(null);
    expect(toDate('not-a-date', { onInvalid: 'null' })).toBe(null);
    expect(toDate('not-a-date', { onInvalid: 'passthrough' })).toBe('not-a-date');
    // the calendar round-trip and Invalid Date failure branches preserve the original too
    expect(toDate('2024-02-30', { onInvalid: 'passthrough' })).toBe('2024-02-30');
    expect(toDate(invalid, { onInvalid: 'passthrough' })).toBe(invalid);
    // a valid date is unaffected by either setting
    expect(toDate('2024-01-01', { onInvalid: 'null' })?.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    expect(toDate('2024-01-01', { onInvalid: 'passthrough' })?.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });
});

describe('toDuration', () => {
  it('reads a number as milliseconds and rejects the poison values', () => {
    expect(toDuration(1500)).toBe(1500);
    expect(toDuration(0)).toBe(0);
    expect(toDuration(1.5)).toBe(1.5);
    expect(toDuration(NaN)).toBe(null);
    expect(toDuration(Infinity)).toBe(null);
    expect(toDuration(-Infinity)).toBe(null);
  });

  it('converts each unit suffix', () => {
    expect(toDuration('500ms')).toBe(500);
    expect(toDuration('5s')).toBe(5000);
    expect(toDuration('5m')).toBe(300000);
    expect(toDuration('24h')).toBe(86400000);
    expect(toDuration('2d')).toBe(172800000);
    expect(toDuration('1w')).toBe(604800000);
  });

  it('accepts unit words and abbreviations, case-insensitively and with an optional space', () => {
    expect(toDuration('10 minutes')).toBe(600000);
    expect(toDuration('2hrs')).toBe(7200000);
    expect(toDuration('300msecs')).toBe(300);
    expect(toDuration('1 Hour')).toBe(3600000);
    expect(toDuration('5MS')).toBe(5);
    expect(toDuration('3 Days')).toBe(259200000);
    expect(toDuration('  90 SEC  ')).toBe(90000);
  });

  it('reads decimals and a unitless string as milliseconds', () => {
    expect(toDuration('1.5h')).toBe(5400000);
    expect(toDuration('.5s')).toBe(500);
    expect(toDuration('0.5d')).toBe(43200000);
    expect(toDuration('1500')).toBe(1500);
    expect(toDuration('1.5')).toBe(1.5);
  });

  it('keeps the sign, so a duration can point backwards', () => {
    expect(toDuration('-1.5h')).toBe(-5400000);
    expect(toDuration(-1500)).toBe(-1500);
    expect(toDuration('+5s')).toBe(5000);
  });

  it('normalizes negative zero', () => {
    expect(Object.is(toDuration('-0s'), 0)).toBe(true);
    expect(Object.is(toDuration(-0), 0)).toBe(true);
  });

  it('returns null for junk rather than a guessed span', () => {
    expect(toDuration('1h 30m')).toBe(null);
    expect(toDuration('1y')).toBe(null);
    expect(toDuration('1mo')).toBe(null);
    expect(toDuration('5x')).toBe(null);
    expect(toDuration('5e3')).toBe(null);
    expect(toDuration('ms')).toBe(null);
    expect(toDuration('1.2.3')).toBe(null);
    expect(toDuration('')).toBe(null);
    expect(toDuration('   ')).toBe(null);
    expect(toDuration('soon')).toBe(null);
  });

  it('returns null for non-numeric, non-string input', () => {
    expect(toDuration(null)).toBe(null);
    expect(toDuration(undefined)).toBe(null);
    expect(toDuration(true)).toBe(null);
    expect(toDuration({})).toBe(null);
    expect(toDuration([5])).toBe(null);
    expect(toDuration(new Date())).toBe(null);
  });

  it('never yields NaN or Infinity, whatever the input spells', () => {
    // an inherited key would resolve to a function on the unit table
    expect(toDuration('5constructor')).toBe(null);
    expect(toDuration('5toString')).toBe(null);
    // a number long enough to overflow the multiply
    expect(toDuration('1'.padEnd(320, '0') + 'd')).toBe(null);
  });

  it('composes with ?? for a default', () => {
    expect(toDuration('nonsense') ?? 1000).toBe(1000);
    expect(toDuration('2s') ?? 1000).toBe(2000);
  });

  it('onInvalid: passthrough returns the original value on failure, null stays the default', () => {
    const obj = {};
    expect(toDuration('1h 30m')).toBe(null);
    expect(toDuration('1h 30m', { onInvalid: 'null' })).toBe(null);
    expect(toDuration('1h 30m', { onInvalid: 'passthrough' })).toBe('1h 30m');
    expect(toDuration(Infinity, { onInvalid: 'passthrough' })).toBe(Infinity);
    expect(toDuration(obj, { onInvalid: 'passthrough' })).toBe(obj);
    // a readable duration is unaffected by either setting
    expect(toDuration('5s', { onInvalid: 'null' })).toBe(5000);
    expect(toDuration('5s', { onInvalid: 'passthrough' })).toBe(5000);
  });

  it('takes units the app names in toDuration.config, matched lowercase', () => {
    const savedUnits = toDuration.config.units;
    toDuration.config.units = { ...savedUnits, y: 365 * 86400000, fortnight: 14 * 86400000 };
    try {
      expect(toDuration('1y')).toBe(31536000000);
      expect(toDuration('2 Fortnights')).toBe(null);
      expect(toDuration('2 fortnight')).toBe(2419200000);
      // the built-in units keep working alongside
      expect(toDuration('5s')).toBe(5000);
    }
    finally {
      toDuration.config.units = savedUnits;
    }
    expect(toDuration('1y')).toBe(null);
  });
});

describe('toString', () => {
  it('passes strings and stringifies scalars', () => {
    expect(toString('x')).toBe('x');
    expect(toString(5)).toBe('5');
    expect(toString(true)).toBe('true');
    expect(toString(10n)).toBe('10');
  });

  it('returns null for nullish, non-finite numbers, objects, functions, and symbols by default', () => {
    expect(toString(null)).toBe(null);
    expect(toString(undefined)).toBe(null);
    expect(toString(NaN)).toBe(null);
    expect(toString(Infinity)).toBe(null);
    expect(toString({ a: 1 })).toBe(null);
    expect(toString([1, 2])).toBe(null);
    expect(toString(() => {})).toBe(null);
    expect(toString(Symbol('s'))).toBe(null);
  });

  it('renders objects and arrays under loose', () => {
    expect(toString({ a: 1 }, { loose: true })).toBe('{"a":1}');
    expect(toString([1, 2], { loose: true })).toBe('[1,2]');
  });

  it('stays inside the never-throw contract under loose', () => {
    const circular = {};
    circular.self = circular;
    expect(toString(circular, { loose: true })).toBe(null);
    expect(toString(() => {}, { loose: true })).toBe(null);
  });

  it('onInvalid: passthrough returns the original value on failure and rides alongside loose', () => {
    const sym = Symbol('x');
    const fn = () => {};
    expect(toString(sym)).toBe(null);
    expect(toString(sym, { onInvalid: 'null' })).toBe(null);
    expect(toString(sym, { onInvalid: 'passthrough' })).toBe(sym);
    expect(toString(fn, { onInvalid: 'passthrough' })).toBe(fn);
    expect(toString(NaN, { onInvalid: 'passthrough' })).toBe(NaN);
    // onInvalid merges into the same options object without disturbing loose
    expect(toString({ a: 1 }, { loose: true, onInvalid: 'passthrough' })).toBe('{"a":1}');
    expect(toString(fn, { loose: true, onInvalid: 'passthrough' })).toBe(fn);
    // a coercible value is unaffected by either setting
    expect(toString(5, { onInvalid: 'null' })).toBe('5');
    expect(toString(5, { onInvalid: 'passthrough' })).toBe('5');
  });
});

describe('coerce aliases', () => {
  it('are the same functions as their toX twins', () => {
    expect(coerceBoolean).toBe(toBoolean);
    expect(coerceNumber).toBe(toNumber);
    expect(coerceInteger).toBe(toInteger);
    expect(coerceDate).toBe(toDate);
    expect(coerceDuration).toBe(toDuration);
    expect(coerceString).toBe(toString);
  });
});
