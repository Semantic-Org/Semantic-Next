# ShadCN - Table Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://ui.shadcn.com/docs/components/table
Status: ✅ Working

## Documentation Quality
Good - Provides clear basic usage example with semantic structure, though advanced features are documented separately in a Data Table page.

## Component Definition
- **Core purpose**: Display structured tabular data in a responsive, accessible format with clean styling
- **Mental model**: Semantic HTML table wrapper with styled components for composition
- **Semantic meaning**: Represents structured data relationships in rows and columns, typically for data display and simple interactions

## Content Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Plain data cells | ✅ | Primary pattern - TableCell components for data display |
| Custom cell rendering | ✅ | Supports className customization (e.g., `font-medium` for emphasis, `text-right` for alignment) |
| Nested/expandable rows | ❌ | Not shown in basic component documentation |
| Action columns | ❌ | Not explicitly shown, but possible through custom cell content |

## Type Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Basic table | ✅ | Primary implementation - semantic table elements with styling |
| Data table | ✅ | Referenced separately - integrates with @tanstack/react-table for sorting, filtering, pagination |
| Tree table | ❌ | Not documented |

## State Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Loading | ❌ | Not shown in basic component |
| Empty | ❌ | Not shown in basic component |
| Error | ❌ | Not shown in basic component |
| Selected rows | ❌ | Not shown in basic component (may be in Data Table docs) |

## Variation Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Size options | ❌ | Not explicitly provided - customizable via className |
| Bordered | ❌ | Not shown - likely achievable via className |
| Striped rows | ❌ | Not shown - likely achievable via className |
| Hoverable rows | ❌ | Not shown - likely achievable via className |
| Fixed header | ❌ | Not documented |
| Fixed columns | ❌ | Not documented |
| Scrollable | ❌ | Not explicitly shown, mentions "responsive" |
| Responsive | ✅ | Described as "responsive table component" |

## Interactive Patterns
| Pattern | Present | Details |
|---------|---------|---------|
| Sorting | ⚠️ | Referenced for Data Table with @tanstack/react-table integration |
| Filtering | ⚠️ | Referenced for Data Table with @tanstack/react-table integration |
| Pagination | ⚠️ | Referenced for Data Table with @tanstack/react-table integration |
| Row selection | ❌ | Not shown in basic component |
| Column resizing | ❌ | Not documented |
| Column reordering | ❌ | Not documented |
| Cell editing | ❌ | Not documented |

## Code Examples

### Basic Table with Footer
```jsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
```

### Installation
```bash
pnpm dlx shadcn@latest add table
```

## Notable Features
- **Semantic component structure**: Provides granular components for each table element (Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption)
- **Composition-based design**: No predefined variants; instead uses className customization for styling (e.g., `text-right`, `font-medium`, `w-[100px]`)
- **Integration with TanStack Table**: Explicitly designed to work with @tanstack/react-table for advanced features (sorting, filtering, pagination) documented in separate "Data Table" section
- **Width control**: Supports fixed-width columns via className (e.g., `w-[100px]`)
- **Cell alignment**: Uses Tailwind utilities for alignment (e.g., `text-right` for numeric columns)
- **Footer support**: Includes TableFooter component for summary rows with colspan support
- **Caption support**: Includes TableCaption for accessibility and descriptive text

## Research Notes
- The basic Table component focuses on presentation and structure, delegating complex interactions to TanStack Table integration
- Documentation splits "simple table" from "data table" - the latter contains sorting, filtering, pagination patterns (attempted to access but was blocked)
- Philosophy appears to be "unstyled primitives" that compose well with Tailwind utilities
- No built-in state patterns (loading/empty/error) in the basic component - likely handled at application level
- Follows shadcn/ui's pattern of providing minimal, composable primitives rather than feature-rich components
- CLI installation suggests component code is copied into project rather than imported from package
