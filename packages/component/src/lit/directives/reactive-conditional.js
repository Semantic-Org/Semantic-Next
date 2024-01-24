import { nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';
import { each, wrapFunction } from '@semantic-ui/utils';

class ReactiveConditionalDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }

  render(conditional) {
    console.log('setting up conditional', conditional);
    // Ensure existing reaction is stopped
    if (this.reaction) {
      this.reaction.stop();
    }
    let html = nothing;
    this.reaction = Reaction.create((comp) => {
      console.log('REACTIVITY TRIGGERED IN IF DIRECTIVE', conditional.content());
      // we need to setup reactive ref to all branching conditions
      each(conditional.branches || [], branch => wrapFunction(branch.condition)());

      if(conditional.condition()) {
        console.log('if content');
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
            console.log('elseif content');
            html = branch.content();
          }
          else if(branch.type == 'else') {
            console.log('else content');
            html = branch.content();
          }
        });
      }
      else {
        html = nothing;
      }
      if(!comp.firstRun) {
        console.log('updating condition', html);
        this.setValue(html);
      }
      else {
        console.log('first run');
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
