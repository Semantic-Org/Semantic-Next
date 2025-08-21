# TypeScript Inference Challenge: The `self` Circular Reference Problem

This directory contains 5 different approaches to solving a fundamental TypeScript inference problem in the Semantic UI framework.

## The Problem

The framework uses an elegant destructuring pattern for component creation:

```javascript
const createComponent = ({ self, state, settings }) => ({
  toggle() {
    self.hide(); // self should reference the component being created
  },
  hide() {
    // ...
  }
});
```

This works beautifully in JavaScript, but creates a **circular reference problem** in TypeScript:

- `self` should be typed as the return type of this function
- But TypeScript is currently analyzing this function to determine its return type
- This creates a circular dependency that TypeScript's inference engine cannot resolve

## The Challenge

How can we provide full TypeScript autocomplete and type safety for `self`, `state`, and `settings` when the function is **extracted** (not inline) while preserving the elegant destructuring pattern?

## Approaches Tested

### ❌ Solution 1: Generic Helper Factory
**File:** `solution1-generic-helper-factory.ts`

Attempted to use generic factory functions to capture types upfront and infer the component return type. Failed due to circular reference during inference.

### ❌ Solution 2: Recursive Type Definition  
**File:** `solution2-recursive-type-definition.ts`

Tried explicit recursive types to model the self-reference. Failed due to generic constraint propagation issues and the same circular inference problem.

### ❌ Solution 3: Builder Pattern
**File:** `solution3-builder-pattern.ts`

Used fluent builder API to progressively construct type information. Successfully built state/settings types but still failed at the component creation step.

### ❌ Solution 4: Type-First with Satisfies
**File:** `solution4-type-first-satisfies.ts`

Defined component interface upfront and used `satisfies` operator. Failed because `satisfies` is applied after inference, not during it.

### ✅ Solution 5: Explicit Typing
**File:** `solution5-explicit-typing.ts`

Requires developers to explicitly type parameters. **Works perfectly** but sacrifices the elegant DX.

## The Core Issue

All approaches fail on the same fundamental problem: **TypeScript cannot infer a type that references itself during its own definition.**

When TypeScript encounters `self.hide()` inside the function body, it needs to know what methods exist on `self`. But `self` has the same type as the function's return value, which TypeScript is currently trying to infer.

## Success Criteria

A successful solution would provide:

1. ✅ **Extracted functions** - Clean code organization
2. ✅ **Full type safety** - `state`, `settings`, and `self` properly typed  
3. ✅ **Autocomplete** - IDE shows all available properties and methods
4. ✅ **Minimal ceremony** - Maintains the elegant destructuring pattern
5. ✅ **No boilerplate** - Developers don't need explicit type definitions

Currently, only Solution 5 achieves criteria 1-3, but fails on 4-5.

## Request for Solutions

Find a solution that meets all 5 criteria. The framework's core value proposition is the elegant destructuring pattern. Any solution that requires significant developer ceremony (explicit typing, interfaces, etc.) undermines this value proposition.

## Key Constraints

- Must work with extracted functions (not just inline)
- Must handle the circular `self` reference
- Must preserve the destructuring pattern
- Should work with TypeScript's current inference system
- Cannot require complex build-time transformations

## Testing

Each solution file includes:
- Detailed explanation of the approach
- Analysis of why it succeeds or fails  
- TypeScript compilation tests
- Commentary on the limitations discovered

To test any approach:
```bash
npx tsc --noEmit solution-name.ts
```

Success means no TypeScript errors and proper type inference for all parameters.