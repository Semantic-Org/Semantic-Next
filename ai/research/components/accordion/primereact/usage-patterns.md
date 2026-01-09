# PrimeReact - Accordion Component

> **Research Date:** 2025-11-05
> **Component:** Accordion
> **Framework:** PrimeReact
> **Version Researched:** v8 and v10+ (current)
> **Documentation:** https://primereact.org/accordion/

---

## Component Overview

The **Accordion** component displays a collection of content panels that can be expanded or collapsed. It provides an organized way to present grouped information with expandable sections, commonly used for FAQs, settings panels, grouped content, and hierarchical information display.

The Accordion consists of:
- **Accordion** - Container component that manages the active state(s)
- **AccordionTab** - Individual expandable panels with headers and content areas

### Core Purpose
To provide an interactive, space-efficient way to display and organize large amounts of grouped content by showing one or more sections at a time while hiding others.

### Mental Model
Think of Accordion as a collection of collapsible cards where each card has a clickable header that toggles the visibility of its content. Users can expand/collapse sections to reveal information on demand.

### Semantic Meaning
Represents a hierarchical grouping of related content sections, communicating that information is organized by topics or categories that can be independently explored.

---

## Pattern Support Levels

- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

---

## Expansion Behavior Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single expansion | ✅ | Native | Default behavior - only one tab can be active at a time |
| Multiple expansion | ✅ | Native | `multiple` prop allows multiple tabs to be expanded simultaneously |
| Controlled state | ✅ | Native | `activeIndex` and `onTabChange` props for external state management |
| Uncontrolled state | ✅ | Native | Initial `activeIndex` provided, component manages state internally |
| Default active | ✅ | Native | `activeIndex` sets which tabs are initially expanded |
| Programmatic control | ✅ | Native | `activeIndex` can be updated externally to change active tabs |

---

## State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Expanded | ✅ | Native | Controlled via `activeIndex` (single number or array of numbers) |
| Collapsed | ✅ | Native | Tab not in `activeIndex` is collapsed |
| Disabled | ✅ | Native | `AccordionTab` accepts `disabled` boolean prop |

---

## Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text header | ✅ | Native | `header` prop accepts string text |
| Rich header | ✅ | Native | `header` prop accepts JSX elements for custom header rendering |
| Plain text content | ✅ | Native | Children of `AccordionTab` rendered as content |
| Rich content | ✅ | Native | Children can be any JSX, including components |
| Icon in header | ✅ | Composed | Include icon elements in the header JSX |
| Custom header template | ✅ | Native | `headerTemplate` prop for complete header customization |

---

## Styling & Appearance Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Theme styles | ✅ | Native | Inherits PrimeReact theme automatically |
| Custom className | ✅ | Native | `className` prop on Accordion and AccordionTab |
| Inline styles | ✅ | Native | `style` prop on Accordion and AccordionTab |
| Header styling | ✅ | Native | `headerClassName` and `headerStyle` props on AccordionTab |
| Content styling | ✅ | Native | `contentClassName` and `contentStyle` props on AccordionTab |
| PassThrough API | ✅ | Native | `pt` prop for granular DOM customization |

---

## Code Examples

### Basic Usage

```jsx
import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function BasicAccordion() {
  return (
    <Accordion>
      <AccordionTab header="Header 1">
        <p>Content for section 1</p>
      </AccordionTab>
      <AccordionTab header="Header 2">
        <p>Content for section 2</p>
      </AccordionTab>
      <AccordionTab header="Header 3">
        <p>Content for section 3</p>
      </AccordionTab>
    </Accordion>
  );
}
```

### Controlled Accordion (Single Active Tab)

```jsx
import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function ControlledAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Accordion
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
    >
      <AccordionTab header="Header 1">
        <p>This tab is currently: {activeIndex === 0 ? 'ACTIVE' : 'INACTIVE'}</p>
      </AccordionTab>
      <AccordionTab header="Header 2">
        <p>Content for section 2</p>
      </AccordionTab>
      <AccordionTab header="Header 3">
        <p>Content for section 3</p>
      </AccordionTab>
    </Accordion>
  );
}
```

### Multiple Tabs (Uncontrolled)

```jsx
import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function MultipleTabsAccordion() {
  return (
    <Accordion multiple>
      <AccordionTab header="Header 1">
        <p>Multiple tabs can now be expanded at the same time</p>
      </AccordionTab>
      <AccordionTab header="Header 2">
        <p>Open other sections without closing this one</p>
      </AccordionTab>
      <AccordionTab header="Header 3">
        <p>Content for section 3</p>
      </AccordionTab>
    </Accordion>
  );
}
```

### Multiple Tabs (Controlled)

```jsx
import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function ControlledMultipleAccordion() {
  // activeIndex is an array when using multiple mode
  const [activeIndexes, setActiveIndexes] = useState([0, 2]);

  return (
    <Accordion
      multiple
      activeIndex={activeIndexes}
      onTabChange={(e) => setActiveIndexes(e.index)}
    >
      <AccordionTab header="Header 1">
        <p>This tab starts expanded (index 0)</p>
      </AccordionTab>
      <AccordionTab header="Header 2">
        <p>This tab starts collapsed</p>
      </AccordionTab>
      <AccordionTab header="Header 3">
        <p>This tab starts expanded (index 2)</p>
      </AccordionTab>
    </Accordion>
  );
}
```

### With Icons in Headers

```jsx
import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function AccordionWithIcons() {
  return (
    <Accordion>
      <AccordionTab
        header={
          <div className="flex align-items-center gap-2">
            <i className="pi pi-home"></i>
            <span>Dashboard</span>
          </div>
        }
      >
        <p>Dashboard content goes here</p>
      </AccordionTab>
      <AccordionTab
        header={
          <div className="flex align-items-center gap-2">
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </div>
        }
      >
        <p>Settings content goes here</p>
      </AccordionTab>
    </Accordion>
  );
}
```

### With Disabled Tabs

```jsx
import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function AccordionWithDisabled() {
  return (
    <Accordion>
      <AccordionTab header="Header 1">
        <p>Active section</p>
      </AccordionTab>
      <AccordionTab header="Header 2 (Disabled)" disabled>
        <p>This section is disabled and cannot be expanded</p>
      </AccordionTab>
      <AccordionTab header="Header 3">
        <p>Another active section</p>
      </AccordionTab>
    </Accordion>
  );
}
```

### With Custom Styling

```jsx
import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function StyledAccordion() {
  return (
    <Accordion
      className="w-full"
      style={{ marginBottom: '2rem' }}
    >
      <AccordionTab
        header="Styled Header 1"
        headerClassName="text-primary font-bold"
        headerStyle={{ backgroundColor: '#f3f4f6' }}
        contentClassName="p-4"
        contentStyle={{ backgroundColor: '#fafafa' }}
      >
        <p>Content with custom styling</p>
      </AccordionTab>
      <AccordionTab
        header="Styled Header 2"
        headerClassName="text-accent font-bold"
      >
        <p>Another styled section</p>
      </AccordionTab>
    </Accordion>
  );
}
```

### With Complex Content

```jsx
import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

export default function AccordionWithComplexContent() {
  const [products] = useState([
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 }
  ]);

  return (
    <Accordion>
      <AccordionTab header="Product Table">
        <DataTable value={products}>
          <Column field="name" header="Name"></Column>
          <Column field="price" header="Price"></Column>
        </DataTable>
      </AccordionTab>
      <AccordionTab header="Action Items">
        <div className="flex gap-2">
          <Button label="Save" icon="pi pi-check" />
          <Button label="Cancel" icon="pi pi-times" severity="secondary" />
        </div>
      </AccordionTab>
    </Accordion>
  );
}
```

### Nested Accordions

```jsx
import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function NestedAccordion() {
  return (
    <Accordion>
      <AccordionTab header="Section 1">
        <p>Outer section 1 content</p>
        <Accordion>
          <AccordionTab header="Nested 1.1">
            <p>Nested section content</p>
          </AccordionTab>
          <AccordionTab header="Nested 1.2">
            <p>Another nested section</p>
          </AccordionTab>
        </Accordion>
      </AccordionTab>
      <AccordionTab header="Section 2">
        <p>Outer section 2 content</p>
      </AccordionTab>
    </Accordion>
  );
}
```

### With Header Template

```jsx
import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';

export default function AccordionWithHeaderTemplate() {
  const headerTemplate = (options) => {
    return (
      <div className="flex align-items-center justify-content-between w-full">
        <span className="font-bold">{options.props.header}</span>
        <Badge value="3" severity="success"></Badge>
      </div>
    );
  };

  return (
    <Accordion>
      <AccordionTab header="Notifications" headerTemplate={headerTemplate}>
        <p>You have 3 new notifications</p>
      </AccordionTab>
    </Accordion>
  );
}
```

### FAQ Pattern

```jsx
import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function FAQAccordion() {
  const faqs = [
    {
      question: 'What is PrimeReact?',
      answer: 'PrimeReact is an open source UI component library.'
    },
    {
      question: 'How do I install PrimeReact?',
      answer: 'npm install primereact primeicons'
    },
    {
      question: 'Is PrimeReact free?',
      answer: 'Yes, PrimeReact is completely free and open source.'
    }
  ];

  return (
    <Accordion>
      {faqs.map((faq, index) => (
        <AccordionTab key={index} header={faq.question}>
          <p>{faq.answer}</p>
        </AccordionTab>
      ))}
    </Accordion>
  );
}
```

---

## Key Properties/Props

### Accordion Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeIndex` | `number \| number[]` | `null` | Index or array of indexes of active tabs. Number for single mode, array for multiple mode. |
| `multiple` | `boolean` | `false` | When true, allows multiple tabs to be expanded at the same time. |
| `onTabChange` | `function` | `null` | Callback fired when a tab is expanded/collapsed. Event includes `index` (number or number[]) property. |
| `className` | `string` | `null` | CSS class(es) applied to the accordion container. |
| `style` | `object` | `null` | Inline styles applied to the accordion container. |
| `id` | `string` | `null` | Unique identifier for the component. |
| `pt` | `object` | `null` | PassThrough props for customizing internal DOM elements. |
| `ptOptions` | `object` | `null` | Options for PassThrough configuration. |
| `unstyled` | `boolean` | `false` | When true, disables default PrimeReact styling (useful with Tailwind). |

### AccordionTab Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `string \| React.ReactNode` | `null` | Header text or JSX element displayed for the tab. |
| `disabled` | `boolean` | `false` | When true, prevents the tab from being expanded/collapsed. |
| `style` | `object` | `null` | Inline styles applied to the AccordionTab container. |
| `className` | `string` | `null` | CSS class(es) applied to the AccordionTab container. |
| `headerStyle` | `object` | `null` | Inline styles applied to the header element. |
| `headerClassName` | `string` | `null` | CSS class(es) applied to the header element. |
| `contentStyle` | `object` | `null` | Inline styles applied to the content container. |
| `contentClassName` | `string` | `null` | CSS class(es) applied to the content container. |
| `headerTemplate` | `function` | `null` | Custom template function for rendering the header. Receives `options` object with header information. |

---

## Event Handling

### onTabChange Event

The `onTabChange` callback receives an event object with the following structure:

```javascript
{
  index: 0,           // Single mode: number
  // or
  index: [0, 2],      // Multiple mode: array of numbers
  originalEvent: {...}  // Browser event
}
```

Example:
```jsx
const handleTabChange = (e) => {
  console.log('Active tabs:', e.index);
  setActiveIndex(e.index);
};

<Accordion activeIndex={activeIndex} onTabChange={handleTabChange}>
  ...
</Accordion>
```

---

## Interactive Features & Behaviors

### Single Expansion (Default)
- Only one tab can be expanded at a time
- Expanding a new tab automatically collapses the previously active tab
- `activeIndex` is a single number
- Best for: Feature lists, settings panels, step-by-step processes

### Multiple Expansion
- Multiple tabs can be expanded simultaneously
- Each tab toggles independently
- `activeIndex` is an array of numbers
- Enable with `multiple` prop
- Best for: FAQ pages, documentation sections, expandable lists

### Controlled vs Uncontrolled

**Uncontrolled (Default):**
```jsx
<Accordion activeIndex={0}>
  // Component manages state internally
</Accordion>
```

**Controlled:**
```jsx
<Accordion
  activeIndex={activeIndex}
  onTabChange={(e) => setActiveIndex(e.index)}
>
  // External state management
</Accordion>
```

Controlled accordions are recommended when you need to:
- Sync accordion state with other components
- Programmatically change active tabs
- Persist accordion state to URL or storage
- Integrate with form validation

---

## Animation & Transitions

PrimeReact Accordion includes built-in smooth transitions for expanding/collapsing:
- Tab headers smoothly animate when toggled
- Content expands/collapses with smooth height animation
- Transitions controlled by the PrimeReact theme
- Duration typically 300-500ms depending on theme

Transitions cannot be directly disabled through props but can be overridden via CSS:
```css
.p-accordion-content {
  transition: none !important;
}
```

---

## Accessibility Features

### ARIA Attributes
- **Accordion Container**: `role="presentation"`
- **Tab Header**: `role="button"`, `aria-expanded`, `aria-controls`
- **Tab Content**: `role="region"`, `aria-labelledby` (points to header)
- **Disabled State**: `aria-disabled="true"` on disabled tabs

### Keyboard Support
| Key | Function |
|-----|----------|
| **Tab** | Moves focus to the next accordion header |
| **Shift+Tab** | Moves focus to the previous accordion header |
| **Enter** | Toggles the focused tab open/closed |
| **Space** | Toggles the focused tab open/closed |
| **Down Arrow** | Moves focus to next header (within accordion) |
| **Up Arrow** | Moves focus to previous header (within accordion) |
| **Home** | Moves focus to first header |
| **End** | Moves focus to last header |

### Screen Reader Support
- Headers are announced with their content
- Expanded/collapsed state is announced
- Content regions are properly labeled
- Disabled state is announced for disabled tabs

### Best Practices for Accessibility
1. Always use meaningful text in headers
2. Avoid putting only icons in headers without text
3. Use semantic HTML in accordion content
4. Test with screen readers (NVDA, JAWS, VoiceOver)
5. Ensure sufficient color contrast in custom styling
6. Don't rely solely on color to convey state

---

## Composition Patterns

### With Forms
```jsx
function FormAccordion() {
  const [formData, setFormData] = useState({});

  return (
    <Accordion>
      <AccordionTab header="Personal Info">
        <div className="field">
          <label>Name</label>
          <InputText
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.value})}
          />
        </div>
      </AccordionTab>
      <AccordionTab header="Contact Info">
        <div className="field">
          <label>Email</label>
          <InputText
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.value})}
          />
        </div>
      </AccordionTab>
    </Accordion>
  );
}
```

### With DataTable
```jsx
function DataAccordion() {
  return (
    <Accordion>
      <AccordionTab header="Users">
        <DataTable value={users}>
          <Column field="name" header="Name"></Column>
          <Column field="email" header="Email"></Column>
        </DataTable>
      </AccordionTab>
    </Accordion>
  );
}
```

### Dynamic Tabs from Array
```jsx
function DynamicAccordion({ items }) {
  return (
    <Accordion>
      {items.map((item, index) => (
        <AccordionTab key={index} header={item.title}>
          {item.content}
        </AccordionTab>
      ))}
    </Accordion>
  );
}
```

---

## Notable Features

### 1. **Flexible Header Content**
Headers accept both strings and JSX elements, enabling rich header designs with icons, badges, and custom layouts.

### 2. **Multiple Expansion Mode**
The `multiple` prop elegantly transforms the component from single-select to multi-select behavior without requiring different components.

### 3. **Header Templates**
`headerTemplate` prop allows complete customization of tab headers through a function, enabling dynamic header rendering with component state.

### 4. **Disabled Tabs**
Individual tabs can be disabled via the `disabled` prop, providing granular control over which sections are expandable.

### 5. **Controlled State Management**
Full support for controlled components through `activeIndex` and `onTabChange`, enabling integration with Redux, Context, and other state management solutions.

### 6. **Theme Inheritance**
Automatically inherits PrimeReact theme styling, ensuring visual consistency with other components in the application.

### 7. **PassThrough API**
Advanced customization via PassThrough props allows deep DOM customization without needing to override CSS.

---

## Common Patterns

### Settings Panel
A multi-section settings interface where users can configure different aspects of the application:
```jsx
<Accordion multiple>
  <AccordionTab header="Display">Settings for display</AccordionTab>
  <AccordionTab header="Privacy">Settings for privacy</AccordionTab>
  <AccordionTab header="Notifications">Settings for notifications</AccordionTab>
</Accordion>
```

### FAQ Section
A frequently asked questions section where each question is a collapsible header:
```jsx
<Accordion>
  {faqItems.map((faq) => (
    <AccordionTab key={faq.id} header={faq.question}>
      {faq.answer}
    </AccordionTab>
  ))}
</Accordion>
```

### Step-by-Step Process
An accordion showing sequential steps, with one step active at a time:
```jsx
<Accordion activeIndex={currentStep} onTabChange={(e) => setCurrentStep(e.index)}>
  <AccordionTab header="Step 1: Enter Details">...</AccordionTab>
  <AccordionTab header="Step 2: Confirm">...</AccordionTab>
  <AccordionTab header="Step 3: Payment">...</AccordionTab>
</Accordion>
```

### Collapsible Navigation
A sidebar navigation with groupable sections that can be expanded/collapsed:
```jsx
<Accordion multiple>
  <AccordionTab header="Main Menu">
    <Menu model={mainItems} />
  </AccordionTab>
  <AccordionTab header="Admin">
    <Menu model={adminItems} />
  </AccordionTab>
</Accordion>
```

---

## Related Components

- **TabView**: Similar horizontal tabbed interface with different visual presentation
- **Menu**: Vertical menu with grouping capabilities
- **Panel**: Single collapsible panel
- **Splitter**: Resizable layout without collapse functionality
- **Fieldset**: Grouping with optional legend (non-collapsible alternative)

---

## Styling & Theming

### CSS Classes

Built-in CSS classes for customization:
- `p-accordion`: Main accordion container
- `p-accordion-tab`: Individual tab container
- `p-accordion-header`: Tab header element
- `p-accordion-header-link`: Clickable header link
- `p-accordion-header-text`: Header text content
- `p-accordion-toggle-icon`: Expand/collapse icon
- `p-accordion-content`: Content container
- `p-accordion-body`: Tab content wrapper

### Theme Inheritance

Accordion automatically inherits theme colors and styles:
```jsx
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Accordion will use Lara Light Blue theme colors
<Accordion>...</Accordion>
```

### PassThrough Customization

Deep DOM customization using PassThrough API:
```jsx
<Accordion
  pt={{
    root: { className: 'custom-accordion' },
    accordiontab: { className: 'custom-tab' },
    accordionheader: { className: 'custom-header' },
    accordioncontent: { className: 'custom-content' }
  }}
>
  ...
</Accordion>
```

---

## Performance Considerations

### Best Practices

1. **Memoize Complex Headers**
   ```jsx
   const headerComponent = useMemo(
     () => <ComplexHeader />,
     [dependencies]
   );
   ```

2. **Lazy Load Content**
   ```jsx
   const [loadedTabs, setLoadedTabs] = useState(new Set());

   const handleTabChange = (e) => {
     setLoadedTabs(prev => new Set([...prev, e.index]));
   };
   ```

3. **Virtualize Long Lists**
   ```jsx
   // If accordion contains DataTable with many rows
   <DataTable virtual virtualScrollerOptions={{rows: 100}}>
     ...
   </DataTable>
   ```

### Optimization Tips

- Use `key` prop when rendering AccordionTabs in loops
- Avoid expensive computations in headers
- Cache header templates if they're static
- Consider lazy loading tab content for better initial load time

---

## Testing Recommendations

### Unit Testing

```jsx
describe('Accordion', () => {
  it('should expand tab on click', () => {
    const { getByText } = render(
      <Accordion>
        <AccordionTab header="Header 1">Content</AccordionTab>
      </Accordion>
    );

    fireEvent.click(getByText('Header 1'));
    expect(getByText('Content')).toBeVisible();
  });

  it('should handle controlled state', () => {
    const { rerender } = render(
      <Accordion activeIndex={0}>
        <AccordionTab header="Header">Content</AccordionTab>
      </Accordion>
    );

    rerender(
      <Accordion activeIndex={null}>
        <AccordionTab header="Header">Content</AccordionTab>
      </Accordion>
    );
  });
});
```

### Accessibility Testing

```jsx
// Test keyboard navigation
fireEvent.keyDown(header, { key: 'Enter' });
fireEvent.keyDown(header, { key: ' ' }); // Space

// Test ARIA attributes
expect(header).toHaveAttribute('aria-expanded', 'true');
expect(content).toHaveAttribute('aria-labelledby', headerId);
```

---

## Developer Experience Notes

### Strengths

1. **Simple API**: Straightforward props for common use cases
2. **Flexible Content**: Headers and content accept any JSX
3. **State Management**: Both controlled and uncontrolled modes supported
4. **Theme Integration**: Automatic theme inheritance
5. **Accessibility**: WCAG 2.1 AA compliant out of the box
6. **Rich Customization**: PassThrough API for deep control

### Limitations

1. **No Built-in Animations Control**: Animation duration/easing cannot be configured through props
2. **Limited Layout Options**: Always vertical, no horizontal accordion variant
3. **No Built-in Search/Filter**: Must implement filtering logic externally
4. **Icon Position**: Icons must be manually positioned in custom headers
5. **No Drag-and-Drop**: Reordering tabs requires custom implementation

### Common Gotchas

1. **Multiple Mode activeIndex**: Must be an array `[0, 2]` not a number
2. **Uncontrolled Limitations**: Cannot programmatically change active tab after initial render
3. **Nested Accordions**: Focus management may be tricky with deeply nested accordions
4. **Content Re-render**: Accordion remounts content when tabs change (destroyed/recreated)

---

## Comparison with Other Frameworks

| Feature | PrimeReact | Chakra UI | Material-UI | Headless UI |
|---------|-----------|-----------|-------------|-------------|
| **Single Expansion** | ✅ | ✅ | ✅ | ✅ |
| **Multiple Expansion** | ✅ | ✅ | ✅ | ✅ |
| **Controlled State** | ✅ | ✅ | ✅ | ✅ |
| **Theme Support** | ✅ | ✅ | ✅ | ❌ (headless) |
| **Keyboard Navigation** | ✅ | ✅ | ✅ | ✅ |
| **ARIA Support** | ✅ | ✅ | ✅ | ✅ |
| **Header Templates** | ✅ | ✅ | ✅ | ✅ |
| **Custom Animations** | ❌ | ✅ | ✅ | ✅ (via CSS) |
| **Icon Integration** | Composed | Native | Composed | Composed |
| **Horizontal Variant** | ❌ | ❌ | ❌ | ❌ |

---

## Architecture Approach

PrimeReact Accordion follows these design principles:

1. **Component Composition**: Uses parent (Accordion) and child (AccordionTab) components for clear hierarchy
2. **Prop-Driven**: State controlled through props rather than refs
3. **Theme-First**: Designed to inherit and work with PrimeReact's theming system
4. **Accessibility-First**: ARIA and keyboard support built-in from the start
5. **Customization-Friendly**: Multiple customization layers (className, style, headerTemplate, PassThrough)

---

## Implementation Patterns

### Pattern 1: Form Sections
```jsx
// Multi-step form using accordion
<Accordion activeIndex={activeStep} onTabChange={(e) => setActiveStep(e.index)}>
  <AccordionTab header="Personal Information" disabled={!step1Complete}>
    <PersonalForm />
  </AccordionTab>
  <AccordionTab header="Address" disabled={!step2Complete}>
    <AddressForm />
  </AccordionTab>
</Accordion>
```

### Pattern 2: Documentation Navigation
```jsx
// Nested documentation sections
<Accordion multiple>
  <AccordionTab header="Getting Started">
    <Accordion>
      <AccordionTab header="Installation">...</AccordionTab>
      <AccordionTab header="Configuration">...</AccordionTab>
    </Accordion>
  </AccordionTab>
</Accordion>
```

### Pattern 3: Dynamic Content
```jsx
// Accordion powered by data
<Accordion activeIndex={selectedIndex} onTabChange={(e) => setSelectedIndex(e.index)}>
  {dataItems.map((item) => (
    <AccordionTab key={item.id} header={item.title}>
      <ItemDetail data={item} />
    </AccordionTab>
  ))}
</Accordion>
```

---

## Known Issues & Workarounds

### Issue: Content Not Updating on State Change
When AccordionTab content depends on external state, ensure the entire Accordion is re-rendered:
```jsx
// Good: Entire accordion is keyed
<Accordion key={refreshKey}>
  <AccordionTab header="...">
    {externalState}
  </AccordionTab>
</Accordion>

// Avoid: Direct mutation of content
```

### Issue: Multiple Mode with Dynamic Tabs
When adding/removing tabs dynamically, ensure activeIndex array is updated accordingly:
```jsx
const [tabs, setTabs] = useState([...]);
const [activeIndexes, setActiveIndexes] = useState([0]);

const addTab = () => {
  setTabs([...tabs, newTab]);
  // activeIndexes automatically stays valid
};
```

---

## Summary of Key Findings

### Core Strengths

1. **Dual-Mode Capability**: Seamlessly switches between single-selection and multi-selection behaviors
2. **Rich Customization**: Headers, templates, styling, and deep DOM customization via PassThrough
3. **Accessibility First**: Full WCAG 2.1 AA compliance with comprehensive keyboard navigation
4. **Theme Integration**: Automatic inheritance of PrimeReact theme system
5. **State Management**: Supports both controlled and uncontrolled usage patterns

### Design Philosophy

- **Progressive Enhancement**: Simple to use for basic cases, powerful for advanced customization
- **Composable**: Designed to work well with other PrimeReact components
- **Standards-Compliant**: Follows WAI-ARIA accordion patterns
- **Developer-Friendly**: Clear API with TypeScript support and comprehensive examples

### Recommended Use Cases

- Frequently Asked Questions (FAQ) pages
- Settings and preferences panels
- Step-by-step wizards and forms
- Documentation and help sections
- Grouped content exploration
- Collapsible navigation menus

### Key Takeaways for Implementation

1. **Choose Single vs Multiple Mode**: Based on whether users need to compare content across sections
2. **Leverage Controlled State**: For integration with routing, forms, and state management
3. **Use Header Templates**: To enable rich, dynamic header designs
4. **Maintain Accessibility**: Preserve ARIA attributes in custom implementations
5. **Consider Content Weight**: Large content can be lazy-loaded to improve performance
6. **Plan for Nesting**: Nested accordions work but require careful focus management

---

**Research Completed:** 2025-11-05
**Component:** Accordion
**Framework:** PrimeReact
**Documentation:** https://primereact.org/accordion/
