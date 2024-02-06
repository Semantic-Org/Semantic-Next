import { nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { repeat } from 'lit/directives/repeat.js';
import { AsyncDirective } from 'lit/async-directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { hashCode, isObject, isString } from '@semantic-ui/utils';

class ReactiveEachDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.useCache = true;
    this.host = partInfo.options.host;
    this.templateCache = new Map();
  }

  render(eachCondition, data) {
    // Initial setup before the reaction
    this.repeat = this.createRepeat(eachCondition, data);

    if (!this.reaction) {
      this.reaction = Reaction.create((comp) => {
        if(!this.isConnected) {
          comp.stop();
          return;
        }
        const items = this.getItems(eachCondition); // setup reactivity
        if(comp.firstRun) {
          return;
        }
        //this.updateRepeat(items);
        // hack for now
        const render = this.createRepeat(eachCondition, data, items);
        this.setValue(render);
      });
    }
    return this.repeat;
  }

  update(part, settings) {
    this.part = part;
    return this.render.apply(this, settings);
  }

  getItems(eachCondition) {
    let items = eachCondition.over() || [];
    items = items.map(item => {
      if(isObject(item)) {
        item._id = item._id || hashCode(item);
      }
      return item;
    });
    return items;
  }

  updateRepeat(items) {
    // need to implement
  }

  createRepeat(eachCondition, data, items = this.getItems(eachCondition)) {
    if (!items?.length) {
      return nothing;
    }
    return repeat(items, this.getItemID, (item, index) => {
      let template = this;
      if(this.useCache) {
        const cachedTemplate = this.templateCache.get(this.getItemID(item));
        if(cachedTemplate) {
          template = cachedTemplate;
        }
        else {
          template = this.getTemplateContent(item, index, data, eachCondition);
          this.templateCache.set(this.getItemID(item), template);
        }
      }
      else {
        template = this.getTemplateContent(item, index, data, eachCondition);
      }
      return template;
    });
  }

  getTemplateContent(item, index, data, eachCondition) {
    let eachData = this.prepareEachData(item, index, data, eachCondition.as);
    return eachCondition.content(eachData);
  }

  getItemID(item) {
    if(isObject(item)) {
      return item._id || item.id || item.key || item.hash || hashCode(item);
    }
    if(isString) {
      return item;
    }
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
