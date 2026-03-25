# HeroUI/NextUI - Drawer Usage Patterns

## Component URL
https://www.heroui.com/docs/components/drawer
Status: ✅ Working

## Documentation Quality
Excellent - Comprehensive documentation with multiple practical code examples, detailed API reference, accessibility features, and various usage patterns. Clear explanations of all props and behaviors.

## Component Definition
- **Core purpose**: Displays a panel that slides in from the edge of the screen, containing supplementary content such as forms, navigation, or additional information
- **Mental model**: A slide-out panel overlay - users think of it as a temporary side panel that can be dismissed
- **Semantic meaning**: Represents a temporary contextual workspace that overlays the main content without disrupting the user's current location in the application

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Primary use case - content in DrawerBody, titles in DrawerHeader |
| Icon support | ❌ | No explicit icon integration shown, but can be added via custom content |
| Media support | ✅ | Demonstrated in custom styles example with images |
| Custom content | ✅ | Full flexibility - can contain any React components |
| Form integration | ✅ | Specific example with Input, Checkbox, and Link components |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled | ✅ | `isOpen` + `onOpenChange` props for external state management |
| Uncontrolled | ✅ | `defaultOpen` prop for internal state management |
| Dismissible | ✅ | Default behavior with `isDismissable={true}` |
| Non-dismissible | ✅ | `isDismissable={false}` + `isKeyboardDismissDisabled={true}` |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Open/Closed | ✅ | Controlled via `isOpen` prop with `data-open` attribute |
| Loading | ❌ | No built-in loading state |
| Disabled | ❌ | No disabled state (N/A for overlay components) |
| Interactive | ✅ | Contains interactive elements (buttons, forms, links) |
| Dismissable state | ✅ | Tracked via `data-dismissable` attribute |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | Nine sizes: `xs`, `sm`, `md` (default), `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `full` |
| Placement | ✅ | Four positions: `left`, `right` (default), `top`, `bottom` |
| Backdrop styles | ✅ | Three options: `opaque` (default), `blur`, `transparent` |
| Border radius | ✅ | Four options: `none`, `sm`, `md`, `lg` (default) |
| Close button | ✅ | Can be hidden with `hideCloseButton={true}` or customized with `closeButton` prop |

## Structural Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Composite structure | ✅ | Five components: Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter |
| Header section | ✅ | DrawerHeader for titles and top content |
| Body section | ✅ | DrawerBody for main scrollable content |
| Footer section | ✅ | DrawerFooter for action buttons |
| Close button | ✅ | Automatic close button in header (can be hidden) |

## Animation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Slide transitions | ✅ | Default slide-in animation from placement edge |
| Custom animations | ✅ | `motionProps` with Framer Motion variants |
| Backdrop animation | ✅ | Fade-in overlay animation |
| Disable animations | ✅ | `disableAnimation={false}` prop |

## Interaction Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Overlay click | ✅ | Closes drawer by default, controlled by `isDismissable` |
| Keyboard dismiss | ✅ | ESC key closes drawer, controlled by `isKeyboardDismissDisabled` |
| Focus trapping | ✅ | Automatic focus management within drawer |
| Scroll blocking | ✅ | Prevents page scroll with `shouldBlockScroll={true}` (default) |
| Focus restoration | ✅ | Returns focus to trigger element on close |

## Code Examples

### Basic Usage
```jsx
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function App() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Open Drawer</Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Drawer Title
              </DrawerHeader>
              <DrawerBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                </p>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

### Size Variants
```jsx
export default function App() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [size, setSize] = React.useState("md");
  const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "full"];

  const handleOpen = (size) => {
    setSize(size);
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <Button key={size} onPress={() => handleOpen(size)}>
            Open {size}
          </Button>
        ))}
      </div>
      <Drawer isOpen={isOpen} size={size} onClose={onClose}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>Drawer Title</DrawerHeader>
              <DrawerBody>
                <p>Drawer content goes here...</p>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

### Non-Dismissible Drawer
```jsx
<Drawer
  isDismissable={false}
  isKeyboardDismissDisabled={true}
  isOpen={isOpen}
  onOpenChange={onOpenChange}
>
  <DrawerContent>
    {(onClose) => (
      <>
        <DrawerHeader>Non Dismissable Drawer</DrawerHeader>
        <DrawerBody>
          <p>Click close button only to close this drawer.</p>
        </DrawerBody>
        <DrawerFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={onClose}>
            Action
          </Button>
        </DrawerFooter>
      </>
    )}
  </DrawerContent>
</Drawer>
```

### Placement Options
```jsx
export default function App() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [placement, setPlacement] = React.useState("left");

  const handleOpen = (placement) => {
    setPlacement(placement);
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {["left", "right", "top", "bottom"].map((placement) => (
          <Button key={placement} onPress={() => handleOpen(placement)}>
            Open {placement}
          </Button>
        ))}
      </div>
      <Drawer
        isOpen={isOpen}
        placement={placement}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>{placement} Drawer</DrawerHeader>
              <DrawerBody>
                <p>This drawer slides from the {placement}.</p>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

### Form Integration
```jsx
<Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
  <DrawerContent>
    {(onClose) => (
      <>
        <DrawerHeader>Sign In</DrawerHeader>
        <DrawerBody>
          <Input
            label="Email"
            placeholder="Enter your email"
            variant="bordered"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            variant="bordered"
          />
          <div className="flex py-2 px-1 justify-between">
            <Checkbox>Remember me</Checkbox>
            <Link color="primary" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={onClose}>
            Sign In
          </Button>
        </DrawerFooter>
      </>
    )}
  </DrawerContent>
</Drawer>
```

### Backdrop Variations
```jsx
export default function App() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("opaque");
  const backdrops = ["opaque", "blur", "transparent"];

  const handleOpen = (backdrop) => {
    setBackdrop(backdrop);
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {backdrops.map((backdrop) => (
          <Button key={backdrop} onPress={() => handleOpen(backdrop)}>
            {backdrop}
          </Button>
        ))}
      </div>
      <Drawer
        backdrop={backdrop}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader>Backdrop: {backdrop}</DrawerHeader>
              <DrawerBody>
                <p>This drawer has {backdrop} backdrop.</p>
              </DrawerBody>
              <DrawerFooter>
                <Button onPress={onClose}>Close</Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

### Custom Motion Animation
```jsx
<Drawer
  isOpen={isOpen}
  motionProps={{
    variants: {
      enter: {
        opacity: 1,
        x: 0,
        duration: 0.3,
      },
      exit: {
        x: 100,
        opacity: 0,
        duration: 0.3,
      },
    },
  }}
  onOpenChange={onOpenChange}
>
  <DrawerContent>
    {(onClose) => (
      <>
        <DrawerHeader>Custom Animation</DrawerHeader>
        <DrawerBody>
          <p>This drawer has custom enter/exit animations.</p>
        </DrawerBody>
        <DrawerFooter>
          <Button onPress={onClose}>Close</Button>
        </DrawerFooter>
      </>
    )}
  </DrawerContent>
</Drawer>
```

### Custom Styling with Slots
```jsx
<Drawer
  isOpen={isOpen}
  onOpenChange={onOpenChange}
  classNames={{
    base: "custom-base-class",
    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
    header: "border-b-[1px] border-zinc-700",
    body: "custom-body-class",
    footer: "border-t-[1px] border-zinc-700",
    closeButton: "hover:bg-white/5 active:bg-white/10",
  }}
>
  <DrawerContent>
    {(onClose) => (
      <>
        <DrawerHeader>Styled Drawer</DrawerHeader>
        <DrawerBody>
          <p>Custom styled drawer with slot-based styling.</p>
        </DrawerBody>
        <DrawerFooter>
          <Button onPress={onClose}>Close</Button>
        </DrawerFooter>
      </>
    )}
  </DrawerContent>
</Drawer>
```

## Notable Features
- **React Aria Foundation**: Built on React Aria's overlay primitives for robust accessibility
- **Framer Motion Integration**: Smooth animations with customizable motion props
- **Server Component Compatible**: Works with Next.js Server Components
- **Composite Architecture**: Five specialized sub-components for structured content layout
- **Focus Management**: Automatic focus trapping and restoration
- **Portal Rendering**: Avoids CSS stacking context issues via configurable portal container
- **Render Props Pattern**: DrawerContent uses children-as-function to provide `onClose` callback
- **Data Attributes**: Exposes `data-open` and `data-dismissable` for CSS targeting
- **Extensive Size Options**: Nine predefined sizes from `xs` to `full`
- **Multi-Directional**: Slides from any edge (left, right, top, bottom)
- **Backdrop Control**: Three distinct backdrop styles with visual effects
- **Keyboard Navigation**: ESC key support with optional disable
- **Scroll Management**: Prevents body scroll while drawer is open
- **Flexible Dismissal**: Configurable overlay click and keyboard behavior
- **Custom Animations**: Full Framer Motion variant support
- **Slot-Based Styling**: Granular control over wrapper, base, backdrop, header, body, footer, and closeButton styles

## API Reference

### Drawer Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | — | Controls open/closed state (controlled) |
| `defaultOpen` | boolean | — | Initial open state (uncontrolled) |
| `size` | `xs\|sm\|md\|lg\|xl\|2xl\|3xl\|4xl\|5xl\|full` | `md` | Width/height of the drawer |
| `placement` | `left\|right\|top\|bottom` | `right` | Edge from which drawer slides |
| `radius` | `none\|sm\|md\|lg` | `lg` | Border radius of drawer corners |
| `isDismissable` | boolean | `true` | Allow closing via overlay click |
| `isKeyboardDismissDisabled` | boolean | `false` | Disable ESC key dismissal |
| `shouldBlockScroll` | boolean | `true` | Prevent page scrolling when open |
| `hideCloseButton` | boolean | `false` | Hide default close button |
| `disableAnimation` | boolean | `false` | Remove slide animations |
| `backdrop` | `transparent\|opaque\|blur` | `opaque` | Overlay backdrop style |
| `motionProps` | MotionProps | — | Framer Motion animation config |
| `portalContainer` | HTMLElement | `document.body` | Mount location for portal |
| `closeButton` | ReactNode | — | Custom close button element |
| `classNames` | object | — | Slot-based style overrides |
| `onOpenChange` | (isOpen: boolean) => void | — | Callback when open state changes |
| `onClose` | () => void | — | Callback when drawer closes |

### Component Structure
```
Drawer (wrapper)
└── DrawerContent (main container)
    ├── DrawerHeader (optional header section)
    ├── DrawerBody (scrollable content area)
    └── DrawerFooter (optional footer section)
```

### Slots for classNames Prop
- `wrapper`: Outer container element
- `base`: Main drawer content area
- `backdrop`: Overlay behind drawer
- `header`: Header section container
- `body`: Body section container
- `footer`: Footer section container
- `closeButton`: Close button element

## Accessibility Features
- **Focus Trapping**: Focus remains within drawer while open
- **Focus Restoration**: Returns focus to trigger element on close
- **Keyboard Navigation**: ESC key closes drawer (configurable)
- **Screen Reader Support**: Proper ARIA attributes for overlay semantics
- **Inert Content**: Content outside drawer becomes inert when open
- **Scroll Management**: Prevents background scroll, improves keyboard navigation
- **React Aria Foundation**: Leverages battle-tested accessibility primitives

## Research Notes
- Part of HeroUI library (previously NextUI v2), modern React UI framework
- Documentation is comprehensive with practical examples for all major features
- Heavily integrated with Tailwind CSS for styling customization
- Uses `useDisclosure()` hook pattern for state management (common HeroUI pattern)
- Render props pattern (`children` as function) provides elegant `onClose` access
- Framer Motion integration allows sophisticated custom animations
- Portal rendering prevents z-index stacking issues
- Nine size variants provide flexibility from compact to fullscreen
- Four-directional placement makes it versatile for different UI layouts
- Backdrop blur effect leverages modern CSS backdrop-filter
- Data attributes enable state-based CSS styling without JavaScript
- Form integration example demonstrates real-world use case
- Non-dismissible variant useful for required user interactions (e.g., unsaved changes)
- Composite component structure promotes semantic HTML organization
- Server Component compatibility important for Next.js ecosystem
- Focus management handles complex scenarios (nested focusables, restoration)
- Slot-based styling system provides granular customization without prop explosion
