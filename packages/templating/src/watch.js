import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

/*
  Adapted from Preact Signals Watch
*/

class WatchDirective extends AsyncDirective {
  __reactiveVar;
  __dispose = function(){};

  render(reactiveVar) {
    if(!reactiveVar) {
      return;
    }
    if (reactiveVar !== this.__reactiveVar) {
      this.__dispose?.();
      this.__reactiveVar = reactiveVar;

      // Whether the subscribe() callback is called because of this render
      // pass, or because of a separate reactiveVar update.
      let updateFromLit = true;
      this.__dispose = reactiveVar.subscribe((value) => {
        // The subscribe() callback is called synchronously during subscribe.
        // Ignore the first call since we return the value below in that case.
        if (updateFromLit === false) {
          this.setValue(value);
        }
      });
      updateFromLit = false;
    }

    // We use peek() so that the reactiveVar access is not tracked by the effect
    // created by SignalWatcher.performUpdate(). This means that a reactiveVar
    // update won't trigger a full element update if it's only passed to
    // watch() and not otherwise accessed by the element.
    return reactiveVar.peek();
  }

  disconnected() {
    this.__dispose?.();
  }

  reconnected() {
    this.__dispose = this.__reactiveVar?.subscribe((value) => {
      this.setValue(value);
    });
  }
}

export const watch = directive(WatchDirective);
