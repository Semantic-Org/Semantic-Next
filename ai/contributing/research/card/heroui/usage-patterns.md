# HeroUI - Card Usage Patterns

## Component URLs
- **Main Documentation**: https://www.heroui.com/docs/components/card
- **Status**: ✅ Documentation accessible

## Documentation Quality
Good - Comprehensive documentation with API reference, code examples, and interactive playground. Clear organization of props, slots, and composition patterns. Strong visual examples for different use cases.

## Component Definition
- **Core purpose**: A versatile container component for displaying related text, photos, and actions about a single subject. Serves as a foundational layout primitive for structured content presentation.
- **Mental model**: A multi-part container with three optional sections (header, body, footer) that can be styled and configured independently. Supports both static display and interactive (pressable/hoverable) modes.
- **Semantic meaning**: Groups related content into a cohesive visual unit with clear hierarchical structure (header → body → footer). Can function as a button when interactive.

## Container Patterns

### Basic Structure
| Pattern | Present | Details |
|---------|---------|---------|
| Multi-part anatomy | ✅ | Card (root), CardHeader, CardBody, CardFooter sub-components |
| Optional sections | ✅ | All sections (header, body, footer) are optional |
| Flexible composition | ✅ | Sections can be used independently or in any combination |
| Nested containers | ✅ | Can contain other components (Avatar, Image, Button, etc.) |

### Shadow Variants
| Variant | Description |
|---------|-------------|
| none | No shadow |
| sm | Small shadow |
| md | Medium shadow (default) |
| lg | Large shadow |

### Border & Radius
| Pattern | Present | Details |
|---------|---------|---------|
| Border radius | ✅ | Options: none, sm, md, lg (default: lg) |
| Bordered variant | ✅ | Achieved via classNames styling |
| Custom radius | ✅ | Full Tailwind radius classes supported |

## Content Patterns

### Header Content
| Pattern | Present | Details |
|---------|---------|---------|
| Text header | ✅ | Simple text or heading content |
| Rich content | ✅ | Compose with Avatar, text blocks, metadata |
| Flex layouts | ✅ | Use flex utilities for horizontal/vertical arrangements |
| Absolute positioning | ✅ | Can overlay header on body content |

### Body Content
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Paragraphs, lists, formatted text |
| Image content | ✅ | Integration with Image component |
| Mixed content | ✅ | Text + images + components |
| Overflow handling | ✅ | Controls via className or overflow props |

### Footer Content
| Pattern | Present | Details |
|---------|---------|---------|
| Action buttons | ✅ | Compose with Button components |
| Metadata display | ✅ | Stats, timestamps, labels |
| Link actions | ✅ | Compose with Link component |
| Blurred footer | ✅ | `isFooterBlurred` for semi-transparent overlay effect |

## Layout Patterns

### Orientation
| Pattern | Present | Details |
|---------|---------|---------|
| Vertical (default) | ✅ | Header → Body → Footer stacking |
| Horizontal | ✅ | Achieved via flex layout utilities (flex-row) |
| Custom layouts | ✅ | Full Tailwind/CSS control via classNames |

### Sizing
| Pattern | Present | Details |
|---------|---------|---------|
| fullWidth | ✅ | Boolean prop to span parent width |
| Fixed width | ✅ | Via className (e.g., "w-[400px]") |
| Responsive sizing | ✅ | Tailwind responsive classes supported |
| Grid layouts | ✅ | Cards work in grid containers |

### Spacing & Alignment
| Pattern | Present | Details |
|---------|---------|---------|
| Section padding | ✅ | Default padding on header/body/footer |
| Custom spacing | ✅ | Via className on slots |
| Content alignment | ✅ | Flex utilities (justify, items, etc.) |
| Gap control | ✅ | Gap utilities for section spacing |

## Variation Patterns

### Visual Effects
| Effect | Present | Details |
|--------|---------|---------|
| Blur effect | ✅ | `isBlurred` applies backdrop-blur to entire card |
| Footer blur | ✅ | `isFooterBlurred` for semi-transparent footer overlay |
| Hover effect | ✅ | `isHoverable` adds highlight on hover |
| Shadows | ✅ | `shadow` prop with none/sm/md/lg options |

### State Variants
| State | Present | Details |
|-------|---------|---------|
| Disabled | ✅ | `isDisabled` prop disables interactions |
| Hovered | ✅ | `data-hover` attribute, controlled by `isHoverable` |
| Pressed | ✅ | `data-pressed` attribute when `isPressable` |
| Focused | ✅ | `data-focus` and `data-focus-visible` attributes |

## Interactive Patterns

### Pressable Card
| Pattern | Present | Details |
|---------|---------|---------|
| Button mode | ✅ | `isPressable={true}` converts card to button |
| Press events | ✅ | onPress, onPressStart, onPressEnd, onPressChange, onPressUp |
| Ripple effect | ✅ | Default press ripple (disable with `disableRipple`) |
| Text selection | ✅ | `allowTextSelectionOnPress` enables text selection while pressable |

### Hoverable Card
| Pattern | Present | Details |
|---------|---------|---------|
| Hover highlight | ✅ | `isHoverable={true}` adds hover styling |
| Data attribute | ✅ | `data-hover` exposed for custom styling |
| Combination | ✅ | Can be both hoverable and pressable |

### Animation Control
| Pattern | Present | Details |
|---------|---------|---------|
| Default animations | ✅ | Transitions on hover, press, focus |
| Disable animations | ✅ | `disableAnimation={true}` removes all animations |
| Disable ripple | ✅ | `disableRipple={true}` removes press ripple only |

## Styling Patterns

### Slot-Based Styling
| Slot | Purpose |
|------|---------|
| base | Main card container |
| header | Header section |
| body | Body section |
| footer | Footer section |

**Usage Pattern**:
```jsx
<Card classNames={{
  base: "custom-card-class",
  header: "custom-header-class",
  body: "custom-body-class",
  footer: "custom-footer-class"
}}>
```

### Custom Styling Approaches
| Pattern | Present | Details |
|---------|---------|---------|
| className prop | ✅ | Direct class on Card component |
| classNames slots | ✅ | Per-slot custom classes |
| Inline styles | ✅ | Standard style prop |
| Tailwind utilities | ✅ | Full Tailwind support |

### Background Effects
| Pattern | Present | Details |
|---------|---------|---------|
| Solid backgrounds | ✅ | Via bg-* Tailwind classes |
| Gradient backgrounds | ✅ | Via bg-gradient-* classes, works well with blur |
| Image backgrounds | ✅ | Place Image as card child, absolute positioning |
| Transparent/blurred | ✅ | `isBlurred` creates backdrop-blur effect |

## Code Examples

### Basic Card
```jsx
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react"

<Card>
  <CardHeader>
    <p className="text-md">Basic Card</p>
  </CardHeader>
  <CardBody>
    <p>This is a simple card with header, body, and footer.</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Shadow Variants
```jsx
// No shadow
<Card shadow="none">
  <CardBody>No shadow card</CardBody>
</Card>

// Small shadow
<Card shadow="sm">
  <CardBody>Small shadow</CardBody>
</Card>

// Medium shadow (default)
<Card shadow="md">
  <CardBody>Medium shadow</CardBody>
</Card>

// Large shadow
<Card shadow="lg">
  <CardBody>Large shadow</CardBody>
</Card>
```

### Radius Variants
```jsx
<Card radius="none">
  <CardBody>No radius (sharp corners)</CardBody>
</Card>

<Card radius="sm">
  <CardBody>Small radius</CardBody>
</Card>

<Card radius="md">
  <CardBody>Medium radius</CardBody>
</Card>

<Card radius="lg">
  <CardBody>Large radius (default)</CardBody>
</Card>
```

### Card with Divider
```jsx
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react"

<Card>
  <CardHeader>
    <p className="text-md">Card with Dividers</p>
  </CardHeader>
  <Divider />
  <CardBody>
    <p>Content separated by dividers for visual hierarchy.</p>
  </CardBody>
  <Divider />
  <CardFooter>
    <Button>Submit</Button>
  </CardFooter>
</Card>
```

### Pressable Card
```jsx
<Card
  isPressable
  onPress={() => console.log("Card pressed")}
>
  <CardBody>
    <p>Click me! This card acts like a button.</p>
  </CardBody>
</Card>

// With ripple disabled
<Card
  isPressable
  disableRipple
  onPress={() => console.log("Pressed")}
>
  <CardBody>Pressable without ripple effect</CardBody>
</Card>

// Allow text selection while pressable
<Card
  isPressable
  allowTextSelectionOnPress
  onPress={() => console.log("Pressed")}
>
  <CardBody>
    <p>You can select this text even though the card is pressable.</p>
  </CardBody>
</Card>
```

### Hoverable Card
```jsx
<Card isHoverable>
  <CardBody>
    <p>This card highlights on hover.</p>
  </CardBody>
</Card>

// Both hoverable and pressable
<Card
  isHoverable
  isPressable
  onPress={() => console.log("Pressed")}
>
  <CardBody>Highlights on hover and clickable</CardBody>
</Card>
```

### Card with Image
```jsx
import { Card, CardBody, Image } from "@heroui/react"

// Image in body
<Card>
  <CardBody>
    <Image
      alt="Card image"
      src="/images/hero-card.jpeg"
      width="100%"
    />
    <p className="pt-2">Image inside card body</p>
  </CardBody>
</Card>

// Image as cover (sibling to sections)
<Card>
  <Image
    alt="Cover image"
    className="object-cover"
    height={200}
    src="/images/card-cover.jpeg"
    width="100%"
  />
  <CardHeader>
    <h4>Title over image</h4>
  </CardHeader>
  <CardBody>
    <p>Content below image</p>
  </CardBody>
</Card>
```

### Blurred Card
```jsx
// Entire card blurred (needs suitable background)
<div className="bg-gradient-to-br from-purple-500 to-blue-500 p-8">
  <Card isBlurred>
    <CardBody>
      <p>This card has a backdrop blur effect.</p>
    </CardBody>
  </Card>
</div>

// Blurred footer over content
<Card>
  <CardBody className="relative">
    <Image
      alt="Background"
      src="/images/background.jpeg"
      className="object-cover"
    />
  </CardBody>
  <CardFooter isFooterBlurred className="absolute bottom-0 z-10">
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Full Width Card
```jsx
<Card fullWidth>
  <CardBody>
    <p>This card spans the full width of its container.</p>
  </CardBody>
</Card>
```

### Custom Styling with classNames
```jsx
<Card
  classNames={{
    base: "bg-gradient-to-br from-pink-500 to-yellow-500",
    header: "text-white font-bold",
    body: "text-white/80",
    footer: "border-t-2 border-white/20"
  }}
>
  <CardHeader>Styled Card</CardHeader>
  <CardBody>Custom gradient background</CardBody>
  <CardFooter>Custom footer border</CardFooter>
</Card>
```

### Card with Rich Header (Avatar + Metadata)
```jsx
import { Card, CardHeader, CardBody, Avatar } from "@heroui/react"

<Card>
  <CardHeader className="flex gap-3">
    <Avatar
      isBordered
      radius="full"
      size="md"
      src="/avatars/user.png"
    />
    <div className="flex flex-col">
      <p className="text-md font-semibold">John Doe</p>
      <p className="text-small text-default-500">@johndoe</p>
    </div>
  </CardHeader>
  <CardBody>
    <p>Card content with rich header information.</p>
  </CardBody>
</Card>
```

### Horizontal Layout Card
```jsx
<Card className="flex-row">
  <Image
    alt="Thumbnail"
    className="object-cover w-[200px]"
    src="/images/thumbnail.jpeg"
  />
  <div className="flex flex-col flex-1">
    <CardHeader>Horizontal Card</CardHeader>
    <CardBody>
      <p>Content beside the image in horizontal layout.</p>
    </CardBody>
    <CardFooter>
      <Button>Action</Button>
    </CardFooter>
  </div>
</Card>
```

### Grid of Cards
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((item) => (
    <Card key={item.id} isPressable onPress={() => handleSelect(item)}>
      <CardBody>
        <Image src={item.image} alt={item.title} />
        <p className="pt-2">{item.title}</p>
      </CardBody>
    </Card>
  ))}
</div>
```

### Disabled Card
```jsx
<Card isDisabled>
  <CardBody>
    <p className="opacity-50">This card is disabled and non-interactive.</p>
  </CardBody>
</Card>
```

### Card with Press Events
```jsx
<Card
  isPressable
  onPress={() => console.log("Released over target")}
  onPressStart={() => console.log("Press started")}
  onPressEnd={() => console.log("Press ended")}
  onPressChange={(isPressed) => console.log("Press state:", isPressed)}
  onPressUp={() => console.log("Released anywhere")}
>
  <CardBody>Card with comprehensive press events</CardBody>
</Card>
```

### No Animation Card
```jsx
<Card disableAnimation>
  <CardBody>
    <p>This card has no transition animations.</p>
  </CardBody>
</Card>
```

## API Reference

### Card Component
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Card sections (Header, Body, Footer) |
| shadow | "none" \| "sm" \| "md" \| "lg" | "md" | Shadow depth variant |
| radius | "none" \| "sm" \| "md" \| "lg" | "lg" | Border radius size |
| fullWidth | boolean | false | Whether card spans full container width |
| isHoverable | boolean | false | Whether card highlights on hover |
| isPressable | boolean | false | Whether card functions as button |
| isBlurred | boolean | false | Whether to apply backdrop blur effect |
| isFooterBlurred | boolean | false | Whether to blur footer specifically |
| isDisabled | boolean | false | Whether card is disabled |
| disableAnimation | boolean | false | Whether to disable animations |
| disableRipple | boolean | false | Whether to disable press ripple |
| allowTextSelectionOnPress | boolean | false | Allow text selection when pressable |
| className | string | - | Custom class for base slot |
| classNames | Record<"base" \| "header" \| "body" \| "footer", string> | - | Custom classes per slot |
| onPress | (e: PressEvent) => void | - | Handler for press release over target |
| onPressStart | (e: PressEvent) => void | - | Handler for press start |
| onPressEnd | (e: PressEvent) => void | - | Handler for press end |
| onPressChange | (isPressed: boolean) => void | - | Handler for press state changes |
| onPressUp | (e: PressEvent) => void | - | Handler for press release anywhere |

### CardHeader Component
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Header content |
| className | string | - | Custom classes |

### CardBody Component
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Body content |
| className | string | - | Custom classes |

### CardFooter Component
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Footer content |
| className | string | - | Custom classes |
| isFooterBlurred | boolean | false | Whether footer has blur effect |

### Data Attributes
| Attribute | Condition | Description |
|-----------|-----------|-------------|
| data-hover | isHoverable && hovering | Applied during hover state |
| data-focus | focused | Applied when card has focus |
| data-focus-visible | keyboard focus | Applied for keyboard navigation |
| data-disabled | isDisabled | Applied when disabled |
| data-pressed | isPressable && pressing | Applied during press state |

## Notable Features

### Slot-Based Architecture
HeroUI uses a slot-based styling system allowing granular control over each card section:
- **base**: Main container styling
- **header**: Header section styling
- **body**: Body section styling
- **footer**: Footer section styling

Each slot can receive custom className independently via the `classNames` prop.

### Backdrop Blur Effects
The `isBlurred` and `isFooterBlurred` props create sophisticated visual effects:
- **isBlurred**: Applies backdrop-blur filter to entire card (requires suitable background)
- **isFooterBlurred**: Creates semi-transparent footer overlay effect (common for image cards)
- These effects work best over gradients, images, or colorful backgrounds

### Press vs Click Events
HeroUI distinguishes between press events (mobile/touch-friendly) and click events:
- **isPressable**: Uses `onPress*` handlers instead of `onClick`
- **Press events**: onPress, onPressStart, onPressEnd, onPressChange, onPressUp
- **Better mobile support**: Press events handle touch interactions more reliably
- **Ripple feedback**: Default press ripple can be disabled with `disableRipple`

### Flexible Composition
Cards are compositional primitives that work well with other HeroUI components:
- **Image**: For visual content and backgrounds
- **Avatar**: For user identity in headers
- **Button**: For actions in footers
- **Divider**: For visual separation between sections
- **Badge**: For status indicators
- **Slider**: For media controls (e.g., music player)

### Data Attributes for Styling
Cards expose reactive data attributes for custom CSS styling:
```css
/* Target hovered state */
[data-hover="true"] { ... }

/* Target pressed state */
[data-pressed="true"] { ... }

/* Target disabled state */
[data-disabled="true"] { ... }
```

### Animation Control
Fine-grained animation control:
- **Default**: Smooth transitions on hover, press, focus
- **disableAnimation**: Removes all animations
- **disableRipple**: Removes only press ripple effect
- Useful for performance-critical scenarios or accessibility preferences

### Accessibility Considerations
- **Keyboard navigation**: Pressable cards are keyboard accessible
- **Focus indicators**: `data-focus-visible` for keyboard focus styling
- **Screen readers**: Semantic HTML structure
- **Text selection**: `allowTextSelectionOnPress` for content cards that need to be both interactive and readable

## Framework-Specific Features

### Next.js/React Integration
- **Server components**: Cards work in both server and client components
- **Image optimization**: Integrates with Next.js Image component
- **Tailwind CSS**: Full Tailwind utility support
- **TypeScript**: Complete type definitions for all props

### HeroUI Theme System
Cards integrate with HeroUI's theme system:
- **Color tokens**: Automatic theme color application
- **Dark mode**: Built-in dark mode support
- **Custom themes**: Extendable via theme configuration
- **Responsive design**: Tailwind responsive utilities work seamlessly

### Performance Optimizations
- **Lazy loading**: Can integrate with Next.js dynamic imports
- **Image lazy loading**: Works with Image component lazy loading
- **Animation optimization**: Uses CSS transitions for performance
- **Minimal re-renders**: Optimized React component structure

## Research Notes

### Documentation Access
- **Main Documentation**: Successfully accessed at heroui.com with comprehensive examples
- **Interactive Playground**: Live code examples with editable props
- **API Reference**: Complete prop documentation with types
- **Visual Examples**: Strong visual demonstrations of variants and patterns

### HeroUI Philosophy Observations

**Slot-Based Customization**:
- Modern approach to component styling
- Allows granular control without style conflicts
- Better than single className approach for complex components
- Aligns with design system best practices

**Press vs Click Paradigm**:
- Mobile-first interaction model
- Better touch event handling than traditional click
- Ripple feedback provides visual confirmation
- More React Native-like API

**Blur Effects as First-Class Feature**:
- `isBlurred` and `isFooterBlurred` as dedicated props
- Modern glassmorphism aesthetic support
- Requires understanding of backdrop-filter CSS
- Works well for premium/modern UI designs

**Composition Over Configuration**:
- Minimal built-in layout opinions
- Relies on developer composition with other components
- Flexible but requires more setup for common patterns
- Good for design system flexibility

**Tailwind-First Styling**:
- Heavy reliance on Tailwind utility classes
- classNames prop for slot-based utilities
- Less CSS-in-JS, more utility-first approach
- Aligns with modern React/Next.js trends

### Implementation Patterns

**Multi-Part Structure**:
- Clear separation of header/body/footer sections
- Optional sections (use only what's needed)
- Explicit sub-components (CardHeader, CardBody, CardFooter)
- No magic slot detection (must use sub-components)

**Interactive State Management**:
- Boolean flags for interaction modes (isPressable, isHoverable)
- Data attributes for styling hooks
- Event handlers for press lifecycle
- No internal state for card content (presentational)

**Visual Effect System**:
- Prop-based visual variants (shadow, radius)
- Blur effects as dedicated features
- Animation control props
- Tailwind-compatible styling approach

**Accessibility Approach**:
- Keyboard navigation support for pressable cards
- Focus visibility indicators
- Semantic HTML structure
- Text selection control

### Comparison Points for Semantic UI

**Strengths to Consider**:
- **Slot-based styling**: Modern approach for granular customization
- **Press events**: Better mobile/touch support than click events
- **Blur effects**: First-class support for modern glassmorphism
- **Flexible composition**: Works well with other components
- **Data attributes**: Clean CSS styling hooks
- **Animation control**: Granular control over transitions
- **Tailwind integration**: Modern utility-first approach

**Potential Improvements**:
- **Layout presets**: Could provide common layouts (horizontal, image-cover, etc.)
- **Built-in variants**: More semantic variants (e.g., "product", "profile", "article")
- **Elevation system**: Shadow could be numeric (1-5) for consistency
- **Content patterns**: Common patterns as built-in compositions
- **Aspect ratio**: Built-in aspect ratio control for image cards
- **Loading states**: Skeleton/placeholder patterns

**Alignment with Web Standards**:
- React-specific (not web components)
- Tailwind-dependent (not vanilla CSS)
- Slot system aligns with CSS parts concept
- Data attributes follow web standards
- Could benefit from custom elements for framework independence
- Press events more modern than click but less standard

**Next UI Ecosystem Integration**:
- Strong integration with other HeroUI components
- Consistent API patterns across component library
- Theme system integration
- Tailwind CSS as foundation
- Next.js optimized (but React-only)

### Cross-Framework Pattern Analysis

**Card Terminology**:
- Universal "Card" naming (MUI, Ant Design, Mantine, Chakra, Shadcn)
- Multi-section structure common across frameworks
- Header/Body/Footer sections standard pattern

**Composition Patterns**:
- Sub-component approach similar to Chakra UI, Ant Design
- Slot-based styling similar to Material UI
- Optional sections pattern universal
- Image integration patterns vary by framework

**Interactive Card Patterns**:
- Pressable/clickable cards common (Ant Design, MUI)
- Hover effects universal feature
- Ripple effect from Material Design influence
- Press events more Next UI specific (vs onClick)

**Visual Effect Patterns**:
- Shadow variants common (none/sm/md/lg standard)
- Blur effects less common (Next UI innovation)
- Border radius options standard
- Elevation systems vary by framework

**Styling Approaches**:
- Slot-based styling: MUI, HeroUI
- ClassNames object: Mantine, HeroUI
- Style props: Chakra UI, Mantine
- CSS modules: Various approaches
- Tailwind: HeroUI, Shadcn

**Notable Differences from Other Frameworks**:
- Press events vs onClick (more mobile-focused)
- Blur effects as props (vs CSS)
- Slot-based classNames (vs single className)
- Tailwind-first approach
- Minimal built-in layouts (more flexible but verbose)
