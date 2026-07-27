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
 * Any other `defineComponent` option passes through untouched.
 */
export interface ComponentDefinition {
  /** HTML template string */
  template?: string;
  /** CSS styles string */
  css?: string;
  /** Document-level CSS, where generated `@property` rules are appended */
  pageCSS?: string;
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
  /**
   * Sub-template definitions, scanned recursively so classes anywhere in the tree
   * are found. Each value is either a nested definition or the `Template` that
   * `defineComponent` returns when called without a `tagName`.
   */
  subTemplates?: Record<string, ComponentDefinition | object>;
}

/**
 * Options accepted by {@link TailwindPlugin}.
 */
export interface TailwindPluginOptions {
  /** Add vendor prefixes to the generated CSS. Defaults to `true`. */
  autoprefix?: boolean;
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
 * 4. Moves generated `@property` rules into `pageCSS`, where they register at the
 *    document level instead of being ignored inside the shadow root
 * 5. Preserves all other component definition properties
 *
 * The generated CSS is optimized for shadow DOM and includes:
 * - Tailwind utilities for detected classes
 * - Component-specific @theme customizations
 * - Custom @utility definitions
 * - Existing component CSS integrated with Tailwind
 *
 * The input definition is never mutated, and is returned as-is when it has no
 * scannable content or when Tailwind produces no CSS for it.
 *
 * @param definition - The component definition to transform
 * @param options - Plugin options
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
export function TailwindPlugin<T extends ComponentDefinition>(
  definition: T,
  options?: TailwindPluginOptions,
): Promise<T & { css?: string; pageCSS?: string; }>;
