/*
  Shared test configuration for renderer tests.
  Both engines run the same behavioral test suite.
  Importing LitRenderer triggers side-effect registration of the Lit engine.
*/
// Side-effect import: register Lit engine so both engines are available in tests
import '../../../../packages/component/src/engines/lit/register.js';

export const RENDERING_ENGINES = ['lit', 'native'];
