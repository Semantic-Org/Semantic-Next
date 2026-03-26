# Component Pattern Research: Menubar

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 3
- Date: 2025-11-05
- Unique patterns identified: 40+

## Component Definition Consensus

Menubar components provide a visually persistent horizontal menu bar common in desktop applications, giving quick access to consistent command sets. Universal mental model: "desktop application menu bar."

**Primary Purpose:** Provide a persistent, always-visible navigation and command structure positioned at the top of applications, organizing related command menus hierarchically.

**Mental Model:** Traditional desktop application menu bar (like File/Edit/View menus) that stays visible and accessible at all times, combining navigation with action commands.

**Semantic meaning:** Represents primary application commands and organizational structure at the top-level navigation tier, signaling desktop-application-style functionality.

## Terminology Variations

- **Menubar** (3 frameworks) = ShadCN, Radix UI, PrimeReact

All frameworks use the term "Menubar" consistently.

## Pattern Inventory

### Architecture Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Compound components | Multiple specialized parts compose system | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Controlled state | value/onValueChange pattern | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Uncontrolled state | defaultValue pattern | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Portal rendering | Content in document.body | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Model-driven | Data structure defines menu | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |
| Polymorphic components | asChild prop for composition | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Text items | Text labels for menu items | 3/3 (100%) | **Level 1: Universal** | All | Composed/Native |
| Icon support | Icons in menu items | 3/3 (100%) | **Level 1: Universal** | All | Composed/Native |
| Keyboard shortcuts | Display shortcuts in items | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Labels | Non-interactive section headers | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Separators | Visual dividers | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Custom content | Flexible content via children | 3/3 (100%) | **Level 1: Universal** | All | Composed |
| Custom start content | Content at menubar start | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |
| Custom end content | Content at menubar end | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |
| Item templates | Custom item rendering | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |

### Menu Structure Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Multiple menus | Multiple top-level menu triggers | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Nested submenus | Hierarchical submenu structure | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Menu grouping | Logical item grouping | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Radio groups | Mutually exclusive options | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Checkbox items | Toggle state items | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Standard items | Basic action items | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Disabled items | Non-interactive items | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Visual indicators | Checked/selected state display | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Open/closed state | Menu visibility management | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Active menu tracking | Track which menu is open | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Checked state | Checkbox item state | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Selected state | Radio item state | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Highlighted state | Hover/focus indication | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Disabled state | Item availability control | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Focus management | Keyboard navigation state | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Mobile toggle state | Hamburger menu open/close | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |

### Interaction Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Click to open | Mouse click opens menu | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Keyboard navigation | Full arrow key support | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Focus trapping | Focus within open menu | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Auto-close | Close on selection/outside click | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Hover behavior | Hover to open adjacent menus | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Type-ahead search | Quick keyboard navigation | 1/3 (33%) | **Level 4: Occasional** | Radix UI | Native |
| onSelect callback | Item selection handler | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Command callback | Action handler | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |
| Router integration | URL-based navigation | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |

### Positioning Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Side positioning | Control content placement | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Alignment control | Start/center/end alignment | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Offset control | Pixel-precise positioning | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Collision detection | Smart repositioning | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Collision boundary | Custom constraints | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Sticky positioning | Priority axis control | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Submenu positioning | Automatic side placement | 3/3 (100%) | **Level 1: Universal** | All | Native |

### Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Data attributes | State-driven styling | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | CSS-only |
| CSS custom properties | Layout data variables | 1/3 (33%) | **Level 4: Occasional** | Radix UI | CSS-only |
| Tailwind classes | Utility-first styling | 1/3 (33%) | **Level 4: Occasional** | ShadCN | CSS-only |
| Custom styling | className/style props | 3/3 (100%) | **Level 1: Universal** | All | CSS-only |
| Unstyled mode | Bootstrap/custom themes | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |
| Pass-through props | Granular customization | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |
| Inset spacing | Visual indentation | 1/3 (33%) | **Level 4: Occasional** | ShadCN | Native |
| Transform origin | Directional animations | 1/3 (33%) | **Level 4: Occasional** | Radix UI | CSS-only |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| WAI-ARIA compliance | Menu Button pattern | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Keyboard operability | Complete keyboard control | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Screen reader support | Proper ARIA attributes | 3/3 (100%) | **Level 1: Universal** | All | Native |
| Focus indicators | Visual focus styling | 3/3 (100%) | **Level 1: Universal** | All | Native/CSS-only |
| Roving tabindex | Focus management pattern | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Focus return | Return to trigger on close | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| RTL support | Right-to-left layouts | 1/3 (33%) | **Level 4: Occasional** | Radix UI | Native |

### Responsive Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Desktop-first design | Optimized for desktop use | 2/3 (67%) | **Level 2: Common** | ShadCN, Radix UI | Native |
| Mobile hamburger menu | Automatic mobile adaptation | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |
| Responsive breakpoints | Adaptive layout | 1/3 (33%) | **Level 4: Occasional** | PrimeReact | Native |

## Notable Patterns

### Universal (100%)
- Multiple top-level menus
- Nested submenu support
- Text and icon content
- Separators for organization
- Disabled item state
- Open/closed state management
- Keyboard navigation
- Auto-close behavior
- WAI-ARIA compliance
- Screen reader support

### Architectural Approaches

**Compositional (ShadCN, Radix UI):**
- 13-15+ compound components
- Explicit structure via composition
- Controlled/uncontrolled patterns
- Portal rendering built-in
- Maximum flexibility

**Model-Driven (PrimeReact):**
- Single component with model prop
- Data structure defines menu
- Template functions for customization
- Start/end content areas
- Less verbose for simple cases

### ShadCN Specializations
- Built on Radix UI v1.1.16
- 13 specialized components
- Tailwind-first styling
- Copy-paste installation model
- MenubarShortcut component
- Inset spacing pattern
- Comprehensive examples

### Radix UI Specializations
- Pure unstyled primitives
- 15+ component parts
- 6 CSS custom properties for layout
- Type-ahead navigation with textValue
- Transform origin for animations
- Dimension variables
- Collision detection engine
- Arrow connector component
- 34.6 kB gzipped

### PrimeReact Specializations
- MenuItem model structure
- Command and URL navigation
- Custom start/end content areas
- Mobile hamburger menu (automatic)
- Pass-through API (pt prop)
- Badge support
- Template functions
- Unstyled mode
- Multiple theme compatibility
- v10.9.7

## Implementation Notes

### Installation

**ShadCN:**
```bash
npx shadcn@latest add menubar
```
Copies components to project based on Radix UI.

**Radix UI:**
```bash
npm install @radix-ui/react-menubar
```
Standalone primitive package.

**PrimeReact:**
```jsx
import { Menubar } from 'primereact/menubar';
```
Part of PrimeReact core.

### Basic Usage Comparison

**ShadCN:**
```jsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New Tab</MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem disabled>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

**Radix UI:**
```jsx
<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Portal>
      <Menubar.Content>
        <Menubar.Item>New Tab</Menubar.Item>
        <Menubar.Item>New Window</Menubar.Item>
        <Menubar.Separator />
        <Menubar.Item disabled>Print</Menubar.Item>
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>
```

**PrimeReact:**
```jsx
<Menubar model={[
  {
    label: 'File',
    items: [
      { label: 'New Tab' },
      { label: 'New Window' },
      { separator: true },
      { label: 'Print', disabled: true }
    ]
  }
]} />
```

### Keyboard Navigation Patterns

All frameworks implement comprehensive keyboard support:

- **Arrow Keys**: Navigate through items and menus
- **Enter**: Activate item or open submenu
- **Space**: Activate item (checkboxes toggle)
- **Escape**: Close menu and return focus
- **Tab**: Exit menubar
- **Home/End**: First/last item (Radix UI)
- **Type-ahead**: Quick navigation (Radix UI)

### State Management Patterns

**Compositional (ShadCN/Radix):**
```jsx
// Controlled
<Menubar value={openMenu} onValueChange={setOpenMenu}>

// Uncontrolled
<Menubar defaultValue="file">

// Checkbox state
<MenubarCheckboxItem
  checked={isChecked}
  onCheckedChange={setIsChecked}
>
```

**Model-Driven (PrimeReact):**
```jsx
const items = [{
  label: 'Edit',
  items: [
    {
      label: 'Cut',
      command: () => handleCut()
    }
  ]
}];

<Menubar model={items} />
```

## Sophisticated Design Patterns

### Radix UI - Portal-Driven Collision Detection with CSS Variable Injection

**What it does**: Content renders via Portal component into document.body to bypass CSS containment issues. The collision detection engine monitors viewport proximity and automatically repositions the menu (side, align, sticky behavior). Six CSS custom properties expose layout data (`--radix-menubar-content-transform-origin`, trigger dimensions, available space) for direction-aware animations that respond to actual positioning decisions.

**Why it's sophisticated**: Menu positioning in complex layered UIs is non-trivial—CSS containment, z-index stacking contexts, and nested scrollable containers can trap dropdown content. Radix's approach decouples positioning from component hierarchy (Portal escape hatch) while exposing computed layout through CSS variables. This allows animations to know which direction the menu opened without JavaScript-side animation logic.

**Evidence of design maturity**:
- Collision detection with per-side padding configuration (`collisionPadding`) and axis-specific constraints (`sticky: 'partial' | 'always'`)
- `hideWhenDetached` prop prevents orphaned UI when trigger becomes occluded—catches an edge case most frameworks miss
- `arrowPadding` manages arrow connector visibility independent of content padding, showing separation of concerns
- Transform origin variable enables CSS animations that scale/rotate relative to actual menu opening direction, preventing animation direction mismatches

### PrimeReact - Mobile Menu Toggle Abstraction with Responsive Model

**What it does**: Menubar automatically detects viewport and converts to hamburger menu button on mobile breakpoints without separate component logic. The model-based architecture (`MenuItem[] model`) stays identical across desktop and mobile—only rendering changes. Button customization via `buttonProps` allows mobile-specific configurations (icon, styling, aria attributes).

**Why it's sophisticated**: Most components require separate mobile/desktop variants or custom responsive wrappers. PrimeReact's abstraction means the same menu data structure powers both desktop horizontal menubar and mobile hamburger menu, reducing implementation complexity. The responsive breakpoint logic is encapsulated—developers declare structure once and get responsive behavior automatically.

**Evidence of design maturity**:
- `menuIcon` prop overrides default hamburger icon, indicating theming support thought through to mobile edge cases
- `buttonProps` separately configurable from menu items themselves, showing recognition that mobile trigger button and menu items need independent customization
- Mobile menu state (`aria-expanded`, `aria-controls`) properly managed, confirming accessibility maturity in responsive context
- The `start` and `end` content areas work identically on mobile and desktop, avoiding content area reimplementation

### ShadCN/Radix UI - MenubarShortcut with Inset Spacing Pattern

**What it does**: ShadCN introduces `MenubarShortcut` component and `inset` prop for visual hierarchy. Shortcuts display right-aligned with muted styling (gray text). The `inset` prop adds left indentation to items without visible bullets or checkmarks, creating visual nesting without structural nesting—useful for secondary commands or nested actions that shouldn't be submenus.

**Why it's sophisticated**: Keyboard shortcut display is UX critical but organizationally complex—shortcuts need semantic meaning (they're not regular content) while visually integrating with items. The dedicated component separates shortcut styling from item content. The `inset` prop solves a nuanced problem: how to show logical hierarchy (command grouping) without creating actual submenus that change interaction patterns. This prevents "submenu explosion" in complex applications.

**Evidence of design maturity**:
- `MenubarShortcut` forces semantic separation—developers can't accidentally apply shortcut styling to arbitrary content
- `inset` prop works without `checked` or visual indicators, allowing visual grouping without state semantics
- Right-aligned shortcut positioning respects RTL layouts (inherited from Radix) while maintaining visual hierarchy
- Used consistently across examples for File/Edit/View patterns, showing production validation in canonical examples

---

## Accessibility Considerations

### Common Patterns Across Frameworks

**WAI-ARIA Compliance:**
All frameworks implement the Menu Button design pattern:
- role="menubar" on root
- role="menu" on content
- role="menuitem" on items
- role="group" for grouping
- aria-haspopup for triggers
- aria-expanded for state
- aria-checked for toggles

**Keyboard Operability:**
- Complete keyboard control without mouse
- Roving tabindex for item focus
- Focus trapping within open menus
- Logical focus order
- Escape key to close

**Screen Reader Support:**
- Proper ARIA roles and attributes
- State communication (checked, disabled, expanded)
- Label associations
- Context information

### Framework-Specific

**Radix UI:**
- Type-ahead with customizable text matching
- RTL support via dir prop
- Focus management hooks (onCloseAutoFocus)
- Collision-aware positioning

**PrimeReact:**
- Mobile-friendly with hamburger button
- ARIA-compliant across desktop/mobile
- Detailed keyboard reference table

## Design Philosophy Differences

### Headless Primitives (Radix UI, ShadCN)
- **Philosophy**: Unstyled, composable primitives
- **Approach**: Maximum flexibility through composition
- **Styling**: External (CSS/Tailwind/CSS-in-JS)
- **Control**: Explicit component structure
- **Audience**: Design system builders

### Complete Component (PrimeReact)
- **Philosophy**: Feature-complete, ready-to-use
- **Approach**: Configuration over composition
- **Styling**: Built-in themes + customization
- **Control**: Data model structure
- **Audience**: Rapid application development

## Use Case Consensus

All frameworks emphasize these primary use cases:
1. **Desktop applications** - Traditional File/Edit/View menus
2. **Web applications** - Desktop-style command structure
3. **Admin interfaces** - Persistent navigation and actions
4. **Content management** - Organized command sets
5. **Developer tools** - IDE-like menu bars

## Raw Data

- [ShadCN](./shadcn/usage-patterns.md)
- [Radix UI](./radix-ui/usage-patterns.md)
- [PrimeReact](./primereact/usage-patterns.md)
