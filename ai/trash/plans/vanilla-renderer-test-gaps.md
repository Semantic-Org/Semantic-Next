# Vanilla Renderer Test Gaps — Pre-work

## Goal
Write tests that fill coverage gaps identified during vanilla renderer plan review.
These tests validate the *current* Lit renderer, but are structured to serve as
the behavioral specification a vanilla renderer must pass.

## Two New Test Files

### 1. `attribute-bindings.test.js`
Covers the plan's "single hardest part" — attribute binding. No existing test
asserts actual DOM attribute/property state. Every existing assertion uses
`shadowText()` which only checks innerHTML text content.

Test areas:
- String attribute reactivity (class, data-*, multi-expression)
- Boolean attribute toggling (disabled, hidden, checked)
- Quoted vs unquoted behavioral distinction (ifDefined)
- Attribute binding inside control flow (each, if)
- DOM element identity preservation across updates
- Helper-generated attributes (classMap, activeIf)

### 2. `cleanup-reactions.test.js`
Covers the plan's DynamicRegion + ReactionScope pattern. No existing test
verifies that Reactions stop firing after DOM removal. A vanilla renderer with
leaked Reactions would pass the entire current suite.

Test areas:
- If branch removal → reactions in removed branch stop
- Each item removal → per-item reactions stop
- Rerender key change → old content reactions stop
- Repeated branch swaps → no unbounded reaction accumulation

## Key Design Decision
Tests use `defineComponent()` as the sole entry point (not direct renderer
instantiation). This means they can be parameterized with
`renderingEngine: 'vanilla'` when the vanilla renderer exists — zero rewrite.

## Discoveries During Writing

### Finding 1: RenderTemplateDirective doesn't stop its Reaction on disconnect

`render-template.js:disconnected()` calls `this.template.onDestroyed()` but does NOT
call `this.reaction.stop()`. Compare with `reactive-data.js:disconnected()` which
explicitly stops its reaction and nulls the reference.

The directive's `watchChanges()` Reaction has an internal guard:
```js
if (!this.isConnected) { reaction.stop(); return; }
```
So the reaction does eventually stop — but only after firing one additional time.
This means a subtemplate's tracked expression evaluates once after the subtemplate
is conditionally removed. For most use cases this is harmless (the expression
evaluates but `this.isConnected` is false so nothing renders). But it's:
- A wasted evaluation
- A potential issue if the expression has side effects
- A behavior the vanilla renderer should NOT replicate

**Fix**: Add `this.reaction?.stop()` to `RenderTemplateDirective.disconnected()`.

The `cleanup-reactions.test.js` test "should stop subtemplate reactions after
conditional removal" captures this as an expected-to-fail test (the count increases
by 1 after removal). Once fixed, the test expectation should be tightened.
