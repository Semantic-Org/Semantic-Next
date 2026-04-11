# Icon Component: Progressive SVG Upgrade for `stroke-width` Support

## Problem

The icon component renders SVGs via `mask-image` using CSS custom properties provided by the page theme:

```css
:root {
  --icon-search: url("data:image/svg+xml,...");
}
```

This works well for color (via `background: currentColor`) but `mask-image` renders the SVG as a flat image — CSS cannot reach into it to control `stroke-width`, `stroke-linecap`, etc.

## Solution: Progressive Enhancement

Render with `mask-image` immediately (pure CSS, no JS needed), then after mount decode the same data URI and inject real SVG markup into the DOM. This gives full CSS control over stroke properties with no flash of missing content.

### Phase 1: Instant CSS render (existing behavior)

The `.icon` element renders via `mask-image` as it does today. No change needed.

### Phase 2: `onRendered` upgrade

After mount, read the computed `mask-image` value, decode the data URI back into SVG markup, strip hardcoded `stroke-width` attributes, and inject it into the `<i>` element via reactive state. A `:has(svg)` selector disables the mask once the real SVG is present.

## Template Change

The template just needs `{#html svgMarkup}` inside the existing `<i>`, gated by the `resolved` state:

```html
{#snippet content}
  <i class="{ui}icon{maybeCustomIcon}" style={getIconStyle} part="icon">
    {#if resolved}
      {#html svgMarkup}
    {/if}
  </i>
{/snippet}
```

No other template changes. The `{#if}` / `{#snippet}` / `{>content}` / `<a>` wrapper structure stays the same.

## JS Changes

### Add `defaultState`

```js
const defaultState = {
  resolved: false,
  svgMarkup: '',
};
```

### Add `onRendered`

```js
const onRendered = ({ self, isServer }) => {
  if (isServer) return;
  self.upgradeSvg();
};
```

### Add methods to `createComponent`

Add these to the object returned by `createComponent` (keep all existing methods unchanged):

```js
upgradeSvg() {
  const $icon = $('.icon');
  if (!$icon.length) return;

  const style = getComputedStyle($icon.get(0));
  const maskVal = style.getPropertyValue('mask-image').trim()
    || style.getPropertyValue('-webkit-mask-image').trim();

  const svg = self.decodeSvgDataUri(maskVal);
  if (!svg) return;

  state.svgMarkup.set(svg);
  state.resolved.set(true);
},

decodeSvgDataUri(val) {
  const match = val.match(/url\(["']?data:image\/svg\+xml[;,](.+?)["']?\)/);
  if (!match) return null;

  let content = match[1];
  if (content.startsWith('base64,')) {
    content = atob(content.slice(7));
  } else {
    content = decodeURIComponent(content);
  }
  // strip hardcoded stroke-width so CSS takes over
  return content.replace(/stroke-width="[^"]*"/g, '');
},
```

### Wire into `defineComponent`

Add `defaultState` and `onRendered` to the definition:

```js
const Icon = defineComponent({
  tagName: 'ui-icon',
  componentSpec,
  template,
  css,
  createComponent,
  defaultState,
  onRendered,
});
```

## CSS Changes

Add to `icon-bundle.css`:

```css
/* disable mask/bg when real SVG is present */
.icon:has(svg) {
  mask-image: none;
  background: none;
  background-image: none;
}

/* style the injected SVG */
.icon svg {
  width: var(--icon-width);
  height: var(--icon-height);
  stroke: currentColor;
  fill: none;
  stroke-width: var(--icon-stroke, 1.5);
  stroke-linecap: var(--icon-stroke-cap, round);
  stroke-linejoin: var(--icon-stroke-join, round);
}
```

## Usage

After this change, `--icon-stroke` becomes a live CSS property:

```css
/* theme level default */
:root {
  --icon-stroke: 1.5;
}

/* per-instance */
ui-icon {
  --icon-stroke: 2;
}

/* contextual */
.sidebar ui-icon {
  --icon-stroke: 1;
}
```

## Notes

- The theme contract is unchanged — themes still publish `--icon-{name}: url("data:image/svg+xml,...")`.
- Icons that use `--icon-bg-image` (full-color rasters/SVGs) or `--icon-glyph` (font icons) are unaffected — `upgradeSvg` only activates when it finds a decodable SVG in `mask-image`.
- SSR safe — `isServer` guard skips upgrade, mask fallback works without JS.
- If `--icon-stroke` matches the baked-in stroke-width of the theme SVGs, the swap is pixel-identical with no visual pop.
- The `stroke-width` strip regex (`/stroke-width="[^"]*"/g`) handles the common case of presentation attributes. If theme SVGs use inline `style="stroke-width:..."`, the regex would need to be extended.
