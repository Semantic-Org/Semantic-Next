# ShadCN - Separator/Divider Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/separator
Status: ✅ Working

## Documentation Quality
Good - Clear examples and practical usage patterns, though intentionally minimal API surface. Relies heavily on Radix UI primitives documentation for advanced configuration.

## Component Definition
- **Core purpose**: Visually or semantically separates content into distinct sections within a page or interface
- **Mental model**: A presentational divider - either a line between content blocks (horizontal) or between inline elements (vertical)
- **Semantic meaning**: Provides visual and semantic separation (leveraging Radix UI's accessible separator primitive)

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ❌ | Pure divider - no text/label support shown |
| Icon support | ❌ | No icon integration demonstrated |
| Media support | ❌ | Not applicable - presentational divider |
| Custom content | ❌ | Non-semantic divider only - no content slots |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Horizontal | ✅ | Default orientation - separates vertical content blocks |
| Vertical | ✅ | `orientation="vertical"` - divides inline/horizontal elements |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ❌ | Not applicable |
| Disabled | ❌ | Not applicable |
| Interactive | ❌ | Purely presentational - no interactive states |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ❌ | Not exposed - controlled via CSS/Tailwind classes |
| Spacing control | ✅ | Via `className` prop (e.g., `my-4` for margins) |
| Visual styles | ❌ | No built-in variants (solid/dashed/dotted) - CSS customizable |
| Color options | ❌ | No prop-based colors - styled via Tailwind classes |
| Alignment | ❌ | Not applicable for dividers |

## Code Examples

### Basic Horizontal Separator
```jsx
import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}
```

### Vertical Separator Usage
```jsx
<div className="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <Separator orientation="vertical" />
  <div>Docs</div>
  <Separator orientation="vertical" />
  <div>Source</div>
</div>
```

### Installation
```bash
pnpm dlx shadcn@latest add separator
```

## API Surface

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout orientation of the divider |
| `className` | `string` | `undefined` | Additional Tailwind/CSS classes for styling |
| `decorative` | `boolean` | (Radix default) | Whether separator is purely decorative (inherited from Radix) |

Note: Component inherits additional props from Radix UI Separator primitive.

## Notable Features

### Minimal API Design
- Intentionally simple with only essential props exposed
- Philosophy: Let CSS/Tailwind handle styling variations rather than prop-based variants
- No built-in size/color/style presets - maximum flexibility through className

### Radix UI Foundation
- Built on `@radix-ui/react-separator` primitive
- Inherits accessibility features from Radix (proper ARIA roles)
- Semantic HTML element (`role="separator"`) for screen readers

### Tailwind-First Styling
- All visual customization through Tailwind utility classes
- No component-level theming system
- Spacing controlled via margin utilities (e.g., `my-4`, `mx-2`)

### React Framework Requirement
- Tightly integrated with React ecosystem
- Uses ShadCN CLI for installation (adds to local components directory)
- Not a standalone web component - requires React runtime

## Research Notes

### Documentation Accessibility
- Clean, well-organized documentation
- Live interactive examples on the page
- Clear installation instructions via CLI
- Links to Radix UI for deeper API reference

### Framework Approach
ShadCN's philosophy differs from traditional component libraries:
1. **Copy, don't install**: Components are added to your project via CLI
2. **Full ownership**: You own the component code, can modify freely
3. **Composition over configuration**: Minimal props, maximum CSS flexibility
4. **No package dependency**: Components live in your codebase, not node_modules

### Comparison to Other Frameworks
- **Ant Design**: Has label/text support, multiple style variants, more props
- **Chakra UI**: Offers size variants, color schemes, thickness control
- **Material UI**: Provides variant (fullWidth/inset/middle), orientation, and flexItem
- **ShadCN**: Most minimal - just orientation + className, intentionally basic

### Design Philosophy Insights
ShadCN takes an **unopinionated minimalist** approach:
- Provides just enough structure to be useful
- Avoids prop proliferation
- Expects developers to extend via CSS
- Treats components as starting points, not black boxes
- React-only (no framework-agnostic approach)

### Accessibility Considerations
- Leverages Radix UI's built-in accessibility
- Proper semantic separator role
- Decorative vs semantic usage supported (via Radix prop)
- No additional ARIA customization exposed

### Notable Omissions
- No text/label support (unlike Ant Design, Hero UI)
- No built-in spacing variants (sm/md/lg)
- No style presets (dashed, dotted, gradient)
- No color theming props
- No content slots or composition patterns

## Key Takeaways for Semantic UI

### Pattern Alignment
- **Orientation support** is universal - horizontal/vertical are table stakes
- **Minimal prop API** can work if combined with robust CSS theming
- **Accessibility foundation** should leverage web standards (role="separator")

### Pattern Divergence
- ShadCN's "copy-paste" model incompatible with Semantic UI's npm package approach
- React-only limits framework-agnostic goals
- Lack of semantic patterns (labels, content) may be too limiting for Semantic UI's comprehensive approach

### Potential Adoptions
1. **Simple orientation API**: `orientation="horizontal|vertical"` is clean and universal
2. **CSS custom properties**: Allow styling flexibility without prop bloat
3. **Accessibility baseline**: Ensure proper semantic HTML and ARIA roles
4. **Optional decorative mode**: Support both semantic and purely visual dividers

### Avoid These Patterns
1. **React dependency**: Maintain framework-agnostic web component approach
2. **Over-minimalism**: Semantic UI should support common patterns (labels, spacing) out of box
3. **CSS-only theming**: Semantic UI's design token system is more powerful
4. **Installation complexity**: Keep standard npm install, avoid CLI requirements
