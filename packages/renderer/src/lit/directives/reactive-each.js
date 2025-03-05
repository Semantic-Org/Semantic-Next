import { nothing } from 'lit';
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
      if (!computation.firstRun) {
        const rendered = this.renderItems();
        this.setValue(rendered);
      }
    });

    return this.renderItems();
  }

  renderItems() {
    const items = this.getItems(this.eachCondition);
    if(!items?.length > 0 && this.eachCondition.else) {
      // this is necessary to avoid lit errors
      return repeat(
        [1],
        () => 'else-case',
        () => this.eachCondition.else()
      );
    }
    return repeat(
      items,
      (item, index) => (this.getItemID(item, index)),
      (item, index) => this.getTemplate(item, index)
    );
  }

  getItems() {
    return this.eachCondition.over() || [];
  }

  getTemplate(item, index) {
    const templateData = this.getEachData(item, index, this.eachCondition);
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

  getEachData(item, index, eachCondition) {
    const { as, indexAs = 'index' } = eachCondition;
    // if 'as' is specified we pass the whole value as an item
    // otherwise we spread the value to data context
    return as
      ? { [as]: item, [indexAs]: index }
      : { ...item, this: item, [indexAs]: index };
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
