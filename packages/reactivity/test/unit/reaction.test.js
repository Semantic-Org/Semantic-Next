import { beforeEach, describe, it, expect, vi } from 'vitest';
import { Signal, Reaction, Scheduler } from '@semantic-ui/reactivity';

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

      Reaction.create(() => {
        callback(reactiveValue.get());
      });

      reactiveValue.set('second');
      Reaction.flush();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, 'first');
      expect(callback).toHaveBeenNthCalledWith(2, 'second');
    });

    it('should handle firstRun and stop computation', () => {
      const saying = new Signal('hello');
      const callback = vi.fn();

      Reaction.create((comp) => {
        if (comp.firstRun) {
          callback('First run!');
        }
        if (saying.get() === 'goodbye') {
          comp.stop();
          callback('Goodbye detected');
        }
      });

      saying.set('goodbye');
      Reaction.flush();

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

      Reaction.create(() => {
        callback(reactiveObj.get());
      });

      reactiveObj.set(obj2);
      Reaction.flush();

      // Callback should be called only once due to deep equality
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should always re-run when custom isEqual returns false', () => {
      const customIsEqual = () => false;
      let obj = { name: 'Sally', age: 22 };
      let reactiveObj = new Signal(obj, { equalityFunction: customIsEqual });
      const callback = vi.fn();

      Reaction.create(function() {
        reactiveObj.get();
        callback();
      });

      // Initial flush to account for the setup of reactive computation
      Reaction.flush();

      reactiveObj.set(reactiveObj.get());
      Reaction.flush();

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

      Reaction.create(() => {
        const user = Reaction.guard(() => ({
          name: userName.get(),
          age: userAge.get()
        }));
        callback(`User Info: ${user.name}, ${user.age}`);
      });

      // Initial flush to account for the setup of reactive computation
      Reaction.flush();

      userName.set('Jane Doe');
      Reaction.flush();

      userAge.set(31);
      Reaction.flush();

      lastUpdated.set(new Date()); // This update should not trigger the reaction guard
      Reaction.flush();

      // Should include initial run plus updates that trigger guard
      expect(callback).toHaveBeenCalledTimes(3);
    });

    it('guard should control reactivity - example 2', () => {

      const counter = new Signal(0);
      const callback = vi.fn();

      const isEven = () => Reaction.guard(() => {
        return (counter.get() % 2 === 0);
      });

      Reaction.create((comp) => {
        if(isEven()) {
          callback(`${counter.peek()} is even`);
        }
      });

      counter.set(1); // No output guard is same
      Reaction.flush();
      counter.set(2); // Output
      Reaction.flush();
      counter.set(3); // No output guard is same

      // only odd numbers should trigger
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('guard should not re-run for identical objects', () => {
      const user = { name: 'John Doe', age: 30 };
      const reactiveUser = new Signal(user);
      const callback = vi.fn();

      Reaction.create(() => {
        Reaction.guard(() => {
          callback(reactiveUser.get());
          return reactiveUser.get();
        });
      });

      // Initial flush to account for the setup of reactive computation
      Reaction.flush();

      reactiveUser.set(user);
      Reaction.flush();

      // Callback should be called only once due to deep equality
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('peek should not establish reactive dependency', () => {
      const counter = new Signal(10);
      let peekedValue;

      Reaction.create(() => {
        peekedValue = counter.peek();
      });

      counter.set(20); // This should not trigger the reaction again
      Reaction.flush();

      expect(peekedValue).toBe(10);
    });

    it('nonreactive should prevent reactive updates within its scope', () => {
      const reactiveValue = new Signal('Initial Value');
      const callback = vi.fn();

      Reaction.create(() => {
        Reaction.nonreactive(() => {
          callback(reactiveValue.get());
        });
      });

      reactiveValue.set('Updated Value');
      Reaction.flush();

      // Callback should be called only once due to nonreactive block
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('Initial Value');
    });

    it('flush should process updates immediately', () => {
      const number = new Signal(1);
      const callback = vi.fn();

      Reaction.create(() => {
        callback(number.get());
      });

      [2, 3, 4, 5].forEach(value => {
        number.set(value);
        Reaction.flush(); // Flush after each update
      });

      expect(callback).toHaveBeenCalledTimes(5); // Initial plus 4 updates
    });
  });

  describe('Flushing', () => {

    it('afterFlush should call registered callbacks after flushing', async () => {
      const mockCallback = vi.fn();
      Reaction.afterFlush(mockCallback);
      Reaction.scheduleFlush();
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for flush
      expect(mockCallback).toHaveBeenCalled();
    });

    it('afterFlush should call multiple registered callbacks after flushing', async () => {
      const mockCallback = vi.fn();
      const mockCallback2 = vi.fn();
      Reaction.afterFlush(mockCallback);
      Reaction.afterFlush(mockCallback2);
      Reaction.scheduleFlush();
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for flush
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback2).toHaveBeenCalled();
    });

  });

  describe('Helper Functions', () => {
    it('should correctly manipulate array with helpers', () => {
      const items = new Signal([0, 1, 2]);
      const callback = vi.fn();

      Reaction.create(() => {
        callback(items.get().length);
      });

      // Initial flush to account for the setup of reactive computation
      Reaction.flush();

      items.push(3); // Expect length to be 4
      Reaction.flush(); // Flush after push
      items.removeIndex(0); // Expect length to be 3
      Reaction.flush(); // Flush after removeIndex

      // Includes the initial run plus each update
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  describe('Debugging', () => {

    it('Reaction should track current context for debugging', () => {
      const callback = vi.fn();
      let signal = new Signal(1);
      Reaction.create((comp) => {
        signal.get();
        if(comp.firstRun) {
          return;
        }
        callback(Reaction.current.context.value);
      });
      signal.set(2);
      Reaction.flush();
      expect(callback).toHaveBeenCalledWith(2);
    });

    it('Reaction should have no source on first run', () => {
      const callback = vi.fn();
      let signal = new Signal(1);
      Reaction.create((comp) => {
        signal.get();
        if(comp.firstRun) {
          let trace;
          try {
            const consoleLog = console.log;
            console.log = vi.fn();
            trace = Reaction.getSource();
            console.log = consoleLog;
          }
          catch(e) {
            // avoid throwing error
          }
          callback(trace);
        }
      });
      signal.set(2);
      Reaction.flush();
      expect(callback).toHaveBeenCalledWith(undefined);
    });


    it('Reaction should track current stack trace with getSource', () => {
      const callback = vi.fn();
      let signal = new Signal(1);
      Reaction.create((comp) => {
        signal.get();
        if(comp.firstRun) {
          return;
        }
        let trace;
        try {
          const consoleInfo = console.info;
          console.info = vi.fn();
          trace = Reaction.getSource();
          console.info = consoleInfo;
        }
        catch(e) {
          // avoid throwing error
        }
        callback(trace);
      });
      signal.set(2);
      Reaction.flush();
      expect(callback).toHaveBeenCalledWith(expect.any(String));
    });

  });

});
