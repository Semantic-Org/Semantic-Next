# Mantine - Carousel Usage Patterns

## Component URL
https://mantine.dev/x/carousel/
Status: ✅ Working
Version: v8.3.7
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Excellent documentation with detailed examples, complete API reference, plugin integration, responsive patterns, and accessibility considerations.

## Component Definition
- **Core purpose**: Provides an embla-carousel based component for building responsive, accessible image and content carousels with extensive customization and plugin support.
- **Mental model**: A flexible container that wraps slides with built-in navigation controls, indicators, and support for plugins. Uses composition pattern where `<Carousel.Slide>` components contain arbitrary content.
- **Semantic meaning**: A slideshow/carousel interface for presenting sequential content with user-controlled navigation.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `withIndicators={true}`, `orientation="vertical"`)
- **Composed**: Via composition/children (e.g., `<Carousel.Slide>`, custom content)
- **Plugin**: Via embla plugin system (e.g., autoplay, fade effects)
- **CSS-only**: Requires custom styling via Styles API

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image slides | ✅ | Composed | Place `<Image>` components within `<Carousel.Slide>` |
| Card slides | ✅ | Composed | Custom card components as slide children |
| Custom content | ✅ | Composed | Any React nodes can be wrapped in `<Carousel.Slide>` |
| Multiple items per slide | ✅ | Native | Control via `slideSize` prop (e.g., `slideSize="33.333%"` for 3 items) and `slidesToScroll` embla option |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal scroll | ✅ | Native | Default behavior, standard horizontal carousel |
| Vertical scroll | ✅ | Native | `orientation="vertical"` prop (requires `height` to be set) |
| Fade transition | ✅ | Plugin | Via embla-carousel-fade plugin (not included by default) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Autoplay | ✅ | Plugin | Via `embla-carousel-autoplay` plugin: `plugins={[autoplay.current]}`, configurable delay |
| Pause on hover | ✅ | Composed | Manual control via `onMouseEnter`/`onMouseLeave` with plugin stop/play methods |
| Loading state | ❌ | N/A | Not documented - would need custom implementation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Navigation dots | ✅ | Native | `withIndicators` boolean prop, styleable via Styles API (`indicators`, `indicator` selectors) |
| Arrow controls | ✅ | Native | `withControls` prop, customizable icons via `nextControlIcon`/`previousControlIcon`, offset and size configurable |
| Infinite loop | ✅ | Native | `emblaOptions={{ loop: true }}` |
| Speed control | ✅ | Plugin | Via autoplay plugin delay option: `Autoplay({ delay: 1000 })` |
| Swipe/drag support | ✅ | Native | Built-in drag support, `dragFree` option disables snap points for free scrolling |
| Responsive behavior | ✅ | Native | `slideSize` and `slideGap` accept breakpoint objects: `{ base: '100%', sm: '50%', md: '33.333%' }` or container queries with `type="container"` |

## Code Examples

### Basic Usage
```jsx
import { Carousel } from '@mantine/carousel';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

function Demo() {
  return (
    <Carousel withIndicators height={200}>
      <Carousel.Slide>1</Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>
    </Carousel>
  );
}
```

### Autoplay with Pause on Hover
```jsx
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel } from '@mantine/carousel';

function Demo() {
  const autoplay = useRef(Autoplay({ delay: 1000 }));

  return (
    <Carousel
      withIndicators
      height={200}
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={() => autoplay.current.play()}
    >
      <Carousel.Slide>1</Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>
    </Carousel>
  );
}
```

### Responsive Slides with Breakpoints
```jsx
function Demo() {
  return (
    <Carousel
      withIndicators
      height={200}
      slideSize={{ base: '100%', sm: '50%', md: '33.333%' }}
      slideGap={{ base: 0, sm: 'md' }}
    >
      <Carousel.Slide>1</Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>
      <Carousel.Slide>4</Carousel.Slide>
      <Carousel.Slide>5</Carousel.Slide>
    </Carousel>
  );
}
```

### Vertical Orientation
```jsx
function Demo() {
  return (
    <Carousel
      withIndicators
      height={200}
      orientation="vertical"
    >
      <Carousel.Slide>1</Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>
    </Carousel>
  );
}
```

### Accessing Embla API
```jsx
import { useState } from 'react';

function Demo() {
  const [embla, setEmbla] = useState(null);

  return (
    <Carousel
      getEmblaApi={setEmbla}
      emblaOptions={{ loop: true }}
    >
      <Carousel.Slide>1</Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>
    </Carousel>
  );
}

// Access embla methods:
// embla.scrollProgress()
// embla.on('scroll', callback)
```

### Container Query Responsive (Alternative to Media Queries)
```jsx
function Demo() {
  return (
    <Carousel
      withIndicators
      height={200}
      type="container"
      slideSize={{ base: '100%', '300px': '50%', '500px': '33.333%' }}
    >
      <Carousel.Slide>1</Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>
    </Carousel>
  );
}
```

[View Live](https://mantine.dev/x/carousel/)

## Notable Features

### Installation Requirements
- Requires separate installation of embla-carousel packages:
  ```bash
  npm install embla-carousel@^8.5.2 embla-carousel-react@^8.5.2 @mantine/carousel
  ```
- Must import carousel styles after core Mantine styles:
  ```javascript
  import '@mantine/core/styles.css';
  import '@mantine/carousel/styles.css';
  ```

### Props & Configuration
- **height**: Required for proper display - fixed pixel value or "100%" for flex containers
- **slideSize**: Controls slide dimensions - supports responsive objects with breakpoints
- **slideGap**: Space between slides using Mantine theme spacing (xs, sm, md, lg, xl) or custom values
- **withControls**: Boolean to show next/previous arrow buttons
- **controlsOffset**: Spacing around controls (xs-xl theme values)
- **controlSize**: Control button dimensions in pixels
- **nextControlIcon/previousControlIcon**: Custom React nodes for control icons
- **initialSlide**: Starting slide index (0-based)
- **getEmblaApi**: Callback receiving the embla instance for programmatic control
- **plugins**: Array of embla plugins (autoplay, fade, wheel, etc.)
- **type**: "media" (default) or "container" for container query based responsive behavior
- **classNames**: Styles API object for customizing all internal elements
- **emblaOptions**: Direct configuration object passed to embla-carousel

### Embla Options (via emblaOptions prop)
- `loop`: Enable infinite scrolling
- `align`: Slide alignment ("start", "center", "end")
- `dragFree`: Allow stopping at any scroll position without snapping
- `slidesToScroll`: Number of slides to scroll per interaction

### Styles API Selectors
Complete styling customization available via `classNames` prop:
- `root`: Container element
- `slide`: Individual slide wrapper
- `container`: Slides wrapper
- `viewport`: Main carousel element
- `controls`: Control buttons container
- `control`: Individual next/previous button
- `indicators`: Dots container
- `indicator`: Individual dot button

### Unique Patterns
- **Plugin Architecture**: Leverages the full embla-carousel plugin ecosystem for features like autoplay, wheel gestures, fade effects, and more
- **Dual Responsive System**: Supports both media queries (via breakpoint objects) and container queries (via `type="container"`)
- **Mantine Theme Integration**: Full integration with Mantine's design system including spacing scale, color tokens, and component theming
- **Direct Embla Access**: `getEmblaApi` callback provides access to the underlying embla instance for advanced programmatic control
- **Composition Pattern**: Clean separation where `<Carousel.Slide>` wraps arbitrary content rather than prop-based slide configuration

## Research Notes

### Initial Documentation Access
- The originally provided URL (https://mantine.dev/carousel/getting-started/) returned a 404
- The correct URL structure for Mantine carousel documentation is https://mantine.dev/x/carousel/
- The carousel is categorized as an "extension" component (under /x/) rather than a core component

### Documentation Observations
- Documentation is exceptionally well-structured with clear installation steps, comprehensive examples, and complete API reference
- Strong emphasis on responsive design with two different approaches (media queries and container queries)
- Clear examples for common patterns (autoplay, vertical orientation, responsive sizing)
- Plugin-based architecture documentation is thorough, showing how to integrate embla plugins
- Styles API is well-documented with all available selectors listed
- The framework leverages embla-carousel (an external, well-maintained library) rather than building from scratch, which reduces maintenance burden and provides access to a mature ecosystem

### Framework Approach
- Mantine takes a wrapper approach around embla-carousel, providing a React-friendly API while maintaining access to embla's powerful features
- The component follows Mantine's consistent patterns (props naming, Styles API, theme integration)
- Good separation of concerns: native props for common cases, emblaOptions for advanced configuration, plugins for extensions
- The requirement for manual style imports is clearly documented and emphasized
