/*
  Shared test configuration for renderer tests.
  Both engines run the same behavioral test suite.
  Importing LitRenderer triggers side-effect registration of the Lit engine.
*/
import { LitRenderer } from '@semantic-ui/component';

export const RENDERING_ENGINES = ['lit', 'native'];
