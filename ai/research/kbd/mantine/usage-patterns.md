# Mantine - Kbd Usage Patterns

## Component URL
https://mantine.dev/core/kbd/

Status: ✅ Working
Version: 8.3.6 (Current)
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear purpose and examples, though some API details require deeper exploration of source code.

## Component Definition
- **Core purpose**: Display keyboard keys and keyboard shortcuts in a visually distinct, semantic manner within the UI
- **Mental model**: A semantic wrapper that styles text content to look like physical keyboard keys, making keyboard instructions clear and scannable
- **Semantic meaning**: Represents user input from a keyboard device, communicating that specific keys or key combinations should be pressed

## Pattern Support Levels
- **Native**: Direct prop support (e.g., `size="lg"`)
- **Composed**: Content via children composition (e.g., `<Kbd>Shift</Kbd>`)
- **CSS-only**: Requires custom styling via className or style props

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Keyboard key labels passed as children (e.g., "Shift", "Enter") |
| Symbol content | ✅ | Composed | Unicode keyboard symbols (e.g., ⌘, ⌃, ⌥, ⇧) supported as children |
| Icon support | ❌ | CSS-only | No native icon support; would require custom composition |
| Custom content | ✅ | Composed | Accepts any React children content |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single key | ✅ | Native | Default - displays individual keyboard key |
| Key combinations | ✅ | Composed | Multiple `<Kbd>` components with text separators (e.g., `<Kbd>⌘</Kbd> + <Kbd>Shift</Kbd>`) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Interactive/pressed | Unknown | Unknown | Not documented in visible examples |
| Disabled | Unknown | Unknown | Not documented in visible examples |
| Active | Unknown | Unknown | Not documented in visible examples |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop with xs, sm, md, lg, xl values |
| Color options | Unknown | Unknown | Likely supports Mantine's color system but not shown in examples |
| Visual styles | Unknown | Unknown | Not explicitly documented (solid, outline, etc.) |
| Custom styling | ✅ | CSS-only | Standard Mantine props (className, style, etc.) |

## Props API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | Unknown | Controls the size of the keyboard key display |
| children | ReactNode | - | Content to display inside the keyboard key |

**Note**: Complete props table not fully exposed in documentation. Component likely inherits standard Mantine component props (className, style, id, etc.) and polymorphic component capabilities typical of Mantine v8 components.

## Code Examples

### Basic Usage
```tsx
import { Kbd } from '@mantine/core';

function Demo() {
  return (
    <div dir="ltr">
      <Kbd>⌘</Kbd> + <Kbd>Shift</Kbd> + <Kbd>M</Kbd>
    </div>
  );
}
```
Output: ⌘ + Shift + M

### Size Variants
```tsx
import { Kbd } from '@mantine/core';

function Demo() {
  return <Kbd>Shift</Kbd>;
}
```

**Size options available**: xs, sm, md, lg, xl

## Composition Patterns

### Key Combination Pattern
The recommended pattern for displaying keyboard shortcuts is to compose multiple `<Kbd>` elements with plain text separators:

```tsx
<Kbd>⌘</Kbd> + <Kbd>Shift</Kbd> + <Kbd>M</Kbd>
```

This approach:
- Maintains semantic HTML structure (each key is individually marked up)
- Allows for flexible styling of individual keys
- Supports natural wrapping of long shortcuts
- Makes each key separately accessible

## Styling Approaches

### Package Integration
- **Package**: @mantine/core
- **Version**: v8.3.6
- Part of Mantine's core component library

### Theme System
- Supports Mantine's theming system (data-mantine-color-scheme referenced)
- Likely integrates with Mantine's global theme for consistent sizing, spacing, and colors
- Styles API section available but details not fully documented in scraped content

### Customization
- Standard Mantine customization props available (className, style)
- Styles API for targeting internal parts (details require source code inspection)

## Accessibility Patterns

### Semantic HTML
- Uses semantic markup to identify keyboard keys
- Helps screen readers understand the content represents keyboard input

### Best Practices
The documentation example includes `dir="ltr"` attribute on container, suggesting:
- Proper text directionality for keyboard symbols
- Consideration for internationalization

**Note**: Specific ARIA attributes or accessibility features not explicitly documented in visible content.

## Notable Features

### Unicode Symbol Support
The component handles Unicode keyboard symbols naturally:
- ⌘ (Command key - macOS)
- ⇧ (Shift arrow)
- ⌃ (Control)
- ⌥ (Option - macOS)

### Composition-Based Design
Rather than providing a complex API for key combinations, Mantine adopts a simple composition pattern where developers use multiple `<Kbd>` components with plain text separators. This is:
- More flexible than rigid API
- Easier to understand
- Naturally responsive

### Size Flexibility
Five size variants (xs, sm, md, lg, xl) provide granular control over display size, matching Mantine's consistent sizing system across components.

## Research Notes

### Documentation Structure
- Clean, straightforward documentation
- Examples focus on common use cases
- Some technical details (complete props, Styles API) require deeper exploration
- Source code links provided for reference

### Framework Context
The Kbd component in Mantine follows the framework's patterns:
- Minimal, focused API surface
- Composition over configuration
- Consistent sizing system
- Integration with theme system

### Version Information
Documentation clearly shows version 8.3.6, indicating active maintenance and recent updates.

### Comparison Notes
Mantine's approach is notably simple compared to some frameworks:
- No complex variant system
- No built-in key combination API (uses composition instead)
- Focus on visual representation rather than interactive behavior
- Relies on framework's standard patterns rather than component-specific API

## Research Methodology Notes
- Primary source: Official Mantine documentation at https://mantine.dev/core/kbd/
- Verification date: 2025-11-05
- Documentation accessed via web scraping
- Some API details inferred from Mantine's standard component patterns
- Complete Styles API and prop types would benefit from source code inspection
