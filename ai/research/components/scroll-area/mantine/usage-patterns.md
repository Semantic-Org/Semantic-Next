# Mantine - ScrollArea Usage Patterns

## Component URL
https://mantine.dev/core/scroll-area/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The Mantine ScrollArea documentation is thorough with detailed API reference, multiple practical examples including programmatic control and keyboard navigation, clear explanations of scrollbar visibility behaviors, and excellent coverage of the ScrollArea.Autosize variant. The documentation effectively demonstrates integration patterns with other Mantine components like Popover and TextInput for common use cases like autocomplete and searchable lists.

## Component Definition
- **Core purpose**: Provides customizable scrollbars for content overflow, enabling styled scroll containers with configurable scrollbar visibility behaviors, bidirectional scrolling support, and programmatic scroll control.
- **Mental model**: A styled wrapper around native scroll behavior that replaces default browser scrollbars with customizable alternatives. Think of it as a "scroll viewport" that can reveal, hide, or show scrollbars based on user interaction patterns (hover, scroll, always, never).
- **Semantic meaning**: Represents a scrollable content region with enhanced visual styling and control. The component maintains the semantic scroll behavior while providing design system integration.

## Pattern Support Levels
- **Native**: Full component support with TypeScript props, theming integration, composition via ScrollArea.Autosize, imperative viewport control via refs, and scroll event monitoring.
- **Composed**: Integrates with other Mantine components (Popover, TextInput, UnstyledButton) for complex patterns like autocomplete, searchable lists, and dropdown menus. Supports consumer-implemented keyboard navigation.
- **CSS-only**: Custom scrollbar styling via Styles API with classNames prop, CSS variables for theming, and integration with Mantine's design token system.

## Core Patterns

### Scrollbar Visibility Behaviors
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Hover-triggered visibility | ✅ | Native | `type="hover"` - scrollbars appear on container hover |
| Scroll-triggered visibility | ✅ | Native | `type="scroll"` - scrollbars appear during active scrolling |
| Auto visibility | ✅ | Native | `type="auto"` - similar to CSS `overflow: auto`, shows when needed |
| Always visible | ✅ | Native | `type="always"` - scrollbars always displayed regardless of overflow |
| Never visible | ✅ | Native | `type="never"` - scrollbars always hidden, content still scrollable |

### Scroll Direction Control
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Vertical only | ✅ | Native | `scrollbars="y"` - disables horizontal scrolling |
| Horizontal only | ✅ | Native | `scrollbars="x"` - disables vertical scrolling |
| Bidirectional | ✅ | Native | Default behavior, both scrollbars enabled when needed |

### Scrollbar Configuration
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Custom scrollbar size | ✅ | Native | `scrollbarSize` prop controls width/height in pixels |
| Hide delay | ✅ | Native | `scrollHideDelay` in milliseconds for hover/scroll types |
| Offset scrollbars | ✅ | Native | `offsetScrollbars` with values: "x", "y", "xy", "present" |
| Overscroll behavior | ✅ | Native | `overscrollBehavior` prop maps to CSS property |

### Programmatic Control
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Viewport ref access | ✅ | Native | `viewportRef` prop provides HTMLDivElement ref for imperative control |
| Scroll to position | ✅ | Native | Via viewport ref: `scrollTo({ top, left, behavior })` |
| Scroll into view | ✅ | Native | Via viewport ref: `element.scrollIntoView()` for list navigation |
| Scroll position monitoring | ✅ | Native | `onScrollPositionChange` callback receives `{x, y}` coordinates |

### Auto-sizing Variant
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ScrollArea.Autosize | ✅ | Native | Automatically creates scrollable container when content exceeds max dimensions |
| Max dimension constraints | ✅ | Native | `mah` (max-height), `maw` (max-width) props |
| Overflow detection | ✅ | Native | `onOverflowChange` callback triggered when content exceeds constraints |

### Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Searchable lists | ✅ | Composed | Combines with TextInput for filtering, common in autocomplete |
| Dropdown menus | ✅ | Composed | Works within Popover/Dropdown for scrollable option lists |
| Keyboard navigation | ✅ | Composed | Consumer implements arrow key navigation with scrollIntoView |
| Lazy loading | ✅ | Composed | Use onScrollPositionChange to detect scroll thresholds |

## Code Examples

### Basic Vertical Scrolling
```tsx
import { ScrollArea } from '@mantine/core';

function Demo() {
  return (
    <ScrollArea h={250}>
      {/* Long content that will scroll */}
    </ScrollArea>
  );
}
```

### Horizontal Scrolling
```tsx
import { ScrollArea, Box } from '@mantine/core';

function Demo() {
  return (
    <ScrollArea w={300} h={200}>
      <Box w={600}>
        {/* Wide content that requires horizontal scrolling */}
      </Box>
    </ScrollArea>
  );
}
```

### Disable Horizontal Scrollbars
```tsx
<ScrollArea w={300} h={200} scrollbars="y">
  <Box w={600}>
    {/* Content - horizontal scrolling disabled */}
  </Box>
</ScrollArea>
```

### Monitor Scroll Position
```tsx
import { useState } from 'react';
import { Text, ScrollArea, Code, Box } from '@mantine/core';

function Demo() {
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });

  return (
    <>
      <ScrollArea
        w={300}
        h={200}
        onScrollPositionChange={onScrollPositionChange}
      >
        <Box w={600}>
          {/* scrollable content */}
        </Box>
      </ScrollArea>

      <Text>
        Scroll position: <Code>{`{ x: ${scrollPosition.x}, y: ${scrollPosition.y} }`}</Code>
      </Text>
    </>
  );
}
```

### Programmatic Scroll Control
```tsx
import { useRef } from 'react';
import { ScrollArea, Button, Stack, Group } from '@mantine/core';

function Demo() {
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight,
      behavior: 'smooth'
    });

  const scrollToCenter = () =>
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight / 2,
      behavior: 'smooth'
    });

  const scrollToTop = () =>
    viewport.current!.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Stack align="center">
      <ScrollArea w={300} h={200} viewportRef={viewport}>
        {/* content */}
      </ScrollArea>

      <Group justify="center">
        <Button onClick={scrollToBottom}>Scroll to bottom</Button>
        <Button onClick={scrollToCenter}>Scroll to center</Button>
        <Button onClick={scrollToTop}>Scroll to top</Button>
      </Group>
    </Stack>
  );
}
```

### Keyboard Navigation with Scroll Into View
```tsx
import { useState, useRef } from 'react';
import { ScrollArea, UnstyledButton, TextInput } from '@mantine/core';

function Demo() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [hovered, setHovered] = useState(-1);

  return (
    <>
      <TextInput
        value={query}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
          setHovered(-1);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHovered((current) => {
              const nextIndex = current + 1 >= filtered.length
                ? current
                : current + 1;
              viewportRef.current
                ?.querySelectorAll('[data-list-item]')
                ?.[nextIndex]?.scrollIntoView({ block: 'nearest' });
              return nextIndex;
            });
          }

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHovered((current) => {
              const nextIndex = current - 1 < 0 ? current : current - 1;
              viewportRef.current
                ?.querySelectorAll('[data-list-item]')
                ?.[nextIndex]?.scrollIntoView({ block: 'nearest' });
              return nextIndex;
            });
          }
        }}
        placeholder="Search items"
      />
      <ScrollArea h={150} type="always" mt="md" viewportRef={viewportRef}>
        {items}
      </ScrollArea>
    </>
  );
}
```

### ScrollArea.Autosize Basic
```tsx
import { useCounter } from '@mantine/hooks';
import { ScrollArea, Button, Group } from '@mantine/core';

function Demo() {
  const [count, handlers] = useCounter(3, { min: 0, max: 10 });
  const content = Array(count)
    .fill(0)
    .map((_, index) => <p key={index}>{lorem}</p>);

  return (
    <>
      <ScrollArea.Autosize mah={300} maw={400} mx="auto">
        {content}
      </ScrollArea.Autosize>

      <Group justify="center" mt="md">
        <Button color="red" onClick={handlers.decrement}>
          Remove paragraph
        </Button>
        <Button onClick={handlers.increment}>
          Add paragraph
        </Button>
      </Group>
    </>
  );
}
```

### ScrollArea.Autosize with Popover (Autocomplete Pattern)
```tsx
import { useState, useRef } from 'react';
import { ScrollArea, Popover, TextInput, UnstyledButton, Text, Box } from '@mantine/core';

function Demo() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState(false);
  const [hovered, setHovered] = useState(-1);

  return (
    <Popover width="target" opened={opened}>
      <Popover.Target>
        <TextInput
          value={query}
          onFocus={() => setOpened(true)}
          onBlur={() => setOpened(false)}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setHovered(-1);
          }}
          placeholder="Search groceries"
        />
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <ScrollArea.Autosize
          viewportRef={viewportRef}
          mah={200}
          type="always"
          scrollbars="y"
        >
          <Box px="xs" py={5}>
            {items.length > 0 ? items : <Text c="dimmed">Nothing found</Text>}
          </Box>
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
}
```

### Custom Scrollbar Styling
```tsx
import { ScrollArea, Box } from '@mantine/core';
import classes from './Demo.module.css';

function Demo() {
  return (
    <ScrollArea
      w={300}
      h={200}
      type="always"
      offsetScrollbars
      classNames={classes}
    >
      <Box w={600}>
        {/* content */}
      </Box>
    </ScrollArea>
  );
}
```

## Styling Approaches

### Mantine Theme Integration
ScrollArea automatically integrates with the Mantine theme system and respects global theme settings for colors, spacing, and light/dark mode.

### Styles API with classNames
Apply custom styles to specific parts of the component using the classNames prop:

```tsx
<ScrollArea
  classNames={{
    root: classes.root,
    viewport: classes.viewport,
    scrollbar: classes.scrollbar,
    thumb: classes.thumb,
    corner: classes.corner,
  }}
>
  {/* content */}
</ScrollArea>
```

**Available Style Selectors**:
- `root` - Root wrapper element
- `viewport` - Scrollable content viewport
- `scrollbar` - Scrollbar track element
- `thumb` - Scrollbar thumb (draggable part)
- `corner` - Corner element where scrollbars meet

### Inline Styles via styles Prop
Apply inline styles to component parts:

```tsx
<ScrollArea
  styles={{
    viewport: { maxHeight: 400 },
    scrollbar: { '&:hover': { backgroundColor: 'lightgray' } },
  }}
>
  {/* content */}
</ScrollArea>
```

### Dimension Controls
Multiple approaches for sizing:

```tsx
// Fixed dimensions
<ScrollArea h={250} w={400}>

// Max dimensions (typically with ScrollArea.Autosize)
<ScrollArea.Autosize mah={300} maw={500}>

// Responsive sizing
<ScrollArea h="50vh" w="100%">
```

### Scrollbar Offset Patterns
Control padding to prevent content overlap:

```tsx
// Offset on all sides when scrollbars present
<ScrollArea offsetScrollbars>

// Offset specific directions
<ScrollArea offsetScrollbars="x">  {/* Horizontal only */}
<ScrollArea offsetScrollbars="y">  {/* Vertical only */}
<ScrollArea offsetScrollbars="xy"> {/* Both directions */}

// Only when scrollbars visible
<ScrollArea offsetScrollbars="present">
```

### Theme-Level Customization
Customize all ScrollArea instances globally:

```tsx
import { MantineProvider, ScrollArea, createTheme } from '@mantine/core';
import classes from './Demo.module.css';

const theme = createTheme({
  components: {
    ScrollArea: ScrollArea.extend({
      classNames: classes,
      defaultProps: {
        type: 'hover',
        scrollbarSize: 10,
        scrollHideDelay: 500,
      },
    }),
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      {/* All ScrollArea components use custom configuration */}
    </MantineProvider>
  );
}
```

## Accessibility Patterns

### Semantic Structure
ScrollArea maintains semantic HTML structure with native scroll behavior, ensuring compatibility with assistive technologies.

### Keyboard Navigation
Full keyboard support for scrolling:

- **Arrow Keys**: Scroll content when viewport is focused
- **Page Up/Down**: Jump larger scroll distances
- **Home/End**: Scroll to start/end of content
- **Tab**: Navigate through focusable elements within scrollable area

### Programmatic Focus Management
The `viewportRef` enables accessible list navigation patterns:

```tsx
// Scroll highlighted item into view
viewportRef.current
  ?.querySelectorAll('[data-list-item]')
  ?.[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
```

Using `block: 'nearest'` ensures minimal scrolling while keeping the element visible.

### Screen Reader Support
- Content within ScrollArea remains accessible to screen readers
- Native scroll behavior preserves ARIA-compliant interactions
- Scrollable regions are announced appropriately

### Focus Indicators
Standard focus indicators work within scroll containers. Custom focus styles can be applied through the Styles API.

### ARIA Considerations
While ScrollArea itself doesn't add specific ARIA attributes, it maintains compatibility with ARIA patterns implemented by consumer code (e.g., `role="listbox"`, `aria-activedescendant` for autocomplete).

## Props/API Reference

### ScrollArea Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'hover' \| 'scroll' \| 'auto' \| 'always' \| 'never'` | `'hover'` | Controls scrollbar visibility behavior |
| `scrollbarSize` | `number` | - | Width/height of scrollbars in pixels |
| `scrollHideDelay` | `number` | `1000` | Delay in milliseconds before hiding scrollbars (hover/scroll types) |
| `offsetScrollbars` | `boolean \| 'x' \| 'y' \| 'xy' \| 'present'` | `false` | Adds padding to prevent content overlap with scrollbars |
| `scrollbars` | `'x' \| 'y' \| 'xy'` | `'xy'` | Controls which scrollbars are enabled |
| `viewportRef` | `React.RefObject<HTMLDivElement>` | - | Ref to access viewport element for programmatic control |
| `onScrollPositionChange` | `(position: { x: number, y: number }) => void` | - | Callback fired when scroll position changes |
| `overscrollBehavior` | `React.CSSProperties['overscrollBehavior']` | - | CSS overscroll-behavior property value |
| `h` | `React.CSSProperties['height']` | - | Height of scroll area |
| `w` | `React.CSSProperties['width']` | - | Width of scroll area |
| `mah` | `React.CSSProperties['maxHeight']` | - | Maximum height |
| `maw` | `React.CSSProperties['maxWidth']` | - | Maximum width |
| `classNames` | `Partial<ScrollAreaClassNames>` | - | Object with className for each style selector |
| `styles` | `Partial<ScrollAreaStyles>` | - | Object with styles for each style selector |

### ScrollArea.Autosize Component Props

Inherits all ScrollArea props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mah` | `React.CSSProperties['maxHeight']` | - | Maximum height - scrolling activates when content exceeds this |
| `maw` | `React.CSSProperties['maxWidth']` | - | Maximum width - scrolling activates when content exceeds this |
| `onOverflowChange` | `(overflow: boolean) => void` | - | Callback triggered when content overflow state changes |

### Viewport Ref Methods

When using `viewportRef`, access standard HTMLDivElement methods:

| Method | Signature | Description |
|--------|-----------|-------------|
| `scrollTo()` | `(options: ScrollToOptions) => void` | Programmatically scroll to position with optional smooth behavior |
| `scrollHeight` | `number` | Total scrollable height (read-only) |
| `scrollWidth` | `number` | Total scrollable width (read-only) |
| `scrollTop` | `number` | Current vertical scroll position |
| `scrollLeft` | `number` | Current horizontal scroll position |
| `querySelectorAll()` | `(selector: string) => NodeList` | Query elements for scrollIntoView navigation |

## Notable Features

### 1. Multiple Visibility Behaviors
Unlike most implementations that offer only "always" or "auto", Mantine provides five distinct scrollbar visibility modes (hover, scroll, auto, always, never), enabling precise control over UX patterns.

### 2. ScrollArea.Autosize Composition
The `.Autosize` variant elegantly handles variable-height content with max constraints, automatically transitioning between non-scrolling and scrolling states. This is particularly useful for dropdowns, popovers, and modals.

### 3. Bidirectional Scroll Control
The `scrollbars` prop enables granular control over scroll directions, supporting vertical-only, horizontal-only, or bidirectional scrolling without CSS workarounds.

### 4. Scroll Position Monitoring
The `onScrollPositionChange` callback provides real-time scroll coordinates, enabling patterns like sticky headers, infinite scroll, and scroll-based animations.

### 5. Viewport Ref for Imperative Control
Direct access to the viewport HTMLDivElement enables sophisticated patterns:
- Programmatic scrolling with smooth behavior
- Scroll-to-element navigation for keyboard controls
- Dynamic scroll calculations (scrollHeight, etc.)
- Element queries for list navigation

### 6. Offset Scrollbar System
The `offsetScrollbars` prop intelligently adds padding to prevent content overlap, with options for directional control and conditional application (only when scrollbars present).

### 7. Seamless Mantine Integration
Full integration with Mantine's theming, Styles API, and component ecosystem. Works naturally within Popover, Modal, and other overlay components.

### 8. CSS-in-JS Styling Flexibility
Comprehensive Styles API with granular selector targeting (root, viewport, scrollbar, thumb, corner) plus support for CSS modules, inline styles, and theme-level customization.

## Research Notes

### Design Philosophy
Mantine's ScrollArea prioritizes developer experience through:
- Clear, descriptive prop names (`type="hover"` vs cryptic flags)
- Composition over configuration (ScrollArea.Autosize for specific use case)
- Direct DOM access via refs (avoids wrapper abstractions)
- TypeScript-first API design

### Common Use Cases Demonstrated
The documentation emphasizes practical patterns:
1. **Autocomplete/Searchable lists** - Integration with TextInput and keyboard navigation
2. **Dropdown menus** - ScrollArea.Autosize within Popovers
3. **Programmatic control** - Button-triggered scrolling with smooth behavior
4. **Content monitoring** - Scroll position tracking for UI feedback

### Performance Considerations
- Uses CSS transforms for smooth scrolling performance
- Scrollbar visibility transitions use efficient CSS animations
- Minimal re-renders when scroll position monitored via callback
- Native scroll behavior ensures browser optimization

### Browser Compatibility
Works across modern browsers with custom scrollbar styling. Falls back gracefully in browsers with limited support.

### Framework-Specific Advantages
The TypeScript-first approach with strict prop types, comprehensive Styles API, and composition patterns (ScrollArea.Autosize) showcase Mantine's React-centric design philosophy. The integration with Mantine hooks (`useCounter`) and components (Popover, UnstyledButton) creates cohesive patterns.

### Limitations
- Custom scrollbars may not perfectly match native OS scrollbars in appearance
- Some mobile browsers may show native scrollbars despite custom styling
- `scrollIntoView` with `block: 'nearest'` has varying browser support for exact behavior

### Best Practices from Documentation
1. Use `type="always"` for searchable/filterable lists to maintain consistent layout
2. Specify `behavior: 'smooth'` in scrollTo for better UX
3. Use `offsetScrollbars` to prevent content shifting when scrollbars appear
4. Prefer ScrollArea.Autosize for variable-height content in popovers
5. Combine with keyboard navigation for accessible list patterns
6. Use `onScrollPositionChange` rather than scroll event listeners for better performance
