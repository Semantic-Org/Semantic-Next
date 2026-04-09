import { noChange, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType } from 'lit/directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { inArray, isArray, isClient, isObject, isServer } from '@semantic-ui/utils';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

// DOM properties that diverge from HTML attributes after user interaction
const BOOLEAN_SYNCED_ATTRS = ['checked', 'selected'];
const STRING_SYNCED_ATTRS = ['value'];

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

    // Reuse existing reaction — signals and dataVersion handle updates
    if (this.reaction) {
      return noChange;
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
    // events need the raw handler reference, {#fn} opts in to literal value
    const needsLiteralValue = this.partInfo.type === PartType.EVENT || this.settings.literalValue;
    let reactiveValue = needsLiteralValue
      ? this.expression.literalValue()
      : this.expression.value();

    // useful for things like <input checked="{{isChecked}}">
    // template compiler does this automatically for boolean attrs
    if (this.settings.ifDefined) {
      if (inArray(reactiveValue, ['', undefined, null, false, 0])) {
        this.syncProperty(reactiveValue);
        return ifDefined(undefined);
      }
    }

    // HTML attrs like checked/selected/value diverge from DOM properties after
    // user interaction — setting the attribute alone won't update the element
    this.syncProperty(reactiveValue);

    return this.formatForPart(reactiveValue);
  }

  syncProperty(value) {
    const name = this.partInfo.name;
    const el = this.__part?.element;
    if (!el) { return; }
    if (inArray(name, BOOLEAN_SYNCED_ATTRS)) {
      const boolValue = Boolean(value);
      if (el[name] !== boolValue) {
        el[name] = boolValue;
      }
    }
    else if (inArray(name, STRING_SYNCED_ATTRS)) {
      const strValue = value ?? '';
      if (el[name] !== strValue) {
        el[name] = strValue;
      }
    }
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
    // Lit calls render() on reconnect which recreates the reaction
  }
}

export const reactiveData = directive(ReactiveDataDirective);
