# Component Pattern Research: List

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 10
- Date: 2025-11-05
- Unique patterns identified: 60+
- Research coverage: Ant Design, Chakra UI, Mantine, MUI, PrimeReact (Listbox + OrderList), Semantic UI Classic, Vuetify, HeroUI, ShadCN (no component)

## Component Definition Consensus

List components across frameworks solve the fundamental problem of **displaying collections of related items in a structured, consistent format**. They provide:

- **Semantic structure** through proper HTML list elements (ul, ol, li)
- **Visual consistency** for presenting multiple items
- **Flexible content** supporting text, icons, avatars, actions, and rich media
- **Interaction patterns** including selection, navigation, and reordering
- **Layout control** for vertical/horizontal/grid arrangements

**Mental Models:**
- **Display Lists** (7/10 frameworks): Present information in structured format (Ant, Chakra, Mantine, MUI, Semantic UI, Vuetify, HeroUI)
- **Selection Lists** (3/10 frameworks): Form controls for selecting items (PrimeReact Listbox, HeroUI Listbox)
- **Reordering Lists** (1/10 frameworks): Specialized for changing item order (PrimeReact OrderList)

**Framework Philosophy Split:**
- **Composition-based**: Multiple sub-components working together (MUI, Chakra, Mantine)
- **Configuration-based**: Single component with extensive props (Ant Design, Vuetify)
- **Form-focused**: Selection and data entry (PrimeReact)
- **CSS-first**: Classes for styling (Semantic UI)

## Terminology Variations

### Component Names
- **List**: Ant Design, Chakra UI (List.Root), Mantine, MUI, Semantic UI, Vuetify (v-list)
- **Listbox**: PrimeReact, HeroUI (selection-focused variant)
- **OrderList**: PrimeReact (reordering-focused variant)
- **No Component**: ShadCN (uses Item component for list-like patterns)

### Sub-Component Names
- **List Item**: ListItem (MUI, Vuetify), List.Item (Chakra, Mantine, Ant)
- **List Icon**: ListItemIcon (MUI), List.Indicator (Chakra), icon prop (Mantine)
- **List Text**: ListItemText (MUI), List.Item.Meta (Ant), content slots (Vuetify)
- **List Avatar**: ListItemAvatar (MUI), List.Item.Meta with avatar (Ant)

### List Types
- **Unordered**: Default `<ul>` (9/9 display-focused frameworks)
- **Ordered**: `<ol>` via type/as prop (9/9 display-focused frameworks)
- **Navigation**: Semantic nav lists for menus (MUI, Vuetify, Semantic UI)
- **Selection**: Listbox role for form inputs (PrimeReact, HeroUI)

## Pattern Inventory

### Core Structural Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Unordered lists (ul) | Default bullet list | 9/9 (100%) | Level 1 | All display frameworks |
| Ordered lists (ol) | Numbered/lettered lists | 9/9 (100%) | Level 1 | All display frameworks |
| List items (li) | Individual entries | 10/10 (100%) | Level 1 | All |
| Nested lists | Lists within list items | 9/9 (100%) | Level 1 | All display frameworks |
| Semantic HTML | Proper ul/ol/li structure | 9/9 (100%) | Level 1 | All display frameworks |

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Text content | Plain text items | 10/10 (100%) | Level 1 | All |
| Icons | Icon/indicator before text | 9/10 (90%) | Level 1 | All except OrderList |
| Avatars | Profile images/avatars | 7/10 (70%) | Level 2 | Ant, MUI, Vuetify, Semantic, HeroUI, PrimeReact Listbox |
| Images | Embedded images | 6/10 (60%) | Level 2 | Ant, MUI, Vuetify, Semantic, HeroUI, PrimeReact |
| Rich content | Complex nested content | 9/10 (90%) | Level 1 | All except OrderList focus |
| Actions/buttons | Action buttons per item | 7/10 (70%) | Level 2 | Ant, MUI, Vuetify, PrimeReact, HeroUI, Semantic |
| Metadata | Title + description patterns | 8/10 (80%) | Level 1 | Ant, Chakra, Mantine, MUI, Vuetify, HeroUI, PrimeReact, Semantic |
| Links | Clickable navigation items | 10/10 (100%) | Level 1 | All |

### Layout Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Vertical layout | Stacked items (default) | 10/10 (100%) | Level 1 | All |
| Horizontal layout | Inline items | 4/10 (40%) | Level 3 | Ant, Semantic, Vuetify (via CSS), MUI (via flex) |
| Grid layout | Multi-column grid | 2/10 (20%) | Level 4 | Ant Design (native), MUI (via external Grid) |
| Dense/compact mode | Reduced spacing | 7/10 (70%) | Level 2 | Ant, MUI, Vuetify, PrimeReact, HeroUI, Semantic (relaxed/compact) |
| Card-style items | Items as cards | 3/10 (30%) | Level 3 | Ant (composition), MUI (composition), Vuetify |

### Interactive Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Clickable items | onClick handlers | 10/10 (100%) | Level 1 | All |
| Single selection | Select one item | 5/10 (50%) | Level 2 | MUI, Vuetify, PrimeReact Listbox, HeroUI, OrderList |
| Multi-selection | Select multiple items | 5/10 (50%) | Level 2 | MUI, Vuetify, PrimeReact Listbox, HeroUI, OrderList |
| Hover states | Visual feedback on hover | 9/10 (90%) | Level 1 | All except plain Semantic |
| Ripple effects | Material Design ripples | 2/10 (20%) | Level 4 | MUI, Vuetify |
| Keyboard navigation | Arrow keys, enter, space | 7/10 (70%) | Level 2 | MUI, Vuetify, PrimeReact (both), HeroUI, Semantic |
| Drag and drop | Reorder via drag | 1/10 (10%) | Level 5 | PrimeReact OrderList (native) |
| Expandable items | Collapsible content | 4/10 (40%) | Level 3 | MUI (nested), Vuetify (groups), Ant (composition) |

### Data Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|----------||
| Static data | Hardcoded items | 10/10 (100%) | Level 1 | All |
| Dynamic data source | Data-driven rendering | 8/10 (80%) | Level 1 | All except Semantic, ShadCN |
| Pagination | Page-based data loading | 2/10 (20%) | Level 4 | Ant Design, PrimeReact |
| Infinite scroll | Load more on scroll | 2/10 (20%) | Level 4 | Ant (composition), PrimeReact |
| Loading states | Skeleton/spinner while loading | 6/10 (60%) | Level 2 | Ant, MUI, Vuetify, PrimeReact (both), HeroUI |
| Empty states | No data messaging | 7/10 (70%) | Level 2 | Ant, MUI, Vuetify, PrimeReact (both), HeroUI, Semantic |
| Virtualization | Render only visible items | 4/10 (40%) | Level 3 | Ant (rc-virtual-list), Vuetify, PrimeReact (both), HeroUI |
| Filtering | Search/filter items | 3/10 (30%) | Level 3 | PrimeReact Listbox, PrimeReact OrderList, HeroUI |

### Visual Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Size options | Small/default/large sizing | 7/10 (70%) | Level 2 | Ant, Mantine, MUI, Vuetify, HeroUI, Semantic, Chakra |
| Bordered | Border around container | 5/10 (50%) | Level 2 | Ant, Semantic, MUI, HeroUI (variants) |
| Divided/split | Dividers between items | 9/10 (90%) | Level 1 | All except HeroUI default |
| Item spacing control | Gap between items | 8/10 (80%) | Level 1 | Chakra, Mantine, MUI, Ant, HeroUI, Semantic, Vuetify |
| Padding control | Indentation/padding | 7/10 (70%) | Level 2 | Chakra, Mantine, MUI, Semantic, Vuetify |
| Color variants | Theme color options | 6/10 (60%) | Level 2 | Chakra, MUI, HeroUI, Vuetify, Semantic, PrimeReact |
| Background styling | Background colors | 6/10 (60%) | Level 2 | Chakra, MUI, HeroUI, Vuetify, Semantic |

### Grouping & Organization Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Subheaders/section headers | Group labels | 5/10 (50%) | Level 2 | MUI, Vuetify, PrimeReact Listbox (groups), HeroUI (sections), Semantic |
| Sticky subheaders | Headers stay visible on scroll | 2/10 (20%) | Level 4 | MUI, Vuetify |
| List groups | Collapsible sections | 2/10 (20%) | Level 4 | Vuetify (v-list-group), MUI (Collapse) |
| Dividers | Visual separators | 9/10 (90%) | Level 1 | All except HeroUI default |
| Inset dividers | Indented dividers | 2/10 (20%) | Level 4 | MUI, Semantic |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| ARIA roles | Proper role attributes | 10/10 (100%) | Level 1 | All |
| Keyboard navigation | Full keyboard support | 7/10 (70%) | Level 2 | MUI, Vuetify, PrimeReact (both), HeroUI, Ant, Semantic |
| Focus management | Visible focus indicators | 9/10 (90%) | Level 1 | All except plain Semantic |
| Screen reader support | SR-friendly markup | 10/10 (100%) | Level 1 | All |
| ARIA attributes | aria-selected, aria-disabled, etc. | 8/10 (80%) | Level 1 | All except plain Semantic, Chakra basic |

### Advanced Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Three-line content | Title + 2 lines of text | 2/10 (20%) | Level 4 | MUI, Vuetify |
| Secondary actions | Right-side action buttons | 3/10 (30%) | Level 3 | MUI (secondaryAction), Ant (actions), Vuetify |
| Item templates | Custom rendering functions | 6/10 (60%) | Level 2 | Ant, PrimeReact (both), HeroUI, Vuetify, MUI |
| Conditional rendering | Dynamic item visibility | 8/10 (80%) | Level 1 | All except Semantic, ShadCN |
| Router integration | Navigation with routing | 4/10 (40%) | Level 3 | MUI, Vuetify, HeroUI, Semantic |
| Form integration | Lists in form contexts | 4/10 (40%) | Level 3 | PrimeReact (both), HeroUI, MUI |
| Reordering controls | Move up/down buttons | 1/10 (10%) | Level 5 | PrimeReact OrderList |
| Transfer between lists | Dual-list pattern | 0/10 (0%) | N/A | None (separate component in frameworks) |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
- **Semantic HTML**: All frameworks use proper ul/ol/li structure
- **Text Content**: Basic text items universally supported
- **Vertical Layout**: Default stacking of items
- **Clickable Items**: onClick/interaction handlers
- **Static Data**: Hardcoded list rendering
- **Links**: Navigation/clickable patterns

**Nearly Universal (70-90% adoption):**
- **Icons**: Icon support in 90% of frameworks
- **Rich Content**: Complex nested content (90%)
- **Divided Items**: Dividers between entries (90%)
- **Metadata Patterns**: Title + description (80%)
- **Dynamic Data**: Data-driven rendering (80%)
- **Hover States**: Visual feedback (90%)
- **Focus Management**: Keyboard accessibility (90%)
- **Item Spacing Control**: Gap configuration (80%)

### Emerging Patterns (Level 3-4)

**Moderate Adoption (40-60%):**
- **Avatars**: Profile images (70% - borders on Level 2)
- **Actions/Buttons**: Per-item actions (70% - borders on Level 2)
- **Images**: Embedded images (60%)
- **Dense Mode**: Compact spacing (70% - borders on Level 2)
- **Loading States**: Skeleton/spinner patterns (60%)
- **Empty States**: No data messaging (70% - borders on Level 2)
- **Size Options**: Small/large variants (70% - borders on Level 2)
- **Selection**: Single/multi-select (50% each)
- **Virtualization**: Large dataset rendering (40%)
- **Expandable Items**: Collapsible content (40%)
- **Subheaders**: Section grouping (50%)
- **Color Variants**: Theming options (60%)
- **Background Styling**: Custom backgrounds (60%)
- **Item Templates**: Custom rendering (60%)
- **Router Integration**: Navigation patterns (40%)
- **Form Integration**: Form contexts (40%)
- **Horizontal Layout**: Inline items (40%)

### Unique Innovations (Level 5)

**Rare But Innovative (<20% adoption):**

**Ant Design:**
- **Grid Layout Native**: Built-in responsive grid prop (unique)
- **itemLayout Prop**: Vertical/horizontal toggle (unique approach)
- **DataSource + RenderItem**: Functional data-driven pattern (unique API)
- **rc-virtual-list Integration**: Official virtualization support

**MUI (Material-UI):**
- **Composition Architecture**: 8 coordinated sub-components (most comprehensive)
- **Three-Line Content**: Standardized multi-line items (unique)
- **Secondary Actions**: Right-side action positioning (unique pattern)
- **ListItemButton**: Dedicated interactive component with ripple
- **Sticky Subheaders**: Native sticky positioning
- **Inset Variants**: Alignment without icons

**Chakra UI:**
- **List.Indicator**: Unified icon/marker component with `asChild` pattern
- **_marker Pseudo-selector**: Direct marker styling via CSS
- **as Prop Flexibility**: Change underlying element easily

**Mantine:**
- **Icon Context + Override**: Default icon with per-item override
- **withPadding**: Explicit nested list indentation
- **listStyleType Prop**: Multiple list styles (unordered, ordered, alpha, roman)

**Vuetify:**
- **v-list-group**: Built-in collapsible sections (unique)
- **Line Variants**: one-line, two-line, three-line explicit modes
- **nav Prop**: Dedicated navigation styling
- **Density Variants**: default, comfortable, compact options

**PrimeReact OrderList:**
- **Reordering Focus**: Specialized for changing item sequence (unique purpose)
- **Dual Interaction**: Both buttons AND drag-and-drop
- **Move Buttons**: Top/Up/Down/Bottom controls

**PrimeReact Listbox:**
- **Form Control Focus**: Selection over display (unique purpose)
- **Virtual Scrolling**: Native support for 100K+ items
- **Filter Integration**: Built-in search capability

**HeroUI:**
- **React Aria Foundation**: WCAG compliance built-in
- **Virtualization**: Native support via React Aria
- **Section Support**: First-class grouping with ListboxSection

**Semantic UI:**
- **CSS-First Approach**: Pure class-based styling (unique in this set)
- **Relaxed/Very Relaxed**: Named spacing variants
- **Celled Lists**: Bordered cell pattern
- **Horizontal Lists**: Native horizontal layout
- **Float Patterns**: List item floating

## Pattern Correlations

**When Display-focused → Likely has:**
- Semantic HTML ul/ol/li (7/7 = 100%)
- Icons and avatars (7/7 = 100%)
- Rich content support (7/7 = 100%)
- Nested lists (7/7 = 100%)
- Dividers (7/7 = 100%)

**When Selection-focused (Listbox) → Likely has:**
- Single/multi-selection (3/3 = 100%)
- Keyboard navigation (3/3 = 100%)
- role="listbox" ARIA (3/3 = 100%)
- Form integration (3/3 = 100%)
- Filtering (2/3 = 67%)
- Virtualization (3/3 = 100%)

**When Composition-based → Likely has:**
- Multiple sub-components (3/3 = 100%)
- Icon-specific components (3/3 = 100%)
- Text-specific components (3/3 = 100%)
- Flexible content patterns (3/3 = 100%)
- Advanced styling options (3/3 = 100%)

**When Component-based (React/Vue) → Likely has:**
- Props for configuration (8/8 = 100%)
- Dynamic data patterns (7/8 = 88%)
- Event handlers (8/8 = 100%)
- State management (8/8 = 100%)
- Conditional rendering (7/8 = 88%)

**When Material Design-based → Excludes:**
- Non-standard list types (2/2 = 100%)
- Custom marker styles (2/2 = 100% - uses Material guidelines)

**When has Virtualization → Likely has:**
- Large dataset support (4/4 = 100%)
- Dynamic data patterns (4/4 = 100%)
- Performance optimization focus (4/4 = 100%)
- Loading states (4/4 = 100%)

## Implementation Notes

### Composition vs Configuration

**Composition-Based (33%):**
- **MUI**: 8 sub-components (List, ListItem, ListItemButton, ListItemIcon, ListItemAvatar, ListItemText, ListSubheader, Divider)
- **Chakra UI**: 3 components (List.Root, List.Item, List.Indicator)
- **Mantine**: 2 components (List, List.Item)

**Benefits:**
- Maximum flexibility for custom layouts
- Clear separation of concerns
- TypeScript-friendly with specific props
- Reusable sub-components

**Drawbacks:**
- More verbose code
- Steeper learning curve
- More components to import

**Configuration-Based (67%):**
- **Ant Design**: Single List component with extensive props
- **Vuetify**: v-list with prop-based configuration
- **PrimeReact**: Single components with comprehensive props
- **HeroUI**: Listbox with item template functions

**Benefits:**
- Simpler API surface
- Less boilerplate
- Faster to get started
- Centralized configuration

**Drawbacks:**
- Less flexibility for complex layouts
- Prop proliferation
- Can become unwieldy with many options

### Display vs Selection vs Reordering

**Display Lists (70%):**
- **Purpose**: Present information
- **ARIA role**: `list` or `navigation`
- **Interaction**: Optional click handlers, navigation
- **Examples**: Ant, Chakra, Mantine, MUI (partial), Semantic, Vuetify, HeroUI (partial)

**Selection Lists (30%):**
- **Purpose**: Form input for choosing items
- **ARIA role**: `listbox`
- **Interaction**: Single/multi-select with keyboard nav
- **Examples**: PrimeReact Listbox, HeroUI Listbox, MUI (selection patterns)

**Reordering Lists (10%):**
- **Purpose**: Change item sequence
- **ARIA role**: `list` with drag-drop or button controls
- **Interaction**: Drag-and-drop or move buttons
- **Examples**: PrimeReact OrderList

**Critical Distinctions:**
1. **Display** lists use `<ul>/<ol>` and `role="list"`
2. **Selection** lists use `role="listbox"` and `aria-selected`
3. **Reordering** lists use `role="list"` with additional drag-drop ARIA

### Data Patterns

**Static Rendering (100%):**
- All frameworks support hardcoded JSX/HTML items
- Direct children approach universal

**Dynamic Data (80%):**
- **dataSource Pattern**: Ant Design uses separate data and render function
- **items Prop**: Vuetify supports items array with item-title/item-value
- **Children Function**: Some support render props
- **Map Pattern**: Most use standard .map() over arrays

**Large Datasets:**
- **Virtualization**: 4/10 frameworks have native support
- **Pagination**: 2/10 frameworks have built-in pagination
- **Infinite Scroll**: 2/10 frameworks support load-more patterns

### Icon Patterns

**Approaches to Icons:**

1. **Dedicated Sub-component** (MUI, Chakra):
   - `<ListItemIcon>` or `<List.Indicator>`
   - Proper sizing and alignment
   - Clear separation

2. **Prop-Based** (Mantine, Ant partial):
   - `icon` prop accepts React element
   - Context inheritance with override

3. **Composition** (Ant, Semantic, Vuetify):
   - Icons as children alongside text
   - Flexbox or grid for positioning

4. **Slot-Based** (Vuetify, HeroUI):
   - Named slots for prepend/append content
   - Icon goes in prepend slot

### Spacing & Density

**Spacing Control:**
- **Native Gap**: Chakra (spacing), Mantine (spacing), Vuetify (density)
- **Size Variants**: Ant (size prop), MUI (dense), HeroUI (variants)
- **CSS Classes**: Semantic (.relaxed, .compact)

**Density Modes:**
- **Compact/Dense**: Reduced padding (7/10 frameworks)
- **Default**: Standard spacing
- **Relaxed/Comfortable**: Increased spacing (2/10 frameworks)

### Accessibility Implementation

**Keyboard Navigation Standards:**
- **Arrow Keys**: Up/Down for navigation (7/10)
- **Enter/Space**: Activate item (7/10)
- **Home/End**: Jump to first/last (4/10)
- **Type-ahead**: Letter key navigation (2/10 - HeroUI, PrimeReact)

**ARIA Attributes:**
- **role="list"**: Display lists (9/9 display frameworks)
- **role="listbox"**: Selection lists (3/3 selection frameworks)
- **aria-selected**: Selection state (5/10)
- **aria-disabled**: Disabled items (6/10)
- **aria-labelledby**: Section headers (3/10)

### Material Design vs Custom

**Material Design (2/10):**
- MUI and Vuetify strictly follow Material Design 3 guidelines
- Three-line content limits
- Standardized spacing (48dp, 64dp, 80dp heights)
- Ripple effects
- Specific icon sizing

**Custom Design (8/10):**
- Flexible spacing and sizing
- Framework-specific theming
- No strict height requirements
- Custom visual treatments

## Migration Considerations

**From HTML Lists:**
- Most frameworks maintain ul/ol/li semantics
- Can progressively enhance with framework features
- Minimal breaking changes to content structure

**Bootstrap/Foundation → Modern Frameworks:**
- List groups → framework List components
- .list-group-item → ListItem components
- Similar patterns, different APIs

**Between Frameworks:**
- **MUI ↔ Vuetify**: Similar Material Design patterns, but different component structures
- **Ant ↔ MUI**: Different approaches (configuration vs composition)
- **Chakra ↔ Mantine**: Similar composition patterns, easier migration
- **Semantic → Any**: CSS classes → component props

**Selection vs Display:**
- PrimeReact Listbox ≠ MUI List
- Listbox is form control, List is display
- Cannot directly swap without reconsidering purpose

## Sophisticated Design Patterns

### MUI - Secondary Action Pattern

**What it does**: The `secondaryAction` prop positions interactive elements (buttons, checkboxes, icons) on the right edge of list items without displacing primary content. The component automatically manages spacing, alignment, and touch targets. When present, secondary actions align vertically centered regardless of item height variation.

```jsx
<ListItem
  secondaryAction={
    <IconButton edge="end" onClick={handleDelete}>
      <DeleteIcon />
    </IconButton>
  }
>
  <ListItemText primary="Item with delete button on right" />
</ListItem>
```

**Why it's sophisticated**: This solves a non-obvious problem: "How do you add action buttons that don't compete with primary content space?" Most frameworks require composition and flexbox management to achieve this. MUI elevated it to a first-class pattern, recognizing that secondary actions on the right are so common in Lists that they warrant dedicated API surface. This shows deep understanding of real-world List patterns.

**Evidence of design maturity**:
- Handles edge cases like varying item heights and button sizes automatically
- Works seamlessly with ListItemAvatar, ListItemIcon, and ListItemText simultaneously
- Touch-friendly with proper spacing for mobile devices (48px minimum)
- Distinguishes between structural composition and interaction positioning concerns

### Ant Design - ItemLayout Toggle Pattern

**What it does**: The `itemLayout` prop switches between "horizontal" (compact metadata-focused with avatar/title/description side-by-side) and "vertical" (content-rich with metadata below). A single `itemLayout` change reconfigures the entire list structure without requiring data model changes or component restructuring.

```jsx
// Compact mode - metadata emphasis
<List itemLayout="horizontal">
  <List.Item>
    <List.Item.Meta avatar={<Avatar />} title="..." description="..." />
  </List.Item>
</List>

// Rich content mode - content emphasis
<List itemLayout="vertical">
  <List.Item>
    <h4>Title</h4>
    <p>Long form content here</p>
  </List.Item>
</List>
```

**Why it's sophisticated**: This solves a constraint-specific problem that only Lists face: "How do you support both dense metadata listings AND rich content displays with the same component API?" Most frameworks lock you into one layout paradigm. The `itemLayout` toggle handles the profound restructuring of internal spacing, text treatment, and content flow with a single boolean-like prop. It demonstrates awareness that presentation mode changes require cascading style adjustments.

**Evidence of design maturity**:
- Automatically adjusts ListItemMeta sub-component behavior based on parent itemLayout
- Works with pagination and virtualization regardless of layout mode
- Integrates with grid prop for responsive layouts in vertical mode
- Respects that horizontal and vertical require different visual hierarchies (avatar position, text emphasis)

### PrimeReact OrderList - Dual Interaction Model

**What it does**: OrderList simultaneously supports two complementary reordering mechanisms - traditional control buttons (Move Top/Up/Down/Bottom) AND drag-drop - both active at the same time. Users can choose their preferred modality; the component gracefully coexists both without conflicts or modal switching.

```jsx
<OrderList
  dataKey="id"
  value={items}
  onChange={(e) => setItems(e.value)}
  itemTemplate={itemTemplate}
  dragdrop={true}           // Enable drag-drop
  showSourceControls={true} // Keep buttons visible simultaneously
/>
```

**Why it's sophisticated**: This reveals deep understanding of interaction accessibility: "How do you support modern, intuitive drag-drop while maintaining keyboard/assistive technology compatibility?" Rather than choosing one modality, OrderList keeps both active. Buttons serve keyboard users and screen readers; drag-drop serves mouse/touch users. The non-obvious insight is that these two interfaces don't conflict—they coexist peacefully because they tap into different user affordances.

**Evidence of design maturity**:
- Drag-drop doesn't disable or hide button controls; they reinforce each other
- State model (`onChange` with reordered array) works identically whether user dragged or clicked buttons
- Both interactions update the same visual representation—no mode switching or confusion
- Respects that "best interface for reordering" isn't singular; acknowledges user diversity (motor abilities, input device, screen reader dependency)

---

## Framework Recommendations

**For Rich Data Display:**
- **Ant Design**: Best for complex data-driven lists with pagination/grid
- **MUI**: Best for Material Design with extensive composition needs

**For Simple Content Lists:**
- **Chakra UI**: Clean API, easy to customize
- **Mantine**: Simple props, good defaults

**For Selection/Forms:**
- **PrimeReact Listbox**: Purpose-built for selection
- **HeroUI**: Modern with built-in accessibility

**For Navigation:**
- **MUI**: ListItemButton pattern for navigation
- **Vuetify**: v-list with nav prop
- **Semantic UI**: Semantic markup for navigation

**For Performance (Large Datasets):**
- **Ant Design**: rc-virtual-list integration
- **PrimeReact**: Native virtual scrolling
- **HeroUI**: React Aria virtualization
- **Vuetify**: Built-in virtual scroller

**For Reordering:**
- **PrimeReact OrderList**: Only framework with native reordering focus
- Others: Integrate dnd-kit or react-beautiful-dnd

## Future Trends

**Virtualization Becoming Standard:**
- Currently 40% have native support
- Critical for modern web apps with large datasets
- Expect broader adoption

**Composition Over Configuration:**
- MUI's 8-component approach provides maximum flexibility
- Trend toward more granular sub-components
- Better TypeScript support

**Accessibility First:**
- React Aria patterns (HeroUI) gaining traction
- WCAG 2.1 AA baseline becoming standard
- Keyboard navigation expected everywhere

**Selection vs Display Distinction:**
- Clearer separation of purposes
- Listbox for forms, List for display
- Different ARIA patterns for different use cases

**Performance Focus:**
- Virtualization for large lists
- Lazy rendering patterns
- Optimistic UI updates

## Raw Data References

Individual framework research reports available at:
- `ai/research/list/ant-design/usage-patterns.md`
- `ai/research/list/chakra-ui/usage-patterns.md`
- `ai/research/list/mantine/usage-patterns.md`
- `ai/research/list/mui/usage-patterns.md`
- `ai/research/list/primereact-listbox/usage-patterns.md`
- `ai/research/list/primereact-orderlist/usage-patterns.md`
- `ai/research/list/semantic-ui-classic/usage-patterns.md`
- `ai/research/list/vuetify/usage-patterns.md`
- `ai/research/list/heroui/usage-patterns.md`
- `ai/research/list/shadcn/no-component.md`

## Research Methodology

All research conducted on 2025-11-05 through:
1. Direct documentation access via WebFetch where available
2. Web search for supplementary information when needed
3. Cross-verification across multiple sources
4. Code example extraction from official documentation
5. Parallel research using 10 simultaneous subagents

Frameworks surveyed represent major players across React, Vue, and CSS ecosystems, providing comprehensive cross-framework pattern analysis for List components.
