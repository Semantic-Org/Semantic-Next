# PrimeReact - AutoComplete Usage Patterns

## Component URL
https://primereact.org/autocomplete/
Status: ✅ Working
Version: 10.9.7 (v11 available at v11.primereact.org)
Last Verified: 2025-11-10

## Documentation Quality
Comprehensive - Well-organized sections covering import, basic usage, advanced features (virtual scroll, grouping), accessibility guidelines, and complete keyboard support matrices. Examples progress from simple to complex patterns.

## Component Definition
- **Core purpose**: Provides real-time suggestions while users type into an input field, combining text input with filtered dropdown suggestions.
- **Mental model**: A controlled component that requires value management and suggestion filtering through a callback function. The component presents matching suggestions in a dropdown panel as the user types.
- **Semantic meaning**: An enhanced text input that helps users complete their entry by offering contextual suggestions, reducing typing effort and improving data accuracy.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `multiple={true}`, `dropdown={true}`)
- **Composed**: Via composition/children (e.g., templates via `itemTemplate`)
- **CSS-only**: Requires custom styling (e.g., custom panel styles)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text input | ✅ | Native | Core input field with controlled `value` prop |
| Dropdown list | ✅ | Native | Suggestions displayed via `suggestions` prop, filtered through `completeMethod` callback |
| Filtering/search | ✅ | Native | `completeMethod` callback receives query event, component consumer handles filtering logic |
| Multiple selection | ✅ | Native | `multiple` prop enables chip-based multiple selection with optional `selectionLimit` |
| Custom option rendering | ✅ | Composed | `itemTemplate` prop accepts React component/function for custom suggestion rendering |
| Creatable options | ❌ | N/A | Not directly supported - would require custom implementation |
| Grouping | ✅ | Native | `optionGroupLabel` and `optionGroupChildren` props enable grouped suggestions with `optionGroupTemplate` for custom group headers |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Single select | ✅ | Native | Default mode - `value` holds single selected item |
| Multi select | ✅ | Native | `multiple` prop enables array-based value with chip display and optional `selectionLimit` |
| Async/remote data | ✅ | Native | `completeMethod` callback supports async operations for remote data fetching |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | CSS-only | No dedicated loading prop, must be handled via custom implementation or overlay |
| Disabled | ✅ | Native | `disabled` prop disables input and interaction |
| Error/Invalid | ✅ | Native | `invalid` prop applies error styling; integrates with validation libraries |
| Empty state | ✅ | Composed | `emptyMessage` prop displays text when no suggestions match |
| No results | ✅ | Composed | Same as empty state - `emptyMessage` shown when filtering returns no matches |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop supports small, normal, large variants |
| Placeholder text | ✅ | Native | `placeholder` prop for input hint text |
| Clear button | ✅ | Native | Built-in clear icon appears when value is present |
| Icons | ✅ | Composed | Custom icons via templates; `dropdown` prop adds dropdown toggle icon |
| Virtualization | ✅ | Native | `virtualScrollerOptions` prop enables virtual scrolling for large datasets via integrated VirtualScroller |

## Code Examples
```jsx
// Basic text suggestions
<AutoComplete
  value={value}
  suggestions={items}
  completeMethod={search}
  onChange={(e) => setValue(e.value)}
/>

// Object-based suggestions with field mapping
<AutoComplete
  field="name"
  value={selectedCountry}
  suggestions={filteredCountries}
  completeMethod={search}
  onChange={(e) => setSelectedCountry(e.value)}
/>

// Multiple selection with chips
<AutoComplete
  field="name"
  multiple
  value={selectedCountries}
  suggestions={filteredCountries}
  completeMethod={search}
  onChange={(e) => setSelectedCountries(e.value)}
/>

// With dropdown toggle and custom template
<AutoComplete
  field="name"
  value={selectedCountry}
  suggestions={filteredCountries}
  completeMethod={search}
  dropdown
  dropdownMode="current"
  itemTemplate={(item) => (
    <div className="flex align-items-center">
      <img src={`/images/flag/${item.code}.svg`} width="18" />
      <div className="ml-2">{item.name}</div>
    </div>
  )}
  onChange={(e) => setSelectedCountry(e.value)}
/>

// With grouping
<AutoComplete
  field="label"
  value={selectedCity}
  suggestions={filteredCities}
  completeMethod={searchCity}
  optionGroupLabel="label"
  optionGroupChildren="items"
  onChange={(e) => setSelectedCity(e.value)}
/>

// With virtual scrolling for performance
<AutoComplete
  value={selectedItem}
  suggestions={filteredItems}
  completeMethod={search}
  virtualScrollerOptions={{ itemSize: 38 }}
  onChange={(e) => setSelectedItem(e.value)}
/>
```
[View Live](https://primereact.org/autocomplete/)

## Notable Features
- **Complete keyboard navigation**: Full support for arrow keys, Home/End, Escape, Tab, and Enter with detailed ARIA keyboard matrix
- **Accessibility-first design**: Comprehensive ARIA attributes (`aria-label`, `aria-labelledby`, `aria-expanded`, `aria-controls`) with screen reader testing notes
- **Chip-based multiple mode**: Multiple selection displays as removable chips with dedicated keyboard handlers (Backspace to remove)
- **Virtual scrolling integration**: Native support for virtualizing large suggestion lists via `virtualScrollerOptions`
- **Dropdown modes**: `dropdown` prop with `dropdownMode` controlling whether clicking shows all items ("blank") or filtered items ("current")
- **Force selection**: `forceSelection` prop restricts input to only valid selections from suggestions
- **Float label pattern**: Support for Material-style floating labels via `FloatLabel` wrapper component
- **Template system**: Multiple template slots (`itemTemplate`, `selectedItemTemplate`, `panelFooterTemplate`, `optionGroupTemplate`) for complete customization

## Research Notes
- Documentation is exceptionally thorough with clear progressive examples from basic to advanced usage
- Strong emphasis on accessibility with dedicated sections for screen reader support and keyboard navigation matrices
- The controlled component pattern requires developers to manage both value state and suggestion filtering logic
- Version 11 is available but documentation reviewed is for stable v10.9.7
- No difficulties accessing documentation; all examples and API references were clear and complete
- Framework approach emphasizes templates for customization rather than subcomponent composition
