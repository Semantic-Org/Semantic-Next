import { createErrors, log } from '@semantic-ui/utils';

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
      const errors = createErrors({ layer: 'demo' });
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

  describe('line', () => {
    it('should format the production line', () => {
      const { error } = createErrors({ layer: 'demo' });
      expect(error.line('code', 'at')).toBe('demo refused [code] at');
    });

    it('should drop the leading token when the layer is empty', () => {
      const { error } = createErrors();
      expect(error.line('code', 'at')).toBe('refused [code] at');
    });

    it('should stay greppable by the documented pattern', () => {
      const { error } = createErrors({ layer: 'query' });
      const parsed = error.line('unknown-field', 'select(user.nmae)')
        .match(/^(\S+) (\S+) \[([\w-]+)\] (.*)$/m);
      expect(parsed.slice(1)).toEqual(['query', 'refused', 'unknown-field', 'select(user.nmae)']);
    });

    it('should match the message the builders produce', () => {
      const { error, throwError } = createErrors({ layer: 'demo' });
      const line = error.line('unknown-field', 'select()');
      expect(() => throwError('unknown-field', 'select()')).toThrow(line);
    });
  });

  describe('verb', () => {
    it('should default to refused', () => {
      const { error } = createErrors({ layer: 'demo' });
      expect(error.line('code', 'at')).toBe('demo refused [code] at');
      expect(error('code', 'at').message).toBe('demo refused [code] at');
    });

    it('should render any word the caller mints', () => {
      const { error } = createErrors({ layer: 'game' });
      expect(error.line('entity-gone', 'sprite:7', { verb: 'despawned' }))
        .toBe('game despawned [entity-gone] sprite:7');
    });

    it('should carry the verb through both builders', () => {
      const { error, throwError } = createErrors({ layer: 'payments' });
      expect(() => throwError('card-expired', 'charge()', { verb: 'declined' }))
        .toThrow('payments declined [card-expired] charge()');
      const returned = error('card-expired', 'charge()', { verb: 'declined' });
      expect(returned.message).toBe('payments declined [card-expired] charge()');
    });

    it('should fall back to refused on a nullish verb', () => {
      const { error } = createErrors({ layer: 'demo' });
      expect(error.line('code', 'at', { verb: null })).toBe('demo refused [code] at');
      expect(error.line('code', 'at', { verb: undefined })).toBe('demo refused [code] at');
    });

    it('should parse any verb with the documented pattern', () => {
      const pattern = /^(\S+) (\S+) \[([\w-]+)\] (.*)$/m;
      const { error } = createErrors({ layer: 'sync' });
      for (const verb of ['refused', 'despawned', 'declined']) {
        const parsed = error.line('write-conflict', 'commit()', { verb }).match(pattern);
        expect(parsed.slice(1)).toEqual(['sync', verb, 'write-conflict', 'commit()']);
      }
    });

    it('should parse the first line of a development message', () => {
      const { throwError } = createErrors({ layer: 'game' });
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
      const { throwError } = createErrors({ layer: 'demo', ErrorClass: DemoError });
      expect(() => throwError('missing-collection', 'find()')).toThrow(DemoError);
    });

    it('should carry the code, the address, and the detail', () => {
      const { throwError } = createErrors({ layer: 'demo', ErrorClass: DemoError });
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
      const { throwError } = createErrors({ layer: 'demo' });
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
      const { throwError } = createErrors({ layer: 'demo' });
      expect(() => throwError('unknown-field', 'select()', { explanation: 0 }))
        .toThrow('demo refused [unknown-field] select()');
    });

    it('should leave detail off when none is given', () => {
      const { throwError } = createErrors({ layer: 'demo' });
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
      const { throwError } = createErrors({ layer: 'demo' });
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
      const { error } = createErrors({ layer: 'demo' });
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
      const { error } = createErrors({ layer: 'demo' });
      const returned = error('write-conflict', 'commit()');
      expect(globalThis.onError).not.toHaveBeenCalled();
      await flushMicrotasks();
      expect(globalThis.onError).toHaveBeenCalledTimes(1);
      expect(globalThis.onError).toHaveBeenCalledWith(returned);
    });

    it('should build with the configured class when reporting', async () => {
      class DemoError extends Error {}
      const { error } = createErrors({ layer: 'demo', ErrorClass: DemoError });
      const returned = error('write-conflict', 'commit()');
      expect(returned).toBeInstanceOf(DemoError);
      await flushMicrotasks();
      expect(globalThis.onError).toHaveBeenCalledWith(returned);
    });

    it('should throw the report when no handler is installed', () => {
      delete globalThis.onError;
      // the raise lands in a microtask, so the test has to own the queue to catch
      // it: faking queueMicrotask lets runAllTicks run the job on this stack
      vi.useFakeTimers({ toFake: ['queueMicrotask'] });
      const { error } = createErrors({ layer: 'demo' });
      const returned = error('write-conflict', 'commit()');
      let thrown;
      try {
        vi.runAllTicks();
      }
      catch (caught) {
        thrown = caught;
      }
      vi.useRealTimers();
      expect(thrown).toBe(returned);
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

  it('should output JSON format when requested', () => {
    const testData = { key: 'value' };
    log('message', 'log', {
      format: 'json',
      data: [testData],
      namespace: 'test',
    });

    expect(consoleSpy.log).toHaveBeenCalledWith({
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

    const call = consoleSpy.log.mock.calls[0][0];
    expect(call).toHaveProperty('timestamp');
    expect(call.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('should use namespace as default title', () => {
    log('message', 'log', { namespace: 'testNamespace' });
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('%cTestnamespace%c message'),
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
});
