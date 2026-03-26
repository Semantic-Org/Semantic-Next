# HeroUI - Tooltip Component

## Component Overview

The HeroUI Tooltip component provides a brief, informative message that appears when a user interacts with an element. It's designed as a lightweight overlay solution for contextual help text and additional information, built on React Aria's `useTooltipTrigger` hook and reusing popover styling for consistency.

**Key Purpose**: Display contextual help and additional information on hover or focus without cluttering the interface.

**Common Use Cases**:
- Icon button labels and explanations
- Field descriptions and input hints
- Additional context for truncated text
- Feature explanations in compact interfaces
- Status indicators with detailed information
- Keyboard shortcut hints
- Disabled element explanations
- Glossary terms and definitions

---

## Usage Patterns

### Basic Usage

The basic tooltip wraps a trigger element (typically a button) and displays content on hover or focus.

**Minimal Example:**
```jsx
import { Tooltip, Button } from "@heroui/react";

<Tooltip content="I am a tooltip">
  <Button>Hover me</Button>
</Tooltip>
```

**Key Points**:
- Wrap the trigger element with `<Tooltip>`
- Use the `content` prop for tooltip text
- No additional configuration needed for basic functionality
- Shows on hover with default 0ms delay
- Hides with 500ms delay after mouse leaves

### Variants/Styles

HeroUI provides color variants through the `color` prop to match different UI contexts:

**Available Color Variants:**
- `"default"` (default): Standard neutral styling
- `"primary"`: Matches primary brand color
- `"secondary"`: Secondary brand color
- `"success"`: Green/success color
- `"warning"`: Orange/warning color
- `"danger"`: Red/error color

**Example:**
```jsx
// Primary variant
<Tooltip color="primary" content="Primary tooltip">
  <Button color="primary">Primary</Button>
</Tooltip>

// Success variant
<Tooltip color="success" content="Action completed successfully">
  <Button color="success">Success</Button>
</Tooltip>

// Danger variant
<Tooltip color="danger" content="This action is destructive">
  <Button color="danger">Delete</Button>
</Tooltip>

// Warning variant
<Tooltip color="warning" content="Proceed with caution">
  <Button color="warning">Warning</Button>
</Tooltip>
```

### States

The tooltip supports multiple interactive states:

**Tooltip States:**
- **Closed/Hidden**: Default state, tooltip not visible
- **Open/Visible**: Tooltip is displayed (tracked with `data-open` attribute)
- **Disabled**: Tooltip cannot be triggered (tracked with `data-disabled` attribute)
- **Hover**: Mouse is over trigger element
- **Focus**: Trigger has keyboard focus

**Controlled State:**
```jsx
import { useState } from "react";

// Controlled open/close state
const [isOpen, setIsOpen] = useState(false);

<Tooltip
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  content="Controlled tooltip"
>
  <Button onClick={() => setIsOpen(!isOpen)}>
    Toggle Tooltip
  </Button>
</Tooltip>

// Programmatically control tooltip
<Button onClick={() => setIsOpen(true)}>Show Tooltip</Button>
<Button onClick={() => setIsOpen(false)}>Hide Tooltip</Button>
```

**Disabled State:**
```jsx
// Disable tooltip interaction
<Tooltip isDisabled content="This won't appear">
  <Button>Disabled Tooltip</Button>
</Tooltip>
```

### Sizing Options

HeroUI provides sizing control through the `size` prop which affects font size:

**Available Sizes:**
- `"sm"`: Small text size
- `"md"` (default): Medium text size
- `"lg"`: Large text size

**Example:**
```jsx
// Small tooltip
<Tooltip size="sm" content="Small tooltip text">
  <Button>Small</Button>
</Tooltip>

// Medium (default)
<Tooltip size="md" content="Medium tooltip text">
  <Button>Medium</Button>
</Tooltip>

// Large tooltip
<Tooltip size="lg" content="Large tooltip text">
  <Button>Large</Button>
</Tooltip>
```

**Additional Size Controls:**

**Border Radius:**
```jsx
// Control corner roundness
<Tooltip radius="none" content="Sharp corners">
  <Button>None</Button>
</Tooltip>

<Tooltip radius="sm" content="Small radius">
  <Button>Small</Button>
</Tooltip>

<Tooltip radius="md" content="Medium radius (default)">
  <Button>Medium</Button>
</Tooltip>

<Tooltip radius="lg" content="Large radius">
  <Button>Large</Button>
</Tooltip>

<Tooltip radius="full" content="Fully rounded">
  <Button>Full</Button>
</Tooltip>
```

**Shadow Depth:**
```jsx
// Control shadow elevation
<Tooltip shadow="none" content="No shadow">
  <Button>None</Button>
</Tooltip>

<Tooltip shadow="sm" content="Small shadow (default)">
  <Button>Small</Button>
</Tooltip>

<Tooltip shadow="md" content="Medium shadow">
  <Button>Medium</Button>
</Tooltip>

<Tooltip shadow="lg" content="Large shadow">
  <Button>Large</Button>
</Tooltip>
```

### Layout & Positioning

**Placement Options:**

HeroUI provides 12 positioning options through the `placement` prop:

```jsx
// Basic directions
<Tooltip placement="top" content="Top">
  <Button>Top</Button>
</Tooltip>

<Tooltip placement="bottom" content="Bottom">
  <Button>Bottom</Button>
</Tooltip>

<Tooltip placement="left" content="Left">
  <Button>Left</Button>
</Tooltip>

<Tooltip placement="right" content="Right">
  <Button>Right</Button>
</Tooltip>

// With alignment variants
<Tooltip placement="top-start" content="Top left aligned">
  <Button>Top Start</Button>
</Tooltip>

<Tooltip placement="top-end" content="Top right aligned">
  <Button>Top End</Button>
</Tooltip>

<Tooltip placement="bottom-start" content="Bottom left aligned">
  <Button>Bottom Start</Button>
</Tooltip>

<Tooltip placement="bottom-end" content="Bottom right aligned">
  <Button>Bottom End</Button>
</Tooltip>

<Tooltip placement="left-start" content="Left top aligned">
  <Button>Left Start</Button>
</Tooltip>

<Tooltip placement="left-end" content="Left bottom aligned">
  <Button>Left End</Button>
</Tooltip>

<Tooltip placement="right-start" content="Right top aligned">
  <Button>Right Start</Button>
</Tooltip>

<Tooltip placement="right-end" content="Right bottom aligned">
  <Button>Right End</Button>
</Tooltip>
```

**Offset Control:**
```jsx
// Distance from trigger element (default: 7px)
<Tooltip offset={0} content="No spacing">
  <Button>No Offset</Button>
</Tooltip>

<Tooltip offset={15} content="15px spacing">
  <Button>Large Offset</Button>
</Tooltip>

<Tooltip offset={30} content="30px spacing">
  <Button>Extra Large Offset</Button>
</Tooltip>
```

**Automatic Positioning:**
```jsx
// Auto-flip on overflow (default: true)
<Tooltip shouldFlip={true} placement="top" content="Will flip if no space">
  <Button>Auto-flip Enabled</Button>
</Tooltip>

// Disable auto-flip
<Tooltip shouldFlip={false} placement="top" content="Fixed position">
  <Button>No Auto-flip</Button>
</Tooltip>
```

### Content & Structure

**Basic Text Content:**
```jsx
<Tooltip content="Simple text tooltip">
  <Button>Hover me</Button>
</Tooltip>
```

**With Arrow Indicator:**
```jsx
<Tooltip showArrow={true} content="Tooltip with arrow pointer">
  <Button>With Arrow</Button>
</Tooltip>

// Arrow with different placements
<Tooltip showArrow={true} placement="right" content="Arrow on left">
  <Button>Right Arrow</Button>
</Tooltip>
```

**Complex Content:**
```jsx
<Tooltip
  content={
    <div className="flex flex-col gap-2">
      <p className="font-semibold">Feature Name</p>
      <p className="text-sm">Detailed description of the feature</p>
      <code className="text-xs">Keyboard: Ctrl+K</code>
    </div>
  }
>
  <Button>Rich Content</Button>
</Tooltip>
```

**Multi-line Content:**
```jsx
<Tooltip
  content={
    <>
      <p>Line 1: Main information</p>
      <p>Line 2: Additional details</p>
      <p>Line 3: Further context</p>
    </>
  }
>
  <Button>Multi-line</Button>
</Tooltip>
```

### Interactive Features

**Delay Control:**
```jsx
// Open delay (ms)
<Tooltip delay={1000} content="Wait 1 second">
  <Button>Delayed Open</Button>
</Tooltip>

// Close delay (default: 500ms)
<Tooltip closeDelay={1000} content="Stays visible longer">
  <Button>Delayed Close</Button>
</Tooltip>

// Instant appearance, no close delay
<Tooltip delay={0} closeDelay={0} content="Instant response">
  <Button>Instant</Button>
</Tooltip>

// Long delay for secondary hints
<Tooltip delay={2000} content="Optional information">
  <Button>Long Delay</Button>
</Tooltip>
```

**Trigger Behavior:**
```jsx
// Default: hover and focus
<Tooltip content="Hover or focus">
  <Button>Default Trigger</Button>
</Tooltip>

// Works with any focusable element
<Tooltip content="Input field help">
  <input type="text" placeholder="Type here" />
</Tooltip>

// Icon buttons (common use case)
import { InfoIcon } from "lucide-react";

<Tooltip content="Additional information">
  <Button isIconOnly>
    <InfoIcon />
  </Button>
</Tooltip>
```

**Disabled Element Tooltips:**
```jsx
// Show tooltip on disabled elements
<Tooltip content="This feature requires premium account">
  <div>
    <Button isDisabled>Premium Feature</Button>
  </div>
</Tooltip>
```

**Keyboard Dismissal:**
```jsx
// Default: Escape key closes tooltip
<Tooltip content="Press ESC to close">
  <Button>Dismissible</Button>
</Tooltip>

// Disable keyboard dismissal
<Tooltip isKeyboardDismissDisabled content="Cannot dismiss with keyboard">
  <Button>No ESC Close</Button>
</Tooltip>
```

### Animation & Transitions

**Custom Motion Props:**
```jsx
<Tooltip
  motionProps={{
    variants: {
      enter: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.15,
          ease: "easeOut"
        }
      },
      exit: {
        opacity: 0,
        y: -10,
        transition: {
          duration: 0.1,
          ease: "easeIn"
        }
      }
    }
  }}
  content="Custom animation"
>
  <Button>Animated Tooltip</Button>
</Tooltip>
```

**Disable Animation:**
```jsx
// Remove all animations
<Tooltip disableAnimation content="No animation">
  <Button>Static Appearance</Button>
</Tooltip>
```

**Animation Features:**
- Built on Framer Motion
- Independent enter/exit timing
- Customizable easing functions
- Smooth fade and slide effects
- Opacity transitions

### Integration Patterns

**With Custom Styling:**
```jsx
<Tooltip
  classNames={{
    base: "bg-gradient-to-r from-pink-500 to-yellow-500",
    content: "text-white font-bold py-2 px-4",
  }}
  content="Custom styled tooltip"
>
  <Button>Custom Style</Button>
</Tooltip>

// Arrow styling
<Tooltip
  showArrow
  classNames={{
    arrow: "bg-blue-500"
  }}
  content="Custom arrow color"
>
  <Button>Custom Arrow</Button>
</Tooltip>
```

**Data Attribute Styling:**
```jsx
// Use data attributes for state-based styling
<Tooltip
  className="
    data-[open=true]:opacity-100
    data-[placement=top]:mb-2
    data-[placement=bottom]:mt-2
  "
  content="State-based styling"
>
  <Button>Data Attributes</Button>
</Tooltip>
```

**With Icons:**
```jsx
import { HelpCircle, AlertTriangle, CheckCircle } from "lucide-react";

// Help icon
<Tooltip content="Click for more information">
  <Button isIconOnly variant="light">
    <HelpCircle size={20} />
  </Button>
</Tooltip>

// Warning indicator
<Tooltip color="warning" content="This action cannot be undone">
  <Button isIconOnly color="warning" variant="light">
    <AlertTriangle size={20} />
  </Button>
</Tooltip>

// Status indicator
<Tooltip color="success" content="All systems operational">
  <Button isIconOnly color="success" variant="light">
    <CheckCircle size={20} />
  </Button>
</Tooltip>
```

**With Forms:**
```jsx
import { Input } from "@heroui/react";

<div className="flex items-center gap-2">
  <Input label="Email" type="email" />
  <Tooltip content="We'll never share your email">
    <Button isIconOnly variant="light">
      <InfoIcon size={16} />
    </Button>
  </Tooltip>
</div>
```

**In Tables/Lists:**
```jsx
<table>
  <tbody>
    {users.map(user => (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>
          <Tooltip content={user.email}>
            <Button variant="light" size="sm">
              View Email
            </Button>
          </Tooltip>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

### Accessibility Features

**Keyboard Navigation:**
- **Tab**: Navigate to trigger element
- **Enter/Space**: Activate trigger (if button)
- **Escape**: Dismiss tooltip (unless `isKeyboardDismissDisabled`)
- **Focus**: Shows tooltip automatically on focus

**ARIA Attributes:**
```jsx
// Automatically managed by HeroUI
// aria-describedby - Links trigger to tooltip content
// role="tooltip" - Identifies element as tooltip
// Native tooltip behavior - Smart delay on subsequent tooltips
```

**Screen Reader Support:**
```jsx
// Content is announced when tooltip appears
// Associated with trigger via aria-describedby
<Tooltip content="Save your changes">
  <Button>Save</Button>
</Tooltip>
// Screen reader announces: "Save button, Save your changes"
```

**Focus Management:**
- Cross-browser focus normalization
- Visible focus indicators
- Tooltip appears on keyboard focus
- Focus trap not applied (tooltip dismisses on focus loss)

---

## Key Properties/Props

### Tooltip Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode[]` | Required | Trigger element(s) |
| `content` | `ReactNode` | - | Tooltip body content |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Font size control |
| `color` | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | Color theme variant |
| `radius` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | Border radius |
| `shadow` | `"none" \| "sm" \| "md" \| "lg"` | `"sm"` | Shadow depth |
| `placement` | `TooltipPlacement` | `"top"` | Position relative to trigger |
| `delay` | `number` | `0` | Open delay in milliseconds |
| `closeDelay` | `number` | `500` | Close delay in milliseconds |
| `offset` | `number` | `7` | Distance from trigger in pixels |
| `showArrow` | `boolean` | `false` | Display arrow pointer |
| `shouldFlip` | `boolean` | `true` | Auto-flip on overflow |
| `isOpen` | `boolean` | - | Controlled open state |
| `isDisabled` | `boolean` | `false` | Disable tooltip |
| `disableAnimation` | `boolean` | `false` | Remove animations |
| `isKeyboardDismissDisabled` | `boolean` | `false` | Prevent ESC key dismissal |
| `onOpenChange` | `(isOpen: boolean) => void` | - | Callback when open state changes |
| `motionProps` | `MotionProps` | - | Framer Motion animation configuration |
| `classNames` | `object` | - | Override component classes |

### Placement Options

Full list of `placement` values:
- `"top"`
- `"top-start"`
- `"top-end"`
- `"bottom"`
- `"bottom-start"`
- `"bottom-end"`
- `"left"`
- `"left-start"`
- `"left-end"`
- `"right"`
- `"right-start"`
- `"right-end"`

### ClassNames Slots

| Slot | Description |
|------|-------------|
| `base` | Main tooltip wrapper |
| `content` | Content container |
| `arrow` | Arrow element (responds to `data-[placement=...]`) |

### Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-open` | Present when tooltip is visible |
| `data-placement` | Current placement value |
| `data-disabled` | Present when disabled |

---

## Code Examples

### Example 1: Icon Button Tooltips

```jsx
import { Tooltip, Button } from "@heroui/react";
import { Save, Download, Share, Trash } from "lucide-react";

export default function IconButtonTooltips() {
  return (
    <div className="flex gap-2">
      <Tooltip content="Save changes">
        <Button isIconOnly color="primary" variant="light">
          <Save size={20} />
        </Button>
      </Tooltip>

      <Tooltip content="Download file">
        <Button isIconOnly color="default" variant="light">
          <Download size={20} />
        </Button>
      </Tooltip>

      <Tooltip content="Share with others">
        <Button isIconOnly color="success" variant="light">
          <Share size={20} />
        </Button>
      </Tooltip>

      <Tooltip content="Delete permanently" color="danger">
        <Button isIconOnly color="danger" variant="light">
          <Trash size={20} />
        </Button>
      </Tooltip>
    </div>
  );
}
```

### Example 2: Tooltip with Custom Content

```jsx
import { Tooltip, Button, Chip } from "@heroui/react";

export default function RichContentTooltip() {
  return (
    <Tooltip
      showArrow
      content={
        <div className="px-1 py-2">
          <div className="text-small font-bold">Feature Details</div>
          <div className="text-tiny">
            This feature includes:
            <ul className="list-disc ml-4 mt-1">
              <li>Real-time updates</li>
              <li>Cloud synchronization</li>
              <li>Team collaboration</li>
            </ul>
          </div>
          <div className="mt-2">
            <Chip size="sm" color="primary">Premium</Chip>
          </div>
        </div>
      }
    >
      <Button variant="bordered">Premium Feature</Button>
    </Tooltip>
  );
}
```

### Example 3: Positioning Variations

```jsx
import { Tooltip, Button } from "@heroui/react";

export default function TooltipPositions() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-2">
        <Tooltip placement="top-start" content="Top Start" showArrow>
          <Button>Top Start</Button>
        </Tooltip>
        <Tooltip placement="top" content="Top Center" showArrow>
          <Button>Top</Button>
        </Tooltip>
        <Tooltip placement="top-end" content="Top End" showArrow>
          <Button>Top End</Button>
        </Tooltip>
      </div>

      <div className="flex gap-4">
        <Tooltip placement="left" content="Left Side" showArrow>
          <Button>Left</Button>
        </Tooltip>
        <Tooltip placement="right" content="Right Side" showArrow>
          <Button>Right</Button>
        </Tooltip>
      </div>

      <div className="flex gap-2">
        <Tooltip placement="bottom-start" content="Bottom Start" showArrow>
          <Button>Bottom Start</Button>
        </Tooltip>
        <Tooltip placement="bottom" content="Bottom Center" showArrow>
          <Button>Bottom</Button>
        </Tooltip>
        <Tooltip placement="bottom-end" content="Bottom End" showArrow>
          <Button>Bottom End</Button>
        </Tooltip>
      </div>
    </div>
  );
}
```

### Example 4: Controlled Tooltip

```jsx
import { Tooltip, Button } from "@heroui/react";
import { useState } from "react";

export default function ControlledTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button onClick={() => setIsOpen(true)} color="primary">
          Show Tooltip
        </Button>
        <Button onClick={() => setIsOpen(false)} color="default">
          Hide Tooltip
        </Button>
        <Button onClick={() => setIsOpen(!isOpen)} color="secondary">
          Toggle Tooltip
        </Button>
      </div>

      <div className="flex justify-center p-8">
        <Tooltip
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          content="This tooltip is controlled programmatically"
          placement="bottom"
        >
          <Button>Controlled Trigger</Button>
        </Tooltip>
      </div>
    </div>
  );
}
```

### Example 5: Delayed Tooltip

```jsx
import { Tooltip, Button } from "@heroui/react";

export default function DelayedTooltips() {
  return (
    <div className="flex gap-4">
      <Tooltip
        delay={0}
        closeDelay={0}
        content="Instant tooltip"
        color="primary"
      >
        <Button>Instant</Button>
      </Tooltip>

      <Tooltip
        delay={500}
        content="500ms delay"
        color="secondary"
      >
        <Button>Short Delay</Button>
      </Tooltip>

      <Tooltip
        delay={1000}
        content="1 second delay"
        color="success"
      >
        <Button>Medium Delay</Button>
      </Tooltip>

      <Tooltip
        delay={2000}
        content="2 second delay - for optional hints"
        color="warning"
      >
        <Button>Long Delay</Button>
      </Tooltip>
    </div>
  );
}
```

### Example 6: Form Field Helpers

```jsx
import { Tooltip, Button, Input } from "@heroui/react";
import { HelpCircle } from "lucide-react";

export default function FormTooltips() {
  return (
    <form className="space-y-4 max-w-md">
      <div className="flex items-end gap-2">
        <Input
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          className="flex-1"
        />
        <Tooltip content="We'll never share your email with anyone">
          <Button isIconOnly variant="light" className="mb-1">
            <HelpCircle size={20} />
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-end gap-2">
        <Input
          type="password"
          label="Password"
          placeholder="Enter password"
          className="flex-1"
        />
        <Tooltip
          content={
            <div className="text-xs">
              <p>Password must contain:</p>
              <ul className="list-disc ml-4">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One number</li>
              </ul>
            </div>
          }
        >
          <Button isIconOnly variant="light" className="mb-1">
            <HelpCircle size={20} />
          </Button>
        </Tooltip>
      </div>
    </form>
  );
}
```

### Example 7: Color Variants

```jsx
import { Tooltip, Button } from "@heroui/react";

export default function ColorVariants() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Tooltip color="default" content="Default tooltip">
        <Button color="default">Default</Button>
      </Tooltip>

      <Tooltip color="primary" content="Primary action">
        <Button color="primary">Primary</Button>
      </Tooltip>

      <Tooltip color="secondary" content="Secondary action">
        <Button color="secondary">Secondary</Button>
      </Tooltip>

      <Tooltip color="success" content="Action completed">
        <Button color="success">Success</Button>
      </Tooltip>

      <Tooltip color="warning" content="Proceed with caution">
        <Button color="warning">Warning</Button>
      </Tooltip>

      <Tooltip color="danger" content="This action is destructive">
        <Button color="danger">Danger</Button>
      </Tooltip>
    </div>
  );
}
```

### Example 8: Disabled Elements with Tooltips

```jsx
import { Tooltip, Button } from "@heroui/react";

export default function DisabledElementTooltips() {
  return (
    <div className="flex gap-4">
      <Tooltip content="Available action">
        <Button color="primary">Enabled</Button>
      </Tooltip>

      {/* Wrap disabled elements in a div for tooltip to work */}
      <Tooltip content="Premium subscription required">
        <div>
          <Button isDisabled color="primary">
            Premium Feature
          </Button>
        </div>
      </Tooltip>

      <Tooltip content="Complete previous step first" color="warning">
        <div>
          <Button isDisabled color="warning">
            Step 2
          </Button>
        </div>
      </Tooltip>
    </div>
  );
}
```

---

## Accessibility Notes

**Keyboard Navigation Implementation:**
- Tab key moves focus to trigger elements
- Tooltip appears automatically on focus
- Escape key dismisses tooltip (unless disabled)
- Works with all focusable elements
- Cross-browser focus management

**ARIA Implementation:**
- `aria-describedby` automatically links tooltip to trigger
- `role="tooltip"` on tooltip content
- Native tooltip behavior with smart delays
- First tooltip has configured delay, subsequent tooltips appear instantly
- Content is exposed to screen readers

**Best Practices for Accessible Tooltips:**
1. Keep content brief and informative
2. Don't put critical information only in tooltips
3. Ensure tooltip content is meaningful
4. Use appropriate color contrast
5. Test with keyboard navigation only
6. Verify screen reader announcements
7. Don't nest interactive elements in tooltips
8. Consider mobile users (tooltips may not work well)
9. Provide alternative ways to access tooltip information on touch devices

**Screen Reader Experience:**
- Tooltip content is announced when trigger receives focus
- Content associated via `aria-describedby`
- Trigger element announced first, then tooltip content
- Example: "Save button, Save your changes to the document"

**Focus Management:**
- Focus indicators visible on keyboard navigation
- Tooltip appears on focus without requiring hover
- Dismisses when focus leaves trigger element
- ESC key provides explicit dismissal option

---

## Common Patterns

1. **Icon Button Labels**: Use tooltips to label icon-only buttons for clarity
2. **Form Field Help**: Provide additional context for form inputs
3. **Truncated Text**: Show full text when hovering over truncated content
4. **Status Indicators**: Explain status icons and badges
5. **Disabled Elements**: Explain why an element is disabled
6. **Keyboard Shortcuts**: Display keyboard shortcuts for actions
7. **Feature Hints**: Provide optional information about features
8. **Glossary Terms**: Define technical terms inline
9. **Action Confirmation**: Show what will happen before clicking
10. **Preview Content**: Display previews of linked content

---

## Related Components

- **Popover**: For more complex interactive content (clicking to open)
- **Dropdown**: For selectable options lists
- **Modal**: For important information requiring user action
- **Alert/Toast**: For system messages and notifications
- **Badge**: For status indicators that may need tooltip explanations
- **Button**: Primary trigger element for tooltips
- **Chip**: Small status/category indicators with tooltips
- **Avatar**: User avatars with name/info tooltips

---

Research completed: 2025-11-06
Component: Tooltip
Framework: HeroUI
Documentation: https://www.heroui.com/docs/components/tooltip
