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
  render({ getTemplateName, subTemplates, packedData = {}, parentTemplate }) {
    const unpackData = (dataObj) => {
      console.log('unpacking data', dataObj);
      return mapObject(dataObj, (val) => val());
    };
    const isDifferentTemplate = () => {
      return this.templateName !== getTemplateName();
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
    const renderNewTemplate = (data) => {

      const templateName = getTemplateName();
      this.templateName = templateName;

      // find template to render
      const template = subTemplates[templateName];
      if (!template) {
        fatal(
          `Could not find template named "${getTemplateName()}`,
          subTemplates
        );
      }

      // create copy of template prototype
      this.template = template.clone({ data });

      // attach this template to parent element
      attachTemplate();

      return this.template.render();
    };
    const renderTemplate = (data) => {
      // check if we've rendered
      if (isDifferentTemplate()) {
        this.html = renderNewTemplate(data);
      }
      else {
        console.log('template rerender', data);
        this.template.setDataContext(data, { rerender: false });
      }
      return this.html;
    };
    let html;
    Reaction.create((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }
      const templateName = getTemplateName();
      const data = unpackData(packedData);
      console.log('rerun', data);
      html = renderTemplate(data);
      if(isDifferentTemplate()) {
        this.setValue(html);
      }
    });
    return html;
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
