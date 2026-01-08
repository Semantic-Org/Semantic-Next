# ShadCN - Select Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/select
Status: ✅ Working

## Documentation Quality
Good - Clear examples with well-structured composition patterns. Documentation is minimal but points to comprehensive Radix UI docs for advanced configuration. Live interactive examples demonstrate real-world usage.

## Component Definition
- **Core purpose**: Displays a list of options for the user to pick from, triggered by a button
- **Mental model**: A composable dropdown selection interface built from primitives - trigger opens a content panel containing selectable items
- **Semantic meaning**: Standard form control for single-value selection from a predefined list (implements ListBox WAI-ARIA pattern)

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Primary pattern - items display text labels |
| Icon support | ✅ | SelectIcon component for trigger indicator, items can contain custom content |
| Media support | ✅ | Items accept any React children - can include images, avatars |
| Custom content | ✅ | Full composition control - items, groups, labels, separators |
| Placeholder | ✅ | SelectValue component accepts placeholder prop |
| Grouped options | ✅ | SelectGroup with SelectLabel for categorization |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Single selection | ✅ | Core pattern - one value at a time |
| Multi-selection | ❌ | Not supported - use Checkbox group pattern instead |
| Searchable/Filter | ❌ | No built-in search - would require custom implementation |
| Creatable | ❌ | No dynamic option creation shown |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ❌ | No built-in loading state |
| Disabled | ✅ | Both trigger and individual items support disabled prop |
| Required | ✅ | Root component accepts required prop for form validation |
| Invalid/Error | ❌ | No built-in error states - handle via form integration |
| Controlled | ✅ | value + onValueChange for external control |
| Uncontrolled | ✅ | defaultValue for internal state management |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ❌ | No prop-based sizes - controlled via className (Tailwind) |
| Visual variants | ❌ | No style variants - customized through CSS/className |
| Positioning | ✅ | Content supports position="item-aligned" or "popper" |
| Scrollable content | ✅ | Viewport component handles overflow with scroll buttons |
| Portal rendering | ✅ | SelectPortal for rendering outside DOM hierarchy |

## Code Examples

### Basic Select
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

### Grouped Options with Labels
```tsx
import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
```

### Scrollable Select (Multiple Groups)
```tsx
// Timezone example with multiple geographic regions
<Select>
  <SelectTrigger className="w-[280px]">
    <SelectValue placeholder="Select a timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
      <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
      <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
      <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
      <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>Europe & Africa</SelectLabel>
      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
      <SelectItem value="cet">Central European Time (CET)</SelectItem>
      <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
      <SelectItem value="west">Western European Summer Time (WEST)</SelectItem>
      <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
      <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
    </SelectGroup>
    {/* Additional groups for Asia, Australia, South America */}
  </SelectContent>
</Select>
```

### Installation
```bash
pnpm dlx shadcn@latest add select
```

## API Surface

### Select (Root)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | - | Default selected value (uncontrolled) |
| `value` | `string` | - | Controlled selected value |
| `onValueChange` | `(value: string) => void` | - | Callback when value changes |
| `defaultOpen` | `boolean` | - | Default open state (uncontrolled) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `dir` | `"ltr" \| "rtl"` | - | Text direction |
| `name` | `string` | - | Form field name |
| `disabled` | `boolean` | `false` | Disables the entire select |
| `required` | `boolean` | `false` | Form validation requirement |

### SelectTrigger
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes for styling |
| `asChild` | `boolean` | `false` | Merge props onto child element |

**Data Attributes:**
- `[data-state]`: "open" | "closed"
- `[data-disabled]`: Present when disabled
- `[data-placeholder]`: Present when placeholder is shown

### SelectValue
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | - | Text shown when no value selected |

### SelectContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"item-aligned" \| "popper"` | `"item-aligned"` | Positioning strategy |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side for popper |
| `sideOffset` | `number` | `0` | Distance from trigger |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment relative to trigger |
| `alignOffset` | `number` | `0` | Offset from alignment axis |
| `avoidCollisions` | `boolean` | `true` | Adjust position to avoid collisions |
| `collisionBoundary` | `Element \| Element[]` | `[]` | Boundary elements for collision detection |
| `collisionPadding` | `number \| Partial<Record<Side, number>>` | `0` | Padding for collision detection |
| `sticky` | `"partial" \| "always"` | `"partial"` | Sticky behavior |
| `hideWhenDetached` | `boolean` | `false` | Hide when trigger is fully occluded |
| `onCloseAutoFocus` | `(event: Event) => void` | - | Handler when focus returns to trigger |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | - | Handler for Escape key |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` | - | Handler for outside clicks |

**Data Attributes:**
- `[data-state]`: "open" | "closed"

**CSS Variables:**
- `--radix-select-content-transform-origin`
- `--radix-select-content-available-width`
- `--radix-select-content-available-height`
- `--radix-select-trigger-width`
- `--radix-select-trigger-height`

### SelectItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | (required) | Unique value for this option |
| `disabled` | `boolean` | `false` | Disables this specific item |
| `textValue` | `string` | - | Text for typeahead (defaults to children) |

**Data Attributes:**
- `[data-highlighted]`: Present when focused
- `[data-state]`: "checked" | "unchecked"
- `[data-disabled]`: Present when disabled

### SelectGroup
Logical grouping container for related items. No specific props beyond React defaults.

### SelectLabel
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | (required) | Label text for the group |

### Additional Components
- **SelectSeparator**: Visual divider between groups/items
- **SelectScrollUpButton**: Scroll control for top overflow
- **SelectScrollDownButton**: Scroll control for bottom overflow
- **SelectIcon**: Indicator icon for trigger (typically chevron)
- **SelectPortal**: Renders content outside DOM hierarchy
- **SelectViewport**: Scrollable container for items
- **SelectItemText**: Text content of item
- **SelectItemIndicator**: Visual indicator for selected state

## Notable Features

### Composable Architecture
- Built from discrete, composable primitives (Radix UI foundation)
- Each part can be customized or replaced independently
- Full control over markup structure and styling
- Supports composition patterns (custom content in items, triggers)

### Radix UI Foundation
- Built on `@radix-ui/react-select` v2.2.6 (34.89 kB)
- Inherits comprehensive accessibility implementation (ListBox WAI-ARIA pattern)
- Automatic focus management and keyboard navigation
- Data attributes for all interactive states

### Accessibility Features
- **Keyboard Navigation**: Space/Enter to open/select, Arrow keys to navigate, Esc to close
- **Screen Reader Support**: Proper ARIA roles, labels, and announcements
- **Focus Management**: Automatic focus restoration, keyboard trap when open
- **Typeahead**: Jump to items by typing (uses textValue or children)
- **Disabled States**: Both root and item-level disabled support

### Positioning System
- Two positioning strategies: `item-aligned` (default) and `popper`
- Automatic collision detection and boundary awareness
- Portal rendering option for z-index management
- CSS variables expose dimensions for custom styling

### Controlled & Uncontrolled Patterns
- **Uncontrolled**: Use `defaultValue` and `defaultOpen` for internal state
- **Controlled**: Use `value`/`onValueChange` and `open`/`onOpenChange` for external state
- Supports both patterns equally well (React-standard approach)

### Tailwind-First Styling
- No built-in visual variants or themes
- All styling via className prop and Tailwind utilities
- Data attributes enable state-based styling
- CSS variables for dynamic positioning styles

### Form Integration
- `name` prop for standard form submission
- `required` prop for HTML5 validation
- `disabled` prop for form interaction control
- Works with standard form libraries (React Hook Form, etc.)

## Research Notes

### Documentation Accessibility
- Clean, well-structured documentation
- Live interactive examples demonstrate composition patterns
- CLI-based installation (adds to local components directory)
- Points to Radix UI docs for comprehensive API reference
- Good balance of simplicity and completeness

### Framework Approach
ShadCN's philosophy:
1. **Copy, don't install**: Components added via CLI to your project
2. **Full ownership**: You own the code and can modify freely
3. **Composition over configuration**: Primitives compose to create UI
4. **Minimal abstraction**: Thin wrapper around Radix primitives
5. **Tailwind-native**: Expects Tailwind for all styling

### Comparison to Other Frameworks

**vs Ant Design:**
- Ant Design: More opinionated, built-in variants (bordered, multiple), size props, search/filter built-in
- ShadCN: Bare-bones composition, no built-in search, maximum customization

**vs Chakra UI:**
- Chakra: Theme-aware, size variants (xs/sm/md/lg), color schemes, error states
- ShadCN: No theming system, CSS-only customization, no error state primitives

**vs Material UI:**
- Material UI: Material Design variants, dense mode, helper text, error handling
- ShadCN: Framework-agnostic design, no helper text component, minimal API

**vs Headless UI:**
- Headless UI: Also unstyled primitives but Vue + React support
- ShadCN: React-only, but provides default Tailwind styling

### Design Philosophy Insights

**Minimal Abstraction:**
- Wraps Radix primitives with minimal additional logic
- Re-exports most Radix components directly
- Adds default styling via Tailwind classes
- Philosophy: Let developers build what they need

**Composition Pattern:**
```tsx
// Each part is independently controllable
<Select>
  <SelectTrigger>          {/* Custom trigger styling */}
    <SelectValue />         {/* Placeholder + value display */}
    <SelectIcon />          {/* Optional custom icon */}
  </SelectTrigger>
  <SelectPortal>           {/* Optional portal rendering */}
    <SelectContent>        {/* Dropdown container */}
      <SelectScrollUpButton />  {/* Optional scroll controls */}
      <SelectViewport>     {/* Scrollable area */}
        <SelectGroup>      {/* Optional grouping */}
          <SelectLabel />  {/* Group labels */}
          <SelectItem />   {/* Individual options */}
        </SelectGroup>
      </SelectViewport>
      <SelectScrollDownButton />
    </SelectContent>
  </SelectPortal>
</Select>
```

**Flexibility vs Complexity Trade-off:**
- Maximum flexibility through composition
- Higher complexity for basic use cases (more boilerplate)
- Pays off for complex, custom UIs
- May be overkill for simple selects

### Accessibility Considerations
- Implements full ListBox WAI-ARIA design pattern
- Automatic keyboard navigation (arrows, Enter, Escape, typeahead)
- Focus management handles all edge cases
- Proper ARIA attributes on all parts
- Screen reader announcements for state changes
- Group labels properly associated with items
- Disabled items correctly excluded from navigation

### State Management Patterns
- Supports both controlled and uncontrolled modes
- Open state can be controlled separately from value
- Events provide escape hatches for custom behavior
- No built-in form validation UI (delegates to forms)

### Performance Considerations
- Portal rendering option prevents z-index conflicts
- Viewport virtualization not included (would need custom implementation)
- Lazy rendering of content (only when open)
- Bundle size: 34.89 kB from Radix primitives

### Notable Omissions
- No built-in search/filter (common Select feature)
- No loading states for async options
- No multi-select support
- No creatable/taggable patterns
- No size variants (sm/md/lg)
- No visual style variants
- No error/validation states
- No helper text component
- No clear/reset button
- No native select fallback for SSR

### Integration Patterns

**Form Libraries:**
```tsx
// React Hook Form example (implied pattern)
<Select
  value={field.value}
  onValueChange={field.onChange}
  name={field.name}
>
  {/* ... */}
</Select>
```

**Custom Trigger Content:**
```tsx
<SelectTrigger>
  <div className="flex items-center gap-2">
    <Avatar src={selectedUser.avatar} />
    <SelectValue placeholder="Select user" />
  </div>
</SelectTrigger>
```

**Disabled Items:**
```tsx
<SelectItem value="disabled-option" disabled>
  Unavailable Option
</SelectItem>
```

## Key Takeaways for Semantic UI

### Pattern Alignment
- **Composable architecture** provides maximum flexibility - worth considering for complex components
- **Accessibility foundation** via Radix shows value of building on proven primitives
- **Controlled/uncontrolled patterns** are React-standard - Semantic UI should support similar flexibility
- **Data attributes for styling** provide excellent state-based styling hooks

### Pattern Divergence
- **React-only** incompatible with Semantic UI's framework-agnostic web component approach
- **CLI installation** conflicts with standard npm package distribution
- **Over-composition** may be too complex for typical Semantic UI use cases
- **Lack of built-in variants** too minimal for comprehensive component library

### Potential Adoptions

1. **Composable Structure**: Consider exposing select parts as separate components/slots
   - `<ui-select>` → Root container
   - `<ui-select-trigger>` → Button trigger
   - `<ui-select-content>` → Dropdown panel
   - `<ui-select-item>` → Options

2. **Grouped Options Pattern**: Support semantic grouping with labels
   - `<ui-select-group label="Category">` or `<ui-select-label>` component
   - Clear visual and semantic separation

3. **Data Attributes**: Expose state via data attributes for CSS styling
   - `[data-state="open|closed"]` on trigger
   - `[data-highlighted]` on items
   - `[data-selected]` on items

4. **Positioning API**: Flexible positioning options
   - Item-aligned vs popper strategies
   - Collision detection and boundary awareness
   - Portal rendering for z-index control

5. **Accessibility Baseline**: Full ListBox ARIA pattern
   - Proper roles and attributes
   - Keyboard navigation (arrows, typeahead, Enter/Escape)
   - Focus management

6. **Controlled/Uncontrolled Modes**:
   - Support both via `value`/`defaultValue` patterns
   - Separate control for open state

### Avoid These Patterns

1. **Excessive Composition**: Don't require 10+ components for basic select
   - Semantic UI should support simple one-liner selects
   - Composition as opt-in for advanced use cases

2. **React Dependency**: Maintain framework-agnostic web components
   - Work with React, Vue, Svelte, vanilla JS

3. **No Search/Filter**: Select should support common search pattern
   - Filter options by typing
   - Async option loading

4. **Missing Visual Variants**: Semantic UI should provide:
   - Size variants (sm, md, lg)
   - Style variants (outlined, filled, borderless)
   - Error/validation states
   - Loading states

5. **CLI Installation**: Keep standard npm install workflow
   - No custom tooling requirements

6. **Tailwind-Only Styling**: Support multiple styling approaches
   - CSS custom properties / design tokens
   - Class-based variants
   - Inline styles where appropriate

### Recommended Semantic UI Approach

**Simple Use Case (80%):**
```html
<ui-select name="theme" placeholder="Select theme">
  <ui-option value="light">Light</ui-option>
  <ui-option value="dark">Dark</ui-option>
  <ui-option value="system">System</ui-option>
</ui-select>
```

**Advanced Use Case (20%):**
```html
<ui-select searchable grouped>
  <ui-select-trigger slot="trigger">
    <custom-avatar></custom-avatar>
    <ui-select-value></ui-select-value>
  </ui-select-trigger>

  <ui-select-group label="Fruits">
    <ui-option value="apple">Apple</ui-option>
    <ui-option value="banana">Banana</ui-option>
  </ui-select-group>

  <ui-select-group label="Vegetables">
    <ui-option value="carrot">Carrot</ui-option>
    <ui-option value="broccoli">Broccoli</ui-option>
  </ui-select-group>
</ui-select>
```

This balances ShadCN's flexibility with Semantic UI's ease-of-use philosophy.
