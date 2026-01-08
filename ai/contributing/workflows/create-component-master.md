---
title: Master Component Creation Workflow
description: Orchestrator workflow that routes to appropriate component creation paths based on component type, including classic ports, research-first, and novel components.
keywords: [components, primitives, orchestration, workflow routing, scaffolding, research]
audience: contributing
type: workflow
---

# Master Component Creation Workflow

> Last Updated: 2024-11-04

**Purpose**: Orchestrate the complete process of creating a Semantic UI component
**Target**: LLMs and developers starting any component work
**Role**: Router and orchestrator for all component workflows

## Overview

This workflow routes to the appropriate component creation path based on component type.

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

For components that exist in classic Semantic UI.

### Full Process:
```
1. Scaffold Component Structure
   → scaffold-primitive.md
   → Creates: Basic file structure and stubs

2. Research Modern Patterns
   → research-component-patterns.md
   → Creates: ai/research/[component]/pattern-research.md

3. Port Classic Component
   → port-classic-primitive.md
   → Creates: ai/research/[component]/migration-decisions.md

4. Evaluate Research & Extend Spec
   → evaluate-research-extend-spec.md
   → Updates spec with modern patterns
   → Creates: ai/research/[component]/spec-decisions.md

5. Implement CSS
   → implement-primitive-css.md
   → Creates: Component CSS files
```

### Complexity: Medium
- Research provides modern context
- Classic SUI provides historical reference
- Decisions balance legacy patterns with current standards

## Path B: Research-First Component

For new components based on common UI patterns (tabs, tooltips, modals, etc.).

### Full Process:
```
1. Research Component Patterns
   → research-component-patterns.md
   → Creates: ai/research/[component]/pattern-research.md

2. Scaffold Component Structure
   → scaffold-primitive.md
   → Creates: Basic file structure

3. Build Spec from Research
   → evaluate-research-extend-spec.md
   → Creates: Initial spec based on research patterns
   → Creates: ai/research/[component]/spec-decisions.md

4. Polish Spec Language
   → define-primitive-spec.md
   → Refines naming for natural language clarity
   → Finalizes descriptions and examples

5. Implement CSS
   → implement-primitive-css.md
   → Creates: Component CSS files
```

### Complexity: High
- Research requires checking 10+ frameworks
- Spec creation needs synthesis of many patterns
- More decision points about what to include

## Path C: Novel Component

For truly new components without established patterns.

### Full Process:
```
1. Scaffold Component Structure
   → scaffold-primitive.md
   → Creates: Basic file structure

2. Define Spec from First Principles
   → define-primitive-spec.md
   → Author-driven spec creation

3. [Optional] Validate Against Patterns
   → research-component-patterns.md
   → Sanity check against existing patterns

4. Implement CSS
   → implement-primitive-css.md
   → Creates: Component CSS files
```

### Complexity: Variable
- Depends entirely on component complexity
- No research to guide decisions
- Requires more creative/architectural thinking

## Workflow Selection Guide

### Path A: Classic Component Exists
- Component exists in classic Semantic UI
- Research provides modern context
- Classic provides starting point

### Path B: Common Pattern Component
- Component appears in 5+ other frameworks
- No classic SUI version to reference
- Build spec from research consensus

### Path C: Novel Component
- Component doesn't exist elsewhere
- Solving a unique problem
- Experimental or innovative approach

## Usage Level Assignment

Usage levels (1-5) are assigned at different points:
- **Research phase**: Calculates adoption levels from framework analysis
- **Evaluation phase**: Author adjusts based on Semantic UI priorities
- **Spec definition**: Final usage levels set based on expected use

## Component Readiness Checklist

Before considering a component complete:

### Specification
- [ ] All features have natural language names
- [ ] Usage levels assigned based on research or experience
- [ ] Example code provided for all variations
- [ ] Content, types, states, variations properly categorized

### Implementation
- [ ] All spec features implemented
- [ ] CSS follows token system
- [ ] Theme and definition layers separated
- [ ] Responsive behavior considered
- [ ] Accessibility attributes included

### Documentation
- [ ] Research archived in `ai/research/[component]/`
- [ ] Decision rationale documented
- [ ] Migration notes for classic users (if applicable)
- [ ] Implementation notes for maintainers

## Workflow Sequence Reference

```bash
# Path A: Port classic component (with mandatory research)
scaffold-primitive.md → research-component-patterns.md → port-classic-primitive.md → evaluate-research-extend-spec.md → implement-primitive-css.md

# Path B: New component from patterns
scaffold-primitive.md → research-component-patterns.md → evaluate-research-extend-spec.md → define-primitive-spec.md → implement-primitive-css.md

# Path C: Novel component
scaffold-primitive.md → define-primitive-spec.md → implement-primitive-css.md
```

## Anti-Patterns to Avoid

❌ **Starting implementation before spec**
❌ **Skipping workflow steps**
❌ **Not documenting decisions**

## Output Artifacts

A complete component workflow produces:
1. **Component structure** - Files, defineComponent, barrel updates
2. **Specification** - Complete spec with all features defined
3. **Research documentation** - Pattern analysis and decisions (if researched)
4. **CSS implementation** - Theme and definition layers with proper tokens
5. **Decision records** - Why features were included or excluded

## Workflow Execution Notes

- Scaffold first to establish component structure
- Research provides data but author makes editorial decisions
- Document all decisions in ai/research/[component]/
- Each workflow produces specific artifacts
- Track progress with TodoWrite tool throughout