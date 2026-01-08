# MUI - Breadcrumbs Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mui.com/material-ui/react-breadcrumbs/
Status: ✅ Working
Version: Current (Material-UI v5+)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Includes full API reference, multiple examples, accessibility guidance, and integration patterns.

## Component Definition
- **Core purpose**: Provides hierarchical navigation that shows the user's location within a site's structure and enables navigation to any ancestor pages.
- **Mental model**: A list of links representing the path from the root to the current page, with the last item typically being the current page (non-clickable).
- **Semantic meaning**: Represents a navigation trail showing where the user is in the site hierarchy, enabling quick jumps to parent levels.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `separator="/"`, `maxItems={2}`)
- **Composed**: Via composition/children (e.g., using `<Link>` and `<Typography>` as children)
- **CSS-only**: Requires custom styling (e.g., `sx={{ ... }}` prop)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text links | ✅ | Composed | Uses MUI `Link` components as children with `Typography` for current page |
| Icon support | ✅ | Composed | Icons placed within Link/Typography children using `sx={{ mr: 0.5 }}` |
| Dropdown menus | ✅ | Composed | Custom Menu component with collapsed items, triggered by IconButton |
| Custom separators | ✅ | Native | `separator` prop accepts string or React node (e.g., icons) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Simple breadcrumb | ✅ | Composed | Basic implementation with Link + Typography children |
| With dropdown | ✅ | Composed | Uses Menu + MenuItem for condensed navigation |
| Icon breadcrumb | ✅ | Composed | Icons embedded in Link/Typography with `fontSize="inherit"` |
| Collapsed breadcrumb | ✅ | Native | `maxItems` prop with ellipsis button for hidden items |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Current page | ✅ | Composed | Last item as Typography (not Link) with `sx={{ color: 'text.primary' }}` |
| Disabled items | ✅ | CSS-only | Apply disabled styling via sx prop or custom classes |
| Clickable/non-clickable | ✅ | Composed | Links vs Typography components differentiate clickable vs static items |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Separator styles | ✅ | Native | String separators (`"/"`, `"›"`, `"-"`) or icon components (NavigateNextIcon) |
| Size options | ✅ | CSS-only | Control via sx prop, no dedicated size variants |
| Responsive behavior | ✅ | Native | `maxItems`, `itemsBeforeCollapse`, `itemsAfterCollapse` for responsive collapsing |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click navigation | ✅ | Composed | Handled via Link href or onClick handlers |
| Router integration | ✅ | Composed | Link accepts `component={RouterLink}` prop for react-router integration |
| Programmatic nav | ✅ | Composed | Standard React Router or custom navigation logic in onClick |
| Expand collapsed | ✅ | Native | Built-in ellipsis button (text: "Show path") to expand collapsed items |

## Accessibility Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| aria-label | ✅ | Native | Required `aria-label="breadcrumb"` on Breadcrumbs component |
| aria-current | ❌ | Not documented | Not explicitly mentioned in documentation |
| Keyboard navigation | ✅ | Native | Standard link keyboard nav (Tab, Enter) through Link components |
| Ordered list | ✅ | Native | Renders as `<nav><ol>` structure per WAI-ARIA pattern |
| aria-hidden separators | ✅ | Native | Separators automatically hidden from screen readers |

## Code Examples

### Basic Breadcrumb
```jsx
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function BasicBreadcrumbs() {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          MUI
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          Core
        </Link>
        <Typography sx={{ color: 'text.primary' }}>Breadcrumbs</Typography>
      </Breadcrumbs>
    </div>
  );
}
```

### Custom Separators (String & Icon)
```jsx
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// String separator
<Breadcrumbs separator="›" aria-label="breadcrumb">
  {breadcrumbs}
</Breadcrumbs>

// Different string
<Breadcrumbs separator="-" aria-label="breadcrumb">
  {breadcrumbs}
</Breadcrumbs>

// Icon separator
<Breadcrumbs
  separator={<NavigateNextIcon fontSize="small" />}
  aria-label="breadcrumb"
>
  {breadcrumbs}
</Breadcrumbs>
```

### Breadcrumbs with Icons
```jsx
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import DataArray from '@mui/icons-material/DataArray';

<Breadcrumbs aria-label="breadcrumb" separator="›">
  <Link underline="hover" color="inherit" href="/">
    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    Home
  </Link>
  <Link underline="hover" color="inherit" href="/dsa/">
    <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    Data Structures
  </Link>
  <Typography sx={{ color: 'text.primary' }}>
    <DataArray sx={{ mr: 0.5 }} fontSize="inherit" />
    Array
  </Typography>
</Breadcrumbs>
```

### Collapsed Breadcrumbs with maxItems
```jsx
<Breadcrumbs maxItems={2} aria-label="breadcrumb">
  <Link underline="hover" color="inherit" href="#">
    Home
  </Link>
  <Link underline="hover" color="inherit" href="#">
    Catalog
  </Link>
  <Link underline="hover" color="inherit" href="#">
    Accessories
  </Link>
  <Link underline="hover" color="inherit" href="#">
    New Collection
  </Link>
  <Typography sx={{ color: 'text.primary' }}>Belts</Typography>
</Breadcrumbs>
```

### React Router Integration
```jsx
import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Typography, Link } from '@mui/material';

function BreadcrumbsNav() {
  let location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link color="inherit" component={RouterLink} to="/">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="textPrimary" key={to}>
            {value}
          </Typography>
        ) : (
          <Link color="inherit" component={RouterLink} to={to} key={to}>
            {value}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
```

[View Live Examples](https://mui.com/material-ui/react-breadcrumbs/)

## Notable Features

- **Automatic collapsing**: Built-in ellipsis button with configurable `itemsBeforeCollapse` and `itemsAfterCollapse` props for responsive behavior
- **Flexible separators**: Accepts any React node as separator, enabling custom icons, SVGs, or styled elements
- **Router-agnostic**: Works with any routing solution through `component` prop on Link
- **WAI-ARIA compliant**: Implements proper semantic HTML (`<nav><ol>`) with hidden separators
- **Composition-based**: Uses child components (Link/Typography) for maximum flexibility
- **Menu integration**: Documentation includes pattern for condensed breadcrumbs with dropdown Menu
- **Icon integration**: Natural composition pattern for adding icons alongside text
- **Expand text customization**: `expandText` prop allows localization of the collapse button text

## Research Notes

- Documentation is comprehensive with API reference at separate URL (https://mui.com/material-ui/api/breadcrumbs/)
- Live interactive examples available on main documentation page
- Strong emphasis on accessibility with explicit WAI-ARIA pattern reference (https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
- Composition-heavy approach: most functionality achieved through child components rather than props
- No dedicated size variants; sizing controlled through Typography and Link component props
- Current page (last breadcrumb) conventionally rendered as Typography instead of Link
- Source code available at `packages/mui-material/src/Breadcrumbs` in GitHub repo
- Multiple demo files in docs show different patterns (BasicBreadcrumbs, CollapsedBreadcrumbs, IconBreadcrumbs, etc.)
- Menu-based condensed pattern mentioned but requires custom implementation with state management
- No native dropdown support; requires composing with Menu, MenuItem, and IconButton components
