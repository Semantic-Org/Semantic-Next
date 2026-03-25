# PrimeReact - Carousel Usage Patterns

## Component URL
https://primereact.org/carousel/
Status: ✅ Working
Version: PrimeReact 10.9.7 (also supports v11 and v9)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Includes detailed props table, multiple examples, accessibility documentation, responsive configuration patterns, and full keyboard navigation support.

## Component Definition
- **Core purpose**: Display collections of content in an interactive, scrollable format with customizable navigation and automatic rotation capabilities
- **Mental model**: A content slider that pages through items with configurable visible quantity, scroll behavior, and navigation controls
- **Semantic meaning**: Presents grouped related content in a space-efficient manner, allowing users to browse through multiple items without leaving the current context

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `autoplayInterval={3000}`)
- **Composed**: Via composition/children (e.g., `itemTemplate={renderFunction}`)
- **CSS-only**: Requires custom styling (e.g., custom styles via className)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Image slides | ✅ | Composed | Via `itemTemplate` function that renders custom JSX for each item |
| Card slides | ✅ | Composed | Via `itemTemplate` function with product card rendering |
| Custom content | ✅ | Composed | Full flexibility through `itemTemplate` prop accepting any JSX |
| Multiple items per slide | ✅ | Native | `numVisible` prop controls items shown per page |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal scroll | ✅ | Native | Default orientation |
| Vertical scroll | ✅ | Native | `orientation="vertical"` with `verticalViewPortHeight` prop |
| Fade transition | ❌ | N/A | Not documented; uses slide/scroll transitions |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Autoplay | ✅ | Native | `autoplayInterval` prop in milliseconds (e.g., 3000) |
| Pause on hover | ⚠️ | Unknown | Not explicitly documented |
| Loading state | ❌ | N/A | Not documented; handle in parent component |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Navigation dots | ✅ | Native | Quick navigation indicators rendered automatically |
| Arrow controls | ✅ | Native | Next/previous buttons with customizable props via `nextButtonProps` and `prevButtonProps` |
| Infinite loop | ✅ | Native | `circular` boolean prop enables continuous looping |
| Speed control | ✅ | Native | `autoplayInterval` controls rotation speed in milliseconds |
| Swipe/drag support | ⚠️ | Unknown | Not explicitly documented but likely supported on touch devices |
| Responsive behavior | ✅ | Native | `responsiveOptions` array with breakpoint configurations |

## Code Examples

### Basic Carousel
```jsx
import { Carousel } from 'primereact/carousel';
import { useState, useEffect } from 'react';
import { ProductService } from './service/ProductService';

export default function BasicDemo() {
    const [products, setProducts] = useState([]);
    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {
        ProductService.getProductsSmall().then((data) =>
            setProducts(data.slice(0, 9))
        );
    }, []);

    const productTemplate = (product) => {
        return (
            <div className="border-1 surface-border border-round m-2 p-3">
                <div className="mb-3">
                    <img
                        src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
                        alt={product.name}
                        className="w-6 shadow-2"
                    />
                </div>
                <div>
                    <h4 className="mb-1">{product.name}</h4>
                    <h6 className="mt-0 mb-3">${product.price}</h6>
                    <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>
                    <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
                        <Button icon="pi pi-search" className="p-button p-button-rounded" />
                        <Button icon="pi pi-star-fill" className="p-button-success p-button-rounded" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Carousel
            value={products}
            numVisible={3}
            numScroll={3}
            responsiveOptions={responsiveOptions}
            itemTemplate={productTemplate}
        />
    );
}
```
[View Live](https://primereact.org/carousel/#basic)

### Circular & Autoplay
```jsx
<Carousel
    value={products}
    numVisible={3}
    numScroll={3}
    responsiveOptions={responsiveOptions}
    circular
    autoplayInterval={3000}
    itemTemplate={productTemplate}
/>
```
[View Live](https://primereact.org/carousel/#circular)

### Vertical Orientation
```jsx
<Carousel
    value={products}
    numVisible={1}
    numScroll={1}
    orientation="vertical"
    verticalViewPortHeight="360px"
    itemTemplate={productTemplate}
    style={{ maxWidth: '400px' }}
/>
```
[View Live](https://primereact.org/carousel/#vertical)

### Responsive Configuration
```jsx
const responsiveOptions = [
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
];

<Carousel
    value={products}
    numVisible={3}
    numScroll={1}
    responsiveOptions={responsiveOptions}
    itemTemplate={productTemplate}
/>
```

## Notable Features

### Accessibility Excellence
- **Semantic HTML**: Uses proper `region` role with configurable `aria-label` support
- **Live Region Management**: Slides container has `aria-live="polite"` for non-autoplay mode and `"off"` for autoplay to prevent screen reader interruptions
- **Proper Labeling**: Each slide has `group` role with descriptive aria-labels
- **Hidden Content**: Inactive slides properly marked with `aria-hidden="true"`
- **Keyboard Navigation**: Full keyboard support for both navigation buttons and quick navigation indicators

### Responsive Design System
- Breakpoint-based configuration using max-width queries
- Independent control of `numVisible` and `numScroll` per breakpoint
- Mobile-first approach with progressive enhancement

### Template Flexibility
- `itemTemplate` prop accepts any JSX rendering function
- Full control over item appearance and behavior
- Supports complex nested components within slides

### Navigation Customization
- `nextButtonProps` and `prevButtonProps` allow customization of navigation controls
- Quick navigation indicators (page dots) auto-generated
- Both navigation types support keyboard interaction

### Orientation Support
- Horizontal (default) and vertical orientations
- Vertical carousels require explicit height via `verticalViewPortHeight`
- Maintains same API surface across orientations

## Research Notes

### Documentation Accessibility
- Primary URL (https://primereact.org/carousel/) worked perfectly
- No redirect or 404 issues encountered
- Documentation is well-structured with clear examples

### Framework Approach
- React-specific implementation with hooks integration
- Relies on external state management for data
- Template-based rendering using function props rather than slots
- CSS classes follow PrimeFlex utility naming conventions
- Strong emphasis on accessibility compliance

### API Design Philosophy
- Declarative configuration through props
- Separation of data (`value`) from presentation (`itemTemplate`)
- Responsive design as first-class feature rather than afterthought
- Prop naming is intuitive and self-documenting

### Integration Considerations
- Requires `ProductService` or similar data fetching pattern
- Assumes PrimeFlex CSS utilities for layout
- Button components from PrimeReact ecosystem expected
- Icons via PrimeIcons library

### Potential Gaps in Documentation
- Touch/swipe behavior not explicitly documented (likely supported but not detailed)
- Pause-on-hover behavior unclear
- Animation/transition timing customization not shown
- Loading states and error handling not addressed
- No mention of lazy loading for large datasets
