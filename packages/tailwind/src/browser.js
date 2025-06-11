// @semantic-ui/tailwind - Browser entry point
// Provides JIT compilation of Tailwind classes for Semantic UI components

export { generateTailwindCSS } from './generator-browser.js';
export { collectContent } from './scanner.js';
export { default as TailwindPlugin } from './tailwind-plugin-browser.js';
