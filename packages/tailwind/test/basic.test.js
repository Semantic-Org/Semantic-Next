import { describe, expect, it } from 'vitest';
import { extractDefinitionContent } from '../src/extract-definition-content.js';
import { TailwindPlugin as ServerPlugin } from '../src/server.js';

describe('Server-Side Tailwind Plugin (Native)', () => {
  it('should generate CSS using the native Node.js implementation', async () => {
    const definition = {
      template: '<div class="p-4 bg-red-500"></div>',
    };

    const result = await ServerPlugin(definition);

    // Verify that CSS was generated
    expect(result.css).toBeDefined();
    expect(result.css).toContain('.p-4');
    expect(result.css).toContain('.bg-red-500');
  });

  it('should return the original definition if no content is found', async () => {
    const definition = { css: '.original {}' }; // No template or classes
    const result = await ServerPlugin(definition);
    expect(result).toEqual(definition);
  });
});
