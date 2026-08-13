import { createErrors, createLogger, error as topError, log, throwError as topThrowError } from '@semantic-ui/utils';

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

let errorSpy;

beforeAll(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
    throw new Error(`Unhandled Console Error: ${args.join(' ')}`);
  });
});

afterAll(() => {
  errorSpy.mockRestore();
});

describe('createErrors', () => {
  let originalOnError;

  const flushMicrotasks = () =>
    new Promise((resolve) => {
      queueMicrotask(resolve);
    });

  beforeEach(() => {
    originalOnError = globalThis.onError;
    globalThis.onError = vi.fn();
  });

  afterEach(async () => {
    // real timers before the flush: a faked queueMicrotask never resolves the promise
    vi.useRealTimers();
    await flushMicrotasks();
    if (originalOnError === undefined) {
      delete globalThis.onError;
    }
    else {
      globalThis.onError = originalOnError;
    }
  });

  describe('bundle', () => {
    it('should return the reporting and throwing forms', () => {
      const errors = createErrors({ namespace: 'demo' });
      expect(Object.keys(errors).sort()).toEqual(['error', 'throwError']);
      expect(typeof errors.error).toBe('function');
      expect(typeof errors.throwError).toBe('function');
      expect(typeof errors.error.line).toBe('function');
    });

    it('should work with no options at all', () => {
      const { error, throwError } = createErrors();
      expect(typeof error).toBe('function');
      expect(typeof throwError).toBe('function');
    });
  });

  describe('top-level forms', () => {
    it('should export the unbound pair', () => {
      expect(typeof topError).toBe('function');
      expect(typeof topThrowError).toBe('function');
      expect(typeof topError.line).toBe('function');
    });

    it('should take the namespace in the options bag', () => {
      expect(() => topThrowError('code', 'at', { namespace: 'sync' }))
        .toThrow('sync refused [code] at');
      const returned = topError('code', 'at', { namespace: 'sync', report: false });
      expect(returned.message).toBe('sync refused [code] at');
    });

    it('should compose the line clean when the namespace is empty', () => {
      expect(topError.line('code', 'at')).toBe('refused [code] at');
      const returned = topError('code', 'at', { report: false });
      expect(returned.message).toBe('refused [code] at');
      expect(() => topThrowError('code', 'at')).toThrow(/^refused \[code\] at$/);
    });

    it('should take ErrorClass per call', () => {
      class DemoError extends Error {}
      expect(() => topThrowError('code', 'at', { namespace: 'demo', ErrorClass: DemoError }))
        .toThrow(DemoError);
      const returned = topError('code', 'at', { ErrorClass: DemoError, report: false });
      expect(returned).toBeInstanceOf(DemoError);
    });

    it('should render the line with namespace and verb', () => {
      expect(topError.line('cursorReset', 'todos@41', { namespace: 'sync', verb: 'recovered' }))
        .toBe('sync recovered [cursorReset] todos@41');
    });

    it('should report through the channel like the bound form', async () => {
      const returned = topError('write-conflict', 'commit()', { namespace: 'demo' });
      expect(globalThis.onError).not.toHaveBeenCalled();
      await flushMicrotasks();
      expect(globalThis.onError).toHaveBeenCalledWith(returned);
    });

    it('should be what the binder pre-fills', () => {
      const { error: bound, throwError: boundThrow } = createErrors({ namespace: 'demo' });
      expect(bound.line('code', 'at')).toBe(topError.line('code', 'at', { namespace: 'demo' }));
      expect(() => boundThrow('code', 'at')).toThrow('demo refused [code] at');
    });

    it('should let callsite options win through the binder', () => {
      const { error: bound } = createErrors({ namespace: 'demo' });
      expect(bound.line('code', 'at', { namespace: 'other' })).toBe('other refused [code] at');
      const returned = bound('code', 'at', { namespace: 'other', report: false });
      expect(returned.message).toBe('other refused [code] at');
    });
  });

  describe('line', () => {
    it('should format the production line', () => {
      const { error } = createErrors({ namespace: 'demo' });
      expect(error.line('code', 'at')).toBe('demo refused [code] at');
    });

    it('should drop the leading token when the namespace is empty', () => {
      const { error } = createErrors();
      expect(error.line('code', 'at')).toBe('refused [code] at');
    });

    it('should stay greppable by the documented pattern', () => {
      const { error } = createErrors({ namespace: 'query' });
      const parsed = error.line('unknown-field', 'select(user.nmae)')
        .match(/^(\S+) (\S+) \[([\w-]+)\] (.*)$/m);
      expect(parsed.slice(1)).toEqual(['query', 'refused', 'unknown-field', 'select(user.nmae)']);
    });

    it('should match the message the builders produce', () => {
      const { error, throwError } = createErrors({ namespace: 'demo' });
      const line = error.line('unknown-field', 'select()');
      expect(() => throwError('unknown-field', 'select()')).toThrow(line);
    });
  });

  describe('verb', () => {
    it('should default to refused', () => {
      const { error } = createErrors({ namespace: 'demo' });
      expect(error.line('code', 'at')).toBe('demo refused [code] at');
      expect(error('code', 'at').message).toBe('demo refused [code] at');
    });

    it('should render any word the caller mints', () => {
      const { error } = createErrors({ namespace: 'game' });
      expect(error.line('entity-gone', 'sprite:7', { verb: 'despawned' }))
        .toBe('game despawned [entity-gone] sprite:7');
    });

    it('should carry the verb through both builders', () => {
      const { error, throwError } = createErrors({ namespace: 'payments' });
      expect(() => throwError('card-expired', 'charge()', { verb: 'declined' }))
        .toThrow('payments declined [card-expired] charge()');
      const returned = error('card-expired', 'charge()', { verb: 'declined' });
      expect(returned.message).toBe('payments declined [card-expired] charge()');
    });

    it('should fall back to refused on a nullish verb', () => {
      const { error } = createErrors({ namespace: 'demo' });
      expect(error.line('code', 'at', { verb: null })).toBe('demo refused [code] at');
      expect(error.line('code', 'at', { verb: undefined })).toBe('demo refused [code] at');
    });

    it('should parse any verb with the documented pattern', () => {
      const pattern = /^(\S+) (\S+) \[([\w-]+)\] (.*)$/m;
      const { error } = createErrors({ namespace: 'sync' });
      for (const verb of ['refused', 'despawned', 'declined']) {
        const parsed = error.line('write-conflict', 'commit()', { verb }).match(pattern);
        expect(parsed.slice(1)).toEqual(['sync', verb, 'write-conflict', 'commit()']);
      }
    });

    it('should parse the first line of a development message', () => {
      const { throwError } = createErrors({ namespace: 'game' });
      let thrown;
      try {
        throwError('entity-gone', 'sprite:7', {
          verb: 'despawned',
          explanation: 'the sprite left the scene before the handler ran',
        });
      }
      catch (caught) {
        thrown = caught;
      }
      const parsed = thrown.message.match(/^(\S+) (\S+) \[([\w-]+)\] (.*)$/m);
      expect(parsed.slice(1)).toEqual(['game', 'despawned', 'entity-gone', 'sprite:7']);
    });
  });

  describe('throwError', () => {
    class DemoError extends Error {}

    it('should throw synchronously as the configured class', () => {
      const { throwError } = createErrors({ namespace: 'demo', ErrorClass: DemoError });
      expect(() => throwError('missing-collection', 'find()')).toThrow(DemoError);
    });

    it('should carry the code, the address, and the detail', () => {
      const { throwError } = createErrors({ namespace: 'demo', ErrorClass: DemoError });
      let thrown;
      try {
        throwError('missing-collection', 'find()', { detail: { name: 'todos' } });
      }
      catch (caught) {
        thrown = caught;
      }
      expect(thrown).toBeInstanceOf(DemoError);
      expect(thrown).toBeInstanceOf(Error);
      expect(thrown.message).toBe('demo refused [missing-collection] find()');
      expect(thrown.code).toBe('missing-collection');
      expect(thrown.at).toBe('find()');
      expect(thrown.detail).toEqual({ name: 'todos' });
    });

    it('should lead with the line and stack the explanation beneath it', () => {
      const { throwError } = createErrors({ namespace: 'demo' });
      let thrown;
      try {
        throwError('unknown-field', 'select()', {
          explanation: 'no field named nmae on todos, did you mean name?',
        });
      }
      catch (caught) {
        thrown = caught;
      }
      expect(thrown.message).toBe(
        'demo refused [unknown-field] select()\nno field named nmae on todos, did you mean name?',
      );
      // the first line stays the documented greppable shape in development
      const parsed = thrown.message.match(/^(\S+) (\S+) \[([\w-]+)\] (.*)$/m);
      expect(parsed.slice(1)).toEqual(['demo', 'refused', 'unknown-field', 'select()']);
    });

    it('should fall back to the line when the explanation folds away', () => {
      const { throwError } = createErrors({ namespace: 'demo' });
      expect(() => throwError('unknown-field', 'select()', { explanation: 0 }))
        .toThrow('demo refused [unknown-field] select()');
    });

    it('should leave detail off when none is given', () => {
      const { throwError } = createErrors({ namespace: 'demo' });
      let thrown;
      try {
        throwError('unknown-field', 'select()');
      }
      catch (caught) {
        thrown = caught;
      }
      expect('detail' in thrown).toBe(false);
    });

    it('should keep a falsy detail', () => {
      const { throwError } = createErrors({ namespace: 'demo' });
      let thrown;
      try {
        throwError('bad-index', 'at()', { detail: 0 });
      }
      catch (caught) {
        thrown = caught;
      }
      expect(thrown.detail).toBe(0);
    });
  });

  describe('error', () => {
    it('should return the built error synchronously', () => {
      const { error } = createErrors({ namespace: 'demo' });
      const returned = error('write-conflict', 'commit()', { detail: { id: 7 } });
      expect(returned).toBeInstanceOf(Error);
      expect(returned.message).toBe('demo refused [write-conflict] commit()');
      expect(returned.code).toBe('write-conflict');
      expect(returned.at).toBe('commit()');
      expect(returned.detail).toEqual({ id: 7 });
      // the report is deferred, so the calling stack completes first
      expect(globalThis.onError).not.toHaveBeenCalled();
    });

    it('should route the report to globalThis.onError asynchronously', async () => {
      const { error } = createErrors({ namespace: 'demo' });
      const returned = error('write-conflict', 'commit()');
      expect(globalThis.onError).not.toHaveBeenCalled();
      await flushMicrotasks();
      expect(globalThis.onError).toHaveBeenCalledTimes(1);
      expect(globalThis.onError).toHaveBeenCalledWith(returned);
    });

    it('should build with the configured class when reporting', async () => {
      class DemoError extends Error {}
      const { error } = createErrors({ namespace: 'demo', ErrorClass: DemoError });
      const returned = error('write-conflict', 'commit()');
      expect(returned).toBeInstanceOf(DemoError);
      await flushMicrotasks();
      expect(globalThis.onError).toHaveBeenCalledWith(returned);
    });

    it('should fall back to console.error when no handler is installed', async () => {
      delete globalThis.onError;
      // the suite-wide spy throws on stray console.error calls — absorb the
      // one expected report so anything past it still trips the guard
      errorSpy.mockClear();
      errorSpy.mockImplementationOnce(() => {});
      const { error } = createErrors({ namespace: 'demo' });
      const returned = error('write-conflict', 'commit()');
      expect(returned.message).toBe('demo refused [write-conflict] commit()');
      // still deferred, so the calling stack completes first
      expect(errorSpy).not.toHaveBeenCalled();
      await flushMicrotasks();
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(returned);
    });

    it('should only build when report is false', async () => {
      const { error } = createErrors({ namespace: 'demo' });
      const returned = error('write-conflict', 'commit()', { report: false, detail: { id: 7 } });
      expect(returned).toBeInstanceOf(Error);
      expect(returned.message).toBe('demo refused [write-conflict] commit()');
      expect(returned.code).toBe('write-conflict');
      expect(returned.at).toBe('commit()');
      expect(returned.detail).toEqual({ id: 7 });
      await flushMicrotasks();
      expect(globalThis.onError).not.toHaveBeenCalled();
    });

    it('should skip the console fallback when report is false', async () => {
      delete globalThis.onError;
      // the suite-wide spy throws on stray console.error calls, so a leaked
      // report would fail the test on its own — the count makes it explicit
      errorSpy.mockClear();
      const { error } = createErrors({ namespace: 'demo' });
      error('write-conflict', 'commit()', { report: false });
      await flushMicrotasks();
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it('should build report: false errors identical to reported ones', async () => {
      const { error } = createErrors({ namespace: 'demo' });
      const options = {
        verb: 'declined',
        explanation: 'the server refused the write',
        detail: { id: 7 },
      };
      const reported = error('write-conflict', 'commit()', options);
      const returned = error('write-conflict', 'commit()', { ...options, report: false });
      expect(returned.message).toBe(reported.message);
      expect(returned.code).toBe(reported.code);
      expect(returned.at).toBe(reported.at);
      expect(returned.detail).toEqual(reported.detail);
      await flushMicrotasks();
      // only the reported one reaches the channel
      expect(globalThis.onError).toHaveBeenCalledTimes(1);
      expect(globalThis.onError).toHaveBeenCalledWith(reported);
    });
  });
});

describe('log', () => {
  let consoleSpy;

  beforeEach(() => {
    // Spy on all console methods
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    // Restore all console methods
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  it('should exist', () => {
    expect(typeof log).toBe('function');
  });

  it('should call console.log by default', () => {
    log('test message');
    expect(consoleSpy.log).toHaveBeenCalledWith('test message');
  });

  it('should respect different log levels', () => {
    log('debug message', 'debug');
    expect(consoleSpy.debug).toHaveBeenCalled();

    log('info message', 'info');
    expect(consoleSpy.info).toHaveBeenCalled();

    log('warn message', 'warn');
    expect(consoleSpy.warn).toHaveBeenCalled();

    log('error message', 'error');
    expect(consoleSpy.error).toHaveBeenCalled();
  });

  it('should include data when provided', () => {
    const testData = { key: 'value' };
    log('message with data', 'log', { data: [testData] });
    expect(consoleSpy.log).toHaveBeenCalledWith('message with data', [testData]);
  });

  it('should respect silent mode', () => {
    log('silent message', 'log', { silent: true });
    expect(consoleSpy.log).not.toHaveBeenCalled();
  });

  it('should add title when provided', () => {
    log('message', 'log', { title: 'TestComponent', showTitle: true });
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('%cTestComponent%c message'),
      expect.stringContaining('color: #0066CC; font-weight: bold;'),
      expect.stringContaining('color: inherit;'),
    );
  });

  it('should hide title when showTitle is false', () => {
    log('message', 'log', { title: 'TestComponent', showTitle: false });
    expect(consoleSpy.log).toHaveBeenCalledWith('message');
  });

  it('should add timestamp when enabled', () => {
    log('message', 'log', { timestamp: true });
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringMatching(/%c\[\d{2}:\d{2}:\d{2}\.\d{3}\]%c message/),
      expect.stringContaining('color: #999999;'),
      expect.stringContaining('color: inherit;'),
    );
  });

  it('should use custom titleColor when provided', () => {
    log('message', 'log', { title: 'Test', titleColor: '#FF0000' });
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('%cTest%c message'),
      expect.stringContaining('color: #FF0000; font-weight: bold;'),
      expect.any(String),
    );
  });

  it('should emit one JSON-parseable line when format is json', () => {
    const testData = { key: 'value' };
    log('message', 'log', {
      format: 'json',
      data: [testData],
      namespace: 'test',
    });

    const line = consoleSpy.log.mock.calls[0][0];
    expect(typeof line).toBe('string');
    expect(JSON.parse(line)).toEqual({
      level: 'log',
      namespace: 'test',
      message: 'message',
      data: [testData],
    });
  });

  it('should include timestamp in JSON format when enabled', () => {
    log('message', 'log', {
      format: 'json',
      timestamp: true,
    });

    const record = JSON.parse(consoleSpy.log.mock.calls[0][0]);
    expect(record).toHaveProperty('timestamp');
    expect(record.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('should use the namespace verbatim as the default title', () => {
    log('message', 'log', { namespace: 'testNamespace' });
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('%ctestNamespace%c message'),
      expect.any(String),
      expect.any(String),
    );
  });

  it('should never case-transform the namespace', () => {
    log('booted', 'info', { namespace: 'db' });
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringContaining('%cdb%c booted'),
      expect.any(String),
      expect.any(String),
    );
  });

  it('should use custom console method when provided', () => {
    log('message', 'log', { consoleMethod: 'warn' });
    expect(consoleSpy.warn).toHaveBeenCalledWith('message');
    expect(consoleSpy.log).not.toHaveBeenCalled();
  });

  it('should handle empty data array correctly', () => {
    log('message', 'log', { data: [] });
    expect(consoleSpy.log).toHaveBeenCalledWith('message');
  });

  it('should handle multiple data items', () => {
    const data1 = { a: 1 };
    const data2 = { b: 2 };
    log('message', 'log', { data: [data1, data2] });
    expect(consoleSpy.log).toHaveBeenCalledWith('message', [data1, data2]);
  });

  it('should include data when passed as a plain object', () => {
    const data = { error: 'something failed', code: 500 };
    log('message', 'log', { data });
    expect(consoleSpy.log).toHaveBeenCalledWith('message', data);
  });

  it('should include falsy data values like 0 and null', () => {
    log('zero', 'log', { data: 0 });
    expect(consoleSpy.log).toHaveBeenCalledWith('zero', 0);

    consoleSpy.log.mockClear();
    log('null', 'log', { data: null });
    expect(consoleSpy.log).toHaveBeenCalledWith('null', null);
  });

  it('should fallback to info level for unknown levels', () => {
    log('message', 'invalidLevel');
    expect(consoleSpy.info).toHaveBeenCalled();
  });

  describe('noColor', () => {
    it('should default to styled output in the browser', () => {
      // jsdom posture: isServer is false, so %c styling stays on by default
      log('message', 'log', { title: 'TestComponent' });
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('%cTestComponent%c message'),
        expect.any(String),
        expect.any(String),
      );
    });

    it('should compose plain text without %c or style args', () => {
      log('message', 'log', { title: 'TestComponent', noColor: true });
      expect(consoleSpy.log).toHaveBeenCalledWith('TestComponent message');
    });

    it('should render the timestamp plain', () => {
      log('message', 'log', { timestamp: true, noColor: true });
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\] message$/),
      );
    });

    it('should keep data alongside the plain line', () => {
      const data = { attempt: 2 };
      log('retrying', 'warn', { title: 'sync', noColor: true, data });
      expect(consoleSpy.warn).toHaveBeenCalledWith('sync retrying', data);
    });
  });
});

describe('createLogger', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  it('should return the flat bundle', () => {
    const logger = createLogger({ namespace: 'sync' });
    expect(Object.keys(logger).sort()).toEqual(['debug', 'error', 'info', 'log', 'warn']);
    Object.values(logger).forEach(fn => expect(typeof fn).toBe('function'));
  });

  it('should work with no options at all', () => {
    const { log: boundLog } = createLogger();
    boundLog('message');
    expect(consoleSpy.log).toHaveBeenCalledWith('message');
  });

  it('should route each wrapper to its console method', () => {
    const { debug, info, warn, error } = createLogger();
    debug('a');
    expect(consoleSpy.debug).toHaveBeenCalledWith('a');
    info('b');
    expect(consoleSpy.info).toHaveBeenCalledWith('b');
    warn('c');
    expect(consoleSpy.warn).toHaveBeenCalledWith('c');
    error('d');
    expect(consoleSpy.error).toHaveBeenCalledWith('d');
  });

  it('should keep the level slot on the bound log', () => {
    const { log: boundLog } = createLogger();
    boundLog('message', 'warn');
    expect(consoleSpy.warn).toHaveBeenCalledWith('message');
    expect(consoleSpy.log).not.toHaveBeenCalled();
  });

  it('should apply the factory defaults on every call', () => {
    const { info } = createLogger({ namespace: 'sync', titleColor: '#123456' });
    info('connected');
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringContaining('%csync%c connected'),
      expect.stringContaining('color: #123456; font-weight: bold;'),
      expect.any(String),
    );
  });

  it('should let callsite options win over the defaults', () => {
    const { info } = createLogger({ namespace: 'sync', silent: true });
    info('suppressed');
    expect(consoleSpy.info).not.toHaveBeenCalled();
    info('spoken', { silent: false, title: 'override' });
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringContaining('%coverride%c spoken'),
      expect.any(String),
      expect.any(String),
    );
  });

  it('should merge callsite options with unrelated defaults intact', () => {
    const data = { attempt: 2 };
    const { warn } = createLogger({ namespace: 'sync' });
    warn('retrying', { data });
    expect(consoleSpy.warn).toHaveBeenCalledWith(
      expect.stringContaining('%csync%c retrying'),
      expect.any(String),
      expect.any(String),
      data,
    );
  });

  it('should not let options retag a wrapper level', () => {
    const { info } = createLogger();
    info('message', { level: 'error' });
    expect(consoleSpy.info).toHaveBeenCalled();
    expect(consoleSpy.error).not.toHaveBeenCalled();
  });

  it('should print the namespace verbatim', () => {
    const { info } = createLogger({ namespace: 'db' });
    info('booted');
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringContaining('%cdb%c booted'),
      expect.any(String),
      expect.any(String),
    );
  });

  it('should carry the wrapper level into json output', () => {
    const { warn } = createLogger({ namespace: 'sync', format: 'json' });
    warn('retrying');
    expect(JSON.parse(consoleSpy.warn.mock.calls[0][0])).toEqual({
      level: 'warn',
      namespace: 'sync',
      message: 'retrying',
    });
  });

  it('should pass noColor through as a factory default', () => {
    const { info } = createLogger({ namespace: 'sync', noColor: true });
    info('connected');
    expect(consoleSpy.info).toHaveBeenCalledWith('sync connected');
  });

  it('should let a callsite re-enable styling over a noColor default', () => {
    const { info } = createLogger({ namespace: 'sync', noColor: true });
    info('connected', { noColor: false });
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringContaining('%csync%c connected'),
      expect.any(String),
      expect.any(String),
    );
  });
});
