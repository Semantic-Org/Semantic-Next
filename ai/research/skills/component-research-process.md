---
title: Component Research Process
description: Guide to the comprehensive multi-agent research process used to inform Semantic UI component design through descriptive pattern analysis.
keywords: [component research, pattern analysis, UI research, descriptive linguistics, specification development]
audience: research
skill: component-research-process
type: skill
---

# A Guide to Descriptive UI Component Research

**Purpose**: This guide explains the comprehensive, multi-agent research process used to inform the design of Semantic UI components. It is intended for LLM agents to understand the context, methodology, and artifacts produced by this research.

**Philosophy**: The research methodology is **descriptive, not prescriptive**. Like linguistic research documents how language is actually used, we document how UI components are actually implemented across the ecosystem. The goal is to build an evidence-based foundation for component specifications, ensuring they are grounded in real-world patterns and conventions.

---

## The 5-Step Research Process

The entire process is broken down into five distinct steps, often handled by specialized agents. The ultimate goal of this process is to produce a final component `.json` specification that is evidence-based.

### Step 1: Component List Generation (The "Canon")

-   **Agent**: Three separate, frontier Large Language Models.
-   **Task**: To independently survey the web, including major UI framework documentation, and produce an exhaustive list of all common UI components.
-   **Rationale**: Using multiple models creates a comprehensive and balanced starting point, mitigating the bias of a single source.
-   **Artifact**: The combined output is stored in `ai/research/ui-list-exhaustive.md`. This file serves as the "canon" of components to be researched.

### Step 2: Individual Component Research (The "Field Work")

-   **Agent**: An **Orchestrator Agent** managing multiple specialist **Subagents**.
-   **Task**: The Orchestrator assigns a single component (e.g., "Button") to a team of Subagents. Each Subagent is responsible for researching that component's implementation within a *single* UI framework (e.g., one agent for Ant Design, one for Chakra UI, etc.).
-   **Workflow**: All agents performing this task must strictly follow the `ai/workflows/components/research-component-patterns.md` workflow. This ensures consistency and quality.
-   **Artifacts**: Each Subagent produces a detailed report for its assigned framework, saved at a path like `ai/research/[component]/[framework]/usage-patterns.md`.

### Step 3: Aggregate Pattern Analysis (The "Synthesis")

-   **Agent**: The **Orchestrator Agent**.
-   **Task**: The Orchestrator gathers all the individual `usage-patterns.md` reports for a given component. It then synthesizes them into a single, aggregate report. This involves:
    -   Counting the occurrences of each design pattern (e.g., "the `disabled` state appears in 9/10 frameworks").
    -   Calculating the prevalence and assigning a "Usage Level" (from Level 1: Universal to Level 5: Rare).
    -   Identifying terminology variations (e.g., `disabled` vs. `isDisabled`).
-   **Rationale**: This step transforms raw data into actionable insights, highlighting universal standards, common conventions, and rare innovations.
-   **Artifact**: The final compiled research report, saved as `ai/research/[component]/pattern-research.md`.

### Step 4: Errors & Omissions (E&O) Review (The "Fact-Check")

-   **Agent**: A dedicated **E&O Review Agent**, which may manage its own subagents.
-   **Task**: To systematically verify the aggregate `pattern-research.md` for errors and omissions by comparing it against the individual subagent reports. This is a rigorous quality control process.
-   **Workflow**: The agent follows the `ai/workflows/research/verify-pattern-research.md` workflow, which includes:
    -   Deploying one or more subagents to perform independent verification, providing consensus validation.
    -   Running in different modes, such as a "single pass" or iterating until the report is "clean" (zero errors found).
    -   Critically validating all findings, with special attention paid to small error counts (1-3), which can be an AI failure mode.
    -   Involving the user to resolve ambiguous cases.
-   **Rationale**: To guarantee the integrity, accuracy, and reliability of the research before it is presented for critical design decisions.
-   **Artifacts**:
    1.  A verified and corrected `pattern-research.md`, which includes an updated `> Last Reviewed: YYYY-MM-DD` date.
    2.  An updated central tracking file, `ai/artifacts/eo-list.md`, marking the component's verification status.

### Step 5: Spec Extension & Editorial Review (The "Decision")

-   **Agent**: A specialized AI agent working in direct collaboration with the Semantic UI author, Jack Lukic.
-   **Task**: The agent presents the verified research findings to the author. The presentation is structured around the "Usage Level" of each pattern, from most common to most rare.
-   **Workflow**: This collaborative session follows the `ai/workflows/contributing/primitive-refine.md` workflow. The AI's role is to present the evidence and act as an advocate for community-driven patterns, while the author makes the final editorial decisions based on the data, first principles, and the long-term vision for the framework.
-   **Artifacts**:
    1.  An updated component specification file (e.g., `src/primitives/[component]/specs/[component].json`). The `usageLevel` property in this spec is directly derived from the research.
    2.  A detailed decision record, stored at `ai/research/[component]/spec-decisions.md`, which documents what was included, what was excluded, and why.

---

## How to Use This Research

Any agent tasked with working on components must understand this ecosystem. Before modifying a component or its research, consult the relevant artifacts:

1.  `ai/artifacts/eo-list.md`: To check the E&O verification status of all component research.
2.  `ai/research/[component]/pattern-research.md`: To understand the broader landscape of existing patterns and see when it was last verified.
3.  `ai/research/[component]/spec-decisions.md`: To understand the historical context and rationale behind the current specification.
4.  `src/primitives/[component]/specs/[component].json`: To see the final, implemented outcome of the research.

This process ensures that all development work is informed by both quantitative, descriptive research and the coherent, opinionated vision that defines Semantic UI.
