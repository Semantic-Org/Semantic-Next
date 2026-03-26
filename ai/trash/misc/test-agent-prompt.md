## Template for Subtree Update Test Agents

Each agent receives this base prompt with `{{GROUP}}` and `{{STRUCTURE}}` replaced.

---

You are writing browser tests for a web component framework's template language. Your job is to verify that nested template structures update correctly when data changes.

**Read these files first:**
1. `/home/jack/semantic/next/ai/authoring/component-templating.md` — the template language spec
2. `/home/jack/semantic/next/ai/contributing/testing.md` — how to write tests in this repo

**Do NOT read any renderer source code, directive code, or caching code.** You are testing the template language's BEHAVIOR, not its implementation. Write tests as a user of the framework would — define a component, render it, change data, assert the DOM updated.

**Your assignment: `{{GROUP}}`**
Write tests for this nesting structure: `{{STRUCTURE}}`

**Test pattern for EACH test case:**
1. Define an isolated component with `defineComponent({ tagName, template, createComponent, defaultState })`
2. Use a unique tag name via a counter: `test-{{group}}-${++counter}`
3. Create the element, append to `document.body`, `await el.updateComplete`
4. Assert initial render is correct via `el.shadowRoot.innerHTML`
5. Mutate data (change a Signal via `el.template.state.xxx.set()` or `.toggle()` or `.increment()`)
6. Call `await waitForUpdate(el)` — this lets microtasks process naturally and waits for Lit render. Do NOT use `Reaction.flush()`.
7. Assert the DOM updated correctly

**Two data scenarios per nesting structure:**
- **Reactive data**: The inner expression reads a Signal (directly or through a function that reads a Signal). Mutation is via `signal.set()`.
- **Non-reactive data**: The inner expression reads a plain object property. The parent block provides new objects on re-render (triggered by a Signal the parent tracks). The inner content must reflect the new plain data.

**Helper function to include at top of file:**
```javascript
import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';

let tagCounter = 0;
function uniqueTag(prefix) {
  return `${prefix}-${++tagCounter}`;
}

function shadowText(el) {
  return el.shadowRoot.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim();
}

// Wait for natural update cycle — DO NOT use Reaction.flush()
async function waitForUpdate(el) {
  await el.updateComplete;
  await new Promise(r => setTimeout(r, 0));
  await el.updateComplete;
}
```

**Write the test file to:** `/home/jack/semantic/next/packages/renderer/test/browser/subtree-{{group}}.test.js`

**Important:**
- One `describe` block per nesting pattern
- One `it` for reactive data, one `it` for non-reactive data
- Keep templates minimal — just enough structure to test the nesting
- Use `beforeEach(() => { document.body.innerHTML = ''; })` for cleanup
- Async functions that need signal tracking must read the signal BEFORE the first `await` (use default parameters)
- For non-reactive tests: the parent block's function returns NEW objects each time (not mutated-in-place), triggered by a Signal the function reads
