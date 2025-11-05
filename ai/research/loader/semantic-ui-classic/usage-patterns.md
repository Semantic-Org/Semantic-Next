# Semantic UI Classic - Loader Usage Patterns

> Last Modified: 2025-11-04

## Component URL
https://semantic-ui.com/elements/loader.html
Status: ✅ Working
Version: Classic (jQuery-based)
Last Verified: 2025-11-04

## Documentation Quality
Good - The documentation provides coverage of loader patterns with visual examples. Enhanced features available in Fomantic UI (the maintained fork).

## Component Overview

The Loader is a visual feedback element that alerts users to wait for an activity to complete. It provides animated indicators for asynchronous operations, background tasks, and loading states. Loaders are hidden by default and only become visible when marked as `active` or placed within an `active dimmer` module. This component is essential for communicating system status and preventing user uncertainty during wait periods.

## Basic Usage

### Standard Loader with Dimmer
```html
<div class="ui segment">
  <div class="ui active dimmer">
    <div class="ui loader"></div>
  </div>
  <p></p> <!-- Content that gets dimmed -->
</div>
```

The most common pattern combines a loader with a dimmer to overlay content. The `active` class on the dimmer makes both the overlay and loader visible.

### Text Loader
```html
<div class="ui segment">
  <div class="ui active dimmer">
    <div class="ui text loader">Loading</div>
  </div>
  <p></p>
</div>
```

Text loaders display descriptive messages alongside the spinner animation, providing context about what's loading.

### Inline Loader
```html
<div class="ui active inline loader"></div>
```

Inline loaders appear within content flow without overlaying or dimming other elements. They use relative positioning and inline-block display.

## API/Classes

### Base Classes
| Class | Purpose |
|-------|---------|
| `ui loader` | Core loader component with spinning animation |
| `ui active loader` | Makes loader visible and animated |
| `ui dimmer` | Overlay container that dims background content |
| `ui segment` | Content wrapper for loader demos |

### Type Modifiers
| Class | Purpose |
|-------|---------|
| `text` | Text-based loader with auto width/height and descriptive text |
| `inline` | Inline-block loader without absolute positioning |
| `indeterminate` | Animation for unknown-duration tasks |

### State Classes
| Class | Purpose |
|-------|---------|
| `active` | Display: block, shows loader animation |
| `visible` | Display: block, shows loader animation |
| `disabled` | Display: none, hides loader |
| `hidden` | Display: none, hides loader |

### Style Modifiers
| Class | Purpose |
|-------|---------|
| `inverted` | Inverted color scheme for dark backgrounds |
| `centered` | Centers inline loader (combined with `inline`) |

## Variants & Patterns

### Size Variants
| Size | Class | Typical Use Case |
|------|-------|------------------|
| Mini | `mini` | Smallest variant for tiny UI elements |
| Tiny | `tiny` | Extra small, compact interfaces |
| Small | `small` | Below-average dimensions for secondary actions |
| Medium | (default) | Standard size for most use cases |
| Large | `large` | Emphasized loading states |
| Big | `big` | Extra large for prominent operations |
| Huge | `huge` | Very large for full-screen loaders |
| Massive | `massive` | Maximum size for dramatic effect |

#### Size Examples
```html
<!-- Mini loader with text -->
<div class="ui segment">
  <div class="ui active dimmer">
    <div class="ui mini text loader">Loading</div>
  </div>
  <p></p>
</div>

<!-- Large loader without text -->
<div class="ui segment">
  <div class="ui active dimmer">
    <div class="ui large loader"></div>
  </div>
  <p></p>
</div>

<!-- Massive loader for dramatic loading -->
<div class="ui segment">
  <div class="ui active dimmer">
    <div class="ui massive text loader">Loading</div>
  </div>
  <p></p>
</div>
```

### States

#### Active State
Makes the loader visible and animated. Loaders are hidden by default unless active or within an active dimmer.

```html
<!-- Active inline loader -->
<div class="ui active inline loader"></div>
```

#### Disabled/Hidden State
Hides the loader from view. Default state for loaders.

```html
<div class="ui disabled loader"></div>
<div class="ui hidden loader"></div>
```

#### Indeterminate State
Shows uncertainty about task duration with alternative animation pattern.

```html
<div class="ui segment">
  <div class="ui active dimmer">
    <div class="ui indeterminate text loader">Preparing Files</div>
  </div>
  <p></p>
</div>
```

### Types

#### Standard Loader
Basic spinner animation without text, centered within its container.

```html
<div class="ui active dimmer">
  <div class="ui loader"></div>
</div>
```

#### Text Loader
Spinner with descriptive text below. Auto-sizes to content.

```html
<div class="ui active dimmer">
  <div class="ui text loader">Loading</div>
</div>
```

#### Inline Loader
Flows with content, doesn't overlay. Useful for inline loading indicators.

```html
<p>Please wait <div class="ui active inline loader"></div> while we fetch your data</p>
```

#### Inline Centered Loader
Centered inline loader with auto margins.

```html
<div class="ui active inline centered loader"></div>
```

### Speed Variants (Fomantic UI Extension)

Fomantic UI (maintained fork) adds speed control:

| Speed | Class | Description |
|-------|-------|-------------|
| Slow | `slow` | Slower rotation for less urgent operations |
| Normal | (default) | Standard animation speed |
| Fast | `fast` | Faster rotation for quick operations |

```html
<!-- Slow loader -->
<div class="ui active slow loader"></div>

<!-- Fast loader -->
<div class="ui active fast loader"></div>
```

### Animation Style Variants (Fomantic UI Extension)

| Style | Class | Description |
|-------|-------|-------------|
| Standard | (default) | Classic circular spinner |
| Elastic | `elastic` | Elastic stretching animation |
| Double | `double` | Double-ring animation |

```html
<!-- Elastic animation -->
<div class="ui active elastic loader"></div>

<!-- Double animation -->
<div class="ui active double loader"></div>
```

### Color Variants (Fomantic UI Extension)

Fomantic UI supports color variations through standard color classes:

```html
<!-- Red loader -->
<div class="ui active red loader"></div>

<!-- Blue text loader -->
<div class="ui active inverted dimmer">
  <div class="ui blue text loader">Loading</div>
</div>

<!-- Combined: slow, orange, medium, elastic -->
<div class="ui active slow orange medium elastic loader"></div>
```

Standard Semantic UI color palette applies: red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, grey, black.

### Inverted Mode

Inverted loaders automatically adjust colors for dark backgrounds. Loaders within inverted dimmers automatically invert.

```html
<!-- Inverted dimmer (loader auto-inverts) -->
<div class="ui inverted segment">
  <div class="ui active inverted dimmer">
    <div class="ui text loader">Loading</div>
  </div>
  <p></p>
</div>

<!-- Explicit inverted loader -->
<div class="ui inverted loader"></div>
```

### Inline vs Overlay Modes

#### Overlay Mode (Default)
Uses absolute positioning with active dimmer to overlay content:
- Dims background content
- Centers loader in container
- Prevents interaction with dimmed content

```html
<div class="ui segment">
  <div class="ui active dimmer">
    <div class="ui loader"></div>
  </div>
  <p>This content gets dimmed</p>
</div>
```

#### Inline Mode
Uses relative positioning to flow with content:
- No background dimming
- Flows with text/content
- Doesn't prevent interaction

```html
<p>Loading data <div class="ui active inline loader"></div> please wait...</p>
```

## Composition Patterns

### With Dimmers

The most common pattern combines loaders with dimmers for full overlay:

```html
<!-- Basic dimmer + loader -->
<div class="ui segment">
  <div class="ui active dimmer">
    <div class="ui loader"></div>
  </div>
  <p>Content</p>
</div>

<!-- Inverted dimmer for dark backgrounds -->
<div class="ui inverted segment">
  <div class="ui active inverted dimmer">
    <div class="ui text loader">Loading</div>
  </div>
  <p>Content</p>
</div>
```

### With Segments

Segments provide containers for demonstrating loaders:

```html
<!-- Multiple sized loaders in grid -->
<div class="ui four column stackable doubling grid">
  <div class="column">
    <div class="ui segment">
      <div class="ui active dimmer">
        <div class="ui mini loader"></div>
      </div>
      <p></p>
    </div>
  </div>
  <div class="column">
    <div class="ui segment">
      <div class="ui active dimmer">
        <div class="ui small loader"></div>
      </div>
      <p></p>
    </div>
  </div>
  <div class="column">
    <div class="ui segment">
      <div class="ui active dimmer">
        <div class="ui loader"></div>
      </div>
      <p></p>
    </div>
  </div>
  <div class="column">
    <div class="ui segment">
      <div class="ui active dimmer">
        <div class="ui large loader"></div>
      </div>
      <p></p>
    </div>
  </div>
</div>
```

### With Containers

Any container can hold a loader with dimmer:

```html
<div class="ui container">
  <div class="ui segment">
    <div class="ui active dimmer">
      <div class="ui text loader">Loading Content</div>
    </div>
    <img src="image.jpg" class="ui image">
  </div>
</div>
```

### Programmatic Dimmer Control (jQuery API)

```javascript
// Show dimmer with loader
$('.image').dimmer({
  displayLoader: true,
  loaderVariation: 'slow orange medium elastic',
  loaderText: 'Wait a second, please...'
}).dimmer('show');

// Hide dimmer
$('.image').dimmer('hide');
```

## Styling & Theming

### Class Modifiers

Loaders use composable CSS classes following consistent naming:
- Base: `ui loader`
- Size: `ui mini loader`, `ui large loader`
- Type: `ui text loader`, `ui inline loader`
- State: `ui active loader`, `ui disabled loader`
- Style: `ui inverted loader`
- Combined: `ui large text loader`, `ui active inline centered loader`

### LESS Variables (Theming)

Loaders support customization via LESS variables:
- `@mini`, `@tiny`, `@small`, `@medium`, `@large`, `@big`, `@huge`, `@massive` - Size definitions
- `@loaderLineWidth` - Spinner border width
- `@shapeBorderColor` - Spinner color
- Animation timing and speed variables

### CSS Architecture

- **Absolute positioning**: Default loaders use absolute positioning with transform centering
- **Inline-block**: Inline loaders use relative positioning
- **Display control**: State classes toggle between `display: block` and `display: none`
- **Z-index layering**: Loaders appear above dimmed content

### Theming Options (Fomantic UI)

Three built-in themes:
- **Default**: Standard circular spinner
- **Duo**: Alternative dual-element animation
- **Pulsar**: Pulsing animation style

## Accessibility

### Screen Reader Support

Loaders should include ARIA attributes for assistive technologies:

```html
<!-- With role and aria-label -->
<div class="ui active dimmer">
  <div class="ui loader" role="status" aria-label="Loading content"></div>
</div>

<!-- Text loaders provide context automatically -->
<div class="ui active dimmer">
  <div class="ui text loader" role="status">Loading</div>
</div>
```

### Best Practices

1. **Use `role="status"`** for loaders that indicate ongoing processes
2. **Use `role="progressbar"`** if showing determinable progress (not typical for spinners)
3. **Provide `aria-label`** when loader has no visible text
4. **Use `aria-live="polite"`** for dynamic loader text updates
5. **Prefer native HTML** when possible (`<progress>` for determinate progress)
6. **Text loaders are more accessible** as they provide visible context

### Accessibility Considerations

```html
<!-- Good: Text loader provides context -->
<div class="ui text loader" role="status">Loading user data</div>

<!-- Better: Explicit aria-label for icon-only -->
<div class="ui loader" role="status" aria-label="Loading user data"></div>

<!-- Best: Live region for dynamic updates -->
<div class="ui text loader" role="status" aria-live="polite">
  Loading... <span id="progress"></span>
</div>
```

## Best Practices

### When to Use Each Type

| Type | Use When | Example Scenarios |
|------|----------|-------------------|
| Standard Loader + Dimmer | Blocking full content area during load | Form submission, page-level data fetch |
| Text Loader + Dimmer | Need to explain what's loading | "Uploading files", "Processing payment" |
| Inline Loader | Non-blocking, in-content loading | Loading more items, refreshing section |
| Inline Centered Loader | Centered within block without overlay | Loading widget content |
| Indeterminate Loader | Unknown duration operations | "Preparing files", "Analyzing data" |

### Size Selection Guidelines

- **Mini/Tiny**: Buttons, badges, small UI elements
- **Small**: Form fields, list items, cards
- **Medium (default)**: Standard content areas, modals
- **Large/Big**: Full sections, important operations
- **Huge/Massive**: Full-page loaders, splash screens

### Performance Considerations

1. **Hide by default**: Loaders are hidden unless active, preventing unnecessary animations
2. **CSS animations**: Uses CSS transforms and animations (GPU-accelerated)
3. **No JavaScript required**: Pure CSS animations, jQuery only for programmatic control
4. **Minimal DOM**: Simple markup structure minimizes overhead

### UX Guidelines

1. **Always provide feedback**: Show loader for operations > 300ms
2. **Use text for clarity**: Add descriptive text for operations > 2 seconds
3. **Match loader size to context**: Don't use massive loaders for minor operations
4. **Consider indeterminate**: Use for unpredictable duration tasks
5. **Dim background for focus**: Use dimmers for important blocking operations
6. **Keep inline for context**: Use inline loaders to preserve spatial relationships

### Code Organization

```html
<!-- Structure: segment → dimmer → loader -->
<div class="ui segment">           <!-- Container -->
  <div class="ui active dimmer">   <!-- Overlay layer -->
    <div class="ui text loader">   <!-- Loader element -->
      Loading
    </div>
  </div>
  <p>Content that gets dimmed</p>  <!-- Background content -->
</div>
```

### Common Patterns

#### Form Submission
```html
<form class="ui form segment">
  <div class="ui dimmer" id="formLoader">
    <div class="ui text loader">Saving changes...</div>
  </div>
  <!-- form fields -->
  <button class="ui button" type="submit">Submit</button>
</form>

<script>
$('form').on('submit', function(e) {
  e.preventDefault();
  $('#formLoader').addClass('active');
  // AJAX submission
});
</script>
```

#### Lazy Loading Content
```html
<div class="ui segment">
  <div id="content">
    <p>Initial content</p>
    <div class="ui active inline centered loader"></div>
  </div>
</div>
```

#### Card Loading State
```html
<div class="ui card">
  <div class="content">
    <div class="ui active dimmer">
      <div class="ui mini loader"></div>
    </div>
    <div class="header">Loading...</div>
  </div>
</div>
```

## Historical Context

### Framework Evolution

- **Semantic UI Classic**: Original jQuery-based implementation (2013-2018)
- **Fomantic UI**: Community-maintained fork (2018-present) with enhancements
- **Semantic UI React**: React port with different API patterns

### Key Milestones

- Loader has been part of Semantic UI since early versions as a core element
- Version 2.0+ refinements to inline loader positioning
- Fomantic UI 2.7.0+ added elastic and double animation styles
- Speed variants (slow/fast) added in Fomantic UI fork

### Design Philosophy

The Loader follows Semantic UI's core principles:
1. **Human-readable classes**: `text loader`, `inline centered`, `indeterminate`
2. **Composability**: Combine size, type, state, and style classes
3. **Progressive enhancement**: Works without JavaScript, enhanced with jQuery
4. **Visual consistency**: Matches framework's design language

## Comparison Notes

### What Makes Semantic UI's Approach Unique

1. **Dimmer Integration**: Deep integration with dimmer module for overlay patterns
2. **Text-first**: Text loaders are first-class citizens, not afterthoughts
3. **Inline Flexibility**: Strong support for inline, non-blocking loaders
4. **Class Composition**: Highly composable class-based API
5. **No JavaScript Required**: Pure CSS animations, jQuery optional
6. **Semantic Naming**: Human-readable class names (`indeterminate` vs abstract patterns)

### Compared to Modern Frameworks

| Feature | Semantic UI Classic | Modern Component Libraries |
|---------|-------------------|---------------------------|
| API Style | Class-based | Prop-based (React/Vue) |
| Animation | CSS-only | CSS or JS-driven |
| Dependencies | jQuery (optional) | Framework-specific |
| Theming | LESS variables | CSS-in-JS or design tokens |
| Accessibility | Manual ARIA | Often built-in |
| Bundle Size | Full framework | Tree-shakeable components |

### Advantages

- **Universal compatibility**: Works in any environment
- **No build step**: Direct HTML/CSS usage
- **Proven patterns**: Battle-tested over years
- **Complete ecosystem**: Integrates with other Semantic UI components
- **Extensive documentation**: Comprehensive examples and patterns

### Considerations for Web Component Translation

1. **State management**: Active/disabled states map well to component properties
2. **Composition**: Dimmer integration could be built-in or separate component
3. **Theming**: CSS custom properties replace LESS variables
4. **Animation**: CSS animations remain, no JavaScript required
5. **Accessibility**: ARIA attributes should be built-in by default
6. **API design**: Props-based API vs class-based modifiers
7. **Size variants**: Could be enum prop or maintain class-based approach
8. **Text content**: Slot for flexible content vs text prop
9. **Inline mode**: Property toggle vs separate component
10. **Speed/style variants**: Enum props for type-safe configuration

### Key Patterns to Preserve

- Hidden by default, explicit activation
- Text loader as distinct pattern
- Inline vs overlay modes
- Size system (8 sizes)
- Inverted mode for dark backgrounds
- Indeterminate state for unknown duration
- Composability of variations

### Patterns to Modernize

- Built-in ARIA support (role, aria-label)
- Shadow DOM encapsulation
- Reactive state management
- Type-safe props
- Slot-based content projection
- CSS custom property theming
- Optional dimmer integration
- Event-driven state changes
- Programmatic control via methods

## Research Notes

- **Framework approach**: Class-based utility system from 2013-era design patterns. Semantic UI uses compositional approach through class combinations.
- **jQuery dependency**: Classic version uses jQuery for dimmer integration and programmatic control, but core animations are pure CSS.
- **CSS-first design**: Animations use CSS transforms and keyframes (GPU-accelerated), not JavaScript timers.
- **Dimmer coupling**: Loader is tightly integrated with Dimmer module for overlay patterns, but can work standalone inline.
- **Fomantic enhancements**: Community fork adds elastic/double animations, speed variants, and color options not in original.
- **Theming system**: Uses LESS variables for customization via `site.variables` file.
- **Accessibility gaps**: Original implementation lacks built-in ARIA attributes, requiring manual addition.
- **State model**: Simple active/disabled binary states, no complex loading progress tracking.
- **Historical significance**: One of the pioneering frameworks for semantic, human-readable CSS class names.
- **Modern relevance**: Class patterns remain influential, though modern frameworks prefer component props.
- **Animation quality**: Smooth, GPU-accelerated animations that work across browsers.
- **Inline positioning**: Careful consideration of inline loader positioning with centered variant.
- **Size system**: Comprehensive 8-size system provides fine-grained control.
- **Text integration**: Text loaders automatically size to content with centered text below spinner.

## Additional Resources

- **Official Docs**: https://semantic-ui.com/elements/loader.html
- **Fomantic UI Docs**: https://fomantic-ui.com/elements/loader.html
- **Source Code**: https://github.com/Semantic-Org/Semantic-UI/blob/master/src/definitions/elements/loader.less
- **Examples**: https://github.com/Semantic-Org/Semantic-UI-Docs/blob/master/server/partials/examples/loader.html
- **React Port**: https://react.semantic-ui.com/elements/loader/ (different API)
