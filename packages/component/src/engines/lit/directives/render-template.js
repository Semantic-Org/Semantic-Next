import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';
import { fatal, mapObject } from '@semantic-ui/utils';

// Define directive
export class RenderTemplateDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.renderRoot = partInfo.options?.host?.renderRoot;
    this.template = null;
    this.part = null;
  }
  render({ getTemplateName, subTemplates, data, parentTemplate }) {
    const unpackData = (dataObj) => {
      return mapObject(dataObj, (val) => val());
    };
    const maybeCreateTemplate = () => {

      const templateName = getTemplateName();

      // check if the template name is set and is the same as current
      if (this.template && this.templateName == templateName) {
        return false;
      }
      this.templateName = templateName;

      // find template to render
      const template = subTemplates[templateName];
      if (!template) {
        fatal(
          `Could not find template named "${getTemplateName()}`,
          subTemplates
        );
      }
      // clone if it has changed
      this.template = template.clone({ templateName: templateName, data: unpackData(data) });
      return true;
    };
    const attachTemplate = () => {
      const { parentNode, startNode, endNode } = this.part || {}; // stored from update
      const element = this.part?.options?.host;
      const renderRoot = element?.renderRoot;
      this.template.setElement(element);
      this.template.attach(renderRoot, {
        element,
        parentNode,
        startNode,
        endNode,
      });
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
      const hasCreated = maybeCreateTemplate(); // reactive reference
      if (!comp.firstRun) {
        attachTemplate();
        if (!hasCreated) {
          this.template.setDataContext(unpackData(data), { rerender: false });
        }
        this.setValue(renderTemplate());
      }
    });
    maybeCreateTemplate();
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
export const renderTemplate = directive(RenderTemplateDirective);
