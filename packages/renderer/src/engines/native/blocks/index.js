/*

  Block registration entrypoint. Imported for side effects from renderer.js
  so every registered block is available in the registry at first dispatch.
  Order doesn't matter — each block file registers under its own node.type.

  Individual block imports are added here as each construct converts from
  the monolithic renderer.js switch to the defineBlock shape.

*/

import './rerender.js';
import './conditional.js';
import './async.js';
