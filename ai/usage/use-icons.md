---
title: Use Icons in Semantic UI
description: How to use the ui-icon component — syntax, icon sets, sizing, coloring, and icons inside other components.
keywords: [icons, ui-icon, icon sets, lucide, canonical names, shorthand, set attribute, ui-icons]
audience: usage
skill: use-icons
type: skill
---

# Use Icons in Semantic UI

> **Skill:** `use-icons`
> **Purpose:** How to use the `<ui-icon>` component — syntax, icon sets, sizing, coloring, and icons inside other components
> **Last Updated:** 2026-03-19

---

## Golden Rule

**Use canonical icon names.** Names like `close`, `search`, `notifications` express intent rather than visual shape, work as shorthand attributes, and survive icon set swaps. Only reach for library-native names when the canonical set doesn't cover your icon.

---

## Basic Usage

Import the icon component and at least one icon set:

```js
import { UIIcon } from '@semantic-ui/core';
import '@semantic-ui/core/icon/sets/lucide.css';
```

Then use `<ui-icon>` in markup:

```html
<ui-icon home></ui-icon>
<ui-icon search></ui-icon>
<ui-icon settings></ui-icon>
```

Icons inherit the surrounding text's `font-size` and `color` by default.

---

## Syntax: Shorthand vs Explicit

Canonical icon names support **shorthand** — the name appears as a boolean attribute:

```html
<!-- Shorthand (preferred for canonical names) -->
<ui-icon close></ui-icon>
<ui-icon sparkles></ui-icon>

<!-- Explicit (equivalent) -->
<ui-icon icon="close"></ui-icon>
<ui-icon icon="sparkles"></ui-icon>
```

The `icon` attribute is required for names outside the canonical set:

```html
<!-- Library-native name not in the canonical list -->
<ui-icon icon="venetian-mask"></ui-icon>

<!-- Custom icon from your own CSS -->
<ui-icon icon="my-logo"></ui-icon>
```

### Value Fuzzing

The attribute system normalizes icon values — spaces become dashes, reversed orderings are tried:

```html
<!-- All equivalent -->
<ui-icon icon="chevron-down"></ui-icon>
<ui-icon icon="down-chevron"></ui-icon>
<ui-icon icon="chevron down"></ui-icon>
```

---

## Icon Sets

An icon set is a CSS file that defines `--icon-*` custom properties on `:root`. SUI ships with six sets:

| Set | Import | Type |
|-----|--------|------|
| Lucide | `@semantic-ui/core/icon/sets/lucide.css` | Monochrome (mask) |
| Phosphor | `@semantic-ui/core/icon/sets/phosphor.css` | Monochrome (mask) |
| Tabler | `@semantic-ui/core/icon/sets/tabler.css` | Monochrome (mask) |
| Material Symbols | `@semantic-ui/core/icon/sets/material-symbols.css` | Monochrome (mask) |
| Heroicons | `@semantic-ui/core/icon/sets/heroicons.css` | Monochrome (mask) |
| Dev | `@semantic-ui/core/icon/sets/dev.css` | Multi-color (image) |

The five monochrome sets all define the same 481 canonical names, so you can swap between them by changing one import — no markup changes needed:

```js
// Switch from Lucide to Tabler — all <ui-icon home>, <ui-icon close>, etc. still work
import '@semantic-ui/core/icon/sets/tabler.css';
```

### Loading Multiple Sets

Multiple sets coexist on the same page:

```js
import '@semantic-ui/core/icon/sets/lucide.css';  // standard UI icons
import '@semantic-ui/core/icon/sets/dev.css';      // colored framework logos
```

```html
<!-- From lucide -->
<ui-icon home></ui-icon>

<!-- From dev (multi-color, needs set attribute) -->
<ui-icon icon="react-mark" set="dev"></ui-icon>
```

### The `set` Attribute

Use `set` to select a specific icon set — this matters for sets like `dev` that use a different rendering technique:

```html
<!-- Attribute syntax -->
<ui-icon icon="svelte-mark" set="dev"></ui-icon>

<!-- Colon syntax (equivalent) -->
<ui-icon icon="svelte-mark:dev"></ui-icon>
```

When `set` is specified, the component creates a CSS fallback chain: if the icon doesn't define a property, the set-level default applies. This is how the `dev` set switches all its icons to the multi-color image technique automatically.

---

## Canonical Names

SUI defines **481 canonical icon names** organized across 31 categories. These are the names that support shorthand syntax and remain stable across icon set swaps.

| Category | Example names |
|----------|---------------|
| Navigation | `home`, `chevron-down`, `arrow-left`, `external-link`, `menu`, `compass` |
| Action | `plus`, `pencil`, `trash`, `save`, `copy`, `share`, `upload`, `download`, `search`, `refresh` |
| Status | `check`, `error`, `warning`, `info`, `help`, `loader`, `badge-check`, `ban` |
| User | `user`, `users`, `avatar`, `user-plus`, `user-check`, `user-x`, `user-search` |
| Form | `circle-dot`, `square-check`, `toggle-right`, `password`, `text-cursor-input` |
| Data | `chart-line`, `chart-bar`, `chart-pie`, `table`, `funnel`, `trending-up`, `sigma`, `radar` |
| File | `file`, `folder`, `file-code`, `file-text`, `folder-tree`, `newspaper`, `notebook` |
| Media | `image`, `camera`, `video`, `mic`, `music`, `film`, `podcast`, `audio-lines` |
| Media Controls | `play`, `pause`, `skip-forward`, `volume-high`, `shuffle`, `repeat` |
| Text | `bold`, `italic`, `heading`, `list`, `quote`, `underline`, `strikethrough`, `spell-check` |
| Editing | `crop`, `layers`, `palette`, `paintbrush`, `eyedropper`, `eraser`, `shapes`, `ruler` |
| Communication | `mail`, `chat`, `phone`, `bell`, `send`, `inbox`, `megaphone`, `at-sign` |
| Commerce | `shopping-cart`, `credit-card`, `store`, `tag`, `receipt`, `truck`, `gift`, `barcode` |
| Time | `calendar`, `clock`, `timer`, `hourglass`, `history`, `alarm-clock` |
| Security | `lock`, `key`, `shield`, `fingerprint`, `log-in`, `log-out`, `vault`, `cookie` |
| Settings | `settings`, `moon`, `languages`, `wrench`, `sliders-horizontal`, `incognito` |
| Organization | `building`, `kanban`, `milestone` |
| Finance | `banknote`, `wallet`, `dollar-sign`, `landmark`, `coins`, `percent`, `scale` |
| Location | `map-pin`, `map`, `globe`, `route`, `plane`, `car`, `waypoints` |
| System | `app-window`, `panel-left`, `power`, `command`, `separator-horizontal` |
| Device | `smartphone`, `laptop`, `monitor`, `keyboard`, `cpu`, `server`, `printer`, `battery` |
| Connectivity | `wifi`, `bluetooth`, `globe`, `network`, `plug`, `cloud-sync`, `signal`, `rss` |
| Development | `code`, `terminal`, `git-branch`, `git-pull-request`, `database`, `bug`, `braces`, `regex` |
| Brand | `github` |
| Gamification | `star`, `trophy`, `award`, `crown`, `dice`, `party-popper` |
| AI | `sparkles`, `bot`, `brain`, `magic-wand` |
| Education | `book`, `graduation-cap`, `flask`, `library` |
| Weather | `sun`, `cloud`, `snowflake`, `wind`, `thermometer` |
| Misc | `accessibility`, `coffee`, `lightbulb`, `leaf`, `infinity`, `calculator`, `circle`, `hexagon` |

**Why canonical names matter:**
- **Portability** — `<ui-icon close>` works regardless of whether Lucide, Tabler, or Heroicons is loaded
- **Readability** — `notifications` communicates intent better than the library-specific `bell`
- **Shorthand** — only canonical names work as boolean attributes (`<ui-icon close>` vs `<ui-icon icon="close">`)
- **Aliases** — common alternatives resolve automatically (`cancel`, `dismiss`, and `x` all show the close icon)

### Aliases

Most canonical names have rich alias sets. Use whichever name feels natural — the component resolves it at runtime:

```html
<!-- All resolve to the same icon -->
<ui-icon close></ui-icon>       <!-- alias for x -->
<ui-icon cancel></ui-icon>      <!-- alias for circle-x -->
<ui-icon edit></ui-icon>        <!-- alias for pencil -->
<ui-icon notifications></ui-icon> <!-- alias for bell -->
<ui-icon favorite></ui-icon>    <!-- alias for heart -->
<ui-icon loading></ui-icon>     <!-- alias for loader -->
```

The canonical set is not a hardcoded catalog to memorize. Use descriptive, intent-based names and they will likely resolve. When unsure, use the `icon` attribute with the library-native name as a fallback.

---

## Sizing

Icons inherit `font-size` by default. Use size variations when you need explicit control:

```html
<ui-icon mini home></ui-icon>
<ui-icon tiny home></ui-icon>
<ui-icon small home></ui-icon>
<ui-icon home></ui-icon>           <!-- medium (default) -->
<ui-icon large home></ui-icon>
<ui-icon big home></ui-icon>
<ui-icon huge home></ui-icon>
<ui-icon massive home></ui-icon>
```

Size names: `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`.

---

## Coloring

Monochrome icons (the default mask technique) inherit `currentColor`. Set a color with:

```html
<!-- Color variation -->
<ui-icon red close></ui-icon>
<ui-icon blue search></ui-icon>
<ui-icon green success></ui-icon>

<!-- Or inherit from parent -->
<p style="color: purple;">
  <ui-icon sparkles></ui-icon> AI-generated content
</p>
```

Available colors: `red`, `orange`, `yellow`, `olive`, `green`, `teal`, `blue`, `violet`, `purple`, `pink`, `brown`, `grey`, `slate`.

Multi-color icons (like the `dev` set) do **not** respond to color variations — they render their native colors.

---

## States

```html
<!-- Disabled -->
<ui-icon disabled home></ui-icon>

<!-- Loading animation -->
<ui-icon loading></ui-icon>
```

---

## Other Variations

```html
<!-- Fitted: removes spacing around the icon -->
<ui-icon fitted close></ui-icon>

<!-- Link: formats as clickable -->
<ui-icon link home></ui-icon>

<!-- Spin: continuous rotation -->
<ui-icon spin settings></ui-icon>

<!-- As an anchor link -->
<ui-icon home href="/dashboard" target="_blank"></ui-icon>
```

---

## Grouping Icons

`<ui-icons>` groups multiple icons and applies shared variations:

```html
<ui-icons size="large" color="blue">
  <ui-icon home></ui-icon>
  <ui-icon settings></ui-icon>
  <ui-icon user></ui-icon>
</ui-icons>
```

Shared variations: `color`, `size`.

---

## Icons Inside Other Components

Many SUI components accept an `icon` attribute that renders a `<ui-icon>` internally:

```html
<!-- Button with icon -->
<ui-button icon="save">Save Changes</ui-button>

<!-- Icon-only button -->
<ui-button icon="close" icon-only></ui-button>

<!-- Icon after text -->
<ui-button icon="next" icon-after>Continue</ui-button>
```

The `icon` attribute value follows the same naming rules — use canonical names for portability.

---

## Quick Reference

```html
<!-- Basic usage -->
<ui-icon home></ui-icon>
<ui-icon icon="close"></ui-icon>

<!-- With set -->
<ui-icon icon="react-mark" set="dev"></ui-icon>
<ui-icon icon="react-mark:dev"></ui-icon>

<!-- Sizing -->
<ui-icon small home></ui-icon>
<ui-icon large home></ui-icon>

<!-- Coloring -->
<ui-icon red error></ui-icon>
<ui-icon green success></ui-icon>

<!-- States -->
<ui-icon disabled home></ui-icon>
<ui-icon loading></ui-icon>

<!-- Variations -->
<ui-icon fitted close></ui-icon>
<ui-icon spin settings></ui-icon>

<!-- Grouping -->
<ui-icons size="large" color="blue">
  <ui-icon home></ui-icon>
  <ui-icon settings></ui-icon>
</ui-icons>

<!-- Inside other components -->
<ui-button icon="save">Save</ui-button>
<ui-button icon="close" icon-only></ui-button>
```

**Shipped icon sets:**

```js
import '@semantic-ui/core/icon/sets/lucide.css';
import '@semantic-ui/core/icon/sets/phosphor.css';
import '@semantic-ui/core/icon/sets/tabler.css';
import '@semantic-ui/core/icon/sets/material-symbols.css';
import '@semantic-ui/core/icon/sets/heroicons.css';
import '@semantic-ui/core/icon/sets/dev.css';
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Create Icon Sets** | `create-icon-set` | Building a custom icon set from your own SVGs |
| **Use Components** | `use-components` | General component usage, specs, attributes, events |
| **Style Components** | `style-components` | Customizing component appearance from outside |
| **Design Tokens** | `design-tokens` | Available design tokens for colors, spacing, sizing |
