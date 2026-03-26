# HeroUI - Autocomplete Component

## Component Overview

The HeroUI Autocomplete component combines a text input with a filterable listbox, enabling users to search and select from a list of options by typing. It provides intelligent filtering, keyboard navigation, and extensive customization options for creating powerful search and selection interfaces.

**Key Purpose**: Enable users to quickly find and select items from a large list by typing search queries, with real-time filtering and suggestions.

**Common Use Cases**:
- Search with filtered suggestions (e.g., location search, product search)
- Form fields with large option sets (e.g., country selector, category picker)
- Command palettes and quick navigation
- User/contact selection with search
- Tag or category input with suggestions
- API-driven search with async data loading
- Large dataset selection with virtualized scrolling (10,000+ items)
- Multi-criteria filtering and search

---

## Usage Patterns

### Basic Usage

The basic autocomplete uses the `Autocomplete` wrapper with `AutocompleteItem` children. Users can type to filter the displayed options and select one.

**Minimal Example:**
```jsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";

const animals = [
  { label: "Cat", key: "cat", description: "The second most popular pet in the world" },
  { label: "Dog", key: "dog", description: "The most popular pet in the world" },
  { label: "Elephant", key: "elephant", description: "The largest land animal" },
  { label: "Lion", key: "lion", description: "The king of the jungle" },
  { label: "Tiger", key: "tiger", description: "The largest cat species" },
  { label: "Giraffe", key: "giraffe", description: "The tallest land animal" },
];

export default function App() {
  return (
    <Autocomplete
      label="Select an animal"
      placeholder="Search animals..."
      className="max-w-xs"
    >
      {animals.map((animal) => (
        <AutocompleteItem key={animal.key}>
          {animal.label}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
```

**Key Points**:
- Each `AutocompleteItem` requires a unique `key` prop
- The label displays above/inside the input based on `labelPlacement`
- Users can type to filter options automatically
- Selection closes the menu and displays the selected value
- Default filtering uses "contains" matching (case-insensitive)

### Dynamic Collections

For dynamic data, use the `defaultItems` prop to enable automatic filtering on the provided dataset.

**Example:**
```jsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";

const animals = [
  { label: "Cat", key: "cat", description: "The second most popular pet in the world" },
  { label: "Dog", key: "dog", description: "The most popular pet in the world" },
  { label: "Elephant", key: "elephant", description: "The largest land animal" },
  // ... more items
];

export default function App() {
  return (
    <Autocomplete
      label="Favorite Animal"
      placeholder="Type to search..."
      className="max-w-xs"
      defaultItems={animals}
    >
      {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
    </Autocomplete>
  );
}
```

**Key Points**:
- `defaultItems` enables built-in filtering
- Render function receives each item as parameter
- Filtering is performed automatically as user types
- Works with any data structure (objects, arrays, etc.)

### Variants/Styles

HeroUI provides four visual variants through the `variant` prop:

**Available Variants:**
- `"flat"` (default): Solid filled background
- `"bordered"`: Border outline style with no background
- `"underlined"`: Only bottom border, minimal style
- `"faded"`: Subtle background with soft appearance

**Example:**
```jsx
// Flat variant (default)
<Autocomplete variant="flat" label="Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

// Bordered variant
<Autocomplete variant="bordered" label="Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

// Underlined variant
<Autocomplete variant="underlined" label="Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

// Faded variant
<Autocomplete variant="faded" label="Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>
```

### Color Options

Six color schemes available through the `color` prop:

**Available Colors:**
- `"default"` (default): Neutral color scheme
- `"primary"`: Primary brand color
- `"secondary"`: Secondary brand color
- `"success"`: Green/success color
- `"warning"`: Yellow/warning color
- `"danger"`: Red/error color

**Example:**
```jsx
<Autocomplete color="primary" label="Primary Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

<Autocomplete color="success" label="Success Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

<Autocomplete color="danger" label="Error Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>
```

### States

The autocomplete supports multiple interactive and validation states:

**Component States:**
- **Default**: Normal interactive state
- **Disabled**: Cannot be interacted with (`isDisabled`)
- **Read-only**: Displays options but no selection allowed (`isReadOnly`)
- **Required**: Field must have a value (`isRequired`)
- **Invalid**: Validation error state (`isInvalid`)
- **Loading**: Async data loading (via custom implementation)

**Controlled States:**
```jsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useState } from "react";

export default function App() {
  const [selectedKey, setSelectedKey] = useState(null);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex flex-col gap-4">
      {/* Disabled State */}
      <Autocomplete
        isDisabled
        label="Disabled Search"
      >
        <AutocompleteItem key="1">Option 1</AutocompleteItem>
      </Autocomplete>

      {/* Read-only State */}
      <Autocomplete
        isReadOnly
        label="Read-only Search"
        defaultSelectedKey="1"
      >
        <AutocompleteItem key="1">Option 1</AutocompleteItem>
      </Autocomplete>

      {/* Required State */}
      <Autocomplete
        isRequired
        label="Required Field"
      >
        <AutocompleteItem key="1">Option 1</AutocompleteItem>
      </Autocomplete>

      {/* Invalid State */}
      <Autocomplete
        isInvalid
        errorMessage="Please select a valid option"
        label="Invalid Search"
      >
        <AutocompleteItem key="1">Option 1</AutocompleteItem>
      </Autocomplete>

      {/* Controlled State */}
      <Autocomplete
        label="Controlled Search"
        selectedKey={selectedKey}
        inputValue={inputValue}
        onSelectionChange={setSelectedKey}
        onInputChange={setInputValue}
      >
        <AutocompleteItem key="1">Option 1</AutocompleteItem>
        <AutocompleteItem key="2">Option 2</AutocompleteItem>
      </Autocomplete>
    </div>
  );
}
```

**Disabled Items:**
```jsx
// Disable specific items using disabledKeys
<Autocomplete
  label="Search with Disabled Items"
  disabledKeys={["2", "4"]}
>
  <AutocompleteItem key="1">Available Item 1</AutocompleteItem>
  <AutocompleteItem key="2">Disabled Item 1</AutocompleteItem>
  <AutocompleteItem key="3">Available Item 2</AutocompleteItem>
  <AutocompleteItem key="4">Disabled Item 2</AutocompleteItem>
</Autocomplete>
```

### Sizing Options

Three size variants control the overall dimensions:

**Available Sizes:**
- `"sm"`: Small/compact size
- `"md"` (default): Medium/standard size
- `"lg"`: Large size

**Example:**
```jsx
// Small size
<Autocomplete size="sm" label="Small Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

// Medium size (default)
<Autocomplete size="md" label="Medium Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

// Large size
<Autocomplete size="lg" label="Large Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>
```

### Label Placement

Control where the label appears relative to the input:

**Available Placements:**
- `"inside"` (default): Label floats inside the input field
- `"outside"`: Label positioned above the input
- `"outside-left"`: Label positioned to the left of the input

**Example:**
```jsx
// Inside label (default)
<Autocomplete
  label="Search"
  labelPlacement="inside"
>
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

// Outside label
<Autocomplete
  label="Search"
  labelPlacement="outside"
>
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

// Outside-left label
<Autocomplete
  label="Search"
  labelPlacement="outside-left"
>
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>
```

### Content & Structure

**Basic Content with Descriptions:**
```jsx
const items = [
  {
    key: "cat",
    label: "Cat",
    description: "The second most popular pet in the world"
  },
  {
    key: "dog",
    label: "Dog",
    description: "The most popular pet in the world"
  },
];

<Autocomplete
  label="Select an animal"
  defaultItems={items}
>
  {(item) => (
    <AutocompleteItem key={item.key} description={item.description}>
      {item.label}
    </AutocompleteItem>
  )}
</Autocomplete>
```

**With Start Content (Icons/Avatars):**
```jsx
import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import { SearchIcon } from "lucide-react";

// Icon in input field
<Autocomplete
  label="Search"
  startContent={
    <SearchIcon className="text-default-400 w-4 h-4" />
  }
>
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

// Icons in items
<Autocomplete label="Select User">
  <AutocompleteItem
    key="user1"
    startContent={<Avatar src="user1.jpg" size="sm" />}
  >
    John Doe
  </AutocompleteItem>
  <AutocompleteItem
    key="user2"
    startContent={<Avatar src="user2.jpg" size="sm" />}
  >
    Jane Smith
  </AutocompleteItem>
</Autocomplete>
```

**With End Content:**
```jsx
import { Chip } from "@heroui/react";

<Autocomplete label="Select Status">
  <AutocompleteItem
    key="active"
    endContent={<Chip size="sm" color="success">Active</Chip>}
  >
    Active Status
  </AutocompleteItem>
  <AutocompleteItem
    key="pending"
    endContent={<Chip size="sm" color="warning">Pending</Chip>}
  >
    Pending Status
  </AutocompleteItem>
</Autocomplete>
```

**Grouped Items with Sections:**
```jsx
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@heroui/react";

<Autocomplete label="Select an option">
  <AutocompleteSection title="Mammals" showDivider>
    <AutocompleteItem key="cat">Cat</AutocompleteItem>
    <AutocompleteItem key="dog">Dog</AutocompleteItem>
    <AutocompleteItem key="elephant">Elephant</AutocompleteItem>
  </AutocompleteSection>

  <AutocompleteSection title="Birds">
    <AutocompleteItem key="parrot">Parrot</AutocompleteItem>
    <AutocompleteItem key="eagle">Eagle</AutocompleteItem>
    <AutocompleteItem key="penguin">Penguin</AutocompleteItem>
  </AutocompleteSection>
</Autocomplete>
```

### Interactive Features

**Menu Trigger Behavior:**
```jsx
// Focus trigger (default) - opens on focus
<Autocomplete menuTrigger="focus" label="Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

// Input trigger - opens only when typing
<Autocomplete menuTrigger="input" label="Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

// Manual trigger - programmatic control
<Autocomplete menuTrigger="manual" label="Search">
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>
```

**Clearable Input:**
```jsx
// Clearable by default
<Autocomplete
  label="Search"
  isClearable
>
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>

// Disable clear button
<Autocomplete
  label="Search"
  isClearable={false}
>
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>
```

**Custom Value Input:**
```jsx
import { useState } from "react";

export default function App() {
  const [value, setValue] = useState("");

  return (
    <Autocomplete
      label="Enter or select"
      placeholder="Type anything..."
      allowsCustomValue
      onInputChange={setValue}
      inputValue={value}
    >
      <AutocompleteItem key="opt1">Predefined Option 1</AutocompleteItem>
      <AutocompleteItem key="opt2">Predefined Option 2</AutocompleteItem>
    </Autocomplete>
  );
}
```

**Event Handling:**
```jsx
import { useState } from "react";

export default function App() {
  const [selectedKey, setSelectedKey] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Autocomplete
      label="Search"
      selectedKey={selectedKey}
      inputValue={inputValue}
      onSelectionChange={(key) => {
        setSelectedKey(key);
        console.log("Selected:", key);
      }}
      onInputChange={(value) => {
        setInputValue(value);
        console.log("Input:", value);
      }}
      onOpenChange={(open) => {
        setIsOpen(open);
        console.log("Menu open:", open);
      }}
      onFocus={() => console.log("Focused")}
      onBlur={() => console.log("Blurred")}
      onClear={() => {
        console.log("Cleared");
        setSelectedKey(null);
        setInputValue("");
      }}
    >
      <AutocompleteItem key="1">Option 1</AutocompleteItem>
      <AutocompleteItem key="2">Option 2</AutocompleteItem>
    </Autocomplete>
  );
}
```

### Async Data Loading

**Async Filtering with useAsyncList:**
```jsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useAsyncList } from "@react-stately/data";

export default function App() {
  const list = useAsyncList({
    async load({ signal, filterText }) {
      // Fetch data from API
      const res = await fetch(
        `https://api.example.com/search?q=${filterText}`,
        { signal }
      );
      const json = await res.json();

      return {
        items: json.results,
      };
    },
  });

  return (
    <Autocomplete
      label="Search"
      placeholder="Type to search..."
      items={list.items}
      inputValue={list.filterText}
      isLoading={list.isLoading}
      onInputChange={list.setFilterText}
    >
      {(item) => (
        <AutocompleteItem key={item.id}>
          {item.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
```

**Manual Async Implementation:**
```jsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useState, useEffect } from "react";

export default function App() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!inputValue) {
      setItems([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.example.com/search?q=${inputValue}`
        );
        const data = await response.json();
        setItems(data.results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <Autocomplete
      label="Search"
      placeholder="Type to search..."
      items={items}
      inputValue={inputValue}
      isLoading={isLoading}
      onInputChange={setInputValue}
    >
      {(item) => (
        <AutocompleteItem key={item.id}>
          {item.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
```

### Virtualization (Large Datasets)

**Virtualized Rendering for 10,000+ Items:**
```jsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";

// Generate large dataset
const generateItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    key: `item-${i}`,
    label: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
  }));
};

export default function App() {
  const items = generateItems(10000);

  return (
    <Autocomplete
      label="Search 10,000 items"
      placeholder="Type to filter..."
      defaultItems={items}
      isVirtualized
      maxListboxHeight={256}
      itemHeight={32}
    >
      {(item) => (
        <AutocompleteItem key={item.key} description={item.description}>
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
```

**Key Points:**
- `isVirtualized`: Enables virtual scrolling
- `maxListboxHeight`: Maximum height of the dropdown in pixels (default: 256)
- `itemHeight`: Height of each item in pixels (default: 32)
- Dramatically improves performance with large datasets
- Only renders visible items in the viewport

### Custom Filtering

**Custom Filter Function:**
```jsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";

const items = [
  { key: "react", label: "React", tags: ["ui", "framework"] },
  { key: "vue", label: "Vue", tags: ["ui", "framework"] },
  { key: "angular", label: "Angular", tags: ["ui", "framework"] },
  { key: "node", label: "Node.js", tags: ["backend", "runtime"] },
];

export default function App() {
  // Custom filter that searches both label and tags
  const customFilter = (item, inputValue) => {
    const searchText = inputValue.toLowerCase();
    return (
      item.label.toLowerCase().includes(searchText) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchText))
    );
  };

  return (
    <Autocomplete
      label="Search frameworks"
      placeholder="Search by name or tag..."
      items={items}
      defaultFilter={customFilter}
    >
      {(item) => (
        <AutocompleteItem key={item.key}>
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
```

### Customization

**Custom Icons:**
```jsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { SearchIcon, XIcon, ChevronDownIcon } from "lucide-react";

<Autocomplete
  label="Custom Icons"
  startContent={<SearchIcon className="w-4 h-4" />}
  selectorIcon={<ChevronDownIcon />}
  clearIcon={<XIcon />}
>
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>
```

**Custom Styling with classNames:**
```jsx
<Autocomplete
  label="Custom Styled"
  classNames={{
    base: "max-w-xs",
    listboxWrapper: "max-h-[400px]",
    popoverContent: "rounded-lg",
    endContentWrapper: "text-default-400",
    clearButton: "text-danger",
    selectorButton: "text-primary",
  }}
>
  <AutocompleteItem key="1">Option 1</AutocompleteItem>
</Autocomplete>
```

**Custom Item Rendering:**
```jsx
import { Autocomplete, AutocompleteItem, Avatar, Chip } from "@heroui/react";

const users = [
  {
    key: "user1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "avatar1.jpg",
    role: "Admin",
  },
  {
    key: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "avatar2.jpg",
    role: "User",
  },
];

<Autocomplete
  label="Select User"
  placeholder="Search users..."
  defaultItems={users}
>
  {(user) => (
    <AutocompleteItem
      key={user.key}
      textValue={user.name}
      startContent={<Avatar src={user.avatar} size="sm" />}
      endContent={<Chip size="sm" color="primary">{user.role}</Chip>}
    >
      <div className="flex flex-col">
        <span className="text-small">{user.name}</span>
        <span className="text-tiny text-default-400">{user.email}</span>
      </div>
    </AutocompleteItem>
  )}
</Autocomplete>
```

### Integration Patterns

**With Form Validation:**
```jsx
import { Autocomplete, AutocompleteItem, Button } from "@heroui/react";
import { useState } from "react";

export default function App() {
  const [selectedKey, setSelectedKey] = useState(null);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedKey) {
      setIsInvalid(true);
      return;
    }
    console.log("Submitted:", selectedKey);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Autocomplete
        label="Country"
        placeholder="Select a country"
        isRequired
        isInvalid={isInvalid}
        errorMessage={isInvalid && "Please select a country"}
        selectedKey={selectedKey}
        onSelectionChange={(key) => {
          setSelectedKey(key);
          setIsInvalid(false);
        }}
      >
        <AutocompleteItem key="us">United States</AutocompleteItem>
        <AutocompleteItem key="uk">United Kingdom</AutocompleteItem>
        <AutocompleteItem key="ca">Canada</AutocompleteItem>
      </Autocomplete>

      <Button type="submit" color="primary">
        Submit
      </Button>
    </form>
  );
}
```

**With Multi-Step Filtering:**
```jsx
import { Autocomplete, AutocompleteItem, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

const products = [
  { key: "p1", name: "Laptop", category: "electronics", price: 999 },
  { key: "p2", name: "Phone", category: "electronics", price: 599 },
  { key: "p3", name: "Shirt", category: "clothing", price: 29 },
  { key: "p4", name: "Jeans", category: "clothing", price: 49 },
];

export default function App() {
  const [category, setCategory] = useState("all");

  const filteredProducts = products.filter(
    (p) => category === "all" || p.category === category
  );

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Category Filter"
        selectedKeys={[category]}
        onSelectionChange={(keys) => setCategory(Array.from(keys)[0])}
      >
        <SelectItem key="all">All Categories</SelectItem>
        <SelectItem key="electronics">Electronics</SelectItem>
        <SelectItem key="clothing">Clothing</SelectItem>
      </Select>

      <Autocomplete
        label="Search Products"
        placeholder="Type to search..."
        items={filteredProducts}
      >
        {(product) => (
          <AutocompleteItem key={product.key}>
            {product.name} - ${product.price}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
```

### Accessibility Features

**Keyboard Navigation:**
- **Arrow Down**: Open menu or move to next item
- **Arrow Up**: Move to previous item
- **Enter**: Select highlighted item and close menu
- **Escape**: Close menu without selecting
- **Home**: Jump to first item
- **End**: Jump to last item
- **Tab**: Move focus out of component
- **Type-ahead**: Jump to items starting with typed characters

**ARIA Attributes:**
```jsx
// Automatically managed by HeroUI:
// role="combobox" - Main input element
// aria-expanded="true|false" - Menu open/closed state
// aria-controls - Links input to listbox
// aria-activedescendant - Indicates focused item
// aria-autocomplete="list" - Indicates filtering behavior
// role="listbox" - Dropdown menu
// role="option" - Each menu item
// aria-selected="true|false" - Selected item state
// aria-disabled="true" - Disabled items
```

**Screen Reader Support:**
```jsx
// HeroUI provides semantic structure:
// - Input announces as combobox
// - Menu open/closed state is announced
// - Number of results is communicated
// - Selected item is announced
// - Filtering progress is indicated

<Autocomplete
  label="Screen Reader Friendly Search"
  placeholder="Type to search..."
  aria-label="Search for items"
>
  <AutocompleteItem key="1">
    Item 1
  </AutocompleteItem>
</Autocomplete>
```

**Focus Management:**
- Visible focus indicators on keyboard navigation
- Focus returns to input after selection
- Menu position adjusted to keep focused item visible
- Automatic scroll to focused item in virtualized lists

---

## Key Properties/Props

### Autocomplete Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"flat" \| "bordered" \| "faded" \| "underlined"` | `"flat"` | Visual styling variant |
| `color` | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"default"` | Color scheme |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Component size |
| `label` | `ReactNode` | - | Label text |
| `placeholder` | `string` | - | Placeholder text |
| `labelPlacement` | `"inside" \| "outside" \| "outside-left"` | `"inside"` | Label position |
| `description` | `ReactNode` | - | Helper text below input |
| `errorMessage` | `ReactNode` | - | Error message text |
| `isDisabled` | `boolean` | `false` | Disable entire component |
| `isReadOnly` | `boolean` | `false` | Display only, no selection |
| `isRequired` | `boolean` | `false` | Field is required |
| `isInvalid` | `boolean` | `false` | Show error state |
| `isClearable` | `boolean` | `true` | Show clear button |
| `allowsCustomValue` | `boolean` | `false` | Allow non-list values |
| `menuTrigger` | `"focus" \| "input" \| "manual"` | `"focus"` | When to open menu |
| `selectedKey` | `Key` | - | Controlled: Selected item key |
| `defaultSelectedKey` | `Key` | - | Uncontrolled: Initial selected key |
| `inputValue` | `string` | - | Controlled: Input text value |
| `defaultInputValue` | `string` | - | Uncontrolled: Initial input value |
| `items` | `Iterable<T>` | - | Dynamic item collection |
| `defaultItems` | `Iterable<T>` | - | Static items with filtering |
| `disabledKeys` | `Iterable<Key>` | - | Keys of disabled items |
| `defaultFilter` | `(item, input) => boolean` | - | Custom filter function |
| `isVirtualized` | `boolean` | `undefined` | Enable virtual scrolling |
| `maxListboxHeight` | `number` | `256` | Max dropdown height (px) |
| `itemHeight` | `number` | `32` | Item height for virtualization (px) |
| `startContent` | `ReactNode` | - | Content at start of input |
| `endContent` | `ReactNode` | - | Content at end of input |
| `selectorIcon` | `ReactNode` | - | Custom dropdown icon |
| `clearIcon` | `ReactNode` | - | Custom clear icon |
| `onSelectionChange` | `(key: Key) => void` | - | Selection change callback |
| `onInputChange` | `(value: string) => void` | - | Input value change callback |
| `onOpenChange` | `(isOpen: boolean) => void` | - | Menu open/close callback |
| `onFocus` | `(e: FocusEvent) => void` | - | Focus event handler |
| `onBlur` | `(e: FocusEvent) => void` | - | Blur event handler |
| `onClear` | `() => void` | - | Clear button callback |
| `classNames` | `object` | - | Override component classes |

### AutocompleteItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `Key` | Required | Unique identifier |
| `children` | `ReactNode` | Required | Item content |
| `textValue` | `string` | - | Text for filtering/a11y |
| `description` | `ReactNode` | - | Secondary text |
| `isDisabled` | `boolean` | `false` | Disable this item |
| `startContent` | `ReactNode` | - | Content at start |
| `endContent` | `ReactNode` | - | Content at end |
| `className` | `string` | - | Custom CSS class |

### AutocompleteSection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | - | Section heading |
| `children` | `ReactNode` | Required | Section items |
| `showDivider` | `boolean` | `false` | Show divider after section |
| `className` | `string` | - | Custom CSS class |

---

## Code Examples

### Example 1: Basic Country Selector

```jsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";

const countries = [
  { key: "us", label: "United States", flag: "🇺🇸" },
  { key: "uk", label: "United Kingdom", flag: "🇬🇧" },
  { key: "ca", label: "Canada", flag: "🇨🇦" },
  { key: "de", label: "Germany", flag: "🇩🇪" },
  { key: "fr", label: "France", flag: "🇫🇷" },
  { key: "jp", label: "Japan", flag: "🇯🇵" },
];

export default function CountrySelector() {
  return (
    <Autocomplete
      label="Select your country"
      placeholder="Search countries..."
      className="max-w-xs"
      defaultItems={countries}
    >
      {(country) => (
        <AutocompleteItem
          key={country.key}
          startContent={<span className="text-xl">{country.flag}</span>}
        >
          {country.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
```

### Example 2: User Search with Avatar

```jsx
import { Autocomplete, AutocompleteItem, Avatar, Chip } from "@heroui/react";

const users = [
  {
    key: "1",
    name: "Tony Reichert",
    email: "tony@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    role: "CEO",
  },
  {
    key: "2",
    name: "Zoey Lang",
    email: "zoey@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    role: "Technical Lead",
  },
  {
    key: "3",
    name: "Jane Fisher",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    role: "Senior Developer",
  },
];

export default function UserSearch() {
  return (
    <Autocomplete
      label="Assign to"
      placeholder="Search team members..."
      className="max-w-xs"
      defaultItems={users}
    >
      {(user) => (
        <AutocompleteItem
          key={user.key}
          textValue={user.name}
          startContent={<Avatar src={user.avatar} size="sm" />}
        >
          <div className="flex flex-col">
            <span className="text-small">{user.name}</span>
            <span className="text-tiny text-default-400">{user.email}</span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
```

### Example 3: Async API Search

```jsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useState, useEffect } from "react";

export default function AsyncSearch() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputValue.length < 2) {
      setItems([]);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${inputValue}&per_page=10`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setItems(data.items || []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Search failed:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [inputValue]);

  return (
    <Autocomplete
      label="Search GitHub Repositories"
      placeholder="Type to search..."
      className="max-w-xs"
      items={items}
      inputValue={inputValue}
      isLoading={isLoading}
      onInputChange={setInputValue}
    >
      {(item) => (
        <AutocompleteItem
          key={item.id}
          textValue={item.full_name}
        >
          <div className="flex flex-col">
            <span className="text-small font-semibold">{item.full_name}</span>
            <span className="text-tiny text-default-400">
              ⭐ {item.stargazers_count} stars
            </span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
```

### Example 4: Grouped Categories

```jsx
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@heroui/react";

export default function CategorySearch() {
  return (
    <Autocomplete
      label="Select a framework"
      placeholder="Search frameworks..."
      className="max-w-xs"
    >
      <AutocompleteSection title="Frontend Frameworks" showDivider>
        <AutocompleteItem key="react">React</AutocompleteItem>
        <AutocompleteItem key="vue">Vue.js</AutocompleteItem>
        <AutocompleteItem key="angular">Angular</AutocompleteItem>
        <AutocompleteItem key="svelte">Svelte</AutocompleteItem>
      </AutocompleteSection>

      <AutocompleteSection title="Backend Frameworks" showDivider>
        <AutocompleteItem key="express">Express.js</AutocompleteItem>
        <AutocompleteItem key="fastify">Fastify</AutocompleteItem>
        <AutocompleteItem key="nestjs">NestJS</AutocompleteItem>
      </AutocompleteSection>

      <AutocompleteSection title="Full-Stack Frameworks">
        <AutocompleteItem key="nextjs">Next.js</AutocompleteItem>
        <AutocompleteItem key="nuxt">Nuxt.js</AutocompleteItem>
        <AutocompleteItem key="remix">Remix</AutocompleteItem>
      </AutocompleteSection>
    </Autocomplete>
  );
}
```

### Example 5: Virtualized Large List

```jsx
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useMemo } from "react";

export default function LargeDatasetSearch() {
  // Generate 10,000 items
  const items = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      key: `item-${i}`,
      label: `Item ${i + 1}`,
      description: `This is the description for item number ${i + 1}`,
    }));
  }, []);

  return (
    <Autocomplete
      label="Search 10,000 items"
      placeholder="Type to filter..."
      className="max-w-xs"
      defaultItems={items}
      isVirtualized
      maxListboxHeight={300}
      itemHeight={40}
    >
      {(item) => (
        <AutocompleteItem key={item.key} description={item.description}>
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
```

### Example 6: Controlled with External State

```jsx
import { Autocomplete, AutocompleteItem, Button, Card } from "@heroui/react";
import { useState } from "react";

const products = [
  { key: "laptop", label: "Laptop", price: 999 },
  { key: "phone", label: "Smartphone", price: 699 },
  { key: "tablet", label: "Tablet", price: 499 },
  { key: "watch", label: "Smartwatch", price: 299 },
];

export default function ControlledSearch() {
  const [selectedKey, setSelectedKey] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const selectedProduct = products.find((p) => p.key === selectedKey);

  const handleReset = () => {
    setSelectedKey(null);
    setInputValue("");
  };

  return (
    <div className="flex flex-col gap-4">
      <Autocomplete
        label="Select a product"
        placeholder="Search products..."
        className="max-w-xs"
        selectedKey={selectedKey}
        inputValue={inputValue}
        onSelectionChange={setSelectedKey}
        onInputChange={setInputValue}
        defaultItems={products}
      >
        {(product) => (
          <AutocompleteItem key={product.key}>
            {product.label} - ${product.price}
          </AutocompleteItem>
        )}
      </Autocomplete>

      {selectedProduct && (
        <Card className="p-4">
          <p className="text-small">
            <strong>Selected:</strong> {selectedProduct.label}
          </p>
          <p className="text-small">
            <strong>Price:</strong> ${selectedProduct.price}
          </p>
          <Button size="sm" color="primary" onClick={handleReset} className="mt-2">
            Reset Selection
          </Button>
        </Card>
      )}
    </div>
  );
}
```

### Example 7: Custom Value Input

```jsx
import { Autocomplete, AutocompleteItem, Chip } from "@heroui/react";
import { useState } from "react";

const predefinedEmails = [
  "john@example.com",
  "jane@example.com",
  "bob@example.com",
];

export default function EmailInput() {
  const [selectedKey, setSelectedKey] = useState(null);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <Autocomplete
        label="Email Address"
        placeholder="Enter or select email..."
        className="max-w-xs"
        allowsCustomValue
        selectedKey={selectedKey}
        inputValue={inputValue}
        onSelectionChange={setSelectedKey}
        onInputChange={setInputValue}
      >
        {predefinedEmails.map((email) => (
          <AutocompleteItem key={email}>{email}</AutocompleteItem>
        ))}
      </Autocomplete>

      {inputValue && (
        <Chip color="primary" variant="flat">
          Current value: {inputValue}
        </Chip>
      )}
    </div>
  );
}
```

---

## Accessibility Notes

**Keyboard Navigation Implementation:**
- HeroUI automatically handles all keyboard events
- Users can navigate with arrow keys through options
- Enter/Space selects the focused item
- Escape closes the menu
- Type-ahead jumps to matching items
- Home/End navigate to first/last items

**ARIA Implementation:**
- `role="combobox"` on input element
- `aria-expanded` reflects menu state
- `aria-controls` links input to listbox
- `aria-activedescendant` indicates focused option
- `aria-autocomplete="list"` indicates filtering behavior
- `role="listbox"` and `role="option"` for menu structure
- `aria-selected` marks selected items
- `aria-disabled` identifies disabled items

**Best Practices for Accessible Content:**
1. Always provide a descriptive label
2. Use `textValue` prop for complex item content to ensure proper filtering
3. Include helpful placeholder text
4. Provide error messages for invalid states
5. Use description prop for additional context
6. Test with keyboard-only navigation
7. Test with screen readers (NVDA, JAWS, VoiceOver)
8. Ensure sufficient color contrast in all states
9. Don't rely solely on color to indicate states

**Screen Reader Experience:**
- Input announces as "combobox" with label
- Menu open/closed state is announced
- Number of available options is communicated
- Focused item is announced with full content
- Selection confirmation is announced
- Filtering progress and results are indicated
- Error states and messages are announced

---

## Common Patterns

1. **Form Fields**: Country/state selectors, category pickers with validation
2. **User Search**: Team member selection, user assignment with avatars
3. **API Search**: GitHub repos, product catalogs, location search with debouncing
4. **Command Palettes**: Quick navigation, action search with keyboard shortcuts
5. **Tag Input**: Category/label selection with custom values
6. **Large Datasets**: City selection, product catalogs with virtualization
7. **Multi-Level Filtering**: Products by category, hierarchical data navigation
8. **Async Loading**: Real-time search, server-side filtering with loading states

---

## Related Components

- **Select**: For selection without search/filtering (simpler use case)
- **Input**: For basic text input without suggestions
- **Combobox**: Alternative name for autocomplete pattern
- **Listbox**: The dropdown menu component used internally
- **Popover**: For positioning the dropdown menu
- **Avatar**: Often used with user search patterns
- **Chip/Badge**: For displaying selected values or item metadata
- **Button**: For form submission and actions

---

Research completed: 2025-11-05
Component: Autocomplete
Framework: HeroUI
Documentation: https://www.heroui.com/docs/components/autocomplete
