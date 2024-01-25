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
  }

  render(eachCondition, data) {
    // Initial setup before the reaction
    let initialRender = this.setupRender(eachCondition, data);
    if (!this.reaction) {
      this.reaction = Reaction.create(() => {
        this.setValue(this.setupRender(eachCondition, data));
      });
    }
    return initialRender;
  }

  setupRender(eachCondition, data) {
    const items = eachCondition.over();
    return this.setupRenderContent(items, eachCondition, data);
  }

  setupRenderContent(items, eachCondition, data) {
    if (!items?.length) {
      return nothing;
    }
    return repeat(
      items,
      (item) => item._id || hashCode(item),
      (item, index) => {
        let eachData = this.prepareEachData(item, index, data, eachCondition.as);
        return eachCondition.content(eachData);
      }
    );
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
