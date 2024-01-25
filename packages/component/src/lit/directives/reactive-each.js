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
    if (this.reaction) {
      this.reaction.stop();
    }

    this.reaction = Reaction.create(() => {
      const items = eachCondition.over();
      if (!items?.length) {
        this.setValue(nothing);
        return;
      }
      console.log('here');
      this.setValue(repeatValue);
    });


    let repeatValue = repeat(
      items,
      (item) => {
        const hash = item._id || hashCode(item);
        console.log(hash);
        return hash;
      },
      (item, index) => {
        let eachData = this.prepareEachData(item, index, data, eachCondition.as);
        let html = eachCondition.content({});
        console.log(html);
        return html;
      }
    );

    return repeatValue;
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
