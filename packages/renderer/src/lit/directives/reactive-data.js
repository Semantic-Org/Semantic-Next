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
    this.expression = expression;
    this.settings = settings;

    /*
      We should be able to reuse reaction between renders
    if (this.reaction) {
      this.reaction.stop();
    }
    */

    // Create a new reaction to rerun the computation function if reactive data updates
    // that dont trigger rerender occur

    if(this.reaction) {
      // if reaction already set up just return value for rerender
      return this.getReactiveValue();
    }
    else {
      // Create a new reaction to rerun the computation function if reactive data updates
      // that dont trigger rerender occur
      let value;
      this.reaction = Reaction.create((computation) => {
        if(!this.isConnected) {
          computation.stop();
          return;
        }
        value = this.getReactiveValue();
        if(this.settings.unsafeHTML) {
          value = unsafeHTML(value);
        }
        if (!computation.firstRun) {
          this.setValue(value);
        }
      });
      return value;
    }
  }

  getReactiveValue() {
    let reactiveValue = this.expression.value();

    // useful for things like <input checked="{{isChecked}}">
    // template compiler does this automatically for boolean attrs
    if(this.settings.ifDefined) {
      if(inArray(reactiveValue, [undefined, null, false, 0])) {
        return ifDefined(undefined);
      }
    }

    // arrays and objects are serialized for use in web component attributes
    // maybe should check part?
    if(isArray(reactiveValue) || isObject(reactiveValue)) {
      reactiveValue = JSON.stringify(reactiveValue);
    }
    return reactiveValue;
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
