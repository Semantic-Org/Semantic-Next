import { nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Reaction } from '@semantic-ui/reactivity';
import { isArray, isObject, inArray } from '@semantic-ui/utils';
import { ifDefined } from 'lit/directives/if-defined.js';

export class ReactiveDataDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.partInfo = partInfo;
    this.reaction = null;
  }

  render(expression, settings = {}) {
    // Stop and clean up any existing reaction
    if (this.reaction) {
      this.reaction.stop();
    }

    const getValue = (value) => {
      let reactiveValue = expression.value();
      if(settings.ifDefined) {
        // useful for things like <input checked="{{isChecked}}">
        // template compiler does this automatically for boolean attrs
        if(inArray(reactiveValue, [undefined, null, false, 0])) {
          return ifDefined(undefined);
        }
      }
      // we need to serialize arrays and objects that are rendered to html
      if(isArray(reactiveValue) || isObject(reactiveValue)) {
        reactiveValue = JSON.stringify(reactiveValue);
      }
      return reactiveValue;
    };

    // Create a new reaction to rerun the computation function
    let value;
    if (this.reaction) {
      this.reaction.stop();
    }
    this.reaction = Reaction.create((computation) => {
      if(!this.isConnected) {
        computation.stop();
        return;
      }
      value = getValue();
      if(settings.unsafeHTML) {
        value = unsafeHTML(value);
      }
      if (!computation.firstRun) {
        this.setValue(value);
      }
    });
    // Return the initial result of the computation function
    return value;
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

export const reactiveData = directive(ReactiveDataDirective);
