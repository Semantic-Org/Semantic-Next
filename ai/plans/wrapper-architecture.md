# Wrapper Architecture — Framework Integration Packages

## Goal

Ship `@semantic-ui/react`, `@semantic-ui/vue`, `@semantic-ui/svelte` (and potentially Angular, etc.) that wrap **arbitrary** SUI components — not just first-party ones.

## Strategy: Static Analysis + Specs

**Three inputs for wrapper generation:**

1. **`defineComponent()` call** — universal, works for any SUI component
   - `defaultSettings` → typed props (keys = prop names, values = types + defaults)
   - `dispatchEvent` calls → event callbacks (string name + detail shape)
   - Template → slot declarations (`{>slot}` default, `{>slot name="x"}` named)
   - `createComponent` return → ref-accessible imperative API

2. **Component spec JSON** (optional, first-party only)
   - Richer type info: types, variations, states with allowed values
   - Value schema for form components
   - Descriptions for documentation generation

3. **Template file**
   - Slot extraction (default + named)
   - Dual prop/slot pattern detection

**Specs enrich but aren't required** — user-authored components won't have them. The wrapper generator must work from `defineComponent()` alone.

## Per-Framework Mapping

| SUI Concept | React | Vue | Svelte |
|---|---|---|---|
| Settings | Props | Props | Props |
| Boolean attributes (spec) | Boolean props | Boolean props | Boolean props |
| `dispatchEvent('change', {value})` | `onChange` callback | `@change` event / `v-model` | `on:change` / `bind:value` |
| Default slot | `children` | Default slot | Default slot |
| Named slot (`{>slot name="header"}`) | `header` JSX prop | `<template #header>` | `<svelte:fragment slot="header">` |
| Dual prop/slot (content as attr or slot) | Both paths work — just forward attribute | Same | Same |
| Component methods (via ref) | `useRef` → instance | Template ref → instance | `bind:this` → instance |
| Value (form components) | Controlled/uncontrolled pattern | `v-model` | `bind:value` |

## Implementation Options

- **Build tool / CLI** — reads component source, outputs typed wrapper file
- **Vite/esbuild plugin** — generates wrappers at build time
- **Runtime wrapper factory** — `createReactWrapper(MyComponent)` at runtime (no static types)

Preference is build-time generation for type safety. Runtime factory as escape hatch.

## Dependencies

- Value schema design (for form component wrappers)
- Enough primitives built to validate the generation pipeline
- Framework core locked (no API changes to `defineComponent`)

## Status

Architecture discussion completed March 2026. Not started. Blocked on value schema + framework stabilization.
