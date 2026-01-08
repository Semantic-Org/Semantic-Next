# HeroUI - Switch Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.heroui.com/docs/components/switch
Status: ✅ Working
Version: HeroUI v2.8.0
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - The documentation includes clear API reference, multiple code examples, accessibility information, and advanced customization patterns.

## Component Definition
- **Core purpose**: Provides a binary toggle control that serves as an alternative between checked and unchecked states, typically used for on/off settings.
- **Mental model**: A physical light switch or toggle that users can flip between two states - when ON, visual feedback is immediate and clear.
- **Semantic meaning**: Communicates boolean state in the UI (enabled/disabled, on/off, active/inactive) and is used for immediate settings changes rather than form submissions requiring confirmation.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `isSelected={true}`)
- **Composed**: Via composition/children (e.g., `<Switch>{content}</Switch>`)
- **CSS-only**: Requires custom styling (e.g., `classNames={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content (labels) | ✅ | Composed | Children prop renders label text adjacent to switch: `<Switch>Label</Switch>` |
| Icons | ✅ | Native | Three icon positions: `thumbIcon` (inside toggle), `startContent` (leading), `endContent` (trailing) |
| Loading indicator | ❌ | N/A | Not documented - no built-in loading state |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Checked/Unchecked | ✅ | Native | `isSelected` (controlled) or `defaultSelected` (uncontrolled) boolean props |
| Disabled | ✅ | Native | `isDisabled` prop prevents interaction and applies disabled styling |
| Loading | ❌ | N/A | No documented loading state support |
| Read-only | ✅ | Native | `isReadOnly` prop prevents changes while maintaining visual state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop with values: `sm`, `md` (default), `lg` |
| Color options | ✅ | Native | `color` prop: default, primary (default), secondary, success, warning, danger |
| Label placement | ✅ | Composed | Label is children content, always positioned adjacent to switch. Icons can flank via `startContent`/`endContent` |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click to toggle | ✅ | Native | Standard click/tap interaction on switch or label toggles state |
| Keyboard control | ✅ | Native | Tab to focus, Space to toggle - built-in keyboard support via native input |
| onChange handler | ✅ | Native | `onChange` for native React.ChangeEvent, `onValueChange` for boolean value callback |
| Controlled mode | ✅ | Native | Use `isSelected` prop with `onValueChange` callback for controlled state |
| Uncontrolled mode | ✅ | Native | Use `defaultSelected` prop for uncontrolled initial state |

## Code Examples

### Basic Usage
```jsx
import {Switch} from "@heroui/react";

export default function App() {
  return (
    <Switch defaultSelected aria-label="Automatic updates" />
  );
}
```

### With Label
```jsx
<Switch defaultSelected>
  Automatic updates
</Switch>
```

### Disabled State
```jsx
<Switch defaultSelected isDisabled>
  Automatic updates
</Switch>
```

### Size Variations
```jsx
<Switch size="sm">Small</Switch>
<Switch size="md">Medium</Switch>
<Switch size="lg">Large</Switch>
```

### Color Variations
```jsx
<Switch defaultSelected color="default">Default</Switch>
<Switch defaultSelected color="primary">Primary</Switch>
<Switch defaultSelected color="secondary">Secondary</Switch>
<Switch defaultSelected color="success">Success</Switch>
<Switch defaultSelected color="warning">Warning</Switch>
<Switch defaultSelected color="danger">Danger</Switch>
```

### Controlled Mode
```jsx
import {Switch} from "@heroui/react";
import React from "react";

export default function App() {
  const [isSelected, setIsSelected] = React.useState(true);

  return (
    <Switch isSelected={isSelected} onValueChange={setIsSelected}>
      Airplane mode
    </Switch>
  );
}
```

### With Thumb Icon (Icon Inside Toggle)
```jsx
import {Switch} from "@heroui/react";
import {MoonIcon} from "./MoonIcon";
import {SunIcon} from "./SunIcon";

export default function App() {
  return (
    <Switch
      defaultSelected
      thumbIcon={({isSelected, className}) =>
        isSelected ? (
          <SunIcon className={className} />
        ) : (
          <MoonIcon className={className} />
        )
      }
    >
      Dark mode
    </Switch>
  );
}
```

### With Start and End Content (Flanking Icons)
```jsx
import {Switch} from "@heroui/react";
import {MoonIcon} from "./MoonIcon";
import {SunIcon} from "./SunIcon";

export default function App() {
  return (
    <Switch
      defaultSelected
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
    >
      Dark mode
    </Switch>
  );
}
```

### Custom Styling with classNames
```jsx
import {Switch, cn} from "@heroui/react";

export default function App() {
  return (
    <Switch
      defaultSelected
      classNames={{
        base: cn(
          "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
          "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
        wrapper: "p-0 h-4 overflow-visible",
        thumb: cn("w-6 h-6 border-2 shadow-lg",
          "group-data-[hover=true]:border-primary",
          "group-data-[selected=true]:ml-6",
          "group-data-[pressed=true]:w-7",
          "group-data-[selected]:group-data-[pressed]:ml-4",
        ),
      }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-medium">Enable notifications</p>
        <p className="text-tiny text-default-400">
          Get notified when someone comments on your post.
        </p>
      </div>
    </Switch>
  );
}
```

### Custom Implementation with useSwitch Hook
```jsx
import {useSwitch, VisuallyHidden} from "@heroui/react";

export default function App() {
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    defaultSelected: true,
  });

  return (
    <div className="flex flex-col gap-2">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div {...getWrapperProps()}>
          {isSelected ? "On" : "Off"}
        </div>
      </Component>
    </div>
  );
}
```

## Notable Features
- **Native HTML Input Foundation**: Built on native `<input>` element ensuring browser autofill support and standard form behavior
- **Flexible Icon System**: Three distinct icon positions - thumb icon (inside toggle), start content (leading), and end content (trailing)
- **Component Slots Architecture**: Exposes granular styling control through slots (base, wrapper, thumb, label, etc.) for advanced customization
- **Data Attributes for State**: Provides `data-selected`, `data-pressed`, `data-readonly`, `data-hover`, `data-focus`, `data-focus-visible`, `data-disabled` for CSS selectors
- **useSwitch Hook**: Advanced customization hook allows building completely custom switch implementations while maintaining accessibility
- **Animation Control**: `disableAnimation` prop allows disabling transitions for performance or preference
- **Form Integration**: Compatible with Formik, React Hook Form, and standard HTML form submission
- **Dual Event Handlers**: Supports both native `onChange` (React.ChangeEvent) and convenience `onValueChange` (boolean) callbacks
- **RTL Support**: Built-in right-to-left layout support
- **Keyboard Accessibility**: Full keyboard navigation (Tab for focus, Space for toggle) built-in via native input

## Research Notes
- HeroUI's Switch implementation prioritizes accessibility by building on native HTML input elements rather than purely custom implementations
- The component provides exceptional flexibility through three distinct icon integration patterns (thumbIcon, startContent, endContent), allowing for rich visual customization
- The slots-based styling system combined with the useSwitch hook demonstrates a progressive enhancement approach - simple cases are straightforward, complex customizations remain possible
- Unlike some frameworks that limit color options, HeroUI provides semantic color variants (success, warning, danger) alongside traditional options
- The documentation is particularly strong on showing practical patterns (dark mode toggle, notification settings) rather than abstract examples
- No loading state is documented, suggesting switches are meant for immediate state changes rather than async operations
- The read-only state is a valuable addition often missing from other implementations, allowing display of state without editability
- The classNames prop with Tailwind integration enables highly customized designs while maintaining the component's behavior and accessibility features
