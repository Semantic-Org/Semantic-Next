# Mantine - Portal Usage Patterns

## Component URL
https://mantine.dev/core/portal/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with clear explanations, multiple code examples, and well-organized content covering all major use cases.

## Component Definition
- **Core purpose**: Renders component outside of parent element tree to prevent parent styles (especially `position` and `z-index`) from interfering with children. This is a fundamental pattern for overlay components like modals, tooltips, and popovers that need to escape local stacking contexts.
- **Mental model**: A "teleporter" that moves content from its logical position in the React tree to a different physical location in the DOM tree, while maintaining React's context and event handling. Think of it as a wormhole between the component tree and a different DOM location.
- **Semantic meaning**: Represents a boundary escape mechanism - when content needs to visually exist outside its container's constraints (z-index, overflow, position) while remaining logically connected to its source component.

## Pattern Support Levels
- **Native**: Portal behavior via props (target specification, target reuse)
- **Composed**: Children-based content rendering (standard composition pattern)
- **CSS-only**: Not applicable - this is a DOM structure pattern, not a visual pattern

## Core Functionality Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Portal rendering | ✅ | Native | Renders children outside parent tree using ReactDOM.createPortal |
| Target specification | ✅ | Native | `target` prop accepts DOM node or selector string |
| Target reuse | ✅ | Native | `reuseTargetNode` prop consolidates multiple portals into single DOM node |
| Optional portal | ✅ | Native | `OptionalPortal` component with `withinPortal` prop for conditional portal behavior |
| Default target | ✅ | Native | Automatically creates and appends to document.body if no target specified |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Children content | ✅ | Composed | Standard React children - any valid React node |
| Complex content | ✅ | Composed | Full component trees can be portaled |
| Multiple portals | ✅ | Native | Multiple Portal instances can coexist, optionally sharing target nodes |

## Configuration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| DOM target selection | ✅ | Native | Via `target` prop - accepts `HTMLElement` or string selector |
| Target node reuse | ✅ | Native | `reuseTargetNode` boolean prop for shared portal containers |
| Conditional portaling | ✅ | Native | `OptionalPortal` component with `withinPortal` boolean prop |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Conditional rendering | ✅ | Composed | Standard React conditional rendering (shown/hidden via parent logic) |
| SSR compatibility | ⚠️ | Native | Explicitly does NOT support server-side rendering - content renders only after client mount |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Modal integration | ✅ | Native | Modal component wrapped in Portal by default |
| Drawer integration | ✅ | Native | Drawer component wrapped in Portal by default |
| Related components | ✅ | Native | Works with Popover, Tooltip, HoverCard, Menu |

## Props/API Documentation

### Portal Component Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `target` | `HTMLElement \| string` | Creates new div appended to document.body | Specifies where portal renders - DOM node or selector string |
| `reuseTargetNode` | `boolean` | `false` | Reuse same target node across multiple Portal instances |
| `children` | `React.ReactNode` | - | Content to render in portal |

### OptionalPortal Component Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `withinPortal` | `boolean` | - | When true, renders in Portal; when false, renders as regular child |
| `children` | `React.ReactNode` | - | Content to conditionally portal |

## Code Examples

### Basic Portal Usage
```jsx
import { useState } from 'react';
import { Portal } from '@mantine/core';

function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      {opened && (
        <Portal>
          <div>Your modal content</div>
        </Portal>
      )}

      <button onClick={() => setOpened(true)} type="button">
        Open modal
      </button>
    </main>
  );
}
```

### Reuse Target Node
Multiple portals sharing a single container:
```jsx
import { Portal } from '@mantine/core';

function Demo() {
  return (
    <>
      <Portal reuseTargetNode>
        <p>First</p>
      </Portal>

      <Portal reuseTargetNode>
        <p>Second</p>
      </Portal>

      <Portal reuseTargetNode>
        <p>Third</p>
      </Portal>
    </>
  );
}
```

### Specify Target via Direct Reference
```jsx
import { Portal } from '@mantine/core';

const container = document.createElement('div');
document.body.appendChild(container);

function Demo() {
  return <Portal target={container}>My portal</Portal>;
}
```

### Specify Target via Selector
```jsx
import { Portal } from '@mantine/core';

function Demo() {
  return <Portal target="#portal-container">My portal</Portal>;
}
```

### OptionalPortal - Conditional Portal Behavior
```jsx
import { OptionalPortal } from '@mantine/core';

function Demo() {
  return (
    <>
      <OptionalPortal withinPortal>
        This text is rendered in Portal
      </OptionalPortal>
      <OptionalPortal withinPortal={false}>
        This text is rendered as regular child
      </OptionalPortal>
    </>
  );
}
```

## Variants and Composition Patterns

### Variant: Standard Portal
Default behavior - creates new target node appended to document.body per instance.

### Variant: Shared Target Portal
Using `reuseTargetNode={true}` - multiple portals consolidated into single DOM node.

### Variant: Custom Target Portal
Using `target` prop - portal renders to specified existing DOM element.

### Variant: Optional Portal
Using `OptionalPortal` component - conditional portal behavior based on `withinPortal` prop.

### Composition Pattern: Overlay Components
Portal serves as foundation for overlay components (Modal, Drawer) that need to escape stacking contexts.

### Composition Pattern: Nested Portals
Portals can be nested within each other, each with its own target specification.

## Styling Approaches

### No Direct Styling
Portal itself has no visual styling - it's purely a DOM structure pattern. Styling is applied to the children being portaled.

### Style Escape Pattern
The entire purpose is to escape parent styling constraints (position, z-index, overflow), so portaled content can apply its own styling independently.

### Integration Styling
Components using Portal (Modal, Drawer) apply their own styling to the portaled content.

## Accessibility Patterns

### No Explicit Accessibility Features
Documentation does not mention specific accessibility props or ARIA attributes on the Portal component itself.

### Accessibility via Children
Accessibility is managed by the components being portaled (e.g., Modal has its own accessibility features).

### Focus Management
Not handled by Portal - must be implemented in components using Portal (handled by Modal/Drawer components that wrap Portal).

## Notable Features

### 1. ReactDOM.createPortal Wrapper
Mantine's Portal is a thin wrapper around React's built-in createPortal API, providing convenient prop-based configuration.

### 2. Automatic Target Creation
If no target is specified, Portal automatically creates a div and appends it to document.body, simplifying common use cases.

### 3. Target Node Reuse
The `reuseTargetNode` prop is a performance optimization that prevents creating multiple portal containers in the DOM.

### 4. Selector String Support
Target specification accepts CSS selector strings, not just DOM node references, making it easier to integrate with existing markup.

### 5. OptionalPortal Component
Separate component for conditional portal behavior provides clean API for components that sometimes need portal behavior and sometimes don't.

### 6. Default Integration
Modal and Drawer components are wrapped in Portal by default, demonstrating the framework's opinion on proper overlay implementation.

### 7. SSR Limitation Documentation
Explicitly documents that createPortal is not supported during server-side rendering - content only renders after client-side mounting.

## Research Notes

### Access & Quality
- Documentation is clear, well-organized, and comprehensive
- All examples are functional and well-explained
- Version information clearly displayed (v8.3.6)
- Good coverage of common use cases and edge cases

### Framework Philosophy
- Mantine treats Portal as a foundational utility component
- Strong integration with overlay components (Modal, Drawer)
- Provides both basic (Portal) and conditional (OptionalPortal) variants
- Clear about limitations (SSR) rather than hiding them

### Technical Observations
- Clean React-first API design
- Props follow standard React patterns (boolean flags, node/selector unions)
- Performance-conscious (target node reuse pattern)
- Good separation of concerns (OptionalPortal as separate component)

### Comparison Points
- More explicit than raw ReactDOM.createPortal
- Less opinionated than some frameworks' portal implementations
- Good balance of simplicity and flexibility
- Target reuse pattern is somewhat unique
