# Component Research Marathon Instructions

> Created: 2024-11-04
> Purpose: Persistent instructions for the 29-component research marathon

## Current Status
Researching components from `/ai/research/next.md`.

**Multi-Agent Coordination:**
- `[ ]` = Not started (available for research)
- `[+]` = In progress (claimed by an agent)
- `[x]` = Complete (research finished)

**Workflow:**
1. Find a component marked `[ ]` (skip any marked `[+]` or `[x]`)
2. Change `[ ]` to `[+]` to claim it (signals to other agents you're working on it)
3. Complete all research for that component
4. Change `[+]` to `[x]` when finished
5. Continue to next `[ ]` component

## Process for Each Component

### 1. Setup
```bash
# Check for existing directory
[ -d "ai/research/[component]" ] || mkdir -p ai/research/[component]

# Check for existing URL list
[ -f "ai/research/[component]/url-verification.md" ] && echo "Using existing URLs"
```

### 2. Find URLs
```bash
# Search exhaustive list using component name and aliases
grep -i "[component]" ai/research/ui-list-exhaustive.md
```

Common aliases to check:
- **Button**: button
- **Popup**: popover, tooltip
- **Message**: alert, notification, toast
- **Segment**: section, pane
- **Card**: card, tile
- **Label/Badge**: label, badge, tag, chip
- **Loader**: spinner, loading, progress
- **Dropdown**: select, combobox
- **Tab**: tabs (plural)
- **Header**: navbar, app bar, navigation
- **Rail/Offscreen**: drawer, sidebar, offcanvas
- **Step**: stepper, wizard, steps
- **Menu**: dropdown menu, navigation menu
- **Accordion**: collapse, collapsible, expansion panel
- **Modal**: dialog, overlay
- **Progress Bar**: progress, loading bar
- **Rating**: star rating, rate
- **Search**: autocomplete, search box

### 3. Create URL Verification File
```markdown
# URL Verification for [Component] Research
Date: 2024-11-04
Total URLs found: [N]

## URLs to Research
| Framework | URL | Status | Notes |
|-----------|-----|--------|-------|
| [Framework] | [URL] | Pending | - |
...
```

### 4. Launch Parallel Research
Launch 10-15 Task subagents simultaneously, one per framework. Each subagent:
- Researches one framework's component
- Creates `ai/research/[component]/[framework]/usage-patterns.md`
- Uses the standard research template

### 5. Create Aggregate Report
After all subagents complete:
- Create `ai/research/[component]/pattern-research.md`
- Calculate usage levels (1-5) based on prevalence
- Include all patterns found across frameworks

### 6. Update Tracking
Edit `/ai/research/next.md`:
```markdown
[x] - Component Name  # Change [ ] to [x]
```

## Standard Research Template for Subagents

```markdown
# [Framework] - [Component] Usage Patterns

> Last Modified: 2024-11-04

## Component URL
[URL]
Status: ✅ Working | ❌ 404 | ⚠️ Redirected

## Documentation Quality
[Comprehensive/Good/Basic/Minimal]

## Component Definition
- **Core purpose**: [What problem does it solve?]
- **Mental model**: [How users think about it?]
- **Semantic meaning**: [What does it communicate?]

## Content Patterns
[Table of patterns with Present/Details columns]

## Type Patterns
[Table of patterns with Present/Details columns]

## State Patterns
[Table of patterns with Present/Details columns]

## Variation Patterns
[Table of patterns with Present/Details columns]

## Interactive Patterns
[Table of patterns with Present/Details columns]

## Code Examples
[Include actual code from docs]

## Notable Features
[Unique patterns and innovations]

## Research Notes
[Observations and difficulties]
```

## On Context Compaction

When context compacts, reload this file and:
1. Check `/ai/research/next.md` for progress
2. Continue with next unmarked component
3. Follow the same process without deviation

## Current Todo List State
After Table completes, continue with:
1. Button
2. Popup
3. Message
4. Segment
5. Card
6. Label/Badge
7. Image
8. Container
9. Statistic
10. Placeholder/Skeleton
11. Loader
12. Checkbox
13. Dropdown
14. Breadcrumb
15. Grid
16. List
17. Tab
18. Header
19. Icon
20. Input
21. Rail/Offscreen
22. Step
23. Menu
24. Accordion
25. Modal
26. Progress Bar
27. Rating
28. Search

## Error Handling
If a component research fails:
- Log the error in the URL verification file
- Mark component as incomplete in next.md with note
- Continue to next component
- Do not stop the marathon

## Expected Output Scale
- 29 directories in `/ai/research/`
- ~290-435 individual framework reports
- 29 aggregate pattern research reports
- 29 URL verification files

Total estimated time: Several hours of continuous processing.