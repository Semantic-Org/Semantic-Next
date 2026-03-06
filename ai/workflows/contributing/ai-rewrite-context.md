---
title: Rewrite AI Context or Skill
description: Workflow for rewriting existing AI context or skill files to comply with current authoring standards, including metadata, structure, and content conventions.
keywords: [rewriting, context, skills, standards, metadata, authoring]
audience: contributing
type: workflow
workflow: ai-rewrite-context
---

You will be rewriting an existing AI context or skill file to comply with current authoring standards. This is not a from-scratch authoring task — the content already exists. Your job is to pare it down, fix its metadata, verify its claims against source code, and reshape it to follow the structural and content conventions.

**Before starting, load the `author-context-or-skill` skill via `use_skill`.** That skill is the authoritative reference for all content standards. Every decision you make should trace back to a principle in that skill.

---

## Phase 0 - Audit

- Read the file in full. Before changing anything, assess its current state:

  - **Frontmatter:** Is it complete? Does it have `title`, `description`, `keywords`, `audience`, `skill`, `type`? Are the values correct? Does the `audience` value match one of: `usage`, `authoring`, `essentials`, `contributing`, `research`?
  - **Structure:** Does it follow the skeleton? (frontmatter → blockquote header → sections → Quick Reference → Related Skills table)
  - **Content quality:** Does it follow the content principles from `author-context-or-skill`? (Only document what the agent can't infer, tables for lookup, prose for concepts, pair correct/incorrect examples, one term per concept)
  - **Length:** Does it fit within the tolerance for its subtype? (Procedural: ~500 lines, Reference: longer OK, Mixed: concepts in first ~300 lines)

- Produce a short written audit for the user covering what needs to change. Categorize issues as:
  - **Metadata** — frontmatter fixes, missing fields, wrong values
  - **Structure** — missing skeleton elements, header issues
  - **Content** — generic padding to cut, missing examples, terminology inconsistencies
  - **Verification needed** — claims that need checking against source code

- Confirm the plan with the user before proceeding.

## Phase 1 - Verify Against Source

- For every technical claim in the file — API signatures, behavior descriptions, pattern examples — verify against actual source code in `packages/` and `src/`.

- Use MCP tools to cross-reference:
  - `get_example` — do the code examples match real patterns?
  - `get_component` — do component specs match what the file claims?
  - `get_api` — do method signatures match?

- Flag anything that's wrong, outdated, or unverifiable. Discuss with the user before correcting — they may know context you don't.

## Phase 2 - Rewrite

Apply changes in this order:

1. **Fix frontmatter.** Complete all required fields per `author-context-or-skill`.

2. **Add structural skeleton.** Blockquote header if missing. Quick Reference if file > ~100 lines. Related Skills table (can be empty if uncertain — flag for the user).

3. **Pare down content.**
   - Cut generic advice the model already knows (standard HTML/CSS/JS patterns, general programming wisdom).
   - Cut redundant explanations — if it's said twice, keep the better version.
   - Convert prose to tables where the content is lookup-oriented.
   - Add ✅/❌ example pairs where the file only shows the correct way.

4. **Fix terminology.** One term per concept, consistent with neighboring skills. Check `author-context-or-skill` for established terms.

5. **Correct any verified errors** from Phase 1.

6. **Check section headers.** They serve as API for `get_api` extraction — use exact names the agent would search for.

## Phase 3 - Review

- Present the rewritten file to the user with a summary of what changed and why.
- Flag any judgment calls where you weren't sure — the user is the expert.
- If the file was significantly over the length budget and you had to cut aggressively, call out what was removed so the user can confirm nothing essential was lost.

---

## File Locations

Write the rewritten file directly to `ai/{audience}/{skill-id}.md` based on the frontmatter `audience` field. The original is in git if you need to compare or revert.
