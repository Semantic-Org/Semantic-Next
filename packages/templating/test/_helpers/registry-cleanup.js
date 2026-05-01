// Registry cleanup for Template tests.
//
// `Template.renderedTemplates` is a static Map keyed by `templateName`. Any
// Template that runs `onCreated` adds itself; `onDestroyed` removes itself.
// Tests that don't run a complete lifecycle (e.g., assertion-only tests, or
// tests that throw mid-flow) leak registry entries into subsequent tests.
//
// `Template.templateCount` is the auto-name counter for anonymous templates.
// Tests that assert specific anonymous names (e.g., "Anonymous #3") must
// reset this between runs.
//
// Usage:
//   import { clearTemplateRegistry } from '../_helpers/registry-cleanup.js';
//   afterEach(() => clearTemplateRegistry());

import { Template } from '../../src/template.js';

/**
 * Clear the global Template registry and anonymous-name counter.
 * Safe to call in afterEach hooks.
 */
export function clearTemplateRegistry() {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
}

/**
 * Snapshot the registry state. Useful for tests that want to assert
 * registry size/contents at multiple points.
 *
 * @returns {{ size: number, names: string[], counts: object }}
 */
export function snapshotRegistry() {
  const names = [...Template.renderedTemplates.keys()];
  const counts = {};
  for (const name of names) {
    counts[name] = Template.renderedTemplates.get(name).length;
  }
  return {
    size: names.length,
    names,
    counts,
    totalInstances: Object.values(counts).reduce((s, n) => s + n, 0),
  };
}

/**
 * Assert the registry is empty. Throws if not. Useful as a test-end check
 * to catch leaks immediately rather than letting them surface in the next
 * test's assertions.
 */
export function assertRegistryEmpty() {
  const snap = snapshotRegistry();
  if (snap.totalInstances !== 0) {
    throw new Error(
      `Template registry leaked: ${snap.totalInstances} instances across ${snap.size} names. `
        + `Names: ${JSON.stringify(snap.counts)}. `
        + `Did onDestroyed fire for all created Templates?`,
    );
  }
}
