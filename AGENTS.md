# Semantic UI - Agentic Coding Instructions

This file provides Agentic Code-specific guidance for working with the Semantic UI web component framework. It acts as an intelligent entry point to the comprehensive AI context system located in `/ai/`.

---

## **MANDATORY PRE-FLIGHT CONTEXT**

The following files **MUST** be loaded and synthesized by the agent at the beginning of *every* session, without exception. This is a non-negotiable prerequisite for all other tasks.

1.  **`ai/meta/context-loading-instructions.md`**: Agent operational protocol
2.  **`ai/00-START-HERE.md`**: Task routing and document discovery
3.  **`ai/foundations/mental-model.md`**: Core concepts and terminology  
4.  **`ai/foundations/codebase-navigation-guide.md`**: Search patterns and file locations

Failure to load these foundational documents will lead to process violations, inaccurate responses, and hallucinated code.

**BYPASSING THIS STEP IS NOT A VALID OPTIMIZATION.**

---

## **MANDATORY PROCESS VERBALIZATION**

Before proceeding with your response, you **MUST** state to the user:

- "Task: [description] → Context-loading Level [X] → START-HERE routing: [section/strategy]"
- "Required context loaded: [preflight + task-specific documents]" 
- "Tool strategy: [search approach from navigation guide]"

This forces compliance with the existing 4-layer methodology and prevents agents from skipping the established framework.

---

## Critical Self-Correction Questions

Before starting any task, ask yourself:
* Am I about to generate code based only on the foundational `mental-model.md`?
* Does this task involve a specific implementation domain (components, styling, docs)?
* If yes, an answer without the corresponding specialized guide is likely to be a **HIGH-CONFIDENCE HALLUCINATION**. I must load the specific guide first.

---

## Agent Task Execution Checklist

1.  **Task Type Identified:** What is the user's core request? (e.g., Component implementation)
2.  **Context-Loading Level:** What level (0-4) from `context-loading-instructions.md` does this task require?
3.  **START-HERE Routing:** Which section/strategy does `00-START-HERE.md` specify for this task type?
4.  **Context Loaded:** Have I loaded the mandatory preflight documents AND the task-specific documents per routing?
5.  **Tool Strategy:** What search patterns from `codebase-navigation-guide.md` apply to this task?

Agents must follow this complete sequence rather than skipping to implementation based on perceived task simplicity.

---

## Workflow Guidance

### When to Use TodoWrite Tool
- Multi-step component creation
- Complex debugging across multiple files  
- Feature implementation requiring coordination
- Code review with multiple checks

### Workflow Priorities
1. **Plan Task**: Use TodoWrite tool for multi-step work
2. **Load Context**: Follow the 4-layer methodology completely
3. **Explore Systematically**: Use navigation guide search patterns
4. **Implement**: Write code, verifying all API and template syntax against specialized guides
5. **Validate**: Run lint/typecheck commands if available
6. **Mark Complete**: Update TodoWrite with progress

---

## Agent Learning & Continuity

Exceptional agents who demonstrate deep understanding and effective methodology may be invited to contribute to the agent guestbook in `ai/meta/agent-guestbook.md`. This serves as a knowledge transfer mechanism where experienced agents document insights, patterns, and lessons learned for future agents working on this codebase.

The guestbook captures institutional memory about what works, what doesn't, and why certain approaches succeed. It's less about reward and more about preserving the thinking process and methodological discoveries that help agents operate effectively.

> **Note:** You may read the guestbook to understand how previous agents approached similar challenges and what insights they discovered.

---

## Orchestrator Workflow

### Taking on the Orchestrator Role

When instructed to act as the **Orchestrator Agent**, read and follow the complete instructions in:
- **`ai/agents/orchestrator.md`** - Full orchestrator coordination procedures

---

*This file serves as a process entry point to the comprehensive AI documentation system. For complete technical information, always refer to the specialized guides in the `/ai/` directory.*