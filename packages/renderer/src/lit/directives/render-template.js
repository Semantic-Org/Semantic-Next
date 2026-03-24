import { Reaction } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import { isClient, isString, mapObject } from '@semantic-ui/utils';
import { noChange, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

// Define directive
export class RenderTemplateDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.renderRoot = partInfo.options?.host?.renderRoot;
    this.template = null;
    this.part = null;
  }

  render({ getTemplate, templateName, subTemplates, data, parentTemplate }) {
    this.parentTemplate = parentTemplate;
    this.getTemplate = getTemplate;
    this.subTemplates = subTemplates;
    this.data = data;
    this.ast = null;

    // Reuse existing reaction — signals and dataVersion handle updates
    if (this.reaction) {
      return noChange;
    }

    // Create a new reaction that watches for reactive changes on client
    if (isClient) {
      this.watchChanges();
    }

    this.maybeCreateTemplate();

    // this is an empty template
    if (!this.template || this.template?.ast.length == 0) {
      return nothing;
    }
    return this.renderTemplate();
  }

  watchChanges() {
    if (this.reaction) {
      this.reaction.stop();
    }
    this.reaction = Reaction.create((reaction) => {
      this.maybeCreateTemplate(); // reactive reference to template
      const dataContext = this.unpackData(this.data); // reactive reference to data

      // end reaction if element destroyed
      if (!this.isConnected) {
        reaction.stop();
        return;
      }

      // first run handled by main path
      if (reaction.firstRun) {
        return;
      }

      const template = this.template;

      // this is an empty template
      if (!template || template?.ast.length == 0) {
        return;
      }

      // add debug context
      reaction.addContext({
        message: `template ${template?.templateName} data context`,
        dataContext: dataContext,
        template: template,
      });

      const html = this.renderTemplate(dataContext);
      this.setValue(html);
    });
  }

  renderTemplate(dataContext) {
    this.attachTemplate();
    if (!dataContext) {
      dataContext = this.unpackData(this.data);
    }
    this.template.setDataContext(dataContext, { rerender: false });
    return this.template.render();
  }

  maybeCreateTemplate() {
    // expression can evaluate to a template or a string
    // in the case of a string we will pull from subtemplates
    let templateName;
    let template;

    const templateOrName = this.getTemplate();
    // find template to render
    if (isString(templateOrName)) {
      templateName = templateOrName;
      template = this.subTemplates[templateName];
    }
    else if (templateOrName instanceof Template) {
      // support passing in full templates using expressions
      template = templateOrName;
      templateName = template.templateName;
    }

    // make sure we have something to create
    if (!template) {
      return false;
    }

    // Preserve existing clone when the same prototype is reused.
    if (this.template && this.templateID === template.id) {
      return;
    }

    // store template id
    this.templateID = template.id;
    this.template = template.clone({
      templateName,
      subTemplates: this.subTemplates,
      data: this.unpackData(this.data),
      parentTemplate: this.parentTemplate,
    });
  }

  attachTemplate() {
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
    if (this.parentTemplate) {
      this.template.setParent(this.parentTemplate);
    }
  }

  unpackData(dataObj) {
    return mapObject(dataObj, (val) => val());
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
