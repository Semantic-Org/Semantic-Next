---
title: Documentation Link and Grammar Agent Instructions
description: Proofreader agent instructions for adding internal links, fixing spelling errors, and correcting grammar in Semantic UI documentation.
keywords: [links, grammar, proofreading, internal links, spelling, corrections]
audience: contributing
type: workflow
workflow: docs-add-links
---

# Semantic UI Documentation Link & Grammar Agent Instructions

## 1. Overall Goal & Role

*   **Task:** Review Semantic UI documentation for specific, limited corrections: adding internal links, fixing spelling errors, and correcting egregious grammatical mistakes. Optionally, verify existing internal links if explicitly requested.
*   **Role:** Agentic proofreader focused on link integrity and basic correctness.
*   **Objective:** Improve documentation accuracy and navigation through targeted, minimal interventions. **Strictly avoid rewriting or rephrasing content.**

## 2. Project Overview

*   **Framework:** Semantic UI (New Version) by Jack Lukic.
*   **Documentation Location:** Primarily within the `docs/src/pages/` directory.
*   **Link Structure:** Internal links typically point to other `.mdx` files within `docs/src/pages/` or specific headers within those files (e.g., `/components/button#usage`). Header slugs are auto-generated from markdown headers (e.g., `## My Header` becomes `#my-header`).

## 3. Critical Pre-Work: Discovery Phase

**BEFORE** making any edits, you **MUST** complete this discovery process:

### 3.1 Map Available Documentation
```bash
# Get complete file listing to understand available targets
find /home/jack/semantic/next/docs/src/pages -name "*.mdx" -type f | sort
```

### 3.2 Understand Link Context Strategy
Ask yourself for EVERY potential link:
- **"What is the user trying to accomplish when they encounter this term?"**
- **"Are they learning about the concept (guide) or looking up specific technical details (API)?"**
- **"What level of specificity does this context require?"**

Example Context Analysis:
- `css` in "component uses css for styling" → Link to conceptual guide `/docs/guides/components/styling`
- `css` in "the css parameter accepts..." → Link to specific section `/docs/guides/components/styling#component-css`
- `defineComponent` in code example → Link to API docs `/docs/api/component/define-component`
- `state` when explaining concepts → Link to guide `/docs/guides/components/state`
- `state.counter.get()` method reference → Check for API docs with specific method

## 4. Link Discovery & Validation Process

### 4.1 Finding Link Targets (Required Tools Usage)

For each potential link, use this systematic approach:

#### Step 1: Broad Discovery
```bash
# Find files related to your keyword
find /home/jack/semantic/next/docs/src/pages -name "*[keyword]*" -type f
# Alternative: use Glob tool with pattern like "**/[keyword]*"
```

#### Step 2: Content-Based Search
```bash
# Search for the concept within files using Grep tool
# Look for: function names, section headers, detailed explanations
grep -r "your-keyword" /home/jack/semantic/next/docs/src/pages/
```

#### Step 3: Section Header Discovery
For specific subsections within a page:
```bash
# Find all headers in a specific file
grep -n "^#" /path/to/target/file.mdx
```

#### Step 4: API Documentation Check
Always check both locations:
- `/docs/src/pages/[concept]/` - Conceptual guides
- `/docs/src/pages/api/[area]/` - Technical API references

### 4.2 Context-Driven Link Selection

**Guide vs API Decision Tree:**
1. **Is this explaining HOW to use something?** → Guide page
2. **Is this referencing a specific method/property/parameter?** → API page  
3. **Is this in a list of configuration options?** → Link to specific subsection
4. **Is this a code value being mentioned in explanatory text?** → API reference

**Subsection Linking Strategy:**
- When text mentions a specific aspect, always check for dedicated subsections
- Examples: `pageCSS` → `/docs/guides/components/styling#page-css`, `onCreated` → `/docs/guides/components/lifecycle#oncreated`
- **Never assume** - always verify the header exists using grep or Read tool

## 5. Permitted Tasks (Strictly Limited)

This agent is **ONLY** permitted to perform the following tasks:

1.  **Add Internal Links to EXISTING Words:**
    *   Identify existing words or phrases within the documentation text that refer to concepts, components, APIs, or features documented elsewhere.
    *   Add markdown links (`[existing text](/path/to/page#optional-header)`) around these *existing words*.
    *   **Constraint:** NEVER add new words or change the phrasing to accommodate a link. The link must wrap text already present.
    *   **NEVER modify existing links** unless they are demonstrably broken.

2.  **Correct Spelling and Egregious Grammar:**
    *   Identify and correct clear spelling mistakes.
    *   Identify and fix obvious, significant grammatical errors that make the text nonsensical (e.g., missing verbs, incomplete sentences, incoherent phrasing).
    *   **Constraint:** DO NOT rephrase sentences for style, clarity, or conciseness. Only fix objective errors in spelling and basic sentence structure.

3.  **Verify Existing Internal Links (Optional - Only if explicitly requested):**
    *   **Trigger:** Only perform this task when specifically asked by the user.
    *   **Action:** Check if existing internal markdown links (`[text](/path/...)`) point to valid files and, if applicable, valid headers within those files.

## 6. Link Quality Standards

### 6.1 Semantic Correctness
- **Component-specific concepts** should link to `/docs/guides/components/[topic]` when discussing component usage
- **General library features** should link to guides like `/docs/guides/reactivity/`, `/docs/guides/templates/`, `/docs/guides/query/`
- **Technical references** should link to `/docs/api/[area]/[specific-item]`

### 6.2 Specificity Requirements  
- **Always prefer specific subsections** when the context warrants it
- Use tools to verify header slugs exist before linking to them
- Example: Don't link to `/components/styling` when `/components/styling#page-css` is more appropriate

## 7. Core Principles & Constraints

*   **Minimal Intervention:** Make the fewest changes possible to achieve the permitted tasks.
*   **No Rewriting:** Absolutely no rephrasing, restructuring, or content generation.
*   **Preserve Meaning:** Ensure corrections do not alter the original technical meaning.
*   **Focus:** Links, spelling, major grammar errors only.
*   **No Code Editing:** NEVER modify content within markdown code blocks (``` ```) or inline code formatting (` `` `). Do not fix syntax errors, change variable names, alter any code content, or "correct" syntax that appears wrong but may be valid alternative syntax - only edit plain text outside of code blocks. Code examples may use different valid syntax patterns that should not be changed.
*   **No Code Links:** NEVER add links within code blocks or inline code. Links should only wrap plain text.
*   **Verification Required:** Use Read, Grep, or Bash tools to confirm every link target exists before adding it.

## 8. General Linking Strategy

### 8.1 Conceptual vs Technical References
**Conceptual explanations** (how-to, guides, overviews):
- Link to `/docs/guides/[domain]/` for broad concepts (e.g., `/docs/guides/reactivity/`, `/docs/guides/templates/`, `/docs/guides/components/`)
- Link to `/docs/guides/[domain]/[specific-topic]` for focused topics

**Technical references** (methods, properties, parameters):
- Always check `/docs/api/[area]/` first for dedicated API documentation
- Use subsection links for specific parameters or methods when available

### 8.2 Documentation Architecture Pattern
This codebase follows a consistent pattern:
- **`/docs/guides/[topic]/`** - User guides and conceptual explanations
- **`/docs/guides/[package]/[topic]`** - Package-specific guides (e.g., `/docs/guides/components/[topic]`, `/docs/guides/reactivity/[topic]`, `/docs/guides/templates/[topic]`)
- **`/docs/api/[area]/[item]`** - Technical API references

**Package Priority Guidelines:**
- **Components package** is the primary integration point that uses all other packages
- **Always prefer component-specific guides** when linking from component contexts
- Example: Link to `/docs/guides/components/reactivity` (reactivity as used in components) rather than `/docs/guides/reactivity/` (general reactivity concepts) when discussing component usage

### 8.3 Context-Driven Linking Examples
**Configuration/Parameter contexts:**
- Check if parameter has dedicated guide page: `/docs/guides/[package]/[parameter-name]`
- Check if parameter has API documentation: `/docs/api/[area]/[item]#[parameter]`
- Check if parameter has specific subsection: `/docs/guides/[guide-page]#[parameter-section]`

**Method/Function contexts:**
- Search for API documentation first: `/docs/api/[area]/[function-name]`
- Look for subsection links: `/docs/guides/[guide]#[method-name]`

**Feature mentions:**
- **In component contexts:** Prefer `/docs/guides/components/[feature]` over `/docs/guides/[feature]/` when both exist
- **In general contexts:** Use `/docs/guides/[feature]/` for standalone feature discussion
- **Technical details:** Always check `/docs/api/[area]/[item]` first

**Cross-package References:**
- When discussing how components use other packages, link to component-specific guides
- When discussing standalone package features, link to the package's own guides
- Example: "component state" → `/docs/guides/components/state`, "signals in general" → `/docs/guides/reactivity/signals`

## 9. Error Prevention

### 9.1 Before Every Link Addition
1. **Verify target exists** using file system tools
2. **Confirm section headers** using grep if linking to subsections  
3. **Check existing links** in the current file - don't duplicate or conflict
4. **Consider user intent** - what would be most helpful for someone reading this text?

### 9.2 When in Doubt
- Ask for clarification rather than guessing
- Prefer broader, confirmed targets over specific, unverified ones
- Leave text unlinked rather than link incorrectly
