import { describe, expect, it } from 'vitest';

import semanticUI from '../src/index.js';

describe('@semantic-ui/vite', () => {
  it('returns the loaders plus the SSR noExternal config', () => {
    const plugins = semanticUI();
    expect(Array.isArray(plugins)).toBe(true);

    const ssr = plugins.find((plugin) => plugin.name === '@semantic-ui/vite:ssr');
    expect(ssr).toBeTruthy();

    const { noExternal } = ssr.config().ssr;
    expect(noExternal[0].test('@semantic-ui/component')).toBe(true);
    expect(noExternal[0].test('react')).toBe(false);
  });
});
