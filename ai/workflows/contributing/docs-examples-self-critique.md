---
title: Example Creation Self-Critique Protocol
description: Mandatory verification process for AI agents creating examples, with 13 verification criteria covering uniqueness, simplicity, CSS patterns, and documentation compliance.
keywords: [self-critique, verification, examples, quality checklist, validation, code review]
audience: contributing
type: workflow
workflow: docs-examples-self-critique
---

# Example Creation Self-Critique Protocol

This document establishes a **mandatory verification process** for AI agents creating Query library examples. After creating each example, the agent **MUST** evaluate against all criteria and revise any failing elements.

## Mandatory Verification Checklist

Execute this checklist after creating each example. **All criteria must pass.**

### 1. Uniqueness & Teaching Value
- **VERIFY: This example demonstrates a unique aspect of the specific method**
- **VERIFY: The implementation differs meaningfully from other examples**
- **VERIFY: The example clearly shows what makes THIS method distinct**

### 2. Simplicity & Class Naming
- **VERIFY: No dashed class names (`.nav-item`, `.result-container`, `.count-item`)**
- **VERIFY: Using simple one-word classes (`.item`, `.result`, `.count`)**
- **VERIFY: Class names are descriptive but not verbose**

### 3. Container Overuse
- **VERIFY: No unnecessary wrapper divs (`.results`, `.controls`, `.items`)**
- **VERIFY: HTML structure is simplified to essential elements only**
- **VERIFY: No divs added solely for grouping**

### 4. Event Handler Complexity
- **VERIFY: Event handlers are essential for demonstration**
- **VERIFY: Method can be demonstrated directly in page.js when possible**
- **VERIFY: No unnecessary interactions that obscure the core method**

### 5. Pattern Matching vs. Understanding
- **VERIFY: Implementation is method-specific, not template copying**
- **VERIFY: Example effectively teaches the specific concept**
- **VERIFY: The method's purpose is clear from the example alone**

### 6. CSS Nesting Usage
- **VERIFY: Using nested CSS syntax where appropriate**
- **VERIFY: CSS selectors utilize nesting for organization**
- **VERIFY: No flat CSS when nesting would improve structure**

### 7. Block vs Inline Elements
- **VERIFY: No `<span>` elements with `display: block`**
- **VERIFY: No inline elements used for block-level content**

### 8. Shadow DOM & Web Component Context
- **VERIFY: Methods requiring web components include component.js/css/html files**
- **VERIFY: Shadow DOM methods (getSlot, setSlot) are shown in component context**
- **VERIFY: Method is demonstrated in its most natural usage context**

### 9. Variable Naming & Reuse
- **VERIFY: Variables storing $ instances use $ prefix (`const $box = $('.box')`)**
- **VERIFY: Intermediate variables created only when used 3+ times**
- **VERIFY: Single/double-use selectors are inlined**

### 10. Documentation Compliance
- **VERIFY: All mandatory pre-flight documents have been read**
- **VERIFY: Following exact canonical template format from comprehensive plan**
- **VERIFY: File locations verified against existing examples**

### 11. Verification Before Creation
- **VERIFY: Read at least 2 existing examples of same type before creating**
- **VERIFY: Metadata format copied exactly from canonical examples**
- **VERIFY: File paths match established structure**

### 12. Accuracy in Claims
- **VERIFY: Variable usage counts are accurate (actually counted)**
- **VERIFY: All statements based on actual code inspection**
- **VERIFY: API behavior verified against documentation**

### 13. Following Instructions
- **VERIFY: Implementation matches exact user request**
- **VERIFY: Focus maintained on specific task**
- **VERIFY: Clarifying questions asked instead of assumptions made**

## Failure Protocol

**If ANY verification fails:**

1. **STOP immediately**
2. **Identify the specific failure**
3. **Fix the failing element**
4. **Re-run complete verification checklist**
5. **Repeat until ALL verifications pass**

## Quality Standards

### Required Implementation:
- Demonstrate ONE unique method capability clearly
- Use minimal, semantic HTML structure
- Apply consistent CSS nesting patterns
- Follow exact metadata format from canonical examples
- Create variables only when used 3+ times with $ prefix
- Include component files only for shadow DOM methods

### Prohibited Patterns:
- Dashed class names or verbose selectors
- Unnecessary wrapper divs or containers
- Template copying without method-specific adaptation
- Flat CSS when nesting improves organization
- Variables without $ prefix for Query instances
- File creation without verifying existing patterns
- Claims without code verification
- API assumptions without documentation check

## Success Criteria

**Example passes when:**
- All 13 verification points return PASS
- Implementation demonstrates unique method value
- Code follows established patterns exactly
- Educational goal is achieved with minimal complexity

**Enforcement:** This verification is non-optional. Examples that skip verification or fail multiple criteria indicate insufficient preparation and must be rebuilt from canonical patterns.