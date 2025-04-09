import { SpecReader } from '../../spec-reader.js';
import IconSpec from './icon.json' with { type: 'json' };
const reader = new SpecReader();
const IconComponentSpec = reader.getWebComponentSpec(IconSpec);

export default IconSpec;

export { IconComponentSpec, IconSpec };
