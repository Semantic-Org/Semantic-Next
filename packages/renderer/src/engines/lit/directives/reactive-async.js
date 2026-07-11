import { noChange } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';

import { nonreactive, reaction, resource } from '@semantic-ui/reactivity';
import { each, isClient, isPlainObject } from '@semantic-ui/utils';

/*
  {#async ...} backed by a Resource, overlap concurrency — a re-fire starts its
  fetch immediately and the newest run's settle wins, matching what the block
  always did for template expressions that can't thread an abort signal. The
  directive's reaction reads the faces and renders the branch that matches.
*/

export class ReactiveAsyncDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.resource = null;
    this.syncThrew = false;
  }

  render(asyncCondition) {
    this.asyncCondition = asyncCondition;

    // Reuse existing reaction — signals and dataVersion handle updates
    if (this.reaction) {
      return noChange;
    }

    // fetcher reads through `this` so a re-render's fresh closures flow in.
    // created nonreactive so an enclosing reaction can't tear it down,
    // disconnected() owns the teardown
    this.resource = nonreactive(() =>
      resource(() => {
        this.syncThrew = false;
        try {
          return this.asyncCondition.expression();
        }
        catch (error) {
          // flagged so a synchronous throw with no error branch stays loud
          this.syncThrew = true;
          throw error;
        }
      }, { concurrency: 'overlap' })
    );

    if (isClient) {
      this.watchChanges();
    }

    return this.renderCurrentState(this.asyncCondition);
  }

  watchChanges() {
    const context = {
      message: `async block: {#async ${this.asyncCondition.expression}}`,
      async: this.asyncCondition,
    };

    this.reaction = reaction((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }

      // face reads register here, a flip re-runs and re-renders
      const rendered = this.renderCurrentState(this.asyncCondition);

      if (!computation.firstRun) {
        this.setValue(rendered);
      }
    }, { context });
  }

  renderCurrentState(asyncCondition) {
    const handle = this.resource;

    if (handle.loading) {
      if (asyncCondition.loadingContent) {
        return asyncCondition.loadingContent();
      }
      // No loading block: preserve previous content if available
      if (handle.settled && asyncCondition.content) {
        return asyncCondition.content(this.createSuccessDataContext(asyncCondition));
      }
      return noChange;
    }

    const error = handle.error;
    if (error !== undefined) {
      if (asyncCondition.errorContent) {
        const errorData = asyncCondition.errorAs
          ? { [asyncCondition.errorAs]: error }
          : { this: error };
        return asyncCondition.errorContent(errorData);
      }
      if (this.syncThrew) {
        throw error;
      }
      return noChange;
    }

    if (!handle.settled) {
      return noChange;
    }
    if (asyncCondition.content) {
      return asyncCondition.content(this.createSuccessDataContext(asyncCondition));
    }
    return noChange;
  }

  createSuccessDataContext(asyncCondition) {
    const value = this.resource.get();

    // Handle {#async expression as alias}
    if (asyncCondition.as) {
      return { [asyncCondition.as]: value };
    }

    // Handle {#async expression as { prop1, prop2, ...rest }}
    if (asyncCondition.parts && isPlainObject(value)) {
      const data = {};

      each(asyncCondition.parts, (prop) => {
        if (prop in value) {
          data[prop] = value[prop];
        }
      });

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
    this.reaction?.stop();
    this.reaction = null;
    this.resource?.stop();
    this.resource = null;
  }

  reconnected() {
    // Lit calls render() on reconnect which recreates the reaction and resource
  }
}

export const reactiveAsync = directive(ReactiveAsyncDirective);
