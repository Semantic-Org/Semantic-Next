# AI Folder Restructure - File Categorization

> Generated: 2025-01-08
> Total files to categorize: ~69 (excluding 697 research files)

## Summary

| Destination | Count | Status |
|-------------|-------|--------|
| ui/ | 4 | 1 existing, 3 stubs needed |
| framework/ | 17 | All existing |
| contributing/ | ~48 | All existing |
| workspace/ | ~20 | artifacts + plans |
| DELETE | ~5 | Old manifests, redundant |

---

## ui/ (audience: ui, MCP: Yes)

| Current Path | New Path | Type | Status |
|--------------|----------|------|--------|
| guides/end-user/sui-usage.md | ui/markup.md | doc | frontmatter ✓ |
| (new) | ui/theming.md | doc | STUB NEEDED |
| (new) | ui/events.md | doc | STUB NEEDED |
| (new) | ui/customization.md | doc | STUB NEEDED |

---

## framework/ (audience: framework, MCP: Yes)

### Entry Points
| Current Path | New Path | Type | Status |
|--------------|----------|------|--------|
| framework/mental-model.md | framework/mental-model.md | doc | frontmatter ✓ |
| framework/quick-reference.md | framework/quick-reference.md | doc | frontmatter ✓ |

### Package Docs
| Current Path | New Path | Type | Status |
|--------------|----------|------|--------|
| packages/reactivity.md | framework/reactivity.md | doc | frontmatter ✓ |
| packages/templating.md | framework/templating.md | doc | frontmatter ✓ |
| packages/query.md | framework/query.md | doc | frontmatter ✓ |
| packages/component.md | framework/component.md | doc | frontmatter ✓ |
| packages/utils.md | framework/utils.md | doc | frontmatter ✓ |

### Cross-cutting Guides
| Current Path | New Path | Type | Status |
|--------------|----------|------|--------|
| guides/end-user/create-components.md | framework/creating-components.md | doc | frontmatter ✓ |
| guides/components/component-authoring-best-practices.md | framework/best-practices.md | doc | frontmatter ✓ |
| guides/components/component-portaling.md | framework/portaling.md | doc | frontmatter ✓ |
| guides/components/parent-child-primitives.md | framework/parent-child.md | doc | frontmatter ✓ |
| guides/query/plugins-and-behaviors.md | framework/plugins-and-behaviors.md | doc | frontmatter ✓ |

### Styling Guides
| Current Path | New Path | Type | Status |
|--------------|----------|------|--------|
| guides/css/theming.md | framework/theming.md | doc | frontmatter ✓ |
| guides/css/css-guide.md | framework/css.md | doc | frontmatter ✓ |
| guides/css/tokens/token-usage.md | framework/design-tokens.md | doc | frontmatter ✓ |
| guides/html/style-guide.md | framework/html.md | doc | frontmatter ✓ |
| guides/html/using-ui-primitives.md | framework/using-primitives.md | doc | frontmatter ✓ |

---

## contributing/ (audience: contributing, MCP: No)

### Root Level
| Current Path | New Path | Type | Status |
|--------------|----------|------|--------|
| 00-START-HERE.md | contributing/00-START-HERE.md | doc | frontmatter ✓ |
| foundations/codebase-navigation-guide.md | contributing/codebase-navigation.md | doc | frontmatter ✓ |
| packages/specs.md | contributing/specs.md | doc | frontmatter ✓ |
| guides/css/tokens/architecture.md | contributing/token-architecture.md | doc | needs frontmatter |
| guides/css/tokens/token-reference.md | contributing/token-reference.md | doc | needs frontmatter |
| meta/agent-guestbook.md | contributing/agent-guestbook.md | doc | needs frontmatter |
| meta/context-loading-instructions.md | contributing/context-loading.md | doc | needs frontmatter |
| guides/research/component-research-process.md | contributing/component-research-process.md | doc | needs frontmatter |
| guides/research/pattern-research-integration.md | contributing/pattern-research-integration.md | doc | needs frontmatter |

### Development
| Current Path | New Path | Type | Status |
|--------------|----------|------|--------|
| guides/development/testing.md | contributing/development/testing.md | doc | frontmatter ✓ |
| guides/development/typescript-types.md | contributing/development/typescript-types.md | doc | frontmatter ✓ |
| guides/development/build-system.md | contributing/development/build-system.md | doc | frontmatter ✓ |
| guides/development/code-formatting.md | contributing/development/code-formatting.md | doc | frontmatter ✓ |

### Documentation
| Current Path | New Path | Type | Status |
|--------------|----------|------|--------|
| documentation/00-START-HERE.md | contributing/documentation/00-START-HERE.md | doc | frontmatter ✓ |
| documentation/authoring-standards.md | contributing/documentation/authoring-standards.md | doc | frontmatter ✓ |
| documentation/page-types/gateway.md | contributing/documentation/page-types/gateway.md | doc | frontmatter ✓ |
| documentation/page-types/guide.md | contributing/documentation/page-types/guide.md | doc | frontmatter ✓ |
| documentation/page-types/api-reference.md | contributing/documentation/page-types/api-reference.md | doc | frontmatter ✓ |
| documentation/page-types/pedagogical.md | contributing/documentation/page-types/pedagogical.md | doc | frontmatter ✓ |
| documentation/examples/authoring.md | contributing/documentation/examples/authoring.md | doc | frontmatter ✓ |
| documentation/examples/self-critique.md | contributing/documentation/examples/self-critique.md | doc | frontmatter ✓ |
| documentation/quality/good-examples.md | contributing/documentation/quality/good-examples.md | doc | frontmatter ✓ |
| documentation/quality/slop-identification.md | contributing/documentation/quality/slop-identification.md | doc | frontmatter ✓ |
| documentation/enhance/add-links-to-text.md | contributing/documentation/enhance/add-links-to-text.md | doc | frontmatter ✓ |
| documentation/enhance/evaluate-text.md | contributing/documentation/enhance/evaluate-text.md | doc | frontmatter ✓ |
| documentation/enhance/rewrite-text.md | contributing/documentation/enhance/rewrite-text.md | doc | frontmatter ✓ |
| documentation/reference/target-audience.md | contributing/documentation/reference/target-audience.md | doc | frontmatter ✓ |
| documentation/reference/writing-effectively.md | contributing/documentation/reference/writing-effectively.md | doc | frontmatter ✓ |

### Workflows
| Current Path | New Path | Type | Status |
|--------------|----------|------|--------|
| workflows/components/scaffold-primitive.md | contributing/workflows/scaffold-primitive.md | workflow | frontmatter ✓ |
| workflows/components/define-primitive-spec.md | contributing/workflows/define-primitive-spec.md | workflow | frontmatter ✓ |
| workflows/components/implement-primitive-css.md | contributing/workflows/implement-primitive-css.md | workflow | frontmatter ✓ |
| workflows/components/create-component-master.md | contributing/workflows/create-component-master.md | workflow | frontmatter ✓ |
| workflows/components/evaluate-research-extend-spec.md | contributing/workflows/evaluate-research-extend-spec.md | workflow | frontmatter ✓ |
| workflows/components/port-classic-primitive.md | contributing/workflows/port-classic-primitive.md | workflow | frontmatter ✓ |
| workflows/components/research-component-patterns.md | contributing/workflows/research-component-patterns.md | workflow | frontmatter ✓ |
| workflows/documentation/refine-example-documentation-copy.md | contributing/workflows/refine-example-copy.md | workflow | frontmatter ✓ |
| workflows/query/add-query-method.md | contributing/workflows/add-query-method.md | workflow | frontmatter ✓ |
| workflows/templates/add-template-syntax.md | contributing/workflows/add-template-syntax.md | workflow | frontmatter ✓ |
| workflows/utils/add-util-function.md | contributing/workflows/add-util-function.md | workflow | frontmatter ✓ |
| workflows/agents/create-subagent-context.md | contributing/workflows/create-subagent-context.md | workflow | frontmatter ✓ |
| workflows/meta/add-ai-context.md | contributing/workflows/add-ai-context.md | workflow | frontmatter ✓ |
| workflows/research/verify-pattern-research.md | contributing/workflows/verify-pattern-research.md | workflow | frontmatter ✓ |

### Research (batch process)
| Current Path | New Path | Type | Status |
|--------------|----------|------|--------|
| research/**/* | contributing/research/**/* | research | needs batch frontmatter |

**Research file count**: 697 files across 76+ component folders

---

## workspace/ (no frontmatter, no MCP)

| Current Path | New Path | Notes |
|--------------|----------|-------|
| artifacts/mcp-restructure-plan.md | workspace/plans/mcp-restructure-plan.md | This plan |
| artifacts/* | workspace/artifacts/* | Prompts, screenshots, etc. |
| (new) | workspace/memory/ | Empty initially |

---

## DELETE (after migration verified)

| Path | Reason |
|------|--------|
| meta/context-manifest.json | Replaced by generated manifest |
| meta/workflows-manifest.json | Replaced by frontmatter-based generation |
| guides/components/creating-components.md | Duplicate of end-user/create-components.md? |

---

## Files Needing Frontmatter (not yet done)

| Path | Audience | Type |
|------|----------|------|
| guides/css/tokens/architecture.md | contributing | doc |
| guides/css/tokens/token-reference.md | contributing | doc |
| meta/agent-guestbook.md | contributing | doc |
| meta/context-loading-instructions.md | contributing | doc |
| guides/research/component-research-process.md | contributing | doc |
| guides/research/pattern-research-integration.md | contributing | doc |
| research/**/* (697 files) | contributing | research |
