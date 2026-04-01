/*
  Lightweight console-based performance tracing.
  Opt-in via globalThis.__SUI_TRACE__ = true

  Usage:
    const done = trace('hydrate:nav-menu');
    // ... work ...
    done(); // logs: [sui] hydrate:nav-menu 12.3ms
*/

export function trace(name) {
  if (!globalThis.__SUI_TRACE__) { return noop; }
  const t0 = performance.now();
  return () => {
    console.log(`[sui] ${name} ${(performance.now() - t0).toFixed(1)}ms`);
  };
}

function noop() {}
