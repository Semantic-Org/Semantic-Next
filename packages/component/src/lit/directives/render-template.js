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
    console.log('render called');
    const unpackData = (dataObj) => {
      return mapObject(dataObj, (val) => val());
    };
    const cloneTemplate = () => {
      const templateName = getTemplateName();
      const template = subTemplates[templateName];
      if(!template) {
        fatal(`Could not find template named "${getTemplateName()}`, subTemplates);
      }
      this.template = template.clone({ data: unpackData(data) });
    };
    const attachTemplate = () => {
      const { parentNode, startNode, endNode} = this.part; // stored from update
      const renderRoot = this.part.options.host?.renderRoot;
      this.template.attach(renderRoot, { parentNode, startNode, endNode });
      if(parentTemplate) {
        this.template.setParent(parentTemplate);
      }
    };
    const renderTemplate = () => {
      return this.template.render();
    };
    Reaction.create((comp) => {
      if(!this.isConnected) {
        comp.stop();
        return;
      }
      cloneTemplate(); // reactive reference
      if(!comp.firstRun) {
        attachTemplate();
        this.setValue(renderTemplate());
      }
    });
    cloneTemplate();
    attachTemplate();
    return renderTemplate();
  }

  update(part, renderSettings) {
    this.part = part;
    console.log('update called', part);
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
