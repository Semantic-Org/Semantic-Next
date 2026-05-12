import { Reaction } from '@semantic-ui/reactivity';
import { each, isClient } from '@semantic-ui/utils';
import { noChange, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType } from 'lit/directive.js';

import { serializeContent } from './serialize-content.js';

export class ReactiveConditionalDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.partInfo = partInfo;
    this.reaction = null;
  }

  render(conditional) {
    this.conditional = conditional;

    // Reuse existing reaction — signals and dataVersion handle updates
    if (this.reaction) {
      return noChange;
    }

    let content = nothing;
    let initialFormatted = nothing;
    let context = {
      message: `if/else statement: {#if ${conditional.expression}}`,
      conditional: conditional,
    };

    // Create a new reaction that watches for reactive changes on client.
    // formatForPart is invoked INSIDE the reaction (even on firstRun) so
    // its serialization reads — which call .value() on inner directive
    // markers — register signal deps on this reaction. Without that,
    // inner expressions in a branch never propagate signal changes
    // through this directive's setValue.
    // matchIndex gating is intentionally absent — content can change
    // within the same branch when inner expressions update.
    if (isClient) {
      this.reaction = Reaction.create((comp) => {
        if (!this.isConnected) {
          comp.stop();
          return;
        }

        const result = this.getBranch(this.conditional);
        this.matchIndex = result.matchIndex;
        content = result.content;
        const formatted = this.formatForPart(content);
        if (comp.firstRun) {
          initialFormatted = formatted;
        }
        else {
          this.setValue(formatted);
        }
        return content;
      }, { context });
    }
    else {
      const result = this.getBranch(this.conditional);
      content = result.content;
      initialFormatted = this.formatForPart(content);
    }

    return initialFormatted;
  }

  getBranch(conditional) {
    let matchIndex = -1;
    let content;
    if (conditional.condition()) {
      content = conditional.content();
      matchIndex = 1000; // special index for if condition
    }
    else if (conditional.branches?.length) {
      // evaluate each elseif/else branch
      each(conditional.branches, (branch, index) => {
        if (matchIndex === -1) {
          if (branch.type == 'elseif' && branch.condition()) {
            matchIndex = index;
            content = branch.content();
          }
          else if (branch.type == 'else') {
            matchIndex = index;
            content = branch.content();
          }
        }
      });
    }
    else {
      content = nothing;
      delete this.matchIndex;
    }
    if (!content) {
      content = nothing;
    }
    return { matchIndex, content };
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

export const reactiveConditional = directive(ReactiveConditionalDirective);
