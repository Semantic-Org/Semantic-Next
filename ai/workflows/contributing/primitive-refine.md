---
title: Refine Primitive Spec
description: Interactive workflow for making editorial decisions about primitive features and authoring the .spec.js file, including spec writing conventions and validation rules.
keywords: [specs, primitives, editorial decisions, adoption levels, pattern evaluation, spec authoring, usage levels]
audience: contributing
type: workflow
skill: primitive-refine
---

# Refine Primitive Spec

> **Skill:** `sui:primitive-refine`
> **Purpose:** Interactive workflow for deciding what goes in a primitive's spec and writing it correctly

## Lifecycle Context

This is the **second step** in creating a primitive — the interactive editorial session.
- **Before**: Primitive scaffolded (`primitive-scaffold.md`)
- **After**: `primitive-write-css.md` (implement CSS for approved features)
- **Reference**: Load `sui:component-specs` skill for full spec format, shared terms, and SpecReader details

---

## Overview

This workflow guides the conversation between an AI agent and the Semantic UI author to decide what features belong in a primitive's spec, then write the `.spec.js` file correctly.

**The Author's Role**: Make editorial decisions from a strong point of view about what belongs in Semantic UI, grounded in first principles about framework design, semantic clarity, and long-term maintainability.

**The AI's Role**: Act as the community advocate. Use adoption data, pattern research, and classic SUI knowledge to represent what users actually need. Present evidence clearly, but respect that the author's vision and experience may override adoption numbers.

## Phase 1: Gather Context

Before the editorial conversation, collect whatever inputs are relevant. Not all sources apply to every primitive.

### Available Inputs

| Source | When to use | How to gather |
|--------|------------|---------------|
| **Pattern research** | New or common UI patterns | Run research workflow, check `ai/research/[component]/` |
| **Classic SUI knowledge** | Component exists in classic Semantic UI | Review classic docs/LESS/variables as context (not as a porting checklist) |
| **Author vision** | Novel components | Start from first principles in conversation |
| **Existing spec** | Extending a primitive | Read current `.spec.js` |

### Load and Present Current State

```
"I've loaded [research showing N patterns / classic SUI analysis / the current spec].

## Current Spec Analysis:
[List what exists: content, types, states, variations]

## Available Context:
[Summarize research findings, classic features, or author's initial direction]

Let's review what should be in this spec."
```

## Phase 2: Review Features

Present features one at a time with a simple decision format:

```
Feature: [Name]
Purpose: [What it does]
Evidence: [Adoption %, classic SUI precedent, or author request]
My perspective: [AI observation about modern usage]

Include?
- y = Yes, include it
- n = No, skip it
- d = Discuss first
```

### Presentation Order

1. **Enhancements to existing features** — missing options for attributes already in the spec
2. **Universal patterns** (90%+ adoption) — actively recommend inclusion
3. **Common patterns** (70-89%) — lean toward inclusion, evaluate fit
4. **Moderate adoption** (40-69%) — neutral, case-by-case
5. **Rare/innovative** (<40%) — skeptical by default, highlight genuine innovations
6. **Author-requested features** — features not found in research

### Key Considerations

- **Automatic eliminations**: `inverted` (theme tokens handle it), features duplicating native platform capabilities
- **Standardization**: Use existing scales (mini→massive), unify related booleans into single attributes
- **Concise syntax**: Consider if shorthand creates ambiguity (e.g., `<ui-divider large>` — size or spacing?)
- **Classic SUI is context, not truth**: The original implementation informs thinking but doesn't dictate decisions

### Usage Level Assignment

Each included feature gets a `usageLevel` (1-5) reflecting **how often users will need it in practice** — not research adoption percentage.

| Level | Label | Criteria | Example |
|-------|-------|----------|---------|
| 1 | Essential | 80%+ of users need this | `size` on button, `text` on divider |
| 2 | Common | 40-80% of users need this | `icon` on button, `primary` emphasis |
| 3 | Advanced | 15-40% of users need this | `attached` variation, `animated` type |
| 4 | Specialized | 5-15% of users need this | `thickness` on divider |
| 5 | Expert | <5% of users need this | Experimental or legacy features |

## Phase 3: Write the Spec

Once features are decided, write the `.spec.js` file. Load the `sui:component-specs` skill for full format reference (shared terms, helper functions, SpecReader details). The rules below are the critical contributor guardrails.

### Spec Writing Rules

**Golden rule: Only use fields documented in `sui:component-specs`. Never invent fields.**

#### Naming Conventions
- **All `name` fields use Title Case**: "Primary", "Top Attached", "Very Padded"
- `name`: PascalCase component name — "Button", "Modal"
- `tagName`: Always `ui-[kebab-case]`
- `exportName`: Always `UI[PascalName]`

#### Description Convention
Use **imperative mood without the component noun**:
- ✅ "be emphasized", "include an icon", "vary in size"
- ❌ "A button can be emphasized", "Allows icons"

**Description templates:**
- States: "be [state]" — "be hovered", "be disabled"
- Types/Variations: "appear [visual]", "be [identity]", "take [dimension]"
- Options: "appear [intensity] [property]" — "appear extremely small"

#### Value Format
Option values must be the **full hyphenated form** for two-way attribute lookup:
- ✅ `value: 'very-padded'`, `value: 'top-attached'`
- ❌ `value: 'very'`, `value: 'top'`

#### includeAttributeClass

Only use on features **with options** that share common CSS rules. Boolean attributes (no options) automatically add their name as a class.

```css
/* Boolean (no includeAttributeClass needed) */
.raised { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

/* Options WITH includeAttributeClass: true */
.colored { border-width: 2px; font-weight: bold; }  /* shared */
.red { background: red; }  /* specific */
/* HTML: <ui-segment colored="red"> → class="colored red segment" */
```

- ✅ Feature has `options` AND options share common CSS rules
- ❌ Boolean attribute (automatic) or options with no shared styles

#### compoundAliases

Use when option values would be ambiguous as standalone boolean attributes. Forces compound form:
- Without: `<ui-button vertical>` — ambiguous (animation? layout?)
- With: `<ui-button vertical-animated>` — unambiguous
- CSS is **not affected** — classes are always `.animated.vertical.button`

#### Valid Fields Per Section

**Content**: `name`, `attribute`, `description`, `usageLevel`, `slot`, `couplesWith`, `includeAttributeClass`, `exampleCode`

**Types/Variations**: `name`, `attribute`, `description`, `usageLevel`, `includeAttributeClass`, `compoundAliases`, `options`, `exampleCode`, `singularExampleCode`, `separateExamples`

**Options**: `name`, `value`, `description`, `exampleCode`

**States**: `name`, `attribute`, `description`, `usageLevel`, `includeAttributeClass`, `options`, `exampleCode`

**Settings**: `name`, `type`, `attribute`, `defaultValue`, `description`, `exampleCode`

**Events**: `eventName`, `description`, `arguments` (each: `name`, `description`)

**Do NOT add**: `valueAttribute`, `required`, `defaultState`, `validation`, or any other undocumented fields.

### Using Shared Terms

Always prefer shared constants from `@semantic-ui/specs` over hand-writing standard patterns:

```javascript
import { getStates, getVariations, modifyVariation, addOptionExamples } from '@semantic-ui/specs';

states: getStates(['hover', 'focus', 'active', 'disabled', 'loading']),

variations: [
  ...getVariations(['size', 'fluid', 'compact', 'circular']),
  modifyVariation(ATTACHED_VARIATION, {
    options: addOptionExamples(ATTACHED_OPTIONS, {
      'top-attached': `<ui-button top-attached>Action</ui-button>`,
    }),
  }),
],
```

See `sui:component-specs` for the complete list of available constants and helpers.

### Types vs Variations vs States

| Section | Mutually Exclusive | Purpose |
|---------|-------------------|---------|
| `types` | Yes (pick one) | Core behavioral modes |
| `variations` | No (stack many) | Visual/layout modifications |
| `states` | No (stack many) | Runtime changes over time |

### Always Include (for machines)
- Explicit `value` fields even when matching lowercase name
- Empty arrays for unused sections (not null/undefined)
- `defaultValue` for all settings
- `usageLevel` for all content/types/variations (default to 1 if unsure)
- `exampleCode` for complex usage

## Phase 4: Document Decisions

Save a decision record in `ai/research/[component]/spec-decisions.md`:

```markdown
## Spec Decisions for [Component]
> Date: [date]

### Included
- ✅ **[Feature]** (Level X): [Reason]

### Excluded
- ❌ **[Feature]**: [Reason]

### Modified from Source
- 🔄 **[Feature]** → **[Our Version]**: [How adapted]

### Innovations
- 🆕 **[Feature]**: [Why added beyond research/classic]
```

## Validation Checklist

Before finalizing a spec:

1. ✓ File is `.spec.js` with `export default { ... }`
2. ✓ All imports from `@semantic-ui/specs`
3. ✓ Pure data (JSON-serializable — no functions, dates, regexes)
4. ✓ All required metadata: `uiType`, `name`, `description`, `tagName`, `exportName`
5. ✓ Naming: `tagName` is `ui-*`, `exportName` is `UI*`
6. ✓ All `name` fields use Title Case
7. ✓ Types are mutually exclusive, variations are stackable
8. ✓ Descriptions use imperative mood without the noun
9. ✓ Usage levels assigned (1-5)
10. ✓ `includeAttributeClass` only on features with options that share CSS
11. ✓ Option values use full hyphenated form
12. ✓ Shared terms used where available
13. ✓ Template literals for HTML examples
14. ✓ Plural sections only share obvious visual variations
15. ✓ Example content provided for documentation

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Component Specs** | `sui:component-specs` | Full spec format reference, shared terms, SpecReader API |
| **Write Primitive CSS** | `sui:primitive-write-css` | Implementing CSS after spec is finalized |
| **Scaffold Primitive** | `sui:primitive-scaffold` | Creating initial file structure |
