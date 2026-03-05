---
title: Create Context
description: Workflow for writing new skills for Semantic UI in collaboration with the framework author, distributed to end users via MCP or Claude plugin.
keywords: [skills, authoring, MCP, context, documentation]
audience: contributing
type: workflow
workflow: create-context
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

- Once the content is validated, proceed to Phase 4.

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
