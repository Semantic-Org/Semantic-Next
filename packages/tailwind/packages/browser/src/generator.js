/**
 * Generates Tailwind CSS using tailwindcss core (browser-side with WASM scanner)
 */

import { Scanner } from '@tailwindcss/oxide-wasm32-wasi';
import { compile, Features } from 'tailwindcss';

export async function generateTailwindCSS({ content, css = '', tailwindCSS, config = {} }) {
  // Build source CSS with Tailwind directives + existing component CSS
  if (!tailwindCSS) {
    tailwindCSS = `@tailwind base; @tailwind components; @tailwind utilities;`;
  }

  const sourceCSS = css
    ? `${css}\n${tailwindCSS}` // Add utilities to existing CSS
    : tailwindCSS; // Just utilities if no existing CSS

  // Compile the CSS using tailwindcss core with browser-specific options
  const compiler = await compile(sourceCSS, {
    base: '/',
    loadStylesheet: () => {
      throw new Error('External stylesheets not supported in browser build');
    },
    loadModule: () => {
      throw new Error('External modules not supported in browser build');
    },
  });

  // Extract candidates using WASM scanner
  const scanner = new Scanner({ sources: [] }); // No file sources, we'll scan content directly
  const candidates = [...scanner.scanText(content)];

  // Build the CSS with the extracted candidates
  const result = compiler.build(candidates);

  return result; // returns stringified CSS ready to inject
}
