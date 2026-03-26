# Nuxt UI - Alert Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://ui.nuxt.com/components/alert
Status: ✅ Working
Version: Current (Nuxt UI 4.x)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - The documentation provides extensive coverage of all props, variants, customization options, and interactive examples with live code playground.

## Component Definition
- **Core purpose**: A contextual feedback component that displays important messages, notifications, or alerts to users with optional actions and dismissal capabilities.
- **Mental model**: A highlighted container that draws attention to specific information (success, warning, error, info) with optional title, description, icon, and actionable elements. Users think of it as "important information that needs attention" with built-in visual hierarchy and optional interactivity.
- **Semantic meaning**: Communicates message urgency and type through color-coded variants, supports both informational (static) and actionable (closeable, with buttons) patterns. Serves as a non-modal, persistent notification element.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Title | ✅ | Native | Via `title` prop. Sets the main heading text of the alert. |
| Description | ✅ | Native | Via `description` prop. Sets the body text explaining the alert message. |
| Icon support | ✅ | Native | Via `icon` prop accepting icon string identifiers (e.g., `"i-lucide-terminal"`). Icon displays before title/description. |
| Avatar support | ✅ | Native | Via `avatar` prop accepting object with avatar properties. Alternative to icon for personalized alerts. |
| Custom content | ✅ | Composed | Default slot likely accepts arbitrary Vue content for complete customization. |
| Actions | ✅ | Native | Via `actions` prop accepting array of button configurations for actionable alerts. |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Solid | ✅ | Native | Default variant. `variant="solid"` - filled background with inverted text. |
| Soft | ✅ | Native | `variant="soft"` - subtle background with matching text color. |
| Subtle | ✅ | Native | `variant="subtle"` - minimal styling, lighter appearance. |
| Outline | ✅ | Native | `variant="outline"` - bordered with transparent background and accented ring. |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Closeable | ✅ | Native | `close` boolean prop displays dismiss button. Users can close/dismiss the alert. |
| Persistent | ✅ | Native | Default behavior without `close` prop. Alert remains visible until removed programmatically. |
| Interactive | ✅ | Native | Via `actions` array prop. Supports button actions within the alert. |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | Seven semantic colors: `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral`. Applied via `color` prop. Defaults to `primary`. |
| Orientation | ✅ | Native | `orientation` prop supports `horizontal` (default) and `vertical` layouts. Changes flex direction for title/description stacking. |
| Close icon | ✅ | Native | `close-icon` prop customizes the dismiss button icon (defaults to close/X icon). |

## Code Examples

### Basic Alert
```vue
<!-- Minimal alert with just title -->
<UAlert title="Heads up!" />

<!-- Alert with title and description -->
<UAlert
  title="Heads up!"
  description="You can change the primary color in your app config."
/>
```

### Alert with Icon
```vue
<!-- Icon with title and description -->
<UAlert
  icon="i-lucide-terminal"
  title="Heads up!"
  description="You can change the primary color in your app config."
/>

<!-- Icon with title only -->
<UAlert
  icon="i-lucide-info"
  title="Important information"
/>
```

### Alert with Avatar
```vue
<!-- Avatar from image URL -->
<UAlert
  :avatar="{ src: 'https://github.com/nuxt.png' }"
  title="New message from Nuxt"
  description="Check out the latest updates."
/>

<!-- Avatar with icon -->
<UAlert
  :avatar="{ icon: 'i-lucide-user' }"
  title="Profile update"
  description="Your profile has been updated successfully."
/>

<!-- Avatar with text initials -->
<UAlert
  :avatar="{ text: 'JD' }"
  title="Note from John Doe"
  description="This is a personalized message."
/>
```

### Color Variants
```vue
<!-- Semantic colors -->
<UAlert color="primary" title="Primary alert" />
<UAlert color="secondary" title="Secondary alert" />
<UAlert color="success" title="Success! Operation completed." />
<UAlert color="info" title="FYI: New features available." />
<UAlert color="warning" title="Warning: Check your settings." />
<UAlert color="error" title="Error: Something went wrong." />
<UAlert color="neutral" title="Neutral information" />
```

### Visual Variants
```vue
<!-- Solid (default) - filled background -->
<UAlert
  color="primary"
  variant="solid"
  title="Solid variant"
  description="Full background color with inverted text."
/>

<!-- Soft - subtle background -->
<UAlert
  color="success"
  variant="soft"
  title="Soft variant"
  description="Subtle background with colored text."
/>

<!-- Subtle - minimal styling -->
<UAlert
  color="info"
  variant="subtle"
  title="Subtle variant"
  description="Minimal background with accented ring."
/>

<!-- Outline - bordered -->
<UAlert
  color="warning"
  variant="outline"
  title="Outline variant"
  description="Transparent background with colored border and ring."
/>
```

### Closeable Alerts
```vue
<!-- Basic closeable alert -->
<UAlert
  close
  title="Dismissible alert"
  description="Click the X button to close this alert."
/>

<!-- Custom close icon -->
<UAlert
  close
  close-icon="i-lucide-x-circle"
  title="Custom close icon"
  description="Using a custom icon for the close button."
/>

<!-- Closeable with color and icon -->
<UAlert
  icon="i-lucide-check-circle"
  color="success"
  variant="soft"
  close
  title="Success!"
  description="Your changes have been saved."
/>
```

### Alerts with Actions
```vue
<!-- Alert with action buttons -->
<UAlert
  icon="i-lucide-alert-triangle"
  color="warning"
  variant="outline"
  orientation="horizontal"
  :actions="[
    {
      label: 'Review',
      color: 'warning',
      variant: 'solid'
    },
    {
      label: 'Dismiss',
      color: 'warning',
      variant: 'ghost'
    }
  ]"
  title="Action required"
  description="Please review the recent changes before proceeding."
/>

<!-- Vertical orientation with actions -->
<UAlert
  color="info"
  variant="soft"
  orientation="vertical"
  close
  :actions="[
    {
      label: 'Learn More',
      color: 'info',
      variant: 'soft',
      to: '/docs'
    }
  ]"
  title="New feature available"
  description="We've added new capabilities to improve your workflow."
/>
```

### Orientation
```vue
<!-- Horizontal layout (default) -->
<UAlert
  orientation="horizontal"
  icon="i-lucide-info"
  title="Horizontal alert"
  description="Content flows horizontally."
/>

<!-- Vertical layout -->
<UAlert
  orientation="vertical"
  icon="i-lucide-info"
  title="Vertical alert"
  description="Content stacks vertically for a different layout."
/>
```

### Customization Patterns
```vue
<!-- Via class prop -->
<UAlert
  class="shadow-lg"
  title="Custom styled alert"
  description="Additional classes for custom styling."
/>

<!-- Via ui prop (component slots) -->
<UAlert
  icon="i-lucide-rocket"
  :ui="{
    icon: 'text-primary',
    title: 'font-bold text-lg',
    description: 'text-sm'
  }"
  title="Customized alert"
  description="Using ui prop to override specific slot styles."
/>

<!-- Global configuration (app.config.ts) -->
export default defineAppConfig({
  ui: {
    alert: {
      slots: {
        root: 'p-6',
        title: 'text-xl font-semibold',
        description: 'mt-2'
      },
      variants: {
        color: {
          primary: {
            solid: 'bg-primary-600'
          }
        }
      }
    }
  }
})
```

## Notable Features

- **Integrated avatar support**: Unlike many alert components, Nuxt UI Alert includes built-in avatar rendering (image, icon, or text initials) as an alternative to standard icons, enabling personalized notifications.

- **Actionable alerts**: Native `actions` prop accepts an array of button configurations, allowing alerts to include interactive CTAs without manual composition. Actions can be links or buttons with full styling control.

- **Flexible close button**: The `close` prop not only enables dismissal but also supports custom close icons via `close-icon`, maintaining design system consistency.

- **Orientation control**: The `orientation` prop allows switching between horizontal (default) and vertical layouts, useful for responsive designs or different content lengths.

- **Rich content support**: Combines title, description, icon/avatar, actions, and close button in a single component with automatic layout management and visual hierarchy.

- **Consistent slot-based styling**: The `ui` prop provides granular control over individual component slots (root, border, container, icon, avatar, title, description, close, actions) for deep customization.

- **Color-coded semantics**: Seven semantic color options (primary, secondary, success, info, warning, error, neutral) with four visual variants (solid, soft, subtle, outline) create 28 possible combinations for nuanced messaging.

- **Reka UI foundation**: Built on Reka UI primitives, ensuring solid accessibility foundations and consistent component patterns across the Nuxt UI ecosystem.

## Research Notes

**Framework Approach Observations:**

1. **Vue-centric composition**: Props are fully reactive, leveraging Vue's reactivity system. Complex objects (avatar, actions) are passed as reactive props rather than children components.

2. **Hybrid content strategy**: Supports both prop-based content (title, description) and slot-based composition (default slot), balancing convenience with flexibility.

3. **Action as data pattern**: Actions are defined as configuration objects in an array rather than composed components, following a data-driven approach common in Vue ecosystems.

4. **Tailwind-first styling**: Deep integration with Tailwind CSS through utility classes. The `ui` prop exposes Tailwind classes for each component slot.

5. **Config-driven theming**: Global configuration through `app.config.ts` allows application-wide alert styling without per-instance customization.

6. **Semantic color system**: Predefined color palette (primary through neutral) aligned with design tokens, promoting consistent semantic meaning across components.

7. **Orientation flexibility**: Unlike many alert implementations with fixed layouts, provides explicit orientation control for responsive and context-specific layouts.

8. **Icon system integration**: String-based icon identifiers ("i-lucide-*") suggest integration with Nuxt's icon resolution system, likely with auto-import capabilities.

9. **Avatar integration sophistication**: Supporting three avatar types (image src, icon, text initials) in a single prop shows attention to personalization use cases.

10. **Close event handling**: Closeable alerts likely emit close events for parent component state management, following Vue event patterns.

**Distinctive Patterns vs Other Frameworks:**

- **Avatar in alerts** is uncommon - most frameworks treat alerts as purely informational without personalization
- **Actions as prop array** simplifies action buttons compared to manual composition required in most frameworks
- **Orientation prop** is rare in alert components - most have fixed layouts
- **Four variant system** (solid, soft, subtle, outline) provides more nuance than typical two-variant (filled/outlined) implementations
- **Integrated close customization** (close-icon prop) is more flexible than typical fixed close buttons

**Potential Learning Points for Semantic UI:**

- The **actions array prop** pattern could simplify alert CTAs versus requiring manual button composition
- **Orientation control** adds valuable layout flexibility for responsive designs
- **Avatar support** could enable personalized notifications and user-facing alerts
- **Close icon customization** maintains design consistency while allowing flexibility
- **Four variant system** (solid/soft/subtle/outline) provides more semantic nuance than two-variant systems
- **Slot-based styling via ui prop** enables deep customization without CSS override complexity
- **Combined title + description** pattern is more convenient than requiring separate elements
- **Semantic color + variant matrix** (7 colors × 4 variants = 28 combinations) covers wide range of use cases

**Framework-Specific Considerations for Semantic UI:**

When adapting these patterns, Semantic UI should consider:

1. **Event system**: Nuxt UI's close functionality likely uses Vue events - Semantic UI would use `dispatchEvent` for close notifications
2. **Actions implementation**: Array of button configs could be implemented via `actions` setting with button specs, or via slotted button children
3. **Avatar pattern**: Could leverage Semantic UI's avatar primitive via avatar setting or manual composition
4. **Reactivity model**: Vue's reactive props vs Semantic UI's signals-based reactivity for dynamic content updates
5. **Icon resolution**: String identifiers vs direct icon component references in Semantic UI
6. **Styling approach**: Tailwind utilities vs Semantic UI's CSS custom properties and design tokens
7. **Orientation**: Could be implemented via flexbox direction in CSS based on orientation prop/class
8. **Close behavior**: Should emit event and provide both controlled and uncontrolled modes

**Migration Considerations:**

If implementing similar patterns in Semantic UI:

1. Decide between actions-as-props vs actions-as-children composition
2. Determine if avatar support should be native or require composition
3. Consider if orientation should be prop-based or class-based
4. Evaluate four-variant system vs simpler two-variant approach
5. Design close event API and state management patterns
6. Plan icon integration with Semantic UI's icon system
7. Map semantic colors to Semantic UI's color tokens
8. Consider slot-based customization vs CSS custom properties for theming
