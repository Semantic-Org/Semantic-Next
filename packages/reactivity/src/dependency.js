import { captureStack, isTracing } from './helpers/tracing.js';
import { Scheduler } from './scheduler.js';

export class Dependency {
  constructor(...metadata) {
    // edges are parallel arrays on both sides. the subscriber at i holds this
    // dependency at subscriberSlots[i] in its own dependencies, so either side can
    // drop an edge by swap-pop. null until the first edge, an unread dependency
    // allocates nothing
    this.subscribers = null;
    this.subscriberSlots = null;
    // the last subscriber and the run it subscribed in, so a second read in the
    // same run adds no edge
    this.lastSubscriber = null;
    this.lastRun = -1;
    if (isTracing()) {
      this.setContext(metadata);
    }
  }

  depend() {
    const reaction = Scheduler.current;
    if (!reaction) {
      return;
    }
    // one edge per run. the stamp misses a parent that reads this again after a
    // nested reaction read it, that duplicate edge is harmless and clears with the rest
    if (reaction === this.lastSubscriber && reaction.runs === this.lastRun) {
      return;
    }
    this.lastSubscriber = reaction;
    this.lastRun = reaction.runs;
    const subscribers = this.subscribers;
    const dependencies = reaction.dependencies;
    const subscriberSlot = subscribers === null ? 0 : subscribers.length;
    const dependencySlot = dependencies === null ? 0 : dependencies.length;
    // the first edge is a one-element literal. push onto an empty array grows its
    // store to sixteen slots, more than the Set these arrays replaced
    if (subscribers === null) {
      this.subscribers = [reaction];
      this.subscriberSlots = [dependencySlot];
    }
    else {
      subscribers.push(reaction);
      this.subscriberSlots.push(dependencySlot);
    }
    if (dependencies === null) {
      reaction.dependencies = [this];
      reaction.dependencySlots = [subscriberSlot];
    }
    else {
      dependencies.push(this);
      reaction.dependencySlots.push(subscriberSlot);
    }
  }

  hasSubscribers() {
    return this.subscribers !== null;
  }

  // Cheap context naming on tracing; stack capture only on stack mode.
  setContext(context) {
    if (!isTracing()) {
      return;
    }
    this.context = context || {};
    captureStack(this, this.setContext);
  }

  changed(context) {
    const subscribers = this.subscribers;
    // nobody listening, skip the tracing bookkeeping too
    if (subscribers === null) {
      return;
    }
    if (isTracing()) {
      if (context) {
        this.context = context;
      }
      else {
        this.setContext();
      }
    }
    const ctx = this.context;
    // invalidate() only schedules, nothing runs inside this loop, so the array
    // holds still under an index walk
    for (let i = 0; i < subscribers.length; i++) {
      subscribers[i].invalidate(ctx);
    }
  }

  // swap-pop the edge at slot, the subscriber that moves into it learns its new slot
  remove(slot) {
    const subscribers = this.subscribers;
    const slots = this.subscriberSlots;
    // a stopped reaction must not stay reachable from a long-lived dependency
    if (subscribers[slot] === this.lastSubscriber) {
      this.lastSubscriber = null;
    }
    const last = subscribers.pop();
    const lastSlot = slots.pop();
    if (slot < subscribers.length) {
      subscribers[slot] = last;
      slots[slot] = lastSlot;
      last.dependencySlots[lastSlot] = slot;
    }
    if (subscribers.length === 0) {
      this.subscribers = null;
      this.subscriberSlots = null;
    }
  }
}
