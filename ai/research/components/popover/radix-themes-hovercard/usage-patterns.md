# Radix UI Themes - Hover Card Usage Patterns

## Component URL
https://www.radix-ui.com/themes/docs/components/hover-card
Status: ✅ Working

## Documentation Quality
Good - Clear, focused documentation with practical examples. Covers theme-specific styling props and integration patterns. Less comprehensive than Primitives docs but adequate for common use cases.

## Component Definition
- **Core purpose**: A styled hover card component built on Radix Primitives for previewing content behind links. Provides theme-integrated styling with responsive design support for contextual link previews.
- **Mental model**: A pre-styled variant of the Hover Card primitive that integrates with Radix Themes design system. Offers size scales and dimension controls while maintaining the hover-triggered preview behavior.
- **Semantic meaning**: Visual-only preview mechanism for sighted users, explicitly designed for link previews. Theme-aware styling provides consistent visual treatment across the application.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Commonly used with Text component for typography consistency |
| Icon support | ✅ | Examples show integration with theme icons and custom icons |
| Media support | ✅ | Examples demonstrate avatar images and user profile previews |
| Custom content | ✅ | Supports complex layouts with Flex, Avatar, Text, and other theme components |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled | ✅ | Inherits from Primitives (open/onOpenChange on Root) |
| Uncontrolled | ✅ | Inherits from Primitives (defaultOpen) |
| Hover-triggered | ✅ | Primary interaction - opens on hover, closes on leave |
| Focus-triggered | ✅ | Also opens on keyboard focus for accessibility |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Open/Closed | ✅ | Inherited data-state attributes from Primitives |
| Loading | ❌ | No built-in loading state documented |
| Disabled | ❌ | No explicit disabled state |
| Timing delays | ❌ | Not mentioned in Themes docs (but inherited from Primitives: 700ms open, 300ms close) |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Three sizes: "1", "2" (default), "3" - controls padding and scale |
| Width control | ✅ | `width`, `minWidth`, `maxWidth` props with responsive support (default maxWidth: "480px") |
| Height control | ✅ | `height`, `minHeight`, `maxHeight` props with responsive support |
| Positioning | ✅ | Inherits full positioning system from Primitives (side, align, offsets, collision handling) |
| Color options | ❌ | No explicit color/theme variants - uses default theme styling |
| Spacing control | ✅ | Size prop affects internal padding and scale |
| Responsive | ✅ | All size and dimension props accept responsive values (breakpoint-specific) |
| Inset integration | ✅ | Works with Inset component for edge-to-edge layouts (images, headers) |

## Code Examples

### Basic Hover Card
```jsx
<HoverCard.Root>
  <HoverCard.Trigger>
    <Link href="/profile">@username</Link>
  </HoverCard.Trigger>
  <HoverCard.Content>
    <Text>User preview information</Text>
  </HoverCard.Content>
</HoverCard.Root>
```

### User Profile Preview Pattern
```jsx
<HoverCard.Root>
  <HoverCard.Trigger>
    <Link href="/user/123">@radix_ui</Link>
  </HoverCard.Trigger>
  <HoverCard.Content size="2" maxWidth="320px">
    <Flex gap="3">
      <Avatar size="3" src="avatar.jpg" fallback="R" />
      <Box>
        <Text weight="bold">Radix UI</Text>
        <Text size="1" color="gray">@radix_ui</Text>
        <Text size="2" mt="2">
          Unstyled, accessible components for React.
        </Text>
      </Box>
    </Flex>
  </HoverCard.Content>
</HoverCard.Root>
```

### With Size Variations
```jsx
{/* Small hover card */}
<HoverCard.Content size="1" maxWidth="240px">
  Compact preview
</HoverCard.Content>

{/* Medium (default) */}
<HoverCard.Content size="2" maxWidth="280px">
  Standard preview
</HoverCard.Content>

{/* Large */}
<HoverCard.Content size="3" maxWidth="320px">
  Detailed preview
</HoverCard.Content>
```

### Responsive Sizing
```jsx
<HoverCard.Content
  size={{ initial: '1', sm: '2', md: '3' }}
  maxWidth={{ initial: '240px', sm: '280px', md: '320px' }}
>
  Adaptive preview content
</HoverCard.Content>
```

### With Inset for Images
```jsx
<HoverCard.Content size="2">
  <Inset side="top" pb="current">
    <img src="cover.jpg" alt="Cover" />
  </Inset>
  <Box p="3">
    <Text>Content below image</Text>
  </Box>
</HoverCard.Content>
```

## Notable Features
- **Theme integration**: Seamless visual consistency with Radix Themes design system
- **Size scale**: Three-tier sizing (1-3) controls padding and overall scale with predictable progression
- **Dimension control**: Explicit width/height constraints separate from size scale for flexible sizing
- **Default constraints**: Sensible maxWidth defaults (480px) prevent oversized previews
- **Responsive props**: Full responsive object syntax support for breakpoint-specific behavior
- **Size-specific max widths**: Documentation suggests pairing sizes with corresponding max widths (240px/280px/320px)
- **Composition patterns**: First-class integration with Flex, Avatar, Text, Link, and other theme components
- **Inset integration**: Edge-to-edge content support for rich media layouts
- **Link preview focus**: Examples emphasize user profile and social media preview patterns
- **Trigger flexibility**: Works with theme Link component and custom trigger elements
- **Pre-styled foundation**: Reduces custom CSS requirements while maintaining flexibility

## Research Notes
- This is the styled/themed variant - provides opinionated visual design on top of Primitives behavior
- Documentation focuses on common patterns (user profiles, link previews) rather than exhaustive API coverage
- Size scale is simpler than Popover (3 sizes vs 4) - suggests different typical use cases
- The size-to-maxWidth pairings (1→240px, 2→280px, 3→320px) are recommended patterns, not constraints
- Responsive prop support indicates mature responsive design system integration
- Less emphasis on positioning/collision props (inherited but not re-documented from Primitives)
- No color/variant theming mentioned - follows global theme rather than per-component customization
- Examples show realistic social media/profile preview patterns rather than abstract demos
- The three-part architecture (Root, Trigger, Content) is simpler than Popover (no Close component)
- Assumes Trigger wraps a link element (the primary use case for hover cards)
- Documentation includes GitHub links for issues and source code access
- Timing delay configuration not mentioned (inherited from Primitives but not exposed in Themes API docs)
- The component is explicitly for "sighted users" - maintains accessibility awareness from Primitives
- Smaller default maxWidth than Popover (often 280-320px vs 480px) reflects different content density needs
