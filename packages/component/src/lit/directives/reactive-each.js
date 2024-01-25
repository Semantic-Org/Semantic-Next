import { noChange, html, nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { repeat } from 'lit/directives/repeat.js';
import { AsyncDirective } from 'lit/async-directive.js';

import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';
import { each, hashCode, values } from '@semantic-ui/utils';

class ReactiveEachDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.itemTemplates = new Map();
  }

  render(eachCondition, data) {
    if (this.reaction) {
      this.reaction.stop();
    }

    this.reaction = Reaction.create((comp) => {
      const items = eachCondition.over();
      const newTemplates = new Map();

      if (items?.length) {
        each(items, (item, index) => {
          let uniqueId = this.getUniqueId(item);
          let template = this.itemTemplates.get(uniqueId);

          if (!template) {
            // Create a new template for new items
            let eachData = this.prepareEachData(item, index, data, eachCondition.as);
            console.log('creating template', eachData);
            template = eachCondition.content(eachData);
          }
          else {
            console.log('reusing template', index);
          }

          newTemplates.set(uniqueId, template);
        });
      }

      // Update the item templates map for the next run
      this.itemTemplates = newTemplates;

      if (!comp.firstRun) {
        this.setValue(this.joinTemplates(newTemplates));
      }
    });

    return this.joinTemplates(this.itemTemplates);
  }

  getUniqueId(item) {
    return item._id || hashCode(item); // Ensure each item has a unique identifier
  }

  joinTemplates(templates) {
    return html`${Array.from(templates.values())}`;
  }

  prepareEachData(item, index, data, alias) {
    return (alias)
      ? {
        ...data,
        [alias]: item,
        '@index': index
      }
      : {
        ...data,
        ...item,
        '@index': index
      }
    ;
  }

  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }
}

export const reactiveEach = directive(ReactiveEachDirective);
