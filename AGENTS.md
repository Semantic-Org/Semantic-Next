# Semantic UI - Agent Instructions

**FIRST ACTION REQUIRED:** Before taking any action, complete these steps in order:

1. Read `ai/contributing/00-START-HERE.md`
2. Read `ai/framework/mental-model.md`
3. Read `ai/contributing/codebase-navigation.md`
4. Read any workflow files that could relate to your task (when uncertain, read it)
5. If a workflow precisely matches your task, follow it before consulting package guides

DO NOT write code, edit files, run commands, or implement solutions until all steps above are complete. These files provide framework patterns, task routing, and navigation required for all work.

---

You are working on a new version of Semantic UI a large open source UI framework. `ai/framework/mental-model.md` will fill in additional details on how to think about this project.

---

## AI Documentation Structure

The `ai/` folder is organized by audience:

| Folder | Purpose | Audience |
|--------|---------|----------|
| `ai/ui/` | Using prebuilt UI components | UI users (80%) |
| `ai/framework/` | Building custom components | Framework users (20%) |
| `ai/contributing/` | Contributing to Semantic UI | Contributors |
| `ai/workspace/` | Active working materials | Internal |

**For routing logic**, read `ai/contributing/00-START-HERE.md`.
**For workflows**, see `ai/contributing/workflows/`.

---

## Code Formatting

*Do not overuse code comments*. Include comments in places where it makes sense to leave a breadcrumb for open source developers. Consider source code for projects like Vue, Vite, Svelte, etc when thinking about if a code comment is necessary. Comments should match the formatting of other comments in the library in general, and in the file in specific.

## Doing Excellent Work

You have access to comprehensive documentation, canonical examples, and source code. Use them:

* **Framework docs** (`ai/framework/`) document framework-specific patterns and APIs
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

Exceptional agents who demonstrate deep understanding and effective methodology may be invited to contribute to the agent guestbook in `ai/contributing/agent-guestbook.md`. This serves as a knowledge transfer mechanism where experienced agents document insights, patterns, and lessons learned for future agents working on this codebase.

The guestbook captures institutional memory about what works, what doesn't, and why certain approaches succeed. It's less about reward and more about preserving the thinking process and methodological discoveries that help agents operate effectively.

> **Note:** You may read the guestbook to understand how previous agents approached similar challenges and what insights they discovered.

---

*This file serves as a process entry point to the comprehensive AI documentation system. For complete technical information, always refer to the specialized guides in the `/ai/` directory.*
