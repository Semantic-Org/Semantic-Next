# receivesData Renderer Flag

## Where We Are

Branch `perf/receives-data` has one change: `receivesData` flag on Renderer that gates `dataDep.depend()` in `eval()`. Template.js passes `receivesData: this.isSubtemplate()`.

**CI results confirm:** Data grid bench (no subtemplates) shows small consistent wins (2-13%). Todo bench (subtemplates) is flat — the optimization helps the parent renderer but subtemplate renderers still get `bumpDataVersion()` fired via `currentInstance.render()`.

**Bug found:** `receivesData: false` breaks `{uiClasses}` class string updates on spec-driven components (e.g. menu-item `active` attribute). `{uiClasses}` is a plain string computed in `getData()` via `getUIClasses()` — not a Signal. It depends on `dataDep` to know when to re-evaluate.

## Three Changes Needed (do all three)

### 1. Make `{uiClasses}` a computed function backed by settings Signals

**Files:** `packages/component/src/component-helpers.js`, `packages/component/src/engines/native/base.js`

In `getUIClasses()` (component-helpers.js:357): change `el[property] || el[attribute]` to read from `el.settings[property]`. The settings proxy calls `signal.depend()` on read, registering fine-grained dependencies.

In `getData()` (native/base.js:280): change `data.ui = this.getUIClasses(...)` to `data.ui = () => this.getUIClasses(...)`. The template evaluator calls functions inside Reactions, so `{uiClasses}` will read settings Signals and track them directly.

This makes `receivesData: false` safe for top-level components — `{uiClasses}` no longer needs `dataDep`.

### 2. Dirty flag on Template.render() (council recommendation #2)

**File:** `packages/templating/src/template.js`

Only call `bumpDataVersion()` when the data context actually changed. `assignInPlace` already supports `returnChanged: true`.

```js
setDataContext(data, { rerender = true } = {}) {
  const changed = assignInPlace(this.data, data, { returnChanged: true });
  if (changed) this._dataContextDirty = true;
  ...
}

// In render():
if (!this.rendered) {
  this.html = this.renderer.render();
} else if (this._dataContextDirty) {
  this._dataContextDirty = false;
  this.renderer.bumpDataVersion();
}
```

This is where the **todo bench improvement** will come from. When a parent Signal changes and `requestUpdate()` fires, `render()` recomputes `getDataContext()`. If nothing actually changed in the flat data (the Signal already notified directly), `assignInPlace` returns false, `bumpDataVersion()` is skipped, and subtemplate Reactions don't spuriously re-evaluate.

### 3. Keep receivesData (already done)

The renderer-side gate stays. Combined with #1 and #2, the full picture:

| Layer | What it does |
|-------|-------------|
| `receivesData` (Renderer) | Top-level component Reactions don't subscribe to dataDep |
| `{uiClasses}` as function (Component) | Spec class string tracks settings Signals directly |
| Dirty flag (Template) | `bumpDataVersion()` only fires when data context actually changed |

## Testing Plan

- Run full renderer tests (890 tests)
- Run full component tests (79 tests)
- **Visual smoke test:** Menu items in docs playground must update `active` styling on click
- Run todo tachometer bench — filter/toggle operations should now show improvement
- Run data grid tachometer bench — should maintain existing wins

## Notes

- The `receivesData` line in template.js accidentally got committed to main during branch juggling. Harmless (renderer ignores unknown constructor props) but the diff is split.
- `assignInPlace` with `returnChanged: true` needs verification — check that it correctly detects changes when `getDataContext()` recomputes `{uiClasses}` as a function reference (function identity changes every call). May need to exclude function values from the change check, or compute `{uiClasses}` once and cache.
- The Lit renderer also has `getUIClasses` in `engines/lit/base.js:148` — same change needed there for parity, though Lit is being phased out.

## Completion

- **Shipped via PR #134** (commit `67b871394`). All three changes landed:
  1. `data.uiClasses = () => this.getUIClasses(...)` in `packages/component/src/engines/native/base.js:47` — function form, settings-Signal-tracked.
  2. Dirty flag in `packages/templating/src/template.js:139` — `assignInPlace(this.data, data, { returnChanged: true })`, `dataReplaced` gates `bumpDataVersion()`.
  3. `receivesData` flag in `packages/renderer/src/engines/native/renderer.js:151` — gates `dataDep.depend()` in `lookupExpression()`.
- Archived 2026-04-29 from workspace draft. Plan was executed without a canonical roadmap entry; this archive entry is the catalog record.
