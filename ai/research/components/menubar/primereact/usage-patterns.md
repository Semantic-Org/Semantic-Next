# PrimeReact - Menubar Usage Patterns

## Component URL
https://primereact.org/menubar/
Status: ✅ Working
Version: 10.9.7 (Current)
Last Verified: 2025-11-05

## Documentation Quality
**Comprehensive** - The documentation provides detailed prop descriptions, extensive code examples, accessibility documentation, keyboard navigation reference, and multiple implementation patterns.

## Component Definition
- **Core purpose**: Provides a horizontal menu/navigation bar system for applications, serving as the primary navigation interface commonly placed at the top of an application
- **Mental model**: A horizontal navigation bar (navbar) that organizes menu items hierarchically with support for nested submenus and custom content areas
- **Semantic meaning**: Primary navigation interface that communicates the main sections and actions available in an application

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `model={items}`, `start={content}`)
- **Composed**: Via composition/children (e.g., custom templates via start/end props)
- **CSS-only**: Requires custom styling (e.g., custom theming through CSS)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text labels | ✅ | Native | Via `label` property in menu item model |
| Icon support | ✅ | Native | Via `icon` property in menu item model (supports icon libraries) |
| Custom start content | ✅ | Native | Via `start` prop for custom JSX/elements at menubar beginning |
| Custom end content | ✅ | Native | Via `end` prop for custom JSX/elements at menubar end |
| Nested submenus | ✅ | Native | Via `items` array property in menu item model |
| Separator items | ✅ | Native | Via `separator: true` in menu item model |
| Custom templates | ✅ | Native | Via `template` property in menu item model for custom rendering |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Horizontal menu | ✅ | Native | Default and only orientation (menubar is horizontal by design) |
| Mobile responsive | ✅ | Native | Automatic hamburger menu for mobile viewports |
| Desktop navigation | ✅ | Native | Full horizontal menu display on larger screens |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled items | ✅ | Native | Via `disabled: true` in menu item model |
| Active/selected state | ✅ | Native | Managed through component state and styling |
| Open/closed submenus | ✅ | Native | Automatic state management with keyboard and mouse interaction |
| Mobile menu toggle | ✅ | Native | Built-in hamburger button with open/close state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Submenu levels | ✅ | Native | Unlimited nesting depth via recursive items structure |
| Item badges | ✅ | Native | Via `badge` and `badgeClassName` properties |
| Item styling | ✅ | Native | Via `className` and `style` properties per item |
| Unstyled mode | ✅ | Native | Support for Bootstrap, Bulma, and custom styling |
| Pass-through props | ✅ | Native | Via pt (pass-through) API for granular customization |
| Button configuration | ✅ | Native | Via `buttonProps` for mobile menu button customization |

## Behavioral Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Command callbacks | ✅ | Native | Via `command` property for item click/activation handlers |
| Router integration | ✅ | Native | Via `url` property for navigation targets |
| Keyboard navigation | ✅ | Native | Full ARIA-compliant keyboard support (arrows, enter, escape, etc.) |
| Focus management | ✅ | Native | Automatic focus handling for accessibility |
| External links | ✅ | Native | Via `target` property (e.g., `_blank`) with `url` |

## Props/API Documentation

### Component Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | null | Unique identifier |
| `model` | MenuItem[] | null | Array of menu item models defining structure |
| `style` | object | null | Inline styles for container |
| `className` | string | null | CSS class for container |
| `start` | ReactNode | null | Custom content at start of menubar |
| `end` | ReactNode | null | Custom content at end of menubar |
| `submenuIcon` | string | null | Custom icon for submenus (overrides default chevron) |
| `menuIcon` | string | null | Custom icon for mobile menu button |
| `buttonProps` | object | null | Configuration object for mobile menu button |
| `pt` | object | null | Pass-through props for component customization |

### MenuItem Model Properties
| Property | Type | Description |
|----------|------|-------------|
| `label` | string | Text displayed for item |
| `icon` | string | Icon class (e.g., 'pi pi-home') |
| `url` | string | Navigation target URL |
| `items` | MenuItem[] | Array of submenu items |
| `command` | function | Callback executed on click/activation |
| `template` | function | Custom render function for item |
| `disabled` | boolean | Whether item is disabled |
| `target` | string | Link target attribute (e.g., '_blank') |
| `separator` | boolean | Render as separator instead of item |
| `style` | object | Inline styles for item |
| `className` | string | CSS class for item |
| `badge` | string | Badge value to display |
| `badgeClassName` | string | CSS class for badge |

## Code Examples

### Basic Menubar
```jsx
import { Menubar } from 'primereact/menubar';

export default function BasicDemo() {
    const items = [
        {
            label: 'File',
            icon: 'pi pi-file',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-plus',
                    items: [
                        {
                            label: 'Document',
                            icon: 'pi pi-file'
                        },
                        {
                            label: 'Image',
                            icon: 'pi pi-image'
                        },
                        {
                            label: 'Video',
                            icon: 'pi pi-video'
                        }
                    ]
                },
                {
                    label: 'Open',
                    icon: 'pi pi-folder-open'
                },
                {
                    separator: true
                },
                {
                    label: 'Quit',
                    icon: 'pi pi-power-off'
                }
            ]
        },
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
            items: [
                {
                    label: 'Delete',
                    icon: 'pi pi-trash'
                },
                {
                    label: 'Refresh',
                    icon: 'pi pi-refresh'
                }
            ]
        }
    ];

    return (
        <Menubar model={items} />
    );
}
```

### Menubar with Custom Start/End Content
```jsx
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';

export default function TemplateDemo() {
    const items = [
        { label: 'Home', icon: 'pi pi-home' },
        { label: 'Features', icon: 'pi pi-star' },
        { label: 'Projects', icon: 'pi pi-search' },
        { label: 'Contact', icon: 'pi pi-envelope' }
    ];

    const start = <img alt="logo" src="/demo/images/logo.svg" height="40" className="mr-2" />;
    const end = (
        <div className="flex align-items-center gap-2">
            <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
            <Avatar image="/demo/images/avatar/amyelsner.png" shape="circle" />
        </div>
    );

    return (
        <Menubar model={items} start={start} end={end} />
    );
}
```

### Menubar with Command Handlers
```jsx
import { Menubar } from 'primereact/menubar';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

export default function CommandDemo() {
    const toast = useRef(null);

    const items = [
        {
            label: 'File',
            icon: 'pi pi-file',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-plus',
                    command: () => {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'File created', life: 3000 });
                    }
                },
                {
                    label: 'Open',
                    icon: 'pi pi-folder-open',
                    command: () => {
                        toast.current.show({ severity: 'info', summary: 'Info', detail: 'File opened', life: 3000 });
                    }
                }
            ]
        },
        {
            label: 'Quit',
            icon: 'pi pi-power-off',
            command: () => {
                toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Application closed', life: 3000 });
            }
        }
    ];

    return (
        <>
            <Toast ref={toast} />
            <Menubar model={items} />
        </>
    );
}
```

### Router Integration
```jsx
import { Menubar } from 'primereact/menubar';

export default function RouterDemo() {
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            url: '/'
        },
        {
            label: 'About',
            icon: 'pi pi-info-circle',
            url: '/about'
        },
        {
            label: 'Contact',
            icon: 'pi pi-envelope',
            url: '/contact'
        },
        {
            label: 'External',
            icon: 'pi pi-external-link',
            url: 'https://www.primereact.org',
            target: '_blank'
        }
    ];

    return (
        <Menubar model={items} />
    );
}
```

## Composition Patterns

### Hierarchical Menu Structure
The component uses a recursive data model where each menu item can contain its own `items` array for nested submenus, allowing unlimited depth:

```javascript
const items = [
    {
        label: 'Level 1',
        items: [
            {
                label: 'Level 2',
                items: [
                    {
                        label: 'Level 3',
                        // Can continue nesting...
                    }
                ]
            }
        ]
    }
];
```

### Custom Item Templates
Items can use custom rendering functions via the `template` property:

```javascript
const items = [
    {
        template: (item, options) => {
            return (
                <a className={options.className} onClick={options.onClick}>
                    <span className="custom-icon" />
                    <span className="custom-label">{item.label}</span>
                </a>
            );
        }
    }
];
```

## Styling Approaches

### CSS Class Customization
- Container: `className` prop on component
- Individual items: `className` property in menu item model
- Badges: `badgeClassName` property in menu item model

### Pass-Through API
The `pt` prop allows granular customization of internal elements:

```jsx
<Menubar
    model={items}
    pt={{
        root: { className: 'custom-root' },
        menu: { className: 'custom-menu' },
        menuitem: { className: 'custom-menuitem' }
    }}
/>
```

### Unstyled Mode
Component supports working without default PrimeReact styles, allowing integration with:
- Bootstrap
- Bulma
- Custom design systems

## Accessibility Patterns

### ARIA Implementation
| Element | ARIA Attributes | Purpose |
|---------|----------------|---------|
| Root | `role="menubar"`, `aria-labelledby` or `aria-label` | Identifies as menubar |
| Menu items | `role="menuitem"` | Identifies interactive items |
| Submenus | `aria-haspopup="true"`, `aria-expanded`, `aria-controls` | Indicates and controls submenu state |
| List items | `role="presentation"` | Removes list semantics for proper menu structure |
| Mobile button | `aria-haspopup="true"`, `aria-expanded`, `aria-controls`, `aria-label` | Controls mobile menu state |

### Keyboard Navigation
| Key | Function |
|-----|----------|
| Tab | Moves focus to next focusable element; if focus is in menubar, moves to next element in page tab sequence |
| Shift+Tab | Moves focus to previous focusable element |
| Enter | Activates menuitem, toggles submenu if present |
| Space | Activates menuitem, toggles submenu if present |
| Down Arrow | Opens submenu if focused on item with submenu; moves focus to next menuitem in submenu |
| Up Arrow | Moves focus to previous menuitem in submenu |
| Right Arrow | Opens submenu; if already open, moves focus to first item in submenu |
| Left Arrow | Closes submenu; if submenu open, returns focus to parent item |
| Home | Moves focus to first menuitem in current level |
| End | Moves focus to last menuitem in current level |
| Escape | Closes submenu and returns focus to parent menuitem |

### Screen Reader Support
- Proper semantic structure with menubar role
- Submenu relationships announced via ARIA attributes
- Focus changes announced appropriately
- Mobile menu button state communicated

## Notable Features

### Mobile Responsiveness
- Automatic hamburger menu conversion for mobile viewports
- Configurable mobile menu button via `buttonProps`
- Custom mobile menu icon via `menuIcon` prop
- Maintains full functionality in mobile mode

### Flexible Content Areas
- `start` prop for logo, branding, or custom elements at beginning
- `end` prop for search, user menu, or actions at end
- Both areas support any React components

### Rich Item Model
- Supports icons, badges, separators, custom templates
- Command callbacks for imperative actions
- URL navigation for routing
- Nested structure for hierarchical menus

### State Management
- Built-in state handling for submenu open/close
- No external state management required
- Proper cleanup on unmount

### Framework Integration
- Works with React Router via `url` property
- Compatible with state management libraries
- Toast notification integration shown in examples

### Theming Support
- Works with PrimeReact theme system
- Locale API integration for internationalization
- Pass-through props for deep customization
- Unstyled mode for custom design systems

### Developer Experience
- Simple model-based API
- TypeScript support
- Comprehensive documentation
- Multiple working examples

## Research Notes

### Documentation Quality
The PrimeReact documentation for Menubar is exceptionally thorough:
- Multiple complete working examples
- Detailed accessibility section with keyboard navigation table
- Comprehensive props documentation
- Integration patterns clearly demonstrated
- Mobile behavior well-documented

### Framework Philosophy
PrimeReact's approach to Menubar demonstrates:
- **Model-driven**: Menu structure defined declaratively via data model
- **Composition over configuration**: Custom content via React components rather than complex prop APIs
- **Accessibility-first**: Full ARIA implementation and keyboard support built-in
- **Progressive enhancement**: Works on mobile and desktop with appropriate adaptations
- **Flexibility**: Multiple styling approaches (themed, unstyled, pass-through)

### Unique Approaches
- **Pass-through API**: The `pt` prop pattern for granular customization is distinctive
- **Template functions**: Item-level custom rendering while maintaining menu semantics
- **Dual navigation**: Supports both command callbacks and URL navigation in same structure
- **Mobile-first responsive**: Automatic hamburger menu without additional configuration

### Comparison Considerations
When comparing to other frameworks:
- Model-based approach differs from component composition patterns (e.g., Chakra UI's `<Menu>` children)
- Built-in mobile responsive behavior vs requiring separate mobile menu component
- Rich item model with badges, separators, templates vs simpler prop APIs
- Pass-through customization vs styled-components or CSS-in-JS approaches
