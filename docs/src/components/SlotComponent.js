import { html, LitElement } from 'lit';

export default class SlotElement extends LitElement {
  render() {
    return html`<slot>Test</slot>`;
  }
}

customElements.define('slot-element', SlotElement);
