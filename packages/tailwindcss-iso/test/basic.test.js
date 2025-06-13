import { describe, expect, it } from 'vitest';
import { collectContent } from '../src/scanner.js';
import { TailwindPlugin as ServerPlugin } from '../src/server.js';

describe('Server-Side Tailwind Plugin (Native)', () => {
  it('should generate CSS using the native Node.js implementation', async () => {
    const transform = ServerPlugin();
    const definition = {
      template: '<div class="p-4 bg-red-500"></div>',
    };

    const result = await transform(definition);

    // Verify that CSS was generated
    expect(result.css).toBeDefined();
    expect(result.css).toContain('.p-4');
    expect(result.css).toContain('.bg-red-500');
  });

  it('should return the original definition if no content is found', async () => {
    const transform = ServerPlugin();
    const definition = { css: '.original {}' }; // No template or classes
    const result = await transform(definition);
    expect(result).toEqual(definition);
  });
});
