import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { inArray } from '@semantic-ui/utils';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

class ReactiveData extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }

  render(computeFunc, settings = {}) {
    // Stop and clean up any existing reaction
    if (this.reaction) {
      this.reaction.stop();
    }

    const getValue = (value) => {
      let reactiveValue = computeFunc();

      if (settings.ifDefined) {
        // useful for things like <input checked="{{isChecked}}">
        // template compiler does this automatically for boolean attrs
        if (inArray(reactiveValue, [undefined, null, false, 0])) {
          return ifDefined(undefined);
        }
      }
      return reactiveValue;
    };

    // Create a new reaction to rerun the computation function
    let value;
    this.reaction = Reaction.create((comp) => {
      if (!this.isConnected) {
        comp.stop();
        return;
      }
      value = getValue();
      if (settings.unsafeHTML) {
        value = unsafeHTML(value);
      }
      if (!comp.firstRun) {
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

export const reactiveData = directive(ReactiveData);
