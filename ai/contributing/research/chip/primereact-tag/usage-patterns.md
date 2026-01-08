# PrimeReact - Tag Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primereact.org/tag/
Status: ✅ Working
Version: Current
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear component documentation with API tables, live interactive examples, and code snippets. Well-defined props with visual demonstrations of all major features. Accessibility information included.

## Component Definition
- **Core purpose**: Categorize content through visual labels that organize and classify information within applications
- **Mental model**: A read-only label or category marker that provides metadata about content; typically inline or standalone element
- **Semantic meaning**: Communicates categorization, status, or attributes of content through color-coded visual indicators

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `severity="success"`)
- **Composed**: Via composition/children (e.g., `<Tag>{custom content}</Tag>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `value` prop for text labels |
| Icons | ✅ | Native | `icon` prop accepts Prime Icons class names (e.g., `"pi pi-user"`) |
| Avatars/Images | ✅ | Composed | Via children or template content |
| Close/Remove button | ❌ | N/A | No built-in close/remove functionality |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selectable/Active | ❌ | N/A | No interactive selection state |
| Disabled | ❌ | N/A | No disabled state (presentational component) |
| Loading | ❌ | N/A | No loading state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | `severity` prop: "success", "info", "warning", "danger", "secondary", "contrast" (plus default/primary) |
| Size options | ❌ | CSS-only | No predefined size prop; configurable via theming or custom styles |
| Visual variants | ✅ | Native | Standard rectangular (default) and pill shape via `rounded` boolean prop |
| Bordered/Borderless | ❌ | CSS-only | No dedicated border control; customizable via styling |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ❌ | N/A | No interactive elements documented; presentational component |
| Closable/Removable | ❌ | N/A | No close/remove functionality |
| onClick handler | ❌ | N/A | Not documented as interactive component |
| onClose handler | ❌ | N/A | Not applicable |

## Code Examples
```jsx
import { Tag } from 'primereact/tag';

// Basic tag
<Tag value="New" />

// With severity (color variant)
<Tag severity="success" value="Success" />
<Tag severity="info" value="Info" />
<Tag severity="warning" value="Warning" />
<Tag severity="danger" value="Danger" />
<Tag severity="secondary" value="Secondary" />
<Tag severity="contrast" value="Contrast" />

// With icon
<Tag icon="pi pi-user" value="User" />
<Tag icon="pi pi-check" severity="success" value="Approved" />

// Rounded pill shape
<Tag rounded value="Active" />
<Tag severity="success" value="Success" rounded icon="pi pi-check" />

// Custom styling
<Tag
  value="Custom"
  style={{ background: 'linear-gradient(to right, #667eea 0%, #764ba2 100%)' }}
/>

// With custom classes
<Tag className="custom-tag" value="Tagged" />

// Custom template content via children
<Tag>
  <span>Custom Content</span>
</Tag>

// Icon only with rounded style
<Tag icon="pi pi-check" severity="success" rounded />

// Accessibility with tab index
<Tag value="Accessible" tabIndex={0} />
```
[View Live](https://primereact.org/tag/)

## Notable Features

**Severity-Based Color System:**
- Provides seven semantic color variants through the `severity` prop
- Consistent color vocabulary: success, info, warning, danger, secondary, contrast, plus default
- Enables predictable theming across component families
- Maps semantic meaning to visual appearance

**Icon Integration:**
- Native `icon` prop for direct icon support
- Icons positioned adjacent to value text
- Accepts Prime Icons class names (e.g., `"pi pi-apple"`)
- Works seamlessly with rounded variant

**Dual Display Modes:**
- Standard rectangular for traditional labels
- Rounded pill style via simple boolean `rounded` prop
- Easy toggling between styles without CSS manipulation

**Content Flexibility:**
- Both `value` prop and children patterns supported
- Allows simple string values or complex composed content
- Template children for advanced customization
- Consistent with React composition patterns

**Accessibility Support:**
- Supports custom ARIA attributes
- `tabIndex` prop for keyboard navigation control
- Screen reader friendly

**Styling Flexibility:**
- `className` prop for custom CSS classes
- `style` prop for inline styles
- Supports gradient backgrounds and custom theming
- Integration with PrimeReact theme system

**Lightweight & Standalone:**
- No dependencies on other PrimeReact components
- Minimal API surface for simplicity
- Purely presentational (no state management)

## Research Notes

### Documentation Access
- Successfully accessed current documentation at primereact.org
- Documentation includes comprehensive API tables and live interactive examples
- Code samples provided for all major use cases
- Accessibility considerations documented

### Framework Approach Observations

**Presentational Focus:**
- Tag is explicitly a presentational, non-interactive component
- No built-in click, remove, or state management functionality
- Focused solely on visual categorization and labeling
- Clear separation from interactive Chip component

**Severity Pattern Consistency:**
- Seven-value severity vocabulary provides comprehensive semantic options
- Consistent with other PrimeReact components (Badge, Message, etc.)
- Primary/default serves as neutral baseline
- Secondary and contrast provide additional neutral options

**Styling Strategy:**
- Props-based for semantic variations (severity, icon, rounded)
- Class/style props for custom visual modifications
- Balance between convention and flexibility
- Theme-aware for consistent design system integration

**React Patterns:**
- Standard React prop conventions
- Children support for composition flexibility
- Boolean flags for binary states (`rounded`)
- String-based enums for variants (`severity`)

### Implementation Patterns

**Icon Positioning:**
- Icon as dedicated prop rather than composition slot
- Automatically positions adjacent to value text
- Straightforward API for common use case
- Reduces need for manual layout

**Shape Variants:**
- `rounded` boolean provides pill/capsule shape
- Simple API without multiple shape options
- Addresses modern design trend toward rounded elements
- Works consistently with all severity and icon combinations

**Content Handling:**
- Dual content pattern: `value` prop OR children
- `value` for simple string labels (common case)
- Children for complex custom content (advanced case)
- Progressive API complexity

**Theming Integration:**
- Severity values map to theme color palette
- Size controlled through theme configuration
- Spacing and typography inherit from theme
- Custom styling doesn't break theme integration

### Comparison with Chip Component

**Key Differences:**
- **Tag**: Presentational labels for categorization (no interactivity)
- **Chip**: Interactive elements with removal capability
- **Tag**: `value` prop for text content
- **Chip**: `label` prop for text content
- **Tag**: No removal functionality
- **Chip**: `removable` prop with keyboard interaction
- **Tag**: More color options via `severity`
- **Chip**: Focus on avatar/image display

**Overlap:**
- Both support icons
- Both support custom content via children/template
- Both use Prime Icons integration
- Both are lightweight presentational components at core

### Pattern Insights

**Severity as Primary Variant:**
- Seven options provide comprehensive semantic palette
- Color serves as primary differentiation mechanism
- More focused than size or border variants
- Semantic meaning over pure aesthetic choice

**Icon Support:**
- Elevates beyond simple text labels
- Provides visual reinforcement of category meaning
- Simple prop-based API
- No complex icon composition required

**Rounded Variant:**
- Addresses modern design trends
- Simple boolean reduces API complexity
- Works universally with all other props
- No need for multiple shape options

**Lack of Interactivity:**
- Clear design decision for use case separation
- Forces developers to use Chip for interactive needs
- Prevents component scope creep
- Maintains component simplicity

### Comparison Points for Semantic UI

**Strengths to Consider:**
- Clear semantic color vocabulary (severity prop)
- Simple rounded/pill variant as boolean
- Icon support without over-complication
- Flexible content via children pattern
- Accessibility-first design
- Theme system integration
- Lightweight API surface

**Potential Improvements:**
- Could benefit from predefined size options
- Might add border variant control
- Could support loading state
- Might benefit from disabled visual state
- Could add animation/transition support

**Alignment with Web Standards:**
- React-specific implementation
- Could map well to web component approach
- Severity model translates to CSS custom properties
- Icon pattern could use slots in web components
- Rounded variant maps to CSS classes or parts

### Semantic UI Integration Considerations

**For Tag-like Components:**
- Severity vocabulary provides useful semantic grouping
- Icon support is expected modern feature
- Rounded/pill variant is standard expectation
- Content flexibility (value + children) valuable
- Accessibility support should be built-in
- Theme integration essential for design systems

**API Design Patterns:**
- Boolean props for binary variants (`rounded`)
- String enum props for semantic variants (`severity`)
- Separate prop for icons vs composition
- Support both simple and complex content patterns
- Enable but don't require custom styling

**Semantic Meaning:**
- Focus on categorization and status communication
- Clear distinction from interactive elements (Chip)
- Severity values convey semantic intent
- Visual design reinforces category meaning

**Integration Patterns:**
- Works standalone or inline with other content
- No dependencies on parent containers
- Theme-aware for consistent styling
- Custom properties for overrides
