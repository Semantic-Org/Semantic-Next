# Mantine Loader Component - Usage Patterns

**Framework:** Mantine (React component library)
**Component:** Loader (Spinner)
**Documentation:** https://mantine.dev/core/loader/
**Source:** https://github.com/mantinedev/mantine/blob/master/packages/@mantine/core/src/components/Loader/Loader.tsx

---

## 1. Component Overview

The Mantine Loader component is a versatile loading indicator that provides three built-in loader types: oval, bars, and dots. All loaders are animated with CSS for optimal performance, avoiding the CPU overhead and delayed animation startup that can occur with SVG-based animations. The Loader component is designed to work standalone or to be embedded within other Mantine components like Button, ActionIcon, LoadingOverlay, and Dropzone through the `loaderProps` pattern. It supports full theming integration through CSS variables and allows for complete customization including custom CSS or SVG loaders.

---

## 2. Basic Usage

### Minimal Example

```jsx
import { Loader } from '@mantine/core';

function Demo() {
  return <Loader />;
}
```

By default, this renders the "oval" loader with medium size (`md`) and the theme's primary color.

### With Type Variant

```jsx
import { Loader } from '@mantine/core';

function Demo() {
  return (
    <>
      <Loader type="oval" />
      <Loader type="bars" />
      <Loader type="dots" />
    </>
  );
}
```

### With Size and Color

```jsx
import { Loader } from '@mantine/core';

function Demo() {
  return (
    <Loader
      color="blue"
      size="lg"
      type="dots"
    />
  );
}
```

**Explanation:**
- The Loader component renders a visual loading indicator
- By default, it uses the "oval" type, "md" size, and primary theme color
- All three props (`type`, `size`, `color`) are optional and can be customized

---

## 3. Props/API

### Complete Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `MantineSize \| string \| number` | `'md'` | Controls width and height. Predefined values: `xs`, `sm`, `md`, `lg`, `xl`. Numbers are treated as px but converted to rem (e.g., `size={32}` produces `--loader-size: 2rem`). Also accepts any valid CSS value. |
| `color` | `MantineColor` | `theme.primaryColor` | Loader color. Accepts a key from `theme.colors` (e.g., `'blue'`, `'red'`) or any valid CSS color value (e.g., `'#ff0000'`, `'rgb(255, 0, 0)'`). |
| `type` | `MantineLoader` | `'oval'` | Loader variant/type. Must be a key from the `loaders` prop. Default options: `'oval'`, `'bars'`, `'dots'`. Can be extended with custom loaders. |
| `loaders` | `MantineLoadersRecord` | `defaultLoaders` | Object mapping loader names to loader components. Used to add custom loaders or override defaults. Default: `{ bars: Bars, oval: Oval, dots: Dots }` |
| `children` | `React.ReactNode` | `undefined` | When provided, replaces the loader with custom content. Useful for controlling Loader representation in components that accept `loaderProps`. |
| ...others | `BoxProps & SVGProps` | — | Extends `BoxProps` and accepts standard SVG attributes (excluding those already in BoxProps). |

### CSS Variables

The Loader component exposes two CSS custom properties for styling:

| Variable | Purpose | Set By |
|----------|---------|--------|
| `--loader-size` | Controls loader dimensions (width/height) | `size` prop |
| `--loader-color` | Controls loader color | `color` prop |

**Note:** Custom loaders must use these CSS variables to properly respond to `size` and `color` props.

### Styles Names

| Name | Description |
|------|-------------|
| `root` | Root element (span) of the Loader |

---

## 4. Variants & Patterns

### Type/Style Variants

Mantine provides three built-in loader types, all optimized with CSS animations:

#### Oval Loader (Default)
```jsx
<Loader type="oval" />
```
- Circular spinning loader
- Default loader type
- CSS-animated for performance

#### Bars Loader
```jsx
<Loader type="bars" />
```
- Three vertical bars that animate up and down
- Distinctive, playful appearance
- Good for casual or creative interfaces

#### Dots Loader
```jsx
<Loader type="dots" />
```
- Three dots that bounce/pulse
- Minimal, subtle appearance
- Good for inline loading states

### Size Variants

#### Predefined Sizes
```jsx
<Loader size="xs" />
<Loader size="sm" />
<Loader size="md" />  {/* default */}
<Loader size="lg" />
<Loader size="xl" />
```

#### Numeric Sizes (converted to rem)
```jsx
<Loader size={16} />  {/* 1rem */}
<Loader size={32} />  {/* 2rem */}
<Loader size={48} />  {/* 3rem */}
```

#### Custom CSS Sizes
```jsx
<Loader size="3.5rem" />
<Loader size="50px" />
<Loader size="10vw" />
```

**Explanation:**
- Predefined sizes (`xs` through `xl`) follow Mantine's spacing scale
- Numeric values are converted to rem (e.g., `32` → `2rem`)
- String values are passed directly as CSS

### Color Variants

#### Theme Colors
```jsx
<Loader color="blue" />
<Loader color="red" />
<Loader color="green" />
<Loader color="violet" />
<Loader color="pink" />
```

#### Custom CSS Colors
```jsx
<Loader color="#ff6b6b" />
<Loader color="rgb(255, 107, 107)" />
<Loader color="rgba(255, 107, 107, 0.5)" />
<Loader color="var(--my-custom-color)" />
```

### Custom Loaders

#### Custom CSS-Only Loader

**Important:** For `size` and `color` props to work with custom loaders, you must use `--loader-size` and `--loader-color` CSS variables.

```jsx
import { Loader, MantineProvider, createTheme } from '@mantine/core';
import classes from './CssLoader.module.css';

function CssLoader() {
  return <span className={classes.loader} />;
}

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, custom: CssLoader },
        type: 'custom',
      },
    }),
  },
});

function Demo() {
  return (
    <MantineProvider theme={theme}>
      <Loader />  {/* Uses custom loader by default */}
      <Loader type="bars" />  {/* Can still use built-in types */}
    </MantineProvider>
  );
}
```

**CssLoader.module.css:**
```css
.loader {
  width: var(--loader-size);
  height: var(--loader-size);
  border: calc(var(--loader-size) / 10) solid var(--loader-color);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

#### Custom SVG Loader

**Warning:** Mantine documentation cautions that SVG-based animations may have issues including high CPU usage and delayed animation startup. CSS-only loaders are recommended instead.

```jsx
import { Loader, MantineProvider, createTheme } from '@mantine/core';

function SvgLoader() {
  return (
    <svg
      width="var(--loader-size)"
      height="var(--loader-size)"
      viewBox="0 0 45 45"
      xmlns="http://www.w3.org/2000/svg"
      stroke="var(--loader-color)"
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle cx="22" cy="22" r="6" strokeOpacity="0">
            <animate
              attributeName="r"
              begin="1.5s"
              dur="3s"
              values="6;22"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              begin="1.5s"
              dur="3s"
              values="1;0"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
    </svg>
  );
}

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, custom: SvgLoader },
      },
    }),
  },
});

function Demo() {
  return (
    <MantineProvider theme={theme}>
      <Loader type="custom" />
    </MantineProvider>
  );
}
```

---

## 5. Composition Patterns

The Loader component is designed to integrate seamlessly with other Mantine components through the `loaderProps` pattern.

### With Button Component

```jsx
import { Button, Group, Switch } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const [loading, { toggle }] = useDisclosure();

  return (
    <>
      <Group>
        <Button loading={loading}>
          Filled button
        </Button>

        <Button variant="light" loading={loading}>
          Light button
        </Button>

        <Button variant="outline" loading={loading}>
          Outline button
        </Button>
      </Group>

      <Switch
        checked={loading}
        onChange={toggle}
        label="Loading state"
        mt="md"
      />
    </>
  );
}
```

**Explanation:**
- When `loading` prop is set, Button is disabled and displays a Loader with overlay
- Loader color automatically adapts to button variant
- Button children remain visible but are overlaid with the loader

### Customizing Button Loader

```jsx
import { Button } from '@mantine/core';

function Demo() {
  return (
    <>
      <Button loading loaderProps={{ type: 'dots' }}>
        Loading with dots
      </Button>

      <Button
        loading
        loaderProps={{
          type: 'bars',
          color: 'pink',
          size: 'sm'
        }}
      >
        Custom loader
      </Button>
    </>
  );
}
```

**Explanation:**
- `loaderProps` accepts all Loader component props
- Allows customization of loader appearance within Button
- Overrides default loader behavior

### With LoadingOverlay Component

```jsx
import { LoadingOverlay, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function Demo() {
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <>
      <div style={{ position: 'relative', height: 200 }}>
        <LoadingOverlay
          visible={visible}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
        <p>Content that will be covered by overlay</p>
      </div>

      <Button onClick={toggle}>Toggle overlay</Button>
    </>
  );
}
```

**Explanation:**
- LoadingOverlay displays a Loader component with a semi-transparent backdrop
- `loaderProps` customizes the loader appearance
- Parent element must have `position: relative`

### Custom Content in LoadingOverlay

```jsx
import { LoadingOverlay } from '@mantine/core';

function Demo() {
  return (
    <div style={{ position: 'relative', height: 200 }}>
      <LoadingOverlay
        visible={true}
        loaderProps={{
          children: (
            <div style={{ textAlign: 'center' }}>
              <Loader type="dots" />
              <div style={{ marginTop: 10 }}>Loading...</div>
            </div>
          )
        }}
      />
      <p>Content being loaded</p>
    </div>
  );
}
```

**Explanation:**
- `loaderProps.children` allows complete control over overlay content
- Can combine loader with text, progress bars, or other elements
- Any React node can be used as children

### With Children Prop

The `children` prop provides a way to replace the loader entirely with custom content:

```jsx
import { Loader } from '@mantine/core';

function Demo() {
  return (
    <>
      {/* Standard loader */}
      <Loader />

      {/* Replace with text */}
      <Loader children="Loading..." />

      {/* Replace with custom component */}
      <Loader>
        <div style={{ color: 'blue' }}>
          <span>⏳</span> Processing...
        </div>
      </Loader>
    </>
  );
}
```

**Explanation:**
- When `children` is provided, the loader graphic is completely replaced
- Useful in components that accept `loaderProps` to provide custom loading indicators
- The Loader component becomes a wrapper for custom content

---

## 6. Styling & Theming

### Mantine Theme Integration

#### Default Props via Theme

```jsx
import { MantineProvider, createTheme, Loader } from '@mantine/core';

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        type: 'dots',
        color: 'violet',
      },
    }),
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <Loader />  {/* Uses dots type and violet color by default */}
    </MantineProvider>
  );
}
```

#### Custom Default Loaders

```jsx
import { MantineProvider, createTheme, Loader } from '@mantine/core';
import { MyCustomLoader } from './MyCustomLoader';

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: {
          ...Loader.defaultLoaders,  // Keep oval, bars, dots
          custom: MyCustomLoader,    // Add custom loader
        },
        type: 'custom',  // Use custom by default
      },
    }),
  },
});
```

### CSS Variables Customization

#### Using CSS Variables Resolver

```jsx
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  components: {
    Loader: {
      vars: (theme, props) => {
        if (props.size === 'xl') {
          return {
            root: {
              '--loader-size': '5rem',
            },
          };
        }
        return { root: {} };
      },
    },
  },
});
```

#### Direct CSS Overrides

```css
/* Global styles */
[data-mantine-component="Loader"] {
  --loader-size: 3rem;
  --loader-color: var(--mantine-color-blue-6);
}

/* Target specific types */
[data-type="dots"] {
  --loader-size: 2rem;
}
```

### Styles API

Mantine's Styles API allows targeting the Loader's root element:

```jsx
import { Loader } from '@mantine/core';

function Demo() {
  return (
    <Loader
      styles={{
        root: {
          opacity: 0.5,
          transform: 'scale(1.5)',
        },
      }}
    />
  );
}
```

### CSS Modules

```jsx
import { Loader } from '@mantine/core';
import classes from './Demo.module.css';

function Demo() {
  return (
    <Loader
      classNames={{ root: classes.loader }}
    />
  );
}
```

**Demo.module.css:**
```css
.loader {
  filter: drop-shadow(0 0 10px var(--loader-color));
}
```

---

## 7. Accessibility

### Accessibility Approach

**Important:** The Mantine Loader component itself is primarily a visual indicator. Mantine follows WAI-ARIA guidelines across its component library, but loading accessibility should be implemented at the container/parent level rather than on the Loader component itself.

### Accessibility Best Practices

#### 1. Use ARIA Live Regions

```jsx
import { Loader } from '@mantine/core';

function Demo() {
  const [loading, setLoading] = useState(false);

  return (
    <div aria-live="polite" aria-busy={loading}>
      {loading && <Loader />}
      {!loading && <div>Content loaded</div>}
    </div>
  );
}
```

**Explanation:**
- `aria-live="polite"` announces changes to screen readers
- `aria-busy={true}` indicates content is being modified
- When `aria-busy` is false, screen readers know content is stable

#### 2. Loading Announcements

```jsx
import { Loader, VisuallyHidden } from '@mantine/core';

function Demo() {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      {loading && (
        <>
          <Loader />
          <VisuallyHidden>
            <div role="status" aria-live="polite">
              Loading content, please wait
            </div>
          </VisuallyHidden>
        </>
      )}
    </div>
  );
}
```

**Explanation:**
- Visually hidden text provides screen reader announcement
- `role="status"` indicates this is a status message
- `aria-live="polite"` ensures announcement without interrupting

#### 3. LoadingOverlay with Accessibility

```jsx
import { LoadingOverlay } from '@mantine/core';

function Demo() {
  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{ position: 'relative' }}
      aria-busy={loading}
      aria-live="polite"
    >
      <LoadingOverlay
        visible={loading}
        loaderProps={{
          'aria-label': 'Loading content',
        }}
      />
      <div>Your content here</div>
    </div>
  );
}
```

### Important Accessibility Notes

1. **Do NOT use `aria-busy` on the Loader itself**: `aria-busy` hides elements from screen reader updates and is meant for containers that are being modified, not for loading indicators.

2. **Use `role="status"`**: For loading announcements, use `role="status"` with `aria-live="polite"` on a visually hidden element.

3. **Provide context**: When possible, provide text context about what is loading (e.g., "Loading user profile" vs just "Loading").

4. **Button loading states**: When using Loader in Button, the button automatically becomes disabled and aria-disabled is handled by the Button component.

### Testing Recommendations

Mantine components are tested with:
- **axe** (jest-axe) for ARIA attributes and roles
- **Unit tests** for keyboard support and focus management
- **Screen readers** (VoiceOver) for manual verification

When implementing custom loaders or loading states:
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify keyboard navigation works correctly
- Ensure loading states are announced appropriately
- Test that focus management is correct (e.g., disabled buttons can't receive focus)

---

## 8. Best Practices

### When to Use Which Loader Type

#### Oval (Default)
- **Use for:** General-purpose loading states
- **Best for:** Traditional, familiar loading indicator
- **Context:** Form submissions, page loads, API calls

#### Bars
- **Use for:** Playful or creative interfaces
- **Best for:** Casual applications, dashboards
- **Context:** Data refreshing, background processes

#### Dots
- **Use for:** Inline loading states, subtle indicators
- **Best for:** Minimal designs, inline text loading
- **Context:** Auto-saving, incremental loading, polling

### Common Patterns

#### 1. Inline Loading
```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <Loader size="xs" type="dots" />
  <span>Saving...</span>
</div>
```

#### 2. Full-Page Loading
```jsx
<div style={{
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.5)'
}}>
  <Loader size="xl" />
</div>
```

#### 3. Conditional Rendering
```jsx
function Demo() {
  const { data, loading } = useQuery();

  return (
    <div style={{ position: 'relative', minHeight: 200 }}>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 40
        }}>
          <Loader />
        </div>
      ) : (
        <DataDisplay data={data} />
      )}
    </div>
  );
}
```

#### 4. Overlay Pattern
```jsx
function Demo() {
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      <YourContent />
    </div>
  );
}
```

### Gotchas & Common Mistakes

#### ❌ Don't: Use SVG animations unnecessarily
```jsx
// Avoid - may cause CPU issues and delayed startup
<Loader type="customSvgLoader" />
```

#### ✅ Do: Use CSS animations
```jsx
// Prefer - better performance
<Loader type="dots" />  // CSS-animated
```

---

#### ❌ Don't: Forget CSS variables in custom loaders
```css
/* Won't respond to size/color props */
.customLoader {
  width: 40px;
  height: 40px;
  border-color: blue;
}
```

#### ✅ Do: Use CSS variables
```css
/* Responds to size/color props */
.customLoader {
  width: var(--loader-size);
  height: var(--loader-size);
  border-color: var(--loader-color);
}
```

---

#### ❌ Don't: Put aria-busy on Loader
```jsx
<Loader aria-busy="true" />  // Wrong - hides from screen readers
```

#### ✅ Do: Put aria-busy on container
```jsx
<div aria-busy={loading}>
  {loading && <Loader />}
  {content}
</div>
```

---

#### ❌ Don't: Forget position: relative for overlays
```jsx
<div>
  <LoadingOverlay visible={true} />  {/* Won't position correctly */}
</div>
```

#### ✅ Do: Set position: relative on parent
```jsx
<div style={{ position: 'relative' }}>
  <LoadingOverlay visible={true} />
</div>
```

---

### Performance Considerations

1. **CSS over SVG**: All default loaders use CSS animations for better performance
2. **Avoid re-renders**: When using in conditional rendering, consider using `visible` props in overlay patterns
3. **Size optimization**: Use predefined sizes when possible for better theme integration
4. **Memoization**: Consider memoizing loader configurations in complex applications

### Testing Recommendations

```jsx
import { render, screen } from '@testing-library/react';
import { Loader } from '@mantine/core';

test('renders loader with correct type', () => {
  render(<Loader type="dots" data-testid="loader" />);
  const loader = screen.getByTestId('loader');
  expect(loader).toBeInTheDocument();
});

test('loader is hidden when children provided', () => {
  render(<Loader>Loading text</Loader>);
  expect(screen.getByText('Loading text')).toBeInTheDocument();
});
```

---

## 9. Comparison Notes

### Unique Mantine Features

1. **Multiple Built-in Types**: Unlike many libraries that provide a single loader, Mantine includes three distinct types (oval, bars, dots) out of the box.

2. **Children Override Pattern**: The `children` prop allows complete replacement of the loader, making it flexible for use in components that accept `loaderProps`.

3. **CSS-First Philosophy**: Explicit recommendation against SVG animations due to performance concerns - all defaults use CSS.

4. **Theme Integration**: Deep integration with Mantine's theming system through:
   - Default props via theme
   - CSS variables (`--loader-size`, `--loader-color`)
   - Styles API
   - Component extension pattern

5. **loaderProps Pattern**: Consistent pattern across components (Button, LoadingOverlay, ActionIcon, etc.) for accepting Loader customization through a dedicated prop.

6. **Size Flexibility**: Accepts predefined sizes, numbers (converted to rem), or any CSS value - more flexible than libraries with fixed sizes only.

7. **Extending via Theme**: Ability to add custom loaders globally through theme configuration and set them as defaults.

### Key Architectural Decisions

1. **CSS Variables for Customization**: Uses `--loader-size` and `--loader-color` instead of passing props through context or other React patterns.

2. **Factory Pattern**: Uses a factory pattern (`LoaderFactory`) for component definition with explicit types for props, ref, styles, and vars.

3. **Box Component Extension**: Built on top of Mantine's `Box` component, inheriting all box props and SVG attributes.

4. **Performance-First**: Explicit performance considerations documented (CSS over SVG, animation startup delays).

5. **Composition over Configuration**: The `children` and `loaders` props enable composition patterns rather than extensive configuration APIs.

### Notable Implementation Details

- **Ref forwarding**: Forwards refs to `HTMLSpanElement`
- **Type safety**: Comprehensive TypeScript definitions with factory pattern
- **Extensibility**: `loaders` prop and theme extension allow adding unlimited custom loaders
- **Consistency**: Same API surface across all usage contexts (standalone, in buttons, in overlays)
- **Accessibility delegation**: Loader is visual-only; accessibility handled at usage level

---

## Summary

The Mantine Loader component is a well-designed, performance-focused loading indicator with exceptional flexibility. Its standout features include:

- **Three CSS-animated loader types** (oval, bars, dots) with excellent performance
- **Highly flexible sizing** (predefined, numeric, or custom CSS values)
- **Deep theme integration** with CSS variables and default props
- **Composition patterns** through children prop and loaderProps pattern
- **Extensibility** via custom loaders added through theme
- **Performance-first architecture** preferring CSS over SVG animations
- **Consistent API** across all usage contexts (standalone, buttons, overlays)

The component's design philosophy emphasizes performance, flexibility, and composition, making it suitable for a wide range of use cases from inline loading states to full-page overlays. Its integration with the broader Mantine ecosystem through the `loaderProps` pattern provides a consistent developer experience across components.

**Key Takeaway**: Mantine's Loader is not just a spinner - it's a flexible loading indicator system with built-in variants, complete theme integration, and a thoughtful composition API that makes it easy to customize without sacrificing performance or consistency.
