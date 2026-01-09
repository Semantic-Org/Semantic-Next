# Radix UI Themes - Card Usage Patterns

## Component URL
https://www.radix-ui.com/themes/docs/components/card
Status: ✅ Working
Version: Current (Radix Themes)
Last Verified: 2025-11-04

## Documentation Quality
Good - Clear, concise documentation with visual examples. Well-organized with interactive demos showing various card configurations. Covers all major features including composition patterns and the Inset component.

## Component Definition
- **Core purpose**: A structured content container component that provides consistent padding, background, and border styling for grouping related information. Serves as a foundational layout primitive for organizing UI content.
- **Mental model**: A versatile content box that wraps arbitrary children content with consistent visual treatment. Think of it as a "frame" for content that provides visual cohesion and hierarchy through size, variant, and composition patterns.
- **Semantic meaning**: Communicates content grouping and visual hierarchy. Can be transformed into interactive elements (links, buttons) while maintaining semantic meaning through the `asChild` pattern.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `size="3"`, `variant="surface"`)
- **Composed**: Via composition/children (e.g., `<Card>{content}</Card>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Container Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic card container | ✅ | Native | Based on `div` element with default padding and background |
| Shadow DOM encapsulation | ❌ | - | Standard React component, no Shadow DOM |
| Flexible children | ✅ | Composed | Accepts arbitrary children content |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Nest Text components within card |
| Icon support | ✅ | Composed | Compose with layout components and icon libraries |
| Media support | ✅ | Composed (Inset) | Use Inset component for edge-to-edge images/media |
| Custom content | ✅ | Composed | Full composition via children - accepts any React nodes |
| Inset pattern | ✅ | Native | Dedicated Inset component for flush content placement |
| Profile cards | ✅ | Composed | Combine Avatar + Text components within Flex layouts |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Flex composition | ✅ | Composed | Nest Flex/Box components for systematic organization |
| Grid layouts | ✅ | Composed | Multiple cards in grids for visual hierarchy |
| Spacing control | ✅ | Native | Inherits common margin props for external spacing |
| Internal padding | ✅ | Native | Size prop controls internal padding (1-5 scale) |
| Inset positioning | ✅ | Native | Inset component with `side` prop (top/bottom/left/right/all) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | 5 levels: "1", "2", "3", "4", "5" (default: "1") - controls padding and spacing |
| Variant styles | ✅ | Native | 3 variants: "surface" (elevated), "classic" (bordered), "ghost" (minimal) - default: "surface" |
| Color options | ❌ | - | No explicit color prop; relies on theme CSS variables |
| Responsive sizes | ✅ | Native | Responsive<"1" \| "2" \| "3" \| "4" \| "5"> type support |
| Border styles | ❌ | - | No dashed/dotted variants; controlled by variant |
| Shadow/elevation | ✅ | Native | Surface variant provides elevated appearance |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable cards | ✅ | Native | `asChild` pattern: `<Card asChild><a href="#">...</a></Card>` |
| Interactive states | ✅ | Native | Automatic hover and focus styling when using asChild |
| Disabled state | ❌ | - | No disabled state documented |
| Loading state | ❌ | - | No loading state documented |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| CSS variables | ✅ | Native | Uses CSS variables for theme consistency across light/dark modes |
| className support | ✅ | Native | Accepts className prop for custom styling |
| Style prop | ✅ | Native | Standard React style prop support |
| Padding scale | ✅ | Native | Proportional padding adjusts with size increments (1-5) |
| Theme integration | ✅ | Native | Deep integration with Radix Themes design system |

## Composition Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| asChild pattern | ✅ | Native | Render as different element type (link, button) with merged props |
| Inset component | ✅ | Native | Edge-to-edge content: `<Inset clip="padding-box" side="top" pb="current">` |
| Nested layouts | ✅ | Composed | Combine with Flex, Box for structured content |
| Multi-component | ✅ | Composed | Avatar + Text + other primitives within cards |

## Code Examples

### Basic Card
```jsx
<Card>
  <Text>Basic card with default padding and surface variant</Text>
</Card>
```

### Card with Size Variation
```jsx
<Card size="2">
  <Flex gap="3" align="center">
    <Avatar size="3" fallback="T" />
    <Box>
      <Text as="div" size="2" weight="bold">
        Teodros Girmay
      </Text>
      <Text as="div" size="2" color="gray">
        Engineering
      </Text>
    </Box>
  </Flex>
</Card>
```

### Clickable Card (asChild Pattern)
```jsx
<Card asChild>
  <a href="#">
    <Text>This entire card is clickable and semantic</Text>
  </a>
</Card>
```

### Card with Inset Image
```jsx
<Card size="2">
  <Inset clip="padding-box" side="top" pb="current">
    <img
      src="https://example.com/image.jpg"
      alt="Card image"
      style={{
        display: 'block',
        objectFit: 'cover',
        width: '100%',
        height: 140,
        backgroundColor: 'var(--gray-5)',
      }}
    />
  </Inset>
  <Text as="p" size="3">
    Card content with flush image at top
  </Text>
</Card>
```

### Multi-Size Grid
```jsx
<Grid columns="3" gap="3">
  <Card size="1">Small card</Card>
  <Card size="2">Medium card</Card>
  <Card size="3">Large card</Card>
</Grid>
```

### Variant Examples
```jsx
{/* Surface variant (default) - elevated appearance */}
<Card variant="surface">Surface card</Card>

{/* Classic variant - traditional bordered style */}
<Card variant="classic">Classic card</Card>

{/* Ghost variant - minimal, outline-focused */}
<Card variant="ghost">Ghost card</Card>
```

## Notable Features
- **asChild composition**: Powerful pattern for semantic transformation while maintaining visual styling. Enables cards to be links, buttons, or any element without wrapper div overhead.
- **Inset component**: Dedicated primitive for edge-to-edge content placement. Solves common media card pattern with `clip`, `side`, and `pb` props.
- **Numeric size scale**: Consistent 1-5 sizing system across Radix Themes, paired with typography hierarchy.
- **Responsive props**: Size prop accepts responsive values for breakpoint-specific sizing.
- **Minimal API surface**: Focused component with clear, limited scope - relies on composition for complexity.
- **CSS variable theming**: Consistent light/dark mode support through design tokens.
- **Children composition**: Pure composition model - no slot props or special child types.
- **Typography pairing**: Size increments designed to pair with Text component sizes for visual hierarchy.

## Research Notes
- Documentation is clear and accessible with excellent visual examples
- Component is intentionally minimal, focusing on composition over built-in features
- Follows Radix Themes philosophy: primitive components + composition patterns
- The Inset component is a notable innovation for media card patterns
- asChild pattern is used consistently across Radix Themes for element transformation
- No explicit state management (loading, disabled) - relies on composition
- Size system is consistent across the Radix Themes component library
- Strong emphasis on CSS variables for consistent theming
- The component is part of Radix Themes (not Primitives), providing higher-level styling
- Documentation shows real-world patterns (profile cards, media cards) as composition examples
