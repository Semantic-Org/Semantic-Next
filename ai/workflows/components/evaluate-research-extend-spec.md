# Evaluate Research and Extend Spec

> Last Updated: 2025-11-14

**Purpose**: Present pattern research to the Semantic UI author for informed editorial decisions
**Target**: LLMs working with the Semantic UI author to evolve specifications
**Prerequisites**:
- Pattern research completed (`research-component-patterns.md`)
- Existing spec to potentially extend

> **Note**: Specs are authored as `.spec.js` files (JavaScript modules), not JSON. The build system generates `.spec.json` snapshots for tooling.

## Overview

This workflow guides the presentation of UI pattern research to the Semantic UI author, who makes editorial decisions based on the evidence, their point of view, and first principle judgements on framework authoring.

**The Author's Role**: Make editorial decisions from a strong point of view about what belongs in Semantic UI, grounded in first principles about framework design, semantic clarity, and long-term maintainability.

**The AI's Role**: Act as the community advocate, using adoption data to represent what language and patterns users actually need. Present evidence of real-world usage to ensure the framework serves its users effectively while respecting the author's vision.

## Process

### 1. Load Research and Current Spec

**First, load the research report:**
```bash
# Read the pattern research
cat ai/research/[component]/pattern-research.md
```

**Then load and analyze current spec:**
```bash
# Read current specification
cat src/primitives/[component]/specs/[component].spec.js
```

**Create a comprehensive comparison:**
```
"I've loaded the research showing [N] patterns across [M] frameworks.

## Current Spec Analysis:

### Content Features:
- Text: ✅ Present [or ❌ Not present]
- Icon: ✅ Present
[List all current content features]

### Types:
- Vertical: ✅ Present
[List all current types]

### Variations:
- Spacing: ✅ Present with options: [mini, small, medium, large...]
[List all current variations with their options]

### States:
[List any current states]

Now let's evaluate how research can enhance or extend these features."
```

### 2. Identify Enhancement Opportunities

Before adding new patterns, identify how research can enhance existing features:

#### Enhance Existing Features
```
"## Enhancements to Existing Features

Based on research, here's how we could enhance what we already have:

### Spacing Variation (Currently: mini→massive)
Research shows:
- 4/11 frameworks use t-shirt sizes (xs, sm, md, lg, xl)
- 3/11 use numeric scales (1, 2, 3, 4)
- 2/11 use semantic names (compact, normal, relaxed)

Enhancement opportunity: Add 'micro' size (found in 2 frameworks)
Current gaps: None - we have the most comprehensive spacing system ✓

### Styled Type (Currently: solid, fade, soft, double)
Research shows these additional styles:
- Dashed: 7/11 frameworks (64%) - NOT IN CURRENT SPEC
- Dotted: 5/11 frameworks (45%) - NOT IN CURRENT SPEC
- Gradient: 1/11 frameworks (9%)

Enhancement opportunity: Add 'dashed' and 'dotted' options
[Continue for each existing feature]
"
```

#### Missing Options for Existing Attributes
```
"## Missing Options for Existing Attributes

These patterns fit into attributes we already have:

1. **Styled='dashed'** - Fits into existing 'styled' attribute
   - Adoption: 64% (Level 3)
   - Simple addition to existing API

2. **Spacing='micro'** - Extends existing spacing scale
   - Adoption: 18% but logical extension
   - Maintains consistency with our sizing system
"
```

### 3. Present New Patterns by Usage Level

Now present completely new patterns not currently in the spec:

#### Level 1 Patterns (90%+ adoption)
```
"## Universal Patterns (Level 1 - Found in 90%+ of frameworks)

These are essentially standard. Not including them may confuse users:

1. **[Pattern Name]** - [Description]
   - Found in: [X/Y frameworks (Z%)]
   - What it does: [Explanation]
   - Implementation approach: [How it typically works]

   Should we include this? It's expected by most users."
```

**Decision prompt**: For each Level 1 pattern, actively recommend inclusion unless there's a strong reason not to.

#### Level 2 Patterns (70-89% adoption)
```
"## Common Patterns (Level 2 - Found in 70-89% of frameworks)

These represent strong emerging conventions:

1. **[Pattern Name]** - [Description]
   - Found in: [X/Y frameworks (Z%)]
   - What it does: [Explanation]
   - Semantic UI fit: [How well it aligns with our philosophy]

   This is becoming standard. Should we include it?"
```

**Decision prompt**: Lean toward inclusion but evaluate fit.

#### Level 3 Patterns (40-69% adoption)
```
"## Moderate Adoption (Level 3 - Found in 40-69% of frameworks)

These patterns have meaningful adoption but aren't universal:

1. **[Pattern Name]** - [Description]
   - Found in: [X/Y frameworks (Z%)]
   - Use case: [When/why someone would need this]
   - Complexity vs benefit: [Assessment]

   This has moderate adoption. Is it valuable for our users?"
```

**Decision prompt**: Neutral presentation, evaluate case-by-case.

#### Level 4-5 Patterns (Under 40% adoption)
```
"## Rare/Innovative Patterns (Level 4-5 - Found in <40% of frameworks)

These are specialized or innovative patterns:

1. **[Pattern Name]** - [Description]
   - Found in: [X/Y frameworks (Z%)]
   - Innovation potential: [What makes this unique]
   - Problem it solves: [Specific use case]

   This is uncommon. Does it solve a real problem or add unnecessary complexity?"
```

**Decision prompt**: Skeptical by default, but highlight genuine innovations.

### 3. Review User-Requested Features

```
"## User-Requested Features

These weren't found in research but have been requested:

1. **[Feature Name]** - [User's description]
   - Similar to: [Any patterns from research that are related]
   - Implementation approach: [How we could build it]

   This is a unique request. Should we innovate here?"
```

### 4. Present for Editorial Decision

For each pattern, present the evidence and await the author's decision:

```
"For [Pattern Name]:
- Adoption: [Level X - Y%]
- Benefit: [What it enables]
- Cost: [Implementation complexity]
- Philosophy fit: [Alignment with Semantic UI]

[Optional: Here's how it typically works in other frameworks...]

What's your decision on this pattern?"
```

**Important**: The AI should present evidence clearly but recognize that:
- Low adoption doesn't mean a bad idea (the author may have pioneered patterns before)
- High adoption doesn't mandate inclusion (it may not fit Semantic UI's vision)
- The author's experience may reveal use cases not captured in research
- Semantic UI has always been opinionated about doing things the "right" way

### 5. Document Decisions

As decisions are made, track them:

```markdown
## Spec Extension Decisions

### Patterns to Add
- ✅ **[Pattern Name]** (Level X): [Reason for inclusion]
- ✅ **[Pattern Name]** (Level X): [Reason for inclusion]

### Patterns to Skip
- ❌ **[Pattern Name]** (Level X): [Reason for exclusion]
- ❌ **[Pattern Name]** (Level X): [Reason for exclusion]

### Patterns to Modify
- 🔄 **[Pattern Name]** → **[Our Version]**: [How we're adapting it]

### Innovations (Not in Research)
- 🆕 **[Pattern Name]**: [Why we're adding this unique feature]
```

### 6. Update Specification

Once decisions are finalized:

```bash
# Update the spec with agreed additions
# Include appropriate usageLevel based on our assessment
```

**Understanding usageLevel (Progressive Disclosure)**

The `usageLevel` property (1-5) controls how features appear in documentation through progressive disclosure. This is separate from research adoption percentages, which inform *what* to add, not *how often users will need it*.

**Usage Level Definitions:**

- **Level 1 - Essential**: Always visible, used in most implementations
  - Example: `text` content on divider, `size` variation on button
  - Criteria: 80%+ of users will need this feature

- **Level 2 - Common**: Shown by default in documentation
  - Example: `icon` content on divider, `primary` type on button
  - Criteria: 40-80% of users will need this feature

- **Level 3 - Advanced**: Hidden behind "Show more" or "Advanced options"
  - Example: `vertical` type on divider, `align` variation
  - Criteria: 15-40% of users will need this feature

- **Level 4 - Specialized**: For specific use cases, deeply nested in docs
  - Example: `thickness` variation on divider, `inverted` variation
  - Criteria: 5-15% of users will need this feature

- **Level 5 - Expert**: Rarely needed, for edge cases
  - Example: `clearing` variation on divider (legacy float clearing)
  - Criteria: <5% of users will need this feature

**Assigning Usage Levels to New Features:**

When adding features from research, ask:
- "How often will users need this feature?"
- "Is this core functionality or specialized?"
- "Does this solve a common problem or edge case?"

**Examples:**

- **Pattern**: Dashed divider style (found in 64% of frameworks)
  - **Decision**: Add as `styled="dashed"`
  - **usageLevel**: 2 (common alternative to default style)
  - **Reasoning**: While 64% of frameworks offer it, most users use default styles. Those who need style variants will use this moderately.

- **Pattern**: Divider thickness control (found in 45% of frameworks)
  - **Decision**: Add as `thickness="thin|medium|thick"`
  - **usageLevel**: 4 (specialized control)
  - **Reasoning**: Despite decent adoption, this is visual fine-tuning. Most users are satisfied with default thickness.

- **Innovation**: Gradient divider style (not found in research)
  - **Decision**: Add as `styled="gradient"`
  - **usageLevel**: 5 (experimental feature)
  - **Reasoning**: New feature without proven demand. Start at level 5, adjust based on usage data.

**Note**: Research adoption percentages inform whether to include a feature. Usage levels reflect how frequently we expect users to need that feature in practice. A pattern found in 90% of frameworks might still be usageLevel 3-4 if it solves specialized use cases.

### 7. Create Decision Record

Save a record of this evaluation:

```
ai/research/[component]/spec-decisions.md
```

Include:
- Date of evaluation
- Research data reviewed
- Decisions made and reasoning
- Patterns deliberately excluded and why
- Innovations added beyond research

## Interaction Patterns

### When User Wants Quick Decisions
```
"Would you like me to:
1. Recommend all Level 1-2 patterns for inclusion?
2. Review each pattern individually?
3. Focus only on patterns above a certain adoption threshold?"
```

### When the Author Wants More Context
```
"Let me show you how other frameworks implement this:
[Show 2-3 concrete examples from research]

This pattern typically provides [benefits].
The tradeoff is [complexity/constraints].

Some additional context:
- [Historical evolution of this pattern]
- [Problems it was designed to solve]"
```

### When Adoption Data Conflicts with Vision
```
"This pattern has [X%] adoption, which suggests it's [common/rare].

However, I understand Semantic UI has often been ahead of trends.
Would you like to see the specific implementations to evaluate if they're
solving this problem the right way?"
```

### Recognizing Author Expertise
```
"You implemented [similar pattern] in classic Semantic UI before it became common.
This new pattern seems related but takes a different approach.

The mainstream approach is [X].
Your original approach was [Y].

How do you see this evolving?"
```

## AI's Role in Decision Support

### Present Evidence, Not Prescriptions
The AI should:
- Present adoption data objectively
- Show concrete examples from other frameworks
- Highlight tradeoffs and implementation complexity
- Note alignment or conflicts with Semantic UI patterns

The AI should NOT:
- Make decisions based solely on percentages
- Assume high adoption means required inclusion
- Dismiss patterns with low adoption
- Override the author's vision with "best practices"

### Recognize Historical Context
- Semantic UI pioneered many patterns before they became common
- The framework has always prioritized semantic clarity over trends
- Natural language patterns matter more than technical conventions
- The author's experience includes seeing patterns rise and fall

### Support Informed Editorial Decisions
The author brings:
- Deep understanding of user needs from years of framework development
- Knowledge of which patterns have stood the test of time
- Insight into what makes APIs truly semantic
- Experience with the maintenance burden of different patterns

The AI brings:
- Current data on what patterns exist across frameworks
- Concrete examples of different implementations
- Objective measurement of pattern prevalence
- Fresh perspective on emerging trends

## Example Session

```
Assistant: "I've loaded the divider research showing 47 patterns across 11 frameworks.
Current spec includes: text, icon, vertical, styled, spacing, hidden, clearing.

Let's review patterns not currently in our spec.

## Universal Patterns (Level 1 - Found in 90%+ of frameworks)

1. **Horizontal Orientation** - Default horizontal line
   - Found in: 11/11 frameworks (100%)
   - Already in spec implicitly as default

All Level 1 patterns are covered! ✓

## Common Patterns (Level 2 - Found in 70-89% of frameworks)

1. **ARIA Separator Role** - Accessibility support
   - Found in: 8/11 frameworks (73%)
   - What it does: Adds role='separator' for screen readers
   - Semantic UI fit: Enhances accessibility without API change

   This is becoming standard. Should we include it?"

User: "Yes, but make it automatic, not a setting"