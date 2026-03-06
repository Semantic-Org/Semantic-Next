---
title: Add Sophisticated Design Patterns to Research
description: Workflow for evaluating component research reports and identifying component-specific design innovations worth including in Semantic UI.
keywords: [research, design patterns, component innovations, pattern analysis, sophisticated patterns]
audience: contributing
type: workflow
workflow: add-sophisticated-patterns
---

# Add Sophisticated Design Patterns Section

Evaluate component research reports to identify **component-specific** innovations (not framework-wide patterns) worth including in Semantic UI.

---

## Source Materials

Before adding this section to a component, read:

1. **Workflow Definition**: `ai/workflows/research/research-component-patterns.md`
2. **Example Components**: Review these completed examples:
   - `ai/research/components/empty-state/pattern-research.md` - Good example with 2 patterns
   - `ai/research/components/carousel/pattern-research.md` - Good example

## Systematic Process

For each component:

**Step 1: Read the Pattern Research**
```bash
# Read the component's aggregate report
cat ai/research/components/[component-name]/pattern-research.md
```

**Step 2: Review Individual Framework Reports**
```bash
# Check all framework implementations for unique features
cat ai/research/components/[component-name]/*/usage-patterns.md
```

**Step 3: Apply the Validation Test**

For each "unique" or "notable" feature you find, ask:

> **"If we removed this component from the framework, would this feature still exist in other components?"**

- **If YES** → Framework-wide pattern (EXCLUDE)
- **If NO** → Component-specific innovation (INCLUDE)

**Invalid Examples** (framework-wide):
- ❌ "Uses Tailwind for styling" (all ShadCN components do)
- ❌ "ConfigProvider integration" (all Ant Design components do)
- ❌ "Multi-part composition" (framework architecture)
- ❌ "TypeScript support" (framework-wide)
- ❌ "Recipe-based theming" (framework architecture)
- ❌ "Copy-paste distribution model" (ShadCN's approach to all components)

**Valid Examples** (component-specific):
- ✅ "Conditional ARIA live regions based on autoplay state" (Carousel-specific accessibility)
- ✅ "Component-name-aware empty state API" (Empty State's contextual semantic pattern)
- ✅ "Built-in illustration presets for absence visualization" (Empty State-specific assets)
- ✅ "Field-level re-rendering optimization" (Form-specific performance pattern)

**Step 4: Identify 2-3 Sophisticated Patterns**

Look for patterns that show:
- **Non-obvious problem solving**: Addresses issues most developers wouldn't initially consider
- **User testing evidence**: Solves problems discovered through actual usage
- **Edge case awareness**: Handles scenarios beyond happy path
- **Contextual intelligence**: Different behavior based on usage context
- **Preventive design**: Stops problems before they occur

**Step 5: Write the Section**

Add to the component's `pattern-research.md` after "Unique Innovations" section:

```markdown
## Sophisticated Design Patterns

### [Framework Name] - [Pattern Name]

**What it does**: [2-3 sentence technical description with code example if relevant]

**Why it's sophisticated**: [Explain the non-obvious problem this solves. What makes this thinking deeper than surface-level? What user need does this address that most developers wouldn't anticipate?]

**Evidence of design maturity**:
- [Bullet point showing user research or edge case handling]
- [Bullet point showing understanding of real-world usage]
- [Bullet point showing restraint or deliberate choice]

[Optional: 1 sentence explaining why this is component-specific]
```

## Quality Standards

**Good Pattern Description:**
- Explains a specific implementation choice unique to this component
- Shows evidence of deep thinking about user needs
- Describes why this is sophisticated, not just what it does
- 3-5 paragraphs total per pattern

**Poor Pattern Description:**
- Lists framework features that apply to all components
- Just describes what exists without explaining why it's sophisticated
- Focuses on technology choices rather than user problems solved
- One sentence with no analysis

## Common Pitfalls

1. **Mistaking architecture for innovation**: Multi-part composition is how Chakra works, not a Button innovation
2. **Describing the framework, not the component**: TypeScript support is framework-wide
3. **Listing features without sophistication**: "Has a disabled state" isn't sophisticated
4. **No evidence of design thinking**: Must explain WHY the pattern is smart, not just WHAT it is

## Completion Criteria

A component is done when its `pattern-research.md` includes:
- **Sophisticated Design Patterns** section with 2-3 examples
- Each example explains: What it does, Why it's sophisticated, Evidence of design maturity
- Examples pass the validation test: component-specific, not framework-wide
