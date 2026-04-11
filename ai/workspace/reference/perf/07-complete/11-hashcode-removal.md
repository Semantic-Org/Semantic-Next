# Plan: Remove hashCode from Native Renderer Constructor

## Status
**Complete.** The ~1.4ms `hashCode({ ast, data, isSVG })` call was replaced with `++Renderer._nextId` in an earlier commit. The import and sequential ID remain — optional cleanup to remove `this.id` entirely (nothing reads it) and drop the dead `hashCode` import.

## What Was Done
- `hashCode` call replaced with sequential ID — eliminates JSON.stringify + FNV-1a hashing of entire AST + data context per Renderer construction
- Comment explaining the Lit renderer's subtree caching rationale preserved as contributor breadcrumb

## Optional Remaining Cleanup
- Remove `hashCode` from imports (dead — only referenced in comment)
- Remove `this.id = ++Renderer._nextId` (nothing reads it, `_nextId` never initialized so every ID is `NaN`)
- Remove explanatory comment block (references removed code)
- Low priority — zero perf impact, purely cosmetic
