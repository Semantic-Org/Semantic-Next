# HeroUI - Skeleton Usage Patterns

> Last Modified: 2025-11-04

## Component URL
**Skeleton**: https://www.heroui.com/docs/components/skeleton
**Skeleton v3**: https://v3.heroui.com/docs/components/skeleton
Status: ✅ Both URLs accessible
Version: HeroUI v2.x and v3.x (Previously NextUI)
Last Verified: 2025-11-04

## Documentation Quality
Comprehensive - The component has detailed documentation with examples, API references, and use case demonstrations across both v2 and v3 versions. The v3 documentation introduces enhanced animation control features.

---

## Component Definition
- **Core purpose**: A placeholder component that displays the loading state and expected shape of content while data is being fetched asynchronously. Provides visual feedback during loading operations.
- **Mental model**: A content placeholder that mimics the structure of the actual content, creating a smooth perceived performance improvement. Users see the expected layout immediately while actual data loads in the background.
- **Semantic meaning**: Represents deferred content that will appear once loading completes. Communicates ongoing loading state and prevents layout shift by maintaining consistent dimensions.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

---

## Core Loading Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **isLoaded control** | ✅ | Native | `isLoaded` prop controls transition from skeleton to actual content |
| **Children wrapping** | ✅ | Native | Skeleton wraps actual content, shows it when `isLoaded={true}` |
| **Standalone placeholder** | ✅ | Composed | Can be used without children as pure placeholder |
| **Conditional rendering** | ✅ | Composed | Combine with state management for async loading patterns |

### Code Example - isLoaded Pattern
```jsx
import { useEffect, useState } from "react";
import { Skeleton, Card, CardHeader, CardBody, CardFooter, User } from "@heroui/react";

function AsyncLoadingExample() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate async data loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card>
      <CardHeader>
        <Skeleton isLoaded={isLoaded}>
          <User
            name="Jane Doe"
            description="Product Designer"
            avatarProps={{ src: 'https://i.pravatar.cc/150?u=a04258114e29026702d' }}
          />
        </Skeleton>
      </CardHeader>
      <CardBody>
        <Skeleton isLoaded={isLoaded}>
          <p>This is the actual content that will appear after loading.</p>
        </Skeleton>
      </CardBody>
      <CardFooter>
        <Skeleton isLoaded={isLoaded}>
          <span>Footer content</span>
        </Skeleton>
      </CardFooter>
    </Card>
  );
}
```

---

## Animation Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Shimmer animation** | ✅ | Native | Default gradient shimmer effect with 2s linear infinite animation |
| **Pulse animation** | ✅ | Native | `animationType="pulse"` - Uses Tailwind's animate-pulse |
| **No animation** | ✅ | Native | `animationType="none"` or `disableAnimation` - Static placeholder |
| **Global animation control** | ✅ | Native | Configure default via HeroUIProvider or CSS variable (v3) |
| **Per-instance override** | ✅ | Native | Individual `animationType` prop overrides global setting |

### Code Example - Animation Types
```jsx
import { Skeleton } from "@heroui/react";

function AnimationExamples() {
  return (
    <div className="space-y-4">
      {/* Default shimmer animation */}
      <Skeleton className="h-20 rounded-lg" />

      {/* Pulse animation */}
      <Skeleton animationType="pulse" className="h-20 rounded-lg" />

      {/* No animation (static) */}
      <Skeleton animationType="none" className="h-20 rounded-lg" />

      {/* Disable animation via prop */}
      <Skeleton disableAnimation className="h-20 rounded-lg" />
    </div>
  );
}
```

### Code Example - Global Animation Control (v2.4.0+)
```jsx
import { HeroUIProvider } from "@heroui/react";

function App() {
  return (
    <HeroUIProvider disableAnimation>
      {/* All skeletons will have animations disabled */}
      <Skeleton className="h-20 rounded-lg" />
    </HeroUIProvider>
  );
}
```

### Code Example - Global Animation Type (v3)
```css
/* Configure default animation type via CSS variable */
:root {
  --skeleton-default-animation-type: pulse;
}
```

---

## Shape Patterns

HeroUI Skeleton uses className-based shape control rather than dedicated shape props, providing maximum flexibility.

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Rectangle** | ✅ | CSS-only | `className="h-20 rounded-lg"` - Default rectangular shape |
| **Circle/Avatar** | ✅ | CSS-only | `className="h-10 w-10 rounded-full"` - Perfect circle for avatars |
| **Text lines** | ✅ | CSS-only | `className="h-3 w-3/5 rounded-lg"` - Thin rectangles for text |
| **Custom dimensions** | ✅ | CSS-only | Use Tailwind classes for any size/shape combination |
| **Responsive shapes** | ✅ | CSS-only | Tailwind responsive modifiers (sm:, md:, lg:, etc.) |

### Code Example - Shape Variations
```jsx
import { Skeleton } from "@heroui/react";

function ShapeExamples() {
  return (
    <div className="space-y-4">
      {/* Large rectangle for image placeholder */}
      <Skeleton className="h-32 rounded-lg" />

      {/* Circle for avatar */}
      <Skeleton className="h-12 w-12 rounded-full" />

      {/* Text line - short */}
      <Skeleton className="h-3 w-3/5 rounded-lg" />

      {/* Text line - long */}
      <Skeleton className="h-3 w-4/5 rounded-lg" />

      {/* Text line - medium */}
      <Skeleton className="h-3 w-2/5 rounded-lg" />

      {/* Square skeleton */}
      <Skeleton className="h-20 w-20 rounded-md" />

      {/* Full width skeleton */}
      <Skeleton className="h-4 w-full rounded" />
    </div>
  );
}
```

---

## Composite Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Card skeleton** | ✅ | Composed | Combine multiple skeletons in card layout |
| **Profile skeleton** | ✅ | Composed | Avatar + text skeletons for user profiles |
| **List skeleton** | ✅ | Composed | Repeated skeleton items with Array.map |
| **Text content** | ✅ | Composed | Multiple text line skeletons |
| **Media object** | ✅ | Composed | Image skeleton + text skeletons side-by-side |

### Code Example - Basic Card Skeleton
```jsx
import { Skeleton } from "@heroui/react";

function BasicCard() {
  return (
    <div className="shadow-border w-[250px] space-y-5 rounded-lg bg-transparent p-4">
      {/* Image placeholder */}
      <Skeleton className="h-32 rounded-lg" />

      {/* Text content placeholders */}
      <div className="space-y-3">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
        <Skeleton className="h-3 w-2/5 rounded-lg" />
      </div>
    </div>
  );
}
```

### Code Example - Profile/User Skeleton
```jsx
import { Skeleton } from "@heroui/react";

function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar skeleton */}
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

      {/* User info skeleton */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
      </div>
    </div>
  );
}
```

### Code Example - List Skeleton
```jsx
import { Skeleton } from "@heroui/react";

function ListSkeleton() {
  return (
    <div className="w-full max-w-sm space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-4/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Code Example - Text Content Skeleton
```jsx
import { Skeleton } from "@heroui/react";

function TextContentSkeleton() {
  return (
    <div className="w-full max-w-md space-y-3">
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-5/6 rounded" />
      <Skeleton className="h-4 w-4/6 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-3/6 rounded" />
    </div>
  );
}
```

### Code Example - Media Object Skeleton
```jsx
import { Skeleton } from "@heroui/react";

function MediaObjectSkeleton() {
  return (
    <div className="flex gap-4">
      {/* Image placeholder */}
      <Skeleton className="h-24 w-24 shrink-0 rounded-lg" />

      {/* Content placeholder */}
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-4 w-3/5 rounded" />
      </div>
    </div>
  );
}
```

---

## Responsive Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **Responsive sizing** | ✅ | CSS-only | Use Tailwind responsive modifiers (sm:, md:, lg:, xl:, 2xl:) |
| **Mobile-first layout** | ✅ | CSS-only | Stack skeletons vertically on mobile, horizontal on desktop |
| **Adaptive spacing** | ✅ | CSS-only | Responsive gap/space utilities (gap-2 md:gap-4) |
| **Container queries** | ✅ | CSS-only | Use Tailwind container queries for component-based responsiveness |

### Code Example - Responsive Skeleton Layout
```jsx
import { Skeleton } from "@heroui/react";

function ResponsiveSkeleton() {
  return (
    <div className="w-full space-y-4">
      {/* Responsive width skeleton */}
      <Skeleton className="h-32 w-full rounded-lg md:h-48 lg:h-64" />

      {/* Responsive card layout */}
      <div className="flex flex-col gap-4 md:flex-row">
        <Skeleton className="h-48 w-full rounded-lg md:w-1/2" />
        <Skeleton className="h-48 w-full rounded-lg md:w-1/2" />
      </div>

      {/* Responsive text skeletons */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full rounded sm:w-4/5 md:w-3/5" />
        <Skeleton className="h-3 w-4/5 rounded sm:w-3/5 md:w-2/5" />
      </div>
    </div>
  );
}
```

---

## Styling Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **className prop** | ✅ | Native | Single className for simple styling |
| **classNames prop** | ✅ | Native | Slot-based styling with `base` and `content` slots |
| **Custom colors** | ✅ | CSS-only | Override default skeleton colors via Tailwind classes |
| **Tailwind integration** | ✅ | Native | Full Tailwind CSS support for all styling |
| **CSS variables** | ✅ | CSS-only | Custom properties for advanced theming |

### Code Example - Basic Styling
```jsx
import { Skeleton } from "@heroui/react";

function StyledSkeleton() {
  return (
    <div className="space-y-4">
      {/* Single className */}
      <Skeleton className="h-20 rounded-lg bg-gray-200" />

      {/* Custom colors */}
      <Skeleton className="h-20 rounded-lg bg-blue-100" />
    </div>
  );
}
```

### Code Example - Slot-based Styling
```jsx
import { Skeleton } from "@heroui/react";

function SlotStyledSkeleton() {
  return (
    <Skeleton
      classNames={{
        base: "rounded-xl bg-gray-100",
        content: "rounded-lg"
      }}
      className="h-20"
    >
      <div>Actual content when loaded</div>
    </Skeleton>
  );
}
```

---

## State and Data Attributes

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| **data-loaded attribute** | ✅ | Native | Automatically added to base element indicating loaded state |
| **Loading state** | ✅ | Native | Skeleton animation active when `isLoaded={false}` |
| **Loaded state** | ✅ | Native | Content visible when `isLoaded={true}` |

### Code Example - Using Data Attributes for Custom Styling
```jsx
import { Skeleton } from "@heroui/react";

// Custom CSS using data-loaded attribute
const styles = `
  [data-loaded="true"] {
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  [data-loaded="false"] {
    opacity: 0.6;
  }
`;

function DataAttributeExample() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <Skeleton isLoaded={isLoaded} className="h-20 rounded-lg">
        <div>Content appears when loaded</div>
      </Skeleton>
    </>
  );
}
```

---

## Advanced Use Cases

### Code Example - Skeleton with Real Data Fetching
```jsx
import { useEffect, useState } from "react";
import { Skeleton, Card, CardBody } from "@heroui/react";

function DataFetchExample() {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsLoaded(true);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoaded(true); // Show error state instead
      });
  }, []);

  return (
    <Card>
      <CardBody>
        <Skeleton isLoaded={isLoaded}>
          {data ? (
            <div>
              <h3>{data.name}</h3>
              <p>{data.description}</p>
            </div>
          ) : (
            <div>Error loading data</div>
          )}
        </Skeleton>
      </CardBody>
    </Card>
  );
}
```

### Code Example - Progressive Loading (Staggered)
```jsx
import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";

function ProgressiveLoading() {
  const [loadedItems, setLoadedItems] = useState([]);

  useEffect(() => {
    // Simulate staggered loading
    const delays = [500, 1000, 1500, 2000];
    delays.forEach((delay, index) => {
      setTimeout(() => {
        setLoadedItems(prev => [...prev, index]);
      }, delay);
    });
  }, []);

  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map(index => (
        <Skeleton
          key={index}
          isLoaded={loadedItems.includes(index)}
          className="h-16 rounded-lg"
        >
          <div className="flex h-16 items-center rounded-lg bg-blue-100 p-4">
            Item {index + 1} loaded!
          </div>
        </Skeleton>
      ))}
    </div>
  );
}
```

### Code Example - Skeleton with Error Handling
```jsx
import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";

function SkeletonWithError() {
  const [state, setState] = useState({ isLoaded: false, error: null, data: null });

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(data => setState({ isLoaded: true, error: null, data }))
      .catch(error => setState({ isLoaded: true, error: error.message, data: null }));
  }, []);

  return (
    <Skeleton isLoaded={state.isLoaded} className="h-32 rounded-lg">
      {state.error ? (
        <div className="flex h-32 items-center justify-center rounded-lg bg-red-50 text-red-600">
          Error: {state.error}
        </div>
      ) : (
        <div className="h-32 rounded-lg bg-green-50 p-4">
          {state.data?.content}
        </div>
      )}
    </Skeleton>
  );
}
```

---

## Notable Features

### 1. isLoaded Prop Pattern
The `isLoaded` prop is the primary control mechanism for the Skeleton component:
- When `false`: Shows animated skeleton placeholder
- When `true`: Reveals the actual children content
- Enables smooth transitions between loading and loaded states
- Content is present in DOM but visibility controlled by the prop

**Benefits**:
- No layout shift when content loads
- Single source of truth for loading state
- Consistent API across all skeleton instances
- Supports progressive enhancement

### 2. Animation Control Hierarchy
HeroUI provides multiple levels of animation control:

**Component Level** (highest priority):
```jsx
<Skeleton disableAnimation />
<Skeleton animationType="pulse" />
```

**Provider Level** (global default for v2.4.0+):
```jsx
<HeroUIProvider disableAnimation>
```

**CSS Variable Level** (v3, theme-wide default):
```css
:root {
  --skeleton-default-animation-type: shimmer;
}
```

This hierarchy allows for:
- Global animation preferences
- Per-instance overrides
- Theme-level customization
- Accessibility considerations (reduced motion)

### 3. Slot-Based Styling System
The Skeleton component exposes two styling slots:

**base**: The wrapper element containing the animation pseudo-elements
**content**: The actual children content (visible when loaded)

```jsx
<Skeleton
  classNames={{
    base: "custom-skeleton-wrapper",
    content: "custom-content-wrapper"
  }}
>
  <ActualContent />
</Skeleton>
```

**Benefits**:
- Fine-grained style control
- Separate animation from content styling
- Override default styles without breaking functionality
- Consistent with HeroUI's component architecture

### 4. Data Attribute System
The `data-loaded` attribute enables CSS-based state styling:

```css
[data-loaded="false"] {
  /* Skeleton state styles */
  cursor: wait;
  pointer-events: none;
}

[data-loaded="true"] {
  /* Loaded state styles */
  animation: fadeIn 0.3s ease;
}
```

**Use cases**:
- Custom transitions
- Accessibility enhancements
- Progressive disclosure patterns
- State-dependent interactions

### 5. Tailwind-First Approach
Unlike many component libraries with predefined shapes, HeroUI Skeleton relies on Tailwind classes for shapes:

**Advantages**:
- Maximum flexibility (any shape possible)
- Consistent with existing Tailwind workflow
- No API bloat with preset shapes
- Full responsive control via Tailwind modifiers
- Easy customization without prop drilling

**Trade-off**:
- More verbose than preset shapes
- Requires Tailwind knowledge
- No built-in shape validation

### 6. Mobile-First Design
The component is built with mobile considerations:
- Touch-friendly minimum sizes
- Responsive layout patterns in examples
- Performance-optimized animations (CSS-based, GPU-accelerated)
- Small bundle size

### 7. Shimmer Animation Implementation
The default shimmer effect uses CSS pseudo-elements:

**Technical details**:
- `:before` and `:after` pseudo-elements on the base slot
- 2s linear infinite animation
- Gradient overlay with translateX transform
- GPU-accelerated for smooth performance
- Respects `prefers-reduced-motion` media query (when properly configured)

### 8. Content Preservation Pattern
Unlike some skeleton implementations that conditionally render, HeroUI Skeleton keeps children in the DOM:

**Benefits**:
- No layout shift when loading completes
- Maintains form state during loading
- Smoother transitions
- Better for SEO (content present in HTML)

**Consideration**:
- Slightly larger initial DOM size
- Content technically in DOM but invisible during loading

---

## Research Notes

### Framework Architecture Observations

**React-Based Foundation**: HeroUI Skeleton is built specifically for React, leveraging component composition patterns extensively. The `isLoaded` prop pattern aligns with React's declarative state management philosophy.

**Tailwind CSS Integration**: The component's reliance on Tailwind for shapes demonstrates HeroUI's commitment to utility-first CSS. This differs from frameworks like Material-UI or Ant Design that provide preset shape props.

**Animation Strategy**: HeroUI uses CSS-based animations (pseudo-elements with transforms) rather than JavaScript-based animation libraries. This provides:
- Better performance (GPU-accelerated)
- Smaller bundle size
- Easier customization via CSS
- Automatic respect for accessibility preferences

**Provider Pattern**: The use of `HeroUIProvider` for global configuration follows React context patterns, allowing application-wide settings without prop drilling.

### Cross-Framework Considerations

For web components adaptation:

**isLoaded Pattern**:
1. **Attribute**: Map to `loaded` boolean attribute
2. **Property**: Expose as `.loaded` property
3. **Event**: Consider dispatching `load` or `loaded` event when transitioning
4. **CSS**: Use `:host([loaded])` selector for state-based styling

**Animation Control**:
1. **Attribute**: `animation-type="shimmer|pulse|none"` attribute
2. **CSS Variable**: Support `--skeleton-animation-type` for theming
3. **Part**: Expose `::part(base)` and `::part(content)` for external styling
4. **Reduced Motion**: Use `@media (prefers-reduced-motion: reduce)` to disable animations

**Shape Patterns**:
1. **Slot**: Single default slot for content
2. **CSS Classes**: Allow external classes via `class` attribute
3. **CSS Parts**: Consider `::part(skeleton)` for shape customization
4. **Presets**: Optionally provide `shape="circle|rectangle|text"` for common patterns

**Styling System**:
1. **Shadow DOM**: Use shadow DOM for encapsulation
2. **CSS Custom Properties**: Expose theming variables
3. **Tailwind**: Support utility classes via shadow DOM styling strategies
4. **Slots**: Use named slots if multi-part skeleton needed

### API Design Insights

**Simplicity**: The minimal prop surface (`isLoaded`, `animationType`, `disableAnimation`, `className`, `classNames`) keeps the API focused. No size, variant, or color props - these are handled via className.

**Composition Over Configuration**: Rather than providing preset skeleton patterns (profile, card, list), HeroUI provides primitives that compose together. This is evident in the examples showing how to build complex skeletons from basic components.

**State Management**: The `isLoaded` prop is the single source of truth. This boolean prop controls all skeleton behavior, making state management straightforward.

**Performance**: The CSS-based animation approach with GPU acceleration and small API surface results in minimal runtime overhead.

### Accessibility Considerations

**Screen Readers**:
- Skeleton should have `aria-busy="true"` when loading
- Content should have `aria-live="polite"` to announce when loaded
- Consider `aria-label` describing loading state

**Reduced Motion**:
- Animations should respect `prefers-reduced-motion: reduce`
- Provide static alternative for users with motion sensitivities
- HeroUI's `disableAnimation` prop helps but should be automatic based on user preferences

**Keyboard Navigation**:
- Loading content should not be focusable
- Focus management when content becomes available
- Skip links for long skeleton sections

**Color Contrast**:
- Skeleton backgrounds should have sufficient contrast
- Don't rely solely on animation to indicate loading state

### Potential Improvements

**Preset Shapes**:
1. **Built-in variants**: `shape="circle|rectangle|text"` prop for common patterns
2. **Semantic components**: `<SkeletonAvatar>`, `<SkeletonText>`, `<SkeletonCard>`
3. **Size presets**: `size="sm|md|lg"` for consistent sizing

**Enhanced Animation**:
1. **Wave animation**: Alternative to shimmer for variety
2. **Custom timing**: `animationDuration` prop for control
3. **Stagger helper**: Built-in progressive loading support
4. **Entrance animation**: Smooth fade-in when content loads

**Loading States**:
1. **Error state**: `error` prop for failed loads
2. **Retry pattern**: Built-in retry button for failed loads
3. **Progress indicator**: Show loading percentage if available
4. **Timeout**: Auto-transition after max duration

**Accessibility**:
1. **Auto ARIA**: Automatic `aria-busy` and `aria-live` management
2. **Motion preferences**: Automatic `prefers-reduced-motion` detection
3. **SR announcements**: Built-in screen reader announcements
4. **Loading label**: `loadingLabel` prop for custom SR text

**Developer Experience**:
1. **TypeScript generics**: Type-safe children based on data type
2. **Suspense integration**: React Suspense boundary support
3. **DevTools**: Loading state visualization in React DevTools
4. **Storybook**: Comprehensive component stories

**Performance**:
1. **Lazy loading**: Defer non-visible skeletons
2. **Intersection observer**: Only animate visible skeletons
3. **Bundle size**: Tree-shakable animation variants
4. **CSS containment**: Use `contain` property for performance

---

## Installation

### NPM Installation
```bash
# Individual package (optional if @heroui/react installed)
npm install @heroui/skeleton

# Or install full HeroUI library
npm install @heroui/react
```

### CLI Installation (v3)
```bash
# Using HeroUI CLI
npx heroui-cli@latest add skeleton
```

### Import Statements
```jsx
// Named import from @heroui/react
import { Skeleton } from "@heroui/react";

// Or from individual package
import { Skeleton } from "@heroui/skeleton";
```

---

## Complete API Reference

### Skeleton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content to display when loaded |
| `isLoaded` | boolean | false | Controls skeleton visibility and content display |
| `animationType` | "shimmer" \| "pulse" \| "none" | "shimmer" | Animation style (v3) |
| `disableAnimation` | boolean | false | Disable all animations |
| `className` | string | - | CSS classes for the skeleton element |
| `classNames` | object | - | Slot-based classes (`base`, `content`) |

### Slots

| Slot | Description |
|------|-------------|
| `base` | The skeleton wrapper containing animation pseudo-elements |
| `content` | The children content wrapper (visible when loaded) |

### Data Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `data-loaded` | boolean | Indicates whether skeleton is in loaded state |

### CSS Variables (v3)

| Variable | Type | Description |
|----------|------|-------------|
| `--skeleton-default-animation-type` | "shimmer" \| "pulse" \| "none" | Global default animation type |

---

## TypeScript Support

HeroUI is written in TypeScript and provides full type definitions:

```typescript
import { Skeleton } from "@heroui/react";
import type { SkeletonProps } from "@heroui/react";

interface UserData {
  name: string;
  email: string;
}

function TypedSkeleton() {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Skeleton isLoaded={isLoaded}>
      {data && (
        <div>
          <h3>{data.name}</h3>
          <p>{data.email}</p>
        </div>
      )}
    </Skeleton>
  );
}
```

---

## Conclusion

HeroUI's Skeleton component demonstrates a minimalist, Tailwind-first approach to loading placeholders:

**Strengths**:
- Simple, focused API with `isLoaded` as primary control
- Flexible shape customization via Tailwind classes
- Multiple animation types with global and per-instance control
- Excellent composition patterns for complex layouts
- Performance-optimized CSS animations
- Full TypeScript support
- Slot-based styling for fine-grained control

**Design Philosophy**:
- Composition over configuration
- Tailwind-first for maximum flexibility
- Minimal API surface for simplicity
- CSS-based animations for performance
- React-centric patterns (hooks, props, provider)

**Notable Innovations**:
- Three-tier animation control (component → provider → CSS variable)
- Data attribute system for custom state styling
- Content preservation pattern (no layout shift)
- Slot-based styling architecture

**Ideal Use Cases**:
- Async data loading placeholders
- Progressive page rendering
- Image/media loading states
- Form submission feedback
- Infinite scroll loading indicators

The component's strength lies in its simplicity and flexibility - rather than providing preset skeleton patterns, it gives developers the primitives to build exactly what they need using familiar Tailwind patterns.
