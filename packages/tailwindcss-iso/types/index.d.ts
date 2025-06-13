// Re-export useful types from tailwindcss
import type { CompileOptions } from 'tailwindcss';

/**
 * Candidate class with position information
 */
export interface CandidateWithPosition {
  /** The Tailwind class candidate */
  candidate: string;
  /** Start position in the content */
  start: number;
  /** End position in the content */
  end: number;
}

/**
 * Options for generating Tailwind CSS
 */
export interface GenerateTailwindCSSOptions {
  /** HTML and JavaScript content to scan for Tailwind classes */
  content?: string;
  /** Additional CSS to include in the output */
  css?: string;
  /** CSS import statement for Tailwind base styles */
  importCSS?: string;
  /** Pre-extracted list of candidate classes to generate CSS for */
  candidates?: string[];
  /** Tailwind compile options (loadStylesheet, loadModule, etc.) */
  compileOptions?: Partial<CompileOptions>;
}

/**
 * Options for extracting Tailwind classes from content
 */
export interface GetTailwindClassesOptions {
  /** HTML and JavaScript content to scan for Tailwind classes */
  content?: string;
  /** Whether to return classes with position information */
  returnPositions?: boolean;
  /** File extension hint for parser ('html', 'js', 'jsx', 'tsx', 'vue', etc.) */
  extension?: string;
}

/**
 * Stylesheet information for browser loading
 */
export interface StylesheetInfo {
  /** Virtual path identifier */
  path: string;
  /** Base URL for resolution */
  base: string;
  /** CSS content */
  content: string;
}

/**
 * Generates Tailwind CSS from content string using the appropriate engine
 * for the current environment (WASM in browser, native in Node.js).
 * 
 * @param options - Configuration options for CSS generation
 * @returns Promise that resolves to the generated CSS string
 * 
 * @example
 * ```javascript
 * import { generateTailwindCSS } from 'tailwindcss-iso';
 * 
 * const css = await generateTailwindCSS({
 *   content: '<div class="p-4 bg-blue-500">Hello</div>',
 *   css: '@theme { --color-blue-500: #3b82f6; }'
 * });
 * ```
 */
export function generateTailwindCSS(options: GenerateTailwindCSSOptions): Promise<string>;

/**
 * Extracts candidate Tailwind classes from HTML and JavaScript content.
 * Classes are detected using Tailwind's Oxide scanner engine.
 * 
 * @param options - Configuration options for class extraction
 * @returns Promise that resolves to array of classes or classes with positions
 * 
 * @example
 * ```javascript
 * import { getTailwindClasses } from 'tailwindcss-iso';
 * 
 * // Get classes as string array
 * const classes = await getTailwindClasses({
 *   content: '<div class="p-4 bg-blue-500">Hello</div>'
 * });
 * // Returns: ['p-4', 'bg-blue-500']
 * 
 * // Get classes with position information
 * const classesWithPos = await getTailwindClasses({
 *   content: '<div class="p-4 bg-blue-500">Hello</div>',
 *   returnPositions: true
 * });
 * // Returns: [{ candidate: 'p-4', start: 12, end: 15 }, ...]
 * ```
 */
export function getTailwindClasses(options: GetTailwindClassesOptions): Promise<string[] | CandidateWithPosition[]>;

/**
 * Loads Tailwind CSS stylesheets for browser environments.
 * Handles virtual imports like 'tailwindcss', 'tailwindcss/preflight', etc.
 * This function is only available in the browser build.
 * 
 * @param id - The stylesheet identifier to load
 * @param base - Base URL for resolving relative imports
 * @returns Promise that resolves to stylesheet information
 * 
 * @example
 * ```javascript
 * import { loadTailwindCSS } from 'tailwindcss-iso/browser';
 * 
 * const stylesheet = await loadTailwindCSS('tailwindcss', '/');
 * // Returns: { path: 'virtual:tailwindcss/index.css', base: '/', content: '...' }
 * ```
 */
export function loadTailwindCSS(id: string, base: string): Promise<StylesheetInfo>;