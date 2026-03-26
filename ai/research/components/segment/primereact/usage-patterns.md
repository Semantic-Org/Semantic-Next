# PrimeReact - Panel Usage Patterns

## Component URLs
- **Main**: https://primereact.org/panel/
- **Status**: ✅ Accessible

## Documentation Quality
Good - Comprehensive documentation with API reference, code examples, and accessibility information. Clear distinction from Card component. Well-documented collapsible functionality.

## Component Definition
- **Core purpose**: Content container with optional header and collapsible functionality. Serves as PrimeReact's Segment equivalent for grouping related content.
- **Mental model**: A bordered container component that provides content organization with optional header text, custom header templates, and unique toggle/collapse capability among segment-equivalent components.
- **Semantic meaning**: Groups and organizes related content with visual boundary. Header provides section identification. Collapsible feature allows progressive disclosure of content.

## Container Patterns

### Basic Container
| Pattern | Support Level | Details |
|---------|--------------|---------|
| Basic panel | ✅ Full | Simple container with children content |
| Header support | ✅ Full | `header` prop for text-based headers |
| Footer support | ✅ Full | `footerTemplate` prop for custom footers |
| Bordered container | ✅ Full | Visual boundary around content |

### Visual Structure
```jsx
// Basic panel structure
<Panel header="Header Text">
  <p>Panel content goes here</p>
</Panel>
```

## Content Patterns

### Content Areas
| Pattern | Support Level | Details |
|---------|--------------|---------|
| Children content | ✅ Full | Main panel body via children prop |
| Header text | ✅ Full | Simple text via `header` string prop |
| Header template | ✅ Full | Custom JSX via `headerTemplate` function prop |
| Footer template | ✅ Full | Custom JSX via `footerTemplate` function prop |
| Icon support | ✅ Full | Icons in header via templates |

### Header Customization
| Pattern | Support Level | Details |
|---------|--------------|---------|
| Text headers | ✅ Full | Direct string prop: `header="Title"` |
| Template headers | ✅ Full | `headerTemplate` receives callback with toggle control options |
| Custom icons | ✅ Full | Include icons in headerTemplate JSX |
| Dynamic headers | ✅ Full | Templates allow conditional rendering |

## Interactive Patterns

### Collapsible Functionality (Unique Feature)
| Pattern | Support Level | Details |
|---------|--------------|---------|
| Toggleable | ✅ Full | `toggleable` boolean prop enables collapse |
| Controlled state | ✅ Full | `collapsed` prop with `onToggle` event for controlled mode |
| Uncontrolled state | ✅ Full | Simple `toggleable` without state management |
| Toggle button | ✅ Full | Built-in button in header when toggleable |
| Icons | ✅ Full | Toggle icons for expand/collapse states |

**Unique Among Segment Equivalents**: Panel is the only major segment-like component across frameworks (MUI Paper, Chakra Box, etc.) that provides built-in collapsible functionality. This makes it a hybrid between a pure container and an interactive disclosure widget.

### State Management
| Pattern | Support Level | Details |
|---------|--------------|---------|
| Uncontrolled | ✅ Full | `<Panel toggleable>` - panel manages own state |
| Controlled | ✅ Full | `collapsed={bool} onToggle={(e) => {}}` - parent controls |
| Initial state | ✅ Full | Set `collapsed` prop for initial collapsed state |

## Variation Patterns

### Visual Variants
| Pattern | Support Level | Details |
|---------|--------------|---------|
| Size variants | ❌ None | No built-in size props (use className/style) |
| Color variants | ❌ None | No status-based colors like Alert components |
| Style variants | ❌ None | No variant prop (bordered style is default) |
| Custom styling | ✅ Full | `className`, `style` props for customization |

**Note**: Panel focuses on container functionality rather than visual variants. Styling is achieved through CSS classes and inline styles.

## Styling Patterns

### Styling Options
| Pattern | Support Level | Details |
|---------|--------------|---------|
| className prop | ✅ Full | Apply custom CSS classes to root element |
| style prop | ✅ Full | Inline styles via object |
| headerClassName | ✅ Full | Target header specifically |
| headerStyle | ✅ Full | Inline styles for header |
| contentClassName | ✅ Full | Target content area specifically |
| contentStyle | ✅ Full | Inline styles for content |
| Template styling | ✅ Full | Full control via headerTemplate/footerTemplate |

### CSS Parts
PrimeReact uses CSS class-based styling rather than CSS parts:
- `.p-panel` - Root container
- `.p-panel-header` - Header section
- `.p-panel-title` - Title text
- `.p-panel-icons` - Icon container in header
- `.p-panel-content` - Content area
- `.p-panel-footer` - Footer section (when used)

## Code Examples

### Basic Panel
```jsx
import { Panel } from 'primereact/panel';

// Simple panel with header
<Panel header="Panel Header">
  <p>Panel content goes here</p>
</Panel>
```

### Toggleable Panel (Uncontrolled)
```jsx
// Panel manages its own collapsed state
<Panel header="Collapsible Panel" toggleable>
  <p>Content can be shown/hidden</p>
</Panel>
```

### Toggleable Panel (Controlled)
```jsx
import { Panel } from 'primereact/panel';
import { useState } from 'react';

function ControlledPanel() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Panel
      header="Controlled Panel"
      toggleable
      collapsed={collapsed}
      onToggle={(e) => setCollapsed(e.value)}
    >
      <p>Content visibility controlled by parent state</p>
    </Panel>
  );
}
```

### Custom Header Template
```jsx
import { Panel } from 'primereact/panel';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

function CustomHeaderPanel() {
  const headerTemplate = (options) => {
    const toggleIcon = options.collapsed
      ? 'pi pi-chevron-down'
      : 'pi pi-chevron-up';
    const className = `${options.className} justify-content-start`;
    const titleClassName = `${options.titleClassName} ml-2`;

    return (
      <div className={className}>
        <Avatar
          image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
          size="normal"
          shape="circle"
        />
        <span className={titleClassName}>Amy Elsner</span>
        <Badge value="3" className="ml-auto mr-2" />
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
        </button>
      </div>
    );
  };

  return (
    <Panel headerTemplate={headerTemplate} toggleable>
      <p>Panel with custom header including avatar and badge</p>
    </Panel>
  );
}
```

### Custom Footer Template
```jsx
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';

function PanelWithFooter() {
  const footerTemplate = (options) => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="flex align-items-center gap-2">
          <Button icon="pi pi-user" rounded text />
          <Button icon="pi pi-bookmark" severity="secondary" rounded text />
        </div>
        <span className="p-text-secondary">Updated 2 hours ago</span>
      </div>
    );
  };

  return (
    <Panel header="Panel with Footer" footerTemplate={footerTemplate}>
      <p>Panel content with custom footer</p>
    </Panel>
  );
}
```

### Styled Panel
```jsx
// Using className for styling
<Panel
  header="Custom Styled Panel"
  className="custom-panel"
  headerClassName="custom-header"
  contentClassName="custom-content"
>
  <p>Panel with custom CSS classes</p>
</Panel>

// Using inline styles
<Panel
  header="Inline Styled Panel"
  style={{ borderColor: '#3B82F6', borderWidth: '2px' }}
  headerStyle={{ backgroundColor: '#EFF6FF', color: '#1E40AF' }}
  contentStyle={{ padding: '2rem' }}
>
  <p>Panel with inline styles</p>
</Panel>
```

### Initially Collapsed Panel
```jsx
// Panel starts collapsed
<Panel header="Initially Collapsed" toggleable collapsed={true}>
  <p>This content starts hidden</p>
</Panel>
```

## API Reference

### Panel Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| header | string | null | Header text of the panel |
| toggleable | boolean | false | Enables toggle/collapse functionality |
| collapsed | boolean | false | Collapsed state (controlled mode) |
| onExpand | function | null | Callback fired when panel expands |
| onCollapse | function | null | Callback fired when panel collapses |
| onToggle | function | null | Callback fired on toggle (e.value contains collapsed state) |
| headerTemplate | function | null | Custom header template function |
| footerTemplate | function | null | Custom footer template function |
| icons | ReactNode | null | Custom icons in header |
| className | string | null | CSS class for root element |
| style | object | null | Inline styles for root element |
| headerClassName | string | null | CSS class for header |
| headerStyle | object | null | Inline styles for header |
| contentClassName | string | null | CSS class for content |
| contentStyle | object | null | Inline styles for content |
| transitionOptions | object | null | Transition configuration for collapse/expand |

### Template Callback Options
**headerTemplate** receives options object:
- `className` - Default header class
- `titleClassName` - Default title class
- `togglerClassName` - Default toggler button class
- `onTogglerClick` - Function to call on toggle
- `collapsed` - Current collapsed state

**footerTemplate** receives options object:
- `className` - Default footer class

## Accessibility

### Keyboard Support
| Key | Function |
|-----|----------|
| Tab | Moves focus to next focusable element |
| Shift+Tab | Moves focus to previous focusable element |
| Enter | Toggles panel content when toggle button focused |
| Space | Toggles panel content when toggle button focused |

### ARIA Attributes
| Attribute | Description |
|-----------|-------------|
| aria-controls | Toggle button references content area ID |
| aria-expanded | Indicates current expanded/collapsed state |
| role | Appropriate roles for semantic structure |

### Screen Reader Support
- Toggle button announces current state (expanded/collapsed)
- Header text announced for section identification
- Content region properly labeled and associated with toggle control

## Notable Features

### Unique Collapsible Capability
- **Industry standout**: Unlike most segment/container components (MUI Paper, Chakra Box, etc.), Panel provides built-in collapsible functionality
- **Dual mode**: Supports both controlled and uncontrolled state management
- **Accessibility**: Full keyboard support and ARIA attributes for toggle behavior
- **Animation**: Smooth collapse/expand transitions via transitionOptions
- **Icon integration**: Built-in toggle icons that reflect current state

### Template System Flexibility
- **Header customization**: headerTemplate provides full control over header layout
- **Footer support**: footerTemplate enables actions, metadata, or additional content
- **Callback parameters**: Template functions receive helpful options for building toggleable headers
- **Component composition**: Templates can include any PrimeReact components (Avatar, Badge, Button, etc.)
- **State access**: Templates have access to collapsed state for conditional rendering

### Styling Architecture
- **Multiple targets**: Separate className/style props for root, header, and content
- **CSS class-based**: Uses BEM-like naming (.p-panel, .p-panel-header, etc.)
- **Template styling**: Full control over template markup and classes
- **PrimeFlex integration**: Works with PrimeFlex utility classes
- **Theme compatibility**: Integrates with PrimeReact theme system

### Panel vs Card Distinction
According to PrimeReact's organization:
- **Panel**: Container with header and optional collapsible functionality
- **Card**: Simpler container focused on content display, typically with title/subtitle/actions
- **Use Panel when**: Need collapsible sections, header customization, or content organization
- **Use Card when**: Displaying discrete content units (products, user profiles, etc.)

Panel is more interactive and structured, while Card is more presentational.

## Research Notes

### Documentation Quality
- ✅ Clear API reference with all props documented
- ✅ Multiple code examples covering common use cases
- ✅ Accessibility section with keyboard and ARIA details
- ✅ Template system well-explained with callback parameters
- ✅ Integration examples with other PrimeReact components

### Framework Approach Observations

**Component Philosophy**:
- **Container-first**: Focuses on content organization rather than visual variants
- **Progressive enhancement**: Basic usage is simple, advanced features available when needed
- **Template flexibility**: Powerful template system for customization
- **Controlled/uncontrolled duality**: Supports both state management patterns
- **Accessibility focus**: Built-in keyboard support and ARIA attributes

**React Integration**:
- Standard React component with props
- Event callbacks for state changes (onToggle, onExpand, onCollapse)
- Template functions receive helpful options
- Works with React hooks for controlled mode
- Composable with other PrimeReact components

**Styling Strategy**:
- CSS class-based rather than CSS-in-JS
- Multiple styling targets (root, header, content)
- Theme system integration
- PrimeFlex utility class support
- No built-in visual variants (relies on custom styling)

**Collapsible Implementation**:
- Toggle button integrated into header
- Smooth transitions via transitionOptions
- Icons automatically swap based on state
- Full accessibility support
- Both controlled and uncontrolled modes

### Implementation Patterns

**State Management Approaches**:
```jsx
// Uncontrolled (Panel manages state)
<Panel toggleable>Content</Panel>

// Controlled (Parent manages state)
const [collapsed, setCollapsed] = useState(false);
<Panel
  toggleable
  collapsed={collapsed}
  onToggle={(e) => setCollapsed(e.value)}
>
  Content
</Panel>
```

**Template Pattern**:
```jsx
// Templates receive options for building interactive headers
const headerTemplate = (options) => (
  <div className={options.className}>
    {/* Custom content */}
    <button
      className={options.togglerClassName}
      onClick={options.onTogglerClick}
    >
      <i className={options.collapsed ? 'pi-chevron-down' : 'pi-chevron-up'} />
    </button>
  </div>
);
```

**Styling Pattern**:
```jsx
// Multiple styling points
<Panel
  className="root-class"
  style={{ border: '2px solid' }}
  headerClassName="header-class"
  headerStyle={{ background: '#f0f0f0' }}
  contentClassName="content-class"
  contentStyle={{ padding: '2rem' }}
>
  Content
</Panel>
```

### Comparison Points for Semantic UI

**Strengths to Consider**:
- ✅ **Unique collapsible feature**: Distinguishes Panel from basic containers
- ✅ **Template system**: Powerful headerTemplate/footerTemplate pattern
- ✅ **Dual state modes**: Both controlled and uncontrolled patterns supported
- ✅ **Granular styling**: Separate props for root, header, content
- ✅ **Accessibility**: Full keyboard support and ARIA attributes
- ✅ **Event callbacks**: Separate onExpand, onCollapse, onToggle events
- ✅ **Icon customization**: Custom icons via template system
- ✅ **Smooth animations**: Configurable transitions

**Potential Improvements**:
- ⚠️ **No visual variants**: Lacks status-based colors or size variants
- ⚠️ **No slot API**: Uses template functions instead of slots
- ⚠️ **Limited elevation**: No built-in elevation/shadow variants
- ⚠️ **No loading state**: No built-in loading indicator support
- ⚠️ **Template complexity**: headerTemplate pattern is powerful but verbose
- ⚠️ **No icon prop**: Icons require template rather than simple prop

**Alignment with Web Standards**:
- React component (not web component)
- JSX-based templates (not slots)
- CSS class-based styling (not CSS parts/custom properties)
- Could benefit from custom element approach
- Template functions less declarative than slot-based patterns
- ARIA attributes properly implemented

**Semantic UI Implementation Ideas**:
1. **Segment with collapsible**: Consider adding optional collapsible feature to ui-segment
2. **Template pattern**: Evaluate template function pattern vs slot-based approach
3. **Controlled/uncontrolled**: Support both state management patterns
4. **Granular styling**: Multiple styling targets (header, content, footer)
5. **Accessibility**: Ensure keyboard support and ARIA attributes for toggleable variant
6. **Event granularity**: Separate expand/collapse events in addition to toggle
7. **Animation control**: Configurable transition options

### Cross-Framework Pattern Analysis

**Panel/Segment Terminology**:
- **PrimeReact**: "Panel" - interactive container with collapse
- **MUI**: "Paper" - static surface container (no collapse)
- **Chakra**: "Box" - general container (no collapse)
- **Ant Design**: "Card" - content container, "Collapse" - separate component
- **Semantic UI Classic**: "Segment" - content container (no built-in collapse)

**Collapsible Containers**:
- **PrimeReact Panel**: Built-in toggleable feature
- **MUI Accordion**: Separate component for collapsible sections
- **Chakra Accordion**: Separate component
- **Ant Design Collapse**: Separate component
- **Bootstrap Card**: No built-in collapse (requires Collapse component)

**Unique Position**: PrimeReact Panel is unusual in combining container + collapsible in one component. Most frameworks separate these concerns (Container component + Accordion/Collapse component).

**Template Systems**:
- **PrimeReact**: Template function props (headerTemplate, footerTemplate)
- **Ant Design**: Render prop pattern
- **MUI**: Component composition (CardHeader, CardContent, CardActions)
- **Chakra**: Component composition (Box with children)
- **Semantic UI**: Could use slot-based approach with web components

**Styling Patterns**:
- **PrimeReact**: Multiple className/style props for parts
- **MUI**: sx prop and component-specific props
- **Chakra**: Style props (borderColor, bg, etc.)
- **Ant Design**: className and style props
- **Semantic UI**: Could use CSS parts for web component styling

### Design Decisions for Semantic UI Segment

**Should Segment be collapsible?**
- **Pro**: Matches PrimeReact Panel feature
- **Pro**: Useful for progressive disclosure
- **Con**: Most frameworks separate container from collapsible
- **Recommendation**: Make collapsible optional via prop, maintain simple container as default

**Template vs Slot API**:
- **Template function** (PrimeReact): Powerful but verbose, React-specific
- **Slot API** (Web Components): More declarative, standards-based
- **Recommendation**: Use slot-based approach for header/footer customization

**Styling approach**:
- **Multiple props** (PrimeReact): Granular control but many props
- **CSS parts** (Web Components): Standards-based, theme-friendly
- **Recommendation**: Use CSS parts (::part(header), ::part(content))

**State management**:
- Support both controlled and uncontrolled modes (good pattern from PrimeReact)
- Use properties for controlled mode (collapsed, onToggle via events)
- Use settings for behavior configuration

**Event design**:
- Consider separate expand/collapse events
- Or single toggle event with state in detail
- Align with Semantic UI event patterns
