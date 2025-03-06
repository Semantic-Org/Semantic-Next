import { nothing, noChange } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';
import { isString, isEqual, mapObject } from '@semantic-ui/utils';
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
    this.parentTemplate = parentTemplate;
    this.getTemplate = getTemplate;
    this.subTemplates = subTemplates;
    this.data = data;
    this.ast = null;

    this.reaction = Reaction.create((computation) => {
      this.maybeCreateTemplate(); // reactive reference to template
      const dataContext = this.unpackData(this.data); // reactive reference to data

      // end computation if element destroyed
      if (!this.isConnected) {
        computation.stop();
        return;
      }
      // first run handled by main path
      if(computation.firstRun) {
        return;
      }
      // this is an empty template
      if(!this.template || this.template?.ast.length == 0) {
        return;
      }

      const html = this.renderTemplate(dataContext);
      this.setValue(html);
    });

    this.maybeCreateTemplate();

    // this is an empty template
    if(!this.template || this.template?.ast.length == 0) {
      return nothing;
    }
    return this.renderTemplate();
  }

  renderTemplate(dataContext) {
    this.attachTemplate();
    if(!dataContext) {
      dataContext = this.unpackData(this.data);
    }
    this.template.setDataContext(dataContext);
    return this.template.render();
  }

  maybeCreateTemplate() {
    // expression can evaluate to a template or a string
    // in the case of a string we will pull from subtemplates
    let templateName;
    let template;

    const templateOrName = this.getTemplate();
    // find template to render
    if(isString(templateOrName)) {
      templateName = templateOrName;
      template = this.subTemplates[templateName];
    }
    else if(templateOrName instanceof Template) {
      // support passing in full templates using expressions
      template = templateOrName;
      templateName = template.templateName;
    }

    // make sure we have something to create
    if (!template) {
      return false;
    }

    // store template id
    this.templateID = template.id;
    this.template = template.clone({
      templateName,
      subTemplates: this.subTemplates,
      data: this.unpackData(this.data)
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
