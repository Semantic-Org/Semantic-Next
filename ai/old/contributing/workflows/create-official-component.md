---
title: Create Official Semantic UI Component
description: Orchestrator workflow that routes to appropriate component creation paths based on component type, including classic ports, research-first, and novel components.
keywords: [components, primitives, orchestration, workflow routing, scaffolding, research]
audience: contributing
type: workflow
---

# Create Official Semantic UI Component

**Purpose**: Orchestrate the complete process of creating an official Semantic UI component
**Target**: LLMs and developers starting any component work
**Role**: Router and orchestrator — read each referenced workflow before executing it

All workflows live in `ai/contributing/workflows/`.

## Decision Tree

```
Start Here
    ↓
Is this component in classic Semantic UI?
    ├─ YES → Path A: Port Classic Component
    └─ NO → Is this based on common UI patterns?
            ├─ YES → Path B: Research-First Component
            └─ NO → Path C: Novel Component
```

## Path A: Port Classic Component

For components that exist in classic Semantic UI (button, divider, segment, etc.).

```
1. Scaffold
   → scaffold-primitive.md
   Creates file structure, spec stub, barrel exports
   Autonomous — no user interaction needed

2. Research Modern Patterns
   → research-component-patterns.md
   Surveys 10+ frameworks, creates ai/research/[component]/pattern-research.md
   Autonomous — web fetching and report generation

3. Analyze Classic Sources
   → port-classic-primitive.md
   Collects classic SUI docs/LESS/variables, enumerates features with modernization analysis
   Creates ai/research/[component]/feature-analysis.md
   Autonomous — source collection and analysis

4. Review Features & Build Spec ⬅ INTERACTIVE
   → evaluate-research-extend-spec.md
   Presents classic features + research patterns to author for decisions
   Writes the .spec.js based on approved features
   Creates ai/research/[component]/spec-decisions.md

5. Implement CSS
   → implement-primitive-css.md
   Creates definition + theme CSS files for each spec feature
   Autonomous — follow spec, ask user only when uncertain about tokens
```

## Path B: Research-First Component

For new components based on common UI patterns (tabs, tooltips, modals, etc.) that don't exist in classic Semantic UI.

```
1. Scaffold
   → scaffold-primitive.md
   Creates file structure, spec stub, barrel exports
   Autonomous

2. Research Modern Patterns
   → research-component-patterns.md
   Surveys 10+ frameworks, creates ai/research/[component]/pattern-research.md
   Autonomous

3. Review Features & Build Spec ⬅ INTERACTIVE
   → evaluate-research-extend-spec.md
   Presents research patterns to author for decisions (no classic analysis)
   Writes the .spec.js based on approved features
   Creates ai/research/[component]/spec-decisions.md

4. Implement CSS
   → implement-primitive-css.md
   Creates definition + theme CSS files for each spec feature
   Autonomous
```

## Path C: Novel Component

For truly new components without established patterns.

```
1. Scaffold
   → scaffold-primitive.md
   Creates file structure, spec stub, barrel exports
   Autonomous

2. Build Spec with Author ⬅ INTERACTIVE
   Work directly with the author to define the spec
   No research to guide decisions — author-driven from first principles

3. [Optional] Research Validation
   → research-component-patterns.md
   Sanity check against existing patterns if desired

4. Implement CSS
   → implement-primitive-css.md
   Creates definition + theme CSS files for each spec feature
   Autonomous
```

## Reference Guides (Not Steps)

These are consulted during spec authoring and CSS implementation — they're reference material, not sequential steps:

- **`define-primitive-spec.md`** — Spec field reference, shared terms system, validation rules. Use when writing or editing `.spec.js` files (during step 4 of Path A/B, step 2 of Path C).
- **`implement-primitive-css.md`** — CSS architecture, file structure, token usage, selector patterns. Use during the CSS implementation step.

## Usage Level Assignment

Usage levels (1-5) are assigned during the spec review step:
- **Research data** informs which features to consider (adoption percentages)
- **Author judgment** determines the actual usage level (expected frequency of use)
- See `evaluate-research-extend-spec.md` for full usage level definitions

## Component Readiness Checklist

### Specification
- [ ] All features have natural language names and descriptions
- [ ] Usage levels assigned (1-5) based on expected frequency
- [ ] Example code provided for all variations
- [ ] Content, types, states, variations properly categorized
- [ ] Shared terms used where available (`getStates`, `getVariations`, etc.)

### Implementation
- [ ] All spec features have definition + theme CSS files
- [ ] CSS follows token system (verified tokens exist)
- [ ] Barrel files updated with correct layer names
- [ ] Nested CSS syntax used throughout

### Documentation
- [ ] Research archived in `ai/research/[component]/`
- [ ] Decision rationale documented in `spec-decisions.md`
- [ ] MDX page created in `docs/src/content/primitives/`
- [ ] Astro component registry updated

## Anti-Patterns

- Starting CSS before the spec is reviewed with the author
- Running scaffold/research again inside port-classic (the orchestrator handles those)
- Treating define-primitive-spec.md as a sequential step instead of a reference
- Making spec decisions autonomously without author review
- Skipping research for Path A/B — it provides essential modern context
