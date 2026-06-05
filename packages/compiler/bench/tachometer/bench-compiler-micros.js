/*
  Compiler hot-path micros. Per-file isolation benches that catch
  sub-noise-floor regressions on PRs touching the template compiler. The
  macro suite shifts only 2-3% on a 20% regression in compile cost —
  below the resolution floor since compile is one-shot per template
  definition. Per-file micros surface those.

  No cache layer exists in the compiler today (every parse runs the full
  StringScanner + tag-recognition loop), so the "cold" framing on parse
  just clarifies that the work measured is the canonical fresh-parse
  path. Consumers like defineComponent cache the resulting AST externally.
*/

import { TemplateCompiler } from '@semantic-ui/compiler';

const startMark = (name) => `${name}-start`;

// Collect between ops so each one measures on a freed heap, not the old-space
// the previous op grew. Runs after every performance.measure, never inside a
// measured region.
function settle() {
  if (globalThis.gc) {
    try {
      globalThis.gc({ type: 'major', execution: 'sync', flavor: 'last-resort' });
    }
    catch {
      globalThis.gc();
    }
  }
}

/*******************************
      Fixtures
*******************************/

// Normal component shape — a TodoMVC-style list with header/main/footer,
// nested if + each blocks, helper calls, attribute interpolation, and
// data attributes. This is what a real-world component looks like in
// production. Compile time on this shape is the headline signal — many
// users compile at runtime in the browser (CDN-loaded, agentic VMs),
// so faster parse here translates directly to faster page-time-to-
// interactive. Class names follow the repo's semantic / role-based
// convention (header, list, footer, item, action) — purpose, not
// implementation.
const normalTemplate = `<div class="todo-app">
  <header class="header">
    <h1 class="title">Todos</h1>
    <input class="input" placeholder="What needs doing?" />
  </header>
  {#if hasTodos}
    <ul class="list">
      {#each todo in filteredTodos}
        <li class="todo {classMap {completed: todo.completed}}">
          <input class="toggle" type="checkbox" checked={todo.completed} data-id="{todo.id}" />
          <label data-id="{todo.id}">{todo.title}</label>
          <button class="destroy" data-id="{todo.id}"></button>
        </li>
      {/each}
    </ul>
    <footer class="footer">
      <span class="count">{activeCount} {maybePlural activeCount 'item'} left</span>
      {#if hasCompleted}
        <button class="clear">Clear completed</button>
      {/if}
    </footer>
  {/if}
</div>`;

// Kitchen-sink card. Exercises every block type the parser handles
// (#if/else if/else, #each/else with custom index, #snippet + invoke,
// #async/loading/error, slot) plus mixed expression styles, helper
// calls, and event/property bindings. Used as the edge-case stress
// test for parse + walk on a complex tree — catches regressions that
// only surface under feature-dense templates.
const kitchenSinkTemplate = `<article class="card">
  <header class="header">
    <h2 class="title">{title}</h2>
    {#if hasBadge}
      <span class="badge">{count} {maybePlural count 'item'}</span>
    {/if}
  </header>

  <section class="body">
    {#if isLoading}
      <p class="loading">Loading…</p>
    {else if hasError}
      <p class="error">{errorMessage}</p>
    {else}
      <p class="description">{lead}</p>
      {#snippet itemRow}
        <div class="item {activeIf is index selectedIndex}" data-index="{index}">
          <span class="label">{label}</span>
          <span class="meta">{formatDate date 'MMM YYYY'}</span>
        </div>
      {/snippet}
      {#each item, i in items}
        {>itemRow label=item.label date=item.date index=i}
      {else}
        <div class="empty">No items yet</div>
      {/each}
    {/if}
  </section>

  <footer class="footer">
    <div class="actions">
      <button class="save" disabled={isBusy} @click={onSave}>Save</button>
      <button class="cancel" @click={onCancel}>Cancel</button>
    </div>
    {#async getStatus as status}
      <span class="status">{status}</span>
    {loading}
      <span class="loading">…</span>
    {error as e}
      <span class="error">{e.message}</span>
    {/async}
    {>slot extras}
  </footer>
</article>`;

/*******************************
      Parse cold — normal
*******************************/

// Headline signal for compile cost. Many users compile at runtime in the
// browser (CDN, agentic VMs), so parse throughput on a realistic
// component shape is the number that translates to page interactivity.
// Fresh TemplateCompiler instance per iter so each compile() hits the
// full parse path.
{
  // purpose: Compiles a TodoMVC-style component template 500 times. Headline metric for normal-component compile throughput.
  performance.mark(startMark('parse-cold-normal-500'));
  for (let i = 0; i < 500; i++) {
    new TemplateCompiler(normalTemplate).compile();
  }
  performance.measure('parse-cold-normal-500', startMark('parse-cold-normal-500'));
  settle();
}

/*******************************
      Parse cold — complex
*******************************/

// Edge-case stress test on a feature-dense template. Catches parser
// regressions on uncommon block paths (#async, deep nesting, snippet
// hoisting, slot) that don't show up in the normal-shape headline.
{
  // purpose: Compiles a feature-dense kitchen-sink template 200 times. Catches parser regressions on uncommon block paths.
  performance.mark(startMark('parse-cold-complex-200'));
  for (let i = 0; i < 200; i++) {
    new TemplateCompiler(kitchenSinkTemplate).compile();
  }
  performance.measure('parse-cold-complex-200', startMark('parse-cold-complex-200'));
  settle();
}

/*******************************
      AST walk (optimizeAST)
*******************************/

// Pre-built kitchen-sink AST so the timed loop isolates the walk.
// optimizeAST is the only public AST-traversal pass: it merges adjacent
// html nodes, hoists snippets, recurses into block content (#if/#each/
// #async/#snippet), and disambiguates duplicate template calls. Calling
// on already-optimized input is idempotent for the merge pass but still
// walks every node and rebuilds nested content arrays — representative
// of one full traversal of a complex tree.
{
  const astWalkAST = new TemplateCompiler(kitchenSinkTemplate).compile();

  // purpose: Walks a kitchen-sink AST through optimizeAST 15000 times. Merge, hoist, and recurse pass.
  performance.mark(startMark('ast-walk-15k'));
  for (let i = 0; i < 15_000; i++) {
    TemplateCompiler.optimizeAST(astWalkAST);
  }
  performance.measure('ast-walk-15k', startMark('ast-walk-15k'));
  settle();
}

/*******************************
      Snippet args extraction
*******************************/

// parseTemplateString is the shared parser for {>name k=v ...} and the
// verbose {>template name=... reactiveData={...}} forms — covers both
// snippet calls and subtemplate calls. Mix of shapes per iter so V8
// sees the full distribution: standard shorthand with multiple data
// args, standard shorthand with quoted strings, name-only, and verbose
// notation with nested object literal. Same compiler instance across
// iters since regex state is reset internally per call.
{
  const snippetArgsCompiler = new TemplateCompiler();
  const snippetArgsExprs = [
    'listItem id=item.id title=item.title completed=item.completed author=item.author date=item.date',
    "card name=card variant='primary' size='large' disabled=isBusy",
    'simpleItem',
    "template name=fancyCard reactiveData={a: 'one', b: two, c: 'three'}",
  ];

  // purpose: Parses four representative subtemplate-call shapes 5000 times each. Snippet args extraction.
  performance.mark(startMark('snippet-args-5k'));
  for (let i = 0; i < 5_000; i++) {
    snippetArgsCompiler.parseTemplateString(snippetArgsExprs[0]);
    snippetArgsCompiler.parseTemplateString(snippetArgsExprs[1]);
    snippetArgsCompiler.parseTemplateString(snippetArgsExprs[2]);
    snippetArgsCompiler.parseTemplateString(snippetArgsExprs[3]);
  }
  performance.measure('snippet-args-5k', startMark('snippet-args-5k'));
  settle();
}

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach((m) => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
