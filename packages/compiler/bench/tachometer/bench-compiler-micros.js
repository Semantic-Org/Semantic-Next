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

/*******************************
      Parse cold
*******************************/

// Realistic component shape — card with header/body/footer, attribute
// interpolation, a conditional block, a list block, and event/property
// bindings. Fresh TemplateCompiler instance per iter so each compile()
// hits the full parse path. The compiler has no AST cache: every parse
// runs the StringScanner + tag-recognition loop end to end, so the
// "cold" framing is just clarifying that this measures fresh-parse work.
{
  const parseColdTemplate = `<article class="card card-{variant}" data-id="{id}">
    <header class="card-header">
      <h2 class="title">{title}</h2>
      <span class="badge {classIf isNew 'is-new'}">{count}</span>
    </header>
    <section class="card-body">
      <p class="lead">{lead}</p>
      {#if hasDescription}
        <p class="description">{description}</p>
      {/if}
    </section>
    <footer class="card-footer">
      <button class="btn btn-{variant}" disabled={busy} @click={onSubmit}>{label}</button>
      {#each action in actions}
        <a class="action" href="{action.href}">{action.label}</a>
      {/each}
    </footer>
  </article>`;

  // purpose: Compiles a realistic card template 500 times to measure full fresh-parse throughput end to end.
  performance.mark(startMark('micro-compiler-parse-cold-500'));
  for (let i = 0; i < 500; i++) {
    new TemplateCompiler(parseColdTemplate).compile();
  }
  performance.measure('micro-compiler-parse-cold-500', startMark('micro-compiler-parse-cold-500'));
}

/*******************************
      AST walk (optimizeAST)
*******************************/

// Realistic 20-card grid — yields a ~480-node top-level AST with html
// siblings to merge, snippet hoisting, and nested if/each blocks that
// recurse. optimizeAST is the only public AST-traversal pass: it merges
// adjacent html nodes, hoists snippets, recurses into block content,
// and disambiguates duplicate template calls. Pre-built AST so the
// timed loop isolates the walk; calling on already-optimized input is
// idempotent for the merge pass but still walks every node and rebuilds
// nested content arrays — representative of one full traversal.
{
  const astWalkCard = `<article class="card card-{variant}" data-id="{id}">
    <header class="card-header">
      <h2 class="title">{title}</h2>
      <span class="badge {classIf isNew 'is-new'}">{count}</span>
    </header>
    <section class="card-body">
      <p class="lead">{lead}</p>
      {#if hasDescription}
        <p class="description">{description}</p>
      {/if}
    </section>
    <footer class="card-footer">
      <button class="btn btn-{variant}" disabled={busy} @click={onSubmit}>{label}</button>
      {#each action in actions}
        <a class="action" href="{action.href}">{action.label}</a>
      {/each}
    </footer>
  </article>`;
  let astWalkSource = '';
  for (let i = 0; i < 20; i++) {
    astWalkSource += astWalkCard;
  }
  const astWalkAST = new TemplateCompiler(astWalkSource).compile();

  // purpose: Walks a 20-card AST through optimizeAST 2000 times to isolate the merge, hoist, and recurse pass cost.
  performance.mark(startMark('micro-compiler-ast-walk-2k'));
  for (let i = 0; i < 2_000; i++) {
    TemplateCompiler.optimizeAST(astWalkAST);
  }
  performance.measure('micro-compiler-ast-walk-2k', startMark('micro-compiler-ast-walk-2k'));
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

  // purpose: Parses four representative subtemplate-call shapes 5000 times each to measure snippet args extraction throughput.
  performance.mark(startMark('micro-compiler-snippet-args-5k'));
  for (let i = 0; i < 5_000; i++) {
    snippetArgsCompiler.parseTemplateString(snippetArgsExprs[0]);
    snippetArgsCompiler.parseTemplateString(snippetArgsExprs[1]);
    snippetArgsCompiler.parseTemplateString(snippetArgsExprs[2]);
    snippetArgsCompiler.parseTemplateString(snippetArgsExprs[3]);
  }
  performance.measure('micro-compiler-snippet-args-5k', startMark('micro-compiler-snippet-args-5k'));
}

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach((m) => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
