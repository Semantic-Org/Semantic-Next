/*
  Tests for SpecReader and DocsSpecReader.

  Approach: each test exercises a user-visible contract derived from the
  component-specs skill, API docs, and canonical button.spec.js shapes.
  Test names read like release notes — implementation vocabulary is avoided.

  Inputs are intentionally close to the canonical button spec — what the docs
  show and what real first-party components author.

  Source is NOT consulted as authority. Where a behavior contradicts intent,
  the test arbitrates: failing tests document the bug.
*/

import { describe, expect, it } from 'vitest';

import { DocsSpecReader, SpecReader } from '@semantic-ui/specs';

import {
  addOptionExamples,
  ATTACHED_OPTIONS,
  ATTACHED_VARIATION,
  COLOR_OPTIONS,
  EMPHASIS_TYPE,
  FLUID_VARIATION,
  getStates,
  getVariations,
  modifyVariation,
  SIZE_VARIATION,
} from '@semantic-ui/specs';

/* ------------------------------------------------------------------
   Canonical fixtures — shapes drawn from button.spec.js + skill examples.
   ------------------------------------------------------------------ */

/* Minimal button-shape spec, ~ what the API docs use as the worked example */
const minimalButtonSpec = () => ({
  uiType: 'element',
  name: 'Button',
  tagName: 'ui-button',
  exportName: 'Button',
  description: 'A button indicates a possible user action.',

  types: [
    {
      name: 'Emphasis',
      attribute: 'emphasis',
      description: 'be emphasized in a layout',
      includeAttributeClass: true,
      options: [
        { name: 'Primary', value: 'primary', description: 'be primary' },
        { name: 'Secondary', value: 'secondary', description: 'be secondary' },
      ],
    },
  ],

  variations: [
    {
      name: 'Size',
      attribute: 'size',
      description: 'vary in size',
      options: [
        { name: 'Small', value: 'small' },
        { name: 'Large', value: 'large' },
      ],
    },
  ],

  settings: [
    {
      name: 'Icon Only',
      type: 'boolean',
      attribute: 'icon-only',
      defaultValue: false,
      description: 'remove spacing for text',
    },
    {
      name: 'Href',
      type: 'string',
      attribute: 'href',
      description: 'link to a webpage',
    },
  ],
});

/* The full canonical button spec — replicates button.spec.js without examples */
const buttonShapeSpec = () => ({
  uiType: 'element',
  name: 'Button',
  description: 'A button indicates a possible user action.',
  tagName: 'ui-button',
  exportName: 'Button',
  pluralName: 'Buttons',
  pluralTagName: 'ui-buttons',
  pluralExportName: 'Buttons',
  pluralDescription: 'Buttons can exist together as a group',
  supportsPlural: true,

  content: [
    { name: 'Icon', attribute: 'icon', includeAttributeClass: true, description: 'include an icon' },
    { name: 'Image', attribute: 'image', description: 'include an image' },
  ],

  types: [
    {
      name: 'Emphasis',
      attribute: 'emphasis',
      includeAttributeClass: true,
      description: 'be emphasized in a layout',
      options: [
        { name: 'Primary', value: 'primary' },
        { name: 'Secondary', value: 'secondary' },
      ],
    },
    {
      name: 'Link',
      attribute: 'link',
      description: 'be formatted as a page link',
    },
    {
      name: 'Styled',
      attribute: 'styled',
      includeAttributeClass: true,
      description: 'be styled to fit into a layout',
      options: [
        { name: 'Subtle', value: 'subtle' },
        { name: 'Flat', value: 'flat' },
        { name: 'Outline', value: 'outline' },
        { name: 'Ghost', value: 'ghost' },
      ],
    },
    {
      name: 'Animated',
      attribute: 'animated',
      includeAttributeClass: true,
      compoundAliases: true,
      description: 'animate to show hidden content',
      options: [
        { name: 'Horizontal', value: 'horizontal' },
        { name: 'Vertical', value: 'vertical' },
        { name: 'Fade', value: 'fade' },
      ],
    },
  ],

  states: getStates(['hover', 'disabled', 'loading']),

  variations: [
    ...getVariations(['floated', 'fluid', 'size']),
    modifyVariation(ATTACHED_VARIATION, {
      options: addOptionExamples(ATTACHED_OPTIONS, {}),
    }),
    {
      name: 'Colored',
      attribute: 'color',
      includeAttributeClass: true,
      description: 'be colored',
      options: COLOR_OPTIONS,
    },
    {
      name: 'Positive',
      attribute: 'positive',
      description: 'indicate a positive action',
      options: [
        { name: 'Positive', value: 'positive' },
        { name: 'Subtle Positive', value: 'subtle' },
      ],
    },
    {
      name: 'Negative',
      attribute: 'negative',
      description: 'indicate a negative action',
      options: [
        { name: 'Negative', value: 'negative' },
        { name: 'Subtle Negative', value: 'subtle' },
      ],
    },
  ],

  settings: [
    {
      name: 'Icon Only',
      type: 'boolean',
      attribute: 'icon-only',
      defaultValue: false,
      description: 'remove spacing',
    },
    {
      name: 'Href',
      type: 'string',
      attribute: 'href',
      description: 'link target',
    },
  ],

  events: [
    {
      name: 'Click',
      attribute: 'onclick',
      description: 'when the button is clicked',
    },
  ],

  pluralSharedTypes: ['styled'],
  pluralSharedVariations: ['size', 'floated', 'color'],
  pluralOnlyTypes: [
    { name: 'Vertical', attribute: 'vertical', description: 'be arranged vertically' },
  ],
  pluralOnlyVariations: [
    { name: 'Separate', attribute: 'separate', description: 'have separated items' },
  ],
  examples: {
    defaultPluralContent: '<ui-button>One</ui-button><ui-button>Two</ui-button>',
  },
});

/* ==================================================================
   SpecReader — constructor and basic lookups
   ================================================================== */

describe('SpecReader — construction and tag names', () => {
  it('defaults to the standard HTML dialect', () => {
    const reader = new SpecReader(minimalButtonSpec());
    expect(reader.dialect).toBe('standard');
  });

  it('exposes the three documented dialects on the class', () => {
    expect(SpecReader.DIALECT_TYPES).toEqual({
      standard: 'standard',
      classic: 'classic',
      verbose: 'verbose',
    });
  });

  it('treats undefined input as an empty spec without crashing', () => {
    const reader = new SpecReader(undefined);
    expect(reader.spec).toEqual({});
  });

  it('returns the singular tag name when plural is not requested', () => {
    const reader = new SpecReader(buttonShapeSpec());
    expect(reader.getTagName()).toBe('ui-button');
  });

  it('returns the plural tag name when constructed with plural=true', () => {
    const reader = new SpecReader(buttonShapeSpec(), { plural: true });
    expect(reader.getTagName()).toBe('ui-buttons');
  });

  it('returns the singular export name when plural is not requested', () => {
    const reader = new SpecReader(buttonShapeSpec());
    expect(reader.getComponentName()).toBe('Button');
  });

  it('returns the plural export name when constructed with plural=true', () => {
    const reader = new SpecReader(buttonShapeSpec(), { plural: true });
    expect(reader.getComponentName()).toBe('Buttons');
  });
});

/* ==================================================================
   getWebComponentSpec — the documented contract from the API page.
   These are the load-bearing tests for the entire build pipeline.
   ================================================================== */

describe('SpecReader.getWebComponentSpec — common path', () => {
  it('returns the tag name from the source spec', () => {
    const reader = new SpecReader(minimalButtonSpec());
    expect(reader.getWebComponentSpec().tagName).toBe('ui-button');
  });

  it('collects emphasis and size as attributes', () => {
    const reader = new SpecReader(minimalButtonSpec());
    const componentSpec = reader.getWebComponentSpec();
    expect(componentSpec.attributes).toContain('emphasis');
    expect(componentSpec.attributes).toContain('size');
  });

  it('maps option values to their parent attributes (primary -> emphasis)', () => {
    const reader = new SpecReader(minimalButtonSpec());
    expect(reader.getWebComponentSpec().optionAttributes).toMatchObject({
      primary: 'emphasis',
      secondary: 'emphasis',
      small: 'size',
      large: 'size',
    });
  });

  it('lists allowed values per attribute', () => {
    const reader = new SpecReader(minimalButtonSpec());
    expect(reader.getWebComponentSpec().allowedValues).toMatchObject({
      emphasis: ['primary', 'secondary'],
      size: ['small', 'large'],
    });
  });

  it('treats types and variations with options as string-typed properties', () => {
    const reader = new SpecReader(minimalButtonSpec());
    const { propertyTypes } = reader.getWebComponentSpec();
    expect(propertyTypes.emphasis).toBe('string');
    expect(propertyTypes.size).toBe('string');
  });

  it('records includeAttributeClass attributes for CSS class generation', () => {
    const reader = new SpecReader(minimalButtonSpec());
    expect(reader.getWebComponentSpec().attributeClasses).toContain('emphasis');
  });

  it('uses explicit setting defaultValue when provided', () => {
    const reader = new SpecReader(minimalButtonSpec());
    expect(reader.getWebComponentSpec().defaultValues['icon-only']).toBe(false);
  });

  it('fills in an empty string default for a setting declared as string with no defaultValue', () => {
    const reader = new SpecReader(minimalButtonSpec());
    expect(reader.getWebComponentSpec().defaultValues.href).toBe('');
  });

  it('omits empty arrays and empty objects from the result to reduce filesize', () => {
    /* Spec with NO types and NO variations should not include those keys */
    const reader = new SpecReader({
      name: 'Plain',
      tagName: 'ui-plain',
      settings: [
        { name: 'Label', type: 'string', attribute: 'label' },
      ],
    });
    const componentSpec = reader.getWebComponentSpec();
    expect(componentSpec).not.toHaveProperty('types');
    expect(componentSpec).not.toHaveProperty('variations');
    expect(componentSpec).not.toHaveProperty('states');
  });

  it('caches the result so repeated calls return the same object', () => {
    const reader = new SpecReader(minimalButtonSpec());
    const first = reader.getWebComponentSpec();
    const second = reader.getWebComponentSpec();
    expect(second).toBe(first);
  });
});

/* ==================================================================
   Property types — types/states/variations are boolean by default,
   string when options are provided, or whatever spec.type declares.
   ================================================================== */

describe('SpecReader.getWebComponentSpec — property types', () => {
  it('treats a type with no options as a boolean attribute', () => {
    const spec = {
      name: 'Button',
      tagName: 'ui-button',
      types: [{ name: 'Link', attribute: 'link', description: 'be a link' }],
    };
    const reader = new SpecReader(spec);
    expect(reader.getWebComponentSpec().propertyTypes.link).toBe('boolean');
  });

  it('treats a setting with type:"boolean" as a boolean property', () => {
    const spec = {
      name: 'Button',
      tagName: 'ui-button',
      settings: [
        { name: 'Loud', attribute: 'loud', type: 'boolean', defaultValue: false },
      ],
    };
    const reader = new SpecReader(spec);
    expect(reader.getWebComponentSpec().propertyTypes.loud).toBe('boolean');
  });

  it('treats events as function-typed properties without an HTML attribute', () => {
    /*
      Per the internals skill: "canUseAttribute(Function) === false —
      functions become properties (no HTML attribute)". A click handler is
      a function; it should not appear in the attributes list (that would
      mean Lit registers it as an observed attribute on the element).

      [contradiction] Today the canUseAttribute check compares to the
      constructor `Function`, but the spec carries the string 'function'
      (since withPrototype is false in the build path). The comparison
      never matches, so events end up in `attributes` instead of
      `properties`. This is a real bug — failing test documents it.
    */
    const spec = {
      name: 'Button',
      tagName: 'ui-button',
      events: [{ name: 'Click', attribute: 'onclick', description: 'fires' }],
    };
    const reader = new SpecReader(spec);
    const componentSpec = reader.getWebComponentSpec();
    expect(componentSpec.propertyTypes.onclick).toBe('function');
    expect(componentSpec.attributes || []).not.toContain('onclick');
    expect(componentSpec.properties).toContain('onclick');
  });

  it('uses the property attribute name as the property key (not the type Name)', () => {
    const spec = {
      name: 'Button',
      tagName: 'ui-button',
      types: [{ name: 'Custom Type Name', attribute: 'emphasis' }],
    };
    const reader = new SpecReader(spec);
    expect(reader.getWebComponentSpec().types).toContain('emphasis');
    expect(reader.getWebComponentSpec().types).not.toContain('custom type name');
  });

  it('falls back to the lowercased Name when no attribute is provided', () => {
    const spec = {
      name: 'Button',
      tagName: 'ui-button',
      types: [{ name: 'Loud' }],
    };
    const reader = new SpecReader(spec);
    expect(reader.getWebComponentSpec().types).toContain('loud');
  });

  it('ignores entries that have neither name nor attribute', () => {
    const spec = {
      name: 'Button',
      tagName: 'ui-button',
      types: [{ description: 'orphan with no identifier' }, { name: 'Real', attribute: 'real' }],
    };
    const reader = new SpecReader(spec);
    expect(reader.getWebComponentSpec().types).toEqual(['real']);
  });
});

/* ==================================================================
   Allowed values — flatten, unique, filter(Boolean).
   ================================================================== */

describe('SpecReader.getWebComponentSpec — allowed values', () => {
  it('extracts unique string values from the options array', () => {
    const spec = {
      name: 'Button',
      tagName: 'ui-button',
      types: [{
        name: 'Color',
        attribute: 'color',
        options: [
          { name: 'Red', value: 'red' },
          { name: 'Blue', value: 'blue' },
          { name: 'Red Again', value: 'red' },
        ],
      }],
    };
    const reader = new SpecReader(spec);
    expect(reader.getWebComponentSpec().allowedValues.color).toEqual(['red', 'blue']);
  });

  it('omits the allowedValues entry entirely when an attribute has no options array', () => {
    const spec = {
      name: 'Button',
      tagName: 'ui-button',
      types: [{ name: 'Link', attribute: 'link' }],
    };
    const reader = new SpecReader(spec);
    /* allowedValues was empty {} so filterObject strips it */
    const componentSpec = reader.getWebComponentSpec();
    expect(componentSpec.allowedValues).toBeUndefined();
  });

  it('accepts bare string entries in options (e.g. options: ["red", "blue"])', () => {
    const spec = {
      name: 'Button',
      tagName: 'ui-button',
      types: [{ name: 'Color', attribute: 'color', options: ['red', 'blue'] }],
    };
    const reader = new SpecReader(spec);
    expect(reader.getWebComponentSpec().allowedValues.color).toEqual(['red', 'blue']);
  });
});

/* ==================================================================
   optionAttributes — auto-collision and manual compound aliases.
   The doc + skill assert: colliding values (e.g. "subtle" on positive AND
   negative) generate compound forms. Non-colliding siblings stay bare.
   ================================================================== */

describe('SpecReader.getWebComponentSpec — option attribute collisions', () => {
  it('generates compound forms for values that collide across attributes', () => {
    const reader = new SpecReader(buttonShapeSpec());
    const componentSpec = reader.getWebComponentSpec();
    /* subtle exists in styled, positive, negative — must compound */
    expect(componentSpec.optionAttributes['subtle-positive']).toBe('positive');
    expect(componentSpec.optionAttributes['subtle-negative']).toBe('negative');
    expect(componentSpec.optionAttributes['subtle-styled']).toBe('styled');
  });

  it('removes the bare form when a value collides across three or more attributes', () => {
    /*
      The button spec has 'subtle' shared across styled, positive, warning,
      negative, info. The generated button.component.js shows the bare
      'subtle' entry IS removed — only compound forms remain. The internal
      code comment claims "first owner retains bare entry" but the
      [contradiction] is: subsequent iterations always delete the bare
      entry regardless of first-owner. Documented canonical output (the
      generated button.component.js) wins.
    */
    const reader = new SpecReader(buttonShapeSpec());
    expect(reader.getWebComponentSpec().optionAttributes.subtle).toBeUndefined();
  });

  it('does not produce compound forms for non-colliding sibling values when their attribute has no collision', () => {
    const reader = new SpecReader(minimalButtonSpec());
    /* small/large do not collide → only bare forms */
    expect(reader.getWebComponentSpec().optionAttributes).toMatchObject({
      small: 'size',
      large: 'size',
    });
    expect(reader.getWebComponentSpec().optionAttributes['small-size']).toBeUndefined();
    expect(reader.getWebComponentSpec().optionAttributes['large-size']).toBeUndefined();
  });

  it('generates compound forms for ALL siblings in an attribute that has any colliding value', () => {
    const reader = new SpecReader(buttonShapeSpec());
    const componentSpec = reader.getWebComponentSpec();
    /* attached has "left"/"right" colliding with floated → all siblings get compounds */
    expect(componentSpec.optionAttributes['top-attached']).toBe('attached');
    expect(componentSpec.optionAttributes['bottom-attached']).toBe('attached');
    expect(componentSpec.optionAttributes['left-attached']).toBe('attached');
    expect(componentSpec.optionAttributes['right-attached']).toBe('attached');
  });

  it('skips identity values (where option value equals attribute name) from collision tracking', () => {
    /* In button spec: positive has value 'positive' AND value 'subtle'.
       'positive' is an identity match → not a collision.
       'subtle' IS a collision. */
    const reader = new SpecReader(buttonShapeSpec());
    const componentSpec = reader.getWebComponentSpec();
    /* "positive" remains as a bare entry mapping positive -> positive */
    expect(componentSpec.optionAttributes.positive).toBe('positive');
  });

  it('honors compoundAliases: true by generating value-attribute forms (e.g. fade-animated)', () => {
    const reader = new SpecReader(buttonShapeSpec());
    const componentSpec = reader.getWebComponentSpec();
    expect(componentSpec.optionAttributes['horizontal-animated']).toBe('animated');
    expect(componentSpec.optionAttributes['vertical-animated']).toBe('animated');
    expect(componentSpec.optionAttributes['fade-animated']).toBe('animated');
  });

  it('removes the bare form of a value once compoundAliases promotes it', () => {
    const reader = new SpecReader(buttonShapeSpec());
    const componentSpec = reader.getWebComponentSpec();
    /* horizontal would have mapped to animated bare-form; compoundAliases removes the bare */
    expect(componentSpec.optionAttributes.horizontal).toBeUndefined();
    expect(componentSpec.optionAttributes.fade).toBeUndefined();
  });

  it('honors prefixCompound: true by generating attribute-value forms', () => {
    const spec = {
      name: 'Button',
      tagName: 'ui-button',
      types: [{
        name: 'Direction',
        attribute: 'direction',
        compoundAliases: true,
        prefixCompound: true,
        options: [
          { name: 'Up', value: 'up' },
          { name: 'Down', value: 'down' },
        ],
      }],
    };
    const reader = new SpecReader(spec);
    const componentSpec = reader.getWebComponentSpec();
    expect(componentSpec.optionAttributes['direction-up']).toBe('direction');
    expect(componentSpec.optionAttributes['direction-down']).toBe('direction');
    /* bare entry is removed in favor of the compound */
    expect(componentSpec.optionAttributes.up).toBeUndefined();
  });
});

/* ==================================================================
   Plural mode — pluralShared* gates singular inheritance.
   ================================================================== */

describe('SpecReader.getWebComponentSpec — plural mode', () => {
  it('limits inherited types to those listed in pluralSharedTypes', () => {
    const reader = new SpecReader(buttonShapeSpec(), { plural: true });
    const componentSpec = reader.getWebComponentSpec();
    /* spec sets pluralSharedTypes: ['styled'] */
    expect(componentSpec.types).toContain('styled');
    expect(componentSpec.types).not.toContain('emphasis');
    expect(componentSpec.types).not.toContain('link');
  });

  it('limits inherited variations to those listed in pluralSharedVariations', () => {
    const reader = new SpecReader(buttonShapeSpec(), { plural: true });
    const componentSpec = reader.getWebComponentSpec();
    /* spec sets pluralSharedVariations: ['size', 'floated', 'color'] */
    expect(componentSpec.variations).toContain('size');
    expect(componentSpec.variations).toContain('floated');
    expect(componentSpec.variations).toContain('color');
    expect(componentSpec.variations).not.toContain('fluid');
    expect(componentSpec.variations).not.toContain('positive');
  });

  it('records inheritedPluralVariations on the singular spec for downstream tooling', () => {
    const reader = new SpecReader(buttonShapeSpec());
    /* singular reader still records what plural would have inherited */
    expect(reader.getWebComponentSpec().inheritedPluralVariations).toEqual(
      ['size', 'floated', 'color'],
    );
  });

  it('uses the plural tag name on the plural componentSpec', () => {
    const reader = new SpecReader(buttonShapeSpec(), { plural: true });
    expect(reader.getWebComponentSpec().tagName).toBe('ui-buttons');
  });

  it('includes pluralOnly types and variations in plural mode', () => {
    const reader = new SpecReader(buttonShapeSpec(), { plural: true });
    const componentSpec = reader.getWebComponentSpec();
    expect(componentSpec.types).toContain('vertical');
    expect(componentSpec.variations).toContain('separate');
  });

  it('does not include pluralOnly variations in singular mode', () => {
    const reader = new SpecReader(buttonShapeSpec());
    const componentSpec = reader.getWebComponentSpec();
    expect(componentSpec.variations).not.toContain('separate');
    expect(componentSpec.types).not.toContain('vertical');
  });
});

/* ==================================================================
   Content slots — known potential bug surface (`slots` array unset).
   ================================================================== */

describe('SpecReader.getWebComponentSpec — content slots and attributes', () => {
  it('records content with an attribute on contentAttributes', () => {
    const spec = {
      name: 'Card',
      tagName: 'ui-card',
      content: [
        { name: 'Icon', attribute: 'icon', description: 'include an icon' },
      ],
    };
    const reader = new SpecReader(spec);
    expect(reader.getWebComponentSpec().contentAttributes).toEqual(['icon']);
  });

  it('records a content entry that defines a slot without crashing the builder', () => {
    /*
      The component-specs skill documents content entries that use `slot`
      rather than `attribute`. The implementation calls
      `componentSpec.slots.push(spec.slot)` — but `slots` is never
      initialized on `componentSpec`. This is a real bug that crashes the
      build pipeline for any primitive that uses a slot-only content entry.
    */
    const spec = {
      name: 'Card',
      tagName: 'ui-card',
      content: [
        { name: 'Header', slot: 'header', description: 'header slot' },
      ],
    };
    const reader = new SpecReader(spec);
    expect(() => reader.getWebComponentSpec()).not.toThrow();
  });
});

/* ==================================================================
   Settings default values — type-driven fallback.
   ================================================================== */

describe('SpecReader.getWebComponentSpec — default values', () => {
  it('produces empty-string default for an undeclared string setting', () => {
    const spec = {
      name: 'X',
      tagName: 'ui-x',
      settings: [{ name: 'Label', type: 'string', attribute: 'label' }],
    };
    expect(new SpecReader(spec).getWebComponentSpec().defaultValues.label).toBe('');
  });

  it('produces false default for an undeclared boolean setting', () => {
    const spec = {
      name: 'X',
      tagName: 'ui-x',
      settings: [{ name: 'Loud', type: 'boolean', attribute: 'loud' }],
    };
    expect(new SpecReader(spec).getWebComponentSpec().defaultValues.loud).toBe(false);
  });

  it('produces empty-array default for an undeclared array setting', () => {
    const spec = {
      name: 'X',
      tagName: 'ui-x',
      settings: [{ name: 'Items', type: 'array', attribute: 'items' }],
    };
    expect(new SpecReader(spec).getWebComponentSpec().defaultValues.items).toEqual([]);
  });

  it('respects an explicit non-default defaultValue', () => {
    const spec = {
      name: 'X',
      tagName: 'ui-x',
      settings: [{ name: 'Count', type: 'number', attribute: 'count', defaultValue: 42 }],
    };
    expect(new SpecReader(spec).getWebComponentSpec().defaultValues.count).toBe(42);
  });

  it('does not generate a default for non-settings entries with no defaultValue', () => {
    const spec = {
      name: 'X',
      tagName: 'ui-x',
      types: [{ name: 'Link', attribute: 'link' }],
    };
    const componentSpec = new SpecReader(spec).getWebComponentSpec();
    /* boolean types/variations should NOT auto-populate defaultValues */
    expect(componentSpec.defaultValues?.link).toBeUndefined();
  });
});

/* ==================================================================
   DocsSpecReader — formatDescription
   ================================================================== */

describe('DocsSpecReader.formatDescription', () => {
  it('prepends an article matching consonant-initial component names', () => {
    const reader = new DocsSpecReader({ name: 'Button' });
    expect(reader.formatDescription('be primary')).toBe('A button can be primary.');
  });

  it('prepends "An" for vowel-initial component names', () => {
    const reader = new DocsSpecReader({ name: 'Icon' });
    expect(reader.formatDescription('be small')).toBe('An icon can be small.');
  });

  it('uses the plural component name when plural is requested', () => {
    const reader = new DocsSpecReader({
      name: 'Button',
      pluralName: 'Buttons',
    }, { plural: true });
    expect(reader.formatDescription('be grouped')).toBe('Buttons can be grouped.');
  });

  it('does not add a trailing period if the description already ends with one', () => {
    const reader = new DocsSpecReader({ name: 'Button' });
    expect(reader.formatDescription('be primary.')).toBe('A button can be primary.');
  });

  it('returns an empty string when no description is provided', () => {
    const reader = new DocsSpecReader({ name: 'Button' });
    expect(reader.formatDescription('')).toBe('');
    expect(reader.formatDescription(undefined)).toBe('');
  });
});

/* ==================================================================
   DocsSpecReader — getOrderedParts
   ================================================================== */

describe('DocsSpecReader.getOrderedParts', () => {
  it('orders singular sections as types, content, states, variations, settings', () => {
    const reader = new DocsSpecReader(buttonShapeSpec());
    expect(reader.getOrderedParts()).toEqual(
      ['types', 'content', 'states', 'variations', 'settings'],
    );
  });

  it('orders plural sections as types, content, variations (no states or settings)', () => {
    const reader = new DocsSpecReader(buttonShapeSpec(), { plural: true });
    expect(reader.getOrderedParts({ plural: true })).toEqual(
      ['types', 'content', 'variations'],
    );
  });
});

/* ==================================================================
   DocsSpecReader — getCodeFromModifiers (worked example from API docs)
   ================================================================== */

describe('DocsSpecReader.getCodeFromModifiers — standard dialect', () => {
  it('wraps the rendered HTML in the singular tag', () => {
    const reader = new DocsSpecReader(buttonShapeSpec());
    const html = reader.getCodeFromModifiers('primary large', { html: 'Save' });
    expect(html).toBe('<ui-button primary large>Save</ui-button>');
  });

  it('wraps the rendered HTML in the plural tag when plural=true is passed', () => {
    const reader = new DocsSpecReader(buttonShapeSpec());
    const html = reader.getCodeFromModifiers('small', {
      html: '<ui-button>One</ui-button>',
      plural: true,
    });
    expect(html).toBe('<ui-buttons small><ui-button>One</ui-button></ui-buttons>');
  });

  it('returns the bare tag with no extra space when modifiers are empty', () => {
    const reader = new DocsSpecReader(buttonShapeSpec());
    expect(reader.getCodeFromModifiers('', { html: 'Save' })).toBe('<ui-button>Save</ui-button>');
  });

  it('falls back to the title-cased modifier as text when no html or text is supplied', () => {
    const reader = new DocsSpecReader(buttonShapeSpec());
    expect(reader.getCodeFromModifiers('primary')).toBe('<ui-button primary>Primary</ui-button>');
  });
});

describe('DocsSpecReader.getCodeFromModifiers — verbose dialect', () => {
  it('expands modifiers into explicit attribute="value" pairs', () => {
    const reader = new DocsSpecReader(buttonShapeSpec(), { dialect: 'verbose' });
    const html = reader.getCodeFromModifiers('primary large', { html: 'Save' });
    /* Expect emphasis="primary" and size="large" in the output (order is
       implementation-defined within the modifiers map) */
    expect(html).toContain('emphasis="primary"');
    expect(html).toContain('size="large"');
    expect(html.startsWith('<ui-button')).toBe(true);
    expect(html.endsWith('>Save</ui-button>')).toBe(true);
  });
});

describe('DocsSpecReader.getCodeFromModifiers — classic dialect', () => {
  it('emits modifiers via class="..."', () => {
    const reader = new DocsSpecReader(buttonShapeSpec(), { dialect: 'classic' });
    const html = reader.getCodeFromModifiers('primary large', { html: 'Save' });
    expect(html).toBe('<ui-button class="primary large">Save</ui-button>');
  });
});

/* ==================================================================
   DocsSpecReader — getAttributesFromModifiers
   ================================================================== */

describe('DocsSpecReader.getAttributesFromModifiers', () => {
  it('maps known modifiers back to their parent attribute', () => {
    const reader = new DocsSpecReader(buttonShapeSpec());
    expect(reader.getAttributesFromModifiers('primary large')).toEqual({
      emphasis: 'primary',
      size: 'large',
    });
  });

  it('treats unknown modifiers as boolean attributes (value: true)', () => {
    const reader = new DocsSpecReader(buttonShapeSpec());
    expect(reader.getAttributesFromModifiers('fluid')).toEqual({ fluid: true });
  });
});

/* ==================================================================
   DocsSpecReader — getConciseModifier
   ================================================================== */

describe('DocsSpecReader.getConciseModifier', () => {
  it('returns the bare value when no collision compound exists', () => {
    const reader = new DocsSpecReader(buttonShapeSpec());
    expect(reader.getConciseModifier('size', 'large')).toBe('large');
  });

  it('returns the compound form when the bare value does not point to this attribute', () => {
    const reader = new DocsSpecReader(buttonShapeSpec());
    /* subtle is owned by styled — for positive, we should get subtle-positive */
    expect(reader.getConciseModifier('positive', 'subtle')).toBe('subtle-positive');
  });
});

/* ==================================================================
   DocsSpecReader — getDefinition contract
   ================================================================== */

describe('DocsSpecReader.getDefinition — singular', () => {
  it('returns the documented section keys', () => {
    const reader = new DocsSpecReader(minimalButtonSpec());
    const definition = reader.getDefinition();
    expect(definition).toHaveProperty('content');
    expect(definition).toHaveProperty('types');
    expect(definition).toHaveProperty('states');
    expect(definition).toHaveProperty('variations');
    expect(definition).toHaveProperty('settings');
  });

  it('puts the component title at the top of the types array (showCode false)', () => {
    const reader = new DocsSpecReader(minimalButtonSpec());
    const types = reader.getDefinition().types;
    expect(types[0].title).toBe('Button');
    expect(types[0].examples[0].showCode).toBe(false);
  });

  it('includes the emphasis type after the title entry', () => {
    const reader = new DocsSpecReader(minimalButtonSpec());
    const titles = reader.getDefinition().types.map(t => t.title);
    expect(titles).toEqual(expect.arrayContaining(['Emphasis']));
  });

  it('formats each part description with article + component name', () => {
    const reader = new DocsSpecReader(minimalButtonSpec());
    const types = reader.getDefinition().types;
    const emphasisEntry = types.find(t => t.title === 'Emphasis');
    expect(emphasisEntry.description.startsWith('A button can ')).toBe(true);
  });
});

describe('DocsSpecReader.getDefinition — plural', () => {
  it('places pluralOnly types before shared types in the types array', () => {
    const reader = new DocsSpecReader(buttonShapeSpec(), { plural: true });
    const titles = reader.getDefinition().types.map(t => t.title);
    /* First entry is the component title; pluralOnly Vertical should come
       before shared Styled */
    const verticalIndex = titles.indexOf('Vertical');
    const styledIndex = titles.indexOf('Styled');
    expect(verticalIndex).toBeGreaterThan(-1);
    expect(styledIndex).toBeGreaterThan(-1);
    expect(verticalIndex).toBeLessThan(styledIndex);
  });

  it('places pluralOnly variations before shared variations', () => {
    const reader = new DocsSpecReader(buttonShapeSpec(), { plural: true });
    const titles = reader.getDefinition().variations.map(v => v.title);
    const separateIndex = titles.indexOf('Separate');
    const sizeIndex = titles.indexOf('Size');
    expect(separateIndex).toBeGreaterThan(-1);
    expect(sizeIndex).toBeGreaterThan(-1);
    expect(separateIndex).toBeLessThan(sizeIndex);
  });

  it('does not include shared variations that are not listed in pluralSharedVariations', () => {
    const reader = new DocsSpecReader(buttonShapeSpec(), { plural: true });
    const variations = reader.getDefinition().variations.map(v => v.title);
    expect(variations).not.toContain('Fluid');
    expect(variations).not.toContain('Positive');
    expect(variations).not.toContain('Negative');
  });
});

/* ==================================================================
   DocsSpecReader — getDefinitionMenu
   ================================================================== */

describe('DocsSpecReader.getDefinitionMenu', () => {
  it('returns one menu section per non-empty ordered part', () => {
    const reader = new DocsSpecReader(minimalButtonSpec());
    const menu = reader.getDefinitionMenu();
    const titles = menu.map(m => m.title);
    /* expected non-empty sections: Types (component title + emphasis), Variations, Settings */
    expect(titles).toEqual(expect.arrayContaining(['Types', 'Variations', 'Settings']));
  });

  it('skips menu sections that are empty', () => {
    const reader = new DocsSpecReader(minimalButtonSpec());
    const menu = reader.getDefinitionMenu();
    /* Minimal spec has no states/content → those should not appear */
    expect(menu.find(m => m.title === 'States')).toBeUndefined();
    expect(menu.find(m => m.title === 'Content')).toBeUndefined();
  });

  it('tokenizes the menu item id with the default -example suffix', () => {
    const reader = new DocsSpecReader(minimalButtonSpec());
    const menu = reader.getDefinitionMenu();
    const types = menu.find(m => m.title === 'Types');
    const button = types.items.find(item => item.title === 'Button');
    expect(button.id).toBe('button-example');
  });

  it('honors a custom IDSuffix', () => {
    const reader = new DocsSpecReader(minimalButtonSpec());
    const menu = reader.getDefinitionMenu({ IDSuffix: '-section' });
    const types = menu.find(m => m.title === 'Types');
    const button = types.items.find(item => item.title === 'Button');
    expect(button.id).toBe('button-section');
  });
});

/* ==================================================================
   DocsSpecReader — getComponentTree (HTML → node tree)
   ================================================================== */

describe('DocsSpecReader.getComponentTree', () => {
  const reader = new DocsSpecReader(buttonShapeSpec());

  it('returns an empty array for empty input', () => {
    expect(reader.getComponentTree('')).toEqual([]);
    expect(reader.getComponentTree(null)).toEqual([]);
    expect(reader.getComponentTree(undefined)).toEqual([]);
  });

  it('returns a single html node when there are no custom elements', () => {
    const tree = reader.getComponentTree('<div>Hello</div>');
    expect(tree).toEqual([{ type: 'html', html: '<div>Hello</div>' }]);
  });

  it('identifies a custom element by its hyphenated tag name', () => {
    const tree = reader.getComponentTree('<ui-button primary>Save</ui-button>');
    expect(tree).toHaveLength(1);
    expect(tree[0]).toMatchObject({
      type: 'component',
      componentName: 'ui-button',
    });
  });

  it('parses attributes on a component node', () => {
    const tree = reader.getComponentTree('<ui-button primary icon="search">Search</ui-button>');
    expect(tree[0].attributes).toMatchObject({
      primary: true,
      icon: 'search',
    });
  });

  it('recursively trees nested custom elements', () => {
    const html = '<ui-buttons><ui-button>One</ui-button><ui-button>Two</ui-button></ui-buttons>';
    const tree = reader.getComponentTree(html);
    expect(tree[0].componentName).toBe('ui-buttons');
    expect(tree[0].children).toHaveLength(2);
    expect(tree[0].children[0].componentName).toBe('ui-button');
    expect(tree[0].children[1].componentName).toBe('ui-button');
  });

  it('classifies a wrapper element (no custom elements inside) as html', () => {
    /* div with only text - no nested components - is a plain html node */
    const tree = reader.getComponentTree('<div class="row">Just text</div>');
    expect(tree[0].type).toBe('html');
  });

  it('classifies a non-custom wrapper containing a custom element as a wrapper', () => {
    const tree = reader.getComponentTree('<div><ui-button>Save</ui-button></div>');
    expect(tree[0].type).toBe('wrapper');
    expect(tree[0].tag).toBe('div');
    expect(tree[0].children[0].componentName).toBe('ui-button');
  });

  it('handles void elements without searching for closing tags', () => {
    const tree = reader.getComponentTree('<img src="x.jpg" /><ui-button>OK</ui-button>');
    expect(tree).toHaveLength(2);
    expect(tree[1].componentName).toBe('ui-button');
  });

  it('treats multiple top-level custom elements as siblings', () => {
    const html = '<ui-button>One</ui-button><ui-button>Two</ui-button>';
    const tree = reader.getComponentTree(html);
    expect(tree).toHaveLength(2);
    expect(tree[0].componentName).toBe('ui-button');
    expect(tree[1].componentName).toBe('ui-button');
  });
});

/* ==================================================================
   DocsSpecReader — parseAttributeString
   ================================================================== */

describe('DocsSpecReader.parseAttributeString', () => {
  const reader = new DocsSpecReader(buttonShapeSpec());

  it('returns an empty object for empty input', () => {
    expect(reader.parseAttributeString('')).toEqual({});
    expect(reader.parseAttributeString(undefined)).toEqual({});
  });

  it('parses quoted values', () => {
    expect(reader.parseAttributeString('icon="search" badge="5"')).toEqual({
      icon: 'search',
      badge: '5',
    });
  });

  it('parses single-quoted values', () => {
    expect(reader.parseAttributeString("icon='search'")).toEqual({ icon: 'search' });
  });

  it('parses bare boolean attributes as true', () => {
    expect(reader.parseAttributeString('primary disabled')).toEqual({
      primary: true,
      disabled: true,
    });
  });

  it('parses a mix of boolean and value-bearing attributes', () => {
    expect(reader.parseAttributeString('primary icon="search" disabled')).toEqual({
      primary: true,
      icon: 'search',
      disabled: true,
    });
  });
});
