# Chakra UI - Portal Usage Patterns

## Component URL
https://chakra-ui.com/docs/components/portal
Status: ✅ Working
Version: Chakra UI v3.28.1
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear explanations with practical examples, comprehensive prop documentation, and SSR considerations

## Component Definition
- **Core purpose**: Render content outside the standard DOM hierarchy using ReactDOM.createPortal API, enabling elements to break out of parent overflow constraints and stacking contexts
- **Mental model**: A "wormhole" in the DOM that transports elements to a different location (typically document.body) while maintaining React component relationships
- **Semantic meaning**: Indicates content that needs to overlay or escape container boundaries (modals, tooltips, popovers) without affecting document flow

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `container={ref}`, `disabled={true}`)
- **Composed**: Via composition/children (e.g., `<Portal>{content}</Portal>`)
- **CSS-only**: Not applicable - Portal is functionality-focused

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Any React content | ✅ | Composed | Accepts any React children through standard composition |
| Text content | ✅ | Composed | Any text can be portaled |
| Component nesting | ✅ | Composed | Full React component trees supported |
| Custom elements | ✅ | Composed | Any valid React element |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default portal | ✅ | Native | Renders to document.body by default |
| Custom container | ✅ | Native | `container` prop accepts RefObject to specify target |
| Inline rendering | ✅ | Native | `disabled` prop renders content in place |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled state | ✅ | Native | `disabled={true}` renders content inline instead of portaling |
| SSR mode | ✅ | Native | Automatically renders inline during server-side rendering |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Element type | ✅ | Native | `as` prop allows customizing container element type |
| Target container | ✅ | Native | `container` prop for custom portal destination |
| Conditional portaling | ✅ | Native | `disabled` prop toggles portal behavior |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Automatic body portal | ✅ | Native | Default behavior portals to document.body |
| Client-side only | ✅ | Recommended | Docs suggest conditional rendering for client-only to avoid hydration issues |
| Focus management | ✅ | Developer responsibility | Portal maintains React relationships but focus requires manual management |
| Event bubbling | ✅ | React behavior | Events bubble through React tree, not DOM tree |

## Props/API Documentation

### Core Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | ElementType | undefined | Specifies the element type for the portal container |
| `disabled` | boolean | false | When true, renders content inline instead of portaling |
| `container` | RefObject<Element> | document.body | Custom container element reference for portal rendering |
| `children` | ReactNode | - | Content to be portaled |

## Code Examples

### Basic Portal Usage
```jsx
import { Portal } from "@chakra-ui/react"

<Portal>
  <div>Portal content</div>
</Portal>
```
Default behavior: renders content at end of document.body

### Custom Container Portal
```jsx
const Demo = () => {
  const containerRef = React.useRef()
  return (
    <>
      <Portal container={containerRef}>
        <div>Portal content</div>
      </Portal>
      <div ref={containerRef} />
    </>
  )
}
```
Portals content to a specific DOM node via ref

### Disabled Portal (Inline Rendering)
```jsx
<Portal disabled>
  <div>Will render the content in place</div>
</Portal>
```
Useful for conditional portaling or maintaining DOM hierarchy in specific contexts

## Composition Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Nested portals | ✅ | Composed | Portals can contain other portals |
| Wrapper usage | ✅ | Composed | Often wraps modal, tooltip, popover components |
| Conditional rendering | ✅ | Composed | Standard React conditional patterns work |

## Styling Approaches
| Approach | Present | Support | Details |
|----------|---------|---------|---------|
| Child styling | ✅ | Composed | Styles applied to children work normally |
| Inherited styles | ⚠️ | CSS behavior | Some inherited styles may not apply across portal boundary |
| Direct element styling | ✅ | Native | `as` prop allows element type selection |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Maintains React tree | ✅ | Native | Context and event bubbling preserved through React tree |
| Focus management | ❌ | Developer responsibility | Developers must handle focus trap and restoration |
| Keyboard navigation | ❌ | Developer responsibility | Requires manual implementation for portaled overlays |
| ARIA relationships | ❌ | Developer responsibility | aria-describedby, aria-labelledby may need manual handling |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Modal/Dialog usage | ✅ | Composed | Portal typically wraps overlay components |
| Tooltip positioning | ✅ | Composed | Common use case for absolute positioning |
| Dropdown menus | ✅ | Composed | Escapes overflow constraints |
| Notification systems | ✅ | Composed | Global notification areas |

## SSR & Hydration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| SSR rendering | ✅ | Native | Renders inline during SSR automatically |
| Hydration safety | ⚠️ | Recommended practice | Docs recommend client-only rendering to avoid mismatches |
| Conditional client render | ✅ | Developer pattern | Suggested approach: `{isMounted && <Portal>...</Portal>}` |

## Notable Features
- **React Portal API wrapper**: Clean abstraction over ReactDOM.createPortal with sensible defaults
- **Automatic SSR handling**: Intelligently renders inline during server-side rendering
- **Flexible targeting**: Can portal to body (default) or any custom container via ref
- **Disable escape hatch**: `disabled` prop allows conditional inline rendering without component changes
- **Element type customization**: `as` prop provides control over container element type
- **Maintains React semantics**: Context, events, and component relationships preserved despite DOM manipulation

## Implementation Considerations
- **Stacking context escape**: Primary use case is breaking out of parent stacking contexts for overlays
- **Overflow container escape**: Allows content to render outside overflow:hidden containers
- **Focus trap complexity**: Requires additional work to implement proper focus management for accessibility
- **CSS inheritance breaks**: Some inherited CSS properties won't apply across portal boundary
- **Testing challenges**: Portal content may be harder to query in tests due to DOM location change

## Research Notes
- Documentation is clear and practical with good examples
- SSR guidance is prominently featured, showing mature consideration of real-world usage
- Props API is minimal and focused - does one thing well
- No accessibility features built-in; expects developers to implement focus management
- Chakra UI likely uses this internally for all overlay components (Modal, Tooltip, Popover, etc.)
- The `disabled` prop is particularly useful for responsive designs where portaling may not be needed at all breakpoints
- Common pattern in React ecosystem - similar implementations in Radix UI, Reach UI, Material-UI

## Framework Context
Chakra UI v3.28.1 is a mature React component library with focus on accessibility and developer experience. The Portal component is a foundational utility that other overlay components build upon. The documentation quality reflects the framework's emphasis on clear, practical guidance.
