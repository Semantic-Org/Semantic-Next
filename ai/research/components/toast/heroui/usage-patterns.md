# HeroUI - Toast Usage Patterns

## Component URLs
- **Main**: https://www.heroui.com/docs/components/toast
- **Status**: ✅ Accessible

## Documentation Quality
Excellent - Comprehensive documentation with extensive code examples, API reference, styling options, and interactive playground. Well-organized sections covering basic usage, variants, positioning, promises, and customization.

## Component Definition
- **Core purpose**: Display temporary notification messages that provide feedback about actions, events, or system states. Toast notifications appear as overlay elements that automatically dismiss after a timeout period.
- **Mental model**: A programmatic notification system requiring provider setup, triggered via imperative API (`addToast` function). Toasts queue and stack based on placement, with built-in timeout, promise handling, and dismissal controls.
- **Semantic meaning**: Temporary, non-blocking feedback mechanism for user actions. Unlike embedded alerts, toasts overlay content and auto-dismiss. Provides visual confirmation without requiring user interaction.

## Architecture Overview

### Provider-Based System
HeroUI Toast uses a provider pattern requiring initialization before use:
- `ToastProvider` component wraps the application or specific sections
- `addToast()` function imperatively creates toast notifications
- `closeToast(key)` and `closeAll()` provide programmatic dismissal
- Provider manages toast queue, placement, and global configuration

### Imperative API Pattern
```jsx
// Provider setup (required)
<ToastProvider placement="bottom-right" maxVisibleToasts={3} />

// Imperative toast creation
const key = addToast({
  title: "Success",
  description: "Operation completed",
  color: "success",
  timeout: 5000
});

// Programmatic control
closeToast(key);  // Close specific toast
closeAll();       // Close all toasts
```

## Display Patterns

### Multi-Part Anatomy
| Part | Purpose | Details |
|------|---------|---------|
| base | Main container | Outermost wrapper with positioning and animation |
| content | Content wrapper | Groups title, description, and icon |
| title | Primary message | Main notification text (ReactNode) |
| description | Secondary details | Additional context (ReactNode) |
| icon | Status indicator | Auto-selected based on color or custom icon |
| closeIcon | Dismiss button | X icon for manual dismissal |
| closeButton | Button wrapper | Container for close icon |
| motionDiv | Animation wrapper | Handles enter/exit transitions |
| progressTrack | Timeout background | Visual timeout indicator background |
| progressIndicator | Timeout progress | Active countdown visualization |
| loadingComponent | Promise state | Loading indicator for promise-based toasts |
| endContent | Action area | Custom content/actions at end of toast |

### Layout Capabilities
| Pattern | Present | Details |
|---------|---------|---------|
| Icon positioning | ✅ | Auto-positioned icon on left based on color/status |
| Content stacking | ✅ | Title and description stack vertically |
| Action area | ✅ | `endContent` prop for buttons or custom actions |
| Close button | ✅ | Optional close button (hideCloseButton to disable) |
| Custom layouts | ✅ | Full Tailwind CSS customization via classNames |
| Progress indicator | ✅ | Optional timeout progress bar via shouldShowTimeoutProgress |

## Content Patterns

| Pattern | Present | Details |
|---------|---------|---------|
| Title content | ✅ | `title` prop accepts ReactNode |
| Description content | ✅ | `description` prop accepts ReactNode |
| Icon support | ✅ | Auto icon based on color, custom via `icon` prop |
| Custom icon | ✅ | Override default icon with custom ReactNode |
| Hide icon | ✅ | `hideIcon` boolean removes icon display |
| Close icon | ✅ | Customizable via `closeIcon` prop |
| Hide close button | ✅ | `hideCloseButton` boolean removes dismiss button |
| End content | ✅ | `endContent` prop for trailing actions/buttons |
| Promise states | ✅ | `promise` prop with loading/success/error states |
| Custom loading | ✅ | Override loading indicator via `loadingComponent` |

## Behavior Patterns

### Timeout & Auto-Dismiss
| Pattern | Present | Details |
|---------|---------|---------|
| Auto-dismiss | ✅ | Default 6000ms timeout, configurable via `timeout` prop |
| Infinite timeout | ✅ | Set `timeout: Infinity` for manual-only dismissal |
| Progress indicator | ✅ | `shouldShowTimeoutProgress: true` shows countdown |
| Manual dismiss | ✅ | Close button or `closeToast(key)` function |
| Dismiss all | ✅ | `closeAll()` function closes all active toasts |

### Queue & Stacking
| Pattern | Present | Details |
|---------|---------|---------|
| Max visible toasts | ✅ | `maxVisibleToasts` prop on ToastProvider (default 3) |
| Queue management | ✅ | Excess toasts queue and display as others dismiss |
| Stacking order | ✅ | Newest toasts appear at edge closest to placement origin |
| Placement control | ✅ | Six placement options (top/bottom + left/center/right) |
| Offset control | ✅ | `toastOffset` prop adjusts vertical spacing from edge |

### Animation States
| Pattern | Present | Details |
|---------|---------|---------|
| Enter animation | ✅ | Slide-in from placement edge with fade |
| Exit animation | ✅ | Slide-out to placement edge with fade |
| Drag interaction | ✅ | `data-drag-value` attribute tracks drag state |
| Animation states | ✅ | "entering", "queued", "exiting", "undefined" states |
| Disable animations | ✅ | `disableAnimation` prop on ToastProvider |

### Promise Integration
| Pattern | Present | Details |
|---------|---------|---------|
| Promise prop | ✅ | `promise` accepts Promise for loading/success/error states |
| Loading state | ✅ | Shows loading indicator while promise pending |
| Success state | ✅ | Updates to success appearance when promise resolves |
| Error state | ✅ | Updates to error appearance when promise rejects |
| Custom loading | ✅ | `loadingComponent` prop overrides default spinner |
| Automatic updates | ✅ | Toast appearance updates based on promise state |

## Variant Patterns

### Color Variants
| Color | Icon | Purpose | Auto-Applied |
|-------|------|---------|--------------|
| default | Info icon | General information | ✅ Default |
| primary | Primary icon | Primary actions/info | Manual |
| secondary | Secondary icon | Secondary actions/info | Manual |
| success | Checkmark | Success confirmations | ✅ Promise resolve |
| warning | Warning icon | Warnings and cautions | Manual |
| danger | Error icon | Error messages | ✅ Promise reject |

### Visual Style Variants
| Variant | Description | Appearance |
|---------|-------------|------------|
| solid | Filled background | Colored background with contrasting text (default) |
| bordered | Bordered outline | Transparent background with colored border |
| flat | Subtle styling | Light colored background with colored text |

### Border Radius Options
| Radius | Value | Use Case |
|--------|-------|----------|
| none | 0 | Sharp corners, no rounding |
| sm | Small | Subtle rounded corners |
| md | Medium | Moderate rounding (default) |
| lg | Large | Prominent rounding |
| full | Maximum | Pill-shaped, fully rounded |

### Placement Options
| Placement | Position | Behavior |
|-----------|----------|----------|
| top-left | Top-left corner | Stacks downward from top-left |
| top-center | Top-center | Stacks downward from top-center |
| top-right | Top-right corner | Stacks downward from top-right |
| bottom-left | Bottom-left corner | Stacks upward from bottom-left |
| bottom-center | Bottom-center | Stacks upward from bottom-center |
| bottom-right | Bottom-right corner | Stacks upward from bottom-right (default) |

## Code Examples

### Basic Usage
```jsx
import {addToast, Button, ToastProvider} from "@heroui/react";

// Provider setup in root
<ToastProvider />

// Simple toast
export default function App() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="flat"
        onPress={() => addToast({title: "Toast Title"})}
      >
        Basic Toast
      </Button>

      <Button
        variant="flat"
        onPress={() => addToast({
          title: "Toast Title",
          description: "Toast Description"
        })}
      >
        With Description
      </Button>
    </div>
  );
}
```

### Color Variants
```jsx
import {addToast, Button} from "@heroui/react";

export default function App() {
  const colors = ["default", "primary", "secondary", "success", "warning", "danger"];

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <Button
          key={color}
          color={color}
          variant="flat"
          onPress={() => addToast({
            title: "Toast title",
            description: "Toast displayed successfully",
            color: color
          })}
        >
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </Button>
      ))}
    </div>
  );
}
```

### Style Variants
```jsx
import {addToast, Button} from "@heroui/react";

export default function App() {
  const variants = [
    ["Solid", "solid"],
    ["Bordered", "bordered"],
    ["Flat", "flat"]
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {variants.map(([label, variant]) => (
        <Button
          key={variant}
          variant="flat"
          onPress={() => addToast({
            title: "Toast title",
            description: "Toast displayed successfully",
            variant: variant,
            color: "secondary"
          })}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
```

### Border Radius
```jsx
import {addToast, Button} from "@heroui/react";

export default function App() {
  const radiusOptions = [
    ["None", "none"],
    ["Small", "sm"],
    ["Medium", "md"],
    ["Large", "lg"],
    ["Full", "full"]
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {radiusOptions.map(([label, radius]) => (
        <Button
          key={radius}
          radius={radius}
          variant="flat"
          onPress={() => addToast({
            title: "Toast title",
            description: "Toast displayed successfully",
            radius: radius
          })}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
```

### Placement Configuration
```jsx
import {addToast, ToastProvider, Button} from "@heroui/react";
import React from "react";

export default function App() {
  const [placement, setPlacement] = React.useState("bottom-right");

  const positions = [
    ["Top Left", "top-left"],
    ["Top Center", "top-center"],
    ["Top Right", "top-right"],
    ["Bottom Left", "bottom-left"],
    ["Bottom Center", "bottom-center"],
    ["Bottom Right", "bottom-right"]
  ];

  return (
    <>
      <ToastProvider
        placement={placement}
        toastOffset={placement.includes("top") ? 60 : 0}
      />

      <div className="flex flex-wrap gap-2">
        {positions.map(([label, position]) => (
          <Button
            key={position}
            variant="flat"
            onPress={() => {
              setPlacement(position);
              addToast({
                title: "Toast title",
                description: "Toast displayed successfully"
              });
            }}
          >
            {label}
          </Button>
        ))}
      </div>
    </>
  );
}
```

### Icon Customization
```jsx
import {addToast, Button} from "@heroui/react";

// Hidden icon
<Button
  variant="flat"
  onPress={() => addToast({
    title: "Toast Title",
    hideIcon: true
  })}
>
  Hidden Icon
</Button>

// Custom icon
<Button
  variant="flat"
  onPress={() => addToast({
    title: "Custom Icon Toast",
    icon: <CustomIcon />
  })}
>
  Custom Icon
</Button>

// Custom close icon
<Button
  variant="flat"
  onPress={() => addToast({
    title: "Toast Title",
    description: "Toast Description",
    closeIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  })}
>
  Custom Close Icon
</Button>
```

### Promise-Based Toasts
```jsx
import {addToast, Button} from "@heroui/react";

// Simple promise
<Button
  variant="flat"
  onPress={() => addToast({
    promise: new Promise((resolve) => setTimeout(resolve, 3000))
  })}
>
  Promise (3000ms)
</Button>

// Promise with custom loading
<Button
  variant="flat"
  onPress={() => addToast({
    title: "Processing...",
    promise: fetch('/api/data').then(res => res.json()),
    loadingComponent: <CustomSpinner />
  })}
>
  Promise with Custom Loading
</Button>

// Promise with success/error handling
async function uploadFile() {
  const uploadPromise = fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  addToast({
    title: "Uploading file...",
    promise: uploadPromise,
    description: "Please wait while we upload your file"
  });
}
```

### Timeout Configuration
```jsx
import {addToast, Button} from "@heroui/react";

// Custom timeout
<Button
  variant="flat"
  onPress={() => addToast({
    title: "Quick Toast",
    timeout: 3000  // 3 seconds
  })}
>
  3 Second Toast
</Button>

// Infinite timeout (manual dismiss only)
<Button
  variant="flat"
  onPress={() => addToast({
    title: "Persistent Toast",
    timeout: Infinity
  })}
>
  Infinite Toast
</Button>

// With progress indicator
<Button
  variant="flat"
  onPress={() => addToast({
    title: "Toast with Progress",
    timeout: 5000,
    shouldShowTimeoutProgress: true
  })}
>
  Show Timeout Progress
</Button>
```

### End Content / Actions
```jsx
import {addToast, Button} from "@heroui/react";

// Toast with action button
<Button
  variant="flat"
  onPress={() => addToast({
    title: "New update available",
    description: "Version 2.0 is ready to install",
    endContent: (
      <Button size="sm" color="primary">
        Upgrade
      </Button>
    )
  })}
>
  With Action Button
</Button>

// Toast with multiple actions
<Button
  variant="flat"
  onPress={() => addToast({
    title: "File uploaded",
    description: "Your document is now in the cloud",
    endContent: (
      <div className="flex gap-2">
        <Button size="sm" variant="flat">View</Button>
        <Button size="sm" variant="flat">Share</Button>
      </div>
    )
  })}
>
  Multiple Actions
</Button>
```

### Programmatic Control
```jsx
import {addToast, closeToast, closeAll, Button} from "@heroui/react";

function ToastControls() {
  // Store toast key for later control
  const [toastKey, setToastKey] = React.useState(null);

  const createPersistentToast = () => {
    const key = addToast({
      title: "Persistent Toast",
      description: "This toast won't auto-dismiss",
      timeout: Infinity
    });
    setToastKey(key);
  };

  const closeSpecificToast = () => {
    if (toastKey) {
      closeToast(toastKey);
      setToastKey(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button onPress={createPersistentToast}>
        Create Persistent Toast
      </Button>
      <Button onPress={closeSpecificToast} isDisabled={!toastKey}>
        Close Specific Toast
      </Button>
      <Button onPress={closeAll} color="danger">
        Close All Toasts
      </Button>
    </div>
  );
}
```

### Custom Styling with classNames
```jsx
import {addToast, Button} from "@heroui/react";

<Button
  variant="flat"
  onPress={() => addToast({
    title: "Successful!",
    description: "Document uploaded to cloud successfully.",
    color: "primary",
    classNames: {
      base: "bg-default-50 dark:bg-background shadow-sm border border-l-8 rounded-md rounded-l-none flex flex-col items-start border-primary-200 dark:border-primary-100 border-l-primary",
      title: "text-lg font-bold",
      description: "text-sm opacity-80",
      icon: "w-6 h-6",
      closeButton: "hover:bg-primary-100"
    },
    endContent: (
      <div className="ms-11 my-2 flex gap-x-2">
        <Button color="primary" size="sm">View</Button>
      </div>
    )
  })}
>
  Custom Styled Toast
</Button>
```

### Global Configuration via Provider
```jsx
import {ToastProvider} from "@heroui/react";

// Global defaults for all toasts
<ToastProvider
  placement="top-right"
  maxVisibleToasts={5}
  toastOffset={20}
  disableAnimation={false}
  toastProps={{
    radius: "full",
    color: "primary",
    variant: "flat",
    timeout: 4000,
    hideIcon: false,
    hideCloseButton: false,
    shouldShowTimeoutProgress: true
  }}
  regionProps={{
    role: "region",
    "aria-label": "Notifications"
  }}
/>
```

### Hide Close Button
```jsx
import {addToast, Button} from "@heroui/react";

<Button
  variant="flat"
  onPress={() => addToast({
    title: "Auto-dismiss only",
    description: "No close button available",
    hideCloseButton: true,
    timeout: 5000
  })}
>
  No Close Button
</Button>
```

## API Reference

### ToastProvider Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| placement | "top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right" | "bottom-right" | Position where toasts appear |
| maxVisibleToasts | number | 3 | Maximum number of toasts displayed simultaneously |
| disableAnimation | boolean | false | Disable enter/exit animations |
| toastOffset | number | 0 | Vertical spacing from viewport edge (px) |
| toastProps | ToastProps | {} | Global default props for all toasts |
| regionProps | HTMLAttributes | {} | Props for toast container region |

### addToast() Function Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | ReactNode | — | Primary message content |
| description | ReactNode | — | Secondary descriptive text |
| color | "default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger" | "default" | Color variant determining icon and styling |
| variant | "solid" \| "bordered" \| "flat" | "solid" | Visual style variant |
| radius | "none" \| "sm" \| "md" \| "lg" \| "full" | "md" | Border radius size |
| timeout | number \| Infinity | 6000 | Milliseconds before auto-dismiss (Infinity disables) |
| promise | Promise | — | Promise for loading/success/error state automation |
| icon | ReactNode | — | Custom icon override |
| closeIcon | ReactNode | — | Custom close button icon |
| hideIcon | boolean | false | Hide the status icon |
| hideCloseButton | boolean | false | Hide the close button |
| shouldShowTimeoutProgress | boolean | false | Display countdown progress indicator |
| endContent | ReactNode | — | Additional trailing content/actions |
| loadingComponent | ReactNode | — | Custom loading indicator for promise state |
| classNames | ClassNamesConfig | {} | Custom Tailwind CSS for all slots |

### classNames Slots
| Slot | Purpose | Target Element |
|------|---------|----------------|
| base | Main container | Outer wrapper with positioning |
| content | Content wrapper | Groups title, description, icon |
| title | Title text | Main message element |
| description | Description text | Secondary message element |
| icon | Status icon | Icon container |
| loadingComponent | Loading indicator | Promise loading state spinner |
| motionDiv | Animation wrapper | Motion/transition container |
| progressTrack | Progress background | Timeout indicator track |
| progressIndicator | Progress bar | Active countdown fill |
| closeButton | Close button | Dismiss button wrapper |
| closeIcon | Close icon | X icon element |

### Control Functions
| Function | Signature | Description |
|----------|-----------|-------------|
| addToast | `(props: ToastProps) => string` | Create new toast, returns unique key |
| closeToast | `(key: string) => void` | Close specific toast by key |
| closeAll | `() => void` | Close all active toasts |

## Theming System

### Tailwind CSS Integration
HeroUI Toast uses Tailwind CSS for styling with full customization via the `classNames` prop:

```jsx
addToast({
  title: "Custom Toast",
  classNames: {
    // Main container
    base: "bg-gradient-to-r from-purple-500 to-pink-500 shadow-xl",

    // Content area
    content: "flex flex-col gap-1",

    // Typography
    title: "text-white font-bold text-lg",
    description: "text-white/90 text-sm",

    // Icon styling
    icon: "w-6 h-6 text-white",

    // Close button
    closeButton: "text-white hover:bg-white/20 rounded-full",

    // Progress indicator
    progressTrack: "bg-white/20",
    progressIndicator: "bg-white"
  }
});
```

### Design Token Pattern
```jsx
// Using semantic color tokens
addToast({
  title: "Token-based styling",
  classNames: {
    base: "bg-default-50 dark:bg-background",
    title: "text-foreground",
    description: "text-foreground-500",
    icon: "text-primary"
  }
});
```

### Global Theme Configuration
```jsx
<ToastProvider
  toastProps={{
    classNames: {
      base: "border border-default-200 shadow-lg",
      title: "font-semibold text-default-800",
      description: "text-default-600"
    }
  }}
/>
```

## Notable Features

### Provider-Based Architecture
- **Centralized management**: Single ToastProvider manages all toast instances
- **Global configuration**: Set defaults via toastProps for all toasts
- **Queue management**: Automatic queuing when maxVisibleToasts exceeded
- **Placement control**: Six positioning options with offset configuration
- **Region accessibility**: Dedicated ARIA region for toast container

### Promise Integration
- **Automatic state management**: Toast updates based on promise resolution/rejection
- **Loading state**: Shows loading indicator while promise pending
- **Success state**: Updates to success color/icon when promise resolves
- **Error state**: Updates to danger color/icon when promise rejects
- **Custom loading**: Override default loading component
- **Seamless UX**: Single toast transitions through states without multiple notifications

### Imperative API
- **Programmatic control**: Create toasts via function call, not JSX
- **Key-based management**: `addToast` returns unique key for later control
- **Close specific**: `closeToast(key)` dismisses individual toast
- **Close all**: `closeAll()` clears all active toasts
- **Flexible integration**: Works with any trigger (events, API responses, timers)

### Animation System
- **Enter/exit transitions**: Smooth slide and fade animations
- **Drag support**: Data attributes track drag interaction state
- **Animation states**: "entering", "queued", "exiting", "undefined"
- **Disable option**: `disableAnimation` prop for reduced motion
- **Performant**: Hardware-accelerated CSS animations

### Timeout & Progress
- **Auto-dismiss**: Default 6000ms timeout (configurable)
- **Infinite option**: Set `timeout: Infinity` for manual-only dismiss
- **Progress indicator**: Visual countdown via `shouldShowTimeoutProgress`
- **Pause on hover**: (Implementation-dependent behavior)
- **Custom durations**: Per-toast timeout configuration

### Customization Flexibility
- **Per-toast styling**: `classNames` prop targets all slots individually
- **Global defaults**: Provider-level configuration applies to all toasts
- **Color variants**: Six semantic color options
- **Visual variants**: Three style patterns (solid, bordered, flat)
- **Radius options**: Five border radius choices
- **Icon customization**: Hide, customize, or replace icons
- **End content**: Add action buttons or custom UI elements

### Accessibility Features
- **ARIA region**: Toast container is designated region
- **Role: alert**: Toast elements have alert role (implicit/explicit)
- **Close button label**: Default aria-label="Close" on dismiss button
- **Custom region props**: Configure ARIA attributes via `regionProps`
- **DOM cleanup**: Region removed when no toasts active
- **Screen reader announcements**: Title and description announced

### Queue Management
- **Max visible limit**: Control simultaneous toast count (default 3)
- **Automatic queuing**: Excess toasts wait in queue
- **FIFO display**: Oldest toasts dismiss first, revealing queued items
- **Placement-aware**: Stack direction based on placement (up/down)
- **Visual feedback**: Queued toasts have distinct animation state

## Research Notes

### Documentation Access
- **Main documentation**: Successfully accessed at heroui.com/docs/components/toast
- **Quality**: Excellent documentation with comprehensive examples, API reference, and interactive playground
- **Code examples**: Extensive examples covering all features and use cases
- **Installation guide**: Clear setup instructions with multiple package managers
- **TypeScript support**: Implicit through TypeScript-based codebase

### Framework Approach Observations

**Component Philosophy**:
- **Imperative over declarative**: Uses function calls (addToast) rather than JSX components
- **Provider pattern**: Centralized toast management via context provider
- **Promise-first design**: Built-in promise handling as first-class feature
- **Tailwind integration**: Deep integration with Tailwind CSS via classNames
- **Controlled chaos**: Manages overlay notifications without global state pollution

**Architecture Patterns**:
- **Provider → Function → Instance**: Three-tier architecture
- **Key-based lifecycle**: Unique keys enable programmatic control
- **Queue-based rendering**: Limits visible toasts, queues excess
- **State-driven updates**: Promise states automatically update toast appearance
- **Slot-based styling**: Granular control via classNames targeting specific slots

**Design Decisions**:
- **No declarative JSX**: Cannot render `<Toast>` component directly
- **Must use provider**: ToastProvider required before addToast works
- **Auto-dismiss default**: 6000ms default encourages temporary notifications
- **Overlay positioning**: Six placement options cover all viewport edges
- **Progress visualization**: Optional timeout countdown for user awareness

### TypeScript Integration
- Built with TypeScript (React framework)
- Type-safe props with string literal unions
- Exported type definitions available
- IntelliSense support for all props and functions
- ReactNode support for flexible content types

### HeroUI Framework Context
- Part of HeroUI component ecosystem
- Consistent API with other HeroUI components
- Shared design language (colors, variants, radius)
- Tailwind CSS as styling foundation
- React-based, not web components

### Implementation Patterns

**State Management**:
- Provider manages global toast state via context
- Each toast has independent timeout and lifecycle
- Queue state managed internally by provider
- No external state management required (Redux, Zustand, etc.)

**Styling Architecture**:
- Tailwind CSS classes via `classNames` prop
- Semantic color system (default/primary/success/warning/danger)
- Variant system (solid/bordered/flat)
- Radius system (none/sm/md/lg/full)
- Dark mode support via Tailwind dark: prefix
- Global defaults via toastProps on provider

**Promise Pattern**:
- Single toast transitions through states (loading → success/error)
- Automatic color/icon updates based on promise outcome
- Custom loading component support
- No need for multiple addToast calls
- Cleaner UX than separate notifications per state

**Animation Strategy**:
- CSS-based animations (no JS animation library)
- Hardware-accelerated transforms (translate, opacity)
- State-driven animation classes (entering/exiting)
- Drag interaction tracking via data attributes
- Disable option for accessibility (reduced motion)

### Accessibility Approach
- **Semantic HTML**: Proper ARIA region and roles
- **Screen reader support**: Title and description announced
- **Keyboard navigation**: Close button accessible via keyboard
- **Focus management**: (Not explicitly documented)
- **Reduced motion**: disableAnimation respects user preferences
- **Custom ARIA**: regionProps allows custom accessibility attributes
- **DOM cleanup**: Region removed when empty (prevents noise)

### Comparison Points for Semantic UI

**Strengths to Consider**:
- **Promise integration**: Excellent built-in promise handling as first-class feature
- **Imperative API**: Clean function-based API for programmatic control
- **Queue management**: Automatic queuing prevents toast overload
- **Progress indicator**: Optional visual timeout countdown
- **Global configuration**: Provider-based defaults reduce repetition
- **Tailwind integration**: Deep Tailwind CSS integration for flexible styling
- **Custom slots**: Granular control via classNames targeting all parts
- **End content**: Built-in action area for buttons/custom UI
- **Six placements**: Comprehensive positioning options
- **Animation system**: Smooth animations with disable option

**Potential Improvements**:
- **Requires provider**: Cannot use toasts without provider setup (less flexible)
- **No declarative option**: Only imperative API (no JSX `<Toast>` component)
- **Limited built-in variants**: Only three visual variants (could expand)
- **Promise-only loading**: Loading state tied to promise pattern
- **No pause on hover**: Timeout continues during hover (unclear if supported)
- **No group dismissal**: No built-in way to dismiss toasts by group/category
- **No custom animations**: Animation style not customizable (only enable/disable)
- **Action pattern unclear**: No dedicated action/button slot (uses endContent)

**Alignment with Web Standards**:
- React-specific (not web components)
- JSX required (not standard HTML)
- Tailwind CSS-specific (not standard CSS)
- Function-based API (not standard custom elements)
- Could benefit from custom element approach for framework independence
- Strong TypeScript integration (modern standard)
- ARIA compliance (web standard)

**Migration Considerations for Semantic UI**:
- Provider pattern may conflict with Semantic UI architecture
- Imperative API vs Semantic UI's typical declarative patterns
- Tailwind CSS integration vs Semantic UI's CSS approach
- Promise pattern could be adopted as add-on feature
- Queue management pattern worth considering
- classNames slot approach differs from CSS Parts API

### Cross-Framework Pattern Analysis

**Toast vs Snackbar Terminology**:
- HeroUI uses "Toast" (aligns with Radix, ShadCN)
- Material UI uses "Snackbar"
- Ant Design uses "Message" and "Notification"
- Mantine uses "Notification"
- Similar functionality across all frameworks

**Imperative vs Declarative**:
- **Imperative**: HeroUI (addToast), Ant Design (message.success())
- **Declarative**: Material UI (`<Snackbar>`), Chakra UI (`<useToast>` hook)
- **Hybrid**: Mantine (both `showNotification()` and `<Notification>`)

**Promise Integration Comparison**:
- **Built-in**: HeroUI (best-in-class promise handling)
- **Manual**: Most other frameworks require separate toasts per state
- **Unique feature**: HeroUI's automatic state transitions are innovative

**Positioning Strategies**:
- **Six positions**: HeroUI, Ant Design, Mantine (standard)
- **Four positions**: Material UI (top/bottom + left/right center)
- **Custom positioning**: ShadCN/Radix allow full control

**Queue Management**:
- **Built-in queue**: HeroUI (maxVisibleToasts), Ant Design (maxCount)
- **No queue**: Material UI, Chakra UI (stack all)
- **Custom queue**: Mantine (limit + queue customization)

**Provider Pattern**:
- **Required provider**: HeroUI (ToastProvider)
- **Optional provider**: Chakra UI (works without, better with)
- **No provider**: Ant Design (global config), Material UI (component-level)

**Styling Approaches**:
- **Tailwind CSS**: HeroUI, ShadCN (classNames)
- **CSS-in-JS**: Chakra UI, Material UI (sx prop, theme)
- **CSS Modules**: Mantine (Styles API)
- **CSS Parts**: Semantic UI (Shadow DOM parts, could adopt)

**Animation Philosophy**:
- **Built-in**: HeroUI, Material UI, Mantine (included)
- **Framer Motion**: Chakra UI (animation library)
- **CSS-based**: Most frameworks (performance)
- **Disable option**: HeroUI, Material UI (reduced motion)

### Key Takeaways for Semantic UI Implementation

1. **Consider imperative API**: Function-based toast creation is ergonomic for many use cases
2. **Promise integration**: First-class promise support is valuable and unique
3. **Queue management**: Limiting visible toasts improves UX
4. **Progress indicator**: Visual timeout countdown aids user understanding
5. **Provider pattern**: Centralized management has tradeoffs (flexibility vs convenience)
6. **Slot-based styling**: Granular classNames approach enables deep customization
7. **Six placements**: Comprehensive positioning options cover all needs
8. **End content**: Dedicated action area improves consistency
9. **Animation control**: Disable option important for accessibility
10. **ARIA compliance**: Strong accessibility foundation via semantic HTML and ARIA

### Potential Semantic UI Enhancements

1. **Hybrid API**: Support both declarative (`<ui-toast>`) and imperative (`addToast()`)
2. **Promise slots**: Dedicated slots for loading/success/error states
3. **Pause on interaction**: Pause timeout when user hovers or focuses
4. **Group management**: Tag toasts by category, dismiss by group
5. **Custom animations**: Allow animation style customization beyond enable/disable
6. **Action slots**: Explicit action slot separate from general endContent
7. **Stack strategies**: Different stacking behaviors (FIFO, LIFO, priority)
8. **Persistence**: Option to persist toasts across navigation/reload
9. **Sound notifications**: Optional sound alerts for important toasts
10. **Custom transitions**: Per-placement animation directions/styles
