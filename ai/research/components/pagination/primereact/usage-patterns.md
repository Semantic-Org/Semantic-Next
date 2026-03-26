# PrimeReact - Paginator Usage Patterns

## Component URL
https://primereact.org/paginator/
Status: ✅ Working
Version: PrimeReact 10.9.7
Last Verified: 2025-11-06

## Documentation Quality
Good - Provides clear examples, comprehensive props documentation, and accessibility information. Covers all major use cases with code samples.

## Component Definition
- **Core purpose**: Provides navigation controls for displaying large datasets across multiple pages, allowing users to browse through paginated content efficiently.
- **Mental model**: A controlled component that manages page state through callbacks. Users think of it as a navigation toolbar that sits above or below content, providing quick access to different pages.
- **Semantic meaning**: Communicates dataset boundaries and current position within multi-page content. Helps users understand how much content exists and where they are within it.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Page numbers | ✅ | Native | `PageLinks` template token - displays clickable page numbers with ellipsis for large ranges |
| Previous/Next buttons | ✅ | Native | `PrevPageLink` and `NextPageLink` template tokens - standard navigation arrows |
| First/Last buttons | ✅ | Native | `FirstPageLink` and `LastPageLink` template tokens - jump to boundaries |
| Page size selector | ✅ | Native | `RowsPerPageDropdown` template token with `rowsPerPageOptions` prop - dropdown for changing items per page |
| Total count display | ✅ | Native | `CurrentPageReport` template token - customizable text showing current range and total |
| Quick jumper | ✅ | Native | `JumpToPageInput` template token - input field for direct page navigation |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | CSS-only | No native size variants - would require custom CSS styling |
| Simplified mode | ✅ | Native | Via `template` prop - can show only subset of controls (e.g., just prev/next/current) |
| Button style | ✅ | Composed | Via custom template callbacks - can replace default button rendering |
| Disabled state | ⚠️ | Unknown | Documentation does not explicitly mention disabled state support |
| Custom rendering | ✅ | Native | Via template callbacks for each UI element - full control over rendering |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange callback | ✅ | Native | `onPageChange` prop - receives event object with `first`, `rows`, `page`, `pageCount` properties |
| Controlled mode | ✅ | Native | Requires `first` and `rows` props with `onPageChange` callback - fully controlled |
| Uncontrolled mode | ❌ | Not supported | Must manage state externally - no internal state management |
| Keyboard navigation | ✅ | Native | Tab, Enter, Space keys supported - full keyboard accessibility |

## Code Examples

### Primary Usage - Basic Paginator
```jsx
import { Paginator } from 'primereact/paginator';
import { useState } from 'react';

export default function BasicDemo() {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    return (
        <Paginator
            first={first}
            rows={rows}
            totalRecords={120}
            rowsPerPageOptions={[10, 20, 30]}
            onPageChange={onPageChange}
        />
    );
}
```
[View Live](https://primereact.org/paginator/#basic)

### Custom Layout - Simplified Controls
```jsx
<Paginator
    first={first}
    rows={10}
    totalRecords={50}
    onPageChange={onPageChange}
    template={{ layout: 'PrevPageLink CurrentPageReport NextPageLink' }}
/>
```
[View Live](https://primereact.org/paginator/#template)

### Advanced Template - Custom Content Slots
```jsx
import { Paginator } from 'primereact/paginator';

export default function CustomDemo() {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const leftContent = <Button type="button" icon="pi pi-refresh" text />;
    const rightContent = <Button type="button" icon="pi pi-download" text />;

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    return (
        <Paginator
            first={first}
            rows={rows}
            totalRecords={120}
            onPageChange={onPageChange}
            leftContent={leftContent}
            rightContent={rightContent}
        />
    );
}
```
[View Live](https://primereact.org/paginator/#template)

### Content Pagination - Image Gallery Pattern
```jsx
import { Paginator } from 'primereact/paginator';
import { useState } from 'react';

export default function ImageGalleryDemo() {
    const [first, setFirst] = useState(0);

    const onPageChange = (event) => {
        setFirst(event.first);
    };

    return (
        <div>
            <Paginator
                first={first}
                rows={1}
                totalRecords={12}
                onPageChange={onPageChange}
                template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            />
            <div className="p-3 text-center">
                <img
                    alt={first}
                    src={`https://primefaces.org/cdn/primereact/images/nature/nature${first + 1}.jpg`}
                    className="shadow-2 border-round max-w-full"
                />
            </div>
        </div>
    );
}
```
[View Live](https://primereact.org/paginator/#basic)

## Notable Features

### Highly Templatable Architecture
The `template` prop accepts either a string of space-separated tokens or an object with callbacks for complete rendering control. Available template tokens:
- `FirstPageLink`, `PrevPageLink`, `NextPageLink`, `LastPageLink`
- `PageLinks` - smart page number display with ellipsis
- `RowsPerPageDropdown` - integrated dropdown component
- `CurrentPageReport` - customizable text template showing range
- `JumpToPageInput` - direct page entry field

### Custom Content Injection
`leftContent` and `rightContent` props allow inserting arbitrary React components alongside pagination controls, useful for actions like refresh, export, or filters.

### Integrated Dropdown Component
The rows-per-page selector uses PrimeReact's native Dropdown component, providing consistent styling and behavior with other form controls.

### Controlled Component Pattern
Operates exclusively as a controlled component - no internal state management. The `onPageChange` callback provides an event object with:
- `first` - Index of first record on new page
- `rows` - Number of rows per page
- `page` - Zero-based page number
- `pageCount` - Total number of pages

### Full Keyboard Accessibility
- Tab navigation through all interactive elements
- Enter/Space to activate buttons
- Proper ARIA attributes on all controls
- `aria-current="page"` on current page indicator
- `aria-live="polite"` announcements for page changes

### Semantic HTML Structure
Uses `<nav>` element as the root container with proper ARIA labeling, ensuring screen readers correctly identify the component as navigation.

## Research Notes

### Accessibility Implementation
The component demonstrates strong accessibility support with comprehensive ARIA attributes, semantic HTML (`<nav>` wrapper), keyboard navigation, and screen reader announcements. Current page is marked with `aria-current="page"`, and page changes are announced via `aria-live="polite"` regions.

### Template System Design
The template system is particularly flexible - accepts both simple string-based layouts (space-separated tokens) and callback-based custom rendering. This provides a clear upgrade path from basic configuration to full customization without changing the mental model.

### Disabled State Gap
Documentation does not explicitly show disabled state examples or props. This may be a documentation gap or the component may rely on consuming code to conditionally render or apply disabled styling.

### Single-Item Pagination Use Case
The image gallery example demonstrates an interesting pattern: using pagination with `rows={1}` to navigate through single items rather than traditional table rows. This shows the component's flexibility beyond typical data table use cases.

### Version Information
The documentation clearly indicates version 10.9.7, which helps with compatibility and feature availability verification.

---

**Research completed:** 2025-11-06
**Component:** Paginator
**Framework:** PrimeReact
**Documentation:** https://primereact.org/paginator/

**Key Strengths:**
- Comprehensive template system with flexible customization
- Strong accessibility foundation with proper ARIA and keyboard support
- Controlled component pattern for predictable state management
- Content injection points for custom actions
- Single-item pagination pattern expands use cases beyond tables
