import { noChange } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';
import { fatal, isString, mapObject } from '@semantic-ui/utils';
import { Template } from '@semantic-ui/templating';

// Define directive
export class RenderTemplateDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.renderRoot = partInfo.options?.host?.renderRoot;
    this.template = null;
    this.part = null;
  }
  render({ getTemplate, templateName, subTemplates, data, parentTemplate }) {
    const unpackData = (dataObj) => {
      return mapObject(dataObj, (val) => val());
    };
    const maybeCreateTemplate = () => {

      // expression can evaluate to a template or a string
      // in the case of a string we will pull from subtemplates
      let templateName;
      let template;

      const templateOrName = getTemplate();

      // find template to render
      if(isString(templateOrName)) {
        templateName = templateOrName;
        template = subTemplates[templateName];
        if (!template) {
          fatal(
            `Could not find template named "${templateName}"`,
            subTemplates
          );
          return false;
        }
      }
      else if(templateOrName instanceof Template) {
        // support passing in full templates using expressions
        template = templateOrName;
        templateName = template.templateName;
      }

      // avoid recreating prototype if rendered already
      if(templateName == this.templateName) {
        return false;
      }
      this.templateName = templateName;

      // clone if it has changed
      this.template = template.clone({ templateName, subTemplates, data: unpackData(data) });
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

    if (this.reaction) {
      return noChange;
    }

    this.reaction = Reaction.create((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }

      const hasCreated = maybeCreateTemplate(); // reactive reference
      const dataContext = unpackData(data); // reactive reference
      if (!computation.firstRun) {
        attachTemplate();
        this.template.setDataContext(dataContext, { rerender: true });
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
