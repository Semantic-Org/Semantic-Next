import {
  afterFlush,
  computed,
  flush,
  nonreactive,
  reaction,
  Scheduler,
  settled,
  signal,
} from '@semantic-ui/reactivity';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// hands the test control over when an async run body proceeds
const gate = () => Promise.withResolvers();

describe('Async Reactions', () => {
  beforeEach(() => {
    Scheduler.current = null;
    Scheduler.pendingReactions.clear();
    Scheduler.pendingAsyncReactions.clear();
    Scheduler.settlingReactions.clear();
    Scheduler.afterFlushCallbacks = [];
    Scheduler.settledDeferred = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /*******************************
            Tracking
  *******************************/

  describe('Tracking', () => {
    it('tracks dependencies read before the first await', async () => {
      const count = signal(0);
      const runs = vi.fn();
      reaction(async () => {
        runs(count.get());
        await Promise.resolve();
      });
      await settled();

      count.set(1);
      await settled();

      expect(runs).toHaveBeenCalledTimes(2);
      expect(runs).toHaveBeenLastCalledWith(1);
    });

    it('reads after an await register nothing without track', async () => {
      const count = signal(0);
      const runs = vi.fn();
      reaction(async () => {
        runs();
        await Promise.resolve();
        count.get();
      });
      await settled();

      count.set(1);
      await settled();

      expect(runs).toHaveBeenCalledTimes(1);
    });

    it('track() registers dependencies read after an await', async () => {
      const count = signal(0);
      const runs = vi.fn();
      reaction(async (comp) => {
        runs();
        await Promise.resolve();
        comp.track(() => count.get());
      });
      await settled();

      count.set(1);
      await settled();

      expect(runs).toHaveBeenCalledTimes(2);
    });

    it('track() returns the callback value', async () => {
      const count = signal(5);
      let tracked;
      reaction(async (comp) => {
        await Promise.resolve();
        tracked = comp.track(() => count.get() * 2);
      });
      await settled();

      expect(tracked).toBe(10);
    });

    it('head and tracked dependencies accumulate in one run', async () => {
      const first = signal(0);
      const second = signal(0);
      const runs = vi.fn();
      reaction(async (comp) => {
        runs();
        first.get();
        await Promise.resolve();
        comp.track(() => second.get());
      });
      await settled();

      first.set(1);
      await settled();
      second.set(1);
      await settled();

      expect(runs).toHaveBeenCalledTimes(3);
    });

    it('nonreactive suppresses tracking inside track()', async () => {
      const count = signal(0);
      const runs = vi.fn();
      reaction(async (comp) => {
        runs();
        await Promise.resolve();
        comp.track(() => nonreactive(() => count.get()));
      });
      await settled();

      count.set(1);
      await settled();

      expect(runs).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
            Lifecycle
  *******************************/

  describe('Lifecycle', () => {
    it('runs never overlap, a mid-flight invalidation re-runs after settle', async () => {
      const dep = signal(0);
      const order = [];
      const gates = [gate(), gate()];
      let runCount = 0;
      reaction(async () => {
        const run = ++runCount;
        dep.get();
        order.push(`start ${run}`);
        await gates[run - 1].promise;
        order.push(`end ${run}`);
      });

      dep.set(1); // invalidate while run 1 is in flight
      gates[0].resolve();
      gates[1].resolve();
      await settled();

      expect(order).toEqual(['start 1', 'end 1', 'start 2', 'end 2']);
    });

    it('invalidations mid-flight coalesce into one trailing re-run', async () => {
      const dep = signal(0);
      const gates = [gate(), gate()];
      let runCount = 0;
      reaction(async () => {
        const run = ++runCount;
        dep.get();
        await gates[run - 1].promise;
      });

      dep.set(1);
      dep.set(2);
      dep.set(3);
      gates[0].resolve();
      gates[1].resolve();
      await settled();

      expect(runCount).toBe(2);
    });

    it('abortSignal aborts when invalidated mid-flight', async () => {
      const dep = signal(0);
      const opened = gate();
      let abortSignal;
      reaction(async (comp) => {
        if (comp.firstRun) {
          dep.get();
          abortSignal = comp.abortSignal;
          await opened.promise;
        }
      });
      expect(abortSignal.aborted).toBe(false);

      dep.set(1);
      expect(abortSignal.aborted).toBe(true);

      opened.resolve();
      await settled();
    });

    it('each run reads a fresh abortSignal', async () => {
      const dep = signal(0);
      const signals = [];
      reaction(async (comp) => {
        dep.get();
        signals.push(comp.abortSignal);
        await Promise.resolve();
      });
      await settled();

      dep.set(1);
      await settled();

      expect(signals[0]).not.toBe(signals[1]);
      expect(signals[1].aborted).toBe(false);
    });

    it('abortSignal aborts on stop', async () => {
      let abortSignal;
      const instance = reaction(async (comp) => {
        abortSignal = comp.abortSignal;
        await Promise.resolve();
      });
      await settled();

      instance.stop();
      expect(abortSignal.aborted).toBe(true);
    });

    it('a sync reaction abortSignal aborts before its re-run', () => {
      // the fetch-cancel pattern: a sync head hands its signal to detached io,
      // the next invalidation cancels that io before the re-run reads a fresh one
      const dep = signal(0);
      const signals = [];
      reaction((comp) => {
        dep.get();
        signals.push(comp.abortSignal);
      });

      dep.set(1);
      flush();

      expect(signals[0].aborted).toBe(true);
      expect(signals[1].aborted).toBe(false);
    });

    it('firstRun stays true through the first run and its continuations', async () => {
      const dep = signal(0);
      const observed = [];
      reaction(async (comp) => {
        dep.get();
        await Promise.resolve();
        observed.push(comp.firstRun);
      });
      await settled();

      dep.set(1);
      await settled();

      expect(observed).toEqual([true, false]);
    });

    it('onCleanup registered after an await fires before the next run', async () => {
      const dep = signal(0);
      const order = [];
      let runCount = 0;
      reaction(async (comp) => {
        const run = ++runCount;
        dep.get();
        order.push(`run ${run}`);
        await Promise.resolve();
        comp.onCleanup(() => order.push(`cleanup ${run}`));
      });
      await settled();

      dep.set(1);
      await settled();

      expect(order).toEqual(['run 1', 'cleanup 1', 'run 2']);
    });

    it('onCleanup after stop fires immediately', async () => {
      const opened = gate();
      const cleanup = vi.fn();
      const instance = reaction(async (comp) => {
        await opened.promise;
        comp.onCleanup(cleanup);
      });

      instance.stop();
      opened.resolve();
      await settled();

      expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it('stop mid-flight prevents the trailing re-run', async () => {
      const dep = signal(0);
      const opened = gate();
      let runCount = 0;
      const instance = reaction(async () => {
        runCount++;
        dep.get();
        await opened.promise;
      });

      dep.set(1); // requests a re-run
      instance.stop();
      opened.resolve();
      await settled();

      expect(runCount).toBe(1);
    });
  });

  /*******************************
           Scheduling
  *******************************/

  describe('Scheduling', () => {
    it('async re-runs start after pending sync reactions in the same flush', async () => {
      const dep = signal(0);
      const order = [];
      reaction(async () => {
        dep.get();
        order.push('async');
        await Promise.resolve();
      });
      await settled();
      reaction(() => {
        dep.get();
        order.push('sync');
      });
      order.length = 0;

      dep.set(1);
      await settled();

      expect(order).toEqual(['sync', 'async']);
    });

    it('sync work scheduled by an async head drains before afterFlush', async () => {
      const dep = signal(0);
      const inner = signal(0);
      const order = [];
      reaction(() => {
        inner.get();
        order.push('sync');
      });
      reaction(async () => {
        dep.get();
        order.push('async');
        inner.increment();
        afterFlush(() => order.push('afterFlush'));
        await Promise.resolve();
      });
      await settled();
      order.length = 0;

      dep.set(1);
      await settled();

      expect(order).toEqual(['async', 'sync', 'afterFlush']);
    });

    it('settled() resolves after in-flight runs and their cascades', async () => {
      const dep = signal(0);
      const result = signal(null);
      let cascaded = false;
      reaction(() => {
        if (result.get() === 'done') {
          cascaded = true;
        }
      });
      reaction(async () => {
        dep.get();
        await Promise.resolve();
        result.set('done');
      });

      await settled();

      expect(cascaded).toBe(true);
    });

    it('settled() resolves immediately when idle', async () => {
      await settled();
      expect(Scheduler.settlingReactions.size).toBe(0);
    });

    it('flush() stays synchronous while runs are in flight', async () => {
      const opened = gate();
      reaction(async () => {
        await opened.promise;
      });

      flush();
      expect(Scheduler.settlingReactions.size).toBe(1);

      opened.resolve();
      await settled();
      expect(Scheduler.settlingReactions.size).toBe(0);
    });

    it('retains no scheduler state once runs complete', async () => {
      const dep = signal(0);
      const instance = reaction(async () => {
        dep.get();
        await Promise.resolve();
      });
      dep.set(1);
      await settled();
      instance.stop();

      expect(Scheduler.settlingReactions.size).toBe(0);
      expect(Scheduler.pendingAsyncReactions.size).toBe(0);
      expect(Scheduler.pendingReactions.size).toBe(0);
    });

    it('settled() waits for a stopped run still in flight', async () => {
      // stop() leaves the run in settlingReactions on purpose, its body is still executing
      const opened = gate();
      const instance = reaction(async () => {
        await opened.promise; // never reads abortSignal, nothing hastens the settle
      });

      instance.stop();
      let resolved = false;
      settled().then(() => {
        resolved = true;
      });
      await Promise.resolve();
      await Promise.resolve();

      expect(Scheduler.settlingReactions.size).toBe(1);
      expect(resolved).toBe(false);

      opened.resolve();
      await settled();

      expect(resolved).toBe(true);
      expect(Scheduler.settlingReactions.size).toBe(0);
    });
  });

  /*******************************
             Errors
  *******************************/

  describe('Errors', () => {
    it('a rejected run reports and the reaction keeps working', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const dep = signal(0);
      const values = [];
      reaction(async () => {
        const value = dep.get();
        await Promise.resolve();
        if (value === 0) {
          throw new Error('boom');
        }
        values.push(value);
      });
      await settled();

      expect(consoleError).toHaveBeenCalledTimes(1);

      dep.set(1);
      await settled();

      expect(values).toEqual([1]);
    });

    it('an abort-caused rejection is not reported', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const dep = signal(0);
      const opened = gate();
      let runCount = 0;
      reaction(async (comp) => {
        runCount++;
        dep.get();
        const { abortSignal } = comp;
        if (comp.firstRun) {
          await opened.promise;
          if (abortSignal.aborted) {
            throw new DOMException('aborted', 'AbortError');
          }
        }
      });

      dep.set(1); // aborts run 1
      opened.resolve();
      await settled();

      expect(consoleError).not.toHaveBeenCalled();
      expect(runCount).toBe(2);
    });

    it('a throw before the first await reports through the async path', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      reaction(async () => {
        throw new Error('early');
      });
      await settled();

      expect(consoleError).toHaveBeenCalledTimes(1);
    });
  });

  /*******************************
         Derived Guardrail
  *******************************/

  describe('Derived Guardrail', () => {
    it('computed warns when the compute returns a promise', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      computed(async () => 1);

      expect(consoleWarn).toHaveBeenCalledTimes(1);
      expect(consoleWarn.mock.calls[0][0]).toContain('computed');
    });
  });
});
