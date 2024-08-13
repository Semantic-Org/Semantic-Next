import { repeat } from 'lit/directives/repeat.js';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';

import { isPlainObject, isString } from '@semantic-ui/utils';

export class ReactiveEachDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.items = [];
    this.eachCondition = null;
  }

  render(eachCondition, settings = {}) {
    this.eachCondition = eachCondition;

    // Stop existing reaction
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }

    // Create a new reaction
    this.reaction = Reaction.create((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }
      this.items = this.getItems(this.eachCondition);
      const rendered = this.renderItems();
      if (!computation.firstRun) {
        this.setValue(rendered);
      }
    });

    return this.renderItems();
  }

  renderItems() {
    return repeat(
      this.items,
      (item, index) => this.getItemID(item, index),
      (item, index) => this.getTemplate(item, index)
    );
  }

  getItems() {
    return this.eachCondition.over() || [];
  }

  getTemplate(item, index) {
    const templateData = this.getEachData(item, index, this.eachCondition.as);
    return this.eachCondition.content(templateData);
  }

  getItemID(item, index) {
    if (isPlainObject(item)) {
      return item._id || item.id || item.value || item.key || item.hash || item._hash || index;
    }
    if (isString(item)) {
      return item;
    }
    return index;
  }

  getEachData(item, index, alias) {
    return alias
      ? { [alias]: item, '@index': index }
      : { ...item, this: item, '@index': index };
  }


  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }

  reconnected() {
    // The reaction will be recreated in the next render
  }
}

export const reactiveEach = directive(ReactiveEachDirective);
