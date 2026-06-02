import { noChange, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType } from 'lit/directive.js';

import { guard, reaction } from '@semantic-ui/reactivity';
import { isClient, wrapFunction } from '@semantic-ui/utils';

import { serializeContent } from './serialize-content.js';

export class ReactiveRerenderDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.partInfo = partInfo;
    this.reaction = null;
  }

  render(condition) {
    this.condition = condition;

    if (this.reaction) {
      return noChange;
    }

    let initialFormatted = nothing;
    const context = {
      message: `rerender block: {#${this.condition.key ? 'guard' : 'rerender'} ${
        this.condition.keyString || this.condition.expressionString
      }}`,
      rerender: this.condition,
    };

    if (isClient) {
      this.reaction = reaction((computation) => {
        if (!this.isConnected) {
          computation.stop();
          return;
        }

        // Outer guard/key reactivity.
        // {#guard expression} -> key=expression
        // {#rerender key=expression} -> key=expression
        if (this.condition.keyString) {
          guard(() => this.getValue(this.condition.key()));
        }
        if (this.condition.expressionString) {
          this.getValue(this.condition.expression());
        }

        const formatted = this.formatForPart(this.condition.content());
        if (computation.firstRun) {
          initialFormatted = formatted;
        }
        else {
          this.setValue(formatted);
        }
      }, { context });
    }
    else {
      initialFormatted = this.formatForPart(this.condition.content());
    }

    return initialFormatted;
  }

  formatForPart(content) {
    switch (this.partInfo.type) {
      case PartType.ATTRIBUTE:
      case PartType.BOOLEAN_ATTRIBUTE:
        return serializeContent(content);
      default:
        return content;
    }
  }

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
