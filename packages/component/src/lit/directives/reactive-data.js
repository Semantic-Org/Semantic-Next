import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';

class ReactiveData extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }

  render(computeFunc) {
    // Stop and clean up any existing reaction
    if (this.reaction) {
      this.reaction.stop();
    }

    // Create a new reaction to rerun the computation function
    this.reaction = Reaction.create((comp) => {
      const value = computeFunc();
      if (!comp.firstRun) {
        this.setValue(value);
      }
    });

    // Return the initial result of the computation function
    return computeFunc();
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

export const reactiveData = directive(ReactiveData);
