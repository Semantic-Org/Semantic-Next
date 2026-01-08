# Mantine - Popover Usage Patterns

> Last Modified: 2025-11-06

## Component URL
https://mantine.dev/core/popover/
Status: ✅ Working
Version: v7.x
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - Excellent documentation with clear examples, thorough prop coverage, TypeScript support, Floating UI integration details, and practical use cases demonstrating all major features including advanced positioning and middleware configuration.

## Component Definition
- **Core purpose**: Displays floating content relative to a target element with sophisticated positioning and interaction controls
- **Mental model**: A flexible container that positions arbitrary content near a target, managing focus, click-outside behavior, and viewport constraints automatically
- **Semantic meaning**: Communicates supplementary or contextual content that appears on-demand (typically via click) relative to a trigger element, with full accessibility support and keyboard navigation

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `position="top"`, `withArrow={true}`)
- **Composed**: Via composition/children (e.g., `<Popover.Dropdown>...</Popover.Dropdown>`)
- **Controlled**: Via state management (e.g., `opened={state}`, `onChange={handler}`)

## Trigger Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click trigger | ✅ | Native | Default behavior - uncontrolled popovers open/close on click |
| Hover trigger | ✅ | Controlled | Requires controlled state with `onMouseEnter`/`onMouseLeave` handlers |
| Focus trigger | ✅ | Controlled | Via controlled state with `onFocus`/`onBlur` event handlers |
| Manual control | ✅ | Controlled | Full programmatic control via `opened` prop and state management |
| Disabled state | ✅ | Native | `disabled` prop prevents dropdown rendering entirely |
| Context menu | ⚠️ | Controlled | Achievable via controlled state with `onContextMenu` but not a dedicated pattern |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Children can include text via `<Text>` or raw strings |
| Rich content | ✅ | Composed | `Popover.Dropdown` accepts any JSX - components, layouts, media |
| Form elements | ✅ | Native | Full support with `trapFocus` prop for focus management within forms |
| Interactive content | ✅ | Composed | Buttons, links, and interactive elements work naturally |
| Grouped content | ✅ | Composed | Complex layouts with `Group`, `Stack`, `Avatar`, etc. |
| Initial focus | ✅ | Native | `data-autofocus` attribute on elements for auto-focus on open |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| 12 placements | ✅ | Native | `position` prop: `top`, `top-start`, `top-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`, `bottom`, `bottom-start`, `bottom-end` |
| Arrow indicator | ✅ | Native | `withArrow` prop shows directional arrow, customizable via `arrowPosition`, `arrowOffset`, `arrowSize`, `arrowRadius` |
| Offset control | ✅ | Native | Single-axis: `offset={10}` or dual-axis: `offset={{ mainAxis: 10, crossAxis: 5 }}` |
| Width control | ✅ | Native | Fixed width: `width={200}` or match target: `width="target"` |
| Floating UI middleware | ✅ | Native | Full middleware configuration via `middlewares` prop - control flip, shift, inline, size behaviors |
| Viewport constraints | ✅ | Native | Auto-positioning via Floating UI - shift and flip middlewares enabled by default |
| Inline element support | ✅ | Native | `middlewares={{ inline: true }}` for improved positioning with inline targets like `<Mark>` |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click outside close | ✅ | Native | `closeOnClickOutside` prop (default: true), customizable via `clickOutsideEvents` |
| Escape key close | ✅ | Native | Built-in keyboard support - Escape key closes popover |
| Focus trap | ✅ | Native | `trapFocus` prop enables FocusTrap component integration |
| Portal rendering | ✅ | Native | Renders in portal by default, controllable for nested scenarios |
| Controlled state | ✅ | Native | `opened` and `onChange` props for full external control |
| Uncontrolled state | ✅ | Native | Default behavior - internal state management |
| onDismiss callback | ✅ | Native | `onDismiss` prop fires on Escape or click-outside (respects controlled state) |
| Hide when detached | ✅ | Native | `hideDetached` prop (default: true) - hides when target scrolls out of view |
| Overlay backdrop | ✅ | Native | `withOverlay` prop adds backdrop, customizable via `overlayProps` (blur, opacity, color) |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard navigation | ✅ | Native | Space/Enter toggles (on button targets), Escape closes, Tab navigates |
| Focus management | ✅ | Native | Auto-focus via `data-autofocus`, focus trap via `trapFocus`, FocusTrap integration |
| Nested popovers | ⚠️ | Composed | Supported but requires `withinPortal: false` on nested components (Select, DatePicker, etc.) |
| Accessibility | ✅ | Native | Full ARIA support - `role="dialog"`, `aria-labelledby`, `aria-haspopup`, `aria-expanded`, `aria-controls` |
| Animation support | ✅ | Native | Transitions via Mantine's transition system |
| Z-index control | ✅ | Native | `zIndex` prop for stacking context control |
| Shadow/elevation | ✅ | Native | `shadow` prop for visual depth (e.g., `shadow="md"`) |

## Code Examples

### Basic Click Popover
```tsx
import { Popover, Button, Text } from '@mantine/core';

function Demo() {
  return (
    <Popover>
      <Popover.Target>
        <Button>Toggle popover</Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Text size="xs">This is popover content</Text>
      </Popover.Dropdown>
    </Popover>
  );
}
```

### Hover Trigger (Controlled)
```tsx
import { Popover, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover opened={opened}>
      <Popover.Target>
        <Button onMouseEnter={open} onMouseLeave={close}>
          Hover me
        </Button>
      </Popover.Target>

      <Popover.Dropdown style={{ pointerEvents: 'none' }}>
        <Text size="sm">Hover content</Text>
      </Popover.Dropdown>
    </Popover>
  );
}
```

### Positioning and Arrow
```tsx
import { Popover, Button, Text } from '@mantine/core';

function Demo() {
  return (
    <Popover
      position="bottom-start"
      withArrow
      shadow="md"
      arrowPosition="center"
      arrowSize={10}
      arrowRadius={2}
    >
      <Popover.Target>
        <Button>Open positioned popover</Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Text size="xs">Positioned with arrow</Text>
      </Popover.Dropdown>
    </Popover>
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
        <Popover key={pos} position={pos} withArrow>
          <Popover.Target>
            <Button>Position: {pos}</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="xs">Content at {pos}</Text>
          </Popover.Dropdown>
        </Popover>
      ))}
    </>
  );
}
```

### Offset Control
```tsx
// Single axis offset
<Popover offset={20} position="bottom">
  <Popover.Target>
    <Button>20px offset</Button>
  </Popover.Target>
  <Popover.Dropdown>Content with offset</Popover.Dropdown>
</Popover>

// Dual-axis offset
<Popover offset={{ mainAxis: 10, crossAxis: 15 }} position="bottom">
  <Popover.Target>
    <Button>Custom offset</Button>
  </Popover.Target>
  <Popover.Dropdown>Precise positioning</Popover.Dropdown>
</Popover>
```

### Width Configuration
```tsx
// Fixed width
<Popover width={300}>
  <Popover.Target>
    <Button>Fixed width (300px)</Button>
  </Popover.Target>
  <Popover.Dropdown>Fixed width content</Popover.Dropdown>
</Popover>

// Match target width
<Popover width="target">
  <Popover.Target>
    <Button style={{ width: 250 }}>Match target width</Button>
  </Popover.Target>
  <Popover.Dropdown>Width matches target element</Popover.Dropdown>
</Popover>
```

### Form with Focus Trap
```tsx
import { Popover, Button, TextInput } from '@mantine/core';

function Demo() {
  return (
    <Popover trapFocus>
      <Popover.Target>
        <Button>Open form</Button>
      </Popover.Target>

      <Popover.Dropdown>
        <TextInput
          label="Name"
          placeholder="Enter name"
          size="xs"
        />
        <TextInput
          label="Email"
          placeholder="email@example.com"
          size="xs"
          mt="xs"
        />
        <Button size="xs" mt="xs">Submit</Button>
      </Popover.Dropdown>
    </Popover>
  );
}
```

### Rich Content with Groups
```tsx
import { Popover, Button, Avatar, Text, Stack, Group, Anchor } from '@mantine/core';

function Demo() {
  return (
    <Popover width={300} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button>User profile</Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Group>
          <Avatar
            src="https://avatars.githubusercontent.com/u/79146003?s=200&v=4"
            radius="xl"
          />
          <Stack gap={5}>
            <Text size="sm" fw={700}>Mantine</Text>
            <Anchor href="https://github.com/mantinedev" c="dimmed" size="xs">
              @mantinedev
            </Anchor>
          </Stack>
        </Group>
        <Text size="sm" mt="md">
          React components library with native dark theme support
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
}
```

### Controlled State
```tsx
import { useState } from 'react';
import { Popover, Button, Text } from '@mantine/core';

function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <Popover opened={opened} onChange={setOpened}>
      <Popover.Target>
        <Button onClick={() => setOpened((o) => !o)}>
          {opened ? 'Close' : 'Open'} popover
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Text size="xs">Controlled popover content</Text>
        <Button size="xs" mt="xs" onClick={() => setOpened(false)}>
          Close from inside
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
}
```

### Click Outside Behavior
```tsx
// Prevent closing on click outside
<Popover closeOnClickOutside={false}>
  <Popover.Target>
    <Button>Won't close on outside click</Button>
  </Popover.Target>
  <Popover.Dropdown>
    <Text>Click outside won't close this</Text>
  </Popover.Dropdown>
</Popover>

// Custom click-outside events
<Popover clickOutsideEvents={['mouseup', 'touchend']}>
  <Popover.Target>
    <Button>Custom outside events</Button>
  </Popover.Target>
  <Popover.Dropdown>Content</Popover.Dropdown>
</Popover>
```

### onDismiss Callback
```tsx
import { Popover, Button, Text } from '@mantine/core';

function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onDismiss={() => {
        console.log('Popover dismissed');
        setOpened(false);
      }}
    >
      <Popover.Target>
        <Button onClick={() => setOpened(true)}>Open</Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Text>Press Escape or click outside</Text>
      </Popover.Dropdown>
    </Popover>
  );
}
```

### With Overlay Backdrop
```tsx
<Popover
  withOverlay
  overlayProps={{
    zIndex: 10000,
    blur: '8px',
    opacity: 0.6
  }}
  zIndex={10001}
>
  <Popover.Target>
    <Button>Open with overlay</Button>
  </Popover.Target>

  <Popover.Dropdown>
    <Text>Content with blurred backdrop</Text>
  </Popover.Dropdown>
</Popover>
```

### Floating UI Middleware Configuration
```tsx
// Disable specific middleware
<Popover middlewares={{ flip: false, shift: false }}>
  <Popover.Target>
    <Button>No auto-positioning</Button>
  </Popover.Target>
  <Popover.Dropdown>Won't flip or shift</Popover.Dropdown>
</Popover>

// Customize middleware options
<Popover middlewares={{ shift: { padding: 20 } }}>
  <Popover.Target>
    <Button>Custom shift padding</Button>
  </Popover.Target>
  <Popover.Dropdown>20px padding from viewport edge</Popover.Dropdown>
</Popover>

// Enable inline middleware for inline elements
<Popover middlewares={{ inline: true }}>
  <Popover.Target>
    <Mark>Highlighted text</Mark>
  </Popover.Target>
  <Popover.Dropdown>Positioned relative to inline element</Popover.Dropdown>
</Popover>
```

### Initial Focus Management
```tsx
<Popover>
  <Popover.Target>
    <Button>Open form</Button>
  </Popover.Target>

  <Popover.Dropdown>
    <TextInput label="First field" />
    <TextInput label="Auto-focused field" data-autofocus />
    <TextInput label="Third field" />
  </Popover.Dropdown>
</Popover>
```

### Nested Popovers (with Select)
```tsx
import { Popover, Button, Select, DatePickerInput } from '@mantine/core';

function Demo() {
  return (
    <Popover>
      <Popover.Target>
        <Button>Open popover</Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Select
          label="Choose option"
          data={['React', 'Vue', 'Angular']}
          comboboxProps={{ withinPortal: false }}
        />
        <DatePickerInput
          label="Pick date"
          mt="xs"
          popoverProps={{ withinPortal: false }}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
```

### Custom Target Component
```tsx
import { forwardRef } from 'react';

// Target must forward ref
const MyComponent = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  (props, ref) => (
    <div ref={ref} {...props} style={{ padding: 10, border: '1px solid #ccc' }}>
      Custom target element
    </div>
  )
);

function Demo() {
  return (
    <Popover>
      <Popover.Target>
        <MyComponent />
      </Popover.Target>
      <Popover.Dropdown>Content</Popover.Dropdown>
    </Popover>
  );
}
```

### Disabled Popover
```tsx
<Popover disabled>
  <Popover.Target>
    <Button>Disabled popover</Button>
  </Popover.Target>
  <Popover.Dropdown>
    This won't render when disabled
  </Popover.Dropdown>
</Popover>
```

### Hide When Detached
```tsx
// Default behavior - hides when target scrolls out of view
<Popover hideDetached={true}>
  <Popover.Target>
    <Button>Default behavior</Button>
  </Popover.Target>
  <Popover.Dropdown>Hides when scrolled out</Popover.Dropdown>
</Popover>

// Keep visible even when target is detached
<Popover hideDetached={false}>
  <Popover.Target>
    <Button>Always visible</Button>
  </Popover.Target>
  <Popover.Dropdown>Stays visible when scrolled</Popover.Dropdown>
</Popover>
```

## Notable Features

### Floating UI Integration
- Built on Floating UI library for sophisticated positioning
- Full middleware system exposed: `shift`, `flip`, `inline`, `size`
- Auto-positioning with viewport awareness (shift and flip enabled by default)
- Configurable middleware options for fine-grained control
- Handles edge cases like inline elements, scrolling containers, and viewport constraints

### Comprehensive Trigger Options
- Default click-based trigger with internal state management
- Controlled state support for custom triggers (hover, focus, context menu)
- `useDisclosure` hook integration for common trigger patterns
- `disabled` prop for complete interaction prevention
- Works seamlessly with both controlled and uncontrolled patterns

### Rich Content Support
- Accepts any JSX content in `Popover.Dropdown`
- Built-in form support with focus trap integration
- Complex layouts with Groups, Stacks, and other Mantine components
- Initial focus management via `data-autofocus` attribute
- Interactive elements (buttons, links, forms) work naturally

### Advanced Positioning System
- 12 placement options covering all sides and corners
- Customizable arrow with position, size, offset, and radius controls
- Dual-axis offset configuration (mainAxis, crossAxis)
- Width control: fixed pixel values or match target width
- Inline element positioning via `inline` middleware

### Flexible Behavior Controls
- Click-outside close with customizable event types
- Escape key dismissal with `onDismiss` callback
- Focus trap for accessibility and form containment
- Portal rendering by default (customizable for nested scenarios)
- Hide-when-detached behavior for scroll scenarios

### Overlay and Visual Polish
- Optional backdrop overlay with blur, opacity, and color control
- Z-index management for stacking context
- Shadow/elevation via `shadow` prop
- Arrow styling with size, radius, and positioning options
- Seamless integration with Mantine's theme system

### Accessibility Excellence
- Full ARIA support: `role="dialog"`, `aria-labelledby`, `aria-haspopup`, `aria-expanded`, `aria-controls`
- Keyboard navigation: Space/Enter toggle, Escape close, Tab navigation
- Focus management with FocusTrap integration
- Auto-focus support for form elements
- Uncontrolled popovers require button targets for full keyboard support

### Nested Popover Support
- Supports nested popovers with special portal configuration
- Requires `withinPortal: false` on nested components (Select, DatePicker, etc.)
- Handles complex scenarios like dropdowns within popovers
- Maintains proper stacking context and event handling

### Developer Experience
- TypeScript-first with complete type definitions
- Ref forwarding required for custom target components
- Clear error messages (e.g., target must be single element, not fragments)
- Works with both controlled and uncontrolled patterns
- Intuitive API with sensible defaults

### Target Element Requirements
- Must be single element or Mantine component
- Strings, fragments, numbers, and multiple elements throw errors
- Custom components must forward refs correctly
- Button elements recommended for full keyboard support in uncontrolled mode

## Research Notes

- Documentation is exceptional with clear examples for every feature
- Floating UI integration provides industry-standard positioning
- The component strikes excellent balance between simplicity and power
- Middleware configuration exposes advanced positioning without overwhelming API
- Controlled vs uncontrolled patterns are well-documented with clear use cases
- Focus trap integration solves common form-in-popover accessibility challenges
- Nested popover handling shows thoughtful consideration of complex scenarios
- Arrow customization options are more comprehensive than many competitors
- `width="target"` pattern is elegant solution for matching dropdown width
- Overlay with blur effect is polished, not typically seen in basic popover implementations
- The `hideDetached` prop intelligently handles scroll scenarios
- `onDismiss` callback respects controlled state properly
- Target ref forwarding requirement is clearly documented with examples
- `data-autofocus` pattern is simpler than manual focus management
- Click-outside event customization handles edge cases (touch devices, custom events)
- Disabled state prevents rendering entirely (good for performance)
- Package: @mantine/core (part of Mantine v7.x ecosystem)
- Built on proven Floating UI library (successor to Popper.js)
- All code examples are TypeScript-ready and production-tested
- API naming conventions are consistent with broader Mantine ecosystem
- The component's mental model aligns with modern popover/dropdown patterns
- Position naming follows CSS logical properties convention (start/end vs left/right)
- Middleware configuration is powerful escape hatch for advanced use cases
- Portal rendering by default prevents z-index and overflow issues
- FocusTrap integration demonstrates commitment to accessibility
- Component works seamlessly with Mantine's theming and styling systems
- Primary trigger is click-based, making it suitable for interactive UI requiring explicit user action
- Hover support is available but requires manual controlled implementation
