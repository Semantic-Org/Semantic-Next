---
title: Evaluate AI Context
description: Workflow for evaluating AI context files using a fresh-agent review loop, targeting 9/10 or higher utility rating.
keywords: [evaluate, review, context, skills, quality, fresh agent]
audience: contributing
type: workflow
workflow: ai-evaluate-context
---

You will be evaluating an existing AI context file for its utility to downstream agents. This workflow uses a fresh-agent review loop — spawning a subagent with no prior context to assess the document cold, then iterating on feedback until it meets the quality bar.

---

## Prerequisites

- The file to evaluate must already exist and have valid frontmatter.
- Know the file's stated purpose and intended audience before starting. Read the file first.

---

## Step 1 - Understand the Document's Intent

Before evaluating, establish:

- **Audience.** Who loads this file? Agents helping users build with SUI? Agents contributing to the framework? All agents?
- **Scope.** What is this document trying to do? Orient, teach procedures, provide reference values?
- **Skill subtype.** Procedural (read end-to-end), reference (scan for values), or mixed?

This context is necessary to judge whether omissions are intentional scoping decisions or genuine gaps.

---

## Step 2 - Spawn Fresh-Agent Evaluation

Spawn a subagent with no prior context using the following prompt template. Replace `{FILE_PATH}` with the absolute path to the file under review.

> Read the file `{FILE_PATH}`. **Do not read any other files.** Evaluate this document using only its own content — treat it as the sole source of truth about the framework. This simulates the downstream experience: one file lands in your context via a tool call, and you reason from it alone.
>
> The file's YAML frontmatter contains a `description` field — this is the promise the document makes to agents who load it. The content should deliver on that promise. Judge the document against its own stated purpose, not against what you wish it covered.
>
> Context: this is an AI context document for the Semantic UI framework. The intended audience is downstream AI agents helping users build with Semantic UI — not contributors to the framework source. These agents access this context via an MCP tool server and have their own project-level instructions.
>
> Evaluate this document against these criteria, drawn from the project's own authoring standards:
>
> 1. **Decision test.** If an agent loads this file and nothing else, can it reason correctly about Semantic UI in conversation with a user? Where would it break down?
> 2. **Only documents what the agent can't infer.** Does every section earn its tokens by teaching something genuinely non-obvious — something the agent would get wrong without being told? Flag anything that restates knowledge already in training data.
> 3. **Frontloads the most important rules.** Are the highest-impact corrections and mental model shifts early in the document, or buried after less critical content?
> 4. **Generative understanding.** Does the document give the agent a *model* it can reason from in novel situations, or a *list of facts* it can only pattern-match against cases it's seen?
> 5. **Structure matches consumption.** Is the document structured for how an agent will actually consume it — read end-to-end on first load, then potentially never again? Does attention degrade gracefully (most critical content first, diminishing priority)?
>
> Rate the document from 1-10 on overall utility for its stated purpose. Be specific about what earns and loses points.
>
> Do not write any code. This is a research and evaluation task only.

Do not modify the prompt template. Do not add context about known issues, recent changes, or what you hope will land well. The subagent must encounter the document cold.

---

## Step 3 - Assess Feedback

Review the subagent's evaluation with the user. For each piece of feedback, determine:

- **Valid and actionable** — a real gap or wasted-token issue that should be fixed.
- **Valid but out of scope** — a real concern, but belongs in a different document. Note it and move on.
- **Misunderstanding** — the subagent misread the document's intent. No action needed, but consider whether the document's scope declaration is clear enough that the confusion would recur.

---

## Step 4 - Revise and Re-evaluate

If the rating is below 9/10:

1. **Batch all agreed changes** into a single revision pass. Don't iterate one change at a time.
2. Spawn a **new** subagent (do not resume the previous one) using the same prompt template.
3. **Track changes between rounds** — keep a brief summary of what was revised so the user sees the trajectory and can course-correct.

Each iteration should be a clean evaluation — the new subagent has no knowledge of previous feedback or revisions.

**User sets scope, agent iterates within it.** The user decides what belongs in this document vs. another skill. Within that scope, the agent revises autonomously and re-evaluates without needing approval on each edit.

**Cap at 3 iterations.** If three fresh agents can't get it to 9/10, the problem is likely structural — a scoping issue or fundamental framing mismatch that needs discussion with the user, not more editing.

**If the score drops between iterations, stop immediately.** Something was lost in revision. Discuss with the user before continuing.

---

## Step 5 - Ground Truth Verification

After the eval loop passes, verify the document's factual claims against the actual codebase. The eval loop optimizes for clarity to Claude but has no grounding in correctness — a document can score 10/10 while containing claims that are subtly wrong.

Read the relevant source code in `packages/` and confirm:

- API claims match the actual implementation (method names, parameter shapes, behavior)
- Code examples are syntactically valid and use correct patterns
- Architectural claims (e.g., how the renderer works, what the Proxy does) are accurate
- No simplification introduced during eval iterations made a claim technically incorrect

This is a distinct step from the eval loop — different objective (accuracy vs. clarity), different tools (source code vs. fresh-agent assessment). If any claim fails verification, fix it and re-run one final eval to confirm the fix didn't regress clarity.

---

## When to Stop

- **9/10 or 10/10 + ground truth passes** — the document meets the quality bar for both clarity and correctness.
- **Remaining concerns are out of scope** — the subagent wants content that belongs in a different skill. The document's scope declaration should make this clear; if it doesn't, fix the scope declaration rather than adding out-of-scope content.
- **Diminishing returns** — successive iterations produce the same feedback despite revisions, indicating a fundamental scope or structural mismatch that needs discussion with the user rather than further iteration.
