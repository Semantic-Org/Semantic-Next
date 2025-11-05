# HeroUI - Spinner Usage Patterns

> Last Modified: 2025-11-04
> Component URL: https://www.heroui.com/docs/components/spinner
> Status: ✅ Working

## Documentation Quality
**Comprehensive** - The documentation provides complete API coverage, multiple code examples for all variants, and clear accessibility guidance.

---

## 1. Component Overview

The **Spinner** component is a loading indicator that expresses an unspecified wait time or displays the length of a process. It serves as a visual feedback mechanism to inform users that content is loading or a process is ongoing. The component is implemented as a server component compatible with Next.js, providing multiple animation styles and extensive customization options through a slot-based architecture.

HeroUI's Spinner distinguishes itself with six distinct animation variants (default, simple, gradient, wave, dots, spinner), comprehensive theming support aligned with design system color tokens, and granular control over styling through seven distinct CSS slots.

---

## 2. Basic Usage

### Import and Minimal Setup

```jsx
import {Spinner} from "@heroui/react";

export default function App() {
  return <Spinner />;
}
```

**Explanation**: The simplest usage renders a medium-sized, primary-colored spinner with default animation. The component automatically includes `aria-label="Loading"` for accessibility.

### With Label

```jsx
import {Spinner} from "@heroui/react";

export default function App() {
  return <Spinner label="Loading..." />;
}
```

**Explanation**: Adding a `label` prop displays text alongside the spinner, providing visual context for users while maintaining screen reader support.

---

## 3. Props/API

### Complete Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Text displayed alongside the spinner animation |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Controls spinner dimensions (small, medium, large) |
| `color` | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"primary"` | Applies design system color token to spinner circles |
| `variant` | `"default" \| "simple" \| "gradient" \| "wave" \| "dots" \| "spinner"` | `"default"` | Chooses animation style and visual presentation |
| `labelColor` | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | Styles label text independently from spinner color |
| `classNames` | `Partial<Record<Slots, string>>` | `undefined` | Applies custom CSS classes to specific component slots |
| `aria-label` | `string` | `"Loading"` | Overrides default accessibility label for screen readers |

### CSS Slots

The `classNames` prop accepts an object with the following keys:

| Slot | Description | Applicable Variants |
|------|-------------|---------------------|
| `base` | Root wrapper containing circles and label | All |
| `wrapper` | Container for animated elements | All |
| `circle1` | First animated circle | default, simple, gradient |
| `circle2` | Second animated circle | default, simple, gradient |
| `dots` | Animated dot elements | wave, dots |
| `spinnerBars` | Animated bar elements | spinner |
| `label` | Text content container | All (when label provided) |

---

## 4. Variants & Patterns

### Size Variants

```jsx
import {Spinner} from "@heroui/react";

export default function App() {
  return (
    <div className="flex gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  );
}
```

**Available Sizes**:
- `sm` - Small spinner for compact UI elements
- `md` - Medium (default) for standard loading states
- `lg` - Large spinner for prominent loading indicators

### Color Variants

```jsx
import {Spinner} from "@heroui/react";

export default function App() {
  return (
    <div className="flex gap-4">
      <Spinner color="default" />
      <Spinner color="primary" />
      <Spinner color="secondary" />
      <Spinner color="success" />
      <Spinner color="warning" />
      <Spinner color="danger" />
    </div>
  );
}
```

**Color Options**:
- `default` - Neutral/default theme color
- `primary` - Primary brand color (default)
- `secondary` - Secondary brand color
- `success` - Success state (green)
- `warning` - Warning state (yellow/orange)
- `danger` - Error/danger state (red)

### Label Support

```jsx
import {Spinner} from "@heroui/react";

export default function App() {
  return (
    <div className="flex gap-4">
      <Spinner label="Loading..." />
      <Spinner color="success" label="Saving changes..." />
      <Spinner color="warning" label="Processing..." />
    </div>
  );
}
```

**Pattern**: Labels provide contextual information about the loading process. They appear alongside the spinner animation.

### Label Color Customization

```jsx
import {Spinner} from "@heroui/react";

export default function App() {
  return (
    <div className="flex gap-4">
      <Spinner color="primary" label="Primary" labelColor="primary" />
      <Spinner color="success" label="Success" labelColor="success" />
      <Spinner color="danger" label="Error" labelColor="danger" />
    </div>
  );
}
```

**Pattern**: The `labelColor` prop allows independent styling of label text, enabling semantic color matching or deliberate contrast with the spinner color.

### Animation Variants

```jsx
import {Spinner} from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      <Spinner
        classNames={{label: "text-foreground mt-4"}}
        label="default"
        variant="default"
      />
      <Spinner
        classNames={{label: "text-foreground mt-4"}}
        label="simple"
        variant="simple"
      />
      <Spinner
        classNames={{label: "text-foreground mt-4"}}
        label="gradient"
        variant="gradient"
      />
      <Spinner
        classNames={{label: "text-foreground mt-4"}}
        label="spinner"
        variant="spinner"
      />
      <Spinner
        classNames={{label: "text-foreground mt-4"}}
        label="wave"
        variant="wave"
      />
      <Spinner
        classNames={{label: "text-foreground mt-4"}}
        label="dots"
        variant="dots"
      />
    </div>
  );
}
```

**Animation Variants**:
- `default` - Standard dual-circle rotating animation
- `simple` - Minimalist single-circle presentation
- `gradient` - Gradient-colored dual circles
- `spinner` - Bar-based rotating animation
- `wave` - Wave-style animated pattern
- `dots` - Dotted animation style

**Usage Guidance**:
- **default/simple/gradient**: Standard loading indicators for general use
- **spinner**: Bar-based animation for alternative visual style
- **wave/dots**: Distinctive animations for visual variety or brand differentiation

### Tailwind-Specific Patterns

The component integrates seamlessly with Tailwind CSS utilities:

```jsx
import {Spinner} from "@heroui/react";

export default function App() {
  return (
    <div className="flex items-center justify-center gap-4 p-8">
      <Spinner
        classNames={{
          base: "w-full",
          wrapper: "w-16 h-16",
          label: "text-sm font-semibold text-gray-700 mt-2"
        }}
        label="Custom styled spinner"
      />
    </div>
  );
}
```

**Pattern**: Tailwind utilities can be applied via the `classNames` prop to any slot for precise control over layout, spacing, typography, and colors.

---

## 5. Composition Patterns

### Loading Overlay Pattern

```jsx
import {Spinner} from "@heroui/react";

export default function LoadingOverlay({ isLoading, children }) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Spinner size="lg" color="primary" label="Loading..." />
        </div>
      )}
    </div>
  );
}
```

**Use Case**: Full-screen or container overlay spinners for blocking UI interactions during async operations.

### Inline Loading States

```jsx
import {Spinner, Button} from "@heroui/react";

export default function SaveButton({ isSaving, onClick }) {
  return (
    <Button onClick={onClick} disabled={isSaving}>
      {isSaving ? (
        <>
          <Spinner size="sm" color="default" />
          <span className="ml-2">Saving...</span>
        </>
      ) : (
        "Save Changes"
      )}
    </Button>
  );
}
```

**Use Case**: Inline spinners within buttons or form controls to indicate action progress without blocking the entire UI.

### Content Loading State

```jsx
import {Spinner} from "@heroui/react";

export default function DataTable({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading data..." />
      </div>
    );
  }

  return <table>{/* render data */}</table>;
}
```

**Use Case**: Placeholder spinner while content loads, typically centered in the expected content area.

---

## 6. Styling & Theming

### Custom Slot Styling

```jsx
import {Spinner} from "@heroui/react";

export default function CustomSpinner() {
  return (
    <Spinner
      size="lg"
      classNames={{
        base: "gap-4",
        wrapper: "w-20 h-20",
        circle1: "border-4",
        circle2: "border-4",
        label: "text-xl font-bold text-primary-600"
      }}
      label="Loading..."
    />
  );
}
```

**Pattern**: The `classNames` prop provides granular control over each visual element through slot-based styling.

### Tailwind Integration

HeroUI Spinner fully embraces Tailwind CSS:

- **Utility Classes**: Apply Tailwind utilities directly via `classNames`
- **Design Tokens**: Color props map to Tailwind theme colors
- **Responsive Design**: Use Tailwind responsive modifiers in `classNames`
- **Dark Mode**: Color tokens automatically adapt to dark mode when configured

**Example**:
```jsx
<Spinner
  color="primary"
  classNames={{
    base: "dark:opacity-80",
    label: "text-sm md:text-base lg:text-lg"
  }}
/>
```

### Theme Customization

HeroUI uses a design token system. Colors can be customized through the theme configuration:

```jsx
// Theme configuration (conceptual)
{
  colors: {
    primary: {...},
    secondary: {...},
    success: {...},
    warning: {...},
    danger: {...}
  }
}
```

The Spinner component respects these theme tokens through its `color` prop.

---

## 7. Accessibility

### ARIA Attributes

**Default Implementation**:
- Automatically includes `aria-label="Loading"` for screen reader support
- Required for accessibility compliance

**Custom Labels**:
```jsx
<Spinner aria-label="Loading user data" />
<Spinner label="Saving..." aria-label="Saving changes to document" />
```

**Pattern**: When using the `label` prop for visual text, provide a more descriptive `aria-label` for screen readers when the visual label is abbreviated.

### Keyboard Support

The Spinner component is non-interactive and does not require keyboard support. It functions purely as a visual and screen reader indicator.

### Screen Reader Support

**Implementation**:
- Default `aria-label="Loading"` ensures screen readers announce loading state
- Custom labels via `label` prop are also announced
- Component uses semantic HTML for proper accessibility tree structure

**Best Practice**:
```jsx
// Good: Descriptive for screen readers
<Spinner label="Loading..." aria-label="Loading user profile data" />

// Avoid: No label (relies only on default "Loading")
<Spinner />  // Only acceptable for generic loading states
```

---

## 8. Best Practices

### When to Use

✅ **Appropriate Use Cases**:
- Async data fetching operations
- Form submission processing
- File upload/download progress
- Page or component initialization
- Background task indication

❌ **Avoid Using For**:
- Deterministic progress (use Progress Bar instead)
- Very short operations (&lt;200ms) - may cause flicker
- Static content that doesn't require loading

### Common Patterns

**1. Conditional Rendering**
```jsx
{isLoading ? <Spinner /> : <Content />}
```

**2. Inline States**
```jsx
<Button disabled={isLoading}>
  {isLoading && <Spinner size="sm" />}
  Submit
</Button>
```

**3. Overlay Pattern**
```jsx
<div className="relative">
  {isLoading && (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
      <Spinner />
    </div>
  )}
  <Content />
</div>
```

### Gotchas and Pitfalls

⚠️ **Common Mistakes**:

1. **No Accessibility Label**: Always ensure proper `aria-label` for screen readers
   ```jsx
   // Bad
   <Spinner />

   // Good
   <Spinner aria-label="Loading data" />
   ```

2. **Overuse**: Don't show spinners for operations &lt;200ms - causes visual flicker
   ```jsx
   // Better: Add delay before showing spinner
   const [showSpinner, setShowSpinner] = useState(false);
   useEffect(() => {
     const timer = setTimeout(() => setShowSpinner(true), 200);
     return () => clearTimeout(timer);
   }, []);
   ```

3. **Wrong Variant for Deterministic Progress**: Use Progress Bar when you know completion percentage
   ```jsx
   // Bad: Using spinner for file upload with known progress
   <Spinner label="Uploading..." />

   // Good: Use progress bar instead
   <Progress value={uploadPercent} />
   ```

4. **Slot Misuse**: Attempting to style slots not applicable to chosen variant
   ```jsx
   // Bad: wave variant doesn't have circle1/circle2
   <Spinner variant="wave" classNames={{circle1: "..."}} />

   // Good: Use correct slots for variant
   <Spinner variant="wave" classNames={{dots: "..."}} />
   ```

### Performance Considerations

- Server component architecture optimizes initial render performance
- CSS animations are GPU-accelerated for smooth performance
- No JavaScript required for animation (pure CSS)
- Minimal re-render impact when used conditionally

---

## 9. Comparison Notes

### Unique Features

**1. Animation Variety**
- HeroUI offers **6 distinct animation variants** (default, simple, gradient, wave, dots, spinner)
- Most frameworks provide 1-2 animation styles
- Enables brand differentiation through animation selection

**2. Slot-Based Architecture**
- **7 customizable CSS slots** for granular styling control
- More flexible than single-class customization common in other frameworks
- Allows precise targeting of internal elements without style conflicts

**3. Independent Label Styling**
- `labelColor` prop allows label to be styled independently from spinner
- Most implementations tie label color to spinner color
- Enables semantic color communication (e.g., red spinner with descriptive neutral text)

**4. Server Component Architecture**
- Implemented as a Next.js server component
- Reduces client-side JavaScript bundle size
- Faster initial page loads compared to client-only implementations

**5. Design System Integration**
- Deep integration with HeroUI's design token system
- Six semantic color options (default, primary, secondary, success, warning, danger)
- Automatic dark mode support through token system

### Comparison to Typical Implementations

| Feature | Typical Loader | HeroUI Spinner |
|---------|----------------|----------------|
| Animation Variants | 1-2 | 6 |
| Size Options | 2-3 | 3 |
| Color Options | 1-3 | 6 (semantic) |
| CSS Slots | 0-2 | 7 |
| Label Support | Basic | Advanced (with independent color) |
| Tailwind Integration | Variable | Native |
| Server Component | Rare | Yes |
| Accessibility | Basic | Comprehensive (default aria-label) |

### Notable Innovations

1. **Variant-Specific Slots**: Different slots active based on variant (circle1/circle2 for default, dots for wave/dots, spinnerBars for spinner)
2. **Semantic Color System**: Colors tied to semantic meaning (success, warning, danger) rather than arbitrary colors
3. **Zero-Config Accessibility**: Automatic `aria-label="Loading"` without developer intervention
4. **Composition-Friendly**: Designed to work seamlessly within Tailwind flex/grid layouts

---

## Research Notes

### Documentation Strengths
- Comprehensive API table with all props, types, and defaults
- Multiple live code examples demonstrating each feature
- Clear accessibility guidance with default behavior documented
- Organized by feature (sizes, colors, variants, labels)

### Documentation Gaps
- No explicit browser support information
- Limited guidance on performance optimization
- No animation customization beyond selecting variants
- Missing best practices for loading state management patterns

### Implementation Observations
- Strong TypeScript support implied by prop type definitions
- React-specific implementation (not framework-agnostic)
- Tailwind CSS is a core dependency (not optional)
- Server component architecture limits use cases to Next.js environments

### Framework Philosophy
HeroUI's Spinner embodies a "batteries-included" approach with extensive built-in variants and semantic color options, contrasting with minimal frameworks that provide basic spinners requiring custom styling. The slot-based architecture reveals an emphasis on customization without prop sprawl, letting developers override specific visual elements while maintaining component cohesion.
