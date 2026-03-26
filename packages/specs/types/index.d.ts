// --- Spec Data Shapes ---

/**
 * An option within a variation, type, or content definition.
 * Represents a single allowed value like "primary", "small", or "red".
 */
export interface SpecOption {
  /** Display name (e.g. "Primary", "Small") */
  name: string;
  /** Attribute value (e.g. "primary", "small") */
  value: string | string[];
  /** Human-readable description for documentation */
  description: string;
  /** Custom HTML example code for documentation */
  exampleCode?: string | string[];
  /** Example code used only in singular context */
  singularExampleCode?: string | string[];
  /** Example code used only in plural context */
  pluralExampleCode?: string | string[];
}

/**
 * A spec variation defines a visual modification axis for a component
 * (e.g. size, color, attached). Variations with options produce enumerated
 * attribute values; variations without options are boolean attributes.
 */
export interface SpecVariation {
  /** Display name (e.g. "Size", "Colored") */
  name: string;
  /** HTML attribute name (e.g. "size", "color") */
  attribute: string;
  /** Human-readable description */
  description: string;
  /** Relative importance for documentation ordering (lower = more common) */
  usageLevel?: number;
  /** Enumerated values this variation accepts */
  options?: SpecOption[];
  /** Include the attribute name itself as a CSS class */
  includeAttributeClass?: boolean;
  /** Render each option as a separate example block */
  separateExamples?: boolean;
  /** Opt-in to compound alias generation (e.g. "vertical-animated") */
  compoundAliases?: boolean;
  /** Use attribute-value order for compounds instead of value-attribute */
  prefixCompound?: boolean;
  /** Custom example code for the entire variation */
  exampleCode?: string | string[];
  /** Example code used only in singular context */
  singularExampleCode?: string | string[];
  /** Example code used only in plural context */
  pluralExampleCode?: string | string[];
  /** Explicit property type override */
  type?: string;
  /** Default value for this variation */
  defaultValue?: any;
}

/**
 * A spec type defines a visual category for a component (e.g. emphasis, styled).
 * Structurally identical to SpecVariation — the distinction is semantic
 * (types define what a component IS, variations define how it LOOKS).
 */
export type SpecType = SpecVariation;

/**
 * A spec state defines an interactive state (e.g. active, disabled, hover).
 * States without options are boolean attributes.
 */
export interface SpecState {
  /** Display name (e.g. "Active", "Disabled") */
  name: string;
  /** HTML attribute name (e.g. "active", "disabled") */
  attribute: string;
  /** Human-readable description */
  description: string;
  /** Relative importance for documentation ordering */
  usageLevel?: number;
  /** Enumerated values (rare for states) */
  options?: SpecOption[];
  /** Custom example code */
  exampleCode?: string | string[];
}

/**
 * A spec content entry defines named content slots or attributes
 * (e.g. icon, image, badge).
 */
export interface SpecContent {
  /** Display name (e.g. "Icon", "Badge") */
  name: string;
  /** HTML attribute name */
  attribute?: string;
  /** Named slot */
  slot?: string;
  /** Human-readable description */
  description: string;
  /** Relative importance */
  usageLevel?: number;
  /** Include attribute name as a CSS class */
  includeAttributeClass?: boolean;
  /** Components this content couples with */
  couplesWith?: string[];
  /** Render each option as a separate example block */
  separateExamples?: boolean;
  /** Custom example code */
  exampleCode?: string | string[];
  /** Enumerated values */
  options?: SpecOption[];
}

/**
 * A spec setting defines a programmatic property
 * (e.g. href, icon-only).
 */
export interface SpecSetting {
  /** Display name */
  name: string;
  /** HTML attribute name */
  attribute?: string;
  /** Property type as a string identifier */
  type?: string;
  /** Default value */
  defaultValue?: any;
  /** Human-readable description */
  description: string;
  /** Relative importance */
  usageLevel?: number;
  /** Enumerated allowed values */
  options?: SpecOption[];
  /** Custom example code */
  exampleCode?: string | string[];
}

/**
 * A spec event defines a callback setting (always typed as function).
 */
export interface SpecEvent {
  /** Display name */
  name: string;
  /** Property name */
  attribute?: string;
  /** Human-readable description */
  description: string;
}

/**
 * Example configuration for documentation.
 */
export interface SpecExamples {
  /** Default inner HTML for singular examples */
  defaultContent?: string;
  /** Default inner HTML for plural examples */
  defaultPluralContent?: string;
  /** Default attributes applied to all examples */
  defaultAttributes?: Record<string, string>;
}

/**
 * The full component spec — the schema that drives runtime behavior,
 * CSS architecture, and auto-generated documentation for primitives.
 * @see {@link https://next.semantic-ui.com/docs/guides/components/specs Spec Documentation}
 */
export interface ComponentSpec {
  /** UI category (e.g. "element", "collection", "module") */
  uiType?: string;
  /** Display name (e.g. "Button") */
  name: string;
  /** Component description */
  description?: string;
  /** Custom element tag name (e.g. "ui-button") */
  tagName: string;
  /** JavaScript export name (e.g. "Button") */
  exportName?: string;

  /** Example configuration */
  examples?: SpecExamples;

  /** Named content slots and attributes */
  content?: SpecContent[];
  /** Visual type categories */
  types?: SpecType[];
  /** Interactive states */
  states?: SpecState[];
  /** Visual modifications */
  variations?: SpecVariation[];
  /** Programmatic settings */
  settings?: SpecSetting[];
  /** Event callbacks */
  events?: SpecEvent[];

  // --- Plural (group) support ---

  /** Whether this component supports a plural/group form */
  supportsPlural?: boolean;
  /** Display name for plural form */
  pluralName?: string;
  /** Tag name for plural form */
  pluralTagName?: string;
  /** Export name for plural form */
  pluralExportName?: string;
  /** Description for plural form */
  pluralDescription?: string;

  /** Content entries only available in plural form */
  pluralContent?: SpecContent[];
  /** Types only available in plural form */
  pluralOnlyTypes?: SpecType[];
  /** Variations only available in plural form */
  pluralOnlyVariations?: SpecVariation[];
  /** Settings only available in plural form */
  pluralOnlySettings?: SpecSetting[];
  /** States only available in plural form */
  pluralOnlyStates?: SpecState[];
  /** Events only available in plural form */
  pluralOnlyEvents?: SpecEvent[];

  /** Which singular types are shared with plural form (by attribute name) */
  pluralSharedTypes?: string[];
  /** Which singular variations are shared with plural form */
  pluralSharedVariations?: string[];
  /** Which singular states are shared with plural form */
  pluralSharedStates?: string[];
  /** Which singular content entries are shared with plural form */
  pluralSharedContent?: string[];
  /** Which singular settings are shared with plural form */
  pluralSharedSettings?: string[];
  /** Which singular events are shared with plural form */
  pluralSharedEvents?: string[];
}

// --- Compiled Web Component Spec ---

/**
 * The reduced spec format consumed by defineComponent at runtime.
 * Produced by SpecReader.getWebComponentSpec() — optimized for
 * fast attribute lookup and minimal filesize.
 * @internal
 */
export interface WebComponentSpec {
  tagName: string;
  content: string[];
  contentAttributes: string[];
  types: string[];
  variations: string[];
  states: string[];
  events: string[];
  settings: string[];
  properties: string[];
  attributes: string[];
  optionAttributes: Record<string, string>;
  propertyTypes: Record<string, string>;
  allowedValues: Record<string, (string | number | boolean)[]>;
  attributeClasses: string[];
  defaultValues: Record<string, any>;
  inheritedPluralVariations: string[];
}

// --- Definition Output ---

/**
 * A single code example with parsed component parts.
 */
export interface SpecCodeExample {
  code: string;
  showCode?: boolean;
  components: ComponentParts[];
}

/**
 * A definition section entry (type, state, variation, etc.)
 * with title, description, and rendered code examples.
 */
export interface SpecDefinitionEntry {
  title: string;
  description: string;
  examples: SpecCodeExample[];
}

/**
 * The full definition returned by SpecReader.getDefinition().
 */
export interface SpecDefinition {
  content: SpecDefinitionEntry[];
  types: SpecDefinitionEntry[];
  states: SpecDefinitionEntry[];
  variations: SpecDefinitionEntry[];
  settings: SpecDefinitionEntry[];
}

/**
 * A menu section for in-page navigation.
 */
export interface SpecMenuItem {
  id: string;
  title: string;
}

export interface SpecMenuSection {
  title: string;
  items: SpecMenuItem[];
}

/**
 * Parsed component parts from an HTML string.
 */
export interface ComponentParts {
  componentName?: string;
  attributes?: Record<string, string | boolean>;
  attributeString?: string;
  html: string;
}

// --- SpecReader ---

export type DialectType = 'standard' | 'classic' | 'verbose';

export type StateName = 'hover' | 'focus' | 'active' | 'loading' | 'pressed' | 'disabled';

export type VariationName =
  | 'size'
  | 'fluid'
  | 'compact'
  | 'padded'
  | 'colored'
  | 'floated'
  | 'attached'
  | 'horizontal-aligned'
  | 'vertical-aligned'
  | 'circular';

export interface SpecReaderOptions {
  plural?: boolean;
  dialect?: DialectType;
}

/**
 * Reads a component spec and generates definitions, code examples,
 * web component specs, and menu structures for documentation.
 * @see {@link https://next.semantic-ui.com/docs/guides/components/specs Spec Documentation}
 */
export class SpecReader {
  static DEFAULT_DIALECT: DialectType;
  static DIALECT_TYPES: Record<DialectType, DialectType>;

  constructor(spec: ComponentSpec, options?: SpecReaderOptions);

  spec: ComponentSpec;
  plural: boolean;
  dialect: DialectType;

  formatDescription(description: string, options?: { plural?: boolean; }): string;

  getComponentName(options?: { plural?: boolean; lang?: string; }): string;
  getTagName(options?: { plural?: boolean; lang?: string; }): string;

  getDefinition(options?: {
    plural?: boolean;
    minUsageLevel?: number;
    dialect?: DialectType;
  }): SpecDefinition;

  getOrderedParts(options?: { plural?: boolean; }): string[];

  getOrderedExamples(options?: {
    plural?: boolean;
    minUsageLevel?: number;
    dialect?: DialectType;
  }): Array<{ title: string; examples: SpecDefinitionEntry[]; }>;

  getDefinitionMenu(options?: {
    IDSuffix?: string;
    plural?: boolean;
    minUsageLevel?: number;
  }): SpecMenuSection[];

  getWebComponentSpec(spec?: ComponentSpec, options?: { plural?: boolean; }): WebComponentSpec;
  getPluralWebComponentSpec(spec?: ComponentSpec): WebComponentSpec;

  getComponentPartsFromHTML(html: string, options?: {
    dialect?: DialectType;
    multiple?: boolean;
  }): ComponentParts | ComponentParts[];

  getAttributesFromModifiers(modifiers?: string): Record<string, string | boolean>;

  getAttributeString(attributes: Record<string, string | boolean>, options?: {
    dialect?: DialectType;
    joinWith?: string;
    quoteCharacter?: string;
  }): string;

  getAttributeStringFromModifiers(modifiers: string, options?: {
    dialect?: DialectType;
    attributes?: Record<string, string | boolean>;
    joinWith?: string;
    quoteCharacter?: string;
  }): string;

  getCodeFromModifiers(modifiers: string, settings?: {
    lang?: string;
    plural?: boolean;
    text?: string;
    html?: string;
    dialect?: DialectType;
  }): string;

  getComponentParts(modifiers: string, settings?: {
    lang?: string;
    plural?: boolean;
    text?: string;
    html?: string;
    dialect?: DialectType;
  }): ComponentParts;
}

// --- Shared Constants ---

// States
export const ACTIVE_STATE: SpecState;
export const DISABLED_STATE: SpecState;
export const FOCUS_STATE: SpecState;
export const HOVER_STATE: SpecState;
export const LOADING_STATE: SpecState;
export const PRESSED_STATE: SpecState;

// Types
export const EMPHASIS_OPTIONS: SpecOption[];
export const EMPHASIS_TYPE: SpecType;

// Variations
export const ATTACHED_OPTIONS: SpecOption[];
export const ATTACHED_VARIATION: SpecVariation;
export const CIRCULAR_VARIATION: SpecVariation;
export const COLOR_OPTIONS: SpecOption[];
export const COLORED_VARIATION: SpecVariation;
export const COMPACT_OPTIONS: SpecOption[];
export const COMPACT_VARIATION: SpecVariation;
export const FLOATED_OPTIONS: SpecOption[];
export const FLOATED_VARIATION: SpecVariation;
export const FLUID_VARIATION: SpecVariation;
export const HORIZONTAL_ALIGNED_OPTIONS: SpecOption[];
export const HORIZONTAL_ALIGNED_VARIATION: SpecVariation;
export const PADDED_OPTIONS: SpecOption[];
export const PADDED_VARIATION: SpecVariation;
export const SIZE_OPTIONS: SpecOption[];
export const SIZE_VARIATION: SpecVariation;
export const SPACING_OPTIONS: SpecOption[];
export const SPACING_VARIATION: SpecVariation;
export const VERTICAL_ALIGNED_OPTIONS: SpecOption[];
export const VERTICAL_ALIGNED_VARIATION: SpecVariation;

// Icons
export const iconMappings: Record<string, Record<string, string>>;
export const ICON_NAMES: string[];
export const ICON_CATEGORIES: string[];

// --- Helper Functions ---

/**
 * Replace or add exampleCode on shared options for component-specific documentation.
 */
export function addOptionExamples(
  options: SpecOption[],
  customExamples?: Record<string, string | string[]>,
): SpecOption[];

/**
 * Filter a variation's options by an array of allowed values or a predicate function.
 */
export function filterVariationOptions(
  variation: SpecVariation,
  filter: string[] | ((option: SpecOption) => boolean),
): SpecVariation;

/**
 * Look up shared state constants by name.
 */
export function getStates(stateNames: StateName[]): SpecState[];

/**
 * Look up shared variation constants by name.
 */
export function getVariations(variationNames: VariationName[]): SpecVariation[];

/**
 * Set the usageLevel on a variation, type, or state.
 */
export function withUsageLevel<T extends { usageLevel?: number; }>(
  item: T,
  usageLevel: number,
): T;

/**
 * Shallow-merge overrides onto a variation, type, or state.
 */
export function modifyVariation<T>(item: T, overrides: Partial<T>): T;
