# PrimeReact - Dropdown Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://primereact.org/dropdown/
Status: ✅ Working
Version: Latest (PrimeReact)
Last Verified: 2025-11-05

## Documentation Quality
Good - The documentation provides comprehensive examples with live demos covering most common use cases including filtering, templates, grouping, and virtual scrolling. The examples demonstrate the component's flexibility, though formal API tables with prop types and defaults are not prominently displayed on the main page. Template examples show the pattern but don't include the complete implementation code for data structures.

## Component Definition
- **Core purpose**: Provides a dropdown selection component (also called Select) that enables users to choose a single value from a collection of options. Supports filtering, grouping, templates, virtual scrolling, and custom rendering.
- **Mental model**: A controlled component that displays a trigger button showing the selected value, which when clicked reveals a floating panel of options. The component manages keyboard navigation, filtering, and selection state internally while exposing the selected value through onChange.
- **Semantic meaning**: Represents a single-choice input control that provides a compact way to present multiple options. The dropdown pattern communicates that only one option can be selected at a time, with the selected value prominently displayed when the panel is closed.

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple options | ✅ | Native | Array of primitives (strings, numbers) passed to `options` prop |
| Object options | ✅ | Native | Array of objects with `optionLabel` and `optionValue` props to specify which properties to use |
| Grouped options | ✅ | Native | Nested option structure with `optionGroupLabel` and `optionGroupChildren` props |
| Custom option rendering | ✅ | Native | `itemTemplate` prop accepts a function to render custom option content |
| Custom value display | ✅ | Native | `valueTemplate` prop accepts a function to customize selected value display |
| Panel footer | ✅ | Native | `panelFooterTemplate` prop for additional content at bottom of dropdown panel |
| Custom dropdown icon | ✅ | Native | `dropdownIcon` prop accepts a function that can render different icons based on overlay state |

## Selection Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single selection | ✅ | Native | Core functionality - controlled via `value` and `onChange` props |
| Checkmark indicator | ✅ | Native | `checkmark={true}` shows checkmark for selected option instead of highlight |
| Highlight on select | ✅ | Native | `highlightOnSelect` prop controls whether selected option is highlighted |
| Clear selection | ✅ | Native | `showClear` boolean prop displays a clear icon to reset selection |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` boolean prop prevents all interaction |
| Loading | ✅ | Native | `loading` boolean prop shows loading state with placeholder |
| Invalid | ✅ | Native | `invalid` boolean prop indicates validation failure with error styling |

## Input Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Editable | ✅ | Native | `editable` boolean prop allows typing to filter or manually enter values |
| Filtering | ✅ | Native | `filter` boolean prop enables built-in search/filter functionality |
| Filter input attrs | ✅ | Native | `filterInputProps` object for passing ARIA attributes to filter input |
| Placeholder | ✅ | Native | `placeholder` string prop for empty state text |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Visual variants | ✅ | Native | `variant` prop with "filled" or "outlined" styles |
| Float label | ✅ | Composed | Works with PrimeReact's `FloatLabel` wrapper component |

## Performance Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Virtual scrolling | ✅ | Native | `virtualScrollerOptions` prop with `itemSize` configuration for large datasets |
| Lazy loading | ⚠️ | Unclear | Not explicitly documented, may work with virtual scroll |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| ARIA labels | ✅ | Native | `aria-label` and `aria-labelledby` props supported |
| Keyboard navigation | ✅ | Native | Full keyboard support (Tab, Space, Enter, Escape, Arrow keys) |
| Screen reader | ✅ | Native | Proper ARIA roles and announcements (`combobox`, `aria-expanded`, `aria-activedescendant`) |

## Code Examples

### Basic Usage
```jsx
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';

function BasicExample() {
  const [selectedCity, setSelectedCity] = useState(null);

  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Paris', code: 'PRS' }
  ];

  return (
    <Dropdown
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.value)}
      options={cities}
      optionLabel="name"
      placeholder="Select a City"
      className="w-full md:w-14rem"
    />
  );
}
```

### Simple Array Options
```jsx
// Using primitive values
const numbers = [1, 2, 3, 4, 5];

<Dropdown
  value={selectedNumber}
  onChange={(e) => setSelectedNumber(e.value)}
  options={numbers}
  placeholder="Select a Number"
/>
```

### Checkmark Style
```jsx
// Shows checkmark instead of highlight for selected option
<Dropdown
  value={selectedCity}
  onChange={(e) => setSelectedCity(e.value)}
  options={cities}
  optionLabel="name"
  checkmark={true}
  highlightOnSelect={false}
  placeholder="Select a City"
  className="w-full md:w-14rem"
/>
```

### Editable Dropdown
```jsx
// Allows typing to filter or manually enter values
<Dropdown
  value={selectedCity}
  onChange={(e) => setSelectedCity(e.value)}
  options={cities}
  optionLabel="name"
  editable
  placeholder="Select a City"
  className="w-full md:w-14rem"
/>
```

### With Filtering
```jsx
// Enables search/filter functionality
<Dropdown
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.value)}
  options={countries}
  optionLabel="name"
  filter
  placeholder="Select a Country"
  className="w-full md:w-14rem"
/>
```

### Clear Icon
```jsx
// Displays clear button to reset selection
<Dropdown
  value={selectedCity}
  onChange={(e) => setSelectedCity(e.value)}
  options={cities}
  optionLabel="name"
  showClear
  placeholder="Select a City"
  className="w-full md:w-14rem"
/>
```

### Grouped Options
```jsx
function GroupedExample() {
  const [selectedCity, setSelectedCity] = useState(null);

  const groupedCities = [
    {
      label: 'Germany',
      code: 'DE',
      items: [
        { label: 'Berlin', value: 'Berlin' },
        { label: 'Frankfurt', value: 'Frankfurt' },
        { label: 'Hamburg', value: 'Hamburg' }
      ]
    },
    {
      label: 'USA',
      code: 'US',
      items: [
        { label: 'Chicago', value: 'Chicago' },
        { label: 'Los Angeles', value: 'Los Angeles' },
        { label: 'New York', value: 'New York' }
      ]
    }
  ];

  const groupedItemTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  return (
    <Dropdown
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.value)}
      options={groupedCities}
      optionLabel="label"
      optionGroupLabel="label"
      optionGroupChildren="items"
      optionGroupTemplate={groupedItemTemplate}
      placeholder="Select a City"
      className="w-full md:w-14rem"
    />
  );
}
```

### Custom Templates
```jsx
function TemplateExample() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const countries = [
    { name: 'Australia', code: 'AU', flag: '🇦🇺' },
    { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
    { name: 'China', code: 'CN', flag: '🇨🇳' },
    { name: 'France', code: 'FR', flag: '🇫🇷' }
  ];

  // Template for selected value display
  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <span className="mr-2">{option.flag}</span>
          <div>{option.name}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  // Template for dropdown options
  const countryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <span className="mr-2">{option.flag}</span>
        <div>{option.name}</div>
      </div>
    );
  };

  // Template for panel footer
  const panelFooterTemplate = () => {
    return (
      <div className="py-2 px-3">
        <b>{countries.length}</b> countries available
      </div>
    );
  };

  return (
    <Dropdown
      value={selectedCountry}
      onChange={(e) => setSelectedCountry(e.value)}
      options={countries}
      optionLabel="name"
      placeholder="Select a Country"
      valueTemplate={selectedCountryTemplate}
      itemTemplate={countryOptionTemplate}
      panelFooterTemplate={panelFooterTemplate}
      className="w-full md:w-14rem"
    />
  );
}
```

### Custom Dropdown Icon
```jsx
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { ChevronRightIcon } from 'primereact/icons/chevronright';

<Dropdown
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.value)}
  options={countries}
  optionLabel="name"
  placeholder="Select a Country"
  dropdownIcon={(opts) => {
    // Show different icon based on whether overlay is visible
    return opts.iconProps['data-pr-overlay-visible']
      ? <ChevronRightIcon {...opts.iconProps} />
      : <ChevronDownIcon {...opts.iconProps} />;
  }}
  className="w-full md:w-14rem"
/>
```

### Virtual Scrolling
```jsx
// For large datasets - improves performance
function VirtualScrollExample() {
  const [selectedItem, setSelectedItem] = useState(null);

  // Generate large dataset
  const items = Array.from({ length: 10000 }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: i + 1
  }));

  return (
    <Dropdown
      value={selectedItem}
      onChange={(e) => setSelectedItem(e.value)}
      options={items}
      optionLabel="label"
      virtualScrollerOptions={{ itemSize: 38 }}
      placeholder="Select Item"
      className="w-full md:w-14rem"
    />
  );
}
```

### Float Label
```jsx
import { FloatLabel } from 'primereact/floatlabel';

<FloatLabel>
  <Dropdown
    inputId="dd-city"
    value={selectedCity}
    onChange={(e) => setSelectedCity(e.value)}
    options={cities}
    optionLabel="name"
    className="w-full"
  />
  <label htmlFor="dd-city">Select a City</label>
</FloatLabel>
```

### Variant Styles
```jsx
// Filled variant (default is outlined)
<Dropdown
  variant="filled"
  value={selectedCity}
  onChange={(e) => setSelectedCity(e.value)}
  options={cities}
  optionLabel="name"
  placeholder="Select a City"
  className="w-full md:w-14rem"
/>
```

### State Variations
```jsx
// Loading state
<Dropdown
  loading
  placeholder="Loading..."
  className="w-full md:w-14rem"
/>

// Invalid state (validation error)
<Dropdown
  invalid
  value={selectedCity}
  onChange={(e) => setSelectedCity(e.value)}
  options={cities}
  optionLabel="name"
  placeholder="Select a City"
  className="w-full md:w-14rem"
/>

// Disabled state
<Dropdown
  disabled
  placeholder="Select a City"
  className="w-full md:w-14rem"
/>
```

### Accessibility
```jsx
// Using aria-labelledby
<span id="dd1">Options</span>
<Dropdown aria-labelledby="dd1" options={cities} />

// Using aria-label
<Dropdown aria-label="City Options" options={cities} />

// Filter input with ARIA attributes
<Dropdown
  filter
  filterInputProps={{
    'aria-label': 'Filter cities',
    'aria-describedby': 'filter-help'
  }}
  options={cities}
/>
```

## Notable Features

### 1. **Comprehensive Template System**
PrimeReact Dropdown provides three distinct template props:
- `itemTemplate` for customizing option rendering in the dropdown panel
- `valueTemplate` for customizing the selected value display
- `panelFooterTemplate` for adding content at the bottom of the panel
- `optionGroupTemplate` for custom group header rendering

This enables rich, branded option displays without wrapper components.

### 2. **Built-in Filtering**
The `filter` prop enables instant search functionality with no additional configuration. Can be combined with `editable` for manual value entry.

### 3. **Virtual Scrolling for Performance**
Native virtual scrolling support via `virtualScrollerOptions` handles large datasets efficiently by only rendering visible items. The `itemSize` property configures the height of each option.

### 4. **Flexible Option Data Structures**
Supports multiple option formats:
- Primitive arrays (strings, numbers)
- Object arrays with configurable label/value properties
- Grouped/nested structures with parent-child relationships
- Custom data shapes via templates

### 5. **Grouped Options Support**
Native grouping through `optionGroupLabel`, `optionGroupChildren`, and `optionGroupTemplate` props eliminates the need for complex data transformations or custom option components.

### 6. **Custom Dropdown Icon with State Awareness**
The `dropdownIcon` prop accepts a function that receives the overlay state, enabling different icons for open/closed states. This is more sophisticated than a simple icon prop.

### 7. **Controlled Component Pattern**
Uses React controlled component pattern with `value` and `onChange` props. The `onChange` event provides `e.value` containing the selected option's value.

### 8. **Checkmark Selection Indicator**
The `checkmark` prop combined with `highlightOnSelect={false}` provides an alternative selection indicator style, useful for designs where highlighting may not fit the aesthetic.

### 9. **Loading State Management**
Simple `loading` boolean prop handles async option loading scenarios, automatically showing appropriate UI feedback.

### 10. **Accessibility First**
Comprehensive ARIA support out of the box with proper roles, keyboard navigation, and screen reader announcements. Follows WCAG guidelines for combobox pattern.

## Research Notes

### Architecture Approach
PrimeReact Dropdown follows a **controlled component pattern** with:
- State managed externally via `value` and `onChange`
- Rich customization through template function props
- Native support for complex patterns (grouping, virtual scroll, filtering)
- Prop-based configuration for all major features

### Comparison with Other Frameworks
- **More template-focused** than simpler select components (basic HTML select)
- **Prop-driven templates** rather than slot-based composition (unlike Vue components)
- **Virtual scrolling built-in** unlike many competitors requiring additional libraries
- **Rich option types** support compared to Material-UI which requires more manual option wrapping
- Similar to Ant Design's Select but with more explicit template props

### Strengths
1. Comprehensive feature set with no additional libraries needed
2. Template system provides excellent customization flexibility
3. Virtual scrolling handles large datasets efficiently
4. Grouped options work without complex data manipulation
5. Excellent accessibility support out of the box
6. Clear, controlled component pattern
7. Loading and invalid states handled elegantly
8. Editable + filter combination enables flexible input patterns
9. Custom icon function receives state information
10. Panel footer template enables action buttons or summaries

### Limitations
1. Template functions require understanding React rendering patterns
2. No compound component pattern for complex compositions
3. Formal API documentation not prominently displayed on main page
4. Data structure examples not fully shown in documentation
5. Multi-select requires separate MultiSelect component
6. Clear icon position/styling not configurable via props
7. Panel positioning/alignment options not clearly documented
8. Filter behavior (case sensitivity, matching algorithm) not fully specified
9. No built-in option creation/tagging pattern
10. Animation/transition customization not obvious

### Developer Experience
- **Discoverability**: Examples are clear but formal prop API requires deeper documentation dive
- **Type Safety**: TypeScript support available but not shown in basic examples
- **Customization**: Template system is powerful but requires function props knowledge
- **Migration**: Straightforward for developers familiar with controlled components
- **Learning Curve**: Basic usage is simple, templates require more React knowledge

### Pattern Observations

**Data Structure Flexibility**:
The component handles various option structures elegantly:
```jsx
// Primitives
options={[1, 2, 3]}

// Objects
options={[{name: 'A', code: 1}]} optionLabel="name" optionValue="code"

// Grouped
options={[{label: 'Group', items: [...]}]} optionGroupChildren="items"
```

**Template Function Pattern**:
Templates receive different parameters based on context:
```jsx
// Item template receives the option
itemTemplate={(option) => <div>{option.name}</div>}

// Value template receives option and props (for placeholder access)
valueTemplate={(option, props) => option ? <div>{option.name}</div> : props.placeholder}

// Icon function receives opts with state detection
dropdownIcon={(opts) => opts.iconProps['data-pr-overlay-visible'] ? <IconA /> : <IconB />}
```

**State Management Pattern**:
Follows standard React controlled component:
```jsx
const [value, setValue] = useState(null);
<Dropdown value={value} onChange={(e) => setValue(e.value)} />
```

### Integration Patterns

**With Forms**:
Works naturally with form libraries through controlled component pattern:
```jsx
<Controller
  name="country"
  control={control}
  render={({ field }) => (
    <Dropdown {...field} options={countries} />
  )}
/>
```

**With Validation**:
The `invalid` prop integrates with validation state:
```jsx
<Dropdown
  invalid={!!errors.country}
  {...register('country')}
/>
```

### Performance Considerations

1. **Virtual Scrolling**: Essential for > 100 options
2. **Template Functions**: Should be memoized if expensive
3. **Filter Performance**: Built-in filtering is client-side only
4. **Re-render Optimization**: Value comparisons use reference equality

### Potential Semantic UI Patterns

This research suggests several patterns for Semantic UI:

1. **Template Props vs Slots**: Consider both patterns for flexibility
2. **Virtual Scrolling**: Important for select/dropdown performance
3. **Grouped Options**: Native support prevents data transformation complexity
4. **State-Aware Icons**: Icon functions with state access enable richer interactions
5. **Controlled Pattern**: Maintain React controlled component conventions
6. **Accessibility First**: ARIA support should be comprehensive by default
7. **Filter + Editable**: Combining search and manual input is powerful
8. **Clear Action**: Built-in clear functionality is expected in modern selects
9. **Panel Footer**: Enables actions (e.g., "Add new option") without wrapper components
10. **Multiple Data Formats**: Support primitives, objects, and grouped structures naturally
