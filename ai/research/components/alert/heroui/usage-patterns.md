# HeroUI Alert - Usage Patterns

> Research Date: 2025-11-06
> Component URL: https://www.heroui.com/docs/components/alert

## Component Overview

The Alert component is a foundational UI element in HeroUI that provides temporary notifications delivering concise feedback about actions or events. It serves as a user communication mechanism for displaying important messages, warnings, success confirmations, and error notifications. The component is designed with flexibility in mind, supporting multiple visual variants, semantic colors, and customizable content slots.

Key characteristics:
- Announces to screen readers via ARIA `alert` role
- Supports controlled and uncontrolled visibility patterns
- Optional dismissal functionality with close button
- Slot-based architecture for granular styling
- Semantic color system aligned with message intent

## Core Patterns

### Basic Alert Pattern

```jsx
import {Alert} from "@heroui/react";

export default function App() {
  const title = "This is an alert";
  const description = "Thanks for subscribing to our newsletter!";

  return (
    <Alert description={description} title={title} />
  );
}
```

### Hook-Based Pattern (Advanced)

The `useAlert` hook provides comprehensive control over alert behavior for custom implementations:

```jsx
const {
  title,
  description,
  isClosable,
  domRef,
  handleClose,
  getBaseProps,
  getMainWrapperProps,
  getDescriptionProps,
  getTitleProps,
  getCloseButtonProps,
  color,
  isVisible,
  onClose,
  getAlertIconProps,
} = useAlert({
  title: "Email Sent!!",
  description: "You will get a reply soon",
  classNames: { /* custom styles */ },
});
```

The hook returns:
- State properties (`title`, `description`, `color`, `isVisible`, `isClosable`)
- Event handlers (`handleClose`, `onClose`)
- Prop getter functions for applying props to DOM elements
- DOM reference (`domRef`)

## Props & Configuration

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | ReactNode | — | Alert heading text |
| `description` | ReactNode | — | Supporting message content |
| `color` | `"default"` \| `"primary"` \| `"secondary"` \| `"success"` \| `"warning"` \| `"danger"` | `"default"` | Semantic color theme |
| `variant` | `"solid"` \| `"bordered"` \| `"flat"` \| `"faded"` | `"flat"` | Visual presentation style |
| `radius` | `"none"` \| `"sm"` \| `"md"` \| `"lg"` \| `"full"` | `"md"` | Border radius sizing |
| `icon` | ReactNode | — | Custom icon override |
| `startContent` | ReactNode | — | Leading content slot |
| `endContent` | ReactNode | — | Trailing content/actions |
| `isVisible` | boolean | — | Visibility state control |
| `isClosable` | boolean | `false` | Enable close button |
| `hideIcon` | boolean | `false` | Suppress default icon |
| `hideIconWrapper` | boolean | `false` | Hide icon container |
| `closeButtonProps` | ButtonProps | — | Close button customization |

### Event Handler Props

| Prop | Type | Description |
|------|------|-------------|
| `onClose` | `() => void` | Fires when dismiss button activates |
| `onVisibleChange` | `(isVisible: boolean) => void` | Tracks visibility state changes |

### Styling Props

| Prop | Type | Description |
|------|------|-------------|
| `classNames` | Record<SlotName, string> | Custom classes for specific slots |

## Visual Patterns

### Color Variants (6 options)

HeroUI Alert supports semantic color variants that convey message intent:

```jsx
{["default", "primary", "secondary", "success", "warning", "danger"].map((color) => (
  <Alert key={color} color={color} title={`This is a ${color} alert`} />
))}
```

- **default**: Neutral informational messages
- **primary**: Primary brand-related notifications
- **secondary**: Secondary information
- **success**: Positive feedback, confirmations
- **warning**: Caution, non-critical issues
- **danger**: Errors, critical issues

**Default Icons**: By default, Alert displays an appropriate icon based on the `color` prop. While specific icon mappings are not explicitly documented, custom icons can override defaults via the `icon` prop.

### Style Variants (4 options)

Controls the visual presentation style:

- **solid**: Filled background with solid color
- **bordered**: Outlined style with border
- **flat**: Subtle background (default)
- **faded**: More subtle, faded appearance

```jsx
<Alert color="warning" variant="solid" title="Solid variant" />
<Alert color="warning" variant="bordered" title="Bordered variant" />
<Alert color="warning" variant="flat" title="Flat variant" />
<Alert color="warning" variant="faded" title="Faded variant" />
```

### Radius Options (5 sizes)

Controls border radius:

- **none**: No border radius (sharp corners)
- **sm**: Small radius
- **md**: Medium radius (default)
- **lg**: Large radius
- **full**: Fully rounded corners

```jsx
<Alert radius="none" title="No radius" />
<Alert radius="sm" title="Small radius" />
<Alert radius="md" title="Medium radius" />
<Alert radius="lg" title="Large radius" />
<Alert radius="full" title="Full radius" />
```

## Content Patterns

### Title Only

```jsx
<Alert title="Simple notification" />
```

### Title + Description

```jsx
<Alert
  title="Email Sent!!"
  description="You will get a reply soon"
/>
```

### Custom Icon

```jsx
<Alert
  icon={<CustomIcon />}
  title="Custom icon alert"
/>
```

### Hide Icon

```jsx
<Alert
  hideIcon
  title="Alert without icon"
/>
```

### Hide Icon Wrapper

```jsx
<Alert
  hideIconWrapper
  title="Alert without icon wrapper"
/>
```

### Start Content Slot

```jsx
<Alert
  startContent={<Avatar />}
  title="Alert with leading content"
/>
```

### End Content Slot (Actions)

```jsx
<Alert
  color="warning"
  description="Upgrade to a paid plan"
  endContent={<Button>Upgrade</Button>}
  title="No credits left"
  variant="faded"
/>
```

## Layout Patterns

### Composition Pattern

Props work together for flexible configurations without conflicts:

```jsx
<Alert
  color="warning"
  description="Upgrade to a paid plan"
  endContent={<Button size="sm" variant="flat">Upgrade</Button>}
  radius="lg"
  title="No credits left"
  variant="faded"
/>
```

### Slot-Based Styling

Alert supports granular styling through a slot architecture:

```jsx
<Alert
  classNames={{
    base: "bg-default-50 dark:bg-background shadow-sm",
    mainWrapper: "pt-1",
    iconWrapper: "dark:bg-transparent",
  }}
  color="primary"
  title="Custom styled alert"
/>
```

Available slots:
- `base`: Main alert container
- `title`: Title element
- `description`: Description content
- `mainWrapper`: Title and description wrapper
- `closeButton`: Close button element
- `iconWrapper`: Icon container
- `alertIcon`: Icon element itself

## Animation Patterns

### Visibility Control

The Alert component supports visibility control through props:

```jsx
<Alert
  isVisible={isVisible}
  onVisibleChange={setIsVisible}
  title="Controlled visibility"
/>
```

**Behavior**: When closed, the alert is removed from the DOM (not just hidden).

### Closable Alerts

```jsx
<Alert
  isClosable
  onClose={() => console.log("Alert closed")}
  title="Dismissible alert"
/>
```

**Note**: Framer Motion animation configurations are not explicitly documented in the Alert component documentation. Visibility transitions appear to be handled internally, but specific animation parameters are not exposed in the public API.

## Accessibility

### ARIA Attributes

- **Role**: `alert` - Announces to screen readers automatically
- **Close Button Label**: Default `aria-label="Close"` for screen reader users

### Keyboard Support

- **Close button**: Standard button keyboard interaction (Space/Enter to activate) when `isClosable` is true

### Data Attributes

The component provides data attributes for targeted styling:

- `data-visible`: Present when alert is visible
- `data-closeable`: Present when alert is closable
- `data-has-title`: Present when title is provided
- `data-has-description`: Present when description is provided

These attributes enable CSS selectors like:
```css
[data-visible="true"] { /* styles */ }
[data-closeable="true"] { /* styles */ }
```

### DOM Management

When an alert is closed (dismissed), it is completely removed from the DOM, ensuring proper cleanup and preventing accessibility issues with hidden but still-present content.

## Framework-Specific Features

### Installation

**CLI Installation** (Recommended):
```bash
npx heroui-cli@latest add alert
```

**Package Installation**:
```bash
# Full library
npm install @heroui/react

# Individual package
npm install @heroui/alert
```

### Import Patterns

```jsx
// Full library import
import {Alert} from "@heroui/react";

// Individual package import
import {Alert} from "@heroui/alert";

// Hook import (for custom implementations)
import {useAlert} from "@heroui/react";
```

### Design System Integration

HeroUI Alert integrates with the HeroUI design system:
- Uses Tailwind CSS for styling
- Supports dark mode through Tailwind's dark mode utilities
- Follows HeroUI's semantic color system
- Radius system aligns with global HeroUI radius tokens

### TypeScript Support

Full TypeScript support with type definitions:

```typescript
interface AlertProps {
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  variant?: "solid" | "bordered" | "flat" | "faded";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  isVisible?: boolean;
  isClosable?: boolean;
  hideIcon?: boolean;
  hideIconWrapper?: boolean;
  closeButtonProps?: ButtonProps;
  onClose?: () => void;
  onVisibleChange?: (isVisible: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  classNames?: Partial<Record<
    "base" | "title" | "description" | "mainWrapper" | "closeButton" | "iconWrapper" | "alertIcon",
    string
  >>;
}
```

### React Patterns

- Uses standard React patterns with hooks
- Supports controlled and uncontrolled component patterns
- Provides prop getter functions via `useAlert` hook for custom implementations
- Compatible with React Server Components (when not using interactive features)

## Implementation Notes

### API Design

**Component-First API**: The primary API is the declarative `<Alert>` component, which handles the most common use cases.

**Hook-Based API**: The `useAlert` hook provides a lower-level API for building custom alert implementations. This follows React's pattern of providing both high-level components and low-level hooks.

**Prop Getter Pattern**: The `useAlert` hook returns prop getter functions (`getBaseProps`, `getTitleProps`, etc.) that return the appropriate props for each element. This pattern:
- Ensures consistent prop application
- Handles internal state management
- Provides flexibility for custom implementations
- Follows accessibility best practices automatically

### Architecture Details

**Slot System**: The component uses a slot-based architecture where different parts of the alert (base, title, description, icon, etc.) can be individually styled. This provides:
- Granular control over styling
- Consistent API across HeroUI components
- Easy theme customization
- Type-safe styling with TypeScript

**State Management**:
- Internal state for uncontrolled usage
- External state support via `isVisible` and `onVisibleChange` for controlled usage
- Close action triggers both internal state changes and external callbacks

**DOM Cleanup**: When an alert is closed, it is removed from the DOM rather than hidden. This ensures:
- Clean DOM structure
- No accessibility issues with hidden content
- Proper cleanup of event listeners and references
- Reduced memory footprint

### Composability

**Content Slots**: The `startContent` and `endContent` props enable rich compositions:
```jsx
<Alert
  startContent={<Avatar src={user.avatar} />}
  endContent={
    <ButtonGroup>
      <Button size="sm">Accept</Button>
      <Button size="sm" variant="light">Decline</Button>
    </ButtonGroup>
  }
  title="Friend request"
  description={`${user.name} wants to connect`}
/>
```

**Button Integration**: The `closeButtonProps` prop accepts all Button component props, enabling full customization:
```jsx
<Alert
  isClosable
  closeButtonProps={{
    size: "sm",
    variant: "light",
    "aria-label": "Dismiss notification"
  }}
  title="Customized close button"
/>
```

### Best Practices

1. **Semantic Color Usage**: Use color variants semantically
   - `success` for positive feedback and confirmations
   - `warning` for caution and non-critical issues
   - `danger` for errors and critical issues
   - `primary`/`secondary` for brand-related notifications
   - `default` for neutral information

2. **Content Structure**: Provide both title and description for clarity
   ```jsx
   <Alert
     title="Clear, concise heading"
     description="More detailed explanation or context"
   />
   ```

3. **Dismissal Strategy**: Use `isClosable` when dismissal is appropriate
   - Don't make critical error messages immediately dismissible
   - Use `onClose` to handle cleanup or state updates
   - Implement `onVisibleChange` for controlled visibility scenarios

4. **Action Integration**: Use `endContent` for contextual actions
   ```jsx
   <Alert
     endContent={<Button size="sm">Take Action</Button>}
     title="Action required"
   />
   ```

5. **Styling Consistency**: Leverage the slot system for consistent styling across variants
   ```jsx
   const alertStyles = {
     base: "shadow-md",
     title: "font-semibold",
     description: "text-small"
   };

   <Alert classNames={alertStyles} {...props} />
   ```

6. **Accessibility**: Ensure close buttons have appropriate labels
   ```jsx
   <Alert
     isClosable
     closeButtonProps={{
       "aria-label": "Close error notification"
     }}
   />
   ```

### Performance Considerations

While not explicitly documented, the Alert component appears to use standard React patterns:
- Prop getter functions from `useAlert` optimize prop application
- DOM removal on close (rather than hiding) reduces DOM size
- Slot-based styling allows for efficient CSS application
- No documented animation overhead (animations appear to be lightweight)

### Comparison with Other Component Libraries

**Distinctive Features**:
- **Slot Architecture**: More granular than many libraries
- **Radius System**: Five-tier radius system is more flexible than binary rounded/square
- **Hook + Component**: Dual API provides flexibility
- **Content Slots**: `startContent`/`endContent` more flexible than icon-only slots
- **Tailwind Integration**: Native Tailwind CSS support throughout

**Common Patterns**:
- Semantic color variants (standard across UI libraries)
- Variant system (solid/bordered/flat/faded)
- Close button functionality
- Title + description structure
- ARIA role="alert"
