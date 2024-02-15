import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';
import { fatal, mapObject } from '@semantic-ui/utils';

// Define directive
class RenderTemplate extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.renderRoot = partInfo.options.host.renderRoot;
    this.template = null;
    this.part = null;
  }
  render({ getTemplateName, subTemplates, data, parentTemplate }) {
    const unpackData = (dataObj) => {
      return mapObject(dataObj, (val) => val());
    };
    const cloneTemplate = () => {
      const templateName = getTemplateName();
      if (this.template && this.templateName == templateName) {
        return false;
      }
      this.templateName = templateName;
      const template = subTemplates[templateName];
      if (!template) {
        fatal(`Could not find template named "${getTemplateName()}`, subTemplates);
      }
      this.template = template.clone({ data: unpackData(data) });
      return true;
    };
    const attachTemplate = () => {
      const { parentNode, startNode, endNode } = this.part; // stored from update
      const renderRoot = this.part.options.host?.renderRoot;
      this.template.attach(renderRoot, { parentNode, startNode, endNode });
      if (parentTemplate) {
        this.template.setParent(parentTemplate);
      }
    };
    const renderTemplate = () => {
      let html = this.template.render();
      return html;
    };
    Reaction.create((comp) => {
      if (!this.isConnected) {
        comp.stop();
        return;
      }
      const isCloned = cloneTemplate(); // reactive reference
      if (!comp.firstRun) {
        attachTemplate();
        if (!isCloned) {
          this.template.setDataContext(unpackData(data));
        }
        this.setValue(renderTemplate());
      }
    });
    cloneTemplate();
    attachTemplate();
    this.template.setDataContext(unpackData(data));
    return renderTemplate();
  }

  update(part, settings) {
    this.part = part;
    return this.render.apply(this, settings);
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
