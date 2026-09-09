import { getEngine, registerEngine, Renderer } from '@semantic-ui/renderer';

import { IS_NATIVE_ENGINE } from '../../helpers/identity.js';
import { createComponent } from './factory.js';

// a bundle per entry carries its own copy of this module. a second copy adopts the engine
// the first registered, so the server entry's serverRenderer lands on the object
// defineComponent reads in either load order. an engine under this name from anywhere
// else still gives way, the registry's replace-last contract
const registered = getEngine('native');
const NativeEngine = registered?.[IS_NATIVE_ENGINE]
  ? registered
  : { [IS_NATIVE_ENGINE]: true, renderer: Renderer, factory: createComponent };
registerEngine('native', NativeEngine);

export { NativeEngine };
