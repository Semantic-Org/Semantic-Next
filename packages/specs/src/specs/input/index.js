import { SpecReader } from '../../spec-reader.js';
import InputSpec from './input.json';

const reader = new SpecReader();

const InputComponentSpec = reader.getWebComponentSpec(InputSpec);

export default InputSpec;

export {
  InputSpec,
  InputComponentSpec,
};
