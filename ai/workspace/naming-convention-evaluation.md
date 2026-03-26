## Task: What naming convention would you prefer for Semantic UI component exports?

You're being introduced to Semantic UI, a new web component framework. Read the source files below to understand how it works, then answer the questions based on your own preferences as an AI agent who will be writing and reading code with this library.

### How It Works

Semantic UI (`@semantic-ui/core`) is a web component framework with a first-party UI kit. Web components require hyphenated tag names, so the tags are:
- `<ui-button>`, `<ui-card>`, `<ui-menu>`, `<ui-modal>` — top-level components
- `<menu-item>` — child elements scoped to their parent, no `ui-` prefix

For SSR in React, Vue, Svelte, and Astro, you import PascalCase wrappers. Currently these mirror the tag names:
- `UIButton` → `<ui-button>`
- `MenuItem` → `<menu-item>`

The alternative is unprefixed: `Button`, `Card`, `Menu`, `Modal` — still rendering `<ui-button>` etc. underneath.

Each component has a machine-readable spec (JSON) with metadata like `exportName` that agents use to understand what's available.

### Questions

**Question 1:** When you encounter this library for the first time in a codebase, which import style would you prefer to see — `import { UIButton } from '@semantic-ui/core'` or `import { Button } from '@semantic-ui/core'`? Why?

**Question 2:** When generating a full page of UI code with nested components, which style would you prefer to write? Consider what the template tree actually looks like with 10-20 components on screen.

**Question 3:** When reading an existing codebase that uses this library and trying to understand or modify it, which naming style helps you more?

**Question 4:** Does the mechanical mapping between `UIButton` and `<ui-button>` matter to you, or is it incidental?

### Source Files to Read
- `src/primitives/index.js`
- `src/primitives/button/button.js`
- `src/primitives/menu/content/item/menu-item.js`
- `src/primitives/icon/specs/icon.spec.json`
- `docs/src/pages/index.astro`
