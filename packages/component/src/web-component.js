import { LitElement, isServer } from 'lit';
import { each, isFunction, isNumber, isString, isPlainObject, keys, unique, isEqual, inArray, get, isBoolean, isArray } from '@semantic-ui/utils';
import { $ } from '@semantic-ui/query';

import { scopeStyles } from './helpers/scope-styles.js';

/*
  This extends the base Lit element class
  to handle rendering slots to light dom
  as well as applying scoped styles to light DOM
  and several useful helpers for querying DOM
*/

class WebComponentBase extends LitElement {

  static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true};

  // for use with light dom rendering
  static scopedStyleSheet = null;

  constructor() {
    super();
    this.useLight = false;
    this.renderCallbacks = [];
  }

  createRenderRoot() {
    this.useLight = this.getAttribute('expose') !== null;
    if (this.useLight) {
      this.addLightCSS('light', this.css, { scopeSelector: this.tagName });
      this.storeOriginalContent.apply(this);
      return this;
    }
    else {
      const renderRoot = super.createRenderRoot(this.css);
      return renderRoot;
    }
  }

  updated() {
    super.updated();
    if (this.useLight) {
      this.slotLightContent();
    }
    each(this.renderCallbacks, (callback) => callback());
  }

  addRenderCallback(callback) {
    this.renderCallbacks.push(callback);
  }

  /*******************************
         Light DOM Rendering
  *******************************/

  /* Modifies shadow dom rules to be scoped to component tag */
  addLightCSS(id, css, { scopeSelector } = {}) {
    if(isServer) {
      return;
    }
    const stylesheet = new CSSStyleSheet();
    if(!this.lightStylesheets) {
      this.lightStylesheets = {};
    }
    if (!this.lightStylesheets[id]) {
      if(scopeSelector) {
        css = scopeStyles(css, scopeSelector);
      }
      stylesheet.replaceSync(css);
      this.lightStylesheets[id] = stylesheet;
    }
    // we add a new stylesheet to document scoped to component name
    document.adoptedStyleSheets = [
      ...document.adoptedStyleSheets,
      stylesheet,
    ];
  }

  storeOriginalContent() {
    this.originalDOM = document.createElement('template');
    this.originalDOM.innerHTML = this.innerHTML;
    this.innerHTML = '';
  }

  slotLightContent() {
    const $slots = this.$('slot');
    $slots.each(($slot) => {
      let html;
      if ($slot.attr('name')) {
        let slotName = $slot.attr('name');
        const $slotContent = this.$$(`[slot="${slotName}"]`);
        if ($slotContent.length) {
          html = $slotContent.outerHTML();
        }
      }
      else {
        // default slot takes all DOM content that is not slotted
        const $originalDOM = this.$$(this.originalDOM.content);
        const $defaultContent = $originalDOM.children().not('[slot]');
        const defaultHTML = $defaultContent.html() || '';
        const defaultText = $originalDOM.textNode() || '';
        html = defaultHTML + defaultText;
      }
      if ($slot && html) {
        $slot.html(html);
      }
    });
  }
  /*******************************
         Nested Components
  *******************************/

  watchSlottedContent(settings) {
    const $slot = this.$('slot');
    // initial render
    $slot.each((el) => {
      this.onSlotChange(el, settings);
    });
    // on change
    $slot.on('slotchange', (event) => {
      this.onSlotChange(event.target, settings);
    });
  }
  onSlotChange(slotEl, {singularTag, componentSpec, properties}) {
    const nodes = slotEl.assignedNodes();
    const name = slotEl.name || 'default';
    const settings = this.getSettings({componentSpec, properties});
    if(!this.slottedContent) {
      this.slottedContent = {};
    }
    this.slottedContent[name] = nodes;
    if(singularTag) {

      // we use this element to track last-child
      let lastSingularNode;

      const isSingular = (node) => {
        return node.tagName && node.tagName.toLowerCase() == singularTag;
      };
      const addSingularProps = (node) => {
        if(!isSingular(node)) {
          return;
        }
        if(!lastSingularNode) {
          node.setAttribute('first', '');
        }
        node.setAttribute('grouped', '');
        lastSingularNode = node;
        each(componentSpec?.inheritedPluralVariations, (variation) => {
          const pluralVariation = settings[variation];
          if(pluralVariation && !node[variation]) {
            node.setAttribute(variation, pluralVariation);
          }
        });
      };

      /*
        We look a max of two levels deep
        this is because sometimes rendering tools like Astro
        will wrap a component in an arbitrary tag (island).
      */
      nodes.forEach(node => {
        addSingularProps(node);
        each(node.children, addSingularProps);
      });
      if(lastSingularNode) {
        lastSingularNode.setAttribute('last', '');
      }
    }
  }

  /*******************************
           Lit Properties
  *******************************/

  static getProperties({ properties = {}, settings, componentSpec }) {
    if (keys(properties).length) {
      return properties;
    }
    if (componentSpec) {
      properties.class = {
        type: String,
      };
      each(componentSpec.attributes, (attributeValues, attribute) => {
        // this is an easy way to determine if this is a boolean or string attribute
        const sampleValue = attributeValues[0];
        properties[attribute] = WebComponentBase.getPropertySettings(sampleValue);
      });
      each(componentSpec.reverseAttributes, (attributeValues, attribute) => {
        properties[attribute] = { type: String, reflect: false };
      });
    }
    if (settings) {
      each(settings, (defaultValue, name) => {
        // expert mode (this is a settings object not a default value)
        if (defaultValue?.type) {
          properties[name] = settings;
        }
        else {
          properties[name] = WebComponentBase.getPropertySettings(defaultValue);
        }
      });
    }
    return properties;
  }

  static getPropertySettings(value) {
    let property;
    if (isString(value)) {
      property = {
        type: String,
        attribute: true,
      };
    }
    else if (isNumber(value)) {
      property = {
        type: Number,
        attribute: true,
      };
    }
    else if (isBoolean(value)) {
      property = {
        type: Boolean,
        attribute: true,
      };
    }
    else if (isArray(value)) {
      property = {
        type: Array,
        attribute: true,
        reflect: false,
      };
    }
    else if (isPlainObject(value)) {
      property = {
        type: Object,
        attribute: true,
        reflect: false,
      };
    }
    else if (isFunction(value)) {
      property = {
        type: Function,
        attribute: false,
        reflect: false,
      };
    }
    else {
      property = {
        type: String,
        attribute: true,
      };
    }
    //property.hasChanged = isEqual;
    return property;
  }

  /*******************************
      Settings / Template Data
  *******************************/

  /*
    This sets default settings for a component
  */
  setDefaultSettings(settings = {}) {
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
  }


  /*
    This returns a list of settings which may include both html attributes and properties
    as specified in the spec for the component. It will extend them from default settings
  */
  getSettings({componentSpec, properties}) {
    let settings = {};
    each(properties, (propSettings, property) => {
      if (property == 'class' || settings.observe === false) {
        return;
      }
      if(componentSpec && !get(componentSpec.attributes, property) && get(componentSpec.reverseAttributes, property)) {
        // this property is used to lookup a setting like 'large' -> sizing
        // we dont record this into settings
        return;
      }
      const setting = this[property] || this.defaultSettings[property];
      // only pass through setting if it is defined
      if(setting !== undefined) {
        settings[property] = setting;
      }
      // boolean attribute case
      if (componentSpec && settings[this[property]] !== undefined) {
        settings[this[property]] = true;
      }
    });
    return settings;
  }

  /*
    This returns a list of styling classes to pass through to
    the template data context for the component based off
    component attributes
  */
  getUIClasses({componentSpec, properties}) {
    if (!componentSpec) {
      return;
    }
    const classes = [];
    each(properties, (propSettings, property) => {
      if (property == 'class' || propSettings.observe === false) {
        return;
      }
      if(componentSpec && !get(componentSpec.attributes, property) && get(componentSpec.reverseAttributes, property)) {
        return;
      }
      let value = this[property];
      // if the setting has a string value use that as class name
      // i.e. sizing='large' => 'large'
      if(isString(value) && value) {
        if(get(componentSpec.attributes, property) && componentSpec.attributes[property].includes(value)) {
          classes.push(value);
        }
        // components can opt-in to including the attribute as a default class
        if(componentSpec.attributeClasses.includes(property)) {
          classes.push(property);
        }
      }

      // otherwise if this is a boolean property push the property name
      // i.e. <button primary="true" => 'primary'
      else if(isBoolean(value) || value === '') {
        classes.push(property);
      }

    });
    const ignoredValues = ['true', 'false'];
    const classString = unique(classes)
      .filter(value => value && !inArray(value, ignoredValues))
      .join(' ');
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

  /*******************************
            DOM Helpers
  *******************************/

  // Rendered DOM (either shadow or regular)
  $(selector, root = this?.renderRoot || this.shadowRoot) {
    if (!root) {
      console.error('Cannot query DOM until element has rendered.');
    }
    return $(selector, root);
  }

  // Original DOM (used for pulling slotted text)
  $$(selector) {
    return $(selector, this.originalDOM.content);
  }

  // calls callback if defined with consistent params and this context
  call(
    func,
    { firstArg, additionalArgs, args = [this.tpl, this.$.bind(this)] } = {}
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
