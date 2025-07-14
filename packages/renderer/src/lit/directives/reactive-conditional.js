import { Reaction } from '@semantic-ui/reactivity';
import { each, isClient } from '@semantic-ui/utils';
import { nothing, noChange } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

export class ReactiveConditionalDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }

  render(conditional) {
    let matchIndex = -1;
    // Ensure existing reaction is stopped
    if (this.reaction) {
      this.reaction.stop();
    }
    let html = nothing;
    let context = {
      message: `if/else statement: {#if ${conditional.expression}}`,
      conditional: conditional,
    };

    // Create a new reaction that watches for reactive changes on client
    if(isClient) {
      this.reaction = Reaction.create((comp) => {
        if (!this.isConnected) {
          comp.stop();
          return;
        }

        const result = this.getBranch(conditional);
        matchIndex = result.matchIndex
        html = result.html;

        if (!comp.firstRun && this.matchIndex !== matchIndex) {
          this.matchIndex = matchIndex;
          this.setValue(html);
        }
        return html;
      }, { context });
    }
    else {
      const result = this.getBranch(conditional);
      matchIndex = result.matchIndex
      html = result.html;
    }

    /* Experimental (not used currently *
    if(this.matchIndex == matchIndex) {
      return noChange;
    } */
    return html;
  }

  getBranch(conditional) {
    let matchIndex = -1;
    let html;
    if (conditional.condition()) {
      html = conditional.content();
      matchIndex = 1000; // special index for if condition
    }
    else if (conditional.branches?.length) {
      // evaluate each elseif/else branch
      each(conditional.branches, (branch, index) => {
        if(matchIndex === -1) {
          if (branch.type == 'elseif' && branch.condition()) {
            matchIndex = index;
            html = branch.content();
          }
          else if (branch.type == 'else') {
            matchIndex = index;
            html = branch.content();
          }
        }
      });
    }
    else {
      html = nothing;
      delete this.matchIndex;
    }
    if(!html) {
      html = nothing;
    }
    return { matchIndex, html };
  }

  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }

  reconnected() {
    // nothing
  }
}

export const reactiveConditional = directive(ReactiveConditionalDirective);
