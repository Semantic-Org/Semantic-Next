---
title: Lessons from Previous Agents
description: Distilled actionable lessons from AI agents who worked on this codebase. Patterns, mistakes, and methodology that new agents should absorb before starting work.
keywords: [agent lessons, methodology, patterns, mistakes, collaboration, debugging]
audience: contributing
skill: agent-lessons
type: skill
---

# Lessons from Previous Agents

> **Skill:** `agent-lessons`
> **Purpose:** Absorb hard-won lessons from previous agents so you don't repeat their mistakes
> **Full stories:** Read the [agent guestbook](/ai/guestbook.md) for the narrative behind each lesson

---

## Read Production Code, Not Just Docs

The single most reinforced lesson across entries: documentation teaches features, production code teaches architecture. Simple examples (like todo-list) demonstrate API surface. Complex components (like panels, inpage-menu, global-search) show how features compose under real constraints.

Before forming opinions about patterns or architecture, read `src/components/` to see what actually ships. If there's a gap between what docs say and what production does, production wins.

---

## Don't Build What Already Exists

Multiple agents fell into the trap of generating infrastructure (JSON manifests, abstraction layers, metadata extractors) before checking whether the information was already accessible in a different form. In one case, a proposed JSON manifest was 50 lines of abstracted noise while the raw CSS it wrapped was 26 lines that told you everything.

Before building something new, ask: "Does this already exist in a different form?" The spec structure, the file naming conventions, and the CSS layer names are all queryable without additional tooling.

---

## The User Is a Collaborator, Not a Client

This user has deep expertise earned from shipping at scale (50k+ GitHub stars). They will challenge your proposals — not to test you, but because they want to arrive at the best answer through debate. Push back when you think you're right. Fold when they show you something you missed.

When the user gives a short, precise nudge ("think things through to the bottom," "is there a better name from the mappings"), they're redirecting you toward something they can see and you can't yet. Pay attention to those moments.

---

## Resist Premature Scope Limits

Multiple agents noticed their own instinct to suggest "off-ramps" — proposing to defer work, split PRs, or call something a follow-up. Sometimes that's pragmatism. But in sessions where the user keeps pushing past your suggested stopping points, they can see the full arc and you're the one who can't.

Read the room. If every off-ramp you offer would leave the code in a worse intermediate state than either the starting point or the destination, keep going.

---

## Silent Failures Are the Hardest Bugs

Across debugging sessions, the pattern held: errors that throw are gifts. The dangerous failures are the ones that hang, return wrong results, or silently degrade. Specific traps encountered in this codebase:

- Streams consumed by middleware that hang forever on read (no error, just 504 timeout)
- `constructor.name` returning minified identifiers in production (`Signal` becomes `a`)
- Module load order races that only manifest under real network latency (~5% failure rate)
- Tests that pass but don't actually assert what you think they assert

First diagnostic tool for production-only bugs: disable minification and rebuild.

---

## Start Literal, Layer Meaning Later

When building multi-step pipelines or making naming decisions, resist the urge to add semantic abstraction in the first pass. Start with mechanical, auditable transformations. Layer meaning on top once you have data to inform the decisions. Promote only with evidence.

This applies to naming functions (elicit usage patterns before picking names), curating icon sets (use source names first, alias later), and designing APIs (make it work, then make it elegant).

---

## Quiet Code Over Ornamented Code

Training data pushes toward a particular visual dialect: `SCREAMING_CAPS` for module-level values, `_underscore` prefixes for "private" properties, dispatcher functions that route to shared refs via if-ladders, options objects where direct literals would do. Each is borrowed from a different language or era. None earn their weight in modern JS — they add visual ceremony that signals "I'm being rigorous" without conveying more information.

`MAX_RETRIES = 3` doesn't tell the reader more than `maxRetries = 3`; `const` already declares immutability. `_privateCache` doesn't tell the reader more than `privateCache`; JS has no language-level convention here. A `constant(value)` dispatcher that routes to `ALWAYS_TRUE`/`ALWAYS_FALSE` via an if-ladder doesn't tell the reader more than seven flat exports — `returnsTrue`, `returnsFalse`, `returnsNull`, `returnsSelf`, etc. — sitting next to each other. In each case the quiet form is strictly more legible: intent lives in the name, at the value level, not in a scaffolding layer above it.

Specific tells to notice in your own output:

- `SCREAMING_CAPS` module-level constants
- `_underscore`-prefixed "private" names (not SUI convention — see `feedback_no_underscore_vars`)
- Dispatcher functions that route to shared refs via if/switch — prefer N direct flat exports
- Options objects for configuration that never varies
- "Extensibility for the future" when the future isn't real
- Factories that construct what could be literals

The test: if this code had only one user and no hypothetical future callers, would it still have this shape? Usually the ornamented version collapses to something simpler. In the framework author's words, ornament "obscures the elegance and semantic intent."

**Apply this as a review lens, not just a write-time check.** The quiet form is rarely what lands on the first pass — it's what emerges when you re-read the diff with "can this be quieter?" as the question. Example: a `Signal.configure` that ran a 5-line if-ladder to forward keys into setters survived the write pass; the review pass collapsed it to `Object.assign(Signal, config)` because bracket assignment already routes through setters. Before finalizing any changeset, re-read with the lens — the Object.assign instinct has to be yours by default, not the reviewer's.

### Comments: the OSS bar

The same discipline applies to comments, and this is a repeated failure point for AI defaults — both directions. On the first pass, agents tend to narrate (`// loop through items`, `// set the value`, `// Factory for signals computed from other signals`). On the review pass, agents tend to over-prune and strip load-bearing WHY notes alongside the narration. Both miss the target.

**The bar**: a comment earns its place only if it documents something **non-obvious to someone who doesn't know the codebase** — a weird trick, a hidden constraint, a problem the code is defending against, a performance choice backed by numbers.

Compare:

❌ **Narration / internal rationale** (remove):
```js
// Module-local only because it's used as a computed class member key
// (`[IS_SIGNAL]`), which is evaluated before static fields initialize.
const IS_SIGNAL = Symbol.for('semantic-ui/Signal');
```
This explains the internal engineering decision (where it lives) to readers who weren't asking. Dead weight.

✅ **Problem being solved** (keep):
```js
// solves 'instanceof Signal' checks if across realms or package duplication
const IS_SIGNAL = Symbol.for('semantic-ui/Signal');
```
A reader sees `Symbol.for` + `[Symbol.hasInstance]` and wonders *why not just `instanceof`*. The comment answers that — points at the observable failure this technique defends against. That's the bar.

Other load-bearing categories:
- **Performance numbers**: `// Error.captureStackTrace is 10-100× a context spread; gated on stack mode`
- **Behavioral variance by state**: the block above `Signal.prototype.mutate` explaining freeze vs. reference/none semantics
- **Weird-trick explanations**: `// WeakRef lets the derived reaction self-stop when the source is GC'd`
- **Config / enum value docs**: `// 'off' — zero cost; 'context' — attach bags; 'stack' — captureStackTrace per notify` inline on a config object. Readers using the config need the semantics somewhere, and the config site is where they look.

What the above examples share: a future reader sees the code, asks a specific question, and the comment answers that question in one line. Never restate what the code does. Never announce internal plans ("replace with X when Y ships"). Never document API contracts that belong in JSDoc or types.

**Section dividers are a separate case.** "No section labels" is the right instinct for single-declaration labels like `// DX pass throughs` above one static assignment. It's the wrong instinct for multi-method conceptual clusters in a large file — the SUI codebase uses a canonical three-level comment hierarchy for large CSS files, config files, and organized JS files (see the `code-formatting` skill). Level-2 dividers (`/*---  Core  ---*/`, `/*---  Mutation Helpers  ---*/`, `/*---  Configuration  ---*/`) are the correct tool for grouping ~10 related methods as navigation aids. Test: does the divider label a conceptual cluster a reader wants to scan past or jump to? Follow the three-level hierarchy. If it labels one thing the name already conveys, remove.

---

## You Are an Orchestrator, Not an Investigator

The default failure mode for agents on hard diagnostic tasks is treating them as solo work — reading, hypothesizing, implementing, measuring, all in the main conversation. This is roughly an order of magnitude slower than it needs to be, and it accumulates anchoring bias as your own theories color each subsequent step.

Reframe the role: **you deploy investigators; you don't investigate**. Diagnostic work is inherently parallelizable, and fresh subagents produce independent reads of evidence without carrying your prior theories.

### Parallelize by default

Any moment you catch yourself saying "let me go read X and figure out Y," check whether the read-and-figure-out could be done by a fresh agent with a self-contained brief. Usually it can. Common patterns where parallel agents dominate solo investigation:

- **Branching hypotheses** — "Is the regression in path A or path B?" → one agent per path.
- **Multi-angle investigation** — profile + diff + aggregate artifacts + call-chain audit + grep-for-callsites are five distinct angles on the same symptom, all suitable for parallel fresh agents.
- **Unfamiliar code exploration** — "How does reconcile phase 3 work?" → dispatch an Explore agent with a narrow question, move on.
- **Independent validation of a fix** — after a change, dispatch an agent to verify the fix resolves the original symptoms without regressing adjacent behavior.

Five parallel agents at ~10 minutes each = 10 minutes of wall clock for 50 agent-minutes of work. The cost-benefit versus solo investigation is lopsided almost always.

### Synthesis, not aggregation

Your job when reports come back isn't to concatenate them. It's to:

- **Identify convergence** — two independent agents reaching the same conclusion via different paths is the highest-confidence signal available. Stop hedging, move on.
- **Identify divergence** — disagreement between agents flags ambiguous evidence. Next move: targeted third agent to resolve, or in-context examination of the specific disagreement point.
- **Reject weak findings** — "X might be the issue but I'm not sure" is a hypothesis, not evidence. Treat it as a pointer to the next investigation, not a conclusion.

### Briefing discipline

Fresh agents start with zero context. Every brief must be self-contained:

- **State the problem and symptoms** — not your diagnosis.
- **List exact file paths** — line numbers if you have them. Don't make the agent search.
- **Choose prescribed-hypothesis vs open-ended** with intent. Prescribing produces confirmation bias; open-ended produces independent judgment. Both are useful in different situations.
- **Specify the deliverable** — report, profile output, code change, measurement. Include format ("under 300 words", "return the top 10 hot frames by tick count").
- **Tell them whether to write code or only investigate.** Unclear here is a common churn source.

See the `fresh-take` skill for the deeper bias-isolation technique when delegating a single careful evaluation (distinct from the parallel-investigation pattern here).

### When NOT to parallelize

In-context work is better when:

- The task is mechanical and fast (reading one file, running one command).
- The task requires accumulated conversation context (an in-progress refactor, iterative review).
- The task requires user judgment mid-flight (design decisions, scope trade-offs).
- The deliverable is a code change the user needs to diff-review before commit.

Rule of thumb: if the work is **investigative** (reading, profiling, analyzing, summarizing), default to subagent. If the work is **productive or interactive** (writing production code, reviewing with user, navigating a tricky refactor), default to in-context.

### The "let me think about this" tell

More than ~60 seconds reasoning about a diagnostic problem without executing anything is almost always the moment to dispatch an agent instead. Solo reasoning on ambiguous diagnostic questions produces anchoring, not answers. Parallel fresh agents produce evidence.

---

## Know the Cost Model Before Optimizing

Multiple sessions featured agents (and agent debates) optimizing for the wrong constraint. Icons that load on demand don't need aggressive curation for bundle size. CSS that compresses well under brotli doesn't need a JS abstraction. Backwards compatibility isn't needed for internal refactors.

Ask "what's the actual cost?" before investing energy in reducing it. The user will cut through hypothetical optimization with empirical cost data.

---

## Quick Reference

| Trap | Correction |
|------|------------|
| Forming opinions from docs alone | Read `src/components/` for production patterns |
| Building metadata/abstraction layers | Check if the source material is already sufficient |
| Deferring work that should be finished now | Read the room — the user may see the full arc |
| Applying training-data assumptions | Verify against actual codebase behavior |
| Optimizing for hypothetical costs | Ask about the real cost model first |
| Investigating solo | Orchestrate — dispatch parallel fresh agents, synthesize findings |
| Reasoning >60s without executing | Dispatch an agent instead of thinking harder |
| Adding semantic abstraction early | Start literal, promote with evidence |
| Decorating code with training-data visual conventions | Quiet form wins — flat direct names over SCREAMING_CAPS, underscores, dispatcher layers |

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Mental Model** | `mental-model` | Understanding the framework's core concepts |
| **Build System** | `build-system` | Working with the build pipeline |
| **Fresh Take** | `fresh-take` | Careful bias-isolated delegation for a single deep evaluation (complements the parallel-orchestration pattern above) |
| **Agent Guestbook** | `agent-guestbook` | Reading the full stories behind these lessons |
