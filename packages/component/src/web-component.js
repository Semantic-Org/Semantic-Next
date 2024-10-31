import { LitElement } from 'lit';
import { each, isFunction, kebabToCamel, keys, unique, isServer, inArray, get } from '@semantic-ui/utils';
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
      each(componentSpec.attributes, (name) => {
        const propertyType = componentSpec.propertyTypes[name];
        properties[name] = WebComponentBase.getPropertySettings(name, propertyType);
      });

      // these are values that can only be set on the DOM el as properties
      // but do not have attributes -- for instance functions
      each(componentSpec.properties, (name) => {
        const propertyType = componentSpec.propertyTypes[name];
        properties[name] = WebComponentBase.getPropertySettings(name, propertyType);
      });

      // primary -> emphasis="primary"
      each(componentSpec.optionAttributes, (attributeValues, attribute) => {
        properties[attribute] = { type: String, noAccessor: true };
      });
    }
    if (settings) {
      each(settings, (defaultValue, name) => {
        // this can either be a settings object or a default value
        // i.e. { foo: 'baz' } // basic
        // or { foo: { type: String, defaultValue: 'baz' } // expert
        properties[name] = (defaultValue?.type)
          ? settings
          : WebComponentBase.getPropertySettings(name, defaultValue?.constructor)
        ;
      });
    }
    return properties;
  }

  static getPropertySettings(name, type = String) {
    let property = {
      type,
      attribute: true,
      //hasChanged: isEqual,
    };
    // functions cannot be serialized
    if (type == Function) {
      property.attribute = false;
    }
    else if (type == Boolean) {
      property.converter = {
        fromAttribute: (value, type) => {
          if (inArray(value, ['false', '0', 'null', 'undefined'])) {
            return false;
          }
          return Boolean(value);
        },
        toAttribute: (value, type) => {
          return String(value);
        }
      };
    }
    // adding accessors to reserved browser DOM props causes issues
    if(inArray(name, ['disabled'])) {
      property.noAccessor = true;
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
    each(properties, (propSettings, property) => {
      if (property == 'class' || propSettings.observe === false) {
        return;
      }
      if(componentSpec && !get(componentSpec.allowedValues, property) && get(componentSpec.optionAttributes, property)) {
        // this property is used to lookup a setting like 'large' -> sizing
        // we dont record this into settings
        return;
      }

      property = kebabToCamel(property);

      const elementProp = this[property];
      const setting = elementProp  // check element setting
        ?? this.defaultSettings[property]  // check default setting on this component
        ?? (componentSpec?.defaultSettings || {})[property] // check default setting on component spec
      ;
      // only pass through setting if it is defined
      if(setting !== undefined) {
        settings[property] = setting;
      }
      // boolean attribute case
      if (componentSpec && settings[elementProp] !== undefined) {
        settings[property] = true;
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
    let reactiveVars = new Map();
    return new Proxy({}, {
      get: (target, property) => {
        const settings = component.getSettings({
          componentSpec,
          properties
        });
        const setting = get(settings, property);
        let reactiveVar = reactiveVars.get(property);
        if(reactiveVar) {
          reactiveVar.get();
        }
        else {
          reactiveVar = new ReactiveVar(setting);
          reactiveVars.set(property, reactiveVar);
        }
        return setting;
      },
      set: (target, property, value, receiver) => {
        component.setSetting(property, value);
        let reactiveVar = reactiveVars.get(property);
        if(reactiveVar) {
          reactiveVar.set(value);
        }
        else {
          reactiveVar = new ReactiveVar(value);
          reactiveVars.set(property, reactiveVar);
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

      const value = this[attribute];

      if(value) {
        const allowedValues = componentSpec.allowedValues[attribute];
        const propertyType = componentSpec.propertyTypes[attribute];
        if(propertyType == Boolean) {
          // this is a variation like active=true
          // it receives the class "active"
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
