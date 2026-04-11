## Task: Evaluate a skill document for an AI-facing MCP server

Read all source files listed below before answering. Evaluate the skill on its own merits as a document that will be served to AI agents via a tool call.

### Context

Semantic UI is a web component framework with a custom template language, signals-based reactivity, and a design system. The framework is served to AI agents via an MCP server that delivers "skills" — standalone documents agents load to gain domain knowledge before working on tasks.

There are two existing foundational skills:
- `overview` — full framework orientation for agents with zero prior exposure
- `mental-model` — deep architectural understanding of how the framework works internally

A third foundational skill has been drafted: `novel-patterns`. Its stated purpose is to calibrate an agent's attention toward the framework's non-obvious design decisions before they read examples or write code. It's meant to complement (not replace) the other two.

### How the document reaches the agent

The agent calls `use_skill('novel-patterns')` via MCP and receives the full file content as a tool result. The file lands as a standalone document with no surrounding repository context. The agent has explicitly requested it, so it will attend to it — but the content competes with conversation history, other tool results, and whatever else is in the context window.

### Questions — Evaluate Independently

**Question 1: Effectiveness.** After reading `novel-patterns.md`, do you feel calibrated? Did it change how you'd approach reading SUI code? Which departures actually shifted your understanding vs. which ones you could have inferred from general knowledge?

**Question 2: Overlap with overview.** Read both `novel-patterns.md` and `overview.md`. How much redundancy is there? Would an agent loading both feel like they're reading the same content twice? Is the framing distinction ("what is this" vs "what's novel") clear enough to justify both?

**Question 3: Structure.** Is the document well-organized for its purpose? Is the ordering effective? Are there sections that feel underdeveloped or overdeveloped relative to their importance? Does the quick reference table at the end work as a standalone summary?

**Question 4: Tone.** The document needs to communicate that certain features are genuinely novel without reading as marketing or promotional material. Does it succeed? Are there sentences that cross the line?

**Question 5: What's missing or wrong?** Are there claims that seem inaccurate? Are there genuinely novel aspects of the framework (visible in the overview or inferable from the code examples) that the skill fails to mention? Are any included items not actually novel?

### Source Files to Read
- `/home/jack/dev/semantic/next/ai/skills/essentials/novel-patterns.md` — the skill being evaluated
- `/home/jack/dev/semantic/next/ai/skills/essentials/overview.md` — existing foundational skill for overlap comparison
