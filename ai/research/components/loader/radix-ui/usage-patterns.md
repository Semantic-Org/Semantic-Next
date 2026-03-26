# Radix UI Themes - Spinner Component Usage Patterns

**Component Type:** Styled Component (Radix Themes)
**Package:** `@radix-ui/themes`
**Category:** Loading Indicators
**Documentation:** https://www.radix-ui.com/themes/docs/components/spinner

---

## 1. Component Overview

The Spinner component is part of **Radix Themes** (NOT Radix Primitives) and displays an animated loading indicator. As a Themes component, it comes pre-styled out of the box, distinguishing it from Radix's unstyled primitive components.

The Spinner is designed to handle loading states elegantly by:
- Preserving child dimensions to prevent layout shift during loading/loaded state transitions
- Automatically disabling interactive elements within children when loading
- Providing an intuitive API that minimizes code branching for common loading scenarios

**Key Distinction:** Unlike Radix Primitives which are unstyled, headless components, the Spinner is a fully styled component that integrates seamlessly with the Radix Themes design system.

---

## 2. Basic Usage

### Installation

```bash
npm install @radix-ui/themes
```

### Setup

```tsx
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

function App() {
  return (
    <Theme>
      <YourApp />
    </Theme>
  );
}
```

### Minimal Example

```tsx
import { Spinner } from '@radix-ui/themes';

function LoadingIndicator() {
  return <Spinner />;
}
```

### With Loading State

```tsx
import { Spinner } from '@radix-ui/themes';

function DataDisplay({ isLoading, data }) {
  return (
    <Spinner loading={isLoading}>
      <div>{data}</div>
    </Spinner>
  );
}
```

The `loading` prop controls whether the spinner or its children are displayed. When `loading` is true, the spinner shows and children are hidden (but their dimensions are preserved).

---

## 3. Props/API

### Complete Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"1" \| "2" \| "3"` | `"2"` (inferred) | Controls the size of the spinner. Three size variants available. |
| `loading` | `boolean` | `undefined` | When `true`, displays the spinner and hides children. When `false` or `undefined`, displays children. |
| `...marginProps` | `MarginProps` | - | Standard Radix Themes margin props (m, mx, my, mt, mr, mb, ml) for spacing control. |
| `...spanProps` | `React.ComponentPropsWithoutRef<'span'>` | - | All standard HTML span element props (className, style, data-*, aria-*, etc.) |

### TypeScript Type Definition

```typescript
type SpinnerElement = React.ElementRef<'span'>;

interface SpinnerProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children' | 'color'>,
    MarginProps {
  size?: "1" | "2" | "3";
  loading?: boolean;
  children?: React.ReactNode;
}
```

**Note:** The Spinner is rendered as a `<span>` element, making it suitable for both inline and block-level contexts.

---

## 4. Variants & Patterns

### Size Variants

The Spinner supports three size variants controlled via the `size` prop:

```tsx
import { Spinner, Flex } from '@radix-ui/themes';

function SpinnerSizes() {
  return (
    <Flex align="center" gap="4">
      <Spinner size="1" /> {/* Small */}
      <Spinner size="2" /> {/* Medium (default) */}
      <Spinner size="3" /> {/* Large */}
    </Flex>
  );
}
```

**Size Guidelines:**
- `size="1"` - Small spinner for inline text or compact UI elements
- `size="2"` - Default size for general purpose loading indicators
- `size="3"` - Large spinner for prominent loading states or full-page loaders

### Loading State Pattern

The most powerful feature is the `loading` prop for conditional rendering:

```tsx
import { Spinner } from '@radix-ui/themes';
import { useState, useEffect } from 'react';

function AsyncContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setIsLoading(false);
    });
  }, []);

  return (
    <Spinner loading={isLoading}>
      <div className="content">
        {data && <DataDisplay data={data} />}
      </div>
    </Spinner>
  );
}
```

**Key Behavior:**
- When `loading={true}`: Spinner is visible, children are hidden (but space is preserved)
- When `loading={false}`: Children are visible, spinner is hidden
- Interactive elements within children are automatically disabled during loading

### Theme-Based Variants

While the Spinner doesn't have explicit color or variant props, it inherits styling from the Radix Themes system:

```tsx
import { Theme, Spinner } from '@radix-ui/themes';

function ThemedSpinner() {
  return (
    <>
      {/* Inherits theme accent color */}
      <Theme accentColor="blue">
        <Spinner />
      </Theme>

      {/* Different theme */}
      <Theme accentColor="crimson">
        <Spinner />
      </Theme>

      {/* With appearance settings */}
      <Theme appearance="dark">
        <Spinner />
      </Theme>
    </>
  );
}
```

**Note:** There's community discussion (GitHub issue #516) about customizing spinner colors and sizes beyond defaults, which may require custom CSS overrides.

---

## 5. Composition Patterns

### With Button (Built-in Integration)

Buttons in Radix Themes have built-in loading support that automatically composes a Spinner:

```tsx
import { Button } from '@radix-ui/themes';

function SubmitButton({ isSubmitting }) {
  return (
    <Button loading={isSubmitting}>
      Submit Form
    </Button>
  );
}
```

### With Icon Button

```tsx
import { IconButton } from '@radix-ui/themes';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

function SendButton({ isSending }) {
  return (
    <IconButton loading={isSending}>
      <PaperPlaneIcon />
    </IconButton>
  );
}
```

### Custom Button Integration

For more sophisticated designs using standalone Spinner:

```tsx
import { Button, Spinner } from '@radix-ui/themes';

function CustomLoadingButton({ isLoading, children, ...props }) {
  return (
    <Button disabled={isLoading} {...props}>
      <Spinner loading={isLoading}>
        {children}
      </Spinner>
    </Button>
  );
}
```

### With Cards/Containers

```tsx
import { Card, Spinner, Heading, Text } from '@radix-ui/themes';

function DataCard({ isLoading, title, content }) {
  return (
    <Card>
      <Spinner loading={isLoading}>
        <Heading size="3">{title}</Heading>
        <Text>{content}</Text>
      </Spinner>
    </Card>
  );
}
```

### Centered Full-Page Loader

```tsx
import { Flex, Spinner } from '@radix-ui/themes';

function FullPageLoader() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <Spinner size="3" />
    </Flex>
  );
}
```

### Inline Loading Text

```tsx
import { Text, Spinner } from '@radix-ui/themes';

function InlineLoader({ isLoading }) {
  return (
    <Text>
      Loading data <Spinner size="1" loading={isLoading} />
    </Text>
  );
}
```

---

## 6. Styling & Theming

### Radix Themes Integration

The Spinner integrates with Radix Themes' design token system:

```tsx
import { Theme, Spinner } from '@radix-ui/themes';

function App() {
  return (
    <Theme
      accentColor="indigo"      // Affects spinner color
      grayColor="slate"          // Affects neutral tones
      radius="full"              // Theme-wide radius setting
      scaling="95%"              // Affects all component sizes
    >
      <Spinner />
    </Theme>
  );
}
```

### Custom CSS Overrides

Since Spinner is a styled component, you can override styles with CSS:

```tsx
import { Spinner } from '@radix-ui/themes';
import './custom-spinner.css';

function CustomStyledSpinner() {
  return (
    <Spinner className="custom-spinner" />
  );
}
```

```css
/* custom-spinner.css */
.custom-spinner {
  /* Override animation speed */
  animation-duration: 1.5s;

  /* Override color (use with caution) */
  color: var(--my-custom-color);

  /* Add margin using standard CSS */
  margin: 1rem;
}
```

### Using Margin Props

Radix Themes provides standardized margin props:

```tsx
import { Spinner } from '@radix-ui/themes';

function SpacedSpinner() {
  return (
    <>
      {/* All margins */}
      <Spinner m="4" />

      {/* Horizontal/Vertical */}
      <Spinner mx="2" my="4" />

      {/* Individual sides */}
      <Spinner mt="2" mr="3" mb="2" ml="3" />
    </>
  );
}
```

### Responsive Theming

```tsx
import { Theme, Spinner } from '@radix-ui/themes';

function ResponsiveSpinner() {
  return (
    <Theme
      accentColor="blue"
      appearance="light"
      // Changes to dark mode automatically
      className="theme-responsive"
    >
      <Spinner />
    </Theme>
  );
}
```

---

## 7. Accessibility

### ARIA Attributes

While Radix Themes components generally follow WAI-ARIA standards, the Spinner component's accessibility implementation should be enhanced for production use:

```tsx
import { Spinner } from '@radix-ui/themes';

function AccessibleSpinner({ isLoading, label = "Loading" }) {
  return (
    <Spinner
      loading={isLoading}
      aria-label={label}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">{label}</span>
    </Spinner>
  );
}
```

### Screen Reader Support

For better screen reader experience, wrap loading states in ARIA live regions:

```tsx
function AccessibleLoadingContent({ isLoading, children }) {
  return (
    <div aria-live="polite" aria-busy={isLoading}>
      <Spinner loading={isLoading}>
        {children}
      </Spinner>
      {isLoading && (
        <span className="visually-hidden">
          Loading content, please wait
        </span>
      )}
    </div>
  );
}
```

### Keyboard Navigation

The Spinner automatically disables interactive elements within its children during loading:

```tsx
function LoadingForm({ isSubmitting }) {
  return (
    <Spinner loading={isSubmitting}>
      <form>
        {/* These inputs are automatically disabled when loading */}
        <input type="text" />
        <button type="submit">Submit</button>
      </form>
    </Spinner>
  );
}
```

### Focus Management

When using Spinner with buttons, the button's disabled state prevents focus:

```tsx
import { Button, Spinner } from '@radix-ui/themes';

function AccessibleButton({ isLoading }) {
  return (
    <Button
      disabled={isLoading}
      aria-busy={isLoading}
    >
      <Spinner loading={isLoading}>
        Save Changes
      </Spinner>
    </Button>
  );
}
```

### Best Practices for Accessibility

1. **Always provide text alternatives** for screen readers
2. **Use `aria-live="polite"`** for non-critical loading states
3. **Use `aria-live="assertive"`** only for urgent updates requiring immediate attention
4. **Include `role="status"`** for loading indicators
5. **Ensure sufficient color contrast** when customizing spinner colors
6. **Provide context** about what is loading (not just "Loading...")

---

## 8. Best Practices

### When to Use Spinner

**Appropriate Use Cases:**
- Data fetching operations (API calls, database queries)
- Form submissions with server-side validation
- File uploads/downloads
- Page transitions or navigation
- Content that takes >300ms to load (avoid flash of loading for quick operations)
- Multi-step processes where each step requires loading

**When NOT to Use:**
- Very fast operations (<200ms) - users won't notice
- Static content that's already loaded
- Decorative purposes - loading indicators should be functional
- In place of proper error handling - combine with error states

### Common Patterns

#### Debounced Loading States

```tsx
import { Spinner } from '@radix-ui/themes';
import { useState, useEffect } from 'react';

function DebouncedLoader({ isLoading, delay = 300, children }) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading) {
      // Only show spinner if loading takes longer than delay
      timer = setTimeout(() => setShowSpinner(true), delay);
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return (
    <Spinner loading={showSpinner}>
      {children}
    </Spinner>
  );
}
```

#### Minimum Display Time

```tsx
function MinimumDisplaySpinner({ isLoading, minDuration = 500, children }) {
  const [display, setDisplay] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (isLoading) {
      setDisplay(true);
      setStartTime(Date.now());
    } else if (startTime) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      setTimeout(() => setDisplay(false), remaining);
    }
  }, [isLoading, minDuration, startTime]);

  return (
    <Spinner loading={display}>
      {children}
    </Spinner>
  );
}
```

#### Error Handling with Spinner

```tsx
import { Spinner, Callout } from '@radix-ui/themes';

function RobustLoader({ isLoading, error, children }) {
  if (error) {
    return (
      <Callout.Root color="red">
        <Callout.Text>{error.message}</Callout.Text>
      </Callout.Root>
    );
  }

  return (
    <Spinner loading={isLoading}>
      {children}
    </Spinner>
  );
}
```

#### Progressive Loading

```tsx
function ProgressiveContent() {
  const [loadingHeader, setLoadingHeader] = useState(true);
  const [loadingBody, setLoadingBody] = useState(true);

  return (
    <div>
      <Spinner loading={loadingHeader}>
        <Header />
      </Spinner>

      <Spinner loading={loadingBody}>
        <Content />
      </Spinner>
    </div>
  );
}
```

### Gotchas and Anti-Patterns

**Avoid:**

1. **Nested Spinners** - Don't wrap one Spinner inside another
   ```tsx
   // DON'T DO THIS
   <Spinner loading={loading1}>
     <Spinner loading={loading2}>
       <Content />
     </Spinner>
   </Spinner>
   ```

2. **Spinner without Children** (when using loading prop)
   ```tsx
   // DON'T DO THIS - loading prop has no effect without children
   <Spinner loading={true} />

   // DO THIS instead
   {isLoading ? <Spinner /> : <Content />}
   // OR
   <Spinner loading={isLoading}><Content /></Spinner>
   ```

3. **Layout Shift Issues** - The Spinner preserves dimensions, but ensure children have defined dimensions
   ```tsx
   // BETTER - Define minimum dimensions
   <Spinner loading={isLoading}>
     <div style={{ minHeight: '200px' }}>
       <Content />
     </div>
   </Spinner>
   ```

4. **Over-using Spinners** - Every loading state doesn't need a spinner
   ```tsx
   // Consider skeleton screens for complex layouts
   // Consider inline loading for small sections
   // Consider optimistic UI updates
   ```

5. **Missing Context** - Tell users what's loading
   ```tsx
   // BETTER
   <div>
     <Text>Loading user profile...</Text>
     <Spinner />
   </div>
   ```

### Performance Considerations

1. **Avoid Flash of Loading Content** - Delay showing spinner for fast operations
2. **Preserve Dimensions** - The Spinner does this automatically, but ensure children have proper sizing
3. **Minimize Re-renders** - Memoize expensive children
   ```tsx
   const MemoizedContent = React.memo(Content);

   <Spinner loading={isLoading}>
     <MemoizedContent />
   </Spinner>
   ```

4. **Use Appropriate Size** - Larger spinners are more resource-intensive

---

## 9. Comparison Notes

### Radix Themes vs Radix Primitives

**Key Difference:** The Spinner is a **Themes component**, not a Primitive:

| Aspect | Radix Themes (Spinner) | Radix Primitives |
|--------|------------------------|------------------|
| **Styling** | Pre-styled, themed | Unstyled, headless |
| **Customization** | Theme tokens + CSS overrides | Full CSS control from scratch |
| **Bundle Size** | Includes styling | Minimal |
| **Use Case** | Quick development, consistent design | Custom design systems |
| **API Surface** | Simpler, opinionated | More flexible, composable |

### Unique Radix Themes Approach

1. **No Loading Primitive in Radix Primitives**: There is no equivalent unstyled loading spinner primitive in Radix Primitives. The Spinner is exclusively a Themes component.

2. **Dimension Preservation**: Unlike many loading implementations, Radix Spinner preserves child dimensions to prevent layout shift—a thoughtful default.

3. **Automatic Integration**: The loading prop pattern integrates seamlessly with Button and IconButton components, reducing boilerplate.

4. **Theme-First Design**: The Spinner inherits colors and styling from the Theme provider rather than having explicit color props.

5. **Minimal API**: Compared to other libraries, the Spinner has a deliberately minimal API surface (just size and loading props).

### Comparison with Other Libraries

**vs Material-UI CircularProgress:**
- Radix: Simpler API, theme-integrated, dimension-preserving
- MUI: More variants (determinate/indeterminate), progress value support, more size options

**vs Chakra UI Spinner:**
- Radix: Loading prop pattern for conditional rendering
- Chakra: Color prop, emptyColor prop, thickness control

**vs Ant Design Spin:**
- Radix: Simpler, lighter weight
- Ant Design: Tip text support, delay prop, custom indicator support

**vs shadcn/ui:**
- Similar approach (styled component)
- shadcn often wraps Radix Primitives, but Spinner is purely Themes
- shadcn provides more customization templates

### When to Choose Radix Themes Spinner

**Choose Radix Themes Spinner when:**
- You're already using Radix Themes
- You want consistent theming across components
- You need dimension-preserving loading states
- You prefer minimal APIs
- You want quick setup without custom styling

**Consider alternatives when:**
- You need determinate progress indicators (use Progress instead)
- You need custom animations beyond what CSS can override
- You're not using any other Radix Themes components (added bundle weight)
- You need very granular control over spinner appearance
- You need built-in text labels or delay props

---

## 10. Additional Resources

### Official Documentation
- Radix Themes Spinner: https://www.radix-ui.com/themes/docs/components/spinner
- Radix Themes 3.0 Announcement: https://www.radix-ui.com/blog/themes-3
- Button with Loading: https://www.radix-ui.com/themes/docs/components/button
- Theme Configuration: https://www.radix-ui.com/themes/docs/theme/overview

### Related Components
- **Progress**: For determinate loading indicators with percentage
- **Button**: Built-in loading prop support
- **IconButton**: Built-in loading prop support
- **Skeleton**: For content placeholders during loading

### Source Code
- GitHub Repository: https://github.com/radix-ui/themes
- Spinner Implementation: https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/spinner.tsx

### Community Resources
- GitHub Issues: https://github.com/radix-ui/themes/issues
- Radix UI Discord Community
- Color Customization Discussion: Issue #516

### TypeScript Support
The package includes comprehensive TypeScript definitions:
```tsx
import type { SpinnerProps } from '@radix-ui/themes';
```

---

## Summary

The Radix Themes Spinner is a well-designed, styled loading indicator component that emphasizes:
- **Layout stability** through dimension preservation
- **Intuitive API** with the loading prop pattern
- **Theme integration** for consistent design
- **Accessibility** following WAI-ARIA standards
- **Simplicity** with a minimal but powerful API

As part of the Radix Themes ecosystem (not Primitives), it's optimized for developers who want pre-styled, production-ready components with sensible defaults while maintaining the flexibility to customize through the theming system and CSS overrides.

The component excels at handling common loading state scenarios with minimal code, making it an excellent choice for rapid application development while maintaining high quality user experience standards.
