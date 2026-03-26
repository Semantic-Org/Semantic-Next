# PrimeReact - Chip Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primereact.org/chip/
Status: ✅ Working
Version: Current
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear component documentation with API tables, live interactive examples, and code snippets. Well-defined props with visual demonstrations including removable functionality and keyboard interactions. Accessibility information included.

## Component Definition
- **Core purpose**: Represent entities using icons, labels and images in a compact, chip-style format with optional removal capability
- **Mental model**: A compact representation of an entity (person, category, tag, filter) that can optionally be removed by user interaction
- **Semantic meaning**: Communicates discrete entities, selections, or applied filters; often used in multi-select scenarios, user lists, or tag collections

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `label="Action"`)
- **Composed**: Via composition/children (e.g., `template` prop for custom content)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Native | `label` prop for text content |
| Icons | ✅ | Native | `icon` prop accepts font icon class names (e.g., `"pi pi-apple"`) |
| Avatars/Images | ✅ | Native | `image` prop for avatar/image URL display |
| Close/Remove button | ✅ | Native | Automatically rendered when `removable={true}` |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selectable/Active | ❌ | N/A | No explicit selection/active state documented |
| Disabled | ❌ | N/A | No disabled state documented |
| Loading | ❌ | N/A | No loading state |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ❌ | CSS-only | No predefined color/severity prop; customizable via styling |
| Size options | ❌ | CSS-only | No predefined size prop; configurable via theming or custom styles |
| Visual variants | ❌ | CSS-only | No explicit filled/outlined/subtle variants; default style only |
| Bordered/Borderless | ❌ | CSS-only | No dedicated border control; customizable via styling |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ⚠️ | Composed | Not explicitly documented, but standard React event handlers can be applied |
| Closable/Removable | ✅ | Native | `removable` boolean prop renders delete icon with keyboard interaction |
| onClick handler | ⚠️ | Composed | Not explicitly documented, but can use standard React events |
| onClose handler | ❌ | N/A | No explicit onRemove/onClose callback prop documented |

## Code Examples
```jsx
import { Chip } from 'primereact/chip';

// Basic chip
<Chip label="Action" />

// With icon
<Chip label="Apple" icon="pi pi-apple" />

// With avatar/image
<Chip label="Amy Elsner" image="/images/avatar/amyelsner.png" />

// Removable chip (with delete icon)
<Chip label="Thriller" removable />

// Combined: icon + label + removable
<Chip label="Action" icon="pi pi-film" removable />

// Combined: avatar + label + removable
<Chip
  label="John Doe"
  image="/images/avatar/johndoe.png"
  removable
/>

// Custom template for advanced content
<Chip
  template={(
    <div>
      <span>Custom Content</span>
      <i className="pi pi-user ml-2"></i>
    </div>
  )}
/>

// With custom styling
<Chip label="Custom" className="custom-chip" />
<Chip label="Styled" style={{ backgroundColor: '#4CAF50', color: 'white' }} />
```
[View Live](https://primereact.org/chip/)

## Notable Features

**Removable Functionality:**
- `removable` prop automatically renders delete/close icon
- Keyboard interaction: Backspace and Enter keys trigger removal
- Focusable: Removable chips have `tabIndex` for keyboard navigation
- Built-in accessibility for removal action
- Visual feedback for removal capability

**Avatar/Image Support:**
- Native `image` prop for displaying user avatars or entity images
- Automatically positioned before label text
- Ideal for user lists, contacts, or visual entity representation
- Circular avatar styling

**Icon Integration:**
- `icon` prop accepts font-based icon classes (Prime Icons)
- Icons positioned before label text
- Works alongside avatar (either icon or image, not both typically)
- Simple prop-based API

**Content Flexibility:**
- `label` prop for simple text content
- `template` prop for custom ReactNode content
- Allows complex composed content beyond standard patterns
- Progressive API complexity

**Accessibility:**
- Built-in screen reader labels for removal action
- Keyboard navigation support via tab key
- Keyboard removal via Backspace/Enter keys
- Focus management for removable chips

**Compact Design:**
- Optimized for displaying multiple entities in limited space
- Consistent height regardless of content
- Horizontal layout for icon/image + label
- Visual grouping for related entities

**Standard React Attributes:**
- All standard React props pass to root element
- Supports className and style for customization
- Can apply data attributes and other HTML props

## Research Notes

### Documentation Access
- Successfully accessed current documentation at primereact.org
- Documentation includes comprehensive API tables and live interactive examples
- Code samples demonstrate basic to advanced usage
- Keyboard interaction explicitly documented
- Accessibility considerations included

### Framework Approach Observations

**Interactive Focus:**
- Unlike Tag, Chip is designed with interactivity in mind
- Primary interactive feature is removal capability
- Keyboard interaction built-in for accessibility
- Focus state handled automatically for removable chips

**Visual Identity Flexibility:**
- No predefined color/severity variants (unlike Tag)
- Styling flexibility through className and style props
- Theme-neutral default appearance
- Allows design system to define visual language

**Entity Representation:**
- Designed for representing discrete entities (people, tags, selections)
- Avatar/image support reinforces entity concept
- Suitable for multi-select UI patterns
- Visual compactness for collections

**Simplified Variant System:**
- No complexity of severity, size, or visual variant props
- Single removable boolean for primary variation
- Reduces API surface
- Focus on content patterns over visual variations

### Implementation Patterns

**Removal Interaction:**
- `removable` boolean is sole interactive prop
- No explicit onRemove/onClose callback documented
- Likely relies on component visibility control from parent
- Keyboard shortcuts enhance accessibility

**Content Priority:**
- Label is primary content (central prop name)
- Icon and image are supplementary
- Template provides escape hatch for custom needs
- Clear hierarchy of content patterns

**Image/Avatar Handling:**
- Dedicated `image` prop for URL-based avatars
- Automatic circular styling
- Positioned before label consistently
- No complex avatar composition required

**Keyboard Interaction:**
- Backspace and Enter keys for removal
- Tab key for focus navigation
- Standard keyboard UX patterns
- Enhances accessibility and power-user efficiency

### Comparison with Tag Component

**Key Differences:**
- **Chip**: Interactive with removal capability
- **Tag**: Purely presentational (no interactivity)
- **Chip**: `label` prop for text
- **Tag**: `value` prop for text
- **Chip**: Native avatar/image support
- **Tag**: No dedicated image support
- **Chip**: No severity/color variants
- **Tag**: Seven severity color options
- **Chip**: Focus on entity representation
- **Tag**: Focus on categorization

**Design Philosophy:**
- **Chip**: Entity representation with optional removal
- **Tag**: Category labeling without interaction
- **Chip**: Use for selections, filters, contact lists
- **Tag**: Use for status, categories, static labels

**API Complexity:**
- **Chip**: Simpler variant system (just `removable`)
- **Tag**: More visual variants (severity, rounded)
- **Chip**: More content patterns (image support)
- **Tag**: Simpler content (no native image)

### Pattern Insights

**Removal as Primary Interaction:**
- Core differentiator from Tag component
- Enables filter chips, selection lists, dynamic collections
- Keyboard shortcuts show attention to UX
- Built-in accessibility for removal

**Avatar/Image Priority:**
- Distinguishes Chip from simple labels
- Ideal for user/entity representations
- Circular styling convention
- First-class content pattern

**Visual Simplicity:**
- Lack of severity variants keeps focus on content
- Allows design system to define visual language
- Reduces component API complexity
- Theme-based styling encouraged

**Keyboard Interaction:**
- Backspace/Enter for removal is intuitive
- Tab for navigation follows web standards
- Power-user efficiency consideration
- Accessibility-first design

### Missing Patterns

**No Explicit Callbacks:**
- No documented onRemove/onClose handler
- Removal behavior not clearly defined in docs
- May rely on component-controlled visibility
- Could benefit from explicit callback API

**No State Variants:**
- No disabled state for non-removable scenarios
- No loading state for async operations
- No selected/active state for selection UIs
- Purely presentational beyond removal

**No Visual Variants:**
- No filled/outlined/subtle variants
- No size options (small/large)
- No border style controls
- Requires custom styling for visual variations

**No Color System:**
- No severity or semantic color options
- No predefined color palette
- Theme-based only
- More styling work for developers

### Comparison Points for Semantic UI

**Strengths to Consider:**
- Clear separation of interactive (Chip) vs presentational (Tag)
- Native avatar/image support for entities
- Built-in keyboard interaction for removal
- Accessibility-first design
- Template prop for content flexibility
- Simple API focusing on core use case

**Potential Improvements:**
- Explicit onRemove callback would clarify removal behavior
- Visual variants (outlined, subtle) would add flexibility
- Size options would enhance visual hierarchy
- Semantic color options could convey meaning
- Disabled state for conditional removal
- Loading state for async removal operations
- Selected/active state for multi-select UIs

**Alignment with Web Standards:**
- React-specific implementation
- Could map well to web component approach
- Keyboard interactions follow web standards
- Removal pattern translates to custom events
- Image handling could use slots in web components
- Focus management maps to :focus-visible CSS

### Semantic UI Integration Considerations

**For Chip-like Components:**
- Removal capability is defining feature
- Avatar/image support essential for entity representation
- Keyboard interaction should be built-in
- Accessibility must be first-class
- Content flexibility via template/slot pattern
- Clear removal callback API needed

**Use Case Separation:**
- Chip for interactive entity representation
- Tag for static categorization labels
- Clear distinction prevents component confusion
- Guides developers to correct component choice

**Interactive Patterns:**
- Removal is primary but not only interaction
- Could support selection state
- Could support click actions beyond removal
- Multiple interaction modes should be composable

**Visual Identity:**
- Balance between predefined variants and customization
- Consider both theme-based and prop-based variants
- Size options valuable for visual hierarchy
- Color options can convey semantic meaning

**Entity Representation:**
- Avatar/image support differentiates from simple labels
- Circular avatar convention widely understood
- Icon alternative for non-person entities
- Both patterns should be first-class

**Keyboard Interaction:**
- Backspace/Enter for removal is intuitive standard
- Tab navigation essential for accessibility
- Escape key could cancel focused removable chip
- Arrow keys could navigate chip collections

**Removal Behavior:**
- Clear onRemove callback API essential
- Consider animation/transition on removal
- Confirmation for destructive removals
- Undo pattern for accidental removals
