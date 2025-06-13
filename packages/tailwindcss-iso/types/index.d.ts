import type { Config } from 'tailwindcss';

interface ComponentDefinition {
  name?: string;
  template?: string;
  css?: string;
  subTemplates?: Record<string, Omit<ComponentDefinition, 'name'>>;
  [key: string]: any;
}

interface GenerateTailwindCSSOptions {
  /**
   * A string containing the HTML or JavaScript content to be scanned for Tailwind classes.
   */
  content: string;
  /**
   * Optional. Existing CSS string to be prepended to the generated Tailwind CSS.
   */
  css?: string;
  /**
   * Optional. A custom Tailwind CSS configuration object.
   */
  config?: Config;
}

/**
 * Compiles a string of content to generate Tailwind CSS.
 * This is the primary export and works in both Node.js and browser environments.
 *
 * @param options - The options for generating Tailwind CSS.
 * @returns A promise that resolves to the compiled CSS string.
 */
export function generateTailwindCSS(options: GenerateTailwindCSSOptions): Promise<string>;

/**
 * A plugin for integrating Tailwind CSS with Semantic UI component definitions.
 * It scans a component definition for Tailwind classes and injects the generated
 * CSS into the definition.
 *
 * @param config - Optional. A custom Tailwind CSS configuration object.
 * @returns An asynchronous function that transforms a Semantic UI component definition.
 */
export function TailwindPlugin(config?: Config): (definition: ComponentDefinition) => Promise<ComponentDefinition>;

/**
 * A utility function that recursively collects all content and CSS
 * from a Semantic UI component definition into a single object.
 *
 * @param definition - The Semantic UI component definition.
 * @returns An object containing the combined HTML, JS, and CSS content.
 */
export function collectContent(definition: ComponentDefinition): {
  html: string;
  js: string;
  css: string;
  content: string;
};
