# HeroUI - Breadcrumbs Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.heroui.com/docs/components/breadcrumbs
Status: ✅ Working
Version: v2.8.0
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with numerous examples, detailed prop descriptions, and advanced features including accessibility patterns and customization options.

## Component Definition
- **Core purpose**: Provides hierarchical navigation that shows the user's current location within an application's structure and allows navigation back through the hierarchy.
- **Mental model**: A visual breadcrumb trail following the Hansel and Gretel metaphor, showing the path from the application root to the current page.
- **Semantic meaning**: Communicates structural hierarchy and positional context within an application, while providing quick navigation to parent levels.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `separator="/"`)
- **Composed**: Via composition/children (e.g., `<BreadcrumbItem>`)
- **CSS-only**: Requires custom styling (e.g., `classNames={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text links | ✅ | Composed | BreadcrumbItem children accept text content |
| Icon support | ✅ | Native | `startContent` and `endContent` props on BreadcrumbItem |
| Dropdown menus | ✅ | Composed | Can embed Dropdown components within BreadcrumbItem or via `renderEllipsis` |
| Custom separators | ✅ | Native | `separator` prop accepts string or ReactNode, `hideSeparator` to hide |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple breadcrumb | ✅ | Composed | Basic Breadcrumbs wrapper with BreadcrumbItem children |
| With dropdown | ✅ | Composed | Custom ellipsis via `renderEllipsis` enables dropdown menus in collapsed state |
| Icon breadcrumb | ✅ | Native | `startContent`/`endContent` props for icons, can be icon-only |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Current page | ✅ | Native | Automatically applied to last item or via `isCurrent` prop |
| Disabled items | ✅ | Native | `isDisabled` prop on Breadcrumbs (all items) or BreadcrumbItem (individual) |
| Clickable/non-clickable | ✅ | Native | Last item non-clickable by default, `isCurrent` marks non-clickable items |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Separator styles | ✅ | Native | Default chevron ">", customizable via `separator` prop (e.g., "/", custom icons) |
| Size options | ✅ | Native | `size` prop with sm, md (default), lg options |
| Responsive behavior | ✅ | Native | `maxItems`, `itemsBeforeCollapse`, `itemsAfterCollapse` for automatic collapsing |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click navigation | ✅ | Native | `onAction` callback fires when item clicked, `href` prop for direct linking |
| Router integration | ✅ | Native | Works with Next.js, React Router via `href` prop on BreadcrumbItem |
| Programmatic nav | ✅ | Native | Controlled mode via `isCurrent` prop and `onAction` callback |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| aria-label | ✅ | Native | Supports `aria-label` for navigation landmark identification |
| aria-current | ✅ | Native | Automatically applied to current page item via `data-current` attribute |
| Keyboard navigation | ✅ | Native | Full keyboard support with focus rings via `data-focus` and `data-focus-visible` |

## Code Examples

### Basic Usage
```jsx
import {Breadcrumbs, BreadcrumbItem} from "@heroui/react";

export default function App() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>Music</BreadcrumbItem>
      <BreadcrumbItem>Artist</BreadcrumbItem>
      <BreadcrumbItem>Album</BreadcrumbItem>
      <BreadcrumbItem>Song</BreadcrumbItem>
    </Breadcrumbs>
  );
}
```

### Variants, Sizes, and Colors
```jsx
// Variants: solid (default), bordered, light
<Breadcrumbs variant="solid">
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem>Music</BreadcrumbItem>
  <BreadcrumbItem>Artist</BreadcrumbItem>
</Breadcrumbs>

// Sizes: sm, md (default), lg
<Breadcrumbs size="lg">
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem>Music</BreadcrumbItem>
</Breadcrumbs>

// Colors: foreground, primary, secondary, success, warning, danger
<Breadcrumbs color="primary">
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem>Music</BreadcrumbItem>
</Breadcrumbs>
```

### Custom Separator
```jsx
<Breadcrumbs separator="/" itemClasses={{separator: "px-2"}}>
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem>Music</BreadcrumbItem>
  <BreadcrumbItem>Artist</BreadcrumbItem>
  <BreadcrumbItem>Album</BreadcrumbItem>
  <BreadcrumbItem>Song</BreadcrumbItem>
</Breadcrumbs>
```

### With Icons
```jsx
<Breadcrumbs>
  <BreadcrumbItem startContent={<HomeIcon />}>Home</BreadcrumbItem>
  <BreadcrumbItem startContent={<MusicIcon />}>Music</BreadcrumbItem>
  <BreadcrumbItem startContent={<ArtistIcon />}>Artist</BreadcrumbItem>
  <BreadcrumbItem startContent={<AlbumIcon />}>Album</BreadcrumbItem>
  <BreadcrumbItem startContent={<SongIcon />}>Song</BreadcrumbItem>
</Breadcrumbs>
```

### Controlled Breadcrumbs with State
```jsx
const [currentPage, setCurrentPage] = React.useState("song");

<Breadcrumbs underline="active" onAction={(key) => setCurrentPage(key)}>
  <BreadcrumbItem key="home" isCurrent={currentPage === "home"}>
    Home
  </BreadcrumbItem>
  <BreadcrumbItem key="music" isCurrent={currentPage === "music"}>
    Music
  </BreadcrumbItem>
  <BreadcrumbItem key="artist" isCurrent={currentPage === "artist"}>
    Artist
  </BreadcrumbItem>
  <BreadcrumbItem key="album" isCurrent={currentPage === "album"}>
    Album
  </BreadcrumbItem>
  <BreadcrumbItem key="song" isCurrent={currentPage === "song"}>
    Song
  </BreadcrumbItem>
</Breadcrumbs>
```

### Collapsing Items (Responsive)
```jsx
<Breadcrumbs itemsAfterCollapse={2} itemsBeforeCollapse={1} maxItems={3}>
  <BreadcrumbItem href="#home">Home</BreadcrumbItem>
  <BreadcrumbItem href="#music">Music</BreadcrumbItem>
  <BreadcrumbItem href="#artist">Artist</BreadcrumbItem>
  <BreadcrumbItem href="#album">Album</BreadcrumbItem>
  <BreadcrumbItem href="#song">Song</BreadcrumbItem>
</Breadcrumbs>
```

### Custom Ellipsis with Dropdown Menu
```jsx
<Breadcrumbs
  itemsAfterCollapse={2}
  itemsBeforeCollapse={1}
  maxItems={3}
  renderEllipsis={({items, ellipsisIcon, separator}) => (
    <div className="flex items-center">
      <Dropdown>
        <DropdownTrigger>
          <Button size="sm" variant="flat">{ellipsisIcon}</Button>
        </DropdownTrigger>
        <DropdownMenu>
          {items.map((item, index) => (
            <DropdownItem key={index} href={item.href}>{item.children}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      {separator}
    </div>
  )}
>
  <BreadcrumbItem href="#home">Home</BreadcrumbItem>
  <BreadcrumbItem href="#music">Music</BreadcrumbItem>
  <BreadcrumbItem href="#artist">Artist</BreadcrumbItem>
  <BreadcrumbItem href="#album">Album</BreadcrumbItem>
  <BreadcrumbItem href="#featured">Featured</BreadcrumbItem>
  <BreadcrumbItem href="#song">Song</BreadcrumbItem>
</Breadcrumbs>
```

### Disabled State
```jsx
// Disable entire breadcrumb
<Breadcrumbs isDisabled>
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem>Music</BreadcrumbItem>
  <BreadcrumbItem>Artist</BreadcrumbItem>
</Breadcrumbs>

// Disable individual items
<Breadcrumbs>
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem isDisabled>Music</BreadcrumbItem>
  <BreadcrumbItem>Artist</BreadcrumbItem>
</Breadcrumbs>
```

### Underline Options
```jsx
// Options: none (default), hover, always, active, focus
<Breadcrumbs underline="hover">
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem>Music</BreadcrumbItem>
  <BreadcrumbItem>Artist</BreadcrumbItem>
</Breadcrumbs>
```

### Styled Breadcrumbs
```jsx
<Breadcrumbs
  classNames={{list: "bg-linear-to-br from-violet-500 to-fuchsia-500 shadow-small"}}
  itemClasses={{
    item: "text-white/60 data-[current=true]:text-white",
    separator: "text-white/40"
  }}
  underline="hover"
  variant="solid"
>
  <BreadcrumbItem href="#shopping-cart"><ShoppingCartIcon /></BreadcrumbItem>
  <BreadcrumbItem href="#checkout">Checkout</BreadcrumbItem>
  <BreadcrumbItem href="#payment">Payment</BreadcrumbItem>
  <BreadcrumbItem href="#delivery-address">Delivery Address</BreadcrumbItem>
</Breadcrumbs>
```

[View Live Documentation](https://www.heroui.com/docs/components/breadcrumbs)

## Notable Features
- **Sophisticated Collapsing System**: Unique `renderEllipsis` function allows complete customization of collapsed items, including dropdown menus for hidden breadcrumbs
- **Comprehensive Variant System**: Three distinct visual styles (solid, bordered, light) plus six color schemes
- **Advanced State Management**: Controlled mode via `isCurrent` prop and `onAction` callback for programmatic navigation
- **Underline System**: Five underline modes (none, hover, always, active, focus) for visual feedback
- **Slot-Based Customization**: Granular control via `classNames` and `itemClasses` for base, list, item, separator, and ellipsis slots
- **Data Attributes for Styling**: Semantic data attributes (`data-current`, `data-disabled`, `data-focus`) enable CSS-based state styling
- **Flexible Content Composition**: `startContent` and `endContent` props allow icons or custom elements at both ends of each item
- **Built-in Router Integration**: Native support for Next.js and React Router via `href` prop
- **Responsive by Default**: Automatic item collapsing with configurable before/after counts
- **Fine-Grained Press Events**: Multiple press event handlers (onPress, onPressStart, onPressEnd) plus keyboard events

## Research Notes
- Documentation is exceptionally thorough with 12+ distinct examples covering all major use cases
- HeroUI refers to this component as being built on React Aria's useBreadcrumbs hook, ensuring robust accessibility
- The `renderEllipsis` pattern is particularly innovative, allowing dropdown menus within collapsed breadcrumbs
- Component uses ordered list (`<ol>`) structure semantically, which is technically more correct than unordered lists
- The underline system is unique among frameworks reviewed, offering granular control over text decoration states
- Version 2.8.0 appears to be actively maintained (marked with fire emoji in docs)
- All examples use composition pattern (Breadcrumbs + BreadcrumbItem) rather than data-driven array approach
- The data attribute system (`data-current`, `data-focus`, etc.) enables powerful CSS-only styling without JavaScript
