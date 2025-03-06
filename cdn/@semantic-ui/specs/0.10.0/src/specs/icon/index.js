import { SpecReader } from '@semantic-ui/specs';
import IconSpec from './icon.json';
const reader = new SpecReader();
const IconComponentSpec = reader.getWebComponentSpec(IconSpec);

export default IconSpec;

export {
  IconSpec,
  IconComponentSpec
};
