# Mantine - Divider Usage Patterns

## Component URL
https://mantine.dev/core/divider/
Status: ✅ Working

## Documentation Quality
Comprehensive - Well-documented with clear examples demonstrating all major features and variations.

## Component Definition
- **Core purpose**: Provides a visual separator between content sections with optional text labels or custom content
- **Mental model**: A flexible horizontal or vertical line that can contain labels/content at different positions
- **Semantic meaning**: Communicates visual and semantic separation between distinct sections of content or UI elements

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Via `label` prop - supports simple text strings |
| Icon support | ✅ | Label can include icon components (e.g., `<IconSearch size={12} />`) combined with text |
| Media support | ❌ | No explicit media support shown in documentation |
| Custom content | ✅ | Label accepts JSX elements - can include any React component or complex composition |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Horizontal | ✅ | Default orientation - spans full width of container |
| Vertical | ✅ | Via `orientation="vertical"` prop - used for inline content separation |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ❌ | No loading state shown |
| Disabled | ❌ | No disabled state shown |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Preset sizes: `xs`, `sm`, `md`, `lg`, `xl` - also accepts custom numeric values (e.g., `size={10}`) |
| Spacing control | ✅ | Via `my` prop for vertical margins (e.g., `my="md"`, `my="xs"`) - integrates with Mantine spacing system |
| Visual styles | ✅ | Three variants: `solid` (default), `dashed`, `dotted` |
| Color options | ❌ | No explicit color prop shown - likely inherits from Mantine theme system |
| Alignment | ✅ | Label positioning via `labelPosition`: `left`, `center`, `right` (horizontal only) |

## Code Examples

**Basic horizontal divider:**
```jsx
<Divider my="md" />
```

**With label at different positions:**
```jsx
<Divider my="xs" label="Label on the left" labelPosition="left" />
<Divider my="xs" label="Label in the center" labelPosition="center" />
<Divider my="xs" label="Label on the right" labelPosition="right" />
```

**Vertical orientation with different sizes:**
```jsx
<Divider orientation="vertical" />
<Divider size="sm" orientation="vertical" />
<Divider size="md" orientation="vertical" />
```

**Complex label with icon and styling:**
```jsx
<Divider
  variant="dashed"
  labelPosition="center"
  label={
    <>
      <IconSearch size={12} />
      <Box ml={5}>Search results</Box>
    </>
  }
/>
```

## Notable Features
- **Rich label content**: Label prop accepts full JSX, enabling complex compositions with icons, styled text, and components
- **Flexible sizing system**: Both preset size scales and custom numeric values supported
- **Dual orientation**: Works in both horizontal (default) and vertical layouts for different use cases
- **Variant system**: Three visual styles (solid, dashed, dotted) for different visual hierarchies
- **Spacing integration**: Built-in margin control via `my` prop that integrates with Mantine's spacing system
- **Label positioning**: Three alignment options for horizontal labels (left, center, right)

## Research Notes
- Documentation is clear and comprehensive with practical examples
- The component API is well-designed with intuitive prop names
- Mantine's approach emphasizes flexibility - labels can contain arbitrary content
- Strong integration with Mantine's design system (spacing, sizing conventions)
- No color customization prop shown, suggesting it relies on theme-level configuration
- Vertical dividers don't support labels (logical constraint given vertical orientation)
- The use of `my` for spacing is specific to Mantine's styling API pattern
