# Value Schema — Contract for Form Components

## Goal

Define a universal contract for ~20-30 components that hold a value (slider, dropdown, date range input, etc.). Must work for:
- Vanilla HTML (`element.value` property)
- Signals consumers (reactive without manual wiring)
- Framework wrappers (React controlled/uncontrolled, Vue v-model, Svelte bind:value)
- Form participation

## Design

**Contract:** `value` setting + `change` event + schema in spec.

The existing settings proxy (`web-component.js`) is already bidirectional — components can mutate their own settings, and the shadow Signal makes it reactive. Value can leverage this same machinery without new infrastructure.

**Value is arbitrary schema:**
```json
{
  "value": {
    "type": "object",
    "schema": {
      "start": { "type": "date" },
      "end": { "type": "date" }
    }
  }
}
```

Lightweight object literal schema (Qualia pattern), not Zod. Zero dependencies. The schema is metadata for tooling (wrapper type generation, agent consumption), not a validation boundary.

**What the schema enables:**
- Wrapper generation — TypeScript types for value prop per component
- Agent consumption — agents know what shape to construct
- Validation — component can validate incoming values against its own schema
- Form serialization — know how to flatten/restore for FormData

## Key Insight From Scoping

The settings proxy in `web-component.js` is already bidirectional — components like input's `configureSearch()` mutate their own settings internally, and the proxy's `set` trap pushes back into the shadow signal. So mechanically, `value` could just be a setting with a conventional name. No new infrastructure needed — the proxy handles both directions, the signal provides reactivity, and the Lit property system handles DOM attribute sync.

The question is whether `value` is special enough to deserve its own mechanism (dedicated signal, `ElementInternals` form participation) or whether it's simply the setting named `value` that emits `change` events.

## Open Questions

- Is `value` just a setting, or does it need a dedicated mechanism beyond the settings proxy?
- Should the value signal be exposed directly on the element (e.g. `el.value` as a Signal) or stay as plain property + events (standard DOM contract)?
- Form participation via `ElementInternals` — how does schema interact with form validation?
- Jack mentioned considering "a shadow signal to track value similar to what I do for settings" — is there a gap in the current settings proxy that value exposes?

## Dependencies

- Blocks: form, form-field, and all ~20-30 value-holding primitives
- Blocks: wrapper architecture (wrappers need to know the value contract for v-model / controlled components)

## Status

Initial scope. Design discussion began in March 2026 session. Key decision: whether to build on existing settings proxy or create a dedicated value mechanism.

