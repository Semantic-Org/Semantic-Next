import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

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
        if (this.settings.unsafeHTML) {
          value = unsafeHTML(value);
        }
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
      if (this.settings.unsafeHTML) {
        value = unsafeHTML(value);
      }
      if (!computation.firstRun) {
        this.setValue(value);
      }
    }, { context });

    // this returns the value for perf
    // otherwise we calculate twice on first run
    return value;
  }

  getReactiveValue() {
    let reactiveValue = this.expression.value();

    // useful for things like <input checked="{{isChecked}}">
    // template compiler does this automatically for boolean attrs
    if (this.settings.ifDefined) {
      if (inArray(reactiveValue, ['', undefined, null, false, 0])) {
        return ifDefined(undefined);
      }
    }

    // arrays and objects are serialized for use in web component attributes
    // maybe should check part?
    if (isArray(reactiveValue) || isObject(reactiveValue)) {
      try {
        reactiveValue = JSON.stringify(reactiveValue);
      }
      catch (e) {
        // non serializable
      }
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
