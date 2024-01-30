import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

// Define directive
class RenderTemplate extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.template = null;
  }
  render({template, data, renderRoot}) {
    if(!this.template) {
      this.template = template;
      if(renderRoot) {
        template.setRoot(renderRoot);
        template.attachEvents();
      }
    }
    let html = this.template.render(data);
    template.onRendered();
    return html;
  }
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
