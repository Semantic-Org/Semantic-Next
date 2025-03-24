import { Reaction } from '@semantic-ui/reactivity';
import { each } from '@semantic-ui/utils';
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
    this.reaction = Reaction.create((comp) => {
      if (!this.isConnected) {
        comp.stop();
        return;
      }
      let matchIndex = -1;
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
      if (!html) {
        html = nothing;
        delete this.matchIndex;
      }
      if (!comp.firstRun && this.matchIndex !== matchIndex) {
        this.matchIndex = matchIndex;
        this.setValue(html);
      }
      return html;
    });
    /* Commented out until can resolve mobile menu
    if(this.matchIndex == matchIndex) {
      return noChange;
    }
    */
    return html;
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
