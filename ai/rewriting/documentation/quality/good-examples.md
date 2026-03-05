---
title: Good Technical Writing Examples
description: Reference examples of excellent technical writing patterns from Vite documentation, showing concise introductions, clear structure, and effective header patterns.
keywords: [good writing, examples, Vite style, concise, headers, technical documentation]
audience: contributing
skill: doc-good-examples
type: doc
---

# Good Technical Writing Examples

## Reference: Vite Documentation Style

### Concise Introductions
**Good (Vite)**:
> Vite (French word for "quick", pronounced /vit/, like "veet") is a build tool that aims to provide a faster and leaner development experience for modern web projects.

**Why it's good**:
- One sentence definition
- Relevant detail (pronunciation) inline
- Direct statement of purpose

### Clear Structure
**Good (Vite)**:
> It consists of two major parts:
> - A dev server that provides rich feature enhancements over native ES modules, for example extremely fast Hot Module Replacement (HMR).
> - A build command that bundles your code with Rollup, pre-configured to output highly optimized static assets for production.

**Why it's good**:
- Brief intro followed by bullet points
- Each point is one clear concept
- Technical details without fluff

### Direct API Documentation
**Good (Vite)**:
```
Type Signature:

async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>

Example Usage:

import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
```

**Why it's good**:
- Type signature first
- Example immediately follows
- No unnecessary explanation between

### Effective Warnings
**Good (Vite)**:
> **NOTE**
> When using createServer and build in the same Node.js process, both functions rely on process.env.NODE_ENV to work properly.

**Why it's good**:
- Clear visual marker
- Direct statement of the issue
- No hedging language

### Minimal Explanations
**Good (Vite)**:
> ### Browser Support
> During development, Vite assumes a modern browser is used.

**Why it's good**:
- Header matches content exactly
- One sentence per concept
- No introduction needed

## What to Copy from These Examples

1. **Sentence Length**: Keep most sentences under 20 words
2. **Paragraph Length**: 1-3 sentences max
3. **Code-to-Text Ratio**: More code, less explanation
4. **Direct Voice**: "Vite does X" not "X is done by Vite"
5. **No Transitions**: Don't connect sections with "Now let's..." or "Next we'll..."
6. **Factual Tone**: State what it does, not why it's great

## Bad Patterns to Avoid

**Bad**: "The Abstract Syntax Tree (AST) is a powerful and flexible representation of your template that is utilized by the rendering pipeline to generate your component efficiently."

**Good**: "The AST represents your template structure for the rendering pipeline."

**Bad**: "In the following section, we will explore the various node types that make up the AST structure."

**Good**: "## AST Node Types"

**Bad**: "It's worth noting that the template compiler provides several important capabilities."

**Good**: "The template compiler can:"

## Header Structure Examples

### Good Header Lengths (InPageMenu-friendly)
- "Installation" (12 chars) ✓
- "Configuration" (13 chars) ✓  
- "API Reference" (13 chars) ✓
- "Performance" (11 chars) ✓
- "Quick Start" (11 chars) ✓

### Bad Header Lengths (wrap in sidebar)
- "Understanding the Complete Installation Process" (47 chars) ✗
- "Comprehensive Configuration Guide for Advanced Users" (52 chars) ✗
- "Detailed API Reference Documentation" (36 chars) ✗

### Character Limits
- **Top-level headers**: Under 30 characters
- **Sub-headers**: Under 35 characters

### Good Header Hierarchy (Vite style)
```
## Built-in Constants
## Env Variables
### Env parsing
## .env Files
### Env Loading Priorities
## Modes
```
**Why it works**: Keywords like "Constants", "Variables", "Files", "Modes" are scannable

### Good Header Hierarchy (Svelte style)
```
## $effect
## $effect.pre
## $effect.tracking
## $effect.root
## When not to use $effect
```
**Why it works**: Function names are scannable, anti-pattern section clearly marked

### Bad Header Organization
```
## Getting Started with Effects
## Understanding Effect Dependencies  
## Advanced Effect Usage Patterns
## Effect Performance Considerations
```
**Why it's bad**: All start with descriptive words instead of keywords users scan for