/*
  Rollup plugin for Semantic UI.

  The Rollup entry of @semantic-ui/build. Also drives Rolldown and Vite 8
  through their Rollup-compatible plugin API. Adds the ?raw and ?ast import
  suffixes for component templates and styles.
*/

import { semanticUI } from '@semantic-ui/build';

export default semanticUI.rollup;
