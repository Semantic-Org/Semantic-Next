# CDN Bundle Preset Analysis

## 1. Proposed Presets

I propose five presets, each targeting a distinct use case:

| Preset | Use Case |
|---|---|
| **core** | The absolute minimum for any web page — layout primitives, text, and the most universal interactive elements. |
| **standard** | Everything a typical multi-page website or dashboard needs — the "don't make me think" default. |
| **forms** | All form-related components for data entry pages, surveys, settings screens, and CRUD interfaces. |
| **data** | Components for displaying, navigating, and visualizing structured data (tables, charts, pagination). |
| **all** | Every component — for prototyping, playgrounds, or when you genuinely don't know what you'll need yet. |

---

## 2. Component Assignments

### `core` (25 components)

The foundation. These are the components that appear on virtually every web page regardless of its purpose. If you're building anything at all, you almost certainly need these.

1. Box
2. Button
3. Container
4. Divider
5. Flex
6. Grid
7. Heading
8. Icon
9. Image
10. Input
11. Label
12. Link
13. List
14. Menu
15. Message
16. Modal
17. Popover
18. Space
19. Spinner
20. Stack
21. Text
22. Toast
23. Tooltip
24. Typography
25. Card

### `standard` (48 components)

Everything in `core` plus the next tier of components that a typical website, admin panel, or content-driven app will reach for. This is the preset I'd use 80% of the time.

Includes everything in `core`, plus:

26. Accordion
27. Alert
28. Avatar
29. Breadcrumb
30. Checkbox
31. Dropdown
32. Empty State
33. Form
34. Form Field
35. Kbd
36. Navbar
37. Navigation Menu
38. Pagination
39. Progress
40. Radio Button
41. Result
42. Select
43. Sidebar
44. Skeleton
45. Slider
46. Switch
47. Table
48. Tabs

### `forms` (19 components)

Everything you need to build rich data-entry interfaces. Intended to be loaded alongside `core` or `standard`.

1. Autocomplete
2. Checkbox
3. Color Picker
4. Date Picker
5. Dropdown
6. File Upload
7. Form
8. Form Field
9. Input
10. Number Input
11. Password Input
12. Radio Button
13. Rating
14. Select
15. Slider
16. Switch
17. Textarea
18. Transfer List
19. Upload

### `data` (12 components)

Components for data-heavy pages: dashboards, reports, analytics views, admin tables.

1. Chart
2. Pagination
3. Progress
4. QR Code
5. Rating
6. Result
7. Scroll Area
8. Statistic
9. Steps
10. Table
11. Timeline
12. Tree

### `all` (74 components)

Every component listed below. For prototyping or playgrounds where you want zero friction.

*(All 74 unique components from the full list.)*

---

### Components in "none" (load explicitly only)

These components are NOT included in `standard` but ARE available in `all` or in a specialized preset. Some appear in `forms` or `data` but not `standard` — I'm listing below the ones that don't appear in `standard` and why:

| Component | Why explicit-only (outside specialized presets) |
|---|---|
| **Aspect Ratio** | Niche layout utility. CSS `aspect-ratio` handles most cases natively now. Only needed for specific media embedding patterns. |
| **Autocomplete** | Specialized form component — available in `forms` preset. Most pages don't need typeahead. |
| **Calendar** | Heavy, specialized. Most sites use Date Picker for input; a full calendar view is uncommon. |
| **Carousel** | Polarizing UX pattern. When you need it, you know you need it. Not a default. |
| **Chart** | Data visualization is a specific domain. Available in `data` preset. Would add significant weight to a general preset. |
| **Code** | Developer tools, documentation sites, technical blogs only. |
| **Color Picker** | Very specialized input. Available in `forms` preset. |
| **Command Palette** | Power-user feature for app-like interfaces. Not a general-purpose component. |
| **Context Menu** | Requires deliberate UX design. Right-click menus are app-specific, not something you sprinkle in casually. |
| **Date Picker** | Specialized form input. Available in `forms` preset. |
| **Drawer** | Overlaps with Sidebar and Modal. When you need the specific drawer pattern, load it explicitly. |
| **File Upload** | Specialized form component. Available in `forms` preset. |
| **Menubar** | Desktop-app-style menu bars are uncommon in web UIs. Very specific to certain application types. |
| **Number Input** | Specialized form input. Available in `forms` preset. |
| **Password Input** | Specialized form input. Available in `forms` preset. |
| **Portal** | Low-level rendering primitive. Most users interact with this indirectly through Modal, Popover, etc. |
| **QR Code** | Extremely niche. Useful, but you know when you need it. Available in `data` preset. |
| **Scroll Area** | Custom scrollbars are a specific aesthetic choice, not a default need. Available in `data` preset. |
| **Statistic** | Dashboard-specific. Available in `data` preset. |
| **Steps** | Wizard/onboarding flows are a specific pattern. Available in `data` preset. |
| **Textarea** | I considered putting this in `standard`, but plain `<textarea>` works well enough that the enhanced component is really a forms concern. Available in `forms`. |
| **Timeline** | Specialized display component. Available in `data` preset. |
| **Transfer List** | Highly specialized dual-list selection pattern. Available in `forms` preset. |
| **Tree** | Hierarchical data display is specialized. Available in `data` preset. |
| **Upload** | Overlaps with File Upload — presumably a more general variant. Available in `forms` preset. |

---

## 3. Summary Counts

| Preset | Count | Relationship |
|---|---|---|
| `core` | 25 | Standalone |
| `standard` | 48 | Superset of `core` |
| `forms` | 19 | Standalone (overlaps with `standard` on ~8 components) |
| `data` | 12 | Standalone (overlaps with `standard` on ~4 components) |
| `all` | 74 | Everything |

Every one of the ~74 unique components appears in at least one preset (even if that preset is only `all`).

---

## 4. Honest Assessment: When I Use Presets vs. Explicit Lists

### When I reach for a preset

**Almost always at the start.** When a user asks me to build a page, I don't yet know the full component inventory I'll need. I'll reach for `standard` because the cognitive cost of auditing which specific components I need is higher than the cost of a few extra parallel fetches. The calculus is simple: my time reasoning about which 15 of 48 components I actually need is worth more than the ~200KB of extra first-load bandwidth that will be cached anyway.

For a form-heavy page, I'd use `standard` + `forms`. For a dashboard, `standard` + `data`. For a quick prototype, `all`.

### When I list components explicitly

**In production-hardened code.** Once a page is stable and I know exactly what it uses, I'd switch to an explicit list. This is the "optimization pass" — it's about communicating intent to future readers as much as it is about performance. An explicit list of `button,input,modal,table` tells you exactly what this page does. `standard` tells you nothing.

I'd also list explicitly when I need only 2-3 components. Loading `standard` for a page that just needs `button` and `icon` feels wrong even if the cost is small — it obscures intent.

### How I reason about the tradeoff

The key insight is that presets are a **developer experience** feature, not primarily a **performance** feature. Since components are fetched in parallel and cached independently, the performance difference between loading 25 and 48 components is modest — maybe a few hundred milliseconds on first load, zero on subsequent loads.

The real cost of over-including is not bandwidth but **ambiguity**. When I see `standard` in a script tag, I don't know which of those 48 components are actually used. When I see an explicit list, I know exactly what's on the page.

So my heuristic is:
- **Prototyping / exploration / early development** → preset (maximize velocity)
- **Production / stable pages** → explicit list (maximize clarity)
- **Middle ground** → preset is fine; premature optimization of import lists is not where I'd spend my time

The presets should be designed so that `standard` is genuinely useful for 80% of pages without feeling bloated. That's why I kept it at 48 rather than pushing it to 60+. If a preset includes components that most pages don't use, developers lose trust in it and stop using it — which defeats the purpose entirely.

### One more thing

I'd advocate for `core` being intentionally small (25 components) so that it serves as a meaningful distinction from `standard`. If `core` creeps up to 35-40, it becomes "standard lite" and loses its identity. `core` should be the answer to "I'm building a simple landing page with a nav, some text, a few buttons, and a modal." `standard` should be the answer to "I'm building an actual application."
