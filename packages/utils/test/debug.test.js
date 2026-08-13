import { createLogger, isServer, log } from '@semantic-ui/utils';

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
