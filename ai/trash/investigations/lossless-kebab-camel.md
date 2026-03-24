# Problem: Lossless kebab-case / camelCase Round-Trip

## Context

A JavaScript utility library provides two string conversion functions:
- `kebabToCamel(str)` — converts kebab-case to camelCase
- `camelToKebab(str)` — converts camelCase to kebab-case

These are commonly used to convert between HTML attribute names (kebab-case) and JavaScript property names (camelCase).

The standard implementations of these functions are lossy — certain inputs do not survive a round-trip. For example `grid-2x2` becomes `grid2x2` which cannot be converted back to `grid-2x2`, and `arrow-down-a-z` becomes `arrowDownAZ` which becomes `arrowdown-az`.

## Background

This will be used for a web component framework but offered as a general utilility in a lodash style standalone util library. The goal though should solve the primary use case for front end developers which is surviving the attr -> prop and back roundtrip one way.

## Goals
- One source will always be the source of truth and one the compromise in terms of ergonomics.
- Assume 90% of humans will edit the source location but not the translation.
- However 10% of those who edit the translation need to not be confused or annoyed by the translation
- For example <my-component inner-h-t-m-l="value"> is no good if the function specifies camelCase as the source. If the source is <my-component innner-html="Text"> then it should be reasonable to edit on the el like el.innerHtml if necessary.
- So to summarize: If the source is an attribute, then it will be converted to a property and back to an attribute. The property will be reflective so needs to be inferrable and obvious to an end user but also it needs to survive the trip back to attribute.
- And the corllary: If the source is a property it will need to be converted to an attribute with a reasonable human name and arrive back.
- Using arbitrary escape sequences should be avoided unless it doesnt affect ergonomics for end users setting html attributes or properties


## Requirement

Both functions accept an optional options object as a second parameter. When the appropriate option is enabled, a value that passes through both conversions must come back unchanged:

```
camelToKebab(kebabToCamel(x, options), options) === x
kebabToCamel(camelToKebab(x, options), options) === x
```

Default behavior (without options) should remain unchanged for backward compatibility.

## Test Cases

### kebab → camel → kebab (must return to original)

| input | intermediate (camel) | result |
|---|---|---|
| `arrow-down` | `arrowDown` | `arrow-down` |
| `text-cursor-input` | `textCursorInput` | `text-cursor-input` |
| `grid-2x2` | ? | `grid-2x2` |
| `grid-3x3` | ? | `grid-3x3` |
| `heading-1` | ? | `heading-1` |
| `volume-2` | ? | `volume-2` |
| `arrow-down-a-z` | ? | `arrow-down-a-z` |
| `a-large-small` | ? | `a-large-small` |
| `columns-3` | ? | `columns-3` |
| `wifi-off` | `wifiOff` | `wifi-off` |

### camel → kebab → camel (must return to original)

| input | intermediate (kebab) | result |
|---|---|---|
| `arrowDown` | `arrow-down` | `arrowDown` |
| `backgroundColor` | `background-color` | `backgroundColor` |
| `textCursorInput` | `text-cursor-input` | `textCursorInput` |
| `wifiOff` | `wifi-off` | `wifiOff` |

### Edge cases to consider

- Single-letter segments: `a-z`, `a-arrow-up`
- Digit-prefixed segments: `2x2` in `grid-2x2`
- Trailing digits: `heading-1`, `volume-2`, `columns-3`
- Consecutive single-letter segments: `arrow-down-a-z`
- Mixed letters and digits within a segment: `2x2`, `3x3`

## Constraints

- The solution should handle arbitrary valid inputs, not just the examples above
- The intermediate representation is up to you — the only hard requirement is that each value survives its own round-trip
