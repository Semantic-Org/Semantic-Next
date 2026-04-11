# AI Context Audit Fix — Continuation Plan

## Status: Pass 1 partially complete

### Pass 1 DONE (confirmed fixes applied):
- [x] essentials/mental-model.md (L84 settings proxy, L153 deep events, L183 attach)
- [x] essentials/overview.md (L207 onRendered fires once)
- [x] contributing/internals.md (L32-35 deps, L331 params framing, L371 getContent→$$, L386 eventType, L397 delegation nuance, L404 value)
- [x] contributing/build-system.md (L29 deps, L40 wireit, L54/118 CSS import, L113/244/277 bundle path, L257 error msg)
- [x] contributing/css-token-system.md (L174 --size-s, L353 transparent-black)
- [x] contributing/types.md (L99/106 Scheduler, L154 dep graph, L199 increment max, L244 CallParams Signal)
- [x] contributing/testing.md (L123 non-browser)
- [x] contributing/testing-internals.md (L117 CI test configs)

### Pass 1 REMAINING:
- [ ] contributing/repo-guide.md
  - L48: Broaden `content/` comment to "Content API endpoints (docs, examples, specs, lessons, AI context)"
  - L80: Remove `meta.json` row entirely
- [ ] contributing/docs-paths.md — L140: skill name `author-context-or-skill` → `ai-author-context`
- [ ] contributing/docs-examples-authoring.md
  - L273: `topbarDisplayMenu` → `exampleCategorySortOrder`; add 'Utils'
  - L283: Fix Reactivity subcategory sort order (add Signals, Reactions, Flushing, Settings)
  - L337: Add missing `import { $ } from '@semantic-ui/query'`
  - L429/532: `--green-background` → `--green-background-color` (all colors)
  - L850: `@semantic-ui/utilities` → `@semantic-ui/utils`
  - L920: Change "NOT hyphenated" to "shortest reasonable name" clarification
- [ ] contributing/docs-examples-debugging.md
  - L141: `wait_for` text param: string → array `["Expected output"]`
  - L184: `/docs/cert/README.md` → `/docs/README.md`
- [ ] contributing/docs-page-api-reference.md — L22: Add Specs row to API packages table
- [ ] contributing/docs-page-gateway.md — L29/30/238: Fix broken links (use `docs-page-` prefix)
- [ ] contributing/docs-page-guide.md — L31/32/33: Fix broken links (use `docs-page-` prefix)
- [ ] contributing/docs-page-pedagogical.md — L107: Remove `description` from required or note it's not in schema
- [ ] contributing/docs-rewrite-text.md — L58-81: All path errors. Since this is contributing, fix paths using `docs/guides/` prefix. Fix example names. Fix PlaygroundExample description.
- [ ] contributing/ai-author-context.md
  - L23: Fix search tool field list to actual: title, name, id, path, category, audience, methods, package
  - L136: Clarify that skill routing depends on `skill` field, not `type: skill`
  - L81/112: Keywords — trace if they feed `findRelated` before deciding fix (code or doc)

### Pass 2 — Workflow cleanup:
- [ ] All workflows: Remove references to Claude-specific tools (TaskCreate, TaskUpdate, AskUserQuestion)
- [ ] All workflows: Replace ghost directory paths (`ai/framework/`, `ai/packages/`, `ai/components/`, `ai/docs/`, `ai/contributing/development/`) with either skill IDs or codebase-navigation references
- [ ] add-query-method.md: RELEASE-NOTES.md → CHANGELOG.md, fix @see URL pattern to include /docs/
- [ ] add-util-function.md: Same ghost paths + CHANGELOG + @see pattern
- [ ] add-template-syntax.md: Ghost paths, CHANGELOG, fix createPatterns→generateRegExpPatterns, fix basePatterns format to {OPEN}/{CLOSE}, remove fabricated {@inline} syntax, fix renderer test path
- [ ] ai-rewrite-context.md: skill name → ai-author-context
- [ ] ai-create-context.md: skill name → ai-author-context, list_docs/get_doc → list_user_docs/get_user_doc
- [ ] research-component-patterns.md: ai/research/[component]/ → ai/research/components/[component]/, fix ui-list path, fix self-reference path
- [ ] verify-pattern-research.md: Fix research paths, ai/artifacts/ → ai/workspace/artifacts/
- [ ] docs-add-links.md: All URL paths need /docs/guides/ or /docs/ prefix
- [ ] docs-evaluate-text.md: Remove nonexistent file refs, fix all page paths with /docs/guides/ prefix
- [ ] primitive-scaffold.md: Spec separator -component.js → .component.js, spec barrel .spec segment, CSS tree levels, plural template braces, Astro registry pattern
- [ ] primitive-refine.md: L164 remove includeAttributeClass from States
- [ ] primitive-write-css.md: L388 remove ::slotted() from plural sizing example

### Pass 3 — Code fixes:
- [ ] packages/utils/types/strings.d.ts L211: Fix @see URL `/api/` → `/docs/api/`
- [ ] docs/src/helpers/ai-manifest.js or manifest.min.json.js: Ensure `description` is preserved in slim manifest (code fix, not doc fix — the doc is correct about intent)
- [ ] Trace keywords through findRelated to determine if manifest needs keywords too

### Key rules for continuation:
1. Skills reference other skills by MCP skill ID, not file paths
2. Contributing workflows can reference repo structure via codebase-navigation guide as entrypoint
3. No specific user-facing page paths (docs/src/pages/...) except as canonical examples in page-type authoring guides
4. No Claude tool references (TaskCreate, AskUserQuestion, etc.)
5. MCP is primarily downstream — people without repo access
6. Subcomponent naming: "shortest reasonable name" not "NOT hyphenated"
7. Deep events: "allows events from nested shadow DOM children to match" (no mechanism details)
8. description in list_skills results is correct intent — fix buildSlimManifest code, not docs
