import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Reaction } from '@semantic-ui/reactivity';

class ReactiveData extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }

  render(computeFunc, settings) {
    // Stop and clean up any existing reaction
    if (this.reaction) {
      this.reaction.stop();
    }

    // Create a new reaction to rerun the computation function
    let value;
    this.reaction = Reaction.create((comp) => {
      if(!this.isConnected) {
        comp.stop();
        return;
      }
      value = computeFunc();
      if(settings.unsafeHTML) {
        value = unsafeHTML(value);
      }
      if (!comp.firstRun) {
        this.setValue(value);
      }
    });

    // Return the initial result of the computation function
    return value;
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
