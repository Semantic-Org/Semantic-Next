import { defineComponent } from '@semantic-ui/component';
import { describe, expect, it } from 'vitest';

import semanticUI from '../src/index.js';

defineComponent({
  tagName: 'test-widget',
  template: '<span class="w">{label}</span>',
});

// minimal eleventyConfig double — captures the transform the plugin registers
function fakeConfig() {
  return {
    transforms: {},
    on() {},
    addTransform(name, fn) {
      this.transforms[name] = fn;
    },
  };
}

describe('@semantic-ui/eleventy', () => {
  it('expands registered tags in .html output', () => {
    const config = fakeConfig();
    semanticUI(config, {});
    const transform = config.transforms['semantic-ui-dsd'];
    const out = transform.call(
      { page: { outputPath: 'dist/index.html' } },
      '<main><test-widget label="Hi"></test-widget></main>',
    );
    expect(out).toContain('<template shadowrootmode="open">');
    expect(out).toContain('Hi');
  });

  it('passes non-html output through untouched', () => {
    const config = fakeConfig();
    semanticUI(config, {});
    const transform = config.transforms['semantic-ui-dsd'];
    const input = '<test-widget label="Hi"></test-widget>';
    const out = transform.call({ page: { outputPath: 'dist/feed.xml' } }, input);
    expect(out).toBe(input);
  });
});
