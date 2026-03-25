# Mantine - Tooltip Usage Patterns

> Last Modified: 2025-11-06

## Component URL
https://mantine.dev/core/tooltip/
Status: ✅ Working
Version: v7.x / v8.x
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - Excellent documentation with clear examples, thorough prop coverage, TypeScript support, Floating UI integration, and practical use cases demonstrating trigger variations, positioning options, animations, and accessibility features.

## Component Definition
- **Core purpose**: Displays contextual information when users interact with a target element, enhancing UI clarity without cluttering the interface
- **Mental model**: A floating label that appears near a target element on interaction (hover, focus, touch), automatically positioning itself with viewport awareness
- **Semantic meaning**: Communicates supplementary descriptive information that provides context or clarification for an interactive element, following WAI-ARIA tooltip patterns

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `position="top"`, `withArrow={true}`)
- **Composed**: Via composition/children (e.g., `<Tooltip.Group>`, `<Tooltip.Floating>`)
- **Controlled**: Via state management (e.g., `opened={state}`, events configuration)

## Trigger Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Hover trigger | ✅ | Native | Default behavior - enabled via `events={{ hover: true }}` (default) |
| Focus trigger | ⚠️ | Native | Available but disabled by default - enable with `events={{ focus: true }}` for accessibility |
| Touch trigger | ⚠️ | Native | Available but disabled by default - enable with `events={{ touch: true }}` for mobile |
| Manual control | ✅ | Controlled | Full programmatic control via `opened` prop with `onOpenChange` callback |
| Open delay | ✅ | Native | `openDelay` prop in milliseconds delays tooltip appearance |
| Close delay | ✅ | Native | `closeDelay` prop in milliseconds delays tooltip disappearance |
| Click trigger | ❌ | Not Supported | Not designed as click-triggered pattern; use Popover for click interactions |
| Context menu | ❌ | Not Supported | Not applicable for tooltip pattern |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `label` prop accepts string for simple text content |
| Rich content | ✅ | Native | `label` accepts ReactNode - can include components like `<Mark>`, `<Badge>`, etc. |
| Multiline content | ✅ | Native | `multiline` prop enables line breaks; use `w` style prop for width control |
| Inline tooltips | ✅ | Native | `inline` prop optimizes positioning for inline elements like `<Mark>` or `<a>` |
| Single child requirement | ✅ | Native | Tooltip must wrap exactly one child element (no strings, fragments, numbers, or multiple elements) |
| Width control | ✅ | Native | `w` style prop sets tooltip width, particularly useful with `multiline` mode |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| 12 placements | ✅ | Native | `position` prop: `top`, `top-start`, `top-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`, `bottom`, `bottom-start`, `bottom-end` |
| Arrow indicator | ✅ | Native | `withArrow` prop shows directional arrow |
| Arrow positioning | ✅ | Native | `arrowPosition`: `center` (default) or `side` alignment |
| Arrow offset | ✅ | Native | `arrowOffset` fine-tunes arrow placement when `arrowPosition="side"` |
| Arrow sizing | ✅ | Native | `arrowSize` and `arrowRadius` for visual customization |
| Offset control | ✅ | Native | Single-axis: `offset={10}` or dual-axis: `offset={{ mainAxis: 10, crossAxis: 5 }}` |
| Floating variant | ✅ | Composed | `<Tooltip.Floating>` follows mouse cursor during hover interactions |
| Viewport constraints | ✅ | Native | Auto-positioning via Floating UI integration |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Uncontrolled state | ✅ | Native | Default behavior - internal state management based on events |
| Controlled state | ✅ | Native | `opened` prop with `onOpenChange` callback for external control |
| Delay timing | ✅ | Native | `openDelay` and `closeDelay` in milliseconds |
| Grouped delays | ✅ | Composed | `<Tooltip.Group>` shares `openDelay` and `closeDelay` across multiple tooltips |
| Event configuration | ✅ | Native | `events` object: `{ hover: boolean, focus: boolean, touch: boolean }` |
| Color theming | ✅ | Native | `color` prop integrates with Mantine theme palette |
| Animations | ✅ | Native | `transitionProps` configures transition type and duration |
| Target alternative | ✅ | Native | `target` prop accepts CSS selector, HTML element, or ref for non-JSX rendering |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard navigation | ⚠️ | Native | Requires `events={{ focus: true }}` to be enabled (disabled by default) |
| Screen reader support | ⚠️ | Native | ARIA attributes present but focus events disabled by default; enable for full accessibility |
| Accessibility | ✅ | Native | `role="tooltip"` and `aria-describedby` following WAI-ARIA recommendations |
| Ref forwarding | ✅ | Native | Child component must support `ref` via `forwardRef` or custom `refProp` |
| Custom ref prop | ✅ | Native | `refProp` allows specifying custom ref prop name (e.g., `innerRef`) |
| Transition types | ✅ | Native | Multiple transitions: fade, scale, skew, rotate, slide, pop (and directional variants) |
| Z-index control | ⚠️ | Not Documented | Not explicitly mentioned in documentation |
| Portal rendering | ⚠️ | Not Documented | Portal behavior not explicitly documented |

## Code Examples

### Basic Tooltip
```tsx
import { Tooltip, Button } from '@mantine/core';

function Demo() {
  return (
    <Tooltip label="Tooltip text">
      <Button>Hover me</Button>
    </Tooltip>
  );
}
```

### All 12 Position Options
```tsx
function Demo() {
  const positions = [
    'top', 'top-start', 'top-end',
    'left', 'left-start', 'left-end',
    'right', 'right-start', 'right-end',
    'bottom', 'bottom-start', 'bottom-end'
  ];

  return (
    <>
      {positions.map((pos) => (
        <Tooltip key={pos} label={`Position: ${pos}`} position={pos}>
          <Button>{pos}</Button>
        </Tooltip>
      ))}
    </>
  );
}
```

### With Arrow
```tsx
<Tooltip
  label="Tooltip with arrow"
  withArrow
  arrowSize={6}
  arrowRadius={2}
  arrowPosition="center"
>
  <Button>Hover for tooltip</Button>
</Tooltip>
```

### Arrow Side Positioning with Offset
```tsx
<Tooltip
  label="Side arrow with offset"
  withArrow
  arrowPosition="side"
  arrowOffset={10}
>
  <Button>Side arrow</Button>
</Tooltip>
```

### Offset Control
```tsx
// Single axis offset
<Tooltip label="20px offset" offset={20} position="bottom">
  <Button>Single axis</Button>
</Tooltip>

// Dual-axis offset
<Tooltip
  label="Custom offset"
  offset={{ mainAxis: 10, crossAxis: 15 }}
  position="bottom"
>
  <Button>Dual axis</Button>
</Tooltip>
```

### Multiline Tooltip with Width
```tsx
<Tooltip
  multiline
  w={220}
  label="Use this button to save this information in your profile. After you click it, you will be redirected to the settings page."
>
  <Button>Multiline tooltip</Button>
</Tooltip>
```

### With Custom Color
```tsx
<Tooltip label="Custom color" color="blue">
  <Button>Colored tooltip</Button>
</Tooltip>
```

### Controlled State
```tsx
import { useState } from 'react';
import { Tooltip, Button } from '@mantine/core';

function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <Tooltip
      label="Controlled tooltip"
      opened={opened}
      onOpenChange={setOpened}
    >
      <Button onClick={() => setOpened((o) => !o)}>
        {opened ? 'Close' : 'Open'} tooltip
      </Button>
    </Tooltip>
  );
}
```

### Open and Close Delays
```tsx
<Tooltip
  label="Delayed tooltip"
  openDelay={500}
  closeDelay={200}
>
  <Button>Hover with delays</Button>
</Tooltip>
```

### Grouped Tooltips with Shared Delays
```tsx
import { Tooltip, Button, Group } from '@mantine/core';

function Demo() {
  return (
    <Tooltip.Group openDelay={500} closeDelay={100}>
      <Group>
        <Tooltip label="Tooltip 1">
          <Button>Button 1</Button>
        </Tooltip>
        <Tooltip label="Tooltip 2">
          <Button>Button 2</Button>
        </Tooltip>
        <Tooltip label="Tooltip 3">
          <Button>Button 3</Button>
        </Tooltip>
      </Group>
    </Tooltip.Group>
  );
}
```

### Inline Tooltip (for inline elements)
```tsx
import { Tooltip, Mark, Text } from '@mantine/core';

function Demo() {
  return (
    <Text>
      This is some text with an{' '}
      <Tooltip label="Inline tooltip" inline>
        <Mark>inline element</Mark>
      </Tooltip>
      {' '}that has a tooltip.
    </Text>
  );
}
```

### Tooltip.Floating (follows cursor)
```tsx
import { Tooltip, Button } from '@mantine/core';

function Demo() {
  return (
    <Tooltip.Floating label="Floating tooltip">
      <Button style={{ width: 200, height: 100 }}>
        Hover anywhere
      </Button>
    </Tooltip.Floating>
  );
}
```

### Custom Transition
```tsx
<Tooltip
  label="Custom transition"
  transitionProps={{ transition: 'pop', duration: 300 }}
>
  <Button>Pop transition</Button>
</Tooltip>
```

### Available Transitions
```tsx
const transitions = [
  'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right',
  'scale', 'scale-y', 'scale-x',
  'skew-up', 'skew-down',
  'rotate-left', 'rotate-right',
  'slide-down', 'slide-up', 'slide-left', 'slide-right',
  'pop', 'pop-top-left', 'pop-top-right', 'pop-bottom-left', 'pop-bottom-right'
];

function Demo() {
  return (
    <>
      {transitions.map((t) => (
        <Tooltip
          key={t}
          label={`Transition: ${t}`}
          transitionProps={{ transition: t, duration: 300 }}
        >
          <Button>{t}</Button>
        </Tooltip>
      ))}
    </>
  );
}
```

### Custom Ref Prop
```tsx
import { forwardRef } from 'react';

// Component using custom ref prop name
const MyComponent = forwardRef<HTMLDivElement, any>(
  (props, ref) => <div ref={ref} {...props} />
);

// Component using innerRef instead of ref
interface CustomComponentProps {
  innerRef?: React.Ref<HTMLDivElement>;
}

const CustomComponent = ({ innerRef, ...props }: CustomComponentProps) => (
  <div ref={innerRef} {...props}>Custom component</div>
);

function Demo() {
  return (
    <Tooltip label="Works with custom ref" refProp="innerRef">
      <CustomComponent innerRef={undefined} />
    </Tooltip>
  );
}
```

### Target Prop (Alternative to Children)
```tsx
// With CSS selector
<div>
  <button id="hover-me">Hover me</button>
  <Tooltip target="#hover-me" label="Tooltip via selector" />
</div>

// With ref
function Demo() {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <button ref={ref}>Hover me</button>
      <Tooltip target={ref} label="Tooltip via ref" />
    </div>
  );
}

// With HTML element
function Demo() {
  const [element, setElement] = useState<HTMLButtonElement | null>(null);

  return (
    <div>
      <button ref={setElement}>Hover me</button>
      {element && <Tooltip target={element} label="Tooltip via element" />}
    </div>
  );
}
```

### Enable Focus Events for Accessibility
```tsx
<Tooltip
  label="Accessible tooltip"
  events={{ hover: true, focus: true, touch: false }}
>
  <Button>Keyboard accessible</Button>
</Tooltip>
```

### Touch Events for Mobile
```tsx
<Tooltip
  label="Mobile tooltip"
  events={{ hover: true, focus: false, touch: true }}
>
  <Button>Touch-enabled</Button>
</Tooltip>
```

### Rich Content with Components
```tsx
import { Tooltip, Button, Mark, Badge, Text } from '@mantine/core';

function Demo() {
  return (
    <Tooltip
      multiline
      w={200}
      label={
        <>
          <Text size="sm" fw={700}>Rich Content</Text>
          <Text size="xs" mt={4}>
            This tooltip contains <Mark>highlighted text</Mark> and a{' '}
            <Badge size="xs">badge</Badge>.
          </Text>
        </>
      }
    >
      <Button>Rich tooltip</Button>
    </Tooltip>
  );
}
```

## Notable Features

### Floating UI Integration
- Built on Floating UI library for sophisticated auto-positioning
- Viewport-aware positioning prevents tooltips from overflowing screen edges
- Handles edge cases with inline elements via `inline` prop
- Arrow indicator with customizable size, radius, position, and offset

### Event System with Granular Control
- Three independent event types: hover, focus, touch
- Each can be enabled/disabled individually via `events` object
- Hover enabled by default; focus and touch disabled for performance
- Focus events crucial for keyboard accessibility but opt-in
- Touch events separate from hover for mobile optimization

### Delay Management
- Independent `openDelay` and `closeDelay` configuration per tooltip
- `Tooltip.Group` component for shared delay settings across multiple tooltips
- Delays in milliseconds for precise timing control
- Group pattern prevents repeated delays when moving between related tooltips

### Flexible Positioning System
- 12 placement options covering all sides and corners
- Dual-axis offset: `mainAxis` for distance from target, `crossAxis` for slide adjustment
- Arrow with center or side positioning
- `arrowOffset` for fine-tuning when `arrowPosition="side"`
- Auto-positioning handles viewport constraints automatically

### Content and Width Control
- `multiline` prop enables text wrapping
- `w` style prop for explicit width control (essential for multiline)
- `inline` prop optimizes for inline element targets (links, marks, etc.)
- Rich content support via ReactNode in `label` prop
- Single child requirement ensures clean ref forwarding

### Animation System
- Extensive transition library with 20+ premade transitions
- Transitions grouped by type: fade, scale, skew, rotate, slide, pop
- Directional variants for nuanced animations
- `transitionProps` accepts custom transition type and duration
- Built on Mantine's Transition component

### Tooltip Variants
- **Standard Tooltip**: Default hover-triggered tooltip
- **Tooltip.Floating**: Follows mouse cursor during hover
- **Tooltip.Group**: Coordinates delays across multiple tooltips

### Target Flexibility
- Standard: Wrap child element directly
- Selector: Use `target` prop with CSS selector string
- Ref: Use `target` prop with ref object
- Element: Use `target` prop with HTML element reference
- Enables tooltips on elements not rendered as direct children

### Ref Forwarding Requirements
- Child must support `ref` prop (use `forwardRef` for custom components)
- `refProp` allows specifying alternative ref prop name
- Necessary for proper tooltip positioning and event handling
- Clear error messages for missing ref support

### Accessibility Features
- WAI-ARIA compliant with `role="tooltip"` and `aria-describedby`
- Focus events available but disabled by default (performance vs accessibility tradeoff)
- Enable `events={{ focus: true }}` for keyboard navigation support
- Screen reader support when focus events enabled
- `Tooltip.Floating` explicitly ignored by assistive technology

### Performance Considerations
- Focus and touch events disabled by default to reduce overhead
- Event system allows enabling only needed triggers
- Grouped tooltips share timing logic to reduce duplicate delays
- Single child requirement simplifies event handling

### Theming Integration
- `color` prop integrates with Mantine theme palette
- Arrow inherits tooltip color automatically
- Seamless integration with Mantine's design system
- Style props (`w`, etc.) for additional customization

## Research Notes

- Documentation is excellent with clear examples for all major patterns
- Floating UI integration provides industry-standard positioning (same as Popover)
- Event system design balances performance with accessibility (opt-in focus/touch)
- Default focus events disabled is accessibility tradeoff - must be explicitly enabled
- Multiline + width control pattern is common for longer descriptive tooltips
- Arrow customization is comprehensive (size, radius, position, offset)
- Delay system is sophisticated with both individual and grouped patterns
- `Tooltip.Group` solves UX problem of repeated delays between related tooltips
- Inline prop shows attention to edge case positioning challenges
- Transition system offers extensive visual variety beyond basic fade
- Target prop pattern enables non-JSX usage (event listeners on existing DOM)
- Ref forwarding requirement is clearly documented with workarounds
- Single child requirement prevents common composition errors
- `Tooltip.Floating` is niche feature but well-implemented for cursor tracking
- Rich content support via ReactNode makes tooltips more versatile than text-only
- Position naming follows CSS logical properties (start/end vs left/right)
- Offset dual-axis configuration is more precise than single number
- Arrow side positioning with offset is advanced feature not in all tooltip libraries
- Controlled state pattern enables complex interaction flows
- Component works seamlessly with all Mantine components through ref support
- Version 7.x/8.x shows active development and maintenance
- TypeScript-first with complete type definitions
- Clear separation between tooltip (brief labels) and popover (interactive content)
- Package: @mantine/core (part of Mantine ecosystem)
- API naming consistent with broader Mantine patterns
- Focus/touch event defaults show opinionated stance on performance
- Accessibility requires explicit opt-in, which may surprise some developers
- Documentation emphasizes single child requirement to prevent errors
- Multiline + width pattern shows understanding of real-world tooltip needs
- Group component demonstrates thought about tooltip-heavy interfaces
- Arrow implementation appears to be rotated div (same as Popover)
- Transition props leverage shared Mantine animation system
- Color integration shows tooltip as part of larger design system
- Target prop is powerful escape hatch for non-standard DOM structures
- Inline prop solves specific positioning challenge with text-embedded triggers
- Component mental model: "enhancing UI clarity without cluttering interface"
- Floating variant trades accessibility for visual polish (cursor tracking)
- Default hover-only behavior is simplest, most common tooltip pattern
- Documentation quality suggests mature, production-ready component
