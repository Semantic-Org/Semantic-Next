# Radix UI - Separator/Divider Usage Patterns

## Component URL
https://www.radix-ui.com/themes/docs/components/separator
Status: ✅ Working

## Documentation Quality
Good - Clear, concise documentation with interactive examples. Covers all major features and props. Documentation is well-organized with visual examples.

## Component Definition
- **Core purpose**: To visually or semantically separate content within an interface. Functions as both a decorative element and a semantic divider between sections.
- **Mental model**: A flexible divider line that can be oriented horizontally or vertically, with adjustable visual weight and color to create visual hierarchy and content organization.
- **Semantic meaning**: Communicates visual separation between distinct content sections. Can be decorative (visual only) or semantic (meaningful content separation for accessibility).

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ❌ | No text content support shown in documentation |
| Icon support | ❌ | No icon support documented |
| Media support | ❌ | No media support documented |
| Custom content | ❌ | Component appears to be a simple line element only |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Horizontal | ✅ | Default orientation. Full-width divider line |
| Vertical | ✅ | Via `orientation="vertical"` prop. Height adapts to container |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ❌ | No loading state documented |
| Disabled | ❌ | No disabled state documented |
| Decorative | ✅ | Boolean `decorative` prop (default: true) for semantic vs. decorative classification |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Four sizes: "1", "2", "3", "4" (thickness/span control) |
| Spacing control | ✅ | Inherits margin props (e.g., `my="3"` for vertical margin) |
| Visual styles | ❌ | No dashed/dotted patterns documented. Appears to be solid only |
| Color options | ✅ | Theme-integrated colors: gray (default), indigo, cyan, orange, crimson, plus full theme color palette |
| Alignment | ❌ | No alignment options documented |
| Responsive | ✅ | Props support responsive values (breakpoint-specific adjustments) |

## Code Examples

### Basic Horizontal Separator
```jsx
<Separator my="3" size="4" />
```

### Vertical Separator Between Items
```jsx
<Flex gap="3" align="center">
  Item
  <Separator orientation="vertical" />
  Item
</Flex>
```

### With Color Theme
```jsx
<Separator color="indigo" size="2" />
```

## Notable Features
- **Responsive props**: All major props (orientation, size, color) support responsive values, allowing breakpoint-specific behavior
- **Theme integration**: Deep integration with Radix Themes color system for consistent design language
- **Semantic control**: Explicit `decorative` prop to distinguish between decorative and semantic separators for accessibility
- **Margin props inheritance**: Built-in spacing control through inherited margin properties
- **Minimal API**: Simple, focused component with clear, limited scope
- **Size system**: Numeric size scale (1-4) rather than t-shirt sizing (sm/md/lg)

## Research Notes
- Documentation is clear and accessible with no issues
- Component is intentionally minimal - no support for content, icons, or complex patterns
- Follows Radix's primitive-focused approach with theme system overlay
- Emphasis on simplicity and composability rather than feature richness
- The `decorative` prop is a notable accessibility consideration that isn't common in other implementations
- Responsive prop support suggests this is part of a larger responsive design system
