import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { each, isClient, isPlainObject, isPromise } from '@semantic-ui/utils';

export class ReactiveRerenderDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.error = null;
  }

  render(condition) {
    // Stop existing reaction
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }

    // Create a new reaction that watches for reactive changes on client
    if (isClient) {
      this.watchChanges(condition);
    }

    // Return initial render
    return this.renderCurrentState(condition);
  }

  watchChanges(condition) {
    // pass through context for debugging
    let context = {
      message: `rerender block: {#rerender ${condition.expression}}`,
      async: condition,
    };

    this.reaction = Reaction.create((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }

      // Evaluate the expression to get the promise or value
      const expressionResult = condition.expression();

      // Rerender on any reactive change.
      if (!computation.firstRun) {
        this.setValue(expression.content());
      }
    }, { context });
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

export const reactiveAsync = directive(ReactiveRerenderDirective);
