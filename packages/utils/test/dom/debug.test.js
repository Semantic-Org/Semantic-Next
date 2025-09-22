import { fatal, log } from '@semantic-ui/utils';

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

describe('fatal', () => {
  let originalOnError;
  beforeEach(() => {
    originalOnError = global.onError;
    global.onError = vi.fn();
  });

  afterEach(() => {
    global.onError = originalOnError;
  });

  it('should exist', () => {
    expect(typeof fatal).toBe('function');
  });

  /* Testing errors is flakey

  it('should throw an error with the provided message', async () => {
    await expect(new Promise((resolve, reject) => {
      try {
        fatal('Test error', { onError: reject });
      } catch (error) {
        reject(error);
      }
    })).rejects.toThrow('Test error');
  });

  it('should attach provided metadata to the error', async () => {
    const metadata = { code: 'ERR_TEST' };
    await expect(new Promise((resolve, reject) => {
      try {
        fatal('Test error', { metadata, onError: reject });
      } catch (error) {
        reject(error);
      }
    })).rejects.toHaveProperty('code', 'ERR_TEST');
  });

  it('should modify the error stack based on removeStackLines option', async () => {
    await expect(new Promise((resolve, reject) => {
      try {
        fatal('Test error', { removeStackLines: 2, onError: reject });
      } catch (error) {
        reject(error);
      }
    })).rejects.toSatisfy((error) => {
      return error.stack.split('\n').length < new Error().stack.split('\n').length;
    });
  });
  */
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

  it('should fallback to info level for unknown levels', () => {
    log('message', 'invalidLevel');
    expect(consoleSpy.info).toHaveBeenCalled();
  });
});
