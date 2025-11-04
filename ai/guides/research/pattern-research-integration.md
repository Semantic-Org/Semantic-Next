# Descriptive Linguistics for UI Component Design

## Philosophy

Just as descriptive linguistics documents how language is actually used (rather than prescribing how it should be used), our component research documents how UI patterns exist in the wild. This approach, inspired by works like Garner's Modern American Usage, helps us make informed decisions based on actual usage patterns rather than theoretical ideals.

## The Research-to-Spec Pipeline

```
Research → Analysis → Decision → Specification → Implementation
```

### 1. Research Phase
Component patterns are systematically documented across all major UI frameworks, creating a comprehensive picture of the current landscape. This happens BEFORE we look at our own implementation or make any decisions.

### 2. Analysis Phase
The research report provides usage levels (1-5) based on actual prevalence:
- **Level 1 (90%+)**: De facto standards - users will expect these
- **Level 2 (70-89%)**: Common patterns - strong conventions emerging
- **Level 3 (40-69%)**: Moderate adoption - valid but not universal patterns
- **Level 4 (20-39%)**: Occasional - specialized or emerging patterns
- **Level 5 (<20%)**: Rare - innovative or framework-specific patterns

### 3. Decision Phase
With research in hand, we make informed decisions about what to include in our spec.

## Reading Research Reports

### Pattern Inventory Tables

Each report contains tables organized by Semantic UI's component model:

```markdown
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Text | Display text content | 9/10 (90%) | Level 1 | Ant, Chakra... |
```

**How to interpret:**
- **Pattern**: The specific feature/behavior observed
- **Description**: What it does functionally
- **Prevalence**: Raw count and percentage
- **Usage Level**: Our 1-5 scale for quick decision making
- **Frameworks**: Which implementations have it

### Individual Framework Reports

Located in `ai/research/[component]/[framework]/usage-patterns.md`, these provide:
- Exact implementation details
- Code examples from actual documentation
- Framework-specific philosophy
- URL verification status

These are your primary sources - like field notes in linguistic research.

### URL Verification File

Located in `ai/research/[component]/url-verification.md`, this tracks:
- Which URLs were actually accessible
- Any redirects or broken links
- What was included/excluded from research

This ensures reproducibility and transparency.

## Integrating Research into Spec Building

### Decision Framework

When reviewing research to build a spec, consider:

#### Include by Default (Level 1)
Patterns at 90%+ adoption are table stakes. Users expect these.

**Example:** Horizontal/vertical orientation for dividers (100% adoption)
→ Include as a type in spec

#### Strongly Consider (Level 2)
Patterns at 70-89% represent emerging standards.

**Example:** Text content in dividers (73% adoption)
→ Include unless there's a specific reason not to

#### Evaluate Case-by-Case (Level 3)
Patterns at 40-69% should be evaluated for fit with Semantic UI philosophy.

**Example:** Alignment control (64% adoption)
→ Consider: Does this enhance natural language expression?

#### Innovation Opportunities (Level 4-5)
Patterns below 40% adoption may represent:
- Over-engineering (skip it)
- Genuine innovation (adopt if it solves real problems)
- Unique use cases (include if it fits our philosophy)

**Example:** Responsive dividers (9% adoption - only Semantic UI)
→ Keep it! This is a differentiator that solves real problems

### Practical Application

When building a spec after research:

1. **Start with Level 1 patterns** - These form your base specification
2. **Add Level 2 patterns** that align with natural language principles
3. **Evaluate Level 3 patterns** for genuine utility
4. **Cherry-pick Level 4-5** innovations that solve real problems
5. **Document why** you included or excluded patterns

### Example: Divider Spec Decisions

Based on research showing:
- Dashed/dotted styles (64% adoption, Level 3)
- Raised effect (not found in research, user requested)
- Color customization (27% adoption, Level 4)

Decisions:
- ✅ Include dashed/dotted - high enough adoption, easy to implement
- ✅ Include raised - user need trumps adoption data
- ❌ Skip color customization - use theme tokens instead

## The Descriptive Advantage

This approach gives us:

1. **Evidence-based decisions** - Not just copying, but understanding why patterns exist
2. **Innovation opportunities** - See what nobody else is doing
3. **User expectations** - Know what patterns users already understand
4. **Philosophical clarity** - Choose patterns that fit Semantic UI's vision
5. **Historical record** - Document why decisions were made

## Anti-Patterns to Avoid

❌ **Prescriptive thinking**: "This is how dividers should work"
✅ **Descriptive thinking**: "This is how dividers work in practice"

❌ **Feature parity**: "Framework X has it, so we need it"
✅ **Thoughtful adoption**: "64% have it, and it enhances natural language"

❌ **Innovation for innovation's sake**: "Nobody has this yet!"
✅ **Problem-solving innovation**: "Nobody has this, but it solves a real problem"

## Workflow Integration

1. **Research First** (`research-component-patterns.md`)
   - Gather objective data about patterns in the wild
   - No awareness of current implementation

2. **Analyze and Decide** (this guide)
   - Review research with Semantic UI philosophy in mind
   - Make informed decisions about what to include

3. **Specify** (`spec-authoring-guide.md`)
   - Document chosen patterns in spec format
   - Include usageLevel based on research

4. **Port or Implement** (`port-classic-primitive.md`)
   - Execute on the specification
   - Reference research for implementation details

## Research Updates

As the UI landscape evolves:
- Re-run research periodically (yearly?)
- Track changes in adoption levels
- Identify emerging patterns early
- Document deprecated patterns

This creates a living understanding of UI component patterns, grounded in actual usage rather than theoretical ideals.