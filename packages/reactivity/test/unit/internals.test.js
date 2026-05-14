import {
  Dependency,
  isStackCapture,
  isTracing,
  Reaction,
  Scheduler,
  setStackCapture,
  setTracing,
  Signal,
} from '@semantic-ui/reactivity';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  Scheduler.current = null;
  Scheduler.pendingReactions.clear();
  Scheduler.afterFlushCallbacks = [];
  Scheduler.isFlushScheduled = false;
});

afterEach(() => {
  setStackCapture(false);
  setTracing(false);
});

/*******************************
        Scheduler — flush
*******************************/

describe('Scheduler — flush', () => {
  it('batches multiple synchronous signal writes into a single reaction run', () => {
    // Witness: batch-updates [example] — "Multiple synchronous signal updates
    // result in a single batched reaction execution"
    const a = new Signal('John');
    const b = new Signal('Doe');
    const callback = vi.fn();

    Reaction.create(() => {
      callback(`${a.get()} ${b.get()}`);
    });
    expect(callback).toHaveBeenCalledTimes(1);

    a.set('Jane');
    b.set('Smith');
    Reaction.flush();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('Jane Smith');
  });

  it('runs reactions scheduled during a flush in the same flush pass', () => {
    // Witness: scheduler.flush() while-loop drains pendingReactions until
    // empty [source]. Signal.set() inside a reaction body must observe
    // its downstream subscribers run before flush() returns control.
    const trigger = new Signal(0);
    const downstream = new Signal('idle');
    const log = [];

    Reaction.create(() => {
      log.push(`upstream:${trigger.get()}`);
      // mid-flush write to a different signal
      downstream.set(`derived-${trigger.peek()}`);
    });
    Reaction.create(() => {
      log.push(`downstream:${downstream.get()}`);
    });

    log.length = 0;
    trigger.set(1);
    Reaction.flush();

    // Both reactions should have re-run inside the single flush.
    expect(log).toContain('upstream:1');
    expect(log).toContain('downstream:derived-1');
  });

  it('processes afterFlush callbacks only once per flush after all reactions settle', () => {
    // Witness: after-flush [example] — "afterFlush occurs after final value
    // is set" — implies callbacks fire AFTER the pendingReactions drain.
    const n = new Signal(0);
    const reactionLog = [];
    const afterFlushLog = [];

    Reaction.create(() => {
      reactionLog.push(n.get());
    });

    [1, 2, 3, 4, 5].forEach(v => n.set(v));
    Reaction.afterFlush(() => {
      // At this point the reaction's last value should already be the final
      // one (5) — afterFlush is *post* reaction drain.
      afterFlushLog.push(n.peek());
    });

    Reaction.flush();

    expect(reactionLog[reactionLog.length - 1]).toBe(5);
    expect(afterFlushLog).toEqual([5]);
  });

  it('runs afterFlush callbacks in registration order', () => {
    // Witness: Scheduler.afterFlushCallbacks is a list iterated forward
    // [source]. Two afterFlush(...) calls should produce two records in the
    // order they were registered.
    const order = [];
    Reaction.afterFlush(() => order.push('first'));
    Reaction.afterFlush(() => order.push('second'));
    Reaction.afterFlush(() => order.push('third'));

    Reaction.flush();

    expect(order).toEqual(['first', 'second', 'third']);
  });

  it('breaks an unconditional A↔B reactive cycle and logs an error', () => {
    // Witness: scheduler.maxFlushIterations + the existing
    // 'cycle detected' test in reaction.test.js [source]. We assert the
    // public contract: flush() returns rather than hangs.
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const a = new Signal(0);
    const b = new Signal(0);

    Reaction.create(() => {
      b.set(a.get() + 1);
    });
    Reaction.create(() => {
      a.set(b.get() + 1);
    });

    Reaction.flush();

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mock.calls[0][0]).toMatch(/cycle detected/i);
    // pending set should be cleared so the next flush is a clean slate.
    expect(Scheduler.pendingReactions.size).toBe(0);
    errorSpy.mockRestore();
  });

  it('continues processing remaining reactions when one throws', () => {
    // Witness: schedule-flush [example] documents flush() as a normal
    // public method. A user-thrown exception in one reaction must not
    // silently swallow other reactions in the same batch — either it
    // propagates (and the user sees it) OR the framework isolates each.
    // Either behaviour is acceptable so long as `b` still observes its
    // update once the smoke clears. This test exists to nail down which
    // contract is in effect.
    const a = new Signal(0);
    const b = new Signal(0);
    let bSeen = 0;

    Reaction.create(() => {
      if (a.get() === 1) {
        throw new Error('boom');
      }
    });
    Reaction.create(() => {
      bSeen = b.get();
    });

    a.set(1);
    b.set(42);

    // Wrap in try/catch — the contract here is "subsequent reactions still
    // run", not "throw is swallowed".
    let caught;
    try {
      Reaction.flush();
    }
    catch (e) {
      caught = e;
    }

    expect(bSeen).toBe(42);
    // Re-flushing after a throw should not be jammed.
    expect(Scheduler.pendingReactions.size).toBe(0);
  });

  it('flushes again cleanly after a previous flush threw', () => {
    // Witness: Scheduler.isFlushScheduled is a single boolean [source].
    // If a throw leaves it true, subsequent set()s would silently fail to
    // schedule. Verifies the post-throw recoverability contract.
    const n = new Signal(0);
    const seen = [];

    Reaction.create(() => {
      const v = n.get();
      if (v === 1) { throw new Error('once'); }
      seen.push(v);
    });

    n.set(1);
    try {
      Reaction.flush();
    }
    catch (_) { /* swallow for next phase */ }

    // After throw — does the next set still schedule a flush?
    n.set(2);
    Reaction.flush();

    expect(seen).toContain(2);
  });

  it('does not double-schedule a microtask when a flush is already pending', () => {
    // Witness: isFlushScheduled guard [source]. Multiple scheduleFlush()
    // calls between microtask boundaries should result in a single flush.
    const callback = vi.fn();
    const n = new Signal(0);

    Reaction.create(() => callback(n.get()));
    expect(callback).toHaveBeenCalledTimes(1);

    // Six writes — each calls scheduleFlush — should still produce only
    // one additional reaction run after flush.
    for (let i = 1; i <= 6; i++) { n.set(i); }
    Reaction.flush();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(6);
  });

  it('runs afterFlush via microtask without an explicit flush call', async () => {
    // Witness: reaction.test.js 'afterFlush should call registered callbacks
    // after flushing' uses scheduleFlush() + await microtask boundary
    // [source]. Reproducing that here verifies the auto-flush path.
    const cb = vi.fn();
    Reaction.afterFlush(cb);
    Reaction.scheduleFlush();
    await Promise.resolve();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('handles afterFlush registered from inside a reaction body', () => {
    // Witness: performance-patterns [example] registers afterFlush from
    // inside Reaction.create. The afterFlush callback should still fire
    // after the reaction settles within the same flush.
    const trigger = new Signal(false);
    const settled = vi.fn();

    Reaction.create(() => {
      if (trigger.get()) {
        Reaction.afterFlush(settled);
      }
    });

    trigger.set(true);
    Reaction.flush();

    expect(settled).toHaveBeenCalledTimes(1);
  });

  it('does not run afterFlush callbacks registered DURING afterFlush in the same pass', () => {
    // Witness: scheduler.flush snapshots afterFlushCallbacks into a local
    // `callbacks` and resets the static list before iterating [source].
    // A late registration goes into the fresh list — it will only run on
    // the next flush. This is observable: a self-registering afterFlush
    // would otherwise infinite-loop.
    let runCount = 0;
    const recursive = () => {
      runCount++;
      if (runCount < 5) {
        Reaction.afterFlush(recursive);
      }
    };
    Reaction.afterFlush(recursive);

    Reaction.flush();
    expect(runCount).toBe(1);

    // The late-registered one is parked. Flush again to pick it up.
    Reaction.flush();
    expect(runCount).toBe(2);
  });
});

/*******************************
        Scheduler — current
*******************************/

describe('Scheduler — current reaction context', () => {
  it('exposes the currently-running reaction via Reaction.current', () => {
    // Witness: Reaction.current proxies Scheduler.current [source].
    // Public surface for the tracing helpers (Reaction.getSource).
    let seen = null;
    const r = Reaction.create(function inside() {
      seen = Reaction.current;
    });
    expect(seen).toBe(r);
  });

  it('clears Scheduler.current after a reaction finishes', () => {
    Reaction.create(() => {});
    expect(Scheduler.current).toBe(null);
  });

  it('restores Scheduler.current after a reaction throws', () => {
    // Witness: try/finally in Reaction.run [source]. A user-thrown error
    // inside the body must not leave Scheduler.current dangling — that
    // would cause subsequent signal reads outside any reaction to attach
    // dependencies.
    expect(() => {
      Reaction.create(() => {
        throw new Error('mid-run');
      });
    }).toThrow('mid-run');

    expect(Scheduler.current).toBe(null);

    // Verify the practical consequence: reading a signal outside a
    // reaction must not attach a dependency.
    const s = new Signal('x');
    s.get();
    expect(s.hasDependents()).toBe(false);
  });

  it('nonreactive nests correctly — restores outer reaction when inner returns', () => {
    // Witness: reaction.js nonreactive [source]: previousReaction save +
    // restore. A nested reaction must observe its dependency tracking.
    const outer = new Signal('outer');
    const inner = new Signal('inner');
    const seen = vi.fn();

    Reaction.create(() => {
      Reaction.nonreactive(() => inner.get());
      seen(outer.get());
    });

    inner.set('inner-changed');
    Reaction.flush();
    expect(seen).toHaveBeenCalledTimes(1); // not retriggered by inner

    outer.set('outer-changed');
    Reaction.flush();
    expect(seen).toHaveBeenCalledTimes(2); // retriggered by outer
  });
});

/*******************************
            Dependency
*******************************/

describe('Dependency', () => {
  it('depend() outside a reaction is a no-op', () => {
    // Witness: dependency.depend early-returns if Scheduler.current is
    // null [source]. Caller can call depend() defensively without guards.
    const dep = new Dependency();
    expect(() => dep.depend()).not.toThrow();
    expect(dep.subscribers.size).toBe(0);
  });

  it('changed() with no subscribers does not throw or allocate', () => {
    // Witness: dependency.changed early-returns when subscribers.size is
    // zero [source]. The fast path for "signal no one is watching" must
    // remain side-effect-free.
    const dep = new Dependency();
    expect(() => dep.changed()).not.toThrow();
    expect(() => dep.changed({ value: 'whatever' })).not.toThrow();
  });

  it('cleanUp removes the reaction without affecting other subscribers', () => {
    // Witness: Reaction.run calls dep.cleanUp(this) on every prior
    // dependency before re-tracking [source]. Multiple reactions on the
    // same signal must remain independent.
    const s = new Signal(0);
    const a = vi.fn();
    const b = vi.fn();

    const rA = Reaction.create(() => {
      s.get();
      a();
    });
    Reaction.create(() => {
      s.get();
      b();
    });

    expect(s.hasDependents()).toBe(true);

    rA.stop();
    expect(s.hasDependents()).toBe(true); // b is still subscribed

    s.set(1);
    Reaction.flush();
    expect(a).toHaveBeenCalledTimes(1); // only the initial run
    expect(b).toHaveBeenCalledTimes(2);
  });

  it('stop() cleanly unsubscribes all of a reaction’s dependencies', () => {
    // Witness: reaction.stop iterates dependencies and unsubscribes each
    // [source]. After stop, none of the upstream signals should retain
    // the reaction in their subscriber set.
    const s1 = new Signal(0);
    const s2 = new Signal(0);
    const r = Reaction.create(() => {
      s1.get();
      s2.get();
    });

    expect(s1.hasDependents()).toBe(true);
    expect(s2.hasDependents()).toBe(true);

    r.stop();

    expect(s1.hasDependents()).toBe(false);
    expect(s2.hasDependents()).toBe(false);
  });

  it('stop() is idempotent — calling twice does not throw or double-process', () => {
    // Witness: reaction.stop early-returns if !active [source]. Idempotency
    // is the documented behaviour.
    const s = new Signal(0);
    const r = Reaction.create(() => s.get());

    expect(() => {
      r.stop();
      r.stop();
    }).not.toThrow();
    expect(r.active).toBe(false);
  });

  it('a stopped reaction never re-runs even if a dependency change races in', () => {
    // Witness: reaction.run early-returns if !active [source]. A pending
    // invalidation that landed before stop() still respects the active
    // flag at execution time.
    const s = new Signal(0);
    const cb = vi.fn();

    const r = Reaction.create(() => {
      s.get();
      cb();
    });
    expect(cb).toHaveBeenCalledTimes(1);

    s.set(1); // schedules r
    r.stop();
    Reaction.flush();

    expect(cb).toHaveBeenCalledTimes(1); // never re-ran after stop
  });

  it('dependency tracking re-establishes after each reaction run (no stale subscriptions)', () => {
    // Witness: reaction.run clears this.dependencies + calls dep.cleanUp
    // before re-running [source]. After a conditional-branch swap the old
    // dependency should NOT retain the reaction.
    const flag = new Signal(true);
    const a = new Signal('a');
    const b = new Signal('b');

    let lastSeen;
    Reaction.create(() => {
      lastSeen = flag.get() ? a.get() : b.get();
    });
    expect(lastSeen).toBe('a');
    expect(a.hasDependents()).toBe(true);
    expect(b.hasDependents()).toBe(false);

    flag.set(false);
    Reaction.flush();
    expect(lastSeen).toBe('b');

    // a should be unsubscribed; setting it must NOT retrigger.
    expect(a.hasDependents()).toBe(false);
    expect(b.hasDependents()).toBe(true);

    const cb = vi.fn();
    Reaction.create(() => {
      lastSeen = flag.get() ? a.get() : b.get();
      cb();
    });
    a.set('a2'); // would only retrigger if a still had subscribers
    Reaction.flush();
    expect(cb).toHaveBeenCalledTimes(1); // initial only
  });
});

/*******************************
          Reaction.guard
*******************************/

describe('Reaction.guard', () => {
  it('returns the value when called outside a reactive context', () => {
    // Witness: reaction.guard early-returns f() when Scheduler.current is
    // null [source]. Used by callers that do not know whether they are
    // inside a Reaction.
    const result = Reaction.guard(() => 42);
    expect(result).toBe(42);
    expect(Scheduler.current).toBe(null);
  });

  it('passes through to the function on first run inside a reaction', () => {
    const s = new Signal(10);
    let observed;
    Reaction.create(() => {
      observed = Reaction.guard(() => s.get() * 2);
    });
    expect(observed).toBe(20);
  });

  it('uses a custom equality check to gate downstream invalidation', () => {
    // Witness: reaction.guard accepts a second `equalCheck` arg [source].
    const callback = vi.fn();
    const obj = new Signal({ a: 1, b: 1 });

    Reaction.create(() => {
      Reaction.guard(
        () => obj.get(),
        (oldV, newV) => oldV?.a === newV?.a, // gate on `a` only
      );
      callback();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    obj.set({ a: 1, b: 2 }); // b changes but a stays the same
    Reaction.flush();
    expect(callback).toHaveBeenCalledTimes(1); // no retrigger

    obj.set({ a: 2, b: 2 }); // a changes
    Reaction.flush();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('does not accumulate inner reactions on the source across outer re-runs', () => {
    // Witness: outer.onCleanup(() => comp.stop()) in guard [source]. Each
    // outer re-run stops the prior inner comp before creating a new one,
    // so the source signal's subscriber set stays bounded.
    const counter = new Signal(0);
    Reaction.create(() => {
      Reaction.guard(() => counter.get());
    });

    for (let i = 1; i <= 5; i++) {
      counter.set(i);
      Reaction.flush();
    }

    expect(counter.dependency.subscribers.size).toBe(1);
  });

  it('stops the inner reaction when the outer reaction stops', () => {
    const counter = new Signal(0);
    const outer = Reaction.create(() => {
      Reaction.guard(() => counter.get());
    });
    expect(counter.dependency.subscribers.size).toBe(1);

    outer.stop();
    expect(counter.dependency.subscribers.size).toBe(0);
  });
});

/*******************************
        Reaction.onCleanup
*******************************/

describe('Reaction.onCleanup', () => {
  it('fires registered callbacks at the start of the next run()', () => {
    const s = new Signal(0);
    const cleanup = vi.fn();

    Reaction.create((self) => {
      s.get();
      self.onCleanup(cleanup);
    });
    expect(cleanup).not.toHaveBeenCalled();

    s.set(1);
    Reaction.flush();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('fires registered callbacks on stop()', () => {
    const cleanup = vi.fn();
    const r = Reaction.create((self) => {
      self.onCleanup(cleanup);
    });
    expect(cleanup).not.toHaveBeenCalled();

    r.stop();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('clears the queue after firing — re-runs only fire freshly registered callbacks', () => {
    const s = new Signal(0);
    const cleanup = vi.fn();
    const r = Reaction.create((self) => {
      s.get();
      if (self.firstRun) {
        self.onCleanup(cleanup);
      }
    });

    s.set(1);
    Reaction.flush();
    expect(cleanup).toHaveBeenCalledTimes(1);

    s.set(2);
    Reaction.flush();
    expect(cleanup).toHaveBeenCalledTimes(1); // no double-fire
  });

  it('fires callbacks in registration order', () => {
    const order = [];
    const r = Reaction.create((self) => {
      self.onCleanup(() => order.push('a'));
      self.onCleanup(() => order.push('b'));
      self.onCleanup(() => order.push('c'));
    });
    r.stop();
    expect(order).toEqual(['a', 'b', 'c']);
  });
});

/*******************************
        Helpers — tracing modes
*******************************/

describe('helpers — tracing modes', () => {
  it('starts in tracing="off" — isTracing and isStackCapture both false', () => {
    // (afterEach above resets state. Verify the initial contract.)
    expect(isTracing()).toBe(false);
    expect(isStackCapture()).toBe(false);
  });

  it('setTracing(true) transitions off → context but does not enable stack capture', () => {
    setTracing(true);
    expect(isTracing()).toBe(true);
    expect(isStackCapture()).toBe(false);
  });

  it('setTracing(false) collapses any mode (context or stack) back to off', () => {
    setStackCapture(true);
    expect(isTracing()).toBe(true);
    expect(isStackCapture()).toBe(true);

    setTracing(false);
    expect(isTracing()).toBe(false);
    expect(isStackCapture()).toBe(false);
  });

  it('setStackCapture(true) implies tracing', () => {
    // Witness: helpers.js — setStackCapture(true) sets mode = 'stack'
    // directly [source]. Skill text: "stack implies context".
    setStackCapture(true);
    expect(isTracing()).toBe(true);
    expect(isStackCapture()).toBe(true);
  });

  it('setStackCapture(false) demotes stack → context, leaving tracing on', () => {
    // Witness: helpers.js — if (mode === 'stack') mode = 'context' [source].
    setStackCapture(true);
    setStackCapture(false);

    expect(isStackCapture()).toBe(false);
    expect(isTracing()).toBe(true); // demote, do not turn off
  });

  it('setStackCapture(false) is a no-op when stack capture was never on', () => {
    expect(isTracing()).toBe(false);
    setStackCapture(false);
    expect(isTracing()).toBe(false);
    expect(isStackCapture()).toBe(false);
  });

  it('setTracing(true) is idempotent — does not promote context → stack', () => {
    // Witness: helpers.js — setTracing(true) only transitions when
    // mode === 'off' [source]. Repeated calls must not escalate.
    setTracing(true);
    setTracing(true);
    setTracing(true);
    expect(isTracing()).toBe(true);
    expect(isStackCapture()).toBe(false);
  });

  it('Signal.setContext is a no-op when tracing is off', () => {
    // Witness: signal.setContext early-returns when !isTracing() [source].
    // Verifies the zero-allocation guarantee on the hot path.
    const s = new Signal('val');
    s.setContext({ foo: 'bar' });
    expect(s.context).toBeUndefined();
  });

  it('Signal.setContext populates context when tracing is on', () => {
    setTracing(true);
    const s = new Signal('val', { context: { name: 'mySignal' } });
    expect(s.context).toBeDefined();
    expect(s.context.name).toBe('mySignal');
    expect(s.context.value).toBe('val');
  });

  it('Reaction.setContext is a no-op when tracing is off', () => {
    const r = Reaction.create(() => {});
    r.setContext({ name: 'r1' });
    expect(r.context).toBeUndefined();
  });

  it('Dependency.setContext is a no-op when tracing is off', () => {
    const d = new Dependency({ name: 'd1' });
    expect(d.context).toBeUndefined();
  });
});

/*******************************
      Mid-reaction invalidation
*******************************/

describe('mid-reaction signal updates', () => {
  it('a reaction that sets its own dependency does not infinite-loop in one flush', () => {
    // Witness: Scheduler.maxFlushIterations = 100 [source]. Self-mutating
    // reactions that converge must complete; ones that don't must be cut.
    const n = new Signal(0);
    let runs = 0;

    Reaction.create(() => {
      runs++;
      const v = n.get();
      if (v < 3) { n.set(v + 1); // converges
       }
    });

    Reaction.flush();
    expect(n.peek()).toBe(3);
    // Should converge in a handful of passes, not exhaust the safety limit.
    expect(runs).toBeLessThan(20);
  });

  it('Signal.set after Reaction.stop does not error or reactivate', () => {
    const n = new Signal(0);
    const cb = vi.fn();
    const r = Reaction.create(() => {
      n.get();
      cb();
    });
    expect(cb).toHaveBeenCalledTimes(1);

    r.stop();
    n.set(1);
    n.set(2);
    n.set(3);
    Reaction.flush();

    expect(cb).toHaveBeenCalledTimes(1);
    expect(r.active).toBe(false);
  });
});

/*******************************
   peek vs get and "no clone" path
*******************************/

describe('Signal — read paths via internals', () => {
  it('get({ clone: false }) creates a dependency but returns the live reference', () => {
    // Witness: signal.get [source] — when clone:false, depend() is called
    // and currentValue is returned as-is. Lets callers opt out of the
    // clone cost while keeping reactivity.
    const obj = { a: 1 };
    const s = new Signal(obj);
    let lastSeen;
    Reaction.create(() => {
      lastSeen = s.get({ clone: false });
    });

    expect(lastSeen).toBe(s.currentValue); // identity, no clone

    s.set({ a: 2 });
    Reaction.flush();
    expect(lastSeen.a).toBe(2);
  });

  it('peek returns a clone (defensive read) but no dependency', () => {
    // Witness: signal.peek calls maybeClone [source]. Mutating the peeked
    // copy must not affect the internal value.
    const s = new Signal([1, 2, 3]);
    const peeked = s.peek();
    peeked.push(99);
    expect(s.peek()).toEqual([1, 2, 3]);
  });
});
