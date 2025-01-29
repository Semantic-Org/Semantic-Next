import { SpecReader } from '@semantic-ui/specs';
import LabelSpec from './label.json';

const reader = new SpecReader();

const LabelComponentSpec = reader.getWebComponentSpec(LabelSpec);

export default LabelSpec;

export {
  LabelSpec,
  LabelComponentSpec,
};
