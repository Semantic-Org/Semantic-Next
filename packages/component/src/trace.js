/*
  Lightweight performance tracing for hydration and rendering.
  Calls are always marked on the flame chart via performance.mark/measure.
  Console logging is opt-in: globalThis.__SUI_TRACE__ = true
*/

export function trace(fn, name) {
  const label = `sui:${name || fn.name || 'anonymous'}`;
  performance.mark(label);
  const result = fn();
  const measure = performance.measure(label, label);
  if (globalThis.__SUI_TRACE__) {
    console.log(`[sui] ${label} ${measure.duration.toFixed(1)}ms`);
  }
  return result;
}
