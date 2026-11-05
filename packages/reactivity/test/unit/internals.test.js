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
  settled,
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
    expect(dep.subscribers).toBe(null);
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

  it('stopping the middle of three subscribers leaves the other two running once each', () => {
    const s = new Signal(0);
    const first = vi.fn();
    const middle = vi.fn();
    const last = vi.fn();
    reaction(() => {
      s.get();
      first();
    });
    const middleReaction = reaction(() => {
      s.get();
      middle();
    });
    reaction(() => {
      s.get();
      last();
    });
    middleReaction.stop();

    s.set(1);
    flush();
    expect(first).toHaveBeenCalledTimes(2);
    expect(middle).toHaveBeenCalledTimes(1);
    expect(last).toHaveBeenCalledTimes(2);
  });

  // the subscriber that fills a stopped one's place must still be the one its own stop removes
  it('a subscriber moved by another’s stop is the one its own stop removes', () => {
    const s = new Signal(0);
    const first = vi.fn();
    const moved = vi.fn();
    const added = vi.fn();
    reaction(() => {
      s.get();
      first();
    });
    const middleReaction = reaction(() => {
      s.get();
    });
    const movedReaction = reaction(() => {
      s.get();
      moved();
    });
    middleReaction.stop();
    reaction(() => {
      s.get();
      added();
    });
    movedReaction.stop();

    s.set(1);
    flush();
    expect(first).toHaveBeenCalledTimes(2);
    expect(moved).toHaveBeenCalledTimes(1);
    expect(added).toHaveBeenCalledTimes(2);
  });

  it('a run that stops reading a dependency drops only that edge', () => {
    const a = new Signal(0);
    const b = new Signal(0);
    const c = new Signal(0);
    const callback = vi.fn();
    reaction((comp) => {
      a.get();
      if (comp.firstRun) {
        b.get();
      }
      c.get();
      callback();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    a.set(1);
    flush();
    expect(callback).toHaveBeenCalledTimes(2);

    b.set(1);
    flush();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(b.hasDependents()).toBe(false);

    c.set(1);
    flush();
    expect(callback).toHaveBeenCalledTimes(3);
    a.set(2);
    flush();
    expect(callback).toHaveBeenCalledTimes(4);
  });

  // invalidate() aborts an in-flight async run, and an abort listener is user code
  // that can stop a subscriber while changed() is still walking the array
  it('a subscriber stopping itself from its abort listener hides no later subscriber from the change', async () => {
    const s = new Signal(0);
    let release;
    const inFlight = new Promise((resolve) => {
      release = resolve;
    });
    const first = reaction((comp) => {
      s.get();
      comp.abortSignal.addEventListener('abort', () => first.stop());
      return inFlight;
    });
    const second = vi.fn();
    reaction(() => {
      s.get();
      second();
    });
    const third = vi.fn();
    reaction(() => {
      s.get();
      third();
    });

    s.set(1);
    flush();
    expect(second).toHaveBeenCalledTimes(2);
    expect(third).toHaveBeenCalledTimes(2);

    release();
    await inFlight;
  });

  it('remove(reaction) drops that reaction alone and leaves its later stop harmless', () => {
    const dep = new Dependency();
    const kept = vi.fn();
    const dropped = vi.fn();
    const keeper = reaction(() => {
      dep.depend();
      kept();
    });
    const watcher = reaction(() => {
      dep.depend();
      dropped();
    });
    // a third subscriber so the removal moves one into the vacated slot
    const other = reaction(() => {
      dep.depend();
    });

    dep.remove(watcher);
    dep.remove(watcher);
    dep.changed();
    flush();
    expect(dropped).toHaveBeenCalledTimes(1);
    expect(kept).toHaveBeenCalledTimes(2);

    watcher.stop();
    other.stop();
    dep.changed();
    flush();
    expect(kept).toHaveBeenCalledTimes(3);

    keeper.stop();
    expect(dep.subscribers).toBe(null);
  });

  // the reaction's own entry for the dependency goes too, and the entry that moves
  // into its place keeps the dependency's record of it correct for later moves
  it('remove(reaction) unlinks a dependency held in the reaction’s array so later moves stay correct', () => {
    const a = new Signal(0);
    const dep = new Dependency();
    const b = new Signal(0);
    const other = reaction(() => {
      b.get();
    });
    const third = vi.fn();
    reaction(() => {
      b.get();
      third();
    });
    const callback = vi.fn();
    const r = reaction(() => {
      a.get();
      dep.depend();
      b.get();
      callback();
    });

    dep.remove(r);
    expect(dep.subscribers).toBe(null);
    expect(r.dependencies.length).toBe(1);
    expect(r.dependencies[0]).toBe(b.dependency);

    // other's stop moves r within b's subscribers, then r re-runs and re-tracks b
    other.stop();
    b.set(1);
    flush();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(third).toHaveBeenCalledTimes(2);
    b.set(2);
    flush();
    expect(third).toHaveBeenCalledTimes(3);
    expect(b.dependency.subscribers.length).toBe(2);
  });

  describe('edges across runs', () => {
    it('a stable re-run touches no edge array on either side', () => {
      const a = new Signal(0);
      const b = new Signal(0);
      const c = new Signal(0);
      const signals = [a, b, c];
      const r = reaction(() => {
        a.get();
        b.get();
        c.get();
      });
      const before = signals.map((
        s,
      ) => [s.dependency.subscribers, s.dependency.subscriberSlots, s.dependency.subscriberSlots[0]]);
      const dependencies = r.dependencies;
      const slots = r.dependencySlots;
      const removeAt = vi.spyOn(Dependency.prototype, 'removeAt');

      a.set(1);
      flush();

      expect(removeAt).not.toHaveBeenCalled();
      removeAt.mockRestore();
      expect(r.dependency).toBe(a.dependency);
      expect(r.dependencies).toBe(dependencies);
      expect(r.dependencySlots).toBe(slots);
      signals.forEach((s, i) => {
        expect(s.dependency.subscribers).toBe(before[i][0]);
        expect(s.dependency.subscriberSlots).toBe(before[i][1]);
        expect(s.dependency.subscriberSlots[0]).toBe(before[i][2]);
      });
    });

    it('reading the same dependencies in a new order keeps every edge once with correct slots', () => {
      const a = new Signal(0);
      const b = new Signal(0);
      const c = new Signal(0);
      const signals = [a, b, c];
      // two earlier subscribers per signal: stopping the first moves the reaction
      // within that signal's subscribers, and its own stop must still hit its slot
      const firsts = signals.map((s) =>
        reaction(() => {
          s.get();
        })
      );
      const seconds = signals.map((s) => {
        const ran = vi.fn();
        reaction(() => {
          s.get();
          ran();
        });
        return ran;
      });
      let reversed = false;
      const runs = vi.fn();
      const r = reaction(() => {
        runs();
        if (reversed) {
          c.get();
          b.get();
          a.get();
        }
        else {
          a.get();
          b.get();
          c.get();
        }
      });

      reversed = true;
      a.set(1);
      flush();
      expect(runs).toHaveBeenCalledTimes(2);
      expect(r.dependency).toBe(c.dependency);
      expect(r.dependencies.length).toBe(2);
      expect(r.dependencies[0]).toBe(b.dependency);
      expect(r.dependencies[1]).toBe(a.dependency);
      for (const s of signals) {
        expect(s.dependency.subscribers.length).toBe(3);
      }

      for (const first of firsts) {
        first.stop();
      }
      r.stop();
      for (const ran of seconds) {
        ran.mockClear();
      }
      a.set(2);
      b.set(2);
      c.set(2);
      flush();
      expect(runs).toHaveBeenCalledTimes(2);
      for (const ran of seconds) {
        expect(ran).toHaveBeenCalledTimes(1);
      }
      for (const s of signals) {
        expect(s.dependency.subscribers.length).toBe(1);
      }
    });

    it('alternating reads drop exactly the unread edge and add exactly the new one', () => {
      const toggle = new Signal(true);
      const a = new Signal(0);
      const b = new Signal(0);
      const runs = vi.fn();
      const r = reaction(() => {
        runs();
        if (toggle.get()) {
          a.get();
        }
        else {
          b.get();
        }
      });
      expect(a.hasDependents()).toBe(true);
      expect(b.hasDependents()).toBe(false);
      const removeAt = vi.spyOn(Dependency.prototype, 'removeAt');

      toggle.set(false);
      flush();

      expect(removeAt).toHaveBeenCalledTimes(1);
      removeAt.mockRestore();
      expect(a.hasDependents()).toBe(false);
      expect(b.dependency.subscribers.length).toBe(1);
      expect(r.dependency).toBe(toggle.dependency);
      expect(r.dependencies.length).toBe(1);
      expect(r.dependencies[0]).toBe(b.dependency);

      a.set(1);
      flush();
      expect(runs).toHaveBeenCalledTimes(2);
      b.set(1);
      flush();
      expect(runs).toHaveBeenCalledTimes(3);
    });

    it('a run that throws keeps last run’s edges, so a fix to an unread input re-triggers it', () => {
      const a = new Signal(0);
      const b = new Signal(0);
      let shouldThrow = false;
      const runs = vi.fn();
      reaction(() => {
        runs();
        a.get();
        if (shouldThrow) {
          throw new Error('boom');
        }
        b.get();
      });

      shouldThrow = true;
      a.set(1);
      expect(() => flush()).toThrow('boom');
      expect(runs).toHaveBeenCalledTimes(2);

      shouldThrow = false;
      b.set(1);
      flush();
      expect(runs).toHaveBeenCalledTimes(3);
    });

    it('an async run sweeps at settle, so an edge read after an await survives the sync body', async () => {
      const a = new Signal(0);
      const b = new Signal(0);
      let release;
      const runs = vi.fn();
      reaction(async (comp) => {
        a.get();
        runs();
        await new Promise((resolve) => {
          release = resolve;
        });
        comp.track(() => b.get());
      });
      release();
      await settled();
      expect(b.hasDependents()).toBe(true);

      a.set(1);
      flush();
      expect(runs).toHaveBeenCalledTimes(2);
      // the second run has read a and is waiting, b is unread so far and still subscribed
      expect(b.hasDependents()).toBe(true);
      release();
      await settled();
      expect(b.hasDependents()).toBe(true);

      b.set(1);
      flush();
      expect(runs).toHaveBeenCalledTimes(3);
      release();
      await settled();
    });

    // past four subscribers the array grows in place, the fifth and later slots must still be right
    it('the fifth and later subscribers record the slot they actually took', () => {
      const s = new Signal(0);
      const runs = [];
      const reactions = [];
      for (let i = 0; i < 7; i++) {
        const ran = vi.fn();
        runs.push(ran);
        reactions.push(reaction(() => {
          s.get();
          ran();
        }));
      }

      // stopping the sixth must drop the sixth, not whoever sits at the slot it recorded
      reactions[5].stop();
      s.set(1);
      flush();
      runs.forEach((ran, i) => {
        expect(ran).toHaveBeenCalledTimes(i === 5 ? 1 : 2);
      });
      expect(s.dependency.subscribers.length).toBe(6);
    });

    // a seeded walk over random read sets, stops and re-runs, checking after each
    // step that every edge is recorded the same way on both sides
    it('edge records on both sides agree under random read orders, stops and re-runs', () => {
      let seed = 7;
      const random = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      const pick = (n) => Math.floor(random() * n);
      const signals = [new Signal(0), new Signal(0), new Signal(0)];
      const reactions = [];
      const check = () => {
        for (const r of reactions) {
          const count = r.dependencyCount();
          expect(r.cursor).toBe(count);
          for (let position = 0; position < count; position++) {
            const dependency = r.dependencyAt(position);
            const slot = r.slotAt(position);
            expect(dependency.subscribers[slot]).toBe(r);
            expect(dependency.subscriberSlots[slot]).toBe(position === 0 ? -1 : position - 1);
          }
        }
        for (const s of signals) {
          const { subscribers, subscriberSlots } = s.dependency;
          for (let slot = 0; subscribers !== null && slot < subscribers.length; slot++) {
            const position = subscriberSlots[slot] === -1 ? 0 : subscriberSlots[slot] + 1;
            expect(subscribers[slot].dependencyAt(position)).toBe(s.dependency);
            expect(subscribers[slot].slotAt(position)).toBe(slot);
          }
        }
      };

      for (let step = 0; step < 300; step++) {
        const roll = random();
        if (roll < 0.25 || reactions.length < 3) {
          reactions.push(reaction(() => {
            const reads = 1 + pick(3);
            for (let i = 0; i < reads; i++) {
              signals[pick(3)].get();
            }
          }));
        }
        else if (roll < 0.8) {
          signals[pick(3)].set(random());
          flush();
        }
        else {
          const index = pick(reactions.length);
          reactions[index].stop();
          reactions.splice(index, 1);
        }
        check();
      }
    });
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

    expect(counter.dependency.subscribers.length).toBe(1);
  });

  it('stops the inner reaction when the outer reaction stops', () => {
    const counter = new Signal(0);
    const outer = reaction(() => {
      guard(() => counter.get());
    });
    expect(counter.dependency.subscribers.length).toBe(1);

    outer.stop();
    expect(counter.dependency.subscribers).toBe(null);
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

  it('peek returns the live reference by default (reference safety)', () => {
    const s = new Signal([1, 2, 3]);
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
