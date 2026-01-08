# PrimeReact - Skeleton Usage Patterns

## Component URL
https://www.primefaces.org/primereact-v8/skeleton/
Status: ✅ Working
Version: v8.x (PrimeReact 8.x)
Last Verified: 2025-11-04

## Documentation Quality
**Good** - Clear, concise documentation with multiple code examples. Covers all core props and demonstrates common use cases including DataTable integration. Well-organized API reference with defaults specified.

## Component Definition
- **Core purpose**: Provides a placeholder to display instead of the actual content during loading states. Improves perceived performance by showing content structure before data arrives.
- **Mental model**: Visual skeleton/wireframe of the content that will eventually appear. Users understand content is loading and see the approximate layout.
- **Semantic meaning**: Communicates "content is loading" state through animated placeholder shapes that mimic the structure of the final content.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `shape="circle"`)
- **Composed**: Via composition/children (e.g., multiple `<Skeleton>` elements)
- **CSS-only**: Requires custom styling (e.g., custom classes)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Rectangle placeholders | ✅ | Native | Default shape with `width` and `height` props |
| Circle placeholders | ✅ | Native | `shape="circle"` with `size` prop |
| Text line simulation | ✅ | Native | Rectangle with default 1rem height |
| Custom placeholder content | ❌ | N/A | No custom content support - pure shape primitives |
| Composite layouts | ✅ | Composed | Multiple Skeleton components arranged together |

## Shape Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Rectangle | ✅ | Native | `shape="rectangle"` (default) |
| Circle | ✅ | Native | `shape="circle"` with `size` prop for diameter |
| Square | ✅ | Native | Rectangle with equal width/height |
| Rounded Rectangle | ✅ | Native | `borderRadius` prop controls corner radius |
| Custom shapes | ❌ | N/A | Only rectangle and circle supported |

## Animation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Wave animation | ✅ | Native | `animation="wave"` (default) - shimmer effect |
| No animation | ✅ | Native | `animation="none"` - static placeholder |
| Pulse animation | ❌ | N/A | Only wave or none supported |
| Custom animations | ❌ | CSS-only | Would require custom CSS classes |

## Sizing Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Width control | ✅ | Native | `width` prop (default: "100%") |
| Height control | ✅ | Native | `height` prop (default: "1rem") |
| Size prop (circle/square) | ✅ | Native | `size` prop for circle diameter and square dimensions |
| Responsive sizing | ✅ | Native | Supports percentage and CSS units |
| Preset sizes | ❌ | N/A | No size variants like sm/md/lg |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Border radius | ✅ | Native | `borderRadius` prop, defaults to theme value |
| Background color | ✅ | CSS-only | CSS custom property: `--surface-d` from theme |
| Animation color | ✅ | CSS-only | CSS custom property for shimmer overlay |
| Custom className | ✅ | Native | Standard React `className` prop |
| Custom style | ✅ | Native | Standard React `style` prop |

## Integration Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| DataTable integration | ✅ | Composed | Example shows skeleton rows while table loads |
| List placeholders | ✅ | Composed | Multiple Skeleton components for list items |
| Card placeholders | ✅ | Composed | Compose circle + rectangles for card layouts |
| Form placeholders | ✅ | Composed | Rectangle skeletons for input fields |
| Custom layouts | ✅ | Composed | Flexible composition of primitives |

## Code Examples

### Basic Rectangle (Default)
```jsx
import { Skeleton } from 'primereact/skeleton';

// Simple text line placeholder
<Skeleton />
```

### Circle Shape
```jsx
// User avatar placeholder
<Skeleton shape="circle" size="50px" />
```

### Custom Dimensions
```jsx
// Custom width and height for rectangle
<Skeleton width="100%" height="2rem" />

// Full-width with specific height
<Skeleton width="100%" height="150px" />
```

### Custom Border Radius
```jsx
// Rounded rectangle
<Skeleton borderRadius="16px" />

// Fully rounded pill shape
<Skeleton width="8rem" height="2rem" borderRadius="2rem" />
```

### Disable Animation
```jsx
// Static placeholder without shimmer
<Skeleton animation="none" />
```

### Card Layout Composition
```jsx
// Typical card skeleton with avatar + text
<div className="custom-skeleton p-4">
    <div className="flex mb-3">
        <Skeleton shape="circle" size="4rem" className="mr-2" />
        <div style={{ flex: 1 }}>
            <Skeleton width="100%" className="mb-2" />
            <Skeleton width="75%" />
        </div>
    </div>
    <Skeleton width="100%" height="150px" />
    <div className="flex justify-content-between mt-3">
        <Skeleton width="4rem" height="2rem" />
        <Skeleton width="4rem" height="2rem" />
    </div>
</div>
```

### DataTable Integration
```jsx
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const items = Array.from({ length: 5 }, (v, i) => i);

const bodyTemplate = () => {
    return <Skeleton />;
};

// Loading state for table
<DataTable value={items}>
    <Column field="code" header="Code" style={{ width: '25%' }} body={bodyTemplate} />
    <Column field="name" header="Name" style={{ width: '25%' }} body={bodyTemplate} />
    <Column field="category" header="Category" style={{ width: '25%' }} body={bodyTemplate} />
    <Column field="quantity" header="Quantity" style={{ width: '25%' }} body={bodyTemplate} />
</DataTable>
```

### List Items
```jsx
// Product list skeleton
<div>
    {items.map((item, i) => (
        <div className="flex mb-3" key={i}>
            <Skeleton shape="circle" size="4rem" className="mr-2" />
            <div style={{ flex: 1 }}>
                <Skeleton width="100%" className="mb-2" />
                <Skeleton width="75%" />
            </div>
        </div>
    ))}
</div>
```

## Notable Features

### Minimal API Surface
PrimeReact's Skeleton component follows a minimalist design philosophy:
- Only 6 props total (shape, size, width, height, borderRadius, animation)
- Two shape primitives (rectangle, circle)
- Two animation states (wave, none)
- Relies on composition for complex layouts rather than built-in templates

### Theme Integration
- Uses PrimeReact theme system for default colors
- Background color uses `--surface-d` CSS custom property
- Animation overlay color themeable via CSS variables
- Border radius can default to theme's border radius value

### Flexibility Through Composition
Rather than providing pre-built skeleton templates (like some frameworks), PrimeReact expects developers to:
- Compose multiple `<Skeleton>` components
- Use standard CSS/flexbox for layout
- Build custom skeleton patterns for their specific needs

This approach provides maximum flexibility at the cost of more verbose markup for common patterns.

### DataTable Integration Pattern
The DataTable integration example demonstrates:
- Creating placeholder rows using array mapping
- Using body template to render Skeleton in each cell
- Maintaining table structure during loading
- No special props needed - pure composition

### CSS Classes
The component uses PrimeReact's class naming convention:
- `.p-skeleton` - Base class for all skeletons
- `.p-skeleton-circle` - Circle shape modifier
- `.p-skeleton-none` - No animation modifier

## Research Notes

### Framework Approach
PrimeReact takes a **primitive-focused** approach:
- Provides basic shape building blocks
- No pre-built composite patterns
- Maximum flexibility, minimal API
- Developers compose layouts from primitives

### Comparison to Other Patterns
**Strengths:**
- Simple, predictable API
- Easy to understand and use
- Flexible composition model
- No arbitrary limitations on layout

**Potential Gaps:**
- No built-in composite patterns (avatar + text, etc.)
- No preset size variants (sm, md, lg)
- No multiple animation options (only wave/none)
- No color theming via props (CSS-only)
- No text line count shorthand (must repeat elements)

### Documentation Observations
- Clear prop table with defaults
- Multiple practical examples
- Shows real-world DataTable integration
- Missing: compound component patterns, accessibility notes
- No TypeScript example despite PrimeReact having TS support

### Version Context
This is v8.x documentation. PrimeReact is transitioning to newer versions, so patterns may evolve. The v8 API appears stable and well-established.
