# Radix UI Primitives - Select Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.radix-ui.com/primitives/docs/components/select
Status: ✅ Working
Version: Current (Radix Primitives)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-organized with clear examples, thorough API documentation, and detailed accessibility guidance

## Component Definition
- **Core purpose**: A headless, unstyled select dropdown component that provides all the functionality of a native select with enhanced UX and accessibility. Displays a list of options for the user to pick from—triggered by a button.
- **Mental model**: A composable primitive built from multiple sub-components that work together to create a fully accessible select experience. Users think of it as a select that can be styled completely from scratch while maintaining native-like behavior and accessibility.
- **Semantic meaning**: Form input control for selecting a single option from a list. Adheres to the ListBox WAI-ARIA design pattern and follows the W3C Select-Only Combobox example.

## Pattern Support Levels
- **Native**: Dedicated prop/API on specific sub-component
- **Composed**: Via composition of multiple sub-components
- **Manual**: Requires custom implementation by consumer

## Architecture Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Compound components | ✅ | Native | Multiple sub-components (Root, Trigger, Value, Content, Item, etc.) compose together |
| Headless/unstyled | ✅ | Native | No default styling - complete style control to consumer |
| Portal rendering | ✅ | Native | `Select.Portal` component portals content to document body |
| Controlled/uncontrolled | ✅ | Native | Both `value`/`onValueChange` (controlled) and `defaultValue` (uncontrolled) supported |
| Forward refs | ✅ | Native | All components support ref forwarding |

## Sub-Components
| Component | Purpose | Details |
|-----------|---------|---------|
| Select.Root | Container | Contains all parts of select, manages state and context |
| Select.Trigger | Button | Toggles select open/closed, content aligns over trigger |
| Select.Value | Display | Reflects currently selected value, renders selected item text by default |
| Select.Icon | Visual affordance | Small icon next to value (renders ▼ by default) |
| Select.Portal | Portaling | Portals content to document body when used |
| Select.Content | Dropdown | Component that pops out when select is open |
| Select.Viewport | Scroll container | Scrolling viewport containing all items |
| Select.Item | Option | Individual selectable option |
| Select.ItemText | Item content | Textual content of item (used for typeahead and accessibility) |
| Select.ItemIndicator | Selection marker | Rendered when item is selected (for custom checkmarks) |
| Select.Group | Grouping | Groups related items together |
| Select.Label | Group label | Non-selectable label for item groups |
| Select.Separator | Divider | Visual separator between items or groups |
| Select.ScrollUpButton | Scroll control | Button to scroll up when items overflow |
| Select.ScrollDownButton | Scroll control | Button to scroll down when items overflow |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Open/closed | ✅ | Native | `open`/`defaultOpen` props on Root, `onOpenChange` callback |
| Selected value | ✅ | Native | `value`/`defaultValue` props on Root, `onValueChange` callback |
| Disabled | ✅ | Native | `disabled` prop on Root and individual Items |
| Required | ✅ | Native | `required` prop on Root for form validation |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Item-relative (default) | ✅ | Native | Positions relative to active item (MacOS-style menu behavior) |
| Popper positioning | ✅ | Native | `position="popper"` on Content for Popover/DropdownMenu-style positioning |
| Side placement | ✅ | Native | `side` prop on Content: "top" \| "right" \| "bottom" \| "left" |
| Alignment | ✅ | Native | `align` prop on Content: "start" \| "center" \| "end" |
| Side offset | ✅ | Native | `sideOffset` prop for distance from trigger |
| Align offset | ✅ | Native | `alignOffset` prop for alignment adjustment |
| Collision handling | ✅ | Native | Automatic repositioning when constrained by viewport boundaries |

## Scrolling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom scroll buttons | ✅ | Native | ScrollUpButton and ScrollDownButton components for overflow |
| Native scrollbar hidden | ✅ | Native | Hidden by default, custom scroll buttons recommended |
| Scroll Area integration | ✅ | Composed | Can compose with Radix Scroll Area primitive for custom scrolling |
| Viewport control | ✅ | Native | Viewport component manages scrollable area |

## Form Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Native form participation | ✅ | Native | `name` prop on Root creates hidden native select for form submission |
| Required validation | ✅ | Native | `required` prop for HTML5 validation |
| Auto-labeling | ✅ | Composed | Use with Radix Label component for proper accessibility |
| Value type | ⚠️ | Native | Only string values supported (HTML limitation for accessibility) |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| WAI-ARIA compliance | ✅ | Native | Follows ListBox WAI-ARIA design pattern |
| Keyboard navigation | ✅ | Native | Full keyboard support (Space, Enter, Arrows, Escape, etc.) |
| Typeahead search | ✅ | Native | Built-in typeahead to quickly find items by typing |
| Screen reader support | ✅ | Native | Proper ARIA attributes and roles automatically applied |
| Focus management | ✅ | Native | Automatic focus handling on open/close |
| RTL support | ✅ | Native | Right-to-left direction fully supported |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom placeholder | ✅ | Native | Pass placeholder text to Select.Value component |
| Item text | ✅ | Native | ItemText component ensures proper typeahead and a11y |
| Item indicators | ✅ | Native | ItemIndicator for custom selection markers |
| Grouped items | ✅ | Native | Group and Label components for organizing options |
| Separators | ✅ | Native | Separator component for visual divisions |
| Custom item content | ✅ | Composed | Items can contain any React nodes (icons, badges, etc.) |

## Code Examples

### Basic Usage
```jsx
import * as Select from '@radix-ui/react-select';

<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Select a fruit..." />
    <Select.Icon />
  </Select.Trigger>

  <Select.Portal>
    <Select.Content>
      <Select.Viewport>
        <Select.Item value="apple">
          <Select.ItemText>Apple</Select.ItemText>
          <Select.ItemIndicator>✓</Select.ItemIndicator>
        </Select.Item>
        <Select.Item value="banana">
          <Select.ItemText>Banana</Select.ItemText>
          <Select.ItemIndicator>✓</Select.ItemIndicator>
        </Select.Item>
        <Select.Item value="orange">
          <Select.ItemText>Orange</Select.ItemText>
          <Select.ItemIndicator>✓</Select.ItemIndicator>
        </Select.Item>
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

### Controlled State
```jsx
const [value, setValue] = React.useState('apple');

<Select.Root value={value} onValueChange={setValue}>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Content>
    <Select.Viewport>
      <Select.Item value="apple">
        <Select.ItemText>Apple</Select.ItemText>
      </Select.Item>
      <Select.Item value="banana">
        <Select.ItemText>Banana</Select.ItemText>
      </Select.Item>
    </Select.Viewport>
  </Select.Content>
</Select.Root>
```

### Grouped Items with Labels
```jsx
<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Select..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Viewport>
      <Select.Group>
        <Select.Label>Fruits</Select.Label>
        <Select.Item value="apple">
          <Select.ItemText>Apple</Select.ItemText>
        </Select.Item>
        <Select.Item value="banana">
          <Select.ItemText>Banana</Select.ItemText>
        </Select.Item>
      </Select.Group>

      <Select.Separator />

      <Select.Group>
        <Select.Label>Vegetables</Select.Label>
        <Select.Item value="carrot">
          <Select.ItemText>Carrot</Select.ItemText>
        </Select.Item>
        <Select.Item value="potato">
          <Select.ItemText>Potato</Select.ItemText>
        </Select.Item>
      </Select.Group>
    </Select.Viewport>
  </Select.Content>
</Select.Root>
```

### With Scroll Buttons
```jsx
<Select.Root>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Content>
    <Select.ScrollUpButton>
      <ChevronUpIcon />
    </Select.ScrollUpButton>

    <Select.Viewport>
      {/* Many items... */}
      <Select.Item value="item1">
        <Select.ItemText>Item 1</Select.ItemText>
      </Select.Item>
      {/* ... */}
    </Select.Viewport>

    <Select.ScrollDownButton>
      <ChevronDownIcon />
    </Select.ScrollDownButton>
  </Select.Content>
</Select.Root>
```

### Form Integration
```jsx
<form>
  <Select.Root name="fruit" required>
    <Select.Trigger>
      <Select.Value placeholder="Choose a fruit" />
    </Select.Trigger>
    <Select.Content>
      <Select.Viewport>
        <Select.Item value="apple">
          <Select.ItemText>Apple</Select.ItemText>
        </Select.Item>
        <Select.Item value="banana">
          <Select.ItemText>Banana</Select.ItemText>
        </Select.Item>
      </Select.Viewport>
    </Select.Content>
  </Select.Root>

  <button type="submit">Submit</button>
</form>
```

### Disabled State
```jsx
// Disabled select
<Select.Root disabled>
  <Select.Trigger>
    <Select.Value placeholder="Disabled select" />
  </Select.Trigger>
  <Select.Content>
    <Select.Viewport>
      <Select.Item value="apple">
        <Select.ItemText>Apple</Select.ItemText>
      </Select.Item>
    </Select.Viewport>
  </Select.Content>
</Select.Root>

// Disabled individual items
<Select.Root>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Content>
    <Select.Viewport>
      <Select.Item value="apple">
        <Select.ItemText>Apple</Select.ItemText>
      </Select.Item>
      <Select.Item value="banana" disabled>
        <Select.ItemText>Banana (unavailable)</Select.ItemText>
      </Select.Item>
    </Select.Viewport>
  </Select.Content>
</Select.Root>
```

### Popper Positioning
```jsx
<Select.Root>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Content position="popper" side="bottom" align="start" sideOffset={5}>
    <Select.Viewport>
      <Select.Item value="apple">
        <Select.ItemText>Apple</Select.ItemText>
      </Select.Item>
    </Select.Viewport>
  </Select.Content>
</Select.Root>
```

### Custom Value Display
```jsx
<Select.Root>
  <Select.Trigger>
    <Select.Value>
      {(value) => (
        <span>Selected: {value || 'Nothing'}</span>
      )}
    </Select.Value>
  </Select.Trigger>
  <Select.Content>
    <Select.Viewport>
      <Select.Item value="apple">
        <Select.ItemText>Apple</Select.ItemText>
      </Select.Item>
    </Select.Viewport>
  </Select.Content>
</Select.Root>
```

## Keyboard Interactions

| Key | Action |
|-----|--------|
| Space | Opens select when focused on trigger, selects item when focused on item |
| Enter | Opens select when focused on trigger, selects item when focused on item |
| ArrowDown | Moves focus to next item (wraps to first), opens select if closed |
| ArrowUp | Moves focus to previous item (wraps to last), opens select if closed |
| ArrowLeft | In RTL, moves to next item |
| ArrowRight | In RTL, moves to previous item |
| Escape | Closes select and moves focus back to trigger |
| A-Z, 0-9 | Typeahead: moves focus to item starting with typed character(s) |
| Home | Moves focus to first item |
| End | Moves focus to last item |
| PageUp | Moves focus up by page |
| PageDown | Moves focus down by page |

## Notable Features

### Headless Architecture
- **Zero styling**: Completely unstyled primitive - bring your own styles
- **Full control**: Every visual aspect controllable via CSS/props
- **No opinions**: No default theme or design system assumptions
- **Composable**: Build exactly the select you need from primitives

### Compound Component Pattern
- **Explicit structure**: Each sub-component has clear responsibility
- **Flexible composition**: Omit or customize any part
- **Type-safe**: Each component has own prop types
- **Discoverable**: Clear API surface with named exports

### Positioning Strategy
- **Default (item-relative)**: Content positions relative to selected/focused item, mimicking native MacOS menu behavior - provides familiarity
- **Popper mode**: Alternative positioning like Popover/DropdownMenu for different UX needs
- **Collision detection**: Automatically adjusts when constrained by viewport
- **Customizable offsets**: Fine-tune positioning with offset props

### Scroll Behavior
- **Hidden native scrollbar**: Default hides native scrollbar for consistent UX
- **Custom scroll buttons**: ScrollUpButton/ScrollDownButton for better UX
- **Scroll Area integration**: Can compose with Radix ScrollArea for advanced scrolling
- **Performance**: Viewport component optimizes rendering of many items

### Accessibility Excellence
- **WAI-ARIA compliance**: Follows official ListBox pattern
- **W3C example**: Implements Select-Only Combobox specification
- **Typeahead search**: Built-in character navigation
- **Screen reader tested**: Comprehensive screen reader support
- **Focus management**: Proper focus trapping and restoration
- **RTL support**: Full right-to-left language support
- **Keyboard complete**: All interactions available via keyboard

### Form Integration
- **Native select hidden**: Creates hidden native select for form submission
- **HTML5 validation**: Supports required and other validation
- **String values only**: Values must be strings (HTML limitation for accessibility)
- **Name prop**: Direct form field naming support

### State Management
- **Controlled mode**: Full control with value/onValueChange
- **Uncontrolled mode**: Simple usage with defaultValue
- **Open state control**: Can control open/closed state programmatically
- **Callbacks**: Rich event callbacks for state changes

### Portal Support
- **Optional portaling**: Portal component for rendering outside DOM hierarchy
- **Stacking context**: Avoids z-index/overflow issues
- **Modal compatibility**: Works well in modal/dialog contexts
- **Customizable**: Can portal to custom containers

### ItemText Component
- **Typeahead requirement**: ItemText ensures proper typeahead functionality
- **Accessibility critical**: Required for screen reader announcement
- **Flexible content**: Items can have additional content beyond ItemText
- **Selection display**: ItemText value used in Select.Value by default

## Research Notes

### API Design Philosophy
Radix UI Select exemplifies the "headless UI" pattern - providing all functionality with zero styling. The compound component architecture gives maximum flexibility while maintaining accessibility and UX quality. The explicit sub-component structure makes the API discoverable and type-safe.

### Comparison to Native Select
- **UX improvements**: Better keyboard nav, typeahead, positioning than native
- **Styling freedom**: Complete visual control vs. limited native styling
- **Accessibility parity**: Maintains native-level a11y through hidden select
- **Form compatibility**: Works with standard forms via hidden native select
- **Trade-off**: More complex API for better UX/flexibility

### Primitive vs. Styled Versions
Radix offers two packages:
- **@radix-ui/react-select** (Primitives): Headless, unstyled - this component
- **@radix-ui/themes** Select: Pre-styled version with design system

This research covers the **Primitives** version - the foundational headless component.

### Position Strategy Trade-offs

**Item-relative (default)**:
- ✅ Familiar MacOS-style menu behavior
- ✅ Selected item appears in same position
- ✅ Better for keyboard-first users
- ❌ Less predictable for mouse users

**Popper positioning**:
- ✅ Predictable dropdown location
- ✅ Better for mouse-first users
- ✅ Familiar popover-style interaction
- ❌ Selected item position varies

### Scroll Button Recommendation
Radix strongly recommends using ScrollUpButton/ScrollDownButton instead of native scrollbars because:
- More touch-friendly on mobile
- More discoverable for users
- Better cross-browser consistency
- Clearer indication of more content
- Can be styled to match design system

### String-Only Values Rationale
Select only accepts string values (not objects/numbers) because:
- Hidden native select requires string values for HTML
- Maintains accessibility through native select
- Follows HTML specification
- Enforces separation of display and value

Workaround: Use string IDs as values, map to objects in application code.

### ItemText Importance
The ItemText component is not optional for proper functionality:
- Required for typeahead to work correctly
- Ensures screen readers announce correct text
- Used for default Select.Value display
- Separates semantic text from additional decorative content

### Group and Label Pattern
Groups and Labels create semantic structure:
- Labels are not focusable (intentional design)
- Improves navigation with many options
- Better screen reader experience
- Visual organization with Separator

### Portal Considerations
Using Portal is optional but recommended when:
- Select inside scrollable container
- Select inside positioned element
- z-index/overflow issues present
- Need to escape stacking context

### Accessibility Implementation Details
- **Role/ARIA**: Proper listbox roles and ARIA attributes
- **Focus trap**: Focus contained within dropdown when open
- **Focus restoration**: Returns focus to trigger on close
- **Live regions**: Announces selection changes
- **Keyboard nav**: Complete keyboard coverage
- **Typeahead**: Multi-character typeahead with timeout reset

### Performance Considerations
- **Viewport virtualization**: Not built-in, but structure supports it
- **Large lists**: Consider virtualization for 1000+ items
- **Portal overhead**: Minimal, React handles efficiently
- **Render optimization**: Controlled state enables optimization

### Pattern Completeness
The component provides comprehensive coverage:
- ✅ All positioning strategies
- ✅ Complete keyboard navigation
- ✅ Full accessibility compliance
- ✅ Form integration
- ✅ Controlled/uncontrolled modes
- ✅ Custom scroll controls
- ✅ Grouping and organization
- ✅ Flexible content patterns
- ✅ Portal rendering
- ✅ Disabled states
- ❌ Multi-select (separate component needed)
- ❌ Searchable/filterable (requires custom implementation)
- ❌ Virtualization (requires third-party integration)

### Comparison Points for Semantic UI
- **Headless pattern**: No default styling vs. styled components
- **Compound components**: Explicit sub-components vs. single component with props
- **Positioning**: Two distinct strategies (item-relative and popper)
- **Scroll controls**: Custom scroll buttons recommended over native scrollbar
- **Form integration**: Hidden native select for compatibility
- **String values only**: HTML limitation for accessibility
- **ItemText requirement**: Necessary for typeahead and a11y
- **Portal pattern**: Optional but recommended for layering
- **WAI-ARIA**: Strict adherence to ListBox pattern
- **Typeahead**: Built-in character search functionality
- **RTL support**: First-class right-to-left support
- **Controlled/uncontrolled**: Both patterns fully supported
- **Composition flexibility**: Every part customizable or omittable
