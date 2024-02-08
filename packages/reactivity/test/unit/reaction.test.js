import { beforeEach, describe, it, expect, vi } from 'vitest';
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

describe('Reaction', () => {

  beforeEach(() => {
    // Reset Reaction state before each test if needed
    Reaction.current = null;
    Reaction.pendingReactions.clear();
    Reaction.afterFlushCallbacks = [];
  });

  describe('Basic Usage', () => {
    it('should trigger reaction on reactive value change', () => {
      const reactiveValue = new ReactiveVar('first');
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
      const saying = new ReactiveVar('hello');
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
      let reactiveObj = new ReactiveVar(obj1);
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
      let reactiveObj = new ReactiveVar(obj, customIsEqual);
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

    it('should use guard to control reactivity', () => {
      const userAge = new ReactiveVar(30);
      const userName = new ReactiveVar('John Doe');
      const lastUpdated = new ReactiveVar(new Date());
      const callback = vi.fn();

      Reaction.create(() => {
        Reaction.guard(() => {
          let user = { name: userName.get(), age: userAge.get() };
          callback(`User Info: ${user.name}, ${user.age}`);
          return user;
        });
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

    it('peek should not establish reactive dependency', () => {
      const counter = new ReactiveVar(10);
      let peekedValue;

      Reaction.create(() => {
        peekedValue = counter.peek();
      });

      counter.set(20); // This should not trigger the reaction again
      Reaction.flush();

      expect(peekedValue).toBe(10);
    });

    it('nonreactive should prevent reactive updates within its scope', () => {
      const reactiveValue = new ReactiveVar('Initial Value');
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
      const number = new ReactiveVar(1);
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

  describe('Helper Functions', () => {
    it('should correctly manipulate array with helpers', () => {
      const items = new ReactiveVar([0, 1, 2]);
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

});
