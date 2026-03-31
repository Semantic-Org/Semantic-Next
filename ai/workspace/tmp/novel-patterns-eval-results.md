# Evaluation: `novel-patterns` Skill

## Question 1: Overlap

The overlap between `novel-patterns` and `overview` is significant but not disqualifying. The specific areas of duplication:

| Topic | `overview` treatment | `novel-patterns` treatment |
|-------|---------------------|---------------------------|
| Flat data context | 6-line code block + 3-line explanation in "What You'd Get Wrong" | 3-line code block + 2 paragraphs ("What to notice" / "Why it matters") |
| Signal auto-unwrapping | 4-line code block + note about Proxy in "What You'd Get Wrong" | 2-line code block + paragraph about Proxy operating at the language level |
| Dual expression syntax | Full section (~25 lines of examples + explanation) under "The Expression Language" | Full section (~14 lines of examples + explanation) as departure #1 |
| `createComponent` flat namespace | 1 line in "What You'd Get Wrong" | Full section as departure #7, with code example |

The `overview` already covers flat context, signal unwrapping, dual expressions, and the runtime Proxy thesis in substantial detail. The `novel-patterns` skill re-teaches these same concepts with a different framing ("what's novel" vs. "what you'd get wrong") but the actual content a model internalizes is nearly identical.

**The "calibrate attention" framing is not sufficiently distinct from "what you'd get wrong."** Both framings answer the same question: "what would I miss if I pattern-matched to mainstream frameworks?" The overview's "What You'd Get Wrong" section is already explicitly about correcting false priors. The novel-patterns skill repackages this with "What to notice" / "Why it matters" subsections, but the delta in what the agent actually learns is small.

**Context waste estimate:** An agent loading both files would encounter the flat-context concept 3 times (overview "What You'd Get Wrong," overview "Expression Language" section, novel-patterns departure #2), signal unwrapping twice, and dual expressions twice. Roughly 40-50% of `novel-patterns` is redundant with `overview` by content, even though the framing differs.

**What novel-patterns adds that overview doesn't:** Departures #3 (async reactive re-execution), #4 (quoted vs. unquoted boolean attributes), #6 (zero-arg auto-invocation), and the "What's Coming" table. These are genuinely non-overlapping. The async block example with signal-driven re-execution is particularly valuable and absent from `overview`.

**Verdict:** The skill has a legitimate reason to exist, but needs deduplication. The unique content (async, boolean attributes, zero-arg invocation, upcoming features) justifies a standalone file. The overlapping content (flat context, signal unwrapping, dual expressions) should be trimmed to brief reminders that reference `overview` rather than re-teaching.

---

## Question 2: Completeness

**Does it achieve its stated purpose?** Partially. The skill's purpose is to "calibrate attention toward non-obvious design decisions." It succeeds for template-language decisions (dual syntax, flat context, async blocks, boolean attributes, zero-arg invocation). It under-covers other areas.

**Departures that should be covered but aren't:**

1. **Runtime-only architecture (no compile step).** This is arguably the single most novel design decision in the entire framework. The overview covers it well, but if `novel-patterns` is the "calibrate attention" skill, the absence of a compile step should at least be mentioned. An agent encountering SUI will assume there's a build plugin or compiler like Svelte/Vue. The overview notes this, but novel-patterns doesn't even acknowledge it.

2. **Reactivity granularity: per-expression, not per-component.** The overview states this explicitly: "closer to Solid than to React." This is a major departure from React/Vue mental models where re-renders are component-scoped. The novel-patterns skill omits it entirely.

3. **The spec system and attribute dialects.** Three ways to express the same attribute (`large`, `size="large"`, `class="large"`) is genuinely novel. The overview covers it. Novel-patterns doesn't mention it at all, despite this being exactly the kind of thing an agent would get wrong.

4. **`reaction()` with auto-tracked dependencies.** The overview mentions this briefly. It's a departure from React's explicit dependency arrays and Vue's explicit `watch` targets. Worth a mention in a "novel departures" skill.

5. **Shadow DOM as default, theming via attribute.** The `dark`/`light` attribute-based theming is unusual. Most frameworks use class conventions or media queries.

**Items included that aren't actually novel:**

- **Departure #7 (createComponent props as flat data)** is a consequence of departure #2 (flat data context) and #6 (zero-arg auto-invocation). It doesn't introduce a new concept — it shows how two earlier concepts combine. It's not wrong to include, but it feels like padding. A sentence in departure #2 would suffice.

- **Departure #5 (signal auto-unwrapping)** is well-covered by the overview and is common enough in modern frameworks (Solid, Vue refs in templates) that it's not deeply novel. The Proxy-based mechanism is novel, but the user-facing behavior (signals resolve in templates) isn't surprising.

**Verdict:** The skill is template-language-heavy and architecture-light. It covers 7 departures, of which ~4 are genuinely novel and non-overlapping with overview. But it misses the runtime-only thesis and per-expression reactivity, which are arguably the two most surprising things about the framework.

---

## Question 3: Quality

**Authoring standards compliance:**

| Standard | Compliance | Notes |
|----------|-----------|-------|
| Only document what the agent can't infer | Mostly yes | Signal unwrapping is partially inferable from modern framework training data |
| Lead with the golden rule | Yes | The golden rule about natural language fuzziness is stated immediately after the header |
| Tables for lookup, prose for concepts | Yes | "What's Coming" uses a table appropriately; departures use prose |
| Pair checkmark with X | No | The skill uses zero checkmark/X pairs. Every departure uses only positive examples. This is a clear deviation from the authoring guide |
| Under 500 lines (procedural) | Yes | The file is ~142 lines, well within limit |
| Self-contained | Partial | An agent loading only this file would understand the novel template patterns, but would lack the component model, lifecycle, and reactivity system needed to write code. The skill says "read before reviewing examples or writing code" but doesn't teach enough to actually write code. This is acceptable if the purpose is strictly calibration, not enablement |
| Blockquote header | Yes | Present and well-formatted |
| Related Skills table | Yes | Present with appropriate links |
| Quick Reference | No | Not present. At 142 lines the authoring guide says files over ~100 lines should have one. Borderline |

**Structure effectiveness:** The "ordered by how much they'd surprise you" framing is effective and gives the agent a clear reading priority. The numbered departures are easy to scan.

**"What to notice" / "Why it matters" subsections:** These are present on departures #1-3 but absent on #4-7. The inconsistency is noticeable. Where they do appear, they pull their weight — the "Why it matters" on departure #1 (comparing paren counts) is genuinely useful. The "What to notice" on departure #2 (refactoring without template changes) communicates real value. But departure #4 onward drops these subsections without explanation, making the later departures feel less developed.

**Missing checkmark/X pairs:** The authoring guide says "the agent learns more from the contrast than from either example alone." This skill could benefit significantly from showing the wrong way (the React/Vue/Svelte equivalent) alongside the SUI way, especially for departures #3 (async) and #4 (boolean attributes). Departure #4 actually has a natural pair (quoted vs. unquoted) but doesn't use the checkmark/X convention.

**Verdict:** Good structure, appropriate length, effective golden rule. Falls short on checkmark/X pairing and consistency of subsections across departures.

---

## Question 4: Audience

The skill is filed under `essentials` (for all audiences). The audience definitions from the authoring guide:

- `essentials` — Core concepts for all audiences
- `authoring` — Developers building components with SUI
- `usage` — Developers using SUI components

**Analysis:** The content is heavily weighted toward component authoring concerns. Departures #6 (zero-arg auto-invocation) and #7 (createComponent props) are only relevant to component authors. Departure #3 (async blocks) is relevant to both authors and users but requires understanding template authoring. Departures #1 (dual expressions), #2 (flat context), #4 (boolean attributes), and #5 (signal unwrapping) apply broadly.

However, the stated purpose — "calibrate attention before reading code" — is genuinely audience-agnostic. An agent using SUI components needs to understand flat context and dual expressions just as much as an agent building them. The "What's Coming" section is also relevant to all audiences.

**`essentials` is the right audience.** The content is a mix of authoring and usage concerns, and the calibration purpose applies to all agents. Moving it to `authoring` would hide it from usage-focused agents who need the same calibration. The authoring-heavy departures (#6, #7) are the weakest content anyway and could be trimmed.

---

## Question 5: Tone

The golden rule paragraph is the riskiest section tonally: "natural language's fuzziness is a feature, not a bug" and "the ambiguity is the mechanism" walk the line between explaining a design philosophy and promoting it. On balance, this reads as architectural explanation rather than marketing — it's describing a concrete design thesis that has observable consequences in the code (the attribute dialects, the expression evaluator's dispatch logic).

**Specific assessments:**

- "No other template language does this" (departure #1) — factual claim, not promotional. It's accurate and useful for calibration.
- "This is a class of bug that agents and humans make constantly in other frameworks" (departure #4) — slightly promotional in tone. Could be rephrased as "This is a common bug source in frameworks where boolean attribute handling isn't syntax-level."
- "The React equivalent is ~15 lines" (departure #3) — comparative, but grounded in a specific claim. The comparison serves calibration ("this is genuinely different") rather than promotion ("this is better").
- "For both humans and agents, the Lisp style has fewer tokens carrying zero information" (departure #1) — this is an analytical observation, not marketing.

**Overall:** The tone is appropriate. It communicates novelty through concrete comparisons and factual claims rather than superlatives or value judgments. The one line that edges toward promotional is the boolean attributes comment, but it's mild.

---

## Summary of Recommendations

1. **Deduplicate with overview.** Trim departures #2 (flat context) and #5 (signal unwrapping) to 2-3 line reminders with a pointer to `overview`. Keep the "Why it matters" on flat context (the refactoring insight is unique to this file) but cut the code examples that repeat overview verbatim.

2. **Add missing departures.** The runtime-only/no-compile-step architecture and per-expression reactivity granularity are more surprising than several included items. At minimum, add a brief departure for the no-compile thesis.

3. **Add checkmark/X pairs.** The authoring guide requires these and they'd strengthen the calibration purpose. Departure #4 (boolean attributes) is a natural fit. Departure #3 (async) could show the React useEffect equivalent as the X case.

4. **Make subsection structure consistent.** Either add "What to notice" / "Why it matters" to departures #4-7 or remove them from #1-3 and fold the insights into the prose. The inconsistency suggests the later departures were written in a hurry.

5. **Consider merging departure #7 into #2.** The createComponent flat data departure is a consequence of flat context, not an independent design decision.

6. **Keep under `essentials`.** The audience is correct.

7. **Add a Quick Reference.** A condensed table mapping "If you assume X (from React/Vue/Svelte), SUI actually does Y" would serve as both a quick reference and a natural home for checkmark/X pairs.
