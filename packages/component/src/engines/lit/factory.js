import { unsafeCSS } from 'lit';
import { LitWebComponentBase } from './base.js';

/*
  Factory that creates a web component class for the Lit rendering path.
  Same shape as createComponent — sets static config on the generated class.
  All Lit-specific lifecycle lives on LitWebComponentBase.
*/

export function createLitComponent({
  prototypeTemplate, resolvedProperties, css, delegatesFocus,
  componentSpec, defaultSettings, plural,
  onAttributeChanged, renderingEngine,
}) {
  const component = class extends LitWebComponentBase {
    static get styles() {
      return unsafeCSS(css);
    }

    static shadowRootOptions = { ...this.shadowRootOptions, delegatesFocus };
  };

  component.template = prototypeTemplate;
  component.config = {
    resolvedProperties,
    componentSpec,
    defaultSettings,
    css,
    plural,
    onAttributeChanged,
    renderingEngine,
  };
  component.properties = resolvedProperties;

  return component;
}
