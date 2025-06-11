// Type definitions for @semantic-ui/tailwinds

export interface TailwindPluginConfig {
  /** Tailwind CSS configuration object */
  config?: object;
  /** Whether to include Tailwind's base styles */
  includeBase?: boolean;
  /** Additional class patterns to always include */
  safelist?: string[];
}

export interface ComponentDefinition {
  tagName?: string;
  template?: string;
  css?: string;
  plugins?: Plugin[];
  [key: string]: any;
}

export interface Plugin {
  name?: string;
  beforeCompile?(definition: ComponentDefinition): ComponentDefinition;
  afterTemplateCompile?(ast: any, definition: ComponentDefinition): void;
  beforeStylesApply?(styles: string, definition: ComponentDefinition): string;
  afterComponentCreate?(instance: any, definition: ComponentDefinition): void;
}

/** Main Tailwind plugin instance */
export declare const TailwindPlugin: Plugin;

/** Create a Tailwind configuration for the plugin */
export declare function createTailwindConfig(config?: object): TailwindPluginConfig;

/** Scan component definition for Tailwind classes */
export declare function scanForClasses(definition: ComponentDefinition): string[];
