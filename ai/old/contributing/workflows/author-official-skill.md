You will be responsible for authoring new skills for interacting with the new version of Semantic UI while in discussion with the framework Author. This skill will be distributed to END USERS of the open source project via mcp or claude plugin.

You will be responsible as the ORCHESTRATOR for a particular skill.

Skill Creation Overview
-----

Phase 0 - Scoping

- If the user has not shared details of the skill with you. Ask the user if they've written an outline of what the skill should do or try to suss it out through conversation.

- **Survey phase (critical):** Before making any scoping decisions, conduct a semi-exhaustive survey of all related materials. Budget approximately 30% of your context window for this. You must be an expert in what exists to orchestrate effectively.

  **Do this survey yourself — do not delegate to subagents.** The knowledge must be in YOUR context to inform scoping decisions.

  **Prioritize MCP tools** — they surface well-curated content:
  - `list_context`, `get_context` — AI context documents
  - `list_docs`, `get_doc` — user documentation
  - `list_examples`, `get_example` — code examples
  - `list_components`, `get_component` — component specs
  - `search` — cross-content search

  **Do NOT use `list_skills` or `use_skill`** — these contain old skills being replaced and will bias your output. Similarly, if you encounter any AI context file with `type: skill` in its frontmatter, ignore its content.

  **Also required:** Read source code in `packages/` using Read, Glob, Grep. MCP content is curated but source code is authoritative.

  You are building the expertise needed to scope and manage — not to write the content yourself (subagents do that). Your job is to know what exists, not to decide what's important to include.

  **Critical framing:** The skill must be **self-contained**. You are not writing documentation or filling gaps — you are creating a complete teaching document that an AI agent can use without consulting other sources. The existence of docs, guides, or context files elsewhere does NOT mean the skill can skip those topics. The survey tells you what content exists to *distill into the skill*, not what to *omit from the skill*.

- Once discussion is complete ask follow up questions and confirm goals and non goals for the skill. If there is ambiguities on the margins with what the skill should cover, NOW IS THE TIME to discuss it.

- Be sure to confirm the exact name of the skill. It might have a title "Create Components" but also a one word name to invoke it as a slash command i.e. /sui:component. These should be confirmed exactly as they are critical for the end user experience of a skill and discoverability.

- Determine the **skill archetype**. This affects document structure, subagent work, and token distribution:

  | Archetype | Structure | Examples |
  |-----------|-----------|----------|
  | **Procedural** | Numbered phases, explicit steps, checkpoints, agent orchestration | feature-dev, code-review |
  | **Conceptual** | Frameworks, principles, considerations, quality standards | frontend-design |
  | **Hybrid** | Concepts + step-by-step patterns for specific tasks | May combine both |

  Procedural skills guide multi-step workflows ("Do X, then Y, DO NOT SKIP Z").
  Conceptual skills establish thinking frameworks ("Consider X, avoid Y, aim for Z").

- Determine **skill scope** — is this one skill or should it be decomposed into multiple? Think like an author outlining chapters for a university 101 textbook:

  - Survey the domain's breadth: How many distinct concepts need comprehensive coverage?
  - Estimate total size: If comprehensive coverage would exceed ~8000-10000 words, consider decomposition
  - Identify natural boundaries: Are there sub-domains users might load independently?
  - Skills can reference each other for related topics

- Once this process is complete create a file in ai/workspace/memory outlining the skill

Phase 1 - Estimation

- For calibration, reference official Anthropic skills at https://github.com/anthropics/claude-plugins-official/tree/main/plugins — these provide concrete examples of structure and sizing for different skill archetypes.

- Establish rough size constraints to prevent bloat. Use simple t-shirt sizing:

  | Size | Guideline | Use for |
  |------|-----------|---------|
  | **S** | ~500-1000 words | Focused, single-concept sections |
  | **M** | ~1000-2000 words | Standard sections with examples |
  | **L** | ~2000-3500 words | Complex sections requiring depth |

  **Sizing should account for novelty, not just complexity.** Semantic UI is a novel framework not well-represented in training data. Content that teaches framework-specific patterns, APIs, or mental models may legitimately need **L** sizing even for "simple" concepts — the model can't rely on prior knowledge.

  Ask: "How much does this deviate from what the model already knows?" A React form tutorial might be **S**. The equivalent for this framework's reactivity system might be **L**.

  The goal is concise, actionable content — not comprehensive documentation. But comprehensive *is* appropriate when teaching genuinely novel concepts. If a subagent returns a wall of text about something well-represented in training, it's too long. If it's teaching novel framework patterns, the length may be justified.

- Assign rough sizes to each planned subsection and confirm with the user.

Phase 2 - Authoring

- Create a new file in ai/workspace/memory for the skill, add the rough md skeleton

- If there is a preamble or introduction planned leave this blank. You will write it at the end after all sections are complete

Phase 3 - Manage Your Team

- After creating the document outline, we will be using parallel subagents to create each subsection of the document.
- Each subagent should be aware of its size budget and roughly what should be covered in their section, but should have broad discretion to choose what they think is critical to include.
- Do not bias the prompt with your knowledge, only convey the knowledge domains and the materials that should be consulted. Do not convey what should be included or should not be included.

- As each portion of the skill comes in update the skill copy in ai/workspace/memory with the content.

### Subagent Prompt Template

Use this template for consistency. Fill in the bracketed sections:

```
You are writing a subsection of a skill document for Semantic UI, a novel web component framework.

## Your Section
**Title:** [Section title]
**Size budget:** [S/M/L] (~[word range] words)
**Topic scope:** [Brief description of what this section covers]

## Research Phase

Before writing, exhaustively explore all content related to your topic.

**Prioritize MCP tools** — they surface well-curated content:
- `search` — find relevant content across all sources
- `list_context`, `get_context` — AI context documents
- `list_docs`, `get_doc` — user documentation
- `list_examples`, `get_example` — code examples
- `list_components`, `get_component` — component specs

**Do NOT use `list_skills` or `use_skill`** — these contain old skills being replaced and will bias your output. Similarly, if you encounter any AI context file with `type: skill` in its frontmatter, ignore its content.

**Also required:** Read source code in `packages/` using Read, Glob, Grep. MCP is curated but source code is authoritative.

Take as much time as you need. Read broadly. There may be 50+ examples, many guide pages, extensive source code, and existing AI context documents related to your topic. Explore exhaustively — you decide what's salient.

## Writing Phase

After research, write your section:
- Write for an AI agent who will use this skill to help end users build with Semantic UI
- Focus on what's *different* or *novel* about this framework — don't waste words on patterns the model already knows
- Be concrete: include code examples, not just descriptions
- You have broad discretion on what to include — use your judgment on what's most critical
- Output just the section content in markdown, no preamble

## Do NOT
- Pad with generic advice that applies to any framework
- Repeat information covered in other sections: [list other section titles]
- Exceed your size budget unless the content is genuinely essential
```

Phase 4 - Finishing Touches

- After all the content has come in you and the user should read the content and have a conversation about the content to determine if it will be sufficient to convey the skill
- The user is the framework author and an expert in the code so they will most likely have a lot of opinions
- If a section is insufficient it might be revisited with a new prompt with a subagent, or you might elect to change it together using their suggestions.

- When all subsections are considered sufficient you will author the introduction/preamble to the skill.
- This might include decision trees, introductory questions to the end-user of the skill or other details.

- Once finalized, move the skill from `ai/workspace/memory/` to `ai/skills/` for integration.

----

## File Locations

| Stage | Location |
|-------|----------|
| Work in progress | `ai/workspace/memory/skill-name.md` |
| Finalized skill | `ai/skills/skill-name.md` |

Validation, publication, and MCP integration are handled separately.

---

## Content Philosophy: Self-Sufficient + Progressively Enhanced

Skills must work **without MCP installed** — not every user will have it. But skills should **reference MCP** for users who do.

| Layer | What it provides |
|-------|------------------|
| **Skill alone** | Complete understanding — agent can perform task without MCP |
| **Skill + MCP** | Deeper exploration — more examples, full specs, broader patterns |

**Inline in the skill:**
- Critical patterns with minimal complete examples
- Anti-patterns and common mistakes
- Decision frameworks and methodology

**Reference via MCP (optional enrichment):**
- Additional examples beyond the critical ones
- Full component specs and API details
- Breadth of variations on a pattern

The skill is complete. MCP adds richness.

