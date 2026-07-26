import type { StringScanner } from '@semantic-ui/compiler';

// --- Spec Data Shapes ---

/** A single allowed value for an attribute. */
export type SpecOptionValue = string | number | boolean;

/**
 * An entry in an `options` array. Full option objects carry documentation
 * metadata. A bare string is shorthand for a value with no metadata.
 */
export type SpecOptionEntry = SpecOption | string;

/** Property type identifiers recognised by the spec reader. */
export type SpecPropertyType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function';

/** Constructor forms returned when a property type is read `withPrototype`. */
export type SpecPropertyConstructor =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | ObjectConstructor
  | ArrayConstructor
  | FunctionConstructor;

/** Parsed HTML attributes. Boolean attributes carry `true`. */
export type SpecAttributes = Record<string, string | true>;

/**
 * An option within a variation, type, or content definition.
 * Represents a single allowed value like "primary", "small", or "red".
 */
export interface SpecOption {
  /** Display name (e.g. "Primary", "Small") */
  name: string;
  /** Attribute value (e.g. "primary", "small") */
  value: SpecOptionValue | SpecOptionValue[];
  /** Human-readable description for documentation */
  description?: string;
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
  /** HTML attribute name (e.g. "size", "color"). Defaults to the lowercased name */
  attribute?: string;
  /** Human-readable description */
  description: string;
  /** Relative importance for documentation ordering (lower = more common) */
  usageLevel?: number;
  /** Enumerated values this variation accepts */
  options?: SpecOptionEntry[];
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
  type?: SpecPropertyType;
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
  /** HTML attribute name (e.g. "active", "disabled"). Defaults to the lowercased name */
  attribute?: string;
  /** Human-readable description */
  description: string;
  /** Relative importance for documentation ordering */
  usageLevel?: number;
  /** Enumerated values (rare for states) */
  options?: SpecOptionEntry[];
  /** Include the attribute name itself as a CSS class */
  includeAttributeClass?: boolean;
  /** Opt-in to compound alias generation (e.g. "clickable-disabled") */
  compoundAliases?: boolean;
  /** Use attribute-value order for compounds instead of value-attribute */
  prefixCompound?: boolean;
  /** Render each option as a separate example block */
  separateExamples?: boolean;
  /** Custom example code */
  exampleCode?: string | string[];
  /** Example code used only in singular context */
  singularExampleCode?: string | string[];
  /** Example code used only in plural context */
  pluralExampleCode?: string | string[];
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
  /** Explicit property type override (content defaults to string) */
  type?: SpecPropertyType;
  /** Include attribute name as a CSS class */
  includeAttributeClass?: boolean;
  /** Components this content couples with */
  couplesWith?: string[];
  /** Tag name of the child component this content renders */
  tagName?: string;
  /** Marks the entry as a child component of this component ('true') */
  subcomponent?: string;
  /** Render each option as a separate example block */
  separateExamples?: boolean;
  /** Custom example code */
  exampleCode?: string | string[];
  /** Example code used only in singular context */
  singularExampleCode?: string | string[];
  /** Example code used only in plural context */
  pluralExampleCode?: string | string[];
  /** Enumerated values */
  options?: SpecOptionEntry[];
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
  type?: SpecPropertyType;
  /** Default value */
  defaultValue?: any;
  /** Human-readable description */
  description: string;
  /** Relative importance */
  usageLevel?: number;
  /** Enumerated allowed values */
  options?: SpecOptionEntry[];
  /** Custom example code */
  exampleCode?: string | string[];
}

/**
 * An argument carried by a custom event, documented in the events table.
 */
export interface SpecEventArgument {
  /** Argument name */
  name: string;
  /** Human-readable description */
  description?: string;
}

/**
 * A spec event defines a custom event the component dispatches.
 * Events documented with `eventName` describe dispatched DOM events. Events
 * documented with `name` or `attribute` also become function-typed properties.
 */
export interface SpecEvent {
  /** Dispatched event name (e.g. "change") */
  eventName?: string;
  /** Display name */
  name?: string;
  /** Property name */
  attribute?: string;
  /** Human-readable description */
  description: string;
  /** Arguments passed to the handler */
  arguments?: SpecEventArgument[];
}

/** Any entry in a spec section. */
export type SpecPart = SpecContent | SpecVariation | SpecState | SpecSetting | SpecEvent;

/** Sections of a spec, in the order documentation renders them. */
export type SpecPartName = 'types' | 'content' | 'states' | 'variations' | 'settings';

/**
 * CDN combo endpoint preset a component belongs to. Tiers are cumulative,
 * so standard components ship in extended and full as well.
 */
export type SpecBundleTier = 'standard' | 'extended' | 'full';

/**
 * Example configuration for documentation.
 */
export interface SpecExamples {
  /** Default inner HTML for singular examples */
  defaultContent?: string;
  /** Default inner HTML for plural examples */
  defaultPluralContent?: string;
  /** Default attributes applied to all examples */
  defaultAttributes?: Record<string, string | boolean>;
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
  /** Lowest CDN preset tier this component ships in */
  bundle?: SpecBundleTier;
  /** Tag name of the component this one must be nested inside */
  parentTag?: string;

  /** Example configuration */
  examples?: SpecExamples;
  /** Custom example code for the component itself */
  exampleCode?: string | string[];
  /** Component example code used only in singular context */
  singularExampleCode?: string | string[];
  /** Component example code used only in plural context */
  pluralExampleCode?: string | string[];

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

  /** Content entries documented on the plural form */
  pluralContent?: SpecContent[];
  /** Content entries only available in plural form */
  pluralOnlyContent?: SpecContent[];
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
  /** Variations read by {@link SpecReader.getPluralWebComponentSpec} */
  pluralVariations?: Array<SpecVariation | string>;

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
 * fast attribute lookup and minimal filesize. Empty arrays and objects
 * are stripped from the result, so every entry is optional.
 * @internal
 */
export interface WebComponentSpec {
  tagName?: string;
  content?: string[];
  contentAttributes?: string[];
  slots?: string[];
  types?: string[];
  variations?: string[];
  states?: string[];
  events?: string[];
  settings?: string[];
  properties?: string[];
  attributes?: string[];
  optionAttributes?: Record<string, string>;
  propertyTypes?: Record<string, SpecPropertyType>;
  allowedValues?: Record<string, SpecOptionValue[]>;
  attributeClasses?: string[];
  defaultValues?: Record<string, any>;
  inheritedPluralVariations?: string[];
}

// --- Definition Output ---

/**
 * A single code example with its parsed component tree.
 */
export interface SpecCodeExample {
  code: string;
  showCode?: boolean;
  components: SpecTreeNode[];
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
 * The full definition returned by DocsSpecReader.getDefinition().
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
  attributes?: SpecAttributes;
  attributeString?: string;
  html?: string;
}

/**
 * A node in the tree produced by DocsSpecReader.getComponentTree(),
 * used to render nested web components on the server.
 */
export type SpecTreeNode =
  | {
    type: 'component';
    componentName: string;
    attributes: SpecAttributes;
    attributeString: string;
    children: SpecTreeNode[];
  }
  | {
    type: 'wrapper';
    tag: string;
    attributeString: string;
    children: SpecTreeNode[];
  }
  | {
    type: 'html';
    html: string;
  };

/**
 * A top-level segment of an HTML string, before it becomes a tree node.
 * @internal
 */
export type SpecHTMLSegment =
  | {
    type: 'element';
    tag: string;
    attributeString: string;
    innerHTML: string;
    raw: string;
  }
  | {
    type: 'text';
    content: string;
  };

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

/** Settings shared by the code-generating methods on DocsSpecReader. */
export interface SpecCodeSettings {
  /** 'html' uses the tag name, anything else uses the export name */
  lang?: string;
  plural?: boolean;
  /** Text used to derive default content when no html is given */
  text?: string;
  /** Inner HTML of the generated example */
  html?: string;
  dialect?: DialectType;
}

/**
 * Reads a component spec and produces the reduced web component spec
 * consumed by defineComponent.
 * @see {@link https://next.semantic-ui.com/docs/api/specs/spec-reader SpecReader API Reference}
 * @see {@link https://next.semantic-ui.com/docs/guides/components/specs Spec Documentation}
 */
export class SpecReader {
  static DEFAULT_DIALECT: DialectType;
  static DIALECT_TYPES: Record<DialectType, DialectType>;

  constructor(spec?: ComponentSpec, options?: SpecReaderOptions);

  spec: ComponentSpec;
  plural: boolean;
  dialect: DialectType;
  /** Cached result of the last getWebComponentSpec call @internal */
  componentSpec: WebComponentSpec | null;

  /** Returns the export name for the plural or singular form */
  getComponentName(options?: { plural?: boolean; lang?: string; }): string | undefined;
  /** Returns the tag name for the plural or singular form */
  getTagName(options?: { plural?: boolean; lang?: string; }): string | undefined;

  /**
   * Builds the reduced spec consumed by defineComponent. The result is cached
   * on the instance, so repeated calls return the same object.
   * @see {@link https://next.semantic-ui.com/docs/api/specs/spec-reader#getwebcomponentspec getWebComponentSpec}
   */
  getWebComponentSpec(spec?: ComponentSpec, options?: { plural?: boolean; }): WebComponentSpec;
  /** Builds the reduced spec for a plural component, including pluralVariations */
  getPluralWebComponentSpec(spec?: ComponentSpec): WebComponentSpec;

  /** Returns the attribute name for a spec part, or undefined for function-typed parts */
  getAttributeName(specPart: SpecPart, type?: SpecPropertyType | SpecPropertyConstructor): string | undefined;
  /** Returns the property name for a spec part, its attribute or its lowercased name */
  getPropertyName(specPart: SpecPart): string | undefined;

  /** Returns the native constructor for a spec part's property type */
  getPropertyType(options: {
    spec?: SpecPart;
    section?: string;
    allowedValues?: SpecOptionValue[];
    withPrototype: true;
  }): SpecPropertyConstructor | undefined;
  /**
   * Returns the string identifier for a spec part's property type.
   * Types, states, and variations default to boolean, content to string,
   * and events to function.
   */
  getPropertyType(options?: {
    spec?: SpecPart;
    section?: string;
    allowedValues?: SpecOptionValue[];
    withPrototype?: false;
  }): SpecPropertyType | undefined;

  /** Returns the flattened, unique option values for a spec part */
  getAllowedValues(spec: SpecPart): SpecOptionValue[] | undefined;
  /** Returns the explicit defaultValue, or the type's zero value for settings */
  getDefaultValue(spec: SpecPart, type?: SpecPropertyType, section?: string): any;
  /** False for function types, which become properties rather than attributes */
  canUseAttribute(type?: SpecPropertyType | SpecPropertyConstructor): boolean;

  /**
   * Fills in optionAttributes on a component spec, the reverse lookup from
   * option value to attribute name, including compound forms.
   * @internal
   */
  buildOptionAttributes(options: { componentSpec: WebComponentSpec; spec?: ComponentSpec; }): void;

  /**
   * Writes the generated component spec to disk. Available on the Node entry
   * point only. The browser build ships the reader without file system access.
   */
  writeComponentSpec(path: string, options?: { plural?: boolean; banner?: string; }): void;
}

/**
 * Extends SpecReader with the documentation pipeline: definitions, code
 * examples, dialect rendering, and component trees for server rendering.
 * @see {@link https://next.semantic-ui.com/docs/guides/components/specs Spec Documentation}
 */
export class DocsSpecReader extends SpecReader {
  /** HTML elements that never have a closing tag */
  static VOID_ELEMENTS: Set<string>;

  /** Formats a part description as a sentence ("A button can be primary.") */
  formatDescription(description?: string, options?: { plural?: boolean; }): string;

  /** Returns every documented section with rendered code examples */
  getDefinition(options?: {
    plural?: boolean;
    minUsageLevel?: number;
    dialect?: DialectType;
  }): SpecDefinition;

  /** Returns the section order used when rendering a definition */
  getOrderedParts(options?: { plural?: boolean; }): SpecPartName[];

  /** Returns definition entries grouped by section, in display order */
  getOrderedExamples(options?: {
    plural?: boolean;
    minUsageLevel?: number;
    dialect?: DialectType;
  }): Array<{ title: string; examples: SpecDefinitionEntry[]; }>;

  /** Returns an in-page menu built from the non-empty definition sections */
  getDefinitionMenu(options?: {
    IDSuffix?: string;
    plural?: boolean;
    minUsageLevel?: number;
  }): SpecMenuSection[];

  /** Splits an HTML string into its top-level component strings */
  splitTopLevelComponents(html: string): string[];

  /**
   * Parses the outermost component from an HTML string, keeping inner content
   * as `html`. Returns an array when the string holds multiple root components.
   */
  getComponentPartsFromHTML(html: string, options?: {
    dialect?: DialectType;
    multiple?: boolean;
  }): ComponentParts | ComponentParts[];

  /** Parses a single component HTML string into its parts */
  parseSingleComponent(html: string, options?: { dialect?: DialectType; }): ComponentParts;

  /** Returns the example code for a part, preferring the plural or singular form */
  getExampleCode(
    part: {
      exampleCode?: string | string[];
      singularExampleCode?: string | string[];
      pluralExampleCode?: string | string[];
    },
    isPlural?: boolean,
  ): string | string[] | undefined;

  /** Builds the documentation entry for a single spec part */
  getCodeExamples(part: SpecPart, options?: {
    defaultAttributes?: Record<string, string | boolean>;
    defaultContent?: string;
    isPlural?: boolean;
  }): SpecDefinitionEntry;

  /** Builds the component parts for a set of modifiers (e.g. "primary large") */
  getComponentParts(modifiers: string, settings?: SpecCodeSettings): ComponentParts;

  /** Returns the example HTML for a set of modifiers */
  getCodeFromModifiers(modifiers: string, settings?: SpecCodeSettings): string;

  /** Maps modifiers back to their parent attributes, so "primary" becomes emphasis */
  getAttributesFromModifiers(modifiers?: string): SpecAttributes;

  /** Renders one attribute, collapsing boolean and identity values to a bare name */
  getSingleAttributeString(attribute: string, value: string | boolean, options?: {
    joinWith?: string;
    quoteCharacter?: string;
  }): string;

  /** Renders an attribute object in the reader's dialect */
  getAttributeString(attributes: Record<string, string | boolean>, options?: {
    dialect?: DialectType;
    joinWith?: string;
    quoteCharacter?: string;
  }): string | undefined;

  /** Renders a modifier string in the reader's dialect, leading space included */
  getAttributeStringFromModifiers(modifiers: string, options?: {
    dialect?: DialectType;
    attributes?: Record<string, string | boolean>;
    joinWith?: string;
    quoteCharacter?: string;
  }): string;

  /** Returns the compound form of a value when the bare form is ambiguous */
  getConciseModifier(attribute: string, value: string): string;

  /** Custom elements are the tags with a hyphen */
  isComponentTag(tag: string): boolean;
  /** True when an HTML string contains any custom element */
  containsComponentTag(html: string): boolean;

  /** Scans one opening tag, leaving the scanner past its closing bracket @internal */
  scanOpeningTag(scanner: StringScanner): { tag: string; attributeString: string; selfClosing: boolean; };
  /** Advances the scanner to the matching closing tag, tracking nesting @internal */
  scanToClosingTag(scanner: StringScanner, tag: string): void;
  /** Splits an HTML string into top-level element and text segments @internal */
  segmentHTML(html: string): SpecHTMLSegment[];
  /** Converts one segment into a tree node @internal */
  parseSegmentToNode(segment: SpecHTMLSegment): SpecTreeNode;

  /** Parses an HTML attribute string, treating bare attributes as `true` */
  parseAttributeString(attributeString?: string): SpecAttributes;

  /** Parses an HTML string into a tree of component, wrapper, and html nodes */
  getComponentTree(html?: string): SpecTreeNode[];
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

/** Icon libraries a canonical name can map onto. */
export type IconLibrary = 'lucide' | 'phosphor' | 'tabler' | 'materialSymbols' | 'heroicons';

/**
 * A canonical icon and its equivalent in each supported icon library.
 * A library entry is null when that library has no equivalent icon.
 * The index signature keeps library lookup by variable key working, since
 * the set of libraries grows over time.
 */
export interface IconMapping {
  /** Category used to group the icon in documentation */
  category: string;
  /** Alternate names that resolve to this icon */
  aliases: string[];
  /** What the icon means */
  description: string;
  /** What the icon looks like */
  visual: string;
  /** Where the icon is typically used */
  usage: string;
  lucide: string | null;
  phosphor: string | null;
  tabler: string | null;
  materialSymbols: string | null;
  heroicons: string | null;
  [library: string]: string | string[] | null;
}

/** Cross-library icon mappings, keyed by canonical icon name */
export const iconMappings: Record<string, IconMapping>;
/** Canonical icon names, derived from the mapping keys */
export const ICON_NAMES: string[];
/** Category display order */
export const ICON_CATEGORIES: string[];
/** Every valid icon value, canonical names plus aliases, for use in spec options */
export const ICON_OPTIONS: string[];

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
export function filterVariationOptions<T extends { options?: SpecOptionEntry[]; }>(
  variation: T,
  filter: SpecOptionValue[] | ((option: SpecOption) => boolean),
): T;

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
