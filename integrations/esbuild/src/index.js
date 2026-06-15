/*
  esbuild plugin for Semantic UI.

  The esbuild entry of @semantic-ui/build. Adds the ?raw and ?ast import
  suffixes components use for their templates and styles.
*/

import { semanticUI } from '@semantic-ui/build';

export default semanticUI.esbuild;
