import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { isPromise, isPlainObject, each } from '@semantic-ui/utils';

export class ReactiveAsyncDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.state = 'loading'; // 'loading', 'success', 'error'
    this.resolvedValue = null;
    this.error = null;
  }

  render(asyncCondition) {
    // Stop existing reaction
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }

    // pass through context for debugging
    let context = {
      message: `async block: {#async ${asyncCondition.expression}}`,
      async: asyncCondition,
    };

    // Create a new reaction
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
        this.setValue(rendered);
      }
    }, { context });

    // Return initial render
    return this.renderCurrentState(asyncCondition);
  }

  handleExpressionResult(result, asyncCondition) {
    // Reset state
    this.state = 'loading';
    this.resolvedValue = null;
    this.error = null;

    // Check if result is a promise
    if (isPromise(result)) {
      // Handle promise
      result
        .then((value) => {
          this.state = 'success';
          this.resolvedValue = value;
          if (this.isConnected) {
            const rendered = this.renderCurrentState(asyncCondition);
            this.setValue(rendered);
          }
        })
        .catch((error) => {
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
        return nothing;

      case 'error':
        if (asyncCondition.errorContent) {
          // Create data context with error
          const errorData = asyncCondition.errorAs 
            ? { [asyncCondition.errorAs]: this.error }
            : { error: this.error };

          return asyncCondition.errorContent(errorData);
        }
        return nothing;

      case 'success':
        if (asyncCondition.content) {
          // Create data context with resolved value
          const successData = this.createSuccessDataContext(asyncCondition);
          return asyncCondition.content(successData);
        }
        return nothing;

      default:
        return nothing;
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
      
      // Extract specified properties using each
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

    // Handle {#async expression} (no as clause) - use 'this'
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
