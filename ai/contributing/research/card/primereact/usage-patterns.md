# PrimeReact - Card Usage Patterns

## Component URL
- Primary: https://primereact.org/card/
- Secondary: https://www.primefaces.org/primereact-v8/card/ (access restricted)

Status: ✅ Working (primary URL accessible)
Version: Current (version not explicitly shown)
Last Verified: 2025-11-04

## Documentation Quality
**Good** - Documentation is well-structured with clear examples. Includes:
- Clear component overview describing Card as "a flexible container component"
- Multiple code examples showing different usage patterns
- Props reference with types and descriptions
- Accessibility information
- Examples show header images, titles, subtitles, body content, and footer actions
- Component vs Panel distinction noted

## Component Definition
- **Core purpose**: A flexible container component that wraps and presents content in an organized, styled manner with optional header, title, subtitle, body, and footer sections
- **Mental model**: A structured content container with predefined areas for different types of content (visual header, text headers, body content, action footer)
- **Semantic meaning**: Communicates a cohesive unit of information with hierarchical structure. Distinct from Panel component which is collapsible/interactive.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `title="Hello"`)
- **Composed**: Via composition/children (e.g., `<Card>{content}</Card>`)
- **CSS-only**: Requires custom styling (e.g., `className={{ ... }}`)

## Container Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Basic card | ✅ | Native | Simple container with children content. Usage: `<Card>Content</Card>` |
| Structured card | ✅ | Native | Multi-section card with header/title/subtitle/body/footer. All sections optional |
| Responsive sizing | ✅ | CSS-only | Example shows `className="md:w-25rem"` for responsive width control |

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Title | ✅ | Native | Main heading via `title` prop (string). Rendered in card title section |
| Subtitle | ✅ | Native | Secondary heading via `subTitle` prop (string). Displayed below title |
| Header | ✅ | Native | Custom header content via `header` prop (React node). Typically used for images/visual content |
| Body content | ✅ | Composed | Primary content passed as children to Card component |
| Footer | ✅ | Native | Footer content via `footer` prop (React node). Typically contains action buttons |
| Icon support | ⚠️ | Composed | Not explicitly shown, but can be included in header or children content |
| Media support | ✅ | Native | Images shown in header prop examples. Common pattern for card headers |

## Template Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Header template | ✅ | Native | Via `header` prop accepting React nodes. Example: `header={<img alt="Card" src="/images/usercard.png" />}` |
| Footer template | ✅ | Native | Via `footer` prop accepting React nodes. Example: `footer={<Button label="Save" icon="pi pi-check" />}` |
| Title template | ❌ | N/A | Title is string-only via `title` prop. No JSX template support for title |
| Subtitle template | ❌ | N/A | Subtitle is string-only via `subTitle` prop. No JSX template support |
| Content slots | ✅ | Composed | Body content via children composition pattern |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size variants | ❌ | CSS-only | No built-in size props (small, medium, large). Sizing via `className` |
| Visual styles | ❌ | CSS-only | No style variants (outlined, filled, elevated). Styling via `className` or CSS |
| Color variants | ❌ | CSS-only | No semantic color props. Theming via PrimeReact theme system |
| Elevation/shadow | ⚠️ | CSS-only | Not explicitly shown, likely handled via CSS classes |
| Border styles | ❌ | CSS-only | No border variation props shown |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | N/A | Not shown - container component, no loading states |
| Disabled | ❌ | N/A | Not applicable - non-interactive container |
| Selectable | ❌ | N/A | No selection state shown |
| Interactive states | ❌ | N/A | Card itself is non-interactive. Interactivity through footer buttons/content |

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| className prop | ✅ | Native | Accepts className for custom styling. Example: `className="md:w-25rem"` |
| style prop | ⚠️ | Native | Standard React style prop likely supported (not explicitly shown in examples) |
| CSS classes | ✅ | CSS-only | PrimeReact class naming convention likely follows pattern: `p-card`, `p-card-title`, `p-card-body`, `p-card-footer` |

## Code Examples

### Basic Card
```jsx
import { Card } from 'primereact/card';

<Card>
    <p>Simple card with body content only.</p>
</Card>
```

### Card with Title and Subtitle
```jsx
<Card title="Simple Card" subTitle="Card Subtitle">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
</Card>
```

### Card with Header Image
```jsx
const header = (
    <img alt="Card" src="/images/usercard.png" />
);

<Card title="Title" subTitle="Subtitle" header={header}>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
</Card>
```

### Card with Footer Actions
```jsx
import { Button } from 'primereact/button';

const footer = (
    <>
        <Button label="Save" icon="pi pi-check" />
        <Button label="Cancel" icon="pi pi-times" severity="secondary" />
    </>
);

<Card title="Title" subTitle="Subtitle" footer={footer}>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
</Card>
```

### Complete Card with All Sections
```jsx
const header = (
    <img alt="Card Header" src="/images/usercard.png" />
);

const footer = (
    <div className="flex gap-3 mt-1">
        <Button label="Save" icon="pi pi-check" />
        <Button label="Cancel" icon="pi pi-times" severity="secondary" />
    </div>
);

<Card
    title="Advanced Card"
    subTitle="Card Subtitle"
    header={header}
    footer={footer}
    className="md:w-25rem"
>
    <p className="m-0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Inventore sed consequuntur error repudiandae.
    </p>
</Card>
```

## Component Props Reference

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | null | Title text for the card displayed in the title section |
| `subTitle` | string | null | Subtitle text displayed below the title |
| `header` | ReactNode | null | Header content (typically images or visual elements) |
| `footer` | ReactNode | null | Footer content (typically action buttons or additional info) |
| `className` | string | null | CSS classes for styling customization |
| `style` | object | null | Inline styles object |
| `role` | string | null | Accessibility role attribute for the card container |

## CSS Classes

**Structural Classes (inferred from PrimeReact conventions):**
- `p-card` - Base container class
- `p-card-header` - Header section wrapper
- `p-card-title` - Title text container
- `p-card-subtitle` - Subtitle text container
- `p-card-body` - Body content wrapper
- `p-card-content` - Inner content container
- `p-card-footer` - Footer section wrapper

## Notable Features

### 1. Template-Based Architecture
The Card uses a clear template pattern with dedicated props for different sections:
- `header` prop for visual content (images, icons)
- `title`/`subTitle` props for text headers (string-only)
- Children for body content
- `footer` prop for actions and additional content

This makes the Card structure explicit and predictable.

### 2. Flexible Content Composition
The `header` and `footer` props accept any React nodes, allowing:
- Complex header layouts with multiple elements
- Multiple buttons or links in footer
- Custom layouts within these sections
- Rich content beyond simple text

### 3. Minimal API Surface
PrimeReact keeps the Card API simple with only 7 props, relying on:
- Composition via children for body content
- ReactNode props for complex sections (header/footer)
- Standard React patterns (className, style, role)
- CSS for visual customization

### 4. Responsive Design Support
Examples demonstrate responsive patterns:
- `className="md:w-25rem"` for responsive width control
- Integration with utility class systems (PrimeFlex/Tailwind)
- No rigid size constraints

### 5. Accessibility Foundation
- Supports `role` prop for semantic landmarks
- No enforced ARIA roles (context-dependent usage)
- Non-interactive by design (Card is container, footer content provides interactivity)

### 6. Card vs Panel Distinction
Documentation notes that Card is different from Panel:
- **Card**: Static content container, non-collapsible
- **Panel**: Interactive, collapsible container with toggle behavior

This clarifies the component's semantic role in the design system.

## Research Notes

### Documentation Access
- **primereact.org/card/** - Primary documentation, successfully accessed
- **primefaces.org/primereact-v8/card/** - Secondary URL access restricted (network/security policies)

The modern PrimeReact documentation site provided comprehensive information.

### Framework Approach Observations

**Props Philosophy:**
PrimeReact takes a straightforward approach:
- Dedicated props for each major section (title, subTitle, header, footer)
- String props for simple text (title/subTitle)
- ReactNode props for complex content (header/footer)
- Children for body content
- Standard React props for styling (className, style)

**React Patterns:**
- Standard composition via children
- ReactNode for flexible templating
- No controlled/uncontrolled state (stateless container)
- No event handlers (non-interactive component)

**Design System Integration:**
- Uses PrimeReact's class naming convention (`p-*`)
- Integrates with PrimeReact Button component in examples
- Works with utility class systems (shown with `md:w-25rem`)
- Part of larger theming system

### Comparison Points

**Strengths:**
- Very simple, intuitive API
- Clear separation of content areas (header/title/body/footer)
- Flexible composition via ReactNode props
- Good documentation with visual examples
- Responsive design support

**Limitations:**
- Title and subtitle are string-only (no template support)
- No built-in size variants
- No semantic style variants (info, warning, success)
- No elevation/shadow controls via props
- All visual styling requires CSS/className

**Unique Features:**
- Clear distinction from Panel component in documentation
- Template pattern is straightforward and predictable
- Minimal API footprint

### Implementation Insights

The Card component is essentially a structured wrapper that:
1. Renders a container element
2. Conditionally renders header section if `header` prop provided
3. Conditionally renders title/subtitle section if props provided
4. Always renders children in body section
5. Conditionally renders footer section if `footer` prop provided

The component provides structure and semantic HTML but delegates visual styling to CSS. This is a common pattern in component libraries that prioritize flexibility and theming.

### Pattern Analysis for Semantic UI

**Relevant Patterns:**
- ✅ Native props for title/subtitle (simple, clear)
- ✅ Template props for header/footer (flexible composition)
- ✅ Children for body content (standard React pattern)
- ✅ className/style for customization (expected in React)

**Considerations:**
- String-only title/subtitle limits flexibility (could support ReactNode)
- No size/style variants means more CSS work for consumers
- Distinction from Panel is important for component taxonomy

**Semantic UI Opportunities:**
- Could enhance with title/subtitle as templates (not just strings)
- Could add semantic style variants (using Semantic UI patterns)
- Could add size variants (small, medium, large)
- Could integrate with Semantic UI's natural language API style
