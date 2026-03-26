# Mantine - HoverCard Usage Patterns

> Last Modified: 2025-11-06

## Component URL
https://mantine.dev/core/hover-card/
Status: ✅ Working
Version: v7.x
Last Verified: 2025-11-06

## Documentation Quality
Comprehensive - Clear documentation with practical examples, thorough prop coverage, TypeScript support, and focus on hover-specific use cases. Includes important accessibility guidance about appropriate usage scenarios.

## Component Definition
- **Core purpose**: Displays floating content when hovering over a target element, optimized specifically for hover interactions with built-in delay management
- **Mental model**: A hover-triggered popover that remains visible while the cursor is over either the trigger or dropdown, with automatic dismissal when the mouse leaves both areas
- **Semantic meaning**: Communicates supplementary or contextual information that appears on hover, explicitly designed for non-essential content that enhances but is not required for understanding

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `openDelay={200}`, `withArrow={true}`)
- **Composed**: Via composition/children (e.g., `<HoverCard.Dropdown>...</HoverCard.Dropdown>`)
- **Grouped**: Via HoverCard.Group for synchronized timing

## Trigger Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Hover trigger | ✅ | Native | Primary and only trigger - automatic hover detection with delay management |
| openDelay | ✅ | Native | Milliseconds before popover appears after hover begins |
| closeDelay | ✅ | Native | Milliseconds before popover disappears after hover ends |
| Synchronized delays | ✅ | Composed | `HoverCard.Group` syncs delay timing across multiple HoverCard instances |
| Click trigger | ❌ | Not Supported | Hover-only component, use Popover for click interactions |
| Focus trigger | ❌ | Not Supported | Not keyboard accessible by design |
| Manual control | ❌ | Not Supported | No controlled state props, fully automatic hover behavior |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Children can include text via `<Text>` or raw strings |
| Rich content | ✅ | Composed | `HoverCard.Dropdown` accepts any JSX - components, layouts, media |
| Interactive content | ⚠️ | Composed | Buttons and links supported, but inputs discouraged (not keyboard accessible) |
| Grouped content | ✅ | Composed | Complex layouts with `Group`, `Stack`, `Avatar`, etc. |
| Non-essential content | ✅ | Native | Designed specifically for supplementary information |
| Essential content | ❌ | Not Supported | Not appropriate for critical information (accessibility limitation) |

## Positioning Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Position control | ✅ | Native | Standard positioning options (top, bottom, left, right, with variants) |
| Arrow indicator | ✅ | Native | `withArrow` prop shows directional arrow |
| Width control | ✅ | Native | Fixed width via `width` prop |
| Shadow/elevation | ✅ | Native | `shadow` prop for visual depth (e.g., `shadow="md"`) |
| Floating UI integration | ✅ | Native | Built on same Floating UI foundation as Popover |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Auto-show on hover | ✅ | Native | Automatically shows after `openDelay` milliseconds |
| Auto-hide on leave | ✅ | Native | Automatically hides after `closeDelay` milliseconds when cursor leaves both target and dropdown |
| Hover persistence | ✅ | Native | Remains visible when hovering over either trigger or dropdown content |
| Portal rendering | ✅ | Native | Renders in portal like Popover |
| Controlled state | ❌ | Not Supported | No `opened`/`onChange` props, fully automatic |
| Click outside behavior | N/A | Not Applicable | Hover-based component doesn't need click-outside handling |
| Escape key close | ❌ | Not Supported | Not keyboard accessible by design |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Keyboard navigation | ❌ | Not Supported | "HoverCard is ignored by screen readers and cannot be activated with keyboard" |
| Mouse hover | ✅ | Native | Primary interaction method |
| Touch devices | ⚠️ | Limited | Hover doesn't translate well to touch interfaces |
| Accessibility | ⚠️ | Limited | Explicitly not accessible - "use it to display only additional information that is not required to understand the context" |
| Screen readers | ❌ | Not Supported | Intentionally ignored by assistive technology |
| Interactive elements | ⚠️ | Partial | Links and buttons work, but inputs not recommended |

## Code Examples

### Basic HoverCard
```tsx
import { HoverCard, Button, Text, Group, Avatar } from '@mantine/core';

function Demo() {
  return (
    <Group position="center">
      <HoverCard width={280} shadow="md">
        <HoverCard.Target>
          <Avatar
            src="https://avatars.githubusercontent.com/u/79146003?s=200&v=4"
            radius="xl"
          />
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">
            Hover card content appears when you hover over the avatar
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
}
```

### With Custom Delays
```tsx
import { HoverCard, Button, Text } from '@mantine/core';

function Demo() {
  return (
    <HoverCard
      width={280}
      shadow="md"
      openDelay={500}    // Wait 500ms before showing
      closeDelay={200}   // Wait 200ms before hiding
    >
      <HoverCard.Target>
        <Button variant="subtle">Hover with delays</Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">
          This card appears after 500ms and closes after 200ms delay
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
```

### Rich Content with User Profile
```tsx
import { HoverCard, Avatar, Text, Group, Anchor, Stack } from '@mantine/core';

function Demo() {
  return (
    <HoverCard width={320} shadow="md" withArrow>
      <HoverCard.Target>
        <Avatar
          src="https://avatars.githubusercontent.com/u/79146003?s=200&v=4"
          radius="xl"
        />
      </HoverCard.Target>

      <HoverCard.Dropdown>
        <Group>
          <Avatar
            src="https://avatars.githubusercontent.com/u/79146003?s=200&v=4"
            radius="xl"
            size="lg"
          />
          <Stack spacing={5}>
            <Text size="sm" weight={700}>
              Mantine UI
            </Text>
            <Text size="xs" color="dimmed">
              @mantinedev
            </Text>
          </Stack>
        </Group>

        <Text size="sm" mt="md">
          A fully featured React components library with over 100 customizable
          components and hooks
        </Text>

        <Group mt="md" spacing="xl">
          <div>
            <Text size="xs" color="dimmed">
              Followers
            </Text>
            <Text size="sm" weight={500}>
              12.4K
            </Text>
          </div>
          <div>
            <Text size="xs" color="dimmed">
              Following
            </Text>
            <Text size="sm" weight={500}>
              89
            </Text>
          </div>
        </Group>

        <Anchor href="https://mantine.dev" target="_blank" mt="md" size="sm">
          Visit profile
        </Anchor>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
```

### HoverCard.Group for Synchronized Timing
```tsx
import { HoverCard, Group, Avatar, Text } from '@mantine/core';

function Demo() {
  return (
    <HoverCard.Group openDelay={300} closeDelay={100}>
      <Group position="center" spacing="xl">
        <HoverCard width={280} shadow="md">
          <HoverCard.Target>
            <Avatar src="user1.jpg" radius="xl" />
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">User 1 profile info</Text>
          </HoverCard.Dropdown>
        </HoverCard>

        <HoverCard width={280} shadow="md">
          <HoverCard.Target>
            <Avatar src="user2.jpg" radius="xl" />
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">User 2 profile info</Text>
          </HoverCard.Dropdown>
        </HoverCard>

        <HoverCard width={280} shadow="md">
          <HoverCard.Target>
            <Avatar src="user3.jpg" radius="xl" />
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">User 3 profile info</Text>
          </HoverCard.Dropdown>
        </HoverCard>
      </Group>
    </HoverCard.Group>
  );
}
```

### With Arrow and Shadow
```tsx
import { HoverCard, Text, Mark } from '@mantine/core';

function Demo() {
  return (
    <Text>
      Hover over{' '}
      <HoverCard width={200} shadow="lg" withArrow>
        <HoverCard.Target>
          <Mark>highlighted text</Mark>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">
            Additional context appears when hovering
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
      {' '}to see more information.
    </Text>
  );
}
```

### With Interactive Content
```tsx
import { HoverCard, Button, Text, Anchor, Stack } from '@mantine/core';

function Demo() {
  return (
    <HoverCard width={280} shadow="md">
      <HoverCard.Target>
        <Button variant="subtle">Hover for actions</Button>
      </HoverCard.Target>

      <HoverCard.Dropdown>
        <Stack spacing="sm">
          <Text size="sm">Quick actions available:</Text>
          <Anchor href="#view" size="sm">View details</Anchor>
          <Anchor href="#edit" size="sm">Edit item</Anchor>
          <Anchor href="#share" size="sm">Share</Anchor>
          <Button size="xs" variant="light">
            Take action
          </Button>
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
```

### Custom Target Component
```tsx
import { forwardRef } from 'react';
import { HoverCard, Text } from '@mantine/core';

// Custom component must forward ref
const CustomTarget = forwardRef<HTMLDivElement, { label: string }>(
  ({ label, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        padding: '8px 16px',
        border: '2px solid #228be6',
        borderRadius: 4,
        cursor: 'pointer',
      }}
    >
      {label}
    </div>
  )
);

function Demo() {
  return (
    <HoverCard width={200} shadow="md">
      <HoverCard.Target>
        <CustomTarget label="Hover me" />
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">Content for custom target</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
```

### Positioning Options
```tsx
import { HoverCard, Button, Text, Group } from '@mantine/core';

function Demo() {
  return (
    <Group position="center" spacing="xl">
      <HoverCard position="top" withArrow>
        <HoverCard.Target>
          <Button>Top</Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">Positioned at top</Text>
        </HoverCard.Dropdown>
      </HoverCard>

      <HoverCard position="right" withArrow>
        <HoverCard.Target>
          <Button>Right</Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">Positioned at right</Text>
        </HoverCard.Dropdown>
      </HoverCard>

      <HoverCard position="bottom" withArrow>
        <HoverCard.Target>
          <Button>Bottom</Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">Positioned at bottom</Text>
        </HoverCard.Dropdown>
      </HoverCard>

      <HoverCard position="left" withArrow>
        <HoverCard.Target>
          <Button>Left</Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">Positioned at left</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
}
```

## Notable Features

### Hover-Optimized Design
- Purpose-built for hover interactions, not adapted from click behavior
- Automatic delay management eliminates need for manual state control
- Persistent visibility while hovering over either trigger or dropdown
- Prevents flickering with intelligent hover detection
- No controlled state needed - fully automatic behavior

### Delay Management System
- `openDelay` prevents accidental triggering during quick mouse movements
- `closeDelay` provides grace period for moving between trigger and dropdown
- `HoverCard.Group` synchronizes timing across multiple cards for consistent UX
- Delays configurable per instance or shared via Group
- Default delays tuned for optimal user experience

### Explicit Accessibility Limitations
- Documentation clearly states component is not keyboard accessible
- Designed for supplementary information only, not essential content
- Intentionally ignored by screen readers
- Use Popover component when keyboard access or accessibility is required
- Transparent about limitations rather than claiming false accessibility

### Simplified API
- No controlled state props (opened/onChange) - fully automatic
- No click-outside or escape key handling - hover-focused
- Fewer configuration options than Popover (by design)
- Clear separation of concerns: HoverCard for hover, Popover for everything else
- Intuitive API that matches the hover use case exactly

### Shared Infrastructure with Popover
- Built on same Floating UI foundation
- Consistent positioning API across both components
- Same arrow customization options
- Same portal rendering behavior
- Reuses proven positioning and rendering logic

### Target Element Requirements
- Must be single element or Mantine component (like Popover)
- Strings, fragments, numbers, and multiple elements not supported
- Custom components must forward refs correctly
- Consistent with Mantine's component composition patterns

### Group Synchronization
- `HoverCard.Group` wrapper synchronizes delay timing
- All HoverCards within Group share same openDelay and closeDelay
- Creates consistent hover behavior across related elements
- Useful for lists, galleries, or navigation elements
- Eliminates timing inconsistencies in multi-card layouts

### Content Flexibility
- Accepts any JSX content in dropdown
- Rich layouts with Groups, Stacks, and other Mantine components
- Interactive elements (buttons, links) work within dropdown
- Inputs not recommended (not keyboard accessible)
- Best for preview content, user profiles, contextual information

## Research Notes

- HoverCard is a specialized variant of Popover optimized specifically for hover interactions
- Clear documentation about accessibility limitations (not keyboard accessible, ignored by screen readers)
- Appropriate use case is explicitly defined: "additional information that is not required to understand the context"
- Delay management is first-class feature, not an afterthought
- HoverCard.Group demonstrates thoughtful approach to multi-card scenarios
- Simpler API than Popover reflects focused use case (no controlled state, no click behaviors)
- Built on same Floating UI foundation as Popover ensures consistent positioning
- Documentation emphasizes using Popover when accessibility is required
- Component doesn't try to be everything - embraces its limitations
- Hover persistence (staying visible over dropdown) prevents frustrating UX
- openDelay prevents accidental triggering during quick mouse movements
- closeDelay provides grace period for cursor movement between trigger and dropdown
- No controlled state is feature, not limitation - reduces complexity for common hover case
- Custom target components must forward refs (consistent with Popover pattern)
- Package: @mantine/core (same package as Popover)
- Version: v7.x (same version as Popover)
- TypeScript support is complete and consistent with Popover
- Integration with Mantine's theme system for consistent styling
- Arrow, shadow, and positioning APIs match Popover for familiarity
- Touch device support is naturally limited (hover doesn't translate to touch)
- Component acknowledges this limitation rather than providing workarounds
- Not suitable for forms, critical actions, or essential information
- Perfect for user profiles, previews, tooltips with rich content, contextual help
- Distinguishing characteristic: automatic hover-only trigger with built-in delay management
- Key difference from Popover: no keyboard access, no controlled state, hover-only
- When to choose HoverCard over Popover: supplementary information shown on hover
- When to choose Popover over HoverCard: essential content, keyboard access, click trigger, controlled state

## Key Differences: HoverCard vs Popover

### HoverCard
- **Primary trigger**: Hover only (automatic)
- **Accessibility**: Not keyboard accessible, ignored by screen readers
- **State control**: Fully automatic, no controlled state
- **Use case**: Supplementary, non-essential information
- **Delay management**: Built-in `openDelay` and `closeDelay` props
- **API complexity**: Simplified (fewer props and options)
- **Keyboard support**: None by design
- **Escape key**: Not supported
- **Best for**: User profiles, previews, contextual hints, hover tooltips

### Popover
- **Primary trigger**: Click (with manual hover support)
- **Accessibility**: Full keyboard navigation and ARIA support
- **State control**: Both controlled and uncontrolled modes
- **Use case**: Interactive content, forms, essential information
- **Delay management**: Manual via controlled state
- **API complexity**: Comprehensive (many props and options)
- **Keyboard support**: Full (Space/Enter toggle, Escape close, Tab navigation)
- **Escape key**: Supported with callbacks
- **Best for**: Forms, interactive menus, critical information, accessible content

### When to Use Each
- **Use HoverCard** when content is supplementary and hover interaction is sufficient
- **Use Popover** when content is essential, requires keyboard access, or needs click trigger
- **Use Popover** for accessibility-critical scenarios
- **Use HoverCard** for quick previews and contextual information
