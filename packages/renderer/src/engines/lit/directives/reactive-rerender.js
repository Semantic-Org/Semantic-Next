import { noChange, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType } from 'lit/directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { isArray, isClient, isObject, wrapFunction } from '@semantic-ui/utils';

export class ReactiveRerenderDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.partInfo = partInfo;
    this.reaction = null;
  }

  render(condition) {
    this.condition = condition;

    // Reuse existing reaction — signals handle updates
    if (this.reaction) {
      return noChange;
    }

    // Create new reaction on client
    if (isClient) {
      this.watchChanges();
    }

    return this.formatForPart(this.condition.content());
  }

  watchChanges() {
    const context = {
      message: `rerender block: {#${this.condition.key ? 'guard' : 'rerender'} ${
        this.condition.keyString || this.condition.expressionString
      }}`,
      rerender: this.condition,
    };

    this.reaction = Reaction.create((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }

      // this guards against the return value of a reactive expression the "key"
      // {#guard expression} -> key=expression
      // {#rerender key=expression} -> key=expressin`
      if (this.condition.keyString) {
        Reaction.guard(() => this.getValue(this.condition.key()));
      }

      // {#rerender expression} - naively add a reactive context to this reaction
      if (this.condition.expressionString) {
        this.getValue(this.condition.expression());
      }

      if (!computation.firstRun) {
        this.setValue(this.formatForPart(this.condition.content()));
      }
    }, { context });
  }

  // PartInfo-aware serialization: attribute parts get a string; CHILD/PROPERTY/
  // EVENT/ELEMENT parts pass content through unchanged so lit places it.
  // Mirrors ReactiveConditionalDirective.formatForPart so rerender behaves
  // identically when it lands in an attribute value.
  formatForPart(content) {
    switch (this.partInfo.type) {
      case PartType.ATTRIBUTE:
      case PartType.BOOLEAN_ATTRIBUTE:
        return this.serializeContent(content);
      default:
        return content;
    }
  }

  serializeContent(content) {
    if (content == null || content === nothing) { return ''; }
    if (content?.strings) {
      const { strings, values } = content;
      let result = '';
      for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
          result += this.resolveValue(values[i]);
        }
      }
      return result;
    }
    if (isArray(content) || isObject(content)) {
      try {
        return JSON.stringify(content);
      }
      catch (e) {
        return String(content);
      }
    }
    return String(content);
  }

  // Inner expressions inside a {#rerender}/{#if} branch land in the
  // TemplateResult's `values` array as lit *directive markers* (the
  // reactiveData directive result), not evaluated primitives — lit
  // normally resolves these when it places the result into a part.
  // For attribute-position serialization we resolve them manually by
  // reaching into the directive's first arg's `.value()` callback,
  // which the LitRenderer attaches in `evaluateExpression`. Nested
  // TemplateResults recurse via serializeContent.
  resolveValue(v) {
    if (v?.values?.[0]?.value && typeof v.values[0].value === 'function') {
      return String(v.values[0].value() ?? '');
    }
    if (v?.strings) {
      return this.serializeContent(v);
    }
    if (isArray(v) || isObject(v)) {
      try {
        return JSON.stringify(v);
      }
      catch (e) {
        return String(v);
      }
    }
    return String(v ?? '');
  }

  // to make sure signal triggers reactivity
  // we want to call accessor from our reaction
  getValue(expression) {
    return wrapFunction(expression)();
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

export const reactiveRerender = directive(ReactiveRerenderDirective);
