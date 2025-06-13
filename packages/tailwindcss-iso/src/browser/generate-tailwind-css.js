// We use compile from `tailwindcss` in the browser and node @tailwindcss/oxide
import { compile } from 'tailwindcss';

import { getTailwindClasses } from './get-tailwind-classes.js';
import { loadTailwindCSS } from './load-tailwind-css.js';


/**
 * Generates Tailwind CSS for browser environments
 * using WASM Oxide Engine Compiled for browsers
 */

export async function generateTailwindCSS({
  content = '', // html and js content to scan
  css = '', // additional css to include in output
  importCSS = `@import "tailwindcss";`, // code to import tailwind
  candidates = [], // list of candidates to use to generate css
}) {

  // If no candidate array provided get it from content
  if(!candidates.length) {
    candidates = await getTailwindClasses({ content });
  }

  // We want to import tailwind first then include any passed in css
  const sourceCSS = css
    ? `${importCSS}\n${css}`
    : importCSS;

  // Compile the CSS using tailwindcss core with browser-specific options
  const compiler = await compile(sourceCSS, {
    base: '/',
    loadStylesheet: loadTailwindCSS,
    loadModule: () => {
      throw new Error('External modules not supported in browser build');
    },
  });

  // Build the CSS with the extracted candidates and return tailwind css
  return compiler.build(candidates);
}
