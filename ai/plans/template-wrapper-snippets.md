# Template Content Projection

## Goal

Add `{>content}` — a unified content projection mechanism for both snippets and subtemplates. Lets template authors wrap content blocks and project them inward, without needing full web component slots or separate subtemplate files for simple wrapper patterns.

## Motivation

A common pattern is wrapping the same content in different containers:

```html
{#if href}
  <a href={href} class="card">{>cardContent}</a>
{else}
  <div class="card">{>cardContent}</div>
{/if}

{#snippet cardContent}
  {icon} {text} {description}
{/snippet}
```

The snippet exists only to avoid duplication. The relationship is inverted — the wrapper should accept content, not the content should be extracted into a snippet.

### With Content Projection — Snippets

```html
{#snippet card}
  <div class="card {class}">
    {>content}
  </div>
{/snippet}

{>card class='primary'}
  {icon} {text} {description}
{/card}

{>card class='secondary'}
  {otherIcon} {otherText}
{/card}
```

### With Content Projection — Subtemplates

Same mechanism, separate file:

```html
<!-- card.html (subtemplate) -->
<div class="card">
  <div class="header">{name}</div>
  <div class="body">{>content}</div>
</div>
```

```html
<!-- parent.html -->
{>card name='Jack'}
  <p>This is projected into the card body</p>
{/card}
```

One concept, one keyword, works everywhere. `{>content}` is the template-level equivalent of `{>slot}`:

- `{>slot}` — projects across the **web component boundary** (HTML consumer → shadow DOM)
- `{>content}` — projects across the **template boundary** (parent template → snippet/subtemplate)

## Design Decisions

### Invocation syntax: `{>name}...{/name}`

```html
{>card class='big'}
  <p>Content goes here</p>
{/card}
```

Unified for both snippets and subtemplates. `{>}` already resolves both by name. Adding a block form is a natural extension — self-closing `{>card /}` passes no content, block `{>card}...{/card}` projects content.

### Content keyword: `{>content}`

Inside the wrapper, `{>content}` renders whatever the caller wrapped. Mirrors `{>slot}` pattern. Reads naturally.

`content` is a reserved name — cannot be used as a snippet or subtemplate name.

### Data context: projected content sees the caller's context

```html
<!-- parent.html -->
{>card name='Jack'}
  <p>{greeting} {userName}</p>  <!-- resolves from parent's context, not card's -->
{/card}
```

Matches how web component slots work — slotted content lives in the outer context, not the shadow DOM context. The wrapper's data is for the wrapper's template. The caller's content is for the caller.

### Fallback when no content projected

`{>content}` renders nothing if the caller used self-closing `{>card /}`. No explicit fallback mechanism in v1.

### Multiple content blocks: not in v1

Single `{>content}` per wrapper. Named content blocks (like named slots) deferred — single projection covers the vast majority of use cases.

## Implementation

### Sessions (estimated)

1. **AST + compiler** — block form for `{>name}...{/name}`, capturing wrapped content as child AST nodes. `{>content}` resolution as a special reference (3-4h)
2. **Native renderer** — when rendering snippet/subtemplate, resolve `{>content}` to the caller's wrapped AST and render it in the caller's data context (3-4h)
3. **Lit renderer** — same pattern as native (2-3h)
4. **Tests** — snippet content projection, subtemplate content projection, nested projection, no-content fallback, caller context verification (3-4h)

### Touch Points

- **Template Compiler** (`packages/templating/`) — block form for `{>}` invocations, `{>content}` special resolution
- **Native Renderer** (`packages/renderer/src/native/`) — content projection rendering
- **Lit Renderer** (`packages/renderer/src/lit/`) — same
- **Name Resolution** — `content` reserved, resolved to projected content rather than snippet/subtemplate lookup

## Dependencies

None — independent of all other roadmap items.

## Status

Scoped. Ready to implement.
