import { noChange, nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';
import { each, isEqual } from '@semantic-ui/utils';

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
    let lastHTML = nothing;
    this.reaction = Reaction.create((comp) => {
      if(conditional.condition()) {
        html = conditional.content();
      }
      else if(conditional.branches?.length) {
        // evaluate each branch
        let match = false;
        each(conditional.branches, (branch) => {
          if(!match && branch.type == 'elseif' && branch.condition()) {
            match = true;
            html = branch.content();
          }
          else if(!match && branch.type == 'else') {
            match = true;
            html = branch.content();
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
    lastHTML = html;
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
