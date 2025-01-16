import { LitElement } from 'lit';
import { each, isFunction, isClassInstance, kebabToCamel, camelToKebab, keys, unique, isServer, isEqual, inArray, get } from '@semantic-ui/utils';
import { Signal } from '@semantic-ui/reactivity';
import { $ } from '@semantic-ui/query';

/*
  This extends the base Lit element class to include
  additional functionality useful for Semantic UI
*/

class WebComponentBase extends LitElement {

  static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: false};

  // for use with light dom rendering
  static scopedStyleSheet = null;

  constructor() {
    super();
    this.renderCallbacks = [];
  }

  updated() {
    super.updated();
    each(this.renderCallbacks, (callback) => callback());
  }

  addRenderCallback(callback) {
    this.renderCallbacks.push(callback);
  }

  /*******************************
           Lit Properties
  *******************************/

  static getProperties({ properties = {}, defaultSettings, componentSpec }) {
    if (keys(properties).length) {
      return properties;
    }
    if (componentSpec) {
      properties.class = { type: String, noAccessor: true, alias: true };

      // emphasis="primary" but also setting props
      each(componentSpec.attributes, (attributeName) => {
        const propertyType = componentSpec.propertyTypes[attributeName];
        const propertyName = kebabToCamel(attributeName);
        properties[propertyName] = WebComponentBase.getPropertySettings(attributeName, propertyType);
      });

      // these are values that can only be set on the DOM el as properties
      // but do not have attributes like functions or classes
      each(componentSpec.properties, (attributeName) => {
        const propertyType = componentSpec.propertyTypes[attributeName];
        const propertyName = kebabToCamel(attributeName);
        properties[propertyName] = WebComponentBase.getPropertySettings(attributeName, propertyType);
      });

      // this handles syntax where allowed value is used as attribute
      // <ui-button primary> -> emphasis="primary"
      each(componentSpec.optionAttributes, (attributeValues, attributeName) => {
        const propertyName = kebabToCamel(attributeName);
        properties[propertyName] = { type: String, noAccessor: true, alias: true, attribute: attributeName };
      });
    }
    if (defaultSettings) {
      each(defaultSettings, (defaultValue, propertyName) => {
        // this can either be a settings object or a default value
        // i.e. { foo: 'baz' } // basic
        // or { foo: { type: String, defaultValue: 'baz' } // expert

        // we cant serialize custom classes
        const propertySettings = {
          propertyOnly: isClassInstance(defaultValue)
        };

        properties[propertyName] = (defaultValue?.type)
          ? defaultSettings // this is a config object (advanced)
          : WebComponentBase.getPropertySettings(propertyName, defaultValue?.constructor, propertySettings)
        ;
      });
    }

    /* This handles the case of multiword settings like `useAccordion`
       we support 2 syntax <ui-menu use-accordion> or <ui-menu useaccordion>'
       the kebab attr serves as an alias with no accessor
    */
    each(properties, (propertySettings, propertyName) => {
      const attributeName = camelToKebab(propertyName);
      if(attributeName !== propertyName && !properties[attributeName] && properties[propertyName]) {
        properties[attributeName] = {
          ...properties[propertyName],
          noAccessor: true,
          alias: true,
        };
      }
    });
    return properties;
  }

  static getPropertySettings(propertyName, type = String, { propertyOnly = false } = {}) {
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
        fromAttribute: (value, type) => {
          if (inArray(value, ['false', '0', 'null', 'undefined'])) {
            return false;
          }
          if (inArray(value, ['', true, 'true'])) {
            return true;
          }
          return Boolean(value);
        },
        toAttribute: (value, type) => {
          return String(value);
        }
      };
    }
    return property;
  }

  /*******************************
      Settings / Template Data
  *******************************/

  /*
    This sets default settings for a component
  */
  setDefaultSettings({defaultSettings = {}, componentSpec}) {
    this.defaultSettings = defaultSettings;
    each(defaultSettings, (setting, name) => {
      if (setting?.default !== undefined) {
        // (expert) this is a settings object
        this.defaultSettings[name] = setting.default;
      }
      else {
        // (simple) this is just a default value
        this.defaultSettings[name] = setting;
      }
    });
    if(componentSpec?.defaultValues) {
      this.defaultSettings = {
        ...componentSpec.defaultValues,
        ...this.defaultSettings
      };
    }
  }


  /*
    This returns a list of settings which may include both attributes and properties
    as specified in the spec for the component. It will extend them from default settings
  */
  getSettingsFromConfig({componentSpec, properties}) {
    let settings = {};
    each(properties, (propSettings, propertyName) => {
      if (propSettings.alias === true) {
        return;
      }
      const elementProp = this[propertyName];
      const setting = elementProp  // check element setting
        ?? this.defaultSettings[propertyName]  // check default setting on this component
        ?? (componentSpec?.defaultSettings || {})[propertyName] // check default setting on component spec
      ;
      // only pass through setting if it is defined
      if(setting !== undefined) {
        settings[propertyName] = setting;
      }
      // boolean attribute case
      if (componentSpec && settings[elementProp] !== undefined) {
        settings[propertyName] = true;
      }
    });
    return settings;
  }


  /* Create a proxy object which returns the current setting
     we need this over a getter/setter because settings are
     destructured in function arguments which locks their value in time
     i.e. onCreated({settings}) { }
  */
  createSettingsProxy({componentSpec, properties}) {
    let component = this;
    /*
      To make settings reactive in Reactions
      we need to map them to signals
    */
    component.settingsVars = new Map();
    return new Proxy({}, {
      get: (target, property) => {
        const settings = component.getSettings({
          componentSpec,
          properties
        });
        const setting = get(settings, property);
        let signal = component.settingsVars.get(property);
        if(signal) {
          signal.get();
        }
        else {
          signal = new Signal(setting);
          component.settingsVars.set(property, signal);
        }
        return setting;
      },
      set: (target, property, value, receiver) => {
        component.setSetting(property, value);
        let signal = component.settingsVars.get(property);
        if(signal) {
          signal.set(value);
        }
        else {
          signal = new Signal(value);
          component.settingsVars.set(property, signal);
        }
        return true;
      }
    });
  }

  /*
    This returns a list of styling classes to pass through to
    the template data context for the component based off
    component attributes
  */
  getUIClasses({componentSpec, properties}) {

    // this is just a special feature of component specs and can be ignored otherwise
    if (!componentSpec) {
      return;
    }
    const classes = [];
    // iterate through tracked attributes which can receive classes
    each(componentSpec.attributes, (attribute) => {

      const property = kebabToCamel(attribute);
      const value = this[property];

      if(value) {
        const allowedValues = componentSpec.allowedValues[attribute];
        const propertyType = componentSpec.propertyTypes[attribute];
        if(propertyType == Boolean) {
          // this is a variation like active=true
          // it receives the class "active"
          classes.push(attribute);
        }
        else if(value == attribute && allowedValues && inArray(value, allowedValues)) {
          // disabled="disabled" use case operates like boolean
          classes.push(attribute);
        }
        else if(allowedValues && inArray(value, allowedValues)) {
          // this is a variation like emphasis="primary"
          // it receives the class "primary"
          classes.push(value);
        }

        // components can opt-in to including the attribute if it has a value set
        // for instance "icon" if it has an icon set
        if(componentSpec.attributeClasses.includes(attribute)) {
          classes.push(attribute);
        }
      }
    });

    let classString = unique(classes).join(' ');
    if(classString) {
      classString += ' ';
    }
    return classString;
  }

  isDarkMode() {
    return (isServer)
      ? undefined
      : $(this).cssVar('dark-mode') == 'true'
    ;
  }

  /*******************************
            DOM Helpers
  *******************************/

  // Rendered DOM (either shadow or regular)
  $(selector, { root = this?.renderRoot || this.shadowRoot} = {}) {
    if (!root) {
      console.error('Cannot query DOM until element has rendered.');
    }
    return $(selector, { root });
  }

  // Original DOM (used for pulling slotted text)
  $$(selector) {
    return $(selector, { root: this.originalDOM.content });
  }

  // calls callback if defined with consistent params and this context
  call(
    func,
    { firstArg, additionalArgs, args = [this.component, this.$.bind(this)] } = {}
  ) {
    if (firstArg) {
      args.unshift(firstArg);
    }
    if (additionalArgs) {
      args.push(...additionalArgs);
    }
    if (isFunction(func)) {
      return func.apply(this, args);
    }
  }
}

export { WebComponentBase };
