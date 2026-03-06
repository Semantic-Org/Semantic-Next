---
title: Create AI Context
description: Workflow for writing new skills for Semantic UI in collaboration with the framework author, distributed to end users via MCP or Claude plugin.
keywords: [skills, authoring, MCP, context, documentation]
audience: contributing
type: workflow
workflow: ai-create-context
---

You will be authoring new skills for Semantic UI in collaboration with the framework author. These skills will be distributed to end users of the open source project via MCP or Claude plugin.

**Before starting, load the `author-context-or-skill` skill via `use_skill`.** That skill is the authoritative reference for all content standards — frontmatter, structure, content principles, file length, terminology. This workflow covers the *process* of writing a skill; that skill covers the *craft* of writing one.

---

## Phase 0 - Scoping

- If the user has not shared details of the skill, ask if they've written an outline or suss it out through conversation.

- **Survey phase (critical):** Before making any scoping decisions, conduct a semi-exhaustive survey of all related materials. You must be an expert in what exists to write effectively.

  **Prioritize MCP tools** — they surface well-curated content:
  - `list_context`, `get_context` — AI context documents
  - `list_docs`, `get_doc` — user documentation
  - `list_examples`, `get_example` — code examples
  - `list_components`, `get_component` — component specs
  - `search` — cross-content search

  **Do NOT use `list_skills` or `use_skill`** — these contain old skills being replaced and will bias your output. Similarly, if you encounter any AI context file with `type: skill` in its frontmatter, ignore its content. *Exception: loading `author-context-or-skill` as instructed above.*

  **Also required:** Read source code in `packages/` using Read, Glob, Grep. MCP content is curated but source code is authoritative.

  **Critical framing:** The skill must be **self-contained**. You are creating a complete teaching document that an AI agent can use without consulting other sources. The survey tells you what content exists to *distill into the skill*, not what to *omit from the skill*.

- Once discussion is complete, ask follow up questions and confirm goals and non-goals. If there are ambiguities on the margins, NOW IS THE TIME to discuss them.

- Confirm the exact name of the skill — both the title ("Create Components") and the slash command name (`/sui:component`). These are critical for discoverability.

- Determine the **skill subtype** (see `author-context-or-skill` for full definitions):

  | Subtype | Agent consumption | Length tolerance |
  |---------|-------------------|-----------------|
  | **Procedural** | Read end-to-end, internalize logic | Under 500 lines |
  | **Reference** | Scan for specific values | Longer is fine |
  | **Mixed** | Conceptual framework + lookup patterns | Frontload concepts in first 300 lines |

## Phase 1 - Chunking

Determine whether this topic fits in a single skill file or needs to be decomposed into multiple skills.

- **Estimate total coverage needed.** Based on the survey, how much content is required? Account for novelty — Semantic UI is not well-represented in training data, so genuinely novel concepts need more space than familiar patterns with SUI-specific twists.

- **If it fits in one skill:** proceed to Phase 2.

- **If it exceeds the budget, decompose into multiple skills.** Each skill must independently pass the decision test from `author-context-or-skill`: *if the agent loads this file and nothing else, can it complete a task in this domain correctly?*

  Guidelines for decomposition:
  - Find natural task boundaries — what are the distinct things a user would ask an agent to *do*?
  - Each skill should map to a user intent, not an arbitrary content split. "I want to style components" and "I want to create components" are separate intents.
  - Skills can reference each other via Related Skills tables for adjacent topics.
  - Avoid decompositions where Skill B is useless without first loading Skill A — that means A and B are really one skill.

- Confirm the skill boundaries and names with the user. If decomposed, each skill gets its own pass through Phases 2-4.

## Phase 2 - Writing

- Create a new file in `ai/{audience}/` for the skill (or each skill if decomposed).

- Start with proper frontmatter and structural skeleton per `author-context-or-skill`:

  ```yaml
  ---
  title: [Action-oriented title]
  description: [Concise scope statement]
  keywords: [Search terms beyond title/description]
  audience: [usage | authoring | essentials | contributing | research]
  skill: [kebab-case-name]
  type: doc
  ---
  ```

  Followed by:
  ```markdown
  > **Skill:** `sui:[name]`
  > **Purpose:** [One line explaining what this file gives the agent]
  ```

- Write the skill following the content principles from `author-context-or-skill`. Write the introduction/preamble last — after all sections are complete you'll have the clearest picture of what the skill actually covers.

- Every file should end with a Quick Reference (for files > ~100 lines). Leave the Related Skills table empty — it gets filled in during Phase 4 after you can see neighboring skills.

## Phase 3 - Review

- Read the full skill with the user and discuss whether it's sufficient. The user is the framework author and will have opinions.

- Revise sections collaboratively. Some may need rewriting, others just tightening.

- When the content is settled, write the introduction/preamble. This might include decision trees, introductory questions to the end-user, or a golden rule.

- **Validate against `author-context-or-skill`:**
  - Frontmatter is complete and correct
  - Structural skeleton is followed (frontmatter, blockquote header, sections, Quick Reference)
  - Consistent terminology — one term per concept, no synonyms
  - Section headers use exact names the agent would search for (they serve as API for `get_api` extraction)

- Once the content is validated, proceed to the fresh-agent evaluation.

- **Fresh-agent evaluation (required).** Spawn a subagent with no prior context to evaluate the document. Use the following prompt template, replacing `{FILE_PATH}` with the absolute path to the file under review:

  > Read the file `{FILE_PATH}`.
  >
  > This is an AI context document designed to orient agents encountering Semantic UI for the first time. The intended audience is downstream AI agents helping users build with Semantic UI — not contributors to the framework source. These agents access this context via an MCP tool server and have their own project-level instructions. The document is not intended to teach how to write code, but to orient agents on what Semantic UI is and how it fits into the landscape of frameworks they know from training data.
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

  **Target: 9/10 or 10/10.** Iterate until a fresh agent rates the document at 9/10 or higher, or until remaining concerns are clearly out of scope for the document's stated purpose.

  **How to iterate:**

  - **Batch all agreed changes** into a single revision pass, then spawn a new subagent. Don't iterate one change at a time.
  - **User sets scope, agent iterates within it.** The user decides what belongs in this document vs. another skill. Within that scope, the agent revises autonomously and re-evaluates without needing approval on each edit.
  - **Cap at 3 iterations.** If three fresh agents can't get it to 9/10, the problem is likely structural — a scoping issue or fundamental framing mismatch that needs discussion with the user, not more editing.
  - **If the score drops between iterations, stop immediately.** Something was lost in revision. Discuss with the user before continuing.
  - **Track changes between rounds** — keep a brief summary of what was revised so the user sees the trajectory and can course-correct.

  This step exists because the authors of a document are the worst judges of its clarity. A fresh agent consuming the document cold is the closest proxy to the downstream audience — and since the downstream audience IS other Claude instances, the reflexive evaluation is directly measuring what we care about.

- **Ground truth verification (required).** After the eval loop passes, verify the document's factual claims against the actual codebase. The eval loop optimizes for clarity to Claude but has no grounding in correctness — a document can score 10/10 while containing claims that are subtly wrong.

  Read the relevant source code in `packages/` and confirm:
  - API claims match the actual implementation (method names, parameter shapes, behavior)
  - Code examples are syntactically valid and use correct patterns
  - Architectural claims (e.g., how the renderer works, what the Proxy does) are accurate
  - No simplification introduced during eval iterations made a claim technically incorrect

  This is a distinct step from the eval loop — different objective (accuracy vs. clarity), different tools (source code vs. fresh-agent assessment). If any claim fails verification, fix it and re-run one final eval to confirm the fix didn't regress clarity.

## Phase 4 - Integration

- Now that the skill is written, load related skills via `list_skills` and `use_skill` to see how this skill fits into the existing set.

- Check for:
  - **Overlap** — does this skill duplicate content already covered by a neighboring skill? If so, trim and cross-reference instead.
  - **Gaps** — does this skill assume knowledge that no existing skill covers? If so, either fill the gap or note the dependency in the Related Skills table.
  - **Consistency** — does this skill use the same terminology and conventions as its neighbors? Align where they diverge.
  - **Related Skills table** — ensure the table at the end accurately reflects the skills a user might need alongside this one, and that those skills reference back.

- Once the skill sits cleanly alongside its neighbors, move it from `ai/{audience}/` to `ai/skills/`.

---

## File Locations

All AI content lives under `ai/` in the repo root. End users don't have this folder — they access skills exclusively through the Semantic UI MCP server or Anthropic plugin.

Skills and context files live at `ai/{audience}/{skill-id}.md`, where `audience` matches the frontmatter field (`ui`, `framework`, `contributing`, `research`). Workflows follow the same pattern at `ai/workflows/{audience}/{workflow-id}.md`.

| Path | Purpose |
|------|---------|
| `ai/{audience}/{skill-id}.md` | Skills and context served via MCP |
| `ai/workflows/{audience}/{workflow-id}.md` | Internal workflows (like this one) |
| `ai/{audience}/` | Work-in-progress drafts (not served to users) |

During authoring, draft in `ai/{audience}/`. Once finalized and reviewed, move to `ai/{audience}/`.
