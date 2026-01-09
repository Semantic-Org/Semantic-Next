# Radix UI Themes - Popover Usage Patterns

## Component URL
https://www.radix-ui.com/themes/docs/components/popover
Status: ✅ Working

## Documentation Quality
Good - Clear documentation with visual examples showing common patterns. Focuses on theme-specific styling props and integration with other Themes components. Less comprehensive than Primitives documentation but adequate for themed usage.

## Component Definition
- **Core purpose**: A styled, opinionated popover component built on Radix Primitives that displays rich content in a floating panel triggered by a button. Provides theme-integrated styling with consistent design language.
- **Mental model**: A pre-styled variant of the Popover primitive that integrates with the Radix Themes design system. Offers size scales, responsive props, and compositional patterns for common use cases while maintaining the same composable architecture.
- **Semantic meaning**: Implements accessible disclosure pattern for contextual content, with theme-aware visual styling. Functions as an interactive overlay for forms, settings, and rich content preview.

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Commonly used with Text component for typography consistency |
| Icon support | ✅ | Integrates with theme icon components and custom icons |
| Media support | ✅ | Examples show image previews with Inset component integration |
| Custom content | ✅ | Fully composable - supports forms (TextField, TextArea), buttons, avatars, and complex layouts |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled | ✅ | Inherits from Primitives Root (open/onOpenChange) |
| Uncontrolled | ✅ | Inherits from Primitives Root (defaultOpen) |
| Modal | ✅ | Inherits from Primitives (modal prop) |
| Non-modal | ✅ | Default behavior inherited from Primitives |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Open/Closed | ✅ | Inherited data-state attributes from Primitives |
| Loading | ❌ | No built-in loading state documented |
| Disabled | ❌ | No explicit disabled state - implement via trigger button |
| Force mount | ❌ | Not mentioned in Themes docs (but likely inherited from Primitives) |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Four sizes: "1", "2" (default), "3", "4" - controls padding and border-radius |
| Width control | ✅ | `width`, `minWidth`, `maxWidth` props with responsive support (default maxWidth: "480px") |
| Height control | ✅ | `height`, `minHeight`, `maxHeight` props with responsive support |
| Positioning | ✅ | Inherits full positioning system from Primitives (side, align, offsets, collision handling) |
| Color options | ❌ | No explicit color/theme variants documented - uses default theme styling |
| Spacing control | ✅ | Size prop affects internal padding; Inset component for edge-to-edge layouts |
| Responsive | ✅ | All size and dimension props accept responsive values (breakpoint-specific) |
| Inset integration | ✅ | Works with Inset component to align content flush with popover edges |

## Code Examples

### Basic Popover
```jsx
<Popover.Root>
  <Popover.Trigger>
    <Button>Comment</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Text>Add your comment here</Text>
  </Popover.Content>
</Popover.Root>
```

### Sized Popover with Width Control
```jsx
<Popover.Content size="3" maxWidth="600px">
  Content here
</Popover.Content>
```

### Form Pattern with Avatar
```jsx
<Popover.Root>
  <Popover.Trigger>
    <Button>Comment</Button>
  </Popover.Trigger>
  <Popover.Content size="2" maxWidth="480px">
    <Flex gap="3">
      <Avatar size="2" fallback="U" />
      <Box flexGrow="1">
        <TextArea placeholder="Write a comment..." />
        <Flex gap="3" mt="3" justify="between">
          <Checkbox label="Send notification" />
          <Popover.Close>
            <Button size="1">Submit</Button>
          </Popover.Close>
        </Flex>
      </Box>
    </Flex>
  </Popover.Content>
</Popover.Root>
```

### Image Preview with Inset
```jsx
<Popover.Content>
  <Inset side="top" pb="current">
    <img src="preview.jpg" alt="Preview" />
  </Inset>
  <Text>Image description</Text>
</Popover.Content>
```

### Responsive Sizing
```jsx
<Popover.Content
  size={{ initial: '1', sm: '2', md: '3' }}
  maxWidth={{ initial: '300px', md: '480px' }}
>
  Responsive content
</Popover.Content>
```

## Notable Features
- **Theme integration**: Seamless integration with Radix Themes design system for consistent visual language
- **Size scale**: Numeric size system (1-4) controls padding and border-radius with predictable scaling
- **Dimension control**: Explicit width/height constraint props separate from size scale
- **Default max width**: Sensible 480px default maxWidth prevents overly wide popovers
- **Responsive props**: All major props support responsive object syntax for breakpoint-specific values
- **Inset component pattern**: First-class support for edge-to-edge content (images, headers) via Inset integration
- **Composition with theme components**: Examples demonstrate integration with Avatar, Button, TextField, TextArea, Checkbox, Flex, Box
- **Pre-styled foundation**: Built on Primitives but adds opinionated theme styling, reducing custom CSS needs
- **Close component**: Dedicated Close wrapper for explicit close controls (typically wrapping buttons)
- **Common patterns documented**: Comment forms, share dialogs, settings panels, confirmation flows

## Research Notes
- This is the styled/themed variant of the Popover primitive - provides opinionated visual design
- Focuses on integration with other Radix Themes components rather than low-level props
- Documentation emphasizes common UI patterns (comment forms, image previews) rather than API completeness
- The size prop is separate from dimension props - size affects density/padding, dimensions affect bounds
- Responsive prop support indicates this is part of a comprehensive responsive design system
- Inset component integration suggests a mature compositional API for common layout patterns
- Less documentation on positioning/collision props (inherited from Primitives but not re-documented)
- No color/variant props mentioned - suggests theme follows global color system rather than per-component theming
- Examples show realistic, production-ready patterns rather than minimal API demonstrations
- The 480px default maxWidth is a notable opinionated default (prevents text readability issues in wide popovers)
- Documentation includes direct links to GitHub for issues and source code viewing
