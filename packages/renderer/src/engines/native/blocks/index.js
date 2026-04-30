/*

  Block registration entrypoint. Imported for side effects from renderer.js
  so every registered block is available in the registry at first dispatch.
  Order doesn't matter — each block file registers under its own node.type.

*/

import './rerender.js';
import './conditional.js';
import './async.js';
import './each.js';
import './template.js';
