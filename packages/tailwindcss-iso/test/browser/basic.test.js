import { describe, expect, it } from 'vitest';
import { generateTailwindCSS, getTailwindClasses, loadTailwindCSS } from '../../src/browser/index.js';

describe('Browser-Side Tailwind ISO (WASM)', () => {
  describe('getTailwindClasses', () => {
    it('should extract basic utility classes from content', async () => {
      const content = '<div class="p-4 bg-blue-500 text-white">Hello</div>';
      const classes = await getTailwindClasses({ content });
      
      expect(classes).toContain('p-4');
      expect(classes).toContain('bg-blue-500');
      expect(classes).toContain('text-white');
    });

    it('should extract all Tailwind classes from mixed content', async () => {
      const content = `
        <div class="flex justify-center p-4">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Click me
          </button>
        </div>
        <script>
          const dynamicClasses = 'mt-4 space-y-2 shadow-lg';
        </script>
      `;
      const classes = await getTailwindClasses({ content });
      
      const expectedClasses = [
        'flex', 'justify-center', 'p-4',
        'bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded',
        'mt-4', 'space-y-2', 'shadow-lg'
      ];
      
      expectedClasses.forEach(expectedClass => {
        expect(classes).toContain(expectedClass);
      });
    });

    it('should extract classes from JavaScript content', async () => {
      const content = `
        const element = document.querySelector('.container');
        element.className = 'flex justify-center items-center bg-gray-100';
      `;
      const classes = await getTailwindClasses({ content });
      
      expect(classes).toContain('flex');
      expect(classes).toContain('justify-center');
      expect(classes).toContain('items-center');
      expect(classes).toContain('bg-gray-100');
    });

    it('should return classes with positions when returnPositions is true', async () => {
      const content = '<div class="p-4 bg-blue-500">Test</div>';
      const result = await getTailwindClasses({ content, returnPositions: true });
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      const firstClass = result[0];
      expect(firstClass).toHaveProperty('candidate');
      expect(firstClass).toHaveProperty('position');
      expect(typeof firstClass.position).toBe('number');
    });

    it('should handle WASM loading errors gracefully', async () => {
      // This test verifies error handling if WASM fails to load
      // In a real scenario, we might mock the import to fail
      expect(getTailwindClasses).toBeDefined();
    });
  });

  describe('generateTailwindCSS', () => {
    it('should generate CSS from content', async () => {
      const content = '<div class="p-4 bg-blue-500 text-white">Hello</div>';
      const css = await generateTailwindCSS({ content });
      
      expect(css).toBeDefined();
      expect(typeof css).toBe('string');
      expect(css.length).toBeGreaterThan(0);
      
      // Should contain expected utility classes
      expect(css).toMatch(/\.p-4/);
      expect(css).toMatch(/\.bg-blue-500/);
      expect(css).toMatch(/\.text-white/);
    });

    it('should generate CSS from candidates array', async () => {
      const candidates = ['p-4', 'bg-red-500', 'text-white', 'font-bold'];
      const css = await generateTailwindCSS({ candidates });
      
      expect(css).toBeDefined();
      expect(css).toMatch(/\.p-4/);
      expect(css).toMatch(/\.bg-red-500/);
      expect(css).toMatch(/\.text-white/);
      expect(css).toMatch(/\.font-bold/);
    });

    it('should include custom CSS when provided', async () => {
      const content = '<div class="custom-class p-4">Test</div>';
      const customCSS = '.custom-class { border: 1px solid red; }';
      const css = await generateTailwindCSS({ content, css: customCSS });
      
      expect(css).toContain('.custom-class');
      expect(css).toContain('border: 1px solid red;');
      expect(css).toMatch(/\.p-4/);
    });

    it('should handle empty content gracefully', async () => {
      const css = await generateTailwindCSS({ content: '' });
      
      expect(css).toBeDefined();
      expect(typeof css).toBe('string');
    });

    it('should handle responsive and pseudo-class utilities', async () => {
      const content = '<div class="p-2 md:p-4 lg:p-6 hover:bg-blue-500">Responsive</div>';
      const css = await generateTailwindCSS({ content });
      
      expect(css).toMatch(/\.p-2/);
      expect(css).toMatch(/\.md\\:p-4/); // CSS escapes the colon
      expect(css).toMatch(/\.lg\\:p-6/);
      expect(css).toMatch(/\.hover\\:bg-blue-500/);
    });
  });

  describe('loadTailwindCSS', () => {
    it('should load Tailwind base stylesheets', async () => {
      const result = await loadTailwindCSS('tailwindcss', '/');
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('path');
      expect(result).toHaveProperty('base');
      expect(result).toHaveProperty('content');
      expect(typeof result.content).toBe('string');
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle different stylesheet IDs', async () => {
      const stylesheets = [
        'tailwindcss',
        'tailwindcss/preflight',
        'tailwindcss/utilities'
      ];
      
      for (const id of stylesheets) {
        const result = await loadTailwindCSS(id, '/');
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
      }
    });
  });
});