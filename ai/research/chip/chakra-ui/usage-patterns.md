# Chakra UI - Tag/Chip Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/tag
Status: ✅ Working
Version: v3.28.1 (current version); v2 documentation also analyzed
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - Chakra UI provides excellent documentation with clear examples, migration guides, and API references. Both v2 and v3 documentation are available, showing the evolution of the component architecture.

## Component Definition
- **Core purpose**: Used for categorizing or labeling content. Tags are compact UI elements that represent attributes, categories, or metadata.
- **Mental model**: Visual labels that can optionally include icons, avatars, and close/remove functionality. Think of them as "category badges" or "filter chips" that help organize and identify content.
- **Semantic meaning**: Represents categorical information, status indicators, or removable selections in a compact, scannable format.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `colorPalette="blue"`, `size="md"`)
- **Composed**: Via composition/children (e.g., `<Tag.Root><Tag.Label>...</Tag.Label></Tag.Root>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}` or style props like `borderRadius="full"`)

## Component Architecture

### v2 (Legacy)
```jsx
import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
} from '@chakra-ui/react'

<Tag>
  <TagLeftIcon as={AddIcon} />
  <TagLabel>Label</TagLabel>
  <TagCloseButton />
</Tag>
```

### v3 (Current)
```jsx
import { Tag } from '@chakra-ui/react'

<Tag.Root>
  <Tag.StartElement><Icon /></Tag.StartElement>
  <Tag.Label>Label</Tag.Label>
  <Tag.EndElement>
    <Tag.CloseTrigger />
  </Tag.EndElement>
</Tag.Root>
```

**Architectural Change**: v3 adopts a compound component pattern with dot notation (Tag.Root, Tag.Label, etc.) for better composition and clarity.

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | `<Tag.Label>Text</Tag.Label>` (v3) or `<TagLabel>Text</TagLabel>` (v2) |
| Icons | ✅ | Composed | `<Tag.StartElement>` and `<Tag.EndElement>` (v3) or `<TagLeftIcon>` and `<TagRightIcon>` (v2) |
| Avatars/Images | ✅ | Composed | Works with Avatar component, set avatar size to `full` for proper sizing |
| Close/Remove button | ✅ | Composed | `<Tag.CloseTrigger />` (v3) or `<TagCloseButton />` (v2) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selectable/Active | ❌ | CSS-only | No native selection state; can be implemented with custom styling |
| Disabled | ⚠️ | Native (likely) | Standard HTML disabled attribute should work, though not explicitly documented |
| Loading | ❌ | CSS-only | No native loading state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | `colorScheme` (v2) or `colorPalette` (v3): "gray", "red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink", "whiteAlpha", "blackAlpha" |
| Size options | ✅ | Native | `size="sm"`, `size="md"` (default), `size="lg"` |
| Visual variants | ✅ | Native | `variant="subtle"` (default), `variant="solid"`, `variant="outline"` |
| Bordered/Borderless | ✅ | Native | Controlled via `variant` prop (outline has border, subtle/solid do not) |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ✅ | Native | `asChild` prop renders tag as clickable button (v3) |
| Closable/Removable | ✅ | Composed | Add `<Tag.CloseTrigger />` component |
| onClick handler | ✅ | Native | Standard React `onClick` prop |
| onClose handler | ✅ | Composed | Pass to `<Tag.CloseTrigger onClick={handleClose} />` |

## Code Examples

### Basic Usage (v3)
```jsx
import { Tag } from '@chakra-ui/react'

<Tag.Root>
  <Tag.Label>Sample Tag</Tag.Label>
</Tag.Root>
```

### Size Variants (v3)
```jsx
import { HStack } from '@chakra-ui/react'

<HStack spacing={4}>
  {['sm', 'md', 'lg'].map((size) => (
    <Tag.Root size={size} key={size} variant="solid" colorPalette="teal">
      <Tag.Label>Teal</Tag.Label>
    </Tag.Root>
  ))}
</HStack>
```

### With Icons (v2 examples, translatable to v3)
```jsx
// With left icon (v2)
<Tag size="md" variant="subtle" colorScheme="cyan">
  <TagLeftIcon boxSize="12px" as={AddIcon} />
  <TagLabel>Cyan</TagLabel>
</Tag>

// With right icon (v2)
<Tag size="md" variant="outline" colorScheme="blue">
  <TagLabel>Blue</TagLabel>
  <TagRightIcon as={MdSettings} />
</Tag>
```

### With Close Button (v2 example)
```jsx
{['sm', 'md', 'lg'].map((size) => (
  <Tag
    size={size}
    key={size}
    borderRadius="full"
    variant="solid"
    colorScheme="green"
  >
    <TagLabel>Green</TagLabel>
    <TagCloseButton />
  </Tag>
))}
```

### With Avatar (v2 example)
```jsx
<Tag size="lg" colorScheme="red" borderRadius="full">
  <Avatar
    src="https://bit.ly/sage-adebayo"
    size="xs"
    name="Segun Adebayo"
    ml={-1}
    mr={2}
  />
  <TagLabel>Segun</TagLabel>
</Tag>
```

### Closable Pattern with Composition (v3)
```jsx
import { Tag } from "@chakra-ui/react"
import * as React from "react"

export interface TagProps extends Tag.RootProps {
  startElement?: React.ReactNode
  endElement?: React.ReactNode
  onClose?: VoidFunction
  closable?: boolean
}

export const CustomTag = React.forwardRef<HTMLSpanElement, TagProps>(
  function Tag(props, ref) {
    const {
      startElement,
      endElement,
      onClose,
      closable = !!onClose,
      children,
      ...rest
    } = props

    return (
      <Tag.Root ref={ref} {...rest}>
        {startElement && (
          <Tag.StartElement>{startElement}</Tag.StartElement>
        )}
        <Tag.Label>{children}</Tag.Label>
        {endElement && (
          <Tag.EndElement>{endElement}</Tag.EndElement>
        )}
        {closable && (
          <Tag.EndElement>
            <Tag.CloseTrigger onClick={onClose} />
          </Tag.EndElement>
        )}
      </Tag.Root>
    )
  },
)
```

## Notable Features

### Compound Component Pattern (v3)
- **Composability**: v3 uses dot notation (`Tag.Root`, `Tag.Label`, etc.) for clear component hierarchy
- **Flexibility**: Each subcomponent can be used independently for maximum customization
- **Type Safety**: Better TypeScript support with explicit component parts

### Rich Color System
- Supports 12+ color schemes out of the box
- Includes alpha variants (whiteAlpha, blackAlpha) for transparency effects
- Seamless dark mode integration

### Avatar Integration
- Designed to work seamlessly with Chakra's Avatar component
- Set avatar `size="xs"` with negative margins for perfect visual alignment
- Common pattern for user tags or team member indicators

### Visual Variants
- **Subtle** (default): Light background with muted appearance
- **Solid**: Full background color for high visibility
- **Outline**: Border-only style for minimal visual weight

### Truncation Support
- Built-in text truncation with `-webkit-line-clamp:1`
- `maxWidth` prop for controlling tag width with ellipsis overflow
- Single-line display by default

### Accessibility
- Uses semantic HTML with proper ARIA attributes
- Focus states with outline ring (2px offset)
- Keyboard accessible close button

### Migration Path
- Clear migration guide from v2 to v3
- Both versions well-documented
- Gradual adoption possible

## Research Notes

### Documentation Access
- ✅ v3 documentation accessible at chakra-ui.com/docs/components/tag
- ✅ v2 documentation accessible at v2.chakra-ui.com/docs/components/tag
- ✅ Migration guide available
- ⚠️ Some interactive examples require viewing the live site (not fully extractable via web scraping)

### Framework Observations

**Strengths:**
1. **Excellent DX**: Clear, composable API with great TypeScript support
2. **Comprehensive**: Covers all common tag/chip use cases
3. **Flexible**: Easy to customize while maintaining consistency
4. **Well-documented**: Both current and legacy versions documented
5. **Accessible**: Built-in accessibility features

**Unique Approaches:**
1. **Compound Pattern**: v3's dot notation is more explicit than many frameworks
2. **Color System**: Rich built-in color palette with alpha variants
3. **Avatar Integration**: First-class support for avatar composition
4. **asChild Pattern**: Render as button for clickable tags (v3)

**Missing Features:**
1. No native selection/toggle state (like Mantine's Chip)
2. No loading state
3. No explicit disabled state documentation (though likely supported)

### Semantic Distinction
Chakra UI calls this component "Tag" rather than "Chip" or "Badge". In their ecosystem:
- **Tag**: Categorical labels (this component)
- **Badge**: Small status indicators (separate component)

This aligns with Ant Design and PrimeReact naming conventions but differs from MUI and Mantine which use "Chip".

### Version Evolution
The migration from v2 to v3 shows a clear evolution toward:
- More explicit composition (compound components)
- Better TypeScript integration
- Clearer prop naming (`colorPalette` vs `colorScheme`)
- More flexible architecture

This represents best practices in modern React component design and shows the maturity of the Chakra UI ecosystem.
