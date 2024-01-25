import { noChange, nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';
import { each, hashCode, wrapFunction } from '@semantic-ui/utils';

class ReactiveEachDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }

  render(eachCondition, data) {
    // Ensure existing reaction is stopped
    if (this.reaction) {
      this.reaction.stop();
    }
    let html = nothing;
    this.reaction = Reaction.create((comp) => {
      const values = eachCondition.over();
      console.log('each rerun', values.length);
      if(values?.length) {
        each(values, (value, index) => {
          let eachData = {
            ...data,
            '@index': index,
          };
          if(!value._id) {
            value._id = hashCode(value);
          }
          if(eachCondition.as) {
            eachData[eachCondition.as] = value;
          }
          else {
            eachData = {
              ...eachData,
              ...value
            };
          }
          if(html == nothing) {
            html = [];
            html.push( eachCondition.content(eachData) );
          }
        });
      }

      if(!comp.firstRun) {
        this.setValue(html);
      }
    });
    console.log(html);
    return html;
  }

  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }

  reconnected() {
    // nothing
  }
}

export const reactiveEach = directive(ReactiveEachDirective);
