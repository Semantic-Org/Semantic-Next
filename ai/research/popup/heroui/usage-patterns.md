# HeroUI - Popover Usage Patterns

## Component URL
https://www.heroui.com/docs/components/popover
Status: ✅ Working

## Documentation Quality
Excellent - Comprehensive examples with complete code implementations, detailed API documentation, and practical real-world use cases. Well-organized with clear explanations of all features and accessibility considerations.

## Component Definition
- **Core purpose**: A non-modal dialog that floats around its disclosure, used for displaying additional rich content on top of something
- **Mental model**: A floating overlay that appears near a trigger element - users think of it as contextual information or actions that appear on demand
- **Semantic meaning**: Provides supplemental information or functionality without interrupting the main workflow, offering contextual help, settings, or additional details

## Trigger Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Click trigger | ✅ | Default behavior - PopoverTrigger wraps any focusable element (Button, User, custom elements) |
| Hover trigger | ❌ | Not shown in documentation |
| Focus trigger | ✅ | Implicit - any focusable element can trigger |
| Custom triggers | ✅ | Supports wrapping any interactive element including User components, Avatars, custom elements |
| Trigger scaling | ✅ | `triggerScaleOnOpen={true}` (default) - scales trigger down when popover opens |
| Programmatic control | ✅ | Controlled via `isOpen` prop and `onOpenChange` callback |

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Simple div-based text content with headings and descriptions |
| Rich content | ✅ | Supports Cards, User profiles, complex layouts |
| Form inputs | ✅ | Full form support with Input components, focus management |
| Title props | ✅ | Function-as-children pattern provides `titleProps` for proper heading semantics |
| Custom content | ✅ | Completely flexible - any React components or HTML |
| Fixed width | ✅ | Width control via className (e.g., `className="w-[240px]"`) |

## Positioning Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| 12 placements | ✅ | top, bottom, left, right with -start and -end variants |
| Offset control | ✅ | `offset={number}` - distance between trigger and popover (default: 7px) |
| Cross offset | ✅ | `crossOffset={number}` - cross-axis adjustment (default: 0) |
| Container padding | ✅ | `containerPadding={number}` - spacing from viewport edges (default: 12px) |
| Auto-flip | ✅ | `shouldFlip={true}` (default) - automatically repositions to avoid overflow |
| Arrow indicator | ✅ | `showArrow={true}` - displays directional arrow pointing to trigger |

## Behavior Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Controlled mode | ✅ | `isOpen` and `onOpenChange` props for external state management |
| Uncontrolled mode | ✅ | `defaultOpen` prop for initial state without external control |
| Escape dismissal | ✅ | Escape key closes popover (can disable with `isKeyboardDismissDisabled`) |
| Outside click | ✅ | Clicking outside closes popover, customizable with `shouldCloseOnInteractOutside` |
| Blur closing | ✅ | `shouldCloseOnBlur` prop for focus-based closing |
| Scroll behavior | ✅ | `shouldCloseOnScroll={true}` (default) - closes on scroll events |
| Scroll blocking | ✅ | `shouldBlockScroll={true}` - prevents scrolling outside popover |
| Focus management | ✅ | Focus moves to popover on mount, restores to trigger on close |
| Portal rendering | ✅ | Renders to `document.body` by default, customizable with `portalContainer` |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Keyboard navigation | ✅ | Escape key dismissal, focus management |
| Focus tracking | ✅ | `data-focus` and `data-focus-visible` attributes for focus state |
| ARIA semantics | ✅ | Automatic semantic association between trigger and popover |
| Backdrop blocking | ✅ | Prevents interaction outside popover when backdrop is active |
| Animation control | ✅ | Custom motion props via Framer Motion integration |
| State callbacks | ✅ | `onOpenChange` and `onClose` event handlers |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Open state | ✅ | Tracked via `data-open` attribute and `isOpen` prop |
| Placement state | ✅ | Reflected in `data-placement` attribute for styling/animation |
| Focus state | ✅ | `data-focus` and `data-focus-visible` data attributes |
| Loading state | ❌ | Not shown in documentation |
| Disabled state | ❌ | Not documented (though trigger can be disabled) |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | sm, md (default), lg - controls content font sizing |
| Color themes | ✅ | default, primary, secondary, success, warning, danger, foreground |
| Radius options | ✅ | none, sm, md, lg, full (default: lg) |
| Shadow depth | ✅ | none, sm, md, lg (default: lg) |
| Backdrop types | ✅ | transparent (default), opaque, blur |
| Style variants | ✅ | solid, bordered, flat, faded, shadow |
| Arrow styling | ✅ | Arrow color inherits from popover color theme |
| Custom styling | ✅ | `classNames` prop for base, trigger, backdrop, content slots |

## Code Examples

### Basic Usage
```jsx
import {Popover, PopoverTrigger, PopoverContent, Button} from "@heroui/react";

export default function App() {
  return (
    <Popover placement="right">
      <PopoverTrigger>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Popover Content</div>
          <div className="text-tiny">This is the popover content</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### With Arrow
```jsx
import {Popover, PopoverTrigger, PopoverContent, Button} from "@heroui/react";

export default function App() {
  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Popover Content</div>
          <div className="text-tiny">This is the popover content</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### All Placements
```jsx
import {Popover, PopoverTrigger, PopoverContent, Button} from "@heroui/react";

export default function App() {
  const content = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="text-small font-bold">Popover Content</div>
        <div className="text-tiny">This is the popover content</div>
      </div>
    </PopoverContent>
  );

  const placements = [
    "top-start", "top", "top-end",
    "bottom-start", "bottom", "bottom-end",
    "right-start", "right", "right-end",
    "left-start", "left", "left-end",
  ];

  return (
    <div className="flex flex-wrap md:inline-grid md:grid-cols-3 gap-4">
      {placements.map((placement) => (
        <Popover key={placement} color="secondary" placement={placement}>
          <PopoverTrigger>
            <Button className="capitalize" color="secondary" variant="flat">
              {placement.replace("-", " ")}
            </Button>
          </PopoverTrigger>
          {content}
        </Popover>
      ))}
    </div>
  );
}
```

### Color Variants
```jsx
import {Popover, PopoverTrigger, PopoverContent, Button} from "@heroui/react";

export default function App() {
  const content = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="text-small font-bold">Popover Content</div>
        <div className="text-tiny">This is the popover content</div>
      </div>
    </PopoverContent>
  );

  const colors = ["default", "primary", "secondary", "success", "warning", "danger", "foreground"];

  return (
    <div className="flex flex-wrap gap-4">
      {colors.map((color) => (
        <Popover key={color} color={color} placement="top">
          <PopoverTrigger>
            <Button className="capitalize" color={color}>
              {color}
            </Button>
          </PopoverTrigger>
          {content}
        </Popover>
      ))}
    </div>
  );
}
```

### Custom Offset
```jsx
import {Popover, PopoverTrigger, PopoverContent, Button} from "@heroui/react";

export default function App() {
  return (
    <Popover showArrow offset={20} placement="bottom">
      <PopoverTrigger>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Popover Content</div>
          <div className="text-tiny">This is the popover content</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### Controlled State
```jsx
import {Popover, PopoverTrigger, PopoverContent, Button} from "@heroui/react";

export default function App() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <PopoverTrigger>
          <Button>Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-bold">Popover Content</div>
            <div className="text-tiny">This is the popover content</div>
          </div>
        </PopoverContent>
      </Popover>
      <p className="text-small text-default-400">Open: {isOpen ? "true" : "false"}</p>
    </div>
  );
}
```

### With Title Props (Accessibility)
```jsx
import {Popover, PopoverTrigger, PopoverContent, Button} from "@heroui/react";

export default function App() {
  return (
    <Popover placement="right">
      <PopoverTrigger>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        {(titleProps) => (
          <div className="px-1 py-2">
            <h3 className="text-small font-bold" {...titleProps}>
              Popover Content
            </h3>
            <div className="text-tiny">This is the popover content</div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
```

### With Form Inputs
```jsx
import {Popover, PopoverTrigger, PopoverContent, Button, Input} from "@heroui/react";

export default function App() {
  return (
    <Popover showArrow offset={10} placement="bottom">
      <PopoverTrigger>
        <Button color="primary">Customize</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        {(titleProps) => (
          <div className="px-1 py-2 w-full">
            <p className="text-small font-bold text-foreground" {...titleProps}>
              Dimensions
            </p>
            <div className="mt-2 flex flex-col gap-2 w-full">
              <Input defaultValue="100%" label="Width" size="sm" variant="bordered" />
              <Input defaultValue="300px" label="Max. width" size="sm" variant="bordered" />
              <Input defaultValue="24px" label="Height" size="sm" variant="bordered" />
              <Input defaultValue="30px" label="Max. height" size="sm" variant="bordered" />
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
```

### Backdrop Variants
```jsx
import {Popover, PopoverTrigger, PopoverContent, Button, Input} from "@heroui/react";

export default function App() {
  const backdrops = ["opaque", "blur", "transparent"];

  const content = (
    <PopoverContent className="w-[240px]">
      {(titleProps) => (
        <div className="px-1 py-2 w-full">
          <p className="text-small font-bold text-foreground" {...titleProps}>
            Dimensions
          </p>
          <div className="mt-2 flex flex-col gap-2 w-full">
            <Input defaultValue="100%" label="Width" size="sm" variant="bordered" />
            <Input defaultValue="300px" label="Max. width" size="sm" variant="bordered" />
            <Input defaultValue="24px" label="Height" size="sm" variant="bordered" />
            <Input defaultValue="30px" label="Max. height" size="sm" variant="bordered" />
          </div>
        </div>
      )}
    </PopoverContent>
  );

  return (
    <div className="flex flex-wrap gap-4">
      {backdrops.map((backdrop) => (
        <Popover key={backdrop} showArrow backdrop={backdrop} offset={10} placement="bottom">
          <PopoverTrigger>
            <Button className="capitalize" color="warning" variant="flat">
              {backdrop}
            </Button>
          </PopoverTrigger>
          {content}
        </Popover>
      ))}
    </div>
  );
}
```

### Custom Motion Animation
```jsx
import {Popover, PopoverTrigger, PopoverContent, Button} from "@heroui/react";

export default function App() {
  return (
    <Popover
      showArrow
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            duration: 0.1,
            transition: {
              opacity: {
                duration: 0.15,
              },
            },
          },
          exit: {
            y: "10%",
            opacity: 0,
            duration: 0,
            transition: {
              opacity: {
                duration: 0.1,
              },
            },
          },
        },
      }}
      offset={10}
      placement="bottom"
    >
      <PopoverTrigger>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Popover Content</div>
          <div className="text-tiny">This is the popover content</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### Custom Trigger (User Card)
```jsx
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Popover,
  PopoverTrigger,
  PopoverContent,
  User,
} from "@heroui/react";

export const UserTwitterCard = () => {
  const [isFollowed, setIsFollowed] = React.useState(false);

  return (
    <Card className="max-w-[300px] border-none bg-transparent" shadow="none">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">Zoey Lang</h4>
            <h5 className="text-small tracking-tight text-default-500">@zoeylang</h5>
          </div>
        </div>
        <Button
          className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0">
        <p className="text-small pl-px text-default-500">
          Full-stack developer, @hero_ui lover she/her
          <span aria-label="confetti" role="img">
            🎉
          </span>
        </p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">4</p>
          <p className=" text-default-500 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">97.1K</p>
          <p className="text-default-500 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <User
          as="button"
          avatarProps={{
            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
          }}
          className="transition-transform"
          description="Product Designer"
          name="Zoe Lang"
        />
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <UserTwitterCard />
      </PopoverContent>
    </Popover>
  );
}
```

### Custom Styles
```jsx
import {Popover, PopoverTrigger, PopoverContent, Button} from "@heroui/react";

export default function App() {
  return (
    <Popover
      showArrow
      backdrop="opaque"
      classNames={{
        base: [
          "before:bg-default-200",
        ],
        content: [
          "py-3 px-4 border border-default-200",
          "bg-linear-to-br from-white to-default-300",
          "dark:from-default-100 dark:to-default-50",
        ],
      }}
      placement="right"
    >
      <PopoverTrigger>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        {(titleProps) => (
          <div className="px-1 py-2">
            <h3 className="text-small font-bold" {...titleProps}>
              Popover Content
            </h3>
            <div className="text-tiny">This is the popover content</div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
```

## API Reference

### Popover Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children*` | `ReactNode[]` | - | Contains PopoverTrigger and PopoverContent |
| `size` | `sm \| md \| lg` | `md` | Content font sizing |
| `color` | `default \| primary \| secondary \| success \| warning \| danger` | `default` | Color theme variant |
| `radius` | `none \| sm \| md \| lg \| full` | `lg` | Border radius styling |
| `shadow` | `none \| sm \| md \| lg` | `lg` | Shadow depth |
| `backdrop` | `transparent \| opaque \| blur` | `transparent` | Background overlay type |
| `placement` | `PopoverPlacement` | `bottom` | Positioning relative to trigger |
| `state` | `OverlayTriggerState` | - | Controlled state object |
| `isOpen` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | - | Initial uncontrolled state |
| `offset` | `number` | `7` | Distance between reference and popover (in pixels) |
| `containerPadding` | `number` | `12` | Placement padding buffer from viewport edges |
| `crossOffset` | `number` | `0` | Cross-axis offset adjustment |
| `triggerType` | `dialog \| menu \| listbox \| tree \| grid` | `dialog` | Overlay behavior type |
| `showArrow` | `boolean` | `false` | Display directional arrow |
| `shouldFlip` | `boolean` | `true` | Auto-reposition to avoid overflow |
| `triggerScaleOnOpen` | `boolean` | `true` | Trigger scale animation on open |
| `shouldBlockScroll` | `boolean` | `false` | Prevent external scrolling |
| `shouldCloseOnScroll` | `boolean` | `true` | Close on scroll events |
| `isKeyboardDismissDisabled` | `boolean` | `false` | Disable Escape key closing |
| `shouldCloseOnBlur` | `boolean` | `false` | Close when focus leaves |
| `motionProps` | `MotionProps` | - | Framer Motion animation config |
| `portalContainer` | `HTMLElement` | `document.body` | Portal mount location |
| `disableAnimation` | `boolean` | `false` | Disable animations |
| `classNames` | `Record<'base' \| 'trigger' \| 'backdrop' \| 'content', string>` | - | Custom slot classes |

### Popover Events

| Event | Type | Description |
|-------|------|-------------|
| `onOpenChange` | `(isOpen: boolean) => void` | Fires when open state changes |
| `shouldCloseOnInteractOutside` | `(e: HTMLElement) => void` | Controls external interaction closing |
| `onClose` | `() => void` | Fires when popover closes |

### PopoverTrigger Props

| Prop | Type | Description |
|------|------|-------------|
| `children*` | `ReactNode` | Focusable trigger element (must be a single interactive element) |

### PopoverContent Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode \| (titleProps) => ReactNode` | Content displayed when triggered, can be function receiving titleProps |

### Slots

- **base**: Main wrapper containing content and arrow pseudo-element (styled via `:before`)
- **trigger**: Trigger element styling
- **backdrop**: Overlay background styling
- **content**: Inner content container

### Data Attributes

- `data-open`: Boolean attribute reflecting current open state
- `data-placement`: Current placement value, used to position arrow correctly
- `data-focus`: Present when popover or trigger has focus
- `data-focus-visible`: Present when keyboard focus is active (not mouse click)

### Popover Placement Type

```typescript
type PopoverPlacement =
  "top" | "bottom" | "right" | "left" |
  "top-start" | "top-end" | "bottom-start" |
  "bottom-end" | "left-start" | "left-end" |
  "right-start" | "right-end"
```

## Notable Features

### Architecture & Foundation
- **React Aria Integration**: Built on React Aria's overlay primitives for accessibility compliance
- **Popper.js Positioning**: Uses advanced positioning engine for intelligent placement
- **Server Component Compatible**: Works with Next.js Server Components
- **Portal Rendering**: Renders content to document.body (or custom container) to avoid z-index issues

### Accessibility Features
- **ARIA Semantics**: Automatic semantic association between trigger and popover
- **Focus Management**: Focus moves to popover on mount, restores to trigger on close
- **Screen Reader Support**: Content outside popover hidden from assistive technologies while open
- **Keyboard Navigation**: Escape key dismissal, full keyboard support
- **Title Props Pattern**: Function-as-children provides proper heading attributes for accessibility

### Positioning Intelligence
- **Auto-flip**: Automatically repositions to stay in viewport
- **Edge Detection**: Prevents overflow with containerPadding
- **Arrow Positioning**: Arrow automatically adjusts based on placement
- **Flexible Offset**: Fine-grained control over spacing

### Customization System
- **Slots System**: Base, trigger, backdrop, content slots for granular styling
- **Framer Motion Integration**: Full control over enter/exit animations with custom variants
- **Tailwind-First**: Leverages Tailwind CSS for styling and spacing
- **Theme Colors**: Integrated color system matching HeroUI design tokens
- **Custom Trigger Support**: Any focusable element can be wrapped as trigger

### Behavior Control
- **Controlled/Uncontrolled Modes**: Flexible state management patterns
- **Event Callbacks**: Rich callback system for state changes and user interactions
- **Scroll Handling**: Configurable scroll blocking and close-on-scroll behavior
- **Interaction Control**: Fine-grained control over dismiss triggers
- **Animation Control**: Can disable animations or provide custom motion props

### Developer Experience
- **Minimal API**: Simple, intuitive prop interface
- **TypeScript Support**: Full type definitions included
- **Composition Pattern**: Clean component composition with Trigger and Content
- **Real-world Examples**: Documentation includes practical use cases (forms, user cards, etc.)

## Research Notes

### Design Philosophy
- HeroUI's Popover follows a composition-based API similar to Radix UI and React Aria
- Strongly focused on accessibility with React Aria foundation
- Emphasizes intelligent positioning and automatic behavior (auto-flip, focus management)
- Minimal API surface with sensible defaults, extensive customization when needed

### Pattern Analysis
- **Trigger Pattern**: Uses wrapper component (PopoverTrigger) rather than ref-based trigger prop
- **Content Pattern**: Supports both direct children and function-as-children for advanced cases
- **State Pattern**: Dual support for controlled and uncontrolled modes
- **Styling Pattern**: Slots-based customization rather than compound props
- **Animation Pattern**: Framer Motion integration for declarative animations

### Comparison Insights
- More feature-complete than basic implementations (backdrop, scroll handling, animations)
- Less complex than some alternatives (no nested popover management in docs)
- Strong focus on forms and interactive content use cases
- Well-balanced between simplicity and power

### Notable Limitations
- No hover trigger pattern shown (click/focus only)
- No explicit nested popover examples
- No delay props for open/close timing
- Animation customization requires Framer Motion knowledge

### Best Practices Observed
- Function-as-children pattern for titleProps ensures proper accessibility
- Portal rendering prevents z-index stacking issues
- Trigger scaling provides visual feedback
- Backdrop options offer different levels of focus/emphasis
- Width control via className encourages responsive design

### Integration Considerations
- Requires Framer Motion for animations
- Works with HeroUI's theme system and design tokens
- Expects Tailwind CSS for styling
- Compatible with Next.js server and client components
- Can integrate with form libraries through controlled state
