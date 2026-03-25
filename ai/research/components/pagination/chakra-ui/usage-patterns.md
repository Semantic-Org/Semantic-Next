# Chakra UI - Pagination Usage Patterns

## Component URL
https://chakra-ui.com/docs/components/pagination
Status: ✅ Working
Version: v3 (Current)
Last Verified: 2025-11-06

## Documentation Quality
Good - Documentation references official examples and Ark UI foundation. Code examples are available through Storybook and official docs.

## Component Definition
- **Core purpose**: Provides navigation controls for paginated content, allowing users to move between pages of data efficiently
- **Mental model**: A horizontal control bar with numbered page buttons and previous/next navigation, typically displayed at the bottom of tables or lists
- **Semantic meaning**: Represents a navigation pattern for sequential content, communicating the current position within a larger dataset

## Pattern Support Levels
- **Native**: Dedicated prop/API
- **Composed**: Via composition/children
- **CSS-only**: Requires custom styling

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Page numbers | ✅ | Native | `Pagination.Item` components render individual page buttons via `pages` array |
| Previous/Next buttons | ✅ | Native | `Pagination.PrevTrigger` and `Pagination.NextTrigger` dedicated components |
| First/Last buttons | ✅ | Native | `goToFirstPage()` and `goToLastPage()` methods in Context API |
| Page size selector | ✅ | Composed | `setPageSize()` method + custom dropdown using Context API |
| Total count display | ✅ | Composed | `pageRange` property provides {start, end} values for "Showing X-Y of Z" |
| Quick jumper | ✅ | Composed | `setPage()` method + custom input field using Context API |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Composed | Chakra UI styling system with size variants (sm, md, lg) |
| Simplified mode | ✅ | Native | Control via `siblingCount` prop to show fewer page numbers |
| Button style | ✅ | Composed | `type` prop switches between 'button' (default) and 'link' |
| Disabled state | ✅ | Native | `data-disabled` attribute on boundary triggers, automatic handling |
| Custom rendering | ✅ | Native | Full control via render props and Context API |

## Behavior Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| onChange callback | ✅ | Native | `onPageChange` and `onPageSizeChange` event handlers |
| Controlled mode | ✅ | Native | `page` prop + `onPageChange` for external state management |
| Uncontrolled mode | ✅ | Native | `defaultPage` prop for internal state management |
| Keyboard navigation | ✅ | Native | Built-in keyboard support with ARIA attributes |

## Code Examples

### Basic Usage
```jsx
import { Pagination } from "@chakra-ui/react"

function BasicPagination() {
  return (
    <Pagination.Root count={5000} pageSize={10} siblingCount={2}>
      <Pagination.PrevTrigger>Previous Page</Pagination.PrevTrigger>
      <Pagination.Context>
        {(pagination) =>
          pagination.pages.map((page, index) =>
            page.type === 'page' ? (
              <Pagination.Item key={index} {...page}>
                {page.value}
              </Pagination.Item>
            ) : (
              <Pagination.Ellipsis key={index} index={index}>
                …
              </Pagination.Ellipsis>
            )
          )
        }
      </Pagination.Context>
      <Pagination.NextTrigger>Next Page</Pagination.NextTrigger>
    </Pagination.Root>
  )
}
```

### With Icons
```jsx
"use client"
import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"

function IconPagination() {
  return (
    <Pagination.Root count={20} pageSize={2} defaultPage={1}>
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>
        <Pagination.Items render={(page) => (
          <IconButton variant={{ base: "ghost", _selected: "outline" }}>
            {page.value}
          </IconButton>
        )} />
        <Pagination.NextTrigger asChild>
          <IconButton>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  )
}
```

### Controlled Pagination with State
```jsx
"use client"
import { useState } from "react"
import { Pagination } from "@chakra-ui/react"

function ControlledPagination() {
  const [page, setPage] = useState(1)

  return (
    <>
      <p>Current page: {page}</p>
      <Pagination.Root
        count={5000}
        pageSize={10}
        page={page}
        onPageChange={(details) => setPage(details.page)}
      >
        <Pagination.PrevTrigger>Previous</Pagination.PrevTrigger>
        <Pagination.Context>
          {(pagination) =>
            pagination.pages.map((page, index) =>
              page.type === 'page' ? (
                <Pagination.Item key={index} {...page}>
                  {page.value}
                </Pagination.Item>
              ) : (
                <Pagination.Ellipsis key={index} index={index}>
                  …
                </Pagination.Ellipsis>
              )
            )
          }
        </Pagination.Context>
        <Pagination.NextTrigger>Next</Pagination.NextTrigger>
      </Pagination.Root>
    </>
  )
}
```

### With Page Size Selector
```jsx
"use client"
import { Pagination, Select } from "@chakra-ui/react"

function PaginationWithPageSize() {
  return (
    <Pagination.Root count={1000} defaultPageSize={10}>
      <Pagination.Context>
        {(pagination) => (
          <>
            <div>
              <Pagination.PrevTrigger>Previous</Pagination.PrevTrigger>
              {pagination.pages.map((page, index) =>
                page.type === 'page' ? (
                  <Pagination.Item key={index} {...page}>
                    {page.value}
                  </Pagination.Item>
                ) : (
                  <Pagination.Ellipsis key={index} index={index}>
                    …
                  </Pagination.Ellipsis>
                )
              )}
              <Pagination.NextTrigger>Next</Pagination.NextTrigger>
            </div>

            <Select
              value={pagination.pageSize}
              onChange={(e) => pagination.setPageSize(Number(e.target.value))}
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </Select>
          </>
        )}
      </Pagination.Context>
    </Pagination.Root>
  )
}
```

### With Data Slicing
```jsx
"use client"
import { Pagination } from "@chakra-ui/react"

function PaginationWithData() {
  const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)

  return (
    <Pagination.Root count={items.length} pageSize={10}>
      <Pagination.Context>
        {(pagination) => {
          const currentItems = pagination.slice(items)
          return (
            <>
              <div>
                {currentItems.map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>

              <div>
                <p>
                  Showing {pagination.pageRange.start}-{pagination.pageRange.end}
                  of {pagination.count} results
                </p>

                <Pagination.PrevTrigger>Previous</Pagination.PrevTrigger>
                {pagination.pages.map((page, index) =>
                  page.type === 'page' ? (
                    <Pagination.Item key={index} {...page}>
                      {page.value}
                    </Pagination.Item>
                  ) : (
                    <Pagination.Ellipsis key={index} index={index}>
                      …
                    </Pagination.Ellipsis>
                  )
                )}
                <Pagination.NextTrigger>Next</Pagination.NextTrigger>
              </div>
            </>
          )
        }}
      </Pagination.Context>
    </Pagination.Root>
  )
}
```

### Link-Based Pagination (for SEO)
```jsx
import { Pagination } from "@chakra-ui/react"

function LinkPagination() {
  return (
    <Pagination.Root
      count={5000}
      pageSize={10}
      type="link"
      getPageUrl={(page) => `/products?page=${page}`}
    >
      <Pagination.PrevTrigger>Previous</Pagination.PrevTrigger>
      <Pagination.Context>
        {(pagination) =>
          pagination.pages.map((page, index) =>
            page.type === 'page' ? (
              <Pagination.Item key={index} {...page}>
                {page.value}
              </Pagination.Item>
            ) : (
              <Pagination.Ellipsis key={index} index={index}>
                …
              </Pagination.Ellipsis>
            )
          )
        }
      </Pagination.Context>
      <Pagination.NextTrigger>Next</Pagination.NextTrigger>
    </Pagination.Root>
  )
}
```

[View Live](https://chakra-ui.com/docs/components/pagination)

## Notable Features
- **Ark UI Foundation**: Built on Ark UI's headless pagination component, providing robust state management and accessibility
- **Context API**: Powerful render prop pattern via `Pagination.Context` provides full access to pagination state and methods
- **Automatic Data Slicing**: `slice()` method automatically handles array slicing based on current page and page size
- **Button or Link Mode**: `type` prop switches between button elements (SPA) and anchor elements (SEO-friendly)
- **Flexible Page Range**: `siblingCount` prop controls how many page numbers appear beside the active page
- **Ellipsis Handling**: Automatic ellipsis insertion for large page ranges with `Pagination.Ellipsis` component
- **Programmatic Navigation**: Rich API with `goToFirstPage()`, `goToLastPage()`, `goToNextPage()`, `goToPrevPage()`, and `setPage()` methods
- **Page Range Display**: `pageRange` property provides {start, end} for displaying "Showing X-Y of Z" text
- **Localization Support**: `translations` prop allows customization of ARIA labels for internationalization

## Component Architecture

### Sub-Components
- **Pagination.Root** - Main container, manages state and configuration
- **Pagination.PrevTrigger** - Previous page button/link
- **Pagination.NextTrigger** - Next page button/link
- **Pagination.Item** - Individual page number button/link
- **Pagination.Ellipsis** - Visual indicator for skipped pages (...)
- **Pagination.Context** - Render prop component for accessing state
- **Pagination.RootProvider** - Context provider for external state management
- **Pagination.Items** - Helper component to render page items (Chakra UI specific)

### Key Props (Pagination.Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | number | — | Total number of data items |
| `page` | number | — | Controlled active page number |
| `defaultPage` | number | 1 | Initial page when uncontrolled |
| `pageSize` | number | 10 | Number of items per page |
| `defaultPageSize` | number | 10 | Initial page size when uncontrolled |
| `siblingCount` | number | 1 | Number of pages shown beside active page |
| `type` | 'button' \| 'link' | 'button' | Render as button or anchor element |
| `getPageUrl` | (page: number) => string | — | URL generator for link mode |
| `onPageChange` | (details: {page: number}) => void | — | Callback when page changes |
| `onPageSizeChange` | (details: {pageSize: number}) => void | — | Callback when page size changes |
| `translations` | object | — | Localization strings for ARIA labels |
| `ids` | object | — | Custom element IDs for accessibility |

## Research Notes
- Chakra UI's Pagination is a wrapper around Ark UI's pagination component, inheriting its robust features
- The component provides excellent developer experience with both render props (Context API) and helper components (Items)
- Documentation is split between Chakra UI's site and Ark UI's site - full prop details are in Ark UI docs
- The Context API is particularly powerful, exposing all state and methods for advanced customization
- Link-based pagination with `getPageUrl` is excellent for SEO and server-side rendering scenarios
- The `slice()` method is a convenience feature that simplifies common pagination use cases
- Component follows Chakra UI's composable architecture, allowing fine-grained control over styling and behavior

## Related Resources
- **Official Docs**: https://chakra-ui.com/docs/components/pagination
- **Ark UI Docs**: https://ark-ui.com/react/docs/components/pagination
- **Storybook Examples**: Referenced in official documentation
- **GitHub Source**: Available in Chakra UI repository

---

Research completed: 2025-11-06
Component: Pagination
Framework: Chakra UI (v3)
Foundation: Ark UI
Documentation Quality: Good - Clear examples and comprehensive API documentation
