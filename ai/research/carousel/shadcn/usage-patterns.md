# ShadCN - Carousel Usage Patterns

## Component URL
https://ui.shadcn.com/docs/components/carousel
Status: ✅ Working
Version: Current
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Well-structured documentation with multiple examples, API access patterns, plugin system, and clear implementation guidance.

## Component Definition
- **Core purpose**: Provides an interactive sliding carousel interface for displaying collections of content (images, cards, custom content) with motion, swipe gestures, and keyboard navigation.
- **Mental model**: A viewport window that shows one or more items at a time from a horizontal or vertical strip of content, with controls to navigate between items.
- **Semantic meaning**: Represents a sequential, browsable collection of related content where users can move forward/backward through items. Often used for image galleries, product showcases, testimonials, or featured content.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `orientation="vertical"`, `opts={{ loop: true }}`)
- **Composed**: Via composition/children (e.g., `<CarouselItem>`, `<CarouselPrevious>`)
- **CSS-only**: Requires custom styling (e.g., responsive sizing via Tailwind classes)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image slides | ✅ | Composed | No dedicated image component, but easily composed with standard image elements inside `<CarouselItem>` |
| Card slides | ✅ | Composed | Demonstrated in primary example using Card components inside `<CarouselItem>` |
| Custom content | ✅ | Composed | `<CarouselItem>` accepts any children, allowing arbitrary content composition |
| Multiple items per slide | ✅ | CSS-only | Achieved via Tailwind `basis` utilities: `className="md:basis-1/2 lg:basis-1/3"` for responsive item widths |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal scroll | ✅ | Native | Default behavior, no prop required |
| Vertical scroll | ✅ | Native | `orientation="vertical"` prop explicitly sets vertical direction |
| Fade transition | ❌ | N/A | Not mentioned in documentation; uses slide transitions only |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Autoplay | ✅ | Composed | Via Embla Autoplay plugin: `plugins={[Autoplay({ delay: 2000 })]}` |
| Pause on hover | ⚠️ | Composed | Available through Embla Autoplay plugin options (not explicitly documented but plugin supports it) |
| Loading state | ❌ | N/A | Not documented; would need custom implementation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Navigation dots | ❌ | N/A | Not provided; would require custom implementation using API access |
| Arrow controls | ✅ | Composed | `<CarouselPrevious>` and `<CarouselNext>` components for navigation buttons |
| Infinite loop | ✅ | Native | Via Embla config: `opts={{ loop: true }}` |
| Speed control | ✅ | Native | Via Embla config in `opts` prop (not explicitly shown but supported by underlying library) |
| Swipe/drag support | ✅ | Native | Built-in with Embla Carousel library, mentioned as core feature |
| Responsive behavior | ✅ | CSS-only | Tailwind responsive classes on items: `className="md:basis-1/2 lg:basis-1/3"` |
| Custom spacing | ✅ | CSS-only | Apply `pl-[VALUE]` to items and `-ml-[VALUE]` to content for gaps |
| Alignment control | ✅ | Native | Via Embla config: `opts={{ align: "start" }}` (or "center", "end") |
| API access | ✅ | Native | `setApi` callback prop provides full access to Embla API instance |

## Code Examples

### Primary Usage Example
```jsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

### Responsive Sizing Example
```jsx
<Carousel className="w-full max-w-sm">
  <CarouselContent className="-ml-1">
    {Array.from({ length: 5 }).map((_, index) => (
      <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
        <div className="p-1">
          <Card>
            <CardContent className="flex aspect-square items-center justify-center p-6">
              <span className="text-2xl font-semibold">{index + 1}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### Vertical Orientation Example
```jsx
<Carousel
  orientation="vertical"
  className="w-full max-w-xs"
>
  <CarouselContent className="-mt-1 h-[200px]">
    {Array.from({ length: 5 }).map((_, index) => (
      <CarouselItem key={index} className="pt-1 md:basis-1/2">
        <div className="p-1">
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <span className="text-3xl font-semibold">{index + 1}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### API Access Example
```jsx
import { useState, useEffect } from "react"

export function CarouselApi() {
  const [api, setApi] = useState()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div>
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  )
}
```

### Autoplay Plugin Example
```jsx
import Autoplay from "embla-carousel-autoplay"

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

### Configuration Options Example
```jsx
<Carousel
  opts={{
    align: "start",
    loop: true,
  }}
  className="w-full max-w-sm"
>
  <CarouselContent>
    {Array.from({ length: 5 }).map((_, index) => (
      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
        <div className="p-1">
          <Card>
            <CardContent className="flex aspect-square items-center justify-center p-6">
              <span className="text-3xl font-semibold">{index + 1}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

[View Live Examples](https://ui.shadcn.com/docs/components/carousel)

## Notable Features

- **Embla Carousel Foundation**: Built on top of the robust Embla Carousel library, providing a battle-tested sliding mechanism with extensive configuration options.

- **Plugin Architecture**: Supports Embla's plugin ecosystem (e.g., Autoplay, AutoHeight, ClassNames, etc.) for extensible functionality without bloating the base component.

- **Comprehensive API Access**: The `setApi` prop exposes the full Embla API instance, enabling programmatic control and custom state tracking (current slide, total slides, scroll progress, etc.).

- **Composition-First Design**: Components are broken into logical parts (`Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`) that can be composed flexibly or omitted as needed.

- **Tailwind-Native Responsive Control**: Leverages Tailwind's utility classes for responsive sizing (`basis-1/2`, `lg:basis-1/3`) rather than component props, keeping styling concerns in the styling layer.

- **Accessibility Built-in**: Keyboard navigation support (arrow keys) comes from Embla, ensuring the carousel is keyboard-accessible out of the box.

- **Touch/Swipe Gestures**: Native swipe/drag support on touch devices is handled by Embla without additional configuration.

- **Minimal Component Wrapper**: ShadCN's implementation is a thin wrapper around Embla, meaning developers can reference Embla's extensive documentation for advanced use cases.

- **TypeScript Support**: Includes `CarouselApi` type for the API instance, providing type safety when working with carousel methods and events.

- **Event-Driven Architecture**: The API instance supports event listeners (`api.on("select", ...)`) for reacting to carousel state changes, enabling custom indicators, analytics tracking, or synchronized UI updates.

## Research Notes

- Documentation was easily accessible and well-organized with multiple live examples.

- The component takes a **library-agnostic wrapper** approach: ShadCN provides the React bindings and component structure, while Embla Carousel handles the core carousel logic. This separation means most advanced features (drag physics, snap points, loop behavior) are documented in Embla's docs rather than ShadCN's.

- **Navigation dots/pagination** are notably absent from the provided components. The docs don't provide a built-in solution, suggesting developers use the API access pattern to build custom indicators if needed.

- The **plugin system** is powerful but requires importing and configuring Embla plugins directly (e.g., `embla-carousel-autoplay`). This adds a dependency but provides flexibility.

- **Responsive behavior** is handled entirely through CSS classes on `CarouselItem`, not through component props. This keeps the component API surface small but requires understanding Tailwind's responsive utilities.

- The `opts` prop is a passthrough to Embla's configuration object. This means ShadCN doesn't document all available options—developers need to reference [Embla's options documentation](https://www.embla-carousel.com/api/options/) for the complete list.

- **Custom spacing** pattern (`pl-[VALUE]` on items, `-ml-[VALUE]` on content) is a clever CSS trick to achieve consistent gaps while maintaining proper alignment. This isn't immediately obvious and represents a learning curve.

- The framework emphasizes **composition over configuration**: rather than having many props on a single component, functionality is distributed across multiple sub-components that can be arranged as needed.

- **State management** (current slide, total slides) requires using the API access pattern and React hooks. There are no built-in props like `currentSlide` or `onSlideChange`—developers must implement this using `useEffect` and the API instance.

- The documentation provides clear TypeScript examples, but doesn't explicitly show JavaScript usage (though it's straightforward to adapt).

- **Installation** is via ShadCN's CLI tool, which downloads the component source directly into the project rather than installing from npm. This gives developers full control to customize the component code but means updates aren't automatic.
