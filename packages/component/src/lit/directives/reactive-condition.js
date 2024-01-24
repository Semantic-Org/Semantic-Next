import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';

class ReactiveConditionDirective extends AsyncDirective {

  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }

  render(branches, elseAST, renderASTFunc, data) {
    // Stop and clean up any existing reaction
    if (this.reaction) {
      this.reaction.stop();
    }

    // Create a new reaction for the conditional logic
    this.reaction = Reaction.create(() => {
      for (const branch of branches) {
        if (branch.condition()) {
          this.setValue(renderASTFunc(branch.ast, data));
          return;
        }
      }
      // Render the else branch, if present
      if (elseAST) {
        this.setValue(renderASTFunc(elseAST, data));
      }
    });

    // Initial rendering
    for (const branch of branches) {
      if (branch.condition()) {
        return renderASTFunc(branch.ast, data);
      }
    }
    return elseAST ? renderASTFunc(elseAST, data) : '';
  }

  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }

  reconnected() {
    // The reaction will be recreated in the next render
  }
}

export const reactiveCondition = directive(ReactiveConditionDirective);
