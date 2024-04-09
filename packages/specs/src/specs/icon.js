import { SpecReader } from '../spec-reader.js';
import IconSpec from './icon.json';
const reader = new SpecReader();
const IconComponentSpec = reader.getWebComponentSpec(IconSpec);

export default IconSpec;

export {
  IconSpec,
  IconComponentSpec
};
