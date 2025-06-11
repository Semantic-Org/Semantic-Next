/**
 * Generates Tailwind CSS for browser environments using WASM scanner
 */

import { compile, Features } from 'tailwindcss';
import indexCSS from 'tailwindcss/index.css?raw';
import preflightCSS from 'tailwindcss/preflight.css?raw';
import themeCSS from 'tailwindcss/theme.css?raw';
import utilitiesCSS from 'tailwindcss/utilities.css?raw';

export async function generateTailwindCSS({ content, css = '', tailwindCSS, config = {} }) {
  // Load WASM-based scanner for browser environment
  let Scanner, ChangedContent;
  try {
    const wasmModule = await import('../browser-wasm/tailwindcss_oxide.js');
    await wasmModule.default();
    Scanner = wasmModule.WasmScanner;
    ChangedContent = wasmModule.WasmChangedContent;
  }
  catch (error) {
    throw new Error(
      'Failed to load WASM scanner: ' + error.message,
    );
  }
  // Build source CSS with Tailwind directives + existing component CSS
  if (!tailwindCSS) {
    tailwindCSS = `@import "tailwindcss";`;
  }

  const sourceCSS = css
    ? `${css}\n${tailwindCSS}` // Add utilities to existing CSS
    : tailwindCSS; // Just utilities if no existing CSS

  // Compile the CSS using tailwindcss core with browser-specific options
  const compiler = await compile(sourceCSS, {
    base: '/',
    loadStylesheet: async (id, base) => {
      // Handle built-in Tailwind CSS imports using the imported CSS content
      if (id === 'tailwindcss') {
        return {
          path: 'virtual:tailwindcss/index.css',
          base,
          content: indexCSS,
        };
      }
      else if (
        id === 'tailwindcss/preflight'
        || id === 'tailwindcss/preflight.css'
        || id === './preflight.css'
      ) {
        return {
          path: 'virtual:tailwindcss/preflight.css',
          base,
          content: preflightCSS,
        };
      }
      else if (
        id === 'tailwindcss/theme'
        || id === 'tailwindcss/theme.css'
        || id === './theme.css'
      ) {
        return {
          path: 'virtual:tailwindcss/theme.css',
          base,
          content: themeCSS,
        };
      }
      else if (
        id === 'tailwindcss/utilities'
        || id === 'tailwindcss/utilities.css'
        || id === './utilities.css'
      ) {
        return {
          path: 'virtual:tailwindcss/utilities.css',
          base,
          content: utilitiesCSS,
        };
      }

      throw new Error(`External stylesheets not supported in browser build: "${id}"`);
    },
    loadModule: () => {
      throw new Error('External modules not supported in browser build');
    },
  });

  // Extract candidates using WASM scanner
  const scanner = new Scanner();
  const changedContent = new ChangedContent(content, 'html');
  const candidatesWithPositions = scanner.getCandidatesWithPositions(changedContent);
  const candidates = candidatesWithPositions.map(item => item.candidate);
  // Build the CSS with the extracted candidates
  const result = compiler.build(candidates);

  return result; // returns stringified CSS ready to inject
}
