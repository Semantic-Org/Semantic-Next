# Chakra UI - Spinner (Loader) Usage Patterns

## Component Overview

The Spinner component in Chakra UI is a circular loading indicator used to provide visual feedback that an action is processing, awaiting a course of change, or a result. It's a feedback component that helps inform users about ongoing operations through an animated circular progress indicator. The component is accessible by default, with built-in support for screen readers through ARIA attributes and customizable visual properties for various loading state patterns.

## Version Comparison (v2 vs v3)

### Breaking Changes

Chakra UI v3 introduced several important breaking changes to the Spinner component:

| Change | v2 API | v3 API | Impact |
|--------|--------|--------|--------|
| Thickness control | `thickness` prop | `borderWidth` prop | **Breaking** - Renamed prop |
| Animation speed | `speed` prop | `animationDuration` prop | **Breaking** - Renamed prop |
| Track color | `emptyColor` prop | CSS variable `--spinner-track-color` | **Breaking** - Changed from prop to CSS variable |
| Color scheme | `colorScheme` prop | `colorPalette` prop | Renamed for consistency |

### Migration Example

**v2 Code:**
```jsx
<Spinner
  thickness="4px"
  speed="0.65s"
  emptyColor="gray.200"
  color="blue.500"
  size="xl"
/>
```

**v3 Code:**
```jsx
<Spinner
  borderWidth="4px"
  animationDuration="0.65s"
  css={{ "--spinner-track-color": "colors.gray.200" }}
  color="blue.500"
  size="xl"
/>
```

### Version-Specific Features

**v2 Features:**
- `emptyColor` prop for track color
- `speed` prop for animation duration
- `thickness` prop for border width
- Depends on Framer Motion for animations

**v3 Features:**
- `--spinner-track-color` CSS variable for track color customization
- `animationDuration` prop (renamed from `speed`)
- `borderWidth` prop (renamed from `thickness`)
- CSS-based animations (no Framer Motion dependency)
- `colorPalette` prop for theme integration

## Basic Usage

### v2 Basic Usage

```jsx
import { Spinner } from '@chakra-ui/react'

// Default spinner
<Spinner />

// Custom sized spinner
<Spinner size="lg" />

// Custom color
<Spinner color="blue.500" />

// Fully customized
<Spinner
  thickness="4px"
  speed="0.65s"
  emptyColor="gray.200"
  color="blue.500"
  size="xl"
/>
```

### v3 Basic Usage

```jsx
import { Spinner } from '@chakra-ui/react'

// Default spinner
<Spinner />

// Custom sized spinner
<Spinner size="lg" />

// Custom color
<Spinner color="blue.500" />

// Fully customized
<Spinner
  borderWidth="4px"
  animationDuration="0.65s"
  css={{ "--spinner-track-color": "colors.gray.200" }}
  color="blue.500"
  size="xl"
/>
```

## Props/API

### Chakra UI v2 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | The size of the spinner |
| `color` | `string` | - | The color of the spinner (accepts Chakra color tokens like `"blue.500"`) |
| `thickness` | `string` | - | The width of the spinner border (e.g., `"4px"`) |
| `speed` | `string` | - | The animation speed/duration (e.g., `"0.65s"`) |
| `emptyColor` | `string` | - | The color of the empty/track area in the spinner |
| `label` | `string` | `"Loading..."` | Text for screen readers (not visually rendered) |
| `colorScheme` | `string` | - | Color scheme: `"whiteAlpha"`, `"blackAlpha"`, `"gray"`, `"red"`, `"orange"`, `"yellow"`, `"green"`, `"teal"`, `"blue"`, `"cyan"`, `"purple"`, `"pink"` |

**Additional Props:** The Spinner component also accepts all standard HTML div element props.

### Chakra UI v3 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | The size of the spinner |
| `color` | `string` | - | The color of the spinner (accepts Chakra color tokens like `"blue.500"`) |
| `borderWidth` | `string` | - | The width of the spinner border (e.g., `"4px"`) - **Renamed from `thickness`** |
| `animationDuration` | `string` | - | The animation speed/duration (e.g., `"0.65s"`) - **Renamed from `speed`** |
| `label` | `string` | `"Loading..."` | Text for screen readers (not visually rendered) |
| `colorPalette` | `string` | - | Color palette to use from theme (e.g., `"blue"`, `"green"`, `"red"`) - **Renamed from `colorScheme`** |

**CSS Variables (v3):**
- `--spinner-track-color`: Controls the color of the spinner's track/empty area (replaces `emptyColor` prop)

**Additional Props:** The Spinner component also accepts all standard HTML div element props.

## Variants & Patterns

### Size Variants

Both v2 and v3 support the same size variants:

```jsx
// Extra small
<Spinner size="xs" />

// Small
<Spinner size="sm" />

// Medium (default)
<Spinner size="md" />

// Large
<Spinner size="lg" />

// Extra large
<Spinner size="xl" />
```

### Color/Theme Variants

**v2 Color Patterns:**
```jsx
// Direct color
<Spinner color="blue.500" />

// Color scheme (applies theme colors)
<Spinner colorScheme="blue" />

// Track color
<Spinner color="blue.500" emptyColor="gray.200" />
```

**v3 Color Patterns:**
```jsx
// Direct color
<Spinner color="blue.500" />

// Color palette (applies theme colors)
<Spinner colorPalette="blue" />

// Track color using CSS variable
<Spinner
  color="red.500"
  css={{ "--spinner-track-color": "colors.gray.200" }}
/>
```

### Speed/Animation Controls

**v2:**
```jsx
// Fast animation
<Spinner speed="0.4s" />

// Slow animation
<Spinner speed="1.2s" />

// Default speed (not explicitly documented)
<Spinner />
```

**v3:**
```jsx
// Fast animation
<Spinner animationDuration="0.4s" />

// Slow animation
<Spinner animationDuration="1.2s" />

// Default speed (not explicitly documented)
<Spinner />
```

### Thickness Variations

**v2:**
```jsx
// Thin border
<Spinner thickness="2px" />

// Thick border
<Spinner thickness="6px" />

// Default thickness
<Spinner />
```

**v3:**
```jsx
// Thin border
<Spinner borderWidth="2px" />

// Thick border
<Spinner borderWidth="6px" />

// Default thickness
<Spinner />
```

### Empty Area Color

**v2:**
```jsx
<Spinner
  color="blue.500"
  emptyColor="gray.200"
/>
```

**v3:**
```jsx
<Spinner
  color="blue.500"
  css={{ "--spinner-track-color": "colors.gray.200" }}
/>
```

## Composition Patterns

### Inline Loading with Text

**Both v2 and v3:**
```jsx
import { Spinner, VStack, Text } from '@chakra-ui/react'

<VStack>
  <Spinner />
  <Text>Loading...</Text>
</VStack>
```

### Centered Loading State

**Both v2 and v3:**
```jsx
import { Spinner, Flex } from '@chakra-ui/react'

<Flex
  direction="column"
  align="center"
  justify="center"
  minH="200px"
>
  <Spinner size="xl" />
</Flex>
```

### Overlay Pattern

**Both v2 and v3:**
```jsx
import { Spinner, Box, AbsoluteCenter } from '@chakra-ui/react'

<Box position="relative" h="200px" aria-busy="true">
  {/* Your content here */}
  <AbsoluteCenter>
    <Spinner />
  </AbsoluteCenter>
</Box>
```

### Button Loading State

**Both v2 and v3:**
```jsx
import { Button, Spinner } from '@chakra-ui/react'

<Button isDisabled>
  <Spinner size="sm" mr={2} />
  Loading...
</Button>
```

### Full Page Loading

**Both v2 and v3:**
```jsx
import { Spinner, Flex } from '@chakra-ui/react'

<Flex
  position="fixed"
  top="0"
  left="0"
  right="0"
  bottom="0"
  align="center"
  justify="center"
  bg="rgba(255, 255, 255, 0.8)"
  zIndex="9999"
>
  <Spinner
    size="xl"
    color="blue.500"
  />
</Flex>
```

## Styling & Theming

### Component Theming (v2)

You can customize the Spinner theme using `defineStyle` and `defineStyleConfig`:

```jsx
import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const customVariant = defineStyle({
  borderWidth: '6px',
  color: 'purple.500',
})

const spinnerTheme = defineStyleConfig({
  variants: { custom: customVariant },
  defaultProps: {
    size: 'md',
  },
})
```

### Component Theming (v3)

v3 follows a similar pattern but emphasizes CSS variables:

```jsx
import { Spinner } from '@chakra-ui/react'

// Using theme colors
<Spinner colorPalette="teal" />

// Using CSS variables for advanced customization
<Spinner
  css={{
    "--spinner-track-color": "colors.gray.200",
    "--spinner-color": "colors.blue.500",
  }}
/>
```

### Global Theme Configuration

**Theme tokens (both versions):**
```jsx
// In your theme configuration
export const theme = extendTheme({
  colors: {
    brand: {
      500: '#1a365d',
    },
  },
})

// Use in component
<Spinner color="brand.500" />
```

### Style Props

Both versions accept standard Chakra style props:

```jsx
<Spinner
  m={4}
  p={2}
  bg="white"
  borderRadius="full"
  boxShadow="lg"
/>
```

## Accessibility

### ARIA Attributes

The Chakra UI Spinner component has built-in accessibility features:

**Automatic ARIA Support:**
- `role="status"` - Automatically applied, announces loading state to screen readers
- Default label: `"Loading..."` - Provides fallback text for assistive technologies

### Screen Reader Support

**Custom Labels:**
```jsx
// Custom screen reader text
<Spinner label="Processing your request..." />

// Empty label (use with visible text nearby)
<Spinner label="" />
```

**Best Practice with Visible Text:**
```jsx
<VStack>
  <Spinner label="" />
  <Text>Loading your data...</Text>
</VStack>
```

### Accessibility Recommendations

1. **Always provide context**: When using overlays, add `aria-busy="true"` to the container:
   ```jsx
   <Box position="relative" aria-busy="true">
     <Spinner />
     {/* Content being loaded */}
   </Box>
   ```

2. **Use semantic labels**: Customize the `label` prop to describe what's loading:
   ```jsx
   <Spinner label="Loading user profile..." />
   ```

3. **Announce state changes**: Use live regions when showing/hiding spinners:
   ```jsx
   <div role="status" aria-live="polite">
     {isLoading && <Spinner />}
   </div>
   ```

### Keyboard Support

The Spinner component itself is not interactive and requires no keyboard support. However, when used in loading states, ensure that:
- Focus is managed appropriately when content loads
- Users can't interact with disabled elements while loading
- Loading states are announced to screen reader users

## Best Practices

### When to Use

1. **Async operations**: Data fetching, form submissions, file uploads
2. **Page transitions**: Route changes, lazy-loaded content
3. **Button actions**: Processing states for user interactions
4. **Initial page load**: Full-page or section loading states

### Common Patterns

**1. Conditional Rendering:**
```jsx
{isLoading ? (
  <Spinner />
) : (
  <YourContent />
)}
```

**2. Inline Loading:**
```jsx
<Button isLoading={isLoading} loadingText="Submitting">
  Submit
</Button>
```

**3. Skeleton Pattern (Better UX):**
For content that takes longer to load, consider using Skeleton components instead:
```jsx
{isLoading ? (
  <SkeletonText />
) : (
  <Text>{content}</Text>
)}
```

### Migration Guide v2 → v3

**Step 1: Update prop names**
```diff
<Spinner
- thickness="4px"
+ borderWidth="4px"
- speed="0.65s"
+ animationDuration="0.65s"
- emptyColor="gray.200"
+ css={{ "--spinner-track-color": "colors.gray.200" }}
/>
```

**Step 2: Update color schemes**
```diff
- <Spinner colorScheme="blue" />
+ <Spinner colorPalette="blue" />
```

**Step 3: Test animations**
- v3 uses CSS animations instead of Framer Motion
- Animation behavior should be identical, but verify in your app
- Performance may be slightly improved in v3

**Step 4: Update theme customizations**
- Review any custom Spinner theme configurations
- Update to use CSS variables where appropriate
- Test theming in light/dark modes

### Performance Tips

1. **Avoid excessive spinners**: One spinner per loading state is sufficient
2. **Use appropriate sizes**: Match spinner size to the context (small for buttons, larger for pages)
3. **Consider skeleton screens**: For longer loads, skeletons provide better UX than spinners
4. **Debounce fast loads**: Don't show spinners for operations under 200ms

### Anti-Patterns to Avoid

1. **No context**: Spinner without indication of what's loading
   ```jsx
   // ❌ Bad
   <Spinner />

   // ✅ Good
   <VStack>
     <Spinner label="Loading your profile..." />
     <Text>Loading your profile...</Text>
   </VStack>
   ```

2. **Blocking entire UI unnecessarily**: Use localized spinners when possible
   ```jsx
   // ❌ Bad - blocks entire page
   {isLoading && <FullPageSpinner />}

   // ✅ Good - only blocks relevant section
   <Box>
     {isLoading ? <Spinner /> : <Content />}
   </Box>
   ```

3. **Multiple spinners for same operation**: Confusing for users
   ```jsx
   // ❌ Bad
   <VStack>
     <Spinner />
     <Spinner />
     <Spinner />
   </VStack>

   // ✅ Good
   <Spinner size="lg" />
   ```

## Comparison Notes

### Unique Features

1. **Tight theme integration**: Chakra's Spinner seamlessly integrates with the design system
2. **CSS variable approach (v3)**: Modern, performant customization
3. **Accessible by default**: Built-in ARIA support without configuration
4. **Composition friendly**: Works well with Chakra's layout components

### Compared to Typical Loaders

**Strengths:**
- Built-in accessibility (many libraries require manual ARIA setup)
- Consistent sizing system aligned with Chakra's design tokens
- Theme-aware out of the box
- Minimal bundle size impact (especially v3 without Framer Motion)

**Limitations:**
- Limited to circular spinner pattern (no linear progress, no dots animation)
- No built-in determinate progress indicator (use Progress component instead)
- Customization beyond props requires CSS variables/theme overrides

### Framework Evolution

The v2 → v3 migration reflects broader web development trends:
- **Move away from animation libraries**: CSS animations over JavaScript
- **CSS variables over props**: More flexible, better performance
- **Simplified API**: Fewer props, clearer naming (`borderWidth` vs `thickness`)
- **Better tree-shaking**: Smaller bundles in v3

### Integration Ecosystem

Works seamlessly with:
- **Chakra UI components**: VStack, HStack, Box, Flex, Button, etc.
- **React patterns**: Suspense boundaries, error boundaries
- **State management**: Works with any state solution (Redux, Zustand, etc.)
- **Async libraries**: React Query, SWR, Apollo Client

## Version Recommendation

- **Choose v3** for new projects (modern API, better performance)
- **Stay on v2** if migration effort outweighs benefits
- **Plan migration** for active projects to stay current with ecosystem

## Additional Resources

- **v3 Documentation**: https://chakra-ui.com/docs/components/spinner
- **v2 Documentation**: https://v2.chakra-ui.com/docs/components/spinner
- **Migration Guide**: https://www.chakra-ui.com/docs/get-started/migration
- **GitHub Issues**: Search for "Spinner" issues to see common problems and solutions
- **CodeSandbox Examples**: https://codesandbox.io/examples/package/@chakra-ui/spinner

---

**Last Updated**: 2025-01-04
**Research Coverage**: Both Chakra UI v2 and v3
**Status**: ✅ Comprehensive
