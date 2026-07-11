import { isPromise } from '@semantic-ui/utils';

import { Dependency } from './dependency.js';
import { IS_RESOURCE } from './helpers/identity.js';
import { Reaction } from './reaction.js';
import { Scheduler } from './scheduler.js';
import { Signal } from './signal.js';

/*
  a signal whose value a fetcher produces through a backing async reaction.
  the value holds last-good through refetch and rejection. status lives in
  three independent faces (loading, error, settled) so a reader re-runs
  only when the face it reads flips.
*/

export class Resource extends Signal {
  // brand resource
  get [IS_RESOURCE]() {
    return true;
  }
  static [Symbol.hasInstance](value) {
    return !!value?.[IS_RESOURCE];
  }

  constructor(fetcher, options = {}) {
    super(options.initialValue, options);
    this.fetcher = fetcher;
    this.loadingValue = false;
    this.errorValue = undefined;
    this.settledValue = false;
    this.loadingDependency = null;
    this.errorDependency = null;
    this.settledDependency = null;
    // weakly held so the backing reaction self-stops once nothing else holds the handle
    const resourceRef = new WeakRef(this);
    const backingReaction = new Reaction((computation) => {
      const liveResource = resourceRef.deref();
      if (!liveResource) {
        backingReaction.stop();
        return;
      }
      return liveResource.runFetch(computation);
    });
    // scope to the enclosing reaction when present
    const parent = Scheduler.current;
    if (parent) {
      parent.onCleanup(() => backingReaction.stop());
    }
    this.reaction = backingReaction; // signal.stop() tears down the backing reaction
  }

  /*******************************
             Faces
  *******************************/

  get loading() {
    (this.loadingDependency ??= new Dependency()).depend();
    return this.loadingValue;
  }

  get error() {
    (this.errorDependency ??= new Dependency()).depend();
    return this.errorValue;
  }

  get settled() {
    (this.settledDependency ??= new Dependency()).depend();
    return this.settledValue;
  }

  refresh() {
    this.reaction.invalidate();
  }

  /*******************************
         Fetch Lifecycle
  *******************************/

  runFetch(computation) {
    let result;
    try {
      result = this.fetcher(computation);
    }
    catch (error) {
      this.rejectFetch(error);
      return;
    }
    // a sync return settles without a fetch ever being in flight
    if (!isPromise(result)) {
      this.fulfillFetch(result);
      return;
    }
    this.beginFetch();
    // a superseded run's settle is dropped, the trailing re-run owns the next state
    const runSignal = computation.abortSignal;
    return result.then(
      (value) => {
        if (!runSignal.aborted) {
          this.fulfillFetch(value);
        }
      },
      (error) => {
        if (!runSignal.aborted) {
          this.rejectFetch(error);
        }
      },
    );
  }

  beginFetch() {
    if (!this.loadingValue) {
      this.loadingValue = true;
      this.loadingDependency?.changed();
    }
  }

  fulfillFetch(value) {
    this.set(value);
    if (this.errorValue !== undefined) {
      this.errorValue = undefined;
      this.errorDependency?.changed();
    }
    this.finishFetch();
  }

  rejectFetch(error) {
    if (this.errorValue !== error) {
      this.errorValue = error;
      this.errorDependency?.changed();
    }
    this.finishFetch();
  }

  finishFetch() {
    if (!this.settledValue) {
      this.settledValue = true;
      this.settledDependency?.changed();
    }
    if (this.loadingValue) {
      this.loadingValue = false;
      this.loadingDependency?.changed();
    }
  }

  /*******************************
            Teardown
  *******************************/

  stop() {
    super.stop();
    // nothing can ever be in flight again, a frozen loading face would lie
    if (this.loadingValue) {
      this.loadingValue = false;
      this.loadingDependency?.changed();
    }
  }
}

export const resource = (fetcher, options) => new Resource(fetcher, options);
