# PrimeReact - AutoComplete Component

## Component Overview

The AutoComplete component in PrimeReact is an input field that provides real-time suggestions while being typed. It supports searching, filtering, single and multiple selection modes, custom templates, grouped options, and virtual scrolling for large datasets. The component functions as a controlled component requiring value, onChange, suggestions, and completeMethod properties. PrimeReact's AutoComplete is designed for scenarios where users need to search and select from a predefined list of options, making it ideal for country selectors, user search, product search, tag selection, and any scenario requiring autocomplete functionality.

---

## Usage Patterns

### Basic Usage

The simplest autocomplete configuration with basic string suggestions:

```javascript
import { useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

function BasicAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  const search = (event) => {
    // Simulate a backend call
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  return (
    <AutoComplete
      value={value}
      suggestions={items}
      completeMethod={search}
      onChange={(e) => setValue(e.value)}
      placeholder="Search fruits"
    />
  );
}
```

### Dropdown Mode

AutoComplete with a dropdown button to trigger the suggestions panel:

```javascript
function DropdownAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  return (
    <AutoComplete
      value={value}
      suggestions={items}
      completeMethod={search}
      onChange={(e) => setValue(e.value)}
      dropdown
      dropdownMode="blank"
      placeholder="Select or search"
    />
  );
}
```

**dropdownMode Options:**
- `"blank"` - Sends empty string query when dropdown clicked (default)
- `"current"` - Sends current input value when dropdown clicked

### Object Suggestions

Working with object arrays using the field property:

```javascript
function ObjectAutoComplete() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const countries = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
    { name: 'Germany', code: 'DE' }
  ];

  const searchCountry = (event) => {
    const query = event.query.toLowerCase();
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(query)
    );
    setFilteredCountries(filtered);
  };

  return (
    <AutoComplete
      field="name"
      value={selectedCountry}
      suggestions={filteredCountries}
      completeMethod={searchCountry}
      onChange={(e) => setSelectedCountry(e.value)}
      placeholder="Select a country"
    />
  );
}
```

**Note:** The component stores the entire object instance in the model, not just the field value.

### Force Selection Mode

Validates manual input to ensure it exists in the suggestions list:

```javascript
function ForceSelectionAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  return (
    <AutoComplete
      value={value}
      suggestions={items}
      completeMethod={search}
      onChange={(e) => setValue(e.value)}
      forceSelection
      placeholder="Must select from list"
    />
  );
}
```

When enabled, invalid entries are automatically cleared if they don't match any suggestion.

---

## Variants/Styles

### Filled Variant

AutoComplete with filled background styling:

```javascript
function FilledAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  return (
    <AutoComplete
      value={value}
      suggestions={items}
      completeMethod={search}
      onChange={(e) => setValue(e.value)}
      variant="filled"
      placeholder="Filled variant"
    />
  );
}
```

**Variant Options:**
- `"outlined"` - Default outlined style with border
- `"filled"` - Filled background style

### Float Label

AutoComplete with floating label effect:

```javascript
function FloatLabelAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  return (
    <span className="p-float-label">
      <AutoComplete
        inputId="ac-float"
        value={value}
        suggestions={items}
        completeMethod={search}
        onChange={(e) => setValue(e.value)}
      />
      <label htmlFor="ac-float">Search Items</label>
    </span>
  );
}
```

---

## States

### Invalid State

Display validation error state:

```javascript
function InvalidStateAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);
  const [touched, setTouched] = useState(false);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  const isInvalid = touched && (!value || value.length < 1);

  return (
    <div>
      <AutoComplete
        invalid={isInvalid}
        value={value}
        suggestions={items}
        completeMethod={search}
        onChange={(e) => setValue(e.value)}
        onBlur={() => setTouched(true)}
        placeholder="Required field"
      />
      {isInvalid && <small className="p-error">This field is required</small>}
    </div>
  );
}
```

### Disabled State

Disable the autocomplete input:

```javascript
function DisabledAutoComplete() {
  return (
    <AutoComplete
      disabled
      placeholder="Disabled autocomplete"
    />
  );
}
```

---

## Sizing Options

AutoComplete inherits standard PrimeReact form sizing through className:

```javascript
function SizedAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  return (
    <div className="flex flex-column gap-3">
      <AutoComplete
        value={value}
        suggestions={items}
        completeMethod={search}
        onChange={(e) => setValue(e.value)}
        className="p-inputtext-sm"
        placeholder="Small"
      />

      <AutoComplete
        value={value}
        suggestions={items}
        completeMethod={search}
        onChange={(e) => setValue(e.value)}
        placeholder="Normal (default)"
      />

      <AutoComplete
        value={value}
        suggestions={items}
        completeMethod={search}
        onChange={(e) => setValue(e.value)}
        className="p-inputtext-lg"
        placeholder="Large"
      />
    </div>
  );
}
```

---

## Layout & Positioning

### Virtual Scrolling for Large Datasets

Efficient rendering of large suggestion lists using virtual scrolling:

```javascript
function VirtualScrollAutoComplete() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);

  // Simulate large dataset
  const items = Array.from({ length: 10000 }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: i + 1
  }));

  const searchItems = (event) => {
    const query = event.query.toLowerCase();
    const filtered = items.filter(item =>
      item.label.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

  return (
    <AutoComplete
      value={selectedItem}
      suggestions={filteredItems}
      completeMethod={searchItems}
      virtualScrollerOptions={{ itemSize: 38 }}
      field="label"
      dropdown
      onChange={(e) => setSelectedItem(e.value)}
      placeholder="Search from 10,000 items"
    />
  );
}
```

**Note:** The `itemSize` property is mandatory and defines item height in pixels.

---

## Content & Structure

### Custom Item Template

Customize how suggestion items are displayed:

```javascript
function CustomTemplateAutoComplete() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const countries = [
    { name: 'United States', code: 'US', flag: '🇺🇸' },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪' }
  ];

  const searchCountry = (event) => {
    const query = event.query.toLowerCase();
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(query)
    );
    setFilteredCountries(filtered);
  };

  const itemTemplate = (item) => {
    return (
      <div className="flex align-items-center gap-2">
        <span style={{ fontSize: '1.5rem' }}>{item.flag}</span>
        <div>
          <div>{item.name}</div>
          <div className="text-sm text-color-secondary">{item.code}</div>
        </div>
      </div>
    );
  };

  const selectedItemTemplate = (item) => {
    if (item) {
      return (
        <div className="flex align-items-center gap-2">
          <span>{item.flag}</span>
          <span>{item.name}</span>
        </div>
      );
    }
    return <span>Select a country</span>;
  };

  return (
    <AutoComplete
      field="name"
      value={selectedCountry}
      suggestions={filteredCountries}
      completeMethod={searchCountry}
      onChange={(e) => setSelectedCountry(e.value)}
      itemTemplate={itemTemplate}
      selectedItemTemplate={selectedItemTemplate}
      placeholder="Select a country"
    />
  );
}
```

### Panel Footer Template

Add custom footer content to the suggestions panel:

```javascript
function FooterTemplateAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  const panelFooterTemplate = () => {
    return (
      <div className="p-3 border-top-1 surface-border">
        <small className="text-color-secondary">
          {items.length} result{items.length !== 1 ? 's' : ''} available
        </small>
      </div>
    );
  };

  return (
    <AutoComplete
      value={value}
      suggestions={items}
      completeMethod={search}
      onChange={(e) => setValue(e.value)}
      panelFooterTemplate={panelFooterTemplate}
      placeholder="Search with footer"
    />
  );
}
```

### Grouped Options

Organize suggestions into groups with headers:

```javascript
function GroupedAutoComplete() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);

  const groupedCities = [
    {
      label: 'United States',
      code: 'US',
      items: [
        { label: 'New York', value: 'New York' },
        { label: 'Los Angeles', value: 'Los Angeles' },
        { label: 'Chicago', value: 'Chicago' }
      ]
    },
    {
      label: 'United Kingdom',
      code: 'GB',
      items: [
        { label: 'London', value: 'London' },
        { label: 'Manchester', value: 'Manchester' },
        { label: 'Birmingham', value: 'Birmingham' }
      ]
    },
    {
      label: 'Canada',
      code: 'CA',
      items: [
        { label: 'Toronto', value: 'Toronto' },
        { label: 'Vancouver', value: 'Vancouver' },
        { label: 'Montreal', value: 'Montreal' }
      ]
    }
  ];

  const searchCity = (event) => {
    const query = event.query.toLowerCase();
    const filtered = groupedCities.map(group => ({
      ...group,
      items: group.items.filter(city =>
        city.label.toLowerCase().includes(query)
      )
    })).filter(group => group.items.length > 0);

    setFilteredCities(filtered);
  };

  const groupedItemTemplate = (item) => {
    return (
      <div className="flex align-items-center">
        <span className="font-bold">{item.label}</span>
      </div>
    );
  };

  return (
    <AutoComplete
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.value)}
      suggestions={filteredCities}
      completeMethod={searchCity}
      field="label"
      optionGroupLabel="label"
      optionGroupChildren="items"
      optionGroupTemplate={groupedItemTemplate}
      placeholder="Search cities"
    />
  );
}
```

---

## Interactive Features

### Multiple Selection

Enable selection of multiple items with chip display:

```javascript
function MultipleAutoComplete() {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const countries = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'ES' }
  ];

  const searchCountry = (event) => {
    const query = event.query.toLowerCase();
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(query)
    );
    setFilteredCountries(filtered);
  };

  return (
    <div>
      <AutoComplete
        field="name"
        multiple
        value={selectedCountries}
        suggestions={filteredCountries}
        completeMethod={searchCountry}
        onChange={(e) => setSelectedCountries(e.value)}
        placeholder="Select countries"
      />
      <div className="mt-3">
        <small>Selected: {selectedCountries.length} countries</small>
      </div>
    </div>
  );
}
```

### Multiple Selection with Limit

Restrict the number of selections:

```javascript
function LimitedMultipleAutoComplete() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const items = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango',
                 'Strawberry', 'Pineapple', 'Watermelon'];

  const search = (event) => {
    const query = event.query.toLowerCase();
    const filtered = items.filter(item =>
      item.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

  return (
    <div>
      <AutoComplete
        multiple
        value={selectedItems}
        suggestions={filteredItems}
        completeMethod={search}
        onChange={(e) => setSelectedItems(e.value)}
        selectionLimit={3}
        placeholder="Select up to 3 items"
      />
      <div className="mt-2">
        <small>Selected: {selectedItems.length} / 3</small>
      </div>
    </div>
  );
}
```

### Change Event Handling

Respond to value changes with additional logic:

```javascript
function EventHandlingAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);
  const [searchCount, setSearchCount] = useState(0);
  const [selectionCount, setSelectionCount] = useState(0);

  const search = (event) => {
    setSearchCount(prev => prev + 1);
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  const handleChange = (e) => {
    setValue(e.value);
    if (e.value) {
      setSelectionCount(prev => prev + 1);
    }
  };

  return (
    <div>
      <AutoComplete
        value={value}
        suggestions={items}
        completeMethod={search}
        onChange={handleChange}
        placeholder="Track events"
      />
      <div className="mt-3 text-sm">
        <div>Searches performed: {searchCount}</div>
        <div>Items selected: {selectionCount}</div>
        <div>Current value: {value || '(none)'}</div>
      </div>
    </div>
  );
}
```

---

## Animation & Transitions

PrimeReact AutoComplete includes built-in animations:

```javascript
function AnimatedAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  return (
    <AutoComplete
      value={value}
      suggestions={items}
      completeMethod={search}
      onChange={(e) => setValue(e.value)}
      placeholder="Smooth panel animations"
      transitionOptions={{
        timeout: 300,
        classNames: 'p-autocomplete-panel'
      }}
    />
  );
}
```

**Default Animations:**
- Panel overlay fade-in/fade-out
- Smooth height transitions
- Hover and focus state transitions

---

## Integration Patterns

### With Form Validation

Integrate AutoComplete with form validation libraries:

```javascript
import { useForm, Controller } from 'react-hook-form';

function FormValidationAutoComplete() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [filteredCountries, setFilteredCountries] = useState([]);

  const countries = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Canada', code: 'CA' }
  ];

  const searchCountry = (event) => {
    const query = event.query.toLowerCase();
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(query)
    );
    setFilteredCountries(filtered);
  };

  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label htmlFor="country">Country</label>
        <Controller
          name="country"
          control={control}
          rules={{ required: 'Country is required' }}
          render={({ field }) => (
            <AutoComplete
              id="country"
              field="name"
              value={field.value}
              suggestions={filteredCountries}
              completeMethod={searchCountry}
              onChange={(e) => field.onChange(e.value)}
              invalid={!!errors.country}
              placeholder="Select a country"
            />
          )}
        />
        {errors.country && (
          <small className="p-error">{errors.country.message}</small>
        )}
      </div>
      <button type="submit" className="p-button">Submit</button>
    </form>
  );
}
```

### With API Integration

Real-time API search implementation:

```javascript
import { useState, useRef } from 'react';

function ApiAutoComplete() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeout = useRef(null);

  const searchAPI = async (query) => {
    setLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data.results);
    } catch (error) {
      console.error('Search failed:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const search = (event) => {
    // Debounce API calls
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      searchAPI(event.query);
    }, 300);
  };

  return (
    <div>
      <AutoComplete
        value={value}
        suggestions={suggestions}
        completeMethod={search}
        onChange={(e) => setValue(e.value)}
        field="name"
        placeholder="Search users..."
        disabled={loading}
      />
      {loading && <small className="ml-2">Searching...</small>}
    </div>
  );
}
```

### With Filter Service

Using PrimeReact's FilterService for advanced filtering:

```javascript
import { FilterService } from 'primereact/api';

function FilterServiceAutoComplete() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const countries = [
    { name: 'United States', code: 'US', population: 331000000 },
    { name: 'United Kingdom', code: 'GB', population: 67000000 },
    { name: 'Canada', code: 'CA', population: 38000000 },
    { name: 'Australia', code: 'AU', population: 25000000 }
  ];

  const searchCountry = (event) => {
    const query = event.query;
    const filtered = FilterService.filter(
      countries,
      ['name', 'code'],
      query,
      'contains'
    );
    setFilteredCountries(filtered);
  };

  return (
    <AutoComplete
      field="name"
      value={selectedCountry}
      suggestions={filteredCountries}
      completeMethod={searchCountry}
      onChange={(e) => setSelectedCountry(e.value)}
      placeholder="Search by name or code"
    />
  );
}
```

---

## Accessibility Features

### Screen Reader Support

Proper labeling for screen readers:

```javascript
function AccessibleAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  return (
    <div className="field">
      <label htmlFor="ac-accessible">Favorite Fruit</label>
      <AutoComplete
        inputId="ac-accessible"
        value={value}
        suggestions={items}
        completeMethod={search}
        onChange={(e) => setValue(e.value)}
        placeholder="Select your favorite fruit"
        aria-describedby="ac-help"
      />
      <small id="ac-help">Type to search for fruits</small>
    </div>
  );
}
```

### ARIA Attributes

PrimeReact AutoComplete automatically manages ARIA attributes:

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `role="combobox"` | Identifies the component as a combobox | Applied to input element |
| `aria-autocomplete` | Indicates autocomplete behavior | `"list"` |
| `aria-haspopup` | Indicates popup availability | `"listbox"` |
| `aria-expanded` | Indicates popup visibility | `true` or `false` |
| `aria-controls` | Associates input with popup | Points to suggestion panel ID |
| `aria-activedescendant` | Indicates active option | Points to highlighted option ID |
| `aria-labelledby` / `aria-label` | Provides accessible name | Custom label ID or text |

### Keyboard Navigation

Comprehensive keyboard support for accessibility:

| Key | Behavior |
|-----|----------|
| **Tab** | Moves focus to or away from the autocomplete. If suggestions are visible and an item is highlighted, closes the panel and selects the item. |
| **Up Arrow** | Highlights the previous suggestion when panel is visible |
| **Down Arrow** | Highlights the next suggestion when panel is visible |
| **Enter** | Selects the highlighted suggestion and closes the panel |
| **Escape** | Closes the suggestion panel without selection |
| **Home** | Highlights the first suggestion |
| **End** | Highlights the last suggestion |
| **Backspace** (multiple mode) | Deletes the previous chip when input is empty |
| **Left Arrow** (multiple mode) | Moves focus to the previous chip when input is empty |

### Focus Management

```javascript
function FocusableAutoComplete() {
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);
  const autoCompleteRef = useRef(null);

  const search = (event) => {
    const query = event.query.toLowerCase();
    const suggestions = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango']
      .filter(item => item.toLowerCase().includes(query));
    setItems(suggestions);
  };

  const focusInput = () => {
    autoCompleteRef.current.getInput().focus();
  };

  return (
    <div>
      <AutoComplete
        ref={autoCompleteRef}
        value={value}
        suggestions={items}
        completeMethod={search}
        onChange={(e) => setValue(e.value)}
        placeholder="Focusable autocomplete"
      />
      <button onClick={focusInput} className="mt-2">
        Focus Input
      </button>
    </div>
  );
}
```

---

## Key Properties/Props

### AutoComplete Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any` | `null` | Value of the component |
| `suggestions` | `array` | `null` | Array of suggestions to display |
| `completeMethod` | `function` | `null` | Callback to invoke on search. Receives event with `query` property |
| `onChange` | `function` | `null` | Callback invoked when value changes. Receives event with `value` property |
| `field` | `string` | `null` | Property name to display for object suggestions |
| `dropdown` | `boolean` | `false` | Displays a button next to the input to show suggestions |
| `dropdownMode` | `string` | `"blank"` | Specifies the behavior of dropdown button. `"blank"` or `"current"` |
| `multiple` | `boolean` | `false` | Enables multiple selection mode |
| `selectionLimit` | `number` | `null` | Maximum number of selections allowed in multiple mode |
| `forceSelection` | `boolean` | `false` | When enabled, autocomplete clears invalid input values |
| `virtualScrollerOptions` | `object` | `null` | Configuration for virtual scroller. Requires `itemSize` property |
| `itemTemplate` | `function` | `null` | Template for displaying suggestion items |
| `selectedItemTemplate` | `function` | `null` | Template for displaying selected value |
| `panelFooterTemplate` | `function` | `null` | Template for panel footer |
| `optionGroupLabel` | `string` | `null` | Property name for group label in grouped options |
| `optionGroupChildren` | `string` | `null` | Property name for group items in grouped options |
| `optionGroupTemplate` | `function` | `null` | Template for group headers |
| `placeholder` | `string` | `null` | Placeholder text for the input |
| `disabled` | `boolean` | `false` | When present, it specifies that the component should be disabled |
| `invalid` | `boolean` | `false` | When present, indicates validation failure |
| `variant` | `string` | `"outlined"` | Specifies the visual style. `"outlined"` or `"filled"` |
| `inputId` | `string` | `null` | Identifier of the input element |
| `inputClassName` | `string` | `null` | Style class of the input field |
| `panelClassName` | `string` | `null` | Style class of the overlay panel |
| `aria-label` | `string` | `null` | Establishes a string value for the label |
| `aria-labelledby` | `string` | `null` | Establishes relationship between the component and label |
| `minLength` | `number` | `1` | Minimum number of characters to initiate a search |
| `delay` | `number` | `300` | Delay between keystrokes to wait before searching in milliseconds |
| `scrollHeight` | `string` | `"200px"` | Maximum height of the suggestions panel |
| `autoHighlight` | `boolean` | `false` | When enabled, highlights the first suggestion automatically |
| `showEmptyMessage` | `boolean` | `false` | Whether to show empty message when no results found |
| `emptyMessage` | `string` | `"No results found"` | Text to display when there is no data |
| `className` | `string` | `null` | Style class of the component |
| `style` | `object` | `null` | Inline style of the component |
| `panelStyle` | `object` | `null` | Inline style of the overlay panel |

### Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `onChange` | `event.originalEvent`: Browser event<br>`event.value`: Selected value | Callback invoked when value changes |
| `completeMethod` | `event.originalEvent`: Browser event<br>`event.query`: Search query | Callback invoked to search for suggestions |
| `onFocus` | `event`: Browser event | Callback invoked when input receives focus |
| `onBlur` | `event`: Browser event | Callback invoked when input loses focus |
| `onSelect` | `event.originalEvent`: Browser event<br>`event.value`: Selected value | Callback invoked when a suggestion is selected |
| `onUnselect` | `event.originalEvent`: Browser event<br>`event.value`: Unselected value | Callback invoked when a selected value is removed (multiple mode) |
| `onClick` | `event`: Browser event | Callback invoked when input is clicked |
| `onClear` | `event`: Browser event | Callback invoked when input is cleared |
| `onShow` | - | Callback invoked when overlay panel becomes visible |
| `onHide` | - | Callback invoked when overlay panel becomes hidden |
| `onDropdownClick` | `event.originalEvent`: Browser event<br>`event.query`: Current query | Callback invoked when dropdown button is clicked |

---

## Code Examples

### Example 1: User Search with API

```javascript
import { useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

function UserSearchAutoComplete() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (event) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.example.com/users?search=${encodeURIComponent(event.query)}`
      );
      const data = await response.json();
      setFilteredUsers(data.users);
    } catch (error) {
      console.error('User search failed:', error);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const userTemplate = (user) => {
    return (
      <div className="flex align-items-center gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-2rem h-2rem border-circle"
        />
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-color-secondary">{user.email}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <h2>Search Users</h2>
      <AutoComplete
        field="name"
        value={selectedUser}
        suggestions={filteredUsers}
        completeMethod={searchUsers}
        onChange={(e) => setSelectedUser(e.value)}
        itemTemplate={userTemplate}
        placeholder="Type to search users..."
        disabled={loading}
        dropdown
      />
      {loading && <small className="ml-2">Searching...</small>}
      {selectedUser && (
        <div className="mt-3">
          <p>Selected: {selectedUser.name} ({selectedUser.email})</p>
        </div>
      )}
    </div>
  );
}
```

### Example 2: Tag Selection with Multiple Mode

```javascript
import { useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Chip } from 'primereact/chip';

function TagSelectionAutoComplete() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);

  const availableTags = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular',
    'Node.js', 'Python', 'Java', 'C#', 'Go',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP'
  ];

  const searchTags = (event) => {
    const query = event.query.toLowerCase();
    const filtered = availableTags.filter(tag =>
      tag.toLowerCase().includes(query) &&
      !selectedTags.includes(tag)
    );
    setFilteredTags(filtered);
  };

  return (
    <div className="card">
      <h2>Select Your Skills</h2>
      <AutoComplete
        multiple
        value={selectedTags}
        suggestions={filteredTags}
        completeMethod={searchTags}
        onChange={(e) => setSelectedTags(e.value)}
        placeholder="Add skills..."
        selectionLimit={5}
      />
      <div className="mt-3">
        <small>Selected: {selectedTags.length} / 5 skills</small>
      </div>
      {selectedTags.length > 0 && (
        <div className="mt-3">
          <h4>Your Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag, index) => (
              <Chip key={index} label={tag} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Example 3: Country Selector with Grouped Options

```javascript
import { useState } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

function CountrySelectorAutoComplete() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const countries = [
    {
      label: 'North America',
      code: 'NA',
      items: [
        { name: 'United States', code: 'US', capital: 'Washington, D.C.' },
        { name: 'Canada', code: 'CA', capital: 'Ottawa' },
        { name: 'Mexico', code: 'MX', capital: 'Mexico City' }
      ]
    },
    {
      label: 'Europe',
      code: 'EU',
      items: [
        { name: 'United Kingdom', code: 'GB', capital: 'London' },
        { name: 'Germany', code: 'DE', capital: 'Berlin' },
        { name: 'France', code: 'FR', capital: 'Paris' },
        { name: 'Italy', code: 'IT', capital: 'Rome' },
        { name: 'Spain', code: 'ES', capital: 'Madrid' }
      ]
    },
    {
      label: 'Asia',
      code: 'AS',
      items: [
        { name: 'Japan', code: 'JP', capital: 'Tokyo' },
        { name: 'China', code: 'CN', capital: 'Beijing' },
        { name: 'India', code: 'IN', capital: 'New Delhi' },
        { name: 'South Korea', code: 'KR', capital: 'Seoul' }
      ]
    },
    {
      label: 'Oceania',
      code: 'OC',
      items: [
        { name: 'Australia', code: 'AU', capital: 'Canberra' },
        { name: 'New Zealand', code: 'NZ', capital: 'Wellington' }
      ]
    }
  ];

  const searchCountry = (event) => {
    const query = event.query.toLowerCase();
    const filtered = countries
      .map(group => ({
        ...group,
        items: group.items.filter(country =>
          country.name.toLowerCase().includes(query) ||
          country.code.toLowerCase().includes(query) ||
          country.capital.toLowerCase().includes(query)
        )
      }))
      .filter(group => group.items.length > 0);

    setFilteredCountries(filtered);
  };

  const groupTemplate = (group) => {
    return (
      <div className="flex align-items-center gap-2">
        <i className="pi pi-globe"></i>
        <span className="font-bold">{group.label}</span>
      </div>
    );
  };

  const itemTemplate = (item) => {
    return (
      <div className="flex align-items-center gap-2">
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-color-secondary">
            {item.code} • Capital: {item.capital}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <h2>Select a Country</h2>
      <AutoComplete
        field="name"
        value={selectedCountry}
        suggestions={filteredCountries}
        completeMethod={searchCountry}
        onChange={(e) => setSelectedCountry(e.value)}
        optionGroupLabel="label"
        optionGroupChildren="items"
        optionGroupTemplate={groupTemplate}
        itemTemplate={itemTemplate}
        placeholder="Search by country, code, or capital"
        dropdown
      />
      {selectedCountry && (
        <div className="mt-4 p-3 surface-100 border-round">
          <h4 className="mt-0">Selected Country</h4>
          <p className="mb-1"><strong>Name:</strong> {selectedCountry.name}</p>
          <p className="mb-1"><strong>Code:</strong> {selectedCountry.code}</p>
          <p className="mb-0"><strong>Capital:</strong> {selectedCountry.capital}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Accessibility Notes

1. **Keyboard Navigation**: Full keyboard support for navigating and selecting suggestions using Arrow keys, Enter, Tab, and Escape
2. **ARIA Support**: Automatic ARIA attributes including `role="combobox"`, `aria-expanded`, `aria-controls`, and `aria-activedescendant`
3. **Screen Reader Compatibility**: Proper announcement of suggestions, selections, and state changes
4. **Focus Management**: Clear focus indicators and logical focus order
5. **Label Association**: Support for `inputId`, `aria-label`, and `aria-labelledby` for proper labeling
6. **Validation States**: `invalid` prop properly communicates validation errors
7. **Disabled State**: Disabled items are properly excluded from keyboard navigation
8. **Multiple Selection**: Chip removal via keyboard (Backspace) in multiple mode
9. **Empty State**: `showEmptyMessage` and `emptyMessage` props for no results feedback
10. **Loading State**: Consider adding loading indicators for async operations

---

## Common Patterns

### Search and Filter
Real-time search with filtering of predefined datasets

### User/Contact Selection
Searching for users, contacts, or team members with avatar and details

### Location Search
City, country, or address autocomplete with grouped regions

### Tag/Category Selection
Multiple tag selection with chips for categorization

### Product Search
E-commerce product search with thumbnails and details

### Command Palette
Quick action search with keyboard shortcuts

### Code/Repository Search
Development tools search with syntax highlighting

### Email Recipient Selection
Email "To" field with contact suggestions

### Advanced Filtering
Multi-field search across object properties

### Lazy Loading
Loading suggestions on-demand from API endpoints

---

## Related Components

- **Dropdown** - For selecting from a fixed list without search
- **MultiSelect** - For multiple selection from a fixed list
- **Chips** - For displaying selected items as chips
- **Listbox** - For simple list selection
- **TreeSelect** - For hierarchical selection
- **CascadeSelect** - For nested selection paths
- **InputText** - Basic text input
- **Mention** - Social media-style mentions

---

Research completed: 2025-11-05
Component: AutoComplete
Framework: PrimeReact
Documentation: https://primereact.org/autocomplete/
