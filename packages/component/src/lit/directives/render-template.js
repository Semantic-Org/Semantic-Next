import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

// Define directive
class RenderTemplate extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.renderRoot = partInfo.options.host.renderRoot;
    this.template = null;
  }
  render({template, data}) {
    if(!this.template) {
      this.template = template;
      template.attach(this.renderRoot);
    }
    let html = this.template.render(data);
    return html;
  }

  /*
  update(part) {
    if(this.template) {
      template.attach(this.renderRoot);
    }
    return part;
  }
  */

  reconnected() {
    // nothing yet
  }
  disconnected() {
    if (this.template) {
      this.template.onDestroyed();
    }
  }
}
// Create the directive function
export const renderTemplate = directive(RenderTemplate);
