# PrimeReact ProgressSpinner - Usage Pattern Research

**Component**: ProgressSpinner (Loader)
**Framework**: PrimeReact
**Version**: v8+ (primereact.org)
**Research Date**: 2025-11-04

---

## 1. Component Overview

The **ProgressSpinner** is PrimeReact's process status indicator component designed to display an infinite spinning animation. It serves as a visual feedback mechanism to communicate loading states, background processing, or ongoing operations to users. The component renders as an animated SVG-based circular spinner that continuously rotates, providing a non-deterministic progress indication suitable for operations where completion time is unknown or variable.

ProgressSpinner is implemented as a lightweight, zero-configuration component that works out-of-the-box while offering customization options for size, color, stroke width, and animation speed to match various design requirements.

---

## 2. Basic Usage

### Import Statement

```jsx
import { ProgressSpinner } from 'primereact/progressspinner';
```

### Minimal Implementation

The simplest usage requires no props - the component displays with default styling:

```jsx
<ProgressSpinner />
```

This renders a standard-sized spinner with default stroke width, colors, and animation speed.

### Basic Configuration

A typical implementation with common customization:

```jsx
<ProgressSpinner
  style={{ width: '50px', height: '50px' }}
  strokeWidth="8"
  fill="var(--surface-ground)"
  animationDuration=".5s"
/>
```

**Explanation:**
- `style`: Controls the overall size of the spinner (width/height)
- `strokeWidth`: Sets the thickness of the spinning circle line
- `fill`: Defines the background/inactive color behind the animated stroke
- `animationDuration`: Controls how fast the spinner rotates (lower = faster)

---

## 3. Props/API Reference

### Complete Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style` | `React.CSSProperties` | `undefined` | Inline CSS styles applied to the root element. Commonly used for width/height sizing. |
| `className` | `string` | `undefined` | CSS class name(s) to apply to the root element for styling. |
| `strokeWidth` | `string \| number` | `"2"` | Width/thickness of the spinner's stroke line. Higher values create thicker lines. |
| `fill` | `string` | `"none"` | Fill color for the background circle. Accepts CSS color values or CSS variables (e.g., `"var(--surface-ground)"`). |
| `animationDuration` | `string` | `"2s"` | Duration of one complete rotation. Accepts CSS time values (e.g., `".5s"`, `"1s"`, `"2s"`). Lower values = faster spinning. |
| `aria-label` | `string` | `undefined` | Accessibility label for screen readers to describe the spinner's purpose. |
| `aria-labelledby` | `string` | `undefined` | ID of an element that labels/describes the spinner for screen readers. |
| `pt` | `ProgressSpinnerPassThroughOptions` | `undefined` | PassThrough API object for advanced DOM customization of internal elements. |
| `ptOptions` | `ProgressSpinnerPassThroughMethodOptions` | `undefined` | Configuration options for PassThrough behavior. |
| `unstyled` | `boolean` | `false` | When enabled, removes default PrimeReact styling, allowing full custom styling control. |

### Additional Standard React Props

ProgressSpinner also accepts standard React/HTML attributes:
- `id`: Element ID
- `data-*`: Data attributes
- Any other standard HTML div attributes

---

## 4. Variants & Patterns

### Size Control

Size is controlled via the `style` prop with CSS dimensions:

```jsx
// Small spinner
<ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="4" />

// Medium spinner (default-ish)
<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="6" />

// Large spinner
<ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth="8" />

// Extra large spinner
<ProgressSpinner style={{ width: '150px', height: '150px' }} strokeWidth="10" />
```

**Best Practice**: Match `strokeWidth` proportionally to size - larger spinners should have thicker strokes for visual balance.

### Stroke Width Customization

The `strokeWidth` prop controls line thickness:

```jsx
// Thin, delicate line
<ProgressSpinner strokeWidth="2" />

// Standard thickness
<ProgressSpinner strokeWidth="4" />

// Bold, prominent line
<ProgressSpinner strokeWidth="8" />

// Very thick line
<ProgressSpinner strokeWidth="12" />
```

### Color Customization

Colors are controlled via the `fill` prop (background) and CSS/theme variables (animated stroke):

```jsx
// Light background with themed spinner
<ProgressSpinner fill="var(--surface-ground)" />

// Dark background
<ProgressSpinner fill="#333333" />

// Transparent background (show only the animated stroke)
<ProgressSpinner fill="none" />

// Custom hex color
<ProgressSpinner fill="#EEEEEE" />

// Using PrimeReact theme variables
<ProgressSpinner fill="var(--surface-0)" />
```

**Note**: The animated spinning portion's color is typically controlled via CSS/theme, not props. The `fill` prop only affects the background circle.

### Animation Speed Control

The `animationDuration` prop controls rotation speed:

```jsx
// Fast spinner (half second per rotation)
<ProgressSpinner animationDuration=".5s" />

// Standard speed (1 second per rotation)
<ProgressSpinner animationDuration="1s" />

// Slower spinner (2 seconds per rotation) - DEFAULT
<ProgressSpinner animationDuration="2s" />

// Very slow spinner
<ProgressSpinner animationDuration="4s" />
```

**Use Cases**:
- Fast spinners (`.5s-1s`): Quick operations, immediate feedback
- Standard spinners (`1s-2s`): General loading states
- Slow spinners (`3s+`): Long-running background processes

### Combining Patterns

A fully customized spinner combining all patterns:

```jsx
<ProgressSpinner
  style={{ width: '80px', height: '80px' }}
  strokeWidth="6"
  fill="var(--surface-ground)"
  animationDuration="1s"
  aria-label="Loading content"
/>
```

---

## 5. Composition Patterns

### Loading Overlay Pattern

Displaying a spinner over content during loading:

```jsx
import { ProgressSpinner } from 'primereact/progressspinner';

function LoadingOverlay({ isLoading, children }) {
  return (
    <div style={{ position: 'relative' }}>
      {children}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}>
          <ProgressSpinner />
        </div>
      )}
    </div>
  );
}
```

### With BlockUI Component

PrimeReact's **BlockUI** component is commonly used with ProgressSpinner:

```jsx
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';

function BlockingLoader({ blocked, children }) {
  return (
    <BlockUI
      blocked={blocked}
      template={<ProgressSpinner />}
    >
      {children}
    </BlockUI>
  );
}
```

This pattern blocks user interaction while showing the spinner.

### Centered Page Loader

Full-page loading spinner:

```jsx
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <ProgressSpinner
        style={{ width: '100px', height: '100px' }}
        strokeWidth="8"
      />
    </div>
  );
}
```

### Inline Loading State

Small spinner for inline loading indicators:

```jsx
function InlineLoader({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <ProgressSpinner
        style={{ width: '20px', height: '20px' }}
        strokeWidth="4"
      />
      <span>{text}</span>
    </div>
  );
}
```

### Conditional Rendering

Common pattern with async data fetching:

```jsx
function DataContainer() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <ProgressSpinner />
      </div>
    );
  }

  return <DataDisplay data={data} />;
}
```

---

## 6. Styling & Theming

### PrimeReact Theme Integration

ProgressSpinner integrates with PrimeReact's theming system:

```jsx
// Using theme CSS variables
<ProgressSpinner
  fill="var(--surface-ground)"  // Background from theme
  style={{ color: 'var(--primary-color)' }}  // Spinner color from theme
/>
```

**Common Theme Variables**:
- `--surface-ground`: Base surface color
- `--surface-0`, `--surface-50`, etc.: Surface color variations
- `--primary-color`: Primary brand color
- `--text-color`: Standard text color

### CSS Customization via className

Apply custom CSS classes:

```jsx
<ProgressSpinner className="custom-spinner" />
```

```css
.custom-spinner {
  /* Override spinner color */
  color: #ff6b6b;
}

.custom-spinner svg {
  /* Additional SVG customization */
  filter: drop-shadow(0 0 5px rgba(0,0,0,0.3));
}
```

### PassThrough (pt) API

Advanced DOM customization using the PassThrough API:

```jsx
<ProgressSpinner
  pt={{
    root: { className: 'my-spinner-root' },
    spinner: { className: 'my-spinner-svg' },
    circle: {
      className: 'my-spinner-circle',
      style: { stroke: '#custom-color' }
    }
  }}
/>
```

**PassThrough Sections** (available DOM elements):
- `root`: Outermost container element
- `spinner`: SVG element
- `circle`: The animated circle path

### Unstyled Mode

Remove all default PrimeReact styles for complete control:

```jsx
<ProgressSpinner unstyled />
```

**Warning**: In unstyled mode, you must provide all styling via `className`, `style`, or `pt` props. The component may not display without custom styles.

### Global Configuration

Configure default styling for all ProgressSpinner instances via PrimeReactProvider:

```jsx
import { PrimeReactProvider } from 'primereact/api';

const value = {
  pt: {
    progressspinner: {
      root: { className: 'my-global-spinner' }
    }
  }
};

<PrimeReactProvider value={value}>
  <App />
</PrimeReactProvider>
```

---

## 7. Accessibility

### ARIA Attributes

ProgressSpinner automatically applies the `progressbar` ARIA role for semantic meaning.

**Using aria-label**:
```jsx
<ProgressSpinner aria-label="Loading user data" />
```

Screen readers will announce: "Loading user data, progress bar"

**Using aria-labelledby**:
```jsx
<div>
  <h2 id="loading-title">Fetching Results</h2>
  <ProgressSpinner aria-labelledby="loading-title" />
</div>
```

Screen readers associate the spinner with the heading text.

### Screen Reader Support

- Component uses semantic `role="progressbar"`
- Indeterminate state (no `aria-valuenow`) indicates ongoing process
- Provide descriptive labels via `aria-label` or `aria-labelledby`
- Hide purely decorative spinners with `aria-hidden="true"`

### Keyboard Support

ProgressSpinner has **no keyboard interaction** - it's a pure display component with no focusable elements. This is appropriate for status indicators.

### Best Practices

1. **Always provide context**: Use `aria-label` to describe what's loading
   ```jsx
   <ProgressSpinner aria-label="Loading search results" />
   ```

2. **Associate with related text**: Use `aria-labelledby` when descriptive text exists
   ```jsx
   <p id="status">Processing payment...</p>
   <ProgressSpinner aria-labelledby="status" />
   ```

3. **Announce state changes**: Inform screen reader users when loading starts/ends
   ```jsx
   <div role="status" aria-live="polite">
     {loading ? <ProgressSpinner aria-label="Loading" /> : 'Content loaded'}
   </div>
   ```

4. **Don't rely solely on visual**: Provide text alternatives for screen reader users

---

## 8. Best Practices

### When to Use ProgressSpinner

**Appropriate Use Cases**:
- Asynchronous data fetching (API calls, database queries)
- File uploads/downloads with unknown duration
- Background processing without determinable progress
- Page/section loading states
- Lazy-loaded component initialization
- Form submission processing

**When NOT to Use**:
- Operations with known progress (use ProgressBar instead)
- Very quick operations (<300ms) - may cause flashing
- Purely decorative animations - consider accessibility impact

### Common Patterns

**1. Debounce Short Operations**

Prevent spinner flashing for quick operations:

```jsx
function useDelayedLoading(isLoading, delay = 300) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowSpinner(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(false);
    }
  }, [isLoading, delay]);

  return showSpinner;
}

function MyComponent() {
  const [loading, setLoading] = useState(false);
  const showSpinner = useDelayedLoading(loading);

  return showSpinner ? <ProgressSpinner /> : <Content />;
}
```

**2. Combine with Suspense**

React Suspense integration:

```jsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<ProgressSpinner />}>
      <LazyComponent />
    </Suspense>
  );
}
```

**3. Skeleton Screens for Better UX**

Consider skeleton screens for content-heavy pages instead of spinners:

```jsx
// Instead of just a spinner
{loading ? <ProgressSpinner /> : <UserProfile />}

// Better UX with skeleton
{loading ? <UserProfileSkeleton /> : <UserProfile />}
```

### Performance Considerations

1. **SVG Animation**: ProgressSpinner uses CSS/SVG animations, which are GPU-accelerated and performant
2. **No React Re-renders**: Once mounted, the spinner animates via CSS without triggering React updates
3. **Lightweight**: Minimal DOM footprint (single SVG element)

### Common Gotchas

**1. Size Not Applying**

Problem: Spinner doesn't resize when changing `style.width`

```jsx
// ❌ Wrong - missing height
<ProgressSpinner style={{ width: '100px' }} />

// ✅ Correct - both width and height
<ProgressSpinner style={{ width: '100px', height: '100px' }} />
```

**2. Stroke Width Proportion**

Problem: Stroke looks off-balance

```jsx
// ❌ Thin stroke on large spinner looks weird
<ProgressSpinner style={{ width: '200px', height: '200px' }} strokeWidth="2" />

// ✅ Proportional stroke width
<ProgressSpinner style={{ width: '200px', height: '200px' }} strokeWidth="12" />
```

**3. Unstyled Mode Issues**

Problem: Spinner doesn't display in unstyled mode

```jsx
// ❌ Unstyled without custom styles - invisible!
<ProgressSpinner unstyled />

// ✅ Unstyled with PassThrough styling
<ProgressSpinner
  unstyled
  pt={{
    root: { className: 'my-custom-spinner' },
    circle: { style: { stroke: '#007bff' } }
  }}
/>
```

**4. Color Confusion**

Problem: Expecting `fill` to color the animated stroke

The `fill` prop colors the **background circle**, not the animated spinner. To change the spinning portion's color, use CSS:

```jsx
// ❌ This only changes the background
<ProgressSpinner fill="red" />

// ✅ Change the animated stroke color via CSS
<ProgressSpinner
  className="red-spinner"
  fill="transparent"
/>

// CSS:
.red-spinner { color: red; }
```

### Design Recommendations

1. **Size Hierarchy**:
   - Small (20-30px): Inline loaders, buttons
   - Medium (40-60px): Section loading
   - Large (80-120px): Page loading
   - XL (150px+): Full-page overlays

2. **Animation Speed**:
   - Fast (0.5-1s): Short operations, button states
   - Standard (1-2s): General loading (recommended)
   - Slow (3s+): Long background processes

3. **Color Consistency**: Match spinner color to your brand's primary or accent color via theme variables

4. **Contextual Placement**: Position spinners where content will appear, not arbitrary locations

---

## 9. Comparison Notes

### Unique Characteristics

**Strengths**:
1. **Zero Configuration**: Works instantly with `<ProgressSpinner />`
2. **Theme Integration**: Deep integration with PrimeReact's theming system
3. **PassThrough API**: Powerful low-level DOM customization without component forking
4. **Lightweight**: Minimal props API reduces learning curve
5. **SVG-Based**: Crisp rendering at any size, GPU-accelerated animations

**Limitations**:
1. **No Built-in Variants**: Unlike some libraries (Ant Design, Chakra UI), PrimeReact doesn't provide named size variants (small/medium/large)
2. **Manual Sizing**: Must specify width/height manually via `style` prop
3. **Color Control**: Stroke color requires CSS, not props
4. **No Determinate Mode**: Only supports indeterminate (infinite) spinning - no progress percentage display

### Compared to Other Frameworks

**vs. Material-UI CircularProgress**:
- Material-UI offers both determinate and indeterminate modes
- Material-UI has `size` prop with preset values; PrimeReact requires manual sizing
- PrimeReact's `fill` prop more flexible than Material-UI's `variant`

**vs. Ant Design Spin**:
- Ant Design provides size presets (`small`, `default`, `large`)
- Ant Design has built-in text labels (`tip` prop); PrimeReact requires manual composition
- PrimeReact's PassThrough API offers more granular customization

**vs. Chakra UI Spinner**:
- Chakra uses size tokens (`xs`, `sm`, `md`, `lg`, `xl`); PrimeReact uses CSS dimensions
- Chakra's `color` prop directly controls spinner color; PrimeReact uses CSS
- Both are lightweight and accessible

**vs. Bootstrap Spinner**:
- Bootstrap offers border and grow variants; PrimeReact has single visual style
- PrimeReact's theme integration more sophisticated
- Bootstrap requires class-based customization; PrimeReact offers props + PassThrough

### Notable Design Decisions

1. **Props vs. CSS**: PrimeReact favors CSS customization over props for visual styling (color, effects)
2. **Single Purpose**: Intentionally simple - no text labels, no containers, no variants
3. **Composition Over Configuration**: Expects developers to compose spinners into larger loading patterns (BlockUI, overlays)
4. **Theme-First**: Designed to adapt to theme variables rather than hardcoded colors

---

## Summary

PrimeReact's **ProgressSpinner** is a straightforward, theme-aware loading indicator optimized for simplicity and flexibility. Its minimal props API (`style`, `strokeWidth`, `fill`, `animationDuration`) covers common customization needs while the PassThrough API enables advanced use cases. The component excels in PrimeReact ecosystems with strong theme integration but requires more manual configuration compared to component libraries offering preset size/color variants. Its accessibility features are solid with proper ARIA role and label support, making it suitable for production applications when appropriately implemented with contextual labels and debounced loading states.

**Key Takeaway**: ProgressSpinner prioritizes composition and theming over built-in variants - developers are expected to build loading patterns around the core spinner primitive rather than relying on the component to handle all scenarios out-of-the-box.
