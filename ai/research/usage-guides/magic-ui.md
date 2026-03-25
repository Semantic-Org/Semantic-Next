# Magic UI — Component Documentation Structure
## Component Analyzed: Dock (primary), Terminal and Marquee (cross-referenced)
## URL: https://magicui.design/docs/components/dock

## Page Layout

Three-column layout:
- **Left sidebar**: Persistent navigation organized by category (Getting Started, Templates, Components, Special Effects, Animations, Device Mocks, Buttons, Backgrounds, Community). Components are listed as flat links under each category heading. Some items have "New" or "Pro" badges.
- **Center content**: The main documentation, described section-by-section below.
- **Right sidebar**: "On This Page" table of contents (anchor links to H2/H3 headings), a "Contribute" section (Report an issue, Request a feature, Edit this page), and a promotional card for Magic UI Pro.

## Section Taxonomy (in page order)

### 1. Breadcrumb
- **Purpose**: Orient the user within the site hierarchy.
- **Content type**: Linked breadcrumb trail — `Docs / Components / Dock`
- **Notes**: Standard three-level breadcrumb. Each segment is a link.

### 2. Page Header (H1 + meta)
- **Purpose**: Identify the component and provide quick utility actions.
- **Content type**: H1 heading ("Dock"), a "Copy Page" button, chevron left/right arrows to navigate to the previous/next component.
- **Notes**: The prev/next arrows link to adjacent components in the sidebar order (e.g., "Animated List" and "Globe" for Dock). The "Copy Page" button copies the entire page content — useful for AI workflows.

### 3. Description
- **Purpose**: One-sentence explanation of what the component is.
- **Content type**: Single paragraph of prose, directly below the H1.
- **Notes**: Describes the component in terms of what it implements and what technologies it uses. For Dock: "An implementation of the MacOS dock using react + tailwindcss + framer motion". For Terminal: "An implementation of the MacOS terminal. Useful for showcasing a command line interface." The description doubles as a tech-stack signal (react, tailwindcss, framer motion).

### 4. Hero Preview (Default Example)
- **Purpose**: Show the component in action immediately — "what does this look like?" before any explanation.
- **Content type**: Tabbed container with "Preview" and "Code" tabs. The Preview tab shows a live, interactive rendering of the component. The Code tab shows the full source for the default example. An "Open in" button (linking to v0.dev) and a reload button are in the top-right of the preview container.
- **Notes**: This is the largest visual element on the page. It appears before any installation or usage instructions, prioritizing the visual result over the how-to. The preview is a live rendered component, not a static image.

### 5. Installation (H2)
- **Purpose**: Answer "how do I add this to my project?"
- **Content type**: Two top-level tabs: "CLI" and "Manual".
  - **CLI tab**: Contains a secondary tab group for package managers (pnpm, npm, yarn, bun), each showing a one-line install command with a copy button. The CLI command uses the shadcn registry pattern: `pnpm dlx shadcn@latest add @magicui/dock`.
  - **Manual tab**: Contains step-by-step instructions for manual installation (copy-paste the source code).
- **Notes**: CLI is the default/recommended path. The shadcn CLI pattern means installation copies the component source into the user's project rather than installing an npm package — this is the "copy and own" philosophy. Four package manager options cover the ecosystem.

### 6. Examples (H2)
- **Purpose**: Show variations and customization options — "what else can this do?"
- **Content type**: Each example is an H3 subsection containing a tabbed "Preview / Code" container identical in structure to the hero preview. For Dock, examples include:
  - **Custom Direction** (H3): Shows the dock oriented differently.
  - **Custom magnification** (H3): Shows adjusted magnification behavior.
- **Notes**: Examples are organized as named H3 subsections. Each gets its own Preview/Code tabbed container with the "Open in v0" button. The number of examples varies by component (Dock has 2, Terminal has 1 "Custom Delays", Marquee has 2 "Vertical" and "3D").

### 7. Usage (H2)
- **Purpose**: Show the minimal import and JSX to use the component — "how do I write the code?"
- **Content type**: Two sequential code blocks: (1) the import statement, (2) the JSX usage pattern. Both have copy buttons.
- **Notes**: For multi-component exports (e.g., Terminal exports `Terminal`, `AnimatedSpan`, `TypingAnimation`), the import block shows all named exports. The JSX block shows the minimal composition pattern. The Terminal page also includes an explanatory prose paragraph after the code blocks: "The terminal sequences its children automatically. Each TypingAnimation or AnimatedSpan starts when the previous finishes. Manual delay props are optional and typically unnecessary." This prose appears only when the component has non-obvious behavioral semantics.

### 8. Props (H2)
- **Purpose**: API reference — "what can I configure?"
- **Content type**: One H3 subsection per exported component, each containing a table with columns: **Prop**, **Type**, **Default**, **Description**.
  - Dock page: `Dock` (7 props), `DockIcon` (7 props).
  - Terminal page: `Terminal` (4 props), `AnimatedSpan` (4 props), `TypingAnimation` (6 props).
  - Marquee page: `Marquee` (6 props, single component).
- **Notes**: Tables are flat — no nested/collapsible rows. Type values use TypeScript-style notation (e.g., `ReactNode`, `boolean`, `number`, `string`, union types like `"article" | "div" | "h1" | ...`). Default column uses `-` for required/no-default props. Descriptions are concise single sentences. There is no separate "API Reference" page — props are inline on the component page.

### 9. Credits (H2) — optional
- **Purpose**: Attribution to the original creator or inspiration.
- **Content type**: Bulleted list of credit lines with links.
- **Notes**: Present on Dock ("Credits to Build UI for this fantastic component", "Credits to Ritesh Bucha for finding and improving it") but absent from Terminal and Marquee. This section only appears when the component was adapted from external work.

### 10. Prev/Next Component Navigation
- **Purpose**: Sequential browsing through the component library.
- **Content type**: Two links at the page bottom showing the previous and next component names (e.g., "Animated List" / "Globe" for Dock).
- **Notes**: Follows the same ordering as the left sidebar. Only component names are shown, not descriptions.

### 11. Right Sidebar: "On This Page" Table of Contents
- **Purpose**: Quick navigation within the current page.
- **Content type**: Anchor links to all H2 and H3 headings on the page, displayed hierarchically (H3s indented under their parent H2).
- **Notes**: Sticky/fixed position. Updates to highlight the current section on scroll (standard ToC behavior).

### 12. Right Sidebar: "Contribute" Section
- **Purpose**: Community contribution entry points.
- **Content type**: Three icon+text links: "Report an issue", "Request a feature", "Edit this page".
- **Notes**: Positioned below the ToC in the right sidebar. "Edit this page" presumably links to GitHub.

### 13. Right Sidebar: Magic UI Pro Promotional Card
- **Purpose**: Upsell to the paid product.
- **Content type**: Marketing card with pricing ($199 once), feature bullets, and a CTA button.
- **Notes**: Always present. Non-intrusive — positioned below the fold in the right sidebar.

## Section Ordering Across Components

| Section | Dock | Terminal | Marquee |
|---------|------|----------|---------|
| Breadcrumb | 1 | 1 | 1 |
| H1 + Description | 2 | 2 | 2 |
| Hero Preview | 3 | 3 | 3 |
| Installation | 4 | **5** | 4 |
| Examples | 5 | **4** | 5 |
| Usage | 6 | 6 | 6 |
| Props | 7 | 7 | 7 |
| Credits | 8 | - | - |

The Terminal page inverts the order of Installation and Examples (Examples comes first). This may be an intentional choice for Terminal since the examples immediately contextualize the hero, or it may be an inconsistency. Dock and Marquee follow the same ordering.

## Overall Pattern

Magic UI follows a **"show first, explain later"** documentation philosophy:

1. **Visual-first**: The hero preview is the first substantial content on the page, appearing before any installation or usage instructions. The user sees the live component immediately.

2. **Copy-paste centric**: The shadcn CLI pattern (`pnpm dlx shadcn@latest add @magicui/component`) copies source code into the user's project. This is reflected in the "Manual" installation tab which provides raw source. The "Copy Page" button in the header reinforces this copy-oriented workflow.

3. **Flat, single-page structure**: Everything about a component lives on one page — no separate "API", "Examples", or "Styling" pages. The page is short enough that the right-sidebar ToC provides sufficient navigation.

4. **Minimal prose**: Description is one sentence. Usage is two code blocks (import + JSX). Props are a table. The only prose that appears is when a component has non-obvious behavioral semantics (e.g., Terminal's auto-sequencing explanation). There are no "Getting Started" paragraphs, no conceptual overviews, no "When to use this" guidance.

5. **Progressive disclosure through tabs**: Installation uses CLI/Manual tabs (defaulting to CLI). Previews use Preview/Code tabs (defaulting to Preview). Package managers use pnpm/npm/yarn/bun tabs. This keeps the page compact while serving different user needs.

6. **Examples as named variations**: Each example is a named H3 (e.g., "Custom Direction", "3D") rather than being organized by prop or feature. Examples demonstrate combinations of props rather than individual prop values.

7. **No separate styling/theming section**: Customization is handled entirely through props and className — there are no CSS variable tables, theme token references, or style override documentation.

8. **Community contribution hooks**: Every page has "Report an issue", "Request a feature", and "Edit this page" links, making it easy to contribute back.
