import { createErrors, createLogger, error, isServer, log, throwError } from '@semantic-ui/utils';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// the node project runs without a window, so isServer is true here — this
// file pins log's server posture; test/dom/debug.test.js covers the browser

describe('log (server posture)', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  it('should run where isServer is true', () => {
    expect(isServer).toBe(true);
  });

  it('should default noColor on and compose plain text', () => {
    log('message', 'log', { title: 'TestComponent' });
    expect(consoleSpy.log).toHaveBeenCalledWith('TestComponent message');
  });

  it('should render the timestamp plain by default', () => {
    log('message', 'log', { timestamp: true });
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringMatching(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\] message$/),
    );
  });

  it('should default the factory bundle to plain text', () => {
    const { info } = createLogger({ namespace: 'sync' });
    info('connected');
    expect(consoleSpy.info).toHaveBeenCalledWith('sync connected');
  });

  it('should restore styling with noColor: false', () => {
    log('message', 'log', { title: 'TestComponent', noColor: false });
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('%cTestComponent%c message'),
      expect.stringContaining('font-weight: bold'),
      expect.any(String),
    );
  });

  it('should emit the same JSON line shape as the browser', () => {
    log('message', 'log', { format: 'json', namespace: 'test' });
    expect(JSON.parse(consoleSpy.log.mock.calls[0][0])).toEqual({
      level: 'log',
      namespace: 'test',
      message: 'message',
    });
  });
});

// node runs on V8, where Error.captureStackTrace trims the library's own
// construction frames — the stack opens at the caller. engines without it
// (no captureStackTrace) keep the full stack, so these pins live here

describe('coded error stacks (V8 posture)', () => {
  const firstFrame = (built) => built.stack.split('\n').find((line) => line.trim().startsWith('at '));

  let originalOnError;

  beforeEach(() => {
    originalOnError = globalThis.onError;
    globalThis.onError = vi.fn();
  });

  afterEach(async () => {
    // let the deferred report flush before the handler is restored
    await new Promise((resolve) => queueMicrotask(resolve));
    if (originalOnError === undefined) {
      delete globalThis.onError;
    }
    else {
      globalThis.onError = originalOnError;
    }
  });

  it('should open at the caller from error()', () => {
    const frame = firstFrame(error('code', 'at', { namespace: 'demo' }));
    expect(frame).not.toContain('debug.js');
    expect(frame).toContain('debug.test.js');
  });

  it('should open at the caller from throwError()', () => {
    let thrown;
    try {
      throwError('code', 'at', { namespace: 'demo' });
    }
    catch (caught) {
      thrown = caught;
    }
    const frame = firstFrame(thrown);
    expect(frame).not.toContain('debug.js');
    expect(frame).toContain('debug.test.js');
  });

  it('should open at the caller from the bound error', () => {
    const { error: bound } = createErrors({ namespace: 'demo' });
    const frame = firstFrame(bound('code', 'at'));
    expect(frame).not.toContain('debug.js');
    expect(frame).toContain('debug.test.js');
  });

  it('should open at the caller from the bound throwError', () => {
    const { throwError: bound } = createErrors({ namespace: 'demo' });
    let thrown;
    try {
      bound('code', 'at');
    }
    catch (caught) {
      thrown = caught;
    }
    const frame = firstFrame(thrown);
    expect(frame).not.toContain('debug.js');
    expect(frame).toContain('debug.test.js');
  });

  it('should carry the trimmed stack on a report: false build', () => {
    const frame = firstFrame(error('code', 'at', { namespace: 'demo', report: false }));
    expect(frame).not.toContain('debug.js');
    expect(frame).toContain('debug.test.js');
  });

  it('should keep the stack present and the message shape intact', () => {
    const built = error('write-conflict', 'commit()', { namespace: 'demo', report: false });
    expect(typeof built.stack).toBe('string');
    expect(built.stack.length).toBeGreaterThan(0);
    expect(built.message).toBe('demo refused [write-conflict] commit()');
    expect(built.stack.startsWith('Error: demo refused [write-conflict] commit()')).toBe(true);
  });
});
