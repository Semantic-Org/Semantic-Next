# PrimeReact - TabView Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primereact.org/tabview/
Status: ✅ Working
Version: v8 (PrimeReact v8)
Last Verified: 2025-11-05

## Documentation Quality
Excellent - The documentation provides comprehensive examples with live demos, clear prop tables, keyboard navigation details, and accessibility features. Covers all common use cases and advanced patterns well. WAI-ARIA compliance is documented.

## Component Definition
- **Core purpose**: A container component for organizing and displaying content within multiple named tabs. Uses a TabView parent component with TabPanel children to create an accessible, keyboard-navigable tabbed interface with support for scrolling, dynamic content, and customizable headers.
- **Mental model**: A parent-child component system where TabView manages the active tab state and TabPanel defines individual tab headers and content panels. The active tab is controlled either automatically (by click) or through props (controlled component pattern).
- **Semantic meaning**: Represents a content organization pattern for related but separate sections of information. Allows users to switch between different views without leaving the context of the parent component. Primary interaction is tab selection through clicking or keyboard navigation.

## Pattern Support Levels
- **Native**: Dedicated prop/API with automatic functionality
- **Composed**: Via composition/children or templating
- **CSS-only**: Requires custom styling or className
- **Event-driven**: Requires event handler implementation

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text header | ✅ | Native | `header` prop on TabPanel for simple text headers |
| Icon + text | ✅ | Native | `leftIcon` and/or `rightIcon` props combined with `header` text |
| Icon left | ✅ | Native | `leftIcon` prop adds icon before header text (PrimeIcons classes) |
| Icon right | ✅ | Native | `rightIcon` prop adds icon after header text |
| Icon both sides | ✅ | Native | Both `leftIcon` and `rightIcon` props on same TabPanel |
| Custom header template | ✅ | Composed | `headerTemplate` prop accepts render function for complete control |
| Closable tabs | ✅ | Native | `closable` boolean prop shows close button in header |
| Disabled content | ✅ | Native | `disabled` boolean prop on TabPanel prevents interaction |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default tabs | ✅ | Native | Standard tab appearance with no special styling |
| Scrollable tabs | ✅ | Native | `scrollable` prop on TabView enables horizontal scrolling with navigation buttons when tabs exceed width |
| Controlled tabs | ✅ | Native | `activeIndex` prop + `onTabChange` event for programmatic control |
| Dynamic tabs | ✅ | Composed | Using JavaScript loops/map to generate TabPanels dynamically |
| Static tabs | ✅ | Native | Direct JSX definition of TabPanels |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Active tab tracking | ✅ | Native | `activeIndex` prop indicates which tab is active (0-indexed) |
| Disabled state | ✅ | Native | `disabled` prop on TabPanel prevents clicking that tab |
| Closable state | ✅ | Native | `closable` prop displays close button; click removes tab from view |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Icon positioning | ✅ | Native | `leftIcon` for left positioning, `rightIcon` for right positioning |
| Header styling | ✅ | CSS-only | `headerClassName` prop applies custom CSS classes to header |
| Scrollable layout | ✅ | Native | `scrollable` boolean prop enables scrolling tabs with navigation arrows |
| Closable tabs | ✅ | Native | `closable` boolean prop on TabPanel adds close icon to header |
| Custom headers | ✅ | Composed | `headerTemplate` prop with render function for complete customization |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click activation | ✅ | Native | Clicking tab header activates that tab automatically |
| Keyboard navigation | ✅ | Native | Arrow keys, Home/End navigate between tabs; Enter/Space activates |
| Tab change event | ✅ | Native | `onTabChange` event fires when active tab changes (controlled or uncontrolled) |
| Close tab action | ✅ | Native | Clicking close icon on closable tabs triggers `onTabChange` with updated active index |
| Focus management | ✅ | Native | Proper ARIA focus handling; focuses active tab header on keyboard nav |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA roles | ✅ | Native | `role="tablist"` on container, `role="tab"` on headers, `role="tabpanel"` on content |
| ARIA attributes | ✅ | Native | `aria-selected`, `aria-controls`, `aria-labelledby`, `aria-disabled` properly set |
| Keyboard navigation | ✅ | Native | Arrow keys, Home/End, Enter, Space fully supported |
| Focus visibility | ✅ | Native | Proper focus management with visible focus indicators |

## Code Examples

### Basic Usage
```jsx
// Simple TabView with three static tabs
<TabView>
    <TabPanel header="Header I">
        <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
    </TabPanel>
    <TabPanel header="Header II">
        <p className="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium.
        </p>
    </TabPanel>
    <TabPanel header="Header III">
        <p className="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti.
        </p>
    </TabPanel>
</TabView>
```

### Controlled TabView
```jsx
function ControlledTabs() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div>
            <div className="flex mb-2 gap-2 justify-content-end">
                <Button onClick={() => setActiveIndex(0)} label="Tab 1" />
                <Button onClick={() => setActiveIndex(1)} label="Tab 2" />
                <Button onClick={() => setActiveIndex(2)} label="Tab 3" />
            </div>
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Tab 1">Content 1</TabPanel>
                <TabPanel header="Tab 2">Content 2</TabPanel>
                <TabPanel header="Tab 3">Content 3</TabPanel>
            </TabView>
        </div>
    );
}
```

### Scrollable Tabs
```jsx
// When tab count or header width exceeds container width,
// horizontal scrolling buttons appear automatically
<TabView scrollable>
    <TabPanel header="Header I">
        <p className="m-0">Lorem ipsum...</p>
    </TabPanel>
    <TabPanel header="Header II">
        <p className="m-0">Sed ut perspiciatis...</p>
    </TabPanel>
    <TabPanel header="Header III">
        <p className="m-0">At vero eos...</p>
    </TabPanel>
    <TabPanel header="Header IV">
        <p className="m-0">Quisque sed erat...</p>
    </TabPanel>
    <TabPanel header="Header V">
        <p className="m-0">Lorem ipsum dolor...</p>
    </TabPanel>
</TabView>
```

### Dynamic Tabs (Map-Generated)
```jsx
function DynamicTabs() {
    const tabs = [
        { id: 1, title: 'Users', content: 'User management content' },
        { id: 2, title: 'Settings', content: 'Settings configuration content' },
        { id: 3, title: 'Reports', content: 'Reports and analytics content' }
    ];

    return (
        <TabView>
            {tabs.map((tab) => (
                <TabPanel key={tab.id} header={tab.title}>
                    <p className="m-0">{tab.content}</p>
                </TabPanel>
            ))}
        </TabView>
    );
}
```

### Disabled Tabs
```jsx
<TabView>
    <TabPanel header="Header I">
        <p className="m-0">This tab is enabled and clickable</p>
    </TabPanel>
    <TabPanel header="Header IV" disabled>
        <p className="m-0">This tab is disabled and cannot be clicked</p>
    </TabPanel>
    <TabPanel header="Header V">
        <p className="m-0">This tab is enabled again</p>
    </TabPanel>
</TabView>
```

### Header Icons
```jsx
<TabView>
    <TabPanel header="Users" leftIcon="pi pi-users mr-2">
        <p className="m-0">User management content here</p>
    </TabPanel>
    <TabPanel header="Settings" rightIcon="pi pi-cog ml-2">
        <p className="m-0">Settings configuration here</p>
    </TabPanel>
    <TabPanel header="Reports" leftIcon="pi pi-chart-bar mr-2" rightIcon="pi pi-check ml-2">
        <p className="m-0">Reports and analytics here</p>
    </TabPanel>
</TabView>
```

### Closable Tabs
```jsx
function ClosableTabs() {
    const [tabs, setTabs] = useState([
        { id: 1, header: 'Tab 1', content: 'Content 1' },
        { id: 2, header: 'Tab 2', content: 'Content 2' },
        { id: 3, header: 'Tab 3', content: 'Content 3' }
    ]);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleTabClose = (e) => {
        const newTabs = tabs.filter((_, index) => index !== e.index);
        setTabs(newTabs);
        // Adjust active index if closed tab was active
        if (e.index <= activeIndex && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    return (
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            {tabs.map((tab, index) => (
                <TabPanel
                    key={tab.id}
                    header={tab.header}
                    closable
                    onClose={() => handleTabClose({ index })}
                >
                    <p className="m-0">{tab.content}</p>
                </TabPanel>
            ))}
        </TabView>
    );
}
```

### Custom Header Templates
```jsx
function CustomHeaders() {
    const tab1HeaderTemplate = (options) => {
        return (
            <span className="flex align-items-center gap-2">
                <i className="pi pi-calendar"></i>
                <span>Dates</span>
            </span>
        );
    };

    const tab2HeaderTemplate = (options) => {
        return (
            <span className="flex align-items-center gap-2">
                <span className="font-bold">Important</span>
                <span className="p-badge p-badge-danger">5</span>
            </span>
        );
    };

    return (
        <TabView>
            <TabPanel headerTemplate={tab1HeaderTemplate}>
                <p className="m-0">Calendar content here</p>
            </TabPanel>
            <TabPanel headerTemplate={tab2HeaderTemplate}>
                <p className="m-0">Important items content here</p>
            </TabPanel>
        </TabView>
    );
}
```

### Header Styling
```jsx
<TabView>
    <TabPanel header="Profile" headerClassName="flex align-items-center gap-2">
        <p className="m-0">User profile content</p>
    </TabPanel>
    <TabPanel header="Settings" headerClassName="bg-blue-500 text-white">
        <p className="m-0">Settings content</p>
    </TabPanel>
    <TabPanel header="Notifications" headerClassName="font-bold">
        <p className="m-0">Notifications content</p>
    </TabPanel>
</TabView>
```

### Event Handling
```jsx
function TabEventHandling() {
    const [activeTab, setActiveTab] = useState(0);
    const [log, setLog] = useState([]);

    const handleTabChange = (e) => {
        const message = `Switched to tab ${e.index}`;
        setActiveTab(e.index);
        setLog(prev => [...prev, message]);
    };

    return (
        <div>
            <TabView activeIndex={activeTab} onTabChange={handleTabChange}>
                <TabPanel header="Tab 1">Content 1</TabPanel>
                <TabPanel header="Tab 2">Content 2</TabPanel>
                <TabPanel header="Tab 3">Content 3</TabPanel>
            </TabView>
            <div className="mt-4">
                <h4>Events Log:</h4>
                <ul>
                    {log.map((entry, i) => <li key={i}>{entry}</li>)}
                </ul>
            </div>
        </div>
    );
}
```

### Combined Features
```jsx
function AdvancedTabView() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [tabs, setTabs] = useState([
        { id: 1, header: 'Dashboard', icon: 'pi pi-home', content: 'Dashboard content' },
        { id: 2, header: 'Users', icon: 'pi pi-users', content: 'Users content' },
        { id: 3, header: 'Settings', icon: 'pi pi-cog', closable: true, content: 'Settings content' }
    ]);

    const handleRemoveTab = (index) => {
        const newTabs = tabs.filter((_, i) => i !== index);
        setTabs(newTabs);
        if (index <= activeIndex && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    return (
        <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            scrollable
        >
            {tabs.map((tab, index) => (
                <TabPanel
                    key={tab.id}
                    header={tab.header}
                    leftIcon={tab.icon ? `${tab.icon} mr-2` : undefined}
                    closable={tab.closable}
                    disabled={false}
                    headerClassName="flex align-items-center"
                    onClose={() => handleRemoveTab(index)}
                >
                    <p className="m-0">{tab.content}</p>
                </TabPanel>
            ))}
        </TabView>
    );
}
```

## Notable Features

### 1. **Automatic Scrolling with Navigation Buttons**
The `scrollable` prop enables horizontal scrolling with navigation arrow buttons that automatically appear when tabs exceed the container width. This prevents layout breaking with many tabs.

### 2. **Icon Support with Positioning Control**
Icons are supported through `leftIcon` and `rightIcon` props, allowing placement on either side of the header text using standard PrimeIcons or custom CSS classes.

### 3. **Closable Tab Pattern**
The `closable` prop adds a close icon to individual tabs, enabling tab removal without custom implementation. Pairs well with state management for dynamic tab lists.

### 4. **Controlled and Uncontrolled Patterns**
Supports both patterns:
- **Uncontrolled**: TabView manages active state internally; `onTabChange` fires for notification
- **Controlled**: Parent manages `activeIndex` prop; must update in `onTabChange` handler

### 5. **Custom Header Templates**
The `headerTemplate` prop accepts a render function, enabling complete header customization beyond simple text/icon combinations. Receives options object with tab state information.

### 6. **Full ARIA Compliance**
Implements WAI-ARIA TabList pattern with proper roles (`tablist`, `tab`, `tabpanel`) and attributes (`aria-selected`, `aria-controls`, `aria-labelledby`, `aria-disabled`). Keyboard navigation fully supported.

### 7. **Flexible Tab Disabling**
Individual tabs can be disabled with the `disabled` prop on TabPanel, preventing interaction while keeping them visually present and accessible to screen readers.

### 8. **Header Styling Flexibility**
The `headerClassName` prop allows custom CSS classes on header elements without affecting header content structure or functionality.

## Research Notes

### Architecture Approach
PrimeReact TabView follows a **parent-child component architecture** where:
- TabView is the container managing active state and keyboard navigation
- TabPanel is a wrapper defining individual tabs with headers and content
- Props control behavior (scrollable, activeIndex, disabled)
- Templates enable customization without breaking core functionality

### Comparison with Other Frameworks
- **Similar to Chakra UI Tabs**: Compound component pattern with Tabs/TabList/TabPanel
- **Similar to MUI Tabs**: Controlled component pattern with activeIndex/onChange
- **Similar to Radix UI Tabs**: Native accessibility built-in, keyboard navigation automatic
- **More lightweight** than headless UI libraries; includes default styling via PrimeReact theme

### Strengths
1. Excellent keyboard navigation support out of the box
2. Full ARIA compliance for accessibility
3. Simple API with props for common patterns
4. Scrollable tabs handle many use cases elegantly
5. Close integration with PrimeReact ecosystem (icons, styling)
6. Both controlled and uncontrolled patterns supported
7. Custom header templates provide escape hatch for advanced layouts

### Limitations
1. TabPanel must be direct children of TabView (no wrapper components)
2. No lazy-loading pattern documented
3. Custom tab removal/reordering requires external state management
4. Limited animation control (no props for transition behavior)
5. Header must contain either text, template, or icons (no mixed content easily)
6. onClose handler (for closable tabs) has no direct API; must use state management

### Developer Experience
- **Discoverability**: Well-documented with comprehensive examples
- **Type Safety**: Good TypeScript support for props and events
- **Customization**: Templates provide powerful extension points
- **Learning Curve**: Moderate; compound component pattern is standard in React
- **Integration**: Seamless with PrimeReact theming and other components

### Common Patterns Observed

**1. Controlled Tabs with External Controls:**
```jsx
// Buttons outside TabView control which tab is active
const [activeIndex, setActiveIndex] = useState(0);
<Button onClick={() => setActiveIndex(1)} label="Go to Tab 2" />
```

**2. Dynamic Tab Lists:**
```jsx
// Tabs generated from data array, useful for configuration or settings pages
const [tabs, setTabs] = useState(initialTabs);
{tabs.map((tab, i) => <TabPanel key={tab.id}>{tab.content}</TabPanel>)}
```

**3. Closable Tab Management:**
```jsx
// Track active index when tabs close to prevent misalignment
if (closedTabIndex <= activeIndex) {
    setActiveIndex(Math.max(0, activeIndex - 1));
}
```

### Pattern Evolution Opportunity
Modern approaches might include:
- Lazy-loading content when tabs become active
- Drag-and-drop reordering support
- More granular animation control
- Built-in nested tab support
- Tab context provider for accessing tab state in deeply nested content

### Best Practices Identified
1. Always provide `onTabChange` handler when using controlled pattern
2. Use icons from PrimeIcons for visual consistency
3. Implement proper active index adjustment when removing closable tabs
4. Keep header templates simple; move complex logic to tab content
5. Use `scrollable` prop for layouts with potentially many tabs
6. Ensure header text is meaningful; icons alone may not be accessible enough
