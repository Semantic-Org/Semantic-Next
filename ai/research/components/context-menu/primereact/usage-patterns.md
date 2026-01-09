# PrimeReact - ContextMenu Usage Patterns

## Component URL
https://primereact.org/contextmenu/
Status: ✅ Working
Version: 10.9.7
Last Verified: 2025-11-05

## Documentation Quality
Good - Comprehensive examples with accessibility documentation, though API reference table is not fully visible in the documentation page structure

## Component Definition
- **Core purpose**: Provides an overlay menu that appears on right-click (context menu) interaction with a target element or the entire document
- **Mental model**: A hidden menu that appears at the cursor position when the user right-clicks, offering contextual actions relevant to the clicked element
- **Semantic meaning**: Represents secondary actions or contextual operations that are available for specific elements or the entire page

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `model={items}`, `global`)
- **Composed**: Via composition/children (template customization via `template` property)
- **CSS-only**: Requires custom styling (styling via className and PrimeReact's design token system)

## Core Patterns

### Activation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Element-targeted | ✅ | Native | Default - attach to specific element via `onContextMenu` handler |
| Document-global | ✅ | Native | Via `global` prop - attaches to entire document |
| Programmatic show | ✅ | Native | Via `show(event)` method on component ref |

### Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Menu items | ✅ | Native | Via `model` prop accepting array of item objects |
| Submenus | ✅ | Native | Nested items via `items` property on menu items |
| Separators | ✅ | Native | Mentioned in accessibility docs, supported in model |
| Icons | ✅ | Native | Icon property on menu items (uses PrimeIcons) |
| Custom templates | ✅ | Native | Via `template` property on items for custom rendering |
| Labels | ✅ | Native | Text content via item properties |

### Interaction Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Command callbacks | ✅ | Native | Via `command` property on items |
| Navigation | ✅ | Native | Via `url` property on items for routing |
| Disabled items | ✅ | Native | Mentioned in accessibility docs with aria-disabled |
| Hide callback | ✅ | Native | Via `onHide` prop when menu closes |

### State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Open/close control | ✅ | Native | Via `show()` method and automatic close behavior |
| Selected item tracking | ✅ | Composed | Via external state management (shown in examples) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Responsive behavior | ✅ | Native | Via `breakpoint` prop (e.g., "767px") |
| Position control | ✅ | Native | Automatic positioning at cursor location via event coordinates |

## Props/API Documentation

### Component Props (Documented)
| Prop | Type | Description |
|------|------|-------------|
| model | MenuItem[] | Collection of menu items to display |
| ref | React.Ref | Reference to access component methods like show() |
| global | boolean | When true, attaches context menu to entire document |
| breakpoint | string | Responsive breakpoint for layout adjustments (e.g., "767px") |
| onHide | function | Callback fired when menu closes |

### Component Methods
| Method | Signature | Description |
|--------|-----------|-------------|
| show | show(event: Event) | Displays the menu at the right-click location |

### MenuItem Properties (Inferred from Examples)
| Property | Type | Description |
|----------|------|-------------|
| label | string | Display text for the menu item |
| icon | string | Icon class name (PrimeIcons) |
| command | function | Callback executed when item is activated |
| url | string | Navigation URL for router integration |
| items | MenuItem[] | Child items for submenu |
| template | function/element | Custom rendering for the item |
| separator | boolean | Renders as a separator (inferred from accessibility) |
| disabled | boolean | Disables the item (inferred from accessibility) |

## Code Examples

### Basic Usage
```jsx
import { ContextMenu } from 'primereact/contextmenu';

// In component
const cm = useRef(null);
const items = [
  { label: 'Edit', icon: 'pi pi-pencil', command: () => handleEdit() },
  { label: 'Delete', icon: 'pi pi-trash', command: () => handleDelete() }
];

// In JSX
<ContextMenu model={items} ref={cm} breakpoint="767px" />
<img
  src="/images/nature/nature3.jpg"
  alt="Logo"
  className="max-w-full"
  onContextMenu={(e) => cm.current.show(e)}
/>
```

### Document-Global Menu
```jsx
<ContextMenu global model={items} breakpoint="767px" />
```

### With Item Templates
```jsx
const products = [
  { id: 1, name: 'Product 1', category: 'Electronics', price: '$99', image: 'product1.jpg' }
];

const items = [
  { label: 'View Details', command: () => handleView() },
  { label: 'Add to Cart', command: () => handleAdd() }
];

// In JSX
<ul className="m-0 p-0 list-none border-1 surface-border border-round p-3 flex flex-column gap-2 w-full md:w-30rem">
  {products.map((product) => (
    <li
      key={product.id}
      className={`p-2 hover:surface-hover border-round border-1 border-transparent transition-all transition-duration-200 ${selectedId === product.id && 'border-primary'}`}
      onContextMenu={(e) => onRightClick(e, product.id)}
    >
      <div className="flex flex-wrap p-2 align-items-center gap-3">
        <img
          className="w-4rem shadow-2 flex-shrink-0 border-round"
          src={`/images/product/${product.image}`}
          alt={product.name}
        />
        <div className="flex-1 flex flex-column gap-1">
          <span className="font-bold">{product.name}</span>
          <div className="flex align-items-center gap-2">
            <i className="pi pi-tag text-sm"></i>
            <span>{product.category}</span>
          </div>
        </div>
        <span className="font-bold text-900 ml-5">{product.price}</span>
      </div>
    </li>
  ))}
</ul>
<ContextMenu
  model={items}
  ref={cm}
  breakpoint="767px"
  onHide={() => setSelectedId(undefined)}
/>
```

### With Command Callbacks
```jsx
const users = [
  { id: 1, name: 'John Doe', role: 'Admin', image: 'johndoe.png' }
];

const onRightClick = (event, user) => {
  setSelectedUser(user);
  cm.current.show(event);
};

const items = [
  {
    label: 'View Profile',
    command: () => {
      toast.current.show({
        severity: 'info',
        summary: 'Profile',
        detail: `Viewing ${selectedUser.name}`
      });
    }
  },
  {
    label: 'Send Message',
    command: () => {
      toast.current.show({
        severity: 'success',
        summary: 'Message',
        detail: `Sending message to ${selectedUser.name}`
      });
    }
  }
];

// In JSX
<ul className="m-0 p-0 list-none border-1 surface-border border-round p-3 flex flex-column gap-2 w-full md:w-30rem">
  {users.map((user) => (
    <li
      key={user.id}
      className={`p-2 hover:surface-hover border-round border-1 border-transparent transition-all transition-duration-200 flex align-items-center justify-content-between ${selectedUser?.id === user.id && 'border-primary'}`}
      onContextMenu={(event) => onRightClick(event, user)}
    >
      <div className="flex align-items-center gap-2">
        <img
          alt={user.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${user.image}`}
          style={{ width: '32px' }}
        />
        <span className="font-bold">{user.name}</span>
      </div>
      <Tag value={user.role} severity={getBadge(user)} />
    </li>
  ))}
</ul>
<ContextMenu
  ref={cm}
  model={items}
  onHide={() => setSelectedUser(undefined)}
/>
<Toast ref={toast} />
```

### With Router Integration
```jsx
const items = [
  {
    label: 'Navigate to Docs',
    command: () => {
      window.location.href = '/documentation';
    }
  },
  {
    label: 'External Link',
    url: 'https://example.com'
  }
];

<span
  className="inline-flex align-items-center justify-content-center border-2 border-primary border-round w-4rem h-4rem"
  onContextMenu={(event) => onRightClick(event)}
  aria-haspopup="true"
>
  <img
    alt="logo"
    src="https://primefaces.org/cdn/primereact/images/logo.png"
    height="40"
  />
</span>
<ContextMenu model={items} ref={cm} />
```

### DataTable Integration
```jsx
// Reference mentioned - used for row context menus
// Complete example not provided in docs
<DataTable value={products} contextMenuSelection={selectedProduct} onContextMenuSelectionChange={(e) => setSelectedProduct(e.value)}>
  {/* columns */}
</DataTable>
<ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedProduct(null)} />
```

## Styling Approaches

### CSS Classes
PrimeReact uses its design system CSS classes:
- Utility classes: `flex`, `gap-2`, `p-3`, `m-0`, `border-1`, `border-round`
- Surface tokens: `surface-border`, `surface-hover`
- State classes: `hover:surface-hover`
- Responsive classes: `md:w-30rem`, `md:justify-content-center`

### Component Styling
- Uses PrimeReact's theming system
- Supports `className` and `style` props (standard pattern)
- Design tokens for colors, spacing, borders
- Responsive utilities via breakpoint prop

### Icon System
Uses PrimeIcons:
- `pi pi-pencil` - edit icon
- `pi pi-trash` - delete icon
- `pi pi-tag` - tag icon
- Applied via `icon` property on menu items

## Accessibility Patterns

### Screen Reader Support
- **Role**: `menubar` with `aria-orientation="vertical"`
- **Item roles**:
  - `presentation` for list items
  - `menuitem` for interactive anchors
- **Attributes**:
  - `aria-labelledby` for labeling
  - `aria-disabled` for disabled items
  - `aria-haspopup` for submenu indicators

### Keyboard Navigation
| Key | Action |
|-----|--------|
| Tab | Closes menu and moves focus to next focusable element |
| Enter | Toggles submenu or activates menu item |
| Space | Toggles submenu or activates menu item |
| Escape | Closes the menu |
| Down Arrow | Moves focus to next menu item |
| Up Arrow | Moves focus to previous menu item |
| Right Arrow | Opens submenu |
| Left Arrow | Closes submenu |
| Home | Moves focus to first menu item |
| End | Moves focus to last menu item |

### Focus Management
- Menu closes on Tab, returning focus to next element
- Arrow key navigation between items
- Submenu navigation with right/left arrows

## Composition Patterns

### Item Customization
Items support custom templates for complex rendering:
```jsx
const items = [
  {
    template: (item, options) => (
      <div className="custom-item">
        <img src={item.image} alt={item.label} />
        <span>{item.label}</span>
        <span className="badge">{item.badge}</span>
      </div>
    )
  }
];
```

### Hierarchical Menus
Submenus via nested items:
```jsx
const items = [
  {
    label: 'File',
    items: [
      { label: 'New', command: () => {} },
      { label: 'Open', command: () => {} }
    ]
  }
];
```

### Integration with Other Components
- Works with DataTable for row context menus
- Integrates with Toast for notifications
- Combines with Tag for status display
- Can be used with router for navigation

## Notable Features

### Responsive Design
- Breakpoint prop allows layout adjustment at specific screen sizes
- Utility class system supports responsive behavior
- Mobile-friendly touch interactions

### Positioning System
- Automatically positions at cursor location
- Uses event coordinates from right-click
- Handles viewport boundaries (implicit)

### Event Integration
- Standard `onContextMenu` event handling
- Programmatic control via `show()` method
- Hide callback for state cleanup

### Flexibility
- Can be attached to any element or document
- Supports custom rendering via templates
- Works with both callback-based and router-based navigation

### DataTable Integration
- Special integration for table row context menus
- Selection state management
- Coordinated with table component

## Research Notes

### Documentation Structure
- Examples-driven documentation
- Code samples provided for each pattern
- Accessibility documentation included
- API reference table not fully visible in extracted content

### Design Philosophy
- Follows PrimeReact's comprehensive component model
- Emphasizes flexibility through templates
- Strong accessibility support with ARIA and keyboard navigation
- Integration-focused (works well with other PrimeReact components)

### Implementation Characteristics
- Requires ref for programmatic control
- Model-based API (items array)
- Event-driven activation
- Automatic positioning and viewport management
- Responsive by default with breakpoint control

### Version Notes
- Current version: 10.9.7
- React-specific implementation
- Part of PrimeReact component suite
- Uses PrimeIcons for icon system
