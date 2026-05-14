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

    expect(log).toContain('upstream:1');
    expect(log).toContain('downstream:derived-1');
  });

  it('processes afterFlush callbacks only once per flush after all reactions settle', () => {
    const n = new Signal(0);
    const reactionLog = [];
    const afterFlushLog = [];

    Reaction.create(() => {
      reactionLog.push(n.get());
    });

    [1, 2, 3, 4, 5].forEach(v => n.set(v));
    Reaction.afterFlush(() => {
      // afterFlush runs post reaction-drain, so the reaction has already seen the final value (5)
      afterFlushLog.push(n.peek());
    });

    Reaction.flush();

    expect(reactionLog[reactionLog.length - 1]).toBe(5);
    expect(afterFlushLog).toEqual([5]);
  });

  it('runs afterFlush callbacks in registration order', () => {
    const order = [];
    Reaction.afterFlush(() => order.push('first'));
    Reaction.afterFlush(() => order.push('second'));
    Reaction.afterFlush(() => order.push('third'));

    Reaction.flush();

    expect(order).toEqual(['first', 'second', 'third']);
  });

  it('breaks an unconditional A↔B reactive cycle and logs an error', () => {
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
    expect(Scheduler.pendingReactions.size).toBe(0);
    errorSpy.mockRestore();
  });

  // exception in one reaction must not silently swallow others in the same batch
  // either it propagates or framework isolates each, this test pins which
  it('continues processing remaining reactions when one throws', () => {
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

    let caught;
    try {
      Reaction.flush();
    }
    catch (e) {
      caught = e;
    }

    expect(bSeen).toBe(42);
    expect(Scheduler.pendingReactions.size).toBe(0);
  });

  it('flushes again cleanly after a previous flush threw', () => {
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
    catch (_) {}

    n.set(2);
    Reaction.flush();

    expect(seen).toContain(2);
  });

  it('does not double-schedule a microtask when a flush is already pending', () => {
    const callback = vi.fn();
    const n = new Signal(0);

    Reaction.create(() => callback(n.get()));
    expect(callback).toHaveBeenCalledTimes(1);

    for (let i = 1; i <= 6; i++) { n.set(i); }
    Reaction.flush();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(6);
  });

  it('runs afterFlush via microtask without an explicit flush call', async () => {
    const cb = vi.fn();
    Reaction.afterFlush(cb);
    Reaction.scheduleFlush();
    await Promise.resolve();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('handles afterFlush registered from inside a reaction body', () => {
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

  // late-registered afterFlush queues for the next flush, otherwise self-registering callbacks would infinite-loop
  it('does not run afterFlush callbacks registered DURING afterFlush in the same pass', () => {
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

    Reaction.flush();
    expect(runCount).toBe(2);
  });
});

/*******************************
        Scheduler — current
*******************************/

describe('Scheduler — current reaction context', () => {
  it('exposes the currently-running reaction via Reaction.current', () => {
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
    expect(() => {
      Reaction.create(() => {
        throw new Error('mid-run');
      });
    }).toThrow('mid-run');

    expect(Scheduler.current).toBe(null);

    // reading a signal outside a reaction must not attach a dependency
    const s = new Signal('x');
    s.get();
    expect(s.hasDependents()).toBe(false);
  });

  it('nonreactive nests correctly — restores outer reaction when inner returns', () => {
    const outer = new Signal('outer');
    const inner = new Signal('inner');
    const seen = vi.fn();

    Reaction.create(() => {
      Reaction.nonreactive(() => inner.get());
      seen(outer.get());
    });

    inner.set('inner-changed');
    Reaction.flush();
    expect(seen).toHaveBeenCalledTimes(1);

    outer.set('outer-changed');
    Reaction.flush();
    expect(seen).toHaveBeenCalledTimes(2);
  });
});

/*******************************
            Dependency
*******************************/

describe('Dependency', () => {
  it('depend() outside a reaction is a no-op', () => {
    const dep = new Dependency();
    expect(() => dep.depend()).not.toThrow();
    expect(dep.subscribers.size).toBe(0);
  });

  it('changed() with no subscribers does not throw or allocate', () => {
    const dep = new Dependency();
    expect(() => dep.changed()).not.toThrow();
    expect(() => dep.changed({ value: 'whatever' })).not.toThrow();
  });

  it('cleanUp removes the reaction without affecting other subscribers', () => {
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
    expect(s.hasDependents()).toBe(true);

    s.set(1);
    Reaction.flush();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(2);
  });

  it('stop() cleanly unsubscribes all of a reaction’s dependencies', () => {
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
    const s = new Signal(0);
    const r = Reaction.create(() => s.get());

    expect(() => {
      r.stop();
      r.stop();
    }).not.toThrow();
    expect(r.active).toBe(false);
  });

  it('a stopped reaction never re-runs even if a dependency change races in', () => {
    const s = new Signal(0);
    const cb = vi.fn();

    const r = Reaction.create(() => {
      s.get();
      cb();
    });
    expect(cb).toHaveBeenCalledTimes(1);

    s.set(1);
    r.stop();
    Reaction.flush();

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('dependency tracking re-establishes after each reaction run (no stale subscriptions)', () => {
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

    expect(a.hasDependents()).toBe(false);
    expect(b.hasDependents()).toBe(true);

    const cb = vi.fn();
    Reaction.create(() => {
      lastSeen = flag.get() ? a.get() : b.get();
      cb();
    });
    a.set('a2');
    Reaction.flush();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

/*******************************
          Reaction.guard
*******************************/

describe('Reaction.guard', () => {
  it('returns the value when called outside a reactive context', () => {
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
    const callback = vi.fn();
    const obj = new Signal({ a: 1, b: 1 });

    Reaction.create(() => {
      Reaction.guard(
        () => obj.get(),
        (oldV, newV) => oldV?.a === newV?.a,
      );
      callback();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    obj.set({ a: 1, b: 2 });
    Reaction.flush();
    expect(callback).toHaveBeenCalledTimes(1);

    obj.set({ a: 2, b: 2 });
    Reaction.flush();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  // each outer re-run must stop the prior inner comp so the source's subscriber set stays bounded
  it('does not accumulate inner reactions on the source across outer re-runs', () => {
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
    expect(cleanup).toHaveBeenCalledTimes(1);
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
    setStackCapture(true);
    expect(isTracing()).toBe(true);
    expect(isStackCapture()).toBe(true);
  });

  it('setStackCapture(false) demotes stack → context, leaving tracing on', () => {
    setStackCapture(true);
    setStackCapture(false);

    expect(isStackCapture()).toBe(false);
    expect(isTracing()).toBe(true);
  });

  it('setStackCapture(false) is a no-op when stack capture was never on', () => {
    expect(isTracing()).toBe(false);
    setStackCapture(false);
    expect(isTracing()).toBe(false);
    expect(isStackCapture()).toBe(false);
  });

  it('setTracing(true) is idempotent — does not promote context → stack', () => {
    setTracing(true);
    setTracing(true);
    setTracing(true);
    expect(isTracing()).toBe(true);
    expect(isStackCapture()).toBe(false);
  });

  it('Signal.setContext is a no-op when tracing is off', () => {
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
    const n = new Signal(0);
    let runs = 0;

    Reaction.create(() => {
      runs++;
      const v = n.get();
      if (v < 3) { n.set(v + 1); }
    });

    Reaction.flush();
    expect(n.peek()).toBe(3);
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
    const obj = { a: 1 };
    const s = new Signal(obj);
    let lastSeen;
    Reaction.create(() => {
      lastSeen = s.get({ clone: false });
    });

    expect(lastSeen).toBe(s.currentValue);

    s.set({ a: 2 });
    Reaction.flush();
    expect(lastSeen.a).toBe(2);
  });

  it('peek returns a clone (defensive read) but no dependency', () => {
    const s = new Signal([1, 2, 3]);
    const peeked = s.peek();
    peeked.push(99);
    expect(s.peek()).toEqual([1, 2, 3]);
  });
});
