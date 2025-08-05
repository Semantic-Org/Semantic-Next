import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { isClient } from '@semantic-ui/utils';

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

    return this.renderCurrentState(condition);
  }

  watchChanges(condition) {
    const context = {
      message: `rerender block: {#${condition.keyOnly ? 'guard' : 'rerender'} ${condition.expression}}`,
      rerender: condition,
    };

    this.reaction = Reaction.create((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }

      // this guards against the return value of a reactive expression the "key"
      // {#guard expression} -> key=expression
      // {#rerender key=expression} -> key=expressin
      if (condition.key) {
        Reaction.guard(condition.key);
      }
      // {#rerender expression} - naively add a reactive context to this reaction
      if(condition.expression) {
        condition.expression();
      }

      // Rerender on reactive changes (after first run)
      if (!computation.firstRun) {
        this.setValue(condition.content());
      }
    }, { context });
  }

  renderCurrentState(condition) {
    return condition.content();
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
