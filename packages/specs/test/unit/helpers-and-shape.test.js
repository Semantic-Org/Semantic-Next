import { describe, expect, it } from 'vitest';

import {
  // states
  ACTIVE_STATE,
  // helpers
  addOptionExamples,
  // variations
  ATTACHED_OPTIONS,
  ATTACHED_VARIATION,
  CIRCULAR_VARIATION,
  COLOR_OPTIONS,
  COLORED_VARIATION,
  COMPACT_OPTIONS,
  COMPACT_VARIATION,
  DISABLED_STATE,
  // types
  EMPHASIS_OPTIONS,
  EMPHASIS_TYPE,
  filterVariationOptions,
  FLOATED_OPTIONS,
  FLOATED_VARIATION,
  FLUID_VARIATION,
  FOCUS_STATE,
  getStates,
  getVariations,
  HORIZONTAL_ALIGNED_OPTIONS,
  HORIZONTAL_ALIGNED_VARIATION,
  HOVER_STATE,
  LOADING_STATE,
  modifyVariation,
  PADDED_OPTIONS,
  PADDED_VARIATION,
  PRESSED_STATE,
  SIZE_OPTIONS,
  SIZE_VARIATION,
  SPACING_OPTIONS,
  SPACING_VARIATION,
  // entry-point SpecReader (server flavor — extends base with FS helpers)
  SpecReader,
  VERTICAL_ALIGNED_OPTIONS,
  VERTICAL_ALIGNED_VARIATION,
  withUsageLevel,
} from '@semantic-ui/specs';

// Also verify the browser entry point works — use relative imports
// because the package "exports" map only exposes the top-level "." path.
import * as browserEntry from '../../src/browser.js';
import * as serverEntry from '../../src/server.js';

/*******************************
        Shared State Shape
*******************************/

describe('shared states have the shape the docs promise', () => {
  it('exposes a name string on every shared state constant', () => {
    for (const state of [HOVER_STATE, FOCUS_STATE, ACTIVE_STATE, LOADING_STATE, PRESSED_STATE, DISABLED_STATE]) {
      expect(typeof state.name).toBe('string');
      expect(state.name.length).toBeGreaterThan(0);
    }
  });

  it('exposes a kebab-friendly attribute on every shared state constant', () => {
    for (const state of [HOVER_STATE, FOCUS_STATE, ACTIVE_STATE, LOADING_STATE, PRESSED_STATE, DISABLED_STATE]) {
      expect(typeof state.attribute).toBe('string');
      // Attribute should match the HTML attribute convention (lowercase, hyphen ok)
      expect(state.attribute).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it('exposes a description on every shared state constant', () => {
    for (const state of [HOVER_STATE, FOCUS_STATE, ACTIVE_STATE, LOADING_STATE, PRESSED_STATE, DISABLED_STATE]) {
      expect(typeof state.description).toBe('string');
    }
  });

  it('disabled state advertises compound aliases for clickable-disabled', () => {
    expect(DISABLED_STATE.compoundAliases).toBe(true);
    expect(DISABLED_STATE.includeAttributeClass).toBe(true);
    expect(DISABLED_STATE.options.map(o => o.value)).toEqual(['disabled', 'clickable']);
  });
});

/*******************************
       Shared Type Shape
*******************************/

describe('shared types have the shape the docs promise', () => {
  it('emphasis type exposes name attribute description options', () => {
    expect(EMPHASIS_TYPE.name).toBe('Emphasis');
    expect(EMPHASIS_TYPE.attribute).toBe('emphasis');
    expect(typeof EMPHASIS_TYPE.description).toBe('string');
    expect(EMPHASIS_TYPE.includeAttributeClass).toBe(true);
    expect(Array.isArray(EMPHASIS_TYPE.options)).toBe(true);
  });

  it('emphasis options enumerate primary secondary tertiary', () => {
    expect(EMPHASIS_OPTIONS.map(o => o.value)).toEqual(['primary', 'secondary', 'tertiary']);
  });

  it('each emphasis option has name value description', () => {
    for (const opt of EMPHASIS_OPTIONS) {
      expect(typeof opt.name).toBe('string');
      expect(typeof opt.value).toBe('string');
      expect(typeof opt.description).toBe('string');
    }
  });
});

/*******************************
     Shared Variation Shape
*******************************/

describe('shared variations have the shape the docs promise', () => {
  const variations = [
    SIZE_VARIATION,
    FLUID_VARIATION,
    COMPACT_VARIATION,
    PADDED_VARIATION,
    COLORED_VARIATION,
    FLOATED_VARIATION,
    ATTACHED_VARIATION,
    HORIZONTAL_ALIGNED_VARIATION,
    VERTICAL_ALIGNED_VARIATION,
    CIRCULAR_VARIATION,
    SPACING_VARIATION,
  ];

  it('every shared variation exposes a name', () => {
    for (const v of variations) {
      expect(typeof v.name).toBe('string');
    }
  });

  it('every shared variation exposes an attribute name', () => {
    for (const v of variations) {
      expect(typeof v.attribute).toBe('string');
      expect(v.attribute).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it('size variation enumerates the canonical size scale', () => {
    expect(SIZE_OPTIONS.map(o => o.value)).toEqual([
      'mini',
      'tiny',
      'small',
      'medium',
      'large',
      'big',
      'huge',
      'massive',
    ]);
  });

  it('color variation enumerates the canonical color palette', () => {
    expect(COLOR_OPTIONS.map(o => o.value)).toEqual([
      'red',
      'orange',
      'yellow',
      'olive',
      'green',
      'teal',
      'blue',
      'violet',
      'purple',
      'pink',
      'brown',
      'grey',
      'slate',
    ]);
  });

  it('floated variation enumerates left and right', () => {
    expect(FLOATED_OPTIONS.map(o => o.value)).toEqual(['left', 'right']);
  });

  it('attached variation enumerates the five attachment positions', () => {
    // The skill doc names them with "-attached" suffix; source uses bare values.
    expect(ATTACHED_OPTIONS.map(o => o.value)).toEqual([
      'top',
      'attached',
      'bottom',
      'left',
      'right',
    ]);
  });

  it('compact variation enumerates compact and very', () => {
    expect(COMPACT_OPTIONS.map(o => o.value)).toEqual(['compact', 'very']);
    expect(COMPACT_VARIATION.compoundAliases).toBe(true);
  });

  it('padded variation enumerates padded and very', () => {
    expect(PADDED_OPTIONS.map(o => o.value)).toEqual(['padded', 'very']);
  });

  it('horizontal aligned variation uses text-align attribute', () => {
    expect(HORIZONTAL_ALIGNED_VARIATION.attribute).toBe('text-align');
    expect(HORIZONTAL_ALIGNED_OPTIONS.map(o => o.value)).toEqual([
      'left-aligned',
      'center-aligned',
      'right-aligned',
    ]);
  });

  it('vertical aligned variation uses vertical-align attribute', () => {
    expect(VERTICAL_ALIGNED_VARIATION.attribute).toBe('vertical-align');
    expect(VERTICAL_ALIGNED_OPTIONS.map(o => o.value)).toEqual([
      'top-aligned',
      'middle-aligned',
      'bottom-aligned',
    ]);
  });

  it('size variation has no compoundAliases, fluid has no options', () => {
    // FLUID_VARIATION is boolean-style — no options array
    expect(FLUID_VARIATION.options).toBeUndefined();
    expect(CIRCULAR_VARIATION.options).toBeUndefined();
  });
});

/*******************************
          getStates
*******************************/

describe('getStates returns the requested shared state constants', () => {
  it('returns the matching state objects in the order requested', () => {
    const result = getStates(['hover', 'disabled']);
    expect(result).toEqual([HOVER_STATE, DISABLED_STATE]);
  });

  it('returns all six shared states when asked for all', () => {
    const result = getStates(['hover', 'focus', 'active', 'loading', 'pressed', 'disabled']);
    expect(result).toEqual([
      HOVER_STATE,
      FOCUS_STATE,
      ACTIVE_STATE,
      LOADING_STATE,
      PRESSED_STATE,
      DISABLED_STATE,
    ]);
  });

  it('silently drops names that are not registered states', () => {
    // filter(Boolean) — unknown names map to undefined and are dropped
    const result = getStates(['hover', 'nonexistent', 'disabled']);
    expect(result).toEqual([HOVER_STATE, DISABLED_STATE]);
  });

  it('returns an empty array when called with an empty list', () => {
    expect(getStates([])).toEqual([]);
  });

  it('returns an empty array when no requested names are registered', () => {
    expect(getStates(['bogus', 'fake'])).toEqual([]);
  });
});

/*******************************
        getVariations
*******************************/

describe('getVariations returns the requested shared variation constants', () => {
  it('returns variations in the order requested', () => {
    const result = getVariations(['size', 'fluid']);
    expect(result).toEqual([SIZE_VARIATION, FLUID_VARIATION]);
  });

  it('accepts horizontal-aligned and vertical-aligned by their hyphenated key', () => {
    // keys are 'horizontal-aligned' and 'vertical-aligned'
    const result = getVariations(['horizontal-aligned', 'vertical-aligned']);
    expect(result).toEqual([HORIZONTAL_ALIGNED_VARIATION, VERTICAL_ALIGNED_VARIATION]);
  });

  it('drops names that are not registered variations', () => {
    const result = getVariations(['size', 'unknown', 'fluid']);
    expect(result).toEqual([SIZE_VARIATION, FLUID_VARIATION]);
  });

  it('returns an empty array when called with an empty list', () => {
    expect(getVariations([])).toEqual([]);
  });

  it('does not include spacing variation in the named map', () => {
    // SPACING_VARIATION is exported but absent from getVariations map — must be imported by constant if needed.
    const result = getVariations(['spacing']);
    expect(result).toEqual([]);
  });
});

/*******************************
       addOptionExamples
*******************************/

describe('addOptionExamples decorates options with per-value example code', () => {
  const baseOptions = [
    { name: 'Small', value: 'small' },
    { name: 'Large', value: 'large' },
  ];

  it('adds exampleCode to the option whose value matches', () => {
    const result = addOptionExamples(baseOptions, {
      small: '<ui-foo small></ui-foo>',
      large: '<ui-foo large></ui-foo>',
    });
    expect(result[0].exampleCode).toBe('<ui-foo small></ui-foo>');
    expect(result[1].exampleCode).toBe('<ui-foo large></ui-foo>');
  });

  it('preserves the name and value of each option', () => {
    const result = addOptionExamples(baseOptions, { small: 'x' });
    expect(result[0].name).toBe('Small');
    expect(result[0].value).toBe('small');
  });

  it('returns a new array — does not mutate the input', () => {
    const result = addOptionExamples(baseOptions, { small: 'x' });
    expect(result).not.toBe(baseOptions);
    expect(baseOptions[0]).not.toHaveProperty('exampleCode');
  });

  it('falls back to the original exampleCode when no override is provided', () => {
    const optionsWithDefault = [
      { name: 'Small', value: 'small', exampleCode: 'default' },
      { name: 'Large', value: 'large', exampleCode: 'other-default' },
    ];
    const result = addOptionExamples(optionsWithDefault, { small: 'overridden' });
    expect(result[0].exampleCode).toBe('overridden');
    expect(result[1].exampleCode).toBe('other-default');
  });

  it('accepts an omitted customExamples argument', () => {
    // customExamples = {} default
    const optionsWithDefault = [
      { name: 'Small', value: 'small', exampleCode: 'kept' },
    ];
    const result = addOptionExamples(optionsWithDefault);
    expect(result[0].exampleCode).toBe('kept');
  });
});

/*******************************
     filterVariationOptions
*******************************/

describe('filterVariationOptions narrows a variation to a subset', () => {
  it('filters by array of values', () => {
    const result = filterVariationOptions(SIZE_VARIATION, ['small', 'medium', 'large']);
    expect(result.options.map(o => o.value)).toEqual(['small', 'medium', 'large']);
  });

  it('filters by predicate function', () => {
    const result = filterVariationOptions(SIZE_VARIATION, opt => opt.value !== 'massive');
    expect(result.options.map(o => o.value)).not.toContain('massive');
    expect(result.options.length).toBe(SIZE_OPTIONS.length - 1);
  });

  it('preserves variation metadata (name attribute description usageLevel)', () => {
    const result = filterVariationOptions(SIZE_VARIATION, ['small']);
    expect(result.name).toBe(SIZE_VARIATION.name);
    expect(result.attribute).toBe(SIZE_VARIATION.attribute);
    expect(result.description).toBe(SIZE_VARIATION.description);
    expect(result.usageLevel).toBe(SIZE_VARIATION.usageLevel);
  });

  it('returns a new variation object — does not mutate input', () => {
    const before = SIZE_VARIATION.options.length;
    filterVariationOptions(SIZE_VARIATION, ['small']);
    expect(SIZE_VARIATION.options.length).toBe(before);
  });

  it('returns empty options when no values match', () => {
    const result = filterVariationOptions(SIZE_VARIATION, ['nonexistent']);
    expect(result.options).toEqual([]);
  });
});

/*******************************
        modifyVariation
*******************************/

describe('modifyVariation shallow-merges overrides', () => {
  it('overrides a single property', () => {
    const result = modifyVariation(ATTACHED_VARIATION, { usageLevel: 3 });
    expect(result.usageLevel).toBe(3);
    expect(result.name).toBe(ATTACHED_VARIATION.name);
    expect(result.attribute).toBe(ATTACHED_VARIATION.attribute);
  });

  it('does not mutate the source variation', () => {
    const before = ATTACHED_VARIATION.usageLevel;
    modifyVariation(ATTACHED_VARIATION, { usageLevel: 99 });
    expect(ATTACHED_VARIATION.usageLevel).toBe(before);
  });

  it('replaces options when given', () => {
    // shallow merge — overrides take precedence
    const newOptions = [{ name: 'A', value: 'a' }];
    const result = modifyVariation(SIZE_VARIATION, { options: newOptions });
    expect(result.options).toBe(newOptions);
  });

  it('adds a new property that did not exist on the original', () => {
    const result = modifyVariation(FLUID_VARIATION, { compoundAliases: true });
    expect(result.compoundAliases).toBe(true);
    // original unchanged
    expect(FLUID_VARIATION.compoundAliases).toBeUndefined();
  });
});

/*******************************
       withUsageLevel
*******************************/

describe('withUsageLevel overrides only the usageLevel field', () => {
  it('returns a new object with the new usageLevel', () => {
    const result = withUsageLevel(FLUID_VARIATION, 2);
    expect(result.usageLevel).toBe(2);
  });

  it('preserves the rest of the variation', () => {
    const result = withUsageLevel(FLUID_VARIATION, 3);
    expect(result.name).toBe(FLUID_VARIATION.name);
    expect(result.attribute).toBe(FLUID_VARIATION.attribute);
    expect(result.description).toBe(FLUID_VARIATION.description);
  });

  it('does not mutate the source', () => {
    const before = FLUID_VARIATION.usageLevel;
    withUsageLevel(FLUID_VARIATION, 99);
    expect(FLUID_VARIATION.usageLevel).toBe(before);
  });

  it('works on state constants too', () => {
    const result = withUsageLevel(HOVER_STATE, 5);
    expect(result.usageLevel).toBe(5);
    expect(result.name).toBe(HOVER_STATE.name);
  });
});

/*******************************
      SpecReader contract
*******************************/

describe('SpecReader constructor', () => {
  it('accepts a spec object and stores it', () => {
    const spec = { name: 'Foo', tagName: 'ui-foo' };
    const reader = new SpecReader(spec);
    expect(reader.spec).toBe(spec);
  });

  it('defaults plural to false', () => {
    const reader = new SpecReader({});
    expect(reader.plural).toBe(false);
  });

  it('defaults dialect to standard', () => {
    const reader = new SpecReader({});
    expect(reader.dialect).toBe('standard');
  });

  it('accepts plural option', () => {
    const reader = new SpecReader({}, { plural: true });
    expect(reader.plural).toBe(true);
  });

  it('accepts verbose dialect option', () => {
    const reader = new SpecReader({}, { dialect: 'verbose' });
    expect(reader.dialect).toBe('verbose');
  });

  it('defaults spec to empty object when not provided', () => {
    // this.spec = spec || {}
    const reader = new SpecReader();
    expect(reader.spec).toEqual({});
  });
});

describe('SpecReader.getTagName and getComponentName', () => {
  const spec = {
    name: 'Button',
    tagName: 'ui-button',
    exportName: 'Button',
    pluralTagName: 'ui-buttons',
    pluralExportName: 'Buttons',
  };

  it('returns the singular tag name by default', () => {
    const reader = new SpecReader(spec);
    expect(reader.getTagName()).toBe('ui-button');
  });

  it('returns the plural tag name when plural is true', () => {
    const reader = new SpecReader(spec, { plural: true });
    expect(reader.getTagName()).toBe('ui-buttons');
  });

  it('returns the singular export name by default', () => {
    const reader = new SpecReader(spec);
    expect(reader.getComponentName()).toBe('Button');
  });

  it('returns the plural export name when plural is true', () => {
    const reader = new SpecReader(spec, { plural: true });
    expect(reader.getComponentName()).toBe('Buttons');
  });
});

describe('SpecReader.getWebComponentSpec output shape', () => {
  const widgetSpec = {
    name: 'Widget',
    tagName: 'ui-widget',
    types: [EMPHASIS_TYPE],
    variations: [SIZE_VARIATION],
    states: getStates(['disabled']),
    settings: [
      { name: 'Icon Only', type: 'boolean', attribute: 'icon-only', defaultValue: false },
    ],
  };

  it('includes the tag name from the spec', () => {
    const reader = new SpecReader(widgetSpec);
    const out = reader.getWebComponentSpec();
    expect(out.tagName).toBe('ui-widget');
  });

  it('lists every attribute name', () => {
    const reader = new SpecReader(widgetSpec);
    const out = reader.getWebComponentSpec();
    expect(out.attributes).toEqual(expect.arrayContaining(['emphasis', 'size', 'disabled', 'icon-only']));
  });

  it('maps every option value back to its attribute via optionAttributes', () => {
    const reader = new SpecReader(widgetSpec);
    const out = reader.getWebComponentSpec();
    expect(out.optionAttributes.primary).toBe('emphasis');
    expect(out.optionAttributes.secondary).toBe('emphasis');
    expect(out.optionAttributes.tertiary).toBe('emphasis');
    expect(out.optionAttributes.small).toBe('size');
    expect(out.optionAttributes.massive).toBe('size');
  });

  it('records the allowed values per attribute', () => {
    const reader = new SpecReader(widgetSpec);
    const out = reader.getWebComponentSpec();
    expect(out.allowedValues.emphasis).toEqual(['primary', 'secondary', 'tertiary']);
    expect(out.allowedValues.size).toEqual([
      'mini',
      'tiny',
      'small',
      'medium',
      'large',
      'big',
      'huge',
      'massive',
    ]);
  });

  it('records the propertyType for each attribute', () => {
    // enum attrs derive string from options, settings honor declared type
    const reader = new SpecReader(widgetSpec);
    const out = reader.getWebComponentSpec();
    expect(out.propertyTypes.emphasis).toBe('string');
    expect(out.propertyTypes.size).toBe('string');
    expect(out.propertyTypes['icon-only']).toBe('boolean');
  });

  it('lists attributes with includeAttributeClass under attributeClasses', () => {
    const reader = new SpecReader(widgetSpec);
    const out = reader.getWebComponentSpec();
    expect(out.attributeClasses).toContain('emphasis');
    expect(out.attributeClasses).toContain('disabled');
  });

  it('captures default values for declared settings', () => {
    const reader = new SpecReader(widgetSpec);
    const out = reader.getWebComponentSpec();
    expect(out.defaultValues['icon-only']).toBe(false);
  });

  it('caches the result between calls (returns the same reference)', () => {
    // cached on this.componentSpec
    const reader = new SpecReader(widgetSpec);
    const first = reader.getWebComponentSpec();
    const second = reader.getWebComponentSpec();
    expect(first).toBe(second);
  });

  it('returns the same shape when called on an empty spec', () => {
    const reader = new SpecReader({});
    const out = reader.getWebComponentSpec();
    expect(out).toBeDefined();
    // filterObject strips empty arrays — tagName is undefined → may be filtered
    // but call should not throw
    expect(typeof out).toBe('object');
  });

  it('strips empty arrays from the output to reduce payload', () => {
    // filterObject removes isEmpty entries
    const minimal = { tagName: 'ui-bare' };
    const reader = new SpecReader(minimal);
    const out = reader.getWebComponentSpec();
    expect(out.types).toBeUndefined();
    expect(out.variations).toBeUndefined();
    expect(out.states).toBeUndefined();
    expect(out.settings).toBeUndefined();
    // tagName remains because it is not empty
    expect(out.tagName).toBe('ui-bare');
  });
});

describe('SpecReader optionAttributes compound forms', () => {
  it('generates compound forms when two attributes share an option value', () => {
    // 'left' and 'right' both appear in floated and attached
    const spec = {
      tagName: 'ui-collide',
      variations: [FLOATED_VARIATION, ATTACHED_VARIATION],
    };
    const reader = new SpecReader(spec);
    const out = reader.getWebComponentSpec();
    // compound form `${value}-${attr}` is generated
    expect(out.optionAttributes['left-floated']).toBe('floated');
    expect(out.optionAttributes['right-floated']).toBe('floated');
    expect(out.optionAttributes['left-attached']).toBe('attached');
    expect(out.optionAttributes['right-attached']).toBe('attached');
  });

  it('first-owner attribute keeps the bare entry for colliding values', () => {
    // only first owner of value keeps bare key in optionAttributes
    const spec = {
      tagName: 'ui-collide',
      variations: [FLOATED_VARIATION, ATTACHED_VARIATION],
    };
    const reader = new SpecReader(spec);
    const out = reader.getWebComponentSpec();
    // floated registered first → owns the bare 'left' and 'right'
    expect(out.optionAttributes.left).toBe('floated');
    expect(out.optionAttributes.right).toBe('floated');
  });

  it('non-colliding values in colliding attributes still get compound forms', () => {
    // all values of a colliding attribute get compounds
    const spec = {
      tagName: 'ui-collide',
      variations: [FLOATED_VARIATION, ATTACHED_VARIATION],
    };
    const reader = new SpecReader(spec);
    const out = reader.getWebComponentSpec();
    // 'top' and 'bottom' only appear in attached, but attached collides on left/right
    expect(out.optionAttributes['top-attached']).toBe('attached');
    expect(out.optionAttributes['bottom-attached']).toBe('attached');
    // and the bare forms remain for non-colliding values
    expect(out.optionAttributes['top']).toBe('attached');
    expect(out.optionAttributes['bottom']).toBe('attached');
  });

  it('compoundAliases on a state generates compound aliases for its values', () => {
    // states with compoundAliases:true contribute compound forms
    const spec = {
      tagName: 'ui-alias',
      states: [DISABLED_STATE],
    };
    const reader = new SpecReader(spec);
    const out = reader.getWebComponentSpec();
    // value 'clickable' should get a compound form clickable-disabled
    expect(out.optionAttributes['clickable-disabled']).toBe('disabled');
    // identity value 'disabled' (value === attr) is not compounded
    expect(out.optionAttributes['disabled']).toBe('disabled');
  });

  it('compoundAliases produces only one ordering per value (value-attribute)', () => {
    // `${value}-${attr}` is generated; reverse only if prefixCompound
    const spec = {
      tagName: 'ui-alias',
      states: [DISABLED_STATE],
    };
    const reader = new SpecReader(spec);
    const out = reader.getWebComponentSpec();
    // Skill claim: BOTH 'clickable-disabled' AND 'disabled-clickable' should map.
    // Test arbitrates — only 'clickable-disabled' is generated by default.
    expect(out.optionAttributes['clickable-disabled']).toBe('disabled');
    expect(out.optionAttributes['disabled-clickable']).toBeUndefined();
  });

  it('does not compound an identity option whose value matches the attribute', () => {
    // skips value === attr — identity options stay bare
    const spec = {
      tagName: 'ui-self',
      states: [{ name: 'Compact', attribute: 'compact', options: [{ value: 'compact' }] }],
    };
    const reader = new SpecReader(spec);
    const out = reader.getWebComponentSpec();
    expect(out.optionAttributes['compact']).toBe('compact');
    expect(out.optionAttributes['compact-compact']).toBeUndefined();
  });
});

describe('SpecReader plural mode filters sections by pluralShared* lists', () => {
  const buttonSpec = {
    name: 'Button',
    tagName: 'ui-button',
    pluralTagName: 'ui-buttons',
    types: [EMPHASIS_TYPE],
    variations: [SIZE_VARIATION, FLUID_VARIATION],
    pluralSharedVariations: ['size'], // only size is inherited
    pluralSharedTypes: [],
  };

  it('singular reader includes all variations', () => {
    const reader = new SpecReader(buttonSpec);
    const out = reader.getWebComponentSpec();
    expect(out.variations).toEqual(expect.arrayContaining(['size', 'fluid']));
  });

  it('plural reader keeps only pluralSharedVariations', () => {
    const reader = new SpecReader(buttonSpec, { plural: true });
    const out = reader.getWebComponentSpec();
    expect(out.variations).toContain('size');
    expect(out.variations).not.toContain('fluid');
  });

  it('plural reader filters types using pluralSharedTypes', () => {
    const reader = new SpecReader(buttonSpec, { plural: true });
    const out = reader.getWebComponentSpec();
    // pluralSharedTypes is empty → no types pass through
    expect(out.types).toBeUndefined();
  });

  it('plural reader uses plural tag name', () => {
    const reader = new SpecReader(buttonSpec, { plural: true });
    expect(reader.getTagName()).toBe('ui-buttons');
  });

  it('exposes inheritedPluralVariations from pluralSharedVariations', () => {
    const reader = new SpecReader(buttonSpec);
    const out = reader.getWebComponentSpec();
    expect(out.inheritedPluralVariations).toEqual(['size']);
  });
});

describe('SpecReader settings honor declared types', () => {
  it('boolean settings default to false', () => {
    const spec = {
      tagName: 'ui-x',
      settings: [{ name: 'Enabled', attribute: 'enabled', type: 'boolean' }],
    };
    const reader = new SpecReader(spec);
    const out = reader.getWebComponentSpec();
    expect(out.defaultValues.enabled).toBe(false);
    expect(out.propertyTypes.enabled).toBe('boolean');
  });

  it('string settings default to empty string', () => {
    const spec = {
      tagName: 'ui-x',
      settings: [{ name: 'Href', attribute: 'href', type: 'string' }],
    };
    const reader = new SpecReader(spec);
    const out = reader.getWebComponentSpec();
    expect(out.defaultValues.href).toBe('');
    expect(out.propertyTypes.href).toBe('string');
  });

  it('explicit defaultValue is preserved', () => {
    const spec = {
      tagName: 'ui-x',
      settings: [{ name: 'Count', attribute: 'count', type: 'number', defaultValue: 5 }],
    };
    const reader = new SpecReader(spec);
    const out = reader.getWebComponentSpec();
    expect(out.defaultValues.count).toBe(5);
  });

  it('function settings are excluded from observed attributes', () => {
    // canUseAttribute returns false for Function
    const spec = {
      tagName: 'ui-x',
      events: [{ name: 'Change', attribute: 'change' }],
    };
    const reader = new SpecReader(spec);
    const out = reader.getWebComponentSpec();
    expect(out.attributes).toBeUndefined(); // empty array filtered out
    expect(out.properties).toContain('change');
  });
});

/*******************************
       Entry point shape
*******************************/

describe('package entry points expose the same public surface', () => {
  it('browser entry exposes SpecReader', () => {
    expect(typeof browserEntry.SpecReader).toBe('function');
  });

  it('server entry exposes SpecReader', () => {
    expect(typeof serverEntry.SpecReader).toBe('function');
  });

  it('browser entry exposes all helpers', () => {
    expect(typeof browserEntry.getStates).toBe('function');
    expect(typeof browserEntry.getVariations).toBe('function');
    expect(typeof browserEntry.addOptionExamples).toBe('function');
    expect(typeof browserEntry.filterVariationOptions).toBe('function');
    expect(typeof browserEntry.modifyVariation).toBe('function');
    expect(typeof browserEntry.withUsageLevel).toBe('function');
  });

  it('server entry exposes all helpers', () => {
    expect(typeof serverEntry.getStates).toBe('function');
    expect(typeof serverEntry.getVariations).toBe('function');
    expect(typeof serverEntry.addOptionExamples).toBe('function');
    expect(typeof serverEntry.filterVariationOptions).toBe('function');
    expect(typeof serverEntry.modifyVariation).toBe('function');
    expect(typeof serverEntry.withUsageLevel).toBe('function');
  });

  it('browser entry exposes shared states', () => {
    expect(browserEntry.HOVER_STATE).toBe(HOVER_STATE);
    expect(browserEntry.DISABLED_STATE).toBe(DISABLED_STATE);
  });

  it('browser entry exposes shared variations', () => {
    expect(browserEntry.SIZE_VARIATION).toBe(SIZE_VARIATION);
    expect(browserEntry.ATTACHED_VARIATION).toBe(ATTACHED_VARIATION);
  });

  it('server SpecReader extends the base reader with file-system methods', () => {
    const reader = new serverEntry.SpecReader({});
    expect(typeof reader.writeComponentSpec).toBe('function');
    // Inherited from base
    expect(typeof reader.getWebComponentSpec).toBe('function');
  });

  it('browser SpecReader does not include file-system methods', () => {
    const reader = new browserEntry.SpecReader({});
    expect(reader.writeComponentSpec).toBeUndefined();
  });
});
