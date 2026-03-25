---
title: Evaluate Sophisticated Design Patterns
description: Workflow for distilling component research into the non-obvious, component-specific design innovations that should inform Semantic UI's implementation.
keywords: [research, design patterns, component innovations, pattern evaluation, design maturity]
audience: contributing
type: workflow
workflow: add-sophisticated-patterns
---

# Evaluate Sophisticated Design Patterns

The research pipeline produces comprehensive reports on how components are implemented across frameworks. Most of what's documented is surface-level — standard attributes, common variations, expected states. This workflow is about finding the rest: the design decisions that reveal genuine thinking about user needs.

**The core question for every pattern: would this idea disappear if you removed the component from the framework?**

If yes, it's framework architecture wearing a component mask. If no, it's a component-specific insight worth studying.

---

## What Counts as Sophisticated

A sophisticated pattern isn't a feature. It's evidence that someone thought deeply about how a component actually gets used and designed around the non-obvious problems.

**Signals of sophistication:**
- Solves a problem most developers wouldn't anticipate until they hit it in production
- Shows restraint — deliberately *not* adding something, or choosing a simpler API despite implementation complexity
- Adapts behavior based on usage context rather than configuration flags
- Handles edge cases that only surface through real user testing

**What it isn't:**
- Framework-wide patterns applied to this component (Tailwind styling, TypeScript support, composition APIs)
- Features with high adoption that are nevertheless obvious (disabled states, size variants)
- Complexity for its own sake

---

## The Evaluation Process

### 1. Read the Research

Load the component's aggregate report (`ai/research/components/[name]/pattern-research.md`) and scan individual framework reports. You're looking for moments where a framework did something *unexpected* — not unexpected as in weird, but unexpected as in "I wouldn't have thought of that, and it solves a real problem."

### 2. Apply the Removal Test

For each candidate pattern:

> "If we removed this component from the framework entirely, would this pattern still exist somewhere?"

- ❌ "Uses Tailwind for styling" — ShadCN's approach to *everything*
- ❌ "ConfigProvider integration" — Ant Design's approach to *everything*
- ❌ "Multi-part composition" — that's how Chakra *works*
- ✅ "Conditional ARIA live regions based on autoplay state" — only a carousel needs this
- ✅ "Component-name-aware empty state API" — the component's identity *is* the feature
- ✅ "Field-level re-rendering optimization" — form-specific performance insight

### 3. Write the Evaluation

For each pattern that passes (aim for 2-3 per component), document:

**What it does** — Technical description in 2-3 sentences. Include code if it clarifies.

**Why it's sophisticated** — This is the hard part. Explain the *problem* the pattern solves, not just the solution. What would go wrong without it? What user need does it address that most implementations miss?

**Evidence of design maturity** — Concrete indicators: user research that drove the decision, edge cases handled, deliberate tradeoffs made.

Add the section to the component's `pattern-research.md` after "Unique Innovations."

---

## Calibration

**Good evaluation:**
> Ant Design's Empty State provides component-name-aware illustration presets — when placed inside a Table, it automatically renders a "no data" illustration sized for table contexts. This solves the problem of empty states that look wrong because they were designed in isolation from their container. The sophistication is in recognizing that emptiness is contextual.

**Poor evaluation:**
> Ant Design's Empty State has customizable illustrations and descriptions, allowing developers to create branded empty states. It supports dark mode through the theme system.

The first explains a non-obvious design insight. The second describes features.
