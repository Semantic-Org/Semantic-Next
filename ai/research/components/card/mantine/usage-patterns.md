# Mantine - Card Usage Patterns

## Component URL
https://mantine.dev/core/card/
Status: ✅ Working
Version: Current (v7.x based on code syntax)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - Detailed props documentation, multiple examples, clear guidance on composition patterns and limitations.

## Component Definition
- **Core purpose**: Organize content into a structured container with sections, built as a specialized wrapper around the Paper component for content that benefits from visual division.
- **Mental model**: A content container that intelligently manages spacing and borders when divided into sections. Think of it as an enhanced Paper that understands how to create visual breaks.
- **Semantic meaning**: Groups related content together with clear visual hierarchy and optional sectioning for media, headers, footers, or distinct content areas.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `shadow="sm"`, `padding="lg"`)
- **Composed**: Via composition/children (e.g., `<Card.Section>content</Card.Section>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Container Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Based on Paper | ✅ | Native | Explicit wrapper around Paper component, inherits all Paper capabilities |
| Shadow control | ✅ | Native | Via `shadow` prop (inherited from Paper) |
| Border support | ✅ | Native | Via `withBorder` prop on both Card and Card.Section |
| Padding control | ✅ | Native | Via `padding` prop with theme size values |
| Border radius | ✅ | Native | Via `radius` prop (inherited from Paper) |
| Polymorphic root | ✅ | Native | Via `component` prop - can render as different elements |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Section component | ✅ | Native | Dedicated `Card.Section` sub-component |
| Media sections | ✅ | Composed | Card.Section with Image component for media areas |
| Text content | ✅ | Composed | Standard text/content composition within Card body |
| Mixed content | ✅ | Composed | Sections + non-sectioned content combined |
| Inherit padding | ✅ | Native | `inheritPadding` prop on Card.Section |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Intelligent sections | ✅ | Native | Card.Section auto-manages negative margins based on position |
| First section | ✅ | Native | Negative top, left, right margins (full bleed at top) |
| Middle section | ✅ | Native | Negative left, right margins only |
| Last section | ✅ | Native | Negative bottom, left, right margins (full bleed at bottom) |
| Direct children only | ✅ | Native | Sections must be direct children (no wrapper fragments) |
| Section borders | ✅ | Native | `withBorder` on sections - positioned based on location |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Shadow levels | ✅ | Native | Multiple levels: xs, sm, md, lg, xl (from Paper) |
| Padding sizes | ✅ | Native | Theme-based: xs, sm, md, lg, xl |
| Border radius | ✅ | Native | Theme-based sizing options |
| With/without border | ✅ | Native | `withBorder` boolean prop |
| Section padding | ✅ | Native | Independent padding control per section |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Polymorphic Card | ✅ | Native | `component` prop - render as link, button, etc. |
| Polymorphic Section | ✅ | Native | Card.Section also supports `component` prop |
| Clickable cards | ✅ | Composed | Via `component="a"` or `component={Link}` |
| Interactive content | ✅ | Composed | Buttons, links, and other interactive elements |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Styles API | ✅ | Native | Full Styles API support (inherited from Paper) |
| Theme integration | ✅ | Native | Uses theme values for padding, radius, shadow |
| CSS custom props | ✅ | Native | Mantine's CSS variable system |
| Inherited styling | ✅ | Native | Explicitly inherits Paper's styling system |

## Code Examples

### Basic Card with Sections
```jsx
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';

function Demo() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src="..." height={160} alt="Norway" />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Norway Fjord Adventures</Text>
        <Badge color="pink">On Sale</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button>
    </Card>
  );
}
```

### Polymorphic Card as Link
```jsx
<Card
  component="a"
  href="https://example.com"
  target="_blank"
  shadow="sm"
  padding="lg"
  radius="md"
  withBorder
>
  <Card.Section>
    <Image src="..." h={160} alt="..." />
  </Card.Section>

  <Text fw={500} size="lg" mt="md">
    Title
  </Text>

  <Text size="sm" c="dimmed">
    Description text
  </Text>
</Card>
```

### Section with Inherited Padding
```jsx
<Card padding="xl">
  <Card.Section inheritPadding>
    Section content with inherited padding from Card
  </Card.Section>

  <Card.Section inheritPadding withBorder>
    Another section with padding and border
  </Card.Section>
</Card>
```

## Notable Features

### Section Position Intelligence
The Card.Section component automatically calculates which negative margins to apply based on its position:
- **First child**: Removes top, left, and right margins for full-width header/media
- **Last child**: Removes bottom, left, and right margins for full-width footer
- **Middle children**: Only removes left and right margins, preserving vertical spacing

This creates intuitive full-bleed sections without manual margin management.

### Composition Constraint
Documentation explicitly warns: "Card relies on mapping direct children and you cannot use fragments or other wrappers for Card.Section."

This is a technical requirement for the automatic section positioning logic to work correctly.

### Paper Inheritance Philosophy
Mantine recommends: "If you do not need to use Card.Section, you can use Paper component instead."

This shows a clear component hierarchy where Card is a specialized version of Paper, not a separate abstraction.

### Polymorphic Flexibility
Both Card and Card.Section support the `component` prop, allowing semantic flexibility:
- Cards as links (`component="a"`)
- Cards as buttons (`component="button"`)
- Integration with routing libraries (`component={Link}`)

This maintains styling while changing the underlying HTML element.

## Research Notes

### Documentation Strengths
- Clear explanation of Paper relationship
- Explicit warnings about composition constraints
- Good visual examples showing section positioning
- Comprehensive props documentation

### Implementation Insights
- Smart negative margin system based on child position
- Strong integration with Mantine's theming system
- Polymorphic behavior at both Card and Section levels
- Explicit inheritance model (Paper → Card)

### Design Philosophy
Mantine's Card is not trying to be a general-purpose container. It's specifically designed for content that benefits from sectioning, with Paper recommended as the simpler alternative when sections aren't needed. This shows thoughtful component boundaries.
