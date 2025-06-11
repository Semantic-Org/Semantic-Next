// Type definitions for @semantic-ui/tailwind

export interface ComponentDefinition {
  template?: string;
  css?: string;
  createComponent?: Function;
  onCreated?: Function;
  onRendered?: Function;
  onDestroyed?: Function;
  onThemeChanged?: Function;
  onAttributeChanged?: Function;
  events?: Record<string, Function>;
  keys?: Record<string, Function>;
  subTemplates?: Record<string, {
    template?: string;
    css?: string;
  }>;
  [key: string]: any;
}

export interface ContentCollection {
  html: string;
  js: string;
  css: string;
  content: string;
}

export interface GenerateTailwindOptions {
  content: string;
  css?: string;
  tailwindCSS?: string;
  config?: object;
}

/** Transform component definition with Tailwind CSS */
export declare function TailwindPlugin(
  config?: object,
): (definition: ComponentDefinition) => Promise<ComponentDefinition>;

/** Generate Tailwind CSS from component content */
export declare function generateTailwindCSS(options: GenerateTailwindOptions): Promise<string>;

/** Extract content from component definition for Tailwind scanning */
export declare function collectContent(definition: ComponentDefinition): ContentCollection;
