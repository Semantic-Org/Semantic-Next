# AI Folder Restructure & MCP Server Plan

> **Created:** 2025-01-08
> **Status:** Planning
> **Goal:** Restructure ai/ folder for MCP serving, add frontmatter-based manifests, update MCP server to fetch from public URLs
> **Plan Location:** ai/workspace/plans/mcp-restructure-plan.md (move after structure created)

---

## Background: The Two Audiences

Semantic UI is **two things**:

1. **A UI Component Library** - Prebuilt components (`ui-button`, `ui-modal`, `ui-card`) that developers use to build sites. This is the **80% case**.

2. **A Web Component Framework** - A system for building custom reactive web components using `defineComponent`, signals, and templates. This is the **20% case**.

These audiences have different documentation needs:

| Audience | What They Do | What They Need |
|----------|--------------|----------------|
| **UI Users (80%)** | Use prebuilt `ui-*` components to build sites | Component specs, markup syntax, theming |
| **Framework Users (20%)** | Build custom components with `defineComponent` | Reactivity, templating, component lifecycle, patterns |
| **Contributors (1%)** | Work on the Semantic UI library itself | Codebase nav, workflows, research, internal docs |

This restructure separates content by audience so the MCP server can serve only what's relevant (ui/ and framework/) while keeping contributor docs (contributing/) accessible in the repo but not served externally.

---

## Overview

Restructure the `ai/` folder to cleanly separate:
- **MCP-served content** (`ui/`, `framework/`) - published docs for external AI agents
- **Contributing content** (`contributing/`) - guidance and reference for contributors
- **Workspace content** (`workspace/`) - active working materials (plans, memory, artifacts)

Update MCP server to fetch from public URLs instead of bundling.

---

## Mental Model

| Folder | Purpose | MCP? | Changes |
|--------|---------|------|---------|
| `ui/` | Using prebuilt UI (80%) | Yes | Rarely |
| `framework/` | Building components (20%) | Yes | Occasionally |
| `contributing/` | Guidance for contributors (1%) | No | Occasionally |
| `workspace/` | Active working materials | No | Frequently |

---

## Target Structure

```
ai/
├── ui/                              # MCP: Using prebuilt UI (80% audience)
│   ├── markup.md                    # ← guides/end-user/sui-usage.md
│   ├── theming.md                   # NEW STUB - applying themes, overriding colors
│   ├── events.md                    # NEW STUB - listening to component events
│   └── customization.md             # NEW STUB - CSS overrides, slots, extending
│
├── framework/                       # MCP: Building components (20% audience)
│   │
│   │   # Entry points
│   ├── mental-model.md              # ← framework/mental-model.md
│   ├── quick-reference.md           # ← framework/quick-reference.md
│   │
│   │   # Package docs (API + concepts combined)
│   ├── reactivity.md                # ← packages/reactivity.md
│   ├── templating.md                # ← packages/templating.md
│   ├── query.md                     # ← packages/query.md
│   ├── component.md                 # ← packages/component.md
│   ├── utils.md                     # ← packages/utils.md
│   │
│   │   # Cross-cutting guides
│   ├── creating-components.md       # ← guides/end-user/create-components.md
│   ├── best-practices.md            # ← guides/components/component-authoring-best-practices.md
│   ├── portaling.md                 # ← guides/components/component-portaling.md
│   ├── parent-child.md              # ← guides/components/parent-child-primitives.md
│   ├── plugins-and-behaviors.md     # ← guides/query/plugins-and-behaviors.md
│   │
│   │   # Styling guides (framework user perspective)
│   ├── theming.md                   # ← guides/css/theming.md (shadow DOM CSS)
│   ├── css.md                       # ← guides/css/css-guide.md
│   ├── html.md                      # ← guides/html/style-guide.md
│   ├── using-primitives.md          # ← guides/html/using-ui-primitives.md
│   └── design-tokens.md             # ← guides/css/tokens/token-usage.md
│
│   # Note: Flat structure because there are only ~15 files and many are
│   # cross-cutting (best-practices uses signals + templates + query).
│   # AI agents use manifests for discovery, folder depth doesn't help.
│
├── contributing/               # NOT MCP: Guidance for contributors
│   │
│   ├── 00-START-HERE.md        # ← 00-START-HERE.md (routing)
│   ├── codebase-navigation.md  # ← foundations/codebase-navigation-guide.md
│   ├── specs.md                # ← packages/specs.md
│   ├── token-architecture.md   # ← guides/css/tokens/architecture.md
│   │
│   ├── development/
│   │   ├── testing.md          # ← guides/development/testing.md
│   │   ├── typescript-types.md # ← guides/development/typescript-types.md
│   │   ├── build-system.md     # ← guides/development/build-system.md
│   │   └── code-formatting.md  # ← guides/development/code-formatting.md
│   │
│   ├── documentation/          # How to write docs
│   │   ├── 00-START-HERE.md    # ← documentation/00-START-HERE.md
│   │   ├── authoring-standards.md
│   │   ├── page-types/
│   │   │   ├── gateway.md
│   │   │   ├── guide.md
│   │   │   ├── api-reference.md
│   │   │   └── pedagogical.md
│   │   ├── examples/
│   │   │   ├── authoring.md
│   │   │   └── self-critique.md
│   │   ├── quality/
│   │   │   ├── slop-identification.md
│   │   │   └── good-examples.md
│   │   ├── enhance/
│   │   │   ├── add-links-to-text.md
│   │   │   ├── rewrite-text.md
│   │   │   └── evaluate-text.md
│   │   └── reference/
│   │       ├── target-audience.md
│   │       └── writing-effectively.md
│   │
│   ├── workflows/              # Step-by-step contribution procedures
│   │   ├── scaffold-primitive.md
│   │   ├── define-primitive-spec.md
│   │   ├── implement-primitive-css.md
│   │   ├── add-query-method.md
│   │   ├── add-template-syntax.md
│   │   ├── add-util-function.md
│   │   ├── add-ai-context.md
│   │   ├── refine-example-copy.md
│   │   └── verify-pattern-research.md
│   │
│   └── research/               # UI pattern analysis (100+ components)
│       ├── accordion/
│       ├── alert/
│       ├── avatar/
│       ├── button/
│       └── ... (see ai/research/ for full list)
│
├── workspace/                  # NOT MCP: Active working space
│   ├── plans/                  # Active work plans
│   │   └── mcp-restructure-plan.md
│   ├── artifacts/              # Collected resources, prompts
│   │   └── (contents from current ai/artifacts/)
│   └── memory/                 # Working notes, scratch
│
└── meta/
    ├── manifest.json           # Generated: ui/ + framework/
    └── contributing-manifest.json # Generated: contributing/
```

### File Mapping Summary

| Source | Destination | Count |
|--------|-------------|-------|
| (new stubs) | ui/ | 3 |
| guides/end-user/sui-usage.md | ui/markup.md | 1 |
| foundations/*.md | framework/ or contributing/ | 4 |
| packages/*.md | framework/ or contributing/ | 6 |
| guides/end-user/create-components.md | framework/ | 1 |
| guides/components/*.md | framework/ | 4 |
| guides/css/*.md | framework/ or contributing/ | 4 |
| guides/html/*.md | framework/ | 2 |
| guides/query/*.md | framework/ | 1 |
| guides/development/*.md | contributing/development/ | 4 |
| documentation/**/*.md | contributing/documentation/ | ~15 |
| workflows/**/*.md | contributing/workflows/ | ~10 |
| research/**/* | contributing/research/ | ~100+ |
| artifacts/* | workspace/artifacts/ | ~20 |
| tools/* | evaluate & delete | ~10 |

---

## Frontmatter Schema

All docs will have frontmatter that drives manifest generation:

```yaml
---
title: Mental Model for AI Agents
description: Core patterns for understanding Semantic UI
keywords: [architecture, reactivity, signals, defineComponent]
audience: framework          # ui | framework | contributing
type: doc                    # doc | workflow | research
---
```

**Computed fields** (added by build script, not manually maintained):
- `tokens` - word count heuristic (~4 chars/token)
- `lastModified` - from `git log -1 --format=%cI -- <file>`

These are computed at manifest generation time, not stored in frontmatter.

---

## Phase 1: Audit & Categorization

### 1.1 Audit current ai/ structure
- [ ] List all files in ai/ recursively
- [ ] Count total files to be processed
- [ ] Document current folder structure

### 1.2 Categorize each document
For each document, determine:
- [ ] **Audience**: ui | framework | contributing
- [ ] **Type**: doc | workflow | research
- [ ] **Target location** in new structure

Note: `workspace/` content (plans, artifacts, memory) does NOT get frontmatter - it's ephemeral working material, not manifested docs.

### 1.3 Create categorization spreadsheet
- [ ] Create `ai/workspace/plans/restructure-categorization.md` with table:
  | Current Path | Audience | Type | New Path | Notes |

Note: Create workspace/plans/ early to store working documents.

### 1.4 Create stub files for new ui/ docs
- [ ] Create `ai/ui/theming.md` stub (applying themes, overriding colors)
- [ ] Create `ai/ui/events.md` stub (listening to component events)
- [ ] Create `ai/ui/customization.md` stub (CSS overrides, slots, extending)

### 1.5 Document files by category

#### Foundation docs (ai/foundations/)
- [ ] `00-START-HERE.md` → contributing/00-START-HERE.md (routing for contributors)
- [ ] `mental-model.md` → framework/mental-model.md
- [ ] `codebase-navigation-guide.md` → contributing/codebase-navigation.md
- [ ] `quick-reference.md` → framework/quick-reference.md

#### Package docs (ai/packages/)
- [ ] `reactivity.md` → framework/packages/reactivity.md
- [ ] `templating.md` → framework/packages/templating.md
- [ ] `query.md` → framework/packages/query.md
- [ ] `utils.md` → framework/packages/utils.md
- [ ] `component.md` → framework/packages/component.md
- [ ] `specs.md` → workspace/contributing/ (internal spec system)

#### Guide docs (ai/guides/)
- [ ] Audit all files in ai/guides/components/
- [ ] Audit all files in ai/guides/css/
- [ ] Audit all files in ai/guides/html/
- [ ] Audit all files in ai/guides/development/
- [ ] Audit all files in ai/guides/query/
- [ ] Audit all files in ai/guides/end-user/
- [ ] Audit all files in ai/guides/research/

#### Documentation docs (ai/documentation/)
- [ ] Audit all files → workspace/contributing/documentation/

#### Workflow docs (ai/workflows/)
- [ ] Audit all workflow files
- [ ] Determine which are framework (end-user) vs contributing
- [ ] Map to new locations

#### Research docs (ai/research/)
- [ ] Confirm all research/ → workspace/research/
- [ ] Count total research files

#### Artifacts (ai/artifacts/)
- [ ] Confirm all artifacts/ → workspace/artifacts/
- [ ] Identify any that should be deleted vs moved

#### Tools docs (ai/tools/)
- [ ] Audit ai/tools/ contents
- [ ] Determine categorization

#### Meta files (ai/meta/)
- [ ] `context-manifest.json` → will be replaced by generated manifest
- [ ] `workflows-manifest.json` → will be replaced by frontmatter
- [ ] Other meta files

---

## Phase 2: Add Frontmatter to Existing Docs

> **Why frontmatter first?** Adding frontmatter before moving files keeps git history cleaner
> (frontmatter additions are separate commits from file moves) and ensures no files are
> forgotten during the move phase.

### 2.1 Define frontmatter schema
- [ ] Document required fields: title, description, audience, type
- [ ] Document optional fields: keywords
- [ ] Create template for each type (doc, workflow, research)

### 2.2 Add frontmatter to files destined for ui/
- [ ] guides/end-user/sui-usage.md (→ ui/markup.md)
- [ ] New stubs: ui/theming.md, ui/events.md, ui/customization.md

### 2.3 Add frontmatter to files destined for framework/
- [ ] framework/mental-model.md
- [ ] framework/quick-reference.md
- [ ] packages/reactivity.md
- [ ] packages/templating.md
- [ ] packages/query.md
- [ ] packages/component.md
- [ ] packages/utils.md
- [ ] guides/end-user/create-components.md
- [ ] guides/components/component-authoring-best-practices.md
- [ ] guides/components/component-portaling.md
- [ ] guides/components/parent-child-primitives.md
- [ ] guides/query/plugins-and-behaviors.md
- [ ] guides/css/theming.md
- [ ] guides/css/css-guide.md
- [ ] guides/css/tokens/token-usage.md
- [ ] guides/html/style-guide.md
- [ ] guides/html/using-ui-primitives.md

### 2.4 Add frontmatter to files destined for contributing/
- [ ] 00-START-HERE.md
- [ ] foundations/codebase-navigation-guide.md
- [ ] packages/specs.md
- [ ] guides/css/tokens/architecture.md
- [ ] All files in guides/development/
- [ ] All files in documentation/
- [ ] All files in workflows/

### 2.5 Research frontmatter batch script
Since research/ has 100+ files, write a script to auto-generate frontmatter:
- [ ] Script reads each .md file in research/
- [ ] Extracts component name from folder (e.g., accordion/, button/)
- [ ] Generates frontmatter with title, audience=contributing, type=research
- [ ] Prepends frontmatter to files that don't have it
- [ ] Run script and verify output

### 2.6 Validate frontmatter
- [ ] Write validation script to check all docs have required fields
- [ ] Run validation, fix any missing frontmatter
- [ ] Verify audience values are valid (ui|framework|contributing)
- [ ] Verify type values are valid (doc|workflow|research)

---

## Phase 3: Create New Folder Structure & Move Files

### 3.1 Create directory skeleton
- [ ] Create `ai/ui/`
- [ ] Create `ai/framework/`
- [ ] Create `ai/contributing/`
- [ ] Create `ai/contributing/development/`
- [ ] Create `ai/contributing/documentation/`
- [ ] Create `ai/contributing/documentation/page-types/`
- [ ] Create `ai/contributing/documentation/examples/`
- [ ] Create `ai/contributing/documentation/quality/`
- [ ] Create `ai/contributing/documentation/enhance/`
- [ ] Create `ai/contributing/documentation/reference/`
- [ ] Create `ai/contributing/workflows/`
- [ ] Create `ai/contributing/research/`
- [ ] Create `ai/workspace/`
- [ ] Create `ai/workspace/plans/`
- [ ] Create `ai/workspace/artifacts/`
- [ ] Create `ai/workspace/memory/`

### 3.2 Move ui/ content
- [ ] Move guides/end-user/sui-usage.md → ui/markup.md
- [ ] Move stub files to ui/ (theming.md, events.md, customization.md)

### 3.3 Move framework/ content
- [ ] Move framework/mental-model.md → framework/mental-model.md
- [ ] Move framework/quick-reference.md → framework/quick-reference.md
- [ ] Move packages/reactivity.md → framework/reactivity.md
- [ ] Move packages/templating.md → framework/templating.md
- [ ] Move packages/query.md → framework/query.md
- [ ] Move packages/component.md → framework/component.md
- [ ] Move packages/utils.md → framework/utils.md
- [ ] Move guides/end-user/create-components.md → framework/creating-components.md
- [ ] Move guides/components/component-authoring-best-practices.md → framework/best-practices.md
- [ ] Move guides/components/component-portaling.md → framework/portaling.md
- [ ] Move guides/components/parent-child-primitives.md → framework/parent-child.md
- [ ] Move guides/query/plugins-and-behaviors.md → framework/plugins-and-behaviors.md
- [ ] Move guides/css/theming.md → framework/theming.md
- [ ] Move guides/css/css-guide.md → framework/css.md
- [ ] Move guides/css/tokens/token-usage.md → framework/design-tokens.md
- [ ] Move guides/html/style-guide.md → framework/html.md
- [ ] Move guides/html/using-ui-primitives.md → framework/using-primitives.md

### 3.4 Move contributing/ content
- [ ] Move 00-START-HERE.md → contributing/00-START-HERE.md
- [ ] Move foundations/codebase-navigation-guide.md → contributing/codebase-navigation.md
- [ ] Move packages/specs.md → contributing/specs.md
- [ ] Move guides/css/tokens/architecture.md → contributing/token-architecture.md
- [ ] Move guides/development/*.md → contributing/development/
- [ ] Move documentation/*.md → contributing/documentation/ (preserve subfolders)
- [ ] Move workflows/*.md → contributing/workflows/ (flatten structure)
- [ ] Move research/ → contributing/research/

### 3.5 Move workspace/ content
- [ ] Move this plan → workspace/plans/mcp-restructure-plan.md
- [ ] Move artifacts/ contents → workspace/artifacts/
- [ ] Create workspace/memory/ (empty initially)

### 3.6 Update internal links
- [ ] Grep for all internal links in moved files
- [ ] Update relative paths
- [ ] Update absolute paths (/ai/...)
- [ ] Verify no broken links

Note: Workspace is for active/ephemeral working materials. No frontmatter, no manifest.

---

## Phase 4: Manifest Generation

### 4.1 Write manifest generation script
- [ ] Create `scripts/generate-ai-manifests.js`
- [ ] Parse frontmatter from all .md files
- [ ] Compute token count for each file (use tiktoken or word count heuristic)
- [ ] Generate `ai/meta/manifest.json` for ui/ + framework/ (MCP-served)
- [ ] Generate `ai/meta/contributing-manifest.json` for contributing/ (repo-only)
- [ ] Do NOT generate manifest for workspace/ (ephemeral content)
- [ ] Handle nested folders correctly
- [ ] Generate stable IDs from file paths

### 4.2 Manifest schema
```json
{
  "schemaVersion": 2,
  "generated": "2025-01-08T...",
  "documents": [
    {
      "id": "framework/mental-model",
      "path": "ai/framework/mental-model.md",
      "title": "Mental Model for AI Agents",
      "description": "Core patterns for understanding Semantic UI",
      "keywords": ["architecture", "reactivity"],
      "audience": "framework",
      "type": "doc",
      "tokens": 3000,
      "lastModified": "2025-01-08T14:32:00Z"
    }
  ]
}
```

**Computed fields**:
- `tokens`: Character count / 4 (rough token estimate)
- `lastModified`: `git log -1 --format=%cI -- <filepath>`

### 4.3 Test manifest generation
- [ ] Run script locally
- [ ] Verify manifest.json contains only ui/ and framework/ docs
- [ ] Verify contributing-manifest.json contains only contributing/ docs
- [ ] Verify no workspace/ content in any manifest
- [ ] Verify token counts are reasonable
- [ ] Verify no duplicate IDs

### 4.4 Integrate into build
- [ ] Add `generate-ai-manifests` to package.json scripts
- [ ] Add to docs site build pipeline
- [ ] Verify manifests regenerate on doc changes
- [ ] Consider git hook or CI check for manifest freshness

### 4.5 Remove old manifests
- [ ] Delete ai/meta/context-manifest.json (after new one works)
- [ ] Delete ai/meta/workflows-manifest.json (after new one works)
- [ ] Update any references to old manifests
- [ ] Update CLAUDE.md references to manifests

---

## Phase 5: Update MCP Server

### 5.1 Remove context bundling
- [ ] Remove context bundling from `tools/mcp/scripts/bundle-specs.js`
- [ ] Remove `tools/mcp/src/data/context-docs.json`
- [ ] Remove `tools/mcp/src/data/context-manifest.json`
- [ ] KEEP component spec bundling (specs.json, index.json) - small, stable, fast

Decision: Component specs stay bundled (generated from src/primitives/**/specs/*.spec.json).
Context docs switch to URL fetch.

### 5.2 Update MCP server to fetch from URLs
- [ ] Update `tools/mcp/src/utils/context.ts` to fetch from URLs
- [ ] Add base URL configuration: `https://next.semantic-ui.com/ai/`
- [ ] Handle fetch errors gracefully (return error message, not crash)
- [ ] No caching layer for v1 - keep it simple, revisit if latency is an issue

### 5.3 Update MCP tool definitions
- [ ] Update `list_docs` to use new manifest structure
- [ ] Update `get_doc` to fetch from URL
- [ ] Add `domain` filter parameter (ui|framework)
- [ ] Consider adding `get_markup_guide` convenience method
- [ ] Update tool descriptions

### 5.4 Test MCP server locally
- [ ] Run docs site locally
- [ ] Point MCP server at localhost
- [ ] Test list_components
- [ ] Test get_component
- [ ] Test list_docs
- [ ] Test get_doc
- [ ] Verify filtering works

---

## Phase 6: Update Docs Site

### 6.1 Configure public ai/ serving
- [ ] Add `ai/ui/` to docs public folder (symlink or copy)
- [ ] Add `ai/framework/` to docs public folder
- [ ] Add `ai/meta/manifest.json` to docs public folder
- [ ] Ensure `ai/contributing/` is NOT in public folder
- [ ] Ensure `ai/workspace/` is NOT in public folder

### 6.2 Verify deployment
- [ ] Push to branch, Vercel preview deploys automatically
- [ ] Spot-check a few URLs work (manifest.json, one doc from each folder)
- [ ] Verify contributing/ and workspace/ return 404

Note: Vercel auto-deploys public/ folder, no complex configuration needed.

---

## Phase 7: Update Routing & Documentation

### 7.1 Update CLAUDE.md
- [ ] Update paths to new structure
- [ ] Update routing instructions
- [ ] Point contributing work to `contributing/`
- [ ] Point framework users to `framework/`
- [ ] Remove references to old structure (foundations/, packages/, guides/)

### 7.2 Update contributing routing docs
- [ ] Update contributing/00-START-HERE.md with new paths
- [ ] Update decision trees for new structure
- [ ] Ensure contributors can find what they need

### 7.3 Update any hardcoded paths
- [ ] Search codebase for `/ai/` paths
- [ ] Update documentation references
- [ ] Update any scripts that reference old paths

---

## Phase 8: Cleanup & Verification

### 8.1 Remove old structure
- [ ] Delete ai/foundations/ (after content moved to framework/)
- [ ] Delete ai/packages/ (after content moved to framework/packages/)
- [ ] Delete ai/guides/ (after content distributed to framework/ and contributing/)
- [ ] Delete ai/documentation/ (after content moved to contributing/documentation/)
- [ ] Delete ai/workflows/ (after content moved to framework/workflows/ and contributing/workflows/)
- [ ] Delete ai/tools/ (after content evaluated and moved)
- [ ] Delete ai/research/ (after content moved to contributing/research/)
- [ ] Delete ai/artifacts/ (after content moved to workspace/artifacts/)
- [ ] Verify only new structure remains: ui/, framework/, contributing/, workspace/, meta/

### 8.2 Verify no broken references
- [ ] Run link checker on ai/ folder
- [ ] Run link checker on docs site
- [ ] Test MCP server thoroughly
- [ ] Test CLAUDE.md workflow

### 8.3 Final testing
- [ ] Test MCP server from clean install
- [ ] Test external AI agent using MCP
- [ ] Test contributing workflow (clone repo, use workspace/)
- [ ] Document any issues found

### 8.4 Update MCP server README
- [ ] Document new architecture
- [ ] Document URL structure
- [ ] Document available tools
- [ ] Add examples

---

## File Count Estimates

Based on target structure mapping above:

### Destination (New Structure)
| Folder | Est. Files | MCP? | Frontmatter? |
|--------|------------|------|--------------|
| ai/ui/ | 4 | Yes | Yes |
| ai/framework/ | 17 | Yes | Yes |
| ai/contributing/ | ~4 | No | Yes |
| ai/contributing/development/ | 4 | No | Yes |
| ai/contributing/documentation/ | ~15 | No | Yes |
| ai/contributing/workflows/ | ~10 | No | Yes |
| ai/contributing/research/ | ~100+ | No | Yes (batch) |
| ai/workspace/ | ~20 | No | No |
| ai/meta/ | 2 | Yes | N/A (generated) |
| **Total** | **~175** | | |

### MCP-Served Content
- **ui/**: 4 files (~10K tokens) - markup, theming, events, customization
- **framework/**: 16 files (~60K tokens total) - flat structure
- **manifest.json**: Generated index

### Effort by Phase
| Phase | Effort | Notes |
|-------|--------|-------|
| 1. Audit | Medium | Verify file mapping, create stubs |
| 2. Frontmatter | High | 100+ research files need batch processing |
| 3. Move files | Medium | Mostly mechanical |
| 4. Manifest script | Medium | ~100 lines of JS |
| 5. MCP update | Medium | Remove bundling, add fetch |
| 6. Docs site | Low | Symlinks + Vercel |
| 7. Routing | Low | Update CLAUDE.md |
| 8. Cleanup | Low | Delete old folders |

---

## Risk Mitigation

1. **Broken links**: Run link checker after each phase
2. **Lost content**: Git history preserves everything; work on branch
3. **MCP downtime**: Keep old bundled approach working until new approach verified
4. **Gradual rollout**: Can deploy docs site changes before MCP changes

---

## Success Criteria

- [ ] `ai/ui/` and `ai/framework/` accessible via public URLs
- [ ] `ai/contributing/` and `ai/workspace/` NOT accessible via public URLs
- [ ] MCP server fetches from `https://next.semantic-ui.com/ai/` on demand
- [ ] No bundled context in MCP server (specs may still be bundled)
- [ ] `manifest.json` generated automatically from frontmatter
- [ ] `contributing-manifest.json` generated for repo use
- [ ] All docs have valid frontmatter
- [ ] CLAUDE.md routes contributors to `contributing/`
- [ ] All internal links work
- [ ] Contributing workflow still functional with new paths
- [ ] External AI agents can discover and use ui/ and framework/ docs

---

## Notes

- Work on feature branch: `feat/ai-restructure` (create from main, not feat/mcp)
- Commit after each completed phase
- This plan may be executed across multiple agent sessions
- Update this document as work progresses
- **High-effort items**: Phase 1 categorization + stubs, Phase 2.5 research frontmatter batch script
- After completion, move this plan to `workspace/plans/archive/`

## Missing Files to Handle

Files referenced in CLAUDE.md or elsewhere that need placement:

| File | Current Location | Destination | Notes |
|------|------------------|-------------|-------|
| agent-guestbook.md | ai/meta/ | ai/meta/ | Keep in meta/ (cross-cutting) |
| workflows-manifest.json | ai/meta/ | DELETE | Replaced by frontmatter |
| context-manifest.json | ai/meta/ | DELETE | Replaced by frontmatter |
