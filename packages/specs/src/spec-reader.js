import {
  each,
  filterObject,
  flatten,
  get,
  inArray,
  isEmpty,
  isString,
  mapObject,
  noop,
  reverseKeys,
  unique,
  values,
} from '@semantic-ui/utils';

export class SpecReader {
  static DEFAULT_DIALECT = 'standard';

  static DIALECT_TYPES = {
    standard: 'standard', // <ui-button large red>
    classic: 'classic', // <ui-button class="large red">
    verbose: 'verbose', // <ui-button size="large" color="red">
  };

  constructor(spec, {
    plural = false,
    dialect = SpecReader.DEFAULT_DIALECT,
  } = {}) {
    this.spec = spec || {};
    this.plural = plural;
    this.dialect = dialect;
    this.componentSpec = null;
  }

  /*
    Get the name of the components export
  */
  getComponentName({ plural = this.plural, lang = 'html' } = {}) {
    const spec = this.spec;
    const name = (plural)
      ? spec.pluralExportName
      : spec.exportName;
    return name;
  }

  /*
    Returns the tag name used for plural or singular format of a component
  */
  getTagName({ plural = this.plural, lang = 'html' } = {}) {
    const spec = this.spec;
    const name = (plural)
      ? spec.pluralTagName
      : spec.tagName;
    return name;
  }

  /* This is a format that is consumed by defineComponent to determine valid attributes
     for the web component. It is a subset of the component spec that can be searched quickly
     and has a reduced filesize.
  */
  getWebComponentSpec(spec = this.spec, { plural = this.plural } = {}) {
    if (spec == this.spec && this.componentSpec) {
      return this.componentSpec;
    }

    let componentSpec = {
      tagName: this.getTagName(),
      content: [],
      contentAttributes: [],

      types: [],
      variations: [],
      states: [],
      events: [],
      settings: [],

      properties: [],
      attributes: [],
      optionAttributes: {},
      propertyTypes: {},
      allowedValues: {},
      attributeClasses: [],
      defaultValues: {},
      inheritedPluralVariations: [],
    };

    const addSettingsFromPart = (section) => {
      let specPart = spec[section] || [];

      // plural spec uses a separate array to list which values are permitted to be shared
      if (plural) {
        const permittedListNames = {
          types: 'pluralSharedTypes',
          variations: 'pluralSharedVariations',
          states: 'pluralSharedStates',
          content: 'pluralSharedContent',
          settings: 'pluralSharedSettings',
          events: 'pluralSharedEvents',
        };
        const permittedListName = get(permittedListNames, section);
        const permittedValues = get(spec, permittedListName) || [];
        if (permittedListName) {
          specPart = specPart.filter((spec) => {
            const propertyName = this.getPropertyName(spec);
            return inArray(propertyName, permittedValues);
          });
        }

        // the section name will not corresponse to the section name passed in
        section = section.replace('pluralOnly', '').toLowerCase();
      }
      each(specPart, (spec) => {
        const propertyName = this.getPropertyName(spec);

        // it is a requirement to have a property name defined
        if (!propertyName) {
          return;
        }

        // add to list of this grouping, i.e types: ['emphasis']
        if (componentSpec[section]) {
          componentSpec[section].push(propertyName);
        }

        // find allowed option values for this attribute i.e. emphasis: ['primary', 'secondary']
        const allowedValues = this.getAllowedValues(spec);
        if (allowedValues) {
          componentSpec.allowedValues[propertyName] = allowedValues;
        }

        // find native type of this property i.e. String
        const propertyType = this.getPropertyType({ spec, section, allowedValues });
        if (propertyType) {
          componentSpec.propertyTypes[propertyName] = propertyType;
        }

        // find attribute name if it its not a function
        const attributeName = this.getAttributeName(spec, propertyType);
        if (attributeName) {
          componentSpec.attributes.push(attributeName);
        }
        else {
          componentSpec.properties.push(propertyName);
        }

        // find default values
        const defaultValue = this.getDefaultValue(spec, propertyType, section);
        if (defaultValue !== undefined) {
          componentSpec.defaultValues[propertyName] = defaultValue;
        }

        /* Special Cases */

        // "content" can be attribute or slot
        if (section === 'content') {
          if (spec.attribute) {
            componentSpec.contentAttributes.push(spec.attribute);
          }
          else if (spec.slot) {
            componentSpec.slots.push(spec.slot);
          }
        }

        // attributes can opt in to having its attribute as a ui class name
        // i.e. ['attached', 'left-attached'] includes 'attached' the attribute as a class
        if (attributeName && spec.includeAttributeClass) {
          componentSpec.attributeClasses.push(propertyName);
        }
      });
    };

    // Only process necessary parts of the spec
    const singularParts = [
      'content',
      'types',
      'states',
      'variations',
      'settings',
      'events',
    ];
    each(singularParts, addSettingsFromPart);

    if (plural) {
      const pluralOnlyParts = [
        'pluralOnlyContent',
        'pluralOnlyTypes',
        'pluralOnlyStates',
        'pluralOnlySettings',
        'pluralOnlyVariations',
        'pluralOnlyEvents',
      ];
      each(pluralOnlyParts, addSettingsFromPart);
    }

    // build optionAttributes: reverse lookup from value → attribute name
    this.buildOptionAttributes({ componentSpec, spec });

    // store some details for plurality if present
    componentSpec.inheritedPluralVariations = spec.pluralSharedVariations || [];

    // filter out empty arrays and objects to reduce filesize further
    componentSpec = filterObject(componentSpec, (value) => !isEmpty(value));

    this.componentSpec = componentSpec;

    return componentSpec;
  }

  /* This is a format that is consumed by defineComponent to determine valid attributes
     for the web component. It is a subset of the component spec that can be searched quickly
     and has a reduced filesize.
  */
  getPluralWebComponentSpec(spec = this.spec) {
    if (spec == this.spec && this.componentSpec) {
      return this.componentSpec;
    }

    let componentSpec = {
      tagName: spec.tagName,
      content: [],
      contentAttributes: [],

      types: [],
      variations: [],
      states: [],
      events: [],
      settings: [],

      properties: [],
      attributes: [],
      optionAttributes: {},
      propertyTypes: {},
      allowedValues: {},
      attributeClasses: [],
      defaultValues: {},
      inheritedPluralVariations: [],
    };

    const addSettingsFromPart = (section) => {
      const specPart = spec[section] || [];
      each(specPart, (spec) => {
        const propertyName = this.getPropertyName(spec);

        // it is a requirement to have a property name defined
        if (!propertyName) {
          return;
        }

        // add to list of this grouping, i.e types: ['emphasis']
        componentSpec[section].push(propertyName);

        // find allowed option values for this attribute i.e. emphasis: ['primary', 'secondary']
        const allowedValues = this.getAllowedValues(spec);
        if (allowedValues) {
          componentSpec.allowedValues[propertyName] = allowedValues;
        }

        // find native type of this property i.e. String
        const propertyType = this.getPropertyType({ spec, section, allowedValues });
        if (propertyType) {
          componentSpec.propertyTypes[propertyName] = propertyType;
        }

        // find attribute name if it its not a function
        const attributeName = this.getAttributeName(spec, propertyType);
        if (attributeName) {
          componentSpec.attributes.push(attributeName);
        }
        else {
          componentSpec.properties.push(propertyName);
        }

        // find default values
        const defaultValue = this.getDefaultValue(spec, propertyType, section);
        if (defaultValue !== undefined) {
          componentSpec.defaultValues[propertyName] = defaultValue;
        }

        /* Special Cases */

        // "content" can be attribute or slot
        if (section === 'content') {
          if (spec.attribute) {
            componentSpec.contentAttributes.push(spec.attribute);
          }
          else if (spec.slot) {
            componentSpec.slots.push(spec.slot);
          }
        }

        // attributes can opt in to having its attribute as a ui class name
        // i.e. ['attached', 'left-attached'] includes 'attached' the attribute as a class
        if (attributeName && spec.includeAttributeClass) {
          componentSpec.attributeClasses.push(propertyName);
        }
      });
    };

    // Only process necessary parts of the spec
    addSettingsFromPart('content');
    addSettingsFromPart('types');
    addSettingsFromPart('states');
    addSettingsFromPart('variations');
    addSettingsFromPart('pluralVariations');
    addSettingsFromPart('settings');
    addSettingsFromPart('events');

    // build optionAttributes with collision detection
    this.buildOptionAttributes({ componentSpec });

    // store some details for plurality if present
    componentSpec.inheritedPluralVariations = spec.pluralSharedVariations || [];

    this.componentSpec = componentSpec;

    return componentSpec;
  }

  /* Returns the attribute name for a given spec part */
  getAttributeName(specPart, type) {
    if (!this.canUseAttribute(type)) {
      return;
    }
    return this.getPropertyName(specPart);
  }
  getPropertyName(specPart) {
    if (specPart.attribute) {
      return specPart.attribute;
    }
    if (isString(specPart.name)) {
      return specPart.name.toLowerCase();
    }
  }

  getPropertyType({ spec, section, allowedValues = [], withPrototype = false } = {}) {
    let types = {
      string: 'string',
      boolean: 'boolean',
      object: 'object',
      array: 'array',
      function: 'function',
    };
    /*
      If we want to allow component spec to be JSON we cant store prototypes
    */
    if (withPrototype) {
      types = {
        string: String,
        number: Number,
        boolean: Boolean,
        object: Object,
        array: Array,
        function: Function,
      };
    }

    let type;
    let stringType;
    if (section == 'events') {
      // events are always functions
      type = types.function;
    }
    else if (inArray(section, ['types', 'states', 'variations'])) {
      // visual modifications (types, states, variations) default to boolean attrs
      // unless they have allowed values
      type = types.boolean;
    }
    else if (inArray(section, ['content'])) {
      // content defaults to string type
      type = types.string;
    }

    if (spec.type && types[spec.type]) {
      // if they specify a type then lets use that as long as its a known type
      stringType = spec.type;
    }
    else if (allowedValues.length) {
      // if they specify allowed values we can infer type from a sample
      const valueTypes = unique(allowedValues.map(value => typeof value));
      stringType = (valueTypes.length > 1)
        ? types.string
        : valueTypes[0];
    }
    if (stringType) {
      type = get(types, stringType);
    }

    return type;
  }

  getAllowedValues(spec) {
    let allowedValues;
    if (spec.options) {
      allowedValues = spec.options
        .map((option) => option?.value !== undefined ? option.value : option)
        .filter(Boolean);
      allowedValues = unique(flatten(allowedValues));
    }
    return allowedValues;
  }

  getDefaultValue(spec, type, section) {
    if (spec.defaultValue !== undefined) {
      return spec.defaultValue;
    }
    if (section !== 'settings') {
      return;
    }
    const defaultValues = {
      string: '',
      array: [],
      boolean: false,
      function: noop,
      number: 0,
      object: {},
    };
    return get(defaultValues, type);
  }

  canUseAttribute(type) {
    if (type == Function) {
      return false;
    }
    return true;
  }

  /*
    Builds the optionAttributes lookup from allowedValues.
    Handles three cases:
    - Bare values: unique values get direct lookup (e.g. "primary" → "emphasis")
    - Auto-detected collisions: values appearing in multiple attributes get compound forms
      (e.g. "subtle" in styled + positive → "subtle-styled", "subtle-positive")
    - Manual compoundAliases: parts opt-in to compound forms for readability
      (e.g. animated → "vertical-animated", "fade-animated")
  */
  buildOptionAttributes({ componentSpec, spec }) {
    // step 1: base lookup via reverseKeys
    let options = mapObject(componentSpec.allowedValues, (values, key) => {
      return values = values.filter(value => isString(value));
    });
    componentSpec.optionAttributes = reverseKeys(options);

    // step 2: detect which specific values collide across attributes
    // skip identity values (value === attr) as they are boolean-style attributes
    // track first attribute to register each value — it "owns" the bare form
    const valueCounts = {};
    const firstOwner = {};
    each(componentSpec.allowedValues, (allowedValues, attr) => {
      each(allowedValues, (value) => {
        if (isString(value) && value !== attr) {
          if (!valueCounts[value]) {
            valueCounts[value] = [];
            firstOwner[value] = attr;
          }
          valueCounts[value].push(attr);
        }
      });
    });
    const collidingValues = new Set();
    const collidingAttributes = new Set();
    each(valueCounts, (attrs, value) => {
      if (attrs.length > 1) {
        collidingValues.add(value);
        each(attrs, (attr) => collidingAttributes.add(attr));
      }
    });

    // step 3: generate compound entries
    // when any value in an attribute collides, ALL sibling values get compound forms
    // e.g. "left" and "right" collide between floated/attached
    // → attached also generates "top-attached", "bottom-attached" for consistency
    // colliding values lose their bare entry, non-colliding siblings keep theirs
    each(componentSpec.allowedValues, (allowedValues, attr) => {
      if (!collidingAttributes.has(attr)) {
        return;
      }
      each(allowedValues, (value) => {
        if (!isString(value) || value === attr) {
          return;
        }
        // generate compound form for all values in a colliding attribute
        componentSpec.optionAttributes[`${value}-${attr}`] = attr;
        // only remove bare entry for actually colliding values
        if (collidingValues.has(value) && attr !== firstOwner[value]) {
          delete componentSpec.optionAttributes[value];
        }
      });
    });

    // step 4: add compound aliases for parts that manually opt-in (e.g. animated)
    // compounds all non-identity, non-colliding values on the part
    if (spec) {
      const partsWithOptions = [...(spec.types || []), ...(spec.states || []), ...(spec.variations || [])];
      each(partsWithOptions, (part) => {
        if (!part.compoundAliases) {
          return;
        }
        const attr = part.attribute || part.name?.toLowerCase();
        const allowedValues = componentSpec.allowedValues[attr];
        if (!allowedValues) {
          return;
        }
        each(allowedValues, (value) => {
          if (!isString(value) || value === attr || collidingValues.has(value)) {
            return;
          }
          if (part.prefixCompound) {
            componentSpec.optionAttributes[`${attr}-${value}`] = attr;
          }
          else {
            componentSpec.optionAttributes[`${value}-${attr}`] = attr;
          }
          delete componentSpec.optionAttributes[value];
        });
      });
    }
  }
}
