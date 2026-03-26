# HeroUI - Button Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://www.heroui.com/docs/components/button
Status: ✅ Working
Version: Current
Last Verified: 2024-11-04

## Documentation Quality
Comprehensive - Excellent documentation with extensive examples, complete API reference, accessibility details, and customization options.

## Component Definition
- **Core purpose**: Provides a pressable element for triggering actions, form submissions, and navigation. Built on React Aria's usePress hook for cross-platform interaction handling.
- **Mental model**: A semantically-correct button element with built-in accessibility, interaction states (press, hover, focus), and visual variants. Users think of it as a styled, accessible button with predictable behavior across devices.
- **Semantic meaning**: Represents an actionable element in the UI that triggers immediate behavior or navigation. Communicates importance/urgency through color and variant combinations.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | Via `children` prop - accepts ReactNode |
| Icon support | ✅ | Native | `startContent` and `endContent` props for icons before/after text |
| Icon + Text | ✅ | Native | Combine `children` with `startContent` or `endContent` |
| Loading indicator | ✅ | Native | `isLoading` prop with built-in spinner, `spinner` prop for custom spinner, `spinnerPlacement` prop (start/end) |
| Custom content | ✅ | Composed | Children accepts any ReactNode for flexible composition |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Primary | ✅ | Native | `color="primary"` prop |
| Secondary | ✅ | Native | `color="secondary"` prop |
| Default | ✅ | Native | `color="default"` prop (gray appearance) |
| Ghost | ✅ | Native | `variant="ghost"` prop - transparent with hover effect |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `isDisabled` boolean prop, sets `data-disabled` attribute |
| Loading | ✅ | Native | `isLoading` boolean prop with built-in spinner, sets `data-loading` attribute |
| Active/Pressed | ✅ | Native | Automatic via React Aria's usePress, exposes `data-pressed` attribute during press |
| Hover | ✅ | Native | Automatic via useHover, exposes `data-hover` attribute |
| Focus | ✅ | Native | Automatic focus management, exposes `data-focus` and `data-focus-visible` attributes |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: `sm`, `md` (default), `lg` |
| Color options | ✅ | Native | `color` prop: `default`, `primary`, `secondary`, `success`, `warning`, `danger` |
| Variants | ✅ | Native | `variant` prop: `solid` (default), `bordered`, `light`, `flat`, `faded`, `shadow`, `ghost` |
| Radius options | ✅ | Native | `radius` prop: `none`, `sm`, `md`, `lg`, `full` |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | `onPress` event (React Aria), also `onPressStart`, `onPressEnd`, `onPressChange`, `onPressUp`, `onKeyDown`, `onKeyUp` |
| Button group | ✅ | Native | `ButtonGroup` component wraps multiple buttons with consistent styling props |
| As link | ⚠️ | Likely Native | Not explicitly shown but React Aria patterns typically support `href` prop for link behavior |
| Ripple effect | ✅ | Native | Built-in ripple animation on press, disable with `disableRipple` prop |
| Full width | ✅ | Native | `fullWidth` boolean prop makes button span container width |
| Icon only | ✅ | Native | `isIconOnly` boolean prop optimizes button for single icon display |

## Code Examples

### Basic Usage
```jsx
import {Button} from "@heroui/react";

export default function App() {
  return <Button color="primary">Button</Button>;
}
```

### Sizes
```jsx
import {Button} from "@heroui/react";

export default function App() {
  return (
    <div className="flex gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}
```

### Colors
```jsx
import {Button} from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Button color="default">Default</Button>
      <Button color="primary">Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="success">Success</Button>
      <Button color="warning">Warning</Button>
      <Button color="danger">Danger</Button>
    </div>
  );
}
```

### Variants
```jsx
import {Button} from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Button color="primary" variant="solid">Solid</Button>
      <Button color="primary" variant="faded">Faded</Button>
      <Button color="primary" variant="bordered">Bordered</Button>
      <Button color="primary" variant="light">Light</Button>
      <Button color="primary" variant="flat">Flat</Button>
      <Button color="primary" variant="ghost">Ghost</Button>
      <Button color="primary" variant="shadow">Shadow</Button>
    </div>
  );
}
```

### Radius Options
```jsx
import {Button} from "@heroui/react";

export default function App() {
  return (
    <div className="flex gap-4 items-center">
      <Button radius="full">Full</Button>
      <Button radius="lg">Large</Button>
      <Button radius="md">Medium</Button>
      <Button radius="sm">Small</Button>
      <Button radius="none">None</Button>
    </div>
  );
}
```

### Disabled State
```jsx
import {Button} from "@heroui/react";

export default function App() {
  return (
    <Button isDisabled color="primary">
      Button
    </Button>
  );
}
```

### Loading State
```jsx
import {Button} from "@heroui/react";

export default function App() {
  return (
    <Button isLoading color="primary">
      Loading
    </Button>
  );
}
```

### Custom Loading Spinner
```jsx
import {Button} from "@heroui/react";

export default function App() {
  return (
    <Button
      isLoading
      color="secondary"
      spinner={
        <svg
          className="animate-spin h-5 w-5 text-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          />
        </svg>
      }
    >
      Loading
    </Button>
  );
}
```

### With Icons
```jsx
import {Button} from "@heroui/react";

export const CameraIcon = ({fill = "currentColor", size, height, width, ...props}) => {
  return (
    <svg fill="none" height={size || height || 24} viewBox="0 0 24 24" width={size || width || 24} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path clipRule="evenodd" d="M17.44 6.236c.04.07.11.12.2.12 2.4 0 4.36 1.958 4.36 4.355v5.934A4.368 4.368 0 0117.64 21H6.36A4.361 4.361 0 012 16.645V10.71a4.361 4.361 0 014.36-4.355c.08 0 .16-.04.19-.12l.06-.12.106-.222a97.79 97.79 0 01.714-1.486C7.89 3.51 8.67 3.01 9.64 3h4.71c.97.01 1.76.51 2.22 1.408.157.315.397.822.629 1.31l.141.299.1.22zm-.73 3.836c0 .5.4.9.9.9s.91-.4.91-.9-.41-.909-.91-.909-.9.41-.9.91zm-6.44 1.548c.47-.47 1.08-.719 1.73-.719.65 0 1.26.25 1.72.71.46.459.71 1.068.71 1.717A2.438 2.438 0 0112 15.756c-.65 0-1.26-.25-1.72-.71a2.408 2.408 0 01-.71-1.717v-.01c-.01-.63.24-1.24.7-1.699zm4.5 4.485a3.91 3.91 0 01-2.77 1.15 3.921 3.921 0 01-3.93-3.926 3.865 3.865 0 011.14-2.767A3.921 3.921 0 0112 9.402c1.05 0 2.04.41 2.78 1.15.74.749 1.15 1.738 1.15 2.777a3.958 3.958 0 01-1.16 2.776z" fill={fill} fillRule="evenodd" />
    </svg>
  );
};

export const UserIcon = ({fill = "currentColor", size, height, width, ...props}) => {
  return (
    <svg
      data-name="Iconly/Curved/Profile"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} strokeWidth={1.5}>
        <path d="M11.845 21.662C8.153 21.662 5 21.088 5 18.787s3.133-4.425 6.845-4.425c3.692 0 6.845 2.1 6.845 4.4s-3.134 2.9-6.845 2.9z" data-name="Stroke 1" />
        <path d="M11.837 11.174a4.372 4.372 0 10-.031 0z" data-name="Stroke 3" />
      </g>
    </svg>
  );
};

export default function App() {
  return (
    <div className="flex gap-4 items-center">
      <Button color="success" endContent={<CameraIcon />}>
        Take a photo
      </Button>
      <Button color="danger" startContent={<UserIcon />} variant="bordered">
        Delete user
      </Button>
    </div>
  );
}
```

### Icon Only Button
```jsx
import {Button} from "@heroui/react";

export const HeartIcon = ({fill = "currentColor", filled, size, height, width, ...props}) => {
  return (
    <svg fill={filled ? fill : "none"} height={size || height || 24} viewBox="0 0 24 24" width={size || width || 24} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
    </svg>
  );
};

export default function App() {
  return (
    <div className="flex gap-4 items-center">
      <Button isIconOnly aria-label="Like" color="danger">
        <HeartIcon />
      </Button>
      <Button isIconOnly aria-label="Take a photo" color="warning" variant="faded">
        <CameraIcon />
      </Button>
    </div>
  );
}
```

### Custom Styles
```jsx
import {Button} from "@heroui/react";

export default function App() {
  return (
    <Button
      className="bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
      radius="full"
    >
      Button
    </Button>
  );
}
```

### Button Group
```jsx
import {Button, ButtonGroup} from "@heroui/react";

export default function App() {
  return (
    <ButtonGroup>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  );
}
```

### Button Group Disabled
```jsx
import {Button, ButtonGroup} from "@heroui/react";

export default function App() {
  return (
    <ButtonGroup isDisabled>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
  );
}
```

### Button Group with Dropdown (Common Pattern)
```jsx
import {Button, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import React from "react";

export const ChevronDownIcon = () => {
  return (
    <svg fill="none" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z" fill="currentColor" />
    </svg>
  );
};

export default function App() {
  const [selectedOption, setSelectedOption] = React.useState(new Set(["merge"]));

  const descriptionsMap = {
    merge: "All commits from the source branch are added to the destination branch via a merge commit.",
    squash: "All commits from the source branch are added to the destination branch as a single commit.",
    rebase: "All commits from the source branch are added to the destination branch individually.",
  };

  const labelsMap = {
    merge: "Create a merge commit",
    squash: "Squash and merge",
    rebase: "Rebase and merge",
  };

  const selectedOptionValue = Array.from(selectedOption)[0];

  return (
    <ButtonGroup variant="flat">
      <Button>{labelsMap[selectedOptionValue]}</Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly>
            <ChevronDownIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Merge options"
          className="max-w-[300px]"
          selectedKeys={selectedOption}
          selectionMode="single"
          onSelectionChange={setSelectedOption}
        >
          <DropdownItem key="merge" description={descriptionsMap["merge"]}>
            {labelsMap["merge"]}
          </DropdownItem>
          <DropdownItem key="squash" description={descriptionsMap["squash"]}>
            {labelsMap["squash"]}
          </DropdownItem>
          <DropdownItem key="rebase" description={descriptionsMap["rebase"]}>
            {labelsMap["rebase"]}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
}
```

### Custom Implementation with useButton Hook (JavaScript)
```jsx
import {forwardRef} from "react";
import {useButton, Ripple, Spinner} from "@heroui/react";

const MyButton = forwardRef((props, ref) => {
  const {
    domRef,
    children,
    spinnerSize,
    spinner = <Spinner color="current" size={spinnerSize} />,
    spinnerPlacement,
    startContent,
    endContent,
    isLoading,
    disableRipple,
    getButtonProps,
    getRippleProps,
  } = useButton({
    ref,
    ...props,
  });

  const {ripples, onClear} = getRippleProps();

  return (
    <button ref={domRef} {...getButtonProps()}>
      {startContent}
      {isLoading && spinnerPlacement === "start" && spinner}
      {children}
      {isLoading && spinnerPlacement === "end" && spinner}
      {endContent}
      {!disableRipple && <Ripple ripples={ripples} onClear={onClear} />}
    </button>
  );
});

MyButton.displayName = "MyButton";

export default MyButton;
```

### Custom Implementation with useButton Hook (TypeScript)
```tsx
import type {ButtonProps as BaseButtonProps} from "@heroui/react";
import {forwardRef} from "react";
import {useButton, Ripple, Spinner} from "@heroui/react";

export interface ButtonProps extends BaseButtonProps {}

const MyButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    domRef,
    children,
    spinnerSize,
    spinner = <Spinner color="current" size={spinnerSize} />,
    spinnerPlacement,
    startContent,
    endContent,
    isLoading,
    disableRipple,
    getButtonProps,
    getRippleProps,
  } = useButton({
    ref,
    ...props,
  });

  const {ripples, onClear} = getRippleProps();

  return (
    <button ref={domRef} {...getButtonProps()}>
      {startContent}
      {isLoading && spinnerPlacement === "start" && spinner}
      {children}
      {isLoading && spinnerPlacement === "end" && spinner}
      {endContent}
      {!disableRipple && <Ripple ripples={ripples} onClear={onClear} />}
    </button>
  );
});

MyButton.displayName = "MyButton";

export default MyButton;
```

## Notable Features

### 1. React Aria Foundation
- Built on Adobe's React Aria library for robust accessibility and cross-platform interaction handling
- Provides automatic keyboard support (Space and Enter keys)
- Handles touch, mouse, and keyboard events uniformly via `onPress` event
- Cross-browser focus management normalization

### 2. Data Attributes for Styling
Exposes comprehensive state via data attributes for CSS styling hooks:
- `data-hover` - Active during hover state
- `data-focus` - Active when focused
- `data-focus-visible` - Active during keyboard focus
- `data-disabled` - Set when disabled
- `data-pressed` - Active during press interaction
- `data-loading` - Set when loading

### 3. Ripple Effect
- Built-in Material Design-style ripple animation on press
- Automatic positioning and animation
- Optionally disable with `disableRipple` prop
- Integrated into `useButton` hook for custom implementations

### 4. Spinner System
- Built-in loading spinner with automatic positioning
- Custom spinner support via `spinner` prop
- Control placement with `spinnerPlacement` (start/end)
- Spinner size automatically adjusts based on button size

### 5. ButtonGroup Coordination
- Wraps multiple buttons with consistent styling
- Props cascade to all child buttons (variant, color, size, radius)
- Common use case: Action button + dropdown trigger combination
- Default radius for groups: `xl`
- Full-width support for grouped buttons

### 6. Advanced Customization
- Tailwind Merge integration prevents style class conflicts
- Support for custom className for Tailwind utilities
- `useButton` hook exposes low-level control for custom implementations
- Render props pattern via hook for maximum flexibility

### 7. Animation Control
- `disableAnimation` prop to disable all animations
- `disableRipple` prop for just ripple effects
- Useful for reduced motion preferences or performance optimization

### 8. Installation Flexibility
- CLI tool: `npx heroui-cli@latest add button`
- Manual package installation via npm, yarn, pnpm, bun
- Modular exports: `Button` and `ButtonGroup` components
- TypeScript support with full type definitions

## Research Notes

### Framework Architecture Observations

**React-First Design**: HeroUI's Button is deeply integrated with React patterns - hooks, forwardRef, state management. This differs from web components approaches and would require significant adaptation for framework-agnostic implementations.

**Composition Strategy**: The component favors explicit props (`startContent`, `endContent`, `isIconOnly`) over slot-based composition, providing type-safe APIs but less flexible content projection compared to web components.

**Event Handling Philosophy**: Uses React Aria's `onPress` abstraction rather than native DOM events. This provides unified behavior across platforms but requires understanding a non-standard event model. The framework deprecates `onClick` in favor of `onPress`.

**State Exposure via Data Attributes**: Smart pattern for enabling CSS-based state styling without JavaScript. The `data-*` attributes (`data-hover`, `data-pressed`, etc.) allow external styling to respond to internal state changes. This could be valuable for web component implementations.

**Spinner Integration Pattern**: Rather than requiring users to manage loading state UI separately, the button integrates spinner display with `isLoading` + `spinner` + `spinnerPlacement` props. This "batteries included" approach reduces boilerplate but increases component complexity.

**ButtonGroup Cascading Props**: The ButtonGroup pattern where parent props cascade to children is elegant but requires tight coupling between the group and button components. In web components, this might be achieved via CSS custom properties or context APIs.

**Ripple as Separate Component**: The ripple effect is abstracted into a `<Ripple>` component that can be composed. This modular approach allows ripple effects to be added to other interactive elements beyond buttons.

**Hook-Based Customization**: The `useButton` hook pattern exposes all internal logic for custom implementations. This is a powerful React pattern but has no direct equivalent in web components - closest would be base classes or mixins.

**Accessibility First**: Building on React Aria ensures WCAG compliance out of the box. Key lesson: accessibility shouldn't be an afterthought but baked into the component's foundation.

### Cross-Framework Considerations

For adapting these patterns to web components (like Semantic UI):

1. **Replace `onPress` with standard events**: Use `click`, but handle touch/keyboard consistently
2. **Data attributes are portable**: The `data-*` state pattern works identically in web components
3. **Slot-based composition**: Replace `startContent`/`endContent` with `<slot name="start">` and `<slot name="end">`
4. **CSS custom properties**: Use for theme integration instead of Tailwind className
5. **Settings proxy pattern**: Could mirror the props API with a reactive settings object
6. **Animation Web APIs**: Use Web Animations API instead of CSS classes for ripple effect
7. **Part-based styling**: Expose shadow parts for button internals (spinner, ripple, content areas)

### API Design Insights

**Boolean Prop Naming**: Uses `isDisabled`, `isLoading`, `isIconOnly` prefix convention - more verbose but clearer intent than `disabled`, `loading`, `iconOnly`.

**Variant + Color Orthogonality**: Smart to separate visual style (`variant`: solid/ghost/bordered) from semantic meaning (`color`: primary/danger/success). This creates a combinatorial design space without explosion of props.

**Size Constraints**: Only 3 sizes (sm/md/lg) keeps the API focused. More granularity would increase complexity without proportional value.

**Radius as First-Class Prop**: Making border-radius a top-level prop (`none`/`sm`/`md`/`lg`/`full`) acknowledges its importance in modern design systems. Many frameworks bury this in className.

**Spinner Customization**: Providing both default spinner and custom `spinner` prop hits the sweet spot - works out of the box but allows brand-specific loading indicators.

### Potential Improvements

1. **Link Button Pattern**: Documentation doesn't clearly show `href` prop usage for rendering as `<a>` tag. This is a common use case.
2. **Loading State Accessibility**: Should announce loading state to screen readers via `aria-busy` or live region.
3. **Pressed State Persistence**: No API shown for "pressed" toggle buttons (like a selected state in a toolbar).
4. **Async Action Handling**: Could provide `onPressAsync` that automatically manages loading state during promise resolution.
5. **Keyboard Shortcuts**: No visible prop for displaying keyboard shortcuts (like `⌘K`) in button labels.
6. **Icon Size Control**: No apparent way to control icon size independently from button size.
7. **Badge/Notification Indicator**: No pattern shown for notification badges on buttons (common in toolbars/nav).
