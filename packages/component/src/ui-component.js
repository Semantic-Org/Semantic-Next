import { LitElement, unsafeCSS } from 'lit';
import { each, isFunction, isObject, extend } from '@semantic-ui/utils';
import { $ } from '@semantic-ui/query';

import { scopeStyles } from './styles';


class UIComponent extends LitElement {

  // for use with light dom rendering
  static scopedStyleSheet = null;

  useLight = false;

  createRenderRoot() {
    this.useLight = (this.getAttribute('expose') !== null);
    if(this.useLight) {
      this.applyScopedStyles(this.tagName, this.css);
      this.storeOriginalContent.apply(this);
      return this;
    }
    else {
      const renderRoot = super.createRenderRoot(this.css);
      return renderRoot;
    }
  }
  applyScopedStyles(scopeSelector, css) {
    if (!this.scopedStyleSheet) {
      const scopedCSS = scopeStyles(css, scopeSelector);
      this.scopedStyleSheet = new CSSStyleSheet();
      this.scopedStyleSheet.replaceSync(scopedCSS);
    }
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, this.scopedStyleSheet];
  }

  storeOriginalContent() {
    this.originalDOM = document.createElement('template');
    this.originalDOM.innerHTML = this.innerHTML;
    this.innerHTML = '';
  }

  slotContent() {
    const $slots =  this.$('slot');
    $slots.each(($slot) => {
      let html;
      if($slot.attr('name')) {
        const $slotContent = this.$$(`[slot="${slotName}"]`);
        if($slotContent.length) {
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
      if($slot && html) {
        $slot.html(html);
      }
    });
  }

  firstUpdated() {
    super.firstUpdated();
  }

  updated() {
    super.updated();
    if(this.useLight) {
      this.slotContent();
    }
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

  // Rendered DOM (either shadow or regular)
  $(selector) {
    return $(selector, this?.renderRoot);
  }

  // Original DOM (used for pulling slotted text)
  $$(selector) {
    return $(selector, this.originalDOM.content);
  }

}

export { UIComponent };
