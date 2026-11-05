import { afterEach, describe, expect, it, vi } from 'vitest';

import { bridgeSource, previewCommandType, previewMessageType } from '../../src/preview/bridge.js';

/* runs the bridge inside a child frame, the way a served document would */
const boot = () => {
  const frame = document.createElement('iframe');
  document.body.appendChild(frame);
  const child = frame.contentWindow;
  child.eval(bridgeSource('abc'));
  return child;
};

/* hashchange and postMessage each take a task in jsdom, so collection waits a few */
const settle = () => new Promise(resolve => setTimeout(resolve, 20));

const listeners = [];
const received = () => {
  const messages = [];
  const listener = (event) => messages.push(event.data);
  window.addEventListener('message', listener);
  listeners.push(listener);
  return async () => {
    await settle();
    return messages;
  };
};

// vitest's jsdom global is not the Window the child sees as `parent`, so the source is the child's own view of it
const command = (child, data, source = child.parent) => {
  child.dispatchEvent(new child.MessageEvent('message', { data: { type: previewCommandType, ...data }, source }));
};

afterEach(async () => {
  await settle();
  for (const listener of listeners.splice(0)) {
    window.removeEventListener('message', listener);
  }
  document.body.innerHTML = '';
});

describe('preview bridge', () => {
  it('reports where the document is as soon as it runs', async () => {
    const messages = received();
    boot();
    expect(await messages()).toEqual([
      { type: previewMessageType, sessionId: 'abc', event: 'navigate', href: 'about:blank' },
    ]);
  });

  it("reports the app's own navigations", async () => {
    const messages = received();
    const child = boot();
    child.location.hash = '#team';
    const [, update] = await messages();
    expect(update).toMatchObject({ event: 'navigate', href: 'about:blank#team' });
  });

  it('takes commands from the host frame only', () => {
    const child = boot();
    const back = vi.spyOn(child.history, 'back');
    const forward = vi.spyOn(child.history, 'forward');
    command(child, { command: 'back' }, child);
    expect(back).not.toHaveBeenCalled();
    command(child, { command: 'back' });
    command(child, { command: 'forward' });
    expect(back).toHaveBeenCalledTimes(1);
    expect(forward).toHaveBeenCalledTimes(1);
  });

  it('navigates on command', async () => {
    const messages = received();
    const child = boot();
    command(child, { command: 'navigate', url: 'about:blank#globex' });
    expect(child.location.hash).toBe('#globex');
    const [, update] = await messages();
    expect(update).toMatchObject({ event: 'navigate', href: 'about:blank#globex' });
  });

  it('reports uncaught errors', async () => {
    const messages = received();
    const child = boot();
    child.dispatchEvent(new child.ErrorEvent('error', { message: 'boom' }));
    const [, error] = await messages();
    expect(error).toEqual({ type: previewMessageType, sessionId: 'abc', event: 'error', message: 'boom' });
  });

  it('stays quiet in a top-level document', async () => {
    const messages = received();
    window.eval(bridgeSource('abc'));
    expect(await messages()).toEqual([]);
  });
});
