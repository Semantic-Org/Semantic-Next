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
    // Stop existing reaction
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }

    // Create new reaction on client
    if (isClient) {
      this.watchChanges(condition);
    }

    return condition.content();
  }

  watchChanges(condition) {
    const context = {
      message: `rerender block: {#${condition.key ? 'guard' : 'rerender'} ${
        condition.keyString || condition.expressionString
      }}`,
      rerender: condition,
    };

    this.reaction = Reaction.create((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }

      // this guards against the return value of a reactive expression the "key"
      // {#guard expression} -> key=expression
      // {#rerender key=expression} -> key=expressin`
      if (condition.keyString) {
        Reaction.guard(() => this.getValue(condition.key()));
      }

      // {#rerender expression} - naively add a reactive context to this reaction
      if (condition.expressionString) {
        this.getValue(condition.expression());
      }

      if (!computation.firstRun) {
        this.setValue(condition.content());
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
