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
  render({getTemplateName, subTemplates, data, parentTemplate}) {
    const getTemplate = () => {
      const templateName = getTemplateName();
      const template = subTemplates[templateName];
      console.log(template);
      return template;
    };
    const renderTemplate = (template, data) => {
      return template.render(data);
    };
    const unpackData = (dataObj) => {
      return mapObject(dataObj, (val) => val());
    };
    Reaction.create((comp) => {
      if(!this.isConnected) {
        comp.stop();
        return;
      }
      const template = getTemplate();
      if(!template) {
        fatal(`Could not find template named "${getTemplateName()}`, subTemplates);
      }

      const templateData = unpackData(data); // data is stored in functions to properly bind to reactivity

      if(template) {
        this.template = template;
        const { parentNode, startNode, endNode} = this.part; // stored from update
        const renderRoot = this.part.options.host?.renderRoot;
        template.attach(renderRoot, { parentNode, startNode, endNode });
        // used for foo.parent()
        if(parentTemplate) {
          template.setParent(parentTemplate);
        }
      }
      if(!comp.firstRun) {
        this.setValue(renderTemplate(template, templateData));
      }
    });
    const template = getTemplate();
    const templateData = unpackData(data);
    return renderTemplate(template, templateData);
  }

  update(part, renderSettings) {
    this.part = part;
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
