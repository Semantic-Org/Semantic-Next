import {
  afterFlush,
  currentReaction,
  flush,
  guard,
  nonreactive,
  Reaction,
  reaction,
  scheduleFlush,
  Scheduler,
  setTracing,
  Signal,
} from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Reaction', () => {
  beforeEach(() => {
    // Reset Reaction state before each test if needed
    Scheduler.current = null;
    Scheduler.pendingReactions.clear();
    Scheduler.afterFlushCallbacks = [];
  });

  describe('Basic Usage', () => {
    it('should trigger reaction on reactive value change', () => {
      const reactiveValue = new Signal('first');
      const callback = vi.fn();

      reaction(() => {
        callback(reactiveValue.get());
      });

      reactiveValue.set('second');
      flush();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, 'first');
      expect(callback).toHaveBeenNthCalledWith(2, 'second');
    });

    it('should handle firstRun and stop computation', () => {
      const saying = new Signal('hello');
      const callback = vi.fn();

      reaction((comp) => {
        if (comp.firstRun) {
          callback('First run!');
        }
        if (saying.get() === 'goodbye') {
          comp.stop();
          callback('Goodbye detected');
        }
      });

      saying.set('goodbye');
      flush();

      expect(callback).toHaveBeenCalledWith('First run!');
      expect(callback).toHaveBeenCalledWith('Goodbye detected');
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('Equality', () => {
    it('should not re-run for identical objects with isEqual', () => {
      let obj1 = { name: 'Sally', age: 22 };
      let obj2 = { name: 'Sally', age: 22 };
      let reactiveObj = new Signal(obj1);
      const callback = vi.fn();

      reaction(() => {
        callback(reactiveObj.get());
      });

      reactiveObj.set(obj2);
      flush();

      // Callback should be called only once due to deep equality
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should always re-run when custom isEqual returns false', () => {
      const customIsEqual = () => false;
      let obj = { name: 'Sally', age: 22 };
      let reactiveObj = new Signal(obj, { equality: customIsEqual });
      const callback = vi.fn();

      reaction(function() {
        reactiveObj.get();
        callback();
      });

      // Initial flush to account for the setup of reactive computation
      flush();

      reactiveObj.set(reactiveObj.get());
      flush();

      // Log runs twice including the initial run due to custom equality function
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('Controlling Reactivity', () => {
    it('guard should control reactivity', () => {
      const userAge = new Signal(30);
      const userName = new Signal('John Doe');
      const lastUpdated = new Signal(new Date());
      const callback = vi.fn();

      reaction(() => {
        const user = guard(() => ({
          name: userName.get(),
          age: userAge.get(),
        }));
        callback(`User Info: ${user.name}, ${user.age}`);
      });

      // Initial flush to account for the setup of reactive computation
      flush();

      userName.set('Jane Doe');
      flush();

      userAge.set(31);
      flush();

      lastUpdated.set(new Date()); // This update should not trigger the reaction guard
      flush();

      // Should include initial run plus updates that trigger guard
      expect(callback).toHaveBeenCalledTimes(3);
    });

    it('guard should control reactivity - example 2', () => {
      const counter = new Signal(0);
      const callback = vi.fn();

      const isEven = () =>
        guard(() => {
          return (counter.get() % 2 === 0);
        });

      reaction((comp) => {
        if (isEven()) {
          callback(`${counter.peek()} is even`);
        }
      });

      counter.set(1); // No output guard is same
      flush();
      counter.set(2); // Output
      flush();
      counter.set(3); // No output guard is same

      // only odd numbers should trigger
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('guard should not re-run for identical objects', () => {
      const user = { name: 'John Doe', age: 30 };
      const reactiveUser = new Signal(user);
      const callback = vi.fn();

      reaction(() => {
        guard(() => {
          callback(reactiveUser.get());
          return reactiveUser.get();
        });
      });

      // Initial flush to account for the setup of reactive computation
      flush();

      reactiveUser.set(user);
      flush();

      // Callback should be called only once due to deep equality
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('peek should not establish reactive dependency', () => {
      const counter = new Signal(10);
      let peekedValue;

      reaction(() => {
        peekedValue = counter.peek();
      });

      counter.set(20); // This should not trigger the reaction again
      flush();

      expect(peekedValue).toBe(10);
    });

    it('nonreactive should prevent reactive updates within its scope', () => {
      const reactiveValue = new Signal('Initial Value');
      const callback = vi.fn();

      reaction(() => {
        nonreactive(() => {
          callback(reactiveValue.get());
        });
      });

      reactiveValue.set('Updated Value');
      flush();

      // Callback should be called only once due to nonreactive block
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('Initial Value');
    });

    it('flush should process updates immediately', () => {
      const number = new Signal(1);
      const callback = vi.fn();

      reaction(() => {
        callback(number.get());
      });

      [2, 3, 4, 5].forEach(value => {
        number.set(value);
        flush(); // Flush after each update
      });

      expect(callback).toHaveBeenCalledTimes(5); // Initial plus 4 updates
    });
  });

  describe('Flushing', () => {
    it('afterFlush should call registered callbacks after flushing', async () => {
      const mockCallback = vi.fn();
      afterFlush(mockCallback);
      scheduleFlush();
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for flush
      expect(mockCallback).toHaveBeenCalled();
    });

    it('afterFlush should call multiple registered callbacks after flushing', async () => {
      const mockCallback = vi.fn();
      const mockCallback2 = vi.fn();
      afterFlush(mockCallback);
      afterFlush(mockCallback2);
      scheduleFlush();
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for flush
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback2).toHaveBeenCalled();
    });
  });

  describe('Helper Functions', () => {
    it('should correctly manipulate array with helpers', () => {
      const items = new Signal([0, 1, 2]);
      const callback = vi.fn();

      reaction(() => {
        callback(items.get().length);
      });

      // Initial flush to account for the setup of reactive computation
      flush();

      items.push(3); // Expect length to be 4
      flush(); // Flush after push
      items.removeIndex(0); // Expect length to be 3
      flush(); // Flush after removeIndex

      // Includes the initial run plus each update
      expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should correctly manipulate array with helpers when cloned', () => {
      const items = new Signal([0, 1, 2], { safety: 'clone' });
      const callback = vi.fn();

      reaction(() => {
        callback(items.get().length);
      });

      // Initial flush to account for the setup of reactive computation
      flush();

      items.push(3); // Expect length to be 4
      flush(); // Flush after push
      items.removeIndex(0); // Expect length to be 3
      flush(); // Flush after removeIndex

      // Includes the initial run plus each update
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  describe('Cycle Detection', () => {
    it('should detect and break infinite reactive cycles', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const a = new Signal(0);
      const b = new Signal(0);

      // A writes B, B writes A — infinite cycle
      reaction(() => {
        b.set(a.get() + 1);
      });
      reaction(() => {
        a.set(b.get() + 1);
      });

      // Should not hang — flush should break the cycle
      flush();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy.mock.calls[0][0]).toMatch(/cycle detected/i);
      errorSpy.mockRestore();
    });

    it('should allow legitimate multi-pass convergence', () => {
      const a = new Signal(1);
      const b = new Signal(0);
      const c = new Signal(0);

      // Chain: a -> b -> c (converges in 2 passes)
      reaction(() => {
        b.set(a.get() * 2);
      });
      reaction(() => {
        c.set(b.get() + 10);
      });

      flush();
      expect(b.peek()).toBe(2);
      expect(c.peek()).toBe(12);

      a.set(5);
      flush();
      expect(b.peek()).toBe(10);
      expect(c.peek()).toBe(20);
    });
  });

  describe('Debugging', () => {
    it('Reaction should track current context for debugging', () => {
      setTracing(true);
      try {
        const callback = vi.fn();
        let signal = new Signal(1);
        reaction((comp) => {
          signal.get();
          if (comp.firstRun) {
            return;
          }
          callback(currentReaction().context.value);
        });
        signal.set(2);
        flush();
        expect(callback).toHaveBeenCalledWith(2);
      }
      finally {
        setTracing(false);
      }
    });

    /* This clutters the logs -- Lets remove even though it passes
    it('Reaction should track current stack trace with getSource', () => {
      const callback = vi.fn();
      let signal = new Signal(1);
      reaction((comp) => {
        signal.get();
        if (comp.firstRun) {
          return;
        }
        let trace;
        try {
          const consoleInfo = console.info;
          console.info = vi.fn();
          trace = getSource();
          console.info = consoleInfo;
        }
        catch (e) {
          // avoid throwing error
        }
        callback(trace);
      });
      signal.set(2);
      flush();
      expect(callback).toHaveBeenCalledWith(expect.any(String));
    });

    */
  });
});
describe('Reaction — public API contract', () => {
  beforeEach(() => {
    Scheduler.current = null;
    Scheduler.pendingReactions.clear();
    Scheduler.afterFlushCallbacks = [];
    Scheduler.isFlushScheduled = false;
  });

  /*******************************
              Creation
  *******************************/

  describe('Creation', () => {
    it('returns the created reaction instance from reaction()', () => {
      const r = reaction(() => {});
      expect(r).toBeInstanceOf(Reaction);
    });

    it('constructs via new Reaction() and satisfies instanceof Reaction', () => {
      // new Reaction() does NOT auto-run — that's reaction()'s responsibility.
      const r = new Reaction(() => {});
      expect(r).toBeInstanceOf(Reaction);
      expect(r.active).toBe(true);
      expect(r.firstRun).toBe(true);
    });

    it('runs the callback immediately by default to register dependencies', () => {
      const callback = vi.fn();
      reaction(callback);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('passes the reaction instance to the callback as its first argument', () => {
      let received;
      const r = reaction((inner) => {
        received = inner;
      });
      expect(received).toBe(r);
    });

    it('skips the initial run when firstRun: false is passed', () => {
      const callback = vi.fn();
      reaction(callback, { firstRun: false });
      expect(callback).not.toHaveBeenCalled();
    });

    it('still re-runs the reaction when a tracked signal changes (firstRun: false then manual run)', () => {
      const value = new Signal('a');
      const callback = vi.fn();
      const r = reaction(() => callback(value.get()), { firstRun: false });

      // Manually run to register dependency
      r.run();
      expect(callback).toHaveBeenCalledTimes(1);

      value.set('b');
      flush();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith('b');
    });
  });

  /*******************************
              firstRun
  *******************************/

  describe('firstRun', () => {
    it('reports firstRun=true on the initial execution', () => {
      let observed;
      reaction((r) => {
        observed = r.firstRun;
      });
      expect(observed).toBe(true);
    });

    it('reports firstRun=false on subsequent executions after a signal change', () => {
      const value = new Signal(0);
      const firstRuns = [];
      reaction((r) => {
        value.get();
        firstRuns.push(r.firstRun);
      });

      value.set(1);
      flush();

      expect(firstRuns).toEqual([true, false]);
    });

    it('does not register dependencies when a signal is read after an early-return on firstRun', () => {
      const value = new Signal('initial');
      const callback = vi.fn();

      reaction((r) => {
        if (r.firstRun) { return; }
        callback(value.get());
      });

      value.set('updated');
      flush();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  /*******************************
          active / stop
  *******************************/

  describe('active flag and stop', () => {
    it('reports active=true on a freshly created reaction', () => {
      const r = reaction(() => {});
      expect(r.active).toBe(true);
    });

    it('reports active=false after stop()', () => {
      const r = reaction(() => {});
      r.stop();
      expect(r.active).toBe(false);
    });

    it('does not re-run a stopped reaction when its tracked signal changes', () => {
      const value = new Signal(0);
      const callback = vi.fn();
      const r = reaction(() => callback(value.get()));

      r.stop();
      value.set(1);
      flush();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('treats stop() as idempotent — calling twice does not throw', () => {
      const r = reaction(() => {});
      r.stop();
      expect(() => r.stop()).not.toThrow();
      expect(r.active).toBe(false);
    });

    it("removes the reaction from a signal's dependents when stop() is called", () => {
      const value = new Signal(0);
      const r = reaction(() => {
        value.get();
      });

      expect(value.hasDependents()).toBe(true);

      r.stop();
      expect(value.hasDependents()).toBe(false);
    });

    it('makes a manually-invoked run() on a stopped reaction a no-op', () => {
      const callback = vi.fn();
      const r = reaction(callback);
      r.stop();

      r.run();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
          dependencies
  *******************************/

  describe('dependencies', () => {
    it('exposes a Set of tracked dependencies', () => {
      const value = new Signal(0);
      let observed;
      reaction((r) => {
        value.get();
        observed = r.dependencies;
      });
      expect(observed).toBeInstanceOf(Set);
      expect(observed.size).toBe(1);
    });

    it('rebuilds its dependency set on each run (drops signals not read in the new run)', () => {
      const a = new Signal(true);
      const b = new Signal('B');
      const c = new Signal('C');
      let lastDeps;

      reaction((r) => {
        // On first run reads a and b; subsequent runs based on a's value
        if (a.get()) {
          b.get();
        }
        else {
          c.get();
        }
        lastDeps = r.dependencies;
      });

      expect(lastDeps.size).toBe(2); // a + b

      a.set(false);
      flush();

      expect(lastDeps.size).toBe(2); // a + c

      // b should no longer notify the reaction
      const callback = vi.fn();
      reaction(() => {
        callback(b.get());
      }); // separate reaction proving b is independent
      callback.mockClear();
      b.set('B2');
      flush();
      expect(callback).toHaveBeenCalledTimes(1); // separate reaction fires once; main is unaffected
    });
  });

  /*******************************
            invalidate
  *******************************/

  describe('invalidate', () => {
    it('schedules a re-run on the next flush without a signal change', () => {
      const callback = vi.fn();
      const r = reaction(callback);

      r.invalidate();
      flush();

      expect(callback).toHaveBeenCalledTimes(2); // initial + invalidated re-run
    });

    it('does nothing when invalidate is called on a stopped reaction', () => {
      const callback = vi.fn();
      const r = reaction(callback);

      r.stop();
      expect(r.active).toBe(false);

      r.invalidate();
      expect(r.active).toBe(false);
      expect(Scheduler.pendingReactions.has(r)).toBe(false);

      flush();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('removes the reaction from pendingReactions when stop is called mid-cycle', () => {
      const s = new Signal(0);
      const callback = vi.fn();
      const r = reaction(() => {
        callback(s.get());
      });

      s.set(1);
      expect(Scheduler.pendingReactions.has(r)).toBe(true);

      r.stop();
      expect(Scheduler.pendingReactions.has(r)).toBe(false);

      flush();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
              run
  *******************************/

  describe('run', () => {
    it('manually re-runs an active reaction without a signal change', () => {
      const callback = vi.fn();
      const r = reaction(callback);

      r.run();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('updates firstRun to false after the initial run() completes', () => {
      const r = reaction(() => {});
      expect(r.firstRun).toBe(false);
    });
  });

  /*******************************
            nonreactive
  *******************************/

  describe('nonreactive', () => {
    it('returns the value produced by the inner callback', () => {
      const result = nonreactive(() => 42);
      expect(result).toBe(42);
    });

    it('does not register dependencies for signals read inside the block', () => {
      const tracked = new Signal('tracked');
      const untracked = new Signal('untracked');
      const callback = vi.fn();

      reaction(() => {
        tracked.get();
        callback(nonreactive(() => untracked.get()));
      });

      untracked.set('changed');
      flush();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('still re-runs the outer reaction when signals read outside the nonreactive block change', () => {
      const tracked = new Signal('a');
      const untracked = new Signal('x');
      const callback = vi.fn();

      reaction(() => {
        callback(tracked.get(), nonreactive(() => untracked.get()));
      });

      tracked.set('b');
      flush();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith('b', 'x');
    });

    it('works when called outside of any reaction', () => {
      const value = new Signal(7);
      const result = nonreactive(() => value.get());
      expect(result).toBe(7);
      expect(value.hasDependents()).toBe(false);
    });

    it('restores the parent reactive context after the block', () => {
      const outer = new Signal('outer');
      const after = new Signal('after');
      const seen = [];

      reaction(() => {
        outer.get();
        nonreactive(() => {/* no-op */});
        seen.push(after.get()); // should still register as dependency
      });

      after.set('after2');
      flush();
      expect(seen).toEqual(['after', 'after2']);
    });

    it('nests correctly — inner nonreactive does not enable tracking when popped', () => {
      const a = new Signal('a');
      const callback = vi.fn();

      reaction(() => {
        nonreactive(() => {
          nonreactive(() => {});
          callback(a.get()); // outermost is nonreactive — a should NOT track
        });
      });

      a.set('a2');
      flush();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
              guard
  *******************************/

  describe('guard', () => {
    it('returns the current value of the inner callback', () => {
      const r = reaction(() => {});
      Scheduler.current = r;
      try {
        expect(guard(() => 'hello')).toBe('hello');
      }
      finally {
        Scheduler.current = null;
      }
    });

    it('returns f() directly when called outside of any reaction', () => {
      const result = guard(() => 7);
      expect(result).toBe(7);
    });

    it('uses deep equality by default — structurally equal returns do not propagate', () => {
      const source = new Signal({ name: 'A', meta: 1 });
      const callback = vi.fn();

      reaction(() => {
        const slice = guard(() => ({ name: source.get().name }));
        callback(slice.name);
      });

      // Mutate something the guard ignores — guard return is structurally equal
      source.set({ name: 'A', meta: 2 });
      flush();
      expect(callback).toHaveBeenCalledTimes(1);

      // Mutate something the guard observes — guard return changes
      source.set({ name: 'B', meta: 2 });
      flush();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith('B');
    });

    it('accepts a custom equality function to widen or narrow change detection', () => {
      const source = new Signal({ id: 1, label: 'first' });
      const callback = vi.fn();
      const compareById = (a, b) => a?.id === b?.id;

      reaction(() => {
        const item = guard(() => source.get(), compareById);
        callback(item.label);
      });

      // Same id, different label — custom check says "equal", no rerun
      source.set({ id: 1, label: 'second' });
      flush();
      expect(callback).toHaveBeenCalledTimes(1);

      // Different id — custom check says "not equal", rerun
      source.set({ id: 2, label: 'third' });
      flush();
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  /*******************************
             flush
  *******************************/

  describe('flush', () => {
    it('synchronously processes pending reactions', () => {
      const value = new Signal(1);
      const callback = vi.fn();

      reaction(() => callback(value.get()));
      value.set(2);

      // Pre-flush: callback ran only once (initial)
      expect(callback).toHaveBeenCalledTimes(1);

      flush();

      // Post-flush: synchronously fired again with the new value
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith(2);
    });

    it('runs afterFlush callbacks during flush even when there are no pending reactions', () => {
      const cb = vi.fn();
      afterFlush(cb);
      flush();
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it('drains all batched updates so reactions see only the final value', () => {
      const value = new Signal(0);
      const seen = [];

      reaction(() => {
        seen.push(value.get());
      });

      value.set(1);
      value.set(2);
      value.set(3);
      flush();

      // Initial run sees 0; the batched updates collapse into a single rerun with 3.
      expect(seen).toEqual([0, 3]);
    });
  });

  /*******************************
          scheduleFlush
  *******************************/

  describe('scheduleFlush', () => {
    it('is idempotent — multiple calls before flush queue only one microtask flush', async () => {
      const value = new Signal('initial');
      const callback = vi.fn();
      reaction(() => callback(value.get()));
      callback.mockClear();

      value.set('updated');
      scheduleFlush();
      scheduleFlush();
      scheduleFlush();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('runs scheduled flush asynchronously via microtask', async () => {
      const value = new Signal(0);
      const callback = vi.fn();
      reaction(() => callback(value.get()));
      callback.mockClear();

      value.set(1);
      scheduleFlush();

      // Before microtask: not yet flushed
      expect(callback).not.toHaveBeenCalled();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(1);
    });
  });

  /*******************************
           afterFlush
  *******************************/

  describe('afterFlush', () => {
    it('runs registered callback after all pending reactions complete in the same flush', () => {
      const value = new Signal(0);
      const order = [];

      reaction(() => {
        value.get();
        order.push('reaction');
      });
      order.length = 0; // clear initial-run record

      value.set(1);
      afterFlush(() => order.push('after'));
      flush();

      expect(order).toEqual(['reaction', 'after']);
    });

    it('runs multiple afterFlush callbacks in registration order', () => {
      const order = [];
      afterFlush(() => order.push(1));
      afterFlush(() => order.push(2));
      afterFlush(() => order.push(3));
      flush();
      expect(order).toEqual([1, 2, 3]);
    });

    it('drains the callback queue — callbacks do not re-run on the next flush', () => {
      const cb = vi.fn();
      afterFlush(cb);
      flush();
      flush();
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it('exposes the final signal value to the afterFlush callback', () => {
      // Mirrors the after-flush example: only the final value is observed
      const number = new Signal(0);
      reaction(() => {
        number.get();
      });

      let final;
      [1, 2, 3, 4, 5].forEach(value => number.set(value));
      afterFlush(() => {
        final = number.get();
      });
      flush();

      expect(final).toBe(5);
    });

    it('drains afterFlush callbacks registered from inside another afterFlush in the same flush', () => {
      const order = [];
      afterFlush(() => {
        order.push('outer');
        afterFlush(() => order.push('inner'));
      });
      flush();
      expect(order).toEqual(['outer', 'inner']);
    });
  });

  /*******************************
        currentReaction()
  *******************************/

  describe('currentReaction()', () => {
    it('is null outside of any reaction', () => {
      expect(currentReaction()).toBeNull();
    });

    it('is the running reaction during its callback execution', () => {
      let seen;
      const r = reaction(() => {
        seen = currentReaction();
      });
      expect(seen).toBe(r);
    });

    it('is null again after the reaction callback returns', () => {
      reaction(() => {});
      expect(currentReaction()).toBeNull();
    });
  });

  /*******************************
        Nested reactions
  *******************************/

  describe('Nested reactions', () => {
    it("isolates dependencies — inner reaction's signal reads do not feed the outer", () => {
      const outer = new Signal('o');
      const inner = new Signal('i');
      const outerCallback = vi.fn();
      const innerCallback = vi.fn();

      reaction(() => {
        outer.get();
        reaction(() => {
          innerCallback(inner.get());
        });
        outerCallback(outer.peek());
      });

      // Each fired once during initial setup.
      expect(outerCallback).toHaveBeenCalledTimes(1);
      expect(innerCallback).toHaveBeenCalledTimes(1);

      // Mutating the inner-only signal should never re-fire the outer.
      inner.set('i2');
      flush();
      expect(outerCallback).toHaveBeenCalledTimes(1);
      expect(innerCallback).toHaveBeenCalledTimes(2);
    });

    // nested reactions leak unless the author stops them explicitly
    // outer.run() clears its own deps but doesn't touch inner reactions
    it('does not automatically clean up inner reactions when the outer re-runs', () => {
      const outer = new Signal(1);
      const inner = new Signal('a');
      const innerCallback = vi.fn();

      reaction(() => {
        outer.get();
        reaction(() => {
          innerCallback(inner.get());
        });
      });

      // Initial outer run creates inner #1 — inner fires once.
      expect(innerCallback).toHaveBeenCalledTimes(1);

      // Outer re-runs, creates inner #2. inner #1 was NOT stopped.
      outer.set(2);
      flush();
      expect(innerCallback).toHaveBeenCalledTimes(2);

      innerCallback.mockClear();

      // Both inner #1 and inner #2 should fire when `inner` changes.
      inner.set('b');
      flush();
      expect(innerCallback).toHaveBeenCalledTimes(2);
    });

    it('does not restore the parent reactive context when an inner reaction runs', () => {
      const outer = new Signal('o');
      const innerOnly = new Signal('i');
      const outerCallback = vi.fn();

      reaction(() => {
        outer.get();
        // Read a signal inside an inner reaction's body — outer should NOT track this signal.
        reaction(() => {
          innerOnly.get();
        });
        outerCallback();
      });

      outerCallback.mockClear();
      innerOnly.set('i2');
      flush();
      expect(outerCallback).not.toHaveBeenCalled();
    });

    // inner reactions (Reaction.create, guard, computed, derive) must not clobber outer tracking
    it('preserves outer-reaction tracking for signals read AFTER an inner Reaction.create call', () => {
      const beforeInner = new Signal('B');
      const afterInner = new Signal('A');
      const innerOnly = new Signal('I');
      const callback = vi.fn();

      reaction(() => {
        const b = beforeInner.get();
        reaction(() => {
          innerOnly.get();
        });
        const a = afterInner.get();
        callback(b, a);
      });

      callback.mockClear();
      afterInner.set('A2');
      flush();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('B', 'A2');
    });
  });

  /*******************************
        Error handling
  *******************************/

  describe('Error handling', () => {
    it('clears Scheduler.current after a reaction callback throws', () => {
      expect(() => {
        reaction(() => {
          throw new Error('boom');
        });
      }).toThrow('boom');
      expect(currentReaction()).toBeNull();
    });

    it('clears Scheduler.current after a nonreactive callback throws', () => {
      expect(() => {
        reaction(() => {
          nonreactive(() => {
            throw new Error('inner');
          });
        });
      }).toThrow('inner');
      expect(currentReaction()).toBeNull();
    });

    // one bad afterFlush callback must not silently swallow the rest
    it('continues running later afterFlush callbacks when an earlier one throws', () => {
      const callback2 = vi.fn();
      afterFlush(() => {
        throw new Error('first afterFlush failure');
      });
      afterFlush(callback2);

      expect(() => flush()).toThrow('first afterFlush failure');
      expect(callback2).toHaveBeenCalled();
    });

    // a faulty reaction must not disable the rest of the reactive system
    it("continues running later reactions when an earlier reaction's callback throws", () => {
      const trigger = new Signal(0);
      const survivor = vi.fn();

      reaction(() => {
        trigger.get();
        if (trigger.peek() > 0) { throw new Error('reaction failure'); }
      });
      reaction(() => {
        survivor(trigger.get());
      });

      survivor.mockClear();
      trigger.set(1);
      expect(() => flush()).toThrow('reaction failure');
      expect(survivor).toHaveBeenCalledWith(1);
    });
  });

  /*******************************
        firstRun pitfall
  *******************************/

  describe('firstRun pitfall (documented in controls guide)', () => {
    it('demonstrates that an early-return on firstRun yields no dependencies', () => {
      const value = new Signal('a');
      const r = reaction((r) => {
        if (r.firstRun) { return; }
        value.get();
      });

      // No dependency registered because value.get() never reached on first run
      expect(r.dependencies.size).toBe(0);
      expect(value.hasDependents()).toBe(false);
    });

    it('avoids the pitfall when the signal read precedes the early-return', () => {
      const value = new Signal('a');
      const seen = [];

      reaction((r) => {
        const v = value.get();
        if (r.firstRun) { return; }
        seen.push(v);
      });

      value.set('b');
      flush();
      expect(seen).toEqual(['b']);
    });
  });
});
