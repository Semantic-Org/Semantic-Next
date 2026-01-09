# HeroUI/NextUI - Select Usage Patterns

## Component URL
https://www.heroui.com/docs/components/select
Status: ✅ Working

## Documentation Quality
Excellent - Comprehensive API documentation with numerous code examples, detailed props table, accessibility features, and advanced patterns including virtualization and async loading. Clear and well-organized.

## Component Definition
- **Core purpose**: Displays a collapsible list of options allowing users to choose one or more items from a dropdown menu
- **Mental model**: A native select replacement - users think of it as a clickable field that expands to reveal selectable options
- **Semantic meaning**: Represents a choice mechanism that reveals available options on demand, with semantic HTML integration for forms and accessibility

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Text content | ✅ | Primary content model - items contain text labels |
| Icon support | ✅ | Via `startContent`, `endContent`, and custom `selectorIcon` |
| Media support | ✅ | Can include images/avatars in custom item rendering |
| Custom content | ✅ | Full custom rendering via `renderValue` and custom SelectItem content |
| Rich content items | ✅ | Supports descriptions, avatars, and complex layouts within items |
| Sections | ✅ | Groups items with `SelectSection` component |

## Selection Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Single selection | ✅ | Default mode - `selectionMode="single"` |
| Multiple selection | ✅ | `selectionMode="multiple"` with visual chips/indicators |
| Clearable | ✅ | `isClearable` prop adds clear button |
| Controlled | ✅ | `selectedKeys` + `onSelectionChange` for controlled state |
| Uncontrolled | ✅ | `defaultSelectedKeys` for uncontrolled initialization |
| Empty selection | ✅ | `disallowEmptySelection={false}` allows clearing required selections |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ✅ | Async loading support documented |
| Disabled | ✅ | `isDisabled` for entire component |
| Disabled items | ✅ | `disabledKeys` array for specific items |
| Required | ✅ | `isRequired` shows asterisk indicator |
| Invalid | ✅ | `isInvalid` prop with `errorMessage` support |
| Read-only | ❌ | No explicit read-only state documented |
| Open/closed | ✅ | `isOpen`/`defaultOpen` for controlled/uncontrolled open state |
| Focus states | ✅ | Data attributes for focus, focus-visible, pressed, hover |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ✅ | `sm`, `md`, `lg` via `size` prop |
| Color variants | ✅ | `default`, `primary`, `secondary`, `success`, `warning`, `danger` |
| Visual styles | ✅ | `flat`, `bordered`, `faded`, `underlined` via `variant` prop |
| Border radius | ✅ | `none`, `sm`, `md`, `lg`, `full` via `radius` prop |
| Full width | ✅ | `fullWidth` prop (default true) |
| Multiline | ✅ | `isMultiline` for wrapping long text |

## Label & Description Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Labels | ✅ | `label` prop with required asterisk support |
| Label placement | ✅ | `inside`, `outside`, `outside-left` via `labelPlacement` |
| Placeholder | ✅ | `placeholder` prop (default: "Select an option") |
| Description | ✅ | `description` prop for helper text below field |
| Error messages | ✅ | `errorMessage` prop or function for validation feedback |
| Start content | ✅ | `startContent` for leading icons/elements |
| End content | ✅ | `endContent` for trailing icons/elements |

## Advanced Features
| Feature | Present | Details |
|---------|---------|---------|
| Virtualization | ✅ | `isVirtualized` for 10,000+ items with configurable `maxListboxHeight` and `itemHeight` |
| Search/Typeahead | ✅ | Built-in keyboard typeahead functionality |
| Async loading | ✅ | Support for asynchronous item loading |
| Custom rendering | ✅ | `renderValue` function for custom selected value display |
| Form integration | ✅ | Hidden native select element for form submission |
| Animation control | ✅ | `disableAnimation` prop (default true) |
| Auto focus | ✅ | `autoFocus` prop for immediate focus |
| Scroll indicators | ✅ | `showScrollIndicators` prop (default true) |
| Popover customization | ✅ | `popoverProps` for positioning and behavior |
| Listbox customization | ✅ | `listboxProps` for dropdown list configuration |

## Code Examples

### Basic Usage (Static Collection)
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  const animals = [
    {key: "cat", label: "Cat"},
    {key: "dog", label: "Dog"},
    {key: "elephant", label: "Elephant"},
    {key: "lion", label: "Lion"},
    {key: "tiger", label: "Tiger"},
    {key: "giraffe", label: "Giraffe"}
  ];

  return (
    <Select label="Select an animal">
      {animals.map((animal) => (
        <SelectItem key={animal.key}>
          {animal.label}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### Dynamic Collection
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  const animals = [
    {key: "cat", label: "Cat"},
    {key: "dog", label: "Dog"}
  ];

  return (
    <Select
      items={animals}
      label="Favorite Animal"
      placeholder="Select an animal"
    >
      {(animal) => <SelectItem key={animal.key}>{animal.label}</SelectItem>}
    </Select>
  );
}
```

### Multiple Selection
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  return (
    <Select
      selectionMode="multiple"
      label="Favorite Animals"
      placeholder="Select animals"
    >
      {animals.map((animal) => (
        <SelectItem key={animal.key}>
          {animal.label}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### Disabled Keys
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  return (
    <Select
      label="Favorite Animal"
      disabledKeys={["zebra", "tiger"]}
    >
      {animals.map((animal) => (
        <SelectItem key={animal.key}>
          {animal.label}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### With Description and Error Message
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Favorite Animal"
        description="Choose your favorite animal from the list"
      >
        {animals.map((animal) => (
          <SelectItem key={animal.key}>
            {animal.label}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Favorite Animal"
        isInvalid={true}
        errorMessage="Please select a valid animal"
      >
        {animals.map((animal) => (
          <SelectItem key={animal.key}>
            {animal.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
```

### Controlled Select
```jsx
import {Select, SelectItem} from "@heroui/react";
import {useState} from "react";

export default function App() {
  const [value, setValue] = useState("cat");

  return (
    <div className="flex flex-col gap-2">
      <Select
        label="Favorite Animal"
        selectedKeys={[value]}
        onSelectionChange={(keys) => setValue([...keys][0])}
      >
        {animals.map((animal) => (
          <SelectItem key={animal.key}>
            {animal.label}
          </SelectItem>
        ))}
      </Select>
      <p className="text-small">Selected: {value}</p>
    </div>
  );
}
```

### With Clear Button
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  return (
    <Select
      label="Favorite Animal"
      isClearable
    >
      {animals.map((animal) => (
        <SelectItem key={animal.key}>
          {animal.label}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### Required Selection
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  return (
    <Select
      label="Favorite Animal"
      isRequired
    >
      {animals.map((animal) => (
        <SelectItem key={animal.key}>
          {animal.label}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### Custom Rendering
```jsx
import {Select, SelectItem, Chip} from "@heroui/react";

export default function App() {
  return (
    <Select
      label="Favorite Animal"
      renderValue={(items) => {
        return items.map((item) => (
          <Chip key={item.key}>{item.data.label}</Chip>
        ));
      }}
    >
      {animals.map((animal) => (
        <SelectItem key={animal.key} textValue={animal.label}>
          <div className="flex items-center gap-2">
            <span>{animal.label}</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  );
}
```

### With Sections
```jsx
import {Select, SelectSection, SelectItem} from "@heroui/react";

export default function App() {
  return (
    <Select label="Favorite Animal">
      <SelectSection title="Mammals">
        <SelectItem key="cat">Cat</SelectItem>
        <SelectItem key="dog">Dog</SelectItem>
        <SelectItem key="elephant">Elephant</SelectItem>
      </SelectSection>
      <SelectSection title="Birds">
        <SelectItem key="eagle">Eagle</SelectItem>
        <SelectItem key="parrot">Parrot</SelectItem>
        <SelectItem key="penguin">Penguin</SelectItem>
      </SelectSection>
    </Select>
  );
}
```

### Size Variants
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-col gap-4">
      <Select size="sm" label="Small">
        {animals.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>

      <Select size="md" label="Medium">
        {animals.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>

      <Select size="lg" label="Large">
        {animals.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
```

### Color Variants
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  const colors = ["default", "primary", "secondary", "success", "warning", "danger"];

  return (
    <div className="flex flex-col gap-4">
      {colors.map((color) => (
        <Select
          key={color}
          color={color}
          label={`Color: ${color}`}
        >
          {animals.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>
      ))}
    </div>
  );
}
```

### Style Variants
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  const variants = ["flat", "bordered", "faded", "underlined"];

  return (
    <div className="flex flex-col gap-4">
      {variants.map((variant) => (
        <Select
          key={variant}
          variant={variant}
          label={`Variant: ${variant}`}
        >
          {animals.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>
      ))}
    </div>
  );
}
```

### Label Placement
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-col gap-4">
      <Select labelPlacement="inside" label="Inside">
        {animals.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>

      <Select labelPlacement="outside" label="Outside">
        {animals.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>

      <Select labelPlacement="outside-left" label="Outside Left">
        {animals.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
```

### Start and End Content
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  return (
    <Select
      label="Favorite Animal"
      startContent={<PetIcon />}
      endContent={<InfoIcon />}
    >
      {animals.map((animal) => (
        <SelectItem key={animal.key}>
          {animal.label}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### Custom Selector Icon
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  return (
    <Select
      label="Favorite Animal"
      selectorIcon={<CustomChevronIcon />}
    >
      {animals.map((animal) => (
        <SelectItem key={animal.key}>
          {animal.label}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### Virtualization (Large Lists)
```jsx
import {Select, SelectItem} from "@heroui/react";

export default function App() {
  // Generate 10,000+ items
  const largeDataset = Array.from({length: 10000}, (_, i) => ({
    key: `item-${i}`,
    label: `Item ${i + 1}`
  }));

  return (
    <Select
      label="Select from many options"
      isVirtualized
      maxListboxHeight={256}
      itemHeight={32}
    >
      {largeDataset.map((item) => (
        <SelectItem key={item.key}>
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### Async Loading
```jsx
import {Select, SelectItem} from "@heroui/react";
import {useState, useEffect} from "react";

export default function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate async data loading
    setTimeout(() => {
      setItems([
        {key: "cat", label: "Cat"},
        {key: "dog", label: "Dog"}
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <Select
      label="Favorite Animal"
      items={items}
      isLoading={isLoading}
    >
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
  );
}
```

## API Reference Summary

### Props
- **Selection**: `selectionMode`, `selectedKeys`, `defaultSelectedKeys`, `disabledKeys`, `disallowEmptySelection`
- **Appearance**: `variant`, `color`, `size`, `radius`, `fullWidth`
- **Labels**: `label`, `labelPlacement`, `placeholder`, `description`, `errorMessage`
- **Content**: `startContent`, `endContent`, `selectorIcon`
- **States**: `isDisabled`, `isRequired`, `isInvalid`, `isOpen`, `defaultOpen`, `isMultiline`
- **Clearable**: `isClearable`
- **Virtualization**: `isVirtualized`, `maxListboxHeight`, `itemHeight`
- **Behavior**: `autoFocus`, `disableAnimation`, `disableSelectorIconRotation`, `hideEmptyContent`
- **Advanced**: `popoverProps`, `listboxProps`, `scrollShadowProps`, `classNames`

### Events
- `onSelectionChange(keys: Set | "all")`: Fired when selection changes
- `onChange(e: React.ChangeEvent)`: Standard React change event
- `onOpenChange(isOpen: boolean)`: Fired when dropdown opens/closes
- `onClose()`: Fired when dropdown closes
- `onClear()`: Fired when cleared via clear button

### Custom Rendering
- `renderValue(items: SelectedItems[])`: Custom render function for selected value display

### Data Attributes (for Styling)
**Base Element:**
- `data-filled`, `data-has-value`, `data-has-label`, `data-has-helper`, `data-invalid`

**Trigger Element:**
- `data-open`, `data-disabled`, `data-focus`, `data-focus-visible`, `data-pressed`, `data-hover`

**SelectItem:**
- `data-disabled`, `data-selected`, `data-hover`, `data-pressed`, `data-focus`, `data-focus-visible`

## Notable Features

### React Aria Foundation
- Built on React Aria's `useSelect` and `useListBox` hooks
- Comprehensive accessibility implementation
- Keyboard navigation (Arrow keys, Home, End, PageUp, PageDown)
- Type-ahead search functionality
- Screen reader support with proper ARIA attributes

### Performance Optimizations
- **Virtualization**: Handles 10,000+ items efficiently with configurable row heights
- **Lazy rendering**: Only visible items are rendered in the dropdown
- **Animation control**: Can disable animations for performance

### Form Integration
- Hidden native `<select>` element for standard form submission
- Works with form libraries and native forms
- Proper name/value pair submission
- Browser autofill support

### Flexibility
- **Static collections**: Direct JSX children
- **Dynamic collections**: Data-driven with `items` prop
- **Sections**: Logical grouping with `SelectSection`
- **Custom rendering**: Full control over selected value display
- **Rich item content**: Supports complex layouts within items

### Styling Customization
- **Slot-based styling**: 15+ named slots for granular CSS control
- **Tailwind integration**: Works seamlessly with Tailwind classes
- **Data attributes**: Rich set of state attributes for CSS selectors
- **Theme integration**: Part of HeroUI's design system with consistent color/size scales

### Advanced Capabilities
- **Multiple selection**: Full multi-select support with visual feedback
- **Clearable**: Optional clear button for resetting selection
- **Controlled/Uncontrolled**: Both patterns fully supported
- **Async loading**: Built-in support for loading states and dynamic data
- **Popover configuration**: Full control over dropdown positioning and behavior
- **Scroll indicators**: Visual feedback for scrollable content

## Research Notes

### Design Philosophy
- Component follows React Aria patterns for accessibility-first design
- Emphasizes performance through virtualization for large datasets
- Provides multiple API styles (static/dynamic) for developer flexibility
- Integrates seamlessly with HeroUI's design system while allowing customization

### API Design Patterns
- **Controlled/Uncontrolled duality**: Supports both `value`/`onChange` and `defaultValue` patterns
- **Collection flexibility**: Works with both static JSX and dynamic data arrays
- **Progressive enhancement**: Basic usage is simple, advanced features available when needed
- **Consistent naming**: Props follow HeroUI conventions (is*, show*, disable*)

### Accessibility Highlights
- Full keyboard navigation including typeahead
- Proper focus management and focus visible indicators
- ARIA listbox pattern implementation
- Mobile-friendly with touch interactions
- Screen reader tested and optimized

### Performance Considerations
- Virtualization recommended for >100 items
- Animation disabled by default for better performance
- Configurable item heights for optimal scrolling
- Lazy rendering of dropdown content

### Common Use Cases Supported
1. Simple single selection dropdown
2. Multi-select with tags/chips display
3. Searchable/filterable large lists (via typeahead)
4. Grouped options with sections
5. Form integration with validation
6. Async data loading with loading states
7. Rich content items (avatars, descriptions, icons)
8. Custom styled selects matching design system

### Integration with HeroUI Ecosystem
- Shares color and size tokens with other components
- Works with HeroUI's Popover component for dropdown
- Uses HeroUI's ScrollShadow for scroll indicators
- Integrates with Chip component for multi-select display
- Consistent with other form components (Input, Textarea, etc.)

### Comparison to Native Select
**Advantages:**
- Richer styling capabilities
- Custom content rendering
- Better keyboard navigation
- Virtualization for performance
- Multi-select support
- Programmatic control

**Trade-offs:**
- Larger bundle size
- More complex implementation
- Requires JavaScript (native select works without)
- Additional accessibility testing burden

### Notable Absences
- No inline/combobox hybrid mode (pure dropdown only)
- No built-in filtering UI (relies on typeahead only)
- No option groups nesting (only one level of sections)
- No custom footer/header content in dropdown
- No option to keep dropdown open after selection in single mode
- No built-in "Select All" for multiple selection mode

### Best Practices from Documentation
1. Use `disabledKeys` instead of conditional rendering for better a11y
2. Provide `textValue` for SelectItems with custom content for typeahead
3. Enable virtualization for lists >100 items
4. Use dynamic collections for data-driven lists
5. Provide descriptive labels and error messages for forms
6. Use `renderValue` for custom multi-select display
7. Configure `popoverProps` for dropdown positioning in constrained spaces
8. Use `SelectSection` for logical grouping of >10 items

### Framework Integration
- React-only component (part of HeroUI/NextUI)
- Requires React 18+ for optimal performance
- Server Component compatible (Next.js App Router)
- Works with React Hook Form and other form libraries
- TypeScript definitions included
