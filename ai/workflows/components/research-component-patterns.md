# Research Component Patterns

## Purpose
Conduct descriptive research on UI component patterns across modern frameworks, similar to how linguistic research documents actual language usage. This workflow generates an objective report on how a specific component is implemented across the UI framework ecosystem.

## Philosophy
This is **descriptive, not prescriptive** - we're documenting what exists in the wild, not making judgments about what should exist. Like Garner's Modern American Usage surveys actual newspaper usage, we survey actual framework implementations.

## Process

### 0. Initialize Task Tracking

**Start with TodoWrite tool:**
```
Create a todo list with these items:
1. Search exhaustive list for all [component] components
2. Create URL verification file
3. Research all frameworks in parallel
4. Generate individual framework reports
5. Compile aggregate pattern research report
6. Review and validate all reports
7. Add documentation metadata
```

Update status as you progress through each phase for clear progress tracking.

### 1. Identify Component and Sources

**First, check for existing resources:**
```bash
# Check if research directory already exists
if [ -d "ai/research/[component]" ]; then
  echo "Using existing research directory"
  # Check for existing URL verification file
  if [ -f "ai/research/[component]/url-verification.md" ]; then
    echo "Found existing URL list - will use as starting point"
  fi
fi
```

**If URL verification file exists:**
- Read the existing file
- Use it as your URL source
- Skip the grep search of ui-list-exhaustive.md
- Proceed directly to research phase
- Update statuses as you verify each URL

**If no existing URL file, verify the component to research:**
```
"I'll be researching the [COMPONENT] component patterns across UI frameworks."
```

**Then locate ALL sources from `ai/research/ui-list-exhaustive.md`:**

**Tool Usage Instructions:**
```bash
# Always use Grep for the exhaustive list (file is too large to read directly)
grep -i "divider\|separator" ai/research/ui-list-exhaustive.md

# Note: The file contains 3 separate sections with component listings
# You must search for ALL occurrences, not just the first match
```

**Extract and document URLs:**

Create a URL verification file at:
```
ai/research/[component]/url-verification.md
```

**File format:**
```markdown
# URL Verification for [Component] Research
Date: [Current Date]
Total URLs found: [N]

## URLs to Research
| Framework | URL | Status | Notes |
|-----------|-----|--------|-------|
| Ant Design | https://ant.design/components/divider | Pending | - |
| Chakra UI | https://chakra-ui.com/docs/components/divider | Pending | - |
...

## Verification Results
[Update as you verify each URL]
- ✅ Working: [N]
- ⚠️ Redirected: [N]
- ❌ 404/Broken: [N]
- ⏭️ Skipped (duplicate): [N]
```

**Process:**
1. Create this file BEFORE starting research
2. Update status as you verify each URL
3. Note any redirects or issues
4. This becomes the source of truth for what was actually researched

**Important:**
- Research ALL listed implementations across all sections
- Some URLs may be incorrect or hallucinated - verify and document
- Update the status column as you progress

### 1a. Directory Setup

**Check for existing structure, create if needed:**
```bash
# Only create if doesn't exist
[ ! -d "ai/research/[component]" ] && mkdir -p ai/research/[component]
```

Benefits of pre-created structure:
- Prevents file creation errors
- May contain pre-populated URL lists
- Could have partial research from previous runs
- Ensures organized storage of all reports

### 2. Create Individual Framework Reports

**Research Strategy:**

**If running as primary agent (not already a subagent):**
- Launch parallel Task tools for each framework
- Each subagent researches one framework independently
- All subagents create their reports simultaneously
- Significant time savings (10 frameworks in parallel vs sequential)

**If already running as subagent:**
- Research frameworks sequentially
- Cannot spawn additional subagents from within a subagent

**Parallel invocation approach:**
```
To run in parallel, invoke multiple Task tools in a single message:

"I'll research all frameworks in parallel. Launching subagents now..."

[Then invoke multiple Task tools in the same response - one for each framework]

Task 1: Research Ant Design divider
Task 2: Research Chakra UI divider
Task 3: Research MUI divider
... (all in the same message)
```

**Important**: Must be multiple tool invocations in ONE message, not separate messages

**Efficiency tip**: Include in each subagent prompt: "Note the framework version if visible on the page"

**Subagent Prompt Engineering:**

When launching parallel subagents, provide comprehensive prompts including:
1. The specific URL to research
2. The complete report template (inline, not just a reference)
3. The exact file path to save the report
4. Clear success criteria

Example prompt structure:
```
Research the divider component from [Framework] at [URL]

Create a detailed report and save it to: ai/research/[component]/[framework]/usage-patterns.md

Use this template for the report:
[Include complete template here]

Include actual code examples from the docs.
```

**For each framework, create a detailed report:**

Save to: `ai/research/[component]/[framework-name]/usage-patterns.md`

Example: `ai/research/divider/ant-design/usage-patterns.md`

**Report Template:**
```markdown
# [Framework Name] - [Component] Usage Patterns

## Component URL
[URL]
Status: ✅ Working | ❌ 404 | ⚠️ Redirected to [new URL]
Version: [Detected version if visible, or "Current" if unknown]
Last Verified: [YYYY-MM-DD]

## Documentation Quality
[Brief assessment: Comprehensive/Good/Basic/Minimal]

## Component Definition
- **Core purpose**: [What fundamental problem does it solve?]
- **Mental model**: [How do users think about this component?]
- **Semantic meaning**: [What does it communicate in the UI?]

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `text="Hello"`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅/❌ | Native/Composed/CSS-only | [Details if present] |
| Icon support | ✅/❌ | Native/Composed/CSS-only | [Details if present] |
| Media support | ✅/❌ | Native/Composed/CSS-only | [Details if present] |
| Custom content | ✅/❌ | Native/Composed/CSS-only | [Details if present] |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal | ✅/❌ | Native/Composed/CSS-only | [Details] |
| Vertical | ✅/❌ | Native/Composed/CSS-only | [Details] |
| [Other types] | ✅/❌ | Native/Composed/CSS-only | [Details] |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅/❌ | Native/Composed/CSS-only | [Details] |
| Disabled | ✅/❌ | Native/Composed/CSS-only | [Details] |
| [Other states] | ✅/❌ | Native/Composed/CSS-only | [Details] |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅/❌ | Native/Composed/CSS-only | [e.g., sm, md, lg] |
| Spacing control | ✅/❌ | Native/Composed/CSS-only | [Details] |
| Visual styles | ✅/❌ | Native/Composed/CSS-only | [e.g., solid, dashed] |
| Color options | ✅/❌ | Native/Composed/CSS-only | [Details] |
| Alignment | ✅/❌ | Native/Composed/CSS-only | [e.g., left, center, right] |

## Code Examples
```jsx
// Primary usage example
[Include actual code example from docs]
```
[View Live](URL-to-specific-example) *(if available)*

## Notable Features
- [Any unique or innovative patterns]
- [Implementation details worth noting]

## Research Notes
- [Any difficulties accessing docs]
- [Observations about the framework's approach]
```

### 3. Compile Aggregate Report

After completing all individual framework reports, compile the final analysis.

**Use the individual reports to calculate pattern frequency:**

**Usage Level Scale:**
- **Level 1 (Universal)**: Found in 90%+ of implementations
- **Level 2 (Common)**: Found in 70-89% of implementations
- **Level 3 (Moderate)**: Found in 40-69% of implementations
- **Level 4 (Occasional)**: Found in 20-39% of implementations
- **Level 5 (Rare)**: Found in <20% of implementations

Include exact counts: "Found in 7 of 10 frameworks (70%) = Level 2"

### 4. Generate Report

Structure the report as:

```markdown
# Component Pattern Research: [Component Name]

> Last Modified: [YYYY-MM-DD]

## Research Summary
- Frameworks surveyed: [N]
- Date: [Date]
- Unique patterns identified: [N]

## Component Definition Consensus
[Synthesize how frameworks conceptualize this component]

## Terminology Variations
[Map equivalent terms across frameworks]
- Component names: "X" (N frameworks) = "Y" (N frameworks)
- Prop names: "orientation" = "direction" = "vertical"
- Values: "start/end" (i18n) = "left/right" (legacy)

## Pattern Inventory

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Text | Display text content | 9/10 (90%) | Level 1 | Ant, Chakra, MUI... |

### Type Patterns
[Table format as above]

### State Patterns
[Table format as above]

### Variation Patterns
[Table format as above]

## Notable Patterns

### Highly Adopted (Level 1-2)
- Patterns that are becoming standard
- Clear consensus on implementation

### Emerging Patterns (Level 3-4)
- Patterns with moderate adoption
- May indicate evolving best practices

### Unique Innovations (Level 5)
- Framework-specific innovations
- Potentially ahead of the curve or solving niche needs

## Pattern Correlations
[Document which patterns appear together]
- When [Pattern A] exists → [Pattern B] present in X/Y frameworks
- [Pattern C] excludes [Pattern D] in X/Y frameworks

## Implementation Notes
[Any technical patterns observed - naming conventions, API designs, etc.]

## Raw Data
[Link to detailed notes for each framework if stored separately]
```

### 5. Post-Research Quality Control

**After all individual reports are complete, perform validation:**

1. **Read All Individual Reports**
   - Thoroughly review each framework's usage-patterns.md
   - Note any incomplete or unclear sections
   - Identify patterns that need clarification

2. **Validate Pattern Counts**
   ```bash
   # Example: Count frameworks with text content support
   grep -h "| Text content |" ai/research/[component]/*/usage-patterns.md | cut -d'|' -f3 | sort | uniq -c
   ```
   - Verify percentages in aggregate report match actual counts
   - Check for counting errors or misclassifications
   - Note edge cases (e.g., composition vs built-in support)

3. **Check for Discrepancies**
   - Compare individual reports with aggregate report
   - Identify missing frameworks or patterns
   - Note any frameworks that couldn't be researched
   - Flag inconsistent terminology or classifications

4. **Update Reports as Needed**
   - Correct any counting errors
   - Clarify ambiguous patterns
   - Add missing information
   - Update Last Modified dates

5. **Final Documentation Updates**
   - Update url-verification.md with final statuses
   - Add "Last Modified: [YYYY-MM-DD]" to all reports
   - Note research methodology changes or limitations

### 6. Storage and URL Updates

**Individual framework reports:**
```
ai/research/[component]/[framework-name]/usage-patterns.md
```

**Final aggregate report:**
```
ai/research/[component]/pattern-research.md
```

**Check for existing aggregate report:**
- If exists, review and update rather than recreating
- Preserve valuable analysis while correcting errors
- Note updates in report metadata

**Update exhaustive list if URLs have changed:**
If you found any 404s or incorrect URLs, update the exhaustive list:
```
ai/research/ui-list-exhaustive.md
```
Document the changes:
- Mark 404 URLs with [BROKEN]
- Update redirected URLs to their new location
- Add a comment with the date of verification

## Usage Notes

**For Subagent Invocation:**
```javascript
{
  "description": "Research component patterns",
  "prompt": "Follow the workflow in ai/workflows/components/research-component-patterns.md to research [COMPONENT] patterns across all frameworks listed in ai/research/ui-list-exhaustive.md. Generate a complete pattern research report.",
  "subagent_type": "general-purpose"
}
```

**Key Principles:**
- Be exhaustive - research ALL listed sources
- Be objective - document what exists, not what's "good"
- Be systematic - use consistent categories across all frameworks
- Be quantitative - calculate actual usage levels
- Be descriptive - this is linguistic-style field research

## Relationship to Other Workflows

- **Use BEFORE** `port-classic-primitive.md` - provides data for informed decisions
- **Independent of** current specs - research first, design second
- **Complements** implementation workflows - provides the "why" behind choices

## Examples

**Good Pattern Description:**
"Text content with alignment control - Found in 7/10 frameworks (70%, Level 2). Allows start/center/end positioning of text within component bounds."

**Poor Pattern Description:**
"Some frameworks have text alignment which seems useful."

The goal is rigorous, reproducible research that documents the actual state of UI patterns in the wild.