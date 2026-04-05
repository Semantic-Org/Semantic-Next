import type { GenerateTailwindCSSOptions } from 'tailwindcss-iso';

/**
 * Content extracted from a component definition for Tailwind class scanning
 */
export interface ExtractedContent {
  /** Combined HTML content from templates */
  html: string;
  /** Combined JavaScript content from functions */
  js: string;
  /** Combined CSS content from component styles */
  css: string;
  /** Combined HTML and JavaScript content for scanning */
  content: string;
}

/**
 * Semantic UI component definition that can be processed by TailwindPlugin.
 * Includes the properties that TailwindPlugin scans for Tailwind classes.
 */
export interface ComponentDefinition {
  /** HTML template string */
  template?: string;
  /** CSS styles string */
  css?: string;
  /** Component creation function */
  createComponent?: Function;
  /** Lifecycle callback functions */
  onCreated?: Function;
  onRendered?: Function;
  onDestroyed?: Function;
  onThemeChanged?: Function;
  onAttributeChanged?: Function;
  /** Event handlers object */
  events?: Record<string, Function>;
  /** Key binding handlers object */
  keys?: Record<string, Function>;
  /** Sub-template definitions */
  subTemplates?: Record<string, {
    template?: string;
    css?: string;
  }>;
}

/**
 * Scans a Semantic UI component definition and extracts all content
 * that may contain Tailwind classes for processing.
 *
 * This function comprehensively scans:
 * - Template HTML strings
 * - Component CSS styles
 * - JavaScript function bodies (converted to strings)
 * - Sub-template content recursively
 *
 * @param definition - The component definition to scan
 * @returns Object containing extracted HTML, JS, CSS, and combined content
 *
 * @example
 * ```javascript
 * import { extractDefinitionContent } from '@semantic-ui/tailwind';
 *
 * const definition = {
 *   tagName: 'my-button',
 *   template: '<button class="px-4 py-2 bg-blue-500">Click me</button>',
 *   css: '@theme { --color-blue-500: #3b82f6; }',
 *   createComponent: () => ({ click() { console.log('clicked'); } })
 * };
 *
 * const { content, css } = extractDefinitionContent(definition);
 * // content includes all scannable text
 * // css includes the component CSS
 * ```
 */
export function extractDefinitionContent(definition: ComponentDefinition): ExtractedContent;

/**
 * Transforms a Semantic UI component definition by scanning it for Tailwind classes
 * and generating the corresponding CSS to replace the component's existing CSS.
 *
 * This plugin:
 * 1. Scans all component content for Tailwind class usage
 * 2. Generates optimized CSS using the appropriate engine (WASM in browser, native in Node.js)
 * 3. Replaces the component's CSS with the generated Tailwind CSS
 * 4. Preserves all other component definition properties
 *
 * The generated CSS is optimized for shadow DOM and includes:
 * - Tailwind utilities for detected classes
 * - Component-specific @theme customizations
 * - Custom @utility definitions
 * - Existing component CSS integrated with Tailwind
 *
 * @param definition - The component definition to transform
 * @param options - Optional Tailwind generation options
 * @returns Promise that resolves to the transformed component definition
 *
 * @example
 * ```javascript
 * import { defineComponent, getText } from '@semantic-ui/component';
 * import { TailwindPlugin } from '@semantic-ui/tailwind';
 *
 * let definition = {
 *   tagName: 'my-button',
 *   template: '<button class="px-4 py-2 bg-blue-500 hover:bg-blue-600">Click me</button>',
 *   css: '@theme { --color-blue-500: #3b82f6; --color-blue-600: #2563eb; }',
 *   defaultSettings: { variant: 'primary' }
 * };
 *
 * // Transform the definition
 * definition = await TailwindPlugin(definition);
 *
 * // CSS is now generated Tailwind utilities
 * export const MyButton = defineComponent(definition);
 * ```
 *
 * @example
 * ```javascript
 * // With multiple plugins
 * definition = await SomeOtherPlugin(
 *   await TailwindPlugin(definition)
 * );
 * ```
 */
export function TailwindPlugin(
  definition: ComponentDefinition,
  options?: Partial<GenerateTailwindCSSOptions>,
): Promise<ComponentDefinition>;
