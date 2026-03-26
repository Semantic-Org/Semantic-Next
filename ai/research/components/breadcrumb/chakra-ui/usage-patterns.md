# Chakra UI - Breadcrumb Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/breadcrumb
Status: ✅ Working
Version: v3.28.1 (latest), v2 also documented
Last Verified: 2025-11-05

## Documentation Quality
Good - Comprehensive documentation with clear examples across v2 and v3 versions. V2 has more explicit prop documentation, while v3 introduces a compositional architecture with new patterns.

## Component Definition
- **Core purpose**: Displays a page's location within a site's hierarchical structure, providing navigational context and allowing users to move backwards through the hierarchy.
- **Mental model**: A horizontal sequence of links representing the path from the site root to the current page, with visual separators between each level.
- **Semantic meaning**: Communicates location awareness and hierarchical navigation structure, helping users understand where they are in the information architecture.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `separator="/"`, `isCurrentPage`)
- **Composed**: Via composition/children (e.g., `<BreadcrumbItem>`, `Breadcrumb.Link`)
- **CSS-only**: Requires custom styling (e.g., `fontWeight`, `fontSize` via Box props)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text links | ✅ | Native | BreadcrumbLink (v2) / Breadcrumb.Link (v3) with href prop |
| Icon support | ✅ | Composed | Icons can be placed within BreadcrumbLink or used as separators |
| Dropdown menus | ✅ | Composed | V3: Menu integration with asChild prop; V2: Manual composition |
| Custom separators | ✅ | Native | `separator` prop accepts string or ReactElement (v2), Breadcrumb.Separator component (v3) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple breadcrumb | ✅ | Native | Basic sequential navigation with links |
| With dropdown | ✅ | Composed | V3: BreadcrumbMenuItem pattern with Menu.Trigger asChild |
| Icon breadcrumb | ✅ | Composed | Icons as separators or within links |
| With ellipsis | ✅ | Native | V3: Breadcrumb.Ellipsis component for collapsed items |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Current page | ✅ | Native | V2: `isCurrentPage` prop; V3: Breadcrumb.CurrentLink component |
| Disabled items | ⚠️ | CSS-only | Not explicitly documented, can style via Box props |
| Clickable/non-clickable | ✅ | Native | Current page renders as span with aria-current="page" |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Separator styles | ✅ | Native | String ("-", ">", "/") or icon components (ChevronRightIcon) |
| Size options | ✅ | Native | V3: size prop; V2: fontSize and spacing props via Box inheritance |
| Responsive behavior | ✅ | Native | V2: ResponsiveValue support for spacing; V3: Built-in responsive patterns |
| Spacing control | ✅ | Native | V2: `spacing` prop (default: 0.5rem); V3: `separatorGap` prop |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click navigation | ✅ | Native | Standard href on BreadcrumbLink |
| Router integration | ✅ | Native | V2: `as` prop for router Link components; V3: `asChild` pattern |
| Programmatic nav | ✅ | Composed | Through router integration with as/asChild props |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| aria-label | ✅ | Native | Rendered in semantic <nav> with aria-label="breadcrumb" |
| aria-current | ✅ | Native | aria-current="page" on current page item |
| Keyboard navigation | ✅ | Native | Standard focus navigation through links |
| Separator role | ✅ | Native | role="presentation" on separators for screen readers |

## Code Examples

### Basic Usage (v3)
```jsx
import { Breadcrumb } from "@chakra-ui/react"

const Demo = () => {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>Props</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}
```

### Basic Usage with Current Page (v2)
```jsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'

<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink href='#'>Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href='#'>Docs</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem isCurrentPage>
    <BreadcrumbLink href='#'>Breadcrumb</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
```

### Custom String Separator (v2)
```jsx
<Breadcrumb separator='-'>
  <BreadcrumbItem>
    <BreadcrumbLink href='#'>Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href='#'>About</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem isCurrentPage>
    <BreadcrumbLink href='#'>Contact</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
```

### Custom Icon Separator (v2)
```jsx
import { ChevronRightIcon } from '@chakra-ui/icons'

<Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
  <BreadcrumbItem>
    <BreadcrumbLink href='#'>Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href='#'>About</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem isCurrentPage>
    <BreadcrumbLink href='#'>Contact</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
```

### With Ellipsis (v3)
```jsx
import { Breadcrumb } from "@chakra-ui/react"

const Demo = () => {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Ellipsis />
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>Props</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}
```

### Router Integration (v2)
```jsx
import { Link } from "@reach/router"

<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink as={Link} to='#'>
      Home
    </BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink as={Link} to='#'>
      About
    </BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem isCurrentPage>
    <BreadcrumbLink>Contact</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
```

### With Menu Dropdown (v3)
```jsx
import { Breadcrumb, Menu, Portal } from "@chakra-ui/react"
import { LuChevronDown } from "react-icons/lu"

const BreadcrumbMenuItem = (props) => {
  const { children, items } = props
  return (
    <Breadcrumb.Item>
      <Menu.Root>
        <Menu.Trigger asChild>{children}</Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {items.map((item) => (
                <Menu.Item key={item.value} value={item.value}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Breadcrumb.Item>
  )
}
```

### Styling with Box Props (v2)
```jsx
<Breadcrumb fontWeight='medium' fontSize='sm'>
  <BreadcrumbItem>
    <BreadcrumbLink href='#'>Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href='#'>About</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem isCurrentPage>
    <BreadcrumbLink href='#'>Current</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
```

[View Live Examples](https://www.chakra-ui.com/docs/components/breadcrumb)

## Component Props

### V2 Props

**Breadcrumb Props:**
- `separator`: string | ReactElement (default: `/`) - Custom separator element
- `spacing`: ResponsiveValue (default: `0.5rem`) - Space between items
- `listProps`: HTMLChakraProps<"ol"> - Props for the ordered list element
- Inherits all Box component props (fontWeight, fontSize, etc.)

**BreadcrumbItem Props:**
- `isCurrentPage`: boolean (default: false) - Marks item as current page
- `isLastChild`: boolean (default: false) - Indicates last child
- `separator`: string | ReactElement - Override parent separator
- `spacing`: ResponsiveValue - Override parent spacing

**BreadcrumbLink Props:**
- `isCurrentPage`: boolean (default: false) - Marks link as current page
- `as`: React.ElementType - Replace underlying element (for router integration)
- Extends Link component with full styling support

**BreadcrumbSeparator Props:**
- Extends Box component with full style support

### V3 Architecture

**Compositional Pattern:**
- `Breadcrumb.Root` - Container component
- `Breadcrumb.List` - List wrapper
- `Breadcrumb.Item` - Individual breadcrumb item
- `Breadcrumb.Link` - Navigation link
- `Breadcrumb.CurrentLink` - Current page indicator
- `Breadcrumb.Separator` - Separator component
- `Breadcrumb.Ellipsis` - Ellipsis indicator for collapsed items

**Key V3 Props:**
- `size`: Controls size of breadcrumb components
- `separatorGap`: Gap between items (replaces spacing)
- `asChild`: Polymorphic prop for custom component composition

## Notable Features

### Version Differences
- **V2**: Props-based API with `isCurrentPage` flag, `as` prop for router integration, inherits Box props
- **V3**: Compositional architecture with dedicated components (Root, List, Item, etc.), `asChild` pattern inspired by Radix/Ark UI, Ellipsis component

### Unique Patterns
1. **Automatic ARIA handling**: Converts current page to span with aria-current="page"
2. **Flexible separator customization**: String, icon, or custom component
3. **Menu integration**: V3 asChild pattern enables seamless dropdown menus
4. **Box inheritance**: V2 breadcrumb inherits all Box styling props
5. **Semantic HTML**: Renders in <nav> landmark with proper ARIA labels
6. **Separator role**: Automatically sets role="presentation" on separators

### Implementation Details
- Renders breadcrumb items in an ordered list (<ol>) for semantic correctness
- Current page link converts from anchor to span element
- Separator role hidden from screen readers but visible to sighted users
- Supports responsive spacing through ResponsiveValue types (v2)
- Portal-based menu positioning prevents overflow issues (v3)

## Research Notes

### Documentation Access
- V3 documentation focuses on compositional patterns with interactive examples
- V2 documentation provides more explicit prop tables and detailed API reference
- Both versions maintain backward compatibility patterns for smooth migration

### Framework Evolution
- V3 adopts compositional "dot notation" API (Breadcrumb.Root, Breadcrumb.Link) similar to Radix UI
- `asChild` pattern replaces `as` prop for better TypeScript support and composition
- Ellipsis component added in v3 for handling collapsed breadcrumb scenarios
- Menu integration improved with Portal and asChild patterns

### Observations
- Strong focus on accessibility with automatic ARIA attribute management
- Flexible architecture supports both simple and complex navigation scenarios
- Router integration well-documented across different routing libraries
- Separator customization is first-class with both string and component support
- V2 to V3 migration path is clear with equivalent patterns for most features
