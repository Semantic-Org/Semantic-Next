import { describe, expect, it } from 'vitest';
import { generateTailwindCSS, getTailwindClasses } from '../../src/server/index.js';

describe('Server-Side Tailwind ISO (Native)', () => {
  describe('getTailwindClasses', () => {
    it('should extract basic utility classes from content', async () => {
      const content = '<div class="p-4 bg-blue-500 text-white">Hello</div>';
      const classes = await getTailwindClasses({ content });
      
      expect(classes).toContain('p-4');
      expect(classes).toContain('bg-blue-500');
      expect(classes).toContain('text-white');
    });

    it('should extract Tailwind classes from JSX, HTML, and JS patterns', async () => {
      const content = `
        // JSX component patterns
        const Button = ({ isActive }) => (
          <button 
            className={cn(
              "px-4 py-2 rounded-md font-medium transition-colors",
              isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900",
              "hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            )}
          >
            Click me
          </button>
        );

        // HTML template patterns
        <div class="container mx-auto max-w-4xl">
          <nav class="flex items-center justify-between py-4 border-b">
            <div class="flex space-x-4">
              <a href="#" class="text-sm font-medium text-gray-700 hover:text-gray-900">Home</a>
            </div>
          </nav>
        </div>

        // JavaScript string patterns
        const dynamicClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
        element.classList.add('hidden', 'sm:block', 'lg:hidden');
        
        // Template literals
        const responsiveGrid = \`
          grid grid-cols-\${cols} 
          gap-4 p-6 
          bg-white shadow-lg rounded-xl
        \`;

        // Object/array patterns
        const styles = {
          wrapper: "min-h-screen bg-gray-50 flex items-center justify-center",
          card: ["bg-white", "p-8", "rounded-2xl", "shadow-xl", "max-w-md", "w-full"]
        };
      `;
      
      const classes = await getTailwindClasses({ content });
      
      const expectedClasses = [
        // JSX className patterns
        'px-4', 'py-2', 'rounded-md', 'font-medium', 'transition-colors',
        'bg-blue-600', 'text-white', 'bg-gray-200', 'text-gray-900',
        'hover:bg-blue-700', 'focus:ring-2', 'focus:ring-blue-500',
        
        // HTML class patterns
        'container', 'mx-auto', 'max-w-4xl',
        'flex', 'items-center', 'justify-between', 'border-b',
        'space-x-4', 'text-sm', 'text-gray-700', 'hover:text-gray-900',
        
        // JS string patterns
        'grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6',
        'hidden', 'sm:block', 'lg:hidden',
        
        // Template literal patterns
        'gap-4', 'p-6', 'bg-white', 'shadow-lg', 'rounded-xl',
        
        // Object patterns
        'min-h-screen', 'bg-gray-50', 'justify-center',
        'p-8', 'rounded-2xl', 'shadow-xl', 'max-w-md', 'w-full'
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

    it('should respect extension parameter for different content types', async () => {
      const htmlContent = '<div class="html-specific border-2 p-4">HTML</div>';
      const jsContent = 'const classes = "js-specific rounded-lg shadow-md";';
      
      // Test HTML extension
      const htmlClasses = await getTailwindClasses({ 
        content: htmlContent, 
        extension: 'html' 
      });
      expect(htmlClasses).toContain('html-specific');
      expect(htmlClasses).toContain('border-2');
      expect(htmlClasses).toContain('p-4');
      
      // Test JS extension  
      const jsClasses = await getTailwindClasses({ 
        content: jsContent, 
        extension: 'js' 
      });
      expect(jsClasses).toContain('js-specific');
      expect(jsClasses).toContain('rounded-lg');
      expect(jsClasses).toContain('shadow-md');
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
});