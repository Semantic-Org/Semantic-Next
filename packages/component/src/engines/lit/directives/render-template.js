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
    const renderNewTemplate = () => {

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
      this.template = template.clone({ data: unpackData(data) });

      // attach this template to parent element
      attachTemplate();

      return this.template.render();
    };
    const renderTemplate = () => {
      // check if we've rendered
      if (isDifferentTemplate()) {
        this.html = renderNewTemplate();
      }
      else {
        console.log('template rerender');
        this.template.setDataContext(unpackData(data), { rerender: false });
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
      unpackData(data);
      console.log('rerun');
      html = renderTemplate();
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
