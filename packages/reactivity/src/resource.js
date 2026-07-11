import { extend, isPromise } from '@semantic-ui/utils';

import { Dependency } from './dependency.js';
import { IS_RESOURCE } from './helpers/identity.js';
import { Reaction } from './reaction.js';
import { Scheduler } from './scheduler.js';
import { Signal } from './signal.js';

/*
  a signal whose value a fetcher produces through a backing async reaction.
  the value holds last-good through refresh and rejection. status lives in
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

  // per-instance face state, preset so the hidden class stays monomorphic
  static defaults = {
    loadingValue: false,
    errorValue: undefined,
    settledValue: false,
    loadingDependency: null,
    errorDependency: null,
    settledDependency: null,
  };

  constructor(fetcher, options = {}) {
    super(options.initialValue, options);
    extend(this, Resource.defaults);
    this.fetcher = fetcher;
    this.onError = options.onError ?? null;
    // weakly held so the backing reaction self-stops once nothing else holds the handle
    const resourceRef = new WeakRef(this);
    const backingReaction = new Reaction((computation) => {
      const liveResource = resourceRef.deref();
      if (!liveResource) {
        backingReaction.stop();
        return;
      }
      return liveResource.runFetch(computation);
    }, { firstRun: false });
    // scope to the enclosing reaction when present. teardown goes through the
    // resource so the faces reset, not just the reaction
    const parent = Scheduler.current;
    if (parent) {
      parent.onCleanup(() => {
        resourceRef.deref()?.stop();
        backingReaction.stop();
      });
    }
    // wired before the first run so the fetcher can reach refresh() and stop()
    this.reaction = backingReaction;
    backingReaction.run();
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

  /*******************************
         Fetch Lifecycle
  *******************************/

  refresh() {
    this.reaction.invalidate();
  }

  runFetch(computation) {
    let result;
    try {
      result = this.fetcher(computation);
    }
    catch (error) {
      this.rejectFetch(error);
      return;
    }
    // stopped from inside the fetcher, nothing may land
    if (!computation.active) {
      return;
    }
    // a sync return settles without a fetch ever being in flight
    if (!isPromise(result)) {
      this.fulfillFetch(result);
      return;
    }
    this.beginFetch();
    // a superseded run's settle is dropped, the trailing re-run owns the next state
    const abortSignal = computation.abortSignal;
    return result.then(
      (value) => {
        if (!abortSignal.aborted) {
          this.fulfillFetch(value);
        }
        else {
          this.dropFetch(computation);
        }
      },
      (error) => {
        if (!abortSignal.aborted) {
          this.rejectFetch(error);
        }
        else {
          this.dropFetch(computation);
        }
      },
    );
  }

  // a settle dropped by supersession leaves loading for the trailing re-run,
  // one dropped by a stop mid-flight has no re-run coming and resets the faces
  dropFetch(computation) {
    if (!computation.active) {
      this.stop();
    }
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
    // after the faces settle so the callback observes coherent state
    this.onError?.(error);
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
