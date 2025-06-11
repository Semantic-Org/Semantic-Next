// @semantic-ui/tailwind-browser - Tailwind CSS Plugin for Semantic UI Components (Browser)
// Provides JIT compilation of Tailwind classes for Shadow DOM components using WASM scanner

export { generateTailwindCSS } from './generator.js';
export { collectContent } from './scanner.js';
export { default as TailwindPlugin } from './tailwind-plugin.js';
