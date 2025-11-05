# PrimeReact - PrimeFlex Grid Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primeflex.org/gridsystem
Status: ✅ Working
Version: 3.3.1
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-documented with clear examples, organized sections, and extensive responsive breakpoint support.

## Component Definition
- **Core purpose**: Provides a flexbox-based 12-column grid system for creating responsive layouts through CSS utility classes
- **Mental model**: CSS utility framework where classes are applied directly to HTML/JSX elements to build grid layouts without writing custom CSS
- **Semantic meaning**: Structural layout container that organizes content into rows and columns with flexible sizing and responsive behavior

## Pattern Support Levels
- **Native**: Not applicable (this is a CSS library, not a React component library)
- **Composed**: Via HTML/JSX composition with CSS classes
- **CSS-only**: Pure CSS utility classes applied via `className` prop in React

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Grid container/item | ✅ | CSS-only | `.grid` container with `.col` items, applies `display: flex; flex-wrap: wrap` |
| 12-column grid | ✅ | CSS-only | `.col-1` through `.col-12` for fixed width columns (8.33% to 100%) |
| Flexbox based | ✅ | CSS-only | Core grid system uses flexbox with `flex-wrap: wrap` |
| CSS Grid based | ❌ | N/A | Uses flexbox, not CSS Grid |
| Flexible columns | ✅ | CSS-only | `.col` class for auto-width columns that grow to fill space |
| Fixed width columns | ✅ | CSS-only | `.col-fixed` for columns with fixed width determined by inline styles |
| No gutter variant | ✅ | CSS-only | `.grid-nogutter` removes default padding |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Breakpoints | ✅ | CSS-only | `sm:`, `md:`, `lg:`, `xl:` prefixes for responsive classes |
| Responsive classes | ✅ | CSS-only | Format: `{breakpoint}:col-{number}` (e.g., `md:col-6`, `lg:col-3`) |
| Mobile-first approach | ✅ | CSS-only | Base classes apply to all sizes, prefix classes override at larger breakpoints |

## Spacing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Gap utilities | ✅ | CSS-only | `gap-{0-6}` classes for row/column gaps (e.g., `gap-2`, `gap-4`) |
| Padding utilities | ✅ | CSS-only | `p-{0-6}`, `px-{0-6}`, `py-{0-6}`, `pt-{0-6}`, `pr-{0-6}`, `pb-{0-6}`, `pl-{0-6}` |
| Margin utilities | ✅ | CSS-only | `m-{0-6}`, `mx-{0-6}`, `my-{0-6}`, `mt-{0-6}`, `mr-{0-6}`, `mb-{0-6}`, `ml-{0-6}` |
| Negative margins | ✅ | CSS-only | Add dash prefix for negative values (e.g., `-mt-2`, `-ml-4`) |
| Default gutter | ✅ | CSS-only | 0.5rem padding per column (1rem total gap between columns) |
| Responsive spacing | ✅ | CSS-only | All spacing utilities support responsive prefixes (e.g., `md:gap-2`, `lg:p-3`) |

## Alignment Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal alignment | ✅ | CSS-only | `justify-content-start`, `justify-content-center`, `justify-content-end`, `justify-content-between`, `justify-content-around`, `justify-content-evenly` |
| Vertical alignment | ✅ | CSS-only | `align-items-start`, `align-items-center`, `align-items-end`, `align-items-baseline`, `align-items-stretch` |
| Content alignment | ✅ | CSS-only | `align-content-start`, `align-content-center`, `align-content-end` for multi-line flex containers |
| Self alignment | ✅ | CSS-only | `align-self-start`, `align-self-center`, `align-self-end` for individual flex items |
| Responsive alignment | ✅ | CSS-only | All alignment utilities support responsive prefixes (e.g., `md:justify-content-center`) |

## Sizing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Fixed columns | ✅ | CSS-only | `.col-{1-12}` classes for specific width columns |
| Auto columns | ✅ | CSS-only | `.col` class for flexible width that grows to fill available space |
| Offset | ✅ | CSS-only | `.col-offset-{0-12}` classes apply left margins (0% to 100%) |
| Responsive sizing | ✅ | CSS-only | Format: `{breakpoint}:col-{number}` for breakpoint-specific widths |
| Multiline wrapping | ✅ | CSS-only | Automatic wrapping when column units exceed 12 |

## Advanced Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Nested grids | ✅ | CSS-only | Columns can contain inner `.grid` structures for complex layouts |
| Column ordering | ✅ | CSS-only | `flex-order-{number}` classes control visual order of flex items |
| Responsive ordering | ✅ | CSS-only | Format: `{breakpoint}:flex-order-{number}` for breakpoint-specific ordering |
| Mixed fixed/flexible | ✅ | CSS-only | Can combine `.col-fixed` with `.col` in same row |

## Code Examples

### Basic Grid
```jsx
<div className="grid">
    <div className="col">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">1</div>
    </div>
    <div className="col">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">2</div>
    </div>
    <div className="col">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">3</div>
    </div>
</div>
```

### 12-Column Layout
```jsx
<div className="grid">
    <div className="col-4">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">4</div>
    </div>
    <div className="col-4">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">4</div>
    </div>
    <div className="col-4">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">4</div>
    </div>
</div>
```

### Column Offset
```jsx
<div className="grid">
    <div className="col-6 col-offset-3">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">6</div>
    </div>
</div>
```

### Responsive Grid
```jsx
<div className="grid">
    <div className="col-12 md:col-6 lg:col-3">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">Content</div>
    </div>
    <div className="col-12 md:col-6 lg:col-3">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">Content</div>
    </div>
    <div className="col-12 md:col-6 lg:col-3">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">Content</div>
    </div>
    <div className="col-12 md:col-6 lg:col-3">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">Content</div>
    </div>
</div>
```

### No Gutter Grid
```jsx
<div className="grid grid-nogutter">
    <div className="col">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">No Gutter</div>
    </div>
    <div className="col">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">No Gutter</div>
    </div>
</div>
```

### Grid with Gap
```jsx
<div className="grid gap-3">
    <div className="col-4">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">Content</div>
    </div>
    <div className="col-4">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">Content</div>
    </div>
    <div className="col-4">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">Content</div>
    </div>
</div>
```

### Alignment Example
```jsx
<div className="grid justify-content-center align-items-center" style={{minHeight: '200px'}}>
    <div className="col-6">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">Centered Content</div>
    </div>
</div>
```

### Column Ordering
```jsx
<div className="grid">
    <div className="col flex-order-2">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">First in DOM, Second visually</div>
    </div>
    <div className="col flex-order-1">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">Second in DOM, First visually</div>
    </div>
</div>
```

### Nested Grid
```jsx
<div className="grid">
    <div className="col-8">
        <div className="grid nested-grid">
            <div className="col-6">
                <div className="text-center p-3 border-round-sm bg-primary font-bold">Nested 1</div>
            </div>
            <div className="col-6">
                <div className="text-center p-3 border-round-sm bg-primary font-bold">Nested 2</div>
            </div>
        </div>
    </div>
    <div className="col-4">
        <div className="text-center p-3 border-round-sm bg-primary font-bold">Sidebar</div>
    </div>
</div>
```

## Notable Features

- **Utility-First Approach**: PrimeFlex is a pure CSS utility library, not a React component library. It provides low-level building blocks via classes rather than pre-built components.

- **Flexbox Foundation**: The grid system is built on flexbox (`display: flex; flex-wrap: wrap`) rather than CSS Grid, providing excellent browser support and familiar flex-based behavior.

- **Comprehensive Responsive System**: All utilities support responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`), allowing complete control over layout at different breakpoints.

- **Default Gutter System**: Columns receive automatic 0.5rem padding (1rem total gap) by default, with `.grid-nogutter` option to remove it entirely or `gap-{n}` utilities for custom spacing.

- **Spacing Scale**: Consistent spacing scale from 0-6 where default `$spacer` is 1rem, applicable across margin, padding, and gap utilities.

- **Simplified Class Names (v3+)**: Version 3 removed the `p-` prefix from classnames for better readability (e.g., `ml-4` instead of `p-ml-4`).

- **Negative Margins**: Supports negative margin values with dash prefix (e.g., `-mt-2`, `-ml-4`) for advanced layout techniques.

- **Mixed Column Types**: Can combine fixed width (`.col-fixed`), percentage-based (`.col-{1-12}`), and flexible (`.col`) columns in the same row.

- **Visual Reordering**: `flex-order-{n}` utilities enable changing visual order without modifying DOM structure, useful for responsive reordering.

## How PrimeFlex Integrates with PrimeReact

PrimeFlex is a **separate CSS library** designed to complement PrimeReact but is completely independent:

- **Installation**: PrimeFlex is installed separately (`npm install primeflex`) from PrimeReact
- **Usage**: Import PrimeFlex CSS in your application (`import 'primeflex/primeflex.css'`)
- **Independence**: Can be used with PrimeReact components, plain HTML, or other React component libraries
- **Styling Approach**: PrimeFlex provides utility classes while PrimeReact provides themed components - they work together but are distinct layers
- **Theme Coordination**: PrimeFlex utilities (like `bg-primary`, `text-center`) can reference PrimeReact theme variables for visual consistency
- **Flexibility**: Developers can use PrimeFlex grid with any content, including PrimeReact components, native HTML elements, or custom components

## Research Notes

- **Documentation Access**: Primary documentation at https://primeflex.org/gridsystem was successfully accessed. Additional utility documentation exists at separate URLs (justify-content, align-items, gap, spacing, order pages).

- **Version Context**: Documentation reflects version 3.3.1 with simplified class naming conventions (removed `p-` prefix from v2).

- **Framework Philosophy**: PrimeFlex follows the utility-first CSS philosophy similar to Tailwind CSS but specifically designed to complement the PrimeReact/PrimeFaces ecosystem.

- **Not a Component**: Important distinction - this is not a React component but a CSS utility library. There are no Grid or Column components to import; instead, developers apply CSS classes directly via `className` prop.

- **Flexbox vs CSS Grid**: Despite the name "grid system," PrimeFlex uses flexbox rather than CSS Grid specification. This is a common pattern in utility frameworks for wider browser support and familiar developer experience.

- **Comprehensive Utility Coverage**: Beyond the grid system, PrimeFlex provides extensive utilities for flexbox alignment, spacing, display, colors, typography, and more, making it a complete utility-first CSS solution.

- **Breakpoint Strategy**: Mobile-first responsive design where base classes apply to all sizes and breakpoint prefixes override at specific widths and above.
