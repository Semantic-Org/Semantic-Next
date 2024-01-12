import { LitElement, unsafeCSS } from 'lit';
import { isFunction, isObject, extend } from './utils';
import { $ } from './query';

class UIComponent extends LitElement {

  /*
    SUI lets you specify if you want to use light dom via attribute
  */

  static scopedStyleSheet = null;


  createRenderRoot() {
    const useLight = false;
    if(useLight) {
      this.applyScopedStyles(this.tagName, this.css);
      return this;
    }
    else {
      const renderRoot = super.createRenderRoot(this.css);
      return renderRoot;
    }
  }

  applyScopedStyles(scopeSelector, css) {
    if (!this.scopedStyleSheet) {
      const scopedCSS = this.scopeStyles(css, scopeSelector);
      this.scopedStyleSheet = new CSSStyleSheet();
      this.scopedStyleSheet.replaceSync(scopedCSS);
    }
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, this.scopedStyleSheet];
  }

  scopeStyles(css, scopeSelector = '') {
    scopeSelector = scopeSelector.toLowerCase();
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.appendChild(document.createTextNode(css));
    const sheet = style.sheet;
    let modifiedRules = [];
    for (let i = 0; i < sheet.cssRules.length; i++) {
      let rule = sheet.cssRules[i];
      switch (rule.type) {
        case CSSRule.STYLE_RULE:
          // Handle regular style rules
          modifiedRules.push(this.scopeRule(rule, scopeSelector));
          break;
        case CSSRule.MEDIA_RULE:
        case CSSRule.SUPPORTS_RULE:
          // Handle @media and @supports which contain nested rules
          let scopedInnerRules = [];
          Array.from(rule.cssRules).forEach(innerRule => {
            scopedInnerRules.push(scopeRule(innerRule, scopeSelector));
          });
          modifiedRules.push(`@${rule.name} ${rule.conditionText} { ${scopedInnerRules.join(' ')} }`);
          break;
        default:
          // push all other rules through verbatim
          modifiedRules.push(rule.cssText);
          break;
      }
    }
    document.head.removeChild(style);
    const scopedCSS = modifiedRules.join('\n');
    return scopedCSS;
  }

  scopeRule(rule, scopeSelector) {
    const modifiedSelector = `${scopeSelector} ${rule.selectorText}`;
    return `${modifiedSelector} { ${rule.style.cssText} }`;
  }


  /*******************************
         Settings / Attrs
  *******************************/

  get defaultSettings() {
    return {};
  }

  /*******************************
           DOM Helpers
  *******************************/

  queryScoped(selector) {
    return this.renderRoot.querySelector(selector);
  }

  queryAllScoped(selector) {
    return this.renderRoot.querySelectorAll(selector);
  }

  // Shadow DOM
  $(selector) {
    // Query is a simply $ jQuery like wrapper for
    // chaining utility functions on DOM nodes
    return $(selector, this?.renderRoot);
  }

  // DOM
  $$(selector) {
    return $(selector, this);
  }

}

export { UIComponent };
