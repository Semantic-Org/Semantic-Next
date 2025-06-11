// @semantic-ui/tailwinds - Tailwind CSS Plugin for Semantic UI Components
// Provides JIT compilation of Tailwind classes for Shadow DOM components
//
// This is the fallback entry point for backward compatibility.
// Conditional exports should automatically route to browser.js or server.js,
// but this provides environment detection as a fallback.

// Environment detection
const isNode = typeof process !== 'undefined' && process.versions?.node;

// Top-level await for dynamic imports
const { generateTailwindCSS } = isNode
  ? await import('./generator-server.js')
  : await import('./generator-browser.js');

// Static imports for shared modules
export { collectContent } from './scanner.js';
export { default as TailwindPlugin } from './tailwind-plugin.js';

// Re-export the environment-specific generator
export { generateTailwindCSS };
