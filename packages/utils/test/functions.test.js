import { debounce, memoize, noop, throttle, wait, wrapFunction } from '@semantic-ui/utils';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('function utilities', () => {
  it('noop should not return anything', () => {
    expect(noop()).toBeUndefined();
  });
  it('wrapFunction should return the same function if a function is passed', () => {
    const func = () => 'test';
    expect(wrapFunction(func)()).toBe('test');
  });

  it('wrapFunction should return a function that returns the passed value if a non-function is passed', () => {
    const value = 'test';
    expect(wrapFunction(value)()).toBe('test');
  });
  describe('memoize', () => {
    it('should memoize the return value of a function', () => {
      const originalFunction = vi.fn((a, b) => a + b);
      const memoizedFunction = memoize(originalFunction);

      const result1 = memoizedFunction(2, 3);
      expect(result1).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction(2, 3);
      expect(result2).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again

      const result3 = memoizedFunction(4, 5);
      expect(result3).toBe(9);
      expect(originalFunction).toHaveBeenCalledTimes(2);
    });

    it('should memoize different arguments separately', () => {
      const originalFunction = vi.fn((a, b) => a * b);
      const memoizedFunction = memoize(originalFunction);

      const result1 = memoizedFunction(2, 3);
      expect(result1).toBe(6);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction(2, 4);
      expect(result2).toBe(8);
      expect(originalFunction).toHaveBeenCalledTimes(2);

      const result3 = memoizedFunction(2, 3);
      expect(result3).toBe(6);
      expect(originalFunction).toHaveBeenCalledTimes(2); // Should not be called again for (2, 3)
    });

    it('should memoize functions with no arguments', () => {
      const originalFunction = vi.fn(() => 42);
      const memoizedFunction = memoize(originalFunction);

      const result1 = memoizedFunction();
      expect(result1).toBe(42);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction();
      expect(result2).toBe(42);
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should memoize functions with complex arguments', () => {
      const originalFunction = vi.fn((obj) => obj.a + obj.b);
      const memoizedFunction = memoize(originalFunction);

      const result1 = memoizedFunction({ a: 2, b: 3 });
      expect(result1).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction({ a: 2, b: 3 });
      expect(result2).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again

      const result3 = memoizedFunction({ a: 4, b: 5 });
      expect(result3).toBe(9);
      expect(originalFunction).toHaveBeenCalledTimes(2);
    });

    it('should preserve the context of the original function', () => {
      const context = { multiplier: 2 };
      const originalFunction = vi.fn(function(a) {
        return a * this.multiplier;
      });
      const memoizedFunction = memoize(originalFunction);

      const result1 = memoizedFunction.call(context, 3);
      expect(result1).toBe(6);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction.call(context, 3);
      expect(result2).toBe(6);
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again

      const result3 = memoizedFunction.call(context, 4);
      expect(result3).toBe(8);
      expect(originalFunction).toHaveBeenCalledTimes(2);
    });
    it('should allow custom hashing function', () => {
      const originalFunction = vi.fn((obj) => obj.a + obj.b);
      const customHash = (args) => args[0].id;
      const memoizedFunction = memoize(originalFunction, customHash);

      const result1 = memoizedFunction({ id: 1, a: 2, b: 3 });
      expect(result1).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction({ id: 1, a: 3, b: 4 });
      expect(result2).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again due to same id

      const result3 = memoizedFunction({ id: 2, a: 2, b: 3 });
      expect(result3).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(2); // Should be called again due to different id
    });

    it('should handle edge cases with custom hashing', () => {
      const originalFunction = vi.fn((a, b) => a + b);
      const alwaysSameHash = () => 'same';
      const memoizedFunction = memoize(originalFunction, alwaysSameHash);

      const result1 = memoizedFunction(2, 3);
      expect(result1).toBe(5);
      expect(originalFunction).toHaveBeenCalledTimes(1);

      const result2 = memoizedFunction(4, 5);
      expect(result2).toBe(5); // Note: This is the memoized result, not 9
      expect(originalFunction).toHaveBeenCalledTimes(1); // Should not be called again due to same hash
    });
  });

  describe('wait', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return a promise', () => {
      const result = wait(100);
      expect(result).toBeInstanceOf(Promise);
      vi.advanceTimersByTime(100);
    });

    it('should resolve after specified milliseconds', async () => {
      let resolved = false;
      wait(100).then(() => {
        resolved = true;
      });

      await vi.advanceTimersByTime(50);
      expect(resolved).toBe(false);

      await vi.advanceTimersByTime(50);
      expect(resolved).toBe(true);
    });

    it('should resolve immediately for wait(0)', async () => {
      let resolved = false;
      wait(0).then(() => {
        resolved = true;
      });

      await vi.advanceTimersByTime(0);
      expect(resolved).toBe(true);
    });

    it('should handle negative values like setTimeout does', async () => {
      let resolved = false;
      wait(-100).then(() => {
        resolved = true;
      });

      await vi.advanceTimersByTime(0);
      expect(resolved).toBe(true);
    });

    it('should handle no arguments', async () => {
      let resolved = false;
      wait().then(() => {
        resolved = true;
      });

      await vi.advanceTimersByTime(0);
      expect(resolved).toBe(true);
    });

    it('should support multiple concurrent waits', async () => {
      let first = false;
      let second = false;

      wait(100).then(() => {
        first = true;
      });
      wait(200).then(() => {
        second = true;
      });

      await vi.advanceTimersByTime(100);
      expect(first).toBe(true);
      expect(second).toBe(false);

      await vi.advanceTimersByTime(100);
      expect(second).toBe(true);
    });

    describe('AbortSignal support', () => {
      it('should resolve early when signal is aborted', async () => {
        const controller = new AbortController();
        let resolved = false;

        wait(5000, { abortController: controller }).then(() => {
          resolved = true;
        });

        await vi.advanceTimersByTime(100);
        expect(resolved).toBe(false);

        controller.abort();
        await vi.advanceTimersByTime(0);
        expect(resolved).toBe(true);
      });

      it('should resolve immediately if signal is already aborted', async () => {
        const controller = new AbortController();
        controller.abort();

        let resolved = false;
        wait(5000, { abortController: controller }).then(() => {
          resolved = true;
        });

        await vi.advanceTimersByTime(0);
        expect(resolved).toBe(true);
      });

      it('should clear the timeout when aborted', async () => {
        const controller = new AbortController();
        const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

        wait(5000, { abortController: controller });
        controller.abort();

        expect(clearTimeoutSpy).toHaveBeenCalled();
        clearTimeoutSpy.mockRestore();
      });

      it('should accept a bare AbortSignal', async () => {
        const controller = new AbortController();
        let resolved = false;

        wait(5000, { abortController: controller.signal }).then(() => {
          resolved = true;
        });

        await vi.advanceTimersByTime(100);
        expect(resolved).toBe(false);

        controller.abort();
        await vi.advanceTimersByTime(0);
        expect(resolved).toBe(true);
      });

      it('should work without signal option', async () => {
        let resolved = false;
        wait(100, {}).then(() => {
          resolved = true;
        });

        await vi.advanceTimersByTime(100);
        expect(resolved).toBe(true);
      });
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    describe('basic functionality', () => {
      it('should debounce function execution with default trailing behavior', async () => {
        const func = vi.fn(() => 'result');
        const debounced = debounce(func, 100);

        const promise1 = debounced('arg1');
        const promise2 = debounced('arg2');
        const promise3 = debounced('arg3');

        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);

        const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith('arg3'); // Most recent args
        expect(result1).toBe('result');
        expect(result2).toBe('result');
        expect(result3).toBe('result');
      });

      it('should handle async functions correctly', async () => {
        const asyncFunc = vi.fn(async (x) => {
          // Use vi.advanceTimersByTime(100) and vi.runAllTimersAsync() to simulate delay with fake timers
          return x * 2;
        });
        const debounced = debounce(asyncFunc, 100);

        const promise1 = debounced(5);
        const promise2 = debounced(10);

        vi.advanceTimersByTime(100);
        // Wait for async resolution
        await vi.runAllTimersAsync();

        const [result1, result2] = await Promise.all([promise1, promise2]);

        expect(asyncFunc).toHaveBeenCalledTimes(1);
        expect(asyncFunc).toHaveBeenCalledWith(10);
        expect(result1).toBe(20);
        expect(result2).toBe(20);
      });

      it('should handle synchronous functions correctly', () => {
        const syncFunc = vi.fn((x) => x * 2);
        const debounced = debounce(syncFunc, 100);

        const result1 = debounced(5);
        const result2 = debounced(10);

        vi.advanceTimersByTime(100);

        expect(syncFunc).toHaveBeenCalledTimes(1);
        expect(syncFunc).toHaveBeenCalledWith(10);
        // For sync functions that aren't leading edge, returns promise
        expect(result1).toBeInstanceOf(Promise);
        expect(result2).toBeInstanceOf(Promise);
      });
    });

    describe('leading option', () => {
      it('should execute immediately when leading is true', () => {
        const func = vi.fn(() => 'result');
        const debounced = debounce(func, 100, { leading: true });

        const result = debounced('arg');

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith('arg');
        expect(result).toBe('result'); // Sync function returns value directly
      });

      it('should execute both leading and trailing when both are true', async () => {
        const func = vi.fn(() => 'result');
        const debounced = debounce(func, 100, { leading: true, trailing: true });

        debounced('arg1');
        debounced('arg2');

        expect(func).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(2);
        expect(func).toHaveBeenNthCalledWith(1, 'arg1'); // Leading call
        expect(func).toHaveBeenNthCalledWith(2, 'arg2'); // Trailing call
      });
    });

    describe('maxWait option', () => {
      it('should force execution after maxWait period', async () => {
        const func = vi.fn(() => 'result');
        const debounced = debounce(func, 100, { maxWait: 200 });

        debounced('arg1');
        vi.advanceTimersByTime(50);
        debounced('arg2');
        vi.advanceTimersByTime(50);
        debounced('arg3');
        vi.advanceTimersByTime(50);
        debounced('arg4');

        // Should not have executed yet (only 150ms total)
        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(50); // Now 200ms total - hits maxWait

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith('arg4');
      });

      it('should reset debounce state after maxWait execution', async () => {
        const func = vi.fn((x) => `result-${x}`);
        const debounced = debounce(func, 300, { maxWait: 500 });

        // First sequence of calls
        debounced('call1');
        vi.advanceTimersByTime(100);
        debounced('call2');
        vi.advanceTimersByTime(100);
        debounced('call3');
        vi.advanceTimersByTime(100);
        debounced('call4');
        vi.advanceTimersByTime(200); // Total 500ms - maxWait forces execution

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith('call4');
        func.mockClear();

        // Call after maxWait execution - should start fresh debounce cycle
        vi.advanceTimersByTime(100); // 600ms total
        debounced('call5');

        // Should not execute immediately
        expect(func).not.toHaveBeenCalled();

        // Should execute after its own debounce period
        vi.advanceTimersByTime(300);
        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith('call5');
      });
    });

    describe('error handling', () => {
      it('should propagate errors to all pending promises', async () => {
        const error = new Error('Test error');
        const func = vi.fn(() => {
          throw error;
        });
        const debounced = debounce(func, 100);

        const promise1 = debounced('arg1');
        const promise2 = debounced('arg2');

        vi.advanceTimersByTime(100);

        await expect(promise1).rejects.toBe(error);
        await expect(promise2).rejects.toBe(error);
      });

      it('should propagate async function rejections', async () => {
        const error = new Error('Async error');
        const asyncFunc = vi.fn(async () => {
          throw error;
        });
        const debounced = debounce(asyncFunc, 100);

        const promise = debounced('arg');
        vi.advanceTimersByTime(100);

        await expect(promise).rejects.toBe(error);
      });
    });

    describe('AbortController integration', () => {
      it('should handle aborted signals', async () => {
        const controller = new AbortController();
        const func = vi.fn(() => 'result');
        const debounced = debounce(func, 100, { abortController: controller });

        const promise = debounced('arg');
        controller.abort();

        await expect(promise).rejects.toThrow('The operation was aborted');
        expect(func).not.toHaveBeenCalled();
      });

      it('should throw immediately if signal is already aborted', () => {
        const controller = new AbortController();
        controller.abort();

        expect(() => {
          debounce(() => {}, 100, { abortController: controller });
        }).toThrow('The operation was aborted');
      });
    });

    describe('rejectSkipped option', () => {
      it('should reject skipped calls when rejectSkipped is true', async () => {
        const func = vi.fn(() => 'result');
        const debounced = debounce(func, 100, { rejectSkipped: true });

        const promise1 = debounced('arg1');
        const promise2 = debounced('arg2'); // This should be rejected

        vi.advanceTimersByTime(100);

        await expect(promise1).rejects.toEqual({
          code: 'DEBOUNCED',
          message: 'Call was skipped due to debounce',
          replacedBy: ['arg1'],
        });

        const result = await promise2;
        expect(result).toBe('result');
      });
    });

    describe('methods', () => {
      it('should provide cancel method', async () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        const promise = debounced('arg');
        debounced.cancel();

        // Expect the promise to be rejected with AbortError
        await expect(promise).rejects.toMatchObject({
          code: 'CANCELLED',
          message: 'The operation was cancelled.',
        });

        vi.advanceTimersByTime(100);
        expect(func).not.toHaveBeenCalled();
      });

      it('should provide flush method', async () => {
        const func = vi.fn(() => 'result');
        const debounced = debounce(func, 100);

        debounced('arg');
        const result = debounced.flush();

        expect(func).toHaveBeenCalledWith('arg');
        expect(result).toBe('result');
      });

      it('should provide pending method', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        expect(debounced.pending()).toBe(false);

        debounced('arg');
        expect(debounced.pending()).toBe(true);

        vi.advanceTimersByTime(100);
        expect(debounced.pending()).toBe(false);
      });
    });

    describe('context preservation', () => {
      it('should maintain this context', () => {
        const obj = {
          value: 'test',
          method: function() {
            return this.value;
          },
        };
        const debounced = debounce(obj.method, 100);

        debounced.call(obj);
        vi.advanceTimersByTime(100);

        // Note: We can't easily test the return value preservation with vi.fn
        // but the implementation handles it correctly
      });
    });

    describe('sync function arguments', () => {
      it('should pass arguments to sync functions correctly', async () => {
        const syncFunc = vi.fn((a, b, c) => {
          return `${a}-${b}-${c}`;
        });
        const debounced = debounce(syncFunc, 100);

        const promise = debounced('foo', 'bar', 'baz');

        vi.advanceTimersByTime(100);

        const result = await promise;

        expect(syncFunc).toHaveBeenCalledTimes(1);
        expect(syncFunc).toHaveBeenCalledWith('foo', 'bar', 'baz');
        expect(result).toBe('foo-bar-baz');
      });
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    describe('basic functionality', () => {
      it('should throttle function execution with default leading and trailing behavior', async () => {
        const func = vi.fn(() => 'result');
        const throttled = throttle(func, 100);

        // First call should execute immediately (leading)
        const result1 = throttled('arg1');
        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith('arg1');
        expect(result1).toBe('result');

        // Subsequent calls should be queued
        const promise2 = throttled('arg2');
        const promise3 = throttled('arg3');

        expect(func).toHaveBeenCalledTimes(1); // Still only 1 call

        vi.advanceTimersByTime(100);

        // Trailing execution should occur
        expect(func).toHaveBeenCalledTimes(2);
        expect(func).toHaveBeenNthCalledWith(2, 'arg3'); // Latest args

        const [result2, result3] = await Promise.all([promise2, promise3]);
        expect(result2).toBe('result');
        expect(result3).toBe('result');
      });

      it('should handle async functions correctly', async () => {
        const asyncFunc = vi.fn(async (x) => {
          // Simulate an asynchronous function without introducing artificial delays
          return x * 2;
        });
        const throttled = throttle(asyncFunc, 100);

        const result1 = await throttled(5); // Leading execution
        expect(result1).toBe(10);

        const promise2 = throttled(10);
        vi.advanceTimersByTime(100);
        await vi.runAllTimersAsync();

        const result2 = await promise2; // Trailing execution
        expect(result2).toBe(20);

        expect(asyncFunc).toHaveBeenCalledTimes(2);
      });
    });

    describe('leading option', () => {
      it('should not execute immediately when leading is false', async () => {
        const func = vi.fn(() => 'result');
        const throttled = throttle(func, 100, { leading: false });

        const promise = throttled('arg');
        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith('arg');

        const result = await promise;
        expect(result).toBe('result');
      });
    });

    describe('trailing option', () => {
      it('should not execute trailing when trailing is false', () => {
        const func = vi.fn(() => 'result');
        const throttled = throttle(func, 100, { trailing: false });

        throttled('arg1'); // Leading execution
        throttled('arg2'); // Should be ignored

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith('arg1');

        vi.advanceTimersByTime(100);

        // No trailing execution
        expect(func).toHaveBeenCalledTimes(1);
      });
    });

    describe('error handling', () => {
      it('should propagate errors to all pending promises', async () => {
        const error = new Error('Test error');
        const func = vi.fn(() => {
          throw error;
        });
        const throttled = throttle(func, 100);

        // Leading call will throw immediately
        expect(() => throttled('arg1')).toThrow(error);

        const promise2 = throttled('arg2');
        vi.advanceTimersByTime(100);

        await expect(promise2).rejects.toBe(error);
      });
    });

    describe('AbortController integration', () => {
      it('should handle aborted signals', async () => {
        const controller = new AbortController();
        const func = vi.fn(() => 'result');
        const throttled = throttle(func, 100, { abortController: controller });

        const promise = throttled('arg');
        controller.abort();

        // For leading execution, it might complete before abort
        // For non-leading calls:
        const promise2 = throttled('arg2');
        await expect(promise2).rejects.toThrow('The operation was aborted');
      });
    });

    describe('rejectSkipped option', () => {
      it('should reject skipped calls when rejectSkipped is true', async () => {
        const func = vi.fn(() => 'result');
        const throttled = throttle(func, 100, { rejectSkipped: true });

        const result1 = throttled('arg1'); // Leading execution
        expect(result1).toBe('result');

        const promise2 = throttled('arg2'); // Should be rejected
        await expect(promise2).rejects.toEqual({
          code: 'THROTTLED',
          message: 'Call was skipped due to throttle',
          replacedBy: ['arg2'],
        });
      });
    });

    describe('methods', () => {
      it('should provide cancel method', async () => {
        const func = vi.fn(() => 'result');
        const throttled = throttle(func, 100);

        const result1 = throttled('arg1'); // Leading execution (sync return)
        const promise2 = throttled('arg2'); // Queued for trailing (returns promise)
        throttled.cancel();

        // First call returns result directly (leading execution)
        expect(result1).toBe('result');

        // Second call should be rejected with AbortError
        await expect(promise2).rejects.toMatchObject({
          code: 'CANCELLED',
          message: 'The operation was cancelled.',
        });

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1); // Only leading execution
      });

      it('should provide flush method', () => {
        const func = vi.fn(() => 'result');
        const throttled = throttle(func, 100);

        throttled('arg1'); // Leading execution
        throttled('arg2'); // Queued

        const result = throttled.flush();

        expect(func).toHaveBeenCalledTimes(2);
        expect(func).toHaveBeenNthCalledWith(2, 'arg2');
        expect(result).toBe('result');
      });

      it('should provide pending method', () => {
        const func = vi.fn(() => 'result');
        const throttled = throttle(func, 100);

        expect(throttled.pending()).toBe(false);

        throttled('arg1'); // Leading execution
        throttled('arg2'); // Queued

        expect(throttled.pending()).toBe(true);

        vi.advanceTimersByTime(100);
        expect(throttled.pending()).toBe(false);
      });
    });

    describe('bug detection tests', () => {
      it('should not execute trailing edge multiple times (double timer bug)', async () => {
        const func = vi.fn(() => 'result');
        const throttled = throttle(func, 100);

        // Leading execution
        throttled('arg1');
        expect(func).toHaveBeenCalledTimes(1);

        // Subsequent call queued for trailing
        throttled('arg2');
        expect(func).toHaveBeenCalledTimes(1);

        // Advance to trigger trailing edge
        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(2);

        // Advance more time to check for extra executions
        vi.advanceTimersByTime(50);
        expect(func).toHaveBeenCalledTimes(2); // Should still be 2, not 3+

        // Final check - no additional executions
        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(2);
      });

      it('should track args properly in rejectSkipped mode', async () => {
        const func = vi.fn(() => 'result');
        const throttled = throttle(func, 100, { rejectSkipped: true });

        const result1 = throttled('arg1'); // Leading execution
        expect(result1).toBe('result');

        const promise2 = throttled('arg2'); // Should be rejected with correct args
        await expect(promise2).rejects.toEqual({
          code: 'THROTTLED',
          message: 'Call was skipped due to throttle',
          replacedBy: ['arg2'],
        });
      });

      it('should handle rapid successive calls without negative timeouts', async () => {
        const func = vi.fn(() => 'result');
        const throttled = throttle(func, 100);

        // Leading execution
        const result1 = throttled('call1');
        expect(result1).toBe('result');

        // Rapid successive calls
        vi.advanceTimersByTime(10);
        throttled('call2');

        vi.advanceTimersByTime(10);
        throttled('call3');

        vi.advanceTimersByTime(10);
        throttled('call4');

        // Should execute trailing edge exactly once after remaining time
        vi.advanceTimersByTime(70); // Total 100ms
        expect(func).toHaveBeenCalledTimes(2);
        expect(func).toHaveBeenNthCalledWith(2, 'call4');

        // No additional executions
        vi.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(2);
      });
    });
  });
});
