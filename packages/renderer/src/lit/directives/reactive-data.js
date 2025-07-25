import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType } from 'lit/directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { inArray, isArray, isClient, isObject, isServer } from '@semantic-ui/utils';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class ReactiveDataDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.partInfo = partInfo;
    this.reaction = null;
  }

  render(expression, settings = {}) {
    this.expression = expression;
    this.settings = settings;

    // debug reactivity is a special expression which should not
    // trace itself or create its own reaction
    if (expression.expression == 'debugReactivity') {
      return this.expression.value();
    }

    // Create a new reaction to rerun the computation function if reactive data updates
    // that dont trigger rerender occur
    if (this.reaction) {
      // if reaction already set up just return value for rerender
      return this.getReactiveValue();
    }
    else {
      // Create a new reaction to rerun the computation function if reactive data updates
      // that dont trigger rerender occur
      let value;
      if (isClient) {
        value = this.watchChanges();
      }
      else {
        value = this.getReactiveValue();
      }
      return value;
    }
  }

  watchChanges() {
    const context = {
      message: `expression: {${this.expression.expression}}`,
      expression: this.expression.expression,
    };
    let value;
    this.reaction = Reaction.create((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }
      value = this.getReactiveValue();
      if (!computation.firstRun) {
        this.setValue(value);
      }
    }, { context });

    // this returns the value for perf
    // otherwise we calculate twice on first run
    return value;
  }

  getReactiveValue() {
    // if we are binding to an event we need the func handler
    // and not the value returned
    let reactiveValue = (this.partInfo.type == PartType.EVENT)
      ? this.expression.literalValue()
      : this.expression.value();

    // useful for things like <input checked="{{isChecked}}">
    // template compiler does this automatically for boolean attrs
    if (this.settings.ifDefined) {
      if (inArray(reactiveValue, ['', undefined, null, false, 0])) {
        return ifDefined(undefined);
      }
    }

    return this.formatForPart(reactiveValue);
  }

  formatForPart(reactiveValue) {
    switch (this.partInfo.type) {
      case PartType.PROPERTY:
        return reactiveValue;

      case PartType.ATTRIBUTE:
      case PartType.BOOLEAN_ATTRIBUTE:
      default:
        // Attributes need serialization for objects/arrays
        if (isArray(reactiveValue) || isObject(reactiveValue)) {
          try {
            reactiveValue = JSON.stringify(reactiveValue);
          }
          catch (e) {
            // non serializable - convert to string
            reactiveValue = String(reactiveValue);
          }
        }

        if (this.settings.unsafeHTML) {
          reactiveValue = unsafeHTML(reactiveValue);
        }

        return reactiveValue;
    }
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
