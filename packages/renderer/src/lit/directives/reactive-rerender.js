import { noChange, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { isClient, wrapFunction } from '@semantic-ui/utils';

export class ReactiveRerenderDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }

  render(condition) {
    this.condition = condition;

    // Reuse existing reaction — just re-render with current closures
    if (this.reaction) {
      return this.condition.content();
    }

    // Create new reaction on client
    if (isClient) {
      this.watchChanges();
    }

    return this.condition.content();
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
        this.setValue(this.condition.content());
      }
    }, { context });
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
    // Reaction will be recreated in next render
  }
}

export const reactiveRerender = directive(ReactiveRerenderDirective);
