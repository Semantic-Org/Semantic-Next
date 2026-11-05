import { captureStack, isTracing } from './helpers/tracing.js';
import { Scheduler } from './scheduler.js';

// a small edge array grows by copy so it holds exactly its entries, push would
// take an array of one to seventeen slots. past four, push amortizes so a wide
// fan-out stays linear
const grow = (array, value) => {
  if (array.length < 4) {
    return array.concat(value);
  }
  array.push(value);
  return array;
};

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
    const subscriberSlot = subscribers === null ? 0 : subscribers.length;
    // a reaction keeps its first dependency inline and records it here as slot -1,
    // nearly every render binding reads one signal and allocates no arrays
    let dependencySlot;
    if (reaction.dependency === null) {
      reaction.dependency = this;
      reaction.dependencySlot = subscriberSlot;
      dependencySlot = -1;
    }
    else if (reaction.dependencies === null) {
      // the first array edge is a one-element literal. push onto an empty array
      // grows its store to sixteen slots, more than the Set these arrays replaced
      reaction.dependencies = [this];
      reaction.dependencySlots = [subscriberSlot];
      dependencySlot = 0;
    }
    else {
      dependencySlot = reaction.dependencies.length;
      reaction.dependencies = grow(reaction.dependencies, this);
      reaction.dependencySlots = grow(reaction.dependencySlots, subscriberSlot);
    }
    if (subscribers === null) {
      this.subscribers = [reaction];
      this.subscriberSlots = [dependencySlot];
    }
    else {
      this.subscribers = grow(subscribers, reaction);
      this.subscriberSlots = grow(this.subscriberSlots, dependencySlot);
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
      if (lastSlot === -1) {
        last.dependencySlot = slot;
      }
      else {
        last.dependencySlots[lastSlot] = slot;
      }
    }
    if (subscribers.length === 0) {
      this.subscribers = null;
      this.subscriberSlots = null;
    }
  }
}
