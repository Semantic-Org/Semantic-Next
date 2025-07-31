import { adoptStylesheet, extractCSS, scopeStyles } from '@semantic-ui/utils';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('CSS Utilities', () => {
  let testElement;
  
  beforeEach(() => {
    // Clean up any existing test elements
    document.querySelectorAll('[data-test="css-utils"]').forEach(el => el.remove());
    
    // Create a fresh test element for each test
    testElement = document.createElement('div');
    testElement.setAttribute('data-test', 'css-utils');
    testElement.attachShadow({ mode: 'open' });
    document.body.appendChild(testElement);
    
    // Clear any cached stylesheets
    if (document.cachedStylesheets) {
      document.cachedStylesheets = {};
    }
  });

  afterEach(() => {
    // Clean up test elements and stylesheets
    document.querySelectorAll('[data-test="css-utils"]').forEach(el => el.remove());
    
    // Clear adopted stylesheets from document
    if (document.adoptedStyleSheets) {
      document.adoptedStyleSheets = [];
    }
    
    // Clear cached stylesheets
    if (document.cachedStylesheets) {
      document.cachedStylesheets = {};
    }
  });

  describe('adoptStylesheet', () => {
    describe('basic functionality', () => {
      it('should adopt CSS stylesheet to document by default', () => {
        const css = '.test { color: red; }';
        const initialCount = document.adoptedStyleSheets ? document.adoptedStyleSheets.length : 0;
        
        adoptStylesheet(css);
        
        expect(document.adoptedStyleSheets).toBeDefined();
        expect(document.adoptedStyleSheets.length).toBe(initialCount + 1);
        
        const addedSheet = document.adoptedStyleSheets[document.adoptedStyleSheets.length - 1];
        expect(addedSheet.cssRules.length).toBe(1);
        expect(addedSheet.cssRules[0].selectorText).toBe('.test');
      });

      it('should adopt CSS stylesheet to specific element', () => {
        const css = '.shadow-test { background: blue; }';
        const shadowRoot = testElement.shadowRoot;
        
        adoptStylesheet(css, shadowRoot);
        
        expect(shadowRoot.adoptedStyleSheets).toBeDefined();
        expect(shadowRoot.adoptedStyleSheets.length).toBe(1);
        expect(shadowRoot.adoptedStyleSheets[0].cssRules[0].selectorText).toBe('.shadow-test');
      });

      it('should prevent duplicate stylesheets using hash', () => {
        const css = '.duplicate-test { margin: 10px; }';
        const shadowRoot = testElement.shadowRoot;
        
        adoptStylesheet(css, shadowRoot);
        adoptStylesheet(css, shadowRoot); // Same CSS, should not be added again
        
        expect(shadowRoot.adoptedStyleSheets.length).toBe(1);
        expect(shadowRoot.cssHashes.length).toBe(1);
      });

      it('should allow different CSS with different hashes', () => {
        const css1 = '.test1 { color: red; }';
        const css2 = '.test2 { color: blue; }';
        const shadowRoot = testElement.shadowRoot;
        
        adoptStylesheet(css1, shadowRoot);
        adoptStylesheet(css2, shadowRoot);
        
        expect(shadowRoot.adoptedStyleSheets.length).toBe(2);
        expect(shadowRoot.cssHashes.length).toBe(2);
      });
    });

    describe('caching functionality', () => {
      it('should cache stylesheet when cacheStylesheet is true', () => {
        const css = '.cached-test { font-size: 16px; }';
        
        adoptStylesheet(css, document, { cacheStylesheet: true });
        
        expect(document.cachedStylesheets).toBeDefined();
        expect(Object.keys(document.cachedStylesheets).length).toBe(1);
        
        const hash = Object.keys(document.cachedStylesheets)[0];
        expect(document.cachedStylesheets[hash]).toBeInstanceOf(CSSStyleSheet);
      });

      it('should reuse cached stylesheet', () => {
        const css = '.reuse-test { padding: 5px; }';
        
        // First adoption with caching
        adoptStylesheet(css, document, { cacheStylesheet: true });
        const cachedSheet = Object.values(document.cachedStylesheets)[0];
        
        // Second adoption should reuse the cached sheet
        const shadowRoot = testElement.shadowRoot;
        adoptStylesheet(css, shadowRoot, { cacheStylesheet: true });
        
        expect(shadowRoot.adoptedStyleSheets[0]).toBe(cachedSheet);
      });

      it('should handle CSS reset sharing use case', () => {
        const resetCSS = `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; }
        `;
        
        // Adopt reset CSS to multiple shadow roots with caching
        const element1 = document.createElement('div');
        element1.attachShadow({ mode: 'open' });
        const element2 = document.createElement('div');
        element2.attachShadow({ mode: 'open' });
        
        document.body.appendChild(element1);
        document.body.appendChild(element2);
        
        adoptStylesheet(resetCSS, element1.shadowRoot, { cacheStylesheet: true });
        adoptStylesheet(resetCSS, element2.shadowRoot, { cacheStylesheet: true });
        
        // Both should have the same cached stylesheet instance
        expect(element1.shadowRoot.adoptedStyleSheets[0]).toBe(element2.shadowRoot.adoptedStyleSheets[0]);
        expect(Object.keys(document.cachedStylesheets).length).toBe(1);
        
        // Clean up
        element1.remove();
        element2.remove();
      });
    });

    describe('edge cases', () => {
      it('should auto-detect root node when passed a regular element', () => {
        const css = '.auto-root-test { color: purple; }';
        
        // Create a regular element inside the shadow root
        const regularElement = document.createElement('span');
        testElement.shadowRoot.appendChild(regularElement);
        
        // Pass the regular element - should auto-detect shadow root
        adoptStylesheet(css, regularElement);
        
        // Should have been adopted to the shadow root, not the element
        expect(testElement.shadowRoot.adoptedStyleSheets.length).toBe(1);
        expect(testElement.shadowRoot.adoptedStyleSheets[0].cssRules[0].selectorText).toBe('.auto-root-test');
      });

      it('should use document as root when element has no shadow root', () => {
        const css = '.document-fallback { font-weight: bold; }';
        const regularDiv = document.createElement('div');
        document.body.appendChild(regularDiv);
        
        const initialCount = document.adoptedStyleSheets.length;
        adoptStylesheet(css, regularDiv);
        
        expect(document.adoptedStyleSheets.length).toBe(initialCount + 1);
        
        // Clean up
        regularDiv.remove();
      });

      it('should handle custom hash values', () => {
        const css = '.custom-hash { border: 1px solid black; }';
        const customHash = 'my-custom-hash';
        
        adoptStylesheet(css, testElement.shadowRoot, { hash: customHash });
        
        expect(testElement.shadowRoot.cssHashes).toContain(customHash);
      });

      it('should handle empty CSS', () => {
        const css = '';
        
        expect(() => {
          adoptStylesheet(css, testElement.shadowRoot);
        }).not.toThrow();
        
        expect(testElement.shadowRoot.adoptedStyleSheets.length).toBe(1);
      });

      it('should handle invalid CSS gracefully', () => {
        const invalidCSS = '.invalid { color: ; }'; // Missing value
        
        expect(() => {
          adoptStylesheet(invalidCSS, testElement.shadowRoot);
        }).not.toThrow();
      });
    });
  });

  describe('extractCSS', () => {
    describe('basic functionality', () => {
      it('should extract CSS rules matching selector from stylesheet array', () => {
        const testSheet = new CSSStyleSheet();
        testSheet.replaceSync(`
          .extract-test { color: green; }
          .other-test { color: red; }
          .extract-test-2 { background: yellow; }
        `);
        
        const extracted = extractCSS('.extract-test', [testSheet]);
        
        expect(extracted).toBeInstanceOf(CSSStyleSheet);
        expect(extracted.cssRules.length).toBe(2); // Should match both .extract-test and .extract-test-2
      });

      it('should extract from raw CSS string', () => {
        const cssString = `
          .string-test { font-weight: bold; }
          .other { font-style: italic; }
          .string-test-variation { text-decoration: underline; }
        `;
        
        const extracted = extractCSS('.string-test', cssString);
        
        expect(extracted.cssRules.length).toBe(2); // Should match both string-test rules
      });

      it('should extract from single stylesheet', () => {
        const singleSheet = new CSSStyleSheet();
        singleSheet.replaceSync(`
          .single-test { display: block; }
          .single-test-alt { display: inline; }
          .other { display: none; }
        `);
        
        const extracted = extractCSS('.single-test', singleSheet);
        
        expect(extracted.cssRules.length).toBe(2);
      });

      it('should extract from array of stylesheets', () => {
        const sheet1 = new CSSStyleSheet();
        sheet1.replaceSync('.array-test-1 { color: blue; }');
        
        const sheet2 = new CSSStyleSheet();
        sheet2.replaceSync('.array-test-2 { color: red; }');
        
        const extracted = extractCSS('.array-test', [sheet1, sheet2]);
        
        expect(extracted.cssRules.length).toBe(2);
      });
    });

    describe('polymorphic inputs', () => {
      it('should handle document as source', () => {
        const extracted = extractCSS('.document-test', document);
        expect(extracted).toBeInstanceOf(CSSStyleSheet);
      });

      it('should handle element with styleSheets as source', () => {
        const mockElement = {
          styleSheets: [new CSSStyleSheet()]
        };
        mockElement.styleSheets[0].replaceSync('.element-test { visibility: hidden; }');
        
        const extracted = extractCSS('.element-test', mockElement);
        expect(extracted.cssRules.length).toBe(1);
      });

      it('should fallback to document.styleSheets for invalid source', () => {
        const extracted = extractCSS('.fallback-test', null);
        expect(extracted).toBeInstanceOf(CSSStyleSheet);
      });

      it('should handle nested CSS rules', () => {
        const cssWithNested = `
          @media (max-width: 600px) {
            .nested-test { color: purple; }
            .other { color: orange; }
          }
          .nested-test { color: pink; }
        `;
        
        const extracted = extractCSS('.nested-test', cssWithNested);
        expect(extracted.cssRules.length).toBeGreaterThan(0);
      });
    });

    describe('edge cases', () => {
      it('should handle case-insensitive selector matching', () => {
        const css = '.UPPERCASE-test { text-transform: uppercase; }';
        const extracted = extractCSS('.UPPERCASE-TEST', css);
        expect(extracted.cssRules.length).toBe(1);
      });

      it('should handle empty stylesheets', () => {
        const emptySheet = new CSSStyleSheet();
        const extracted = extractCSS('.empty-test', emptySheet);
        expect(extracted.cssRules.length).toBe(0);
      });

      it('should handle CSS access errors gracefully', () => {
        // Mock a stylesheet that throws errors when accessing cssRules
        const problematicSheet = {
          cssRules: null,
          get cssRules() {
            throw new Error('Access denied');
          }
        };
        
        expect(() => {
          extractCSS('.error-test', [problematicSheet]);
        }).not.toThrow();
      });
    });
  });

  describe('scopeStyles', () => {
    describe('basic functionality', () => {
      it('should scope CSS rules with prepended selector', () => {
        const css = `
          .test { color: red; }
          .another { background: blue; }
        `;
        
        const scoped = scopeStyles(css, '.scope');
        
        expect(scoped).toContain('.scope .test');
        expect(scoped).toContain('.scope .another');
        expect(scoped).toContain('color: red');
        expect(scoped).toContain('background: blue');
      });

      it('should handle empty scope selector', () => {
        const css = '.no-scope { margin: 10px; }';
        const scoped = scopeStyles(css, '');
        
        expect(scoped).toContain('.no-scope');
        expect(scoped).toContain('margin: 10px');
      });

      it('should be case-insensitive for scope selector', () => {
        const css = '.case-test { padding: 5px; }';
        const scoped = scopeStyles(css, '.SCOPE-TEST');
        
        expect(scoped).toContain('.scope-test .case-test');
      });
    });

    describe('scoping options', () => {
      it('should replace :host when replaceHost is true', () => {
        const css = `
          :host { display: block; }
          :host(.active) { color: green; }
        `;
        
        const scoped = scopeStyles(css, '.my-component', { replaceHost: true });
        
        expect(scoped).toContain('.my-component {');
        expect(scoped).toContain('.my-component.active {');
        expect(scoped).not.toContain(':host');
      });

      it('should not replace :host when replaceHost is false', () => {
        const css = ':host { display: block; }';
        
        const scoped = scopeStyles(css, '.my-component', { replaceHost: false });
        
        expect(scoped).toContain('.my-component :host');
      });

      it('should append scope to html/body when appendToRootElements is true', () => {
        const css = `
          html { font-size: 16px; }
          body { margin: 0; }
        `;
        
        const scoped = scopeStyles(css, '.root-scope', { appendToRootElements: true });
        
        expect(scoped).toContain('html .root-scope');
        expect(scoped).toContain('body .root-scope');
      });

      it('should prepend scope to html/body when appendToRootElements is false', () => {
        const css = `
          html { font-size: 16px; }
          body { margin: 0; }
        `;
        
        const scoped = scopeStyles(css, '.root-scope', { appendToRootElements: false });
        
        expect(scoped).toContain('.root-scope html');
        expect(scoped).toContain('.root-scope body');
      });

      it('should handle both options together', () => {
        const css = `
          :host { display: block; }
          html { font-size: 16px; }
          .regular { color: black; }
        `;
        
        const scoped = scopeStyles(css, '.complex-scope', { 
          replaceHost: true, 
          appendToRootElements: true 
        });
        
        expect(scoped).toContain('.complex-scope {'); // :host replaced
        expect(scoped).toContain('html .complex-scope'); // html appended
        expect(scoped).toContain('.complex-scope .regular'); // regular prepended
      });
    });

    describe('complex CSS handling', () => {
      it('should handle media queries', () => {
        const css = `
          @media (max-width: 768px) {
            .responsive { font-size: 14px; }
          }
        `;
        
        const scoped = scopeStyles(css, '.media-scope');
        
        expect(scoped).toContain('@media');
        expect(scoped).toContain('(max-width: 768px)');
        expect(scoped).toContain('.media-scope .responsive');
      });

      it('should handle @supports rules', () => {
        const css = `
          @supports (display: grid) {
            .grid-test { display: grid; }
          }
        `;
        
        const scoped = scopeStyles(css, '.supports-scope');
        
        expect(scoped).toContain('@supports');
        expect(scoped).toContain('(display: grid)');
        expect(scoped).toContain('.supports-scope .grid-test');
      });

      it('should handle @layer rules', () => {
        const css = `
          @layer base {
            .layer-test { font-family: Arial; }
          }
        `;
        
        const scoped = scopeStyles(css, '.layer-scope');
        
        expect(scoped).toContain('@layer');
        expect(scoped).toContain('base');
        expect(scoped).toContain('.layer-scope .layer-test');
      });
    });

    describe('edge cases', () => {
      it('should handle empty CSS', () => {
        const scoped = scopeStyles('', '.empty-scope');
        expect(typeof scoped).toBe('string');
        expect(scoped.trim()).toBe('');
      });

      it('should handle CSS with no rules', () => {
        const css = '/* Just a comment */';
        const scoped = scopeStyles(css, '.comment-scope');
        expect(typeof scoped).toBe('string');
      });

      it('should handle multiple selectors in one rule', () => {
        const css = '.first, .second, .third { color: red; }';
        const scoped = scopeStyles(css, '.multi-scope');
        
        expect(scoped).toContain('.multi-scope');
        expect(scoped).toContain('color: red');
      });

      it('should handle CSS with pseudo-classes and pseudo-elements', () => {
        const css = `
          .hover-test:hover { color: blue; }
          .focus-test:focus { outline: 2px solid red; }
          .before-test::before { content: ""; }
        `;
        
        const scoped = scopeStyles(css, '.pseudo-scope');
        
        expect(scoped).toContain('.pseudo-scope .hover-test:hover');
        expect(scoped).toContain('.pseudo-scope .focus-test:focus');
        expect(scoped).toContain('.pseudo-scope .before-test::before');
      });
    });
  });
});