/*
  Shared test configuration for renderer tests.
  Both engines run the same behavioral test suite.
  Importing LitEngine triggers side-effect registration of the Lit engine.
*/
// Side-effect import: register Lit engine so both engines are available in tests
import '../../../../packages/component/src/engines/lit/register.js';

export const RENDERING_ENGINES = ['lit', 'native'];

/*
  Engine-agnostic wait for update.
  Both engines expose el.updateComplete — Lit natively,
  native via a getter that resolves after pending microtasks drain.
*/
export async function waitForUpdate(el) {
  await el.updateComplete;
}
