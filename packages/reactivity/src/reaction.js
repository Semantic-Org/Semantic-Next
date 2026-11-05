import { isPromise } from '@semantic-ui/utils';

import { grow } from './helpers/grow.js';
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
    // subscribers, further ones go to the parallel arrays. null until read, and
    // kept across runs, see trackDependency
    this.dependency = null;
    this.dependencySlot = -1;
    this.dependencies = null;
    this.dependencySlots = null;
    this.cursor = 0; // how many edges the current run has matched, in read order
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

  /*******************************
         Dependency Edges
  *******************************/

  // edges survive a run. positions: 0 is the inline edge, n is dependencies[n - 1].
  // a run matches its reads against last run's edges in order with the cursor, a
  // read that misses is swapped or appended into the cursor position, and whatever
  // sits at or past the cursor after the callback was not read and is swept

  dependencyCount() {
    if (this.dependency === null) {
      return 0;
    }
    return this.dependencies === null ? 1 : this.dependencies.length + 1;
  }

  dependencyAt(position) {
    if (position === 0) {
      return this.dependency;
    }
    const dependencies = this.dependencies;
    return dependencies !== null && position <= dependencies.length ? dependencies[position - 1] : null;
  }

  slotAt(position) {
    return position === 0 ? this.dependencySlot : this.dependencySlots[position - 1];
  }

  positionOf(dependency) {
    if (this.dependency === dependency) {
      return 0;
    }
    const dependencies = this.dependencies;
    if (dependencies === null) {
      return -1;
    }
    const index = dependencies.indexOf(dependency);
    return index === -1 ? -1 : index + 1;
  }

  // write an edge at a held position and tell its dependency where it now sits,
  // -1 for the inline edge
  setDependency(position, dependency, slot) {
    if (position === 0) {
      this.dependency = dependency;
      this.dependencySlot = slot;
      dependency.subscriberSlots[slot] = -1;
      return;
    }
    this.dependencies[position - 1] = dependency;
    this.dependencySlots[position - 1] = slot;
    dependency.subscriberSlots[slot] = position - 1;
  }

  appendDependency(dependency, slot) {
    if (this.dependency === null) {
      this.dependency = dependency;
      this.dependencySlot = slot;
      dependency.subscriberSlots[slot] = -1;
      return;
    }
    if (this.dependencies === null) {
      // a one-element literal, push onto an empty array grows its store to sixteen slots
      this.dependencies = [dependency];
      this.dependencySlots = [slot];
      dependency.subscriberSlots[slot] = 0;
      return;
    }
    dependency.subscriberSlots[slot] = this.dependencies.length;
    this.dependencies = grow(this.dependencies, dependency);
    this.dependencySlots = grow(this.dependencySlots, slot);
  }

  // the new edge takes position, the unread edge sitting there moves to the end
  insertDependency(position, dependency, slot) {
    if (position < this.dependencyCount()) {
      this.appendDependency(this.dependencyAt(position), this.slotAt(position));
      this.setDependency(position, dependency, slot);
      return;
    }
    this.appendDependency(dependency, slot);
  }

  swapDependencies(i, j) {
    const dependency = this.dependencyAt(i);
    const slot = this.slotAt(i);
    this.setDependency(i, this.dependencyAt(j), this.slotAt(j));
    this.setDependency(j, dependency, slot);
  }

  // drop the last position, null when empty
  popDependency() {
    const dependencies = this.dependencies;
    if (dependencies === null) {
      this.dependency = null;
      this.dependencySlot = -1;
      return;
    }
    dependencies.pop();
    this.dependencySlots.pop();
    if (dependencies.length === 0) {
      this.dependencies = null;
      this.dependencySlots = null;
    }
  }

  // a read inside the run, called by Dependency.depend once per dependency per run
  trackDependency(dependency) {
    const cursor = this.cursor;
    // the stable case, the same dependency at the same position as last run.
    // nothing is written on either side and nothing allocates
    if (this.dependencyAt(cursor) === dependency) {
      this.cursor = cursor + 1;
      return;
    }
    const position = this.positionOf(dependency);
    if (position === -1) {
      const slot = dependency.addSubscriber(this, cursor === 0 ? -1 : cursor - 1);
      this.insertDependency(cursor, dependency, slot);
    }
    else if (position > cursor) {
      this.swapDependencies(cursor, position);
    }
    else {
      // before the cursor is a dependency this run already read, through a nested
      // reaction's read of it that reset the stamp
      return;
    }
    this.cursor = cursor + 1;
  }

  // every position at or past the cursor was not read this run. such an edge was
  // still subscribed while the callback ran, so a change to it fired from inside
  // the run schedules one extra re-run, accepted
  sweepDependencies() {
    let count = this.dependencyCount();
    while (count > this.cursor) {
      count--;
      this.dependencyAt(count).removeAt(this.slotAt(count));
      this.popDependency();
    }
  }

  // drop one edge from this side for a manual Dependency.remove, the mirror of
  // Dependency.removeAt. an edge inside the matched prefix leaves it first, so the
  // sweep boundary stays right when this runs inside the callback
  dropDependency(dependency) {
    let position = this.positionOf(dependency);
    if (position === -1) {
      return;
    }
    if (position < this.cursor) {
      this.cursor--;
      if (position !== this.cursor) {
        this.swapDependencies(position, this.cursor);
      }
      position = this.cursor;
    }
    const last = this.dependencyCount() - 1;
    if (position !== last) {
      this.setDependency(position, this.dependencyAt(last), this.slotAt(last));
    }
    this.popDependency();
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
    // last run's edges stay, this run's reads are matched against them in order
    this.cursor = 0;
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
      result = this.callback(this);
    }
    catch (error) {
      // firstRun advances even on throw so a re-invalidation re-tracks from a known
      // baseline. the sweep is skipped: last run's edges stay so a fix to any input
      // re-triggers the reaction, and the cursor resets on the next run
      this.firstRun = false;
      throw error;
    }
    finally {
      Scheduler.current = previousReaction;
    }
    // undefined check first, callbacks almost never return a value
    if (result !== undefined && isPromise(result)) {
      // reads after an await keep advancing the cursor through track(), the sweep
      // waits for the settle
      this.beginSettle(result);
      return;
    }
    this.sweepDependencies();
    this.firstRun = false;
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
      sweep: false, // the in-flight run owes its sweep at settle
    };
  }

  beginSettle(promise) {
    const state = this.asyncState();
    // once a run has gone async, re-runs schedule at the flush drain point
    state.deferred = true;
    state.settling = promise;
    state.sweep = true;
    Scheduler.settlingReactions.add(this);
    promise.then(
      () => this.finishSettle(),
      (error) => {
        // check if this is a user aborting or a real error
        if (!(error?.name === 'AbortError' && state.controller?.signal.aborted)) {
          console.error('Reaction: uncaught error in async run', error);
        }
        // a rejected run keeps last run's edges, like a thrown sync callback
        state.sweep = false;
        this.finishSettle();
      },
    );
  }

  finishSettle() {
    const state = this.async;
    state.settling = null;
    if (state.sweep) {
      state.sweep = false;
      this.sweepDependencies();
    }
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
      this.async.sweep = false;
      // an in-flight run stays in settlingReactions, its body is still executing so settled() waits
    }
    // the sweep from position 0 drops every edge
    this.cursor = 0;
    this.sweepDependencies();
    this.fireCleanups();
  }
}
