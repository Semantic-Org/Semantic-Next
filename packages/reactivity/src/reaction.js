import { isPromise } from '@semantic-ui/utils';

import { captureStack, isTracing } from './helpers/tracing.js';
import { Scheduler } from './scheduler.js';

export class Reaction {
  // static mirror of Scheduler.current for debugger breakpoints in dev console
  static get current() {
    return Scheduler.current;
  }

  constructor(callback, { context, firstRun = true } = {}) {
    this.callback = callback;
    // the first dependency lives inline with the slot this reaction holds in its
    // subscribers, further ones go to the parallel arrays. null until read, see
    // Dependency.depend
    this.dependency = null;
    this.dependencySlot = -1;
    this.dependencies = null;
    this.dependencySlots = null;
    this.cleanups = null; // lazy only use if cleanup registered
    this.async = null; // lazy only use if async
    this.runs = 0; // started executions, a magnitude probe for overreactivity
    this.firstRun = true;
    this.active = true;
    if (context && isTracing()) {
      this.setContext(context);
    }
    if (firstRun) {
      this.run();
    }
  }

  // callbacks fire before next run() and on stop. use to scope inner reactions to parent
  onCleanup(callback) {
    // registered after stop, its run is already torn down
    if (!this.active) {
      callback();
      return;
    }
    (this.cleanups ??= []).push(callback);
  }

  fireCleanups() {
    if (this.cleanups === null) {
      return;
    }
    const callbacks = this.cleanups;
    this.cleanups = null;
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i]();
    }
  }

  // drop every edge from both sides. run() re-tracks from zero, stop() ends here
  clearDependencies() {
    if (this.dependency !== null) {
      this.dependency.removeAt(this.dependencySlot);
      this.dependency = null;
      this.dependencySlot = -1;
    }
    const dependencies = this.dependencies;
    if (dependencies === null) {
      return;
    }
    const slots = this.dependencySlots;
    for (let i = 0; i < dependencies.length; i++) {
      dependencies[i].removeAt(slots[i]);
    }
    this.dependencies = null;
    this.dependencySlots = null;
  }

  // drop one edge from this side, the mirror of Dependency.removeAt for a manual
  // Dependency.remove. slot is where this reaction sat in that dependency's subscribers
  dropDependency(dependency, slot) {
    if (this.dependency === dependency && this.dependencySlot === slot) {
      this.dependency = null;
      this.dependencySlot = -1;
      return;
    }
    const dependencies = this.dependencies;
    if (dependencies === null) {
      return;
    }
    const slots = this.dependencySlots;
    for (let i = 0; i < dependencies.length; i++) {
      if (dependencies[i] !== dependency || slots[i] !== slot) {
        continue;
      }
      const last = dependencies.pop();
      const lastSlot = slots.pop();
      if (i < dependencies.length) {
        dependencies[i] = last;
        slots[i] = lastSlot;
        last.subscriberSlots[lastSlot] = i;
      }
      if (dependencies.length === 0) {
        this.dependencies = null;
        this.dependencySlots = null;
      }
      return;
    }
  }

  setContext(additionalContext = {}) {
    if (!isTracing()) {
      return;
    }
    const defaultContext = {
      firstRun: this.firstRun,
    };
    this.context = {
      ...defaultContext,
      ...additionalContext,
    };
  }

  setTrace() {
    captureStack(this, this.setTrace);
  }

  addContext(additionalContext = {}) {
    if (!isTracing()) {
      return;
    }
    if (!this.context) {
      this.context = {};
    }
    for (const key in additionalContext) {
      this.context[key] = additionalContext[key];
    }
  }

  run() {
    if (!this.active) {
      return;
    }
    if (this.async !== null && this.resetAsync()) {
      return;
    }
    this.runs++;
    if (isTracing()) {
      this.addContext({
        firstRun: this.firstRun,
      });
    }
    this.fireCleanups();
    // save/restore so nested run() (guard, computed, derive) doesn't strand the parent
    const previousReaction = Scheduler.current;
    Scheduler.current = this;
    let result;
    try {
      this.clearDependencies();
      result = this.callback(this);
    }
    finally {
      Scheduler.current = previousReaction;
      // undefined check first, callbacks almost never return a value
      if (result !== undefined && isPromise(result)) {
        this.beginSettle(result);
      }
      else {
        // firstRun advances even on throw so a re-invalidation re-tracks from a known baseline
        this.firstRun = false;
      }
    }
  }

  invalidate(context) {
    if (!this.active) {
      return;
    }
    if (context) {
      this.addContext(context);
    }
    if (this.async !== null) {
      this.async.controller?.abort();
      if (this.async.settling !== null) {
        this.async.rerun = true;
        return;
      }
    }
    Scheduler.scheduleReaction(this);
  }

  /*******************************
           Async Runs
  *******************************/

  // a callback that returns a promise stays in flight until it settles. invalidations
  // abort the run and coalesce into one re-run after settle, started at the flush
  // drain point. cleanups and dep-tracking stay coherent because runs never overlap.

  // fresh abort scope for a starting run, true means defer until the in-flight run settles
  resetAsync() {
    const state = this.async;
    if (state.settling !== null) {
      state.rerun = true;
      return true;
    }
    // supersede the previous run's abort signal for each fresh run
    state.controller?.abort();
    state.controller = null;
    return false;
  }

  // re-enter dep tracking for a sync block after an await. reads inside the
  // callback register on this reaction, accumulating into the current run
  track(callback) {
    if (!this.active) {
      return callback();
    }
    const previousReaction = Scheduler.current;
    Scheduler.current = this;
    try {
      return callback();
    }
    finally {
      Scheduler.current = previousReaction;
    }
  }

  // per run abort signal, aborted if: invalidated, re-run or stopped
  get abortSignal() {
    const state = this.asyncState();
    state.controller ??= new AbortController();
    return state.controller.signal;
  }

  // all fields preset so the hidden class stays monomorphic
  asyncState() {
    return this.async ??= {
      deferred: false,
      settling: null,
      rerun: false,
      controller: null,
    };
  }

  beginSettle(promise) {
    const state = this.asyncState();
    // once a run has gone async, re-runs schedule at the flush drain point
    state.deferred = true;
    state.settling = promise;
    Scheduler.settlingReactions.add(this);
    promise.then(
      () => this.finishSettle(),
      (error) => {
        // check if this is a user aborting or a real error
        if (!(error?.name === 'AbortError' && state.controller?.signal.aborted)) {
          console.error('Reaction: uncaught error in async run', error);
        }
        this.finishSettle();
      },
    );
  }

  finishSettle() {
    const state = this.async;
    state.settling = null;
    // async first run ends only now, when the promise settles
    this.firstRun = false;
    if (state.rerun && this.active) {
      state.rerun = false;
      Scheduler.scheduleReaction(this);
    }
    Scheduler.settlingReactions.delete(this);
    Scheduler.checkSettled();
  }

  /*******************************
            Teardown
  *******************************/

  stop() {
    if (!this.active) {
      return;
    }
    this.active = false;
    // pending sets can only hold entries while a flush is scheduled or running
    if (Scheduler.isFlushScheduled || Scheduler.isFlushing) {
      Scheduler.pendingReactions.delete(this);
      Scheduler.pendingAsyncReactions.delete(this);
    }
    if (this.async !== null) {
      this.async.controller?.abort();
      this.async.rerun = false;
      // an in-flight run stays in settlingReactions, its body is still executing so settled() waits
    }
    this.clearDependencies();
    this.fireCleanups();
  }
}
