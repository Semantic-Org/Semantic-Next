import { describe, expect, it } from 'vitest';

import { createServingAdapter } from '../../src/serving/sw-adapter.js';

describe('serving adapter errors', () => {
  it('rejects with a code a host can match where service workers are missing', async () => {
    expect('serviceWorker' in navigator).toBe(false);
    const session = createServingAdapter().createSession('test');
    await expect(session.setFiles({})).rejects.toMatchObject({ code: 'sandbox-unsupported' });
  });
});
