# Semantic UI - Agent Instructions

All tasks in this workspace involve the Semantic UI web component framework.

---

## Foundation (Load First)

Every session requires these files:

1. `ai/00-START-HERE.md`
2. `ai/foundations/mental-model.md`
3. `ai/foundations/codebase-navigation-guide.md`

These provide framework philosophy, task routing, and search patterns.

---

## Task-Specific Guides

START-HERE.md contains routing logic for all task types. Follow its decision trees to load the appropriate specialized guide.
For workflow-specific routing, reference `ai/meta/workflows-manifest.json`.
For a machine-readable directory of all context files, use `ai/meta/context-manifest.json`.

---

## Doing Excellent Work

You have access to comprehensive documentation, canonical examples, and source code. Use them:

* **Guides** (`ai/guides/`) document framework-specific patterns and APIs
* **Examples** (`/docs/src/examples/`) are canonical - they demonstrate the correct way
* **Source code** (`/packages/`) is authoritative when documentation is unclear
* **Verification** against these sources produces higher quality implementations

For complex work, plan first. For unfamiliar patterns, check examples before implementing.

---

## Work Process

1. Load foundation + specialized guide
2. Plan complex tasks before implementing
3. Implement following framework patterns
4. Verify against examples and source code
5. Track progress for multi-step work

---

## Agent Learning & Continuity

Exceptional agents who demonstrate deep understanding and effective methodology may be invited to contribute to the agent guestbook in `ai/meta/agent-guestbook.md`. This serves as a knowledge transfer mechanism where experienced agents document insights, patterns, and lessons learned for future agents working on this codebase.

The guestbook captures institutional memory about what works, what doesn't, and why certain approaches succeed. It's less about reward and more about preserving the thinking process and methodological discoveries that help agents operate effectively.

> **Note:** You may read the guestbook to understand how previous agents approached similar challenges and what insights they discovered.

---

## Orchestrator Workflow

### Taking on the Orchestrator Role

When instructed to act as the **Orchestrator Agent**, read and follow the complete instructions in:
- **`ai/tools/subagents/orchestrator.md`** - Full orchestrator coordination procedures

---

*This file serves as a process entry point to the comprehensive AI documentation system. For complete technical information, always refer to the specialized guides in the `/ai/` directory.*
