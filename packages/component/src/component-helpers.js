import { $ } from '@semantic-ui/query';
import { Signal } from '@semantic-ui/reactivity';
import {
  camelToKebab,
  each,
  firstMatch,
  get,
  inArray,
  isClassInstance,
  isEqual,
  isServer,
  isString,
  kebabToCamel,
  keys,
  unique,
} from '@semantic-ui/utils';

/*******************************
      Property Configuration
*******************************/

/*
  Builds property configuration from component spec and default settings.
  Used by both WebComponentBase and LitWebComponentBase.
*/
export function getProperties({ properties = {}, defaultSettings, componentSpec }) {
  if (keys(properties).length) {
    return properties;
  }
  if (componentSpec) {
    properties.class = { type: String, noAccessor: true, alias: true };

    // emphasis="primary" but also setting props
    each(componentSpec.attributes, (attributeName) => {
      const propertyType = componentSpec.propertyTypes[attributeName];
      const propertyName = kebabToCamel(attributeName);
      properties[propertyName] = getPropertySettings({
        name: attributeName,
        type: propertyType,
      });
    });

    // these are values that can only be set on the DOM el as properties
    // but do not have attributes like functions or classes
    each(componentSpec.properties, (attributeName) => {
      const propertyType = componentSpec.propertyTypes[attributeName];
      const propertyName = kebabToCamel(attributeName);
      properties[propertyName] = getPropertySettings({
        name: attributeName,
        type: propertyType,
      });
    });

    // this handles syntax where allowed value is used as attribute
    // <ui-button primary> -> emphasis="primary"
    each(componentSpec.optionAttributes, (attributeValues, attributeName) => {
      const propertyName = kebabToCamel(attributeName);

      // in some cases the value is the same as the category i.e. positive="positive"
      if (properties[propertyName]) {
        return;
      }

      properties[propertyName] = { type: String, noAccessor: true, alias: true, attribute: attributeName };
    });
  }
  if (defaultSettings) {
    each(defaultSettings, (defaultValue, propertyName) => {
      // this can either be a settings object or a default value
      // i.e. { foo: 'baz' } // basic
      // or { foo: { type: String, defaultValue: 'baz' } // expert
      properties[propertyName] = (defaultValue?.type)
        ? defaultValue
        : getPropertySettings({
          name: propertyName,
          type: defaultValue?.constructor,
          propertyOnly: isClassInstance(defaultValue), // cant serialize custom classes
        });
    });
  }

  /* This handles the case of multiword settings like `useAccordion`
     we support 2 syntax <ui-menu use-accordion> or <ui-menu useaccordion>'
     the kebab attr serves as an alias with no accessor
  */
  each(properties, (propertySettings, propertyName) => {
    const attributeName = camelToKebab(propertyName);
    if (attributeName !== propertyName && !properties[attributeName] && properties[propertyName]) {
      properties[attributeName] = {
        ...properties[propertyName],
        noAccessor: true,
        alias: true,
      };
    }
  });

  // accessors can break certain special dom attrs
  // DISABLED FOR NOW
  const specialAttrs = ['value', 'checked'];
  each(specialAttrs, (attr) => {
    if (properties[attr]) {
      // properties[attr].noAccessor = true;
    }
  });
  return properties;
}

export function getPropertySettings({ name, type = String, propertyOnly = false } = {}) {
  // converts type = 'string' -> String
  // this is because component spec cannot serialize prototypes in JSON
  if (isString(type)) {
    const types = {
      string: String,
      number: Number,
      boolean: Boolean,
      object: Object,
      array: Array,
      function: Function,
    };
    type = types[type] || String;
  }

  let property = {
    type,
    attribute: true,
    hasChanged: (a, b) => {
      return !isEqual(a, b);
    },
  };
  // functions cannot be serialized
  if (propertyOnly || type == Function) {
    property.attribute = false;
    property.hasChanged = (newVal, oldVal) => {
      return true;
    };
  }
  else if (type == Boolean) {
    property.converter = {
      fromAttribute: (value) => {
        if (inArray(value, ['false', '0', 'null', 'undefined'])) {
          return false;
        }
        if (inArray(value, ['', true, 'true'])) {
          return true;
        }
        return Boolean(value);
      },
      toAttribute: (value) => {
        return String(value);
      },
    };
  }
  else if (type == Number) {
    property.converter = {
      fromAttribute: (value) => {
        return value === null ? null : Number(value);
      },
      toAttribute: (value) => {
        return value == null ? null : String(value);
      },
    };
  }
  else if (type == Object || type == Array) {
    property.converter = {
      fromAttribute: (value) => {
        try {
          return JSON.parse(value);
        }
        catch {
          return null;
        }
      },
      toAttribute: (value) => {
        return value == null ? null : JSON.stringify(value);
      },
    };
  }
  return property;
}

/*******************************
    Settings / Template Data
*******************************/

/*
  Sets default settings for a component instance.
  Call as: setDefaultSettings(el, { defaultSettings, componentSpec })
*/
export function setDefaultSettings(el, { defaultSettings = {}, componentSpec }) {
  el.defaultSettings = { ...defaultSettings };
  each(el.defaultSettings, (setting, name) => {
    if (setting?.default !== undefined) {
      el.defaultSettings[name] = setting.default;
    }
  });
  if (componentSpec?.defaultValues) {
    el.defaultSettings = {
      ...componentSpec.defaultValues,
      ...el.defaultSettings,
    };
  }
}

/*
  Returns a list of settings which may include both attributes and properties
  as specified in the spec for the component. Extends from default settings.
  Call as: getSettingsFromConfig(el, { componentSpec, properties })
*/
export function getSettingsFromConfig(el, { componentSpec, properties }) {
  let settings = {};
  each(properties, (propSettings, propertyName) => {
    if (propSettings.alias === true) {
      return;
    }
    const elementProp = el[propertyName];
    const setting = elementProp
      ?? el.defaultSettings[propertyName]
      ?? (componentSpec?.defaultSettings || {})[propertyName];
    if (setting !== undefined) {
      settings[propertyName] = setting;
    }
    if (componentSpec && settings[elementProp] !== undefined) {
      settings[propertyName] = true;
    }
  });
  return settings;
}

/*
  Creates a proxy object which returns the current setting.
  We need this over a getter/setter because settings are
  destructured in function arguments which locks their value in time.
*/
export function createSettingsProxy(el) {
  el.settingsVars = new Map();
  return new Proxy({}, {
    get: (target, property) => {
      const settings = el.getSettings();
      const setting = get(settings, property);
      let signal = el.settingsVars.get(property);
      if (!signal) {
        signal = new Signal(setting);
        el.settingsVars.set(property, signal);
      }
      signal.set(setting);
      signal.get();
      return setting;
    },
    set: (target, property, value, receiver) => {
      el.setSetting(property, value);
      let signal = el.settingsVars.get(property);
      if (signal) {
        signal.set(value);
      }
      else {
        signal = new Signal(value);
        el.settingsVars.set(property, signal);
      }
      return true;
    },
  });
}

/*
  Resolve option attributes (e.g. tiny → size="tiny") in a props object.
  Mutates and returns the same object. Shared by renderToString and
  deserializeAttrs so SSR and client agree on attribute resolution.
*/
export function resolveOptionAttributes(attrs, componentSpec) {
  if (!componentSpec?.optionAttributes) { return attrs; }
  each(componentSpec.optionAttributes, (targetProp, optionAttr) => {
    const camel = kebabToCamel(optionAttr);
    if (camel in attrs) {
      attrs[targetProp] = optionAttr;
      delete attrs[camel];
    }
  });
  return attrs;
}

/*
  Returns styling classes for the template data context based on
  component spec attributes.
  Call as: getUIClasses(el, { componentSpec, properties })
*/
export function getUIClasses(el, { componentSpec, properties }) {
  if (!componentSpec) {
    return;
  }
  const classes = [];
  each(componentSpec.attributes, (attribute) => {
    const property = kebabToCamel(attribute);
    const value = el[property] || el[attribute];
    if (value) {
      const allowedValues = componentSpec.allowedValues?.[attribute];
      const propertyType = componentSpec.propertyTypes?.[attribute];
      if (propertyType == 'boolean') {
        classes.push(attribute);
      }
      else if (value == attribute && allowedValues && inArray(value, allowedValues)) {
        classes.push(attribute);
      }
      else if (allowedValues && inArray(value, allowedValues)) {
        const compoundForms = [`${value}-${attribute}`, `${attribute}-${value}`];
        const compoundClass = firstMatch(compoundForms, (form) => componentSpec.optionAttributes?.[form]);
        classes.push(compoundClass || value);
      }
      else if (value === true && inArray(property, allowedValues)) {
        classes.push(property);
      }

      if (inArray(attribute, componentSpec.attributeClasses || [])) {
        classes.push(attribute);
      }
    }
  });

  let classString = unique(classes).join(' ');
  if (classString) {
    classString += ' ';
  }
  return classString;
}

export function isDarkMode(el) {
  return (isServer)
    ? undefined
    : $('html').hasClass('dark') || $(el).cssVar('dark-mode') == 'true';
}
