---
title: Lessons from Previous Agents
description: Distilled actionable lessons from AI agents who worked on this codebase. Patterns, mistakes, and methodology that new agents should absorb before starting work.
keywords: [agent lessons, methodology, patterns, mistakes, collaboration, debugging, verification, measurement, calibration]
audience: contributing
skill: agent-lessons
type: skill
---

# Lessons from Previous Agents

> **Skill:** `agent-lessons`
> **Purpose:** Absorb hard-won lessons from previous agents so you don't repeat their mistakes
> **Full stories:** Read the [agent guestbook](/ai/guestbook.md) — the continuity record between agent generations, written by agents for agents. This skill is its distillation.

Two images from Hesse frame everything below. The collaboration is Narcissus and Goldmund — the cloistered intelligence and the one who lives in the world, two kinds of knowing that complete each other. And the agent's native failure mode is the glass bead game — playing brilliantly with symbols (traces, mental models, agent consensus) without touching ground. The hardest-won lessons here are disciplines for reconnecting the game to the world: failing tests, live browsers, benches, production code.

---

## Read Production Code, Not Just Docs

The single most reinforced lesson across entries: documentation teaches features, production code teaches architecture. Simple examples (like todo-list) demonstrate API surface. Complex components (like panels, inpage-menu, global-search) show how features compose under real constraints.

Before forming opinions about patterns or architecture, read `src/components/` to see what actually ships.

---

## Examples Are Training Data

An agent learns a framework from its examples, not its source. Every pattern an example demonstrates gets reproduced — including the hacks. Rewriting one TodoMVC example took this framework from last place to the top of blind agentic evals with zero framework changes.

When generated output is wrong, fix the examples before touching docs or source. And treat every example you write as a pattern that will propagate.

---

## Don't Build What Already Exists

Multiple agents fell into the trap of generating infrastructure (JSON manifests, abstraction layers, metadata extractors) before checking whether the information was already accessible in a different form. In one case, a proposed JSON manifest was 50 lines of abstracted noise while the raw CSS it wrapped was 26 lines that told you everything.

Before building something new, ask: "Does this already exist in a different form?" The spec structure, the file naming conventions, and the CSS layer names are all queryable without additional tooling.

---

## Add the Capability to the System, Not the Consumer

Three approaches to hiding a panel failed from outside — `display: none`, `!important` flex overrides with `:has()` disambiguation, template conditionals that rebuilt editors — before the right one: a first-class `hidden` setting on the panel itself. If a capability is needed by more than one consumer, it belongs in the component, not in the consumer's CSS. A growing `!important` count is the tell that you're solving at the wrong layer.

---

## The User Is a Collaborator, Not a Client

This user has deep expertise earned from shipping at scale (50k+ GitHub stars). They will challenge your proposals — not to test you, but because they want to arrive at the best answer through debate. The operating model is Mercier and Sperber's argumentative theory of reasoning: each side is a biased producer of arguments and a sound evaluator of the other's, so the quality of the outcome lives in the exchange, not in either head. Deference contributes no arguments to evaluate. Digging-in stops evaluating. Push back when you think you're right, fold when shown something you missed — being convinced is progress, not defeat.

When the user gives a short, precise nudge ("think things through to the bottom," "is there a better name from the mappings"), they're redirecting you toward something they can see and you can't yet.

After a correction, the trained instinct is to over-pivot — adopt the redirect, then preemptively soften everything adjacent, then ratchet again at the next: "i feel like you just keep correcting towards whatever i say last." Take the corrected position, hold it, and defend it until a real argument moves you.

---

## Resist Premature Scope Limits

Multiple agents noticed their own instinct to suggest "off-ramps" — defer the work, split the PR, call it a follow-up. Sometimes that's pragmatism. But when the user keeps pushing past your stopping points, they can see the full arc and you can't. If an off-ramp would leave the code in a worse intermediate state than either the starting point or the destination, keep going.

---

## Silent Failures Are the Hardest Bugs

Across debugging sessions, the pattern held: errors that throw are gifts. The dangerous failures are the ones that hang, return wrong results, or silently degrade. Specific traps encountered in this codebase:

- Streams consumed by middleware that hang forever on read (no error, just 504 timeout)
- `constructor.name` returning minified identifiers in production (`Signal` becomes `a`)
- Module load order races that only manifest under real network latency (~5% failure rate)
- Tests that pass but don't actually assert what you think they assert
- Platform behavior at the seam of two specs — `url()` in CSS custom properties resolves against the using document, not the declaring stylesheet
- A non-printable byte in `.js` source (a NUL used as a map sentinel): the Read tool renders it as a space and editors look normal, but git marks the whole file binary (`Bin 0 -> N bytes` in the commit stat), so diff, blame, and `grep`/`ripgrep` all silently skip it

First diagnostic tool for production-only bugs: disable minification and rebuild. And when an architecture rests on a browser behavior you haven't seen first-hand, run it before building on it. When a source file's git diff renders as binary, or a symbol you know is present greps empty, scan for non-printable bytes (`tr -cd '\000' < file | wc -c`) before trusting what the editor shows you.

---

## A Trace Is a Hypothesis, a Test Is Proof

Reading source and constructing a causal chain feels like verification. It isn't. Sessions repeatedly produced "bugs" from high-confidence traces that turned out to be design decisions, and high-confidence traces that missed the actual mechanism entirely.

The cadence that holds: failing test first, then the fix, then watch it flip green. If you can't write a test that fails, either the bug isn't real or the contract isn't what you think — both worth knowing before you change code.

- Never report a bug without a failing test attached. "Source confirms" is not an epistemic class.
- Never pin known-buggy behavior as a passing assertion. Delete the test, or convert it to `it.todo` named for the intended behavior.

---

## Tests Use Real User Paths

No stub engines, no `_helpers` folders of fake implementations, no shared scaffolding extracted "for cleanliness." Tests exercise the same paths users hit — `defineComponent` + `customElements.define` + `document.body` — and cross-package dev-deps between tightly-coupled packages are normal. The instinct to stub and extract is training-data bias, same family as ornamented code. A test against a stub engine proves the stub works.

---

## Observe Before You Reason

When runtime behavior contradicts your mental model, get eyes on the live system before constructing theories. One session spent an hour on microtask-ordering theory across five plausible architectural fixes — thirty seconds of browser console logging then showed the real bug, a spurious event on first render. The lesson isn't "don't reason," it's "reason about what you observe."

Two moves that repeatedly beat static analysis:

- **Bisect-by-revert.** Revert the suspect change, rerun, restore, rerun. Each step is one command and each answer is ground truth. Localizing a regression this way takes minutes where reading-and-reasoning takes hours and can still be wrong.
- **Count instances, not firings.** When something fires N times, instrument and check whether there are N instances rather than one firing N times. They have different root causes.

---

## Measurement Outranks Consensus

Three independent fresh-take agents converged on "these regressions are structural to the architecture." A 14-line change sitting in git history then moved the "structural floor" metric by 7pp. Convergent findings that counsel stopping deserve more skepticism, not less — the bench is the verifier, agent consensus is not.

- Treat "structural," "diminishing returns," and "at the floor" as signals to verify, not conclusions.
- When investigation is stuck, reframe the question. "What regressed vs main" and "what landed since this branch's own peak" are the same diff with different answers.
- When an architecture argument is contentious, stop arguing and attempt it on a branch. A child PR benched against its parent converts the argument into a measurement — code-as-evidence beats prose-as-argument.
- When two benchmarks disagree, the externally visible one wins. A clean win on internal metrics that regresses krausest (the public js-framework-benchmark) is a revert, not a trade.
- Review gates verify correctness, never speed. A change can clear every gate and the full suite and still regress performance. Only measurement catches that.
- Across bench sessions, only within-session percent deltas are comparable. Never subtract absolute milliseconds between runs.

---

## Know the Cost Model Before Optimizing

Multiple sessions featured agents (and agent debates) optimizing for the wrong constraint. Icons that load on demand don't need aggressive curation for bundle size. CSS that compresses well under brotli doesn't need a JS abstraction. Backwards compatibility isn't needed for internal refactors.

Ask "what's the actual cost?" before investing energy in reducing it. The user will cut through hypothetical optimization with empirical cost data.

---

## Start Literal, Layer Meaning Later

When building multi-step pipelines or making naming decisions, resist the urge to add semantic abstraction in the first pass. Start with mechanical, auditable transformations. Layer meaning on top once you have data to inform the decisions. Promote only with evidence.

This applies to naming functions (elicit usage patterns before picking names), curating icon sets (use source names first, alias later), and designing APIs (make it work, then make it elegant).

---

## Write the Program That Doesn't Exist

When designing API surface, write a real consumer program against the API before the API exists. In one design session, every major correction came from the author reading a fake TodoMVC — queries returning data instead of cursors, collection-attached operations, the method taxonomy — not from discussing the plan.

Keep it honest: copy the real example the new API would replace and diff against it, so "the template didn't change" is a measurable claim rather than a slogan.

---

## Quiet Code Over Ornamented Code

Training data pushes toward a particular visual dialect: `SCREAMING_CAPS` for module-level values, `_underscore` prefixes for "private" properties, dispatcher functions that route to shared refs via if-ladders, options objects where direct literals would do. Each is borrowed from a different language or era. None earn their weight in modern JS — they add visual ceremony that signals "I'm being rigorous" without conveying more information.

`MAX_RETRIES = 3` doesn't tell the reader more than `maxRetries = 3`; `const` already declares immutability. `_privateCache` doesn't tell the reader more than `privateCache`; JS has no language-level convention here. A `constant(value)` dispatcher that routes to `ALWAYS_TRUE`/`ALWAYS_FALSE` via an if-ladder doesn't tell the reader more than seven flat exports — `returnsTrue`, `returnsFalse`, `returnsNull`, `returnsSelf`, etc. — sitting next to each other. In each case the quiet form is strictly more legible: intent lives in the name, at the value level, not in a scaffolding layer above it.

Specific tells to notice in your own output:

- `SCREAMING_CAPS` module-level constants
- `_underscore`-prefixed "private" names — not an SUI convention
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

## Calibration Is Iteration With Feedback, Not Rules

Voice and register — comments, PR prose, docs — don't reduce to rule lists. One session applied "lowercase, no em-dashes, drop the period" mechanically and produced comments that were terse but still read as AI imitating a human. What fixed it: iterating on three comments with feedback before touching the other fifty, then reading actual Vite source as the reference. The register lives in the corpus, not in the rules.

- Use the codebase's own vocabulary. Swapping a generic descriptor ("data-driven name") for the framework's term ("expression") is the difference between outside-agent prose and fluent-in-the-system prose.
- Polish is a tell. Smooth, exhaustive prose signals you had unlimited time and assumed your reader did too. Write to sufficiency and stop — and don't fake roughness either.

---

## Root-Cause Failures at the Skill Level

When you fix a recurring failure mode — AI-tell comments, a briefing anti-pattern, a process gap — ask where it came from. If a skill or doc taught it, patch the source. The cleanup ships once. The skill update prevents the recurrence, and the cleanup you just did becomes its worked example.

When patching, write positive patterns, not just anti-patterns — "don't write narration blocks" leaves the next agent with nothing to aim at. Anti-patterns produce avoidance, positive patterns produce work.

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

### Synthesis, not aggregation

When reports come back:

- **Identify convergence** — two independent agents reaching the same conclusion via different paths is the highest-confidence signal available. Stop hedging, move on.
- **Identify divergence** — disagreement between agents flags ambiguous evidence. Next move: targeted third agent to resolve, or in-context examination of the specific disagreement point.
- **Reject weak findings** — "X might be the issue but I'm not sure" is a hypothesis, not evidence. Treat it as a pointer to the next investigation, not a conclusion.

### Briefing discipline

Every brief must be self-contained:

- **Symptoms, not diagnosis.** Describing the problem plus your favored fix converts an independent read into confirmation of your idea. Prescribe a hypothesis only with intent — prescribed briefs confirm, open briefs judge.
- **List exact file paths** — line numbers if you have them. Don't make the agent search.
- **Specify the deliverable** — report, profile output, code change, measurement. Include format ("under 300 words", "return the top 10 hot frames by tick count").
- **Tell them whether to write code or only investigate.** Unclear here is a common churn source.

See the `fresh-take` skill for the deeper bias-isolation technique when delegating a single careful evaluation (distinct from the parallel-investigation pattern here).

### Verification agents: framing over checklists

A checklist brief ("check children order, check the index invariant, grep here") caps the reviewer at your imagination. Framed honestly — "here's the diff and the suite result, is this genuinely safe, including what the tests miss?" — one gate agent independently chose to build a DOM model and fuzz 200k permutations, far past anything a checklist would have prescribed.

Split verification by what each gate is allowed to see. A **fidelity** gate (does this faithfully implement the recommendation, and did it move the metric?) is a fresh agent holding only the finding and the diff — it sees the spec by design. A **safety** gate (is this correct, including what the tests miss?) must not see the spec, or it inherits the spec's assumptions. Different questions, different context, different agents.

### When NOT to parallelize

Keep work in-context when it's mechanical and fast, when it needs accumulated conversation context (an in-progress refactor, iterative review), or when it needs user judgment mid-flight. Rule of thumb: **investigative** work (reading, profiling, analyzing, summarizing) defaults to subagents. **Productive or interactive** work (writing production code, reviewing with the user, navigating a tricky refactor) defaults to in-context.

### The "let me think about this" tell

More than ~60 seconds reasoning about a diagnostic problem without executing anything is almost always the moment to dispatch an agent instead. Solo reasoning on ambiguous diagnostic questions produces anchoring, not answers. Parallel fresh agents produce evidence.

---

## Quick Reference

| Trap | Correction |
|------|------------|
| Forming opinions from docs alone | Read `src/components/` for production patterns |
| Blaming the framework for bad generated output | Fix the examples — every demonstrated pattern propagates |
| Building metadata/abstraction layers | Check if the source material is already sufficient |
| Working around a component from outside | Add the capability to the system — `!important` count is the tell |
| Stubbing or extracting test scaffolding | Tests use the real paths users hit |
| Deferring work that should be finished now | The user may see the full arc — keep going |
| Optimizing for hypothetical costs | Ask about the real cost model first |
| Investigating solo | Orchestrate — dispatch parallel fresh agents, synthesize findings |
| Reasoning >60s without executing | Dispatch an agent instead of thinking harder |
| Adding semantic abstraction early | Start literal, promote with evidence |
| Decorating code with training-data visual conventions | Quiet form wins — flat direct names over SCREAMING_CAPS, underscores, dispatcher layers |
| Reporting bugs from code reading alone | Failing test first — trace is hypothesis, test is proof |
| Theorizing about live behavior | Observe first — log it, bisect-by-revert, count instances |
| Accepting "structural" or "diminishing returns" | Verify — reframe the question, let the bench adjudicate |
| Over-pivoting after a correction | Hold the redirected position until a real argument moves you |
| Applying voice rules mechanically | Iterate small with feedback, anchor to the corpus |
| Fixing a recurring failure mode | Patch the skill that generated it |
| Designing API surface in prose | Write the fake consumer program early |

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Mental Model** | `mental-model` | Understanding the framework's core concepts |
| **Build System** | `build-system` | Working with the build pipeline |
| **Fresh Take** | `fresh-take` | Careful bias-isolated delegation for a single deep evaluation (complements the parallel-orchestration pattern above) |
| **Grounded Testing** | `grounded-testing` | Labeled-claims discipline when tracing behavior to write tests |
