import { LitElement } from 'lit';
import { each, isFunction, isClassInstance, kebabToCamel, camelToKebab, keys, unique, isServer, isEqual, inArray, get } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { $ } from '@semantic-ui/query';
import { scopeStyles } from './helpers/scope-styles.js';

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
    this.useLight = false;
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
         Light DOM Rendering
  *******************************/

  /* Modifies shadow dom rules to be scoped to component tag */
  addPageCSS(webComponent, id, css, { scopeSelector } = {}) {
    if(isServer) {
      return;
    }
    const stylesheet = new CSSStyleSheet();
    if(!webComponent.pageStylesheets) {
      webComponent.pageStylesheets = {};
    }
    if (!webComponent.pageStylesheets[id]) {
      if(scopeSelector) {
        css = scopeStyles(css, scopeSelector);
      }
      stylesheet.replaceSync(css);
      webComponent.pageStylesheets[id] = stylesheet;
    }
    // we add a new stylesheet to document scoped to component name
    document.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      stylesheet,
    ];
  }

  /*******************************
           Lit Properties
  *******************************/

  static getProperties({ properties = {}, settings, componentSpec }) {
    if (keys(properties).length) {
      return properties;
    }
    if (componentSpec) {
      properties.class = { type: String };

      // emphasis="primary" but also setting props
      each(componentSpec.attributes, (attributeName) => {
        const propertyType = componentSpec.propertyTypes[attributeName];
        const propertyName = kebabToCamel(attributeName);
        properties[propertyName] = WebComponentBase.getPropertySettings(attributeName, propertyType);
      });

      // these are values that can only be set on the DOM el as properties
      // but do not have attributes -- for instance functions
      each(componentSpec.properties, (attributeName) => {
        const propertyType = componentSpec.propertyTypes[attributeName];
        const propertyName = kebabToCamel(attributeName);
        properties[propertyName] = WebComponentBase.getPropertySettings(attributeName, propertyType);
      });

      // primary -> emphasis="primary"
      each(componentSpec.optionAttributes, (attributeValues, attributeName) => {
        const propertyName = kebabToCamel(attributeName);
        properties[propertyName] = { type: String, noAccessor: true, attribute: attributeName };
      });
    }
    if (settings) {
      each(settings, (defaultValue, propertyName) => {
        // this can either be a settings object or a default value
        // i.e. { foo: 'baz' } // basic
        // or { foo: { type: String, defaultValue: 'baz' } // expert

        // we cant serialize custom classes
        const propertySettings = {
          propertyOnly: isClassInstance(defaultValue)
        };
        const attributeName = camelToKebab(propertyName);
        properties[propertyName] = (defaultValue?.type)
          ? settings
          : WebComponentBase.getPropertySettings(attributeName, defaultValue?.constructor, propertySettings)
        ;
      });
    }
    return properties;
  }

  static getPropertySettings(propName, type = String, { propertyOnly = false } = {}) {
    let property = {
      type,
      /*
        Lit converts properties to lowercase name instead of kebab case
        i.e. firstName -> <my-component firstname="John">
        we want `first-name="John"`, this means we need to manually specify attribute
      */
      attribute: camelToKebab(propName),
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
  setDefaultSettings({settings = {}, componentSpec}) {
    this.defaultSettings = settings;
    each(settings, (setting, name) => {
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
      if (propertyName == 'class' || propSettings.observe === false) {
        return;
      }
      const attributeName = camelToKebab(propertyName);
      const elementProp = this[propertyName];
      const setting = elementProp  // check element setting
        ?? this.defaultSettings[propertyName]  // check default setting on this component
        ?? (componentSpec?.defaultSettings || {})[propertyName] // check default setting on component spec
      ;
      // only pass through setting if it is defined
      if(setting !== undefined) {

        // if setting is a composite like emphasis="primary"
        // and this is "primary" we pass this as a boolean
        if(componentSpec && !get(componentSpec.allowedValues, attributeName) && get(componentSpec.optionAttributes, attributeName)) {
          settings[propertyName] = true;
          return;
        }
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
      To make settings reactive references we need to create
      reactive references for any setting
    */
    component.settingsVars = new Map();
    return new Proxy({}, {
      get: (target, property) => {
        const settings = component.getSettings({
          componentSpec,
          properties
        });
        const setting = get(settings, property);
        let reactiveVar = component.settingsVars.get(property);
        if(reactiveVar) {
          reactiveVar.get();
        }
        else {
          reactiveVar = new ReactiveVar(setting);
          component.settingsVars.set(property, reactiveVar);
        }
        return setting;
      },
      set: (target, property, value, receiver) => {
        component.setSetting(property, value);
        let reactiveVar = component.settingsVars.get(property);
        if(reactiveVar) {
          reactiveVar.set(value);
        }
        else {
          reactiveVar = new ReactiveVar(value);
          component.settingsVars.set(property, reactiveVar);
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

  /* Returns content (slotted content) from a component spec */
  getContent({componentSpec}) {
    const content = {};
    if(!componentSpec) {
      return;
    }
    // slotted content is stored in onSlotChange
    each(componentSpec.content, (contentName) => {
      if(this[contentName] && this.slottedContent) {
        content[contentName] = this.slottedContent[contentName];
      }
    });
    return content;
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
