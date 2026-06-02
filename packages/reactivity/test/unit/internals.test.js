import {
  afterFlush,
  currentReaction,
  Dependency,
  flush,
  guard,
  isStackCapture,
  isTracing,
  nonreactive,
  Reaction,
  reaction,
  scheduleFlush,
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

    reaction(() => {
      callback(`${a.get()} ${b.get()}`);
    });
    expect(callback).toHaveBeenCalledTimes(1);

    a.set('Jane');
    b.set('Smith');
    flush();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('Jane Smith');
  });

  it('runs reactions scheduled during a flush in the same flush pass', () => {
    const trigger = new Signal(0);
    const downstream = new Signal('idle');
    const log = [];

    reaction(() => {
      log.push(`upstream:${trigger.get()}`);
      // mid-flush write to a different signal
      downstream.set(`derived-${trigger.peek()}`);
    });
    reaction(() => {
      log.push(`downstream:${downstream.get()}`);
    });

    log.length = 0;
    trigger.set(1);
    flush();

    expect(log).toContain('upstream:1');
    expect(log).toContain('downstream:derived-1');
  });

  it('processes afterFlush callbacks only once per flush after all reactions settle', () => {
    const n = new Signal(0);
    const reactionLog = [];
    const afterFlushLog = [];

    reaction(() => {
      reactionLog.push(n.get());
    });

    [1, 2, 3, 4, 5].forEach(v => n.set(v));
    afterFlush(() => {
      // afterFlush runs post reaction-drain, so the reaction has already seen the final value (5)
      afterFlushLog.push(n.peek());
    });

    flush();

    expect(reactionLog[reactionLog.length - 1]).toBe(5);
    expect(afterFlushLog).toEqual([5]);
  });

  it('runs afterFlush callbacks in registration order', () => {
    const order = [];
    afterFlush(() => order.push('first'));
    afterFlush(() => order.push('second'));
    afterFlush(() => order.push('third'));

    flush();

    expect(order).toEqual(['first', 'second', 'third']);
  });

  it('breaks an unconditional A↔B reactive cycle and logs an error', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const a = new Signal(0);
    const b = new Signal(0);

    reaction(() => {
      b.set(a.get() + 1);
    });
    reaction(() => {
      a.set(b.get() + 1);
    });

    flush();

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mock.calls[0][0]).toMatch(/cycle detected/i);
    expect(Scheduler.pendingReactions.size).toBe(0);
    errorSpy.mockRestore();
  });

  // the cycle cap spans both queues with a unified iteration counter — a reaction
  // that schedules an afterFlush that re-invalidates the reaction must also hit it
  it('breaks a reaction↔afterFlush cycle and logs an error', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const trigger = new Signal(0);

    reaction(() => {
      trigger.get();
      afterFlush(() => trigger.set(trigger.peek() + 1));
    });

    trigger.set(1);
    flush();

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mock.calls.some(c => /cycle detected/i.test(c[0]))).toBe(true);
    expect(Scheduler.pendingReactions.size).toBe(0);
    expect(Scheduler.afterFlushCallbacks.length).toBe(0);
    errorSpy.mockRestore();
  });

  // exception in one reaction must not silently swallow others in the same batch
  // either it propagates or framework isolates each, this test pins which
  it('continues processing remaining reactions when one throws', () => {
    const a = new Signal(0);
    const b = new Signal(0);
    let bSeen = 0;

    reaction(() => {
      if (a.get() === 1) {
        throw new Error('boom');
      }
    });
    reaction(() => {
      bSeen = b.get();
    });

    a.set(1);
    b.set(42);

    let caught;
    try {
      flush();
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

    reaction(() => {
      const v = n.get();
      if (v === 1) { throw new Error('once'); }
      seen.push(v);
    });

    n.set(1);
    try {
      flush();
    }
    catch (_) {}

    n.set(2);
    flush();

    expect(seen).toContain(2);
  });

  it('does not double-schedule a microtask when a flush is already pending', () => {
    const callback = vi.fn();
    const n = new Signal(0);

    reaction(() => callback(n.get()));
    expect(callback).toHaveBeenCalledTimes(1);

    for (let i = 1; i <= 6; i++) { n.set(i); }
    flush();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(6);
  });

  it('runs afterFlush via microtask without an explicit flush call', async () => {
    const cb = vi.fn();
    afterFlush(cb);
    scheduleFlush();
    await Promise.resolve();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('handles afterFlush registered from inside a reaction body', () => {
    const trigger = new Signal(false);
    const settled = vi.fn();

    reaction(() => {
      if (trigger.get()) {
        afterFlush(settled);
      }
    });

    trigger.set(true);
    flush();

    expect(settled).toHaveBeenCalledTimes(1);
  });

  it('drains afterFlush callbacks registered during afterFlush in the same flush', () => {
    let runCount = 0;
    const recursive = () => {
      runCount++;
      if (runCount < 5) {
        afterFlush(recursive);
      }
    };
    afterFlush(recursive);

    flush();
    expect(runCount).toBe(5);
  });

  it('schedules a flush when afterFlush registers with no pending work', async () => {
    const cb = vi.fn();
    afterFlush(cb);
    await Promise.resolve();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('keeps draining when an afterFlush callback throws', () => {
    const survivor = vi.fn();
    afterFlush(() => {
      throw new Error('boom');
    });
    afterFlush(survivor);

    expect(() => flush()).toThrow('boom');
    expect(survivor).toHaveBeenCalledTimes(1);
  });

  it('drains reactions queued by an afterFlush callback before the next callback runs', () => {
    const source = new Signal('initial');
    const derived = new Signal('initial');

    reaction(() => {
      derived.set(`reaction-saw-${source.get()}`);
    });

    let observedInCb2;
    afterFlush(() => {
      source.set('updated-by-cb1');
      afterFlush(() => {
        observedInCb2 = derived.peek();
      });
    });

    flush();
    expect(observedInCb2).toBe('reaction-saw-updated-by-cb1');
  });
});

/*******************************
        Scheduler — current
*******************************/

describe('Scheduler — current reaction context', () => {
  it('exposes the currently-running reaction via currentReaction()', () => {
    let seen = null;
    const r = reaction(function inside() {
      seen = currentReaction();
    });
    expect(seen).toBe(r);
  });

  it('clears Scheduler.current after a reaction finishes', () => {
    reaction(() => {});
    expect(Scheduler.current).toBe(null);
  });

  it('restores Scheduler.current after a reaction throws', () => {
    expect(() => {
      reaction(() => {
        throw new Error('mid-run');
      });
    }).toThrow('mid-run');

    expect(Scheduler.current).toBe(null);

    // reading a signal outside a reaction must not attach a dependency
    const s = new Signal('x');
    s.get();
    expect(s.hasDependents()).toBe(false);
  });

  it('advances firstRun even when the callback throws, so re-invalidation tracks fresh deps', () => {
    const trigger = new Signal(0);
    let throwOnce = true;
    const callback = vi.fn();
    let captured;

    // reaction throws because the first run does, so capture the instance via the callback arg
    expect(() => {
      reaction((r) => {
        captured = r;
        trigger.get();
        callback(r.firstRun);
        if (throwOnce) {
          throwOnce = false;
          throw new Error('first run throws');
        }
      });
    }).toThrow('first run throws');

    expect(captured.firstRun).toBe(false);

    trigger.set(1);
    flush();
    expect(callback).toHaveBeenLastCalledWith(false);
  });

  it('nonreactive nests correctly — restores outer reaction when inner returns', () => {
    const outer = new Signal('outer');
    const inner = new Signal('inner');
    const seen = vi.fn();

    reaction(() => {
      nonreactive(() => inner.get());
      seen(outer.get());
    });

    inner.set('inner-changed');
    flush();
    expect(seen).toHaveBeenCalledTimes(1);

    outer.set('outer-changed');
    flush();
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

    const rA = reaction(() => {
      s.get();
      a();
    });
    reaction(() => {
      s.get();
      b();
    });

    expect(s.hasDependents()).toBe(true);

    rA.stop();
    expect(s.hasDependents()).toBe(true);

    s.set(1);
    flush();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(2);
  });

  it('stop() cleanly unsubscribes all of a reaction’s dependencies', () => {
    const s1 = new Signal(0);
    const s2 = new Signal(0);
    const r = reaction(() => {
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
    const r = reaction(() => s.get());

    expect(() => {
      r.stop();
      r.stop();
    }).not.toThrow();
    expect(r.active).toBe(false);
  });

  it('a stopped reaction never re-runs even if a dependency change races in', () => {
    const s = new Signal(0);
    const cb = vi.fn();

    const r = reaction(() => {
      s.get();
      cb();
    });
    expect(cb).toHaveBeenCalledTimes(1);

    s.set(1);
    r.stop();
    flush();

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('dependency tracking re-establishes after each reaction run (no stale subscriptions)', () => {
    const flag = new Signal(true);
    const a = new Signal('a');
    const b = new Signal('b');

    let lastSeen;
    reaction(() => {
      lastSeen = flag.get() ? a.get() : b.get();
    });
    expect(lastSeen).toBe('a');
    expect(a.hasDependents()).toBe(true);
    expect(b.hasDependents()).toBe(false);

    flag.set(false);
    flush();
    expect(lastSeen).toBe('b');

    expect(a.hasDependents()).toBe(false);
    expect(b.hasDependents()).toBe(true);

    const cb = vi.fn();
    reaction(() => {
      lastSeen = flag.get() ? a.get() : b.get();
      cb();
    });
    a.set('a2');
    flush();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

/*******************************
          Reaction.guard
*******************************/

describe('guard()', () => {
  it('returns the value when called outside a reactive context', () => {
    const result = guard(() => 42);
    expect(result).toBe(42);
    expect(Scheduler.current).toBe(null);
  });

  it('passes through to the function on first run inside a reaction', () => {
    const s = new Signal(10);
    let observed;
    reaction(() => {
      observed = guard(() => s.get() * 2);
    });
    expect(observed).toBe(20);
  });

  it('uses a custom equality check to gate downstream invalidation', () => {
    const callback = vi.fn();
    const obj = new Signal({ a: 1, b: 1 });

    reaction(() => {
      guard(
        () => obj.get(),
        (oldV, newV) => oldV?.a === newV?.a,
      );
      callback();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    obj.set({ a: 1, b: 2 });
    flush();
    expect(callback).toHaveBeenCalledTimes(1);

    obj.set({ a: 2, b: 2 });
    flush();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  // each outer re-run must stop the prior inner comp so the source's subscriber set stays bounded
  it('does not accumulate inner reactions on the source across outer re-runs', () => {
    const counter = new Signal(0);
    reaction(() => {
      guard(() => counter.get());
    });

    for (let i = 1; i <= 5; i++) {
      counter.set(i);
      flush();
    }

    expect(counter.dependency.subscribers.size).toBe(1);
  });

  it('stops the inner reaction when the outer reaction stops', () => {
    const counter = new Signal(0);
    const outer = reaction(() => {
      guard(() => counter.get());
    });
    expect(counter.dependency.subscribers.size).toBe(1);

    outer.stop();
    expect(counter.dependency.subscribers.size).toBe(0);
  });

  it('propagates value changes after the first f() throws', () => {
    const source = new Signal('first');
    let throwOnce = true;
    const downstream = vi.fn();

    expect(() => {
      reaction(() => {
        const v = guard(() => {
          const x = source.get();
          if (throwOnce) {
            throwOnce = false;
            throw new Error('first run throws');
          }
          return x;
        });
        downstream(v);
      });
    }).toThrow('first run throws');

    expect(downstream).not.toHaveBeenCalled();

    // a signal change re-fires the inner guard, which now succeeds and propagates upward
    source.set('second');
    flush();
    expect(downstream).toHaveBeenCalledWith('second');
  });
});

/*******************************
        Reaction.onCleanup
*******************************/

describe('reaction.onCleanup', () => {
  it('fires registered callbacks at the start of the next run()', () => {
    const s = new Signal(0);
    const cleanup = vi.fn();

    reaction((self) => {
      s.get();
      self.onCleanup(cleanup);
    });
    expect(cleanup).not.toHaveBeenCalled();

    s.set(1);
    flush();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('fires registered callbacks on stop()', () => {
    const cleanup = vi.fn();
    const r = reaction((self) => {
      self.onCleanup(cleanup);
    });
    expect(cleanup).not.toHaveBeenCalled();

    r.stop();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('clears the queue after firing — re-runs only fire freshly registered callbacks', () => {
    const s = new Signal(0);
    const cleanup = vi.fn();
    const r = reaction((self) => {
      s.get();
      if (self.firstRun) {
        self.onCleanup(cleanup);
      }
    });

    s.set(1);
    flush();
    expect(cleanup).toHaveBeenCalledTimes(1);

    s.set(2);
    flush();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('fires callbacks in registration order', () => {
    const order = [];
    const r = reaction((self) => {
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
    const r = reaction(() => {});
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

    reaction(() => {
      runs++;
      const v = n.get();
      if (v < 3) { n.set(v + 1); }
    });

    flush();
    expect(n.peek()).toBe(3);
    expect(runs).toBeLessThan(20);
  });

  it('Signal.set after Reaction.stop does not error or reactivate', () => {
    const n = new Signal(0);
    const cb = vi.fn();
    const r = reaction(() => {
      n.get();
      cb();
    });
    expect(cb).toHaveBeenCalledTimes(1);

    r.stop();
    n.set(1);
    n.set(2);
    n.set(3);
    flush();

    expect(cb).toHaveBeenCalledTimes(1);
    expect(r.active).toBe(false);
  });
});

/*******************************
   peek vs get and "no clone" path
*******************************/

describe('Signal — read paths via internals', () => {
  it('raw() returns the live reference without creating a dependency', () => {
    const obj = { a: 1 };
    const s = new Signal(obj);
    let lastSeen;
    let runs = 0;
    reaction(() => {
      runs++;
      lastSeen = s.raw();
    });

    expect(runs).toBe(1);
    expect(lastSeen).toBe(s.currentValue);

    s.set({ a: 2 });
    flush();
    // raw() did not subscribe — reaction does not re-run
    expect(runs).toBe(1);
    expect(lastSeen.a).toBe(1);
  });

  it('peek returns the live reference under reference safety', () => {
    const s = new Signal([1, 2, 3], { safety: 'reference' });
    const peeked = s.peek();
    expect(peeked).toBe(s.raw());
    peeked.push(99);
    expect(s.peek()).toEqual([1, 2, 3, 99]);
  });

  it('peek returns a defensive clone under clone safety', () => {
    const s = new Signal([1, 2, 3], { safety: 'clone' });
    const peeked = s.peek();
    peeked.push(99);
    expect(s.peek()).toEqual([1, 2, 3]);
  });
});
