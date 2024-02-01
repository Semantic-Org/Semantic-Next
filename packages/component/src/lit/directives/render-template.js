import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

// Define directive
class RenderTemplate extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.renderRoot = partInfo.options.host.renderRoot;
    this.template = null;
  }
  render({template, data, parentTemplate}) {
    if(parentTemplate) {
      template.setParent(parentTemplate);
    }
    return template.render(data);
  }

  update(part, renderSettings) {
    const template = renderSettings[0].template;
    if(template) {
      this.template = template;
      const {startNode, endNode} = part; // we use this for binding events
      template.attach(part.parentNode, { startNode, endNode });
    }
    return this.render.apply(this, renderSettings);
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
