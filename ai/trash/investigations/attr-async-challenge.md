# Attribute-Driven Async: Root Cause Analysis

## The Failing Test

Test 13 in `packages/renderer/test/browser/subtree-caching.test.js` defines a component
with `defaultSettings: { label: 'initial' }` and an async function that reads
`settings.label` via a default parameter:

```js
async formatLabel(lbl = settings.label) {
    await new Promise(r => setTimeout(r, 50));
    return `formatted:${lbl}`;
}
```

After the initial async resolves, the test calls `el.setAttribute('label', 'updated')`,
flushes, and expects the old content to be preserved (stale-while-revalidate). That part
passes. But after waiting for the new promise to resolve, the content never updates to
`formatted:updated`. It stays at `formatted:initial` forever.

## Why Test 1 Passes

Test 1 uses a state signal (`state.darkMode`) inside a `{#rerender}` block. The async
function accesses `state.darkMode.get()` directly. `Signal.get()` always calls
`dependency.depend()`, which unconditionally registers the current Reaction as a
subscriber. When the signal changes, the reaction fires, re-invokes the async function,
and the new promise resolves correctly.

## The Bug: Missing Dependency Registration on First Settings Access

The root cause is in `WebComponentBase.createSettingsProxy()` in
`packages/component/src/web-component.js`, lines 261-276:

```js
get: (target, property) => {
    const settings = component.getSettings({ componentSpec, properties });
    const setting = get(settings, property);
    let signal = component.settingsVars.get(property);
    if (signal) {
        signal.get();        // dependency registered -- but only on SECOND+ access
    }
    else {
        signal = new Signal(setting);
        component.settingsVars.set(property, signal);
        // BUG: signal.get() is never called here
        // No dependency is registered on first access
    }
    return setting;
},
```

When `settings.label` is accessed for the **first time** (during the async reaction's
initial run), the code enters the `else` branch: it creates a new Signal and stores it in
`settingsVars`, but **never calls `signal.get()`**. Because `signal.get()` is the
mechanism that calls `dependency.depend()`, which is what subscribes the current Reaction
to that signal, the Reaction never becomes a subscriber.

Later, when `el.setAttribute('label', 'updated')` fires, `adjustPropertyFromAttribute`
correctly calls `el.settings['label'] = 'updated'`, which triggers the proxy setter, which
calls `signal.set('updated')`. The signal fires `dependency.changed()` -- but the
subscriber set is empty. No reaction is invalidated. The async function never re-runs.

## Why This Only Affects Settings (Not State)

State signals (`state.darkMode`) are actual Signal instances in the data context. When
code calls `state.darkMode.get()`, it directly invokes `Signal.prototype.get`, which
always calls `dependency.depend()`. There is no conditional branching.

The settings proxy wraps signals behind a Proxy object. The proxy's getter conditionally
calls `signal.get()` only when the signal already exists. On first access, the signal is
created but the dependency link is never established.

## The Fix

Move `signal.get()` outside the conditional so it runs on every access:

```js
get: (target, property) => {
    const settings = component.getSettings({ componentSpec, properties });
    const setting = get(settings, property);
    let signal = component.settingsVars.get(property);
    if (!signal) {
        signal = new Signal(setting);
        component.settingsVars.set(property, signal);
    }
    signal.get();  // Always register dependency, including on first access
    return setting;
},
```

## Is The Test Expectation Correct?

Yes. The test expectation is correct. Settings should be reactive -- the framework already
intends this (the proxy exists specifically to make settings reactive, and the setter path
correctly fires `signal.set()`). The bug is purely that the dependency subscription is
missed on first access due to the if/else structure. The stale-while-revalidate behavior
in `reactive-async.js` is correct and already works for state signals. This is a
settings-only regression path.

## Verification

Applied the fix to `packages/component/src/web-component.js`. Result:
- All 17 tests in `subtree-caching.test.js` pass (including the previously failing test 13)
- All 45 tests in the component package pass
- One pre-existing failure in `subtree-spurious.test.js` (per-item each granularity)
  is unrelated -- it uses only state signals and plain data, no settings involvement

## Secondary Finding: dataVersion Not Bumped

There is no fallback mechanism to trigger the async reaction through `dataVersion`. The
`renderer.setData()` method (called during LitElement re-renders) does NOT call
`bumpDataVersion()`. Only `cachedRender()` bumps the version. This means the settings
signal is the ONLY reactive path for attribute-driven changes to reach async directives.
This is not a bug per se -- it is just worth noting that if the settings signal path is
broken, there is no alternative path to pick up the slack.
