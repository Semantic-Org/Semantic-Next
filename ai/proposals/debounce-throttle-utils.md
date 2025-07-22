# Async-Aware Debounce and Throttle Implementation Specification

## Overview

Implement two utility functions: `debounce` and `throttle` that handle both synchronous and asynchronous functions with modern JavaScript patterns including Promise handling and AbortController support.

## Core Requirements

### 1. Promise Semantics

#### Default Behavior (MANDATORY)
- When multiple calls occur within the debounce/throttle window, ALL returned promises MUST resolve with the result of the eventual execution
- Do NOT reject promises for skipped/debounced calls unless explicitly configured
- This is expected behavior, not an error condition

#### Error Propagation (MANDATORY)
- If the executed function throws or rejects, ALL waiting promises MUST reject with the same error
- Preserve the original error without wrapping or modification

### 2. AbortController Support (MANDATORY)

Implement full AbortController integration:
- Accept abort signals in function arguments
- Pass abort signals through to the underlying async function
- When externally aborted via AbortController, reject ALL pending promises with DOMException 'AbortError'
- Internal debounce replacements MUST NOT trigger abort behavior

### 3. Function Signatures

#### Debounce Function
```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: DebounceOptions
): DebouncedFunction<T>;

interface DebounceOptions {
  rejectSkipped?: boolean;  // MUST default to false
  leading?: boolean;        // MUST default to false
  trailing?: boolean;       // MUST default to true
  maxWait?: number;        // Maximum time to wait before forcing execution
}

type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>>;
  cancel(): void;
  flush(): Promise<Awaited<ReturnType<T>>>;
  pending(): boolean;
};
```

#### Throttle Function
```typescript
function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: ThrottleOptions
): ThrottledFunction<T>;

interface ThrottleOptions {
  rejectSkipped?: boolean;  // MUST default to false
  leading?: boolean;        // MUST default to true
  trailing?: boolean;       // MUST default to true
}

type ThrottledFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>>;
  cancel(): void;
  flush(): Promise<Awaited<ReturnType<T>>>;
  pending(): boolean;
};
```

## Implementation Requirements

### Debounce Behavior

1. **Timing Logic**
   - Start timer on first call
   - Reset timer on each subsequent call
   - Execute function after `wait` milliseconds of inactivity
   - Use arguments from the MOST RECENT call

2. **Promise Management**
   - Maintain a single shared promise for all calls within a debounce window
   - Create new promise only when previous execution completes AND new call arrives
   - Clean up promise references after resolution/rejection

3. **Leading/Trailing Options**
   - `leading: true`: Execute on first call, then debounce subsequent calls
   - `trailing: true`: Execute after wait period
   - Both can be true (execute on first call AND after wait period)
   - At least one MUST be true (validate in options)

4. **MaxWait Option**
   - When specified, force execution if `maxWait` milliseconds have passed since first call
   - Transforms behavior to be throttle-like with debounce characteristics

### Throttle Behavior

1. **Timing Logic**
   - Allow at most one execution per `wait` period
   - Track last execution timestamp
   - Queue or attach to next execution based on timing

2. **Promise Management**
   - Leading calls: Return promise that resolves immediately with execution result
   - Intermediate calls: Return promise that resolves with NEXT execution result
   - Do NOT queue multiple executions (only one pending execution allowed)

3. **Leading/Trailing Options**
   - `leading: true`: Execute immediately on first call
   - `trailing: true`: Execute once more after wait period if calls occurred during wait
   - Default MUST have both true

### Shared Requirements

1. **Context Preservation**
   - MUST preserve `this` context from original call
   - Use Function.prototype.apply or arrow functions appropriately

2. **Synchronous Function Support**
   - Wrap synchronous function returns in Promise.resolve()
   - Handle both sync and async functions transparently

3. **Method Implementations**
   - `cancel()`: Clear all timers, reject pending promises with AbortError if any
   - `flush()`: Execute immediately with latest arguments, return resulting promise
   - `pending()`: Return boolean indicating if execution is scheduled

4. **Memory Management**
   - Clear all timer references on cancel/flush
   - Remove promise references after settlement
   - Prevent memory leaks from long-lived references

## Error Handling

### Standard Errors
When the executed function throws/rejects:
- Propagate error to ALL waiting promises
- Do NOT modify error message or type
- Do NOT wrap in custom error types

### Rejection Types (when rejectSkipped: true)
Create standardized rejection for skipped calls:
```javascript
{
  code: 'DEBOUNCED', // or 'THROTTLED'
  message: 'Call was skipped due to debounce/throttle',
  replacedBy: lastArgs // Array of arguments that will be used instead
}
```

### Abort Errors
When cancelled via AbortController or cancel():
- Use DOMException with name 'AbortError'
- Message: 'The operation was aborted'

## Edge Cases to Handle

1. **Rapid Sequential Calls**
   - MUST handle thousands of rapid calls without stack overflow
   - Use iterative approach, not recursive

2. **Timer Precision**
   - Account for timer imprecision in JavaScript
   - Use Date.now() for accurate time tracking in throttle

3. **Arguments Handling**
   - Support functions with any number of arguments
   - Handle undefined, null, and complex objects
   - No argument mutation

4. **Concurrent Executions**
   - Prevent concurrent executions of the same debounced/throttled function
   - Queue or merge as appropriate based on function type

5. **Post-Cancel Calls**
   - After cancel(), next call MUST start fresh cycle
   - No residual state from cancelled executions

## Test Scenarios to Implement

1. **Basic Debounce**
   ```javascript
   const fn = debounce(async (x) => x * 2, 100);
   const p1 = fn(1);
   const p2 = fn(2);
   const p3 = fn(3);
   // All promises resolve to 6
   ```

2. **AbortController Integration**
   ```javascript
   const controller = new AbortController();
   const fn = debounce(async (x, { signal }) => {
     const res = await fetch(url, { signal });
     return res.json();
   }, 100);
   
   const promise = fn(1, { signal: controller.signal });
   controller.abort();
   // Promise rejects with AbortError
   ```

3. **Error Propagation**
   ```javascript
   const fn = debounce(async () => { throw new Error('API Error'); }, 100);
   const p1 = fn();
   const p2 = fn();
   // Both promises reject with 'API Error'
   ```

4. **Context Preservation**
   ```javascript
   const obj = {
     value: 42,
     method: debounce(async function() { return this.value; }, 100)
   };
   const result = await obj.method();
   // result === 42
   ```

5. **Flush Behavior**
   ```javascript
   const fn = debounce(async (x) => x, 1000);
   fn(1);
   fn(2);
   const result = await fn.flush();
   // result === 2, executed immediately
   ```

## Performance Requirements

- MUST handle at least 10,000 rapid sequential calls without performance degradation
- Timer creation/cleanup MUST be efficient
- Promise creation MUST be minimized (share when possible)
- No memory leaks under any usage pattern

## TypeScript Requirements

- Full type preservation from input function to output function
- Proper generic constraints
- Strict null checks compatibility
- Support for overloaded functions
- Accurate return type for Promise-wrapped results
