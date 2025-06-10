import { describe, expect, it } from 'vitest';
import { collectContent } from '../src/scanner.js';
import TailwindPlugin from '../src/tailwind-plugin.js';

describe('@semantic-ui/tailwinds', () => {
  describe('collectContent', () => {
    it('should extract content from component definition', () => {
      const definition = {
        template: '<div class="px-4 py-2 bg-blue-500">Hello</div>',
        createComponent: () => ({
          getClasses() {
            return 'text-white hover:bg-blue-600';
          },
        }),
        events: {
          'click .button': () => {
            console.log('bg-red-500 active:scale-95');
          },
        },
      };

      const { html, js, css, content } = collectContent(definition);

      expect(html).toContain('px-4 py-2 bg-blue-500');
      expect(js).toContain('text-white hover:bg-blue-600');
      expect(js).toContain('bg-red-500 active:scale-95');
      expect(css).toBe(''); // No CSS in this test

      // Verify combined content includes both
      expect(content).toContain('px-4 py-2 bg-blue-500');
      expect(content).toContain('text-white hover:bg-blue-600');
      expect(content).toContain('bg-red-500 active:scale-95');
    });

    it('should handle subTemplates', () => {
      const definition = {
        template: '<div class="container">Main</div>',
        css: '.main { color: red; }',
        subTemplates: {
          item: {
            template: '<span class="text-sm text-gray-600">Item</span>',
            css: '.item { color: blue; }',
          },
        },
      };

      const { html, js, css } = collectContent(definition);

      expect(html).toContain('container');
      expect(html).toContain('text-sm text-gray-600');
      expect(css).toContain('.main { color: red; }');
      expect(css).toContain('.item { color: blue; }');
    });

    it('should return empty strings when no content', () => {
      const definition = {};
      const { html, js, css } = collectContent(definition);

      expect(html).toBe('');
      expect(js).toBe('');
      expect(css).toBe('');
    });
  });

  describe('TailwindPlugin', () => {
    it('should return unchanged definition when no content', async () => {
      const transform = TailwindPlugin();
      const definition = { css: 'original css' };

      const result = await transform(definition);

      expect(result).toEqual(definition);
    });

    it('should be an async function', () => {
      const transform = TailwindPlugin();

      expect(typeof transform).toBe('function');

      const definition = { template: '<div>test</div>' };
      const result = transform(definition);

      expect(result).toBeInstanceOf(Promise);
    });
  });
});
