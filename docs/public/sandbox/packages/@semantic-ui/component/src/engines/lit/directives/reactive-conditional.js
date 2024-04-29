import { nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';
import { each, isEqual } from '@semantic-ui/utils';

export class ReactiveConditionalDirective extends AsyncDirective {
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
      if(!this.isConnected) {
        comp.stop();
        return;
      }
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
      if(!html) {
        html = nothing;
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
