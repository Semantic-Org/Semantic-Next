import { grow } from './helpers/grow.js';
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
    reaction.trackDependency(this);
  }

  // a new edge, called by Reaction.trackDependency. position is where the reaction
  // holds this dependency, -1 for its inline edge, and the slot it took here is
  // returned so the reaction can record it
  addSubscriber(reaction, position) {
    const subscribers = this.subscribers;
    // the first edge is a one-element literal. push onto an empty array grows its
    // store to sixteen slots, more than the Set these arrays replaced
    if (subscribers === null) {
      this.subscribers = [reaction];
      this.subscriberSlots = [position];
      return 0;
    }
    // the slot is the length before growing, past four entries grow pushes in place
    const slot = subscribers.length;
    this.subscribers = grow(subscribers, reaction);
    this.subscriberSlots = grow(this.subscriberSlots, position);
    return slot;
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
    // invalidate() can run a user abort listener synchronously, and that listener
    // may stop or add a subscriber here. the downward walk keeps both safe: a
    // swap-popped survivor lands on an index already visited, and a subscriber
    // added mid-loop sits past the start and is skipped, it just read the current value
    for (let i = subscribers.length - 1; i >= 0; i--) {
      if (i < subscribers.length) {
        subscribers[i].invalidate(ctx);
      }
    }
  }

  // the documented form. finds the reaction by scan and drops that edge from both
  // sides, a no-op when it is not subscribed. the kernel removes by slot
  remove(reaction) {
    const subscribers = this.subscribers;
    if (subscribers === null) {
      return;
    }
    const slot = subscribers.indexOf(reaction);
    if (slot === -1) {
      return;
    }
    reaction.dropDependency(this);
    this.removeAt(slot);
  }

  // swap-pop the edge at slot, the subscriber that moves into it learns its new slot
  removeAt(slot) {
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
