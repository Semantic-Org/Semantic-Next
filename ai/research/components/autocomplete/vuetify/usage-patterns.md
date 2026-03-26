# Vuetify - Combobox/Autocomplete Usage Patterns

## Component URL
- **v-autocomplete**: https://vuetifyjs.com/en/components/autocompletes/
- **v-combobox**: https://vuetifyjs.com/en/components/combobox/

Status: ✅ Working (both components exist as separate entities)
Version: Vuetify 3 (current), with legacy v2 documentation also available
Last Verified: 2025-11-10

## Documentation Quality
Good - Official documentation exists for both components with API references, though web scraping showed limited access to full content. Community examples and Stack Overflow discussions provide extensive practical implementation details.

## Component Definition
- **Core purpose**:
  - **v-autocomplete**: Provides type-ahead autocomplete functionality from a predefined list of options. Users can search/filter but cannot create new values.
  - **v-combobox**: Extends v-autocomplete to allow users to create custom values that don't exist in the provided items list. Created items are returned as strings.

- **Mental model**:
  - **v-autocomplete**: "Searchable dropdown" - strict validation with filtering
  - **v-combobox**: "Flexible input with suggestions" - combines freeform text input with suggested options

- **Semantic meaning**:
  - **v-autocomplete**: Communicates "select from known options with search"
  - **v-combobox**: Communicates "enter anything, with helpful suggestions"

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `clearable`, `multiple`)
- **Composed**: Via slots/templates (e.g., `<template v-slot:item>`)
- **CSS-only**: Requires custom styling (e.g., custom chip colors)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text input | ✅ | Native | Built-in text field for typing/searching |
| Dropdown list | ✅ | Native | Automatic dropdown menu with items |
| Filtering/search | ✅ | Native | `:search-input.sync` (v2) or `v-model:search-input` (v3); automatic client-side filtering or `no-filter` for server-side |
| Multiple selection | ✅ | Native | `multiple` prop displays selections as chips |
| Custom option rendering | ✅ | Composed | `<template v-slot:item="data">` and `<template v-slot:selection="data">` slots |
| Creatable options | ✅/❌ | Native | ✅ v-combobox only; ❌ v-autocomplete restricted to list |
| Grouping | ✅ | Native | Items with `header` or `divider` properties create groups/dividers (not selectable) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single select | ✅ | Native | Default behavior without `multiple` prop |
| Multi select | ✅ | Native | `multiple` prop with `chips` display; `cache-items` required for async data |
| Async/remote data | ✅ | Native | `:loading` prop + watcher on `search-input` with debounced API calls |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | Native | `:loading="true"` shows loading indicator during async operations |
| Disabled | ✅ | Native | `disabled` prop disables entire component |
| Error/Invalid | ✅ | Native | `:rules` array for validation (e.g., `[rules.required]`) |
| Empty state | ✅ | Native | `placeholder` prop for empty input; `hide-no-data` hides menu when empty |
| No results | ✅ | Native | `no-data-text` prop customizes message; `hide-no-data` can hide it |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `density="compact"` or `density="comfortable"` or `density="default"` |
| Placeholder text | ✅ | Native | `placeholder` prop |
| Clear button | ✅ | Native | `clearable` prop adds clear-all button |
| Icons | ✅ | Native | `prepend-icon`, `append-icon`, `prepend-inner-icon`, `append-inner-icon` props |
| Virtualization | ⚠️ | Unknown | Not confirmed in search results; may require custom implementation |

## Variant Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Outlined | ✅ | Native | `variant="outlined"` |
| Filled | ✅ | Native | `variant="filled"` |
| Solo | ✅ | Native | `variant="solo"` |
| Plain | ✅ | Native | `variant="plain"` |
| Underlined | ✅ | Native | `variant="underlined"` (v2: `solo` prop) |

## Code Examples

### Basic v-autocomplete with Async Remote Data (Vuetify 2)
```vue
<template>
  <v-autocomplete
    v-model="person"
    :items="personOptions"
    :loading="loadingPersons"
    :search-input.sync="search"
    hide-no-data
    item-text="name"
    item-value="id"
    label="Person"
    placeholder="Start typing to Search"
    clearable
    return-object
  ></v-autocomplete>
</template>

<script>
import debounce from 'debounce'

export default {
  data() {
    return {
      person: null,
      personOptions: [],
      search: '',
      loadingPersons: false,
    }
  },
  watch: {
    search(val) {
      this.debouncedSearch(val, this)
    }
  },
  created() {
    this.debouncedSearch = debounce(this.makeSearch, 500)
  },
  methods: {
    makeSearch: async (value, self) => {
      if (!value) {
        self.personOptions = []
        return
      }
      if (self.loadingPersons) return

      self.loadingPersons = true
      await fetch(`/api/search?q=${value}`)
        .then(response => response.json())
        .then(data => {
          self.personOptions = data
        })
        .finally(() => {
          self.loadingPersons = false
        })
    }
  }
}
</script>
```
[Source: EGN Digital](https://egndigital.com/vuetify-autocomplete-with-remote-search/)

### v-autocomplete with Async Data (Vuetify 3)
```vue
<script setup>
const search = ref()
const listData = ref([])
const loading = ref(false)

const onInput = async (val) => {
  if (!val) return false
  loading.value = true
  const response = await fetch(`/api/search?q=${val}`)
  listData.value = await response.json()
  loading.value = false
}
</script>

<template>
  <v-autocomplete
    v-model:search-input="search"
    :items="listData"
    :loading="loading"
    @update:search="onInput"
    no-filter
  />
</template>
```
[Source: GitHub Discussion #15009](https://github.com/vuetifyjs/vuetify/discussions/15009)

### v-combobox with Multiple Selection and Chips
```vue
<v-combobox
  v-model="model"
  :items="items"
  chips
  clearable
  multiple
  small-chips
  item-text="title"
  return-object
>
</v-combobox>
```

### v-combobox with Loading and Validation
```vue
<v-combobox
  :loading="isSurveyBeingPopulated"
  class="static--inputs"
  color="red"
  box
  :items="folders"
  :rules="[rules.required]"
  item-text="value"
  dense
  placeholder="Select Survey Folder"
  item-value="key"
  v-model="selectedSurveyFolder"
>
</v-combobox>
```
[Source: Stack Overflow](https://stackoverflow.com/questions/76380899/)

### Custom Rendering with Slots
```vue
<v-autocomplete
  v-model="selectedItem"
  :items="items"
  item-text="name"
  item-value="id"
>
  <template v-slot:selection="data">
    {{ data.item.name }} - {{ data.item.description }}
  </template>
  <template v-slot:item="data">
    {{ data.item.name }} - {{ data.item.description }}
  </template>
</v-autocomplete>
```

## Notable Features

### Key Differences Between v-autocomplete and v-combobox
1. **Value Creation**: v-combobox allows creating values not in the items list; v-autocomplete does not
2. **Return Type**: v-combobox returns created items as strings
3. **Use Cases**:
   - v-autocomplete: Strict validation, known options only
   - v-combobox: Flexible input with suggestions, user-defined values allowed

### Vuetify 2 vs Vuetify 3 Breaking Changes
- **item-text/item-value**: v2 uses `item-text` and `item-value` props; v3 looks for `title` property by default
- **search-input binding**: v2 uses `:search-input.sync`; v3 uses `v-model:search-input`
- **Variants**: v2 uses boolean props like `solo`, `outlined`; v3 uses `variant="solo|outlined|filled|plain|underlined"`

### Advanced Props
- `auto-select-first`: Automatically selects first item in list
- `clear-on-select`: Clears input after selection (default: true for combobox)
- `delimiters`: Array of characters that trigger chip creation in multiple mode
- `return-object`: Returns full object instead of just value
- `closable-chips`: Makes chips removable with X button
- `hide-no-data`: Hides menu when no results (useful for async)
- `cache-items`: Required for async data with multiple selection
- `no-filter`: Disables client-side filtering for server-side filtering

### Density and Size Control
- `density="compact"` - Tighter spacing, smaller text
- `density="comfortable"` - Medium spacing
- `density="default"` - Standard spacing
- Note: Some issues reported with compact density and chip sizing

## Research Notes

### Access Limitations
- WebFetch tool had difficulty accessing full page content from vuetifyjs.com
- Documentation structure appears to be dynamically loaded or protected
- Relied heavily on web search results, Stack Overflow, GitHub issues, and community resources

### Version Considerations
- Vuetify 3 is the current version with breaking changes from v2
- Many Stack Overflow examples still reference v2 syntax
- v2 documentation remains available at v2.vuetifyjs.com
- Legacy v1.5 documentation at v15.vuetifyjs.com

### Component Relationship
- Both v-autocomplete and v-combobox inherit from v-select
- They share many props and slots from the base select component
- The primary differentiator is the ability to create custom values (combobox only)

### Framework Ecosystem
- Strong community support with numerous CodePen examples
- Active GitHub discussions and issue tracking
- Third-party integrations available (e.g., vuetify-google-autocomplete)
- Extensive real-world usage patterns documented in Stack Overflow

### Implementation Patterns
- Async data loading requires manual watcher implementation with debouncing
- Multiple selection with async data requires `cache-items` prop
- Custom validation can be implemented via `@update:model-value` event filtering
- Grouping uses special item properties (`header`, `divider`) rather than nested structure
