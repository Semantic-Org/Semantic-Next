import { SpecReader } from '../../spec-reader.js';
import LabelSpec from './label.json';

const reader = new SpecReader();

const LabelComponentSpec = reader.getWebComponentSpec(LabelSpec);

export default LabelSpec;

export { LabelComponentSpec, LabelSpec };
