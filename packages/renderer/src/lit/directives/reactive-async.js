import { noChange, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { each, isClient, isPlainObject, isPromise } from '@semantic-ui/utils';

export class ReactiveAsyncDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.generation = 0;
    this.state = 'loading'; // 'loading', 'success', 'error'
    this.resolvedValue = null;
    this.error = null;
  }

  render(asyncCondition) {
    console.log('[async] render() called, current state:', this.state);

    // Stop existing reaction
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }

    // Create a new reaction that watches for reactive changes on client
    if (isClient) {
      this.watchChanges(asyncCondition);
    }

    // Return initial render
    const result = this.renderCurrentState(asyncCondition);
    console.log('[async] render() returning:', result === noChange ? 'noChange' : result);
    return result;
  }

  watchChanges(asyncCondition) {
    // pass through context for debugging
    let context = {
      message: `async block: {#async ${asyncCondition.expression}}`,
      async: asyncCondition,
    };

    this.reaction = Reaction.create((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }

      // Evaluate the expression to get the promise or value
      const expressionResult = asyncCondition.expression();

      // Handle the result
      this.handleExpressionResult(expressionResult, asyncCondition);

      // Render based on current state (after first run)
      if (!computation.firstRun) {
        const rendered = this.renderCurrentState(asyncCondition);
        console.log(
          '[async] reaction re-fire, state:',
          this.state,
          'rendered:',
          rendered === noChange ? 'noChange' : rendered,
        );
        this.setValue(rendered);
      }
      else {
        console.log('[async] reaction first run, state:', this.state);
      }
    }, { context });
  }

  handleExpressionResult(result, asyncCondition) {
    const currentGeneration = ++this.generation;

    // Reset state
    this.state = 'loading';
    this.resolvedValue = null;
    this.error = null;

    // Check if result is a promise
    if (isPromise(result)) {
      // Handle promise
      result
        .then((value) => {
          if (currentGeneration < this.generation) {
            console.log('[async] stale promise resolved, ignoring (gen', currentGeneration, '<', this.generation, ')');
            return;
          }
          console.log('[async] promise resolved, gen:', currentGeneration);
          this.state = 'success';
          this.resolvedValue = value;
          if (this.isConnected) {
            const rendered = this.renderCurrentState(asyncCondition);
            this.setValue(rendered);
          }
        })
        .catch((error) => {
          if (currentGeneration < this.generation) { return; }
          this.state = 'error';
          this.error = error;
          if (this.isConnected) {
            const rendered = this.renderCurrentState(asyncCondition);
            this.setValue(rendered);
          }
        });
    }
    else {
      // Synchronous value
      this.state = 'success';
      this.resolvedValue = result;
    }
  }

  renderCurrentState(asyncCondition) {
    switch (this.state) {
      case 'loading':
        if (asyncCondition.loadingContent) {
          return asyncCondition.loadingContent();
        }
        return noChange;

      case 'error':
        if (asyncCondition.errorContent) {
          // Create data context with error
          const errorData = asyncCondition.errorAs
            ? { [asyncCondition.errorAs]: this.error }
            : { this: this.error };

          return asyncCondition.errorContent(errorData);
        }
        return noChange;

      case 'success':
        if (asyncCondition.content) {
          // Create data context with resolved value
          const successData = this.createSuccessDataContext(asyncCondition);
          return asyncCondition.content(successData);
        }
        return noChange;

      default:
        return noChange;
    }
  }

  createSuccessDataContext(asyncCondition) {
    const value = this.resolvedValue;

    // Handle {#async expression as alias}
    if (asyncCondition.as) {
      return { [asyncCondition.as]: value };
    }

    // Handle {#async expression as { prop1, prop2, ...rest }}
    if (asyncCondition.parts && isPlainObject(value)) {
      const data = {};

      // Extract specified properties
      each(asyncCondition.parts, (prop) => {
        if (prop in value) {
          data[prop] = value[prop];
        }
      });

      // Handle rest parameter
      if (asyncCondition.rest) {
        const restObj = { ...value };
        each(asyncCondition.parts, (prop) => {
          delete restObj[prop];
        });
        data[asyncCondition.rest] = restObj;
      }

      return data;
    }

    // If no alias is specified use 'this'
    return { this: value };
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

export const reactiveAsync = directive(ReactiveAsyncDirective);
