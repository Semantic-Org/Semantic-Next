# Cleanup Timing Analysis — Fresh Code Evaluation

## Question 1: Timing Strategies for Cosmetic DOM Cleanup

There are six distinct strategies, ordered from synchronous to maximally deferred:

### Strategy 1: Synchronous (current implementation)

**Mechanism:** `removeMarkers()` runs immediately after `hydrateMarkers()` completes, within the same rAF callback. The TreeWalker collects all `sui`/`/sui` comments and removes them before the frame yields.

**Optimizes for:** Simplicity and consistency. The shadow root is fully clean before any developer observation point — DevTools, `onRendered` callbacks, Reactions. No window where markers are visible post-hydration.

**Tradeoffs:** Costs ~6ms per 1000-item component. This time is added to the rAF frame that already contains all hydration work. Since `connectedCallback` batches all component hydrations into a single rAF, the cleanup cost compounds across all components on the page (e.g. 50 components with mixed complexity). The 6ms is pure comment node removal — DOM mutations that produce no visual change.

### Strategy 2: queueMicrotask

**Mechanism:** Replace `this.removeMarkers()` with `queueMicrotask(() => this.removeMarkers())`. Microtasks run after the current task but before the browser yields for rendering — they're still same-frame, same-event-loop-turn work.

**Optimizes for:** Separation of concerns (cleanup is logically distinct from hydration wiring) and allows the hydration path to complete and set `this._hydrating = false` and `this.template.rendered = true` before cleanup runs.

**Tradeoffs:** Almost no timing benefit. Microtasks don't yield to the renderer — they execute before the next paint. The 6ms still lands in the same frame. The only advantage is code organization, not performance. Markers are still removed before `onRendered` fires (which uses `setTimeout(..., 0)`).

### Strategy 3: setTimeout(fn, 0)

**Mechanism:** Replace with `setTimeout(() => this.removeMarkers(), 0)`. Defers to the next task in the event loop, after the current rAF callback yields and the browser has a chance to process other events.

**Optimizes for:** Breaking up the long frame. The hydration rAF completes without the 6ms cleanup cost. The browser can process input events between hydration and cleanup. The cleanup still happens very quickly — typically within 4-16ms.

**Tradeoffs:** Brief window (~4-16ms) where markers are visible in DevTools. `onRendered` callbacks (which also use `setTimeout(fn, 0)`) could race with cleanup — ordering depends on task queue scheduling, and `onRendered` might fire before markers are removed. Developers inspecting the component immediately after hydration might see stale markers.

### Strategy 4: requestAnimationFrame

**Mechanism:** Replace with `requestAnimationFrame(() => this.removeMarkers())`. Cleanup runs in the next animation frame.

**Optimizes for:** Visual correctness — cleanup happens before the next visual frame is painted. Good fit for DOM mutation work since rAF is the standard timing for pre-paint work.

**Tradeoffs:** Hydration already runs inside one rAF. Adding cleanup to the next rAF means the browser paints one frame with markers still present (though they're invisible comments), then removes them. This adds a full frame (~16ms) delay before markers are cleared. DevTools shows markers for one frame. This is a reasonable strategy if the goal is "don't hold up hydration" without fully decoupling from the render loop.

### Strategy 5: requestIdleCallback

**Mechanism:** Replace with `requestIdleCallback(() => this.removeMarkers())`. Cleanup runs when the browser has idle time — after all high-priority work (rAF, layout, paint, tasks) is complete and the event loop is quiet.

**Optimizes for:** Minimal performance impact. The 6ms is moved entirely out of any critical path. The browser schedules it opportunistically when nothing else needs the main thread. This is the textbook use case for idle callbacks: non-urgent, non-visual DOM cleanup.

**Tradeoffs:** Markers may persist for an indeterminate period. Under heavy load, cleanup could be starved for seconds. In backgrounded tabs, it may be delayed significantly or run at low priority. Developers inspecting in DevTools will see markers until idle time arrives. Need a fallback for Safari (no `requestIdleCallback` support). More architectural complexity — the component must tolerate a "partially cleaned" state.

### Strategy 6: Never (remove cleanup entirely)

**Mechanism:** Delete `removeMarkers()` entirely. Markers remain as comment nodes in the shadow root forever.

**Optimizes for:** Zero cleanup cost. No code, no runtime overhead, no timing complexity.

**Tradeoffs:** Comment nodes persist in every shadow root. DevTools always shows them. `innerHTML` and `cloneNode` include them. If any future code assumes a clean shadow root (e.g., DOM diffing, snapshot testing, serialization), it will encounter unexpected comment nodes. This is a permanent DX cost — every developer inspecting components will see `<!--sui:v1:0-->` comments interspersed with the DOM.

---

## Question 2: requestIdleCallback — Concrete Behaviors and Edge Cases

### Deadline Budget

`requestIdleCallback` provides a `deadline` object with `timeRemaining()`. The browser aims to give idle callbacks up to 50ms, but the actual remaining time depends on the current frame budget. After a 60fps frame completes its rAF + layout + paint in 10ms, there might be 6ms of idle time. In reality, `timeRemaining()` often returns 0-15ms. The 6ms cleanup for a large component fits well within a typical idle window.

However, `removeMarkers()` does not currently chunk its work — it walks the entire shadow root in one pass. If a component has an exceptionally large DOM and the idle deadline expires mid-walk, the framework has no mechanism to pause and resume. For the measured 6ms cost, this is unlikely to be a problem in practice (50ms budget >> 6ms), but it's a latent risk if components grow.

### Starvation Under Load

If the main thread is continuously busy (animations, heavy JS, scroll handlers), `requestIdleCallback` may never fire. Modern browsers implement a starvation timeout: Chrome guarantees execution within ~1 second even under load by scheduling idle callbacks with increasing priority. But this guarantee is implementation-specific — the spec says "the user agent SHOULD NOT run idle callbacks at a frequency of more than 1 per second" under sustained load.

For marker cleanup, starvation means comments visible in DevTools for up to ~1 second under heavy load. Not a functional problem, but a DX inconsistency.

### Tab Backgrounding

When a tab is backgrounded, browsers throttle or freeze rAF and timer-based work. `requestIdleCallback` behavior varies:
- **Chrome:** In backgrounded tabs, idle callbacks are deprioritized but do eventually fire (budget is more generous since nothing is painting). They may fire more frequently than in foreground since the frame budget constraint doesn't apply.
- **Firefox:** Similar behavior — idle callbacks still fire in background tabs.
- **Key nuance:** If the browser freezes the tab entirely (Chrome's Tab Freeze), no callbacks fire at all until the tab is foregrounded. Cleanup would resume on tab focus.

For marker cleanup this is fine — no one is inspecting shadow roots while the tab is backgrounded.

### Browser Support / Fallback

`requestIdleCallback` is supported in Chrome, Edge, Firefox, and Opera. **Safari does not support it** (as of Safari 18.x). This is a significant gap for a web component framework.

Standard fallback pattern:
```js
const scheduleIdle = globalThis.requestIdleCallback
  || ((cb) => setTimeout(cb, 1));
```

Using `setTimeout(cb, 1)` as fallback is imperfect — it doesn't provide an idle-like scheduling, just a minimal delay. But for a 6ms cleanup pass, it's functionally adequate.

### Interaction with requestAnimationFrame

`requestIdleCallback` and `requestAnimationFrame` are independent scheduling mechanisms. The browser's frame lifecycle is:

1. Input events / tasks
2. rAF callbacks
3. Style/Layout/Paint
4. Idle callbacks (if time remains before next frame)

Since hydration runs in rAF (step 2), and cleanup would run in idle (step 4), there's a guaranteed ordering: hydration always completes before cleanup runs. There's no risk of cleanup racing with hydration. However, if hydration triggers Reactions that schedule rAF work (e.g., `requestUpdate`), the cleanup in the idle window of frame N might interleave with rAF work in frame N+1. Since cleanup only removes inert comment nodes, this is safe.

### Appropriateness for DOM Mutations

`requestIdleCallback` is generally discouraged for DOM mutations that cause layout or paint, because the work happens after the frame's layout/paint phase — the browser would need to re-layout before the next frame. However, removing comment nodes:
- Does **not** trigger layout (comments have no box model).
- Does **not** trigger repaint (comments have no visual representation).
- Does **not** change the computed style of any element.
- Does trigger MutationObserver if one is watching, but the framework's reactivity system uses Signals/Reactions, not MutationObservers.

So the standard "don't mutate DOM in idle callbacks" advice does **not** apply here. Comment node removal is the rare case where idle DOM mutation is completely safe.

---

## Question 3: Risks of DOM Mutations in requestIdleCallback

### Layout Thrashing

Removing comment nodes does not trigger layout. Comment nodes are not part of the render tree — they have no computed geometry, no CSS box, no contribution to any layout calculation. `node.remove()` on a comment node is a pure DOM tree mutation with no style or layout side effects.

The TreeWalker pattern in `removeMarkers()` — collect all nodes first, then remove in a second pass — is already batch-friendly. Even though this batching provides no layout benefit for comments specifically (there's no layout to batch), it avoids invalidating the walker during traversal.

**Verdict:** No layout thrashing risk.

### MutationObserver Triggers

Comment removal fires MutationObserver notifications (type `childList`, `removedNodes` includes the comment). Two scenarios:

1. **Framework's own system:** The renderer uses Signals and Reactions, not MutationObservers. `requestUpdate` is the mutation path, and it's gated by `this.template`. Removing comment nodes cannot trigger a reactive cascade because no Reaction depends on comment node presence.

2. **Third-party observers:** If a user or library has a MutationObserver on the shadow root, it will see `childList` mutations for comment removal. This is a minor concern — shadow root MutationObservers are rare, and the notifications are benign. But in an idle callback, these observer notifications fire asynchronously and might interleave with other idle work. This is an extremely edge-case scenario.

**Verdict:** No practical risk. MutationObserver notifications will fire but are harmless.

### Interaction with the Framework's Reactive System

The critical question: can removing comment nodes during an idle callback interfere with anything the Renderer or Template is doing?

Looking at the code:

- `hydrateTextExpression` — replaces the comment marker with a text node (`comment.remove()` or `comment.replaceWith(textNode)`) during hydration itself. By the time `removeMarkers` runs, these comments are already gone.
- `hydrateBlockDirective` — replaces the opening marker with `region.anchor` (`comment.replaceWith(region.anchor)`), removes the closing marker (`next.remove()`). Again, handled inline during hydration.
- The remaining markers after hydration are: (a) top-level closing block markers at depth 0 that are skipped by the `blockDepth` tracking, (b) inner markers inside block-owned regions that were processed recursively but whose outermost block markers weren't removed, (c) any markers for entry types not handled (e.g., if an entry has no matching handler).

After hydration, Reactions reference text nodes, elements, and DynamicRegion anchors — never comment markers. No Reaction closure captures a reference to any marker comment node. The `isConnected` check in each Reaction (e.g., `if (!comp.firstRun && !textNode.isConnected)`) operates on the adopted text nodes and anchors, not on markers.

**One subtlety:** If an idle callback fires between hydration and `onRendered` (which uses `setTimeout(fn, 0)`), is there any issue? Looking at the code:

```js
this.removeMarkers();
setTimeout(() => this.template?.onRendered(), 0);
```

If cleanup moves to `requestIdleCallback`, and `onRendered` fires via `setTimeout`, the ordering is: `setTimeout` fires as a task (step 1 of next frame), while `requestIdleCallback` fires in idle time (step 4). So `onRendered` would fire **before** cleanup. This means `onRendered` callbacks that inspect the shadow root would see markers. If this matters, cleanup should fire before `onRendered`.

**Verdict:** No reactive system interaction risk. Minor concern about `onRendered` ordering if user code inspects the DOM in that callback.

### Visible Reflow or Repaint

Comment nodes have no visual representation whatsoever. They:
- Are not part of the render tree.
- Have no CSS box model.
- Do not participate in flex, grid, or any layout algorithm.
- Cannot affect the visual output of the page.

Removing them causes zero reflow and zero repaint. This is verifiable: Chrome DevTools' "Layout Shift" and "Paint" panels would show no activity from comment removal.

**Verdict:** Zero visual impact.

---

## Question 4: Architectural Implications of Layered Deferral

### Current Deferral Architecture

The current timing stack is:
1. `connectedCallback` fires synchronously when the element is connected to the DOM
2. If DSD content detected: `requestAnimationFrame(() => this.hydrate(prototypeTemplate))`
3. Inside `hydrate()`: `this.removeMarkers()` runs synchronously
4. After `hydrate()`: `setTimeout(() => this.template?.onRendered(), 0)`

So the layers are: **synchronous (constructor + connectedCallback) -> rAF (hydration) -> sync (cleanup) -> setTimeout (onRendered)**

### Adding a Third Tier

If cleanup moves to `requestIdleCallback`, the stack becomes:
1. Synchronous: constructor, connectedCallback
2. rAF: hydration (marker walking, binding wiring, Reaction creation)
3. setTimeout: `onRendered` callback
4. requestIdleCallback: marker cleanup

This creates a four-phase lifecycle per component. For the page as a whole, with 50 components batched into one rAF:
- Frame 1: all hydrations run
- Frame 1 (post-task): all `onRendered` callbacks fire
- Frame 1-N (idle): marker cleanup trickles in per component

### Debugging Complexity

**Moderate increase.** The primary debugging concern is temporal: a developer setting a breakpoint in `onRendered` and inspecting the shadow root will see marker comments that "shouldn't be there." This could cause confusion because:

1. The markers look like framework internals that failed to clean up.
2. Different components may be at different cleanup stages (some cleaned, some not).
3. The cleanup timing is non-deterministic — it depends on browser idle scheduling.

However, since the markers are self-evidently framework annotations (they start with `sui:v1:` or `sui-block:v1:`), an experienced developer would recognize them as hydration artifacts. The marker format itself communicates "this is a versioned framework marker" rather than looking like a bug.

**Mitigation:** A development-mode console log like `"[SUI] Hydration markers will be cleaned up during idle time"` would eliminate confusion. Or simply document it.

### The Visibility Window

With the current synchronous approach, there is **no** window where markers are visible post-hydration. With `requestIdleCallback`, the window is:

- **Minimum:** One frame (~16ms) — idle time at end of the hydration frame
- **Typical:** 1-50ms — idle time arrives quickly on most pages
- **Maximum under load:** ~1 second — Chrome's starvation timeout
- **Worst case (frozen tab):** Indefinite until tab is foregrounded

During this window, markers are visible in:
1. DevTools Elements panel (when inspecting the shadow root)
2. `shadowRoot.innerHTML` (if serialized programmatically)
3. MutationObserver notifications (in their presence, not their removal)
4. `onRendered` callback DOM inspection

They are NOT visible in:
1. The rendered page (comments are invisible)
2. CSS selector matching (comments don't match)
3. `querySelector`/`querySelectorAll` (don't match comments)
4. Screen readers or accessibility APIs

### Ordering Guarantees

`requestIdleCallback` provides **no ordering guarantee** relative to other `requestIdleCallback` calls on different components. If 50 components each schedule idle cleanup, the browser may interleave them in any order. This is fine because each component's shadow root is isolated — there's no cross-component dependency.

Within a single component, the ordering concern is:
- Can cleanup run before hydration? **No.** Cleanup is scheduled from within `hydrate()`, which runs in rAF. The idle callback is queued after hydration completes.
- Can cleanup run before `onRendered`? **Yes.** `requestIdleCallback` could fire before `setTimeout` if idle time is available in the same task. But typically `setTimeout(fn, 0)` fires first (as a task) and then idle runs after. This is non-deterministic.
- Can a second hydration start before cleanup finishes? **No.** The component sets `this._hydrating = false` before scheduling cleanup. But if `disconnectedCallback` fires before cleanup runs, `this.template` is deleted. The cleanup callback needs a guard: `if (!this.shadowRoot) return;` or a reference check.

### Disconnection Edge Case

A concrete risk: if a component is connected, hydrates via rAF, schedules idle cleanup, then is disconnected before cleanup fires, `disconnectedCallback` deletes `this.template` and the shadow root may be in a detached state. `removeMarkers()` accesses `this.shadowRoot`, which persists on the element even after disconnection (shadow roots are permanent). So the TreeWalker would still work, but it's wasted effort on a detached tree.

The fix is straightforward:
```js
requestIdleCallback(() => {
  if (this.isConnected) {
    this.removeMarkers();
  }
});
```

### What Happens When a Developer Inspects Between Hydration and Cleanup

The developer sees:
```html
#shadow-root (open)
  <!--sui:v1:0-->
  <div class="ui button">
    <!--sui-block:v1:1-->
    Click me
    <!--/sui-block:v1:1-->
  </div>
```

The comments are clearly framework markers (versioned, prefixed). They're interspersed with the actual DOM. This is not catastrophically confusing but it is noisy. For a framework that prides itself on DX, this is a real tradeoff — the markers are a visible sign that "cleanup hasn't happened yet," which can erode confidence in the framework's polish.

That said, this is only visible in DevTools during the idle window. No end user ever sees it. And the native browser DevTools experience for shadow DOM already involves framework-specific artifacts (shadow root notation, slot assignments, etc.), so a few comment nodes are unlikely to alarm experienced web component developers.

### Recommendation Synthesis

The cleanest approach for this specific use case — removing invisible comment nodes with zero layout/paint impact — is **requestIdleCallback with a setTimeout fallback for Safari, guarded by `isConnected`**:

```js
const scheduleCleanup = globalThis.requestIdleCallback
  || ((cb) => setTimeout(cb, 1));

// In hydrate():
scheduleCleanup(() => {
  if (this.isConnected) {
    this.removeMarkers();
  }
});
```

This moves 6ms per component entirely out of the hydration frame, the scheduling API matches the semantics perfectly (low-priority, non-visual DOM maintenance), the guard handles disconnection, and the fallback keeps Safari functional. The DX cost (briefly visible markers in DevTools) is minimal and can be documented.

The alternative worth considering is **setTimeout(fn, 0)** — simpler, more predictable, cross-browser, and the cleanup still happens within ~4ms. It lacks the semantic precision of `requestIdleCallback` (it's not truly "idle time"), but the practical difference for a 6ms operation is negligible. The advantage is that `setTimeout` guarantees execution order relative to the `onRendered` callback (if cleanup is scheduled first, it fires first), removing the ordering ambiguity.
