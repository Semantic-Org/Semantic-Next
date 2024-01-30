import { noChange, nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';
import { each } from '@semantic-ui/utils';

class ReactiveConditionalDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }

  render(conditional) {
    // Ensure existing reaction is stopped
    if (this.reaction) {
      this.reaction.stop();
    }
    let html = nothing;
    let renderedBranchIndex;
    this.reaction = Reaction.create((comp) => {
      // we want to avoid calling content() unless we need to rerender content
      if(conditional.condition()) {
        if(renderedBranchIndex == -1) {
          return;
        }
        html = conditional.content();
        renderedBranchIndex = -1;
      }
      else if(conditional.branches?.length) {
        // evaluate each branch
        let match = false;
        each(conditional.branches, (branch, index) => {
          if(!match && branch.type == 'elseif' && branch.condition()) {
            match = true;
            if(renderedBranchIndex == index) {
              return;
            }
            html = branch.content();
            renderedBranchIndex = index;
          }
          else if(!match && branch.type == 'else') {
            if(renderedBranchIndex == index) {
              return;
            }
            match = true;
            html = branch.content();
            renderedBranchIndex = index;
          }
        });
      }
      else {
        html = noChange;
      }
      if(!comp.firstRun) {
        this.setValue(html);
      }
      return html;
    });
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
