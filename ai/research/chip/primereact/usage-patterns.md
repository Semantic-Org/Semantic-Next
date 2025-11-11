# PrimeReact - Badge & Tag Usage Patterns

## Component URLs
**Badge:** https://www.primefaces.org/primereact-v8/badge/
**Tag:** https://www.primefaces.org/primereact-v8/tag/
Status: ✅ Working
Version: PrimeReact 8.7.0
Last Verified: 2025-11-04

## Documentation Quality
Good - Clear component documentation with API tables, live examples, and code snippets. Both components have well-defined props and visual examples demonstrating all major features.

## Component Definitions

### Badge
- **Core purpose**: A small status indicator for another element, displaying numerical or text content within a compact visual container to show counts or status updates
- **Mental model**: Notification indicator that draws attention to changes, updates, or counts; typically overlaid on parent elements
- **Semantic meaning**: Communicates status, counts, or notifications requiring user attention

### Tag
- **Core purpose**: Categorizes content within applications through lightweight labeling elements that organize or highlight information
- **Mental model**: Label or category marker that provides metadata about content; typically inline or standalone element
- **Semantic meaning**: Communicates categorization, status, or attributes of content

## Badge vs Tag Differences
- **Badge**: Notification-oriented, typically overlaid on other elements, emphasizes counts/status
- **Tag**: Categorization-oriented, standalone or inline element, emphasizes labels/metadata
- **Badge**: Often numeric, positioned absolutely
- **Tag**: Often textual, positioned in flow, supports icons

---

## BADGE Component Patterns

### Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `value` prop accepts any content type |
| Numeric content | ✅ | Native | Primary use case for counts/notifications |
| Icon support | ❌ | N/A | Not mentioned in documentation |
| Media support | ❌ | N/A | Not supported |
| Custom content | ✅ | Native | `value` accepts any type, including JSX |
| Dot indicator | ✅ | CSS-only | `p-badge-dot` class for no-value display |

### Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Standalone | ✅ | Native | Default usage as independent element |
| Overlay | ✅ | CSS-only | `p-overlay-badge` wrapper class for positioning on parent |
| Inline | ✅ | Native | Can be embedded within other components |

### State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | N/A | No loading state |
| Disabled | ❌ | N/A | No disabled state |

### Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: default, `large`, `xlarge` |
| Severity variants | ✅ | Native | `severity` prop: `success`, `info`, `warning`, `danger` |
| Positioning | ✅ | CSS-only | Via `p-overlay-badge` wrapper class |
| Responsive sizing | ✅ | Native | Auto-scales based on parent context (e.g., headings) |
| Dot variant | ✅ | CSS-only | `p-badge-dot` class for indicator without value |

---

## TAG Component Patterns

### Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `value` prop for text, or children for custom content |
| Icon support | ✅ | Native | `icon` prop accepts icon class names (e.g., `"pi pi-plus"`) |
| Media support | ❌ | N/A | Not supported |
| Custom content | ✅ | Composed | Tag children for flexible content composition |

### Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Standard rectangular | ✅ | Native | Default display mode |
| Rounded pill | ✅ | Native | `rounded` boolean prop |

### State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | N/A | No loading state |
| Disabled | ❌ | N/A | No disabled state |
| Removable | ❌ | N/A | No built-in close/remove functionality |

### Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No predefined size prop; configurable via theming |
| Severity variants | ✅ | Native | `severity` prop: `success`, `info`, `warning`, `danger` |
| Visual styles | ✅ | Native | Standard vs rounded via `rounded` prop |
| Icon positioning | ✅ | Native | Icon displays adjacent to value text |

---

## Code Examples

### Badge Examples

```jsx
import { Badge } from 'primereact/badge';

// Basic badge
<Badge value="2"></Badge>

// With severity
<Badge value="2" severity="success"></Badge>
<Badge value="8" severity="danger"></Badge>

// Size variants
<Badge value="5" size="large"></Badge>
<Badge value="10" size="xlarge"></Badge>

// Overlay badge on button
<span className="p-overlay-badge">
  <Button type="button" label="Messages" />
  <Badge value="2"></Badge>
</span>

// Dot indicator (no value)
<span className="p-overlay-badge">
  <i className="pi pi-bell" style={{ fontSize: '2rem' }}></i>
  <Badge className="p-badge-dot"></Badge>
</span>

// Contextual sizing (auto-scales in headings)
<h1>
  Heading <Badge value="New"></Badge>
</h1>
```

### Tag Examples

```jsx
import { Tag } from 'primereact/tag';

// Basic tag
<Tag value="New"></Tag>

// With icon
<Tag value="New" icon="pi pi-plus"></Tag>

// Rounded pill style
<Tag value="Active" rounded></Tag>

// With severity
<Tag value="Success" severity="success"></Tag>
<Tag value="Info" severity="info"></Tag>
<Tag value="Warning" severity="warning"></Tag>
<Tag value="Danger" severity="danger"></Tag>

// Custom content via children
<Tag>
  <span>Custom Content</span>
</Tag>

// Icon only
<Tag icon="pi pi-check" severity="success" rounded></Tag>
```

## Notable Features

### Badge Notable Features

**Overlay Positioning System:**
- Uses `p-overlay-badge` wrapper class for absolute positioning
- Badge automatically positions on top-right of parent element
- Flexible enough to work with any parent component

**Dot Variant:**
- `p-badge-dot` class creates indicator without displayed value
- Useful for presence indicators or simple notifications
- Visual-only notification without specific count

**Contextual Sizing:**
- Automatically scales relative to parent elements
- Integrates naturally within typography (headings, buttons, etc.)
- Reduces need for manual size adjustment

**Flexible Value Types:**
- `value` prop accepts any type (string, number, JSX)
- Supports both simple and complex content scenarios

### Tag Notable Features

**Icon Integration:**
- Native `icon` prop for direct icon support
- Icons positioned adjacent to value text
- Accepts PrimeIcons class names

**Dual Display Modes:**
- Standard rectangular for traditional labels
- Rounded pill style for modern aesthetics
- Simple boolean prop for easy toggling

**Content Flexibility:**
- Both `value` prop and children patterns supported
- Allows simple string values or complex composed content
- Consistent with React composition patterns

**No Dependencies:**
- Standalone component with minimal requirements
- Integrates with PrimeReact theme system
- Lightweight implementation

**CSS Architecture:**
- Well-structured class naming (`p-tag`, `p-tag-rounded`, etc.)
- Separate styling for icon and value elements
- Theme-aware color system

## Research Notes

### Documentation Access
- Successfully accessed v8 documentation at primefaces.org domain
- Latest primereact.org domain was blocked by network restrictions
- Documentation includes comprehensive API tables and live examples
- Code samples provided for all major use cases

### Framework Approach Observations

**Separation of Concerns:**
- Badge for notifications/counts (overlay-focused)
- Tag for categorization/labels (inline-focused)
- Clear distinction prevents component overlap

**Severity Pattern Consistency:**
- Both components share same severity vocabulary
- Consistent `success`, `info`, `warning`, `danger` values
- Enables predictable theming across component families

**Styling Strategy:**
- CSS class-based for structural variations (overlay, dot)
- Props-based for semantic variations (severity, size)
- Balance between flexibility and simplicity

**React Patterns:**
- Standard React prop conventions
- Children support for composition
- Boolean flags for binary states

### Implementation Patterns

**Badge Positioning:**
- Wrapper-based overlay system rather than dedicated positioning props
- Allows maximum flexibility in parent element choice
- Simple class-based approach reduces API surface

**Tag Composition:**
- Dual content pattern: `value` prop OR children
- Icon as dedicated prop rather than composition slot
- Straightforward API for common use cases

**Size Handling:**
- Badge: Explicit size prop with predefined values
- Tag: Theme-based sizing without dedicated prop
- Different strategies based on component purpose

### Comparison Points for Semantic UI

**Strengths to Consider:**
- Clear component separation (Badge vs Tag)
- Severity consistency across related components
- Flexible overlay system for Badge
- Icon support in Tag without over-complication
- Rounded/pill variant as simple boolean

**Potential Improvements:**
- Tag could benefit from removable/closeable behavior
- Badge could support icon content
- More granular size options for Tag
- Positioning options for Badge beyond top-right overlay
- Loading/disabled states could enhance both components

**Alignment with Web Standards:**
- React-specific implementation
- Could benefit from web component approach
- CSS class-based patterns map well to Shadow DOM parts
- Severity model could use CSS custom properties for theming

### Pattern Insights

**Badge Patterns:**
- Overlay positioning is critical feature
- Dot variant addresses common notification pattern
- Size scaling shows attention to contextual usage
- Numeric content is primary but not exclusive use case

**Tag Patterns:**
- Icon support elevates beyond simple text labels
- Rounded variant addresses modern design trends
- Severity provides semantic meaning
- Lack of removable behavior suggests read-only categorization focus

**Shared Patterns:**
- Severity vocabulary enables consistent color semantics
- Simple prop APIs reduce learning curve
- Theme integration for consistent styling
- Minimal state management (mostly presentational)

### Semantic UI Integration Considerations

**For Badge-like Components:**
- Overlay positioning system essential
- Dot/indicator variant valuable
- Size options should include auto-scaling
- Consider both numeric and text content

**For Tag-like Components:**
- Icon support is expected feature
- Rounded/pill variant is modern standard
- Removable behavior worth considering
- Severity provides useful semantic grouping

**General Patterns:**
- Shared severity vocabulary across label/badge/tag family
- Balance between native props and composition
- CSS class-based structural variations
- Theme system integration for colors/spacing
