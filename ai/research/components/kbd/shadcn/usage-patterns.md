# ShadCN UI - Kbd Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/kbd
Status: ✅ Working
Version: Current (as of 2025-11-05)
Last Verified: 2025-11-05

## Documentation Quality
**Good** - Provides clear examples with multiple usage contexts, installation instructions, and API reference. Documentation is concise and focused on practical usage patterns.

## Component Definition

### Core Purpose
The Kbd component displays textual user input from keyboard. It provides a visually distinct way to represent keyboard keys and shortcuts in user interfaces, making keyboard navigation and shortcuts more discoverable to users.

### Mental Model
Users should think of Kbd as a semantic representation of keyboard keys - similar to how the HTML `<kbd>` element works but with enhanced styling and composition patterns. It's the visual equivalent of saying "press this key" or "use this keyboard shortcut."

### Semantic Meaning
Kbd communicates keyboard input to users. When users see a Kbd element, they understand:
1. This represents a physical or virtual keyboard key
2. This key can be pressed to perform an action
3. When multiple Kbd elements are grouped, they represent a keyboard combination or sequence

## Pattern Support Levels

### Understanding Support Levels
- **Native**: Dedicated component or prop (e.g., `<Kbd>`)
- **Composed**: Via composition/children (e.g., combining `<Kbd>` inside other components)
- **CSS-only**: Requires custom styling (e.g., `className` prop)

## Component Architecture

ShadCN provides two components:

1. **Kbd** - Individual keyboard key representation
2. **KbdGroup** - Container for grouping multiple keyboard keys together

Both components accept a `className` prop for styling customization.

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Content passed as children to `<Kbd>` component |
| Unicode symbols | ✅ | Composed | Supports keyboard symbols: ⌘, ⇧, ⌥, ⌃, ⏎, Esc, etc. |
| Custom content | ✅ | Composed | Any React children can be rendered inside Kbd |
| Icon support | ✅ | Composed | Can render icons or other components as children |

## Type Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single key | ✅ | Native | Individual `<Kbd>` component for single keys |
| Key combinations | ✅ | Native | Via `<KbdGroup>` component wrapping multiple `<Kbd>` elements |
| Key sequences | ✅ | Composed | Multiple `<Kbd>` elements with separators (text or symbols) |

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | N/A | Not applicable to keyboard representation |
| Disabled | ❌ | CSS-only | Would require custom className styling |
| Active/Pressed | ❌ | CSS-only | Would require custom className styling |
| Focus | ❌ | CSS-only | Would require custom className styling |

## Variation Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No built-in size variants, use className |
| Visual styles | ❌ | CSS-only | Default style only, customize via className |
| Color options | ❌ | CSS-only | Default color only, customize via className |
| Spacing control | ✅ | CSS-only | Control spacing between keys in group via className |

## Composition Patterns

### Standalone Usage
```jsx
import { Kbd } from "@/components/ui/kbd"

<Kbd>Ctrl</Kbd>
```

### Grouped Keys
```jsx
import { Kbd, KbdGroup } from "@/components/ui/kbd"

<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>B</Kbd>
</KbdGroup>
```

### With Separators
```jsx
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <span>+</span>
  <Kbd>B</Kbd>
</KbdGroup>
```

### Platform-Specific Symbols
```jsx
<KbdGroup>
  <Kbd>⌘</Kbd>  {/* Command (macOS) */}
  <Kbd>⇧</Kbd>  {/* Shift */}
  <Kbd>⌥</Kbd>  {/* Option (macOS) */}
  <Kbd>⌃</Kbd>  {/* Control */}
</KbdGroup>
```

### Inside Buttons
```jsx
<Button variant="outline" size="sm" className="pr-2">
  Accept <Kbd>⏎</Kbd>
</Button>
```

### Within Tooltips
```jsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button size="sm" variant="outline">Save</Button>
  </TooltipTrigger>
  <TooltipContent>
    <div className="flex items-center gap-2">
      Save Changes <Kbd>S</Kbd>
    </div>
  </TooltipContent>
</Tooltip>
```

### In Input Groups
```jsx
<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon align="inline-end">
    <Kbd>⌘</Kbd>
    <Kbd>K</Kbd>
  </InputGroupAddon>
</InputGroup>
```

## API Documentation

### Kbd Component

```typescript
interface KbdProps {
  className?: string;
  children?: React.ReactNode;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | `""` | Additional CSS classes for styling |
| `children` | ReactNode | - | Content to display (text, symbols, or components) |

### KbdGroup Component

```typescript
interface KbdGroupProps {
  className?: string;
  children?: React.ReactNode;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | `""` | Additional CSS classes for styling |
| `children` | ReactNode | - | Multiple Kbd components or other elements |

## Styling Approach

### Customization Method
ShadCN uses **className-based customization** following the Tailwind CSS pattern:

```jsx
// Custom size
<Kbd className="text-lg px-3 py-2">Ctrl</Kbd>

// Custom color
<Kbd className="bg-blue-100 text-blue-900">⌘</Kbd>

// Custom spacing in group
<KbdGroup className="gap-3">
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
```

### Default Styling
The component comes with default styling that provides:
- Distinct visual appearance for keyboard keys
- Proper spacing and padding
- Border and background treatment
- Typography optimized for readability

All styling is customizable through the className prop and Tailwind CSS utilities.

## Accessibility Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Semantic HTML | ✅ | Native | Uses semantic `<kbd>` HTML element |
| Screen reader support | ✅ | Native | Inherits from `<kbd>` element semantics |
| ARIA attributes | ❌ | Not documented | No specific ARIA attributes mentioned |
| Keyboard navigation | ❌ | N/A | Component is for display, not interactive |

### Accessibility Notes
- The component uses the semantic `<kbd>` HTML element, which screen readers recognize as keyboard input
- Screen readers will announce the content as keyboard input to users
- No interactive keyboard navigation needed as this is a display-only component

## Installation

```bash
pnpm dlx shadcn@latest add kbd
```

The installation command adds the component files to your project's component directory.

## Code Examples

### Basic Example - Symbol Keys
```jsx
import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⌃</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>B</Kbd>
      </KbdGroup>
    </div>
  )
}
```
[View Live](https://ui.shadcn.com/docs/components/kbd)

### Example - Button Integration
```jsx
<Button variant="outline" size="sm" className="pr-2">
  Accept <Kbd>⏎</Kbd>
</Button>
```

### Example - Tooltip Integration
```jsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button size="sm" variant="outline">Save</Button>
  </TooltipTrigger>
  <TooltipContent>
    <div className="flex items-center gap-2">
      Save Changes <Kbd>S</Kbd>
    </div>
  </TooltipContent>
</Tooltip>
```

### Example - Input Group Integration
```jsx
<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon align="inline-end">
    <Kbd>⌘</Kbd>
    <Kbd>K</Kbd>
  </InputGroupAddon>
</InputGroup>
```

## Notable Features

### Strengths
1. **Simple API** - Only two components (Kbd and KbdGroup) with minimal props
2. **High Composability** - Works seamlessly with other ShadCN components (Button, Tooltip, Input)
3. **Unicode Support** - Full support for keyboard symbols across platforms (⌘, ⇧, ⌥, ⌃, ⏎, Esc)
4. **Semantic HTML** - Uses proper `<kbd>` element for accessibility
5. **Flexible Separators** - Can use any element (text, spans, custom separators) between keys
6. **Tailwind Integration** - Fully customizable through className and Tailwind utilities

### Design Philosophy
- **Minimalist approach** - Provides core functionality without overloading with variants
- **Composition over configuration** - Encourages building complex patterns through composition
- **Integration-focused** - Designed to work within other UI contexts (buttons, tooltips, inputs)
- **Flexibility** - Simple props allow for maximum customization through CSS

### Implementation Patterns
1. **Two-tier component structure** - Separate components for single keys and grouped keys
2. **Children-based content** - All content passed as React children for maximum flexibility
3. **No variant props** - Relies on className for all visual customization
4. **Framework integration** - Examples show integration with broader ShadCN component ecosystem

### Unique Characteristics
- **Documentation emphasis on composition** - Most examples show Kbd used within other components
- **Platform symbol support** - Explicit support for macOS-specific symbols (⌘, ⌥)
- **Separator flexibility** - Groups allow mixing Kbd with arbitrary separator elements
- **No built-in state management** - Pure presentational component

## Research Notes

### Documentation Observations
- Documentation is concise and example-driven
- Strong focus on practical usage patterns (buttons, tooltips, inputs)
- Clear installation instructions using ShadCN CLI
- API reference provided but minimal (only className prop)
- No mention of browser compatibility or dependencies

### Framework Approach
- ShadCN follows a "copy-paste" component model where components are added to your project rather than installed as dependencies
- This gives developers full control over the component implementation
- The Kbd component is intentionally minimal to encourage customization
- Emphasis on Tailwind CSS for styling customization

### Missing Documentation
- No TypeScript type definitions shown in docs
- No information about the actual implementation/source code structure
- No guidance on responsive behavior
- No examples of advanced styling patterns
- No mention of testing or accessibility testing

### Research Methodology
- Accessed documentation on 2025-11-05
- URL working and fully accessible
- All examples extracted from official documentation
- Component appears to be part of the stable ShadCN component collection
