# ShadCN - Empty Component - Usage Patterns
> Framework: ShadCN
> Last Updated: 2025-11-06
> Documentation URL: https://ui.shadcn.com/docs/components/empty

## Overview

The Empty component is used to display empty states in applications. It provides a composable, flexible architecture for showing when there is no data, content, or results to display. The component follows ShadCN's composition-first philosophy, offering multiple sub-components that can be arranged to create various empty state layouts.

**Primary Purpose:** Communicate to users that a view, list, search, or other content area is currently empty, while often providing guidance or actions to resolve the empty state.

**Mental Model:** A structured, customizable empty state display built from composable parts (media, header, content) that can incorporate icons, avatars, text, and action elements.

## Core Concepts

### Composition Architecture
ShadCN's Empty component follows a composition pattern with multiple specialized sub-components rather than a monolithic component with many props. This approach provides maximum flexibility and customization while maintaining consistent structure.

### Component Hierarchy
The Empty component uses a semantic hierarchy:
1. **Empty** - Root container providing base layout
2. **EmptyHeader** - Groups the visual media and text content
3. **EmptyMedia** - Displays visual elements (icons, avatars, images)
4. **EmptyTitle** - Primary heading
5. **EmptyDescription** - Secondary descriptive text
6. **EmptyContent** - Action area for buttons, inputs, or other interactive elements

### Styling Philosophy
Components use Tailwind CSS classes for styling, allowing full customization through the `className` prop. This aligns with ShadCN's copy-paste component model where developers own and customize the code.

## Component API

### Props

#### Empty (Root Component)
- **className** (optional): Custom CSS classes to apply to the root container
  - Type: `string`
  - Default: `undefined`
  - Used for: Custom layout, spacing, or container styling

#### EmptyHeader
- **className** (optional): Custom CSS classes for the header section
  - Type: `string`
  - Default: `undefined`
  - Used for: Adjusting spacing, alignment, or layout of the media and text group

#### EmptyMedia
- **variant** (optional): Visual style variant for the media container
  - Type: `"icon" | "default"`
  - Default: `"default"`
  - Values:
    - `"icon"` - Optimized styling for icon display
    - `"default"` - Generic styling for avatars or custom content
- **className** (optional): Custom CSS classes for the media container
  - Type: `string`
  - Default: `undefined`

#### EmptyTitle
- **className** (optional): Custom CSS classes for the title text
  - Type: `string`
  - Default: `undefined`
  - Used for: Typography adjustments, color, spacing

#### EmptyDescription
- **className** (optional): Custom CSS classes for the description text
  - Type: `string`
  - Default: `undefined`
  - Used for: Typography adjustments, color, spacing

#### EmptyContent
- **className** (optional): Custom CSS classes for the content/action area
  - Type: `string`
  - Default: `undefined`
  - Used for: Layout, spacing, alignment of action elements

### Variants/Sizes/Colors

#### EmptyMedia Variants
1. **icon** - Specifically styled for icon-based empty states
2. **default** - General-purpose styling for avatars or custom media

#### Visual Style Variants (Applied via className)
The documentation demonstrates several visual patterns achieved through Tailwind classes:

1. **Outline Variant** - Dashed border style
   - Applied via: `border border-dashed` classes on Empty component
   - Use case: Emphasizing the empty state boundary

2. **Background Variant** - Gradient background styling
   - Applied via: `bg-gradient-to-b` and related gradient utilities
   - Use case: Adding visual interest and depth to empty states

3. **Default/Plain** - Minimal styling without borders or backgrounds
   - Default appearance when no additional classes applied
   - Use case: Clean, unobtrusive empty states

### Composition

The Empty component is designed for flexible composition:

```
Empty (container)
├── EmptyHeader (media + text group)
│   ├── EmptyMedia (visual element)
│   │   └── [Icon | Avatar | Image | Custom]
│   ├── EmptyTitle (heading)
│   └── EmptyDescription (subtext)
└── EmptyContent (actions)
    └── [Button | Input | Link | Custom]
```

**Key Composition Principles:**
- All parts are optional and can be omitted as needed
- Components can be reordered if custom layouts are required
- Multiple instances of components can be used (e.g., multiple buttons in EmptyContent)
- Child content can be any valid React node

## Usage Patterns

### Pattern 1: Basic Icon Empty State
**Description:** The foundational pattern using an icon, title, description, and single action button.

**Structure:**
- EmptyMedia with variant="icon" containing an icon component
- EmptyTitle with primary message
- EmptyDescription with explanatory text
- EmptyContent with call-to-action button

**Use Case:** General empty states for lists, searches, or data views

**Code Pattern:**
```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <IconComponent />
    </EmptyMedia>
    <EmptyTitle>No results found</EmptyTitle>
    <EmptyDescription>Try adjusting your search or filters</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Clear filters</Button>
  </EmptyContent>
</Empty>
```

### Pattern 2: Outlined Empty State
**Description:** Adds a dashed border to create a distinct visual boundary for the empty state area.

**Structure:**
- Empty component with `border border-dashed` classes
- Standard header and content composition

**Use Case:** Empty states within cards, panels, or bounded areas where visual separation is needed

**Code Pattern:**
```tsx
<Empty className="border border-dashed">
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Icon />
    </EmptyMedia>
    <EmptyTitle>Title</EmptyTitle>
    <EmptyDescription>Description</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Action</Button>
  </EmptyContent>
</Empty>
```

### Pattern 3: Gradient Background Empty State
**Description:** Uses gradient backgrounds to add visual interest and depth to empty states.

**Structure:**
- Empty component with gradient utility classes (`bg-gradient-to-b`, etc.)
- Standard composition with icon, title, description, and actions

**Use Case:** Featured empty states, onboarding screens, or landing areas that need more visual prominence

**Code Pattern:**
```tsx
<Empty className="bg-gradient-to-b from-background to-muted">
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Icon />
    </EmptyMedia>
    <EmptyTitle>Title</EmptyTitle>
    <EmptyDescription>Description</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Action</Button>
  </EmptyContent>
</Empty>
```

### Pattern 4: Avatar-Based Empty State
**Description:** Uses avatar component(s) instead of icons for user-centric empty states.

**Structure:**
- EmptyMedia with variant="default" (not "icon")
- Avatar component as child of EmptyMedia
- Can show single avatar or grouped avatars

**Use Case:** Empty states related to people, teams, contacts, or social features

**Code Pattern:**
```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="default">
      <Avatar>
        <AvatarImage src="..." />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
    </EmptyMedia>
    <EmptyTitle>No team members</EmptyTitle>
    <EmptyDescription>Invite your first team member</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Invite member</Button>
  </EmptyContent>
</Empty>
```

### Pattern 5: Multiple Avatar Group
**Description:** Displays multiple avatars in the media area, often used for collaborative or multi-user contexts.

**Structure:**
- EmptyMedia with variant="default"
- Multiple Avatar components grouped within EmptyMedia
- Standard title, description, and action composition

**Use Case:** Empty states for collaborative spaces, team views, or social features requiring representation of multiple users

**Code Pattern:**
```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="default">
      <Avatar>...</Avatar>
      <Avatar>...</Avatar>
      <Avatar>...</Avatar>
    </EmptyMedia>
    <EmptyTitle>No collaborators</EmptyTitle>
    <EmptyDescription>Add team members to start collaborating</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Add collaborators</Button>
  </EmptyContent>
</Empty>
```

### Pattern 6: Search Input Integration
**Description:** Incorporates a search input directly into the empty state for immediate action.

**Structure:**
- EmptyMedia with icon
- Title and description explaining search functionality
- EmptyContent with InputGroup component for search

**Use Case:** Empty search results or searchable lists where users can immediately refine their search

**Code Pattern:**
```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <SearchIcon />
    </EmptyMedia>
    <EmptyTitle>Search for something</EmptyTitle>
    <EmptyDescription>Enter a keyword to find results</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <InputGroup>
      <Input placeholder="Search..." />
      <Button>Search</Button>
    </InputGroup>
  </EmptyContent>
</Empty>
```

### Pattern 7: Multiple Action Buttons
**Description:** Provides multiple action options in the content area.

**Structure:**
- Standard header composition
- EmptyContent with multiple Button components

**Use Case:** Empty states where users have multiple valid next actions (e.g., "Create new" vs "Import existing")

**Code Pattern:**
```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Icon />
    </EmptyMedia>
    <EmptyTitle>No items yet</EmptyTitle>
    <EmptyDescription>Get started by creating or importing</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Create new</Button>
    <Button variant="outline">Import existing</Button>
  </EmptyContent>
</Empty>
```

### Pattern 8: Minimal Text-Only Empty State
**Description:** Simplified empty state with just title and description, no media or actions.

**Structure:**
- Empty and EmptyHeader only
- EmptyTitle and EmptyDescription
- No EmptyMedia or EmptyContent

**Use Case:** Subtle empty states for secondary features or informational displays

**Code Pattern:**
```tsx
<Empty>
  <EmptyHeader>
    <EmptyTitle>No notifications</EmptyTitle>
    <EmptyDescription>You're all caught up!</EmptyDescription>
  </EmptyHeader>
</Empty>
```

## Examples from Documentation

The documentation showcases several complete examples:

### Example 1: Default Empty State
Basic empty state with icon, title, description, and button.

### Example 2: Outlined Empty State
Uses `border border-dashed` classes to add a dashed border around the entire empty state component.

### Example 3: Background Gradient
Implements `bg-gradient-to-b` with color stops to create a gradient background effect.

### Example 4: Single Avatar
Shows EmptyMedia with variant="default" containing a single Avatar component.

### Example 5: Avatar Group
Displays multiple Avatar components within a single EmptyMedia container.

### Example 6: Search Integration
Demonstrates InputGroup component within EmptyContent for search functionality.

## Accessibility

### ARIA and Semantic HTML
- Components render semantic HTML elements appropriate to their role
- EmptyTitle likely uses heading elements (h2, h3, etc.)
- EmptyDescription uses paragraph or div elements
- Proper document outline maintained through heading hierarchy

### Icon Accessibility
- Icons within EmptyMedia should include appropriate aria-labels
- Decorative icons should have aria-hidden="true"
- Icon libraries integrated with ShadCN typically handle accessibility attributes

### Interactive Elements
- Buttons and inputs within EmptyContent maintain standard accessibility features
- Keyboard navigation supported through standard HTML elements
- Focus management handled by underlying Button and Input components

### Screen Reader Considerations
- Content is presented in logical reading order
- Empty states should be announced clearly to screen reader users
- Important: Consider adding role="status" or aria-live for dynamic empty states

### Color and Contrast
- Text colors should meet WCAG AA standards (managed through Tailwind color system)
- Gradient backgrounds should maintain sufficient contrast
- Icons should have sufficient contrast against backgrounds

## Framework-Specific Patterns

### Copy-Paste Component Model
ShadCN's unique approach means:
- Components are added to your project source, not installed as dependencies
- Full code ownership allows unlimited customization
- No version lock-in or update dependencies
- Components can be modified directly in your codebase

### CLI Installation
- Installation via: `pnpm dlx shadcn@latest add empty`
- Copies component files to your project's components directory
- Automatically handles dependencies and imports
- Can be installed alongside other ShadCN components

### Tailwind CSS Integration
- All styling via Tailwind utility classes
- No custom CSS files required
- Theme tokens (colors, spacing) from Tailwind config
- Dark mode support through Tailwind's dark mode utilities

### Composition Over Configuration
- No single monolithic component with dozens of props
- Instead: multiple small components composed together
- Flexibility to arrange components in any order
- Easy to omit unused parts of the component structure

### TypeScript Support
- Components are TypeScript-first
- Full type safety for props and composition
- IntelliSense support in modern editors
- Generic types for flexible children content

### Design System Integration
- Inherits from your Tailwind configuration
- Uses CSS custom properties for theme values
- Consistent with other ShadCN components
- Supports design tokens and semantic colors

### Variant Pattern
Unlike many UI libraries that handle variants through props with many options, ShadCN uses:
- Limited core variants (e.g., EmptyMedia variant: "icon" | "default")
- Custom styling via className for everything else
- Tailwind utilities for most visual variations
- Developers compose their own variant patterns

### Common Customization Points
1. **Spacing:** Adjust gap, padding, margin via Tailwind classes
2. **Typography:** Change text sizes, weights, colors for title and description
3. **Media size:** Customize icon or avatar sizes through their respective components
4. **Border styles:** Add or modify borders, rounded corners
5. **Background:** Apply colors, gradients, or patterns
6. **Layout:** Change flex direction, alignment, or grid layouts

## Notes

### Installation Method
The component is installed via ShadCN CLI command rather than npm package installation. This adds the component source code directly to your project.

### Dependency Requirements
- Requires Tailwind CSS to be configured in the project
- May require Radix UI primitives for underlying functionality
- Avatar component dependency if using avatar-based empty states
- Icon library (e.g., Lucide React) for icon usage

### Design Philosophy Alignment
The Empty component exemplifies ShadCN's core philosophy:
- **Copy, don't install:** Components live in your codebase
- **Composition over props:** Build with small pieces
- **Tailwind-first:** All styling through utility classes
- **Unstyled primitives:** Minimal base styling, maximum customization

### Flexibility Advantages
- Can easily add new sub-components or remove existing ones
- No prop limitations - modify component source as needed
- Easy to extend with custom functionality
- Full control over HTML structure and accessibility attributes

### Common Use Cases
1. Empty search results
2. Empty data tables or lists
3. Uninitialized application states
4. Onboarding screens
5. Error recovery states
6. "Zero data" dashboards
7. Empty notification centers
8. Unpopulated user profiles

### Comparison to Other Patterns
Unlike traditional "Empty State" components that might use a single component with many props:
```tsx
// Traditional approach (not ShadCN)
<EmptyState
  icon={<Icon />}
  title="No results"
  description="Try again"
  action={<Button>Action</Button>}
  variant="outline"
/>
```

ShadCN prefers composition:
```tsx
// ShadCN approach
<Empty className="border border-dashed">
  <EmptyHeader>
    <EmptyMedia variant="icon"><Icon /></EmptyMedia>
    <EmptyTitle>No results</EmptyTitle>
    <EmptyDescription>Try again</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Action</Button>
  </EmptyContent>
</Empty>
```

This composition approach provides:
- More explicit structure
- Easier to customize individual parts
- Better TypeScript inference
- Clearer component boundaries
- Simpler mental model (composition vs configuration)

### Integration with Other ShadCN Components
The Empty component is designed to work seamlessly with:
- **Button** - For action elements in EmptyContent
- **Avatar** - For user-centric empty states
- **Input/InputGroup** - For search or form integration
- **Card** - Often wrapped in Card component for bounded empty states
- **Icons** - Via Lucide React or other icon libraries

### Missing Features (Intentional)
ShadCN's Empty component intentionally does not include:
- Built-in animations or loading states (add via Tailwind utilities if needed)
- Predefined size variants (customize via className)
- Theme variants beyond the base composition (apply via Tailwind)
- Complex state management (this is a presentational component)

### Best Practices
1. Keep title text concise (1-5 words)
2. Description should explain why empty and/or how to resolve
3. Provide clear call-to-action when applicable
4. Use icons that clearly represent the empty context
5. Maintain consistent empty state patterns across application
6. Consider progressive disclosure - start simple, add complexity only if needed

### Performance Considerations
- Lightweight component with minimal JavaScript
- No runtime style generation
- Static rendering by default
- Efficient re-renders due to simple composition
- Tailwind CSS purges unused utilities in production
