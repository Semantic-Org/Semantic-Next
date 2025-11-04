# Chakra UI - Divider Usage Patterns

## Component URL
https://v2.chakra-ui.com/docs/components/divider
Status: ✅ Working (v2 docs) | ❌ 404 (main site - appears to have moved or is in transition)

**Note**: The main chakra-ui.com URL returns 404, but the v2.chakra-ui.com documentation is accessible and comprehensive.

## Documentation Quality
**Good** - Clear, concise documentation with practical examples. Well-structured with props table, usage examples, and theming information. Examples demonstrate both basic and compositional patterns.

## Component Definition
- **Core purpose**: Provides visual separation between content sections using a thin horizontal or vertical line
- **Mental model**: A semantic divider that renders an `<hr>` element, functioning as a layout primitive for content organization
- **Semantic meaning**: Communicates visual and logical separation between groups of content in lists, sections, or layouts

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Supports text overlay using `AbsoluteCenter` composition pattern: wrapping divider and content in relative positioned container |
| Icon support | ⚠️ | Not explicitly documented, but can be achieved using same composition pattern as text content |
| Media support | ⚠️ | Not explicitly documented, but composition pattern suggests any content could be centered over divider |
| Custom content | ✅ | Via `AbsoluteCenter` composition - place any content over the divider line |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Horizontal | ✅ | Default orientation, renders as full-width horizontal line |
| Vertical | ✅ | Requires explicit `orientation='vertical'` prop and parent container with defined height |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ❌ | No loading state documented |
| Disabled | ❌ | No disabled state documented |
| Interactive | ❌ | Not an interactive component - purely presentational |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Customizable via `size` prop (theme-based, specific values not documented in basic docs) |
| Spacing control | ⚠️ | Not directly on component - spacing handled by parent layout components |
| Visual styles | ✅ | Two variants: `solid` (default) and `dashed` |
| Color options | ✅ | Extensive color scheme support: `whiteAlpha`, `blackAlpha`, `gray`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `pink` |
| Alignment | ⚠️ | Alignment achieved through parent layout components, not divider props |

## Code Examples

### Basic Usage
```jsx
import { Divider } from '@chakra-ui/react'

// Default horizontal divider
<Divider />
```

### Horizontal Orientation (Explicit)
```jsx
<Divider orientation='horizontal' />
```

### Vertical Orientation
```jsx
import { Center, Divider } from '@chakra-ui/react'

// Note: Requires parent with defined height
<Center height='50px'>
  <Divider orientation='vertical' />
</Center>
```

### Composition with Stack
```jsx
import { Stack, Divider, Text } from '@chakra-ui/react'

<Stack direction='row' h='100px' p={4}>
  <Divider orientation='vertical' />
  <Text>Chakra UI</Text>
</Stack>
```

### Divider with Content Overlay
```jsx
import { Box, Divider, AbsoluteCenter } from '@chakra-ui/react'

<Box position='relative' padding='10'>
  <Divider />
  <AbsoluteCenter bg='white' px='4'>
    Content
  </AbsoluteCenter>
</Box>
```

### Styled Variants
```jsx
// Solid (default)
<Divider variant='solid' />

// Dashed
<Divider variant='dashed' />

// With color scheme
<Divider colorScheme='red' />
<Divider colorScheme='blue' />
```

### Theming Example (Component Customization)
```jsx
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  components: {
    Divider: {
      // Custom sizes
      sizes: {
        thick: {
          borderWidth: '4px',
        }
      },
      // Custom variants
      variants: {
        branded: {
          borderColor: 'brand.500',
          borderWidth: '2px',
        }
      },
      // Default props
      defaultProps: {
        size: 'md',
        variant: 'solid',
      }
    }
  }
})
```

## Component Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorScheme` | `"whiteAlpha" \| "blackAlpha" \| "gray" \| "red" \| "orange" \| "yellow" \| "green" \| "teal" \| "blue" \| "cyan" \| "purple" \| "pink"` | — | Controls the color appearance of the divider |
| `size` | `string` | — | Controls the thickness/dimensions of the divider (theme-based) |
| `variant` | `"solid" \| "dashed"` | `"solid"` | Visual style of the divider border |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction of the divider line |

## Notable Features

### 1. Composition over Configuration
Chakra UI uses a composition pattern rather than built-in content props. Instead of `content="text"` prop, you compose with `AbsoluteCenter`:

```jsx
<Box position='relative' padding='10'>
  <Divider />
  <AbsoluteCenter bg='white' px='4'>Content</AbsoluteCenter>
</Box>
```

### 2. Vertical Divider Requirements
Vertical dividers require explicit parent height - they don't self-size based on siblings. This is a CSS constraint of `hr` elements.

### 3. Theme-First Design
Heavy emphasis on theme customization. The component is designed to be styled primarily through theme configuration rather than inline props.

### 4. Single-Part Component
The divider is a single-part component (not composite), so all styles apply to one root element (`chakra.hr`). This simplifies theming and reduces complexity.

### 5. Dark Mode Support
Built-in dark mode support through Chakra's color mode system. Color schemes automatically adapt to dark mode.

### 6. Package Organization
Part of `@chakra-ui/layout` package, indicating its role as a layout primitive rather than an interactive component.

## Implementation Details Worth Noting

### Semantic HTML
Renders as `<hr>` element, maintaining semantic meaning for accessibility and SEO.

### CSS-Based Styling
Uses CSS borders rather than background colors or pseudo-elements, which means:
- Clean, performant rendering
- Respects border-style variants naturally
- Easy to customize thickness via border-width

### Composition Pattern Benefits
- Flexible content placement (not limited to text)
- Maintains separation of concerns
- Allows any complex content structure over divider
- Reduces component API surface area

## Research Notes

### Documentation Access
- **Main site** (chakra-ui.com): Returns 404 errors on component pages
- **v2 site** (v2.chakra-ui.com): Fully functional and comprehensive
- **Observation**: Chakra UI may be in transition to v3 or restructuring their documentation

### Framework Approach
Chakra UI takes a composition-heavy approach where:
- Individual components are minimal and focused
- Complex patterns emerge from composing simple primitives
- Layout and spacing handled by parent components
- Theming system is central to customization

### API Design Philosophy
- Props are minimal and semantic
- Style variants controlled through theme
- Orientation is explicit (not inferred from context)
- No built-in spacing - delegated to layout system

### Differences from Other Frameworks
1. **No built-in content prop** - uses composition instead
2. **Theme-first customization** - less inline style props
3. **Single-part simplicity** - not broken into sub-components
4. **Explicit height requirement** for vertical orientation

## Patterns to Consider for Semantic UI

### Strengths to Adopt
1. **Composition pattern** for content overlay (flexible and powerful)
2. **Clear orientation API** (explicit prop rather than inferred)
3. **Variant system** for visual styles (solid, dashed)
4. **Color scheme pattern** (standardized color options)

### Potential Improvements
1. **Spacing integration** - could provide spacing props for convenience
2. **Auto-sizing vertical dividers** - detect sibling heights
3. **Built-in content support** - option for simple text/icon without composition
4. **Alignment options** - left/center/right for content without manual positioning

### Questions for Semantic UI Design
1. Should we support both composition and built-in content patterns?
2. How should vertical dividers handle height (explicit vs. auto)?
3. Should spacing be component-level or system-level?
4. What variants should we support (solid, dashed, dotted, gradient)?
5. Should we provide text/icon-specific APIs or rely on composition?
