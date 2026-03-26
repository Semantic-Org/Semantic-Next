# PrimeReact - BreadCrumb Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.primefaces.org/primereact-v8/breadcrumb/
Status: ✅ Working
Version: v8 (Current)
Last Verified: 2025-11-05

## Documentation Quality
Basic - The breadcrumb documentation page is minimal, relying heavily on the MenuModel API reference for detailed configuration options. Accessibility section noted as "under development."

## Component Definition
- **Core purpose**: Provides contextual information about page hierarchy and navigation path
- **Mental model**: Array-driven navigation path where each item represents a level in the hierarchy
- **Semantic meaning**: Shows user's current location within a nested structure and allows navigation back to previous levels

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `model={items}`, `home={homeConfig}`)
- **Composed**: Via composition/children (not used in this component - array-driven only)
- **CSS-only**: Requires custom styling (e.g., theme customization via `className`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text links | ✅ | Native | Via `label` property in MenuItem objects |
| Icon support | ✅ | Native | `icon` property accepts string (class), JSX.Element, or function |
| Dropdown menus | ❌ | Not supported | Breadcrumb is linear; no dropdown truncation pattern |
| Custom separators | ⚠️ | CSS-only | Fixed chevron separator; customizable via CSS `.p-breadcrumb-chevron` |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple breadcrumb | ✅ | Native | Array of items with labels |
| With home icon | ✅ | Native | Separate `home` prop with MenuItem config |
| Icon breadcrumb | ✅ | Native | Icons via `icon` property on any item |
| URL navigation | ✅ | Native | `url` property for external links |
| Programmatic navigation | ✅ | Native | `command` callback function for route changes |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Current page | ⚠️ | Pattern-based | Last item in array is typically non-clickable (no url/command) |
| Disabled items | ✅ | Native | `disabled: true` in MenuItem |
| Clickable/non-clickable | ✅ | Native | Items without url/command are non-interactive |
| Visible/hidden items | ✅ | Native | `visible: false` hides items |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Separator styles | ⚠️ | CSS-only | Chevron is default; customize via `.p-breadcrumb-chevron` class |
| Size options | ❌ | CSS-only | No native size prop; use custom CSS |
| Responsive behavior | ❌ | CSS-only | No built-in responsive truncation or collapse |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click navigation | ✅ | Native | Via `url` (external) or `command` (programmatic) |
| Router integration | ✅ | Native | `command` callback for React Router/Next.js navigation |
| Programmatic nav | ✅ | Native | `command: (e) => navigate('/path')` pattern |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| aria-label | ⚠️ | Unknown | Documentation states "under development" for a11y |
| aria-current | ⚠️ | Unknown | Not documented |
| Keyboard navigation | ⚠️ | Unknown | Not documented; likely standard link behavior |

## Code Examples

### Basic Usage
```jsx
import { BreadCrumb } from 'primereact/breadcrumb';

// Define breadcrumb items
const items = [
    { label: 'Categories' },
    { label: 'Sports' },
    { label: 'Football' }
];

// Configure home icon
const home = {
    icon: 'pi pi-home',
    url: 'https://www.primefaces.org/primereact'
};

// Render breadcrumb
<BreadCrumb model={items} home={home} />
```

### With URL Navigation
```jsx
const items = [
    { label: 'Electronics', url: '/categories/electronics' },
    { label: 'Computers', url: '/categories/electronics/computers' },
    { label: 'Laptops' } // Current page - no URL
];

const home = { icon: 'pi pi-home', url: '/' };

<BreadCrumb model={items} home={home} />
```

### With Programmatic Navigation (React Router)
```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Dashboard',
            command: () => navigate('/dashboard')
        },
        {
            label: 'Users',
            command: () => navigate('/dashboard/users')
        },
        {
            label: 'Profile' // Current page
        }
    ];

    const home = {
        icon: 'pi pi-home',
        command: () => navigate('/')
    };

    return <BreadCrumb model={items} home={home} />;
}
```

### With Icons in Items
```jsx
const items = [
    { label: 'Settings', icon: 'pi pi-cog' },
    { label: 'Account', icon: 'pi pi-user' },
    { label: 'Profile' }
];

const home = { icon: 'pi pi-home', url: '/' };

<BreadCrumb model={items} home={home} />
```

### With Custom Template
```jsx
const items = [
    {
        label: 'Products',
        template: (item, options) => (
            <a className={options.className} onClick={options.onClick}>
                <i className="pi pi-shopping-cart" />
                <span className={options.labelClassName}>{item.label}</span>
            </a>
        )
    },
    { label: 'Electronics' }
];

const home = { icon: 'pi pi-home', url: '/' };

<BreadCrumb model={items} home={home} />
```

### With Disabled Items
```jsx
const items = [
    { label: 'Categories', url: '/categories' },
    { label: 'Archived', disabled: true }, // Non-clickable
    { label: 'View' }
];

const home = { icon: 'pi pi-home', url: '/' };

<BreadCrumb model={items} home={home} />
```

### With Custom Styling
```jsx
const items = [
    { label: 'Home', url: '/', className: 'custom-breadcrumb-item' },
    { label: 'Products', url: '/products' },
    { label: 'Details' }
];

const home = { icon: 'pi pi-home', url: '/' };

<BreadCrumb
    model={items}
    home={home}
    className="custom-breadcrumb"
    style={{ backgroundColor: '#f8f9fa' }}
/>
```

## Notable Features

### MenuModel API Integration
PrimeReact's Breadcrumb uses the common MenuModel API, which provides consistency across menu components (MenuBar, TieredMenu, etc.). This means developers familiar with other PrimeReact menu components already understand the breadcrumb configuration.

### Separate Home Configuration
Unlike some frameworks that include the home item in the main items array, PrimeReact separates home configuration. This makes it explicit and prevents accidental omission of the home link.

### Template System
The `template` property on MenuItem allows complete customization of rendering while maintaining event handling and accessibility behavior (when implemented).

### Icon Flexibility
Icons can be:
- CSS class strings (`'pi pi-home'`)
- JSX Elements (`<HomeIcon />`)
- Functions for dynamic rendering

### Command vs URL Pattern
Clear separation between:
- **URL navigation**: External links, page reloads
- **Command callbacks**: Programmatic navigation, SPA routing

### Theme System
Supports 30+ themes including popular design systems (Bootstrap, Material Design, Tailwind). Premium themes available through PrimeReact Theme Designer.

## Research Notes

### Documentation Limitations
- Accessibility section is marked "under development" - specific ARIA attributes and keyboard navigation not documented
- MenuModel API is documented separately, requiring cross-referencing
- No responsive behavior examples (truncation, collapse)
- Limited examples compared to other PrimeReact components

### Observations
- **Array-driven architecture**: Unlike composition-based breadcrumbs, PrimeReact uses pure configuration
- **No dropdown pattern**: For long breadcrumb paths, there's no built-in truncation with dropdown menu
- **Fixed separator**: Chevron separator is hardcoded; customization requires CSS overrides
- **Minimal state management**: Component is stateless; all state managed externally via model prop

### Comparison to Framework Patterns
- **Similar to**: Ant Design (array-based `items` prop)
- **Different from**: Chakra UI, Radix UI (composition-based with children)
- **Unique**: Separate `home` prop is less common; most frameworks include home in items array

### Missing Patterns
- No responsive collapse/ellipsis for long paths
- No dropdown menu for truncated items
- No size variants (sm/md/lg)
- No built-in aria-current for current page
- No keyboard navigation documented
- No loading state
- No max-items or auto-truncation

### Integration Considerations
- Works well with React Router via `command` callbacks
- Next.js integration requires `command: () => router.push()`
- No built-in active state detection - must be managed externally
- Current page typically represented as last item without url/command
