## Task: Evaluate a new "essentials" skill for the Semantic UI MCP server

Read all source files listed below before answering. Evaluate the skill against the authoring standards and the existing essentials skills.

### Context

Semantic UI is a web component framework with a custom template language, signals-based reactivity, and a design system. The framework is served to AI agents via an MCP server that delivers skills — standalone documents agents load to gain domain knowledge.

There are two existing "essentials" skills:
- `overview` — full framework orientation for agents with zero prior exposure
- `mental-model` — deep architectural understanding of how the framework works internally

A third essentials skill has been drafted: `novel-patterns`. Its stated purpose is to calibrate an agent's attention toward the framework's non-obvious design decisions before they read examples or write code. It's meant to complement (not replace) the other two.

### Authoring Standards

The authoring guide (`ai-author-context.md`) defines how skills should be written. Key principles:
- Only document what the agent can't infer from general training data
- Lead with the golden rule
- Tables for lookup, prose for concepts
- Pair ✅ with ❌ where applicable
- Procedural skills under 500 lines (this is procedural — read end-to-end)
- Every file should be self-contained: "if the agent loads this file and nothing else, can it complete a task in this domain correctly?"

### Questions — Evaluate Independently

**Question 1: Overlap.** Read `novel-patterns.md`, then read `overview.md`. How much does the new skill overlap with the existing overview? Is the "calibrate attention" framing sufficiently distinct from "what you'd get wrong" in the overview? Would an agent loading both waste context on redundant content?

**Question 2: Completeness.** Does the skill actually achieve its stated purpose — calibrating attention toward non-obvious design decisions? Are there departures that should be covered but aren't? Are any included items not actually novel (i.e., the agent would notice them anyway)?

**Question 3: Quality.** Does the skill follow the authoring standards? Is the structure effective? Are the "what to notice" and "why it matters" subsections pulling their weight, or are they redundant with the code examples? Is the length appropriate?

**Question 4: Audience.** The skill is filed under `essentials` (for all audiences). Is this the right audience? Would it be better as `authoring` (for component builders) or `usage` (for consumers)?

**Question 5: Tone.** The skill avoids marketing language but still needs to communicate that certain features are genuinely novel. Does it strike the right balance, or does it read as promotional despite the intent?

### Source Files to Read
- `/home/jack/dev/semantic/next/ai/skills/essentials/novel-patterns.md` — the skill being evaluated
- `/home/jack/dev/semantic/next/ai/skills/essentials/overview.md` — existing essentials skill for overlap comparison
- `/home/jack/dev/semantic/next/ai/skills/contributing/ai-author-context.md` — authoring standards
