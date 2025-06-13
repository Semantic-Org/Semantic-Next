import { describe, expect, it } from 'vitest';
import { TailwindPlugin as BrowserPlugin } from '../../src/browser.js';
import { collectContent } from '../../src/scanner.js';

describe('Browser-Side Tailwind Plugin (WASM)', () => {
  it('should generate CSS using the WASM implementation', async () => {
    const transform = BrowserPlugin();
    const definition = {
      template: '<div class="p-4 bg-blue-500"></div>',
    };

    const result = await transform(definition);

    // Verify that CSS was generated
    expect(result.css).toBeDefined();
    expect(result.css).toContain('.p-4');
    expect(result.css).toContain('.bg-blue-500');
  });

  it('should return the original definition if no content is found', async () => {
    const transform = BrowserPlugin();
    const definition = { css: '.original {}' }; // No template or classes
    const result = await transform(definition);
    expect(result).toEqual(definition);
  });
});
