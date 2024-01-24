import { nothing } from 'lit';
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
    this.reaction = Reaction.create((comp) => {
      if(conditional.condition()) {
        html = conditional.content();
      }
      else if(conditional.branches?.length) {
        // evaluate each branch
        let match = false;
        each(conditional.branches, (branch) => {
          if(match) {
            return;
          }
          else if(branch.type == 'elseif' && branch.condition()) {
            html = branch.content();
          }
          else if(branch.type == 'else') {
            html = branch.content();
          }
        });
      }
      if(!comp.firstRun) {
        this.setValue(html);
      }
    });
    return html;
  }

  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }
}

export const reactiveConditional = directive(ReactiveConditionalDirective);
