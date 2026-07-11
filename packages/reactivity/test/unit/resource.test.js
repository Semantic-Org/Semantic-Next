import { flush, reaction, Resource, resource, Scheduler, settled, Signal, signal } from '@semantic-ui/reactivity';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// hands the test control over when a fetch settles
const gate = () => Promise.withResolvers();

describe('Resource', () => {
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
             Value
  *******************************/

  describe('Value', () => {
    it('get() returns initialValue before the first settle', async () => {
      const opened = gate();
      const results = resource(async () => opened.promise, { initialValue: [] });

      expect(results.get()).toEqual([]);
      expect(results.loading).toBe(true);
      expect(results.settled).toBe(false);

      opened.resolve(['a']);
      await settled();

      expect(results.get()).toEqual(['a']);
    });

    it('a sync return settles immediately', () => {
      const dep = signal(1);
      const results = resource(() => dep.get() * 2);

      expect(results.get()).toBe(2);
      expect(results.settled).toBe(true);
      expect(results.loading).toBe(false);

      dep.set(5);
      flush();

      expect(results.get()).toBe(10);
    });

    it('get() is tracked, readers re-run when a fetch lands', async () => {
      const results = resource(async () => 'data');
      const observed = [];
      reaction(() => observed.push(results.get()));

      expect(observed).toEqual([undefined]);

      await settled();

      expect(observed).toEqual([undefined, 'data']);
    });

    it('head reads re-fire the fetch', async () => {
      const term = signal('a');
      let fetches = 0;
      const results = resource(async () => {
        fetches++;
        return term.get().toUpperCase();
      });
      await settled();

      expect(results.get()).toBe('A');

      term.set('b');
      await settled();

      expect(fetches).toBe(2);
      expect(results.get()).toBe('B');
    });

    it('holds the last-good value while a refetch is in flight', async () => {
      const dep = signal(0);
      const gates = [gate(), gate()];
      let runCount = 0;
      const results = resource(async () => {
        dep.get();
        return gates[runCount++].promise;
      });
      gates[0].resolve('first');
      await settled();

      dep.set(1);
      flush(); // starts run 2, its gate still closed

      expect(results.get()).toBe('first');
      expect(results.loading).toBe(true);

      gates[1].resolve('second');
      await settled();

      expect(results.get()).toBe('second');
      expect(results.loading).toBe(false);
    });

    it('an equal refetch payload fires no value readers', async () => {
      let fetches = 0;
      const results = resource(async () => {
        fetches++;
        return { items: [1, 2, 3] };
      });
      const observed = [];
      reaction(() => observed.push(results.get()));
      await settled();

      expect(observed).toEqual([undefined, { items: [1, 2, 3] }]);

      results.refresh();
      await settled();

      expect(fetches).toBe(2);
      expect(observed.length).toBe(2);
    });

    it('getItem works on an array resource with an id option', async () => {
      const results = resource(async () => [
        { key: 'a', n: 1 },
        { key: 'b', n: 2 },
      ], { initialValue: [], id: (item) => item.key });
      await settled();

      expect(results.getItem('b')).toEqual({ key: 'b', n: 2 });
      expect(results.getItem('a').n).toBe(1);
    });
  });

  /*******************************
             Faces
  *******************************/

  describe('Faces', () => {
    it('a loading reader re-runs only at flip points', async () => {
      const gates = [gate(), gate()];
      let runCount = 0;
      const results = resource(async () => gates[runCount++].promise);
      const observed = [];
      reaction(() => observed.push(results.loading));

      expect(observed).toEqual([true]);

      gates[0].resolve('a');
      await settled();

      expect(observed).toEqual([true, false]);

      results.refresh();
      flush();

      expect(observed).toEqual([true, false, true]);

      gates[1].resolve('b');
      await settled();

      expect(observed).toEqual([true, false, true, false]);
    });

    it('a rejection keeps the last-good value and sets error', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const boom = new Error('boom');
      let shouldFail = false;
      const results = resource(async () => {
        if (shouldFail) {
          throw boom;
        }
        return 'good';
      });
      await settled();

      expect(results.get()).toBe('good');
      expect(results.error).toBe(undefined);

      shouldFail = true;
      results.refresh();
      await settled();

      expect(results.get()).toBe('good');
      expect(results.error).toBe(boom);
      expect(results.loading).toBe(false);
      expect(consoleError).not.toHaveBeenCalled();
    });

    it('error clears on the next fulfilled settle', async () => {
      let shouldFail = true;
      const results = resource(async () => {
        if (shouldFail) {
          throw new Error('boom');
        }
        return 'good';
      });
      await settled();

      expect(results.error).toBeInstanceOf(Error);

      shouldFail = false;
      results.refresh();
      await settled();

      expect(results.error).toBe(undefined);
      expect(results.get()).toBe('good');
    });

    it('error readers re-run only at transitions', async () => {
      let shouldFail = false;
      const results = resource(async () => {
        if (shouldFail) {
          throw new Error('boom');
        }
        return 'good';
      });
      await settled();
      const observed = [];
      reaction(() => observed.push(results.error));

      results.refresh();
      await settled();

      // fulfilled settle, error stays undefined, no re-run
      expect(observed).toEqual([undefined]);

      shouldFail = true;
      results.refresh();
      await settled();

      expect(observed.length).toBe(2);
      expect(observed[1]).toBeInstanceOf(Error);
    });

    it('settled latches true after the first fulfilled settle', async () => {
      const opened = gate();
      const results = resource(async () => opened.promise);
      const observed = [];
      reaction(() => observed.push(results.settled));

      expect(results.settled).toBe(false);

      opened.resolve('a');
      await settled();

      expect(observed).toEqual([false, true]);

      results.refresh();
      await settled();

      // latched, later fetches never re-fire the reader
      expect(observed).toEqual([false, true]);
      expect(results.settled).toBe(true);
    });

    it('settled latches true after a rejected first settle', async () => {
      const results = resource(async () => {
        throw new Error('boom');
      }, { initialValue: [] });
      await settled();

      expect(results.settled).toBe(true);
      expect(results.error).toBeInstanceOf(Error);
      expect(results.get()).toEqual([]);
    });
  });

  /*******************************
            Lifecycle
  *******************************/

  describe('Lifecycle', () => {
    it('refresh() re-fires the fetcher', async () => {
      let fetches = 0;
      const results = resource(async () => ++fetches);
      await settled();

      expect(results.get()).toBe(1);

      results.refresh();
      await settled();

      expect(fetches).toBe(2);
      expect(results.get()).toBe(2);
    });

    it('a superseded run is aborted and its result dropped', async () => {
      const term = signal('a');
      const gates = [gate(), gate()];
      const abortSignals = [];
      let runCount = 0;
      const results = resource(async (comp) => {
        term.get();
        const run = runCount++;
        abortSignals.push(comp.abortSignal);
        return gates[run].promise;
      });
      const observed = [];
      reaction(() => observed.push(results.get()));

      term.set('ab'); // supersedes run 1 mid-flight

      expect(abortSignals[0].aborted).toBe(true);

      gates[0].resolve('stale');
      gates[1].resolve('fresh');
      await settled();

      expect(abortSignals[1].aborted).toBe(false);
      expect(runCount).toBe(2);
      expect(results.get()).toBe('fresh');
      expect(observed).toEqual([undefined, 'fresh']);
    });

    it('a sync return after a superseded fetch clears loading', async () => {
      // the typeahead shape: dropping below the fetch threshold mid-flight must not strand loading
      const term = signal('ab');
      const opened = gate();
      const results = resource(() => {
        const value = term.get();
        if (value.length < 2) {
          return [];
        }
        return opened.promise.then(() => [value]);
      });
      expect(results.loading).toBe(true);

      term.set('a'); // supersedes the in-flight fetch with a sync fast path
      opened.resolve();
      await settled();

      expect(results.loading).toBe(false);
      expect(results.get()).toEqual([]);
    });

    it('track() registers dependent reads after an await', async () => {
      const client = signal({ name: 'Acme' });
      let fetches = 0;
      const results = resource(async (comp) => {
        fetches++;
        await Promise.resolve();
        return comp.track(() => client.get().name);
      });
      await settled();

      expect(results.get()).toBe('Acme');

      client.set({ name: 'Globex' });
      await settled();

      expect(fetches).toBe(2);
      expect(results.get()).toBe('Globex');
    });

    it('settled() waits for an in-flight fetch', async () => {
      const opened = gate();
      const results = resource(async () => opened.promise);
      let resolved = false;
      settled().then(() => {
        resolved = true;
      });
      await Promise.resolve();
      await Promise.resolve();

      expect(Scheduler.settlingReactions.size).toBe(1);
      expect(resolved).toBe(false);

      opened.resolve('x');
      await settled();

      expect(resolved).toBe(true);
      expect(results.get()).toBe('x');
    });
  });

  /*******************************
            Teardown
  *******************************/

  describe('Teardown', () => {
    it('stop() ends re-fires, the value stays readable', async () => {
      const dep = signal(0);
      let fetches = 0;
      const results = resource(async () => {
        dep.get();
        return ++fetches;
      });
      await settled();

      results.stop();
      dep.set(1);
      await settled();

      expect(fetches).toBe(1);

      results.refresh();
      await settled();

      expect(fetches).toBe(1);
      expect(results.get()).toBe(1);
    });

    it('stop() mid-flight clears loading', async () => {
      const opened = gate();
      const results = resource(async () => {
        await opened.promise;
        return 'late';
      });
      expect(results.loading).toBe(true);

      results.stop();
      expect(results.loading).toBe(false); // a stopped resource can never be fetching

      opened.resolve();
      await settled();

      expect(results.loading).toBe(false);
      expect(results.get()).toBe(undefined); // the dropped settle never lands
    });

    it('a resource created inside a reaction stops with its parent', () => {
      const rerun = signal(0);
      const dep = signal(0);
      let fetches = 0;
      const handles = [];
      const parent = reaction(() => {
        rerun.get();
        handles.push(resource(() => {
          dep.get();
          return ++fetches;
        }));
      });

      expect(fetches).toBe(1);

      rerun.set(1); // parent re-runs, the first resource stops
      flush();

      expect(fetches).toBe(2);

      dep.set(1); // only the live resource refetches
      flush();

      expect(fetches).toBe(3);

      parent.stop();
      dep.set(2);
      flush();

      expect(fetches).toBe(3);
    });
  });

  /*******************************
            Identity
  *******************************/

  describe('Identity', () => {
    it('a resource is a Signal and a Resource, a signal is not a Resource', () => {
      const results = resource(() => 1);

      expect(results instanceof Resource).toBe(true);
      expect(results instanceof Signal).toBe(true);
      expect(signal(1) instanceof Resource).toBe(false);
    });
  });
});
