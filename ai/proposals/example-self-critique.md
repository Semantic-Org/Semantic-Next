# Example Creation Self-Critique Protocol

This document establishes a **mandatory self-critique process** for creating Query library examples. After creating each example, the AI **MUST** ask itself the following questions and revise if any answer is "No".

## Mandatory Post-Example Questions

After creating each example, you **MUST** ask yourself these questions:

### 1. Uniqueness & Teaching Value
- **Q: Does this example demonstrate something unique about this specific method?**
- **Q: Am I just copying the same pattern from other examples?**
- **Q: What makes THIS method different from others, and does my example show that?**

### 2. Simplicity & Class Naming
- **Q: Am I using dashed class names like `.nav-item`, `.result-container`, `.count-item`?**
- **Q: Could I use simple one-word classes like `.item`, `.result`, `.count` instead?**
- **Q: Are my class names descriptive without being verbose?**

### 3. Container Overuse
- **Q: Do I have unnecessary wrapper divs like `.results`, `.controls`, `.items`?**
- **Q: Can I simplify the HTML structure and remove container divs?**
- **Q: Am I adding divs just to group things that don't need grouping?**

### 4. Event Handler Complexity
- **Q: Do I really need event handlers for this example?**
- **Q: Could I demonstrate the method directly in page.js without click handlers?**
- **Q: Am I making the example more complex than needed with unnecessary interactions?**

### 5. Pattern Matching vs. Understanding
- **Q: Am I blindly following the structure of previous examples?**
- **Q: Does this example teach the specific concept effectively?**
- **Q: Would someone understand THIS method's purpose from my example?**

### 6. CSS Nesting Usage
- **Q: Am I using nested CSS syntax where appropriate?**
- **Q: Are my CSS selectors taking advantage of nesting for better organization?**
- **Q: Am I writing flat CSS when I could use nested syntax like `.parent { .child { } }`?**

### 7. Block vs Inline Elements
- **Q: Am I using `<span>` with `display: block` when I should use `<div>`?**
- **Q: Am I using inline elements (span) for block-level content?**

### 8. Shadow DOM & Web Component Context
- **Q: Is this method primarily used inside web components (like getSlot, setSlot)?**
- **Q: Would this method be most useful when working with shadow DOM or component internals?**
- **Q: Should I create component.js/css/html files alongside page.js/css/html?**
- **Q: Am I showing the method in its most natural context (e.g., getSlot inside a component)?**

## Required Actions

If you answer "No" to any question above, you **MUST**:

1. **Stop and revise the example immediately**
2. **Simplify the structure**
3. **Focus on the unique aspect of the method**
4. **Re-ask the questions until all answers are "Yes"**

## Example Self-Critique in Action

### BAD Example Process:
```
Creates query-last example with:
- `.result-container` div wrapper
- `.get-button` click handler
- Same highlighting pattern as query-first
❌ Fails questions 1, 2, 3, 4, 5
```

### GOOD Example Process:
```
Creates query-last example:
- Directly calls .last() in page.js
- Shows last item automatically highlighted
- Simple classes: `.item`, `.last`
- No unnecessary containers
✅ Passes all questions
```

## Core Principles

### DO:
- Use simple, one-word class names
- Demonstrate methods directly when possible
- Show unique functionality of each method
- Keep HTML structure minimal
- Focus on educational clarity
- Use nested CSS syntax for better organization

### DON'T:
- Use dashed class names
- Add unnecessary wrapper divs
- Copy/paste patterns from other examples
- Add complex interactions unless essential
- Make examples that all look the same
- Write flat CSS when nesting would improve organization

## Enforcement

This self-critique is **mandatory**. Skipping these questions or rushing through them will result in poor examples that don't effectively teach the Query library methods.

**Remember: Each method deserves an example that showcases what makes it special.**