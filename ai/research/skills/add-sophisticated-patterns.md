# Add Sophisticated Design Patterns Section

This checklist tracks which component research reports have the "Sophisticated Design Patterns" section properly filled with **component-specific** innovations (not framework-wide patterns).

## Instructions for Agents

### Source Materials

Before adding this section to a component, read:

1. **Workflow Definition**: `ai/workflows/components/research-component-patterns.md`
   - Lines 357-383: "Sophisticated Design Patterns" section requirements
   - Lines 339-356: "Unique Innovations (Level 5)" validation criteria
   - Lines 264-269: "Notable Features" guidelines (what NOT to include)

2. **Example Components**: Review these completed examples:
   - `ai/research/components/empty-state/pattern-research.md` - Good example with 2 patterns
   - `ai/research/components/carousel/pattern-research.md` - Good example (once added)

### Systematic Process

For each unchecked component:

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

**Step 6: Update This Checklist**

Mark the component as complete:
```bash
# In this file, change [ ] to [x] for the component
- [x] ComponentName
```

### Quality Standards

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

### Common Pitfalls

1. **Mistaking architecture for innovation**: Multi-part composition is how Chakra works, not a Button innovation
2. **Describing the framework, not the component**: TypeScript support is framework-wide
3. **Listing features without sophistication**: "Has a disabled state" isn't sophisticated
4. **No evidence of design thinking**: Must explain WHY the pattern is smart, not just WHAT it is

### Expected Time

- **Reading**: 10-15 minutes per component (aggregate + individual reports)
- **Analysis**: 5-10 minutes (applying validation test, identifying patterns)
- **Writing**: 10-15 minutes (2-3 patterns with full explanations)
- **Total**: ~30 minutes per component

## Checklist

### Criteria for Completion
A component is checked off when its `pattern-research.md` includes:
- **Sophisticated Design Patterns** section with 2-3 examples
- Each example explains: What it does, Why it's sophisticated, Evidence of design maturity
- Examples pass the validation test: "If we removed this component, would this feature still exist in other components?" → NO
- Focus on component-specific innovations, NOT framework-wide patterns

---

- [x] Divider / Separator
- [x] Table
- [x] Button
- [x] Popup
- [x] Message
- [x] Segment
- [x] Card
- [x] Label / Badge
- [x] Image
- [x] Container
- [x] Statistic
- [x] Placeholder / Skeleton
- [x] Loader
- [x] Checkbox
- [x] Dropdown
- [x] Breadcrumb
- [x] Grid
- [x] List
- [x] Tab
- [x] Header
- [x] Icon
- [x] Input
- [x] Rail / Offscreen
- [x] Step
- N/A Menu (covered by context-menu, menubar, navigation-menu)
- [x] Accordion
- [x] Modal
- [x] Progress Bar
- [x] Rating
- [x] Search
- [x] Toast / Snackbar
- [x] Tooltip
- [x] Alert / Notification
- [x] Switch / Toggle
- [x] Textarea
- [x] Radio Button / Radio Group
- [x] Avatar
- [x] Drawer / Offcanvas / Sheet
- [x] Pagination
- [x] Form
- [x] Chip / Tag / Pill
- [x] Link
- [x] Select
- [x] Navbar / App Bar
- [x] Slider (Range Input)
- [x] Popover / Hover Card
- [x] Text / Typography
- [x] Timeline
- [x] Carousel
- [x] Calendar / Date Picker
- [x] Autocomplete / Combobox
- [x] Tree / Tree View
- [x] Empty State - Has Ant Design's component-aware API and illustration presets
- [x] File Upload
- [x] Code
- [x] Stepper / Wizard
- [x] Stack (Layout)
- [x] Flex (Layout)
- [x] Box (Layout)
- [x] Form Field
- [x] Number Input
- [x] Password Input
- [x] Color Picker
- [x] Heading
- [x] Space (Layout)
- [x] Scroll Area
- [x] Command Palette
- [x] Context Menu
- [x] Portal
- [x] Center (Layout)
- [x] Menubar
- [x] Result
- [x] Kbd (Keyboard Key)
- [x] Aspect Ratio
- [x] Chart
- [x] Transfer / Transfer List
- [x] QR Code
- [x] Navigation Menu
- [x] Progress

---

## Progress
- **Completed**: 78 / 78 components (100%)
- **Note**: "Menu" doesn't exist as a standalone component - it's covered by context-menu, menubar, and navigation-menu

## Notes
- This section was added to the workflow on 2025-11-10
- Components researched before this date need to be reviewed and updated
- Focus on finding patterns that solve **non-obvious problems** specific to the component type
- Bulk update completed on 2025-11-10 using parallel agents
