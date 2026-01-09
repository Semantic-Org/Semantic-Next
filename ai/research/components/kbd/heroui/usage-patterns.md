# HeroUI (NextUI) - Kbd Usage Patterns

## Component URL
https://www.heroui.com/docs/components/kbd
Status: ✅ Working
Version: v2 (feat/v2 branch)
Last Verified: 2025-11-05

## Documentation Quality
**Good** - Clear, focused documentation with practical examples. Includes installation instructions, TypeScript types, accessibility information, and component slot system. Could benefit from more advanced composition examples.

## Component Definition
- **Core purpose**: Display keyboard shortcuts and key combinations in a visually consistent manner. Shows users "which key or combination of keys performs a given action."
- **Mental model**: A visual representation of physical keyboard keys that users would press. Mimics the appearance of actual keyboard keys to make instructions immediately recognizable.
- **Semantic meaning**: Indicates an interactive keyboard command or shortcut. Communicates "press this key/combination to perform an action" in the UI.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `keys={["command"]}`)
- **Composed**: Via composition/children (e.g., `<Kbd>K</Kbd>`)
- **CSS-only**: Requires custom styling (e.g., `classNames` prop)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Children prop accepts any ReactNode content |
| Icon support | ✅ | Native | Built-in icons for modifier keys (command, shift, ctrl, option, etc.) |
| Media support | ❌ | - | Not applicable for this component type |
| Custom content | ✅ | Composed | ReactNode children allows custom content |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Modifier keys | ✅ | Native | command, shift, ctrl, option, alt, win, fn |
| Action keys | ✅ | Native | enter, delete, escape, tab, space, help |
| Navigation keys | ✅ | Native | up, right, down, left, pageup, pagedown, home, end |
| System keys | ✅ | Native | capslock |
| Custom keys | ✅ | Composed | Any text content via children |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | - | Not applicable for this component |
| Disabled | ❌ | - | Not documented (kbd keys represent static shortcuts) |
| Active/Pressed | ❌ | - | Not documented |
| Hover | ❌ | - | Not documented (likely handled via CSS) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | - | Not documented (likely inherits from parent styling) |
| Spacing control | ❌ | - | Not documented (handled externally via flex gap in examples) |
| Visual styles | ✅ | CSS-only | Via classNames prop for custom styling |
| Color options | ❌ | - | Not documented as native prop |
| Alignment | ❌ | - | Not documented (likely handled by parent container) |
| Key combinations | ✅ | Native | Arrays of keys via `keys` prop |
| Single key display | ✅ | Native | Single key via `keys` prop |

## Props/API Documentation

### Core Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content displayed in the keyboard key |
| `keys` | KbdKey \| KbdKey[] | - | Keyboard keys to display |
| `classNames` | Partial<Record<"base" \| "abbr" \| "content", string>> | - | Custom class names for component slots |

### Supported Key Types
```typescript
type KbdKey =
  | "command" | "shift" | "ctrl" | "option"
  | "enter" | "delete" | "escape" | "tab"
  | "capslock" | "up" | "right" | "down" | "left"
  | "pageup" | "pagedown" | "home" | "end"
  | "help" | "space" | "fn" | "win" | "alt";
```

### Component Slots
The component uses a slot-based styling system:
- **base**: Handles alignment, placement, and general appearance
- **abbr**: Wraps keys and manages their visual styling
- **content**: Wraps children and manages content appearance

Each slot can be targeted via the `classNames` prop for granular styling control.

## Code Examples

### Basic Usage
```jsx
import {Kbd} from "@heroui/react";

export default function App() {
  return <Kbd keys={["command"]}>K</Kbd>;
}
```

### Multiple Key Combinations
```jsx
import {Kbd} from "@heroui/react";

export default function App() {
  return (
    <div className="flex gap-4">
      <Kbd keys={["command"]}>K</Kbd>
      <Kbd keys={["command", "shift"]}>N</Kbd>
      <Kbd keys={["option", "command"]}>P</Kbd>
    </div>
  );
}
```

### Custom Styling via Slots
```jsx
import {Kbd} from "@heroui/react";

export default function App() {
  return (
    <Kbd
      keys={["command"]}
      classNames={{
        base: "custom-base-class",
        abbr: "custom-abbr-class",
        content: "custom-content-class"
      }}
    >
      K
    </Kbd>
  );
}
```

## Composition Patterns

### Inline Documentation Pattern
Kbd components are typically composed inline with text to document keyboard shortcuts:
```jsx
<p>Press <Kbd keys={["command"]}>K</Kbd> to open search</p>
```

### Key Combination Groups
Multiple Kbd components displayed together to show alternatives or sequences:
```jsx
<div className="flex gap-4">
  <Kbd keys={["command"]}>K</Kbd>
  <Kbd keys={["command", "shift"]}>N</Kbd>
  <Kbd keys={["option", "command"]}>P</Kbd>
</div>
```

## Styling Approaches

### Slot-Based System
HeroUI uses a sophisticated slot-based styling architecture:
- Each visual part of the component is a named "slot"
- Slots can be individually styled via the `classNames` prop
- Provides fine-grained control without breaking encapsulation

### Integration Points
- **base slot**: Overall component container styling
- **abbr slot**: Individual key badge styling
- **content slot**: Main content area styling

## Accessibility Patterns

### Screen Reader Support
Each command key includes a `title` attribute that describes the action the key performs, providing semantic information to assistive technologies.

### Semantic HTML
Uses appropriate HTML semantics (likely `<kbd>` element) to indicate keyboard input, which is recognized by screen readers and browsers.

## Notable Features

### 1. Comprehensive Key Support
Covers all major keyboard key categories:
- Modifier keys (command, shift, ctrl, option, alt, win, fn)
- Action keys (enter, delete, escape, tab, space, help)
- Navigation keys (arrows, page up/down, home, end)
- System keys (capslock)

### 2. Platform-Aware Design
Includes platform-specific keys like `command` (macOS), `win` (Windows), and `option` (macOS), enabling platform-specific documentation.

### 3. Key Combination Support
Native support for displaying multiple keys simultaneously via array syntax: `keys={["command", "shift"]}`

### 4. Server Component Compatible
Explicitly documented as compatible with Next.js server components, making it suitable for modern React architectures.

### 5. Slot-Based Styling Architecture
Advanced styling system allowing granular control over component internals without breaking encapsulation or requiring style overrides.

### 6. TypeScript First
Full TypeScript support with explicit type definitions for all supported keys, providing excellent DX with autocomplete and type safety.

### 7. Package Flexibility
Available as both individual package (`@heroui/kbd`) and as part of the main bundle (`@heroui/react`), supporting different bundle optimization strategies.

## Research Notes

### Documentation Strengths
- Clear, focused single-purpose component
- Excellent TypeScript integration
- Good accessibility considerations
- Well-documented slot system

### Documentation Gaps
- No examples of custom key styling
- Limited composition pattern examples
- No discussion of responsive behavior
- No mention of RTL support for key ordering
- No examples of dynamic key display (showing different keys based on OS)
- No discussion of keyboard shortcut conflict detection or validation

### Framework-Specific Observations
- HeroUI's slot-based styling system is more sophisticated than typical className-based approaches
- Strong focus on developer experience with TypeScript
- Explicit Next.js server component support indicates modern React architecture priorities
- CLI tool for adding components suggests opinionated project structure

### Comparison Notes
This is the first kbd/keyboard key component researched in this project. Future comparisons will reference this implementation.
