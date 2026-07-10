import { describe, expect, it } from 'vitest';

import { createRpc } from '../src/rpc.js';

/* two rpc endpoints wired directly to each other */
const createPair = () => {
  let receiveA;
  let receiveB;
  const a = createRpc({
    post: (message) => queueMicrotask(() => receiveB?.(message)),
    listen: (receive) => {
      receiveA = receive;
    },
  });
  const b = createRpc({
    post: (message) => queueMicrotask(() => receiveA?.(message)),
    listen: (receive) => {
      receiveB = receive;
    },
  });
  return { a, b };
};

describe('createRpc', () => {
  it('round-trips requests to handlers', async () => {
    const { a, b } = createPair();
    b.handle('add', ({ x, y }) => x + y);
    await expect(a.request('add', { x: 2, y: 3 })).resolves.toBe(5);
  });

  it('propagates handler errors as rejections', async () => {
    const { a, b } = createPair();
    b.handle('explode', () => {
      throw new Error('kaboom');
    });
    await expect(a.request('explode')).rejects.toThrow('kaboom');
  });

  it('rejects unknown methods', async () => {
    const { a } = createPair();
    await expect(a.request('missing')).rejects.toThrow('Unknown method: missing');
  });

  it('delivers notifications without responses', async () => {
    const { a, b } = createPair();
    const received = [];
    b.handle('log', (params) => received.push(params));
    a.notify('log', { line: 1 });
    a.notify('log', { line: 2 });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(received).toEqual([{ line: 1 }, { line: 2 }]);
  });

  it('times out unanswered requests', async () => {
    const rpc = createRpc({ post: () => {}, listen: () => {} });
    await expect(rpc.request('void', {}, { timeout: 20 })).rejects.toThrow('RPC timeout: void');
  });

  it('rejects pending requests on close', async () => {
    const { a, b } = createPair();
    b.handle('slow', () => new Promise(() => {}));
    const pending = a.request('slow');
    a.close();
    await expect(pending).rejects.toThrow('RPC closed');
  });
});
