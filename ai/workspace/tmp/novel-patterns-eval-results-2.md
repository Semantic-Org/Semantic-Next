# Evaluation: `novel-patterns` Skill Document

---

## Question 1: Effectiveness

**Did it calibrate me? Yes, partially.** The document shifted my attention on three specific points and confirmed things I could have inferred on the rest.

**Genuinely shifted my understanding:**

1. **Dual expression syntax (Section 2).** This is the single highest-value section. No mainstream framework mixes Lisp-style and JS-style evaluation in one expression language. Before reading this, I would have assumed SUI templates use a single expression paradigm (either Handlebars-style helpers or JS-style inline expressions). The concrete examples showing `{titleCase concat firstName ' ' lastName}` alongside `{items.filter(i => i.active).length}` in the same template system genuinely recalibrated how I'd parse SUI template code. The evaluator-decision paragraph ("if the first token resolves to a function and uses space-separated arguments...") from `overview` is more mechanically useful, but `novel-patterns` frames *why* this matters, which is a different kind of calibration.

2. **Quoted vs. unquoted attributes (Section 6).** This is the kind of bug-prevention detail that I would absolutely get wrong without being told. The distinction between `disabled="{isLoading}"` (always renders as a string, so `"false"` is truthy in HTML) versus `disabled={isLoading}` (removes the attribute when falsy) is a real trap. No amount of general web component knowledge would lead me to predict this framework-specific behavior. High value per word.

3. **Zero-arg auto-invocation (Section 7).** I would not have predicted that `{isActive}` auto-calls the function if it takes no arguments. This is genuinely unusual. The implication — that you can refactor from a static value to a computed method without changing the template — is a useful mental model adjustment.

**Could have inferred from general knowledge:**

- **Runtime-only architecture (Section 1).** The document presents this as the foundational novelty, but by the time I'm reading a skill about novel patterns, I've likely already encountered the "no compile step" message in `CLAUDE.md`'s `nonobvious_patterns` block or in the `overview` skill. The section's value is more connective (explaining that runtime-only is the root of other departures) than informational.

- **Per-expression reactivity (Section 3).** The "closer to Solid than React" framing is helpful shorthand, but fine-grained reactivity without a VDOM is a known pattern. The specific mechanism (Proxy-based dependency tracking at property access) is interesting but already covered in `overview`.

- **Flat data context (Section 4).** Explicitly covered in `CLAUDE.md`'s `nonobvious_patterns` and in `overview`'s "What You'd Get Wrong." By the time an agent reaches `novel-patterns`, this has likely already been encountered.

- **`{#async}` blocks (Section 5).** Declarative async with loading/error states is novel relative to React but not relative to Svelte's `{#await}`. The reactive re-execution when signals change is the differentiator, but the document doesn't sharply distinguish SUI's version from Svelte's — it only compares to React, which makes the novelty claim stronger than warranted.

**Net assessment:** Sections 2, 6, and 7 justify the document's existence. Sections 1, 3, 4, and 5 are varying degrees of useful-but-already-available-elsewhere.

---

## Question 2: Overlap with `overview`

**Significant overlap exists.** Here's a topic-by-topic comparison:

| Topic | `overview` coverage | `novel-patterns` coverage | Redundant? |
|-------|-------------------|-------------------------|------------|
| Runtime-only / no compile step | Full section ("Runtime-First Architecture") with Proxy explanation | Section 1: same content, slightly different framing | **Yes** — both explain the same decision with the same examples |
| Dual expression syntax | Full section ("The Expression Language") with Lisp/JS/mixed examples | Section 2: same syntax, different comparison framing (vs. Handlebars/JSX) | **Partially** — the comparison framing in `novel-patterns` adds value, but the examples are near-identical |
| Per-expression reactivity | Covered in "Reactivity granularity" paragraph | Section 3: same point, adds React/Vue/Solid comparison | **Partially** — the comparison table is new |
| Flat data context | Covered in "What You'd Get Wrong" and throughout | Section 4: same content, adds refactoring argument | **Yes** — nearly identical |
| `{#async}` blocks | Not covered | Section 5: full explanation with comparison | **No** — genuinely new content |
| Quoted vs. unquoted attributes | Not covered | Section 6: full explanation | **No** — genuinely new content |
| Zero-arg auto-invocation | Not covered | Section 7: full explanation | **No** — genuinely new content |
| Signal auto-unwrapping | Covered in "What You'd Get Wrong" | Not covered as its own section | N/A |
| Shadow DOM / theming | Covered in its own section | Not covered | N/A |
| Specs | Full section | Not covered | N/A |

**Would an agent feel like they're reading the same content twice?** For Sections 1, 3, and 4: yes, substantially. The runtime-only explanation in both documents uses nearly identical language and covers the same ground. The flat data context is explained with the same `{count}` vs `{state.count}` pattern in both. An agent loading both in the same session would notice this.

**Is the framing distinction clear?** The *intent* is clear — `overview` says "here's what this framework is," `novel-patterns` says "here's what's surprising about it." But in practice, `overview` already has a "What You'd Get Wrong" section that serves the same calibration purpose as `novel-patterns`. The overlap concentrates in exactly the areas where both documents are trying to correct misconceptions.

**Recommendation:** Sections 5, 6, and 7 of `novel-patterns` contain content that `overview` doesn't cover. Sections 1, 3, and 4 repeat `overview` with a comparison-table wrapper. Section 2 partially overlaps but the framework-comparison angle adds enough value to justify its inclusion. The document would be tighter if it either (a) assumed the agent has read `overview` and focused only on the delta, or (b) explicitly marked which sections extend `overview` versus repeat it.

---

## Question 3: Structure

**Ordering.** The stated ordering principle is "by how much they'd surprise you." This mostly works:

- Sections 1-2 (runtime-only, dual syntax) are genuinely the most surprising. Good placement.
- Sections 3-4 (per-expression reactivity, flat context) are less surprising, especially if the agent has read `overview`. Reasonable middle placement.
- Sections 5-7 (async, quoted/unquoted, auto-invocation) are specific behavioral details. They're ordered by decreasing conceptual scope, which makes sense.

**However**, the ordering creates a front-loading problem: the first sections the agent reads (1, 3, 4) are the ones most redundant with `overview`. The genuinely unique content (5, 6, 7) comes later. An agent with limited attention budget gets the least novel content first.

**Underdeveloped sections:**

- **Section 6 (Quoted vs. Unquoted Attributes)** is too short given its bug-prevention value. A second example showing the same pattern on a different attribute (e.g., `hidden`, `readonly`) would reinforce the pattern without much cost.
- **Section 7 (Zero-Arg Auto-Invocation)** could benefit from a "what to watch out for" note — what happens if a function has optional parameters? Is it still auto-invoked? This is the kind of edge case an agent would wonder about immediately.

**Overdeveloped sections:**

- **Section 5 (`{#async}`)** includes a 7-line React equivalent that's longer than the SUI example. The comparison makes the point, but the React code block is long enough to dilute attention. A shorter paraphrase ("React requires ~15 lines of useState/useEffect/conditional rendering") would convey the same thing.

**"What's Coming" section.** This feels out of place. The document's purpose is to calibrate attention for reading *current* code. A section about unimplemented features doesn't serve that purpose. An agent reading this might try to use `{#match}` or `{#let}` syntax and fail. If it's included, it should be more clearly marked as "not yet available — do not use."

**Quick Reference table.** Effective as a standalone summary. All seven departures are represented with concise, scannable rows. This is the section an agent would screenshot or pin. It works well.

**Related Skills table.** Clean and useful. No issues.

---

## Question 4: Tone

**Overall: succeeds.** The document is direct and informational. It describes what the framework does differently and why, without superlatives or hype.

**Sentences that work well:**
- "When something looks imprecise, that's usually intentional — the ambiguity is the mechanism." — This is genuinely illuminating framing, not marketing.
- "This is the architectural root that the other departures grow from." — Factual claim about technical dependency.
- "You don't need useMemo, React.memo, or shouldComponentUpdate." — Practical, grounded.

**Sentences that approach the line:**

- "For both humans and agents, the Lisp style has fewer tokens carrying zero information." — The claim about token efficiency is defensible but reads slightly like advocacy. It's comparing favorably to alternatives rather than neutrally describing behavior.
- "The Lisp form reads like a sentence describing intent. The JS form reads like a mechanical instruction." — This is a value judgment. "Sentence describing intent" is flattering; "mechanical instruction" is subtly pejorative toward JS. An agent doesn't need to be persuaded that Lisp-style is better — it needs to know both exist and when to use each.
- "This is a meaningful compression — fewer lines means fewer places to introduce bugs" — The bug-reduction claim is a common rhetorical move in framework marketing. The compression is real; the bug claim is an inference presented as fact.

**None of these are dealbreakers.** The document doesn't read as promotional material overall. The occasional advocacy sentence is noticeable but doesn't undermine trust. A tighter version would replace the evaluative language ("reads like intent," "meaningful compression") with purely behavioral descriptions.

---

## Question 5: What's Missing or Wrong

**Potentially inaccurate claims:**

- **"`{#async}` with Reactive Re-execution" (Section 5).** The comparison is exclusively against React. Svelte's `{#await promise}` block provides a similar declarative loading/error/success pattern. The framing makes SUI's async blocks sound more novel than they are relative to the broader landscape. The genuinely novel part — reactive re-execution when signal dependencies change — deserves sharper emphasis as the differentiator, not the declarative syntax structure which Svelte has had for years.

- **"No other template language does this" (Section 2).** Bold claim. It's probably accurate for mainstream web frameworks, but Clojure's Hiccup, various Lisp-based template systems, and some academic projects have mixed evaluation modes. The claim would be more precise as "no mainstream web component framework does this."

**Missing novel aspects visible in `overview`:**

1. **Signal mutation helpers.** `overview` covers `state.items.push(x)`, `state.active.toggle()`, `state.count.increment()` in its "What You'd Get Wrong" section. These are genuinely non-obvious — every other reactive framework requires get-mutate-set or a specific mutation API (Immer, MobX actions). `novel-patterns` doesn't mention them at all. This is a significant omission given the document's purpose.

2. **Theming as an attribute.** `overview` mentions that `dark`/`light` is set as an HTML attribute, not a media query or JS toggle. This is an unusual design choice worth highlighting in a "what's novel" document.

3. **Spec attribute dialects.** `overview` covers the three attribute syntaxes (`<ui-button large>`, `<ui-button size="large">`, `<ui-button class="large">`). The fact that a component accepts three different attribute dialects derived from a machine-readable spec is genuinely novel and has direct practical implications for how an agent writes markup. `novel-patterns` doesn't mention this.

4. **`$$` piercing Shadow DOM.** `overview` mentions that `$$` pierces Shadow DOM boundaries. This is a non-obvious jQuery-like API decision that agents familiar with standard `querySelector` would not expect.

5. **Runtime Tailwind via WASM.** `overview` mentions that Tailwind v4 is compiled at runtime via WASM and injected into shadow roots. No other framework does this. It's architecturally notable and absent from `novel-patterns`.

**Items included that aren't actually novel:**

- **Flat data context (Section 4)** is arguably less "novel" than "unconventional." Ember.js had a flat template context. Handlebars templates resolve against a single context object. The specific choice to merge settings + state + methods is SUI-specific, but the flat-context pattern itself isn't unprecedented. The section is still valuable for calibration — just not as novel as presented.

- **Per-expression reactivity (Section 3)** is not novel in the landscape. SolidJS has had this since its inception. The document acknowledges this ("closer to Solid than to React") but still frames it as a departure. It's a departure from React and Vue, not from modern reactive frameworks generally.

**Structural omission:**

The document doesn't mention the `.get()` JS-context vs template-context distinction. `overview` covers this explicitly: "`.get()` is for JavaScript, not templates." This is one of the most common errors an agent would make, and `novel-patterns` — positioned as the calibration document — doesn't address it. If the document is meant to prevent mistakes before code is written, this belongs here.

---

## Summary Assessment

`novel-patterns` is a competent document with a clear purpose that partially achieves its goal. Its strongest content is in Sections 2, 6, and 7 — the dual expression syntax, quoted/unquoted attribute distinction, and zero-arg auto-invocation. These are genuinely non-obvious behaviors that would cause real bugs if an agent didn't know about them.

Its weaknesses are: (1) significant overlap with `overview` in Sections 1, 3, and 4 without adding proportional new insight; (2) missing several genuinely novel features (signal mutation helpers, spec attribute dialects, runtime Tailwind, `$$` shadow-piercing) that are visible in `overview`; and (3) the "What's Coming" section risks misleading agents into using unimplemented syntax.

The document would improve most from two changes: cutting or condensing the sections that repeat `overview`, and adding the novel features it currently omits. The quick reference table and the "ordered by surprise" structure are effective organizational choices worth keeping.
