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
    this.parts = new Map();
  }

  render(eachCondition, data) {
    // Initial setup before the reaction
    const initialRender = this.createRepeat(eachCondition, data);

    if (!this.reaction) {
      this.reaction = Reaction.create(() => {
        const items = this.getItems(eachCondition); // setup reactivity
        if(this.firstRun) {
          return;
        }
        const render = this.createRepeat(eachCondition, data, items);
        this.setValue(render);
      });
    }
    return initialRender;
  }

  getItems(eachCondition) {
    let items = eachCondition.over();
    items = items.map(item => {
      item._id = item._id || hashCode(item);
      return item;
    });
    return items;
  }

  createRepeat(eachCondition, data, items = this.getItems(eachCondition)) {
    if (!items?.length) {
      return nothing;
    }
    return repeat(items, this.getPartID, (item, index) => {
      let part = this.parts.get(item._id);
      if(part) {
        // used cached template
        return part;
      }
      else {
        // render template
        part = this.getPartContent(item, index, data, eachCondition);
        this.parts.set(item._id, part);
      }
      return part;
    });
  }

  getPartContent(item, index, data, eachCondition) {
    let eachData = this.prepareEachData(item, index, data, eachCondition.as);
    return eachCondition.content(eachData);
  }

  getPartID(item) {
    return item._id || hashCode(item);
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
