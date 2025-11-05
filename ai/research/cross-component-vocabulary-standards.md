# Cross-Component Vocabulary Standards

> **Purpose**: Establish reusable vocabulary patterns for component specs to ensure consistent natural language APIs across 50+ components
> **Status**: Living Document - In Progress
> **Last Modified**: 2025-11-05
> **Research Completion**: Partial (9 of ~50 components researched)

---

## Executive Summary

This document proposes a methodology for establishing **reusable vocabulary patterns** across Semantic UI component specs. Like Classic Semantic UI's patterns (`doubling`, `stackable`, `relaxed`), these vocabulary standards ensure that when multiple components need similar functionality, they use **the same natural language**.

**Not every component needs every pattern** - but when a component spec includes a concept, it should use the standardized vocabulary.

**Living Document Note**: This document will evolve as more component pattern research is completed. Current findings are based on available research files and will be refined as the full component catalog is analyzed.

---

## Methodology

### Phase 1: Extract Vocabulary Candidates from Research

**Source**: Pattern-research.md files in ai/research/[component]/ covering ecosystem analysis

**Current Research Status**:
- ✅ Completed: breadcrumb, button, card, checkbox, container, divider, dropdown, image, label-badge, loader, message, placeholder-skeleton, popup, segment, statistic, table
- 🔄 In Progress: Additional components being researched
- ⏳ Pending: ~35+ components remaining

**Process**:
1. Identify patterns that appear in **multiple component types** (not component-specific)
2. Calculate prevalence (% of frameworks implementing each pattern)
3. Note Classic Semantic UI precedent where it exists
4. Group by semantic category (layout, interaction, visual, semantic meaning)

**Output**: Categorized list of vocabulary candidates with evidence

### Phase 2: Define Vocabulary Standards

For each candidate pattern, document:

1. **Vocabulary Term** - The exact attribute name(s) to use
2. **Natural Language Description** - How it reads in English (e.g., "be dismissed", "appear compact")
3. **Applicable Component Types** - Which component categories should support this
4. **Prevalence Data** - Evidence from ecosystem research (% adoption)
5. **Classic Precedent** - Whether Classic Semantic used this pattern
6. **Spec Structure** - JSON spec format recommendation
7. **Cross-Component Examples** - Show consistency across multiple components

**Output**: Vocabulary pattern catalog organized by category

### Phase 3: Create Decision Framework

**Criteria for including a pattern in a component spec**:

1. **Semantic Fit** - Does this concept make semantic sense for this component?
   - Example: `loading` makes sense for button, not for divider

2. **Usage Level Assessment** - How common is this need?
   - Level 1 (Universal): 90%+ of this component type need it
   - Level 2-3 (Common): 40-89% need it
   - Level 4-5 (Specialized): <40% need it

3. **Ecosystem Precedent** - Do other frameworks provide this?
   - Use prevalence % from research as evidence

4. **Natural Language Test** - Does it read naturally?
   - Example: "A button can be dismissible" ❌ (doesn't read naturally)
   - Example: "A message can be dismissible" ✅ (reads naturally)

**Output**: Decision tree for spec authors

### Phase 4: Standardization Review

**Before adding NEW vocabulary** to any component spec:

1. Check if similar concept already exists in vocabulary catalog
2. If exists: Use the established vocabulary
3. If new: Propose addition to catalog with evidence
4. Ensure consistency with natural language philosophy

**Output**: Vocabulary governance process

---

## Vocabulary Categories (Proposed Taxonomy)

### Category 1: Size & Spacing
**Philosophy**: Physical dimensions and spacing control

Candidates from research:
- `size` (mini→massive) ✅ **Already Standardized** (em-sizing.css)
- `compact` / `very-compact` ✅ **In button.json**
- `relaxed` / `very-relaxed` (Classic Semantic pattern)
- `fluid` (full width) ✅ **In button.json**

**Research Evidence**: Size variants appear in ~90% of all component types across frameworks

### Category 2: Semantic Feedback
**Philosophy**: Communicating meaning through established semantic states

Candidates from research:
- `positive` / `subtle-positive` ✅ **In button.json**
- `warning` / `subtle-warning` ✅ **In button.json**
- `negative` / `subtle-negative` ✅ **In button.json**
- `info` / `subtle-info` ✅ **In button.json**

**Research Evidence**: 100% adoption in feedback components (message, alert, toast) across frameworks
**Source**: message/pattern-research.md, popup/pattern-research.md

### Category 3: Visual Style Variants
**Philosophy**: Consistent visual treatment patterns

Candidates from research:
- `styled` attribute with values: ✅ **In button.json**
  - `solid` (filled background)
  - `soft` (subtle tint)
  - `outline` (border only)
  - `ghost` (hover-only)
  - `link` (underlined link appearance)

**Research Evidence**: 78-90% of modern frameworks support multiple visual variants
**Source**: button/pattern-research.md, label-badge/pattern-research.md

### Category 4: Interaction States
**Philosophy**: Component response to user interaction or async operations

Candidates from research:
- `loading` (async operation in progress)
  - **Research Evidence**: ~90% of interactive components
  - **Source**: button/pattern-research.md, loader/pattern-research.md
  - **In button.json**: ✅ Line 166-169
- `disabled` (interactions blocked)
  - **Research Evidence**: Universal across all interactive components
  - **In button.json**: ✅ Line 148-164
- `active` (selected/current state)
  - **Research Evidence**: ~80% of selectable components
  - **In button.json**: ✅ Line 143-146
- `hover` (pointer over element)
  - **In button.json**: ✅ Line 128-131

### Category 5: Dismissible/Closeable
**Philosophy**: User-controlled visibility

Candidates from research:
- `dismissible` (can be closed by user)
  - **Research Evidence**: 78% in message/alert/notification components
  - **Source**: message/pattern-research.md, popup/pattern-research.md
  - **Classic Semantic**: Used `closable` on message
  - **Recommendation**: Standardize as `dismissible` (more natural English)

**Applicable to**: message, alert, modal, toast, sidebar, banner

### Category 6: Orientation & Layout
**Philosophy**: Directional arrangement of content

Candidates from research:
- `horizontal` / `vertical` (orientation)
  - **Research Evidence**: ~70% in divider, menu, button-group, list
  - **Source**: divider/pattern-research.md, dropdown/pattern-research.md
  - **Classic Semantic**: Used `vertical` on menu, list, buttons
  - **Recommendation**: Boolean attributes `horizontal` / `vertical`

**Note**: Consider whether this should be `orientation="horizontal"` or boolean attributes

### Category 7: Content Arrangement (Classic Patterns)
**Philosophy**: How items within a component relate to each other

Classic Semantic patterns to preserve:
- `divided` (separators between items)
  - Classic: Used on list, items, segments
  - **Source**: divider/pattern-research.md
- `attached` (connects to adjacent content)
  - Classic: Used on segment, button, menu
  - **In button.json**: ✅ Line 173-205 (with directional options)
- `stackable` (responsive stacking)
  - Classic: Used on grid, menu
- `doubling` (responsive column doubling)
  - Classic: Used on grid, cards

### Category 8: Visual Presentation (Classic Patterns)
**Philosophy**: Surface treatment and appearance

Candidates:
- `transparent` (transparent background)
  - **In button.json**: ✅ Line 435-440
- `inverted` (for use on dark backgrounds)
  - Classic: Universal pattern across components
  - **Recommendation**: Should be standard for most visual components
- `circular` (circular shape)
  - **In button.json**: ✅ Line 225-229
  - **Source**: image/pattern-research.md
  - Classic: Used on image, label, button

### Category 9: Emphasis & Hierarchy
**Philosophy**: Visual weight and importance

Candidates:
- `emphasis` attribute with values:
  - `primary` (most important action)
  - `secondary` (secondary importance)
  - **In button.json**: ✅ Line 36-56

**Research Evidence**: 85% of frameworks have primary/secondary distinction

### Category 10: Icon Integration
**Philosophy**: Consistent icon placement and handling

Current button.json approach:
- `icon` attribute (icon name with fuzzy matching)
- `icon-only` setting (boolean - no text spacing)
- `icon-after` setting (boolean - position after text)

**Question for standardization**:
- Should all components use `icon-after` / `icon-before` settings?
- OR should we use slots (`slot="prefix"` / `slot="suffix"`)?
- OR both approaches for different use cases?

**Research Evidence**: Icon integration is universal (~100% of interactive components)
**Source**: button/pattern-research.md, dropdown/pattern-research.md, checkbox/pattern-research.md

### Category 11: Loading States & Animations
**Philosophy**: Asynchronous operation feedback

Candidates from research:
- `loading` (covered in Category 4)
- Animation types for loaders/skeletons:
  - `pulse` (89% adoption)
  - `wave` / `shimmer` (78% adoption)
  - **Source**: loader/pattern-research.md, placeholder-skeleton/pattern-research.md

---

## Pattern Documentation Template

For each standardized vocabulary pattern, document using this structure:

```markdown
## Pattern: [Name]

### Vocabulary
- **Primary attribute**: `[attribute-name]`
- **Values**: [list values or "boolean"]
- **Natural language**: "[component] can [verb phrase]"

### Evidence
- **Ecosystem prevalence**: [X]% of [component types]
- **Classic Semantic**: [Used/Not used] - [details]
- **Research source**: [List pattern-research.md files]
- **Last verified**: [YYYY-MM-DD]

### Applicable Components
Organize by usage level:
- **Level 1 (Essential)**: [Components where this is fundamental]
- **Level 2 (Common)**: [Components where this is frequently needed]
- **Level 3 (Optional)**: [Components where this is occasionally useful]
- **Not applicable**: [Components where this doesn't make semantic sense]

### Spec Structure
```json
{
  "name": "[Display Name]",
  "attribute": "[attribute-name]",
  "usageLevel": [1-5],
  "description": "[natural language description]",
  "options": [
    {
      "name": "[Option Name]",
      "value": "[option-value]",
      "description": "[what this option does]"
    }
  ]
}
```

### Cross-Component Examples
```html
<!-- Show same vocabulary across 3+ different components -->
<ui-[component-1] [attribute]>...</ui-[component-1]>
<ui-[component-2] [attribute]>...</ui-[component-2]>
<ui-[component-3] [attribute]>...</ui-[component-3]>
```

### Implementation Notes
- [Any special considerations for component authors]
- [CSS class generation patterns]
- [Interaction with other patterns]
```

---

## Decision Tree for Spec Authors

When authoring a component spec, follow this process:

```
1. Identify the component's core purpose and behaviors
   ↓
2. For each behavior, ask: "Does similar functionality exist in other components?"
   ↓
   YES → Check vocabulary catalog for established pattern
   |     ↓
   |     Pattern exists → Use the standardized vocabulary
   |     ↓
   |     Pattern doesn't exist → Propose new vocabulary with evidence
   |
   NO → This is component-specific, use component-specific vocabulary
   ↓
3. Apply Natural Language Test
   Does "[component] can [vocabulary]" read naturally?
   ↓
   YES → Include in spec
   NO → Reconsider if this pattern applies to this component
   ↓
4. Determine usage level (1-5) based on ecosystem prevalence
   ↓
5. Document in spec with examples
```

---

## Vocabulary Governance Process

### Adding New Vocabulary

**Before adding new vocabulary to the catalog**:

1. **Research Phase**
   - Document ecosystem prevalence (% of frameworks)
   - Identify which component types use this pattern
   - Check Classic Semantic for precedent

2. **Proposal Phase**
   - Use pattern documentation template
   - Provide evidence from multiple pattern-research.md files
   - Show cross-component examples
   - Demonstrate natural language fit

3. **Review Criteria**
   - Does this solve a real cross-component need?
   - Is the vocabulary natural and intuitive?
   - Does it conflict with existing vocabulary?
   - Is ecosystem adoption sufficient (>40% for specialized, >70% for common)?

4. **Documentation Phase**
   - Add to vocabulary catalog
   - Update decision tree if needed
   - Create cross-references for related patterns
   - Update "Last Modified" date

### Evolving Existing Vocabulary

**When existing vocabulary needs refinement**:

1. Document the issue (ambiguity, conflict, better alternative found)
2. Propose the change with evidence
3. Assess impact on existing components
4. Create migration path if breaking
5. Update all affected documentation
6. Update "Last Modified" date

---

## Integration with Pattern Research

### Using Pattern Research Files

Each pattern-research.md file contains:
- Framework-by-framework analysis
- Pattern prevalence calculations (X/Y frameworks = Z%)
- Usage level classifications (Level 1-5)
- Implementation approaches (Native/Composed/CSS-only)

**How to use for vocabulary standardization**:

1. **Cross-Reference Multiple Components**
   - If a pattern appears in 3+ component types, it's a vocabulary candidate
   - Example: "loading state" appears in button, input, dropdown, card, message

2. **Calculate Weighted Prevalence**
   - Universal (90%+): Strong evidence for standardization
   - Common (70-89%): Should standardize for consistency
   - Moderate (40-69%): Consider standardizing if natural language fits
   - Occasional (<40%): Likely component-specific

3. **Identify Naming Variations**
   - Pattern research documents terminology differences
   - Example: "dismissible" vs "closable" vs "closeable"
   - Choose the most natural English term

4. **Map to Classic Semantic**
   - Where Classic used consistent vocabulary, preserve it
   - Where Classic was inconsistent, improve with modern standards

---

## Examples of Good Vocabulary Standardization

### Example 1: Size System ✅

**Current state**: Already standardized in em-sizing.css and button.json

```json
// In every component spec that needs sizing:
{
  "name": "Size",
  "attribute": "size",
  "usageLevel": 1,
  "options": [
    { "value": "mini", "description": "appear extremely small" },
    { "value": "tiny", "description": "appear very small" },
    { "value": "small", "description": "appear small" },
    { "value": "medium", "description": "appear normal sized" },
    { "value": "large", "description": "appear larger than normal" },
    { "value": "big", "description": "appear much larger than normal" },
    { "value": "huge", "description": "appear very much larger than normal" },
    { "value": "massive", "description": "appear extremely larger than normal" }
  ]
}
```

**Consistency across components**:
```html
<ui-button large>...</ui-button>
<ui-input large>...</ui-input>
<ui-loader large>...</ui-loader>
<ui-message large>...</ui-message>
<ui-label large>...</ui-label>
```

**Natural language**: "A button can be large" ✅ Reads naturally

### Example 2: Semantic Feedback ✅

**Current state**: Already in button.json, should extend to feedback components

```json
// Pattern for message, alert, toast, banner, notification:
{
  "name": "Positive",
  "attribute": "positive",
  "usageLevel": 2,
  "description": "indicate a positive outcome",
  "options": [
    { "value": "positive", "description": "be positive" },
    { "value": "subtle-positive", "description": "subtly indicate positive" }
  ]
}
```

**Consistency across components**:
```html
<ui-button positive>Save</ui-button>
<ui-message positive>Success!</ui-message>
<ui-label positive>Active</ui-label>
<ui-badge positive>New</ui-badge>
```

**Natural language**: "A message can be positive" ✅ Reads naturally

### Example 3: Visual Style Variants ✅

**Current state**: In button.json as `styled`, should extend to similar components

```json
// Pattern for button, badge, label, card:
{
  "name": "Styled",
  "attribute": "styled",
  "usageLevel": 1,
  "options": [
    { "value": "solid", "description": "use a solid color" },
    { "value": "soft", "description": "use a subtle background tint" },
    { "value": "outline", "description": "use no background" },
    { "value": "ghost", "description": "only show styling when hovered" },
    { "value": "link", "description": "appear as an underlined link" }
  ]
}
```

**Consistency across components**:
```html
<ui-button styled="outline">...</ui-button>
<ui-badge styled="outline">...</ui-badge>
<ui-label styled="outline">...</ui-label>
<ui-card styled="outline">...</ui-card>
```

**Natural language**: "A badge can be styled as outline" ✅ Reads naturally

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Component-Specific Naming for Universal Concepts

**Bad**:
```html
<ui-button loading>...</ui-button>
<ui-input fetching>...</ui-input>
<ui-dropdown refreshing>...</ui-dropdown>
```

**Good**:
```html
<ui-button loading>...</ui-button>
<ui-input loading>...</ui-input>
<ui-dropdown loading>...</ui-dropdown>
```

### ❌ Anti-Pattern 2: Inconsistent Value Naming

**Bad**:
```html
<ui-button size="large">...</ui-button>
<ui-input size="big">...</ui-input>
<ui-message size="xl">...</ui-message>
```

**Good**:
```html
<ui-button size="large">...</ui-button>
<ui-input size="large">...</ui-input>
<ui-message size="large">...</ui-message>
```

### ❌ Anti-Pattern 3: Unnatural Language Application

**Bad**: "A divider can be loading" (doesn't make semantic sense)
```html
<ui-divider loading>...</ui-divider>
```

**Good**: Only apply vocabulary where it makes semantic sense
```html
<ui-button loading>...</ui-button>  <!-- ✅ Natural -->
<ui-input loading>...</ui-input>     <!-- ✅ Natural -->
<!-- No loading on divider - doesn't make sense -->
```

### ❌ Anti-Pattern 4: Inventing New Terms for Existing Concepts

**Bad**: Creating `cancelable` when `dismissible` already exists
```html
<ui-modal cancelable>...</ui-modal>
<ui-message dismissible>...</ui-message>
```

**Good**: Use established vocabulary consistently
```html
<ui-modal dismissible>...</ui-modal>
<ui-message dismissible>...</ui-message>
```

---

## Research Status & Next Steps

### Completed Research
- ✅ breadcrumb (url verified, patterns documented)
- ✅ button (patterns documented, spec exists)
- ✅ card (patterns documented)
- ✅ checkbox (patterns documented)
- ✅ container (patterns documented)
- ✅ divider (patterns documented)
- ✅ dropdown (patterns documented)
- ✅ image (patterns documented)
- ✅ label-badge (patterns documented)
- ✅ loader (patterns documented)
- ✅ message (patterns documented)
- ✅ placeholder-skeleton (patterns documented)
- ✅ popup (patterns documented)
- ✅ segment (patterns documented)
- ✅ statistic (patterns documented)
- ✅ table (patterns documented)

### Pending Research
- ⏳ accordion
- ⏳ alert/notification
- ⏳ avatar
- ⏳ breadcrumb (usage patterns)
- ⏳ carousel
- ⏳ chip/tag
- ⏳ date-picker
- ⏳ dialog
- ⏳ form
- ⏳ grid
- ⏳ input (various types)
- ⏳ list
- ⏳ menu/navigation
- ⏳ modal
- ⏳ pagination
- ⏳ progress
- ⏳ radio
- ⏳ rating
- ⏳ select
- ⏳ slider
- ⏳ switch/toggle
- ⏳ tabs
- ⏳ textarea
- ⏳ toast
- ⏳ tooltip
- ⏳ ~20+ additional components

### Immediate Actions

1. **Complete Pattern Extraction** (as research becomes available)
   - Systematically review all pattern-research.md files
   - Extract vocabulary candidates for each category
   - Document prevalence and Classic precedent
   - Update this document with findings

2. **Document Established Patterns** (in progress)
   - Use button.json as the model
   - Document all patterns already in use
   - Create cross-references to other components that should adopt them

3. **Identify Gaps**
   - Which components need specs?
   - Which existing specs are inconsistent with vocabulary standards?
   - Which Classic Semantic patterns are missing?

4. **Create Vocabulary Catalog** (next phase)
   - Use pattern documentation template
   - Organize by category
   - Provide evidence and examples for each
   - Update as new research is completed

5. **Establish Review Process**
   - Define who reviews new vocabulary proposals
   - Create checklist for vocabulary additions
   - Set up documentation maintenance schedule

### Long-Term Goals

- **Vocabulary Catalog**: Complete reference of all standardized patterns
- **Spec Templates**: Pre-populated spec structures for common component types
- **Linting/Validation**: Automated checks for vocabulary consistency
- **Migration Guide**: How to update existing specs to use new vocabulary
- **Component Matrix**: Which components support which vocabulary patterns

---

## References

### Source Documents
- Pattern research files in ai/research/[component]/pattern-research.md
- button.json as vocabulary model (src/primitives/button/specs/button.json)
- em-sizing.css for size standardization (src/css/tokens/computed/em-sizing.css)
- Classic Semantic UI documentation (historical reference)

### Related Guides
- ai/packages/specs.md (Spec system architecture)
- ai/foundations/mental-model.md (Natural language philosophy)
- ai/guides/html/using-ui-primitives.md (Attribute usage patterns)
- ai/guides/research/pattern-research-integration.md (Research methodology)

---

## Document History

| Date | Change | Author/Agent |
|------|--------|--------------|
| 2025-11-05 | Initial document creation with methodology and proposed taxonomy | Claude (Sonnet 4.5) |

---

**Status**: Living Document - Will be updated as component research progresses
**Next Review**: After 5 additional components researched
**Maintainer**: Project team
