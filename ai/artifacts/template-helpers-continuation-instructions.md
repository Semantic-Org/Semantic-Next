# Template Helpers Examples - Agent Continuation Instructions

## Task Assignment
**Objective**: Create 6 template helper examples in `/docs/src/examples/templates/` showcasing different helper categories.

**Required Examples**:
1. `helpers-array/` - Array manipulation helpers (join, range, joinComma)
2. `helpers-comparison/` - Comparison helpers (is, greaterThan, lessThan, etc.)
3. `helpers-css/` - CSS helpers (classIf, classMap, activeIf, selectedIf)
4. `helpers-date/` - Date formatting helpers (formatDate, formatDateTime)
5. `helpers-logical/` - Logical helpers (exists, hasAny, both, either, maybe)
6. `helpers-string/` - String helpers (concat, capitalize, titleCase, stringify)

## Critical Context Requirements

**MANDATORY Reading Order**:
1. `ai/meta/context-loading-instructions.md` - Agent operational protocol
2. `ai/00-START-HERE.md` - Task routing 
3. `ai/foundations/mental-model.md` - Core concepts
4. `ai/docs/example-creation-guide.md` - **CRITICAL** - Example creation workflow
5. `ai/agents/domain/templating/context.md` - Template expertise
6. `docs/src/pages/templates/helpers.mdx` - Helper overview with syntax
7. `docs/src/pages/templates/expressions.mdx` - Expression styles (Lisp vs JS)
8. `docs/src/pages/api/helpers/arrays.mdx` - Array helper APIs
9. `docs/src/pages/api/helpers/css.mdx` - CSS helper APIs  
10. `docs/src/pages/api/helpers/dates.mdx` - Date helper APIs
11. `docs/src/pages/api/helpers/strings.mdx` - String helper APIs

## Key Implementation Requirements

### File Structure (Per Example)
```
/docs/src/examples/templates/helpers-[category]/
├── component.js     # Component definition with helper data
├── component.html   # Template demonstrating helpers
├── component.css    # Styling
/docs/src/content/examples/
└── helpers-[category].mdx  # Metadata file
```

### Template Syntax Requirements
- **Show both expression styles**: Lisp `{formatDate date 'YYYY-MM-DD'}` AND JavaScript `{formatDate(date, 'YYYY-MM-DD')}`
- **Use realistic data**: User profiles, product catalogs, form states (not abstract examples)
- **Demonstrate practical use cases**: Form validation, navigation states, data formatting

### Established Patterns from Previous Agent Research
- **Component structure**: Use `getText()`, `defaultState`, pass `template`/`css` to `defineComponent`
- **Folder naming**: Must match tokenized title exactly
- **Design tokens**: Use `var(--spacing)`, `var(--standard-N)` colors, never hardcoded values
- **Metadata**: Include `exampleType: 'component'`, proper `subcategory`, descriptive tags

### Helper-Specific Focus Areas
- **Array helpers**: Demonstrate `join` with different delimiters, `range` for loops, `joinComma` with Oxford comma
- **CSS helpers**: Show `classMap` with object syntax, conditional classes for form states
- **Date helpers**: Multiple timezone examples, different format patterns 
- **String helpers**: Text transformation chains, user input formatting
- **Comparison helpers**: Form validation scenarios, conditional rendering
- **Logical helpers**: Empty state handling, permission checks, data existence

### Critical Success Factors
1. **Follow exact file structure** - Both template files AND metadata files required
2. **Use semantic class names** - `.large` not `.size-large`, `.primary` not `.theme-primary`  
3. **Demonstrate helper chaining** - `{titleCase concat firstName ' ' lastName}`
4. **Show practical applications** - Real-world scenarios users would encounter
5. **Include both expression syntaxes** - Educational value in showing alternatives

## TodoWrite Usage
Use TodoWrite tool to track all 6 examples. Mark as `in_progress` when starting each, `completed` when both template files and metadata are created and verified.

## Validation Checklist (Per Example)
- [ ] Component files in correct `/examples/templates/` folder
- [ ] Metadata file in `/content/examples/` with matching name
- [ ] Both Lisp and JavaScript helper syntax demonstrated
- [ ] Realistic data and use cases
- [ ] Design tokens used (no hardcoded values)
- [ ] Semantic class names
- [ ] Helper functions show practical applications

Previous agent completed foundational research but hit context limits. All helper APIs and patterns are documented. Focus on implementation with surgical precision following established patterns.