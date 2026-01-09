# Radix UI - Portal Usage Patterns

## Component URL
https://www.radix-ui.com/primitives/docs/utilities/portal
Status: ✅ Working
Version: 1.1.9
Bundle Size: 1.72 kB (gzipped)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-structured documentation with clear API reference, code examples, and bundle size information. Package-level documentation with installation instructions.

## Component Definition
- **Core purpose**: Render React subtrees in different parts of the DOM, escaping normal component hierarchy constraints
- **Mental model**: A "portal" that teleports content from one location in the React tree to another location in the DOM tree
- **Semantic meaning**: Enables rendering UI elements (modals, tooltips, dropdowns) outside their parent containers to avoid CSS stacking context, z-index, and overflow issues

## Pattern Support Levels
- **Native**: Props for container customization and composition (`container`, `asChild`)
- **Composed**: Content passed as children to Portal.Root
- **CSS-only**: No specific styling patterns (utility handles DOM positioning only)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Any React content can be portaled |
| Icon support | ✅ | Composed | Icons can be children |
| Media support | ✅ | Composed | Images, video, any media can be children |
| Custom content | ✅ | Composed | Any React subtree supported |
| Component composition | ✅ | Native | `asChild` prop enables merging with child element |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default portal | ✅ | Native | Renders to `document.body` by default |
| Custom container | ✅ | Native | `container` prop accepts HTMLElement |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | N/A | - | Utility component, no state patterns |
| Disabled | N/A | - | Utility component, no state patterns |
| Active/Inactive | N/A | - | Utility component, no state patterns |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | N/A | - | Content determines size |
| Spacing control | N/A | - | No spacing props (utility) |
| Visual styles | N/A | - | No styling (utility) |
| Color options | N/A | - | No color props (utility) |
| Alignment | N/A | - | Handled by content |

## Props/API Documentation

### Portal.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | boolean | `false` | Change the default rendered element for the one passed as a child, merging their props and behavior. Used for composition patterns. |
| `container` | HTMLElement | - | Specify a different container element to append the portal content to. When not provided, defaults to `document.body`. |

## Code Examples

### Basic Usage
```jsx
import { Portal } from "radix-ui";

export default () => <Portal.Root>Content</Portal.Root>;
```

### Custom Container
```jsx
import { Portal } from "radix-ui";
import { useRef } from "react";

export default () => {
  const containerRef = useRef(null);

  return (
    <>
      <div ref={containerRef} />
      <Portal.Root container={containerRef.current}>
        Content rendered in custom container
      </Portal.Root>
    </>
  );
};
```

### Composition with asChild
```jsx
import { Portal } from "radix-ui";

export default () => (
  <Portal.Root asChild>
    <div className="custom-portal-wrapper">
      Portal content
    </div>
  </Portal.Root>
);
```

## Composition Patterns

### Used Within Other Primitives
Portal is commonly used as a foundational utility within other Radix UI primitives:
- Dialog components (render overlay/content outside parent DOM)
- Dropdown menus (escape overflow: hidden containers)
- Tooltips (position relative to viewport, not parent)
- Popovers (avoid z-index stacking issues)

### Composition API
The `asChild` prop enables advanced composition by merging Portal.Root's behavior with a custom element:
```jsx
<Portal.Root asChild>
  <CustomComponent>Content</CustomComponent>
</Portal.Root>
```

## Styling Approaches

### No Built-in Styling
Portal is a utility component focused purely on DOM positioning, not visual styling. It:
- Does not apply any CSS classes
- Does not provide styling props
- Creates a `<div>` wrapper by default (or merges with child via `asChild`)
- Styling responsibility lies with the portaled content

### Integration with Styling Systems
```jsx
// Styled component approach
<Portal.Root>
  <StyledContent>...</StyledContent>
</Portal.Root>

// CSS modules approach
<Portal.Root>
  <div className={styles.portalContent}>...</div>
</Portal.Root>

// Inline styles approach
<Portal.Root>
  <div style={{ position: 'fixed', top: 0, left: 0 }}>...</div>
</Portal.Root>
```

## Accessibility Patterns

### Focus Management
Portal does not manage focus automatically. When used for modals or dialogs:
- Implement focus trap in portaled content
- Restore focus when portal unmounts
- Consider ARIA attributes on portaled content

### Screen Reader Considerations
- Portal content is still part of React tree (accessibility tree preserved)
- DOM position change does not affect semantic structure
- Ensure proper ARIA labeling for portaled UI elements

### Best Practices
```jsx
// Example: Accessible modal with Portal
<Portal.Root>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <h2 id="modal-title">Modal Title</h2>
    {/* Modal content */}
  </div>
</Portal.Root>
```

## Notable Features

### Lightweight Implementation
At 1.72 kB gzipped, Portal is an extremely lightweight utility that provides essential DOM manipulation without bloat.

### React Tree Preservation
Critical distinction: Portal changes the **DOM** position but preserves the **React component tree** position. This means:
- Context providers work normally
- Event bubbling follows React tree, not DOM tree
- Component lifecycle behaves as if Portal doesn't exist

### Framework Integration
Portal integrates seamlessly with:
- Other Radix primitives (Dialog, Dropdown, Tooltip, etc.)
- Custom React components via `asChild`
- Any styling solution (CSS-in-JS, CSS Modules, Tailwind, etc.)

### Default Behavior
Sensible defaults make simple use cases trivial:
```jsx
// This alone renders content to document.body
<Portal.Root>Content</Portal.Root>
```

### Container Flexibility
The `container` prop enables advanced use cases:
- Render to specific DOM nodes
- Create portal boundaries within app sections
- Isolate portaled content from global styles

## Use Cases Documented

1. **Modal Dialogs**: Escape parent overflow/z-index constraints
2. **Dropdown Menus**: Render outside scrollable containers
3. **Tooltips**: Position relative to viewport instead of parent
4. **Popovers**: Avoid stacking context issues
5. **Overlays**: Create global UI layers

## Research Notes

### Documentation Structure
Documentation follows Radix UI's standard utility pattern:
- Clear "utilities" categorization (not a component)
- Minimal API surface (2 props only)
- Focus on composition patterns
- Integration examples with other primitives implied but not explicit

### Framework Philosophy
Portal exemplifies Radix's approach:
- Low-level, composable primitives
- Minimal opinions about styling
- Maximum flexibility for integration
- Focus on DOM/React behavior, not visual design

### Comparison to React's createPortal
This is a thin wrapper around React's `ReactDOM.createPortal` with:
- Consistent API with other Radix primitives
- `asChild` composition pattern support
- Simplified prop interface
- TypeScript definitions included

### Version Stability
Version 1.1.9 suggests a mature, stable API unlikely to have breaking changes.

### Bundle Size Context
At 1.72 kB, this is one of the smallest Radix utilities, making it suitable for any project size.
