# Radix UI Primitives - Avatar Usage Patterns

## Component URL
https://www.radix-ui.com/primitives/docs/components/avatar
Status: ✅ Working

## Documentation Quality
Excellent - Clear, concise documentation focused on the primitive's core functionality. Comprehensive API reference with all props documented, practical code examples, and emphasis on flexibility and composition. Well-organized with installation instructions, usage patterns, and styling guidance. Documentation is lean and focused on behavior/accessibility rather than visual design.

## Component Definition
- **Core purpose**: An image element with a fallback mechanism for displaying user profile images or avatars. Automatically handles image loading states and gracefully degrades to fallback content when images fail to load or are slow to appear.
- **Mental model**: A smart image container that manages three states: loading (shows nothing or delayed fallback), loaded (shows image), and error (shows fallback). The component intelligently waits for image load confirmation before displaying to prevent layout shifts and provides optional delay to avoid flashing fallback content on fast connections.
- **Semantic meaning**: Represents a user or entity visually through an image with graceful degradation. Unlike a standard `<img>` tag, Avatar manages loading states explicitly and ensures fallback content is semantically appropriate. Follows best practices for progressive image loading.

## Component Architecture
| Pattern | Present | Details |
|---------|---------|---------|
| Composition pattern | ✅ | Three-part structure: Root, Image, Fallback |
| AsChild polymorphism | ✅ | All parts support `asChild` prop for element composition |
| Unstyled primitive | ✅ | No default styles - consumer provides all styling |
| Controlled behavior | ✅ | `onLoadingStatusChange` callback for external state management |
| Automatic state management | ✅ | Internal tracking of image loading status |
| Portal rendering | ❌ | Not applicable - inline rendering |
| Data attributes | ❌ | Not documented (may exist but not exposed in API docs) |

## Image Handling Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Automatic load detection | ✅ | Image only renders after successful load |
| Loading state management | ✅ | `onLoadingStatusChange` callback with status updates |
| Error handling | ✅ | Fallback displays on load failure |
| Load event callback | ✅ | Monitor image loading via `onLoadingStatusChange` |
| Lazy loading | ❌ | Not documented (use native `loading` attribute on img) |
| Srcset support | ✅ | Native `<img>` attributes available |
| Object fit control | ✅ | Via CSS on Avatar.Image |
| Alternative sources | ❌ | Single `src` prop, no multi-source fallback chain |
| Caching strategy | ❌ | Relies on browser cache behavior |

## Fallback Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text fallback | ✅ | Initials or text as children |
| Icon fallback | ✅ | Any React element as children |
| Component fallback | ✅ | Complex components as fallback content |
| Delayed rendering | ✅ | `delayMs` prop prevents flash on fast loads (default: immediate) |
| Custom styling | ✅ | Full control over fallback appearance |
| Conditional fallback | ✅ | Only shows when image loading/error state |
| Placeholder image | ✅ | Can render `<img>` in Fallback slot |
| Empty fallback | ✅ | Fallback can be empty (will show nothing on error) |

## Size & Layout Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size variants | ❌ | No built-in sizes - controlled via CSS |
| Responsive sizing | ✅ | Via CSS custom properties and media queries |
| Shape variants | ❌ | No built-in shapes - controlled via CSS (border-radius) |
| Fixed dimensions | ✅ | Via width/height CSS properties |
| Aspect ratio control | ✅ | Via CSS aspect-ratio or explicit dimensions |
| Content-based sizing | ✅ | Can size based on content if not explicitly sized |

## State Management Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading state | ✅ | Implicit - image not rendered until loaded |
| Error state | ✅ | Implicit - fallback renders on error |
| Idle state | ✅ | Initial state before image load attempt |
| Success state | ✅ | Image visible after successful load |
| State callback | ✅ | `onLoadingStatusChange(status: 'idle' \| 'loading' \| 'loaded' \| 'error')` |
| External state control | ✅ | Via `onLoadingStatusChange` for manual management |
| Data attributes | ❌ | Not documented for styling state changes |

## Accessibility Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Alt text support | ✅ | Standard `alt` attribute on Avatar.Image |
| ARIA attributes | ❌ | Not documented (relies on semantic HTML) |
| Keyboard navigation | ❌ | Not applicable - presentational component |
| Focus management | ❌ | Not applicable - non-interactive by default |
| Screen reader support | ✅ | Via `alt` text and semantic fallback content |
| Role attributes | ❌ | Not documented (likely uses default img role) |
| Semantic HTML | ✅ | Uses native `<img>` element |

## Composition Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Tooltip integration | ✅ | Example shows wrapping with Tooltip.Trigger |
| Badge overlay | ❌ | Not documented (consumer implements) |
| Status indicator | ❌ | Not documented (consumer implements) |
| Group/stack pattern | ❌ | Not documented (consumer implements) |
| Link wrapper | ✅ | Via `asChild` pattern can compose with links |
| Button wrapper | ✅ | Via `asChild` pattern can compose with buttons |
| Custom container | ✅ | Root supports `asChild` for polymorphic rendering |

## Code Examples

### Basic Avatar with Fallback
```jsx
import * as Avatar from '@radix-ui/react-avatar';

const BasicAvatar = () => (
  <Avatar.Root className="AvatarRoot">
    <Avatar.Image
      className="AvatarImage"
      src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
      alt="Colm Tuite"
    />
    <Avatar.Fallback className="AvatarFallback" delayMs={600}>
      CT
    </Avatar.Fallback>
  </Avatar.Root>
);
```

### Styling Example (CSS)
```css
.AvatarRoot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  user-select: none;
  width: 45px;
  height: 45px;
  border-radius: 100%;
  background-color: var(--black-a3);
}

.AvatarImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.AvatarFallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: var(--violet-11);
  font-size: 15px;
  line-height: 1;
  font-weight: 500;
}
```

### Controlled Loading State
```jsx
import * as React from 'react';
import * as Avatar from '@radix-ui/react-avatar';

const ControlledAvatar = () => {
  const [imageStatus, setImageStatus] = React.useState('idle');

  return (
    <div>
      <Avatar.Root>
        <Avatar.Image
          src="https://example.com/avatar.jpg"
          alt="User Name"
          onLoadingStatusChange={setImageStatus}
        />
        <Avatar.Fallback delayMs={600}>
          UN
        </Avatar.Fallback>
      </Avatar.Root>
      <p>Status: {imageStatus}</p>
    </div>
  );
};
```

### With Tooltip Composition
```jsx
import * as Avatar from '@radix-ui/react-avatar';
import * as Tooltip from '@radix-ui/react-tooltip';

const AvatarWithTooltip = () => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <Avatar.Root className="AvatarRoot">
        <Avatar.Image
          src="https://example.com/user.jpg"
          alt="Jane Doe"
        />
        <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
      </Avatar.Root>
    </Tooltip.Trigger>
    <Tooltip.Content side="top">
      Jane Doe - Product Designer
      <Tooltip.Arrow />
    </Tooltip.Content>
  </Tooltip.Root>
);
```

### AsChild Pattern for Custom Elements
```jsx
import * as Avatar from '@radix-ui/react-avatar';

const CustomAvatar = () => (
  <Avatar.Root asChild>
    <a href="/profile" className="AvatarLink">
      <Avatar.Image
        src="https://example.com/avatar.jpg"
        alt="Profile"
      />
      <Avatar.Fallback delayMs={600}>P</Avatar.Fallback>
    </a>
  </Avatar.Root>
);
```

### Multiple Avatars with Different States
```jsx
import * as Avatar from '@radix-ui/react-avatar';

const AvatarGroup = () => (
  <div style={{ display: 'flex', gap: 20 }}>
    {/* Successfully loaded avatar */}
    <Avatar.Root className="AvatarRoot">
      <Avatar.Image
        src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
        alt="Colm Tuite"
      />
      <Avatar.Fallback delayMs={600}>CT</Avatar.Fallback>
    </Avatar.Root>

    {/* Broken image - shows fallback */}
    <Avatar.Root className="AvatarRoot">
      <Avatar.Image
        src="https://broken-link.example.com/invalid.jpg"
        alt="Broken Image"
      />
      <Avatar.Fallback>BI</Avatar.Fallback>
    </Avatar.Root>

    {/* Icon fallback */}
    <Avatar.Root className="AvatarRoot">
      <Avatar.Image
        src="https://example.com/user.jpg"
        alt="User"
      />
      <Avatar.Fallback>
        <UserIcon />
      </Avatar.Fallback>
    </Avatar.Root>
  </div>
);
```

### Without Delay (Immediate Fallback)
```jsx
import * as Avatar from '@radix-ui/react-avatar';

const ImmediateFallback = () => (
  <Avatar.Root className="AvatarRoot">
    <Avatar.Image
      src="https://example.com/slow-loading-image.jpg"
      alt="User"
    />
    {/* No delayMs - fallback shows immediately while loading */}
    <Avatar.Fallback>U</Avatar.Fallback>
  </Avatar.Root>
);
```

## Notable Features
- **Unstyled primitive approach**: Zero built-in styles - complete styling control for consumers
- **Smart loading detection**: Image only renders after successful load, preventing broken image displays
- **Flexible fallback**: Accepts any React element (text, icons, components) as fallback content
- **Flash prevention**: `delayMs` prop prevents annoying content flashing on fast connections
- **Loading state callback**: `onLoadingStatusChange` provides external state management capability
- **AsChild pattern**: Polymorphic rendering on all parts enables powerful composition
- **Minimal API surface**: Only essential props exposed - simple and focused
- **Automatic error handling**: Gracefully falls back on image load errors without manual intervention
- **Native image attributes**: Full access to standard `<img>` attributes (srcset, sizes, loading, etc.)
- **Composition-first**: Designed to integrate with other Radix primitives seamlessly
- **Accessibility baseline**: Leverages semantic HTML with proper alt text support
- **Tiny bundle size**: 3.11 kB gzipped - minimal overhead
- **Production-ready**: v1.1.10 indicates stable, mature API
- **No dependencies on Radix Themes**: Pure primitive - works independently
- **CSS-in-JS agnostic**: Works with any styling solution

## Implementation Patterns

### Three-State Management
The Avatar manages three distinct states internally:
1. **Idle/Loading**: Image hasn't loaded yet - shows nothing or delayed fallback
2. **Loaded**: Image successfully loaded - shows image, hides fallback
3. **Error**: Image failed to load - shows fallback immediately

### Fallback Delay Strategy
The `delayMs` prop implements a smart delay:
- **Without delay**: Fallback appears immediately, may flash briefly before image loads
- **With delay (e.g., 600ms)**: On fast connections, image loads before delay expires, preventing flash
- **Use case**: Set `delayMs={600}` for optimal UX on varying connection speeds

### Composition via AsChild
All three parts support `asChild`, enabling powerful patterns:
- Root as link: `<Avatar.Root asChild><a href="...">...</a></Avatar.Root>`
- Root as button: `<Avatar.Root asChild><button>...</button></Avatar.Root>`
- Image with custom wrapper: `<Avatar.Image asChild><CustomImg /></Avatar.Image>`

## Research Notes
- Documentation is exceptionally focused and lean - covers essentials without bloat
- Component follows Radix's unstyled primitive philosophy - maximum flexibility
- The `delayMs` pattern is a thoughtful UX detail addressing real-world loading scenarios
- No built-in size variants or shape variants - intentionally left to styling layer
- Accessibility is achieved through semantic HTML rather than heavy ARIA markup
- The component trusts browser image loading behavior and builds on top of it
- `onLoadingStatusChange` callback enables advanced patterns like loading skeletons
- AsChild pattern is consistently applied, enabling rich composition scenarios
- No portal rendering since avatar is always inline within its context
- Package is self-contained with minimal dependencies
- Version 1.1.10 suggests stable API with years of production usage
- Works independently of Radix Themes - can be used in any design system
- CSS variables shown in examples use Radix Colors but are not required
- No keyboard interaction patterns needed - component is presentational
- Error state handling is automatic - no manual error prop needed
- The three-part structure (Root/Image/Fallback) provides clear separation of concerns
- Fallback can be empty if you want no visual indicator on error
- Component doesn't prescribe layout patterns like avatar groups/stacks - consumer responsibility
- Status indicators, badges, borders are all consumer-implemented via CSS/composition
- Responsive sizing achieved through standard CSS techniques
- Works with server-side rendering - degrades gracefully without JavaScript
