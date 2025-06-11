// @semantic-ui/tailwinds - Browser entry point using WASM scanner
// Provides JIT compilation of Tailwind classes for Shadow DOM components

export { generateTailwindCSS } from './generator-browser.js';
export { collectContent } from './scanner.js';
export { default as TailwindPlugin } from './tailwind-plugin-browser.js';
