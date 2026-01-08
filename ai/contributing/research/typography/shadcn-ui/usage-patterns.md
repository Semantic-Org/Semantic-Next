# shadcn/ui - Typography Usage Patterns

> Last Modified: 2025-11-10

## Component URL
https://ui.shadcn.com/docs/components/typography
Status: ✅ Working
Version: October 2025 (Latest - as of changelog)
Last Verified: 2025-11-10

## Documentation Quality
Good - Clear documentation with practical copy-paste examples. Provides complete code snippets for each typography pattern. However, explicitly states "We do not ship any typography styles by default" - this is a collection of examples/guidelines rather than a pre-built component.

## Component Definition
- **Core purpose**: Provides styling examples and patterns for text elements using Tailwind CSS utility classes. Not a component library but a reference guide for implementing consistent typography.
- **Mental model**: Copy-paste utility class patterns for semantic HTML elements. These are opinionated starting points for typography that developers customize for their projects.
- **Semantic meaning**: A reference implementation showing how to style text elements consistently using Tailwind CSS utilities. Communicates "here's how we approach typography in shadcn/ui projects, adapt as needed."

## Pattern Support Levels
- **Native**: N/A (not a component)
- **Utility-based**: All patterns use Tailwind CSS utility classes
- **Copy-paste**: Entire approach is copy-paste code snippets

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Headings | ✅ | Utility-based | h1, h2, h3, h4 with distinct size and weight hierarchies |
| Paragraph | ✅ | Utility-based | Standard body text with leading and spacing utilities |
| Lead text | ✅ | Utility-based | Larger introductory paragraph style |
| Blockquote | ✅ | Utility-based | Left-bordered italic quote styling |
| Inline code | ✅ | Utility-based | Monospace with background and padding |
| Lists | ✅ | Utility-based | Bulleted lists with consistent spacing |
| Tables | ✅ | Utility-based | Bordered table with zebra striping |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Display (h1) | ✅ | Utility-based | `text-4xl font-extrabold tracking-tight text-balance` - largest heading with scroll margin |
| Body (p) | ✅ | Utility-based | `leading-7 [&:not(:first-child)]:mt-6` - standard paragraph with conditional spacing |
| Caption (small) | ✅ | Utility-based | `text-sm leading-none font-medium` - smallest text style |
| Label | ✅ | Utility-based | `text-sm leading-none font-medium` (same as Small) |
| Lead | ✅ | Utility-based | `text-xl text-muted-foreground` - introductory text larger than body |
| Large | ✅ | Utility-based | `text-lg font-semibold` - emphasized text between lead and body |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Default | ✅ | Utility-based | Standard text uses default foreground color (no explicit class) |
| Muted | ✅ | Utility-based | `text-muted-foreground` design token for de-emphasized text |
| Emphasized | ✅ | Utility-based | `font-semibold` or `font-extrabold` utilities for weight variation |
| Interactive | ⚠️ | Not shown | No hover/focus states documented for typography |

## Variation Patterns

### Font Size
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| 4xl (h1) | ✅ | Utility-based | `text-4xl` - largest heading (approximately 2.25rem/36px) |
| 3xl (h2) | ✅ | Utility-based | `text-3xl` - second-level heading (approximately 1.875rem/30px) |
| 2xl (h3) | ✅ | Utility-based | `text-2xl` - third-level heading (approximately 1.5rem/24px) |
| xl (h4/lead) | ✅ | Utility-based | `text-xl` - fourth-level heading or lead text (approximately 1.25rem/20px) |
| lg (large) | ✅ | Utility-based | `text-lg` - emphasized body text (approximately 1.125rem/18px) |
| base (p) | ✅ | Utility-based | Default size (approximately 1rem/16px) - no class needed |
| sm (small/muted) | ✅ | Utility-based | `text-sm` - small text (approximately 0.875rem/14px) |

### Font Weight
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Extrabold | ✅ | Utility-based | `font-extrabold` used in h1 (font-weight: 800) |
| Bold | ✅ | Utility-based | `font-bold` used in table headers (font-weight: 700) |
| Semibold | ✅ | Utility-based | `font-semibold` used in h2, h3, h4, large, inline code, small (font-weight: 600) |
| Medium | ✅ | Utility-based | `font-medium` used in small and muted (font-weight: 500) |
| Normal | ✅ | Utility-based | Default weight for paragraphs (font-weight: 400) - no class needed |

### Color
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Foreground | ✅ | Utility-based | Default text color (no explicit class) for primary content |
| Muted foreground | ✅ | Utility-based | `text-muted-foreground` design token for secondary/de-emphasized text |
| Background (code) | ✅ | Utility-based | `bg-muted` for inline code background |
| Custom colors | ⚠️ | Not shown | Would use standard Tailwind color utilities |

### Alignment
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Center | ✅ | Utility-based | `text-center` shown in h1 example |
| Left | ✅ | Utility-based | `text-left` shown in table cells (default) |
| Right | ⚠️ | Not shown | Would use `text-right` utility |
| Justify | ⚠️ | Not shown | Would use `text-justify` utility |

### Truncation
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Ellipsis | ⚠️ | Not shown | Would use `truncate` utility (not documented in typography examples) |
| Line clamp | ⚠️ | Not shown | Would use `line-clamp-{n}` utility (not documented in typography examples) |

### Line Height
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Leading-7 | ✅ | Utility-based | `leading-7` for paragraph text (1.75rem/28px) |
| Leading-none | ✅ | Utility-based | `leading-none` for small text (line-height: 1) |
| Default | ✅ | Utility-based | Headings use default leading from Tailwind typography scale |

### Letter Spacing
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Tracking tight | ✅ | Utility-based | `tracking-tight` used in all headings (letter-spacing: -0.025em) |
| Default | ✅ | Utility-based | No tracking class for body text (uses browser default) |

### Text Transform
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Uppercase | ⚠️ | Not shown | Would use `uppercase` utility (not documented in typography examples) |
| Lowercase | ⚠️ | Not shown | Would use `lowercase` utility (not documented in typography examples) |
| Capitalize | ⚠️ | Not shown | Would use `capitalize` utility (not documented in typography examples) |

### Special Features
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text balance | ✅ | Utility-based | `text-balance` in h1 for optimal line wrapping (CSS text-wrap: balance) |
| Scroll margin | ✅ | Utility-based | `scroll-m-20` on all headings for anchor link offset (5rem/80px) |
| Border | ✅ | Utility-based | `border-b` and `border-l-2` for visual separation in h2 and blockquotes |
| Italic | ✅ | Utility-based | `italic` class for blockquote styling |
| Rounded | ✅ | Utility-based | `rounded` corners on inline code |
| Font family | ✅ | Utility-based | `font-mono` for inline code (monospace font stack) |
| Relative positioning | ✅ | Utility-based | `relative` on inline code for positioning context |

### Advanced Utilities
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Arbitrary variants | ✅ | Utility-based | `[&:not(:first-child)]:mt-6` - conditional margin on paragraphs |
| Arbitrary variants | ✅ | Utility-based | `[&>li]:mt-2` - child selector for list items |
| Arbitrary variants | ✅ | Utility-based | `[&[align=center]]:text-center` - attribute selector for table cells |
| First child pseudo | ✅ | Utility-based | `first:mt-0` removes top margin from first h2 |
| Even rows | ✅ | Utility-based | `even:bg-muted` for zebra striping in tables |

## Code Examples

### h1 - Display Heading
```jsx
export function TypographyH1() {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
      Taxing Laughter: The Joke Tax Chronicles
    </h1>
  )
}
```

**Utility breakdown:**
- `scroll-m-20` - Scroll margin for anchor links (5rem/80px offset)
- `text-center` - Center alignment
- `text-4xl` - Extra large font size (2.25rem/36px)
- `font-extrabold` - Heaviest weight (800)
- `tracking-tight` - Reduced letter spacing (-0.025em)
- `text-balance` - Balanced line wrapping for better readability

### h2 - Section Heading
```jsx
export function TypographyH2() {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      The People of the Kingdom
    </h2>
  )
}
```

**Utility breakdown:**
- `scroll-m-20` - Scroll margin for anchor links
- `border-b` - Bottom border for visual separation
- `pb-2` - Padding bottom (0.5rem/8px)
- `text-3xl` - Large font size (1.875rem/30px)
- `font-semibold` - Semi-bold weight (600)
- `tracking-tight` - Reduced letter spacing
- `first:mt-0` - Remove top margin from first h2 in container

### h3 - Subsection Heading
```jsx
export function TypographyH3() {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      The Joke Tax
    </h3>
  )
}
```

**Utility breakdown:**
- `scroll-m-20` - Scroll margin for anchor links
- `text-2xl` - Medium-large font size (1.5rem/24px)
- `font-semibold` - Semi-bold weight (600)
- `tracking-tight` - Reduced letter spacing

### h4 - Minor Heading
```jsx
export function TypographyH4() {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      People stopped telling jokes
    </h4>
  )
}
```

**Utility breakdown:**
- `scroll-m-20` - Scroll margin for anchor links
- `text-xl` - Medium font size (1.25rem/20px)
- `font-semibold` - Semi-bold weight (600)
- `tracking-tight` - Reduced letter spacing

### Paragraph - Body Text
```jsx
export function TypographyP() {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6">
      The king, seeing how much happier his subjects were, realized the error of
      his ways and repealed the joke tax.
    </p>
  )
}
```

**Utility breakdown:**
- `leading-7` - Line height (1.75rem/28px) for comfortable reading
- `[&:not(:first-child)]:mt-6` - Arbitrary variant: adds top margin (1.5rem/24px) to all paragraphs except the first

### Blockquote
```jsx
export function TypographyBlockquote() {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">
      &quot;After all,&quot; he said, &quot;everyone enjoys a good joke, so
      it&apos;s only fair that they should pay for the privilege.&quot;
    </blockquote>
  )
}
```

**Utility breakdown:**
- `mt-6` - Top margin (1.5rem/24px)
- `border-l-2` - Left border (2px width)
- `pl-6` - Left padding (1.5rem/24px)
- `italic` - Italic font style

### Table
```jsx
export function TypographyTable() {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="even:bg-muted m-0 border-t p-0">
            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              King&apos;s Treasury
            </th>
            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              People&apos;s happiness
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="even:bg-muted m-0 border-t p-0">
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Empty
            </td>
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Overflowing
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
```

**Utility breakdown:**
- Container: `my-6 w-full overflow-y-auto` - Vertical margin, full width, vertical scroll
- Table: `w-full` - Full width
- Rows: `even:bg-muted m-0 border-t p-0` - Zebra striping, reset spacing, top border
- Cells: `border px-4 py-2 text-left font-bold` - Border, padding, alignment, weight
- Cells (dynamic): `[&[align=center]]:text-center [&[align=right]]:text-right` - Attribute-based alignment

### List
```jsx
export function TypographyList() {
  return (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
      <li>1st level of puns: 5 gold coins</li>
      <li>2nd level of jokes: 10 gold coins</li>
      <li>3rd level of one-liners : 20 gold coins</li>
    </ul>
  )
}
```

**Utility breakdown:**
- `my-6` - Vertical margin (1.5rem/24px)
- `ml-6` - Left margin (1.5rem/24px) for indentation
- `list-disc` - Bullet points
- `[&>li]:mt-2` - Arbitrary variant: adds top margin (0.5rem/8px) to direct child list items

### Inline Code
```jsx
export function TypographyInlineCode() {
  return (
    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      @radix-ui/react-alert-dialog
    </code>
  )
}
```

**Utility breakdown:**
- `bg-muted` - Muted background color design token
- `relative` - Relative positioning context
- `rounded` - Border radius (0.25rem/4px)
- `px-[0.3rem]` - Arbitrary value: horizontal padding (0.3rem/4.8px)
- `py-[0.2rem]` - Arbitrary value: vertical padding (0.2rem/3.2px)
- `font-mono` - Monospace font family
- `text-sm` - Small font size (0.875rem/14px)
- `font-semibold` - Semi-bold weight (600)

### Lead - Introductory Text
```jsx
export function TypographyLead() {
  return (
    <p className="text-muted-foreground text-xl">
      A modal dialog that interrupts the user with important content and expects
      a response.
    </p>
  )
}
```

**Utility breakdown:**
- `text-muted-foreground` - Muted text color design token
- `text-xl` - Large font size (1.25rem/20px)

### Large - Emphasized Text
```jsx
export function TypographyLarge() {
  return <div className="text-lg font-semibold">Are you absolutely sure?</div>
}
```

**Utility breakdown:**
- `text-lg` - Slightly large font size (1.125rem/18px)
- `font-semibold` - Semi-bold weight (600)

### Small - Caption Text
```jsx
export function TypographySmall() {
  return (
    <small className="text-sm leading-none font-medium">Email address</small>
  )
}
```

**Utility breakdown:**
- `text-sm` - Small font size (0.875rem/14px)
- `leading-none` - Tight line height (1)
- `font-medium` - Medium weight (500)

### Muted - De-emphasized Text
```jsx
export function TypographyMuted() {
  return (
    <p className="text-muted-foreground text-sm">Enter your email address.</p>
  )
}
```

**Utility breakdown:**
- `text-muted-foreground` - Muted text color design token
- `text-sm` - Small font size (0.875rem/14px)

## Notable Features

### Philosophy: Copy-Paste, Not Components
shadcn/ui explicitly states "We do not ship any typography styles by default." This is intentional:
- **Flexibility**: Developers can customize utility classes for their design system
- **No dependencies**: No need to install typography components
- **Starting point**: These are opinionated examples, not prescriptive rules
- **Framework agnostic**: Pure Tailwind CSS utilities work anywhere

### Design Token Integration
Uses shadcn/ui's design token system:
- `text-muted-foreground` - Secondary text color that adapts to theme
- `bg-muted` - Subtle background color for inline elements
- Design tokens are defined in CSS variables, enabling dark mode and theming

### Advanced Tailwind Utilities
Demonstrates sophisticated Tailwind features:
- **Arbitrary variants**: `[&:not(:first-child)]:mt-6` for conditional styling
- **Child selectors**: `[&>li]:mt-2` for targeting direct children
- **Attribute selectors**: `[&[align=center]]:text-center` for dynamic alignment
- **Arbitrary values**: `px-[0.3rem]` for precise spacing
- **Pseudo-class modifiers**: `first:mt-0`, `even:bg-muted`

### Accessibility Considerations
- **Semantic HTML**: Uses proper semantic elements (h1-h4, p, blockquote, etc.)
- **Scroll margin**: `scroll-m-20` on headings prevents content from hiding under fixed headers when using anchor links
- **Text balance**: `text-balance` improves readability by preventing orphan words
- **Color contrast**: `text-muted-foreground` maintains readable contrast ratios

### Typography Scale
Consistent font size hierarchy:
```
h1: text-4xl    (2.25rem / 36px)
h2: text-3xl    (1.875rem / 30px)
h3: text-2xl    (1.5rem / 24px)
h4: text-xl     (1.25rem / 20px)
lead: text-xl   (1.25rem / 20px)
large: text-lg  (1.125rem / 18px)
p: base         (1rem / 16px) - implicit
small: text-sm  (0.875rem / 14px)
```

### Weight Hierarchy
Deliberate use of font weights:
- **Extrabold (800)**: Only for h1 (maximum emphasis)
- **Bold (700)**: Table headers
- **Semibold (600)**: h2-h4, large text, inline code, small text
- **Medium (500)**: Small and muted text
- **Normal (400)**: Body paragraphs (default)

### Spacing System
Consistent spacing using Tailwind's scale:
- `mt-6` / `my-6` (1.5rem/24px) - Standard element spacing
- `mt-2` (0.5rem/8px) - Tight spacing (list items)
- `pb-2` (0.5rem/8px) - Small padding
- `px-4 py-2` (1rem/0.5rem) - Cell padding
- `scroll-m-20` (5rem/80px) - Generous scroll offset

### Visual Enhancements
- **Border accents**: `border-b` on h2, `border-l-2` on blockquote for visual separation
- **Rounded corners**: `rounded` on inline code for softer appearance
- **Background color**: `bg-muted` on inline code for subtle distinction
- **Zebra striping**: `even:bg-muted` on table rows for scannability

## Research Notes

### Documentation Approach
- **Non-prescriptive**: Explicitly states these are examples, not required components
- **Educational**: Each example is a complete, copy-paste-ready function component
- **Practical**: Uses real-world text ("Joke Tax Chronicles") rather than lorem ipsum
- **Organized**: Examples progress from large elements (headings) to small (muted text)

### shadcn/ui Architecture
- **Component library philosophy**: "Copy the code into your project, not install as dependency"
- **Built on Radix UI**: For accessible component primitives
- **Styled with Tailwind CSS**: All styling via utility classes
- **Design token system**: CSS variables for theming (`--muted`, `--muted-foreground`, etc.)
- **React-based**: All examples are React function components

### Framework Context
- **Not a traditional UI library**: You don't `npm install` shadcn/ui components
- **CLI-based**: Use `shadcn-ui` CLI to add components to your project
- **Customization-first**: Code lives in your repo, you own and modify it
- **Radix UI + Tailwind**: Combines accessible primitives with utility-first styling

### Comparison to Traditional Typography Components
Most frameworks ship typography components with props:
```jsx
// Traditional approach (e.g., Material-UI)
<Typography variant="h1" align="center">Title</Typography>

// shadcn/ui approach (utility classes)
<h1 className="text-4xl text-center font-extrabold">Title</h1>
```

shadcn/ui's approach:
- ✅ More explicit (see exactly what styles apply)
- ✅ More flexible (combine any utilities)
- ✅ Easier to customize (change classes directly)
- ⚠️ More verbose (longer className strings)
- ⚠️ Requires Tailwind knowledge (learning curve)

### Version Information
- **Current**: October 2025 (per changelog)
- **Recent additions**: Spinner, Kbd, Button Group, Input Group, Field, Item, Empty components
- **Stability**: Mature project with 99.4k+ GitHub stars
- **Versioning**: No semantic versioning (copy-paste model means version is when you copied)

### Best Practices Implied
1. **Use semantic HTML**: Proper h1-h6, p, blockquote elements
2. **Consistent spacing**: Use Tailwind's spacing scale (multiples of 0.25rem)
3. **Scroll-aware headings**: Add `scroll-m-20` to all headings for anchor link UX
4. **Conditional spacing**: Use arbitrary variants like `[&:not(:first-child)]` to avoid double margins
5. **Design tokens**: Use `text-muted-foreground` instead of hardcoded colors
6. **Typography hierarchy**: Maintain clear visual distinction between heading levels
7. **Tight tracking for headings**: Use `tracking-tight` to improve heading appearance at large sizes
8. **Accessible contrast**: Ensure muted text meets WCAG guidelines

### Integration Considerations
To use these patterns in a project:
1. **Install Tailwind CSS**: Required for all utility classes
2. **Configure shadcn/ui**: Set up design tokens in `tailwind.config.js`
3. **Add fonts**: Configure font families (default, mono) in Tailwind config
4. **Copy examples**: Paste desired typography functions into your components
5. **Customize**: Modify utility classes to match your design system

### Unique Strengths
1. **Complete ownership**: Code lives in your project, no black box dependencies
2. **Tailwind mastery**: Demonstrates advanced Tailwind techniques (arbitrary variants, design tokens)
3. **Semantic-first**: Emphasizes proper HTML elements over generic styled divs
4. **Accessibility built-in**: Scroll margins, semantic markup, proper contrast
5. **Minimal abstraction**: What you see is what you get - no hidden styles
6. **Customization-friendly**: Easy to modify since you own the code
7. **Design system integration**: Works seamlessly with shadcn/ui's token system

### Limitations
1. **Not a component**: No props API, must modify classes directly
2. **Tailwind dependency**: Cannot use without Tailwind CSS
3. **Manual consistency**: No enforcement of typography rules across project
4. **Verbosity**: className strings can get long with multiple utilities
5. **No variants system**: Unlike component libraries, can't easily switch between variants
6. **Limited examples**: Only covers common patterns, may need to extend for edge cases

## Conclusion

shadcn/ui's typography approach is fundamentally different from traditional component libraries. Instead of providing a `Typography` component with props, it offers copy-paste examples of how to style semantic HTML with Tailwind CSS utilities.

This approach prioritizes:
- **Transparency**: See exactly what styles apply
- **Flexibility**: Combine any utilities without prop limitations
- **Ownership**: Code lives in your project, modify freely
- **Learning**: Demonstrates Tailwind best practices

It's ideal for teams who:
- Already use Tailwind CSS
- Want full control over styling
- Prefer explicit, visible styling
- Value customization over consistency enforcement

It's less suitable for teams who:
- Don't use Tailwind CSS
- Want enforced design system consistency via components
- Prefer component abstractions over utility classes
- Need prop-based variant switching
